import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(".");
const dataPath = path.join(root, "client/src/data/tabooCardsSk.json");
const reportPath = path.join(root, "taboo-sk-content-qa-fixes.json");

const replacements = {
  taboo_sk_0096: { word: "morča", forbidden: ["klietka", "mrkva", "malé", "domáce"] },
  taboo_sk_0555: { word: "mačiatko", forbidden: ["mačka", "mláďa", "mňau", "labky"] },
  taboo_sk_0556: { word: "šteniatko", forbidden: ["pes", "mláďa", "štekať", "labky"] },
  taboo_sk_0557: { word: "papagáj", forbidden: ["vták", "perie", "klietka", "hovoriť"] },
  taboo_sk_0558: { word: "chvost", forbidden: ["zviera", "srsť", "mávať", "telo"] },
  taboo_sk_0559: { word: "stopy", forbidden: ["labky", "zem", "les", "sledovať"] },
  taboo_sk_0591: { word: "lemur", forbidden: ["Madagaskar", "chvost", "strom", "primát"] },
  taboo_sk_0601: { word: "maskovanie", forbidden: ["skryť", "farba", "zviera", "okolie"] },
  taboo_sk_0602: { word: "hmyz", forbidden: ["krídla", "malý", "príroda", "nohy"] },
  taboo_sk_0832: { word: "surikata", forbidden: ["púšť", "nora", "Afrika", "stáť"] },
  taboo_sk_1329: { word: "šakal", forbidden: ["Afrika", "svorka", "púšť", "psovitý"] },
  taboo_sk_1349: { word: "svetluška", forbidden: ["svietiť", "noc", "hmyz", "zelená"] },

  taboo_sk_0254: { word: "dedina", forbidden: ["domy", "vidiek", "ulica", "obyvatelia"] },
  taboo_sk_0289: { word: "veža", forbidden: ["výška", "schody", "stavba", "výhľad"] },
  taboo_sk_0838: { word: "taxikár", forbidden: ["auto", "odvoz", "vodič", "žltý"] },
  taboo_sk_0842: { word: "prestup", forbidden: ["vlak", "autobus", "zmeniť", "stanica"] },
  taboo_sk_0852: { word: "zápcha", forbidden: ["autá", "premávka", "meškať", "cesta"] },
  taboo_sk_0857: { word: "kemp", forbidden: ["stan", "nocľah", "príroda", "oheň"] },
  taboo_sk_0859: { word: "tábor", forbidden: ["stan", "leto", "deti", "oheň"] },
  taboo_sk_0860: { word: "nocľah", forbidden: ["hotel", "posteľ", "prespať", "večer"] },
  taboo_sk_0863: { word: "kuchynka", forbidden: ["varenie", "riad", "izba", "jedlo"] },
  taboo_sk_0864: { word: "jedáleň", forbidden: ["obed", "stôl", "podnos", "jedlo"] },
  taboo_sk_0865: { word: "výťah", forbidden: ["poschodie", "dvere", "tlačidlo", "stúpať"] },
  taboo_sk_0866: { word: "brána", forbidden: ["vchod", "plot", "dvere", "vstup"] },
  taboo_sk_0868: { word: "úschovňa", forbidden: ["batožina", "skrinka", "kľúč", "nechať"] },
  taboo_sk_0869: { word: "suvenír", forbidden: ["darček", "turista", "pamiatka", "obchod"] },
  taboo_sk_0870: { word: "požičovňa", forbidden: ["bicykel", "prenajať", "vrátiť", "peniaze"] },
  taboo_sk_0871: { word: "karavan", forbidden: ["auto", "kemp", "príves", "nocľah"] },
  taboo_sk_0873: { word: "internát", forbidden: ["študent", "škola", "izba", "posteľ"] },
  taboo_sk_0874: { word: "nástup", forbidden: ["lietadlo", "brána", "cestujúci", "odlet"] },
  taboo_sk_0879: { word: "visačka", forbidden: ["batožina", "letisko", "kufor", "meno"] },
  taboo_sk_0886: { word: "klub", forbidden: ["členovia", "stretnutie", "ľudia", "voľno"] },

  taboo_sk_0662: { word: "naháňačka", forbidden: ["behať", "deti", "chytiť", "hra"] },
  taboo_sk_0665: { word: "švihadlo", forbidden: ["lano", "skok", "ruky", "cvičenie"] },
  taboo_sk_0677: { word: "rozcvička", forbidden: ["cvičenie", "telo", "pred", "šport"] },
  taboo_sk_0783: { word: "schovávačka", forbidden: ["skrýša", "hľadať", "deti", "hra"] },
  taboo_sk_0784: { word: "preteky", forbidden: ["súťaž", "rýchlosť", "cieľ", "víťaz"] },
  taboo_sk_0785: { word: "trampolína", forbidden: ["skok", "pružiny", "hore", "deti"] },
  taboo_sk_0798: { word: "kolotoč", forbidden: ["púť", "točiť", "jazda", "deti"] },
  taboo_sk_0800: { word: "lampión", forbidden: ["papier", "svetlo", "večer", "púšťať"] },
  taboo_sk_0896: { word: "olympiáda", forbidden: ["šport", "medaila", "hry", "súťaž"] },
  taboo_sk_0897: { word: "štafeta", forbidden: ["bežec", "kolík", "tím", "dráha"] },
  taboo_sk_0900: { word: "preskok", forbidden: ["skočiť", "prekážka", "nohy", "výška"] },
  taboo_sk_0903: { word: "lyžovačka", forbidden: ["sneh", "lyže", "svah", "zima"] },

  taboo_sk_0745: { word: "vstupenka", forbidden: ["kino", "divadlo", "lístok", "kúpiť"] },
  taboo_sk_0758: { word: "detektívka", forbidden: ["zločin", "stopa", "kniha", "vyšetriť"] },
  taboo_sk_0759: { word: "scenár", forbidden: ["film", "dialóg", "písať", "režisér"] },
  taboo_sk_0760: { word: "hrdina", forbidden: ["príbeh", "postava", "odvaha", "hlavný"] },
  taboo_sk_0761: { word: "zloduch", forbidden: ["zlo", "film", "hrdina", "postava"] },
  taboo_sk_0763: { word: "bábka", forbidden: ["divadlo", "ruka", "drevená", "rozprávka"] },
  taboo_sk_0765: { word: "hlas", forbidden: ["spev", "pieseň", "zvuk", "spievať"] },
  taboo_sk_0951: { word: "kulisy", forbidden: ["javisko", "divadlo", "scéna", "dekorácia"] },
  taboo_sk_0959: { word: "popcorn", forbidden: ["kino", "kukurica", "pukance", "slané"] },
  taboo_sk_0967: { word: "básnik", forbidden: ["verš", "poézia", "rým", "autor"] },
  taboo_sk_0993: { word: "kapela", forbidden: ["hudba", "spevák", "bicie", "koncert"] },
  taboo_sk_0999: { word: "denník", forbidden: ["zápis", "dátum", "písať", "spomienka"] },
  taboo_sk_1037: { word: "knihomoľ", forbidden: ["kniha", "čítanie", "polica", "román"] },
  taboo_sk_1039: { word: "balet", forbidden: ["tanec", "divadlo", "špičky", "hudba"] },
  taboo_sk_1046: { word: "tanečnica", forbidden: ["tanec", "javisko", "sukňa", "pohyb"] },
  taboo_sk_1047: { word: "soška", forbidden: ["múzeum", "vitrína", "história", "predmet"] },
  taboo_sk_1048: { word: "medaila", forbidden: ["cena", "víťaz", "zlato", "ocenenie"] },
  taboo_sk_1050: { word: "plagát", forbidden: ["stena", "obrázok", "papier", "reklama"] },
  taboo_sk_0949: { word: "dráma", forbidden: ["divadlo", "herci", "smutný", "príbeh"] },

  taboo_sk_1061: { word: "selfie", forbidden: ["fotka", "mobil", "tvár", "kamera"] },
  taboo_sk_1072: { word: "nahrávač", forbidden: ["zvuk", "záznam", "tlačidlo", "prehrať"] },
  taboo_sk_1073: { word: "teplomer", forbidden: ["stupne", "horúčka", "merať", "telo"] },
  taboo_sk_1074: { word: "zvonenie", forbidden: ["mobil", "tón", "hlasný", "upozornenie"] },
  taboo_sk_1076: { word: "anténa", forbidden: ["signál", "strecha", "televízia", "príjem"] },
  taboo_sk_1077: { word: "čítačka", forbidden: ["text", "strany", "displej", "kniha"] },
  taboo_sk_1084: { word: "profil", forbidden: ["meno", "fotka", "účet", "sociálna sieť"] },
  taboo_sk_1085: { word: "PIN", forbidden: ["číslo", "banka", "karta", "tajné"] },
  taboo_sk_1086: { word: "heslo", forbidden: ["účet", "prihlásenie", "tajné", "písmená"] },
  taboo_sk_1087: { word: "otázka", forbidden: ["odpoveď", "pýtať", "kvíz", "rozmýšľať"] },
  taboo_sk_1088: { word: "disk", forbidden: ["súbory", "počítač", "uložiť", "pamäť"] },
  taboo_sk_1089: { word: "súbor", forbidden: ["počítač", "dokument", "uložiť", "otvoriť"] },
  taboo_sk_1090: { word: "e-mail", forbidden: ["správa", "pošta", "odoslať", "adresa"] },
  taboo_sk_1092: { word: "priečinok", forbidden: ["počítač", "názov", "uložiť", "súbor"] },
  taboo_sk_1094: { word: "chat", forbidden: ["správa", "písať", "ľudia", "mobil"] },
  taboo_sk_1096: { word: "nahrávka", forbidden: ["zvuk", "mikrofón", "prehrať", "hlas"] },
  taboo_sk_1098: { word: "podpis", forbidden: ["meno", "pero", "papier", "potvrdiť"] },
  taboo_sk_1100: { word: "Wi-Fi", forbidden: ["internet", "signál", "router", "pripojenie"] },
  taboo_sk_1101: { word: "prehliadač", forbidden: ["web", "stránka", "kliknúť", "internet"] },
  taboo_sk_1102: { word: "web", forbidden: ["stránka", "internet", "odkaz", "prehliadač"] },
  taboo_sk_1103: { word: "systém", forbidden: ["počítač", "spustiť", "nastavenie", "softvér"] },
  taboo_sk_1106: { word: "menu", forbidden: ["ikona", "voľba", "nastaviť", "obrazovka"] },
  taboo_sk_1107: { word: "upozornenie", forbidden: ["mobil", "zvuk", "správa", "displej"] },
  taboo_sk_1108: { word: "ikona", forbidden: ["symbol", "aplikácia", "dotyk", "obrazovka"] },
  taboo_sk_1109: { word: "displej", forbidden: ["obrazovka", "mobil", "jas", "dotyk"] },
  taboo_sk_1110: { word: "karta", forbidden: ["banka", "platiť", "čip", "peňaženka"] },
  taboo_sk_1111: { word: "kábel", forbidden: ["zásuvka", "nabíjačka", "drôt", "pripojiť"] },
  taboo_sk_1112: { word: "záloha", forbidden: ["súbor", "disk", "uložiť", "obnoviť"] },
  taboo_sk_1113: { word: "prihlásenie", forbidden: ["heslo", "účet", "meno", "mobil"] },
  taboo_sk_1114: { word: "signál", forbidden: ["internet", "anténa", "spojenie", "Wi-Fi"] },
  taboo_sk_1119: { word: "meranie", forbidden: ["číslo", "teplota", "dĺžka", "prístroj"] },
  taboo_sk_1123: { word: "pokladňa", forbidden: ["obchod", "platiť", "tovar", "účtenka"] },
  taboo_sk_1125: { word: "reklama", forbidden: ["značka", "televízia", "produkt", "propagácia"] },
  taboo_sk_1126: { word: "príspevok", forbidden: ["profil", "písať", "zdieľať", "sociálna sieť"] },
  taboo_sk_1127: { word: "komentár", forbidden: ["reakcia", "článok", "diskusia", "napísať"] },
  taboo_sk_1128: { word: "zdieľanie", forbidden: ["profil", "poslať", "sociálna sieť", "príspevok"] },
  taboo_sk_1130: { word: "lupa", forbidden: ["zväčšiť", "sklo", "čítať", "malé"] },
  taboo_sk_1132: { word: "fórum", forbidden: ["internet", "téma", "správa", "ľudia"] },
  taboo_sk_1135: { word: "kanál", forbidden: ["video", "odber", "nahrávka", "profil"] },
  taboo_sk_1136: { word: "čip", forbidden: ["karta", "dvere", "kód", "priložiť"] },
  taboo_sk_1137: { word: "anketa", forbidden: ["otázky", "hlasovať", "odpovede", "internet"] },
  taboo_sk_1141: { word: "poistka", forbidden: ["prúd", "výpadok", "skriňa", "bezpečnosť"] },
  taboo_sk_1142: { word: "kód", forbidden: ["písať", "počítač", "príkaz", "program"] },
  taboo_sk_1145: { word: "dáta", forbidden: ["informácie", "počítač", "uložiť", "súbory"] },
  taboo_sk_1146: { word: "postup", forbidden: ["kroky", "riešenie", "poradie", "návod"] },
  taboo_sk_1147: { word: "bug", forbidden: ["chyba", "počítač", "pád", "oprava"] },
  taboo_sk_1148: { word: "oprava", forbidden: ["chyba", "servis", "zlepšiť", "nový"] },
  taboo_sk_1149: { word: "verzia", forbidden: ["nová", "číslo", "aktualizácia", "program"] },
  taboo_sk_1150: { word: "archív", forbidden: ["súbory", "staré", "uložiť", "záznam"] },
  taboo_sk_1151: { word: "tajomstvo", forbidden: ["heslo", "skryť", "súkromie", "nepovedať"] },
  taboo_sk_1152: { word: "ochrana", forbidden: ["bezpečnosť", "zámok", "heslo", "riziko"] },
  taboo_sk_1154: { word: "blok", forbidden: ["zastaviť", "prekážka", "cesta", "ochrana"] },
  taboo_sk_1155: { word: "robot", forbidden: ["stroj", "sám", "práca", "technika"] },
  taboo_sk_1156: { word: "chatbot", forbidden: ["správa", "robot", "otázka", "odpoveď"] },
  taboo_sk_1158: { word: "nálepka", forbidden: ["kamera", "obrázok", "mobil", "farba"] },
  taboo_sk_1161: { word: "družica", forbidden: ["vesmír", "obloha", "signál", "zem"] },
  taboo_sk_1163: { word: "meter", forbidden: ["merať", "dĺžka", "číslo", "nástroj"] },
  taboo_sk_1164: { word: "zvonček", forbidden: ["dvere", "tlačidlo", "návšteva", "zvuk"] },
  taboo_sk_1167: { word: "batéria", forbidden: ["nabíjať", "mobil", "energia", "prúd"] },
  taboo_sk_1169: { word: "dávkovač", forbidden: ["mydlo", "stlačiť", "kúpeľňa", "tekutina"] },
  taboo_sk_1173: { word: "svetielko", forbidden: ["svetlo", "papier", "večer", "sviečka"] },
  taboo_sk_1174: { word: "návod", forbidden: ["postup", "čítať", "obrázky", "použiť"] },
  taboo_sk_1175: { word: "postavička", forbidden: ["hra", "profil", "obrázok", "virtuálna"] },
  taboo_sk_1180: { word: "dym", forbidden: ["oheň", "požiar", "sivý", "vzduch"] },
  taboo_sk_1182: { word: "domofón", forbidden: ["dvere", "byt", "zvoniť", "návšteva"] },
  taboo_sk_1192: { word: "formulár", forbidden: ["meno", "vyplniť", "otázky", "papier"] },
  taboo_sk_1197: { word: "sledovanie", forbidden: ["kamera", "záznam", "ochrana", "dvere"] },
  taboo_sk_1198: { word: "tlačiareň", forbidden: ["papier", "toner", "dokument", "vytlačiť"] },
  taboo_sk_1199: { word: "model", forbidden: ["plast", "vrstvy", "vytlačiť", "tvar"] },
  taboo_sk_1200: { word: "reproduktor", forbidden: ["hudba", "zvuk", "hlasný", "spojiť"] },

  taboo_sk_1214: { word: "huba", forbidden: ["les", "klobúk", "rásť", "zbierať"] },
  taboo_sk_1225: { word: "ruža", forbidden: ["kvet", "tŕne", "červená", "vôňa"] },
  taboo_sk_1277: { word: "para", forbidden: ["voda", "teplo", "stúpať", "hrniec"] },
  taboo_sk_1278: { word: "bublina", forbidden: ["voda", "vzduch", "mydlo", "prasknúť"] },
  taboo_sk_1281: { word: "vesmír", forbidden: ["hviezdy", "planéta", "raketa", "tmavý"] },
  taboo_sk_1286: { word: "kopec", forbidden: ["hora", "výhľad", "stúpať", "turistika"] },
  taboo_sk_1294: { word: "ústie", forbidden: ["rieka", "more", "voda", "tok"] },
  taboo_sk_1297: { word: "koral", forbidden: ["more", "farebný", "ryba", "útes"] },
  taboo_sk_1299: { word: "sneh", forbidden: ["zima", "biely", "vločka", "mráz"] },
  taboo_sk_1301: { word: "sopka", forbidden: ["láva", "hora", "výbuch", "oheň"] },
  taboo_sk_1309: { word: "zemeguľa", forbidden: ["mapa", "svet", "kontinent", "kruhová"] },
  taboo_sk_1316: { word: "minca", forbidden: ["peniaze", "kov", "platiť", "mena"] },
  taboo_sk_1317: { word: "glóbus", forbidden: ["svet", "mapa", "zemeguľa", "škola"] },
  taboo_sk_1318: { word: "skala", forbidden: ["kameň", "hora", "tvrdá", "príroda"] },
  taboo_sk_1320: { word: "vlny", forbidden: ["more", "voda", "pláž", "pohyb"] },
  taboo_sk_1322: { word: "potrava", forbidden: ["jedlo", "zviera", "jesť", "les"] },
  taboo_sk_1323: { word: "záchrana", forbidden: ["pomoc", "ohrozenie", "volať", "hasič"] },
  taboo_sk_1325: { word: "vietor", forbidden: ["fúkať", "vzduch", "stromy", "počasie"] },
  taboo_sk_1326: { word: "strom", forbidden: ["les", "listy", "kmeň", "drevo"] },
  taboo_sk_1347: { word: "hlina", forbidden: ["zem", "pôda", "kopať", "hlinené"] },

  taboo_sk_1391: { word: "úloha", forbidden: ["práca", "splniť", "škola", "zadanie"] },
  taboo_sk_1399: { word: "odstup", forbidden: ["blízko", "ľudia", "vzdialenosť", "rešpekt"] },
  taboo_sk_1401: { word: "snaha", forbidden: ["úsilie", "pokúsiť", "chcieť", "výsledok"] },
  taboo_sk_1404: { word: "hádka", forbidden: ["spor", "kričať", "nahnevať", "slová"] },
  taboo_sk_1408: { word: "správanie", forbidden: ["slušnosť", "ľudia", "pravidlá", "pozdrav"] },
  taboo_sk_1413: { word: "láskavosť", forbidden: ["pomoc", "milý", "dobro", "človek"] },
  taboo_sk_1414: { word: "kalendár", forbidden: ["dátum", "mesiac", "plán", "rok"] },
  taboo_sk_1428: { word: "starosť", forbidden: ["problém", "trápiť", "myslieť", "rodina"] },
  taboo_sk_1433: { word: "zmena", forbidden: ["nový", "iný", "nečakaný", "plán"] },
  taboo_sk_1434: { word: "adresa", forbidden: ["dom", "ulica", "mesto", "napísať"] },
  taboo_sk_1438: { word: "pohovor", forbidden: ["práca", "otázky", "uchádzač", "zamestnávateľ"] },
  taboo_sk_1439: { word: "odchod", forbidden: ["práca", "dvere", "rozlúčka", "koniec"] },
  taboo_sk_1444: { word: "podpora", forbidden: ["pomoc", "spolu", "povzbudiť", "človek"] },
  taboo_sk_1447: { word: "budúcnosť", forbidden: ["plán", "neskôr", "roky", "pred"] },
  taboo_sk_1449: { word: "rozdelenie", forbidden: ["úloha", "ľudia", "spolu", "čas"] },
  taboo_sk_1451: { word: "riešenie", forbidden: ["problém", "odpoveď", "nápad", "postup"] },
  taboo_sk_1452: { word: "reakcia", forbidden: ["odpoveď", "názor", "komentár", "správa"] },
  taboo_sk_1455: { word: "záznam", forbidden: ["písať", "porada", "body", "papier"] },
  taboo_sk_1457: { word: "vrátenie", forbidden: ["obchod", "tovar", "peniaze", "chyba"] },
  taboo_sk_1458: { word: "účtenka", forbidden: ["nákup", "pokladňa", "cena", "papier"] },
  taboo_sk_1474: { word: "bábätko", forbidden: ["dieťa", "rodičia", "kočík", "malé"] },
  taboo_sk_1475: { word: "tradícia", forbidden: ["rodina", "zvyk", "sviatok", "opakovať"] },
  taboo_sk_1477: { word: "upratovanie", forbidden: ["prach", "vysávač", "metla", "čistiť"] },
  taboo_sk_1478: { word: "zoznam", forbidden: ["nákup", "písať", "obchod", "veci"] },
  taboo_sk_1481: { word: "oddych", forbidden: ["pokoj", "gauč", "voľno", "čaj"] },
  taboo_sk_1483: { word: "servis", forbidden: ["oprava", "technika", "záruka", "pokaziť"] },
  taboo_sk_1484: { word: "výlet", forbidden: ["cesta", "rodina", "príroda", "dovolenka"] },
  taboo_sk_1485: { word: "víkend", forbidden: ["sobota", "nedeľa", "voľno", "plán"] },
  taboo_sk_1488: { word: "pauza", forbidden: ["prestávka", "oddych", "čas", "zastaviť"] },
  taboo_sk_1492: { word: "darček", forbidden: ["prekvapenie", "balík", "oslava", "dať"] },
  taboo_sk_1497: { word: "pravidlo", forbidden: ["dodržať", "spoločnosť", "zákaz", "správanie"] },
};

