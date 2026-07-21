import { useEffect, useMemo, useState } from "react";
import { TEAM_COLORS, shuffle } from "../../data/teamBattle";
import { FORBIDDEN_CARDS, SONG_TITLES } from "../../data/teamBattleExtras";
import { CircularTimer, PartyBackdrop, PartyEyebrow } from "./PartyChrome";

type PassMode = "zakazane" | "pesnicka";
type Phase = "ready" | "playing" | "team-result";

const MODE_COPY = {
  zakazane: {
    eyebrow: "Zakázané slovo",
    icon: "🚫",
    title: "Vysvetľuj bez zakázaných slov",
    instruction: "Jeden hráč opisuje hlavné slovo. Nesmie použiť žiadne zo štyroch slov na karte ani ich odvodeniny.",
    correct: "Uhádnuté",
    result: "uhádnutých slov",
    accent: "#fb7185",
  },
  pesnicka: {
    eyebrow: "Uhádni pesničku",
    icon: "🎵",
    title: "Zahmkaj melódiu bez slov",
    instruction: "Názov vidí iba hráč s mobilom. Zahmká melódiu bez textu a jeho tím háda názov pesničky.",
    correct: "Uhádnutá",
    result: "uhádnutých piesní",
    accent: "#a78bfa",
  },
} as const;

export function ForbiddenWordGame(props: SharedProps) {
  return <PassAndPlay mode="zakazane" {...props} />;
}

export function GuessSongGame(props: SharedProps) {
  return <PassAndPlay mode="pesnicka" {...props} />;
}

interface SharedProps {
  teamNames: [string, string];
  timeSeconds: number;
  onDone: (scores: [number, number]) => void;
}

