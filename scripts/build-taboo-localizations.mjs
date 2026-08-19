import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(".");
const sourcePath = path.join(root, "client/src/data/tabooCardsSk.json");
const outputPath = path.join(root, "client/src/data/tabooCards.locales.json");
const languages = ["en", "de", "es", "fr", "pt"];
const batchSize = Number(process.env.TABOO_TRANSLATION_BATCH_SIZE ?? 20);
const maxBatches = Number(process.env.TABOO_TRANSLATION_MAX_BATCHES ?? Number.POSITIVE_INFINITY);
const model = process.env.TABOO_TRANSLATION_MODEL ?? "gpt-5-mini";
const selectedCategory = process.env.TABOO_TRANSLATION_CATEGORY?.trim() || null;
const batchReportPath = path.join(root, "taboo-localization-batch-reports.json");

const normalize = (value) => value
  .toLocaleLowerCase("sk")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]/g, "");

async function loadOutput() {
  try {
    const parsed = JSON.parse(await readFile(outputPath, "utf8"));
    if (parsed?.version !== 1 || parsed?.sourceLocale !== "sk" || !parsed?.locales) throw new Error("Neplatný formát existujúcej lokalizácie.");
    for (const language of languages) parsed.locales[language] ??= {};
    return parsed;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return { version: 1, sourceLocale: "sk", locales: Object.fromEntries(languages.map((language) => [language, {}])) };
  }
}

function inScope(cards) {
  return selectedCategory ? cards.filter((card) => card.category === selectedCategory) : cards;
}

function pending(source, localized) {
  return inScope(source.cards).filter((card) => languages.some((language) => !localized.locales[language][card.id]));
}

async function saveBatchReport(report) {
  let reports = [];
  try { reports = JSON.parse(await readFile(batchReportPath, "utf8")); } catch (error) { if (error.code !== "ENOENT") throw error; }
  const withoutCurrent = reports.filter((entry) => entry.category !== report.category);
  await writeFile(batchReportPath, `${JSON.stringify([...withoutCurrent, report], null, 2)}\n`, "utf8");
}

function schema() {
  const translatedCard = {
    type: "object",
    properties: {
      id: { type: "string" },
      en: { $ref: "#/$defs/card" },
      de: { $ref: "#/$defs/card" },
      es: { $ref: "#/$defs/card" },
      fr: { $ref: "#/$defs/card" },
      pt: { $ref: "#/$defs/card" },
    },
    required: ["id", "en", "de", "es", "fr", "pt"],
    additionalProperties: false,
  };
  return {
    type: "object",
    properties: { cards: { type: "array", items: translatedCard } },
    required: ["cards"],
    additionalProperties: false,
    $defs: {
      card: {
        type: "object",
        properties: {
          word: { type: "string" },
          forbidden: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
        },
        required: ["word", "forbidden"],
        additionalProperties: false,
      },
    },
  };
}

const systemPrompt = `You are a senior native localization editor for party-game Taboo cards. Translate Slovak master cards into natural English, German, Spanish, French, and Brazilian Portuguese. Preserve exactly the same card concept and the semantic role of every one of the four forbidden clues. Do not add, remove, merge, or reorder cards. Keep personal names and internationally standard titles in the conventional form used by each target language, and use idiomatic target-language equivalents rather than literal calques. Every output target and forbidden clue must be a short, natural expression a native speaker would recognize in a party game. Use correct spelling, accents, grammar, and German noun capitalization. Never output Slovak text unless it is an internationally unchanged proper name. Return only JSON that satisfies the schema.`;

async function requestTranslation(cards) {
  const response = await fetch(`${process.env.OPENAI_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Translate this exact batch. Categories are context only and must not be translated in the response.\n${JSON.stringify(cards.map(({ id, category, word, forbidden }) => ({ id, category, word, forbidden })))}` },
      ],
      max_completion_tokens: 6000,
      response_format: { type: "json_schema", json_schema: { name: "taboo_localizations", strict: true, schema: schema() } },
    }),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Prekladový model vrátil ${response.status}: ${body.slice(0, 500)}`);
  const parsed = JSON.parse(body);
  const content = parsed.choices?.[0]?.message?.content;
  if (!content) throw new Error(`Prekladový model nevrátil obsah: ${body.slice(0, 500)}`);
  return JSON.parse(content);
}

function validateBatch(sourceCards, translated) {
  const expectedIds = new Set(sourceCards.map((card) => card.id));
  if (!Array.isArray(translated.cards) || translated.cards.length !== sourceCards.length) throw new Error("Model nevrátil presný počet kariet v dávke.");
  const actualIds = new Set(translated.cards.map((card) => card.id));
  if (actualIds.size !== expectedIds.size || [...expectedIds].some((id) => !actualIds.has(id))) throw new Error("Model zmenil alebo vynechal ID karty.");
  for (const card of translated.cards) {
    for (const language of languages) {
      const localization = card[language];
      if (!localization?.word?.trim() || !Array.isArray(localization.forbidden) || localization.forbidden.length !== 4) throw new Error(`Neplatný preklad ${card.id}/${language}.`);
      const word = normalize(localization.word);
      const forbidden = localization.forbidden.map(normalize);
      if (forbidden.some((value) => !value) || new Set(forbidden).size !== 4) throw new Error(`Prázdny alebo duplicitný zákaz ${card.id}/${language}.`);
      if (forbidden.includes(word)) throw new Error(`Cieľ je zakázaný na karte ${card.id}/${language}.`);
    }
  }
}

const source = JSON.parse(await readFile(sourcePath, "utf8"));
if (selectedCategory && !source.cards.some((card) => card.category === selectedCategory)) {
  throw new Error(`Neznáma kategória: ${selectedCategory}`);
}
const localized = await loadOutput();
let remaining = pending(source, localized);
let batchNumber = 0;
const scopeCards = inScope(source.cards);
const translatedBefore = scopeCards.filter((card) => languages.every((language) => localized.locales[language][card.id])).length;
console.log(JSON.stringify({ model, category: selectedCategory ?? "všetky", categoryCards: scopeCards.length, pendingCards: remaining.length, batchSize }, null, 2));

while (remaining.length && batchNumber < maxBatches) {
  batchNumber += 1;
  const batch = remaining.slice(0, batchSize);
  let translated;
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      translated = await requestTranslation(batch);
      validateBatch(batch, translated);
      break;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
  if (!translated) throw lastError;
  for (const card of translated.cards) {
    for (const language of languages) localized.locales[language][card.id] = card[language];
  }
  await writeFile(outputPath, `${JSON.stringify(localized, null, 2)}\n`, "utf8");
  remaining = pending(source, localized);
  console.log(`Dávka ${batchNumber} (${selectedCategory ?? "všetky"}): ${batch.length} kariet; zostáva ${remaining.length}.`);
}

const translatedAfter = scopeCards.filter((card) => languages.every((language) => localized.locales[language][card.id])).length;
const report = {
  category: selectedCategory ?? "všetky",
  categoryCards: scopeCards.length,
  translatedCards: translatedAfter,
  translatedThisRun: translatedAfter - translatedBefore,
  correctedTranslations: 0,
  validation: remaining.length === 0 ? "ready_for_category_validation" : "incomplete",
  remainingCards: remaining.length,
};
await saveBatchReport(report);
console.log(JSON.stringify({ complete: remaining.length === 0, outputPath, report }, null, 2));
