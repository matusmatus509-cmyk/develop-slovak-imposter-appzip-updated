import fs from 'fs';

const worldHits = `Dancing Queen|ABBA
Mamma Mia|ABBA
Gimme! Gimme! Gimme!|ABBA
Bohemian Rhapsody|Queen
We Will Rock You|Queen
Don't Stop Me Now|Queen
Another One Bites the Dust|Queen
Billie Jean|Michael Jackson
Beat It|Michael Jackson
Thriller|Michael Jackson
Smooth Criminal|Michael Jackson
Like a Prayer|Madonna
Material Girl|Madonna
I Wanna Dance with Somebody|Whitney Houston
I Will Always Love You|Whitney Houston
Livin' on a Prayer|Bon Jovi
It's My Life|Bon Jovi
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
Daddy Cool|Boney M.
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
Toxic|Britney Spears
Everybody (Backstreet's Back)|Backstreet Boys
I Want It That Way|Backstreet Boys
Wannabe|Spice Girls
Bye Bye Bye|*NSYNC
Genie in a Bottle|Christina Aguilera
Hips Don't Lie|Shakira feat. Wyclef Jean
Waka Waka (This Time for Africa)|Shakira
Whenever, Wherever|Shakira
Livin' la Vida Loca|Ricky Martin
Hero|Enrique Iglesias
On the Floor|Jennifer Lopez feat. Pitbull
Crazy in Love|Beyoncé feat. Jay-Z
Single Ladies|Beyoncé
Halo|Beyoncé
Umbrella|Rihanna feat. Jay-Z
Diamonds|Rihanna
We Found Love|Rihanna
Poker Face|Lady Gaga
Bad Romance|Lady Gaga
Shallow|Lady Gaga a Bradley Cooper
Firework|Katy Perry
Roar|Katy Perry
I Kissed a Girl|Katy Perry
Party in the U.S.A.|Miley Cyrus
Flowers|Miley Cyrus
Wrecking Ball|Miley Cyrus
Shake It Off|Taylor Swift
Love Story|Taylor Swift
Blank Space|Taylor Swift
Cruel Summer|Taylor Swift
Rolling in the Deep|Adele
Someone Like You|Adele
Hello|Adele
Shape of You|Ed Sheeran
Perfect|Ed Sheeran
Thinking Out Loud|Ed Sheeran
Just the Way You Are|Bruno Mars
Grenade|Bruno Mars
Uptown Funk|Mark Ronson feat. Bruno Mars
Blinding Lights|The Weeknd
Save Your Tears|The Weeknd
Starboy|The Weeknd
Levitating|Dua Lipa
Don't Start Now|Dua Lipa
bad guy|Billie Eilish
Baby|Justin Bieber feat. Ludacris
Sorry|Justin Bieber
Love Yourself|Justin Bieber
Counting Stars|OneRepublic
Believer|Imagine Dragons
Radioactive|Imagine Dragons
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
good 4 u|Olivia Rodrigo
As It Was|Harry Styles
Watermelon Sugar|Harry Styles
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
Can't Stop the Feeling!|Justin Timberlake
I Gotta Feeling|The Black Eyed Peas
Where Is The Love?|The Black Eyed Peas
Let's Get It Started|The Black Eyed Peas`;

