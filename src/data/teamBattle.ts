// ── Pantomíma words (act it out, no speaking) ────────────────────────────────
// Split into difficulty tiers — each tier is worth a different point value.
export type PantomimaDifficulty = "lahke" | "stredne" | "tazke";

export const PANTOMIMA_DIFFICULTY_POINTS: Record<PantomimaDifficulty, number> = {
  lahke: 3,
  stredne: 4,
  tazke: 5,
};

export const PANTOMIMA_DIFFICULTY_LABELS: Record<PantomimaDifficulty, string> = {
  lahke: "Ľahké",
  stredne: "Stredné",
  tazke: "Ťažké",
};

export const PANTOMIMA_EASY: string[] = [
  "Bicyklovanie", "Boxovanie", "Bubnovanie", "Česanie vlasov",
  "Čistenie okien", "Čítanie knihy", "Hádzanie šípok", "Hranie na klavír",
  "Húpať sa", "Chytanie rýb", "Jazda na koni", "Kosenie trávy",
  "Kopanie jamy", "Krájanie cibule", "Kŕmenie vtákov", "Kúpanie psa",
  "Lyžovanie", "Maľovanie obrazu", "Zametanie", "Miešanie kariet", "Mikuláš",
  "Umývanie riadu", "Nakupovanie", "Nalievanie vína", "Natieranie chleba",
  "Nosenie okuliarov", "Oprava auta", "Padanie na ľade", "Pečenie koláča",
  "Plávanie", "Polievanie kvetov", "Pranie v rukách", "Prechádzka so psom",
  "Písanie na stroji", "Rezanie dreva", "Rybár", "Sadenie stromu",
  "Skákanie cez švihadlo", "Spievanie v sprche", "Sprchovanie",
  "Strihanie papiera", "Štrikovanie", "Tancovanie baletu", "Tenista",
  "Tlačenie kočíka", "Trhanie zubov", "Umývanie zubov", "Banán", "Bicykel",
  "Budík", "Bubon", "Čajník", "Činka", "Dáždnik", "Dvere", "Fľaša",
  "Fotoaparát", "Gitara", "Hrebeň", "Hubka na riad", "Husle", "Chladnička",
  "Chlieb", "Ihla", "Injekcia", "Jojo", "Kľúč", "Klobúk", "Kniha", "Lopata",
  "Lopta", "Lyžica", "Minca", "Mobil", "Nožnice", "Pištoľ", "Pohár",
  "Prsteň", "Rúž", "Ruksak", "Rukavice", "Sekera", "Slúchadlá", "Sviečka",
  "Stolička", "Stôl", "Teplomer", "Topánka", "Váza", "Zrkadlo", "Žehlička",
  "Žuvačka", "Had", "Holub", "Hroch", "Hus", "Kačka", "Kengura", "Kohút",
  "Kôň", "Koza", "Krava", "Krokodíl", "Králik", "Kurča", "Korytnačka", "Lev",
  "Líška", "Mačka", "Medveď", "Mucha", "Myš", "Orol", "Ovca", "Pavúk", "Pes",
  "Prasa", "Ryba", "Slon", "Slimák", "Sova", "Tiger", "Žaba", "Žirafa",
  "Žralok", "Batman", "Červená Čiapočka", "Dracula", "Harry Potter",
  "Homer Simpson", "Hulk", "James Bond", "Janko a Marienka", "Ježiško",
  "Kráľ", "Kráľovná", "Pirát", "Popoluška", "Princezná", "Robin Hood",
  "Shrek", "Snehulienka", "Spiderman", "Superman", "Tarzan", "Upír",
  "Zombie", "Duch", "Púšť", "Raj", "Sny", "Snehová búrka", "Sobota", "Sopka",
  "Svadba", "Šport", "Vianoce", "Vietor", "Víkend", "Vojna", "Voľby",
  "Vesmír", "Zemetrasenie", "Zima", "Zlato", "Kat", "Máša a medveď",
  "Mimoni", "Múmia", "Robocop", "Sherlock Holmes", "Vodník", "Zaklínač",
  "Zoro pomstiteľ", "Páv", "Pelikán", "Tučniak", "Piraňa", "Pásavec",
  "Potkan", "Pštros", "Ropucha", "Salamandra",
];

