import { useState, useRef, useMemo } from "react";
import {
  ALL_SOLO_CHARADES_WORDS,
  getCharadesCardsForLanguage,
  CHARADES_CATEGORY_LABELS,
  CHARADES_CATEGORY_IDS,
  CHARADES_CATEGORY_ICONS,
  CHARADES_CATEGORY_COUNTS,
  isValidCharadeText,
  type CharadesCategory,
} from "../../data/charades";
import { Button, Shell, Toggle, TopBar } from "../../components/ui";
import CategoryPickerSearch, { matchesSearch } from "../../components/CategoryPickerSearch";
import CustomContentSelector, { type CustomContentControls } from "../../components/CustomContentSelector";
import PlayerNamesField from "../../components/PlayerNamesField";
import GameSettingsPage from "../../components/GameSettingsPage";
import type { WordGuessRecordInput, WorkshopEntry } from "../../types";
import { Icons } from "../../components/icons";
import { defaultPlayerName, useLanguage, type AppLanguage } from "../../i18n/LanguageProvider";
import { takePersistentItem } from "../../utils/persistentDeck";
import { useCountdown } from "../../hooks/useCountdown";
import { TurnAnswerRecap, type TurnAnswer } from "../../components/TurnAnswerRecap";
import { charadesGameHero } from "../../media";
import {
  PARTY_TEAM_IDENTITIES,
  partyTeamIdentity,
} from "../teamBattle/teamIdentity";

/** Akcent Šarád zdieľaný hero, poľom kategórií i nastaveniami. */
const CHARADES_ACCENT = "#a78bfa";

/**
 * Tímy sa označujú písmenom a farbou z Party mode (A modrý, B červený), takže
 * tím vyzerá rovnako tu aj vo všetkých ostatných minihrách. Predtým bol tím B
 * v šarádach oranžový a označoval sa ako „Tím 2".
 */
