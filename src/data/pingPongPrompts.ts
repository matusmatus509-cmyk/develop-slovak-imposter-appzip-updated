const STARTING_LETTERS = [
  "A", "B", "C", "Č", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "R", "S", "Š", "T", "U", "V", "Z", "Ž",
];

const PLACES = [
  "taške", "škole", "kuchyni", "kúpeľni", "spálni", "obývačke", "garáži", "pivnici",
  "aute", "autobuse", "vlaku", "lietadle", "obchode", "supermarkete", "lekárni", "nemocnici",
  "knižnici", "kine", "divadle", "reštaurácii", "kaviarni", "hoteli", "na letisku", "na stanici",
  "na ihrisku", "v parku", "na pláži", "pri bazéne", "na horách", "v lese", "v zoo", "na farme",
  "v kancelárii", "v posilňovni", "v kaderníctve", "v práčovni", "v chladničke", "v mrazničke",
  "v peňaženke", "na pracovnom stole", "v detskej izbe", "na stavbe",
];

const PACKING_PROMPTS = [
  "Veci, ktoré si berieš na dovolenku", "Veci, ktoré si berieš do školy",
  "Veci, ktoré si berieš na výlet", "Veci, ktoré si berieš na kúpalisko",
  "Veci, ktoré si berieš do dažďa", "Veci, ktoré si berieš v zime",
  "Veci, ktoré si berieš na piknik", "Veci, ktoré si berieš do posilňovne",
  "Veci, ktoré si berieš do tábora", "Veci, ktoré si berieš na prespanie",
  "Veci, ktoré si berieš na cestu lietadlom", "Veci, ktoré si berieš na turistiku",
  "Veci, ktoré si berieš na lyžovačku", "Veci, ktoré si berieš na nákupy",
];

const TOPICS = [
  "Farby", "Tvary", "Materiály", "Veci vyrobené z dreva", "Veci vyrobené z kovu",
  "Veci vyrobené zo skla", "Veci vyrobené z papiera", "Veci, ktoré sú mäkké",
  "Veci, ktoré sú tvrdé", "Veci, ktoré sú okrúhle", "Veci, ktoré sú hranaté",
  "Veci, ktoré sú žlté", "Veci, ktoré sú zelené", "Veci, ktoré sú sladké",
  "Veci, ktoré sú kyslé", "Veci, ktoré sú slané", "Veci, ktoré sú pálivé", "Ovocie",
  "Zelenina", "Bylinky a koreniny", "Sladkosti", "Pečivo", "Polievky", "Syry", "Nápoje",
  "Teplé nápoje", "Jedlá na raňajky", "Jedlá na obed", "Jedlá na večeru", "Jedlá na oslavu",
  "Veci, ktoré vieš grilovať", "Veci, ktoré môžeš piecť", "Zvieratá", "Domáce zvieratá",
  "Zvieratá zo zoo", "Zvieratá z farmy", "Zvieratá žijúce v lese", "Zvieratá žijúce v mori",
  "Vtáky", "Hmyz", "Plazy", "Rastliny", "Stromy", "Kvety", "Huby", "Počasie",
  "Ročné obdobia", "Veci spojené s letom", "Veci spojené so zimou", "Veci spojené s Vianocami",
  "Veci spojené s Veľkou nocou", "Školské predmety", "Povolania", "Športy",
  "Loptičkové športy", "Zimné športy", "Hudobné nástroje", "Hudobné žánre", "Filmy a seriály",
  "Rozprávkové postavy", "Superhrdinovia", "Elektronika", "Dopravné prostriedky", "Značky áut",
  "Veci, ktoré majú kolesá", "Veci, ktoré lietajú", "Veci, ktoré plávajú", "Veci, ktoré sa dajú otvoriť",
  "Veci, ktoré sa dajú zavrieť", "Veci, ktoré sa dajú rozbiť", "Veci, ktoré sa dajú nafúknuť",
  "Veci, ktoré vydávajú zvuk", "Veci, ktoré svietia", "Veci, ktoré vonia",
  "Veci, ktoré môžeš zjesť rukami", "Veci, ktoré môžeš darovať", "Darčeky k narodeninám",
  "Veci na oslavu", "Veci na svadbu", "Veci na rande", "Veci, ktoré robíš ráno",
  "Veci, ktoré robíš večer", "Veci, ktoré robíš cez víkend", "Veci, ktoré robíš cez prázdniny",
  "Veci, ktoré robíš pri chorobe", "Veci, ktoré robíš, keď prší", "Veci, ktoré robíš, keď sa nudíš",
  "Veci, ktoré robíš pred spaním", "Veci, ktoré robíš po zobudení", "Veci, ktoré ťa rozosmejú",
  "Veci, ktoré ťa vystrašia", "Veci, ktoré ťa nahnevajú", "Veci, ktoré ťa potešia",
  "Slová spojené s láskou", "Slová spojené s cestovaním", "Slová spojené s vesmírom",
  "Slová spojené s počítačom", "Slová spojené s kuchyňou", "Slová spojené so športom",
  "Slová spojené s prírodou", "Slová spojené s mestom", "Slová spojené s dedinou",
  "Slová spojené s vodou", "Slová spojené s ohňom", "Slová spojené s časom",
  "Veci, ktoré sú drahé", "Veci, ktoré sú lacné", "Veci, ktoré sú veľké", "Veci, ktoré sú malé",
  "Veci, ktoré sú rýchle", "Veci, ktoré sú pomalé", "Veci na Mesiaci", "Veci pod vodou",
  "Veci v rozprávke", "Veci na opustenom ostrove",
];

export const PING_PONG_PROMPTS: string[] = [
  ...STARTING_LETTERS.map((letter) => `Slová na ${letter}`),
  "Mená na A",
  "Mená na M",
  "Mená na P",
  "Mestá na B",
  "Mestá na K",
  "Krajiny na S",
  "Zvieratá na K",
  "Jedlá na P",
  ...PLACES.map((place) => `Veci, ktoré nájdeš ${place.startsWith("na ") ? place : `v ${place}`}`),
  ...PACKING_PROMPTS,
  ...TOPICS,
];
