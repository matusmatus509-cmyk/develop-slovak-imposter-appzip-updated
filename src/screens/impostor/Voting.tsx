import { useState } from "react";
import type { GameSettings } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";
import { cn } from "../../utils/designTokens";

export default function Voting({
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

      <div className="mb-6 text-center" style={{ animation: "fadeIn 0.5s ease-out" }}>
        <h1 className="text-2xl font-black">Na koho hlasujete? 🗳️</h1>
        <p className="mt-2 text-sm text-white/50">
          Nahlas prediskutujte a vyberte hráča, ktorého skupina podozrieva z
          toho, že je podvodník.
        </p>
      </div>

      <div className="grid flex-1 grid-cols-2 content-start gap-3 overflow-y-auto pb-4">
        {settings.playerNames.map((name, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={cn(
              "relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border p-5 transition-all active:scale-95",
              selected === i
                ? "border-fuchsia-400/70 bg-gradient-to-br from-orange-500/20 to-fuchsia-600/20 shadow-lg shadow-fuchsia-900/30"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            )}
            style={{ animation: `scaleIn 0.4s ease-out ${i * 50}ms both` }}
          >
            {/* Selected indicator */}
            {selected === i && (
              <span
                className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500/40 text-white"
                style={{ animation: "popIn 0.3s ease-out" }}
              >
                ✓
              </span>
            )}
            <span
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full text-lg font-black transition-transform",
                selected === i
                  ? "scale-110 bg-gradient-to-br from-orange-500 to-fuchsia-600 text-white shadow-lg"
                  : "bg-gradient-to-br from-orange-500/30 to-fuchsia-600/30 text-white/80"
              )}
            >
              {name.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-bold">{name}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-3">
        <Button fullWidth disabled={selected === null} onClick={() => onConfirm(selected)}>
          Odhaliť podvodníka 🔍
        </Button>
        <Button fullWidth variant="ghost" onClick={() => onConfirm(null)}>
          Preskočiť hlasovanie
        </Button>
      </div>
    </Shell>
  );
}
