import { readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";

const sourcePath = path.resolve("client/src/data/quiz-master.raw.json");
const destinationPath = path.resolve("client/src/data/quiz-localizations.json");
const languages = ["en", "de", "es", "fr", "pt"];
const model = process.env.QUIZ_TRANSLATION_MODEL ?? "gpt-5-mini";
const baseUrl = (process.env.OPENAI_API_BASE ?? "").replace(/\/$/, "");
const apiKey = process.env.OPENAI_API_KEY ?? "";
const batchSize = Number(process.env.QUIZ_TRANSLATION_BATCH_SIZE ?? 6);
const workers = Number(process.env.QUIZ_TRANSLATION_WORKERS ?? 5);

if (!baseUrl || !apiKey) throw new Error("OPENAI_API_BASE and OPENAI_API_KEY must be configured.");

const sourceQuestions = JSON.parse(await readFile(sourcePath, "utf8"));

function emptyOutput() {
  return Object.fromEntries(languages.map((language) => [language, {}]));
}

async function readOutput() {
  try {
    const parsed = JSON.parse(await readFile(destinationPath, "utf8"));
    return { ...emptyOutput(), ...parsed };
  } catch {
    return emptyOutput();
  }
}

function fieldSchema() {
  return {
    type: "object",
    properties: {
      question: { type: "string" },
      answer: { type: "string" },
      options: {
        type: "array",
        items: { type: "string" },
        minItems: 4,
        maxItems: 4,
      },
    },
    required: ["question", "answer", "options"],
    additionalProperties: false,
  };
}

const responseFormat = {
  type: "json_schema",
  json_schema: {
    name: "quiz_localization_batch",
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
              en: fieldSchema(),
              de: fieldSchema(),
              es: fieldSchema(),
              fr: fieldSchema(),
              pt: fieldSchema(),
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

function sourcePayload(question) {
  const { id, factKey, question: prompt, answer, options, correctIndex, category, difficulty } = question;
  return { id, factKey, question: prompt, answer, options, correctIndex, category, difficulty };
}

function assertSource(question) {
  if (!Array.isArray(question.options) || question.options.length !== 4) {
    throw new Error(`${question.id}: source question does not have exactly four options`);
  }
  if (question.options[question.correctIndex] !== question.answer) {
    throw new Error(`${question.id}: source answer must equal the option at correctIndex`);
  }
}

function validateBatch(batch, translations) {
  const requested = new Map(batch.map((question) => [question.id, question]));
  if (!Array.isArray(translations) || translations.length !== batch.length) {
    throw new Error("translation response has an unexpected item count");
  }
  const received = new Set();
  for (const item of translations) {
    const source = requested.get(item.id);
    if (!source || received.has(item.id)) throw new Error(`unexpected or duplicate translation id: ${item.id}`);
    received.add(item.id);
    for (const language of languages) {
      const value = item[language];
      if (!value || typeof value.question !== "string" || typeof value.answer !== "string" || !Array.isArray(value.options)) {
        throw new Error(`${item.id}/${language}: invalid localization shape`);
      }
      if (!value.question.trim() || !value.answer.trim() || value.options.length !== 4 || value.options.some((option) => !option.trim())) {
        throw new Error(`${item.id}/${language}: empty localized field`);
      }
      if (new Set(value.options.map((option) => option.trim().toLocaleLowerCase(language))).size !== 4) {
        throw new Error(`${item.id}/${language}: duplicate localized options`);
      }
      if (value.answer !== value.options[source.correctIndex]) {
        throw new Error(`${item.id}/${language}: answer no longer matches correctIndex`);
      }
    }
  }
}

async function translateBatch(batch, attempt = 1) {
  const body = {
    model,
    max_completion_tokens: 10000,
    response_format: responseFormat,
    messages: [
      {
        role: "system",
        content: "You are a senior multilingual localization editor for a party-trivia game. Return only the requested JSON schema.",
      },
      {
        role: "user",
        content: [
          "Translate every Slovak quiz record into natural English, German, Spanish, French, and European Portuguese.",
          "Preserve each exact fact, factKey, category, difficulty, ID, option order, and correctIndex. Do not add or remove any question or option.",
          "For every language, translate question, answer, and all four options naturally for native speakers. Proper names, formulas, dates, and universally identical terms may remain unchanged when appropriate.",
          "The localized answer must be byte-for-byte identical to the option at the original correctIndex. Each question must keep four distinct, non-empty options.",
          "Use standard contemporary language; use Portuguese as used in Portugal. Never leave Slovak wording unless it is a proper noun, number, symbol, or the established foreign name.",
          "Records to localize:",
          JSON.stringify(batch.map(sourcePayload)),
        ].join("\n\n"),
      },
    ],
  };
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`translation API ${response.status}: ${await response.text()}`);
  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (!content) throw new Error("translation API returned no content");
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("translation API returned invalid JSON");
  }
  try {
    validateBatch(batch, parsed.translations);
    return parsed.translations;
  } catch (error) {
    if (attempt >= 3) throw error;
    await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    return translateBatch(batch, attempt + 1);
  }
}

async function save(output) {
  const temp = `${destinationPath}.tmp`;
  await writeFile(temp, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  await rename(temp, destinationPath);
}

for (const question of sourceQuestions) assertSource(question);
const output = await readOutput();
const missing = sourceQuestions.filter((question) => languages.some((language) => !output[language]?.[question.id]));
const batches = Array.from({ length: Math.ceil(missing.length / batchSize) }, (_, index) => missing.slice(index * batchSize, (index + 1) * batchSize));

console.log(`Translating ${missing.length} question(s) in ${batches.length} batch(es) with ${model}.`);
let completed = 0;
let cursor = 0;
async function worker() {
  while (cursor < batches.length) {
    const index = cursor++;
    const batch = batches[index];
    const translated = await translateBatch(batch);
    for (const item of translated) {
      for (const language of languages) output[language][item.id] = item[language];
    }
    await save(output);
    completed += 1;
    console.log(`Completed batch ${completed}/${batches.length} (${batch.map((item) => item.id).join(", ")}).`);
  }
}

await Promise.all(Array.from({ length: Math.min(workers, batches.length) }, worker));
await save(output);
console.log("Localization generation completed.");