const localSk = `V dolinách|Karol Duchoň
Čardáš dvoch sŕdc|Karol Duchoň
Mám ťa rád|Karol Duchoň
Dievča z Budmeríc|Karol Duchoň
Šiel, šiel|Karol Duchoň
Po schodoch|Richard Müller
Nebude to ľahké|Richard Müller
Tlaková níž|Richard Müller
Milovanie v daždi|Richard Müller
Voda, čo ma drží nad vodou|Elán
Nie sme zlí|Elán
Stužková|Elán
Vymyslená|Elán
Kráľovná bielych tenisiek|Elán
Sestrička z Kramárov|Elán
Bosorka|Elán
Zaľúbil sa chlapec|Elán
Reklama na ticho|Team
Držím ti miesto|Team
Severanka|Team
Lietam v tom tiež|Team
Je to vo hviezdach|Team
Atlantída|Miroslav Žbirka
Biely kvet|Miroslav Žbirka
22 dní|Miroslav Žbirka
Balada o poľných vtákoch|Miroslav Žbirka
Čo bolí, to prebolí|Miroslav Žbirka
Vyznanie|Marika Gombitová
Koloseum|Marika Gombitová
Študentská láska|Marika Gombitová
Úsmev|Modus
Sklíčka|Modus
Veľký sen mora|Modus
Čerešne|Hana Hegerová
Opri sa o mňa|IMT Smile
Cesty II. triedy|IMT Smile
Ľudia nie sú zlí|IMT Smile
Veselá pesnička|IMT Smile
Exotika|IMT Smile
Nepoznám|IMT Smile
Žily|No Name
Ty a tvoja sestra|No Name
Čím to je|No Name
Prvá|No Name
Mráz do žíl|Desmod
Vyrobená pre mňa|Desmod
Zhorí všetko čo mám|Desmod
Spomaľ|Peha
Za tebou|Peha
Pokoj v duši|Jana Kirschner
Bude mi ľahko|Jana Kirschner
Modrá|Jana Kirschner
Horehronie|Kristína
Ta ne|Kristína
Pri oltári|Kristína
Mám ťa rád|Adam Ďurica
Neľutujem|Adam Ďurica
Mandolína|Adam Ďurica
Spolu|Adam Ďurica
Všade tam, kde si|Peter Bič Project
Hey Now|Peter Bič Project
Žijeme len raz|Ego
Príbeh|Tina a Rytmus
Zatancuj si so mnou|Adam Ďurica
Keď sa zamiluješ|Hex
V piatok podvečer|Hex
Komplikovaná|Polemic
Ona je taká|Polemic
Dnes|Tublatanka
Pravda víťazí|Tublatanka
Silný refrén|Horkýže Slíže
L.A.G. Song|Horkýže Slíže
Malá Žužu|Horkýže Slíže
Ráno|Iné Kafe
Ružová záhrada|Iné Kafe
Úspešne zapojený|Iné Kafe
Spomienky na budúcnosť|Iné Kafe
ZRPŠ|Iné Kafe
Aj tak sme frajeri|Peter Nagy
Sme svoji|Peter Nagy
Kristínka iba spí|Peter Nagy
Profesor Indigo|Peter Nagy
Báječný chlap|Michal Tučný
Jožin z bažin|Ivan Mládek
Lady Carneval|Karel Gott
Být stále mlád|Karel Gott
Trezor|Karel Gott
Když muž se ženou snídá|Karel Gott
Včelka Mája|Karel Gott
Zvonky štěstí|Karel Gott
Holubí dům|Jiří Schelinger
Jasná zpráva|Olympic
Slza z tváře padá|Olympic
Sladké mámení|Helena Vondráčková
Dlouhá noc|Helena Vondráčková
Nonstop|Michal David
Pár přátel|Michal David
Decibely lásky|Michal David
Láska je láska|Lucie Bílá
Amerika|Lucie
Medvídek|Lucie
Černí andělé|Lucie
Chci zas v tobě spát|Lucie
Malování|Divokej Bill
Pohoda|Kabát
Burlaci|Kabát
Dole v dole|Kabát
V pekle sudy válej|Kabát
Tabáček|Chinaski
Víno|Chinaski
Klára|Chinaski
1. signální|Chinaski
Cesta|Kryštof a Tomáš Klus
Anděl|Mirai
Boky jako skříň|Ewa Farna
Nafrněná|Barbora Poláková
Cesta z města|Support Lesbiens
Šrouby a matice|Mandrage
František|Buty
Colorado|Kabát`;

