// Deterministic content expansion shared by the minigame databases.
// Every combination is stable, so persistent decks can safely identify seen cards.

const PROMPT_TOPICS = [
  "priateľstvo", "rodina", "škola", "práca", "dovolenka", "cestovanie", "detstvo", "budúcnosť",
  "láska", "odvaha", "strach", "úspech", "neúspech", "peniaze", "jedlo", "šport",
  "hudba", "filmy", "knihy", "internet", "sociálne siete", "mobil", "móda", "zdravie",
  "príroda", "zvieratá", "oslavy", "Vianoce", "leto", "zima", "víkend", "ranné vstávanie",
  "varenie", "upratovanie", "nakupovanie", "verejná doprava", "rande", "susedia", "tajomstvá", "sny",
  "zlozvyky", "talenty", "trápne chvíle", "prekvapenia", "súťaženie", "tímová práca", "rozhodovanie", "dobrodružstvo",
];

const TRUTH_TEMPLATES = [
  (topic: string) => `Aký je tvoj najúprimnejší názor na tému ${topic}?`,
  (topic: string) => `Čo by si na téme ${topic} najradšej zmenil/a?`,
  (topic: string) => `Aká je tvoja najlepšia spomienka spojená s témou ${topic}?`,
  (topic: string) => `Aká je tvoja najtrápnejšia skúsenosť spojená s témou ${topic}?`,
  (topic: string) => `Čoho sa pri téme ${topic} najviac obávaš?`,
  (topic: string) => `Na čo si pri téme ${topic} najviac hrdý/á?`,
  (topic: string) => `Komu by si ako prvému zavolal/a kvôli téme ${topic}?`,
  (topic: string) => `Aké tajomstvo o téme ${topic} si dlho nikomu nepovedal/a?`,
  (topic: string) => `Kedy si naposledy klamal/a kvôli téme ${topic}?`,
  (topic: string) => `Akú chybu spojenú s témou ${topic} by si už nezopakoval/a?`,
  (topic: string) => `Čo ti pri téme ${topic} ide najhoršie?`,
  (topic: string) => `Čo ti pri téme ${topic} ide najlepšie?`,
  (topic: string) => `Koho v tejto miestnosti ti najviac pripomína téma ${topic}?`,
  (topic: string) => `Čo najodvážnejšie si urobil/a v súvislosti s témou ${topic}?`,
  (topic: string) => `Aký predsudok si kedysi mal/a o téme ${topic}?`,
  (topic: string) => `Čo predstieraš, že vieš o téme ${topic}?`,
  (topic: string) => `Aké rozhodnutie o téme ${topic} najviac ľutuješ?`,
  (topic: string) => `Za čo si pri téme ${topic} minul/a najviac peňazí?`,
  (topic: string) => `Aký zvyk spojený s témou ${topic} pred ostatnými skrývaš?`,
  (topic: string) => `Čo by si pri téme ${topic} skúsil/a, keby ťa nikto nesúdil?`,
  (topic: string) => `Ktorú radu o téme ${topic} si ignoroval/a?`,
  (topic: string) => `Kto ťa najviac ovplyvnil v názore na tému ${topic}?`,
  (topic: string) => `Čo o téme ${topic} na tebe ľudia často nechápu?`,
  (topic: string) => `Akú jednu pravdu o téme ${topic} si nechceš priznať?`,
];

const DARE_TEMPLATES = [
  "zahraj krátku reklamu", "vymysli trojriadkovú báseň", "predveď televízneho moderátora", "zaspievaj improvizovaný refrén",
  "urob desaťsekundovú pantomímu", "porozprávaj dramatický príbeh", "napodobni prísneho učiteľa", "predveď športového komentátora",
  "vymysli nový slogan", "zatancuj bez hudby", "hovor dvadsať sekúnd ako robot", "vysvetli tému iba gestami",
  "predveď scénu zo seriálu", "urob víťazný prejav", "zahraj nahnevaného zákazníka", "vymysli krátku rozprávku",
  "predveď telefonický rozhovor", "urob zvukovú imitáciu", "zahraj tlačovú konferenciu", "predveď spomalený film",
  "vymysli tri rýmy", "urob módnu prehliadku", "zahraj prekvapeného reportéra", "predveď motivačného trénera",
];

