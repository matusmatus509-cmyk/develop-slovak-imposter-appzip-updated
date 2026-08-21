// Zdroj pravdy pre slovenskú databázu party kvízu.
//
// Prečo skript a nie ručne písaný JSON:
//  - `correctIndex` sa v hre NIKDY nemieša (Quiz.tsx vypisuje `options` v poradí zo súboru),
//    takže správna odpoveď musí byť rovnomerne rozhodená po všetkých štyroch pozíciách.
//  - po bzučnutí sa možnosti skryjú a tím vyberá písmeno naspamäť, preto musia byť krátke.
//  - schéma (`answer === options[correctIndex]`, unikátne `id`/`factKey`) sa dá garantovať len generovaním.
//
// Spustenie:  node scripts/build-party-quiz-sk.mjs
//
// Formát položky: ["otázka", "správna odpoveď", "nesprávna", "nesprávna", "nesprávna"]
// Pravidlá obsahu: žiadne "v ktorom roku", žiadna aritmetika, žiadne memorovanie presných čísel,
// tri rozumné (nie absurdné) nesprávne možnosti z rovnakej kategórie ako správna odpoveď.

const CATALOG = [
  // ─────────────────────────────────────────────────────────────────────────
  {
    category: "🐾 Zvieratá",
    difficulty: "lahke",
    items: [
      ["Ktoré zviera dokáže spať postojačky?", "Kôň", "Mačka", "Pes", "Králik"],
      [
        "Ktoré zviera je najrýchlejšie na súši?",
        "Gepard",
        "Kôň",
        "Lev",
        "Pštros",
      ],
      [
        "Ktoré zviera dokáže meniť farbu?",
        "Chameleón",
        "Ježko",
        "Bobor",
        "Krtko",
      ],
      [
        "Ktoré zviera dokáže napodobniť ľudskú reč?",
        "Papagáj",
        "Holub",
        "Kačica",
        "Sova",
      ],
      [
        "Ktoré je najväčšie zviera na svete?",
        "Modrá veľryba",
        "Slon",
        "Žirafa",
        "Nosorožec",
      ],
      ["Ktoré zviera je známe tým, že pradie?", "Mačka", "Pes", "Koza", "Ovca"],
      [
        "Ktorý vták nedokáže lietať?",
        "Tučniak",
        "Lastovička",
        "Sokol",
        "Čajka",
      ],
      [
        "Ktoré zviera má na tele pancier a chodí bokom?",
        "Krab",
        "Žaba",
        "Had",
        "Slimák",
      ],
      ["Ktoré zviera nosí mláďa vo vaku?", "Klokan", "Zebra", "Tiger", "Vlk"],
      [
        "Ktorý cicavec dokáže lietať?",
        "Netopier",
        "Veverička",
        "Krtko",
        "Zajac",
      ],
      ["Ktoré zviera je najvyššie na svete?", "Žirafa", "Slon", "Ťava", "Kôň"],
      ["Koľko nôh má pavúk?", "Osem", "Šesť", "Desať", "Dvanásť"],
      ["Koľko nôh má mucha?", "Šesť", "Štyri", "Osem", "Desať"],
      [
        "Ktoré zviera dáva mlieko, z ktorého je väčšina syrov?",
        "Krava",
        "Kôň",
        "Sliepka",
        "Koza",
      ],
      [
        "Ktoré zviera je najlepší symbol pomalosti?",
        "Slimák",
        "Zajac",
        "Gepard",
        "Sokol",
      ],
      ["Ktoré zviera žije v úli a robí med?", "Včela", "Osa", "Mucha", "Komár"],
      [
        "Ktoré zviera má na chrbte pichliače?",
        "Ježko",
        "Krtko",
        "Myš",
        "Veverička",
      ],
      [
        "Je delfín ryba alebo cicavec?",
        "Cicavec",
        "Ryba",
        "Plaz",
        "Obojživelník",
      ],
      [
        "Ktoré zviera stavia hrádze na potokoch?",
        "Bobor",
        "Vydra",
        "Krtko",
        "Jazvec",
      ],
      ["Ktoré zviera má chobot?", "Slon", "Hroch", "Nosorožec", "Byvol"],
      [
        "Ktoré zviera je najznámejšie tým, že sa vešia na strom hlavou dole?",
        "Netopier",
        "Opica",
        "Mačka",
        "Sova",
      ],
      [
        "Ktorý pes je známy ako záchranár v horách?",
        "Svätobernardský",
        "Jazvečík",
        "Čivava",
        "Pudel",
      ],
      [
        "Ktoré zviera znáša najväčšie vajcia?",
        "Pštros",
        "Sliepka",
        "Hus",
        "Labuť",
      ],
      [
        "Ktoré zviera je v rozprávkach známe ako kráľ zvierat?",
        "Lev",
        "Tiger",
        "Medveď",
        "Vlk",
      ],
      [
        "Ktoré zviera prezimuje spánkom v brlohu?",
        "Medveď",
        "Srnka",
        "Diviak",
        "Vlk",
      ],
      [
        "Ktoré zviera má čierno-biele pruhy?",
        "Zebra",
        "Antilopa",
        "Lama",
        "Ťava",
      ],
      [
        "Ktoré zviera sa dokáže zvinúť do klbka?",
        "Ježko",
        "Myš",
        "Veverička",
        "Kuna",
      ],
      [
        "Ktoré zviera je najbližší príbuzný človeka?",
        "Šimpanz",
        "Pes",
        "Delfín",
        "Kôň",
      ],
      [
        "Ktoré zviera žije v mušli a nosí si dom na chrbte?",
        "Slimák",
        "Žaba",
        "Rak",
        "Chobotnica",
      ],
      [
        "Ktorá ryba je známa svojimi ostrými zubami a plutvou nad hladinou?",
        "Žralok",
        "Kapor",
        "Losos",
        "Pstruh",
      ],
      ["Ktoré zviera kváka?", "Žaba", "Had", "Jašterica", "Rak"],
      [
        "Ktoré zviera je známe tým, že sa hrabe v zemi a robí kopčeky?",
        "Krtko",
        "Zajac",
        "Ježko",
        "Veverička",
      ],
      [
        "Ktoré zviera zbiera oriešky na zimu?",
        "Veverička",
        "Krtko",
        "Netopier",
        "Kuna",
      ],
      [
        "Ktoré zviera je symbolom vernosti a hovorí sa mu najlepší priateľ človeka?",
        "Pes",
        "Mačka",
        "Kôň",
        "Papagáj",
      ],
      [
        "Ktoré zviera dokáže pri nebezpečenstve vypustiť čierne farbivo?",
        "Chobotnica",
        "Delfín",
        "Žralok",
        "Korytnačka",
      ],
      [
        "Ktoré zviera má na krídlach farebný prach a vylieta z kukly?",
        "Motýľ",
        "Včela",
        "Osa",
        "Vážka",
      ],
      [
        "Ktorý hlodavec je oblúbeným domácim zvieratkom v klietke s kolieskom?",
        "Škrečok",
        "Ježko",
        "Krtko",
        "Veverička",
      ],
      [
        "Ktoré zviera dokáže zadržať dych a plávať pod vodou celé minúty?",
        "Tuleň",
        "Sliepka",
        "Vrabec",
        "Zajac",
      ],
      ["Ktoré zviera má na chrbte horb?", "Ťava", "Lama", "Kôň", "Osol"],
      ["Ktorá mačka je najväčšia?", "Tiger", "Leopard", "Puma", "Rys"],
    ],
  },
  {
    category: "🐾 Zvieratá",
    difficulty: "tazke",
    items: [
      [
        "Ktoré zviera má tri srdcia?",
        "Chobotnica",
        "Delfín",
        "Žralok",
        "Tuleň",
      ],
      [
        "Ktoré zviera dokáže prežiť niekoľko dní aj bez hlavy?",
        "Šváb",
        "Mucha",
        "Pavúk",
        "Slimák",
      ],
      [
        "Ktoré zviera má odtlačky prstov takmer nerozoznateľné od ľudských?",
        "Koala",
        "Šimpanz",
        "Delfín",
        "Medveď",
      ],
      [
        "Ktoré zviera má trus v tvare kocky?",
        "Vombat",
        "Klokan",
        "Koala",
        "Lama",
      ],
      [
        "Ktoré zviera má najväčšie oči na svete?",
        "Krakatica",
        "Slon",
        "Veľryba",
        "Sova",
      ],
      ["Čo si ťava ukladá v horbe?", "Tuk", "Vodu", "Vzduch", "Piesok"],
      [
        "Akú farbu má koža polárneho medveďa?",
        "Čiernu",
        "Bielu",
        "Ružovú",
        "Sivú",
      ],
      [
        "Ktoré zviera dokáže znovu vyrastiť odtrhnutú končatinu?",
        "Hviezdica",
        "Delfín",
        "Netopier",
        "Kôň",
      ],
      [
        "U ktorého zvieraťa nosí mláďatá samec?",
        "Morský koník",
        "Delfín",
        "Tuleň",
        "Krab",
      ],
      ["Akú farbu má krv chobotnice?", "Modrú", "Červenú", "Zelenú", "Žltú"],
      [
        "Ktoré zviera sa nedokáže odraziť a vyskočiť?",
        "Slon",
        "Kôň",
        "Zebra",
        "Ťava",
      ],
      [
        "Akú farbu má jazyk žirafy?",
        "Tmavofialovú",
        "Ružovú",
        "Bielu",
        "Zelenú",
      ],
      [
        "Ktorý cicavec kladie vajcia?",
        "Vtákopysk",
        "Netopier",
        "Krtko",
        "Tuleň",
      ],
      [
        "Prečo je plameniak ružový?",
        "Kvôli potrave",
        "Kvôli slnku",
        "Kvôli vode",
        "Kvôli veku",
      ],
      ["Ktoré zviera nemá mozog?", "Medúza", "Myš", "Žaba", "Slimák"],
      [
        "Ktorá veľká mačka nedokáže revať, ale pradie?",
        "Gepard",
        "Lev",
        "Tiger",
        "Leopard",
      ],
      [
        "Ktoré zviera má na jazyku tisíce drobných zúbkov?",
        "Slimák",
        "Žaba",
        "Motýľ",
        "Mucha",
      ],
      [
        "Čím had cíti pachy vo vzduchu?",
        "Jazykom",
        "Ušami",
        "Očami",
        "Chvostom",
      ],
      [
        "Ktoré zviera sa takmer nedokáže pohybovať dozadu?",
        "Klokan",
        "Zajac",
        "Mačka",
        "Krava",
      ],
      [
        "Ktoré zviera má kostru z chrupavky namiesto kostí?",
        "Žralok",
        "Kapor",
        "Delfín",
        "Tuleň",
      ],
      ["Koľko oddelení má žalúdok kravy?", "Štyri", "Dve", "Tri", "Šesť"],
      [
        "Ktorý živočích prežije aj v extrémnom mraze i vo vákuu?",
        "Pomalka",
        "Mravec",
        "Šváb",
        "Slimák",
      ],
      [
        "Ktoré zviera je zodpovedné za najviac úmrtí ľudí ročne?",
        "Komár",
        "Žralok",
        "Lev",
        "Had",
      ],
      [
        "Ako dlho dokáže žiť korytnačka?",
        "Viac ako sto rokov",
        "Asi desať rokov",
        "Asi dvadsať rokov",
        "Asi päť rokov",
      ],
      [
        "Ktorý vták dokáže otočiť hlavu takmer dozadu?",
        "Sova",
        "Orol",
        "Holub",
        "Vrabec",
      ],
      [
        "Ktorý živočích má najsilnejší úchop v pomere k svojej veľkosti?",
        "Mravec",
        "Medveď",
        "Krokodíl",
        "Slon",
      ],
      ["Ktoré zviera po žihnutí zahynie?", "Včela", "Osa", "Komár", "Pavúk"],
      [
        "Ktoré komáre pijú krv?",
        "Iba samice",
        "Iba samce",
        "Obe rovnako",
        "Ani jedno",
      ],
      [
        "Ktorý živočích má osem chápadiel?",
        "Chobotnica",
        "Medúza",
        "Krab",
        "Hviezdica",
      ],
      [
        "Ktorý vták dokáže spať aj počas letu?",
        "Dážďovník",
        "Sliepka",
        "Tučniak",
        "Páv",
      ],
      [
        "Ktorý obojživelník je známy tým, že dorastá končatiny celý život?",
        "Axolotl",
        "Ropucha",
        "Salamandra",
        "Mlok",
      ],
      [
        "Ktoré zviera má na koži prísavky?",
        "Chobotnica",
        "Žralok",
        "Delfín",
        "Tuleň",
      ],
      [
        "Ktorý vták je najrýchlejší pri strmhlavom lete?",
        "Sokol sťahovavý",
        "Orol",
        "Sova",
        "Holub",
      ],
      [
        "Ktoré zviera vidí svet takmer dokola bez otočenia hlavy?",
        "Chameleón",
        "Pes",
        "Mačka",
        "Kôň",
      ],
      [
        "Ktoré zviera dokáže vydávať elektrické výboje?",
        "Elektrický úhor",
        "Kapor",
        "Losos",
        "Pstruh",
      ],
    ],
  },
];

