/**
 * ── Rozšírenie databázy šarád ────────────────────────────────────────────────
 *
 * Karta šarád existuje v šiestich jazykoch naraz (sk + en, de, es, fr, pt) a
 * validátor hľadá duplicity v každom jazyku zvlášť. Preto sa nové slová píšu
 * rovno so všetkými prekladmi do `scripts/charades-additions/<kategória>.json`:
 *
 *   [{ "sk": "Žirafa", "en": "Giraffe", "de": "Giraffe",
 *      "es": "Jirafa", "fr": "Girafe", "pt": "Girafa" }]
 *
 * Automatické zdroje prekladov sa neosvedčili: Wikidata pod „Žirafa" vracia
 * súhvezdie Camelopardalis, holé slovenské podstatné mená („Bažant", „Tuleň")
 * bývajú na Wikipédii rozlišovacie stránky bez jazykových odkazov a SPARQL
 * endpoint počas výpadku pustí jeden dotaz za minútu. Preklady sú teda ručné,
 * tento skript ich iba kontroluje a pripája.
 *
 * ID kariet sú viazané na pozíciu (`charades_sk_NNNN`), takže nové karty idú
 * vždy na KONIEC súboru a existujúce sa neprečíslujú.
 *
 *   node scripts/apply-charades-additions.mjs            # report, nič nezapíše
 *   node scripts/apply-charades-additions.mjs --apply    # pripojí karty
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CARDS = path.join(ROOT, "client/src/data/charades.sk.json");
const LOCALES = path.join(ROOT, "client/src/data/charades.locales.json");
const ADDITIONS = path.join(ROOT, "scripts/charades-additions");

const LANGS = ["en", "de", "es", "fr", "pt"];
const TARGET = 200;
const APPLY = process.argv.includes("--apply");

// ── Pravidlá zhodné s validátorom (scripts/validate-charades.mjs) ────────────
const wordsOf = value =>
  String(value).trim().match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [];

function validText(value, maxWords) {
  return (
    typeof value === "string" &&
    value === value.trim() &&
    value.length > 0 &&
    value.length <= 62 &&
    wordsOf(value).length >= 1 &&
    wordsOf(value).length <= maxWords &&
    !/[:;|/]/.test(value) &&
    !/\s{2,}/.test(value) &&
    !/�/.test(value) &&
    !/TODO|placeholder|xxx/i.test(value)
  );
}

function normalize(value) {
  return String(value)
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const normalizeAscii = value =>
  normalize(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// ── Vstupy ───────────────────────────────────────────────────────────────────
const cards = JSON.parse(readFileSync(CARDS, "utf8"));
const locales = JSON.parse(readFileSync(LOCALES, "utf8"));

const additions = [];
for (const file of readdirSync(ADDITIONS).filter(name => name.endsWith(".json")).sort()) {
  const category = path.basename(file, ".json");
  const rows = JSON.parse(readFileSync(path.join(ADDITIONS, file), "utf8"));
  for (const row of rows) additions.push({ category, ...row });
}

/**
 * Obsadené texty v každom jazyku. Duplikát v ktoromkoľvek jazyku je chyba, aj
 * keď je slovenské slovo unikátne — „Sliepka" a „Kura" by oboje dali „Hen".
 */
const taken = new Map(["sk", ...LANGS].map(lang => [lang, new Map()]));
const claim = (lang, text, owner) => {
  taken.get(lang).set(normalize(text), owner);
  taken.get(lang).set(normalizeAscii(text), owner);
};
for (const card of cards) {
  claim("sk", card.text, card.text);
  for (const lang of LANGS) {
    const text = locales[lang]?.[card.id];
    if (text) claim(lang, text, card.text);
  }
}

// ── Vyhodnotenie ─────────────────────────────────────────────────────────────
const accepted = [];
const rejected = { duplicate: [], invalid: [] };

for (const row of additions) {
  const text = typeof row.sk === "string" ? row.sk.trim() : "";
  if (!validText(text, 3)) {
    rejected.invalid.push(`${row.category}: ${row.sk} (sk)`);
    continue;
  }
  const badLang = LANGS.find(lang => !validText(row[lang], 4));
  if (badLang) {
    rejected.invalid.push(`${row.category}: ${text} (${badLang}: ${row[badLang]})`);
    continue;
  }
  const clash = ["sk", ...LANGS].find(lang => {
    const value = lang === "sk" ? text : row[lang];
    const bag = taken.get(lang);
    return bag.has(normalize(value)) || bag.has(normalizeAscii(value));
  });
  if (clash) {
    const value = clash === "sk" ? text : row[clash];
    const owner =
      taken.get(clash).get(normalize(value)) ?? taken.get(clash).get(normalizeAscii(value));
    rejected.duplicate.push(`${row.category}: ${text} (${clash}: ${value} = ${owner})`);
    continue;
  }
  claim("sk", text, text);
  for (const lang of LANGS) claim(lang, row[lang], text);
  accepted.push({ category: row.category, text, translations: row });
}

// ── Report ───────────────────────────────────────────────────────────────────
const countsBefore = cards.reduce((acc, card) => {
  acc[card.category] = (acc[card.category] ?? 0) + 1;
  return acc;
}, {});
const addedBy = accepted.reduce((acc, card) => {
  acc[card.category] = (acc[card.category] ?? 0) + 1;
  return acc;
}, {});

process.stdout.write(
  `\nPrijatých ${accepted.length} z ${additions.length} návrhov` +
    ` · duplikáty: ${rejected.duplicate.length} · neplatné: ${rejected.invalid.length}\n\n`,
);
for (const category of Object.keys(countsBefore).sort()) {
  const before = countsBefore[category];
  const added = addedBy[category] ?? 0;
  const after = before + added;
  const flag = after >= TARGET ? "✓" : `chýba ${TARGET - after}`;
  process.stdout.write(
    `  ${category.padEnd(12)} ${String(before).padStart(3)} + ${String(added).padStart(3)}` +
      ` = ${String(after).padStart(3)}  ${flag}\n`,
  );
}
for (const [label, items] of [
  ["Duplikáty", rejected.duplicate],
  ["Neplatné", rejected.invalid],
]) {
  if (items.length === 0) continue;
  process.stdout.write(
    `\n${label} (${items.length}):\n${items.slice(0, 40).map(item => `  • ${item}`).join("\n")}\n`,
  );
}

if (!APPLY) {
  process.stdout.write("\n(bez --apply sa nič nezapisuje)\n");
  process.exit(0);
}

// ── Zápis ────────────────────────────────────────────────────────────────────
for (const card of accepted) {
  const id = `charades_sk_${String(cards.length + 1).padStart(4, "0")}`;
  cards.push({ id, text: card.text, category: card.category });
  for (const lang of LANGS) locales[lang][id] = card.translations[lang];
}
writeFileSync(CARDS, `${JSON.stringify(cards, null, 2)}\n`, "utf8");
writeFileSync(LOCALES, `${JSON.stringify(locales, null, 2)}\n`, "utf8");
process.stdout.write(
  `\n✓ Pridaných ${accepted.length} kariet · databáza má ${cards.length} kariet\n`,
);
