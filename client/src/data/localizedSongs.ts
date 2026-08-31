import type { AppLanguage } from "../i18n/LanguageProvider";
import {
  FRENCH_SONG_EXPANSION,
  GERMAN_SONG_EXPANSION,
} from "./songExpansions/germanAndFrench";
import {
  CZECH_SONG_EXPANSION,
  SLOVAK_SONG_EXPANSION,
} from "./songExpansions/slovakAndCzech";
import {
  PORTUGUESE_SONG_EXPANSION,
  SPANISH_SONG_EXPANSION,
} from "./songExpansions/spanishAndPortuguese";
import {
  ENGLISH_SONG_EXPANSION,
  WORLD_SONG_ARTIST_LANGUAGES,
  WORLD_SONG_EXPANSION,
} from "./songExpansions/worldAndEnglish";
import type { SongCard } from "./teamBattleExtras";

/**
 * ── Hudobný katalóg ─────────────────────────────────────────────────────────
 *
 * Formát riadku je `Názov|Interpret` a voliteľne ďalšie stĺpce:
 *
 *   Názov|Interpret
 *   Názov|Interpret|Rok|Žáner|Náročnosť|Príznaky
 *
 * Staršie dvojstĺpcové riadky zostávajú platné — metadáta zdedia od sekcie,
 * takže rozšírenie katalógu nevyžaduje prepísanie už zapísaných skladieb.
 *
 * Príznaky (oddelené medzerou):
 *   hum / nohum   — melódia sa dá / nedá zahmkať bez textu
 *   lang=xx       — spievaný jazyk, ak sa líši od sekcie (napr. Nena v svetovom poole)
 *   region=XX     — krajina či región (napr. region=AT)
 */

/** Jazyk, v ktorom sa skladba spieva. Je širší ako `AppLanguage` — hra po
 *  slovensky má zmysel dopĺňať českými skladbami, hoci čeština nie je jazyk UI. */
export type SongLanguage =
  | "en" | "sk" | "cs" | "de" | "es" | "fr" | "pt"
  | "it" | "sv" | "pl" | "hu" | "nl" | "instrumental" | "other";

export type SongGenre =
  | "pop" | "rock" | "rap" | "rnb" | "soul" | "dance" | "indie" | "disco" | "funk"
  | "metal" | "punk" | "soundtrack" | "folk" | "country" | "oldies"
  | "schlager" | "chanson" | "latin" | "reggae" | "jazz";

/** Ako ľahko skladbu spozná priemerný hráč. */
export type SongTier = "easy" | "medium" | "hard";

export interface Song extends SongCard {
  /** Stabilné id — nezávisí od sekcie ani od poradia, takže tú istú skladbu
   *  spoľahlivo rozpoznáme aj keby bola vo viacerých pooloch. */
  id: string;
  /** Normalizovaný interpret — kľúč pre cooldown interpreta. */
  artistKey: string;
  language: SongLanguage;
  year?: number;
  /** Dekáda odvodená z roku, napr. „80s". */
  decade?: string;
  genre?: SongGenre;
  tier: SongTier;
  /** Skladba je rozpoznateľná podľa melódie, nie podľa textu. */
  hummable: boolean;
  region?: string;
  scope: "global" | "local";
}

interface SectionDefaults {
  language: SongLanguage;
  scope: "global" | "local";
  region?: string;
  /** Voliteľné explicitné prepisy jazyka podľa normalizovaného interpreta. */
  artistLanguages?: Readonly<Record<string, SongLanguage>>;
}

const GENRES = new Set<string>([
  "pop", "rock", "rap", "rnb", "soul", "dance", "indie", "disco", "funk",
  "metal", "punk", "soundtrack", "folk", "country", "oldies",
  "schlager", "chanson", "latin", "reggae", "jazz",
]);
const TIERS = new Set<string>(["easy", "medium", "hard"]);
const SONG_LANGUAGES = new Set<string>([
  "en", "sk", "cs", "de", "es", "fr", "pt",
  "it", "sv", "pl", "hu", "nl", "instrumental", "other",
]);

/** Rap a spoken-word sa hádajú podľa textu, nie podľa melódie. */
const LYRIC_DRIVEN_GENRES = new Set<SongGenre>(["rap"]);

/**
 * Metadáta na úrovni interpreta. Doplnia žáner a náročnosť tým skladbám, ktoré
 * ich nemajú uvedené v riadku — teda celej pôvodnej zásobe, bez toho, aby sme
 * museli prepísať tisíc riadkov.
 *
 * Rapoví interpreti sú tu hlavne preto, aby „Zahmkaj pesničku" nedostala
 * skladbu, ktorú sa nedá zahmkať. Náročnosť `easy` nesú interpreti, ktorých
 * pozná naozaj každý.
 */
const ARTIST_PROFILES: Record<string, { genre?: SongGenre; tier?: SongTier }> = {};

function profileArtists(
  artists: readonly string[],
  profile: { genre?: SongGenre; tier?: SongTier },
) {
  for (const artist of artists) {
    const key = normalizeArtistKey(artist);
    ARTIST_PROFILES[key] = { ...ARTIST_PROFILES[key], ...profile };
  }
}

// Rap a hip-hop — rozpoznanie stojí na texte, nie na melódii.
profileArtists(
  [
    "2Pac", "50 Cent", "Eminem", "Jay-Z", "Kanye West", "Snoop Dogg",
    "Snoop Dogg & Wiz Khalifa", "The Notorious B.I.G.", "Outkast",
    "Macklemore & Ryan Lewis", "Nicki Minaj", "Drake", "Kendrick Lamar",
    "Kali", "Rytmus", "Kontrafakt", "Majk Spirit", "Sima", "Separ", "Ego",
    "Sido", "BONEZ MC", "Apache 207", "Cro", "Fettes Brot", "Marteria",
    "Alligatoah", "Ski Aggu", "Peter Fox", "Kamini", "Gims",
    "Bushido", "Black M", "Soprano", "Nekfeu", "Bigflo & Oli",
  ],
  { genre: "rap" },
);

// Svetoznámi interpreti — skladbu z ich katalógu spozná takmer každý.
profileArtists(
  [
    "ABBA", "Queen", "Michael Jackson", "The Beatles", "Madonna", "Adele",
    "Ed Sheeran", "Bon Jovi", "AC/DC", "Nirvana", "Metallica", "Coldplay",
    "Rihanna", "Beyoncé", "Lady Gaga", "Bruno Mars", "Dua Lipa", "Elton John",
    "Whitney Houston", "Tina Turner", "Elvis Presley", "Bee Gees", "Scorpions",
    "Guns N' Roses", "U2", "Katy Perry", "Britney Spears", "Shakira",
    "Justin Bieber", "The Weeknd", "Billie Eilish", "Taylor Swift",
    "Elán", "Karel Gott", "Helena Vondráčková", "Falco", "Rammstein",
    "Helene Fischer", "Nena", "Modern Talking", "Boney M.",
  ],
  { tier: "easy" },
);