CATALOG.push(
  {
    category: "🍔 Jedlo a pitie",
    difficulty: "lahke",
    items: [
      [
        "Ktoré ovocie je základom guacamole?",
        "Avokádo",
        "Banán",
        "Mango",
        "Hruška",
      ],
      [
        "Ktorý nápoj sa vyrába z pražených zŕn?",
        "Káva",
        "Čaj",
        "Mlieko",
        "Limonáda",
      ],
      [
        "Z čoho sa vyrába popcorn?",
        "Z kukurice",
        "Z pšenice",
        "Z ryže",
        "Zo sóje",
      ],
      [
        "Z čoho sa vyrába čokoláda?",
        "Z kakaa",
        "Z kávy",
        "Z orechov",
        "Z medu",
      ],
      ["Kto vyrába med?", "Včely", "Osy", "Mravce", "Motýle"],
      [
        "Z čoho sa vyrába olivový olej?",
        "Z olív",
        "Zo slnečnice",
        "Z repky",
        "Z kukurice",
      ],
      [
        "Z ktorej krajiny pochádza sushi?",
        "Z Japonska",
        "Z Číny",
        "Z Kórey",
        "Z Thajska",
      ],
      [
        "Z ktorej krajiny pochádza pizza?",
        "Z Itálie",
        "Z Grécka",
        "Zo Španielska",
        "Z Francúzska",
      ],
      [
        "Z ktorej krajiny pochádzajú tacos?",
        "Z Mexika",
        "Z Brazílie",
        "Z Peru",
        "Z Kuby",
      ],
      [
        "Z ktorej krajiny pochádza croissant?",
        "Z Francúzska",
        "Z Belgicka",
        "Z Rakúska",
        "Z Nemecka",
      ],
      [
        "Ktoré jedlo je považované za slovenskú klasiku?",
        "Bryndzové halušky",
        "Gulášová polievka",
        "Rizoto",
        "Palacinky",
      ],
      [
        "Ktorý syr je známy veľkými dierami?",
        "Ementál",
        "Mozzarella",
        "Feta",
        "Parmezán",
      ],
      [
        "Z čoho sa vyrába kečup?",
        "Z paradajok",
        "Z papriky",
        "Z jabĺk",
        "Z mrkvy",
      ],
      [
        "Čo spôsobuje, že chlieb pri pečení nakysne?",
        "Droždie",
        "Soľ",
        "Cukor",
        "Olej",
      ],
      [
        "Pri krájaní ktorej zeleniny slzia oči?",
        "Cibuľa",
        "Mrkva",
        "Uhorka",
        "Kapusta",
      ],
      ["Kde rastú zemiaky?", "Pod zemou", "Na strome", "Na kríku", "Vo vode"],
      ["Ktoré zviera nám dáva vajcia?", "Sliepka", "Krava", "Koza", "Ovca"],
      ["Z čoho sa vyrába maslo?", "Zo smotany", "Z oleja", "Z vody", "Z múky"],
      [
        "Z čoho sa vyrába víno?",
        "Z hrozna",
        "Z jabĺk",
        "Z chmeľu",
        "Zo sliviek",
      ],
      [
        "Z čoho sa mele biela múka?",
        "Z pšenice",
        "Z ryže",
        "Z kukurice",
        "Zo zemiakov",
      ],
      ["Z čoho sa robí čaj?", "Z listov", "Z koreňov", "Zo semien", "Z kôry"],
      [
        "Pri akej teplote voda vrie?",
        "Pri 100 °C",
        "Pri 80 °C",
        "Pri 120 °C",
        "Pri 60 °C",
      ],
      [
        "Čo urobí ľad, keď ho hodíš do vody?",
        "Bude plávať",
        "Potopí sa",
        "Rozpustí sa hneď",
        "Zmení farbu",
      ],
      [
        "Ktoré ovocie má semienka na povrchu?",
        "Jahoda",
        "Jablko",
        "Pomaranč",
        "Hruška",
      ],
      [
        "Ktoré ovocie je typicky veľmi kyslé?",
        "Citrón",
        "Banán",
        "Melón",
        "Hruška",
      ],
      [
        "Z čoho sú hrozienka?",
        "Zo sušeného hrozna",
        "Zo sušených sliviek",
        "Zo sušených jabĺk",
        "Zo sušených hrušiek",
      ],
      [
        "Ako sa nazýva kvasená kapusta?",
        "Kyslá kapusta",
        "Sladká kapusta",
        "Pečená kapusta",
        "Solená kapusta",
      ],
      [
        "Ktoré korenie je typické pre guláš?",
        "Paprika",
        "Vanilka",
        "Škorica",
        "Bazalka",
      ],
      [
        "Ktorý nápoj sa tradične varí z chmeľu a obilia?",
        "Pivo",
        "Víno",
        "Čaj",
        "Káva",
      ],
      ["Čo je základom klasického tiramisu?", "Káva", "Čaj", "Pomaranč", "Med"],
      [
        "Ktorá zelenina je oranžová a chrumkavá?",
        "Mrkva",
        "Kapusta",
        "Cibuľa",
        "Cuketa",
      ],
      [
        "Čo sa pridáva do jedla, aby bolo slanšie?",
        "Soľ",
        "Cukor",
        "Ocot",
        "Škrob",
      ],
      [
        "Ktoré jedlo sa podáva v rožku s mäsom a zeleninou?",
        "Hamburger",
        "Rizoto",
        "Polievka",
        "Palacinka",
      ],
      [
        "Aká je hlavná ingrediencia v omelete?",
        "Vajcia",
        "Múka",
        "Mlieko",
        "Ryža",
      ],
      [
        "Ktorý nápoj deti pijú najčastejšie k obedu?",
        "Džús",
        "Espresso",
        "Víno",
        "Pivo",
      ],
      [
        "Čo vzniká, keď smotanu dlho šľaháš?",
        "Šľahačka",
        "Syr",
        "Maslo",
        "Jogurt",
      ],
      ["Ktorá časť rastliny je brokolica?", "Kvet", "Koreň", "List", "Semeno"],
      [
        "Ako sa nazýva sladké pečivo s dierou v strede?",
        "Šiška",
        "Rožok",
        "Bageta",
        "Praclík",
      ],
      [
        "Ktoré mäso je základom klasického rezňa?",
        "Kuracie",
        "Rybie",
        "Konské",
        "Kačacie",
      ],
      [
        "Čo sa dáva do kávy, aby bola svetlejšia?",
        "Mlieko",
        "Ocot",
        "Soľ",
        "Olej",
      ],
      [
        "Ktorá zelenina je základom francúzskej cibuľovej polievky?",
        "Cibuľa",
        "Mrkva",
        "Zeler",
        "Paprika",
      ],
      [
        "Aké ovocie sa najčastejšie používa do štrúdle?",
        "Jablko",
        "Banán",
        "Ananás",
        "Melón",
      ],
      [
        "Ktorý nápoj sa pije z malej šálky a je veľmi silný?",
        "Espresso",
        "Limonáda",
        "Mlieko",
        "Džús",
      ],
      ["Čo je hlavnou zložkou hummusu?", "Cícer", "Fazuľa", "Ryža", "Kukurica"],
      [
        "Ktoré more je také slané, že sa v ňom ľahko pláva?",
        "Mŕtve more",
        "Čierne more",
        "Baltské more",
        "Jadranské more",
      ],
    ],
  },
  {
    category: "🍔 Jedlo a pitie",
    difficulty: "tazke",
    items: [
      [
        "Sú arašidy botanicky orechy?",
        "Nie, sú lúšteniny",
        "Áno, sú orechy",
        "Sú to semená tráv",
        "Sú to bobule",
      ],
      [
        "Čím je paradajka botanicky?",
        "Ovocím",
        "Zeleninou",
        "Obilninou",
        "Korením",
      ],
      [
        "Ktoré z týchto je botanicky bobuľa?",
        "Banán",
        "Jahoda",
        "Malina",
        "Černica",
      ],
      [
        "Z akej rastliny sa získava vanilka?",
        "Z orchidey",
        "Z paliny",
        "Z papradia",
        "Z kaktusu",
      ],
      [
        "Ktoré korenie je najdrahšie na svete?",
        "Šafran",
        "Škorica",
        "Vanilka",
        "Kardamóm",
      ],
      [
        "Kde rastie ananás?",
        "Nízko pri zemi",
        "Na palme",
        "Na strome",
        "Pod zemou",
      ],
      [
        "Čo sa stane s medom po mnohých rokoch?",
        "Nekazí sa",
        "Rýchlo splesnivie",
        "Zmení sa na ocot",
        "Vyprchá",
      ],
      [
        "Z čoho sa získava škorica?",
        "Z kôry stromu",
        "Z koreňa",
        "Zo semien",
        "Z kvetov",
      ],
      [
        "Z ktorej rastliny je zelený aj čierny čaj?",
        "Z tej istej",
        "Z dvoch rôznych",
        "Z troch rôznych",
        "Zelený je z mäty",
      ],
      [
        "Čo v čokoláde chýba bielej čokoláde?",
        "Kakaová hmota",
        "Cukor",
        "Mlieko",
        "Kakaové maslo",
      ],
      [
        "Ktoré jedlo sa v Japonsku podáva ako veľmi ostrá zelená pasta?",
        "Wasabi",
        "Miso",
        "Tofu",
        "Nori",
      ],
      [
        "Čo dáva čili paprike jej pálivosť?",
        "Kapsaicín",
        "Kofeín",
        "Kyselina citrónová",
        "Chlorofyl",
      ],
      [
        "Z akého mlieka sa tradične vyrába pravá mozzarella?",
        "Z byvolieho",
        "Z kozieho",
        "Z ovčieho",
        "Z kobylieho",
      ],
      [
        "Akú farbu mala mrkva pôvodne, skôr než ju vyšľachtili?",
        "Fialovú",
        "Bielu",
        "Červenú",
        "Zelenú",
      ],
      ["Čo je botanicky zemiak?", "Hľuza", "Koreň", "Plod", "Semeno"],
      [
        "Ktorá časť muškátového orieška sa používa ako korenie?",
        "Semeno",
        "List",
        "Kvet",
        "Kôra",
      ],
      [
        "Ktorý cukor je hlavným cukrom v mlieku?",
        "Laktóza",
        "Fruktóza",
        "Sacharóza",
        "Glukóza",
      ],
      [
        "Z čoho sa vyrába sójová omáčka?",
        "Z fermentovanej sóje",
        "Z rýb",
        "Z riasy",
        "Z ryže",
      ],
      [
        "Ktoré ovocie obsahuje enzým, ktorý bráni tuhnutiu želatíny?",
        "Ananás",
        "Jablko",
        "Hruška",
        "Banán",
      ],
      [
        "Prečo sa jablko po nakrojení zhnedne?",
        "Reaguje so vzduchom",
        "Vysychá",
        "Kysne",
        "Mrzne",
      ],
      [
        "Čo je kvások v pečení?",
        "Živá kultúra",
        "Druh múky",
        "Druh cukru",
        "Druh soli",
      ],
      [
        "Ktorá zelenina obsahuje najviac vody?",
        "Uhorka",
        "Mrkva",
        "Zemiak",
        "Cibuľa",
      ],
      [
        "Ako sa nazýva proces, pri ktorom sa z hrozna stáva víno?",
        "Fermentácia",
        "Destilácia",
        "Pasterizácia",
        "Filtrácia",
      ],
      [
        "Prečo sa cesto s droždím zväčšuje?",
        "Vzniká oxid uhličitý",
        "Nasáva vodu",
        "Zahrieva sa",
        "Tvrdne",
      ],
      [
        "Ktorý druh ryže sa používa na rizoto?",
        "Arborio",
        "Basmati",
        "Jazmínová",
        "Divá",
      ],
    ],
  }
);

