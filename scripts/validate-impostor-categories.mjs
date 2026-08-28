import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CORE_FILE = path.join(ROOT, "client/src/data/categories.ts");
const CORE_EXPANSION_MODULES = [
  {
    file: "impostorCoreExpansionEveryday",
    symbol: "EVERYDAY_IMPOSTOR_EXPANSIONS",
  },
  { file: "impostorCoreExpansionLife", symbol: "LIFE_IMPOSTOR_EXPANSIONS" },
  {
    file: "impostorCoreExpansionActivities",
    symbol: "ACTIVITIES_IMPOSTOR_EXPANSIONS",
  },
  { file: "impostorCoreExpansionHuman", symbol: "HUMAN_IMPOSTOR_EXPANSIONS" },
  { file: "impostorCoreExpansionWorld", symbol: "WORLD_IMPOSTOR_EXPANSIONS" },
];
const CORE_EXPANSION_FILES = CORE_EXPANSION_MODULES.map(({ file }) =>
  path.join(ROOT, "client/src/data", `${file}.ts`)
);
const CORE_EXPANSIONS_FILE = path.join(
  ROOT,
  "client/src/data/impostorCoreExpansions.ts"
);
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
const EXPECTED_CORE_COUNTS = new Map([
  ["skola", 100],
  ["domacnost", 250],
  ["jedlo", 100],
  ["zvierata", 100],
  ["priroda", 100],
  ["sport", 100],
  ["technologie", 100],
  ["doprava", 100],
  ["povolania", 100],
  ["telo", 100],
  ["filmy", 100],
  ["hudba", 100],
  ["oblecenie", 100],
  ["mesta", 100],
  ["veci", 100],
  ["abstraktne", 100],
  ["veda", 100],
  ["historia", 100],
  ["internet", 100],
  ["nahodne", 250],
]);
const EXPECTED_TOTAL_PAIRS = 2600;

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

function parseWordPairs(source, context) {
  const wordPairsMarker = source.indexOf("wordPairs");
  const arrayStart = source.indexOf("[", wordPairsMarker);
  if (wordPairsMarker < 0 || arrayStart < 0)
    fail(`${context} must have a literal wordPairs array.`);
  const arrayEnd = matchingBracket(source, arrayStart, "[", "]");
  const pairsSource = source.slice(arrayStart + 1, arrayEnd);
  const pairPattern =
    /\{\s*word:\s*("(?:\\.|[^"\\])*")\s*,\s*hint:\s*("(?:\\.|[^"\\])*")\s*,?\s*\}/g;
  return [...pairsSource.matchAll(pairPattern)].map(match => ({
    word: JSON.parse(match[1]).trim(),
    hint: JSON.parse(match[2]).trim(),
  }));
}

