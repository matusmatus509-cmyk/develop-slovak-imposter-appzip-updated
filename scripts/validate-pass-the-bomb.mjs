import fs from 'fs';

let cards = [];
try {
  cards = JSON.parse(fs.readFileSync("./src/data/passTheBomb.json", "utf8"));
} catch(e) {
  console.error("Could not load passTheBomb.json");
  process.exit(1);
}

const languages = ["sk", "en", "de", "es", "fr", "pt"];
const difficulties = new Set(["easy", "normal", "hard"]);
const validCategories = new Set([
  "food", "animals", "places", "countries", "cities", "objects", 
  "household", "school", "work", "travel", "sports", "music", 
  "movies", "nature", "technology", "clothing", "transport", 
  "activities", "colors", "letters", "words", "daily_life", 
  "holidays", "professions", "body", "weather", "imagination"
]);

function assert(ok, message) { if (!ok) throw new Error(message); }

assert(cards.length === 1500, `Expected 1500 cards, got ${cards.length}.`);

let easyCount = 0;
let normalCount = 0;
let hardCount = 0;
let letterCount = 0;
const ids = new Set();
const seenTasks = new Map();

const placeholders = [/\bTODO\b/, /\bTBD\b/, /\bExample\b/, /\bUnknown\b/, /\bTest\b/];

for (const card of cards) {
  assert(/^(bomb)_\d{4}$/.test(card.id) && !ids.has(card.id), `Invalid or duplicate ID ${card.id}.`); 
  ids.add(card.id);
  assert(difficulties.has(card.difficulty), `${card.id}: invalid difficulty ${card.difficulty}.`);
  assert(validCategories.has(card.category), `${card.id}: invalid category ${card.category}.`);
  
  if (card.difficulty === 'easy') easyCount++;
  if (card.difficulty === 'normal') normalCount++;
  if (card.difficulty === 'hard') hardCount++;
  if (card.category === 'letters') letterCount++;
  
  for (const language of languages) {
    const text = card.translations?.[language];
    assert(typeof text === "string" && text.trim().length > 3, `${card.id}/${language}: missing or short translation.`);
    
    placeholders.forEach(p => {
        assert(!p.test(text), `Placeholder found in ${card.id}/${language}: ${p}`);
    });
    assert(!/kto by/i.test(text), `Forbidden "Kto by..." pattern in ${card.id}/${language}`);
    assert(!/who would/i.test(text), `Forbidden "Who would..." pattern in ${card.id}/${language}`);
    assert(!/wer würde/i.test(text), `Forbidden "Wer würde..." pattern in ${card.id}/${language}`);
    assert(!/quién/i.test(text) || !/quien/i.test(text), `Forbidden "Quién..." pattern in ${card.id}/${language}`);
    assert(!/qui /i.test(text), `Forbidden "Qui..." pattern in ${card.id}/${language}`);
    assert(!/quem /i.test(text), `Forbidden "Quem..." pattern in ${card.id}/${language}`);

    // Forbidden template mashups (e.g. Hovor veci v spálni, ktoré nájdeš vonku)
    if (language === 'sk') {
        const hasPlace = /v [a-zá-ž]+|na [a-zá-ž]+/i.test(text);
        const hasRelative = /, ktoré/i.test(text);
        
        // Let's explicitly check the bad patterns required by user
        assert(!/ktoré si pamätáš/i.test(text), `Forbidden suffix in ${card.id}`);
        assert(!/ktoré poznáš/i.test(text), `Forbidden suffix in ${card.id}`);
        assert(!/na ktoré si spomenieš/i.test(text), `Forbidden suffix in ${card.id}`);
        assert(!/ktoré ti napadnú/i.test(text), `Forbidden suffix in ${card.id}`);
        
        // If it has a place AND a relative clause, it's highly suspicious and should be fixed.
        // We will ban patterns like "Hovor jedlá, ktoré nájdeš v aute"
        assert(!/jedlá, ktoré nájdeš v/i.test(text), `Illogical mashup in ${card.id}: ${text}`);
        assert(!/zvieratá, ktoré nosíš/i.test(text), `Illogical mashup in ${card.id}: ${text}`);
        assert(!/športy, ktoré máš v/i.test(text), `Illogical mashup in ${card.id}: ${text}`);
        assert(!/veci v [a-zá-ž]+, ktoré nájdeš vonku/i.test(text), `Illogical mashup in ${card.id}: ${text}`);
        assert(!/v [a-zá-ž]+, ktoré rastú/i.test(text), `Illogical mashup in ${card.id}: ${text}`);
        assert(!/v [a-zá-ž]+, ktoré používaš v [a-zá-ž]+/i.test(text), `Illogical mashup in ${card.id}: ${text}`);
    }

    const normalized = text.toLowerCase().trim();
    const key = language + '|' + normalized;
    if (seenTasks.has(key)) {
        assert(false, `Duplicate task text in ${language}: "${text}" in ${card.id} (already seen in ${seenTasks.get(key)})`);
    }
    seenTasks.set(key, card.id);
  }
}

assert(easyCount === 600, `Expected 600 easy cards, got ${easyCount}.`);
assert(normalCount === 600, `Expected 600 normal cards, got ${normalCount}.`);
assert(hardCount === 300, `Expected 300 hard cards, got ${hardCount}.`);
assert(letterCount <= 225, `Expected max 225 letter cards (15%), got ${letterCount}.`);

console.log("Kto dostane bombu: 1500 kariet validovaných (6 jazykov).");
