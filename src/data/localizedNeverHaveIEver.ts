import type { AppLanguage } from "../i18n/LanguageProvider";
import { getNeverHaveIEverSourceLines } from "./neverHaveIEverSource";

export type NeverHaveIEverCard = Record<AppLanguage, string>;

export const NEVER_HAVE_I_EVER_CARD_COUNT = 1500;

const LANGUAGES: readonly AppLanguage[] = ["sk", "en", "de", "es", "fr", "pt"];

const OPENINGS: Record<AppLanguage, RegExp> = {
  sk: /^Nikdy som (sa |si )?nikdy ne/u,
  en: /^Never have I ever /u,
  de: /^Ich (habe|bin|war)( mich| mir)? noch nie /u,
  es: /^Nunca /u,
  fr: /^Je n'ai jamais |^Je ne me suis jamais |^Je ne suis jamais /u,
  pt: /^Nunca /u,
};

const cards: NeverHaveIEverCard[] = getNeverHaveIEverSourceLines().map((line, index) => {
  const columns = line.split("|").map((column) => column.trim());
  if (columns.length !== LANGUAGES.length || columns.some((column) => !column)) {
    throw new Error(`Never Have I Ever card ${index + 1} must provide all six languages: ${line}`);
  }
  const card = Object.fromEntries(LANGUAGES.map((language, position) => [language, columns[position]])) as NeverHaveIEverCard;
  const invalidLanguage = LANGUAGES.find((language) => !OPENINGS[language].test(card[language]) || !card[language].endsWith("."));
  if (invalidLanguage) {
    throw new Error(`Never Have I Ever card ${index + 1} is not phrased correctly in "${invalidLanguage}": ${card[invalidLanguage]}`);
  }
  return card;
});

if (cards.length !== NEVER_HAVE_I_EVER_CARD_COUNT) {
  throw new Error(`Never Have I Ever catalogue must contain exactly ${NEVER_HAVE_I_EVER_CARD_COUNT} cards, got ${cards.length}.`);
}

const duplicatedLanguage = LANGUAGES.find((language) => new Set(cards.map((card) => card[language].toLocaleLowerCase())).size !== cards.length);
if (duplicatedLanguage) {
  const seen = new Set<string>();
  const duplicate = cards.map((card) => card[duplicatedLanguage].toLocaleLowerCase()).find((text) => seen.size === seen.add(text).size);
  throw new Error(`Never Have I Ever catalogue repeats a card in "${duplicatedLanguage}": ${duplicate}`);
}

export const NEVER_HAVE_I_EVER_CARDS: NeverHaveIEverCard[] = cards;

export const NEVER_HAVE_I_EVER_BY_LANGUAGE = Object.fromEntries(
  LANGUAGES.map((language) => [language, cards.map((card) => card[language])]),
) as Record<AppLanguage, string[]>;

export function getNeverHaveIEverForLanguage(language: AppLanguage): string[] {
  return NEVER_HAVE_I_EVER_BY_LANGUAGE[language] ?? NEVER_HAVE_I_EVER_BY_LANGUAGE.sk;
}

export const NEVER_HAVE_I_EVER: string[] = NEVER_HAVE_I_EVER_BY_LANGUAGE.sk;
