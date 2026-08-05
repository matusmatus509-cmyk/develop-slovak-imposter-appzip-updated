import cards from "../src/data/wouldYouRather.json" with { type: "json" };
const languages = ["sk", "en", "de", "es", "fr", "pt"];
const wyrCategories = new Set(["everyday", "funny", "food", "travel", "technology", "fantasy", "superpowers", "future", "friends", "family", "relationships", "school", "work", "money", "animals", "movies", "gaming", "sports", "hobbies", "music", "lifestyle", "difficult_choices", "imagination", "nature"]);
const difficulties = new Set(["easy", "normal", "difficult"]);

function assert(ok, message) { if (!ok) throw new Error(message); }

assert(cards.length === 1500, `Expected 1500 cards, got ${cards.length}.`);

const ids = new Set();
for (const card of cards) {
  assert(/^(wyr)_\d{4}$/.test(card.id) && !ids.has(card.id), `Invalid or duplicate ID ${card.id}.`); 
  ids.add(card.id);
  assert(difficulties.has(card.difficulty), `${card.id}: invalid difficulty.`);
  assert(wyrCategories.has(card.category), `${card.id}: invalid category.`);
  
  for (const language of languages) {
    const textA = card.optionA?.[language];
    const textB = card.optionB?.[language];
    assert(typeof textA === "string" && textA.trim().length > 3, `${card.id}/${language}: missing or short translation for option A.`);
    assert(typeof textB === "string" && textB.trim().length > 3, `${card.id}/${language}: missing or short translation for option B.`);
    assert(textA.toLowerCase() !== textB.toLowerCase(), `${card.id}/${language}: Option A and Option B are identical.`);
  }
}

// Basic duplicates check
for (const language of languages) {
  const values = cards.map((card) => card.optionA[language].toLowerCase() + "|" + card.optionB[language].toLowerCase());
  const uniqueValues = new Set(values);
  assert(uniqueValues.size === values.length, `Duplicate text pairs found in ${language}.`);
}

console.log("Radšej by som: 1500 kariet validovaných (6 jazykov).");
