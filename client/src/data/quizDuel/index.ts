import type { AppLanguage } from "../../i18n/LanguageProvider";
import { takePersistentItems } from "../../utils/persistentDeck";
import { QUIZ_DUEL_CLASSIC_SK } from "./classic.sk";
import { QUIZ_DUEL_CLOSEST_SK } from "./closest.sk";
import { QUIZ_DUEL_ESTIMATE_SK } from "./estimate.sk";
import { QUIZ_DUEL_CLASSIC_HARD_EXPANSION } from "./expansions/classicHard.sk";
import { QUIZ_DUEL_CLOSEST_HARD_EXPANSION } from "./expansions/closestHard.sk";
import { QUIZ_DUEL_ESTIMATE_HARD_EXPANSION } from "./expansions/estimateHard.sk";
import { QUIZ_DUEL_HIGHER_LOWER_HARD_EXPANSION } from "./expansions/higherLowerHard.sk";
import { QUIZ_DUEL_HIGHER_LOWER_SK } from "./higherLower.sk";
import {
  hasTranslation,
  resolveQuestion,
  type Localizable,
  type QuizDuelDifficulty,
  type QuizDuelKind,
  type QuizDuelQuestion,
  type ResolvedQuizDuelQuestion,
} from "./types";

export * from "./types";

const QUIZ_DUEL_CLASSIC_ALL = [
  ...QUIZ_DUEL_CLASSIC_SK,
  ...QUIZ_DUEL_CLASSIC_HARD_EXPANSION,
];
const QUIZ_DUEL_ESTIMATE_ALL = [
  ...QUIZ_DUEL_ESTIMATE_SK,
  ...QUIZ_DUEL_ESTIMATE_HARD_EXPANSION,
];
const QUIZ_DUEL_CLOSEST_ALL = [
  ...QUIZ_DUEL_CLOSEST_SK,
  ...QUIZ_DUEL_CLOSEST_HARD_EXPANSION,
];
const QUIZ_DUEL_HIGHER_LOWER_ALL = [
  ...QUIZ_DUEL_HIGHER_LOWER_SK,
  ...QUIZ_DUEL_HIGHER_LOWER_HARD_EXPANSION,
];

/** Celý slovenský deck. Slovenčina je zdroj pravdy, preklady sa dopĺňajú do polí. */
export const QUIZ_DUEL_QUESTIONS: QuizDuelQuestion[] = [
  ...QUIZ_DUEL_CLASSIC_ALL,
  ...QUIZ_DUEL_ESTIMATE_ALL,
  ...QUIZ_DUEL_CLOSEST_ALL,
  ...QUIZ_DUEL_HIGHER_LOWER_ALL,
];

export const QUIZ_DUEL_QUESTIONS_BY_KIND: Record<
  QuizDuelKind,
  QuizDuelQuestion[]
> = {
  classic: QUIZ_DUEL_CLASSIC_ALL,
  estimate: QUIZ_DUEL_ESTIMATE_ALL,
  closest: QUIZ_DUEL_CLOSEST_ALL,
  "higher-lower": QUIZ_DUEL_HIGHER_LOWER_ALL,
};

const ALL_KINDS = Object.keys(QUIZ_DUEL_QUESTIONS_BY_KIND) as QuizDuelKind[];

/** Koľko otázok daného typu a náročnosti je k dispozícii (na diagnostiku a testy). */
export function quizDuelDeckStats() {
  const byKind = {} as Record<
    QuizDuelKind,
    { lahke: number; tazke: number; total: number }
  >;
  for (const kind of ALL_KINDS) {
    const pool = QUIZ_DUEL_QUESTIONS_BY_KIND[kind];
    byKind[kind] = {
      lahke: pool.filter(question => question.difficulty === "lahke").length,
      tazke: pool.filter(question => question.difficulty === "tazke").length,
      total: pool.length,
    };
  }
  return { total: QUIZ_DUEL_QUESTIONS.length, byKind };
}

// ── Lokalizácia ──────────────────────────────────────────────────────────────

