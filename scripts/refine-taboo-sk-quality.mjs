import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const databasePath = path.resolve("client/src/data/tabooCardsSk.json");
const fixLogPath = path.resolve("taboo-sk-quality-fixes.json");

function key(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("sk").replace(/[^a-z0-9]/g, "");
}
function same(values, pattern) {
  return values.length === pattern.length && values.every((value, index) => value === pattern[index]);
}
function choose(target, alternatives) {
  const targetKey = key(target);
  return alternatives.map((item) => item.trim()).filter((item) => {
    const itemKey = key(item);
    return itemKey && itemKey !== targetKey && !itemKey.includes(targetKey) && !targetKey.includes(itemKey);
  }).slice(0, 4);
}

const locationClues = {
  "mýtnica": ["diaľnica", "poplatok", "automobil", "brána"],
  "odpočívadlo": ["diaľnica", "toaleta", "prestávka", "parkovanie"],
  "cyklotrasa": ["bicykel", "prilba", "značenie", "výlet"],
  "hraničný priechod": ["pas", "štát", "colník", "hranica"],
  "stanovište taxíkov": ["odvoz", "vodič", "cestujúci", "parkovanie"],
  "autopožičovňa": ["vozidlo", "nájom", "kľúče", "zmluva"],
  "autoumyváreň": ["vozidlo", "voda", "šampón", "čistenie"],
  "dopravný uzol": ["prestup", "autobus", "vlak", "cestujúci"],
  "podchod": ["schody", "tunel", "chodci", "stanica"],
  "nadchod": ["most", "schody", "chodci", "výška"],
  "chodník": ["pešo", "dlažba", "chodci", "park"],
  "nábrežie": ["rieka", "breh", "prechádzka", "lavička"],
  "zákruta": ["volant", "auto", "cesta", "spomaliť"],
  "obchádzka": ["uzávierka", "značka", "trasa", "doprava"],
  "priechod pre chodcov": ["zebra", "semafor", "cesta", "chodci"],
  "turniket": ["vstup", "lístok", "metro", "brána"],
  "odbavovacia hala": ["letisko", "batožina", "letenka", "odlet"],
  "informačné centrum": ["turista", "mapa", "leták", "rady"],
  "colný úrad": ["hranica", "tovar", "kontrola", "pas"],
  "radnica": ["primátor", "úrad", "námestie", "sobáš"],
  "tržnica": ["stánok", "ovocie", "predavač", "nákup"],
  "mestský park": ["stromy", "lavička", "tráva", "prechádzka"],
  "kultúrny dom": ["podujatie", "sála", "koncert", "javisko"],
  "komunitné centrum": ["susedia", "workshop", "stretnutie", "dobrovoľníci"],
  "pozorovateľňa": ["výhľad", "ďalekohľad", "vtáky", "veža"],
  "observatórium": ["hviezdy", "teleskop", "vesmír", "planéty"],
};

const sportClues = {
  "atletika": ["dráha", "bežec", "štadión", "disciplína"],
  "badminton": ["raketa", "košík", "sieť", "kurt"],
  "baseball": ["pálka", "loptička", "nadhadzovač", "meta"],
  "beh cez prekážky": ["dráha", "bežec", "latka", "štadión"],
  "biatlon": ["lyže", "streľba", "terč", "sneh"],
  "házená": ["lopta", "bránka", "hala", "družstvo"],
  "kanoistika": ["pádlo", "rieka", "loď", "voda"],
  "karate": ["kimono", "opasok", "úder", "dojo"],
  "moderný päťboj": ["disciplína", "beh", "plávanie", "šerm"],
  "orientačný beh": ["mapa", "kompas", "les", "kontrola"],
  "parašutizmus": ["padák", "lietadlo", "výška", "zoskok"],
  "pozemný hokej": ["palica", "loptička", "ihrisko", "bránka"],
  "skok do diaľky": ["odraz", "piesok", "dráha", "doskok"],
  "skok do výšky": ["latka", "odraz", "doskok", "štadión"],
  "skoky na lyžiach": ["mostík", "sneh", "dopad", "lyže"],
  "taekwondo": ["kop", "opasok", "súboj", "kimono"],
  "triatlon": ["plávanie", "bicykel", "beh", "vytrvalosť"],
  "vodné pólo": ["bazén", "lopta", "bránka", "družstvo"],
  "veslovanie": ["pádlo", "loď", "rieka", "posádka"],
  "hod diskom": ["kruh", "atletika", "vrh", "sektor"],
  "parkúr": ["prekážka", "kôň", "jazdec", "skok"],
  "softbal": ["pálka", "loptička", "meta", "nadhod"],
  "dáma": ["figúrky", "šachovnica", "diagonála", "súper"],
  "piškvorky": ["krížik", "kruh", "mriežka", "riadok"],
  "pexeso": ["dvojica", "kartičky", "pamäť", "obrázok"],
  "scrabble": ["písmená", "slová", "doska", "body"],
  "človeče nehnevaj sa": ["figúrky", "kocka", "domček", "súper"],
  "kocky": ["body", "hádzať", "čísla", "stôl"],
  "krížovka": ["heslo", "tajnička", "písmená", "lúštenie"],
  "osemsmerovka": ["písmená", "slová", "mriežka", "hľadať"],
  "hlavolam": ["riešenie", "logika", "hádanka", "premýšľať"],
  "stavebnica": ["dieliky", "skladať", "návod", "model"],
  "modelovanie": ["hlina", "tvar", "ruky", "socha"],
  "aerobik": ["hudba", "cvičenie", "rytmus", "inštruktor"],
  "kúzelnícky trik": ["ilúzia", "pódium", "prekvapenie", "klobúk"],
  "kreslenie": ["ceruzka", "papier", "obrázok", "farby"],
  "tancovanie": ["hudba", "kroky", "parket", "rytmus"],
  "žonglovanie": ["loptičky", "ruky", "cirkus", "hádzať"],
  "pantomíma": ["gestá", "bez slov", "herec", "predviesť"],
  "vedomostný kvíz": ["otázky", "odpovede", "body", "súťaž"],
  "jazda na kolobežke": ["riadidlá", "kolesá", "odrážať", "prilba"],
};

