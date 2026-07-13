import { useState } from "react";
import { DRAWING_CATEGORIES } from "../../data/drawingCategories";
import type { GameSettings } from "../../types";
import { Button, Chip, Shell, Stepper, TopBar } from "../../components/ui";
import { maxImpostorsFor } from "../../utils/gameLogic";
import { cn } from "../../utils/designTokens";

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
  const [categoryIds, setCategoryIds] = useState<string[]>(
    // seed with drawing category ids if initial has none of them
    initial.categoryIds.some((id) => id.startsWith("draw-"))
      ? initial.categoryIds
      : DRAWING_CATEGORIES.map((c) => c.id)
  );
  const [impostorCount, setImpostorCount] = useState(initial.impostorCount);
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
      hintsEnabled: false,
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
        <section style={{ animation: "slideUp 0.4s ease-out both" }}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-white/70">
              Hráči ({players.length})
            </h2>
            <button
              onClick={addPlayer}
              disabled={players.length >= 12}
              className="rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 px-3 py-1.5 text-xs font-black text-white shadow-lg shadow-violet-500/30 transition-transform duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
            >
              + Pridať
            </button>
          </div>
          <div className="space-y-2">
            {players.map((name, i) => (
              <div
                key={i}
                className={cn(
                  "glass flex items-center gap-2 rounded-2xl px-3 py-2",
                  "transition-all duration-200 hover:bg-white/10"
                )}
                style={{
                  animation: `slideUp 0.4s ease-out both`,
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-xs font-black text-white shadow-md shadow-violet-500/30">
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
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/40 transition-all duration-200 hover:scale-110 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-20 disabled:hover:scale-100"
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
        <section
          className={cn(
            "glass flex items-center justify-between rounded-2xl px-4 py-3.5",
            "transition-all duration-200"
          )}
          style={{ animation: "slideUp 0.4s ease-out 100ms both" }}
        >
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
        <section
          className={cn(
            "glass flex items-center justify-between rounded-2xl px-4 py-3.5",
            "transition-all duration-200"
          )}
          style={{ animation: "slideUp 0.4s ease-out 150ms both" }}
        >
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
        <section style={{ animation: "slideUp 0.4s ease-out 200ms both" }}>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/70">
            Kategórie slov
          </h2>
          <div className="flex flex-wrap gap-2">
            {DRAWING_CATEGORIES.map((cat, i) => (
              <div
                key={cat.id}
                style={{
                  animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
                  animationDelay: `${200 + i * 40}ms`,
                }}
              >
                <Chip
                  active={categoryIds.includes(cat.id)}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </Chip>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Button
        fullWidth
        onClick={handleStart}
        className="mt-4 transition-transform duration-200 hover:scale-[1.02] active:scale-95"
        style={{ animation: "slideUp 0.5s ease-out 250ms both" }}
      >
        Spustiť kreslenie 🎨
      </Button>
    </Shell>
  );
}
