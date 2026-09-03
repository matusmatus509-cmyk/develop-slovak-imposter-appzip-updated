import rawCards from "./charades.sk.json";
import localizedTexts from "./charades.locales.json";
import type { AppLanguage } from "../i18n/LanguageProvider";

export type CharadesCategory =
  | "animals"
  | "food"
  | "professions"
  | "sports"
  | "activities"
  | "vehicles"
  | "objects"
  | "household"
  | "clothing"
  | "nature"
  | "places"
  | "instruments"
  | "health"
  | "games"
  | "school"
  | "technology"
  | "people";

export const CHARADES_CATEGORY_LABELS: Record<CharadesCategory, string> = {
  animals: "Zvieratá",
  food: "Jedlo a nápoje",
  professions: "Povolania",
  sports: "Šport",
  activities: "Aktivity",
  vehicles: "Doprava",
  objects: "Predmety",
  household: "Domácnosť",
  clothing: "Oblečenie",
  nature: "Príroda",
  places: "Miesta",
  instruments: "Hudobné nástroje",
  health: "Telo a zdravie",
  games: "Hry a zábava",
  school: "Škola",
  technology: "Technológie",
  people: "Ľudia a postavy",
};

export const CHARADES_CATEGORY_ICONS: Record<CharadesCategory, string> = {
  animals: "🐾",
  food: "🍕",
  professions: "🧑‍🔧",
  sports: "⚽",
  activities: "🎯",
  vehicles: "🚗",
  objects: "🔧",
  household: "🏠",
  clothing: "👕",
  nature: "🌳",
  places: "📍",
  instruments: "🎸",
  health: "🧬",
  games: "🎲",
  school: "🏫",
  technology: "💻",
  people: "🧍",
};

export const CHARADES_CATEGORY_IDS = Object.keys(
  CHARADES_CATEGORY_LABELS,
) as CharadesCategory[];

export interface CharadesCard {
  id: string;
  text: string;
  category: CharadesCategory;
}

type LocalizedCharadesTexts = Record<Exclude<AppLanguage, "sk">, Record<string, string>>;

/**
 * Jediný zdroj kartičiek pre samostatnú minihru aj Party mód.
 * Databáza nepozná obtiažnosť — sú to bežné, ľahko zahrateľné slová.
 * Podrobná obsahová a štrukturálna kontrola sa spúšťa cez `npm run validate:charades`.
 */
export const CHARADES_CARDS = rawCards as CharadesCard[];
const CHARADES_LOCALIZED_TEXTS = localizedTexts as LocalizedCharadesTexts;

export function getCharadesCardsForLanguage(language: AppLanguage): CharadesCard[] {
  if (language === "sk") return CHARADES_CARDS;
  const translations = CHARADES_LOCALIZED_TEXTS[language];
  return CHARADES_CARDS.map((card) => ({
    ...card,
    text: translations[card.id] ?? card.text,
  }));
}

export function getCharadesWordsForLanguage(language: AppLanguage): string[] {
  return getCharadesCardsForLanguage(language).map((card) => card.text);
}

// Počty kariet v jednotlivých kategóriách (rovnaké pre všetky jazyky).
export const CHARADES_CATEGORY_COUNTS: Record<CharadesCategory, number> =
  CHARADES_CARDS.reduce(
    (acc, card) => {
      acc[card.category] = (acc[card.category] ?? 0) + 1;
      return acc;
    },
    {} as Record<CharadesCategory, number>,
  );

/** Vlastná karta: jeden konkrétny pojem alebo krátke spojenie, nie veta. */
export function isValidCharadeText(value: string) {
  const text = value.trim().replace(/\s+/g, " ");
  const words = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [];
  return Boolean(text) && text.length <= 62 && words.length >= 1 && words.length <= 3 && !/[:;|/]/.test(text);
}

// Kompatibilné textové exporty používajú existujúce obrazovky a Party mód.
export const ALL_SOLO_CHARADES_WORDS: string[] = CHARADES_CARDS.map((card) => card.text);
export const ALL_TEAM_CHARADES_WORDS: string[] = [...ALL_SOLO_CHARADES_WORDS];