export const PANTOMIMA_MEDIUM: string[] = [
  "Automechanik", "Balenie kufra", "Baník", "Barman", "Behanie v daždi",
  "Bežkovanie", "Budovanie stanu", "Cestovanie vlakom", "Chirurg", "Cukrár",
  "Dirigent", "Dojenie kravy", "Dopravný policajt", "Fotograf",
  "Hranie šachu", "Hrobár", "Hasič", "Horolezec", "Holiť sa", "Inštalatér",
  "Kaderníčka", "Kamionista", "Kartárka", "Kuchár", "Kúzelník",
  "Maliar izieb", "Masér", "Mím", "Oranie", "Pilot", "Pletenie svetra",
  "Poľovník", "Predavač", "Prebaľovanie bábätka", "Programátor",
  "Rúbanie dreva", "Skladanie lietadielka", "Sledovanie hokeja",
  "Smečovanie", "Smetiar", "Snívanie", "Spisovateľ", "Sťahovanie nábytku",
  "Surfing", "Svadobný tanec", "Učiteľ", "Varenie kávy", "Vešanie bielizne",
  "Veštenie", "Vetranie", "Vodár", "Vyšívanie", "Výmena žiarovky",
  "Záhradník", "Zvárač", "Žehlenie", "Akvárium", "Angličák", "Anténa",
  "Automobil", "Balón", "Barle", "Batoh", "Bič", "Diaľkový ovládač", "Diár",
  "Diktafón", "Fúrik", "Fén na vlasy", "Glóbus", "Guma", "Hračka",
  "Igelitka", "Kábel", "Kaktus", "Kalendár", "Koberec", "Kompas", "Kočík",
  "Kosa", "Kostra", "Kôš", "Kotva", "Krabica", "Krieda", "Pálka", "Krokomer",
  "Kufor", "Kladivo", "Klince", "Lampa", "Laso", "Lavička", "Lepidlo",
  "Obálka", "Lupa", "Magnet", "Magnetofón", "Maskara", "Matrac", "Meč",
  "Mikroskop", "Panvica", "Papierové vreckovky", "Pastelka", "Peňaženka",
  "Píla", "Plachta", "Pomáda", "Puzdro", "Radiátor", "Raketa", "Remeň",
  "Ruleta", "Sponka", "Spací vak", "Stan", "Strúhadlo", "Traktor", "Trubka",
  "Ventilátor", "Vidlička", "Vodováha", "Vankúš", "Vrecko", "Vŕtačka",
  "Vývrtka", "Aligátor", "Antilopa", "Baran", "Bobor", "Bocian", "Bodliak",
  "Včela", "Cikáda", "Čajka", "Červík", "Delfín", "Dinosaurus", "Diviak",
  "Drozd", "Dudok", "Ďateľ", "Plameniak", "Fretka", "Gekón", "Gepard",
  "Gorilla", "Grizly", "Škrečok", "Chameleón", "Chobotnica", "Jaguár",
  "Jastrab", "Jašterica", "Jeleň", "Ježko", "Kamzík", "Klokan", "Kobra",
  "Koala", "Komár", "Koník", "Kosatka", "Krab", "Krtko", "Kukučka", "Kuna",
  "Lama", "Lasica", "Leňochod", "Leopard", "Los", "Medúza", "Mravec",
  "Morka", "Mrož", "Netopier", "Nosorožec", "Osa", "Somár", "Ryba", "Srna",
];

