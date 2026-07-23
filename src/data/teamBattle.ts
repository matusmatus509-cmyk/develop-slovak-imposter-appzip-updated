import {
  ALL_TEAM_CHARADES_WORDS,
  TEAM_CHARADES_WORDS,
} from "./charades";
import { getCharacterCategories } from "./characters";
import type { AppLanguage } from "../i18n/LanguageProvider";

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
  // — rozšírenie zo slovnej zásoby (Ľahké) —
  "Dom", "Slnko", "Strom", "Mesiac", "Hviezda", "Kvet", "Srdce", "Jablko", 
  "Huba", "Hrnček", "Okuliare", "Motýľ", "Snehuliak", "Auto", "Loď", 
  "Lietadlo", "Vlak", "Posteľ", "Okno", "Hodiny", "Loptička", "Tričko", 
  "Nohavice", "Čiapka", "Kladivo", "Píla", "Vidlička", "Nožík", "Tanier", 
  "Koruna", "Meč", "Štít", "Luk", "Šíp", "Kotva", "Kôš", "Krabica", "Balón", 
  "Ceruzka", "Papier", "Hračka", "Kocka", "Hrad", "Kopec", "Rieka", "Ostrov", 
  "Cesta", "Most", "Stan", "Lampa", "Kefa", "Pero", "Pravítko", "Guma", 
  "Lepidlo", "Kufrík", "Taška", "Peňaženka", "Košeľa", "Sukňa", "Šaty", 
  "Ponožka", "Rukavica", "Šál", "Opasok", "Náušnice", "Hodinky", "Zámok", 
  "Rebrík", "Kýbel", "Metla", "Klince", "Skrutka", "Tehla", "Drevo", "List", 
  "Tráva", "Kameň", "Piesok", "Blato", "Sneh", "Ľad", "Voda", "Oheň", "Dym", 
  "Mrak", "Dúha", "Dážď", "Blesk", "Hruška", "Slivka", "Hrozno", "Jahoda", 
  "Mrkva", "Cibuľa", "Zemiak", "Paradajka", "Vajce", "Syr", "Saláma", "Torta", 
  "Koláč", "Zmrzlina", "Káva", "Čaj", "Mlieko", "Džús", "Víno", "Pivo", 
  "Polievka", "Pizza", "Burger", "Hranolky", "Ryža", "Cestoviny", "Mäso", 
  "Autobus", "Električka", "Trolejbus", "Motorka", "Kolobežka", "Vrtuľník", 
  "Ponorka", "Raketa", "Kamión", "Dodávka", "Taxi", "Sanitka", "Hasiči", 
  "Polícia", "Traktor", "Križovatka", "Tunel", "Chodník", "Stanica", "Letisko", 
  "Prístav", "Učiteľ", "Lekár", "Predavač", "Kuchár", "Automechanik", "Murár", 
  "Tesár", "Elektrikár", "Inštalatér", "Maliar", "Upratovačka", "Hasič", 
  "Policajt", "Vojak", "Pilot", "Právnik", "Lekárnik", "Architekt", "Novinár", 
  "Spisovateľ", "Herec", "Spevák", "Hudobník", "Športovec", "Futbal", "Hokej", 
  "Tenis", "Basketbal", "Volejbal", "Hádzaná", "Atletika", "Snowboard", "Box", 
  "Karate", "Tanec", "Gymnastika", "Šach", "Karty", "Škola", "Trieda", "Zošit", 
  "Učebnica", "Skúška", "Prázdniny", "Univerzita", "Nemocnica", "Ambulancia", 
  "Lekáreň", "Kvapky", "Náplasť", "Horúčka", "Tlakomer", "Zubár", "Obchod", 
  "Pokladňa", "Peniaze", "Euro", "Banka", "Pošta", "Kuriér", "Trh", 
  "Reštaurácia", "Kaviareň", "Cukráreň", "Hotel", "Kino", "Divadlo", "Múzeum", 
  "Galéria", "Koncert", "Festival", "Cirkus", "ZOO", "Park", "Ihrisko", 
  "Knižnica", "Kostol", "Kaštieľ", "Palác", "Úrad", "Mesto", "Dedina", "Ulica", 
  "Námestie", "Panelák", "Chata", "Chalupa", "Záhrada", "Pole", "Les", "Hory", 
  "Skala", "Jaskyňa", "Potok", "Jazero", "Rybník", "More", "Oceán", "Pláž", 
  "Prameň", "Vodopád", "Ľadovec", "Obloha", "Planéta", "Smartfón", "Tablet", 
  "Notebook", "Tlačiareň", "Skener", "Kamera", "Rádio", "Televízia", "Konzola", 
  "Internet", "E-mail", "Webstránka", "Aplikácia", "Hra", "Karta", 
  "Stavebnica", "Puzzle", "Korčule", "Skateboard", "Švihadlo", "Trampolína", 
  "Šmykľavka", "Húpačka", "Pieskovisko", "Bazén", "Pršiplášť", "Sánky", "Lyže", 
  "Šatka", "Make-up", "Parfém", "Mydlo", "Šampón", "Uterák", "Obraz", 
  "Fotografia", "Časopis", "Noviny", "Fixka", "Zakladač", "Zošívačka", 
  "Krieda", "Glóbus", "Batoh", "Peračník", "Baterka", "Žiarovka", "Svietnik", 
  "Zápalky", "Zapaľovač", "Popolník", "Kreslo", "Gauč", "Skriňa", "Komoda", 
  "Matrac", "Deka", "Mop", "Vysávač", "Prachovka", "Šnúra", "Kolík", "Vedro", 
  "Lavór", "Hadica", "Kosačka", "Hrable", "Rýľ", "Motyka", "Krhla", 
  "Skrutkovač", "Kliešte", "Skrutky", "Vŕtačka", "Brúska", "Vodováha", "Meter", 
  "Fúrik", "Cement", "Malta", "Farba", "Tapeta", "Kachličky", "Záchod", "Vaňa", 
  "Umývadlo", "Panvica", "Hrniec", "Plech", "Valček", "Forma", "Sitko", 
  "Strúhadlo", "Otvárač", "Vývrtka", "Korenička", "Chňapka", "Váha", "Mixér", 
  "Odšťavovač", "Rúra", "Sporák", "Mikrovlnka", "Hriankovač", "Kanvica", 
  "Mraznička", "Vrece", 
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
  // — rozšírenie zo slovnej zásoby (Stredné) —
  "Hrad", "Vrtuľník", "Bicykel", "Ponorka", "Pirátska loď", "Balón (letový)", 
  "Motorka", "Kamión", "Sanitka", "Hasičské auto", "Karavan", 
  "Poštová schránka", "Komín", "Maják", "Studňa", "Mlyn", "Most", "Tunel", 
  "Krb", "Rebrík", "Plot", "Húpačka", "Semafor", "Klietka", "Sud", 
  "Sud na víno", "Ruksak", "Dáždnik", "Nákupná taška", "Gitara", "Husle", 
  "Klavír", "Bubon", "Flauta", "Mikrofón", "Slúchadlá", "Fotoaparát", "Laptop", 
  "Hriankovač", "Vysávač", "Teplomer", "Váza", "Mapa", "Zástava", "Hrob", 
  "Poklad", "Lebka", "Diamant", "Prsteň", "Náhrdelník", "Náušnice", "Hodinky", 
  "Minca", "Palma", "Stromček (ihličnatý)", "Hrozno", "Melón", "Jahoda", 
  "Ananás", "Citrón", "Tekvica", "Mrkva", "Paradajka", "Zemiak", "Kukurica", 
  "Lev", "Tiger", "Medveď", "Slon", "Žirafa", "Zebra", "Opica", "Kengura", 
  "Ťava", "Hroch", "Krokodíl", "Žralok", "Veľryba", "Tučniak", "Papagáj", 
  "Páv", "Orol", "Sova", "Labuť", "Kačka", "Kura", "Kohút", "Prasa", "Krava", 
  "Kôň", "Ovca", "Koza", "Pes", "Mačka", "Zajac", "Myš", "Potkan", "Veverička", 
  "Vlk", "Líška", "Pavúk", "Slimák", "Korytnačka", "Duch", "Pirát", 
  "Princezná", "Kráľ", "Rytier", "Indián", "Kovboj", "Robot", "Astronaut", 
  "Čarodejník", "Klaun", "Strašidlo", "Múmia", "Anjel", "Čert", "Upír", 
  "Vlkodlak", "Zombie", "Víla", "Trpaslík", "Obor", "Drak", "Jednorožec", 
  "Morská panna", "Pneumatika", "Šofér", "Rušňovodič", "Koľajnice", "Revízor", 
  "Prilba", "Reťaz", "Elektrická kolobežka", "Letuška", "Kapitán", "Periskop", 
  "Náves", "Kuriér", "Taxikár", "Záchranár", "Policajné auto", "Vlečka", 
  "Diaľnica", "Nadjazd", "Horský prechod", "Prechod pre chodcov", "Nástupište", 
  "Pristávacia dráha", "Riaditeľ školy", "Zdravotná sestra", "Pokladník", 
  "Čašník", "Dielňa", "Stavba", "Krov", "Skrat", "Potrubie", "Štetec", "Mop", 
  "Puto", "Uniforma", "Paluba", "Sudca", "Recept", "Výkres", "Kamera", "Kniha", 
  "Divadlo", "Nástroj", "Tréner", "Bránka", "Puk", "Sieť", "Palubovka", 
  "Tretry", "Bazén", "Lyže", "Viazanie", "Cyklista", "Rukavice", "Kimono", 
  "Balet", "Hrazda", "Figúrka", "Poker", "Učebnica", "Lavica", "Ceruzka", 
  "Známka", "Leto", "Študent", "Čakáreň", "Lieky", "Kvapky do nosa", 
  "Lekárnička v aute", "Vitamín C", "Srdce", "Vakcína", "Plomba", "Regál", 
  "Účet", "Bankovka", "Balík", "Auto", "Stánok", "Kuchyňa", "Zákusok", 
  "Recepcia", "Izba", "Film", "Opona", "Exponát", "Obraz", "Pódium", 
  "Zvieratá", "Zvon", "Zrúcanina", "Park", "Múzeum", "Prezident", "Pečiatka", 
  "Centrum", "Dom", "Chodník", "Fontána", "Strecha", "Byt", "Les", "Záhrada", 
  "Skleník", "Huba", "Turistika", "Výhľad", "Kvaple", "Prúd", "Voda", "Pláž", 
  "Loď", "Piesok", "Skala", "Láva", "Sneh", "Mrak", "Lúč", "Spln", "Súhvezdie", 
  "Zem", "Nabíjačka", "Displej", "Klávesnica", "Toner", "USB kľúč", "Objektív", 
  "Statív", "Reproduktor", "Ovládač", "Wi-Fi", "Heslo", "Prehliadač", 
  "Aktualizácia", "Šach", "Človeče", "Bábika", "Lego", "Obrázok", "Pumpa", 
  "Ventil", "Brzda", "Ľad", "Koliesko", "Skákanie", "Ihrisko", "Bábovka", 
  "Chlór", "Lehátko", "Dážď", "Kvapka", "Kopec", "Palice", "Hokej", "Krk", 
  "Prsty", "Uši", "Rám", "Pery", "Zrkadlo", "Vôňa", "Dávkovač", "Vlasy", 
  "Vešiak", "Zuby", "Účes", "Maliar", "Rámik", "Strana", "Titulka", "Tuha", 
  "Tabuľa", "Trojuholník", "Riadok", "Šanón", "Papier", "Páska", "Sponky", 
  "Zips", "Zámok", "Kód", "Bankomat", "Pokladnička", "Budík", "Svetlo", 
  "Závit", "Sviečka", "Krabička", "Plyn", "Cigareta", "Kľučka", "Noha", 
  "Operadlo", "Obývačka", "Polica", "Zásuvka", "Rošt", "Pena", "Teplo", 
  "Bielizeň", "Lopatka", "Vedro", "Prach", "Para", "Šnúra", "Tráva", "Lístie", 
  "Hlna", "Burina", "Klinec", "Drevo", "Skrutka", "Drôt", "Matica", "Vrták", 
  "Kotúč", "Stena", "Pásmo", "Výška", "Betón", "Vrece", "Valček", "Kúpeľňa", 
  "Kefa", "Sprcha", "Sifón", "Polička", "Píšťalka", "Teplota", "Pokrievka", 
  "Rúra", "Cesto", "Múka", "Syr", "Konzerva", "Zátka", "Soľ", "Gramy", 
  "Šľahač", "Ovocie", "Teplovzdušná", "Ohrev", "Chlieb", "Filter", "Mraznička", 
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
  // — rozšírenie zo slovnej zásoby (Ťažké) —
  "Záchranné koleso", "Eiffelova veža", "Ruské koleso", "Slnečné hodiny", 
  "Ozubené koleso", "Horská dráha", "Invalidný vozík", "Nákupný košík", 
  "Veterný mlyn", "Vodný mlyn", "Hasičské auto", "Káblová televízia", 
  "Rybársky prút", "Písací stroj", "Elektrická gitara", "Gramofónová platňa", 
  "Šijací stroj", "Digitálne hodinky", "Hrnčiarsky kruh", "Hubka na riad", 
  "Strúhadlo na mrkvu", "Spínací špendlík", "Mikrovlnná rúra", "Zubná kefka", 
  "Rýchlovarná kanvica", "Otvárač na fľaše", "Horský bicykel", 
  "Dopravná značka", "Kompas", "Boxerská rukavica", "Šachová figúrka", 
  "Vianočný veniec", "Tenisová raketa", "Hokejová hokejka", "Luk a šíp", 
  "Hula hop kruh", "Skateboard", "Kolieskové korčule", "Futbalová bránka", 
  "Hasiaci prístroj", "Rybárska sieť", "Vtáčia búdka", "Psia búda", 
  "Konská podkova", "Včelí úľ", "Mravenisko", "Pavučina", "Lastovičie hniezdo", 
  "Koralový útes", "Starý hrad", "Šikmá veža", "Socha", "Pyramída", 
  "Snežné iglu", "Indiánsky stan", "Kaktus na púšti", "Palma na ostrove", 
  "Vodopád v lese", "Sopka s lávou", "Dúha nad mestom", "Búrkový mrak", 
  "Blesk na oblohe", "Lesný požiar", "Zasnežený kopec", "Vesmírna loď", 
  "Planéta Saturn", "Veľký voz (súhvezdie)", "Padajúca hviezda", 
  "Spln mesiaca", "Zatmenie slnka", "Nočná obloha", "Páví chvost", 
  "Krídla motýľa", "Sloní chobot", "Kengura s mláďaťom", "Žirafí krk", 
  "Korytnačí pancier", "Ťava s hrbmi", "Zebra s pruhmi", "Vták na strome", 
  "Ryba pod vodou", "Morský koník", "Hviezdica na dne", "Žraločia plutva", 
  "Delfín vo vlne", "Labuť na jazere", "Ďateľ na strome", "Plameniak", 
  "Sova na konári", "Orol za letu", "Netopier v jaskyni", "Pavúk na pavučine", 
  "Škorpión v piesku", "Včela na kvete", "Húsenica na liste", 
  "Slimák s domčekom", "Krab s klepetami", "Medúza vo vode", "Morské riasy", 
  "Zlatá rybka", "Rybičky v akváriu", "Lietajúci tanier", "Vesmírna raketa", 
  "Astronaut na mesiaci", "Robot s anténou", "Veľké pirátske oko", 
  "Zelený drak", "Kôň s rohom", "Lietajúci vták", "Morská víla", "Lukostrelec", 
  "Strašidelná múmia", "Veľké strašidlo", "Upírske zuby", "Duch s reťazou", 
  "Čarodejnícky klobúk", "Lietajúca metla", "Varenie v kotlíku", 
  "Kúzelná palička", "Stará kniha", "Vianočný stromček", 
  "Darček pod stromčekom", "Dedko Mráz", "Veľkonočné vajíčko", 
  "Narodeninová torta", "Sviečky na torte", "Pohár so šampanským", 
  "Vyrezávaná tekvica", "Svadobná torta", "Svadobné obrúčky", 
  "Sanitka prvej pomoci", "Nafukovací čln", "Hasičská prilba", 
  "Policajný odznak", "Kuchárska čiapka", "Zlatá koruna", "Lekársky stetoskop", 
  "Zubárske kreslo", "Kancelárska stolička", "Školská tabuľa", "Mikroskop", 
  "Skúmavka s tekutinou", "Lupa na stole", "Stará mapa", "Školský glóbus", 
  "Hudobné noty", "Paleta s farbami", "Maliarsky stojan", "Divadelná maska", 
  "Filmová klapka", "Lístok do kina", "Fotografický blesk", "Bezpečnostný pás", 
  "Volant auta", "Železničná stanica", "Cestovný lístok", "Mestská doprava", 
  "Výfukové plyny", "Chodník pre chodcov", "Letisko Bratislava", 
  "Riadiaca veža", "Lodný prístav", "Severný ľadový oceán", 
  "Medzinárodná vesmírna stanica", "Kamiónová doprava", "Balíková pošta", 
  "Mobilná aplikácia", "Maják na aute", "Požiarna striekačka", 
  "Policajná siréna", "Poľnohospodárske družstvo", "Asfaltová cesta", 
  "Kruhový objazd", "Visutý most", "Diaľničný tunel", "Cestovný poriadok", 
  "Bezpečnostná kontrola", "Kotva lode", "Učiteľská katedra", 
  "Stetoskop na srdce", "Jedálny lístok", "Zdvihák na auto", 
  "Miešačka na betón", "Motorová píla", "Elektrický prúd", "Vodovodný kohútik", 
  "Maliarsky valček", "Čistiaci prostriedok", "Vojenská základňa", 
  "Kabína pilota", "Súdna sieň", "Lekáreň na rohu", "Stavebné povolenie", 
  "Tlačová konferencia", "Vydavateľstvo kníh", "Divadelné predstavenie", 
  "Koncertná hala", "Symfonický orchester", "Olympijské hry", 
  "Futbalová lopta", "Tenisový kurt", "Basketbalová lopta", "Plážový volejbal", 
  "Športová hala", "Bežecká dráha", "Plavecké okuliare", "Lyžiarske stredisko", 
  "Zimné športy", "Cyklistická prilba", "Boxerský ring", "Čierny pás", 
  "Tanečná škola", "Športová gymnastika", "Šachovnica", "Hracie karty", 
  "Školská taška", "Plniace pero", "Peračník do školy", "Školský výlet", 
  "Vysvedčenie na konci", "Letný tábor", "Diplomová práca", "Operačná sieň", 
  "Zdravotná karta", "Vitamín CRecept", "Obväz", "Teplomer", "Recept", 
  "Vysoký krvný tlak", "Odber krvi", "Zubná vŕtačka", "Nákupný zoznam", 
  "Platobná karta", "Bankomat na ulici", "Peňaženka na drobné", 
  "Internet banking", "Poštová známka", "Poštová schránka", 
  "Doručenie na adresu", "Čerstvá zelenina", "Rezervácia stola", 
  "Espresso s mliekom", "Izbový kľúč", "Ubytovanie na noci", "Popcorn v kine", 
  "Vstupenka do divadla", "Historická budova", "Výstava umenia", "Živá hudba", 
  "Hudobný festival", "Šapitó stan", "Kŕmenie zvierat", "Detské ihrisko", 
  "Pieskovisko pre deti", "Čitateľský preukaz", "Kostolná veža", 
  "Historický hrad", "Prehliadka zámku", "Anglický park", "Prezidentský palác", 
  "Občiansky preukaz", "Pešia zóna", "Poľnohospodárske pole", 
  "Pouličné osvetlenie", "Mestský úrad", "Rodinný dom", "Výťah v bytovke", 
  "Víkendová chata", "Vidiecky dom", "Kosenie trávnika", "Žatva obilia", 
  "Lesný chodník", "Turistická značka", "Lanovka na vrchol", "Skalné steny", 
  "Podzemná jaskyňa", "Splavovanie rieky", "Horský potok", "Kúpanie v jazere", 
  "Chov rýb", "Dovolenka pri mori", "Atlantický oceán", "Opustený ostrov", 
  "Slnečník na pláži", "Minerálny prameň", "Horský vodopád", "Púštna oáza", 
  "Výbuch sopky", "Topenie ľadovcov", "Modrá obloha", "Slnečné žiarenie", 
  "Mliečna dráha", "Slnečná sústava", "Dotykový displej", "Ochranné sklo", 
  "Bezdrôtová myš", "Kancelársky papier", "Externý harddisk", "Pamäťová karta", 
  "Natáčanie videa", "Bluetooth reproduktor", "Bezdrôtové nabíjanie", 
  "Satelitný prijímač", "Počítačová hra", "Wi-Fi router", "Sociálna sieť", 
  "Vyhľadávač Google", "Google Play", "Spoločenská hra", "Žolíkové karty", 
  "Človeče, nehnevaj sa", "Drevený vláčik", "Lego stavebnica", 
  "Skladanie puzzle", "Nafukovanie lopty", "Defekt na kolese", 
  "Kotúčová brzda", "U-rampa", "Kondičný tréning", "Detská šmykľavka", 
  "Záhradná húpačka", "Plastové vedierko", "Nafukovacie koleso", 
  "Opaľovací krém", "Skladací dáždnik", "Uhoľné oči", "Sánkovanie na kopci", 
  "Lyžiarske okuliare", "Zimný štadión", "Zimný šál", "Vlnené rukavice", 
  "Zimná čiapka", "Dioptrické okuliare", "Balzam na pery", 
  "Kozmetická taštička", "Toaletná voda", "Tekuté mydlo", 
  "Kondicionér na vlasy", "Osuška na pláž", "Medzizubná kefka", 
  "Kulma na vlasy", "Nástenné zrkadlo", "Olejomaľba na plátne", 
  "Fotorámik na stôl", "Záložka do knihy", "Týždenný časopis", "Denná tlač", 
  "Guľôčkové pero", "Popísaná guma", "Biela tabuľa", "Rysovacie potreby", 
  "Štvorčekový zošit", "Kancelárska sponka", "Strihanie papiera", 
  "Kancelárska zošívačka", "Školská krieda", "Mapa sveta", "Školský batoh", 
  "Školský peračník", "Visiaci zámok", "Číselný zámok", "Kožená peňaženka", 
  "Platobný terminál", "Prasiatko na peniaze", "Ručičkové hodiny", 
  "Čelové svietidlo", "LED žiarovka", "Vosková sviečka zápalky", 
  "Škrtnutie zápalkou", "Benzínový zapaľovač", "Elektronická cigareta", 
  "Otvorené okno", "Kľúčová dierka", "Jedálenský stôl", "Drevená stolička", 
  "Húpacie kreslo", "Rozkladacia pohovka", "Knihovňa v izbe", "Nočný stolík", 
  "Manželská posteľ", "Anatomický vankúš", "Vlnená deka", "Kôš na prádlo", 
  "Smetná lopatka", "Žmýkanie mopu", "Tyčový vysávač", "Utieranie prachu", 
  "Naparovacia žehlička", "Sušiak na prádlo", "Štipec na prádlo", 
  "Plastové vedro", "Plastový lavór", "Polievanie záhrady", 
  "Benzínová kosačka", "Hrabanie lístia", "Kopanie jamy", 
  "Prekopávanie záhrady", "Okopávanie zeleniny", "Polievanie kvetov", 
  "Zatĺkanie klinca", "Ručná píla", "Rúbanie dreva", "Krížový skrutkovač", 
  "Štípacie kliešte", "Stavebné klince", "Podložka pod skrutku", 
  "Príklepová vŕtačka", "Uhlová brúska", "Stavebná vodováha", 
  "Svinovací meter", "Skladací rebrík", "Stavebný fúrik", "Betónová tvárnica", 
  "Miešanie betónu", "Omietka na stenu", "Maľovanie izby", "Lepenie tapiet", 
  "Obkladanie kúpeľne", "Vodovodná batéria", "Kúpeľňové zrkadlo", 
  "Varenie vody", "Teflonová panvica", "Tlakový hrniec", "Pečenie koláča", 
  "Vaľkanie cesta", "Forma na pečenie", "Preosievanie múky", "Strúhanie syra", 
  "Otvárač na víno", "Korková zátka", "Soľnička a korenička", 
  "Kuchynská rukavica", "Digitálna váha", "Ručný mixér", "Pomarančová šťava", 
  "Elektrická rúra", "Indukčná varná doska", "Ohrievanie jedla", 
  "Hrianky s cesnakom", "Filtračná kanvica", "Americká chladnička", 
  "Kocky ľadu", "Smetný kôš", 
];

