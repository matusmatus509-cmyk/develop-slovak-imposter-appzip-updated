import { writeFile } from "node:fs/promises";
import path from "node:path";

const questions = {
  animals: [
    "Aké zviera mňauká?", "Aké zviera šteká?", "Aké zviera má chobot?", "Aké zviera má hrivu?", "Aké zviera má pruhy?",
    "Aké zviera má dlhý krk?", "Aké zviera nosí mláďa vo vaku?", "Aké zviera robí med?", "Aké zviera spriada pavučinu?", "Aké zviera stavia hrádze?",
    "Aký vták kikiríka?", "Aké zviera dáva vlnu?", "Aké zviera má pancier?", "Aký vták žije na ľade?", "Aké zviera má dlhé uši?",
    "Aké zviera má rohy?", "Aké zviera má kly?", "Aké zviera má parohy?", "Aké zviera má plutvy?", "Aké zviera pláva v akváriu?",
    "Aké zviera syčí?", "Aké zviera kváka?", "Aké zviera vyje?", "Aké zviera húka?", "Aký hmyz cvrliká?",
    "Aké zviera má chvost a fúzy?", "Aké zviera žije v úli?", "Aké zviera žije v stajni?", "Aké zviera žije v chlieviku?", "Aké zviera žije v kurníku?",
    "Aké zviera má šupiny a plutvy?", "Aký vták nosí listy?", "Aký vták má žltý zobák?", "Aké zviera má plutvu na chrbte?", "Aké zviera má osem nôh?",
    "Aké zviera zbiera orechy?", "Aké zviera loví myši?", "Aké zviera žerie mrkvu?", "Aké zviera sa váľa v bahne?", "Aké zviera ťahá sane?",
    "Aké zviera má čierne škvrny?", "Aké zviera žije v oceáne?", "Aké zviera nosí podkovy?", "Aké zviera má dlhé uši a chvost?", "Aké zviera má bodky na krídlach?",
  ],
  food: [
    "Čím ješ polievku?", "Čo je biele a slané?", "Čo je kyslé a žlté?", "Čo robia včely?", "Čo je sladké a studené?",
    "Čo je okrúhle a talianske?", "Čo sa dáva na chlieb?", "Čo sa dáva do kávy?", "Čo sa pečie v rúre?", "Čo sa smaží na panvici?",
    "Čo si dávaš na raňajky?", "Čo si naleješ do pohára?", "Čo piješ z hrnčeka?", "Čo sa krája nožom?", "Čo sa mieša vareškou?",
    "Čo má žĺtok?", "Čo má škrupinu?", "Čo má jadierka?", "Čo rastie v strapci?", "Čo rastie na strome?",
    "Čo sa šúpe pred jedením?", "Čo sa dáva do šalátu?", "Čo sa dáva na pizzu?", "Čo sa dáva do guláša?", "Čo sa dáva do sendviča?",
    "Čo je v kornútku?", "Čo je v plechovke?", "Čo je vo fľaši?", "Čo je v hrnci?", "Čo je v chladničke?",
    "Čo sa vyrába z mlieka?", "Čo sa vyrába z kakaa?", "Čo sa vyrába z hrozna?", "Čo sa vyrába z múky?", "Čo sa vyrába z ovocia?",
  ],
  household: [
    "Čím odomykáš dvere?", "Kde spíš?", "Čím vysávaš koberec?", "Čím umývaš riad?", "Čím umývaš ruky?",
    "Čím čistíš zuby?", "Čím češeš vlasy?", "Čím striháš papier?", "Čím zatĺkaš klinec?", "Čím uťahuješ skrutku?",
    "Čím zametáš podlahu?", "Čím utieraš stôl?", "Čím sušíš vlasy?", "Čím žehlíš košeľu?", "Čím svieti lampa?",
    "Čím zapínaš televízor?", "Čím otváraš konzervu?", "Čím krájaš chlieb?", "Čím naberáš polievku?", "Čím otáčaš na panvici?",
    "Kde perieš oblečenie?", "Kde chladíš jedlo?", "Kde varíš polievku?", "Kde sa sprchuješ?", "Kde si čistíš zuby?",
    "Kde si vešiaš kabát?", "Kde sedíš pri stole?", "Kde si ukladáš oblečenie?", "Kde máš vankúš?", "Kde nájdeš zrkadlo?",
    "Čo má zámok a kľúč?", "Čo má zásuvky?", "Čo má pokrievku?", "Čo má rukoväť?", "Čo má štyri nohy?",
  ],
  everyday_life: [
    "Čo robíš, keď si smädný?", "Čo robíš, keď si unavený?", "Čo robíš, keď ti je zima?", "Čo robíš, keď prší?", "Čo robíš ráno?",
    "Čo robíš večer?", "Čo robíš pred spaním?", "Čo robíš po jedle?", "Čo robíš na narodeninách?", "Čo robíš na svadbe?",
    "Čo robíš v obchode?", "Čo robíš v banke?", "Čo robíš na pošte?", "Čo robíš v kine?", "Čo robíš v knižnici?",
    "Čo robíš v reštaurácii?", "Čo robíš na zastávke?", "Čo robíš pri pokladni?", "Čo robíš pri semafore?", "Čo robíš pri dverách?",
    "Čo povieš pri pozdrave?", "Čo povieš pri odchode?", "Čo povieš pri poďakovaní?", "Čo povieš pri chybe?", "Čo povieš pri narodeninách?",
    "Čo si berieš na nákup?", "Čo si berieš na výlet?", "Čo si berieš do školy?", "Čo si berieš do práce?", "Čo si berieš na kúpalisko?",
    "Kto nosí listy?", "Kto hasí oheň?", "Kto lieči chorých?", "Kto učí v škole?", "Kto pečie chlieb?",
  ],
  nature: [
    "Čo svieti cez deň?", "Čo vidíš v noci?", "Čo padá pri daždi?", "Čo padá v zime?", "Čo rastie v lese?",
    "Čo rastie na lúke?", "Čo rastie v záhrade?", "Čo tečie v rieke?", "Čo šumí v lese?", "Čo fúka počas vetra?",
    "Čo býva nad oblakmi?", "Čo býva pod zemou?", "Čo býva pri mori?", "Čo býva na vrchu?", "Čo býva v jaskyni?",
    "Kde rastú huby?", "Kde rastú stromy?", "Kde plávajú ryby?", "Kde hniezdia vtáky?", "Kde kvitnú kvety?",
    "Čo pokrýva zem v zime?", "Čo pláva nad hlavou?", "Čo hreje cez deň?", "Čo svieti v noci?", "Čo sa topí v teple?",
    "Čo sa topí na slnku?", "Čo vznikne z ľadu?", "Čo vznikne z dažďa?", "Čo vznikne po búrke?", "Čo robí sopka?",
    "Čo robí vietor?", "Čo robí rieka?", "Čo robí slnko?", "Čo robí mesiac?", "Čo robí blesk?",
  ],
  body: [
    "Čím vidíš?", "Čím počúvaš?", "Čím voniaš?", "Čím ochutnávaš?", "Čím dýchaš?",
    "Čím chodíš?", "Čím chytáš?", "Čím hryzieš?", "Čím žmurkáš?", "Čím žuješ?",
    "Koľko očí máš?", "Koľko uší máš?", "Koľko nosov máš?", "Koľko rúk máš?", "Koľko nôh máš?",
    "Koľko prstov má ruka?", "Kde máš koleno?", "Kde máš lakeť?", "Kde máš členok?", "Kde máš bradu?",
    "Kde máš obočie?", "Kde máš zápästie?", "Kde máš rameno?", "Kde máš päty?", "Kde máš jazyk?",
    "Čo ti bije v hrudi?", "Čo rastie na hlave?", "Čo chráni tvoje zuby?", "Čo máš medzi nosom a bradou?", "Čo si umývaš po jedle?",
  ],
  calendar: [
    "Ktorý deň je po pondelku?", "Ktorý deň je po utorku?", "Ktorý deň je po strede?", "Ktorý deň je po štvrtku?", "Ktorý deň je po piatku?",
    "Ktorý deň je pred pondelkom?", "Ktorý deň je pred nedeľou?", "Ktorý deň je víkend?", "Ktorý mesiac má Vianoce?", "Ktorý mesiac má Valentína?",
    "Ktorý mesiac má Veľkú noc?", "Ktorý mesiac začína rok?", "Ktorý mesiac končí rok?", "Ktoré obdobie má sneh?", "Ktoré obdobie má kúpanie?",
    "Ktoré obdobie má padajúce listy?", "Ktoré obdobie má kvety?", "Koľko dní má týždeň?", "Koľko mesiacov má rok?", "Koľko hodín má deň?",
    "Koľko minút má hodina?", "Koľko sekúnd má minúta?", "Kedy býva polnoc?", "Kedy býva obed?", "Kedy býva ráno?",
    "Kedy býva večer?", "Čo ukazujú hodiny?", "Čo ukazuje kalendár?", "Čo príde po zime?", "Čo príde po lete?",
  ],
  transport: [
    "Kde jazdia autá?", "Kde jazdia vlaky?", "Kde lietajú lietadlá?", "Kde plávajú lode?", "Kde zastavuje autobus?",
    "Čo má pedále?", "Čo má koľaje?", "Čo má krídla a motor?", "Čo má volant?", "Čo má dve kolesá?",
    "Čo má štyri kolesá?", "Čo má vodiča?", "Čo má pilota?", "Čo má kapitána?", "Čo má cestujúcich?",
    "Čím sa ide do práce?", "Čím sa ide na dovolenku?", "Čím sa ide cez more?", "Čím sa ide pod zemou?", "Čím sa ide po koľajniciach?",
    "Čím sa jazdí po meste?", "Čím sa odváža batožina?", "Čím sa tankuje auto?", "Čím sa brzdí auto?", "Čím sa zapína motor?",
    "Kde čakáš na vlak?", "Kde čakáš na lietadlo?", "Kde parkuje auto?", "Kde pristáva lietadlo?", "Kde kotví loď?",
  ],
  objects: [
    "Čím píšeš?", "Čím meriaš čas?", "Čím meriaš teplotu?", "Čím meriaš dĺžku?", "Čím vážiš veci?",
    "Čím fotíš?", "Čím telefonuješ?", "Čím počúvaš hudbu?", "Čím sleduješ film?", "Čím kreslíš?",
    "Čím maľuješ?", "Čím gumuješ?", "Čím lepíš papier?", "Čím fúkaš balón?", "Čím otváraš fľašu?",
    "Čím si chrániš hlavu?", "Čím si chrániš oči?", "Čím sa chrániš pred dažďom?", "Čím sa chrániš pred slnkom?", "Čím sa chrániš pred zimou?",
    "Čo má ciferník?", "Čo má objektív?", "Čo má struny?", "Čo má klávesy?", "Čo má štetiny?",
    "Čo má čepeľ?", "Čo má zip?", "Čo má šnúrky?", "Čo má kolieska?", "Čo má tlačidlá?",
    "Čo má displej?", "Čo má mikrofón?", "Čo má batériu?", "Čo má obrazovku?", "Čo má obálku?",
  ],
  school: [
    "Kde sa učíš?", "Kto učí v triede?", "Kto sedí v lavici?", "Čím píšeš na tabuľu?", "Čím píšeš do zošita?",
    "Kam si píšeš poznámky?", "Čím nosíš knihy?", "Kde čítaš knihy?", "Čo má písmená?", "Čo má čísla?",
    "Čo kreslí kruh?", "Čo meria centimetre?", "Čo počíta príklady?", "Čo ukazuje krajiny?", "Čo ukazuje Zem?",
    "Kedy máš prestávku?", "Kedy máš prázdniny?", "Čo dostaneš za odpoveď?", "Čo nosí školák?", "Čo leží na lavici?",
    "Čo zvoní na hodinu?", "Čo otvára učiteľ?", "Čo má školský rok?", "Čo znamená jednotka?", "Čo znamená päťka?",
  ],
  technology: [
    "Čím voláš kamarátovi?", "Čím píšeš e-mail?", "Čím hľadáš na internete?", "Čím sa pripájaš na wifi?", "Čím nabíjaš mobil?",
    "Čím ovládaš televízor?", "Čím hráš videohru?", "Čím tlačíš dokument?", "Čím skenuješ kód?", "Čím platíš bez hotovosti?",
    "Čo má heslo?", "Čo má aplikácie?", "Čo má klávesnicu?", "Čo má myš?", "Čo má nabíjačku?",
    "Čo má fotoaparát?", "Čo má reproduktor?", "Čo má slúchadlá?", "Čo má internet?", "Čo má kameru?",
    "Kde pozeráš videá?", "Kde posielaš správu?", "Kde hľadáš adresu?", "Kde ukladáš fotky?", "Kde si pustíš hudbu?",
  ],
  sports: [
    "Čím kopeš do lopty?", "Čím chytáš loptu?", "Čím hádžeš loptu?", "Čím hráš tenis?", "Čím hráš hokej?",
    "Čím hráš golf?", "Čím korčuľuješ?", "Čím lyžuješ?", "Čím plávaš?", "Čím boxuješ?",
    "Kde hráš futbal?", "Kde hráš tenis?", "Kde hráš hokej?", "Kde plávaš?", "Kde beháš?",
    "Čo strieľaš do bránky?", "Čo triafaš raketou?", "Čo hádžeš do koša?", "Čo nosí rozhodca?", "Čo drží hokejista?",
    "Koľko hráčov má tím?", "Kto píska zápas?", "Kto dáva medailu?", "Kto vyhrá preteky?", "Čo znamená gól?",
  ],
  weather: [
    "Čo padá z oblohy?", "Čo fúka medzi stromami?", "Čo sa objaví po daždi?", "Čo zahrmí počas búrky?", "Čo zabliká počas búrky?",
    "Čo zakryje oblohu?", "Čo topí sneh?", "Čo schová slnko?", "Čo nosíš pri daždi?", "Čo nosíš pri snehu?",
    "Aké býva leto?", "Aká býva zima?", "Aká býva jar?", "Aká býva jeseň?", "Kedy sa stavia snehuliak?",
    "Kedy lieta šarkan?", "Kedy sa opaľuješ?", "Kedy si berieš dáždnik?", "Kedy sa tvorí poľadovica?", "Kedy sa ukáže dúha?",
  ],
  clothing: [
    "Čo si obúvaš na nohy?", "Čo si dávaš na hlavu?", "Čo si dávaš na ruky?", "Čo si dávaš na krk?", "Čo si dávaš v zime?",
    "Čo si dávaš v lete?", "Čo si dávaš do dažďa?", "Čo si dávaš na pláž?", "Čo si dávaš do postele?", "Čo si dávaš na svadbu?",
    "Čo nosíš na očiach?", "Čo nosíš na zápästí?", "Čo nosíš na prste?", "Čo nosíš na ušiach?", "Čo nosíš cez plece?",
    "Čo má rukávy?", "Čo má vrecká?", "Čo má gombíky?", "Čo má kapucňu?", "Čo má opasok?",
    "Čo má podpätok?", "Čo má podrážku?", "Čo má golier?", "Čo má zips?", "Čo má šál?",
  ],
  colors: [
    "Akú farbu má sneh?", "Akú farbu má tráva?", "Akú farbu má obloha?", "Akú farbu má slnko?", "Akú farbu má uhlie?",
    "Akú farbu má paradajka?", "Akú farbu má banán?", "Akú farbu má pomaranč?", "Akú farbu má citrón?", "Akú farbu má jahoda?",
    "Akú farbu má čučoriedka?", "Akú farbu má mrkva?", "Akú farbu má čokoláda?", "Akú farbu má mlieko?", "Akú farbu má noc?",
    "Akú farbu má list na jeseň?", "Akú farbu má lev?", "Akú farbu má prasa?", "Akú farbu má zebra?", "Akú farbu má futbalová lopta?",
  ],
  numbers: [
    "Koľko nôh má pes?", "Koľko nôh má mačka?", "Koľko nôh má pavúk?", "Koľko nôh má vták?", "Koľko nôh má chobotnica?",
    "Koľko krídel má vták?", "Koľko očí má človek?", "Koľko uší má človek?", "Koľko rúk má človek?", "Koľko nôh má človek?",
    "Koľko prstov má noha?", "Koľko prstov majú ruky?", "Koľko farieb má dúha?", "Koľko rohov má hviezda?", "Koľko strán má trojuholník?",
    "Koľko rohov má kocka?", "Koľko dní má február?", "Koľko kolies má bicykel?", "Koľko kolies má auto?", "Koľko strán má kocka?",
    "Koľko rohov má trojuholník?", "Koľko rohov má štvorec?", "Koľko dní má víkend?", "Koľko písmen má abeceda?", "Koľko farieb má semafor?",
    "Koľko hráčov má dvojica?", "Koľko strán má kniha?", "Koľko bránok má futbal?", "Koľko nôh má stolička?", "Koľko dní má apríl?",
  ],
  geography: [
    "V ktorej krajine žije panda?", "V ktorej krajine sú pyramídy?", "V ktorej krajine je pizza?", "V ktorej krajine je Eiffelovka?", "V ktorej krajine je Big Ben?",
    "V ktorom meste je Eiffelovka?", "V ktorom meste je Koloseum?", "V ktorom meste je Big Ben?", "Na ktorom kontinente je Afrika?", "Na ktorom kontinente je Európa?",
    "Na ktorom kontinente je Austrália?", "Kde je Sahara?", "Kde je Amazónka?", "Kde je Mount Everest?", "Kde je more?",
    "Kde je Severný pól?", "Kde je Južný pól?", "Kde je Bratislava?", "Kde je Vysoké Tatry?", "Kde je Dunaj?",
  ],
};

const cards = Object.entries(questions).flatMap(([category, entries]) => entries.map((question) => ({ category, question })))
  .map(({ category, question }, index) => ({
    id: `ol_${String(index + 1).padStart(4, "0")}`,
    category,
    translations: { sk: question },
  }));

if (cards.length !== 500) throw new Error(`Očakáva sa 500 otázok, vytvorených bolo ${cards.length}.`);
await writeFile(path.resolve("client/src/data/onlyLies.json"), `${JSON.stringify(cards, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ cards: cards.length, categories: Object.fromEntries(Object.entries(questions).map(([key, value]) => [key, value.length])) }, null, 2));
