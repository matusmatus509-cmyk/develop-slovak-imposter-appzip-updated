type NeverForm = (value: string) => string;

interface NeverFamily {
  values: readonly string[];
  forms: readonly NeverForm[];
}

const family = (values: readonly string[], forms: readonly NeverForm[]): NeverFamily => ({ values, forms });

// Every family contains ten concrete everyday subjects and ten statements that
// naturally fit every subject in that family. This deliberately avoids generic
// topic × action combinations such as "pri téme ...".
const FAMILIES: readonly NeverFamily[] = [
  family(
    ["pizzu", "hamburger", "sushi", "cestoviny", "palacinky", "polievku", "šalát", "tortu", "zmrzlinu", "sendvič"],
    [
      (v) => `neochutnal/a ${v}`,
      (v) => `neobjednal/a ${v} v reštaurácii`,
      (v) => `nevybral/a ${v} podľa fotografie v jedálnom lístku`,
      (v) => `neponúkol/a ${v} niekomu pri stole`,
      (v) => `neodložil/a ${v} na neskôr`,
      (v) => `neporovnával/a ${v} s domácou verziou`,
      (v) => `nefotografoval/a ${v} pred jedlom`,
      (v) => `nepochválil/a ${v} po ochutnaní`,
      (v) => `nekúpil/a ${v} iba zo zvedavosti`,
      (v) => `nechcel/a ${v} ochutnať ešte raz`,
    ],
  ),
  family(
    ["kávu", "čaj", "kakao", "limonádu", "minerálku", "džús", "smoothie", "horúcu čokoládu", "ľadový čaj", "mliečny koktail"],
    [
      (v) => `neochutnal/a ${v}`,
      (v) => `neobjednal/a ${v} v kaviarni`,
      (v) => `nepripravil/a ${v} pre návštevu`,
      (v) => `neponúkol/a ${v} kamarátovi alebo kamarátke`,
      (v) => `nevybral/a ${v} podľa názvu`,
      (v) => `nepoložil/a ${v} na pracovný stôl`,
      (v) => `neodfotil/a ${v} pred prvým dúškom`,
      (v) => `nepochválil/a ${v} po ochutnaní`,
      (v) => `nekúpil/a ${v} cestou domov`,
      (v) => `nepýtal/a sa niekoho na odporúčanie pre ${v}`,
    ],
  ),
  family(
    ["kľúče", "peňaženku", "telefón", "slúchadlá", "okuliare", "nabíjačku", "ruksak", "dáždnik", "hodinky", "fľašu s vodou"],
    [
      (v) => `nezabudol/a ${v} doma`,
      (v) => `nehľadal/a ${v} po celom byte`,
      (v) => `nestratil/a ${v} na výlete`,
      (v) => `neodložil/a ${v} na nezvyčajné miesto`,
      (v) => `nenechal/a ${v} v aute`,
      (v) => `nepožičal/a ${v} kamarátovi alebo kamarátke`,
      (v) => `nebalil/a ${v} na poslednú chvíľu`,
      (v) => `neprenášal/a ${v} v preplnenej taške`,
      (v) => `nepýtal/a sa celej rodiny na ${v}`,
      (v) => `nešiel/nešla domov po ${v}`,
    ],
  ),
  family(
    ["tenisky", "džínsy", "ponožky", "rukavice", "čižmy", "kraťasy", "športové súpravy", "športové tričká", "slnečné okuliare", "zimné bundy"],
    [
      (v) => `nekúpil/a ${v} len preto, že boli v zľave`,
      (v) => `nevybral/a ${v} na poslednú chvíľu`,
      (v) => `nenosil/a ${v} na nesprávnu príležitosť`,
      (v) => `nepožičal/a ${v} kamarátovi alebo kamarátke`,
      (v) => `nezabudol/a ${v} v šatni`,
      (v) => `nebalil/a ${v} na dovolenku`,
      (v) => `nehľadal/a ${v} ráno pred odchodom`,
      (v) => `nevyčistil/a ${v} tesne pred použitím`,
      (v) => `neporovnával/a ${v} s iným typom oblečenia`,
      (v) => `neodložil/a ${v} do nesprávnej skrine`,
    ],
  ),
  family(
    ["domácu úlohu", "prezentáciu", "skupinový projekt", "referát", "pracovný list", "seminárnu prácu", "poster", "model", "plán projektu", "výkres"],
    [
      (v) => `neodložil/a ${v} na poslednú chvíľu`,
      (v) => `nezačal/a ${v} bez prípravy`,
      (v) => `nepokazil/a ${v} nepozornosťou`,
      (v) => `nekontroloval/a ${v} pred odovzdaním`,
      (v) => `nezabudol/a na ${v}`,
      (v) => `neukázal/a ${v} učiteľovi alebo učiteľke`,
      (v) => `nepýtal/a sa učiteľa alebo učiteľky na ${v}`,
      (v) => `nepripravil/a ${v} vopred`,
      (v) => `neodovzdal/a ${v} v nesprávny deň`,
      (v) => `neporovnával/a ${v} so zadaním`,
    ],
  ),
  family(
    ["prílohu", "zápis z porady", "tabuľku", "správu pre tím", "návrh", "objednávku", "rozpočet", "plán", "záznam", "pracovný dokument"],
    [
      (v) => `nepripravil/a ${v} na poslednú chvíľu`,
      (v) => `neposlal/a ${v} nesprávnej osobe`,
      (v) => `neprečítal/a ${v} dvakrát pred odoslaním`,
      (v) => `neodložil/a ${v} na ďalší deň`,
      (v) => `neukázal/a ${v} kolegovi alebo kolegyni`,
      (v) => `nepomenoval/a ${v} nejasne`,
      (v) => `neopravoval/a ${v} tesne pred termínom`,
      (v) => `nezabudol/a priložiť ${v}`,
      (v) => `neuložil/a ${v} na nesprávne miesto`,
      (v) => `neukázal/a ${v} na konzultácii`,
    ],
  ),
  family(
    ["správu", "fotografiu", "video", "hlasovú správu", "pozvánku", "odkaz", "meme", "emoji", "e-mail", "komentár"],
    [
      (v) => `neposlal/a ${v} nesprávnemu človeku`,
      (v) => `nevymazal/a ${v} omylom`,
      (v) => `neukázal/a ${v} kamarátovi alebo kamarátke`,
      (v) => `neodoslal/a ${v} príliš narýchlo`,
      (v) => `neodložil/a ${v} na neskôr`,
      (v) => `nečakal/a na odpoveď na ${v} celý večer`,
      (v) => `neposlal/a ${v} bez krátkeho vysvetlenia`,
      (v) => `nepozrel/a si ${v} ešte raz pred odoslaním`,
      (v) => `nechcel/a ${v} zdieľať s ostatnými`,
      (v) => `nepridal/a ${v} do skupinového četu`,
    ],
  ),
  family(
    ["šach", "človeče, nehnevaj sa", "karty", "pexeso", "domino", "dámu", "mlyn", "scrabble", "piškvorky", "kvíz"],
    [
      (v) => `nehral/a ${v} až do noci`,
      (v) => `nevybral/a ${v} na rodinný večer`,
      (v) => `neprehral/a ${v} na poslednú chvíľu`,
      (v) => `nevyhral/a ${v} úplnou náhodou`,
      (v) => `nevysvetľoval/a pravidlá pre ${v} ostatným`,
      (v) => `nepozval/a niekoho na ${v}`,
      (v) => `neodložil/a ${v} uprostred hry`,
      (v) => `nepýtal/a sa na pravidlá pre ${v}`,
      (v) => `nepripravil/a ${v} pred začiatkom hry`,
      (v) => `neporovnával/a ${v} s inou hrou`,
    ],
  ),
  family(
    ["futbal", "plávanie", "beh", "cyklistiku", "tenis", "volejbal", "jogu", "turistiku", "korčuľovanie", "basketbal"],
    [
      (v) => `neskúsil/a ${v} prvýkrát s kamarátom alebo kamarátkou`,
      (v) => `neplánoval/a ${v} na víkend`,
      (v) => `nepozeral/a ${v} v televízii`,
      (v) => `nevybral/a ${v} ako spôsob oddychu`,
      (v) => `nevybral/a ${v} ako svoj obľúbený šport`,
      (v) => `nezačal/a trénovať ${v}`,
      (v) => `neodložil/a ${v} na ďalší týždeň`,
      (v) => `nefotografoval/a ${v} počas výletu`,
      (v) => `neporovnával/a ${v} s iným športom`,
      (v) => `nepridal/a ${v} do svojho týždenného plánu`,
    ],
  ),
  family(
    ["vlak", "autobus", "lietadlo", "električku", "metro", "trajekt", "lanovku", "nočný spoj", "diaľkový autobus", "prímestský vlak"],
    [
      (v) => `nezmeškal/a ${v}`,
      (v) => `nečakal/a na ${v} v daždi`,
      (v) => `neporovnával/a ${v} s iným spojom`,
      (v) => `nehľadal/a ${v} na poslednú chvíľu`,
      (v) => `nepýtal/a sa na ${v} cudzieho človeka`,
      (v) => `nefotografoval/a ${v} počas cesty`,
      (v) => `nevybral/a ${v} bez porovnania možností`,
      (v) => `nekúpil/a lístok na ${v} vopred`,
      (v) => `nemal/a kúpený lístok na ${v}`,
      (v) => `neodporučil/a ${v} niekomu na cestu`,
    ],
  ),
  family(
    ["výlet do hôr", "víkend pri jazere", "návštevu hlavného mesta", "cestu k moru", "výlet na hrad", "prechádzku v lese", "návštevu múzea", "výlet do zoo", "piknik v parku", "stanovanie pri rieke"],
    [
      (v) => `neplánoval/a ${v} s kamarátmi`,
      (v) => `nezabalil/a sa na ${v} vopred`,
      (v) => `neplánoval/a dokumentovať ${v}`,
      (v) => `nevybral/a ${v} ako víkendový program`,
      (v) => `neodložil/a ${v} kvôli počasiu`,
      (v) => `neodporučil/a ${v} niekomu ďalšiemu`,
      (v) => `nepripravil/a ${v} podľa mapy`,
      (v) => `neoznámil/a rodine ${v}`,
      (v) => `neopísal/a ${v} ako dobrý zážitok`,
      (v) => `neporovnával/a ${v} s minulou dovolenkou`,
    ],
  ),
  family(
    ["narodeninovú oslavu", "svadbu", "koncert", "festival", "rodinný obed", "filmový večer", "školský výlet", "firemné stretnutie", "večeru s priateľmi", "silvestrovskú párty"],
    [
      (v) => `neprišiel/neprišla na ${v} neskoro`,
      (v) => `neostal/a na ${v} dlhšie než ostatní`,
      (v) => `nefotografoval/a ${v}`,
      (v) => `nepomáhal/a pripravovať ${v}`,
      (v) => `nepovedal/a na ${v} niečo trápne`,
      (v) => `nepozval/a niekoho na ${v}`,
      (v) => `nevybral/a oblečenie na ${v} na poslednú chvíľu`,
      (v) => `nefotografoval/a ostatných na ${v}`,
      (v) => `neplánoval/a ${v} s ďalšími ľuďmi`,
      (v) => `neprežil/a ${v} naplno`,
    ],
  ),
  family(
    ["kamaráta|kamarátovi", "kamarátku|kamarátke", "súrodenca|súrodencovi", "bratranca|bratrancovi", "rodiča|rodičovi", "spolužiaka|spolužiakovi", "spolužiačku|spolužiačke", "kolegu|kolegovi", "kolegyňu|kolegyni", "suseda|susedovi"],
    [
      (v) => { const [acc, dat] = v.split("|"); return `neposlal/a ${dat} správu`; },
      (v) => { const [acc, dat] = v.split("|"); return `nepovedal/a ${dat}, že mám niečo dôležité`; },
      (v) => { const [acc] = v.split("|"); return `nevolal/a ${acc} nesprávnym menom`; },
      (v) => { const [acc] = v.split("|"); return `nepoprosil/a ${acc} o pomoc`; },
      (v) => { const [acc] = v.split("|"); return `nevybral/a ${acc} na spoločnú cestu`; },
      (v) => { const [acc] = v.split("|"); return `nepozval/a ${acc} na spoločný výlet`; },
      (v) => { const [acc] = v.split("|"); return `nevidel/a ${acc} v ťažkej chvíli`; },
      (v) => { const [acc] = v.split("|"); return `neocenil/a ${acc} za pomoc`; },
      (v) => { const [acc] = v.split("|"); return `neprekvapil/a ${acc} malým darčekom`; },
      (v) => { const [acc] = v.split("|"); return `nevolal/a ${acc} v nevhodnom čase`; },
    ],
  ),
  family(
    ["umývanie riadu", "utieranie prachu", "skladanie bielizne", "vynášanie odpadkov", "ustielanie postele", "umývanie podlahy", "upratovanie stola", "umývanie okien", "utieranie políc", "čistenie kúpeľne"],
    [
      (v) => `neodložil/a ${v} na neskôr`,
      (v) => `nezačal/a ${v} bez plánu`,
      (v) => `neurobil/a ${v} s niekým ďalším`,
      (v) => `neurobil/a ${v} pred návštevou`,
      (v) => `neplánoval/a ${v} cez víkend`,
      (v) => `nepripravil/a pomôcky na ${v}`,
      (v) => `nepovedal/a niekomu, že dokončím ${v}`,
      (v) => `nepovedal/a nikomu, že som dokončil/a ${v}`,
      (v) => `nepovažoval/a ${v} za dokončené`,
      (v) => `nepovedal/a, že ${v} je hotové`,
    ],
  ),
  family(
    ["raňajky", "obed", "večeru", "koláč", "polievku", "šalát", "palacinky", "cestoviny", "sendvič", "domácu pizzu"],
    [
      (v) => `nepripravil/a ${v} bez receptu`,
      (v) => `nepripravil/a ${v} pre návštevu`,
      (v) => `nepridal/a príliš veľa soli do ${v}`,
      (v) => `neochutnal/a ${v} počas prípravy`,
      (v) => `neplánoval/a ${v} deň vopred`,
      (v) => `nefotografoval/a ${v} po dokončení`,
      (v) => `nepodával/a ${v} hosťom`,
      (v) => `nevybral/a suroviny na ${v} vopred`,
      (v) => `neponúkol/a ${v} celej rodine`,
      (v) => `neodložil/a ${v} do chladničky`,
    ],
  ),
  family(
    ["psa", "mačku", "králika", "morča", "papagája", "škrečka", "rybičky", "korytnačku", "ježka", "koňa"],
    [
      (v) => `nefotografoval/a ${v} vonku`,
      (v) => `nepomáhal/a kŕmiť ${v}`,
      (v) => `nepýtal/a sa majiteľa alebo majiteľky na ${v}`,
      (v) => `nepozoroval/a ${v} potichu`,
      (v) => `nefotografoval/a ${v} zblízka`,
      (v) => `neponúkol/a ${v} niekomu na stráženie`,
      (v) => `nepripravil/a miesto pre ${v}`,
      (v) => `nepozoroval/a ${v} v prírode`,
      (v) => `nepozoroval/a ${v} dlhší čas`,
      (v) => `neopísal/a ${v} niekomu ďalšiemu`,
    ],
  ),
  family(
    ["kresliť", "fotografovať", "čítať", "spievať", "tancovať", "piecť", "pestovať rastliny", "skladať puzzle", "čítať poéziu", "hrať na gitare"],
    [
      (v) => `neskúsil/a ${v} len zo zvedavosti`,
      (v) => `nezačal/a ${v} bez návodu`,
      (v) => `neplánoval/a ${v} cez víkend`,
      (v) => `nepokračoval/a v učení sa ${v} po prvom neúspechu`,
      (v) => `nepovedal/a, že ma baví ${v}`,
      (v) => `neuvažoval/a o tom, že by som mohol/mohla ${v}`,
      (v) => `nepozeral/a videá o tom, ako ${v}`,
      (v) => `nepýtal/a sa niekoho, ako ${v}`,
      (v) => `nepovedal/a nikomu, že chcem ${v}`,
      (v) => `neplánoval/a sa naučiť ${v}`,
    ],
  ),
  family(
    ["keď pršalo", "keď snežilo", "keď silno fúkalo", "keď bolo veľmi horúco", "keď mrzlo", "keď bola búrka", "keď bola hustá hmla", "keď boli veľké kaluže", "keď bol na ceste ľad", "keď svietilo jasné slnko"],
    [
      (v) => `nevyšiel/nevyšla von, ${v}`,
      (v) => `nefotografoval/a krajinu, ${v}`,
      (v) => `neplánoval/a výlet, ${v}`,
      (v) => `nezabudol/a na vhodné oblečenie, ${v}`,
      (v) => `nečakal/a na autobus, ${v}`,
      (v) => `neodložil/a prechádzku, ${v}`,
      (v) => `nevybral/a dlhšiu trasu, ${v}`,
      (v) => `nepozoroval/a počasie z okna, ${v}`,
      (v) => `neostal/a doma celý deň, ${v}`,
      (v) => `neprispôsobil/a svoj plán, ${v}`,
    ],
  ),
  family(
    ["v parku", "v kaviarni", "v knižnici", "v kine", "v múzeu", "v obchode", "na zastávke", "na ihrisku", "na trhu", "v reštaurácii"],
    [
      (v) => `nečakal/a ${v} na kamaráta alebo kamarátku`,
      (v) => `nefotografoval/a ${v}`,
      (v) => `nepýtal/a sa ${v} na cestu`,
      (v) => `nebol/a ${v} bez plánu`,
      (v) => `nešiel/nešla ${v} sám/sama`,
      (v) => `nehľadal/a ${v} voľné miesto`,
      (v) => `nepozoroval/a ľudí ${v}`,
      (v) => `nečakal/a ${v} na dôležitú správu`,
      (v) => `nepovedal/a niekomu, že sa stretneme ${v}`,
      (v) => `neplánoval/a stretnutie ${v}`,
    ],
  ),
  family(
    ["komédiu", "dobrodružný film", "dokument", "animovaný film", "detektívku", "fantastický film", "seriál", "muzikál", "romantický film", "historický film"],
    [
      (v) => `nepozeral/a ${v} s kamarátmi`,
      (v) => `nevybral/a ${v} na filmový večer`,
      (v) => `neodporučil/a ${v} niekomu ďalšiemu`,
      (v) => `nepozrel/a ${v} až do konca`,
      (v) => `neporovnával/a ${v} s knihou`,
      (v) => `neoznačil/a ${v} za obľúbený titul`,
      (v) => `nečakal/a na ${v} celý týždeň`,
      (v) => `nevybral/a ${v} podľa upútavky`,
      (v) => `nefotografoval/a ${v} na obrazovke`,
      (v) => `nepísal/a recenziu na ${v} pre kamaráta alebo kamarátku`,
    ],
  ),
];

const cards = FAMILIES.flatMap(({ values, forms }) => values.flatMap((value) => forms.map((form) => `Nikdy som nikdy ${form(value)}.`)));
const uniqueCards = [...new Set(cards)];

const invalidFamilyIndex = FAMILIES.findIndex(({ values, forms }) => values.length !== 10 || forms.length !== 10);
if (FAMILIES.length !== 20 || invalidFamilyIndex >= 0) {
  const invalidFamily = FAMILIES[invalidFamilyIndex];
  throw new Error(`Never Have I Ever catalogue must consist of 20 coherent 10 × 10 families; got ${FAMILIES.length} families and family ${invalidFamilyIndex + 1} has ${invalidFamily?.values.length ?? 0} values and ${invalidFamily?.forms.length ?? 0} forms.`);
}
if (uniqueCards.length !== 2000) {
  throw new Error(`Never Have I Ever catalogue must contain exactly 2,000 unique cards, got ${uniqueCards.length}.`);
}

export const NEVER_HAVE_I_EVER: string[] = uniqueCards;
