import fs from "node:fs";

const file = new URL("../src/data/neverHaveIEver.json", import.meta.url);
const json = fs.readFileSync(file, "utf8");
const cards = JSON.parse(json);
const languages = ["sk", "en", "de", "es", "fr", "pt"];
const categories = new Set([
  "school", "work", "family", "friends", "childhood", "travel", "holidays", "food", "cooking", "shopping", "money", "sports", "hobbies", "music", "movies", "series", "gaming", "internet", "social_media", "technology", "parties", "embarrassing", "funny", "everyday_life", "habits", "fears", "challenges", "nature", "animals", "transportation", "driving", "concerts", "festivals", "relationships", "memories", "mistakes", "achievements",
]);
const intensities = new Set(["normal", "funny", "bold", "party"]);
const forbidden = /\b(?:sex|porno|drogy|samovražd|sebapoškodz|znásilnen|rasizm|extrémizm|politic|nábožensk|krádež|zločin)\b/iu;
const forbiddenTemplate = /téma\s+[a-z]|na tému|spojen[ýáé] s témou/iu;
const placeholder = /^(?:TODO|TBD|Example|Test|Unknown)$/iu;
const openings = {
  // Slovak reflexive verbs naturally use the equally common form
  // "Nikdy som sa nikdy ..."; both retain the game’s Never Have I Ever voice.
  sk: /^Nikdy som (?:(?:sa|si) )?nikdy /u,
  en: /^Never have I ever /u,
  de: /^Ich (?:habe|bin|war) .*noch nie /u,
  es: /^Nunca /u,
  fr: /^(?:Je n['’]ai jamais|Je ne me suis jamais|Je ne suis jamais) /u,
  pt: /^Nunca /u,
};
function assert(condition, message) { if (!condition) throw new Error(message); }
function key(value) { return value.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase(); }

assert(Array.isArray(cards) && cards.length === 1500, `Očakávaných je presne 1500 kariet, nájdených ${cards.length}.`);
const ids = new Set();
for (const [index, card] of cards.entries()) {
  assert(/^never_ever_\d{4}$/.test(card.id), `Neplatné ID na pozícii ${index + 1}.`);
  assert(!ids.has(card.id), `Duplicitné ID: ${card.id}`); ids.add(card.id);
  assert(categories.has(card.category), `${card.id}: nepovolená kategória.`);
  assert(!card.category.includes("+"), `${card.id}: neplatná kategória.`);
  assert(intensities.has(card.intensity), `${card.id}: nepovolená intenzita.`);
  for (const language of languages) {
    const text = card.translations?.[language];
    assert(typeof text === "string" && text.trim().length > 12, `${card.id}/${language}: prázdny alebo krátky text.`);
    assert(!placeholder.test(text.trim()), `${card.id}/${language}: placeholder.`);
    assert(!forbidden.test(text) && !forbiddenTemplate.test(text), `${card.id}/${language}: zakázaný obsah.`);
    assert(!/\w+\/\w+/u.test(text), `${card.id}/${language}: lomkový rodový tvar.`);
    assert(openings[language].test(text) && text.endsWith("."), `${card.id}/${language}: neprirodzený úvod alebo chýba bodka.`);
  }
}
for (const language of languages) {
  const seen = new Set();
  for (const card of cards) {
    const normalized = key(card.translations[language]);
    assert(!seen.has(normalized), `${language}: duplicitný text ${card.id}.`);
    seen.add(normalized);
  }
}
const distribution = Object.groupBy(cards, ({ category }) => category);
assert(Math.max(...Object.values(distribution).map((items) => items.length)) <= 550, "Jedna kategória neprimerane dominuje.");
console.log(`Nikdy som nikdy: validácia úspešná (${cards.length} kariet, ${Object.keys(distribution).length} kategórií).`);
console.log(`Jazyky: ${languages.join(", ")}; texty sú neprázdne, jedinečné a bez lomkových rodových tvarov.`);
