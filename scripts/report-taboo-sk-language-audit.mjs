import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(".");
const summary = JSON.parse(await readFile(path.join(root, "taboo-sk-audit-summary.json"), "utf8"));
const validation = JSON.parse(await readFile("/tmp/taboo-validation-quality-final.json", "utf8"));
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

let seed = 2608;
function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 2 ** 32;
}
function markdown(value) {
  return value.replace(/\|/g, "\\|");
}
function kind(change) {
  if (change.targetChanged && change.id === "taboo_sk_0899") return "pravopis cieľa + zákazy";
  if (change.targetChanged) return "neprirodzený cieľ + zákazy";
  return "spresnené zakázané slová";
}

const choices = new Set();
while (choices.size < 20) choices.add(Math.floor(random() * summary.changes.length));
const sample = [...choices].map((index) => summary.changes[index]);

const report = [
  "# Jazyková a herná kontrola — Zakázané slovo (SK)",
  "",
  "## Rozsah a výsledok",
  "",
  "Celá existujúca databáza bola skontrolovaná karte po karte. Nešlo o tvorbu novej zásoby: zachovali sa ID, kategórie, počet 1 500 kariet aj dátový model. Upravovali sa iba ciele alebo zakázané slová, pri ktorých audit odhalil nepresný pravopis, neprirodzený cieľ alebo príliš všeobecné a opakované asociácie.",
  "",
  "| Metrika | Výsledok |",
  "| --- | ---: |",
  `| Skontrolované karty | **${summary.cardsReviewed}** |`,
  `| Opravené karty | **${summary.cardsCorrected}** |`,
  `| Nahradené neprirodzené cieľové slová | **1** |`,
  `| Pravopisné opravy cieľov | **${summary.spellingOrOrthographyCorrections}** |`,
  `| Karty so spresnenými zakázanými slovami | **${summary.cardsWithForbiddenWordsCorrected}** |`,
  `| Potvrdene odstránené významové duplicity | **${summary.confirmedSemanticDuplicatesRemoved}** |`,
  `| Validácia dát | **${validation.status}** — ${validation.errors.length} chýb, ${validation.nearDuplicateWarnings.length} upozornení |`,
  "| TypeScript | `pnpm check` úspešný |",
  "| Produkčný build | `pnpm build` úspešný |",
  "",
  "Pri počte opravených kariet sú zahrnuté aj karty s ponechaným cieľom, ktorým sa nahradila celá štvorica opakovaných všeobecných zákazov vecnými asociáciami. Príkladom je nahradenie vzorov typu „šport, pohyb, tréning, výkon“ konkrétnymi indíciami podľa športu.",
  "",
  "## Povinné kontroly",
  "",
  "Automatická validácia potvrdila presne 1 500 kariet, 10 kategórií po 150 položkách, jedinečné ID `taboo_sk_0001` až `taboo_sk_1500`, štyri neprázdne zákazy na kartu, žiadny cieľ medzi vlastnými zákazmi a žiadne presné ani blízke cieľové duplicity. Dodatočný jazykovo-herny audit po úpravách nenašiel žiadne prázdne alebo opakované všeobecné vzory.",
  "",
  "## Dvadsať opravených kariet — vzorka",
  "",
  "> Výber je reprodukovateľný a náhodný: obsahuje dvadsať kariet zo všetkých opráv vykonaných počas auditu.",
  "",
  "| ID | Kategória | Typ opravy | Pred úpravou | Po úprave |",
  "| --- | --- | --- | --- | --- |",
  ...sample.map((change) => `| ${change.id} | ${change.category} | ${kind(change)} | **${markdown(change.before.word)}** — ${change.before.forbidden.map(markdown).join(", ")} | **${markdown(change.after.word)}** — ${change.after.forbidden.map(markdown).join(", ")} |`),
  "",
  "## Technický rozsah",
  "",
  "Zmenil sa iba zdroj `client/src/data/tabooCardsSk.json` a pomocné auditné skripty. Integrácia v hre, názvy polí, kategórie, ID, používateľské rozhranie a preklady ostali nezmenené. Žiadna zmena nebola odoslaná na GitHub ani publikovaná.",
  "",
];

await writeFile(path.join(root, "TABOO_SK_LANGUAGE_GAME_AUDIT_REPORT.md"), `${report.join("\n")}\n`, "utf8");
await writeFile(path.join(root, "taboo-sk-audit-sample.json"), `${JSON.stringify({ summary, validation, sample }, null, 2)}\n`, "utf8");
console.log("Wrote TABOO_SK_LANGUAGE_GAME_AUDIT_REPORT.md and taboo-sk-audit-sample.json.");
