type WouldRatherPair = { a: string; b: string };

type StringGroup = readonly [string, ...string[]];

function flattenGroups(groups: readonly StringGroup[]) {
  const items = groups.flat();
  if (groups.length !== 20 || groups.some((group) => group.length !== 10) || items.length !== 200) {
    throw new Error("Would You Rather groups must contain exactly 20 groups of 10 items.");
  }
  return items;
}

function exactUnique<T>(label: string, items: T[], key: (item: T) => string) {
  if (items.length !== 2000 || new Set(items.map(key)).size !== 2000) {
    throw new Error(`${label} must contain exactly 2,000 unique cards.`);
  }
  return items;
}

const WYR_ACTIVITY_GROUPS: readonly StringGroup[] = [
  ["čítať detektívku", "čítať fantasy knihu", "čítať komiks", "čítať životopis", "čítať rozprávku", "čítať cestopis", "čítať knihu o prírode", "čítať humoristický román", "čítať kuchársku knihu", "čítať knihu pred spaním"],
  ["pozerať komédiu", "pozerať dobrodružný film", "pozerať dokument", "pozerať animovaný film", "pozerať detektívku", "pozerať fantastický film", "pozerať seriál", "pozerať muzikál", "pozerať romantický film", "pozerať historický film"],
  ["hrať šach", "hrať karty", "hrať pexeso", "hrať domino", "hrať scrabble", "hrať piškvorky", "hrať kvíz", "hrať stolný futbal", "hrať spoločenskú hru", "hrať logickú hru"],
  ["kresliť mačku", "kresliť hrad", "kresliť krajinu", "kresliť komiks", "kresliť robota", "kresliť strom", "kresliť mapu", "kresliť portrét", "kresliť vesmír", "kresliť vtipný symbol"],
  ["fotografovať krajinu", "fotografovať kvety", "fotografovať mesto", "fotografovať zviera", "fotografovať obľúbené miesto", "fotografovať výlet", "fotografovať jedlo", "fotografovať dážď", "fotografovať architektúru", "fotografovať zaujímavý detail"],
  ["variť polievku", "variť cestoviny", "pripraviť palacinky", "piecť koláč", "pripraviť šalát", "robiť domácu pizzu", "pripraviť sendvič", "piecť sušienky", "robiť limonádu", "pripraviť raňajky"],
  ["pestovať bylinky", "pestovať paradajky", "polievať kvety", "presádzať rastlinu", "stavať vtáčiu búdku", "hrabať lístie", "sadiť tulipány", "pozorovať motýle", "zbierať šišky", "robiť piknik v záhrade"],
  ["spievať obľúbenú pieseň", "tancovať bez hudby", "učiť sa nový tanec", "hrať na gitare", "hrať na klavíri", "vymýšľať melódiu", "počúvať koncert", "písať krátku báseň", "vymýšľať rap", "tlieskať do rytmu"],
  ["jazdiť na bicykli", "behať v parku", "plávať v bazéne", "cvičiť jogu", "hrať tenis", "hrať futbal", "korčuľovať", "ísť na turistiku", "skákať cez švihadlo", "hrať basketbal"],
  ["skladať puzzle", "stavať stavebnicu", "vyrábať pohľadnicu", "robiť papierové lietadlo", "skladať origami", "maľovať kamienok", "vyrábať náramok", "zdobiť rámik", "opravovať drobnosť", "vyrábať darček"],
  ["učiť sa nové slovíčko", "učiť sa kúzelnícky trik", "učiť sa rýchlo počítať", "učiť sa hrať šach", "učiť sa kresliť", "učiť sa piecť", "učiť sa tancovať", "učiť sa fotografovať", "učiť sa skladať puzzle", "učiť sa viazať uzol"],
  ["plánovať výlet", "baliť kufor", "čítať mapu", "vyberať suvenír", "hľadať dobrú reštauráciu", "navštevovať múzeum", "prechádzať sa pri jazere", "stanovať", "sledovať vlaky", "objavovať nové mesto"],
  ["kresliť psa", "kresliť sovu", "pozorovať rybičky", "pozorovať vtáky", "fotografovať psa vonku", "kresliť papagája", "fotografovať králika", "čítať o koňoch", "čítať o zvieratách", "pozorovať ježka"],
  ["usporiadať filmový večer", "pripraviť narodeninovú oslavu", "vybrať darček", "zdobiť stromček", "plánovať piknik", "robiť rodinný obed", "organizovať herný večer", "vymýšľať prekvapenie", "písať pozvánku", "fotografovať výzdobu oslavy"],
  ["vyberať oblečenie", "skúšať klobúk", "čistiť tenisky", "skladať bielizeň", "hľadať pohodlný sveter", "vyberať farbu trička", "baliť ruksak", "organizovať skriňu", "vyberať slnečné okuliare", "vymýšľať vtipný kostým"],
  ["upratovať izbu", "umývať riad", "ustielať posteľ", "triediť knihy", "utierať stôl", "organizovať poličku", "hľadať stratenú vec", "zdobiť izbu", "triediť drobnosti", "chystať stôl"],
  ["písať správu", "naplánovať videohovor", "hľadať novú aplikáciu", "upravovať fotografiu", "vymýšľať emoji", "organizovať súbory", "nahrávať krátke video", "počúvať podcast", "nastavovať budík", "hľadať novú hru"],
  ["vymýšľať vtip", "písať krátku historku", "písať milé prianie", "písať zaujímavú otázku", "vymýšľať prezývku", "riešiť hádanku", "písať pohľadnicu", "vymýšľať malé prekvapenie", "robiť malú radosť", "plánovať deň pre seba"],
  ["pozorovať oblohu", "pozorovať dážď", "hľadať zaujímavý tvar v oblakoch", "stavať snehuliaka", "zbierať listy", "čítať o prírode", "pozorovať mraky", "sedieť pri táboráku", "fotografovať oblohu", "prechádzať sa v snehu"],
  ["spomínať na detstvo", "prezerať staré fotografie", "písať denník", "plánovať sen", "učiť sa nový koníček", "hľadať inšpiráciu", "robiť niečo prvýkrát", "vymýšľať budúci výlet", "oslavovať malý úspech", "chodiť na krátku prechádzku"],
];

