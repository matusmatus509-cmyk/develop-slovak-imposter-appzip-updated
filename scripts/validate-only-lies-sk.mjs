import { readFile } from "node:fs/promises";
import path from "node:path";

const dataPath = path.resolve("client/src/data/onlyLies.json");
const cards = JSON.parse(await readFile(dataPath, "utf8"));
const allowedCategories = new Set([
  "animals", "food", "household", "everyday_life", "nature", "body", "calendar", "transport",
  "objects", "school", "technology", "sports", "weather", "clothing", "colors", "numbers", "geography",
]);
const bannedPatterns = [
  /\b(typický|obvykle|najčastejšie|v bežnom živote|ktorý sa používa|ktorý sa nachádza|ktorý ľudia používajú|ktorý poznáš)\b/i,
  /\b(enzým|chemický|chromozóm|hormón|vedecký odbor|teóri[ae])\b/i,
  /\b(example|todo)\b/i,
];
const normalize = (text) => text.toLocaleLowerCase("sk").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
const errors = [];
const warnings = [];
const ids = new Set();
const questions = new Set();
const categories = {};

if (!Array.isArray(cards)) errors.push("Súbor musí obsahovať pole kariet.");
if (cards.length !== 500) errors.push(`Očakáva sa presne 500 kariet, nájdených ${cards.length}.`);
for (const [index, card] of cards.entries()) {
  const prefix = `Karta ${index + 1}`;
  if (!/^ol_\d{4}$/.test(card.id ?? "")) errors.push(`${prefix}: neplatné ID.`);
  if (ids.has(card.id)) errors.push(`${prefix}: duplicitné ID ${card.id}.`);
  ids.add(card.id);
  if (!allowedCategories.has(card.category)) errors.push(`${prefix}: neznáma kategória ${card.category}.`);
  categories[card.category] = (categories[card.category] ?? 0) + 1;
  const question = card.translations?.sk;
  if (typeof question !== "string" || !question.trim()) { errors.push(`${prefix}: chýba slovenská otázka.`); continue; }
  if (Object.keys(card.translations ?? {}).some((language) => language !== "sk")) errors.push(`${prefix}: táto fáza smie obsahovať iba slovenský text.`);
  const words = question.trim().match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)?/gu) ?? [];
  if (!question.endsWith("?")) errors.push(`${prefix}: otázka musí končiť otáznikom.`);
  if (words.length < 2 || words.length > 10) errors.push(`${prefix}: otázka má ${words.length} slov, povolených je 2 až 10.`);
  if (question.length > 72) errors.push(`${prefix}: otázka je príliš dlhá.`);
  if (bannedPatterns.some((pattern) => pattern.test(question))) errors.push(`${prefix}: otázka obsahuje zakázanú školskú alebo výplňovú formuláciu.`);
  const key = normalize(question);
  if (questions.has(key)) errors.push(`${prefix}: duplicitná otázka ${question}`);
  questions.add(key);
  if (/^(Čo|Kde|Aké|Ktoré) môžeš/i.test(question)) warnings.push(`${prefix}: možná nejednoznačnosť — ${question}`);
}

const report = { count: cards.length, categoryCounts: categories, errors, warnings, status: errors.length ? "FAILED" : "PASSED" };
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
