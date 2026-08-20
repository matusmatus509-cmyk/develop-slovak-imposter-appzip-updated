import rawCards from "./neverHaveIEver.json";
import type { AppLanguage } from "../i18n/LanguageProvider";

export const NEVER_HAVE_I_EVER_CARD_COUNT = 1500;

export const NEVER_HAVE_I_EVER_CATEGORIES = [
  "school", "work", "family", "friends", "childhood", "travel", "holidays",
  "food", "cooking", "shopping", "money", "sports", "hobbies", "music",
  "movies", "series", "gaming", "internet", "social_media", "technology",
  "parties", "embarrassing", "funny", "everyday_life", "habits", "fears",
  "challenges", "nature", "animals", "transportation", "driving", "concerts",
  "festivals", "relationships", "memories", "mistakes", "achievements",
] as const;

export type NeverHaveIEverCategory = typeof NEVER_HAVE_I_EVER_CATEGORIES[number];
export type NeverHaveIEverIntensity = "normal" | "funny" | "bold" | "party";
export type NeverHaveIEverCard = {
  id: string;
  category: NeverHaveIEverCategory;
  intensity: NeverHaveIEverIntensity;
  translations: Record<AppLanguage, string>;
};

export const NEVER_HAVE_I_EVER_CARDS = rawCards as NeverHaveIEverCard[];

export const NEVER_HAVE_I_EVER_BY_LANGUAGE = Object.fromEntries(
  (["sk", "en", "de", "es", "fr", "pt"] as const).map((language) => [
    language,
    NEVER_HAVE_I_EVER_CARDS.map((card) => card.translations[language]),
  ]),
) as Record<AppLanguage, string[]>;

export function getNeverHaveIEverForLanguage(language: AppLanguage): string[] {
  return NEVER_HAVE_I_EVER_BY_LANGUAGE[language] ?? NEVER_HAVE_I_EVER_BY_LANGUAGE.sk;
}

export const NEVER_HAVE_I_EVER: string[] = NEVER_HAVE_I_EVER_BY_LANGUAGE.sk;
