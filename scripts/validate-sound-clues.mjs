// Validácia databázy pre minihru "Uhádni zvuk" (SOUND_CLUES).
//
// Overuje: unikátnosť ID a labelov (dedup kľúč runtime loadera je `label`),
// normalizované duplicitné odpovede/labely, chýbajúce povinné polia,
// platnosť licenčného poľa, neprázdne kategórie a distribúciu kategórií.
// Nekontroluje HTTP dostupnosť audioUrl (samostatný krok, sieťovo náročný —
// pozri scripts/check-sound-urls.mjs), pretože to by robilo tento skript
// pomalým a nespoľahlivým v offline CI prostrediach.

import { readFile } from "node:fs/promises";
import path from "node:path";

const dataPath = path.resolve("client/src/data/teamBattleExtras.ts");
const src = await readFile(dataPath, "utf8");

const VALID_LICENSES = new Set([
  "CC BY 4.0",
  "CC BY-SA 4.0",
  "CC BY-SA 3.0",
  "CC BY 3.0",
  "CC0",
  "Public domain",
  "Licencia je uvedená na zdrojovej stránke",
]);

/**
 * Runtime engine (SoundBuzzer.tsx) importuje `SOUND_CLUES` priamo z
 * TypeScript modulu, nie z JSON. Aby validácia nezávisela na build tooling
 * (esbuild/vite) alebo za behu vyžadovala transpiláciu, extrahujeme entries
 * jednoduchým, no reprodukovateľným parserom nad zdrojovým textom: každá
 * položka je jeden `{ id: "...", ... }` literál na jednom riadku (dodržané
 * generátorom databázy), takže regex nad riadkami je spoľahlivý aj bez AST.
 */
function extractArrayBlock(source, arrayName) {
  const startMarker = `${arrayName}: SoundClue[] = [`;
  const start = source.indexOf(startMarker);
  if (start === -1) return null;
  const bodyStart = start + startMarker.length;
  const end = source.indexOf("\n];", bodyStart);
  return source.slice(bodyStart, end === -1 ? undefined : end);
}