function parseCategory(source, context) {
  const id = literalProperty(source, "id", context);
  const name = literalProperty(source, "name", context);
  const icon = literalProperty(source, "icon", context);
  const wordPairs = parseWordPairs(source, context);

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

function coreExpansions() {
  const expansions = [];
  for (const file of CORE_EXPANSION_FILES) {
    const source = fs.readFileSync(file, "utf8");
    const marker = source.indexOf("export const");
    const assignment = source.indexOf("=", marker);
    const arrayStart = source.indexOf("[", assignment);
    if (marker < 0 || assignment < 0 || arrayStart < 0)
      fail(`could not find expansion array in ${path.basename(file)}.`);
    const arrayEnd = matchingBracket(source, arrayStart, "[", "]");
    const arraySource = source.slice(arrayStart + 1, arrayEnd);

    for (let index = 0; index < arraySource.length; index += 1) {
      if (arraySource[index] !== "{") continue;
      const objectEnd = matchingBracket(arraySource, index, "{", "}");
      const objectSource = arraySource.slice(index, objectEnd + 1);
      const context = `${path.basename(file)} expansion ${expansions.length + 1}`;
      expansions.push({
        categoryId: literalProperty(objectSource, "categoryId", context),
        wordPairs: parseWordPairs(objectSource, context),
        file: path.basename(file),
      });
      index = objectEnd;
    }
  }
  return expansions;
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
const expansions = coreExpansions();
const themed = themedCategories();
const errors = [];

const coreIds = core.map(category => category.id);
const unexpectedCoreIds = coreIds.filter(id => !EXPECTED_CORE_COUNTS.has(id));
if (
  coreIds.length !== EXPECTED_CORE_COUNTS.size ||
  unexpectedCoreIds.length > 0
) {
  errors.push(
    `core category IDs must exactly match expected set; got ${coreIds.join(", ")}`
  );
}

const expansionIds = expansions.map(expansion => expansion.categoryId);
for (const expansion of expansions) {
  const category = core.find(
    candidate => candidate.id === expansion.categoryId
  );
  if (!category) {
    errors.push(
      `${expansion.file} expands unknown core category ${expansion.categoryId}`
    );
    continue;
  }
  if (
    expansionIds.filter(candidate => candidate === expansion.categoryId)
      .length > 1
  )
    errors.push(`duplicate core expansion for ${expansion.categoryId}`);
  category.wordPairs.push(...expansion.wordPairs);
}
for (const id of EXPECTED_CORE_COUNTS.keys()) {
  if (!expansionIds.includes(id))
    errors.push(`missing core expansion for ${id}`);
}

const categories = [...core, ...themed];

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
  const expectedCount = EXPECTED_CORE_COUNTS.get(category.id) ?? 50;
  if (category.wordPairs.length !== expectedCount)
    errors.push(
      `${category.id} has ${category.wordPairs.length} pairs, expected ${expectedCount}`
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

for (const expansion of expansions) {
  const hintCounts = new Map();
  for (const pair of expansion.wordPairs) {
    const hintWordCount = pair.hint.trim().split(/\s+/).length;
    if (hintWordCount < 1 || hintWordCount > 2)
      errors.push(
        `${expansion.categoryId}/${pair.word} expansion hint must have 1-2 words`
      );
    const normalizedHint = pair.hint.toLocaleLowerCase("sk");
    hintCounts.set(normalizedHint, (hintCounts.get(normalizedHint) ?? 0) + 1);
  }
  for (const [hint, count] of hintCounts) {
    if (count > 2)
      errors.push(
        `${expansion.categoryId} expansion reuses hint ${hint} ${count} times; expected at most 2`
      );
  }
}

const themedWordOwners = new Map();
const themedHintOwners = new Map();
for (const category of themed) {
  for (const pair of category.wordPairs) {
    const normalizedHint = pair.hint.trim().toLocaleLowerCase("sk");
    const hintOwners = themedHintOwners.get(normalizedHint) ?? [];
    hintOwners.push(`${category.id}/${pair.word}`);
    themedHintOwners.set(normalizedHint, hintOwners);
    if (hintOwners.length > 2)
      errors.push(
        `themed hint ${pair.hint} is reused more than twice: ${hintOwners.join(", ")}`
      );

    const hintWordCount = pair.hint.trim().split(/\s+/).length;
    if (hintWordCount < 1 || hintWordCount > 2)
      errors.push(`${category.id}/${pair.word} hint must have 1-2 words`);

    const normalizedWord = pair.word.toLocaleLowerCase("sk");
    const previousCategory = themedWordOwners.get(normalizedWord);
    if (previousCategory)
      errors.push(
        `themed word ${pair.word} appears in both ${previousCategory} and ${category.id}`
      );
    else themedWordOwners.set(normalizedWord, category.id);
  }
}

const coreExpansionsSource = fs.readFileSync(CORE_EXPANSIONS_FILE, "utf8");
const expectedExpansionSymbols = CORE_EXPANSION_MODULES.map(
  ({ symbol }) => symbol
);
const registeredExpansionSymbols = [
  ...coreExpansionsSource.matchAll(/\.\.\.([A-Z][A-Z0-9_]*)/g),
].map(match => match[1]);
if (
  JSON.stringify(registeredExpansionSymbols) !==
  JSON.stringify(expectedExpansionSymbols)
) {
  errors.push(
    `impostorCoreExpansions.ts must register exactly ${expectedExpansionSymbols.join(", ")}`
  );
}
for (const { file, symbol } of CORE_EXPANSION_MODULES) {
  if (!coreExpansionsSource.includes(`import { ${symbol} } from "./${file}"`)) {
    errors.push(`impostorCoreExpansions.ts must import ${symbol} from ${file}`);
  }
}

const categoriesSource = fs.readFileSync(CORE_FILE, "utf8");
const coreExpansionImportIndex = categoriesSource.indexOf(
  'import { CORE_IMPOSTOR_EXPANSIONS } from "./impostorCoreExpansions"'
);
const coreExpansionLoopIndex = categoriesSource.indexOf(
  "for (const expansion of CORE_IMPOSTOR_EXPANSIONS)"
);
const coreExpansionPushIndex = categoriesSource.indexOf(
  "category.wordPairs.push(...expansion.wordPairs)"
);
const coreCategoryIdsIndex = categoriesSource.indexOf(
  "export const CORE_IMPOSTOR_CATEGORY_IDS"
);

if (!(
  coreExpansionImportIndex >= 0 &&
  coreExpansionImportIndex < coreExpansionLoopIndex &&
  coreExpansionLoopIndex < coreExpansionPushIndex &&
  coreExpansionPushIndex < coreCategoryIdsIndex
)) {
  errors.push(
    "categories.ts must import and apply CORE_IMPOSTOR_EXPANSIONS before snapshotting CORE_IMPOSTOR_CATEGORY_IDS"
  );
}

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

const totalPairs = categories.reduce(
  (sum, category) => sum + category.wordPairs.length,
  0
);
if (totalPairs !== EXPECTED_TOTAL_PAIRS)
  errors.push(
    `all categories contain ${totalPairs} pairs, expected ${EXPECTED_TOTAL_PAIRS}`
  );

if (errors.length > 0) {
  console.error(errors.map(error => `✗ ${error}`).join("\n"));
  process.exitCode = 1;
} else {
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
