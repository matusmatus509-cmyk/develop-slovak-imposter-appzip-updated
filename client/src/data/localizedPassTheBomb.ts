import type { AppLanguage } from "../i18n/LanguageProvider";
import rawData from "./passTheBomb.json";

export interface BombTask {
  id: string;
  category: string;
  difficulty: "easy" | "normal" | "hard";
  text: string;
}

export function getPassTheBombForLanguage(language: AppLanguage): BombTask[] {
  return rawData.map((item) => ({
    id: item.id,
    category: item.category,
    difficulty: item.difficulty as "easy" | "normal" | "hard",
    text: item.translations[language] ?? item.translations.en,
  }));
}
