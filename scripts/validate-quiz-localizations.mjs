import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const sourcePath = path.resolve("client/src/data/quiz-master.raw.json");
const localizedPath = path.resolve("client/src/data/quiz-localizations.json");
const reportPath = path.resolve("docs/quiz-localization-validation.json");
const languages = ["en", "de", "es", "fr", "pt"];
const source = JSON.parse(await readFile(sourcePath, "utf8"));
const localized = JSON.parse(await readFile(localizedPath, "utf8"));
const sourceById = new Map(source.map((question) => [question.id, question]));
const errors = [];
const warnings = [];
const slovakSignals = /[áäčďéíĺľňóôŕšťúýž]|(ktorý|ktorá|ktoré|ako|koľko|je|sú|naj|hlavné|mesto|otázka|odpoveď|správna|nesprávna|svete|krajina|planéta|more|rieka|hráč|rok)/i;

for (const question of source) {
  if (!question.id || !question.factKey || !question.question || !question.category || !Array.isArray(question.options) || question.options.length !== 4) {
    errors.push({ id: question.id ?? "(missing)", language: "sk", reason: "invalid-source-shape" });
    continue;
  }
  if (question.options[question.correctIndex] !== question.answer) {
    errors.push({ id: question.id, language: "sk", reason: "source-answer-correct-index-mismatch" });
  }
}

for (const language of languages) {
  const records = localized[language] ?? {};
  const ids = Object.keys(records);
  // Slovenčina je zdroj pravdy a preklady sa dogenerúvajú samostatným krokom.
  // Úplne prázdny jazyk teda nie je chyba dát — hra má per-otázku fallback na slovenčinu.
  // Čiastočne preložený jazyk chybou zostáva, pretože to je skutočná regresia.
  if (!ids.length) {
    warnings.push({ id: "(all)", language, reason: "translations-not-generated" });
    continue;
  }
  for (const id of sourceById.keys()) {
    const sourceQuestion = sourceById.get(id);
    const item = records[id];
    if (!item) {
      errors.push({ id, language, reason: "missing-localization" });
      continue;
    }
    if (!item.question?.trim() || !item.answer?.trim() || !Array.isArray(item.options) || item.options.length !== 4 || item.options.some((option) => !option?.trim())) {
      errors.push({ id, language, reason: "empty-or-invalid-localized-field" });
      continue;
    }
    if (new Set(item.options.map((option) => option.trim().toLocaleLowerCase(language))).size !== 4) {
      errors.push({ id, language, reason: "duplicate-options" });
    }
    if (item.answer !== item.options[sourceQuestion.correctIndex]) {
      errors.push({ id, language, reason: "answer-correct-index-mismatch" });
    }
    const combined = [item.question, item.answer, ...item.options].join(" ");
    if (slovakSignals.test(combined)) warnings.push({ id, language, reason: "possible-slovak-text" });
  }
  for (const id of ids) if (!sourceById.has(id)) errors.push({ id, language, reason: "unknown-localization-id" });
}

const report = {
  sourceQuestions: source.length,
  localizedCounts: Object.fromEntries(languages.map((language) => [language, Object.keys(localized[language] ?? {}).length])),
  errors,
  warnings,
};
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s). Report: ${reportPath}`);
  process.exit(1);
}
console.log(`Validation passed: ${source.length} questions × ${languages.length} locales. ${warnings.length} text-review warning(s). Report: ${reportPath}`);
