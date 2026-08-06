import rawCards from "./onlyLies.json";
import type { AppLanguage } from "../i18n/LanguageProvider";

export interface OnlyLiesCard {
  id: string;
  category: string;
  translations: Record<AppLanguage, string>;
}

export const ONLY_LIES_CARDS = rawCards as OnlyLiesCard[];

export const ONLY_LIES_BY_LANGUAGE = Object.fromEntries(
  (["sk", "en", "de", "es", "fr", "pt"] as const).map((language) => [
    language,
    ONLY_LIES_CARDS.map((card) => card.translations[language] ?? card.translations.sk),
  ]),
) as Record<AppLanguage, string[]>;

export function getOnlyLiesForLanguage(language: AppLanguage): string[] {
  return ONLY_LIES_BY_LANGUAGE[language] ?? ONLY_LIES_BY_LANGUAGE.sk;
}

export const ONLY_LIES: string[] = ONLY_LIES_BY_LANGUAGE.sk;
