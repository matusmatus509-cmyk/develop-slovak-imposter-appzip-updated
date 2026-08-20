import rawCards from "./wouldYouRather.json";
import type { AppLanguage } from "../i18n/LanguageProvider";

export const WOULD_YOU_RATHER_CARD_COUNT = 1500;

export const WOULD_YOU_RATHER_CATEGORIES = [
  "everyday", "funny", "food", "travel", "technology", "fantasy",
  "superpowers", "future", "friends", "family", "relationships",
  "school", "work", "money", "animals", "nature", "movies",
  "gaming", "sports", "hobbies", "music", "lifestyle",
  "difficult_choices", "imagination"
] as const;

export type WouldYouRatherCategory = typeof WOULD_YOU_RATHER_CATEGORIES[number];
export type WouldYouRatherDifficulty = "easy" | "normal" | "difficult";
export type WouldYouRatherCard = {
  id: string;
  category: WouldYouRatherCategory;
  difficulty: WouldYouRatherDifficulty;
  optionA: Record<AppLanguage, string>;
  optionB: Record<AppLanguage, string>;
};

export const WOULD_YOU_RATHER_CARDS = rawCards as WouldYouRatherCard[];

export type WouldYouRatherPair = { a: string; b: string };

export const WOULD_YOU_RATHER_BY_LANGUAGE = Object.fromEntries(
  (["sk", "en", "de", "es", "fr", "pt"] as const).map((language) => [
    language,
    WOULD_YOU_RATHER_CARDS.map((card) => ({
      a: card.optionA[language],
      b: card.optionB[language],
    })),
  ]),
) as Record<AppLanguage, WouldYouRatherPair[]>;

export function getWouldYouRatherForLanguage(language: AppLanguage): WouldYouRatherPair[] {
  return WOULD_YOU_RATHER_BY_LANGUAGE[language] ?? WOULD_YOU_RATHER_BY_LANGUAGE.sk;
}

export const WOULD_YOU_RATHER: WouldYouRatherPair[] = WOULD_YOU_RATHER_BY_LANGUAGE.sk;
