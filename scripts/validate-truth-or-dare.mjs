import cards from "../src/data/truthOrDare.json" with { type: "json" };
const languages = ["sk", "en", "de", "es", "fr", "pt"];
const truthCategories = new Set(["school", "work", "friends", "family", "travel"]);
const dareCategories = new Set(["acting", "pantomime", "singing", "dancing", "imitation", "storytelling", "word_games", "tongue_twisters", "drawing", "memory", "coordination", "reactions", "creativity", "voices", "movement", "comedy", "compliments", "group_interaction", "guessing", "challenges"]);
const banned = /na tému|spojen[ýáé] s témou|pri téme|sex|porno|drogy|samovražd|sebapoškodz|znásilnen|rasizm|extrémizm|politic|nábožensk|krádež|zločin|vyzleč|pobozkaj|heslo|súkromn|kontaktuj cudz|zverejni/iu;
function assert(ok, message) { if (!ok) throw new Error(message); }
assert(cards.length === 2000, `Expected 2000 cards, got ${cards.length}.`);
for (const type of ["truth", "dare"]) assert(cards.filter((card) => card.type === type).length === 1000, `Expected 1000 ${type} cards.`);
const ids = new Set();
for (const card of cards) {
  assert(/^(truth|dare)_\d{4}$/.test(card.id) && !ids.has(card.id), `Invalid or duplicate ID ${card.id}.`); ids.add(card.id);
  assert(["easy", "normal", "bold"].includes(card.intensity), `${card.id}: invalid intensity.`);
  assert((card.type === "truth" ? truthCategories : dareCategories).has(card.category), `${card.id}: invalid category.`);
  for (const language of languages) {
    const text = card.translations?.[language];
    assert(typeof text === "string" && text.trim().length > 8, `${card.id}/${language}: missing translation.`);
    assert(!banned.test(text) && !/\p{L}+\/\p{L}+/u.test(text), `${card.id}/${language}: unsafe or invalid text.`);
  }
}
for (const type of ["truth", "dare"]) for (const language of languages) {
  const values = cards.filter((card) => card.type === type).map((card) => card.translations[language].normalize("NFD").replace(/\p{M}/gu, "").toLowerCase());
  assert(new Set(values).size === values.length, `${type}/${language}: duplicate texts.`);
}
console.log("Pravda alebo výzva: 2000 kariet validovaných (1000 pravda, 1000 výzva; 6 jazykov).");