function localizableFields(question: QuizDuelQuestion): Localizable[] {
  const fields: Localizable[] = [question.prompt, question.fact];
  if (question.kind === "classic") {
    fields.push(...question.options);
  } else {
    fields.push(question.unit, question.display);
    if (question.kind === "higher-lower") fields.push(question.claimDisplay);
  }
  return fields;
}

/**
 * Koľko otázok je pre daný jazyk SKUTOČNE preložených. Slovenský fallback sa
 * nikde nepočíta ako preklad — vďaka tomu je hneď vidno, čo ešte treba doplniť.
 */
export function quizDuelLocaleCoverage(): Record<
  AppLanguage,
  { translated: number; total: number }
> {
  const languages: AppLanguage[] = ["sk", "en", "de", "es", "fr", "pt"];
  const total = QUIZ_DUEL_QUESTIONS.length;
  const coverage = {} as Record<
    AppLanguage,
    { translated: number; total: number }
  >;
  for (const language of languages) {
    const translated = QUIZ_DUEL_QUESTIONS.filter(question =>
      localizableFields(question).every(field =>
        hasTranslation(field, language)
      )
    ).length;
    coverage[language] = { translated, total };
  }
  return coverage;
}

// ── Čerpanie otázok ──────────────────────────────────────────────────────────

/**
 * Verzia v kľúči decku. Keď sa deck výrazne prekope, stačí zvýšiť číslo a
 * uložená história „už videných“ otázok sa začne od nuly.
 */
const DECK_KEY_VERSION = "v1";

function deckKey(
  language: AppLanguage,
  difficulty: QuizDuelDifficulty,
  kind: QuizDuelKind
) {
  return `party:quizduel:${DECK_KEY_VERSION}:${language}:${difficulty}:${kind}`;
}

/**
 * Zásoba pre daný typ a náročnosť. Ak by v danej náročnosti nebolo dosť otázok
 * (napr. po zúžení decku), doplní sa druhou náročnosťou, aby hra nikdy nespadla.
 */
export function quizDuelPool(
  kind: QuizDuelKind,
  difficulty: QuizDuelDifficulty,
  needed: number,
  extra: QuizDuelQuestion[] = []
): QuizDuelQuestion[] {
  const all = [
    ...QUIZ_DUEL_QUESTIONS_BY_KIND[kind],
    ...extra.filter(q => q.kind === kind),
  ];
  const preferred = all.filter(question => question.difficulty === difficulty);
  return preferred.length >= needed ? preferred : all;
}

/**
 * Vyberie po jednej otázke pre každý slot v `kinds` — v rovnakom poradí.
 *
 * Náhodné čerpanie bez opakovania používa rovnaký mechanizmus ako ostatné
 * minihry (`takePersistentItems`): každý typ má vlastný deck v localStorage,
 * otázka sa nezopakuje, kým sa deck nevyčerpá, a potom začne nový cyklus.
 * V rámci jedného kola sa navyše všetky otázky vyberú naraz, takže sa nemôže
 * stať, že by tá istá otázka prišla dvakrát v jednej hre.
 */
export function drawQuizDuelQuestions(
  language: AppLanguage,
  difficulty: QuizDuelDifficulty,
  kinds: QuizDuelKind[],
  extra: QuizDuelQuestion[] = []
): ResolvedQuizDuelQuestion[] {
  const slotsByKind = new Map<QuizDuelKind, number[]>();
  kinds.forEach((kind, index) => {
    const slots = slotsByKind.get(kind);
    if (slots) slots.push(index);
    else slotsByKind.set(kind, [index]);
  });

  const result: ResolvedQuizDuelQuestion[] = new Array(kinds.length);
  for (const [kind, slots] of slotsByKind) {
    const pool = quizDuelPool(kind, difficulty, slots.length, extra);
    const drawn = takePersistentItems(
      deckKey(language, difficulty, kind),
      pool,
      slots.length,
      question => question.id
    );
    slots.forEach((slot, offset) => {
      const question = drawn[offset] ?? drawn[0];
      result[slot] = resolveQuestion(question, language);
    });
  }
  return result.filter(Boolean);
}
