import rawCards from "./charades.sk.json";

export type CharadesDifficulty = "lahke" | "stredne" | "tazke";
export type CharadesDatabaseDifficulty = "easy" | "medium" | "hard";
export type CharadesCategory =
  | "animals" | "food" | "fruits" | "vegetables" | "drinks" | "professions" | "sports"
  | "activities" | "actions" | "vehicles" | "objects" | "household" | "clothing" | "nature"
  | "weather" | "places" | "buildings" | "travel" | "music" | "instruments" | "movies"
  | "tv_series" | "cartoons" | "fairy_tales" | "superheroes" | "video_games"
  | "famous_characters" | "mythical_creatures" | "holidays" | "emotions" | "history" | "landmarks";

export interface CharadesCard {
  id: string;
  text: string;
  difficulty: CharadesDatabaseDifficulty;
  category: CharadesCategory;
}

const databaseDifficulty: Record<CharadesDifficulty, CharadesDatabaseDifficulty> = {
  lahke: "easy",
  stredne: "medium",
  tazke: "hard",
};

/**
 * Jediný zdroj kartičiek pre samostatnú minihru aj Party mód.
 * Podrobná obsahová a štrukturálna kontrola sa spúšťa cez `npm run validate:charades`.
 */
export const CHARADES_CARDS = rawCards as CharadesCard[];

export const CHARADES_CARDS_BY_DIFFICULTY: Record<CharadesDifficulty, CharadesCard[]> = {
  lahke: CHARADES_CARDS.filter((card) => card.difficulty === databaseDifficulty.lahke),
  stredne: CHARADES_CARDS.filter((card) => card.difficulty === databaseDifficulty.stredne),
  tazke: CHARADES_CARDS.filter((card) => card.difficulty === databaseDifficulty.tazke),
};

/** Vlastná karta: jeden konkrétny pojem alebo krátke ustálené spojenie, nie veta. */
export function isValidCharadeText(value: string) {
  const text = value.trim().replace(/\s+/g, " ");
  const words = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [];
  return Boolean(text) && text.length <= 62 && words.length >= 1 && words.length <= 5 && !/[:;|/]/.test(text);
}

// Kompatibilné textové exporty používajú existujúce obrazovky a Party mód.
export const SOLO_CHARADES_WORDS: Record<CharadesDifficulty, string[]> = {
  lahke: CHARADES_CARDS_BY_DIFFICULTY.lahke.map((card) => card.text),
  stredne: CHARADES_CARDS_BY_DIFFICULTY.stredne.map((card) => card.text),
  tazke: CHARADES_CARDS_BY_DIFFICULTY.tazke.map((card) => card.text),
};

export const TEAM_CHARADES_WORDS: Record<CharadesDifficulty, string[]> = {
  lahke: [...SOLO_CHARADES_WORDS.lahke],
  stredne: [...SOLO_CHARADES_WORDS.stredne],
  tazke: [...SOLO_CHARADES_WORDS.tazke],
};

export const ALL_SOLO_CHARADES_WORDS = CHARADES_CARDS.map((card) => card.text);
export const ALL_TEAM_CHARADES_WORDS = Object.values(TEAM_CHARADES_WORDS).flat();