export function normalizeArtistKey(artist: string): string {
  return artist
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function slug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Stabilné id skladby. Rovnaká skladba v dvoch pooloch dá rovnaké id. */
export function songIdFor(title: string, artist: string): string {
  return `${slug(artist)}--${slug(title)}`;
}

function decadeOf(year: number | undefined): string | undefined {
  if (year === undefined) return undefined;
  if (year < 1960) return "oldies";
  return `${String(Math.floor(year / 10) * 10).slice(2)}s`;
}

function parseSongs(library: string, defaults: SectionDefaults): Song[] {
  return library.trim().split("\n").map((rawLine, index) => {
    const line = rawLine.trim();
    const parts = line.split("|");
    const fail = (reason: string) => {
      throw new Error(`Neplatný riadok hudobného katalógu ${index + 1} (${reason}): ${rawLine}`);
    };
    if (parts.length < 2 || parts.length > 6) fail("počet stĺpcov");
    const title = parts[0].trim();
    const artist = parts[1].trim();
    if (!title || !artist) fail("chýba názov alebo interpret");

    const rawYear = (parts[2] ?? "").trim();
    let year: number | undefined;
    if (rawYear) {
      year = Number(rawYear);
      if (!Number.isInteger(year) || year < 1900 || year > 2100) fail(`rok „${rawYear}"`);
    }

    const artistKey = normalizeArtistKey(artist);
    // Čo nie je v riadku, doplní profil interpreta — tak získa metadáta aj
    // pôvodná zásoba zapísaná v dvoch stĺpcoch.
    const profile = ARTIST_PROFILES[artistKey];

    const rawGenre = (parts[3] ?? "").trim();
    if (rawGenre && !GENRES.has(rawGenre)) fail(`žáner „${rawGenre}"`);
    const genre = (rawGenre || profile?.genre || undefined) as SongGenre | undefined;

    const rawTier = (parts[4] ?? "").trim();
    if (rawTier && !TIERS.has(rawTier)) fail(`náročnosť „${rawTier}"`);
    // Bez uvedenej náročnosti je skladba „medium" — nevypadne tak zo žiadneho
    // rozumného filtra, ale ani sa nevydáva za svetoznámy hit.
    const tier = (rawTier || profile?.tier || "medium") as SongTier;

    let language = defaults.artistLanguages?.[artistKey] ?? defaults.language;
    let region = defaults.region;
    // Melódiu vieme zahmkať vždy, kým to žáner alebo príznak nevylúči.
    let hummable = !(genre && LYRIC_DRIVEN_GENRES.has(genre));

    for (const flag of (parts[5] ?? "").trim().split(/\s+/).filter(Boolean)) {
      if (flag === "hum") hummable = true;
      else if (flag === "nohum") hummable = false;
      else if (flag.startsWith("lang=")) {
        const value = flag.slice(5);
        if (!SONG_LANGUAGES.has(value)) fail(`jazyk „${value}"`);
        language = value as SongLanguage;
      } else if (flag.startsWith("region=")) region = flag.slice(7);
      else fail(`neznámy príznak „${flag}"`);
    }

    return {
      id: songIdFor(title, artist),
      title,
      artist,
      artistKey,
      language,
      year,
      decade: decadeOf(year),
      genre,
      tier,
      hummable,
      region,
      scope: defaults.scope,
    };
  });
}

/**
 * Svetový pool — dostupný pre každý jazyk hry. Predvolený spievaný jazyk je
 * angličtina; neanglické svetové hity to prepíšu príznakom `lang=`.
 */
const WORLD_HITS = parseSongs(`
Dancing Queen|ABBA
Mamma Mia|ABBA
Gimme! Gimme! Gimme!|ABBA
Waterloo|ABBA
Take a Chance on Me|ABBA
The Winner Takes It All|ABBA
Bohemian Rhapsody|Queen
We Will Rock You|Queen
Don't Stop Me Now|Queen
Another One Bites the Dust|Queen
Radio Ga Ga|Queen
I Want to Break Free|Queen
Somebody to Love|Queen
Under Pressure|Queen & David Bowie
Billie Jean|Michael Jackson
Beat It|Michael Jackson
Thriller|Michael Jackson
Smooth Criminal|Michael Jackson
Bad|Michael Jackson
Black or White|Michael Jackson
Like a Prayer|Madonna
Material Girl|Madonna
Hung Up|Madonna
La Isla Bonita|Madonna
Like a Virgin|Madonna
I Wanna Dance with Somebody|Whitney Houston
I Will Always Love You|Whitney Houston
How Will I Know|Whitney Houston
Livin' on a Prayer|Bon Jovi
It's My Life|Bon Jovi
You Give Love a Bad Name|Bon Jovi
Always|Bon Jovi
The Final Countdown|Europe
Eye of the Tiger|Survivor
Don't Stop Believin'|Journey
Take on Me|a-ha
Africa|Toto
Girls Just Want to Have Fun|Cyndi Lauper
Time After Time|Cyndi Lauper
Never Gonna Give You Up|Rick Astley
Sweet Dreams (Are Made of This)|Eurythmics
Wake Me Up Before You Go-Go|Wham!
Careless Whisper|George Michael
Faith|George Michael
Summer of '69|Bryan Adams
(Everything I Do) I Do It for You|Bryan Adams
The Best|Tina Turner
What's Love Got to Do with It|Tina Turner
I Will Survive|Gloria Gaynor
Y.M.C.A.|Village People
Stayin' Alive|Bee Gees
How Deep Is Your Love|Bee Gees
Rasputin|Boney M.
Daddy Cool|Boney M.
Sunny|Boney M.
Cheri Cheri Lady|Modern Talking
You're My Heart, You're My Soul|Modern Talking
Listen to Your Heart|Roxette
It Must Have Been Love|Roxette
The Look|Roxette
Wind of Change|Scorpions
Rock You Like a Hurricane|Scorpions
Sweet Child o' Mine|Guns N' Roses
November Rain|Guns N' Roses
Paradise City|Guns N' Roses
Smells Like Teen Spirit|Nirvana
Come As You Are|Nirvana
Nothing Else Matters|Metallica
Enter Sandman|Metallica
Californication|Red Hot Chili Peppers
Under the Bridge|Red Hot Chili Peppers
Can't Stop|Red Hot Chili Peppers
Wonderwall|Oasis
Don't Look Back In Anger|Oasis
Zombie|The Cranberries
Losing My Religion|R.E.M.
Everybody Hurts|R.E.M.
With or Without You|U2
Beautiful Day|U2
I Still Haven't Found What I'm Looking For|U2
Yellow|Coldplay
Viva la Vida|Coldplay
Paradise|Coldplay
The Scientist|Coldplay
Fix You|Coldplay
Numb|Linkin Park
In the End|Linkin Park
What I've Done|Linkin Park
Boulevard of Broken Dreams|Green Day
American Idiot|Green Day
Bring Me to Life|Evanescence
My Immortal|Evanescence
...Baby One More Time|Britney Spears
Oops!... I Did It Again|Britney Spears
Toxic|Britney Spears
Womanizer|Britney Spears
Everybody (Backstreet's Back)|Backstreet Boys
I Want It That Way|Backstreet Boys
As Long as You Love Me|Backstreet Boys
Wannabe|Spice Girls
Spice Up Your Life|Spice Girls
Bye Bye Bye|*NSYNC
Genie in a Bottle|Christina Aguilera
Beautiful|Christina Aguilera
Hips Don't Lie|Shakira
Waka Waka (This Time for Africa)|Shakira
Whenever, Wherever|Shakira
Livin' la Vida Loca|Ricky Martin
Hero|Enrique Iglesias
Bailando|Enrique Iglesias|2014|latin|easy|lang=es
On the Floor|Jennifer Lopez
Let's Get Loud|Jennifer Lopez
Crazy in Love|Beyoncé
Single Ladies|Beyoncé
Halo|Beyoncé
Umbrella|Rihanna
Diamonds|Rihanna
We Found Love|Rihanna
Don't Stop The Music|Rihanna
Poker Face|Lady Gaga
Bad Romance|Lady Gaga
Shallow|Lady Gaga
Just Dance|Lady Gaga
Born This Way|Lady Gaga
Firework|Katy Perry
Roar|Katy Perry
I Kissed a Girl|Katy Perry
Dark Horse|Katy Perry
Party in the U.S.A.|Miley Cyrus
Flowers|Miley Cyrus
Wrecking Ball|Miley Cyrus
Shake It Off|Taylor Swift
Love Story|Taylor Swift
Blank Space|Taylor Swift
Cruel Summer|Taylor Swift
Anti-Hero|Taylor Swift
Rolling in the Deep|Adele
Someone Like You|Adele
Hello|Adele
Set Fire to the Rain|Adele
Shape of You|Ed Sheeran
Perfect|Ed Sheeran
Thinking Out Loud|Ed Sheeran
Photograph|Ed Sheeran
Just the Way You Are|Bruno Mars
Grenade|Bruno Mars
Locked Out of Heaven|Bruno Mars
Uptown Funk|Mark Ronson feat. Bruno Mars
Blinding Lights|The Weeknd
Save Your Tears|The Weeknd
Starboy|The Weeknd
Can't Feel My Face|The Weeknd
Levitating|Dua Lipa
Don't Start Now|Dua Lipa
Dance The Night|Dua Lipa
bad guy|Billie Eilish
Birds of a Feather|Billie Eilish
Baby|Justin Bieber
Sorry|Justin Bieber
Love Yourself|Justin Bieber
Counting Stars|OneRepublic
Believer|Imagine Dragons
Radioactive|Imagine Dragons
Demons|Imagine Dragons
Wake Me Up|Avicii
The Nights|Avicii
Titanium|David Guetta
Summer|Calvin Harris
Closer|The Chainsmokers
Moves Like Jagger|Maroon 5
Happy|Pharrell Williams
Chandelier|Sia
Cheap Thrills|Sia
Party Rock Anthem|LMFAO
Gangnam Style|PSY|2012|pop|easy|lang=other
Somebody That I Used to Know|Gotye
Dance Monkey|Tones and I
Despacito|Luis Fonsi|2017|latin|easy|lang=es
Havana|Camila Cabello
drivers license|Olivia Rodrigo
good 4 u|Olivia Rodrigo
As It Was|Harry Styles
Watermelon Sugar|Harry Styles
Someone You Loved|Lewis Capaldi
Beautiful Things|Benson Boone
APT.|ROSÉ
Espresso|Sabrina Carpenter
Good Luck, Babe!|Chappell Roan
Too Sweet|Hozier
My Heart Will Go On|Céline Dion
Let It Go|Idina Menzel
Ghostbusters|Ray Parker Jr.
Footloose|Kenny Loggins
What Is Love|Haddaway
Dragostea Din Tei|O-Zone|2003|pop|easy|lang=other
Freed from Desire|Gala
Blue (Da Ba Dee)|Eiffel 65
Macarena|Los del Río|1993|latin|easy|lang=es
Barbie Girl|Aqua
All Star|Smash Mouth
Seven Nation Army|The White Stripes
Can't Stop the Feeling!|Justin Timberlake
I Gotta Feeling|Black Eyed Peas
Where Is the Love?|Black Eyed Peas
Waterfalls|TLC
No Scrubs|TLC
Shape of My Heart|Sting
I Have Nothing|Whitney Houston
The Show Must Go On|Queen
Take My Breath Away|Berlin|1986|soundtrack|easy
Every Breath You Take|The Police
Message in a Bottle|The Police
Englishman In New York|Sting
Single Ladies (Put a Ring on It)|Beyoncé
Hey Ya!|Outkast
Drop It Like It's Hot|Snoop Dogg
Yeah!|Usher
Lose Yourself|Eminem
Without Me|Eminem
Creep|Radiohead
Karma Police|Radiohead
Superstition|Stevie Wonder
Isn't She Lovely|Stevie Wonder
Brown Eyed Girl|Van Morrison
Sweet Home Alabama|Lynyrd Skynyrd
Memories|David Guetta
Gasolina|Daddy Yankee|2004|latin|easy|lang=es
Danza Kuduro|Don Omar|2010|latin|easy|lang=es
Señorita|Shawn Mendes
Die With A Smile|Lady Gaga
The Ketchup Song (Aserejé)|Las Ketchup|2002|latin|easy|lang=es
Cotton Eye Joe|Rednex
I'm a Believer|Smash Mouth
Let's Get It Started|Black Eyed Peas
Teenage Dream|Katy Perry
California Gurls|Katy Perry
24K Magic|Bruno Mars
Treasure|Bruno Mars
A Sky Full of Stars|Coldplay
Thunder|Imagine Dragons
The Real Slim Shady|Eminem
Stan|Eminem
Only Girl (In The World)|Rihanna
Irreplaceable|Beyoncé
If I Were A Boy|Beyoncé
Skyfall|Adele
Somebody Told Me|The Killers
Roses|Outkast
Feel Good Inc.|Gorillaz
Clint Eastwood|Gorillaz
Snow (Hey Oh)|Red Hot Chili Peppers
Faint|Linkin Park
Back In Black|AC/DC
Highway to Hell|AC/DC
Thunderstruck|AC/DC
T.N.T.|AC/DC
Lithium|Nirvana
Heart-Shaped Box|Nirvana
Sweet Emotion|Aerosmith
Dream On|Aerosmith
Don't Stop 'Til You Get Enough|Michael Jackson
Fantasy|Mariah Carey
Hero|Mariah Carey
Because You Loved Me|Céline Dion
In the Air Tonight|Phil Collins
I'm Still Standing|Elton John
Crazy Little Thing Called Love|Queen
Champagne Supernova|Oasis
Roxanne|The Police
Take It Easy|Eagles
Hold the Line|Toto
Everybody Wants to Rule the World|Tears for Fears
Wake Me Up When September Ends|Green Day
Hollaback Girl|Gwen Stefani|2004|pop|easy
Gold Digger|Kanye West
Stronger|Kanye West
Super Bass|Nicki Minaj|2010|pop|easy
Pump It|Black Eyed Peas
Promiscuous|Nelly Furtado
Maneater|Nelly Furtado
Sk8er Boi|Avril Lavigne|2002|pop|easy
Complicated|Avril Lavigne
Since U Been Gone|Kelly Clarkson
Sugar, We're Goin Down|Fall Out Boy
Thnks fr th Mmrs|Fall Out Boy
I Write Sins Not Tragedies|Panic! At The Disco
Misery Business|Paramore
Mr. Brightside|The Killers
Chasing Cars|Snow Patrol
Hey Brother|Avicii
Waiting For Love|Avicii
Levels|Avicii
Without You|David Guetta feat. Usher
Hey Mama|David Guetta
Play Hard|David Guetta
Feel So Close|Calvin Harris
This Is What You Came For|Calvin Harris feat. Rihanna
Blame|Calvin Harris
Timber|Pitbull feat. Kesha
Give Me Everything|Pitbull
Low|Flo Rida
My House|Flo Rida
Thrift Shop|Macklemore & Ryan Lewis
Can't Hold Us|Macklemore & Ryan Lewis
In Da Club|50 Cent
Candy Shop|50 Cent
Young, Wild & Free|Snoop Dogg & Wiz Khalifa
Boom Boom Pow|Black Eyed Peas
Meet Me Halfway|Black Eyed Peas
My Humps|Black Eyed Peas
Human|The Killers
Read My Mind|The Killers
Bleed It Out|Linkin Park
Breaking the Habit|Linkin Park
Basket Case|Green Day
All the Small Things|Blink-182
I Miss You|Blink-182
What's My Age Again?|Blink-182
All I Want|The Offspring
The Kids Aren't Alright|The Offspring
Self Esteem|The Offspring
Fat Lip|Sum 41
In Too Deep|Sum 41
Welcome to the Black Parade|My Chemical Romance
Teenagers|My Chemical Romance
Hells Bells|AC/DC
You Shook Me All Night Long|AC/DC
Master of Puppets|Metallica
In Bloom|Nirvana
Otherside|Red Hot Chili Peppers
Dani California|Red Hot Chili Peppers
By the Way|Red Hot Chili Peppers
We Can't Stop|Miley Cyrus
Peaches|Justin Bieber
What Do You Mean?|Justin Bieber
You Belong With Me|Taylor Swift
I Knew You Were Trouble|Taylor Swift
We Are Never Ever Getting Back Together|Taylor Swift
The Hills|The Weeknd
Call Out My Name|The Weeknd
Sign of the Times|Harry Styles
New Rules|Dua Lipa
Physical|Dua Lipa
Chiquitita|ABBA
Fernando|ABBA
Man in the Mirror|Michael Jackson
The Way You Make Me Feel|Michael Jackson
Joyride|Roxette
Please Forgive Me|Bryan Adams
Bed of Roses|Bon Jovi
I Don't Want to Miss a Thing|Aerosmith
Crazy|Aerosmith
Hot N Cold|Katy Perry
Last Friday Night (T.G.I.F.)|Katy Perry
Telephone|Lady Gaga
Paparazzi|Lady Gaga
Alejandro|Lady Gaga
Something Just Like This|The Chainsmokers & Coldplay
Adventure of a Lifetime|Coldplay
Magic|Coldplay
Natural|Imagine Dragons
Whatever It Takes|Imagine Dragons
Enemy|Imagine Dragons
Galway Girl|Ed Sheeran
Shivers|Ed Sheeran
Bad Habits|Ed Sheeran
That's What I Like|Bruno Mars
S&M|Rihanna
Rude Boy|Rihanna
Pon de Replay|Rihanna
Disturbia|Rihanna
Dreams|Fleetwood Mac|1977|rock|easy
Go Your Own Way|Fleetwood Mac|1977|rock|medium
The Chain|Fleetwood Mac|1977|rock|medium
Eleanor Rigby|The Beatles|1966|oldies|medium
A Hard Day's Night|The Beatles|1964|oldies|medium
Something|The Beatles|1969|oldies|medium
Ob-La-Di, Ob-La-Da|The Beatles|1968|oldies|easy
SOS|ABBA|1975|pop|easy
Super Trouper|ABBA|1980|pop|easy
Money, Money, Money|ABBA|1976|pop|easy
Knowing Me, Knowing You|ABBA|1977|pop|medium
We Are the Champions|Queen|1977|rock|easy
Killer Queen|Queen|1974|rock|medium
Who Wants to Live Forever|Queen|1986|rock|medium
That's Amore|Dean Martin|1953|oldies|easy
Another Day in Paradise|Phil Collins|1989|pop|medium
You Can't Hurry Love|Phil Collins|1982|pop|medium
You'll Be in My Heart|Phil Collins|1999|soundtrack|medium
Heaven|Bryan Adams|1984|rock|medium
Angels|Robbie Williams|1997|pop|easy
Rock DJ|Robbie Williams|2000|pop|easy
Everlong|Foo Fighters|1997|rock|medium
Best of You|Foo Fighters|2005|rock|medium
The Pretender|Foo Fighters|2007|rock|medium
Learn to Fly|Foo Fighters|1999|rock|medium
Don't Speak|No Doubt|1996|rock|easy
Just a Girl|No Doubt|1995|rock|medium
Man! I Feel Like a Woman!|Shania Twain|1997|country|easy
You're Still the One|Shania Twain|1998|country|medium
That Don't Impress Me Much|Shania Twain|1998|country|medium
So What|P!nk|2008|pop|easy
Raise Your Glass|P!nk|2010|pop|easy
Try|P!nk|2012|pop|medium
Because of You|Kelly Clarkson|2004|pop|medium
Breakaway|Kelly Clarkson|2004|pop|medium
Circus|Britney Spears|2008|pop|medium
Gimme More|Britney Spears|2007|pop|medium
Reflection|Christina Aguilera|1998|soundtrack|medium
Fighter|Christina Aguilera|2002|pop|medium
What a Girl Wants|Christina Aguilera|1999|pop|medium
Survivor|Destiny's Child|2001|rnb|easy
Say My Name|Destiny's Child|1999|rnb|easy
Sugar|Maroon 5|2014|pop|easy
Girls Like You|Maroon 5|2018|pop|easy
This Love|Maroon 5|2002|pop|easy
She Will Be Loved|Maroon 5|2004|pop|medium
Maps|Maroon 5|2014|pop|medium
Love Me Like You Do|Ellie Goulding|2015|pop|easy
Burn|Ellie Goulding|2013|pop|easy
Lights|Ellie Goulding|2010|pop|medium
Positions|Ariana Grande|2020|pop|medium
Thank U, Next|Ariana Grande|2018|pop|easy
7 Rings|Ariana Grande|2019|pop|easy
Problem|Ariana Grande|2014|pop|medium
Break Free|Ariana Grande|2014|pop|medium
No Tears Left to Cry|Ariana Grande|2018|pop|medium
Style|Taylor Swift|2014|pop|medium
Cardigan|Taylor Swift|2020|pop|medium
Look What You Made Me Do|Taylor Swift|2017|pop|medium
Bad Blood|Taylor Swift|2014|pop|medium
Wildest Dreams|Taylor Swift|2014|pop|medium
Lover|Taylor Swift|2019|pop|medium
Houdini|Dua Lipa|2023|pop|medium
Training Season|Dua Lipa|2024|pop|medium
Break My Heart|Dua Lipa|2020|pop|medium
Be the One|Dua Lipa|2015|pop|medium
Texas Hold 'Em|Beyoncé|2024|country|medium
Run the World (Girls)|Beyoncé|2011|rnb|medium
Love on Top|Beyoncé|2011|rnb|medium
Break My Soul|Beyoncé|2022|dance|medium
No One|Alicia Keys|2007|rnb|easy
If I Ain't Got You|Alicia Keys|2003|rnb|easy
Fallin'|Alicia Keys|2001|rnb|easy
Girl on Fire|Alicia Keys|2012|rnb|medium
Story of My Life|One Direction|2013|pop|easy
What Makes You Beautiful|One Direction|2011|pop|easy
Drag Me Down|One Direction|2015|pop|medium
Night Changes|One Direction|2014|pop|medium
Easy on Me|Adele|2021|pop|easy
When We Were Young|Adele|2015|pop|medium
Make You Feel My Love|Adele|2008|pop|medium
I Ain't Worried|OneRepublic|2022|pop|easy
Secrets|OneRepublic|2009|pop|medium
Love Runs Out|OneRepublic|2014|pop|medium
Treat You Better|Shawn Mendes|2016|pop|easy
Stitches|Shawn Mendes|2015|pop|easy
There's Nothing Holdin' Me Back|Shawn Mendes|2017|pop|medium
Marry You|Bruno Mars|2010|pop|easy
The Lazy Song|Bruno Mars|2010|pop|easy
When I Was Your Man|Bruno Mars|2012|pop|easy
Talking to the Moon|Bruno Mars|2010|pop|medium
Good as Hell|Lizzo|2016|pop|medium
About Damn Time|Lizzo|2022|pop|medium
Truth Hurts|Lizzo|2017|pop|medium
Ain't It Fun|Paramore|2013|rock|medium
Decode|Paramore|2008|rock|medium
Papercut|Linkin Park|2000|rock|medium
Somewhere I Belong|Linkin Park|2003|rock|medium
Castle of Glass|Linkin Park|2012|rock|medium
Girlfriend|Avril Lavigne|2007|pop|easy
I'm with You|Avril Lavigne|2002|pop|medium
My Happy Ending|Avril Lavigne|2004|pop|medium
Dog Days Are Over|Florence + the Machine|2008|indie|medium
Shake It Out|Florence + the Machine|2011|indie|medium
Unwritten|Natasha Bedingfield|2004|pop|medium
Pocketful of Sunshine|Natasha Bedingfield|2007|pop|medium
Don't Cha|The Pussycat Dolls|2005|pop|medium
Buttons|The Pussycat Dolls|2006|pop|medium
Price Tag|Jessie J|2011|pop|easy
Domino|Jessie J|2011|pop|medium
I'm Like a Bird|Nelly Furtado|2000|pop|medium
Say It Right|Nelly Furtado|2006|pop|medium
Love You Like a Love Song|Selena Gomez|2011|pop|easy
Lose You to Love Me|Selena Gomez|2019|pop|medium
Attention|Charlie Puth|2017|pop|easy
One Call Away|Charlie Puth|2015|pop|medium
Last Friday Night|Katy Perry|2010|pop|easy
The One That Got Away|Katy Perry|2011|pop|medium
Sofia|Álvaro Soler|2016|latin|easy|lang=es
El Mismo Sol|Álvaro Soler|2015|latin|easy|lang=es
Dynamite|BTS|2020|pop|easy
Butter|BTS|2021|pop|medium
How You Like That|BLACKPINK|2020|pop|medium|lang=other
Kill This Love|BLACKPINK|2019|pop|medium|lang=other
Sucker|Jonas Brothers|2019|pop|medium
Alone|Alan Walker|2016|dance|medium
The Spectre|Alan Walker|2017|dance|medium
Are You With Me|Lost Frequencies|2014|dance|medium
Reality|Lost Frequencies|2015|dance|medium
Glad You Came|The Wanted|2011|pop|medium
Sarà perché ti amo|Ricchi e Poveri|1981|pop|medium|lang=it
I Wanna Be Your Slave|Måneskin|2021|rock|medium
Vampire|Olivia Rodrigo|2023|pop|medium
Déjà Vu|Olivia Rodrigo|2021|pop|medium
Pink Pony Club|Chappell Roan|2020|pop|medium
HOT TO GO!|Chappell Roan|2023|pop|medium
What Was I Made For?|Billie Eilish|2023|pop|medium
Happier Than Ever|Billie Eilish|2021|pop|medium
Wildflower|Billie Eilish|2024|pop|hard
Please Please Please|Sabrina Carpenter|2024|pop|medium
Feather|Sabrina Carpenter|2023|pop|medium
Nonsense|Sabrina Carpenter|2022|pop|hard
Can You Feel the Love Tonight|Elton John|1994|soundtrack|easy
Circle of Life|Elton John|1994|soundtrack|easy
Waka Waka|Shakira|2010|latin|easy
She Wolf|Shakira|2009|pop|medium
Unfaithful|Rihanna|2006|rnb|medium
Man Down|Rihanna|2010|reggae|medium
Love Me Again|John Newman|2013|pop|medium
Rude|MAGIC!|2013|reggae|medium
Cheerleader|OMI|2014|reggae|easy
Sunshine Reggae|Laid Back|1983|reggae|medium
Take Five|Dave Brubeck|1959|jazz|medium
Rock Around the Clock|Bill Haley & His Comets|1954|oldies|easy|hum
Tutti Frutti|Little Richard|1955|oldies|easy|hum
You've Really Got a Hold on Me|The Miracles|1962|oldies|medium|hum
The Letter|The Box Tops|1967|oldies|easy|hum
Daydream|The Lovin' Spoonful|1966|oldies|medium|hum
Bus Stop|The Hollies|1966|rock|medium|hum
Baker Street|Gerry Rafferty|1978|rock|easy|hum
Rapper's Delight|The Sugarhill Gang|1979|rap|medium|nohum
The Things We Do for Love|10cc|1976|pop|medium|hum
Driver's Seat|Sniff 'n' the Tears|1978|rock|medium|hum
Heaven Is a Place on Earth|Belinda Carlisle|1987|pop|easy|hum
Manic Monday|The Bangles|1986|pop|easy|hum
Love Shack|The B-52's|1989|pop|easy|hum
The Boys of Summer|Don Henley|1984|rock|easy|hum
The Message|Grandmaster Flash & The Furious Five|1982|rap|medium|nohum
Save Tonight|Eagle-Eye Cherry|1997|pop|easy|hum
Return of the Mack|Mark Morrison|1996|rnb|easy|hum
Breakfast at Tiffany's|Deep Blue Something|1995|rock|easy|hum
One of Us|Joan Osborne|1995|pop|easy|hum
A Thousand Miles|Vanessa Carlton|2002|pop|easy|hum
Wherever You Will Go|The Calling|2001|rock|easy|hum
Hot in Herre|Nelly|2002|rap|easy|nohum
Suddenly I See|KT Tunstall|2004|pop|medium|hum
Geronimo|Sheppard|2014|pop|easy|hum
Best Day of My Life|American Authors|2013|pop|easy|hum
Renegades|X Ambassadors|2015|rock|medium|hum
A Bar Song (Tipsy)|Shaboozey|2024|country|easy|hum
Stargazing|Myles Smith|2024|pop|easy|hum
Ordinary|Alex Warren|2025|pop|easy|hum
Golden|HUNTR/X|2025|soundtrack|easy|hum
The Fate of Ophelia|Taylor Swift|2025|pop|easy|hum
Abracadabra|Lady Gaga|2025|pop|easy|hum
back to friends|sombr|2024|pop|easy|hum
luther|Kendrick Lamar & SZA|2024|rnb|easy|hum
Taste|Sabrina Carpenter|2024|pop|easy|hum
That's So True|Gracie Abrams|2024|pop|easy|hum
Fortnight|Taylor Swift feat. Post Malone|2024|pop|easy|hum
Not Like Us|Kendrick Lamar|2024|rap|easy|nohum
Million Dollar Baby|Tommy Richman|2024|rnb|easy|hum
I Like the Way You Kiss Me|Artemas|2024|pop|easy|hum
Sailor Song|Gigi Perez|2024|indie|easy|hum
The Door|Teddy Swims|2023|rnb|easy|hum
Timeless|The Weeknd feat. Playboi Carti|2024|rnb|medium|hum
Anxiety|Doechii|2025|rap|easy|nohum
Manchild|Sabrina Carpenter|2025|pop|easy|hum
Stick Season|Noah Kahan|2022|folk|easy|hum
Lose Control|Teddy Swims|2023|rnb|easy|hum
Greedy|Tate McRae|2023|pop|easy|hum
Calm Down|Rema|2022|pop|easy|hum
Heat Waves|Glass Animals|2020|indie|easy|hum
Faded|Alan Walker|2015|dance|easy|hum
Take Me to Church|Hozier|2013|indie|easy|hum
Unholy|Sam Smith & Kim Petras|2022|pop|easy|hum
Light My Fire|The Doors|1967|rock|easy|hum lang=en region=US
Here Comes the Sun|The Beatles|1969|oldies|easy|hum lang=en region=GB
Help!|The Beatles|1965|oldies|easy|hum lang=en region=GB
Good Vibrations|The Beach Boys|1966|oldies|easy|hum lang=en region=US
Wouldn't It Be Nice|The Beach Boys|1966|oldies|medium|hum lang=en region=US
My Girl|The Temptations|1964|oldies|easy|hum lang=en region=US
Have You Ever Seen the Rain|Creedence Clearwater Revival|1971|rock|easy|hum lang=en region=US
California Dreamin'|The Mamas & the Papas|1965|oldies|easy|hum lang=en region=US
Heart of Glass|Blondie|1978|pop|easy|hum lang=en region=US
Space Oddity|David Bowie|1969|rock|medium|hum lang=en region=GB
Let's Dance|David Bowie|1983|pop|easy|hum lang=en region=GB
Heroes|David Bowie|1977|rock|medium|hum lang=en region=GB
Whole Lotta Love|Led Zeppelin|1969|rock|easy|hum lang=en region=GB
Another Brick in the Wall, Pt. 2|Pink Floyd|1979|rock|easy|hum lang=en region=GB
Wish You Were Here|Pink Floyd|1975|rock|medium|hum lang=en region=GB
Comfortably Numb|Pink Floyd|1979|rock|medium|hum lang=en region=GB
Money|Pink Floyd|1973|rock|medium|hum lang=en region=GB
Layla|Derek and the Dominos|1970|rock|medium|hum lang=en region=US
Free Bird|Lynyrd Skynyrd|1973|rock|medium|hum lang=en region=US
More Than a Feeling|Boston|1976|rock|medium|hum lang=en region=US
Carry On Wayward Son|Kansas|1976|rock|medium|hum lang=en region=US
Bennie and the Jets|Elton John|1973|pop|medium|hum lang=en region=GB
Night Fever|Bee Gees|1977|disco|medium|hum lang=en region=GB
Le Freak|Chic|1978|disco|medium|hum lang=en region=US
Good Times|Chic|1979|disco|medium|hum lang=en region=US
September|Earth, Wind & Fire|1978|funk|easy|hum lang=en region=US
Let's Groove|Earth, Wind & Fire|1981|funk|medium|hum lang=en region=US
Boogie Wonderland|Earth, Wind & Fire|1979|disco|medium|hum lang=en region=US
Hot Stuff|Donna Summer|1979|disco|medium|hum lang=en region=US
I Feel Love|Donna Summer|1977|disco|medium|hum lang=en region=US
Sultans of Swing|Dire Straits|1978|rock|medium|hum lang=en region=GB
Money for Nothing|Dire Straits|1985|rock|medium|hum lang=en region=GB
Wanted Dead or Alive|Bon Jovi|1986|rock|medium|hum lang=en region=US
Paranoid|Black Sabbath|1970|metal|medium|hum lang=en region=GB
Crazy Train|Ozzy Osbourne|1980|metal|medium|hum lang=en region=GB
Smoke on the Water|Deep Purple|1972|rock|easy|hum lang=en region=GB
The Trooper|Iron Maiden|1983|metal|medium|hum lang=en region=GB
Vogue|Madonna|1990|pop|medium|hum lang=en region=US
Total Eclipse of the Heart|Bonnie Tyler|1983|pop|easy|hum lang=en region=GB
Baba O'Riley|The Who|1971|rock|easy|hum lang=en region=GB
Don't You Want Me|The Human League|1981|pop|easy|hum lang=en region=GB
Boys Don't Cry|The Cure|1979|indie|medium|hum lang=en region=GB
Just Like Heaven|The Cure|1987|indie|medium|hum lang=en region=GB
Blue Monday|New Order|1983|dance|medium|hum lang=en region=GB
Enjoy the Silence|Depeche Mode|1990|pop|medium|hum lang=en region=GB
Personal Jesus|Depeche Mode|1989|pop|medium|hum lang=en region=GB
Don't You (Forget About Me)|Simple Minds|1985|pop|easy|hum lang=en region=GB
The Logical Song|Supertramp|1979|rock|easy|hum lang=en region=GB
Maniac|Michael Sembello|1983|pop|medium|hum lang=en region=US
Flashdance... What a Feeling|Irene Cara|1983|soundtrack|medium|hum lang=en region=US
Danger Zone|Kenny Loggins|1986|soundtrack|medium|hum lang=en region=US
The Power of Love|Huey Lewis & The News|1985|rock|medium|hum lang=en region=US
Proud Mary|Creedence Clearwater Revival|1969|rock|easy|hum lang=en region=US
Come On Eileen|Dexys Midnight Runners|1982|pop|easy|hum lang=en region=GB
I Ran (So Far Away)|A Flock of Seagulls|1982|pop|medium|hum lang=en region=GB
Tarzan Boy|Baltimora|1985|pop|medium|hum lang=en region=IT
Black Hole Sun|Soundgarden|1994|rock|medium|hum lang=en region=US
Alive|Pearl Jam|1991|rock|medium|hum lang=en region=US
Bitter Sweet Symphony|The Verve|1997|rock|medium|hum lang=en region=GB
Song 2|Blur|1997|rock|medium|hum lang=en region=GB
When I Come Around|Green Day|1994|punk|medium|hum lang=en region=US
Give It Away|Red Hot Chili Peppers|1991|rock|medium|nohum lang=en region=US
No Rain|Blind Melon|1992|rock|medium|hum lang=en region=US
Should I Stay or Should I Go|The Clash|1982|rock|easy|hum lang=en region=GB
It's a Sin|Pet Shop Boys|1987|pop|easy|hum lang=en region=GB
Believe|Cher|1998|dance|easy|hum lang=en region=US
Mr. Vain|Culture Beat|1993|dance|medium|hum lang=en region=DE
Rhythm Is a Dancer|Snap!|1992|dance|medium|hum lang=en region=DE
The Sign|Ace of Base|1993|pop|easy|hum lang=en region=SE
All That She Wants|Ace of Base|1992|pop|easy|hum lang=en region=SE
Saturday Night|Whigfield|1992|dance|medium|hum lang=en region=DK
No Woman, No Cry|Bob Marley & The Wailers|1974|reggae|easy|hum lang=en region=JM
Three Little Birds|Bob Marley & The Wailers|1977|reggae|easy|hum lang=en region=JM
Could You Be Loved|Bob Marley & The Wailers|1980|reggae|medium|hum lang=en region=JM
I Was Made for Lovin' You|Kiss|1979|rock|easy|hum lang=en region=US
No Diggity|Blackstreet|1996|rnb|medium|nohum lang=en region=US
Bailamos|Enrique Iglesias|1999|latin|medium|hum lang=en region=ES
Smooth|Santana feat. Rob Thomas|1999|latin|medium|hum lang=en region=US
Maria Maria|Santana feat. The Product G&B|1999|latin|medium|hum lang=en region=US
Kiss from a Rose|Seal|1994|pop|medium|hum lang=en region=GB
Chop Suey!|System of a Down|2001|metal|medium|hum lang=en region=US
Toxicity|System of a Down|2001|metal|medium|hum lang=en region=US
Last Resort|Papa Roach|2000|metal|medium|hum lang=en region=US
I'm Not Okay (I Promise)|My Chemical Romance|2004|punk|medium|hum lang=en region=US
Clocks|Coldplay|2002|rock|easy|hum lang=en region=GB
SexyBack|Justin Timberlake|2006|pop|medium|hum lang=en region=US
Cry Me a River|Justin Timberlake|2002|pop|medium|hum lang=en region=US
Beautiful Girls|Sean Kingston|2007|pop|medium|hum lang=en region=US
Bridge over Troubled Water|Simon & Garfunkel|1970|folk|easy|hum lang=en region=US
Sexy and I Know It|LMFAO|2011|dance|medium|hum lang=en region=US
Lean On|Major Lazer & DJ Snake feat. MØ|2015|dance|easy|hum lang=en region=US
Don't You Worry Child|Swedish House Mafia feat. John Martin|2012|dance|medium|hum lang=en region=SE
Rather Be|Clean Bandit feat. Jess Glynne|2014|dance|medium|hum lang=en region=GB
Rockabye|Clean Bandit feat. Sean Paul & Anne-Marie|2016|dance|medium|hum lang=en region=GB
Get Lucky|Daft Punk feat. Pharrell Williams & Nile Rodgers|2013|dance|easy|hum lang=en region=FR
One More Time|Daft Punk|2000|dance|easy|hum lang=en region=FR
Around the World|Daft Punk|1997|dance|medium|hum lang=en region=FR
All of Me|John Legend|2013|rnb|easy|hum lang=en region=US
Stay with Me|Sam Smith|2014|pop|easy|hum lang=en region=GB
Ho Hey|The Lumineers|2012|indie|medium|hum lang=en region=US
Little Talks|Of Monsters and Men|2011|indie|medium|hum lang=en region=IS
Riptide|Vance Joy|2013|indie|medium|hum lang=en region=AU
Budapest|George Ezra|2013|indie|medium|hum lang=en region=GB
Ocean Eyes|Billie Eilish|2016|pop|medium|hum lang=en region=US
Lovely|Billie Eilish & Khalid|2018|pop|medium|hum lang=en region=US
Unstoppable|Sia|2016|pop|medium|hum lang=en region=AU
Paint the Town Red|Doja Cat|2023|rap|medium|nohum lang=en region=US
Say So|Doja Cat|2019|pop|easy|hum lang=en region=US
golden hour|JVKE|2022|pop|medium|hum lang=en region=US
Sunroof|Nicky Youre & dazy|2021|pop|medium|hum lang=en region=US
Knockin' on Heaven's Door|Bob Dylan|1973|folk|easy|hum lang=en region=US
Kill Bill|SZA|2022|rnb|easy|hum lang=en region=US
Rain on Me|Lady Gaga & Ariana Grande|2020|dance|medium|hum lang=en region=US
Pompeii|Bastille|2013|indie|easy|hum lang=en region=GB
Better Off Alone|Alice Deejay|1999|dance|medium|hum lang=en region=NL
SICKO MODE|Travis Scott|2018|rap|medium|nohum lang=en region=US
God's Plan|Drake|2018|rap|easy|nohum lang=en region=CA
One Dance|Drake feat. Wizkid & Kyla|2016|dance|easy|hum lang=en region=CA
Hotline Bling|Drake|2015|rap|easy|nohum lang=en region=CA
Old Town Road|Lil Nas X|2018|rap|easy|nohum lang=en region=US
INDUSTRY BABY|Lil Nas X & Jack Harlow|2021|rap|medium|nohum lang=en region=US
rockstar|Post Malone feat. 21 Savage|2017|rap|easy|nohum lang=en region=US
Circles|Post Malone|2019|pop|easy|hum lang=en region=US
Sunflower|Post Malone & Swae Lee|2018|pop|easy|hum lang=en region=US
Shut Up and Dance|WALK THE MOON|2014|pop|easy|hum lang=en region=US
Shotgun|George Ezra|2018|pop|medium|hum lang=en region=GB
7 Years|Lukas Graham|2015|pop|easy|hum lang=en region=DK
How You Remind Me|Nickelback|2001|rock|easy|hum lang=en region=CA
Take Me Home, Country Roads|John Denver|1971|country|easy|hum lang=en region=US
True|Spandau Ballet|1983|pop|easy|hum lang=en region=GB
More Than Words|Extreme|1990|rock|easy|hum lang=en region=US
Wonderful Tonight|Eric Clapton|1977|rock|easy|hum lang=en region=GB
Tears in Heaven|Eric Clapton|1992|rock|easy|hum lang=en region=GB
Barracuda|Heart|1977|rock|easy|hum lang=en region=US
Heart of Gold|Neil Young|1972|folk|easy|hum lang=en region=CA
When Doves Cry|Prince|1984|pop|easy|hum lang=en region=US
I Just Called to Say I Love You|Stevie Wonder|1984|pop|easy|hum lang=en region=US
Walk of Life|Dire Straits|1985|rock|easy|hum lang=en region=GB
What's Going On|Marvin Gaye|1971|soul|easy|hum lang=en region=US
Ain't No Other Man|Christina Aguilera|2006|pop|easy|hum lang=en region=US
Dirrty|Christina Aguilera feat. Redman|2002|pop|easy|nohum lang=en region=US
Family Affair|Mary J. Blige|2001|rnb|easy|hum lang=en region=US
Bills, Bills, Bills|Destiny's Child|1999|rnb|easy|hum lang=en region=US
Independent Women, Pt. 1|Destiny's Child|2000|rnb|easy|hum lang=en region=US
Bootylicious|Destiny's Child|2001|rnb|easy|hum lang=en region=US
Ready or Not|Fugees|1996|rnb|easy|nohum lang=en region=US
Doo Wop (That Thing)|Lauryn Hill|1998|rnb|easy|nohum lang=en region=US
Gangsta's Paradise|Coolio feat. L.V.|1995|rap|easy|nohum lang=en region=US
Changes|2Pac|1998|rap|easy|nohum lang=en region=US
Dear Mama|2Pac|1995|rap|medium|nohum lang=en region=US
Big Poppa|The Notorious B.I.G.|1994|rap|easy|nohum lang=en region=US
It Was a Good Day|Ice Cube|1992|rap|easy|nohum lang=en region=US
Nuthin' but a "G" Thang|Dr. Dre feat. Snoop Dogg|1992|rap|easy|nohum lang=en region=US
Still D.R.E.|Dr. Dre feat. Snoop Dogg|1999|rap|easy|nohum lang=en region=US
The Next Episode|Dr. Dre feat. Snoop Dogg|1999|rap|easy|nohum lang=en region=US
Gin and Juice|Snoop Dogg|1993|rap|easy|nohum lang=en region=US
Jump Around|House of Pain|1992|rap|easy|nohum lang=en region=US
Insane in the Brain|Cypress Hill|1993|rap|easy|nohum lang=en region=US
Hypnotize|The Notorious B.I.G.|1997|rap|easy|nohum lang=en region=US
Just Give Me a Reason|P!nk feat. Nate Ruess|2012|pop|easy|hum lang=en region=US
What About Us|P!nk|2017|pop|easy|hum lang=en region=US
When You're Gone|Avril Lavigne|2007|pop|easy|hum lang=en region=CA
Big Girls Don't Cry|Fergie|2007|pop|easy|hum lang=en region=US
London Bridge|Fergie|2006|rap|easy|nohum lang=en region=US
Fireflies|Owl City|2009|pop|easy|hum lang=en region=US
Good Time|Owl City & Carly Rae Jepsen|2012|pop|easy|hum lang=en region=US
Call Me Maybe|Carly Rae Jepsen|2011|pop|easy|hum lang=en region=CA
I Really Like You|Carly Rae Jepsen|2015|pop|easy|hum lang=en region=CA
Save the World|Swedish House Mafia|2011|dance|easy|hum lang=en region=SE
Clarity|Zedd feat. Foxes|2012|dance|easy|hum lang=en region=DE
Stay the Night|Zedd feat. Hayley Williams|2013|dance|easy|hum lang=en region=DE
The Middle|Zedd, Maren Morris & Grey|2018|dance|easy|hum lang=en region=US
Turn Down for What|DJ Snake & Lil Jon|2013|dance|easy|nohum lang=en region=US
Let Me Love You|DJ Snake feat. Justin Bieber|2016|dance|easy|hum lang=en region=FR
Where Are Ü Now|Skrillex & Diplo feat. Justin Bieber|2015|dance|easy|hum lang=en region=US
Bangarang|Skrillex feat. Sirah|2011|dance|easy|nohum lang=en region=US
Outside|Calvin Harris feat. Ellie Goulding|2014|dance|easy|hum lang=en region=GB
One Kiss|Calvin Harris & Dua Lipa|2018|dance|easy|hum lang=en region=GB
Sweet Nothing|Calvin Harris feat. Florence Welch|2012|dance|easy|hum lang=en region=GB
Holding Out for a Hero|Bonnie Tyler|1984|pop|easy|hum lang=en region=GB
Eternal Flame|The Bangles|1988|pop|easy|hum lang=en region=US
Walk Like an Egyptian|The Bangles|1986|pop|easy|hum lang=en region=US
Boom, Boom, Boom, Boom!!|Vengaboys|1998|dance|easy|hum lang=en region=NL
We Like to Party!|Vengaboys|1998|dance|easy|hum lang=en region=NL
Call Me|Blondie|1980|rock|easy|hum lang=en region=US
Tubthumping|Chumbawamba|1997|rock|easy|hum lang=en region=GB
Flying Without Wings|Westlife|1999|pop|easy|hum lang=en region=IE
Rio|Duran Duran|1982|pop|easy|hum lang=en region=GB
Don't Dream It's Over|Crowded House|1986|pop|easy|hum lang=en region=AU
Don't Go Breaking My Heart|Elton John & Kiki Dee|1976|pop|easy|hum lang=en region=GB
You're the One That I Want|John Travolta & Olivia Newton-John|1978|soundtrack|easy|hum lang=en region=US
Summer Nights|John Travolta & Olivia Newton-John|1978|soundtrack|easy|hum lang=en region=US
Can't Take My Eyes Off You|Frankie Valli|1967|oldies|easy|hum lang=en region=US
Fame|Irene Cara|1980|soundtrack|easy|hum lang=en region=US
It's Raining Men|The Weather Girls|1982|pop|easy|hum lang=en region=US
In the Navy|Village People|1979|disco|easy|hum lang=en region=US
Get Down on It|Kool & The Gang|1981|funk|easy|hum lang=en region=US
Celebration|Kool & The Gang|1980|funk|easy|hum lang=en region=US
Ma Baker|Boney M.|1977|disco|easy|hum lang=en region=DE
Jump|Van Halen|1983|rock|easy|hum lang=en region=US
Brother Louie|Modern Talking|1986|pop|easy|hum lang=en region=DE
Rock and Roll All Nite|Kiss|1975|rock|easy|hum lang=en region=US
Riders on the Storm|The Doors|1971|rock|easy|hum lang=en region=US
Words|F.R. David|1982|pop|easy|hum lang=en region=FR
Forever Young|Alphaville|1984|pop|easy|hum lang=en region=DE
Fat Bottomed Girls|Queen|1978|rock|easy|hum lang=en region=GB
Freedom! '90|George Michael|1990|pop|easy|hum lang=en region=GB
Father Figure|George Michael|1987|pop|easy|hum lang=en region=GB
Don't Cry|Guns N' Roses|1991|rock|easy|hum lang=en region=US
Patience|Guns N' Roses|1988|rock|easy|hum lang=en region=US
Shout|Tears for Fears|1984|pop|easy|hum lang=en region=GB
Just Can't Get Enough|Depeche Mode|1981|pop|easy|hum lang=en region=GB
Friday I'm in Love|The Cure|1992|pop|easy|hum lang=en region=GB
This Charming Man|The Smiths|1983|indie|medium|hum lang=en region=GB
Where Is My Mind?|Pixies|1988|indie|easy|hum lang=en region=US
Man on the Moon|R.E.M.|1992|rock|easy|hum lang=en region=US
Shiny Happy People|R.E.M.|1991|rock|easy|hum lang=en region=US
Stop Crying Your Heart Out|Oasis|2002|rock|easy|hum lang=en region=GB
Penny Lane|The Beatles|1967|oldies|easy|hum lang=en region=GB
Lucy in the Sky with Diamonds|The Beatles|1967|oldies|easy|hum lang=en region=GB
While My Guitar Gently Weeps|The Beatles|1968|oldies|easy|hum lang=en region=GB
Blackbird|The Beatles|1968|oldies|easy|hum lang=en region=GB
Michelle|The Beatles|1965|oldies|easy|hum lang=en region=GB
I Want to Know What Love Is|Foreigner|1984|rock|easy|hum lang=en region=US
Wild Horses|The Rolling Stones|1971|rock|easy|hum lang=en region=GB
Livin' in America|James Brown|1985|funk|medium|hum lang=en region=US
I Got You (I Feel Good)|James Brown|1965|funk|easy|hum lang=en region=US
Love Will Tear Us Apart|Joy Division|1980|indie|medium|hum lang=en region=GB
Bizarre Love Triangle|New Order|1986|pop|medium|hum lang=en region=GB
Waiting in Vain|Bob Marley & The Wailers|1977|reggae|medium|hum lang=en region=JM
MMMBop|Hanson|1997|pop|easy|hum lang=en region=US
Family Portrait|P!nk|2002|pop|medium|hum lang=en region=US
Swear It Again|Westlife|1999|pop|medium|hum lang=en region=IE
No Matter What|Boyzone|1998|pop|easy|hum lang=en region=IE
Live Is Life|Opus|1985|rock|easy|hum lang=en region=AT
Woman|John Lennon|1980|pop|easy|hum lang=en region=GB
Mrs. Robinson|Simon & Garfunkel|1968|folk|easy|hum lang=en region=US
The Boxer|Simon & Garfunkel|1969|folk|easy|hum lang=en region=US
Rockin' in the Free World|Neil Young|1989|rock|easy|hum lang=en region=CA
Brothers in Arms|Dire Straits|1985|rock|medium|hum lang=en region=GB
The Unforgiven|Metallica|1991|metal|easy|hum lang=en region=US
One|Metallica|1989|metal|medium|hum lang=en region=US
Mama, I'm Coming Home|Ozzy Osbourne|1991|metal|easy|hum lang=en region=GB
Send Me an Angel|Scorpions|1990|rock|easy|hum lang=en region=DE
Carrie|Europe|1987|rock|medium|hum lang=en region=SE
Is This Love|Whitesnake|1987|rock|easy|hum lang=en region=GB
Separate Ways (Worlds Apart)|Journey|1983|rock|easy|hum lang=en region=US
Faithfully|Journey|1983|rock|easy|hum lang=en region=US
Rosanna|Toto|1982|rock|easy|hum lang=en region=US
Sailing|Christopher Cross|1980|pop|easy|hum lang=en region=US
Arthur's Theme (Best That You Can Do)|Christopher Cross|1981|soundtrack|easy|hum lang=en region=US
willow|Taylor Swift|2020|pop|easy|hum lang=en region=US
Take a Bow|Rihanna|2008|pop|easy|hum lang=en region=BB
The Edge of Glory|Lady Gaga|2011|pop|easy|hum lang=en region=US
Million Reasons|Lady Gaga|2016|pop|easy|hum lang=en region=US
Part of Me|Katy Perry|2012|pop|easy|hum lang=en region=US
Unconditionally|Katy Perry|2013|pop|easy|hum lang=en region=US
Send My Love (To Your New Lover)|Adele|2015|pop|easy|hum lang=en region=GB
Count on Me|Bruno Mars|2010|pop|easy|hum lang=en region=US
Lego House|Ed Sheeran|2011|pop|easy|hum lang=en region=GB
Sing|Ed Sheeran|2014|pop|easy|hum lang=en region=GB
Happier|Ed Sheeran|2017|pop|easy|hum lang=en region=GB
Never Say Never|Justin Bieber feat. Jaden|2010|pop|easy|hum lang=en region=CA
Boyfriend|Justin Bieber|2012|pop|easy|hum lang=en region=CA
Beauty and a Beat|Justin Bieber feat. Nicki Minaj|2012|pop|easy|hum lang=en region=CA
Ghost|Justin Bieber|2021|pop|easy|hum lang=en region=CA
Earned It (Fifty Shades of Grey)|The Weeknd|2014|rnb|easy|hum lang=en region=CA
IDGAF|Dua Lipa|2017|pop|easy|hum lang=en region=GB
One Last Time|Ariana Grande|2014|pop|easy|hum lang=en region=US
God is a woman|Ariana Grande|2018|pop|easy|hum lang=en region=US
when the party's over|Billie Eilish|2018|pop|easy|hum lang=en region=US
everything i wanted|Billie Eilish|2019|pop|easy|hum lang=en region=US
Malibu|Miley Cyrus|2017|pop|easy|hum lang=en region=US
Midnight Sky|Miley Cyrus|2020|pop|easy|hum lang=en region=US
Mirrors|Justin Timberlake|2013|pop|easy|hum lang=en region=US
Rock Your Body|Justin Timberlake|2003|pop|easy|hum lang=en region=US
Suit & Tie|Justin Timberlake feat. JAY-Z|2013|pop|easy|hum lang=en region=US
Get the Party Started|P!nk|2001|pop|easy|hum lang=en region=US
Who Knew|P!nk|2006|pop|easy|hum lang=en region=US
Underneath Your Clothes|Shakira|2002|pop|easy|hum lang=en region=CO
Jenny from the Block|Jennifer Lopez feat. Jadakiss & Styles P|2002|pop|easy|hum lang=en region=US
Waiting for Tonight|Jennifer Lopez|1999|dance|easy|hum lang=en region=US
If You Had My Love|Jennifer Lopez|1999|pop|easy|hum lang=en region=US
Ain't It Funny|Jennifer Lopez|2001|pop|easy|hum lang=en region=US
One More Night|Maroon 5|2012|pop|easy|hum lang=en region=US
On Top of the World|Imagine Dragons|2012|pop|easy|hum lang=en region=US
Good Life|OneRepublic|2010|pop|easy|hum lang=en region=US
Addicted to You|Avicii|2013|dance|easy|hum lang=en region=SE
Dangerous|David Guetta feat. Sam Martin|2014|dance|easy|hum lang=en region=FR
I Know You Want Me (Calle Ocho)|Pitbull|2009|dance|easy|nohum lang=en region=US
Rain Over Me|Pitbull feat. Marc Anthony|2011|dance|easy|hum lang=en region=US
Cleanin' Out My Closet|Eminem|2002|rap|easy|nohum lang=en region=US
Crawling|Linkin Park|2001|rock|easy|hum lang=en region=US
One Step Closer|Linkin Park|2000|rock|easy|hum lang=en region=US
New Divide|Linkin Park|2009|rock|easy|hum lang=en region=US
Holiday|Green Day|2005|punk|easy|hum lang=en region=US
21 Guns|Green Day|2009|rock|easy|hum lang=en region=US
Good Riddance (Time of Your Life)|Green Day|1997|rock|easy|hum lang=en region=US
Scar Tissue|Red Hot Chili Peppers|1999|rock|easy|hum lang=en region=US
Voulez-Vous|ABBA|1979|pop|easy|hum lang=en region=SE
The Name of the Game|ABBA|1977|pop|easy|hum lang=en region=SE
Show Me the Meaning of Being Lonely|Backstreet Boys|1999|pop|easy|hum lang=en region=US
Quit Playing Games (with My Heart)|Backstreet Boys|1996|pop|easy|hum lang=en region=US
Larger Than Life|Backstreet Boys|1999|pop|easy|hum lang=en region=US
U Got It Bad|Usher|2001|rnb|easy|hum lang=en region=US
Confessions Part II|Usher|2004|rnb|easy|hum lang=en region=US
Yeah 3x|Chris Brown|2010|dance|easy|hum lang=en region=US
Don't Matter|Akon|2006|pop|easy|hum lang=en region=US
Right Now (Na Na Na)|Akon|2008|pop|easy|hum lang=en region=US
Good Feeling|Flo Rida|2011|rap|easy|nohum lang=en region=US
Die Young|Kesha|2012|pop|easy|hum lang=en region=US
We R Who We R|Kesha|2010|pop|easy|hum lang=en region=US
Blow|Kesha|2011|pop|easy|hum lang=en region=US
Never Be the Same|Camila Cabello|2017|pop|easy|hum lang=en region=US
Come & Get It|Selena Gomez|2013|pop|easy|hum lang=en region=US
Skyscraper|Demi Lovato|2011|pop|easy|hum lang=en region=US
Stronger (What Doesn't Kill You)|Kelly Clarkson|2011|pop|easy|hum lang=en region=US
Far Away|Nickelback|2006|rock|easy|hum lang=en region=CA
Someday|Nickelback|2003|rock|easy|hum lang=en region=CA
Madness|Muse|2012|rock|easy|hum lang=en region=GB
Feel It Still|Portugal. The Man|2017|pop|easy|hum lang=en region=US
Instant Crush|Daft Punk feat. Julian Casablancas|2013|pop|easy|hum lang=en region=FR
Harder, Better, Faster, Stronger|Daft Punk|2001|dance|easy|hum lang=en region=FR
In the Name of Love|Martin Garrix & Bebe Rexha|2016|dance|easy|hum lang=en region=NL
Firestone|Kygo feat. Conrad Sewell|2014|dance|easy|hum lang=en region=NO
It Ain't Me|Kygo & Selena Gomez|2017|dance|easy|hum lang=en region=NO
Stole the Show|Kygo feat. Parson James|2015|dance|easy|hum lang=en region=NO
Silence|Marshmello feat. Khalid|2017|dance|easy|hum lang=en region=US
Perfect Strangers|Jonas Blue feat. JP Cooper|2016|dance|easy|hum lang=en region=GB
Mama|Jonas Blue feat. William Singe|2017|dance|easy|hum lang=en region=GB
Hungry Like the Wolf|Duran Duran|1982|pop|easy|hum lang=en region=GB
Ordinary World|Duran Duran|1992|pop|easy|hum lang=en region=GB
One Way or Another|Blondie|1978|rock|easy|hum lang=en region=US
Bad Moon Rising|Creedence Clearwater Revival|1969|rock|easy|hum lang=en region=US
Fortunate Son|Creedence Clearwater Revival|1969|rock|easy|hum lang=en region=US
My Generation|The Who|1965|rock|easy|hum lang=en region=GB
Panama|Van Halen|1984|rock|easy|hum lang=en region=US
Pour Some Sugar on Me|Def Leppard|1987|rock|easy|hum lang=en region=GB
Breakfast in America|Supertramp|1979|rock|easy|hum lang=en region=GB
Dreamer|Supertramp|1974|rock|medium|hum lang=en region=GB
Weather with You|Crowded House|1991|pop|easy|hum lang=en region=AU
Holding Back the Years|Simply Red|1985|pop|easy|hum lang=en region=GB
Stars|Simply Red|1991|pop|easy|hum lang=en region=GB
Breathless|The Corrs|2000|pop|easy|hum lang=en region=IE
Runaway|The Corrs|1995|pop|easy|hum lang=en region=IE
Say What You Want|Texas|1997|pop|medium|hum lang=en region=GB
Stupid Girl|Garbage|1995|rock|easy|hum lang=en region=US
Only Happy When It Rains|Garbage|1995|rock|easy|hum lang=en region=US
Every You Every Me|Placebo|1998|rock|medium|hum lang=en region=GB
Big in Japan|Alphaville|1984|pop|easy|hum lang=en region=DE
A Little Respect|Erasure|1988|pop|easy|hum lang=en region=GB
Invisible Touch|Genesis|1986|pop|easy|hum lang=en region=GB
I Can't Dance|Genesis|1991|rock|easy|hum lang=en region=GB
London Calling|The Clash|1979|punk|easy|hum lang=en region=GB
Blitzkrieg Bop|Ramones|1976|punk|easy|hum lang=en region=US
I Wanna Be Sedated|Ramones|1978|punk|easy|hum lang=en region=US
Once in a Lifetime|Talking Heads|1980|rock|easy|hum lang=en region=US
Psycho Killer|Talking Heads|1977|rock|easy|hum lang=en region=US
Common People|Pulp|1995|rock|easy|hum lang=en region=GB
Girls & Boys|Blur|1994|pop|easy|hum lang=en region=GB
Why Does It Always Rain on Me?|Travis|1999|rock|easy|hum lang=en region=GB
The Man Who Can't Be Moved|The Script|2008|pop|easy|hum lang=en region=IE
Hard to Say I'm Sorry|Chicago|1982|pop|easy|hum lang=en region=US
Can't Fight This Feeling|REO Speedwagon|1984|rock|easy|hum lang=en region=US
(I Just) Died in Your Arms|Cutting Crew|1986|pop|easy|hum lang=en region=GB
Broken Wings|Mr. Mister|1985|pop|easy|hum lang=en region=US
The Sun Always Shines on T.V.|a-ha|1985|pop|easy|hum lang=en region=NO
Hunting High and Low|a-ha|1986|pop|easy|hum lang=en region=NO
If You Leave|Orchestral Manoeuvres in the Dark|1986|pop|easy|hum lang=en region=GB
Enola Gay|Orchestral Manoeuvres in the Dark|1980|pop|easy|hum lang=en region=GB
Only Teardrops|Emmelie de Forest|2013|pop|medium|hum lang=en region=DK
Satellite|Lena|2010|pop|easy|hum lang=en region=DE
Toy|Netta|2018|pop|medium|hum lang=en region=IL
Think About Things|Daði Freyr|2020|pop|medium|hum lang=en region=IS
Düm Tek Tek|Hadise|2009|pop|medium|hum lang=en region=TR
Wild Dances|Ruslana|2004|pop|easy|hum lang=en region=UA
My Number One|Helena Paparizou|2005|pop|easy|hum lang=en region=GR
Hard Rock Hallelujah|Lordi|2006|metal|easy|hum lang=en region=FI
Playing with Fire|Paula Seling & Ovi|2010|pop|medium|hum lang=en region=RO
Fuego|Eleni Foureira|2018|pop|easy|hum lang=en region=CY
Queen of Kings|Alessandra|2023|pop|easy|hum lang=en region=NO
Rim Tim Tagi Dim|Baby Lasagna|2024|rock|easy|hum lang=en region=HR
Fairytale Gone Bad|Sunrise Avenue|2006|rock|easy|hum lang=en region=FI
In the Shadows|The Rasmus|2003|rock|easy|hum lang=en region=FI
Freestyler|Bomfunk MC's|1999|rap|easy|nohum lang=en region=FI
Hot|INNA|2008|dance|easy|hum lang=en region=RO
Sun Is Up|INNA|2010|dance|medium|hum lang=en region=RO
The Magic Key|One-T + Cool-T|2003|pop|medium|hum lang=en region=FR
Dancing on My Own|Robyn|2010|pop|easy|hum lang=en region=SE
Call Your Girlfriend|Robyn|2011|pop|medium|hum lang=en region=SE
With Every Heartbeat|Robyn feat. Kleerup|2007|pop|medium|hum lang=en region=SE
Habits (Stay High)|Tove Lo|2013|pop|easy|hum lang=en region=SE
Talking Body|Tove Lo|2014|pop|medium|hum lang=en region=SE
Young Folks|Peter Bjorn and John|2006|indie|easy|hum lang=en region=SE
Release Me|Agnes|2008|dance|medium|hum lang=en region=SE
Cry for You|September|2006|dance|easy|hum lang=en region=SE
Voyage Voyage|Desireless|1986|pop|medium|hum lang=fr region=FR
Zitti e buoni|Måneskin|2021|rock|medium|hum lang=it region=IT
Sandstorm|Darude|1999|dance|easy|hum lang=instrumental region=FI
Love the Way You Lie|Eminem feat. Rihanna|2010|rap|easy|nohum lang=en region=US
Hall of Fame|The Script feat. will.i.am|2012|pop|easy|hum lang=en region=IE
L'italiano|Toto Cutugno|1983|pop|easy|hum lang=it region=IT
Felicità|Al Bano & Romina Power|1982|pop|easy|hum lang=it region=IT
Con te partirò|Andrea Bocelli|1995|pop|easy|hum lang=it region=IT
Euphoria|Loreen|2012|pop|easy|hum lang=en region=SE
Stereo Love|Edward Maya & Vika Jigulina|2009|dance|easy|hum lang=en region=RO
`, { language: "en", scope: "global" });

const LOCAL_HITS: Partial<Record<SongLanguage, Song[]>> = {
  sk: parseSongs(`
V dolinách|Karol Duchoň
Čardáš dvoch sŕdc|Karol Duchoň
Mám ťa rád|Karol Duchoň
Dievča z Budmeríc|Karol Duchoň
Šiel, šiel|Karol Duchoň
Smútok krásnych dievčat|Karol Duchoň
Elena|Karol Duchoň
Po schodoch|Richard Müller
Nebude to ľahké|Richard Müller
Tlaková níž|Richard Müller
Milovanie v daždi|Richard Müller
Cigaretka na 2 ťahy|Richard Müller
Baroko|Richard Müller
Nahý II|Richard Müller
Voda, čo ma drží nad vodou|Elán
Nie sme zlí|Elán
Stužková|Elán
Vymyslená|Elán
Kráľovná bielych tenisiek|Elán
Sestrička z Kramárov|Elán
Bosorka|Elán
Zaľúbil sa chlapec|Elán
Kaskadér|Elán
Tanečnice z Lúčnice|Elán
Neviem byť sám|Elán
Fero|Elán
Reklama na ticho|Team
Držím ti miesto|Team
Severanka|Team
Lietam v tom tiež|Team
Je to vo hviezdach|Team
Mám na teba chuť|Team
Prievan v peňaženke|Team
Atlantída|Miroslav Žbirka
Biely kvet|Miroslav Žbirka
22 dní|Miroslav Žbirka
Balada o poľných vtákoch|Miroslav Žbirka
Čo bolí, to prebolí|Miroslav Žbirka
Len s ňou|Miroslav Žbirka
Nespáľme to krásne v nás|Miroslav Žbirka
Vyznanie|Marika Gombitová
Koloseum|Marika Gombitová
Študentská láska|Marika Gombitová
Paradiso|Marika Gombitová
Zem menom láska|Marika Gombitová
Úsmev|Modus
Sklíčka|Modus
Veľký sen mora|Modus
Ty, ja a môj brat|Modus
Čerešne|Hana Hegerová
Opri sa o mňa|IMT Smile
Cesty II. triedy|IMT Smile
Ľudia nie sú zlí|IMT Smile
Veselá pesnička|IMT Smile
Exotika|IMT Smile
Nepoznám|IMT Smile
Bozk|IMT Smile
Viac|IMT Smile
Žily|No Name
Ty a tvoja sestra|No Name
Čím to je|No Name
Lekná|No Name
Hľadám|No Name
Nie alebo áno|No Name
Mráz do žíl|Desmod
Vyrobená pre mňa|Desmod
Zhorí všetko čo mám|Desmod
Niekto ti to povie|Desmod
Pár dní|Desmod
To nie je možné|Desmod
Spomaľ|Peha
Za tebou|Peha
Deň medzi nedeľou a pondelkom|Peha
Pokoj v duši|Jana Kirschner
Bude mi ľahko|Jana Kirschner
Modrá|Jana Kirschner
V cudzom meste|Jana Kirschner
Na čiernom koni|Jana Kirschner
Horehronie|Kristína
Ta ne|Kristína
Pri oltári|Kristína
Jabĺčko|Kristína
V sieti ťa mám|Kristína
Neľutujem|Adam Ďurica
Mandolína|Adam Ďurica
Spolu|Adam Ďurica
Všade tam, kde si|Peter Bič Project
Hey Now|Peter Bič Project
Stoj|Peter Bič Project
Žijeme len raz|Ego
Príbeh|Tina
Zatancuj si so mnou|Adam Ďurica
Keď sa zamiluješ|Hex
V piatok podvečer|Hex
Nikdy nebolo lepšie|Hex
Maťo a Linda|Hex
Komplikovaná|Polemic
Ona je taká|Polemic
Tancuj|Polemic
Dnes|Tublatanka
Pravda víťazí|Tublatanka
Láska, drž ma nad hladinou|Tublatanka
Skúsime to cez vesmír|Tublatanka
Žeravé znamenie osudu|Tublatanka
Silný refrén|Horkýže Slíže
L.A.G. Song|Horkýže Slíže
Malá Žužu|Horkýže Slíže
Mám v p... na lehátku|Horkýže Slíže
A ja sprostá|Horkýže Slíže
Vlak|Horkýže Slíže
Ráno|Iné Kafe
Ružová záhrada|Iné Kafe
Úspešne zapojený|Iné Kafe
Spomienky na budúcnosť|Iné Kafe
ZRPŠ|Iné Kafe
Ďakujeme Vám|Iné Kafe
Aj tak sme frajeri|Peter Nagy
Sme svoji|Peter Nagy
Kristínka iba spí|Peter Nagy
Profesor Indigo|Peter Nagy
So mnou nikdy nezostarneš|Peter Nagy
Korálky od Natálky|Peter Nagy
Láska je tu s vami|Peter Nagy
Zlodej slnečníc|Elán
Smrtka na pražskom orloji|Elán
Malá nočná búrka|Team
Ženská menom Panika|Team
Dievčatá|Modus
Tajné milovanie|IMT Smile
Mám krásny sen|IMT Smile
Ďakujem že si|No Name
Starosta|No Name
Niekto ti to povie skôr než ja|Desmod
Hemeroidy|Desmod
Lavíny|Desmod
Slnečná balada|Peha
Loď do neznáma|Tublatanka
Vianoce|Iné Kafe
30. február|Iné Kafe
Logická hádanka|Horkýže Slíže
Nazdar|Horkýže Slíže
Banda tupých hláv|Horkýže Slíže
Matura|Smola a Hrušky
Kde si|Pavol Habera
Láska necestuj tým vlakom|Pavol Habera
Boli sme raz milovaní|Pavol Habera
Kým ťa mám|Pavol Habera
V slepých uličkách|Miroslav Žbirka
Mám rád|Miroslav Žbirka
Prvá|Miroslav Žbirka
Zlatokopky|Rytmus
Deti stratenej generácie|Rytmus
JBMNT|Kontrafakt
Kým neskapem|Kontrafakt
Som rád|Kali
Nejsom ten pravý|Kali
Primetime|Majk Spirit
Ženy treba ľúbiť|Majk Spirit
Všetko alebo nič|Dara Rolins
Čaba neblázni|Elán
Od Tatier k Dunaju|Elán
Ulica|Elán
Zanedbaný sex|Elán
Kapela|IMT Smile
Vyvedený z miery|IMT Smile
Niekto ako kráľ|IMT Smile
Biologické hodiny|No Name
Večnosť|No Name
Som na tebe závislý|Desmod
Zostalo ticho|Desmod
Kúpim si pekný deň|Gladiator
Láska|Gladiator
Nemôžem dýchať|Gladiator
Keď sa rúcajú skaly|Gladiator
Šlabikár|Tublatanka
Dnes už viem|Tublatanka
Špinavé objatie|Iné Kafe
Právo na šťastie|Iné Kafe
Prečo je to tak?|Iné Kafe
Brďokoky|Horkýže Slíže
RnB Soul|Horkýže Slíže
Maštaľ|Horkýže Slíže
Motorkárska|Horkýže Slíže
Emanuel Bacigala|Horkýže Slíže
Puf a Muf|Zóna A
Chleba|Zóna A
Podvod|Slobodná Európa
Unavený a zničený|Slobodná Európa
Keď sme sami|Hex
Život|Hex
Ja som to vedel|Polemic
Fajčiť treba|Smola a Hrušky
Šaty|Marika Gombitová
Nároční|Team
Čierna ruža|Pavol Hammel & Prúdy|1969|rock|medium|hum lang=sk region=SK
Lampy už dávno zhasli|Marcela Laiferová|1970|pop|medium|hum lang=sk region=SK
Plavovláska|Dušan Grúň|1971|pop|easy|hum lang=sk region=SK
Smoliar|Eva Kostolányiová|1973|pop|medium|hum lang=sk region=SK
Zažni|Miroslav Žbirka|1980|pop|easy|hum lang=sk region=SK
Adresa ja, adresa ty|Marika Gombitová|1980|pop|easy|hum lang=sk region=SK
Balíček snov|Modus|1980|pop|easy|hum lang=sk region=SK
Ôsmy svetadiel|Elán|1981|rock|easy|hum lang=sk region=SK
Anča, si drahá ako Volvo|Lojzo|1985|pop|easy|hum lang=sk region=SK
Praveký manekýn|Richard Müller & Banket|1988|pop|easy|hum lang=sk region=SK
Pieseň pre nesmelých|Team|1989|rock|easy|hum lang=sk region=SK
Relatívny pokoj|Slobodná Európa|1991|punk|easy|hum lang=sk region=SK
Nech sa deje čo sa má|Zuzana Smatanová|2005|pop|easy|hum lang=sk region=SK
Čierna bača|Ibrahim Maiga|1996|reggae|easy|hum lang=sk region=SK
Supervýlet|Hudba z Marsu|1998|pop|medium|hum lang=sk region=SK
Láska moja, de si?|Chiki liki tu-a|1999|rock|medium|hum lang=sk region=SK
Papierové kone|Nocadeň|2000|rock|easy|hum lang=sk region=SK
Gangster ska|Polemic|2000|reggae|easy|hum lang=sk region=SK
Hlava vinná, telo nevinné|Peha|2005|pop|easy|hum lang=sk region=SK
Mesto v nás|Komajota|2007|rock|easy|hum lang=sk region=SK
Búrka|Mária Čírová|2008|pop|easy|hum lang=sk region=SK
Prví poslední|Para|2012|rock|medium|hum lang=sk region=SK
Láva|Peter Bič Project|2015|pop|easy|hum lang=sk region=SK
Milujeme leto|Miro Jaroš|2016|pop|easy|hum lang=sk region=SK
Dva duby|Kandráčovci|2017|folk|easy|hum lang=sk region=SK
Pancier|Separ|2017|rap|medium|nohum lang=sk region=SK
Podľa seba|Sima|2022|rap|medium|nohum lang=sk region=SK
Hej, sokoly!|IMT Smile feat. Ondrej Kandráč|2017|folk|easy|hum lang=sk region=SK
Poď so mnou|IMT Smile feat. Kali|2018|pop|easy|hum lang=sk region=SK
Chýbanie|Desmod|2017|rock|easy|hum lang=sk region=SK
Nenahraditeľná|Sima Martausová|2018|folk|easy|hum lang=sk region=SK
Domovina|Adam Ďurica|2019|pop|easy|hum lang=sk region=SK
Toto leto|Sima feat. Kali|2020|pop|easy|hum lang=sk region=SK
Do rúk|Alan Murin & Tina|2022|rnb|medium|hum lang=sk region=SK
Maky|Peter Bič Project|2023|pop|easy|hum lang=sk region=SK
Láska-Veda|Adam Ďurica|2015|pop|easy|hum lang=sk region=SK
Run Run Run|Celeste Buckingham|2012|pop|easy|hum lang=en region=SK
Tam kde sa neumiera|Zuzana Smatanová|2004|pop|easy|hum lang=sk region=SK
Spočítaj ma|Richard Müller|2001|pop|easy|hum lang=sk region=SK
Denisa|Miroslav Žbirka|1980|pop|easy|hum lang=sk region=SK
Ak nie si moja|Vašo Patejdl|1986|soundtrack|easy|hum lang=sk region=SK
Pocta Majakovskému|Robo Grigorov|1987|rock|easy|hum lang=sk region=SK
Dievča z reklamy|Beáta Dubasová|1987|pop|easy|hum lang=sk region=SK
Matka|Tublatanka|1990|rock|easy|hum lang=sk region=SK
Slnko nevychádzaj|Metalinda|1992|rock|easy|hum lang=sk region=SK
Medulienka|Pavol Hammel|1970|pop|easy|hum lang=sk region=SK
Sľúbili sme si lásku|Ivan Hoffman|1989|folk|easy|hum lang=sk region=SK
Mesto snov|Katarína Knechtová|2007|pop|medium|hum lang=sk region=SK
Dážď|Peter Cmorik|2007|pop|medium|hum lang=sk region=SK
Jedno si želám|Peter Cmorik|2008|pop|medium|hum lang=sk region=SK
Chvíľu áno|Para|2005|rock|medium|hum lang=sk region=SK
Abstinent|Para|2007|rock|medium|hum lang=sk region=SK
Učiteľka tanca|Pavol Hammel|1974|pop|medium|hum lang=sk region=SK
Mám ťa málo|Mária Čírová|2009|pop|medium|hum lang=sk region=SK
Unikát|Mária Čírová|2011|pop|medium|hum lang=sk region=SK
Poďme sa zachrániť|Peter Nagy|1989|pop|medium|hum lang=sk region=SK
V dobrom aj v zlom|Zuzana Smatanová|2006|pop|medium|hum lang=sk region=SK
Čo o mne vieš|Dara Rolins|1997|pop|medium|hum lang=sk region=SK
Keď je 7 ráno|Vidiek|1997|rock|medium|hum lang=sk region=SK
Všetko sa dá|Gladiator|2001|pop|medium|hum lang=sk region=SK
Bonboniéra|Gladiator|2003|pop|medium|hum lang=sk region=SK
Zostaň|Adam Ďurica|2014|pop|medium|hum lang=sk region=SK
Slnko|Kristína|2011|pop|medium|hum lang=sk region=SK
Zamilovaná|Jana Kirschner|1999|pop|medium|hum lang=sk region=SK
Zlomená|No Name|2003|pop|medium|hum lang=sk region=SK
Kráľ|Desmod|2007|rock|medium|hum lang=sk region=SK
Tisíc dní|Desmod|2009|rock|medium|hum lang=sk region=SK
Voda|Polemic|1998|reggae|medium|hum lang=sk region=SK
Slobodná|Slobodná Európa|1990|punk|medium|hum lang=sk region=SK
Ahoj|Horkýže Slíže|2001|punk|medium|hum lang=sk region=SK
Nakopnutá|Iné Kafe|2002|punk|medium|hum lang=sk region=SK
Zbohom|Team|1989|pop|medium|hum lang=sk region=SK
Cigánsky bál|Elán|1985|rock|medium|hum lang=sk region=SK
Amnestia na neveru|Elán|1991|rock|medium|hum lang=sk region=SK
Anjel|Peha|2004|pop|medium|hum lang=sk region=SK
Láska moja|Elán|1984|rock|medium|hum lang=sk region=SK
Ako málo|Desmod|2005|rock|medium|hum lang=sk region=SK
Čo bolo, bolo|No Name|2001|pop|medium|hum lang=sk region=SK
Len tak stáť|Hex|1996|pop|medium|hum lang=sk region=SK
Strážca pokladov|Jana Kirschner|2001|pop|medium|hum lang=sk region=SK
Smej sa|Mária Čírová|2012|pop|medium|hum lang=sk region=SK
Keď sa láska podarí|Gladiator|1997|pop|medium|hum lang=sk region=SK
Pocit|Bystrík|2006|pop|medium|hum lang=sk region=SK
Ako to prežijem|Polemic|2003|reggae|medium|hum lang=sk region=SK
Čumil|Iné Kafe|2003|punk|medium|hum lang=sk region=SK
Kočka|Elán|1986|rock|medium|hum lang=sk region=SK
Človečina|Elán|1985|rock|medium|hum lang=sk region=SK
Jedenáste prikázanie|Elán|1989|rock|medium|hum lang=sk region=SK
Katka|Miroslav Žbirka|1984|pop|easy|hum lang=sk region=SK
Jesenná láska|Miroslav Žbirka|1980|pop|medium|hum lang=sk region=SK
Nočná optika|Richard Müller|1994|pop|medium|hum lang=sk region=SK
Správne dievčatá|Marika Gombitová|1982|pop|easy|hum lang=sk region=SK
Dievča do dažďa|Marika Gombitová|1982|pop|medium|hum lang=sk region=SK
Deň ako z pohľadnice|Modus|1980|pop|easy|hum lang=sk region=SK
Mám ľudí rád|Karol Duchoň|1980|pop|easy|hum lang=sk region=SK
Rodný môj kraj|Karol Duchoň|1974|pop|easy|hum lang=sk region=SK
Zvoňte, zvonky|Pavol Hammel|1969|rock|easy|hum lang=sk region=SK
Kráľ slnečných hodín|Pavol Hammel|1970|rock|medium|hum lang=sk region=SK
Marcel z malého mesta|Peter Nagy|1985|pop|easy|hum lang=sk region=SK
Psi sa bránia útokom|Peter Nagy|1984|pop|medium|hum lang=sk region=SK
Chráň svoje bláznovstvá|Peter Nagy|1984|pop|medium|hum lang=sk region=SK
Voňavky dievčat|Vašo Patejdl|1985|pop|medium|hum lang=sk region=SK
Bol raz jeden žiak|Robo Grigorov|1987|pop|easy|hum lang=sk region=SK
Účesy|Beáta Dubasová|1987|pop|easy|hum lang=sk region=SK
Pomaranče z Kuby|Hex|1995|pop|easy|hum lang=sk region=SK
Ži a nechaj žiť|No Name|2003|pop|easy|hum lang=sk region=SK
Dáva mi|Kontrafakt|2003|rap|easy|nohum lang=sk region=SK
Holubička|Adam Ďurica|2018|pop|medium|hum lang=sk region=SK
`, { language: "sk", scope: "local" }),
  cs: parseSongs(`
Báječný chlap|Michal Tučný
Jožin z bažin|Ivan Mládek
Lady Carneval|Karel Gott
Být stále mlád|Karel Gott
Trezor|Karel Gott
Když muž se ženou snídá|Karel Gott
Včelka Mája|Karel Gott
Zvonky štěstí|Karel Gott & Darina Rolincová
Holubí dům|Jiří Schelinger
Jasná zpráva|Olympic
Slza z tváře padá|Olympic
Dej mi víc své lásky|Olympic
Snad jsem to zavinil já|Olympic
Sladké mámení|Helena Vondráčková
Dlouhá noc|Helena Vondráčková
Lásko má, já stůňu|Helena Vondráčková
Nonstop|Michal David
Pár přátel|Michal David
Decibely lásky|Michal David
Láska je láska|Lucie Bílá
Esemes|Lucie Bílá
Amerika|Lucie
Medvídek|Lucie
Černí andělé|Lucie
Chci zas v tobě spát|Lucie
Šrouby do hlavy|Lucie
Malování|Divokej Bill
Plakala|Divokej Bill
Pohoda|Kabát
Burlaci|Kabát
Dole v dole|Kabát
V pekle sudy válej|Kabát
Colorado|Kabát
Malá dáma|Kabát
Tabáček|Chinaski
Víno|Chinaski
Klára|Chinaski
1. signální|Chinaski
Každý ráno|Chinaski
Cesta|Kryštof
Atentát|Kryštof
Rubikon|Kryštof
Anděl|Mirai
Když nemůžeš, tak přidej|Mirai
Mám boky jako skříň|Ewa Farna
Nafrněná|Barbora Poláková
Cesta z města|Support Lesbiens
Šrouby a matice|Mandrage
Hledá se žena|Mandrage
František|Buty
Nad stádem koní|Buty
Tam u nebeských bran|Michal Tučný
Želva|Olympic
Sen|Lucie
Zlatíčko|Chinaski
Kávu si osladím|Karel Gott
Zůstanu svůj|Karel Gott
Poupata|Michal David
Pátá|Helena Vondráčková
Žal se odkládá|Jiří Korn
Daniela|Lucie
Panic|Lucie
Oheň|Lucie
Šaman|Kabát
Bára|Kabát
Drobná paralela|Chinaski
Vrchlabí|Chinaski
Obchodník s deštěm|Kryštof
Srdce|Kryštof
Brouk Pytlík|Karel Gott
Štěstí je krásná věc|Richard Müller
Rozeznávám|Richard Müller
Céčka, sbírá céčka|Michal David
Nenapovídej|Michal David
S Láskou|Michal David
Krásná neznámá|Olympic
Klobouk ve křoví|Lucie
Dotknu se ohně|Lucie
Na sever|Kabát
Kdoví jestli|Kabát
Stará Lou|Kabát
Zamilovaný / Nešťastná|Rybičky 48 & Bára Zemanová
Sliby se maj plnit o Vánocích|Janek Ledecký
Proklínám|Janek Ledecký
Měls mě vůbec rád|Ewa Farna
Boží mlejny|Ewa Farna
Dám dělovou ránu|Karel Gott
Když milenky pláčou|Karel Gott
Pramínek vlasů|Jiří Suchý|1960|oldies|easy|hum lang=cs region=CZ
Červená řeka|Helena Vondráčková|1964|oldies|easy|hum lang=cs region=CZ
Slavíci z Madridu|Waldemar Matuška|1968|oldies|easy|hum lang=cs region=CZ
Veličenstvo kat|Karel Kryl|1969|folk|medium|hum lang=cs region=CZ
Slunečný hrob|Blue Effect|1970|rock|easy|hum lang=cs region=CZ
Variace na renesanční téma|Vladimír Mišík|1976|rock|medium|hum lang=cs region=CZ
Jednoho dne se vrátíš|Věra Špinarová|1978|pop|easy|hum lang=cs region=CZ
Dělání|Jaroslav Uhlíř & Zdeněk Svěrák|1980|soundtrack|easy|hum lang=cs region=CZ
Není nutno|Jaroslav Uhlíř & Zdeněk Svěrák|1983|soundtrack|easy|hum lang=cs region=CZ
Kolej Yesterday|Michal Prokop|1984|rock|medium|hum lang=cs region=CZ
Můj čas|Hana Zagorová, Stanislav Hložek & Petr Kotvald|1984|pop|easy|hum lang=cs region=CZ
Už nejsem volná|Petra Janů|1986|pop|easy|hum lang=cs region=CZ
Ráchel|Oceán|1990|pop|medium|hum lang=cs region=CZ
Zelená|Tři sestry|1991|punk|easy|hum lang=cs region=CZ
Země vzdálená|BSP|1993|rock|easy|hum lang=cs region=CZ
Motýlek|Daniel Landa|1993|rock|medium|hum lang=cs region=CZ
Tři oříšky|Iveta Bartošová|1998|soundtrack|easy|hum lang=cs region=CZ
Snadné je žít|Mig 21|2001|pop|easy|hum lang=cs region=CZ
Zejtra mám|Ready Kirken|2001|rock|easy|hum lang=cs region=CZ
Síla starejch vín|Škwor|2005|rock|easy|hum lang=cs region=CZ
Globální oteplování|Nightwork|2008|pop|easy|hum lang=cs region=CZ
Hvězdář|UDG|2009|rock|easy|hum lang=cs region=CZ
Bomby|Ben Cristovao|2014|rap|easy|nohum lang=cs region=CZ
Toulavá|Sebastian|2015|pop|easy|hum lang=cs region=CZ
Farmářům|David Stypka & Bandjeez|2017|pop|medium|hum lang=cs region=CZ
Tělo|Ewa Farna|2021|pop|easy|hum lang=cs region=CZ
Hannah Montana|Calin|2022|rap|easy|nohum lang=cs region=CZ
Safír|Calin & Viktor Sheen|2023|rap|easy|nohum lang=cs region=CZ
Vedle tebe usínám|Mirai|2021|pop|easy|hum lang=cs region=CZ
Naše cesty|Marek Ztracený|2018|pop|easy|hum lang=cs region=CZ
Dobré ráno, milá|David Stypka & Ewa Farna|2017|pop|easy|hum lang=cs region=CZ
Ještě jednu noc|Jelen|2021|folk|easy|hum lang=cs region=CZ
Katarze|Slza|2015|pop|easy|hum lang=cs region=CZ
Matfyzák na discu|Pokáč|2019|pop|easy|hum lang=cs region=CZ
Rozdělený světy|Viktor Sheen|2020|rap|medium|nohum lang=cs region=CZ
Praha/Vídeň|Calin|2021|rap|easy|nohum lang=cs region=CZ
Kdepak, ty ptáčku, hnízdo máš?|Karel Gott|1975|soundtrack|easy|hum lang=cs region=CZ
Otázky|Olympic|1970|rock|easy|hum lang=cs region=CZ
Laura|Lucie|1990|rock|easy|hum lang=cs region=CZ
Corrida|Kabát|2006|rock|easy|hum lang=cs region=CZ
Voda živá|Aneta Langerová|2004|pop|easy|hum lang=cs region=CZ
Pocity|Tomáš Klus|2008|pop|easy|hum lang=cs region=CZ
Svaz českých bohémů|Wohnout|2011|rock|easy|hum lang=cs region=CZ
Mám jednu ruku dlouhou|Buty|1994|rock|easy|hum lang=cs region=CZ
Půlnoční|Václav Neckář & Umakart|2011|soundtrack|easy|hum lang=cs region=CZ
Modlitba pro Martu|Marta Kubišová|1968|pop|easy|hum lang=cs region=CZ
Hodinový hotel|Mňága a Žďorp|1991|rock|easy|hum lang=cs region=CZ
Přejdi Jordán|Helena Vondráčková|1968|pop|easy|hum lang=cs region=CZ
Ztrácíš|Marek Ztracený|2008|pop|easy|hum lang=cs region=CZ
Léto 95|Marek Ztracený|2015|pop|easy|hum lang=cs region=CZ
Moje milá|Marek Ztracený|2015|pop|medium|hum lang=cs region=CZ
Originál|Marek Ztracený|2018|pop|medium|hum lang=cs region=CZ
Leporelo|Ewa Farna|2014|pop|easy|hum lang=cs region=CZ
Toužím|Ewa Farna|2009|pop|medium|hum lang=cs region=CZ
Na ostří nože|Ewa Farna|2016|pop|medium|hum lang=cs region=CZ
Všechno nebo nic|Ewa Farna|2017|pop|easy|hum lang=cs region=CZ
No Ne|Ewa Farna|2017|pop|medium|hum lang=cs region=CZ
Jdi za štěstím|Karel Gott|1977|pop|easy|hum lang=cs region=CZ
Čau, lásko|Karel Gott & Marcela Holanová|1986|pop|medium|hum lang=cs region=CZ
Stokrát chválím čas|Karel Gott|1987|pop|medium|hum lang=cs region=CZ
Má první láska se dnes vdává|Karel Gott|1981|pop|medium|hum lang=cs region=CZ
Když jsem já byl tenkrát kluk|Karel Gott|1971|pop|medium|hum lang=cs region=CZ
Bon soir, mademoiselle Paris|Olympic|1971|rock|medium|hum lang=cs region=CZ
Kanagom|Olympic|1985|rock|medium|hum lang=cs region=CZ
Pták Rosomák|Olympic|1969|rock|medium|hum lang=cs region=CZ
Vona říká jo|Lucie|2002|rock|medium|hum lang=cs region=CZ
Nejlepší, kterou znám|Lucie|2002|rock|medium|hum lang=cs region=CZ
Šťastnej chlap|Lucie|1994|rock|medium|hum lang=cs region=CZ
Houby magický|Kabát|1999|rock|medium|hum lang=cs region=CZ
Moderní děvče|Kabát|1991|rock|medium|hum lang=cs region=CZ
Bruce Willis|Kabát|1993|rock|medium|hum lang=cs region=CZ
Má ji motorovou|Kabát|1991|rock|medium|hum lang=cs region=CZ
Banditi di Praga|Kabát|2010|rock|medium|hum lang=cs region=CZ
Stejně jako já|Chinaski|2006|rock|easy|hum lang=cs region=CZ
Láskopad|Chinaski|2011|pop|medium|hum lang=cs region=CZ
Potkal jsem tě po letech|Chinaski|2014|pop|medium|hum lang=cs region=CZ
Každý chce někoho mít|Chinaski|1997|rock|medium|hum lang=cs region=CZ
Lolita|Kryštof|2001|pop|medium|hum lang=cs region=CZ
Cosmoshop|Kryštof|2006|pop|medium|hum lang=cs region=CZ
Hned teď|Kryštof|2012|pop|medium|hum lang=cs region=CZ
Tak nějak málo tančím|Kryštof|2015|pop|medium|hum lang=cs region=CZ
Discopříběh|Michal David|1987|pop|easy|hum lang=cs region=CZ
Každý mi tě, lásko, závidí|Michal David|1984|pop|easy|hum lang=cs region=CZ
Chtěl bych žít tak, jak se má|Michal David|1982|pop|medium|hum lang=cs region=CZ
A ty se ptáš, co já|Helena Vondráčková|1982|pop|easy|hum lang=cs region=CZ
Já půjdu dál|Helena Vondráčková|1977|pop|medium|hum lang=cs region=CZ
Kam zmizel ten starý song|Helena Vondráčková|1978|pop|easy|hum lang=cs region=CZ
Vzhůru k výškám|Helena Vondráčková|1984|pop|easy|hum lang=cs region=CZ
Amor magor|Lucie Bílá|1998|pop|medium|hum lang=cs region=CZ
Hvězdy jako hvězdy|Lucie Bílá|1998|pop|easy|hum lang=cs region=CZ
Jampadampa|Lucie Bílá|2003|pop|medium|hum lang=cs region=CZ
Hříšná těla, křídla motýlí|Aneta Langerová|2004|pop|easy|hum lang=cs region=CZ
V bezvětří|Aneta Langerová|2007|pop|medium|hum lang=cs region=CZ
Nina|Tomáš Klus|2011|pop|easy|hum lang=cs region=CZ
Napojen|Tomáš Klus|2012|pop|medium|hum lang=cs region=CZ
Do nebe|Tomáš Klus|2008|pop|medium|hum lang=cs region=CZ
Co bylo dál?|Jelen feat. Jana Kirschner|2014|folk|easy|hum lang=cs region=CZ
Vlčí srdce|Jelen|2016|folk|easy|hum lang=cs region=CZ
Jediný co chci|Jelen|2014|folk|medium|hum lang=cs region=CZ
Slunovrat|Jelen|2016|folk|medium|hum lang=cs region=CZ
Fáze pád|Slza|2016|pop|medium|hum lang=cs region=CZ
Celibát|Slza|2015|pop|medium|hum lang=cs region=CZ
Ani vody proud|Slza|2015|pop|easy|hum lang=cs region=CZ
Holomráz|Slza|2017|pop|medium|hum lang=cs region=CZ
Tanči dokud můžeš|Mandrage|2018|pop|easy|hum lang=cs region=CZ
Brouci|Mandrage|2015|pop|medium|hum lang=cs region=CZ
Travolta|Mandrage|2015|pop|medium|hum lang=cs region=CZ
Léto|Rybičky 48|2015|punk|easy|hum lang=cs region=CZ
Slibuju, že nebudu pít|Rybičky 48|2013|punk|medium|hum lang=cs region=CZ
My ještě nejsme starý|Rybičky 48|2013|punk|medium|hum lang=cs region=CZ
Američan z Poličan|Rybičky 48|2011|punk|medium|hum lang=cs region=CZ
Banány|Wohnout|2006|rock|medium|hum lang=cs region=CZ
Když mě brali za vojáka|Jaromír Nohavica|1988|folk|easy|hum lang=cs region=CZ
Zítra ráno v pět|Jaromír Nohavica|1993|folk|medium|hum lang=cs region=CZ
Dokud se zpívá|Jaromír Nohavica|1988|folk|easy|hum lang=cs region=CZ
Pijte vodu|Jaromír Nohavica|1994|folk|easy|hum lang=cs region=CZ
Petěrburg|Jaromír Nohavica|2000|folk|medium|hum lang=cs region=CZ
Divocí koně|Jaromír Nohavica|1996|folk|medium|hum lang=cs region=CZ
Jednou ráno|Buty|1995|rock|easy|hum lang=cs region=CZ
Tata|Buty|1994|rock|medium|hum lang=cs region=CZ
Kráva|Buty|1994|rock|medium|hum lang=cs region=CZ
Medvědi nevědí|Ivan Mládek|1977|folk|easy|hum lang=cs region=CZ
Prachovské skály|Ivan Mládek|1977|folk|easy|hum lang=cs region=CZ
Brno je zlatá loď|Ivan Mládek|1976|folk|medium|hum lang=cs region=CZ
René, já a Rudolf|Jiří Schelinger|1976|rock|medium|hum lang=cs region=CZ
Což takhle dát si špenát|Jiří Schelinger|1977|rock|easy|hum lang=cs region=CZ
Šípková Růženka|Jiří Schelinger|1976|rock|easy|hum lang=cs region=CZ
Náhrobní kámen|Petr Novák|1967|rock|easy|hum lang=cs region=CZ
Povídej|Petr Novák|1968|rock|easy|hum lang=cs region=CZ
Já budu chodit po špičkách|Petr Novák|1967|rock|medium|hum lang=cs region=CZ
Hvězdičko blýskavá|Petr Novák|1969|rock|medium|hum lang=cs region=CZ
Klaunova zpověď|Petr Novák|1968|rock|medium|hum lang=cs region=CZ
Stín katedrál|Václav Neckář & Helena Vondráčková|1973|pop|easy|hum lang=cs region=CZ
Tu kytaru jsem koupil kvůli tobě|Václav Neckář|1965|pop|medium|hum lang=cs region=CZ
Lékořice|Václav Neckář|1969|pop|medium|hum lang=cs region=CZ
Nechte zvony znít|Marta Kubišová|1967|pop|easy|hum lang=cs region=CZ
Duhová víla|Hana Zagorová & Petr Rezek|1977|pop|easy|hum lang=cs region=CZ
Biograf láska|Hana Zagorová|1982|pop|easy|hum lang=cs region=CZ
Rybičko zlatá, přeju si|Hana Zagorová|1986|pop|medium|hum lang=cs region=CZ
Skořápky ořechů|Marie Rottrová|1983|pop|easy|hum lang=cs region=CZ
Večerem zhýčkaná|Marie Rottrová|1979|pop|medium|hum lang=cs region=CZ
To mám tak ráda|Marie Rottrová|1977|pop|medium|hum lang=cs region=CZ
Hurikán|Dalibor Janda|1986|pop|easy|hum lang=cs region=CZ
Žít jako kaskadér|Dalibor Janda|1987|pop|medium|hum lang=cs region=CZ
Karviná|Yo Yo Band|1993|reggae|easy|hum lang=cs region=CZ
Rybitví|Yo Yo Band|1993|reggae|easy|hum lang=cs region=CZ
Andělé|Wanastowi Vjecy|1996|rock|easy|hum lang=cs region=CZ
Sbírka zvadlejch růží|Wanastowi Vjecy|1991|rock|easy|hum lang=cs region=CZ
Tak mi to teda nandey|Wanastowi Vjecy|1991|rock|medium|hum lang=cs region=CZ
Nejlíp jim bylo|Mňága a Žďorp|1995|rock|medium|hum lang=cs region=CZ
I cesta může být cíl|Mňága a Žďorp|1993|rock|easy|hum lang=cs region=CZ
Made in Valmez|Mňága a Žďorp|1990|rock|medium|hum lang=cs region=CZ
V blbým věku|Xindl X|2014|pop|easy|hum lang=cs region=CZ
Láska v housce|Xindl X & Olga Lounová|2010|pop|medium|hum lang=cs region=CZ
Na vodě|Xindl X|2016|pop|medium|hum lang=cs region=CZ
Mám doma kočku|Pokáč|2017|pop|easy|hum lang=cs region=CZ
Vymlácený entry|Pokáč|2017|pop|medium|hum lang=cs region=CZ
Co z tebe bude|Pokáč|2019|pop|medium|hum lang=cs region=CZ
Praha|PSH|2001|rap|easy|nohum lang=cs region=CZ
Policijééé|Chaozz|1996|rap|easy|nohum lang=cs region=CZ
Punčochy|Chinaski|1999|rock|easy|hum lang=cs region=CZ
Lásko voníš deštěm|Petra Janů|1980|pop|easy|hum lang=cs region=CZ
Pomalu|Marek Ztracený|2012|pop|medium|hum lang=cs region=CZ
Dynamit|Olympic|1973|rock|medium|hum lang=cs region=CZ
Dávám ti jeden den|Kabát|1995|rock|medium|hum lang=cs region=CZ
Hlavolam|Chinaski|2007|rock|medium|hum lang=cs region=CZ
Můj svět|Chinaski|2002|rock|medium|hum lang=cs region=CZ
Zatančím|Kryštof|2021|pop|easy|hum lang=cs region=CZ
Ženy|Kryštof|2004|pop|medium|hum lang=cs region=CZ
1970|Chinaski|2007|rock|easy|hum lang=cs region=CZ
Panická|Chinaski|2000|rock|easy|hum lang=cs region=CZ
Ticho|Ewa Farna|2007|pop|easy|hum lang=cs region=CZ
To tehdy padal déšť|Helena Vondráčková|1970|pop|medium|hum lang=cs region=CZ
Copacabana|Helena Vondráčková|1979|pop|medium|hum lang=cs region=CZ
Requiem|Lucie Bílá|1992|pop|medium|hum lang=cs region=CZ
Desatero|Lucie Bílá|2003|pop|medium|hum lang=cs region=CZ
Tráva|Aneta Langerová|2014|pop|medium|hum lang=cs region=CZ
Chybíš mi|Tomáš Klus|2011|pop|medium|hum lang=cs region=CZ
Někde kolem|Jelen|2014|folk|medium|hum lang=cs region=CZ
Paravany|Slza|2017|pop|medium|hum lang=cs region=CZ
Magdaléna|Jelen|2014|folk|easy|hum lang=cs region=CZ
Klidná jako voda|Jelen|2016|folk|easy|hum lang=cs region=CZ
Až|Katapult|1979|rock|easy|hum lang=cs region=CZ
Čmelák|Divokej Bill|2000|folk|easy|hum lang=cs region=CZ
Osmý den|Olympic|1981|rock|easy|hum lang=cs region=CZ
Ostravo|Jaromír Nohavica|2003|folk|medium|hum lang=cs region=CZ
Kometa|Jaromír Nohavica|1994|folk|medium|hum lang=cs region=CZ
Tři čuníci|Jaromír Nohavica|1994|folk|medium|hum lang=cs region=CZ
Jsi můj pán|Lucie Bílá|1993|pop|medium|hum lang=cs region=CZ
Chtěl jsem být|Lucie|1994|rock|medium|hum lang=cs region=CZ
Vedle sebe|Chinaski|2004|rock|medium|hum lang=cs region=CZ
Znamení|Divokej Bill|2004|folk|medium|hum lang=cs region=CZ
Cirkus|Divokej Bill|2003|folk|medium|hum lang=cs region=CZ
Krásný ztráty|Buty|1995|rock|medium|hum lang=cs region=CZ
Ta pravá|Mirai|2016|pop|medium|hum lang=cs region=CZ
Kluci z fabriky|Rybičky 48|2012|punk|medium|hum lang=cs region=CZ
Na ptáky jsme krátký|Janek Ledecký|1993|pop|medium|hum lang=cs region=CZ
Až na věky|Ewa Farna|2007|pop|medium|hum lang=cs region=CZ
Jsem prý blázen jen|Jiří Schelinger|1976|rock|medium|hum lang=cs region=CZ
Báječná ženská|Michal Tučný|1982|country|medium|hum lang=cs region=CZ
Pověste ho vejš|Michal Tučný|1983|country|medium|hum lang=cs region=CZ
Okno mé lásky|Olympic|1981|rock|easy|hum lang=cs region=CZ
Slzy tvý mámy|Olympic|1970|rock|medium|hum lang=cs region=CZ
Děti ráje|Michal David|1984|pop|easy|hum lang=cs region=CZ
Pánu bohu do oken|Tomáš Klus|2010|pop|medium|hum lang=cs region=CZ
Marie|Tomáš Klus|2012|pop|medium|hum lang=cs region=CZ
Proměny|Čechomor|2001|folk|medium|hum lang=cs region=CZ
Mezi horami|Čechomor|2000|folk|medium|hum lang=cs region=CZ
Srdce jako kníže Rohan|Richard Müller|1994|pop|medium|hum lang=cs region=CZ
Jahody mražený|Jiří Schelinger|1977|rock|medium|hum lang=cs region=CZ
Malovaný džbánku|Helena Vondráčková|1975|pop|medium|hum lang=cs region=CZ
Žízeň|Kabát|1991|rock|medium|hum lang=cs region=CZ
Chci tančit|Mirai|2018|pop|easy|hum lang=cs region=CZ
Maluj zase obrázky|Hana Zagorová|1976|pop|medium|hum lang=cs region=CZ
`, { language: "cs", scope: "local", region: "CZ" }),
  en: parseSongs(`
Hotel California|Eagles
Yesterday|The Beatles
Hey Jude|The Beatles
Let It Be|The Beatles
All You Need Is Love|The Beatles
Come Together|The Beatles
Yellow Submarine|The Beatles
Imagine|John Lennon
Stairway to Heaven|Led Zeppelin
Purple Rain|Prince
Kiss|Prince
Hallelujah|Leonard Cohen
I Want to Hold Your Hand|The Beatles
Stay|The Kid LAROI
Stand by Me|Ben E. King
My Way|Frank Sinatra
Fly Me to the Moon|Frank Sinatra
New York, New York|Frank Sinatra
Can't Help Falling in Love|Elvis Presley
Suspicious Minds|Elvis Presley
Jailhouse Rock|Elvis Presley
Hound Dog|Elvis Presley
Jolene|Dolly Parton
9 to 5|Dolly Parton
Always on My Mind|Willie Nelson
On the Road Again|Willie Nelson
Ring of Fire|Johnny Cash
I Walk the Line|Johnny Cash
Blowin' in the Wind|Bob Dylan
Like a Rolling Stone|Bob Dylan
Rocket Man|Elton John
Your Song|Elton John
Tiny Dancer|Elton John
Piano Man|Billy Joel
Uptown Girl|Billy Joel
We Didn't Start the Fire|Billy Joel
Dancing in the Dark|Bruce Springsteen
Born in the U.S.A.|Bruce Springsteen
Born to Run|Bruce Springsteen
Last Christmas|Wham!
All I Want for Christmas Is You|Mariah Carey
Respect|Aretha Franklin
Waterloo Sunset|The Kinks
Paint It, Black|The Rolling Stones
(I Can't Get No) Satisfaction|The Rolling Stones
Angie|The Rolling Stones
Sympathy for the Devil|The Rolling Stones
Start Me Up|The Rolling Stones
Walk This Way|Aerosmith
Supermassive Black Hole|Muse
Starlight|Muse
Uprising|Muse
Take Me Out|Franz Ferdinand
I Bet You Look Good On The Dancefloor|Arctic Monkeys
Do I Wanna Know?|Arctic Monkeys
R U Mine?|Arctic Monkeys
Fluorescent Adolescent|Arctic Monkeys
Use Somebody|Kings of Leon
Sex on Fire|Kings of Leon
Lonely Boy|The Black Keys
Power|Kanye West
Empire State of Mind|Jay-Z
Ni**as In Paris|Jay-Z
California Love|2Pac
Juicy|The Notorious B.I.G.
Mo Money Mo Problems|The Notorious B.I.G.
Hey, Soul Sister|Train
Drops of Jupiter|Train
How to Save a Life|The Fray
Iris|Goo Goo Dolls
Slide|Goo Goo Dolls
Dance, Dance|Fall Out Boy
Still Into You|Paramore
Mr. Jones|Counting Crows
Semi-Charmed Life|Third Eye Blind
Welcome To The Jungle|Guns N' Roses
Beyond the Sea|Bobby Darin|1959|oldies|easy|hum
What'd I Say|Ray Charles|1959|oldies|medium|hum
Summertime Blues|Eddie Cochran|1958|oldies|easy|hum
The Sound of Silence|Simon & Garfunkel|1964|folk|easy|hum
God Only Knows|The Beach Boys|1966|oldies|easy|hum
She's Not There|The Zombies|1964|oldies|medium|hum
Friday on My Mind|The Easybeats|1966|rock|medium|hum
Long Cool Woman (In a Black Dress)|The Hollies|1972|rock|medium|hum
Couldn't Get It Right|Climax Blues Band|1976|rock|medium|hum
Stumblin' In|Chris Norman & Suzi Quatro|1978|pop|easy|hum
The Look of Love|ABC|1982|pop|medium|hum
Wouldn't It Be Good|Nik Kershaw|1984|pop|medium|hum
Together in Electric Dreams|Philip Oakey & Giorgio Moroder|1984|pop|easy|hum
Waiting for a Star to Fall|Boy Meets Girl|1988|pop|easy|hum
Break My Stride|Matthew Wilder|1983|pop|easy|hum
How Bizarre|OMC|1995|pop|easy|hum
Kiss Me|Sixpence None the Richer|1998|pop|easy|hum
Steal My Sunshine|Len|1999|pop|easy|hum
Two Princes|Spin Doctors|1991|rock|easy|hum
You Get What You Give|New Radicals|1998|rock|medium|hum
Teenage Dirtbag|Wheatus|2000|rock|easy|hum
Absolutely (Story of a Girl)|Nine Days|2000|rock|medium|hum
New Shoes|Paolo Nutini|2006|pop|medium|hum
Cool Kids|Echosmith|2013|pop|easy|hum
Ex's & Oh's|Elle King|2014|rock|easy|hum
End of Beginning|Djo|2022|pop|easy|hum
Messy|Lola Young|2024|pop|easy|hum
Sweet Caroline|Neil Diamond|1969|oldies|easy|hum lang=en region=US
Mr. Blue Sky|Electric Light Orchestra|1977|rock|easy|hum lang=en region=GB
Rehab|Amy Winehouse|2006|rnb|easy|hum lang=en region=GB
The A Team|Ed Sheeran|2011|pop|medium|hum lang=en region=GB
Say You Won't Let Go|James Arthur|2016|pop|easy|hum lang=en region=GB
Youngblood|5 Seconds of Summer|2018|pop|easy|hum lang=en region=AU
Dancing in the Moonlight|Toploader|2000|pop|easy|hum lang=en region=GB
Somewhere Only We Know|Keane|2004|pop|easy|hum lang=en region=GB
Put Your Records On|Corinne Bailey Rae|2006|rnb|easy|hum lang=en region=GB
Bleeding Love|Leona Lewis|2007|pop|easy|hum lang=en region=GB
You're Beautiful|James Blunt|2005|pop|easy|hum lang=en region=GB
Sex Bomb|Tom Jones|1999|pop|easy|hum lang=en region=GB
Fast Car|Tracy Chapman|1988|folk|easy|hum lang=en region=US
Linger|The Cranberries|1993|rock|easy|hum lang=en region=IE
Need You Tonight|INXS|1987|rock|easy|hum lang=en region=AU
Down Under|Men at Work|1981|rock|easy|hum lang=en region=AU
Running Up That Hill|Kate Bush|1985|pop|easy|hum lang=en region=GB
Murder on the Dancefloor|Sophie Ellis-Bextor|2001|pop|easy|hum lang=en region=GB
Nice to Meet You|Myles Smith|2024|pop|medium|hum lang=en region=GB
Austin (Boots Stop Workin')|Dasha|2023|country|easy|hum lang=en region=US
Livin' Thing|Electric Light Orchestra|1976|rock|medium|hum lang=en region=GB
Ain't No Mountain High Enough|Marvin Gaye & Tammi Terrell|1967|soul|easy|hum lang=en region=US
Let's Get It On|Marvin Gaye|1973|soul|medium|hum lang=en region=US
Lovely Day|Bill Withers|1977|soul|easy|hum lang=en region=US
Ain't No Sunshine|Bill Withers|1971|soul|easy|hum lang=en region=US
What a Wonderful World|Louis Armstrong|1967|jazz|easy|hum lang=en region=US
Brandy (You're a Fine Girl)|Looking Glass|1972|pop|medium|hum lang=en region=US
Back to Black|Amy Winehouse|2006|rnb|medium|hum lang=en region=GB
Chasing Pavements|Adele|2008|pop|medium|hum lang=en region=GB
Video Games|Lana Del Rey|2011|indie|medium|hum lang=en region=US
Summertime Sadness|Lana Del Rey|2012|indie|medium|hum lang=en region=US
Royals|Lorde|2013|pop|easy|hum lang=en region=NZ
Team|Lorde|2013|pop|medium|hum lang=en region=NZ
Electric Feel|MGMT|2007|indie|medium|hum lang=en region=US
Kids|MGMT|2007|indie|medium|hum lang=en region=US
Pumped Up Kicks|Foster the People|2010|indie|medium|hum lang=en region=US
Sweater Weather|The Neighbourhood|2012|indie|easy|hum lang=en region=US
Let's Stay Together|Al Green|1971|soul|easy|hum lang=en region=US
She's So Lovely|Scouting for Girls|2007|pop|easy|hum lang=en region=GB
Grace Kelly|Mika|2007|pop|easy|hum lang=en region=GB
Relax, Take It Easy|Mika|2006|pop|easy|hum lang=en region=GB
Nine Million Bicycles|Katie Melua|2005|pop|easy|hum lang=en region=GB
The Closest Thing to Crazy|Katie Melua|2003|pop|medium|hum lang=en region=GB
Trouble|Coldplay|2000|rock|medium|hum lang=en region=GB
Speed of Sound|Coldplay|2005|rock|medium|hum lang=en region=GB
Don't Let Me Down|The Chainsmokers feat. Daya|2016|dance|easy|hum lang=en region=US
Paris|The Chainsmokers|2017|dance|easy|hum lang=en region=US
Every Teardrop Is a Waterfall|Coldplay|2011|rock|easy|hum lang=en region=GB
Chelsea Dagger|The Fratellis|2006|rock|easy|hum lang=en region=GB
Why'd You Only Call Me When You're High?|Arctic Monkeys|2013|indie|medium|hum lang=en region=GB
Naive|The Kooks|2006|indie|easy|hum lang=en region=GB
She Moves in Her Own Way|The Kooks|2006|indie|medium|hum lang=en region=GB
Time Is Running Out|Muse|2003|rock|easy|hum lang=en region=GB
Plug In Baby|Muse|2001|rock|medium|hum lang=en region=GB
Hysteria|Muse|2003|rock|medium|hum lang=en region=GB
Knights of Cydonia|Muse|2006|rock|medium|hum lang=en region=GB
Dakota|Stereophonics|2005|rock|easy|hum lang=en region=GB
Have a Nice Day|Stereophonics|2001|rock|easy|hum lang=en region=GB
You Give Me Something|James Morrison|2006|pop|easy|hum lang=en region=GB
Broken Strings|James Morrison feat. Nelly Furtado|2008|pop|easy|hum lang=en region=GB
Castle on the Hill|Ed Sheeran|2017|pop|easy|hum lang=en region=GB
I Don't Care|Ed Sheeran & Justin Bieber|2019|pop|easy|hum lang=en region=GB
Giant|Calvin Harris & Rag'n'Bone Man|2019|dance|easy|hum lang=en region=GB
Cassy O'|George Ezra|2014|pop|medium|hum lang=en region=GB
Let Her Go|Passenger|2012|indie|easy|hum lang=en region=GB
Dirty Paws|Of Monsters and Men|2011|indie|medium|hum lang=en region=IS
Home|Edward Sharpe & The Magnetic Zeros|2009|indie|easy|hum lang=en region=US
I Will Wait|Mumford & Sons|2012|folk|easy|hum lang=en region=GB
Little Lion Man|Mumford & Sons|2009|folk|easy|hum lang=en region=GB
The Cave|Mumford & Sons|2009|folk|medium|hum lang=en region=GB
Stubborn Love|The Lumineers|2012|indie|medium|hum lang=en region=US
Ophelia|The Lumineers|2016|indie|easy|hum lang=en region=US
Cleopatra|The Lumineers|2016|indie|medium|hum lang=en region=US
Rivers and Roads|The Head and the Heart|2010|folk|medium|hum lang=en region=US
Sweet Disposition|The Temper Trap|2008|indie|easy|hum lang=en region=AU
She Looks So Perfect|5 Seconds of Summer|2014|pop|easy|hum lang=en region=AU
Centuries|Fall Out Boy|2014|rock|easy|hum lang=en region=US
Helena|My Chemical Romance|2004|rock|medium|hum lang=en region=US
Pretty Fly (For a White Guy)|The Offspring|1998|punk|easy|hum lang=en region=US
Feeling This|Blink-182|2003|punk|medium|hum lang=en region=US
First Date|Blink-182|2001|punk|easy|hum lang=en region=US
Whistle|Flo Rida|2012|pop|easy|hum lang=en region=US
Club Can't Handle Me|Flo Rida feat. David Guetta|2010|dance|easy|hum lang=en region=US
Break Your Heart|Taio Cruz|2009|pop|easy|hum lang=en region=GB
Hotel Room Service|Pitbull|2009|rap|easy|nohum lang=en region=US
Don't Phunk with My Heart|Black Eyed Peas|2005|pop|easy|nohum lang=en region=US
Applause|Lady Gaga|2013|pop|easy|hum lang=en region=US
Wide Awake|Katy Perry|2012|pop|easy|hum lang=en region=US
Where Have You Been|Rihanna|2011|dance|easy|hum lang=en region=BB
Work|Rihanna feat. Drake|2016|rnb|easy|hum lang=en region=BB
Everytime|Britney Spears|2003|pop|easy|hum lang=en region=US
Sometimes|Britney Spears|1999|pop|easy|hum lang=en region=US
You Know I'm No Good|Amy Winehouse|2006|rnb|medium|hum lang=en region=GB
Everybody's Changing|Keane|2003|rock|easy|hum lang=en region=GB
The Drugs Don't Work|The Verve|1997|rock|medium|hum lang=en region=GB
Fake Plastic Trees|Radiohead|1995|rock|medium|hum lang=en region=GB
High and Dry|Radiohead|1995|rock|easy|hum lang=en region=GB
Rockferry|Duffy|2007|rnb|medium|hum lang=en region=GB
Mercy|Duffy|2008|rnb|easy|hum lang=en region=GB
Warwick Avenue|Duffy|2008|rnb|easy|hum lang=en region=GB
Goodbye My Lover|James Blunt|2004|pop|easy|hum lang=en region=GB
1973|James Blunt|2007|pop|easy|hum lang=en region=GB
The Blower's Daughter|Damien Rice|2002|indie|medium|hum lang=en region=IE
Cannonball|Damien Rice|2002|indie|medium|hum lang=en region=IE
Set the Fire to the Third Bar|Snow Patrol feat. Martha Wainwright|2006|rock|medium|hum lang=en region=GB
It's Not Unusual|Tom Jones|1965|oldies|easy|hum lang=en region=GB
Delilah|Tom Jones|1968|oldies|easy|hum lang=en region=GB
Baby Can I Hold You|Tracy Chapman|1988|folk|easy|hum lang=en region=US
Talkin' Bout a Revolution|Tracy Chapman|1988|folk|easy|hum lang=en region=US
Ode to My Family|The Cranberries|1994|rock|easy|hum lang=en region=IE
Truly Madly Deeply|Savage Garden|1997|pop|easy|hum lang=en region=AU
I Knew I Loved You|Savage Garden|1999|pop|easy|hum lang=en region=AU
To the Moon and Back|Savage Garden|1996|pop|easy|hum lang=en region=AU
Never Tear Us Apart|INXS|1987|rock|easy|hum lang=en region=AU
Beds Are Burning|Midnight Oil|1987|rock|easy|hum lang=en region=AU
Are You Gonna Be My Girl|Jet|2003|rock|easy|hum lang=en region=AU
Look What You've Done|Jet|2003|rock|medium|hum lang=en region=AU
Johnny B. Goode|Chuck Berry|1958|oldies|easy|hum lang=en region=US
Great Balls of Fire|Jerry Lee Lewis|1957|oldies|easy|hum lang=en region=US
Peggy Sue|Buddy Holly|1957|oldies|easy|hum lang=en region=US
Wake Up Little Susie|The Everly Brothers|1957|oldies|easy|hum lang=en region=US
Radar Love|Golden Earring|1973|rock|easy|hum lang=en region=NL
You're the First, the Last, My Everything|Barry White|1974|soul|easy|hum lang=en region=US
Runaround Sue|Dion|1961|oldies|easy|hum lang=en region=US
The Wanderer|Dion|1961|oldies|easy|hum lang=en region=US
It's Your Thing|The Isley Brothers|1969|oldies|easy|hum lang=en region=US
Do You Love Me|The Contours|1962|oldies|easy|hum lang=en region=US
Walking in the Rain|The Ronettes|1964|oldies|medium|hum lang=en region=US
Da Doo Ron Ron|The Crystals|1963|oldies|medium|hum lang=en region=US
Baby Love|The Supremes|1964|oldies|easy|hum lang=en region=US
Where Did Our Love Go|The Supremes|1964|oldies|easy|hum lang=en region=US
Stop! In the Name of Love|The Supremes|1965|oldies|easy|hum lang=en region=US
Reach Out I'll Be There|Four Tops|1966|oldies|easy|hum lang=en region=US
Dancing in the Street|Martha and the Vandellas|1964|oldies|easy|hum lang=en region=US
My Guy|Mary Wells|1964|oldies|medium|hum lang=en region=US
Sugar, Sugar|The Archies|1969|oldies|easy|hum lang=en region=US
Build Me Up Buttercup|The Foundations|1968|oldies|easy|hum lang=en region=GB
Daydream Believer|The Monkees|1967|oldies|easy|hum lang=en region=US
Happy Together|The Turtles|1967|oldies|easy|hum lang=en region=US
These Boots Are Made for Walkin'|Nancy Sinatra|1966|oldies|easy|hum lang=en region=US
Oh, Pretty Woman|Roy Orbison|1964|oldies|easy|hum lang=en region=US
Son of a Preacher Man|Dusty Springfield|1968|oldies|easy|hum lang=en region=GB
River Deep – Mountain High|Ike & Tina Turner|1966|oldies|medium|hum lang=en region=US
You Really Got Me|The Kinks|1964|rock|easy|hum lang=en region=GB
All Day and All of the Night|The Kinks|1964|rock|medium|hum lang=en region=GB
Pinball Wizard|The Who|1969|rock|easy|hum lang=en region=GB
Won't Get Fooled Again|The Who|1971|rock|medium|hum lang=en region=GB
Sunshine of Your Love|Cream|1967|rock|easy|hum lang=en region=GB
White Room|Cream|1968|rock|medium|hum lang=en region=GB
Green River|Creedence Clearwater Revival|1969|rock|medium|hum lang=en region=US
Up Around the Bend|Creedence Clearwater Revival|1970|rock|medium|hum lang=en region=US
White Rabbit|Jefferson Airplane|1967|rock|easy|hum lang=en region=US
Crimson and Clover|Tommy James & the Shondells|1968|rock|medium|hum lang=en region=US
Mony Mony|Tommy James & the Shondells|1968|rock|easy|hum lang=en region=US
Gimme Some Lovin'|The Spencer Davis Group|1966|rock|easy|hum lang=en region=GB
A Whiter Shade of Pale|Procol Harum|1967|rock|easy|hum lang=en region=GB
Nights in White Satin|The Moody Blues|1967|rock|easy|hum lang=en region=GB
All Right Now|Free|1970|rock|easy|hum lang=en region=GB
The Ballroom Blitz|Sweet|1973|rock|easy|hum lang=en region=GB
Never Too Much|Luther Vandross|1981|rnb|easy|hum lang=en region=US
Starman|David Bowie|1972|rock|easy|hum lang=en region=GB
Rebel Rebel|David Bowie|1974|rock|medium|hum lang=en region=GB
Rhiannon|Fleetwood Mac|1975|rock|easy|hum lang=en region=GB
Everywhere|Fleetwood Mac|1987|pop|easy|hum lang=en region=GB
Little Lies|Fleetwood Mac|1987|pop|easy|hum lang=en region=GB
Don't Stop|Fleetwood Mac|1977|rock|easy|hum lang=en region=GB
Landslide|Fleetwood Mac|1975|rock|medium|hum lang=en region=GB
Life in the Fast Lane|Eagles|1976|rock|easy|hum lang=en region=US
New Kid in Town|Eagles|1976|rock|medium|hum lang=en region=US
Take It to the Limit|Eagles|1975|rock|medium|hum lang=en region=US
Long Train Runnin'|The Doobie Brothers|1973|rock|easy|hum lang=en region=US
Listen to the Music|The Doobie Brothers|1972|rock|easy|hum lang=en region=US
Reelin' in the Years|Steely Dan|1972|rock|medium|hum lang=en region=US
Rich Girl|Daryl Hall & John Oates|1976|pop|easy|hum lang=en region=US
You Make My Dreams|Daryl Hall & John Oates|1980|pop|easy|hum lang=en region=US
Private Eyes|Daryl Hall & John Oates|1981|pop|easy|hum lang=en region=US
December, 1963 (Oh, What a Night)|The Four Seasons|1975|pop|easy|hum lang=en region=US
American Pie|Don McLean|1971|folk|easy|hum lang=en region=US
You're So Vain|Carly Simon|1972|pop|easy|hum lang=en region=US
I Can See Clearly Now|Johnny Nash|1972|pop|easy|hum lang=en region=US
Stuck in the Middle with You|Stealers Wheel|1972|rock|easy|hum lang=en region=GB
Spirit in the Sky|Norman Greenbaum|1969|rock|easy|hum lang=en region=US
A Horse with No Name|America|1971|folk|easy|hum lang=en region=US
Come Sail Away|Styx|1977|rock|easy|hum lang=en region=US
Dust in the Wind|Kansas|1977|rock|easy|hum lang=en region=US
The Boys Are Back in Town|Thin Lizzy|1976|rock|easy|hum lang=en region=IE
Don't Bring Me Down|Electric Light Orchestra|1979|rock|easy|hum lang=en region=GB
Evil Woman|Electric Light Orchestra|1975|rock|medium|hum lang=en region=GB
Video Killed the Radio Star|The Buggles|1979|pop|easy|hum lang=en region=GB
We Are Family|Sister Sledge|1979|disco|easy|hum lang=en region=US
Ring My Bell|Anita Ward|1979|disco|easy|hum lang=en region=US
You Should Be Dancing|Bee Gees|1976|disco|easy|hum lang=en region=GB
Disco Inferno|The Trammps|1976|disco|easy|hum lang=en region=US
Upside Down|Diana Ross|1980|disco|easy|hum lang=en region=US
I'm Coming Out|Diana Ross|1980|disco|easy|hum lang=en region=US
Escape (The Piña Colada Song)|Rupert Holmes|1979|pop|easy|hum lang=en region=US
Copacabana (At the Copa)|Barry Manilow|1978|pop|easy|hum lang=en region=US
Wonderful Life|Black|1987|pop|easy|hum lang=en region=GB
Chantilly Lace|The Big Bopper|1958|oldies|easy|hum lang=en region=US
That'll Be the Day|Buddy Holly|1957|oldies|easy|hum lang=en region=US
Earth Angel|The Penguins|1954|oldies|medium|hum lang=en region=US
Only You (And You Alone)|The Platters|1955|oldies|easy|hum lang=en region=US
At the Hop|Danny & the Juniors|1957|oldies|medium|hum lang=en region=US
Substitute|The Who|1966|rock|medium|hum lang=en region=GB
I'm a Man|The Spencer Davis Group|1967|rock|medium|hum lang=en region=GB
Tuesday Afternoon|The Moody Blues|1967|rock|medium|hum lang=en region=GB
Go All the Way|Raspberries|1972|rock|medium|hum lang=en region=US
Fox on the Run|Sweet|1975|rock|easy|hum lang=en region=GB
Golden Years|David Bowie|1975|rock|easy|hum lang=en region=GB
You Make Loving Fun|Fleetwood Mac|1977|rock|easy|hum lang=en region=GB
China Grove|The Doobie Brothers|1973|rock|medium|hum lang=en region=US
Do It Again|Steely Dan|1972|rock|easy|hum lang=en region=US
Kiss on My List|Daryl Hall & John Oates|1980|pop|easy|hum lang=en region=US
Sara Smile|Daryl Hall & John Oates|1975|soul|medium|hum lang=en region=US
Dream Weaver|Gary Wright|1975|pop|easy|hum lang=en region=US
Ventura Highway|America|1972|folk|medium|hum lang=en region=US
Sister Golden Hair|America|1975|folk|easy|hum lang=en region=US
Renegade|Styx|1978|rock|medium|hum lang=en region=US
Telephone Line|Electric Light Orchestra|1976|rock|easy|hum lang=en region=GB
Pop Muzik|M|1979|pop|easy|hum lang=en region=GB
Born to Be Alive|Patrick Hernandez|1978|disco|easy|hum lang=en region=FR
Car Wash|Rose Royce|1976|funk|easy|hum lang=en region=US
He's the Greatest Dancer|Sister Sledge|1979|disco|medium|hum lang=en region=US
Boogie Oogie Oogie|A Taste of Honey|1978|disco|easy|hum lang=en region=US
I Love the Nightlife (Disco 'Round)|Alicia Bridges|1978|disco|medium|hum lang=en region=US
Ain't No Stoppin' Us Now|McFadden & Whitehead|1979|disco|easy|hum lang=en region=US
Rock the Boat|The Hues Corporation|1974|disco|easy|hum lang=en region=US
Can't Get Enough of Your Love, Babe|Barry White|1974|soul|easy|hum lang=en region=US
Kung Fu Fighting|Carl Douglas|1974|disco|easy|hum lang=en region=JM
Rock Your Baby|George McCrae|1974|disco|easy|hum lang=en region=US
Love Train|The O'Jays|1972|soul|easy|hum lang=en region=US
Play That Funky Music|Wild Cherry|1976|funk|easy|hum lang=en region=US
Give Up the Funk (Tear the Roof off the Sucker)|Parliament|1975|funk|medium|hum lang=en region=US
Atomic Dog|George Clinton|1982|funk|medium|hum lang=en region=US
Super Freak|Rick James|1981|funk|easy|hum lang=en region=US
Give It to Me Baby|Rick James|1981|funk|medium|hum lang=en region=US
Word Up!|Cameo|1986|funk|easy|hum lang=en region=US
Let's Hear It for the Boy|Deniece Williams|1984|pop|easy|hum lang=en region=US
Tired of Being Alone|Al Green|1971|soul|medium|hum lang=en region=US
Sexual Healing|Marvin Gaye|1982|soul|easy|hum lang=en region=US
Got to Give It Up|Marvin Gaye|1977|funk|easy|hum lang=en region=US
I'll Be Around|The Spinners|1972|soul|medium|hum lang=en region=US
Could It Be I'm Falling in Love|The Spinners|1972|soul|medium|hum lang=en region=US
Love Rollercoaster|Ohio Players|1975|funk|medium|hum lang=en region=US
Fire|Ohio Players|1974|funk|medium|hum lang=en region=US
Brick House|Commodores|1977|funk|easy|hum lang=en region=US
Three Times a Lady|Commodores|1978|soul|easy|hum lang=en region=US
Nightshift|Commodores|1985|soul|medium|hum lang=en region=US
Give Me the Night|George Benson|1980|funk|easy|hum lang=en region=US
Turn Your Love Around|George Benson|1981|soul|medium|hum lang=en region=US
Just the Two of Us|Grover Washington, Jr. feat. Bill Withers|1981|soul|easy|hum lang=en region=US
Forget Me Nots|Patrice Rushen|1982|funk|medium|hum lang=en region=US
Outstanding|The Gap Band|1982|funk|medium|hum lang=en region=US
You Dropped a Bomb on Me|The Gap Band|1982|funk|medium|hum lang=en region=US
And the Beat Goes On|The Whispers|1979|disco|medium|hum lang=en region=US
Let's Go Crazy|Prince|1984|rock|easy|hum lang=en region=US
1999|Prince|1982|pop|easy|hum lang=en region=US
Little Red Corvette|Prince|1983|pop|easy|hum lang=en region=US
Raspberry Beret|Prince|1985|pop|easy|hum lang=en region=US
Sign o' the Times|Prince|1987|pop|easy|hum lang=en region=US
Cream|Prince|1991|pop|easy|hum lang=en region=US
Into the Groove|Madonna|1985|pop|easy|hum lang=en region=US
Borderline|Madonna|1983|pop|easy|hum lang=en region=US
Express Yourself|Madonna|1989|pop|easy|hum lang=en region=US
Open Your Heart|Madonna|1986|pop|easy|hum lang=en region=US
Papa Don't Preach|Madonna|1986|pop|easy|hum lang=en region=US
`, { language: "en", scope: "local" }),
  de: parseSongs(`
99 Luftballons|Nena
Irgendwie, irgendwo, irgendwann|Nena
Nur geträumt|Nena
Atemlos durch die Nacht|Helene Fischer
Phänomen|Helene Fischer
Herzbeben|Helene Fischer
Achterbahn|Helene Fischer
Roller|Apache 207
Komet|Udo Lindenberg
Wildberry Lillet|Nina Chuba
Friesenjung|Ski Aggu
Traum|Cro
Easy|Cro
Einmal um die Welt|Cro
Bye Bye|Cro
Haus am See|Peter Fox
Schwarz zu Blau|Peter Fox
Alles Neu|Peter Fox
Tage wie diese|Die Toten Hosen
Altes Fieber|Die Toten Hosen
Hier kommt Alex|Die Toten Hosen
Bonnie & Clyde|Die Toten Hosen
An Tagen wie diesen|Die Toten Hosen
Ein Kompliment|Sportfreunde Stiller
Applaus, Applaus|Sportfreunde Stiller
Ich, Roque|Sportfreunde Stiller
Lieblingsmensch|Namika
Je ne parle pas français|Namika
Barfuß am Klavier|AnnenMayKantereit
Pocahontas|AnnenMayKantereit
Oft gefragt|AnnenMayKantereit
Nur noch kurz die Welt retten|Tim Bendzko
Keine Maschine|Tim Bendzko
Wenn Worte meine Sprache wären|Tim Bendzko
Das Beste|Silbermond
Symphonie|Silbermond
Irgendwas bleibt|Silbermond
Leichtes Gepäck|Silbermond
Durch den Monsun|Tokio Hotel
Schrei|Tokio Hotel
Rette mich|Tokio Hotel
Astronaut|Sido
Bilder im Kopf|Sido
Mein Block|Sido
Schlechtes Vorbild|Sido
Auf uns|Andreas Bourani
Bourani|Andreas Bourani
Major Tom (Völlig losgelöst)|Peter Schilling
Verdammt, ich lieb' dich|Matthias Reim
Sonderzug nach Pankow|Udo Lindenberg
Cello|Udo Lindenberg
Jeanny|Falco
Rock Me Amadeus|Falco
Out of the Dark|Falco
Der Kommissar|Falco
Griechischer Wein|Udo Jürgens
Aber bitte mit Sahne|Udo Jürgens
Ich war noch niemals in New York|Udo Jürgens
Mit 66 Jahren|Udo Jürgens
Marmor, Stein und Eisen bricht|Drafi Deutscher
Skandal im Sperrbezirk|Spider Murphy Gang
Schickeria|Spider Murphy Gang
Du hast|Rammstein
Sonne|Rammstein
Engel|Rammstein
Deutschland|Rammstein
Ich will|Rammstein
Mein Herz brennt|Rammstein
Ein Bett im Kornfeld|Jürgen Drews
Sierra Madre|Schürzenjäger
Wahnsinn|Wolfgang Petry
Verlieben, verloren, vergessen, verzeih'n|Wolfgang Petry
Ruhrgebiet|Wolfgang Petry
Fliegerlied (So ein schöner Tag)|Donikkl
Ein Stern (der deinen Namen trägt)|DJ Ötzi
Anton aus Tirol|DJ Ötzi
Hey Baby|DJ Ötzi
Bruttosozialprodukt|Geier Sturzflug
Über sieben Brücken musst du gehn|Peter Maffay
Hupf in Gatsch|Georg Danzer
Lass uns gehen|Revolverheld
Halt dich an mir fest|Revolverheld
Ich lass für dich das Licht an|Revolverheld
Emanuela|Fettes Brot
Jein|Fettes Brot
Chöre|Mark Forster
Au revoir|Mark Forster
Bauch und Kopf|Mark Forster
Sowieso|Mark Forster
Geiles Leben|Glasperlenspiel
Lila Wolken|Marteria
Kids (2 Finger an den Kopf)|Marteria
Ohne mein Team|BONEZ MC
Palmen aus Plastik|BONEZ MC
Willst du|Alligatoah
Du weinst keine Träne um mir|Die Ärzte
Schrei nach Liebe|Die Ärzte
Westerland|Die Ärzte
Männer sind Schweine|Die Ärzte
Junge|Die Ärzte
Erfolg ist nicht alles|Cro
Ich will 'nen Cowboy als Mann|Gitte Hænning|1963|schlager|easy|hum lang=de region=DE
Mendocino|Michael Holm|1969|schlager|easy|hum lang=de region=DE
Wunder gibt es immer wieder|Katja Ebstein|1970|schlager|easy|hum lang=de region=DE
Schöne Maid|Tony Marshall|1971|schlager|easy|hum lang=de region=DE
Eine neue Liebe ist wie ein neues Leben|Jürgen Marcus|1972|schlager|easy|hum lang=de region=DE
Heute hier, morgen dort|Hannes Wader|1972|folk|medium|hum lang=de region=DE
Über den Wolken|Reinhard Mey|1974|folk|easy|hum lang=de region=DE
Jugendliebe|Ute Freudenberg|1980|pop|easy|hum lang=de region=DE
Der Mussolini|Deutsch Amerikanische Freundschaft|1981|dance|medium|hum lang=de region=DE
Neue Männer braucht das Land|Ina Deter Band|1982|pop|easy|hum lang=de region=DE
Ich will Spaß|Markus|1982|pop|easy|hum lang=de region=DE
1000 und 1 Nacht (Zoom!)|Klaus Lage|1984|rock|easy|hum lang=de region=DE
König von Deutschland|Rio Reiser|1986|rock|easy|hum lang=de region=DE
Kein Schwein ruft mich an|Max Raabe & Palast Orchester|1992|jazz|easy|hum lang=de region=DE
Du liebst mich nicht|Sabrina Setlur|1997|rap|easy|nohum lang=de region=DE
Guildo hat euch lieb!|Guildo Horn|1998|schlager|easy|hum lang=de region=DE
Warum|Juli|2004|rock|easy|hum lang=de region=DE
36grad|2raumwohnung|2007|pop|easy|hum lang=de region=DE
Übers Ende der Welt|Tokio Hotel|2007|rock|easy|hum lang=de region=DE
Allein Allein|Polarkreis 18|2008|indie|easy|hum lang=de region=DE
Oh Jonny|Jan Delay|2009|funk|easy|hum lang=de region=DE
Still|Jupiter Jones|2011|rock|easy|hum lang=de region=DE
Liebe ist meine Rebellion|Frida Gold|2013|pop|easy|hum lang=de region=DE
Auf anderen Wegen|Andreas Bourani|2014|pop|easy|hum lang=de region=DE
Herz über Kopf|Joris|2015|pop|easy|hum lang=de region=DE
Hoch|Tim Bendzko|2019|pop|easy|hum lang=de region=DE
194 Länder|Mark Forster|2019|pop|easy|hum lang=de region=DE
Wunder|AYLIVA & Apache 207|2024|pop|easy|hum lang=de region=DE
Bauch Beine Po|Shirin David|2024|rap|easy|nohum lang=de region=DE
Sommergewitter|Pashanim|2021|rap|easy|nohum lang=de region=DE
Zukunft Pink|Peter Fox feat. Inéz|2022|rap|easy|hum lang=de region=DE
Cordula Grün|Josh.|2018|pop|easy|hum lang=de region=AT
Wenn sie tanzt|Max Giesinger|2016|pop|easy|hum lang=de region=DE
Musik sein|Wincent Weiss|2016|pop|easy|hum lang=de region=DE
80 Millionen|Max Giesinger|2016|pop|easy|hum lang=de region=DE
Wie schön du bist|Sarah Connor|2015|pop|easy|hum lang=de region=DE
Hulapalu|Andreas Gabalier|2015|schlager|medium|hum lang=de region=AT
Ham kummst|Seiler und Speer|2015|pop|easy|hum lang=de region=AT
Mensch|Herbert Grönemeyer|2002|pop|easy|hum lang=de region=DE
Perfekte Welle|Juli|2004|rock|easy|hum lang=de region=DE
Nur ein Wort|Wir sind Helden|2005|indie|easy|hum lang=de region=DE
Vom selben Stern|Ich + Ich|2007|pop|easy|hum lang=de region=DE
Geboren um zu leben|Unheilig|2010|pop|easy|hum lang=de region=DE
Leider geil|Deichkind|2012|rap|easy|nohum lang=de region=DE
Die Da!?|Die Fantastischen Vier|1992|rap|easy|nohum lang=de region=DE
Zu spät|Die Ärzte|1984|punk|easy|hum lang=de region=DE
Männer|Herbert Grönemeyer|1984|rock|easy|hum lang=de region=DE
Was soll das|Herbert Grönemeyer|1988|rock|easy|hum lang=de region=DE
Kinder an die Macht|Herbert Grönemeyer|1986|rock|medium|hum lang=de region=DE
Der Weg|Herbert Grönemeyer|2002|pop|easy|hum lang=de region=DE
Musik nur, wenn sie laut ist|Herbert Grönemeyer|1983|rock|medium|hum lang=de region=DE
Land unter|Herbert Grönemeyer|1998|rock|medium|hum lang=de region=DE
Alles klar auf der Andrea Doria|Udo Lindenberg|1973|rock|medium|hum lang=de region=DE
Horizont|Udo Lindenberg|1986|rock|easy|hum lang=de region=DE
Ein Herz kann man nicht reparieren|Udo Lindenberg|1991|rock|medium|hum lang=de region=DE
Mein Ding|Udo Lindenberg|2002|rock|medium|hum lang=de region=DE
Wozu sind Kriege da?|Udo Lindenberg & Pascal|1981|rock|medium|hum lang=de region=DE
Und es war Sommer|Peter Maffay|1976|rock|easy|hum lang=de region=DE
Sonne in der Nacht|Peter Maffay|1985|rock|medium|hum lang=de region=DE
Eiszeit|Peter Maffay|1980|rock|easy|hum lang=de region=DE
Willenlos|Marius Müller-Westernhagen|1994|rock|easy|hum lang=de region=DE
Mit Pfefferminz bin ich dein Prinz|Marius Müller-Westernhagen|1978|rock|easy|hum lang=de region=DE
Weil ich dich liebe|Marius Müller-Westernhagen|1989|rock|easy|hum lang=de region=DE
Es geht mir gut|Marius Müller-Westernhagen|1994|rock|medium|hum lang=de region=DE
Wieder hier|Marius Müller-Westernhagen|1998|rock|medium|hum lang=de region=DE
Goldener Reiter|Joachim Witt|1981|pop|easy|hum lang=de region=DE
Terra Titanic|Peter Schilling|1984|pop|medium|hum lang=de region=DE
Sternenhimmel|Hubert Kah|1982|pop|easy|hum lang=de region=DE
Berlin|Ideal|1980|rock|medium|hum lang=de region=DE
Polizisten|Extrabreit|1981|rock|medium|hum lang=de region=DE
Pure Lust am Leben|Geier Sturzflug|1984|pop|easy|hum lang=de region=DE
Sommer in der Stadt|Spider Murphy Gang|1982|rock|medium|hum lang=de region=DE
Herz ist Trumpf (Dann rufst du an...)|Trio|1983|pop|medium|hum lang=de region=DE
Carbonara|Spliff|1982|pop|easy|hum lang=de region=DE
Ohne dich (schlaf ich heut Nacht nicht ein)|Münchener Freiheit|1985|pop|easy|hum lang=de region=DE
Tausendmal du|Münchener Freiheit|1986|pop|easy|hum lang=de region=DE
Solang' man Träume noch leben kann|Münchener Freiheit|1987|pop|easy|hum lang=de region=DE
Du musst ein Schwein sein|Die Prinzen|1995|pop|easy|hum lang=de region=DE
Lasse redn|Die Ärzte|2007|punk|easy|hum lang=de region=DE
Unrockbar|Die Ärzte|2003|punk|easy|hum lang=de region=DE
Deine Schuld|Die Ärzte|2004|punk|medium|hum lang=de region=DE
Wünsch dir was|Die Toten Hosen|1993|punk|easy|hum lang=de region=DE
Steh auf, wenn du am Boden bist|Die Toten Hosen|2002|punk|medium|hum lang=de region=DE
Bayern|Die Toten Hosen|2000|punk|easy|hum lang=de region=DE
Der blaue Planet|Karat|1982|rock|easy|hum lang=de region=DE
Wenn ein Mensch lebt|Puhdys|1973|rock|easy|hum lang=de region=DE
Gib mir Sonne|Rosenstolz|2008|pop|easy|hum lang=de region=DE
Regen und Meer|Juli|2004|pop|medium|hum lang=de region=DE
Kartenhaus|Silbermond|2006|pop|medium|hum lang=de region=DE
Durch die Nacht|Silbermond|2004|pop|medium|hum lang=de region=DE
Pflaster|Ich + Ich|2009|pop|easy|hum lang=de region=DE
Du erinnerst mich an Liebe|Ich + Ich|2005|pop|medium|hum lang=de region=DE
'54, '74, '90, 2006|Sportfreunde Stiller|2006|rock|easy|hum lang=de region=DE
Gekommen um zu bleiben|Wir sind Helden|2005|indie|easy|hum lang=de region=DE
Dickes B|Seeed feat. Black Kappa|2001|reggae|easy|hum lang=de region=DE
Stadtaffe|Peter Fox|2008|rap|medium|nohum lang=de region=DE
Arbeit nervt|Deichkind|2008|rap|easy|nohum lang=de region=DE
Sie ist weg|Die Fantastischen Vier|1995|rap|easy|nohum lang=de region=DE
Schwule Mädchen|Fettes Brot|2001|rap|easy|nohum lang=de region=DE
Augen auf|Sido|2008|rap|medium|nohum lang=de region=DE
Muttersprache|Sarah Connor|2015|pop|easy|hum lang=de region=DE
Flash mich|Mark Forster|2014|pop|easy|hum lang=de region=DE
Junge Roemer|Falco|1984|pop|medium|hum lang=de region=AT
Strada del Sole|Rainhard Fendrich|1981|pop|easy|hum lang=de region=AT
Weus'd a Herz hast wie a Bergwerk|Rainhard Fendrich|1983|pop|easy|hum lang=de region=AT
Zwickt's mi|Wolfgang Ambros|1975|rock|easy|hum lang=de region=AT
Irgendwann bleib i dann dort|STS|1985|rock|easy|hum lang=de region=AT
Ba-Ba-Banküberfall|Erste Allgemeine Verunsicherung|1985|pop|easy|hum lang=de region=AT
Küss die Hand, schöne Frau|Erste Allgemeine Verunsicherung|1987|pop|easy|hum lang=de region=AT
Bussi Baby|Wanda|2015|indie|medium|hum lang=de region=AT
W. Nuss vo Bümpliz|Patent Ochsner|1997|rock|easy|hum lang=de region=CH
Scharlachrot|Patent Ochsner|1991|rock|easy|hum lang=de region=CH
I schänke dir mis Härz|Züri West|1989|rock|easy|hum lang=de region=CH
Louenesee|Span|1982|rock|easy|hum lang=de region=CH
Campari Soda|Taxi|1977|pop|easy|hum lang=de region=CH
Alperose|Polo Hofer & Die Schmetterband|1985|folk|easy|hum lang=de region=CH
Kiosk|Rumpelstilz|1976|rock|easy|hum lang=de region=CH
079|Lo & Leduc|2018|pop|easy|hum lang=de region=CH
Hey|Andreas Bourani|2014|pop|medium|hum lang=de region=DE
Schüttel deinen Speck|Peter Fox|2008|rap|medium|nohum lang=de region=DE
Denkmal|Wir sind Helden|2003|indie|medium|hum lang=de region=DE
Da Da Da|Trio|1982|pop|medium|hum lang=de region=DE
200 km/h|Apache 207|2019|rap|medium|nohum lang=de region=DE
I sing a Liad für di|Andreas Gabalier|2010|schlager|medium|hum lang=de region=AT
Nur zu Besuch|Die Toten Hosen|2002|punk|medium|hum lang=de region=DE
Alles aus Liebe|Die Toten Hosen|1993|punk|easy|hum lang=de region=DE
Zehn kleine Jägermeister|Die Toten Hosen|1996|punk|easy|hum lang=de region=DE
Manchmal haben Frauen|Die Ärzte|2000|punk|easy|hum lang=de region=DE
Leuchtturm|Nena|1983|pop|easy|hum lang=de region=DE
Vienna Calling|Falco|1985|pop|easy|hum lang=de region=AT
Bochum|Herbert Grönemeyer|1984|rock|easy|hum lang=de region=DE
Halt mich|Herbert Grönemeyer|1988|rock|easy|hum lang=de region=DE
Flugzeuge im Bauch|Herbert Grönemeyer|1984|rock|easy|hum lang=de region=DE
Ja|Silbermond|2009|pop|medium|hum lang=de region=DE
Elektrisches Gefühl|Juli|2010|pop|medium|hum lang=de region=DE
Dieses Leben|Juli|2006|pop|easy|hum lang=de region=DE
Geile Zeit|Juli|2004|pop|easy|hum lang=de region=DE
Ding|Seeed|2005|reggae|easy|hum lang=de region=DE
Aufstehn!|Seeed|2005|reggae|easy|hum lang=de region=DE
Augenbling|Seeed|2012|reggae|easy|hum lang=de region=DE
Ozean|AnnenMayKantereit|2018|indie|easy|hum lang=de region=DE
Feuerwerk|Wincent Weiss|2017|pop|easy|hum lang=de region=DE
An Wunder|Wincent Weiss|2018|pop|easy|hum lang=de region=DE
Legenden|Max Giesinger|2018|pop|easy|hum lang=de region=DE
Sonnenbank Flavour|Bushido|2006|rap|medium|nohum lang=de region=DE
Bologna|Wanda|2015|indie|easy|hum lang=de region=AT
Columbo|Wanda|2017|indie|easy|hum lang=de region=AT
Ich lebe|Christina Stürmer|2003|pop|easy|hum lang=de region=AT
Millionen Lichter|Christina Stürmer|2013|pop|easy|hum lang=de region=AT
Macho Macho|Rainhard Fendrich|1988|pop|easy|hum lang=de region=AT
I Am from Austria|Rainhard Fendrich|1989|pop|easy|hum lang=de region=AT
Schifoan|Wolfgang Ambros|1976|rock|easy|hum lang=de region=AT
Es lebe der Zentralfriedhof|Wolfgang Ambros|1975|rock|easy|hum lang=de region=AT
Da Hofa|Wolfgang Ambros|1971|rock|easy|hum lang=de region=AT
Pack die Badehose ein|Cornelia Froboess|1951|oldies|easy|hum lang=de region=DE
Am Tag als Conny Kramer starb|Juliane Werding|1972|schlager|easy|hum lang=de region=DE
Ein bisschen Frieden|Nicole|1982|pop|easy|hum lang=de region=DE
Kleine Taschenlampe brenn|Markus|1983|pop|easy|hum lang=de region=DE
Ich bin wie du|Marianne Rosenberg|1975|schlager|easy|hum lang=de region=DE
Er gehört zu mir|Marianne Rosenberg|1975|schlager|easy|hum lang=de region=DE
Moskau|Dschinghis Khan|1979|dance|easy|hum lang=de region=DE
Dschinghis Khan|Dschinghis Khan|1979|dance|easy|hum lang=de region=DE
Du|Peter Maffay|1970|pop|easy|hum lang=de region=DE
Am Fenster|City|1978|rock|easy|hum lang=de region=DE
Stark|Ich + Ich|2007|pop|easy|hum lang=de region=DE
So soll es bleiben|Ich + Ich|2008|pop|easy|hum lang=de region=DE
Guten Tag|Wir sind Helden|2002|indie|easy|hum lang=de region=DE
Dieser Weg|Xavier Naidoo|2005|pop|easy|hum lang=de region=DE
Sie sieht mich nicht|Xavier Naidoo|1999|pop|medium|hum lang=de region=DE
Was wir alleine nicht schaffen|Xavier Naidoo|2005|pop|easy|hum lang=de region=DE
Wunder geschehen|Nena|1989|pop|easy|hum lang=de region=DE
Liebe ist|Nena|2005|pop|easy|hum lang=de region=DE
Himmel auf|Silbermond|2012|pop|easy|hum lang=de region=DE
Mutter|Rammstein|2001|metal|medium|hum lang=de region=DE
MfG|Die Fantastischen Vier|1999|rap|easy|nohum lang=de region=DE
Troy|Die Fantastischen Vier|2004|rap|medium|nohum lang=de region=DE
Nessaja|Scooter|2002|dance|easy|hum lang=de region=DE
Millionär|Die Prinzen|1991|pop|easy|hum lang=de region=DE
Alles nur geklaut|Die Prinzen|1993|pop|easy|hum lang=de region=DE
Küssen verboten|Die Prinzen|1992|pop|easy|hum lang=de region=DE
Abenteuerland|PUR|1995|pop|easy|hum lang=de region=DE
Lena|PUR|1990|pop|easy|hum lang=de region=DE
Und wenn ein Lied|Söhne Mannheims|2004|pop|easy|hum lang=de region=DE
Ich bin ich|Rosenstolz|2006|pop|easy|hum lang=de region=DE
Liebe ist alles|Rosenstolz|2004|pop|easy|hum lang=de region=DE
Jetzt ist Sommer|Wise Guys|2001|pop|easy|hum lang=de region=DE
Schönste Zeit|Bosse|2013|indie|easy|hum lang=de region=DE
Lieder|Adel Tawil|2013|pop|easy|hum lang=de region=DE
Ist da jemand|Adel Tawil|2017|pop|easy|hum lang=de region=DE
Wovon sollen wir träumen|Frida Gold|2011|pop|easy|hum lang=de region=DE
An guten Tagen|Johannes Oerding|2019|pop|easy|hum lang=de region=DE
Vincent|Sarah Connor|2019|pop|easy|hum lang=de region=DE
Jenseits von Eden|Nino de Angelo|1983|schlager|easy|hum lang=de region=DE
Santa Maria|Roland Kaiser|1980|schlager|easy|hum lang=de region=DE
Hello Again|Howard Carpendale|1984|schlager|easy|hum lang=de region=DE
Hurra, hurra, die Schule brennt|Extrabreit|1980|punk|easy|hum lang=de region=DE
Blaue Augen|Ideal|1980|rock|easy|hum lang=de region=DE
Remmidemmi|Deichkind|2006|rap|easy|nohum lang=de region=DE
Delmenhorst|Element of Crime|2005|indie|medium|hum lang=de region=DE
Verdamp lang her|BAP|1981|rock|easy|hum lang=de region=DE
Bad Chick|Cro|2014|rap|medium|nohum lang=de region=DE
Engel fliegen einsam|Christina Stürmer|2005|pop|medium|hum lang=de region=AT
Josie|Peter Maffay|1975|rock|medium|hum lang=de region=DE
Alt wie ein Baum|Karat|1976|rock|easy|hum lang=de region=DE
Der letzte Tag|Tokio Hotel|2006|rock|medium|hum lang=de region=DE
Spring nicht|Tokio Hotel|2007|rock|medium|hum lang=de region=DE
Nie vergessen|Glasperlenspiel|2013|pop|medium|hum lang=de region=DE
Keinen Zentimeter|Clueso|2008|pop|medium|hum lang=de region=DE
Ich will nicht nach Berlin|Kraftklub|2011|indie|medium|hum lang=de region=DE
Bück dich hoch|Deichkind|2012|rap|medium|nohum lang=de region=DE
Geh davon aus|Söhne Mannheims|2000|pop|easy|hum lang=de region=DE
Hamma!|Culcha Candela|2007|rap|easy|nohum lang=de region=DE
Monsta|Culcha Candela|2009|pop|easy|hum lang=de region=DE
Freiheit|Marius Müller-Westernhagen|1987|rock|easy|hum lang=de region=DE
Sexy|Marius Müller-Westernhagen|1989|rock|easy|hum lang=de region=DE
Currywurst|Herbert Grönemeyer|1982|rock|medium|hum lang=de region=DE
Taximann|Marius Müller-Westernhagen|1975|rock|medium|hum lang=de region=DE
Monotonie|Ideal|1982|rock|medium|hum lang=de region=DE
Indianer|PUR|1993|pop|medium|hum lang=de region=DE
Funkelperlenaugen|PUR|1988|pop|medium|hum lang=de region=DE
Mann im Mond|Die Prinzen|1991|pop|medium|hum lang=de region=DE
Kristallnaach|BAP|1982|rock|easy|hum lang=de region=DE
Do kanns zaubere|BAP|1982|rock|easy|hum lang=de region=DE
Bataillon d'Amour|Silly|1986|rock|medium|hum lang=de region=DE
Ich geh in Flammen auf|Rosenstolz|2006|pop|medium|hum lang=de region=DE
Zerrissen|Juli|2006|pop|medium|hum lang=de region=DE
Freunde bleiben|Revolverheld|2005|rock|medium|hum lang=de region=DE
Chicago|Clueso|2006|pop|medium|hum lang=de region=DE
Gewinner|Clueso|2008|pop|medium|hum lang=de region=DE
Aurélie|Wir sind Helden|2003|indie|medium|hum lang=de region=DE
Müssen nur wollen|Wir sind Helden|2003|indie|medium|hum lang=de region=DE
Songs für Liam|Kraftklub|2012|indie|medium|hum lang=de region=DE
Schüsse in die Luft|Kraftklub|2014|indie|medium|hum lang=de region=DE
Tag am Meer|Die Fantastischen Vier|1993|rap|medium|nohum lang=de region=DE
Ernten was wir säen|Die Fantastischen Vier|2007|rap|medium|nohum lang=de region=DE
Tausend Tattoos|Sido|2018|rap|easy|hum lang=de region=DE
Whatever|Cro|2013|rap|easy|hum lang=de region=DE
Melodie|Cro|2014|rap|easy|hum lang=de region=DE
Im Ascheregen|Casper|2013|rap|medium|nohum lang=de region=DE
Hinterland|Casper|2013|rap|medium|hum lang=de region=DE
Welt der Wunder|Marteria|2014|rap|medium|hum lang=de region=DE
Leiser|LEA|2017|pop|easy|hum lang=de region=DE
Immer wenn wir uns sehn|LEA & Cyril|2018|pop|easy|hum lang=de region=DE
Jö schau|Georg Danzer|1975|folk|easy|hum lang=de region=AT
Überdosis G'fühl|STS|1984|rock|medium|hum lang=de region=AT
Kalt und kälter|STS|1985|rock|medium|hum lang=de region=AT
Märchenprinz|Erste Allgemeine Verunsicherung|1984|pop|easy|hum lang=de region=AT
Ding Dong|Erste Allgemeine Verunsicherung|1990|pop|easy|hum lang=de region=AT
Nie genug|Christina Stürmer|2006|pop|easy|hum lang=de region=AT
Scherbenmeer|Christina Stürmer|2007|rock|medium|hum lang=de region=AT
Heast as nit|Hubert von Goisern|1992|folk|easy|hum lang=de region=AT
Koa Hiatamadl|Hubert von Goisern|1992|folk|easy|hum lang=de region=AT
Brenna tuats guat|Hubert von Goisern|2011|folk|easy|hum lang=de region=AT
Heimweh|Plüsch|2002|pop|easy|hum lang=de region=CH
Schwan|Gölä|1998|rock|easy|hum lang=de region=CH
Bring en hei|Baschi|2006|pop|easy|hum lang=de region=CH
`, { language: "de", scope: "local" }),
  es: parseSongs(`
La Bamba|Ritchie Valens
El Perdedor|Enrique Iglesias
Duele El Corazón|Enrique Iglesias
Súbeme La Radio|Enrique Iglesias
Vivir Mi Vida|Marc Anthony
Valió la Pena|Marc Anthony
Flor Pálida|Marc Anthony
La Camisa Negra|Juanes
A Dios le Pido|Juanes
Me Enamora|Juanes
Es Por Ti|Juanes
Waka Waka (Esto es África)|Shakira
La Tortura|Shakira
Chantaje|Shakira
Ciega, Sordomuda|Shakira
Inevitable|Shakira
Mi Gente|J Balvin
Ay Vamos|J Balvin
Ginza|J Balvin
Safari|J Balvin
Pepas|Farruko
Calma|Pedro Capó
Despechá|ROSALÍA
Con Altura|ROSALÍA
Malamente|ROSALÍA
Todo de Ti|Rauw Alejandro
Baila Conmigo|Rauw Alejandro
La Bachata|Manuel Turizo
El Merengue|Manuel Turizo
Provenza|Karol G
Tusa|Karol G
Bichota|Karol G
TQG|Karol G
Tití Me Preguntó|Bad Bunny
Dákiti|Bad Bunny
Mía|Bad Bunny
Callaíta|Bad Bunny
Me Porto Bonito|Bad Bunny
Hawái|Maluma
Felices los 4|Maluma
Corazón|Maluma
Borro Cassette|Maluma
Robarte un Beso|Carlos Vives
La Bicicleta|Carlos Vives
Fruta Fresca|Carlos Vives
Volví a Nacer|Carlos Vives
Corazón Partío|Alejandro Sanz
Amiga Mía|Alejandro Sanz
Mi Soledad y Yo|Alejandro Sanz
La Flaca|Jarabe de Palo
Depende|Jarabe de Palo
Bonito|Jarabe de Palo
Agua|Jarabe de Palo
Eres Tú|Mocedades
Rayando El Sol|Maná
Clavado En Un Bar|Maná
En El Muelle De San Blas|Maná
Labios Compartidos|Maná
Oye Mi Amor|Maná
Mariposa Traicionera|Maná
La Copa de la Vida|Ricky Martin
María|Ricky Martin
Vente Pa' Ca|Ricky Martin
El Perdón|Nicky Jam
Hasta el Amanecer|Nicky Jam
Travesuras|Nicky Jam
Bamboléo|Gipsy Kings
Volare|Gipsy Kings
Djobi Djoba|Gipsy Kings
Dile|Don Omar
Taboo|Don Omar
Con Calma|Daddy Yankee
Limbo|Daddy Yankee
Échame La Culpa|Luis Fonsi
Querida|Juan Gabriel
Hasta Que Te Conocí|Juan Gabriel
Amor Eterno|Juan Gabriel
El Rey|Vicente Fernández
Volver, Volver|Vicente Fernández
Hermoso Cariño|Vicente Fernández
Bésame Mucho|Consuelo Velázquez
Pedro|Raffaella Carrà
Aserejé|Las Ketchup
Amante Bandido|Miguel Bosé
Devuélveme a mi chica|Hombres G
Marta tiene un marcapasos|Hombres G
Lamento Boliviano|Enanitos Verdes
De Música Ligera|Soda Stereo
Persiana Americana|Soda Stereo
Trátame Suavemente|Soda Stereo
Color Esperanza|Diego Torres
Me Voy|Julieta Venegas|2006|pop|easy|hum lang=es region=MX
Limón y Sal|Julieta Venegas
Andar Conmigo|Julieta Venegas
Suavemente|Elvis Crespo
Oye Como Va|Celia Cruz
La Vida Es Un Carnaval|Celia Cruz
La Negra Tiene Tumbao|Celia Cruz
El Cantante|Héctor Lavoe
Llorarás|Oscar D'León
Mi Gran Noche|Raphael|1967|oldies|easy|lang=es region=ES hum
Porque Te Vas|Jeanette|1974|pop|easy|lang=es region=ES hum
Vivir Así Es Morir de Amor|Camilo Sesto|1978|pop|easy|lang=es region=ES hum
Como una Ola|Rocío Jurado|1981|pop|easy|lang=es region=ES hum
¿Y Cómo Es Él?|José Luis Perales|1982|pop|easy|lang=es region=ES hum
Cadillac Solitario|Loquillo y Los Trogloditas|1983|rock|medium|lang=es region=ES hum
Lobo-Hombre en París|La Unión|1984|rock|easy|lang=es region=ES hum
El Baile de los Que Sobran|Los Prisioneros|1986|rock|easy|lang=es region=CL hum
Lucha de Gigantes|Nacha Pop|1987|rock|easy|lang=es region=ES hum
Resistiré|Dúo Dinámico|1988|pop|easy|lang=es region=ES hum
20 de Abril|Celtas Cortos|1991|folk|easy|lang=es region=ES hum
Y Nos Dieron las Diez|Joaquín Sabina|1992|pop|easy|lang=es region=ES hum
Mío|Paulina Rubio|1992|pop|easy|lang=es region=MX hum
El Sitio de Mi Recreo|Antonio Vega|1994|pop|medium|lang=es region=ES hum
Piel Morena|Thalía|1995|latin|easy|lang=es region=MX hum
Flaca|Andrés Calamaro|1997|rock|easy|lang=es region=AR hum
Cómo Hablar|Amaral|2000|pop|easy|lang=es region=ES hum
Antes Muerta Que Sencilla|María Isabel|2004|pop|easy|lang=es region=ES hum
Atrévete-Te-Te|Calle 13|2005|rap|medium|lang=es region=PR nohum
Todos Me Miran|Gloria Trevi|2006|pop|easy|lang=es region=MX hum
No Puedo Vivir Sin Ti|Los Ronaldos|2007|rock|easy|lang=es region=ES hum
Tenía Tanto Que Darte|Nena Daconte|2008|pop|easy|lang=es region=ES hum
Hasta la Raíz|Natalia Lafourcade|2015|pop|easy|lang=es region=MX hum
Tu Falta de Querer|Mon Laferte|2015|pop|easy|lang=es region=CL hum
Me Rehúso|Danny Ocean|2016|latin|easy|lang=es region=VE hum
Lo Malo|Aitana & Ana Guerra|2018|pop|easy|lang=es region=ES hum
Ay Mamá|Rigoberta Bandini|2021|pop|easy|lang=es region=ES hum
Si Antes Te Hubiera Conocido|Karol G|2024|latin|easy|hum lang=es region=CO
BAILE INoLVIDABLE|Bad Bunny|2025|latin|easy|hum lang=es region=PR
DtMF|Bad Bunny|2025|latin|easy|hum lang=es region=PR
Gata Only|FloyyMenor & Cris MJ|2024|latin|easy|hum lang=es region=CL
Ohnana|Kapo|2024|latin|easy|hum lang=es region=CO
Ella Baila Sola|Eslabon Armado & Peso Pluma|2023|latin|easy|hum lang=es region=US
un x100to|Grupo Frontera & Bad Bunny|2023|latin|easy|hum lang=es region=US
Shakira: Bzrp Music Sessions, Vol. 53|Bizarrap & Shakira|2023|dance|easy|hum lang=es region=CO
Quevedo: Bzrp Music Sessions, Vol. 52|Bizarrap & Quevedo|2022|dance|easy|hum lang=es region=ES
LALA|Myke Towers|2023|latin|easy|hum lang=es region=PR
Yandel 150|Yandel & Feid|2022|latin|easy|hum lang=es region=PR
Perro Negro|Bad Bunny & Feid|2023|latin|easy|hum lang=es region=PR
Te Felicito|Shakira & Rauw Alejandro|2022|latin|easy|hum lang=es region=CO
Yo Perreo Sola|Bad Bunny|2020|latin|easy|hum lang=es region=PR
Dura|Daddy Yankee|2018|latin|easy|hum lang=es region=PR
Como la Flor|Selena|1992|latin|easy|hum lang=es region=US
Obsesión|Aventura|2002|latin|easy|hum lang=es region=US
Rosas|La Oreja de Van Gogh|2003|pop|easy|hum lang=es region=ES
Hijo de la luna|Mecano|1986|pop|easy|hum lang=es region=ES
Entre dos tierras|Héroes del Silencio|1990|rock|easy|hum lang=es region=ES
Ave María|David Bisbal|2002|latin|easy|hum lang=es region=ES
Bulería|David Bisbal|2004|latin|easy|hum lang=es region=ES
La Playa|La Oreja de Van Gogh|2000|pop|easy|hum lang=es region=ES
Muñeca de Trapo|La Oreja de Van Gogh|2006|pop|easy|hum lang=es region=ES
Como Camarón|Estopa|1999|rock|easy|hum lang=es region=ES
La Raja de Tu Falda|Estopa|1999|rock|easy|hum lang=es region=ES
Ojos Así|Shakira|1998|latin|easy|hum lang=es region=CO
Antología|Shakira|1995|latin|easy|hum lang=es region=CO
Escuela de Calor|Radio Futura|1984|rock|easy|hum lang=es region=ES
Torero|Chayanne|2002|latin|easy|hum lang=es region=PR
Amor a la Mexicana|Thalía|1997|latin|easy|hum lang=es region=MX
Estoy Aquí|Shakira|1995|latin|easy|hum lang=es region=CO
Pies Descalzos, Sueños Blancos|Shakira|1995|latin|medium|hum lang=es region=CO
¿Dónde Estás Corazón?|Shakira|1995|latin|medium|hum lang=es region=CO
Si Te Vas|Shakira|1998|latin|medium|hum lang=es region=CO
No Creo|Shakira|1998|latin|medium|hum lang=es region=CO
Que Me Quedes Tú|Shakira|2001|latin|medium|hum lang=es region=CO
Día de Enero|Shakira|2005|latin|medium|hum lang=es region=CO
Las de la Intuición|Shakira|2005|pop|easy|hum lang=es region=CO
Sale el Sol|Shakira|2010|latin|medium|hum lang=es region=CO
Volverte a Ver|Juanes|2004|latin|medium|hum lang=es region=CO
Nada Valgo Sin Tu Amor|Juanes|2004|latin|easy|hum lang=es region=CO
Fotografía|Juanes feat. Nelly Furtado|2002|latin|easy|hum lang=es region=CO
Para Tu Amor|Juanes|2004|latin|medium|hum lang=es region=CO
La Paga|Juanes|2002|latin|medium|hum lang=es region=CO
Yerbatero|Juanes|2010|latin|medium|hum lang=es region=CO
Experiencia Religiosa|Enrique Iglesias|1995|latin|medium|hum lang=es region=ES
Nunca Te Olvidaré|Enrique Iglesias|1998|latin|easy|hum lang=es region=ES
Mentiroso|Enrique Iglesias|2001|latin|medium|hum lang=es region=ES
Lloro por Ti|Enrique Iglesias|2008|latin|medium|hum lang=es region=ES
Loco|Enrique Iglesias feat. Romeo Santos|2013|latin|easy|hum lang=es region=ES
Pisando Fuerte|Alejandro Sanz|1991|latin|medium|hum lang=es region=ES
Aquello Que Me Diste|Alejandro Sanz|1997|latin|medium|hum lang=es region=ES
Desde Cuándo|Alejandro Sanz|2009|latin|medium|hum lang=es region=ES
Te Lo Agradezco, Pero No|Alejandro Sanz feat. Shakira|2006|latin|medium|hum lang=es region=ES
A Que No Me Dejas|Alejandro Sanz|2015|latin|medium|hum lang=es region=ES
Deja Que Te Bese|Alejandro Sanz feat. Marc Anthony|2016|latin|medium|hum lang=es region=ES
Pienso en Tu Mirá|ROSALÍA|2018|latin|medium|hum lang=es region=ES
Di Mi Nombre|ROSALÍA|2018|latin|medium|hum lang=es region=ES
Saoko|ROSALÍA|2022|latin|medium|hum lang=es region=ES
Candy|ROSALÍA|2022|latin|medium|hum lang=es region=ES
La Fama|ROSALÍA feat. The Weeknd|2021|latin|easy|hum lang=es region=ES
Bizcochito|ROSALÍA|2022|latin|easy|hum lang=es region=ES
Chambea|Bad Bunny|2017|rap|medium|nohum lang=es region=PR
Soy Peor|Bad Bunny|2016|rap|medium|nohum lang=es region=PR
Si Veo a Tu Mamá|Bad Bunny|2020|latin|medium|hum lang=es region=PR
La Noche de Anoche|Bad Bunny & ROSALÍA|2020|latin|easy|hum lang=es region=PR
Yonaguni|Bad Bunny|2021|latin|easy|hum lang=es region=PR
Ojitos Lindos|Bad Bunny & Bomba Estéreo|2022|latin|easy|hum lang=es region=PR
Efecto|Bad Bunny|2022|latin|easy|hum lang=es region=PR
Un Verano Sin Ti|Bad Bunny|2022|latin|medium|hum lang=es region=PR
MONACO|Bad Bunny|2023|rap|medium|nohum lang=es region=PR
Mi Cama|Karol G|2018|latin|easy|hum lang=es region=CO
EL MAKINON|Karol G & Mariah Angeliq|2021|latin|medium|hum lang=es region=CO
Mientras Me Curo del Cora|Karol G|2023|latin|medium|hum lang=es region=CO
Amargura|Karol G|2023|latin|medium|hum lang=es region=CO
QLONA|Karol G & Peso Pluma|2023|latin|medium|hum lang=es region=CO
Cairo|Karol G & Ovy on the Drums|2022|latin|medium|hum lang=es region=CO
6 AM|J Balvin feat. Farruko|2013|latin|easy|hum lang=es region=CO
Sigo Extrañándote|J Balvin|2016|latin|medium|hum lang=es region=CO
Ambiente|J Balvin|2018|latin|medium|hum lang=es region=CO
Blanco|J Balvin|2019|latin|medium|hum lang=es region=CO
Morado|J Balvin|2020|latin|easy|hum lang=es region=CO
Rojo|J Balvin|2020|latin|easy|hum lang=es region=CO
Amarillo|J Balvin|2020|latin|medium|hum lang=es region=CO
Qué Más Pues?|J Balvin & María Becerra|2021|latin|easy|hum lang=es region=CO
Somos de Calle|Daddy Yankee|2008|rap|medium|nohum lang=es region=PR
Pasarela|Daddy Yankee|2012|latin|medium|hum lang=es region=PR
Pose|Daddy Yankee|2008|latin|medium|hum lang=es region=PR
Lovumba|Daddy Yankee|2011|latin|medium|hum lang=es region=PR
Shaky Shaky|Daddy Yankee|2016|latin|easy|hum lang=es region=PR
Que Tire Pa' Lante|Daddy Yankee|2019|latin|medium|hum lang=es region=PR
Problema|Daddy Yankee|2021|latin|medium|hum lang=es region=PR
Guaya Guaya|Don Omar|2014|latin|medium|hum lang=es region=PR
Virtual Diva|Don Omar|2009|latin|medium|hum lang=es region=PR
Angelito|Don Omar|2006|latin|medium|hum lang=es region=PR
Dale Don Dale|Don Omar|2003|latin|easy|hum lang=es region=PR
Hasta Que Salga el Sol|Don Omar|2012|latin|medium|hum lang=es region=PR
Dutty Love|Don Omar feat. Natti Natasha|2012|latin|medium|hum lang=es region=PR
No Me Doy por Vencido|Luis Fonsi|2008|latin|easy|hum lang=es region=PR
Aquí Estoy Yo|Luis Fonsi feat. Aleks Syntek, Noel Schajris & David Bisbal|2008|latin|easy|hum lang=es region=PR
Corazón en la Maleta|Luis Fonsi|2014|latin|medium|hum lang=es region=PR
Nada Es para Siempre|Luis Fonsi|2005|latin|medium|hum lang=es region=PR
Imposible|Luis Fonsi & Ozuna|2018|latin|easy|hum lang=es region=PR
Y Hubo Alguien|Marc Anthony|1997|latin|easy|hum lang=es region=PR
Te Conozco Bien|Marc Anthony|1995|latin|medium|hum lang=es region=PR
Contra la Corriente|Marc Anthony|1997|latin|medium|hum lang=es region=PR
Qué Precio Tiene el Cielo|Marc Anthony|2006|latin|easy|hum lang=es region=PR
Parecen Viernes|Marc Anthony|2019|latin|medium|hum lang=es region=PR
Culpable o No|Luis Miguel|1988|latin|easy|hum lang=es region=MX
Hasta Que Me Olvides|Luis Miguel|1993|latin|easy|hum lang=es region=MX
Suave|Luis Miguel|1993|latin|easy|hum lang=es region=MX
Tengo Todo Excepto a Ti|Luis Miguel|1990|latin|easy|hum lang=es region=MX
Entrégate|Luis Miguel|1990|latin|medium|hum lang=es region=MX
No Sé Tú|Luis Miguel|1991|latin|easy|hum lang=es region=MX
Por Debajo de la Mesa|Luis Miguel|1997|latin|medium|hum lang=es region=MX
O Tú o Ninguna|Luis Miguel|1999|latin|medium|hum lang=es region=MX
No Tengo Dinero|Juan Gabriel|1971|latin|easy|hum lang=es region=MX
Se Me Olvidó Otra Vez|Juan Gabriel|1974|latin|easy|hum lang=es region=MX
Yo No Nací para Amar|Juan Gabriel|1980|latin|medium|hum lang=es region=MX
Inocente Pobre Amigo|Juan Gabriel|1974|latin|medium|hum lang=es region=MX
Caray|Juan Gabriel|1983|latin|easy|hum lang=es region=MX
El Noa Noa|Juan Gabriel|1980|latin|easy|hum lang=es region=MX
Te Lo Pido por Favor|Juan Gabriel|1986|latin|medium|hum lang=es region=MX
Estos Celos|Vicente Fernández|2007|latin|easy|hum lang=es region=MX
Acá Entre Nos|Vicente Fernández|1992|latin|easy|hum lang=es region=MX
Mujeres Divinas|Vicente Fernández|1987|latin|medium|hum lang=es region=MX
Por Tu Maldito Amor|Vicente Fernández|1989|latin|easy|hum lang=es region=MX
Me Voy a Quitar de en Medio|Vicente Fernández|1998|latin|medium|hum lang=es region=MX
El Triste|José José|1970|latin|easy|hum lang=es region=MX
Gavilán o Paloma|José José|1977|latin|easy|hum lang=es region=MX
Lo Pasado, Pasado|José José|1978|latin|medium|hum lang=es region=MX
Amar y Querer|José José|1977|latin|easy|hum lang=es region=MX
Lo Dudo|José José|1983|latin|medium|hum lang=es region=MX
Almohada|José José|1978|latin|easy|hum lang=es region=MX
Lo Que No Fue No Será|José José|1978|latin|medium|hum lang=es region=MX
Pa' Mayte|Carlos Vives|1995|latin|medium|hum lang=es region=CO
Déjame Entrar|Carlos Vives|2001|latin|easy|hum lang=es region=CO
Ella Es Mi Fiesta|Carlos Vives|2014|latin|medium|hum lang=es region=CO
Cuando Nos Volvamos a Encontrar|Carlos Vives feat. Marc Anthony|2014|latin|easy|hum lang=es region=CO
Nota de Amor|Wisin & Carlos Vives feat. Daddy Yankee|2015|latin|easy|hum lang=es region=PR
Nada Personal|Soda Stereo|1985|rock|medium|hum lang=es region=AR
Cuando Pase el Temblor|Soda Stereo|1985|rock|easy|hum lang=es region=AR
Signos|Soda Stereo|1986|rock|medium|hum lang=es region=AR
Zoom|Soda Stereo|1995|rock|medium|hum lang=es region=AR
Puente|Gustavo Cerati|1999|rock|easy|hum lang=es region=AR
Mil Horas|Los Abuelos de la Nada|1983|rock|easy|hum lang=es region=AR
Himno de Mi Corazón|Los Abuelos de la Nada|1984|rock|medium|hum lang=es region=AR
Tirá para Arriba|Miguel Mateos - Zas|1984|rock|medium|hum lang=es region=AR
Cuando Seas Grande|Miguel Mateos - Zas|1986|rock|easy|hum lang=es region=AR
Cómo Pudiste Hacerme Esto a Mí|Alaska y Dinarama|1984|pop|medium|hum lang=es region=ES
A Quién Le Importa|Alaska y Dinarama|1986|pop|easy|hum lang=es region=ES
Ni Tú Ni Nadie|Alaska y Dinarama|1984|pop|easy|hum lang=es region=ES
Devuélveme la Vida|Antonio Orozco|2001|pop|easy|hum lang=es region=ES
Mi Héroe|Antonio Orozco|2015|pop|easy|hum lang=es region=ES
Soldadito de Hierro|Nil Moliner|2019|pop|easy|hum lang=es region=ES
Libertad|Nil Moliner|2020|pop|medium|hum lang=es region=ES
Teléfono|Aitana|2018|pop|easy|hum lang=es region=ES
Vas a Quedarte|Aitana|2018|pop|easy|hum lang=es region=ES
Formentera|Aitana & Nicki Nicole|2021|pop|medium|hum lang=es region=ES
Los Ángeles|Aitana|2023|pop|medium|hum lang=es region=ES
El Fin del Mundo|La La Love You|2019|indie|easy|hum lang=es region=ES
La Revolución Sexual|La Casa Azul|2007|indie|medium|hum lang=es region=ES
20 de Enero|La Oreja de Van Gogh|2003|pop|easy|hum lang=es region=ES
Jueves|La Oreja de Van Gogh|2008|pop|easy|hum lang=es region=ES
El Último Vals|La Oreja de Van Gogh|2008|pop|medium|hum lang=es region=ES
Inmortal|La Oreja de Van Gogh|2008|pop|medium|hum lang=es region=ES
Antes de Que Cuente Diez|Fito & Fitipaldis|2009|rock|easy|hum lang=es region=ES
Me Equivocaría Otra Vez|Fito & Fitipaldis|2006|rock|easy|hum lang=es region=ES
Acabo de Llegar|Fito & Fitipaldis|2006|rock|medium|hum lang=es region=ES
Princesas|Pereza|2005|rock|easy|hum lang=es region=ES
Lady Madrid|Pereza|2009|rock|medium|hum lang=es region=ES
Copenhague|Vetusta Morla|2008|indie|medium|hum lang=es region=ES
Clandestino|Manu Chao|1998|latin|medium|hum lang=es region=FR
Me Gustas Tú|Manu Chao|2001|latin|easy|hum lang=es region=FR
Cuando Me Enamoro|Enrique Iglesias feat. Juan Luis Guerra|2010|latin|easy|hum lang=es region=ES
La Mordidita|Ricky Martin feat. Yotuel|2015|latin|easy|hum lang=es region=PR
Vivir Sin Aire|Maná|1993|rock|easy|hum lang=es region=MX
Crimen|Gustavo Cerati|2006|rock|easy|hum lang=es region=AR
Y, ¿Si Fuera Ella?|Alejandro Sanz|1997|pop|medium|hum lang=es region=ES
No Es lo Mismo|Alejandro Sanz|2003|pop|easy|hum lang=es region=ES
Dígale|David Bisbal|2002|latin|easy|hum lang=es region=ES
Solamente Tú|Pablo Alborán|2010|pop|easy|hum lang=es region=ES
Tanto|Pablo Alborán|2012|pop|easy|hum lang=es region=ES
Perdóname|Pablo Alborán|2011|pop|easy|hum lang=es region=ES
Cuídate|La Oreja de Van Gogh|2000|pop|easy|hum lang=es region=ES
Caminando por la Vida|Melendi|2005|pop|easy|hum lang=es region=ES
Lágrimas Desordenadas|Melendi|2012|pop|easy|hum lang=es region=ES
Ahora Quién|Marc Anthony|2004|latin|easy|hum lang=es region=PR
Rompe|Daddy Yankee|2005|rap|easy|nohum lang=es region=PR
Rakata|Wisin & Yandel|2005|latin|easy|hum lang=es region=PR
Abusadora|Wisin & Yandel|2009|latin|medium|hum lang=es region=PR
El Amante|Nicky Jam|2017|latin|easy|hum lang=es region=PR
Se Preparó|Ozuna|2017|latin|easy|hum lang=es region=PR
Baila Baila Baila|Ozuna|2019|latin|easy|hum lang=es region=PR
Ay, DiOs Mío!|Karol G|2020|latin|easy|hum lang=es region=CO
Moscow Mule|Bad Bunny|2022|latin|easy|hum lang=es region=PR
Tattoo|Rauw Alejandro|2020|latin|easy|hum lang=es region=PR
Tú|Shakira|1998|latin|medium|hum lang=es region=CO
Vida de Rico|Camilo|2020|latin|easy|hum lang=es region=CO
Una Lady Como Tú|Manuel Turizo|2016|latin|easy|hum lang=es region=CO
Corazón Latino|David Bisbal|2002|latin|easy|hum lang=es region=ES
Esclavo de Sus Besos|David Bisbal|2009|latin|medium|hum lang=es region=ES
Todo Cambió|Camila|2007|pop|easy|hum lang=es region=MX
Mientes|Camila|2009|pop|easy|hum lang=es region=MX
Abrázame Muy Fuerte|Juan Gabriel|2000|latin|easy|hum lang=es region=MX
La Incondicional|Luis Miguel|1989|latin|easy|hum lang=es region=MX
Mi Marciana|Alejandro Sanz|2012|pop|medium|hum lang=es region=ES
Un Beso y una Flor|Nino Bravo|1972|pop|easy|hum lang=es region=ES
Libre|Nino Bravo|1972|pop|easy|hum lang=es region=ES
Mediterráneo|Joan Manuel Serrat|1971|folk|easy|hum lang=es region=ES
Cuéntame|Fórmula V|1969|pop|easy|hum lang=es region=ES
La Chica de Ayer|Nacha Pop|1980|rock|easy|hum lang=es region=ES
Bailar Pegados|Sergio Dalma|1991|pop|easy|hum lang=es region=ES
Salomé|Chayanne|1998|latin|easy|hum lang=es region=PR
Un Siglo Sin Ti|Chayanne|2003|latin|easy|hum lang=es region=PR
Arrasando|Thalía|2000|latin|easy|hum lang=es region=MX
Ni Una Sola Palabra|Paulina Rubio|2006|pop|easy|hum lang=es region=MX
Y Yo Sigo Aquí|Paulina Rubio|2001|pop|easy|hum lang=es region=MX
Sin Documentos|Los Rodríguez|1993|rock|easy|hum lang=es region=ES
Venezia|Hombres G|1985|rock|easy|hum lang=es region=ES
Sin Ti No Soy Nada|Amaral|2002|pop|easy|hum lang=es region=ES
El Universo Sobre Mí|Amaral|2005|pop|easy|hum lang=es region=ES
Zapatillas|El Canto del Loco|2005|rock|easy|hum lang=es region=ES
Peter Pan|El Canto del Loco|2008|pop|medium|hum lang=es region=ES
Entra en Mi Vida|Sin Bandera|2001|pop|easy|hum lang=es region=MX
¡Corre!|Jesse & Joy|2011|pop|easy|hum lang=es region=MX
Espacio Sideral|Jesse & Joy|2006|pop|easy|hum lang=es region=MX
Me Cuesta Tanto Olvidarte|Mecano|1986|pop|easy|hum lang=es region=ES
Mujer Contra Mujer|Mecano|1988|pop|easy|hum lang=es region=ES
Maquillaje|Mecano|1982|pop|easy|hum lang=es region=ES
Cruz de Navajas|Mecano|1986|pop|easy|hum lang=es region=ES
Un Año Más|Mecano|1988|pop|easy|hum lang=es region=ES
La Fuerza del Destino|Mecano|1989|pop|easy|hum lang=es region=ES
Maldito Duende|Héroes del Silencio|1990|rock|easy|hum lang=es region=ES
La Chispa Adecuada|Héroes del Silencio|1995|rock|medium|hum lang=es region=ES
Eres|Café Tacvba|2003|rock|easy|hum lang=es region=MX
La Ingrata|Café Tacvba|1994|rock|easy|hum lang=es region=MX
Gimme Tha Power|Molotov|1997|rap|easy|nohum lang=es region=MX
Frijolero|Molotov|2003|rap|medium|nohum lang=es region=MX
Matador|Los Fabulosos Cadillacs|1993|rock|easy|hum lang=es region=AR
El Satánico Dr. Cadillac|Los Fabulosos Cadillacs|1989|rock|medium|hum lang=es region=AR
Soldadito Marinero|Fito & Fitipaldis|2003|rock|easy|hum lang=es region=ES
Por la Boca Vive el Pez|Fito & Fitipaldis|2006|rock|easy|hum lang=es region=ES
La Casa por el Tejado|Fito & Fitipaldis|2003|rock|easy|hum lang=es region=ES
Insurrección|El Último de la Fila|1986|rock|easy|hum lang=es region=ES
Como un Burro Amarrado en la Puerta del Baile|El Último de la Fila|1993|rock|medium|hum lang=es region=ES
Cien Gaviotas|Duncan Dhu|1986|rock|easy|hum lang=es region=ES
En Algún Lugar|Duncan Dhu|1987|rock|easy|hum lang=es region=ES
La Célula Que Explota|Caifanes|1990|rock|easy|hum lang=es region=MX
Afuera|Caifanes|1994|rock|easy|hum lang=es region=MX
Loco (Tu Forma de Ser)|Los Auténticos Decadentes|1989|rock|easy|hum lang=es region=AR
El Murguero|Los Auténticos Decadentes|1995|rock|medium|hum lang=es region=AR
Tren al Sur|Los Prisioneros|1990|rock|easy|hum lang=es region=CL
El Sol No Regresa|La Quinta Estación|2004|pop|easy|hum lang=es region=ES
Me Muero|La Quinta Estación|2006|pop|easy|hum lang=es region=ES
Déjame|Los Secretos|1980|rock|easy|hum lang=es region=ES
Pero a Tu Lado|Los Secretos|1995|pop|easy|hum lang=es region=ES
Florecita Rockera|Aterciopelados|1995|rock|medium|hum lang=es region=CO
Bolero Falaz|Aterciopelados|1995|rock|easy|hum lang=es region=CO
La Muralla Verde|Enanitos Verdes|1986|rock|easy|hum lang=es region=AR
Tu Calorro|Estopa|1999|rock|medium|hum lang=es region=ES
Aquí|La Ley|1998|rock|medium|hum lang=es region=CL
El Duelo|La Ley|1995|rock|easy|hum lang=es region=CL
Caraluna|Bacilos|2002|latin|easy|hum lang=es region=CO
MAMIII|Becky G & Karol G|2022|latin|easy|hum lang=es region=US
Amor Prohibido|Selena|1994|latin|easy|hum lang=es region=US
Bidi Bidi Bom Bom|Selena|1994|latin|easy|hum lang=es region=US
No Me Queda Más|Selena|1994|latin|easy|hum lang=es region=US
Techno Cumbia|Selena|1995|latin|medium|hum lang=es region=US
La Travesía|Juan Luis Guerra 4.40|2007|latin|easy|hum lang=es region=DO
Bachata en Fukuoka|Juan Luis Guerra 4.40|2010|latin|easy|hum lang=es region=DO
Mi Bendición|Juan Luis Guerra 4.40|2010|latin|easy|hum lang=es region=DO
El Costo de la Vida|Juan Luis Guerra 4.40|1992|latin|medium|hum lang=es region=DO
Visa para un Sueño|Juan Luis Guerra 4.40|1989|latin|medium|hum lang=es region=DO
Frío Frío|Juan Luis Guerra 4.40|1992|latin|medium|hum lang=es region=DO
Las Avispas|Juan Luis Guerra 4.40|2004|latin|medium|hum lang=es region=DO
Tacones Rojos|Sebastián Yatra|2021|pop|easy|hum lang=es region=CO
`, { language: "es", scope: "local" }),
  fr: parseSongs(`
Alors on danse|Stromae
Papaoutai|Stromae
Formidable|Stromae
Tous les mêmes|Stromae
Ta fête|Stromae
Santé|Stromae
Dernière danse|Indila
Tourner dans le vide|Indila
S.O.S|Indila
Djadja|Aya Nakamura
Pookie|Aya Nakamura
Copines|Aya Nakamura
Comportement|Aya Nakamura
Jolie nana|Aya Nakamura
Sapés comme jamais|Gims
Bella|Gims
J'me tire|Gims
Est-ce que tu m'aimes ?|Gims
La même|Gims
Je veux|Zaz
On ira|Zaz
Éblouie par la nuit|Zaz
La vie en rose|Édith Piaf
Non, je ne regrette rien|Édith Piaf
Hymne à l'amour|Édith Piaf
Milord|Édith Piaf
La Foule|Édith Piaf
Joe le taxi|Vanessa Paradis
Tandem|Vanessa Paradis
Ça plane pour moi|Plastic Bertrand
Moi... Lolita|Alizée
J'en ai marre !|Alizée
Avenir|Louane
Jour 1|Louane
Je vole|Louane
Andalouse|Kendji Girac
Color Gitano|Kendji Girac
Les yeux de la mama|Kendji Girac
Conmigo|Kendji Girac
Tout oublier|Angèle
Balance ton quoi|Angèle
Oui ou non|Angèle
Flou|Angèle
Sous le vent|Garou
Seul|Garou
Pour que tu m'aimes encore|Céline Dion
S'il suffisait d'aimer|Céline Dion
On ne change pas|Céline Dion
Je te donne|Jean-Jacques Goldman
Envole-moi|Jean-Jacques Goldman
Il suffira d'un signe|Jean-Jacques Goldman
Quand la musique est bonne|Jean-Jacques Goldman
Champs-Élysées|Joe Dassin
L'été indien|Joe Dassin
Et si tu n'existais pas|Joe Dassin
Salut les amoureux|Joe Dassin
Les Lacs du Connemara|Michel Sardou
La maladie d'amour|Michel Sardou
En chantant|Michel Sardou
Mistral gagnant|Renaud
Laisse béton|Renaud
Morgane de toi|Renaud
La Bohème|Charles Aznavour
Emmenez-moi|Charles Aznavour
Hier encore|Charles Aznavour
For me formidable|Charles Aznavour
Ne me quitte pas|Jacques Brel
Le plat pays|Jacques Brel
Amsterdam|Jacques Brel
Vesoul|Jacques Brel
Désenchantée|Mylène Farmer
Sans contrefaçon|Mylène Farmer
Libertine|Mylène Farmer
Je l'aime à mourir|Francis Cabrel
Petite Marie|Francis Cabrel
La Corrida|Francis Cabrel
Je t'aimais, je t'aime, je t'aimerai|Francis Cabrel
La tribu de Dana|Manau
Belle|Garou
Aïcha|Khaled
C'est la vie|Khaled
Didi|Khaled
On écrit sur les murs|Kids United
Sympathique (Je ne veux pas travailler)|Pink Martini
Sensualité|Axelle Red
Caravane|Raphael
Respire|Mickey 3D
Double Je|Christophe Willem
Marly-Gomont|Kamini
Toi + Moi|Grégoire
Ta main|Grégoire
J'ai demandé à la lune|Indochine
L'Aventurier|Indochine
3e sexe|Indochine
Allumer le feu|Johnny Hallyday
Que je t'aime|Johnny Hallyday
Le pénitencier|Johnny Hallyday
L'envie|Johnny Hallyday
Requiem pour un fou|Johnny Hallyday
Quelqu'un m'a dit|Carla Bruni
Ma philosophie|Amel Bent
Le temps qui court|Alain Chamfort
Tombé pour la France|Étienne Daho
Fever|Dua Lipa
Bambino|Dalida|1956|chanson|easy|hum lang=fr region=FR
Le temps de l'amour|Françoise Hardy|1962|chanson|easy|hum lang=fr region=FR
L'école est finie|Sheila|1963|pop|easy|hum lang=fr region=FR
La plus belle pour aller danser|Sylvie Vartan|1964|pop|easy|hum lang=fr region=FR
Mirza|Nino Ferrer|1965|pop|easy|hum lang=fr region=FR
La Poupée qui fait non|Michel Polnareff|1966|pop|easy|hum lang=fr region=FR
Et moi, et moi, et moi|Jacques Dutronc|1966|rock|easy|hum lang=fr region=FR
Siffler sur la colline|Joe Dassin|1968|chanson|easy|hum lang=fr region=FR
San Francisco|Maxime Le Forestier|1972|folk|easy|hum lang=fr region=FR
La Ballade des gens heureux|Gérard Lenorman|1975|chanson|easy|hum lang=fr region=FR
Gabrielle|Johnny Hallyday|1976|rock|easy|hum lang=fr region=FR
La Bombe humaine|Téléphone|1979|rock|easy|hum lang=fr region=FR
Capitaine abandonné|Gold|1985|rock|easy|hum lang=fr region=FR
Macumba|Jean-Pierre Mader|1985|pop|easy|hum lang=fr region=FR
Aux sombres héros de l'amer|Noir Désir|1989|rock|medium|hum lang=fr region=FR
Alors regarde|Patrick Bruel|1989|pop|easy|hum lang=fr region=FR
Zen|Zazie|1995|pop|easy|hum lang=fr region=FR
Le Temps des cathédrales|Bruno Pelletier|1998|soundtrack|easy|hum lang=fr region=FR
Fan|Pascal Obispo|2003|pop|easy|hum lang=fr region=FR
Je cours|Kyo|2003|rock|medium|hum lang=fr region=FR
La Femme chocolat|Olivia Ruiz|2005|pop|easy|hum lang=fr region=FR
Le Festin|Camille|2007|soundtrack|easy|hum lang=fr region=FR
Elle me dit|Mika|2011|pop|easy|hum lang=fr region=FR
Un homme debout|Claudio Capéo|2016|pop|easy|hum lang=fr region=FR
Avant toi|Vitaa & Slimane|2019|pop|easy|hum lang=fr region=FR
Popcorn salé|Santa|2022|pop|easy|hum lang=fr region=FR
La symphonie des éclairs|Zaho de Sagazan|2023|pop|easy|hum lang=fr region=FR
Ceux qu'on était|Pierre Garnier|2024|pop|easy|hum lang=fr region=FR
SPIDER|Gims & Dystinct|2024|pop|easy|hum lang=fr region=FR
Mon amour|Slimane|2024|pop|easy|hum lang=fr region=FR
Mami Wata|Gazo & Tiakola|2023|rap|easy|nohum lang=fr region=FR
Bolide allemand|SDM|2022|rap|easy|nohum lang=fr region=FR
Suavemente|Soolking|2022|pop|easy|hum lang=fr region=FR
L'enfer|Stromae|2022|pop|easy|hum lang=fr region=BE
La kiffance|Naps|2021|rap|easy|hum lang=fr region=FR
PARO|NEJ'|2021|rnb|easy|hum lang=fr region=FR
Basique|Orelsan|2017|rap|easy|nohum lang=fr region=FR
Reine|Dadju|2017|rnb|easy|hum lang=fr region=FR
Dommage|Bigflo & Oli|2017|rap|easy|hum lang=fr region=FR
La grenade|Clara Luciani|2017|pop|easy|hum lang=fr region=FR
J'ai cherché|Amir|2016|pop|easy|hum lang=fr region=FR
Ramenez la coupe à la maison|Vegedream|2018|rap|easy|hum lang=fr region=FR
Bruxelles je t'aime|Angèle|2021|pop|easy|hum lang=fr region=BE
Le dernier jour du disco|Juliette Armanet|2021|disco|easy|hum lang=fr region=FR
Résiste|France Gall|1981|pop|easy|hum lang=fr region=FR
Les Démons de minuit|Images|1986|pop|easy|hum lang=fr region=FR
Nuit de folie|Début de Soirée|1988|dance|easy|hum lang=fr region=FR
Fils de joie|Stromae|2022|pop|medium|hum lang=fr region=BE
Carmen|Stromae|2013|pop|medium|hum lang=fr region=BE
Quand c'est ?|Stromae|2013|pop|medium|hum lang=fr region=BE
Bobo|Aya Nakamura|2021|rnb|medium|hum lang=fr region=FR
Dégaine|Aya Nakamura feat. Damso|2022|rap|medium|nohum lang=fr region=FR
Changer|Gims|2013|pop|medium|hum lang=fr region=FR
Tout donner|Gims|2016|pop|medium|hum lang=fr region=FR
Laissez passer|Gims|2015|rap|medium|nohum lang=fr region=FR
Brisé|Gims|2015|pop|medium|hum lang=fr region=FR
Caméléon|Gims|2018|pop|medium|hum lang=fr region=FR
Malheur, malheur|Gims|2018|pop|medium|hum lang=fr region=FR
Le pire|Gims|2018|pop|medium|hum lang=fr region=FR
Ainsi bas la vida|Indila|2014|pop|medium|hum lang=fr region=FR
Parle à ta tête|Indila|2019|pop|medium|hum lang=fr region=FR
Mademoiselle chante le blues|Patricia Kaas|1987|chanson|easy|hum lang=fr region=FR
Les mots bleus|Christophe|1974|chanson|easy|hum lang=fr region=FR
Si jamais j'oublie|Zaz|2015|chanson|medium|hum lang=fr region=FR
Le long de la route|Zaz|2010|chanson|medium|hum lang=fr region=FR
Tu trouveras|Natasha St-Pier|2002|pop|easy|hum lang=fr region=CA
La nuit je mens|Alain Bashung|1998|rock|medium|hum lang=fr region=FR
Ta reine|Angèle|2018|pop|medium|hum lang=fr region=BE
La loi de Murphy|Angèle|2017|pop|medium|hum lang=fr region=BE
N'importe quoi|Florent Pagny|1987|pop|easy|hum lang=fr region=FR
D'amour ou d'amitié|Céline Dion|1982|pop|easy|hum lang=fr region=CA
J'irai où tu iras|Céline Dion & Jean-Jacques Goldman|1995|pop|easy|hum lang=fr region=CA
Encore un soir|Céline Dion|2016|pop|easy|hum lang=fr region=CA
Parler à mon père|Céline Dion|2012|pop|medium|hum lang=fr region=CA
Là-bas|Jean-Jacques Goldman & Sirima|1987|pop|easy|hum lang=fr region=FR
Au bout de mes rêves|Jean-Jacques Goldman|1982|pop|easy|hum lang=fr region=FR
Encore un matin|Jean-Jacques Goldman|1984|pop|easy|hum lang=fr region=FR
Puisque tu pars|Jean-Jacques Goldman|1987|pop|easy|hum lang=fr region=FR
Né en 17 à Leidenstadt|Fredericks Goldman Jones|1990|pop|medium|hum lang=fr region=FR
Pas toi|Jean-Jacques Goldman|1985|pop|easy|hum lang=fr region=FR
Je marche seul|Jean-Jacques Goldman|1985|pop|easy|hum lang=fr region=FR
À nos actes manqués|Fredericks Goldman Jones|1990|pop|easy|hum lang=fr region=FR
À toi|Joe Dassin|1976|chanson|easy|hum lang=fr region=FR
Dans les yeux d'Émilie|Joe Dassin|1977|chanson|easy|hum lang=fr region=FR
Le jardin du Luxembourg|Joe Dassin|1976|chanson|medium|hum lang=fr region=FR
Respire encore|Clara Luciani|2021|dance|medium|hum lang=fr region=FR
Le reste|Clara Luciani|2021|pop|medium|hum lang=fr region=FR
Être une femme|Michel Sardou|1981|chanson|easy|hum lang=fr region=FR
La Java de Broadway|Michel Sardou|1977|chanson|easy|hum lang=fr region=FR
Vladimir Ilitch|Michel Sardou|1983|chanson|medium|hum lang=fr region=FR
Afrique adieu|Michel Sardou|1982|chanson|medium|hum lang=fr region=FR
Musulmanes|Michel Sardou|1986|chanson|medium|hum lang=fr region=FR
Rouge|Michel Sardou|1984|chanson|medium|hum lang=fr region=FR
Le France|Michel Sardou|1975|chanson|medium|hum lang=fr region=FR
Les vieux mariés|Michel Sardou|1973|chanson|easy|hum lang=fr region=FR
Hexagone|Renaud|1975|chanson|medium|hum lang=fr region=FR
Manu|Renaud|1981|chanson|medium|hum lang=fr region=FR
Miss Maggie|Renaud|1985|chanson|medium|hum lang=fr region=FR
Dans mon HLM|Renaud|1980|chanson|medium|hum lang=fr region=FR
Marche à l'ombre|Renaud|1980|chanson|easy|hum lang=fr region=FR
Mes emmerdes|Charles Aznavour|1976|chanson|easy|hum lang=fr region=FR
Comme ils disent|Charles Aznavour|1972|chanson|medium|hum lang=fr region=FR
La mamma|Charles Aznavour|1963|chanson|easy|hum lang=fr region=FR
Il faut savoir|Charles Aznavour|1961|chanson|medium|hum lang=fr region=FR
Et pourtant|Charles Aznavour|1963|chanson|medium|hum lang=fr region=FR
Les plaisirs démodés|Charles Aznavour|1972|chanson|medium|hum lang=fr region=FR
Mourir d'aimer|Charles Aznavour|1971|chanson|easy|hum lang=fr region=FR
Mathilde|Jacques Brel|1964|chanson|medium|hum lang=fr region=BE
Les Bourgeois|Jacques Brel|1962|chanson|medium|hum lang=fr region=BE
Madeleine|Jacques Brel|1962|chanson|medium|hum lang=fr region=BE
Ces gens-là|Jacques Brel|1966|chanson|medium|hum lang=fr region=BE
Les vieux|Jacques Brel|1963|chanson|medium|hum lang=fr region=BE
Bruxelles|Jacques Brel|1962|chanson|medium|hum lang=fr region=BE
Pourvu qu'elles soient douces|Mylène Farmer|1988|pop|easy|hum lang=fr region=FR
Sans logique|Mylène Farmer|1988|pop|medium|hum lang=fr region=FR
XXL|Mylène Farmer|1995|pop|easy|hum lang=fr region=FR
California|Mylène Farmer|1995|pop|medium|hum lang=fr region=FR
Rêver|Mylène Farmer|1995|pop|easy|hum lang=fr region=FR
Oui mais... non|Mylène Farmer|2010|pop|easy|hum lang=fr region=FR
C'est une belle journée|Mylène Farmer|2001|pop|easy|hum lang=fr region=FR
Appelle mon numéro|Mylène Farmer|2008|pop|medium|hum lang=fr region=FR
L'encre de tes yeux|Francis Cabrel|1980|chanson|easy|hum lang=fr region=FR
Encore et encore|Francis Cabrel|1985|chanson|easy|hum lang=fr region=FR
Sarbacane|Francis Cabrel|1989|chanson|easy|hum lang=fr region=FR
La dame de Haute-Savoie|Francis Cabrel|1980|chanson|medium|hum lang=fr region=FR
C'est écrit|Francis Cabrel|1989|chanson|easy|hum lang=fr region=FR
Hors-saison|Francis Cabrel|1999|chanson|medium|hum lang=fr region=FR
Octobre|Francis Cabrel|1994|chanson|medium|hum lang=fr region=FR
J'oublierai ton nom|Johnny Hallyday & Carmel|1986|rock|easy|hum lang=fr region=FR
Retiens la nuit|Johnny Hallyday|1961|rock|easy|hum lang=fr region=FR
Quelque chose de Tennessee|Johnny Hallyday|1985|rock|easy|hum lang=fr region=FR
Vivre pour le meilleur|Johnny Hallyday|1999|rock|easy|hum lang=fr region=FR
Sang pour sang|Johnny Hallyday|1999|rock|easy|hum lang=fr region=FR
Le chanteur abandonné|Johnny Hallyday|1985|rock|medium|hum lang=fr region=FR
J'ai oublié de vivre|Johnny Hallyday|1977|rock|medium|hum lang=fr region=FR
Évidemment|France Gall|1987|pop|easy|hum lang=fr region=FR
Si, maman si|France Gall|1977|pop|easy|hum lang=fr region=FR
Babacar|France Gall|1987|pop|easy|hum lang=fr region=FR
Débranche !|France Gall|1984|pop|medium|hum lang=fr region=FR
Musique|France Gall|1977|pop|medium|hum lang=fr region=FR
La déclaration d'amour|France Gall|1974|pop|medium|hum lang=fr region=FR
Tous les cris les S.O.S.|Daniel Balavoine|1985|pop|easy|hum lang=fr region=FR
Sauver l'amour|Daniel Balavoine|1985|pop|easy|hum lang=fr region=FR
Vivre ou survivre|Daniel Balavoine|1982|pop|easy|hum lang=fr region=FR
Mourir sur scène|Dalida|1983|chanson|easy|hum lang=fr region=FR
Il venait d'avoir 18 ans|Dalida|1973|chanson|easy|hum lang=fr region=FR
L'amour en solitaire|Juliette Armanet|2017|pop|medium|hum lang=fr region=FR
Le lundi au soleil|Claude François|1972|pop|easy|hum lang=fr region=FR
Magnolias for Ever|Claude François|1977|pop|easy|hum lang=fr region=FR
Chanson populaire|Claude François|1973|pop|easy|hum lang=fr region=FR
Initials B.B.|Serge Gainsbourg|1968|chanson|medium|hum lang=fr region=FR
Couleur café|Serge Gainsbourg|1964|chanson|easy|hum lang=fr region=FR
Je suis venu te dire que je m'en vais|Serge Gainsbourg|1973|chanson|easy|hum lang=fr region=FR
Requiem pour un con|Serge Gainsbourg|1968|chanson|medium|hum lang=fr region=FR
Sea, Sex and Sun|Serge Gainsbourg|1978|pop|easy|hum lang=fr region=FR
Message personnel|Françoise Hardy|1973|chanson|easy|hum lang=fr region=FR
L'amitié|Françoise Hardy|1965|chanson|medium|hum lang=fr region=FR
Le paradis blanc|Michel Berger|1990|pop|easy|hum lang=fr region=FR
Quelques mots d'amour|Michel Berger|1980|pop|easy|hum lang=fr region=FR
La groupie du pianiste|Michel Berger|1980|pop|easy|hum lang=fr region=FR
Celui qui chante|Michel Berger|1980|pop|medium|hum lang=fr region=FR
Seras-tu là ?|Michel Berger|1975|pop|easy|hum lang=fr region=FR
Chanter pour ceux qui sont loin de chez eux|Michel Berger|1985|pop|easy|hum lang=fr region=FR
Amoureuse|Véronique Sanson|1972|pop|easy|hum lang=fr region=FR
Besoin de personne|Véronique Sanson|1972|pop|easy|hum lang=fr region=FR
Chanson sur ma drôle de vie|Véronique Sanson|1972|pop|easy|hum lang=fr region=FR
Allô maman bobo|Alain Souchon|1977|chanson|easy|hum lang=fr region=FR
La ballade de Jim|Alain Souchon|1985|chanson|easy|hum lang=fr region=FR
Sous les jupes des filles|Alain Souchon|1993|chanson|easy|hum lang=fr region=FR
Ultra moderne solitude|Alain Souchon|1988|chanson|medium|hum lang=fr region=FR
Comme d'habitude|Claude François|1967|chanson|medium|hum lang=fr region=FR
Alexandrie Alexandra|Claude François|1978|pop|medium|hum lang=fr region=FR
Je t'aime... moi non plus|Serge Gainsbourg|1969|chanson|medium|hum lang=fr region=FR
La Thune|Angèle|2018|pop|medium|hum lang=fr region=BE
Sur ma route|Black M|2014|rap|easy|nohum lang=fr region=FR
Cendrillon|Téléphone|1982|rock|easy|hum lang=fr region=FR
Un autre monde|Téléphone|1984|rock|easy|hum lang=fr region=FR
Foule sentimentale|Alain Souchon|1993|chanson|easy|hum lang=fr region=FR
Savoir aimer|Florent Pagny|1997|pop|easy|hum lang=fr region=FR
Casser la voix|Patrick Bruel|1989|pop|easy|hum lang=fr region=FR
Place des grands hommes|Patrick Bruel|1989|pop|easy|hum lang=fr region=FR
Ella, elle l'a|France Gall|1987|pop|easy|hum lang=fr region=FR
Poupée de cire, poupée de son|France Gall|1965|pop|easy|hum lang=fr region=FR
Laissez-moi danser|Dalida|1979|dance|easy|hum lang=fr region=FR
Trois nuits par semaine|Indochine|1985|rock|easy|hum lang=fr region=FR
Je suis malade|Serge Lama|1973|chanson|easy|hum lang=fr region=FR
Le Sud|Nino Ferrer|1975|chanson|easy|hum lang=fr region=FR
L'Aigle noir|Barbara|1970|chanson|easy|hum lang=fr region=FR
Tous les garçons et les filles|Françoise Hardy|1962|chanson|easy|hum lang=fr region=FR
Quand on n'a que l'amour|Jacques Brel|1956|chanson|easy|hum lang=fr region=BE
Je vais t'aimer|Michel Sardou|1976|chanson|easy|hum lang=fr region=FR
Le Chanteur|Daniel Balavoine|1978|pop|easy|hum lang=fr region=FR
Mon fils, ma bataille|Daniel Balavoine|1980|pop|easy|hum lang=fr region=FR
L'Aziza|Daniel Balavoine|1985|pop|easy|hum lang=fr region=FR
Padam Padam|Édith Piaf|1951|chanson|easy|hum lang=fr region=FR
Voilà|Barbara Pravi|2021|chanson|medium|hum lang=fr region=FR
Si t'étais là|Louane|2017|pop|easy|hum lang=fr region=FR
On était beau|Louane|2017|pop|medium|hum lang=fr region=FR
Mme Pavoshko|Black M|2014|rap|medium|nohum lang=fr region=FR
Le lac|Julien Doré|2016|pop|medium|hum lang=fr region=FR
Paris-Seychelles|Julien Doré|2013|pop|easy|hum lang=fr region=FR
On dirait|Amir|2016|pop|easy|hum lang=fr region=FR
Je m'en vais|Vianney|2016|pop|easy|hum lang=fr region=FR
Pas là|Vianney|2014|pop|easy|hum lang=fr region=FR
Beau-papa|Vianney|2020|pop|easy|hum lang=fr region=FR
On s'attache|Christophe Maé|2007|pop|easy|hum lang=fr region=FR
Il est où le bonheur|Christophe Maé|2016|pop|easy|hum lang=fr region=FR
Le téléphone pleure|Claude François|1974|pop|easy|hum lang=fr region=FR
Ça (c'est vraiment toi)|Téléphone|1982|rock|easy|hum lang=fr region=FR
J'ai dix ans|Alain Souchon|1974|chanson|easy|hum lang=fr region=FR
Comme toi|Jean-Jacques Goldman|1982|pop|easy|hum lang=fr region=FR
Ma liberté de penser|Florent Pagny|2003|pop|easy|hum lang=fr region=FR
Qui a le droit...|Patrick Bruel|1991|pop|easy|hum lang=fr region=FR
Je sais pas|Céline Dion|1995|pop|easy|hum lang=fr region=FR
Si seulement je pouvais lui manquer|Calogero|2004|pop|easy|hum lang=fr region=FR
Face à la mer|Calogero & Passi|2004|pop|easy|hum lang=fr region=FR
La Terre est ronde|Orelsan|2011|rap|easy|nohum lang=fr region=FR
Papa|Bigflo & Oli|2015|rap|medium|nohum lang=fr region=FR
Mon précieux|Soprano|2017|pop|easy|hum lang=fr region=FR
Cosmo|Soprano|2014|pop|easy|hum lang=fr region=FR
Divinidylle|Vanessa Paradis|2007|pop|medium|hum lang=fr region=FR
Il jouait du piano debout|France Gall|1980|pop|easy|hum lang=fr region=FR
Gigi l'amoroso|Dalida|1974|chanson|easy|hum lang=fr region=FR
Ma gueule|Johnny Hallyday|1979|rock|easy|hum lang=fr region=FR
Les Feuilles mortes|Yves Montand|1949|chanson|easy|hum lang=fr region=FR
Que reste-t-il de nos amours ?|Charles Trenet|1942|chanson|easy|hum lang=fr region=FR
La Mer|Charles Trenet|1946|chanson|easy|hum lang=fr region=FR
Douce France|Charles Trenet|1943|chanson|easy|hum lang=fr region=FR
Les Copains d'abord|Georges Brassens|1964|chanson|easy|hum lang=fr region=FR
Chanson pour l'Auvergnat|Georges Brassens|1954|chanson|easy|hum lang=fr region=FR
Göttingen|Barbara|1964|chanson|medium|hum lang=fr region=FR
Mon amie la rose|Françoise Hardy|1964|chanson|easy|hum lang=fr region=FR
Le Métèque|Georges Moustaki|1969|chanson|easy|hum lang=fr region=FR
La Valse à mille temps|Jacques Brel|1959|chanson|easy|hum lang=fr region=BE
Je suis un homme|Zazie|2007|pop|easy|hum lang=fr region=FR
Lucie|Pascal Obispo|1997|pop|easy|hum lang=fr region=FR
Je m'appelle Hélène|Hélène Rollès|1993|pop|easy|hum lang=fr region=FR
Je t'aime|Lara Fabian|1997|pop|easy|hum lang=fr region=BE
Le vent nous portera|Noir Désir|2001|rock|easy|hum lang=fr region=FR
Manhattan-Kaboul|Renaud & Axelle Red|2002|chanson|easy|hum lang=fr region=FR
Dès que le vent soufflera|Renaud|1983|chanson|easy|hum lang=fr region=FR
J't'emmène au vent|Louise Attaque|1997|rock|easy|hum lang=fr region=FR
Le chemin|Kyo feat. Sita|2003|rock|easy|hum lang=fr region=FR
L'Hymne de nos campagnes|Tryo|1998|reggae|easy|hum lang=fr region=FR
Marcia Baïla|Les Rita Mitsouko|1984|pop|easy|hum lang=fr region=FR
C'est comme ça|Les Rita Mitsouko|1986|rock|easy|hum lang=fr region=FR
Un peu plus près des étoiles|Gold|1984|rock|easy|hum lang=fr region=FR
Ville de lumière|Gold|1986|pop|easy|hum lang=fr region=FR
Tomber la chemise|Zebda|1999|rock|easy|hum lang=fr region=FR
Je danse le Mia|IAM|1993|rap|easy|nohum lang=fr region=FR
Nés sous la même étoile|IAM|1997|rap|medium|nohum lang=fr region=FR
Laisse pas traîner ton fils|Suprême NTM|1998|rap|medium|nohum lang=fr region=FR
Désolé|Sexion d'Assaut|2010|rap|easy|hum lang=fr region=FR
Avant qu'elle parte|Sexion d'Assaut|2012|rap|easy|hum lang=fr region=FR
Dis-moi|BB Brunes|2007|rock|easy|hum lang=fr region=FR
Femme libérée|Cookie Dingler|1984|pop|easy|hum lang=fr region=FR
Partenaire particulier|Partenaire Particulier|1985|pop|easy|hum lang=fr region=FR
Voilà l'été|Les Négresses Vertes|1988|rock|easy|hum lang=fr region=FR
C'est bon pour le moral|La Compagnie Créole|1983|pop|easy|hum lang=fr region=FR
Ça fait rire les oiseaux|La Compagnie Créole|1986|pop|easy|hum lang=fr region=FR
Le Pouvoir des fleurs|Laurent Voulzy|1992|pop|easy|hum lang=fr region=FR
Rockollection|Laurent Voulzy|1977|pop|easy|hum lang=fr region=FR
Goodbye Marylou|Michel Polnareff|1989|pop|easy|hum lang=fr region=FR
Lettre à France|Michel Polnareff|1977|pop|easy|hum lang=fr region=FR
Femmes, je vous aime|Julien Clerc|1982|pop|easy|hum lang=fr region=FR
40%|Aya Nakamura|2019|rnb|medium|hum lang=fr region=FR
Les passants|Zaz|2010|chanson|medium|hum lang=fr region=FR
Secret|Louane|2022|pop|easy|hum lang=fr region=FR
Donne-moi ton cœur|Louane|2020|pop|medium|hum lang=fr region=FR
Je ne vous oublie pas|Céline Dion|2005|pop|medium|hum lang=fr region=FR
Destin|Céline Dion|1995|pop|medium|hum lang=fr region=FR
Tout l'or des hommes|Céline Dion|2003|pop|easy|hum lang=fr region=FR
Veiller tard|Jean-Jacques Goldman|1982|pop|medium|hum lang=fr region=FR
Nuit|Fredericks Goldman Jones|1990|pop|medium|hum lang=fr region=FR
La fleur aux dents|Joe Dassin|1970|chanson|easy|hum lang=fr region=FR
Toujours debout|Renaud|2016|chanson|medium|hum lang=fr region=FR
Hong Kong Star|France Gall|1984|pop|medium|hum lang=fr region=FR
Aimer est plus fort que d'être aimé|Daniel Balavoine|1985|pop|medium|hum lang=fr region=FR
Toi et moi contre le monde entier|Claude François|1975|pop|medium|hum lang=fr region=FR
Le Mal-Aimé|Claude François|1974|pop|easy|hum lang=fr region=FR
La Chanson de Prévert|Serge Gainsbourg|1961|chanson|medium|hum lang=fr region=FR
Comic Strip|Serge Gainsbourg|1967|pop|medium|hum lang=fr region=FR
Partir quand même|Françoise Hardy|1988|chanson|medium|hum lang=fr region=FR
Nue|Clara Luciani|2018|pop|medium|hum lang=fr region=FR
Vancouver|Véronique Sanson|1976|pop|easy|hum lang=fr region=FR
`, { language: "fr", scope: "local" }),
  pt: parseSongs(`
Ai Se Eu Te Pego|Michel Teló
Fugidinha|Michel Teló
Humilde Residência|Michel Teló
Balada|Gusttavo Lima
Tchê Tcherere Tchê Tchê|Gusttavo Lima
Apelido Carinhoso|Gusttavo Lima
Evidências|Chitãozinho & Xororó
Fio de Cabelo|Chitãozinho & Xororó
Galopeira|Chitãozinho & Xororó
Garota de Ipanema|Tom Jobim
Águas de Março|Tom Jobim
Mas Que Nada|Jorge Ben Jor
País Tropical|Jorge Ben Jor
Taj Mahal|Jorge Ben Jor
Aquarela|Toquinho
Não Quero Dinheiro|Tim Maia
O Descobridor dos Sete Mares|Tim Maia
Gostava Tanto de Você|Tim Maia
Primavera|Tim Maia
Cheia de Manias|Raça Negra
Cigana|Raça Negra
É Tarde Demais|Raça Negra
Anna Júlia|Los Hermanos
A Minha Casinha|Xutos & Pontapés
Não Sou o Único|Xutos & Pontapés
Homem do Leme|Xutos & Pontapés
Contentores|Xutos & Pontapés
Exagerado|Cazuza|1985|rock|easy|hum lang=pt region=BR
Anda Comigo Ver os Aviões|Os Azeitonas
Quem És Tu Miúda|Os Azeitonas
Ó Gente da Minha Terra|Mariza
Quem Me Dera|Mariza
Chuva|Mariza
Melhor de Mim|Mariza
Andorinhas|Ana Moura
Desfado|Ana Moura
Dia de Folga|Ana Moura
Envolver|Anitta
Show das Poderosas|Anitta
Bang|Anitta
Downtown|Anitta
Infiel|Marília Mendonça
Leão|Marília Mendonça
Todo Mundo Vai Sofrer|Marília Mendonça
Supera|Marília Mendonça
Eu Sei de Cor|Marília Mendonça
Apaga a Luz e Toma|Tony Carreira
Sonhos de Menino|Tony Carreira
Mãe Querida|Tony Carreira
Lambada (Chorando Se Foi)|Kaoma
A Banda|Chico Buarque
O Que Será|Chico Buarque
Construção|Chico Buarque
Festa|Ivete Sangalo
Sorte Grande|Ivete Sangalo
Poeira|Ivete Sangalo
Acelera Aê|Ivete Sangalo
Dança da Manivela|Asa de Águia
Ilariê|Xuxa
Tindolelê|Xuxa
Baianidade Nagô|Banda Mel
Amor I Love You|Marisa Monte
Ainda Bem|Marisa Monte
Velha Infância|Tribalistas
Já Sei Namorar|Tribalistas
Passe em Casa|Tribalistas
Whisky a Go-Go|Roupa Nova
Dona|Roupa Nova
A Viagem|Roupa Nova
Menina Estás à Janela|Vitorino
Chamar a Música|Sara Tavares
Lusitana Paixão|Dulce Pontes
Canção do Mar|Dulce Pontes
Playback|Carlos Paião
Pó de Arroz|Carlos Paião
Estrela da Tarde|Carlos do Carmo
Lisboa Menina e Moça|Carlos do Carmo
Canoas do Tejo|Carlos do Carmo
Desfolhada Portuguesa|Simone de Oliveira
Anjo Selvagem|Santamaria
Dunas|GNR
Pronúncia do Norte|GNR
Sangue Oculto|GNR
Milla|Netinho
Burguesinha|Seu Jorge
Mina do Condomínio|Seu Jorge
Amiga da Minha Mulher|Seu Jorge
Ex Mai Love|Thiaguinho
Camaro Amarelo|Munhoz & Mariano
Lepo Lepo|Psirico
O Sol|Vitor Kley
Hear Me Now|Alok
Pelados em Santos|Mamonas Assassinas
Vira-Vira|Mamonas Assassinas
Robocop Gay|Mamonas Assassinas
O Canto da Cidade|Daniela Mercury
Avisa Lá|Olodum
Tempo de Alegria|Ivete Sangalo
Barco Negro|Amália Rodrigues|1955|folk|easy|lang=pt region=PT hum
Pedra Filosofal|Manuel Freire|1970|folk|medium|lang=pt region=PT hum
O Primeiro Dia|Sérgio Godinho|1978|folk|medium|lang=pt region=PT hum
20 Anos|José Cid|1980|pop|easy|lang=pt region=PT hum
Rua do Carmo|UHF|1981|rock|easy|lang=pt region=PT hum
Chiclete|Táxi|1981|rock|easy|lang=pt region=PT hum
Frágil|Jorge Palma|1982|pop|medium|lang=pt region=PT hum
Perdidamente|Trovante|1987|rock|easy|lang=pt region=PT hum
Baía de Cascais|Delfins|1987|pop|easy|lang=pt region=PT hum
Parva Que Sou|Deolinda|2011|folk|easy|lang=pt region=PT hum
Os Maridos das Outras|Miguel Araújo|2012|pop|easy|lang=pt region=PT hum
Pica do 7|António Zambujo|2015|folk|medium|lang=pt region=PT hum
Antes Dela Dizer Que Sim|Bárbara Tinoco|2019|pop|easy|lang=pt region=PT hum
Preço Certo|Pedro Mafama|2023|pop|easy|lang=pt region=PT hum
Azul da Cor do Mar|Tim Maia|1970|soul|easy|lang=pt region=BR hum
Metamorfose Ambulante|Raul Seixas|1973|rock|easy|lang=pt region=BR hum
Não Deixe o Samba Morrer|Alcione|1975|pop|easy|lang=pt region=BR hum
Como Nossos Pais|Elis Regina|1976|pop|medium|lang=pt region=BR hum
Tempos Modernos|Lulu Santos|1982|pop|easy|lang=pt region=BR hum
Anunciação|Alceu Valença|1983|folk|easy|lang=pt region=BR hum
Meu Erro|Os Paralamas do Sucesso|1984|rock|easy|lang=pt region=BR hum
Pense em Mim|Leandro & Leonardo|1990|country|easy|lang=pt region=BR hum
Malandragem|Cássia Eller|1994|rock|easy|lang=pt region=BR hum
Depois do Prazer|Só Pra Contrariar|1997|pop|easy|lang=pt region=BR hum
Quem de Nós Dois|Ana Carolina|2001|pop|medium|lang=pt region=BR hum
Medo Bobo|Maiara & Maraisa|2016|country|easy|lang=pt region=BR hum
Idiota|Jão|2021|pop|easy|lang=pt region=BR hum
Deslocado|NAPA|2025|pop|easy|hum lang=pt region=PT
saudade, saudade|MARO|2022|pop|easy|hum lang=pt region=PT
Grito|iolanda|2024|pop|medium|hum lang=pt region=PT
TATA|Slow J|2023|rap|easy|nohum lang=pt region=PT
Como Tu|Bárbara Bandeira feat. Ivandro|2022|pop|easy|hum lang=pt region=PT
Amar pelos dois|Salvador Sobral|2017|pop|easy|hum lang=pt region=PT
Canção de Engate|António Variações|1984|pop|easy|hum lang=pt region=PT
Porto Covo|Rui Veloso|1987|rock|easy|hum lang=pt region=PT
Nosso Quadro|Ana Castela|2023|country|easy|hum lang=pt region=BR
Erro Gostoso (Ao Vivo)|Simone Mendes|2023|country|easy|hum lang=pt region=BR
Batom de Cereja (Ao Vivo)|Israel & Rodolffo|2021|country|easy|hum lang=pt region=BR
Tá OK|DENNIS & Kevin O Chris|2023|funk|easy|hum lang=pt region=BR
Coração Cachorro|Avine Vinny & Matheus Fernandes|2021|pop|easy|hum lang=pt region=BR
Jenifer|Gabriel Diniz|2018|pop|easy|hum lang=pt region=BR
Olha a Explosão|MC Kevinho|2016|funk|easy|hum lang=pt region=BR
Deu Onda|MC G15|2016|funk|easy|hum lang=pt region=BR
Vai Malandra|Anitta|2017|funk|easy|hum lang=pt region=BR
Bum Bum Tam Tam|MC Fioti|2017|funk|easy|hum lang=pt region=BR
Chega de Saudade|João Gilberto|1958|jazz|medium|hum lang=pt region=BR
Pais e Filhos|Legião Urbana|1989|rock|easy|hum lang=pt region=BR
E Depois do Adeus|Paulo de Carvalho|1974|pop|easy|hum lang=pt region=PT
Tourada|Fernando Tordo|1973|pop|medium|hum lang=pt region=PT
Sol de Inverno|Simone de Oliveira|1965|oldies|medium|hum lang=pt region=PT
Conquistador|Da Vinci|1989|pop|easy|hum lang=pt region=PT
A Vida Toda|Carolina Deslandes|2017|pop|easy|hum lang=pt region=PT
O Jardim|Cláudia Pascoal feat. Isaura|2018|pop|medium|hum lang=pt region=PT
Encosta-te a Mim|Jorge Palma|2007|pop|easy|hum lang=pt region=PT
Ai Coração|Mimicat|2023|pop|easy|hum lang=pt region=PT
Primeiro Beijo|Cabeças No Ar|2002|rock|easy|hum lang=pt region=PT
Não Há Estrelas no Céu|Rui Veloso|1990|rock|easy|hum lang=pt region=PT
Jura|Rui Veloso|1998|rock|medium|hum lang=pt region=PT
Anel de Rubi|Rui Veloso|1986|rock|medium|hum lang=pt region=PT
Sete Mares|Sétima Legião|1987|rock|easy|hum lang=pt region=PT
Por Quem Não Esqueci|Sétima Legião|1989|rock|medium|hum lang=pt region=PT
Circo de Feras|Xutos & Pontapés|1987|rock|easy|hum lang=pt region=PT
À Minha Maneira|Xutos & Pontapés|1988|rock|easy|hum lang=pt region=PT
Para Ti Maria|Xutos & Pontapés|1988|rock|medium|hum lang=pt region=PT
Sem Eira Nem Beira|Xutos & Pontapés|2009|rock|medium|hum lang=pt region=PT
Submissão|GNR|1990|rock|medium|hum lang=pt region=PT
Vídeo Maria|GNR|1988|rock|medium|hum lang=pt region=PT
Ana Lee|GNR|1996|rock|medium|hum lang=pt region=PT
O Corpo É Que Paga|António Variações|1983|pop|easy|hum lang=pt region=PT
Estou Além|António Variações|1983|pop|easy|hum lang=pt region=PT
É P'ra Amanhã|António Variações|1983|pop|medium|hum lang=pt region=PT
Não Me Consumas|Blind Zero|1995|rock|medium|hum lang=pt region=PT
Paixão|Pedro Abrunhosa|1994|pop|easy|hum lang=pt region=PT
Se Eu Fosse um Dia o Teu Olhar|Pedro Abrunhosa|1994|pop|easy|hum lang=pt region=PT
Tudo o Que Eu Te Dou|Pedro Abrunhosa|1994|pop|medium|hum lang=pt region=PT
Momento|Pedro Abrunhosa|2007|pop|medium|hum lang=pt region=PT
Carta|Toranja|2003|rock|easy|hum lang=pt region=PT
Laços|Toranja|2005|rock|medium|hum lang=pt region=PT
Tu e Eu|Diogo Piçarra|2015|pop|easy|hum lang=pt region=PT
História|Diogo Piçarra|2015|pop|medium|hum lang=pt region=PT
Às Vezes|D.A.M.A|2015|pop|medium|hum lang=pt region=PT
Casa|D.A.M.A|2018|pop|medium|hum lang=pt region=PT
Loucamente|D.A.M.A feat. Los Romeros|2014|pop|easy|hum lang=pt region=PT
Não Dá|D.A.M.A|2017|pop|medium|hum lang=pt region=PT
Papel Principal|Adelaide Ferreira|1985|pop|medium|hum lang=pt region=PT
Cinderela|Carlos Paião|1984|pop|easy|hum lang=pt region=PT
Um Homem na Cidade|Carlos do Carmo|1977|folk|medium|hum lang=pt region=PT
Os Putos|Carlos do Carmo|1978|folk|medium|hum lang=pt region=PT
Cavalo à Solta|Fernando Tordo|1971|pop|medium|hum lang=pt region=PT
Depois de Ti Mais Nada|Tony Carreira|1997|pop|easy|hum lang=pt region=PT
Sonhador, Sonhador|Tony Carreira|1998|pop|medium|hum lang=pt region=PT
Porque É Que Vens|Tony Carreira|2008|pop|medium|hum lang=pt region=PT
Amar Não É Pecado|Mickael Carreira|2006|pop|medium|hum lang=pt region=PT
O Teu Lugar|Mickael Carreira|2019|pop|medium|hum lang=pt region=PT
Dialeto|Diogo Piçarra|2016|pop|medium|hum lang=pt region=PT
Paraíso|Diogo Piçarra|2017|pop|easy|hum lang=pt region=PT
A Máquina|Amor Electro|2011|pop|easy|hum lang=pt region=PT
Rosa Sangue|Amor Electro|2013|pop|medium|hum lang=pt region=PT
Só Esta Noite|Jafumega|1982|rock|easy|hum lang=pt region=PT
Sobe, Sobe, Balão Sobe|Manuela Bravo|1979|pop|medium|hum lang=pt region=PT
Bem Bom|Doce|1982|pop|easy|hum lang=pt region=PT
Amanhã de Manhã|Doce|1981|pop|easy|hum lang=pt region=PT
Senhora do Mar|Vânia Fernandes|2008|pop|medium|hum lang=pt region=PT
O Pastor|Madredeus|1990|folk|easy|hum lang=pt region=PT
Haja o Que Houver|Madredeus|1997|folk|medium|hum lang=pt region=PT
Tropicália|Caetano Veloso|1968|oldies|medium|hum lang=pt region=BR
Você Não Entende Nada|Caetano Veloso|1970|pop|medium|hum lang=pt region=BR
Odara|Caetano Veloso|1977|pop|easy|hum lang=pt region=BR
Um Índio|Caetano Veloso|1977|pop|medium|hum lang=pt region=BR
Vaca Profana|Gal Costa|1984|pop|medium|hum lang=pt region=BR
Meu Nome É Gal|Gal Costa|1969|oldies|medium|hum lang=pt region=BR
Festa do Interior|Gal Costa|1981|pop|easy|hum lang=pt region=BR
Explode Coração|Maria Bethânia|1978|pop|easy|hum lang=pt region=BR
Olhos nos Olhos|Maria Bethânia|1976|pop|medium|hum lang=pt region=BR
Reconvexo|Maria Bethânia|1989|pop|medium|hum lang=pt region=BR
O Segundo Sol|Cássia Eller|1999|rock|easy|hum lang=pt region=BR
Atrás da Porta|Elis Regina|1972|pop|medium|hum lang=pt region=BR
Madalena|Elis Regina|1970|pop|medium|hum lang=pt region=BR
Cotidiano|Chico Buarque|1971|pop|easy|hum lang=pt region=BR
Geni e o Zepelim|Chico Buarque|1978|pop|medium|hum lang=pt region=BR
João e Maria|Chico Buarque & Nara Leão|1977|pop|easy|hum lang=pt region=BR
Quem Te Viu, Quem Te Vê|Chico Buarque|1967|oldies|medium|hum lang=pt region=BR
Meu Caro Amigo|Chico Buarque|1976|pop|medium|hum lang=pt region=BR
Expresso 2222|Gilberto Gil|1972|pop|medium|hum lang=pt region=BR
Toda Menina Baiana|Gilberto Gil|1979|pop|easy|hum lang=pt region=BR
Realce|Gilberto Gil|1979|pop|easy|hum lang=pt region=BR
Drão|Gilberto Gil|1982|pop|medium|hum lang=pt region=BR
Refazenda|Gilberto Gil|1975|pop|medium|hum lang=pt region=BR
Meu Bem Querer|Djavan|1980|pop|easy|hum lang=pt region=BR
Lilás|Djavan|1984|pop|easy|hum lang=pt region=BR
Eu Te Devoro|Djavan|1998|pop|easy|hum lang=pt region=BR
Um Amor Puro|Djavan|1999|pop|medium|hum lang=pt region=BR
Açaí|Djavan|1982|pop|medium|hum lang=pt region=BR
Seduzir|Djavan|1981|pop|medium|hum lang=pt region=BR
Encontros e Despedidas|Milton Nascimento|1985|pop|easy|hum lang=pt region=BR
Maria, Maria|Milton Nascimento|1978|pop|easy|hum lang=pt region=BR
Canção da América|Milton Nascimento|1980|pop|easy|hum lang=pt region=BR
Morro Velho|Milton Nascimento|1967|oldies|medium|hum lang=pt region=BR
Ponta de Areia|Milton Nascimento|1975|pop|medium|hum lang=pt region=BR
Agora Só Falta Você|Rita Lee & Tutti Frutti|1975|rock|easy|hum lang=pt region=BR
Jardins da Babilônia|Rita Lee & Tutti Frutti|1978|rock|medium|hum lang=pt region=BR
Caso Sério|Rita Lee|1980|pop|easy|hum lang=pt region=BR
Baila Comigo|Rita Lee|1980|pop|easy|hum lang=pt region=BR
Saúde|Rita Lee|1981|pop|medium|hum lang=pt region=BR
Codinome Beija-Flor|Cazuza|1985|rock|easy|hum lang=pt region=BR
O Nosso Amor a Gente Inventa|Cazuza|1987|rock|medium|hum lang=pt region=BR
Faz Parte do Meu Show|Cazuza|1988|rock|easy|hum lang=pt region=BR
Ideologia|Cazuza|1988|rock|easy|hum lang=pt region=BR
Brasil|Cazuza|1988|rock|easy|hum lang=pt region=BR
Maior Abandonado|Barão Vermelho|1984|rock|easy|hum lang=pt region=BR
Por Você|Barão Vermelho|1998|rock|easy|hum lang=pt region=BR
Puro Êxtase|Barão Vermelho|1998|rock|medium|hum lang=pt region=BR
Pense e Dance|Barão Vermelho|1987|rock|medium|hum lang=pt region=BR
Será|Legião Urbana|1985|rock|easy|hum lang=pt region=BR
Ainda É Cedo|Legião Urbana|1985|rock|medium|hum lang=pt region=BR
Índios|Legião Urbana|1986|rock|easy|hum lang=pt region=BR
Há Tempos|Legião Urbana|1989|rock|medium|hum lang=pt region=BR
Teatro dos Vampiros|Legião Urbana|1991|rock|medium|hum lang=pt region=BR
Perfeição|Legião Urbana|1993|rock|easy|hum lang=pt region=BR
Giz|Legião Urbana|1993|rock|medium|hum lang=pt region=BR
Polícia|Titãs|1986|rock|easy|hum lang=pt region=BR
Homem Primata|Titãs|1986|rock|medium|hum lang=pt region=BR
Bichos Escrotos|Titãs|1986|rock|medium|hum lang=pt region=BR
Pra Dizer Adeus|Titãs|1985|rock|medium|hum lang=pt region=BR
Enquanto Houver Sol|Titãs|2003|rock|easy|hum lang=pt region=BR
Porque Eu Sei Que É Amor|Titãs|2009|rock|medium|hum lang=pt region=BR
Família|Titãs|1986|rock|easy|hum lang=pt region=BR
É o Amor|Zezé Di Camargo & Luciano|1991|country|easy|hum lang=pt region=BR
Detalhes|Roberto Carlos|1971|pop|easy|hum lang=pt region=BR
Emoções|Roberto Carlos|1981|pop|easy|hum lang=pt region=BR
Eduardo e Mônica|Legião Urbana|1986|rock|easy|hum lang=pt region=BR
Que País É Este|Legião Urbana|1987|rock|easy|hum lang=pt region=BR
Vento no Litoral|Legião Urbana|1991|rock|easy|hum lang=pt region=BR
Garota Nacional|Skank|1996|rock|easy|hum lang=pt region=BR
Sutilmente|Skank|2008|rock|easy|hum lang=pt region=BR
Só Hoje|Jota Quest|2002|rock|easy|hum lang=pt region=BR
Só os Loucos Sabem|Charlie Brown Jr.|2009|rock|easy|hum lang=pt region=BR
Sonífera Ilha|Titãs|1984|rock|easy|hum lang=pt region=BR
Comida|Titãs|1987|rock|easy|hum lang=pt region=BR
Epitáfio|Titãs|2001|rock|easy|hum lang=pt region=BR
Alagados|Os Paralamas do Sucesso|1986|rock|easy|hum lang=pt region=BR
Lanterna dos Afogados|Os Paralamas do Sucesso|1989|rock|easy|hum lang=pt region=BR
Bete Balanço|Barão Vermelho|1984|rock|easy|hum lang=pt region=BR
Pro Dia Nascer Feliz|Barão Vermelho|1983|rock|easy|hum lang=pt region=BR
O Que Sobrou do Céu|O Rappa|1999|rock|medium|hum lang=pt region=BR
Minha Alma (A Paz Que Eu Não Quero)|O Rappa|1999|rock|medium|hum lang=pt region=BR
Chuva de Arroz|Luan Santana|2015|country|easy|hum lang=pt region=BR
Zona de Perigo|Léo Santana|2023|pop|easy|hum lang=pt region=BR
Vai Dar PT|Zé Neto & Cristiano|2016|country|easy|hum lang=pt region=BR
Largado às Traças|Zé Neto & Cristiano|2018|country|easy|hum lang=pt region=BR
Você é Linda|Caetano Veloso|1983|pop|easy|hum lang=pt region=BR
Asa Branca|Luiz Gonzaga|1947|folk|easy|hum lang=pt region=BR
O Xote das Meninas|Luiz Gonzaga|1953|folk|easy|hum lang=pt region=BR
Ovelha Negra|Rita Lee|1975|rock|easy|hum lang=pt region=BR
Mania de Você|Rita Lee|1979|pop|easy|hum lang=pt region=BR
Lança Perfume|Rita Lee|1980|pop|easy|hum lang=pt region=BR
Alegria, Alegria|Caetano Veloso|1967|pop|easy|hum lang=pt region=BR
O Leãozinho|Caetano Veloso|1977|pop|easy|hum lang=pt region=BR
Apesar de Você|Chico Buarque|1970|pop|easy|hum lang=pt region=BR
Andar com Fé|Gilberto Gil|1982|pop|easy|hum lang=pt region=BR
Aquele Abraço|Gilberto Gil|1969|pop|easy|hum lang=pt region=BR
Oceano|Djavan|1989|pop|easy|hum lang=pt region=BR
Trem-Bala|Ana Vilela|2017|pop|medium|hum lang=pt region=BR
Tempo Perdido|Legião Urbana|1986|rock|easy|hum lang=pt region=BR
Do Seu Lado|Jota Quest|2002|rock|easy|hum lang=pt region=BR
Grândola, Vila Morena|José Afonso|1971|folk|easy|hum lang=pt region=PT
Uma Casa Portuguesa|Amália Rodrigues|1953|folk|easy|hum lang=pt region=PT
Estranha Forma de Vida|Amália Rodrigues|1962|folk|medium|hum lang=pt region=PT
Meteoro|Luan Santana|2009|country|easy|hum lang=pt region=BR
Te Esperando|Luan Santana|2013|country|easy|hum lang=pt region=BR
Escreve Aí|Luan Santana|2015|country|easy|hum lang=pt region=BR
Os Anjos Cantam|Jorge & Mateus|2015|country|easy|hum lang=pt region=BR
Cheguei|Ludmilla|2017|funk|easy|hum lang=pt region=BR
Rainha da Favela|Ludmilla|2020|funk|easy|hum lang=pt region=BR
K.O.|Pabllo Vittar|2017|pop|easy|hum lang=pt region=BR
Amigo|Roberto Carlos|1977|pop|easy|hum lang=pt region=BR
É uma Partida de Futebol|Skank|1996|rock|easy|hum lang=pt region=BR
Na Moral|Jota Quest|2002|rock|easy|hum lang=pt region=BR
Encontrar Alguém|Jota Quest|1996|rock|medium|hum lang=pt region=BR
Vital e Sua Moto|Os Paralamas do Sucesso|1983|rock|easy|hum lang=pt region=BR
Independência|Capital Inicial|1987|rock|medium|hum lang=pt region=BR
Porto Sentido|Rui Veloso|1986|rock|easy|hum lang=pt region=PT
Desafinado|João Gilberto|1959|jazz|easy|hum lang=pt region=BR
Insensatez|João Gilberto|1961|jazz|medium|hum lang=pt region=BR
A Vida do Viajante|Luiz Gonzaga|1953|folk|medium|hum lang=pt region=BR
Doce Vampiro|Rita Lee|1979|rock|medium|hum lang=pt region=BR
Tigresa|Caetano Veloso|1977|pop|medium|hum lang=pt region=BR
Roda Viva|Chico Buarque|1967|pop|easy|hum lang=pt region=BR
Trocando em Miúdos|Chico Buarque|1978|pop|medium|hum lang=pt region=BR
Divino Maravilhoso|Gal Costa|1968|pop|medium|hum lang=pt region=BR
Palco|Gilberto Gil|1981|pop|easy|hum lang=pt region=BR
Se Eu Quiser Falar com Deus|Gilberto Gil|1981|pop|medium|hum lang=pt region=BR
Travessia|Milton Nascimento|1967|pop|easy|hum lang=pt region=BR
Nos Bailes da Vida|Milton Nascimento|1981|pop|medium|hum lang=pt region=BR
Sina|Djavan|1982|pop|easy|hum lang=pt region=BR
Flor de Lis|Djavan|1976|pop|easy|hum lang=pt region=BR
Se...|Djavan|1992|pop|easy|hum lang=pt region=BR
Samurai|Djavan|1982|pop|easy|hum lang=pt region=BR
As Rosas Não Falam|Cartola|1976|pop|easy|hum lang=pt region=BR
O Mundo É um Moinho|Cartola|1976|pop|easy|hum lang=pt region=BR
Vai Passar|Chico Buarque|1984|pop|easy|hum lang=pt region=BR
Meu Mundo Caiu|Maysa|1958|oldies|medium|hum lang=pt region=BR
Zóio de Lula|Charlie Brown Jr.|1999|rock|easy|hum lang=pt region=BR
Beija Eu|Marisa Monte|1991|pop|easy|hum lang=pt region=BR
Deixa a Vida Me Levar|Zeca Pagodinho|2002|pop|easy|hum lang=pt region=BR
Verdade|Zeca Pagodinho|1996|pop|medium|hum lang=pt region=BR
Borboletas|Victor & Leo|2008|country|easy|hum lang=pt region=BR
Infinita Highway|Engenheiros do Hawaii|1987|rock|easy|hum lang=pt region=BR
Toda Forma de Poder|Engenheiros do Hawaii|1986|rock|easy|hum lang=pt region=BR
Somos Quem Podemos Ser|Engenheiros do Hawaii|1988|rock|easy|hum lang=pt region=BR
Um Minuto para o Fim do Mundo|CPM 22|2005|rock|easy|hum lang=pt region=BR
Regina Let's Go|CPM 22|2000|rock|medium|hum lang=pt region=BR
Cedo ou Tarde|NX Zero|2008|rock|easy|hum lang=pt region=BR
Razões e Emoções|NX Zero|2006|rock|easy|hum lang=pt region=BR
Mulher de Fases|Raimundos|1999|rock|easy|hum lang=pt region=BR
A Mais Pedida|Raimundos|1999|rock|easy|hum lang=pt region=BR
Como Eu Quero|Kid Abelha|1984|pop|easy|hum lang=pt region=BR
Pintura Íntima|Kid Abelha|1984|pop|easy|hum lang=pt region=BR
Rádio Pirata|RPM|1985|rock|easy|hum lang=pt region=BR
Olhar 43|RPM|1985|rock|easy|hum lang=pt region=BR
Vento Ventania|Biquini Cavadão|1991|rock|easy|hum lang=pt region=BR
Timidez|Biquini Cavadão|1991|rock|medium|hum lang=pt region=BR
Onde Você Mora?|Cidade Negra|1994|reggae|easy|hum lang=pt region=BR
Firmamento|Cidade Negra|1999|reggae|medium|hum lang=pt region=BR
Presente de um Beija-Flor|Natiruts|1997|reggae|easy|hum lang=pt region=BR
Quero Ser Feliz Também|Natiruts|2005|reggae|easy|hum lang=pt region=BR
Envelheço na Cidade|Ira!|1985|rock|easy|hum lang=pt region=BR
Flores em Você|Ira!|1985|rock|medium|hum lang=pt region=BR
Admirável Chip Novo|Pitty|2003|rock|easy|hum lang=pt region=BR
Na Sua Estante|Pitty|2005|rock|easy|hum lang=pt region=BR
Flores|Titãs|1989|rock|easy|hum lang=pt region=BR
Vou Deixar|Skank|2003|rock|easy|hum lang=pt region=BR
Óculos|Os Paralamas do Sucesso|1984|rock|easy|hum lang=pt region=BR
Todo Carnaval Tem Seu Fim|Los Hermanos|2001|rock|easy|hum lang=pt region=BR
Camila, Camila|Nenhum de Nós|1987|rock|easy|hum lang=pt region=BR
Inútil|Ultraje a Rigor|1983|rock|easy|hum lang=pt region=BR
Nós Vamos Invadir Sua Praia|Ultraje a Rigor|1985|rock|easy|hum lang=pt region=BR
Você Não Soube Me Amar|Blitz|1982|rock|easy|hum lang=pt region=BR
Quando o Sol se For|Detonautas|2002|rock|easy|hum lang=pt region=BR
Efectivamente|GNR|1987|rock|easy|hum lang=pt region=PT
Sempre que o Amor Me Quiser|Delfins|1988|pop|medium|hum lang=pt region=PT
Nasce Selvagem|Delfins|1987|pop|easy|hum lang=pt region=PT
Chico Fininho|Rui Veloso|1980|rock|easy|hum lang=pt region=PT
A Paixão (Segundo Nicolau da Viola)|Rui Veloso|1990|rock|easy|hum lang=pt region=PT
Ouvi Dizer|Ornatos Violeta|1999|rock|easy|hum lang=pt region=PT
Problema de Expressão|Clã|1996|pop|medium|hum lang=pt region=PT
Cavalos de Corrida|UHF|1980|rock|easy|hum lang=pt region=PT
`, { language: "pt", scope: "local" }),
};

/**
 * Rozšírenie svetového poolu. Pôvodný blok zostáva nedotknutý — nové skladby
 * majú navyše rok, žáner a náročnosť, takže výber s nimi vie pracovať.
 * Neanglicky spievané svetové hity nesú príznak `lang=`.
 */
const WORLD_HITS_EXTENDED = parseSongs(`
Self Control|Laura Branigan|1984|pop|medium
Nothing Compares 2 U|Sinéad O'Connor|1990|pop|medium
Killing Me Softly with His Song|Fugees|1996|rnb|medium
When You Say Nothing at All|Ronan Keating
Gloria|Laura Branigan
Here I Go Again|Whitesnake
Go West|Pet Shop Boys
Love Is All Around|Wet Wet Wet
Twist and Shout|The Beatles|1963|oldies|easy
Unchained Melody|The Righteous Brothers|1965|oldies|easy
House of the Rising Sun|The Animals|1964|rock|easy
Simply the Best|Tina Turner|1989|pop|easy
Tainted Love|Soft Cell|1981|pop|medium
Walking on Sunshine|Katrina and the Waves|1983|pop|easy
Torn|Natalie Imbruglia|1997|pop|medium
Bodies|Drowning Pool|2001|metal|hard
Since You've Been Gone|Rainbow|1979|rock|hard
Apologize|OneRepublic|2006|pop|easy
Animals|Martin Garrix|2013|dance|medium
Believer of Nothing|Nothing But Thieves|2017|rock|hard
Cruel|Sabrina Carpenter|2024|pop|hard
泡沫|G.E.M.|2012|pop|hard|lang=other
Beggin'|Måneskin|2017|rock|easy
Sweet Dreams|Eurythmics|1983|pop|easy
Everything I Do|Bryan Adams
I Love Rock 'n' Roll|Joan Jett
I Say a Little Prayer|Aretha Franklin
No More Drama|Mary J. Blige
Killing Me Softly|Fugees
Silhouettes|Avicii
Scary Monsters and Nice Sprites|Skrillex
Mambo No. 5|Lou Bega
YMCA|Village People
Rivers of Babylon|Boney M.
Living on My Own|Freddie Mercury
There Is a Light That Never Goes Out|The Smiths
Satisfaction|The Rolling Stones
Suzanne|Leonard Cohen
Time|Pink Floyd
Fade to Black|Metallica
Iron Man|Black Sabbath
War Pigs|Black Sabbath
Still Loving You|Scorpions
Cherokee|Europe
Don't Stop Believing|Journey
Formation|Beyoncé
I Feel It Coming|The Weeknd
Die For You|The Weeknd
Side to Side|Ariana Grande
Into You|Ariana Grande
Therefore I Am|Billie Eilish
The Climb|Miley Cyrus
Lucky|Britney Spears
Payphone|Maroon 5
Hymn for the Weekend|Coldplay
Bad Liar|Imagine Dragons
If I Lose Myself|OneRepublic
When Love Takes Over|David Guetta
Turn Me On|David Guetta
Fireball|Pitbull
Not Afraid|Eminem
Mockingbird|Eminem
Longview|Green Day
Some Might Say|Oasis
Dangerous Woman|Ariana Grande
DJ Got Us Fallin' in Love|Usher
Forever|Chris Brown
With You|Chris Brown
So Sick|Ne-Yo
Miss Independent|Ne-Yo
Lonely|Akon
Smack That|Akon
Tik Tok|Kesha
Elastic Heart|Sia
Ordinary People|John Legend
I'm Not the Only One|Sam Smith
Too Good at Goodbyes|Sam Smith
Before You Go|Lewis Capaldi
Adore You|Harry Styles
Late Night Talking|Harry Styles
Sorry Not Sorry|Demi Lovato
Heart Attack|Demi Lovato
Going Under|Evanescence
When You Were Young|The Killers
Scared to Be Lonely|Martin Garrix
Symphony|Clean Bandit
Solo|Clean Bandit
Prayer in C|Robin Schulz
OK|Robin Schulz
Ain't Nobody|Felix Jaehn
West End Girls|Pet Shop Boys
Animal|Def Leppard
I Don't Want a Lover|Texas
The Bitter End|Placebo
Gold|Spandau Ballet
Disco 2000|Pulp
Parklife|Blur
Coffee & TV|Blur
Breakeven|The Script
Ruby|Kaiser Chiefs
I Predict a Riot|Kaiser Chiefs
What You Know|Two Door Cinema Club
Club Foot|Kasabian
Munich|Editors
Papillon|Editors
A-Punk|Vampire Weekend
No Surprises|Radiohead
`, { language: "en", scope: "global" });

/**
 * Rozšírenie lokálnych poolov. Kľúčom je spievaný jazyk, takže čeština je
 * samostatný pool — slovenská hra ho berie cez `RELEVANT_SONG_LANGUAGES`.
 */
const LOCAL_HITS_EXTENDED: Partial<Record<SongLanguage, Song[]>> = {
  sk: parseSongs(`
Všetko má svoj čas|Kali|2011|rap|medium|hum
Navždy|Kali|2013|rap|medium|hum
Jazero|Kali|2014|rap|medium|hum
Načo pôjdem domov|Katarína Knechtová|2008|pop|medium
Horšie ako inokedy|Katarína Knechtová|2010|pop|hard
Otec|Para|2009|rock|hard
Nestrácaj nádej|Mária Čírová|2013|pop|hard
Tobogan|Miro Jaroš|2013|pop|hard
Len sa smej|Billy Barman|2013|indie|hard
Traja|Billy Barman|2015|indie|hard
Láska je tu s nami|Peter Nagy|1987|pop|easy
Len pomaly|Peter Nagy|1988|pop|medium
Horou|Zuzana Smatanová|2008|pop|hard
Chlapci spod Tatier|Kollárovci|2010|folk|medium
Daj mi lásku|Kollárovci|2012|folk|medium
Party DJ|Dara Rolins|2011|pop|medium
Fajčenie škodí zdraviu|Vidiek|1999|rock|medium
Hlavu maj hore|Sima|2019|rap|medium|hum
Máme svoj deň|Peter Bič Project|2011|pop|medium
Skúšame sa nájsť|Peter Bič Project|2013|pop|hard
Niečo nové|Korben Dallas|2013|indie|hard
Kým sa rozídeme|Korben Dallas|2015|indie|hard
Voňavý deň|Adam Ďurica|2016|pop|medium
Neverím|Adam Ďurica|2018|pop|medium
Na hranici|Kristína|2012|pop|hard
Nespavosť|Miroslav Žbirka|1986|pop|hard
Nekonečná|IMT Smile|2010|pop|medium
Trilogia|IMT Smile|2012|pop|hard
Kráľovná|Polemic|2001|reggae|hard
Ružinov|Slobodná Európa|1991|punk|hard
Bezvetrie|Iné Kafe|2004|punk|hard
Vyznanie duše|Marika Gombitová|1984|pop|hard
Zvonky štastia|Karel Gott & Darina Rolincová|1984|pop|easy
Nebúchaj|Rytmus|2008|rap|medium|hum
Bengoro|Rytmus|2010|rap|medium|hum
Pekelná|Kontrafakt|2006|rap|hard|hum
Toto je môj štýl|Majk Spirit|2011|rap|medium|hum
Nový človek|Majk Spirit|2012|rap|medium|hum
Spomaly|Peha|2002|pop|medium
Muoj bože|Peha|2006|pop|hard
Na jednej lodi|Kali|2012|rap|medium|hum
Srdce ako z kameňa|Kali|2013|rap|medium|hum
Čakám|Kali|2015|rap|hard|hum
Ideme ďalej|Kali|2016|rap|hard|hum
Keď jazdíme my|Ego|2011|rap|medium|hum
Exotica|IMT Smile|2008|pop|medium
S tebou ma baví svet|Peter Cmorik|2010|pop|medium
Sokoly|Kollárovci|2014|folk|medium
Naša|Para|2011|rock|hard
Ó, maňo|Vidiek|1998|rock|medium
Femina|Sima|2021|rap|hard|hum
Motýľ hlavolam|Katarína Knechtová|2011|pop|hard
Vo svetle žiariacich hviezd|Katarína Knechtová|2013|pop|hard
Mladým chýba vojna|Billy Barman|2014|indie|hard
Hannah|Billy Barman|2016|indie|hard
Hej, dievča|Bystrík|2008|pop|medium
Všetko bude fajn|Misha|2010|pop|medium
Náladu mi dvíhaš|Misha|2012|pop|hard
Kým vieš snívať|Katarína Koščová|2005|pop|medium
Môj Bože|Katarína Koščová|2007|pop|hard
Lietajúci Cyprián|Komajota|1996|rock|hard
Ráno v novinách|Komajota|1998|rock|hard
Mesto|Polemic|2005|reggae|hard
Kašovité jedlá|Iné Kafe|2005|punk|hard
S tebou alebo bez teba|Tomáš Bezdeda|2007|pop|medium
Len ty|Tomáš Bezdeda|2009|pop|hard
Crushin' My Fairytale|Celeste Buckingham|2013|pop|hard
Čisté tvary|Miro Jaroš|2014|pop|hard
Kto vie|Miro Jaroš|2016|pop|hard
Technotronic Flow|Majk Spirit|2013|rap|hard|hum
Detektívka|Elán
Hodina zemepisu|Elán
Ružová dáma|Elán
Nespáľ tie mosty|Pavol Habera
Nádej|Pavol Habera
Verklík|Team
Múr, ktorý stavám|Miroslav Žbirka
Zlomená duša|Miroslav Žbirka
Zbohom buď|Miroslav Žbirka
Srdce ako kladivo|Richard Müller
Oči vlka|Richard Müller
Vlak čo nikde nestojí|Richard Müller
Neusínaj|Jana Kirschner
Pokoj|Jana Kirschner
Modré hory|Jana Kirschner
Láska sa nevracia|Jana Kirschner
Pelikán|Jana Kirschner
Zabudnutá|Zuzana Smatanová
Little Miss Sunshine|Zuzana Smatanová
Nechaj ma byť|Zuzana Smatanová
Snežná kráľovná|Zuzana Smatanová
Vráť mi tie hviezdy|Zuzana Smatanová
Emócie|Kristína
Vráť mi tie ruže|Kristína
Vyhraj alebo prehraj|IMT Smile
Kým ťa nájdem|IMT Smile
Zlatá rybka|IMT Smile
Nočná obloha|Desmod
Bolí|Desmod
Prekliaty|Desmod
Vetrom hnaný|Desmod
Kde bolo tam bolo|Desmod
Nedokonalý|Desmod
Sladké mámenie|Desmod
Nemôžem tomu uveriť|No Name
Prečo|No Name
Sníček|No Name
Kým ťa mám ja|No Name
Aleluja|No Name
Nezabudni|Peha
Kým ťa nemám|Peha
Rock and roll|Horkýže Slíže
Vlak do neba|Horkýže Slíže
Šampón|Horkýže Slíže
Mám v hlave chaos|Horkýže Slíže
Nemám na to nervy|Horkýže Slíže
Alkohol|Iné Kafe
Vlčie maky|Iné Kafe
Zabudni na to|Iné Kafe
Dva dni|Polemic
Nechaj to na mne|Polemic
Šarmantný|Polemic
Zlatokopka|Rytmus
Technik|Rytmus
Bystrica|Rytmus
Chráň si to|Hex
Kým ťa nájdem ja|Hex
Zvláštny sen|Hex
Nočný vlak|Kali
Sám|Kali
Prázdny dom|Kali
Do rána|Kali
Nedokonalá|Separ
Zlomený|Separ
Sám sebou|Separ
Rande|Majk Spirit
Som ako som|Majk Spirit
Naposledy|Adam Ďurica
Malé veľké lásky|Adam Ďurica
Neplač|Adam Ďurica
Blue Guitar|Celeste Buckingham
Nezabudnem|Dominika Mirgová
Prsteň|Sima
Nočná|Sima
Ty a ja|Tina
Znovu|Tina
Anjel strážny|Gleb
Ona|Gleb
Neexistuješ|Ego
Chcem ťa|Ego
Múr|Miroslav Žbirka
Zostaň so mnou|Marika Gombitová
Môj malý princ|Marika Gombitová
Ruže|Marika Gombitová
Slnečnice|Peter Nagy
Sme si rovní|Peter Nagy
Kristínka|Peter Nagy
Poslední mohykáni|Peter Nagy
Nezabudni na mňa|Tublatanka
Nebo, peklo, raj|Tublatanka
Skús mi vrátiť tie hviezdy|Tublatanka
Buď mojou hviezdou|Tublatanka
Ranná hviezda|Karol Duchoň
Nikdy nebudem viac sám|Karol Duchoň
Chýbaš mi|Katarína Knechtová
Zmráka sa|Katarína Knechtová
Vstávaj|Katarína Knechtová
Vietor|Katarína Knechtová
Nechaj to na mňa|Zuzana Smatanová
Nočná mora|Desmod
Nezomieraj|No Name
Kým ťa stretnem|No Name
Ostávam|No Name
Prázdna|Hex
Kým budeš so mnou|Hex
Ostrov|Hex
Ale ja|Peha
Nezabúdaj|Peha
Traumatická|Peha
Vlny|Jana Kirschner
Anjelik|Jana Kirschner
Nechaj ma spať|Kristína
Mesiac|Kristína
Kaskadéri|Elán
Zanedbaná|Elán
Kým nás smrť nerozdelí|Desmod
Vlak do Bratislavy|IMT Smile
Nedá sa|No Name
Bosý|Hex
Kúsok|Peha
Ryba|Horkýže Slíže
Silvia|Horkýže Slíže
Zabudni|Zuzana Smatanová
Sama|Nocadeň
Ostaň|Nocadeň
Kozáci|Heľenine oči
Uhorčík|Heľenine oči
Profesionál|Heľenine oči
Hoja hop|Heľenine oči
Plavčík Milan|Heľenine oči
Tak tu som|Heľenine oči
Pálila babka pálenku|Heľenine oči
Podnikateľ|Heľenine oči
Ta to som ja|Chiki liki tu-a
Harmonika|Chiki liki tu-a
Dobrý večer mladý pán|Chiki liki tu-a
O päť minút dvanásť|Chiki liki tu-a
Kávu alebo čaj?|Le Payaco
Hodím si korunou|Le Payaco
Ponorka|Le Payaco
V Tatrách|Le Payaco
Poď so mnou von|Le Payaco
Zlatý jeleň|Korben Dallas
Kamene|Korben Dallas
Železný vlak|Korben Dallas
Čierne ráno|Korben Dallas
Na chate|Smola a Hrušky
Posteľ|Smola a Hrušky
Cigareta|Smola a Hrušky
Elvis Presný|Smola a Hrušky
Kubánske pomaranče|Smola a Hrušky
Nechajte si ju|Vidiek
Rádioaktívny udavač|Vidiek
Miska s mliekom|Nocadeň
V žiare noci|Nocadeň
Letíš padáš|Nocadeň
Slová už nevravia nič|Nocadeň
Zaľúbená žaba|Metalinda
Maj May|Metalinda
Majstri sveta|Metalinda
Edo|Robo Grigorov
Liza a Wendy|Horkýže Slíže
Tanečnica z Lúčnice|Elán
`, { language: "sk", scope: "local", region: "SK" }),

  cs: parseSongs(`
Sarajevo|Jaromír Nohavica|1988|folk|medium
Mikymauz|Jaromír Nohavica|1996|folk|hard
Až mě andělé|Jaromír Nohavica|2000|folk|hard
Holky z naší školky|Michal David|1984|pop|easy
Chtěl jsem mít|Michal David|1986|pop|hard
Dáša Nováková|Ivan Mládek|1979|folk|hard
Trouba|Lucie Bílá|1995|pop|hard
Dobrák od kosti|Chinaski|2002|rock|medium
Pretty Girl|Buty|1997|rock|hard
Inzerát|Kryštof|2007|pop|hard
Františkovy Lázně|Mandrage|2010|pop|hard
Malá noční můra|Rybičky 48|2014|punk|hard
Nebe|Barbora Poláková|2015|indie|hard
Kdyby|Hana Hegerová|1968|chanson|medium
Levandulová|Hana Hegerová|1970|chanson|medium
Miláčku|Jiří Korn|1980|pop|medium
Snídaně v trávě|Michal Tučný|1987|country|hard
Mám jizvu na rtu|Jaromír Nohavica|1988|folk|hard
Hlídač krav|Jaromír Nohavica|1990|folk|medium
Zatímco se koupeš|Jaromír Nohavica|1994|folk|hard
Colu, pijeme colu|Michal David|1985|pop|medium
Růže z papíru|Nedvědi|1988|folk|medium
Stánky|Nedvědi|1985|folk|medium
Most přes minulost|Lucie Bílá|1996|pop|medium
Na dlani|Mandrage|2012|pop|hard
Jednou budem dál|Karel Gott
Kdyby se vrátil čas|Lucie Bílá
Miss Moskva|Jiří Korn
Bum bum bum|Petr Kotvald
Nespoutaný kůň|Petr Kotvald
Až mě odvedou|Divokej Bill
Modré nebe|Olympic
Dej mi ještě jeden den|Olympic
Motorest|Petra Janů
Valčík|Daniel Landa
Pozdrav|Daniel Landa
Nigredo|Daniel Landa
Malá čarodějnice|Rybičky 48
Ještě jednu|Rybičky 48
Šrouby a matky|Mandrage
Pití|Wohnout
Pedro se vrací|Wohnout
Uragán|Support Lesbiens
Kingdom Come|Support Lesbiens
Na kolena|Tři sestry
Bílá paní|Tři sestry
Cudzinka v tvojej zemi|Xindl X
Vrať mi ty hvězdy|Marek Ztracený
Voní|Aneta Langerová
Hlídej si mě|Aneta Langerová
Když nemůžeš|Ben Cristovao
Celá|Slza
Lhůta|Slza
Vedle mě|Chinaski
Klídek|Chinaski
Krtek|Buty
Nikdy nebudeme dospělí|Rybičky 48
`, { language: "cs", scope: "local", region: "CZ" }),

  de: parseSongs(`
Von hier an blind|Wir sind Helden|2005|indie|hard
Bonnie und Clyde|Die Toten Hosen|1996|punk|hard
Ohne dich|Rammstein|2004|metal|hard
Wind of Change auf Deutsch|Peter Maffay|1980|rock|hard
So bist du|Peter Maffay|1979|rock|hard
Merci Chérie|Udo Jürgens|1966|schlager|hard
Verlieben, verloren|Wolfgang Petry|1997|schlager|hard
Aha|Nena|1984|pop|hard
Wunder|Nina Chuba|2022|pop|medium
Bad Habits auf Deutsch|Mark Forster|2018|pop|hard
Krieger des Lichts|Silbermond|2009|pop|hard
Nur wir zwei|Glasperlenspiel|2011|pop|hard
Nordisch by Nature|Fettes Brot|1995|rap|hard|hum
Bring die Nacht|BONEZ MC|2018|rap|hard|hum
Ich und meine Maske|Alligatoah|2013|rap|hard|hum
Amoi seg' ma uns wieder|Andreas Gabalier|2011|schlager|hard|region=AT
Fürstenfeld|STS|1984|rock|hard|region=AT
Großvater|STS|1984|rock|hard|region=AT
Bungalow|Bilderbuch|2015|indie|hard|region=AT
Maschin|Bilderbuch|2014|indie|hard|region=AT
Ein Schwein namens Männer|Die Ärzte
Frag nicht nach Sonnenschein|Peter Maffay
Über sieben Brücken musst du gehen|Peter Maffay
Wie ich bin|Mark Forster
Nicht so schnell|Max Giesinger
Bad Boys Cry|Apache 207
Bruder|Sido
Ich baller|Bushido
Auseinandergehen ist schwer|Wanda||||region=AT
Ein Stern|DJ Ötzi
Ich will nur dass du weißt|Sportfreunde Stiller
Ich hab getanzt|Matthias Reim
Weißt du noch|Peter Maffay
Über sieben Brücken|Karat
Sonne, Mond und Sterne|Ich + Ich
Ich kenne nichts|Xavier Naidoo
Monsoon|Tokio Hotel
Ich hab dich lieb|Nena
Halt mich fest|Silbermond
Unendlich|Silbermond
Kein Liebeslied|Kraftklub
Hurra, die Welt geht unter|Kraftklub
Hier kommt die Sonne|Beatsteaks
Hilf mir fliegen|Unheilig
Hyper Hyper|Scooter
How Much Is the Fish?|Scooter
`, { language: "de", scope: "local", region: "DE" }),

  en: parseSongs(`
Feeling Good|Nina Simone|1965|jazz|medium
Valerie|Amy Winehouse|2007|rnb|easy
Mad World|Gary Jules|2001|indie|medium
Skinny Love|Bon Iver|2007|indie|hard
505|Arctic Monkeys|2007|indie|hard
Sit Down|James
Impossible|James Arthur
Grown Woman|Beyoncé
Run|Leona Lewis
`, { language: "en", scope: "local" }),

  es: parseSongs(`
Corazón Partido|Alejandro Sanz|1997|latin|medium
Puedes Contar Conmigo|La Oreja de Van Gogh|2003|pop|hard
Corazón Espinado|Maná
Tuyo Siempre|Melendi
Malditos Callejones|Estopa
Ella y Yo|Don Omar
Algo Me Gusta de Ti|Wisin & Yandel
X|Nicky Jam
Taki Taki|Ozuna
Criminal|Ozuna
Tutu|Camilo
Guantanamera|Compay Segundo
Chan Chan|Compay Segundo
La Gota Fría|Carlos Vives
Colgando en Tus Manos|Carlos Baute
Como Han Pasado los Años|Luis Miguel
Ahora Te Puedes Marchar|Luis Miguel
Te Extraño|Luis Miguel
Mi Niñez|Joan Manuel Serrat
La Playa de Los Alemanes|El Canto del Loco
Corazón Contento|Reik
Me Niego|Reik
Yo Te Esperaré|Sin Bandera
Chilanga banda|Café Tacvba
Bombón asesino|Vilma Palma e Vampiros
`, { language: "es", scope: "local" }),

  fr: parseSongs(`
Paroles, Paroles|Dalida
Sous le Ciel de Paris|Yves Montand
La Javanaise|Serge Gainsbourg|1963|chanson|hard
Les Champs-Élysées|Joe Dassin|1969|pop|easy
Doudou|Aya Nakamura
Je te promets|Zaz
Cool|Maître Gims
Reste|Maître Gims
Nos Absences|Julien Doré
Longtemps|Amir
Clique|Slimane
À fleur de toi|Slimane
Le Coup de Soleil|Vianney
Tomber la neige|Christophe Maé
Caruso|Florent Pagny
En amour|Calogero
Défaite de famille|Orelsan
Sur le Fil|Bigflo & Oli
Le Diable ne s'habille plus en Prada|Soprano
Réalité augmentée|Nekfeu
Be My Baby|Vanessa Paradis
She|Charles Aznavour
L'Hymne à l'Amour|Édith Piaf
Tombé pour elle|Pascal Obispo
Tout|Lara Fabian
Léa|Louise Attaque
Lola|Superbus
Désolé pour hier soir|Tryo
Le gang|BB Brunes
Comme elle vient|Noir Désir
`, { language: "fr", scope: "local" }),

  pt: parseSongs(`
Amor de Índio|Beto Guedes|1978|pop|hard
Sozinho|Caetano Veloso|1998|pop|medium
Sampa|Caetano Veloso|1978|pop|hard
Cálice|Chico Buarque|1978|pop|hard
Faroeste Caboclo|Legião Urbana|1987|rock|hard
Sinal Fechado|Paulinho da Viola|1969|pop|hard
Vapor Barato|O Rappa|1996|rock|hard
60 Segundos|Gusttavo Lima
Você Não Sabe o Que É Amor|Luan Santana
Camisa 10|Turma do Pagode
Aquele 1|Turma do Pagode
Deixa Alagar|Turma do Pagode
Coração Vazio|Jorge e Mateus
Pode Chorar|Jorge e Mateus
Amo Noite e Dia|Jorge e Mateus
Aquele Lugar|Henrique e Juliano
Mistura Louca|Henrique e Juliano
Liberdade Provisória|Henrique e Juliano
Bem Pior Que Eu|Marília Mendonça
Graveto|Marília Mendonça
Camarote|Wesley Safadão
Ar Condicionado no 15|Wesley Safadão
Ainda Gosto de Você|Wesley Safadão
Céu da Boca|Ivete Sangalo
Não Precisa Mudar|Ivete Sangalo
Girl from Rio|Anitta
Onde É Que Eu Errei|Ludmilla
Sua Cara|Pabllo Vittar
Ocean|Alok
Un Ratito|Alok
Como Vai Você|Roberto Carlos
Fico Assim Sem Você|Adriana Calcanhotto
Ainda Gosto Dela|Skank
Fica|Jota Quest
Zé Trindade|Charlie Brown Jr.
Primeiros Erros|Capital Inicial
Á Sua Maneira|Capital Inicial
Roots Bloody Roots|Sepultura
Chá de Sumiço|Léo Santana
Amor de Verdade|MC Kekel
Barquinho|Zé Neto e Cristiano
Chuva de Prata|Xutos & Pontapés
Pontes de Papel|Rui Veloso
Búzios|Ana Moura
Wave|Tom Jobim
Corcovado|Tom Jobim
Carinhoso|Pixinguinha
Baião|Luiz Gonzaga
Como 2 e 2|Gal Costa
Preciso Me Encontrar|Cartola
Dormi na Praça|Bruno & Marrone
Uma Partida de Futebol|Skank
Homem do Mar|Xutos & Pontapés
Balada do Desajeitado|D.A.M.A
`, { language: "pt", scope: "local" }),
};

const WORLD_SONG_EXPANSIONS = parseSongs(WORLD_SONG_EXPANSION, {
  language: "en",
  scope: "global",
  artistLanguages: Object.fromEntries(
    Object.entries(WORLD_SONG_ARTIST_LANGUAGES).map(([artist, language]) => [
      normalizeArtistKey(artist),
      language,
    ]),
  ) as Record<string, SongLanguage>,
});

const LOCAL_SONG_EXPANSIONS: Partial<Record<SongLanguage, Song[]>> = {
  sk: parseSongs(SLOVAK_SONG_EXPANSION, {
    language: "sk",
    scope: "local",
    region: "SK",
  }),
  cs: parseSongs(CZECH_SONG_EXPANSION, {
    language: "cs",
    scope: "local",
    region: "CZ",
  }),
  en: parseSongs(ENGLISH_SONG_EXPANSION, {
    language: "en",
    scope: "local",
  }),
  de: parseSongs(GERMAN_SONG_EXPANSION, {
    language: "de",
    scope: "local",
    region: "DE",
  }),
  es: parseSongs(SPANISH_SONG_EXPANSION, {
    language: "es",
    scope: "local",
  }),
  fr: parseSongs(FRENCH_SONG_EXPANSION, {
    language: "fr",
    scope: "local",
    region: "FR",
  }),
  pt: parseSongs(PORTUGUESE_SONG_EXPANSION, {
    language: "pt",
    scope: "local",
  }),
};

function uniqueSongs(songs: readonly Song[]): Song[] {
  return Array.from(new Map(songs.map((song) => [song.id, song])).values());
}

/**
 * Aktívny svetový pool je úmyselne menší než historický archív nižšie.
 *
 * Masovo dopĺňané extended/expansion zoznamy obsahovali veľa regionálnych,
 * neznámych a nesprávne označených skladieb. Hudobný kvíz preto čerpá iba z
 * ručne kurátorovaného jadra. `hard` položka môže zostať v zdroji na ďalšiu
 * revíziu, do bežnej hry sa však nedostane.
 */
export const GLOBAL_SONGS: Song[] = uniqueSongs(
  WORLD_HITS.filter((song) => song.tier !== "hard"),
);

/** Autoritatívne lokálne pooly sú rovnako iba ručne kurátorované základné
 * zoznamy. Rozšírenia ostávajú v súbore ako archív pre budúcu individuálnu
 * revíziu, ale hra ich automaticky neaktivuje. */
const LOCAL_LANGUAGE_KEYS = Object.keys(LOCAL_HITS) as SongLanguage[];

/** Lokálne pooly podľa spievaného jazyka. Kľúč je `SongLanguage`, nie jazyk UI,
 *  takže sa dá pridať čeština či poľština bez zmeny jazykov aplikácie. */
export const LOCAL_SONGS_BY_LANGUAGE: Partial<Record<SongLanguage, Song[]>> =
  Object.fromEntries(
    LOCAL_LANGUAGE_KEYS.map((language) => [
      language,
      uniqueSongs(LOCAL_HITS[language] ?? []),
    ]),
  ) as Partial<Record<SongLanguage, Song[]>>;

/**
 * Ktoré spievané jazyky sú relevantné pre daný jazyk hry. Slovenská hra berie
 * aj české skladby — sú súčasťou spoločného hudobného prostredia. Nemecká hra
 * pokrýva Nemecko, Rakúsko aj švajčiarsku nemčinu jedným poolom `de`.
 *
 * Nový lokálny pool sa pridá tu a v `LOCAL_HITS` — nikde inde.
 */
export const RELEVANT_SONG_LANGUAGES: Record<AppLanguage, SongLanguage[]> = {
  sk: ["sk", "cs"],
  en: ["en"],
  de: ["de"],
  es: ["es"],
  fr: ["fr"],
  pt: ["pt"],
};

/** Lokálne skladby pre jazyk hry vrátane blízkych jazykov. */
export function getLocalSongsForLanguage(language: AppLanguage): Song[] {
  return uniqueSongs(
    RELEVANT_SONG_LANGUAGES[language].flatMap(
      (songLanguage) => LOCAL_SONGS_BY_LANGUAGE[songLanguage] ?? [],
    ),
  );
}

const CURATED_SONGS_BY_LANGUAGE = Object.fromEntries(
  (Object.keys(RELEVANT_SONG_LANGUAGES) as AppLanguage[]).map((language) => [
    language,
    uniqueSongs([...getLocalSongsForLanguage(language), ...GLOBAL_SONGS]),
  ]),
) as Record<AppLanguage, Song[]>;

/** Celá zásoba dostupná pre daný jazyk hry (lokálne + svetové, bez duplikátov). */
export function getSongCardsForLanguage(language: AppLanguage): Song[] {
  return CURATED_SONGS_BY_LANGUAGE[language];
}

/**
 * ── Kategórie hitov ─────────────────────────────────────────────────────────
 *
 * Hráč si pred hudobnou minihrou vyberá, z akých hitov chce hrať, a kategórie
 * sa dajú ľubovoľne miešať (napr. svetové + slovenské + nemecké).
 *
 * Kategória nie je nová dátová vrstva — je to pohľad na už existujúce pooly:
 * `world` je svetový pool, ostatné sú lokálne pooly podľa spievaného jazyka.
 * Nová kategória sa preto pridá jedným záznamom nižšie a jedným poolom
 * v `LOCAL_HITS`, nikde inde.
 */
export type SongPoolKey = "world" | "sk" | "cs" | "en" | "de" | "es" | "fr" | "pt";

export interface SongPoolDefinition {
  key: SongPoolKey;
  /** Názov v nastaveniach hry. */
  label: string;
  /** Skrátený názov pre súhrn vybraných kategórií. */
  short: string;
  /** Krátke vysvetlenie pod názvom. */
  hint: string;
}

/** Poradie určuje aj poradie v nastaveniach hry. */
export const SONG_POOLS: readonly SongPoolDefinition[] = [
  { key: "world", label: "Svetové hity", short: "Svetové", hint: "Medzinárodná klasika" },
  { key: "sk", label: "Slovenské hity", short: "Slovenské", hint: "Domáca scéna" },
  { key: "cs", label: "České hity", short: "České", hint: "Českí interpreti" },
  { key: "en", label: "Anglické hity", short: "Anglické", hint: "Anglicky spievané" },
  { key: "de", label: "Nemecké hity", short: "Nemecké", hint: "Nemecko a Rakúsko" },
  { key: "es", label: "Španielske hity", short: "Španielske", hint: "Španielsky spievané" },
  { key: "fr", label: "Francúzske hity", short: "Francúzske", hint: "Francúzsky spievané" },
  { key: "pt", label: "Portugalské hity", short: "Portugalské", hint: "Portugalsky spievané" },
];

/** Ktorý lokálny pool kategória zahŕňa. `world` namiesto toho berie svetový pool. */
const POOL_SONG_LANGUAGE: Record<Exclude<SongPoolKey, "world">, SongLanguage> = {
  sk: "sk",
  cs: "cs",
  en: "en",
  de: "de",
  es: "es",
  fr: "fr",
  pt: "pt",
};

const POOL_CACHE = new Map<string, Song[]>();

/** Výber je množina — poradie ani duplikáty nesmú meniť výsledok ani kľúč cache. */
function poolCacheKey(pools: readonly SongPoolKey[]): string {
  return [...new Set(pools)].sort().join("+");
}

/**
 * Zásoba pre vybrané kategórie, bez duplikátov.
 *
 * Výsledok je memoizovaný, pretože sa volá pri každom ťahu — bez cache by sa
 * pole skladalo a dedupovalo znova pre každú vytiahnutú kartu.
 */
export function getSongsForPools(pools: readonly SongPoolKey[]): Song[] {
  const key = poolCacheKey(pools);
  const cached = POOL_CACHE.get(key);
  if (cached) return cached;
  const selected = new Set(pools);
  const songs = uniqueSongs([
    ...(selected.has("world") ? GLOBAL_SONGS : []),
    ...[...selected]
      .filter((pool): pool is Exclude<SongPoolKey, "world"> => pool !== "world")
      .flatMap((pool) => LOCAL_SONGS_BY_LANGUAGE[POOL_SONG_LANGUAGE[pool]] ?? []),
  ]);
  POOL_CACHE.set(key, songs);
  return songs;
}

/**
 * Predvolený výber pre jazyk hry. Zodpovedá presne zásobe, ktorú hra ponúkala
 * pred zavedením kategórií (svetové + lokálne pooly daného jazyka), takže hráč,
 * ktorý sa nastavení nedotkne, dostane rovnaké skladby ako doteraz.
 */
export function defaultSongPools(language: AppLanguage): SongPoolKey[] {
  const local = RELEVANT_SONG_LANGUAGES[language].filter(
    (songLanguage): songLanguage is Exclude<SongPoolKey, "world"> =>
      songLanguage in POOL_SONG_LANGUAGE,
  );
  return ["world", ...local];
}

/** Každá skladba v katalógu presne raz — pre kontroly integrity a testy. */
export const ALL_SONGS: Song[] = uniqueSongs([
  ...GLOBAL_SONGS,
  ...Object.values(LOCAL_SONGS_BY_LANGUAGE).flatMap((songs) => songs ?? []),
]);

export const SONG_COUNTS_BY_LANGUAGE = Object.fromEntries(
  Object.entries(CURATED_SONGS_BY_LANGUAGE).map(([language, songs]) => [language, songs.length]),
) as Record<AppLanguage, number>;

/** Prehľad zásoby — používajú testy aj report po rozšírení katalógu. */
export function songCatalogueStats() {
  const byLanguage = Object.fromEntries(
    Object.entries(LOCAL_SONGS_BY_LANGUAGE).map(([language, songs]) => [language, (songs ?? []).length]),
  ) as Partial<Record<SongLanguage, number>>;
  const byTier = { easy: 0, medium: 0, hard: 0 } as Record<SongTier, number>;
  let hummable = 0;
  let withYear = 0;
  let withGenre = 0;
  for (const song of ALL_SONGS) {
    byTier[song.tier] += 1;
    if (song.hummable) hummable += 1;
    if (song.year !== undefined) withYear += 1;
    if (song.genre !== undefined) withGenre += 1;
  }
  return {
    total: ALL_SONGS.length,
    global: GLOBAL_SONGS.length,
    local: ALL_SONGS.length - GLOBAL_SONGS.length,
    byLanguage,
    byTier,
    hummable,
    withYear,
    withGenre,
    perGameLanguage: SONG_COUNTS_BY_LANGUAGE,
  };
}
