import { shuffle } from "./teamBattle";
import tabooCardDatabase from "./tabooCardsSk.json";
import {
  GENERATED_FORBIDDEN_CARDS,
  GENERATED_LETTER_CATEGORIES,
} from "./expandedContent";

export interface ForbiddenCard {
  word: string;
  forbidden: [string, string, string, string];
}

const CORE_FORBIDDEN_CARDS: ForbiddenCard[] = [
  ["Pizza", ["jedlo", "syr", "Taliansko", "okrúhla"]],
  ["Mobil", ["telefón", "volať", "displej", "aplikácia"]],
  ["Futbal", ["lopta", "gól", "hráč", "ihrisko"]],
  ["Škola", ["žiak", "učiteľ", "trieda", "učiť"]],
  ["Dovolenka", ["cestovať", "hotel", "more", "oddych"]],
  ["Pes", ["zviera", "štekať", "labka", "mačka"]],
  ["Káva", ["nápoj", "šálka", "kofeín", "ráno"]],
  ["Auto", ["jazdiť", "kolesá", "motor", "vodič"]],
  ["Vianoce", ["stromček", "darček", "Ježiško", "december"]],
  ["Nemocnica", ["lekár", "pacient", "choroba", "operácia"]],
  ["Internet", ["wifi", "online", "web", "počítač"]],
  ["Zmrzlina", ["studená", "leto", "kornútok", "sladká"]],
  ["Kino", ["film", "plátno", "popcorn", "lístok"]],
  ["Hokej", ["ľad", "puk", "hokejka", "gól"]],
  ["Chladnička", ["studená", "jedlo", "kuchyňa", "mraznička"]],
  ["Narodeniny", ["torta", "darček", "sviečky", "oslavovať"]],
  ["Policajt", ["zákon", "uniforma", "zatknúť", "polícia"]],
  ["Lietadlo", ["lietať", "pilot", "letisko", "krídla"]],
  ["Dážď", ["voda", "oblak", "dáždnik", "mokro"]],
  ["Televízor", ["obrazovka", "pozerať", "program", "ovládač"]],
  ["Čokoláda", ["sladká", "kakao", "tabuľka", "hnedá"]],
  ["Kniha", ["čítať", "strany", "autor", "príbeh"]],
  ["Bicykel", ["kolesá", "pedále", "jazdiť", "prilba"]],
  ["Reštaurácia", ["jesť", "čašník", "menu", "kuchár"]],
  ["Svadba", ["nevesta", "ženích", "prsteň", "manželstvo"]],
  ["Počítač", ["klávesnica", "monitor", "myš", "program"]],
  ["Pláž", ["piesok", "more", "slnko", "plavky"]],
  ["Gitara", ["hudba", "struny", "hrať", "nástroj"]],
  ["Lekár", ["pacient", "liečiť", "nemocnica", "choroba"]],
  ["Kuchyňa", ["variť", "jedlo", "sporák", "miestnosť"]],
  ["Zubár", ["zuby", "vŕtať", "bolesť", "ambulancia"]],
  ["Instagram", ["sociálna sieť", "fotka", "príspevok", "sledovať"]],
  ["Mačka", ["zviera", "mňaukať", "fúzy", "pes"]],
  ["Peniaze", ["platiť", "euro", "banka", "bohatý"]],
  ["Raketa", ["vesmír", "letieť", "Mesiac", "astronaut"]],
  ["Supermarket", ["nákup", "vozík", "pokladňa", "potraviny"]],
  ["Divadlo", ["herec", "javisko", "predstavenie", "opona"]],
  ["Slnko", ["svietiť", "teplo", "obloha", "deň"]],
  ["Vlak", ["koľajnice", "stanica", "rušeň", "cestovať"]],
  ["Fotografia", ["fotoaparát", "obrázok", "odfotiť", "album"]],
  ["Klobúk", ["hlava", "nosiť", "čiapka", "okraj"]],
  ["Vysávač", ["upratovať", "prach", "koberec", "hluk"]],
  ["Posteľ", ["spať", "perina", "vankúš", "spálňa"]],
  ["Dinosaur", ["vyhynutý", "pravek", "jašter", "fosília"]],
  ["Kľúč", ["dvere", "odomknúť", "zámok", "kov"]],
  ["Čas", ["hodiny", "minúta", "sekunda", "meškať"]],
  ["Snehuliak", ["sneh", "zima", "mrkva", "guľa"]],
  ["Kaderník", ["vlasy", "strih", "nožnice", "salón"]],
  ["Mapa", ["cesta", "krajina", "orientácia", "navigácia"]],
  ["Parfém", ["vôňa", "flakón", "striekať", "voňať"]],
  ["Basketbal", ["kôš", "lopta", "driblovať", "ihrisko"]],
  ["Palacinka", ["cesto", "panvica", "sladká", "džem"]],
  ["Robot", ["stroj", "človek", "program", "automat"]],
  ["Hasič", ["oheň", "hadica", "požiar", "uniforma"]],
  ["Kufor", ["cestovať", "batožina", "oblečenie", "letisko"]],
  ["Mikrofón", ["spievať", "hlas", "pódium", "zvuk"]],
  ["Bábätko", ["dieťa", "plakať", "plienka", "kočík"]],
  ["Hory", ["vrchol", "turistika", "vysoké", "Tatry"]],
  ["Šach", ["figúrky", "kráľ", "šachovnica", "mat"]],
  ["Vankúš", ["spať", "hlava", "posteľ", "mäkký"]],
  ["Semafor", ["červená", "zelená", "cesta", "autá"]],
  ["Kaktus", ["rastlina", "pichliače", "púšť", "voda"]],
  ["Lopata", ["kopať", "zem", "náradie", "jama"]],
  ["Kalendár", ["dátum", "mesiac", "rok", "deň"]],
  ["Včela", ["med", "hmyz", "úľ", "žihadlo"]],
  ["Kráľ", ["koruna", "vládca", "hrad", "kráľovná"]],
  ["Okuliare", ["oči", "vidieť", "rám", "šošovky"]],
  ["Práčka", ["oblečenie", "prať", "voda", "bubon"]],
  ["Torta", ["narodeniny", "sviečky", "sladká", "koláč"]],
  ["Budík", ["ráno", "zvoniť", "zobudiť", "hodiny"]],
  ["Ostrov", ["more", "zem", "voda", "pláž"]],
  ["Duch", ["strašiť", "biely", "neviditeľný", "zámok"]],
  ["Výťah", ["poschodie", "hore", "dole", "tlačidlo"]],
  ["Farmár", ["pole", "traktor", "zvieratá", "úroda"]],
  ["Kamera", ["video", "natáčať", "film", "objektív"]],
  ["Mesiac", ["noc", "obloha", "satelit", "svietiť"]],
  ["Medveď", ["zviera", "les", "med", "zimný spánok"]],
  ["Dvere", ["otvoriť", "kľučka", "miestnosť", "zámok"]],
  ["Hodinky", ["ruka", "čas", "nosiť", "remienok"]],
  ["Stan", ["kempovať", "spať", "látka", "príroda"]],
].map(([word, forbidden]) => ({ word, forbidden })) as ForbiddenCard[];

const EXTRA_FORBIDDEN_LIBRARY = `
Hamburger|žemľa|mäso|fastfood|jesť
Špagety|cestoviny|Taliansko|omáčka|vidlička
Hranolky|zemiaky|vyprážané|kečup|fastfood
Polievka|lyžica|tanier|teplá|variť
Chlieb|pekáreň|múka|krajec|maslo
Syr|mlieko|žltý|diera|eidam
Jablko|ovocie|strom|červené|zahryznúť
Banán|žltý|ovocie|šupka|opica
Jahoda|červená|ovocie|semienka|šľahačka
Melón|leto|zelený|červený|jadierka
Citrón|žltý|kyslý|ovocie|čaj
Pomaranč|oranžový|ovocie|džús|šupka
Mrkva|oranžová|zelenina|zajac|oči
Zemiak|hranolky|zem|zelenina|kaša
Cibuľa|plakať|krájať|zelenina|šupka
Cesnak|vôňa|strúčik|kuchyňa|upír
Vajce|sliepka|škrupina|žĺtok|raňajky
Maslo|chlieb|mlieko|natrieť|žlté
Med|včela|sladký|úľ|pohár
Soľ|biela|korenie|slaná|kuchyňa
Cukor|sladký|biely|káva|kocka
Čaj|nápoj|horúci|vrecúško|kanvica
Pivo|alkohol|pena|krčma|chmeľ
Víno|hrozno|fľaša|alkohol|pohár
Limonáda|nápoj|sladká|citrón|bublinky
Sendvič|chlieb|šunka|desiata|dva
Kebab|mäso|placka|Turecko|stánok
Sushi|Japonsko|ryža|ryba|paličky
Popcorn|kino|kukurica|slaný|pukať
Croissant|Francúzsko|pečivo|maslo|raňajky
Donut|šiška|diera|sladký|poleva
Keksík|sladký|chrumkavý|čaj|sušienka
Žuvačka|žuť|bublina|ústa|lepkavá
Kečup|paradajka|červený|hranolky|omáčka
Horčica|žltá|párok|omáčka|štipľavá
Kôň|zviera|jazdiť|hriva|stajňa
Krava|mlieko|zviera|farma|múkať
Prasa|ružové|zviera|farma|blato
Sliepka|vajce|vták|kurník|kotkodákať
Ovca|vlna|zviera|pastier|békať
Koza|rohy|mlieko|zviera|farma
Lev|kráľ|zviera|hriva|Afrika
Tiger|pruhy|mačka|zviera|džungľa
Žirafa|krk|vysoká|Afrika|škvrny
Slon|chobot|veľký|Afrika|kly
Opica|banán|zviera|strom|džungľa
Tučniak|ľad|čiernobiely|vták|Antarktída
Delfín|more|plávať|inteligentný|skákať
Žralok|more|zuby|ryba|nebezpečný
Veľryba|more|obrovská|cicavec|voda
Krokodíl|zuby|rieka|plaz|zelený
Had|plaz|syčať|jed|bez nôh
Žaba|zelená|skákať|rybník|kvákať
Korytnačka|pancier|pomalá|plaz|more
Pavúk|osem|sieť|hmyz|nohy
Motýľ|krídla|hmyz|farebný|húsenica
Komár|štípať|hmyz|krv|bzučať
Mravec|malý|hmyz|mravenisko|pracovitý
Lienka|červená|bodky|hmyz|sedem
Sova|noc|vták|múdra|húkať
Orol|vták|lietať|zobák|hory
Papagáj|farebný|vták|rozprávať|klietka
Pštros|vták|bežať|nelieta|veľký
Klokan|Austrália|vak|skákať|zviera
Panda|Čína|bambus|čiernobiela|medveď
Vlk|les|svorka|zavýjať|pes
Líška|ryšavá|les|prefíkaná|chvost
Jeleň|parohy|les|zviera|srna
Ježko|pichliače|malý|les|klbko
Zajac|uši|mrkva|skákať|Veľká noc
Myš|malá|syr|chvost|počítač
Škrečok|klietka|koliesko|malý|hlodavec
Akvarijná ryba|voda|sklo|plávať|kŕmiť
Učiteľ|škola|žiak|tabuľa|učiť
Kuchár|variť|jedlo|reštaurácia|zástera
Čašník|reštaurácia|tácka|objednávka|sprepitné
Pekár|chlieb|pec|múka|pekáreň
Pilot|lietadlo|lietať|kokpit|letisko
Vodič autobusu|šoférovať|zastávka|cestujúci|lístok
Mechanik|auto|opravovať|motor|dielňa
Elektrikár|prúd|kábel|zásuvka|oprava
Inštalatér|voda|potrubie|kohútik|oprava
Maliar|farba|štetec|obraz|plátno
Fotograf|fotoaparát|obrázok|fotiť|objektív
Novinár|správy|článok|rozhovor|noviny
Herec|film|divadlo|rola|kamera
Spevák|hudba|mikrofón|pieseň|koncert
Tanečník|hudba|pohyb|parket|tanec
Poštár|list|balík|doručiť|pošta
Predavač|obchod|zákazník|pokladňa|tovar
Právnik|súd|zákon|klient|obhajovať
Sudca|súd|rozsudok|zákon|kladivko
Vojak|armáda|uniforma|zbraň|vojna
Záchranár|sanitka|pomoc|nehoda|pacient
Veterinár|zviera|lekár|ambulancia|liečiť
Programátor|počítač|kód|aplikácia|softvér
Architekt|budova|plán|kresliť|dom
Knihovník|kniha|knižnica|čítať|ticho
Tréner|šport|cvičiť|tím|hráč
Rozhodca|zápas|píšťalka|pravidlá|karta
Astronaut|vesmír|raketa|Mesiac|skafander
Detektív|pátrať|zločin|stopa|polícia
Kúzelník|mágia|trik|klobúk|karta
Kominár|komín|čierny|strecha|šťastie
Záhradník|záhrada|rastlina|kosiť|lopata
Recepčný|hotel|kľúč|hosť|pult
Letisko|lietadlo|kufor|pas|odlet
Stanica|vlak|koľajnice|nástupište|cestovať
Autobusová zastávka|autobus|čakať|cestovný poriadok|lavička
Knižnica|knihy|čítať|ticho|požičať
Múzeum|história|výstava|obraz|exponát
Zoologická záhrada|zviera|klietka|návštevník|výbeh
Aquapark|voda|tobogan|bazén|plavky
Štadión|šport|fanúšik|tribúna|zápas
Posilňovňa|cvičiť|činka|svaly|tréning
Lekáreň|liek|recept|zdravie|tabletka
Banka|peniaze|účet|pôžička|trezor
Pošta|list|balík|známka|doručiť
Kostol|modliť|kňaz|veža|omša
Hrad|kráľ|veža|rytieri|história
Jaskyňa|tma|skala|netopier|podzemie
Les|strom|zviera|príroda|huby
Púšť|piesok|teplo|ťava|voda
Vodopád|voda|padať|rieka|skala
Jazero|voda|plávať|breh|ryby
Rieka|voda|tečie|most|breh
Park|strom|lavička|prechádzka|tráva
Ihrisko|deti|hrať|šmykľavka|hojdačka
Kancelária|práca|počítač|stôl|šéf
Továreň|výroba|stroj|robotník|komín
Garáž|auto|parkovať|dom|brána
Balkón|byt|vonku|zábradlie|kvety
Pivnica|podzemie|dom|tma|sklad
Podkrovie|strecha|dom|hore|prach
Kúpeľňa|sprcha|vaňa|umyť|uterák
Obývačka|gauč|televízor|izba|rodina
Spálňa|posteľ|spať|izba|skriňa
Chodba|dvere|miestnosť|prechádzať|vešiak
Strecha|dom|hore|komín|škridla
Okno|sklo|výhľad|otvoriť|záclona
Zrkadlo|odraz|pozerať|sklo|tvár
Gauč|sedieť|obývačka|mäkký|vankúš
Stolička|sedieť|nohy|stôl|nábytok
Stôl|nábytok|nohy|jesť|doska
Skriňa|oblečenie|dvere|nábytok|vešiak
Koberec|podlaha|mäkký|vysávať|izba
Lampa|svetlo|žiarovka|svietiť|stôl
Sviečka|oheň|vosk|knôt|svietiť
Uterák|osušiť|kúpeľňa|mokré|látka
Mydlo|umyť|ruky|pena|voda
Zubná kefka|zuby|pasta|kúpeľňa|čistiť
Hrebeň|vlasy|česať|zuby|kúpeľňa
Nožnice|strihať|papier|ostré|dve
Kladivo|klinec|náradie|udrieť|drevo
Skrutkovač|skrutka|náradie|otáčať|oprava
Rebrík|hore|stúpať|priečky|výška
Metla|zametať|čarodejnica|podlaha|upratovať
Vedro|voda|nádoba|rúčka|upratovať
Žehlička|oblečenie|horúca|žehliť|para
Rúra|piecť|kuchyňa|teplo|koláč
Mikrovlnka|ohriať|jedlo|kuchyňa|čas
Umývačka|riad|kuchyňa|voda|čistiť
Mixér|kuchyňa|miešať|ovocie|spotrebič
Hriankovač|chlieb|raňajky|opekať|kuchyňa
Kanvica|voda|čaj|variť|kuchyňa
Panvica|variť|olej|kuchyňa|rúčka
Hrniec|variť|polievka|pokrievka|kuchyňa
Lyžica|jesť|polievka|príbor|kov
Vidlička|jesť|zuby|príbor|kov
Nôž|rezať|ostrý|kuchyňa|čepeľ
Tanier|jedlo|okrúhly|riad|stôl
Pohár|piť|sklo|nápoj|stôl
Fľaša|piť|vrchnák|nápoj|sklo
Batoh|chrbát|škola|popruhy|veci
Peňaženka|peniaze|karty|vrecko|platiť
Dáždnik|dážď|mokro|otvoriť|rúčka
Slnečné okuliare|slnko|oči|leto|tmavé
Rukavice|ruky|zima|prsty|nosiť
Šál|krk|zima|oblečenie|teplý
Kabát|oblečenie|zima|teplý|bunda
Tenisky|topánky|šport|nohy|šnúrky
Ponožky|nohy|topánky|pár|oblečenie
Pyžamo|spať|oblečenie|noc|posteľ
Plavky|voda|pláž|bazén|oblečenie
Kravata|krk|oblek|muž|formálne
Prsteň|prst|šperk|svadba|kruh
Náhrdelník|krk|šperk|retiazka|nosiť
Náušnice|ucho|šperk|pár|nosiť
Rúž|pery|červený|kozmetika|maľovať
Šampón|vlasy|umyť|sprcha|pena
Fén|vlasy|sušiť|teplý|kúpeľňa
Notebook|počítač|prenosný|klávesnica|obrazovka
Tablet|displej|dotyk|mobil|aplikácia
Klávesnica|písať|počítač|tlačidlá|písmená
Monitor|obrazovka|počítač|stôl|pozerať
Tlačiareň|papier|atrament|počítač|tlačiť
Slúchadlá|uši|hudba|počúvať|kábel
Reproduktor|hudba|zvuk|hlasný|počúvať
Nabíjačka|batéria|kábel|elektrina|mobil
Heslo|tajné|prihlásiť|účet|písmená
Email|správa|internet|adresa|poslať
YouTube|video|internet|pozerať|kanál
TikTok|video|sociálna sieť|krátke|tanec
Videohra|hrať|počítač|ovládač|obrazovka
Diaľkový ovládač|televízor|tlačidlo|prepínať|batéria
Semafor pre chodcov|zelená|červená|cesta|prechádzať
Kolobežka|kolesá|jazdiť|riadidlá|odrážať
Motorka|dve kolesá|motor|prilba|jazdiť
Autobus|zastávka|cestujúci|vodič|lístok
Električka|koľajnice|mesto|zastávka|elektrina
Loď|voda|plávať|kapitán|more
Ponorka|pod vodou|more|plavidlo|periskop
Traktor|farma|pole|kolesá|farmár
Sanitka|záchranár|nemocnica|siréna|pacient
Hasičské auto|požiar|siréna|hadica|červené
Taxi|auto|vodič|platiť|odvoz
Most|rieka|spájať|prechádzať|konštrukcia
Tunel|pod zemou|tma|cesta|vlak
Križovatka|cesta|autá|odbočiť|semafor
Kruhový objazd|cesta|kruh|auto|výjazd
Tenis|raketa|loptička|sieť|kurt
Volejbal|lopta|sieť|ihrisko|tím
Plávanie|voda|bazén|plavky|šport
Lyžovanie|sneh|zima|svah|lyže
Snowboard|sneh|doska|svah|zima
Box|rukavice|ring|úder|boj
Golf|palica|loptička|jamka|tráva
Beh|nohy|rýchlo|šport|maratón
Gymnastika|cvičenie|šport|ohybnosť|náradie
Bowling|guľa|kolky|dráha|zhodiť
Biliard|stôl|gule|tágo|jamka
Šípky|terč|hádzať|body|krčma
Korčuľovanie|ľad|korčule|zima|šport
Surfovanie|vlna|more|doska|pláž
Horolezectvo|skala|lano|výška|liezť
Maratón|beh|dlhý|kilometre|preteky
Olympiáda|šport|medaila|kruhy|krajina
Medaila|víťaz|kov|šport|krk
Trofej|víťaz|pohár|súťaž|cena
Píšťalka|rozhodca|zvuk|fúkať|šport
Domáca úloha|škola|žiak|písať|učiteľ
Vysvedčenie|škola|známky|koniec roka|žiak
Prestávka|škola|zvonček|oddych|hodina
Skúška|učiť sa|škola|otázky|známka
Tabuľa|škola|písať|krieda|učiteľ
Zošit|papier|škola|písať|strany
Ceruzka|písať|guma|drevo|škola
Pero|písať|atrament|škola|papier
Pravítko|merať|čiara|škola|centimeter
Kalkulačka|počítať|čísla|matematika|tlačidlá
Glóbus|Zem|krajiny|guľa|škola
Slovník|slová|kniha|význam|jazyk
Abeceda|písmená|A|škola|poradie
Matematika|čísla|počítať|škola|príklad
Dejepis|história|škola|minulosť|rok
Geografia|mapa|krajina|škola|Zem
Telesná výchova|šport|škola|cvičiť|telocvičňa
Prázdniny|škola|voľno|leto|žiaci
Halloween|tekvica|strašidlo|október|kostým
Veľká noc|vajce|šibačka|zajac|jar
Silvester|polnoc|ohňostroj|nový rok|oslava
Valentín|láska|srdce|február|zaľúbení
Karneval|maska|kostým|zábava|tanec
Piknik|deka|jedlo|príroda|košík
Opekačka|oheň|špekáčik|les|palica
Grilovanie|mäso|oheň|záhrada|leto
Výlet|cestovať|príroda|batoh|voľno
Koncert|hudba|spevák|pódium|publikum
Festival|hudba|leto|pódium|dav
Diskotéka|tanec|hudba|noc|klub
Oslava|narodeniny|ľudia|zábava|darček
Prekvapenie|čakať|tajomstvo|darček|nečakané
Tajomstvo|nepovedať|skryté|vedieť|prezradiť
Sen|spať|noc|predstava|zobudiť
Nočná mora|sen|strach|spať|noc
Smiech|veselý|zvuk|vtip|ústa
Plač|slzy|smutný|oči|zvuk
Hnev|nahnevaný|emócia|kričať|zlý
Strach|báť sa|emócia|nebezpečenstvo|tma
Láska|srdce|zaľúbený|cit|partner
Šťastie|radosť|úsmev|emócia|spokojný
Nuda|nič|zábava|čas|nezaujímavé
Hlad|jedlo|jesť|brucho|chuť
Smäd|piť|voda|sucho|nápoj
Únava|spať|vyčerpaný|posteľ|energia
Klamstvo|pravda|nepravda|hovoriť|podvádzať
Vtip|smiech|zábavný|povedať|humor
Hádka|kričať|spor|dvaja|nahnevaný
Ospravedlnenie|prepáč|chyba|odpustiť|ľutovať
Súťaž|vyhrať|prehrať|hráči|cena
Pravidlo|dodržať|zákon|hra|zakázané
Front|čakať|ľudia|rad|obchod
Zápcha|autá|cesta|stáť|premávka
Meškanie|neskoro|čas|čakať|hodiny
Budúcnosť|zajtra|čas|neskôr|plán
Minulosť|včera|história|čas|spomienka
`.trim();

const EXTRA_FORBIDDEN_CARDS: ForbiddenCard[] = EXTRA_FORBIDDEN_LIBRARY.split("\n").map((line) => {
  const [word, ...forbidden] = line.split("|");
  return { word, forbidden: forbidden as ForbiddenCard["forbidden"] };
});

const MORE_FORBIDDEN_LIBRARY = `
Akumulátor|batéria|energia|nabíjať|auto
Anténa|signál|televízia|strecha|prijímať
Bankomat|peniaze|karta|vybrať|banka
Barometer|tlak|počasie|merať|prístroj
Baterka|svetlo|svietiť|tma|energia
Bludisko|cesta|stratiť|východ|chodba
Bumerang|hodiť|vrátiť|Austrália|drevo
Budík|ráno|zvoniť|zobudiť|hodiny
Cestovný pas|doklad|hranica|krajina|fotografia
Chameleón|farba|jašterica|meniť|zviera
Chobotnica|osem|more|chápadlá|zviera
Dalekohľad|pozerať|ďaleko|oči|priblížiť
Delfín|more|plávať|zviera|inteligentný
Detektív|pátrať|zločin|polícia|stopa
Diamant|drahokam|prsteň|tvrdý|lesk
Domino|kocky|bodky|hra|padať
Dron|lietať|kamera|ovládať|vrtuľa
Ďalekopis|správa|písať|stroj|odoslať
Eskimo|ľad|sever|iglu|zima
Fontána|voda|námestie|striekať|socha
Gejzír|voda|horúci|vytrysknúť|Island
Glóbus|Zem|mapa|guľa|krajiny
Gril|mäso|oheň|záhrada|piecť
Harfa|hudba|struny|nástroj|hrať
Hasiaci prístroj|oheň|pena|hasiť|červený
Hojdačka|ihrisko|sedieť|hojdať|deti
Hurikán|vietor|búrka|zničiť|oceán
Iglu|sneh|dom|ľad|sever
Jaskyňa|skala|tma|podzemie|netopier
Kaktus|pichliače|púšť|rastlina|voda
Kaleidoskop|farby|pozerať|vzory|trubica
Kalkulačka|počítať|čísla|matematika|tlačidlá
Kamera|filmovať|video|objektív|záznam
Kapitán|loď|veliteľ|more|posádka
Karavan|cestovať|bývať|auto|dovolenka
Katedrála|kostol|veža|viera|stavba
Kompas|sever|smer|ihla|orientácia
Kotva|loď|more|reťaz|zastaviť
Kráter|Mesiac|diera|sopka|meteorit
Križovatka|cesta|semafor|odbočiť|autá
Kufor|cestovať|batožina|oblečenie|kolieska
Láva|sopka|horúca|červená|tečie
Maják|more|loď|svetlo|pobrežie
Mapa|cesta|krajina|orientácia|papier
Mikroskop|malé|vedec|pozerať|laboratórium
Mlyn|múka|obilie|vietor|koleso
Mrakodrap|budova|vysoký|mesto|poschodia
Navigácia|mapa|cesta|GPS|smer
Oáza|púšť|voda|palma|oddych
Padák|skákať|lietadlo|vzduch|bezpečnosť
Pavučina|pavúk|sieť|vlákno|chytiť
Periskop|ponorka|pozerať|more|hladina
Pieskové hodiny|čas|piesok|sklo|presýpať
Pirátska loď|more|poklad|kapitán|vlajka
Ponorka|more|pod vodou|loď|periskop
Prilba|hlava|ochrana|motorka|bezpečnosť
Rakva|pohreb|mŕtvy|drevo|hrob
Robot|stroj|program|človek|kov
Rozhľadňa|výhľad|veža|kopec|pozerať
Satelit|vesmír|obežná dráha|signál|Zem
Skafander|vesmír|astronaut|oblečenie|kyslík
Skleník|rastliny|sklo|teplo|záhrada
Skúter|motorka|dve kolesá|jazdiť|helma
Sopka|láva|hora|výbuch|dym
Stetoskop|lekár|srdce|počúvať|nemocnica
Surf|vlna|doska|more|jazdiť
Šach|kráľ|figúrky|doska|mat
Šarkan|vietor|lietať|šnúra|papier
Teleskop|hviezdy|vesmír|pozerať|ďaleko
Termoska|nápoj|teplý|fľaša|udržať
Tobogan|voda|šmýkačka|bazén|zábava
Tornádo|vietor|lievik|búrka|točiť
Trampolína|skákať|sieť|záhrada|pružina
Trezor|peniaze|heslo|zamknúť|banka
Tunel|cesta|pod zemou|tma|vlak
Váhy|hmotnosť|merať|kilogram|stáť
Veterník|vietor|točiť|hračka|lopatky
Vodopád|voda|rieka|padať|skala
Vrtuľa|lietadlo|točiť|vzduch|motor
Výťah|poschodie|hore|dole|budova
Záchranné koleso|voda|plávať|loď|pomoc
Zips|oblečenie|otvoriť|zavrieť|zuby
Žeriav|stavba|zdvíhať|stroj|vysoký
Žonglér|cirkus|loptičky|hádzať|chytať
`.trim();

const MORE_FORBIDDEN_CARDS: ForbiddenCard[] = MORE_FORBIDDEN_LIBRARY.split("\n").map((line) => {
  const [word, ...forbidden] = line.split("|");
  return { word, forbidden: forbidden as ForbiddenCard["forbidden"] };
});

const LEGACY_FORBIDDEN_CARDS: ForbiddenCard[] = Array.from(new Map([
  ...CORE_FORBIDDEN_CARDS,
  ...EXTRA_FORBIDDEN_CARDS,
  ...MORE_FORBIDDEN_CARDS,
  ...GENERATED_FORBIDDEN_CARDS,
].map((card) => [card.word.toLocaleLowerCase("sk"), card])).values()).slice(0, 2000);

export const FORBIDDEN_CARDS: ForbiddenCard[] = tabooCardDatabase.cards.map(({ word, forbidden }) => ({
  word,
  forbidden: forbidden as ForbiddenCard["forbidden"],
}));

export interface SongCard {
  title: string;
  artist: string;
}

