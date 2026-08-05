import type { AppLanguage } from "../i18n/LanguageProvider";
import type { SongCard } from "./teamBattleExtras";

/**
 * Ručne kurátorovaný katalóg skutočných, všeobecne známych hitov.
 * Uprednostňuje skladby s ľahko rozpoznateľným refrénom alebo úvodom, ktoré
 * majú vysokú šancu na dostupnú ukážku v Deezer/iTunes. Neobsahuje generované
 * názvy ani výplňové skladby iba kvôli vysokému počtu.
 */
function parseSongs(library: string): SongCard[] {
  return library.trim().split("\n").map((rawLine, index) => {
    const line = rawLine.trim();
    const parts = line.split("|");
    if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
      throw new Error(`Neplatný riadok hudobného katalógu ${index + 1}: ${rawLine}`);
    }
    return { title: parts[0].trim(), artist: parts[1].trim() };
  });
}

const WORLD_HITS = parseSongs(`
Dancing Queen|ABBA
Mamma Mia|ABBA
Gimme! Gimme! Gimme!|ABBA
Bohemian Rhapsody|Queen
We Will Rock You|Queen
Don't Stop Me Now|Queen
Another One Bites the Dust|Queen
Billie Jean|Michael Jackson
Beat It|Michael Jackson
Thriller|Michael Jackson
Like a Prayer|Madonna
Material Girl|Madonna
I Wanna Dance with Somebody|Whitney Houston
I Will Always Love You|Whitney Houston
Livin' on a Prayer|Bon Jovi
The Final Countdown|Europe
Eye of the Tiger|Survivor
Don't Stop Believin'|Journey
Take on Me|a-ha
Africa|Toto
Girls Just Want to Have Fun|Cyndi Lauper
Never Gonna Give You Up|Rick Astley
Sweet Dreams (Are Made of This)|Eurythmics
Wake Me Up Before You Go-Go|Wham!
Careless Whisper|George Michael
Summer of '69|Bryan Adams
The Best|Tina Turner
I Will Survive|Gloria Gaynor
Y.M.C.A.|Village People
Stayin' Alive|Bee Gees
Rasputin|Boney M.
Cheri Cheri Lady|Modern Talking
Listen to Your Heart|Roxette
Wind of Change|Scorpions
Sweet Child o' Mine|Guns N' Roses
Smells Like Teen Spirit|Nirvana
Nothing Else Matters|Metallica
Californication|Red Hot Chili Peppers
Wonderwall|Oasis
Zombie|The Cranberries
Losing My Religion|R.E.M.
With or Without You|U2
Yellow|Coldplay
Viva la Vida|Coldplay
Paradise|Coldplay
Numb|Linkin Park
In the End|Linkin Park
Boulevard of Broken Dreams|Green Day
Bring Me to Life|Evanescence
...Baby One More Time|Britney Spears
Oops!... I Did It Again|Britney Spears
Everybody (Backstreet's Back)|Backstreet Boys
I Want It That Way|Backstreet Boys
Wannabe|Spice Girls
Bye Bye Bye|*NSYNC
Genie in a Bottle|Christina Aguilera
Hips Don't Lie|Shakira feat. Wyclef Jean
Waka Waka (This Time for Africa)|Shakira
Livin' la Vida Loca|Ricky Martin
Hero|Enrique Iglesias
On the Floor|Jennifer Lopez feat. Pitbull
Crazy in Love|Beyoncé feat. Jay-Z
Single Ladies|Beyoncé
Umbrella|Rihanna feat. Jay-Z
Diamonds|Rihanna
Poker Face|Lady Gaga
Bad Romance|Lady Gaga
Shallow|Lady Gaga a Bradley Cooper
Firework|Katy Perry
Roar|Katy Perry
Party in the U.S.A.|Miley Cyrus
Flowers|Miley Cyrus
Shake It Off|Taylor Swift
Love Story|Taylor Swift
Blank Space|Taylor Swift
Cruel Summer|Taylor Swift
Rolling in the Deep|Adele
Someone Like You|Adele
Hello|Adele
Shape of You|Ed Sheeran
Perfect|Ed Sheeran
Just the Way You Are|Bruno Mars
Grenade|Bruno Mars
Uptown Funk|Mark Ronson feat. Bruno Mars
Blinding Lights|The Weeknd
Save Your Tears|The Weeknd
Levitating|Dua Lipa
Don't Start Now|Dua Lipa
bad guy|Billie Eilish
Baby|Justin Bieber feat. Ludacris
Sorry|Justin Bieber
Counting Stars|OneRepublic
Believer|Imagine Dragons
Wake Me Up|Avicii
The Nights|Avicii
Titanium|David Guetta feat. Sia
Memories|David Guetta feat. Kid Cudi
Summer|Calvin Harris
Closer|The Chainsmokers feat. Halsey
Moves Like Jagger|Maroon 5 feat. Christina Aguilera
Happy|Pharrell Williams
Chandelier|Sia
Cheap Thrills|Sia
Party Rock Anthem|LMFAO
Gangnam Style|PSY
Somebody That I Used to Know|Gotye feat. Kimbra
Dance Monkey|Tones and I
Despacito|Luis Fonsi feat. Daddy Yankee
Gasolina|Daddy Yankee
Danza Kuduro|Don Omar feat. Lucenzo
Havana|Camila Cabello feat. Young Thug
Señorita|Shawn Mendes a Camila Cabello
drivers license|Olivia Rodrigo
As It Was|Harry Styles
Someone You Loved|Lewis Capaldi
Beautiful Things|Benson Boone
APT.|ROSÉ a Bruno Mars
Espresso|Sabrina Carpenter
Good Luck, Babe!|Chappell Roan
Too Sweet|Hozier
Die With A Smile|Lady Gaga a Bruno Mars
Birds of a Feather|Billie Eilish
My Heart Will Go On|Céline Dion
Let It Go|Idina Menzel
Ghostbusters|Ray Parker Jr.
Footloose|Kenny Loggins
What Is Love|Haddaway
The Ketchup Song (Aserejé)|Las Ketchup
Dragostea Din Tei|O-Zone
Freed from Desire|Gala
Blue (Da Ba Dee)|Eiffel 65
Macarena|Los del Río
Cotton Eye Joe|Rednex
Barbie Girl|Aqua
I'm a Believer|Smash Mouth
All Star|Smash Mouth
Seven Nation Army|The White Stripes
Can’t Stop the Feeling!|Justin Timberlake
I Gotta Feeling|The Black Eyed Peas
`);

