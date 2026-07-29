type WouldRatherPair = { a: string; b: string };

type StringGroup = readonly [string, ...string[]];

function flattenGroups(groups: readonly StringGroup[]) {
  const items = groups.flat();
  if (groups.length !== 20 || groups.some((group) => group.length !== 10) || items.length !== 200) {
    throw new Error("Prompt catalogue groups must contain exactly 20 groups of 10 items.");
  }
  return items;
}

function exactUnique<T>(label: string, items: T[], key: (item: T) => string) {
  if (items.length !== 2000 || new Set(items.map(key)).size !== 2000) {
    throw new Error(`${label} must contain exactly 2,000 unique cards.`);
  }
  return items;
}

// ── Pravda ──────────────────────────────────────────────────────────────────
// Each question is built around a familiar situation and is intentionally light,
// conversational, and suitable for a mixed group of friends or family.
const TRUTH_SUBJECT_GROUPS: readonly StringGroup[] = [
  ["rannom vstávaní", "meškaní na autobus", "hľadaní stratených kľúčov", "varení večere", "upratovaní izby", "nakupovaní potravín", "čakaní v rade", "ceste domov", "plánovaní víkendu", "balení na výlet"],
  ["prvom dni v škole", "písaní testu", "odpovedaní pred triedou", "školskom výlete", "skupinovom projekte", "zabudnutej domácej úlohe", "obľúbenom predmete", "školskej prestávke", "vysvedčení", "poslednom zvonení"],
  ["prvom pracovnom dni", "dôležitom e-maile", "pracovnej porade", "telefonáte so zákazníkom", "nečakanej úlohe", "prestávke na kávu", "pracovnom pohovore", "odovzdávaní projektu", "spolupráci v tíme", "odchode z práce"],
  ["varení bez receptu", "ochutnávaní nového jedla", "objednávke v reštaurácii", "pečení koláča", "príprave raňajok", "rodinnom obede", "poslednom kúsku pizze", "nakupovaní sladkostí", "kuchynskom neporiadku", "večeri s priateľmi"],
  ["ceste vlakom", "dlhom lete", "výlete do hôr", "návšteve nového mesta", "hľadaní správnej cesty", "balení kufra", "dovolenke pri vode", "stanovaní", "cestovaní s priateľmi", "fotografovaní na výlete"],
  ["najlepšom kamarátovi alebo najlepšej kamarátke", "spoločnom vtipe", "prvom stretnutí", "zabudnutých narodeninách", "nečakanom komplimente", "spoločnom výlete", "skupinovom chate", "dlhom telefonáte", "spoločnej fotografii", "spontánnom pláne"],
  ["pozeraní filmu doma", "obľúbenom seriáli", "napínavom finále", "filmovej postave", "smiešnej scéne", "kine s priateľmi", "maratóne seriálov", "filmovom traileri", "knihe pred spaním", "obľúbenom príbehu"],
  ["počúvaní hudby", "spievaní v aute", "tancovaní bez hudby", "obľúbenej piesni", "koncerte", "hudobnom nástroji", "náhodnej melódii", "spoločnom spievaní", "hudobnom videu", "pesničke z detstva"],
  ["mobilnom telefóne", "zabudnutom hesle", "novej aplikácii", "skupinovom čete", "smiešnej fotografii", "videohovore", "vybitej batérii", "pomalom internete", "online nákupe", "hernej konzole"],
  ["domácom zvierati", "stretnutí so psom", "mačke susedov", "zvierati v zoo", "vtipnom videu so zvieraťom", "pozorovaní vtákov", "štekajúcom psovi", "milom škrečkovi", "prekvapivom zvierati", "zvuku zvieraťa"],
  ["jarnom dni", "letnej búrke", "prvom snehu", "jesennom daždi", "horúcom počasí", "zimnej prechádzke", "dúhe", "silnom vetre", "výlete do prírody", "západe slnka"],
  ["narodeninovej oslave", "otváraní darčeka", "rodinnej návšteve", "silvestrovskej párty", "vianočnom stromčeku", "prekvapení pre niekoho", "spoločnej večeri", "oslavnej torte", "prípitku", "fotografii z oslavy"],
  ["výbere oblečenia", "novom účese", "obľúbených topánkach", "zabudnutom dáždniku", "taške plnej vecí", "slnečných okuliaroch", "oblečení na oslavu", "nakupovaní v zľave", "zrkadle pred odchodom", "najpohodlnejšom oblečení"],
  ["futbalovom zápase", "plávaní", "jazde na bicykli", "behaní", "stolovej hre", "šachovej partii", "videohre", "kvíze", "súťaži s priateľmi", "výhre na poslednú chvíľu"],
  ["kreslení obrázka", "fotografovaní", "písaní príbehu", "skladaní puzzle", "učení sa nového triku", "pečení pre druhých", "pestovaní rastliny", "výrobe darčeka", "zdobení izby", "kreatívnom nápade"],
  ["smiešnom omyle", "zlej predpovedi", "nečakanom telefonáte", "zabudnutom mene", "trápnom tichu", "náhodnom stretnutí", "zle pochopenom vtipe", "zmätenej správe", "nečakanom daždi", "pokazenom pláne"],
  ["prvej spomienke z detstva", "obľúbenej hračke", "rodinnej tradícii", "starom albume", "rozprávke z detstva", "letných prázdninách", "školskej taške", "najlepšej detskej oslave", "vôni z detstva", "tajnom mieste z detstva"],
  ["tajnom talente", "neobvyklom zvyku", "najlepšom nápade", "malom úspechu", "zvládnutej výzve", "veci, na ktorú si hrdý/á", "niečom, čo sa chceš naučiť", "sne do budúcnosti", "odvážnom rozhodnutí", "drobnosti, ktorá ti zlepšila deň"],
  ["sobotnom ráne", "nedeľnom večeri", "nečakanom voľne", "pláne bez telefónu", "daždivej nedeli", "dlhej prechádzke", "lenivom popoludní", "domácom filmovom večeri", "spontánnom výlete", "najlepšom víkende"],
  ["vtipnej historke", "milom komplimente", "nečakanom úsmeve", "malom prekvapení", "spoločnom smiechu", "dobrom skutku", "zaujímavej otázke", "rozhovore pri stole", "najlepšej rade", "drobnej radosti"],
];