const localEn = `Happy Birthday to You|Traditional
Jingle Bells|James Lord Pierpont
We Wish You a Merry Christmas|Traditional
Silent Night|Franz Xaver Gruber
Twinkle Twinkle Little Star|Traditional
Amazing Grace|John Newton
You Are My Sunshine|Jimmie Davis
Sweet Caroline|Neil Diamond
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
Mr. Brightside|The Killers
Hallelujah|Leonard Cohen
I Want to Hold Your Hand|The Beatles
Wonderwall|Oasis
Don't Look Back In Anger|Oasis
Stay|The Kid LAROI & Justin Bieber
Stand by Me|Ben E. King
My Way|Frank Sinatra
Fly Me to the Moon|Frank Sinatra
Can't Help Falling in Love|Elvis Presley
Suspicious Minds|Elvis Presley
Jailhouse Rock|Elvis Presley
Hound Dog|Elvis Presley
Jolene|Dolly Parton
9 to 5|Dolly Parton
Always on My Mind|Willie Nelson
On the Road Again|Willie Nelson
Ring of Fire|Johnny Cash
Sweet Child o' Mine|Guns N' Roses
Welcome To The Jungle|Guns N' Roses
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
Smells Like Teen Spirit|Nirvana
Come As You Are|Nirvana
Losing My Religion|R.E.M.
Everybody Hurts|R.E.M.
Last Christmas|Wham!
All I Want for Christmas Is You|Mariah Carey
Perfect|Ed Sheeran
Thinking Out Loud|Ed Sheeran
Auld Lang Syne|Robert Burns
I Will Always Love You|Whitney Houston
Respect|Aretha Franklin
Superstition|Stevie Wonder
Isn't She Lovely|Stevie Wonder
Brown Eyed Girl|Van Morrison
Sweet Home Alabama|Lynyrd Skynyrd
Don't Stop Believin'|Journey
Livin' on a Prayer|Bon Jovi
Under Pressure|Queen
Somebody to Love|Queen
Every Breath You Take|The Police
Message in a Bottle|The Police
Englishman In New York|Sting
Waterloo|ABBA
Super Trouper|ABBA
I Want It That Way|Backstreet Boys
Wannabe|Spice Girls
Toxic|Britney Spears
Crazy in Love|Beyoncé
Single Ladies|Beyoncé
Uptown Funk|Mark Ronson
Hey Ya!|The Black Eyed Peas
Drop It Like It's Hot|Snoop Dogg
Yeah!|Usher
Lose Yourself|Eminem
Without Me|Eminem
Waterfalls|TLC
No Scrubs|TLC
Creep|Radiohead
Wonderwall|Oasis
Seven Nation Army|The White Stripes
Mr. Brightside|The Killers`;

const localDe = `99 Luftballons|Nena
Irgendwie, irgendwo, irgendwann|Nena
Atemlos durch die Nacht|Helene Fischer
Phänomen|Helene Fischer
Roller|Apache 207
Komet|Udo Lindenberg a Apache 207
Wildberry Lillet|Nina Chuba
Friesenjung|Ski Aggu, Joost a Otto Waalkes
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
Ein Kompliment|Sportfreunde Stiller
Applaus, Applaus|Sportfreunde Stiller
Lieblingsmensch|Namika
Je ne parle pas français|Namika
Barfuß am Klavier|AnnenMayKantereit
Pocahontas|AnnenMayKantereit
Nur noch kurz die Welt retten|Tim Bendzko
Keine Maschine|Tim Bendzko
Das Beste|Silbermond
Symphonie|Silbermond
Irgendwas bleibt|Silbermond
Durch den Monsun|Tokio Hotel
Schrei|Tokio Hotel
Astronaut|Sido feat. Andreas Bourani
Bilder im Kopf|Peter Fox
Auf uns|Andreas Bourani
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
Marmor, Stein und Eisen bricht|Drafi Deutscher
Skandal im Sperrbezirk|Spider Murphy Gang
Schickeria|Spider Murphy Gang
Du hast|Rammstein
Sonne|Rammstein
Engel|Rammstein
Deutschland|Rammstein
Ein Bett im Kornfeld|Jürgen Drews
Sierra Madre|Schürzenjäger
Wahnsinn|Wolfgang Petry
Verlieben, verloren, vergessen, verzeih'n|Wolfgang Petry
Fliegerlied (So ein schöner Tag)|Donikkl
Ein Stern (der deinen Namen trägt)|DJ Ötzi
Anton aus Tirol|DJ Ötzi
Hey Baby|DJ Ötzi
Bruttosozialprodukt|Geier Sturzflug
Über sieben Brücken musst du gehn|Peter Maffay
Hupf in Gatsch|Georg Danzer
Guten Abend, gut' Nacht|Johannes Brahms
O Tannenbaum|Traditional
Stille Nacht, heilige Nacht|Franz Xaver Gruber
Lass uns gehen|Revolverheld
Halt dich an mir fest|Revolverheld
Emanuela|Fettes Brot
Erfolg ist nicht alles|Cro
Chöre|Mark Forster
Au revoir|Mark Forster
Bauch und Kopf|Mark Forster
Geiles Leben|Glasperlenspiel
Lila Wolken|Marteria
Kids (2 Finger an den Kopf)|Marteria`;

