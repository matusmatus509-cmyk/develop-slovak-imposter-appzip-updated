import rawCards from "./truthOrDare.json";
import type { AppLanguage } from "../i18n/LanguageProvider";

export type TruthOrDareType = "truth" | "dare";
export type TruthOrDareIntensity = "easy" | "normal" | "bold";
export type LocalizedTruthOrDareCard = {
  id: string;
  type: TruthOrDareType;
  category: string;
  intensity: TruthOrDareIntensity;
  translations: Record<AppLanguage, string>;
};

export const TRUTH_OR_DARE_CARDS = rawCards as LocalizedTruthOrDareCard[];
export const TRUTH_OR_DARE_CARD_COUNT = 1000;
export const TRUTH_CARDS = TRUTH_OR_DARE_CARDS.filter((card) => card.type === "truth");
export const DARE_CARDS = TRUTH_OR_DARE_CARDS.filter((card) => card.type === "dare");
export const TRUTHS = TRUTH_CARDS.map((card) => card.translations.sk);
export const DARES = DARE_CARDS.map((card) => card.translations.sk);

export function getTruthsForLanguage(language: AppLanguage): string[] {
  return TRUTH_CARDS.map((card) => card.translations[language] ?? card.translations.sk);
}

export function getDaresForLanguage(language: AppLanguage): string[] {
  return DARE_CARDS.map((card) => card.translations[language] ?? card.translations.sk);
}
