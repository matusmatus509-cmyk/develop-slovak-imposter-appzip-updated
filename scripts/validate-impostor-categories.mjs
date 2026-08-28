import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CORE_FILE = path.join(ROOT, "client/src/data/categories.ts");
const THEMED_FILE = path.join(
  ROOT,
  "client/src/data/impostorThemedCategories.ts"
);
const EXPANDED_FILE = path.join(ROOT, "client/src/data/expandedContent.ts");
const EXPECTED_THEMED_IDS = [
  "minecraft",
  "brawlstars",
  "fortnite",
  "futbal",
  "marvel",
  "pokemon",
];

function fail(message) {
  throw new Error(`Imposter categories: ${message}`);
}

/** Nájde párovú zátvorku bez toho, aby ho zmiatli reťazce alebo komentáre. */
function matchingBracket(source, start, open, close) {
  let depth = 0;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === open) depth += 1;
    else if (char === close) {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  fail(`unclosed ${open} at character ${start}`);
}

function literalProperty(source, name, context) {
  const match = source.match(
    new RegExp(`\\b${name}\\s*:\\s*("(?:\\\\.|[^"\\\\])*")`)
  );
  if (!match) fail(`${context} must have a string ${name}.`);
  return JSON.parse(match[1]).trim();
}

function parseCategory(source, context) {
  const id = literalProperty(source, "id", context);
  const name = literalProperty(source, "name", context);
  const icon = literalProperty(source, "icon", context);
  const wordPairsMarker = source.indexOf("wordPairs");
  const arrayStart = source.indexOf("[", wordPairsMarker);
  if (wordPairsMarker < 0 || arrayStart < 0)
    fail(`${context} must have a literal wordPairs array.`);
  const arrayEnd = matchingBracket(source, arrayStart, "[", "]");
  const pairsSource = source.slice(arrayStart + 1, arrayEnd);
  const pairPattern =
    /\{\s*word:\s*("(?:\\.|[^"\\])*")\s*,\s*hint:\s*("(?:\\.|[^"\\])*")\s*\}/g;
  const wordPairs = [...pairsSource.matchAll(pairPattern)].map(match => ({
    word: JSON.parse(match[1]).trim(),
    hint: JSON.parse(match[2]).trim(),
  }));

  return { id, name, icon, wordPairs };
}

function coreCategories() {
  const source = fs.readFileSync(CORE_FILE, "utf8");
  const marker = source.indexOf("export const CATEGORIES");
  const assignment = source.indexOf("=", marker);
  const arrayStart = source.indexOf("[", assignment);
  if (marker < 0 || assignment < 0 || arrayStart < 0)
    fail("could not find the CATEGORIES array.");
  const arrayEnd = matchingBracket(source, arrayStart, "[", "]");
  const arraySource = source.slice(arrayStart + 1, arrayEnd);
  const categories = [];

  for (let index = 0; index < arraySource.length; index += 1) {
    if (arraySource[index] !== "{") continue;
    const objectEnd = matchingBracket(arraySource, index, "{", "}");
    categories.push(
      parseCategory(
        arraySource.slice(index, objectEnd + 1),
        `CATEGORIES[${categories.length}]`
      )
    );
    index = objectEnd;
  }
  return categories;
}