// Pozor: veta sa skladá ako „Nikdy som nikdy <šablóna> pri téme <téma>.“,
// takže šablóny musia byť už v zápornej forme a bez pomocného „som“.
const NEVER_TEMPLATES = [
  "nepredstieral/a, že tomu rozumiem", "nemeškal/a kvôli tomu", "neklamal/a o tom", "nemal/a kvôli tomu trápny moment",
  "neminul/a na to priveľa peňazí", "netajil/a to pred rodinou", "nezačal/a kvôli tomu hádku", "nezaspal/a pri tom",
  "neodfotil/a to", "nezdieľal/a to na internete", "nerobil/a to naoko", "nevybuchol/a pri tom do smiechu",
  "nezmenil/a kvôli tomu plán", "neskúsil/a to bez prípravy", "nerozbil/a pri tom niečo", "nevolal/a kvôli tomu kamarátovi",
  "nepožičal/a si kvôli tomu peniaze", "nepísal/a kvôli tomu ospravedlnenie", "nerobil/a to uprostred noci", "nestratil/a pri tom orientáciu",
  "nevzdal/a to príliš skoro", "neprekvapil/a tým niekoho", "nerobil/a to iba zo zvedavosti", "netvrdil/a, že to bol môj nápad",
];

const RATHER_TEMPLATES = [
  ["byť v téme najlepší/ia", "mať pri téme najviac šťastia"], ["poznať o téme celú pravdu", "nikdy o téme nič nevedieť"],
  ["venovať téme celý rok", "už sa téme nikdy nevenovať"], ["riešiť tému sám/sama", "riešiť tému s veľkým tímom"],
  ["mať pri téme neobmedzený čas", "mať pri téme neobmedzené peniaze"], ["urobiť pri téme jednu veľkú chybu", "urobiť pri téme sto malých chýb"],
  ["byť pri téme vždy úprimný/á", "vedieť pri téme vždy odhaliť lož"], ["zažiť pri téme minulosť", "vidieť pri téme budúcnosť"],
  ["mať pri téme slávu", "mať pri téme pokoj"], ["získať pri téme talent", "získať pri téme skúsenosti"],
  ["začať tému od začiatku", "preskočiť pri téme rovno na koniec"], ["všetko o téme hovoriť nahlas", "o téme už nikdy nehovoriť"],
  ["byť pri téme odvážny/á", "byť pri téme dokonale pripravený/á"], ["mať pri téme dokonalú pamäť", "vedieť pri téme zabudnúť na chyby"],
  ["vyhrať pri téme podvodom", "prehrať pri téme čestne"], ["mať pri téme jednu vernú podporu", "mať pri téme tisíc fanúšikov"],
  ["poznať pri téme každú odpoveď", "vedieť položiť pri téme najlepšiu otázku"], ["robiť tému iba ráno", "robiť tému iba v noci"],
  ["zdieľať pri téme každý úspech", "nikdy neukázať pri téme žiadny výsledok"], ["mať pri téme jasné pravidlá", "mať pri téme úplnú slobodu"],
  ["zažiť pri téme veľké dobrodružstvo", "mať pri téme úplnú istotu"], ["byť pri téme rýchly/á", "byť pri téme vždy presný/á"],
  ["učiť pri téme ostatných", "učiť sa pri téme od najlepších"], ["urobiť pri téme odvážne rozhodnutie", "počkať pri téme na ideálnu chvíľu"],
];

export const GENERATED_TRUTHS = PROMPT_TOPICS.flatMap((topic) => TRUTH_TEMPLATES.map((template) => template(topic)));
export const GENERATED_DARES = PROMPT_TOPICS.flatMap((topic) => DARE_TEMPLATES.map((template) => `${template} na tému „${topic}“.`));
export const GENERATED_NEVER = PROMPT_TOPICS.flatMap((topic) => NEVER_TEMPLATES.map((template) => `Nikdy som nikdy ${template} pri téme ${topic}.`));
// Téma sa vkladá priamo do vety (v úvodzovkách), aby na karte nikdy nevznikla
// dvojica oddelená dvojbodkou typu „byť v téme najlepší: šport“.
// Hranice slova riešime cez Unicode triedy — `\b` v JS nepozná slovenskú diakritiku.
const TOPIC_SLOT = /(^|[^\p{L}\p{N}])(tém(?:a|e|u|ou|y))(?![\p{L}\p{N}])/u;

function withTopic(text: string, topic: string) {
  if (TOPIC_SLOT.test(text)) {
    return text.replace(TOPIC_SLOT, (_match, prefix: string, word: string) => `${prefix}${word} „${topic}“`);
  }
  return `${text} (téma „${topic}“)`;
}

export const GENERATED_RATHER = PROMPT_TOPICS.flatMap((topic) =>
  RATHER_TEMPLATES.map(([a, b]) => ({ a: withTopic(a, topic), b: withTopic(b, topic) })),
);