const TRUTH_QUESTION_FORMS = [
  (subject: string) => `Čo sa ti pri „${subject}“ vybaví ako prvé?`,
  (subject: string) => `Čo ťa pri „${subject}“ najviac pobavilo?`,
  (subject: string) => `Ktorý detail pri „${subject}“ si najľahšie zapamätáš?`,
  (subject: string) => `Čo sa ti pri „${subject}“ už nečakane podarilo?`,
  (subject: string) => `Čo by si pri „${subject}“ nabudúce urobil/a inak?`,
  (subject: string) => `Čo ťa pri „${subject}“ najviac zaujalo?`,
  (subject: string) => `Čo ťa pri „${subject}“ najviac prekvapilo?`,
  (subject: string) => `Čo si pri „${subject}“ dlho neuvedomoval/a?`,
  (subject: string) => `Čo ti pri „${subject}“ vie zlepšiť deň?`,
  (subject: string) => `Akú radu by si pri „${subject}“ dal/a svojmu mladšiemu ja?`,
] as const;

export const TRUTHS = exactUnique(
  "Truth catalogue",
  flattenGroups(TRUTH_SUBJECT_GROUPS).flatMap((subject) => TRUTH_QUESTION_FORMS.map((form) => form(subject))),
  (card) => card,
);

