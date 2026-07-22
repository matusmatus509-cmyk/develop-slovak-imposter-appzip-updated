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
`;

export const SONG_CARDS: SongCard[] = SONG_LIBRARY.trim().split("\n").map((line) => {
  const [title, artist] = line.split("|");
  return { title: title.trim(), artist: artist.trim() };
});

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
