import { useState } from "react";
import type { GameSettings } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";
import { cn } from "../../utils/designTokens";

export default function DrawingVote({
  settings,
  onExit,
  onConfirm,
}: {
  settings: GameSettings;
  onExit: () => void;
  onConfirm: (votedIndex: number | null) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Shell>
      <TopBar title="Hlasovanie" onBack={onExit} />

      <div
        className="mb-6 text-center"
        style={{ animation: "slideDown 0.5s ease-out both" }}
      >
        <h1 className="text-gradient text-2xl font-black">Kto je podvodník? 🗳️</h1>
        <p className="mt-2 text-sm text-white/50">
          Prediskutujte obrázok a hlasujte za hráča, ktorý podľa vás nevedel
          tajné slovo.
        </p>
      </div>

      <div className="grid flex-1 grid-cols-2 content-start gap-3 overflow-y-auto pb-4">
        {settings.playerNames.map((name, i) => {
          const isSelected = selected === i;
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                "glass relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl p-4",
                "transition-all duration-200 hover:scale-[1.02] active:scale-95",
                isSelected
                  ? "border-violet-400/60 ring-2 ring-violet-400/50"
                  : "hover:bg-white/10"
              )}
              style={{
                animation: "slideUp 0.5s ease-out both",
                animationDelay: `${i * 60}ms`,
              }}
            >
              {/* Selected glow wash */}
              {isSelected && (
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-500/20"
                  style={{ animation: "fadeIn 0.3s ease-out both" }}
                />
              )}

              <span
                className={cn(
                  "relative flex h-12 w-12 items-center justify-center rounded-full text-lg font-black text-white shadow-md transition-transform duration-200",
                  isSelected
                    ? "bg-gradient-to-br from-violet-500 to-cyan-500 shadow-violet-500/40"
                    : "bg-gradient-to-br from-violet-500/80 to-cyan-500/80"
                )}
                style={
                  isSelected
                    ? { animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both" }
                    : undefined
                }
              >
                {name.charAt(0).toUpperCase()}
              </span>

              <span
                className={cn(
                  "relative text-sm font-bold transition-colors duration-200",
                  isSelected ? "text-white" : "text-white/80"
                )}
              >
                {name}
              </span>

              {/* Check indicator */}
              {isSelected && (
                <span
                  className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-md shadow-emerald-500/40"
                  style={{
                    animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        className="mt-3 flex flex-col gap-3"
        style={{ animation: "slideUp 0.5s ease-out 300ms both" }}
      >
        <Button
          fullWidth
          disabled={selected === null}
          onClick={() => onConfirm(selected)}
          className="transition-transform duration-200 hover:scale-[1.02] active:scale-95"
        >
          Odhaliť podvodníka 🔍
        </Button>
        <Button
          fullWidth
          variant="ghost"
          onClick={() => onConfirm(null)}
          className="transition-transform duration-200 hover:scale-[1.02] active:scale-95"
        >
          Preskočiť hlasovanie
        </Button>
      </div>
    </Shell>
  );
}