export const PANTOMIMA_WORDS_BY_DIFFICULTY: Record<PantomimaDifficulty, string[]> = {
  lahke: PANTOMIMA_EASY,
  stredne: PANTOMIMA_MEDIUM,
  tazke: PANTOMIMA_HARD,
};

// ── Šarády words (describe it verbally, no derivatives) ──────────────────────
// Now using the same difficulty-based word database from categories.ts

export const SARADY_DIFFICULTY_POINTS: Record<string, number> = {
  lahke: 1,
  stredne: 1,
  tazke: 1,
};

export const SARADY_DIFFICULTY_LABELS: Record<string, string> = {
  lahke: "Ľahké",
  stredne: "Stredné",
  tazke: "Ťažké",
};

export const SARADY_WORDS_BY_DIFFICULTY: Record<string, string[]> = {
  lahke: [...TEAM_CHARADES_WORDS.lahke],
  stredne: [...TEAM_CHARADES_WORDS.stredne],
  tazke: [...TEAM_CHARADES_WORDS.tazke],
};

export const SARADY_WORDS: string[] = [...ALL_TEAM_CHARADES_WORDS];

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

const LOCAL_TEAM_CHARACTERS = new Set([
  "Marek Hamšík",
  "Peter Sagan",
  "Zuzana Čaputová",
]);

