import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outputPath = path.resolve("client/src/data/tabooCardsSk.json");
const targetPerCategory = 150;

function normalized(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("sk").replace(/[^a-z0-9]/g, "");
}

function words(value) {
  return value.split("|").map((item) => item.trim()).filter(Boolean);
}

const groups = [
  ["Jedlo a nápoje", ["pečivo", "múka", "raňajky", "maslo"], "rožok|bageta|vianočka|bryndzový halušky|puding|bábovka|makovník|koláč|tvaroh"],
  ["Zvieratá", ["zviera", "príroda", "pohyb", "prostredie"], "zebra|hroch|nosorožec|gorila|koala|lama|suriikata|plameniak|mýval|vydra|bobor|jazvec|rys|srna|veverička|netopier|drozd|vrabec|holub|labuť"],

  ["Miesta a cestovanie", ["cesta", "orientácia", "presun", "návšteva"], "mýtnica|odpočívadlo|parkovisko|pešia zóna|cyklotrasa|hraničný priechod|prístav|terminál|stanovište taxíkov|autopožičovňa|čerpacia stanica|autoumyváreň|dopravný uzol|podchod|nadchod|chodník|promenáda|nábrežie|vyhliadka|rozcestník|zákruta|obchádzka|diaľnica|rýchlostná cesta|priechod pre chodcov|zastávkový prístrešok|turniket|odbavovacia hala|informačné centrum|turistický chodník"],
  ["Miesta a cestovanie", ["ubytovanie", "nocľah", "hosť", "rezervácia"], "hostel|penzión|apartmán|kemping|chatová osada|ubytovňa|stanová plocha|horské útočisko|turistická chata|recepcia|hotelová izba|spoločná kuchyňa|raňajková miestnosť|výťahová hala|vstupná brána|lobby|batožinová úschovňa|suvenírový obchod|požičovňa bicyklov|karavanové státie|táborisko|ubytovací dom|odletová brána|príletová hala|colná kontrola|bezpečnostná kontrola|pasová kontrola|batožinový pás|čakáreň|nástupište"],
  ["Miesta a cestovanie", ["mesto", "budova", "ľudia", "okolie"], "radnica|námestie|tržnica|galéria|mestský park|kultúrny dom|komunitné centrum|detské ihrisko|verejná knižnica|plaváreň|zimný štadión|hudobný klub|tanečná sála|vysoká škola|základná škola|materská škola|súdna budova|matričný úrad|poliklinika|domov dôchodcov|azylový dom|zberný dvor|obecný úrad|hasičská stanica|policajná stanica|mestský úrad|záhradkárska osada|priemyselná zóna|obchodná pasáž|pešia lávka"],

  ["Aktivity a šport", ["šport", "pohyb", "tréning", "výkon"], "atletika|badminton|baseball|beh cez prekážky|biatlon|cyklistika|házená|jazdectvo|kanoistika|karate|krasokorčuľovanie|lukostreľba|moderný päťboj|motokros|orientačný beh|parašutizmus|poz­emný hokej|rýchlokorčuľovanie|sánkovanie|skok do diaľky|skok do výšky|skoky na lyžiach|stolný tenis|streľba|šerm|taekwondo|triatlon|vodné pólo|veslovanie|zápasenie|zjazdové lyžovanie|skateboarding|curling|vesmírny futbal"],
  ["Aktivity a šport", ["hra", "pravidlá", "hráči", "zábava"], "dáma|piškvorky|pexeso|scrabble|človeče nehnevaj sa|kartová hra|kocky|puzzle|krížovka|osemsmerovka|hlavolam|stavebnica|modelovanie|skladanie origami|kúzelnícky trik|kreslenie|maľovanie|fotografovanie|spievanie|tancovanie|hraníe na nástroj|divadelná improvizácia|pantomíma|vedomostný kvíz|spoločenská hra|turnaj|šachový zápas|biliardová partia|bowlingový zápas|hádzanie frisbee|púšťanie šarkana|jazda na kolobežke|jazda na korčuliach|cvičenie jogy|posilňovanie|strečing"],
  ["Aktivity a šport", ["voľný čas", "príroda", "výlet", "zážitok"], "turistika|kempovanie|rybárčenie|zbieranie húb|pozorovanie vtákov|záhradkárčenie|venčenie psa|piknik|opekanie|grilovanie|návšteva výstavy|sledovanie filmu|čítanie románu|počúvanie podcastu|pečenie koláča|varenie večere|nakupovanie|upratovanie|dekorovanie izby|balenie darčeka|pestovanie rastlín|plávanie v jazere|prechádzka mestom|výlet na hrad|návšteva zoo|rodinná oslava|dobrovoľníctvo|charitatívny beh|cestovanie vlakom|spoznávanie mesta|zápis do denníka|učenie sa jazyka|riešenie hádaniek|stavanie snehu­liaka|sánkovanie z kopca|hádzanie snehových gúľ"],

  ["Filmy, seriály a kultúra", ["film", "kamera", "príbeh", "divák"], "komédia|drama|thriller|detektívka|western|muzikál|animovaný film|dokumentárny film|krátky film|celovečerný film|nemý film|dobrodružný film|romantický film|historický film|vojnový film|sci-fi film|fantasy film|horor|filmový trailer|titulky|dabing|scenár|režisér|kaskadér|filmový strih|premiéra|kinosála|filmový festival|filmová cena|hlavná úloha"],
  ["Filmy, seriály a kultúra", ["seriál", "epizóda", "postava", "obrazovka"], "sitkom|miniséria|prvá séria|finále seriálu|zápletka|dejová línia|vedľajšia postava|hlavný hrdina|záverečné titulky|pilotná epizóda|seriálový maratón|streamovacia služba|televízna relácia|spravodajstvo|diskusná relácia|súťažná relácia|detský program|prírodopisný seriál|kuchárska šou|talentová šou|reality šou|talkšou|večerníček|televízny moderátor|reportáž|rozhovor do kamery|priamy prenos|archívny záznam|televízny kanál|programová ponuka"],
  ["Filmy, seriály a kultúra", ["kniha", "text", "autor", "čítanie"], "román|poviedka|báseň|bájka|rozprávka|legenda|komiks|detektívny príbeh|životopis|cestopis|kuchárska kniha|encyklopédia|učebnica|slovník|kalendár príbehov|literárna postava|rozprávač|kapitola|odsek|nadpis|obálka knihy|záložka|vydavateľstvo|knižná recenzia|autorské čítanie|knižný veľtrh|poézia|rým|verš|refrén"],
  ["Filmy, seriály a kultúra", ["hudba", "zvuk", "melódia", "vystúpenie"], "orchester|dirigent|husle|bubon|flauta|trúbka|akordeón|harmonika|violončelo|kontrabas|tamburína|saxofón|klarinet|organ|noty|hudobný album|singel|melódia|rytmus|refrén|hudobný žáner|džez|rock|pop|folklór|operný spev|zbor|skladateľ|hudobník|tanečná choreografia"],
  ["Filmy, seriály a kultúra", ["umenie", "tvorba", "výstava", "autor"], "socha|keramika|grafika|koláž|akvarel|olejomaľba|portrét|zátišie|krajinka|autoportrét|múzejný exponát|umelecká galéria|vernisáž|kurátor|rám obrazu|štetec|maliarske plátno|farebná paleta|ateliér|umelecký smer|architektúra|pomník|fontána|mozaika|vitráž|ľudový kroj|výšivka|folklórny tanec|divadelný kostým|maskér"],
  ["Filmy, seriály a kultúra", ["javisko", "predstavenie", "divák", "herec"], "opona|scéna|rekvizita|monológ|dialóg|generálna skúška|potlesk|premiérové predstavenie|bábkové divadlo|balet|opera|pantomíma|cirkusové číslo|žonglovanie|akrobatika|klaun|kúzelná šou|kabaret|koncertná sála|hudobný festival|pódium|zákulisie|hľadisko|vstupenka|program predstavenia|svetelný technik|zvukár|kostymér|scénograf|divadelný kritik"],

  ["Technológie a médiá", ["počítač", "displej", "elektronika", "ovládanie"], "stolný počítač|dotyková obrazovka|grafický tablet|čítací tablet|herný notebook|herná konzola|joystick|webkamera|digitálny fotoaparát|akčná kamera|inteligentné hodinky|fitness náramok|bezdrôtové slúchadlá|mikrofón na stojane|prenosný reproduktor|projektor|skener|kopírka|externý disk|USB kľúč|pamäťová karta|pevný disk|chladiaci ventilátor|počítačová myš|podložka pod myš|mechanická klávesnica|čítačka kariet|dokovacia stanica|elektronická čítačka|digitálny budík"],
  ["Technológie a médiá", ["internet", "sieť", "pripojenie", "online"], "wifi sieť|mobilné dáta|internetový prehliadač|vyhľadávač|webová stránka|odkaz|doména|online účet|používateľské meno|prístupový kód|dvojfaktorové overenie|bezpečnostná otázka|cloudové úložisko|stiahnutý súbor|príloha správy|spam|poštová schránka|videohovor|skupinový chat|emotikon|hlasová správa|videonahrávka|online formulár|digitálny podpis|virtuálna schôdza|domáca sieť|router|modem|server|internetový obchod"],
  ["Technológie a médiá", ["aplikácia", "program", "funkcia", "mobil"], "operačný systém|aktualizácia|inštalácia|nastavenia|notifikácia|ikona aplikácie|domovská obrazovka|vyhľadávacia lišta|mapová aplikácia|budík v mobile|kalendár v mobile|poznámková aplikácia|prehliadač fotografií|hudobná aplikácia|aplikácia na počasie|mobilná hra|platobná aplikácia|banková aplikácia|aplikácia na dopravu|jazyková aplikácia|aplikácia na cvičenie|aplikácia na recepty|aplikácia na správy|aplikácia na úpravu fotiek|obchod s aplikáciami|záloha údajov|obnovenie hesla|režim lietadlo|tichý režim|tmavý režim"],
  ["Technológie a médiá", ["médiá", "obsah", "správa", "publikum"], "spravodajský portál|online článok|titulná správa|fotogaléria|podcast|audiokniha|vysielanie|rádio|rádiový moderátor|reklamný spot|bannerová reklama|sponzorovaný príspevok|komentár pod článkom|zdieľanie príspevku|sledovateľ|profilová fotografia|sociálna sieť|diskusné fórum|blog|vlog|kanál s videami|živé vysielanie|online anketa|newsletter|mediálna kampaň|tlačová správa|redakcia|novinový titulok|reportér|fotoreportér"],
  ["Technológie a médiá", ["kód", "vývoj", "softvér", "funkcia"], "programovací jazyk|zdrojový kód|počítačový program|mobilná aplikácia|webový vývoj|databáza|algoritmus|chyba v programe|oprava chyby|testovanie softvéru|verzia programu|zálohovanie dát|šifrovanie|kybernetická bezpečnosť|antivírus|firewall|automatizácia|umelá inteligencia|virtuálna realita|rozšírená realita|digitálna mapa|navigačný systém|satelitné snímky|QR kód|čiarový kód|bezkontaktná platba|digitálna peňaženka|elektronický lístok|samoobslužná pokladňa|inteligentná domácnosť"],
  ["Technológie a médiá", ["elektrina", "zariadenie", "kábel", "energia"], "batériový článok|predlžovací kábel|adaptér|elektrická zásuvka|spínač svetla|poistková skrinka|solárny panel|nabíjacia stanica|elektrický bicykel|robotický vysávač|kuchynský robot|digitálna váha|elektronický teplomer|meteostanica|detektor dymu|domový zvonček|videovrátnik|alarm|pohybový senzor|inteligentná žiarovka|elektronický zámok|diaľkové ovládanie|bezdrôtová nabíjačka|indukčná varná doska|mikrovlnná rúra|elektrický holiaci strojček|zubná kefka na batériu|sušič vlasov|stolný ventilátor|čistička vzduchu|inteligentná zásuvka|domáca bezpečnostná kamera|laserová tlačiareň|3D tlačiareň|bluetooth reproduktor|digitálny diktafón|laserové ukazovátko|elektronická čítačka kníh|robotická kosačka|digitálny fotoalbum"],

  ["Príroda a svet", ["rastlina", "príroda", "zem", "rast"], "dub|breza|smrek|borovica|javor|vŕba|lipa|buk|gaštan|topoľ|ker|papraď|mach|lišajník|tráva|žihľava|púpava|sedmokráska|tulipán|narcis|levanduľa|pivónia|fialka|orchidea|kvet ruže|slnečnica|konvalinka|ihličie|šiška|žaluď"],
  ["Príroda a svet", ["záhrada", "rastlina", "plod", "pestovanie"], "paradajka|uhorka|paprika|brokolica|karfiol|kapusta|špenát|reďkovka|cvikla|tekvica|hrach|fazuľa|kukurica|pór|petržlen|bazalka|mäta|rozmarín|kôpor|pažítka|hrozno|hruška|slivka|marhuľa|čerešňa|malina|čučoriedka|egreš|ríbezľa|kiwi"],
  ["Príroda a svet", ["počasie", "obloha", "vzduch", "príroda"], "mrholenie|prehánka|búrka|víchrica|vetrík|hmla|námraza|poľadovica|krupobitie|horúčava|sucho|mráz|závej|snehová vločka|lavína|topenie snehu|oblačnosť|jasná obloha|východ slnka|západ slnka|polárna žiara|zatmenie slnka|zatmenie mesiaca|kométa|meteor|meteorit|súhvezdie|planéta|obežná dráha|galaxia"],
  ["Príroda a svet", ["krajina", "príroda", "terén", "voda"], "údolie|roklina|tiesňava|kaňon|náhorná plošina|vrchovina|pohorie|hrebeň|priesmyk|úbočie|lúka|pasienok|močiar|bažina|prameň|potok|riečny breh|delta rieky|záliv|pobrežie|útes|polostrov|súostrovie|koralový útes|ľadovec|snehové pole|piesočná duna|sopečný ostrov|gejzír|termálny prameň"],
  ["Príroda a svet", ["Zem", "svet", "krajina", "ľudia"], "kontinent|oceán|rovník|pologuľa|severný pól|južný pól|časové pásmo|hlavné mesto|štátna hranica|vlajka krajiny|jazyk|národnosť|populácia|cudzia mena|svetadiel|atlas sveta|zemepisná šírka|zemepisná dĺžka|mapový mierka|prírodná pamiatka|národný park|chránená krajina|biosférická rezervácia|svetové dedičstvo|ekosystém|potravový reťazec|ohrozený druh|recyklácia|obnoviteľná energia|ochrana prírody"],
  ["Príroda a svet", ["zviera", "príroda", "život", "prostredie"], "žubr|los|diviak|kuna|tchor|sysel|vydra|bobor|krtek|ježko|netopier|salamandra|jašterica|užovka|vretenica|ropucha|mlok|pstruh|kapor|sumec|rak riečny|lastovička|bocian|ďateľ|krkavec|sýkorka|čajka|drozd|datel|moriak|srnec|belica|divá kačica|volavka|krahulec|sokol|jastrab|prepelica|bažant|morská hviezdica|morský ježko|morská korytnačka|tuleň|kosatka|plankton|slimák|dážďovka|vážka|sršeň"],

  ["Všeobecné pojmy a situácie", ["emócia", "pocit", "nálada", "človek"], "radosť|smútok|hanba|závisť|žiarlivosť|sklamanie|nadšenie|úľava|napätie|neistota|spokojnosť|osamelosť|vďačnosť|hrdosť|krivda|zúfalstvo|zvedavosť|pokoj|nervozita|rozpaky|nádej|pochybnosť|obdiv|odvaha|trpezlivosť|súcit|nostalgia|prekvapenie|znechutenie|sústredenie"],
  ["Všeobecné pojmy a situácie", ["ľudia", "rozhovor", "vzťah", "situácia"], "pozdrav|podanie ruky|objatie|kompliment|kritika|pochvala|sľub|dohoda|kompromis|prosba|ponuka|pozvanie|odmietnutie|zmierenie|rozlúčka|predstavenie sa|zoznámenie|stretnutie|návšteva|telefonát|správa|rozhovor|diskusia|debata|otázka|odpoveď|rada|varovanie|tajná dohoda|nedôvera"],
  ["Všeobecné pojmy a situácie", ["čas", "život", "zmena", "plán"], "začiatok|koniec|prestávka|termín|harmonogram|priorita|rozhodnutie|voľba|príležitosť|náhoda|zvyk|rutina|spomienka|skúsenosť|poučenie|výzva|cieľ|úspech|neúspech|pokrok|zdržanie|zmena plánu|čakanie|návrat|odchod|návšteva|cesta domov|prvý dojem|druhá šanca|spoločný plán"],
  ["Všeobecné pojmy a situácie", ["práca", "úloha", "povinnosť", "výsledok"], "porada|pracovný pohovor|životopis|výpoveď|povýšenie|plat|odmena|prestávka na obed|služba|smenná práca|dochádzka|pracovný stôl|termín odovzdania|skupinová práca|spolupráca|zodpovednosť|delegovanie|nápad|riešenie problému|spätná väzba|prezentácia|poznámka|zápisnica|objednávka|reklamácia|pokladničný doklad|zľava|rozpočet|úspora|pôžička"],
  ["Všeobecné pojmy a situácie", ["rodina", "domov", "blízki", "každý deň"], "rodič|súrodenec|starý rodič|bratranec|sesternica|sused|spolužiak|kolega|kamarátstvo|partnerstvo|manželstvo|rozchod|zasnúbenie|narodenie dieťaťa|návšteva rodiny|spoločná večera|upratovanie bytu|plánovanie nákupu|stratené kľúče|zabudnutý termín|meškanie autobusu|nečakaný hosť|pokazený spotrebič|prázdna chladnička|víkendový plán|ranné vstávanie|večerný oddych|spoločná fotografia|rodinný album|domáce zviera"],
  ["Všeobecné pojmy a situácie", ["spoločnosť", "pravidlá", "ľudia", "verejnosť"], "spravodlivosť|zodpovednosť|dôvera|rešpekt|slušnosť|zdvorilosť|súkromie|bezpečnosť|sloboda|rovnosť|pomoc|solidarita|dobrovoľníctvo|charita|darovanie|zbierka|verejná doprava|dopravná nehoda|stratený predmet|nález|rad v obchode|platba kartou|hotovosť|doklad totožnosti|volebné právo|mestské pravidlo|susedský spor|hlučná oslava|parkovacie miesto|verejné ospravedlnenie"],
];