const CHARACTER_ROLES = [
  "detektív", "lekárka", "pilot", "vedkyňa", "kuchár", "učiteľka", "hasič", "novinárka", "astronaut", "archeologička",
  "hudobník", "maliarka", "športovec", "režisérka", "fotograf", "programátorka", "záchranár", "architektka", "farmár", "veterinárka",
  "kúzelník", "kráľovná", "rytier", "pirátka", "objaviteľ", "vynálezkyňa", "cestovateľ", "diplomatka", "sudca", "advokátka",
  "mechanik", "kapitánka", "policajt", "knihovníčka", "botanik", "meteorologička", "geológ", "biologička", "historik", "psychologička",
  "tanečník", "speváčka", "komik", "moderátorka", "tréner", "horolezkyňa", "námorník", "záhradníčka", "pekár", "dizajnérka",
  "robot", "mimozemšťanka", "superhrdina", "čarodejnica", "upír", "víla", "škriatok", "strážkyňa", "dobrodruh", "tajná agentka",
];
const CHARACTER_WORLDS = [
  "stredovekého mesta", "vesmírnej stanice", "tropického ostrova", "tajného laboratória", "horského hotela", "veľkého cirkusu",
  "podmorského kráľovstva", "filmového štúdia", "olympijskej dediny", "polárnej výpravy", "starovekého Egypta", "divokého západu",
  "budúcnosti", "čarovného lesa", "strašidelného hradu", "rušného letiska", "luxusnej lode", "malej dediny",
  "veľkomesta", "hudobného festivalu", "školského internátu", "záchrannej misie", "kráľovského dvora", "pirátskej posádky",
  "džungľovej expedície", "vedeckej konferencie", "televíznej súťaže", "detektívneho príbehu", "superhrdinského tímu", "rozprávkového sveta",
];
export const GENERATED_CHARACTER_CARDS = CHARACTER_ROLES.flatMap((role) => CHARACTER_WORLDS.map((world) => `${role} z ${world}`));

const DRAW_SUBJECTS = [
  "pes", "mačka", "slon", "žirafa", "tučniak", "delfín", "medveď", "líška", "sova", "korytnačka",
  "robot", "astronaut", "pirát", "princezná", "rytier", "čarodejnica", "drak", "jednorožec", "mimozemšťan", "superhrdina",
  "auto", "vlak", "lietadlo", "loď", "bicykel", "traktor", "ponorka", "helikoptéra", "raketa", "karavan",
  "dom", "hrad", "maják", "stan", "škola", "nemocnica", "kaviareň", "múzeum", "divadlo", "štadión",
  "jablko", "pizza", "torta", "zmrzlina", "hamburger", "palacinka", "melón", "špagety", "šiška", "sendvič",
  "gitara", "klavír", "bubon", "husle", "mikrofón", "fotoaparát", "počítač", "telefón", "hodiny", "dáždnik",
  "futbalová lopta", "tenisová raketa", "hokejka", "lyže", "korčule", "medaila", "trofej", "šachovnica", "surf", "kajak",
  "strom", "kvet", "sopka", "vodopád", "ostrov", "dúha", "mesiac", "hviezda", "oblak", "snehuliak",
];
const DRAW_SCENES = [
  "na pláži", "v daždi", "pod hviezdami", "na vrchole hory", "uprostred mesta", "v čarovnom lese", "na opustenom ostrove",
  "vo vesmíre", "pod vodou", "na snehu", "pri západe slnka", "na narodeninovej oslave", "v škole", "na štadióne",
  "v kuchyni", "na lodi", "pri táboráku", "v zoologickej záhrade", "v rozprávke", "v budúcnosti",
  "s korunou", "s veľkým klobúkom", "s balónmi", "so slnečnými okuliarmi", "vedľa pokladu",
];
export const GENERATED_DRAWING_PAIRS = DRAW_SUBJECTS.flatMap((subject) => DRAW_SCENES.map((scene) => ({ word: `${subject} ${scene}`, hint: "" })));