function PassAndPlay({ teamNames, timeSeconds, onDone, mode }: SharedProps & { mode: PassMode }) {
  const copy = MODE_COPY[mode];
  const [team, setTeam] = useState<0 | 1>(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [timeLeft, setTimeLeft] = useState(timeSeconds);
  const [index, setIndex] = useState(0);
  const [turnScore, setTurnScore] = useState(0);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [blue, red] = TEAM_COLORS;
  const teamColor = team === 0 ? blue : red;
  const deck = useMemo(
    () => mode === "zakazane" ? shuffle(FORBIDDEN_CARDS) : shuffle(SONG_TITLES),
    [mode, team],
  );

  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      setPhase("team-result");
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [phase, timeLeft]);

  function startTurn() {
    setIndex(0);
    setTurnScore(0);
    setTimeLeft(timeSeconds);
    setPhase("playing");
  }

  function nextCard(correct: boolean) {
    if (correct) setTurnScore((value) => value + 1);
    setIndex((value) => (value + 1) % deck.length);
    navigator.vibrate?.(correct ? 30 : 12);
  }

  function continueAfterResult() {
    const nextScores: [number, number] = [...scores] as [number, number];
    nextScores[team] = turnScore;
    setScores(nextScores);
    if (team === 0) {
      setTeam(1);
      setPhase("ready");
    } else {
      onDone(nextScores);
    }
  }

  if (phase === "ready") {
    return (
      <PartyBackdrop>
        <main className="flex h-full flex-col items-center justify-center px-6 text-center">
          <PartyEyebrow>{copy.eyebrow}</PartyEyebrow>
          <div className="relative mt-7 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/15 bg-white/[0.07] text-5xl shadow-[0_22px_60px_rgba(0,0,0,.35)]">
            {copy.icon}
          </div>
          <p className="mt-7 text-[10px] font-black uppercase tracking-[0.25em] text-white/35">{team === 0 ? "Začína" : "Na rade je"}</p>
          <h1 className="mt-2 text-4xl font-black" style={{ color: teamColor }}>{teamNames[team]}</h1>
          <section className="party-glass mt-6 max-w-sm rounded-[1.8rem] p-5">
            <h2 className="text-lg font-black text-white">{copy.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/45">{copy.instruction}</p>
            {team === 1 && <p className="mt-3 text-xs font-bold text-white/30">{teamNames[0]} získal {scores[0]} bodov</p>}
          </section>
          <button
            onClick={startTurn}
            className="party-shine mt-7 w-full max-w-sm overflow-hidden rounded-2xl px-6 py-5 text-base font-black uppercase tracking-wider text-white shadow-xl transition active:scale-[.97]"
            style={{ background: `linear-gradient(135deg, ${teamColor}, ${copy.accent})` }}
          >
            Spustiť {timeSeconds} sekúnd
          </button>
        </main>
      </PartyBackdrop>
    );
  }

  if (phase === "team-result") {
    return (
      <PartyBackdrop>
        <main className="flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="text-6xl">{turnScore > 0 ? "🎉" : "⏱️"}</div>
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Výsledok tímu</p>
          <h1 className="mt-2 text-3xl font-black" style={{ color: teamColor }}>{teamNames[team]}</h1>
          <div className="party-glass mt-7 w-full max-w-xs rounded-[2rem] p-8">
            <p className="text-7xl font-black tabular-nums text-white">{turnScore}</p>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-white/35">{copy.result}</p>
          </div>
          <button
            onClick={continueAfterResult}
            className="party-shine mt-7 w-full max-w-xs overflow-hidden rounded-2xl px-6 py-5 text-base font-black text-white shadow-xl transition active:scale-[.97]"
            style={{ background: teamColor }}
          >
            {team === 0 ? `${teamNames[1]} na rad` : "Výsledok kola"}
          </button>
        </main>
      </PartyBackdrop>
    );
  }

  const card = mode === "zakazane" ? deck[index] as (typeof FORBIDDEN_CARDS)[number] : deck[index] as string;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: `radial-gradient(circle at 50% 28%, ${copy.accent}22, transparent 45%), #070711` }}>
      <div className="party-grid pointer-events-none absolute inset-0 opacity-20" />
      <header className="relative z-10 m-3 flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.055] px-4 py-3 backdrop-blur-xl">
        <div className="min-w-0 text-left">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Hrá tím</p>
          <p className="truncate text-base font-black" style={{ color: teamColor }}>{teamNames[team]}</p>
        </div>
        <CircularTimer value={timeLeft} total={timeSeconds} color={timeLeft <= 10 ? "#ef4444" : copy.accent} size={82} />
        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Body</p>
          <p className="text-3xl font-black tabular-nums text-white">{turnScore}</p>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-3 text-center">
        <section key={index} className="party-glass party-shine w-full max-w-md overflow-hidden rounded-[2.2rem] px-6 py-8" style={{ animation: "popIn .3s ease-out both" }}>
          <span className="text-4xl">{copy.icon}</span>
          {mode === "zakazane" && typeof card !== "string" ? (
            <>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-rose-300/65">Vysvetli slovo</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-white">{card.word}</h1>
              <div className="mt-6 rounded-[1.5rem] border border-rose-400/20 bg-rose-500/[0.09] p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-rose-300/60">Nesmieš povedať</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {card.forbidden.map((word) => <span key={word} className="rounded-xl bg-black/20 px-2 py-2 text-sm font-black text-white/70">{word}</span>)}
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-violet-300/65">Zahmkaj bez slov</p>
              <h1 className="mx-auto mt-3 max-w-sm text-3xl font-black leading-tight text-white">{card as string}</h1>
              <p className="mt-5 text-xs font-bold text-white/30">Mobil vidí iba hráč, ktorý hmkanie predvádza.</p>
            </>
          )}
        </section>
      </main>

      <footer className="relative z-10 flex shrink-0 gap-3 px-4 pb-7 pt-3">
        <button onClick={() => nextCard(false)} className="party-glass flex-1 rounded-2xl py-5 text-sm font-black text-white/55 transition active:scale-95">Preskočiť</button>
        <button onClick={() => nextCard(true)} className="party-shine flex-1 overflow-hidden rounded-2xl bg-emerald-600 py-5 text-sm font-black text-white shadow-lg transition active:scale-95">✓ {copy.correct} +1</button>
      </footer>
    </div>
  );
}