export const PANTOMIMA_HARD: string[] = [
  "Počítačový vírus", "Morská choroba", "Zaseknutý zips", "Mínové pole",
  "Zlodej v múzeu", "Tekutý piesok", "Zámena batohov", "Chytený ťahák",
  "Pálivá paprička", "Ploché nohy", "Vysoké opätky", "Zaseknutý výťah",
  "Operácia bez narkózy", "Tesné džínsy", "Ťažká opica", "Psie hovienko",
  "Uštipnutie medúzou", "Strata pamäti", "Nočný vyhadzovač", "Tajný špión",
  "Závislosť na mobile", "Elektrické kreslo", "Vlkolak cez spln",
  "Telesná stráž", "Odmrznuté prsty", "Štrajkujúci robotník",
  "Predávkovanie kofeínom", "Pád do žihľavy", "Vojenský parašutista",
  "Klaustrofóbia", "Čistenie toalety", "Rozžeravené uhlie",
  "Kompulzívne umývanie", "Prasknutie balóna", "Chytanie muchy",
  "Pyrotechnik s dynamitom", "Tajný klub", "Lanová priepasť",
  "Rozbíjanie ľadu", "Ťahanie auta", "Stratená náušnica", "Sťahovanie hada",
  "Domček z karát", "Zemetrasenie pri líčení", "Výbuch šampanského",
  "Hlboké blato", "Útok ôs", "Svadobná kytica", "Strata peňaženky",
  "Pokazená motorka", "Čistenie šupín", "Veľká tableta", "Policajný psovod",
  "Tichý mních", "Trhanie obočia", "Pokazený kolotoč", "Rojenie včiel",
  "Pretekár F1", "Skákanie na trampolíne", "Horúce gaštany",
  "Navliekanie nite", "Colná kontrola", "Väzeň v putách",
  "Námesačník na streche", "Archeologický nález", "Ostnatý drôt",
  "Knokautovaný boxer", "Hĺbka vody", "Talian bez príboru",
  "Odletená palička", "Suchý ľad", "Predstieranie spánku", "Krádež jablka",
  "Topiaci sa človek", "Zber hrozna", "Zvárač bez masky", "Zaseknutá ruka",
  "Zápasník sumo", "Pokazený volant", "Arénový toreador", "Prášenie deky",
  "Krotiteľ levov", "Simulácia infarktu", "Noha v sadre", "Spálený chrbát",
  "Vrece cementu", "Strihanie nechtov", "Zabuchnuté kľúče", "Umelé dýchanie",
  "Roj sršňov", "Okuliare na hlave", "Práca so zbíjačkou",
  "Pretláčanie rukou", "Sťahovanie klavíra", "Maľovanie stropu", "Tenký ľad",
  "Tesný zaváraninový pohár", "Horúca polievka", "Uviaznutie v pavučine",
  "Škrabanie chrbta", "Prepadnutie banky", "Kontaktná šošovka",
  "Vysávanie pod posteľou", "Padajúci telefón", "Kyslý citrón",
  "Vyťahovanie kliešťa", "Silný protivietor", "Žuvačka vo vlasoch",
  "Pálenie záhy", "Cúvanie s prívesom", "Kopnutie do palca", "Klzké mydlo",
  "Utekajúci kôň", "Nákupný vozík", "Ďalekohľad", "Strapaté dieťa",
  "Maľovanie nechtov", "Zablatené topánky", "Miesenie cesta", "Vysoký plot",
  "Hlboký sneh", "Tesná prilba", "Prst vo fľaši", "Umývanie okien",
  "Zamotaná girlanda", "Prepichnuté koleso", "Veterný dáždnik",
  "Plný ruksak", "Seknutie v krku", "Voskové figuríny", "Upchaté umývadlo",
  "Hlinená socha", "Hľadanie signálu", "Plné poháre", "Kúpanie psa",
  "Mestský autobus", "Nafukovací matrac", "Lapanie po dychu", "Mokré plavky",
  "Unikajúce prasiatko", "Plné ruky", "Skladanie stanu", "Žonglovanie",
  "Párovanie ponožiek", "Zlaňovanie skaly", "Streľba z luku",
  "Zaseknutá kotva", "Lúpanie vajíčka", "Nízky tunel", "Horúci plech",
  "Čistenie okuliarov", "Prepravka ovocia", "Vzdušná gitara", "Kopa krabíc",
  "Kaluže blata", "Fólia na mobil", "Plačúce bábätko", "Trhanie buriny",
  "Otáčavé dvere", "Zmrznuté sklo", "Husté krovie", "Hodený kľúč",
  "Tichá miestnosť", "Preťahovanie lanom", "Lepiaca páska", "Úzke hrdlo",
  "Reťaz na bicykel", "Elektrická kefka", "Lanový most", "Rozbitý pohár",
  "Mačacie krmivo", "Otváranie kufra", "Najvyššia polička",
  "Pokazené koliesko", "Obliekanie periny", "Vatová tyčinka",
  "Ometanie snehu", "Stŕpnutá noha", "Zapínanie náramku",
  "Horúci hriankovač", "Horúci piesok", "Balansovanie s metlou", "Živý plot",
];

export const PANTOMIMA_WORDS_BY_DIFFICULTY: Record<PantomimaDifficulty, string[]> = {
  lahke: PANTOMIMA_EASY,
  stredne: PANTOMIMA_MEDIUM,
  tazke: PANTOMIMA_HARD,
};

