/**
 * Prehrávanie zvukov pre „Uhádni zvuk“ s vyrovnanou hlasitosťou.
 *
 * Nahrávky sú externé (Wikimedia Commons), takže sa nedajú upraviť priamo.
 * Každý zvuk preto nesie `gainDb` nameraný offline (EBU R128, cieľ −18 LUFS)
 * a korekcia sa aplikuje pri prehrávaní cez Web Audio:
 *
 *   <audio crossOrigin> → GainNode(gainDb) → ochranný limiter → výstup
 *
 * Limiter (DynamicsCompressorNode, pomer 20:1) sa uplatní len na krátke
 * špičky. Prah −4,5 dBFS je nižšie, než by stačilo, lebo limiter v prehliadači
 * pri rýchlych úderoch prekmitne o ~2–3 dB; po automatickom makeup gaine
 * (kompenzovanom nižšie) tak výstup nepresiahne 0 dBFS. Offline plán mu
 * nenechá viac než ~6 dB práce, takže nejde o agresívnu kompresiu.
 *
 * Ak prehliadač Web Audio nepodporuje alebo server nepovolí CORS, zvuk sa
 * prehrá obyčajným <audio> s hlasitosťou obmedzenou na 1 (zoslabenie funguje,
 * zosilnenie nie). Hra teda nikdy nezostane bez zvuku kvôli normalizácii.
 */

export const SOUND_BASE_VOLUME = 0.9;

export const SOUND_LIMITER = {
  threshold: -4.5,
  knee: 0,
  ratio: 20,
  attack: 0.003,
  release: 0.15,
} as const;

/**
 * DynamicsCompressorNode podľa špecifikácie Web Audio automaticky pridáva
 * makeup gain: (1 / fullRangeGain)^0.6, kde fullRangeGain je výstup krivky
 * pre vstup 0 dBFS. Pri tvrdom kolene je výstup threshold + (0 − threshold)/ratio.
 * Tento zisk odpočítame, aby výsledná hlasitosť sedela s offline meraním.
 */
export function limiterMakeupDb(
  threshold: number = SOUND_LIMITER.threshold,
  ratio: number = SOUND_LIMITER.ratio
): number {
  const fullRangeDb = threshold + (0 - threshold) / ratio;
  return -fullRangeDb * 0.6;
}

export function dbToLinear(db: number): number {
  return Math.pow(10, db / 20);
}

/** Lineárny zisk pre GainNode (Web Audio cesta). */
export function webAudioGain(gainDb: number | undefined): number {
  return SOUND_BASE_VOLUME * dbToLinear((gainDb ?? 0) - limiterMakeupDb());
}

/** Hlasitosť pre obyčajný <audio> element, ak Web Audio nie je k dispozícii. */
export function fallbackElementVolume(gainDb: number | undefined): number {
  return Math.min(1, SOUND_BASE_VOLUME * dbToLinear(gainDb ?? 0));
}

export interface SoundPlayback {
  audio: HTMLAudioElement;
  context: AudioContext | null;
}

type AudioContextConstructor = typeof AudioContext;

function audioContextConstructor(): AudioContextConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as typeof window & {
    webkitAudioContext?: AudioContextConstructor;
  };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

function applyStart(audio: HTMLAudioElement, startAt: number | undefined) {
  if (!startAt || startAt <= 0) return;
  try {
    audio.currentTime = startAt;
  } catch {
    /* niektoré prehliadače to dovolia až po načítaní metadát */
    audio.addEventListener(
      "loadedmetadata",
      () => {
        audio.currentTime = startAt;
      },
      { once: true }
    );
  }
}

function disposeContext(context: AudioContext | null) {
  if (context && context.state !== "closed")
    void context.close().catch(() => undefined);
}

/**
 * Spustí prehrávanie zvuku. Najprv skúsi Web Audio cestu s normalizáciou,
 * pri zlyhaní (CORS, nepodporované API) prejde na obyčajný <audio>.
 * Volajúci je zodpovedný za zastavenie (pause + context.close()).
 */
export async function startSoundClue(
  url: string,
  gainDb: number | undefined,
  startAt: number | undefined
): Promise<SoundPlayback> {
  const Ctor = audioContextConstructor();
  if (Ctor) {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.src = url;
    let context: AudioContext | null = null;
    try {
      context = new Ctor();
      const source = context.createMediaElementSource(audio);
      const gain = context.createGain();
      gain.gain.value = webAudioGain(gainDb);
      const limiter = context.createDynamicsCompressor();
      limiter.threshold.value = SOUND_LIMITER.threshold;
      limiter.knee.value = SOUND_LIMITER.knee;
      limiter.ratio.value = SOUND_LIMITER.ratio;
      limiter.attack.value = SOUND_LIMITER.attack;
      limiter.release.value = SOUND_LIMITER.release;
      source.connect(gain);
      gain.connect(limiter);
      limiter.connect(context.destination);
      await context.resume();
      applyStart(audio, startAt);
      await audio.play();
      return { audio, context };
    } catch {
      audio.pause();
      audio.removeAttribute("src");
      disposeContext(context);
    }
  }

  const audio = new Audio(url);
  audio.preload = "auto";
  audio.volume = fallbackElementVolume(gainDb);
  applyStart(audio, startAt);
  await audio.play();
  return { audio, context: null };
}
