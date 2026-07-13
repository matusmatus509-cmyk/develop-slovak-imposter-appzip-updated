import { useState, useEffect } from "react";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";
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
            animation: "countdown 0.8s ease-out both",
            textShadow: "0 0 60px rgba(168,85,247,0.8)",
          }}
        >
          {count === 0 ? "🎉" : count}
        </div>
      </div>
    );
  }

  const teamAccent = (idx: 0 | 1) =>
    idx === 0
      ? { bg: "bg-blue-500/20", border: "border-blue-500", text: "text-blue-300", from: "from-blue-500/30", to: "to-blue-700/30", hex: "#3b82f6" }
      : { bg: "bg-red-500/20", border: "border-red-500", text: "text-red-300", from: "from-red-500/30", to: "to-red-700/30", hex: "#ef4444" };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-8 px-6 text-center bg-[#0b0a1a]"
      style={{ background: "linear-gradient(160deg, #0b0a1a 0%, #1a0a2e 100%)" }}
    >
      <div
        className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/30 to-indigo-600/30"
        style={{ animation: "float 3s ease-in-out infinite" }}
      >
        <Icons.sword size={40} className="text-purple-300" />
      </div>

      <div style={{ animation: "slideUp 0.5s ease-out 0.2s both" }}>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-purple-400">
          Tímová párty bitka
        </p>
        <h1
          className="text-gradient text-4xl font-black leading-tight"
          style={{ textShadow: "0 0 40px rgba(168,85,247,0.6)" }}
        >
          ZAČÍNAME!
        </h1>
      </div>

      {/* Teams */}
      <div className="flex w-full max-w-xs gap-4">
        {([0, 1] as const).map((idx, i) => {
          const acc = teamAccent(idx);
          return (
            <div
              key={idx}
              className={cn(
                "glass flex-1 rounded-3xl p-5 text-center font-black text-white text-lg",
                acc.border
              )}
              style={{
                animation: `popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.4 + i * 0.15}s both`,
                background: `${idx === 0 ? a : b}22`,
                borderWidth: "2px",
              }}
            >
              <div
                className={cn(
                  "mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br",
                  acc.from,
                  acc.to
                )}
              >
                <span className="text-xl font-black text-white">
                  {idx === 0 ? "A" : "B"}
                </span>
              </div>
              {teamNames[idx]}
            </div>
          );
        })}
      </div>

      <p
        className="text-sm text-white/40"
        style={{ animation: "fadeIn 0.5s ease-out 0.7s both" }}
      >
        Súperiace tímy, nech vyhrá ten lepší!
      </p>

      <button
        onClick={onDone}
        className="w-full max-w-xs rounded-2xl py-5 text-base font-black uppercase tracking-wide text-white transition hover:scale-[1.02] active:scale-95"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          animation: "slideUp 0.5s ease-out 0.85s both",
        }}
      >
        Poďme na to! 🚀
      </button>
    </div>
  );
}
