import { useState } from "react";
import { CATEGORIES } from "../../data/categories";
import type { GameSettings } from "../../types";
import { Button, Chip, Shell, Stepper, Toggle, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { maxImpostorsFor } from "../../utils/gameLogic";
import PlayerNamesField from "../../components/PlayerNamesField";
import {
  defaultPlayerName,
  localizeGeneratedParticipantName,
  useLanguage,
} from "../../i18n/LanguageProvider";

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
  const { language } = useLanguage();
  const [players, setPlayers] = useState<string[]>(() =>
    initial.playerNames.map((name) => localizeGeneratedParticipantName(name, language)),
  );
  const [categoryIds, setCategoryIds] = useState<string[]>(
    initial.categoryIds
  );
  const [impostorCount, setImpostorCount] = useState(initial.impostorCount);
  const [hintsEnabled, setHintsEnabled] = useState(initial.hintsEnabled);
  const [noRepeatWords, setNoRepeatWords] = useState(initial.noRepeatWords);
  const [hideCategoryFromImpostor, setHideCategoryFromImpostor] = useState(
    initial.hideCategoryFromImpostor
  );
  const [timerSeconds, setTimerSeconds] = useState(initial.timerSeconds);

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
      hintsEnabled,
      noRepeatWords,
      hideCategoryFromImpostor,
      timerSeconds,
      strokesPerPlayer: initial.strokesPerPlayer,
    });
  }

  return (
    <Shell className="mobile-settings mobile-settings-impostor">
      <TopBar title="Nastavenie hry" onBack={onBack} />

      <div className="flex-1 space-y-7 overflow-y-auto pb-4">
        <PlayerNamesField
          names={players}
          onChange={setPlayers}
          accent="#f97316"
          min={3}
          max={12}
          maxLength={16}
          nameForNew={(index) => defaultPlayerName(language, index + 1)}
          placeholderFor={(index) => defaultPlayerName(language, index + 1)}
        />

        {/* Categories */}
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/70">
            Kategórie slov
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              return (
                <Chip
                  key={cat.id}
                  active={categoryIds.includes(cat.id)}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <span aria-hidden="true">{cat.icon}</span>
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
          <Toggle
            checked={hideCategoryFromImpostor}
            onChange={setHideCategoryFromImpostor}
            label="Skryť kategóriu podvodníkovi"
            description="Podvodník nevidí, z akej kategórie slovo je — ťažšie sa mu bude hádať"
          />
        </section>
      </div>

      <Button fullWidth onClick={handleStart} className="mt-4">
        <span className="inline-flex items-center gap-2">Spustiť hru <Icons.gamepad size={18} /></span>
      </Button>
    </Shell>
  );
}
