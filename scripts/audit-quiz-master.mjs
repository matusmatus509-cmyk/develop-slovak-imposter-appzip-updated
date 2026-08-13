import fs from "node:fs";

const source = new URL("../src/data/quiz-master.raw.json", import.meta.url);
const questions = JSON.parse(fs.readFileSync(source, "utf8"));

const normalize = (value) => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase("sk")
  .replace(/[^\p{L}\p{N}]+/gu, " ")
  .trim();
const duplicateCount = (values) => values.length - new Set(values).size;
const categoryCounts = Object.fromEntries(
  [...new Set(questions.map((item) => item.category))]
    .sort((a, b) => a.localeCompare(b, "sk"))
    .map((category) => [category, questions.filter((item) => item.category === category).length]),
);

const issues = [];
for (const [index, item] of questions.entries()) {
  const label = `${index + 1}:${item.id}`;
  if (!/^(?:quiz-\d{2}-\d{3}|quiz-(?:ext|alt)-\d{4})$/.test(item.id ?? "")) issues.push(`${label}: neplatné id`);
  if (item.difficulty !== "lahke" && item.difficulty !== "tazke") issues.push(`${label}: neplatná obtiažnosť`);
  if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(item.factKey ?? "")) issues.push(`${label}: neplatný FACT_KEY`);
  if (typeof item.question !== "string" || !item.question.endsWith("?")) issues.push(`${label}: otázka nekončí otáznikom`);
  if (!Array.isArray(item.options) || item.options.length !== 4) issues.push(`${label}: nemá presne štyri možnosti`);
  if (!Number.isInteger(item.correctIndex) || item.correctIndex < 0 || item.correctIndex > 3) issues.push(`${label}: neplatný correctIndex`);
  if (!Array.isArray(item.options) || new Set(item.options.map(normalize)).size !== 4) issues.push(`${label}: možnosti nie sú jedinečné`);
  if (item.answer !== item.options?.[item.correctIndex]) issues.push(`${label}: answer nezodpovedá correctIndex`);
}

const report = {
  total: questions.length,
  categoryCounts,
  uniqueFactKeys: new Set(questions.map((item) => item.factKey)).size,
  uniqueNormalizedQuestions: new Set(questions.map((item) => normalize(item.question))).size,
  duplicateFactKeys: duplicateCount(questions.map((item) => item.factKey)),
  duplicateNormalizedQuestions: duplicateCount(questions.map((item) => normalize(item.question))),
  formatIssues: issues.length,
  issueSamples: issues.slice(0, 20),
  completeCategories: Object.values(categoryCounts).filter((count) => count === 150).length,
  difficultyCounts: {
    lahke: questions.filter((item) => item.difficulty === "lahke").length,
    tazke: questions.filter((item) => item.difficulty === "tazke").length,
  },
  remainingToTarget: 1500 - questions.length,
};
console.log(JSON.stringify(report, null, 2));
if (issues.length || report.duplicateFactKeys || report.duplicateNormalizedQuestions) process.exitCode = 1;
