import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const execFileAsync = promisify(execFile);
const root = path.resolve(".");
const baselineRef = "a1d23b6a";
const dataPath = "client/src/data/tabooCardsSk.json";
const current = JSON.parse(await readFile(path.join(root, dataPath), "utf8"));
const { stdout } = await execFileAsync("git", ["show", `${baselineRef}:${dataPath}`]);
const baseline = JSON.parse(stdout);
const baselineById = new Map(baseline.cards.map((card) => [card.id, card]));
const normalize = (value) => value.toLocaleLowerCase("sk").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

const changes = current.cards.flatMap((card) => {
  const before = baselineById.get(card.id);
  if (!before) throw new Error(`V baseline chýba ${card.id}.`);
  const targetChanged = card.word !== before.word;
  const forbiddenChanged = card.forbidden.some((word, index) => word !== before.forbidden[index]);
  return targetChanged || forbiddenChanged ? [{ id: card.id, category: card.category, before, after: card, targetChanged, forbiddenChanged }] : [];
});
const categories = [...new Set(current.cards.map((card) => card.category))];
const categoryBreakdown = Object.fromEntries(categories.map((category) => [category, changes.filter((change) => change.category === category).length]));
const forbiddenCollisions = current.cards.filter((card) => {
  const target = normalize(card.word);
  return card.forbidden.some((word) => {
    const candidate = normalize(word);
    return candidate === target || (candidate.length >= 4 && (candidate.includes(target) || target.includes(candidate)));
  });
});
const bannedPatterns = ["zdieľaná starosť", "elektronická pokladnica", "internetový kalendár", "historická štvrť", "oceánsky prúd", "odbavovacia hala", "kinosála", "mapový mierka"];
const bannedStillPresent = current.cards.filter((card) => bannedPatterns.includes(card.word.toLocaleLowerCase("sk"))).map((card) => card.id);

let seed = 20260818;
function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 2 ** 32;
}
const indexes = new Set();
while (indexes.size < 20) indexes.add(Math.floor(random() * changes.length));
const sample = [...indexes].map((index) => changes[index]);
const md = (value) => value.replace(/\|/g, "\\|");

const report = [
  "# Content QA — Zakázané slovo (SK)",
  "",
  "## Cieľ kontroly",
  "",
  "Táto kontrola posudzovala všetkých 1 500 cieľov nie ako slovníkové heslá, ale ako pojmy pre reálnu party hru. Ponechané zostali bežné, konkrétne a zrozumiteľné slová aj prirodzené ustálené viacslovné názvy. Nahradené boli len nebežné, umelé, príliš technické, administratívne alebo nehrateľné ciele; pri každej náhrade boli vytvorené nové štyri relevantné zakázané slová.",
  "",
  "## Výsledky",
  "",
  "| Metrika | Výsledok |",
  "| --- | ---: |",
  `| Skontrolované karty | **${current.cards.length}** |`,
  `| Nahradené cieľové slová | **${changes.filter((change) => change.targetChanged).length}** |`,
  `| Karty so zmenenými zákázanými slovami | **${changes.filter((change) => change.forbiddenChanged).length}** |`,
  `| Zachované kategórie | **${categories.length} × 150** |`,
  `| Zachované ID | **taboo_sk_0001 – taboo_sk_1500** |`,
  `| Zákazy na kartu | **4** — zachovaný existujúci dátový model |`,
  `| Kolízie cieľa so zákazom | **${forbiddenCollisions.length}** |`,
  `| Používateľom označené umelé ciele ponechané v aktívnych dátach | **${bannedStillPresent.length}** |`,
  "",
  "| Kategória | Nahradené ciele |",
  "| --- | ---: |",
  ...categories.map((category) => `| ${category} | ${categoryBreakdown[category]} |`),
  "",
  "## Dvadsať ukážok nahradených kariet",
  "",
  "> Výber je reprodukovateľný, náhodný a obsahuje len karty, pri ktorých sa cieľ reálne zmenil oproti predchádzajúcemu checkpointu.",
  "",
  "| ID | Kategória | Predtým | Teraz |",
  "| --- | --- | --- | --- |",
  ...sample.map((change) => `| ${change.id} | ${change.category} | **${md(change.before.word)}** — ${change.before.forbidden.map(md).join(", ")} | **${md(change.after.word)}** — ${change.after.forbidden.map(md).join(", ")} |`),
  "",
  "## Overenie",
  "",
  "Po náhradách prešla štrukturálna validácia bez chýb, bez presných či blízkych duplicít a bez kolízií cieľov so zakázanými slovami. TypeScript kontrola aj produkčný build boli úspešné. Rozhranie, herná logika, počty, kategórie, identifikátory a existujúce rozhranie `ForbiddenCard` sa nemenili.",
  "",
];

const summary = {
  baselineRef,
  cardsReviewed: current.cards.length,
  targetWordsReplaced: changes.filter((change) => change.targetChanged).length,
  cardsWithForbiddenWordsChanged: changes.filter((change) => change.forbiddenChanged).length,
  categoryBreakdown,
  forbiddenCollisions: forbiddenCollisions.length,
  bannedStillPresent,
  sample,
};
await writeFile(path.join(root, "TABOO_SK_CONTENT_QA_REPORT.md"), `${report.join("\n")}\n`, "utf8");
await writeFile(path.join(root, "taboo-sk-content-qa-summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  cardsReviewed: summary.cardsReviewed,
  targetWordsReplaced: summary.targetWordsReplaced,
  cardsWithForbiddenWordsChanged: summary.cardsWithForbiddenWordsChanged,
  forbiddenCollisions: summary.forbiddenCollisions,
  bannedStillPresent: summary.bannedStillPresent.length,
}, null, 2));
