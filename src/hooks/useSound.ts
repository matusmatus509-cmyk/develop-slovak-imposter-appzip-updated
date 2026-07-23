/**
 * useSound — Web Audio API sound effects, zero dependencies, offline-capable.
 *
 * Sounds:
 *   tap          – soft UI click (every button)
 *   tick         – countdown tick (last 10 s)
 *   alarm        – time's up bell
 *   applause     – clapping burst (win / team win)
 *   win          – ascending fanfare (players caught impostors)
 *   lose         – descending stab (impostor won)
 *   buzzer       – loud game-show buzzer
 */

type SoundName = "tap" | "tick" | "alarm" | "applause" | "win" | "lose" | "buzzer";

let _ctx: AudioContext | null = null;

function ctx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext();
  // Resume on first user gesture — browsers suspend on load
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

function gain(ac: AudioContext, value: number): GainNode {
  const g = ac.createGain();
  g.gain.setValueAtTime(value, ac.currentTime);
  return g;
}

// ── Individual sounds ────────────────────────────────────────────────────────

function playTap() {
  const ac = ctx();
  const osc = ac.createOscillator();
  const g = gain(ac, 0.18);
  osc.type = "sine";
  osc.frequency.setValueAtTime(620, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(480, ac.currentTime + 0.045);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.075);
  osc.connect(g).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + 0.08);
}

function playTick() {
  const ac = ctx();
  const osc = ac.createOscillator();
  const g = gain(ac, 0.22);
  osc.type = "square";
  osc.frequency.setValueAtTime(880, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.055);
  osc.connect(g).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + 0.06);
}

function playAlarm() {
  const ac = ctx();
  // Three rising beeps
  [0, 0.18, 0.36].forEach((offset, i) => {
    const osc = ac.createOscillator();
    const g = gain(ac, 0.28);
    osc.type = "sawtooth";
    const freq = 660 + i * 110;
    osc.frequency.setValueAtTime(freq, ac.currentTime + offset);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.4, ac.currentTime + offset + 0.13);
    g.gain.setValueAtTime(0.28, ac.currentTime + offset);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + offset + 0.15);
    osc.connect(g).connect(ac.destination);
    osc.start(ac.currentTime + offset);
    osc.stop(ac.currentTime + offset + 0.16);
  });
}

function playApplause() {
  const ac = ctx();
  // White-noise burst shaped like applause (short clapping rhythm)
  const bufLen = ac.sampleRate * 1.6;
  const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) {
    // Amplitude envelope: fast attack + slow decay
    const env = Math.min(i / (ac.sampleRate * 0.06), 1) * Math.exp(-i / (ac.sampleRate * 0.55));
    data[i] = (Math.random() * 2 - 1) * env;
  }
  const src = ac.createBufferSource();
  src.buffer = buf;
  const g = gain(ac, 0.55);
  // Gentle hi-pass to sound like clapping
  const filter = ac.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1200;
  src.connect(filter).connect(g).connect(ac.destination);
  src.start();

  // Short tonal chord on top for celebratory feel
  [[523, 0], [659, 0.04], [784, 0.08], [1047, 0.14]].forEach(([freq, delay]) => {
    const o = ac.createOscillator();
    const og = gain(ac, 0.06);
    o.type = "sine";
    o.frequency.value = freq;
    og.gain.setValueAtTime(0.06, ac.currentTime + delay);
    og.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + delay + 0.45);
    o.connect(og).connect(ac.destination);
    o.start(ac.currentTime + delay);
    o.stop(ac.currentTime + delay + 0.5);
  });
}

function playWin() {
  const ac = ctx();
  // Ascending fanfare: C E G C (major arpeggio)
  [[523, 0], [659, 0.14], [784, 0.28], [1047, 0.42]].forEach(([freq, delay]) => {
    const osc = ac.createOscillator();
    const g = gain(ac, 0.22);
    osc.type = "triangle";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.22, ac.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + delay + 0.38);
    osc.connect(g).connect(ac.destination);
    osc.start(ac.currentTime + delay);
    osc.stop(ac.currentTime + delay + 0.4);
  });
  // Follow with noise burst
  setTimeout(playApplause, 620);
}

function playLose() {
  const ac = ctx();
  // Descending tritone stab
  [[392, 0], [294, 0.18], [220, 0.36]].forEach(([freq, delay]) => {
    const osc = ac.createOscillator();
    const g = gain(ac, 0.25);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.75, ac.currentTime + delay + 0.22);
    g.gain.setValueAtTime(0.25, ac.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + delay + 0.25);
    osc.connect(g).connect(ac.destination);
    osc.start(ac.currentTime + delay);
    osc.stop(ac.currentTime + delay + 0.28);
  });
}

function playBuzzer() {
  const ac = ctx();
  // Classic game-show buzzer: rough square wave at ~200 Hz for 0.4 s
  const osc = ac.createOscillator();
  const g = gain(ac, 0.35);
  osc.type = "square";
  osc.frequency.setValueAtTime(200, ac.currentTime);
  osc.frequency.linearRampToValueAtTime(160, ac.currentTime + 0.35);
  g.gain.setValueAtTime(0.35, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.4);
  osc.connect(g).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + 0.42);
}

// ── Public hook ───────────────────────────────────────────────────────────────

const SOUNDS: Record<SoundName, () => void> = {
  tap: playTap,
  tick: playTick,
  alarm: playAlarm,
  applause: playApplause,
  win: playWin,
  lose: playLose,
  buzzer: playBuzzer,
};

export function useSound() {
  function play(name: SoundName) {
    try {
      SOUNDS[name]();
    } catch {
      // AudioContext not available (e.g. SSR / test env) — silently ignore
    }
  }

  return { play };
}

export type { SoundName };
