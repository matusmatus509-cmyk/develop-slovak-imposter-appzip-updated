import { readFile } from "node:fs/promises";
import path from "node:path";

const masterPath = path.resolve("client/src/data/charades.sk.json");
const localesPath = path.resolve("client/src/data/charades.locales.json");
const languages = ["sk", "en", "de", "es", "fr", "pt"];
const localeLanguages = languages.filter(language => language !== "sk");
const difficulties = ["easy", "medium", "hard"];
const expectedCardCount = 1650;
const expectedDifficultyCounts = { easy: 550, medium: 550, hard: 550 };
const allowedCategories = new Set([
  "animals",
  "food",
  "professions",
  "sports",
  "activities",
  "vehicles",
  "objects",
  "household",
  "clothing",
  "nature",
  "weather",
  "places",
  "buildings",
  "travel",
  "instruments",
  "health",
  "games",
  "science",
  "garden",
  "history",
  "mythical_creatures",
]);

const [cards, locales] = await Promise.all([
  readFile(masterPath, "utf8").then(JSON.parse),
  readFile(localesPath, "utf8").then(JSON.parse),
]);
const errors = [];
const warnings = [];
const ids = new Set();
const difficultyCounts = Object.fromEntries(
  difficulties.map(difficulty => [difficulty, 0])
);
const wordCounts = Object.fromEntries(
  languages.map(language => [language, { one: 0, two: 0, invalid: 0 }])
);
const duplicateGroups = [];

const words = value =>
  String(value)
    .trim()
    .match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [];
const validText = value =>
  typeof value === "string" &&
  value === value.trim() &&
  value.length > 0 &&
  value.length <= 62 &&
  words(value).length >= 1 &&
  words(value).length <= 2 &&
  !/[:;|/]/.test(value) &&
  !/\s{2,}/.test(value);
const normalizeText = value =>
  String(value)
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
const normalizeAscii = value =>
  normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
const textFor = (card, language) =>
  language === "sk" ? card.text : locales?.[language]?.[card.id];

const recordWordCount = (language, value) => {
  const count = words(value).length;
  if (count === 1) wordCounts[language].one += 1;
  else if (count === 2) wordCounts[language].two += 1;
  else wordCounts[language].invalid += 1;
};

const collectDuplicates = (language, entries, normalize, mode) => {
  const groups = new Map();
  for (const entry of entries) {
    const key = normalize(entry.text);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  }
  for (const [text, matches] of groups) {
    if (matches.length < 2) continue;
    duplicateGroups.push({
      language,
      mode,
      text,
      ids: matches.map(entry => entry.id),
    });
    errors.push(
      `${language}/${mode}: duplicitný text „${text}“ pri ${matches.map(entry => entry.id).join(", ")}.`
    );
  }
};

if (!Array.isArray(cards)) {
  errors.push("charades.sk.json musí obsahovať pole.");
} else if (cards.length !== expectedCardCount) {
  errors.push(
    `Očakáva sa presne ${expectedCardCount} kariet, nájdených ${cards.length}.`
  );
}

for (
  let index = 0;
  index < (Array.isArray(cards) ? cards.length : 0);
  index += 1
) {
  const card = cards[index];
  const expectedId = `charades_sk_${String(index + 1).padStart(4, "0")}`;
  const keys = Object.keys(card).sort();
  if (
    JSON.stringify(keys) !==
    JSON.stringify(["category", "difficulty", "id", "text"])
  ) {
    errors.push(`${expectedId}: neplatná schéma karty (${keys.join(", ")}).`);
  }
  if (card.id !== expectedId) {
    errors.push(
      `Pozícia ${index + 1}: očakávané ID ${expectedId}, nájdené ${card.id}.`
    );
  }
  if (ids.has(card.id)) errors.push(`Duplicitné ID ${card.id}.`);
  ids.add(card.id);
  if (!difficulties.includes(card.difficulty)) {
    errors.push(`${card.id}: neplatná difficulty ${card.difficulty}.`);
  } else {
    difficultyCounts[card.difficulty] += 1;
  }
  if (!allowedCategories.has(card.category)) {
    errors.push(`${card.id}: neplatná kategória ${card.category}.`);
  }
  recordWordCount("sk", card.text);
  if (!validText(card.text)) {
    errors.push(
      `${card.id}/sk: text musí mať 1–2 slová, najviac 62 znakov a bez zakázanej interpunkcie.`
    );
  }
}

