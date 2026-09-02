import { readFile } from "node:fs/promises";
import path from "node:path";

const masterPath = path.resolve("client/src/data/charades.sk.json");
const localesPath = path.resolve("client/src/data/charades.locales.json");
const languages = ["sk", "en", "de", "es", "fr", "pt"];
const localeLanguages = languages.filter((l) => l !== "sk");
const minCardCount = 1500;
const minCategoryCount = 25;
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
  "places",
  "instruments",
  "health",
  "games",
  "school",
  "technology",
  "people",
]);

const [cards, locales] = await Promise.all([
  readFile(masterPath, "utf8").then(JSON.parse),
  readFile(localesPath, "utf8").then(JSON.parse),
]);
const errors = [];
const ids = new Set();
const categoryCounts = Object.fromEntries([...allowedCategories].map((c) => [c, 0]));
const duplicateGroups = [];

const words = (value) =>
  String(value).trim().match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [];
const baseValid = (value, maxWords) =>
  typeof value === "string" &&
  value === value.trim() &&
  value.length > 0 &&
  value.length <= 62 &&
  words(value).length >= 1 &&
  words(value).length <= maxWords &&
  !/[:;|/]/.test(value) &&
  !/\s{2,}/.test(value) &&
  !/�/.test(value) &&
  !/TODO|placeholder|xxx/i.test(value);
const validSk = (value) => baseValid(value, 3);
const validLocale = (value) => baseValid(value, 4);
const normalize = (value) =>
  String(value)
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
const normalizeAscii = (value) =>
  normalize(value).normalize("NFD").replace(/[̀-ͯ]/g, "");

if (!Array.isArray(cards)) {
  errors.push("charades.sk.json musí obsahovať pole.");
} else if (cards.length < minCardCount) {
  errors.push(`Očakáva sa aspoň ${minCardCount} kariet, nájdených ${cards.length}.`);
}

for (let index = 0; index < (Array.isArray(cards) ? cards.length : 0); index += 1) {
  const card = cards[index];
  const expectedId = `charades_sk_${String(index + 1).padStart(4, "0")}`;
  const keys = Object.keys(card).sort();
  if (JSON.stringify(keys) !== JSON.stringify(["category", "id", "text"])) {
    errors.push(`${expectedId}: neplatná schéma karty (${keys.join(", ")}).`);
  }
  if (card.id !== expectedId) {
    errors.push(`Pozícia ${index + 1}: očakávané ID ${expectedId}, nájdené ${card.id}.`);
  }
  if (ids.has(card.id)) errors.push(`Duplicitné ID ${card.id}.`);
  ids.add(card.id);
  if ("difficulty" in card) {
    errors.push(`${card.id}: karta nesmie obsahovať difficulty (databáza bez obtiažností).`);
  }
  if (!allowedCategories.has(card.category)) {
    errors.push(`${card.id}: neplatná kategória ${card.category}.`);
  } else {
    categoryCounts[card.category] += 1;
  }
  if (!validSk(card.text)) {
    errors.push(`${card.id}/sk: text musí mať 1–3 slová, najviac 62 znakov a bez zakázanej interpunkcie: „${card.text}“.`);
  }
}

for (const [category, count] of Object.entries(categoryCounts)) {
  if (count < minCategoryCount) {
    errors.push(`Kategória ${category}: očakáva sa aspoň ${minCategoryCount} kariet, nájdených ${count}.`);
  }
}

if (!locales || typeof locales !== "object" || Array.isArray(locales)) {
  errors.push("charades.locales.json musí obsahovať objekt jazykov.");
} else {
  const actualLanguages = Object.keys(locales).sort();
  if (JSON.stringify(actualLanguages) !== JSON.stringify([...localeLanguages].sort())) {
    errors.push(`Locale jazyky: očakávané ${localeLanguages.join(", ")}, nájdené ${actualLanguages.join(", ")}.`);
  }
  for (const language of localeLanguages) {
    const translations = locales[language];
    if (!translations || typeof translations !== "object" || Array.isArray(translations)) {
      errors.push(`${language}: chýba locale mapa.`);
      continue;
    }
    if (Object.keys(translations).length !== cards.length) {
      errors.push(`${language}: očakáva sa ${cards.length} prekladov, nájdených ${Object.keys(translations).length}.`);
    }
    for (const id of Object.keys(translations)) {
      if (!ids.has(id)) errors.push(`${language}: preklad pre neznáme ID ${id}.`);
    }
    for (const card of cards) {
      const text = translations[card.id];
      if (!validLocale(text)) {
        errors.push(`${card.id}/${language}: neplatný preklad „${text}“.`);
      }
    }
  }
}

// duplicity v každom jazyku: exact aj accent-folded
for (const language of languages) {
  for (const mode of ["normalized", "accent-fold"]) {
    const norm = mode === "normalized" ? normalize : normalizeAscii;
    const groups = new Map();
    for (const card of cards) {
      const text = language === "sk" ? card.text : locales?.[language]?.[card.id];
      const key = norm(text);
      if (!key) continue;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(card.id);
    }
    for (const [text, matches] of groups) {
      if (matches.length < 2) continue;
      duplicateGroups.push({ language, mode, text, ids: matches });
      errors.push(`${language}/${mode}: duplicitný text „${text}“ pri ${matches.join(", ")}.`);
    }
  }
}

const report = {
  cards: Array.isArray(cards) ? cards.length : null,
  minCardCount,
  categoryCounts,
  localeCounts: Object.fromEntries(
    localeLanguages.map((language) => [language, Object.keys(locales?.[language] ?? {}).length])
  ),
  duplicateGroupCount: duplicateGroups.length,
  errors,
  status: errors.length ? "FAILED" : "PASSED",
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