// ── Šarády words (describe it verbally, no derivatives) ──────────────────────
export const SARADY_WORDS: string[] = [
  // Jedlo a nápoje
  "Bryndzové halušky", "Trdelník", "Zemiakové placky", "Štrúdľa",
  "Čokoládová fontána", "Sushi", "Hamburger", "Smoothie",
  "Limonáda", "Trhané mäso", "Fondue", "Crème brûlée",
  // Miesta
  "Tatranská lanovka", "Eiffelova veža", "Veľký Murál", "Machu Picchu",
  "Bratislavský hrad", "Las Vegas", "Amazon prales", "Antarktída",
  "Morské dno", "Vesmírna stanica", "Alhambra", "Niagara",
  // Veci a koncepty
  "Fotosyntéza", "Gravitácia", "Evolúcia", "Čierna diera",
  "Sloboda", "Spravodlivosť", "Závisť", "Odvaha", "Lenivosť",
  "Influencer", "Hashtag", "Streaming", "Umelá inteligencia",
  "Kryptomena", "Blockchain", "Sociálne siete",
  // Filmy a knihy
  "Harry Potter", "Titanic", "Pán prsteňov", "Star Wars",
  "Leví kráľ", "Ľadové kráľovstvo", "Jurský park", "Matrix",
  "Avengers", "Forrest Gump", "Shrek", "Pirátske karibik",
  // Slovensko
  "Čičmany", "Vlkolínec", "Devínsky hrad", "Oravský hrad",
  "Kriváň", "Gerlach", "Hrad Bojnice", "Demänovská jaskyňa",
  // Zvieratá (tricky)
  "Axolotl", "Platypus", "Narval", "Tardigrada", "Mantis garnela",
  // Historické
  "Kolumbus", "Napoleon", "Kleopatra", "Marco Polo",
  "Vynález kolesa", "Prvý let na Mesiac", "Pád Berlínskeho múra",
  // Moderné veci
  "Zásoby papiera", "Karanténa", "Online schôdzka",
  "Bezdrôtové slúchadlá", "Inteligentný domov",
];

// ── Hádaj kto som words (characters for team mode) ───────────────────────────
export const TEAM_CHARACTERS: string[] = [
  "Elon Musk", "Taylor Swift", "Cristiano Ronaldo", "Lionel Messi",
  "Beyoncé", "Leonardo DiCaprio", "Tom Hanks", "Scarlett Johansson",
  "Dwayne Johnson", "Will Smith", "Ed Sheeran", "Rihanna",
  "Sherlock Holmes", "Harry Potter", "Hermiona Grangerová",
  "Darth Vader", "Luke Skywalker", "Yoda", "Iron Man",
  "Spider-Man", "Batman", "Wonder Woman", "Superman",
  "Jack Sparrow", "Indiana Jones", "James Bond", "Tarzan",
  "King Kong", "Shrek", "Fiona", "Donkey",
  "Marek Hamšík", "Peter Sagan", "Zuzana Čaputová",
  "Albert Einstein", "Isaac Newton", "Marie Curie",
  "Elvis Presley", "Michael Jackson", "Bob Marley",
  "Napoleon", "Kleopatra", "Kolumbus", "Leonardo da Vinci",
  "Santa Claus", "Snehuliak", "Popoluška", "Šípková Ruženka",
];