const LOCAL_HITS: Record<AppLanguage, SongCard[]> = {
  sk: parseSongs(`
V dolinách|Karol Duchoň
Čardáš dvoch sŕdc|Karol Duchoň
Mám ťa rád|Karol Duchoň
Po schodoch|Richard Müller
Nebude to ľahké|Richard Müller
Tlaková níž|Richard Müller
Voda, čo ma drží nad vodou|Elán
Nie sme zlí|Elán
Stužková|Elán
Vymyslená|Elán
Kráľovná bielych tenisiek|Elán
Sestrička z Kramárov|Elán
Reklama na ticho|Team
Držím ti miesto|Team
Severanka|Team
Lietam v tom tiež|Team
Atlantída|Miroslav Žbirka
Biely kvet|Miroslav Žbirka
22 dní|Miroslav Žbirka
Balada o poľných vtákoch|Miroslav Žbirka
Vyznanie|Marika Gombitová
Koloseum|Marika Gombitová
Úsmev|Modus
Sklíčka|Modus
Čerešne|Hana Hegerová
Opri sa o mňa|IMT Smile
Cesty II. triedy|IMT Smile
Ľudia nie sú zlí|IMT Smile
Veselá pesnička|IMT Smile
Žily|No Name
Ty a tvoja sestra|No Name
Čím to je|No Name
Mráz do žíl|Desmod
Vyrobená pre mňa|Desmod
Spomaľ|Peha
Pokoj v duši|Jana Kirschner
Bude mi ľahko|Jana Kirschner
Modrá|Jana Kirschner
Horehronie|Kristína
Ta ne|Kristína
Mám ťa rád|Adam Ďurica
Neľutujem|Adam Ďurica
Mandolína|Adam Ďurica
Spolu|Adam Ďurica
Všade tam, kde si|Peter Bič Project
Žijeme len raz|Ego
Príbeh|Tina a Rytmus
Keď sa zamiluješ|Hex
Komplikovaná|Polemic
Dnes|Tublatanka
Silný refrén|Horkýže Slíže
L.A.G. Song|Horkýže Slíže
Macejko|Slovenská ľudová
Prší, prší|Slovenská ľudová
Tancuj, tancuj, vykrúcaj|Slovenská ľudová
Slovenské mamičky|Slovenská ľudová
Pásla kone na betóne|Slovenská ľudová
Lady Carneval|Karel Gott
Být stále mlád|Karel Gott
Trezor|Karel Gott
Když muž se ženou snídá|Karel Gott
Jožin z bažin|Ivan Mládek
Holubí dům|Jiří Schelinger
Jasná zpráva|Olympic
Sladké mámení|Helena Vondráčková
Dlouhá noc|Helena Vondráčková
Nonstop|Michal David
Pár přátel|Michal David
Decibely lásky|Michal David
Láska je láska|Lucie Bílá
Amerika|Lucie
Medvídek|Lucie
Malování|Divokej Bill
Pohoda|Kabát
Burlaci|Kabát
Tabáček|Chinaski
Víno|Chinaski
Klára|Chinaski
Cesta|Kryštof a Tomáš Klus
Anděl|Mirai
Boky jako skříň|Ewa Farna
Nafrněná|Barbora Poláková
Cesta z města|Support Lesbiens
Chci zas v tobě spát|Lucie
Šrouby a matice|Mandrage
František|Buty
`),
  en: parseSongs(`
Happy Birthday to You|Traditional
Jingle Bells|James Lord Pierpont
We Wish You a Merry Christmas|Traditional
Silent Night|Franz Xaver Gruber
Twinkle Twinkle Little Star|Traditional
Old MacDonald Had a Farm|Traditional
My Bonnie Lies over the Ocean|Traditional
Amazing Grace|John Newton
You Are My Sunshine|Jimmie Davis
Sweet Caroline|Neil Diamond
Hotel California|Eagles
Yesterday|The Beatles
Hey Jude|The Beatles
Let It Be|The Beatles
All You Need Is Love|The Beatles
Imagine|John Lennon
Stairway to Heaven|Led Zeppelin
Purple Rain|Prince
Mr. Brightside|The Killers
Hallelujah|Leonard Cohen
I Want to Hold Your Hand|The Beatles
Wonderwall|Oasis
Stay|The Kid LAROI & Justin Bieber
Ring Around the Rosie|Traditional
London Bridge Is Falling Down|Traditional
Row, Row, Row Your Boat|Traditional
The Wheels on the Bus|Traditional
Danny Boy|Frederic Weatherly
Stand by Me|Ben E. King
My Way|Frank Sinatra
Fly Me to the Moon|Frank Sinatra
Can't Help Falling in Love|Elvis Presley
Suspicious Minds|Elvis Presley
Jolene|Dolly Parton
Always on My Mind|Willie Nelson
Sweet Child o' Mine|Guns N' Roses
Blowin' in the Wind|Bob Dylan
Rocket Man|Elton John
Your Song|Elton John
Piano Man|Billy Joel
Dancing in the Dark|Bruce Springsteen
Born in the U.S.A.|Bruce Springsteen
Smells Like Teen Spirit|Nirvana
Losing My Religion|R.E.M.
Uptown Girl|Billy Joel
Last Christmas|Wham!
All I Want for Christmas Is You|Mariah Carey
Perfect|Ed Sheeran
Thinking Out Loud|Ed Sheeran
Auld Lang Syne|Robert Burns
`),
  de: parseSongs(`
99 Luftballons|Nena
Atemlos durch die Nacht|Helene Fischer
Roller|Apache 207
Komet|Udo Lindenberg a Apache 207
Wildberry Lillet|Nina Chuba
Friesenjung|Ski Aggu, Joost a Otto Waalkes
Traum|Cro
Easy|Cro
Einmal um die Welt|Cro
Haus am See|Peter Fox
Schwarz zu Blau|Peter Fox
Tage wie diese|Die Toten Hosen
Altes Fieber|Die Toten Hosen
Ein Kompliment|Sportfreunde Stiller
Applaus, Applaus|Sportfreunde Stiller
Lieblingsmensch|Namika
Barfuß am Klavier|AnnenMayKantereit
Pocahontas|AnnenMayKantereit
Nur noch kurz die Welt retten|Tim Bendzko
Das Beste|Silbermond
Symphonie|Silbermond
Durch den Monsun|Tokio Hotel
Astronaut|Sido feat. Andreas Bourani
Auf uns|Andreas Bourani
Major Tom (Völlig losgelöst)|Peter Schilling
Verdammt, ich lieb' dich|Matthias Reim
Sonderzug nach Pankow|Udo Lindenberg
Jeanny|Falco
Rock Me Amadeus|Falco
Out of the Dark|Falco
Griechischer Wein|Udo Jürgens
Aber bitte mit Sahne|Udo Jürgens
Marmor, Stein und Eisen bricht|Drafi Deutscher
Skandal im Sperrbezirk|Spider Murphy Gang
Du hast|Rammstein
Sonne|Rammstein
Ein Bett im Kornfeld|Jürgen Drews
Sierra Madre|Schürzenjäger
Wahnsinn|Wolfgang Petry
Fliegerlied (So ein schöner Tag)|Donikkl
Ein Stern (der deinen Namen trägt)|DJ Ötzi
Bruttosozialprodukt|Geier Sturzflug
Über sieben Brücken musst du gehn|Peter Maffay
Hupf in Gatsch|Georg Danzer
Schickeria|Spider Murphy Gang
Guten Abend, gut' Nacht|Johannes Brahms
O Tannenbaum|Traditional
Stille Nacht, heilige Nacht|Franz Xaver Gruber
`),
  es: parseSongs(`
La Bamba|Ritchie Valens
Bailando|Enrique Iglesias feat. Descemer Bueno a Gente de Zona
Vivir Mi Vida|Marc Anthony
La Camisa Negra|Juanes
A Dios le Pido|Juanes
Me Enamora|Juanes
Waka Waka (Esto es África)|Shakira
La Tortura|Shakira feat. Alejandro Sanz
Hips Don't Lie|Shakira
Mi Gente|J Balvin a Willy William
Pepas|Farruko
Calma|Pedro Capó feat. Farruko
Despechá|ROSALÍA
Todo de Ti|Rauw Alejandro
La Bachata|Manuel Turizo
Provenza|Karol G
Tusa|Karol G feat. Nicki Minaj
Tití Me Preguntó|Bad Bunny
Hawái|Maluma
Felices los 4|Maluma
Robarte un Beso|Carlos Vives a Sebastián Yatra
Ai Se Eu Te Pego|Michel Teló
Guantanamera|Joseíto Fernández
Cielito Lindo|Quirino Mendoza y Cortés
Corazón Partío|Alejandro Sanz
La Flaca|Jarabe de Palo
Depende|Jarabe de Palo
Eres Tú|Mocedades
Amigo|Roberto Carlos
Rayando El Sol|Maná
Clavado En Un Bar|Maná
En El Muelle De San Blas|Maná
Livin' la Vida Loca|Ricky Martin
La Copa de la Vida|Ricky Martin
El Perdón|Nicky Jam feat. Enrique Iglesias
Bamboléo|Gipsy Kings
Volare|Gipsy Kings
Danza Kuduro|Don Omar feat. Lucenzo
Gasolina|Daddy Yankee
Querida|Juan Gabriel
El Rey|Vicente Fernández
Bésame Mucho|Consuelo Velázquez
Pedro|Raffaella Carrà
Aserejé|Las Ketchup
Macarena|Los del Río
Amante Bandido|Miguel Bosé
Devuélveme a mi chica|Hombres G
Lamento Boliviano|Enanitos Verdes
De Música Ligera|Soda Stereo
Persiana Americana|Soda Stereo
`),
  fr: parseSongs(`
Alors on danse|Stromae
Papaoutai|Stromae
Formidable|Stromae
Dernière danse|Indila
Tourner dans le vide|Indila
Djadja|Aya Nakamura
Pookie|Aya Nakamura
Sapés comme jamais|Gims feat. Niska
Bella|Gims
J'me tire|Gims
Je veux|Zaz
La vie en rose|Édith Piaf
Non, je ne regrette rien|Édith Piaf
Joe le taxi|Vanessa Paradis
Ça plane pour moi|Plastic Bertrand
Moi... Lolita|Alizée
Avenir|Louane
Andalouse|Kendji Girac
Tout oublier|Angèle feat. Roméo Elvis
Fever|Dua Lipa a Angèle
Sous le vent|Garou a Céline Dion
Pour que tu m'aimes encore|Céline Dion
Je te donne|Jean-Jacques Goldman a Michael Jones
Champs-Élysées|Joe Dassin
L'été indien|Joe Dassin
Les Lacs du Connemara|Michel Sardou
Mistral gagnant|Renaud
La Bohème|Charles Aznavour
Emmenez-moi|Charles Aznavour
Ne me quitte pas|Jacques Brel
Le plat pays|Jacques Brel
Désenchantée|Mylène Farmer
Je l'aime à mourir|Francis Cabrel
La tribu de Dana|Manau
Belle|Garou, Daniel Lavoie a Patrick Fiori
Le lion est mort ce soir|Henri Salvador
Alouette|Traditional
Frère Jacques|Traditional
Au clair de la lune|Traditional
Aïcha|Khaled
On écrit sur les murs|Kids United
Sympathique (Je ne veux pas travailler)|Pink Martini
La Corrida|Francis Cabrel
Sensualité|Axelle Red
Caravane|Raphael
Respire|Mickey 3D
Double Je|Christophe Willem
Marly-Gomont|Kamini
`),
  pt: parseSongs(`
Ai Se Eu Te Pego|Michel Teló
Balada|Gusttavo Lima
Evidências|Chitãozinho & Xororó
Garota de Ipanema|Tom Jobim a Vinícius de Moraes
Mas Que Nada|Sérgio Mendes feat. The Black Eyed Peas
Aquarela|Toquinho
Não Quero Dinheiro|Tim Maia
País Tropical|Jorge Ben Jor
O Descobridor dos Sete Mares|Tim Maia
Cheia de Manias|Raça Negra
Anna Júlia|Los Hermanos
A Minha Casinha|Xutos & Pontapés
Não Sou o Único|Xutos & Pontapés
Homem do Leme|Xutos & Pontapés
Anda Comigo Ver os Aviões|Os Azeitonas
Ó Gente da Minha Terra|Mariza
Quem Me Dera|Mariza
Andorinhas|Ana Moura
Envolver|Anitta
Show das Poderosas|Anitta
Infiel|Marília Mendonça
Leão|Marília Mendonça
Todo Mundo Vai Sofrer|Marília Mendonça
Apaga a Luz e Toma|Tony Carreira
Sonhos de Menino|Tony Carreira
Mãe Querida|Tony Carreira
Lambada (Chorando Se Foi)|Kaoma
A Banda|Chico Buarque
Fio de Cabelo|Chitãozinho & Xororó
Cochichando|Pixinguinha
Festa|Ivete Sangalo
Sorte Grande|Ivete Sangalo
Dança da Manivela|Asa de Águia
Florentina|Tiririca
Ilariê|Xuxa
Baianidade Nagô|Banda Mel
Amor I Love You|Marisa Monte
Velha Infância|Tribalistas
Já Sei Namorar|Tribalistas
Whisky a Go-Go|Roupa Nova
Menina Estás à Janela|Vitorino
Chamar a Música|Sara Tavares
Lusitana Paixão|Dulce Pontes
Playback|Carlos Paião
Estrela da Tarde|Carlos do Carmo
Fado Tropical|Chico Buarque
Desfolhada Portuguesa|Simone de Oliveira
Anjo Selvagem|Santamaria
Dunas|GNR
Pronúncia do Norte|GNR
`),
};

