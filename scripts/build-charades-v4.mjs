// Rebuilds the charades database: keeps old "easy" cards (difficulty-free),
// merges new curated words, deduplicates, and writes final JSON datasets.
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.resolve("client/src/data");
const NEW_DIR = path.resolve("scripts/charades-v4");
const LANGS = ["en", "de", "es", "fr", "pt"];

const norm = (v) =>
  String(v)
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
const normAscii = (v) =>
  norm(v).normalize("NFD").replace(/[̀-ͯ]/g, "");

const words = (v) => String(v).trim().match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [];
const baseTextOk = (v, maxWords) =>
  typeof v === "string" && v === v.trim() && v.length > 0 && v.length <= 62 &&
  words(v).length >= 1 && words(v).length <= maxWords &&
  !/[:;|/]/.test(v) && !/\s{2,}/.test(v) && !/TODO|placeholder/i.test(v) &&
  !/�/.test(v);
const textOkSk = (v) => baseTextOk(v, 3); // slovenské kartičky max. 3 slová
const textOkTr = (v) => baseTextOk(v, 4); // preklady max. 4 slová

const oldCards = JSON.parse(await readFile(`${DATA_DIR}/charades.sk.json`, "utf8"));
const oldLocales = JSON.parse(await readFile(`${DATA_DIR}/charades.locales.json`, "utf8"));

// easy cards stay; medium/hard are dropped and their texts are banned from re-use
const seed = oldCards.filter((c) => c.difficulty === "easy");
const bannedTexts = oldCards.filter((c) => c.difficulty !== "easy");
// ban je citlivý na diakritiku (Väzenie ≠ Váženie), nie na veľkosť písmen
const bannedNorm = new Map();
for (const b of bannedTexts) bannedNorm.set(norm(b.text), b.text);

// rozhodnuté slová, ktoré ostávajú, ale potrebujú opravený preklad (kolízie)
const seedTranslationOverrides = {
  Kaviareň: { fr: "Salon de café", pt: "Cafetaria" },
};

// quality rejects among the easy words (adjectives/ambiguous weather states etc.)
const dropFromSeed = new Set([
  "Polojasno", "Jasno", "Zamračené", "Mrholenie", "Lejak", "Rosa", "Sucho", "Poľadovica",
]);
const remapCategory = {
  weather: "nature",
  buildings: "places",
  garden: "objects",
};
const moveToSchool = new Set(["Ceruzka", "Guľôčkové pero", "Mazacia guma", "Pravítko"]);

const finalCards = [];
const seenSk = new Map();
const errors = [];
let removedCount = bannedTexts.length;
let droppedQuality = 0;

for (const card of seed) {
  if (dropFromSeed.has(card.text)) { droppedQuality++; continue; }
  const category = moveToSchool.has(card.text)
    ? "school"
    : remapCategory[card.category] ?? card.category;
  const translations = {};
  for (const lang of LANGS) translations[lang] = oldLocales[lang][card.id];
  Object.assign(translations, seedTranslationOverrides[card.text] ?? {});
  finalCards.push({ text: card.text, category, translations, source: "kept-easy" });
  seenSk.set(normAscii(card.text), card.text);
}

// merge new words from category files + topup
const files = (await readdir(NEW_DIR)).filter((f) => f.endsWith(".json"));
let newAdded = 0;
for (const file of files) {
  const items = JSON.parse(await readFile(path.join(NEW_DIR, file), "utf8"));
  for (const item of items) {
    const isTopup = Array.isArray(item.w) && typeof item.c === "string";
    const category = isTopup ? item.c : file.replace(".json", "");
    const row = isTopup ? item.w : item;
    if (!Array.isArray(row) || row.length !== 6) {
      errors.push(`${file}: neplatný riadok ${JSON.stringify(row)}`);
      continue;
    }
    const [sk, en, de, es, fr, pt] = row;
    const key = normAscii(sk);
    if (seenSk.has(key)) {
      errors.push(`DUPLICATE_SK: „${sk}“ (kolízia s „${seenSk.get(key)}“)`);
      continue;
    }
    if (bannedNorm.has(key)) {
      errors.push(`BANNED_REUSE: „${sk}“ (bolo medium/hard: „${bannedNorm.get(key)}“)`);
      continue;
    }
    const translations = { en, de, es, fr, pt };
    finalCards.push({ text: sk, category, translations, source: "new" });
    seenSk.set(key, sk);
    newAdded++;
  }
}

// full validation
const report = { errors };
for (const lang of ["sk", ...LANGS]) {
  const groups = new Map();
  for (const c of finalCards) {
    const text = lang === "sk" ? c.text : c.translations[lang];
    const ok = lang === "sk" ? textOkSk(text) : textOkTr(text);
    if (!ok) errors.push(`${lang}: neplatný text „${text}“ (karta ${c.text})`);
    const k = normAscii(text);
    if (!k) continue;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(c.text);
  }
  for (const [k, list] of groups) {
    if (new Set(list).size > 1) {
      errors.push(`${lang}: duplicita „${k}“ → ${list.join(" | ")}`);
    }
  }
}

const byCat = {};
for (const c of finalCards) byCat[c.category] = (byCat[c.category] ?? 0) + 1;

console.log(JSON.stringify({
  oldTotal: oldCards.length,
  keptFromOld: seed.length - droppedQuality,
  removedDifficulty: removedCount,
  droppedQuality,
  newAdded,
  finalTotal: finalCards.length,
  byCategory: byCat,
  errorCount: errors.length,
}, null, 2));

if (errors.length) {
  console.log("\nERRORS:\n" + errors.map((e) => ` - ${e}`).join("\n"));
  process.exit(1);
}

// write outputs
const outCards = finalCards.map((c, i) => ({
  id: `charades_sk_${String(i + 1).padStart(4, "0")}`,
  text: c.text,
  category: c.category,
}));
const outLocales = Object.fromEntries(LANGS.map((l) => [l, {}]));
outCards.forEach((card, i) => {
  for (const lang of LANGS) outLocales[lang][card.id] = finalCards[i].translations[lang];
});
await writeFile(`${DATA_DIR}/charades.sk.json`, JSON.stringify(outCards, null, 2) + "\n");
await writeFile(`${DATA_DIR}/charades.locales.json`, JSON.stringify(outLocales, null, 2) + "\n");

await writeFile(
  "charades-v4-rebuild-report.json",
  JSON.stringify({
    oldTotal: oldCards.length,
    keptFromOld: seed.length - droppedQuality,
    removedDifficultyMeanHard: removedCount,
    droppedQuality,
    newAdded,
    finalTotal: finalCards.length,
    byCategory: byCat,
  }, null, 2) + "\n"
);
console.log("\nOK — zapísané charades.sk.json a charades.locales.json");
