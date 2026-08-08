import assert from "assert";
import fs from "fs";
import path from "path";

const dbPath = path.resolve("src/data/fiveInTen.json");
if (!fs.existsSync(dbPath)) {
  console.error("Database file not found:", dbPath);
  process.exit(1);
}

const cards = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const languages = ["sk", "en", "de", "es", "fr", "pt"];

console.log(`Starting validation of ${cards.length} Five in Ten prompts...`);

assert(cards.length === 1000, `Expected exactly 1000 items, found ${cards.length}`);

const ids = new Set();
const textsByLanguage = {
  sk: new Set(),
  en: new Set(),
  de: new Set(),
  es: new Set(),
  fr: new Set(),
  pt: new Set(),
};

let letterPromptCount = 0;

for (const card of cards) {
  assert(card.id, "Missing ID");
  assert(card.id.startsWith("five_in_ten_"), `Invalid ID format: ${card.id}`);
  assert(!ids.has(card.id), `Duplicate ID found: ${card.id}`);
  ids.add(card.id);

  assert(!("difficulty" in card), `Card ${card.id} has forbidden field 'difficulty'`);
  assert(!("level" in card), `Card ${card.id} has forbidden field 'level'`);
  assert(!("intensity" in card), `Card ${card.id} has forbidden field 'intensity'`);

  assert(card.translations, `Card ${card.id} is missing translations`);

  let isLetterPrompt = false;

  for (const lang of languages) {
    const text = card.translations[lang];
    assert(text, `Card ${card.id} is missing translation for ${lang}`);
    assert(text.trim().length > 0, `Card ${card.id} has empty translation for ${lang}`);

    const lowerText = text.toLowerCase().trim();

    // Check for placeholders or invalid keywords
    const forbiddenPatterns = [/\btodo\b/i, /\btbd\b/i, /\bexample\b/i, /\btest\b/i, /\bunknown\b/i];
    for (const pattern of forbiddenPatterns) {
      assert(!pattern.test(text), `Card ${card.id} contains forbidden word in ${lang}: ${text}`);
    }

    // Check for bad phrases ("ktoré si pamätáš", etc.)
    const badPhrasesSk = ["ktoré si pamätáš", "na ktoré si spomenieš", "ktoré poznáš", "ktoré ti napadnú", "ktoré dokážeš vymenovať", "o ktorých vieš", "hovor 5", "povedz päť kusov", "daj 5 príkladov", "vymenujte 5", "zaujímavé", "zaujímavých", "dobré", "dobrých", "pekné", "pekných", "náhodné", "náhodných"];
    if (lang === "sk") {
      assert(lowerText.startsWith("vymenuj 5 "), `Card ${card.id} must start with 'Vymenuj 5 ' in SK. Found: ${text}`);
      for (const bad of badPhrasesSk) {
        assert(!lowerText.includes(bad), `Card ${card.id} contains forbidden phrase '${bad}' in SK: ${text}`);
      }
      if (lowerText.includes("na písmeno") || lowerText.includes("začínajúcich na")) {
        isLetterPrompt = true;
      }
    }

    if (lang === "en") {
      const badPhrasesEn = ["you remember", "you know", "you can think of", "say five pieces", "tell 5 items"];
      for (const bad of badPhrasesEn) {
        assert(!lowerText.includes(bad), `Card ${card.id} contains forbidden phrase '${bad}' in EN: ${text}`);
      }
    }

    // Question marks and yes/no
    assert(!text.includes("?"), `Card ${card.id} contains a question mark, but it should be a prompt. Found in ${lang}: ${text}`);

    // Check for exact duplicate prompts in the same language
    assert(!textsByLanguage[lang].has(lowerText), `Duplicate prompt found in ${lang}: "${text}" (ID: ${card.id})`);
    textsByLanguage[lang].add(lowerText);
  }

  if (isLetterPrompt) {
    letterPromptCount++;
  }
}

const maxLetterPrompts = 100; // max 10%
assert(letterPromptCount <= maxLetterPrompts, `Too many letter prompts: found ${letterPromptCount}, maximum is ${maxLetterPrompts}`);

console.log(`\n✅ 5 za 10: ${cards.length} prompts validated successfully across all 6 languages!`);
console.log(`Letter prompts: ${letterPromptCount} (Max allowed: ${maxLetterPrompts})`);
