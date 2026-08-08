import { readFileSync } from "node:fs";
import ts from "typescript";

const languages = ["sk", "en", "de", "es", "fr", "pt"];
const requiredIds = ["all", "professions", "food", "objects", "places-landmarks", "mythical-creatures"];
const sourcePath = new URL("../src/data/characters.ts", import.meta.url);

// Evaluate the data module with only the two unrelated imports mocked. This keeps
// validation close to the actual exported deck used by the game.
const source = readFileSync(sourcePath, "utf8")
  .replace(/^import type .*?;\r?\n/m, "")
  .replace(/^import \{ LOCAL_PERSONALITY_CATEGORIES \}.*?;\r?\n/m, `const LOCAL_PERSONALITY_CATEGORIES = Object.fromEntries(["sk", "en", "de", "es", "fr", "pt"].map((language) => [language, { id: \`local-personalities-\${language}\`, name: language, icon: "", characters: [\`Local \${language}\`] }]));\n`)
  .replace(/^import \{ GENERATED_CHARACTER_CARDS \}.*?;\r?\n/m, "const GENERATED_CHARACTER_CARDS = [\"Archetyp\"];\n");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const module = { exports: {} };
new Function("exports", "module", compiled)(module.exports, module);
const { getCharacterCategories } = module.exports;

let failures = 0;
const totals = new Map();
function check(condition, message) {
  if (!condition) {
    failures += 1;
    console.error(`✗ ${message}`);
  }
}

for (const language of languages) {
  const categories = getCharacterCategories(language);
  const ids = categories.map((category) => category.id);
  check(new Set(ids).size === ids.length, `${language}: duplicate category id`);
  requiredIds.forEach((id) => check(ids.includes(id), `${language}: missing ${id}`));
  const all = categories.find((category) => category.id === "all");
  check(all?.characters.length === 0, `${language}: all must stay a virtual filter without cards`);
  totals.set(language, new Set(
    categories
      .filter((category) => category.id !== "all")
      .flatMap((category) => category.characters.map((card) => card.trim().toLocaleLowerCase(language))),
  ).size);

  for (const category of categories) {
    check(Boolean(category.name?.trim()), `${language}/${category.id}: empty label`);
    if (category.id === "all") continue;
    check(category.characters.length > 0, `${language}/${category.id}: empty category`);
    const normalized = category.characters.map((card) => card.trim().toLocaleLowerCase(language));
    check(normalized.every(Boolean), `${language}/${category.id}: blank card`);
    check(new Set(normalized).size === normalized.length, `${language}/${category.id}: duplicate card inside category`);
    check(!category.characters.some((card) => /\b(todo|tbd|example|test|unknown)\b/i.test(card)), `${language}/${category.id}: placeholder card`);
  }
}

if (failures) process.exit(1);
console.log(`✓ Guess Who categories: 6 languages, virtual all filter, complete localized additions (${[...totals.entries()].map(([language, total]) => `${language}: ${total}`).join(", ")})`);
