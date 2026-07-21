import { shuffle } from "./teamBattle";

export interface ForbiddenCard {
  word: string;
  forbidden: [string, string, string, string];
}

export const FORBIDDEN_CARDS: ForbiddenCard[] = [
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

export const SONG_TITLES = [
  "V dolinách", "Mám ťa rád", "Po schodoch", "Voda, čo ma drží nad vodou", "Čerešne",
  "Reklama na ticho", "Sme svoji", "Nie sme zlí", "Atlantída", "Vyznanie",
  "Úsmev", "Láska, necestuj tým vlakom", "Ak nie si moja", "Biely kvet", "Cesta",
  "Hej, sokoly", "Macejko", "Na Kráľovej holi", "Tancuj, tancuj, vykrúcaj", "A ja taká dzivočka",
  "Prší, prší", "Kukulienka, kde si bola", "Červený kacheľ", "Dedinka v údolí", "Slovenské mamičky",
  "Shape of You", "Perfect", "Rolling in the Deep", "Someone Like You", "Hello",
  "Blinding Lights", "Save Your Tears", "Dance Monkey", "Flowers", "Happy",
  "Uptown Funk", "Counting Stars", "Believer", "Thunder", "Radioactive",
  "Bad Guy", "Levitating", "Havana", "Senorita", "Cheap Thrills",
  "Roar", "Firework", "Poker Face", "Bad Romance", "Just Dance",
  "Shake It Off", "Blank Space", "Love Story", "As It Was", "Watermelon Sugar",
  "Viva La Vida", "Yellow", "The Scientist", "Wake Me Up", "Levels",
  "Despacito", "Waka Waka", "Whenever, Wherever", "Ai Se Eu Te Pego", "Macarena",
  "I Want It That Way", "Everybody", "Oops!... I Did It Again", "Baby One More Time", "Toxic",
  "Wannabe", "Barbie Girl", "Blue (Da Ba Dee)", "Dragostea Din Tei", "Freed from Desire",
  "We Will Rock You", "We Are the Champions", "Another One Bites the Dust", "Bohemian Rhapsody", "Don't Stop Me Now",
  "Billie Jean", "Beat It", "Thriller", "I Will Survive", "Dancing Queen",
  "Mamma Mia", "Stayin' Alive", "Eye of the Tiger", "The Final Countdown", "Take on Me",
  "Summer of '69", "Livin' on a Prayer", "Sweet Child o' Mine", "Zombie", "Wonderwall",
  "Let It Be", "Hey Jude", "Yesterday", "Don't Worry, Be Happy", "What Is Love",
  "Gangnam Style", "Baby Shark", "Let It Go", "Hakuna Matata", "Can You Feel the Love Tonight",
];

export interface SoundClue {
  id: string;
  label: string;
  emoji: string;
}

export const SOUND_CLUES: SoundClue[] = [
  { id: "engine", label: "Motor auta", emoji: "🚗" },
  { id: "cat", label: "Mačka", emoji: "🐈" },
  { id: "vacuum", label: "Vysávač", emoji: "🧹" },
  { id: "can", label: "Otvorenie plechovky", emoji: "🥫" },
  { id: "dog", label: "Štekajúci pes", emoji: "🐕" },
  { id: "rain", label: "Dážď", emoji: "🌧️" },
  { id: "siren", label: "Policajná siréna", emoji: "🚓" },
  { id: "clock", label: "Tikajúce hodiny", emoji: "⏰" },
  { id: "doorbell", label: "Zvonček pri dverách", emoji: "🔔" },
  { id: "phone", label: "Zvonenie telefónu", emoji: "📱" },
  { id: "train", label: "Vlak", emoji: "🚆" },
  { id: "heartbeat", label: "Búšenie srdca", emoji: "❤️" },
  { id: "helicopter", label: "Vrtuľník", emoji: "🚁" },
  { id: "microwave", label: "Mikrovlnka", emoji: "📟" },
  { id: "keyboard", label: "Písanie na klávesnici", emoji: "⌨️" },
  { id: "camera", label: "Fotoaparát", emoji: "📷" },
  { id: "alarm", label: "Budík", emoji: "⏰" },
  { id: "wind", label: "Silný vietor", emoji: "🌬️" },
  { id: "laser", label: "Laser z videohry", emoji: "👾" },
  { id: "applause", label: "Potlesk", emoji: "👏" },
  { id: "horse", label: "Cválajúci kôň", emoji: "🐎" },
  { id: "fire", label: "Praskajúci oheň", emoji: "🔥" },
  { id: "bird", label: "Spievajúci vták", emoji: "🐦" },
  { id: "water", label: "Tečúca voda", emoji: "🚰" },
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

export const FIVE_IN_TEN_PROMPTS = [
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