// ── Pantomíma a šarády ───────────────────────────────────────────────────────
// Karty sa skladajú ako „<podmet v nominatíve> <predložkové spojenie>“, takže
// každá kombinácia je gramaticky správna a zmysluplná scéna, ktorú sa dá
// predviesť alebo opísať. Nikdy nevznikne nezmysel typu „Šoférovanie: snehuliak“.
const MIME_EASY_SUBJECTS = [
  "Pes", "Mačka", "Sliepka", "Kôň", "Krava", "Ovca", "Myš", "Zajac", "Medveď", "Opica",
  "Lev", "Tiger", "Slon", "Žirafa", "Tučniak", "Žaba", "Papagáj", "Sova", "Korytnačka", "Delfín",
  "Hasič", "Policajt", "Lekár", "Učiteľ", "Kuchár", "Pekár", "Poštár", "Čašník", "Šofér autobusu", "Predavač",
  "Futbalista", "Hokejista", "Plavec", "Bežec", "Tanečník", "Spevák", "Klaun", "Kúzelník", "Robot", "Bábätko",
];
const MIME_EASY_SITUATIONS = [
  "na pláži", "v dažďi", "na snehu", "v škole", "v kuchyni", "v posteli", "na bicykli", "vo vlaku",
  "v autobuse", "na ihrisku", "v obchode", "v lese", "na kopci", "pri jazere", "v aute", "na ceste",
  "v telocvični", "na diskotéke", "na oslave", "pri raňajkách", "pri obede", "vo výťahu", "na kolotoči", "v kine",
  "u zubára", "na letisku", "v zoo", "na trhu", "v knižnici", "na štadióne", "v bazéne", "v tme",
  "vo vesmíre",
];
const MIME_MEDIUM_SUBJECTS = [
  "Nervózny šofér", "Unavený učiteľ", "Prísna zdravotná sestra", "Nešikovný kuchár", "Zmätený turista", "Neposedný školák",
  "Prekvapený fotograf", "Vystresovaný manažér", "Roztržitý vedec", "Namyslený spevák", "Vyplašená mačka", "Hladný medveď",
  "Zvedavá opica", "Lenivý pes", "Rozčúlený tréner", "Pomalý poštár", "Precízny hodinár", "Zamilovaný čašník",
  "Netrpezlivý taxikár", "Prísny sudca", "Ustarostená mamina", "Hrdý dedko", "Rozhodcov pomocník", "Neohrozený záchranár",
  "Začínajúci kaderník", "Skúsená horolezkyňa", "Prehnane veselý moderátor", "Tichý knihovník", "Vynervovaný pilot", "Šikovný mechanik",
  "Neúspešný kúzelník", "Prísny vrátnik", "Rozprávkový rytier", "Tajný agent", "Zmätený robot", "Vážne chorý herec",
  "Rozospatý strážnik", "Hyperaktívny animátor", "Prísny šéfkuchár", "Nešťastný futbalový fanúšik",
];
const MIME_MEDIUM_SITUATIONS = [
  "na prvom rande", "v dopravnej zápche", "počas búrky", "na svadbe", "pri sťahovaní", "na pracovnom pohovore",
  "v preplnenom vlaku", "pri skladaní nábytku", "na horskej turistike", "pri parkovaní", "v zubárskom kresle", "počas výpadku elektriny",
  "pri varení večere", "na letiskovej kontrole", "v šatni po zápase", "pri natáčaní videa", "na rodinnom obede", "pri veľkom nákupe",
  "počas online hovoru", "pri vypratávaní pivnice", "na silvestrovskej párty", "v čakárni u lekára", "pri kúpaní psa", "počas skúšky v škole",
  "v lunaparku", "pri hľadaní kľúčov", "v tichej knižnici", "pri stavaní stanu", "na detskej oslave", "počas dlhého letu",
  "pri maľovaní izby", "na zamrznutom jazere", "v uzavretom výťahu",
];
const MIME_HARD_SUBJECTS = [
  "Trpezlivosť", "Žiarlivosť", "Zvedavosť", "Odvaha", "Nervozita", "Nostalgia", "Hrdosť", "Ľútosť",
  "Podozrievavosť", "Nadšenie", "Sklamanie", "Úľava", "Panika", "Rozpaky", "Súcit", "Rivalita",
  "Nedôvera", "Vnútorný pokoj", "Zmätok", "Predstieraná radosť", "Skrývaný strach", "Tichý hnev", "Falošná skromnosť", "Nečakaná nádej",
  "Zbytočná výhovorka", "Trápne ticho", "Náhla inšpirácia", "Prehnané sebavedomie", "Úprimné ospravedlnenie", "Nezaslúžená pochvala",
  "Zle skrytá závisť", "Detská radosť", "Posledná šanca", "Zbabraný plán", "Ťažké rozhodnutie", "Nudná povinnosť",
  "Predčasná oslava", "Neochotná pomoc", "Zabudnutý sľub", "Nečakané odpustenie",
];
const MIME_HARD_SITUATIONS = [
  "pri odovzdávaní ceny", "na maturitnej skúške", "počas služobnej cesty", "pri strate mobilu", "na stretnutí po rokoch", "pri rodinnom fotení",
  "počas finálového zápasu", "na tlačovej konferencii", "pri žiadosti o zvýšenie platu", "v prvý deň v novej práci", "pri lúčení na letisku", "počas dlhého čakania",
  "pri odovzdávaní darčeka", "na spoločnom výlete", "pri poslednom pokuse", "počas dôležitého telefonátu", "pri návrate domov", "na verejnom vystúpení",
  "pri nečakanej návšteve", "počas spoločnej hry", "pri delení účtu", "na rušnej ulici", "pri neúspešnej oprave", "počas sťahovania do nového bytu",
  "pri prehratej súťaži", "na začiatku dovolenky", "pri hľadaní stratenej veci", "počas búrlivej diskusie", "pri hodnotení výsledkov", "na romantickej večeri",
  "pri chybnej odpovedi", "počas nočnej služby", "pri prvom tréningu",
];

