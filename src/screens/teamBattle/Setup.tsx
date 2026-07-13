import { useState } from "react";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";
import { TEAM_COLORS } from "../../data/teamBattle";

export default function TeamBattleSetup({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (teamNames: [string, string], rounds: number) => void;
}) {
  const [names, setNames] = useState<[string, string]>(["Tím A", "Tím B"]);
  const [rounds, setRounds] = useState(5);

  const [a, b] = TEAM_COLORS;

  function setName(idx: 0 | 1, val: string) {
    setNames((prev) => {
      const n: [string, string] = [...prev] as [string, string];
      n[idx] = val;
      return n;
    });
  }

  const teamAccent = (idx: 0 | 1) =>
    idx === 0
      ? { bg: "bg-blue-500/20", border: "border-blue-500/40", text: "text-blue-300", from: "from-blue-500/30", to: "to-blue-700/30", hex: "#3b82f6" }
      : { bg: "bg-red-500/20", border: "border-red-500/40", text: "text-red-300", from: "from-red-500/30", to: "to-red-700/30", hex: "#ef4444" };

  return (
    <Shell>
      <TopBar title="Tímová párty bitka" onBack={onBack} />

      {/* Hero */}
      <div
        className="glass mb-6 rounded-3xl p-6 text-center"
        style={{ animation: "scaleIn 0.5s ease-out both" }}
      >
        <div
          className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/30 to-indigo-600/30"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <Icons.sword size={40} className="text-purple-300" />
        </div>
        <h2 className="text-gradient text-xl font-black">Nastavenie bitky</h2>
        <p className="mt-1 text-xs text-white/50">
          Dva tímy, viac minihier, jedno víťazstvo
        </p>
      </div>

      {/* Team names */}
      <div className="mb-5 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">
          Názvy tímov
        </p>

        {([0, 1] as const).map((idx, i) => {
          const acc = teamAccent(idx);
          return (
            <div
              key={idx}
              className="flex items-center gap-3"
              style={{ animation: `slideUp 0.5s ease-out ${0.1 + i * 0.1}s both` }}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br",
                  acc.from,
                  acc.to
                )}
              >
                <span className="text-lg font-black text-white">
                  {idx === 0 ? "A" : "B"}
                </span>
              </div>
              <input
                value={names[idx]}
                onChange={(e) => setName(idx, e.target.value)}
                placeholder={idx === 0 ? "Tím A" : "Tím B"}
                maxLength={20}
                className={cn(
                  "flex-1 rounded-2xl border bg-white/5 px-4 py-3.5 text-base font-bold text-white placeholder-white/30 outline-none transition focus:scale-[1.01]",
                  acc.border
                )}
                style={{ borderColor: `${idx === 0 ? a : b}44` }}
              />
            </div>
          );
        })}
      </div>

      {/* Round count */}
      <div
        className="glass mb-8 rounded-3xl p-5"
        style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}
      >
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">
          Počet kôl
        </p>
        <div className="flex gap-3">
          {[3, 5, 7].map((n, i) => (
            <button
              key={n}
              onClick={() => setRounds(n)}
              className={cn(
                "flex-1 rounded-2xl border py-4 text-center font-black transition hover:scale-[1.02] active:scale-95",
                rounds === n
                  ? "border-purple-400 bg-purple-500/20 text-purple-200"
                  : "border-white/10 bg-white/5 text-white/50"
              )}
              style={{
                animation: `popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.35 + i * 0.05}s both`,
              }}
            >
              <div className="text-2xl">{n}</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-widest opacity-70">
                {n === 3 ? "Krátka" : n === 5 ? "Štandard" : "Dlhá"}
              </div>
            </button>
          ))}
        </div>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-white/30">
          <Icons.star size={12} className="text-yellow-400" />
          Posledné kolo je vždy finálové s 3× bodmi
        </p>
      </div>

      <Button
        fullWidth
        onClick={() => onStart(names, rounds)}
        className="hover:scale-[1.02] active:scale-95 transition-transform"
        style={{ animation: "slideUp 0.5s ease-out 0.45s both" }}
      >
        ⚔️ Začať bitku!
      </Button>
    </Shell>
  );
}
