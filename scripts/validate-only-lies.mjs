import assert from "assert";
import cards from "../src/data/onlyLies.json" with { type: "json" };

const languages = ["sk", "en", "de", "es", "fr", "pt"];
const allowedCategories = new Set([
  "animals", "food", "colors", "numbers", "body", "household", "school",
  "nature", "weather", "time", "calendar", "transport", "geography", "sports",
  "objects", "clothing", "technology", "everyday_life", "language", "simple_science"
]);

console.log(`Starting validation of ${cards.length} Only Lies questions...`);

// 1. Expected count of items: should be between 450 and 550
assert(cards.length >= 450 && cards.length <= 550, `Expected between 450 and 550 questions, found ${cards.length}`);

const ids = new Set();
const textsByLanguage = {
  sk: new Set(),
  en: new Set(),
  de: new Set(),
  es: new Set(),
  fr: new Set(),
  pt: new Set()
};

for (const card of cards) {
  // 2. No fields difficulty, level, intensity
  assert(!("difficulty" in card), `Card ${card.id} contains forbidden 'difficulty' field`);
  assert(!("level" in card), `Card ${card.id} contains forbidden 'level' field`);
  assert(!("intensity" in card), `Card ${card.id} contains forbidden 'intensity' field`);

  // 3. No duplicate IDs
  assert(card.id, "Card has empty or missing ID");
  assert(!ids.has(card.id), `Duplicate ID found: ${card.id}`);
  ids.add(card.id);

  // 4. Valid category
  assert(card.category, `Card ${card.id} has missing category`);
  assert(allowedCategories.has(card.category), `Card ${card.id} has invalid category: ${card.category}`);

  // 5. Check translations
  assert(card.translations, `Card ${card.id} has missing translations`);
  for (const lang of languages) {
    const text = card.translations[lang];
    assert(text, `Card ${card.id} is missing translation for ${lang}`);
    assert(text.trim().length > 0, `Card ${card.id} has empty translation for ${lang}`);

    const lowerText = text.toLowerCase().trim();

    // 6. No Yes/No questions (case-insensitive check for yes/no question starters by language)
    const yesNoStartersByLang = {
      sk: ["je ", "sú "],
      en: ["is ", "are ", "does ", "do ", "can ", "has ", "have "],
      de: ["ist ", "sind ", "kann ", "hat ", "haben "],
      es: ["¿es ", "¿son ", "¿tiene ", "¿hay "],
      fr: ["est-ce ", "y a-t-il "],
      pt: ["é ", "são ", "tem ", "há "]
    };
    const starters = yesNoStartersByLang[lang] || [];
    for (const starter of starters) {
      assert(!lowerText.startsWith(starter), `Card ${card.id} in ${lang} starts with forbidden yes/no starter "${starter}": "${text}"`);
    }

    // Check for placeholders, tests, or invalid keywords
    const forbiddenPatterns = [/\bTODO\b/, /\bTBD\b/, /\bExample\b/i, /\bTest\b/i, /\bUnknown\b/i];
    for (const pattern of forbiddenPatterns) {
      assert(!pattern.test(text), `Card ${card.id} in ${lang} matches forbidden pattern ${pattern}: "${text}"`);
    }

    // Check for corrupted characters or encoding issues
    assert(!text.includes("\uFFFD"), `Card ${card.id} in ${lang} contains corrupted unicode character: "${text}"`);
    if (lang === "sk") {
      assert(!text.includes("'") || text.includes("’"), `Slovak translation in Card ${card.id} contains potentially broken apostrophe: "${text}"`);
    }

    // Check for correct question punctuation (must end with question mark in all languages, and start with ¿ in Spanish)
    if (lang === "es") {
      assert(text.startsWith("¿"), `Spanish translation in Card ${card.id} must start with '¿': "${text}"`);
    }
    assert(text.endsWith("?"), `Translation in Card ${card.id} for ${lang} must end with '?': "${text}"`);

    // Check French spacing before question mark (standard is e.g. " ?")
    if (lang === "fr") {
      assert(text.endsWith(" ?"), `French translation in Card ${card.id} must have a space before the question mark: "${text}"`);
    }

    // Check for exact duplicate questions in the same language
    assert(!textsByLanguage[lang].has(lowerText), `Duplicate question found in ${lang}: "${text}"`);
    textsByLanguage[lang].add(lowerText);
  }
}

console.log(`\n✅ Iba nepravda: ${cards.length} questions validated successfully across all 6 languages!`);
