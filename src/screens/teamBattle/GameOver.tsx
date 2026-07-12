import { useEffect, useState } from "react";
import { TEAM_COLORS } from "../../data/teamBattle";

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.5}s`,
    color: ["#a855f7", "#3b82f6", "#ef4444", "#f59e0b", "#22c55e", "#ec4899"][i % 6],
    size: `${6 + Math.random() * 8}px`,
    dur: `${2 + Math.random() * 2}s`,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationName: "confetti-fall",
            animationDuration: p.dur,
            animationDelay: p.delay,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
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
  const [a, b] = TEAM_COLORS;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  const isDraw = totalScores[0] === totalScores[1];
  const winner: 0 | 1 = totalScores[0] >= totalScores[1] ? 0 : 1;
  const loser: 0 | 1 = winner === 0 ? 1 : 0;
  const winColor = winner === 0 ? a : b;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-y-auto"
      style={{ background: "linear-gradient(160deg, #0b0a1a 0%, #1a0a2e 100%)" }}
    >
      {!isDraw && <Confetti />}

      <div className="relative z-20 mx-auto flex w-full max-w-md flex-col items-center gap-6 px-5 pb-8 pt-12 text-center">

        {/* Winner */}
        <div className={`transition-all duration-700 ${show ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
          {isDraw ? (
            <>
              <div className="text-7xl mb-3">🤝</div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Výsledok</p>
              <h1 className="text-4xl font-black text-white mt-1">Remíza!</h1>
            </>
          ) : (
            <>
              <div className="text-7xl mb-3">🏆</div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Víťaz bitky</p>
              <h1
                className="text-5xl font-black mt-1"
                style={{ color: winColor, textShadow: `0 0 40px ${winColor}80` }}
              >
                {teamNames[winner]}
              </h1>
              <p className="text-white/50 text-sm mt-2">
                gratulujeme! 🎉
              </p>
            </>
          )}
        </div>

        {/* Score cards */}
        <div className="flex gap-3 w-full">
          {([winner, loser] as const).map((idx, rank) => (
            <div
              key={idx}
              className="flex-1 rounded-3xl p-5 text-center"
              style={{
                background: `${idx === 0 ? a : b}${rank === 0 ? "25" : "12"}`,
                border: `2px solid ${idx === 0 ? a : b}${rank === 0 ? "" : "40"}`,
              }}
            >
              <div className="text-2xl mb-1">{rank === 0 && !isDraw ? "🥇" : isDraw && rank === 0 ? "🤝" : "🥈"}</div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: idx === 0 ? a : b }}>
                {teamNames[idx]}
              </p>
              <p className="text-4xl font-black text-white">{totalScores[idx]}</p>
              <p className="text-[10px] text-white/30 mt-1">bodov</p>
            </div>
          ))}
        </div>

        {/* Score difference */}
        {!isDraw && (
          <p className="text-sm text-white/40">
            {teamNames[winner]} vyhral o{" "}
            <strong className="text-white">{Math.abs(totalScores[0] - totalScores[1])}</strong>{" "}
            bodov
          </p>
        )}

        {/* Buttons */}
        <div className="w-full space-y-3 mt-2">
          <button
            onClick={onPlayAgain}
            className="w-full rounded-2xl py-5 text-base font-black text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            🔄 Hrať znova
          </button>
          <button
            onClick={onHome}
            className="w-full rounded-2xl py-4 text-base font-bold text-white/60 border border-white/10 bg-white/5"
          >
            Domov
          </button>
        </div>
      </div>
    </div>
  );
}