const technologyClues = {
  "mobilné dáta": ["operátor", "tarifa", "signál", "gigabajty"],
  "vyhľadávač": ["kľúčové slovo", "výsledok", "dotaz", "prehliadač"],
  "webová stránka": ["adresa", "prehliadač", "doména", "obsah"],
  "odkaz": ["kliknúť", "URL", "prepojenie", "stránka"],
  "doména": ["web", "adresa", "koncovka", "registrácia"],
  "používateľské meno": ["účet", "prihlásenie", "identita", "heslo"],
  "prístupový kód": ["číslice", "heslo", "zámok", "overenie"],
  "dvojfaktorové overenie": ["heslo", "kód", "bezpečnosť", "mobil"],
  "bezpečnostná otázka": ["odpoveď", "heslo", "účet", "overenie"],
  "cloudové úložisko": ["súbory", "záloha", "disk", "uložiť"],
  "stiahnutý súbor": ["uložiť", "prehliadač", "počítač", "dokument"],
  "príloha správy": ["e-mail", "dokument", "pripojiť", "odoslať"],
  "spam": ["nevyžiadaný", "e-mail", "reklama", "doručená pošta"],
  "poštová schránka": ["e-mail", "doručené", "priečinok", "odstrániť"],
  "videohovor": ["kamera", "mikrofón", "účastník", "obraz"],
  "skupinový chat": ["konverzácia", "správy", "notifikácia", "účastníci"],
  "emotikon": ["smajlík", "tvár", "správa", "klávesnica"],
  "hlasová správa": ["nahrať", "mikrofón", "prehrať", "zvuk"],
  "videonahrávka": ["kamera", "záznam", "prehrať", "obraz"],
  "digitálny podpis": ["certifikát", "overiť", "dokument", "elektronický"],
  "virtuálna schôdza": ["účastníci", "kamera", "agenda", "prezentácia"],
  "router": ["Wi-Fi", "anténa", "signál", "sieť"],
  "modem": ["operátor", "pripojenie", "internet", "signál"],
  "server": ["dáta", "sieť", "počítač", "prevádzka"],
  "operačný systém": ["počítač", "softvér", "spustiť", "ovládať"],
  "aktualizácia": ["nová verzia", "stiahnuť", "oprava", "systém"],
  "inštalácia": ["softvér", "stiahnuť", "spustiť", "počítač"],
  "nastavenia": ["možnosti", "meniť", "ikona", "ovládať"],
  "notifikácia": ["upozornenie", "zvuk", "displej", "správa"],
  "ikona aplikácie": ["symbol", "dotyk", "otvoriť", "displej"],
  "domovská obrazovka": ["ikony", "pozadie", "odomknúť", "displej"],
  "záloha údajov": ["uložiť", "obnoviť", "súbory", "disk"],
  "obnovenie hesla": ["prihlásenie", "účet", "e-mail", "overenie"],
  "tichý režim": ["zvonenie", "vibrácie", "notifikácia", "mobil"],
  "tmavý režim": ["displej", "farby", "jas", "nastavenia"],
};

