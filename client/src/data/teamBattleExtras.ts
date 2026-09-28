import { shuffle } from "./teamBattle";
import type { AppLanguage } from "../i18n/LanguageProvider";
import { hasContentLocale, localizeContent, localizeList, soundTextFor } from "../i18n/content";
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
  /** Korekcia hlasitosti v dB, ktorú prehrávač aplikuje, aby všetky zvuky
   *  zneli približne rovnako hlasno (cieľ −18 LUFS). Generuje ju
   *  `scripts/measure-sound-loudness.py`; chýbajúca hodnota = bez korekcie. */
  gainDb?: number;
  /** Sekunda, od ktorej sa má ukážka prehrávať — preskočí úvodné ticho. */
  startAt?: number;
  tonePattern?: Array<{ frequency: number; duration: number; pause: number }>;
}

/** Zvuk vyradený pri audite; nikdy sa nedostane do hry. */
export interface SoundClueReview extends SoundClue {
  reviewReason: string;
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
 * `scripts/validate-sound-clues.mjs` to kontroluje vrátane porovnania na úrovni
 * súboru (rovnaká nahrávka pod dvomi rôznymi URL tvarmi je tiež duplicita).
 *
 * `label` sa hráčovi ukáže až po odhalení odpovede. Má byť krátky a prirodzený
 * (ideálne 1–3 slová), ako by zvuk pomenoval bežný človek. `acceptedAnswers`
 * obsahuje ďalšie formulácie, ktoré sa majú uznať — hra ich zobrazí pri
 * odhalení, aby rozhodujúci hráč vedel, čo ešte platí.
 */

/**
 * Hlasitosť: `gainDb` a `startAt` sú vygenerované skriptom
 * `scripts/measure-sound-loudness.py` z reálnych nahrávok (prvých 7 s od
 * `startAt` = predvolená dĺžka ukážky, EBU R128). Cieľ je −18 LUFS.
 * Hodnoty sú kalibrované renderom cez rovnaký Web Audio reťazec ako v hre
 * (GainNode → DynamicsCompressor), takže výstup nikdy neprekročí 0 dBFS.
 * Tiché nahrávky so slabým odstupom od šumu sa nezosilňujú nad +15 dB.
 * Hodnoty needitujte ručne — spustite skript znova.
 */
/** Pôvodné zvuky databázy (pred rozšírením). */
const CORE_SOUND_CLUES: SoundClue[] = [
  { id: "sk-engine-idle", label: "Motor auta", emoji: "🚗", category: "Doprava", acceptedAnswers: ["bežiaci motor", "auto"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/WWS_CarPrinzNSU1200Cengine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_CarPrinzNSU1200Cengine.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -1.8 },
  { id: "sk-cat-meow", label: "Mňaukanie mačky", emoji: "🐈", category: "Zvieratá", acceptedAnswers: ["mačka", "mňaukanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Meow_of_a_pleading_cat.oga", sourcePage: "https://commons.wikimedia.org/wiki/File:Meow_of_a_pleading_cat.oga", credit: "Heismark", license: "Public domain", gainDb: -3.4 },
  { id: "sk-can-open", label: "Otvorenie plechovky", emoji: "🥫", category: "Kuchyňa", acceptedAnswers: ["plechovka", "otváranie konzervy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Opening_a_can.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Opening_a_can.ogg", credit: "stephan", license: "Public domain", gainDb: 19.6 },
  { id: "sk-dog-bark", label: "Štekot psa", emoji: "🐕", category: "Zvieratá", acceptedAnswers: ["pes", "štekanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Barking_of_a_dog.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Barking_of_a_dog.ogg", credit: "Amada44", license: "CC BY-SA 3.0", gainDb: -5.5 },
  { id: "sk-rain-window", label: "Dážď na okne", emoji: "🌧️", category: "Príroda", acceptedAnswers: ["dážď", "búrka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/41/Rain_against_the_window.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Rain_against_the_window.ogg", credit: "cori", license: "Public domain", gainDb: 14.5 },
  { id: "sk-doorbell", label: "Zvonček pri dverách", emoji: "🔔", category: "Domácnosť", acceptedAnswers: ["zvonček", "zvonenie pri dverách"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/90/Doorbell-cheap-dingdong.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Doorbell-cheap-dingdong.ogg", credit: "neuvedený autor (Wikimedia Commons)", license: "Public domain", gainDb: 5.7 },
  { id: "sk-train-horn", label: "Húkanie vlaku", emoji: "🚆", category: "Doprava", acceptedAnswers: ["vlak", "klaksón vlaku", "trúbenie vlaku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/4000_class_train_horn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:4000_class_train_horn.ogg", credit: "Cityedit14", license: "CC BY-SA 4.0", gainDb: -7.7 },
  { id: "sk-heartbeat", label: "Tlkot srdca", emoji: "❤️", category: "Zdravie", acceptedAnswers: ["srdce", "búšenie srdca"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Heartbeat_mitral_valve_150_bpm.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Heartbeat_mitral_valve_150_bpm.ogg", credit: "ezwa", license: "Public domain", gainDb: 1.6 },
  { id: "sk-microwave", label: "Mikrovlnka", emoji: "📟", category: "Kuchyňa", acceptedAnswers: ["mikrovlnná rúra"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Microwave_oven.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Microwave_oven.ogg", credit: "stephan", license: "Public domain", gainDb: 9.4 },
  { id: "sk-alarm-clock", label: "Budík", emoji: "⏰", category: "Domácnosť", acceptedAnswers: ["zvonenie budíka", "alarm"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Alarm_Clock_%28Directory.Audio%29.mp3", sourcePage: "https://commons.wikimedia.org/wiki/File:Alarm_Clock_(Directory.Audio).mp3", credit: "Yoo-toob-FX ( https://directory.audio/authoritems/665-yoo-toob-fx…", license: "CC0", gainDb: 1.9 },
  { id: "sk-applause", label: "Potlesk", emoji: "👏", category: "Voľný čas", acceptedAnswers: ["tlieskanie", "aplauz"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/Applause_ii.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Applause_ii.ogg", credit: "thore", license: "Public domain", gainDb: 8.4 },
  { id: "sk-horses-gallop", label: "Cválajúce kone", emoji: "🐎", category: "Zvieratá", acceptedAnswers: ["kone", "cval", "dostihy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Six_Horses_Galloping_By.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Six_Horses_Galloping_By.ogg", credit: "Freesound Community…", license: "CC0", gainDb: 6.0 },
  { id: "sk-fire-crackle", label: "Praskajúci oheň", emoji: "🔥", category: "Príroda", acceptedAnswers: ["oheň", "táborák", "krb"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/80/Bones_breaking_wood_fire_ice_crackling.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Bones_breaking_wood_fire_ice_crackling.ogg", credit: "stephan", license: "Public domain", gainDb: 5.1 },
  { id: "sk-rooster", label: "Kikiríkanie kohúta", emoji: "🐓", category: "Zvieratá", acceptedAnswers: ["kohút"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Rooster_crowing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Rooster_crowing.ogg", credit: "Filo gèn'", license: "CC BY-SA 4.0", gainDb: -8.6 },
  { id: "sk-sheep", label: "Bľačanie ovce", emoji: "🐑", category: "Zvieratá", acceptedAnswers: ["ovca", "ovce"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/13/Sheep_bleating.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Sheep_bleating.ogg", credit: "earthcalling", license: "Public domain", gainDb: -7.1 },
  { id: "sk-cow", label: "Bučanie kravy", emoji: "🐄", category: "Zvieratá", acceptedAnswers: ["krava"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Single_Cow_Moo.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Single_Cow_Moo.ogg", credit: "MichaeltheFox8621", license: "CC BY-SA 4.0", gainDb: -5.8 },
  { id: "sk-thunder", label: "Hrom", emoji: "⛈️", category: "Príroda", acceptedAnswers: ["búrka", "hrmenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Tonitrus.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Tonitrus.ogg", credit: "Mysid", license: "Public domain", gainDb: 3.6 },
  { id: "sk-church-bells", label: "Kostolné zvony", emoji: "🔔", category: "Mesto", acceptedAnswers: ["zvony", "zvonenie zvonov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Churchbells.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Churchbells.ogg", credit: "Natalie", license: "Public domain", gainDb: -1.2 },
  { id: "sk-sea-waves", label: "Vlny na brehu", emoji: "🌊", category: "Príroda", acceptedAnswers: ["vlny", "more", "jazero"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Waves.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Waves.ogg", credit: "Dsw4", license: "Public domain", gainDb: 10.2 },
  { id: "sk-lion", label: "Rev leva", emoji: "🦁", category: "Zvieratá", acceptedAnswers: ["lev", "revanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Lion_raring-sound1TamilNadu178.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Lion_raring-sound1TamilNadu178.ogg", credit: "த*உழவன்", license: "Public domain", gainDb: -5.4 },
];

/** Pôvodný kurátorský výber z Wikimedia Commons. Kedysi zapísaný ako `label|emoji|súbor`;
 * teraz ako bežné položky, aby mohol niesť overenú licenciu, autora a hlasitosť. ID sa nezmenili. */
const COMMONS_SOUND_CLUES: SoundClue[] = [
  { id: "commons-157763-felix-blume-a-donkey-is-braying-in-his-en", label: "Hýkanie osla", emoji: "🫏", category: "Zvieratá", acceptedAnswers: ["osol"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/25/157763_felix-blume_a-donkey-is-braying-in-his-enclosure-in-south-of-france.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:157763_felix-blume_a-donkey-is-braying-in-his-enclosure-in-south-of-france.wav", credit: "felix-blume", license: "CC0", gainDb: 0.2 },
  { id: "commons-bee-buzzing-sound-animal-noises-opus", label: "Bzučanie včiel", emoji: "🐝", category: "Príroda", acceptedAnswers: ["včela", "včely", "bzučanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Bee_buzzing_sound_%28animal_noises%29.opus", sourcePage: "https://commons.wikimedia.org/wiki/File:Bee_buzzing_sound_(animal_noises).opus", credit: "Free Sounds Library User Spanac", license: "CC BY 3.0", gainDb: 0.8 },
  { id: "commons-frogs-croak-calling-chorus-at-night-ogg", label: "Kvákanie žiab", emoji: "🐸", category: "Príroda", acceptedAnswers: ["žaby", "žabí koncert"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/Frogs_croak_calling_chorus_at_night.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Frogs_croak_calling_chorus_at_night.ogg", credit: "JogiAsad", license: "CC BY-SA 4.0", gainDb: 6.6 },
  { id: "commons-purr-10-sec-loopable-ogg", label: "Pradenie mačky", emoji: "🐈", category: "Zvieratá", acceptedAnswers: ["mačka priadie", "pradenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Purr_%2810_sec_loopable%29.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Purr_(10_sec_loopable).ogg", credit: "Insanejeff at English Wikipedia", license: "Public domain", gainDb: 0.6 },
  { id: "commons-segregation-of-information-about-emotional-arous", label: "Erdžanie koňa", emoji: "🐎", category: "Zvieratá", acceptedAnswers: ["kôň", "erdžanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Segregation-of-information-about-emotional-arousal-and-valence-in-horse-whinnies-srep09989-s2.oga", sourcePage: "https://commons.wikimedia.org/wiki/File:Segregation-of-information-about-emotional-arousal-and-valence-in-horse-whinnies-srep09989-s2.oga", credit: "Briefer E, Maigrot A, Mandel R, Freymond S, Bachmann I, Hillmann E", license: "CC BY 4.0", gainDb: -7.3 },
  { id: "commons-herd-of-goats-bleating-ogg", label: "Mečanie kôz", emoji: "🐐", category: "Zvieratá", acceptedAnswers: ["kozy", "koza"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Herd_of_goats_bleating.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Herd_of_goats_bleating.ogg", credit: "stephan", license: "Public domain", gainDb: -2.1 },
  { id: "commons-jem-howls-ogg", label: "Zavýjanie psa", emoji: "🐕", category: "Zvieratá", acceptedAnswers: ["vytie psa", "pes vyje"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Jem_howls.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Jem_howls.ogg", credit: "amethysta", license: "Public domain", gainDb: -3.5 },
  { id: "commons-psittacara-erythrogenys-red-masked-parakeet-wav", label: "Papagáje", emoji: "🦜", category: "Zvieratá", acceptedAnswers: ["papagáj", "škriekanie papagája"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Psittacara_erythrogenys_-_Red_masked_Parakeet.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Psittacara_erythrogenys_-_Red_masked_Parakeet.wav", credit: "Igor Lazo", license: "CC BY-SA 4.0", gainDb: 18.2 },
  { id: "commons-boar-grwls-1-ogg", label: "Chrochtanie diviaka", emoji: "🐗", category: "Zvieratá", acceptedAnswers: ["diviak", "divá sviňa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Boar.Grwls%281%29.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Boar.Grwls(1).ogg", credit: "GrWolf1129", license: "CC BY-SA 4.0", gainDb: -7.2 },
  { id: "commons-161691-felixblume-dolphin-screaming-underwater-i", label: "Delfíny", emoji: "🐬", category: "Zvieratá", acceptedAnswers: ["delfín", "delfíny pod vodou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/161691_felixblume_dolphin-screaming-underwater-in-caribbean-sea-mexico.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:161691_felixblume_dolphin-screaming-underwater-in-caribbean-sea-mexico.wav", credit: "The user Felix.Blume https://freesound.org/people/felix.blume/", license: "CC0", gainDb: 9.0 },
  { id: "commons-long-finned-pilot-whales-orig-ogg", label: "Veľryby", emoji: "🐋", category: "Zvieratá", acceptedAnswers: ["spev veľrýb", "veľryba"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/10/Long_finned_Pilot_Whales_orig.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Long_finned_Pilot_Whales_orig.ogg", credit: "L. Ginzkey", license: "CC BY-SA 2.5", gainDb: 9.8 },
  { id: "commons-rufe-nachts-im-wald-ogg", label: "Nočný les", emoji: "🌲", category: "Príroda", acceptedAnswers: ["les v noci", "sova v noci"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/46/Rufe_nachts_im_Wald.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Rufe_nachts_im_Wald.ogg", credit: "Rabe19 ( Diskussion )", license: "Copyrighted free use", gainDb: 7.3 },
  { id: "commons-autostarten-und-wegfahren-01-ogg", label: "Štartovanie auta", emoji: "🚗", category: "Doprava", acceptedAnswers: ["nastartovanie auta", "auto odchádza"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/53/Autostarten_und_wegfahren_01.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Autostarten_und_wegfahren_01.ogg", credit: "Huhu Uet", license: "CC BY-SA 3.0", gainDb: -1.6 },
  { id: "commons-wws-volkswagenbeetle8211horn-ogg", label: "Trúbenie auta", emoji: "📣", category: "Doprava", acceptedAnswers: ["klaksón", "trúbenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8c/WWS_VolkswagenBeetle8211horn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_VolkswagenBeetle8211horn.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -5.8 },
  { id: "commons-ambient-sound-city-street-berlin-2026-05-17-oga", label: "Premávka v meste", emoji: "🚦", category: "Mesto", acceptedAnswers: ["doprava v meste", "ulica", "autá"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Ambient_sound_city_street_Berlin_2026-05-17.oga", sourcePage: "https://commons.wikimedia.org/wiki/File:Ambient_sound_city_street_Berlin_2026-05-17.oga", credit: "SchlurcherBot", license: "CC BY-SA 4.0", gainDb: 4.3 },
  { id: "commons-autos-auf-der-bundesautobahn-23-01-ogg", label: "Diaľnica", emoji: "🛣️", category: "Doprava", acceptedAnswers: ["autá na diaľnici", "premávka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Autos_auf_der_Bundesautobahn_23_01.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Autos_auf_der_Bundesautobahn_23_01.ogg", credit: "Huhu Uet", license: "CC BY-SA 3.0", gainDb: 1.9 },
  { id: "commons-255126-ylearkisto-henkiloauto-tulo-asfaltilla-a-", label: "Auto prichádza a zastaví", emoji: "🚙", category: "Doprava", acceptedAnswers: ["príchod auta", "parkovanie auta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/29/255126_ylearkisto_henkiloauto-tulo-asfaltilla-a-car-approaching-stopping-shutting-down-lada-1500-combi-a-1981-model.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:255126_ylearkisto_henkiloauto-tulo-asfaltilla-a-car-approaching-stopping-shutting-down-lada-1500-combi-a-1981-model.wav", credit: "YleArkisto", license: "CC BY 3.0", gainDb: 15.0 },
  { id: "commons-255122-ylearkisto-henkiloauto-lahto-asfaltilla-a", label: "Odchod autom", emoji: "🚙", category: "Doprava", acceptedAnswers: ["nastúpenie do auta", "auto odchádza"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/92/255122_ylearkisto_henkiloauto-lahto-asfaltilla-a-car-pulling-away-on-asphalt-lada-1500-combi-a-1981-model.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:255122_ylearkisto_henkiloauto-lahto-asfaltilla-a-car-pulling-away-on-asphalt-lada-1500-combi-a-1981-model.wav", credit: "YleArkisto", license: "CC BY 3.0", gainDb: 1.3 },
  { id: "commons-ferrari-458-italia-ogg", label: "Športové auto", emoji: "🏎️", category: "Doprava", acceptedAnswers: ["pretekárske auto", "ferrari", "závodné auto"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Ferrari_458_Italia.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Ferrari_458_Italia.ogg", credit: "Edvvc", license: "CC BY-SA 3.0", gainDb: -1.5 },
  { id: "commons-avertisseur-pi-tons-renault-zoe-opus", label: "Elektromobil", emoji: "🔊", category: "Doprava", acceptedAnswers: ["elektrické auto", "elektroauto"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Avertisseur_pi%C3%A9tons_Renault_Zoe.opus", sourcePage: "https://commons.wikimedia.org/wiki/File:Avertisseur_pi%C3%A9tons_Renault_Zoe.opus", credit: "Erwin Lindsen", license: "CC BY 3.0", gainDb: -6.8 },
  { id: "commons-open-corsa-e-model-2014-parking-sensor-sound-oga", label: "Parkovací senzor", emoji: "📡", category: "Doprava", acceptedAnswers: ["parkovanie", "parkovací asistent", "cúvanie auta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Open_Corsa_E_model_2014_parking_sensor_sound.oga", sourcePage: "https://commons.wikimedia.org/wiki/File:Open_Corsa_E_model_2014_parking_sensor_sound.oga", credit: "MKFI", license: "Public domain", gainDb: 8.6 },
];

/** Dávka 1 rozšírenia. */
const EXPANDED_SOUND_CLUES_1: SoundClue[] = [
  { id: "sk2-alarmclock-wind", label: "Naťahovanie budíka", emoji: "🔧", category: "Domácnosť", acceptedAnswers: ["naťahovanie hodín"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/74/WWS_Alarmclockwinding.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Alarmclockwinding.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 13.0 },
  { id: "sk2-brushcutter", label: "Krovinorez", emoji: "🌿", category: "Záhrada", acceptedAnswers: ["kosenie", "strunová kosačka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/WWS_Brushcutter.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Brushcutter.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 7.8 },
  { id: "sk2-chainsaw", label: "Motorová píla", emoji: "🪚", category: "Nástroje", acceptedAnswers: ["píla", "rezanie dreva"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/WWS_Chainsaw.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Chainsaw.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 9.5 },
  { id: "sk2-dentaldrill", label: "Zubárska vŕtačka", emoji: "🦷", category: "Zdravie", acceptedAnswers: ["zubár", "vŕtanie zubov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/WWS_Dentaldrill.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Dentaldrill.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: -6.2 },
  { id: "sk2-firealarm", label: "Požiarny poplach", emoji: "🚨", category: "Bezpečnosť", acceptedAnswers: ["požiarny alarm", "poplach"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3c/WWS_Firealarm.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Firealarm.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: -2.6 },
  { id: "sk2-firealarm-manual", label: "Požiarny zvonec", emoji: "🚨", category: "Bezpečnosť", acceptedAnswers: ["poplašný zvonec", "požiarny alarm"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/38/WWS_Manualfirealarm.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Manualfirealarm.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 1.2 },
  { id: "sk2-lawnmower-old", label: "Kosačka", emoji: "🌱", category: "Záhrada", acceptedAnswers: ["kosenie trávy", "kosačka na trávu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/81/WWS_Lawnmower.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Lawnmower.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 8.6 },
  { id: "sk2-meatslicer", label: "Krájač salámy", emoji: "🔪", category: "Obchod", acceptedAnswers: ["krájanie salámy", "nárezový stroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cb/WWS_Meatslicer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Meatslicer.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: -7.6 },
  { id: "sk2-pencilsharpener-el", label: "Elektrické strúhadlo", emoji: "✏️", category: "Škola a kancelária", acceptedAnswers: ["elektrické strúhatko", "ostrenie ceruzky strojčekom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/WWS_Pencilsharpener.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Pencilsharpener.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 5.8 },
  { id: "sk2-typewriter", label: "Písací stroj", emoji: "⌨️", category: "Škola a kancelária", acceptedAnswers: ["písanie na stroji"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/25/WWS_Typewriter.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Typewriter.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 7.0 },
  { id: "sk2-woodchipper", label: "Drvič konárov", emoji: "🪵", category: "Záhrada", acceptedAnswers: ["štiepkovač"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5b/WWS_Woodchipper.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Woodchipper.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 4.1 },
  { id: "sk2-tattoo", label: "Tetovanie", emoji: "💉", category: "Voľný čas", acceptedAnswers: ["tetovací strojček"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/60/WWS_TattooMachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_TattooMachine.ogg", credit: "Work With Sounds / Sound Culture Linkopings University", license: "CC BY 4.0", gainDb: -0.0 },
  { id: "sk2-creakingfloors", label: "Vŕzgajúca podlaha", emoji: "🏠", category: "Domácnosť", acceptedAnswers: ["vŕzganie podlahy", "parkety"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/WWS_Creakingfloors.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Creakingfloors.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 16.6 },
  { id: "sk2-firetruck-siren", label: "Hasičské auto", emoji: "🚒", category: "Doprava", acceptedAnswers: ["hasiči", "hasičská siréna"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/WWS_Firetruck.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Firetruck.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: -7.7 },
  { id: "sk2-foghorn", label: "Hmlová siréna", emoji: "🚢", category: "Doprava", acceptedAnswers: ["lodná siréna", "maják", "siréna lode"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/WWS_Foghorn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Foghorn.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: -6.0, startAt: 2.4 },
  { id: "sk2-hacksaw", label: "Píla na kov", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["rezanie kovu", "pílenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d2/WWS_Hacksaw.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Hacksaw.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 5.8 },
  { id: "sk2-pneumaticdrill2", label: "Zbíjačka", emoji: "⛏️", category: "Nástroje", acceptedAnswers: ["pneumatické kladivo", "zbíjanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1e/WWS_Pneumaticdrill.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Pneumaticdrill.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 6.4 },
  { id: "sk2-policecar-siren", label: "Policajná siréna", emoji: "🚓", category: "Doprava", acceptedAnswers: ["polícia", "policajné auto"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/76/WWS_Policecarsiren.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Policecarsiren.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -6.4 },
  { id: "sk2-steamiron", label: "Naparovacia žehlička", emoji: "👔", category: "Domácnosť", acceptedAnswers: ["žehlenie", "žehlička"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/WWS_SteamIron.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_SteamIron.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 5.8 },
  { id: "sk2-steamwhistle-loco", label: "Píšťala parnej lokomotívy", emoji: "🚂", category: "Doprava", acceptedAnswers: ["píšťala vlaku", "parný vlak píska"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/WWS_SteamWhistle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_SteamWhistle.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -0.2 },
  { id: "sk2-tablesaw", label: "Kotúčová píla", emoji: "🪚", category: "Nástroje", acceptedAnswers: ["elektrická píla", "píla"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1e/WWS_Tablesaw.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Tablesaw.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: -10.6 },
  { id: "sk2-washboard", label: "Pranie na valche", emoji: "🧺", category: "Domácnosť", acceptedAnswers: ["valcha", "ručné pranie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f8/WWS_Washboard.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Washboard.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 9.9 },
  { id: "sk2-escalator", label: "Eskalátor", emoji: "🛗", category: "Mesto", acceptedAnswers: ["pohyblivé schody"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/53/WWS_Escalator.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Escalator.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 6.1 },
  { id: "sk2-fireworks-wws", label: "Ohňostroj", emoji: "🎆", category: "Voľný čas", acceptedAnswers: ["silvester", "petardy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/86/WWS_Fireworks.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Fireworks.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: -0.3 },
  { id: "sk2-fueldispenser", label: "Tankovanie", emoji: "⛽", category: "Doprava", acceptedAnswers: ["benzínová pumpa", "čerpacia stanica"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ef/WWS_Fueldispenser.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Fueldispenser.ogg", credit: "Work With Sounds / Sound Culture Linkopings University", license: "CC BY 4.0", gainDb: 14.2 },
  { id: "sk2-ticket-vending", label: "Automat na lístky", emoji: "🎫", category: "Doprava", acceptedAnswers: ["kupovanie lístka", "automat v metre"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/WWS_Journeyticketispurchased.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Journeyticketispurchased.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 4.9 },
  { id: "sk2-cardvalidation", label: "Pípnutie karty v MHD", emoji: "🚏", category: "Doprava", acceptedAnswers: ["označenie lístka", "čipová karta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/WWS_MoBIB-ticketvalidation.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_MoBIB-ticketvalidation.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: -0.9 },
  { id: "sk2-quartzclock-ring", label: "Odbíjanie hodín", emoji: "🕰️", category: "Domácnosť", acceptedAnswers: ["nástenné hodiny", "hodiny odbíjajú"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/WWS_Quartzclockringing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Quartzclockringing.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -6.6 },
  { id: "sk2-timeclock", label: "Píchacie hodiny", emoji: "🕰️", category: "Škola a kancelária", acceptedAnswers: ["píchačky", "dochádzka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/de/WWS_Timeclock.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Timeclock.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 7.2 },
  { id: "sk2-angelchimes", label: "Anjelské zvonkohry", emoji: "🎄", category: "Voľný čas", acceptedAnswers: ["vianočná zvonkohra", "zvončeky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ce/WWS_Angelchimes.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Angelchimes.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 16.5, startAt: 1.2 },
  { id: "sk2-bellfoundry-trial", label: "Úder do zvona", emoji: "🔔", category: "Voľný čas", acceptedAnswers: ["zvon"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/WWS_Bellfoundry8211firsttrialofthebell.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Bellfoundry8211firsttrialofthebell.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 8.2 },
  { id: "sk2-dial-phone-old", label: "Vytáčanie na starom telefóne", emoji: "☎️", category: "Technológie", acceptedAnswers: ["otočný číselník", "starý telefón"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f7/WWS_Dial-operatedtelephone.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Dial-operatedtelephone.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 15.0 },
  { id: "sk2-goldsmith-torch", label: "Plynový horák", emoji: "💍", category: "Nástroje", acceptedAnswers: ["spájkovanie", "horák"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/WWS_Goldsmithweldingwithablowtorch.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Goldsmithweldingwithablowtorch.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 6.1 },
  { id: "sk2-handcranksiren", label: "Ručná siréna", emoji: "📯", category: "Bezpečnosť", acceptedAnswers: ["siréna", "kľuková siréna"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8f/WWS_Handcranksiren.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Handcranksiren.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -4.7 },
  { id: "sk2-frenchfries-drain", label: "Vyprážanie hranoliek", emoji: "🍟", category: "Kuchyňa", acceptedAnswers: ["hranolky", "fritéza"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/WWS_Portionofchipsinadrainer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Portionofchipsinadrainer.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 1.1 },
  { id: "sk2-train-arriving", label: "Príchod vlaku", emoji: "🚆", category: "Doprava", acceptedAnswers: ["vlak prichádza", "vlak na stanici"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/WWS_TrainStoppingAtTheTrainStation.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_TrainStoppingAtTheTrainStation.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 19.9 },
  { id: "sk2-traindestination", label: "Preklápacia tabuľa", emoji: "🚆", category: "Doprava", acceptedAnswers: ["odchodová tabuľa", "tabuľa na stanici"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/55/WWS_Traindestinationindicator.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Traindestinationindicator.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 5.5 },
  { id: "sk2-automilking", label: "Dojací stroj", emoji: "🐄", category: "Príroda", acceptedAnswers: ["dojenie", "automatické dojenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/06/WWS_Automaticmilking.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Automaticmilking.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 6.2 },
  { id: "sk2-firedept-bell", label: "Hasičský zvon", emoji: "🔔", category: "Bezpečnosť", acceptedAnswers: ["zvon hasičov", "poplašný zvon"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/WWS_Firedepartmentbell.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Firedepartmentbell.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 2.0 },
  { id: "sk2-handmilking", label: "Ručné dojenie", emoji: "🐄", category: "Príroda", acceptedAnswers: ["dojenie kravy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/WWS_Handmilking.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Handmilking.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 14.7 },
  { id: "sk2-poultry", label: "Hydina na dvore", emoji: "🐔", category: "Zvieratá", acceptedAnswers: ["sliepky", "kačice a husi", "dvor"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/98/WWS_Poultryenclosure.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Poultryenclosure.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 7.9 },
  { id: "sk2-bbq-close", label: "Zatvorenie veka grilu", emoji: "🍖", category: "Voľný čas", acceptedAnswers: ["veko grilu", "gril"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Close_old_bbq_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Close_old_bbq_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -18.1 },
  { id: "sk2-toiletflush2", label: "Splachovanie záchoda", emoji: "🚽", category: "Domácnosť", acceptedAnswers: ["splachovanie", "WC", "toaleta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Toilet_flush_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Toilet_flush_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -4.4 },
  { id: "sk2-watertap", label: "Pustenie vody z kohútika", emoji: "🚰", category: "Domácnosť", acceptedAnswers: ["kohútik", "tečúca voda"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Water_tap_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Water_tap_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -10.4 },
  { id: "sk2-pansclatter", label: "Hrnce a panvice", emoji: "🍳", category: "Kuchyňa", acceptedAnswers: ["rinčanie riadu", "riad"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Pots_and_pans_hits_1_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Pots_and_pans_hits_1_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 0.2 },
  { id: "sk2-cutlery-rustle", label: "Príbory v zásuvke", emoji: "🍴", category: "Kuchyňa", acceptedAnswers: ["príbory", "hľadanie príboru"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Rustling_cutlery_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rustling_cutlery_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -1.6 },
  { id: "sk2-pillbottle", label: "Tabletky v liekovke", emoji: "💊", category: "Zdravie", acceptedAnswers: ["liekovka", "lieky", "tabletky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Pill_bottle_rattle_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Pill_bottle_rattle_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -10.3 },
  { id: "sk2-watermelon-smack", label: "Klopkanie na melón", emoji: "🍉", category: "Kuchyňa", acceptedAnswers: ["melón", "búchanie do melóna"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Watermelon_smack_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Watermelon_smack_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -0.3 },
  { id: "sk2-stairs-squeak", label: "Vŕzgajúce schody", emoji: "🪜", category: "Domácnosť", acceptedAnswers: ["schody", "vŕzganie schodov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Squeaky_stairs_down_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Squeaky_stairs_down_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 6.6 },
  { id: "sk2-walkgravel", label: "Chôdza po štrku", emoji: "🚶", category: "Príroda", acceptedAnswers: ["kroky po štrku", "štrk"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/Walking_on_gravel_%28Gravity_Sound%29.mp3", sourcePage: "https://commons.wikimedia.org/wiki/File:Walking_on_gravel_(Gravity_Sound).mp3", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 6.7 },
  { id: "sk2-drawer-open", label: "Otvorenie zásuvky", emoji: "🗄️", category: "Domácnosť", acceptedAnswers: ["zásuvka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Open_drawer_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Open_drawer_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 11.1 },
  { id: "sk2-chair-drag", label: "Posúvanie stoličky", emoji: "🪑", category: "Domácnosť", acceptedAnswers: ["stolička", "šúchanie stoličky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/78/Drag_chair_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Drag_chair_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -4.1 },
  { id: "sk2-crunchy-eat", label: "Chrumkanie", emoji: "🍪", category: "Kuchyňa", acceptedAnswers: ["jedenie chrumiek", "chipsy", "hryzenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/35/Eating_something_crunchy_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Eating_something_crunchy_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -18.2 },
  { id: "sk2-rainleaves", label: "Dážď v lese", emoji: "🌧️", category: "Príroda", acceptedAnswers: ["dážď", "dážď na listoch"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/92/Rain_on_leaves_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rain_on_leaves_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 8.8 },
  { id: "sk2-sandal-brick", label: "Kroky v šľapkách", emoji: "👡", category: "Každodenné situácie", acceptedAnswers: ["šľapky", "žabky", "sandále"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/77/Sandle_on_brick_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Sandle_on_brick_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 4.3 },
  { id: "sk2-lock-squeaky", label: "Zamykanie dverí", emoji: "🔒", category: "Domácnosť", acceptedAnswers: ["kľúč v zámke", "zamknutie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Lock_squeaky_door_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Lock_squeaky_door_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 11.7 },
  { id: "sk2-stick-metalframe", label: "Palička po zábradlí", emoji: "🔧", category: "Mesto", acceptedAnswers: ["ťahanie paličky po plote"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Stick_on_metal_frame_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Stick_on_metal_frame_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 4.6 },
  { id: "sk2-closet-open", label: "Otvorenie skrine", emoji: "🚪", category: "Domácnosť", acceptedAnswers: ["skriňa", "dvierka skrine"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Swing_open_closet_door_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Swing_open_closet_door_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 1.5 },
  { id: "sk2-closet-slam", label: "Buchnutie dverí skrine", emoji: "🚪", category: "Domácnosť", acceptedAnswers: ["zabuchnutie skrine", "tresnutie dvierok"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Slam_closet_door_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Slam_closet_door_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 3.3 },
  { id: "sk2-ac-hum", label: "Klimatizácia", emoji: "❄️", category: "Technológie", acceptedAnswers: ["klíma", "hučanie klimatizácie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/99/Air_conditioner_hum_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Air_conditioner_hum_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 2.5 },
  { id: "sk2-door-creak", label: "Vŕzganie dvierok umývačky", emoji: "🚪", category: "Domácnosť", acceptedAnswers: ["vŕzganie dverí", "umývačka riadu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Dreadful_jarring_of_dis.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Dreadful_jarring_of_dis.ogg", credit: "stephan", license: "Public domain", gainDb: 4.7 },
  { id: "sk2-spraybottle", label: "Rozprašovač", emoji: "💦", category: "Domácnosť", acceptedAnswers: ["striekanie", "sprej"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Pumpspray_pfft.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Pumpspray_pfft.ogg", credit: "stephan", license: "Public domain", gainDb: 20.0 },
  { id: "sk2-smokealarm", label: "Detektor dymu", emoji: "🚨", category: "Bezpečnosť", acceptedAnswers: ["dymový hlásič", "požiarny hlásič"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Smoke_alarm.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Smoke_alarm.ogg", credit: "cori", license: "Public domain", gainDb: -8.7, startAt: 2.6 },
  { id: "sk2-coffeegrinder", label: "Mlynček na kávu", emoji: "☕", category: "Kuchyňa", acceptedAnswers: ["mletie kávy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/Coffee_grinder.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Coffee_grinder.ogg", credit: "smijen", license: "Public domain", gainDb: 4.3 },
  { id: "sk2-kettlewhistle", label: "Pískajúca kanvica", emoji: "♨️", category: "Kuchyňa", acceptedAnswers: ["kanvica", "píšťalková kanvica", "varenie vody"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/70/Tea_kettle_whistle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Tea_kettle_whistle.ogg", credit: "Luisalvaz", license: "CC BY-SA 4.0", gainDb: 15.0 },
  { id: "sk2-pourtea", label: "Nalievanie vody do hrnčeka", emoji: "☕", category: "Kuchyňa", acceptedAnswers: ["nalievanie", "čaj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/69/Boiling_water_being_poured_into_a_mug_for_tea.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Boiling_water_being_poured_into_a_mug_for_tea.ogg", credit: "cori", license: "Public domain", gainDb: 19.0 },
  { id: "sk2-sinkdrain", label: "Vypúšťanie drezu", emoji: "🚰", category: "Kuchyňa", acceptedAnswers: ["odtok", "voda v odtoku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Kitchen_sink_draining_water.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Kitchen_sink_draining_water.ogg", credit: "stephan", license: "Public domain", gainDb: 10.7 },
  { id: "sk2-eggtimer", label: "Minútka", emoji: "⏱️", category: "Kuchyňa", acceptedAnswers: ["kuchynská minútka", "tikanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/da/Ticking_of_an_egg_timer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Ticking_of_an_egg_timer.ogg", credit: "Jeuwre", license: "CC BY-SA 4.0", gainDb: 5.5 },
  { id: "sk2-bikebell", label: "Zvonček na bicykli", emoji: "🚲", category: "Doprava", acceptedAnswers: ["cyklistický zvonček"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/97/156064_marcolo91_bicycle-bell.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:156064_marcolo91_bicycle-bell.wav", credit: "marcolo91", license: "CC0", gainDb: 8.4 },
  { id: "sk2-motorbike-exhaust", label: "Motorka", emoji: "🏍️", category: "Doprava", acceptedAnswers: ["motocykel", "jawa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Jawa250_motorbike_exhaust_sound.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Jawa250_motorbike_exhaust_sound.ogg", credit: "Віктор Ходєєв /Viktor Khodyeyev", license: "Public domain", gainDb: 1.5 },
  { id: "sk2-airplane-chime", label: "Gong v lietadle", emoji: "✈️", category: "Doprava", acceptedAnswers: ["lietadlo", "signál v lietadle"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Airplane_Chime_Sound_Effect.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Airplane_Chime_Sound_Effect.ogg", credit: "Sharelk", license: "CC0", gainDb: -1.7 },
  { id: "sk2-crossingbell", label: "Železničné priecestie", emoji: "🚦", category: "Doprava", acceptedAnswers: ["zvonec na priecestí", "závory"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Barrierenglocke_gross_Bronze_Ob_00934.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Barrierenglocke_gross_Bronze_Ob_00934.ogg", credit: "Matutinho", license: "CC BY-SA 4.0", gainDb: -1.6 },
  { id: "sk2-cicadas", label: "Cikády", emoji: "🦗", category: "Príroda", acceptedAnswers: ["leto", "hmyz v lete"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Cicada_sound.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Cicada_sound.ogg", credit: "Schwiki", license: "CC BY-SA 4.0", gainDb: 12.5 },
  { id: "sk2-hen-egg", label: "Kotkodákanie sliepky", emoji: "🐔", category: "Zvieratá", acceptedAnswers: ["sliepka", "kvokanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Hen_announcing_shes_lain_an_egg.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Hen_announcing_shes_lain_an_egg.ogg", credit: "alys", license: "Public domain", gainDb: -7.0 },
  { id: "sk2-pedestriancrossing", label: "Semafor pre chodcov", emoji: "🚦", category: "Mesto", acceptedAnswers: ["priechod pre chodcov", "pípanie semaforu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Pedestrian_crossing_audio.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Pedestrian_crossing_audio.wav", credit: "Ian Pegg", license: "CC0", gainDb: 8.2 },
  { id: "sk2-schoolbell", label: "Školský zvonec", emoji: "🔔", category: "Škola a kancelária", acceptedAnswers: ["zvonenie", "koniec hodiny"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Electronic_Tone_School_Bell_Sound.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Electronic_Tone_School_Bell_Sound.wav", credit: "Scott Brody", license: "CC BY-SA 4.0", gainDb: 3.8 },
  { id: "sk2-chalkboard", label: "Písanie kriedou", emoji: "📝", category: "Škola a kancelária", acceptedAnswers: ["krieda", "tabuľa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Chalkboard-writing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Chalkboard-writing.ogg", credit: "Tomproberts", license: "CC0", gainDb: 10.3 },
  { id: "sk2-pageturn", label: "Otočenie strany", emoji: "📖", category: "Škola a kancelária", acceptedAnswers: ["listovanie", "kniha"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Turning_a_page.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Turning_a_page.ogg", credit: "planish", license: "Public domain", gainDb: 13.3 },
  { id: "sk2-camerashutter", label: "Spúšť fotoaparátu", emoji: "📷", category: "Technológie", acceptedAnswers: ["fotoaparát", "cvaknutie foťáku"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/Canon_T50_shutter_noise.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Canon_T50_shutter_noise.ogg", credit: "Francois C", license: "CC BY-SA 3.0", gainDb: 4.3 },
  { id: "sk2-refereewhistle", label: "Píšťalka rozhodcu", emoji: "⚽", category: "Šport", acceptedAnswers: ["rozhodca", "píšťalka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/218318_splicesound_referee-whistle-blow-gymnasium.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:218318_splicesound_referee-whistle-blow-gymnasium.wav", credit: "SpliceSound", license: "CC0", gainDb: -11.1 },
  { id: "sk2-stadiumcrowd", label: "Fanúšikovia na štadióne", emoji: "⚽", category: "Šport", acceptedAnswers: ["futbalový zápas", "štadión", "dav"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/WWS_FootballAustriavs.Sweden.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_FootballAustriavs.Sweden.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 5.8 },
  { id: "sk2-bathsplash", label: "Čľapkanie vo vani", emoji: "🛁", category: "Domácnosť", acceptedAnswers: ["kúpanie", "vaňa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/83/Bathtub_water_splashes.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Bathtub_water_splashes.ogg", credit: "gradha", license: "Public domain", gainDb: 7.5 },
  { id: "sk2-woodsaw-hand", label: "Pílenie dreva", emoji: "🪚", category: "Nástroje", acceptedAnswers: ["ručná píla", "pílka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2d/WWS_Wheelwrightwoodsaw.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Wheelwrightwoodsaw.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 10.4 },
  { id: "sk2-cordlessscrew", label: "Aku skrutkovač", emoji: "🔩", category: "Nástroje", acceptedAnswers: ["skrutkovač", "vŕtačka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Akkuschrauber_%E2%80%93_Cordless_Screwdriver.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Akkuschrauber_%E2%80%93_Cordless_Screwdriver.ogg", credit: "Maximilian Schönherr", license: "CC BY-SA 4.0", gainDb: 4.2 },
  { id: "sk2-cashregister2", label: "Pokladňa", emoji: "🧾", category: "Obchod", acceptedAnswers: ["otvorenie pokladne", "kasa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/70/Cash_register.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Cash_register.ogg", credit: "Me", license: "Public domain", gainDb: -9.7 },
  { id: "sk2-coins-moneybox", label: "Mince do pokladničky", emoji: "🪙", category: "Každodenné situácie", acceptedAnswers: ["pokladnička", "mince"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Coins_dropped_in_metallic_moneybox.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Coins_dropped_in_metallic_moneybox.ogg", credit: "ezwa", license: "Public domain", gainDb: 7.9 },
  { id: "sk2-snaredrum", label: "Údery na bubon", emoji: "🥁", category: "Voľný čas", acceptedAnswers: ["bubon", "bicie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/Snare_drum_rim.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Snare_drum_rim.ogg", credit: "No machine-readable author provided. Clngre~commonswiki assumed…", license: "CC BY-SA 3.0", gainDb: 8.2 },
  { id: "sk2-harmonica", label: "Fúkacia harmonika", emoji: "🎵", category: "Voľný čas", acceptedAnswers: ["harmonika", "ústna harmonika"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Harmonica_02.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Harmonica_02.ogg", credit: "mastermesh", license: "Public domain", gainDb: -0.6 },
  { id: "sk2-electricrazor", label: "Elektrický holiaci strojček", emoji: "🪒", category: "Zdravie", acceptedAnswers: ["holenie", "strojček"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/Elektrorasur-01.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Elektrorasur-01.ogg", credit: "Priwo", license: "Public domain", gainDb: 1.8 },
  { id: "sk2-washingmachine-spin", label: "Odstreďovanie práčky", emoji: "🧺", category: "Domácnosť", acceptedAnswers: ["práčka", "pranie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Washing_machine_last_spin.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Washing_machine_last_spin.ogg", credit: "ezwa", license: "Public domain", gainDb: 15.0 },
  { id: "sk2-mechkeyboard", label: "Písanie na klávesnici", emoji: "⌨️", category: "Technológie", acceptedAnswers: ["klávesnica", "mechanická klávesnica", "písanie na počítači"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/16/IBM_M2_sound.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:IBM_M2_sound.ogg", credit: "Anonimski", license: "CC0", gainDb: 6.1 },
  { id: "sk2-anglegrinder", label: "Rozbrusovačka", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["flexa", "uhlová brúska"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Angle_Grinder_cutting_a_steel_chain_-_Soundbite.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Angle_Grinder_cutting_a_steel_chain_-_Soundbite.ogg", credit: "Pittigrilli", license: "CC BY-SA 4.0", gainDb: -6.7 },
  { id: "sk2-owlhoot", label: "Húkanie sovy", emoji: "🦉", category: "Príroda", acceptedAnswers: ["sova", "puštík"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Strix_aluco_-_Tawny_Owl_XC457393.mp3", sourcePage: "https://commons.wikimedia.org/wiki/File:Strix_aluco_-_Tawny_Owl_XC457393.mp3", credit: "Hannu Varkki", license: "CC BY-SA 4.0", gainDb: 20.7 },
];

/** Dávka 2 rozšírenia. */
const EXPANDED_SOUND_CLUES_2: SoundClue[] = [
  { id: "sk3-aircompressor", label: "Kompresor", emoji: "💨", category: "Nástroje", acceptedAnswers: ["vzduchový kompresor"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/WWS_Aircompressor.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Aircompressor.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: -2.8 },
  { id: "sk3-bonfire-ignite", label: "Zapálenie vatry", emoji: "🔥", category: "Voľný čas", acceptedAnswers: ["podpaľovanie ohňa", "vatra"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9f/WWS_Bonfireignition.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Bonfireignition.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 7.7 },
  { id: "sk3-cookerhood", label: "Digestor", emoji: "🍳", category: "Kuchyňa", acceptedAnswers: ["odsávač pár", "kuchynský odsávač"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/WWS_Cookerhood.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Cookerhood.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: -0.5 },
  { id: "sk3-guillotine-paper", label: "Rezačka papiera", emoji: "📄", category: "Škola a kancelária", acceptedAnswers: ["gilotína na papier"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/WWS_GuillotineKarlKrauseLeipzig.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_GuillotineKarlKrauseLeipzig.ogg", credit: "Work With Sounds / teemu.ahola", license: "CC BY 4.0", gainDb: 16.6 },
  { id: "sk3-handwelding", label: "Zváranie", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["zváračka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cb/WWS_Handweldingmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Handweldingmachine.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 10.7 },
  { id: "sk3-hedgetrimmer2", label: "Nožnice na živý plot", emoji: "✂️", category: "Záhrada", acceptedAnswers: ["strihanie živého plota", "plotostrih"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/WWS_Hedgetrimmer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Hedgetrimmer.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 11.3 },
  { id: "sk3-horseshoes-street", label: "Fiaker", emoji: "🐎", category: "Mesto", acceptedAnswers: ["konský povoz", "kopytá na dlažbe"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/50/WWS_Horseshoesonstonepavedstreet.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Horseshoesonstonepavedstreet.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 15.0 },
  { id: "sk3-icebreaker-bell", label: "Lodný zvon", emoji: "🚢", category: "Doprava", acceptedAnswers: ["zvon na lodi"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3d/WWS_IcebreakerKunashipsbell.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_IcebreakerKunashipsbell.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: -4.6 },
  { id: "sk3-johndeere", label: "Traktor", emoji: "🚜", category: "Doprava", acceptedAnswers: ["traktor na poli"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/WWS_JohnDeereTractor.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_JohnDeereTractor.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 1.8 },
  { id: "sk3-mopedengine", label: "Moped", emoji: "🛵", category: "Doprava", acceptedAnswers: ["malá motorka", "mopedik"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/WWS_MotorcycleTOMOSD7.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_MotorcycleTOMOSD7.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 7.7 },
  { id: "sk3-train-vienna", label: "Jazda vlakom", emoji: "🚆", category: "Doprava", acceptedAnswers: ["vlak", "cestovanie vlakom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/WWS_OnthetraintoVienna.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_OnthetraintoVienna.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 23.0 },
  { id: "sk3-petroltanker", label: "Kamión", emoji: "🚛", category: "Doprava", acceptedAnswers: ["cisterna", "nákladné auto", "nákladiak"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/WWS_PetrolTanker.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_PetrolTanker.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 5.8 },
  { id: "sk3-piledriving", label: "Baranenie pilót", emoji: "🏗️", category: "Mesto", acceptedAnswers: ["stavba", "búchanie na stavbe"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/WWS_PileDrivingRigFirstpile.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_PileDrivingRigFirstpile.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 7.0 },
  { id: "sk3-steamloco-p8", label: "Parná lokomotíva", emoji: "🚂", category: "Doprava", acceptedAnswers: ["parný vlak", "para"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/be/WWS_PrussianpassengersteamlocomotiveP-8.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_PrussianpassengersteamlocomotiveP-8.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 9.9 },
  { id: "sk3-reversevending", label: "Automat na fľaše", emoji: "♻️", category: "Obchod", acceptedAnswers: ["vracanie fliaš", "zálohovanie plechoviek"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d0/WWS_Reversevendingmachinefromthecustomersside.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Reversevendingmachinefromthecustomersside.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 10.5 },
  { id: "sk3-sandblasting", label: "Pieskovanie", emoji: "🚢", category: "Nástroje", acceptedAnswers: ["pieskovačka", "tryskanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/WWS_Sandblastingashiphull.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Sandblastingashiphull.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: -2.4 },
  { id: "sk3-sewingmachine", label: "Šijací stroj", emoji: "🧵", category: "Domácnosť", acceptedAnswers: ["šitie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9f/WWS_SewingMachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_SewingMachine.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: -0.3 },
  { id: "sk3-shoebrush", label: "Kefovanie topánok", emoji: "👞", category: "Domácnosť", acceptedAnswers: ["čistenie topánok", "kefa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ee/WWS_ShoemakerBrushing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_ShoemakerBrushing.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 6.6 },
  { id: "sk3-shoenails", label: "Obuvník zatĺka klince", emoji: "👞", category: "Obchod", acceptedAnswers: ["zatĺkanie klincov", "kladivo"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/WWS_Shoemakerhammeringwoodennails.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Shoemakerhammeringwoodennails.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 3.4 },
  { id: "sk3-shovelcoal", label: "Hádzanie uhlia lopatou", emoji: "🔥", category: "Domácnosť", acceptedAnswers: ["lopata", "uhlie", "kúrenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/WWS_Shovelingcoalintheboiler.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Shovelingcoalintheboiler.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: -1.3 },
  { id: "sk3-signalbell", label: "Signálny zvonec", emoji: "🔔", category: "Bezpečnosť", acceptedAnswers: ["zvonec", "zvonenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/WWS_Signalbell.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Signalbell.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -0.2, startAt: 1.7 },
  { id: "sk3-smithy-forge", label: "Kováč", emoji: "🔨", category: "Nástroje", acceptedAnswers: ["kovanie", "kladivo na nákovu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/50/WWS_Smithysteelforging2.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Smithysteelforging2.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 8.6 },
  { id: "sk3-lathe-turning", label: "Sústruh", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["sústruženie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/WWS_Turningonalathe.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Turningonalathe.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 2.8 },
  { id: "sk3-waterwheel", label: "Mlynské koleso", emoji: "💧", category: "Príroda", acceptedAnswers: ["vodné koleso", "mlyn"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/WWS_Waterwheel.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Waterwheel.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 14.9 },
  { id: "sk3-wetsponge", label: "Umývanie tabule hubkou", emoji: "🧽", category: "Škola a kancelária", acceptedAnswers: ["mokrá hubka", "tabuľa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/WWS_Wetsponge.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Wetsponge.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 7.0 },
  { id: "sk3-wheelwright-plane", label: "Hobľovanie", emoji: "🪵", category: "Nástroje", acceptedAnswers: ["hoblík"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/WWS_Wheelwrightwoodplaning.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Wheelwrightwoodplaning.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 10.5 },
  { id: "sk3-windturbine", label: "Veterná elektráreň", emoji: "💨", category: "Príroda", acceptedAnswers: ["veterná turbína", "veterník"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/WWS_WindTurbine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_WindTurbine.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 6.5 },
  { id: "sk3-woodenbarrel", label: "Kotúľanie suda", emoji: "🛢️", category: "Domácnosť", acceptedAnswers: ["sud"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/WWS_Woodenbarrel.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Woodenbarrel.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 4.6 },
  { id: "sk3-woodenwagon", label: "Drevený vozík", emoji: "🛒", category: "Mesto", acceptedAnswers: ["vozík", "káry"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/WWS_Woodenwagon.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Woodenwagon.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 3.3 },
  { id: "sk3-millstone", label: "Žarnov", emoji: "🌾", category: "Kuchyňa", acceptedAnswers: ["mletie obilia", "mlynský kameň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ef/WWS_Quern-stones.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Quern-stones.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 11.8 },
  { id: "sk3-cinemaseat", label: "Sklápacie sedadlo", emoji: "🎬", category: "Voľný čas", acceptedAnswers: ["sedadlo v kine"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1d/WWS_Cinemaseat.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Cinemaseat.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 6.6 },
  { id: "sk3-gasdetector", label: "Detektor plynu", emoji: "⚠️", category: "Bezpečnosť", acceptedAnswers: ["pípanie detektora"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6c/WWS_Gasdetector.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Gasdetector.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -10.0 },
  { id: "sk3-handgrinder", label: "Ručný mlynček", emoji: "🌰", category: "Kuchyňa", acceptedAnswers: ["mletie orechov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/WWS_Grindingnutswithahandgrinder.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Grindingnutswithahandgrinder.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 5.9 },
  { id: "sk3-recordstore", label: "Prehŕňanie platní", emoji: "🎵", category: "Obchod", acceptedAnswers: ["obchod s platňami", "platne"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/52/WWS_InTheRecordStore.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_InTheRecordStore.ogg", credit: "Work With Sounds / Fredrik Johansson", license: "CC BY 4.0", gainDb: 15.0 },
  { id: "sk3-pokermachine", label: "Výherný automat", emoji: "🎰", category: "Voľný čas", acceptedAnswers: ["automat", "hrací automat"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/af/WWS_PokerMacine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_PokerMacine.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 14.6 },
  { id: "sk3-airvent", label: "Vetranie", emoji: "💨", category: "Domácnosť", acceptedAnswers: ["vzduchotechnika", "ventilácia"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Air_vent_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Air_vent_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 15.0 },
  { id: "sk3-backyard", label: "Záhrada za domom", emoji: "🏡", category: "Príroda", acceptedAnswers: ["dvor", "vtáky na záhrade"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Backyard_ambience_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Backyard_ambience_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 15.0 },
  { id: "sk3-binhits", label: "Búchanie do smetiaka", emoji: "🗑️", category: "Mesto", acceptedAnswers: ["smetiak"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Bin_hits_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Bin_hits_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -4.1 },
  { id: "sk3-bladegrass", label: "Pískanie na tráve", emoji: "🌿", category: "Voľný čas", acceptedAnswers: ["steblo trávy", "pískanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Blade_of_grass_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Blade_of_grass_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -1.9 },
  { id: "sk3-crunchyleaves", label: "Šuchot suchého lístia", emoji: "🍂", category: "Príroda", acceptedAnswers: ["lístie", "šušťanie lístia", "jeseň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Crunchy_leaves_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Crunchy_leaves_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 4.2 },
  { id: "sk3-droppingspoon", label: "Pád lyžice", emoji: "🥄", category: "Kuchyňa", acceptedAnswers: ["spadnutá lyžica", "lyžička"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Dropping_spoon_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Dropping_spoon_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 1.7 },
  { id: "sk3-forestambience", label: "Les", emoji: "🌲", category: "Príroda", acceptedAnswers: ["zvuky lesa", "vtáky v lese"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/be/Forest_ambience_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Forest_ambience_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 14.6 },
  { id: "sk3-walkwoods", label: "Chôdza lesom", emoji: "🌲", category: "Príroda", acceptedAnswers: ["kroky v lese"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Walking_in_woods_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Walking_in_woods_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 4.4 },
  { id: "sk3-poolballs", label: "Biliard", emoji: "🎱", category: "Šport", acceptedAnswers: ["biliardové gule", "kulečník"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Pool_Sounds.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Pool_Sounds.ogg", credit: "Dsw4", license: "Public domain", gainDb: 22.8 },
  { id: "sk3-parrottalk", label: "Hovoriaci papagáj", emoji: "🦜", category: "Zvieratá", acceptedAnswers: ["papagáj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Talking_Parrot_%28Psittacula_krameri%29.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Talking_Parrot_(Psittacula_krameri).ogg", credit: "Amada44", license: "CC BY 3.0", gainDb: -0.7 },
  { id: "sk3-heartmonitor", label: "Monitor srdca", emoji: "🏥", category: "Zdravie", acceptedAnswers: ["nemocnica", "EKG", "pípanie monitora"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Heart_Monitor_Beep--freesound.org.mp3", sourcePage: "https://commons.wikimedia.org/wiki/File:Heart_Monitor_Beep--freesound.org.mp3", credit: "samfk360", license: "CC0", gainDb: 8.6 },
  { id: "sk3-construction", label: "Stavenisko", emoji: "🏗️", category: "Mesto", acceptedAnswers: ["stavba", "vŕtanie na stavbe"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Baustelle_am_M%C3%B6dlingbach.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Baustelle_am_M%C3%B6dlingbach.wav", credit: "TofuVegan", license: "CC BY-SA 4.0", gainDb: -14.2 },
  { id: "sk3-dialtone", label: "Oznamovací tón", emoji: "☎️", category: "Technológie", acceptedAnswers: ["telefón", "tón v slúchadle"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Dial_tone_%28France%29.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Dial_tone_(France).ogg", credit: "Jjackoti", license: "CC BY-SA 3.0", gainDb: -7.5 },
];

/** Dávka 3 rozšírenia. */
const EXPANDED_SOUND_CLUES_3: SoundClue[] = [
  { id: "sk4-bus-door", label: "Dvere autobusu", emoji: "🚌", category: "Doprava", acceptedAnswers: ["autobus", "otváranie dverí autobusu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/52/WWS_CityBusMANSG220dooropeningclosing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_CityBusMANSG220dooropeningclosing.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -2.8 },
  { id: "sk4-bus-horn", label: "Trúbenie autobusu", emoji: "🚌", category: "Doprava", acceptedAnswers: ["klaksón autobusu", "autobus"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/39/WWS_CityBusMANSG220horn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_CityBusMANSG220horn.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -14.4 },
  { id: "sk4-projector-light", label: "Kinoprojektor", emoji: "🎬", category: "Voľný čas", acceptedAnswers: ["premietačka", "kino"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/WWS_Projectorrunningwiththelighton.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Projectorrunningwiththelighton.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 0.8 },
  { id: "sk4-stairwell", label: "Schodisko", emoji: "🏢", category: "Mesto", acceptedAnswers: ["kroky na schodoch", "ozvena"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/WWS_Stairwell.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Stairwell.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 9.8 },
  { id: "sk4-steamwhistle2", label: "Píšťala parníka", emoji: "🚂", category: "Doprava", acceptedAnswers: ["parník", "loď"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/WWS_Steamwhistle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Steamwhistle.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -0.7 },
  { id: "sk4-tiredeflate", label: "Vypúšťanie pneumatiky", emoji: "🚗", category: "Doprava", acceptedAnswers: ["syčanie vzduchu", "pneumatika"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/WWS_Thetyreisdeflated.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Thetyreisdeflated.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: -3.7 },
  { id: "sk4-teslaphone", label: "Zvonenie starého telefónu", emoji: "☎️", category: "Technológie", acceptedAnswers: ["starý telefón", "telefón"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/WWS_8220NikolaTesla8221telephone8211ringing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_8220NikolaTesla8221telephone8211ringing.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -4.2, startAt: 1.6 },
  { id: "sk4-forgeblower", label: "Kováčsky mech", emoji: "🔥", category: "Nástroje", acceptedAnswers: ["mech", "vyhňa", "dúchadlo"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/WWS_Bloweroftheforge.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Bloweroftheforge.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 5.5 },
  { id: "sk4-forgewater", label: "Voda na rozžeravenom uhlí", emoji: "💧", category: "Nástroje", acceptedAnswers: ["syčanie", "vyhňa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/76/WWS_Waterpouredonthefireforge.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Waterpouredonthefireforge.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 3.9 },
  { id: "sk4-clockaccuracy", label: "Tikanie hodiniek", emoji: "🕰️", category: "Domácnosť", acceptedAnswers: ["tikanie", "hodinky", "tikajúce hodiny"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/WWS_Checkingaclocksaccuracy.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Checkingaclocksaccuracy.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 7.0 },
  { id: "sk4-railtrolley", label: "Ručná drezina", emoji: "🚧", category: "Doprava", acceptedAnswers: ["drezina"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8b/WWS_Handleverrailtrolley.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Handleverrailtrolley.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 4.3 },
  { id: "sk4-handmixer", label: "Mixér", emoji: "🥣", category: "Kuchyňa", acceptedAnswers: ["ručný mixér", "šľahanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d6/WWS_HandmixerbyGorenjeMGA8211running.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_HandmixerbyGorenjeMGA8211running.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 4.0 },
  { id: "sk4-towerclock", label: "Vežové hodiny", emoji: "🔔", category: "Mesto", acceptedAnswers: ["hodiny na veži", "odbíjanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6c/WWS_TowerclockfromtheHolyTrinityChurchinGdask.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_TowerclockfromtheHolyTrinityChurchinGdask.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 16.5 },
  { id: "sk4-droppingrocks", label: "Sypanie kamienkov", emoji: "🪨", category: "Príroda", acceptedAnswers: ["kamienky", "štrk"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Dropping_rocks_on_ground_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Dropping_rocks_on_ground_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -1.8 },
  { id: "sk4-fishtank", label: "Akváriový filter", emoji: "🐠", category: "Zvieratá", acceptedAnswers: ["akvárium", "bublinky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/15/Filtro_interno_de_pecera.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Filtro_interno_de_pecera.ogg", credit: "Hippocampuz", license: "CC BY-SA 4.0", gainDb: 15.0 },
  { id: "sk4-rabbit", label: "Králik", emoji: "🐰", category: "Zvieratá", acceptedAnswers: ["kvičanie králika"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/49/Rabbit_oinks_and_squeaks.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rabbit_oinks_and_squeaks.wav", credit: "kessir", license: "CC0", gainDb: 13.0, startAt: 0.9 },
  { id: "sk4-cricket", label: "Cvrček", emoji: "🦗", category: "Príroda", acceptedAnswers: ["cvrlikanie cvrčka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Acheta-domesticus-Stridulation.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Acheta-domesticus-Stridulation.ogg", credit: "de:Benutzer:Morray", license: "CC BY 3.0", gainDb: -6.0 },
  { id: "sk4-dotmatrix", label: "Ihličková tlačiareň", emoji: "🖨️", category: "Technológie", acceptedAnswers: ["tlačiareň", "stará tlačiareň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/Star-LC-10-printer-01.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Star-LC-10-printer-01.ogg", credit: "Priwo", license: "Public domain", gainDb: -6.1 },
  { id: "sk4-dialup", label: "Vytáčané pripojenie", emoji: "💻", category: "Technológie", acceptedAnswers: ["modem", "internet cez modem"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/85/Dial_up_connection_%28short%29.oga", sourcePage: "https://commons.wikimedia.org/wiki/File:Dial_up_connection_(short).oga", credit: "PDSounds: http://www.pdsounds.org/sounds/dial_up_connection", license: "CC0", gainDb: -6.3 },
];

/** Dávka 4 rozšírenia. */
const EXPANDED_SOUND_CLUES_4: SoundClue[] = [
  { id: "sk5-elephant", label: "Trúbenie slona", emoji: "🐘", category: "Zvieratá", acceptedAnswers: ["slon"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Elephant_voice_-_trumpeting.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Elephant_voice_-_trumpeting.ogg", credit: "தகவலுழவன்", license: "CC0", gainDb: 4.1 },
  { id: "sk5-beargrowl", label: "Medveď", emoji: "🐻", category: "Zvieratá", acceptedAnswers: ["vrčanie medveďa", "mláďa medveďa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Bear_growl.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Bear_growl.ogg", credit: "Shizhao", license: "CC BY 3.0", gainDb: 3.1 },
  { id: "sk5-crow", label: "Krákanie vrany", emoji: "🐦‍⬛", category: "Príroda", acceptedAnswers: ["vrana", "havran"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Corvus_corone_-_Carrion_Crow_XC491193.mp3", sourcePage: "https://commons.wikimedia.org/wiki/File:Corvus_corone_-_Carrion_Crow_XC491193.mp3", credit: "Marie-Lan Taÿ Pamart", license: "CC BY-SA 4.0", gainDb: 7.8 },
  { id: "sk5-sparrows", label: "Vrabce", emoji: "🐦", category: "Príroda", acceptedAnswers: ["čvirikanie vrabcov", "štebot"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/House_Sparrows_chirping.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:House_Sparrows_chirping.ogg", credit: "QWerk", license: "CC BY-SA 3.0", gainDb: 3.1 },
  { id: "sk5-woodpecker", label: "Ďateľ", emoji: "🐦", category: "Príroda", acceptedAnswers: ["ďubanie ďatľa", "ďateľ do stromu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/54/Black_woodpecker_Dryocopus_martius_female_drumming.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Black_woodpecker_Dryocopus_martius_female_drumming.ogg", credit: "SanoAK: Alexander Kürthy", license: "CC BY-SA 4.0", gainDb: 5.3 },
  { id: "sk5-turkey", label: "Moriak", emoji: "🦃", category: "Zvieratá", acceptedAnswers: ["hudrovanie moriaka", "morka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/35/Meleagris_gallopavo_-_Wild_Turkey_XC134155.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Meleagris_gallopavo_-_Wild_Turkey_XC134155.ogg", credit: "Jonathon Jongsma", license: "CC BY-SA 3.0", gainDb: 1.1 },
  { id: "sk5-peacock", label: "Páv", emoji: "🦚", category: "Zvieratá", acceptedAnswers: ["krik páva"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Pavo_cristatus_%28call%29.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Pavo_cristatus_(call).ogg", credit: "Ke4roh", license: "Public domain", gainDb: -1.2 },
  { id: "sk5-stream", label: "Potok", emoji: "🏞️", category: "Príroda", acceptedAnswers: ["žblnkot potoka", "potôčik"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/21/Shallow_small_river_with_stony_riverbed.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Shallow_small_river_with_stony_riverbed.ogg", credit: "stephan", license: "Public domain", gainDb: 7.5 },
  { id: "sk5-cymbal", label: "Činel", emoji: "🥁", category: "Voľný čas", acceptedAnswers: ["údery na činel", "bicie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/CrashCymbalSample.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:CrashCymbalSample.ogg", credit: "RyGuy 8======D", license: "Public domain", gainDb: 1.7 },
  { id: "sk5-pipeorgan", label: "Organ v kostole", emoji: "🎹", category: "Voľný čas", acceptedAnswers: ["organ", "kostolná hudba"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Hartford_City_Presbyterian_Pipe_Organ.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Hartford_City_Presbyterian_Pipe_Organ.ogg", credit: "TwoScarsUp", license: "Public domain", gainDb: -3.2 },
  { id: "sk5-bagpipes", label: "Gajdy", emoji: "🎶", category: "Voľný čas", acceptedAnswers: ["dudy", "škótske gajdy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Elektronische_Great_Highland_Bagpipe.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Elektronische_Great_Highland_Bagpipe.ogg", credit: "Tomanic", license: "Public domain", gainDb: -5.3 },
  { id: "sk5-loom", label: "Tkáčsky stav", emoji: "🧵", category: "Domácnosť", acceptedAnswers: ["tkanie", "krosná"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/WWS_Loom.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Loom.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 4.7 },
  { id: "sk5-narrowgauge", label: "Úzkokoľajka", emoji: "🚂", category: "Doprava", acceptedAnswers: ["úzkokoľajná železnica", "malý vláčik"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/WWS_Narrow-gaugefieldlocomotive.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Narrow-gaugefieldlocomotive.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 9.6 },
  { id: "sk5-monorail", label: "Visutá dráha", emoji: "🚝", category: "Doprava", acceptedAnswers: ["visutá železnica", "jednokoľajka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/22/WWS_OverheadmonorailWuppertalSuspensionRailway.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_OverheadmonorailWuppertalSuspensionRailway.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 1.4 },
  { id: "sk5-rotaryprint", label: "Tlačiarenský stroj", emoji: "🖨️", category: "Škola a kancelária", acceptedAnswers: ["tlačiareň", "tlač novín"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/70/WWS_Rotaryprintingpress.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Rotaryprintingpress.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 8.9 },
  { id: "sk5-teleprinter-auto", label: "Ďalekopis", emoji: "📠", category: "Technológie", acceptedAnswers: ["telex"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/WWS_Teleprinterautomaticprinting.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Teleprinterautomaticprinting.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 5.1 },
  { id: "sk5-accountingmachine", label: "Mechanická kalkulačka", emoji: "🧮", category: "Škola a kancelária", acceptedAnswers: ["počítací stroj", "účtovací stroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/73/WWS_Burroughsaccountingmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Burroughsaccountingmachine.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 3.5 },
  { id: "sk5-tram-interior", label: "Jazda električkou", emoji: "🚊", category: "Doprava", acceptedAnswers: ["električka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/WWS_SN2tram8211carinterior.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_SN2tram8211carinterior.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 8.5 },
  { id: "sk5-tramdoors", label: "Dvere električky", emoji: "🚊", category: "Doprava", acceptedAnswers: ["električka", "zatváranie dverí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/WWS_102Ntramdoors.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_102Ntramdoors.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 11.4 },
  { id: "sk5-vandriving", label: "Prejazd dodávky", emoji: "🚐", category: "Doprava", acceptedAnswers: ["dodávka", "auto ide okolo"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a8/WWS_FSRTarpan239Dvandriving.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_FSRTarpan239Dvandriving.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 14.2 },
  { id: "sk5-whettingtrestle", label: "Brúska na nože", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["brúsenie", "brúska"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d4/WWS_Whettingtrestle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Whettingtrestle.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 5.5 },
];

/** Dávka 5 rozšírenia. */
const EXPANDED_SOUND_CLUES_5: SoundClue[] = [
  { id: "sk6-alligator-bellow", label: "Rev aligátora", emoji: "🐊", category: "Zvieratá", acceptedAnswers: ["aligátor", "krokodíl"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Alligatorbellow1.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Alligatorbellow1.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain", gainDb: 8.5 },
  { id: "sk6-ducks-landing", label: "Kačice pristávajú na vode", emoji: "🦆", category: "Príroda", acceptedAnswers: ["kačice", "čľapot kačíc"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Ducks_landing_in_water.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Ducks_landing_in_water.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain", gainDb: 13.6 },
  { id: "sk6-elk-bellow", label: "Ručanie jeleňa", emoji: "🦌", category: "Zvieratá", acceptedAnswers: ["jeleň", "ruja"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Elkbellow.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Elkbellow.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain", gainDb: 9.9 },
  { id: "sk6-geese-honking", label: "Gagotanie husí", emoji: "🦢", category: "Zvieratá", acceptedAnswers: ["husi", "hus"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Geese_Honking_%28loud%29.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Geese_Honking_(loud).ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain", gainDb: 7.5 },
  { id: "sk6-rattlesnake", label: "Štrkáč", emoji: "🐍", category: "Zvieratá", acceptedAnswers: ["chrastenie štrkáča", "had"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/22/Rattlesnake.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Rattlesnake.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain", gainDb: 0.6 },
  { id: "sk6-wolfhowls", label: "Vytie vlkov", emoji: "🐺", category: "Príroda", acceptedAnswers: ["vlk", "vlky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Wolf_howls.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Wolf_howls.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain", gainDb: 7.1 },
  { id: "sk6-loons", label: "Potáplice", emoji: "🦆", category: "Príroda", acceptedAnswers: ["volanie potáplice", "jazero v noci"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/13/Loons.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Loons.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain", gainDb: 0.7 },
  { id: "sk6-cuckoo", label: "Kukučka", emoji: "🐦", category: "Príroda", acceptedAnswers: ["kukanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Common_Cuckoo_%28Cuculus_canorus%29_%28W1CDR0001463_BD1%29.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Common_Cuckoo_(Cuculus_canorus)_(W1CDR0001463_BD1).ogg", credit: "British Library Sound Archive / National Sound Archive Wildlife…", license: "CC BY-SA 4.0", gainDb: 2.6 },
  { id: "sk6-nightingale", label: "Slávik", emoji: "🐦", category: "Príroda", acceptedAnswers: ["spev slávika"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/Common_Nightingale_%28Luscinia_megarhynchos%29_%28W1CDR0001376_BD18%29.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Common_Nightingale_(Luscinia_megarhynchos)_(W1CDR0001376_BD18).ogg", credit: "British Library Sound Archive / National Sound Archive Wildlife…", license: "CC BY-SA 4.0", gainDb: -2.4 },
  { id: "sk6-bumpercars", label: "Autodróm", emoji: "🎡", category: "Voľný čas", acceptedAnswers: ["nárazové autíčka", "lunapark"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Autodrom_im_Prater_25s.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Autodrom_im_Prater_25s.ogg", credit: "Isiwal", license: "CC BY-SA 4.0", gainDb: 1.4 },
  { id: "sk6-brassband", label: "Dychovka", emoji: "🎺", category: "Voľný čas", acceptedAnswers: ["dychová hudba", "pochod", "sprievod"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ce/March_brass_band_playing_parading_by.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:March_brass_band_playing_parading_by.ogg", credit: "stephan", license: "Public domain", gainDb: 3.0 },
  { id: "sk6-rubberduck", label: "Gumená kačička", emoji: "🦆", category: "Každodenné situácie", acceptedAnswers: ["pískacia kačička", "hračka do vane"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Rubber_Duck_Squeaker.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Rubber_Duck_Squeaker.ogg", credit: "Dragonhawk12", license: "CC BY-SA 4.0", gainDb: -5.5 },
  { id: "sk6-musicbox", label: "Naťahovanie hracej skrinky", emoji: "🎵", category: "Voľný čas", acceptedAnswers: ["naťahovanie", "kľúčik hracej skrinky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Winding_a_music_box.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Winding_a_music_box.ogg", credit: "ezwa", license: "Public domain", gainDb: 16.8 },
];

/** Dávka 6 rozšírenia. */
const EXPANDED_SOUND_CLUES_6: SoundClue[] = [
  { id: "sk7-espresso", label: "Espresso", emoji: "☕", category: "Kuchyňa", acceptedAnswers: ["kávovar", "príprava kávy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Espresso_machine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Espresso_machine.ogg", credit: "hugh", license: "Public domain", gainDb: 13.1, startAt: 1.1 },
  { id: "sk7-elevatordoor", label: "Dvere výťahu", emoji: "🛗", category: "Mesto", acceptedAnswers: ["zatváranie výťahu", "dvere sa zatvárajú"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Elevator_door_closing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Elevator_door_closing.ogg", credit: "stephan", license: "Public domain", gainDb: 8.4 },
  { id: "sk7-garagedoor-close", label: "Zatváranie garážovej brány", emoji: "🚪", category: "Domácnosť", acceptedAnswers: ["garáž", "garážová brána"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Garage_door_closing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Garage_door_closing.ogg", credit: "ezwa", license: "Public domain", gainDb: -1.7 },
  { id: "sk7-freezerbox", label: "Mraznička", emoji: "🧊", category: "Domácnosť", acceptedAnswers: ["otvorenie mrazničky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/86/Freezer_box_opening_closing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Freezer_box_opening_closing.ogg", credit: "stephan", license: "Public domain", gainDb: 8.7 },
  { id: "sk7-toyphone", label: "Detský telefón", emoji: "📞", category: "Každodenné situácie", acceptedAnswers: ["hračkársky telefón"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Toy_phone_speed_dial.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Toy_phone_speed_dial.ogg", credit: "stephan", license: "Public domain", gainDb: 3.7 },
  { id: "sk7-cartraindoors", label: "Dvere vlaku", emoji: "🚆", category: "Doprava", acceptedAnswers: ["zatváranie dverí vlaku", "vlak"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/76/Train_doors_closing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Train_doors_closing.ogg", credit: "ezwa", license: "Public domain", gainDb: -1.3 },
  { id: "sk7-carunlock", label: "Odomknutie auta", emoji: "🚗", category: "Doprava", acceptedAnswers: ["diaľkové ovládanie auta", "centrálne zamykanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Unlocking_a_car.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Unlocking_a_car.ogg", credit: "hc", license: "Public domain", gainDb: 15.0 },
  { id: "sk7-windchime", label: "Zvonkohra vo vetre", emoji: "🎐", category: "Domácnosť", acceptedAnswers: ["zvonkohra", "zvončeky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/28/Windchime.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Windchime.ogg", credit: "stephan", license: "Public domain", gainDb: -3.9 },
  { id: "sk7-toyrattle", label: "Hrkálka", emoji: "🧸", category: "Každodenné situácie", acceptedAnswers: ["detská hrkálka", "hračka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Rolling_toy_rattle_on_floor.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Rolling_toy_rattle_on_floor.ogg", credit: "stephan", license: "Public domain", gainDb: 5.1 },
  { id: "sk7-peppergrinder", label: "Mlynček na korenie", emoji: "🧂", category: "Kuchyňa", acceptedAnswers: ["mletie korenia", "korenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Pepper_grinder.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Pepper_grinder.ogg", credit: "hugh", license: "Public domain", gainDb: 13.6 },
  { id: "sk7-metalcabinet", label: "Plechová skrinka", emoji: "🗄️", category: "Domácnosť", acceptedAnswers: ["kovové dvierka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Metal_cabinet_door_jarring.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Metal_cabinet_door_jarring.ogg", credit: "stephan", license: "Public domain", gainDb: 12.9 },
  { id: "sk7-fountain", label: "Fontána", emoji: "⛲", category: "Mesto", acceptedAnswers: ["vodotrysk", "fontána na námestí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Fountain_in_toulouse.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Fountain_in_toulouse.ogg", credit: "aldor", license: "Public domain", gainDb: 8.7 },
  { id: "sk7-flappingwindow", label: "Buchnutie okna", emoji: "🪟", category: "Domácnosť", acceptedAnswers: ["okno", "zatvorenie okna"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/32/Flapping_window_closing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Flapping_window_closing.ogg", credit: "ezwa", license: "Public domain", gainDb: 14.8 },
  { id: "sk7-toymelody", label: "Hudobná hračka", emoji: "🧸", category: "Každodenné situácie", acceptedAnswers: ["hračka", "Old MacDonald"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Cheesy_toy_melody_old_mc_donald.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Cheesy_toy_melody_old_mc_donald.ogg", credit: "stephan", license: "Public domain", gainDb: -6.0 },
  { id: "sk7-airduster", label: "Stlačený vzduch", emoji: "💨", category: "Technológie", acceptedAnswers: ["sprej", "vyfukovanie prachu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/02/Can_of_compressed_air.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Can_of_compressed_air.ogg", credit: "stilgar", license: "Public domain", gainDb: -3.3 },
  { id: "sk7-coinbag", label: "Mešec mincí", emoji: "💰", category: "Každodenné situácie", acceptedAnswers: ["mince", "štrngot mincí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Bag_of_coins.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Bag_of_coins.ogg", credit: "cori", license: "Public domain", gainDb: 2.2 },
  { id: "sk7-boatwharf", label: "Loď pristáva", emoji: "🚢", category: "Doprava", acceptedAnswers: ["pristátie lode", "prístav"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Boat_landing_at_a_wharf.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Boat_landing_at_a_wharf.ogg", credit: "ezwa", license: "Public domain", gainDb: 9.2 },
  { id: "sk7-gasheater", label: "Plynový kotol", emoji: "🔥", category: "Domácnosť", acceptedAnswers: ["kotol", "karma"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/78/Boiler_gas_heater.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Boiler_gas_heater.ogg", credit: "stephan", license: "Public domain", gainDb: 6.8 },
  { id: "sk7-budgie", label: "Andulka", emoji: "🦜", category: "Zvieratá", acceptedAnswers: ["papagáj", "čvirikanie andulky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/83/Budgerigar_chirping.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Budgerigar_chirping.ogg", credit: "mary905", license: "Public domain", gainDb: 6.6 },
  { id: "sk7-breakspaghetti", label: "Lámanie špagiet", emoji: "🍝", category: "Kuchyňa", acceptedAnswers: ["špagety", "cestoviny"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/85/Breaking_spaghetti.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Breaking_spaghetti.ogg", credit: "stilgar", license: "Public domain", gainDb: 4.3 },
  { id: "sk7-brushteeth", label: "Umývanie zubov", emoji: "🪥", category: "Zdravie", acceptedAnswers: ["čistenie zubov", "zubná kefka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/34/Brushing_ones_teeth.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Brushing_ones_teeth.ogg", credit: "ezwa", license: "Public domain", gainDb: 20.4 },
  { id: "sk7-swivelchair", label: "Vŕzgajúca stolička", emoji: "🪑", category: "Škola a kancelária", acceptedAnswers: ["otočná stolička", "kancelárska stolička"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Creaky_wooden_swivel_chair.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Creaky_wooden_swivel_chair.ogg", credit: "chocoholic", license: "Public domain", gainDb: 15.2 },
  { id: "sk7-elevatorride", label: "Výťah", emoji: "🛗", category: "Mesto", acceptedAnswers: ["jazda výťahom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Elevator_ride.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Elevator_ride.ogg", credit: "stephan", license: "Public domain", gainDb: 5.5 },
  { id: "sk7-hydrauliclift-down", label: "Hydraulický zdvihák", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["zdvihák", "hydraulika"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/13/Hydraulic_lift_down.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Hydraulic_lift_down.ogg", credit: "stephan", license: "Public domain", gainDb: -2.1 },
  { id: "sk7-inkjetprinter", label: "Atramentová tlačiareň", emoji: "🖨️", category: "Technológie", acceptedAnswers: ["tlačiareň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Inkjet_printer_on_and_off.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Inkjet_printer_on_and_off.ogg", credit: "stephan", license: "Public domain", gainDb: 6.1 },
  { id: "sk7-potandlid", label: "Bubnovanie na hrnce", emoji: "🍲", category: "Kuchyňa", acceptedAnswers: ["hrnce", "pokrievka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Metal_pot_and_lid_percu.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Metal_pot_and_lid_percu.ogg", credit: "stilgar", license: "Public domain", gainDb: 5.0 },
  { id: "sk7-musicbox2", label: "Hracia skrinka", emoji: "🎵", category: "Voľný čas", acceptedAnswers: ["hracia skrinka hrá"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Musical_box_la_boheme.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Musical_box_la_boheme.ogg", credit: "stephan", license: "Public domain", gainDb: 1.3 },
  { id: "sk7-pourwine", label: "Nalievanie vína", emoji: "🍷", category: "Voľný čas", acceptedAnswers: ["víno", "nalievanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Pouring_wine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Pouring_wine.ogg", credit: "cori", license: "Public domain", gainDb: 15.0 },
  { id: "sk7-rustyclasp", label: "Hrdzavá závora na dverách", emoji: "🔒", category: "Domácnosť", acceptedAnswers: ["západka", "zástrčka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/Rusty_metal_door_clasp.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Rusty_metal_door_clasp.ogg", credit: "stephan", license: "Public domain", gainDb: 2.2 },
  { id: "sk7-scrubbrush", label: "Drôtená kefa", emoji: "🧽", category: "Domácnosť", acceptedAnswers: ["kefovanie", "drhnutie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Scrubbing_with_small_metal_bristled_brush.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Scrubbing_with_small_metal_bristled_brush.ogg", credit: "stephan", license: "Public domain", gainDb: 15.3 },
  { id: "sk7-verandadoor", label: "Posuvné dvere", emoji: "🚪", category: "Domácnosť", acceptedAnswers: ["otvorenie posuvných dverí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Sliding_door_of_veranda_opening.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Sliding_door_of_veranda_opening.ogg", credit: "ezwa", license: "Public domain", gainDb: 24.0 },
  { id: "sk7-airplanesound", label: "Let lietadlom", emoji: "✈️", category: "Doprava", acceptedAnswers: ["lietadlo", "kabína lietadla"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Sound_in_air_plane_1.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Sound_in_air_plane_1.ogg", credit: "ezwa", license: "Public domain", gainDb: 13.4 },
  { id: "sk7-blownbottle", label: "Fúkanie do fľaše", emoji: "🍾", category: "Voľný čas", acceptedAnswers: ["fľaša", "pískanie na fľašu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Sounds_of_blown_bottle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Sounds_of_blown_bottle.ogg", credit: "mary905", license: "Public domain", gainDb: -6.6 },
  { id: "sk7-cellardoor", label: "Dvere do pivnice", emoji: "🚪", category: "Domácnosť", acceptedAnswers: ["pivnica", "staré dvere"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Springlocked_cellar_door.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Springlocked_cellar_door.ogg", credit: "stephan", license: "Public domain", gainDb: 6.7 },
  { id: "sk7-steamengine2", label: "Parný stroj", emoji: "🚂", category: "Nástroje", acceptedAnswers: ["para", "parný motor"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Steam_engine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Steam_engine.ogg", credit: "aradlaw", license: "Public domain", gainDb: -1.4 },
  { id: "sk7-stickytape", label: "Lepiaca páska", emoji: "📦", category: "Škola a kancelária", acceptedAnswers: ["izolepa", "lepenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Sticky_tape.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Sticky_tape.ogg", credit: "stephan", license: "Public domain", gainDb: 3.4 },
  { id: "sk7-streetviolin", label: "Pouličný huslista", emoji: "🎻", category: "Mesto", acceptedAnswers: ["husle", "hranie na husle"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/94/Street_musician_violin.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Street_musician_violin.ogg", credit: "natalie", license: "Public domain", gainDb: 6.3 },
  { id: "sk7-cafeteria", label: "Školská jedáleň", emoji: "🍽️", category: "Škola a kancelária", acceptedAnswers: ["jedáleň", "menza"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/df/High_school_cafeteria.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:High_school_cafeteria.ogg", credit: "aradlaw", license: "Public domain", gainDb: -6.4 },
  { id: "sk7-vendingdrink", label: "Automat na nápoje", emoji: "🥤", category: "Obchod", acceptedAnswers: ["automat", "nápojový automat"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Le_distributeur_de_bois.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Le_distributeur_de_bois.ogg", credit: "aldor", license: "Public domain", gainDb: -0.2 },
  { id: "sk7-pingpong", label: "Stolný tenis", emoji: "🏓", category: "Šport", acceptedAnswers: ["pingpong"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/72/Ping_pong.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Ping_pong.ogg", credit: "aldor", license: "Public domain", gainDb: 3.4 },
  { id: "sk7-restaurant", label: "Reštaurácia", emoji: "🍽️", category: "Voľný čas", acceptedAnswers: ["ruch v reštaurácii", "kaviareň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Restaurant_ambience.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Restaurant_ambience.ogg", credit: "stephan", license: "Public domain", gainDb: 3.7 },
  { id: "sk7-toysiren", label: "Hračkárska siréna", emoji: "🚨", category: "Každodenné situácie", acceptedAnswers: ["hračka", "siréna"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Toy_siren_alarm.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Toy_siren_alarm.ogg", credit: "stephan", license: "Public domain", gainDb: 3.5 },
  { id: "sk7-washhands", label: "Umývanie rúk", emoji: "🧼", category: "Zdravie", acceptedAnswers: ["umývadlo", "mydlo"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Washing_hands_in_sink.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Washing_hands_in_sink.ogg", credit: "jim_mowatt", license: "Public domain", gainDb: 12.6 },
  { id: "sk7-vaporizestones", label: "Polievanie kameňov v saune", emoji: "♨️", category: "Voľný čas", acceptedAnswers: ["sauna", "para"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Water_vaporizing_on_hot_stones.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Water_vaporizing_on_hot_stones.ogg", credit: "natalie", license: "Public domain", gainDb: -0.8 },
  { id: "sk7-toypedal", label: "Naťahovacia hračka", emoji: "🧸", category: "Každodenné situácie", acceptedAnswers: ["hračka na kľúčik"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Wound_up_toy_pedalling.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Wound_up_toy_pedalling.ogg", credit: "stephan", license: "Public domain", gainDb: 8.0 },
  { id: "sk7-feltpen", label: "Písanie fixkou", emoji: "🖊️", category: "Škola a kancelária", acceptedAnswers: ["fixka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Writing_with_feltpen.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Writing_with_feltpen.ogg", credit: "stephan", license: "Public domain", gainDb: 15.0 },
  { id: "sk7-fleamarket", label: "Trh v daždi", emoji: "🌧️", category: "Mesto", acceptedAnswers: ["trh", "bleší trh", "dážď"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/10/Flea_market_in_the_rain.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Flea_market_in_the_rain.ogg", credit: "stephan", license: "Public domain", gainDb: 8.9 },
];

/** Dávka 7 rozšírenia. */
const EXPANDED_SOUND_CLUES_7: SoundClue[] = [
  { id: "sk8-ratchet", label: "Račňa", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["račňový kľúč", "uťahovanie skrutky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/da/Tools_Ratchet.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Tools_Ratchet.ogg", credit: "CapsLok", license: "CC0", gainDb: 7.2 },
  { id: "sk8-spaceheater", label: "Elektrický ohrievač", emoji: "🔥", category: "Domácnosť", acceptedAnswers: ["ohrievač", "radiátor"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Space_heater_sound_-_bjornredtail.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Space_heater_sound_-_bjornredtail.ogg", credit: "bjornredtail", license: "CC BY 3.0", gainDb: 10.0 },
  { id: "sk8-smallloco", label: "Posunovacia lokomotíva", emoji: "🚂", category: "Doprava", acceptedAnswers: ["lokomotíva", "dieselová lokomotíva"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6a/WWS_Kleinlokomotive8211motor.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Kleinlokomotive8211motor.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 3.1 },
  { id: "sk8-harvester", label: "Harvestor", emoji: "🌲", category: "Príroda", acceptedAnswers: ["ťažba dreva", "lesný stroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/WWS_Komatsu941Harvester.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Komatsu941Harvester.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 0.6 },
  { id: "sk8-rustondiesel", label: "Starý dieselový motor", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["motor", "diesel"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/WWS_Rustondieselengine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Rustondieselengine.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 3.6, startAt: 3.5 },
  { id: "sk8-shipordertelegraph", label: "Lodný telegraf", emoji: "🚢", category: "Doprava", acceptedAnswers: ["strojovňa", "telegraf"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ad/WWS_ShipSodekengineordertelegraph.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_ShipSodekengineordertelegraph.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 2.6 },
  { id: "sk8-blastfurnace", label: "Vysoká pec", emoji: "🔥", category: "Nástroje", acceptedAnswers: ["železiareň", "huta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/97/WWS_Tappingofablastfurnace.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Tappingofablastfurnace.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 15.0 },
  { id: "sk8-torchcutting", label: "Rezanie horákom", emoji: "🔥", category: "Nástroje", acceptedAnswers: ["plameň", "rezanie kovu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/39/WWS_Torchcuttingmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Torchcuttingmachine.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 1.1 },
];

/**
 * Zvuky vyradené z hry pri audite („Uhádni zvuk“ — normalizácia a názvy).
 * Nie sú súčasťou `SOUND_CLUES`, hra ich nikdy nečerpá. Zostávajú tu s
 * dôvodom, aby sa dali neskôr skontrolovať, nahradiť lepšou nahrávkou alebo
 * vrátiť späť. Nič z nich sa nezmazalo.
 */
export const SOUND_CLUES_NEEDS_REVIEW: SoundClueReview[] = [
  { id: "sk-police-siren", label: "Americká policajná siréna", emoji: "🚓", category: "Doprava", acceptedAnswers: ["siréna", "polícia"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ae/American_police_siren_i.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:American_police_siren_i.ogg", credit: "lezer", license: "Public domain", gainDb: 15.0, reviewReason: "duplicitný koncept s „Policajná siréna“ (sk2-policecar-siren)" },
  { id: "sk-clock-tick", label: "Tikajúce hodiny", emoji: "🕰️", category: "Domácnosť", acceptedAnswers: ["hodiny", "tikanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Alarm_clock_ticking.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Alarm_clock_ticking.ogg", credit: "ezwa", license: "Public domain", gainDb: 15.0, reviewReason: "príliš tichá nahrávka (-54.8 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -39.8 LUFS" },
  { id: "sk-phone-ring", label: "Vytáčanie čísla na telefóne", emoji: "☎️", category: "Technológie", acceptedAnswers: ["vytáčanie čísla", "telefón", "zvonenie v slúchadle"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Telephone.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Telephone.ogg", credit: "Dsw4", license: "Public domain", gainDb: 16.9, reviewReason: "aj po normalizácii o 6.5 LU tichšie ako cieľ (−18 LUFS); krátke údery by bez agresívneho limitera nešlo zosilniť" },
  { id: "sk-helicopter", label: "Vrtuľník", emoji: "🚁", category: "Doprava", acceptedAnswers: ["helikoptéra"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Helicopter_over_quiet_neighbourhood.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Helicopter_over_quiet_neighbourhood.ogg", credit: "ezwa", license: "Public domain", gainDb: 15.0, reviewReason: "príliš tichá nahrávka (-42.8 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -27.8 LUFS" },
  { id: "sk-keyboard", label: "Písanie na klávesnici", emoji: "⌨️", category: "Technológie", acceptedAnswers: ["klávesnica", "písanie na počítači"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Keyboard_noise.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Keyboard_noise.ogg", credit: "No machine-readable author provided. Yuyudevil assumed (based on…", license: "Public domain", gainDb: 24.0, reviewReason: "príliš tichá nahrávka (-57.6 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -33.6 LUFS" },
  { id: "commons-a-three-striped-palm-squirrel-funambulus-palmaru", label: "Veverička", emoji: "🐿️", category: "Zvieratá", acceptedAnswers: ["pišťanie veveričky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ae/A_three-striped_palm_squirrel_%28Funambulus_palmarum%29_chirping_16January2015.oga", sourcePage: "https://commons.wikimedia.org/wiki/File:A_three-striped_palm_squirrel_(Funambulus_palmarum)_chirping_16January2015.oga", credit: "Subhashish Panigrahi", license: "CC BY-SA 4.0", gainDb: 11.0, reviewReason: "nahrávka exotickej palmovej veveričky znie ako vták; laik ju nerozozná" },
  { id: "commons-zero-car-toyota-corolla-1600-gt-2-door-ae86-jyv-", label: "Rely", emoji: "🏁", category: "Šport", acceptedAnswers: ["rallye", "pretekárske auto na trati"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Zero_car_Toyota_Corolla_1600_GT_2_Door_AE86_Jyv%C3%A4skyl%C3%A4n_Talviralli_2023_Kuohu.opus", sourcePage: "https://commons.wikimedia.org/wiki/File:Zero_car_Toyota_Corolla_1600_GT_2_Door_AE86_Jyv%C3%A4skyl%C3%A4n_Talviralli_2023_Kuohu.opus", credit: "Antti Leppänen", license: "CC BY 4.0", gainDb: -3.0, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -26.1 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk2-alarmclock-ring", label: "Zvonenie starého budíka", emoji: "⏰", category: "Domácnosť", acceptedAnswers: ["budík"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/WWS_Alarmclockringing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Alarmclockringing.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -7.4, reviewReason: "duplicitný koncept s „Budík“ (sk-alarm-clock)" },
  { id: "sk2-leafblower", label: "Fúkač na lístie", emoji: "🍃", category: "Záhrada", acceptedAnswers: ["fukár", "fúkanie lístia"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/be/WWS_Backpackleafblower.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Backpackleafblower.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "príliš tichá nahrávka (-49.3 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -34.3 LUFS" },
  { id: "sk2-cashregister-old", label: "Stará pokladňa", emoji: "🧾", category: "Obchod", acceptedAnswers: ["pokladňa", "registračná pokladňa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/WWS_Cashregister.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Cashregister.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 9.5, reviewReason: "takmer rovnaký koncept ako „Pokladňa“ (sk2-cashregister2)" },
  { id: "sk2-dental-scaler", label: "Ultrazvukové čistenie zubov", emoji: "🦷", category: "Zdravie", acceptedAnswers: ["zubár"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d2/WWS_Dentalultrasonicscaler.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Dentalultrasonicscaler.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: -0.2, reviewReason: "zameniteľné so zubárskou vŕtačkou" },
  { id: "sk2-hedgetrimmer", label: "Nožnice na živý plot", emoji: "✂️", category: "Záhrada", acceptedAnswers: ["strihanie živého plota", "plotostrih"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fb/WWS_HedgeTrimmer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_HedgeTrimmer.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 10.0, reviewReason: "úvodné ticho 4.2 s — v 7-sekundovej ukážke by hráč takmer nič nepočul" },
  { id: "sk2-keycutting", label: "Výroba kľúča", emoji: "🔑", category: "Obchod", acceptedAnswers: ["kopírovanie kľúča", "brúsenie kľúča"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/06/WWS_KeyCuttingMachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_KeyCuttingMachine.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "príliš tichá nahrávka (-45.4 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -30.4 LUFS" },
  { id: "sk2-mac-typing", label: "Písanie na starom počítači", emoji: "⌨️", category: "Technológie", acceptedAnswers: ["klávesnica"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WWS_MacintoshSE30typing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_MacintoshSE30typing.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 15.8, reviewReason: "duplicitný koncept s „Písanie na klávesnici“" },
  { id: "sk2-bandsaw", label: "Pásová píla", emoji: "🪚", category: "Nástroje", acceptedAnswers: ["píla"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/48/WWS_Bandsaw.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Bandsaw.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: -2.1, reviewReason: "zameniteľné s ostatnými elektrickými pílami" },
  { id: "sk2-carpetbeater", label: "Vyklepávanie koberca", emoji: "🧹", category: "Domácnosť", acceptedAnswers: ["klepanie koberca", "klepač na koberce"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/WWS_Carpetbeater.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Carpetbeater.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 6.1, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -23.5 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk2-coffeeroaster", label: "Pražička kávy", emoji: "☕", category: "Kuchyňa", acceptedAnswers: ["praženie kávy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/90/WWS_CoffeeRoaster.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_CoffeeRoaster.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 2.4, reviewReason: "priemyselný bubon; podľa zvuku sa nedá férovo určiť" },
  { id: "sk2-coffeemaker-drip", label: "Prekvapkávací kávovar", emoji: "☕", category: "Kuchyňa", acceptedAnswers: ["kávovar", "varenie kávy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/73/WWS_Coffeemaker.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Coffeemaker.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 15.0, startAt: 3.2, reviewReason: "príliš tichá nahrávka (-64.6 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -49.6 LUFS" },
  { id: "sk2-cracking-nuts", label: "Lúskanie orechov", emoji: "🌰", category: "Kuchyňa", acceptedAnswers: ["orechy", "luskáčik"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/60/WWS_Crackingnuts.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Crackingnuts.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 15.0, startAt: 1.2, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -26.7 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk2-hammerdrill", label: "Pneumatická vŕtačka", emoji: "🔨", category: "Nástroje", acceptedAnswers: ["vŕtanie", "zbíjačka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/WWS_Hammerdrill.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Hammerdrill.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -6.3, startAt: 1.3, reviewReason: "zameniteľné so zbíjačkou (sk2-pneumaticdrill2)" },
  { id: "sk2-jointer", label: "Zrovnávačka dreva", emoji: "🪵", category: "Nástroje", acceptedAnswers: ["hoblovačka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/WWS_Jointer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Jointer.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: -5.3, reviewReason: "dielenský stroj bez rozpoznateľného zvuku" },
  { id: "sk2-police-whistle", label: "Policajná píšťalka", emoji: "👮", category: "Doprava", acceptedAnswers: ["píšťalka", "pískanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/WWS_Policewhistle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Policewhistle.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -13.7, reviewReason: "zameniteľné s píšťalkou rozhodcu" },
  { id: "sk2-shoerepair", label: "Brúsenie podrážky", emoji: "👞", category: "Obchod", acceptedAnswers: ["oprava topánok"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/46/WWS_ShoeRepairing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_ShoeRepairing.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 14.6, reviewReason: "brúsny stroj sa nedá určiť podľa zvuku" },
  { id: "sk2-kettle-whistling2", label: "Píšťalková kanvica", emoji: "♨️", category: "Kuchyňa", acceptedAnswers: ["kanvica", "pískajúca kanvica"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8f/WWS_Whistlingkettle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Whistlingkettle.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 15.0, startAt: 0.9, reviewReason: "príliš tichá nahrávka (-44.6 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -29.6 LUFS" },
  { id: "sk2-car-horn-old", label: "Klaksón starého auta", emoji: "📯", category: "Doprava", acceptedAnswers: ["trúbenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/WWS_CarPrinzNSU1200C8211horn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_CarPrinzNSU1200C8211horn.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -14.9, reviewReason: "duplicitný koncept s „Trúbenie auta“" },
  { id: "sk2-clockingmachine", label: "Píchačky", emoji: "🕰️", category: "Škola a kancelária", acceptedAnswers: ["dochádzka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f0/WWS_Clocking-inmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Clocking-inmachine.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: -1.4, reviewReason: "duplicitný koncept s „Píchacie hodiny“ (sk2-timeclock)" },
  { id: "sk2-icecreamvan", label: "Zmrzlinárske auto", emoji: "🍦", category: "Voľný čas", acceptedAnswers: ["melódia zmrzlinára"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8b/WWS_HomeIceCreamvan.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_HomeIceCreamvan.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 6.4, reviewReason: "severská melódia, u nás neznáma; znie ako obyčajná melódia" },
  { id: "sk2-luggagebelt", label: "Pás na batožinu", emoji: "🧳", category: "Doprava", acceptedAnswers: ["letisko", "dopravník"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d1/WWS_Luggagebeltinwaitinghall.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Luggagebeltinwaitinghall.ogg", credit: "Work With Sounds / Sound Culture Linkopings University", license: "CC BY 4.0", gainDb: 1.9, reviewReason: "hukot dopravníka sa nedá férovo určiť" },
  { id: "sk2-polaroid", label: "Polaroid", emoji: "📸", category: "Voľný čas", acceptedAnswers: ["fotenie polaroidom", "fotoaparát"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e2/WWS_Polaroid1200iTakingapicture.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Polaroid1200iTakingapicture.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 10.6, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -23.8 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk2-vwbeetle-horn", label: "Klaksón chrobáka", emoji: "📯", category: "Doprava", acceptedAnswers: ["trúbenie auta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8c/WWS_VolkswagenBeetle8211horn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_VolkswagenBeetle8211horn.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -6.8, reviewReason: "rovnaký súbor ako „Trúbenie auta“ (commons-wws-volkswagenbeetle8211horn-ogg)" },
  { id: "sk2-vwbeetle-engine", label: "Motor starého auta", emoji: "🚗", category: "Doprava", acceptedAnswers: ["motor auta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/60/WWS_VolkswagenBeetle8211engine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_VolkswagenBeetle8211engine.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 3.2, reviewReason: "duplicitný koncept s „Motor auta“" },
  { id: "sk2-boxmangle", label: "Mangeľ", emoji: "🧺", category: "Domácnosť", acceptedAnswers: ["valcovanie bielizne"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/77/WWS_Boxmangle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Boxmangle.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 3.9, reviewReason: "historický mangeľ; podľa zvuku sa nedá férovo určiť" },
  { id: "sk2-eastereggdrill", label: "Vŕtanie kraslice", emoji: "🥚", category: "Voľný čas", acceptedAnswers: ["kraslica"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6e/WWS_Eastereggdrilling.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Eastereggdrilling.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -5.0, reviewReason: "jemné vŕtanie sa nedá podľa zvuku spojiť s kraslicou" },
  { id: "sk2-glassblowing", label: "Fúkanie skla", emoji: "🫧", category: "Voľný čas", acceptedAnswers: ["sklárska pec"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/WWS_Glass-blowingIformingthebody.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Glass-blowingIformingthebody.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 7.7, reviewReason: "hukot pece; podľa zvuku sa nedá férovo určiť" },
  { id: "sk2-manualexchange", label: "Telefónna ústredňa", emoji: "☎️", category: "Technológie", acceptedAnswers: ["ústredňa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/WWS_Manualtelephoneexchange.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Manualtelephoneexchange.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 7.9, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk2-goldpan", label: "Ryžovanie zlata", emoji: "⛏️", category: "Voľný čas", acceptedAnswers: ["zlatokop"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/79/WWS_ProspectorpanninggoldinLapland.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_ProspectorpanninggoldinLapland.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 12.3, reviewReason: "čľapkanie vody v miske sa nedá férovo spojiť so zlatom" },
  { id: "sk2-signalhorn-old", label: "Signálny roh", emoji: "📯", category: "Nástroje", acceptedAnswers: ["trúbka", "roh"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/WWS_Signalhorn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Signalhorn.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -6.4, reviewReason: "zameniteľné s inými signálmi; neznámy predmet" },
  { id: "sk2-telephone-ring-old", label: "Zvonenie starého telefónu (baňa)", emoji: "☎️", category: "Technológie", acceptedAnswers: ["starý telefón"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/WWS_Telephone8211ringing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Telephone8211ringing.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -4.1, reviewReason: "duplicitný koncept so „Zvonenie starého telefónu“ (sk4-teslaphone)" },
  { id: "sk2-bakery-mixer", label: "Miesiaci stroj", emoji: "🍞", category: "Kuchyňa", acceptedAnswers: ["miesenie cesta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/WWS_Bakerykneadingthedoughinaspiralmixer2.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Bakerykneadingthedoughinaspiralmixer2.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 11.1, reviewReason: "hukot stroja sa nedá férovo určiť" },
  { id: "sk2-bakery-oven", label: "Pekárska pec", emoji: "🍞", category: "Kuchyňa", acceptedAnswers: ["pečenie chleba"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/27/WWS_Bakeryputtingbreadintothebreadoven4.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Bakeryputtingbreadintothebreadoven4.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 5.4, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk2-cutlery-sort", label: "Ukladanie príborov", emoji: "🍴", category: "Kuchyňa", acceptedAnswers: ["príbory"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Sorting_cutlery_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Sorting_cutlery_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -2.5, reviewReason: "duplicitný koncept s „Príbory v zásuvke“" },
  { id: "sk2-nailsontile", label: "Nechty po dlaždici", emoji: "💅", category: "Domácnosť", acceptedAnswers: ["škrabanie nechtami"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/Nails_on_tile_once_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Nails_on_tile_once_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", reviewReason: "0,5 s — príliš krátke na férové uhádnutie" },
  { id: "sk2-playground-swing", label: "Hojdačka", emoji: "🛝", category: "Voľný čas", acceptedAnswers: ["vŕzganie hojdačky", "ihrisko"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Playground_swings_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Playground_swings_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "aj po normalizácii o 6.2 LU tichšie ako cieľ (−18 LUFS); krátke údery by bez agresívneho limitera nešlo zosilniť" },
  { id: "sk2-sprinkler", label: "Zavlažovač", emoji: "💦", category: "Záhrada", acceptedAnswers: ["postrekovač", "kropenie trávnika"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Sprinkler_hit_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Sprinkler_hit_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -3.3, reviewReason: "1 s — príliš krátke na férové uhádnutie" },
  { id: "sk2-glassbreak", label: "Rozbitie skla", emoji: "🔨", category: "Každodenné situácie", acceptedAnswers: ["rozbité sklo", "črepy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/af/Glass_breaking_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Glass_breaking_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "príliš tichá nahrávka (-46.4 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -31.4 LUFS" },
  { id: "sk2-keys-shake", label: "Štrngot kľúčov", emoji: "🔑", category: "Každodenné situácie", acceptedAnswers: ["kľúče", "zväzok kľúčov"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Keys_shaking_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Keys_shaking_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 4.6, reviewReason: "aj po normalizácii o 6.1 LU tichšie ako cieľ (−18 LUFS); krátke údery by bez agresívneho limitera nešlo zosilniť" },
  { id: "sk2-hose-drag", label: "Ťahanie hadice", emoji: "🌿", category: "Záhrada", acceptedAnswers: ["záhradná hadica"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Dragging_a_hose_once_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Dragging_a_hose_once_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -19.4, reviewReason: "šúchanie sa nedá férovo spojiť s hadicou" },
  { id: "sk2-glass-flick", label: "Cinknutie na pohár", emoji: "🥂", category: "Voľný čas", acceptedAnswers: ["pohár", "prípitok"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Flick_a_glass_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Flick_a_glass_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 5.2, reviewReason: "aj po normalizácii o 6.1 LU tichšie ako cieľ (−18 LUFS); krátke údery by bez agresívneho limitera nešlo zosilniť" },
  { id: "sk2-bin-knock", label: "Úder do kontajnera", emoji: "🗑️", category: "Mesto", acceptedAnswers: ["smetiak", "kontajner"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/Knock_on_bin_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Knock_on_bin_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -2.2, reviewReason: "0,5 s — príliš krátke na férové uhádnutie" },
  { id: "sk2-tallgrass-swipe", label: "Chôdza vysokou trávou", emoji: "🌾", category: "Príroda", acceptedAnswers: ["tráva", "lúka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/Swiping_through_tall_grass_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Swiping_through_tall_grass_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 5.2, reviewReason: "aj po normalizácii o 7.5 LU tichšie ako cieľ (−18 LUFS); krátke údery by bez agresívneho limitera nešlo zosilniť" },
  { id: "sk2-leaves-walk", label: "Chôdza po lístí", emoji: "🍂", category: "Príroda", acceptedAnswers: ["šuchot lístia", "jeseň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Walking_through_leaves_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Walking_through_leaves_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "príliš tichá nahrávka (-42.4 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -27.4 LUFS" },
  { id: "sk2-woodbridge-walk", label: "Kroky po drevenom moste", emoji: "🌉", category: "Príroda", acceptedAnswers: ["drevený mostík", "kroky po doskách"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Walking_on_small_wooden_bridge_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Walking_on_small_wooden_bridge_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 3.8, reviewReason: "aj po normalizácii o 7.1 LU tichšie ako cieľ (−18 LUFS); krátke údery by bez agresívneho limitera nešlo zosilniť" },
  { id: "sk2-metaldoor-rub", label: "Škrabanie po plechu", emoji: "🚪", category: "Mesto", acceptedAnswers: ["plechové dvere"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/Rubbing_metal_door_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rubbing_metal_door_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 6.8, reviewReason: "abstraktný zvuk trenia; nedá sa férovo určiť" },
  { id: "sk2-glassontile", label: "Položenie pohára", emoji: "🥛", category: "Kuchyňa", acceptedAnswers: ["pohár na stole"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Placing_glass_object_on_tile_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Placing_glass_object_on_tile_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 3.7, reviewReason: "1,5 s — príliš krátke a nešpecifické" },
  { id: "sk2-plate-tile", label: "Posunutie taniera", emoji: "🍽️", category: "Kuchyňa", acceptedAnswers: ["tanier"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Shove_plate_on_tile_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Shove_plate_on_tile_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 1.3, reviewReason: "krátky nešpecifický zvuk" },
  { id: "sk2-leaf-stick", label: "Úder paličkou do listu", emoji: "🌿", category: "Príroda", acceptedAnswers: ["palička"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/Smacking_leaf_with_stick_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Smacking_leaf_with_stick_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", reviewReason: "0,4 s — príliš krátke na férové uhádnutie" },
  { id: "sk2-hose-drop", label: "Pád hadice", emoji: "🌿", category: "Záhrada", acceptedAnswers: ["hadica"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/79/Dropping_rolled_up_water_hose_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Dropping_rolled_up_water_hose_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 10.4, reviewReason: "1 s — nešpecifický úder" },
  { id: "sk2-rocks-hit", label: "Kamene o seba", emoji: "🪨", category: "Príroda", acceptedAnswers: ["klepanie kameňmi", "kamene"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/14/Rocks_hitting_together_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rocks_hitting_together_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 5.0, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -24.7 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk2-metalpole-hit", label: "Úder do kovovej tyče", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["kovová tyč"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Metal_pole_hit_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Metal_pole_hit_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 2.4, reviewReason: "0,5 s — príliš krátke na férové uhádnutie" },
  { id: "sk2-scissors-paper2", label: "Strihanie nožnicami", emoji: "✂️", category: "Škola a kancelária", acceptedAnswers: ["nožnice", "strihanie papiera"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/78/WWS_Paper-cuttingscissorsSloveniaPartisanPrintingShop.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Paper-cuttingscissorsSloveniaPartisanPrintingShop.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 5.8, startAt: 3.1, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -23.5 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk2-lighter-flick", label: "Zapaľovač", emoji: "🔥", category: "Každodenné situácie", acceptedAnswers: ["škrtnutie zapaľovačom", "zapálenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/Cheap_cigarette_lighter.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Cheap_cigarette_lighter.ogg", credit: "stephan", license: "Public domain", gainDb: 9.6, reviewReason: "aj po normalizácii o 7.0 LU tichšie ako cieľ (−18 LUFS); krátke údery by bez agresívneho limitera nešlo zosilniť" },
  { id: "sk2-lightswitch", label: "Vypínač", emoji: "💡", category: "Domácnosť", acceptedAnswers: ["cvaknutie vypínača", "zapnutie svetla"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Clickick_switch.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Clickick_switch.ogg", credit: "stephan", license: "Public domain", gainDb: 12.7, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -25.3 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk2-seatbelt", label: "Zapínanie pásu", emoji: "🚗", category: "Doprava", acceptedAnswers: ["bezpečnostný pás"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Buckling_on_seatbelt_clattering.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Buckling_on_seatbelt_clattering.ogg", credit: "natalie", license: "Public domain", gainDb: 4.9, reviewReason: "aj po normalizácii o 8.8 LU tichšie ako cieľ (−18 LUFS); krátke údery by bez agresívneho limitera nešlo zosilniť" },
  { id: "sk2-bee-buzz", label: "Bzučanie včely pri kvete", emoji: "🐝", category: "Príroda", acceptedAnswers: ["včela"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Bee_buzzing_sound_%28animal_noises%29.opus", sourcePage: "https://commons.wikimedia.org/wiki/File:Bee_buzzing_sound_(animal_noises).opus", credit: "Free Sounds Library User Spanac", license: "CC BY 3.0", gainDb: -1.1, reviewReason: "rovnaký súbor ako „Bzučanie včiel“ (commons-bee-buzzing-sound-animal-noises-opus)" },
  { id: "sk2-frogchorus", label: "Žabí koncert", emoji: "🐸", category: "Príroda", acceptedAnswers: ["žaby"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/Frogs_croak_calling_chorus_at_night.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Frogs_croak_calling_chorus_at_night.ogg", credit: "JogiAsad", license: "CC BY-SA 4.0", gainDb: 5.1, reviewReason: "rovnaký súbor ako „Kvákanie žiab“" },
  { id: "sk2-donkey-bray", label: "Hýkanie osla (2)", emoji: "🫏", category: "Zvieratá", acceptedAnswers: ["osol"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/25/157763_felix-blume_a-donkey-is-braying-in-his-enclosure-in-south-of-france.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:157763_felix-blume_a-donkey-is-braying-in-his-enclosure-in-south-of-france.wav", credit: "felix-blume", license: "CC0", gainDb: -1.2, reviewReason: "rovnaký súbor ako „Hýkanie osla“" },
  { id: "sk2-campfire", label: "Oheň vo vyhni", emoji: "🔥", category: "Nástroje", acceptedAnswers: ["kováčska vyhňa", "oheň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/WWS_Fireoftheforge.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Fireoftheforge.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 4.2, reviewReason: "duplicitný koncept s „Praskajúci oheň“" },
  { id: "sk2-gravel-footstep", label: "Krok na štrku", emoji: "🚶", category: "Príroda", acceptedAnswers: ["štrk"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Footstep_on_Gravel_%28Gravity_Sound%29.mp3", sourcePage: "https://commons.wikimedia.org/wiki/File:Footstep_on_Gravel_(Gravity_Sound).mp3", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 4.4, reviewReason: "0,6 s — jediný krok, duplicitné s „Chôdza po štrku“" },
  { id: "sk2-pencilsharp-el", label: "Elektrické strúhadlo (2)", emoji: "✏️", category: "Škola a kancelária", acceptedAnswers: ["strúhadlo"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/54/Electric_pencil_sharpener.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Electric_pencil_sharpener.ogg", credit: "tamanders", license: "Public domain", gainDb: 1.4, reviewReason: "duplicitný koncept s „Elektrické strúhadlo“" },
  { id: "sk2-mouseclick", label: "Klik myšou", emoji: "🖱️", category: "Technológie", acceptedAnswers: ["myš", "klikanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Computer_Mouse_Click.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Computer_Mouse_Click.wav", credit: "FlowgerWikiCommons", license: "CC0", gainDb: 12.3, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -25.8 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk3-alarmclock2", label: "Budík (2)", emoji: "⏰", category: "Domácnosť", acceptedAnswers: ["budík"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f3/WWS_Alarmclock.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Alarmclock.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -3.4, startAt: 1.4, reviewReason: "tretí budík v databáze" },
  { id: "sk3-bonfire-burn", label: "Vatra", emoji: "🔥", category: "Voľný čas", acceptedAnswers: ["oheň", "táborák"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/70/WWS_Bonfireburning.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Bonfireburning.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 6.4, reviewReason: "duplicitný koncept s „Praskajúci oheň“" },
  { id: "sk3-mitresaw", label: "Pokosová píla", emoji: "🪚", category: "Nástroje", acceptedAnswers: ["píla", "elektrická píla"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/WWS_Boschslidingmitresaw.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Boschslidingmitresaw.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 13.1, reviewReason: "zameniteľné s „Kotúčová píla“" },
  { id: "sk3-crane-lift", label: "Mostový žeriav", emoji: "🏗️", category: "Nástroje", acceptedAnswers: ["žeriav v hale"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/WWS_Crane.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Crane.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 0.0, reviewReason: "hukot žeriava v hale sa nedá férovo určiť" },
  { id: "sk3-cashregister-electronic", label: "Elektronická pokladňa", emoji: "🧾", category: "Obchod", acceptedAnswers: ["pípanie pokladne", "blok z pokladne"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e4/WWS_Electroniccashregister.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Electroniccashregister.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 7.9, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -24.0 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk3-christmastree-cut", label: "Rezanie vianočného stromčeka", emoji: "🎄", category: "Voľný čas", acceptedAnswers: ["pílenie stromčeka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f6/WWS_FellingaChristmastree.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_FellingaChristmastree.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 4.7, reviewReason: "zameniteľné s „Pílenie dreva“" },
  { id: "sk3-firehose-fill", label: "Plnenie hasičskej hadice", emoji: "🧯", category: "Bezpečnosť", acceptedAnswers: ["hadica", "voda pod tlakom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/76/WWS_FireHoseMaintenancemachine8211Hoseisfilledwithwater.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_FireHoseMaintenancemachine8211Hoseisfilledwithwater.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-firetruck-siren2", label: "Stará hasičská siréna", emoji: "🚒", category: "Doprava", acceptedAnswers: ["hasiči", "siréna"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/WWS_Fireenginesiren.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Fireenginesiren.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -2.4, reviewReason: "tretia hasičská siréna v databáze" },
  { id: "sk3-firetruck-driverseat", label: "Jazda v hasičskom aute", emoji: "🚒", category: "Doprava", acceptedAnswers: ["hasičské auto"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/WWS_Firetruckrecordedfromdriver8217sseat.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Firetruckrecordedfromdriver8217sseat.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 3.1, startAt: 2.3, reviewReason: "prvých 7 s je iba motor; siréna až po 3:30" },
  { id: "sk3-fishingvessel", label: "Rybárska loď", emoji: "🚢", category: "Doprava", acceptedAnswers: ["loď", "lodný motor"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/53/WWS_Fishingvessel.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Fishingvessel.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 20.9, reviewReason: "23-minútová nahrávka motora; úvod sa nedá férovo určiť" },
  { id: "sk3-floralfridge", label: "Chladiaca vitrína", emoji: "🌷", category: "Obchod", acceptedAnswers: ["chladnička"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/WWS_Floralrefrigerator.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Floralrefrigerator.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 14.8, reviewReason: "tichý hukot; nedá sa férovo určiť" },
  { id: "sk3-forklift", label: "Vysokozdvižný vozík", emoji: "🏗️", category: "Doprava", acceptedAnswers: ["vysokozdvižný", "vozík v sklade"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/ff/WWS_Forklifttruck.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Forklifttruck.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 24.0, reviewReason: "príliš tichá nahrávka (-49.0 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -25.0 LUFS" },
  { id: "sk3-hoist", label: "Banský výťah", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["ťažná veža"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/24/WWS_Hoist.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Hoist.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-icebreaker-siren", label: "Lodná siréna", emoji: "🚢", category: "Doprava", acceptedAnswers: ["húkanie lode", "loď"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/WWS_IcebreakerKunashipssiren.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_IcebreakerKunashipssiren.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: -5.4, reviewReason: "zameniteľné s „Hmlová siréna“" },
  { id: "sk3-metro", label: "Metro", emoji: "🚇", category: "Doprava", acceptedAnswers: ["príchod metra", "podzemka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/WWS_Metro.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Metro.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "príliš tichá nahrávka (-41.6 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -26.6 LUFS" },
  { id: "sk3-milkingclean", label: "Umývanie dojacieho stroja", emoji: "🐄", category: "Príroda", acceptedAnswers: ["dojáreň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/55/WWS_MilkingMachineCleaningUnit.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_MilkingMachineCleaningUnit.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 0.0, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-magneticcard", label: "Označovač lístkov", emoji: "💳", category: "Doprava", acceptedAnswers: ["označenie lístka", "štikanie lístka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/WWS_Obliterationofamagneticcard.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Obliterationofamagneticcard.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 6.5, reviewReason: "aj po normalizácii o 6.7 LU tichšie ako cieľ (−18 LUFS); krátke údery by bez agresívneho limitera nešlo zosilniť" },
  { id: "sk3-olivemill", label: "Mlyn na olivy", emoji: "🫒", category: "Kuchyňa", acceptedAnswers: ["olivy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a3/WWS_OliveMill.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_OliveMill.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 10.0, startAt: 1.6, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-olivepress", label: "Lis na olivy", emoji: "🫒", category: "Kuchyňa", acceptedAnswers: ["lisovanie olív"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c4/WWS_OlivePress.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_OlivePress.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 8.7, startAt: 0.8, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-polishingmachine", label: "Leštička", emoji: "✨", category: "Nástroje", acceptedAnswers: ["leštiaci stroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/WWS_Polishingmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Polishingmachine.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 11.4, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-waterpump", label: "Čerpadlo", emoji: "🚰", category: "Nástroje", acceptedAnswers: ["pumpa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/WWS_Pump.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Pump.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: -3.5, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-punchingpress", label: "Lis na plech", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["lisovanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/WWS_Punchingpress.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Punchingpress.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -1.2, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-turntable-rail", label: "Točňa lokomotív", emoji: "🚂", category: "Doprava", acceptedAnswers: ["točňa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8e/WWS_Railwayturntable.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Railwayturntable.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 3.5, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-revolvingstage", label: "Otočné javisko", emoji: "🎭", category: "Voľný čas", acceptedAnswers: ["divadlo"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/WWS_REVOLVINGTHEATRESTAGEonthestage.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_REVOLVINGTHEATRESTAGEonthestage.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 1.9, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-ringpolish", label: "Leštenie šperku", emoji: "💍", category: "Obchod", acceptedAnswers: ["leštenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/92/WWS_Ringpolishing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Ringpolishing.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 0.5, reviewReason: "zameniteľné s inými brúskami" },
  { id: "sk3-rivetingmachine", label: "Nitovačka", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["nitovanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/WWS_Rivetingmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Rivetingmachine.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -0.7, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-santaworkshop", label: "Vianočná dekorácia s hračkami", emoji: "🎁", category: "Voľný čas", acceptedAnswers: ["hracia dekorácia"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/83/WWS_Santa8217sToyfactory.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Santa8217sToyfactory.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: -9.2, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-christmaswafer", label: "Lámanie oblátky", emoji: "🎄", category: "Voľný čas", acceptedAnswers: ["oblátky", "Štedrý večer"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/32/WWS_SharingtheChristmaswaferopatek.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_SharingtheChristmaswaferopatek.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 12.4, startAt: 0.8, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -29.4 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk3-shipyardcrane", label: "Lodenicový žeriav", emoji: "🏗️", category: "Mesto", acceptedAnswers: ["žeriav"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/WWS_Shipyardcrane.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Shipyardcrane.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "duplicitný koncept s inými žeriavmi" },
  { id: "sk3-shoesole", label: "Pribíjanie podrážky", emoji: "👞", category: "Obchod", acceptedAnswers: ["obuvník"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/WWS_ShoemakerSolenailing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_ShoemakerSolenailing.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 4.1, reviewReason: "duplicitný koncept s „Obuvník zatĺka klince“" },
  { id: "sk3-smithy-bellows", label: "Kováčsky mech", emoji: "🔥", category: "Nástroje", acceptedAnswers: ["mech", "vyhňa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c4/WWS_Smithyblacksmithbellows1.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Smithyblacksmithbellows1.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "príliš tichá nahrávka (-41.9 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -26.9 LUFS" },
  { id: "sk3-steamengine-bell", label: "Parný stroj so zvoncom", emoji: "🚂", category: "Nástroje", acceptedAnswers: ["parný stroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3a/WWS_Steamengineandsignalbell.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Steamengineandsignalbell.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 0.2, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-threshing1", label: "Mlátenie cepmi", emoji: "🌾", category: "Príroda", acceptedAnswers: ["cepy", "mlátenie obilia"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/54/WWS_Threshingwithhandflailstwomenthreshing.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Threshingwithhandflailstwomenthreshing.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 6.3, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -26.4 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk3-tumblingbarrel", label: "Otočný bubon", emoji: "🛠️", category: "Nástroje", acceptedAnswers: ["bubon"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/WWS_Tumblingbarrel.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Tumblingbarrel.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 0.1, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-wardrobechain", label: "Šatňová reťaz v bani", emoji: "🚪", category: "Nástroje", acceptedAnswers: ["reťaz"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c2/WWS_Wardrobechainloweringandraising.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Wardrobechainloweringandraising.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -1.5, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-watersmithy-hammer", label: "Dvaja kováči kujú", emoji: "🔨", category: "Nástroje", acceptedAnswers: ["kovanie", "kladivá"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/WWS_Watersmithyforgingwithtwohammers.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Watersmithyforgingwithtwohammers.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 6.8, reviewReason: "duplicitný koncept s „Kováč“" },
  { id: "sk3-welding-generic", label: "Zváranie (2)", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["zváranie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d4/WWS_Welding.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Welding.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 2.2, reviewReason: "duplicitný koncept so „Zváranie“" },
  { id: "sk3-wheelwright-carve", label: "Vyrezávanie dreva", emoji: "🪵", category: "Nástroje", acceptedAnswers: ["kolár", "rezbárstvo"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/WWS_Wheelwrightcarvingaspoke.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Wheelwrightcarvingaspoke.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-threshing2", label: "Mlátenie cepmi (2)", emoji: "🌾", category: "Príroda", acceptedAnswers: ["cepy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a8/WWS_Threshingwithhandflailstwopairs.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Threshingwithhandflailstwopairs.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 7.1, reviewReason: "duplicitný koncept s „Mlátenie cepmi“" },
  { id: "sk3-chalk-write", label: "Krieda na tabuli", emoji: "📝", category: "Škola a kancelária", acceptedAnswers: ["písanie kriedou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/WWS_Chalk.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Chalk.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 6.5, reviewReason: "duplicitný koncept s „Písanie kriedou“" },
  { id: "sk3-van-starting", label: "Štartovanie dodávky", emoji: "🚐", category: "Doprava", acceptedAnswers: ["dodávka", "štartovanie auta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b0/WWS_FSRTarpan239Dvanstarting.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_FSRTarpan239Dvanstarting.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 7.4, reviewReason: "duplicitný koncept so „Štartovanie auta“" },
  { id: "sk3-graindryer", label: "Sušička obilia", emoji: "🌾", category: "Príroda", acceptedAnswers: ["hukot v továrni"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/WWS_Graindryer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Graindryer.ogg", credit: "Work With Sounds / Sound Culture Linkopings University", license: "CC BY 4.0", gainDb: -2.5, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-milkingunit", label: "Dojacia jednotka", emoji: "🐄", category: "Príroda", acceptedAnswers: ["dojenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/WWS_Milkingunit.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Milkingunit.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 6.8, reviewReason: "duplicitný koncept s „Dojací stroj“" },
  { id: "sk3-achum2", label: "Klimatizácia (2)", emoji: "❄️", category: "Technológie", acceptedAnswers: ["klíma"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Air_conditioner_hum_2_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Air_conditioner_hum_2_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 8.9, reviewReason: "duplicitný koncept s „Klimatizácia“" },
  { id: "sk3-canhits", label: "Búchanie do plechovky", emoji: "🥫", category: "Kuchyňa", acceptedAnswers: ["plechovka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Can_hits_2_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Can_hits_2_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 3.3, reviewReason: "nešpecifický úder" },
  { id: "sk3-chocolatecake", label: "Krájanie torty", emoji: "🍰", category: "Kuchyňa", acceptedAnswers: ["torta"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Chocolate_cake_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Chocolate_cake_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -4.5, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk3-chairfar", label: "Posúvanie stoličky (2)", emoji: "🪑", category: "Domácnosť", acceptedAnswers: ["stolička"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Drag_chair_far_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Drag_chair_far_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -4.8, reviewReason: "duplicitný koncept s „Posúvanie stoličky“" },
  { id: "sk3-feetgravel", label: "Prešľapovanie v štrku", emoji: "🚶", category: "Príroda", acceptedAnswers: ["štrk"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Feet_shuffling_in_gravel_%28Gravity_Sound%29.mp3", sourcePage: "https://commons.wikimedia.org/wiki/File:Feet_shuffling_in_gravel_(Gravity_Sound).mp3", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 4.1, reviewReason: "duplicitný koncept s „Chôdza po štrku“" },
  { id: "sk3-hollowlog", label: "Úder do dutého kmeňa", emoji: "🪵", category: "Príroda", acceptedAnswers: ["dutý kmeň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Hollow_log_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Hollow_log_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 3.9, reviewReason: "1 s — príliš krátke na férové uhádnutie" },
  { id: "sk3-keystree", label: "Kľúče o strom", emoji: "🔑", category: "Príroda", acceptedAnswers: ["kľúče"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/28/Keys_hitting_tree_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Keys_hitting_tree_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 3.6, reviewReason: "nezmyselná situácia; nedá sa férovo určiť" },
  { id: "sk3-metaldrain", label: "Odkvap", emoji: "🚿", category: "Domácnosť", acceptedAnswers: ["odkvapová rúra", "voda v odkvape"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Metal_water_drain_hits_rattle_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Metal_water_drain_hits_rattle_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 2.3, reviewReason: "búchanie do rúry; nedá sa férovo určiť" },
  { id: "sk3-pebblesmetal", label: "Kamienky na plechu", emoji: "🪨", category: "Príroda", acceptedAnswers: ["kamienky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Pebbles_dropped_on_metal_frame_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Pebbles_dropped_on_metal_frame_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 1.6, reviewReason: "nešpecifický zvuk" },
  { id: "sk3-glasstile2", label: "Položenie pohára (2)", emoji: "🥛", category: "Kuchyňa", acceptedAnswers: ["pohár"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Placing_glass_object_on_tile_2_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Placing_glass_object_on_tile_2_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 11.2, reviewReason: "1 s — krátke a duplicitné" },
  { id: "sk3-raindrops", label: "Kvapky dažďa", emoji: "🌧️", category: "Príroda", acceptedAnswers: ["dážď"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Rain_drops_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rain_drops_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -0.4, reviewReason: "duplicitný koncept s „Dážď v lese“" },
  { id: "sk3-rubbingchair", label: "Šúchanie o stoličku", emoji: "🪑", category: "Domácnosť", acceptedAnswers: ["stolička"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/13/Rubbing_chair_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rubbing_chair_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "nešpecifický zvuk trenia" },
  { id: "sk3-rustlingleaves", label: "Šušťanie lístia", emoji: "🍃", category: "Príroda", acceptedAnswers: ["lístie vo vetre"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/db/Rustling_leaves_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Rustling_leaves_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 4.7, reviewReason: "duplicitný koncept s „Chôdza po lístí“" },
  { id: "sk3-metalslide", label: "Šmýkanie na šmykľavke", emoji: "🛝", category: "Voľný čas", acceptedAnswers: ["šmykľavka", "ihrisko"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Sand_down_metal_slide_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Sand_down_metal_slide_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "príliš tichá nahrávka (-42.4 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -27.4 LUFS" },
  { id: "sk3-shakingleaves", label: "Trasenie konárom", emoji: "🌿", category: "Príroda", acceptedAnswers: ["konár", "lístie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/Shaking_leaves_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Shaking_leaves_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "duplicitný koncept so šušťaním lístia" },
  { id: "sk3-stickslide", label: "Palička po šmykľavke", emoji: "🛝", category: "Voľný čas", acceptedAnswers: ["palička"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/84/Stick_on_metal_slide_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Stick_on_metal_slide_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 2.4, reviewReason: "duplicitný koncept s „Palička po zábradlí“" },
  { id: "sk3-swipegrass", label: "Šuchnutie trávy", emoji: "🌱", category: "Príroda", acceptedAnswers: ["tráva"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/80/Swipe_grass_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Swipe_grass_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 8.4, reviewReason: "1 s — príliš krátke na férové uhádnutie" },
  { id: "sk3-sandalswalk", label: "Chôdza v sandáloch", emoji: "👡", category: "Každodenné situácie", acceptedAnswers: ["sandále", "šľapky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Walking_in_sandals_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Walking_in_sandals_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -19.4, reviewReason: "duplicitný koncept s „Kroky v šľapkách“" },
  { id: "sk3-walkgrass", label: "Chôdza po tráve", emoji: "🌱", category: "Príroda", acceptedAnswers: ["kroky po tráve"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Walking_on_grass_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Walking_on_grass_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 8.9, reviewReason: "duplicitný koncept s „Chôdza vysokou trávou“" },
  { id: "sk3-watermelonsmacks", label: "Búchanie do melóna", emoji: "🍉", category: "Kuchyňa", acceptedAnswers: ["melón"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Watermelon_hit_smacks_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Watermelon_hit_smacks_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 3.1, reviewReason: "duplicitný koncept s „Klopkanie na melón“" },
  { id: "sk3-metalpolehits", label: "Údery do kovovej tyče", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["kovová tyč", "búchanie do tyče"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/Metal_pole_hits_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Metal_pole_hits_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 4.1, reviewReason: "aj po normalizácii o 8.2 LU tichšie ako cieľ (−18 LUFS); krátke údery by bez agresívneho limitera nešlo zosilniť" },
  { id: "sk3-stairsqueak", label: "Vŕzgajúci schod", emoji: "🪜", category: "Domácnosť", acceptedAnswers: ["schod", "vŕzganie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/77/Stair_squeak_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Stair_squeak_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 1.5, reviewReason: "duplicitný koncept s „Vŕzgajúce schody“" },
  { id: "sk3-sortcutlery2", label: "Triedenie príborov", emoji: "🍴", category: "Kuchyňa", acceptedAnswers: ["príbory"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Sorting_cutlery_2_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Sorting_cutlery_2_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -1.2, reviewReason: "tretí záznam príborov" },
  { id: "sk3-stethoscope", label: "Srdce v stetoskope", emoji: "🩺", category: "Zdravie", acceptedAnswers: ["tlkot srdca", "stetoskop"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/Emily%27s_heartbeat.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Emily%27s_heartbeat.wav", credit: "EmilyHopeS", license: "CC BY-SA 4.0", gainDb: 10.7, reviewReason: "duplicitný koncept s „Tlkot srdca“" },
  { id: "sk4-horseshoes-cobble", label: "Klapot kopýt", emoji: "🐎", category: "Mesto", acceptedAnswers: ["kôň na dlažbe", "podkovy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/60/WWS_Clatterofhorseshoesonthepavement.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Clatterofhorseshoesonthepavement.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 5.3, reviewReason: "duplicitný koncept s „Fiaker“" },
  { id: "sk4-coffeesilo", label: "Kávové zrná v potrubí", emoji: "☕", category: "Kuchyňa", acceptedAnswers: ["káva"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0a/WWS_Coffeebeanssuckedtothesilo.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Coffeebeanssuckedtothesilo.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 1.7, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk4-filmreels", label: "Filmové cievky", emoji: "🎬", category: "Voľný čas", acceptedAnswers: ["kino", "film"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bf/WWS_Filmreels.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Filmreels.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 0.8, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk4-filmsplicer", label: "Strih filmu", emoji: "🎬", category: "Voľný čas", acceptedAnswers: ["film"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/WWS_Filmsplicer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Filmsplicer.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 12.3, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk4-hosewagon", label: "Vozík s hadicou", emoji: "🚒", category: "Bezpečnosť", acceptedAnswers: ["hasičská hadica"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WWS_Hosehaulerwaggonispassingby.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Hosehaulerwaggonispassingby.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 7.5, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk4-hydropower", label: "Vodná elektráreň", emoji: "💧", category: "Príroda", acceptedAnswers: ["voda", "turbína"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/WWS_Hydropowerplant.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Hydropowerplant.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -5.9, reviewReason: "hukot vody; nedá sa férovo určiť" },
  { id: "sk4-crossingbarrier", label: "Ručná závora", emoji: "🚦", category: "Doprava", acceptedAnswers: ["závora"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3b/WWS_Level-crossingbarrier8211Lifting.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Level-crossingbarrier8211Lifting.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 2.6, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk4-cargobelt", label: "Pás v batožinovom priestore", emoji: "📦", category: "Doprava", acceptedAnswers: ["dopravník"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/58/WWS_Luggagebeltincargospace.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Luggagebeltincargospace.ogg", credit: "Work With Sounds / Sound Culture Linkopings University", license: "CC BY 4.0", gainDb: 1.4, reviewReason: "duplicitný koncept s „Pás na batožinu“" },
  { id: "sk4-floppydisk", label: "Disketová mechanika", emoji: "💾", category: "Technológie", acceptedAnswers: ["disketa", "starý počítač"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/WWS_MacintoshSE30startandformatafloppydisk.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_MacintoshSE30startandformatafloppydisk.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 9.1, startAt: 2.7, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -22.4 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk4-harbourcrane", label: "Prístavný žeriav", emoji: "🏗️", category: "Doprava", acceptedAnswers: ["žeriav"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dd/WWS_Mobileharbourcrane.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Mobileharbourcrane.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 11.3, reviewReason: "duplicitný koncept s inými žeriavmi" },
  { id: "sk4-policevan-pass", label: "Policajné auto so sirénou", emoji: "🚓", category: "Doprava", acceptedAnswers: ["polícia", "policajná siréna"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/WWS_Policevanpassingby.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Policevanpassingby.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: -5.6, reviewReason: "tretia policajná siréna v databáze" },
  { id: "sk4-rollerprep", label: "Tlačiarenský valec", emoji: "🖨️", category: "Škola a kancelária", acceptedAnswers: ["tlač"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/WWS_Preparingtheroller.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Preparingtheroller.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 7.9, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk4-submersiblepump", label: "Ponorné čerpadlo", emoji: "💧", category: "Nástroje", acceptedAnswers: ["čerpadlo"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/18/WWS_Submersiblepump.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Submersiblepump.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 1.3, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk4-super8", label: "Filmová premietačka", emoji: "🎥", category: "Voľný čas", acceptedAnswers: ["premietačka", "projektor"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cd/WWS_Super8MovieProjector8211Projection.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Super8MovieProjector8211Projection.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 4.8, reviewReason: "duplicitný koncept s „Kinoprojektor“" },
  { id: "sk4-tattoostudio", label: "Tetovacie štúdio", emoji: "💉", category: "Voľný čas", acceptedAnswers: ["tetovanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/WWS_TattooStudio.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_TattooStudio.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "duplicitný koncept s „Tetovanie“" },
  { id: "sk4-turnerdrills", label: "Vŕtanie na sústruhu", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["sústruh"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/WWS_Theturnerdrills.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Theturnerdrills.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: -1.7, reviewReason: "duplicitný koncept so „Sústruh“" },
  { id: "sk4-walkmine", label: "Kroky v bani", emoji: "⛏️", category: "Príroda", acceptedAnswers: ["čľapkanie", "chôdza vodou"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/55/WWS_Walkinginthemine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Walkinginthemine.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 10.8, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk4-waterrock", label: "Presakujúca voda v bani", emoji: "💧", category: "Príroda", acceptedAnswers: ["kvapkanie vody"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/WWS_Waterdrainingthroughtherock.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Waterdrainingthroughtherock.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 5.9, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk4-windturbine2", label: "Veterná turbína (2)", emoji: "💨", category: "Príroda", acceptedAnswers: ["veterná elektráreň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8f/WWS_Windturbine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Windturbine.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "duplicitný koncept s „Veterná elektráreň“" },
  { id: "sk4-anvil", label: "Údery na nákovu", emoji: "🔨", category: "Nástroje", acceptedAnswers: ["kováč", "nákova"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f8/WWS_Blacksmith8217sanvil.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Blacksmith8217sanvil.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 4.5, startAt: 0.9, reviewReason: "duplicitný koncept s „Kováč“" },
  { id: "sk4-cardcatalog", label: "Kartotéka", emoji: "📇", category: "Škola a kancelária", acceptedAnswers: ["knižnica", "listovanie v kartotéke"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/62/WWS_Cardcatalog.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Cardcatalog.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 7.1, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk4-warningsignal", label: "Výstražný signál", emoji: "⚠️", category: "Bezpečnosť", acceptedAnswers: ["varovanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/WWS_Warningsignal.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Warningsignal.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "5-minútová nahrávka; úvod neobsahuje jasný signál" },
  { id: "sk4-signalwhistle", label: "Signálna píšťala", emoji: "📯", category: "Doprava", acceptedAnswers: ["píšťalka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/97/WWS_SignallingWhistle.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_SignallingWhistle.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -11.6, reviewReason: "zameniteľné s píšťalkou rozhodcu" },
  { id: "sk4-firetruck-siren-inside", label: "Siréna z hasičského auta", emoji: "🚒", category: "Doprava", acceptedAnswers: ["hasiči"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8c/WWS_Firetruckssirenfrominside.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Firetruckssirenfrominside.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 2.9, reviewReason: "duplicitný koncept s „Hasičské auto“" },
  { id: "sk4-vacuumfan", label: "Priemyselný ventilátor", emoji: "💨", category: "Nástroje", acceptedAnswers: ["ventilátor"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/11/WWS_Vacuumfan.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Vacuumfan.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: -4.6, reviewReason: "hukot; nedá sa férovo určiť" },
  { id: "sk4-cutlerygrasp", label: "Chytenie príborov", emoji: "🍴", category: "Kuchyňa", acceptedAnswers: ["príbory"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Cutlery_grasp_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Cutlery_grasp_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 8.4, reviewReason: "0,5 s — príliš krátke na férové uhádnutie" },
  { id: "sk4-foldingchair", label: "Skladacia stolička", emoji: "🪑", category: "Záhrada", acceptedAnswers: ["rozkladanie stoličky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Open_and_close_folding_chair_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Open_and_close_folding_chair_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 7.2, reviewReason: "aj po normalizácii o 8.0 LU tichšie ako cieľ (−18 LUFS); krátke údery by bez agresívneho limitera nešlo zosilniť" },
  { id: "sk4-placespoon", label: "Položenie lyžice", emoji: "🥄", category: "Kuchyňa", acceptedAnswers: ["lyžica"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Place_spoon_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Place_spoon_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: -19.4, reviewReason: "duplicitný koncept s „Pád lyžice“" },
  { id: "sk4-stairsqueakup", label: "Vŕzgajúce schody (hore)", emoji: "🪜", category: "Domácnosť", acceptedAnswers: ["schody"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Squeaky_stairs_up_%28Gravity_Sound%29.wav", sourcePage: "https://commons.wikimedia.org/wiki/File:Squeaky_stairs_up_(Gravity_Sound).wav", credit: "Gravity Sound", license: "CC BY 4.0", gainDb: 10.0, reviewReason: "duplicitný koncept s „Vŕzgajúce schody“" },
  { id: "sk4-faucet", label: "Voda do drezu", emoji: "🚰", category: "Kuchyňa", acceptedAnswers: ["tečúca voda", "kohútik"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Faucet_water_into_sink.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Faucet_water_into_sink.ogg", credit: "stephan", license: "Public domain", gainDb: -1.3, reviewReason: "duplicitný koncept s „Pustenie vody z kohútika“" },
  { id: "sk5-pigoink", label: "Chrochtanie prasaťa", emoji: "🐖", category: "Zvieratá", acceptedAnswers: ["prasa", "chrochtanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/73/Mudchute_pig_1.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Mudchute_pig_1.ogg", credit: "Secretlondon", license: "CC BY-SA 3.0", reviewReason: "0,3 s — príliš krátke na férové uhádnutie" },
  { id: "sk5-goatbleat", label: "Mečanie kôz (2)", emoji: "🐐", category: "Zvieratá", acceptedAnswers: ["kozy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Herd_of_goats_bleating.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Herd_of_goats_bleating.ogg", credit: "stephan", license: "Public domain", gainDb: -3.0, reviewReason: "rovnaký súbor ako „Mečanie kôz“" },
  { id: "sk5-buttonhole", label: "Stroj na gombíkové dierky", emoji: "🧵", category: "Domácnosť", acceptedAnswers: ["šijací stroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/WWS_Buttonholemachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Buttonholemachine.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 5.9, reviewReason: "duplicitný koncept so „Šijací stroj“" },
  { id: "sk5-buttonsew", label: "Prišívanie gombíkov strojom", emoji: "🧵", category: "Domácnosť", acceptedAnswers: ["šijací stroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/WWS_Buttonsewingmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Buttonsewingmachine.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 5.4, reviewReason: "duplicitný koncept so „Šijací stroj“" },
  { id: "sk5-embroidery", label: "Vyšívací stroj", emoji: "🧵", category: "Domácnosť", acceptedAnswers: ["vyšívanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/WWS_Embroiderymachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Embroiderymachine.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 4.7, reviewReason: "duplicitný koncept so „Šijací stroj“" },
  { id: "sk5-fencemaking", label: "Stroj na pletivo", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["pletivo"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/31/WWS_Fencemakingmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Fencemakingmachine.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 10.1, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk5-leathercut", label: "Strihanie kože", emoji: "✂️", category: "Obchod", acceptedAnswers: ["nožnice", "krajčír"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/WWS_Glovemakerleathercutting1.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Glovemakerleathercutting1.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 5.3, reviewReason: "duplicitný koncept so „Strihanie nožnicami“" },
  { id: "sk5-gloveshape", label: "Tvarovanie rukavice", emoji: "🧤", category: "Obchod", acceptedAnswers: ["rukavičkár"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e6/WWS_Glovemakershapingaglove3.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Glovemakershapingaglove3.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 8.2, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk5-overheadloco", label: "Visutá dráha (2)", emoji: "🚝", category: "Doprava", acceptedAnswers: ["visutá železnica"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cc/WWS_Overheadrailwaylocomotivemoving.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Overheadrailwaylocomotivemoving.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 1.5, reviewReason: "duplicitný koncept s „Visutá dráha“" },
  { id: "sk5-ropemaking", label: "Výroba povrazu", emoji: "🪢", category: "Nástroje", acceptedAnswers: ["povraz"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c0/WWS_Ropemakingmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Ropemakingmachine.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 7.2, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk5-lacepins", label: "Paličkovanie čipky", emoji: "🪡", category: "Domácnosť", acceptedAnswers: ["čipka", "paličky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e7/WWS_Pinsusedforlacemaking.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Pinsusedforlacemaking.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 9.1, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk5-phoenixprint", label: "Starý tlačiarenský stroj", emoji: "🖨️", category: "Škola a kancelária", acceptedAnswers: ["tlačiareň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/WWS_PrintingmachinetypePhoenix.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_PrintingmachinetypePhoenix.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 9.0, reviewReason: "duplicitný koncept s „Tlačiarenský stroj“" },
  { id: "sk5-grafopress", label: "Tlačiarenský stroj (2)", emoji: "🖨️", category: "Škola a kancelária", acceptedAnswers: ["tlačiareň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dd/WWS_PrintingmachineGrafopress.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_PrintingmachineGrafopress.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 4.5, reviewReason: "duplicitný koncept s „Tlačiarenský stroj“" },
  { id: "sk5-ticketprint", label: "Tlač lístkov", emoji: "🎫", category: "Doprava", acceptedAnswers: ["tlač"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/WWS_EdmondsonTicketPrintingMachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_EdmondsonTicketPrintingMachine.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 5.1, reviewReason: "duplicitný koncept s „Tlačiarenský stroj“" },
  { id: "sk5-teleprinter-type", label: "Písanie na ďalekopise", emoji: "📠", category: "Technológie", acceptedAnswers: ["ďalekopis"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/46/WWS_Teleprintertyping.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Teleprintertyping.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 6.1, reviewReason: "duplicitný koncept s „Ďalekopis“" },
  { id: "sk5-polaroidload", label: "Vkladanie filmu do polaroidu", emoji: "📸", category: "Voľný čas", acceptedAnswers: ["polaroid"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cd/WWS_Polaroid1200i8211loadingcamera.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Polaroid1200i8211loadingcamera.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 23.9, startAt: 1.4, reviewReason: "duplicitný koncept s „Polaroid“" },
  { id: "sk5-super8plug", label: "Zapnutie premietačky", emoji: "🎥", category: "Voľný čas", acceptedAnswers: ["premietačka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/11/WWS_Super8MovieProjector8211Plugin.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Super8MovieProjector8211Plugin.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 7.7, reviewReason: "duplicitný koncept s „Kinoprojektor“" },
  { id: "sk5-super8rev", label: "Pretáčanie filmu", emoji: "🎥", category: "Voľný čas", acceptedAnswers: ["premietačka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/WWS_Super8MovieProjector8211Reverse.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Super8MovieProjector8211Reverse.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: -1.2, reviewReason: "duplicitný koncept s „Kinoprojektor“" },
  { id: "sk5-tram-standard", label: "Jazda električkou (2)", emoji: "🚊", category: "Doprava", acceptedAnswers: ["električka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/WWS_LHStandardtram8211carinterior.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_LHStandardtram8211carinterior.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 1.5, reviewReason: "duplicitný koncept s „Jazda električkou“" },
  { id: "sk5-trampivot", label: "Kĺb električky", emoji: "🚊", category: "Doprava", acceptedAnswers: ["električka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/WWS_102Ntrampivotingjoint.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_102Ntrampivotingjoint.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 6.7, reviewReason: "duplicitný koncept s „Jazda električkou“" },
  { id: "sk5-tram4ndoors", label: "Dvere električky (2)", emoji: "🚊", category: "Doprava", acceptedAnswers: ["električka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fe/WWS_Type4Ntramdoors.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Type4Ntramdoors.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 6.1, reviewReason: "duplicitný koncept s „Dvere električky“" },
  { id: "sk5-vaninterior", label: "Jazda v dodávke", emoji: "🚐", category: "Doprava", acceptedAnswers: ["dodávka", "jazda autom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c5/WWS_FSRTarpan233vancarinterior.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_FSRTarpan233vancarinterior.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 13.9, reviewReason: "hukot kabíny; nedá sa férovo určiť" },
  { id: "sk5-lathe-flywheel", label: "Sústruh (2)", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["sústruh"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/10/WWS_Metallatheusedtoproduceflywheels.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Metallatheusedtoproduceflywheels.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 1.1, reviewReason: "duplicitný koncept so „Sústruh“" },
  { id: "sk5-luthierchisel", label: "Rezbárske dláto", emoji: "🎻", category: "Nástroje", acceptedAnswers: ["dláto", "husliar"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dc/WWS_Woodchisellutherie.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Woodchisellutherie.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 5.0, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk5-luthierplane", label: "Husliarsky hoblík", emoji: "🎻", category: "Nástroje", acceptedAnswers: ["hoblík"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/WWS_Luthierplane.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Luthierplane.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 1.0, reviewReason: "duplicitný koncept s „Hobľovanie“" },
  { id: "sk5-luthierjoin", label: "Hobľovanie spoja", emoji: "🎻", category: "Nástroje", acceptedAnswers: ["hoblík"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/WWS_Joininglutherie.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Joininglutherie.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: -3.3, reviewReason: "duplicitný koncept s „Hobľovanie“" },
  { id: "sk6-alligator-hiss", label: "Syčanie aligátora", emoji: "🐊", category: "Zvieratá", acceptedAnswers: ["aligátor", "krokodíl"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Alligatorhiss.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Alligatorhiss.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain", gainDb: 15.0, reviewReason: "zameniteľné so syčaním hada; duplicitný koncept aligátora" },
  { id: "sk6-pelican-chick", label: "Mláďa pelikána", emoji: "🐦", category: "Zvieratá", acceptedAnswers: ["pelikán", "vtáča"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Baby_pelican.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Baby_pelican.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain", gainDb: 5.0, reviewReason: "neznámy zvuk; nedá sa férovo určiť" },
  { id: "sk6-tundraswans", label: "Labute", emoji: "🦢", category: "Príroda", acceptedAnswers: ["volanie labutí"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/48/Tundra_swans.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Tundra_swans.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain", gainDb: 15.0, reviewReason: "zameniteľné s husami" },
  { id: "sk6-woodpecker2", label: "Ďateľ (2)", emoji: "🐦", category: "Príroda", acceptedAnswers: ["ďateľ"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Woodpecker_tapping.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Woodpecker_tapping.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain", gainDb: 11.6, reviewReason: "duplicitný koncept s „Ďateľ“" },
  { id: "sk6-heronfish", label: "Volavka pri love", emoji: "🦆", category: "Príroda", acceptedAnswers: ["volavka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/Littleblueheronfishes.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Littleblueheronfishes.ogg", credit: "U.S. Fish and Wildlife Service", license: "Public domain", gainDb: 14.8, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk7-ketchup", label: "Otváranie kečupu", emoji: "🍅", category: "Kuchyňa", acceptedAnswers: ["kečup", "fľaša kečupu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Ketchup_bottle_opening_and_closing_screw_top.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Ketchup_bottle_opening_and_closing_screw_top.ogg", credit: "stephan", license: "Public domain", gainDb: 5.2, reviewReason: "skrutkovanie vrchnáka sa nedá férovo spojiť s kečupom" },
  { id: "sk7-garagedoor-open", label: "Otváranie garážovej brány", emoji: "🚪", category: "Domácnosť", acceptedAnswers: ["garáž", "garážová brána"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Garage_door_opening.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Garage_door_opening.ogg", credit: "ezwa", license: "Public domain", gainDb: 4.4, reviewReason: "duplicitný koncept so zatváraním garážovej brány" },
  { id: "sk7-schoolbell-old2", label: "Starý školský zvonec", emoji: "🔔", category: "Škola a kancelária", acceptedAnswers: ["zvonenie", "školský zvonec"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Old_school_bell_2.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Old_school_bell_2.ogg", credit: "ezwa", license: "Public domain", gainDb: 13.5, reviewReason: "duplicitný koncept so „Školský zvonec“" },
  { id: "sk7-tramdoors2", label: "Dvere električky s pípaním", emoji: "🚊", category: "Doprava", acceptedAnswers: ["električka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Tram_doors_open_and_close_hiss_and_beeping.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Tram_doors_open_and_close_hiss_and_beeping.ogg", credit: "stephan", license: "Public domain", gainDb: 6.1, reviewReason: "duplicitný koncept s „Dvere električky“" },
  { id: "sk7-deskdrawer", label: "Drevená zásuvka", emoji: "🗄️", category: "Škola a kancelária", acceptedAnswers: ["zásuvka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/Wooden_desk_drawer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Wooden_desk_drawer.ogg", credit: "hugh", license: "Public domain", gainDb: 10.2, startAt: 1.8, reviewReason: "duplicitný koncept s „Otvorenie zásuvky“" },
  { id: "sk7-wineglass", label: "Cinkanie pohára na víno", emoji: "🍷", category: "Voľný čas", acceptedAnswers: ["pohár", "sklo"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/71/Wine_glass.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Wine_glass.ogg", credit: "hugh", license: "Public domain", gainDb: 24.0, startAt: 1.7, reviewReason: "duplicitný koncept s „Cinknutie na pohár“" },
  { id: "sk7-snowglobe", label: "Snežítko", emoji: "❄️", category: "Voľný čas", acceptedAnswers: ["snehová guľa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Snow_globe_shaken.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Snow_globe_shaken.ogg", credit: "ezwa", license: "Public domain", gainDb: 24.0, reviewReason: "1,8 s — nedá sa férovo určiť" },
  { id: "sk7-retractpen", label: "Cvakanie pera", emoji: "🖊️", category: "Škola a kancelária", acceptedAnswers: ["pero", "guľôčkové pero"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/95/Retractable_pen_clickin.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Retractable_pen_clickin.ogg", credit: "stilgar", license: "Public domain", gainDb: 5.2, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -26.1 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk7-peelcarrot", label: "Škrabanie mrkvy", emoji: "🥕", category: "Kuchyňa", acceptedAnswers: ["mrkva", "škrabka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/90/Peeling_a_carrot.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Peeling_a_carrot.ogg", credit: "musicmaiden", license: "Public domain", gainDb: 7.6, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -25.0 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk7-peelorange", label: "Lúpanie pomaranča", emoji: "🍊", category: "Kuchyňa", acceptedAnswers: ["pomaranč"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/Peeling_an_orange.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Peeling_an_orange.ogg", credit: "russiandoll", license: "Public domain", gainDb: 16.6, reviewReason: "tiché šúchanie; nedá sa férovo určiť" },
  { id: "sk7-paperclips", label: "Sponky na papier", emoji: "📎", category: "Škola a kancelária", acceptedAnswers: ["kancelárske sponky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Paperclips_dropped_jangled.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Paperclips_dropped_jangled.ogg", credit: "hugh", license: "Public domain", gainDb: 12.9, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -26.5 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk7-chocolatebox", label: "Otváranie bonboniéry", emoji: "🍫", category: "Voľný čas", acceptedAnswers: ["bonboniéra", "čokoládky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/Opening_a_box_of_chocolates.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Opening_a_box_of_chocolates.ogg", credit: "ezwa", license: "Public domain", gainDb: 14.1, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -25.3 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk7-bumblebee", label: "Čmeliak", emoji: "🐝", category: "Príroda", acceptedAnswers: ["bzučanie čmeliaka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Hummel_bee.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Hummel_bee.ogg", credit: "soerena", license: "Public domain", gainDb: 1.5, reviewReason: "duplicitný koncept s „Bzučanie včiel“" },
  { id: "sk7-gulls-dawn", label: "Čajky", emoji: "🐦", category: "Príroda", acceptedAnswers: ["krik čajok", "more"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Gulls_above_the_street_at_dawn.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Gulls_above_the_street_at_dawn.ogg", credit: "earthcalling", license: "Public domain", gainDb: 15.0, reviewReason: "príliš tichá nahrávka (-40.2 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -25.2 LUFS" },
  { id: "sk7-dryfire", label: "Horiaca suchá tráva", emoji: "🔥", category: "Príroda", acceptedAnswers: ["oheň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Dry_grass_burning_in_open_fireplace.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Dry_grass_burning_in_open_fireplace.ogg", credit: "ezwa", license: "Public domain", gainDb: 13.3, reviewReason: "duplicitný koncept s „Praskajúci oheň“" },
  { id: "sk7-catseating", label: "Jediace mačky", emoji: "🐈", category: "Zvieratá", acceptedAnswers: ["mačka je", "mačky pri miske"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/da/Domestic_cats_eating.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Domestic_cats_eating.ogg", credit: "Marcus Kuerten", license: "Public domain", gainDb: 11.5, reviewReason: "aj po normalizácii o 7.5 LU tichšie ako cieľ (−18 LUFS); krátke údery by bez agresívneho limitera nešlo zosilniť" },
  { id: "sk7-cutlerytable", label: "Príbory na stole", emoji: "🍴", category: "Kuchyňa", acceptedAnswers: ["príbory"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Cutlery_on_table.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Cutlery_on_table.ogg", credit: "thore", license: "Public domain", gainDb: 2.2, reviewReason: "tretí záznam príborov" },
  { id: "sk7-chimingpottery", label: "Cinkanie keramiky", emoji: "🏺", category: "Domácnosť", acceptedAnswers: ["keramika", "hrnčeky"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Chiming_pottery.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Chiming_pottery.ogg", credit: "stephan", license: "Public domain", gainDb: 5.0, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk7-cameraclick", label: "Digitálny fotoaparát", emoji: "📷", category: "Technológie", acceptedAnswers: ["foťák", "fotenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/32/Canon_digital_ixus_55_normalized_turn_on_off_take_photo_press_buttons.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Canon_digital_ixus_55_normalized_turn_on_off_take_photo_press_buttons.ogg", credit: "qubodup", license: "Public domain", gainDb: 15.0, reviewReason: "príliš tichá nahrávka (-51.6 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -36.6 LUFS" },
  { id: "sk7-wharfannounce", label: "Hlásenie v prístave", emoji: "🚢", category: "Doprava", acceptedAnswers: ["hlásenie", "amplión"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Announcement_on_a_wharf.oga", sourcePage: "https://commons.wikimedia.org/wiki/File:Announcement_on_a_wharf.oga", credit: "ezwa", license: "Public domain", gainDb: 12.1, reviewReason: "2,7 s — nedá sa férovo určiť" },
  { id: "sk7-bbq", label: "Grilovanie", emoji: "🍖", category: "Voľný čas", acceptedAnswers: ["gril", "grilovačka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Barbecue.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Barbecue.ogg", credit: "aldor", license: "Public domain", gainDb: 2.9, reviewReason: "aj po normalizácii o 6.4 LU tichšie ako cieľ (−18 LUFS); krátke údery by bez agresívneho limitera nešlo zosilniť" },
  { id: "sk7-crackpeanuts", label: "Lúskanie arašidov", emoji: "🥜", category: "Kuchyňa", acceptedAnswers: ["arašidy"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/Cracking_peanuts.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Cracking_peanuts.ogg", credit: "stephan", license: "Public domain", gainDb: 9.7, reviewReason: "duplicitný koncept s „Lúskanie orechov“" },
  { id: "sk7-coinsjingle", label: "Cinkanie mincí", emoji: "🪙", category: "Každodenné situácie", acceptedAnswers: ["mince"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f3/English_coins.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:English_coins.ogg", credit: "cori", license: "Public domain", gainDb: -4.9, reviewReason: "duplicitný koncept s „Mešec mincí“" },
  { id: "sk7-hydrauliclift-up", label: "Hydraulický zdvihák (hore)", emoji: "🔧", category: "Nástroje", acceptedAnswers: ["zdvihák"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Hydraulic_lift_pushing_up.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Hydraulic_lift_pushing_up.ogg", credit: "stephan", license: "Public domain", gainDb: 4.2, reviewReason: "duplicitný koncept s „Hydraulický zdvihák“" },
  { id: "sk7-metalbox-spring", label: "Otvorenie kovovej krabičky", emoji: "📦", category: "Každodenné situácie", acceptedAnswers: ["krabička"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Metal_box_springs_open.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Metal_box_springs_open.ogg", credit: "stephan", license: "Public domain", gainDb: 3.9, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk7-oldbook", label: "Listovanie v knihe", emoji: "📖", category: "Škola a kancelária", acceptedAnswers: ["kniha", "listovanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Old_book.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Old_book.ogg", credit: "cori", license: "Public domain", gainDb: 13.0, startAt: 1.8, reviewReason: "duplicitný koncept s „Otočenie strany“" },
  { id: "sk7-sawtoiletroll", label: "Rezanie kartónovej rolky", emoji: "🧻", category: "Domácnosť", acceptedAnswers: ["kartón"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/Sawing_an_empty_toilet_paper_roll.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Sawing_an_empty_toilet_paper_roll.ogg", credit: "qubodup", license: "Public domain", gainDb: -0.8, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk7-shakegel", label: "Trasenie fľašou", emoji: "🧴", category: "Domácnosť", acceptedAnswers: ["fľaša", "gél"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Shaking_a_bottle_of_gel.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Shaking_a_bottle_of_gel.ogg", credit: "stephan", license: "Public domain", gainDb: 5.3, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk7-sharpenpencil", label: "Strúhanie ceruzky", emoji: "✏️", category: "Škola a kancelária", acceptedAnswers: ["strúhadlo", "ceruzka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Sharpening_pencil.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Sharpening_pencil.ogg", credit: "stephan", license: "Public domain", gainDb: 8.3, reviewReason: "aj po normalizácii výrazne tichšie ako ostatné zvuky (najhlasnejší moment -23.2 LUFS); ide o krátke tiché transienty a ďalšie zosilnenie by vyžadovalo agresívny limiter" },
  { id: "sk7-slowapplause", label: "Rozbiehajúci sa potlesk", emoji: "👏", category: "Voľný čas", acceptedAnswers: ["potlesk"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Slow_starting_applause.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Slow_starting_applause.ogg", credit: "stephan", license: "Public domain", gainDb: 5.3, reviewReason: "duplicitný koncept s „Potlesk“" },
  { id: "sk7-snowglobeturn", label: "Otočenie snežítka", emoji: "❄️", category: "Voľný čas", acceptedAnswers: ["snežítko"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Snow_globe_turned_around.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Snow_globe_turned_around.ogg", credit: "ezwa", license: "Public domain", gainDb: 15.0, reviewReason: "2 s — nedá sa férovo určiť" },
  { id: "sk7-bellstrike", label: "Úder do malého zvona", emoji: "🔔", category: "Voľný čas", acceptedAnswers: ["zvon", "zvonček"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Striking_a_bell_15cm_large.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Striking_a_bell_15cm_large.ogg", credit: "stephan", license: "Public domain", gainDb: 1.9, reviewReason: "duplicitný koncept s „Úder do zvona“" },
  { id: "sk7-dialtone2", label: "Tónová voľba", emoji: "☎️", category: "Technológie", acceptedAnswers: ["vytáčanie čísla", "telefón"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Tone_dialling_phone_germany.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Tone_dialling_phone_germany.ogg", credit: "stephan", license: "Public domain", gainDb: 5.0, reviewReason: "duplicitný koncept s „Vytáčanie čísla na telefóne“" },
  { id: "sk7-trainstation", label: "Železničná stanica", emoji: "🚉", category: "Doprava", acceptedAnswers: ["vlaky na stanici", "nádražie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Trains_through_a_railwa.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Trains_through_a_railwa.ogg", credit: "ezwa", license: "Public domain", gainDb: 15.0, reviewReason: "príliš tichá nahrávka (-50.6 LUFS); bezpečné zosilnenie (bez zvýraznenia šumu) dosiahne iba -35.6 LUFS" },
  { id: "sk7-huntpeck", label: "Pomalé písanie na klávesnici", emoji: "⌨️", category: "Technológie", acceptedAnswers: ["písanie jedným prstom"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Typing_hunt_and_peck.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Typing_hunt_and_peck.ogg", credit: "teto_yasha", license: "Public domain", gainDb: 17.8, startAt: 2.8, reviewReason: "duplicitný koncept s „Písanie na klávesnici“" },
  { id: "sk7-inkpen", label: "Písanie perom", emoji: "🖋️", category: "Škola a kancelária", acceptedAnswers: ["pero", "plniace pero"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Writing_with_inkpen.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:Writing_with_inkpen.ogg", credit: "stephan", license: "Public domain", gainDb: 15.0, reviewReason: "duplicitný koncept s „Písanie fixkou“" },
  { id: "sk8-coalcrane", label: "Žeriav na uhlie", emoji: "🏗️", category: "Nástroje", acceptedAnswers: ["žeriav"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fd/WWS_Coalcrane.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Coalcrane.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 4.1, reviewReason: "duplicitný koncept s inými žeriavmi" },
  { id: "sk8-containerstacker", label: "Prekladač kontajnerov", emoji: "🏗️", category: "Doprava", acceptedAnswers: ["prístav", "kontajnery"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/97/WWS_Containerreachstackers.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Containerreachstackers.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 15.3, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk8-conveyorbelt", label: "Dopravníkový pás", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["dopravník"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/WWS_Conveyorbelt.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Conveyorbelt.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 2.6, reviewReason: "hukot; nedá sa férovo určiť" },
  { id: "sk8-planecutter", label: "Hobľovačka", emoji: "🪵", category: "Nástroje", acceptedAnswers: ["hobľovanie dreva"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/WWS_Cutter.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Cutter.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "duplicitný koncept s „Hobľovanie“" },
  { id: "sk8-fireman-stoker", label: "Kurič v lokomotíve", emoji: "🚂", category: "Doprava", acceptedAnswers: ["parná lokomotíva", "hádzanie uhlia"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/WWS_Firemanstokeratworkinasteamlocomotive.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Firemanstokeratworkinasteamlocomotive.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -4.3, reviewReason: "duplicitný koncept s „Hádzanie uhlia lopatou“" },
  { id: "sk8-firetruck-1958", label: "Staré hasičské auto", emoji: "🚒", category: "Doprava", acceptedAnswers: ["hasičská siréna"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/WWS_FiretruckFordF600-19588211sirens.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_FiretruckFordF600-19588211sirens.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: -6.3, reviewReason: "štvrtá hasičská siréna v databáze" },
  { id: "sk8-flyer", label: "Spriadací stroj", emoji: "🧵", category: "Nástroje", acceptedAnswers: ["pradenie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/WWS_Flyer.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Flyer.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 6.5, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk8-francisturbine", label: "Vodná turbína", emoji: "💧", category: "Príroda", acceptedAnswers: ["turbína"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/64/WWS_FrancisTurbine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_FrancisTurbine.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -1.6, reviewReason: "duplicitný koncept s „Vodná elektráreň“" },
  { id: "sk8-hardomini", label: "Strihací stroj", emoji: "✂️", category: "Obchod", acceptedAnswers: ["stroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/WWS_HardoSuper-mini.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_HardoSuper-mini.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 0.9, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk8-icebreakerbell", label: "Poplach na lodi", emoji: "🚢", category: "Doprava", acceptedAnswers: ["lodný zvon", "poplach"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cd/WWS_IcebreakerKunaalarmbell.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_IcebreakerKunaalarmbell.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: -3.2, reviewReason: "duplicitný koncept s „Lodný zvon“" },
  { id: "sk8-maudslay", label: "Historický parný stroj", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["parný stroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/WWS_Maudslayengine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Maudslayengine.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 3.7, reviewReason: "duplicitný koncept s „Parný stroj“" },
  { id: "sk8-milkreceiver", label: "Zberač mlieka", emoji: "🐄", category: "Príroda", acceptedAnswers: ["dojáreň"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/WWS_MilkReceiver.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_MilkReceiver.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: -2.8, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk8-minetelephone", label: "Banský telefón", emoji: "☎️", category: "Technológie", acceptedAnswers: ["telefón"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c4/WWS_Minetelephone.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Minetelephone.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -4.2, reviewReason: "duplicitný koncept so „Zvonenie starého telefónu“" },
  { id: "sk8-mortiser", label: "Dlabačka", emoji: "🪵", category: "Nástroje", acceptedAnswers: ["dlabanie dreva"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b2/WWS_Mortiser.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Mortiser.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 7.8, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk8-tomos", label: "Štartovanie mopedu", emoji: "🛵", category: "Doprava", acceptedAnswers: ["moped", "motorka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/WWS_MotorcycleTOMOSColibrispecialD-3.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_MotorcycleTOMOSColibrispecialD-3.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: 6.0, reviewReason: "duplicitný koncept s „Moped“" },
  { id: "sk8-loom2", label: "Tkáčsky stav (2)", emoji: "🧵", category: "Domácnosť", acceptedAnswers: ["tkanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8f/WWS_Narrowshuttleloom.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Narrowshuttleloom.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 5.1, reviewReason: "duplicitný koncept s „Tkáčsky stav“" },
  { id: "sk8-pneumaticchainsaw", label: "Pneumatická píla", emoji: "🪚", category: "Nástroje", acceptedAnswers: ["píla"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/WWS_Pneumaticchainsaw.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Pneumaticchainsaw.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -6.2, reviewReason: "duplicitný koncept s „Motorová píla“" },
  { id: "sk8-pneumaticlamp", label: "Pneumatická lampa", emoji: "💡", category: "Nástroje", acceptedAnswers: ["lampa"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f9/WWS_Pneumaticlamp.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Pneumaticlamp.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: -4.8, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk8-rodcutter", label: "Strihanie tyčí", emoji: "✂️", category: "Nástroje", acceptedAnswers: ["strihanie kovu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1b/WWS_Rodcutter.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Rodcutter.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 1.7, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk8-shaper", label: "Frézovanie dreva", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["fréza"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/34/WWS_Shaper.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Shaper.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: -2.5, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk8-sheetcutter", label: "Rezačka kartónu", emoji: "✂️", category: "Nástroje", acceptedAnswers: ["rezačka"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/WWS_Sheetcutter.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Sheetcutter.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 1.7, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk8-forgeshovel", label: "Uhlie do vyhne", emoji: "🔥", category: "Nástroje", acceptedAnswers: ["lopata"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/31/WWS_Shovelandbucketforge.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Shovelandbucketforge.ogg", credit: "Work With Sounds / La Fonderie", license: "CC BY 4.0", gainDb: 4.1, reviewReason: "duplicitný koncept s „Hádzanie uhlia lopatou“" },
  { id: "sk8-slitmachine", label: "Rezačka plechu", emoji: "✂️", category: "Nástroje", acceptedAnswers: ["rezanie plechu"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/31/WWS_Slitmachine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Slitmachine.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 6.2, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk8-smallwaves", label: "Vlny v prístave", emoji: "🌊", category: "Príroda", acceptedAnswers: ["vlny", "more"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ad/WWS_Smallwaves.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Smallwaves.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 17.2, reviewReason: "duplicitný koncept s „Vlny na brehu“" },
  { id: "sk8-tankcleaner", label: "Čistenie nádrže", emoji: "🧽", category: "Nástroje", acceptedAnswers: ["čistiaci stroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/WWS_TANKCLEANER.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_TANKCLEANER.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -1.1, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk8-grandjunction", label: "Obrovský parný stroj", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["parný stroj"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a3/WWS_TheGrandJunction90inchengine.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_TheGrandJunction90inchengine.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 4.9, reviewReason: "duplicitný koncept s „Parný stroj“" },
  { id: "sk8-thicknessplaner", label: "Hrúbkovačka", emoji: "🪵", category: "Nástroje", acceptedAnswers: ["hobľovanie"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/18/WWS_Thicknessplaner.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Thicknessplaner.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 17.5, reviewReason: "duplicitný koncept s „Hobľovanie“" },
  { id: "sk8-tractorursus", label: "Starý traktor", emoji: "🚜", category: "Doprava", acceptedAnswers: ["traktor"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/54/WWS_TractorUrsusC-45.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_TractorUrsusC-45.ogg", credit: "Work With Sounds / Museum of Municipal Engineering", license: "CC BY 4.0", gainDb: 10.7, reviewReason: "duplicitný koncept s „Traktor“" },
  { id: "sk8-oresundbridge", label: "Vlak na moste", emoji: "🚆", category: "Doprava", acceptedAnswers: ["vlak"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/54/WWS_TrainoverresundBridge.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_TrainoverresundBridge.ogg", credit: "Work With Sounds / Torsten Nilsson", license: "CC BY 4.0", gainDb: 2.6, reviewReason: "duplicitný koncept s „Jazda vlakom“" },
  { id: "sk8-chainconveyor", label: "Reťazový dopravník", emoji: "⚙️", category: "Nástroje", acceptedAnswers: ["dopravník"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/WWS_Two-chainconveyorinoperation.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Two-chainconveyorinoperation.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -1.9, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk8-ultrasoniccleaner", label: "Ultrazvuková čistička", emoji: "🧼", category: "Nástroje", acceptedAnswers: ["čistička"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/07/WWS_UltrasonicCleaner.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_UltrasonicCleaner.ogg", credit: "Work With Sounds / Werstas", license: "CC BY 4.0", gainDb: 15.0, reviewReason: "podľa zvuku sa nedá férovo určiť" },
  { id: "sk8-ventfan", label: "Ventilátor", emoji: "💨", category: "Nástroje", acceptedAnswers: ["ventilácia"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/db/WWS_Ventilationfan.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Ventilationfan.ogg", credit: "Work With Sounds / Technical Museum of Slovenia", license: "CC BY 4.0", gainDb: -1.0, reviewReason: "hukot; nedá sa férovo určiť" },
  { id: "sk8-wireloom", label: "Tkanie drôtu", emoji: "🧵", category: "Nástroje", acceptedAnswers: ["tkáčsky stav"], audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/WWS_Wireweavingloom.ogg", sourcePage: "https://commons.wikimedia.org/wiki/File:WWS_Wireweavingloom.ogg", credit: "Work With Sounds / Konrad Gutkowski", license: "CC BY 4.0", gainDb: 5.4, reviewReason: "duplicitný koncept s „Tkáčsky stav“" },
];

/**
 * Kurátorský zoznam konkrétnych slovenských zvukov, ktoré ešte nemajú
 * priradenú nahrávku. Zámerne NIE JE súčasťou `SOUND_CLUES`: hra pri
 * nefunkčnom zdroji zvuku nezobrazí ďalšiu otázku, len chybu, takže položka
 * bez overenej nahrávky by pokazila kolo. Slúži ako pripravený obsah — po
 * doplnení `audioUrl` sa položka presunie medzi hrateľné.
 */
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
  ...EXPANDED_SOUND_CLUES_7,
];

/**
 * Zvuky v jazyku hry. Nahrávky sú rovnaké, prekladá sa len názov, kategória
 * a alternatívne odpovede (i18n/content/en/sound.json podľa `id`).
 */
const SOUND_CLUES_BY_LANGUAGE = new Map<AppLanguage, SoundClue[]>();

export function getSoundCluesForLanguage(language: AppLanguage): SoundClue[] {
  if (!hasContentLocale(language)) return SOUND_CLUES;
  let clues = SOUND_CLUES_BY_LANGUAGE.get(language);
  if (!clues) {
    clues = SOUND_CLUES.map((clue) => {
      const text = soundTextFor(clue.id, language);
      return text ? { ...clue, label: text.label, category: text.category ?? clue.category, acceptedAnswers: text.acceptedAnswers } : clue;
    });
    SOUND_CLUES_BY_LANGUAGE.set(language, clues);
  }
  return clues;
}

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

/** Kategórie hry „Na písmeno" v jazyku hry; kategórie bez prekladu sa vynechajú. */
export function getLetterChallengesForLanguage(language: AppLanguage): LetterChallenge[] {
  if (!hasContentLocale(language)) return LETTER_CHALLENGES;
  return LETTER_CHALLENGES.flatMap((challenge) => {
    const category = localizeContent("letter", challenge.category, language);
    return category === null ? [] : [{ ...challenge, category }];
  });
}

/**
 * Zadania „Vymenuj päť…" v jazyku hry. Slovenské reálie a rýmy na slovenské
 * slová v angličtine vypadnú (prázdny preklad v mape).
 */
export function getFiveInTenPromptsForLanguage(language: AppLanguage): string[] {
  return localizeList("fiveInTen", FIVE_IN_TEN_PROMPTS, language);
}

