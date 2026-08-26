import type { SongPoolKey } from "../../data/localizedSongs";

export type QuickPlayMode = "players" | "teams";

export interface QuickParticipantsProps {
  participantNames: string[];
  gameMode: QuickPlayMode;
  onDone: (scores: number[]) => void;
  rounds?: number;
  timeSeconds?: number;
  /**
   * Kategórie hitov pre hudobné minihry. Neuvedené = celá zásoba jazyka hry,
   * takže hry bez hudby ani staršie volania nemusia nič predávať.
   */
  songPools?: readonly SongPoolKey[];
}

export const PARTY_PLAYER_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#a855f7",
  "#10b981",
  "#f59e0b",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

export function makeEmptyScores(names: string[]) {
  return names.map(() => 0);
}
