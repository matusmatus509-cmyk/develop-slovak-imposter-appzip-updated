import { useEffect, useMemo, useRef, useState } from "react";
import type {
  CustomContentGame,
  FeedbackSettings,
  GameSettings,
  GameStatistics,
  PartyRecords,
  RoundAssignment,
  RoundHistoryEntry,
  Screen,
  WorkshopCollection,
  WorkshopEntry,
  WorkshopSelections,
  WordGuessRecordInput,
} from "./types";
import { CATEGORIES } from "./data/categories";
import { DRAWING_CATEGORIES } from "./data/drawingCategories";
import { generateRound } from "./utils/gameLogic";
import {
  applyPartyCompletionRecord,
  applyFastestGuessRecord,
  DEFAULT_PARTY_RECORDS,
  normalizePartyRecords,
} from "./utils/partyRecords";
import {
  applyStatisticsEvent,
  createDefaultStatistics,
  normalizeStatistics,
} from "./utils/gameStats";
import {
  normalizeFavoriteIds,
  PARTY_THEMES,
  PLAYABLE_GAMES,
} from "./data/engagement";
import {
  DEFAULT_COLLECTION,
  DEFAULT_WORKSHOP_SELECTIONS,
  countCompatibleEntries,
  filterWorkshopEntries,
  normalizeWorkshopCollections,
  normalizeWorkshopEntries,
  normalizeWorkshopSelections,
  workshopEntriesToQuiz,
} from "./data/partyContent";
import {
  accumulatePartyPackLink,
  installPartyPack,
  parsePartyPackLink,
  PartyPackError,
} from "./data/partyPackSharing";
import type { CustomContentControls } from "./components/CustomContentSelector";
import { usePartyMusic } from "./hooks/usePartyMusic";
import { useLocalStorage } from "./hooks/useLocalStorage";

import Home from "./screens/Home";
import GameMenu, { type MenuGame } from "./screens/GameMenu";
import Setup from "./screens/impostor/Setup";
import Reveal from "./screens/impostor/Reveal";
import Discussion from "./screens/impostor/Discussion";
import Voting from "./screens/impostor/Voting";
import Result from "./screens/impostor/Result";
import History from "./screens/impostor/History";
import TruthOrDare from "./screens/minigames/TruthOrDare";
import NeverHaveIEver from "./screens/minigames/NeverHaveIEver";
import WouldYouRather from "./screens/minigames/WouldYouRather";
import DrawingSetup from "./screens/drawing/Setup";
import DrawingCanvas from "./screens/drawing/Canvas";
import DrawingVote from "./screens/drawing/Vote";
import DrawingResult from "./screens/drawing/Result";
import SlovnaRosada from "./screens/minigames/SlovnaRosada";
import SlovnyPingPong from "./screens/minigames/SlovnyPingPong";
import HadajKtoSom from "./screens/minigames/HadajKtoSom";
import IbaNepravda from "./screens/minigames/IbaNepravda";
import KtoDostaneBombu from "./screens/minigames/KtoDostaneBombu";
import HadajEmoji from "./screens/minigames/HadajEmoji";
import TeamBattle, { type TeamBattleSummary } from "./screens/teamBattle";
import TeamQuickGame from "./screens/minigames/TeamQuickGame";
import TicTacToe from "./screens/minigames/TicTacToe";
import Battleship from "./screens/minigames/Battleship";
import Statistics from "./screens/Statistics";
import Settings from "./screens/Settings";
import PartyHub from "./screens/PartyHub";
import { FeedbackProvider } from "./feedback/FeedbackProvider";
import GameWelcome, { GAME_WELCOMES } from "./components/GameWelcome";

const IMPOSTOR_GAMES: MenuGame[] = [
  {
    screen: "impostor-setup",
    title: "Imposter",
    description: "Nájdite hráča, ktorý nepozná tajné slovo.",
    icon: "userCheck",
    color: "from-orange-400 to-rose-500",
    badge: "Klasika",
  },
  {
    screen: "drawing-setup",
    title: "Imposter kreslenie",
    description: "Všetci kreslia rovnaké zadanie, iba imposter ho nepozná.",
    icon: "paintbrush",
    color: "from-violet-500 to-cyan-500",
  },
  {
    screen: "impostor-history",
    title: "História hier",
    description: "Pozrite si výsledky predchádzajúcich kôl.",
    icon: "history",
    color: "from-slate-500 to-slate-700",
  },
];

