import type { SongPoolKey } from "../../data/localizedSongs";
import { PLAYER_BADGE_COLORS } from "../../components/PlayerNamesField";
import { TEAM_COLORS } from "../../data/teamBattle";

export type QuickPlayMode = "players" | "teams";

export interface QuickParticipantsProps {
  participantNames: string[];
  gameMode: QuickPlayMode;
  onDone: (scores: number[]) => void;
  rounds?: number;
  timeSeconds?: number;
  /**
   * Kategórie hitov pre hudobné minihry. Neuvedené = celá zásoba jazyka hry.
   */
  songPools?: readonly SongPoolKey[];
}

/**
 * Prvé dve farby sú totožné s kanonickými farbami Party Mode. Tím A tak
 * zostáva modrý a tím B červený aj v rýchlych výzvach a bzučiakoch.
 * Ďalšie farby zostávajú dostupné pre samostatné režimy s viacerými hráčmi.
 */
export const PARTY_PLAYER_COLORS = [
  TEAM_COLORS[0],
  TEAM_COLORS[1],
  ...PLAYER_BADGE_COLORS.slice(2),
];

export function makeEmptyScores(names: string[]) {
  return names.map(() => 0);
}
