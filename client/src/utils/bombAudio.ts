/**
 * Syntéza zvukov pre hru „Kto dostane bombu".
 *
 * Zámerne bez Reactu a bez DOM: tak sa dá celý zvuk vyrenderovať do
 * `OfflineAudioContext` a zmerať jeho obálku, namiesto aby sme sa spoliehali,
 * že „to asi hrá". Lifecycle (vytvorenie kontextu, stíšenie pri odchode) rieši
 * hook `useBombSound`.
 *
 * Zvuk je syntetizovaný, nie nahraný: projekt zámerne nemá lokálne binárne
 * assety a načítanie súboru z CDN by pri tiku vnieslo latenciu, ktorá rozbije
 * rytmus.
 */

/** Šum pre cvak aj výbuch. Vyrobí sa raz a znovu sa používa. */
export function createNoiseBuffer(
  context: BaseAudioContext,
  seconds = 2
): AudioBuffer {
  const length = Math.max(1, Math.floor(context.sampleRate * seconds));
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }
  return buffer;
}

/**
 * Jeden tik zápalnej šnúry.
 *
 * `tock` strieda dve výšky, takže to znie ako tik-tak hodín a nie ako opakovaný
 * identický klik. `heat` (0–1) tik pritvrdzuje — hlasitosť a jasnosť rastú.
 */
export function renderTick(
  context: BaseAudioContext,
  master: AudioNode,
  noise: AudioBuffer,
  { heat = 0, tock = false, at = context.currentTime } = {}
) {
  const level = 0.55 + Math.min(1, Math.max(0, heat)) * 0.45;

  // Kovový cvak — úzkopásmový šum s veľmi krátkym dozvukom.
  const click = context.createBufferSource();
  click.buffer = noise;
  const band = context.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = (tock ? 1850 : 2650) + heat * 450;
  band.Q.value = 1.7;
  const clickGain = context.createGain();
  clickGain.gain.setValueAtTime(0.0001, at);
  clickGain.gain.exponentialRampToValueAtTime(1.6 * level, at + 0.002);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.045);
  click.connect(band);
  band.connect(clickGain);
  clickGain.connect(master);
  // Posun v šume, aby dva tiky za sebou neboli bit-za-bit identické.
  click.start(at, tock ? 0.31 : 0.07, 0.07);

  // Telo tiku, aby cvak nebol iba syčanie.
  const body = context.createOscillator();
  const bodyGain = context.createGain();
  body.type = "triangle";
  body.frequency.setValueAtTime(tock ? 232 : 316, at);
  bodyGain.gain.setValueAtTime(0.0001, at);
  bodyGain.gain.exponentialRampToValueAtTime(0.34 * level, at + 0.004);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.055);
  body.connect(bodyGain);
  bodyGain.connect(master);
  body.start(at);
  body.stop(at + 0.07);

  const nodes = [click, band, clickGain, body, bodyGain];
  const release = () => nodes.forEach(node => node.disconnect());
  body.addEventListener("ended", release, { once: true });
  return { release, endsAt: at + 0.07 };
}

/** Výbuch: šumový záves s klesajúcim filtrom plus nízky náraz. */
export function renderExplosion(
  context: BaseAudioContext,
  master: AudioNode,
  noise: AudioBuffer,
  { at = context.currentTime } = {}
) {
  const blast = context.createBufferSource();
  blast.buffer = noise;
  const lowpass = context.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(2600, at);
  lowpass.frequency.exponentialRampToValueAtTime(140, at + 1.5);
  const blastGain = context.createGain();
  // Viacstupňový pokles, nie jedna rampa k nule. Jediná exponenciálna rampa
  // spadne na začiatku tak prudko, že z výbuchu zostane len prasknutie —
  // meranie ukázalo slyšaných 543 ms namiesto zamýšľanej sekundy a pol.
  blastGain.gain.setValueAtTime(0.0001, at);
  blastGain.gain.exponentialRampToValueAtTime(1, at + 0.015);
  blastGain.gain.exponentialRampToValueAtTime(0.4, at + 0.28);
  blastGain.gain.exponentialRampToValueAtTime(0.08, at + 0.9);
  blastGain.gain.exponentialRampToValueAtTime(0.0001, at + 1.9);
  blast.connect(lowpass);
  lowpass.connect(blastGain);
  blastGain.connect(master);
  blast.start(at, 0, 2);

  // Náraz — sínus padajúci pod hranicu sluchu dá výbuchu hmotnosť.
  const thump = context.createOscillator();
  const thumpGain = context.createGain();
  thump.type = "sine";
  // Nespadne až pod hranicu sluchu — pod 30 Hz už telefón nič nezahrá, takže by
  // sa rumbľanie len skrátilo.
  thump.frequency.setValueAtTime(112, at);
  thump.frequency.exponentialRampToValueAtTime(38, at + 1.1);
  thumpGain.gain.setValueAtTime(0.0001, at);
  thumpGain.gain.exponentialRampToValueAtTime(0.9, at + 0.025);
  thumpGain.gain.exponentialRampToValueAtTime(0.3, at + 0.4);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, at + 1.5);
  thump.connect(thumpGain);
  thumpGain.connect(master);
  thump.start(at);
  thump.stop(at + 1.55);

  const nodes = [blast, lowpass, blastGain, thump, thumpGain];
  const release = () => nodes.forEach(node => node.disconnect());
  thump.addEventListener("ended", release, { once: true });
  return { release, endsAt: at + 1.95 };
}

/** Hlasitosť celej hry na jednom mieste. */
export const BOMB_MASTER_GAIN = 0.34;