export function getTeamCharacters(language: AppLanguage): string[] {
  const starterCards = language === "sk"
    ? TEAM_CHARACTERS
    : TEAM_CHARACTERS.filter((character) => !LOCAL_TEAM_CHARACTERS.has(character));
  const categoryCards = getCharacterCategories(language)
    .flatMap((category) => category.characters);
  return [...new Set([...starterCards, ...categoryCards])];
}

// ── Quiz questions ────────────────────────────────────────────────────────────
export interface QuizQuestion {
  question: string;
  answer: string;
  category: string;
  // Multiple-choice questions (A/B/C/D). When present, the quiz screen
  // hides the answer texts as soon as a team buzzes in and only shows
  // the four letters — the team must pick blind from memory.
  options?: [string, string, string, string];
  correctIndex?: 0 | 1 | 2 | 3;
}

const CORE_QUIZ_QUESTIONS: QuizQuestion[] = [
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

  // ── Otázky s možnosťami (A, B, C, D) ──────────────────────────────────────
  { question: "Ktorá farba vznikne zmiešaním modrej a žltej farby?", options: ["Zelená", "Fialová", "Oranžová", "Hnedá"], correctIndex: 0, answer: "Zelená", category: "🎨 Zaujímavosti" },
  { question: "Ktoré zviera je považované za najrýchlejšieho suchozemského cicavca na svete?", options: ["Lev", "Gepard", "Antilopa", "Kôň"], correctIndex: 1, answer: "Gepard", category: "🐆 Zvieratá" },
  { question: "Ako sa volá hlavná hrdinka v Disney rozprávke Ľadové kráľovstvo (Frozen), ktorá má magickú moc nad snehom a ľadom?", options: ["Anna", "Fiona", "Elsa", "Bella"], correctIndex: 2, answer: "Elsa", category: "🎬 Pop kultúra" },
  { question: "Ktorá krajina je celosvetovo preslávená pôvodom jedál ako pizza a špagety?", options: ["Španielsko", "Taliansko", "Francúzsko", "Grécko"], correctIndex: 1, answer: "Taliansko", category: "🍝 Jedlo" },
  { question: "Koľko dní má prestupný rok?", options: ["364", "365", "366", "367"], correctIndex: 2, answer: "366", category: "📅 Fakty" },
  { question: "Ktorá planéta je najbližšie k Slnku?", options: ["Venuša", "Mars", "Merkúr", "Zem"], correctIndex: 2, answer: "Merkúr", category: "🔬 Veda" },
  { question: "Ktorý slávny spevák bol celosvetovo známy ako „Kráľ popu“?", options: ["Elvis Presley", "Michael Jackson", "Freddie Mercury", "Prince"], correctIndex: 1, answer: "Michael Jackson", category: "🎬 Pop kultúra" },
  { question: "Ako sa volá najväčší oceán na našej planéte?", options: ["Atlantický oceán", "Indický oceán", "Tichý oceán (Pacifik)", "Severný ľadový oceán"], correctIndex: 2, answer: "Tichý oceán (Pacifik)", category: "🌍 Geografia" },
  { question: "Ktorý vták je známy tým, že kladie svoje vajcia do hniezd iných vtákov?", options: ["Kukučka", "Lastovička", "Bocian", "Sova"], correctIndex: 0, answer: "Kukučka", category: "🐦 Zvieratá" },
  { question: "Koľko srdcí má chobotnica?", options: ["1", "2", "3", "Žiadne"], correctIndex: 2, answer: "3", category: "🐙 Zvieratá" },

  // ── Otvorené otázky (bez možností) ────────────────────────────────────────
  { question: "Ktorá svetoznáma hračka sa skladá z farebných plastových kociek, ktoré sa do seba spájajú, a pochádza z Dánska?", answer: "Lego", category: "🧸 Hračky" },
  { question: "Koľko minút má jedna hodina?", answer: "60", category: "⏰ Fakty" },
  { question: "Ako sa volá fiktívny žltý animovaný hrdina, ktorý žije v ananáse pod vodou na dne oceánu?", answer: "SpongeBob", category: "🎬 Pop kultúra" },
  { question: "Ktoré ročné obdobie nasleduje na severnej pologuli hneď po zime?", answer: "Jar", category: "🌸 Príroda" },
  { question: "Koľko kolies má klasický dvojkolesový bicykel?", answer: "2", category: "🚲 Fakty" },
  { question: "Ako sa volá najbližšia hviezda k našej planéte Zem?", answer: "Slnko", category: "🔬 Veda" },
  { question: "Ktorý svetoznámy umelec a vynálezca namaľoval slávny obraz Mona Lisa?", answer: "Leonardo da Vinci", category: "🎨 Umenie" },
  { question: "Ktorý kontinent je najchladnejší, najsuchší a takmer celý pokrytý ľadom?", answer: "Antarktída", category: "🌍 Geografia" },
  { question: "Ako sa volá najvyšší vrch (hora) na planéte Zem?", answer: "Mount Everest", category: "🌍 Geografia" },
  { question: "Ktorý mliečny výrobok sa vyrába stĺkaním smotany a bežne si ho natierame na chlieb?", answer: "Maslo", category: "🧈 Jedlo" },

  // ── Globálny mix pre všetky vekové kategórie (A, B, C, D) ─────────────────
  { question: "Ako sa volá hlavný nepriateľ Harryho Pottera, ktorého meno sa väčšina čarodejníkov bojí vysloviť?", options: ["Voldemort", "Snape", "Malfoy", "Grindelwald"], correctIndex: 0, answer: "Voldemort", category: "📚 Kniha/Film" },
  { question: "Ktorý orgán v ľudskom tele pumpuje krv a funguje ako motor celého tela?", options: ["Pľúca", "Mozog", "Žalúdok", "Srdce"], correctIndex: 3, answer: "Srdce", category: "🔬 Veda" },
  { question: "Ako sa volá najznámejšia bábika na svete od spoločnosti Mattel, ktorá má aj svojho priateľa Kena?", options: ["Barbie", "Elsa", "Polly Pocket", "Jasmine"], correctIndex: 0, answer: "Barbie", category: "🧸 Hračky" },
  { question: "Čo sa stane s vodou, keď jej teplota klesne pod 0 °C (bod mrazu)?", options: ["Začne sa variť", "Vyparí sa", "Zmení sa na ľad (zmrzne)", "Zmení farbu na modrú"], correctIndex: 2, answer: "Zmení sa na ľad (zmrzne)", category: "🔬 Veda" },
  { question: "Ktoré ovocie je hlavnou surovinou na výrobu vína?", options: ["Jablká", "Hrozno", "Pomaranče", "Slivky"], correctIndex: 1, answer: "Hrozno", category: "🍇 Jedlo" },
  { question: "Ktorá krajina darovala Spojeným štátom americkým ikonickú Sochu slobody, ktorá stojí v New Yorku?", options: ["Veľká Británia", "Francúzsko", "Taliansko", "Španielsko"], correctIndex: 1, answer: "Francúzsko", category: "📜 História" },
  { question: "Ktorá sociálna sieť mala pred premenovaním na „X“ vo svojom logu modrého vtáčika?", options: ["Instagram", "Facebook", "Twitter", "TikTok"], correctIndex: 2, answer: "Twitter", category: "📱 Technológie" },
  { question: "Ktorý hudobný nástroj má štandardne 88 čiernych a bielych klávesov?", options: ["Akordeón", "Klavír (krídlo)", "Syntetizátor", "Harfa"], correctIndex: 1, answer: "Klavír (krídlo)", category: "🎵 Hudba" },
  { question: "Aké je chemické označenie (vzorec) pre čistú vodu?", options: ["CO2", "H2O", "NaCl", "O2"], correctIndex: 1, answer: "H2O", category: "🔬 Veda" },
  { question: "Ako sa volá najznámejšia egyptská hrobka v tvare trojbokého ihlanu?", options: ["Chrám", "Koloseum", "Pyramída", "Zámok"], correctIndex: 2, answer: "Pyramída", category: "📜 História" },
];

