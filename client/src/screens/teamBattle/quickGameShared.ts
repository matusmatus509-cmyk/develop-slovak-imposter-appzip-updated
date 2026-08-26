import type { SongPoolKey } from "../../data/localizedSongs";
import { PLAYER_BADGE_COLORS } from "../../components/PlayerNamesField";

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

/**
 * Farby účastníkov. Definíciu drží `PlayerNamesField`, aby odznak pri zadávaní
 * mena a farba toho istého hráča v skóre nikdy nerozišli.
 */
export const PARTY_PLAYER_COLORS = PLAYER_BADGE_COLORS;

export function makeEmptyScores(names: string[]) {
  return names.map(() => 0);
}