/**
 * Kombinácie prekladáme (nie „všetky situácie pre prvý podmet, potom druhý“),
 * pretože balíky sa napĺňajú od začiatku zoznamu. Takto sa do hry dostanú
 * všetky postavy a hráč nedostane desiatky kariet s tým istým podmetom.
 * `shift` posúva párovanie, takže šarády a pantomíma nezačínajú rovnako.
 */
function crossScenes(subjects: string[], situations: string[], shift = 0) {
  const scenes: string[] = [];
  for (let round = 0; round < situations.length; round += 1) {
    subjects.forEach((subject, index) => {
      const situation = situations[(index + round + shift) % situations.length];
      scenes.push(`${subject} ${situation}`);
    });
  }
  return scenes;
}

export const GENERATED_PANTOMIME_BY_DIFFICULTY = {
  lahke: crossScenes(MIME_EASY_SUBJECTS, MIME_EASY_SITUATIONS),
  stredne: crossScenes(MIME_MEDIUM_SUBJECTS, MIME_MEDIUM_SITUATIONS),
  tazke: crossScenes(MIME_HARD_SUBJECTS, MIME_HARD_SITUATIONS),
};
export const GENERATED_CHARADES_BY_DIFFICULTY = {
  lahke: crossScenes(MIME_EASY_SUBJECTS, MIME_EASY_SITUATIONS, 17),
  stredne: crossScenes(MIME_MEDIUM_SUBJECTS, MIME_MEDIUM_SITUATIONS, 17),
  tazke: crossScenes(MIME_HARD_SUBJECTS, MIME_HARD_SITUATIONS, 17),
};

const FORBIDDEN_OBJECTS = [
  ["telefón", "volať", "technika"], ["bicykel", "pedále", "doprava"], ["kufor", "batožina", "cestovanie"], ["pizza", "syr", "jedlo"],
  ["mačka", "mňaukať", "zviera"], ["pes", "štekať", "zviera"], ["lietadlo", "pilot", "doprava"], ["vlak", "koľajnice", "doprava"],
  ["kniha", "čítať", "kultúra"], ["gitara", "struny", "hudba"], ["futbal", "lopta", "šport"], ["hokej", "puk", "šport"],
  ["kuchyňa", "variť", "domov"], ["škola", "učiť", "vzdelanie"], ["nemocnica", "lekár", "zdravie"], ["pláž", "piesok", "dovolenka"],
  ["snehuliak", "mrkva", "zima"], ["darček", "prekvapenie", "oslava"], ["torta", "sviečky", "oslava"], ["kvet", "rásť", "príroda"],
  ["robot", "stroj", "technika"], ["raketa", "vesmír", "technika"], ["fotoaparát", "snímka", "technika"], ["hodiny", "čas", "predmet"],
  ["dáždnik", "dážď", "predmet"], ["zrkadlo", "odraz", "predmet"], ["chladnička", "studený", "spotrebič"], ["vysávač", "prach", "spotrebič"],
  ["káva", "kofeín", "nápoj"], ["čokoláda", "kakao", "jedlo"], ["hamburger", "žemľa", "jedlo"], ["zmrzlina", "studená", "jedlo"],
  ["policajt", "zákon", "povolanie"], ["hasič", "oheň", "povolanie"], ["učiteľ", "žiak", "povolanie"], ["kuchár", "jedlo", "povolanie"],
  ["ostrov", "more", "miesto"], ["hrad", "kráľ", "miesto"], ["les", "stromy", "miesto"], ["letisko", "odlet", "miesto"],
] as const;
const FORBIDDEN_SITUATIONS = [
  ["počas búrky", "búrka"], ["na dovolenke", "dovolenka"], ["uprostred noci", "noc"], ["na oslave", "párty"],
  ["v škole", "trieda"], ["v práci", "zamestnanie"], ["na výlete", "cesta"], ["pri mori", "more"],
  ["v zime", "sneh"], ["v lete", "teplo"], ["v budúcnosti", "zajtra"], ["v minulosti", "včera"],
  ["bez elektriny", "prúd"], ["bez peňazí", "platiť"], ["bez internetu", "online"], ["s kamarátmi", "priateľ"],
  ["s rodinou", "príbuzní"], ["v tajnosti", "skrývať"], ["pred kamerou", "video"], ["na pódiu", "publikum"],
  ["v daždi", "mokro"], ["na slnku", "svetlo"], ["vo veľkom meste", "ulice"], ["na dedine", "obec"],
  ["v rozprávke", "príbeh"], ["vo vesmíre", "planéta"], ["pod vodou", "plávať"], ["na horách", "vrchol"],
  ["pri táboráku", "oheň"], ["na svadbe", "ženích"], ["na narodeninách", "vek"], ["počas Vianoc", "stromček"],
  ["cez víkend", "voľno"], ["ráno", "vstávať"], ["večer", "spať"], ["v televízii", "obrazovka"],
  ["v súťaži", "vyhrať"], ["v múzeu", "výstava"], ["na štadióne", "fanúšik"], ["v hoteli", "izba"],
] as const;
export const GENERATED_FORBIDDEN_CARDS = FORBIDDEN_OBJECTS.flatMap(([object, clue, category]) =>
  FORBIDDEN_SITUATIONS.map(([situation, situationClue]) => ({
    word: `${object} ${situation}`,
    forbidden: [object, clue, category, situationClue] as [string, string, string, string],
  })),
);