const localEs = `La Bamba|Ritchie Valens
Bailando|Enrique Iglesias
El Perdedor|Enrique Iglesias
Vivir Mi Vida|Marc Anthony
Valió la Pena|Marc Anthony
La Camisa Negra|Juanes
A Dios le Pido|Juanes
Me Enamora|Juanes
Waka Waka (Esto es África)|Shakira
La Tortura|Shakira
Hips Don't Lie|Shakira
Chantaje|Shakira
Mi Gente|J Balvin
Ay Vamos|J Balvin
Pepas|Farruko
Calma|Pedro Capó
Despechá|ROSALÍA
Con Altura|ROSALÍA
Todo de Ti|Rauw Alejandro
La Bachata|Manuel Turizo
Provenza|Karol G
Tusa|Karol G
Bichota|Karol G
Tití Me Preguntó|Bad Bunny
Dákiti|Bad Bunny
Mía|Bad Bunny
Hawái|Maluma
Felices los 4|Maluma
Corazón|Maluma
Robarte un Beso|Carlos Vives
La Bicicleta|Carlos Vives
Ai Se Eu Te Pego|Michel Teló
Guantanamera|Joseíto Fernández
Cielito Lindo|Quirino Mendoza y Cortés
Corazón Partío|Alejandro Sanz
Amiga Mía|Alejandro Sanz
La Flaca|Jarabe de Palo
Depende|Jarabe de Palo
Bonito|Jarabe de Palo
Eres Tú|Mocedades
Amigo|Roberto Carlos
Rayando El Sol|Maná
Clavado En Un Bar|Maná
En El Muelle De San Blas|Maná
Labios Compartidos|Maná
Oye Mi Amor|Maná
Livin' la Vida Loca|Ricky Martin
La Copa de la Vida|Ricky Martin
María|Ricky Martin
El Perdón|Nicky Jam
Hasta el Amanecer|Nicky Jam
Bamboléo|Gipsy Kings
Volare|Gipsy Kings
Danza Kuduro|Don Omar
Gasolina|Daddy Yankee
Con Calma|Daddy Yankee
Querida|Juan Gabriel
Hasta Que Te Conocí|Juan Gabriel
El Rey|Vicente Fernández
Volver, Volver|Vicente Fernández
Bésame Mucho|Consuelo Velázquez
Pedro|Raffaella Carrà
Aserejé|Las Ketchup
Macarena|Los del Río
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
Suavemente|Elvis Crespo
Oye Como Va|Celia Cruz
La Vida Es Un Carnaval|Celia Cruz
El Cantante|Héctor Lavoe`;

const localFr = `Alors on danse|Stromae
Papaoutai|Stromae
Formidable|Stromae
Tous les mêmes|Stromae
Dernière danse|Indila
Tourner dans le vide|Indila
Djadja|Aya Nakamura
Pookie|Aya Nakamura
Copines|Aya Nakamura
Sapés comme jamais|Gims
Bella|Gims
J'me tire|Gims
Est-ce que tu m'aimes ?|Gims
Je veux|Zaz
On ira|Zaz
La vie en rose|Édith Piaf
Non, je ne regrette rien|Édith Piaf
Hymne à l'amour|Édith Piaf
Joe le taxi|Vanessa Paradis
Ça plane pour moi|Plastic Bertrand
Moi... Lolita|Alizée
Avenir|Louane
Jour 1|Louane
Andalouse|Kendji Girac
Color Gitano|Kendji Girac
Les yeux de la mama|Kendji Girac
Tout oublier|Angèle
Balance ton quoi|Angèle
Fever|Dua Lipa a Angèle
Sous le vent|Garou a Céline Dion
Pour que tu m'aimes encore|Céline Dion
S'il suffisait d'aimer|Céline Dion
Je te donne|Jean-Jacques Goldman
Envole-moi|Jean-Jacques Goldman
Il suffira d'un signe|Jean-Jacques Goldman
Champs-Élysées|Joe Dassin
L'été indien|Joe Dassin
Et si tu n'existais pas|Joe Dassin
Les Lacs du Connemara|Michel Sardou
La maladie d'amour|Michel Sardou
Mistral gagnant|Renaud
Laisse béton|Renaud
La Bohème|Charles Aznavour
Emmenez-moi|Charles Aznavour
Hier encore|Charles Aznavour
Ne me quitte pas|Jacques Brel
Le plat pays|Jacques Brel
Amsterdam|Jacques Brel
Désenchantée|Mylène Farmer
Sans contrefaçon|Mylène Farmer
Je l'aime à mourir|Francis Cabrel
Petite Marie|Francis Cabrel
La Corrida|Francis Cabrel
La tribu de Dana|Manau
Belle|Garou
Le lion est mort ce soir|Henri Salvador
Alouette|Traditional
Frère Jacques|Traditional
Au clair de la lune|Traditional
Aïcha|Khaled
C'est la vie|Khaled
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
Allumer le feu|Johnny Hallyday
Que je t'aime|Johnny Hallyday
Le pénitencier|Johnny Hallyday
L'envie|Johnny Hallyday
Quelqu'un m'a dit|Carla Bruni`;

