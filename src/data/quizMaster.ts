import rawQuizMaster from "./quiz-master.raw.json";

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

export const QUIZ_MASTER_QUESTIONS = rawQuizMaster as QuizMasterQuestion[];

export const QUIZ_MASTER_QUESTIONS_BY_DIFFICULTY: Record<QuizDifficulty, QuizMasterQuestion[]> = {
  lahke: QUIZ_MASTER_QUESTIONS.filter((question) => question.difficulty === "lahke"),
  tazke: QUIZ_MASTER_QUESTIONS.filter((question) => question.difficulty === "tazke"),
};