CATALOG.push(
  {
    category: "🔬 Veda a telo",
    difficulty: "lahke",
    items: [
      [
        "Ktorá planéta je známa ako Červená planéta?",
        "Mars",
        "Venuša",
        "Jupiter",
        "Saturn",
      ],
      [
        "Čo sa stane s vodou pri teplote 0 °C?",
        "Zamrzne",
        "Zavrie",
        "Vyparí sa",
        "Zmení farbu",
      ],
      [
        "Čo vznikne zmiešaním červenej a modrej?",
        "Fialová",
        "Zelená",
        "Oranžová",
        "Hnedá",
      ],
      [
        "Čo vznikne zmiešaním žltej a modrej?",
        "Zelená",
        "Fialová",
        "Oranžová",
        "Ružová",
      ],
      [
        "Ktorý orgán pumpuje krv po tele?",
        "Srdce",
        "Pľúca",
        "Žalúdok",
        "Pečeň",
      ],
      ["Ktorým orgánom dýchame?", "Pľúcami", "Srdcom", "Obličkami", "Žalúdkom"],
      ["Čím sa meria teplota?", "Teplomerom", "Váhou", "Pravítkom", "Kompasom"],
      [
        "Kam ukazuje strelka kompasu?",
        "Na severe",
        "Na juh",
        "Na východ",
        "Na západ",
      ],
      [
        "Je Slnko hviezda alebo planéta?",
        "Hviezda",
        "Planéta",
        "Mesiac",
        "Kométa",
      ],
      [
        "Ktorá planéta má výrazné prstence?",
        "Saturn",
        "Mars",
        "Venuša",
        "Merkúr",
      ],
      [
        "Ktorá planéta je najväčšia v našej sústave?",
        "Jupiter",
        "Saturn",
        "Zem",
        "Neptún",
      ],
      ["Čo obieha okolo Zeme?", "Mesiac", "Slnko", "Mars", "Venuša"],
      [
        "Za aký čas sa Zem raz otočí okolo svojej osi?",
        "Za 24 hodín",
        "Za 12 hodín",
        "Za 48 hodín",
        "Za týždeň",
      ],
      ["Koľko dní má obyčajný rok?", "365", "360", "370", "355"],
      [
        "Na ktorej strane vychádza Slnko?",
        "Na východe",
        "Na západe",
        "Na severe",
        "Na juhu",
      ],
      ["Čo priťahuje magnet?", "Železo", "Drevo", "Sklo", "Plast"],
      ["Z čoho je ľad?", "Z vody", "Zo soli", "Z cukru", "Zo vzduchu"],
      [
        "Čo vyrábajú rastliny pri fotosyntéze?",
        "Kyslík",
        "Dusík",
        "Hélium",
        "Vodík",
      ],
      ["Čo potrebuje semienko, aby vyklíčilo?", "Vodu", "Soľ", "Ocot", "Olej"],
      ["Koľko farieb má klasická dúha?", "Sedem", "Päť", "Tri", "Deväť"],
      [
        "Čo vidíme pri búrke skôr?",
        "Blesk",
        "Hrom",
        "Obe naraz",
        "Záleží od vetra",
      ],
      [
        "Ktorou zmyslovou sústavou cítime vône?",
        "Nosom",
        "Očami",
        "Ušami",
        "Kožou",
      ],
      ["Ktorý orgán je zodpovedný za chuť?", "Jazyk", "Nos", "Oko", "Ucho"],
      ["Aká je chemická skratka vody?", "H₂O", "CO₂", "O₂", "NaCl"],
      ["Aká je chemická skratka soli?", "NaCl", "H₂O", "CO₂", "Fe"],
      ["Aká je chemická značka zlata?", "Au", "Ag", "Fe", "Cu"],
      [
        "Čo drží predmety na Zemi?",
        "Gravitácia",
        "Magnetizmus",
        "Elektrina",
        "Tlak",
      ],
      ["Kde v tele máme lebku?", "V hlave", "V hrudi", "V nohe", "V ruke"],
      ["Ktorý orgán trávi jedlo?", "Žalúdok", "Srdce", "Pľúca", "Mozog"],
      [
        "Kde v tele prúdi krv?",
        "V žilách",
        "V nervoch",
        "V kostiach",
        "Vo svaloch",
      ],
      [
        "Čo je najtvrdšia časť ľudského tela?",
        "Zubná sklovina",
        "Kosť",
        "Necht",
        "Chrupavka",
      ],
      ["Ktorý orgán riadi myslenie?", "Mozog", "Srdce", "Pečeň", "Pľúca"],
      [
        "Ako sa nazýva farbivo, ktoré robí listy zelenými?",
        "Chlorofyl",
        "Hemoglobín",
        "Melanín",
        "Karotén",
      ],
      [
        "Ktorá rastlina prežije v púšti s minimom vody?",
        "Kaktus",
        "Ruža",
        "Papraď",
        "Tulipán",
      ],
      ["Čo vzniká z vody pri zahrievaní?", "Para", "Ľad", "Soľ", "Piesok"],
      ["Ktorá časť stromu je pod zemou?", "Korene", "Kôra", "Listy", "Konáre"],
      [
        "Ako sa nazýva jav, keď Mesiac zakryje Slnko?",
        "Zatmenie Slnka",
        "Zatmenie Mesiaca",
        "Polárna žiara",
        "Spln",
      ],
      ["Aké skupenstvo má vodná para?", "Plynné", "Kvapalné", "Tuhé", "Žiadne"],
      ["Ktorý plyn dýchame na prežitie?", "Kyslík", "Dusík", "Hélium", "Metán"],
      [
        "Ktorá farba na slnku najviac hreje?",
        "Čierna",
        "Biela",
        "Žltá",
        "Svetlomodrá",
      ],
      [
        "Čo sa deje s balónom naplneným héliom?",
        "Letí vzhôru",
        "Padá dolu",
        "Zostane na mieste",
        "Praskne",
      ],
      [
        "Ktorý živočích patrí medzi plazy?",
        "Had",
        "Žaba",
        "Delfín",
        "Netopier",
      ],
      ["Ktorá časť rastliny nasáva vodu?", "Korene", "Kvet", "Plod", "Kôra"],
      [
        "Ktorá planéta je od Slnka najbližšia?",
        "Merkúr",
        "Venuša",
        "Zem",
        "Mars",
      ],
      [
        "Ako sa nazýva model Zeme v tvare gule?",
        "Glóbus",
        "Mapa",
        "Atlas",
        "Kompas",
      ],
    ],
  },
  {
    category: "🔬 Veda a telo",
    difficulty: "tazke",
    items: [
      [
        "Ktorý je najväčší orgán ľudského tela?",
        "Koža",
        "Pečeň",
        "Pľúca",
        "Mozog",
      ],
      [
        "Ktorého plynu je vo vzduchu najviac?",
        "Dusíka",
        "Kyslíka",
        "Oxidu uhličitého",
        "Hélia",
      ],
      [
        "Ako dlho letí svetlo zo Slnka na Zem?",
        "Asi 8 minút",
        "Asi sekundu",
        "Asi hodinu",
        "Asi deň",
      ],
      [
        "Kde sa zvuk šíri rýchlejšie?",
        "Vo vode",
        "Vo vzduchu",
        "Vo vákuu",
        "Všade rovnako",
      ],
      [
        "Kto má viac kostí?",
        "Novorodenec",
        "Dospelý človek",
        "Majú rovnako",
        "Záleží od výšky",
      ],
      ["Koľko kostí má typicky dospelý človek?", "206", "150", "280", "320"],
      ["Koľko zubov má typicky dospelý človek?", "32", "24", "28", "36"],
      [
        "Ktorá planéta je najhorúcejšia?",
        "Venuša",
        "Merkúr",
        "Mars",
        "Jupiter",
      ],
      [
        "Šíri sa zvuk vo vesmírnom vákuu?",
        "Nie",
        "Áno, rýchlejšie",
        "Áno, pomalšie",
        "Iba veľmi hlasný",
      ],
      [
        "Prečo je krv červená?",
        "Kvôli železu",
        "Kvôli vápniku",
        "Kvôli cukru",
        "Kvôli soli",
      ],
      [
        "Ktoré pľúca sú menšie?",
        "Ľavé",
        "Pravé",
        "Sú rovnaké",
        "Záleží od pohlavia",
      ],
      [
        "Asi z akej časti sa ľudské telo skladá z vody?",
        "Približne 60 %",
        "Približne 20 %",
        "Približne 40 %",
        "Približne 90 %",
      ],
      [
        "Kde nechty rastú rýchlejšie?",
        "Na rukách",
        "Na nohách",
        "Rovnako",
        "Záleží od veku",
      ],
      [
        "Z akého prvku je diamant?",
        "Z uhlíka",
        "Z kremíka",
        "Zo železa",
        "Z vápnika",
      ],
      [
        "Ktorá časť oka určuje jeho farbu?",
        "Dúhovka",
        "Zrenička",
        "Rohovka",
        "Šošovka",
      ],
      [
        "Aká je najvyššia možná rýchlosť vo vesmíre?",
        "Rýchlosť svetla",
        "Rýchlosť zvuku",
        "Rýchlosť Zeme",
        "Nie je žiadna hranica",
      ],
      [
        "Kto objavil penicilín?",
        "Alexander Fleming",
        "Louis Pasteur",
        "Isaac Newton",
        "Nikola Tesla",
      ],
      [
        "Kto sformuloval slávnu rovnicu E = mc²?",
        "Albert Einstein",
        "Isaac Newton",
        "Galileo Galilei",
        "Nikola Tesla",
      ],
      [
        "Kto je spájaný s vynálezom praktickej žiarovky?",
        "Thomas Edison",
        "Nikola Tesla",
        "Alexander Bell",
        "James Watt",
      ],
      [
        "Kto ako prvý opísal zákon gravitácie?",
        "Isaac Newton",
        "Albert Einstein",
        "Galileo Galilei",
        "Johannes Kepler",
      ],
      [
        "Ako sa nazýva látka, ktorá nesie dedičnú informáciu?",
        "DNA",
        "RNA",
        "ATP",
        "Hemoglobín",
      ],
      [
        "Ako sa mení tvoja hmotnosť na Mesiaci?",
        "Váhu cítiš nižšiu",
        "Váhu cítiš vyššiu",
        "Je rovnaká",
        "Zmizne úplne",
      ],
      [
        "Ktorá hviezda je Slnku najbližšia?",
        "Proxima Centauri",
        "Sírius",
        "Polárka",
        "Betelgeuze",
      ],
      [
        "Prečo je more slané?",
        "Soľ splavujú rieky",
        "Vyrábajú ju ryby",
        "Padá z oblohy",
        "Vzniká z vetra",
      ],
      [
        "Čo chráni Zem pred škodlivým UV žiarením?",
        "Ozónová vrstva",
        "Gravitácia",
        "Mesiac",
        "Oblaky",
      ],
      [
        "Ako sa nazýva jediná ľudská kosť, ktorá sa nespája s inou?",
        "Jazylka",
        "Kľúčna kosť",
        "Rebro",
        "Lopatka",
      ],
      [
        "Ktorý kov je pri bežnej teplote tekutý?",
        "Rtuť",
        "Olovo",
        "Hliník",
        "Meď",
      ],
      [
        "Ktorý orgán dokáže dorásť aj po odobraní časti?",
        "Pečeň",
        "Srdce",
        "Mozog",
        "Pľúca",
      ],
      [
        "Ktorá krvná skupina je označovaná ako univerzálny darca?",
        "0 negatívna",
        "AB pozitívna",
        "A pozitívna",
        "B negatívna",
      ],
      [
        "Prečo sú oblaky biele?",
        "Rozptyľujú svetlo",
        "Sú z ľadu",
        "Odrážajú more",
        "Sú horúce",
      ],
      [
        "Čo meria Richterova stupnica?",
        "Zemetrasenia",
        "Teplotu",
        "Vietor",
        "Hlasitosť",
      ],
      [
        "Ako sa nazýva zviera, ktoré má stálu telesnú teplotu?",
        "Teplokrvné",
        "Chladnokrvné",
        "Bezstavovce",
        "Obojživelníky",
      ],
      ["Ktorá planéta sa otáča na boku?", "Urán", "Mars", "Saturn", "Neptún"],
      [
        "Čo sa stane s objemom vody, keď zamrzne?",
        "Zväčší sa",
        "Zmenší sa",
        "Zostane rovnaký",
        "Zmizne",
      ],
      [
        "Ako sa nazýva najmenšia časť chemického prvku?",
        "Atóm",
        "Molekula",
        "Bunka",
        "Kryštál",
      ],
    ],
  }
);