const localPt = `Ai Se Eu Te Pego|Michel Teló
Fugidinha|Michel Teló
Balada|Gusttavo Lima
Tchê Tcherere Tchê Tchê|Gusttavo Lima
Evidências|Chitãozinho & Xororó
Fio de Cabelo|Chitãozinho & Xororó
Garota de Ipanema|Tom Jobim
Mas Que Nada|Jorge Ben Jor
País Tropical|Jorge Ben Jor
Taj Mahal|Jorge Ben Jor
Aquarela|Toquinho
Não Quero Dinheiro|Tim Maia
O Descobridor dos Sete Mares|Tim Maia
Gostava Tanto de Você|Tim Maia
Cheia de Manias|Raça Negra
Anna Júlia|Los Hermanos
A Minha Casinha|Xutos & Pontapés
Não Sou o Único|Xutos & Pontapés
Homem do Leme|Xutos & Pontapés
Contentores|Xutos & Pontapés
Anda Comigo Ver os Aviões|Os Azeitonas
Ó Gente da Minha Terra|Mariza
Quem Me Dera|Mariza
Chuva|Mariza
Andorinhas|Ana Moura
Desfado|Ana Moura
Envolver|Anitta
Show das Poderosas|Anitta
Bang|Anitta
Infiel|Marília Mendonça
Leão|Marília Mendonça
Todo Mundo Vai Sofrer|Marília Mendonça
Apaga a Luz e Toma|Tony Carreira
Sonhos de Menino|Tony Carreira
Mãe Querida|Tony Carreira
Lambada (Chorando Se Foi)|Kaoma
A Banda|Chico Buarque
O Que Será|Chico Buarque
Cochichando|Pixinguinha
Festa|Ivete Sangalo
Sorte Grande|Ivete Sangalo
Poeira|Ivete Sangalo
Dança da Manivela|Asa de Águia
Florentina|Tiririca
Ilariê|Xuxa
Tindolelê|Xuxa
Baianidade Nagô|Banda Mel
Amor I Love You|Marisa Monte
Ainda Bem|Marisa Monte
Velha Infância|Tribalistas
Já Sei Namorar|Tribalistas
Whisky a Go-Go|Roupa Nova
Dona|Roupa Nova
Menina Estás à Janela|Vitorino
Chamar a Música|Sara Tavares
Lusitana Paixão|Dulce Pontes
Canção do Mar|Dulce Pontes
Playback|Carlos Paião
Pó de Arroz|Carlos Paião
Estrela da Tarde|Carlos do Carmo
Lisboa Menina e Moça|Carlos do Carmo
Fado Tropical|Chico Buarque
Desfolhada Portuguesa|Simone de Oliveira
Anjo Selvagem|Santamaria
Dunas|GNR
Pronúncia do Norte|GNR
Sangue Oculto|GNR
Milla|Netinho
Tempo de Alegria|Ivete Sangalo
Burguesinha|Seu Jorge
Mina do Condomínio|Seu Jorge
Ex Mai Love|Thiaguinho
Camaro Amarelo|Munhoz & Mariano
Lepo Lepo|Psirico`;

const tsContent = \`import type { AppLanguage } from "../i18n/LanguageProvider";
import type { SongCard } from "./teamBattleExtras";

function parseSongs(library: string): SongCard[] {
  return library.trim().split("\\n").map((rawLine, index) => {
    const line = rawLine.trim();
    const parts = line.split("|");
    if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
      throw new Error(\\\`Neplatný riadok hudobného katalógu \${index + 1}: \${rawLine}\\\`);
    }
    return { title: parts[0].trim(), artist: parts[1].trim() };
  });
}

const WORLD_HITS = parseSongs(\\\`\n\${worldHits}\n\\\`);

const LOCAL_HITS: Record<AppLanguage, SongCard[]> = {
  sk: parseSongs(\\\`\n\${localSk}\n\\\`),
  en: parseSongs(\\\`\n\${localEn}\n\\\`),
  de: parseSongs(\\\`\n\${localDe}\n\\\`),
  es: parseSongs(\\\`\n\${localEs}\n\\\`),
  fr: parseSongs(\\\`\n\${localFr}\n\\\`),
  pt: parseSongs(\\\`\n\${localPt}\n\\\`),
};

function songId(song: SongCard) {
  return \\\`\${song.title.toLocaleLowerCase()}|\${song.artist.toLocaleLowerCase()}\\\`;
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
\`;

fs.writeFileSync('src/data/localizedSongs.ts', tsContent);
console.log('Successfully generated complete localizedSongs.ts');
