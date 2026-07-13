import { useState } from "react";
import { CATEGORIES } from "../../data/categories";
import type { GameSettings } from "../../types";
import { Button, Chip, Shell, Stepper, Toggle, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";
import { maxImpostorsFor } from "../../utils/gameLogic";

const TIMER_OPTIONS = [
  { label: "30 s", value: 30 },
  { label: "60 s", value: 60 },
  { label: "90 s", value: 90 },
  { label: "2 min", value: 120 },
  { label: "3 min", value: 180 },
  { label: "Bez limitu", value: 0 },
];

export default function Setup({
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
    initial.categoryIds
  );
  const [impostorCount, setImpostorCount] = useState(initial.impostorCount);
  const [hintsEnabled, setHintsEnabled] = useState(initial.hintsEnabled);
  const [noRepeatWords, setNoRepeatWords] = useState(initial.noRepeatWords);
  const [timerSeconds, setTimerSeconds] = useState(initial.timerSeconds);

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
      noRepeatWords,
      timerSeconds,
    });
  }

  return (
    <Shell>
      <TopBar title="Nastavenie hry" onBack={onBack} />

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
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-fuchsia-600 text-xs font-bold">
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
                  <Icons.x size={18} />
                </button>
              </div>
            ))}
          </div>
          {players.length <= 3 && (
            <p className="mt-2 text-xs text-white/40">
              Minimálny počet hráčov je 3.
            </p>
          )}
        </section>

        {/* Categories */}
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/70">
            Kategórie slov
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const IconComponent = Icons[cat.icon];
              return (
                <Chip
                  key={cat.id}
                  active={categoryIds.includes(cat.id)}
                  onClick={() => toggleCategory(cat.id)}
                >
                  {IconComponent && <IconComponent size={18} />}
                  {cat.name}
                </Chip>
              );
            })}
          </div>
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

        {/* Timer */}
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/70">
            Časovač diskusie
          </h2>
          <div className="flex flex-wrap gap-2">
            {TIMER_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                active={timerSeconds === opt.value}
                onClick={() => setTimerSeconds(opt.value)}
              >
                {opt.label}
              </Chip>
            ))}
          </div>
        </section>

        {/* Toggles */}
        <section className="space-y-3">
          <Toggle
            checked={hintsEnabled}
            onChange={setHintsEnabled}
            label="Nápoveda pre podvodníka"
            description="Podvodník dostane nápovedu zo svojej kategórie, ktorú použije v prvom kole"
          />
          <Toggle
            checked={noRepeatWords}
            onChange={setNoRepeatWords}
            label="Režim kôl — bez opakovania"
            description="Rovnaké slovo sa nezopakuje, kým sa nevystriedajú všetky"
          />
        </section>
      </div>

      <Button fullWidth onClick={handleStart} className="mt-4">
        Spustiť hru 🎮
      </Button>
    </Shell>
  );
}