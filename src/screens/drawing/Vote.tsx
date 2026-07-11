import { useState } from "react";
import type { GameSettings } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";

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

      <div className="mb-6 text-center">
        <h1 className="text-2xl font-black">Kto je podvodník? 🗳️</h1>
        <p className="mt-2 text-sm text-white/50">
          Prediskutujte obrázok a hlasujte za hráča, ktorý podľa vás nevedel
          tajné slovo.
        </p>
      </div>

      <div className="grid flex-1 grid-cols-2 content-start gap-3 overflow-y-auto pb-4">
        {settings.playerNames.map((name, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition ${
              selected === i
                ? "border-violet-400/60 bg-gradient-to-br from-violet-500/20 to-cyan-500/20"
                : "border-white/10 bg-white/5"
            }`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-lg font-bold">
              {name.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-bold">{name}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-3">
        <Button
          fullWidth
          disabled={selected === null}
          onClick={() => onConfirm(selected)}
        >
          Odhaliť podvodníka 🔍
        </Button>
        <Button fullWidth variant="ghost" onClick={() => onConfirm(null)}>
          Preskočiť hlasovanie
        </Button>
      </div>
    </Shell>
  );
}
