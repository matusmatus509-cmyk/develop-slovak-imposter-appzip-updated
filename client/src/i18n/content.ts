import type { AppLanguage } from "./LanguageProvider";
import impostorEn from "./content/en/impostor.json";
import drawingEn from "./content/en/drawing.json";
import emojiEn from "./content/en/emoji.json";
import pantomimeEn from "./content/en/pantomime.json";
import pingPongEn from "./content/en/pingpong.json";
import letterEn from "./content/en/letter.json";
import fiveInTenEn from "./content/en/fiveInTen.json";
import soundEn from "./content/en/sound.json";
import quizEn from "./content/en/quiz.json";
import { registerEnglishContent } from "./contentRegistry";

/**
 * ── Preklad herného obsahu ─────────────────────────────────────────────────
 *
 * UI texty prekladá DOM slovník v `LanguageProvider`. Herný obsah (slová,
 * otázky, kartičky) sa ale prekladá tu — priamo v dátach — pretože na ňom
 * stojí herná logika: porovnávanie odpovedí, deduplikácia balíčkov, písmená,
 * čísla v kvíze. DOM slovník by ho prekladal len kozmeticky a nespoľahlivo.
 *
 * Každá doména má mapu `slovenský kľúč → anglický text`.
 *   - chýbajúci kľúč  → slovenský originál (chybu zachytí test pokrytia),
 *   - prázdny string  → položka v angličtine NEEXISTUJE a z balíčka sa vyradí
 *     (slovenské príslovia, rýmy, písmená s diakritikou, lokálne osobnosti…).
 */
export type ContentDomain =
  | "impostor"
  | "drawing"
  | "emoji"
  | "pantomime"
  | "pingpong"
  | "letter"
  | "fiveInTen";

const EN_TEXT: Record<ContentDomain, Record<string, string>> = {
  impostor: impostorEn as Record<string, string>,
  drawing: drawingEn as Record<string, string>,
  emoji: emojiEn as Record<string, string>,
  pantomime: pantomimeEn as Record<string, string>,
  pingpong: pingPongEn as Record<string, string>,
  letter: letterEn as Record<string, string>,
  fiveInTen: fiveInTenEn as Record<string, string>,
};

registerEnglishContent(
  Object.values(EN_TEXT).flatMap((map) => Object.values(map).flatMap((value) => value.split("|"))),
);

/** Jazyky, ktoré majú obsah preložený v dátovej vrstve. */
export function hasContentLocale(language: AppLanguage): language is "en" {
  return language === "en";
}

/**
 * Preloží obsahový text. Vracia `null`, ak položka v danom jazyku nemá
 * zmysel a treba ju vyradiť. Pre jazyky bez obsahovej lokalizácie vracia
 * originál (tie ešte používajú DOM slovník).
 */
export function localizeContent(domain: ContentDomain, key: string, language: AppLanguage): string | null {
  if (!hasContentLocale(language)) return key;
  const value = EN_TEXT[domain][key];
  if (value === undefined) return key;
  return value === "" ? null : value;
}

/** Rovnaké ako `localizeContent`, ale pre položky, ktoré sa nesmú vyradiť (názvy kategórií). */
export function localizeLabel(domain: ContentDomain, key: string, language: AppLanguage): string {
  return localizeContent(domain, key, language) ?? key;
}

/** Preloží zoznam a vyradí položky, ktoré v jazyku neexistujú. Duplicity po preklade zlúči. */
export function localizeList(domain: ContentDomain, items: readonly string[], language: AppLanguage): string[] {
  if (!hasContentLocale(language)) return [...items];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    const translated = localizeContent(domain, item, language);
    if (translated === null) continue;
    const key = translated.trim().toLocaleLowerCase("en");
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(translated);
  }
  return result;
}

/**
 * Kľúč balíčka bez opakovania. Slovenčina ponecháva pôvodný kľúč (história
 * hráčov sa zachová), jazyky s preloženým obsahom majú vlastnú históriu.
 */
export function deckKeyForLanguage(baseKey: string, language: AppLanguage): string {
  return hasContentLocale(language) ? `${baseKey}:${language}` : baseKey;
}

/** Surová mapa (pre testy pokrytia a validačné skripty). */
export function contentMap(domain: ContentDomain): Readonly<Record<string, string>> {
  return EN_TEXT[domain];
}

// ── Uhádni zvuk ──────────────────────────────────────────────────────────────

export interface LocalizedSoundText {
  label: string;
  category?: string;
  acceptedAnswers?: string[];
}

const SOUND_EN = soundEn as unknown as Record<string, LocalizedSoundText>;
registerEnglishContent(Object.values(SOUND_EN).flatMap((sound) => [sound.label, sound.category, ...(sound.acceptedAnswers ?? [])]));

export function soundTextFor(id: string, language: AppLanguage): LocalizedSoundText | null {
  if (!hasContentLocale(language)) return null;
  return SOUND_EN[id] ?? null;
}

export function soundContentMap(): Readonly<Record<string, LocalizedSoundText>> {
  return SOUND_EN;
}

// ── Kvízový duel ─────────────────────────────────────────────────────────────

/** Preklad jednej otázky podľa jej `id`. Polia zodpovedajú `QuizDuelQuestion`. */
export interface LocalizedQuizText {
  prompt: string;
  fact: string;
  options?: [string, string, string, string];
  unit?: string;
  display?: string;
  claimDisplay?: string;
}

const QUIZ_EN = quizEn as unknown as Record<string, LocalizedQuizText>;
registerEnglishContent(
  Object.values(QUIZ_EN).flatMap((question) => [
    question.prompt,
    question.fact,
    question.unit,
    question.display,
    question.claimDisplay,
    ...(question.options ?? []),
  ]),
);

export function quizTextFor(id: string, language: AppLanguage): LocalizedQuizText | null {
  if (!hasContentLocale(language)) return null;
  return QUIZ_EN[id] ?? null;
}
