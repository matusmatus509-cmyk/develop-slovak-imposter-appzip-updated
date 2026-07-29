export type CharadesDifficulty = "lahke" | "stredne" | "tazke";

/**
 * Katalóg výhradne pre Slovné šarády.
 *
 * Pravidlá pre každú vstavanú kartu:
 * - najviac tri slová,
 * - žiadne dvojbodky, náhodné scény ani nesúvisiace kombinácie,
 * - ľahké = konkrétne veci, stredné = bežné činnosti a situácie,
 * - ťažké = pojmy, emócie a známe ustálené spojenia.
 */
const SCENE_VERBS = new Set([
  "beží", "bolí", "čaká", "číta", "drží", "hľadá", "hrá", "ide", "je", "kráča", "kreslí", "kupuje",
  "letí", "maľuje", "nesie", "opravuje", "pije", "píše", "plače", "pláva", "sedí", "skáče", "smeje",
  "spieva", "spí", "stojí", "tancuje", "varí", "vidí", "volá", "umýva", "uteká", "zatvára", "otvára",
]);

/**
 * Vlastná šaráda môže byť vec, osoba, miesto, krátka činnosť alebo ustálené
 * spojenie — nie veta/scéna. Napríklad „Umývanie riadu“ je správne, zatiaľ čo
 * „Kuchár hľadá kľúče“ sa odmietne aj napriek tomu, že má iba tri slová.
 */
export function isValidCharadeText(value: string) {
  const text = value.trim().replace(/\s+/g, " ");
  const words = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [];
  const hasFiniteVerb = words.some((word) => SCENE_VERBS.has(word.toLocaleLowerCase("sk")));
  return Boolean(text) && words.length >= 1 && words.length <= 3 && !hasFiniteVerb && !/[:;|]/.test(text);
}

function phrases(prefix: string, endings: readonly string[]) {
  return endings.map((ending) => `${prefix} ${ending}`);
}

