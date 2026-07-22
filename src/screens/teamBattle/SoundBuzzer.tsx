import { useMemo, useRef, useState } from "react";
import soundArt from "../../assets/party-sound.svg";
import { TEAM_COLORS, shuffle } from "../../data/teamBattle";
import { SOUND_CLUES } from "../../data/teamBattleExtras";
import { PartyBackdrop, PartyEyebrow, TeamBadge } from "./PartyChrome";

type Phase = { type: "question" } | { type: "buzzed"; team: 0 | 1 } | { type: "revealed"; team: 0 | 1 };
const QUESTIONS_PER_ROUND = 10;

function playSyntheticSound(id: string) {
  const AudioContextClass = window.AudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const master = ctx.createGain();
  master.gain.value = 0.24;
  master.connect(ctx.destination);
  const now = ctx.currentTime + 0.04;

  const tone = (frequency: number, start: number, duration: number, type: OscillatorType = "sine", endFrequency?: number) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now + start);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + start + duration);
    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(0.7, now + start + Math.min(0.03, duration / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
    oscillator.connect(gain).connect(master);
    oscillator.start(now + start);
    oscillator.stop(now + start + duration);
  };

  const noise = (start: number, duration: number, pitch = 900, volume = 0.35) => {
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index++) data[index] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    filter.type = "lowpass";
    filter.frequency.value = pitch;
    gain.gain.setValueAtTime(volume, now + start);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
    source.buffer = buffer;
    source.connect(filter).connect(gain).connect(master);
    source.start(now + start);
  };

  switch (id) {
    case "engine": noise(0, 2.4, 280, .65); for (let i = 0; i < 9; i++) tone(65 + i * 4, i * .25, .3, "sawtooth", 85 + i * 4); break;
    case "cat": tone(650, 0, .55, "sine", 1050); tone(900, .55, .7, "sine", 500); tone(700, 1.5, .45, "sine", 1100); break;
    case "vacuum": noise(0, 2.6, 1300, .7); tone(115, 0, 2.6, "sawtooth", 125); break;
    case "can": noise(0, .12, 5000, .9); tone(1200, .08, .35, "triangle", 350); noise(.18, .8, 6000, .3); break;
    case "dog": for (const start of [0, .38, 1.1, 1.45]) { tone(260, start, .18, "square", 110); noise(start, .16, 700, .4); } break;
    case "rain": for (let i = 0; i < 18; i++) noise(i * .13, .12, 5000, .15); noise(0, 2.5, 2600, .25); break;
    case "siren": for (let i = 0; i < 4; i++) { tone(520, i * .55, .27, "sine", 940); tone(940, i * .55 + .27, .27, "sine", 520); } break;
    case "clock": for (let i = 0; i < 6; i++) { tone(i % 2 ? 900 : 1200, i * .42, .05, "square"); } break;
    case "doorbell": tone(660, 0, .65); tone(520, .7, .9); break;
    case "phone": for (let i = 0; i < 3; i++) { tone(700, i * .7, .25, "square"); tone(900, i * .7 + .25, .25, "square"); } break;
    case "train": tone(150, 0, 1.1, "sawtooth", 95); tone(190, 0, 1.1, "sine", 130); noise(1.1, 1.2, 450, .5); break;
    case "heartbeat": for (let i = 0; i < 3; i++) { tone(75, i * .72, .13, "sine", 45); tone(62, i * .72 + .18, .16, "sine", 40); } break;
    case "helicopter": for (let i = 0; i < 20; i++) noise(i * .11, .08, 230, .65); tone(85, 0, 2.3, "sawtooth"); break;
    case "microwave": tone(880, 0, .15); tone(880, .23, .15); tone(880, .46, .35); break;
    case "keyboard": for (let i = 0; i < 24; i++) noise(i * .075 + Math.random() * .03, .035, 5500, .45); break;
    case "camera": noise(0, .07, 4500, .6); tone(1400, .08, .08, "square"); noise(.18, .12, 2500, .8); break;
    case "alarm": for (let i = 0; i < 8; i++) tone(1050, i * .23, .14, "square"); break;
    case "wind": noise(0, 2.7, 1100, .55); tone(210, 0, 2.5, "sine", 330); break;
    case "laser": for (let i = 0; i < 5; i++) tone(1400, i * .35, .22, "sawtooth", 120); break;
    case "applause": for (let i = 0; i < 35; i++) noise(Math.random() * 2, .08, 3500, .3); break;
    case "horse": for (let i = 0; i < 8; i++) { tone(120, i * .28, .08, "triangle", 55); noise(i * .28, .07, 550, .4); } break;
    case "fire": noise(0, 2.5, 900, .35); for (let i = 0; i < 9; i++) noise(Math.random() * 2.2, .05, 4000, .6); break;
    case "bird": for (let i = 0; i < 7; i++) tone(1200 + Math.random() * 700, i * .3, .16, "sine", 1800 + Math.random() * 500); break;
    case "water": noise(0, 2.5, 2400, .45); for (let i = 0; i < 8; i++) tone(500 + Math.random() * 700, i * .3, .1, "sine"); break;
    default: tone(440, 0, .3); tone(660, .35, .3);
  }
  window.setTimeout(() => void ctx.close(), 3300);
}

