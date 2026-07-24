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
  | "teambattle"
  | "statistics"
  | "settings";

export interface FeedbackSettings {
  darkMode: boolean;
  soundsEnabled: boolean;
  vibrationEnabled: boolean;
  animationsEnabled: boolean;
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
  teamWins: Record<string, number>;
  totalPlaySeconds: number;
  correctAnswers: number;
  progression: PlayerProgression;
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