CATALOG.push(
  {
    category: "🌍 Svet a miesta",
    difficulty: "lahke",
    items: [
      [
        "Aké je hlavné mesto Slovenska?",
        "Bratislava",
        "Košice",
        "Nitra",
        "Žilina",
      ],
      [
        "Ktorý je najvyšší vrch Slovenska?",
        "Gerlachovský štít",
        "Kriváň",
        "Rysy",
        "Chopok",
      ],
      [
        "Ktoré pohorie je najznámejšie na Slovensku?",
        "Tatry",
        "Alpy",
        "Karpaty v Rumunsku",
        "Pyreneje",
      ],
      [
        "Ktorá veľká rieka tečie cez Bratislavu?",
        "Dunaj",
        "Váh",
        "Hron",
        "Morava",
      ],
      [
        "V ktorom meste stojí Eiffelova veža?",
        "V Paríži",
        "V Ríme",
        "V Londýne",
        "V Madride",
      ],
      [
        "V ktorom meste stojí Koloseum?",
        "V Ríme",
        "V Aténach",
        "V Neapole",
        "V Miláne",
      ],
      [
        "V ktorom meste stojí Big Ben?",
        "V Londýne",
        "V Dubline",
        "V Edinburgu",
        "V Manchestri",
      ],
      [
        "V ktorom meste stojí Socha slobody?",
        "V New Yorku",
        "V Chicagu",
        "V Bostone",
        "V Miami",
      ],
      [
        "V ktorom meste je slávna šikmá veža?",
        "V Pise",
        "V Ríme",
        "V Bologni",
        "V Turíne",
      ],
      [
        "V ktorej krajine sú pyramídy v Gíze?",
        "V Egypte",
        "V Mexiku",
        "V Peru",
        "V Sudáne",
      ],
      [
        "V ktorej krajine je Veľký múr?",
        "V Číne",
        "V Japonsku",
        "V Indii",
        "V Mongolsku",
      ],
      [
        "V ktorom meste stojí opera s bielymi plachtami?",
        "V Sydney",
        "V Melbourne",
        "V Aucklande",
        "V Kapskom Meste",
      ],
      [
        "Ktorá je najvyššia hora sveta?",
        "Mount Everest",
        "Mont Blanc",
        "Kilimandžáro",
        "Elbrus",
      ],
      [
        "Ktorý oceán je najväčší?",
        "Tichý",
        "Atlantický",
        "Indický",
        "Severný ľadový",
      ],
      [
        "Ktorá je najväčšia horúca púšť?",
        "Sahara",
        "Gobi",
        "Atacama",
        "Kalahari",
      ],
      [
        "Ktorá je najdlhšia rieka Južnej Ameriky?",
        "Amazonka",
        "Paraná",
        "Orinoko",
        "Rio Grande",
      ],
      [
        "Na ktorom kontinente žijú klokany?",
        "V Austrálii",
        "V Afrike",
        "V Ázii",
        "V Amerike",
      ],
      [
        "V ktorej krajine žijú pandy?",
        "V Číne",
        "V Japonsku",
        "V Kórei",
        "Vo Vietname",
      ],
      [
        "Ktorá krajina je známa tulipánmi a vetrnými mlynmi?",
        "Holandsko",
        "Belgicko",
        "Dánsko",
        "Švédsko",
      ],
      [
        "Ktorý kontinent je najchladnejší?",
        "Antarktída",
        "Európa",
        "Ázia",
        "Južná Amerika",
      ],
      [
        "Ktorý je najmenší štát sveta?",
        "Vatikán",
        "Monako",
        "San Maríno",
        "Lichtenštajnsko",
      ],
      [
        "Ktorá krajina má tvar podobný vysokej čižme?",
        "Itália",
        "Španielsko",
        "Grécko",
        "Portugalsko",
      ],
      [
        "Ktoré mesto je známe kanálmi a gondolami?",
        "Venecia",
        "Amsterdam",
        "Hamburg",
        "Petrohrad",
      ],
      [
        "Aké je hlavné mesto Nemecka?",
        "Berlín",
        "Mníchov",
        "Hamburg",
        "Frankfurt",
      ],
      ["Aké je hlavné mesto Rakúska?", "Viedeň", "Salzburg", "Graz", "Linz"],
      ["Aké je hlavné mesto Česka?", "Praha", "Brno", "Ostrava", "Plzeň"],
      ["Aké je hlavné mesto Poľska?", "Varšava", "Krakov", "Gdansk", "Vroclav"],
      [
        "Aké je hlavné mesto Maďarska?",
        "Budapešť",
        "Debrecín",
        "Segedín",
        "Miškovec",
      ],
      [
        "Aké je hlavné mesto Španielska?",
        "Madrid",
        "Barcelona",
        "Valencia",
        "Sevilla",
      ],
      ["Aké je hlavné mesto Japonska?", "Tokio", "Kjóto", "Ósaka", "Nagoja"],
      [
        "Aké je hlavné mesto Kanady?",
        "Ottawa",
        "Toronto",
        "Vancouver",
        "Montreal",
      ],
      [
        "Na ktorom kontinente leží Slovensko?",
        "V Európe",
        "V Ázii",
        "V Afrike",
        "V Amerike",
      ],
      ["Koľko štátov susedí so Slovenskom?", "Päť", "Tri", "Štyri", "Šesť"],
      [
        "Akou menou sa platí na Slovensku?",
        "Eurom",
        "Korunou",
        "Dolárom",
        "Zlotým",
      ],
      [
        "Ktorý kontinent je najväčší?",
        "Ázia",
        "Afrika",
        "Európa",
        "Severná Amerika",
      ],
      [
        "Na ktorom kontinente je Sahara?",
        "V Afrike",
        "V Ázii",
        "V Austrálii",
        "V Amerike",
      ],
      [
        "Pri ktorom mori leží Chorvátsko?",
        "Pri Jadranskom",
        "Pri Čiernom",
        "Pri Baltskom",
        "Pri Kaspickom",
      ],
      ["Koľko svetadielov sa tradične uvádza?", "Sedem", "Päť", "Šesť", "Osem"],
      [
        "Ktoré mesto má slávny Central Park?",
        "New York",
        "Londýn",
        "Paríž",
        "Berlín",
      ],
      [
        "Ktoré mesto je známe kasínami v púšti?",
        "Las Vegas",
        "Miami",
        "Dallas",
        "Denver",
      ],
      [
        "Ktorá krajina je známa syrmi, baguettou a Provensálskom?",
        "Francúzsko",
        "Itália",
        "Grécko",
        "Portugalsko",
      ],
      [
        "Ktorý slovenský hrad je najznámejším symbolom hlavného mesta?",
        "Bratislavský hrad",
        "Spišský hrad",
        "Oravský hrad",
        "Devín",
      ],
      [
        "Ktoré slovenské mesto je druhé najväčšie?",
        "Košice",
        "Prešov",
        "Nitra",
        "Banská Bystrica",
      ],
      [
        "Ktorá krajina je známa fjordmi?",
        "Norsko",
        "Poľsko",
        "Írsko",
        "Grécko",
      ],
      [
        "Ktoré mesto je hlavným mestom Talianska?",
        "Rím",
        "Miláno",
        "Neapol",
        "Turín",
      ],
    ],
  },
  {
    category: "🌍 Svet a miesta",
    difficulty: "tazke",
    items: [
      [
        "Ktorá je najväčšia púšť sveta, ak počítame aj tie chladné?",
        "Antarktída",
        "Sahara",
        "Gobi",
        "Arktída",
      ],
      [
        "Ako sa nazýva najhlbšie miesto v oceáne?",
        "Mariánska priekopa",
        "Portorická priekopa",
        "Jávska priekopa",
        "Filipínska priekopa",
      ],
      [
        "Ktorý je najväčší ostrov sveta?",
        "Grónsko",
        "Austrália",
        "Madagaskar",
        "Borneo",
      ],
      ["Ktorá rieka tečie cez Egypt?", "Níl", "Kongo", "Zambezi", "Niger"],
      [
        "Ktoré jazero je najväčšie na svete?",
        "Kaspické more",
        "Bajkal",
        "Viktóriino jazero",
        "Michiganské jazero",
      ],
      [
        "Ktoré mesto leží na dvoch kontinentoch?",
        "Istanbul",
        "Kajro",
        "Atény",
        "Moskva",
      ],
      [
        "Ktoré je najsuchšie miesto na svete?",
        "Púšť Atacama",
        "Sahara",
        "Death Valley",
        "Gobi",
      ],
      [
        "Ktorá krajina zaberá celý kontinent?",
        "Austrália",
        "Rusko",
        "Kanada",
        "Brazília",
      ],
      [
        "Ktorá krajina je najväčšia rozlohou?",
        "Rusko",
        "Kanada",
        "Čína",
        "USA",
      ],
      [
        "V ktorom pohorí leží Mount Everest?",
        "V Himalájach",
        "V Andách",
        "V Alpách",
        "V Kaukaze",
      ],
      [
        "V ktorej krajine bol vynájdený papier?",
        "V Číne",
        "V Egypte",
        "V Grécku",
        "V Indii",
      ],
      [
        "Ktorá krajina sa nazýva krajinou tisícich jazier?",
        "Finsko",
        "Švédsko",
        "Kanada",
        "Norsko",
      ],
      [
        "Ktoré more je v skutočnosti obrovské jazero?",
        "Kaspické more",
        "Čierne more",
        "Baltské more",
        "Červené more",
      ],
      [
        "Ktorý prieplav spája Atlantický a Tichý oceán?",
        "Panamský",
        "Suezský",
        "Kielsky",
        "Korintský",
      ],
      [
        "Ktorý prieplav spája Stredozemné a Červené more?",
        "Suezský",
        "Panamský",
        "Kielsky",
        "Bosporský",
      ],
      [
        "Ktoré mesto sa nazýva Večné mesto?",
        "Rím",
        "Atény",
        "Jeruzalem",
        "Kajro",
      ],
      [
        "Ktoré mesto má prezývku Mesto svetiel?",
        "Paríž",
        "Las Vegas",
        "New York",
        "Tokio",
      ],
      [
        "Ktorý dažďový prales je najväčší?",
        "Amazonský",
        "Konžský",
        "Bornejský",
        "Indonézsky",
      ],
      [
        "Ktorá krajina má najdlhšie pobrežie?",
        "Kanada",
        "Rusko",
        "Austrália",
        "Indonézia",
      ],
      [
        "Ktoré pohorie tradične delí Európu a Áziu?",
        "Ural",
        "Kaukaz",
        "Alpy",
        "Karpaty",
      ],
      [
        "Ktorý je najväčší hrad na Slovensku?",
        "Spišský hrad",
        "Bratislavský hrad",
        "Oravský hrad",
        "Trenčiansky hrad",
      ],
      [
        "V ktorej krajine sa nachádza Machu Picchu?",
        "V Peru",
        "V Mexiku",
        "V Bolívii",
        "V Čile",
      ],
      [
        "Ktorý štát úplne obklopuje Vatikán?",
        "Itália",
        "Švajčiarsko",
        "Francúzsko",
        "Španielsko",
      ],
      [
        "Ktorý je druhý najmenší štát Európy?",
        "Monako",
        "San Maríno",
        "Lichtenštajnsko",
        "Malta",
      ],
      [
        "Ktorý vodopád je najvyšší na svete?",
        "Salto Ángel",
        "Niagarské vodopády",
        "Viktóriine vodopády",
        "Iguazú",
      ],
      [
        "Ktorá krajina má najviac obyvateľov v Európe?",
        "Nemecko",
        "Francúzsko",
        "Itália",
        "Španielsko",
      ],
      [
        "Ktoré more leží medzi Európou a Áziou?",
        "Čierne more",
        "Baltské more",
        "Jadranské more",
        "Severné more",
      ],
      ["Ktorá slovenská rieka je najdlhšia?", "Váh", "Hron", "Nitra", "Ipeľ"],
      [
        "Ktorý kontinent nemá žiadnu skutočnú púšť?",
        "Európa",
        "Ázia",
        "Afrika",
        "Austrália",
      ],
      [
        "Ktoré mesto je najsevernejšie hlavné mesto Európy?",
        "Reykjavík",
        "Oslo",
        "Helsinki",
        "Stockholm",
      ],
    ],
  }
);

