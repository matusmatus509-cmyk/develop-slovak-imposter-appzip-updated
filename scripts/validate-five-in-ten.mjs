import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const dataPath = path.resolve("src/data/teamBattleExtras.ts");
const source = fs.readFileSync(dataPath, "utf8");

function extractPrompts() {
  const coreSource = source.match(/const CORE_FIVE_IN_TEN_PROMPTS = \[([\s\S]*?)\];/)?.[1] ?? "";
  const core = [...coreSource.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"/g)].map((match) => match[1]);
  const library = (source.match(/const EXTRA_FIVE_IN_TEN_LIBRARY = `([\s\S]*?)`\.trim\(\)\.split/)?.[1] ?? "")
    .trim()
    .split("\n")
    .filter(Boolean);
  return [...new Set([...core, ...library])];
}

const dictionaries = Object.fromEntries(
  ["en", "de", "es", "fr", "pt"].map((language) => [
    language,
    JSON.parse(fs.readFileSync(path.resolve(`src/i18n/translations.${language}.json`), "utf8")),
  ]),
);

function translatedPrompt(prompt, language) {
  const dictionary = dictionaries[language];
  if (dictionary[prompt]) return dictionary[prompt];
  return Object.entries(dictionary)
    .filter(([sourceText, target]) => sourceText !== target && sourceText.length >= 2)
    .sort(([left], [right]) => right.length - left.length)
    .reduce((text, [sourceText, target]) => text.split(sourceText).join(target), prompt);
}

const prompts = extractPrompts();
const languages = ["en", "de", "es", "fr", "pt"];
const forbidden = [
  /\bTODO\b/, /\bTBD\b/, /\bExample\b/, /\bTest\b/, /\bUnknown\b/,
  /spojených s témou/i, /typických pre tému/i, /miest, ľudí alebo postáv spojených/i,
  /ktoré si pamätáš/i, /na ktoré si spomenieš/i, /ktoré poznáš/i, /ktoré ti napadnú/i,
  /ktoré dokážeš vymenovať/i, /o ktorých vieš/i,
];
const slovakResidue = /\b(vecí|zvierat|ktoré|slovenských|druhov|športov|povolaní|jedál|miest|potrebuješ|môžeš|nájdeš|začínajúcich)\b/i;

assert(prompts.length >= 500, `Expected at least 500 curated prompts, found ${prompts.length}`);
assert(!source.includes("GENERATED_FIVE_IN_TEN_PROMPTS"), "Generated topic templates must not be part of the Five in Ten library");

const seen = new Set();
let letterPromptCount = 0;
for (const prompt of prompts) {
  assert(prompt.trim(), "Prompt must not be empty");
  const normalized = prompt.trim().toLocaleLowerCase("sk");
  assert(!seen.has(normalized), `Duplicate prompt: ${prompt}`);
  seen.add(normalized);
  for (const pattern of forbidden) assert(!pattern.test(prompt), `Forbidden template or placeholder: ${prompt}`);
  if (/\bpísmeno\b|začínajúcich na/i.test(prompt)) letterPromptCount += 1;

  for (const language of languages) {
    const localized = translatedPrompt(prompt, language);
    assert(localized.trim(), `Missing ${language} localization: ${prompt}`);
    assert(localized !== prompt, `Untranslated ${language} localization: ${prompt}`);
    assert(!slovakResidue.test(localized), `Likely Slovak residue in ${language}: ${localized}`);
    for (const pattern of forbidden.slice(0, 5)) assert(!pattern.test(localized), `Placeholder in ${language}: ${localized}`);
  }
}

assert(letterPromptCount <= Math.floor(prompts.length * 0.1), `Too many letter prompts: ${letterPromptCount}`);
console.log(`✅ 5 za 10: ${prompts.length} curated prompts validated in Slovak and all five localized outputs.`);
console.log(`✅ Letter prompts: ${letterPromptCount} (${((letterPromptCount / prompts.length) * 100).toFixed(1)}%).`);