const WYR_PAIR_FORMS = [
  (activity: string): WouldRatherPair => ({ a: `${activity} každý deň`, b: `${activity} iba cez víkend` }),
  (activity: string): WouldRatherPair => ({ a: `${activity} osamote`, b: `${activity} s najlepšími priateľmi` }),
  (activity: string): WouldRatherPair => ({ a: `${activity} skoro ráno`, b: `${activity} neskoro večer` }),
  (activity: string): WouldRatherPair => ({ a: `${activity} úplne spontánne`, b: `${activity} podľa dokonalého plánu` }),
  (activity: string): WouldRatherPair => ({ a: `${activity} iba pätnásť minút`, b: `${activity} celé popoludnie` }),
  (activity: string): WouldRatherPair => ({ a: `${activity} na obľúbenom mieste`, b: `${activity} na úplne novom mieste` }),
  (activity: string): WouldRatherPair => ({ a: `${activity} hneď teraz`, b: `${activity} až o mesiac` }),
  (activity: string): WouldRatherPair => ({ a: `${activity} len raz, ale dokonale`, b: `${activity} často, ale jednoducho` }),
  (activity: string): WouldRatherPair => ({ a: `${activity} ako prvý/á v skupine`, b: `${activity} až po pozorovaní ostatných` }),
  (activity: string): WouldRatherPair => ({ a: `${activity} a mať na to fotografiu`, b: `${activity} a nechať si len spomienku` }),
] as const;

export const WOULD_YOU_RATHER = exactUnique(
  "Would You Rather catalogue",
  flattenGroups(WYR_ACTIVITY_GROUPS).flatMap((activity) => WYR_PAIR_FORMS.map((form) => form(activity))),
  (card) => `${card.a}|${card.b}`,
);
