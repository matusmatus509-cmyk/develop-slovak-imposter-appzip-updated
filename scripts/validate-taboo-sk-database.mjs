import { readFile } from "node:fs/promises";
import path from "node:path";

const databasePath = path.resolve("client/src/data/tabooCardsSk.json");
const requiredCategories = [
  "Jedlo a nápoje",
  "Zvieratá",
  "Ľudia a povolania",
  "Predmety a domácnosť",
  "Miesta a cestovanie",
  "Aktivity a šport",
  "Filmy, seriály a kultúra",
  "Technológie a médiá",
  "Príroda a svet",
  "Všeobecné pojmy a situácie",
];

function normalized(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("sk").replace(/[^a-z0-9]/g, "");
}

const data = JSON.parse(await readFile(databasePath, "utf8"));
const cards = data.cards;
const errors = [];
const warnings = [];
const words = new Map();
const wordText = new Map();
const ids = new Set();
const exactCards = new Set();
const categories = new Map(requiredCategories.map((category) => [category, 0]));

if (data.version !== 1 || data.locale !== "sk") errors.push("Neplatné metadáta databázy.");
if (!Array.isArray(cards) || cards.length !== 1500) errors.push(`Očakáva sa 1 500 kariet, nájdených: ${Array.isArray(cards) ? cards.length : "neplatná hodnota"}.`);

for (let index = 0; index < cards.length; index += 1) {
  const card = cards[index];
  const expectedId = `taboo_sk_${String(index + 1).padStart(4, "0")}`;
  if (card.id !== expectedId || ids.has(card.id)) errors.push(`Neplatné alebo duplicitné ID pri karte ${index + 1}.`);
  ids.add(card.id);
  if (!categories.has(card.category)) errors.push(`Neznáma kategória: ${card.category}.`);
  else categories.set(card.category, categories.get(card.category) + 1);
  if (typeof card.word !== "string" || !card.word.trim()) errors.push(`Chýbajúce cieľové slovo pri karte ${card.id}.`);
  if (!Array.isArray(card.forbidden) || card.forbidden.length !== 4) errors.push(`Karta ${card.id} nemá presne štyri zakázané slová.`);
  const key = normalized(card.word);
  if (words.has(key)) errors.push(`Duplicitné cieľové slovo: ${card.word} / ${words.get(key)}.`);
  words.set(key, card.id);
  wordText.set(key, card.word);
  const forbiddenKeys = card.forbidden.map(normalized);
  if (new Set(forbiddenKeys).size !== 4) errors.push(`Duplicitné zakázané slovo na karte ${card.id}.`);
  if (forbiddenKeys.includes(key)) errors.push(`Cieľové slovo je zakázané na karte ${card.id}.`);
  if (forbiddenKeys.some((forbiddenKey) => forbiddenKey.length >= 4 && (forbiddenKey.includes(key) || key.includes(forbiddenKey)))) {
    errors.push(`Možný tvar alebo derivát cieľového slova v zákaze na karte ${card.id}.`);
  }
  const exactKey = `${key}|${forbiddenKeys.sort().join("|")}`;
  if (exactCards.has(exactKey)) errors.push(`Duplicitná karta ${card.id}.`);
  exactCards.add(exactKey);
}

for (const category of requiredCategories) {
  if (categories.get(category) !== 150) errors.push(`${category}: očakáva sa 150 kariet, nájdených ${categories.get(category) ?? 0}.`);
}

const wordKeys = [...words.keys()];
for (let a = 0; a < wordKeys.length; a += 1) {
  for (let b = a + 1; b < wordKeys.length; b += 1) {
    const first = wordKeys[a];
    const second = wordKeys[b];
    if (first.length >= 6 && second.length >= 6 && (first.includes(second) || second.includes(first))) {
      warnings.push(`${words.get(first)} (${wordText.get(first)}) a ${words.get(second)} (${wordText.get(second)}): možná blízka dvojica.`);
    }
  }
}

const report = {
  cards: cards.length,
  categories: Object.fromEntries(categories),
  errors,
  nearDuplicateWarnings: warnings,
  status: errors.length ? "FAILED" : "PASSED",
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