const MINIGAMES: MenuGame[] = [
  {
    screen: "truth-or-dare",
    title: "Pravda alebo výzva",
    description: "Klasické otázky a odvážne výzvy.",
    icon: "target",
    color: "from-sky-500 to-indigo-600",
  },
  {
    screen: "never-have-i-ever",
    title: "Nikdy som nikdy",
    description: "Zistite o sebe veci, ktoré ste netušili.",
    icon: "wine",
    color: "from-emerald-500 to-teal-600",
  },
  {
    screen: "would-you-rather",
    title: "Radšej by som",
    description: "Dve možnosti, jedno ťažké rozhodnutie.",
    icon: "brain",
    color: "from-amber-500 to-rose-500",
  },
  {
    screen: "slovnarosada",
    title: "Slovné šarády",
    description: "Vysvetľujte slová bez použitia ich názvu a zbierajte body.",
    icon: "gamepad",
    color: "from-purple-500 to-indigo-600",
  },
  {
    screen: "pingpong",
    title: "Slovný ping pong",
    description: "Striedajte slová z kategórie bez zaváhania.",
    icon: "rotateCcw",
    color: "from-green-500 to-emerald-600",
  },
  {
    screen: "hadajktosom",
    title: "Hádaj kto som",
    description: "Telefón na čelo, nápovedy a rýchle hádanie.",
    icon: "user",
    color: "from-cyan-500 to-blue-600",
  },
  {
    screen: "ibanepravda",
    title: "Iba nepravda",
    description: "Odpovedajte rýchlo, ale nikdy pravdivo.",
    icon: "messageSquare",
    color: "from-rose-500 to-pink-600",
  },
  {
    screen: "ktodostanebombu",
    title: "Kto dostane bombu",
    description: "Hovorte slová a podajte mobil skôr, než vybuchne.",
    icon: "zap",
    color: "from-orange-500 to-red-600",
  },
  {
    screen: "hadajemoji",
    title: "Hádaj emoji",
    description: "Uhádnite filmy, postavy, videohry či osobnosti z emoji.",
    icon: "smile",
    color: "from-amber-400 to-yellow-500",
  },
  {
    screen: "zakazane",
    title: "Zakázané slovo",
    description: "Vysvetľujte bez štyroch zakázaných výrazov.",
    icon: "messageSquare",
    color: "from-rose-500 to-red-700",
    badge: "Nové",
  },
  {
    screen: "pesnicka",
    title: "Zahmkaj pesničku",
    description: "Hmkaním predveďte známe slovenské aj svetové hity.",
    icon: "headphones",
    color: "from-violet-500 to-fuchsia-700",
    badge: "Nové",
  },
  {
    screen: "hudobny-kviz",
    title: "Hudobný kvíz",
    description:
      "Pustite ukážku známej pesničky a získajte bod za názov aj interpreta.",
    icon: "headphones",
    color: "from-fuchsia-500 to-purple-700",
    badge: "Nové",
  },
  {
    screen: "zvuk",
    title: "Uhádni zvuk",
    description: "Počúvajte tajné zvuky a predbiehajte sa na bzučiaku.",
    icon: "bell",
    color: "from-cyan-500 to-blue-700",
    badge: "Nové",
  },
  {
    screen: "pismeno",
    title: "Slovo na písmeno",
    description: "Kategória, písmeno a krátky čas na odpoveď.",
    icon: "tag",
    color: "from-amber-400 to-orange-600",
    badge: "Nové",
  },
  {
    screen: "patzadesat",
    title: "5 za 10",
    description: "Vymenujte päť odpovedí v nastavenom čase.",
    icon: "timer",
    color: "from-emerald-400 to-green-700",
    badge: "Nové",
  },
  {
    screen: "tic-tac-toe",
    title: "Piškvorky",
    description:
      "Animovaný klasický súboj X a O pre dvoch alebo proti robotovi.",
    icon: "grid",
    color: "from-cyan-500 to-fuchsia-600",
    badge: "Nové",
  },
  {
    screen: "battleship",
    title: "Loďky",
    description:
      "Rozmiestnite flotilu a potopte päť súperových lodí na mape 10 × 10.",
    icon: "ship",
    color: "from-cyan-600 to-blue-800",
    badge: "Nové",
  },
];

const DEFAULT_STATISTICS = createDefaultStatistics();

const DEFAULT_FEEDBACK_SETTINGS: FeedbackSettings = {
  darkMode: true,
  soundsEnabled: true,
  vibrationEnabled: true,
  animationsEnabled: true,
  partyTheme: "dark",
  musicEnabled: false,
};

function normalizeFeedbackSettings(value: unknown): FeedbackSettings {
  const candidate =
    value && typeof value === "object"
      ? (value as Partial<FeedbackSettings>)
      : {};
  const partyTheme = PARTY_THEMES.some(
    theme => theme.id === candidate.partyTheme
  )
    ? candidate.partyTheme
    : "dark";
  return {
    darkMode:
      typeof candidate.darkMode === "boolean"
        ? candidate.darkMode
        : DEFAULT_FEEDBACK_SETTINGS.darkMode,
    soundsEnabled:
      typeof candidate.soundsEnabled === "boolean"
        ? candidate.soundsEnabled
        : DEFAULT_FEEDBACK_SETTINGS.soundsEnabled,
    vibrationEnabled:
      typeof candidate.vibrationEnabled === "boolean"
        ? candidate.vibrationEnabled
        : DEFAULT_FEEDBACK_SETTINGS.vibrationEnabled,
    animationsEnabled:
      typeof candidate.animationsEnabled === "boolean"
        ? candidate.animationsEnabled
        : DEFAULT_FEEDBACK_SETTINGS.animationsEnabled,
    partyTheme,
    musicEnabled: Boolean(candidate.musicEnabled),
  };
}

const THEME_ACCENTS = {
  dark: { accent: "#8b5cf6", soft: "rgba(139,92,246,.18)", deep: "#080d16" },
  neon: { accent: "#22d3ee", soft: "rgba(217,70,239,.2)", deep: "#020617" },
  gold: { accent: "#fbbf24", soft: "rgba(245,158,11,.18)", deep: "#171006" },
  halloween: {
    accent: "#f97316",
    soft: "rgba(249,115,22,.18)",
    deep: "#120904",
  },
  christmas: {
    accent: "#ef4444",
    soft: "rgba(34,197,94,.17)",
    deep: "#07130c",
  },
  galaxy: { accent: "#818cf8", soft: "rgba(76,29,149,.22)", deep: "#050816" },
} as const;