export default function SoundBuzzer({ teamNames, onDone }: { teamNames: [string, string]; onDone: (scores: [number, number]) => void }) {
  const deck = useMemo(() => shuffle(SOUND_CLUES).slice(0, QUESTIONS_PER_ROUND), []);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [phase, setPhase] = useState<Phase>({ type: "question" });
  const [played, setPlayed] = useState(false);
  const audioLock = useRef(false);
  const [blue, red] = TEAM_COLORS;
  const clue = deck[questionIndex];

  function play() {
    if (audioLock.current) return;
    audioLock.current = true;
    setPlayed(true);
    playSyntheticSound(clue.id);
    window.setTimeout(() => { audioLock.current = false; }, 2900);
  }

  function resolve(correct: boolean) {
    if (phase.type !== "revealed") return;
    const scorer: 0 | 1 = correct ? phase.team : phase.team === 0 ? 1 : 0;
    const nextScores: [number, number] = [...scores] as [number, number];
    nextScores[scorer] += 1;
    setScores(nextScores);
    if (questionIndex + 1 >= deck.length) onDone(nextScores);
    else {
      setQuestionIndex((value) => value + 1);
      setPhase({ type: "question" });
      setPlayed(false);
    }
  }

  return (
    <PartyBackdrop>
      <main className="flex h-full flex-col overflow-y-auto px-4 pb-6 pt-5 text-center">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <div className="flex items-center gap-3">
            <TeamBadge name={teamNames[0]} score={scores[0]} color={blue} side="A" active={phase.type !== "question" && phase.team === 0} />
            <TeamBadge name={teamNames[1]} score={scores[1]} color={red} side="B" active={phase.type !== "question" && phase.team === 1} />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <PartyEyebrow>Uhádni zvuk</PartyEyebrow>
            <span className="text-[10px] font-black uppercase tracking-wider text-white/30">{questionIndex + 1}/{deck.length}</span>
          </div>

          <section className="party-glass relative mt-5 flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[2.2rem] px-6 py-8">
            <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
            <div className="relative h-44 w-full max-w-sm shrink-0 overflow-hidden rounded-[1.8rem] border border-cyan-300/20 shadow-[0_0_70px_rgba(34,211,238,.18)]">
              <img src={soundArt} alt="Ilustrácia zvukovej minihry" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07131b]/75 via-transparent to-cyan-400/10" />
              <button
                onClick={play}
                aria-label="Prehrať zvuk"
                className="party-shine absolute inset-0 flex items-center justify-center transition active:scale-95"
              >
                <span className={`flex h-24 w-24 items-center justify-center rounded-full border border-white/25 bg-black/35 text-5xl shadow-2xl backdrop-blur-md ${audioLock.current ? "animate-pulse" : ""}`}>{played ? "🔊" : "▶️"}</span>
              </button>
            </div>
            <h1 className="mt-6 text-2xl font-black text-white">
              {phase.type === "question" ? (played ? "Kto pozná tento zvuk?" : "Prehrajte tajný zvuk") : phase.type === "buzzed" ? `${teamNames[phase.team]} odpovedá` : clue.label}
            </h1>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/40">
              {phase.type === "question" ? "Zvuk môžete prehrať znova. Keď ho tím spozná, stlačí svoj bzučiak." : phase.type === "buzzed" ? "Tím povie odpoveď nahlas a moderátor potom odkryje správny zvuk." : `Správna odpoveď: ${clue.label}`}
            </p>
            {phase.type === "revealed" && <div className="mt-5 text-7xl">{clue.emoji}</div>}
          </section>

          <div className="mt-4">
            {phase.type === "question" && (
              <div className="grid grid-cols-2 gap-3">
                {([0, 1] as const).map((team) => {
                  const color = team === 0 ? blue : red;
                  return <button key={team} disabled={!played} onClick={() => setPhase({ type: "buzzed", team })} className="party-shine overflow-hidden rounded-2xl py-6 text-base font-black text-white shadow-xl transition active:scale-95 disabled:opacity-30" style={{ background: color }}>🔔<span className="mt-1 block text-sm">{teamNames[team]}</span></button>;
                })}
              </div>
            )}
            {phase.type === "buzzed" && (
              <button onClick={() => setPhase({ type: "revealed", team: phase.team })} className="party-shine w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 py-5 text-base font-black text-white shadow-xl transition active:scale-95">Ukázať správny zvuk</button>
            )}
            {phase.type === "revealed" && (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => resolve(false)} className="rounded-2xl bg-red-700 py-5 text-base font-black text-white transition active:scale-95">✕ Nesprávne</button>
                <button onClick={() => resolve(true)} className="rounded-2xl bg-emerald-600 py-5 text-base font-black text-white transition active:scale-95">✓ Správne</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </PartyBackdrop>
  );
}
