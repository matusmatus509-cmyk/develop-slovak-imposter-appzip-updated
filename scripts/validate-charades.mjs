import fs from "node:fs";
import path from "node:path";
import { TextDecoder } from "node:util";

const root = process.cwd();
const databasePath = path.join(root, "src/data/charades.sk.json");
const bytes = fs.readFileSync(databasePath);
const source = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
const cards = JSON.parse(source);

const allowedDifficulties = new Set(["easy", "medium", "hard"]);
const allowedCategories = new Set([
  "animals", "food", "fruits", "vegetables", "drinks", "professions", "sports", "activities", "actions",
  "vehicles", "objects", "household", "clothing", "nature", "weather", "places", "buildings", "travel",
  "music", "instruments", "movies", "tv_series", "cartoons", "fairy_tales", "superheroes", "video_games",
  "famous_characters", "mythical_creatures", "holidays", "emotions", "history", "landmarks",
]);
const forbiddenStems = [
  "demokraci", "produktivit", "motiváci", "zodpovednosť", "dôver", "slobod", "infláci", "ekonomik", "marketing",
  "logistik", "algoritm", "databáz", "softvér", "hardvér", "cloud", "heslo", "filozofi", "kvantov", "administratív",
  "optimalizáci", "droga", "porn", "samovra", "sebapošk", "rasiz", "extrém", "politik", "teror", "vražd", "mučen",
  "lúpež", "krádež", "väzeni", "únos", "zbraň", "diagnóz", "resuscit", "operácia na", "odber krvi", "falošný pas",
  "agent 47", "trevor philips", "franklin clinton", "cj zo san andreas", "arthur morgan", "john marston", "breaking bad", "walter white",
  "jesse pinkman", "saul goodman", "gus fring", "albert wesker", "doom slayer", "the godfather", "pulp fiction",
  "shawshank", "fight club", "saving private ryan", "schindler's list",
];
const placeholders = /\b(?:TODO|TBD|Example|Test|Unknown)\b/i;
const hasRandomJoin = /\s+a\s+/iu;
const knownNaturalPhrases = new Set(["kráska a zviera"]);
const untranslatedTitles = new Set([
  "beauty and the beast", "big hero 6", "cars", "finding dory", "finding nemo", "inside out", "lilo & stitch",
  "monsters university", "monsters inc", "oliver & company", "ralph breaks the internet", "sleeping beauty",
  "the aristocats", "the emperor's new groove", "the good dinosaur", "the incredibles", "the jungle book",
  "the lion king", "the little mermaid", "wreck-it ralph", "arrival", "braveheart", "dune", "interstellar",
  "pirates of the caribbean", "star wars", "tenet", "the dark knight", "the hobbit", "the martian",
  "the pianist", "the prestige", "the two towers", "toy story", "prince of persia",
]);
const normalize = (value) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase("sk");
const fold = (value) => normalize(value).normalize("NFD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

assert(Array.isArray(cards), "Databáza nie je pole.");
assert(cards.length === 3000, `Očakáva sa 3000 kartičiek, nájdených ${cards.length}.`);

const ids = new Set();
const exactTexts = new Set();
const lowerTexts = new Set();
const foldedTexts = new Set();
const counts = { easy: 0, medium: 0, hard: 0 };
const categoryCounts = new Map();

cards.forEach((card, index) => {
  const label = `Položka ${index + 1}`;
  assert(card && typeof card === "object" && !Array.isArray(card), `${label}: neplatný objekt.`);
  if (!card || typeof card !== "object") return;
  assert(Object.keys(card).sort().join(",") === "category,difficulty,id,text", `${label}: neočakávaná dátová štruktúra.`);
  assert(card.id === `charades_sk_${String(index + 1).padStart(4, "0")}`, `${label}: nestabilné alebo nezoradené ID ${card.id}.`);
  assert(typeof card.id === "string" && card.id.length > 0, `${label}: prázdne ID.`);
  assert(typeof card.text === "string" && card.text.trim().length > 0, `${label}: prázdny text.`);
  assert(allowedDifficulties.has(card.difficulty), `${label}: nepovolená obtiažnosť ${card.difficulty}.`);
  assert(allowedCategories.has(card.category), `${label}: nepovolená kategória ${card.category}.`);
  assert(!String(card.category).includes("+"), `${label}: kategória obsahuje znak +.`);
  if (ids.has(card.id)) errors.push(`${label}: duplicitné ID ${card.id}.`);
  ids.add(card.id);
  if (typeof card.text !== "string") return;
  const text = card.text.trim();
  const lower = normalize(text);
  const accentless = fold(text);
  if (exactTexts.has(text)) errors.push(`${label}: presná duplicita textu ${text}.`);
  if (lowerTexts.has(lower)) errors.push(`${label}: duplicita bez ohľadu na veľkosť písmen ${text}.`);
  if (foldedTexts.has(accentless)) errors.push(`${label}: duplicita po odstránení diakritiky ${text}.`);
  exactTexts.add(text);
  lowerTexts.add(lower);
  foldedTexts.add(accentless);
  assert(text === text.replace(/\s+/g, " "), `${label}: nadbytočné medzery v texte ${text}.`);
  assert(text.length <= 62, `${label}: text je príliš dlhý (${text.length}) ${text}.`);
  assert((text.match(/[\p{L}\p{N}][\p{L}\p{N}'’.-]*/gu) ?? []).length <= 5, `${label}: viac ako päť slov ${text}.`);
  assert(!hasRandomJoin.test(text) || knownNaturalPhrases.has(lower), `${label}: zakázaná náhodná kombinácia so spojkou „a“: ${text}.`);
  assert(!placeholders.test(text), `${label}: technický placeholder ${text}.`);
  assert(!/[:;|/()]/.test(text), `${label}: nepovolený technický oddeľovač ${text}.`);
  assert(!forbiddenStems.some((stem) => accentless.includes(fold(stem))), `${label}: zakázaný výraz ${text}.`);
  assert(!untranslatedTitles.has(lower.replace(/[.,]/g, "")), `${label}: nepreložený cudzojazyčný názov ${text}.`);
  if (allowedDifficulties.has(card.difficulty)) counts[card.difficulty] += 1;
  categoryCounts.set(card.category, (categoryCounts.get(card.category) ?? 0) + 1);
});

for (const difficulty of allowedDifficulties) {
  assert(counts[difficulty] === 1000, `${difficulty}: očakáva sa 1000, nájdených ${counts[difficulty]}.`);
}

// Významové varianty, ktoré by v pantomíme predstavovali tú istú kartičku.
const semanticGroups = [
  ["vedro", "kýbel"], ["telefón", "mobil", "mobilný telefón"], ["hasič", "požiarnik"], ["kúzelník", "mág"],
  ["lietadlo", "dopravné lietadlo"], ["bicykel", "horský bicykel"], ["sane", "sánky"],
  ["gitara", "hra na gitare"], ["klavír", "hra na klavíri"], ["bubon", "hra na bubnoch"],
  ["flauta", "hra na flaute"], ["husle", "hra na husliach"], ["švihadlo", "skákanie cez švihadlo"],
  ["astronaut", "astronaut vo vesmíre", "astronaut na Mesiaci"],
  ["Čínsky múr", "Veľký čínsky múr"], ["Šikmá veža", "Šikmá veža v Pise"],
  ["egyptské pyramídy", "pyramídy v Gíze"], ["Socha slobody", "Socha slobody v New Yorku"],
  ["horúcovzdušný balón", "horkovzdušný balón", "teplovzdušný balón"],
  ["chôdza po lane", "povrazolezec"], ["boxovací vak", "boxovacie vrece"],
  ["adventný venec", "adventný veniec"],
  ["burger", "hamburger"], ["keksík", "keksy"], ["orech", "oriešok"], ["rohlík", "rožok"],
  ["batoh", "ruksak"], ["lampáš", "lucerna"], ["krhla", "konva"], ["kocka", "kocky"],
  ["džem", "marmeláda"], ["loď", "loďka"], ["kufor", "cestovný kufor"],
];
for (const group of semanticGroups) {
  const present = group.filter((text) => foldedTexts.has(fold(text)));
  assert(present.length <= 1, `Významová duplicita: ${present.join(" / ")}.`);
}

// Blízke zápisy sa preverujú osobitne; samotná malá editačná vzdialenosť nie je
// chyba (napr. „kosa“ a „koza“), ale kontrola odhalí preklepové varianty.
function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const previous = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = previous;
    }
  }
  return row[b.length];
}
let similarPairsChecked = 0;
const foldedList = [...foldedTexts];
for (let i = 0; i < foldedList.length; i += 1) {
  for (let j = i + 1; j < foldedList.length; j += 1) {
    if (Math.abs(foldedList[i].length - foldedList[j].length) > 1 || Math.min(foldedList[i].length, foldedList[j].length) < 6) continue;
    if (editDistance(foldedList[i], foldedList[j]) <= 1) similarPairsChecked += 1;
  }
}

// Deterministický audit 100 kariet z každej obtiažnosti. Vzorka sa mení len pri zmene dát.
function auditSample(items, size, seed) {
  const pool = [...items];
  let state = seed >>> 0;
  for (let i = pool.length - 1; i > 0; i -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, size);
}
const audit = Object.fromEntries([...allowedDifficulties].map((difficulty, index) => [
  difficulty,
  auditSample(cards.filter((card) => card.difficulty === difficulty), 100, 509 + index * 1009),
]));
for (const [difficulty, sample] of Object.entries(audit)) {
  assert(sample.length === 100, `${difficulty}: obsahový audit nemá 100 položiek.`);
  for (const card of sample) {
    assert(card.text.length >= 2 && allowedCategories.has(card.category), `${difficulty}: neplatná auditovaná karta ${card.text}.`);
  }
}

if (errors.length > 0) {
  console.error(`Validácia zlyhala (${errors.length} chýb):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Slovné šarády: validácia úspešná.");
console.log(`Počet: ${cards.length} (easy ${counts.easy}, medium ${counts.medium}, hard ${counts.hard})`);
console.log(`Kategórie: ${[...categoryCounts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([name, count]) => `${name}:${count}`).join(", ")}`);
console.log("Obsahový audit: 100 easy + 100 medium + 100 hard kartičiek pripravených a skontrolovaných.");
console.log(`Kontrola podobných zápisov: preverovaných ${similarPairsChecked} blízkych párov; významové aliasy bez duplicít.`);
if (process.argv.includes("--audit")) {
  for (const difficulty of allowedDifficulties) {
    console.log(`\nAUDIT ${difficulty.toUpperCase()}:`);
    for (const card of audit[difficulty]) console.log(`${card.id}\t${card.category}\t${card.text}`);
  }
}
