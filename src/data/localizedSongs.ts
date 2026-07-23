import type { AppLanguage } from "../i18n/LanguageProvider";
import type { SongCard } from "./teamBattleExtras";

const SONGS_BY_LANGUAGE: Record<AppLanguage, string> = {
  sk: `
Pistácie|Calin feat. Sofian Medjmedj
Safír|Calin a Viktor Sheen
Dívej|Calin a Viktor Sheen
Suave|Calin
Hannah Montana|Calin
Praha/Vídeň|Calin
Syndrom|Viktor Sheen
Cígo a káva|Viktor Sheen feat. Saul
Pátky|Viktor Sheen
Rozdělený světy|Viktor Sheen
Stíny|Viktor Sheen
Alucard|Viktor Sheen
Vítej mezi náma|Calin feat. STEIN27
Slzy|Sofian Medjmedj a Ben Cristovao
MONA LISA|Sofian Medjmedj
Omluva|Ben Cristovao
Bomby|Ben Cristovao
Sweet Chilli|Ben Cristovao
Padam|Ben Cristovao
Pápá|Ben Cristovao
Ta bílá ti sluší|Marek Ztracený
Originál|Marek Ztracený
Moje milá|Marek Ztracený
To se mi líbí|Marek Ztracený
Anděl|Mirai
Když nemůžeš, tak přidej|Mirai
Vedle tebe usínám|Mirai
Chci tančit|Mirai
Volám|Mirai
Co bude pak|Kryštof
Hned teď|Kryštof
Zůstaň tu se mnou|Kryštof
Ty a já|Kryštof
Cesta|Kryštof a Tomáš Klus
Mám chuť zlobit|Chinaski
Každý ráno|Chinaski
Víno|Chinaski
Slovenský klín|Chinaski
Tělo|Ewa Farna
Na ostří nože|Ewa Farna
Vánoce na míru|Ewa Farna
Boky jako skříň|Ewa Farna
Dobré ráno, milá|David Stypka a Ewa Farna
Plamen|Kateřina Marie Tichá
Zničená zem|Kateřina Marie Tichá
Moravo|Vesna a Ego
My Sister's Crown|Vesna
Dokola|Vesna
Proměna|Lake Malawi
Friend of a Friend|Lake Malawi
Život je krásný|Kryštof
Síla starejch vín|Škwor
Svaz českých bohémů|Wohnout
Tabáček|Chinaski
Půlnoční|Václav Neckář a Umakart
V blbým věku|Xindl X
Cudzinka v tvojej zemi|Xindl X a Mirka Miškechová
Mám ťa rád|Adam Ďurica
Neľutujem|Adam Ďurica
Mandolína|Adam Ďurica
Naše hriechy|Adam Ďurica a Emma Drobná
Zatancuj si so mnou|Adam Ďurica
Všade tam, kde si|Peter Bič Project
Skúšame sa nájsť|Peter Bič Project
Málo|Peter Bič Project
Len sa smej|Peter Bič Project
Maky|Peter Bič Project
V dolinách|Peter Bič Project
Try|Emma Drobná
Words|Emma Drobná
Demons|Emma Drobná
Feeling|Celeste Buckingham
Run Run Run|Celeste Buckingham
Crushin' My Fairytale|Celeste Buckingham
Unpredictable|Celeste Buckingham
Spomaľ|Peha
Horehronie|Kristína
Sympatie|Sima
Spolu|Sima
Forever Young|Sima
V oblakoch|Sima
Všetko dobre dopadne|Kali
Všetko má svoj čas|Kali
Navždy|Kali
Jazero|Kali
Žijeme len raz|Ego
Keď jazdíme my|Ego
Príbeh|Tina a Rytmus
Body to Body|Separ feat. French Montana a Peter Pann
Sunset|Separ feat. Jerry Lee a PTK
NENI STRE$SE|Pil C, Luca Brassi10x a Separ
Povedz mi|Alan Murin
Do rúk|Alan Murin
Domov|Alan Murin
Anjel|Erik Šulc a Neraev
Mám pocit|Yael
Vďaka ti|Yael
Hypnotized|Emma Drobná
Nádej|Mária Čírová
Unikát|Mária Čírová
Mám ťa|Katarína Knechtová
Pokoj v duši|Jana Kirschner
Bude mi ľahko|Jana Kirschner
Opri sa o mňa|IMT Smile
Cesty II. triedy|IMT Smile
`,
  en: `
APT.|ROSÉ a Bruno Mars
Die With A Smile|Lady Gaga a Bruno Mars
BIRDS OF A FEATHER|Billie Eilish
Beautiful Things|Benson Boone
Espresso|Sabrina Carpenter
Please Please Please|Sabrina Carpenter
Taste|Sabrina Carpenter
Good Luck, Babe!|Chappell Roan
Pink Pony Club|Chappell Roan
Too Sweet|Hozier
Stargazing|Myles Smith
Ordinary|Alex Warren
The Emptiness Machine|Linkin Park
Messy|Lola Young
That's So True|Gracie Abrams
I Had Some Help|Post Malone feat. Morgan Wallen
A Bar Song (Tipsy)|Shaboozey
Fortnight|Taylor Swift feat. Post Malone
Cruel Summer|Taylor Swift
Anti-Hero|Taylor Swift
Flowers|Miley Cyrus
As It Was|Harry Styles
Water|Tyla
Lose Control|Teddy Swims
Greedy|Tate McRae
Training Season|Dua Lipa
Houdini|Dua Lipa
Dance The Night|Dua Lipa
Texas Hold 'Em|Beyoncé
we can't be friends|Ariana Grande
yes, and?|Ariana Grande
Stick Season|Noah Kahan
End of Beginning|Djo
I Like The Way You Kiss Me|Artemas
Sailor Song|Gigi Perez
Back To Friends|sombr
Undressed|sombr
Million Dollar Baby|Tommy Richman
Not Like Us|Kendrick Lamar
Luther|Kendrick Lamar a SZA
Kill Bill|SZA
Saturn|SZA
Fortnight|Taylor Swift feat. Post Malone
Vampire|Olivia Rodrigo
Bad Idea Right?|Olivia Rodrigo
Drivers License|Olivia Rodrigo
Happier Than Ever|Billie Eilish
What Was I Made For?|Billie Eilish
Bad Guy|Billie Eilish
Blinding Lights|The Weeknd
Save Your Tears|The Weeknd
Die For You|The Weeknd
Starboy|The Weeknd
Levitating|Dua Lipa
Don't Start Now|Dua Lipa
Shape of You|Ed Sheeran
Perfect|Ed Sheeran
Bad Habits|Ed Sheeran
Shivers|Ed Sheeran
Someone You Loved|Lewis Capaldi
Before You Go|Lewis Capaldi
Someone Like You|Adele
Easy On Me|Adele
Rolling in the Deep|Adele
Uptown Funk|Mark Ronson feat. Bruno Mars
Locked Out of Heaven|Bruno Mars
That's What I Like|Bruno Mars
Counting Stars|OneRepublic
I Ain't Worried|OneRepublic
Believer|Imagine Dragons
Thunder|Imagine Dragons
Enemy|Imagine Dragons a JID
Radioactive|Imagine Dragons
Heat Waves|Glass Animals
Stay|The Kid LAROI a Justin Bieber
Love Yourself|Justin Bieber
Sorry|Justin Bieber
Señorita|Shawn Mendes a Camila Cabello
Havana|Camila Cabello
Unholy|Sam Smith a Kim Petras
I'm Good (Blue)|David Guetta a Bebe Rexha
Titanium|David Guetta feat. Sia
Cheap Thrills|Sia
Chandelier|Sia
Dance Monkey|Tones and I
Old Town Road|Lil Nas X
Industry Baby|Lil Nas X a Jack Harlow
Sunroof|Nicky Youre a dazy
Unstoppable|Sia
Shallow|Lady Gaga a Bradley Cooper
Poker Face|Lady Gaga
Viva La Vida|Coldplay
A Sky Full of Stars|Coldplay
Something Just Like This|The Chainsmokers a Coldplay
Closer|The Chainsmokers feat. Halsey
Wake Me Up|Avicii
The Nights|Avicii
Counting Stars|OneRepublic
Riptide|Vance Joy
Another Love|Tom Odell
The Night We Met|Lord Huron
Daylight|David Kushner
Golden Hour|JVKE
Stressed Out|Twenty One Pilots
Memories|Maroon 5
Flowers Need Rain|Preston Pablo a Banx & Ranx
`,
  de: `
Wunder|Ayliva a Apache 207
Komet|Udo Lindenberg a Apache 207
Bauch Beine Po|Shirin David
Zeit, dass sich was dreht|$oho Bani, Herbert Grönemeyer a Ericson
9 bis 9|SIRA, Bausa a badchieff
Vempa|Fourty a Bausa
Wackelkontakt|Oimara
Wildberry Lillet|Nina Chuba
Mangos mit Chili|Nina Chuba
Fata Morgana|Nina Chuba
Friesenjung|Ski Aggu, Joost a Otto Waalkes
Party Sahne|Ski Aggu feat. Endzone a Ericson
Deutschland|Ski Aggu
Mietfrei|Ski Aggu
Roller|Apache 207
200 km/h|Apache 207
Bläulich|Apache 207
Breaking Your Heart|Apache 207
Neunzig|Apache 207
Sie weiß|Ayliva feat. Mero
Deine Schuld|Ayliva
Lieb mich|Ayliva
Bei Nacht|Ayliva
Ich darf das|Shirin David
Gib ihm|Shirin David
Lieben wir|Shirin David
Benzin|Kontra K
Erfolg ist kein Glück|Kontra K
Follow|Kontra K a Sido a Leony
Au revoir|Mark Forster feat. Sido
Chöre|Mark Forster
194 Länder|Mark Forster
Übermorgen|Mark Forster
Sowieso|Mark Forster
Traum|Cro
Einmal um die Welt|Cro
Bye Bye|Cro
Easy|Cro
Nie mehr Fastelovend|Querbeat
Je ne parle pas français|Namika
Lieblingsmensch|Namika
Alles an dir|Laith Al-Deen
Leiser|LEA
110|Capital Bra, Samra a LEA
Immer wenn wir uns sehn|LEA a Cyril
Schwarz|LEA
Was du Liebe nennst|Bausa
Mary|Bausa
Ohne mein Team|Bonez MC a RAF Camora
500 PS|Bonez MC a RAF Camora
Palmen aus Plastik|Bonez MC a RAF Camora
Primo|RAF Camora
Tage wie diese|Die Toten Hosen
Alles aus Liebe|Die Toten Hosen
Haus am See|Peter Fox
Zukunft Pink|Peter Fox feat. Inéz
Schwarz zu Blau|Peter Fox
Ein Kompliment|Sportfreunde Stiller
Applaus, Applaus|Sportfreunde Stiller
80 Millionen|Max Giesinger
Wenn sie tanzt|Max Giesinger
Auf das, was da noch kommt|LOTTE a Max Giesinger
Geiles Leben|Glasperlenspiel
Royals & Kings|Glasperlenspiel feat. Summer Cem
An guten Tagen|Johannes Oerding
Kreise|Johannes Oerding
Cordula Grün|Josh.
Barfuß am Klavier|AnnenMayKantereit
Pocahontas|AnnenMayKantereit
Oft gefragt|AnnenMayKantereit
Hurra die Welt geht unter|K.I.Z. feat. Henning May
Ich war noch niemals in New York|Udo Jürgens
Atemlos durch die Nacht|Helene Fischer
Regenbogenfarben|Kerstin Ott
Unter deiner Flagge|Unheilig
Geboren um zu leben|Unheilig
Wolke 4|Philipp Dittberner a Marv
Das ist dein Leben|Philipp Dittberner
Wenn Worte meine Sprache wären|Tim Bendzko
Nur noch kurz die Welt retten|Tim Bendzko
Keine Maschine|Tim Bendzko
Symphonie|Silbermond
Das Beste|Silbermond
Leichtes Gepäck|Silbermond
Ich lass für dich das Licht an|Revolverheld
Halt dich an mir fest|Revolverheld feat. Marta Jandová
Lass uns gehen|Revolverheld
Stadt|Cassandra Steen feat. Adel Tawil
Lieder|Adel Tawil
Ist da jemand|Adel Tawil
Vom selben Stern|Ich + Ich
So soll es bleiben|Ich + Ich
Pflaster|Ich + Ich
Nur ein Wort|Wir sind Helden
Denkmal|Wir sind Helden
Perfekte Welle|Juli
Geile Zeit|Juli
Durch den Monsun|Tokio Hotel
An Tagen wie diesen|Fettes Brot
Jein|Fettes Brot
Astronaut|Sido feat. Andreas Bourani
Bilder im Kopf|Sido
Auf uns|Andreas Bourani
Nur in meinem Kopf|Andreas Bourani
`,
  es: `
Si Antes Te Hubiera Conocido|Karol G
Verano Rosa|Karol G a Feid
Papasito|Karol G
Provenza|Karol G
TQG|Karol G a Shakira
MAMIII|Becky G a Karol G
Gran Vía|Quevedo a Aitana
Quédate|Bizarrap a Quevedo
Columbia|Quevedo
Playa del Inglés|Quevedo a Myke Towers
Mon Amour Remix|zzoilo a Aitana
Las Babys|Aitana
Los Ángeles|Aitana
En El Coche|Aitana
Formentera|Aitana a Nicki Nicole
Despechá|Rosalía
Saoko|Rosalía
Con Altura|Rosalía a J Balvin
Beso|Rosalía a Rauw Alejandro
Todo de Ti|Rauw Alejandro
Desesperados|Rauw Alejandro a Chencho Corleone
Lokera|Rauw Alejandro, Lyanno a Brray
Santa|Rvssian, Rauw Alejandro a Ayra Starr
Tití Me Preguntó|Bad Bunny
Me Porto Bonito|Bad Bunny a Chencho Corleone
Ojitos Lindos|Bad Bunny a Bomba Estéreo
Moscow Mule|Bad Bunny
DtMF|Bad Bunny
NUEVAYoL|Bad Bunny
Yonaguni|Bad Bunny
La Bachata|Manuel Turizo
El Merengue|Marshmello a Manuel Turizo
Vagabundo|Sebastián Yatra, Manuel Turizo a Beéle
Tacones Rojos|Sebastián Yatra
Pareja del Año|Sebastián Yatra a Myke Towers
Una Noche Sin Pensar|Sebastián Yatra
LALA|Myke Towers
La Falda|Myke Towers
ADIVINO|Myke Towers a Bad Bunny
Mi Gente|J Balvin a Willy William
Qué Más Pues?|J Balvin a Maria Becerra
Rojo|J Balvin
Pepas|Farruko
Calma Remix|Pedro Capó a Farruko
Felices los 4|Maluma
Hawái|Maluma
Coco Loco|Maluma
Vivir Mi Vida|Marc Anthony
Flor Pálida|Marc Anthony
Bailando|Enrique Iglesias, Descemer Bueno a Gente de Zona
Súbeme la Radio|Enrique Iglesias
Duele el Corazón|Enrique Iglesias a Wisin
La Bicicleta|Carlos Vives a Shakira
Monotonía|Shakira a Ozuna
Te Felicito|Shakira a Rauw Alejandro
BZRP Music Sessions #53|Shakira a Bizarrap
Soltera|Shakira
La Tortura|Shakira a Alejandro Sanz
Vente Pa' Ca|Ricky Martin a Maluma
Despacito|Luis Fonsi a Daddy Yankee
Échame La Culpa|Luis Fonsi a Demi Lovato
Tusa|Karol G a Nicki Minaj
Miénteme|TINI a Maria Becerra
Automático|Maria Becerra
Corazón Vacío|Maria Becerra
La Triple T|TINI
Cupido|TINI
Nochentera|Vicco
La Reina|Lola Índigo
El Tonto|Lola Índigo a Quevedo
Mujer Bruja|Lola Índigo a Mala Rodríguez
Potra Salvaje|Isabel Aaiún
Zorra|Nebulossa
La Fama|Rosalía feat. The Weeknd
Motomami|Rosalía
Normal|Feid
Classy 101|Feid a Young Miko
Luna|Feid a ATL Jacob
Perro Negro|Bad Bunny a Feid
La Inocente|Mora a Feid
512|Mora a Jhayco
Una Vez|Bad Bunny a Mora
Hey Mor|Ozuna a Feid
Caramelo|Ozuna
Se Preparó|Ozuna
Dile Que Tú Me Quieres|Ozuna
Criminal|Natti Natasha a Ozuna
Sin Pijama|Becky G a Natti Natasha
Mayores|Becky G a Bad Bunny
Mamiii|Becky G a Karol G
Miénteme|TINI a Maria Becerra
Oye|TINI a Sebastián Yatra
Mi Mala Remix|Mau y Ricky, Karol G, Becky G, Leslie Grace a Lali
Desconocidos|Mau y Ricky, Manuel Turizo a Camilo
Vida de Rico|Camilo
Favorito|Camilo
Tutu|Camilo a Pedro Capó
Índigo|Camilo a Evaluna Montaner
Robarte un Beso|Carlos Vives a Sebastián Yatra
La Gozadera|Gente de Zona a Marc Anthony
Borro Cassette|Maluma
China|Anuel AA, Daddy Yankee, Karol G, Ozuna a J Balvin
Ella Quiere Beber Remix|Anuel AA a Romeo Santos
`,
  fr: `
Ceux qu'on était|Pierre Garnier
Nous on sait|Pierre Garnier
Chaque seconde|Pierre Garnier a M. Pokora
Recommence-moi|Santa
Popcorn salé|Santa
La différence|Santa
Imagine|Carbonne
Petit génie|Jungeli, Imen Es, Alonzo, Abou Debeing a Lossa
Spider|Gims a Dystinct
Sois pas timide|Gims
Ciel|Gims
Sapés comme jamais|Gims feat. Niska
Bella|Gims
J'me tire|Gims
Djadja|Aya Nakamura
Pookie|Aya Nakamura
Copines|Aya Nakamura
Hypé|Aya Nakamura
Dégaine|Aya Nakamura feat. Damso
Jolie nana|Aya Nakamura
Ma meilleure ennemie|Stromae a Pomme
Alors on danse|Stromae
Papaoutai|Stromae
Santé|Stromae
L'enfer|Stromae
Formidable|Stromae
Tout l'univers|Gjon's Tears
La symphonie des éclairs|Zaho de Sagazan
Modern Love|Zaho de Sagazan
Amour plastique|Videoclub
Dernière danse|Indila
Tourner dans le vide|Indila
Love Story|Indila
Ainsi bas la vida|Indila
Je te laisserai des mots|Patrick Watson
La grenade|Clara Luciani
Respire encore|Clara Luciani
Le reste|Clara Luciani
Tout oublier|Angèle feat. Roméo Elvis
Balance ton quoi|Angèle
Bruxelles je t'aime|Angèle
Oui ou non|Angèle
Flou|Angèle
Jour 1|Louane
Avenir|Louane
Secret|Louane
La pluie|Louane
Maman|Louane
Andalouse|Kendji Girac
Color Gitano|Kendji Girac
Tiago|Kendji Girac
Desperado|Kendji Girac
Évidemment|La Zarra
Tu t'en iras|La Zarra
Voilà|Barbara Pravi
Mon amour|Slimane
Avant toi|Vitaa a Slimane
Ça va ça vient|Vitaa a Slimane
Je te le donne|Vitaa a Slimane
Un homme|Jérémy Frerot
On dirait|Amir
J'ai cherché|Amir
Longtemps|Amir
Rétine|Amir
Compliqué|Dadju
Reine|Dadju
Jaloux|Dadju
Mon soleil|Dadju a Anitta
Dieu merci|Dadju a Tiakola
Mélodie|Ronisia
Tout va bien|Alonzo feat. Ninho a Naps
La kiffance|Naps
Jefe|Ninho
Maman ne le sait pas|Ninho feat. Niska
À nos souvenirs|Trois Cafés Gourmands
On était beau|Louane
Si t'étais là|Louane
Les planètes|M. Pokora
Tombé|M. Pokora
Juste une photo de toi|M. Pokora
Jaloux|Dadju
Bob Marley|Dadju
I Love You|Dadju feat. Tayc
Le temps|Tayc
N'y pense plus|Tayc
Dodo|Tayc
Comme toi|Tayc
La même|Gims a Vianney
Beau-papa|Vianney
Je m'en vais|Vianney
Pas là|Vianney
Pour de vrai|Vianney
La recette|Slimane
Des milliers de je t'aime|Slimane
Ça ira|Joyce Jonathan
Caractère|Joyce Jonathan
J'ai demandé à la lune|Indochine
Nos célébrations|Indochine
Trois nuits par semaine|Indochine
Un jour au mauvais endroit|Calogero
Si seulement je pouvais lui manquer|Calogero
Je joue de la musique|Calogero
En apesanteur|Calogero
Sous le vent|Garou a Céline Dion
`,
  pt: `
Deslocado|NAPA
Pôr do Sol|Vizinhos
Amar Pela Metade|Calema
A Nossa Vez|Calema
Te Amo|Calema
Onde Anda|Calema
Vai|Calema
Maria Joana|Nuno Ribeiro, Calema a Mariza
Essa Mulher|Nuno Ribeiro
Não Devia|Nuno Ribeiro
Longe|Nuno Ribeiro
Despedida de Solteira|Bárbara Tinoco
Sei Lá|Bárbara Tinoco
Antes Dela Dizer Que Sim|Bárbara Tinoco
Chamada Não Atendida|Bárbara Tinoco
Não Gosta|Bárbara Bandeira
Onde Vais|Bárbara Bandeira a Carminho
Como Tu|Bárbara Bandeira a Ivandro
Lua|Ivandro
Moça|Ivandro
Chakras|Ivandro
Interestelar|Plutonio
Somos Iguais|Plutonio
Café da Manhã|Plutonio
Meu Deus|Plutonio
Casa|D.A.M.A
Oquelávai|D.A.M.A
Era Eu|D.A.M.A
Balada do Desajeitado|D.A.M.A
Trevo (Tu)|ANAVITÓRIA a Tiago Iorc
Amor de Ferro|Diogo Piçarra a Pedro Abrunhosa
Tu E Eu|Diogo Piçarra
História|Diogo Piçarra
Monarquia|Diogo Piçarra
A Vida Toda|Carolina Deslandes
Avião de Papel|Carolina Deslandes a Rui Veloso
Não Me Importo|Carolina Deslandes
Tento Na Língua|Carolina Deslandes a Iolanda
Grito|Iolanda
Quem Me Dera|Mariza
Melhor de Mim|Mariza
Ó Gente da Minha Terra|Mariza
Andorinhas|Ana Moura
Dia de Folga|Ana Moura
Desfado|Ana Moura
Com Um Brilhozinho Nos Olhos|Sérgio Godinho
Anda Comigo Ver os Aviões|Os Azeitonas
Ray-Dee-Oh|Os Azeitonas
Não Sou o Único|Xutos & Pontapés
A Minha Casinha|Xutos & Pontapés
Contentores|Xutos & Pontapés
Chico|Luísa Sonza
Braba|Luísa Sonza
Penhasco|Luísa Sonza
Campo de Morango|Luísa Sonza
Envolver|Anitta
Mil Veces|Anitta
Girl From Rio|Anitta
Bellakeo|Peso Pluma a Anitta
Tubarões|Diego & Victor Hugo
P do Pecado|Grupo Menos É Mais a Simone Mendes
Coração Partido|Grupo Menos É Mais
Erro Gostoso|Simone Mendes
Dois Tristes|Simone Mendes
Me Ama Ou Me Larga|Simone Mendes
Nosso Quadro|Ana Castela
Solteiro Forçado|Ana Castela
Canudinho|Gusttavo Lima a Ana Castela
Última Saudade|Henrique & Juliano
Liberdade Provisória|Henrique & Juliano
Cuida Bem Dela|Henrique & Juliano
Apaga Apaga Apaga|Danilo e Davi
Saudade Burra|Lauana Prado a Simone Mendes
Escrito nas Estrelas|Lauana Prado
Leão|Marília Mendonça
Infiel|Marília Mendonça
Todo Mundo Vai Sofrer|Marília Mendonça
Ai Se Eu Te Pego|Michel Teló
Balada|Gusttavo Lima
Bloqueado|Gusttavo Lima
Ficha Limpa|Gusttavo Lima
Propaganda|Jorge & Mateus
Sosseguei|Jorge & Mateus
Todo Seu|Jorge & Mateus
Largado às Traças|Zé Neto & Cristiano
Notificação Preferida|Zé Neto & Cristiano
Você Beberia ou Não Beberia?|Zé Neto & Cristiano
Arranhão|Henrique & Juliano
A Maior Saudade|Henrique & Juliano
De Quem É a Culpa?|Marília Mendonça
Supera|Marília Mendonça
Medo Bobo|Maiara & Maraisa
10%|Maiara & Maraisa
Narcisista|Maiara & Maraisa
Bombonzinho|Israel & Rodolffo a Ana Castela
Roça em Mim|Zé Felipe, Ana Castela a Luan Pereira
SentaDONA Remix|Luísa Sonza, Davi Kneip, DJ Gabriel do Borel a MC Frog
Modo Turbo|Luísa Sonza, Pabllo Vittar a Anitta
Amor de Que|Pabllo Vittar
K.O.|Pabllo Vittar
Sua Cara|Major Lazer, Anitta a Pabllo Vittar
Pesadão|IZA feat. Marcelo Falcão
Dona de Mim|IZA
Brisa|IZA
Meu Abrigo|Melim
Ouvi Dizer|Melim
Partilhar|Rubel
`,
};

function parseSongLibrary(library: string): SongCard[] {
  return library.trim().split("\n").map((line) => {
    const separator = line.indexOf("|");
    return { title: line.slice(0, separator).trim(), artist: line.slice(separator + 1).trim() };
  }).filter((song) => song.title && song.artist);
}

const LOCALIZED_SONG_CARDS = Object.fromEntries(
  Object.entries(SONGS_BY_LANGUAGE).map(([language, library]) => {
    const parsed = parseSongLibrary(library);
    const unique = Array.from(new Map(parsed.map((song) => [`${song.title.toLocaleLowerCase()}|${song.artist.toLocaleLowerCase()}`, song])).values());
    return [language, unique];
  }),
) as Record<AppLanguage, SongCard[]>;

export function getSongCardsForLanguage(language: AppLanguage): SongCard[] {
  return LOCALIZED_SONG_CARDS[language];
}

export const SONG_COUNTS_BY_LANGUAGE = Object.fromEntries(
  Object.entries(LOCALIZED_SONG_CARDS).map(([language, songs]) => [language, songs.length]),
) as Record<AppLanguage, number>;