const mediaClues = {
  "podcast": ["epizóda", "počúvať", "slúchadlá", "moderátor"],
  "audiokniha": ["rozprávač", "počúvať", "príbeh", "slúchadlá"],
  "vysielanie": ["televízia", "rádio", "priamy prenos", "program"],
  "reklamný spot": ["značka", "propagácia", "televízia", "kampaň"],
  "bannerová reklama": ["web", "obrázok", "kliknúť", "propagácia"],
  "sponzorovaný príspevok": ["sociálna sieť", "reklama", "značka", "platiť"],
  "komentár pod článkom": ["diskusia", "čitateľ", "reakcia", "web"],
  "zdieľanie príspevku": ["sociálna sieť", "profil", "odoslať", "sledovať"],
  "sledovateľ": ["profil", "sociálna sieť", "príspevok", "odber"],
  "kanál s videami": ["odber", "nahrávka", "prehrať", "profil"],
  "novinový titulok": ["noviny", "článok", "nadpis", "redakcia"],
};

const geographyClues = {
  "štátna hranica": ["pas", "colník", "prechod", "cudzina"],
};

const situationClues = {
  "dohoda": ["kompromis", "podpis", "zmluva", "súhlas"],
  "stretnutie": ["účastníci", "termín", "miesto", "pozvanie"],
  "rozhodnutie": ["voľba", "možnosť", "zvážiť", "následok"],
  "začiatok": ["úvod", "prvý", "otvoriť", "začať"],
  "koniec": ["záver", "posledný", "skončiť", "hotovo"],
  "prestávka": ["pauza", "oddych", "medzi", "zastaviť"],
  "termín": ["dátum", "odovzdať", "kalendár", "čas"],
  "harmonogram": ["rozvrh", "poradie", "úlohy", "dátumy"],
  "priorita": ["dôležitý", "naliehavý", "poradie", "najprv"],
  "voľba": ["alternatíva", "vybrať", "možnosť", "rozhodnúť"],
  "príležitosť": ["šanca", "využiť", "okamih", "možnosť"],
  "náhoda": ["nečakané", "prípad", "šťastie", "osud"],
  "zvyk": ["rutina", "opakovanie", "denne", "naučený"],
  "rutina": ["zvyk", "denne", "pravidelne", "opakovať"],
  "spomienka": ["minulosť", "pamäť", "fotografia", "zážitok"],
  "skúsenosť": ["prax", "prežiť", "učiť", "zážitok"],
  "poučenie": ["lekcia", "chyba", "pochopiť", "skúsenosť"],
  "výzva": ["prekonať", "odvaha", "skúška", "úloha"],
  "cieľ": ["dosiahnuť", "smer", "plán", "úspech"],
  "úspech": ["vyhrať", "výsledok", "radosť", "podariť"],
  "neúspech": ["prehra", "chyba", "sklamanie", "nepodariť"],
  "pokrok": ["zlepšenie", "vývoj", "dopredu", "posun"],
  "zdržanie": ["meškať", "oneskorenie", "čakať", "problém"],
  "zmena plánu": ["nečakané", "nový", "termín", "upraviť"],
  "čakanie": ["trpezlivosť", "rad", "oneskorenie", "minúty"],
  "návrat": ["vrátiť", "domov", "cesta", "späť"],
  "odchod": ["rozlúčka", "dvere", "cesta", "preč"],
  "návšteva": ["hostiteľ", "hostia", "pozvanie", "zvonec"],
  "cesta domov": ["vrátiť", "adresa", "doprava", "byt"],
  "prvý dojem": ["pohľad", "stretnutie", "názor", "začiatok"],
  "druhá šanca": ["oprava", "znovu", "možnosť", "odpustenie"],
  "spoločný plán": ["dohoda", "budúcnosť", "cieľ", "spolu"],
};

