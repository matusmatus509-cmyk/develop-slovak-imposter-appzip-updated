import cards from "../src/data/neverHaveIEver.json" with { type: "json" };

const languages = ["sk", "en", "de", "es", "fr", "pt"];
const suspiciousEncoding = /[\u00c3\u00c2\ufffd]/u;
const slashVariant = /\p{L}+\/\p{L}+/u;

function normalized(value) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase();
}

function contentWords(value) {
  return new Set(normalized(value)
    .replace(/^nikdy som (?:sa |si )?nikdy /u, "")
    .split(/[^a-z0-9]+/u)
    .filter((word) => word.length > 3 && !new Set(["ktory", "ktora", "ktore", "nikdy", "som", "bola", "bolo", "svoj", "sama"]).has(word)));
}

const problems = [];
for (const language of languages) {
  const texts = cards.map((card) => card.translations[language]);
  const duplicates = texts.length - new Set(texts.map(normalized)).size;
  const badEncoding = texts.filter((text) => suspiciousEncoding.test(text)).length;
  const slashes = texts.filter((text) => slashVariant.test(text)).length;
  if (duplicates || badEncoding || slashes) problems.push(`${language}: duplicate=${duplicates}, encoding=${badEncoding}, slash=${slashes}`);
}

const similarPairs = [];
for (let left = 0; left < cards.length; left += 1) {
  const a = contentWords(cards[left].translations.sk);
  for (let right = left + 1; right < cards.length; right += 1) {
    const b = contentWords(cards[right].translations.sk);
    const overlap = [...a].filter((word) => b.has(word)).length;
    const union = a.size + b.size - overlap;
    if (union > 0 && overlap / union >= 0.8) similarPairs.push([left, right]);
  }
}

if (problems.length) throw new Error(`Formálna kontrola zlyhala: ${problems.join("; ")}`);
console.log(`Audit všetkých ${cards.length} kariet × ${languages.length} jazykov: formát, UTF-8 a duplicity sú v poriadku.`);
console.log(`Kontrola podobnosti slovenských situácií: ${similarPairs.length} podozrivo blízkych párov.`);
if (similarPairs.length) console.log(similarPairs.slice(0, 30).map(([a, b]) => `${cards[a].id}/${cards[b].id}`).join(", "));
