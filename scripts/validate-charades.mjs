import { readFile } from "node:fs/promises";
import path from "node:path";

const masterPath = path.resolve("client/src/data/charades.sk.json");
const localesPath = path.resolve("client/src/data/charades.locales.json");
const languages = ["en", "de", "es", "fr", "pt"];
const difficulties = ["easy", "medium", "hard"];
const expectedDifficultyCounts = { easy: 1000, medium: 1000, hard: 1200 };
const allowedCategories = new Set([
  "animals",
  "food",
  "fruits",
  "vegetables",
  "drinks",
  "professions",
  "sports",
  "activities",
  "actions",
  "vehicles",
  "objects",
  "household",
  "clothing",
  "nature",
  "weather",
  "places",
  "buildings",
  "travel",
  "music",
  "instruments",
  "movies",
  "tv_series",
  "cartoons",
  "fairy_tales",
  "superheroes",
  "video_games",
  "famous_characters",
  "mythical_creatures",
  "holidays",
  "emotions",
  "history",
  "landmarks",
]);
const forbiddenHardCategories = new Set([
  "cartoons",
  "fairy_tales",
  "famous_characters",
  "landmarks",
  "movies",
  "music",
  "superheroes",
  "tv_series",
  "video_games",
]);
const forbiddenHardNames = [
  "aladin",
  "ariel",
  "asterix",
  "batman",
  "cinderella",
  "darth vader",
  "donald duck",
  "elvis",
  "elsa",
  "frodo",
  "garfield",
  "harry potter",
  "hercules",
  "homer simpson",
  "iron man",
  "james bond",
  "joker",
  "lara croft",
  "mario",
  "mickey mouse",
  "minnie mouse",
  "mozart",
  "napoleon",
  "pikachu",
  "pinocchio",
  "santa claus",
  "sherlock holmes",
  "shrek",
  "simba",
  "sonic",
  "spider man",
  "spongebob",
  "superman",
  "thor",
  "tom and jerry",
  "wednesday",
  "wonder woman",
  "yoda",
  "zorro",
];

const [cards, locales] = await Promise.all([
  readFile(masterPath, "utf8").then(JSON.parse),
  readFile(localesPath, "utf8").then(JSON.parse),
]);
const errors = [];
const warnings = [];
const ids = new Set();
const counts = Object.fromEntries(
  difficulties.map(difficulty => [difficulty, 0])
);
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
  words(value).length <= 5 &&
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

if (!Array.isArray(cards)) {
  errors.push("charades.sk.json musí obsahovať pole.");
} else if (cards.length !== 3200) {
  errors.push(`Očakáva sa presne 3200 kariet, nájdených ${cards.length}.`);
}

for (
  let index = 0;
  index < (Array.isArray(cards) ? cards.length : 0);
  index += 1
) {
  const card = cards[index];
  const expectedId = `charades_sk_${String(index + 1).padStart(4, "0")}`;
  if (card.id !== expectedId)
    errors.push(
      `Pozícia ${index + 1}: očakávané ID ${expectedId}, nájdené ${card.id}.`
    );
  if (ids.has(card.id)) errors.push(`Duplicitné ID ${card.id}.`);
  ids.add(card.id);
  if (!difficulties.includes(card.difficulty))
    errors.push(`${card.id}: neplatná difficulty ${card.difficulty}.`);
  else counts[card.difficulty] += 1;
  if (!allowedCategories.has(card.category))
    errors.push(`${card.id}: neplatná kategória ${card.category}.`);
  if (!validText(card.text))
    errors.push(
      `${card.id}/sk: text nespĺňa limit 1–5 slov, 62 znakov alebo interpunkciu.`
    );
  if (card.difficulty === "hard") {
    if (forbiddenHardCategories.has(card.category))
      errors.push(`${card.id}: zakázaná hard kategória ${card.category}.`);
    const normalized = normalizeAscii(card.text);
    for (const name of forbiddenHardNames) {
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`(?:^| )${escaped}(?: |$)`, "i").test(normalized)) {
        errors.push(
          `${card.id}: hard text obsahuje zakázané meno alebo vlastný názov „${name}“ (${card.text}).`
        );
      }
    }
  }
}

for (const [difficulty, expected] of Object.entries(expectedDifficultyCounts)) {
  if (counts[difficulty] !== expected)
    errors.push(
      `${difficulty}: očakáva sa ${expected}, nájdených ${counts[difficulty]}.`
    );
}

const duplicateGroups = [];
const collectDuplicates = (language, entries, strictDifficulty) => {
  const groups = new Map();
  for (const entry of entries) {
    const key = normalizeText(entry.text);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  }
  for (const [text, matches] of groups) {
    if (matches.length < 2) continue;
    duplicateGroups.push({
      language,
      difficulty: strictDifficulty,
      text,
      ids: matches.map(entry => entry.id),
    });
    errors.push(
      `${language}/${strictDifficulty}: duplicitný text „${text}“ pri ${matches.map(entry => entry.id).join(", ")}.`
    );
  }
};

collectDuplicates(
  "sk",
  cards.map(card => ({ id: card.id, text: card.text })),
  "all"
);

if (!locales || typeof locales !== "object" || Array.isArray(locales)) {
  errors.push("charades.locales.json musí obsahovať objekt jazykov.");
} else {
  const localeLanguages = Object.keys(locales).sort();
  if (
    JSON.stringify(localeLanguages) !== JSON.stringify([...languages].sort())
  ) {
    errors.push(
      `Locale jazyky: očakávané ${languages.join(", ")}, nájdené ${localeLanguages.join(", ")}.`
    );
  }
  for (const language of languages) {
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
    if (keys.length !== 3200)
      errors.push(
        `${language}: očakáva sa 3200 prekladov, nájdených ${keys.length}.`
      );
    for (const id of keys)
      if (!ids.has(id))
        errors.push(`${language}: preklad pre neznáme ID ${id}.`);
    for (const card of cards) {
      const text = translations[card.id];
      if (typeof text !== "string" || !text.trim())
        errors.push(`${language}: chýba preklad ${card.id}.`);
      if (card.difficulty === "hard" && !validText(text)) {
        errors.push(
          `${card.id}/${language}: hard preklad nespĺňa limit 1–5 slov, 62 znakov alebo interpunkciu.`
        );
      }
    }
    collectDuplicates(
      language,
      cards
        .filter(card => card.difficulty === "hard")
        .map(card => ({ id: card.id, text: translations[card.id] })),
      "hard"
    );
  }
}

const report = {
  cards: Array.isArray(cards) ? cards.length : null,
  difficultyCounts: counts,
  localeCounts: Object.fromEntries(
    languages.map(language => [
      language,
      Object.keys(locales?.[language] ?? {}).length,
    ])
  ),
  hardForbiddenCategoryCount: errors.filter(error =>
    error.includes("zakázaná hard kategória")
  ).length,
  hardForbiddenNameCount: errors.filter(error =>
    error.includes("zakázané meno")
  ).length,
  duplicateGroupCount: duplicateGroups.length,
  errors,
  warnings,
  status: errors.length ? "FAILED" : "PASSED",
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
