import { useMemo, useState } from "react";
import { Icons } from "../../components/icons";
import { DRAWING_CATEGORIES } from "../../data/drawingCategories";
import type { GameSettings } from "../../types";
import { Button, Shell, Stepper, TopBar } from "../../components/ui";
import { maxImpostorsFor } from "../../utils/gameLogic";
import PlayerNamesField from "../../components/PlayerNamesField";
import GameSettingsPage from "../../components/GameSettingsPage";
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
  const [view, setView] = useState<"main" | "category">("main");
  const [players, setPlayers] = useState<string[]>(() =>
    initial.playerNames.map((name) => localizeGeneratedParticipantName(name, language)),
  );
  const [categoryIds, setCategoryIds] = useState<string[]>(
    initial.categoryIds.some((id) => id.startsWith("draw-"))
      ? initial.categoryIds
      : DRAWING_CATEGORIES.map((c) => c.id),
  );
  const [impostorCount, setImpostorCount] = useState(initial.impostorCount);
  const [strokesPerPlayer, setStrokesPerPlayer] = useState(initial.strokesPerPlayer ?? 3);

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

  const selectedCategories = useMemo(
    () => DRAWING_CATEGORIES.filter((c) => categoryIds.includes(c.id)),
    [categoryIds],
  );

  const totalWords = useMemo(
    () => selectedCategories.reduce((sum, c) => sum + c.wordPairs.length, 0),
    [selectedCategories],
  );

  const categorySummary = useMemo(() => {
    if (categoryIds.length === DRAWING_CATEGORIES.length)
      return `Všetky kategórie (${DRAWING_CATEGORIES.length})`;
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
      <Shell className="mobile-settings mobile-settings-drawing guess-who-setup guess-who-category-picker drawing-theme">
        <TopBar title="Kategórie kreslenia" onBack={() => setView("main")} />
        <div className="guess-who-category-list scroll-panel">
          <div className="guess-who-picker-heading">
            <span>Viacero kategórií</span>
            <p>Označ jednu alebo viac tém na kreslenie. Slovo sa vyberie z označených kategórií. {totalWords} slov celkom.</p>
          </div>

          <div className="guess-who-picker-actions">
            <button
              type="button"
              onClick={() => setCategoryIds(DRAWING_CATEGORIES.map((c) => c.id))}
            >
              Vybrať všetky
            </button>
            <button
              type="button"
              onClick={() => setCategoryIds([DRAWING_CATEGORIES[0].id])}
            >
              Zrušiť výber
            </button>
          </div>

          <section aria-label="Kategórie kreslenia">
            <p className="guess-who-section-label">Kategórie · {categoryIds.length} vybraných</p>
            <div className="guess-who-picker-options">
              {DRAWING_CATEGORIES.map((cat) => {
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
    <Shell className="mobile-settings mobile-settings-drawing guess-who-setup drawing-theme">
      <TopBar title="Kreslenie — nastavenie" onBack={onBack} />
      <div className="guess-who-setup-form">
        <div className="guess-who-hero" style={{ background: "linear-gradient(135deg, rgba(139,92,246,.18), rgba(18,14,28,.92) 62%, rgba(12,10,20,.96))" }}>
          <div
            className="guess-who-hero-art"
            aria-hidden="true"
            style={{
              background: "radial-gradient(circle at 30% 20%, rgba(139,92,246,.35), transparent 60%), radial-gradient(circle at 80% 80%, rgba(6,182,212,.22), transparent 55%)",
            }}
          />
          <div className="guess-who-hero-copy">
            <span className="guess-who-hero-eyebrow">Kresliaci režim</span>
            <h1>Imposter kreslenie</h1>
            <div className="guess-who-hero-stats">
              <span>🎨 {categorySummary}</span>
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
          <span className="guess-who-field-icon">🎨</span>
          <span className="min-w-0 flex-1 text-left">
            <small>Kategórie kreslenia</small>
            <strong>{categorySummary}</strong>
          </span>
          <span className="guess-who-field-meta">
            <small>{totalWords} slov</small>
            <Icons.chevronRight size={18} />
          </span>
        </button>

        <GameSettingsPage
          accent="#8b5cf6"
          icon="settings"
          title="Nastavenia hry"
          summary={`${strokesPerPlayer} ťah${strokesPerPlayer === 1 ? "" : "y"} · ${impostorLabel}`}
          description="Počet ťahov na hráča a počet podvodníkov"
        >
          <section className={cn("glass flex items-center justify-between rounded-2xl px-4 py-3.5")}>
            <div>
              <p className="text-sm font-bold">Ťahy na hráča</p>
              <p className="text-xs text-white/50">Každý hráč nakreslí toľko ťahov</p>
            </div>
            <Stepper value={strokesPerPlayer} min={1} max={10} onChange={setStrokesPerPlayer} />
          </section>

          <section className={cn("glass flex items-center justify-between rounded-2xl px-4 py-3.5")}>
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
        </GameSettingsPage>

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

        <Button fullWidth onClick={handleStart} className="guess-who-start-button">
          <span className="inline-flex items-center gap-2">Spustiť kreslenie <Icons.palette size={18} /></span>
        </Button>
      </div>
    </Shell>
  );
}
