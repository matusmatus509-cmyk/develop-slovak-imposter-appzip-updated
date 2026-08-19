import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const databasePath = path.resolve("client/src/data/tabooCardsSk.json");
const firstCuratedIndex = 825;

function normalized(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("sk").replace(/[^a-z0-9]/g, "");
}

const alternatives = {
  "Jedlo a nápoje": "trdelník|tiramisu|marcipán|štrúdľa|bublanina|perník|závin|krupicová kaša|ovsená kaša|ovocný šalát",
  "Zvieratá": "rybárik|plch|lasica|hraboš|svišť|vlčiak|včelárik|plameniak ružový|albatros|ploskozubec",
  "Ľudia a povolania": "notár|tlmočník|geodet|zubný hygienik|plavčík|kurátor výstavy|sociálny pracovník|rušňovodič|hodinár|knihár",
  "Predmety a domácnosť": "štipce na bielizeň|odkvapkávač na riad|strúhadlo|otvárač konzerv|korková podložka|skrinka na topánky|kuchynská rukavica|škrabka na zemiaky|miska na ovocie|nádoba na mydlo|stojan na časopisy|kôš na papier",
  "Miesta a cestovanie": "colný úrad|pietne miesto|pozorovateľňa|miesto na piknik|observatórium|mestská brána|vlakové depo|požičovňa áut|pobrežná promenáda|turistický prístav|pohotovostná ambulancia|vyhliadková plošina",
  "Aktivity a šport": "florbal|šplhanie|skok cez švihadlo|hod diskom|parkúr|softbal|tvorba komiksu|návšteva planetária|meditácia|aerobik|žonglovanie|stavanie modelu|plážový volejbal|hod oštepom|rozhodcovanie|spoločné varenie|pozorovanie hviezd|jazda na kajaku|cvičenie s gumou|tréning rovnováhy|zber byliniek|vyšívanie|učenie sa tanca|stolová hra|bežkovanie",
  "Filmy, seriály a kultúra": "dioráma|literárny večer|poetický slam|šansón|filharmónia|sláčikové kvarteto|bibliofilia|etuda|virtuóz|herecké ocenenie|filmový plagát|vizuálne efekty|premietací prístroj|umelecký katalóg|litografia|autorský honorár|tanečný súbor|divadelný súbor|folklórny festival|hudobná nahrávka|videoesej|stereo zvuk|hudobná dramaturgia|autorská zmluva|knižná ilustrácia|kultúrne dedičstvo|dramaturgia|hudobná partitúra|múzejná vitrína|umelecká rezidencia|zvuková stopa|dokumentárna fotografia|výtvarná inštalácia|galavečer|hudobné vydavateľstvo",
  "Technológie a médiá": "biometrický snímač|elektronický inkubátor|digitálny merač|snímač teploty|satelitný prijímač|čipová karta|kartový terminál|optické vlákno|sieťový prepínač|merací prístroj|elektronická pokladnica|digitálna lupa|čipový kľúč|záložný zdroj|elektrický skúter|laserový merač|kamera na dvere|automatický dávkovač|dekoratívne svetlo|digitálny návod|virtuálna postava|internetový kalendár|online rezervovanie|heslový manažér|blokovanie reklám|správca súborov|webový formulár|digitálna čítačka|vysokorýchlostný internet|dátový balík|digitálna vstupenka|elektronická kniha|navigačný čip|bezpečnostný token|inteligentný termostat|senzor pohybu|automatická brána|digitálny kompas|elektronický slovník|bluetooth adaptér|mobilný hotspot",
  "Príroda a svet": "vodná para|seizmická vlna|zemetrasenie|oceánsky prúd|pôdna vrstva|minerálna voda|skalná veža|príliv|odliv|živočíšny druh|púštna ruža|polárny kruh|morský príboj|prales|rašelinisko",
  "Všeobecné pojmy a situácie": "pracovné zadanie|osobný priestor|dobrý úmysel|drobné nedorozumenie|spoločenská etiketa|neformálne stretnutie|nenápadná pomoc|zdieľaná starosť|nečakaná zmena|osobný záväzok|vzájomná podpora|dlhodobý plán|konštruktívna kritika|slávnostný prípitok|rodinná tradícia|prvý pracovný deň|dôležitý telefonát|spoločné rozhodnutie|pokojný večer|rodinný výlet|spoločná dohoda|pracovná porada|príjemné prekvapenie|rozumný kompromis|čas na oddych|malá pozornosť|verejná pochvala|rodinný rozpočet|spoločenské pravidlo|každodenná starosť",
};