CATALOG.push(
  {
    category: "⚖️ Čo je viac",
    difficulty: "lahke",
    items: [
      [
        "Čo je ťažšie – kilo peria alebo kilo železa?",
        "Vážia rovnako",
        "Kilo železa",
        "Kilo peria",
        "Nedá sa určiť",
      ],
      [
        "Čo je ťažšie – liter vody alebo liter oleja?",
        "Liter vody",
        "Liter oleja",
        "Vážia rovnako",
        "Záleží od teploty",
      ],
      [
        "Kde sa ľad rozpustí rýchlejšie – na slnku alebo v mrazničke?",
        "Na slnku",
        "V mrazničke",
        "Rovnako rýchlo",
        "Nikde",
      ],
      [
        "Čo je dlhšie – jeden kilometer alebo jedna míľa?",
        "Jedna míľa",
        "Jeden kilometer",
        "Sú rovnaké",
        "Záleží od krajiny",
      ],
      [
        "Ktoré z týchto zvierat je najťažšie?",
        "Hroch",
        "Žirafa",
        "Ľadový medveď",
        "Krokodíl",
      ],
      ["Ktorý z týchto vtákov je najväčší?", "Pštros", "Orol", "Labuť", "Páv"],
      [
        "Ktorá z týchto planét je najmenšia?",
        "Merkúr",
        "Mars",
        "Zem",
        "Venuša",
      ],
      [
        "Ktoré z týchto miest leží najviac na severe?",
        "Oslo",
        "Rím",
        "Madrid",
        "Atény",
      ],
      [
        "Ktorý z týchto oceánov je najmenší?",
        "Severný ľadový",
        "Tichý",
        "Atlantický",
        "Indický",
      ],
      [
        "Ktoré z týchto domácich zvierat žije najdlhšie?",
        "Korytnačka",
        "Pes",
        "Mačka",
        "Škrečok",
      ],
      [
        "Ktorý z týchto kontinentov je najmenší?",
        "Austrália",
        "Európa",
        "Antarktída",
        "Južná Amerika",
      ],
      [
        "Ktorá z týchto jednotiek je najväčšia?",
        "Tona",
        "Kilogram",
        "Gram",
        "Miligram",
      ],
      [
        "Ktorá z týchto jednotiek je najdlhšia?",
        "Kilometer",
        "Meter",
        "Centimeter",
        "Milimeter",
      ],
      [
        "Ktorý z týchto mesiacov má najmenej dní?",
        "Február",
        "Apríl",
        "Júl",
        "November",
      ],
      [
        "Ktoré z týchto zvierat je najmenšie?",
        "Mravec",
        "Myš",
        "Vrabec",
        "Žaba",
      ],
      [
        "Ktorá z týchto atletických disciplín trvá najdlhšie?",
        "Maratón",
        "Šprint",
        "Skok do diaľky",
        "Vrh guľou",
      ],
      [
        "Ktorý z týchto živočíchov má najviac nôh?",
        "Stonožka",
        "Pavúk",
        "Mucha",
        "Krab",
      ],
      [
        "Ktorý z týchto nástrojov má najnižší tón?",
        "Kontrabas",
        "Husle",
        "Flauta",
        "Trúbka",
      ],
      [
        "Ktorá z týchto vecí je najtvrdšia?",
        "Diamant",
        "Sklo",
        "Kameň",
        "Ocel",
      ],
      [
        "Ktorý z týchto nápojov má najviac kofeínu?",
        "Espresso",
        "Mlieko",
        "Džús",
        "Voda",
      ],
      [
        "Ktoré z týchto zvierat vidí najlepšie v noci?",
        "Sova",
        "Sliepka",
        "Holub",
        "Páv",
      ],
      [
        "Ktorý z týchto materiálov pláva na vode?",
        "Drevo",
        "Kameň",
        "Železo",
        "Sklo",
      ],
      [
        "Ktorá z týchto farieb je najsvetlejšia?",
        "Biela",
        "Čierna",
        "Modrá",
        "Hnedá",
      ],
      [
        "Ktorá z týchto zelenín je najpálivejšia?",
        "Čili paprika",
        "Sladká paprika",
        "Cibuľa",
        "Cesnak",
      ],
      ["Ktorý z týchto kovov je najľahší?", "Hliník", "Železo", "Olovo", "Meď"],
      [
        "Ktorý z týchto materiálov najlepšie vedie teplo?",
        "Kov",
        "Drevo",
        "Plast",
        "Guma",
      ],
      [
        "Ktorá z týchto rýchlostí je najvyššia?",
        "Rýchlosť svetla",
        "Rýchlosť zvuku",
        "Rýchlosť lietadla",
        "Rýchlosť auta",
      ],
      [
        "Ktoré z týchto ovocí je najväčšie?",
        "Melón",
        "Jablko",
        "Slivka",
        "Čerešňa",
      ],
      [
        "Ktorý z týchto dopravných prostriedkov je najrýchlejší?",
        "Lietadlo",
        "Vlak",
        "Auto",
        "Bicykel",
      ],
      [
        "Ktorá z týchto stavieb je zvyčajne najvyššia?",
        "Mrakodrap",
        "Panelák",
        "Chata",
        "Garáž",
      ],
      [
        "Ktorý z týchto útvarov obsahuje najviac vody?",
        "Oceán",
        "Jazero",
        "Rieka",
        "Potok",
      ],
      [
        "Ktoré z týchto zvierat je najvyššie?",
        "Žirafa",
        "Slon",
        "Ťava",
        "Byvol",
      ],
    ],
  },
  {
    category: "⚖️ Čo je viac",
    difficulty: "tazke",
    items: [
      [
        "Čo dopadne skôr vo vákuu – pierko alebo kladivo?",
        "Dopadnú naraz",
        "Kladivo",
        "Pierko",
        "Nedopadnú vôbec",
      ],
      [
        "Kto má viac krčných obratlov – človek alebo žirafa?",
        "Majú rovnako",
        "Žirafa",
        "Človek",
        "Žirafa ich nemá",
      ],
      [
        "Ktoré vajce pláva na vode?",
        "Skazené",
        "Čerstvé",
        "Obe plávajú",
        "Ani jedno",
      ],
      [
        "Čo trvá na Venuši dlhšie – jeden deň alebo jeden rok?",
        "Jeden deň",
        "Jeden rok",
        "Trvajú rovnako",
        "Venuša sa netočí",
      ],
      [
        "Čo je ťažšie – liter medu alebo liter vody?",
        "Liter medu",
        "Liter vody",
        "Vážia rovnako",
        "Záleží od druhu medu",
      ],
      [
        "Kto má viac chuťových pohárikov – dieťa alebo dospelý?",
        "Dieťa",
        "Dospelý",
        "Majú rovnako",
        "Záleží od stravy",
      ],
      [
        "Čo je rýchlejšie – kýchnutie alebo rýchla chôdza?",
        "Kýchnutie",
        "Rýchla chôdza",
        "Rovnako rýchle",
        "Záleží od človeka",
      ],
      [
        "Čo je väčšie – baktéria alebo vírus?",
        "Baktéria",
        "Vírus",
        "Sú rovnaké",
        "Záleží od druhu",
      ],
      [
        "Čo obsahuje viac vody – uhorka alebo paradajka?",
        "Uhorka",
        "Paradajka",
        "Rovnako",
        "Záleží od sezóny",
      ],
      [
        "Ktorá planéta má viac mesiacov – Zem alebo Mars?",
        "Mars",
        "Zem",
        "Majú rovnako",
        "Ani jedna nemá",
      ],
      [
        "Čo je staršie – egyptské pyramídy alebo Koloseum?",
        "Pyramídy",
        "Koloseum",
        "Sú rovnako staré",
        "Nedá sa určiť",
      ],
      [
        "Čo bolo vynájdené skôr – papier alebo knihtlač?",
        "Papier",
        "Knihtlač",
        "Naraz",
        "Nedá sa určiť",
      ],
      [
        "Ktorý z týchto kovov vedie elektrinu najlepšie?",
        "Striebro",
        "Meď",
        "Železo",
        "Hliník",
      ],
      [
        "Ktoré z týchto zvierat sa dožíva najvyššieho veku?",
        "Grónsky žralok",
        "Slon",
        "Papagáj",
        "Kôň",
      ],
      [
        "Ktorého plynu je vo vzduchu druhý najviac?",
        "Kyslíka",
        "Dusíka",
        "Hélia",
        "Metánu",
      ],
      [
        "Ktorá z týchto rán na tele sa hojí najrýchlejšie?",
        "V ústach",
        "Na kolene",
        "Na chodidle",
        "Na lokte",
      ],
      [
        "Ktorý z týchto orgánov spotrebuje najviac energie?",
        "Mozog",
        "Srdce",
        "Pľúca",
        "Obličky",
      ],
      [
        "Ktorý z týchto útvarov je na Zemi najhlbší?",
        "Oceánska priekopa",
        "Jaskyňa",
        "Kaňon",
        "Kráter",
      ],
    ],
  }
);

CATALOG.push(
  {
    category: "🎬 Filmy a seriály",
    difficulty: "lahke",
    items: [
      [
        "O akom dopravnom prostriedku je film Titanic?",
        "O lodi",
        "O vlaku",
        "O lietadle",
        "O ponorke",
      ],
      [
        "Ako sa volá levíča v Levom kráľovi?",
        "Simba",
        "Mufasa",
        "Scar",
        "Nala",
      ],
      [
        "Ktorá kráľovná v Ľadovom kráľovstve ovláda ľad?",
        "Elsa",
        "Anna",
        "Aurora",
        "Merida",
      ],
      [
        "Čím je Harry Potter?",
        "Čarodejníkom",
        "Rytierom",
        "Pirátom",
        "Detektívom",
      ],
      [
        "Aká zbraň je typická pre Star Wars?",
        "Svetelný meč",
        "Luk",
        "Kopije",
        "Prak",
      ],
      [
        "Akou postavou je Shrek?",
        "Zlobrom",
        "Trpaslíkom",
        "Drakom",
        "Rytierom",
      ],
      [
        "Podľa ktorého živočícha je pomenovaný Spider-Man?",
        "Podľa pavúka",
        "Podľa netopiera",
        "Podľa mravca",
        "Podľa osy",
      ],
      [
        "Podľa ktorého živočícha je pomenovaný Batman?",
        "Podľa netopiera",
        "Podľa pavúka",
        "Podľa vlka",
        "Podľa orla",
      ],
      [
        "Aké zvieratá oživli v Jurskom parku?",
        "Dinosaury",
        "Mamuty",
        "Draky",
        "Vlkodlaky",
      ],
      [
        "Akým živočíchom je Nemo?",
        "Rybou",
        "Korytnačkou",
        "Delfínom",
        "Krabom",
      ],
      [
        "O čom je film Toy Story?",
        "O hračkách",
        "O autách",
        "O robotoch",
        "O zvieratách",
      ],
      ["Akú farbu majú Mimoni?", "Žltú", "Zelenú", "Modrú", "Oranžovú"],
      [
        "Aké zviera je hlavnou postavou v Kung Fu Panda?",
        "Panda",
        "Tiger",
        "Opica",
        "Žeriav",
      ],
      [
        "Aké zviera varí vo filme Ratatouille?",
        "Potkan",
        "Myš",
        "Mačka",
        "Pes",
      ],
      [
        "Čo Aladin našiel v jaskyni?",
        "Lampu s džinom",
        "Truhlicu zlata",
        "Čarovný meč",
        "Kúzelnú knihu",
      ],
      [
        "Čo stratila Popoluška na plese?",
        "Črievičku",
        "Náhrdelník",
        "Prsteň",
        "Rukavicu",
      ],
      ["Koľko trpaslíkov mala Snehulienka?", "Sedem", "Päť", "Osem", "Dvanásť"],
      [
        "Čo sa stalo Pinocchiovi, keď zalhal?",
        "Narástol mu nos",
        "Sčervenal",
        "Skamenel",
        "Zmenšil sa",
      ],
      [
        "Akú pilulku si vyberá Neo v Matrixe?",
        "Červenú",
        "Modrú",
        "Zelenú",
        "Bielu",
      ],
      ["Aký šport robí Rocky?", "Box", "Zápasenie", "Karate", "Beh"],
      ["Čím je slávny Forrest Gump?", "Behom", "Plávaním", "Boxom", "Šachom"],
      ["Aké číslo má agent James Bond?", "007", "001", "009", "013"],
      ["Čo nosí Indiana Jones okrem klobúka?", "Bič", "Meč", "Luk", "Štít"],
      [
        "Čím je typický Mr. Bean?",
        "Takmer nehovorí",
        "Veľa spieva",
        "Stále tancuje",
        "Hrá na gitare",
      ],
      [
        "V akom období sa odohráva film Sám doma?",
        "Na Vianoce",
        "V lete",
        "Na Veľkú noc",
        "Na Halloween",
      ],
      [
        "Ako sa volá pirát z Pirátov Karibiku?",
        "Jack Sparrow",
        "Jim Hawkins",
        "Long John",
        "Blackbeard",
      ],
      [
        "Akú farbu majú obyvatelia planéty v Avatarovi?",
        "Modrú",
        "Zelenú",
        "Červenú",
        "Žltú",
      ],
      [
        "Aké zvieratá utekajú zo zoo v Madagascare?",
        "Lev, zebra a žirafa",
        "Pandy a koaly",
        "Slony a tigre",
        "Vlky a medvede",
      ],
      [
        "Aké zviera je Manny vo filme Doba ľadová?",
        "Mamut",
        "Medveď",
        "Nosorožec",
        "Bizon",
      ],
      [
        "Ako sa volá červené auto z filmu Autá?",
        "Blesk McQueen",
        "Speedy",
        "Turbo",
        "Rocket",
      ],
      ["Aké zviera je Scooby-Doo?", "Pes", "Mačka", "Medveď", "Kôň"],
      [
        "Kto sú Tom a Jerry?",
        "Mačka a myš",
        "Pes a mačka",
        "Myš a potkan",
        "Vlk a zajac",
      ],
      [
        "Akú farbu má koža Simpsonovcov?",
        "Žltú",
        "Zelenú",
        "Ružovú",
        "Oranžovú",
      ],
      ["Kde žije SpongeBob?", "Pod morom", "Na púšti", "V lese", "Vo vesmíre"],
      ["Aké zviera je Peppa?", "Prasiatko", "Ovečka", "Mačička", "Zajačik"],
      [
        "Čo sa Patovi a Matovi stále nedarí?",
        "Domáce práce",
        "Športovať",
        "Variť",
        "Spievať",
      ],
      [
        "Aké bájne zvieratá sú v Hre o tróny?",
        "Draci",
        "Jednorožce",
        "Grifi",
        "Fénixi",
      ],
      [
        "Kde sa schádzajú hrdinovia seriálu Priatelia?",
        "V kaviarni",
        "V knižnici",
        "Na štadióne",
        "V škole",
      ],
    ],
  },
  {
    category: "🎬 Filmy a seriály",
    difficulty: "tazke",
    items: [
      [
        "Kto režíroval film Titanic?",
        "James Cameron",
        "Steven Spielberg",
        "Ridley Scott",
        "Martin Scorsese",
      ],
      [
        "Kto režíroval Jurský park?",
        "Steven Spielberg",
        "James Cameron",
        "George Lucas",
        "Tim Burton",
      ],
      [
        "Ktorý herec hral Jacka Sparrowa?",
        "Johnny Depp",
        "Orlando Bloom",
        "Brad Pitt",
        "Tom Cruise",
      ],
      [
        "Z ktorého filmu je veta „Ja som tvoj otec“?",
        "Star Wars",
        "Matrix",
        "Rocky",
        "Gladiátor",
      ],
      [
        "Ako sa nazýva škola v Harrym Potterovi?",
        "Bradavice",
        "Durmstrang",
        "Beauxbatons",
        "Avalon",
      ],
      [
        "V ktorom meste pôsobí Batman?",
        "V Gothame",
        "V Metropolise",
        "V New Yorku",
        "V Chicagu",
      ],
      [
        "Z ktorej planéty je Superman?",
        "Z Kryptonu",
        "Z Marsu",
        "Z Vulkánu",
        "Z Tatooinu",
      ],
      [
        "Ku ktorej rase patrí Frodo?",
        "K hobitom",
        "K elfom",
        "K trpaslíkom",
        "K ľuďom",
      ],
      [
        "Ako sa volá zlatý robot zo Star Wars?",
        "C-3PO",
        "R2-D2",
        "BB-8",
        "K-2SO",
      ],
      ["Ako sa volá Simbov otec?", "Mufasa", "Scar", "Rafiki", "Zazu"],
      [
        "Aké zviera je Pumbaa v Levom kráľovi?",
        "Prasa bradavičnaté",
        "Nosorožec",
        "Slon",
        "Byvol",
      ],
      ["Ako sa volá Elsina sestra?", "Anna", "Olaf", "Kristoff", "Aurora"],
      [
        "Ktorý herec hral Iron Mana?",
        "Robert Downey Jr.",
        "Chris Evans",
        "Chris Hemsworth",
        "Mark Ruffalo",
      ],
      [
        "Kto napísal Pána prsteňov?",
        "J. R. R. Tolkien",
        "C. S. Lewis",
        "George Orwell",
        "Terry Pratchett",
      ],
      [
        "Kto napísal knihy o Harrym Potterovi?",
        "J. K. Rowlingová",
        "Agatha Christie",
        "Enid Blytonová",
        "Roald Dahl",
      ],
      [
        "Ako sa nazýva najznámejšia filmová cena v Hollywoode?",
        "Oscar",
        "Grammy",
        "Emmy",
        "Tony",
      ],
      [
        "Ktorý film ako prvý získal Oscara za animovaný film?",
        "Shrek",
        "Hľadá sa Nemo",
        "Doba ľadová",
        "Príšerky s. r. o.",
      ],
      [
        "Ako sa volá kaviareň v seriáli Priatelia?",
        "Central Perk",
        "Moe's",
        "The Regal",
        "Cheers",
      ],
    ],
  }
);