const data = JSON.parse(await readFile(outputPath, "utf8"));
const cards = Array.isArray(data.cards) ? data.cards : [];
const categoryCounts = new Map();
const usedWords = new Set();
for (const card of cards) {
  categoryCounts.set(card.category, (categoryCounts.get(card.category) ?? 0) + 1);
  usedWords.add(normalized(card.word));
}

for (const [category, clues, source] of groups) {
  for (const word of words(source)) {
    if ((categoryCounts.get(category) ?? 0) >= targetPerCategory) break;
    const key = normalized(word);
    const forbidden = clues.map((item) => item.trim());
    if (!key || usedWords.has(key) || forbidden.some((item) => normalized(item) === key || normalized(item).includes(key) || key.includes(normalized(item)))) continue;
    cards.push({ id: "", category, word, forbidden });
    usedWords.add(key);
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  }
}

const categories = ["Jedlo a nápoje", "Zvieratá", "Ľudia a povolania", "Predmety a domácnosť", "Miesta a cestovanie", "Aktivity a šport", "Filmy, seriály a kultúra", "Technológie a médiá", "Príroda a svet", "Všeobecné pojmy a situácie"];
for (const category of categories) {
  if ((categoryCounts.get(category) ?? 0) !== targetPerCategory) throw new Error(`${category}: expected ${targetPerCategory}, received ${categoryCounts.get(category) ?? 0}`);
}
cards.forEach((card, index) => { card.id = `taboo_sk_${String(index + 1).padStart(4, "0")}`; });
await writeFile(outputPath, `${JSON.stringify({ version: 1, locale: "sk", cards }, null, 2)}\n`, "utf8");
console.log(`Completed ${cards.length} Slovak taboo cards across ${categories.length} categories.`);
