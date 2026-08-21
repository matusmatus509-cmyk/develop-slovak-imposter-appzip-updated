import type { AppLanguage } from "../i18n/LanguageProvider";
import type { SongCard } from "./teamBattleExtras";

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
Bailando|Enrique Iglesias
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
Gangnam Style|PSY
Somebody That I Used to Know|Gotye
Dance Monkey|Tones and I
Despacito|Luis Fonsi
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
Dragostea Din Tei|O-Zone
Freed from Desire|Gala
Blue (Da Ba Dee)|Eiffel 65
Macarena|Los del Río
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
Take My Breath Away|Queen
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
Gasolina|Daddy Yankee
Danza Kuduro|Don Omar
Señorita|Shawn Mendes
Die With A Smile|Lady Gaga
The Ketchup Song (Aserejé)|Las Ketchup
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
Hollaback Girl|Snoop Dogg
Gold Digger|Kanye West
Stronger|Kanye West
Super Bass|Gwen Stefani
Pump It|Black Eyed Peas
Promiscuous|Nelly Furtado
Maneater|Nelly Furtado
Sk8er Boi|Gwen Stefani
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
`);

const LOCAL_HITS: Record<AppLanguage, SongCard[]> = {
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
Boky jako skříň|Ewa Farna
Nafrněná|Barbora Poláková
Cesta z města|Support Lesbiens
Šrouby a matice|Mandrage
Hledá se žena|Mandrage
František|Buty
Nad stádem koní|Buty
Láska je tu s vami|Peter Nagy
Tam u nebeských bran|Michal Tučný
Želva|Olympic
Lásko má ja stůňu|Helena Vondráčková
Sen|Lucie
Zlatíčko|Chinaski
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
Láska drž ma nad hladinou|Tublatanka
Loď do neznáma|Tublatanka
Vianoce|Iné Kafe
30. február|Iné Kafe
Logická hádanka|Horkýže Slíže
Nazdar|Horkýže Slíže
Banda tupých hláv|Horkýže Slíže
Matura|Smola a Hrušky
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
Štěstí je krásná věc|Richard Müller
Rozeznávám|Richard Müller
Šaty|Marika Gombitová
Nároční|Team
Céčka, sbírá céčka|Michal David
Nenapovídej|Michal David
S Láskou|Michal David
Daj mi víc své lásky|Olympic
Klobouk ve křoví|Lucie
Dotknu se ohně|Lucie
Na sever|Kabát
Kdoví jestli|Kabát
Stará Lou|Kabát
Zamilovaný/Nešťastná|Rybičky 48
Sliby se maj plnit o Vánocích|Janek Ledecký
Proklínám|Janek Ledecký
Měls mě vůbec rád|Ewa Farna
Boží mlejny melou|Amor
Dám dělovou ránu|Karel Gott
Když milenky pláčou|Karel Gott
`),
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
`),
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
`),
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
`),
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
`),
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