const EXTRA_QUIZ_QUESTIONS: QuizQuestion[] = [
  { question: "Aké je hlavné mesto Francúzska?", answer: "Paríž", category: "🌍 Geografia" },
  { question: "Aké je hlavné mesto Talianska?", answer: "Rím", category: "🌍 Geografia" },
  { question: "Aké je hlavné mesto Španielska?", answer: "Madrid", category: "🌍 Geografia" },
  { question: "Aké je hlavné mesto Portugalska?", answer: "Lisabon", category: "🌍 Geografia" },
  { question: "Aké je hlavné mesto Nemecka?", answer: "Berlín", category: "🌍 Geografia" },
  { question: "Aké je hlavné mesto Rakúska?", answer: "Viedeň", category: "🌍 Geografia" },
  { question: "Aké je hlavné mesto Maďarska?", answer: "Budapešť", category: "🌍 Geografia" },
  { question: "Aké je hlavné mesto Poľska?", answer: "Varšava", category: "🌍 Geografia" },
  { question: "Aké je hlavné mesto Česka?", answer: "Praha", category: "🌍 Geografia" },
  { question: "Aké je hlavné mesto Japonska?", answer: "Tokio", category: "🌍 Geografia" },
  { question: "Aké je hlavné mesto Kanady?", answer: "Ottawa", category: "🌍 Geografia" },
  { question: "Aké je hlavné mesto Austrálie?", answer: "Canberra", category: "🌍 Geografia" },
  { question: "Ktorá rieka preteká cez Londýn?", answer: "Temža", category: "🌍 Geografia" },
  { question: "Ktorá rieka preteká cez Paríž?", answer: "Seina", category: "🌍 Geografia" },
  { question: "Na ktorom kontinente leží Egypt?", answer: "Afrika", category: "🌍 Geografia" },
  { question: "Ktorá planéta je známa svojimi prstencami?", answer: "Saturn", category: "🔬 Veda" },
  { question: "Ktorá planéta sa nazýva červená planéta?", answer: "Mars", category: "🔬 Veda" },
  { question: "Koľko planét má Slnečná sústava?", answer: "8", category: "🔬 Veda" },
  { question: "Aký plyn potrebujú ľudia na dýchanie?", answer: "Kyslík", category: "🔬 Veda" },
  { question: "Ako sa volá proces, pri ktorom rastliny vyrábajú potravu zo svetla?", answer: "Fotosyntéza", category: "🔬 Veda" },
  { question: "Koľko kostí má približne dospelý človek?", answer: "206", category: "🔬 Veda" },
  { question: "Ktorý orgán riadi ľudské telo?", answer: "Mozog", category: "🔬 Veda" },
  { question: "Ako sa volá najväčší orgán ľudského tela?", answer: "Koža", category: "🔬 Veda" },
  { question: "Pri akej teplote vrie voda pri bežnom tlaku?", answer: "100 °C", category: "🔬 Veda" },
  { question: "Koľko nôh má pavúk?", answer: "8", category: "🐾 Zvieratá" },
  { question: "Ktorý vták nevie lietať a žije v Antarktíde?", answer: "Tučniak", category: "🐾 Zvieratá" },
  { question: "Ako sa volá mláďa koňa?", answer: "Žriebä", category: "🐾 Zvieratá" },
  { question: "Ktorý cicavec dokáže aktívne lietať?", answer: "Netopier", category: "🐾 Zvieratá" },
  { question: "Aké je najväčšie suchozemské zviera?", answer: "Slon africký", category: "🐾 Zvieratá" },
  { question: "Ktoré zviera je symbolom Austrálie a nosí mláďa vo vaku?", answer: "Klokan", category: "🐾 Zvieratá" },
  { question: "Kto napísal divadelnú hru Rómeo a Júlia?", answer: "William Shakespeare", category: "📚 Kultúra" },
  { question: "Kto namaľoval Hviezdnu noc?", answer: "Vincent van Gogh", category: "🎨 Umenie" },
  { question: "Kto skomponoval Malú nočnú hudbu?", answer: "Wolfgang Amadeus Mozart", category: "🎵 Hudba" },
  { question: "Koľko strún má klasická gitara?", answer: "6", category: "🎵 Hudba" },
  { question: "Ako sa volá najvyšší ženský spevácky hlas?", answer: "Soprán", category: "🎵 Hudba" },
  { question: "Ktorá skupina naspievala skladbu Bohemian Rhapsody?", answer: "Queen", category: "🎵 Hudba" },
  { question: "Ktorý šport sa hrá s raketou a košíkom?", answer: "Bedminton", category: "🏆 Šport" },
  { question: "Koľko hráčov má futbalový tím na ihrisku na začiatku zápasu?", answer: "11", category: "🏆 Šport" },
  { question: "V ktorom športe sa používa puk?", answer: "Hokej", category: "🏆 Šport" },
  { question: "Koľko kruhov je na olympijskej vlajke?", answer: "5", category: "🏆 Šport" },
  { question: "Ako sa volá čarodejnícka škola Harryho Pottera?", answer: "Rokfort", category: "🎬 Pop kultúra" },
  { question: "Ako sa volá kovboj z Toy Story?", answer: "Woody", category: "🎬 Pop kultúra" },
  { question: "Ako sa volá zelený zlobor z animovaného filmu?", answer: "Shrek", category: "🎬 Pop kultúra" },
  { question: "Ktorý superhrdina používa štít s hviezdou?", answer: "Captain America", category: "🎬 Pop kultúra" },
  { question: "Ako sa volá leví syn Mufasu?", answer: "Simba", category: "🎬 Pop kultúra" },
  { question: "Koľko dní má apríl?", answer: "30", category: "📅 Fakty" },
  { question: "Koľko sekúnd má jedna minúta?", answer: "60", category: "📅 Fakty" },
  { question: "Koľko strán má šesťuholník?", answer: "6", category: "🧠 Logika" },
  { question: "Aké číslo nasleduje po 999?", answer: "1000", category: "🧠 Logika" },
  { question: "Koľko je polovica zo 100?", answer: "50", category: "🧠 Logika" },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [...CORE_QUIZ_QUESTIONS, ...EXTRA_QUIZ_QUESTIONS];

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
  "Africké krajiny", "Ázijské krajiny", "Americké štáty", "Svetové rieky", "Svetové pohoria",
  "Ostrovy", "Jazerá", "Mestá pri mori", "Turistické pamiatky", "Veci na letisku",
  "Domáce zvieratá", "Lesné zvieratá", "Vtáky", "Hmyz", "Plazy",
  "Plemená psov", "Zvieratá s rohmi", "Zvieratá, ktoré lietajú", "Zvieratá s dlhým chvostom", "Nočné zvieratá",
  "Druhy zeleniny", "Sladkosti", "Dezerty", "Polievky", "Cestoviny",
  "Jedlá na raňajky", "Nealkoholické nápoje", "Koreniny", "Veci v chladničke", "Jedlá na gril",
  "Basketbalisti", "Tenisti", "Hokejové kluby", "Loptové športy", "Vodné športy",
  "Atletické disciplíny", "Športové potreby", "Veci v posilňovni", "Bojové športy", "Extrémne športy",
  "Svetoví speváci", "Hudobné skupiny", "Filmoví herci", "Animované filmy", "Televízne seriály",
  "Disney postavy", "Postavy z Harryho Pottera", "Filmoví zloduchovia", "Videohry", "Herné postavy",
  "Veci v kúpeľni", "Veci v spálni", "Veci v aute", "Veci v kancelárii", "Veci v nemocnici",
  "Veci na záhrade", "Veci v kabelke", "Veci v kufri", "Veci na stanovačke", "Veci na svadbe",
  "Veci, ktoré sú okrúhle", "Veci, ktoré sú mäkké", "Veci, ktoré sú hlučné", "Veci, ktoré sa dajú otvoriť", "Veci na baterky",
  "Dôvody na oslavu", "Výhovorky na meškanie", "Činnosti pred spaním", "Činnosti cez víkend", "Darčeky k narodeninám",
];

