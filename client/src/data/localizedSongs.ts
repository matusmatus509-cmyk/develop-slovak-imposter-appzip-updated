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
Me Gustas Tú|Julieta Venegas
Limón y Sal|Julieta Venegas
Andar Conmigo|Julieta Venegas
Suavemente|Elvis Crespo
Oye Como Va|Celia Cruz
La Vida Es Un Carnaval|Celia Cruz
La Negra Tiene Tumbao|Celia Cruz
El Cantante|Héctor Lavoe
Llorarás|Oscar D'León
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
Maria|Xutos & Pontapés
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
`, { language: "pt", scope: "local" }),
};

/**
 * Rozšírenie svetového poolu. Pôvodný blok zostáva nedotknutý — nové skladby
 * majú navyše rok, žáner a náročnosť, takže výber s nimi vie pracovať.
 * Neanglicky spievané svetové hity nesú príznak `lang=`.
 */
const WORLD_HITS_EXTENDED = parseSongs(`
Twist and Shout|The Beatles|1963|oldies|easy
Here Comes the Sun|The Beatles|1969|oldies|easy
Help!|The Beatles|1965|oldies|easy
Good Vibrations|The Beach Boys|1966|oldies|easy
Wouldn't It Be Nice|The Beach Boys|1966|oldies|medium
My Girl|The Temptations|1964|oldies|easy
Unchained Melody|The Righteous Brothers|1965|oldies|easy
California Dreamin'|The Mamas & the Papas|1965|oldies|easy
House of the Rising Sun|The Animals|1964|rock|easy
Space Oddity|David Bowie|1969|rock|medium
Let's Dance|David Bowie|1983|pop|easy
Heroes|David Bowie|1977|rock|medium
Whole Lotta Love|Led Zeppelin|1969|rock|easy
Another Brick in the Wall|Pink Floyd|1979|rock|easy
Wish You Were Here|Pink Floyd|1975|rock|medium
Comfortably Numb|Pink Floyd|1979|rock|medium
Money|Pink Floyd|1973|rock|medium
Layla|Derek and the Dominos|1970|rock|medium
Free Bird|Lynyrd Skynyrd|1973|rock|medium
More Than a Feeling|Boston|1976|rock|medium
Carry On Wayward Son|Kansas|1976|rock|medium
Bennie and the Jets|Elton John|1973|pop|medium
Night Fever|Bee Gees|1977|disco|medium
Le Freak|Chic|1978|disco|medium
Good Times|Chic|1979|disco|medium
September|Earth, Wind & Fire|1978|funk|easy
Let's Groove|Earth, Wind & Fire|1981|funk|medium
Boogie Wonderland|Earth, Wind & Fire|1979|disco|medium
Hot Stuff|Donna Summer|1979|disco|medium
I Feel Love|Donna Summer|1977|disco|medium
Sultans of Swing|Dire Straits|1978|rock|medium
Money for Nothing|Dire Straits|1985|rock|medium
Wanted Dead or Alive|Bon Jovi|1986|rock|medium
Paranoid|Black Sabbath|1970|metal|medium
Crazy Train|Ozzy Osbourne|1980|metal|medium
Smoke on the Water|Deep Purple|1972|rock|easy
The Trooper|Iron Maiden|1983|metal|medium
Vogue|Madonna|1990|pop|medium
Total Eclipse of the Heart|Bonnie Tyler|1983|pop|easy
Livin' in America|James Brown|1985|funk|medium
I Got You (I Feel Good)|James Brown|1965|funk|easy
Simply the Best|Tina Turner|1989|pop|easy
Tainted Love|Soft Cell|1981|pop|medium
Boys Don't Cry|The Cure|1979|indie|medium
Just Like Heaven|The Cure|1987|indie|medium
Love Will Tear Us Apart|Joy Division|1980|indie|hard
Blue Monday|New Order|1983|dance|medium
Enjoy the Silence|Depeche Mode|1990|pop|medium
Personal Jesus|Depeche Mode|1989|pop|medium
Bizarre Love Triangle|New Order|1986|indie|hard
Don't You (Forget About Me)|Simple Minds|1985|pop|easy
Voyage Voyage|Desireless|1986|pop|medium|lang=fr
Self Control|Laura Branigan|1984|pop|medium
Maniac|Michael Sembello|1983|pop|medium
Flashdance... What a Feeling|Irene Cara|1983|soundtrack|medium
Danger Zone|Kenny Loggins|1986|soundtrack|medium
The Power of Love|Huey Lewis and the News|1985|rock|medium
Walking on Sunshine|Katrina and the Waves|1983|pop|easy
Come On Eileen|Dexys Midnight Runners|1982|pop|easy
I Ran (So Far Away)|A Flock of Seagulls|1982|pop|medium
Tarzan Boy|Baltimora|1985|pop|medium
Black Hole Sun|Soundgarden|1994|rock|medium
Alive|Pearl Jam|1991|rock|medium
Bitter Sweet Symphony|The Verve|1997|rock|medium
Song 2|Blur|1997|rock|medium
When I Come Around|Green Day|1994|punk|medium
Give It Away|Red Hot Chili Peppers|1991|rock|medium
No Rain|Blind Melon|1992|rock|medium
Torn|Natalie Imbruglia|1997|pop|medium
Nothing Compares 2 U|Sinéad O'Connor|1990|pop|medium
Believe|Cher|1998|dance|easy
Mr. Vain|Culture Beat|1993|dance|medium
Rhythm Is a Dancer|Snap!|1992|dance|medium
The Sign|Ace of Base|1993|pop|easy
All That She Wants|Ace of Base|1992|pop|easy
Saturday Night|Whigfield|1994|dance|medium
No Woman No Cry|Bob Marley & The Wailers|1974|reggae|easy
Three Little Birds|Bob Marley & The Wailers|1977|reggae|easy
Could You Be Loved|Bob Marley & The Wailers|1980|reggae|medium
Waiting in Vain|Bob Marley & The Wailers|1977|reggae|hard
Killing Me Softly with His Song|Fugees|1996|rnb|medium
No Diggity|Blackstreet|1996|rnb|medium
Bailamos|Enrique Iglesias|1999|latin|medium
Smooth|Santana|1999|latin|medium
Maria Maria|Santana|1999|latin|medium
Kiss from a Rose|Seal|1994|pop|medium
Chop Suey!|System of a Down|2001|metal|medium
Toxicity|System of a Down|2001|metal|medium
Last Resort|Papa Roach|2000|metal|medium
Bodies|Drowning Pool|2001|metal|hard
I'm Not Okay (I Promise)|My Chemical Romance|2004|punk|medium
Clocks|Coldplay|2002|rock|easy
Since You've Been Gone|Rainbow|1979|rock|hard
SexyBack|Justin Timberlake|2006|pop|medium
Cry Me a River|Justin Timberlake|2002|pop|medium
Beautiful Girls|Sean Kingston|2007|pop|medium
Apologize|OneRepublic|2006|pop|easy
Sexy and I Know It|LMFAO|2011|dance|medium
Animals|Martin Garrix|2013|dance|medium
Lean On|Major Lazer|2015|dance|easy
Don't You Worry Child|Swedish House Mafia|2012|dance|medium
Faded|Alan Walker|2015|dance|easy
Rather Be|Clean Bandit|2014|dance|medium
Rockabye|Clean Bandit|2016|dance|medium
Get Lucky|Daft Punk|2013|dance|easy
One More Time|Daft Punk|2000|dance|easy
Around the World|Daft Punk|1997|dance|medium
All of Me|John Legend|2013|rnb|easy
Stay with Me|Sam Smith|2014|pop|easy
Take Me to Church|Hozier|2013|indie|easy
Ho Hey|The Lumineers|2012|indie|medium
Little Talks|Of Monsters and Men|2011|indie|medium
Riptide|Vance Joy|2013|indie|medium
Budapest|George Ezra|2013|indie|medium
Ocean Eyes|Billie Eilish|2016|pop|medium
Lovely|Billie Eilish|2018|pop|medium
Heat Waves|Glass Animals|2020|indie|easy
Believer of Nothing|Nothing But Thieves|2017|rock|hard
Unstoppable|Sia|2016|pop|medium
Cruel|Sabrina Carpenter|2024|pop|hard
Paint the Town Red|Doja Cat|2023|rap|medium|hum
Say So|Doja Cat|2019|pop|easy
Golden Hour|JVKE|2022|pop|medium
Lose Control|Teddy Swims|2023|rnb|easy
Sunroof|Nicky Youre|2021|pop|medium
泡沫|G.E.M.|2012|pop|hard|lang=other
Zitti e buoni|Måneskin|2021|rock|medium|lang=it
Beggin'|Måneskin|2017|rock|easy
Unholy|Sam Smith|2022|pop|easy
Kill Bill|SZA|2022|rnb|easy
Calm Down|Rema|2022|pop|easy
Greedy|Tate McRae|2023|pop|easy
Rain On Me|Lady Gaga|2020|dance|medium
Pompeii|Bastille|2013|indie|easy
Sweet Dreams|Eurythmics|1983|pop|easy
Better Off Alone|Alice Deejay|1999|dance|medium
Sandstorm|Darude|1999|dance|easy
Sicko Mode|Travis Scott|2018|rap|medium
God's Plan|Drake|2018|rap|easy|hum
One Dance|Drake|2016|rap|easy|hum
Hotline Bling|Drake|2015|rap|easy|hum
Old Town Road|Lil Nas X|2019|rap|easy|hum
Industry Baby|Lil Nas X|2021|rap|medium
Rockstar|Post Malone|2017|rap|easy|hum
Circles|Post Malone|2019|pop|easy
Sunflower|Post Malone|2018|pop|easy
Shut Up and Dance|Walk the Moon|2014|pop|easy
Shotgun|George Ezra|2018|pop|medium
7 Years|Lukas Graham|2015|pop|easy
How You Remind Me|Nickelback|2001|rock|easy
Take Me Home, Country Roads|John Denver
MMMBop|Hanson
Everything I Do|Bryan Adams
More Than Words|Extreme
Wonderful Tonight|Eric Clapton
Tears in Heaven|Eric Clapton
Barracuda|Heart
I Love Rock 'n' Roll|Joan Jett
When Doves Cry|Prince
I Just Called to Say I Love You|Stevie Wonder
I Say a Little Prayer|Aretha Franklin
What's Going On|Marvin Gaye
Ain't No Other Man|Christina Aguilera
Dirrty|Christina Aguilera
No More Drama|Mary J. Blige
Family Affair|Mary J. Blige
Bills, Bills, Bills|Destiny's Child
Independent Women|Destiny's Child
Bootylicious|Destiny's Child
Killing Me Softly|Fugees
Ready or Not|Fugees
Doo Wop (That Thing)|Lauryn Hill
Gangsta's Paradise|Coolio
Changes|2Pac
Dear Mama|2Pac
Big Poppa|The Notorious B.I.G.
It Was a Good Day|Ice Cube
Nuthin' but a G Thang|Dr. Dre
Still D.R.E.|Dr. Dre
The Next Episode|Dr. Dre
Gin and Juice|Snoop Dogg
Jump Around|House of Pain
Insane in the Brain|Cypress Hill
Hypnotize|The Notorious B.I.G.
Family Portrait|P!nk
Just Give Me a Reason|P!nk
What About Us|P!nk
When You're Gone|Avril Lavigne
Big Girls Don't Cry|Fergie
London Bridge|Fergie
Fireflies|Owl City
Good Time|Owl City
Call Me Maybe|Carly Rae Jepsen
I Really Like You|Carly Rae Jepsen
Save the World|Swedish House Mafia
Silhouettes|Avicii
Clarity|Zedd
Stay the Night|Zedd
The Middle|Zedd
Turn Down for What|DJ Snake
Let Me Love You|DJ Snake
Where Are Ü Now|Skrillex
Bangarang|Skrillex
Scary Monsters and Nice Sprites|Skrillex
Outside|Calvin Harris
One Kiss|Calvin Harris
Sweet Nothing|Calvin Harris
Holding Out for a Hero|Bonnie Tyler
Eternal Flame|The Bangles
Walk Like an Egyptian|The Bangles
Boom, Boom, Boom, Boom!!|Vengaboys
We Like to Party|Vengaboys
Mambo No. 5|Lou Bega
Tubthumping|Chumbawamba
Flying Without Wings|Westlife
Swear It Again|Westlife
No Matter What|Boyzone
When You Say Nothing at All|Ronan Keating
Don't Go Breaking My Heart|Elton John
You're the One That I Want|John Travolta
Summer Nights|John Travolta
Can't Take My Eyes Off You|Frankie Valli
Fame|Irene Cara
It's Raining Men|The Weather Girls
YMCA|Village People
In the Navy|Village People
Get Down On It|Kool & The Gang
Celebration|Kool & The Gang
Ma Baker|Boney M.
Rivers of Babylon|Boney M.
Brother Louie|Modern Talking
Gloria|Laura Branigan
Live Is Life|Opus
Words|F.R. David
Living on My Own|Freddie Mercury
Fat Bottomed Girls|Queen
Freedom! '90|George Michael
Father Figure|George Michael
Don't Cry|Guns N' Roses
Patience|Guns N' Roses
Shout|Tears for Fears
Just Can't Get Enough|Depeche Mode
Friday I'm in Love|The Cure
This Charming Man|The Smiths
There Is a Light That Never Goes Out|The Smiths
Where Is My Mind?|Pixies
Man on the Moon|R.E.M.
Shiny Happy People|R.E.M.
Stop Crying Your Heart Out|Oasis
Penny Lane|The Beatles
Lucy in the Sky with Diamonds|The Beatles
While My Guitar Gently Weeps|The Beatles
Blackbird|The Beatles
Michelle|The Beatles
Satisfaction|The Rolling Stones
Wild Horses|The Rolling Stones
Woman|John Lennon
Sound of Silence|Simon & Garfunkel
Bridge over Troubled Water|Simon & Garfunkel
Mrs. Robinson|Simon & Garfunkel
The Boxer|Simon & Garfunkel
Country Roads|John Denver
Suzanne|Leonard Cohen
Knockin' on Heaven's Door|Bob Dylan
Heart of Gold|Neil Young
Rockin' in the Free World|Neil Young
Brothers in Arms|Dire Straits
Walk of Life|Dire Straits
Time|Pink Floyd
The Unforgiven|Metallica
One|Metallica
Fade to Black|Metallica
Iron Man|Black Sabbath
War Pigs|Black Sabbath
Mama, I'm Coming Home|Ozzy Osbourne
Still Loving You|Scorpions
Send Me an Angel|Scorpions
Carrie|Europe
Cherokee|Europe
Is This Love|Whitesnake
Here I Go Again|Whitesnake
Don't Stop Believing|Journey
Separate Ways|Journey
Faithfully|Journey
Rosanna|Toto
Sailing|Christopher Cross
Arthur's Theme|Christopher Cross
Willow|Taylor Swift
Take a Bow|Rihanna
The Edge of Glory|Lady Gaga
Million Reasons|Lady Gaga
Part of Me|Katy Perry
Unconditionally|Katy Perry
Formation|Beyoncé
Send My Love|Adele
Count on Me|Bruno Mars
Lego House|Ed Sheeran
Sing|Ed Sheeran
Happier|Ed Sheeran
Never Say Never|Justin Bieber
Boyfriend|Justin Bieber
Beauty and a Beat|Justin Bieber
Ghost|Justin Bieber
Earned It|The Weeknd
I Feel It Coming|The Weeknd
Die For You|The Weeknd
IDGAF|Dua Lipa
Side to Side|Ariana Grande
Into You|Ariana Grande
One Last Time|Ariana Grande
God is a Woman|Ariana Grande
When the Party's Over|Billie Eilish
Everything I Wanted|Billie Eilish
Therefore I Am|Billie Eilish
The Climb|Miley Cyrus
Malibu|Miley Cyrus
Midnight Sky|Miley Cyrus
Lucky|Britney Spears
Mirrors|Justin Timberlake
Rock Your Body|Justin Timberlake
Suit & Tie|Justin Timberlake
Get the Party Started|P!nk
Who Knew|P!nk
Underneath Your Clothes|Shakira
Jenny from the Block|Jennifer Lopez
Waiting for Tonight|Jennifer Lopez
If You Had My Love|Jennifer Lopez
Ain't It Funny|Jennifer Lopez
Payphone|Maroon 5
One More Night|Maroon 5
Hymn for the Weekend|Coldplay
Bad Liar|Imagine Dragons
On Top of the World|Imagine Dragons
Good Life|OneRepublic
If I Lose Myself|OneRepublic
Addicted to You|Avicii
When Love Takes Over|David Guetta
Turn Me On|David Guetta
Dangerous|David Guetta
I Know You Want Me|Pitbull
Rain Over Me|Pitbull
Fireball|Pitbull
Not Afraid|Eminem
Love the Way You Lie|Eminem
Mockingbird|Eminem
Cleanin' Out My Closet|Eminem
Crawling|Linkin Park
One Step Closer|Linkin Park
New Divide|Linkin Park
Holiday|Green Day
21 Guns|Green Day
Good Riddance (Time of Your Life)|Green Day
Longview|Green Day
Scar Tissue|Red Hot Chili Peppers
Some Might Say|Oasis
Voulez-Vous|ABBA
The Name of the Game|ABBA
Show Me the Meaning of Being Lonely|Backstreet Boys
Quit Playing Games (with My Heart)|Backstreet Boys
Larger Than Life|Backstreet Boys
Dangerous Woman|Ariana Grande
DJ Got Us Fallin' in Love|Usher
U Got It Bad|Usher
Confessions Part II|Usher
Forever|Chris Brown
With You|Chris Brown
Yeah 3x|Chris Brown
So Sick|Ne-Yo
Miss Independent|Ne-Yo
Lonely|Akon
Smack That|Akon
Don't Matter|Akon
Right Now (Na Na Na)|Akon
Good Feeling|Flo Rida
Tik Tok|Kesha
Die Young|Kesha
We R Who We R|Kesha
Blow|Kesha
Elastic Heart|Sia
Ordinary People|John Legend
I'm Not the Only One|Sam Smith
Too Good at Goodbyes|Sam Smith
Before You Go|Lewis Capaldi
Adore You|Harry Styles
Late Night Talking|Harry Styles
Never Be the Same|Camila Cabello
Come & Get It|Selena Gomez
Sorry Not Sorry|Demi Lovato
Heart Attack|Demi Lovato
Skyscraper|Demi Lovato
Stronger (What Doesn't Kill You)|Kelly Clarkson
Far Away|Nickelback
Someday|Nickelback
Going Under|Evanescence
Madness|Muse
When You Were Young|The Killers
Feel It Still|Portugal. The Man
Instant Crush|Daft Punk
Harder, Better, Faster, Stronger|Daft Punk
Scared to Be Lonely|Martin Garrix
In the Name of Love|Martin Garrix
Firestone|Kygo
It Ain't Me|Kygo
Stole the Show|Kygo
Silence|Marshmello
Symphony|Clean Bandit
Solo|Clean Bandit
Perfect Strangers|Jonas Blue
Mama|Jonas Blue
Prayer in C|Robin Schulz
OK|Robin Schulz
Ain't Nobody|Felix Jaehn
West End Girls|Pet Shop Boys
It's a Sin|Pet Shop Boys
Go West|Pet Shop Boys
Rio|Duran Duran
Hungry Like the Wolf|Duran Duran
Ordinary World|Duran Duran
Heart of Glass|Blondie
Call Me|Blondie
One Way or Another|Blondie
Light My Fire|The Doors
Riders on the Storm|The Doors
Have You Ever Seen the Rain|Creedence Clearwater Revival
Proud Mary|Creedence Clearwater Revival
Bad Moon Rising|Creedence Clearwater Revival
Fortunate Son|Creedence Clearwater Revival
Baba O'Riley|The Who
My Generation|The Who
Jump|Van Halen
Panama|Van Halen
I Was Made for Lovin' You|Kiss
Rock and Roll All Nite|Kiss
Pour Some Sugar on Me|Def Leppard
Animal|Def Leppard
Breakfast in America|Supertramp
The Logical Song|Supertramp
Dreamer|Supertramp
Don't Dream It's Over|Crowded House
Weather with You|Crowded House
Holding Back the Years|Simply Red
Stars|Simply Red
Breathless|The Corrs
Runaway|The Corrs
I Don't Want a Lover|Texas
Say What You Want|Texas
Stupid Girl|Garbage
Only Happy When It Rains|Garbage
Every You Every Me|Placebo
The Bitter End|Placebo
Forever Young|Alphaville
Big in Japan|Alphaville
A Little Respect|Erasure
True|Spandau Ballet
Gold|Spandau Ballet
Don't You Want Me|The Human League
Invisible Touch|Genesis
I Can't Dance|Genesis
Should I Stay or Should I Go|The Clash
London Calling|The Clash
Blitzkrieg Bop|Ramones
I Wanna Be Sedated|Ramones
Once in a Lifetime|Talking Heads
Psycho Killer|Talking Heads
Common People|Pulp
Disco 2000|Pulp
Girls & Boys|Blur
Parklife|Blur
Coffee & TV|Blur
Why Does It Always Rain on Me?|Travis
Breakeven|The Script
Hall of Fame|The Script
The Man Who Can't Be Moved|The Script
Ruby|Kaiser Chiefs
I Predict a Riot|Kaiser Chiefs
What You Know|Two Door Cinema Club
Club Foot|Kasabian
Munich|Editors
Papillon|Editors
Love Is All Around|Wet Wet Wet
Hard to Say I'm Sorry|Chicago
I Want to Know What Love Is|Foreigner
Can't Fight This Feeling|REO Speedwagon
(I Just) Died in Your Arms|Cutting Crew
Broken Wings|Mr. Mister
The Sun Always Shines on T.V.|a-ha
Hunting High and Low|a-ha
If You Leave|Orchestral Manoeuvres in the Dark
Enola Gay|Orchestral Manoeuvres in the Dark
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
Mesto snov|Katarína Knechtová|2007|pop|medium
Načo pôjdem domov|Katarína Knechtová|2008|pop|medium
Horšie ako inokedy|Katarína Knechtová|2010|pop|hard
Dážď|Peter Cmorik|2007|pop|medium
Jedno si želám|Peter Cmorik|2008|pop|medium
Chvíľu áno|Para|2005|rock|medium
Abstinent|Para|2007|rock|medium
Otec|Para|2009|rock|hard
Láska, necestuj tým vlakom|Pavol Hammel|1972|pop|medium
Učiteľka tanca|Pavol Hammel|1974|pop|medium
Mám ťa málo|Mária Čírová|2009|pop|medium
Unikát|Mária Čírová|2011|pop|medium
Nestrácaj nádej|Mária Čírová|2013|pop|hard
Tobogan|Miro Jaroš|2013|pop|hard
Len sa smej|Billy Barman|2013|indie|hard
Traja|Billy Barman|2015|indie|hard
Láska je tu s nami|Peter Nagy|1987|pop|easy
Poďme sa zachrániť|Peter Nagy|1989|pop|medium
Len pomaly|Peter Nagy|1988|pop|medium
Tam kde sa neumiera|Zuzana Smatanová|2004|pop|medium
V dobrom aj v zlom|Zuzana Smatanová|2006|pop|medium
Horou|Zuzana Smatanová|2008|pop|hard
Chlapci spod Tatier|Kollárovci|2010|folk|medium
Daj mi lásku|Kollárovci|2012|folk|medium
Čo o mne vieš|Dara Rolins|1997|pop|medium
Party DJ|Dara Rolins|2011|pop|medium
Keď je 7 ráno|Vidiek|1997|rock|medium
Fajčenie škodí zdraviu|Vidiek|1999|rock|medium
Všetko sa dá|Gladiator|2001|pop|medium
Bonboniéra|Gladiator|2003|pop|medium
Hlavu maj hore|Sima|2019|rap|medium|hum
Máme svoj deň|Peter Bič Project|2011|pop|medium
Skúšame sa nájsť|Peter Bič Project|2013|pop|hard
Niečo nové|Korben Dallas|2013|indie|hard
Kým sa rozídeme|Korben Dallas|2015|indie|hard
Zostaň|Adam Ďurica|2014|pop|medium
Voňavý deň|Adam Ďurica|2016|pop|medium
Neverím|Adam Ďurica|2018|pop|medium
Slnko|Kristína|2011|pop|medium
Na hranici|Kristína|2012|pop|hard
Zamilovaná|Jana Kirschner|1999|pop|medium
Nespavosť|Miroslav Žbirka|1986|pop|hard
Zlomená|No Name|2003|pop|medium
Kráľ|Desmod|2007|rock|medium
Tisíc dní|Desmod|2009|rock|medium
Nekonečná|IMT Smile|2010|pop|medium
Trilogia|IMT Smile|2012|pop|hard
Voda|Polemic|1998|reggae|medium
Kráľovná|Polemic|2001|reggae|hard
Slobodná|Slobodná Európa|1990|punk|medium
Ružinov|Slobodná Európa|1991|punk|hard
Ahoj|Horkýže Slíže|2001|punk|medium
Nakopnutá|Iné Kafe|2002|punk|medium
Bezvetrie|Iné Kafe|2004|punk|hard
Zbohom|Team|1989|pop|medium
Vyznanie duše|Marika Gombitová|1984|pop|hard
Zvonky štastia|Karel Gott & Darina Rolincová|1984|pop|easy
Cigánsky bál|Elán|1985|rock|medium
Amnestia na neveru|Elán|1991|rock|medium
Nebúchaj|Rytmus|2008|rap|medium|hum
Bengoro|Rytmus|2010|rap|medium|hum
Pekelná|Kontrafakt|2006|rap|hard|hum
Toto je môj štýl|Majk Spirit|2011|rap|medium|hum
Nový človek|Majk Spirit|2012|rap|medium|hum
Anjel|Peha|2004|pop|medium
Spomaly|Peha|2002|pop|medium
Muoj bože|Peha|2006|pop|hard
Na jednej lodi|Kali|2012|rap|medium|hum
Srdce ako z kameňa|Kali|2013|rap|medium|hum
Čakám|Kali|2015|rap|hard|hum
Ideme ďalej|Kali|2016|rap|hard|hum
Láska moja|Elán|1984|rock|medium
Ako málo|Desmod|2005|rock|medium
Keď jazdíme my|Ego|2011|rap|medium|hum
Čo bolo, bolo|No Name|2001|pop|medium
Len tak stáť|Hex|1996|pop|medium
Exotica|IMT Smile|2008|pop|medium
Sľúbili sme si lásku|Ivan Hoffman|1989|folk|hard
Medulienka|Pavol Hammel|1970|pop|medium
Domovina|Adam Ďurica|2019|pop|medium
Strážca pokladov|Jana Kirschner|2001|pop|medium
Smej sa|Mária Čírová|2012|pop|medium
S tebou ma baví svet|Peter Cmorik|2010|pop|medium
Sokoly|Kollárovci|2014|folk|medium
Naša|Para|2011|rock|hard
Ó, maňo|Vidiek|1998|rock|medium
Keď sa láska podarí|Gladiator|1997|pop|medium
Femina|Sima|2021|rap|hard|hum
Motýľ hlavolam|Katarína Knechtová|2011|pop|hard
Vo svetle žiariacich hviezd|Katarína Knechtová|2013|pop|hard
Mladým chýba vojna|Billy Barman|2014|indie|hard
Hannah|Billy Barman|2016|indie|hard
Pocit|Bystrík|2006|pop|medium
Hej, dievča|Bystrík|2008|pop|medium
Všetko bude fajn|Misha|2010|pop|medium
Náladu mi dvíhaš|Misha|2012|pop|hard
Kým vieš snívať|Katarína Koščová|2005|pop|medium
Môj Bože|Katarína Koščová|2007|pop|hard
Lietajúci Cyprián|Komajota|1996|rock|hard
Ráno v novinách|Komajota|1998|rock|hard
Ako to prežijem|Polemic|2003|reggae|medium
Mesto|Polemic|2005|reggae|hard
Čumil|Iné Kafe|2003|punk|medium
Kašovité jedlá|Iné Kafe|2005|punk|hard
S tebou alebo bez teba|Tomáš Bezdeda|2007|pop|medium
Len ty|Tomáš Bezdeda|2009|pop|hard
Run Run Run|Celeste Buckingham|2012|pop|medium
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
Kometa|Jaromír Nohavica|1994|folk|medium
Sarajevo|Jaromír Nohavica|1988|folk|medium
Tři čuníci|Jaromír Nohavica|1986|folk|medium
Mikymauz|Jaromír Nohavica|1996|folk|hard
Až mě andělé|Jaromír Nohavica|2000|folk|hard
Okno mé lásky|Olympic|1969|rock|medium
Holky z naší školky|Michal David|1984|pop|easy
Chtěl jsem mít|Michal David|1986|pop|hard
Dáša Nováková|Ivan Mládek|1979|folk|hard
Jsi můj pán|Lucie Bílá|1993|pop|medium
Trouba|Lucie Bílá|1995|pop|hard
Chtěl jsem být|Lucie|1994|rock|medium
Dobrák od kosti|Chinaski|2002|rock|medium
Vedle sebe|Chinaski|2004|rock|medium
Znamení|Divokej Bill|2004|folk|medium
Cirkus|Divokej Bill|2003|folk|medium
Krásný ztráty|Buty|1995|rock|medium
Pretty Girl|Buty|1997|rock|hard
Ta pravá|Mirai|2016|indie|medium
Inzerát|Kryštof|2007|pop|hard
Františkovy Lázně|Mandrage|2010|pop|hard
Kluci z fabriky|Rybičky 48|2012|punk|medium
Malá noční můra|Rybičky 48|2014|punk|hard
Na ptáky jsme krátký|Janek Ledecký|1993|pop|hard
Až na věky|Ewa Farna|2007|pop|medium
Nebe|Barbora Poláková|2015|indie|hard
Kdyby|Hana Hegerová|1968|chanson|medium
Levandulová|Hana Hegerová|1970|chanson|medium
Miláčku|Jiří Korn|1980|pop|medium
Jsem prý blázen jen|Jiří Schelinger|1976|rock|medium
Báječná ženská|Michal Tučný|1985|country|medium
Pověste ho vejš|Michal Tučný|1983|country|medium
Snídaně v trávě|Michal Tučný|1987|country|hard
Mám jizvu na rtu|Jaromír Nohavica|1988|folk|hard
Hlídač krav|Jaromír Nohavica|1990|folk|medium
Zatímco se koupeš|Jaromír Nohavica|1994|folk|hard
Slzy tvý mámy|Olympic|1970|rock|medium
Děti ráje|Michal David|1984|pop|easy
Colu, pijeme colu|Michal David|1985|pop|medium
Pánu bohu do oken|Tomáš Klus|2010|pop|medium
Marie|Tomáš Klus|2012|pop|medium
Růže z papíru|Nedvědi|1988|folk|medium
Stánky|Nedvědi|1985|folk|medium
Proměny|Čechomor|2001|folk|medium
Mezi horami|Čechomor|2000|folk|medium
Srdce jako kníže Rohan|Richard Müller|1994|pop|medium
Jahody mražený|Jiří Schelinger|1977|rock|medium
Malovaný džbánku|Helena Vondráčková|1975|pop|medium
Most přes minulost|Lucie Bílá|1996|pop|medium
Na dlani|Mandrage|2012|pop|hard
Žízeň|Kabát|2001|rock|medium
Jednou budem dál|Karel Gott
Přejdi Jordán|Helena Vondráčková
Kdyby se vrátil čas|Lucie Bílá
Miss Moskva|Jiří Korn
Bum bum bum|Petr Kotvald
Nespoutaný kůň|Petr Kotvald
Punčochy|Chinaski
1970|Chinaski
Panická|Chinaski
Až mě odvedou|Divokej Bill
Modré nebe|Olympic
Dej mi ještě jeden den|Olympic
Lásko voníš deštěm|Petra Janů
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
Ticho|Ewa Farna
Voní|Aneta Langerová
Hlídej si mě|Aneta Langerová
Když nemůžeš|Ben Cristovao
Celá|Slza
Lhůta|Slza
Magdaléna|Jelen
Klidná jako voda|Jelen
Až|Katapult
Čmelák|Divokej Bill
Vedle mě|Chinaski
Klídek|Chinaski
Osmý den|Olympic
Krtek|Buty
Nikdy nebudeme dospělí|Rybičky 48
`, { language: "cs", scope: "local", region: "CZ" }),

  de: parseSongs(`
Hey|Andreas Bourani|2011|pop|medium
Schüttel deinen Speck|Peter Fox|2008|rap|medium|hum
Nur ein Wort|Wir sind Helden|2005|indie|medium
Denkmal|Wir sind Helden|2003|indie|medium
Von hier an blind|Wir sind Helden|2005|indie|hard
Bonnie und Clyde|Die Toten Hosen|1996|punk|hard
Ohne dich|Rammstein|2004|metal|hard
Wind of Change auf Deutsch|Peter Maffay|1980|rock|hard
So bist du|Peter Maffay|1979|rock|hard
Merci Chérie|Udo Jürgens|1966|schlager|hard
Verlieben, verloren|Wolfgang Petry|1997|schlager|hard
Da Da Da|Trio|1982|pop|medium
Aha|Nena|1984|pop|hard
Wunder|Nina Chuba|2022|pop|medium
200 km/h|Apache 207|2020|rap|medium|hum
Bad Habits auf Deutsch|Mark Forster|2018|pop|hard
Krieger des Lichts|Silbermond|2009|pop|hard
Nur wir zwei|Glasperlenspiel|2011|pop|hard
Nordisch by Nature|Fettes Brot|1995|rap|hard|hum
Bring die Nacht|BONEZ MC|2018|rap|hard|hum
Ich und meine Maske|Alligatoah|2013|rap|hard|hum
Hulapalu|Andreas Gabalier|2015|schlager|medium|region=AT
I sing a Liad für di|Andreas Gabalier|2011|schlager|medium|region=AT
Amoi seg' ma uns wieder|Andreas Gabalier|2011|schlager|hard|region=AT
Fürstenfeld|STS|1984|rock|hard|region=AT
Großvater|STS|1984|rock|hard|region=AT
Bungalow|Bilderbuch|2015|indie|hard|region=AT
Maschin|Bilderbuch|2014|indie|hard|region=AT
Nur zu Besuch|Die Toten Hosen
Alles aus Liebe|Die Toten Hosen
Zehn kleine Jägermeister|Die Toten Hosen
Ein Schwein namens Männer|Die Ärzte
Manchmal haben Frauen|Die Ärzte
Leuchtturm|Nena
Vienna Calling|Falco||||region=AT
Männer|Herbert Grönemeyer
Bochum|Herbert Grönemeyer
Halt mich|Herbert Grönemeyer
Mensch|Herbert Grönemeyer
Flugzeuge im Bauch|Herbert Grönemeyer
Hinterm Horizont geht's weiter|Udo Lindenberg
Verdammt lang her|BAP
Frag nicht nach Sonnenschein|Peter Maffay
Über sieben Brücken musst du gehen|Peter Maffay
Ja|Silbermond
Perfekte Welle|Juli
Elektrisches Gefühl|Juli
Dieses Leben|Juli
Geile Zeit|Juli
Ding|Seeed
Aufstehn!|Seeed
Augenbling|Seeed
Bad Chick|Cro
Wie ich bin|Mark Forster
Ozean|AnnenMayKantereit
Feuerwerk|Wincent Weiss
Musik sein|Wincent Weiss
An Wunder|Wincent Weiss
80 Millionen|Max Giesinger
Legenden|Max Giesinger
Nicht so schnell|Max Giesinger
Bad Boys Cry|Apache 207
Bruder|Sido
Ich baller|Bushido
Sonnenbank Flavour|Bushido
Bologna|Wanda||||region=AT
Columbo|Wanda||||region=AT
Auseinandergehen ist schwer|Wanda||||region=AT
Ich lebe|Christina Stürmer||||region=AT
Engel fliegen einsam|Christina Stürmer||||region=AT
Millionen Lichter|Christina Stürmer||||region=AT
Macho Macho|Rainhard Fendrich||||region=AT
I Am from Austria|Rainhard Fendrich||||region=AT
Ein Stern|DJ Ötzi
Schifoan|Wolfgang Ambros
Es lebe der Zentralfriedhof|Wolfgang Ambros
Da Hofa|Wolfgang Ambros
Pack die Badehose ein|Cornelia Froboess
Am Tag als Conny Kramer starb|Juliane Werding
Ein bisschen Frieden|Nicole
Ich will nur dass du weißt|Sportfreunde Stiller
Kleine Taschenlampe brenn|Markus
Ich bin wie du|Marianne Rosenberg
Er gehört zu mir|Marianne Rosenberg
Moskau|Dschinghis Khan
Dschinghis Khan|Dschinghis Khan
Ich hab getanzt|Matthias Reim
Weißt du noch|Peter Maffay
Josie|Peter Maffay
Du|Peter Maffay
Alt wie ein Baum|Karat
Über sieben Brücken|Karat
Am Fenster|City
Sonne, Mond und Sterne|Ich + Ich
Vom selben Stern|Ich + Ich
Stark|Ich + Ich
So soll es bleiben|Ich + Ich
Guten Tag|Wir sind Helden
Dieser Weg|Xavier Naidoo
Ich kenne nichts|Xavier Naidoo
Sie sieht mich nicht|Xavier Naidoo
Was wir alleine nicht schaffen|Xavier Naidoo
Der letzte Tag|Tokio Hotel
Spring nicht|Tokio Hotel
Monsoon|Tokio Hotel
Wunder geschehen|Nena
Liebe ist|Nena
Ich hab dich lieb|Nena
Halt mich fest|Silbermond
Himmel auf|Silbermond
Unendlich|Silbermond
Mutter|Rammstein
Nie vergessen|Glasperlenspiel
Keinen Zentimeter|Clueso
Kein Liebeslied|Kraftklub
Ich will nicht nach Berlin|Kraftklub
Hurra, die Welt geht unter|Kraftklub
Hier kommt die Sonne|Beatsteaks
Leider geil|Deichkind
Bück dich hoch|Deichkind
MfG|Die Fantastischen Vier
Troy|Die Fantastischen Vier
Geboren um zu leben|Unheilig
Hilf mir fliegen|Unheilig
Hyper Hyper|Scooter
How Much Is the Fish?|Scooter
Nessaja|Scooter
Millionär|Die Prinzen
Alles nur geklaut|Die Prinzen
Küssen verboten|Die Prinzen
Abenteuerland|PUR
Lena|PUR
Und wenn ein Lied|Söhne Mannheims
Geh davon aus|Söhne Mannheims
Ich bin ich|Rosenstolz
Liebe ist alles|Rosenstolz
Hamma!|Culcha Candela
Monsta|Culcha Candela
Freiheit|Marius Müller-Westernhagen
Sexy|Marius Müller-Westernhagen
Jetzt ist Sommer|Wise Guys
Schönste Zeit|Bosse
Lieder|Adel Tawil
Ist da jemand|Adel Tawil
Wovon sollen wir träumen|Frida Gold
An guten Tagen|Johannes Oerding
Wie schön du bist|Sarah Connor
Vincent|Sarah Connor
Ham kummst|Seiler und Speer
Jenseits von Eden|Nino de Angelo
Santa Maria|Roland Kaiser
Hello again|Howard Carpendale
Hurra, hurra, die Schule brennt|Extrabreit
Blaue Augen|Ideal
Remmidemmi|Deichkind
Die Da!?|Die Fantastischen Vier||rap
Delmenhorst|Element of Crime
`, { language: "de", scope: "local", region: "DE" }),

  en: parseSongs(`
Sweet Caroline|Neil Diamond|1969|oldies|easy
Livin' Thing|Electric Light Orchestra|1976|rock|medium
Mr. Blue Sky|Electric Light Orchestra|1977|rock|medium
Ain't No Mountain High Enough|Marvin Gaye|1967|soul|easy
Let's Get It On|Marvin Gaye|1973|soul|medium
Lovely Day|Bill Withers|1977|soul|easy
Ain't No Sunshine|Bill Withers|1971|soul|easy
Wonderful World|Louis Armstrong|1967|jazz|easy
Feeling Good|Nina Simone|1965|jazz|medium
Valerie|Amy Winehouse|2007|rnb|easy
Rehab|Amy Winehouse|2006|rnb|medium
Back to Black|Amy Winehouse|2006|rnb|medium
Mad World|Gary Jules|2001|indie|medium
Skinny Love|Bon Iver|2007|indie|hard
The A Team|Ed Sheeran|2011|pop|medium
Chasing Pavements|Adele|2008|pop|medium
Video Games|Lana Del Rey|2011|indie|medium
Summertime Sadness|Lana Del Rey|2012|indie|medium
Royals|Lorde|2013|pop|easy
Team|Lorde|2013|pop|medium
Electric Feel|MGMT|2007|indie|medium
Kids|MGMT|2007|indie|medium
Pumped Up Kicks|Foster the People|2010|indie|medium
Sweater Weather|The Neighbourhood|2012|indie|easy
505|Arctic Monkeys|2007|indie|hard
Wonderful Life|Black
Sit Down|James
She's So Lovely|Scouting for Girls
Grace Kelly|Mika
Relax, Take It Easy|Mika
Nine Million Bicycles|Katie Melua
Closest Thing to Crazy|Katie Melua
Trouble|Coldplay
Speed of Sound|Coldplay
Don't Let Me Down|The Chainsmokers
Paris|The Chainsmokers
Every Teardrop Is a Waterfall|Coldplay
Chelsea Dagger|The Fratellis
Why'd You Only Call Me When You're High?|Arctic Monkeys
Naive|The Kooks
She Moves in Her Own Way|The Kooks
Time Is Running Out|Muse
Plug In Baby|Muse
Hysteria|Muse
Knights of Cydonia|Muse
Dakota|Stereophonics
Have a Nice Day|Stereophonics
You Give Me Something|James Morrison
Broken Strings|James Morrison
Say You Won't Let Go|James Arthur
Impossible|James Arthur
Castle on the Hill|Ed Sheeran
I Don't Care|Ed Sheeran
Giant|Rag'n'Bone Man
Cassy O'|George Ezra
Let Her Go|Passenger
Dirty Paws|Of Monsters and Men
Home|Edward Sharpe
I Will Wait|Mumford & Sons
Little Lion Man|Mumford & Sons
The Cave|Mumford & Sons
Stubborn Love|The Lumineers
Ophelia|The Lumineers
Cleopatra|The Lumineers
Rivers and Roads|The Head and the Heart
Sweet Disposition|The Temper Trap
Youngblood|5 Seconds of Summer
She Looks So Perfect|5 Seconds of Summer
Centuries|Fall Out Boy
Helena|My Chemical Romance
Pretty Fly (For a White Guy)|The Offspring
Feeling This|Blink-182
First Date|Blink-182
Whistle|Flo Rida
Club Can't Handle Me|Flo Rida
Break Your Heart|Taio Cruz
Hotel Room Service|Pitbull
Don't Phunk with My Heart|Black Eyed Peas
Applause|Lady Gaga
Wide Awake|Katy Perry
Where Have You Been|Rihanna
Work|Rihanna
Grown Woman|Beyoncé
Everytime|Britney Spears
Sometimes|Britney Spears
You Know I'm No Good|Amy Winehouse
Dancing in the Moonlight|Toploader
Somewhere Only We Know|Keane
Everybody's Changing|Keane
The Drugs Don't Work|The Verve
Fake Plastic Trees|Radiohead
High and Dry|Radiohead
Rockferry|Duffy
Mercy|Duffy
Warwick Avenue|Duffy
Put Your Records On|Corinne Bailey Rae
Bleeding Love|Leona Lewis
Run|Leona Lewis
You're Beautiful|James Blunt
Goodbye My Lover|James Blunt
1973|James Blunt
The Blower's Daughter|Damien Rice
Cannonball|Damien Rice
Set the Fire to the Third Bar|Snow Patrol
Sex Bomb|Tom Jones
It's Not Unusual|Tom Jones
Delilah|Tom Jones
Baby Can I Hold You|Tracy Chapman
Fast Car|Tracy Chapman
Talkin' Bout a Revolution|Tracy Chapman
Linger|The Cranberries
Ode to My Family|The Cranberries
Truly Madly Deeply|Savage Garden
I Knew I Loved You|Savage Garden
To the Moon and Back|Savage Garden
Never Tear Us Apart|INXS
Need You Tonight|INXS
Beds Are Burning|Midnight Oil
Down Under|Men at Work
Are You Gonna Be My Girl|Jet
Look What You've Done|Jet
`, { language: "en", scope: "local" }),

  es: parseSongs(`
Corazón Partido|Alejandro Sanz|1997|latin|medium
Rosas|La Oreja de Van Gogh|2003|pop|medium
Puedes Contar Conmigo|La Oreja de Van Gogh|2003|pop|hard
Clandestino|Manu Chao|1998|latin|medium
Me Gustas Tu|Manu Chao|2001|latin|easy
Cuando Me Enamoro|Enrique Iglesias
La Mordidita|Ricky Martin
Corazón Espinado|Maná
Vivir Sin Aire|Maná
Crimen|Gustavo Cerati
Y, ¿Si Fuera Ella?|Alejandro Sanz
No Es Lo Mismo|Alejandro Sanz
Bulería|David Bisbal
Ave María|David Bisbal
Dígale|David Bisbal
Solamente Tú|Pablo Alborán
Tanto|Pablo Alborán
Perdóname|Pablo Alborán
La Playa|La Oreja de Van Gogh
Muñeca de Trapo|La Oreja de Van Gogh
Cuídate|La Oreja de Van Gogh
Tuyo Siempre|Melendi
Caminando por la Vida|Melendi
Lágrimas Desordenadas|Melendi
Como Camarón|Estopa
La Raja de Tu Falda|Estopa
Malditos Callejones|Estopa
Ahora Quién|Marc Anthony
Dura|Daddy Yankee
Rompe|Daddy Yankee
Ella y Yo|Don Omar
Rakata|Wisin & Yandel
Abusadora|Wisin & Yandel
Algo Me Gusta de Ti|Wisin & Yandel
El Amante|Nicky Jam
X|Nicky Jam
Taki Taki|Ozuna
Se Preparó|Ozuna
Baila Baila Baila|Ozuna
Criminal|Ozuna
Ay, DiOs Mío!|Karol G
Yo Perreo Sola|Bad Bunny
Moscow Mule|Bad Bunny
Tattoo|Rauw Alejandro
Tú|Shakira
Ojos Así|Shakira
Antología|Shakira
Te Felicito|Shakira
Tacones Rojos|Sebastián Yatra
Tutu|Camilo
Vida de Rico|Camilo
Una Lady Como Tú|Manuel Turizo
Guantanamera|Compay Segundo
Chan Chan|Compay Segundo
La Gota Fría|Carlos Vives
Colgando en Tus Manos|Carlos Baute
Corazón Latino|David Bisbal
Esclavo de Sus Besos|David Bisbal
Todo Cambió|Camila
Mientes|Camila
Abrázame Muy Fuerte|Juan Gabriel
Como Han Pasado los Años|Luis Miguel
La Incondicional|Luis Miguel
Ahora Te Puedes Marchar|Luis Miguel
Te Extraño|Luis Miguel
Mi Marciana|Alejandro Sanz
Un Beso y una Flor|Nino Bravo
Libre|Nino Bravo
Mediterráneo|Joan Manuel Serrat
Mi Niñez|Joan Manuel Serrat
Cuéntame|Fórmula V
La Chica de Ayer|Nacha Pop
Bailar Pegados|Sergio Dalma
Escuela de Calor|Radio Futura
Torero|Chayanne
Salomé|Chayanne
Un Siglo Sin Ti|Chayanne
Amor a la Mexicana|Thalía
Arrasando|Thalía
Ni Una Sola Palabra|Paulina Rubio
Y Yo Sigo Aquí|Paulina Rubio
Sin Documentos|Los Rodríguez
Venezia|Hombres G
Sin Ti No Soy Nada|Amaral
El Universo Sobre Mí|Amaral
La Playa de Los Alemanes|El Canto del Loco
Zapatillas|El Canto del Loco
Peter Pan|El Canto del Loco
Corazón Contento|Reik
Me Niego|Reik
Yo Te Esperaré|Sin Bandera
Entra en Mi Vida|Sin Bandera
Corre|Jesse & Joy
Espacio Sideral|Jesse & Joy
Hijo de la luna|Mecano
Me cuesta tanto olvidarte|Mecano
Mujer contra mujer|Mecano
Maquillaje|Mecano
Cruz de navajas|Mecano
Un año más|Mecano
La fuerza del destino|Mecano
Entre dos tierras|Héroes del Silencio
Maldito duende|Héroes del Silencio
La chispa adecuada|Héroes del Silencio
Eres|Café Tacvba
La ingrata|Café Tacvba
Chilanga banda|Café Tacvba
Gimme tha power|Molotov||rap
Frijolero|Molotov||rap
Matador|Los Fabulosos Cadillacs
El satánico Dr. Cadillac|Los Fabulosos Cadillacs
Soldadito marinero|Fito & Fitipaldis
Por la boca vive el pez|Fito & Fitipaldis
La casa por el tejado|Fito & Fitipaldis
Insurrección|El Último de la Fila
Como un burro amarrado en la puerta del baile|El Último de la Fila
Cien gaviotas|Duncan Dhu
En algún lugar|Duncan Dhu
La célula que explota|Caifanes
Afuera|Caifanes
Loco (tu forma de ser)|Los Auténticos Decadentes
El murguero|Los Auténticos Decadentes
Tren al sur|Los Prisioneros
El sol no regresa|La Quinta Estación
Me muero|La Quinta Estación
Déjame|Los Secretos
Pero a tu lado|Los Secretos
Florecita rockera|Aterciopelados
Bolero falaz|Aterciopelados
La muralla verde|Enanitos Verdes
La raja|Estopa
Tu calorro|Estopa
Aquí|La Ley
El duelo|La Ley
Bombón asesino|Vilma Palma e Vampiros
Caraluna|Bacilos
`, { language: "es", scope: "local" }),

  fr: parseSongs(`
Comme d'habitude|Claude François|1967|chanson|medium
Alexandrie Alexandra|Claude François|1978|pop|medium
Je t'aime... moi non plus|Serge Gainsbourg|1969|chanson|medium
La Javanaise|Serge Gainsbourg|1963|chanson|hard
Bruxelles je t'aime|Angèle|2021|pop|hard
Les Champs-Élysées|Joe Dassin|1969|pop|easy
La Thune|Angèle
Doudou|Aya Nakamura
Si t'étais là|Louane
On était beau|Louane
Je te promets|Zaz
Sur ma route|Black M
Mme Pavoshko|Black M
Est-ce que tu m'aimes|Maître Gims
Cool|Maître Gims
Reste|Maître Gims
Le Lac|Julien Doré
Paris-Seychelles|Julien Doré
Nos Absences|Julien Doré
On dirait|Amir
J'ai cherché|Amir
Longtemps|Amir
Clique|Slimane
À fleur de toi|Slimane
Le Coup de Soleil|Vianney
Je m'en vais|Vianney
Pas là|Vianney
Beau-Papa|Vianney
Tomber la neige|Christophe Maé
On s'attache|Christophe Maé
Il est où le bonheur|Christophe Maé
Le Téléphone Pleure|Claude François
Cendrillon|Téléphone
Ça (c'est vraiment toi)|Téléphone
Un autre monde|Téléphone
Foule sentimentale|Alain Souchon
J'ai dix ans|Alain Souchon
Comme toi|Jean-Jacques Goldman
Savoir aimer|Florent Pagny
Ma liberté de penser|Florent Pagny
Caruso|Florent Pagny
Casser la voix|Patrick Bruel
Place des grands hommes|Patrick Bruel
Qui a le droit|Patrick Bruel
Je sais pas|Céline Dion
En amour|Calogero
Si seulement je pouvais lui manquer|Calogero
Face à la mer|Calogero
Basique|Orelsan
La Terre est ronde|Orelsan
Défaite de famille|Orelsan
Dommage|Bigflo & Oli
Papa|Bigflo & Oli
Sur le Fil|Bigflo & Oli
Mon Précieux|Soprano
Cosmo|Soprano
Le Diable ne s'habille plus en Prada|Soprano
Réalité augmentée|Nekfeu
Divinidylle|Vanessa Paradis
Be My Baby|Vanessa Paradis
Ella Elle L'a|France Gall
Résiste|France Gall
Poupée de Cire, Poupée de Son|France Gall
Il Jouait du Piano Debout|France Gall
Laissez-Moi Danser|Dalida
Gigi l'Amoroso|Dalida
Paroles, Paroles|Dalida
Je Suis Malade|Serge Lama
Trois Nuits par Semaine|Indochine
Le Sud|Nino Ferrer
She|Charles Aznavour
Ma Gueule|Johnny Hallyday
L'Hymne à l'Amour|Édith Piaf
Padam Padam|Édith Piaf
Les Feuilles Mortes|Yves Montand
Sous le Ciel de Paris|Yves Montand
Que Reste-t-il de Nos Amours|Charles Trenet
La Mer|Charles Trenet
Douce France|Charles Trenet
Les Copains d'Abord|Georges Brassens
Chanson pour l'Auvergnat|Georges Brassens
Göttingen|Barbara
L'Aigle Noir|Barbara
Mon Amie la Rose|Françoise Hardy
Tous les Garçons et les Filles|Françoise Hardy
Le Métèque|Georges Moustaki
Quand On N'a Que l'Amour|Jacques Brel
La Valse à Mille Temps|Jacques Brel
Je vais t'aimer|Michel Sardou
Le Chanteur|Daniel Balavoine
Mon fils ma bataille|Daniel Balavoine
Aziza|Daniel Balavoine
Je suis un homme|Zazie
Lucie|Pascal Obispo
Tombé pour elle|Pascal Obispo
Je m'appelle Hélène|Hélène Rollès
Tout|Lara Fabian
Je t'aime|Lara Fabian
Le Vent Nous Portera|Noir Désir
Manhattan-Kaboul|Renaud
Dès que le vent soufflera|Renaud
J't'emmène au vent|Louise Attaque
Léa|Louise Attaque
Lola|Superbus
Le Chemin|Kyo
L'hymne de nos campagnes|Tryo
Désolé pour hier soir|Tryo
Marcia Baila|Les Rita Mitsouko
C'est comme ça|Les Rita Mitsouko
Un peu plus près des étoiles|Gold
Ville de lumière|Gold
Les Démons de minuit|Images
Nuit de folie|Début de Soirée
Tomber la chemise|Zebda
Je danse le Mia|IAM||rap
Nés sous la même étoile|IAM||rap
Laisse pas traîner ton fils|Suprême NTM||rap
Désolé|Sexion d'Assaut||rap
Avant qu'elle parte|Sexion d'Assaut||rap
Dis-moi|BB Brunes
Le gang|BB Brunes
Comme elle vient|Noir Désir
Femme libérée|Cookie Dingler
Partenaire particulier|Partenaire Particulier
Voilà l'été|Les Négresses Vertes
C'est bon pour le moral|La Compagnie Créole
Ça fait rire les oiseaux|La Compagnie Créole
Le Pouvoir des fleurs|Laurent Voulzy
Rockollection|Laurent Voulzy
Goodbye Marylou|Michel Polnareff
Lettre à France|Michel Polnareff
Femmes, je vous aime|Julien Clerc
`, { language: "fr", scope: "local" }),

  pt: parseSongs(`
Chega de Saudade|João Gilberto|1958|jazz|medium
Trem Bala|Ana Vilela|2017|pop|medium
Amor de Índio|Beto Guedes|1978|pop|hard
Sozinho|Caetano Veloso|1998|pop|medium
Sampa|Caetano Veloso|1978|pop|hard
Cálice|Chico Buarque|1978|pop|hard
Pais e Filhos|Legião Urbana|1989|rock|medium
Tempo Perdido|Legião Urbana|1986|rock|medium
Faroeste Caboclo|Legião Urbana|1987|rock|hard
Do Seu Lado|Jota Quest|1999|rock|medium
Sinal Fechado|Paulinho da Viola|1969|pop|hard
Vapor Barato|O Rappa|1996|rock|hard
Grândola, Vila Morena|José Afonso|1971|folk|medium
Uma Casa Portuguesa|Amália Rodrigues|1953|folk|medium
Estranha Forma de Vida|Amália Rodrigues|1962|folk|medium
60 Segundos|Gusttavo Lima
Meteoro|Luan Santana
Te Esperando|Luan Santana
Você Não Sabe o Que É Amor|Luan Santana
Escreve Aí|Luan Santana
Camisa 10|Turma do Pagode
Aquele 1|Turma do Pagode
Deixa Alagar|Turma do Pagode
Coração Vazio|Jorge e Mateus
Pode Chorar|Jorge e Mateus
Amo Noite e Dia|Jorge e Mateus
Os Anjos Cantam|Jorge e Mateus
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
Vai Malandra|Anitta
Girl from Rio|Anitta
Cheguei|Ludmilla
Onde É Que Eu Errei|Ludmilla
Rainha da Favela|Ludmilla
K.O.|Pabllo Vittar
Sua Cara|Pabllo Vittar
Ocean|Alok
Un Ratito|Alok
É o Amor|Zezé Di Camargo e Luciano
Como Vai Você|Roberto Carlos
Detalhes|Roberto Carlos
Emoções|Roberto Carlos
Amigo|Roberto Carlos
Fico Assim Sem Você|Adriana Calcanhotto
Eduardo e Mônica|Legião Urbana
Que País É Este|Legião Urbana
Vento no Litoral|Legião Urbana
Garota Nacional|Skank
É Uma Partida de Futebol|Skank
Sutilmente|Skank
Ainda Gosto Dela|Skank
Fica|Jota Quest
Na Moral|Jota Quest
Só Hoje|Jota Quest
Encontrar Alguém|Jota Quest
Zé Trindade|Charlie Brown Jr.
Só Os Loucos Sabem|Charlie Brown Jr.
Sonífera Ilha|Titãs
Comida|Titãs
Epitáfio|Titãs
Alagados|Paralamas do Sucesso
Lanterna dos Afogados|Paralamas do Sucesso
Vital e Sua Moto|Paralamas do Sucesso
Bete Balanço|Barão Vermelho
Pro Dia Nascer Feliz|Barão Vermelho
Independência|Capital Inicial
Primeiros Erros|Capital Inicial
Á Sua Maneira|Capital Inicial
O Que Sobrou do Céu|O Rappa
Minha Alma|O Rappa
Roots Bloody Roots|Sepultura
Chuva de Arroz|Luan Santana
Chá de Sumiço|Léo Santana
Zona de Perigo|Léo Santana
Amor de Verdade|MC Kekel
Bum Bum Tam Tam|MC Fioti
Vai Dar PT|Zé Neto e Cristiano
Largado às Traças|Zé Neto e Cristiano
Barquinho|Zé Neto e Cristiano
Chuva de Prata|Xutos & Pontapés
Pontes de Papel|Rui Veloso
Porto Sentido|Rui Veloso
Búzios|Ana Moura
Wave|Tom Jobim
Corcovado|Tom Jobim
Desafinado|João Gilberto
Insensatez|João Gilberto
Carinhoso|Pixinguinha
Asa Branca|Luiz Gonzaga
Baião|Luiz Gonzaga
A Vida do Viajante|Luiz Gonzaga
O Xote das Meninas|Luiz Gonzaga
Ovelha Negra|Rita Lee
Mania de Você|Rita Lee
Lança Perfume|Rita Lee
Doce Vampiro|Rita Lee
Alegria, Alegria|Caetano Veloso
Você é Linda|Caetano Veloso
Tigresa|Caetano Veloso
O Leãozinho|Caetano Veloso
Roda Viva|Chico Buarque
Apesar de Você|Chico Buarque
Trocando em Miúdos|Chico Buarque
Divino Maravilhoso|Gal Costa
Como 2 e 2|Gal Costa
Andar com Fé|Gilberto Gil
Aquele Abraço|Gilberto Gil
Palco|Gilberto Gil
Se Eu Quiser Falar com Deus|Gilberto Gil
Maria, Maria|Milton Nascimento
Travessia|Milton Nascimento
Nos Bailes da Vida|Milton Nascimento
Sina|Djavan
Oceano|Djavan
Flor de Lis|Djavan
Se|Djavan
Samurai|Djavan
Preciso Me Encontrar|Cartola
As Rosas Não Falam|Cartola
O Mundo é um Moinho|Cartola
Vai Passar|Chico Buarque
Meu Mundo Caiu|Maysa
Zóio de Lula|Charlie Brown Jr.
Exagerado|Cazuza
Beija Eu|Marisa Monte
Deixa a Vida Me Levar|Zeca Pagodinho
Verdade|Zeca Pagodinho
Dormi na Praça|Bruno & Marrone
Borboletas|Victor & Leo
Infinita Highway|Engenheiros do Hawaii
Toda Forma de Poder|Engenheiros do Hawaii
Somos Quem Podemos Ser|Engenheiros do Hawaii
Um Minuto para o Fim do Mundo|CPM 22
Regina Let's Go|CPM 22
Cedo ou Tarde|NX Zero
Razões e Emoções|NX Zero
Mulher de Fases|Raimundos
A Mais Pedida|Raimundos
Como Eu Quero|Kid Abelha
Pintura Íntima|Kid Abelha
Rádio Pirata|RPM
Olhar 43|RPM
Vento Ventania|Biquini Cavadão
Timidez|Biquini Cavadão
Onde Você Mora?|Cidade Negra
Firmamento|Cidade Negra
Presente de um Beija-Flor|Natiruts
Quero Ser Feliz Também|Natiruts
Envelheço na Cidade|Ira!
Flores em Você|Ira!
Admirável Chip Novo|Pitty
Na Sua Estante|Pitty
Flores|Titãs
Vou Deixar|Skank
Uma Partida de Futebol|Skank
Óculos|Paralamas do Sucesso
Todo Carnaval Tem Seu Fim|Los Hermanos
Camila Camila|Nenhum de Nós
Inútil|Ultraje a Rigor
Nós Vamos Invadir Sua Praia|Ultraje a Rigor
Você Não Soube Me Amar|Blitz
Quando o Sol se For|Detonautas
Homem do Mar|Xutos & Pontapés
Efectivamente|GNR
Sempre que o Amor me Quiser|Delfins
Nasce Selvagem|Delfins
Chico Fininho|Rui Veloso
A Paixão|Rui Veloso
Balada do Desajeitado|D.A.M.A
Ouvi Dizer|Ornatos Violeta
Problema de Expressão|Clã
Cavalos de Corrida|UHF
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
