import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const databasePath = path.resolve("client/src/data/tabooCardsSk.json");
const reportPath = path.resolve("taboo-sk-quality-audit.json");

function normalized(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("sk").replace(/[^a-z0-9]/g, "");
}

const unnaturalTargets = new Set([
  "internetový kalendár", "digitálny predmet na sledovanie času", "vec na vykonávanie činnosti",
  "vesmírny futbal", "bryndzový halušky", "poz emný hokej", "hraníe na nástroj", "snehu liaka",
]);
const targetReplacements = new Map([
  ["internetový kalendár", "kalendár"],
  ["vesmírny futbal", "vybíjaná"],
  ["bryndzový halušky", "bryndzové halušky"],
  ["poz emný hokej", "pozemný hokej"],
  ["hraníe na nástroj", "hra na nástroj"],
  ["snehu liaka", "snehuliak"],
]);
const genericForbiddenWords = new Set([
  "vec", "použitie", "digitálny svet", "každodennosť",
]);
const genericForbiddenPatterns = [
  ["cesta", "orientácia", "presun", "návšteva"],
  ["miesto", "cesta", "návšteva", "okolie"],
  ["mesto", "budova", "ľudia", "okolie"],
  ["šport", "pohyb", "tréning", "výkon"],
  ["činnosť", "pohyb", "čas", "zábava"],
  ["hra", "pravidlá", "hráči", "zábava"],
  ["tvorba", "publikum", "dielo", "vystúpenie"],
  ["umenie", "tvorba", "výstava", "autor"],
  ["zariadenie", "digitálny svet", "funkcia", "pripojenie"],
  ["internet", "sieť", "pripojenie", "online"],
  ["aplikácia", "program", "funkcia", "mobil"],
  ["médiá", "obsah", "správa", "publikum"],
  ["príroda", "prostredie", "zem", "život"],
  ["rastlina", "príroda", "zem", "rast"],
  ["počasie", "obloha", "vzduch", "príroda"],
  ["krajina", "príroda", "terén", "voda"],
  ["zem", "svet", "krajina", "ľudia"],
  ["zviera", "príroda", "život", "prostredie"],
  ["situácia", "ľudia", "rozhovor", "každodennosť"],
  ["emócia", "pocit", "nálada", "človek"],
  ["ľudia", "rozhovor", "vzťah", "situácia"],
  ["čas", "život", "zmena", "plán"],
  ["práca", "úloha", "povinnosť", "výsledok"],
  ["rodina", "domov", "blízki", "každý deň"],
  ["spoločnosť", "pravidlá", "ľudia", "verejnosť"],
  ["zviera", "príroda", "pohyb", "prostredie"],
  ["voľný čas", "príroda", "výlet", "zážitok"],
  ["hudba", "zvuk", "melódia", "vystúpenie"],
  ["kód", "vývoj", "softvér", "funkcia"],
  ["elektrina", "zariadenie", "kábel", "energia"],
];
const clearForeignisms = new Set(["wifi", "email", "bluetooth", "podcast", "blog", "vlog", "router", "server"]);
const data = JSON.parse(await readFile(databasePath, "utf8"));

const candidates = [];
for (const card of data.cards) {
  const target = card.word.trim();
  const normalizedTarget = normalized(target);
  const reasons = [];
  const fixes = [];
  if (unnaturalTargets.has(target.toLocaleLowerCase("sk"))) {
    reasons.push("neprirodzený alebo chybný viacslovný cieľ");
    const replacement = targetReplacements.get(target.toLocaleLowerCase("sk"));
    if (replacement) fixes.push(`navrhnutý cieľ: ${replacement}`);
  }
  if (target.split(/\s+/).length >= 4) reasons.push("príliš dlhý cieľový pojem");
  const normalizedForbidden = card.forbidden.map((word) => word.trim().toLocaleLowerCase("sk"));
  if (normalizedForbidden.some((word) => genericForbiddenWords.has(word))) {
    reasons.push("príliš všeobecné zakázané slovo");
  }
  if (genericForbiddenPatterns.some((pattern) => pattern.every((word, index) => normalizedForbidden[index] === word))) {
    reasons.push("opakovaný všeobecný vzor zakázaných slov");
  }
  const repeated = card.forbidden.map(normalized);
  if (new Set(repeated).size !== 4) reasons.push("opakované zakázané slová");
  if (repeated.some((word) => word === normalizedTarget || (word.length >= 4 && (word.includes(normalizedTarget) || normalizedTarget.includes(word))))) {
    reasons.push("cieľ alebo jeho tvar medzi zakázanými slovami");
  }
  if (card.forbidden.filter((word) => clearForeignisms.has(word.trim().toLocaleLowerCase("sk"))).length >= 2) {
    reasons.push("nahustené anglicizmy v zákaze");
  }
  if (reasons.length) candidates.push({ id: card.id, category: card.category, word: card.word, forbidden: card.forbidden, reasons, fixes });
}

const byCategory = Object.fromEntries([...new Set(data.cards.map((card) => card.category))].map((category) => [category, candidates.filter((card) => card.category === category).length]));
const report = {
  cardsAudited: data.cards.length,
  candidates: candidates.length,
  byCategory,
  items: candidates,
};
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ cardsAudited: report.cardsAudited, candidates: report.candidates, byCategory }, null, 2));
