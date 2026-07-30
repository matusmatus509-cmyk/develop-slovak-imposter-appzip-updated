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

export type AiAudience = "friends" | "family" | "couple";
export type AiVibe = "fun" | "chill" | "competitive";
export type AiIntensity = 1 | 2 | 3;

export interface PartyGeneratorControls {
  audience: AiAudience;
  vibe: AiVibe;
  intensity: AiIntensity;
  playerCount?: number;
  context: string;
}

export interface GeneratedPrompt {
  kind: Exclude<WorkshopEntryKind, "emoji" | "word">;
  text: string;
  answer?: string;
}

export interface GeneratedGameGroup {
  id: string;
  screen: Extract<Screen, "truth-or-dare" | "never-have-i-ever" | "would-you-rather" | "hadajktosom" | "slovnarosada" | "teambattle">;
  title: string;
  icon: string;
  prompts: GeneratedPrompt[];
}

export interface GeneratedPartySession {
  id: string;
  title: string;
  summary: string;
  themeTags: string[];
  controls: PartyGeneratorControls;
  groups: GeneratedGameGroup[];
}

export interface GeneratedLaunchPayload {
  sessionId: string;
  screen: GeneratedGameGroup["screen"];
  title: string;
  prompts: GeneratedPrompt[];
}

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
