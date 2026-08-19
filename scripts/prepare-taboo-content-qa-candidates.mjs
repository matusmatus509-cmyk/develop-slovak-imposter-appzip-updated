import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(".");
const data = JSON.parse(await readFile(path.join(root, "client/src/data/tabooCardsSk.json"), "utf8"));

const naturalMultiwordTargets = new Set([
  "horská dráha", "školská taška", "zubná kefka", "dopravná značka", "nákupný košík",
  "priechod pre chodcov", "pracovný stôl", "stolný tenis", "futbalový zápas", "hokejový zápas",
  "rodinný album", "prvý dojem", "druhá šanca", "voľný čas", "domáce zviera",
  "stará mama", "starý otec", "mobilný telefón", "sociálna sieť", "televízny ovládač",
  "chladnička s mrazničkou", "čierna diera", "severná žiara", "životné prostredie",
  "slnečná sústava", "dažďový prales", "výročný deň", "narodeninová oslava", "ranná káva",
  "vianočný stromček", "tichá domácnosť", "spoločná večera", "štátna hranica", "dopravná nehoda",
  "verejná doprava", "pohybový senzor", "domový zvonček", "digitálna váha", "poistková skrinka",
  "diaľkové ovládanie", "mobilné dáta", "webová stránka", "cloudové úložisko", "hlasová správa",
  "videohovor", "tmavý režim", "tichý režim", "hudobný album", "operný spev",
]);
const technicalOrArtificialTokens = [
  "internetový", "digitálny", "elektronický", "virtuálny", "kybernetický", "satelitný", "bezkontaktný",
  "samoobslužný", "inteligentný", "batériový", "poistkový", "indukčný", "laserový", "bluetooth",
  "navigačný", "programovací", "automatizácia", "algoritmus", "šifrovanie", "firewall", "modem",
  "adaptér", "detektor", "videovrátnik", "predlžovač", "súradnice", "oceánsky", "historická štvrť",
  "odbavovacia", "kinosála", "správca budovy", "dvojfaktorové", "používateľské meno", "prístupový kód",
  "zálohovanie", "obnovenie hesla", "digitálny podpis", "virtuálna schôdza", "domovská obrazovka",
];
const administrativeTokens = [
  "dokument", "registrácia", "formulár", "doklad", "práv", "povolenie", "nariadenie", "overenie",
  "zmluva", "výpoveď", "delegovanie", "reklamácia", "objednávka", "zápisnica", "harmonogram",
];

function normalize(value) {
  return value.toLocaleLowerCase("sk").replace(/\s+/g, " ").trim();
}
function reasons(card) {
  const target = normalize(card.word);
  const words = target.split(" ");
  const flags = [];
  if (/[\u200B-\u200D\uFEFF]/.test(card.word)) flags.push("neviditeľný alebo chybný znak");
  if (technicalOrArtificialTokens.some((token) => target.includes(token))) flags.push("technický, špecifický alebo umelý tvar");
  if (administrativeTokens.some((token) => target.includes(token))) flags.push("administratívny alebo pracovný tvar");
  if (words.length >= 3 && !naturalMultiwordTargets.has(target)) flags.push("neprirodzene dlhý viacslovný cieľ");
  if (words.length === 2 && !naturalMultiwordTargets.has(target)) flags.push("viacslovný cieľ vyžadujúci manuálne posúdenie");
  return flags;
}

const candidates = data.cards
  .map((card) => ({ ...card, reasons: reasons(card) }))
  .filter((card) => card.reasons.length > 0);
const categories = [...new Set(data.cards.map((card) => card.category))];
const byCategory = Object.fromEntries(categories.map((category) => [category, candidates.filter((card) => card.category === category).length]));
const inventory = categories.map((category) => {
  const cards = data.cards.filter((card) => card.category === category);
  return [
    `## ${category}`,
    "",
    ...cards.map((card) => `${card.id} — ${card.word}${reasons(card).length ? `  ← ${reasons(card).join("; ")}` : ""}`),
    "",
  ].join("\n");
}).join("\n");

await writeFile(path.join(root, "taboo-sk-content-qa-candidates.json"), `${JSON.stringify({ candidates: candidates.length, byCategory, items: candidates }, null, 2)}\n`, "utf8");
await writeFile(path.join(root, "taboo-sk-target-inventory.md"), `# Inventár cieľových slov — content QA\n\n${inventory}`, "utf8");
console.log(JSON.stringify({ cards: data.cards.length, candidates: candidates.length, byCategory }, null, 2));
