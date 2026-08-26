import { useState } from "react";
import { Icons } from "../../components/icons";
import { DRAWING_CATEGORIES } from "../../data/drawingCategories";
import type { GameSettings } from "../../types";
import { Button, Chip, Shell, Stepper, TopBar } from "../../components/ui";
import { maxImpostorsFor } from "../../utils/gameLogic";
import PlayerNamesField from "../../components/PlayerNamesField";
import { cn } from "../../utils/designTokens";
import {
  defaultPlayerName,
  localizeGeneratedParticipantName,
  useLanguage,
} from "../../i18n/LanguageProvider";

export default function DrawingSetup({
  initial,
  onBack,
  onStart,
}: {
  initial: GameSettings;
  onBack: () => void;
  onStart: (settings: GameSettings) => void;
}) {
  const { language } = useLanguage();
  const [players, setPlayers] = useState<string[]>(() =>
    initial.playerNames.map((name) => localizeGeneratedParticipantName(name, language)),
  );
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
      playerNames: players.map((p) => p.trim() || defaultPlayerName(language)),
      categoryIds,
      impostorCount: Math.min(impostorCount, maxImpostors),
      hintsEnabled: false,
      noRepeatWords: initial.noRepeatWords,
      hideCategoryFromImpostor: initial.hideCategoryFromImpostor,
      timerSeconds: initial.timerSeconds,
      strokesPerPlayer,
    });
  }

  return (
    <Shell className="mobile-settings mobile-settings-drawing">
      <TopBar title="Kreslenie — nastavenie" onBack={onBack} />

      <div className="flex-1 space-y-7 overflow-y-auto pb-4">
        <PlayerNamesField
          names={players}
          onChange={setPlayers}
          accent="#8b5cf6"
          min={3}
          max={12}
          maxLength={16}
          nameForNew={(index) => defaultPlayerName(language, index + 1)}
          placeholderFor={(index) => defaultPlayerName(language, index + 1)}
        />

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
        <span className="inline-flex items-center gap-2">Spustiť kreslenie <Icons.palette size={18} /></span>
      </Button>
    </Shell>
  );
}