// ── Výzva ──────────────────────────────────────────────────────────────────
// The challenges remain playful, in-room, and opt-in. They never ask players to
// contact strangers, share personal data, or attempt risky physical tasks.
const DARE_SUBJECT_GROUPS: readonly StringGroup[] = [
  ["mačka", "pes", "žirafa", "tučniak", "sova", "motýľ", "slon", "delfín", "ježko", "papagáj"],
  ["pizza", "palacinka", "zmrzlina", "hamburger", "čokoláda", "koláč", "polievka", "sendvič", "jahoda", "citrón"],
  ["vlak", "lietadlo", "autobus", "bicykel", "loď", "taxík", "kolobežka", "raketa", "lanovka", "skúter"],
  ["kniha", "pero", "zošit", "budík", "kľúč", "dáždnik", "baterka", "fotoaparát", "hodinky", "ruksak"],
  ["hasič", "kuchár", "učiteľ", "detektív", "pilot", "záhradník", "fotograf", "astronaut", "kúzelník", "moderátor"],
  ["hrad", "pláž", "kaviareň", "zoo", "kino", "knižnica", "stanica", "múzeum", "park", "reštaurácia"],
  ["futbal", "hokej", "tenis", "plávanie", "šach", "basketbal", "joga", "bowling", "volejbal", "cyklistika"],
  ["gitara", "klavír", "bubon", "mikrofón", "pieseň", "tanec", "koncert", "refrén", "rytmus", "melódia"],
  ["robot", "drak", "jednorožec", "pirát", "princezná", "mimozemšťan", "superhrdina", "detektívka", "poklad", "čarovná palička"],
  ["ranné vstávanie", "zabudnuté heslo", "meškajúci autobus", "stratené kľúče", "prázdna chladnička", "pokazený budík", "náhodná správa", "dlhý rad", "zlá predpoveď", "nečakaná návšteva"],
  ["leto", "zima", "prvý sneh", "letná búrka", "dúha", "silný vietor", "západ slnka", "hviezdna noc", "ranná hmla", "horúci deň"],
  ["narodeniny", "darček", "torta", "sviečka", "balón", "spoločná fotografia", "rodinný obed", "silvestrovská párty", "vianočný stromček", "prekvapenie"],
  ["mobil", "slúchadlá", "počítač", "klávesnica", "herná konzola", "video", "emoji", "skupinový chat", "fotografia", "nabíjačka"],
  ["školský výlet", "domáca úloha", "pracovná porada", "prestávka na kávu", "skupinový projekt", "test", "prezentácia", "školská lavica", "pracovný e-mail", "predpoveď počasia"],
  ["kresba", "puzzle", "recept", "rastlina", "stavebnica", "papierové lietadlo", "obrázok", "vtip", "báseň", "slogan"],
  ["kocúr v čižmách", "zmrzlinový hrad", "lietajúci kufor", "spievajúci kaktus", "tancujúca lyžica", "veselý budík", "dračia knižnica", "robotický kuchár", "tajný ostrov", "smiešna koruna"],
  ["výlet do hôr", "stanovanie", "piknik", "cesta vlakom", "mapa", "kompas", "cestovný kufor", "fotka z dovolenky", "most", "táborák"],
  ["domáce zviera", "obľúbený film", "najlepšia hra", "najlepší kamarát", "víkendový plán", "spoločný smiech", "malá výhra", "tajný talent", "dobrý nápad", "milá spomienka"],
  ["modrá farba", "červený klobúk", "zelený strom", "žlté slnko", "fialový dáždnik", "oranžová mačka", "ružový koláč", "strieborná hviezda", "zlatý kľúč", "dúhový balón"],
  ["sused", "brat alebo sestra", "spolužiak alebo spolužiačka", "kolega alebo kolegyňa", "rodič", "starý rodič", "kamarát", "kamarátka", "trieda", "celá skupina"],
];

const DARE_FORMS = [
  (subject: string) => `Predveď desaťsekundovú pantomímu na tému „${subject}“.`,
  (subject: string) => `Vymysli krátky reklamný slogan na tému „${subject}“.`,
  (subject: string) => `Nakresli bez zdvihnutia pera jednoduchý symbol na tému „${subject}“.`,
  (subject: string) => `Zarecituj trojriadkovú rýmovačku na tému „${subject}“.`,
  (subject: string) => `Vysvetli tému „${subject}“ hlasom športového komentátora.`,
  (subject: string) => `Vytvor pätnásťsekundovú televíznu reklamu na tému „${subject}“.`,
  (subject: string) => `Vymysli tajnú superschopnosť na tému „${subject}“.`,
  (subject: string) => `Predveď bez slov svoju prvú reakciu na tému „${subject}“.`,
  (subject: string) => `Povedz tri smiešne pravidlá na tému „${subject}“.`,
  (subject: string) => `Zatancuj pätnásť sekúnd v rytme, ktorý ti pripomína tému „${subject}“.`,
] as const;

export const DARES = exactUnique(
  "Dare catalogue",
  flattenGroups(DARE_SUBJECT_GROUPS).flatMap((subject) => DARE_FORMS.map((form) => form(subject))),
  (card) => card,
);

// ── Radšej by som ───────────────────────────────────────────────────────────
// All scenarios are ordinary hobbies and leisure activities. Each pair compares
// two fair, playful ways of enjoying the same activity.
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
