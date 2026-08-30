import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ALL_SOLO_CHARADES_WORDS,
  getCharadesCardsByDifficulty,
  SOLO_CHARADES_WORDS,
  isValidCharadeText,
  type CharadesDifficulty,
} from "../../data/charades";
import { Button, Shell, TopBar } from "../../components/ui";
import CustomContentSelector, { type CustomContentControls } from "../../components/CustomContentSelector";
import PlayerNamesField from "../../components/PlayerNamesField";
import type { WordGuessRecordInput, WorkshopEntry } from "../../types";
import { Icons } from "../../components/icons";
import { defaultPlayerName, useLanguage, type AppLanguage } from "../../i18n/LanguageProvider";
import { takePersistentItem } from "../../utils/persistentDeck";
import { useCountdown } from "../../hooks/useCountdown";
import { TurnAnswerRecap, type TurnAnswer } from "../../components/TurnAnswerRecap";

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

function buildDeck(difficulty: string, extraCards: Array<{ id: string; word: string }> = [], language: AppLanguage = "sk"): Card[] {
  const labels: Record<CharadesDifficulty, { name: string }> = {
    lahke: { name: "Ľahké" },
    stredne: { name: "Stredné" },
    tazke: { name: "Ťažké" },
  };
  const levels: CharadesDifficulty[] = difficulty === "all"
    ? ["lahke", "stredne", "tazke"]
    : [difficulty as CharadesDifficulty];
  const cardsByDifficulty = getCharadesCardsByDifficulty(language);
  const cards = levels.flatMap((level) =>
    (cardsByDifficulty[level] ?? []).map((card) => ({
      id: card.id,
      word: card.text,
      category: labels[level]?.name ?? "Šarády",
    })),
  );
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
  onStart: (names: string[], timerSecs: number, maxSkips: number, teamMode: boolean, difficulty: string) => void;
  customControls?: CustomContentControls;
}) {
  const { language } = useLanguage();
  const [names, setNames] = useState(
    Array.from({ length: 4 }, (_, i) => defaultPlayerName(language, i + 1)),
  );
  const [timerSecs, setTimerSecs] = useState(60);
  const [maxSkips, setMaxSkips] = useState(3);
  const [teamMode, setTeamMode] = useState(false);
  const [difficulty, setDifficulty] = useState("all");
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <Shell className="mobile-settings mobile-settings-charades scroll-panel">
      <TopBar title="Slovné šarády" onBack={onBack} />

      <PlayerNamesField
        className="mb-4"
        names={names}
        onChange={setNames}
        accent="#a78bfa"
        min={2}
        max={8}
        nameForNew={(index) => defaultPlayerName(language, index + 1)}
        placeholderFor={(index) => defaultPlayerName(language, index + 1)}
        // V tímovom móde sa hráči striedajú v dvoch tímoch podľa poradia,
        // takže odznak nesie tím, nie číslo hráča.
        badgeFor={
          teamMode
            ? (index) => ({
                text: `T${(index % 2) + 1}`,
                color: index % 2 === 0 ? "#3b82f6" : "#f97316",
              })
            : undefined
        }
      />

      {/* Team mode */}
      <div
        className="glass mb-4 rounded-3xl p-4"
        style={{ animation: "slideUp 0.5s ease-out 0.05s both" }}
      >
        <button
          onClick={() => setTeamMode((v) => !v)}
          className="flex w-full items-center justify-between active:scale-[0.98] transition"
        >
          <div>
            <p className="font-bold text-white">Tímový mód</p>
            <p className="text-xs text-white/40 mt-0.5">Hráči sa striedajú v 2 tímoch</p>
          </div>
          <span
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${
              teamMode ? "bg-gradient-to-r from-orange-500 to-fuchsia-600" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                teamMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Difficulty */}
      <div
        className="glass mb-4 rounded-3xl p-4"
        style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}
      >
        <p className="mb-3 text-sm font-bold text-white/60 uppercase tracking-widest">
          Obtiažnosť
        </p>
        <div className="flex gap-2">
          {[
            { key: "all", label: "Všetky", tone: "bg-purple-300", count: ALL_SOLO_CHARADES_WORDS.length },
            { key: "lahke", label: "Ľahké", tone: "bg-emerald-300", count: SOLO_CHARADES_WORDS.lahke.length },
            { key: "stredne", label: "Stredné", tone: "bg-amber-300", count: SOLO_CHARADES_WORDS.stredne.length },
            { key: "tazke", label: "Ťažké", tone: "bg-rose-300", count: SOLO_CHARADES_WORDS.tazke.length },
          ].map((d) => (
            <button
              key={d.key}
              onClick={() => setDifficulty(d.key)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border py-3 text-xs font-bold transition active:scale-95 hover:scale-[1.02] ${
                difficulty === d.key
                  ? "border-purple-400/60 bg-purple-500/30 text-purple-300"
                  : "border-white/10 bg-white/5 text-white/50"
              }`}
            >
              <span className="inline-flex items-center gap-1.5"><i className={`h-2 w-2 rounded-full ${d.tone}`} />{d.label}</span>
              <span className="text-[10px] font-semibold opacity-55">{d.count} kariet</span>
            </button>
          ))}
        </div>
      </div>

      {customControls && <div className="mb-4"><CustomContentSelector controls={customControls} compact /></div>}

      {/* Nastavenia hry — čas na kolo a max. preskočení majú vlastnú stránku,
          aby setup obrazovka zostala krátka. */}
      <button
        type="button"
        onClick={() => setRulesOpen(true)}
        className="glass mb-6 flex w-full items-center gap-3 rounded-3xl p-4 text-left transition active:scale-[.99]"
        style={{ animation: "slideUp 0.5s ease-out 0.25s both" }}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
          <Icons.timer size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <strong className="block text-sm font-black text-white">Nastavenia hry</strong>
          <small className="mt-0.5 block truncate text-[11px] font-medium text-white/45">
            {timerSecs}s na kolo · {maxSkips === 99 ? "∞" : maxSkips} preskočení
          </small>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-purple-300">
          Upraviť <Icons.chevronRight size={16} />
        </span>
      </button>

      {rulesOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[300] flex flex-col bg-[#080b10] text-white"
            role="dialog"
            aria-modal="true"
            aria-label="Nastavenia hry"
          >
            <header className="flex shrink-0 items-center gap-3 border-b border-white/[0.07] px-4 pb-3 pt-[max(.85rem,env(safe-area-inset-top))]">
              <button
                type="button"
                onClick={() => setRulesOpen(false)}
                aria-label="Späť na nastavenia"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/75 transition active:scale-90"
              >
                <Icons.arrowLeft size={20} />
              </button>
              <span className="min-w-0 flex-1">
                <strong className="block text-lg font-black leading-tight">
                  Nastavenia hry
                </strong>
                <small className="mt-0.5 block text-[11px] font-medium text-white/40">
                  Čas na kolo a limit preskočení
                </small>
              </span>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {/* Timer */}
              <div className="glass rounded-3xl p-4">
                <p className="mb-3 text-sm font-bold text-white/60 uppercase tracking-widest">
                  Čas na kolo
                </p>
                <div className="flex gap-2">
                  {[30, 45, 60, 90, 120].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimerSecs(t)}
                      className={`flex-1 rounded-2xl border py-3 text-xs font-bold transition active:scale-95 hover:scale-[1.02] ${
                        timerSecs === t
                          ? "border-purple-400/60 bg-purple-500/30 text-purple-300"
                          : "border-white/10 bg-white/5 text-white/50"
                      }`}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Max skips */}
              <div className="glass rounded-3xl p-4">
                <p className="mb-3 text-sm font-bold text-white/60 uppercase tracking-widest">
                  Max. preskočení za kolo
                </p>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 5, 99].map((s) => (
                    <button
                      key={s}
                      onClick={() => setMaxSkips(s)}
                      className={`flex-1 rounded-2xl border py-3 text-xs font-bold transition active:scale-95 hover:scale-[1.02] ${
                        maxSkips === s
                          ? "border-purple-400/60 bg-purple-500/30 text-purple-300"
                          : "border-white/10 bg-white/5 text-white/50"
                      }`}
                    >
                      {s === 99 ? "∞" : s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-white/[0.07] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <button
                type="button"
                onClick={() => setRulesOpen(false)}
                className="w-full rounded-2xl bg-purple-400 py-4 text-sm font-black uppercase tracking-wider text-[#08111a] transition active:scale-[.98]"
              >
                Hotovo
              </button>
            </div>
          </div>,
          document.body
        )}

      <Button
        fullWidth
        onClick={() =>
          onStart(
            names.map((n, i) => n.trim() || defaultPlayerName(language, i + 1)),
            timerSecs,
            maxSkips,
            teamMode,
            difficulty
          )
        }
      >
        <span className="inline-flex items-center gap-2"><Icons.mask size={18} /> Začať šarády</span>
      </Button>
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
    <div
      className="charades-play-shell fixed inset-0 flex flex-col items-center justify-between overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex w-full items-center justify-between px-5 pt-safe pt-6">
        {/* Spacer */}
        <div className="w-10" />

        {/* Timer pill */}
        <div
          className={`flex h-10 min-w-[72px] items-center justify-center rounded-full px-5 font-black text-lg transition-colors ${
            isWarning ? "bg-red-500/80 text-white" : "glass text-white"
          }`}
          style={isWarning ? { animation: "ring 1s ease-in-out infinite" } : undefined}
        >
          {timeLeft}s
        </div>

        {/* Exit */}
        <button
          onClick={finish}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white/70 text-lg active:scale-90 transition hover:scale-[1.05]"
        >
          ✕
        </button>
      </div>

      {/* Live score strip */}
      <div
        className="flex items-center gap-3 mt-2"
        style={{ animation: "fadeIn 0.4s ease-out both" }}
      >
        {teamMode && (
          <span
            className={`rounded-xl px-3 py-1 text-xs font-black ${
              player.team === 0
                ? "bg-blue-500/30 text-blue-300"
                : "bg-orange-500/30 text-orange-300"
            }`}
          >
            Tím {player.team + 1}
          </span>
        )}
        <span className="text-sm font-bold text-white/50">{player.name}</span>
        <span className="text-sm font-bold text-green-400">+{correct}</span>
      </div>

      {/* Card */}
      <div className="flex flex-1 items-center justify-center w-full px-8">
        <div
          key={cardIdx}
          className={`w-full max-w-xs rounded-3xl bg-white p-8 text-center shadow-2xl transition-all duration-300 ${
            cardAnim === "correct"
              ? "translate-y-[-20px] opacity-0 scale-95"
              : cardAnim === "skip"
              ? "translate-y-[20px] opacity-0 scale-95"
              : "translate-y-0 opacity-100 scale-100"
          }`}
          style={{ animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
              <span className="inline-flex items-center gap-1.5"><Icons.mask size={14} /> {card?.category}</span>
          </p>
          <p
            className="font-black text-gray-900 leading-tight break-words hyphens-auto"
            style={{ fontSize: `clamp(1.35rem, ${Math.max(4, 12 - (card?.word?.length ?? 0) / 6)}vw, 2.25rem)` }}
            lang="sk"
          >
            {card?.word ?? ""}
          </p>
        </div>
      </div>

      {/* Bottom timer bar */}
      <div className="w-full px-8 mb-3">
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-[width] duration-200 ease-linear ${
              isWarning ? "bg-red-500" : "bg-purple-400"
            }`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex w-full items-center justify-center gap-8 pb-safe pb-10">
        {/* Skip */}
        <button
          onClick={handleSkip}
          disabled={!canSkip}
          className={`flex h-20 w-20 flex-col items-center justify-center rounded-full transition active:scale-90 disabled:opacity-30 hover:scale-[1.05] ${
            canSkip ? "bg-white/20" : "bg-white/10"
          }`}
        >
          <span className="text-3xl text-white">↑</span>
          <span className="text-xs font-bold text-white/60 mt-0.5">
            {maxSkips === 99 ? "∞" : `${skipsUsed}/${maxSkips}`}
          </span>
        </button>

        {/* Correct */}
        <button
          onClick={handleCorrect}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 transition active:scale-90 active:bg-green-500/40 hover:scale-[1.05]"
        >
          <span className="text-4xl text-green-400">✓</span>
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
  const [difficulty, setDifficulty] = useState("all");
  const [deck, setDeck] = useState<Card[]>(() => partyConfig ? buildDeck("all", extraCards, language) : []);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [roundSkips, setRoundSkips] = useState(0);
  const [roundAnswers, setRoundAnswers] = useState<TurnAnswer[]>([]);

  function startGame(names: string[], timer: number, skips: number, teams: boolean, diff: string) {
    setTimerSecs(timer);
    setMaxSkips(skips);
    setTeamMode(teams);
    setDifficulty(diff);
    setDeck(buildDeck(diff, extraCards, language));
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
      setDeck(buildDeck(difficulty, extraCards, language)); // fresh shuffled deck for each player
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
    const teamLabel = teamMode
      ? `Tím ${current.team + 1}`
      : null;

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
          {teamLabel && (
            <span
              className={`rounded-2xl border px-4 py-1.5 text-sm font-bold ${
                current.team === 0
                  ? "border-blue-500/40 bg-blue-500/20 text-blue-300"
                  : "border-orange-500/40 bg-orange-500/20 text-orange-300"
              }`}
              style={{ animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both" }}
            >
              {teamLabel}
            </span>
          )}
          <div
            className="glass rounded-3xl p-4 text-sm text-white/60 max-w-xs leading-relaxed"
            style={{ animation: "slideUp 0.5s ease-out 0.25s both" }}
          >
            Vysvetluj slová na kartách. Ostatní hádajú.{" "}
            <strong className="text-white">✓</strong> = uhádnuté,{" "}
            <strong className="text-white">↑</strong> = preskočiť
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
        deckKey={`solo-charades-v2:${difficulty}`}
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
              {[0, 1].map((t) => {
                const teamScore = players.filter((p) => p.team === t).reduce((s, p) => s + p.score, 0);
                return (
                  <div key={t} className="flex items-center justify-between py-1.5">
                    <span className={`font-bold text-sm ${t === 0 ? "text-blue-300" : "text-orange-300"}`}>
                      Tím {t + 1}
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
      const teamScores = [0, 1].map((t) => ({
        team: t,
        score: players.filter((p) => p.team === t).reduce((s, p) => s + p.score, 0),
        players: players.filter((p) => p.team === t),
      }));
      teamScores.sort((a, b) => b.score - a.score);
      const winner = teamScores[0];

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
                Vyhráva Tím {winner.team + 1}!
              </h2>
              <p className="text-white/50 text-sm mt-1">{winner.score} bodov</p>
            </div>

            {teamScores.map(({ team, score, players: tp }, i) => (
              <div
                key={team}
                className={`glass rounded-3xl border p-4 ${
                  team === winner.team
                    ? team === 0
                      ? "border-blue-500/40 bg-blue-500/10"
                      : "border-orange-500/40 bg-orange-500/10"
                    : ""
                }`}
                style={{ animation: `slideUp 0.5s ease-out ${0.15 + i * 0.1}s both` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-black text-lg ${
                      team === 0 ? "text-blue-300" : "text-orange-300"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">{team === winner.team && <Icons.trophy size={17} />}Tím {team + 1}</span>
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
            ))}

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
                  <Button fullWidth onClick={() => { setCurrentIdx(0); setDeck(buildDeck(difficulty, extraCards, language)); setPhase("who-starts"); }}>
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
            <Button fullWidth onClick={() => { setCurrentIdx(0); setDeck(buildDeck(difficulty, extraCards, language)); setPhase("who-starts"); }}>
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
