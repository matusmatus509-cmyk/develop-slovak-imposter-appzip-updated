import { QUIZ_QUESTIONS_BY_DIFFICULTY } from "../src/data/teamBattle";

const expected = { lahke: 700, tazke: 700 } as const;

for (const tier of ["lahke", "tazke"] as const) {
  const questions = QUIZ_QUESTIONS_BY_DIFFICULTY[tier];
  if (questions.length !== expected[tier]) {
    throw new Error(`${tier}: očakáva sa ${expected[tier]}, získané ${questions.length}`);
  }
  for (const question of questions) {
    if (question.difficulty !== tier) {
      throw new Error(`${tier}: nesprávne zaradená otázka ${question.id ?? question.question}`);
    }
    if (!question.options || question.options.length !== 4 || question.correctIndex === undefined) {
      throw new Error(`${tier}: otázka nemá kompletné možnosti ${question.id ?? question.question}`);
    }
    if (question.options[question.correctIndex] !== question.answer) {
      throw new Error(`${tier}: nesúlad odpovede ${question.id ?? question.question}`);
    }
  }
}

console.log(JSON.stringify({
  lahke: QUIZ_QUESTIONS_BY_DIFFICULTY.lahke.length,
  tazke: QUIZ_QUESTIONS_BY_DIFFICULTY.tazke.length,
  result: "Výber otázok pre hru je správne pripojený.",
}, null, 2));
