import type { AppLanguage } from "../i18n/LanguageProvider";
import { getDareSourceLines, getTruthSourceLines } from "./truthOrDareSource";

export type TruthOrDareCard = Record<AppLanguage, string>;

/** Final size of each deck once the hand-written catalogue is complete. */
export const TRUTH_OR_DARE_TARGET_COUNT = 1000;

const LANGUAGES: readonly AppLanguage[] = ["sk", "en", "de", "es", "fr", "pt"];

function parse(kind: "truth" | "dare", lines: string[]): TruthOrDareCard[] {
  const terminator = kind === "truth" ? "?" : ".";
  return lines.map((line, index) => {
    const columns = line.split("|").map((column) => column.trim());
    if (columns.length !== LANGUAGES.length || columns.some((column) => !column)) {
      throw new Error(`${kind} card ${index + 1} must provide all six languages: ${line}`);
    }
    const card = Object.fromEntries(LANGUAGES.map((language, position) => [language, columns[position]])) as TruthOrDareCard;
    const invalid = LANGUAGES.find((language) => !card[language].endsWith(terminator) || /\s{2,}/u.test(card[language]));
    if (invalid) throw new Error(`${kind} card ${index + 1} is not phrased correctly in "${invalid}": ${card[invalid]}`);
    return card;
  });
}

function assertUnique(kind: "truth" | "dare", cards: TruthOrDareCard[]) {
  const duplicatedLanguage = LANGUAGES.find((language) => new Set(cards.map((card) => card[language].toLocaleLowerCase())).size !== cards.length);
  if (duplicatedLanguage) throw new Error(`${kind} catalogue repeats a card in "${duplicatedLanguage}".`);
}

// Template detection compares full sentence structures and is expensive, so it
// runs in scripts/check-truth-dare-source.mjs instead of at app startup.
function buildDeck(kind: "truth" | "dare", lines: string[]) {
  const cards = parse(kind, lines);
  assertUnique(kind, cards);
  return cards;
}

export const TRUTH_CARDS: TruthOrDareCard[] = buildDeck("truth", getTruthSourceLines());
export const DARE_CARDS: TruthOrDareCard[] = buildDeck("dare", getDareSourceLines());

if (TRUTH_CARDS.length !== DARE_CARDS.length) {
  throw new Error(`Truth and Dare decks must stay aligned, got ${TRUTH_CARDS.length} and ${DARE_CARDS.length}.`);
}

/** Cards written so far. Reaches TRUTH_OR_DARE_TARGET_COUNT when authoring is finished. */
export const TRUTH_OR_DARE_CARD_COUNT = TRUTH_CARDS.length;

export const TRUTHS_BY_LANGUAGE = Object.fromEntries(LANGUAGES.map((language) => [language, TRUTH_CARDS.map((card) => card[language])])) as Record<AppLanguage, string[]>;
export const DARES_BY_LANGUAGE = Object.fromEntries(LANGUAGES.map((language) => [language, DARE_CARDS.map((card) => card[language])])) as Record<AppLanguage, string[]>;

export function getTruthsForLanguage(language: AppLanguage): string[] {
  return TRUTHS_BY_LANGUAGE[language] ?? TRUTHS_BY_LANGUAGE.sk;
}

export function getDaresForLanguage(language: AppLanguage): string[] {
  return DARES_BY_LANGUAGE[language] ?? DARES_BY_LANGUAGE.sk;
}

export const TRUTHS = TRUTHS_BY_LANGUAGE.sk;
export const DARES = DARES_BY_LANGUAGE.sk;