function teamLabel(team: 0 | 1) {
  return `Tím ${partyTeamIdentity(team).letter}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "setup" | "who-starts" | "playing" | "round-result" | "final-result";

interface Player {
  name: string;
  team: 0 | 1; // team mode: 0 or 1
  score: number;
  skipsUsed: number;
}

interface Card {
  id?: string;
  word: string;
  category: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildDeck(extraCards: Array<{ id: string; word: string }> = [], language: AppLanguage = "sk", categories: CharadesCategory[] = [...CHARADES_CATEGORY_IDS]): Card[] {
  const categoryFilter = new Set(categories);
  const cards = getCharadesCardsForLanguage(language)
    .filter((card) => categoryFilter.size === 0 || categoryFilter.has(card.category))
    .map((card) => ({
    id: card.id,
    word: card.text,
    category: CHARADES_CATEGORY_LABELS[card.category] ?? "Šarády",
  }));
  const seen = new Set<string>();
  const uniqueCards = cards.filter((card) => {
    const key = card.word.trim().toLocaleLowerCase("sk");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const fallback: Card[] = ALL_SOLO_CHARADES_WORDS.map((word) => ({
    word,
    category: "Šarády",
  }));
  const pool: Card[] = uniqueCards.length > 0 ? uniqueCards : fallback;
  for (const { id, word } of extraCards) {
    const normalizedWord = word.trim().replace(/\s+/g, " ");
    const key = normalizedWord.toLocaleLowerCase("sk");
    // Vlastné/importované šarády dodržiavajú rovnaké pravidlá ako vstavané.
    if (!isValidCharadeText(normalizedWord) || seen.has(key)) continue;
    seen.add(key);
    pool.push({ id: `custom:${id}`, word: normalizedWord, category: "Vlastná téma" });
  }
  return pool;
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen({
  onBack,
  onStart,
  customControls,
}: {
  onBack: () => void;
  onStart: (names: string[], timerSecs: number, maxSkips: number, teamMode: boolean, categories: CharadesCategory[]) => void;
  customControls?: CustomContentControls;
}) {
  const { language } = useLanguage();
  const [names, setNames] = useState(
    Array.from({ length: 4 }, (_, i) => defaultPlayerName(language, i + 1)),
  );
  const [timerSecs, setTimerSecs] = useState(60);
  const [maxSkips, setMaxSkips] = useState(3);
  const [teamMode, setTeamMode] = useState(false);
  const [view, setView] = useState<"main" | "category">("main");
  const [categoryIds, setCategoryIds] = useState<CharadesCategory[]>([...CHARADES_CATEGORY_IDS]);
  const [categoryQuery, setCategoryQuery] = useState("");

  const visibleCategories = useMemo(
    () =>
      CHARADES_CATEGORY_IDS.filter((id) =>
        matchesSearch(CHARADES_CATEGORY_LABELS[id], categoryQuery),
      ),
    [categoryQuery],
  );

  function toggleCategory(id: CharadesCategory) {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  const categorySummary = useMemo(() => {
    if (categoryIds.length === CHARADES_CATEGORY_IDS.length)
      return `Všetky kategórie (${CHARADES_CATEGORY_IDS.length})`;
    if (categoryIds.length === 0) return "Vyber kategórie";
    if (categoryIds.length <= 2)
      return categoryIds.map((id) => CHARADES_CATEGORY_LABELS[id]).join(", ");
    return `${CHARADES_CATEGORY_LABELS[categoryIds[0]]} +${categoryIds.length - 1}`;
  }, [categoryIds]);

  if (view === "category") {
    return (
      <Shell className="mobile-settings mobile-settings-charades guess-who-setup guess-who-category-picker charades-theme">
        <TopBar title="Kategórie slov" onBack={() => setView("main")} />
        <CategoryPickerSearch value={categoryQuery} onChange={setCategoryQuery} />
        <div className="guess-who-category-list scroll-panel">
          <div className="guess-who-picker-heading">
            <span>Viacero kategórií</span>
            <p>Označ témy, z ktorých sa majú slová losovať. {ALL_SOLO_CHARADES_WORDS.length} slov celkom.</p>
          </div>

          <div className="guess-who-picker-actions">
            <button type="button" onClick={() => setCategoryIds(visibleCategories)}>
              Vybrať všetky
            </button>
            <button type="button" onClick={() => setCategoryIds([])}>
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
                {visibleCategories.map((id) => {
                  const active = categoryIds.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleCategory(id)}
                      className={active ? "is-active" : ""}
                    >
                      <span className="guess-who-picker-icon">{CHARADES_CATEGORY_ICONS[id]}</span>
                      <span className="guess-who-picker-copy">
                        <strong>{CHARADES_CATEGORY_LABELS[id]}</strong>
                        <small>{CHARADES_CATEGORY_COUNTS[id]} slov</small>
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
          disabled={categoryIds.length === 0}
          onClick={() => setView("main")}
          className="guess-who-start-button guess-who-picker-confirm"
        >
          <span className="inline-flex items-center gap-2"><Icons.circleCheck size={18} /> Hotovo · {categoryIds.length}</span>
        </Button>
      </Shell>
    );
  }

  const categoryCount = categoryIds.length;
  const timerSummary = `${timerSecs}s na kolo · ${maxSkips === 99 ? "∞" : maxSkips} preskočení`;

  return (
    <Shell className="mobile-settings mobile-settings-charades guess-who-setup charades-theme">
      <TopBar title="Slovné šarády" onBack={onBack} />
      <div className="guess-who-setup-form">
        {/* Hero rastie a zmenšuje sa podľa displeja, takže obrazovka je vždy
            zaplnená a nič sa nemusí skrolovať — rovnaký vzor ako pri
            Hádaj kto som / Imposter / Kreslenie. */}
        <div
          className="guess-who-hero relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(167,139,250,.18), rgba(20,16,30,.92) 62%, rgba(14,12,24,.96))" }}
        >
          <img
            src={charadesGameHero}
            alt=""
            aria-hidden="true"
            className="guess-who-hero-art absolute inset-0 h-full w-full object-cover opacity-50"
            style={{ objectPosition: "50% 50%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="guess-who-hero-copy relative">
            <span className="guess-who-hero-eyebrow">Vysvetľuj slová</span>
            <h1>Slovné šarády</h1>
            <div className="guess-who-hero-stats">
              <span><Icons.messageSquare size={13} /> {categorySummary}</span>
              <span><Icons.users size={13} /> {names.length} hráčov</span>
              <span><Icons.timer size={13} /> {timerSecs}s</span>
            </div>
          </div>
        </div>

        <button type="button" onClick={() => setView("category")} className="guess-who-field">
          <span className="guess-who-field-icon">🗂️</span>
          <span className="min-w-0 flex-1 text-left">
            <small>Kategórie slov</small>
            <strong>{categorySummary}</strong>
          </span>
          <span className="guess-who-field-meta">
            <small>{categoryCount} vybraných</small>
            <Icons.chevronRight size={18} />
          </span>
        </button>

        {/* Nastavenia hry — čas na kolo a max. preskočení majú vlastnú
            stránku, aby setup obrazovka zostala krátka. */}
        <GameSettingsPage
          accent={CHARADES_ACCENT}
          icon="timer"
          title="Nastavenia hry"
          summary={timerSummary}
          description="Čas na kolo, limit preskočení a tímový mód"
        >
          <section className="guess-who-setting-block">
            <div className="guess-who-setting-heading">
              <span><Icons.timer size={15} /> Čas na kolo</span>
              <strong>{timerSecs} sekúnd</strong>
            </div>
            <div className="guess-who-time-grid">
              {[30, 45, 60, 90, 120].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimerSecs(t)}
                  className={timerSecs === t ? "is-active" : ""}
                >
                  {t}s
                </button>
              ))}
            </div>
          </section>

          <section className="guess-who-setting-block">
            <div className="guess-who-setting-heading">
              <span><Icons.circleArrowUp size={15} /> Max. preskočení za kolo</span>
              <strong>{maxSkips === 99 ? "∞" : maxSkips}</strong>
            </div>
            <div className="guess-who-time-grid">
              {[0, 1, 2, 3, 5, 99].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setMaxSkips(s)}
                  className={maxSkips === s ? "is-active" : ""}
                >
                  {s === 99 ? "∞" : s}
                </button>
              ))}
            </div>
          </section>

          <Toggle
            checked={teamMode}
            onChange={setTeamMode}
            label="Tímový mód"
            description="Hráči sa striedajú v 2 tímoch — Tím A a Tím B"
          />
        </GameSettingsPage>

        {customControls && (
          <CustomContentSelector controls={customControls} compact accent={CHARADES_ACCENT} />
        )}

        <PlayerNamesField
          names={names}
          onChange={setNames}
          accent={CHARADES_ACCENT}
          min={2}
          max={8}
          nameForNew={(index) => defaultPlayerName(language, index + 1)}
          placeholderFor={(index) => defaultPlayerName(language, index + 1)}
          // V tímovom móde sa hráči striedajú v dvoch tímoch podľa poradia,
          // takže odznak nesie tím, nie číslo hráča.
          badgeFor={
            teamMode
              ? (index) => ({
                  text: partyTeamIdentity(index).letter,
                  color: partyTeamIdentity(index).color,
                })
              : undefined
          }
        />

        <Button
          fullWidth
          onClick={() =>
            onStart(
              names.map((n, i) => n.trim() || defaultPlayerName(language, i + 1)),
              timerSecs,
              maxSkips,
              teamMode,
              categoryIds
            )
          }
          className="guess-who-start-button"
        >
          <span className="inline-flex items-center gap-2"><Icons.mask size={18} /> Začať šarády</span>
        </Button>
      </div>
    </Shell>
  );
}

// ─── Playing Screen ───────────────────────────────────────────────────────────

function PlayingScreen({
  player,
  deck,
  priorityCards,
  deckKey,
  timerSecs,
  maxSkips,
  teamMode,
  onWordGuessed,
  onDone,
}: {
  player: Player;
  deck: Card[];
  priorityCards: Card[];
  deckKey: string;
  timerSecs: number;
  maxSkips: number;
  teamMode: boolean;
  onWordGuessed?: (record: WordGuessRecordInput) => void;
  onDone: (correct: number, skips: number, answers: TurnAnswer[]) => void;
}) {
  const priorityQueueRef = useRef([...priorityCards]);
  function drawNextCard() {
    return priorityQueueRef.current.shift() ?? takePersistentItem(
      deckKey,
      deck,
      (item) => item.id ?? item.word.trim().toLocaleLowerCase("sk"),
    );
  }
  const [cardIdx, setCardIdx] = useState(0);
  const [card, setCard] = useState(drawNextCard);
  const [skipsUsed, setSkipsUsed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [cardAnim, setCardAnim] = useState<"idle" | "correct" | "skip">("idle");

  const correctRef = useRef(0);
  const skipsRef = useRef(0);
  const doneRef = useRef(false);
  const actionLockedRef = useRef(false);
  const answersRef = useRef<TurnAnswer[]>([]);
  const cardStartedAtRef = useRef(Date.now());


  function finish() {
    if (doneRef.current) return;
    doneRef.current = true;
    // The unresolved visible card is an answer the team did not get before the turn ended.
    if (!actionLockedRef.current && card?.word) answersRef.current.push({ answer: card.word, outcome: "missed" });
    onDone(correctRef.current, skipsRef.current, [...answersRef.current]);
  }

  // Odpočet beží podľa reálneho času, takže ho animácie kariet ani skóre nespomalia.
  const { secondsLeft: timeLeft, percentLeft } = useCountdown(timerSecs, true, finish);

  function advance(type: "correct" | "skip") {
    if (doneRef.current || actionLockedRef.current) return false;
    actionLockedRef.current = true;
    setCardAnim(type);
    setTimeout(() => {
      setCardAnim("idle");
      setCard(drawNextCard());
      cardStartedAtRef.current = Date.now();
      setCardIdx((value) => value + 1);
      actionLockedRef.current = false;
    }, 300);
    return true;
  }

  function handleCorrect() {
    if (!advance("correct")) return;
    if (card?.word) answersRef.current.push({ answer: card.word, outcome: "guessed" });
    if (card?.word) onWordGuessed?.({ word: card.word, milliseconds: Math.max(100, Date.now() - cardStartedAtRef.current), gameTitle: "Slovné šarády" });
    correctRef.current += 1;
    setCorrect((c) => c + 1);
  }

  function handleSkip() {
    if (skipsUsed >= maxSkips && maxSkips !== 99) return;
    if (!advance("skip")) return;
    if (card?.word) answersRef.current.push({ answer: card.word, outcome: "skipped" });
    skipsRef.current += 1;
    setSkipsUsed((s) => s + 1);
  }

  const canSkip = maxSkips === 99 || skipsUsed < maxSkips;
  const timerPct = percentLeft;
  const isWarning = timeLeft <= 10;

  return (
    <div className="charades-play-shell fixed inset-0 flex flex-col overflow-hidden">
      {/* Stavový pás: hráč/tím a priebežné skóre vľavo, čas vpravo.
          `exit-slot-gap` necháva miesto pre GLOBÁLNE tlačidlo „Odísť z hry“
          v pravom hornom rohu (celá minihra), aby sa s ním neprekrývalo
          tlačidlo na predčasné skončenie TOHTO kola — predtým tu boli dva
          kruhy s krížikom vedľa seba na tom istom mieste. */}
      <div
        className="exit-slot-gap relative z-10 mx-3 mt-[max(.7rem,env(safe-area-inset-top))] flex shrink-0 items-center gap-2.5 rounded-[1.4rem] border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-xl"
        style={{ animation: "fadeIn 0.4s ease-out both" }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {teamMode && (
              <span
                className="shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-black"
                style={{
                  background: `${partyTeamIdentity(player.team).color}30`,
                  color: partyTeamIdentity(player.team).color,
                }}
              >
                {teamLabel(player.team)}
              </span>
            )}
            <p className="truncate text-sm font-bold text-white/90">{player.name}</p>
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
            <Icons.check size={11} /> {correct} uhádnuté
          </p>
        </div>

        <div
          className={`flex h-10 min-w-[3.3rem] shrink-0 items-center justify-center gap-1 rounded-xl px-2.5 font-black tabular-nums transition-colors ${
            isWarning ? "bg-red-500 text-white" : "bg-white/10 text-white"
          }`}
          style={isWarning ? { animation: "ring 1s ease-in-out infinite" } : undefined}
        >
          <Icons.timer size={13} className="opacity-70" />
          {timeLeft}s
        </div>
      </div>

      {/* Predčasné skončenie kola je textový odkaz pod stavovým pásom, nie
          ďalší kruhový ikonový button — priamo vedľa globálneho tlačidla
          „Odísť z hry" (rovnaký kruh s krížikom v pravom hornom rohu) by dva
          takmer identické kruhy pri sebe zvádzali na omylom stlačenie
          nesprávneho a boli by ťažko rozlíšiteľné na prvý pohľad. */}
      <button
        onClick={finish}
        className="exit-slot-gap relative z-10 mx-3 mt-1.5 shrink-0 self-start text-[11px] font-bold text-white/35 underline decoration-white/20 underline-offset-2 transition active:scale-95 hover:text-white/60"
      >
        Skončiť kolo predčasne
      </button>

      {/* Progres kola — rovnaká čiara, len presunutá hneď pod stavový pás,
          aby vizuálne patrila k nemu a nie sedela osamotene nad tlačidlami. */}
      <div className="relative z-10 mx-3 mt-2 h-1.5 shrink-0 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-[width] duration-200 ease-linear ${
            isWarning ? "bg-red-500" : "bg-purple-400"
          }`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Karta */}
      <div className="flex flex-1 items-center justify-center w-full px-6">
        <div
          key={cardIdx}
          className={`charades-card relative w-full max-w-xs rounded-[1.75rem] bg-white p-8 text-center transition-all duration-300 ${
            cardAnim === "correct"
              ? "translate-y-[-20px] opacity-0 scale-95"
              : cardAnim === "skip"
              ? "translate-y-[20px] opacity-0 scale-95"
              : "translate-y-0 opacity-100 scale-100"
          }`}
          style={{ animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
        >
          <span className="charades-card-tag inline-flex items-center gap-1.5">
            <Icons.mask size={13} /> {card?.category}
          </span>
          <p
            className="mt-4 font-black text-gray-900 leading-[1.12] break-words hyphens-auto"
            style={{ fontSize: `clamp(1.15rem, ${Math.max(3.4, 12 - (card?.word?.length ?? 0) / 5)}vw, 2.25rem)` }}
            lang="sk"
          >
            {card?.word ?? ""}
          </p>
        </div>
      </div>

      {/* Akčné tlačidlá — pomenované pilulky namiesto holých kruhov s ikonou,
          rovnaký jazyk ako ostatné časované minihry Party modu. */}
      <div className="relative z-10 flex shrink-0 gap-3 px-4 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-1">
        <button
          onClick={handleSkip}
          disabled={!canSkip}
          aria-label="Preskočiť slovo"
          className="party-glass flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black text-white/75 transition active:scale-95 disabled:opacity-30"
        >
          <Icons.arrowUp size={17} />
          Preskočiť
          <span className="text-white/35">
            {maxSkips === 99 ? "∞" : `${skipsUsed}/${maxSkips}`}
          </span>
        </button>

        <button
          onClick={handleCorrect}
          aria-label="Uhádnuté"
          className="party-shine flex flex-[1.35] items-center justify-center gap-2 overflow-hidden rounded-2xl py-4 text-sm font-black text-white transition active:scale-95"
          style={{
            background: "linear-gradient(120deg, #16a34a, #22c55e)",
            boxShadow: "0 14px 28px -16px rgba(34, 197, 94, .65)",
          }}
        >
          <Icons.check size={18} />
          Uhádnuté
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface PartySlovnaRosadaConfig {
  teamNames: [string, string];
  timerSecs: number;
  onWordGuessed?: (record: WordGuessRecordInput) => void;
  onDone: (scores: [number, number]) => void;
}

export function PartySlovnaRosada(props: PartySlovnaRosadaConfig) {
  return <SlovnaRosada onBack={() => props.onDone([0, 0])} partyConfig={props} />;
}

export default function SlovnaRosada({
  onBack,
  partyConfig,
  customEntries = [],
  customControls,
  onWordGuessed,
}: {
  onBack: () => void;
  partyConfig?: PartySlovnaRosadaConfig;
  customEntries?: WorkshopEntry[];
  customControls?: CustomContentControls;
  onWordGuessed?: (record: WordGuessRecordInput) => void;
}) {
  const { language } = useLanguage();
  const extraCards = customEntries.map((entry) => ({ id: entry.id, word: entry.text }));
  const [phase, setPhase] = useState<Phase>(partyConfig ? "who-starts" : "setup");
  const [players, setPlayers] = useState<Player[]>(() => partyConfig
    ? partyConfig.teamNames.map((name, team) => ({ name, team: team as 0 | 1, score: 0, skipsUsed: 0 }))
    : []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timerSecs, setTimerSecs] = useState(partyConfig?.timerSecs ?? 60);
  const [maxSkips, setMaxSkips] = useState(3);
  const [teamMode, setTeamMode] = useState(Boolean(partyConfig));
  const [selectedCategories, setSelectedCategories] = useState<CharadesCategory[]>([...CHARADES_CATEGORY_IDS]);
  const [deck, setDeck] = useState<Card[]>(() => partyConfig ? buildDeck(extraCards, language, selectedCategories) : []);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [roundSkips, setRoundSkips] = useState(0);
  const [roundAnswers, setRoundAnswers] = useState<TurnAnswer[]>([]);

  function startGame(names: string[], timer: number, skips: number, teams: boolean, categories: CharadesCategory[]) {
    setTimerSecs(timer);
    setMaxSkips(skips);
    setTeamMode(teams);
    setSelectedCategories(categories);
    setDeck(buildDeck(extraCards, language, categories));
    setPlayers(
      names.map((name, i) => ({
        name,
        team: (i % 2) as 0 | 1,
        score: 0,
        skipsUsed: 0,
      }))
    );
    setCurrentIdx(0);
    setPhase("who-starts");
  }

  function handleRoundDone(correct: number, skips: number, answers: TurnAnswer[]) {
    setRoundCorrect(correct);
    setRoundSkips(skips);
    setRoundAnswers(answers);
    setPlayers((prev) =>
      prev.map((p, i) =>
        i === currentIdx ? { ...p, score: p.score + correct } : p
      )
    );
    setPhase("round-result");
  }

  function handleNext() {
    const next = currentIdx + 1;
    if (next >= players.length) {
      setPhase("final-result");
    } else {
      setCurrentIdx(next);
      setDeck(buildDeck(extraCards, language, selectedCategories)); // fresh shuffled deck for each player
      setPhase("who-starts");
    }
  }

  const current = players[currentIdx];

  // ── Setup ─────────────────────────────────────────────────────────────────
  if (phase === "setup") {
    return <SetupScreen onBack={onBack} onStart={startGame} customControls={customControls} />;
  }

  // ── Who starts ────────────────────────────────────────────────────────────
  if (phase === "who-starts" && current) {
    const isFirst = currentIdx === 0;
    const currentTeamLabel = teamMode ? teamLabel(current.team) : null;

    return (
      <Shell>
        <TopBar title="Slovné šarády" onBack={partyConfig ? undefined : () => setPhase("setup")} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            <Icons.mask size={44} className="text-purple-300" />
          </div>
          <p
            className="text-sm font-bold uppercase tracking-widest text-white/40"
            style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }}
          >
            {isFirst ? "Začína" : "Na rade je"}
          </p>
          <h2
            className="text-gradient text-4xl font-black"
            style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}
          >
            {current.name}
          </h2>
          {currentTeamLabel && (
            <span
              className="rounded-2xl border px-4 py-1.5 text-sm font-bold"
              style={{
                borderColor: `${partyTeamIdentity(current.team).color}66`,
                background: `${partyTeamIdentity(current.team).color}33`,
                color: partyTeamIdentity(current.team).color,
                animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both",
              }}
            >
              {currentTeamLabel}
              {partyConfig
                ? ` · ${partyTeamIdentity(current.team).sideLabel}`
                : ""}
            </span>
          )}
          <div
            className="glass rounded-3xl p-4 text-sm text-white/60 max-w-xs leading-relaxed"
            style={{ animation: "slideUp 0.5s ease-out 0.25s both" }}
          >
            Vysvetluj slová na kartách. Ostatní hádajú.{" "}
            <strong className="inline-flex items-center gap-0.5 text-white">
              <Icons.check size={13} />
            </strong>{" "}
            = uhádnuté,{" "}
            <strong className="inline-flex items-center gap-0.5 text-white">
              <Icons.arrowUp size={13} />
            </strong>{" "}
            = preskočiť
            {maxSkips !== 99 ? ` (max ${maxSkips}×)` : ""}.
            Čas: <strong className="text-white">{timerSecs}s</strong>.
          </div>
          <Button fullWidth onClick={() => setPhase("playing")}>
            <span className="inline-flex items-center gap-2"><Icons.play size={18} /> Štart!</span>
          </Button>
        </div>
      </Shell>
    );
  }

  // ── Playing ───────────────────────────────────────────────────────────────
  if (phase === "playing" && current) {
    return (
      <PlayingScreen
        player={current}
        deck={deck}
        priorityCards={[]}
        deckKey={`solo-charades-v3:${[...selectedCategories].sort().join(".")}`}
        timerSecs={timerSecs}
        maxSkips={maxSkips}
        teamMode={teamMode}
        onWordGuessed={onWordGuessed ?? partyConfig?.onWordGuessed}
        onDone={handleRoundDone}
      />
    );
  }

  // ── Round result ──────────────────────────────────────────────────────────
  if (phase === "round-result" && current) {
    const isLast = currentIdx >= players.length - 1;
    const nextPlayer = !isLast ? players[currentIdx + 1] : null;

    return (
      <Shell>
        <TopBar title="Výsledok kola" />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20"
            style={{ animation: "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
          >
            <Icons.timer size={44} className="text-purple-300" />
          </div>
          <h2
            className="text-gradient text-3xl font-black"
            style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}
          >
            {current.name}
          </h2>

          <div className="flex gap-4 w-full max-w-xs justify-center">
            <div
              className="glass flex-1 rounded-3xl border-green-500/30 bg-green-500/10 py-5"
              style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}
            >
              <div className="text-5xl font-black text-green-400">{roundCorrect}</div>
              <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Uhádnuté</div>
            </div>
            <div
              className="glass flex-1 rounded-3xl py-5"
              style={{ animation: "slideUp 0.5s ease-out 0.25s both" }}
            >
              <div className="text-5xl font-black text-white/50">{roundSkips}</div>
              <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Preskočené</div>
            </div>
          </div>

          <TurnAnswerRecap answers={roundAnswers} />

          {/* Running scores */}
          {teamMode ? (
            <div
              className="glass w-full max-w-xs rounded-3xl p-4"
              style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}
            >
              <p className="mb-3 text-xs uppercase tracking-widest text-white/40">Skóre tímov</p>
              {/* Poradie je vždy A, B — nikdy podľa skóre. */}
              {PARTY_TEAM_IDENTITIES.map((team) => {
                const teamScore = players
                  .filter((p) => p.team === team.index)
                  .reduce((sum, p) => sum + p.score, 0);
                return (
                  <div key={team.letter} className="flex items-center justify-between py-1.5">
                    <span className="font-bold text-sm" style={{ color: team.color }}>
                      {teamLabel(team.index)}
                    </span>
                    <span className="font-black text-lg text-white">{teamScore}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="glass w-full max-w-xs rounded-3xl p-4"
              style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}
            >
              <p className="mb-3 text-xs uppercase tracking-widest text-white/40">Priebežné skóre</p>
              {[...players]
                .slice(0, currentIdx + 1)
                .sort((a, b) => b.score - a.score)
                .map((p) => (
                  <div key={p.name} className="flex items-center justify-between py-1.5">
                    <span className="font-semibold text-sm text-white/80">{p.name}</span>
                    <span className="font-black text-white">{p.score}</span>
                  </div>
                ))}
            </div>
          )}

          <Button fullWidth onClick={handleNext}>
            <span className="inline-flex items-center gap-2">{isLast ? <Icons.trophy size={18} /> : <Icons.chevronRight size={18} />}{isLast ? "Výsledky" : `Ďalší: ${nextPlayer?.name}`}</span>
          </Button>
        </div>
      </Shell>
    );
  }

  // ── Final result ──────────────────────────────────────────────────────────
  if (phase === "final-result") {
    if (teamMode) {
      /**
       * Poradie tímov na tabuľke je pevné (A, potom B) — víťaza označuje pohár
       * a rámik, nie presunutie nahor. Predtým sa tu radilo podľa skóre, takže
       * tímy si na konci hry vymenili strany.
       */
      const teamScores = PARTY_TEAM_IDENTITIES.map((team) => ({
        team: team.index,
        score: players
          .filter((p) => p.team === team.index)
          .reduce((sum, p) => sum + p.score, 0),
        players: players.filter((p) => p.team === team.index),
      }));
      const bestScore = Math.max(...teamScores.map((entry) => entry.score));
      const isDraw = teamScores.every((entry) => entry.score === bestScore);
      const winner = isDraw
        ? null
        : (teamScores.find((entry) => entry.score === bestScore) ?? null);

      return (
        <Shell>
          <TopBar title="Koniec" />
          <div className="flex flex-1 flex-col gap-5 pt-2">
            <div className="text-center" style={{ animation: "fadeIn 0.5s ease-out both" }}>
              <div
                className="flex h-20 w-20 mx-auto mb-3 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-500/30 to-orange-500/20"
                style={{ animation: "tada 0.8s ease-out 0.1s both" }}
              >
                <Icons.trophy size={48} className="text-yellow-300" />
              </div>
              <h2 className="text-gradient text-2xl font-black">
                {winner ? `Vyhráva ${teamLabel(winner.team as 0 | 1)}!` : "Remíza!"}
              </h2>
              <p className="text-white/50 text-sm mt-1">
                {winner ? `${winner.score} bodov` : `${bestScore} bodov pre oba tímy`}
              </p>
            </div>

            {teamScores.map(({ team, score, players: tp }, i) => {
              const identity = partyTeamIdentity(team);
              const won = winner?.team === team;
              return (
              <div
                key={team}
                className="glass rounded-3xl border p-4"
                style={{
                  borderColor: won ? `${identity.color}66` : undefined,
                  background: won ? `${identity.color}1a` : undefined,
                  animation: `slideUp 0.5s ease-out ${0.15 + i * 0.1}s both`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-black text-lg" style={{ color: identity.color }}>
                    <span className="inline-flex items-center gap-2">{won && <Icons.trophy size={17} />}{teamLabel(team as 0 | 1)}</span>
                  </span>
                  <span className="text-2xl font-black text-white">{score}</span>
                </div>
                {tp.map((p) => (
                  <div key={p.name} className="flex justify-between text-sm py-1 border-t border-white/5">
                    <span className="text-white/70">{p.name}</span>
                    <span className="font-bold text-white">{p.score}</span>
                  </div>
                ))}
              </div>
              );
            })}

            {partyConfig ? (
              <Button
                fullWidth
                onClick={() => {
                  const scores: [number, number] = [
                    players.filter((player) => player.team === 0).reduce((sum, player) => sum + player.score, 0),
                    players.filter((player) => player.team === 1).reduce((sum, player) => sum + player.score, 0),
                  ];
                  partyConfig.onDone(scores);
                }}
              >
                <span className="inline-flex items-center gap-2"><Icons.chevronRight size={17} /> Pokračovať v Party mode</span>
              </Button>
            ) : (
              <>
                <div className="flex gap-3">
                  <Button fullWidth onClick={() => { setCurrentIdx(0); setDeck(buildDeck(extraCards, language, selectedCategories)); setPhase("who-starts"); }}>
                    <span className="inline-flex items-center gap-2"><Icons.refresh size={17} /> Znova</span>
                  </Button>
                  <Button fullWidth variant="secondary" onClick={() => setPhase("setup")}>
                    Nastavenia
                  </Button>
                </div>
                <Button fullWidth variant="ghost" onClick={onBack}>Domov</Button>
              </>
            )}
          </div>
        </Shell>
      );
    }

    // Solo mode final
    const sorted = [...players].sort((a, b) => b.score - a.score);
    return (
      <Shell>
        <TopBar title="Koniec" />
        <div className="flex flex-1 flex-col gap-5 pt-2">
          <div className="text-center" style={{ animation: "fadeIn 0.5s ease-out both" }}>
            <div
              className="flex h-20 w-20 mx-auto mb-3 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-500/30 to-orange-500/20"
              style={{ animation: "tada 0.8s ease-out 0.1s both" }}
            >
              <Icons.trophy size={48} className="text-yellow-300" />
            </div>
            <h2 className="text-gradient text-2xl font-black">Koniec!</h2>
            <p className="text-white/50 text-sm mt-1">
              Vyhráva <strong className="text-white">{sorted[0]?.name}</strong> s{" "}
              {sorted[0]?.score} bodmi!
            </p>
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
                <span className="text-green-400 font-black text-xl">{p.score}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button fullWidth onClick={() => { setCurrentIdx(0); setDeck(buildDeck(extraCards, language, selectedCategories)); setPhase("who-starts"); }}>
              <span className="inline-flex items-center gap-2"><Icons.refresh size={17} /> Znova</span>
            </Button>
            <Button fullWidth variant="secondary" onClick={() => setPhase("setup")}>
              Nastavenia
            </Button>
          </div>
          <Button fullWidth variant="ghost" onClick={onBack}>Domov</Button>
        </div>
      </Shell>
    );
  }

  return null;
}