export interface GeneratedQuizQuestion {
  question: string;
  answer: string;
  category: string;
}
const ADDITION_QUESTIONS: GeneratedQuizQuestion[] = Array.from({ length: 50 }, (_, a) =>
  Array.from({ length: 50 }, (_, b) => ({ question: `Koľko je ${a + 11} + ${b + 7}?`, answer: String(a + b + 18), category: "🔢 Matematika" })),
).flat();
const SUBTRACTION_QUESTIONS: GeneratedQuizQuestion[] = Array.from({ length: 50 }, (_, a) =>
  Array.from({ length: 30 }, (_, b) => ({ question: `Koľko je ${a + b + 51} − ${b + 9}?`, answer: String(a + 42), category: "🔢 Matematika" })),
).flat();
const MULTIPLICATION_QUESTIONS: GeneratedQuizQuestion[] = Array.from({ length: 25 }, (_, a) =>
  Array.from({ length: 25 }, (_, b) => ({ question: `Koľko je ${a + 2} × ${b + 2}?`, answer: String((a + 2) * (b + 2)), category: "✖️ Násobenie" })),
).flat();
const DIVISION_QUESTIONS: GeneratedQuizQuestion[] = Array.from({ length: 40 }, (_, divisor) =>
  Array.from({ length: 20 }, (_, quotient) => ({ question: `Koľko je ${(divisor + 2) * (quotient + 2)} ÷ ${divisor + 2}?`, answer: String(quotient + 2), category: "➗ Delenie" })),
).flat();
export const GENERATED_QUIZ_QUESTIONS = [...ADDITION_QUESTIONS, ...SUBTRACTION_QUESTIONS, ...MULTIPLICATION_QUESTIONS, ...DIVISION_QUESTIONS];

