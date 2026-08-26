import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getCharacterCategories, type CharacterCategory } from "../../data/characters";
import { Button, Shell, TopBar } from "../../components/ui";
import type { CustomContentControls } from "../../components/CustomContentSelector";
import PlayerNamesField from "../../components/PlayerNamesField";
import GameSettingsPage from "../../components/GameSettingsPage";
import type { WordGuessRecordInput, WorkshopEntry } from "../../types";
import { useFeedback } from "../../feedback/FeedbackProvider";
import { Icons } from "../../components/icons";
import { requestTiltPermission, useTiltGesture } from "../../hooks/useTiltGesture";
import { defaultPlayerName, useLanguage } from "../../i18n/LanguageProvider";
import { takePersistentItem } from "../../utils/persistentDeck";
import { useCountdown } from "../../hooks/useCountdown";
import { TurnAnswerRecap, type TurnAnswer } from "../../components/TurnAnswerRecap";
import { partyMinigameAtlas } from "../../media";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "setup" | "who-starts" | "playing" | "round-result" | "final-result";
type DeckSource =
  | { kind: "builtin"; categoryId: string }
  | { kind: "custom"; collectionId: string; collectionName: string }
  | { kind: "all" };

interface PlayerScore {
  name: string;
  correct: number;
  skipped: number;
  played: boolean;
}

