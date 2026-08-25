export type Screen =
  | "home"
  | "impostor-menu"
  | "minigames-menu"
  | "impostor-setup"
  | "impostor-reveal"
  | "impostor-discussion"
  | "impostor-voting"
  | "impostor-result"
  | "impostor-history"
  | "buzz-setup"
  | "buzz-reveal"
  | "buzz-round"
  | "buzz-times"
  | "buzz-voting"
  | "buzz-result"
  | "truth-or-dare"
  | "would-you-rather"
  | "never-have-i-ever"
  | "drawing-setup"
  | "drawing-reveal"
  | "drawing-canvas"
  | "drawing-vote"
  | "drawing-result"
  | "slovnarosada"
  | "pingpong"
  | "hadajktosom"
  | "ibanepravda"
  | "ktodostanebombu"
  | "hadajemoji"
  | "zakazane"
  | "pesnicka"
  | "hudobny-kviz"
  | "zvuk"
  | "pismeno"
  | "patzadesat"
  | "tic-tac-toe"
  | "battleship"
  | "teambattle"
  | "party-hub"
  | "statistics"
  | "settings";

export type PartyTheme = "dark" | "neon" | "gold" | "halloween" | "christmas" | "galaxy";

export type WorkshopEntryKind =
  | "truth"
  | "dare"
  | "never"
  | "wouldRather"
  | "emoji"
  | "quiz"
  | "person"
  | "charade"
  | "word";

export interface WorkshopCollection {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: number;
}

export interface WorkshopEntry {
  id: string;
  kind: WorkshopEntryKind;
  text: string;
  answer?: string;
  collectionIds: string[];
  enabled: boolean;
  likes: number;
  rating: number;
  ratingCount: number;
  userRating?: number;
  createdAt: number;
}

export type CustomContentGame =
  | "truth-or-dare"
  | "never-have-i-ever"
  | "would-you-rather"
  | "hadajemoji"
  | "hadajktosom"
  | "slovnarosada"
  | "teambattle";

export interface WorkshopSelection {
  enabled: boolean;
  collectionIds: string[];
}

export type WorkshopSelections = Record<CustomContentGame, WorkshopSelection>;

export interface FeedbackSettings {
  darkMode: boolean;
  soundsEnabled: boolean;
  vibrationEnabled: boolean;
  animationsEnabled: boolean;
  partyTheme?: PartyTheme;
  musicEnabled?: boolean;
}

export type AchievementId =
  | "first-game"
  | "party-master"
  | "word-expert"
  | "bomb-survivor"
  | "hundred-games";

export interface DailyProgress {
  date: string;
  baselineGames: number;
  baselineCorrectAnswers: number;
  baselinePartyWins: number;
  rewardedChallengeIds: string[];
  lastDailyRewardDate?: string;
}

export interface PlayerProgression {
  xp: number;
  coins: number;
  bombRoundsCompleted: number;
  achievements: Partial<Record<AchievementId, number>>;
  daily: DailyProgress;
}

export interface GameStatistics {
  gamesPlayed: number;
  gamePlayCounts: Record<string, number>;
  teamWins: Record<string, number>;
  totalPlaySeconds: number;
  correctAnswers: number;
  progression: PlayerProgression;
}

export interface PartyRecords {
  longestParty: { durationSeconds: number; achievedAt: number } | null;
  highestGameScore: { score: number; teamName: string; achievedAt: number } | null;
  fastestGuess: { word: string; milliseconds: number; gameTitle: string; achievedAt: number } | null;
}

export interface WordGuessRecordInput {
  word: string;
  milliseconds: number;
  gameTitle: string;
}

export interface CategoryDef {
  id: string;
  name: string;
  icon: string;
  wordPairs: { word: string; hint: string }[];
}

export interface GameSettings {
  playerNames: string[];
  categoryIds: string[];
  impostorCount: number;
  hintsEnabled: boolean;
  noRepeatWords: boolean;
  /** Podvodník nevidí, z akej kategórie slovo je — sťaží sa tak jeho odhalenie. */
  hideCategoryFromImpostor: boolean;
  timerSeconds: number; // 0 = bez časovača
  strokesPerPlayer: number; // used by drawing game
}

export interface RoundAssignment {
  word: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  impostorIndexes: number[];
  hintWord: string;
}

export interface RoundHistoryEntry {
  id: string;
  roundNumber: number;
  word: string;
  categoryName: string;
  categoryIcon: string;
  timeSeconds: number;
  impostors: string[];
  playersWon: boolean;
  timestamp: number;
}

/**
 * Buzz Podvodník má vlastné nastavenia namiesto `GameSettings` — nepracuje
 * so slovami ani kategóriami, iba s tajným časom a rozsahom pre podvodníka.
 */
export interface BuzzSettings {
  playerNames: string[];
  /** Okno, z ktorého sa losuje tajný čas kola. */
  targetMinSeconds: number;
  targetMaxSeconds: number;
  /** Šírka rozsahu, ktorý namiesto presného času dostane podvodník. */
  impostorRangeSeconds: number;
  /** Naslepo = hráč počas merania nevidí bežiaci čas, iba výsledok. */
  blindTiming: boolean;
  /** Čas na diskusiu nad verejnými výsledkami (0 = bez limitu). */
  discussionSeconds: number;
}

export interface BuzzAssignment {
  /** Presný cieľ — dostanú ho všetci hráči okrem podvodníka. */
  targetSeconds: number;
  impostorIndex: number;
  /** Rozsah pre podvodníka. Vždy obsahuje `targetSeconds`. */
  rangeMinSeconds: number;
  rangeMaxSeconds: number;
}