for (const [difficulty, expected] of Object.entries(expectedDifficultyCounts)) {
  if (difficultyCounts[difficulty] !== expected) {
    errors.push(
      `${difficulty}: očakáva sa ${expected}, nájdených ${difficultyCounts[difficulty]}.`
    );
  }
}

if (!locales || typeof locales !== "object" || Array.isArray(locales)) {
  errors.push("charades.locales.json musí obsahovať objekt jazykov.");
} else {
  const actualLanguages = Object.keys(locales).sort();
  if (
    JSON.stringify(actualLanguages) !==
    JSON.stringify([...localeLanguages].sort())
  ) {
    errors.push(
      `Locale jazyky: očakávané ${localeLanguages.join(", ")}, nájdené ${actualLanguages.join(", ")}.`
    );
  }

  for (const language of localeLanguages) {
    const translations = locales[language];
    if (
      !translations ||
      typeof translations !== "object" ||
      Array.isArray(translations)
    ) {
      errors.push(`${language}: chýba locale mapa.`);
      continue;
    }
    const keys = Object.keys(translations);
    if (keys.length !== expectedCardCount) {
      errors.push(
        `${language}: očakáva sa ${expectedCardCount} prekladov, nájdených ${keys.length}.`
      );
    }
    for (const id of keys) {
      if (!ids.has(id))
        errors.push(`${language}: preklad pre neznáme ID ${id}.`);
    }
    for (const card of cards) {
      const text = translations[card.id];
      recordWordCount(language, text);
      if (!validText(text)) {
        errors.push(
          `${card.id}/${language}: preklad musí mať 1–2 slová, najviac 62 znakov a bez zakázanej interpunkcie.`
        );
      }
    }
  }
}

for (const language of languages) {
  const entries = cards.map(card => ({
    id: card.id,
    text: textFor(card, language),
  }));
  collectDuplicates(language, entries, normalizeText, "normalized");
  collectDuplicates(language, entries, normalizeAscii, "accent-fold");
}

const scytheExpected = {
  sk: "Kosa",
  en: "Scythe",
  de: "Sense",
  es: "Guadaña",
  fr: "Faux",
  pt: "Foice",
};
const scytheCards = cards.filter(card => card.text === scytheExpected.sk);
if (scytheCards.length !== 1 || scytheCards[0]?.difficulty !== "hard") {
  errors.push(
    `Kosa musí byť presne raz a iba v hard; nájdené ${scytheCards.length}.`
  );
} else {
  const card = scytheCards[0];
  for (const language of localeLanguages) {
    if (locales?.[language]?.[card.id] !== scytheExpected[language]) {
      errors.push(
        `${card.id}/${language}: očakávaný preklad Kosy „${scytheExpected[language]}“.`
      );
    }
  }
}

const report = {
  cards: Array.isArray(cards) ? cards.length : null,
  difficultyCounts,
  localeCounts: Object.fromEntries(
    localeLanguages.map(language => [
      language,
      Object.keys(locales?.[language] ?? {}).length,
    ])
  ),
  wordCounts,
  oneWordShare: Object.fromEntries(
    languages.map(language => [
      language,
      Number((wordCounts[language].one / expectedCardCount).toFixed(4)),
    ])
  ),
  duplicateGroupCount: duplicateGroups.length,
  scytheRegression:
    scytheCards.length === 1 && scytheCards[0]?.difficulty === "hard",
  errors,
  warnings,
  status: errors.length ? "FAILED" : "PASSED",
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
