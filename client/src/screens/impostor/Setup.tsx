import { useMemo, useState } from "react";
import { CATEGORIES } from "../../data/categories";
import type { GameSettings } from "../../types";
import { Button, Shell, Stepper, Toggle, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { maxImpostorsFor } from "../../utils/gameLogic";
import PlayerNamesField from "../../components/PlayerNamesField";
import GameSettingsPage from "../../components/GameSettingsPage";
import CategoryPickerSearch, { matchesSearch } from "../../components/CategoryPickerSearch";
import {
  defaultPlayerName,
  localizeGeneratedParticipantName,
  useLanguage,
} from "../../i18n/LanguageProvider";
import { imposterGameHero } from "../../media";

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
  const [view, setView] = useState<"main" | "category">("main");
  const [players, setPlayers] = useState<string[]>(() =>
    initial.playerNames.map((name) => localizeGeneratedParticipantName(name, language)),
  );
  const [categoryIds, setCategoryIds] = useState<string[]>(initial.categoryIds);
  const [impostorCount, setImpostorCount] = useState(initial.impostorCount);
  const [hintsEnabled, setHintsEnabled] = useState(initial.hintsEnabled);
  const [noRepeatWords, setNoRepeatWords] = useState(initial.noRepeatWords);
  const [hideCategoryFromImpostor, setHideCategoryFromImpostor] = useState(
    initial.hideCategoryFromImpostor,
  );
  const [timerSeconds, setTimerSeconds] = useState(initial.timerSeconds);
  // Vyhľadávač v zozname kategórií — skryje kategórie, ktoré nevyhovujú
  // dotazu, aby sa v dlhom zozname dalo rýchlo nájsť téma.
  const [categoryQuery, setCategoryQuery] = useState("");

  const maxImpostors = maxImpostorsFor(players.length);

  const visibleCategories = useMemo(
    () => CATEGORIES.filter((category) => matchesSearch(category.name, categoryQuery)),
    [categoryQuery],
  );

  function toggleCategory(id: string) {
    setCategoryIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== id);
      }
      return [...prev, id];
    });
  }

  // Tlačidlá pracujú s kategóriami viditeľnými v zozname — pri prázdnom
  // vyhľadávaní je to celý zoznam, teda pôvodné správanie.
  function selectAllCategories() {
    const target = visibleCategories.length > 0 ? visibleCategories : CATEGORIES;
    setCategoryIds(target.map((category) => category.id));
  }

  function resetCategorySelection() {
    if (visibleCategories.length === 0) return;
    setCategoryIds([visibleCategories[0].id]);
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

  const selectedCategories = useMemo(
    () => CATEGORIES.filter((c) => categoryIds.includes(c.id)),
    [categoryIds],
  );

  const totalWords = useMemo(
    () => selectedCategories.reduce((sum, c) => sum + c.wordPairs.length, 0),
    [selectedCategories],
  );

  const categorySummary = useMemo(() => {
    if (categoryIds.length === CATEGORIES.length) return `Všetky kategórie (${CATEGORIES.length})`;
    if (selectedCategories.length === 0) return "Vyber kategórie";
    if (selectedCategories.length === 1) return selectedCategories[0].name;
    if (selectedCategories.length === 2)
      return `${selectedCategories[0].name}, ${selectedCategories[1].name}`;
    return `${selectedCategories[0].name} +${selectedCategories.length - 1}`;
  }, [categoryIds.length, selectedCategories]);

  const playerLabel = `${players.length} ${players.length < 5 ? "hráči" : "hráčov"}`;
  const impostorLabel = `${Math.min(impostorCount, maxImpostors)} ${Math.min(impostorCount, maxImpostors) === 1 ? "podvodník" : Math.min(impostorCount, maxImpostors) < 5 ? "podvodníci" : "podvodníkov"}`;

  if (view === "category") {
    return (
      <Shell className="mobile-settings mobile-settings-impostor guess-who-setup guess-who-category-picker impostor-theme">
        <TopBar title="Kategórie slov" onBack={() => setView("main")} />
        <CategoryPickerSearch value={categoryQuery} onChange={setCategoryQuery} />
        <div className="guess-who-category-list scroll-panel">
          <div className="guess-who-picker-heading">
            <span>Viacero kategórií</span>
            <p>Označ jednu alebo viac tém. Slovo sa vyberie z označených kategórií. {totalWords} slov celkom.</p>
          </div>

          <div className="guess-who-picker-actions">
            <button type="button" onClick={selectAllCategories}>
              Vybrať všetky
            </button>
            <button type="button" onClick={resetCategorySelection}>
              Zrušiť výber
            </button>
          </div>

          <section aria-label="Kategórie slov">
            <p className="guess-who-section-label">
              {categoryQuery.trim()
                ? `Nájdené · ${visibleCategories.length}`
                : `Kategórie · ${categoryIds.length} vybraných`}
            </p>
            {visibleCategories.length === 0 ? (
              <p className="guess-who-picker-empty">
                Žiadna kategória nevyhovuje „{categoryQuery.trim()}“. Skús iný nápis.
              </p>
            ) : (
              <div className="guess-who-picker-options">
                {visibleCategories.map((cat) => {
                  const active = categoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleCategory(cat.id)}
                      className={active ? "is-active" : ""}
                    >
                      <span className="guess-who-picker-icon">{cat.icon}</span>
                      <span className="guess-who-picker-copy">
                        <strong>{cat.name}</strong>
                        <small>{cat.wordPairs.length} slov</small>
                      </span>
                      <span className="guess-who-picker-check" aria-hidden="true">
                        {active ? <Icons.circleCheck size={17} /> : <Icons.circlePlus size={17} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
        <Button
          fullWidth
          onClick={() => setView("main")}
          className="guess-who-start-button guess-who-picker-confirm"
        >
          <span className="inline-flex items-center gap-2"><Icons.circleCheck size={18} /> Hotovo · {categoryIds.length}</span>
        </Button>
      </Shell>
    );
  }

  return (
    <Shell className="mobile-settings mobile-settings-impostor guess-who-setup impostor-theme">
      <TopBar title="Nastavenie hry" onBack={onBack} />
      <div className="guess-who-setup-form">
        {/* Hero – zaberá voľné miesto, aby setup bol na jednu obrazovku */}
        <div className="guess-who-hero relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(249,115,22,.18), rgba(22,15,10,.92) 62%, rgba(15,10,8,.96))" }}>
          <img
            src={imposterGameHero}
            alt=""
            aria-hidden="true"
            className="guess-who-hero-art absolute inset-0 h-full w-full object-cover opacity-50"
            style={{ objectPosition: "50% 30%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="guess-who-hero-copy relative">
            <span className="guess-who-hero-eyebrow">Klasický režim</span>
            <h1>Imposter</h1>
            <div className="guess-who-hero-stats">
              <span>🎭 {categorySummary}</span>
              <span><Icons.users size={13} /> {playerLabel}</span>
              <span><Icons.mask size={13} /> {impostorLabel}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setView("category")}
          className="guess-who-field"
        >
          <span className="guess-who-field-icon">🎭</span>
          <span className="min-w-0 flex-1 text-left">
            <small>Kategórie slov</small>
            <strong>{categorySummary}</strong>
          </span>
          <span className="guess-who-field-meta">
            <small>{totalWords} slov</small>
            <Icons.chevronRight size={18} />
          </span>
        </button>

        <GameSettingsPage
          accent="#f97316"
          icon="settings"
          title="Nastavenia hry"
          summary={`${impostorLabel} · ${timerSeconds === 0 ? "bez limitu" : `${timerSeconds}s`}`}
          description="Počet podvodníkov, časovač diskusie a pravidlá kola"
        >
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

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/70">
              Časovač diskusie
            </h2>
            <div className="guess-who-time-grid">
              {TIMER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTimerSeconds(opt.value)}
                  className={timerSeconds === opt.value ? "is-active" : ""}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

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
        </GameSettingsPage>

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

        <Button fullWidth onClick={handleStart} className="guess-who-start-button">
          <span className="inline-flex items-center gap-2">Spustiť hru <Icons.gamepad size={18} /></span>
        </Button>
      </div>
    </Shell>
  );
}
