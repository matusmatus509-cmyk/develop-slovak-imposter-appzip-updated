import fs from "node:fs";

const source = new URL("../src/data/quiz-master.raw.json", import.meta.url);
const questions = JSON.parse(fs.readFileSync(source, "utf8"));

const HARD_LANGUAGE = [
  /presná|približn|podľa počtu|chemick|pH|gravitač|arteriál|vlnová dĺžka|vákuu/i,
  /v ktorom roku|v ktorom storočí|ktorý panovník|doby[lv]|zasväten|pôvodne/i,
  /dokončil|autor|režíroval|skladateľ|vynálezca|objavil|vytvoril/i,
];
const EASY_LANGUAGE = [
  /aké je hlavné mesto|ktorá planéta|koľko hráčov|koľko disciplín|ktoré zviera|ktorá rieka|ktorý oceán/i,
  /ako sa volá hlavná postava|ktorá krajina|koľko kontinentov|aká farba/i,
];

function hardness(item) {
  const text = `${item.question} ${item.answer}`;
  const words = item.question.trim().split(/\s+/).length;
  let score = 0;
  if (words >= 13) score += 1;
  if (words >= 19) score += 1;
  if (/\d{3,4}|%|m\/s|°C|pH|II\./.test(text)) score += 2;
  score += HARD_LANGUAGE.filter((pattern) => pattern.test(text)).length * 2;
  score -= EASY_LANGUAGE.filter((pattern) => pattern.test(text)).length * 2;
  return score;
}

const byCategory = new Map();
for (const item of questions) {
  const items = byCategory.get(item.category) ?? [];
  items.push(item);
  byCategory.set(item.category, items);
}

for (const items of byCategory.values()) {
  const ranked = [...items]
    .map((item) => ({ item, score: hardness(item) }))
    .sort((a, b) => b.score - a.score || a.item.factKey.localeCompare(b.item.factKey));
  const hardCount = Math.ceil(ranked.length / 2);
  ranked.forEach(({ item }, index) => {
    item.difficulty = index < hardCount ? "tazke" : "lahke";
  });
}

const summary = [...byCategory.entries()].map(([category, items]) => ({
  category,
  lahke: items.filter((item) => item.difficulty === "lahke").length,
  tazke: items.filter((item) => item.difficulty === "tazke").length,
}));
fs.writeFileSync(source, JSON.stringify(questions, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ total: questions.length, criteria: "balanced-hardness-v1", summary }, null, 2));