CATALOG.push(
  {
    category: "🎵 Hudba",
    difficulty: "lahke",
    items: [
      ["Čo má gitara?", "Struny", "Klávesy", "Blany", "Ventily"],
      [
        "Čo má klavír?",
        "Klávesy",
        "Struny na sláčik",
        "Blany",
        "Píšťaly na fúkanie",
      ],
      [
        "Čím sa hrá na bicie?",
        "Paličkami",
        "Sláčikom",
        "Fúkaním",
        "Prstami po klávesách",
      ],
      ["Čím sa hrá na husle?", "Sláčikom", "Paličkami", "Fúkaním", "Trsátkom"],
      [
        "Ako sa vydáva zvuk na flaute?",
        "Fúkaním",
        "Bitím",
        "Sláčikom",
        "Trhaním strún",
      ],
      [
        "Do čoho spieva spevák na koncerte?",
        "Do mikrofónu",
        "Do slúchadiel",
        "Do trúbky",
        "Do reproduktora",
      ],
      ["Kto diriguje orchester?", "Dirigent", "Spevák", "Bubeník", "Skladateľ"],
      [
        "Ako sa začína slovenská hymna?",
        "Nad Tatrou sa blýska",
        "Kde domov můj",
        "Hej Slováci",
        "Aká si mi krásna",
      ],
      [
        "Ktorý nástroj je typicky slovenský?",
        "Fujara",
        "Gajdy",
        "Balalajka",
        "Didgeridoo",
      ],
      [
        "Z ktorej krajiny pochádzali Beatles?",
        "Z Anglicka",
        "Z USA",
        "Z Írska",
        "Z Kanady",
      ],
      [
        "Z ktorej krajiny pochádzala skupina ABBA?",
        "Zo Švédska",
        "Z Norska",
        "Z Nemecka",
        "Z Holandska",
      ],
      [
        "Kto bol Wolfgang Amadeus Mozart?",
        "Skladateľ",
        "Maliar",
        "Spisovateľ",
        "Vynálezca",
      ],
      [
        "S akým hudobným štýlom sa spája Elvis Presley?",
        "Rock and roll",
        "Opera",
        "Reggae",
        "Jazz",
      ],
      ["Koľko strún má klasická gitara?", "Šesť", "Štyri", "Osem", "Dvanásť"],
      ["Koľko strún majú husle?", "Štyri", "Šesť", "Tri", "Osem"],
      [
        "Čo je opera?",
        "Spievané divadlo",
        "Tanečná súťaž",
        "Druh gitary",
        "Filmový žáner",
      ],
      [
        "Kto tvorí zbor?",
        "Veľa spevákov",
        "Jeden spevák",
        "Skupina bubeníkov",
        "Dvaja gitaristi",
      ],
      [
        "Čo robí DJ?",
        "Mieša hudbu",
        "Diriguje orchester",
        "Skladá opery",
        "Ladí klavíry",
      ],
      [
        "Čo je typické pre rap?",
        "Rytmické hovorenie",
        "Dlhé vysoké tóny",
        "Hra na sláčiky",
        "Tichý spev",
      ],
      [
        "Na čo slúžia noty?",
        "Na zápis hudby",
        "Na ladenie",
        "Na zosilnenie",
        "Na tanec",
      ],
      ["Ktorý nástroj patrí medzi bicie?", "Bubon", "Husle", "Flauta", "Harfa"],
      [
        "Ako sa hrá na xylofón?",
        "Paličkami",
        "Sláčikom",
        "Fúkaním",
        "Šliapaním",
      ],
      [
        "Ktorý nástroj sa nosí na ramene a hrá sa mechom?",
        "Harmonika",
        "Husle",
        "Trúbka",
        "Bubon",
      ],
      [
        "Čo je refrén?",
        "Opakujúca sa časť",
        "Prvý tón",
        "Názov nástroja",
        "Druh tanca",
      ],
      [
        "Ktorý nástroj je najväčší v symfonickom orchestri?",
        "Kontrabas",
        "Husle",
        "Flauta",
        "Trúbka",
      ],
    ],
  },
  {
    category: "🎵 Hudba",
    difficulty: "tazke",
    items: [
      [
        "Ktorý slávny skladateľ postupne ohluchol?",
        "Beethoven",
        "Mozart",
        "Bach",
        "Chopin",
      ],
      [
        "Kto skomponoval Malú nočnú hudbu?",
        "Mozart",
        "Beethoven",
        "Vivaldi",
        "Haydn",
      ],
      [
        "Ktorý tanečný krok preslávil Michael Jackson?",
        "Moonwalk",
        "Twist",
        "Charleston",
        "Salsu",
      ],
      [
        "Ktorá skupina naspievala Bohemian Rhapsody?",
        "Queen",
        "The Beatles",
        "Pink Floyd",
        "Led Zeppelin",
      ],
      ["Koľko klávesov má štandardný klavír?", "88", "64", "72", "96"],
      [
        "Kto vynašiel saxofón?",
        "Adolphe Sax",
        "Antonio Stradivari",
        "Bartolomeo Cristofori",
        "Theobald Boehm",
      ],
      [
        "Čo znamená v hudbe označenie forte?",
        "Nahlas",
        "Potichu",
        "Rýchlo",
        "Pomaly",
      ],
      [
        "Čo znamená v hudbe označenie adagio?",
        "Pomaly",
        "Nahlas",
        "Veselo",
        "Rýchlo",
      ],
      [
        "Koľko tónov má základná hudobná stupnica?",
        "Sedem",
        "Päť",
        "Osem",
        "Dvanásť",
      ],
      [
        "V ktorej krajine vzniklo reggae?",
        "Na Jamajke",
        "V Brazílii",
        "Na Kube",
        "V Nigérii",
      ],
      [
        "Z ktorej krajiny pochádza tango?",
        "Z Argentíny",
        "Zo Španielska",
        "Z Brazílie",
        "Z Mexika",
      ],
      [
        "Ktorý nástroj je typický pre Škótsko?",
        "Gajdy",
        "Harfa",
        "Mandolína",
        "Balalajka",
      ],
      [
        "Ktorá skupina nahrala skladbu Stairway to Heaven?",
        "Led Zeppelin",
        "Deep Purple",
        "The Rolling Stones",
        "The Who",
      ],
      [
        "Ktorý nástroj má najvyšší hlas v sláčikovej sekcii?",
        "Husle",
        "Viola",
        "Violončelo",
        "Kontrabas",
      ],
      [
        "Kto zložil Štyri ročné obdobia?",
        "Vivaldi",
        "Bach",
        "Handel",
        "Mozart",
      ],
    ],
  }
);

