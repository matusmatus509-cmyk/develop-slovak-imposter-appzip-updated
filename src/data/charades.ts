export type CharadesDifficulty = "lahke" | "stredne" | "tazke";

/**
 * Katalóg výhradne pre Slovné šarády — 2000 ručne pripravených kartičiek.
 *
 * Pravidlá pre každú vstavanú kartu:
 * - dá sa zahrať iba pohybom tela a gestami, bez rozprávania a bez zvukov,
 * - je to konkrétna vec, bytosť, miesto, postava, činnosť alebo scéna,
 * - jedno až tri slová, žiadne dvojbodky ani celé vety,
 * - žiadne abstraktné, odborné, politické, ekonomické, právne,
 *   matematické ani informatické pojmy,
 * - ľahké = úplne známe pojmy, stredné = náročnejšie, ťažké = najnáročnejšie,
 *   no stále dobre zahrateľné.
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


// ─── ĽAHKÉ (800) ──────────────────────────────────────────────────────────────
const EASY_CARDS = [
  // Zvieratá
  "Pes", "Mačka", "Kôň", "Krava", "Ovca", "Koza", "Prasa", "Sliepka", "Kačka", "Hus",
  "Kohút", "Zajac", "Králik", "Myš", "Škrečok", "Morča", "Ježko", "Veverička", "Líška", "Vlk",
  "Medveď", "Lev", "Tiger", "Slon", "Žirafa", "Zebra", "Opica", "Gorila", "Panda", "Kengura",
  "Delfín", "Veľryba", "Žralok", "Tuleň", "Korytnačka", "Krokodíl", "Žaba", "Had", "Papagáj", "Sova",
  "Vrabec", "Holub", "Orol", "Páv", "Bocian", "Motýľ", "Včela", "Lienka", "Mravec", "Pavúk",
  "Ryba", "Rak", "Krab", "Mucha", "Komár", "Slimák", "Jašterica", "Netopier", "Sokol", "Labuť",
  "Kuriatko", "Šteniatko", "Mačiatko", "Teliatko", "Prasiatko", "Kozliatko", "Jahňa", "Žriebä", "Somár", "Ťava",
  "Los", "Srnka", "Jeleň", "Diviak", "Bobor", "Vydra", "Rys", "Hyena", "Nosorožec", "Hroch",
  "Krtko", "Lastovička", "Kukučka", "Ďateľ", "Straka", "Sýkorka", "Kanárik", "Tučniak", "Koala", "Lama",
  "Chrobák", "Osa", "Kobylka", "Húsenica", "Dážďovka", "Medúza", "Chobotnica", "Hviezdica", "Morský koník", "Rybka",
  "Jazvec", "Kuna", "Šimpanz", "Orangutan", "Leopard", "Gepard", "Puma", "Antilopa", "Byvol", "Sob",
  "Sup", "Plameniak", "Pelikán", "Volavka", "Čajka", "Kačiatko", "Baran", "Vlčiak", "Buldog", "Pudel",

  // Jedlo a pitie
  "Jablko", "Hruška", "Banán", "Pomaranč", "Citrón", "Melón", "Jahoda", "Malina", "Čerešňa", "Slivka",
  "Broskyňa", "Ananás", "Mango", "Kiwi", "Hrozno", "Marhuľa", "Kokos", "Orech", "Mandarínka", "Brusnica",
  "Mrkva", "Paradajka", "Paprika", "Uhorka", "Cibuľa", "Cesnak", "Zemiak", "Tekvica", "Kapusta", "Brokolica",
  "Kukurica", "Hrášok", "Fazuľa", "Šampiňón", "Reďkovka", "Špenát", "Karfiol", "Cvikla", "Zeler", "Petržlen",
  "Chlieb", "Rožok", "Bageta", "Syr", "Maslo", "Med", "Džem", "Vajce", "Slanina", "Klobása",
  "Pizza", "Koláč", "Torta", "Palacinka", "Zmrzlina", "Čokoláda", "Hamburger", "Hotdog", "Cukrík", "Lízanka",
  "Halušky", "Polievka", "Guláš", "Rezeň", "Šalát", "Jogurt", "Cestoviny", "Ryža", "Knedľa", "Zákusok",
  "Káva", "Čaj", "Džús", "Voda", "Mlieko", "Limonáda", "Kakao", "Smoothie", "Sirup", "Minerálka",
  "Popcorn", "Čipsy", "Keksy", "Croissant", "Šiška", "Perník", "Muffin", "Vafle", "Žuvačka", "Sušienka",
  "Soľ", "Cukor", "Korenie", "Ocot", "Olej", "Kečup", "Horčica", "Majonéza", "Múka", "Cesto",

  // Domácnosť a bežné predmety
  "Stolička", "Stôl", "Posteľ", "Sedačka", "Kreslo", "Skriňa", "Komoda", "Polička", "Lampa", "Zrkadlo",
  "Vankúš", "Deka", "Koberec", "Záclona", "Dvere", "Okno", "Kľúč", "Zámok", "Schody", "Balkón",
  "Pohár", "Tanier", "Miska", "Lyžica", "Vidlička", "Nôž", "Hrniec", "Panvica", "Varecha", "Kanvica",
  "Metla", "Mop", "Vedro", "Špongia", "Mydlo", "Šampón", "Hrebeň", "Fén", "Uterák", "Zubná kefka",
  "Kniha", "Zošit", "Ceruzka", "Pero", "Guma", "Pravítko", "Nožnice", "Lepidlo", "Mapa", "Kalkulačka",
  "Televízor", "Telefón", "Počítač", "Chladnička", "Práčka", "Sporák", "Mikrovlnka", "Vysávač", "Žehlička", "Budík",
  "Hodiny", "Sviečka", "Baterka", "Žiarovka", "Zápalky", "Vypínač", "Zásuvka", "Nabíjačka", "Slúchadlá", "Rádio",
  "Kôš", "Vrecko", "Krabica", "Taška", "Batoh", "Kufor", "Peňaženka", "Dáždnik", "Kľúčenka", "Košík",
  "Kladivo", "Skrutkovač", "Klince", "Pílka", "Rebrík", "Lopata", "Hrable", "Vrtačka", "Meter", "Kliešte",
  "Fľaša", "Slamka", "Obrus", "Servítka", "Otvárač", "Struhadlo", "Naberačka", "Sitko", "Váha", "Termoska",


  // Oblečenie a doplnky
  "Tričko", "Nohavice", "Sukňa", "Šaty", "Sveter", "Kabát", "Bunda", "Košeľa", "Kravata", "Klobúk",
  "Čiapka", "Šál", "Rukavice", "Ponožky", "Topánky", "Tenisky", "Čižmy", "Sandále", "Papuče", "Opasok",
  "Plavky", "Pyžamo", "Župan", "Vesta", "Kraťasy", "Rifle", "Kabelka", "Náhrdelník", "Náramok", "Prsteň",
  "Náušnice", "Okuliare", "Slnečné okuliare", "Hodinky", "Prilba", "Maska", "Šatka", "Kapucňa", "Zástera", "Uniforma",
  "Korunka", "Plášť", "Overal", "Tepláky", "Legíny", "Baretka", "Šnúrky", "Gombík", "Zips", "Vreckovka",

  // Doprava
  "Auto", "Bicykel", "Vlak", "Autobus", "Motorka", "Lietadlo", "Loď", "Traktor", "Taxík", "Sanitka",
  "Električka", "Metro", "Lanovka", "Kajak", "Kanoe", "Kolobežka", "Helikoptéra", "Karavan", "Nákladiak", "Bager",
  "Hasičské auto", "Policajné auto", "Smetiarske auto", "Odťahové auto", "Horský bicykel", "Detský kočík", "Nákupný vozík", "Závodné auto", "Terénne auto", "Poštová dodávka",
  "Plachetnica", "Parník", "Kompa", "Vor", "Horkovzdušný balón", "Padák", "Rogalo", "Vzducholoď", "Rýchlik", "Vozík",
  "Sane", "Snežný skúter", "Štvorkolka", "Golfový vozík", "Šliapadlo", "Trajekt", "Rybárska loď", "Vláčik", "Vlečka", "Cisterna",

  // Šport a hračky
  "Lopta", "Hokejka", "Tenisová raketa", "Korčule", "Lyže", "Snowboard", "Sánky", "Švihadlo", "Medaila", "Trofej",
  "Futbal", "Hokej", "Tenis", "Plávanie", "Beh", "Box", "Golf", "Bowling", "Joga", "Basketbal",
  "Volejbal", "Bedminton", "Stolný tenis", "Karate", "Judo", "Šerm", "Lukostreľba", "Vzpieranie", "Gymnastika", "Krasokorčuľovanie",
  "Kolieskové korčule", "Skateboard", "Trampolína", "Hojdačka", "Šmykľavka", "Kolotoč", "Pieskovisko", "Telocvičňa", "Preliezka", "Bránka",
  "Bábika", "Autíčko", "Kocky", "Puzzle", "Bublifuk", "Šarkan", "Vodná pištoľ", "Plyšový medveď", "Stolná hra", "Karty",
  "Šach", "Dáma", "Domino", "Kolky", "Obruč", "Jojo", "Frisbee", "Guľky", "Skrývačka", "Naháňačka",

  // Povolania a známe postavy
  "Lekár", "Učiteľ", "Kuchár", "Hasič", "Policajt", "Pekár", "Poštár", "Čašník", "Farmár", "Zubár",
  "Kaderník", "Maliar", "Fotograf", "Herec", "Spevák", "Tanečník", "Klaun", "Pilot", "Rybár", "Veterinár",
  "Vodič", "Predavač", "Murár", "Stolár", "Záhradník", "Elektrikár", "Mechanik", "Krajčír", "Mäsiar", "Plavčík",
  "Sestrička", "Vojak", "Námorník", "Kúzelník", "Žonglér", "Akrobat", "Krotiteľ levov", "Dirigent", "Hudobník", "Bubeník",
  "Cukrár", "Kominár", "Smetiar", "Kuriér", "Vrátnik", "Upratovačka", "Opatrovateľka", "Záchranár", "Baník", "Drevorubač",
  "Kráľ", "Kráľovná", "Princezná", "Princ", "Rytier", "Pirát", "Kovboj", "Šerif", "Šašo", "Strážnik",

  // Príroda
  "Strom", "Kvet", "Tráva", "List", "Les", "Rieka", "Jazero", "Hora", "Dúha", "Snehuliak",
  "Slnko", "Mesiac", "Hviezda", "Dážď", "Sneh", "Vietor", "Blesk", "Mrak", "Hmla", "Ľad",
  "More", "Pláž", "Piesok", "Kameň", "Skala", "Jaskyňa", "Potok", "Vodopád", "Ostrov", "Lúka",
  "Ruža", "Tulipán", "Slnečnica", "Sedmokráska", "Kaktus", "Palma", "Dub", "Breza", "Smrek", "Huba",
  "Semienko", "Koreň", "Konár", "Púčik", "Žaluď", "Muchotrávka", "Papraď", "Lekno", "Vŕba", "Jabloň",


  // Jednoduché činnosti
  "Spánok", "Smiech", "Plač", "Tanec", "Kýchanie", "Zívanie", "Kašeľ", "Objatie", "Bozk", "Podanie ruky",
  "Umývanie riadu", "Umývanie zubov", "Česanie vlasov", "Varenie polievky", "Pečenie torty", "Krájanie cibule", "Zametanie podlahy", "Vysávanie koberca", "Vešanie prádla", "Žehlenie košele",
  "Zaväzovanie šnúrok", "Obliekanie kabáta", "Nasadzovanie čiapky", "Otváranie dverí", "Zatváranie okna", "Nosenie nákupu", "Balenie darčeka", "Kŕmenie psa", "Venčenie psa", "Kúpanie mačky",
  "Písanie listu", "Čítanie knihy", "Kreslenie obrázka", "Fotografovanie", "Telefonovanie", "Šoférovanie", "Bicyklovanie", "Skákanie do vody", "Sánkovanie", "Lyžovanie",
  "Hra na gitare", "Hra na klavíri", "Hra na bubnoch", "Hra na flaute", "Spievanie", "Dirigovanie", "Tlieskanie", "Mávanie", "Ukláňanie", "Salutovanie",
  "Skákanie cez švihadlo", "Drepy", "Kliky", "Rozcvička", "Zdvíhanie závažia", "Šplhanie po lane", "Kotrmelec", "Stojka", "Premet", "Chôdza po špičkách",

  // Rozprávky a slávne postavy
  "Snehulienka", "Červená čiapočka", "Popoluška", "Šípková Ruženka", "Zlatovláska", "Janko Hraško", "Morská panna", "Snehová kráľovná", "Zlatá rybka", "Perinbaba",
  "Drak", "Čarodejnica", "Víla", "Trpaslík", "Obor", "Vlkodlak", "Duch", "Strašiak", "Jednorožec", "Ježibaba",
  "Mikuláš", "Anjel", "Čert", "Sob Rudolf", "Veľkonočný zajac", "Vianočný stromček", "Narodeninová torta", "Karnevalová maska", "Prskavka", "Balónik",
  "Spider-Man", "Batman", "Superman", "Hulk", "Iron Man", "Harry Potter", "Šrek", "Leví kráľ", "Super Mario", "Mickey Mouse",
  "Pán Bean", "Charlie Chaplin", "Tarzan", "Robin Hood", "Pinocchio", "Peter Pan", "Aladin", "Popeye", "Asterix", "Obelix",

  // Miesta a bežné situácie
  "Kino", "Divadlo", "Cirkus", "Zoo", "Múzeum", "Knižnica", "Škola", "Nemocnica", "Obchod", "Reštaurácia",
  "Kaviareň", "Pekáreň", "Lekáreň", "Kaderníctvo", "Pošta", "Trh", "Štadión", "Hotel", "Bazén", "Park",
  "Poštová schránka", "Dopravná značka", "Autobusová zastávka", "Železničná stanica", "Čerpacia stanica", "Nákupné centrum", "Detské ihrisko", "Futbalové ihrisko", "Školská tabuľa", "Školský zvonček",
  "Gitara", "Klavír", "Bubon", "Flauta", "Mikrofón", "Ústna harmonika", "Píšťalka", "Zvonček", "Činely", "Noty",
  "Sprcha", "Vaňa", "Umývadlo", "Toaleta", "Kohútik", "Drez", "Sušiak", "Plot", "Chodník", "Brána",
  "Garáž", "Záhrada", "Terasa", "Pivnica", "Podkrovie", "Komín", "Strecha", "Studňa", "Stodola", "Farma",
  "Domáca úloha", "Rodinná fotografia", "Narodeninová oslava", "Svadobný prsteň", "Vianočné darčeky", "Letná dovolenka", "Zimná bunda", "Slnečný deň", "Búrka", "Piknik",
  "Nakupovanie", "Upratovanie", "Pranie prádla", "Vynášanie smetí", "Kosenie trávy", "Hrabanie listov", "Sadenie kvetov", "Polievanie záhrady", "Umývanie auta", "Čistenie okien",
  "Maľovanie steny", "Zatĺkanie klinca", "Skladanie nábytku", "Výmena žiarovky", "Nafukovanie balóna", "Zapaľovanie sviečky", "Otváranie fľaše", "Miešanie cesta", "Nalievanie vody", "Krájanie chleba",
  "Odomykanie dverí", "Zaklopanie na dvere", "Prezúvanie topánok", "Vyzliekanie kabáta", "Ustielanie postele", "Zabalenie kufra", "Zapínanie zipsu", "Viazanie kravaty", "Zapletanie vlasov", "Strihanie nechtov",
] as const;


// ─── STREDNÉ (800) ────────────────────────────────────────────────────────────
const MEDIUM_CARDS = [
  // Postavy a povolania
  "Astronaut", "Robot", "Zombie", "Ninja", "Detektív", "Špión", "Tajný agent", "Vedec", "Archeológ", "Bodyguard",
  "Viking", "Samuraj", "Mušketier", "Rímsky vojak", "Egyptský faraón", "Stredoveký rytier", "Lovec pokladov", "Krotiteľ hadov", "Povrazolezec", "Žonglér s ohňom",
  "Horolezec", "Jaskyniar", "Prieskumník", "Záchranár v horách", "Lyžiarsky inštruktor", "Plavecký tréner", "Futbalový rozhodca", "Hokejový brankár", "Tenisový hráč", "Basketbalista",
  "Modelka", "Vizážistka", "Manikérka", "Masér", "Fitnes tréner", "Baletka", "Operný spevák", "Rocková hviezda", "Diskotékový DJ", "Pouličný umelec",
  "Novinár", "Kameraman", "Režisér", "Moderátor", "Sprievodca v múzeu", "Letuška", "Kapitán lode", "Vlakový sprievodca", "Recepčný", "Poslíček",
  "Upír", "Mimozemšťan", "Čarodej", "Škriatok", "Trol", "Netvor", "Kostlivec", "Strašidlo", "Yeti", "Vodník",
  "Sherlock Holmes", "James Bond", "Indiana Jones", "Rocky Balboa", "Terminátor", "Yoda", "Darth Vader", "Frankenstein", "Drakula", "Robocop",
  "Gandalf", "Hermiona", "Kapitán Hook", "Winnetou", "Rambo", "Zorro", "Godzilla", "King Kong", "Pikachu", "Sonic",

  // Záľuby a činnosti
  "Kempovanie", "Karaoke", "Safari", "Karneval", "Rybárčenie", "Turistika", "Cyklistika", "Jazda na koni", "Horolezectvo", "Potápanie",
  "Surfovanie", "Windsurfing", "Jachting", "Rafting", "Vodné lyžovanie", "Skoky na lyžiach", "Bežky", "Curling", "Hokejbal", "Ragby",
  "Bungee jumping", "Parašutizmus", "Paragliding", "Lezenie na stene", "Parkour", "Vzdušná akrobacia", "Krasojazda", "Jazda na jednokolke", "Chôdza na chodúľoch", "Skoky do vody",
  "Pletenie", "Šitie", "Vyšívanie", "Háčkovanie", "Keramika", "Modelovanie z hliny", "Origami", "Rezbárstvo", "Maľovanie na tvár", "Zdobenie torty",
  "Sťahovanie nábytku", "Stavanie stanu", "Zakladanie ohňa", "Grilovanie", "Opekanie špekáčok", "Zaváranie ovocia", "Sušenie húb", "Zbieranie húb", "Zbieranie jabĺk", "Strihanie živého plota",
  "Orchester", "Dychová hudba", "Rocková kapela", "Ľudový tanec", "Balet", "Stepovanie", "Break dance", "Salsa", "Tango", "Valčík",
  "Ranná zápcha", "Zmeškaný autobus", "Dlhý rad", "Prasknutá pneumatika", "Vybitý telefón", "Pokazený výťah", "Zabuchnuté dvere", "Rozliata káva", "Pripálený obed", "Stratené kľúče",
  "Návšteva zubára", "Očkovanie", "Meranie teploty", "Obväzovanie rany", "Prvá pomoc", "Röntgen", "Noha v sadre", "Barle", "Invalidný vozík", "Očné kvapky",
  "Pracovný pohovor", "Prvý pracovný deň", "Pracovná porada", "Videohovor", "Písanie na klávesnici", "Tlačiareň bez papiera", "Prestávka na kávu", "Školská skúška", "Písomka", "Vysvedčenie",
  "Letisková kontrola", "Colná kontrola", "Hotelová recepcia", "Turistická mapa", "Fotenie pamiatok", "Suvenír", "Plážový slnečník", "Nafukovací kruh", "Šnorchlovanie", "Pieskový hrad",

  // Miesta
  "Maják", "Ponorka", "Veterný mlyn", "Hrad", "Palác", "Kláštor", "Pyramída", "Rozhľadňa", "Most", "Tunel",
  "Prístav", "Letisko", "Nástupište", "Lunapark", "Akvárium", "Planetárium", "Botanická záhrada", "Skanzen", "Amfiteáter", "Tržnica",
  "Priehrada", "Kaňon", "Sopka", "Gejzír", "Bažina", "Prales", "Savana", "Oáza", "Korálový útes", "Ľadovec",
  "Kuchyňa", "Kúpeľňa", "Spálňa", "Detská izba", "Obývačka", "Šatňa", "Kancelária", "Čakárňa", "Skúšobná kabínka", "Výťah",
  "Autoumývačka", "Autoservis", "Pneuservis", "Čistiareň", "Kvetinárstvo", "Mäsiarstvo", "Papiernictvo", "Železiarstvo", "Zverimex", "Požičovňa lyží",
  "Strašidelný dom", "Divoký západ", "Horská dráha", "Vesmírna loď", "Lietajúci koberec", "Tajná chodba", "Opustený hrad", "Pirátska loď", "Púštna karavána", "Stará truhlica",
  "Fontána", "Pamätník", "Lavička v parku", "Priechod pre chodcov", "Kruhový objazd", "Parkovací automat", "Podchod", "Eskalátor", "Otočné dvere", "Turniket",
  "Ohrada pre kone", "Psí útulok", "Vtáčia búdka", "Úľ", "Rybník", "Holubník", "Ovčí salaš", "Vinohrad", "Ovocný sad", "Maštaľ",

  // Predmety a stroje
  "Ďalekohľad", "Kompas", "Mikroskop", "Glóbus", "Presýpacie hodiny", "Slnečné hodiny", "Lupa", "Petrolejová lampa", "Lampión", "Vreckové hodinky",
  "Harmonika", "Trúbka", "Saxofón", "Violončelo", "Husle", "Klarinet", "Harfa", "Xylofón", "Tamburína", "Gong",
  "Šijací stroj", "Písací stroj", "Kosačka", "Motorová píla", "Miešačka", "Zváračka", "Žeriav", "Buldozér", "Valec", "Vysokozdvižný vozík",
  "Dron", "Robotický vysávač", "Herná konzola", "Tablet", "Smart hodinky", "Selfie palica", "Bezdrôtové slúchadlá", "Klávesnica", "Webkamera", "Skener",
  "Boxerské rukavice", "Boxovací vak", "Činka", "Bežecký pás", "Rotoped", "Hokejová prilba", "Chrániče na kolená", "Plavecké okuliare", "Šnorchel", "Plutvy",
  "Mixér", "Hriankovač", "Kávovar", "Rýchlovarná kanvica", "Tlakový hrniec", "Fritéza", "Gril", "Forma na tortu", "Valček na cesto", "Mlynček na mäso",
  "Hasiaci prístroj", "Lekárnička", "Záchranná vesta", "Hasičská hadica", "Reflexná vesta", "Výstražný trojuholník", "Autosedačka", "Snehové reťaze", "Kanister", "Štartovacie káble",
  "Klaunský nos", "Kúzelnícky klobúk", "Pirátska šatka", "Rytierska zbroj", "Vesmírny skafander", "Potápačský oblek", "Baletné špičky", "Kovbojské čižmy", "Havajský veniec", "Karnevalové krídla",


  // Šport a pohyb
  "Penalta", "Rohový kop", "Hlavička", "Vhadzovanie", "Slalom", "Šprint", "Štafeta", "Maratón", "Skok do diaľky", "Skok do výšky",
  "Hod oštepom", "Hod diskom", "Vrh guľou", "Trojskok", "Prekážkový beh", "Športová chôdza", "Časovka", "Cieľová rovinka", "Víťazné gesto", "Zahrievanie pred štartom",
  "Tanečný súboj", "Kúzelnícky trik", "Žonglovanie", "Balansovanie", "Zápas v ringu", "Naťahovanie lanom", "Preskok cez kozu", "Šplh na tyči", "Skok o žrdi", "Trik na skateboarde",
  "Chôdza proti vetru", "Chôdza po ľade", "Chôdza v bahne", "Preliezanie plotu", "Prechod cez potok", "Vyliezanie z okna", "Zatĺkanie kolíka", "Stavanie snehuliaka", "Odhŕňanie snehu", "Šliapanie do kopca",
  "Nafukovanie matraca", "Vešanie hojdačky", "Zametanie dvora", "Rúbanie dreva", "Nosenie vody", "Kopanie jamy", "Hrabanie sena", "Zapaľovanie grilu", "Miešanie v kotle", "Nosenie dreva",
  "Prenášanie torty", "Obliekanie skafandra", "Žmýkanie trička", "Vytieranie podlahy", "Leštenie auta", "Fúkanie sviečok", "Nafukovanie balónov", "Otváranie šampanského", "Rozdávanie kariet", "Podávanie taniera",

  // Zvieratá
  "Kolibrík", "Pštros", "Emu", "Kondor", "Tukan", "Ara", "Kakadu", "Bažant", "Prepelica", "Perlička",
  "Lenochod", "Mravčiar", "Pásavec", "Tapír", "Kapybara", "Surikata", "Fretka", "Dikobraz", "Skunk", "Mangusta",
  "Rejnok", "Barakuda", "Murena", "Piraňa", "Sumec", "Šťuka", "Úhor", "Treska", "Sardinka", "Ostriež",
  "Kobra", "Štrkáč", "Anakonda", "Pytón", "Varan", "Gekón", "Kajman", "Aligátor", "Tarantula", "Škorpión",
  "Vážka", "Modlivka", "Cvrček", "Svetluška", "Termit", "Čmeliak", "Chrúst", "Kliešť", "Blcha", "Stonožka",

  // Známe názvy a scény
  "Titanic", "Jurský park", "Hviezdne vojny", "Pán prsteňov", "Piráti z Karibiku", "Rýchlo a zbesilo", "Mission Impossible", "Matrix", "Avatar", "Votrelec",
  "Ľadové kráľovstvo", "Doba ľadová", "Rybka Nemo", "Šmolkovia", "Madagaskar", "Ratatouille", "Coco", "Toy Story", "Blesk McQueen", "Mimoni",
  "Eiffelova veža", "Šikmá veža", "Egyptské pyramídy", "Čínsky múr", "Socha slobody", "Big Ben", "Koloseum", "Bratislavský hrad", "Tatry", "Niagarské vodopády",
  "Prvý bozk", "Prvé kroky", "Narodeninové prekvapenie", "Prvé rande", "Svadobný tanec", "Lúčenie na letisku", "Návrat domov", "Nečakaná návšteva", "Skupinová fotka", "Selfie s kamarátmi",
  "Rozbitý pohár", "Pretečená vaňa", "Zaseknutý zips", "Roztrhnutá taška", "Zapadnuté auto", "Vypálená žiarovka", "Kľúče v aute", "Prázdna nádrž", "Studená sprcha", "Zlomený podpätok",
  "Prudký dážď", "Krupobitie", "Silný vietor", "Snehová fujavica", "Poľadovica", "Horúce leto", "Mrazivé ráno", "Dusné popoludnie", "Prvý sneh", "Jesenné listy",
  "Silvestrovský ohňostroj", "Vianočná kapustnica", "Veľkonočná šibačka", "Fašiangový sprievod", "Stavanie mája", "Vynášanie Morény", "Vinobranie", "Halloweenska tekvica", "Adventný venec", "Narodeninová sviečka",
  "Grilovaná klobása", "Praženica", "Kotlíkový guláš", "Zapekané zemiaky", "Ovocný koláč", "Zmrzlinový kornút", "Cukrová vata", "Karamelové jablko", "Čokoládová fontána", "Trojposchodová torta",
  "Mačka na strome", "Pes s loptou", "Kôň v galope", "Vták v klietke", "Ryba na udici", "Zajac v tráve", "Zvonec na krave", "Slon pri vode", "Šteniatko v koši", "Papagáj na ramene",
  "Preplnený autobus", "Nočný vlak", "Zápcha na diaľnici", "Jazda na traktore", "Cyklista v daždi", "Motorka v zákrute", "Vzlet lietadla", "Pristátie lietadla", "Plavba na lodi", "Nástup do metra",
  "Kuchár pri sporáku", "Čašník s táckou", "Poštár s balíkom", "Hasič s hadicou", "Policajt na križovatke", "Lekár so stetoskopom", "Učiteľ pri tabuli", "Murár s fúrikom", "Záhradník s hrabľami", "Maliar so štetkou",
  "Prváčik s aktovkou", "Detský karneval", "Škola v prírode", "Lyžiarsky výcvik", "Plavecký kurz", "Školská akadémia", "Zber papiera", "Triedny výlet", "Fotenie triedy", "Rozdávanie vysvedčení",
  "Sťahovanie", "Veľké pranie", "Jarné upratovanie", "Výmena kolesa", "Skladanie skrine", "Vešanie záclon", "Umývanie okien", "Čistenie komína", "Kúrenie v peci", "Vymetanie pece",
  "Púšťanie šarkana", "Púšťanie lodičiek", "Kŕmenie kačiek", "Hľadanie štvorlístka", "Zbieranie mušlí", "Písanie do piesku", "Skákanie do kaluže", "Chytanie motýľov", "Púšťanie bublín", "Fotenie západu slnka",


  // Podujatia a situácie
  "Svadba", "Stužková", "Promócia", "Narodeniny", "Meniny", "Rozlúčka so slobodou", "Zásnuby", "Kolaudácia", "Rodinná oslava", "Prekvapenie na oslave",
  "Koncert", "Festival", "Divadelné predstavenie", "Filmová premiéra", "Módna šou", "Cirkusové vystúpenie", "Ohňostroj", "Karnevalový ples", "Talentová šou", "Autogramiáda",
  "Futbalový zápas", "Hokejový zápas", "Tenisový turnaj", "Olympiáda", "Štart maratónu", "Cyklistický pretek", "Šachový turnaj", "Bowlingový večer", "Golfový turnaj", "Preteky formuly",
  "Súťaž v jedení", "Súťaž krásy", "Beh v pytliach", "Hod vajcom", "Skákanie v pytli", "Hľadanie vajíčok", "Tanečná súťaž", "Karaoke súťaž", "Kvízový večer", "Turnaj v šípkach",
  "Požiar v kuchyni", "Výpadok elektriny", "Zaseknutý výťah", "Prasknutá rúra", "Zatopená pivnica", "Vytopený sused", "Poplach v škole", "Evakuácia", "Búrka v noci", "Zablúdenie v lese",
  "Povodeň", "Snehová kalamita", "Silná búrka", "Horúčava", "Hustá hmla", "Padajúce lístie", "Kvitnúca lúka", "Zlatá jeseň", "Prvý mráz", "Topenie snehu",
  "Nočná služba", "Ranné vstávanie", "Zaspávanie na gauči", "Kúpanie v jazere", "Opaľovanie na pláži", "Sauna", "Masáž", "Strihanie u holiča", "Manikúra", "Skúšanie šiat",

  // Stroje a dopravné prostriedky
  "Formula", "Motokára", "Rallyové auto", "Historické auto", "Limuzína", "Kabriolet", "Dodávka", "Dvojposchodový autobus", "Trolejbus", "Snežná rolba",
  "Vetroň", "Dopravné lietadlo", "Prúdové lietadlo", "Raketoplán", "Kozmická raketa", "Lunárne vozidlo", "Satelit", "Vesmírna stanica", "Kozmická sonda", "Motorové rogalo",
  "Veslica", "Motorový čln", "Vodný skúter", "Katamarán", "Gondola", "Nákladná loď", "Ľadoborec", "Záchranný čln", "Vlečná loď", "Vodné bicykle",
  "Kombajn", "Sejačka", "Pluh", "Zberač sena", "Traktor s vlečkou", "Rýpadlo", "Nakladač", "Asfaltovací stroj", "Snehový pluh", "Cisterna na mlieko",
  "Parná lokomotíva", "Rušeň", "Vagón", "Jedálny vozeň", "Spací vozeň", "Nákladný vagón", "Výhybka", "Železničné priecestie", "Koľajnice", "Depo",
  "Reťazový kolotoč", "Ruské koleso", "Vodná skluzavka", "Autodrom", "Strelnica", "Skákací hrad", "Lanový park", "Simulátor letu", "Trenažér", "Vláčik v lunaparku",

  // Bežný život
  "Objednávanie jedla", "Servírovanie polievky", "Otváranie vína", "Prípitok", "Platenie účtu", "Prestieranie stola", "Nosenie tanierov", "Miešanie kokteilu", "Krájanie steaku", "Rezervácia stola",
  "Tlačenie kočíka", "Prebaľovanie", "Kŕmenie bábätka", "Uspávanie dieťaťa", "Detská stolička", "Cumlík", "Dojčenská fľaška", "Hranie s hrkálkou", "Nosenie na ramenách", "Prvé zúbky",
  "Kúpanie psa", "Strihanie srsti", "Čistenie klietky", "Čistenie akvária", "Ťahanie na vodítku", "Hodenie loptičky", "Hladenie mačky", "Podávanie labky", "Aportovanie", "Mačka v prepravke",
  "Farbenie vlasov", "Sušenie fénom", "Holenie", "Líčenie", "Lakovanie nechtov", "Šitie gombíka", "Meranie postavy", "Prišívanie záplaty", "Pletenie šálu", "Skúšanie klobúka",
  "Sánkovanie na kopci", "Guľovačka", "Stavanie iglu", "Korčuľovanie na rybníku", "Zbieranie orechov", "Sušenie ovocia", "Zber jahôd", "Kosenie sena", "Pálenie lístia", "Klopanie kobercov",
  "Maskovaný hrdina", "Pavúčia sieť", "Laserový pohľad", "Superrýchly beh", "Železný oblek", "Hromové kladivo", "Kruhový štít", "Maska záporáka", "Tajná základňa", "Záchrana mesta",
  "Slepá baba", "Tichá pošta", "Škôlka", "Skákanie do gumy", "Cvrnkanie guličiek", "Hádzanie žabiek", "Twister", "Šípky", "Biliard", "Stolný futbal",
  "Nafukovanie bazéna", "Zapaľovanie prskavky", "Púšťanie balónov", "Písanie pohľadnice", "Lepenie známky", "Vhadzovanie listu", "Rozbaľovanie darčeka", "Krájanie torty", "Rozlievanie limonády", "Skupinové objatie",
] as const;


// ─── ŤAŽKÉ (400) ──────────────────────────────────────────────────────────────
const HARD_CARDS = [
  // Prírodné javy, postavy a bytosti
  "Lavína", "Tornádo", "Meteor", "Zemetrasenie", "Tsunami", "Smršť", "Zosuv pôdy", "Záplava", "Hurikán", "Piesočná búrka",
  "Iluzionista", "Gladiátor", "Sochár", "Kaskadér", "Alchymista", "Astronóm", "Paleontológ", "Speleológ", "Hodinár", "Sklár",
  "Múmia", "Chameleón", "Sfinga", "Minotaurus", "Kentaur", "Gryf", "Fénix", "Bazilisk", "Kraken", "Hydra",
  "Mrakodrap", "Džungľa", "Púšť", "Tundra", "Kráter", "Labyrint", "Katakomby", "Zrúcanina", "Observatórium", "Akvadukt",
  "Časostroj", "Snehová guľa", "Kaleidoskop", "Gramofón", "Metronóm", "Trezor", "Trojzubec", "Kuša", "Katapult", "Periskop",
  "Ohňová šou", "Zaklínanie hada", "Chôdza po skle", "Únik z reťazí", "Vytiahnutie králika", "Levitácia", "Čítanie z ruky", "Krotenie tigra", "Hod nožom", "Kúzlo s kartami",
  "Biatlon", "Triatlon", "Desaťboj", "Vodné pólo", "Synchronizované plávanie", "Skoky z mostíka", "Boby", "Skeleton", "Sumo", "Rodeo",
  "Rytiersky turnaj", "Plavba Kolumba", "Pristátie na Mesiaci", "Egyptská hrobka", "Rímske kúpele", "Vikingská plavba", "Zlatá horúčka", "Kamenná doba", "Stredoveký trh", "Faraónova maska",
  "Vesmírna prechádzka", "Beztiažový stav", "Zatmenie Slnka", "Polárna žiara", "Padajúca hviezda", "Kométa", "Prstence Saturna", "Mliečna cesta", "Slnečná sústava", "Kráter na Mesiaci",
  "Mravenisko", "Termitisko", "Vosie hniezdo", "Bobria hrádza", "Pavučina", "Kokón", "Larva", "Kukla", "Kŕdeľ vtákov", "Roj včiel",

  // Náročné scény
  "Útek z väzenia", "Záchrana topiaceho", "Hasenie požiaru", "Vyprostenie z auta", "Zásah horskej služby", "Pátranie so psom", "Núdzové pristátie", "Vzbura na lodi", "Potopenie lode", "Svetlica",
  "Hľadanie pokladu", "Výstup na Everest", "Prechod púšťou", "Plavba cez oceán", "Výprava do džungle", "Zdolanie vodopádu", "Nočný pochod", "Prežitie na ostrove", "Jazda na ťave", "Mapa pokladu",
  "Tajná misia", "Odtlačok prsta", "Sledovanie podozrivého", "Ukrytý mikrofón", "Falošný pas", "Prevlek za čašníka", "Lúpež v múzeu", "Nočná hliadka", "Detektor lží", "Únik po lane",
  "Salto na trapéze", "Lietajúci trapéz", "Klaunský pád", "Pyramída z ľudí", "Králik z klobúka", "Zmiznutie v dyme", "Kúzelnícka asistentka", "Ohňová obruč", "Slon na pódiu", "Tuleň s loptou",
  "Trojský kôň", "Herkules", "Ikarove krídla", "Neptúnov trojzubec", "Cyklop", "Morské sirény", "Zlaté rúno", "Oživená socha", "Okrídlený kôň", "Trojhlavý drak",
  "Kováč pri nákove", "Hrnčiar pri kruhu", "Tkáč pri stave", "Rezbár s dlátom", "Mlynár v mlyne", "Pastier so stádom", "Vinár pri lise", "Kominár na streche", "Zvonár vo veži", "Sklár pri peci",
  "Operácia na sále", "Resuscitácia", "Prevoz sanitkou", "Odber krvi", "Zubná vrtačka", "Očný test", "Nasadenie sadry", "Prenos na nosidlách", "Zásah záchranárov", "Záchrana vrtuľníkom",
  "Štart rakety", "Odpočítavanie pred štartom", "Pristátie modulu", "Vlajka na Mesiaci", "Oprava satelitu", "Návrat do atmosféry", "Prílet mimozemšťanov", "Letiaci tanier", "Robotické rameno", "Prilba astronauta",
  "Trhlina v ľade", "Prasknutá priehrada", "Lesný požiar", "Zamrznutý vodopád", "Rozvodnená rieka", "Zosuv skál", "Búrka na mori", "Oko hurikánu", "Ľadové krúpy", "Blesk do stromu",
  "Fotofiniš", "Cieľová páska", "Penaltový rozstrel", "Hattrick", "Knockout", "Zdvihnutie trofeje", "Olympijský oheň", "Nástup na pódium", "Červená karta", "Nosidlá na ihrisku",
  "Sochanie z kameňa", "Maľovanie fresky", "Reštaurovanie obrazu", "Rytie do medi", "Fúkanie skla", "Odlievanie zvonu", "Vyrezávanie z dreva", "Pletenie košíkov", "Zdobenie kraslíc", "Šitie kroja",
  "Nemý film", "Filmová klapka", "Kaskadérsky pád", "Zákulisie divadla", "Maskovanie herca", "Nápoveda v búdke", "Divadelná opona", "Sólo na javisku", "Búrlivý potlesk", "Generálna skúška",
  "Umývač výškových okien", "Kaskadér na motorke", "Lanový záchranár", "Jaskynný potápač", "Horská služba", "Baník v šachte", "Rybár na oceáne", "Hasič v dyme", "Pyrotechnik", "Krotiteľ býkov",
  "Sťahovanie klavíra", "Oprava strechy", "Vŕtanie do betónu", "Búranie steny", "Kladenie parkiet", "Betónovanie chodníka", "Presádzanie stromu", "Čistenie žľabov", "Sekanie ľadu", "Stavanie plota",
  "Cúvanie s vlečkou", "Parkovanie do garáže", "Odtiahnutie auta", "Štartovanie z kopca", "Jazda po poľadovici", "Prejazd brodom", "Preprava koňa", "Nakladanie kontajnera", "Tlačenie pokazeného auta", "Nasadzovanie reťazí",
  "Podkúvanie koňa", "Strihanie ovce", "Dojenie kozy", "Výcvik sokola", "Cvičenie delfína", "Kŕmenie krokodíla", "Ošetrenie zvieraťa", "Zbieranie medu", "Odchyt hada", "Vypúšťanie motýľov",
  "Meč v kameni", "Čarovná palička", "Krištáľová guľa", "Lietajúca metla", "Neviditeľný plášť", "Truhlica s dukátmi", "Kúzelný prsteň", "Fľaška s elixírom", "Drakova jaskyňa", "Zaklínadlo nad kotlom",
  "Dirigent pri pulte", "Klavírny recitál", "Operná ária", "Balet na špičkách", "Husľové sólo", "Sólo na bicie", "Spevácky zbor", "Ladenie klavíra", "Skúška orchestra", "Ukláňanie na javisku",
  "Skok s padákom", "Skok z mosta", "Lezenie bez lana", "Prejazd ohnivou obručou", "Silák so závažím", "Ležanie na klincoch", "Ohýbanie tyče", "Chôdza po uhlíkoch", "Balansovanie s taniermi", "Hod sekerou",
  "Ľadová socha", "Piesková socha", "Bludisko z kukurice", "Šou s bublinami", "Svetelná šou", "Tancujúca fontána", "Let balónom", "Tieňové divadlo", "Živá socha", "Sochy zo snehu",

  // Najnáročnejšie pojmy a výjavy
  "Zatmenie Mesiaca", "Prílivová vlna", "Vodný vír", "Rosa na tráve", "Námraza", "Duna", "Soľné jazero", "Termálny prameň", "Skalné okno", "Kvitnúci kaktus",
  "Rosnička", "Salamandra", "Axolotl", "Ježura", "Vtákopysk", "Nosáľ", "Lemur", "Okapi", "Mlok", "Kamzík",
  "Parný stroj", "Mlynské koleso", "Tkací stav", "Hrnčiarsky kruh", "Lis na hrozno", "Studňa s rumpálom", "Kováčske mechy", "Pluh za koňom", "Ručný mlynček", "Kolovrat",
  "Visiaci most", "Skalné bralo", "Horský priesmyk", "Snežná pláň", "Slaná pláň", "Vyhliadka nad údolím", "Jaskynné jazero", "Podzemná rieka", "Ľadová jaskyňa", "Kamenné bludisko",
  "Neviditeľná stena", "Neviditeľná stolička", "Chôdza po schodoch", "Lezenie po rebríku", "Prechod cez lávku", "Skrývanie pod dáždnikom", "Naháňanie muchy", "Vytiahnutie tŕňa", "Balansovanie s pohárom", "Ťahanie neviditeľného lana",
  "Karneval v Riu", "Čajový obrad", "Flamenco", "Hula tanec", "Kozácky tanec", "Škótske gajdy", "Írsky step", "Indický tanec", "Africké bubny", "Čínsky dračí tanec",
  "Vedec v laboratóriu", "Archeológ pri vykopávkach", "Astronóm pri teleskope", "Potápač pri vraku", "Geológ s kladivkom", "Meteorológ pri stanici", "Chemik so skúmavkou", "Botanik s lupou", "Zoológ v teréne", "Ornitológ s ďalekohľadom",
  "Vysoké koleso", "Rikša", "Konský povoz", "Psí záprah", "Sobí záprah", "Plť na rieke", "Jazda na slonovi", "Vznášadlo", "Bicykel pre dvoch", "Motorka s košom",
  "Zaseknutý v okne", "Prilepená ruka", "Zamotaný v hadici", "Zamotaný v kábloch", "Uviaznutý v bahne", "Zavesený na konári", "Kĺzanie po ľade", "Pošmyknutie na kôre", "Stúpenie na hrable", "Zapletený do švihadla",
  "Ohňostroj nad mestom", "Slávnostná prehliadka", "Historický sprievod", "Otvorenie olympiády", "Olympijská pochodeň", "Odhalenie sochy", "Prestrihnutie stuhy", "Krst lode", "Ovácie na štadióne", "Záverečná poklona",
] as const;


const TARGETS: Record<CharadesDifficulty, number> = { lahke: 800, stredne: 800, tazke: 400 };

/**
 * Katalóg je ručne písaný, takže sa nič negeneruje ani nedopĺňa. Kontrola len
 * potvrdí, že každá karta spĺňa pravidlá šarád a že v celej databáze nie je
 * žiadny duplikát ani nesprávny počet kariet.
 */
function buildTier(difficulty: CharadesDifficulty, cards: readonly string[], used: Set<string>) {
  const tier = cards.map((card) => card.trim().replace(/\s+/g, " "));
  const invalid = tier.filter((card) => !isValidCharadeText(card));
  if (invalid.length) throw new Error(`Neplatné šarády (${difficulty}): ${invalid.join(", ")}`);
  const duplicates: string[] = [];
  for (const card of tier) {
    const key = card.toLocaleLowerCase("sk");
    if (used.has(key)) duplicates.push(card);
    used.add(key);
  }
  if (duplicates.length) throw new Error(`Duplicitné šarády (${difficulty}): ${duplicates.join(", ")}`);
  if (tier.length !== TARGETS[difficulty]) {
    throw new Error(`Nesprávny počet šarád: ${difficulty} (${tier.length}/${TARGETS[difficulty]})`);
  }
  return tier;
}

const globallyUsed = new Set<string>();
export const SOLO_CHARADES_WORDS: Record<CharadesDifficulty, string[]> = {
  lahke: buildTier("lahke", EASY_CARDS, globallyUsed),
  stredne: buildTier("stredne", MEDIUM_CARDS, globallyUsed),
  tazke: buildTier("tazke", HARD_CARDS, globallyUsed),
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