const SONG_LIBRARY = `
V dolinách|Karol Duchoň
Čardáš dvoch sŕdc|Karol Duchoň
Mám ťa rád|Karol Duchoň
Smútok krásnych dievčat|Karol Duchoň
Po schodoch|Richard Müller
Tlaková níž|Richard Müller
Nebude to ľahké|Richard Müller
Baroko|Richard Müller
Srdce jako kníže Rohan|Richard Müller
Voda, čo ma drží nad vodou|Elán
Nie sme zlí|Elán
Zaľúbil sa chlapec|Elán
Kaskadér|Elán
Láska moja|Elán
Stužková|Elán
Čaba, neblázni|Elán
Vymyslená|Elán
Kráľovná bielych tenisiek|Elán
Reklama na ticho|Team
Držím ti miesto|Team
Malá nočná búrka|Team
Lietam v tom tiež|Team
Mám na teba chuť|Team
Atlantída|Miroslav Žbirka
Biely kvet|Miroslav Žbirka
22 dní|Miroslav Žbirka
Balada o poľných vtákoch|Miroslav Žbirka
Len s ňou|Miroslav Žbirka
Vyznanie|Marika Gombitová
Koloseum|Marika Gombitová
Študentská láska|Marika Gombitová
Úsmev|Modus
Dievčatá|Modus
Veľký sen mora|Modus
Čerešne|Hana Hegerová
Levandulová|Hana Hegerová
Mesto snov|Katarína Knechtová
Spomaľ|Peha
Za tebou|Peha
Načo pôjdem domov|Katarína Knechtová
Horehronie|Kristína
Navždy|Kristína
Pri oltári|Kristína
Ako málo|Desmod
V dolinách|Desmod
Vyrobená pre mňa|Desmod
Zhorí všetko čo mám|Desmod
Lavíny|Desmod
Cesta|Kryštof a Tomáš Klus
Príbeh|Tina a Rytmus
Všetko má svoj čas|Kali
Navždy|Kali
Jazero|Kali
Žijeme len raz|Ego
Keď jazdíme my|Ego
Deti stratenej generácie|Rytmus
Zlatokopky|Rytmus
Technotronic Flow|Majk Spirit
Primetime|Majk Spirit
Kométa|Majk Spirit
Čo bolo, bolo|No Name
Žily|No Name
Ty a tvoja sestra|No Name
Nie alebo áno|No Name
Len tak stáť|Hex
V piatok podvečer|Hex
Keď sme sami|Hex
Opri sa o mňa|IMT Smile
Ľudia nie sú zlí|IMT Smile
Veselá pesnička|IMT Smile
Exotica|IMT Smile
Sľúbili sme si lásku|Ivan Hoffman
Bosorka|Olympic
Jasná správa|Olympic
Okno mé lásky|Olympic
Slzy tvý mámy|Olympic
Želva|Olympic
Jožin z bažin|Ivan Mládek
Holubí dům|Jiří Schelinger
Jahody mražený|Jiří Schelinger
Lady Carneval|Karel Gott
Kávu si osladím|Karel Gott
Trezor|Karel Gott
Včelka Mája|Karel Gott
Být stále mlád|Karel Gott
Čau lásko|Karel Gott a Marcela Holanová
Lásko má, já stůňu|Helena Vondráčková
Dlouhá noc|Helena Vondráčková
Sladké mámení|Helena Vondráčková
Malovaný džbánku|Helena Vondráčková
Nonstop|Michal David
Děti ráje|Michal David
Pár přátel|Michal David
Decibely lásky|Michal David
Colu, pijeme colu|Michal David
Láska je láska|Lucie Bílá
Trouba|Lucie Bílá
Most přes minulost|Lucie Bílá
Amerika|Lucie
Chci zas v tobě spát|David Koller
Sen|Lucie
Medvídek|Lucie
Tabáček|Chinaski
Víno|Chinaski
Klára|Chinaski
Každý ráno|Chinaski
Anděl|Xindl X
V blbým věku|Xindl X
Pánu bohu do oken|Tomáš Klus
Marie|Tomáš Klus
Mám jizvu na rtu|Jaromír Nohavica
Kometa|Jaromír Nohavica
Tři čuníci|Jaromír Nohavica
Shape of You|Ed Sheeran
Perfect|Ed Sheeran
Thinking Out Loud|Ed Sheeran
Photograph|Ed Sheeran
Bad Habits|Ed Sheeran
Rolling in the Deep|Adele
Someone Like You|Adele
Hello|Adele
Set Fire to the Rain|Adele
Easy on Me|Adele
Blinding Lights|The Weeknd
Save Your Tears|The Weeknd
Can't Feel My Face|The Weeknd
Starboy|The Weeknd
Dance Monkey|Tones and I
Flowers|Miley Cyrus
Wrecking Ball|Miley Cyrus
Party in the U.S.A.|Miley Cyrus
Happy|Pharrell Williams
Uptown Funk|Mark Ronson feat. Bruno Mars
Just the Way You Are|Bruno Mars
Locked Out of Heaven|Bruno Mars
Grenade|Bruno Mars
Counting Stars|OneRepublic
Apologize|OneRepublic
I Ain't Worried|OneRepublic
Believer|Imagine Dragons
Thunder|Imagine Dragons
Radioactive|Imagine Dragons
Demons|Imagine Dragons
Bad Guy|Billie Eilish
What Was I Made For?|Billie Eilish
Birds of a Feather|Billie Eilish
Levitating|Dua Lipa
Don't Start Now|Dua Lipa
New Rules|Dua Lipa
Houdini|Dua Lipa
Havana|Camila Cabello
Señorita|Shawn Mendes a Camila Cabello
Cheap Thrills|Sia
Chandelier|Sia
Unstoppable|Sia
Roar|Katy Perry
Firework|Katy Perry
Teenage Dream|Katy Perry
Poker Face|Lady Gaga
Bad Romance|Lady Gaga
Just Dance|Lady Gaga
Shallow|Lady Gaga a Bradley Cooper
Shake It Off|Taylor Swift
Blank Space|Taylor Swift
Love Story|Taylor Swift
Anti-Hero|Taylor Swift
Cruel Summer|Taylor Swift
As It Was|Harry Styles
Watermelon Sugar|Harry Styles
Viva La Vida|Coldplay
Yellow|Coldplay
The Scientist|Coldplay
Paradise|Coldplay
A Sky Full of Stars|Coldplay
Wake Me Up|Avicii
Levels|Avicii
The Nights|Avicii
Despacito|Luis Fonsi
Waka Waka|Shakira
Hips Don't Lie|Shakira
Whenever, Wherever|Shakira
Ai Se Eu Te Pego|Michel Teló
Macarena|Los del Río
I Want It That Way|Backstreet Boys
Everybody|Backstreet Boys
As Long as You Love Me|Backstreet Boys
Oops!... I Did It Again|Britney Spears
Baby One More Time|Britney Spears
Toxic|Britney Spears
Wannabe|Spice Girls
Barbie Girl|Aqua
Blue (Da Ba Dee)|Eiffel 65
Dragostea Din Tei|O-Zone
Freed from Desire|Gala
What Is Love|Haddaway
Rhythm Is a Dancer|Snap!
Mr. Vain|Culture Beat
We Will Rock You|Queen
We Are the Champions|Queen
Another One Bites the Dust|Queen
Bohemian Rhapsody|Queen
Don't Stop Me Now|Queen
I Want to Break Free|Queen
Billie Jean|Michael Jackson
Beat It|Michael Jackson
Thriller|Michael Jackson
Smooth Criminal|Michael Jackson
I Will Survive|Gloria Gaynor
Dancing Queen|ABBA
Mamma Mia|ABBA
Gimme! Gimme! Gimme!|ABBA
Waterloo|ABBA
Stayin' Alive|Bee Gees
Eye of the Tiger|Survivor
The Final Countdown|Europe
Take on Me|a-ha
Summer of '69|Bryan Adams
Heaven|Bryan Adams
Livin' on a Prayer|Bon Jovi
It's My Life|Bon Jovi
Sweet Child o' Mine|Guns N' Roses
Zombie|The Cranberries
Wonderwall|Oasis
Let It Be|The Beatles
Hey Jude|The Beatles
Yesterday|The Beatles
Twist and Shout|The Beatles
Don't Worry, Be Happy|Bobby McFerrin
Gangnam Style|PSY
Call Me Maybe|Carly Rae Jepsen
All About That Bass|Meghan Trainor
Can't Stop the Feeling!|Justin Timberlake
Sorry|Justin Bieber
Baby|Justin Bieber
Love Yourself|Justin Bieber
Umbrella|Rihanna
Diamonds|Rihanna
We Found Love|Rihanna
Crazy in Love|Beyoncé
Single Ladies|Beyoncé
Halo|Beyoncé
Moves Like Jagger|Maroon 5
Sugar|Maroon 5
Girls Like You|Maroon 5
Closer|The Chainsmokers
Titanium|David Guetta feat. Sia
Memories|David Guetta feat. Kid Cudi
I Gotta Feeling|The Black Eyed Peas
Where Is the Love?|The Black Eyed Peas
Party Rock Anthem|LMFAO
Timber|Pitbull feat. Kesha
Tik Tok|Kesha
On the Floor|Jennifer Lopez
Whenever You Need Somebody|Rick Astley
Never Gonna Give You Up|Rick Astley
Angels|Robbie Williams
Rock DJ|Robbie Williams
Seven Nation Army|The White Stripes
Smells Like Teen Spirit|Nirvana
Nothing Else Matters|Metallica
Highway to Hell|AC/DC
I Love Rock 'n' Roll|Joan Jett
Sweet Home Alabama|Lynyrd Skynyrd
Country Roads|John Denver
Jolene|Dolly Parton
Man! I Feel Like a Woman!|Shania Twain
No Woman, No Cry|Bob Marley
Three Little Birds|Bob Marley
La Bamba|Ritchie Valens
The Ketchup Song|Las Ketchup
Jerusalema|Master KG
Sarà perché ti amo|Ricchi e Poveri
Volare|Domenico Modugno
Bella Ciao|Traditional
Hej, sokoly|Traditional
Na Kráľovej holi|Traditional
Tancuj, tancuj, vykrúcaj|Traditional
Prší, prší|Traditional
Kukulienka, kde si bola|Traditional
Macejko|Traditional
Červený kacheľ|Traditional
Baby Shark|Pinkfong
Let It Go|Idina Menzel
Hakuna Matata|The Lion King
Can You Feel the Love Tonight|Elton John
You've Got a Friend in Me|Randy Newman
Under the Sea|Samuel E. Wright
The Bare Necessities|The Jungle Book
How Far I'll Go|Auliʻi Cravalho
We Don't Talk About Bruno|Encanto Cast
Do You Want to Build a Snowman?|Frozen Cast
I Like to Move It|Reel 2 Real
Who Let the Dogs Out|Baha Men
Cotton Eye Joe|Rednex
The Lion Sleeps Tonight|The Tokens
YMCA|Village People
September|Earth, Wind & Fire
Celebration|Kool & The Gang
Footloose|Kenny Loggins
Time of My Life|Bill Medley a Jennifer Warnes
Girls Just Want to Have Fun|Cyndi Lauper
Wake Me Up Before You Go-Go|Wham!
Careless Whisper|George Michael
Like a Prayer|Madonna
Material Girl|Madonna
Believe|Cher
Total Eclipse of the Heart|Bonnie Tyler
I Wanna Dance with Somebody|Whitney Houston
My Heart Will Go On|Céline Dion
I Will Always Love You|Whitney Houston
All I Want for Christmas Is You|Mariah Carey
Last Christmas|Wham!
Jingle Bells|Traditional
Láska, necestuj tým vlakom|Pavol Hammel
Učiteľka tanca|Pavol Hammel
ZRPŠ|Pavol Hammel
Medulienka|Pavol Hammel
Kristínka iba spí|Peter Nagy
Aj tak sme frajeri|Peter Nagy
Láska je tu s nami|Peter Nagy
Poďme sa zachrániť|Peter Nagy
Len pomaly|Peter Nagy
Mandolína|Adam Ďurica
Neľutujem|Adam Ďurica
Domovina|Adam Ďurica
Zatancuj si so mnou|Adam Ďurica
Tam kde sa neumiera|Zuzana Smatanová
V dobrom aj v zlom|Zuzana Smatanová
Horou|Zuzana Smatanová
Vráť trochu lásky medzi nás|Money Factor
Pokoj v duši|Jana Kirschner
Modrá|Jana Kirschner
Na čiernom koni|Jana Kirschner
Strážca pokladov|Jana Kirschner
Run Run Run|Celeste Buckingham
Crushin' My Fairytale|Celeste Buckingham
Mám ťa málo|Mária Čírová
Unikát|Mária Čírová
Nestrácaj nádej|Mária Čírová
Smej sa|Mária Čírová
Čerešne|Peter Cmorik
Dážď|Peter Cmorik
Jedno si želám|Peter Cmorik
Nespáľme to krásne v nás|Peter Cmorik
S tebou ma baví svet|Peter Cmorik
Pocit|Bystrík
Hej, dievča|Bystrík
Chlapci spod Tatier|Kollárovci
Daj mi lásku|Kollárovci
Sokoly|Kollárovci
Všetko bude fajn|Misha
Náladu mi dvíhaš|Misha
Keď sa láska podarí|Dara Rolins
Zvonky šťastia|Dara Rolins a Karel Gott
Čo o mne vieš|Dara Rolins
Party DJ|Dara Rolins
Slobodná|Tina
Si sám|Tina
Príbeh nekončí|Katarína Hasprová
Kým vieš snívať|Katarína Koščová
Môj Bože|Katarína Koščová
Lietajúci Cyprián|Komajota
Ráno v novinách|Komajota
Chvíľu áno|Para
Abstinent|Para
Otec|Para
Naša|Para
Ona je taká|Para
Komplikovaná|Polemic
Ona je taká|Polemic
Ako to prežijem|Polemic
Mesto|Polemic
Silný refrén|Horkýže Slíže
L.A.G. Song|Horkýže Slíže
Malá Žužu|Horkýže Slíže
Vlak|Horkýže Slíže
Ráno|Iné Kafe
Spomienky na budúcnosť|Iné Kafe
Čumil|Iné Kafe
Kašovité jedlá|Iné Kafe
Pravda víťazí|Tublatanka
Dnes|Tublatanka
Láska, drž ma nad hladinou|Tublatanka
Skúsime to cez vesmír|Tublatanka
Keď je 7 ráno|Vidiek
Fajčenie škodí zdraviu|Vidiek
Ó, maňo|Vidiek
Všetko sa dá|Gladiator
Keď sa láska podarí|Gladiator
Bonboniéra|Gladiator
Hlavu maj hore|Sima
Spolu|Sima
Femina|Sima
V oblakoch|Kali a Sima
Kým ťa mám|Kali
Mám ťa rád|Kali
Na jednej lodi|Kali
Srdce ako z kameňa|Kali
Čakám|Kali
Ideme ďalej|Kali
Tancuj|Kali
Ženy treba ľúbiť|Miro Jaroš
Tobogan|Miro Jaroš
Čisté tvary|Miro Jaroš
Kto vie|Miro Jaroš
Láska|Katarína Knechtová
Motýľ hlavolam|Katarína Knechtová
Vo svetle žiariacich hviezd|Katarína Knechtová
S tebou alebo bez teba|Tomáš Bezdeda
Len ty|Tomáš Bezdeda
Máme svoj deň|Peter Bič Project
Hey Now|Peter Bič Project
Skúšame sa nájsť|Peter Bič Project
Where Did You Go|Peter Bič Project
Len sa smej|Billy Barman
Mladým chýba vojna|Billy Barman
Traja|Billy Barman
Hannah|Billy Barman
Niečo nové|Korben Dallas
Otec|Korben Dallas
Za sklom|Korben Dallas a Jana Kirschner
Kým sa rozídeme|Korben Dallas
Františkovy lázně|Mandrage
Šrouby a matice|Mandrage
Hledá se žena|Mandrage
Na dlani|Mandrage
Pohoda|Kabát
Burlaci|Kabát
Malá dáma|Kabát
Colorado|Kabát
Žízeň|Kabát
Anděl|Karel Kryl
Bratříčku, zavírej vrátka|Karel Kryl
Růže z papíru|Nedvědi
Stánky|Nedvědi
Tři kříže|Hop Trop
Bedna od whisky|Miki Ryvola
Rána v trávě|Žalman
Svařák|Harlej
Pověste ho vejš|Michal Tučný
Báječná ženská|Michal Tučný
Hlídač krav|Jaromír Nohavica
Sarajevo|Jaromír Nohavica
Zatímco se koupeš|Jaromír Nohavica
Proměny|Čechomor
Mezi horami|Čechomor
Černé oči jděte spát|Traditional
Die With A Smile|Lady Gaga a Bruno Mars
APT.|ROSÉ a Bruno Mars
Ordinary|Alex Warren
Back to Friends|sombr
Golden|HUNTR/X
Luther|Kendrick Lamar a SZA
That's So True|Gracie Abrams
Wildflower|Billie Eilish
DtMF|Bad Bunny
A Bar Song (Tipsy)|Shaboozey
Espresso|Sabrina Carpenter
Please Please Please|Sabrina Carpenter
Taste|Sabrina Carpenter
Good Luck, Babe!|Chappell Roan
Beautiful Things|Benson Boone
Lose Control|Teddy Swims
Too Sweet|Hozier
Messy|Lola Young
End of Beginning|Djo
Texas Hold 'Em|Beyoncé
Fortnight|Taylor Swift feat. Post Malone
Greedy|Tate McRae
Beautiful Scars|Benson Boone
Million Dollar Baby|Tommy Richman
I Had Some Help|Post Malone feat. Morgan Wallen
Pink Pony Club|Chappell Roan
Stargazing|Myles Smith
Stick Season|Noah Kahan
Good 4 U|Olivia Rodrigo
Drivers License|Olivia Rodrigo
Vampire|Olivia Rodrigo
Déjà Vu|Olivia Rodrigo
Flowers Need Rain|Preston Pablo a Banx & Ranx
Positions|Ariana Grande
Thank U, Next|Ariana Grande
7 Rings|Ariana Grande
Problem|Ariana Grande
Break Free|Ariana Grande
We Can't Be Friends|Ariana Grande
Love Me Like You Do|Ellie Goulding
Burn|Ellie Goulding
Lights|Ellie Goulding
Closer to Me|Ellie Goulding
Stay|The Kid LAROI a Justin Bieber
Without Me|Halsey
Closer|The Chainsmokers feat. Halsey
Something Just Like This|The Chainsmokers a Coldplay
Faded|Alan Walker
Alone|Alan Walker
The Spectre|Alan Walker
Lean On|Major Lazer a DJ Snake
Rockabye|Clean Bandit
Rather Be|Clean Bandit
Symphony|Clean Bandit
Don't You Worry Child|Swedish House Mafia
This Is What You Came For|Calvin Harris feat. Rihanna
Summer|Calvin Harris
Feel So Close|Calvin Harris
How Deep Is Your Love|Calvin Harris
Animals|Martin Garrix
Scared to Be Lonely|Martin Garrix a Dua Lipa
Prayer in C|Lilly Wood and The Prick
Reality|Lost Frequencies
Are You With Me|Lost Frequencies
Waves|Mr. Probz
Stolen Dance|Milky Chance
Safe and Sound|Capital Cities
Pompeii|Bastille
Rude|MAGIC!
Somebody That I Used to Know|Gotye feat. Kimbra
Royals|Lorde
Team|Lorde
Price Tag|Jessie J
Domino|Jessie J
Fight Song|Rachel Platten
Stronger|Kelly Clarkson
Because of You|Kelly Clarkson
Since U Been Gone|Kelly Clarkson
So What|P!nk
Just Give Me a Reason|P!nk feat. Nate Ruess
Try|P!nk
Raise Your Glass|P!nk
Complicated|Avril Lavigne
Sk8er Boi|Avril Lavigne
Girlfriend|Avril Lavigne
I'm with You|Avril Lavigne
Genie in a Bottle|Christina Aguilera
Beautiful|Christina Aguilera
Lady Marmalade|Christina Aguilera, Lil' Kim, Mýa a P!nk
The Boy Is Mine|Brandy a Monica
Bleeding Love|Leona Lewis
No One|Alicia Keys
If I Ain't Got You|Alicia Keys
Empire State of Mind|Jay-Z feat. Alicia Keys
Fallin'|Alicia Keys
Crazy|Gnarls Barkley
Crazy in Love|Beyoncé feat. Jay-Z
Irreplaceable|Beyoncé
Telephone|Lady Gaga feat. Beyoncé
Alejandro|Lady Gaga
Paparazzi|Lady Gaga
Born This Way|Lady Gaga
Don't Speak|No Doubt
Just a Girl|No Doubt
I'm Like a Bird|Nelly Furtado
Say It Right|Nelly Furtado
Maneater|Nelly Furtado
Promiscuous|Nelly Furtado
Whenever, Wherever|Shakira
La Tortura|Shakira
Can't Remember to Forget You|Shakira feat. Rihanna
Livin' la Vida Loca|Ricky Martin
The Cup of Life|Ricky Martin
Bailando|Enrique Iglesias
Hero|Enrique Iglesias
I Like It|Enrique Iglesias
Gasolina|Daddy Yankee
Pepas|Farruko
Mi Gente|J Balvin a Willy William
Taki Taki|DJ Snake
Calm Down|Rema a Selena Gomez
Love You Like a Love Song|Selena Gomez
Lose You to Love Me|Selena Gomez
Wolves|Selena Gomez a Marshmello
Heart Attack|Demi Lovato
Sorry Not Sorry|Demi Lovato
Cool for the Summer|Demi Lovato
This Is Me|Demi Lovato a Joe Jonas
See You Again|Wiz Khalifa feat. Charlie Puth
Attention|Charlie Puth
We Don't Talk Anymore|Charlie Puth feat. Selena Gomez
One Call Away|Charlie Puth
Marry You|Bruno Mars
The Lazy Song|Bruno Mars
When I Was Your Man|Bruno Mars
24K Magic|Bruno Mars
Treasure|Bruno Mars
Fireflies|Owl City
Hey, Soul Sister|Train
I'm Yours|Jason Mraz
Lucky|Jason Mraz a Colbie Caillat
Beautiful Soul|Jesse McCartney
You Belong with Me|Taylor Swift
I Knew You Were Trouble|Taylor Swift
We Are Never Ever Getting Back Together|Taylor Swift
Style|Taylor Swift
Cardigan|Taylor Swift
Don't Blame Me|Taylor Swift
Look What You Made Me Do|Taylor Swift
Cheap Thrills|Sia feat. Sean Paul
Elastic Heart|Sia
Titanium|David Guetta feat. Sia
Without You|David Guetta feat. Usher
When Love Takes Over|David Guetta feat. Kelly Rowland
Hey Mama|David Guetta feat. Nicki Minaj
Turn Me On|David Guetta feat. Nicki Minaj
Starships|Nicki Minaj
Super Bass|Nicki Minaj
Anaconda|Nicki Minaj
Bang Bang|Jessie J, Ariana Grande a Nicki Minaj
Hot N Cold|Katy Perry
California Gurls|Katy Perry
Dark Horse|Katy Perry
Last Friday Night|Katy Perry
The One That Got Away|Katy Perry
Story of My Life|One Direction
What Makes You Beautiful|One Direction
Drag Me Down|One Direction
Best Song Ever|One Direction
Night Changes|One Direction
Glad You Came|The Wanted
Chasing the Sun|The Wanted
All the Small Things|blink-182
In the End|Linkin Park
Numb|Linkin Park
What I've Done|Linkin Park
Bring Me to Life|Evanescence
My Immortal|Evanescence
Boulevard of Broken Dreams|Green Day
Wake Me Up When September Ends|Green Day
American Idiot|Green Day
How You Remind Me|Nickelback
Photograph|Nickelback
Use Somebody|Kings of Leon
Sex on Fire|Kings of Leon
Californication|Red Hot Chili Peppers
Under the Bridge|Red Hot Chili Peppers
Otherside|Red Hot Chili Peppers
The Reason|Hoobastank
Iris|Goo Goo Dolls
Wherever You Will Go|The Calling
Chasing Cars|Snow Patrol
Human|The Killers
Mr. Brightside|The Killers
Take Me to Church|Hozier
Radioactive|Imagine Dragons
It's Time|Imagine Dragons
Hall of Fame|The Script feat. will.i.am
Breakeven|The Script
Superheroes|The Script
Apologize|Timbaland feat. OneRepublic
Stereo Hearts|Gym Class Heroes feat. Adam Levine
Airplanes|B.o.B feat. Hayley Williams
Nothin' on You|B.o.B feat. Bruno Mars
Low|Flo Rida feat. T-Pain
Right Round|Flo Rida
Whistle|Flo Rida
Give Me Everything|Pitbull feat. Ne-Yo
Fireball|Pitbull
International Love|Pitbull feat. Chris Brown
Yeah!|Usher feat. Lil Jon a Ludacris
DJ Got Us Fallin' in Love|Usher
Beautiful Girls|Sean Kingston
Temperature|Sean Paul
Get Busy|Sean Paul
Replay|Iyaz
Down|Jay Sean feat. Lil Wayne
Hotline Bling|Drake
God's Plan|Drake
One Dance|Drake
Sunflower|Post Malone a Swae Lee
Circles|Post Malone
Rockstar|Post Malone feat. 21 Savage
Old Town Road|Lil Nas X
Industry Baby|Lil Nas X feat. Jack Harlow
Montero|Lil Nas X
The Real Slim Shady|Eminem
Lose Yourself|Eminem
Without Me|Eminem
In Da Club|50 Cent
Empire State of Mind|Jay-Z feat. Alicia Keys
Hot in Herre|Nelly
Hey Ya!|Outkast
Where Is the Love?|The Black Eyed Peas
Boom Boom Pow|The Black Eyed Peas
Meet Me Halfway|The Black Eyed Peas
Pump It|The Black Eyed Peas
Sexy and I Know It|LMFAO
Call on Me|Eric Prydz
Satisfaction|Benny Benassi
Sandstorm|Darude
Everytime We Touch|Cascada
Heaven|DJ Sammy
Infinity 2008|Guru Josh Project
Children|Robert Miles
Around the World|Daft Punk
Get Lucky|Daft Punk feat. Pharrell Williams
One More Time|Daft Punk
I See Fire|Ed Sheeran
Castle on the Hill|Ed Sheeran
Shivers|Ed Sheeran
Dance the Night|Dua Lipa
Training Season|Dua Lipa
Physical|Dua Lipa
Break My Heart|Dua Lipa
Don't Stop the Music|Rihanna
Only Girl (In the World)|Rihanna
Love the Way You Lie|Eminem feat. Rihanna
S&M|Rihanna
Disturbia|Rihanna
Unfaithful|Rihanna
Man Down|Rihanna
Firework|Katy Perry
Halo|Beyoncé
If I Were a Boy|Beyoncé
Sweet Dreams|Beyoncé
Run the World (Girls)|Beyoncé
Africa|Toto
Don't Stop Believin'|Journey
Sweet Dreams (Are Made of This)|Eurythmics
The Power of Love|Huey Lewis and the News
Every Breath You Take|The Police
Roxanne|The Police
With or Without You|U2
I Still Haven't Found What I'm Looking For|U2
Losing My Religion|R.E.M.
The Best|Tina Turner
What's Love Got to Do with It|Tina Turner
Purple Rain|Prince
Kiss|Prince
Tiny Dancer|Elton John
I'm Still Standing|Elton John
Rocket Man|Elton John
Another Day in Paradise|Phil Collins
In the Air Tonight|Phil Collins
You Can't Hurry Love|Phil Collins
Karma Chameleon|Culture Club
Take My Breath Away|Berlin
Heaven Is a Place on Earth|Belinda Carlisle
99 Luftballons|Nena
Venus|Bananarama
Daddy Cool|Boney M.
Rasputin|Boney M.
Rivers of Babylon|Boney M.
Sunny|Boney M.
You're the One That I Want|John Travolta a Olivia Newton-John
Summer Nights|Grease Cast
Greased Lightnin'|John Travolta
Murder on the Dancefloor|Sophie Ellis-Bextor
Mambo No. 5|Lou Bega
I'm Too Sexy|Right Said Fred
Walking on Sunshine|Katrina and the Waves
You Spin Me Round|Dead or Alive
The Safety Dance|Men Without Hats
Video Killed the Radio Star|The Buggles
The Boys of Summer|Don Henley
Maniac|Michael Sembello
Flashdance... What a Feeling|Irene Cara
Fame|Irene Cara
Ghostbusters|Ray Parker Jr.
I Don't Want to Miss a Thing|Aerosmith
Dream On|Aerosmith
Wind of Change|Scorpions
Still Loving You|Scorpions
Nothing Else Matters|Metallica
Enter Sandman|Metallica
Should I Stay or Should I Go|The Clash
Song 2|Blur
Basket Case|Green Day
What's Up?|4 Non Blondes
Torn|Natalie Imbruglia
Kiss Me|Sixpence None the Richer
Breakfast at Tiffany's|Deep Blue Something
Lemon Tree|Fool's Garden
Mmm Mmm Mmm Mmm|Crash Test Dummies
Truly Madly Deeply|Savage Garden
I Want You|Savage Garden
Un-Break My Heart|Toni Braxton
Torn|Natalie Imbruglia
Genie in a Bottle|Christina Aguilera
No Scrubs|TLC
Wannabe|Spice Girls
Stop|Spice Girls
Say You'll Be There|Spice Girls
Help!|The Beatles
Come Together|The Beatles
Here Comes the Sun|The Beatles
Yellow Submarine|The Beatles
All You Need Is Love|The Beatles
Eleanor Rigby|The Beatles
A Hard Day's Night|The Beatles
Something|The Beatles
Ob-La-Di, Ob-La-Da|The Beatles
Somebody to Love|Queen
Killer Queen|Queen
Radio Ga Ga|Queen
Under Pressure|Queen a David Bowie
The Show Must Go On|Queen
Who Wants to Live Forever|Queen
Man in the Mirror|Michael Jackson
Black or White|Michael Jackson
Bad|Michael Jackson
Earth Song|Michael Jackson
The Way You Make Me Feel|Michael Jackson
Don't Stop 'Til You Get Enough|Michael Jackson
Can't Help Falling in Love|Elvis Presley
Jailhouse Rock|Elvis Presley
Hound Dog|Elvis Presley
Suspicious Minds|Elvis Presley
Love Me Tender|Elvis Presley
Vogue|Madonna
Like a Virgin|Madonna
Hung Up|Madonna
La Isla Bonita|Madonna
Papa Don't Preach|Madonna
SOS|ABBA
The Winner Takes It All|ABBA
Super Trouper|ABBA
Fernando|ABBA
Money, Money, Money|ABBA
Knowing Me, Knowing You|ABBA
Gimme Shelter|The Rolling Stones
Paint It, Black|The Rolling Stones
Start Me Up|The Rolling Stones
(I Can't Get No) Satisfaction|The Rolling Stones
Angie|The Rolling Stones
Good Vibrations|The Beach Boys
Surfin' U.S.A.|The Beach Boys
California Dreamin'|The Mamas & the Papas
House of the Rising Sun|The Animals
Stand by Me|Ben E. King
Unchained Melody|The Righteous Brothers
Oh, Pretty Woman|Roy Orbison
What a Wonderful World|Louis Armstrong
My Way|Frank Sinatra
New York, New York|Frank Sinatra
Fly Me to the Moon|Frank Sinatra
That's Amore|Dean Martin
Hit the Road Jack|Ray Charles
Respect|Aretha Franklin
I Say a Little Prayer|Aretha Franklin
Son of a Preacher Man|Dusty Springfield
At Last|Etta James
Proud Mary|Tina Turner
Simply the Best|Tina Turner
Private Dancer|Tina Turner
Let's Dance|David Bowie
Heroes|David Bowie
Space Oddity|David Bowie
Starman|David Bowie
Life on Mars?|David Bowie
Another Brick in the Wall|Pink Floyd
Wish You Were Here|Pink Floyd
Comfortably Numb|Pink Floyd
Money|Pink Floyd
Stairway to Heaven|Led Zeppelin
Whole Lotta Love|Led Zeppelin
Immigrant Song|Led Zeppelin
Smoke on the Water|Deep Purple
Paranoid|Black Sabbath
Iron Man|Black Sabbath
You Shook Me All Night Long|AC/DC
Thunderstruck|AC/DC
Back in Black|AC/DC
T.N.T.|AC/DC
November Rain|Guns N' Roses
Paradise City|Guns N' Roses
Knockin' on Heaven's Door|Guns N' Roses
Weird Fishes/Arpeggi|Radiohead
Creep|Radiohead
Karma Police|Radiohead
High and Dry|Radiohead
Champagne Supernova|Oasis
Don't Look Back in Anger|Oasis
Live Forever|Oasis
Bitter Sweet Symphony|The Verve
Zombie|The Cranberries
Dreams|The Cranberries
Linger|The Cranberries
Friday I'm in Love|The Cure
Boys Don't Cry|The Cure
Enjoy the Silence|Depeche Mode
Personal Jesus|Depeche Mode
Just Can't Get Enough|Depeche Mode
Everybody Wants to Rule the World|Tears for Fears
Shout|Tears for Fears
Tainted Love|Soft Cell
Blue Monday|New Order
Don't You (Forget About Me)|Simple Minds
Message in a Bottle|The Police
Englishman in New York|Sting
Fields of Gold|Sting
I Want to Know What Love Is|Foreigner
More Than a Feeling|Boston
Dreams|Fleetwood Mac
Go Your Own Way|Fleetwood Mac
The Chain|Fleetwood Mac
Hotel California|Eagles
Take It Easy|Eagles
Desperado|Eagles
Born in the U.S.A.|Bruce Springsteen
Dancing in the Dark|Bruce Springsteen
Born to Run|Bruce Springsteen
You Give Love a Bad Name|Bon Jovi
Wanted Dead or Alive|Bon Jovi
Bed of Roses|Bon Jovi
Don't Dream It's Over|Crowded House
Jessie's Girl|Rick Springfield
Footloose|Kenny Loggins
Holding Out for a Hero|Bonnie Tyler
Kids in America|Kim Wilde
Mickey|Toni Basil
Wake Me Up Before You Go-Go|Wham!
Freedom! '90|George Michael
Faith|George Michael
Father Figure|George Michael
True|Spandau Ballet
Gold|Spandau Ballet
Never Tear Us Apart|INXS
Need You Tonight|INXS
Don't Leave Me This Way|The Communards
Smalltown Boy|Bronski Beat
West End Girls|Pet Shop Boys
It's a Sin|Pet Shop Boys
You Win Again|Bee Gees
How Deep Is Your Love|Bee Gees
Night Fever|Bee Gees
Le Freak|Chic
I Want Your Love|Chic
We Are Family|Sister Sledge
Hot Stuff|Donna Summer
I Feel Love|Donna Summer
You Should Be Dancing|Bee Gees
September|Earth, Wind & Fire
Let's Groove|Earth, Wind & Fire
Boogie Wonderland|Earth, Wind & Fire
Ain't No Mountain High Enough|Marvin Gaye a Tammi Terrell
I Heard It Through the Grapevine|Marvin Gaye
Superstition|Stevie Wonder
Isn't She Lovely|Stevie Wonder
Sir Duke|Stevie Wonder
I Just Called to Say I Love You|Stevie Wonder
Easy|Commodores
Hello|Lionel Richie
All Night Long|Lionel Richie
Wake Me Up|Avicii
Hey Brother|Avicii
Waiting for Love|Avicii
Without You|Avicii feat. Sandro Cavazza
Don't You Worry Child|Swedish House Mafia
Save the World|Swedish House Mafia
Clarity|Zedd feat. Foxes
Stay the Night|Zedd feat. Hayley Williams
Closer|The Chainsmokers feat. Halsey
Paris|The Chainsmokers
Something Just Like This|The Chainsmokers a Coldplay
The Middle|Zedd, Maren Morris a Grey
This Girl|Kungs vs Cookin' on 3 Burners
Head & Heart|Joel Corry feat. MNEK
Rather Be|Clean Bandit feat. Jess Glynne
Solo|Clean Bandit feat. Demi Lovato
Symphony|Clean Bandit feat. Zara Larsson
Lush Life|Zara Larsson
Never Forget You|Zara Larsson a MNEK
On My Mind|Ellie Goulding
Starry Eyed|Ellie Goulding
Be the One|Dua Lipa
Illusion|Dua Lipa
These Walls|Dua Lipa
Taste|Sabrina Carpenter
Feather|Sabrina Carpenter
Nonsense|Sabrina Carpenter
Manchild|Sabrina Carpenter
Good Luck, Babe!|Chappell Roan
Pink Pony Club|Chappell Roan
HOT TO GO!|Chappell Roan
Birds of a Feather|Billie Eilish
Ocean Eyes|Billie Eilish
Lovely|Billie Eilish a Khalid
Therefore I Am|Billie Eilish
Happier Than Ever|Billie Eilish
Bad Blood|Taylor Swift
Wildest Dreams|Taylor Swift
Delicate|Taylor Swift
Fortnight|Taylor Swift feat. Post Malone
Lover|Taylor Swift
Enchanted|Taylor Swift
Exile|Taylor Swift feat. Bon Iver
Texas Hold 'Em|Beyoncé
Break My Soul|Beyoncé
Drunk in Love|Beyoncé feat. Jay-Z
Love on Top|Beyoncé
Formation|Beyoncé
Good as Hell|Lizzo
About Damn Time|Lizzo
Truth Hurts|Lizzo
Juice|Lizzo
Don't Call Me Up|Mabel
New Rules|Dua Lipa
No Tears Left to Cry|Ariana Grande
Into You|Ariana Grande
Dangerous Woman|Ariana Grande
Side to Side|Ariana Grande feat. Nicki Minaj
Die for You|The Weeknd
The Hills|The Weeknd
Earned It|The Weeknd
I Feel It Coming|The Weeknd feat. Daft Punk
Can't Feel My Face|The Weeknd
Adore You|Harry Styles
Sign of the Times|Harry Styles
Late Night Talking|Harry Styles
Treat You Better|Shawn Mendes
Stitches|Shawn Mendes
There's Nothing Holdin' Me Back|Shawn Mendes
Mercy|Shawn Mendes
Sorry|Justin Bieber
Peaches|Justin Bieber feat. Daniel Caesar a Giveon
What Do You Mean?|Justin Bieber
As Long as You Love Me|Justin Bieber feat. Big Sean
Cake by the Ocean|DNCE
Sucker|Jonas Brothers
Burnin' Up|Jonas Brothers
Only Human|Jonas Brothers
Counting Stars|OneRepublic
Run|OneRepublic
Love Runs Out|OneRepublic
Secrets|OneRepublic
Whatever It Takes|Imagine Dragons
Natural|Imagine Dragons
Enemy|Imagine Dragons a JID
Bones|Imagine Dragons
Shut Up and Dance|WALK THE MOON
Best Day of My Life|American Authors
Home|Edward Sharpe & The Magnetic Zeros
Budapest|George Ezra
Shotgun|George Ezra
Green Green Grass|George Ezra
Riptide|Vance Joy
Ho Hey|The Lumineers
Ophelia|The Lumineers
Little Talks|Of Monsters and Men
Some Nights|fun.
We Are Young|fun. feat. Janelle Monáe
Pompeii|Bastille
Demons|Imagine Dragons
Fix You|Coldplay
Clocks|Coldplay
Adventure of a Lifetime|Coldplay
Hymn for the Weekend|Coldplay
Higher Power|Coldplay
Beautiful Day|U2
Vertigo|U2
One|U2
Somebody Told Me|The Killers
When You Were Young|The Killers
Dance, Dance|Fall Out Boy
Centuries|Fall Out Boy
Sugar, We're Goin Down|Fall Out Boy
Misery Business|Paramore
Still Into You|Paramore
Ain't It Fun|Paramore
The Anthem|Good Charlotte
Sk8er Boi|Avril Lavigne
My Happy Ending|Avril Lavigne
What the Hell|Avril Lavigne
Teenage Dirtbag|Wheatus
The Middle|Jimmy Eat World
I Write Sins Not Tragedies|Panic! at the Disco
High Hopes|Panic! at the Disco
Welcome to the Black Parade|My Chemical Romance
Teenagers|My Chemical Romance
Bring Me to Life|Evanescence
Going Under|Evanescence
Animal I Have Become|Three Days Grace
It's Not My Time|3 Doors Down
Kryptonite|3 Doors Down
This Love|Maroon 5
She Will Be Loved|Maroon 5
Payphone|Maroon 5 feat. Wiz Khalifa
Animals|Maroon 5
Maps|Maroon 5
Smooth|Santana feat. Rob Thomas
Maria Maria|Santana
The Game of Love|Santana feat. Michelle Branch
Hips Don't Lie|Shakira
She Wolf|Shakira
Chantaje|Shakira feat. Maluma
Whenever, Wherever|Shakira
Waka Waka|Shakira
Despacito|Luis Fonsi feat. Daddy Yankee
Échame la Culpa|Luis Fonsi a Demi Lovato
Súbeme la Radio|Enrique Iglesias
Bailando|Enrique Iglesias feat. Descemer Bueno a Gente de Zona
Danza Kuduro|Don Omar feat. Lucenzo
Gasolina|Daddy Yankee
Con Calma|Daddy Yankee feat. Snow
Felices los 4|Maluma
Hawái|Maluma
Vivir Mi Vida|Marc Anthony
La Camisa Negra|Juanes
Me Enamora|Juanes
Sofia|Álvaro Soler
El Mismo Sol|Álvaro Soler
La Cintura|Álvaro Soler
Tacones Rojos|Sebastián Yatra
Provenza|Karol G
Tusa|Karol G a Nicki Minaj
Si Antes Te Hubiera Conocido|Karol G
Tití Me Preguntó|Bad Bunny
Me Porto Bonito|Bad Bunny a Chencho Corleone
Ojitos Lindos|Bad Bunny a Bomba Estéreo
I Like It|Cardi B, Bad Bunny a J Balvin
Lean On|Major Lazer a DJ Snake feat. MØ
Rockabye|Clean Bandit feat. Sean Paul a Anne-Marie
FRIENDS|Marshmello a Anne-Marie
2002|Anne-Marie
Unholy|Sam Smith a Kim Petras
Stay with Me|Sam Smith
I'm Not the Only One|Sam Smith
Too Good at Goodbyes|Sam Smith
Someone You Loved|Lewis Capaldi
Before You Go|Lewis Capaldi
Pointless|Lewis Capaldi
Say You Won't Let Go|James Arthur
Impossible|James Arthur
A Thousand Years|Christina Perri
Jar of Hearts|Christina Perri
All of Me|John Legend
Ordinary People|John Legend
Perfect|Ed Sheeran
Galway Girl|Ed Sheeran
Eyes Closed|Ed Sheeran
Bad Habits|Ed Sheeran
Easy on Me|Adele
Skyfall|Adele
When We Were Young|Adele
Make You Feel My Love|Adele
Water Under the Bridge|Adele
Grenade|Bruno Mars
Talking to the Moon|Bruno Mars
That's What I Like|Bruno Mars
Die With a Smile|Lady Gaga a Bruno Mars
APT.|ROSÉ a Bruno Mars
Flowers|Miley Cyrus
The Climb|Miley Cyrus
We Can't Stop|Miley Cyrus
Used to Be Young|Miley Cyrus
Espresso|Sabrina Carpenter
Beautiful Things|Benson Boone
Lose Control|Teddy Swims
Too Sweet|Hozier
A Bar Song (Tipsy)|Shaboozey
Stick Season|Noah Kahan
Golden|HUNTR/X
Gangnam Style|PSY
Gentleman|PSY
Dynamite|BTS
Butter|BTS
Boy with Luv|BTS feat. Halsey
Permission to Dance|BTS
Seven|Jungkook feat. Latto
Standing Next to You|Jungkook
How You Like That|BLACKPINK
Pink Venom|BLACKPINK
Kill This Love|BLACKPINK
DDU-DU DDU-DU|BLACKPINK
APT.|ROSÉ a Bruno Mars
Cupid|FIFTY FIFTY
Super Shy|NewJeans
Magnetic|ILLIT
What Is Love?|TWICE
Don't Stop Me Now|Queen
Eye of the Tiger|Survivor
Danger Zone|Kenny Loggins
The Power of Love|Céline Dion
Beauty and the Beast|Céline Dion a Peabo Bryson
A Whole New World|Peabo Bryson a Regina Belle
Circle of Life|Elton John
You'll Be in My Heart|Phil Collins
Reflection|Christina Aguilera
Colors of the Wind|Vanessa Williams
Part of Your World|Jodi Benson
You're Welcome|Dwayne Johnson
Remember Me|Coco Cast
This Is Me|The Greatest Showman Cast
Rewrite the Stars|Zac Efron a Zendaya
Shallow|Lady Gaga a Bradley Cooper
City of Stars|Ryan Gosling a Emma Stone
Footloose|Kenny Loggins
Take My Breath Away|Berlin
I Have Nothing|Whitney Houston
Greatest Love of All|Whitney Houston
How Will I Know|Whitney Houston
Saving All My Love for You|Whitney Houston
Hero|Mariah Carey
Without You|Mariah Carey
Fantasy|Mariah Carey
Emotions|Mariah Carey
Because You Loved Me|Céline Dion
It's All Coming Back to Me Now|Céline Dion
The Power of Love|Céline Dion
Whenever You Call|Mariah Carey
Waterfalls|TLC
Survivor|Destiny's Child
Say My Name|Destiny's Child
Bootylicious|Destiny's Child
Girl on Fire|Alicia Keys
Try Sleeping with a Broken Heart|Alicia Keys
Family Affair|Mary J. Blige
Dilemma|Nelly feat. Kelly Rowland
Crazy in Love|Beyoncé feat. Jay-Z
Pon de Replay|Rihanna
What's My Name?|Rihanna feat. Drake
Work|Rihanna feat. Drake
SOS|Rihanna
Womanizer|Britney Spears
Circus|Britney Spears
Gimme More|Britney Spears
Lucky|Britney Spears
Stronger|Britney Spears
Dirrty|Christina Aguilera
Fighter|Christina Aguilera
What a Girl Wants|Christina Aguilera
Whenever, Wherever|Shakira
Beautiful Liar|Beyoncé a Shakira
Don't Cha|The Pussycat Dolls
Buttons|The Pussycat Dolls
When I Grow Up|The Pussycat Dolls
Hollaback Girl|Gwen Stefani
The Sweet Escape|Gwen Stefani feat. Akon
Rich Girl|Gwen Stefani feat. Eve
Just a Girl|No Doubt
Hella Good|No Doubt
Pocketful of Sunshine|Natasha Bedingfield
Unwritten|Natasha Bedingfield
These Words|Natasha Bedingfield
Suddenly I See|KT Tunstall
Black Horse and the Cherry Tree|KT Tunstall
Put Your Records On|Corinne Bailey Rae
Mercy|Duffy
Warwick Avenue|Duffy
Rehab|Amy Winehouse
Back to Black|Amy Winehouse
Valerie|Mark Ronson feat. Amy Winehouse
You Know I'm No Good|Amy Winehouse
Dog Days Are Over|Florence + the Machine
You've Got the Love|Florence + the Machine
Shake It Out|Florence + the Machine
Electric Feel|MGMT
Kids|MGMT
Pumped Up Kicks|Foster the People
Take a Walk|Passion Pit
Do I Wanna Know?|Arctic Monkeys
I Bet You Look Good on the Dancefloor|Arctic Monkeys
Why'd You Only Call Me When You're High?|Arctic Monkeys
505|Arctic Monkeys
Take Me Out|Franz Ferdinand
Chelsea Dagger|The Fratellis
Naive|The Kooks
Last Nite|The Strokes
Reptilia|The Strokes
Are You Gonna Be My Girl|Jet
No One Knows|Queens of the Stone Age
Everlong|Foo Fighters
Best of You|Foo Fighters
The Pretender|Foo Fighters
Learn to Fly|Foo Fighters
Uprising|Muse
Starlight|Muse
Supermassive Black Hole|Muse
Time Is Running Out|Muse
Plug In Baby|Muse
Seven Nation Army|The White Stripes
Icky Thump|The White Stripes
Last Resort|Papa Roach
Chop Suey!|System of a Down
Toxicity|System of a Down
Duality|Slipknot
Can You Feel My Heart|Bring Me the Horizon
The Diary of Jane|Breaking Benjamin
Decode|Paramore
Crushcrushcrush|Paramore
Complicated|Avril Lavigne
Nobody's Home|Avril Lavigne
Papercut|Linkin Park
Faint|Linkin Park
Breaking the Habit|Linkin Park
Somewhere I Belong|Linkin Park
Castle of Glass|Linkin Park
Stan|Eminem feat. Dido
Mockingbird|Eminem
Not Afraid|Eminem
Love the Way You Lie|Eminem feat. Rihanna
Till I Collapse|Eminem feat. Nate Dogg
HUMBLE.|Kendrick Lamar
Not Like Us|Kendrick Lamar
All the Stars|Kendrick Lamar a SZA
SICKO MODE|Travis Scott
Goosebumps|Travis Scott
Highest in the Room|Travis Scott
Stronger|Kanye West
Gold Digger|Kanye West feat. Jamie Foxx
Heartless|Kanye West
99 Problems|Jay-Z
Big Pimpin'|Jay-Z
California Love|2Pac feat. Dr. Dre
Changes|2Pac
Still D.R.E.|Dr. Dre feat. Snoop Dogg
The Next Episode|Dr. Dre feat. Snoop Dogg
Drop It Like It's Hot|Snoop Dogg feat. Pharrell
Juicy|The Notorious B.I.G.
Hypnotize|The Notorious B.I.G.
Ride Wit Me|Nelly
Candy Shop|50 Cent feat. Olivia
Just a Lil Bit|50 Cent
Umbrella|Rihanna feat. Jay-Z
Yeah!|Usher feat. Lil Jon a Ludacris
Burn|Usher
Let Me Love You|Mario
Beautiful Girls|Sean Kingston
So Sick|Ne-Yo
Closer|Ne-Yo
Miss Independent|Ne-Yo
Forever|Chris Brown
With You|Chris Brown
Locked Up|Akon
Lonely|Akon
Smack That|Akon feat. Eminem
Stereo Love|Edward Maya a Vika Jigulina
Mr. Saxobeat|Alexandra Stan
We No Speak Americano|Yolanda Be Cool a DCUP
Alors on danse|Stromae
Papaoutai|Stromae
Formidable|Stromae
Dernière danse|Indila
Dragostea Din Tei|O-Zone
Stereo Love|Edward Maya feat. Vika Jigulina
Euphoria|Loreen
Tattoo|Loreen
Arcade|Duncan Laurence
SNAP|Rosa Linn
Fairytale|Alexander Rybak
Heroes|Måns Zelmerlöw
Rise Like a Phoenix|Conchita Wurst
Soldi|Mahmood
Zitti e buoni|Måneskin
Beggin'|Måneskin
I Wanna Be Your Slave|Måneskin
The Loneliest|Måneskin
Jerusalema|Master KG feat. Nomcebo Zikode
Calm Down|Rema
Love Nwantiti|CKay
Water|Tyla
Essence|Wizkid feat. Tems
Ye|Burna Boy
Rush|Ayra Starr
Shape of You|Ed Sheeran
Heat Waves|Glass Animals
Golden Hour|JVKE
Until I Found You|Stephen Sanchez
Daylight|David Kushner
Another Love|Tom Odell
Let Her Go|Passenger
Someone You Loved|Lewis Capaldi
Sweater Weather|The Neighbourhood
The Night We Met|Lord Huron
Runaway|AURORA
Somewhere Only We Know|Keane
Everybody's Changing|Keane
Bad Day|Daniel Powter
You're Beautiful|James Blunt
Goodbye My Lover|James Blunt
Apologize|Timbaland feat. OneRepublic
Bleeding Love|Leona Lewis
Fight Song|Rachel Platten
Brave|Sara Bareilles
Love Song|Sara Bareilles
Jar of Hearts|Christina Perri
Because of You|Kelly Clarkson
Breakaway|Kelly Clarkson
Behind These Hazel Eyes|Kelly Clarkson
Since U Been Gone|Kelly Clarkson
You're Still the One|Shania Twain
That Don't Impress Me Much|Shania Twain
9 to 5|Dolly Parton
Tennessee Whiskey|Chris Stapleton
Jolene|Dolly Parton
Ring of Fire|Johnny Cash
Folsom Prison Blues|Johnny Cash
The Gambler|Kenny Rogers
Islands in the Stream|Kenny Rogers a Dolly Parton
Achy Breaky Heart|Billy Ray Cyrus
Need You Now|Lady A
Before He Cheats|Carrie Underwood
Love Story|Taylor Swift
Man! I Feel Like a Woman!|Shania Twain
`;