const NON_GAME_SCREENS: Screen[] = [
  "home",
  "impostor-menu",
  "minigames-menu",
  "impostor-history",
  "party-hub",
  "statistics",
  "settings",
];

const ONE_SCREEN_GAME_SCREENS = new Set<Screen>([
  "impostor-reveal",
  "impostor-discussion",
  "impostor-voting",
  "impostor-result",
  "drawing-reveal",
  "drawing-canvas",
  "drawing-vote",
  "drawing-result",
  "truth-or-dare",
  "never-have-i-ever",
  "would-you-rather",
  "slovnarosada",
  "pingpong",
  "hadajktosom",
  "ibanepravda",
  "ktodostanebombu",
  "hadajemoji",
  "zakazane",
  "pesnicka",
  "hudobny-kviz",
  "zvuk",
  "pismeno",
  "patzadesat",
  "tic-tac-toe",
  "battleship",
  // Party mód je jeden Screen s ~13 pod-obrazovkami. Bez tohto záznamu bežal
  // celý pod is-scroll-stage a žiadna z jeho hier nemala one-screen disciplínu.
  // Obrazovky, ktoré v ňom skrolovať MAJÚ (nastavenia, výber hier), sú označené
  // triedou .scroll-panel.
  "teambattle",
]);

const DEFAULT_SETTINGS: GameSettings = {
  playerNames: ["Hráč 1", "Hráč 2", "Hráč 3", "Hráč 4"],
  categoryIds: CATEGORIES.map(c => c.id),
  impostorCount: 1,
  hintsEnabled: true,
  noRepeatWords: true,
  timerSeconds: 90,
  strokesPerPlayer: 3,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [welcomeScreen, setWelcomeScreen] = useState<Screen | null>(null);
  const [settings, setSettings] = useLocalStorage<GameSettings>(
    "podvodnik-settings",
    DEFAULT_SETTINGS
  );
  const [history, setHistory] = useLocalStorage<RoundHistoryEntry[]>(
    "podvodnik-history",
    []
  );
  const [usedWords, setUsedWords] = useLocalStorage<Record<string, string[]>>(
    "podvodnik-used-words",
    {}
  );
  const [statistics, setStatistics] = useLocalStorage<GameStatistics>(
    "podvodnik-statistics-v1",
    DEFAULT_STATISTICS
  );
  const [partyRecords, setPartyRecords] = useLocalStorage<PartyRecords>(
    "podvodnik-party-records-v1",
    DEFAULT_PARTY_RECORDS
  );
  const [feedbackSettings, setFeedbackSettings] =
    useLocalStorage<FeedbackSettings>(
      "podvodnik-feedback-settings-v1",
      DEFAULT_FEEDBACK_SETTINGS
    );
  const [storedFavoriteIds, setStoredFavoriteIds] = useLocalStorage<string[]>(
    "podvodnik-favorites-v1",
    []
  );
  const [storedWorkshopCollections, setStoredWorkshopCollections] =
    useLocalStorage<WorkshopCollection[]>("podvodnik-workshop-collections-v2", [
      DEFAULT_COLLECTION,
    ]);
  const workshopEntriesV2ExistedOnStartupRef = useRef(
    (() => {
      try {
        return (
          typeof window !== "undefined" &&
          window.localStorage.getItem("podvodnik-workshop-entries-v2") !== null
        );
      } catch {
        return false;
      }
    })()
  );
  const [storedWorkshopEntries, setStoredWorkshopEntries] = useLocalStorage<
    WorkshopEntry[]
  >("podvodnik-workshop-entries-v2", []);
  const [storedWorkshopSelections, setStoredWorkshopSelections] =
    useLocalStorage<WorkshopSelections>(
      "podvodnik-workshop-selections-v2",
      DEFAULT_WORKSHOP_SELECTIONS
    );
  const [packImportNotice, setPackImportNotice] = useState<{
    kind: "success" | "pending" | "error";
    message: string;
  } | null>(null);
  const [workshopStartupReady, setWorkshopStartupReady] = useState(false);
  const safeFeedbackSettings = normalizeFeedbackSettings(feedbackSettings);
  const favoriteIds = normalizeFavoriteIds(storedFavoriteIds);
  const workshopCollections = normalizeWorkshopCollections(
    storedWorkshopCollections
  );
  const workshopEntries = normalizeWorkshopEntries(
    storedWorkshopEntries,
    workshopCollections
  );
  const workshopSelections = normalizeWorkshopSelections(
    storedWorkshopSelections,
    workshopCollections
  );
  const workshopCollectionsRef = useRef(workshopCollections);
  const workshopEntriesRef = useRef(workshopEntries);
  workshopCollectionsRef.current = workshopCollections;
  workshopEntriesRef.current = workshopEntries;
  const favoriteGames = favoriteIds.flatMap(id => {
    const game = PLAYABLE_GAMES.find(item => item.id === id);
    return game ? [game] : [];
  });
  const [recentlyPlayedScreens, setRecentlyPlayedScreens] = useLocalStorage<
    string[]
  >("podvodnik-recently-played-screens-v1", []);
  const sortedMinigames = useMemo(() => {
    const validRecentlyPlayed = Array.isArray(recentlyPlayedScreens)
      ? recentlyPlayedScreens
      : [];
    return [...MINIGAMES].sort((a, b) => {
      const indexA = validRecentlyPlayed.indexOf(a.screen);
      const indexB = validRecentlyPlayed.indexOf(b.screen);
      if (indexA >= 0 && indexB >= 0) {
        return indexA - indexB;
      }
      if (indexA >= 0) {
        return -1;
      }
      if (indexB >= 0) {
        return 1;
      }
      const origIndexA = MINIGAMES.findIndex(g => g.screen === a.screen);
      const origIndexB = MINIGAMES.findIndex(g => g.screen === b.screen);
      return origIndexA - origIndexB;
    });
  }, [recentlyPlayedScreens]);
  const music = usePartyMusic(
    Boolean(
      safeFeedbackSettings.musicEnabled && safeFeedbackSettings.soundsEnabled
    )
  );
  const gameSessionActiveRef = useRef(false);
  const gameReturnScreenRef = useRef<Screen>("home");
  const statisticsReturnScreenRef = useRef<Screen>("home");
  const settingsReturnScreenRef = useRef<Screen>("home");
  const historyReturnScreenRef = useRef<Screen>("impostor-menu");

  const [assignment, setAssignment] = useState<RoundAssignment | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [votedIndex, setVotedIndex] = useState<number | null>(null);

  // Drawing game state
  const [drawingSettings, setDrawingSettings] = useLocalStorage<GameSettings>(
    "drawing-settings",
    DEFAULT_SETTINGS
  );
  const [drawingAssignment, setDrawingAssignment] =
    useState<RoundAssignment | null>(null);
  const [drawingVotedIndex, setDrawingVotedIndex] = useState<number | null>(
    null
  );

  const selectedTheme = safeFeedbackSettings.partyTheme ?? "dark";
  const activeTheme = GAME_WELCOMES[screen];
  useEffect(() => {
    const root = document.documentElement;
    const previousAccent = root.style.getPropertyValue("--game-accent");
    const previousAccentSoft =
      root.style.getPropertyValue("--game-accent-soft");
    const previousDeep = root.style.getPropertyValue("--game-deep");
    const previousPartyTheme = root.dataset.partyTheme;
    const fallbackTheme = THEME_ACCENTS[selectedTheme];
    root.style.setProperty(
      "--game-accent",
      activeTheme?.accent ?? fallbackTheme.accent
    );
    root.style.setProperty(
      "--game-accent-soft",
      activeTheme?.accentSoft ?? fallbackTheme.soft
    );
    root.style.setProperty(
      "--game-deep",
      activeTheme?.deep ?? fallbackTheme.deep
    );
    root.dataset.partyTheme = selectedTheme;
    return () => {
      if (previousAccent)
        root.style.setProperty("--game-accent", previousAccent);
      else root.style.removeProperty("--game-accent");
      if (previousAccentSoft)
        root.style.setProperty("--game-accent-soft", previousAccentSoft);
      else root.style.removeProperty("--game-accent-soft");
      if (previousDeep) root.style.setProperty("--game-deep", previousDeep);
      else root.style.removeProperty("--game-deep");
      if (previousPartyTheme) root.dataset.partyTheme = previousPartyTheme;
      else delete root.dataset.partyTheme;
    };
  }, [activeTheme, selectedTheme]);

  useEffect(() => {
    document.documentElement.dataset.theme = safeFeedbackSettings.darkMode
      ? "dark"
      : "light";
    document.documentElement.dataset.animations =
      safeFeedbackSettings.animationsEnabled ? "enabled" : "reduced";
  }, [safeFeedbackSettings.darkMode, safeFeedbackSettings.animationsEnabled]);

  useEffect(() => {
    if (NON_GAME_SCREENS.includes(screen)) gameSessionActiveRef.current = false;
  }, [screen]);

  useEffect(() => {
    setStatistics(current => normalizeStatistics(current));
    setPartyRecords(current => normalizePartyRecords(current));
  }, [setPartyRecords, setStatistics]);

  useEffect(() => {
    setFeedbackSettings(current => normalizeFeedbackSettings(current));
    const normalizedFavorites = normalizeFavoriteIds(storedFavoriteIds);
    if (
      JSON.stringify(normalizedFavorites) !== JSON.stringify(storedFavoriteIds)
    )
      setStoredFavoriteIds(normalizedFavorites);
    const normalizedCollections = normalizeWorkshopCollections(
      storedWorkshopCollections
    );
    if (
      JSON.stringify(normalizedCollections) !==
      JSON.stringify(storedWorkshopCollections)
    )
      setStoredWorkshopCollections(normalizedCollections);
    const validStoredWorkshopEntries = Array.isArray(storedWorkshopEntries)
      ? storedWorkshopEntries
      : [];
    const normalizedV2Workshop = normalizeWorkshopEntries(
      validStoredWorkshopEntries,
      normalizedCollections
    );
    let normalizedWorkshop = normalizedV2Workshop;
    let migratedLegacyWorkshop = false;
    if (!workshopEntriesV2ExistedOnStartupRef.current) {
      try {
        const legacy = window.localStorage.getItem("podvodnik-workshop-v1");
        if (legacy) {
          const normalizedLegacyWorkshop = normalizeWorkshopEntries(
            JSON.parse(legacy),
            normalizedCollections
          );
          if (normalizedLegacyWorkshop.length > 0) {
            normalizedWorkshop = normalizedLegacyWorkshop;
            migratedLegacyWorkshop = true;
          }
        }
      } catch {
        /* Malformed legacy data is ignored by the normalizer. */
      }
    }
    if (migratedLegacyWorkshop) {
      try {
        const serialized = JSON.stringify(normalizedWorkshop);
        window.localStorage.setItem(
          "podvodnik-workshop-entries-v2",
          serialized
        );
        if (
          window.localStorage.getItem("podvodnik-workshop-entries-v2") ===
          serialized
        ) {
          window.localStorage.removeItem("podvodnik-workshop-v1");
        }
      } catch {
        /* Keep the legacy key when the migrated value cannot be persisted. */
      }
    }
    if (
      JSON.stringify(normalizedWorkshop) !==
      JSON.stringify(storedWorkshopEntries)
    )
      setStoredWorkshopEntries(normalizedWorkshop);
    const normalizedSelections = normalizeWorkshopSelections(
      storedWorkshopSelections,
      normalizedCollections
    );
    if (
      JSON.stringify(normalizedSelections) !==
      JSON.stringify(storedWorkshopSelections)
    )
      setStoredWorkshopSelections(normalizedSelections);
    setWorkshopStartupReady(true);
    // Persisted values are migrated once on startup; setters are stable for the lifetime of the app.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!workshopStartupReady) return;
    const consumePackLink = () => {
      let link;
      try {
        link = parsePartyPackLink(window.location.href);
      } catch (reason) {
        setPackImportNotice({
          kind: "error",
          message:
            reason instanceof PartyPackError || reason instanceof Error
              ? reason.message
              : "QR odkaz balíka sa nepodarilo prečítať.",
        });
        setScreen("party-hub");
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`
        );
        return;
      }
      if (!link) return;
      setWelcomeScreen(null);
      setScreen("party-hub");
      try {
        const accumulated = accumulatePartyPackLink(link, window.localStorage);
        if (accumulated.status === "pending") {
          setPackImportNotice({
            kind: "pending",
            message: `QR časť ${link.index} z ${link.total} bola uložená. Načítané ${accumulated.received}/${accumulated.total}; pokračujte ďalším QR kódom.`,
          });
        } else {
          const installed = installPartyPack(
            accumulated.pack,
            workshopCollectionsRef.current,
            workshopEntriesRef.current
          );
          setStoredWorkshopCollections(installed.collections);
          setStoredWorkshopEntries(installed.entries);
          setPackImportNotice({
            kind: "success",
            message: `Balík „${installed.collection.name}“ sa automaticky importoval ako nová kolekcia (${installed.entryCount} kariet).`,
          });
        }
      } catch (reason) {
        setPackImportNotice({
          kind: "error",
          message:
            reason instanceof PartyPackError || reason instanceof Error
              ? reason.message
              : "QR balík sa nepodarilo importovať.",
        });
      } finally {
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`
        );
      }
    };
    consumePackLink();
    window.addEventListener("hashchange", consumePackLink);
    return () => window.removeEventListener("hashchange", consumePackLink);
    // The refs keep same-tab camera/hash imports on the latest normalized local data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshopStartupReady]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!gameSessionActiveRef.current) return;
      setStatistics(current =>
        applyStatisticsEvent(current, { playSeconds: 1 })
      );
    }, 1000);
    return () => window.clearInterval(timer);
  }, [setStatistics]);

  function startGameSession(gameScreen: Screen) {
    if (gameSessionActiveRef.current) return;
    gameSessionActiveRef.current = true;
    const gameId = PLAYABLE_GAMES.find(game => game.screen === gameScreen)?.id;
    setStatistics(current =>
      applyStatisticsEvent(current, { gamesStarted: 1, gameId })
    );

    const isMinigame = MINIGAMES.some(g => g.screen === gameScreen);
    if (isMinigame) {
      setRecentlyPlayedScreens(current => {
        const filtered = Array.isArray(current)
          ? current.filter(s => s !== gameScreen)
          : [];
        return [gameScreen, ...filtered];
      });
    }
  }

  function recordCorrectAnswers(correctAnswers: number) {
    if (correctAnswers <= 0) return;
    setStatistics(current => applyStatisticsEvent(current, { correctAnswers }));
  }

  function recordPartyResult(summary: TeamBattleSummary) {
    setStatistics(current =>
      applyStatisticsEvent(current, {
        correctAnswers: summary.correctAnswers,
        partyWinnerName: summary.winnerName,
      })
    );
    const highestIndex =
      summary.totalScores[0] >= summary.totalScores[1] ? 0 : 1;
    setPartyRecords(current =>
      applyPartyCompletionRecord(current, {
        durationSeconds: summary.durationSeconds,
        score: summary.totalScores[highestIndex],
        teamName: summary.teamNames[highestIndex],
      })
    );
  }

  function recordFastestGuess(record: WordGuessRecordInput) {
    setPartyRecords(current => applyFastestGuessRecord(current, record));
  }

  function recordBombRound() {
    setStatistics(current =>
      applyStatisticsEvent(current, { bombRoundsCompleted: 1 })
    );
  }

  function claimDailyReward() {
    setStatistics(current =>
      applyStatisticsEvent(current, { dailyRewardClaim: true })
    );
  }

  function toggleFavorite(id: string) {
    setStoredFavoriteIds(current => {
      const normalized = normalizeFavoriteIds(current);
      return normalized.includes(id)
        ? normalized.filter(item => item !== id)
        : normalizeFavoriteIds([...normalized, id]);
    });
  }

  function customControls(game: CustomContentGame): CustomContentControls {
    const countsByCollection = countCompatibleEntries(workshopEntries, game);
    const compatibleEntries = filterWorkshopEntries(workshopEntries, game, {
      enabled: true,
      collectionIds: workshopCollections.map(collection => collection.id),
    });
    return {
      collections: workshopCollections,
      selection: workshopSelections[game],
      countsByCollection,
      compatibleEntryCollectionIds: compatibleEntries.map(
        entry => entry.collectionIds
      ),
      onChange: selection =>
        setStoredWorkshopSelections(current => ({
          ...normalizeWorkshopSelections(current, workshopCollections),
          [game]: selection,
        })),
    };
  }

  function customEntries(game: CustomContentGame) {
    return filterWorkshopEntries(
      workshopEntries,
      game,
      workshopSelections[game]
    );
  }

  function navigateFromMenu(next: Screen) {
    const enteringGame = !NON_GAME_SCREENS.includes(next);
    if (enteringGame && NON_GAME_SCREENS.includes(screen))
      gameReturnScreenRef.current = screen;
    if (next === "statistics" && NON_GAME_SCREENS.includes(screen))
      statisticsReturnScreenRef.current = screen;
    if (next === "settings" && NON_GAME_SCREENS.includes(screen))
      settingsReturnScreenRef.current = screen;
    if (next === "impostor-history" && NON_GAME_SCREENS.includes(screen))
      historyReturnScreenRef.current = screen;
    const hasWelcome = Boolean(GAME_WELCOMES[next]);
    setScreen(next);
    setWelcomeScreen(hasWelcome ? next : null);
    if (!hasWelcome && enteringGame) startGameSession(next);
  }

  function returnFromActiveGame(fallback: Screen) {
    const target = NON_GAME_SCREENS.includes(gameReturnScreenRef.current)
      ? gameReturnScreenRef.current
      : fallback;
    setWelcomeScreen(null);
    setScreen(target);
  }

  function backFromWelcome(current: Screen) {
    const fallback =
      current === "teambattle"
        ? "home"
        : current === "impostor-setup" || current === "drawing-setup"
          ? "impostor-menu"
          : "minigames-menu";
    returnFromActiveGame(fallback);
  }

  function startNewRound(currentSettings: GameSettings) {
    const { assignment: newAssignment, usedWords: newUsed } = generateRound(
      currentSettings,
      CATEGORIES,
      usedWords
    );
    setAssignment(newAssignment);
    setUsedWords(newUsed);
    setVotedIndex(null);
    setElapsedSeconds(0);
    setScreen("impostor-reveal");
  }

  function handleStartSetup(newSettings: GameSettings) {
    setSettings(newSettings);
    startNewRound(newSettings);
  }

  function startDrawingRound(s: GameSettings) {
    const { assignment: a, usedWords: newUsed } = generateRound(
      s,
      DRAWING_CATEGORIES,
      usedWords
    );
    setDrawingAssignment(a);
    setUsedWords(newUsed);
    setDrawingVotedIndex(null);
    setScreen("drawing-reveal");
  }

  function handleDrawingSetupStart(s: GameSettings) {
    setDrawingSettings(s);
    startDrawingRound(s);
  }

  function handleDrawingVote(voted: number | null) {
    setDrawingVotedIndex(voted);
    setScreen("drawing-result");
  }

  function handleVoteConfirm(voted: number | null) {
    if (!assignment) return;
    setVotedIndex(voted);
    const caught = voted !== null && assignment.impostorIndexes.includes(voted);
    const entry: RoundHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      roundNumber: history.length + 1,
      word: assignment.word,
      categoryName: assignment.categoryName,
      categoryIcon: assignment.categoryIcon,
      timeSeconds: elapsedSeconds || settings.timerSeconds,
      impostors: assignment.impostorIndexes.map(i => settings.playerNames[i]),
      playersWon: caught,
      timestamp: Date.now(),
    };
    setHistory([...history, entry]);
    setScreen("impostor-result");
  }

  if (welcomeScreen === screen && activeTheme) {
    return (
      <FeedbackProvider settings={safeFeedbackSettings}>
        <div
          className="app-screen-frame game-welcome-frame"
          data-screen={screen}
        >
          <GameWelcome
            config={activeTheme}
            onBack={() => backFromWelcome(screen)}
            onStart={() => {
              startGameSession(screen);
              setWelcomeScreen(null);
            }}
          />
        </div>
      </FeedbackProvider>
    );
  }

  const canExitActiveGame = !NON_GAME_SCREENS.includes(screen);

  function leaveActiveGame() {
    if (screen === "teambattle") returnFromActiveGame("home");
    else if (screen.startsWith("impostor") || screen.startsWith("drawing"))
      returnFromActiveGame("impostor-menu");
    else returnFromActiveGame("minigames-menu");
  }

  function renderScreen() {
    switch (screen) {
      case "home":
        return (
          <Home
            onNavigate={navigateFromMenu}
            statistics={statistics}
            onSettings={() => navigateFromMenu("settings")}
            favoriteGames={favoriteGames}
            onToggleFavorite={toggleFavorite}
          />
        );

      case "party-hub":
        return (
          <PartyHub
            statistics={statistics}
            settings={safeFeedbackSettings}
            musicSupported={music.supported}
            musicBlocked={music.blocked}
            collections={workshopCollections}
            workshopEntries={workshopEntries}
            packImportNotice={packImportNotice}
            onCollectionsChange={setStoredWorkshopCollections}
            onWorkshopChange={setStoredWorkshopEntries}
            onSettingsChange={setFeedbackSettings}
            onClaimDailyReward={claimDailyReward}
            onNavigate={navigateFromMenu}
            onBack={() => setScreen("home")}
          />
        );

      case "statistics":
        return (
          <Statistics
            statistics={statistics}
            records={partyRecords}
            onBack={() => setScreen(statisticsReturnScreenRef.current)}
            onClaimDailyReward={claimDailyReward}
          />
        );

      case "settings":
        return (
          <Settings
            settings={safeFeedbackSettings}
            musicSupported={music.supported}
            musicBlocked={music.blocked}
            onChange={setFeedbackSettings}
            onBack={() => setScreen(settingsReturnScreenRef.current)}
          />
        );

      case "impostor-menu":
        return (
          <GameMenu
            title="Imposter"
            subtitle="Dve verzie obľúbenej hry. Vyberte si tajné slovo alebo kreslenie."
            games={IMPOSTOR_GAMES}
            onBack={() => setScreen("home")}
            onNavigate={navigateFromMenu}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
          />
        );

      case "minigames-menu":
        return (
          <GameMenu
            title="Minihry"
            subtitle="Rýchle hry bez dlhého nastavovania. Stačí si vybrať a začať."
            games={sortedMinigames}
            onBack={() => setScreen("home")}
            onNavigate={navigateFromMenu}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
          />
        );

      case "impostor-setup":
        return (
          <Setup
            initial={settings}
            onBack={() => returnFromActiveGame("impostor-menu")}
            onStart={handleStartSetup}
          />
        );

      case "impostor-reveal":
        if (!assignment) {
          setScreen("impostor-setup");
          return null;
        }
        return (
          <Reveal
            settings={settings}
            assignment={assignment}
            onExit={() => returnFromActiveGame("impostor-menu")}
            onDone={() => setScreen("impostor-discussion")}
          />
        );

      case "impostor-discussion":
        return (
          <Discussion
            settings={settings}
            onExit={() => returnFromActiveGame("impostor-menu")}
            onFinish={elapsed => {
              setElapsedSeconds(elapsed);
              setScreen("impostor-voting");
            }}
          />
        );

      case "impostor-voting":
        return (
          <Voting
            settings={settings}
            onExit={() => returnFromActiveGame("impostor-menu")}
            onConfirm={handleVoteConfirm}
          />
        );

      case "impostor-result":
        if (!assignment) {
          setScreen("home");
          return null;
        }
        return (
          <Result
            settings={settings}
            assignment={assignment}
            votedIndex={votedIndex}
            onNewRound={() => startNewRound(settings)}
            onHome={() => returnFromActiveGame("impostor-menu")}
            onHistory={() => {
              historyReturnScreenRef.current = gameReturnScreenRef.current;
              setScreen("impostor-history");
            }}
          />
        );

      case "impostor-history":
        return (
          <History
            history={history}
            onBack={() => setScreen(historyReturnScreenRef.current)}
            onClear={() => {
              setHistory([]);
              setUsedWords({});
            }}
          />
        );

      case "truth-or-dare":
        return (
          <TruthOrDare
            onBack={() => returnFromActiveGame("minigames-menu")}
            customEntries={customEntries("truth-or-dare")}
            customControls={customControls("truth-or-dare")}
          />
        );

      case "never-have-i-ever":
        return (
          <NeverHaveIEver
            onBack={() => returnFromActiveGame("minigames-menu")}
            customEntries={customEntries("never-have-i-ever")}
            customControls={customControls("never-have-i-ever")}
          />
        );

      case "would-you-rather":
        return (
          <WouldYouRather
            onBack={() => returnFromActiveGame("minigames-menu")}
            customEntries={customEntries("would-you-rather")}
            customControls={customControls("would-you-rather")}
          />
        );

      case "drawing-setup":
        return (
          <DrawingSetup
            initial={drawingSettings}
            onBack={() => returnFromActiveGame("impostor-menu")}
            onStart={handleDrawingSetupStart}
          />
        );

      case "drawing-reveal":
        if (!drawingAssignment) {
          setScreen("drawing-setup");
          return null;
        }
        return (
          <Reveal
            settings={drawingSettings}
            assignment={drawingAssignment}
            mode="drawing"
            onExit={() => returnFromActiveGame("impostor-menu")}
            onDone={() => setScreen("drawing-canvas")}
          />
        );

      case "drawing-canvas":
        if (!drawingAssignment) {
          setScreen("drawing-setup");
          return null;
        }
        return (
          <DrawingCanvas
            settings={drawingSettings}
            assignment={drawingAssignment}
            onExit={() => returnFromActiveGame("impostor-menu")}
            onVote={() => setScreen("drawing-vote")}
          />
        );

      case "drawing-vote":
        return (
          <DrawingVote
            settings={drawingSettings}
            onExit={() => returnFromActiveGame("impostor-menu")}
            onConfirm={handleDrawingVote}
          />
        );

      case "drawing-result":
        if (!drawingAssignment) {
          setScreen("home");
          return null;
        }
        return (
          <DrawingResult
            settings={drawingSettings}
            assignment={drawingAssignment}
            votedIndex={drawingVotedIndex}
            onNewRound={() => startDrawingRound(drawingSettings)}
            onHome={() => returnFromActiveGame("impostor-menu")}
          />
        );

      case "slovnarosada":
        return (
          <SlovnaRosada
            onBack={() => returnFromActiveGame("minigames-menu")}
            customEntries={customEntries("slovnarosada")}
            customControls={customControls("slovnarosada")}
            onWordGuessed={recordFastestGuess}
          />
        );

      case "pingpong":
        return (
          <SlovnyPingPong
            onBack={() => returnFromActiveGame("minigames-menu")}
          />
        );

      case "hadajktosom":
        return (
          <HadajKtoSom
            onBack={() => returnFromActiveGame("minigames-menu")}
            customEntries={customEntries("hadajktosom")}
            customControls={customControls("hadajktosom")}
            onWordGuessed={recordFastestGuess}
          />
        );

      case "ibanepravda":
        return (
          <IbaNepravda onBack={() => returnFromActiveGame("minigames-menu")} />
        );

      case "ktodostanebombu":
        return (
          <KtoDostaneBombu
            onBack={() => returnFromActiveGame("minigames-menu")}
            onRoundComplete={recordBombRound}
          />
        );

      case "hadajemoji":
        return (
          <HadajEmoji
            onBack={() => returnFromActiveGame("minigames-menu")}
            customEntries={customEntries("hadajemoji")}
            customControls={customControls("hadajemoji")}
          />
        );

      case "zakazane":
        return (
          <TeamQuickGame
            game="zakazane"
            onBack={() => returnFromActiveGame("minigames-menu")}
            onGameComplete={recordCorrectAnswers}
          />
        );

      case "pesnicka":
        return (
          <TeamQuickGame
            game="pesnicka"
            onBack={() => returnFromActiveGame("minigames-menu")}
            onGameComplete={recordCorrectAnswers}
          />
        );

      case "hudobny-kviz":
        return (
          <TeamQuickGame
            game="hudobny-kviz"
            onBack={() => returnFromActiveGame("minigames-menu")}
            onGameComplete={recordCorrectAnswers}
          />
        );

      case "zvuk":
        return (
          <TeamQuickGame
            game="zvuk"
            onBack={() => returnFromActiveGame("minigames-menu")}
            onGameComplete={recordCorrectAnswers}
          />
        );

      case "pismeno":
        return (
          <TeamQuickGame
            game="pismeno"
            onBack={() => returnFromActiveGame("minigames-menu")}
            onGameComplete={recordCorrectAnswers}
          />
        );

      case "patzadesat":
        return (
          <TeamQuickGame
            game="patzadesat"
            onBack={() => returnFromActiveGame("minigames-menu")}
            onGameComplete={recordCorrectAnswers}
          />
        );

      case "tic-tac-toe":
        return (
          <TicTacToe onBack={() => returnFromActiveGame("minigames-menu")} />
        );

      case "battleship":
        return (
          <Battleship onBack={() => returnFromActiveGame("minigames-menu")} />
        );

      case "teambattle":
        return (
          <div className="party-mode-experience h-full">
            <TeamBattle
              onHome={() => returnFromActiveGame("home")}
              onGameComplete={recordPartyResult}
              onWordGuessed={recordFastestGuess}
              customQuestions={workshopEntriesToQuiz(
                customEntries("teambattle")
              )}
              customControls={customControls("teambattle")}
            />
          </div>
        );

      default:
        return (
          <Home
            onNavigate={navigateFromMenu}
            statistics={statistics}
            onSettings={() => navigateFromMenu("settings")}
            favoriteGames={favoriteGames}
            onToggleFavorite={toggleFavorite}
          />
        );
    }
  }

  return (
    <FeedbackProvider settings={safeFeedbackSettings}>
      <div
        className={`app-screen-frame ${ONE_SCREEN_GAME_SCREENS.has(screen) ? "is-game-stage" : "is-scroll-stage"}`}
        data-screen={screen}
      >
        {renderScreen()}
      </div>
      {canExitActiveGame && (
        <button
          type="button"
          onClick={leaveActiveGame}
          aria-label="Odísť z hry"
          className="fixed right-3 top-3 z-[100] flex items-center gap-1.5 rounded-full border border-white/20 bg-black/65 px-3 py-2 text-xs font-black text-white shadow-lg backdrop-blur-md transition hover:bg-red-600/85 active:scale-95"
        >
          <span aria-hidden="true" className="text-base leading-none">
            ×
          </span>
          Odísť
        </button>
      )}
    </FeedbackProvider>
  );
}