CATALOG.push(
  {
    category: "🏆 Šport",
    difficulty: "lahke",
    items: [
      [
        "Koľko hráčov má futbalový tím na hrisku?",
        "Jedenásť",
        "Deväť",
        "Desať",
        "Dvanásť",
      ],
      ["Čím sa hrá hokej?", "Pukom", "Loptou", "Loptičkou", "Kruhom"],
      ["Čím sa hrá tenis?", "Raketou", "Pálkou", "Hokejkou", "Rukou"],
      [
        "Kam sa hádže lopta v basketbale?",
        "Do koša",
        "Do bránky",
        "Cez sieť",
        "Do jamky",
      ],
      ["Čo delí hrisko vo volejbale?", "Sieť", "Bránka", "Latka", "Kruh"],
      ["Koľko kruhov má olympijský symbol?", "Päť", "Štyri", "Šesť", "Tri"],
      [
        "Aký šport je Tour de France?",
        "Cyklistika",
        "Beh",
        "Plávanie",
        "Veslovanie",
      ],
      ["Čo súťaží vo Formule 1?", "Autá", "Motorky", "Bicykle", "Lode"],
      ["Aký šport sa hrá na Wimbledone?", "Tenis", "Golf", "Kriket", "Ragby"],
      ["Čo sa zhadzuje v bowlingu?", "Kolky", "Kruhy", "Terče", "Kocky"],
      [
        "Kam sa dostáva loptička v golfe?",
        "Do jamky",
        "Do koša",
        "Cez sieť",
        "Do bránky",
      ],
      ["V čom boxujú boxeri?", "V ringu", "Na kurte", "V bazéne", "Na dráhe"],
      [
        "Ako sa nazýva koniec šachovej partie výhrou?",
        "Mat",
        "Pat",
        "Gól",
        "Set",
      ],
      ["Kde sa plávajú súťaže?", "V bazéne", "Na kurte", "Na dráhe", "V ringu"],
      [
        "V ktorom ročnom období sa lyžuje?",
        "V zime",
        "V lete",
        "Na jeseň",
        "Na jar",
      ],
      [
        "Aký šport preslávil Petra Sagana?",
        "Cyklistika",
        "Hokej",
        "Futbal",
        "Tenis",
      ],
      [
        "Aký šport robila Anastasia Kuzminová?",
        "Biatlon",
        "Krasokorčuľovanie",
        "Plávanie",
        "Atletika",
      ],
      [
        "Ktorý šport je na Slovensku najpopulárnejší v zime?",
        "Hokej",
        "Futbal",
        "Basketbal",
        "Volejbal",
      ],
      [
        "Aké pásy sa používajú v karate na označenie úrovne?",
        "Farebné pásy",
        "Medaily",
        "Odznaky",
        "Čísla",
      ],
      ["Akú loptu používa ragby?", "Oválnu", "Guľatú", "Malú tvrdú", "Plochú"],
      [
        "Čím sa odpaľuje v baseballe?",
        "Pálkou",
        "Raketou",
        "Hokejkou",
        "Rukou",
      ],
      [
        "Aká je disciplína bežcov na sto metrov?",
        "Šprint",
        "Maratón",
        "Prekážky",
        "Chôdza",
      ],
      [
        "Čo sa musí preskočiť pri skoku do výšky?",
        "Latka",
        "Sieť",
        "Prekážka",
        "Priekopa",
      ],
      [
        "Do čoho sa strieľa v športovej streľbe?",
        "Do terča",
        "Do koša",
        "Do bránky",
        "Do jamky",
      ],
      [
        "Koľko brankárov má futbalový tím na hrisku?",
        "Jedného",
        "Dvoch",
        "Troch",
        "Žiadneho",
      ],
      [
        "Aký šport sa hrá s malou bielou loptičkou na stole?",
        "Stolný tenis",
        "Squash",
        "Bedminton",
        "Kriket",
      ],
      [
        "Čo sa používa v bedmintone namiesto loptičky?",
        "Košík",
        "Puk",
        "Kocka",
        "Kruh",
      ],
      [
        "Ako sa nazýva víťaz prvého miesta na olympiáde?",
        "Zlatý medailista",
        "Bronzový medailista",
        "Strieborný medailista",
        "Finalista",
      ],
    ],
  },
  {
    category: "🏆 Šport",
    difficulty: "tazke",
    items: [
      [
        "V ktorej krajine vznikli olympijské hry?",
        "V Grécku",
        "V Ríme",
        "V Egypte",
        "V Anglicku",
      ],
      [
        "Koľko hráčov má hokejový tím na ľade vrátane brankára?",
        "Šesť",
        "Päť",
        "Sedem",
        "Osem",
      ],
      [
        "Ako sa nazývajú tri góly jedného hráča v zápase?",
        "Hetrik",
        "Dublet",
        "Trojka",
        "Séria",
      ],
      [
        "Ako často sa konajú letné olympijské hry?",
        "Každé štyri roky",
        "Každé dva roky",
        "Každé tri roky",
        "Každý rok",
      ],
      [
        "Aká je približná dĺžka maratónu?",
        "42 kilometrov",
        "21 kilometrov",
        "50 kilometrov",
        "30 kilometrov",
      ],
      [
        "Ktorá krajina vyhrala najviac futbalových svetových šampionátov?",
        "Brazília",
        "Nemecko",
        "Itália",
        "Argentína",
      ],
      [
        "Ako sa nazýva najvyššia hokejová liga v Severnej Amerike?",
        "NHL",
        "KHL",
        "AHL",
        "NBA",
      ],
      [
        "Ako sa nazýva najvyššia basketbalová liga v USA?",
        "NBA",
        "NHL",
        "MLB",
        "NFL",
      ],
      [
        "Aký šport robila Zuzana Rehák Štefečeková?",
        "Streľbu",
        "Biatlon",
        "Atletiku",
        "Krasokorčuľovanie",
      ],
      [
        "Čo znamená v boxe skratka KO?",
        "Knokaut",
        "Kontra",
        "Koniec kola",
        "Krátky odpočet",
      ],
      [
        "Ako sa nazýva úvodný úder v tenise?",
        "Podanie",
        "Smeč",
        "Volej",
        "Návrat",
      ],
      [
        "Ktorý atlét má prezývku Blesk?",
        "Usain Bolt",
        "Carl Lewis",
        "Mo Farah",
        "Michael Johnson",
      ],
      [
        "Čo znamená birdie v golfe?",
        "O jeden úder menej",
        "O jeden úder viac",
        "Trafenie jamky prvým úderom",
        "Diskvalifikácia",
      ],
      [
        "Ktorá farba na olympijských kruhoch chýba?",
        "Ružová",
        "Čierna",
        "Zelená",
        "Žltá",
      ],
      [
        "Koľko setov musí vyhrať muž na Wimbledone?",
        "Tri",
        "Dva",
        "Štyri",
        "Päť",
      ],
    ],
  }
);

CATALOG.push(
  {
    category: "📱 Technika a život",
    difficulty: "lahke",
    items: [
      [
        "V ktorej adrese sa používa znak @?",
        "V e-maile",
        "V telefónnom čísle",
        "V PSČ",
        "V hesle",
      ],
      [
        "Na čo slúži Wi-Fi?",
        "Na bezdrôtový internet",
        "Na nabíjanie",
        "Na fotenie",
        "Na zvuk",
      ],
      [
        "Čo treba vložiť do mobilu, aby fungoval s operátorom?",
        "SIM kartu",
        "Batériu",
        "Slúchadlá",
        "Pamäťovú kartu",
      ],
      [
        "Na čo slúži USB kábel?",
        "Na prenos dát",
        "Na svietenie",
        "Na chladenie",
        "Na meranie",
      ],
      [
        "Čo má počítačová myš navrchu?",
        "Koliesko",
        "Displej",
        "Klávesy s číslami",
        "Reproduktor",
      ],
      [
        "Na čo slúži Bluetooth?",
        "Na bezdrôtové spojenie",
        "Na zväčšenie pamäti",
        "Na tlačenie",
        "Na nabíjanie",
      ],
      [
        "Ako sa nazýva štvorcový kód, ktorý sa skenuje mobilom?",
        "QR kód",
        "Čiarový kód",
        "PIN kód",
        "IP adresa",
      ],
      [
        "Ako sa nazývajú obrázkové smajlíky v správach?",
        "Emoji",
        "Ikony",
        "Fonty",
        "Pixely",
      ],
      [
        "Ktorá firma má v logu nakusnuté jablko?",
        "Apple",
        "Samsung",
        "Xiaomi",
        "Huawei",
      ],
      [
        "Ktorý operačný systém má v logu zeleného robota?",
        "Android",
        "Windows",
        "iOS",
        "Linux",
      ],
      [
        "Ktorá firma je najznámejším internetovým vyhľadávačom?",
        "Google",
        "Facebook",
        "Amazon",
        "Netflix",
      ],
      [
        "Na ktorej platforme sa hlavne pozerajú videá?",
        "YouTube",
        "Spotify",
        "WhatsApp",
        "Gmail",
      ],
      [
        "Na čo slúži Netflix?",
        "Na sledovanie filmov",
        "Na volanie",
        "Na nakupovanie",
        "Na navigáciu",
      ],
      ["Ktorá firma vytvorila Windows?", "Microsoft", "Apple", "Google", "IBM"],
      [
        "Čím je známa firma Tesla?",
        "Elektromobilmi",
        "Mobilmi",
        "Lietadlami",
        "Hodinkami",
      ],
      [
        "Z ktorej krajiny pochádza LEGO?",
        "Z Dánska",
        "Zo Švédska",
        "Z Nemecka",
        "Z Holandska",
      ],
      [
        "Z ktorej krajiny pochádza IKEA?",
        "Zo Švédska",
        "Z Dánska",
        "Z Nórska",
        "Z Fínska",
      ],
      [
        "Z ktorej krajiny pochádza Ferrari?",
        "Z Itálie",
        "Z Nemecka",
        "Z Francúzska",
        "Zo Španielska",
      ],
      [
        "Aké farby má klasický semafor?",
        "Červená, žltá, zelená",
        "Modrá, biela, červená",
        "Zelená, biela, čierna",
        "Červená, biela, žltá",
      ],
      [
        "Na čo slúži airbag v aute?",
        "Na ochranu pri nehode",
        "Na chladenie",
        "Na navigáciu",
        "Na parkovanie",
      ],
      [
        "V akých jednotkách sa meria hmotnosť?",
        "V kilogramoch",
        "V metroch",
        "V litroch",
        "V stupňoch",
      ],
      [
        "Koľko hodín má jeden deň?",
        "Dvadsaťštyri",
        "Dvanásť",
        "Tridsať",
        "Šestnásť",
      ],
      [
        "Čo robí klimatizácia v lete?",
        "Chladí vzduch",
        "Hreje vzduch",
        "Zvlhčuje vodu",
        "Čistí podlahu",
      ],
      [
        "Na čo slúži chladnička?",
        "Na uchovanie jedla",
        "Na pečenie",
        "Na umývanie",
        "Na sušenie",
      ],
      [
        "Na čo slúži mikrovlnka?",
        "Na zohriatie jedla",
        "Na mrazenie",
        "Na krájanie",
        "Na miešanie",
      ],
      [
        "Na čo slúži vysávač?",
        "Na vysávanie prachu",
        "Na žehlenie",
        "Na pranie",
        "Na sušenie vlasov",
      ],
      ["Čo dáva žiarovka?", "Svetlo", "Zvuk", "Vodu", "Vzduch"],
      [
        "Na čo slúži batéria?",
        "Na uchovanie energie",
        "Na chladenie",
        "Na svietenie bez energie",
        "Na meranie",
      ],
      [
        "Na čo slúžia slúchadlá?",
        "Na počúvanie zvuku",
        "Na fotenie",
        "Na písanie",
        "Na nabíjanie",
      ],
      [
        "Na čo slúži tlačiareň?",
        "Na tlač dokumentov",
        "Na skenovanie zvuku",
        "Na premietanie",
        "Na nabíjanie",
      ],
      [
        "Na čo slúži kalkulačka?",
        "Na počítanie",
        "Na kreslenie",
        "Na písanie",
        "Na meranie teploty",
      ],
      [
        "Čo zobrazuje navigácia v aute?",
        "Cestu",
        "Teplotu motora",
        "Rádio",
        "Tlak v pneumatikách",
      ],
      [
        "Čím sa platí bezkontaktne v obchode?",
        "Kartou alebo mobilom",
        "Iba hotovosťou",
        "Šekom",
        "Poukazom",
      ],
      [
        "Ako sa nazýva program na prezeranie webu?",
        "Prehliadač",
        "Editor",
        "Antivírus",
        "Ovládač",
      ],
      [
        "Čo si treba pamätať na prihlásenie do účtu?",
        "Heslo",
        "IP adresu",
        "Značku mobilu",
        "Verziu systému",
      ],
    ],
  },
  {
    category: "📱 Technika a život",
    difficulty: "tazke",
    items: [
      [
        "Čo znamená skratka WWW?",
        "World Wide Web",
        "World Web Work",
        "Wide World Wire",
        "Web Without Wires",
      ],
      [
        "Čo znamená skratka USB?",
        "Universal Serial Bus",
        "United System Base",
        "Ultra Speed Byte",
        "Universal Storage Box",
      ],
      [
        "Kto spoluzakladal Microsoft?",
        "Bill Gates",
        "Steve Jobs",
        "Mark Zuckerberg",
        "Larry Page",
      ],
      [
        "Kto spoluzakladal Apple?",
        "Steve Jobs",
        "Bill Gates",
        "Elon Musk",
        "Jeff Bezos",
      ],
      [
        "Na čo slúži GPS?",
        "Na určenie polohy",
        "Na meranie tlaku",
        "Na prenos zvuku",
        "Na šifrovanie",
      ],
      ["Koľko bitov má jeden bajt?", "Osem", "Štyri", "Šestnásť", "Dva"],
      [
        "Čo je pixel?",
        "Najmenší bod obrazu",
        "Druh kábla",
        "Jednotka zvuku",
        "Typ pamäti",
      ],
      [
        "Čo znamená skratka AI?",
        "Umelá inteligencia",
        "Automatický internet",
        "Aktívny index",
        "Analógový vstup",
      ],
      [
        "Ktorá firma vyrába PlayStation?",
        "Sony",
        "Microsoft",
        "Nintendo",
        "Sega",
      ],
      ["Ktorá firma vyrába Xbox?", "Microsoft", "Sony", "Nintendo", "Valve"],
      [
        "Čo je RAM v počítači?",
        "Operačná pamäť",
        "Pevný disk",
        "Procesor",
        "Grafická karta",
      ],
      [
        "Ktorá spoločnosť vlastní Instagram?",
        "Meta",
        "Google",
        "Apple",
        "Amazon",
      ],
      [
        "Ktorý jazyk sa používa na vzhľad webových stránok?",
        "CSS",
        "SQL",
        "Python",
        "Java",
      ],
      [
        "Čo robí antivírusový program?",
        "Chráni pred vírusmi",
        "Zrýchľuje internet",
        "Zväčšuje pamäť",
        "Zálohuje batériu",
      ],
      [
        "Čo je cloud v informatike?",
        "Úložisko na internete",
        "Druh procesora",
        "Typ monitora",
        "Bezdrôtová myš",
      ],
    ],
  }
);