const clues = {
  "Jedlo a nápoje": ["jedlo", "chuť", "prísada", "kuchyňa"],
  "Zvieratá": ["zviera", "príroda", "pohyb", "prostredie"],
  "Ľudia a povolania": ["povolanie", "práca", "ľudia", "úloha"],
  "Predmety a domácnosť": ["domov", "vec", "vybavenie", "použitie"],
  "Miesta a cestovanie": ["miesto", "cesta", "návšteva", "okolie"],
  "Aktivity a šport": ["činnosť", "pohyb", "čas", "zábava"],
  "Filmy, seriály a kultúra": ["tvorba", "publikum", "dielo", "vystúpenie"],
  "Technológie a médiá": ["zariadenie", "digitálny svet", "funkcia", "pripojenie"],
  "Príroda a svet": ["príroda", "prostredie", "Zem", "život"],
  "Všeobecné pojmy a situácie": ["situácia", "ľudia", "rozhovor", "každodennosť"],
};

const data = JSON.parse(await readFile(databasePath, "utf8"));
const cards = data.cards;
const replaceIndexes = new Set();
for (let first = 0; first < cards.length; first += 1) {
  const firstKey = normalized(cards[first].word);
  for (let second = first + 1; second < cards.length; second += 1) {
    const secondKey = normalized(cards[second].word);
    if (firstKey.length >= 6 && secondKey.length >= 6 && (firstKey.includes(secondKey) || secondKey.includes(firstKey))) {
      if (second >= firstCuratedIndex) replaceIndexes.add(second);
      else if (first >= firstCuratedIndex) replaceIndexes.add(first);
    }
  }
}

const used = new Set(cards.map((card) => normalized(card.word)));
const candidateQueues = Object.fromEntries(Object.entries(alternatives).map(([category, source]) => [category, source.split("|").map((word) => word.trim())]));
for (const index of replaceIndexes) used.delete(normalized(cards[index].word));

for (const index of [...replaceIndexes].sort((a, b) => a - b)) {
  const card = cards[index];
  const queue = candidateQueues[card.category];
  const candidate = queue?.find((word) => {
    const key = normalized(word);
    return key && !used.has(key) && ![...used].some((usedKey) => key.length >= 6 && usedKey.length >= 6 && (key.includes(usedKey) || usedKey.includes(key)));
  });
  if (!candidate) throw new Error(`Chýba jedinečná náhrada pre ${card.category}, kartu ${card.id}.`);
  queue.splice(queue.indexOf(candidate), 1);
  card.word = candidate;
  card.forbidden = clues[card.category];
  used.add(normalized(candidate));
}

const manualReplacements = {
  taboo_sk_0226: { word: "vitrína", forbidden: ["sklo", "výstava", "nábytok", "predmety"] },
  taboo_sk_0414: { word: "remuláda", forbidden: ["studená", "bylinky", "príloha", "majonéza"] },
  taboo_sk_0509: { word: "odmerka", forbidden: ["kuchyňa", "množstvo", "tekutina", "varenie"] },
  taboo_sk_0612: { word: "sklenár", forbidden: ["sklo", "rám", "tabuľa", "okno"] },
  taboo_sk_0613: { word: "správca budovy", forbidden: ["dom", "údržba", "nájomníci", "práca"] },
  taboo_sk_0668: { word: "ručné práce", forbidden: ["tvorba", "materiál", "náradie", "záľuba"] },
  taboo_sk_0714: { word: "mediátor", forbidden: ["spor", "dohoda", "zmierenie", "rozhovor"] },
  taboo_sk_0755: { word: "filmová klapka", forbidden: ["natáčanie", "režisér", "záber", "scéna"] },
  taboo_sk_0781: { word: "vrh guľou", forbidden: ["atletika", "kruh", "guľa", "súťaž"] },
  taboo_sk_0821: { word: "prosciutto", forbidden: ["šunka", "Taliansko", "mäso", "tenké plátky"] },
  taboo_sk_0850: { word: "pamätník", forbidden: ["história", "socha", "pripomienka", "verejnosť"] },
};
for (const [id, replacement] of Object.entries(manualReplacements)) {
  const card = cards.find((item) => item.id === id);
  if (!card) throw new Error(`Chýba karta ${id} na manuálnu opravu.`);
  card.word = replacement.word;
  card.forbidden = replacement.forbidden;
}

await writeFile(databasePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Replaced ${replaceIndexes.size} lexically overlapping targets.`);
