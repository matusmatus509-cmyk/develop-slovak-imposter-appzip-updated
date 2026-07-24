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

const NEVER_TEMPLATES = [
  "som sa tváril/a, že tomu rozumiem", "som kvôli tomu meškal/a", "som o tom klamal/a", "som sa pri tom strápnil/a",
  "som na to minul/a priveľa peňazí", "som to tajil/a pred rodinou", "som sa kvôli tomu pohádal/a", "som pri tom zaspal/a",
  "som si to odfotil/a", "som to zdieľal/a na internete", "som to predstieral/a", "som sa tomu nahlas smial/a",
  "som kvôli tomu zmenil/a plán", "som to skúsil/a bez prípravy", "som pri tom niečo rozbil/a", "som kvôli tomu volal/a kamarátovi",
  "som si na to požičal/a peniaze", "som sa kvôli tomu ospravedlňoval/a", "som to urobil/a uprostred noci", "som sa pri tom stratil/a",
  "som to vzdal/a príliš skoro", "som tým niekoho prekvapil/a", "som to urobil/a iba zo zvedavosti", "som tvrdil/a, že to bol môj nápad",
];

const RATHER_TEMPLATES = [
  ["byť v téme najlepší/ia", "mať pri téme najviac šťastia"], ["poznať o téme celú pravdu", "nikdy o téme nič nevedieť"],
  ["venovať téme celý rok", "už sa téme nikdy nevenovať"], ["riešiť tému sám/sama", "riešiť tému s veľkým tímom"],
  ["mať pri téme neobmedzený čas", "mať pri téme neobmedzené peniaze"], ["urobiť pri téme jednu veľkú chybu", "urobiť sto malých chýb"],
  ["byť pri téme vždy úprimný/á", "vždy vedieť, keď ostatní klamú"], ["zažiť pri téme minulosť", "vidieť pri téme budúcnosť"],
  ["mať pri téme slávu", "mať pri téme pokoj"], ["získať pri téme talent", "získať pri téme skúsenosti"],
  ["začať tému od začiatku", "preskočiť rovno na koniec"], ["všetko o téme hovoriť nahlas", "o téme už nikdy nehovoriť"],
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
export const GENERATED_RATHER = PROMPT_TOPICS.flatMap((topic) => RATHER_TEMPLATES.map(([a, b]) => ({ a: `${a}: ${topic}`, b: `${b}: ${topic}` })));

const CHARACTER_ROLES = [
  "detektív", "lekárka", "pilot", "vedkyňa", "kuchár", "učiteľka", "hasič", "novinárka", "astronaut", "archeologička",
  "hudobník", "maliarka", "športovec", "režisérka", "fotograf", "programátorka", "záchranár", "architektka", "farmár", "veterinárka",
  "kúzelník", "kráľovná", "rytieri", "pirátka", "objaviteľ", "vynálezkyňa", "cestovateľ", "diplomatka", "sudca", "advokátka",
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
  "robot", "astronaut", "pirát", "princezná", "rytieri", "čarodejnica", "drak", "jednorožec", "mimozemšťan", "superhrdina",
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

const MIME_ACTIONS = [
  "Hľadanie", "Otváranie", "Zatváranie", "Nosenie", "Ťahanie", "Tlačenie", "Umývanie", "Čistenie", "Maľovanie", "Fotografovanie",
  "Opravovanie", "Skladanie", "Balenie", "Rozbaľovanie", "Varenie", "Pečenie", "Ochutnávanie", "Kupovanie", "Predávanie", "Požičiavanie",
  "Chytanie", "Hádzanie", "Kopanie", "Zdvíhanie", "Schovávanie", "Objavovanie", "Strácanie", "Zachraňovanie", "Kŕmenie", "Venčenie",
  "Šoférovanie", "Pilotovanie", "Veslovanie", "Korčuľovanie s", "Lyžovanie s", "Tancovanie s", "Spievanie pre", "Telefonovanie s", "Rozprávanie o", "Snívanie o",
  "Utekanie pred", "Naháňanie", "Čakanie na", "Stavanie", "Búranie", "Preskakovanie", "Plávanie s", "Cestovanie s", "Súťaženie o", "Oslavovanie s",
  "Zaspávanie pri", "Prebúdzanie pri", "Smianie sa na", "Plač nad", "Bojovanie s", "Kúzlenie s", "Trénovanie s", "Vystupovanie s", "Pracovanie s", "Oddychovanie pri",
];
const MIME_TARGETS = [
  "stratený kľúč", "ťažký kufor", "pokazený bicykel", "obrovský balón", "malý pes", "nahnevaná mačka", "lietajúci drak", "tajný poklad",
  "horúca polievka", "narodeninová torta", "nový telefón", "starý fotoaparát", "futbalová lopta", "tenisová raketa", "mokrý dáždnik",
  "vysoký rebrík", "zamknuté dvere", "hlučný vysávač", "veľká mapa", "čarovná palička", "vesmírna prilba", "pirátska loď",
  "snehuliak", "táborový oheň", "pokazený robot", "divoký kôň", "obrovská ryba", "tajomný balík", "hudobný nástroj", "neviditeľný kamarát",
];
export const GENERATED_PANTOMIME_WORDS = MIME_ACTIONS.flatMap((action) => MIME_TARGETS.map((target) => `${action}: ${target}`));
export const GENERATED_CHARADES_BY_DIFFICULTY = {
  lahke: GENERATED_PANTOMIME_WORDS.slice(0, 700),
  stredne: GENERATED_PANTOMIME_WORDS.slice(700, 1400),
  tazke: GENERATED_PANTOMIME_WORDS.slice(1400),
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