const workClues = {
  "porada": ["kolegovia", "agenda", "zápisnica", "diskusia"],
  "pracovný pohovor": ["uchádzač", "zamestnávateľ", "životopis", "otázky"],
  "životopis": ["kariéra", "skúsenosti", "vzdelanie", "uchádzač"],
  "výpoveď": ["zamestnanie", "odchod", "zmluva", "zamestnávateľ"],
  "povýšenie": ["kariéra", "vyšší", "funkcia", "úspech"],
  "plat": ["mzda", "peniaze", "zamestnávateľ", "mesiac"],
  "odmena": ["bonus", "peniaze", "pochvala", "zásluha"],
  "prestávka na obed": ["jedlo", "pauza", "pracovisko", "jedáleň"],
  "služba": ["smena", "pohotovosť", "zamestnanec", "rozvrh"],
  "smenná práca": ["ranná", "nočná", "pracovisko", "rozvrh"],
  "dochádzka": ["príchod", "odchod", "evidencia", "pracovisko"],
  "pracovný stôl": ["kancelária", "počítač", "zásuvka", "stolička"],
  "termín odovzdania": ["dátum", "úloha", "meškanie", "hotovo"],
  "skupinová práca": ["tím", "spolupráca", "projekt", "rozdeliť"],
  "spolupráca": ["tím", "kolegovia", "dohoda", "spoločne"],
  "zodpovednosť": ["povinnosť", "dôvera", "úloha", "následok"],
  "delegovanie": ["úloha", "odovzdať", "nadriadený", "zamestnanec"],
  "nápad": ["myšlienka", "tvorivosť", "nový", "riešenie"],
  "riešenie problému": ["prekážka", "odpoveď", "postup", "opraviť"],
  "spätná väzba": ["hodnotenie", "názor", "komentár", "zlepšenie"],
  "prezentácia": ["prednášať", "snímka", "projektor", "publikum"],
  "poznámka": ["zápis", "text", "papier", "pripomienka"],
  "zápisnica": ["porada", "body", "protokol", "záznam"],
  "objednávka": ["tovar", "zákazník", "dodanie", "nákup"],
  "reklamácia": ["záruka", "obchod", "vrátiť", "chybný tovar"],
  "pokladničný doklad": ["nákup", "pokladňa", "cena", "účet"],
  "zľava": ["lacnejšie", "cena", "akcia", "nákup"],
  "rozpočet": ["peniaze", "výdavky", "plán", "úspora"],
  "úspora": ["šetriť", "peniaze", "výdavky", "menej"],
};

const familyClues = {
  "rodič": ["dieťa", "výchova", "starostlivosť", "škola"],
  "súrodenec": ["brat", "sestra", "detstvo", "spolu"],
  "starý rodič": ["babka", "dedko", "vnúča", "vek"],
  "bratranec": ["teta", "strýko", "sesternica", "príbuzný"],
  "sesternica": ["teta", "strýko", "bratranec", "príbuzná"],
  "sused": ["byt", "vedľa", "dom", "ulica"],
  "spolužiak": ["škola", "trieda", "lavica", "učiteľ"],
  "kolega": ["zamestnanie", "kancelária", "tím", "pracovisko"],
  "kamarátstvo": ["priateľ", "dôvera", "spolu", "pomoc"],
  "partnerstvo": ["dvojica", "vzťah", "dôvera", "spolu"],
  "manželstvo": ["svadba", "prsteň", "manželia", "sľub"],
  "rozchod": ["koniec", "vzťah", "smútok", "dvojica"],
  "zasnúbenie": ["prsteň", "žiadosť", "svadba", "láska"],
  "narodenie dieťaťa": ["bábätko", "nemocnica", "rodičia", "kočík"],
  "návšteva rodiny": ["hostia", "dvere", "pozvanie", "občerstvenie"],
  "spoločná večera": ["stôl", "jedlo", "tanier", "rodina"],
  "upratovanie bytu": ["vysávač", "prach", "metla", "čistenie"],
  "plánovanie nákupu": ["zoznam", "obchod", "košík", "cena"],
  "stratené kľúče": ["hľadať", "zámok", "vrecko", "dvere"],
  "zabudnutý termín": ["kalendár", "dátum", "meškanie", "pripomienka"],
  "meškanie autobusu": ["zastávka", "spoj", "cestujúci", "hodiny"],
  "nečakaný hosť": ["dvere", "zvonec", "návšteva", "prekvapenie"],
  "pokazený spotrebič": ["oprava", "zásuvka", "servis", "záruka"],
  "prázdna chladnička": ["jedlo", "nákup", "kuchyňa", "hlad"],
  "víkendový plán": ["sobota", "nedeľa", "voľno", "výlet"],
  "ranné vstávanie": ["budík", "posteľ", "zobudiť", "spánok"],
  "večerný oddych": ["gauč", "televízor", "pokoj", "čaj"],
  "spoločná fotografia": ["fotoaparát", "úsmev", "album", "spomienka"],
  "rodinný album": ["fotky", "strany", "spomienky", "detstvo"],
  "domáce zviera": ["pes", "mačka", "kŕmiť", "chov"],
};