const parsedSongs: SongCard[] = SONG_LIBRARY.trim().split("\n").map((line) => {
  const [title, artist] = line.split("|");
  return { title: title.trim(), artist: artist.trim() };
});
export const SONG_CARDS: SongCard[] = Array.from(
  new Map(parsedSongs.map((song) => [`${song.title.toLocaleLowerCase()}|${song.artist.toLocaleLowerCase()}`, song])).values(),
);

const internationalSongStart = SONG_CARDS.findIndex(
  (song) => song.title === "Shape of You" && song.artist === "Ed Sheeran",
);
const extendedLocalSongStart = SONG_CARDS.findIndex(
  (song) => song.title === "Láska, necestuj tým vlakom" && song.artist === "Pavol Hammel",
);
const extendedLocalSongEnd = SONG_CARDS.findIndex(
  (song) => song.title === "Černé oči jděte spát" && song.artist === "Traditional",
);
const LOCAL_TRADITIONAL_TITLES = new Set([
  "Hej, sokoly",
  "Na Kráľovej holi",
  "Tancuj, tancuj, vykrúcaj",
  "Prší, prší",
  "Kukulienka, kde si bola",
  "Macejko",
  "Červený kacheľ",
]);

// Slovak and Czech songs are intentionally kept only for the Slovak language mode.
export const INTERNATIONAL_SONG_CARDS: SongCard[] = SONG_CARDS.filter((song, index) => {
  if (internationalSongStart >= 0 && index < internationalSongStart) return false;
  if (extendedLocalSongStart >= 0 && extendedLocalSongEnd >= extendedLocalSongStart
    && index >= extendedLocalSongStart && index <= extendedLocalSongEnd) return false;
  return !LOCAL_TRADITIONAL_TITLES.has(song.title);
});

export interface SoundClue {
  id: string;
  label: string;
  emoji: string;
  /** Voliteľná kategória (napr. "Kuchyňa", "Doprava") — používa sa len na
   *  organizáciu a prípadné filtrovanie, hra ju momentálne nevyžaduje. */
  category?: string;
  /** Prirodzené alternatívne formulácie odpovede, ktoré sa majú uznať ako
   *  správne (napr. "otváranie dverí" aj "dvere sa otvárajú"). Nepovinné —
   *  staršie položky ho nemusia mať. */
  acceptedAnswers?: string[];
  audioUrl: string;
  sourcePage: string;
  credit: string;
  license: string;
  tonePattern?: Array<{ frequency: number; duration: number; pause: number }>;
}

/**
 * ── Uhádni zvuk: databáza ────────────────────────────────────────────────────
 *
 * Pravidlo tejto databázy: KAŽDÁ položka je konkrétny, reálne existujúci zvuk,
 * ktorý hráč dokáže rozpoznať aj bez textu. Žiadne syntetické tóny, pulzy ani
 * abstraktné efekty — tie sa odtiaľto odstránili, pretože tvorili väčšinu poolu
 * a hráč tak namiesto zvuku dostával bezvýznamné pípnutie.
 *
 * Do `SOUND_CLUES` smie vstúpiť len položka so skutočne funkčným `audioUrl`.
 * Hra pri chybe načítania nemá auto-skip, takže neoverený odkaz by znamenal
 * mŕtve kolo. Kurátorské koncepty, ktoré ešte nemajú nahrávku, sú preto
 * oddelené v `SOUND_CLUE_BACKLOG` a hra ich nikdy nečerpá.
 *
 * Deduplikačný kľúč hry je `label` (SoundBuzzer.tsx), takže labely musia byť
 * neprázdne a jedinečné — kolidujúce položky by sa mlčky zlúčili a pool zmenšili.
 */