// ── Round types ───────────────────────────────────────────────────────────────
export type GameType =
  | "pantomima"
  | "sarady"
  | "quiz"
  | "pingpong"
  | "hadajktosom"
  | "zakazane"
  | "pesnicka"
  | "zvuk"
  | "pismeno"
  | "patzadesat";
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

// Quiz is reserved exclusively for the final round (a fitting climax), so it
// is excluded from the regular rotation below — this guarantees it never
// appears twice in the same session.
const NON_FINAL_GAMES: GameType[] = [
  "pantomima", "sarady", "zakazane", "pesnicka", "zvuk",
  "pismeno", "patzadesat", "pingpong", "hadajktosom",
];

export function generateBattleRounds(selection: number | GameType[]): BattleRound[] {
  const randomPool = Array.isArray(selection) ? [] : shuffle(NON_FINAL_GAMES);
  const games: GameType[] = Array.isArray(selection)
    ? [...selection]
    : Array.from({ length: selection }, (_, index) =>
        index === selection - 1 ? "quiz" : randomPool[index % randomPool.length]
      );
  const count = games.length;
  const rounds: BattleRound[] = [];

  // Pick positions for special rounds (not first, not last)
  const doubleAt = count > 2 ? Math.floor(count / 2) : -1;
  const lightningAt = count >= 5 ? Math.floor(count / 3) : -1;

  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1;
    const game = games[i];

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
  zakazane: "Zakázané slovo",
  pesnicka: "Uhádni pesničku",
  zvuk: "Uhádni zvuk",
  pismeno: "Slovo na písmeno",
  patzadesat: "5 za 10",
};

export const GAME_ICONS: Record<GameType, string> = {
  pantomima: "🎭",
  sarady: "💬",
  quiz: "🧠",
  pingpong: "🏓",
  hadajktosom: "🤔",
  zakazane: "🚫",
  pesnicka: "🎵",
  zvuk: "🔊",
  pismeno: "🔤",
  patzadesat: "🧠",
};
