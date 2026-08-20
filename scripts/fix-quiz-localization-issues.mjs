import { readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";

const source = JSON.parse(await readFile(path.resolve("client/src/data/quiz-master.raw.json"), "utf8"));
const localizedPath = path.resolve("client/src/data/quiz-localizations.json");
const localized = JSON.parse(await readFile(localizedPath, "utf8"));
const audit = JSON.parse(await readFile(path.resolve("docs/quiz-localization-language-audit.json"), "utf8"));
const languages = ["en", "de", "es", "fr", "pt"];
const model = process.env.QUIZ_FIX_MODEL ?? "gpt-5-mini";
const baseUrl = (process.env.OPENAI_API_BASE ?? "").replace(/\/$/, "");
const apiKey = process.env.OPENAI_API_KEY ?? "";
const batchSize = Number(process.env.QUIZ_FIX_BATCH_SIZE ?? 10);
const workers = Number(process.env.QUIZ_FIX_WORKERS ?? 6);
if (!baseUrl || !apiKey) throw new Error("OPENAI_API_BASE and OPENAI_API_KEY must be configured.");

const byId = new Map(source.map((question) => [question.id, question]));
const issuesById = new Map();
for (const issue of audit.issues) issuesById.set(issue.id, [...(issuesById.get(issue.id) ?? []), issue]);
const flagged = [...issuesById.keys()].map((id) => byId.get(id)).filter(Boolean);

function fieldSchema() {
  return {
    type: "object",
    properties: {
      question: { type: "string" },
      answer: { type: "string" },
      options: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
    },
    required: ["question", "answer", "options"],
    additionalProperties: false,
  };
}

const responseFormat = {
  type: "json_schema",
  json_schema: {
    name: "corrected_quiz_localization_batch",
    strict: true,
    schema: {
      type: "object",
      properties: {
        translations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              en: fieldSchema(), de: fieldSchema(), es: fieldSchema(), fr: fieldSchema(), pt: fieldSchema(),
            },
            required: ["id", "en", "de", "es", "fr", "pt"],
            additionalProperties: false,
          },
        },
      },
      required: ["translations"],
      additionalProperties: false,
    },
  },
};

function payload(question) {
  return {
    id: question.id,
    source: {
      factKey: question.factKey,
      question: question.question,
      answer: question.answer,
      options: question.options,
      correctIndex: question.correctIndex,
      category: question.category,
      difficulty: question.difficulty,
    },
    current: Object.fromEntries(languages.map((language) => [language, localized[language][question.id]])),
    auditIssues: issuesById.get(question.id),
  };
}

function validate(batch, translations) {
  const requested = new Map(batch.map((item) => [item.id, item]));
  if (!Array.isArray(translations) || translations.length !== batch.length) throw new Error("unexpected repaired item count");
  const seen = new Set();
  for (const item of translations) {
    const sourceQuestion = requested.get(item.id);
    if (!sourceQuestion || seen.has(item.id)) throw new Error("unexpected repaired ID");
    seen.add(item.id);
    for (const language of languages) {
      const value = item[language];
      if (!value?.question?.trim() || !value?.answer?.trim() || !Array.isArray(value.options) || value.options.length !== 4 || value.options.some((option) => !option?.trim())) throw new Error(`${item.id}/${language}: invalid value`);
      if (new Set(value.options.map((option) => option.trim().toLocaleLowerCase(language))).size !== 4) throw new Error(`${item.id}/${language}: duplicate options`);
      if (value.answer !== value.options[sourceQuestion.correctIndex]) throw new Error(`${item.id}/${language}: answer mismatch`);
    }
  }
}

async function translate(batch, attempt = 1) {
  const body = {
    model,
    max_completion_tokens: 10000,
    response_format: responseFormat,
    messages: [
      { role: "system", content: "You are a senior multilingual game-localization editor. Return only the requested JSON schema." },
      {
        role: "user",
        content: [
          "Repair all five localized versions of every supplied Slovak trivia question. Slovak source is immutable and authoritative.",
          "Audit notes identify concrete errors found in the current localization. Rewrite each entire locale naturally, resolving all notes and any related inconsistencies.",
          "Preserve facts, IDs, factKey, category, difficulty, exact option order, and correctIndex. Translate question, answer, and every option. The localized answer must exactly equal the option at source correctIndex.",
          "Use natural English, German, Spanish, French, and European Portuguese. Do not leave Slovak or English fragments unless they are unavoidable proper names, symbols, numbers, or established titles.",
          JSON.stringify(batch.map(payload)),
        ].join("\n\n"),
      },
    ],
  };
  const response = await fetch(`${baseUrl}/chat/completions`, { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`fix API ${response.status}: ${await response.text()}`);
  const content = (await response.json())?.choices?.[0]?.message?.content;
  if (!content) throw new Error("fix API returned no content");
  try {
    const parsed = JSON.parse(content);
    validate(batch, parsed.translations);
    return parsed.translations;
  } catch (error) {
    if (attempt >= 3) throw error;
    await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    return translate(batch, attempt + 1);
  }
}

async function save() {
  const temp = `${localizedPath}.tmp`;
  await writeFile(temp, `${JSON.stringify(localized, null, 2)}\n`, "utf8");
  await rename(temp, localizedPath);
}

const batches = Array.from({ length: Math.ceil(flagged.length / batchSize) }, (_, index) => flagged.slice(index * batchSize, (index + 1) * batchSize));
console.log(`Repairing ${flagged.length} flagged question(s) in ${batches.length} batch(es).`);
let cursor = 0;
let completed = 0;
async function worker() {
  while (cursor < batches.length) {
    const index = cursor++;
    const repaired = await translate(batches[index]);
    for (const item of repaired) for (const language of languages) localized[language][item.id] = item[language];
    await save();
    completed += 1;
    console.log(`Repaired batch ${completed}/${batches.length}.`);
  }
}
await Promise.all(Array.from({ length: Math.min(workers, batches.length) }, worker));
await save();
console.log("Localization repairs completed.");