Object.assign(replacements, {
  taboo_sk_0758: { word: "záhada", forbidden: ["stopa", "vyšetriť", "tajomstvo", "riešenie"] },
  taboo_sk_0759: { word: "príbeh", forbidden: ["film", "dialóg", "postava", "zápletka"] },
  taboo_sk_0870: { word: "prenájom", forbidden: ["bicykel", "požičať", "vrátiť", "peniaze"] },
  taboo_sk_0874: { word: "kufor", forbidden: ["batožina", "oblečenie", "zámok", "kolieska"] },
  taboo_sk_1046: { word: "tanečnica", forbidden: ["balet", "javisko", "sukňa", "pohyb"] },
  taboo_sk_1077: { word: "pečiatka", forbidden: ["papier", "atrament", "potvrdiť", "úrad"] },
  taboo_sk_1103: { word: "tapeta", forbidden: ["obrazovka", "obrázok", "farba", "pozadie"] },
  taboo_sk_1150: { word: "kópia", forbidden: ["súbory", "staré", "uložiť", "záznam"] },
  taboo_sk_1164: { word: "hostia", forbidden: ["dvere", "tlačidlo", "návšteva", "zvuk"] },
  taboo_sk_1178: { word: "horúčka", forbidden: ["teplomer", "choroba", "stupne", "telo"] },
  taboo_sk_1197: { word: "dohľad", forbidden: ["kamera", "záznam", "ochrana", "dvere"] },
  taboo_sk_1200: { word: "hudba", forbidden: ["zvuk", "pieseň", "slúchadlá", "rádio"] },
  taboo_sk_1323: { word: "smog", forbidden: ["vzduch", "mesto", "sivý", "dýchať"] },
  taboo_sk_1439: { word: "balenie", forbidden: ["kufor", "veci", "cesta", "domov"] },
  taboo_sk_1447: { word: "sen", forbidden: ["spánok", "želanie", "noc", "predstava"] },
  taboo_sk_1455: { word: "zápis", forbidden: ["písať", "porada", "body", "papier"] },
  taboo_sk_1478: { word: "potraviny", forbidden: ["obchod", "košík", "cena", "nákup"] },
  taboo_sk_1481: { word: "voľno", forbidden: ["pokoj", "gauč", "oddych", "čaj"] },
  taboo_sk_0966: { word: "princezná", forbidden: ["koruna", "rozprávka", "zámok", "šaty"] },
  taboo_sk_1097: { word: "filmček", forbidden: ["kamera", "obraz", "prehrať", "záznam"] },
  taboo_sk_1165: { word: "pokladník", forbidden: ["obchod", "platiť", "tovar", "účtenka"] },
  taboo_sk_1194: { word: "dotazník", forbidden: ["otázky", "vyplniť", "odpoveď", "meno"] },
});

