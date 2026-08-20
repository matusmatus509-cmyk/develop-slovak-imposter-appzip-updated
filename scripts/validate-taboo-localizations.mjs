import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(".");
const source = JSON.parse(await readFile(path.join(root, "client/src/data/tabooCardsSk.json"), "utf8"));
const localized = JSON.parse(await readFile(path.join(root, "client/src/data/tabooCards.locales.json"), "utf8"));
const languages = ["en", "de", "es", "fr", "pt"];
const selectedCategory = process.env.TABOO_TRANSLATION_CATEGORY?.trim() || null;
const normalize = (value) => value.toLocaleLowerCase("sk").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
const errors = [];
const scopeCards = selectedCategory ? source.cards.filter((card) => card.category === selectedCategory) : source.cards;
if (selectedCategory && !scopeCards.length) errors.push(`Neznáma kategória: ${selectedCategory}.`);
const sourceIds = new Set(scopeCards.map((card) => card.id));

if (localized.version !== 1 || localized.sourceLocale !== "sk") errors.push("Neplatné metadáta lokalizačného súboru.");
const counts = {};
for (const language of languages) {
  const rows = localized.locales?.[language];
  if (!rows || typeof rows !== "object") { errors.push(`Chýba locale ${language}.`); counts[language] = 0; continue; }
  const ids = Object.keys(rows);
  counts[language] = ids.length;
  const scopedIds = ids.filter((id) => sourceIds.has(id));
  if (scopedIds.length !== scopeCards.length) errors.push(`${language}: očakáva sa ${scopeCards.length} prekladov v rozsahu, nájdených ${scopedIds.length}.`);
  const targets = new Map();
  const exactCards = new Set();
  for (const sourceCard of scopeCards) {
    const card = rows[sourceCard.id];
    if (!card?.word?.trim()) { errors.push(`${language}/${sourceCard.id}: chýba cieľ.`); continue; }
    if (!Array.isArray(card.forbidden) || card.forbidden.length !== 4 || card.forbidden.some((word) => !String(word).trim())) errors.push(`${language}/${sourceCard.id}: očakávajú sa štyri neprázdne zákazy.`);
    const target = normalize(card.word);
    if (targets.has(target)) errors.push(`${language}: duplicitný cieľ ${card.word} (${sourceCard.id}/${targets.get(target)}).`);
    targets.set(target, sourceCard.id);
    const forbidden = card.forbidden.map(normalize);
    if (new Set(forbidden).size !== 4) errors.push(`${language}/${sourceCard.id}: duplicitný zákaz.`);
    if (forbidden.includes(target)) errors.push(`${language}/${sourceCard.id}: cieľ je medzi zákazmi.`);
    const key = `${target}|${[...forbidden].sort().join("|")}`;
    if (exactCards.has(key)) errors.push(`${language}/${sourceCard.id}: duplicitná kombinácia karty.`);
    exactCards.add(key);
  }
}

const report = { category: selectedCategory ?? "všetky", sourceCards: scopeCards.length, counts, errors, status: errors.length ? "FAILED" : "PASSED" };
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