CATALOG.push(
  {
    category: "📜 História inak",
    difficulty: "lahke",
    items: [
      [
        "Ktorý staroveký národ postavil Koloseum?",
        "Rimania",
        "Gréci",
        "Egypťania",
        "Kelti",
      ],
      [
        "V ktorej krajine sú slávne pyramídy v Gíze?",
        "V Egypte",
        "V Grécku",
        "V Mexiku",
        "V Turecku",
      ],
      [
        "Odkiaľ pochádzali Vikingovia?",
        "Zo Škandinávie",
        "Zo Španielska",
        "Z Itálie",
        "Z Grécka",
      ],
      [
        "Kto bol faraón?",
        "Egyptský vládca",
        "Grécky vojak",
        "Rímsky kňaz",
        "Perzský obchodník",
      ],
      [
        "Kto bola Kleopatra?",
        "Egyptská kráľovná",
        "Rímska cisárovná",
        "Grécka bohyňa",
        "Perzská princezná",
      ],
      [
        "Kto namaľoval Monu Lisu?",
        "Leonardo da Vinci",
        "Michelangelo",
        "Rafael",
        "Vincent van Gogh",
      ],
      [
        "Kto napísal Rómea a Júliu?",
        "William Shakespeare",
        "Charles Dickens",
        "Victor Hugo",
        "Jane Austenová",
      ],
      [
        "Kto bol prvým človekom na Mesiaci?",
        "Neil Armstrong",
        "Jurij Gagarin",
        "Buzz Aldrin",
        "John Glenn",
      ],
      [
        "Čo spôsobilo potopenie Titanicu?",
        "Náraz do ľadovca",
        "Búrka",
        "Požiar",
        "Útok",
      ],
      [
        "Aké zviera používali karavány na púšti?",
        "Ťavy",
        "Kone",
        "Slony",
        "Osly",
      ],
    ],
  },
  {
    category: "📜 História inak",
    difficulty: "tazke",
    items: [
      [
        "Kto bol prvým človekom vo vesmíre?",
        "Jurij Gagarin",
        "Neil Armstrong",
        "Alan Shepard",
        "German Titov",
      ],
      [
        "Kto v Európe vynašiel knihtlač s pohyblivými písmenami?",
        "Johannes Gutenberg",
        "Leonardo da Vinci",
        "Galileo Galilei",
        "Isaac Newton",
      ],
      [
        "V ktorom starovekom meste vznikla demokracia?",
        "V Aténach",
        "V Ríme",
        "V Sparte",
        "V Kartágu",
      ],
      [
        "Ktorá civilizácia postavila Machu Picchu?",
        "Inkovia",
        "Mayovia",
        "Aztékovia",
        "Olmékovia",
      ],
      [
        "Ktorá civilizácia žila v Mexiku pred príchodom Španielov?",
        "Aztékovia",
        "Inkovia",
        "Rimania",
        "Feničania",
      ],
      [
        "Podľa čoho sa Vikingovia orientovali na mori?",
        "Podľa Slnka a hviezd",
        "Podľa satelitov",
        "Podľa kompasu s batériou",
        "Podľa mapy metra",
      ],
      [
        "Kým bol Napoleon Bonaparte?",
        "Francúzskym cisárom",
        "Anglickým kráľom",
        "Ruským cárom",
        "Španielskym admirálom",
      ],
      [
        "Ako sa nazývalo písmo starého Egypta?",
        "Hieroglyfy",
        "Klinové písmo",
        "Latinka",
        "Runy",
      ],
      [
        "Kto boli gladiátori?",
        "Bojovníci v aréne",
        "Rímski kňazi",
        "Grécki učitelia",
        "Egyptskí stavitelia",
      ],
      [
        "Ako sa nazýva slávna lesť pri obliehaní Tróje?",
        "Trójsky kôň",
        "Grécky oheň",
        "Rímsky štít",
        "Perzský most",
      ],
      [
        "V ktorej krajine stojí Stonehenge?",
        "V Anglicku",
        "V Írsku",
        "Vo Francúzsku",
        "V Škótsku",
      ],
      [
        "Kto priniesol na naše územie prvé slovanské písmo?",
        "Cyril a Metod",
        "Svätopluk",
        "Rastislav",
        "Pribina",
      ],
      [
        "Kým bol Svätopluk?",
        "Veľkomoravským vládcom",
        "Uhorským kráľom",
        "Českým kniežaťom",
        "Poľským vojvodom",
      ],
      [
        "Čím sa preslávil Ľudovít Štúr?",
        "Uzákonením slovenčiny",
        "Objavením Ameriky",
        "Vynálezom telefónu",
        "Založením Bratislavy",
      ],
      ["Kým bol Juraj Jánošík?", "Zbojníkom", "Kráľom", "Maliarom", "Kňazom"],
      [
        "Čím bol Milan Rastislav Štefánik okrem politika?",
        "Letcom a astronómom",
        "Skladateľom",
        "Maliarom",
        "Lekárom",
      ],
      [
        "V ktorom meste vzniklo prvé metro na svete?",
        "V Londýne",
        "V Paríži",
        "V New Yorku",
        "V Berlíne",
      ],
      [
        "Kým bol Marco Polo?",
        "Cestovateľom",
        "Maliarom",
        "Kráľom",
        "Vynálezcom",
      ],
      [
        "Ktorá stavba v Indii je symbolom lásky?",
        "Tádž Mahal",
        "Červená pevnosť",
        "Angkor Vat",
        "Zlatý chrám",
      ],
      [
        "Ako sa nazývala obchodná cesta medzi Európou a Áziou?",
        "Hodvábna cesta",
        "Soľná cesta",
        "Zlatá cesta",
        "Korenná cesta",
      ],
      [
        "Čím sa okrem maľovania zaoberal Leonardo da Vinci?",
        "Vynálezmi",
        "Hudbou v opere",
        "Plavbou po mori",
        "Politikou v Ríme",
      ],
      [
        "Ktorá vojna sa nazývala aj Veľká vojna?",
        "Prvá svetová",
        "Druhá svetová",
        "Sedemročná",
        "Krymská",
      ],
      [
        "Koho telá starí Egypťania mumifikovali najstarostlivejšie?",
        "Faraónov",
        "Vojakov",
        "Obchodníkov",
        "Rolníkov",
      ],
      [
        "Kto viedol expedíciu, ktorá prvá oboplávala svet?",
        "Magellan",
        "Krištof Kolumbus",
        "Vasco da Gama",
        "James Cook",
      ],
      [
        "Ako sa nazývali bojovníci v stredovekej zbroji na koni?",
        "Rytieri",
        "Legionári",
        "Samuraji",
        "Kozáci",
      ],
    ],
  }
);

// ─── Build ────────────────────────────────────────────────────────────────

import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_QUESTION_CHARS = 110;
const MAX_OPTION_CHARS = 28;
const MIN_QUESTIONS = 500;

/** Deterministický generátor, aby bol výstup pri každom builde identický. */
function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function deterministicShuffle(items, seed) {
  const random = mulberry32(seed);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const normalize = value =>
  value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

const flat = CATALOG.flatMap(({ category, difficulty, items }) =>
  items.map(([question, correct, ...wrong]) => ({
    category,
    difficulty,
    question,
    correct,
    wrong,
  }))
);

// ─── Kontrola obsahu ──────────────────────────────────────────────────────
const problems = [];
const seenQuestions = new Map();

for (const entry of flat) {
  const { question, correct, wrong, category, difficulty } = entry;
  const label = `${category} :: ${question}`;

  if (wrong.length !== 3)
    problems.push(`${label} — musí mať presne 3 nesprávne možnosti`);
  if (!["lahke", "tazke"].includes(difficulty))
    problems.push(`${label} — neplatná obtiažnosť`);

  const options = [correct, ...wrong];
  if (options.some(option => !option || !option.trim()))
    problems.push(`${label} — prázdna možnosť`);
  if (new Set(options.map(normalize)).size !== 4)
    problems.push(`${label} — možnosti nie sú unikátne`);

  const key = normalize(question);
  if (seenQuestions.has(key))
    problems.push(
      `${label} — duplicitná otázka (už ako "${seenQuestions.get(key)}")`
    );
  else seenQuestions.set(key, question);

  if (!question.trim().endsWith("?"))
    problems.push(`${label} — otázka musí končiť otáznikom`);
  if (question.length > MAX_QUESTION_CHARS)
    problems.push(
      `${label} — otázka je dlhšia ako ${MAX_QUESTION_CHARS} znakov (${question.length})`
    );

  for (const option of options) {
    if (option.length > MAX_OPTION_CHARS)
      problems.push(
        `${label} — možnosť "${option}" je dlhšia ako ${MAX_OPTION_CHARS} znakov (${option.length})`
      );
    // Čísla ("365", "007") aj značky ("iOS") sú v poriadku;
    // chybou je len možnosť začínajúca malým písmenom bez akéhokoľvek veľkého.
    if (/^\p{Ll}/u.test(option) && !/\p{Lu}/u.test(option))
      problems.push(`${label} — možnosť "${option}" nezačína veľkým písmenom`);
  }

  // Zakázané typy otázok podľa zadania.
  if (/\bv (ktorom|akom) (roku|roce)\b/i.test(question))
    problems.push(`${label} — zakázaná otázka na rok`);
  // Zakázané je memorovanie letopočtov, nie všeobecne známe čísla (365 dní, 206 kostí, 007).
  const yearLike = options.filter(option => {
    const value = Number(option.trim());
    return /^\d{4}$/.test(option.trim()) && value >= 1000 && value <= 2100;
  });
  if (yearLike.length >= 3)
    problems.push(`${label} — možnosti sú memorovanie letopočtov`);
  if (/koľko je\s+\d/i.test(question) || /\d\s*[+\-×÷*/]\s*\d/.test(question))
    problems.push(`${label} — zakázaná aritmetická otázka`);
  if (/\bobyvateľov mal/i.test(question))
    problems.push(`${label} — zakázaná otázka na presný počet obyvateľov`);
  if (
    /[a-záäčďéíĺľňóôŕšťúýž]\s*$/i.test(question.replace(/\?$/, "")) &&
    question.length > MAX_QUESTION_CHARS
  )
    problems.push(`${label} — príliš dlhá formulácia`);
}

if (flat.length < MIN_QUESTIONS)
  problems.push(
    `Databáza má len ${flat.length} otázok, požaduje sa aspoň ${MIN_QUESTIONS}`
  );

if (problems.length) {
  console.error(`Build zastavený — ${problems.length} problém(ov):`);
  for (const problem of problems.slice(0, 40)) console.error(`  • ${problem}`);
  if (problems.length > 40)
    console.error(`  … a ďalších ${problems.length - 40}`);
  process.exit(1);
}

// ─── Rovnomerné rozloženie správnej odpovede ──────────────────────────────
// Možnosti sa v hre nemiešajú, takže pozíciu správnej odpovede musíme rozhodiť tu.
const positions = deterministicShuffle(
  flat.map((_, index) => index % 4),
  20260820
);

const usedFactKeys = new Set();
const questions = flat.map((entry, index) => {
  const correctIndex = positions[index];
  const options = [...entry.wrong];
  options.splice(correctIndex, 0, entry.correct);

  const hash = createHash("sha1")
    .update(entry.question)
    .digest("hex")
    .slice(0, 8);
  const slug =
    normalize(entry.correct).replace(/\s+/g, "_").slice(0, 28) || "odpoved";
  const factKey = `party_${slug}_${hash}`;
  if (usedFactKeys.has(factKey))
    throw new Error(`Duplicitný factKey: ${factKey}`);
  usedFactKeys.add(factKey);

  return {
    id: `quiz-sk-${String(index + 1).padStart(4, "0")}`,
    factKey,
    question: entry.question,
    answer: entry.correct,
    category: entry.category,
    difficulty: entry.difficulty,
    options,
    correctIndex,
  };
});

// Bezpečnostná kontrola invariantu, na ktorom stojí bodovanie v Quiz.tsx.
for (const question of questions) {
  if (question.options[question.correctIndex] !== question.answer) {
    throw new Error(`Nesúlad answer/correctIndex pri ${question.id}`);
  }
}

const targetPath = path.resolve("client/src/data/quiz-master.raw.json");
await writeFile(targetPath, `${JSON.stringify(questions, null, 2)}\n`, "utf8");

// Slovenčina je zdroj pravdy. Preklady sa generujú samostatne
// (scripts/translate-quiz-localizations.mjs); dovtedy hra korektne
// spadne späť na slovenský text pre každý jazyk.
const localizationsPath = path.resolve(
  "client/src/data/quiz-localizations.json"
);
await writeFile(
  localizationsPath,
  `${JSON.stringify({ en: {}, de: {}, es: {}, fr: {}, pt: {} }, null, 2)}\n`,
  "utf8"
);

// ─── Súhrn ────────────────────────────────────────────────────────────────
const countBy = selector =>
  questions.reduce((accumulator, question) => {
    const key = selector(question);
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

const optionLengths = questions.flatMap(question =>
  question.options.map(option => option.length)
);
console.log(`Vygenerovaných otázok: ${questions.length}`);
console.log(
  `Obtiažnosť: ${JSON.stringify(countBy(question => question.difficulty))}`
);
console.log(
  `Pozícia správnej odpovede: ${JSON.stringify(countBy(question => question.correctIndex))}`
);
console.log(
  `Kategórie: ${JSON.stringify(
    countBy(question => question.category),
    null,
    2
  )}`
);
console.log(
  `Najdlhšia otázka: ${Math.max(...questions.map(question => question.question.length))} znakov`
);
console.log(`Najdlhšia možnosť: ${Math.max(...optionLengths)} znakov`);
console.log(`Zapísané: ${targetPath}`);
console.log(
  `Preklady vyprázdnené (fallback na slovenčinu): ${localizationsPath}`
);
