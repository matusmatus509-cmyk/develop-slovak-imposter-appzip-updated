import { useEffect, useMemo, useState } from "react";
import { TEAM_COLORS } from "../../data/teamBattle";
import { PartyBackdrop, PartyEyebrow } from "./PartyChrome";
import { useSound } from "../../hooks/useSound";

function Confetti() {
  const pieces = useMemo(
    () => Array.from({ length: 34 }, (_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.8}s`,
      color: ["#e879f9", "#60a5fa", "#f87171", "#fbbf24", "#34d399"][index % 5],
      size: `${5 + Math.random() * 7}px`,
      duration: `${2.6 + Math.random() * 2}s`,
    })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute -top-5 rounded-sm"
          style={{
            left: piece.left,
            width: piece.size,
            height: `calc(${piece.size} * 1.7)`,
            background: piece.color,
            animation: `confettiFall ${piece.duration} linear ${piece.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
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
  const { play } = useSound();
  const [visible, setVisible] = useState(false);
  const [blue, red] = TEAM_COLORS;
  const colors = [blue, red];
  const isDraw = totalScores[0] === totalScores[1];
  const winner: 0 | 1 = totalScores[0] >= totalScores[1] ? 0 : 1;
  const difference = Math.abs(totalScores[0] - totalScores[1]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(true), 180);
    const soundTimeout = window.setTimeout(() => play(isDraw ? "applause" : "win"), 400);
    return () => {
      window.clearTimeout(timeout);
      window.clearTimeout(soundTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PartyBackdrop>
      {!isDraw && <Confetti />}
      <main className="relative z-30 h-full overflow-y-auto px-5 pb-8 pt-10 text-center">
        <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center">
          <PartyEyebrow>Finále Party Mode</PartyEyebrow>

          <section className={`mt-8 transition-all duration-700 ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-75 opacity-0"}`}>
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-amber-200/25 bg-gradient-to-br from-amber-300/25 via-fuchsia-500/15 to-violet-700/20 shadow-[0_0_75px_rgba(251,191,36,.25)]">
              <div className="absolute inset-2 rounded-full border border-dashed border-white/15 animate-spin [animation-duration:12s]" />
              <span className="relative text-6xl">{isDraw ? "🤝" : "🏆"}</span>
            </div>
            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-amber-300/70">
              {isDraw ? "Dokonalá remíza" : "Šampión večera"}
            </p>
            <h1
              className="mt-2 text-4xl font-black tracking-tight text-white"
              style={!isDraw ? { color: colors[winner], textShadow: `0 0 34px ${colors[winner]}65` } : undefined}
            >
              {isDraw ? "Oba tímy víťazia!" : teamNames[winner]}
            </h1>
            <p className="mt-2 text-sm text-white/40">
              {isDraw ? "Dnes ste boli dokonale vyrovnaní." : `Víťazstvo o ${difference} ${difference === 1 ? "bod" : "bodov"}.`}
            </p>
          </section>

          <section className="mt-8 grid w-full grid-cols-2 gap-3">
            {([0, 1] as const).map((index) => {
              const won = !isDraw && winner === index;
              return (
                <div
                  key={index}
                  className={`party-glass relative overflow-hidden rounded-[1.8rem] px-4 py-6 transition-all duration-500 ${won ? "-translate-y-2" : ""}`}
                  style={{ borderColor: `${colors[index]}${won ? "b0" : "45"}`, boxShadow: won ? `0 22px 60px ${colors[index]}28` : undefined }}
                >
                  {won && <span className="absolute right-3 top-3 text-xl">♛</span>}
                  <span
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-base font-black text-white"
                    style={{ background: colors[index], boxShadow: `0 0 25px ${colors[index]}66` }}
                  >
                    {index === 0 ? "A" : "B"}
                  </span>
                  <p className="mt-4 truncate text-xs font-black uppercase tracking-wider" style={{ color: colors[index] }}>{teamNames[index]}</p>
                  <p className="mt-2 text-5xl font-black tabular-nums text-white">{totalScores[index]}</p>
                  <p className="mt-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">bodov</p>
                </div>
              );
            })}
          </section>

          <div className="mt-auto w-full space-y-3 pt-8">
            <button
              onClick={onPlayAgain}
              className="party-shine w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-6 py-5 text-base font-black uppercase tracking-[0.07em] text-white shadow-[0_18px_50px_rgba(168,85,247,.35)] transition active:scale-[.97]"
            >
              Hrať odvetu
            </button>
            <button
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
