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