const TONES = [
  ["veľmi hlboký", 110], ["hlboký", 131], ["basový", 147], ["temný", 165], ["pokojný", 196],
  ["nižší", 220], ["mäkký", 247], ["stredný", 262], ["jasný", 294], ["zvonivý", 330],
  ["vyšší", 349], ["čistý", 392], ["ostrý", 440], ["svetlý", 494], ["vysoký", 523],
  ["veľmi vysoký", 587], ["piskľavý", 659], ["prenikavý", 698], ["tenký", 784], ["najvyšší", 880],
] as const;
const RHYTHMS = [
  ["jeden krátky pulz", [0.2]], ["jeden dlhý pulz", [0.8]], ["dva rýchle pulzy", [0.18, 0.18]], ["dva dlhé pulzy", [0.55, 0.55]],
  ["tri rýchle pulzy", [0.15, 0.15, 0.15]], ["tri pomalé pulzy", [0.5, 0.5, 0.5]], ["štyri krátke pulzy", [0.14, 0.14, 0.14, 0.14]],
  ["krátky a dlhý pulz", [0.18, 0.7]], ["dlhý a krátky pulz", [0.7, 0.18]], ["dva krátke a jeden dlhý", [0.16, 0.16, 0.65]],
  ["jeden dlhý a dva krátke", [0.65, 0.16, 0.16]], ["päť rýchlych pulzov", [0.12, 0.12, 0.12, 0.12, 0.12]],
  ["stúpajúce tri pulzy", [0.2, 0.3, 0.4]], ["klesajúce tri pulzy", [0.4, 0.3, 0.2]], ["dvojitý signál", [0.3, 0.3]],
  ["výstražný trojitý signál", [0.25, 0.25, 0.6]], ["rýchla štvorica", [0.1, 0.1, 0.1, 0.1]], ["pomalá štvorica", [0.45, 0.45, 0.45, 0.45]],
  ["krátky, dlhý, krátky", [0.15, 0.65, 0.15]], ["dlhý, krátky, dlhý", [0.6, 0.15, 0.6]],
] as const;
export const GENERATED_SOUND_CLUES = TONES.flatMap(([toneLabel, frequency], toneIndex) => RHYTHMS.map(([rhythmLabel, durations], rhythmIndex) => ({
  id: `procedural-tone-${toneIndex + 1}-${rhythmIndex + 1}`,
  label: `${toneLabel} tón – ${rhythmLabel}`,
  emoji: "🎛️",
  audioUrl: "",
  sourcePage: "",
  credit: "Vytvorené priamo v aplikácii",
  license: "Vlastný procedurálny zvuk",
  tonePattern: durations.map((duration, index) => ({
    frequency: frequency * (rhythmLabel.includes("stúpajúce") ? 1 + index * 0.18 : rhythmLabel.includes("klesajúce") ? 1 - index * 0.12 : 1),
    duration,
    pause: 0.12,
  })),
})));

const EMOJI_SUBJECTS = [
  ["🐶", "pes"], ["🐱", "mačka"], ["🐘", "slon"], ["🦒", "žirafa"], ["🐧", "tučniak"], ["🐬", "delfín"], ["🦁", "lev"], ["🐻", "medveď"], ["🦊", "líška"], ["🦉", "sova"],
  ["🤖", "robot"], ["👨‍🚀", "astronaut"], ["🏴‍☠️", "pirát"], ["👸", "princezná"], ["🧙", "čarodejník"], ["🦸", "superhrdina"], ["🧛", "upír"], ["🧚", "víla"], ["👻", "duch"], ["🐉", "drak"],
  ["🚗", "auto"], ["🚂", "vlak"], ["✈️", "lietadlo"], ["🚢", "loď"], ["🚲", "bicykel"], ["🚀", "raketa"], ["🚁", "helikoptéra"], ["🚜", "traktor"], ["🛵", "skúter"], ["🛶", "kanoe"],
  ["🍎", "jablko"], ["🍕", "pizza"], ["🎂", "torta"], ["🍦", "zmrzlina"], ["🍔", "hamburger"], ["🥞", "palacinka"], ["🍉", "melón"], ["🍝", "špagety"], ["🍩", "šiška"], ["🥪", "sendvič"],
  ["⚽", "futbal"], ["🏀", "basketbal"], ["🎸", "gitara"], ["🎹", "klavír"], ["📱", "telefón"],
] as const;
const EMOJI_SCENES = [
  ["🏖️", "na pláži"], ["🌧️", "v daždi"], ["🌙", "v noci"], ["🏔️", "na horách"], ["🏙️", "vo veľkomeste"],
  ["🌲", "v lese"], ["🏝️", "na ostrove"], ["🌌", "vo vesmíre"], ["🌊", "pod vodou"], ["❄️", "v zime"],
  ["🌅", "pri západe slnka"], ["🎉", "na oslave"], ["🏫", "v škole"], ["🏟️", "na štadióne"], ["🍳", "v kuchyni"],
  ["🔥", "pri ohni"], ["🗺️", "na výlete"], ["👑", "s korunou"], ["🎩", "s klobúkom"], ["🎈", "s balónmi"],
  ["🕶️", "so slnečnými okuliarmi"], ["💎", "pri poklade"], ["🎁", "s darčekom"], ["🎵", "pri hudbe"], ["📸", "na fotografii"],
  ["⏰", "ráno"], ["🛏️", "pred spaním"], ["🛒", "na nákupe"], ["🏆", "po víťazstve"], ["❤️", "zaľúbený"],
] as const;
export const GENERATED_EMOJI_PUZZLES = EMOJI_SUBJECTS.flatMap(([subjectEmoji, subject]) => EMOJI_SCENES.map(([sceneEmoji, scene]) => ({
  emoji: `${subjectEmoji}${sceneEmoji}`,
  answer: `${subject} ${scene}`,
})));

