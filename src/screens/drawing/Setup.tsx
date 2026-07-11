import { useState } from "react";
import { CATEGORIES } from "../../data/categories";
import type { GameSettings } from "../../types";
import { Button, Chip, Shell, Stepper, Toggle, TopBar } from "../../components/ui";
import { maxImpostorsFor } from "../../utils/gameLogic";

export default function DrawingSetup({
  initial,
  onBack,
  onStart,
}: {
  initial: GameSettings;
  onBack: () => void;
  onStart: (settings: GameSettings) => void;
}) {
  const [players, setPlayers] = useState<string[]>(initial.playerNames);
  const [categoryIds, setCategoryIds] = useState<string[]>(initial.categoryIds);
  const [impostorCount, setImpostorCount] = useState(initial.impostorCount);
  const [hintsEnabled, setHintsEnabled] = useState(initial.hintsEnabled);
  const [strokesPerPlayer, setStrokesPerPlayer] = useState(
    initial.strokesPerPlayer ?? 3
  );

  const maxImpostors = maxImpostorsFor(players.length);

  function addPlayer() {
    if (players.length >= 12) return;
    setPlayers([...players, `Hráč ${players.length + 1}`]);
  }

  function removePlayer(index: number) {
    if (players.length <= 3) return;
    setPlayers(players.filter((_, i) => i !== index));
  }

  function updatePlayer(index: number, value: string) {
    setPlayers(players.map((p, i) => (i === index ? value : p)));
  }

  function toggleCategory(id: string) {
    setCategoryIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== id);
      }
      return [...prev, id];
    });
  }

  function handleStart() {
    onStart({
      playerNames: players.map((p) => p.trim() || "Hráč"),
      categoryIds,
      impostorCount: Math.min(impostorCount, maxImpostors),
      hintsEnabled,
      noRepeatWords: initial.noRepeatWords,
      timerSeconds: initial.timerSeconds,
      strokesPerPlayer,
    });
  }

  return (
    <Shell>
      <TopBar title="Kreslenie — nastavenie" onBack={onBack} />

      <div className="flex-1 space-y-7 overflow-y-auto pb-4">
        {/* Players */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-white/70">
              Hráči ({players.length})
            </h2>
            <button
              onClick={addPlayer}
              disabled={players.length >= 12}
              className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold disabled:opacity-30"
            >
              + Pridať
            </button>
          </div>
          <div className="space-y-2">
            {players.map((name, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-xs font-bold">
                  {i + 1}
                </span>
                <input
                  value={name}
                  onChange={(e) => updatePlayer(i, e.target.value)}
                  className="flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-white/30"
                  placeholder={`Hráč ${i + 1}`}
                  maxLength={16}
                />
                <button
                  onClick={() => removePlayer(i)}
                  disabled={players.length <= 3}
                  className="text-white/30 disabled:opacity-20"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {players.length <= 3 && (
            <p className="mt-2 text-xs text-white/40">Minimálny počet hráčov je 3.</p>
          )}
        </section>

        {/* Strokes per player */}
        <section className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
          <div>
            <p className="text-sm font-bold">Ťahy na hráča</p>
            <p className="text-xs text-white/50">Každý hráč nakreslí toľko ťahov</p>
          </div>
          <Stepper
            value={strokesPerPlayer}
            min={1}
            max={10}
            onChange={setStrokesPerPlayer}
          />
        </section>

        {/* Impostor count */}
        <section className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
          <div>
            <p className="text-sm font-bold">Počet podvodníkov</p>
            <p className="text-xs text-white/50">Max {maxImpostors} pri tomto počte hráčov</p>
          </div>
          <Stepper
            value={Math.min(impostorCount, maxImpostors)}
            min={1}
            max={maxImpostors}
            onChange={setImpostorCount}
          />
        </section>

        {/* Categories */}
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/70">
            Kategórie slov
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat.id}
                active={categoryIds.includes(cat.id)}
                onClick={() => toggleCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Chip>
            ))}
          </div>
        </section>

        {/* Toggles */}
        <section>
          <Toggle
            checked={hintsEnabled}
            onChange={setHintsEnabled}
            label="Nápoveda pre podvodníka"
            description="Podvodník dostane nápovedu zo svojej kategórie"
          />
        </section>
      </div>

      <Button fullWidth onClick={handleStart} className="mt-4">
        Spustiť kreslenie 🎨
      </Button>
    </Shell>
  );
}