function uniqueCards(cards: readonly string[]) {
  const seen = new Set<string>();
  return cards
    .map((card) => card.trim().replace(/\s+/g, " "))
    .filter((card) => {
      const key = card.toLocaleLowerCase("sk");
      if (!isValidCharadeText(card) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

const EASY_CONCRETE = [
  // Zvieratá
  "Pes", "Mačka", "Kôň", "Krava", "Ovca", "Koza", "Prasa", "Sliepka", "Kačka", "Hus",
  "Kohút", "Zajac", "Králik", "Myš", "Škrečok", "Morča", "Ježko", "Veverička", "Líška", "Vlk",
  "Medveď", "Lev", "Tiger", "Slon", "Žirafa", "Zebra", "Opica", "Gorila", "Panda", "Kengura",
  "Delfín", "Veľryba", "Žralok", "Tuleň", "Korytnačka", "Krokodíl", "Žaba", "Had", "Papagáj", "Sova",
  "Vrabec", "Holub", "Orol", "Páv", "Bocian", "Motýľ", "Včela", "Lienka", "Mravec", "Pavúk",
  "Ryba", "Kapor", "Losos", "Krab", "Mucha", "Komár", "Slimák", "Jašterica", "Chameleón", "Netopier",

  // Jedlo a pitie
  "Jablko", "Hruška", "Banán", "Pomaranč", "Citrón", "Melón", "Jahoda", "Malina", "Čerešňa", "Slivka",
  "Broskyňa", "Ananás", "Mango", "Kiwi", "Hrozno", "Mrkva", "Paradajka", "Paprika", "Uhorka", "Cibuľa",
  "Cesnak", "Zemiak", "Tekvica", "Kapusta", "Brokolica", "Kukurica", "Hrášok", "Chlieb", "Rožok", "Syr",
  "Maslo", "Med", "Džem", "Pizza", "Koláč", "Torta", "Palacinka", "Zmrzlina", "Čokoláda", "Hamburger",
  "Halušky", "Polievka", "Guláš", "Rezeň", "Šalát", "Jogurt", "Káva", "Čaj", "Džús", "Voda",

  // Domácnosť a škola
  "Stolička", "Stôl", "Posteľ", "Sedačka", "Kreslo", "Skriňa", "Komoda", "Polička", "Lampa", "Zrkadlo",
  "Vankúš", "Deka", "Koberec", "Záclona", "Dvere", "Okno", "Kľúč", "Zámok", "Schody", "Balkón",
  "Pohár", "Tanier", "Miska", "Lyžica", "Vidlička", "Nôž", "Hrniec", "Panvica", "Varecha", "Kanvica",
  "Metla", "Mop", "Vedro", "Špongia", "Mydlo", "Šampón", "Hrebeň", "Fén", "Uterák", "Zubná kefka",
  "Kniha", "Zošit", "Ceruzka", "Pero", "Guma", "Pravítko", "Nožnice", "Lepidlo", "Mapa", "Kalkulačka",

  // Doprava, šport, príroda a povolania
  "Auto", "Bicykel", "Vlak", "Autobus", "Motorka", "Lietadlo", "Loď", "Traktor", "Taxík", "Sanitka",
  "Električka", "Metro", "Lanovka", "Ponorka", "Kajak", "Padák", "Balón", "Kolobežka", "Helikoptéra", "Karavan",
  "Lopta", "Hokejka", "Raketa", "Korčule", "Lyže", "Snowboard", "Sánky", "Švihadlo", "Medaila", "Trofej",
  "Futbal", "Hokej", "Tenis", "Plávanie", "Beh", "Box", "Golf", "Šach", "Bowling", "Joga",
  "Strom", "Kvet", "Tráva", "List", "Les", "Rieka", "Jazero", "Hora", "Dúha", "Snehuliak",
  "Lekár", "Učiteľ", "Kuchár", "Hasič", "Policajt", "Pekár", "Poštár", "Čašník", "Farmár", "Zubár",
  "Kaderník", "Maliar", "Fotograf", "Herec", "Spevák", "Tanečník", "Klaun", "Pilot", "Rybár", "Veterinár",
] as const;

// Všetky podstatné mená sú mužského rodu. Preto sú aj prídavné mená vždy
// gramaticky správne a výsledok zostáva bežnou, ľahko vysvetliteľnou vecou.
const EASY_MASCULINE_OBJECTS = [
  "bicykel", "batoh", "balón", "dáždnik", "kufor", "vankúš", "stôl", "hrniec", "tanier", "pohár",
  "telefón", "počítač", "zošit", "zošit", "kľúč", "zámok", "traktor", "autobus", "vlak", "dom",
  "hrad", "strom", "kvet", "pes", "kôň", "medveď", "lev", "slon", "robot", "snehuliak",
  "klobúk", "kabát", "sveter", "darček", "koláč", "sendvič", "fotoaparát", "mikrofón", "bubon", "klavír",
  "futbal", "hokej", "skateboard", "stan", "spací vak", "rebrík", "kočík", "košík", "vysávač", "budík",
] as const;
const EASY_DESCRIPTORS = ["červený", "modrý", "zelený", "žltý", "čierny", "biely", "malý", "veľký", "nový", "starý"] as const;

const MEDIUM_ACTIVITY_GROUPS: ReadonlyArray<readonly [string, readonly string[]]> = [
  ["Varenie", ["obeda", "večere", "polievky", "cestovín", "ryže", "vajec", "kávy", "čaju", "omáčky", "gulášu"]],
  ["Pečenie", ["koláča", "torty", "pizze", "chleba", "bábovky", "medovníkov", "palaciniek", "sušienok", "muffinov", "rožkov"]],
  ["Krájanie", ["cibule", "zeleniny", "chleba", "syra", "koláča", "mäsa", "ovocia", "papriky", "mrkvy", "zemiakov"]],
  ["Umývanie", ["riadu", "okien", "auta", "vlasov", "rúk", "zrkadla", "podlahy", "zeleniny", "topánok", "bicykla"]],
  ["Čistenie", ["zubov", "izby", "topánok", "akvária", "koberca", "sporáka", "kúpeľne", "chladničky", "stola", "terasy"]],
  ["Hľadanie", ["kľúčov", "mobilu", "peňaženky", "okuliarov", "auta", "práce", "receptu", "cesty", "adresy", "parkovania"]],
  ["Balenie", ["darčeka", "kufra", "desiaty", "nákupu", "balíka", "obeda", "oblečenia", "batoha", "sťahovania", "objednávky"]],
  ["Otváranie", ["darčeka", "dverí", "okna", "fľaše", "konzervy", "balíka", "pošty", "peňaženky", "kufra", "skrinky"]],
  ["Nosenie", ["nákupu", "kufra", "dieťaťa", "batoha", "dáždniku", "okuliarov", "kabáta", "krabice", "tašky", "vedierka"]],
  ["Oprava", ["auta", "bicykla", "mobilu", "počítača", "práčky", "dverí", "strechy", "stoličky", "lampy", "vysávača"]],
  ["Maľovanie", ["steny", "izby", "obrazu", "plotu", "nechtov", "domu", "stropu", "dverí", "kresby", "kvetov"]],
  ["Skladanie", ["nábytku", "prádla", "stanu", "puzzle", "detskej postele", "krabice", "skrine", "stola", "hračiek", "bicykla"]],
  ["Písanie", ["správy", "listu", "úlohy", "zoznamu", "receptu", "denníka", "pohľadnice", "životopisu", "poznámky", "priania"]],
  ["Čítanie", ["knihy", "novín", "receptu", "správy", "mapy", "návodu", "časopisu", "listu", "rozprávky", "e-mailu"]],
  ["Fotografovanie", ["rodiny", "prírody", "jedla", "západu slnka", "psa", "bábätka", "svadby", "výletu", "kvetov", "mesta"]],
  ["Venčenie", ["psa", "šteniatka", "labradora", "jazvečíka", "pudla", "boxera", "ovčiaka", "retrievera", "terriera", "psíka"]],
  ["Kŕmenie", ["mačky", "psa", "rybičiek", "papagája", "králika", "bábätka", "kačiek", "sliepok", "morčaťa", "koňa"]],
  ["Polievanie", ["kvetov", "záhrady", "trávnika", "stromov", "byliniek", "paradajok", "papriky", "balkóna", "skleníka", "zeleniny"]],
  ["Sadenie", ["kvetov", "stromu", "cesnaku", "cibule", "zemiakov", "jahôd", "byliniek", "paradajok", "papriky", "tulipánov"]],
  ["Cvičenie", ["jogy", "brucha", "drepov", "rúk", "nôh", "chrbta", "rovnováhy", "strečingu", "pilatesu", "kondície"]],
  ["Hranie", ["futbalu", "hokeja", "tenisu", "šachu", "kariet", "gitary", "klavíra", "florbal", "volejbalu", "basketbalu"]],
  ["Jazda", ["autobusom", "vlakom", "taxíkom", "bicyklom", "motorkou", "autom", "lanovkou", "výťahom", "metrom", "električkou"]],
  ["Cesta", ["vlakom", "lietadlom", "autobusom", "autom", "loďou", "taxíkom", "metrom", "bicyklom", "trajektom", "lanovkou"]],
  ["Čakanie", ["na autobus", "na vlak", "na lekára", "na taxík", "na jedlo", "na balík", "na výťah", "na kamaráta", "na výsledok", "na kávu"]],
  ["Návšteva", ["lekára", "zubára", "rodiny", "kamarátov", "knižnice", "múzea", "zoo", "obchodu", "pošty", "úradu"]],
  ["Výmena", ["pneumatiky", "žiarovky", "batérie", "oleja", "plienky", "posteľnej bielizne", "hesla", "obliečky", "kolesa", "filtra"]],
  ["Strihanie", ["vlasov", "papiera", "nechtov", "trávnika", "látky", "konárov", "živého plota", "pásky", "fotky", "účesu"]],
  ["Upratovanie", ["izby", "kuchyne", "kúpeľne", "garáže", "pivnice", "balkóna", "auta", "skrine", "stola", "chodby"]],
  ["Objednávanie", ["jedla", "pizze", "taxíka", "kávy", "knihy", "oblečenia", "lístka", "hotela", "darčeka", "kvetov"]],
  ["Nakupovanie", ["potravín", "oblečenia", "darčekov", "topánok", "nábytku", "kníh", "liekov", "hračiek", "kvetov", "pečiva"]],
];

const MEDIUM_EVERYDAY = [
  "Pokazený mobil", "Stratený kufor", "Zmeškaný autobus", "Plný nákupný vozík", "Dlhý rad", "Zabudnutá peňaženka",
  "Vybitý telefón", "Prasknuté zrkadlo", "Rozliata káva", "Pripálený obed", "Studená polievka", "Horúci čaj",
  "Zamrznuté okno", "Otvorený dáždnik", "Prázdna chladnička", "Plná práčka", "Vytečená práčka", "Zabuchnuté dvere",
  "Prasknutá žiarovka", "Pokazený výťah", "Vypnutý internet", "Pomalý počítač", "Plná schránka", "Tichý telefón",
  "Rodinná oslava", "Nedeľný obed", "Detská párty", "Školský výlet", "Pracovná porada", "Prvý pracovný deň",
  "Ranná zápcha", "Pracovný pohovor", "Školská skúška", "Triedne stretnutie", "Letná dovolenka", "Zimná dovolenka",
  "Narodeninová torta", "Svadobný tanec", "Vianočný stromček", "Veľkonočné vajíčko", "Novoročný prípitok", "Karnevalová maska",
  "Futbalový zápas", "Hokejový zápas", "Tenisový zápas", "Školský zvonček", "Hudobný koncert", "Filmová premiéra",
  "Dopravná nehoda", "Dopravná značka", "Parkovací automat", "Čerpacia stanica", "Autobusová zastávka", "Železničná stanica",
  "Letisková kontrola", "Hotelová recepcia", "Plážový slnečník", "Pieskový hrad", "Lyžiarsky vlek", "Sánkovanie z kopca",
  "Kúpanie psa", "Výcvik psa", "Návšteva veterinára", "Čistenie akvária", "Stavanie búdky", "Jazda na koni",
  "Futbalový rozhodca", "Hokejový brankár", "Tenisové podanie", "Basketbalový kôš", "Volejbalový blok", "Bowlingový strike",
  "Kúzelnícke predstavenie", "Bábkové divadlo", "Tanečný súboj", "Hra na gitare", "Hra na klavíri", "Spievanie karaoke",
  "Táborový oheň", "Stavanie stanu", "Spací vak", "Turistická mapa", "Horská chata", "Prechod potoka",
  "Domáca úloha", "Písomná skúška", "Čítanie nahlas", "Krieda na tabuli", "Školská jedáleň", "Telesná výchova",
  "Kancelárska tlačiareň", "Videohovor bez zvuku", "Prestávka na kávu", "Písanie životopisu", "Podpis zmluvy", "Firemný večierok",
  "Skúšanie oblečenia", "Zľavový kupón", "Nákupná taška", "Pokladničný blok", "Platobná karta", "Otvorené trhovisko",
  "Meranie teploty", "Horký liek", "Obväzovanie rany", "Vyšetrenie zraku", "Čakanie u zubára", "Zubná prehliadka",
  "Skladanie puzzle", "Detské ihrisko", "Hojdačka v parku", "Jazda kolotočom", "Kŕmenie kačiek", "Prechádzka lesom",
  "Nočná lampa", "Ranný budík", "Večerné správy", "Rodinná fotografia", "Domáci miláčik", "Kuchynský stôl",
] as const;

const MEDIUM_ROLES = [
  "Lekár v ambulancii", "Učiteľ v triede", "Kuchár v kuchyni", "Hasič pri zásahu", "Policajt v službe",
  "Poštár s balíkom", "Čašník s táckou", "Pekár s chlebom", "Farmár na poli", "Zubár v ordinácii",
  "Kaderník v salóne", "Maliar pri stene", "Fotograf s kamerou", "Pilot v lietadle", "Rybár pri jazere",
  "Veterinár so psom", "Mechanik pri aute", "Vodič autobusu", "Predavač v obchode", "Plavčík pri bazéne",
  "Tréner na ihrisku", "Knihovník s knihou", "Smetiar pri koši", "Kuriér s balíkom", "Stolár s doskou",
  "Murár pri stene", "Záhradník s lopatou", "Elektrikár pri zásuvke", "Hudobník s gitarou", "Herec na javisku",
] as const;

const MEDIUM_CONTEXT_GROUPS: ReadonlyArray<readonly [string, readonly string[]]> = [
  ["Príprava na", ["raňajky", "obed", "večeru", "výlet", "školu", "prácu", "oslavu", "tréning", "návštevu", "cestu"]],
  ["Odchod do", ["školy", "práce", "obchodu", "mesta", "kina", "divadla", "zoo", "nemocnice", "knižnice", "parku"]],
  ["Návrat z", ["práce", "školy", "obchodu", "výletu", "nemocnice", "kina", "dovolenky", "tréningu", "nákupu", "letiska"]],
  ["Prechádzka so", ["psom", "sestrou", "bratom", "kamarátom", "mamou", "otcom", "dieťaťom", "kočíkom", "dáždnikom", "slúchadlami"]],
  ["Rozhovor s", ["kamarátom", "mamou", "otcom", "učiteľom", "lekárom", "šéfom", "trénérom", "predavačom", "poštárom", "susedom"]],
  ["Pomoc pri", ["varení", "učení", "upratovaní", "balení", "sťahovaní", "nákupoch", "oprave", "maľovaní", "sadení", "cvičení"]],
  ["Učenie sa", ["jazykov", "tanca", "šoférovania", "varenia", "plávania", "kreslenia", "spevu", "matematiky", "hry", "korčuľovania"]],
  ["Hra s", ["loptou", "mačkou", "psom", "bábikou", "autíčkom", "kockami", "kartami", "bratom", "dieťaťom", "loptou"]],
  ["Výlet na", ["hrad", "farmu", "chatu", "hory", "pláž", "jazero", "trh", "štadión", "festival", "zámok"]],
  ["Pobyt v", ["hoteli", "tábore", "nemocnici", "škole", "knižnici", "múzeu", "divadle", "reštaurácii", "obchode", "zoo"]],
  ["Práca na", ["záhrade", "počítači", "stavbe", "projekte", "aute", "bicykli", "streche", "recepte", "úlohe", "obrázku"]],
  ["Kontrola", ["lístka", "dokladov", "oleja", "pneumatík", "domácej úlohy", "teploty", "správy", "objednávky", "adresy", "účtu"]],
  ["Dohoda o", ["stretnutí", "výlete", "obede", "nákupoch", "oslave", "termíne", "pomoci", "ceste", "hre", "práci"]],
  ["Starostlivosť o", ["dieťa", "psa", "mačku", "záhradu", "auto", "dom", "bábätko", "rybičky", "rastliny", "zdravie"]],
  ["Cesta cez", ["mesto", "les", "most", "tunel", "park", "dedinu", "námestie", "pole", "hranicu", "záhradu"]],
  ["Sedenie pri", ["stole", "okne", "ohni", "počítači", "televízore", "bazéne", "jazere", "strome", "káve", "obede"]],
  ["Beh cez", ["park", "les", "ihrisko", "cieľ", "mesto", "lúku", "most", "chodbu", "záhradu", "štadión"]],
  ["Skok cez", ["kaluž", "lano", "prekážku", "plot", "švihadlo", "pneumatiku", "potok", "sneh", "tieň", "čiaru"]],
  ["Triedenie", ["odpadu", "prádla", "fotiek", "hračiek", "papiera", "kníh", "oblečenia", "nákupu", "pošty", "náradia"]],
  ["Plánovanie", ["výletu", "oslavy", "nákupu", "dovolenky", "obeda", "trasy", "rozpočtu", "tréningu", "stretnutia", "víkendu"]],
] as const;

const HARD_CONCEPTS = [
  "Dôvera", "Nedôvera", "Odvaha", "Strach", "Radosť", "Smútok", "Hnev", "Žiarlivosť", "Závisť", "Vďačnosť",
  "Odpustenie", "Súcit", "Empatia", "Trpezlivosť", "Netrpezlivosť", "Zodpovednosť", "Spravodlivosť", "Sloboda", "Úprimnosť", "Pokora",
  "Skromnosť", "Márnivosť", "Čestnosť", "Vernosť", "Zrada", "Rešpekt", "Hanba", "Hrdosť", "Vina", "Nevinnosť",
  "Panika", "Úľava", "Napätie", "Pokoj", "Chaos", "Zmätenosť", "Samota", "Osamelosť", "Nádej", "Beznádej",
  "Motivácia", "Inšpirácia", "Frustrácia", "Vytrvalosť", "Lenivosť", "Disciplína", "Tolerancia", "Intuícia", "Ambícia", "Nostalgia",
  "Pochybnosť", "Zvedavosť", "Predsudok", "Svedomie", "Sebaúcta", "Sebavedomie", "Zmysel", "Rovnováha", "Harmónia", "Konflikt",
  "Kompromis", "Spolupráca", "Priateľstvo", "Láska", "Sľub", "Tajomstvo", "Rozhodnutie", "Príležitosť", "Prekážka", "Výzva",
  "Zmena", "Pokrok", "Neúspech", "Úspech", "Omyl", "Chyba", "Riziko", "Dôsledok", "Návyk", "Spomienka",
  "Budúcnosť", "Minulosť", "Prítomnosť", "Identita", "Dôstojnosť", "Súkromie", "Bezpečie", "Istota", "Neistota", "Záväzok",
  "Kritika", "Pochvala", "Podpora", "Pomoc", "Odmietnutie", "Zmierenie", "Rozlúčka", "Očakávanie", "Prekvapenie", "Skúsenosť",
] as const;

const HARD_IDIOMS = [
  "Kameň úrazu", "Bod zlomu", "Slepá ulička", "Čierna ovca", "Jablko sváru", "Zakopaný pes",
  "Pandorina skrinka", "Damoklov meč", "Trojský kôň", "Gordický uzol", "Ariadnina niť", "Achillova päta",
  "Medvedia služba", "Pyrrhovo víťazstvo", "Danajský dar", "Kolumbovo vajce", "Sizyfovská práca", "Labutia pieseň",
  "Krokodílie slzy", "Vlčí hlad", "Tichá voda", "Červená niť", "Druhá šanca", "Posledná kvapka",
  "Prvý dojem", "Dvojitá hra", "Falošný poplach", "Tajný plán", "Skrytý dôvod", "Veľké tajomstvo",
  "Ťažké rozhodnutie", "Náhla zmena", "Vážny problém", "Tichá domácnosť", "Rodinný konflikt", "Pracovný stres",
  "Strata dôvery", "Strata času", "Strata smeru", "Strata pamäti", "Hľadanie pravdy", "Hľadanie zmyslu",
  "Vnútorný pokoj", "Vnútorný konflikt", "Verejný názor", "Osobný priestor", "Spoločný cieľ", "Skrytý talent",
  "Čisté svedomie", "Falošný úsmev", "Tajná dohoda", "Verejné priznanie", "Tichý súhlas", "Silná vôľa",
  "Zdravý rozum", "Správny smer", "Nový začiatok", "Životná zmena", "Veľký sen", "Dlhá cesta",
] as const;

const HARD_CONTEXT_GROUPS: ReadonlyArray<readonly [string, readonly string[]]> = [
  ["Strata", ["dôvery", "práce", "peňazí", "času", "priateľa", "telefónu", "smeru", "pamäti", "trpezlivosti", "istoty"]],
  ["Hľadanie", ["zmyslu", "práce", "pravdy", "pokoja", "riešenia", "domova", "odpovede", "rovnováhy", "spravodlivosti", "príležitosti"]],
  ["Budovanie", ["dôvery", "vzťahu", "kariéry", "rodiny", "budúcnosti", "priateľstva", "tímu", "sebadôvery", "návyku", "domova"]],
  ["Prekonanie", ["strachu", "stresu", "prekážky", "krízy", "únavy", "neistoty", "hanby", "hnevu", "bolesti", "výzvy"]],
  ["Prijatie", ["zmeny", "chyby", "kritiky", "porážky", "pomoci", "reality", "rozhodnutia", "zodpovednosti", "minulosti", "pravdy"]],
  ["Udržanie", ["tajomstva", "rovnováhy", "pokoja", "sľubu", "priateľstva", "pozornosti", "nádeje", "disciplíny", "dôvery", "hraníc"]],
  ["Obrana", ["názoru", "priateľa", "rodiny", "pravdy", "slobody", "súkromia", "domova", "hraníc", "dôstojnosti", "prírody"]],
  ["Zmena", ["plánov", "práce", "školy", "mesta", "názoru", "života", "návyku", "smeru", "pravidiel", "budúcnosti"]],
  ["Riešenie", ["problému", "konfliktu", "sporu", "krízy", "chyby", "dlhu", "nedorozumenia", "otázky", "výzvy", "situácie"]],
  ["Rozvoj", ["talentu", "vzťahu", "dieťaťa", "tímu", "firmy", "kariéry", "schopností", "nápadu", "záujmu", "osobnosti"]],
  ["Ochrana", ["rodiny", "detí", "prírody", "zdravia", "súkromia", "domova", "majetku", "dôstojnosti", "slobody", "zvierat"]],
  ["Získanie", ["odvahy", "dôvery", "práce", "podpory", "skúsenosti", "nadhľadu", "slobody", "pokoja", "uznania", "rešpektu"]],
  ["Vyjadrenie", ["názoru", "emócie", "vďaky", "kritiky", "súcitu", "radosti", "hnevu", "obavy", "podpory", "lásky"]],
  ["Dodržanie", ["sľubu", "pravidiel", "termínu", "dohody", "plánu", "rozpočtu", "poriadku", "zákona", "hraníc", "záväzku"]],
  ["Zdieľanie", ["radosti", "starosti", "tajomstva", "nápadu", "spomienky", "zodpovednosti", "úspechu", "skúsenosti", "názoru", "pomoci"]],
  ["Návrat", ["domov", "do práce", "do školy", "k rodine", "k priateľom", "k športu", "k pokoju", "k prírode", "k sebe", "k plánu"]],
  ["Prvý", ["krok", "úspech", "neúspech", "pokus", "deň", "dojem", "plat", "výlet", "bozk", "zápas"]],
  ["Posledný", ["pokus", "termín", "deň", "zápas", "list", "telefonát", "krok", "vlak", "darček", "úsmev"]],
  ["Spoločná", ["dohoda", "cesta", "práca", "radosť", "spomienka", "oslava", "večera", "fotografia", "hra", "budúcnosť"]],
  ["Osobná", ["voľba", "hranica", "zmena", "skúsenosť", "výzva", "zodpovednosť", "sloboda", "kríza", "hodnota", "spomienka"]],
] as const;

const HARD_LIFE_GROUPS: ReadonlyArray<readonly [string, readonly string[]]> = [
  ["Rozhovor o", ["budúcnosti", "vzťahu", "práci", "rodine", "zdraví", "škole", "peniazoch", "probléme", "zmene", "snoch"]],
  ["Debata o", ["pravde", "slobode", "spravodlivosti", "rodine", "práci", "zdraví", "škole", "budúcnosti", "peniazoch", "prírode"]],
  ["Obava z", ["budúcnosti", "chyby", "neúspechu", "zmeny", "samoty", "straty", "odmietnutia", "choroby", "tmy", "rizika"]],
  ["Radosť z", ["úspechu", "pomoci", "výletu", "rodiny", "práce", "darčeka", "zmeny", "pokroku", "víťazstva", "stretnutia"]],
  ["Skúsenosť s", ["prácou", "deťmi", "cestovaním", "učením", "pomocou", "chorobou", "výhrou", "prehrou", "rizikom", "chybou"]],
  ["Vzťah k", ["rodine", "práci", "prírode", "peniazom", "škole", "zdraviu", "tradícii", "hudbe", "športu", "mestu"]],
  ["Názor na", ["prácu", "školu", "rodinu", "peniaze", "budúcnosť", "zdravie", "šport", "hudbu", "prírodu", "zmenu"]],
  ["Právo na", ["odpočinok", "pomoc", "súkromie", "chybu", "názor", "radosť", "bezpečie", "vzdelanie", "zdravie", "slobodu"]],
  ["Potreba", ["pokoja", "pomoci", "zmeny", "odpočinku", "podpory", "istoty", "slobody", "blízkosti", "poriadku", "uznania"]],
  ["Túžba po", ["slobode", "pokoji", "úspechu", "domove", "rodine", "uznaní", "zmene", "ceste", "poznaní", "rovnováhe"]],
  ["Dôvera v", ["rodinu", "priateľa", "seba", "tím", "budúcnosť", "pomoc", "zmenu", "spravodlivosť", "plán", "úspech"]],
  ["Podpora pre", ["rodinu", "priateľa", "dieťa", "tím", "školu", "prácu", "zmenu", "sen", "nápad", "rozhodnutie"]],
  ["Úcta k", ["rodičom", "práci", "prírode", "pravde", "tradícii", "histórii", "životu", "zdraviu", "rodine", "názoru"]],
  ["Rešpekt k", ["ľuďom", "pravidlám", "prírode", "práci", "rodine", "názoru", "času", "zdraviu", "hraniciam", "zákonu"]],
  ["Nádej na", ["zmenu", "pomoc", "úspech", "pokoj", "návrat", "výhru", "odpoveď", "riešenie", "lepší deň", "budúcnosť"]],
  ["Príležitosť na", ["zmenu", "pomoc", "rast", "úspech", "návrat", "oddych", "učenie", "prácu", "cestu", "rozhovor"]],
  ["Zodpovednosť za", ["rodinu", "prácu", "chybu", "zdravie", "domov", "peniaze", "rozhodnutie", "tím", "budúcnosť", "dieťa"]],
  ["Reakcia na", ["problém", "prosbu", "správu", "kritiku", "ponuku", "chybu", "zmenu", "výzvu", "spor", "otázku"]],
  ["Otázka o", ["živote", "práci", "vzťahu", "budúcnosti", "rodine", "zdraví", "škole", "peniazoch", "zmene", "snoch"]],
  ["Rozhodnutie o", ["práci", "škole", "ceste", "rodine", "peniazoch", "budúcnosti", "zmene", "pomoci", "zdraví", "bývaní"]],
  ["Záujem o", ["prácu", "šport", "hudbu", "prírodu", "zdravie", "knihy", "históriu", "cestovanie", "učenie", "rodinu"]],
  ["Spomienka na", ["detstvo", "rodinu", "školu", "výlet", "priateľa", "domov", "oslavu", "prácu", "leto", "zimu"]],
  ["Plán na", ["víkend", "výlet", "zmenu", "prácu", "školu", "dovolenku", "nákup", "oslavu", "budúcnosť", "pomoc"]],
  ["Dôvod na", ["zmenu", "pomoc", "odchod", "návrat", "radosť", "obavu", "prácu", "oddych", "cestu", "rozhovor"]],
  ["Záväzok voči", ["rodine", "práci", "tímu", "priateľovi", "deťom", "sebe", "spoločnosti", "škole", "domovu", "prírode"]],
] as const;

const TARGETS: Record<CharadesDifficulty, number> = { lahke: 667, stredne: 667, tazke: 666 };

function assembleTier(difficulty: CharadesDifficulty, cards: readonly string[], used: Set<string>) {
  const tier = uniqueCards(cards).filter((card) => {
    const key = card.toLocaleLowerCase("sk");
    if (used.has(key)) return false;
    used.add(key);
    return true;
  });
  const target = TARGETS[difficulty];
  if (tier.length < target) throw new Error(`Nedostatok kariet pre šarády: ${difficulty} (${tier.length}/${target})`);
  return tier.slice(0, target);
}

const EASY_CANDIDATES = [
  ...EASY_CONCRETE,
  ...EASY_DESCRIPTORS.flatMap((descriptor) => phrases(descriptor, EASY_MASCULINE_OBJECTS)),
];

const MEDIUM_CANDIDATES = [
  ...MEDIUM_ACTIVITY_GROUPS.flatMap(([prefix, endings]) => phrases(prefix, endings)),
  ...MEDIUM_CONTEXT_GROUPS.flatMap(([prefix, endings]) => phrases(prefix, endings)),
  ...MEDIUM_EVERYDAY,
  ...MEDIUM_ROLES,
  ...phrases("Rodinný", ["výlet", "obed", "piknik", "film", "večer", "nákup", "portrét", "recept", "album", "dom"]),
  ...phrases("Školský", ["projekt", "výlet", "zápisník", "časopis", "rozhovor", "turnaj", "ples", "obraz", "výkon", "poklad"]),
  ...phrases("Pracovný", ["stôl", "kalendár", "telefón", "e-mail", "zošit", "plán", "úbor", "súbor", "tím", "deň"]),
  ...phrases("Náročný", ["deň", "výlet", "tréning", "rozhovor", "nákup", "projekt", "presun", "zápas", "výstup", "návrat"]),
  ...phrases("Večerný", ["film", "kúpeľ", "čaj", "beh", "výlet", "nákup", "program", "telefonát", "tréning", "odpočinok"]),
  ...phrases("Ranný", ["budík", "beh", "čaj", "nákup", "vlak", "autobus", "telefonát", "program", "tréning", "odchod"]),
];

const HARD_CANDIDATES = [
  ...HARD_CONCEPTS,
  ...HARD_IDIOMS,
  ...HARD_CONTEXT_GROUPS.flatMap(([prefix, endings]) => phrases(prefix, endings)),
  ...HARD_LIFE_GROUPS.flatMap(([prefix, endings]) => phrases(prefix, endings)),
  ...phrases("Silná", ["dôvera", "vôľa", "emócia", "podpora", "motivácia", "spomienka", "priateľka", "rodina", "osobnosť", "skúsenosť"]),
  ...phrases("Veľká", ["zmena", "výzva", "príležitosť", "zodpovednosť", "radosť", "obava", "strata", "pomoc", "nádej", "chyba"]),
  ...phrases("Tichá", ["radosť", "bolesť", "podpora", "prosba", "spomienka", "dohoda", "obava", "zmena", "kríza", "nádej"]),
  ...phrases("Nečakaná", ["správa", "pomoc", "zmena", "návšteva", "ponuka", "výhra", "prehra", "chyba", "otázka", "odpoveď"]),
  ...phrases("Dlhodobá", ["dôvera", "snaha", "práca", "bolesť", "zmena", "podpora", "spolupráca", "pamäť", "skúsenosť", "zodpovednosť"]),
  ...phrases("Vážna", ["dohoda", "otázka", "chyba", "kríza", "správa", "obava", "choroba", "skúška", "porada", "voľba"]),
  ...phrases("Skrytá", ["obava", "pravda", "chyba", "túžba", "podpora", "správa", "nádej", "kríza", "závisť", "motivácia"]),
  ...phrases("Úprimné", ["ospravedlnenie", "priznanie", "poďakovanie", "želanie", "priateľstvo", "rozhodnutie", "gesto", "slovo", "objatie", "hodnotenie"]),
  ...phrases("Správne", ["rozhodnutie", "riešenie", "načasovanie", "slovo", "správanie", "miesto", "tempo", "otázka", "odpoveď", "smer"]),
];

const globallyUsed = new Set<string>();
export const SOLO_CHARADES_WORDS: Record<CharadesDifficulty, string[]> = {
  lahke: assembleTier("lahke", EASY_CANDIDATES, globallyUsed),
  stredne: assembleTier("stredne", MEDIUM_CANDIDATES, globallyUsed),
  tazke: assembleTier("tazke", HARD_CANDIDATES, globallyUsed),
};

// Zachovávame verejné exporty staršieho TeamBattle kódu, ale už obsahujú
// presne ten istý overený katalóg ako samostatné šarády.
export const TEAM_CHARADES_WORDS: Record<CharadesDifficulty, string[]> = {
  lahke: [...SOLO_CHARADES_WORDS.lahke],
  stredne: [...SOLO_CHARADES_WORDS.stredne],
  tazke: [...SOLO_CHARADES_WORDS.tazke],
};

export const ALL_SOLO_CHARADES_WORDS = Object.values(SOLO_CHARADES_WORDS).flat();
export const ALL_TEAM_CHARADES_WORDS = Object.values(TEAM_CHARADES_WORDS).flat();