const socialClues = {
  "rešpekt": ["úcta", "slušnosť", "názor", "správanie"],
  "slušnosť": ["pozdrav", "správanie", "zdvorilosť", "ohľaduplnosť"],
  "zdvorilosť": ["prosím", "ďakujem", "pozdrav", "správanie"],
  "súkromie": ["osobné údaje", "tajomstvo", "dvere", "ochrana"],
  "bezpečnosť": ["ochrana", "riziko", "opatrnosť", "pravidlá"],
  "sloboda": ["voľba", "právo", "nezávislosť", "obmedzenie"],
  "rovnosť": ["spravodlivosť", "rovnaký", "právo", "šanca"],
  "pomoc": ["podpora", "ruka", "potreba", "ochota"],
  "solidarita": ["podpora", "spoločne", "pomoc", "ľudia"],
  "dobrovoľníctvo": ["pomoc", "bez odmeny", "organizácia", "čas"],
  "charita": ["dar", "pomoc", "zbierka", "potreba"],
  "darovanie": ["dar", "odovzdať", "pomoc", "peniaze"],
  "zbierka": ["prispieť", "peniaze", "dar", "organizácia"],
  "verejná doprava": ["autobus", "lístok", "zastávka", "cestujúci"],
  "dopravná nehoda": ["auto", "polícia", "zranenie", "havária"],
  "stratený predmet": ["hľadať", "nález", "vlastník", "vrátiť"],
  "nález": ["objaviť", "stratený", "vrátiť", "vlastník"],
  "rad v obchode": ["čakať", "pokladňa", "zákazník", "nákup"],
  "platba kartou": ["terminál", "banka", "pin", "nákup"],
  "hotovosť": ["mince", "bankovky", "peňaženka", "platiť"],
  "doklad totožnosti": ["občiansky preukaz", "meno", "fotografia", "úrad"],
  "volebné právo": ["hlasovať", "občan", "voľby", "politika"],
  "mestské pravidlo": ["nariadenie", "radnica", "poriadok", "pokuta"],
  "susedský spor": ["hádka", "byt", "dohoda", "hluk"],
  "hlučná oslava": ["hudba", "susedia", "noc", "párty"],
  "parkovacie miesto": ["auto", "stáť", "značka", "garáž"],
  "verejné ospravedlnenie": ["prepáč", "chyba", "ľútosť", "priznať"],
};

const animalClues = {
  "hroch": ["Afrika", "rieka", "veľký", "papuľa"],
  "lama": ["Andy", "vlna", "pľuť", "stádo"],
  "suriikata": ["púšť", "nora", "stáť", "Afrika"],
  "plameniak": ["ružový", "dlhé nohy", "jazero", "vták"],
  "mýval": ["maska", "chvost", "noc", "les"],
};

const leisureClues = {
  "rybárčenie": ["udica", "úlovok", "háčik", "jazero"],
  "zbieranie húb": ["les", "košík", "klobúk", "jeseň"],
  "pozorovanie vtákov": ["ďalekohľad", "krídla", "hniezdo", "ticho"],
  "venčenie psa": ["vodítko", "park", "labka", "prechádzka"],
  "opekanie": ["oheň", "špekáčik", "palica", "dym"],
  "návšteva výstavy": ["galéria", "obrazy", "vstupenka", "kurátor"],
  "sledovanie filmu": ["kino", "obrazovka", "popcorn", "dej"],
};

const musicClues = {
  "orchester": ["dirigent", "nástroje", "koncert", "sála"],
  "husle": ["struny", "sláčik", "orchester", "brada"],
  "bubon": ["paličky", "bicie", "rytmus", "koža"],
  "flauta": ["dych", "dierky", "nástroj", "melódia"],
  "trúbka": ["dych", "kov", "náustok", "jazz"],
  "akordeón": ["mech", "klávesy", "ťahať", "folklór"],
  "harmonika": ["mech", "ťahať", "ľudová", "nástroj"],
  "violončelo": ["sláčik", "struny", "orchester", "veľké"],
  "kontrabas": ["struny", "jazz", "orchester", "najnižší"],
  "tamburína": ["cinkanie", "bicie", "kruh", "držať"],
  "saxofón": ["jazz", "kov", "dych", "náustok"],
  "klarinet": ["dych", "plátok", "orchester", "čierny"],
  "organ": ["kostol", "píšťaly", "klávesy", "chrám"],
  "noty": ["osnova", "partitúra", "čítať", "značky"],
  "hudobný album": ["skladby", "nahrávka", "spevák", "prehrávač"],
  "singel": ["pieseň", "spevák", "nahrávka", "hit"],
  "rytmus": ["tempo", "bicie", "takt", "pohyb"],
  "hudobný žáner": ["rock", "pop", "džez", "štýl"],
  "džez": ["improvizácia", "saxofón", "klub", "trumpeta"],
  "rock": ["gitara", "kapela", "bicie", "koncert"],
  "pop": ["hit", "rádio", "spevák", "refrén"],
  "operný spev": ["divadlo", "ária", "soprán", "javisko"],
  "zbor": ["spievať", "viac hlasov", "dirigent", "kostol"],
  "skladateľ": ["noty", "autor", "melódia", "partitúra"],
};

