import rawCards from "./onlyLies.json";
import type { AppLanguage } from "../i18n/LanguageProvider";
import { registerEnglishContent } from "../i18n/contentRegistry";

export interface OnlyLiesCard {
  id: string;
  category: string;
  translations: { sk: string } & Partial<Record<Exclude<AppLanguage, "sk">, string>>;
}

export const ONLY_LIES_CARDS = rawCards as OnlyLiesCard[];
registerEnglishContent(ONLY_LIES_CARDS.map((card) => card.translations.en));

export const ONLY_LIES_BY_LANGUAGE = Object.fromEntries(
  (["sk", "en", "de", "es", "fr", "pt"] as const).map((language) => [
    language,
    ONLY_LIES_CARDS.map((card) => card.translations[language] ?? card.translations.sk),
  ]),
) as Record<AppLanguage, string[]>;

export function getOnlyLiesForLanguage(language: AppLanguage): string[] {
  return ONLY_LIES_BY_LANGUAGE[language] ?? ONLY_LIES_BY_LANGUAGE.sk;
}

/** Text kartičky v jazyku hry (slovenčina ako záloha pre nepreložené jazyky). */
export function onlyLiesText(card: OnlyLiesCard, language: AppLanguage): string {
  return card.translations[language] ?? card.translations.sk;
}

export const ONLY_LIES: string[] = ONLY_LIES_BY_LANGUAGE.sk;