export const GENERATED_LETTER_CATEGORIES = [
  "Vec na železničnej stanici", "Vec v hoteli", "Vec na festivale", "Vec v múzeu", "Vec v knižnici", "Vec v garáži",
  "Vec v pivnici", "Vec na balkóne", "Vec pri bazéne", "Vec v stane", "Vec na svadbe", "Vec na pracovnom pohovore",
  "Vec v divadle", "Vec v zoologickej záhrade", "Vec v kaderníctve", "Vec v lekárni", "Vec v pekárni", "Vec v posilňovni",
  "Slovo spojené s dažďom", "Slovo spojené s horami", "Slovo spojené s hudbou", "Slovo spojené s filmom", "Slovo spojené s varením",
  "Slovo spojené s internetom", "Slovo spojené s cestovaním", "Slovo spojené s oslavou", "Slovo spojené so školou", "Slovo spojené so športom",
  "Slovo spojené s prírodou", "Slovo spojené s budúcnosťou",
];

const IMPOSTOR_SUBJECTS = [
  ["pes", "zviera"], ["mačka", "zviera"], ["kôň", "zviera"], ["slon", "zviera"], ["žirafa", "zviera"], ["tučniak", "zviera"], ["delfín", "zviera"], ["lev", "zviera"], ["medveď", "zviera"], ["líška", "zviera"],
  ["pizza", "jedlo"], ["hamburger", "jedlo"], ["palacinka", "jedlo"], ["zmrzlina", "jedlo"], ["čokoláda", "jedlo"], ["jablko", "jedlo"], ["melón", "jedlo"], ["torta", "jedlo"], ["špagety", "jedlo"], ["sendvič", "jedlo"],
  ["auto", "doprava"], ["vlak", "doprava"], ["lietadlo", "doprava"], ["loď", "doprava"], ["bicykel", "doprava"], ["raketa", "doprava"], ["ponorka", "doprava"], ["helikoptéra", "doprava"], ["traktor", "doprava"], ["karavan", "doprava"],
  ["telefón", "technika"], ["počítač", "technika"], ["fotoaparát", "technika"], ["televízor", "technika"], ["slúchadlá", "technika"], ["robot", "technika"], ["hodinky", "technika"], ["projektor", "technika"], ["mikrofón", "technika"], ["tlačiareň", "technika"],
  ["futbal", "šport"], ["hokej", "šport"], ["tenis", "šport"], ["plávanie", "šport"], ["lyžovanie", "šport"], ["basketbal", "šport"], ["volejbal", "šport"], ["golf", "šport"], ["box", "šport"], ["cyklistika", "šport"],
  ["škola", "miesto"], ["nemocnica", "miesto"], ["hotel", "miesto"], ["letisko", "miesto"], ["múzeum", "miesto"], ["divadlo", "miesto"], ["kaviareň", "miesto"], ["štadión", "miesto"], ["hrad", "miesto"], ["ostrov", "miesto"],
  ["lekár", "povolanie"], ["učiteľ", "povolanie"], ["kuchár", "povolanie"], ["policajt", "povolanie"], ["hasič", "povolanie"], ["pilot", "povolanie"], ["herec", "povolanie"], ["spevák", "povolanie"], ["mechanik", "povolanie"], ["fotograf", "povolanie"],
  ["gitara", "hudba"], ["klavír", "hudba"], ["husle", "hudba"], ["bubon", "hudba"], ["saxofón", "hudba"], ["flauta", "hudba"], ["harfa", "hudba"], ["akordeón", "hudba"], ["trúbka", "hudba"], ["cimbal", "hudba"],
] as const;
const IMPOSTOR_CONTEXTS = [
  "na pláži", "v daždi", "uprostred noci", "na horách", "vo veľkomeste", "v lese", "na ostrove", "vo vesmíre", "pod vodou", "v zime",
  "pri západe slnka", "na oslave", "v škole", "na štadióne", "v kuchyni", "na lodi", "pri táboráku", "na výlete", "v rozprávke", "v budúcnosti",
  "s korunou", "s veľkým klobúkom", "s balónmi", "so slnečnými okuliarmi", "vedľa pokladu", "počas Vianoc", "cez víkend", "ráno", "večer", "v tajnosti",
];
export const GENERATED_IMPOSTOR_PAIRS = IMPOSTOR_SUBJECTS.flatMap(([subject, hint]) => IMPOSTOR_CONTEXTS.map((context) => ({
  word: `${subject} ${context}`,
  hint,
})));
