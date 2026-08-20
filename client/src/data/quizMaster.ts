import rawQuizMaster from "./quiz-master.raw.json";
import rawQuizLocalizations from "./quiz-localizations.json";
import type { AppLanguage } from "../i18n/LanguageProvider";

/** Dve úrovne pre tímový kvíz: základné a náročnejšie faktické otázky. */
export type QuizDifficulty = "lahke" | "tazke";

export const QUIZ_DIFFICULTY_LABELS: Record<QuizDifficulty, string> = {
  lahke: "🟢 Ľahšie otázky",
  tazke: "🔴 Ťažšie otázky",
};

export interface QuizMasterQuestion {
  id: string;
  factKey: string;
  question: string;
  answer: string;
  category: string;
  difficulty: QuizDifficulty;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
}

type QuizLocalization = Pick<QuizMasterQuestion, "question" | "answer" | "options">;
type QuizLocalizations = Record<Exclude<AppLanguage, "sk">, Record<string, QuizLocalization>>;

export const QUIZ_MASTER_QUESTIONS = rawQuizMaster as QuizMasterQuestion[];
const QUIZ_LOCALIZATIONS = rawQuizLocalizations as unknown as QuizLocalizations;

export const QUIZ_MASTER_QUESTIONS_BY_DIFFICULTY: Record<QuizDifficulty, QuizMasterQuestion[]> = {
  lahke: QUIZ_MASTER_QUESTIONS.filter((question) => question.difficulty === "lahke"),
  tazke: QUIZ_MASTER_QUESTIONS.filter((question) => question.difficulty === "tazke"),
};

/** Slovenská zásoba zostáva zdrojom pravdy; všetky ostatné jazyky menia len zobrazovaný text. */
export function getQuizQuestionsByDifficulty(language: AppLanguage, difficulty: QuizDifficulty): QuizMasterQuestion[] {
  const source = QUIZ_MASTER_QUESTIONS_BY_DIFFICULTY[difficulty];
  if (language === "sk") return source;
  const translations = QUIZ_LOCALIZATIONS[language];
  return source.map((question) => {
    const localized = translations[question.id];
    return localized ? { ...question, ...localized } : question;
  });
}