const programmingClues = {
  "programovací jazyk": ["syntax", "príkaz", "premenná", "kompilátor"],
  "mobilná aplikácia": ["ikona", "displej", "stiahnuť", "obchod"],
  "databáza": ["záznamy", "tabuľky", "údaje", "dotaz"],
  "algoritmus": ["postup", "kroky", "výpočet", "logika"],
  "chyba v programe": ["bug", "pád", "hlásenie", "odstrániť"],
  "oprava chyby": ["debugovanie", "programátor", "test", "aktualizácia"],
  "verzia programu": ["vydanie", "nová", "aktualizácia", "číslo"],
  "zálohovanie dát": ["súbory", "uložiť", "obnoviť", "disk"],
  "šifrovanie": ["heslo", "tajné", "ochrana", "kľúč"],
  "kybernetická bezpečnosť": ["hacker", "ochrana", "útok", "heslo"],
  "antivírus": ["malvér", "skenovať", "ochrana", "počítač"],
  "firewall": ["sieť", "blokovať", "ochrana", "pravidlá"],
  "automatizácia": ["robot", "samočinne", "proces", "opakovať"],
  "umelá inteligencia": ["model", "učenie", "dáta", "robot"],
  "virtuálna realita": ["okuliare", "simulácia", "hra", "svet"],
  "rozšírená realita": ["kamera", "mobil", "obraz", "vrstva"],
  "digitálna mapa": ["GPS", "trasa", "poloha", "navigácia"],
  "navigačný systém": ["GPS", "satelit", "trasa", "auto"],
  "satelitné snímky": ["vesmír", "zemský povrch", "obraz", "mapa"],
  "bezkontaktná platba": ["karta", "terminál", "priložiť", "banka"],
  "samoobslužná pokladňa": ["obchod", "skenovať", "tovar", "platiť"],
  "inteligentná domácnosť": ["ovládať", "mobil", "svetlo", "automaticky"],
};

const hardwareClues = {
  "batériový článok": ["nabíjanie", "napätie", "kapacita", "akumulátor"],
  "adaptér": ["konektor", "zásuvka", "napätie", "nabíjať"],
  "spínač svetla": ["vypínač", "žiarovka", "stena", "zapnúť"],
  "poistková skrinka": ["istič", "dom", "prúd", "výpadok"],
  "solárny panel": ["slnko", "strecha", "fotovoltika", "prúd"],
  "kuchynský robot": ["miešať", "nože", "misa", "varenie"],
  "digitálna váha": ["kilogram", "merať", "displej", "hmotnosť"],
  "elektronický teplomer": ["horúčka", "stupne", "merať", "telo"],
  "detektor dymu": ["požiar", "alarm", "strop", "siréna"],
  "domový zvonček": ["dvere", "návšteva", "zazvoniť", "tlačidlo"],
  "videovrátnik": ["dvere", "kamera", "návšteva", "obraz"],
  "alarm": ["siréna", "zlodej", "ochrana", "zapnúť"],
  "pohybový senzor": ["detekovať", "svetlo", "chodba", "signál"],
  "elektronický zámok": ["dvere", "kód", "odomknúť", "čip"],
  "diaľkové ovládanie": ["tlačidlá", "televízor", "batérie", "prepínať"],
  "indukčná varná doska": ["hrniec", "variť", "kuchyňa", "teplo"],
  "mikrovlnná rúra": ["zohriať", "jedlo", "minúty", "kuchyňa"],
  "elektrický holiaci strojček": ["brada", "tvár", "holenie", "čepeľ"],
  "sušič vlasov": ["fén", "teplý vzduch", "kúpeľňa", "vlasy"],
  "čistička vzduchu": ["filter", "prach", "izba", "dýchať"],
  "inteligentná zásuvka": ["prúd", "mobil", "zapnúť", "dom"],
  "domáca bezpečnostná kamera": ["záznam", "dvere", "sledovať", "ochrana"],
  "laserová tlačiareň": ["papier", "toner", "dokument", "vytlačiť"],
  "3D tlačiareň": ["model", "plast", "vrstvy", "vytlačiť"],
  "bluetooth reproduktor": ["hudba", "bezdrôtový", "spojiť", "zvuk"],
};