function themedCategories() {
  const source = fs.readFileSync(THEMED_FILE, "utf8");
  const declarations = new Map();
  const declaration = /const\s+(\w+)\s*:\s*CategoryDef\s*=\s*\{/g;
  for (const match of source.matchAll(declaration)) {
    const objectStart = match.index + match[0].lastIndexOf("{");
    const objectEnd = matchingBracket(source, objectStart, "{", "}");
    declarations.set(
      match[1],
      parseCategory(
        source.slice(objectStart, objectEnd + 1),
        `themed category ${match[1]}`
      )
    );
  }

  const exportMarker = source.indexOf(
    "export const THEMED_IMPOSTOR_CATEGORIES"
  );
  const assignment = source.indexOf("=", exportMarker);
  const arrayStart = source.indexOf("[", assignment);
  if (exportMarker < 0 || assignment < 0 || arrayStart < 0)
    fail("could not find THEMED_IMPOSTOR_CATEGORIES registration.");
  const arrayEnd = matchingBracket(source, arrayStart, "[", "]");
  const registeredNames =
    source.slice(arrayStart + 1, arrayEnd).match(/\b[A-Z][A-Z0-9_]*\b/g) ?? [];

  return registeredNames.map(name => {
    const category = declarations.get(name);
    if (!category) fail(`registered themed category ${name} is not declared.`);
    return category;
  });
}

const core = coreCategories();
const themed = themedCategories();
const categories = [...core, ...themed];
const errors = [];

const ids = categories.map(category => category.id);
for (const id of new Set(ids)) {
  if (ids.filter(candidate => candidate === id).length > 1)
    errors.push(`duplicate category id: ${id}`);
}

if (ids.includes("situacie"))
  errors.push("the removed generated category `situacie` is still registered");

if (
  EXPECTED_THEMED_IDS.length !== themed.length ||
  EXPECTED_THEMED_IDS.some(id => !themed.some(category => category.id === id))
) {
  errors.push(
    `expected themed ids ${EXPECTED_THEMED_IDS.join(", ")}; got ${themed
      .map(category => category.id)
      .join(", ")}`
  );
}

for (const category of categories) {
  if (category.wordPairs.length !== 50)
    errors.push(
      `${category.id} has ${category.wordPairs.length} pairs, expected 50`
    );
  if (!category.name || !category.icon)
    errors.push(`${category.id} has an empty name or icon`);

  const normalizedWords = category.wordPairs.map(pair =>
    pair.word.toLocaleLowerCase("sk")
  );
  for (const word of new Set(normalizedWords)) {
    if (normalizedWords.filter(candidate => candidate === word).length > 1)
      errors.push(`${category.id} contains duplicate word: ${word}`);
  }

  category.wordPairs.forEach((pair, index) => {
    if (pair.word.length < 2 || pair.word.length > 50)
      errors.push(`${category.id}[${index}] has an implausible word length`);
    if (pair.hint.length < 2 || pair.hint.length > 50)
      errors.push(`${category.id}[${index}] has an implausible hint length`);
    if (pair.word.toLocaleLowerCase("sk") === pair.hint.toLocaleLowerCase("sk"))
      errors.push(`${category.id}[${index}] reveals the word as its hint`);
  });
}

const themedWordOwners = new Map();
for (const category of themed) {
  for (const pair of category.wordPairs) {
    const normalizedWord = pair.word.toLocaleLowerCase("sk");
    const previousCategory = themedWordOwners.get(normalizedWord);
    if (previousCategory)
      errors.push(
        `themed word ${pair.word} appears in both ${previousCategory} and ${category.id}`
      );
    else themedWordOwners.set(normalizedWord, category.id);
  }
}

const categoriesSource = fs.readFileSync(CORE_FILE, "utf8");
const expandedSource = fs.readFileSync(EXPANDED_FILE, "utf8");
for (const removedSymbol of [
  "GENERATED_IMPOSTOR_PAIRS",
  "IMPOSTOR_ENTRIES",
  "IMPOSTOR_FORMS",
  "IMPOSTOR_CARD_ENTRIES",
]) {
  if (expandedSource.includes(removedSymbol))
    errors.push(`removed generator symbol remains: ${removedSymbol}`);
}
if (categoriesSource.includes("GENERATED_IMPOSTOR_PAIRS"))
  errors.push("categories.ts still imports the generated Impostor bank");
if (
  !categoriesSource.includes("CATEGORIES.push(...THEMED_IMPOSTOR_CATEGORIES)")
)
  errors.push("categories.ts does not register the themed category export");

if (errors.length > 0) {
  console.error(errors.map(error => `✗ ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  const totalPairs = categories.reduce(
    (sum, category) => sum + category.wordPairs.length,
    0
  );
  console.log(
    `✓ Imposter: ${core.length} core + ${themed.length} themed categories, ${totalPairs} curated pairs`
  );
  for (const category of themed)
    console.log(
      `  ✓ ${category.icon} ${category.name}: ${category.wordPairs.length}`
    );
  console.log(
    "✓ Template-generated `situacie` bank is not registered or generated"
  );
}
