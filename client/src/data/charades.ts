import rawCards from "./charades.sk.json";
import localizedTexts from "./charades.locales.json";
import type { AppLanguage } from "../i18n/LanguageProvider";

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

type LocalizedCharadesTexts = Record<Exclude<AppLanguage, "sk">, Record<string, string>>;

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
const CHARADES_LOCALIZED_TEXTS = localizedTexts as LocalizedCharadesTexts;

// Mená ľudí, postáv, skupín, hier a pamiatok sa medzinárodne používajú v
// pôvodnej podobe. Doslovný strojový preklad by z nich robil neznáme názvy.
const INTERNATIONAL_NAME_CATEGORIES = new Set<CharadesCategory>([
  "famous_characters", "superheroes", "video_games", "music", "landmarks",
]);

const LOCALIZED_TEXT_OVERRIDES: Partial<Record<Exclude<AppLanguage, "sk">, Record<string, string>>> = {
  en: { "Stojka": "Handstand", "Drepy": "Squats", "Kliky": "Push-ups", "Kotrmelec": "Somersault", "Premet": "Cartwheel", "Cúvanie s vlečkou": "Reversing with a trailer", "Kliešť": "Tick", "Sob": "Reindeer", "Skúšobná kabínka": "Fitting room" },
  de: { "Stojka": "Handstand", "Drepy": "Kniebeugen", "Kliky": "Liegestütze", "Kotrmelec": "Purzelbaum", "Premet": "Radschlag", "Cúvanie s vlečkou": "Rückwärtsfahren mit Anhänger", "Kliešť": "Zecke", "Sob": "Rentier", "Skúšobná kabínka": "Umkleidekabine" },
  es: { "Stojka": "Pino", "Drepy": "Sentadillas", "Kliky": "Flexiones", "Kotrmelec": "Voltereta", "Premet": "Rueda lateral", "Cúvanie s vlečkou": "Dar marcha atrás con remolque", "Kliešť": "Garrapata", "Sob": "Reno", "Skúšobná kabínka": "Probador" },
  fr: { "Stojka": "Poire", "Drepy": "Squats", "Kliky": "Pompes", "Kotrmelec": "Culbute", "Premet": "Roue", "Cúvanie s vlečkou": "Reculer avec une remorque", "Kliešť": "Tique", "Sob": "Renne", "Skúšobná kabínka": "Cabine d’essayage" },
  pt: { "Stojka": "Parada de mãos", "Drepy": "Agachamentos", "Kliky": "Flexões", "Kotrmelec": "Cambalhota", "Premet": "Roda", "Cúvanie s vlečkou": "Dar marcha à ré com reboque", "Kliešť": "Carrapato", "Sob": "Rena", "Skúšobná kabínka": "Provador" },
};

export function getCharadesCardsForLanguage(language: AppLanguage): CharadesCard[] {
  if (language === "sk") return CHARADES_CARDS;
  const translations = CHARADES_LOCALIZED_TEXTS[language];
  const overrides = LOCALIZED_TEXT_OVERRIDES[language] ?? {};
  return CHARADES_CARDS.map((card) => ({
    ...card,
    text: INTERNATIONAL_NAME_CATEGORIES.has(card.category)
      ? card.text
      : overrides[card.text] ?? translations[card.id] ?? card.text,
  }));
}

export function getCharadesCardsByDifficulty(language: AppLanguage): Record<CharadesDifficulty, CharadesCard[]> {
  const cards = getCharadesCardsForLanguage(language);
  return {
    lahke: cards.filter((card) => card.difficulty === databaseDifficulty.lahke),
    stredne: cards.filter((card) => card.difficulty === databaseDifficulty.stredne),
    tazke: cards.filter((card) => card.difficulty === databaseDifficulty.tazke),
  };
}

export function getCharadesWordsByDifficulty(language: AppLanguage): Record<CharadesDifficulty, string[]> {
  const cards = getCharadesCardsByDifficulty(language);
  return {
    lahke: cards.lahke.map((card) => card.text),
    stredne: cards.stredne.map((card) => card.text),
    tazke: cards.tazke.map((card) => card.text),
  };
}

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
