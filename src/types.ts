export type Screen =
  | "home"
  | "stats"
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
  | "teambattle";

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

export interface AppStats {
  gamesPlayed: number;       // každý koniec hry (impostor result, minigame result, party gameover)
  teamWins: number;          // výhry tímu v party mode (gameover s víťazom)
  totalTimeSeconds: number;  // súčet sekúnd zo všetkých diskusií/hier
  correctAnswers: number;    // správne odpovede (playersWon + minigame/party skóre)
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
