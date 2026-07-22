import { shuffle } from "./teamBattle";

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

export const FORBIDDEN_CARDS: ForbiddenCard[] = [...CORE_FORBIDDEN_CARDS, ...EXTRA_FORBIDDEN_CARDS];

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
`;

const parsedSongs: SongCard[] = SONG_LIBRARY.trim().split("\n").map((line) => {
  const [title, artist] = line.split("|");
  return { title: title.trim(), artist: artist.trim() };
});
export const SONG_CARDS: SongCard[] = Array.from(
  new Map(parsedSongs.map((song) => [`${song.title.toLocaleLowerCase()}|${song.artist.toLocaleLowerCase()}`, song])).values(),
);

export interface SoundClue {
  id: string;
  label: string;
  emoji: string;
  audioUrl: string;
  sourcePage: string;
  credit: string;
  license: string;
}

export const SOUND_CLUES: SoundClue[] = [
  { id: "engine", label: "Motor auta", emoji: "🚗", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/WWS_CarPrinzNSU1200Cengine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_CarPrinzNSU1200Cengine.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0" },
  { id: "cat", label: "Mňaukajúca mačka", emoji: "🐈", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Meow_of_a_pleading_cat.oga", sourcePage: "https://commons.wikimedia.org/wiki/File:Meow_of_a_pleading_cat.oga", credit: "Heismark", license: "Public domain" },
  { id: "can", label: "Otvorenie plechovky", emoji: "🥫", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Opening_a_can.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Opening_a_can.ogg", credit: "stephan", license: "Public domain" },
  { id: "dog", label: "Štekajúci pes", emoji: "🐕", audioUrl: "/sounds/dog.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Barking_of_a_dog.ogg", credit: "Amada44", license: "CC BY-SA 3.0" },
  { id: "rain", label: "Dážď na okne", emoji: "🌧️", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/41/Rain_against_the_window.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Rain_against_the_window.ogg", credit: "cori", license: "Public domain" },
  { id: "siren", label: "Policajná siréna", emoji: "🚓", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ae/American_police_siren_i.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:American_police_siren_i.ogg", credit: "lezer", license: "Public domain" },
  { id: "clock", label: "Tikajúce hodiny", emoji: "🕰️", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Alarm_clock_ticking.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Alarm_clock_ticking.ogg", credit: "ezwa", license: "Public domain" },
  { id: "doorbell", label: "Zvonček pri dverách", emoji: "🔔", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/90/Doorbell-cheap-dingdong.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Doorbell-cheap-dingdong.ogg", credit: "Wikimedia Commons", license: "Public domain" },
  { id: "phone", label: "Zvonenie telefónu", emoji: "☎️", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Telephone.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Telephone.ogg", credit: "Dsw4", license: "Public domain" },
  { id: "train", label: "Klaksón vlaku", emoji: "🚆", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/4000_class_train_horn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:4000_class_train_horn.ogg", credit: "Cityedit14", license: "CC BY-SA 4.0" },
  { id: "heartbeat", label: "Búšenie srdca", emoji: "❤️", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Heartbeat_mitral_valve_150_bpm.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Heartbeat_mitral_valve_150_bpm.ogg", credit: "ezwa", license: "Public domain" },
  { id: "helicopter", label: "Vrtuľník", emoji: "🚁", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Helicopter_over_quiet_neighbourhood.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Helicopter_over_quiet_neighbourhood.ogg", credit: "ezwa", license: "Public domain" },
  { id: "microwave", label: "Mikrovlnná rúra", emoji: "📟", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Microwave_oven.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Microwave_oven.ogg", credit: "stephan", license: "Public domain" },
  { id: "keyboard", label: "Písanie na klávesnici", emoji: "⌨️", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Keyboard_noise.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Keyboard_noise.ogg", credit: "Yuyudevil", license: "Public domain" },
  { id: "alarm", label: "Budík", emoji: "⏰", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Alarm_Clock_%28Directory.Audio%29.mp3", sourcePage: "https://commons.wikimedia.org/wiki/File:Alarm_Clock_(Directory.Audio).mp3", credit: "Yoo-toob-FX", license: "CC0" },
  { id: "applause", label: "Potlesk", emoji: "👏", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/Applause_ii.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Applause_ii.ogg", credit: "thore", license: "Public domain" },
  { id: "horse", label: "Cválajúce kone", emoji: "🐎", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Six_Horses_Galloping_By.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Six_Horses_Galloping_By.ogg", credit: "Freesound Community / Bruno Auzet", license: "CC0" },
  { id: "fire", label: "Praskajúci oheň", emoji: "🔥", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/80/Bones_breaking_wood_fire_ice_crackling.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Bones_breaking_wood_fire_ice_crackling.ogg", credit: "stephan", license: "Public domain" },
];

const LETTER_CATEGORIES = [
  "Zviera", "Jedlo", "Mesto", "Meno", "Povolanie", "Šport", "Krajina", "Rastlina",
  "Vec v kuchyni", "Vec v škole", "Vec v kúpeľni", "Značka", "Film alebo seriál", "Hudobník",
  "Oblečenie", "Dopravný prostriedok", "Vec na dovolenku", "Niečo v prírode", "Slovo spojené so zimou", "Vec v obchode",
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

export const FIVE_IN_TEN_PROMPTS = [...CORE_FIVE_IN_TEN_PROMPTS, ...EXTRA_FIVE_IN_TEN_LIBRARY];
