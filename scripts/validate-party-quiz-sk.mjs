// Nezávislá kontrola vygenerovanej slovenskej databázy party kvízu.
// Kontroluje hotový JSON (nie zdrojový katalóg), takže zachytí aj ručné úpravy.
//
// Spustenie:  node scripts/validate-party-quiz-sk.mjs

import { readFile } from "node:fs/promises";
import path from "node:path";

const sourcePath = path.resolve("client/src/data/quiz-master.raw.json");
const questions = JSON.parse(await readFile(sourcePath, "utf8"));

const MIN_QUESTIONS = 500;
const MAX_QUESTION_CHARS = 110;
const MAX_OPTION_CHARS = 28;
const REQUIRED_KEYS = [
  "id",
  "factKey",
  "question",
  "answer",
  "category",
  "difficulty",
  "options",
  "correctIndex",
];

const errors = [];
const normalize = value =>
  value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

const ids = new Set();
const factKeys = new Set();
const questionTexts = new Map();
const indexCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
const difficultyCounts = {};
const categoryCounts = {};

for (const [position, item] of questions.entries()) {
  const label = item.id ?? `#${position}`;

  // Schéma musí presne zodpovedať typu QuizMasterQuestion z quizMaster.ts.
  const keys = Object.keys(item).sort();
  const missing = REQUIRED_KEYS.filter(key => !keys.includes(key));
  const extra = keys.filter(key => !REQUIRED_KEYS.includes(key));
  if (missing.length)
    errors.push(`${label}: chýbajúce polia ${missing.join(", ")}`);
  if (extra.length) errors.push(`${label}: neznáme polia ${extra.join(", ")}`);

  if (ids.has(item.id)) errors.push(`${label}: duplicitné id`);
  ids.add(item.id);
  if (factKeys.has(item.factKey)) errors.push(`${label}: duplicitný factKey`);
  factKeys.add(item.factKey);

  if (!Array.isArray(item.options) || item.options.length !== 4) {
    errors.push(`${label}: musí mať presne 4 možnosti`);
    continue;
  }
  if (![0, 1, 2, 3].includes(item.correctIndex))
    errors.push(`${label}: correctIndex musí byť 0–3`);
  // Na tomto invariante stojí bodovanie v Quiz.tsx.
  if (item.options[item.correctIndex] !== item.answer)
    errors.push(`${label}: answer sa nerovná options[correctIndex]`);
  if (new Set(item.options.map(normalize)).size !== 4)
    errors.push(`${label}: možnosti nie sú unikátne`);
  if (item.options.some(option => typeof option !== "string" || !option.trim()))
    errors.push(`${label}: prázdna možnosť`);

  if (!["lahke", "tazke"].includes(item.difficulty))
    errors.push(`${label}: neplatná obtiažnosť "${item.difficulty}"`);
  if (!item.question.trim().endsWith("?"))
    errors.push(`${label}: otázka nekončí otáznikom`);
  if (item.question.length > MAX_QUESTION_CHARS)
    errors.push(`${label}: otázka má ${item.question.length} znakov`);

  // Po bzučnutí sa možnosti skryjú, takže musia byť krátke a zapamätateľné.
  for (const option of item.options) {
    if (option.length > MAX_OPTION_CHARS)
      errors.push(`${label}: možnosť "${option}" má ${option.length} znakov`);
  }

  const key = normalize(item.question);
  if (questionTexts.has(key))
    errors.push(`${label}: duplicitná otázka s ${questionTexts.get(key)}`);
  else questionTexts.set(key, item.id);

  // Zakázané typy otázok podľa zadania.
  if (/\bv (ktorom|akom) (roku|roce)\b/i.test(item.question))
    errors.push(`${label}: otázka na letopočet`);
  if (
    /koľko je\s+\d/i.test(item.question) ||
    /\d\s*[+\-×÷*/]\s*\d/.test(item.question)
  )
    errors.push(`${label}: aritmetická otázka`);
  const yearLike = item.options.filter(
    option =>
      /^\d{4}$/.test(option.trim()) &&
      Number(option) >= 1000 &&
      Number(option) <= 2100
  );
  if (yearLike.length >= 3)
    errors.push(`${label}: možnosti sú memorovanie letopočtov`);

  indexCounts[item.correctIndex] = (indexCounts[item.correctIndex] ?? 0) + 1;
  difficultyCounts[item.difficulty] =
    (difficultyCounts[item.difficulty] ?? 0) + 1;
  categoryCounts[item.category] = (categoryCounts[item.category] ?? 0) + 1;
}

if (questions.length < MIN_QUESTIONS)
  errors.push(
    `Databáza má ${questions.length} otázok, požaduje sa aspoň ${MIN_QUESTIONS}`
  );

// Možnosti sa v hre nemiešajú, takže nerovnomerná pozícia správnej odpovede je zneužiteľná.
const expected = questions.length / 4;
for (const [index, count] of Object.entries(indexCounts)) {
  if (Math.abs(count - expected) > Math.max(5, expected * 0.1)) {
    errors.push(
      `Pozícia ${index} má ${count} správnych odpovedí, očakáva sa približne ${Math.round(expected)}`
    );
  }
}

console.log(`Otázok: ${questions.length}`);
console.log(`Obtiažnosť: ${JSON.stringify(difficultyCounts)}`);
console.log(`Pozícia správnej odpovede: ${JSON.stringify(indexCounts)}`);
console.log(`Kategórie: ${Object.keys(categoryCounts).length}`);
console.log(
  `Najdlhšia otázka: ${Math.max(...questions.map(item => item.question.length))} znakov`
);
console.log(
  `Najdlhšia možnosť: ${Math.max(...questions.flatMap(item => item.options.map(option => option.length)))} znakov`
);

if (errors.length) {
  console.error(`\nValidácia NEPREŠLA — ${errors.length} chýb:`);
  for (const error of errors.slice(0, 40)) console.error(`  • ${error}`);
  process.exit(1);
}
console.log(
  "\nValidácia PREŠLA: schéma, unikátnosť, dĺžky, zakázané typy otázok aj rozloženie odpovedí sú v poriadku."
);