// ── Quiz questions ────────────────────────────────────────────────────────────
export interface QuizQuestion {
  question: string;
  answer: string;
  category: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Geografia
  { question: "Aká je najvyššia hora na svete?", answer: "Mount Everest", category: "🌍 Geografia" },
  { question: "Koľko kontinentov má Zem?", answer: "7", category: "🌍 Geografia" },
  { question: "Aká je najdlhšia rieka na svete?", answer: "Níl", category: "🌍 Geografia" },
  { question: "V ktorej krajine leží Machu Picchu?", answer: "Peru", category: "🌍 Geografia" },
  { question: "Aká je hlavná mesto Austrálie?", answer: "Canberra", category: "🌍 Geografia" },
  { question: "Ktorý oceán je najväčší?", answer: "Tichý oceán", category: "🌍 Geografia" },
  { question: "Aká je najväčšia krajina na svete?", answer: "Rusko", category: "🌍 Geografia" },
  { question: "V ktorom meste stojí Eiffelova veža?", answer: "Paríž", category: "🌍 Geografia" },
  { question: "Koľko štátov má USA?", answer: "50", category: "🌍 Geografia" },
  { question: "Aká rieka tečie cez Bratislavu?", answer: "Dunaj", category: "🌍 Geografia" },
  { question: "Kde sa nachádza Sahara?", answer: "Severná Afrika", category: "🌍 Geografia" },
  { question: "Aká je najvyššia hora Slovenska?", answer: "Gerlachovský štít", category: "🌍 Geografia" },
  // Veda
  { question: "Koľko planét má naša Slnečná sústava?", answer: "8", category: "🔬 Veda" },
  { question: "Z čoho sa skladá voda? (chemický vzorec)", answer: "H₂O (vodík a kyslík)", category: "🔬 Veda" },
  { question: "Aká je rýchlosť svetla (zaokrúhlene)?", answer: "300 000 km/s", category: "🔬 Veda" },
  { question: "Kto objavil gravitáciu podľa legendy o jablku?", answer: "Isaac Newton", category: "🔬 Veda" },
  { question: "Aký plyn dýchame najviac?", answer: "Dusík (78 %)", category: "🔬 Veda" },
  { question: "Koľko chromozómov má ľudská bunka?", answer: "46", category: "🔬 Veda" },
  { question: "Čo skúma seizmológia?", answer: "Zemetrasenia", category: "🔬 Veda" },
  { question: "Akú teplotu má povrch Slnka (zaokrúhlene)?", answer: "5 500 °C", category: "🔬 Veda" },
  // História
  { question: "V ktorom roku klesol Titanic?", answer: "1912", category: "📜 História" },
  { question: "Kto napísal Shakespearovu Rómea a Júliu?", answer: "William Shakespeare", category: "📜 História" },
  { question: "V ktorom roku padol Berlínsky múr?", answer: "1989", category: "📜 História" },
  { question: "Kto bol prvý človek na Mesiaci?", answer: "Neil Armstrong", category: "📜 História" },
  { question: "Kedy vznikla Slovenská republika (samostatná)?", answer: "1. januára 1993", category: "📜 História" },
  { question: "Ako sa volal prvý prezident USA?", answer: "George Washington", category: "📜 História" },
  { question: "V ktorom meste sa konali prvé novodobé olympijské hry (1896)?", answer: "Atény", category: "📜 História" },
  { question: "Kto vynašiel telefón?", answer: "Alexander Graham Bell", category: "📜 História" },
  // Pop kultúra
  { question: "Ako sa volá hlavný hrdina Harry Pottera?", answer: "Harry Potter", category: "🎬 Pop kultúra" },
  { question: "Koľko kamienkov nekonečna je v Marvel Infinity Gauntlet?", answer: "6", category: "🎬 Pop kultúra" },
  { question: "Kto spieva pieseň 'Shape of You'?", answer: "Ed Sheeran", category: "🎬 Pop kultúra" },
  { question: "V ktorej krajine sa nakrúcal Pán prsteňov?", answer: "Nový Zéland", category: "🎬 Pop kultúra" },
  { question: "Ako sa volá sestra Anny vo filme Ľadové kráľovstvo?", answer: "Elsa", category: "🎬 Pop kultúra" },
  { question: "Koľko sezón má seriál Hra o tróny?", answer: "8", category: "🎬 Pop kultúra" },
  { question: "Kto stvoril Mickeyho Myša?", answer: "Walt Disney", category: "🎬 Pop kultúra" },
  { question: "Ako sa volá najrýchlejší hrdina od DC?", answer: "The Flash", category: "🎬 Pop kultúra" },
  // Šport
  { question: "Koľko hráčov hrá v jednom futbalovom tíme?", answer: "11", category: "⚽ Šport" },
  { question: "Kde sa konajú Letné olympijské hry 2024?", answer: "Paríž", category: "⚽ Šport" },
  { question: "Koľko setov je v zápase tenisu (muži, Grand Slam)?", answer: "5 (víťaz 3 sety)", category: "⚽ Šport" },
  { question: "Kto drží rekord v počte gólov pre Slovensko (futbal)?", answer: "Marek Hamšík", category: "⚽ Šport" },
  { question: "Ako sa nazýva hokejová trofej v NHL?", answer: "Stanley Cup", category: "⚽ Šport" },
  { question: "Koľko bránok má bežný šachmatový set figúrok?", answer: "Šach nemá bránky 😄 — 32 figúrok", category: "⚽ Šport" },
  // Slovensko
  { question: "Aké je hlavné mesto Slovenska?", answer: "Bratislava", category: "🇸🇰 Slovensko" },
  { question: "Ako sa volá najznámejší slovenský cyklista?", answer: "Peter Sagan", category: "🇸🇰 Slovensko" },
  { question: "Čo sú bryndzové halušky?", answer: "Slovenské národné jedlo (zemiakové halušky s bryndzou)", category: "🇸🇰 Slovensko" },
  { question: "Koľko obyvateľov má Slovensko (zaokrúhlene)?", answer: "5,5 milióna", category: "🇸🇰 Slovensko" },
  { question: "Kde sa nachádza Bojnický zámok?", answer: "Bojnice (Trenčiansky kraj)", category: "🇸🇰 Slovensko" },
  { question: "Ako sa volá najvyšší štátny predstaviteľ Slovenska?", answer: "Prezident/ka", category: "🇸🇰 Slovensko" },
  { question: "Čo symbolizuje dvojitý kríž v slovenskom štátnom znaku?", answer: "Byzantský/apoštolský kríž — kresťanstvo", category: "🇸🇰 Slovensko" },
];