/** Zvuky s vlastnou nahrávkou a vlastným uvedením autora a licencie. */
const CORE_SOUND_CLUES: SoundClue[] = [
  { id: "sk-engine-idle", label: "Motor auta", emoji: "🚗", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/WWS_CarPrinzNSU1200Cengine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_CarPrinzNSU1200Cengine.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0" },
  { id: "sk-cat-meow", label: "Mňaukanie mačky", emoji: "🐈", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Meow_of_a_pleading_cat.oga", sourcePage: "https://commons.wikimedia.org/wiki/File:Meow_of_a_pleading_cat.oga", credit: "Heismark", license: "Public domain" },
  { id: "sk-can-open", label: "Otvorenie plechovky", emoji: "🥫", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Opening_a_can.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Opening_a_can.ogg", credit: "stephan", license: "Public domain" },
  // Pôvodne ukazovalo na /sounds/dog.ogg, ale client/public/sounds/ neexistuje.
  // Názov súboru je zdokumentovaný v sourcePage, takže odkaz vedieme rovnakým
  // Commons mechanizmom ako ostatné položky nižšie.
  { id: "sk-dog-bark", label: "Štekot psa", emoji: "🐕", audioUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Barking_of_a_dog.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Barking_of_a_dog.ogg", credit: "Amada44", license: "CC BY-SA 3.0" },
  { id: "sk-rain-window", label: "Dážď na okne", emoji: "🌧️", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/41/Rain_against_the_window.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Rain_against_the_window.ogg", credit: "cori", license: "Public domain" },
  { id: "sk-police-siren", label: "Policajná siréna", emoji: "🚓", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ae/American_police_siren_i.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:American_police_siren_i.ogg", credit: "lezer", license: "Public domain" },
  { id: "sk-clock-tick", label: "Tikajúce hodiny", emoji: "🕰️", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Alarm_clock_ticking.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Alarm_clock_ticking.ogg", credit: "ezwa", license: "Public domain" },
  // Rovnaká oprava ako pri štekote psa — pôvodné /sounds/doorbell.ogg neexistuje.
  { id: "sk-doorbell", label: "Zvonček pri dverách", emoji: "🔔", audioUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Doorbell-cheap-dingdong.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Doorbell-cheap-dingdong.ogg", credit: "Wikimedia Commons", license: "Public domain" },
  { id: "sk-phone-ring", label: "Zvonenie telefónu", emoji: "☎️", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Telephone.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Telephone.ogg", credit: "Dsw4", license: "Public domain" },
  { id: "sk-train-horn", label: "Klaksón vlaku", emoji: "🚆", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/4000_class_train_horn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:4000_class_train_horn.ogg", credit: "Cityedit14", license: "CC BY-SA 4.0" },
  { id: "sk-heartbeat", label: "Búšenie srdca", emoji: "❤️", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Heartbeat_mitral_valve_150_bpm.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Heartbeat_mitral_valve_150_bpm.ogg", credit: "ezwa", license: "Public domain" },
  { id: "sk-helicopter", label: "Vrtuľník", emoji: "🚁", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Helicopter_over_quiet_neighbourhood.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Helicopter_over_quiet_neighbourhood.ogg", credit: "ezwa", license: "Public domain" },
  { id: "sk-microwave", label: "Mikrovlnná rúra", emoji: "📟", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Microwave_oven.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Microwave_oven.ogg", credit: "stephan", license: "Public domain" },
  { id: "sk-keyboard", label: "Písanie na klávesnici", emoji: "⌨️", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Keyboard_noise.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Keyboard_noise.ogg", credit: "Yuyudevil", license: "Public domain" },
  { id: "sk-alarm-clock", label: "Budík", emoji: "⏰", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Alarm_Clock_%28Directory.Audio%29.mp3", sourcePage: "https://commons.wikimedia.org/wiki/File:Alarm_Clock_(Directory.Audio).mp3", credit: "Yoo-toob-FX", license: "CC0" },
  { id: "sk-applause", label: "Potlesk", emoji: "👏", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/Applause_ii.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Applause_ii.ogg", credit: "thore", license: "Public domain" },
  { id: "sk-horses-gallop", label: "Cválajúce kone", emoji: "🐎", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Six_Horses_Galloping_By.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Six_Horses_Galloping_By.ogg", credit: "Freesound Community / Bruno Auzet", license: "CC0" },
  { id: "sk-fire-crackle", label: "Praskajúci oheň", emoji: "🔥", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/80/Bones_breaking_wood_fire_ice_crackling.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Bones_breaking_wood_fire_ice_crackling.ogg", credit: "stephan", license: "Public domain" },
  { id: "sk-rooster", label: "Kikiríkanie kohúta", emoji: "🐓", audioUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Rooster_crowing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Rooster_crowing.ogg", credit: "Filo gèn'", license: "CC BY-SA 4.0" },
  { id: "sk-sheep", label: "Bľačanie ovce", emoji: "🐑", audioUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sheep_bleating.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Sheep_bleating.ogg", credit: "earthcalling", license: "Public domain" },
  { id: "sk-cow", label: "Bučanie kravy", emoji: "🐄", audioUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Single_Cow_Moo.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Single_Cow_Moo.ogg", credit: "MichaeltheFox8621", license: "CC BY-SA 4.0" },
  { id: "sk-thunder", label: "Hrom", emoji: "⛈️", audioUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tonitrus.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Tonitrus.ogg", credit: "Wikimedia Commons", license: "Public domain" },
  { id: "sk-church-bells", label: "Kostolné zvony", emoji: "🔔", audioUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Churchbells.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Churchbells.ogg", credit: "Natalie", license: "Public domain" },
  { id: "sk-sea-waves", label: "Morské vlny", emoji: "🌊", audioUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Waves.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Waves.ogg", credit: "Dsw4", license: "Public domain" },
  { id: "sk-lion", label: "Rev leva", emoji: "🦁", audioUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lion_raring-sound1TamilNadu178.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Lion_raring-sound1TamilNadu178.ogg", credit: "Info-farmer", license: "Public domain" },
];

/**
 * Ďalšie zvuky z Wikimedia Commons vo formáte `label|emoji|názov súboru`.
 * Kurátorský výber: z pôvodných 127 položiek zostali len tie, ktoré sú
 * konkrétne a rozpoznateľné. Odstránilo sa najmä 47 variantov „Motor <model>",
 * ktoré predstavovali ten istý zvuk, a desiatky neznámych druhov vtákov,
 * gibonov a vymyslených filmových príšer.
 */
const COMMONS_SOUND_LIBRARY = `
Híkanie osla|🫏|157763 felix-blume a-donkey-is-braying-in-his-enclosure-in-south-of-france.wav
Bzučanie včely|🐝|Bee buzzing sound (animal noises).opus
Kvákanie žiab|🐸|Frogs croak calling chorus at night.ogg
Pradenie mačky|🐈|Purr (10 sec loopable).ogg
Eržanie koňa|🐎|Segregation-of-information-about-emotional-arousal-and-valence-in-horse-whinnies-srep09989-s2.oga
Bľačanie kôz|🐐|Herd of goats bleating.ogg
Vytie psa|🐕|Jem howls.ogg
Papagáj|🦜|Psittacara erythrogenys - Red masked Parakeet.wav
Vrčanie diviaka|🐗|Boar.Grwls(1).ogg
Delfín pod vodou|🐬|161691 felixblume dolphin-screaming-underwater-in-caribbean-sea-mexico.wav
Veverička|🐿️|A three-striped palm squirrel (Funambulus palmarum) chirping 16January2015.oga
Spev veľrýb|🐋|Long finned Pilot Whales orig.ogg
Nočný les|🌲|Rufe nachts im Wald.ogg
Štartovanie auta|🚗|Autostarten und wegfahren 01.ogg
Trúbenie auta|📣|WWS VolkswagenBeetle8211horn.ogg
Premávka v meste|🚦|Ambient sound city street Berlin 2026-05-17.oga
Autá na diaľnici|🛣️|Autos auf der Bundesautobahn 23 01.ogg
Prichádzajúce auto|🚙|255126 ylearkisto henkiloauto-tulo-asfaltilla-a-car-approaching-stopping-shutting-down-lada-1500-combi-a-1981-model.wav
Odchádzajúce auto|🚙|255122 ylearkisto henkiloauto-lahto-asfaltilla-a-car-pulling-away-on-asphalt-lada-1500-combi-a-1981-model.wav
Motor športového auta|🏎️|Ferrari 458 Italia.ogg
Zvuk elektromobilu|🔊|Avertisseur piétons Renault Zoe.opus
Parkovací senzor|📡|Open Corsa E model 2014 parking sensor sound.oga
Rally auto na trati|🏁|Zero car Toyota Corolla 1600 GT 2 Door AE86 Jyväskylän Talviralli 2023 Kuohu.opus
`.trim().split("\n");

const COMMONS_SOUND_CLUES: SoundClue[] = COMMONS_SOUND_LIBRARY.map(entry => {
  const [label, emoji, fileName] = entry.split("|");
  const encodedFileName = encodeURIComponent(fileName);
  return {
    // ID je odvodené od názvu súboru, nie od poradia — presúvanie riadkov
    // v zozname už teda nemení ID existujúcich položiek.
    id: `commons-${fileName.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase().slice(0, 48)}`,
    label,
    emoji,
    audioUrl: `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodedFileName}`,
    sourcePage: `https://commons.wikimedia.org/wiki/File:${encodedFileName}`,
    credit: "Wikimedia Commons",
    license: "Licencia je uvedená na zdrojovej stránke",
  };
});

/**
 * Kurátorský zoznam konkrétnych slovenských zvukov, ktoré ešte nemajú
 * priradenú nahrávku. Zámerne NIE JE súčasťou `SOUND_CLUES`: hra pri
 * nefunkčnom zdroji zvuku nezobrazí ďalšiu otázku, len chybu, takže položka
 * bez overenej nahrávky by pokazila kolo. Slúži ako pripravený obsah — po
 * doplnení `audioUrl` sa položka presunie medzi hrateľné.
 */
/**
 * Dávka 1 novej väčšej databázy (~500-700 zvukov). Zdroje: Wikimedia Commons
 * projekt "Work With Sounds" (múzeá, CC BY 4.0), knižnica "Gravity Sound"
 * (foley nahrávky, CC BY 4.0) a jednotlivo overené nahrávky z Commons
 * (rôzne licencie, vždy uvedené pri položke). Každá položka bola prejdená
 * cez Commons API a jej licencia/URL bola overená pred zaradením.
 */
const EXPANDED_SOUND_CLUES_1: SoundClue[] = [
  { id: "sk2-alarmclock-ring", label: "Zvonenie budíka", emoji: "⏰", category: "Domácnosť", acceptedAnswers: ["budík zvoní", "zvonček budíka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/WWS_Alarmclockringing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Alarmclockringing.ogg", credit: "Work With Sounds / Museum of Recent History Celje", license: "CC BY 4.0" },
  { id: "sk2-alarmclock-wind", label: "Naťahovanie budíka", emoji: "🔧", category: "Domácnosť", acceptedAnswers: ["naťahovanie hodín", "naťahovanie budíka kľúčikom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/74/WWS_Alarmclockwinding.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Alarmclockwinding.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-leafblower", label: "Fúkač na lístie", emoji: "🍃", category: "Záhrada", acceptedAnswers: ["fúkanie lístia", "záhradný fukár"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/be/WWS_Backpackleafblower.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Backpackleafblower.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-brushcutter", label: "Krovinorez pri kosení", emoji: "🌿", category: "Záhrada", acceptedAnswers: ["kosenie krovinorezom", "strunová kosačka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/WWS_Brushcutter.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Brushcutter.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-cashregister-old", label: "Stará pokladňa pri účtovaní", emoji: "🧾", category: "Obchod", acceptedAnswers: ["registračná pokladňa", "stará kasa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/WWS_Cashregister.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Cashregister.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-chainsaw", label: "Motorová píla rezajúca drevo", emoji: "🪚", category: "Nástroje", acceptedAnswers: ["motorová píla", "reze motorovou pílou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/WWS_Chainsaw.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Chainsaw.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-dentaldrill", label: "Zubárska vrtačka", emoji: "🦷", category: "Zdravie", acceptedAnswers: ["zubná vrtačka", "vrtačka u zubára"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/WWS_Dentaldrill.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Dentaldrill.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-dental-scaler", label: "Ultrazvukový zubný nástroj", emoji: "🦷", category: "Zdravie", acceptedAnswers: ["odstraňovanie zubného kameňa", "ultrazvuková čistička zubov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d2/WWS_Dentalultrasonicscaler.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Dentalultrasonicscaler.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-firealarm", label: "Požiarny alarm v budove", emoji: "🚨", category: "Bezpečnosť", acceptedAnswers: ["poplašný signál", "požiarny poplach"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3c/WWS_Firealarm.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Firealarm.ogg", credit: "Work With Sounds / Museum of Work", license: "CC BY 4.0" },
  { id: "sk2-firealarm-manual", label: "Ručná požiarna siréna", emoji: "🚨", category: "Bezpečnosť", acceptedAnswers: ["ručný požiarny alarm", "kľukový poplach"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/38/WWS_Manualfirealarm.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Manualfirealarm.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-hedgetrimmer", label: "Nožnice na strihanie živého plota", emoji: "✂️", category: "Záhrada", acceptedAnswers: ["strihanie živého plota", "elektrické nožnice na krík"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fb/WWS_HedgeTrimmer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_HedgeTrimmer.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-keycutting", label: "Vyrezávanie kľúča u zámočníka", emoji: "🔑", category: "Obchod", acceptedAnswers: ["strihanie kľúča", "kopírovanie kľúča"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/06/WWS_KeyCuttingMachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_KeyCuttingMachine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-lawnmower-old", label: "Kosačka na trávu", emoji: "🌱", category: "Záhrada", acceptedAnswers: ["kosenie trávnika", "sekačka na trávu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/81/WWS_Lawnmower.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Lawnmower.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-meatslicer", label: "Krájač salámy v obchode", emoji: "🔪", category: "Obchod", acceptedAnswers: ["krájač na mäso", "strojček na krájanie salámy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cb/WWS_Meatslicer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Meatslicer.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-pencilsharpener-el", label: "Elektrická ceruzková ostrorezka", emoji: "✏️", category: "Škola a kancelária", acceptedAnswers: ["ostrenie ceruzky", "elektrický strojček na ceruzky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/WWS_Pencilsharpener.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Pencilsharpener.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-typewriter", label: "Písanie na mechanickom písacom stroji", emoji: "⌨️", category: "Škola a kancelária", acceptedAnswers: ["písací stroj", "klepanie na písacom stroji"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/25/WWS_Typewriter.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Typewriter.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-mac-typing", label: "Písanie na klávesnici starého počítača", emoji: "⌨️", category: "Technológie", acceptedAnswers: ["staré počítačové klávesy", "retro klávesnica"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WWS_MacintoshSE30typing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_MacintoshSE30typing.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-woodchipper", label: "Drtič konárov v záhrade", emoji: "🪵", category: "Záhrada", acceptedAnswers: ["štiepkovač", "drtenie konárov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5b/WWS_Woodchipper.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Woodchipper.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-tattoo", label: "Tetovací strojček", emoji: "💉", category: "Voľný čas", acceptedAnswers: ["tetovanie", "bzučanie tetovacieho strojčeka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/60/WWS_TattooMachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_TattooMachine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-bandsaw", label: "Pásová píla v dielni", emoji: "🪚", category: "Nástroje", acceptedAnswers: ["stolová píla", "rezanie pásovou pílou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/48/WWS_Bandsaw.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Bandsaw.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-carpetbeater", label: "Vyklepávanie koberca paličkou", emoji: "🧹", category: "Domácnosť", acceptedAnswers: ["klepačka na koberce", "vyklepávanie kobercov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/WWS_Carpetbeater.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Carpetbeater.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-coffeeroaster", label: "Praženie kávových zŕn", emoji: "☕", category: "Kuchyňa", acceptedAnswers: ["pražiareň kávy", "praženie kávy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/90/WWS_CoffeeRoaster.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_CoffeeRoaster.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-coffeemaker-drip", label: "Prekapávací kávovar pri príprave kávy", emoji: "☕", category: "Kuchyňa", acceptedAnswers: ["kávovar pripravuje kávu", "prekapávanie kávy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/73/WWS_Coffeemaker.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Coffeemaker.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-cracking-nuts", label: "Lúskanie orechov", emoji: "🌰", category: "Kuchyňa", acceptedAnswers: ["lúskanie vlašských orechov", "rozbíjanie orechov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/60/WWS_Crackingnuts.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Crackingnuts.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-creakingfloors", label: "Vŕzganie drevenej podlahy", emoji: "🏠", category: "Domácnosť", acceptedAnswers: ["škripot podlahy", "staré drevené dosky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/WWS_Creakingfloors.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Creakingfloors.ogg", credit: "Work With Sounds / Kunsthistorisches Museum", license: "CC BY 4.0" },
  { id: "sk2-firetruck-siren", label: "Hasičské auto so sirénou", emoji: "🚒", category: "Doprava", acceptedAnswers: ["hasiči", "sirena hasičského auta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/WWS_Firetruck.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Firetruck.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-foghorn", label: "Hukot lodnej hmlovej sirény", emoji: "🚢", category: "Doprava", acceptedAnswers: ["hmlová siréna", "siréna lode v hmle"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/WWS_Foghorn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Foghorn.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-hacksaw", label: "Rezanie kovu pilníkovou pílkou", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["pílka na kov", "rezanie železnej tyče"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d2/WWS_Hacksaw.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Hacksaw.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-hammerdrill", label: "Príklepová vrtačka do betónu", emoji: "🔨", category: "Nástroje", acceptedAnswers: ["vŕtanie do steny", "vrtačka s príklepom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/WWS_Hammerdrill.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Hammerdrill.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-jointer", label: "Zrovnávacia frézka na drevo", emoji: "🪵", category: "Nástroje", acceptedAnswers: ["truhlárska frézka", "hobľovačka na drevo"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/WWS_Jointer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Jointer.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-pneumaticdrill2", label: "Pneumatická sekacia kladivo", emoji: "⛏️", category: "Nástroje", acceptedAnswers: ["sbíjacie kladivo", "pneumatické kladivo"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1e/WWS_Pneumaticdrill.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Pneumaticdrill.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-policecar-siren", label: "Siréna policajného auta", emoji: "🚓", category: "Doprava", acceptedAnswers: ["policajná siréna", "auto s majákom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/76/WWS_Policecarsiren.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Policecarsiren.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-police-whistle", label: "Píšťalka policajta pri riadení dopravy", emoji: "👮", category: "Doprava", acceptedAnswers: ["policajná píšťalka", "pískanie policajta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/WWS_Policewhistle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Policewhistle.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-shoerepair", label: "Brúsenie podošvy v obuvníckej dielni", emoji: "👞", category: "Obchod", acceptedAnswers: ["oprava topánok", "obuvník brúsi podrážku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/46/WWS_ShoeRepairing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_ShoeRepairing.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-steamiron", label: "Naparovacia žehlička", emoji: "👔", category: "Domácnosť", acceptedAnswers: ["žehlenie naparovacou žehličkou", "syčanie žehličky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/WWS_SteamIron.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_SteamIron.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-steamwhistle-loco", label: "Píšťala parnej lokomotívy", emoji: "🚂", category: "Doprava", acceptedAnswers: ["parná lokomotíva píska", "vlakové pískanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/WWS_SteamWhistle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_SteamWhistle.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-tablesaw", label: "Stolová okružná píla", emoji: "🪚", category: "Nástroje", acceptedAnswers: ["okružná píla", "rezanie na stolovej píle"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1e/WWS_Tablesaw.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Tablesaw.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-washboard", label: "Pranie na valchovom pradle", emoji: "🧺", category: "Domácnosť", acceptedAnswers: ["staré pranie na pradle", "drhnutie bielizne"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f8/WWS_Washboard.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Washboard.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-kettle-whistling2", label: "Pískajúca čajová kanvica na sporáku", emoji: "♨️", category: "Kuchyňa", acceptedAnswers: ["kanvica píska", "varenie vody v kanvici"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8f/WWS_Whistlingkettle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Whistlingkettle.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-car-horn-old", label: "Klaksón starého automobilu", emoji: "📯", category: "Doprava", acceptedAnswers: ["trúbenie starého auta", "klasický klaksón"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/WWS_CarPrinzNSU1200C8211horn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_CarPrinzNSU1200C8211horn.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-clockingmachine", label: "Píchacie hodiny v zamestnaní", emoji: "🕰️", category: "Škola a kancelária", acceptedAnswers: ["dochádzkové hodiny", "píchanie karty pri príchode do práce"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f0/WWS_Clocking-inmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Clocking-inmachine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-escalator", label: "Pohybujúce sa eskalátorové schody", emoji: "🛗", category: "Mesto", acceptedAnswers: ["eskalátor", "pohyblivé schody"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/53/WWS_Escalator.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Escalator.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-fireworks-wws", label: "Odpaľovanie novoročných ohňostrojov", emoji: "🎆", category: "Voľný čas", acceptedAnswers: ["ohňostroj", "novoročný ohňostroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/86/WWS_Fireworks.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Fireworks.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-fueldispenser", label: "Tankovanie na benzínovej pumpe", emoji: "⛽", category: "Doprava", acceptedAnswers: ["čerpanie benzínu", "tankovanie auta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ef/WWS_Fueldispenser.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Fueldispenser.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-icecreamvan", label: "Zvonkohra zmrzlinárskeho auta", emoji: "🍦", category: "Voľný čas", acceptedAnswers: ["zmrzlinárske auto", "melódia zmrzlinárskeho autíčka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8b/WWS_HomeIceCreamvan.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_HomeIceCreamvan.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-ticket-vending", label: "Kupovanie lístka v automate", emoji: "🎫", category: "Doprava", acceptedAnswers: ["automat na lístky", "kupovanie cestovného lístka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/WWS_Journeyticketispurchased.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Journeyticketispurchased.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-luggagebelt", label: "Bežiaci pás na letisku", emoji: "🧳", category: "Doprava", acceptedAnswers: ["letiskový pás na batožinu", "dopravníkový pás s kuframi"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d1/WWS_Luggagebeltinwaitinghall.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Luggagebeltinwaitinghall.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-cardvalidation", label: "Validácia čipovej karty v MHD", emoji: "🚏", category: "Doprava", acceptedAnswers: ["pípnutie čipovej karty", "validátor lístkov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/WWS_MoBIB-ticketvalidation.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_MoBIB-ticketvalidation.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-polaroid", label: "Fotenie polaroidovým fotoaparátom", emoji: "📸", category: "Voľný čas", acceptedAnswers: ["polaroid fotoaparát", "vysúvanie fotky z polaroidu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e2/WWS_Polaroid1200iTakingapicture.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Polaroid1200iTakingapicture.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-quartzclock-ring", label: "Zvonenie nástenných hodín", emoji: "🕰️", category: "Domácnosť", acceptedAnswers: ["hodiny odbíjajú", "zvonkohra nástenných hodín"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/WWS_Quartzclockringing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Quartzclockringing.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-timeclock", label: "Pípacie hodiny na zaznamenanie príchodu", emoji: "🕰️", category: "Škola a kancelária", acceptedAnswers: ["píchačky", "dochádzkový systém"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/de/WWS_Timeclock.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Timeclock.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-vwbeetle-horn", label: "Klaksón historického Volkswagenu Chrobák", emoji: "📯", category: "Doprava", acceptedAnswers: ["trúbenie chrobáka", "klaksón starého vozidla"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8c/WWS_VolkswagenBeetle8211horn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_VolkswagenBeetle8211horn.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-vwbeetle-engine", label: "Motor historického Volkswagenu Chrobák", emoji: "🚗", category: "Doprava", acceptedAnswers: ["motor vzduchom chladeného auta", "chrobák nastartovaný"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/60/WWS_VolkswagenBeetle8211engine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_VolkswagenBeetle8211engine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-angelchimes", label: "Vianočný anjelský zvonkový kolotoč", emoji: "🎄", category: "Voľný čas", acceptedAnswers: ["anjelské zvonkohry", "vianočná ozdoba so zvončekmi"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ce/WWS_Angelchimes.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Angelchimes.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-bellfoundry-trial", label: "Prvé skúšobné udretie zvona", emoji: "🔔", category: "Voľný čas", acceptedAnswers: ["skúška zvona", "zvon v zvonolejárni"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/WWS_Bellfoundry8211firsttrialofthebell.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Bellfoundry8211firsttrialofthebell.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-boxmangle", label: "Mangeľ na žehlenie plachiet", emoji: "🧺", category: "Domácnosť", acceptedAnswers: ["valcovací mangeľ", "žehlenie plachiet mangľom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/77/WWS_Boxmangle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Boxmangle.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-dial-phone-old", label: "Vytáčanie čísla na starom telefóne", emoji: "☎️", category: "Domácnosť", acceptedAnswers: ["staré telefónne vytáčanie", "krúžkový disk telefónu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f7/WWS_Dial-operatedtelephone.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Dial-operatedtelephone.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-eastereggdrill", label: "Vyfukovanie kraslice pomocou vrtáčika", emoji: "🥚", category: "Voľný čas", acceptedAnswers: ["zdobenie kraslíc", "vrtanie veľkonočného vajíčka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6e/WWS_Eastereggdrilling.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Eastereggdrilling.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-glassblowing", label: "Fúkanie skla pri tvarovaní výrobku", emoji: "🫧", category: "Voľný čas", acceptedAnswers: ["sklofúkačstvo", "fúkané sklo v peci"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/WWS_Glass-blowingIformingthebody.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Glass-blowingIformingthebody.ogg", credit: "Work With Sounds / LWL-Industriemuseum Glashütte Gernheim", license: "CC BY 4.0" },
  { id: "sk2-goldsmith-torch", label: "Zlatník spájkuje prsteň horákom", emoji: "💍", category: "Obchod", acceptedAnswers: ["zlatnícka dielňa", "spájkovanie prsteňa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/WWS_Goldsmithweldingwithablowtorch.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Goldsmithweldingwithablowtorch.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-handcranksiren", label: "Ručne poháňaná siréna", emoji: "📯", category: "Bezpečnosť", acceptedAnswers: ["kľukou poháňaná siréna", "stará ručná siréna"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8f/WWS_Handcranksiren.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Handcranksiren.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-manualexchange", label: "Ručná telefónna ústredňa", emoji: "☎️", category: "Technológie", acceptedAnswers: ["stará telefónna centrála", "spájanie hovorov operátorkou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/WWS_Manualtelephoneexchange.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Manualtelephoneexchange.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-frenchfries-drain", label: "Vyprážané hranolky odkvapkávajú v košíku", emoji: "🍟", category: "Kuchyňa", acceptedAnswers: ["hranolky sa cvrčia", "odkvapkávanie hranolčekov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/WWS_Portionofchipsinadrainer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Portionofchipsinadrainer.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-goldpan", label: "Preosievanie zlata v panvici", emoji: "⛏️", category: "Voľný čas", acceptedAnswers: ["ryžovanie zlata", "zlatokop s panvicou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/79/WWS_ProspectorpanninggoldinLapland.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_ProspectorpanninggoldinLapland.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-signalhorn-old", label: "Signálny rohový klakson robotníka", emoji: "📯", category: "Nástroje", acceptedAnswers: ["signálna trúbka", "starý pracovný signál"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/WWS_Signalhorn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Signalhorn.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-telephone-ring-old", label: "Zvonenie starého telefónu v bani", emoji: "☎️", category: "Technológie", acceptedAnswers: ["staromódne zvonenie telefónu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/WWS_Telephone8211ringing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Telephone8211ringing.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-train-arriving", label: "Vlak zastavuje na stanici", emoji: "🚆", category: "Doprava", acceptedAnswers: ["vlak prichádza na nástupište", "zastavenie vlaku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/WWS_TrainStoppingAtTheTrainStation.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_TrainStoppingAtTheTrainStation.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-traindestination", label: "Mechanická cieľová tabuľa vlaku", emoji: "🚆", category: "Doprava", acceptedAnswers: ["preklápacia tabuľa na stanici", "mechanický informačný panel"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/55/WWS_Traindestinationindicator.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Traindestinationindicator.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-automilking", label: "Automatické dojenie kravy", emoji: "🐄", category: "Príroda", acceptedAnswers: ["dojací robot", "automatická dojárka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/06/WWS_Automaticmilking.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Automaticmilking.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-bakery-mixer", label: "Miesenie chlebového cesta v pekárni", emoji: "🍞", category: "Kuchyňa", acceptedAnswers: ["miešanie cesta na chlieb", "pekárenský mixér na cesto"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/WWS_Bakerykneadingthedoughinaspiralmixer2.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Bakerykneadingthedoughinaspiralmixer2.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-bakery-oven", label: "Vkladanie chleba do pekárenskej pece", emoji: "🍞", category: "Kuchyňa", acceptedAnswers: ["pekár vkladá chlieb do pece", "pekárska pec"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/27/WWS_Bakeryputtingbreadintothebreadoven4.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Bakeryputtingbreadintothebreadoven4.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-firedept-bell", label: "Zvon na starom hasičskom voze", emoji: "🔔", category: "Bezpečnosť", acceptedAnswers: ["hasičský poplašný zvon", "zvonec hasičského vozu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/WWS_Firedepartmentbell.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Firedepartmentbell.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-handmilking", label: "Ručné dojenie kravy", emoji: "🐄", category: "Príroda", acceptedAnswers: ["dojenie kravy rukou", "farmár dojí kravu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/WWS_Handmilking.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Handmilking.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-poultry", label: "Sliepky a hydina na dvore", emoji: "🐔", category: "Zvieratá", acceptedAnswers: ["hydinárska farma", "kvokanie hydiny na dvore"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/98/WWS_Poultryenclosure.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Poultryenclosure.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-bbq-close", label: "Zatváranie veka starého grilu", emoji: "🍖", category: "Voľný čas", acceptedAnswers: ["zatváranie grilu", "veko grilu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Close_old_bbq_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Close_old_bbq_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-toiletflush2", label: "Splachovanie toalety", emoji: "🚽", category: "Domácnosť", acceptedAnswers: ["splachovanie WC", "spláchnutie záchodu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Toilet_flush_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Toilet_flush_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-watertap", label: "Otvorenie vodovodného kohútika", emoji: "🚰", category: "Domácnosť", acceptedAnswers: ["tečúca voda z kohútika", "pustenie vody"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Water_tap_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Water_tap_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-pansclatter", label: "Nárazy hrncov a panvíc", emoji: "🍳", category: "Kuchyňa", acceptedAnswers: ["hrnce a panvice o sebe", "kuchynský riad naráža"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Pots_and_pans_hits_1_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Pots_and_pans_hits_1_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-cutlery-rustle", label: "Prehrabávanie sa v príboroch", emoji: "🍴", category: "Kuchyňa", acceptedAnswers: ["príbory sa hýbu", "hľadanie príboru v zásuvke"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Rustling_cutlery_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rustling_cutlery_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-cutlery-sort", label: "Triedenie príborov do zásuvky", emoji: "🍴", category: "Kuchyňa", acceptedAnswers: ["ukladanie príboru", "triedenie lyžíc a vidličiek"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Sorting_cutlery_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Sorting_cutlery_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-pillbottle", label: "Zatrasenie liekovky s tabletkami", emoji: "💊", category: "Zdravie", acceptedAnswers: ["hrkotanie tabletiek", "fľaštička s liekmi"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Pill_bottle_rattle_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Pill_bottle_rattle_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-watermelon-smack", label: "Buchnutie do vodového melónu", emoji: "🍉", category: "Kuchyňa", acceptedAnswers: ["testovanie zrelosti melóna", "tľapnutie na melón"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Watermelon_smack_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Watermelon_smack_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-nailsontile", label: "Škrabanie nechtami po dlaždici", emoji: "💅", category: "Domácnosť", acceptedAnswers: ["škrabanie po dlažbe", "zvuk nechtov na obklade"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/Nails_on_tile_once_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Nails_on_tile_once_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-stairs-squeak", label: "Vŕzganie schodov pri chôdzi dole", emoji: "🪜", category: "Domácnosť", acceptedAnswers: ["schody vŕzgajú", "chôdza po vŕzgajúcich schodoch"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Squeaky_stairs_down_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Squeaky_stairs_down_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-playground-swing", label: "Hojdačka na detskom ihrisku", emoji: "🛝", category: "Voľný čas", acceptedAnswers: ["škripot hojdačky", "hojdanie sa na ihrisku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Playground_swings_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Playground_swings_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-walkgravel", label: "Chôdza po štrkovej ceste", emoji: "🚶", category: "Príroda", acceptedAnswers: ["kroky po štrku", "šuchot štrku pod nohami"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/Walking_on_gravel_%28Gravity_Sound%29.mp3", sourcePage: "https://commons.wikimedia.org/wiki/File:Walking_on_gravel_(Gravity_Sound).mp3", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-sprinkler", label: "Cvakanie záhradného postrekovača", emoji: "💦", category: "Záhrada", acceptedAnswers: ["zavlažovací postrekovač", "otočný postrekovač trávnika"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Sprinkler_hit_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Sprinkler_hit_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-glassbreak", label: "Rozbitie sklenej výplne", emoji: "🔨", category: "Každodenné situácie", acceptedAnswers: ["rozbité sklo", "črepiny padajú na zem"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/af/Glass_breaking_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Glass_breaking_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-drawer-open", label: "Otváranie zásuvky", emoji: "🗄️", category: "Domácnosť", acceptedAnswers: ["vyťahovanie zásuvky", "zásuvka sa otvára"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Open_drawer_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Open_drawer_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-keys-shake", label: "Potriasanie kľúčmi vo vrecku", emoji: "🔑", category: "Každodenné situácie", acceptedAnswers: ["zvonenie kľúčov", "hľadanie kľúčov vo vrecku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Keys_shaking_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Keys_shaking_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-chair-drag", label: "Ťahanie stoličky po podlahe", emoji: "🪑", category: "Domácnosť", acceptedAnswers: ["šúchanie stoličky", "posúvanie stoličky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/78/Drag_chair_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Drag_chair_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-hose-drag", label: "Ťahanie záhradnej hadice po zemi", emoji: "🌿", category: "Záhrada", acceptedAnswers: ["vlečenie hadice", "posúvanie záhradnej hadice"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Dragging_a_hose_once_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Dragging_a_hose_once_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-glass-flick", label: "Cinknutie na okraj pohára", emoji: "🥂", category: "Voľný čas", acceptedAnswers: ["cinkanie na pohár", "prípitok cinkaním"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Flick_a_glass_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Flick_a_glass_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-bin-knock", label: "Buchnutie na kovový smetný kôš", emoji: "🗑️", category: "Mesto", acceptedAnswers: ["klopkanie na smetiak", "údery na kovový kontajner"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/Knock_on_bin_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Knock_on_bin_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-crunchy-eat", label: "Hrýzenie niečoho veľmi chrumkavého", emoji: "🍪", category: "Kuchyňa", acceptedAnswers: ["chrumkanie jedla", "hrýzanie chrumkavej pochúťky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/35/Eating_something_crunchy_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Eating_something_crunchy_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-tallgrass-swipe", label: "Prechádzanie vysokou trávou", emoji: "🌾", category: "Príroda", acceptedAnswers: ["šuchot trávy pri chôdzi", "kráčanie vysokou trávou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/Swiping_through_tall_grass_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Swiping_through_tall_grass_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-leaves-walk", label: "Šliapanie po lístí na zemi", emoji: "🍂", category: "Príroda", acceptedAnswers: ["chôdza po suchom lístí", "šuchot lístia pod nohami"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Walking_through_leaves_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Walking_through_leaves_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-woodbridge-walk", label: "Chôdza po drevenom mostíku", emoji: "🌉", category: "Príroda", acceptedAnswers: ["drevený mostík vŕzga", "kroky po dreve"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Walking_on_small_wooden_bridge_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Walking_on_small_wooden_bridge_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-rainleaves", label: "Dážď dopadajúci na listy stromov", emoji: "🌧️", category: "Príroda", acceptedAnswers: ["dážď na listoch", "kvapky dažďa na kríku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/92/Rain_on_leaves_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rain_on_leaves_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-metaldoor-rub", label: "Odieranie o kovové dvere", emoji: "🚪", category: "Mesto", acceptedAnswers: ["škrabanie po plechových dverách", "obrusovanie kovu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/Rubbing_metal_door_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rubbing_metal_door_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-sandal-brick", label: "Kroky v sandáloch po tehlovej dlažbe", emoji: "👡", category: "Mesto", acceptedAnswers: ["šľapanie po tehlách", "chôdza v sandáloch"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/77/Sandle_on_brick_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Sandle_on_brick_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-lock-squeaky", label: "Zamykanie vŕzgajúcich dverí", emoji: "🔒", category: "Domácnosť", acceptedAnswers: ["kľúč v zámke vŕzgajúcich dverí", "zamykanie starých dverí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Lock_squeaky_door_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Lock_squeaky_door_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-glassontile", label: "Postavenie skleneného pohára na dlaždicu", emoji: "🥛", category: "Kuchyňa", acceptedAnswers: ["odloženie pohára na obklad", "cinknutie skla o dlažbu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Placing_glass_object_on_tile_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Placing_glass_object_on_tile_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-plate-tile", label: "Posunutie taniera po kuchynskej dlaždici", emoji: "🍽️", category: "Kuchyňa", acceptedAnswers: ["šúchanie taniera po dlažbe"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Shove_plate_on_tile_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Shove_plate_on_tile_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-leaf-stick", label: "Búchanie do listu paličkou", emoji: "🌿", category: "Príroda", acceptedAnswers: ["udieranie listu paličkou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/Smacking_leaf_with_stick_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Smacking_leaf_with_stick_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-stick-metalframe", label: "Ťahanie paličky po kovovom ráme", emoji: "🔧", category: "Mesto", acceptedAnswers: ["rapkanie paličky o mreže", "palička po kovovej konštrukcii"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Stick_on_metal_frame_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Stick_on_metal_frame_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-closet-open", label: "Rozotváranie skriňových dverí", emoji: "🚪", category: "Domácnosť", acceptedAnswers: ["otváranie skrine", "dvere skrine sa otvárajú"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Swing_open_closet_door_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Swing_open_closet_door_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-hose-drop", label: "Pustenie zrolovanej hadice na zem", emoji: "🌿", category: "Záhrada", acceptedAnswers: ["hodenie zrolovanej hadice", "pád hadice na zem"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/79/Dropping_rolled_up_water_hose_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Dropping_rolled_up_water_hose_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-closet-slam", label: "Prirazenie dverí skrine", emoji: "🚪", category: "Domácnosť", acceptedAnswers: ["búchanie dverí skrine", "zaklapnutie skrine"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Slam_closet_door_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Slam_closet_door_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-ac-hum", label: "Hukot vonkajšej klimatizačnej jednotky", emoji: "❄️", category: "Technológie", acceptedAnswers: ["bzučanie klimatizácie", "vonkajšia jednotka klímy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/99/Air_conditioner_hum_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Air_conditioner_hum_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-rocks-hit", label: "Udieranie dvoch kameňov o sebe", emoji: "🪨", category: "Príroda", acceptedAnswers: ["kamene narážajú", "tlkot kameňov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/14/Rocks_hitting_together_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rocks_hitting_together_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-metalpole-hit", label: "Udieranie na kovovú tyč", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["búchanie do kovovej tyče", "kovová tyč rezonuje"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Metal_pole_hit_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Metal_pole_hit_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-door-creak", label: "Škrípajúce otváranie starých dverí", emoji: "🚪", category: "Domácnosť", acceptedAnswers: ["vŕzganie dverí", "otváranie vŕzgajúcich dverí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Dreadful_jarring_of_dis.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Dreadful_jarring_of_dis.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk2-scissors-paper2", label: "Strihanie papiera nožnicami", emoji: "✂️", category: "Škola a kancelária", acceptedAnswers: ["strihanie nožnicami", "rezanie papiera"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/78/WWS_Paper-cuttingscissorsSloveniaPartisanPrintingShop.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Paper-cuttingscissorsSloveniaPartisanPrintingShop.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-lighter-flick", label: "Zapaľovanie plynového zapaľovača", emoji: "🔥", category: "Každodenné situácie", acceptedAnswers: ["cvaknutie zapaľovača", "zažíhanie zapaľovača"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/Cheap_cigarette_lighter.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Cheap_cigarette_lighter.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk2-spraybottle", label: "Striekanie z rozprašovača", emoji: "💦", category: "Domácnosť", acceptedAnswers: ["pump sprej", "striekačka na rastliny"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Pumpspray_pfft.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Pumpspray_pfft.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk2-smokealarm", label: "Pípanie požiarneho detektora", emoji: "🚨", category: "Bezpečnosť", acceptedAnswers: ["dymový hlásič píska", "alarm na dym"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Smoke_alarm.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Smoke_alarm.ogg", credit: "cori (PDSounds)", license: "Public domain" },
  { id: "sk2-lightswitch", label: "Cvaknutie vypínača svetla", emoji: "💡", category: "Domácnosť", acceptedAnswers: ["zapnutie svetla", "cvaknutie svetla"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Clickick_switch.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Clickick_switch.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk2-coffeegrinder", label: "Mlynček mlie kávové zrná", emoji: "☕", category: "Kuchyňa", acceptedAnswers: ["mletie kávy", "kávový mlynček"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/Coffee_grinder.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Coffee_grinder.ogg", credit: "smijen (PDSounds)", license: "Public domain" },
  { id: "sk2-kettlewhistle", label: "Pískajúca kanvica na sporáku", emoji: "♨️", category: "Kuchyňa", acceptedAnswers: ["kanvica píska pri vare", "varná kanvica píska"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/70/Tea_kettle_whistle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Tea_kettle_whistle.ogg", credit: "Luisalvaz", license: "CC BY-SA 4.0" },
  { id: "sk2-pourtea", label: "Nalievanie vriacej vody do hrnčeka", emoji: "☕", category: "Kuchyňa", acceptedAnswers: ["nalievanie horúcej vody", "príprava čaju nalievaním"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/69/Boiling_water_being_poured_into_a_mug_for_tea.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Boiling_water_being_poured_into_a_mug_for_tea.ogg", credit: "cori (PDSounds)", license: "Public domain" },
  { id: "sk2-sinkdrain", label: "Vytekanie vody z drezu", emoji: "🚰", category: "Kuchyňa", acceptedAnswers: ["odtekanie vody z umývadla", "kuchynský drez sa vypúšťa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Kitchen_sink_draining_water.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Kitchen_sink_draining_water.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk2-eggtimer", label: "Tikanie kuchynského vajíčkového časovača", emoji: "⏱️", category: "Kuchyňa", acceptedAnswers: ["kuchynský časovač tiká", "minútka na varenie vajíčok"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/da/Ticking_of_an_egg_timer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Ticking_of_an_egg_timer.ogg", credit: "Jeuwre", license: "CC BY-SA 4.0" },
  { id: "sk2-seatbelt", label: "Zapínanie bezpečnostného pásu v aute", emoji: "🚗", category: "Doprava", acceptedAnswers: ["cvaknutie bezpečnostného pásu", "zapnutie pásu v aute"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Buckling_on_seatbelt_clattering.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Buckling_on_seatbelt_clattering.ogg", credit: "natalie (PDSounds)", license: "Public domain" },
  { id: "sk2-bikebell", label: "Zazvonenie na bicyklový zvonček", emoji: "🚲", category: "Doprava", acceptedAnswers: ["cyklistický zvonček", "zvonenie na bicykli"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/97/156064_marcolo91_bicycle-bell.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:156064_marcolo91_bicycle-bell.wav", credit: "marcolo91 (Freesound)", license: "CC0" },
  { id: "sk2-motorbike-exhaust", label: "Výfuk historickej motorky", emoji: "🏍️", category: "Doprava", acceptedAnswers: ["motorka nastartovaná", "zvuk výfuku motocykla"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Jawa250_motorbike_exhaust_sound.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Jawa250_motorbike_exhaust_sound.ogg", credit: "Wikimedia Commons contributor", license: "Public domain" },
  { id: "sk2-airplane-chime", label: "Signálny tón v lietadle", emoji: "✈️", category: "Doprava", acceptedAnswers: ["zvonček v lietadle", "upozornenie na pripútanie v lietadle"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Airplane_Chime_Sound_Effect.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Airplane_Chime_Sound_Effect.ogg", credit: "Wikimedia Commons contributor", license: "CC0" },
  { id: "sk2-crossingbell", label: "Zvonenie na železničnom priecestí", emoji: "🚦", category: "Doprava", acceptedAnswers: ["priecestný zvonec", "výstražný zvonec pri závorách"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Barrierenglocke_gross_Bronze_Ob_00934.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Barrierenglocke_gross_Bronze_Ob_00934.ogg", credit: "SBB", license: "CC BY-SA 4.0" },
  { id: "sk2-bee-buzz", label: "Bzučanie včely pri kvete", emoji: "🐝", category: "Príroda", acceptedAnswers: ["včela bzučí", "bzukot včely"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Bee_buzzing_sound_%28animal_noises%29.opus", sourcePage: "https://commons.wikimedia.org/wiki/File:Bee_buzzing_sound_(animal_noises).opus", credit: "freesoundslibrary.com", license: "CC BY 3.0" },
  { id: "sk2-cicadas", label: "Spev cikád v lete", emoji: "🦗", category: "Príroda", acceptedAnswers: ["cikády cvrlikajú", "letné cvrlikanie hmyzu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Cicada_sound.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Cicada_sound.ogg", credit: "Wiki Loves Butterfly contributor", license: "CC BY-SA 4.0" },
  { id: "sk2-frogchorus", label: "Kvákanie žiab pri rybníku v noci", emoji: "🐸", category: "Príroda", acceptedAnswers: ["žabí koncert", "kvákanie žiab v noci"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/Frogs_croak_calling_chorus_at_night.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Frogs_croak_calling_chorus_at_night.ogg", credit: "Wikimedia Commons contributor", license: "CC BY-SA 4.0" },
  { id: "sk2-donkey-bray", label: "Hýkanie osla", emoji: "🫏", category: "Zvieratá", acceptedAnswers: ["osol hýka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/25/157763_felix-blume_a-donkey-is-braying-in-his-enclosure-in-south-of-france.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:157763_felix-blume_a-donkey-is-braying-in-his-enclosure-in-south-of-france.wav", credit: "felix-blume (Freesound)", license: "CC0" },
  { id: "sk2-hen-egg", label: "Kotkodákanie sliepky po vyliahnutí vajca", emoji: "🐔", category: "Zvieratá", acceptedAnswers: ["sliepka oznamuje vajce", "kvokanie po vyliahnutí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Hen_announcing_shes_lain_an_egg.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Hen_announcing_shes_lain_an_egg.ogg", credit: "alys (PDSounds)", license: "Public domain" },
  { id: "sk2-campfire", label: "Praskanie ohňa v peci kováča", emoji: "🔥", category: "Príroda", acceptedAnswers: ["praskajúci oheň", "horenie dreva v ohnisku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/WWS_Fireoftheforge.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Fireoftheforge.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-gravel-footstep", label: "Kroky po štrkovej cestičke", emoji: "🚶", category: "Príroda", acceptedAnswers: ["šuchot štrku pod nohami", "chôdza po chodníku so štrkom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Footstep_on_Gravel_%28Gravity_Sound%29.mp3", sourcePage: "https://commons.wikimedia.org/wiki/File:Footstep_on_Gravel_(Gravity_Sound).mp3", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk2-pedestriancrossing", label: "Zvukový signál na priechode pre chodcov", emoji: "🚦", category: "Mesto", acceptedAnswers: ["akustický semafor", "pípanie na priechode pre chodcov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Pedestrian_crossing_audio.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Pedestrian_crossing_audio.wav", credit: "Wikimedia Commons contributor", license: "CC0" },
  { id: "sk2-schoolbell", label: "Zvonenie školského zvonca", emoji: "🔔", category: "Škola a kancelária", acceptedAnswers: ["školský zvonec", "zvonenie na hodinu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Electronic_Tone_School_Bell_Sound.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Electronic_Tone_School_Bell_Sound.wav", credit: "Wikimedia Commons contributor", license: "CC BY-SA 4.0" },
  { id: "sk2-chalkboard", label: "Písanie kriedou na tabuľu", emoji: "📝", category: "Škola a kancelária", acceptedAnswers: ["kreda škrípe po tabuli", "písanie na školskej tabuli"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Chalkboard-writing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Chalkboard-writing.ogg", credit: "Wikimedia Commons contributor", license: "CC0" },
  { id: "sk2-pencilsharp-el", label: "Elektrický strojček na ceruzky", emoji: "✏️", category: "Škola a kancelária", acceptedAnswers: ["orezávanie ceruzky elektricky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/54/Electric_pencil_sharpener.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Electric_pencil_sharpener.ogg", credit: "tamanders (PDSounds)", license: "Public domain" },
  { id: "sk2-pageturn", label: "Otáčanie stránky v knihe", emoji: "📖", category: "Škola a kancelária", acceptedAnswers: ["listovanie v knihe", "otočenie strany knihy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Turning_a_page.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Turning_a_page.ogg", credit: "planish (PDSounds)", license: "Public domain" },
  { id: "sk2-camerashutter", label: "Cvaknutie spúšte fotoaparátu", emoji: "📷", category: "Technológie", acceptedAnswers: ["spúšť fotoaparátu cvakla", "fotografovanie zrkadlovkou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/Canon_T50_shutter_noise.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Canon_T50_shutter_noise.ogg", credit: "Wikimedia Commons contributor", license: "CC BY-SA 3.0" },
  { id: "sk2-refereewhistle", label: "Píšťalka rozhodcu v hale", emoji: "⚽", category: "Šport", acceptedAnswers: ["rozhodca píska", "píšťalka na zápase"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/218318_splicesound_referee-whistle-blow-gymnasium.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:218318_splicesound_referee-whistle-blow-gymnasium.wav", credit: "splicesound (Freesound)", license: "CC0" },
  { id: "sk2-stadiumcrowd", label: "Fanúšikovia na futbalovom štadióne", emoji: "⚽", category: "Šport", acceptedAnswers: ["fanúšikovia na tribúne", "ozývanie sa davu na štadióne"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/WWS_FootballAustriavs.Sweden.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_FootballAustriavs.Sweden.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-bathsplash", label: "Špliechanie vody vo vani", emoji: "🛁", category: "Domácnosť", acceptedAnswers: ["voda špliecha vo vani", "kúpanie sa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/83/Bathtub_water_splashes.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Bathtub_water_splashes.ogg", credit: "gradha (PDSounds)", license: "Public domain" },
  { id: "sk2-woodsaw-hand", label: "Rezanie dreva ručnou pílou", emoji: "🪚", category: "Nástroje", acceptedAnswers: ["ručná píla na drevo", "rezanie dreva pílkou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2d/WWS_Wheelwrightwoodsaw.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Wheelwrightwoodsaw.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk2-cordlessscrew", label: "Akumulátorový skrutkovač", emoji: "🔩", category: "Nástroje", acceptedAnswers: ["elektrický skrutkovač", "uťahovanie skrutky vrtačkou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Akkuschrauber_%E2%80%93_Cordless_Screwdriver.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Akkuschrauber_%E2%80%93_Cordless_Screwdriver.ogg", credit: "Wikimedia Commons contributor", license: "CC BY-SA 4.0" },
  { id: "sk2-cashregister2", label: "Otvorenie zásuvky pokladne", emoji: "🧾", category: "Obchod", acceptedAnswers: ["pokladňa sa otvára", "zvuk otvorenej kasy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/70/Cash_register.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Cash_register.ogg", credit: "Wikimedia Commons contributor", license: "Public domain" },
  { id: "sk2-coins-moneybox", label: "Hádzanie mincí do kovovej pokladničky", emoji: "🪙", category: "Každodenné situácie", acceptedAnswers: ["mince padajú do pokladničky", "hrkot mincí v plechovej krabičke"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Coins_dropped_in_metallic_moneybox.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Coins_dropped_in_metallic_moneybox.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk2-snaredrum", label: "Údery na okraj bubna", emoji: "🥁", category: "Nástroje", acceptedAnswers: ["bubeník udiera na obruč bubna", "rimshot na bicích"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/Snare_drum_rim.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Snare_drum_rim.ogg", credit: "Wikimedia Commons contributor", license: "CC BY-SA 3.0" },
  { id: "sk2-harmonica", label: "Hranie na ústnej harmonike", emoji: "🎵", category: "Nástroje", acceptedAnswers: ["ústna harmonika", "hra na harmoniku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Harmonica_02.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Harmonica_02.ogg", credit: "mastermesh (PDSounds)", license: "Public domain" },
  { id: "sk2-electricrazor", label: "Holenie elektrickým holiacim strojkom", emoji: "🪒", category: "Zdravie", acceptedAnswers: ["elektrický strojček na holenie", "holenie strojčekom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/Elektrorasur-01.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Elektrorasur-01.ogg", credit: "Priwo", license: "Public domain" },
  { id: "sk2-washingmachine-spin", label: "Odstreďovanie práčky", emoji: "🧺", category: "Domácnosť", acceptedAnswers: ["práčka odstreďuje", "posledné odstreďovanie bielizne"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Washing_machine_last_spin.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Washing_machine_last_spin.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk2-mechkeyboard", label: "Písanie na mechanickej klávesnici", emoji: "⌨️", category: "Technológie", acceptedAnswers: ["klepanie na klávesnici", "mechanická klávesnica"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/16/IBM_M2_sound.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:IBM_M2_sound.ogg", credit: "Wikimedia Commons contributor", license: "CC0" },
  { id: "sk2-mouseclick", label: "Kliknutie počítačovou myšou", emoji: "🖱️", category: "Technológie", acceptedAnswers: ["kliknutie myšou", "cvaknutie počítačovej myši"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Computer_Mouse_Click.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Computer_Mouse_Click.wav", credit: "Wikimedia Commons contributor", license: "CC0" },
  { id: "sk2-anglegrinder", label: "Rozbrusovačka rezajúca oceľovú reťaz", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["uhlová brúska", "rezanie kovu brúskou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Angle_Grinder_cutting_a_steel_chain_-_Soundbite.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Angle_Grinder_cutting_a_steel_chain_-_Soundbite.ogg", credit: "Wikimedia Commons contributor", license: "CC BY-SA 4.0" },
  { id: "sk2-owlhoot", label: "Húkanie sovy v noci", emoji: "🦉", category: "Príroda", acceptedAnswers: ["sova húka", "nočné húkanie vtáka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Strix_aluco_-_Tawny_Owl_XC457393.mp3", sourcePage: "https://commons.wikimedia.org/wiki/File:Strix_aluco_-_Tawny_Owl_XC457393.mp3", credit: "Xeno-canto contributor", license: "CC BY-SA 4.0" },
];


/**
 * Dávka 2 novej databázy. Rozšírenie o dopravu, remeslá, prírodu a technické
 * profesie z Wikimedia Commons (Work With Sounds, Gravity Sound a jednotlivo
 * overené nahrávky). Rovnaký overovací postup ako pri dávke 1.
 */
const EXPANDED_SOUND_CLUES_2: SoundClue[] = [
  { id: "sk3-aircompressor", label: "Vzduchový kompresor v dielni", emoji: "💨", category: "Nástroje", acceptedAnswers: ["stláčaný vzduch", "hukot kompresora"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/WWS_Aircompressor.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Aircompressor.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-alarmclock2", label: "Klasický budík na nočnom stolíku", emoji: "⏰", category: "Domácnosť", acceptedAnswers: ["staromódny budík"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f3/WWS_Alarmclock.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Alarmclock.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-bonfire-burn", label: "Praskajúca vatra na oslave", emoji: "🔥", category: "Voľný čas", acceptedAnswers: ["horiaca vatra", "táborový oheň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/70/WWS_Bonfireburning.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Bonfireburning.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-bonfire-ignite", label: "Zapaľovanie veľkej vatry", emoji: "🔥", category: "Voľný čas", acceptedAnswers: ["podpaľovanie vatry"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9f/WWS_Bonfireignition.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Bonfireignition.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-mitresaw", label: "Pokosová píla v dielni", emoji: "🪚", category: "Nástroje", acceptedAnswers: ["rezanie pokosovou pílou", "stolová pokosová píla"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/WWS_Boschslidingmitresaw.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Boschslidingmitresaw.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-cookerhood", label: "Digestor nad sporákom", emoji: "🍳", category: "Kuchyňa", acceptedAnswers: ["odsávač pár", "kuchynský digestor"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/WWS_Cookerhood.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Cookerhood.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-crane-lift", label: "Zdvíhací žeriav pri stavbe", emoji: "🏗️", category: "Mesto", acceptedAnswers: ["stavebný žeriav", "žeriav dvíha bremeno"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/WWS_Crane.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Crane.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-cashregister-electronic", label: "Elektronická pokladňa pri účtovaní", emoji: "🧾", category: "Obchod", acceptedAnswers: ["moderná pokladňa", "elektronická kasa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e4/WWS_Electroniccashregister.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Electroniccashregister.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-christmastree-cut", label: "Rezanie vianočného stromčeka", emoji: "🎄", category: "Voľný čas", acceptedAnswers: ["stínanie stromčeka", "píla na vianočný strom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f6/WWS_FellingaChristmastree.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_FellingaChristmastree.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-firehose-fill", label: "Napĺňanie hasičskej hadice vodou", emoji: "🧯", category: "Bezpečnosť", acceptedAnswers: ["hasičská hadica sa plní", "tlak vody v hadici"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/76/WWS_FireHoseMaintenancemachine8211Hoseisfilledwithwater.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_FireHoseMaintenancemachine8211Hoseisfilledwithwater.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-firetruck-siren2", label: "Siréna hasičského vozu", emoji: "🚒", category: "Doprava", acceptedAnswers: ["hasičská siréna", "hasiči vyrážajú"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/WWS_Fireenginesiren.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Fireenginesiren.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-firetruck-driverseat", label: "Hasičské auto z pohľadu vodiča", emoji: "🚒", category: "Doprava", acceptedAnswers: ["jazda hasičským autom", "hasiči v aute"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/WWS_Firetruckrecordedfromdriver8217sseat.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Firetruckrecordedfromdriver8217sseat.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-fishingvessel", label: "Rybárska loď na mori", emoji: "🚢", category: "Doprava", acceptedAnswers: ["rybárska loď", "motor rybárskej lode"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/53/WWS_Fishingvessel.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Fishingvessel.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-floralfridge", label: "Chladnička na kvetiny v predajni", emoji: "🌷", category: "Obchod", acceptedAnswers: ["chladiaca vitrína na kvety", "kvetinárska chladnička"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/WWS_Floralrefrigerator.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Floralrefrigerator.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-forklift", label: "Vysokozdvižný vozík v sklade", emoji: "🏗️", category: "Nástroje", acceptedAnswers: ["vysokozdvižný vozík", "vozík dvíha paletu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/ff/WWS_Forklifttruck.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Forklifttruck.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-guillotine-paper", label: "Rezačka papiera v tlačiarni", emoji: "📄", category: "Škola a kancelária", acceptedAnswers: ["papierová rezačka", "gilotína na papier"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/WWS_GuillotineKarlKrauseLeipzig.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_GuillotineKarlKrauseLeipzig.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-handwelding", label: "Ručné zváranie kovu", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["zváračka", "iskrenie pri zváraní"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cb/WWS_Handweldingmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Handweldingmachine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-hedgetrimmer2", label: "Strihanie živého plota nožnicami", emoji: "✂️", category: "Záhrada", acceptedAnswers: ["záhradnícke nožnice na krík"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/WWS_Hedgetrimmer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Hedgetrimmer.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-hoist", label: "Zdvíhanie bremena kladkostrojom", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["kladkostroj", "ručný zdvihák"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/24/WWS_Hoist.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Hoist.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-horseshoes-street", label: "Klopkanie konských podkov na dlažbe", emoji: "🐎", category: "Mesto", acceptedAnswers: ["kôň na dlažbe", "podkovy na kamennej ceste"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/50/WWS_Horseshoesonstonepavedstreet.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Horseshoesonstonepavedstreet.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-icebreaker-bell", label: "Zvon na palube ľadoborca", emoji: "🚢", category: "Doprava", acceptedAnswers: ["loďný zvon", "zvonenie na ľadoborci"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3d/WWS_IcebreakerKunashipsbell.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_IcebreakerKunashipsbell.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-icebreaker-siren", label: "Siréna ľadoborca", emoji: "🚢", category: "Doprava", acceptedAnswers: ["húkanie lode", "siréna veľkej lode"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/WWS_IcebreakerKunashipssiren.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_IcebreakerKunashipssiren.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-johndeere", label: "Poľnohospodársky traktor pri práci", emoji: "🚜", category: "Doprava", acceptedAnswers: ["traktor na poli", "motor traktora"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/WWS_JohnDeereTractor.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_JohnDeereTractor.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-metro", label: "Vlak metra v tuneli", emoji: "🚇", category: "Doprava", acceptedAnswers: ["metro prechádza tunelom", "podzemná vlaková súprava"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/WWS_Metro.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Metro.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-milkingclean", label: "Umývanie dojacieho zariadenia", emoji: "🐄", category: "Príroda", acceptedAnswers: ["čistenie dojacej jednotky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/55/WWS_MilkingMachineCleaningUnit.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_MilkingMachineCleaningUnit.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-mopedengine", label: "Motor malej motorky", emoji: "🛵", category: "Doprava", acceptedAnswers: ["štartovanie motorky", "malá motorka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/WWS_MotorcycleTOMOSD7.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_MotorcycleTOMOSD7.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-magneticcard", label: "Vymazávanie údajov na magnetickej karte", emoji: "💳", category: "Technológie", acceptedAnswers: ["magnetický pásik karty", "stará čipová karta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/WWS_Obliterationofamagneticcard.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Obliterationofamagneticcard.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-olivemill", label: "Mlyn na olivy pri lisovaní", emoji: "🫒", category: "Kuchyňa", acceptedAnswers: ["olivový mlyn", "spracovanie olív"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a3/WWS_OliveMill.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_OliveMill.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-olivepress", label: "Lis na olivový olej", emoji: "🫒", category: "Kuchyňa", acceptedAnswers: ["lisovanie oliv na olej"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c4/WWS_OlivePress.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_OlivePress.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-train-vienna", label: "Jazda vlakom do Viedne", emoji: "🚆", category: "Doprava", acceptedAnswers: ["cestovanie vlakom", "vlak na trati"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/WWS_OnthetraintoVienna.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_OnthetraintoVienna.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-petroltanker", label: "Cisternový kamión s palivom", emoji: "🚛", category: "Doprava", acceptedAnswers: ["cisterna s benzínom", "tankovacie auto"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/WWS_PetrolTanker.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_PetrolTanker.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-piledriving", label: "Zarážanie pilóty do zeme", emoji: "🏗️", category: "Mesto", acceptedAnswers: ["pilotovací stroj", "zarážanie základov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/WWS_PileDrivingRigFirstpile.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_PileDrivingRigFirstpile.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-polishingmachine", label: "Leštiaci stroj na kov", emoji: "✨", category: "Nástroje", acceptedAnswers: ["leštenie kovu", "leštička"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/WWS_Polishingmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Polishingmachine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-steamloco-p8", label: "Parná lokomotíva v premávke", emoji: "🚂", category: "Doprava", acceptedAnswers: ["stará parná rušňa", "historický vlak"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/be/WWS_PrussianpassengersteamlocomotiveP-8.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_PrussianpassengersteamlocomotiveP-8.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-waterpump", label: "Vodné čerpadlo v prevádzke", emoji: "🚰", category: "Nástroje", acceptedAnswers: ["čerpanie vody", "hukot čerpadla"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/WWS_Pump.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Pump.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-punchingpress", label: "Vysekávací lis na plech", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["lisovanie plechu", "vysekávací stroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/WWS_Punchingpress.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Punchingpress.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-turntable-rail", label: "Otočná koľajová platforma pre lokomotívy", emoji: "🚂", category: "Doprava", acceptedAnswers: ["otočňa pre vlaky", "otáčanie lokomotívy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8e/WWS_Railwayturntable.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Railwayturntable.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-reversevending", label: "Automat na vrátenie obalov", emoji: "♻️", category: "Obchod", acceptedAnswers: ["automat na PET flaše", "recyklačný automat"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d0/WWS_Reversevendingmachinefromthecustomersside.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Reversevendingmachinefromthecustomersside.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-revolvingstage", label: "Otáčajúce sa javisko divadla", emoji: "🎭", category: "Voľný čas", acceptedAnswers: ["divadelné otočné javisko"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/WWS_REVOLVINGTHEATRESTAGEonthestage.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_REVOLVINGTHEATRESTAGEonthestage.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-ringpolish", label: "Leštenie prsteňa u zlatníka", emoji: "💍", category: "Obchod", acceptedAnswers: ["leštenie šperku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/92/WWS_Ringpolishing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Ringpolishing.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-rivetingmachine", label: "Klincovací stroj kovových spojov", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["nitovací stroj", "klincovanie kovu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/WWS_Rivetingmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Rivetingmachine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-sandblasting", label: "Pieskovanie lodného trupu", emoji: "🚢", category: "Nástroje", acceptedAnswers: ["tryskanie piesku na kov", "pieskovací prístroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/WWS_Sandblastingashiphull.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Sandblastingashiphull.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-santaworkshop", label: "Vianočná dielňa s hračkami", emoji: "🎁", category: "Voľný čas", acceptedAnswers: ["výroba hračiek", "vianočná továreň na darčeky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/83/WWS_Santa8217sToyfactory.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Santa8217sToyfactory.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-sewingmachine", label: "Šijací stroj pri práci", emoji: "🧵", category: "Domácnosť", acceptedAnswers: ["šitie na stroji", "krajčírsky stroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9f/WWS_SewingMachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_SewingMachine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-christmaswafer", label: "Delenie vianočného oplátku", emoji: "🎄", category: "Voľný čas", acceptedAnswers: ["vianočný oplátok", "tradičné lámanie oplátku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/32/WWS_SharingtheChristmaswaferopatek.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_SharingtheChristmaswaferopatek.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-shipyardcrane", label: "Prístavný žeriav pri nakladaní", emoji: "🏗️", category: "Mesto", acceptedAnswers: ["žeriav v prístave", "nakladanie kontajnerov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/WWS_Shipyardcrane.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Shipyardcrane.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-shoebrush", label: "Kefovanie topánky u obuvníka", emoji: "👞", category: "Obchod", acceptedAnswers: ["čistenie topánky kefou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ee/WWS_ShoemakerBrushing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_ShoemakerBrushing.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-shoenails", label: "Zatĺkanie drevených klincov do topánky", emoji: "👞", category: "Obchod", acceptedAnswers: ["obuvník zatĺka klince"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/WWS_Shoemakerhammeringwoodennails.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Shoemakerhammeringwoodennails.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-shoesole", label: "Prišívanie podrážky k topánke", emoji: "👞", category: "Obchod", acceptedAnswers: ["pripevňovanie podrážky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/WWS_ShoemakerSolenailing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_ShoemakerSolenailing.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-shovelcoal", label: "Prihadzovanie uhlia do kotla", emoji: "🔥", category: "Nástroje", acceptedAnswers: ["kúrenie uhlím", "lopata na uhlie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/WWS_Shovelingcoalintheboiler.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Shovelingcoalintheboiler.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-signalbell", label: "Signálny zvonec pri práci", emoji: "🔔", category: "Bezpečnosť", acceptedAnswers: ["výstražný zvonec"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/WWS_Signalbell.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Signalbell.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-smithy-bellows", label: "Kováčske dýzy rozdúchavajú oheň", emoji: "🔥", category: "Nástroje", acceptedAnswers: ["kováčska vyhňa", "dýchacie mechy kováča"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c4/WWS_Smithyblacksmithbellows1.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Smithyblacksmithbellows1.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-smithy-forge", label: "Kováč tvaruje rozžeravenú oceľ", emoji: "🔨", category: "Nástroje", acceptedAnswers: ["kováčske kovanie", "kováč buchá kladivom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/50/WWS_Smithysteelforging2.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Smithysteelforging2.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-steamengine-bell", label: "Parný stroj so signálnym zvoncom", emoji: "🚂", category: "Doprava", acceptedAnswers: ["parný rušeň so zvoncom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3a/WWS_Steamengineandsignalbell.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Steamengineandsignalbell.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-threshing1", label: "Mlátenie obilia ručnými bijakmi", emoji: "🌾", category: "Príroda", acceptedAnswers: ["ručné mlátenie obilia"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/54/WWS_Threshingwithhandflailstwomenthreshing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Threshingwithhandflailstwomenthreshing.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-tumblingbarrel", label: "Otáčajúci sa leštiaci bubon", emoji: "🛠️", category: "Nástroje", acceptedAnswers: ["leštiaci bubon s dielikmi"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/WWS_Tumblingbarrel.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Tumblingbarrel.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-lathe-turning", label: "Sústruženie kovu na sústruhu", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["sústruh opracúva kov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/WWS_Turningonalathe.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Turningonalathe.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-wardrobechain", label: "Reťaz spúšťajúca šatňovú tyč", emoji: "🚪", category: "Domácnosť", acceptedAnswers: ["spúšťanie vešiakovej tyče"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c2/WWS_Wardrobechainloweringandraising.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Wardrobechainloweringandraising.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-watersmithy-hammer", label: "Vodou poháňané kováčske kladivo", emoji: "🔨", category: "Nástroje", acceptedAnswers: ["vodné kováčske kladivo", "hydraulické kovanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/WWS_Watersmithyforgingwithtwohammers.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Watersmithyforgingwithtwohammers.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-waterwheel", label: "Vodné koleso mlyna sa otáča", emoji: "💧", category: "Príroda", acceptedAnswers: ["mlynské vodné koleso"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/WWS_Waterwheel.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Waterwheel.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-welding-generic", label: "Zváranie kovu elektrickým oblúkom", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["iskrenie zváračky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d4/WWS_Welding.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Welding.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-wetsponge", label: "Vyžmýkanie mokrej hubky", emoji: "🧽", category: "Domácnosť", acceptedAnswers: ["žmýkanie hubky", "mokrá hubka na umývanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/WWS_Wetsponge.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Wetsponge.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-wheelwright-carve", label: "Kolár vyrezáva drevený lúč kolesa", emoji: "🪵", category: "Nástroje", acceptedAnswers: ["výroba dreveného kolesa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/WWS_Wheelwrightcarvingaspoke.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Wheelwrightcarvingaspoke.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-wheelwright-plane", label: "Hobľovanie dreva kolárom", emoji: "🪵", category: "Nástroje", acceptedAnswers: ["hobľovanie dreveného kolesa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/WWS_Wheelwrightwoodplaning.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Wheelwrightwoodplaning.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-windturbine", label: "Veterná turbína v prevádzke", emoji: "💨", category: "Príroda", acceptedAnswers: ["veterná elektráreň", "otáčanie veternej turbíny"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/WWS_WindTurbine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_WindTurbine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-woodenbarrel", label: "Kotúľanie dreveného sudu", emoji: "🛢️", category: "Domácnosť", acceptedAnswers: ["drevený sud sa kotúľa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/WWS_Woodenbarrel.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Woodenbarrel.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-woodenwagon", label: "Drevený vozík na kolesách", emoji: "🛒", category: "Domácnosť", acceptedAnswers: ["vŕzganie dreveného vozíka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/WWS_Woodenwagon.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Woodenwagon.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-threshing2", label: "Mlátenie obilia dvojicami bijakov", emoji: "🌾", category: "Príroda", acceptedAnswers: ["obilné bijaky pri mlátení"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a8/WWS_Threshingwithhandflailstwopairs.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Threshingwithhandflailstwopairs.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-millstone", label: "Otáčanie mlynského kameňa", emoji: "🌾", category: "Príroda", acceptedAnswers: ["mlynský kameň mele obilie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ef/WWS_Quern-stones.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Quern-stones.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-chalk-write", label: "Písanie kriedou na tabuľu v škole", emoji: "📝", category: "Škola a kancelária", acceptedAnswers: ["kriedou po tabuli"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/WWS_Chalk.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Chalk.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-cinemaseat", label: "Skladacia sedačka v kine", emoji: "🎬", category: "Voľný čas", acceptedAnswers: ["kinosálová sedačka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1d/WWS_Cinemaseat.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Cinemaseat.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-van-starting", label: "Nastavovanie dodávkového auta", emoji: "🚐", category: "Doprava", acceptedAnswers: ["štartovanie dodávky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b0/WWS_FSRTarpan239Dvanstarting.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_FSRTarpan239Dvanstarting.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-gasdetector", label: "Detektor plynu pri poplachu", emoji: "⚠️", category: "Bezpečnosť", acceptedAnswers: ["plynový senzor píska"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6c/WWS_Gasdetector.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Gasdetector.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-graindryer", label: "Sušička obilia na farme", emoji: "🌾", category: "Príroda", acceptedAnswers: ["sušenie zrna"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/WWS_Graindryer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Graindryer.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-handgrinder", label: "Ručný mlynček na orechy", emoji: "🌰", category: "Kuchyňa", acceptedAnswers: ["ručné mletie orechov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/WWS_Grindingnutswithahandgrinder.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Grindingnutswithahandgrinder.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-recordstore", label: "Prehrávanie platne v obchode s hudbou", emoji: "🎵", category: "Obchod", acceptedAnswers: ["gramofónová platňa hrá"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/52/WWS_InTheRecordStore.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_InTheRecordStore.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-milkingunit", label: "Dojacia jednotka v prevádzke", emoji: "🐄", category: "Príroda", acceptedAnswers: ["dojacie zariadenie na farme"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/WWS_Milkingunit.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Milkingunit.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-pokermachine", label: "Hazardný výherný automat", emoji: "🎰", category: "Voľný čas", acceptedAnswers: ["výherný automat", "hranie na automate"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/af/WWS_PokerMacine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_PokerMacine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk3-achum2", label: "Druhá vetracia jednotka klimatizácie", emoji: "❄️", category: "Technológie", acceptedAnswers: ["klimatizácia hučí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Air_conditioner_hum_2_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Air_conditioner_hum_2_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-airvent", label: "Vzduchová vetracia mriežka", emoji: "💨", category: "Domácnosť", acceptedAnswers: ["ventilačný prieduch", "hukot vzduchotechniky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Air_vent_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Air_vent_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-backyard", label: "Zvuky na dvore za domom", emoji: "🏡", category: "Príroda", acceptedAnswers: ["atmosféra na záhrade", "vtáky na dvore"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Backyard_ambience_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Backyard_ambience_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-binhits", label: "Narážanie do smetnej nádoby", emoji: "🗑️", category: "Mesto", acceptedAnswers: ["búchanie do koša na odpad"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Bin_hits_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Bin_hits_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-bladegrass", label: "Pískanie na steble trávy", emoji: "🌿", category: "Príroda", acceptedAnswers: ["hranie na tráve", "pískanie na stebielku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Blade_of_grass_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Blade_of_grass_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-canhits", label: "Údery do plechovky", emoji: "🥫", category: "Kuchyňa", acceptedAnswers: ["búchanie do plechovky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Can_hits_2_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Can_hits_2_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-chocolatecake", label: "Rezanie čokoládovej torty nožom", emoji: "🍰", category: "Kuchyňa", acceptedAnswers: ["krájanie torty"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Chocolate_cake_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Chocolate_cake_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-crunchyleaves", label: "Šuchotanie suchého lístia vo vetre", emoji: "🍂", category: "Príroda", acceptedAnswers: ["chrumkavé lístie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Crunchy_leaves_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Crunchy_leaves_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-droppingspoon", label: "Pád lyžice na podlahu", emoji: "🥄", category: "Kuchyňa", acceptedAnswers: ["spadnutá lyžica"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Dropping_spoon_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Dropping_spoon_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-chairfar", label: "Odsúvanie stoličky od stola", emoji: "🪑", category: "Domácnosť", acceptedAnswers: ["posunutie stoličky ďalej"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Drag_chair_far_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Drag_chair_far_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-feetgravel", label: "Šuchtanie nôh po štrku", emoji: "🚶", category: "Príroda", acceptedAnswers: ["prešľapovanie na mieste v štrku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Feet_shuffling_in_gravel_%28Gravity_Sound%29.mp3", sourcePage: "https://commons.wikimedia.org/wiki/File:Feet_shuffling_in_gravel_(Gravity_Sound).mp3", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-forestambience", label: "Zvuky lesa okolo", emoji: "🌲", category: "Príroda", acceptedAnswers: ["lesná atmosféra", "vtáčí spev v lese"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/be/Forest_ambience_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Forest_ambience_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-hollowlog", label: "Búchanie na dutý kmeň stromu", emoji: "🪵", category: "Príroda", acceptedAnswers: ["dutý peň rezonuje"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Hollow_log_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Hollow_log_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-keystree", label: "Údery kľúčmi o kmeň stromu", emoji: "🔑", category: "Príroda", acceptedAnswers: ["kovové kľúče o strom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/28/Keys_hitting_tree_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Keys_hitting_tree_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-metaldrain", label: "Kovový odtok rapkajúci pri páde vody", emoji: "🚿", category: "Domácnosť", acceptedAnswers: ["hrkotanie kovového odtoku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Metal_water_drain_hits_rattle_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Metal_water_drain_hits_rattle_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-pebblesmetal", label: "Kamienky padajúce na kovový rám", emoji: "🪨", category: "Príroda", acceptedAnswers: ["kamienky na plechu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Pebbles_dropped_on_metal_frame_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Pebbles_dropped_on_metal_frame_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-glasstile2", label: "Postavenie ďalšieho pohára na dlaždicu", emoji: "🥛", category: "Kuchyňa", acceptedAnswers: ["odloženie skla na obklad"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Placing_glass_object_on_tile_2_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Placing_glass_object_on_tile_2_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-raindrops", label: "Dopadajúce kvapky dažďa", emoji: "🌧️", category: "Príroda", acceptedAnswers: ["dážď kvapká"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Rain_drops_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rain_drops_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-rubbingchair", label: "Šúchanie o operadlo stoličky", emoji: "🪑", category: "Domácnosť", acceptedAnswers: ["trenie o stoličku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/13/Rubbing_chair_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rubbing_chair_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-rustlingleaves", label: "Šuchotanie lístia na strome", emoji: "🍃", category: "Príroda", acceptedAnswers: ["šuchot lístia vo vetre"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/db/Rustling_leaves_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rustling_leaves_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-metalslide", label: "Šmýkanie sa po kovovej šmykľavke", emoji: "🛝", category: "Voľný čas", acceptedAnswers: ["kovová šmykľavka na ihrisku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Sand_down_metal_slide_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Sand_down_metal_slide_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-shakingleaves", label: "Trasenie vetvičky s listami", emoji: "🌿", category: "Príroda", acceptedAnswers: ["listy sa trasú na vetve"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/Shaking_leaves_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Shaking_leaves_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-stickslide", label: "Palička ťahaná po kovovej šmykľavke", emoji: "🛝", category: "Voľný čas", acceptedAnswers: ["rapkanie paličky na šmykľavke"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/84/Stick_on_metal_slide_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Stick_on_metal_slide_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-swipegrass", label: "Prehadzovanie rukou po tráve", emoji: "🌱", category: "Príroda", acceptedAnswers: ["prechádzanie dlaňou po tráve"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/80/Swipe_grass_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Swipe_grass_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-sandalswalk", label: "Kroky v sandáloch po chodníku", emoji: "👡", category: "Každodenné situácie", acceptedAnswers: ["šľapanie v sandáloch"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Walking_in_sandals_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Walking_in_sandals_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-walkwoods", label: "Chôdza po lesnej pôde", emoji: "🌲", category: "Príroda", acceptedAnswers: ["kráčanie lesom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Walking_in_woods_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Walking_in_woods_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-walkgrass", label: "Chôdza po tráve na lúke", emoji: "🌱", category: "Príroda", acceptedAnswers: ["kroky po tráve"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Walking_on_grass_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Walking_on_grass_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-watermelonsmacks", label: "Opakované buchnutia do melóna", emoji: "🍉", category: "Kuchyňa", acceptedAnswers: ["testovanie melóna údermi"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Watermelon_hit_smacks_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Watermelon_hit_smacks_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-metalpolehits", label: "Opakované údery na kovovú tyč", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["búchanie po kovovej tyči"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/Metal_pole_hits_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Metal_pole_hits_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-stairsqueak", label: "Vŕzganie jedného schodu", emoji: "🪜", category: "Domácnosť", acceptedAnswers: ["vŕzgajúci schod"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/77/Stair_squeak_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Stair_squeak_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-sortcutlery2", label: "Ukladanie príborov do priehradky", emoji: "🍴", category: "Kuchyňa", acceptedAnswers: ["triedenie príborov v zásuvke"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Sorting_cutlery_2_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Sorting_cutlery_2_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk3-poolballs", label: "Guľôčky biliardu narážajú na seba", emoji: "🎱", category: "Šport", acceptedAnswers: ["biliardové gule", "hra biliard"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Pool_Sounds.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Pool_Sounds.ogg", credit: "Wikimedia Commons contributor", license: "Public domain" },
  { id: "sk3-parrottalk", label: "Papagáj opakuje slová", emoji: "🦜", category: "Zvieratá", acceptedAnswers: ["hovoriaci papagáj", "papagáj rozpráva"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Talking_Parrot_%28Psittacula_krameri%29.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Talking_Parrot_(Psittacula_krameri).ogg", credit: "Wikimedia Commons contributor", license: "CC BY 3.0" },
  { id: "sk3-stethoscope", label: "Búšenie srdca cez stetoskop", emoji: "🩺", category: "Zdravie", acceptedAnswers: ["srdcový tep", "vyšetrenie stetoskopom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/Emily%27s_heartbeat.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Emily%27s_heartbeat.wav", credit: "Emily Hope", license: "CC BY-SA 4.0" },
  { id: "sk3-heartmonitor", label: "Pípanie nemocničného monitora srdca", emoji: "🏥", category: "Zdravie", acceptedAnswers: ["monitor životných funkcií", "nemocničný pípajúci prístroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Heart_Monitor_Beep--freesound.org.mp3", sourcePage: "https://commons.wikimedia.org/wiki/File:Heart_Monitor_Beep--freesound.org.mp3", credit: "Freesound.org contributor", license: "CC0" },
  { id: "sk3-construction", label: "Vrtanie na stavbe v okolí", emoji: "🏗️", category: "Mesto", acceptedAnswers: ["hlučná stavba", "vrtanie na stavenisku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Baustelle_am_M%C3%B6dlingbach.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Baustelle_am_M%C3%B6dlingbach.wav", credit: "Wikimedia Commons contributor", license: "CC BY-SA 4.0" },
  { id: "sk3-dialtone", label: "Oznamovací tón telefónnej linky", emoji: "☎️", category: "Technológie", acceptedAnswers: ["telefónny tón pred vytáčaním", "obsadzovací tón"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Dial_tone_%28France%29.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Dial_tone_(France).ogg", credit: "Wikimedia Commons contributor", license: "CC BY-SA 3.0" },
];


/**
 * Dávka 3 novej databázy. Doplnenie dopravy, remesiel a niekoľkých zvierat/
 * technológií z Work With Sounds, Gravity Sound a jednotlivo overených
 * nahrávok. Rovnaký overovací postup ako pri dávkach 1-2.
 */
const EXPANDED_SOUND_CLUES_3: SoundClue[] = [
  { id: "sk4-bus-door", label: "Otváranie a zatváranie dverí mestského autobusu", emoji: "🚌", category: "Doprava", acceptedAnswers: ["dvere autobusu sa otvárajú", "autobusové dvere"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/52/WWS_CityBusMANSG220dooropeningclosing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_CityBusMANSG220dooropeningclosing.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-bus-horn", label: "Klaksón mestského autobusu", emoji: "🚌", category: "Doprava", acceptedAnswers: ["autobus trúbi"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/39/WWS_CityBusMANSG220horn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_CityBusMANSG220horn.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-horseshoes-cobble", label: "Klopkanie konských podkov po dlažbe", emoji: "🐎", category: "Mesto", acceptedAnswers: ["kôň klope podkovami", "konské kopytá na dlažbe"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/60/WWS_Clatterofhorseshoesonthepavement.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Clatterofhorseshoesonthepavement.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-coffeesilo", label: "Nasávanie kávových zŕn do sila", emoji: "☕", category: "Kuchyňa", acceptedAnswers: ["kávové zrná v potrubí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0a/WWS_Coffeebeanssuckedtothesilo.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Coffeebeanssuckedtothesilo.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-filmreels", label: "Pretáčanie filmových cievok v kine", emoji: "🎬", category: "Voľný čas", acceptedAnswers: ["filmové kotúče sa pretáčajú"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bf/WWS_Filmreels.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Filmreels.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-filmsplicer", label: "Strihanie a spájanie filmového pásu", emoji: "🎬", category: "Voľný čas", acceptedAnswers: ["strihač filmu", "lepenie filmového pásu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/WWS_Filmsplicer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Filmsplicer.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-hosewagon", label: "Vozík s hasičskou hadicou prechádza okolo", emoji: "🚒", category: "Doprava", acceptedAnswers: ["vozík ťahá hadicu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WWS_Hosehaulerwaggonispassingby.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Hosehaulerwaggonispassingby.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-hydropower", label: "Vodná elektráreň v prevádzke", emoji: "💧", category: "Príroda", acceptedAnswers: ["hydroelektráreň hučí", "prietok vody v elektrárni"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/WWS_Hydropowerplant.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Hydropowerplant.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-crossingbarrier", label: "Zdvíhanie závory na priecestí", emoji: "🚦", category: "Doprava", acceptedAnswers: ["závora sa zdvíha", "železničná závora"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3b/WWS_Level-crossingbarrier8211Lifting.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Level-crossingbarrier8211Lifting.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-cargobelt", label: "Dopravníkový pás v nákladnom priestore", emoji: "📦", category: "Doprava", acceptedAnswers: ["pás na batožinu v lietadle"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/58/WWS_Luggagebeltincargospace.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Luggagebeltincargospace.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-floppydisk", label: "Formátovanie diskety na starom počítači", emoji: "💾", category: "Technológie", acceptedAnswers: ["disketová mechanika", "formátovanie diskety"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/WWS_MacintoshSE30startandformatafloppydisk.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_MacintoshSE30startandformatafloppydisk.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-harbourcrane", label: "Mobilný prístavný žeriav pri práci", emoji: "🏗️", category: "Mesto", acceptedAnswers: ["žeriav v prístave dvíha náklad"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dd/WWS_Mobileharbourcrane.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Mobileharbourcrane.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-policevan-pass", label: "Policajné auto prechádzajúce okolo", emoji: "🚓", category: "Doprava", acceptedAnswers: ["policajný vůz prechádza"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/WWS_Policevanpassingby.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Policevanpassingby.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-rollerprep", label: "Príprava tlačiarenského valca", emoji: "🖨️", category: "Škola a kancelária", acceptedAnswers: ["valec do tlačiarne"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/WWS_Preparingtheroller.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Preparingtheroller.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-projector-light", label: "Kinoprojektor bežiaci so zapnutým svetlom", emoji: "🎬", category: "Voľný čas", acceptedAnswers: ["premietačka v kine", "svetlo projektora"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/WWS_Projectorrunningwiththelighton.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Projectorrunningwiththelighton.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-stairwell", label: "Ozvena v schodisku budovy", emoji: "🏢", category: "Mesto", acceptedAnswers: ["schodisko rezonuje", "ozvena na schodoch"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/WWS_Stairwell.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Stairwell.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-steamwhistle2", label: "Pískanie parného stroja", emoji: "🚂", category: "Doprava", acceptedAnswers: ["parný stroj píska"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/WWS_Steamwhistle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Steamwhistle.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-submersiblepump", label: "Ponorné čerpadlo vo vode", emoji: "💧", category: "Nástroje", acceptedAnswers: ["čerpadlo pod vodou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/18/WWS_Submersiblepump.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Submersiblepump.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-super8", label: "Premietanie filmu na projektore Super 8", emoji: "🎥", category: "Voľný čas", acceptedAnswers: ["domáce filmové premietanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cd/WWS_Super8MovieProjector8211Projection.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Super8MovieProjector8211Projection.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-tattoostudio", label: "Atmosféra tetovacieho štúdia", emoji: "💉", category: "Voľný čas", acceptedAnswers: ["tetovacie štúdio pri práci"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/WWS_TattooStudio.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_TattooStudio.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-turnerdrills", label: "Sústružník vrtá do kovu", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["vrtanie na sústruhu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/WWS_Theturnerdrills.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Theturnerdrills.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-tiredeflate", label: "Vypúšťanie vzduchu z pneumatiky", emoji: "🚗", category: "Doprava", acceptedAnswers: ["fúkanie z prázdnej pneumatiky", "syčanie unikajúceho vzduchu z gumy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/WWS_Thetyreisdeflated.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Thetyreisdeflated.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-walkmine", label: "Kroky v podzemnej bani", emoji: "⛏️", category: "Príroda", acceptedAnswers: ["chôdza v tuneli bane"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/55/WWS_Walkinginthemine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Walkinginthemine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-waterrock", label: "Voda odtekajúca cez skalné podložie", emoji: "💧", category: "Príroda", acceptedAnswers: ["podzemný tok vody v skale"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/WWS_Waterdrainingthroughtherock.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Waterdrainingthroughtherock.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-windturbine2", label: "Otáčajúca sa lopatka veternej turbíny", emoji: "💨", category: "Príroda", acceptedAnswers: ["veterná turbína sa otáča"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8f/WWS_Windturbine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Windturbine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-teslaphone", label: "Zvonenie historického telefónu", emoji: "☎️", category: "Technológie", acceptedAnswers: ["staré zvonenie telefónu", "historický telefónny prístroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/WWS_8220NikolaTesla8221telephone8211ringing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_8220NikolaTesla8221telephone8211ringing.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-anvil", label: "Kováčske kladivo buchá na nákovu", emoji: "🔨", category: "Nástroje", acceptedAnswers: ["údery na nákovu", "kováč pracuje s kovom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f8/WWS_Blacksmith8217sanvil.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Blacksmith8217sanvil.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-forgeblower", label: "Fúkacie mechy rozdúchavajúce kováčsku vyhňu", emoji: "🔥", category: "Nástroje", acceptedAnswers: ["mechy pri vyhni"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/WWS_Bloweroftheforge.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Bloweroftheforge.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-forgewater", label: "Lejenie vody na kováčsky oheň", emoji: "💧", category: "Nástroje", acceptedAnswers: ["hasenie vyhne vodou", "syčanie vody na uhlí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/76/WWS_Waterpouredonthefireforge.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Waterpouredonthefireforge.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-cardcatalog", label: "Prehľadávanie kartotéky v knižnici", emoji: "📇", category: "Škola a kancelária", acceptedAnswers: ["kartotéčna skrinka", "staré kartičky v knižnici"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/62/WWS_Cardcatalog.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Cardcatalog.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-clockaccuracy", label: "Kontrola presnosti hodinárskeho stroja", emoji: "🕰️", category: "Domácnosť", acceptedAnswers: ["overovanie chodu hodín"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/WWS_Checkingaclocksaccuracy.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Checkingaclocksaccuracy.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-railtrolley", label: "Ručný posun koľajového vozíka", emoji: "🚧", category: "Doprava", acceptedAnswers: ["ručný vozík na kolajach"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8b/WWS_Handleverrailtrolley.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Handleverrailtrolley.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-handmixer", label: "Ručný mixér šľahá smotanu", emoji: "🥣", category: "Kuchyňa", acceptedAnswers: ["ručný šľahač na smotanu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d6/WWS_HandmixerbyGorenjeMGA8211running.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_HandmixerbyGorenjeMGA8211running.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-warningsignal", label: "Výstražný signál v prevádzke", emoji: "⚠️", category: "Bezpečnosť", acceptedAnswers: ["varovný signál", "poplašný tón"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/WWS_Warningsignal.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Warningsignal.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-signalwhistle", label: "Signálna píšťala pri prevádzke", emoji: "📯", category: "Bezpečnosť", acceptedAnswers: ["signalizačná píšťalka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/97/WWS_SignallingWhistle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_SignallingWhistle.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-firetruck-siren-inside", label: "Siréna hasičského auta počuteľná z vnútra", emoji: "🚒", category: "Doprava", acceptedAnswers: ["siréna počas jazdy hasičmi"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8c/WWS_Firetruckssirenfrominside.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Firetruckssirenfrominside.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-vacuumfan", label: "Priemyselný odsávací ventilátor", emoji: "💨", category: "Nástroje", acceptedAnswers: ["odsávanie vzduchu ventilátorom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/11/WWS_Vacuumfan.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Vacuumfan.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-towerclock", label: "Bíjanie veľkých vežových hodín na kostole", emoji: "🔔", category: "Mesto", acceptedAnswers: ["kostolné vežové hodiny odbíjajú"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6c/WWS_TowerclockfromtheHolyTrinityChurchinGdask.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_TowerclockfromtheHolyTrinityChurchinGdask.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk4-cutlerygrasp", label: "Zovretie hrsti príborov", emoji: "🍴", category: "Kuchyňa", acceptedAnswers: ["uchopenie príboru v ruke"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Cutlery_grasp_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Cutlery_grasp_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk4-droppingrocks", label: "Sypanie kamienkov na zem", emoji: "🪨", category: "Príroda", acceptedAnswers: ["padajúce kamene na zem"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Dropping_rocks_on_ground_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Dropping_rocks_on_ground_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk4-foldingchair", label: "Rozkladanie a skladanie záhradnej stoličky", emoji: "🪑", category: "Záhrada", acceptedAnswers: ["skladacia stolička sa otvára"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Open_and_close_folding_chair_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Open_and_close_folding_chair_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk4-placespoon", label: "Položenie lyžice na stôl", emoji: "🥄", category: "Kuchyňa", acceptedAnswers: ["odloženie lyžice"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Place_spoon_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Place_spoon_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk4-stairsqueakup", label: "Vŕzganie schodov pri chôdzi nahor", emoji: "🪜", category: "Domácnosť", acceptedAnswers: ["schody vŕzgajú pri výstupe"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Squeaky_stairs_up_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Squeaky_stairs_up_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0" },
  { id: "sk4-fishtank", label: "Bublanie filtra v akváriu", emoji: "🐠", category: "Zvieratá", acceptedAnswers: ["akváriový filter bublá", "bublinky v akváriu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/15/Filtro_interno_de_pecera.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Filtro_interno_de_pecera.ogg", credit: "Wikimedia Commons contributor", license: "CC BY-SA 4.0" },
  { id: "sk4-rabbit", label: "Kvíkanie domáceho králika", emoji: "🐰", category: "Zvieratá", acceptedAnswers: ["králik kvíka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/49/Rabbit_oinks_and_squeaks.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rabbit_oinks_and_squeaks.wav", credit: "Freesound contributor", license: "CC0" },
  { id: "sk4-cricket", label: "Cvrlikanie cvrčka", emoji: "🦗", category: "Príroda", acceptedAnswers: ["cvrček spieva"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Acheta-domesticus-Stridulation.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Acheta-domesticus-Stridulation.ogg", credit: "Wikimedia Commons contributor", license: "CC BY 3.0" },
  { id: "sk4-dotmatrix", label: "Tlač na ihličkovej tlačiarni", emoji: "🖨️", category: "Technológie", acceptedAnswers: ["ihličková tlačiareň tlačí", "stará tlačiareň bzučí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/Star-LC-10-printer-01.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Star-LC-10-printer-01.ogg", credit: "Wikimedia Commons contributor", license: "Public domain" },
  { id: "sk4-dialup", label: "Pripájanie sa na internet cez modem", emoji: "💻", category: "Technológie", acceptedAnswers: ["modemové pripojenie", "zvuk vytáčaného internetu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/85/Dial_up_connection_%28short%29.oga", sourcePage: "https://commons.wikimedia.org/wiki/File:Dial_up_connection_(short).oga", credit: "Wikimedia Commons contributor", license: "CC0" },
  { id: "sk4-faucet", label: "Tečúca voda z kohútika do drezu", emoji: "🚰", category: "Domácnosť", acceptedAnswers: ["voda tečie do umývadla"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Faucet_water_into_sink.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Faucet_water_into_sink.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
];


/**
 * Dávka 4 novej databázy. Zvieratá, príroda, hudobné nástroje a remeselné
 * stroje z Wikimedia Commons (jednotlivo overené nahrávky + Work With Sounds).
 */
const EXPANDED_SOUND_CLUES_4: SoundClue[] = [
  { id: "sk5-pigoink", label: "Grcanie prasaťa na farme", emoji: "🐖", category: "Zvieratá", acceptedAnswers: ["prasa chrocháka", "grcanie ošípanej"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/73/Mudchute_pig_1.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Mudchute_pig_1.ogg", credit: "Mudchute City Farm", license: "CC BY-SA 3.0" },
  { id: "sk5-goatbleat", label: "Bľakot stáda kôz", emoji: "🐐", category: "Zvieratá", acceptedAnswers: ["kozy bľakajú"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Herd_of_goats_bleating.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Herd_of_goats_bleating.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk5-elephant", label: "Trúbenie slona", emoji: "🐘", category: "Zvieratá", acceptedAnswers: ["slon trúbi"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Elephant_voice_-_trumpeting.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Elephant_voice_-_trumpeting.ogg", credit: "Wikimedia Commons contributor", license: "CC0" },
  { id: "sk5-beargrowl", label: "Vrčanie medvieďaťa", emoji: "🐻", category: "Zvieratá", acceptedAnswers: ["medveď vrčí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Bear_growl.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Bear_growl.ogg", credit: "Wikimedia Commons contributor", license: "CC BY 3.0" },
  { id: "sk5-crow", label: "Krákanie vrany chrániacej hniezdo", emoji: "🐦‍⬛", category: "Príroda", acceptedAnswers: ["vrana kráka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Corvus_corone_-_Carrion_Crow_XC491193.mp3", sourcePage: "https://commons.wikimedia.org/wiki/File:Corvus_corone_-_Carrion_Crow_XC491193.mp3", credit: "Xeno-canto contributor", license: "CC BY-SA 4.0" },
  { id: "sk5-sparrows", label: "Čvirikanie kŕdľa vrabcov", emoji: "🐦", category: "Príroda", acceptedAnswers: ["vrabce čvirikajú"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/House_Sparrows_chirping.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:House_Sparrows_chirping.ogg", credit: "Wikimedia Commons contributor", license: "CC BY-SA 3.0" },
  { id: "sk5-woodpecker", label: "Klopkanie ďatľa na kmeň stromu", emoji: "🐦", category: "Príroda", acceptedAnswers: ["ďateľ búcha do stromu", "bubnovanie ďatľa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/54/Black_woodpecker_Dryocopus_martius_female_drumming.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Black_woodpecker_Dryocopus_martius_female_drumming.ogg", credit: "Xeno-canto contributor", license: "CC BY-SA 4.0" },
  { id: "sk5-turkey", label: "Hrkútanie divého moriaka v lese", emoji: "🦃", category: "Zvieratá", acceptedAnswers: ["moriak hrkúta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/35/Meleagris_gallopavo_-_Wild_Turkey_XC134155.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Meleagris_gallopavo_-_Wild_Turkey_XC134155.ogg", credit: "Xeno-canto contributor", license: "CC BY-SA 3.0" },
  { id: "sk5-peacock", label: "Krik páva v zoo", emoji: "🦚", category: "Zvieratá", acceptedAnswers: ["páv kričí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Pavo_cristatus_%28call%29.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Pavo_cristatus_(call).ogg", credit: "Denver Zoo contributor", license: "Public domain" },
  { id: "sk5-stream", label: "Žblnkot potoka nad kamienkami", emoji: "🏞️", category: "Príroda", acceptedAnswers: ["potôčik tečie po kameňoch", "žblnkajúci potok"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/21/Shallow_small_river_with_stony_riverbed.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Shallow_small_river_with_stony_riverbed.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk5-cymbal", label: "Údery na činel bicích", emoji: "🥁", category: "Nástroje", acceptedAnswers: ["rana na činel", "crash cimbal"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/CrashCymbalSample.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:CrashCymbalSample.ogg", credit: "Wikimedia Commons contributor", license: "Public domain" },
  { id: "sk5-pipeorgan", label: "Hranie na veľký kostolný organ", emoji: "🎹", category: "Voľný čas", acceptedAnswers: ["kostolný organ hrá", "organová hudba v kostole"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Hartford_City_Presbyterian_Pipe_Organ.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Hartford_City_Presbyterian_Pipe_Organ.ogg", credit: "First Presbyterian Church of Hartford City", license: "Public domain" },
  { id: "sk5-bagpipes", label: "Hranie na veľké dudy", emoji: "🎶", category: "Nástroje", acceptedAnswers: ["škótske dudy hrajú", "dudy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Elektronische_Great_Highland_Bagpipe.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Elektronische_Great_Highland_Bagpipe.ogg", credit: "Wikimedia Commons contributor", license: "Public domain" },
  { id: "sk5-buttonhole", label: "Šijací stroj na dierky pre knoflíky", emoji: "🧵", category: "Domácnosť", acceptedAnswers: ["strojové šitie gombíkovej dierky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/WWS_Buttonholemachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Buttonholemachine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-buttonsew", label: "Strojové prišívanie gombíka", emoji: "🧵", category: "Domácnosť", acceptedAnswers: ["prišívanie knoflíka strojom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/WWS_Buttonsewingmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Buttonsewingmachine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-embroidery", label: "Vyšívací stroj pri práci", emoji: "🧵", category: "Domácnosť", acceptedAnswers: ["strojové vyšívanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/WWS_Embroiderymachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Embroiderymachine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-fencemaking", label: "Stroj na výrobu plotových pletiva", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["výroba pletiva na plot"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/31/WWS_Fencemakingmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Fencemakingmachine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-leathercut", label: "Strihanie kože nožnicami u rukavičkára", emoji: "✂️", category: "Obchod", acceptedAnswers: ["strihanie kože na rukavice"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/WWS_Glovemakerleathercutting1.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Glovemakerleathercutting1.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-gloveshape", label: "Tvarovanie rukavice pred šitím", emoji: "🧤", category: "Obchod", acceptedAnswers: ["formovanie rukavice"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e6/WWS_Glovemakershapingaglove3.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Glovemakershapingaglove3.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-loom", label: "Tkáčsky stav pri tkaní látky", emoji: "🧵", category: "Domácnosť", acceptedAnswers: ["tkáčsky stav tka", "tkanie na krosnách"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/WWS_Loom.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Loom.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-narrowgauge", label: "Úzkokoľajná lokomotíva v teréne", emoji: "🚂", category: "Doprava", acceptedAnswers: ["malý vláčik na poliach"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/WWS_Narrow-gaugefieldlocomotive.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Narrow-gaugefieldlocomotive.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-monorail", label: "Visutá jednokoľajová električka", emoji: "🚝", category: "Doprava", acceptedAnswers: ["visutá dráha", "monorail nad ulicou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/22/WWS_OverheadmonorailWuppertalSuspensionRailway.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_OverheadmonorailWuppertalSuspensionRailway.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-overheadloco", label: "Visutá železnica sa rozbieha", emoji: "🚝", category: "Doprava", acceptedAnswers: ["visutá lokomotíva v pohybe"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cc/WWS_Overheadrailwaylocomotivemoving.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Overheadrailwaylocomotivemoving.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-ropemaking", label: "Stroj na krútenie povrazu", emoji: "🪢", category: "Nástroje", acceptedAnswers: ["výroba povrazu strojom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c0/WWS_Ropemakingmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Ropemakingmachine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-lacepins", label: "Špendlíky používané pri paličkovaní čipky", emoji: "🪡", category: "Domácnosť", acceptedAnswers: ["paličkovaná čipka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e7/WWS_Pinsusedforlacemaking.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Pinsusedforlacemaking.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-rotaryprint", label: "Rotačný tlačiarenský stroj", emoji: "🖨️", category: "Škola a kancelária", acceptedAnswers: ["rotačka tlačí noviny"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/70/WWS_Rotaryprintingpress.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Rotaryprintingpress.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-phoenixprint", label: "Starý tlačiarenský stroj Phoenix", emoji: "🖨️", category: "Škola a kancelária", acceptedAnswers: ["historický tlačiarenský stroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/WWS_PrintingmachinetypePhoenix.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_PrintingmachinetypePhoenix.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-grafopress", label: "Tlačiarenský stroj Grafopress", emoji: "🖨️", category: "Škola a kancelária", acceptedAnswers: ["staré tlačiarenské zariadenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dd/WWS_PrintingmachineGrafopress.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_PrintingmachineGrafopress.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-ticketprint", label: "Tlačiareň cestovných lístkov Edmondson", emoji: "🎫", category: "Doprava", acceptedAnswers: ["tlač papierových lístkov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/WWS_EdmondsonTicketPrintingMachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_EdmondsonTicketPrintingMachine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-teleprinter-auto", label: "Diaľkopis automaticky tlačiaci text", emoji: "📠", category: "Technológie", acceptedAnswers: ["diaľkopis tlačí správu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/WWS_Teleprinterautomaticprinting.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Teleprinterautomaticprinting.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-teleprinter-type", label: "Písanie na diaľkopise", emoji: "📠", category: "Technológie", acceptedAnswers: ["klepanie diaľkopisu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/46/WWS_Teleprintertyping.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Teleprintertyping.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-accountingmachine", label: "Historický účtovací stroj", emoji: "🧮", category: "Škola a kancelária", acceptedAnswers: ["mechanický kalkulačný stroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/73/WWS_Burroughsaccountingmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Burroughsaccountingmachine.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-polaroidload", label: "Vkladanie filmu do polaroidového fotoaparátu", emoji: "📸", category: "Voľný čas", acceptedAnswers: ["nabíjanie filmu do polaroidu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cd/WWS_Polaroid1200i8211loadingcamera.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Polaroid1200i8211loadingcamera.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-super8plug", label: "Zapájanie premietačky Super 8", emoji: "🎥", category: "Voľný čas", acceptedAnswers: ["pripájanie filmového projektora"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/11/WWS_Super8MovieProjector8211Plugin.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Super8MovieProjector8211Plugin.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-super8rev", label: "Pretáčanie filmu na projektore Super 8 dozadu", emoji: "🎥", category: "Voľný čas", acceptedAnswers: ["premietačka pretáča film"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/WWS_Super8MovieProjector8211Reverse.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Super8MovieProjector8211Reverse.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-tram-interior", label: "Interiér starej električky počas jazdy", emoji: "🚊", category: "Doprava", acceptedAnswers: ["jazda v starej električke"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/WWS_SN2tram8211carinterior.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_SN2tram8211carinterior.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-tram-standard", label: "Interiér električky typu Standard", emoji: "🚊", category: "Doprava", acceptedAnswers: ["električka LH Standard"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/WWS_LHStandardtram8211carinterior.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_LHStandardtram8211carinterior.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-tramdoors", label: "Zatváranie dverí električky", emoji: "🚊", category: "Doprava", acceptedAnswers: ["dvere električky sa zatvárajú"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/WWS_102Ntramdoors.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_102Ntramdoors.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-trampivot", label: "Otočný kĺb medzi vozňami električky", emoji: "🚊", category: "Doprava", acceptedAnswers: ["kloub električky pri zákrute"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/WWS_102Ntrampivotingjoint.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_102Ntrampivotingjoint.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-tram4ndoors", label: "Dvere staršieho typu električky", emoji: "🚊", category: "Doprava", acceptedAnswers: ["dvere električky typ 4N"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fe/WWS_Type4Ntramdoors.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Type4Ntramdoors.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-vaninterior", label: "Interiér dodávky počas jazdy", emoji: "🚐", category: "Doprava", acceptedAnswers: ["jazda v dodávke"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c5/WWS_FSRTarpan233vancarinterior.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_FSRTarpan233vancarinterior.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-vandriving", label: "Dodávkové auto počas jazdy", emoji: "🚐", category: "Doprava", acceptedAnswers: ["dodávka na ceste"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a8/WWS_FSRTarpan239Dvandriving.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_FSRTarpan239Dvandriving.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-lathe-flywheel", label: "Sústruh vyrábajúci kovové koleso", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["výroba kolesa na sústruhu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/10/WWS_Metallatheusedtoproduceflywheels.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Metallatheusedtoproduceflywheels.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-whettingtrestle", label: "Brúsenie nástroja na brúsnom stojane", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["brúsenie na kozovom stojane"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d4/WWS_Whettingtrestle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Whettingtrestle.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-luthierchisel", label: "Rezbárske dláto pri výrobe husieľ", emoji: "🎻", category: "Nástroje", acceptedAnswers: ["dláto huslára"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dc/WWS_Woodchisellutherie.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Woodchisellutherie.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-luthierplane", label: "Hobľovanie dreva pri výrobe husieľ", emoji: "🎻", category: "Nástroje", acceptedAnswers: ["huslársky hobel"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/WWS_Luthierplane.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Luthierplane.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
  { id: "sk5-luthierjoin", label: "Spájanie dielov huslí u huslára", emoji: "🎻", category: "Nástroje", acceptedAnswers: ["lepenie dielov huslí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/WWS_Joininglutherie.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Joininglutherie.ogg", credit: "Work With Sounds", license: "CC BY 4.0" },
];


/**
 * Dávka 5 novej databázy. Divá zver (US Fish & Wildlife Service, British
 * Library Sound Archive — verejná doména / CC BY-SA 4.0) a pár zábavných
 * jednotlivo overených nálezov (lunapark, hračky).
 */
const EXPANDED_SOUND_CLUES_5: SoundClue[] = [
  { id: "sk6-alligator-bellow", label: "Bučanie aligátora", emoji: "🐊", category: "Zvieratá", acceptedAnswers: ["aligátor bučí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Alligatorbellow1.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Alligatorbellow1.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain" },
  { id: "sk6-alligator-hiss", label: "Sykot aligátora", emoji: "🐊", category: "Zvieratá", acceptedAnswers: ["aligátor syčí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Alligatorhiss.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Alligatorhiss.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain" },
  { id: "sk6-pelican-chick", label: "Pípanie mláďaťa pelikána", emoji: "🐦", category: "Zvieratá", acceptedAnswers: ["mláďa pelikána pípa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Baby_pelican.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Baby_pelican.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain" },
  { id: "sk6-ducks-landing", label: "Kačice dosadajúce na vodnú hladinu", emoji: "🦆", category: "Príroda", acceptedAnswers: ["kačice pristávajú na vode"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Ducks_landing_in_water.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Ducks_landing_in_water.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain" },
  { id: "sk6-elk-bellow", label: "Bučanie jelenca", emoji: "🦌", category: "Zvieratá", acceptedAnswers: ["jeleň bučí v období ruja"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Elkbellow.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Elkbellow.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain" },
  { id: "sk6-geese-honking", label: "Hlasné gagotanie husí", emoji: "🦢", category: "Zvieratá", acceptedAnswers: ["husi gagotajú nahlas"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Geese_Honking_%28loud%29.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Geese_Honking_(loud).ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain" },
  { id: "sk6-rattlesnake", label: "Chrastenie chvosta zvončeka", emoji: "🐍", category: "Zvieratá", acceptedAnswers: ["hadí chvost chrasti", "zvonivý had varuje"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/22/Rattlesnake.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Rattlesnake.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain" },
  { id: "sk6-tundraswans", label: "Volanie tundrových labutí", emoji: "🦢", category: "Príroda", acceptedAnswers: ["labute volajú počas letu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/48/Tundra_swans.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Tundra_swans.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain" },
  { id: "sk6-wolfhowls", label: "Vlčie vytie v diaľke", emoji: "🐺", category: "Príroda", acceptedAnswers: ["vlk vyje"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Wolf_howls.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Wolf_howls.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain" },
  { id: "sk6-woodpecker2", label: "Búchanie ďatľa do kôry stromu", emoji: "🐦", category: "Príroda", acceptedAnswers: ["ďateľ ťuká do stromu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Woodpecker_tapping.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Woodpecker_tapping.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain" },
  { id: "sk6-loons", label: "Volanie potápok na jazere", emoji: "🦆", category: "Príroda", acceptedAnswers: ["potápka vydáva zvuk na jazere"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/13/Loons.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Loons.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain" },
  { id: "sk6-heronfish", label: "Volavka loví ryby vo vode", emoji: "🦆", category: "Príroda", acceptedAnswers: ["volavka chytá rybu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/Littleblueheronfishes.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Littleblueheronfishes.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain" },
  { id: "sk6-cuckoo", label: "Kukanie kukučky v lese", emoji: "🐦", category: "Príroda", acceptedAnswers: ["kukučka kuká"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Common_Cuckoo_%28Cuculus_canorus%29_%28W1CDR0001463_BD1%29.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Common_Cuckoo_(Cuculus_canorus)_(W1CDR0001463_BD1).ogg", credit: "British Library Sound Archive / National Sound Archive Wildlife Section", license: "CC BY-SA 4.0" },
  { id: "sk6-nightingale", label: "Spev slávika v noci", emoji: "🐦", category: "Príroda", acceptedAnswers: ["slávik spieva"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/Common_Nightingale_%28Luscinia_megarhynchos%29_%28W1CDR0001376_BD18%29.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Common_Nightingale_(Luscinia_megarhynchos)_(W1CDR0001376_BD18).ogg", credit: "British Library Sound Archive / National Sound Archive Wildlife Section", license: "CC BY-SA 4.0" },
  { id: "sk6-bumpercars", label: "Autíčka na autodráme v zábavnom parku", emoji: "🎡", category: "Voľný čas", acceptedAnswers: ["autoscooter", "jazda na nárazových autíčkach"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Autodrom_im_Prater_25s.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Autodrom_im_Prater_25s.ogg", credit: "Wikimedia Commons contributor", license: "CC BY-SA 4.0" },
  { id: "sk6-brassband", label: "Dychová kapela na sprievode", emoji: "🎺", category: "Voľný čas", acceptedAnswers: ["dychovka hrá v pochode", "kapela na sprievode"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ce/March_brass_band_playing_parading_by.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:March_brass_band_playing_parading_by.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk6-rubberduck", label: "Pískanie gumenej kačičky", emoji: "🦆", category: "Každodenné situácie", acceptedAnswers: ["gumená kačka píska", "kúpeľňová hračka kačička"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Rubber_Duck_Squeaker.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Rubber_Duck_Squeaker.ogg", credit: "Wikimedia Commons contributor", license: "CC BY-SA 4.0" },
  { id: "sk6-musicbox", label: "Naťahovanie hracej skrinky", emoji: "🎵", category: "Voľný čas", acceptedAnswers: ["hracia skrinka sa naťahuje", "naťahovacia hudobná skrinka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Winding_a_music_box.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Winding_a_music_box.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
];


/**
 * Dávka 6 novej databázy. Zdroj: PDsounds.org (bulk komunitná zbierka
 * uvedená na Wikimedia Commons v Category:PDsounds.org, všetko public
 * domain). Zameranie na domácnosť, kanceláriu, kuchyňu a mestské situácie.
 */
const EXPANDED_SOUND_CLUES_6: SoundClue[] = [
  { id: "sk7-ketchup", label: "Otváranie a zatváranie vrchnáka kečupu", emoji: "🍅", category: "Kuchyňa", acceptedAnswers: ["skrutkovací uzáver kečupu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Ketchup_bottle_opening_and_closing_screw_top.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Ketchup_bottle_opening_and_closing_screw_top.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-espresso", label: "Espresso kávovar pri príprave", emoji: "☕", category: "Kuchyňa", acceptedAnswers: ["espresso sa pripravuje"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Espresso_machine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Espresso_machine.ogg", credit: "hugh (PDSounds)", license: "Public domain" },
  { id: "sk7-elevatordoor", label: "Zatváranie dverí výťahu", emoji: "🛗", category: "Mesto", acceptedAnswers: ["výťah zatvára dvere"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Elevator_door_closing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Elevator_door_closing.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-garagedoor-close", label: "Zatváranie garážovej brány", emoji: "🚪", category: "Domácnosť", acceptedAnswers: ["garážová brána sa zatvára"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Garage_door_closing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Garage_door_closing.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk7-garagedoor-open", label: "Otváranie garážovej brány", emoji: "🚪", category: "Domácnosť", acceptedAnswers: ["garážová brána sa otvára"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Garage_door_opening.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Garage_door_opening.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk7-freezerbox", label: "Otváranie truhlicovej mrazničky", emoji: "🧊", category: "Domácnosť", acceptedAnswers: ["mraznička sa otvára"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/86/Freezer_box_opening_closing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Freezer_box_opening_closing.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-schoolbell-old2", label: "Zvonenie starého školského zvonca", emoji: "🔔", category: "Škola a kancelária", acceptedAnswers: ["staromódny školský zvonec"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Old_school_bell_2.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Old_school_bell_2.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk7-toyphone", label: "Rýchla voľba na detskom telefóne", emoji: "📞", category: "Každodenné situácie", acceptedAnswers: ["hračkársky telefón vytáča"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Toy_phone_speed_dial.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Toy_phone_speed_dial.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-tramdoors2", label: "Otváranie a zatváranie dverí električky so sykotom", emoji: "🚊", category: "Doprava", acceptedAnswers: ["dvere električky sykajú"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Tram_doors_open_and_close_hiss_and_beeping.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Tram_doors_open_and_close_hiss_and_beeping.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-cartraindoors", label: "Zatváranie dverí vlaku", emoji: "🚆", category: "Doprava", acceptedAnswers: ["dvere vlaku sa zatvárajú"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/76/Train_doors_closing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Train_doors_closing.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk7-carunlock", label: "Odomykanie auta na diaľkové ovládanie", emoji: "🚗", category: "Doprava", acceptedAnswers: ["diaľkové odomknutie auta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Unlocking_a_car.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Unlocking_a_car.ogg", credit: "hc (PDSounds)", license: "Public domain" },
  { id: "sk7-deskdrawer", label: "Otváranie starej drevenej zásuvky písacieho stola", emoji: "🗄️", category: "Škola a kancelária", acceptedAnswers: ["drevená zásuvka písacieho stola"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/Wooden_desk_drawer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Wooden_desk_drawer.ogg", credit: "hugh (PDSounds)", license: "Public domain" },
  { id: "sk7-wineglass", label: "Cinkanie na krištáľový pohár na víno", emoji: "🍷", category: "Voľný čas", acceptedAnswers: ["cinknutie na vínny pohár"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/71/Wine_glass.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Wine_glass.ogg", credit: "hugh (PDSounds)", license: "Public domain" },
  { id: "sk7-windchime", label: "Zvonkohra zavesená vo vetre", emoji: "🎐", category: "Domácnosť", acceptedAnswers: ["vetrom hýbaná zvonkohra"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/28/Windchime.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Windchime.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-snowglobe", label: "Zatrasenie sklenenou snehovou gulou", emoji: "❄️", category: "Voľný čas", acceptedAnswers: ["snehová guľa sa trasie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Snow_globe_shaken.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Snow_globe_shaken.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk7-toyrattle", label: "Hračkárska rapkáčka valiaca sa po podlahe", emoji: "🧸", category: "Každodenné situácie", acceptedAnswers: ["hrkálka sa kotúľa po zemi"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Rolling_toy_rattle_on_floor.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Rolling_toy_rattle_on_floor.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-retractpen", label: "Cvakanie vysúvacieho pera", emoji: "🖊️", category: "Škola a kancelária", acceptedAnswers: ["cvakacie pero"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/95/Retractable_pen_clickin.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Retractable_pen_clickin.ogg", credit: "stilgar (PDSounds)", license: "Public domain" },
  { id: "sk7-peppergrinder", label: "Ručný mlynček na korenie", emoji: "🧂", category: "Kuchyňa", acceptedAnswers: ["mletie korenia"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Pepper_grinder.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Pepper_grinder.ogg", credit: "hugh (PDSounds)", license: "Public domain" },
  { id: "sk7-peelcarrot", label: "Šúpanie mrkvy škrabkou", emoji: "🥕", category: "Kuchyňa", acceptedAnswers: ["šúpanie zeleniny škrabkou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/90/Peeling_a_carrot.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Peeling_a_carrot.ogg", credit: "musicmaiden (PDSounds)", license: "Public domain" },
  { id: "sk7-peelorange", label: "Šúpanie pomaranča rukami", emoji: "🍊", category: "Kuchyňa", acceptedAnswers: ["šúpanie citrusu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/Peeling_an_orange.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Peeling_an_orange.ogg", credit: "russiandoll (PDSounds)", license: "Public domain" },
  { id: "sk7-paperclips", label: "Sypanie kancelárskych spiniek na stôl", emoji: "📎", category: "Škola a kancelária", acceptedAnswers: ["spinky padajú na stôl"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Paperclips_dropped_jangled.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Paperclips_dropped_jangled.ogg", credit: "hugh (PDSounds)", license: "Public domain" },
  { id: "sk7-chocolatebox", label: "Otváranie krabičky pralinek", emoji: "🍫", category: "Voľný čas", acceptedAnswers: ["balenie čokoládových bonbónov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/Opening_a_box_of_chocolates.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Opening_a_box_of_chocolates.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk7-metalcabinet", label: "Trhavé otváranie kovovej skrinky", emoji: "🗄️", category: "Domácnosť", acceptedAnswers: ["škripot plechovej skrinky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Metal_cabinet_door_jarring.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Metal_cabinet_door_jarring.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-bumblebee", label: "Bzučanie čmeliaka", emoji: "🐝", category: "Príroda", acceptedAnswers: ["čmeliak bzučí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Hummel_bee.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Hummel_bee.ogg", credit: "soerena (PDSounds)", license: "Public domain" },
  { id: "sk7-gulls-dawn", label: "Krik čajok nad ránom v meste", emoji: "🐦", category: "Mesto", acceptedAnswers: ["čajky kričia nad ulicou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Gulls_above_the_street_at_dawn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Gulls_above_the_street_at_dawn.ogg", credit: "earthcalling (PDSounds)", license: "Public domain" },
  { id: "sk7-fountain", label: "Fontána v meste", emoji: "⛲", category: "Mesto", acceptedAnswers: ["mestská fontána"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Fountain_in_toulouse.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Fountain_in_toulouse.ogg", credit: "aldor (PDSounds)", license: "Public domain" },
  { id: "sk7-flappingwindow", label: "Trepotanie sa zatvárajúceho okna vo vetre", emoji: "🪟", category: "Domácnosť", acceptedAnswers: ["okno buchá vo vetre"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/32/Flapping_window_closing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Flapping_window_closing.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk7-dryfire", label: "Praskajúca suchá trávová vatra", emoji: "🔥", category: "Príroda", acceptedAnswers: ["suchá tráva horí v ohnisku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Dry_grass_burning_in_open_fireplace.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Dry_grass_burning_in_open_fireplace.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk7-catseating", label: "Mačky hlučne jediace z misky", emoji: "🐈", category: "Zvieratá", acceptedAnswers: ["mačky žerú z misiek"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/da/Domestic_cats_eating.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Domestic_cats_eating.ogg", credit: "Marcus Kuerten (PDSounds)", license: "Public domain" },
  { id: "sk7-cutlerytable", label: "Odkladanie príborov na stôl", emoji: "🍴", category: "Kuchyňa", acceptedAnswers: ["príbory na stole"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Cutlery_on_table.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Cutlery_on_table.ogg", credit: "thore (PDSounds)", license: "Public domain" },
  { id: "sk7-chimingpottery", label: "Zvonivé cinkanie keramiky", emoji: "🏺", category: "Domácnosť", acceptedAnswers: ["keramika cinká"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Chiming_pottery.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Chiming_pottery.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-toymelody", label: "Nabíjacia hračka hrajúca detskú melódiu", emoji: "🧸", category: "Každodenné situácie", acceptedAnswers: ["hračka hrá detskú pesničku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Cheesy_toy_melody_old_mc_donald.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Cheesy_toy_melody_old_mc_donald.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-cameraclick", label: "Zapínanie a fotenie digitálnym fotoaparátom", emoji: "📷", category: "Technológie", acceptedAnswers: ["digitálny fotoaparát cvaká"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/32/Canon_digital_ixus_55_normalized_turn_on_off_take_photo_press_buttons.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Canon_digital_ixus_55_normalized_turn_on_off_take_photo_press_buttons.ogg", credit: "qubodup (PDSounds)", license: "Public domain" },
  { id: "sk7-airduster", label: "Sprej na vyfukovanie prachu z klávesnice", emoji: "💨", category: "Technológie", acceptedAnswers: ["stlačený vzduch v spreji"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/02/Can_of_compressed_air.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Can_of_compressed_air.ogg", credit: "stilgar (PDSounds)", license: "Public domain" },
  { id: "sk7-wharfannounce", label: "Hlásenie ampliónom v prístave", emoji: "🚢", category: "Doprava", acceptedAnswers: ["ampliónové hlásenie na móle"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Announcement_on_a_wharf.oga", sourcePage: "https://commons.wikimedia.org/wiki/File:Announcement_on_a_wharf.oga", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk7-coinbag", label: "Vrecko s mincami sa cingotá", emoji: "💰", category: "Každodenné situácie", acceptedAnswers: ["mince cingotajú vo vrecku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Bag_of_coins.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Bag_of_coins.ogg", credit: "cori (PDSounds)", license: "Public domain" },
  { id: "sk7-bbq", label: "Grilovanie mäsa na záhradnom gril", emoji: "🍖", category: "Voľný čas", acceptedAnswers: ["grilovačka syčí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Barbecue.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Barbecue.ogg", credit: "aldor (PDSounds)", license: "Public domain" },
  { id: "sk7-boatwharf", label: "Loď prirážajúca k mólu", emoji: "🚢", category: "Doprava", acceptedAnswers: ["čln pristáva pri móle"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Boat_landing_at_a_wharf.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Boat_landing_at_a_wharf.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk7-gasheater", label: "Plynový bojler pri zapnutí", emoji: "🔥", category: "Domácnosť", acceptedAnswers: ["plynový ohrievač vody"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/78/Boiler_gas_heater.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Boiler_gas_heater.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-budgie", label: "Čvirikanie andulky v klietke", emoji: "🦜", category: "Zvieratá", acceptedAnswers: ["andulka čvirika"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/83/Budgerigar_chirping.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Budgerigar_chirping.ogg", credit: "mary905 (PDSounds)", license: "Public domain" },
  { id: "sk7-breakspaghetti", label: "Lámanie surových špagiet", emoji: "🍝", category: "Kuchyňa", acceptedAnswers: ["lámanie cestovín pred varením"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/85/Breaking_spaghetti.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Breaking_spaghetti.ogg", credit: "stilgar (PDSounds)", license: "Public domain" },
  { id: "sk7-brushteeth", label: "Umývanie zubov kefkou", emoji: "🪥", category: "Zdravie", acceptedAnswers: ["čistenie zubov kefkou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/34/Brushing_ones_teeth.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Brushing_ones_teeth.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk7-crackpeanuts", label: "Lúskanie arašidov", emoji: "🥜", category: "Kuchyňa", acceptedAnswers: ["lúskanie orieškov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/Cracking_peanuts.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Cracking_peanuts.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-swivelchair", label: "Vŕzganie otočnej kancelárskej stoličky", emoji: "🪑", category: "Škola a kancelária", acceptedAnswers: ["kancelárska stolička vŕzga"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Creaky_wooden_swivel_chair.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Creaky_wooden_swivel_chair.ogg", credit: "chocoholic (PDSounds)", license: "Public domain" },
  { id: "sk7-elevatorride", label: "Jazda výťahom", emoji: "🛗", category: "Mesto", acceptedAnswers: ["výťah stúpa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Elevator_ride.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Elevator_ride.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-coinsjingle", label: "Cinkanie britských mincí v ruke", emoji: "🪙", category: "Každodenné situácie", acceptedAnswers: ["mince cinkajú v dlani"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f3/English_coins.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:English_coins.ogg", credit: "cori (PDSounds)", license: "Public domain" },
  { id: "sk7-hydrauliclift-down", label: "Hydraulický zdvihák klesá", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["hydraulický zdvihák dole"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/13/Hydraulic_lift_down.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Hydraulic_lift_down.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-hydrauliclift-up", label: "Hydraulický zdvihák stúpa nahor", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["hydraulický zdvihák hore"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Hydraulic_lift_pushing_up.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Hydraulic_lift_pushing_up.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-inkjetprinter", label: "Zapínanie a vypínanie atramentovej tlačiarne", emoji: "🖨️", category: "Škola a kancelária", acceptedAnswers: ["atramentová tlačiareň sa zapína"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Inkjet_printer_on_and_off.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Inkjet_printer_on_and_off.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-metalbox-spring", label: "Otvorenie kovovej škatuľky na pružinu", emoji: "📦", category: "Každodenné situácie", acceptedAnswers: ["pružinová škatuľka sa otvára"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Metal_box_springs_open.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Metal_box_springs_open.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-potandlid", label: "Bubnovanie na hrniec a pokrievku", emoji: "🍲", category: "Kuchyňa", acceptedAnswers: ["hranie na hrnce ako bicie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Metal_pot_and_lid_percu.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Metal_pot_and_lid_percu.ogg", credit: "stilgar (PDSounds)", license: "Public domain" },
  { id: "sk7-musicbox2", label: "Hracia skrinka hrajúca melódiu z opery", emoji: "🎵", category: "Voľný čas", acceptedAnswers: ["hracia skrinka hrá známu melódiu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Musical_box_la_boheme.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Musical_box_la_boheme.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-oldbook", label: "Listovanie a zatváranie starej knihy", emoji: "📖", category: "Škola a kancelária", acceptedAnswers: ["prevraciate stránky starej knihy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Old_book.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Old_book.ogg", credit: "cori (PDSounds)", license: "Public domain" },
  { id: "sk7-pourwine", label: "Nalievanie vína do pohára", emoji: "🍷", category: "Voľný čas", acceptedAnswers: ["víno sa naleva do pohára"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Pouring_wine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Pouring_wine.ogg", credit: "cori (PDSounds)", license: "Public domain" },
  { id: "sk7-rustyclasp", label: "Otváranie zarudnutej kovovej sponky", emoji: "🔒", category: "Každodenné situácie", acceptedAnswers: ["zarudnutá kovová zástrčka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/Rusty_metal_door_clasp.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Rusty_metal_door_clasp.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-sawtoiletroll", label: "Rezanie prázdnej roličky od toaletného papiera", emoji: "🧻", category: "Domácnosť", acceptedAnswers: ["rezanie kartónovej rolky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/Sawing_an_empty_toilet_paper_roll.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Sawing_an_empty_toilet_paper_roll.ogg", credit: "qubodup (PDSounds)", license: "Public domain" },
  { id: "sk7-scrubbrush", label: "Drhnutie kovovou kefkou", emoji: "🧽", category: "Domácnosť", acceptedAnswers: ["kovová kefka drhne povrch"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Scrubbing_with_small_metal_bristled_brush.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Scrubbing_with_small_metal_bristled_brush.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-shakegel", label: "Trasenie flakónom s gélom", emoji: "🧴", category: "Domácnosť", acceptedAnswers: ["trasenie fľašou kozmetiky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Shaking_a_bottle_of_gel.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Shaking_a_bottle_of_gel.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-sharpenpencil", label: "Ostrenie ceruzky ostrorezkou", emoji: "✏️", category: "Škola a kancelária", acceptedAnswers: ["ostrenie ceruzky ručne"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Sharpening_pencil.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Sharpening_pencil.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-verandadoor", label: "Posuvné dvere na terasu sa otvárajú", emoji: "🚪", category: "Domácnosť", acceptedAnswers: ["posuvné dvere terasy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Sliding_door_of_veranda_opening.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Sliding_door_of_veranda_opening.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk7-slowapplause", label: "Postupne narastajúci potlesk publika", emoji: "👏", category: "Voľný čas", acceptedAnswers: ["potlesk sa postupne rozbieha"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Slow_starting_applause.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Slow_starting_applause.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-snowglobeturn", label: "Otáčanie snehovej gule v ruke", emoji: "❄️", category: "Voľný čas", acceptedAnswers: ["prevracanie snehovej gule"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Snow_globe_turned_around.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Snow_globe_turned_around.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk7-airplanesound", label: "Atmosféra v kabíne letiaceho lietadla", emoji: "✈️", category: "Doprava", acceptedAnswers: ["hukot v kabíne lietadla"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Sound_in_air_plane_1.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Sound_in_air_plane_1.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk7-blownbottle", label: "Fúkanie melódie na prázdnej fľaši", emoji: "🍾", category: "Voľný čas", acceptedAnswers: ["hranie na fľašu fúkaním"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Sounds_of_blown_bottle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Sounds_of_blown_bottle.ogg", credit: "mary905 (PDSounds)", license: "Public domain" },
  { id: "sk7-cellardoor", label: "Odomykanie pružinového zámku pivničných dverí", emoji: "🚪", category: "Domácnosť", acceptedAnswers: ["pružinový zámok na pivnici"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Springlocked_cellar_door.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Springlocked_cellar_door.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-steamengine2", label: "Parný stroj v chode", emoji: "🚂", category: "Doprava", acceptedAnswers: ["parný motor pracuje"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Steam_engine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Steam_engine.ogg", credit: "aradlaw (PDSounds)", license: "Public domain" },
  { id: "sk7-stickytape", label: "Odvíjanie lepiacej pásky", emoji: "📦", category: "Škola a kancelária", acceptedAnswers: ["odlepovanie izolepy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Sticky_tape.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Sticky_tape.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-streetviolin", label: "Hranie na husle uličným hudobníkom", emoji: "🎻", category: "Voľný čas", acceptedAnswers: ["ulicný huslista hrá"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/94/Street_musician_violin.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Street_musician_violin.ogg", credit: "natalie (PDSounds)", license: "Public domain" },
  { id: "sk7-bellstrike", label: "Udretie veľkého zvona", emoji: "🔔", category: "Voľný čas", acceptedAnswers: ["zvon vydáva zvučný tón"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Striking_a_bell_15cm_large.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Striking_a_bell_15cm_large.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-cafeteria", label: "Ruch v školskej jedálni", emoji: "🍽️", category: "Škola a kancelária", acceptedAnswers: ["hlučná školská jedáleň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/df/High_school_cafeteria.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:High_school_cafeteria.ogg", credit: "aradlaw (PDSounds)", license: "Public domain" },
  { id: "sk7-vendingdrink", label: "Nápojový automat vydávajúci nápoj", emoji: "🥤", category: "Obchod", acceptedAnswers: ["automat na nápoje vydáva flašu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Le_distributeur_de_bois.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Le_distributeur_de_bois.ogg", credit: "aldor (PDSounds)", license: "Public domain" },
  { id: "sk7-pingpong", label: "Hra stolného tenisu", emoji: "🏓", category: "Šport", acceptedAnswers: ["stolný tenis sa hrá"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/72/Ping_pong.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Ping_pong.ogg", credit: "aldor (PDSounds)", license: "Public domain" },
  { id: "sk7-restaurant", label: "Bzukot rozhovorov v reštaurácii", emoji: "🍽️", category: "Voľný čas", acceptedAnswers: ["hluk v plnej reštaurácii"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Restaurant_ambience.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Restaurant_ambience.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-dialtone2", label: "Vytáčanie čísla na tónovom telefóne", emoji: "☎️", category: "Technológie", acceptedAnswers: ["tónová voľba telefónu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Tone_dialling_phone_germany.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Tone_dialling_phone_germany.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-toysiren", label: "Hračkárska siréna", emoji: "🚨", category: "Každodenné situácie", acceptedAnswers: ["hračka napodobňuje sirénu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Toy_siren_alarm.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Toy_siren_alarm.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-trainstation", label: "Vlaky prechádzajúce železničnou stanicou", emoji: "🚉", category: "Doprava", acceptedAnswers: ["viacero vlakov na stanici"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Trains_through_a_railwa.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Trains_through_a_railwa.ogg", credit: "ezwa (PDSounds)", license: "Public domain" },
  { id: "sk7-huntpeck", label: "Neisté písanie na klávesnici dvoma prstami", emoji: "⌨️", category: "Technológie", acceptedAnswers: ["pomalé písanie dvoma prstami"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Typing_hunt_and_peck.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Typing_hunt_and_peck.ogg", credit: "teto_yasha (PDSounds)", license: "Public domain" },
  { id: "sk7-washhands", label: "Umývanie rúk v umývadle", emoji: "🧼", category: "Zdravie", acceptedAnswers: ["umývanie rúk vodou a mydlom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Washing_hands_in_sink.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Washing_hands_in_sink.ogg", credit: "jim_mowatt (PDSounds)", license: "Public domain" },
  { id: "sk7-vaporizestones", label: "Voda odparujúca sa na horúcich kameňoch", emoji: "♨️", category: "Príroda", acceptedAnswers: ["saunové kamene syčia"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Water_vaporizing_on_hot_stones.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Water_vaporizing_on_hot_stones.ogg", credit: "natalie (PDSounds)", license: "Public domain" },
  { id: "sk7-toypedal", label: "Naťahovacia hračka šliapajúca pedálmi", emoji: "🧸", category: "Každodenné situácie", acceptedAnswers: ["naťahovacia hračka sa hýbe"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Wound_up_toy_pedalling.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Wound_up_toy_pedalling.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-feltpen", label: "Písanie fixkou na papier", emoji: "🖊️", category: "Škola a kancelária", acceptedAnswers: ["kreslenie fixkou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Writing_with_feltpen.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Writing_with_feltpen.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-inkpen", label: "Písanie plniacim perom", emoji: "🖋️", category: "Škola a kancelária", acceptedAnswers: ["písanie atramentovým perom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Writing_with_inkpen.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Writing_with_inkpen.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
  { id: "sk7-fleamarket", label: "Bleší trh v daždi", emoji: "🌧️", category: "Mesto", acceptedAnswers: ["predajný stánok v daždi"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/10/Flea_market_in_the_rain.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Flea_market_in_the_rain.ogg", credit: "stephan (PDSounds)", license: "Public domain" },
];

export interface SoundClueDraft {
  label: string;
  emoji: string;
  category: string;
}

export const SOUND_CLUE_BACKLOG: SoundClueDraft[] = [
  // Domácnosť
  { label: "Vysávač", emoji: "🧹", category: "domácnosť" },
  { label: "Práčka", emoji: "🧺", category: "domácnosť" },
  { label: "Umývačka nádobia", emoji: "🍽️", category: "domácnosť" },
  { label: "Fén na vlasy", emoji: "💇", category: "domácnosť" },
  { label: "Šijací stroj", emoji: "🧵", category: "domácnosť" },
  { label: "Splachovanie toalety", emoji: "🚽", category: "domácnosť" },
  { label: "Tečúca voda z kohútika", emoji: "🚰", category: "domácnosť" },
  { label: "Sprcha", emoji: "🚿", category: "domácnosť" },
  { label: "Klopanie na dvere", emoji: "🚪", category: "domácnosť" },
  { label: "Škrípanie dverí", emoji: "🚪", category: "domácnosť" },
  { label: "Zabuchnutie dverí", emoji: "🚪", category: "domácnosť" },
  { label: "Cvaknutie vypínača", emoji: "💡", category: "domácnosť" },
  { label: "Štrngot kľúčov", emoji: "🔑", category: "domácnosť" },
  { label: "Trhanie papiera", emoji: "📄", category: "domácnosť" },
  { label: "Šušťanie plastového sáčku", emoji: "🛍️", category: "domácnosť" },
  { label: "Zapínanie zipsu", emoji: "🧥", category: "domácnosť" },
  { label: "Vrzganie parkiet", emoji: "🪵", category: "domácnosť" },
  { label: "Hodiny odbíjajúce hodinu", emoji: "🕕", category: "domácnosť" },
  { label: "Kosačka na trávu", emoji: "🌱", category: "domácnosť" },
  { label: "Žehlička", emoji: "👔", category: "domácnosť" },

  // Kuchyňa
  { label: "Varná kanvica", emoji: "☕", category: "kuchyňa" },
  { label: "Mixér", emoji: "🥤", category: "kuchyňa" },
  { label: "Smaženie na panvici", emoji: "🍳", category: "kuchyňa" },
  { label: "Krájanie na doske", emoji: "🔪", category: "kuchyňa" },
  { label: "Otváranie fľaše", emoji: "🍾", category: "kuchyňa" },
  { label: "Nalievanie do pohára", emoji: "🥛", category: "kuchyňa" },
  { label: "Miešanie lyžičkou v šálke", emoji: "🥄", category: "kuchyňa" },
  { label: "Praskanie popcornu", emoji: "🍿", category: "kuchyňa" },
  { label: "Mletie kávy", emoji: "☕", category: "kuchyňa" },
  { label: "Cinknutie príboru", emoji: "🍴", category: "kuchyňa" },
  { label: "Rozbitie taniera", emoji: "🍽️", category: "kuchyňa" },
  { label: "Šľahanie metličkou", emoji: "🥚", category: "kuchyňa" },
  { label: "Bublanie hrnca", emoji: "🍲", category: "kuchyňa" },
  { label: "Šuchot alobalu", emoji: "🧻", category: "kuchyňa" },
  { label: "Toastovač", emoji: "🍞", category: "kuchyňa" },

  // Elektronika
  { label: "Klik myšou", emoji: "🖱️", category: "elektronika" },
  { label: "Vibrovanie telefónu", emoji: "📳", category: "elektronika" },
  { label: "Cvaknutie fotoaparátu", emoji: "📷", category: "elektronika" },
  { label: "Tlačiareň", emoji: "🖨️", category: "elektronika" },
  { label: "Spúšťanie počítača", emoji: "💻", category: "elektronika" },
  { label: "Notifikácia správy", emoji: "📱", category: "elektronika" },

  // Doprava
  { label: "Vlak prechádzajúci stanicou", emoji: "🚉", category: "doprava" },
  { label: "Električka", emoji: "🚊", category: "doprava" },
  { label: "Metro", emoji: "🚇", category: "doprava" },
  { label: "Otváranie dverí autobusu", emoji: "🚌", category: "doprava" },
  { label: "Lietadlo pri štarte", emoji: "✈️", category: "doprava" },
  { label: "Hučanie lode", emoji: "🚢", category: "doprava" },
  { label: "Motorka", emoji: "🏍️", category: "doprava" },
  { label: "Bicyklový zvonček", emoji: "🚲", category: "doprava" },
  { label: "Železničné priecestie", emoji: "🚧", category: "doprava" },
  { label: "Hlásenie na stanici", emoji: "📢", category: "doprava" },
  { label: "Kotúľanie kufra", emoji: "🧳", category: "doprava" },
  { label: "Klaksón nákladného auta", emoji: "🚚", category: "doprava" },

  // Stroje a náradie
  { label: "Vŕtačka", emoji: "🛠️", category: "stroje" },
  { label: "Motorová píla", emoji: "🪚", category: "stroje" },
  { label: "Kotúčová píla", emoji: "🪚", category: "stroje" },
  { label: "Uhlová brúska", emoji: "⚙️", category: "stroje" },
  { label: "Kladivo a klince", emoji: "🔨", category: "stroje" },
  { label: "Zbíjačka", emoji: "🚧", category: "stroje" },
  { label: "Miešačka betónu", emoji: "🏗️", category: "stroje" },
  { label: "Zváranie", emoji: "🔧", category: "stroje" },
  { label: "Akumulátorový skrutkovač", emoji: "🪛", category: "stroje" },
  { label: "Ručná píla", emoji: "🪚", category: "stroje" },
  { label: "Šmirgľovanie dreva", emoji: "🪵", category: "stroje" },
  { label: "Kompresor", emoji: "💨", category: "stroje" },

  // Príroda a počasie
  { label: "Vietor v korunách stromov", emoji: "🌬️", category: "príroda" },
  { label: "Lesný potok", emoji: "🏞️", category: "príroda" },
  { label: "Vodopád", emoji: "💦", category: "príroda" },
  { label: "Kvapkanie vody", emoji: "💧", category: "príroda" },
  { label: "Krupobitie", emoji: "🧊", category: "počasie" },
  { label: "Sneh pod nohami", emoji: "❄️", category: "počasie" },
  { label: "Praskanie ľadu", emoji: "🧊", category: "počasie" },
  { label: "Cvrlikanie cvrčkov", emoji: "🦗", category: "príroda" },
  { label: "Šuchot listov", emoji: "🍂", category: "príroda" },
  { label: "Bzučanie komára", emoji: "🦟", category: "príroda" },

  // Zvieratá
  { label: "Chrochtanie prasaťa", emoji: "🐖", category: "zvieratá" },
  { label: "Kvokanie kury", emoji: "🐔", category: "zvieratá" },
  { label: "Trúbenie slona", emoji: "🐘", category: "zvieratá" },
  { label: "Vytie vlka", emoji: "🐺", category: "zvieratá" },
  { label: "Syčanie hada", emoji: "🐍", category: "zvieratá" },
  { label: "Rev medveďa", emoji: "🐻", category: "zvieratá" },
  { label: "Húkanie sovy", emoji: "🦉", category: "zvieratá" },
  { label: "Kukanie kukučky", emoji: "🐦", category: "zvieratá" },
  { label: "Klepanie ďatľa", emoji: "🪶", category: "zvieratá" },
  { label: "Krákanie vrany", emoji: "🐦‍⬛", category: "zvieratá" },
  { label: "Čvirikanie vrabcov", emoji: "🐦", category: "zvieratá" },
  { label: "Gagotanie husí", emoji: "🦢", category: "zvieratá" },
  { label: "Kvákanie kačíc", emoji: "🦆", category: "zvieratá" },

  // Šport
  { label: "Odraz basketbalového míča", emoji: "🏀", category: "šport" },
  { label: "Úder do tenisovej loptičky", emoji: "🎾", category: "šport" },
  { label: "Píšťalka rozhodcu", emoji: "🨺", category: "šport" },
  { label: "Strela na hokejovú bránku", emoji: "🏒", category: "šport" },
  { label: "Kop do futbalového míča", emoji: "⚽", category: "šport" },
  { label: "Boxovacie vrece", emoji: "🥊", category: "šport" },
  { label: "Skákanie na trampolíne", emoji: "🤸", category: "šport" },
  { label: "Bicyklové prehadzovanie", emoji: "🚴", category: "šport" },

  // Človek a bežné činnosti
  { label: "Smiech", emoji: "😄", category: "človek" },
  { label: "Kýchanie", emoji: "🤧", category: "človek" },
  { label: "Kašeľ", emoji: "😷", category: "človek" },
  { label: "Chrápanie", emoji: "😴", category: "človek" },
  { label: "Pískanie melódie", emoji: "🎵", category: "človek" },
  { label: "Dupanie nôh", emoji: "👣", category: "človek" },
  { label: "Šepot", emoji: "🤫", category: "človek" },
  { label: "Plač dieťaťa", emoji: "👶", category: "človek" },
  { label: "Chrumkanie chipsov", emoji: "🥔", category: "človek" },
  { label: "Zubná kefka", emoji: "🪥", category: "človek" },
  { label: "Fúkanie sviečok", emoji: "🎂", category: "človek" },
  { label: "Zívanie", emoji: "🥱", category: "človek" },
  { label: "Hvizd na prsty", emoji: "👌", category: "človek" },
  { label: "Kroky na chodníku", emoji: "🚶", category: "človek" },

  // Ulica, mesto, obchody
  { label: "Pípanie pri kase", emoji: "🛒", category: "mesto" },
  { label: "Bankomat", emoji: "🏧", category: "mesto" },
  { label: "Kaviarenský ruch", emoji: "☕", category: "mesto" },
  { label: "Detské hrisko", emoji: "🛝", category: "mesto" },
  { label: "Fontána", emoji: "⛲", category: "mesto" },
  { label: "Kostolný organ", emoji: "🎹", category: "mesto" },
  { label: "Ohňostroj", emoji: "🎆", category: "mesto" },
  { label: "Vyprázdňovanie kontejnera", emoji: "🗑️", category: "mesto" },

  // Hudobné nástroje
  { label: "Klavír", emoji: "🎹", category: "nástroje" },
  { label: "Akord na gitare", emoji: "🎸", category: "nástroje" },
  { label: "Bicie", emoji: "🥁", category: "nástroje" },
  { label: "Trúbka", emoji: "🎺", category: "nástroje" },
  { label: "Violončelo", emoji: "🎻", category: "nástroje" },
  { label: "Flauta", emoji: "🪈", category: "nástroje" },
  { label: "Harmonika", emoji: "🪗", category: "nástroje" },
  { label: "Zvonkohra", emoji: "🎐", category: "nástroje" },

  // Predmety, hračky a zábava
  { label: "Prasknutie balóna", emoji: "🎈", category: "predmety" },
  { label: "Nafukovanie balóna", emoji: "🎈", category: "predmety" },
  { label: "Detská hrkálka", emoji: "🍼", category: "hračky" },
  { label: "Naťahovacia hračka", emoji: "🧸", category: "hračky" },
  { label: "Píšťalka", emoji: "🪈", category: "hračky" },
  { label: "Miešanie kariet", emoji: "🃏", category: "zábava" },
  { label: "Hod kockou", emoji: "🎲", category: "zábava" },
  { label: "Cvaknutie zapaľovača", emoji: "🔥", category: "predmety" },
  { label: "Ostrenie ceruzky", emoji: "✏️", category: "predmety" },
  { label: "Klikanie perom", emoji: "🖊️", category: "predmety" },
  { label: "Suchý zips", emoji: "🧷", category: "predmety" },
  { label: "Rozbaľovanie darčeka", emoji: "🎁", category: "zábava" },
  { label: "Otváranie šampanského", emoji: "🍾", category: "zábava" },
];

/**
 * Zdroj pre hru. Obsahuje výhradne položky s funkčným zvukom — bez
 * `.slice()` limitu, pretože pool už nie je nafúknutý výplňou a hra
 * potrebuje najviac 20 zvukov na partiu.
 */
export const SOUND_CLUES: SoundClue[] = [
  ...CORE_SOUND_CLUES,
  ...COMMONS_SOUND_CLUES,
  ...EXPANDED_SOUND_CLUES_1,
  ...EXPANDED_SOUND_CLUES_2,
  ...EXPANDED_SOUND_CLUES_3,
  ...EXPANDED_SOUND_CLUES_4,
  ...EXPANDED_SOUND_CLUES_5,
  ...EXPANDED_SOUND_CLUES_6,
];

const LETTER_CATEGORIES = [
  "Zviera", "Jedlo", "Mesto", "Meno", "Povolanie", "Šport", "Krajina", "Rastlina",
  "Vec v kuchyni", "Vec v škole", "Vec v kúpeľni", "Značka", "Film alebo seriál", "Hudobník",
  "Oblečenie", "Dopravný prostriedok", "Vec na dovolenku", "Niečo v prírode", "Slovo spojené so zimou", "Vec v obchode",
  "Druh ovocia", "Druh zeleniny", "Rozprávková postava", "Superhrdina", "Herec alebo herečka",
  "Spevák alebo kapela", "Školský predmet", "Vec v aute", "Vec na pláži", "Vec na párty",
  "Vec v lese", "Vec v kancelárii", "Elektronika", "Hudobný nástroj", "Značka auta",
  "Emócia", "Farba alebo odtieň", "Nápoj", "Dezert", "Činnosť",
  "Slovo spojené s letom", "Slovo spojené s Vianocami", "Vec v spálni", "Vec v nemocnici", "Vec na letisku",
  "Postava z filmu", "Videohra", "Aplikácia", "Kvet alebo strom", "Vec, ktorá svieti",
  ...GENERATED_LETTER_CATEGORIES,
];
const PLAYABLE_LETTERS = ["A", "B", "C", "D", "F", "H", "J", "K", "L", "M", "N", "O", "P", "R", "S", "T", "V", "Z"];

export interface LetterChallenge {
  category: string;
  letter: string;
}

export const LETTER_CHALLENGES: LetterChallenge[] = shuffle(
  LETTER_CATEGORIES.flatMap((category, categoryIndex) =>
    PLAYABLE_LETTERS.slice(categoryIndex % 4, categoryIndex % 4 + 8).map((letter) => ({ category, letter })),
  ),
);

const CORE_FIVE_IN_TEN_PROMPTS = [
  "značiek áut", "zvierat žijúcich vo vode", "slovenských miest", "filmov", "vecí v kuchyni",
  "druhov ovocia", "druhov zeleniny", "športov", "povolaní", "krajín v Európe",
  "vecí v školskej taške", "vecí v kúpeľni", "sociálnych sietí", "hudobných nástrojov", "rozprávkových postáv",
  "superhrdinov", "jedál na raňajky", "nápojov", "zvierat na farme", "vecí, ktoré lietajú",
  "vecí, ktoré sú červené", "slov na písmeno M", "slov na písmeno K", "zimných športov", "letných aktivít",
  "miest, kde sa dá nakupovať", "vecí v chladničke", "vecí na pláži", "aplikácií v mobile", "filmových hercov",
  "spevákov alebo speváčok", "futbalových klubov", "hokejistov", "značiek oblečenia", "druhov sladkostí",
  "vecí, ktoré vydávajú zvuk", "vecí so štyrmi kolesami", "vecí, ktoré nájdeš v lese", "domácich zvierat", "divokých zvierat",
  "vecí potrebných na dovolenku", "dôvodov, prečo meškať", "vecí na narodeninovej oslave", "miest v dome", "kuchynských spotrebičov",
  "vecí, ktoré sa dajú otvoriť", "vecí, ktoré sú mäkké", "vecí, ktoré svietia", "vecí na pracovnom stole", "známych seriálov",
  "animovaných filmov", "postáv z Harryho Pottera", "slovenských spevákov", "svetových športovcov", "hlavných miest štátov",
  "druhov počasia", "vecí spojených s Vianocami", "školských predmetov", "tanečných štýlov", "hudobných žánrov",
  "vecí, ktoré môžeš stratiť", "darčekov pre kamaráta", "vecí v aute", "vecí na stanovačku", "zmrzlinových príchutí",
  "pizzových ingrediencií", "jedál z fastfoodu", "vecí, ktoré sa dajú nafúknuť", "druhov obuvi", "kusov oblečenia",
  "vecí, ktoré robíš ráno", "vecí, ktoré robíš pred spaním", "miest na prvé rande", "slov spojených s internetom", "hier pre deti",
  "stolových hier", "vecí v nemocnici", "dopravných značiek", "vecí na záhrade", "druhov kvetov",
];

const EXTRA_FIVE_IN_TEN_LIBRARY = `
zvierat žijúcich v Afrike
zvierat žijúcich v lese
zvierat žijúcich na severe
zvierat, ktoré vedia lietať
zvierat, ktoré kladú vajcia
zvierat s dlhým chvostom
zvierat so štyrmi nohami
zvierat, ktorých sa ľudia boja
zvierat chovaných ako domáci miláčikovia
zvierat, ktoré nájdeš v zoologickej záhrade
vtákov
rýb alebo morských živočíchov
druhov hmyzu
plemien psov
veľkých mačkovitých šeliem
zvierat začínajúcich na písmeno P
zvierat začínajúcich na písmeno K
zvierat začínajúcich na písmeno M
zvukov, ktoré vydávajú zvieratá
vecí, ktoré potrebuje domáci miláčik
tropických druhov ovocia
citrusových plodov
červených druhov ovocia
žltých druhov ovocia
zelených druhov zeleniny
druhov koreňovej zeleniny
jedál zo zemiakov
jedál s cestovinami
jedál s ryžou
jedál, ktoré sa jedia rukami
jedál, ktoré sa jedia lyžicou
jedál vhodných na piknik
jedál na grilovanie
jedál na Vianoce
jedál na oslavu
slovenských tradičných jedál
talianskych jedál
ázijských jedál
dezertov
druhov koláčov
druhov pečiva
druhov syra
druhov polievok
omáčok alebo dochucovadiel
prísad do šalátu
vecí, ktoré si dáš do sendviča
vecí, ktoré si môžeš objednať v kaviarni
teplých nápojov
studených nápojov
alkoholických nápojov
nealkoholických nápojov
príchutí džúsu
raňajkových cereálií alebo jedál
jedál, ktoré nájdeš v školskej jedálni
vecí, ktoré nájdeš v pekárni
vecí, ktoré nájdeš v cukrárni
vecí, ktoré nájdeš v supermarkete
vecí, ktoré bývajú v mrazničke
vecí, ktoré patria do špajze
vecí, ktoré sú kyslé
vecí, ktoré sú sladké
vecí, ktoré sú slané
vecí, ktoré sú chrumkavé
vecí, ktoré sa môžu roztopiť
vecí, ktoré treba ošúpať
vecí, ktoré sa dajú nakrájať
vecí, ktoré sa varia vo vode
vecí, ktoré sa pečú v rúre
jedál začínajúcich na písmeno P
jedál začínajúcich na písmeno S
jedál začínajúcich na písmeno K
jedál začínajúcich na písmeno Č
povolaní v nemocnici
povolaní v škole
povolaní v reštaurácii
povolaní, pri ktorých sa nosí uniforma
povolaní, pri ktorých sa pracuje vonku
povolaní, pri ktorých sa používa počítač
povolaní, pri ktorých sa šoféruje
povolaní, pri ktorých sa pomáha ľuďom
povolaní, pri ktorých sa pracuje v noci
povolaní spojených s umením
povolaní spojených so športom
povolaní spojených so zvieratami
povolaní začínajúcich na písmeno P
povolaní začínajúcich na písmeno K
vecí, ktoré používa lekár
vecí, ktoré používa kuchár
vecí, ktoré používa učiteľ
vecí, ktoré používa hasič
vecí, ktoré používa policajt
vecí, ktoré používa kaderník
vecí, ktoré používa mechanik
vecí, ktoré používa maliar
vecí, ktoré používa fotograf
vecí, ktoré používa záhradník
miest v škole
miest v nemocnici
miest v hoteli
miest na letisku
miest na železničnej stanici
miest v nákupnom centre
miest v meste
miest na dedine
miest, kde musí byť ticho
miest, kde sa platí vstupné
miest, kde sa čaká v rade
miest, kde sa dá športovať
miest, kde sa dá plávať
miest, kde sa dá najesť
miest, kde sa dá prespať
miest, kam môžeš ísť cez víkend
miest vhodných na rodinný výlet
miest vhodných na rande
miest, kde by si nechcel zostať zamknutý
miest, kde býva veľa ľudí
miest, kde býva zima
miest, kde býva horúco
európskych krajín
ázijských krajín
afrických krajín
krajín pri mori
krajín, v ktorých sa hovorí po anglicky
krajín začínajúcich na písmeno S
krajín začínajúcich na písmeno M
slovenských krajských miest
slovenských riek
slovenských pohorí
slovenských hradov alebo zámkov
turistických miest na Slovensku
európskych hlavných miest
svetových veľkomiest
ostrovov
morí alebo oceánov
riek sveta
pohorí alebo vrchov
vecí, ktoré nájdeš na mape
dopravných prostriedkov na zemi
dopravných prostriedkov na vode
dopravných prostriedkov vo vzduchu
značiek automobilov z Nemecka
značiek automobilov z Ázie
častí auta
vecí, ktoré vodič potrebuje v aute
vecí, ktoré sa môžu na aute pokaziť
vecí na čerpacej stanici
vecí na vlakovej stanici
vecí na autobusovej zastávke
vecí na letisku
vecí v lietadle
vecí na lodi
vecí, ktoré vidíš počas jazdy autom
dôvodov, prečo môže meškať vlak
dôvodov, prečo môže vzniknúť zápcha
pravidiel bezpečnej jazdy
dopravných prostriedkov s dvomi kolesami
vecí, ktoré majú volant
vecí, ktoré majú motor
vecí, ktoré majú kolesá
vecí v obývačke
vecí v spálni
vecí v detskej izbe
vecí na chodbe
vecí v pivnici
vecí v garáži
vecí na balkóne
vecí na streche
vecí na podlahe
vecí zavesených na stene
kusov nábytku
kuchynských nástrojov
čistiacich potrieb
elektrických spotrebičov v domácnosti
vecí, ktoré potrebuješ pri sťahovaní
vecí, ktoré sa doma môžu rozbiť
vecí, ktoré sa doma zamykajú
vecí, ktoré sa zapájajú do zásuvky
vecí, ktoré majú vypínač
vecí, ktoré majú dvierka
vecí, ktoré majú zásuvku alebo šuplík
vecí, ktoré nájdeš pod posteľou
vecí, ktoré nájdeš na nočnom stolíku
vecí, ktoré nájdeš v skrini
vecí, ktoré nájdeš v chladničke
vecí, ktoré nájdeš pri umývadle
vecí potrebných na upratovanie
vecí potrebných na pranie
vecí potrebných na varenie
vecí potrebných na pečenie
vecí potrebných na maľovanie izby
vecí potrebných na opravu domu
kusov zimného oblečenia
kusov letného oblečenia
kusov športového oblečenia
vecí, ktoré si obuješ
vecí, ktoré nosíš na hlave
vecí, ktoré nosíš na rukách
vecí, ktoré nosíš okolo krku
vecí, ktoré môžeš mať vo vrecku
vecí, ktoré môžeš mať v kabelke
vecí, ktoré môžeš mať v peňaženke
šperkov alebo módnych doplnkov
kozmetických výrobkov
vecí potrebných na sprchovanie
vecí potrebných na čistenie zubov
vecí potrebných na úpravu vlasov
vecí, ktoré si balíš na lyžovačku
vecí, ktoré si balíš k moru
vecí, ktoré si balíš na stanovačku
vecí, ktoré si balíš na služobnú cestu
vecí, ktoré si nesmieš zabudnúť na dovolenku
športov s loptou
športov bez lopty
vodných športov
bojových športov
atletických disciplín
olympijských športov
športov, ktoré sa hrajú v hale
športov, ktoré sa hrajú vonku
športov, pri ktorých treba prilbu
športov, pri ktorých sa používa raketa alebo palica
športov, ktoré sa hrajú v tímoch
slovenských futbalistov
svetových futbalistov
slovenských hokejistov
svetových tenistov
športových značiek
vecí vo futbalovej výbave
vecí v hokejovej výbave
vecí v posilňovni
cvikov
dôvodov, prečo ľudia športujú
vecí, ktoré môžeš vyhrať v súťaži
vecí spojených s olympiádou
filmov od Disney
animovaných seriálov
komediálnych filmov
akčných filmov
hororových filmov
vianočných filmov
filmových sérií
postáv zo Star Wars
postáv z Marvelu
postáv z DC
postáv z rozprávok Disney
postáv zo seriálu Priatelia
postáv zo seriálu Simpsonovci
postáv z videohier
známych filmových zloduchov
známych detektívov z filmov alebo kníh
slovenských hercov alebo herečiek
českých hercov alebo herečiek
hollywoodskych hercov
filmov, v ktorých vystupujú zvieratá
vecí, ktoré nájdeš v kine
vecí spojených s natáčaním filmu
hudobných skupín
slovenských hudobných skupín
českých spevákov alebo speváčok
svetových spevákov
rapperov
rockových skupín
hudobných nástrojov so strunami
dychových hudobných nástrojov
hudobných nástrojov, na ktoré sa udiera
pesničiek, ktoré pozná skoro každý
vianočných pesničiek
detských pesničiek
vecí na koncerte
vecí, ktoré robí hudobník
zvukov, ktoré počuješ v meste
zvukov, ktoré počuješ v prírode
zvukov, ktoré počuješ doma
zvukov, ktoré ťa môžu zobudiť
webových stránok
počítačových programov
mobilných aplikácií na komunikáciu
mobilných aplikácií na video
streamovacích služieb
značiek mobilných telefónov
značiek počítačov
častí počítača
vecí pripojených k počítaču
vecí, ktoré potrebuješ na videohovor
vecí, ktoré môžeš robiť na internete
vecí, ktoré ľudia zdieľajú na sociálnych sieťach
emoji, ktoré často používaš
dôvodov, prečo sa vybije mobil
dôvodov, prečo nejde internet
vecí, ktoré chránia účet na internete
videohier, ktoré pozná skoro každý
herných konzol
vecí, ktoré nájdeš v počítačovej hre
slov spojených s umelou inteligenciou
slov spojených s fotografovaním
vecí v triede
vecí na učiteľskom stole
vecí v peračníku
vecí v telocvični
vecí v školskej jedálni
vecí v školskej knižnici
vecí, ktoré žiak robí cez prestávku
dôvodov, prečo žiak nemá domácu úlohu
dôvodov, prečo sa tešíš na prázdniny
spôsobov, ako sa dá učiť
vecí potrebných na písomku
školských známok alebo hodnotení
jazykov, ktoré sa učia v škole
matematických pojmov
geometrických tvarov
historických osobností
vynálezov
planét alebo vesmírnych telies
vecí vo vesmíre
vecí, ktoré robí astronaut
vecí spojených s dažďom
vecí spojených so snehom
vecí spojených s búrkou
vecí spojených s horúčavou
vecí spojených s jarou
vecí spojených s letom
vecí spojených s jeseňou
vecí spojených so zimou
vecí, ktoré robíš počas daždivého dňa
vecí, ktoré môže odniesť vietor
vecí, ktoré zamrznú
vecí, ktoré ťa chránia pred slnkom
vecí, ktoré ťa chránia pred dažďom
vecí, ktoré vidíš na oblohe
prírodných katastrof
druhov stromov
lesných plodov
vecí rastúcich v záhrade
vecí, ktoré nájdeš na lúke
vecí, ktoré nájdeš pri rieke
vecí, ktoré nájdeš v horách
vecí, ktoré nájdeš v jaskyni
vecí, ktoré patria k moru
vecí, ktoré patria k púšti
vecí, ktoré sú ekologické
spôsobov, ako chrániť prírodu
vecí, ktoré sa dajú recyklovať
vecí na svadbe
vecí na narodeninovej párty
vecí na karnevale
vecí na diskotéke
vecí na festivale
vecí na pikniku
vecí na opekačke
vecí na grilovačke
vecí na Silvestra
vecí na Veľkú noc
vecí na Halloween
darčekov na Vianoce
darčekov pre dieťa
darčekov pre rodičov
dôvodov na oslavu
dôvodov, prečo usporiadať párty
hier, ktoré sa dajú hrať na oslave
vecí, ktoré hostiteľ pripraví pre návštevu
dôvodov, prečo sa ľudia smejú
dôvodov, prečo ľudia plačú
vecí, ktorých sa ľudia boja
vecí, ktoré ľudí hnevajú
vecí, ktoré ľudí potešia
vecí, ktoré sú romantické
vecí, ktoré sú trápne
vecí, ktoré sú nebezpečné
vecí, ktoré sú drahé
vecí, ktoré sú zadarmo
vecí, ktoré rýchlo miznú
vecí, na ktoré sa dlho čaká
dôvodov, prečo niekto zaspí
dôvodov, prečo niekto mešká
dôvodov, prečo niekto klame
dôvodov, prečo sa ľudia hádajú
dôvodov, prečo sa ospravedlniť
vecí, ktoré robíš, keď sa nudíš
vecí, ktoré robíš, keď si hladný
vecí, ktoré robíš, keď si unavený
vecí, ktoré robíš, keď si šťastný
vecí, ktoré robíš potichu
vecí, ktoré robíš veľmi nahlas
vecí, ktoré môžeš zabudnúť
vecí, ktoré si musíš pamätať
vecí, ktoré sa dajú požičať
vecí, ktoré sa dajú darovať
vecí, ktoré sa dajú zbierať
vecí, ktoré sa dajú zlomiť
vecí, ktoré sa dajú rozliať
vecí, ktoré sa dajú zrolovať
vecí, ktoré sa dajú zaviazať
vecí, ktoré sa dajú zapnúť
vecí, ktoré sa dajú vypnúť
vecí, ktoré sa dajú nabíjať
vecí, ktoré sa dajú odfotiť
vecí, ktoré sa dajú podpísať
vecí, ktoré sa dajú poslať poštou
vecí, ktoré sa dajú kúpiť online
vecí menších ako mobil
vecí väčších ako auto
vecí ľahších ako kniha
vecí ťažších ako človek
okrúhlych vecí
štvorcových vecí
priehľadných vecí
farebných vecí
čiernobielych vecí
kovových vecí
drevených vecí
plastových vecí
sklenených vecí
vecí s číslami
vecí s písmenami
vecí s rukoväťou
vecí s displejom
vecí s batériou
vecí so zipsom
vecí s kolieskami
vecí s tlačidlami
vecí, ktoré blikajú
vecí, ktoré pípajú
vecí, ktoré príjemne voňajú
vecí, ktoré nepríjemne zapáchajú
vecí, ktoré sú horúce
vecí, ktoré sú studené
vecí, ktoré sú ostré
vecí, ktoré sú lepkavé
vecí, ktoré sú krehké
vecí, ktoré sú hlučné
vecí, ktoré sú tiché
slov na písmeno A
slov na písmeno B
slov na písmeno D
slov na písmeno H
slov na písmeno L
slov na písmeno N
slov na písmeno O
slov na písmeno P
slov na písmeno R
slov na písmeno S
slov na písmeno T
slov na písmeno V
slov na písmeno Z
mien na písmeno M
mien na písmeno J
mien na písmeno P
slov, ktoré sa rýmujú so slovom dom
slov, ktoré sa rýmujú so slovom pes
slov, ktoré sa rýmujú so slovom noc
`.trim().split("\n");

export const FIVE_IN_TEN_PROMPTS = [...new Set([
  ...CORE_FIVE_IN_TEN_PROMPTS,
  ...EXTRA_FIVE_IN_TEN_LIBRARY,
])];