function parseEntries(block) {
  if (!block) return [];
  const entries = [];
  const lineRegex = /\{\s*id:\s*"((?:[^"\\]|\\.)*)"[^}]*?\}/gs;
  let match;
  while ((match = lineRegex.exec(block))) {
    const raw = match[0];
    const get = (field) => {
      const m = raw.match(new RegExp(`${field}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
      return m ? m[1].replace(/\\"/g, '"') : undefined;
    };
    const acceptedMatch = raw.match(/acceptedAnswers:\s*\[([^\]]*)\]/);
    const acceptedAnswers = acceptedMatch
      ? Array.from(acceptedMatch[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)).map((m) =>
          m[1].replace(/\\"/g, '"')
        )
      : undefined;
    entries.push({
      id: get("id"),
      label: get("label"),
      emoji: get("emoji"),
      category: get("category"),
      acceptedAnswers,
      audioUrl: get("audioUrl"),
      sourcePage: get("sourcePage"),
      credit: get("credit"),
      license: get("license"),
    });
  }
  return entries;
}

const coreBlock = extractArrayBlock(src, "const CORE_SOUND_CLUES");
const coreEntries = parseEntries(coreBlock);

// Každá nová dávka žije vo vlastnom `EXPANDED_SOUND_CLUES_<n>` bloku (dávka 1,
// dávka 2, ...). Namiesto pevného zoznamu čísel skenujeme zdroj a spracujeme
// všetky bloky, ktoré nájdeme — pri pridaní ďalšej dávky nie je treba meniť
// tento skript.
const expandedBlockNames = Array.from(
  src.matchAll(/const (EXPANDED_SOUND_CLUES_\d+): SoundClue\[\] = \[/g)
).map((m) => m[1]);
const expandedEntries = expandedBlockNames.flatMap((name) =>
  parseEntries(extractArrayBlock(src, `const ${name}`))
);

// COMMONS_SOUND_CLUES sú generované mapovaním COMMONS_SOUND_LIBRARY (pipe-
// delimited zoznam) v runtime kóde, nie ako literály `{ id: ... }` — spočítame
// ich samostatne podľa počtu neprázdnych riadkov s "|".
const libStart = src.indexOf("const COMMONS_SOUND_LIBRARY");
const libEnd = src.indexOf("`.trim()", libStart);
const libChunk = src.slice(libStart, libEnd);
const commonsLines = libChunk
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.includes("|"));
const commonsEntries = commonsLines.map((line) => {
  const [label, emoji, fileName] = line.split("|");
  return {
    id: `commons-${fileName.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase().slice(0, 48)}`,
    label,
    emoji,
    category: undefined,
    acceptedAnswers: undefined,
    audioUrl: `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}`,
    sourcePage: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName)}`,
    credit: "Wikimedia Commons",
    license: "Licencia je uvedená na zdrojovej stránke",
  };
});

const allEntries = [...coreEntries, ...commonsEntries, ...expandedEntries];

const errors = [];
const warnings = [];

const normalize = (text) =>
  (text ?? "")
    .toLocaleLowerCase("sk")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

// --- 1. Chýbajúce povinné polia ---
const REQUIRED_FIELDS = ["id", "label", "emoji", "audioUrl", "sourcePage", "credit", "license"];
for (const [i, e] of allEntries.entries()) {
  for (const field of REQUIRED_FIELDS) {
    if (!e[field]) errors.push(`Záznam #${i} (id=${e.id ?? "?"}): chýba pole "${field}".`);
  }
  if (e.license && !VALID_LICENSES.has(e.license)) {
    errors.push(`Záznam #${i} (id=${e.id}): neplatná/neznáma licencia "${e.license}".`);
  }
  if (e.audioUrl && !/^https:\/\//.test(e.audioUrl)) {
    errors.push(`Záznam #${i} (id=${e.id}): audioUrl nie je https URL: ${e.audioUrl}`);
  }
}

// --- 2. Unikátnosť ID ---
const idCounts = new Map();
for (const e of allEntries) idCounts.set(e.id, (idCounts.get(e.id) ?? 0) + 1);
for (const [id, count] of idCounts) {
  if (count > 1) errors.push(`Duplicitné ID "${id}" (${count}×).`);
}

// --- 3. Duplicitné labely (skutočný runtime dedup kľúč) ---
const labelCounts = new Map();
for (const e of allEntries) labelCounts.set(e.label, (labelCounts.get(e.label) ?? 0) + 1);
for (const [label, count] of labelCounts) {
  if (count > 1) errors.push(`Duplicitný label "${label}" (${count}×) — runtime loader by tieto položky zlúčil.`);
}

// --- 4. Normalizované duplicitné labely (rôzny text, rovnaký normalizovaný tvar) ---
const normalizedMap = new Map();
for (const e of allEntries) {
  const norm = normalize(e.label);
  if (!normalizedMap.has(norm)) normalizedMap.set(norm, []);
  normalizedMap.get(norm).push(e.id);
}
for (const [norm, ids] of normalizedMap) {
  if (ids.length > 1) {
    warnings.push(`Normalizovane duplicitné labely (${ids.join(", ")}) — znejú takmer identicky.`);
  }
}

// --- 5. Duplicitné audioUrl (rôzne otázky, ale rovnaký zvuk) ---
const urlCounts = new Map();
for (const e of allEntries) {
  if (!e.audioUrl) continue;
  urlCounts.set(e.audioUrl, (urlCounts.get(e.audioUrl) ?? 0) + 1);
}
for (const [url, count] of urlCounts) {
  if (count > 1) errors.push(`Duplicitné audioUrl "${url}" (${count}×).`);
}

// --- 6. Prázdne/chýbajúce kategórie (len pre záznamy, ktoré majú pole `category`) ---
const withCategory = allEntries.filter((e) => e.category !== undefined);
for (const e of withCategory) {
  if (!e.category || !e.category.trim()) {
    errors.push(`Záznam id=${e.id}: prázdna kategória.`);
  }
}

// --- 7. Distribúcia kategórií ---
const categoryCounts = {};
for (const e of withCategory) {
  categoryCounts[e.category] = (categoryCounts[e.category] ?? 0) + 1;
}

// --- 8. acceptedAnswers nesmú obsahovať prázdne položky alebo duplicitu so sebou samým ---
for (const e of allEntries) {
  if (!e.acceptedAnswers) continue;
  for (const a of e.acceptedAnswers) {
    if (!a || !a.trim()) errors.push(`Záznam id=${e.id}: prázdna položka v acceptedAnswers.`);
  }
  if (e.acceptedAnswers.some((a) => normalize(a) === normalize(e.label))) {
    warnings.push(`Záznam id=${e.id}: acceptedAnswers obsahuje formuláciu identickú s label — nadbytočné.`);
  }
}

const report = {
  totalEntries: allEntries.length,
  coreEntries: coreEntries.length,
  commonsEntries: commonsEntries.length,
  expandedBatches: expandedBlockNames,
  expandedEntries: expandedEntries.length,
  categoryCounts,
  categorizedEntries: withCategory.length,
  uncategorizedEntries: allEntries.length - withCategory.length,
  errors,
  warnings,
  status: errors.length ? "FAILED" : "PASSED",
};

console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
