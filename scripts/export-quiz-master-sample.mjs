import fs from "node:fs";

const source = new URL("../src/data/quiz-master.raw.json", import.meta.url);
const target = new URL("../quiz-master-review-sample.md", import.meta.url);
const questions = JSON.parse(fs.readFileSync(source, "utf8"));
const groups = new Map();
for (const question of questions) {
  const group = groups.get(question.category) ?? [];
  group.push(question);
  groups.set(question.category, group);
}

const lines = ["# Výber otázok na kontrolu", "", "Tento súbor obsahuje štyri reprezentatívne otázky z každej aktuálne vytvorenej kategórie.", ""];
for (const [category, items] of [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, "sk"))) {
  lines.push(`## ${category}`, "");
  const sampleIndexes = [...new Set([0, Math.floor(items.length / 3), Math.floor((2 * items.length) / 3), items.length - 1])];
  for (const index of sampleIndexes) {
    const item = items[index];
    lines.push(`### ${item.id} — \`${item.factKey}\``, "", `**${item.question}**`, "");
    item.options.forEach((option, optionIndex) => lines.push(`${optionIndex + 1}. ${option}${optionIndex === item.correctIndex ? " — správna odpoveď" : ""}`));
    lines.push("");
  }
}
fs.writeFileSync(target, lines.join("\n"), "utf8");
console.log(target.pathname);
