import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(".");
const database = JSON.parse(await readFile(path.join(root, "client/src/data/tabooCardsSk.json"), "utf8"));
const validation = JSON.parse(await readFile("/tmp/taboo-validation-final.json", "utf8"));
const categories = [
  "Jedlo a nápoje",
  "Zvieratá",
  "Ľudia a povolania",
  "Predmety a domácnosť",
  "Miesta a cestovanie",
  "Aktivity a šport",
  "Filmy, seriály a kultúra",
  "Technológie a médiá",
  "Príroda a svet",
  "Všeobecné pojmy a situácie",
];

let seed = 1500;
function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 2 ** 32;
}
function markdown(value) {
  return value.replace(/\|/g, "\\|");
}

const sample = categories.flatMap((category) => {
  const cards = database.cards.filter((card) => card.category === category);
  const choices = new Set();
  while (choices.size < 2) choices.add(Math.floor(random() * cards.length));
  return [...choices].map((index) => cards[index]);
});

const breakdown = categories.map((category) => [category, database.cards.filter((card) => card.category === category).length]);
const report = [
  "# Zakázané slovo — slovenská databáza",
  "",
  "## Súhrn",
  "",
  "| Kontrola | Výsledok |",
  "| --- | --- |",
  `| Celkový počet | **${database.cards.length} kariet** |`,
  "| Štruktúra | 10 kategórií × 150 kariet |",
  "| Jazyk | Slovenčina (`sk`) |",
  "| Aktívny herný pool | Pôvodný výber 2 000 kariet bol nahradený novou databázou 1 500 kariet. |",
  "| Jedinečnosť | 74 potenciálnych lexikálnych prekrytí bolo kurátorsky nahradených; po finálnej kontrole zostalo **0** presných aj blízkych duplicít. |",
  `| Validácia | **${validation.status}** — ${validation.errors.length} chýb, ${validation.nearDuplicateWarnings.length} upozornení. |`,
  "| TypeScript | `pnpm check` úspešný. |",
  "| Produkčný build | `pnpm build` úspešný. Build iba upozornil na veľkosť existujúceho JavaScriptového balíka a runtime cestu jedného uloženého obrázka; nejde o chyby buildu. |",
  "",
  "## Kategórie",
  "",
  "| Kategória | Počet kariet |",
  "| --- | ---: |",
  ...breakdown.map(([category, count]) => `| ${category} | ${count} |`),
  "",
  "## Dvadsať náhodných ukážok",
  "",
  "> Výber je reprodukovateľný, semenom určený a stratifikovaný: dve náhodné karty z každej kategórie.",
  "",
  "| ID | Kategória | Cieľové slovo | Zakázané slová |",
  "| --- | --- | --- | --- |",
  ...sample.map((card) => `| ${card.id} | ${card.category} | **${markdown(card.word)}** | ${card.forbidden.map(markdown).join(", ")} |`),
  "",
  "## Rozsah integrácie",
  "",
  "Súbor `client/src/data/teamBattleExtras.ts` teraz exportuje aktívny pool `FORBIDDEN_CARDS` priamo z `tabooCardsSk.json`. Formát zostal kompatibilný s existujúcim rozhraním `ForbiddenCard`: `word` a pole štyroch hodnôt `forbidden`. Herná logika ani používateľské rozhranie sa nemenili; databáza nebola preložená do ďalších jazykov.",
  "",
];

await writeFile(path.join(root, "TABOO_SK_DATABASE_REPORT.md"), `${report.join("\n")}\n`, "utf8");
await writeFile(path.join(root, "taboo-sk-database-summary.json"), `${JSON.stringify({ cards: database.cards.length, breakdown: Object.fromEntries(breakdown), validation, sample }, null, 2)}\n`, "utf8");
console.log("Wrote TABOO_SK_DATABASE_REPORT.md and taboo-sk-database-summary.json.");