function songId(song: SongCard) {
  return `${song.title.toLocaleLowerCase()}|${song.artist.toLocaleLowerCase()}`;
}

function uniqueSongs(songs: readonly SongCard[]) {
  return Array.from(new Map(songs.map((song) => [songId(song), song])).values());
}

export const CURATED_WORLD_HITS = uniqueSongs(WORLD_HITS);
export const CURATED_LOCAL_HITS = Object.fromEntries(
  Object.entries(LOCAL_HITS).map(([language, songs]) => [language, uniqueSongs(songs)]),
) as Record<AppLanguage, SongCard[]>;

const CURATED_SONGS_BY_LANGUAGE = Object.fromEntries(
  Object.entries(CURATED_LOCAL_HITS).map(([language, localSongs]) => [
    language,
    uniqueSongs([...localSongs, ...CURATED_WORLD_HITS]),
  ]),
) as Record<AppLanguage, SongCard[]>;

export function getSongCardsForLanguage(language: AppLanguage): SongCard[] {
  return CURATED_SONGS_BY_LANGUAGE[language];
}

export const SONG_COUNTS_BY_LANGUAGE = Object.fromEntries(
  Object.entries(CURATED_SONGS_BY_LANGUAGE).map(([language, songs]) => [language, songs.length]),
) as Record<AppLanguage, number>;