function normalize(value) {
  return value
    .toLocaleLowerCase("sk")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function conflicts(target, forbidden) {
  const targetNormalized = normalize(target);
  const stem = targetNormalized.length > 5 ? targetNormalized.slice(0, -2) : targetNormalized;
  return forbidden.some((word) => {
    const normalized = normalize(word);
    return normalized === targetNormalized || (stem.length >= 4 && normalized.includes(stem));
  });
}

const data = JSON.parse(await readFile(dataPath, "utf8"));
const ids = new Set(data.cards.map((card) => card.id));
for (const [id, replacement] of Object.entries(replacements)) {
  if (!ids.has(id)) throw new Error(`Neexistujúce ID v content QA: ${id}`);
  if (!Array.isArray(replacement.forbidden) || replacement.forbidden.length !== 4) throw new Error(`${id} musí mať presne štyri zákazy.`);
  if (new Set(replacement.forbidden.map(normalize)).size !== 4) throw new Error(`${id} má duplicitné zákazy.`);
  if (conflicts(replacement.word, replacement.forbidden)) throw new Error(`${id} má konflikt cieľa so zákazom.`);
}

const changes = [];
for (const card of data.cards) {
  const replacement = replacements[card.id];
  if (!replacement) continue;
  changes.push({ id: card.id, category: card.category, before: { word: card.word, forbidden: card.forbidden }, after: replacement });
  card.word = replacement.word;
  card.forbidden = replacement.forbidden;
}

const targetGroups = new Map();
for (const card of data.cards) {
  const key = normalize(card.word);
  targetGroups.set(key, [...(targetGroups.get(key) ?? []), card.id]);
}
const duplicates = [...targetGroups.entries()].filter(([, cardIds]) => cardIds.length > 1);
if (duplicates.length) throw new Error(`Content QA by vytvorila duplicitné ciele: ${JSON.stringify(duplicates)}`);

await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
await writeFile(reportPath, `${JSON.stringify({ cardsReviewed: data.cards.length, cardsReplaced: changes.length, changes }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ cardsReviewed: data.cards.length, cardsReplaced: changes.length }, null, 2));