const data = JSON.parse(await readFile(databasePath, "utf8"));
const changes = [];
for (const card of data.cards) {
  const before = { word: card.word, forbidden: [...card.forbidden] };
  let reason = "";
  const target = card.word.toLocaleLowerCase("sk");
  if (target === "poz­emný hokej") {
    card.word = "pozemný hokej";
    card.forbidden = sportClues[card.word];
    reason = "opravený chybný neviditeľný znak a všeobecné zákazy";
  } else if (target === "internetový kalendár") {
    card.word = "diár";
    card.forbidden = ["dátum", "zápisník", "termín", "plánovať"];
    reason = "neprirodzený technický cieľ nahradený bežným slovenským pojmom";
  } else if (same(card.forbidden, ["cesta", "orientácia", "presun", "návšteva"])) {
    card.forbidden = locationClues[target] ?? ["doprava", "mapa", "turista", "značenie"];
    reason = "všeobecné zákazy nahradené konkrétnymi cestovateľskými asociáciami";
  } else if (same(card.forbidden, ["miesto", "cesta", "návšteva", "okolie"])) {
    card.forbidden = locationClues[target] ?? ["budova", "vstup", "návštevník", "orientácia"];
    reason = "všeobecné zákazy nahradené konkrétnymi miestnymi asociáciami";
  } else if (same(card.forbidden, ["mesto", "budova", "ľudia", "okolie"])) {
    card.forbidden = locationClues[target] ?? ["námestie", "vstup", "návštevník", "podujatie"];
    reason = "všeobecné zákazy nahradené konkrétnymi mestskými asociáciami";
  } else if (same(card.forbidden, ["šport", "pohyb", "tréning", "výkon"])) {
    card.forbidden = sportClues[target] ?? ["súťaž", "ihrisko", "pravidlá", "hráč"];
    reason = "všeobecné športové zákazy nahradené konkrétnymi hernými asociáciami";
  } else if (same(card.forbidden, ["činnosť", "pohyb", "čas", "zábava"])) {
    card.forbidden = sportClues[target] ?? ["ruky", "náradie", "postup", "voľný čas"];
    reason = "všeobecné aktivizačné zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["hra", "pravidlá", "hráči", "zábava"])) {
    card.forbidden = sportClues[target] ?? ["súper", "kolo", "body", "stôl"];
    reason = "všeobecné herné zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["tvorba", "publikum", "dielo", "vystúpenie"])) {
    card.forbidden = /film|seriál|scenár|kino|režisér|herec/.test(target)
      ? ["kamera", "príbeh", "obrazovka", "premiéra"]
      : /hudb|koncert|spev|nástroj|orchester|melódi|rytm/.test(target)
        ? ["hudba", "zvuk", "pódium", "poslucháč"]
        : /kniha|román|báseň|čít|autor|verš/.test(target)
          ? ["text", "strany", "spisovateľ", "čítanie"]
          : ["umenie", "autor", "výstava", "galéria"];
    reason = "všeobecné kultúrne zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["umenie", "tvorba", "výstava", "autor"])) {
    card.forbidden = /múzejný|vernisáž|exponát|vitrín/.test(target)
      ? ["múzeum", "história", "kurátor", "návštevník"]
      : /rám/.test(target)
        ? ["plátno", "galéria", "maliar", "stena"]
        : /portrét|zátišie|krajinka|akvarel|olejomaľba|plátno|paleta/.test(target)
          ? ["farby", "štetec", "maliar", "obraz"]
        : ["galéria", "dizajn", "výstava", "tvar"];
    reason = "všeobecné výtvarné zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["zariadenie", "digitálny svet", "funkcia", "pripojenie"])) {
    card.forbidden = /aplik|kalendár|diár|nastaven|režim|záloh|heslo|účet/.test(target)
      ? ["mobil", "ikona", "nastavenia", "stiahnuť"]
      : /internet|online|web|cloud|server|router|modem|prihlás|sieť/.test(target)
        ? ["internet", "prehliadač", "účet", "prihlásenie"]
        : ["elektronika", "batéria", "ovládanie", "kábel"];
    reason = "všeobecné technologické zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["internet", "sieť", "pripojenie", "online"])) {
    card.forbidden = technologyClues[target] ?? ["prehliadač", "adresa", "prihlásenie", "súbor"];
    reason = "všeobecné internetové zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["aplikácia", "program", "funkcia", "mobil"])) {
    card.forbidden = technologyClues[target] ?? ["ikona", "displej", "nastaviť", "otvoriť"];
    reason = "všeobecné aplikačné zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["médiá", "obsah", "správa", "publikum"])) {
    card.forbidden = mediaClues[target] ?? (/článok|portál|titulok|redakcia|report/.test(target)
      ? ["novinár", "čítanie", "web", "titulok"]
      : ["kanál", "zdieľať", "reklama", "sledovať"]);
    reason = "všeobecné mediálne zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["príroda", "prostredie", "Zem", "život"])) {
    card.forbidden = /dub|breza|smrek|borovic|javor|vŕba|lipa|buk|kvet|tráva|ker|papraď|mach|lišajník|púpava|tulipán|narcis|levanduľa|pivóni|fialka|orchide/.test(target)
      ? ["rastlina", "pôda", "list", "rásť"]
      : /mrhol|prehán|búrka|vietor|hmla|mráz|sneh|oblak|horúč|sucho|krup|námraz/.test(target)
        ? ["počasie", "obloha", "predpoveď", "vzduch"]
        : ["krajina", "biotop", "potrava", "mláďa"];
    reason = "všeobecné prírodné zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["rastlina", "príroda", "zem", "rast"])) {
    card.forbidden = ["pôda", "list", "koreň", "pestovať"];
    reason = "všeobecné rastlinné zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["počasie", "obloha", "vzduch", "príroda"])) {
    card.forbidden = ["predpoveď", "teplota", "mrak", "vietor"];
    reason = "všeobecné poveternostné zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["krajina", "príroda", "terén", "voda"])) {
    card.forbidden = ["mapa", "výhľad", "výlet", "geografia"];
    reason = "všeobecné krajinné zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["Zem", "svet", "krajina", "ľudia"])) {
    card.forbidden = geographyClues[target] ?? ["mapa", "štát", "hranica", "svetadiel"];
    reason = "všeobecné zemepisné zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["zviera", "príroda", "život", "prostredie"])) {
    card.forbidden = ["biotop", "potrava", "mláďa", "chov"];
    reason = "všeobecné zoologické zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["situácia", "ľudia", "rozhovor", "každodennosť"])) {
    card.forbidden = /radosť|smútok|hanba|závisť|žiarlivosť|sklamanie|nadšenie|úľava|napätie|neistota|spokojnosť|osamelosť|vďačnosť|hrdosť|krivda|zúfalstvo|zvedavosť|pokoj|nervozita|rozpaky|nádej|pochybnosť|obdiv|odvaha|trpezlivosť|súcit|nostalgia/.test(target)
      ? ["pocit", "nálada", "reakcia", "emócia"]
      : ["vzťah", "komunikácia", "správanie", "dohoda"];
    reason = "všeobecné situačné zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["emócia", "pocit", "nálada", "človek"])) {
    card.forbidden = ["prežívanie", "reakcia", "myšlienky", "správanie"];
    reason = "všeobecné emočné zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["ľudia", "rozhovor", "vzťah", "situácia"])) {
    card.forbidden = situationClues[target] ?? ["komunikácia", "správanie", "dohoda", "stretnutie"];
    reason = "všeobecné vzťahové zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["čas", "život", "zmena", "plán"])) {
    card.forbidden = situationClues[target] ?? ["termín", "rozhodnutie", "budúcnosť", "spomienka"];
    reason = "všeobecné časové zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["práca", "úloha", "povinnosť", "výsledok"])) {
    card.forbidden = workClues[target] ?? ["kolega", "termín", "porada", "zodpovednosť"];
    reason = "všeobecné pracovné zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["rodina", "domov", "blízki", "každý deň"])) {
    card.forbidden = familyClues[target] ?? ["spolu", "byt", "rodičia", "návšteva"];
    reason = "všeobecné rodinné zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["spoločnosť", "pravidlá", "ľudia", "verejnosť"])) {
    card.forbidden = socialClues[target] ?? ["rešpekt", "zodpovednosť", "komunita", "správanie"];
    reason = "všeobecné spoločenské zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["zviera", "príroda", "pohyb", "prostredie"])) {
    card.forbidden = animalClues[target] ?? ["biotop", "potrava", "mláďa", "stádo"];
    reason = "všeobecné zvieracie zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["voľný čas", "príroda", "výlet", "zážitok"])) {
    card.forbidden = leisureClues[target] ?? ["záľuba", "pomôcky", "postup", "voľno"],
    reason = "všeobecné voľnočasové zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["hudba", "zvuk", "melódia", "vystúpenie"])) {
    card.forbidden = musicClues[target] ?? ["nástroj", "koncert", "noty", "spevák"];
    reason = "všeobecné hudobné zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["kód", "vývoj", "softvér", "funkcia"])) {
    card.forbidden = programmingClues[target] ?? ["počítač", "testovanie", "nastavenie", "spustiť"];
    reason = "všeobecné programátorské zákazy nahradené konkrétnymi asociáciami";
  } else if (same(card.forbidden, ["elektrina", "zariadenie", "kábel", "energia"])) {
    card.forbidden = hardwareClues[target] ?? ["prúd", "ovládanie", "dom", "zapnúť"];
    reason = "všeobecné technické zákazy nahradené konkrétnymi asociáciami";
  }
  card.forbidden = choose(card.word, card.forbidden);
  if (card.forbidden.length !== 4) throw new Error(`Karta ${card.id} nemá po úprave štyri platné zakázané slová.`);
  if (card.word !== before.word || card.forbidden.some((word, index) => word !== before.forbidden[index])) {
    changes.push({ id: card.id, category: card.category, before, after: { word: card.word, forbidden: card.forbidden }, reason });
  }
}

await writeFile(databasePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
await writeFile(fixLogPath, `${JSON.stringify({ cardsReviewed: data.cards.length, cardsCorrected: changes.length, changes }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ cardsReviewed: data.cards.length, cardsCorrected: changes.length }, null, 2));