// ── Ping pong categories (team mode) ─────────────────────────────────────────
export const TEAM_PINGPONG_CATEGORIES: string[] = [
  "Európske krajiny", "Zvieratá v džungli", "Druhy ovocia",
  "Futbalové kluby", "Hlavné mestá", "Jedlá z Talianska",
  "Veci na pláži", "Slovenské mestá", "Marvel superhrdinovia",
  "Hudobné nástroje", "Druhy áut", "Aplikácie na telefóne",
  "Veci v kuchyni", "Olympijské športy", "Filmové ságy",
  "Druhy tanca", "Planéty a vesmír", "Typy oblečenia",
  "Veci, ktoré svietia", "Slovenské jedlá", "Profesie a povolania",
  "Zvieratá v mori", "Druhy hudby", "Postavy z rozprávok",
  "Značky smartfónov", "Veci v škole", "Druhy syra",
  "Veci, ktoré plávajú", "Zimné športy", "Veci na párty",
];

// ── Round types ───────────────────────────────────────────────────────────────
export type GameType = "pantomima" | "sarady" | "quiz" | "pingpong" | "hadajktosom";
export type RoundSpecial = "none" | "double" | "lightning" | "final";

export interface BattleRound {
  index: number;
  game: GameType;
  special: RoundSpecial;
  pointMultiplier: number;
  timeSeconds: number;
}

export const TEAM_COLORS: [string, string] = ["#3b82f6", "#ef4444"];
export const TEAM_ICONS: [string, string] = ["🔵", "🔴"];

export function generateBattleRounds(count: number): BattleRound[] {
  const games: GameType[] = ["pantomima", "sarady", "quiz", "pingpong", "hadajktosom"];
  const rounds: BattleRound[] = [];

  // Pick positions for special rounds (not first, not last)
  const doubleAt = count > 2 ? Math.floor(count / 2) : -1;
  const lightningAt = count >= 5 ? Math.floor(count / 3) : -1;

  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1;
    const game: GameType = isLast ? "quiz" : games[i % games.length];

    let special: RoundSpecial = "none";
    let multiplier = 1;
    let time = 60;

    if (isLast) {
      special = "final";
      multiplier = 3;
    } else if (i === doubleAt) {
      special = "double";
      multiplier = 2;
    } else if (i === lightningAt) {
      special = "lightning";
      time = 30;
    }

    rounds.push({ index: i, game, special, pointMultiplier: multiplier, timeSeconds: time });
  }

  return rounds;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const GAME_LABELS: Record<GameType, string> = {
  pantomima: "Pantomíma",
  sarady: "Šarády",
  quiz: "Kvízový súboj",
  pingpong: "Slovný ping pong",
  hadajktosom: "Hádaj kto som",
};

export const GAME_ICONS: Record<GameType, string> = {
  pantomima: "🎭",
  sarady: "💬",
  quiz: "🧠",
  pingpong: "🏓",
  hadajktosom: "🤔",
};
