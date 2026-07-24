import { useEffect, useMemo, useState } from "react";
import { TEAM_COLORS } from "../../data/teamBattle";
import { PartyBackdrop, PartyEyebrow } from "./PartyChrome";

function Confetti() {
  const pieces = useMemo(
    () => Array.from({ length: 52 }, (_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.2}s`,
      color: ["#e879f9", "#60a5fa", "#f87171", "#fbbf24", "#34d399"][index % 5],
      size: `${5 + Math.random() * 8}px`,
      duration: `${2.4 + Math.random() * 1.8}s`,
      rotate: `${Math.random() * 180}deg`,
    })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute -top-6 rounded-sm"
          style={{
            left: piece.left,
            width: piece.size,
            height: `calc(${piece.size} * 1.7)`,
            background: piece.color,
            rotate: piece.rotate,
            animation: `confettiFall ${piece.duration} linear ${piece.delay} both`,
          }}
        />
      ))}
    </div>
  );
}

function useAnimatedScores(scores: [number, number], started: boolean) {
  const [displayScores, setDisplayScores] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayScores(scores);
      return;
    }

    const duration = 900;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScores([
        Math.round(scores[0] * eased),
        Math.round(scores[1] * eased),
      ]);
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [scores, started]);

  return displayScores;
}

export default function GameOver({
  teamNames,
  totalScores,
  onPlayAgain,
  onHome,
}: {
  teamNames: [string, string];
  totalScores: [number, number];
  onPlayAgain: () => void;
  onHome: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const displayScores = useAnimatedScores(totalScores, revealed);
  const [blue, red] = TEAM_COLORS;
  const colors: [string, string] = [blue, red];
  const isDraw = totalScores[0] === totalScores[1];
  const winner: 0 | 1 = totalScores[0] >= totalScores[1] ? 0 : 1;
  const difference = Math.abs(totalScores[0] - totalScores[1]);

  useEffect(() => {
    const revealTimeout = window.setTimeout(() => setRevealed(true), 350);
    const celebrationTimeout = window.setTimeout(() => setCelebrating(true), 1250);
    return () => {
      window.clearTimeout(revealTimeout);
      window.clearTimeout(celebrationTimeout);
    };
  }, []);

  return (
    <PartyBackdrop>
      {celebrating && !isDraw && <Confetti />}
      <main className="relative z-30 h-full overflow-y-auto px-5 pb-8 pt-10 text-center">
        <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center">
          <PartyEyebrow>Výsledky Party mode</PartyEyebrow>

          <section className={`mt-7 w-full transition-all duration-700 ${revealed ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-75 opacity-0"}`} aria-live="polite">
            <div className={`party-winner-trophy relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-amber-200/30 bg-gradient-to-br from-amber-300/25 via-fuchsia-500/15 to-violet-700/20 shadow-[0_0_75px_rgba(251,191,36,.25)] ${celebrating ? "is-celebrating" : ""}`}>
              <div className="absolute inset-2 rounded-full border border-dashed border-white/15 animate-spin [animation-duration:12s]" />
              <span className="relative text-6xl">{isDraw ? "🤝" : "🏆"}</span>
            </div>
            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-amber-300/70">
              {isDraw ? "Dokonalá remíza" : "Víťaz Party mode"}
            </p>
            <h1
              className="party-winner-name mt-2 text-4xl font-black tracking-tight text-white"
              style={!isDraw ? { color: colors[winner], textShadow: `0 0 34px ${colors[winner]}65` } : undefined}
            >
              {isDraw ? "Oba tímy víťazia!" : teamNames[winner]}
            </h1>
            <p className="mt-2 text-sm text-white/45">
              {isDraw ? "Dnes ste boli dokonale vyrovnaní." : `Vyhráva o ${difference} ${difference === 1 ? "bod" : "bodov"}.`}
            </p>
          </section>

          <section className="mt-8 grid w-full grid-cols-2 items-end gap-3" aria-label="Konečná tabuľka skóre">
            {([0, 1] as const).map((index) => {
              const won = !isDraw && winner === index;
              return (
                <div
                  key={index}
                  className={`party-glass party-podium relative overflow-visible rounded-[1.8rem] px-4 pb-6 pt-5 transition-all duration-700 ${won && celebrating ? "winner" : ""}`}
                  style={{
                    borderColor: `${colors[index]}${won ? "c0" : "45"}`,
                    boxShadow: won ? `0 22px 65px ${colors[index]}32` : undefined,
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  {won && <span className="party-winner-crown absolute -top-5 left-1/2 -translate-x-1/2 text-4xl">♛</span>}
                  <span
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-base font-black text-white"
                    style={{ background: colors[index], boxShadow: `0 0 25px ${colors[index]}66` }}
                  >
                    {index === 0 ? "A" : "B"}
                  </span>
                  <p className="mt-4 truncate text-xs font-black uppercase tracking-wider" style={{ color: colors[index] }}>{teamNames[index]}</p>
                  <p className="mt-2 text-5xl font-black tabular-nums text-white">{displayScores[index]}</p>
                  <p className="mt-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">bodov</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: revealed ? `${(totalScores[index] / Math.max(...totalScores, 1)) * 100}%` : "0%", background: colors[index] }}
                    />
                  </div>
                </div>
              );
            })}
          </section>

          <p className={`mt-6 text-[10px] font-black uppercase tracking-[0.22em] text-white/30 transition-opacity duration-500 ${celebrating ? "opacity-100" : "opacity-0"}`}>
            Finále je rozhodnuté · ďakujeme za hru
          </p>

          <div className="mt-auto w-full space-y-3 pt-8">
            <button
              type="button"
              onClick={onPlayAgain}
              className="party-shine relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-6 py-5 text-base font-black uppercase tracking-[0.07em] text-white shadow-[0_18px_50px_rgba(168,85,247,.35)] transition active:scale-[.97]"
            >
              Hrať odvetu
            </button>
            <button
              type="button"
              onClick={onHome}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-white/55 backdrop-blur-xl transition active:scale-[.97]"
            >
              Späť na domov
            </button>
          </div>
        </div>
      </main>
    </PartyBackdrop>
  );
}
