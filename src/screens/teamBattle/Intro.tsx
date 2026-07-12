import { useState, useEffect } from "react";
import { TEAM_COLORS } from "../../data/teamBattle";

export default function TeamBattleIntro({
  teamNames,
  onDone,
}: {
  teamNames: [string, string];
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<"countdown" | "reveal">("countdown");
  const [count, setCount] = useState(3);
  const [a, b] = TEAM_COLORS;

  useEffect(() => {
    if (phase === "countdown") {
      if (count > 0) {
        const t = setTimeout(() => setCount((c) => c - 1), 800);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("reveal"), 300);
        return () => clearTimeout(t);
      }
    }
  }, [count, phase]);

  if (phase === "countdown") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0b0a1a]">
        <div
          key={count}
          className="text-[12rem] font-black text-white leading-none"
          style={{
            animation: "ping-once 0.8s ease-out",
            textShadow: "0 0 60px rgba(168,85,247,0.8)",
          }}
        >
          {count === 0 ? "🎉" : count}
        </div>
        <style>{`
          @keyframes ping-once {
            0% { transform: scale(1.5); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-8 px-6 text-center bg-[#0b0a1a]"
      style={{ background: "linear-gradient(160deg, #0b0a1a 0%, #1a0a2e 100%)" }}
    >
      <div className="text-6xl">⚔️</div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-purple-400 mb-2">
          Tímová párty bitka
        </p>
        <h1
          className="text-4xl font-black text-white leading-tight"
          style={{ textShadow: "0 0 40px rgba(168,85,247,0.6)" }}
        >
          ZAČÍNAME!
        </h1>
      </div>

      {/* Teams */}
      <div className="flex w-full max-w-xs gap-4">
        {([0, 1] as const).map((idx) => (
          <div
            key={idx}
            className="flex-1 rounded-3xl p-5 text-center font-black text-white text-lg"
            style={{ background: `${idx === 0 ? a : b}22`, border: `2px solid ${idx === 0 ? a : b}` }}
          >
            <div className="text-3xl mb-1">{idx === 0 ? "🔵" : "🔴"}</div>
            {teamNames[idx]}
          </div>
        ))}
      </div>

      <p className="text-sm text-white/40">
        Súperiace tímy, nech vyhrá ten lepší!
      </p>

      <button
        onClick={onDone}
        className="w-full max-w-xs rounded-2xl py-5 text-base font-black uppercase tracking-wide text-white"
        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
      >
        Poďme na to! 🚀
      </button>
    </div>
  );
}
