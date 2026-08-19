import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const source = JSON.parse(await readFile(path.resolve("client/src/data/quiz-master.raw.json"), "utf8"));
const localized = JSON.parse(await readFile(path.resolve("client/src/data/quiz-localizations.json"), "utf8"));
const languages = ["en", "de", "es", "fr", "pt"];
const model = process.env.QUIZ_AUDIT_MODEL ?? "gpt-5-mini";
const baseUrl = (process.env.OPENAI_API_BASE ?? "").replace(/\/$/, "");
const apiKey = process.env.OPENAI_API_KEY ?? "";
const batchSize = Number(process.env.QUIZ_AUDIT_BATCH_SIZE ?? 25);
const workers = Number(process.env.QUIZ_AUDIT_WORKERS ?? 8);
const reportPath = path.resolve("docs/quiz-localization-language-audit.json");
if (!baseUrl || !apiKey) throw new Error("OPENAI_API_BASE and OPENAI_API_KEY must be configured.");

const ids = new Set(source.map((item) => item.id));
const responseFormat = {
  type: "json_schema",
  json_schema: {
    name: "quiz_translation_audit",
    strict: true,
    schema: {
      type: "object",
      properties: {
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              language: { type: "string", enum: languages },
              reason: { type: "string" },
            },
            required: ["id", "language", "reason"],
            additionalProperties: false,
          },
        },
      },
      required: ["issues"],
      additionalProperties: false,
    },
  },
};

function auditPayload(question) {
  return {
    id: question.id,
    slovak: { question: question.question, answer: question.answer, options: question.options, correctIndex: question.correctIndex },
    translations: Object.fromEntries(languages.map((language) => [language, localized[language][question.id]])),
  };
}

function validateIssues(issues, batchIds) {
  if (!Array.isArray(issues)) throw new Error("invalid audit response");
  const allowed = new Set(batchIds);
  for (const issue of issues) {
    if (!allowed.has(issue.id) || !ids.has(issue.id) || !languages.includes(issue.language) || !issue.reason.trim()) {
      throw new Error("audit response includes an invalid issue");
    }
  }
}

async function auditBatch(batch, attempt = 1) {
  const body = {
    model,
    max_completion_tokens: 4000,
    response_format: responseFormat,
    messages: [
      { role: "system", content: "You are a meticulous multilingual localization QA editor. Return only the requested JSON schema." },
      {
        role: "user",
        content: [
          "Audit every translation in every record. The Slovak version is the source of truth.",
          "Report an issue only when there is a concrete error: a changed fact, changed correct answer, changed option meaning, incorrect answer at correctIndex, mistranslation, wrong language, or clear unnatural grammar.",
          "Do not report proper names, numbers, scientific symbols, internationally identical words, or minor stylistic alternatives. If a translation is sound, omit it.",
          "Portuguese must be European Portuguese. Check all question text, answer text, and all options.",
          JSON.stringify(batch.map(auditPayload)),
        ].join("\n\n"),
      },
    ],
  };
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`audit API ${response.status}: ${await response.text()}`);
  const content = (await response.json())?.choices?.[0]?.message?.content;
  if (!content) throw new Error("audit API returned no content");
  try {
    const parsed = JSON.parse(content);
    validateIssues(parsed.issues, batch.map((item) => item.id));
    return parsed.issues;
  } catch (error) {
    if (attempt >= 3) throw error;
    await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    return auditBatch(batch, attempt + 1);
  }
}

const batches = Array.from({ length: Math.ceil(source.length / batchSize) }, (_, index) => source.slice(index * batchSize, (index + 1) * batchSize));
const issues = [];
let cursor = 0;
let completed = 0;
async function worker() {
  while (cursor < batches.length) {
    const index = cursor++;
    const batchIssues = await auditBatch(batches[index]);
    issues.push(...batchIssues);
    completed += 1;
    console.log(`Audited batch ${completed}/${batches.length}; ${batchIssues.length} issue(s).`);
  }
}

await Promise.all(Array.from({ length: Math.min(workers, batches.length) }, worker));
const report = { sourceQuestions: source.length, auditedLanguages: languages, issueCount: issues.length, issues };
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`Audit completed with ${issues.length} issue(s). Report: ${reportPath}`);