interface Card {
  id?: string;
  word: string;
  categoryName: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildDeck(
  categories: CharacterCategory[],
  source: DeckSource,
  extraCards: Array<{ id: string; word: string; collectionIds: string[] }> = [],
): Card[] {
  const cats = source.kind === "all"
    ? categories.filter((category) => category.id !== "all")
    : source.kind === "builtin"
      ? categories.filter((category) => category.id === source.categoryId)
      : [];
  const cards: Card[] = [];
  const seen = new Set<string>();
  for (const cat of cats) {
    for (const ch of cat.characters) {
      const key = ch.trim().toLocaleLowerCase("sk");
      if (seen.has(key)) continue;
      seen.add(key);
      cards.push({ word: ch, categoryName: cat.name });
    }
  }
  if (source.kind === "custom") {
    for (const { id, word, collectionIds } of extraCards) {
      if (!collectionIds.includes(source.collectionId)) continue;
      const key = word.trim().toLocaleLowerCase("sk");
      if (!key || seen.has(key)) continue;
      seen.add(key);
      cards.push({ id: `custom:${id}`, word, categoryName: source.collectionName });
    }
  }
  return cards;
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen({
  onBack,
  onStart,
  categories,
  customEntries,
  customControls,
}: {
  onBack: () => void;
  onStart: (names: string[], source: DeckSource, timerSeconds: number) => void;
  categories: CharacterCategory[];
  customEntries: WorkshopEntry[];
  customControls?: CustomContentControls;
}) {
  const { language } = useLanguage();
  const builtinCategories = useMemo(
    () => categories.filter((category) => category.id !== "all"),
    [categories],
  );
  const customCategories = useMemo(() => {
    if (!customControls) return [];
    return customControls.collections
      .map((collection) => ({
        ...collection,
        count: customEntries.filter((entry) => entry.collectionIds.includes(collection.id)).length,
      }))
      .filter((collection) => collection.count > 0);
  }, [customControls, customEntries]);
  const fallbackCategory = builtinCategories[0];
  const [view, setView] = useState<"main" | "category">("main");
  const [names, setNames] = useState(
    Array.from({ length: 3 }, (_, i) => defaultPlayerName(language, i + 1)),
  );
  const [source, setSource] = useState<DeckSource>(() => ({
    kind: "builtin",
    categoryId: fallbackCategory?.id ?? "",
  }));
  const [timer, setTimer] = useState(60);

  const selectedCategory = useMemo(() => {
    if (source.kind === "custom") {
      const category = customCategories.find((item) => item.id === source.collectionId);
      if (category) return { icon: category.icon, name: category.name, count: category.count };
    }
    const category = builtinCategories.find(
      (item) => source.kind === "builtin" && item.id === source.categoryId,
    ) ?? fallbackCategory;
    return {
      icon: category?.icon ?? "🎭",
      name: category?.name ?? "Vyber kategóriu",
      count: category?.characters.length ?? 0,
    };
  }, [builtinCategories, customCategories, fallbackCategory, source]);

  // Slovenčina skloňuje: 2–4 hráči, 5 a viac hráčov.
  const playerLabel = `${names.length} ${names.length < 5 ? "hráči" : "hráčov"}`;

  function chooseSource(nextSource: DeckSource) {
    setSource(nextSource);
  }

  function start() {
    const trimmedNames = names.map(
      (name, index) => name.trim() || defaultPlayerName(language, index + 1),
    );
    const selectedSource = source.kind === "custom"
      && !customCategories.some((category) => category.id === source.collectionId)
      ? { kind: "builtin" as const, categoryId: fallbackCategory?.id ?? "" }
      : source;
    onStart(trimmedNames, selectedSource, timer);
  }

  if (view === "category") {
    return (
      <Shell className="mobile-settings mobile-settings-guess-who guess-who-category-picker">
        <TopBar title="Vyber kategóriu" onBack={() => setView("main")} />
        {/* scroll-panel: zoznam kategórií sa dá skrolovať a pozerať, klik iba
            oznaří výber; tlačidlo Hotovo zostáva pod ním pevné. */}
        <div className="guess-who-category-list scroll-panel">
          <div className="guess-who-picker-heading">
            <span>Jedna kategória</span>
            <p>Karty sa nebudú miešať s inou témou.</p>
          </div>
          <section aria-label="Základné kategórie">
            <p className="guess-who-section-label">Kategórie</p>
            <div className="guess-who-picker-options">
              {builtinCategories.map((category) => {
                const active = source.kind === "builtin" && source.categoryId === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => chooseSource({ kind: "builtin", categoryId: category.id })}
                    className={active ? "is-active" : ""}
                  >
                    <span className="guess-who-picker-icon">{category.icon}</span>
                    <span className="guess-who-picker-copy">
                      <strong>{category.name}</strong>
                      <small>{category.characters.length} kariet</small>
                    </span>
                    <span className="guess-who-picker-check" aria-hidden="true">
                      {active ? <Icons.circleCheck size={17} /> : <Icons.chevronRight size={17} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
          {customCategories.length > 0 && (
            <section aria-label="Vlastné kategórie">
              <p className="guess-who-section-label">Moje kategórie</p>
              <div className="guess-who-picker-options">
                {customCategories.map((category) => {
                  const active = source.kind === "custom" && source.collectionId === category.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => chooseSource({
                        kind: "custom",
                        collectionId: category.id,
                        collectionName: category.name,
                      })}
                      className={active ? "is-active" : ""}
                    >
                      <span className="guess-who-picker-icon">{category.icon}</span>
                      <span className="guess-who-picker-copy">
                        <strong>{category.name}</strong>
                        <small>{category.count} vlastných kariet</small>
                      </span>
                      <span className="guess-who-picker-check" aria-hidden="true">
                        {active ? <Icons.circleCheck size={17} /> : <Icons.chevronRight size={17} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>
        <Button fullWidth onClick={() => setView("main")} className="guess-who-start-button guess-who-picker-confirm">
          <span className="inline-flex items-center gap-2"><Icons.circleCheck size={18} /> Hotovo</span>
        </Button>
      </Shell>
    );
  }

  return (
    <Shell className="mobile-settings mobile-settings-guess-who guess-who-setup">
      <TopBar title="Hádaj kto som" onBack={onBack} />
      <div className="guess-who-setup-form">
        {/* Hero rastie a zmenšuje sa podľa displeja, takže obrazovka je vždy
            zaplnená a nič sa nemusí skrolovať. */}
        <div className="guess-who-hero">
          <div
            className="guess-who-hero-art"
            aria-hidden="true"
            style={{
              backgroundImage: `url(${partyMinigameAtlas})`,
              backgroundSize: "400% 300%",
              backgroundPosition: "66.667% 100%",
            }}
          />
          <div className="guess-who-hero-copy">
            <span className="guess-who-hero-eyebrow">Telefón na čelo</span>
            <h1>Priprav si kolo</h1>
            <div className="guess-who-hero-stats">
              <span>{selectedCategory.icon} {selectedCategory.name}</span>
              <span><Icons.users size={13} /> {playerLabel}</span>
              <span><Icons.timer size={13} /> {timer} s</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setView("category")}
          className="guess-who-field"
        >
          <span className="guess-who-field-icon">{selectedCategory.icon}</span>
          <span className="min-w-0 flex-1 text-left">
            <small>Kategória</small>
            <strong>{selectedCategory.name}</strong>
          </span>
          <span className="guess-who-field-meta">
            <small>{selectedCategory.count} kariet</small>
            <Icons.chevronRight size={18} />
          </span>
        </button>

        {/* Nastavenia hry — čas na kolo má vlastnú stránku, aby setup
            obrazovka zostala krátka. */}
        <GameSettingsPage
          accent="#38bdf8"
          icon="timer"
          title="Nastavenia hry"
          summary={`${timer} sekúnd na kolo`}
          description="Čas na kolo"
        >
          <section className="guess-who-setting-block">
            <div className="guess-who-setting-heading">
              <span><Icons.timer size={15} /> Čas na kolo</span>
              <strong>{timer} sekúnd</strong>
            </div>
            <div className="guess-who-time-grid">
              {[30, 45, 60, 90, 120].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTimer(value)}
                  className={timer === value ? "is-active" : ""}
                >
                  {value}s
                </button>
              ))}
            </div>
          </section>
        </GameSettingsPage>

        <PlayerNamesField
          names={names}
          onChange={setNames}
          accent="#38bdf8"
          min={2}
          max={8}
          maxLength={16}
          nameForNew={(index) => defaultPlayerName(language, index + 1)}
          placeholderFor={(index) => defaultPlayerName(language, index + 1)}
        />

        <Button fullWidth onClick={start} className="guess-who-start-button">
          <span className="inline-flex items-center gap-2"><Icons.mask size={18} /> Začať hru</span>
        </Button>
      </div>
    </Shell>
  );
}

// ─── Playing Screen ───────────────────────────────────────────────────────────

function PlayingScreen({
  deck,
  priorityCards,
  timerSeconds,
  onWordGuessed,
  onDone,
}: {
  deck: Card[];
  priorityCards: Card[];
  timerSeconds: number;
  onWordGuessed?: (record: WordGuessRecordInput) => void;
  onDone: (correct: number, skipped: number, answers: TurnAnswer[]) => void;
}) {
  const { playFeedback } = useFeedback();
  const priorityQueueRef = useRef([...priorityCards]);
  const drawNextCard = useCallback(() => priorityQueueRef.current.shift() ?? takePersistentItem(
    "guess-who:all",
    deck,
    (item) => item.id ?? item.word.trim().toLocaleLowerCase("sk"),
  ), [deck]);
  const [cardIdx, setCardIdx] = useState(0);
  const [card, setCard] = useState(drawNextCard);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);

  // Use refs so event handlers always see fresh values
  const correctRef = useRef(0);
  const skippedRef = useRef(0);
  const tiltLocked = useRef(false);
  const doneRef = useRef(false);
  const answersRef = useRef<TurnAnswer[]>([]);
  const cardStartedAtRef = useRef(performance.now());
  const wasCalibratingRef = useRef(false);


  const finishRound = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    // A card still visible at time-out was neither guessed nor deliberately skipped.
    if (!tiltLocked.current && card?.word) answersRef.current.push({ answer: card.word, outcome: "missed" });
    onDone(correctRef.current, skippedRef.current, [...answersRef.current]);
  }, [card?.word, onDone]);

  const handleCorrect = useCallback(() => {
    if (doneRef.current || tiltLocked.current) return;
    tiltLocked.current = true;
    playFeedback("click");
    if (card?.word) answersRef.current.push({ answer: card.word, outcome: "guessed" });
    if (card?.word) onWordGuessed?.({ word: card.word, milliseconds: Math.max(100, Math.round(performance.now() - cardStartedAtRef.current)), gameTitle: "Hádaj kto som" });
    correctRef.current += 1;
    setFlash("correct");
    setTimeout(() => {
      setFlash(null);
      setCard(drawNextCard());
      cardStartedAtRef.current = performance.now();
      setCardIdx((value) => value + 1);
      tiltLocked.current = false;
    }, 600);
  }, [card?.word, drawNextCard, onWordGuessed, playFeedback]);

  const handleSkip = useCallback(() => {
    if (doneRef.current || tiltLocked.current) return;
    tiltLocked.current = true;
    playFeedback("click");
    if (card?.word) answersRef.current.push({ answer: card.word, outcome: "skipped" });
    skippedRef.current += 1;
    setFlash("wrong");
    setTimeout(() => {
      setFlash(null);
      setCard(drawNextCard());
      cardStartedAtRef.current = performance.now();
      setCardIdx((value) => value + 1);
      tiltLocked.current = false;
    }, 600);
  }, [card?.word, drawNextCard, playFeedback]);

  const tiltStatus = useTiltGesture(true, handleCorrect, handleSkip);
  const isCalibrating = tiltStatus === "calibrating";

  useEffect(() => {
    if (wasCalibratingRef.current && !isCalibrating) cardStartedAtRef.current = performance.now();
    wasCalibratingRef.current = isCalibrating;
  }, [isCalibrating]);

  // Odpočet podľa reálneho času — pauzne sa iba počas kalibrácie senzora.
  const { secondsLeft: timeLeft, percentLeft } = useCountdown(timerSeconds, !isCalibrating, finishRound);

  const timePercent = percentLeft;
  const isWarning = timeLeft <= 10;

  return (
    <div
      className="guess-who-play fixed inset-0 overflow-hidden select-none"
      style={{ touchAction: "none" }}
    >
      {isCalibrating && (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/92 backdrop-blur-md">
          <div
            className="flex flex-col items-center gap-4 text-center"
            style={{ transform: "rotate(-90deg)", animation: "fadeIn .25s ease-out both" }}
          >
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/10">
              <div className="absolute inset-2 rounded-full border-2 border-cyan-300/20 border-t-cyan-300 animate-spin" />
              <Icons.smartphone size={30} className="text-cyan-200" />
            </div>
            <div>
              <p className="text-xl font-black text-white">Drž mobil rovno</p>
              <p className="mt-1 max-w-[230px] text-xs font-semibold leading-relaxed text-white/50">
                Kalibrujem neutrálnu polohu. Približne jednu sekundu s telefónom nehýb.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Flash feedback overlay */}
      {flash && (
        <div
          className={`absolute inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${
            flash === "correct" ? "bg-green-500/50" : "bg-red-500/50"
          }`}
          style={{ animation: "fadeIn 0.15s ease-out both" }}
        >
          <span
            className="text-white text-9xl font-black"
            style={{ transform: "rotate(-90deg)", animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
          >
            {flash === "correct" ? "✓" : "✗"}
          </span>
        </div>
      )}

      {/* Landscape content — CSS rotation trick */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          width: "100vh",
          height: "100vw",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-90deg)",
        }}
      >
        {/* Tap zone — upper half = correct */}
        <button
          data-feedback="off"
          className="absolute top-0 left-0 right-0 z-10 opacity-0"
          style={{ height: "45%" }}
          onClick={handleCorrect}
        />
        {/* Tap zone — lower half = skip */}
        <button
          data-feedback="off"
          className="absolute bottom-0 left-0 right-0 z-10 opacity-0"
          style={{ height: "45%" }}
          onClick={handleSkip}
        />

        {/* Category label — left of landscape */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <p className="text-xs font-bold tracking-widest text-white/30 uppercase">
            {card?.categoryName ?? ""}
          </p>
        </div>

        {/* Timer — right of landscape */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <p
            className={`text-2xl font-black tabular-nums ${
              isWarning ? "text-red-400" : "text-white/50"
            }`}
          >
            {timeLeft}s
          </p>
        </div>

        {/* Tilt hints */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-0.5 opacity-20">
          <span className="text-white text-xs font-black">▲</span>
          <span className="text-white text-[10px] font-bold tracking-wider">UHÁDNUTÉ</span>
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-0.5 opacity-20">
          <span className="text-white text-[10px] font-bold tracking-wider">PRESKOČIŤ</span>
          <span className="text-white text-xs font-black">▼</span>
        </div>

        {/* Main word */}
        <div className="z-20 px-24 text-center pointer-events-none">
          <p
            className="guess-who-word font-black text-white leading-tight"
            style={{
              fontSize: "clamp(2.2rem, 9vmax, 5rem)",
              animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
            }}
            key={cardIdx}
          >
            {card?.word ?? ""}
          </p>
          {!flash && tiltStatus === "return-to-center" && (
            <p className="mt-4 text-xs font-black uppercase tracking-[.2em] text-cyan-200/80 animate-pulse">
              Vráť mobil rovno
            </p>
          )}
          {tiltStatus === "unsupported" && (
            <p className="mt-4 rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-[10px] font-bold text-amber-100/70">
              Senzor nie je dostupný — používaj hornú a dolnú časť obrazovky
            </p>
          )}
        </div>
      </div>

      {/* Timer bar at bottom of portrait screen */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-50">
        <div
          className={`h-full transition-[width] duration-200 ease-linear ${
            isWarning ? "bg-red-500" : "bg-cyan-400"
          }`}
          style={{ width: `${timePercent}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface PartyHadajKtoSomConfig {
  teamNames: [string, string];
  timerSeconds: number;
  onWordGuessed?: (record: WordGuessRecordInput) => void;
  onDone: (scores: [number, number]) => void;
}

export function PartyHadajKtoSom(props: PartyHadajKtoSomConfig) {
  return <HadajKtoSom onBack={() => props.onDone([0, 0])} partyConfig={props} />;
}

export default function HadajKtoSom({
  onBack,
  partyConfig,
  customEntries = [],
  customControls,
  onWordGuessed,
}: {
  onBack: () => void;
  partyConfig?: PartyHadajKtoSomConfig;
  customEntries?: WorkshopEntry[];
  customControls?: CustomContentControls;
  onWordGuessed?: (record: WordGuessRecordInput) => void;
}) {
  const { language } = useLanguage();
  const categories = useMemo(() => getCharacterCategories(language), [language]);
  const [phase, setPhase] = useState<Phase>(partyConfig ? "who-starts" : "setup");
  const [players, setPlayers] = useState<PlayerScore[]>(() => partyConfig
    ? partyConfig.teamNames.map((name) => ({ name, correct: 0, skipped: 0, played: false }))
    : []);
  const [currentDeck, setCurrentDeck] = useState<Card[]>([]);
  const [priorityCards, setPriorityCards] = useState<Card[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(partyConfig?.timerSeconds ?? 60);
  const [roundAnswers, setRoundAnswers] = useState<TurnAnswer[]>([]);
  const [deckSource, setDeckSource] = useState<DeckSource>(() => partyConfig
    ? { kind: "all" }
    : { kind: "builtin", categoryId: categories.find((category) => category.id !== "all")?.id ?? "" });

  function handleSetupStart(names: string[], source: DeckSource, timer: number) {
    setDeckSource(source);
    setTimerSeconds(timer);
    setPlayers(names.map((name) => ({ name, correct: 0, skipped: 0, played: false })));
    setCurrentPlayer(0);
    setPhase("who-starts");
  }

  async function startPlaying() {
    await requestTiltPermission();
    const deck = buildDeck(
      categories,
      deckSource,
      customEntries.map((entry) => ({
        id: entry.id,
        word: entry.text,
        collectionIds: entry.collectionIds,
      })),
    );
    if (deck.length === 0) {
      setDeckSource({
        kind: "builtin",
        categoryId: categories.find((category) => category.id !== "all")?.id ?? "",
      });
      setPhase("setup");
      return;
    }
    setCurrentDeck(deck);
    setPriorityCards([]);
    setPhase("playing");
  }

  function handleRoundDone(correct: number, skipped: number, answers: TurnAnswer[]) {
    setRoundAnswers(answers);
    setPlayers((prev) =>
      prev.map((p, i) =>
        i === currentPlayer ? { ...p, correct, skipped, played: true } : p
      )
    );
    setPhase("round-result");
  }

  function handleNext() {
    const next = currentPlayer + 1;
    if (next >= players.length) {
      setPhase("final-result");
    } else {
      setCurrentPlayer(next);
      setPhase("who-starts");
    }
  }

  // ── Setup ─────────────────────────────────────────────────────────────────
  if (phase === "setup") {
    return <SetupScreen key={language} categories={categories} customEntries={customEntries} customControls={customControls} onBack={onBack} onStart={handleSetupStart} />;
  }

  // ── Who starts ────────────────────────────────────────────────────────────
  if (phase === "who-starts") {
    const p = players[currentPlayer];
    const isFirst = currentPlayer === 0;
    return (
      <Shell>
        <TopBar title="Hádaj kto som" onBack={partyConfig ? undefined : () => setPhase("setup")} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            <Icons.mask size={56} className="text-cyan-300" />
          </div>
          <p
            className="text-sm font-bold uppercase tracking-widest text-white/40"
            style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }}
          >
            {isFirst ? "Začína" : "Na rade je"}
          </p>
          <h2
            className="text-gradient text-5xl font-black"
            style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}
          >
            {p?.name}
          </h2>
          <div
            className="glass rounded-3xl p-4 text-sm text-white/60 max-w-xs leading-relaxed"
            style={{ animation: "slideUp 0.5s ease-out 0.25s both" }}
          >
            <p className="mb-1 font-bold text-white">Ako hrať:</p>
            <p>
              Ostatní nakláňajú telefón <strong className="text-green-400">hore</strong> keď hráč uhádne,{" "}
              <strong className="text-red-400">dole</strong> keď nevie.
              Alebo klepnite na hornú/dolnú časť obrazovky.
            </p>
          </div>
          <Button fullWidth onClick={startPlaying}>
            <span className="inline-flex items-center gap-2"><Icons.play size={18} /> Začať!</span>
          </Button>
        </div>
      </Shell>
    );
  }

  // ── Playing ───────────────────────────────────────────────────────────────
  if (phase === "playing") {
    return (
      <PlayingScreen
        deck={currentDeck}
        priorityCards={priorityCards}
        timerSeconds={timerSeconds}
        onWordGuessed={onWordGuessed ?? partyConfig?.onWordGuessed}
        onDone={handleRoundDone}
      />
    );
  }

  // ── Round result ──────────────────────────────────────────────────────────
  if (phase === "round-result") {
    const p = players[currentPlayer];
    const isLast = currentPlayer >= players.length - 1;
    const nextName = !isLast ? players[currentPlayer + 1]?.name : null;

    return (
      <Shell>
        <TopBar title="Výsledok kola" />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20"
            style={{ animation: "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
          >
            <Icons.timer size={44} className="text-cyan-300" />
          </div>
          <h2
            className="text-gradient text-3xl font-black"
            style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}
          >
            {p?.name}
          </h2>

          <div className="flex gap-4 w-full max-w-xs justify-center">
            <div
              className="glass flex-1 rounded-3xl border-green-500/30 bg-green-500/10 py-5"
              style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}
            >
              <div className="text-5xl font-black text-green-400">{p?.correct ?? 0}</div>
              <div className="text-xs uppercase tracking-widest text-white/40 mt-1">
                Uhádnuté
              </div>
            </div>
            <div
              className="glass flex-1 rounded-3xl border-red-500/30 bg-red-500/10 py-5"
              style={{ animation: "slideUp 0.5s ease-out 0.25s both" }}
            >
              <div className="text-5xl font-black text-red-400">{p?.skipped ?? 0}</div>
              <div className="text-xs uppercase tracking-widest text-white/40 mt-1">
                Preskočené
              </div>
            </div>
          </div>

          <TurnAnswerRecap answers={roundAnswers} />

          <Button fullWidth onClick={handleNext}>
            <span className="inline-flex items-center gap-2">{isLast ? <Icons.trophy size={18} /> : <Icons.chevronRight size={18} />}{isLast ? "Zobraziť výsledky" : `Ďalší: ${nextName}`}</span>
          </Button>
        </div>
      </Shell>
    );
  }

  // ── Final result ──────────────────────────────────────────────────────────
  if (phase === "final-result") {
    const sorted = [...players].sort((a, b) => b.correct - a.correct);
    const winner = sorted[0];

    return (
      <Shell>
        <TopBar title="Koniec hry" />
        <div className="flex flex-1 flex-col gap-5 pt-2">
          <div className="text-center" style={{ animation: "fadeIn 0.5s ease-out both" }}>
            <div
              className="flex h-20 w-20 mx-auto mb-3 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-500/30 to-orange-500/20"
              style={{ animation: "tada 0.8s ease-out 0.1s both" }}
            >
              <Icons.trophy size={48} className="text-yellow-300" />
            </div>
            <h2 className="text-gradient text-2xl font-black">Koniec!</h2>
            {winner && (
              <p className="text-white/50 text-sm mt-1">
                Vyhráva{" "}
                <strong className="text-white">{winner.name}</strong> s{" "}
                {winner.correct}{" "}
                {winner.correct === 1 ? "bodom" : winner.correct < 5 ? "bodmi" : "bodmi"}!
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {sorted.map((p, rank) => (
              <div
                key={p.name}
                className={`glass flex items-center gap-4 rounded-2xl px-4 py-3 ${
                  rank === 0
                    ? "border-yellow-500/40 bg-yellow-500/10"
                    : ""
                }`}
                style={{ animation: `slideUp 0.5s ease-out ${0.1 + rank * 0.08}s both` }}
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl border text-xs font-black ${rank === 0 ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-200" : "border-white/10 bg-white/5 text-white/50"}`}>{rank === 0 ? <Icons.trophy size={16} /> : rank + 1}</span>
                <span className="flex-1 font-bold">{p.name}</span>
                <span className="text-green-400 font-black text-xl">{p.correct}</span>
                <span className="text-white/30 text-sm">
                  /{p.correct + p.skipped}
                </span>
              </div>
            ))}
          </div>

          {partyConfig ? (
            <Button
              fullWidth
              onClick={() => partyConfig.onDone([
                players[0]?.correct ?? 0,
                players[1]?.correct ?? 0,
              ])}
            >
              <span className="inline-flex items-center gap-2"><Icons.chevronRight size={17} /> Pokračovať v Party mode</span>
            </Button>
          ) : (
            <>
              <div className="flex gap-3 mt-2">
                <Button
                  fullWidth
                  onClick={() => {
                    setCurrentPlayer(0);
                    setPhase("who-starts");
                  }}
                >
                  <span className="inline-flex items-center gap-2"><Icons.refresh size={17} /> Hrať znova</span>
                </Button>
                <Button fullWidth variant="secondary" onClick={() => setPhase("setup")}>
                  Nastavenia
                </Button>
              </div>
              <Button fullWidth variant="ghost" onClick={onBack}>
                Domov
              </Button>
            </>
          )}
        </div>
      </Shell>
    );
  }

  return null;
}
