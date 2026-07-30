import type { AppLanguage } from "../i18n/LanguageProvider";

export type LocalizedTruthOrDareCard = Record<AppLanguage, string>;

export const TRUTH_OR_DARE_CARD_COUNT = 1000;

const LANGUAGES: readonly AppLanguage[] = ["sk", "en", "de", "es", "fr", "pt"];

type Topic = Record<AppLanguage, string>;

const topic = (sk: string, en: string, de: string, es: string, fr: string, pt: string): Topic => ({ sk, en, de, es, fr, pt });

// These are real, familiar social-game subjects. Every row keeps the same topic
// in all six languages, which preserves card order and meaning across decks.
const TOPICS: readonly Topic[] = [
  topic("prvom dni v škole", "your first day at school", "deinen ersten Schultag", "tu primer día de clase", "ton premier jour d'école", "o teu primeiro dia de escola"),
  topic("najťažšom teste", "your hardest test", "deinen schwierigsten Test", "tu examen más difícil", "ton contrôle le plus difficile", "o teu teste mais difícil"),
  topic("školskej prestávke", "a school break", "einer Schulpause", "el recreo", "une récréation", "um intervalo na escola"),
  topic("školskom výlete", "a school trip", "einem Schulausflug", "una excursión escolar", "une sortie scolaire", "uma visita de estudo"),
  topic("prezentácii pred triedou", "giving a presentation to the class", "einem Referat vor der Klasse", "una presentación ante la clase", "un exposé devant la classe", "uma apresentação à turma"),
  topic("zabudnutej domácej úlohe", "forgetting homework", "vergessenen Hausaufgaben", "olvidar los deberes", "un devoir oublié", "ter esquecido os trabalhos de casa"),
  topic("obľúbenom učiteľovi", "a favourite teacher", "einer Lieblingslehrkraft", "un profesor favorito", "un professeur préféré", "um professor favorito"),
  topic("spoločnom projekte", "a group project", "einem Gruppenprojekt", "un proyecto en grupo", "un projet de groupe", "um trabalho de grupo"),
  topic("prvom pracovnom dni", "your first day at work", "deinen ersten Arbeitstag", "tu primer día de trabajo", "ton premier jour de travail", "o teu primeiro dia de trabalho"),
  topic("pracovnom pohovore", "a job interview", "einem Vorstellungsgespräch", "una entrevista de trabajo", "un entretien d'embauche", "uma entrevista de emprego"),
  topic("porade", "a meeting", "einer Besprechung", "una reunión", "une réunion", "uma reunião"),
  topic("prestávke na kávu", "a coffee break", "einer Kaffeepause", "una pausa para el café", "une pause-café", "uma pausa para café"),
  topic("dôležitom e-maile", "an important email", "einer wichtigen E-Mail", "un correo importante", "un e-mail important", "um e-mail importante"),
  topic("spolupráci s kolegami", "working with colleagues", "der Zusammenarbeit mit Kolleginnen und Kollegen", "trabajar con compañeros", "travailler avec des collègues", "trabalhar com colegas"),
  topic("ceste autobusom", "a bus ride", "einer Busfahrt", "un viaje en autobús", "un trajet en bus", "uma viagem de autocarro"),
  topic("ceste vlakom", "a train journey", "einer Zugfahrt", "un viaje en tren", "un trajet en train", "uma viagem de comboio"),
  topic("prvom lete lietadlom", "your first flight", "deinem ersten Flug", "tu primer vuelo", "ton premier vol", "o teu primeiro voo"),
  topic("zmeškanom spoji", "missing a connection", "einem verpassten Anschluss", "perder una conexión", "rater une correspondance", "perder uma ligação"),
  topic("balení kufra", "packing a suitcase", "dem Kofferpacken", "hacer la maleta", "faire une valise", "fazer a mala"),
  topic("hľadaní cesty v novom meste", "finding your way in a new city", "der Orientierung in einer neuen Stadt", "orientarte en una ciudad nueva", "te repérer dans une nouvelle ville", "orientar-te numa cidade nova"),
  topic("dovolenke pri vode", "a holiday by the water", "einem Urlaub am Wasser", "unas vacaciones junto al agua", "des vacances au bord de l'eau", "férias junto à água"),
  topic("turistike v horách", "a hike in the mountains", "einer Wanderung in den Bergen", "una excursión por la montaña", "une randonnée en montagne", "uma caminhada na montanha"),
  topic("stanovaní", "camping", "dem Zelten", "acampando", "le camping", "acampar"),
  topic("návšteve nového mesta", "visiting a new city", "dem Besuch einer neuen Stadt", "visitar una ciudad nueva", "visiter une nouvelle ville", "visitar uma cidade nova"),
  topic("najlepšom kamarátovi", "your best friend", "deinem besten Freund oder deiner besten Freundin", "tu mejor amigo", "ton meilleur ami", "o teu melhor amigo"),
  topic("spoločnom vtipe", "an inside joke", "einem gemeinsamen Witz", "una broma entre amigos", "une blague entre amis", "uma piada entre amigos"),
  topic("skupinovom chate", "a group chat", "einem Gruppenchat", "un chat de grupo", "une discussion de groupe", "um chat de grupo"),
  topic("nečakanom komplimente", "an unexpected compliment", "einem unerwarteten Kompliment", "un cumplido inesperado", "un compliment inattendu", "um elogio inesperado"),
  topic("spontánnom pláne", "a spontaneous plan", "einem spontanen Plan", "un plan espontaneo", "un plan spontané", "um plano espontâneo"),
  topic("rodinnej večeri", "a family dinner", "einem Familienessen", "una cena familiar", "un dîner en famille", "um jantar em família"),
  topic("rodinnej tradícii", "a family tradition", "einer Familientradition", "una tradición familiar", "une tradition familiale", "uma tradição familiar"),
  topic("darčeku pre niekoho blízkeho", "a gift for someone close to you", "einem Geschenk für eine nahestehende Person", "un regalo para alguien cercano", "un cadeau pour quelqu'un de proche", "um presente para alguém próximo"),
  topic("oslave narodenín", "a birthday party", "einer Geburtstagsfeier", "una fiesta de cumpleaños", "une fête d'anniversaire", "uma festa de aniversário"),
  topic("spoločnej fotografii", "a group photo", "einem gemeinsamen Foto", "una foto de grupo", "une photo de groupe", "uma fotografia de grupo"),
  topic("obľúbenom filme", "a favourite film", "einem Lieblingsfilm", "una película favorita", "un film préféré", "um filme favorito"),
  topic("filmovej postave", "a film character", "einer Filmfigur", "un personaje de película", "un personnage de film", "uma personagem de filme"),
  topic("smiešnej scéne", "a funny scene", "einer lustigen Szene", "una escena divertida", "une scène drôle", "uma cena engraçada"),
  topic("návšteve kina", "going to the cinema", "einem Kinobesuch", "ir al cine", "aller au cinéma", "ir ao cinema"),
  topic("seriálovom maratóne", "a series marathon", "einem Serienmarathon", "un maratón de series", "un marathon de séries", "uma maratona de séries"),
  topic("pesničke z detstva", "a song from childhood", "einem Lied aus deiner Kindheit", "una canción de tu infancia", "une chanson de ton enfance", "uma música da tua infância"),
  topic("koncerte", "a concert", "einem Konzert", "un concierto", "un concert", "um concerto"),
  topic("spievaní v aute", "singing in the car", "dem Singen im Auto", "cantar en el coche", "chanter en voiture", "cantar no carro"),
  topic("tancovaní bez hudby", "dancing without music", "dem Tanzen ohne Musik", "bailar sin música", "danser sans musique", "dançar sem música"),
  topic("hudobnom nástroji", "a musical instrument", "einem Musikinstrument", "un instrumento musical", "un instrument de musique", "um instrumento musical"),
  topic("obľúbenom jedle", "a favourite food", "einem Lieblingsessen", "una comida favorita", "un plat préféré", "uma comida favorita"),
  topic("varení bez receptu", "cooking without a recipe", "Kochen ohne Rezept", "cocinar sin receta", "cuisiner sans recette", "cozinhar sem receita"),
  topic("pečení koláča", "baking a cake", "dem Backen eines Kuchens", "hornear un pastel", "faire un gâteau", "fazer um bolo"),
  topic("objednávke v reštaurácii", "ordering at a restaurant", "einer Restaurantbestellung", "pedir en un restaurante", "commander au restaurant", "pedir num restaurante"),
  topic("poslednom kúsku pizze", "the last slice of pizza", "dem letzten Stück Pizza", "el último trozo de pizza", "la dernière part de pizza", "a última fatia de pizza"),
  topic("raňajkách na večeru", "having breakfast for dinner", "Frühstück zum Abendessen", "desayunar para cenar", "prendre un petit-déjeuner au dîner", "tomar o pequeno-almoço ao jantar"),
  topic("mobilnom telefóne", "a mobile phone", "einem Handy", "un teléfono móvil", "un téléphone portable", "um telemóvel"),
  topic("zabudnutom hesle", "a forgotten password", "einem vergessenen Passwort", "una contraseña olvidada", "un mot de passe oublié", "uma palavra-passe esquecida"),
  topic("novej aplikácii", "a new app", "einer neuen App", "una aplicación nueva", "une nouvelle application", "uma aplicação nova"),
  topic("pomalom internete", "slow internet", "langsamem Internet", "internet lento", "une connexion lente", "internet lento"),
  topic("online nákupe", "an online purchase", "einem Onlinekauf", "una compra en línea", "un achat en ligne", "uma compra online"),
  topic("videohovore", "a video call", "einem Videoanruf", "una videollamada", "un appel vidéo", "uma videochamada"),
  topic("sociálnej sieti", "a social network", "einem sozialen Netzwerk", "una red social", "un réseau social", "uma rede social"),
  topic("smiešnom meme", "a funny meme", "einem lustigen Meme", "un meme divertido", "un mème drôle", "um meme engraçado"),
  topic("zverejnenej fotografii", "a posted photo", "einem geposteten Foto", "una foto publicada", "une photo publiée", "uma fotografia publicada"),
  topic("obľúbenej hre", "a favourite game", "einem Lieblingsspiel", "un juego favorito", "un jeu préféré", "um jogo favorito"),
  topic("stolovej hre", "a board game", "einem Brettspiel", "un juego de mesa", "un jeu de société", "um jogo de tabuleiro"),
  topic("videohre", "a video game", "einem Videospiel", "un videojuego", "un jeu vidéo", "um videojogo"),
  topic("kvíze", "a quiz", "einem Quiz", "un concurso de preguntas", "un quiz", "um quiz"),
  topic("malej výhre", "a small win", "einem kleinen Sieg", "una pequeña victoria", "une petite victoire", "uma pequena vitória"),
  topic("domácom zvierati", "a pet", "einem Haustier", "una mascota", "un animal de compagnie", "um animal de estimação"),
  topic("stretnutí so psom", "meeting a dog", "einer Begegnung mit einem Hund", "encontrarte con un perro", "rencontrer un chien", "encontrar um cão"),
  topic("mačke susedov", "a neighbour's cat", "der Katze der Nachbarn", "el gato de un vecino", "le chat d'un voisin", "o gato de um vizinho"),
  topic("zvierati v zoo", "an animal at the zoo", "einem Zootier", "un animal del zoológico", "un animal au zoo", "um animal no jardim zoológico"),
  topic("prvej spomienke z detstva", "your first childhood memory", "deiner ersten Kindheitserinnerung", "tu primer recuerdo de infancia", "ton premier souvenir d'enfance", "a tua primeira memória de infância"),
  topic("obľúbenej hračke", "a favourite toy", "einem Lieblingsspielzeug", "un juguete favorito", "un jouet préféré", "um brinquedo favorito"),
  topic("rozprávke z detstva", "a childhood story", "einer Kindheitsgeschichte", "un cuento de tu infancia", "une histoire de ton enfance", "uma história da tua infância"),
  topic("letných prázdninách", "summer holidays", "Sommerferien", "las vacaciones de verano", "les vacances d'été", "as férias de verão"),
  topic("starom albume", "an old photo album", "einem alten Fotoalbum", "un álbum de fotos antiguo", "un vieil album photo", "um álbum de fotografias antigo"),
  topic("trápnom tichu", "an awkward silence", "einer peinlichen Stille", "un silencio incómodo", "un silence gênant", "um silêncio constrangedor"),
  topic("zabudnutom mene", "forgetting a name", "einem vergessenen Namen", "olvidar un nombre", "oublier un prénom", "esquecer um nome"),
  topic("zlej predpovedi", "a wrong prediction", "einer falschen Vorhersage", "una predicción equivocada", "une mauvaise prédiction", "uma previsão errada"),
  topic("nečakanom telefonáte", "an unexpected phone call", "einem unerwarteten Anruf", "una llamada inesperada", "un appel inattendu", "uma chamada inesperada"),
  topic("pokazenom pláne", "a plan that went wrong", "einem schiefgelaufenen Plan", "un plan que salió mal", "un plan qui a mal tourné", "um plano que correu mal"),
  topic("prvom snehu", "the first snow", "dem ersten Schnee", "la primera nieve", "la première neige", "a primeira neve"),
  topic("letnej búrke", "a summer storm", "einem Sommersturm", "una tormenta de verano", "un orage d'été", "uma tempestade de verão"),
  topic("západe slnka", "a sunset", "einem Sonnenuntergang", "una puesta de sol", "un coucher de soleil", "um pôr do sol"),
  topic("dlhej prechádzke", "a long walk", "einem langen Spaziergang", "un paseo largo", "une longue promenade", "um passeio longo"),
  topic("daždivej nedeli", "a rainy Sunday", "einem verregneten Sonntag", "un domingo lluvioso", "un dimanche pluvieux", "um domingo chuvoso"),
  topic("obľúbenom oblečení", "a favourite outfit", "einem Lieblingsoutfit", "un conjunto de ropa favorito", "une tenue préférée", "uma roupa favorita"),
  topic("novom účese", "a new hairstyle", "einer neuen Frisur", "un peinado nuevo", "une nouvelle coiffure", "um penteado novo"),
  topic("nákupe v zľave", "shopping in a sale", "einem Einkauf im Ausverkauf", "comprar en rebajas", "faire les soldes", "comprar em saldos"),
  topic("zrkadle pred odchodom", "the mirror before leaving", "dem Spiegel vor dem Weggehen", "el espejo antes de salir", "le miroir avant de sortir", "o espelho antes de sair"),
  topic("tajnom talente", "a secret talent", "einem geheimen Talent", "un talento secreto", "un talent caché", "um talento secreto"),
  topic("zvládnutej výzve", "overcoming a challenge", "einer gemeisterten Herausforderung", "superar un reto", "relever un défi", "superar um desafio"),
  topic("malom úspechu", "a small achievement", "einem kleinen Erfolg", "un pequeño logro", "une petite réussite", "uma pequena conquista"),
  topic("sne do budúcnosti", "a dream for the future", "einem Zukunftstraum", "un sueño para el futuro", "un rêve pour l'avenir", "um sonho para o futuro"),
  topic("drobnosti, ktorá zlepšila deň", "a small thing that brightened your day", "einer Kleinigkeit, die deinen Tag verschönert hat", "algo pequeño que te alegró el día", "un petit détail qui a illuminé ta journée", "uma pequena coisa que melhorou o teu dia"),
  topic("dobrou radou", "good advice", "einem guten Rat", "un buen consejo", "un bon conseil", "um bom conselho"),
  topic("najlepšom víkende", "your best weekend", "deinem besten Wochenende", "tu mejor fin de semana", "ton meilleur week-end", "o teu melhor fim de semana"),
  topic("voľným popoludním", "a free afternoon", "einem freien Nachmittag", "una tarde libre", "un après-midi libre", "uma tarde livre"),
  topic("vymysleným prekvapením", "a surprise you planned", "einer geplanten Überraschung", "una sorpresa que preparaste", "une surprise que tu as préparée", "uma surpresa que preparaste"),
  topic("najlepšou radou od kamaráta", "the best advice from a friend", "dem besten Rat von einem Freund oder einer Freundin", "el mejor consejo de un amigo", "le meilleur conseil d'un ami", "o melhor conselho de um amigo"),
  topic("športovaní s priateľmi", "playing sport with friends", "Sport mit Freunden", "hacer deporte con amigos", "faire du sport avec des amis", "praticar desporto com amigos"),
  topic("fotografii, ktorá sa vydarila", "a photo that turned out well", "einem gelungenen Foto", "una foto que salió bien", "une photo réussie", "uma fotografia que ficou bem"),
  topic("rannom budíku", "a morning alarm", "einem Morgenwecker", "una alarma matutina", "un réveil du matin", "um despertador de manhã"),
];

const truthTemplates: Record<AppLanguage, readonly ((topic: string) => string)[]> = {
  sk: [
    (value) => `Aká je tvoja najvtipnejšia spomienka spojená s témou „${value}“?`,
    (value) => `Čo ťa pri téme „${value}“ najviac prekvapilo?`,
    (value) => `Čo si sa vďaka téme „${value}“ naučil/a?`,
    (value) => `Čo by si pri téme „${value}“ dnes urobil/a inak?`,
    (value) => `Kto ti pri téme „${value}“ najviac zlepšil náladu?`,
    (value) => `Ktorý detail si pri téme „${value}“ najlepšie pamätáš?`,
    (value) => `Čo bolo pri téme „${value}“ najtrápnejšie, ale dnes sa na tom smeješ?`,
    (value) => `Čo si pri téme „${value}“ podcenil/a?`,
    (value) => `Akú radu by si pri téme „${value}“ dal/a svojmu mladšiemu ja?`,
    (value) => `Čo by si si pri téme „${value}“ s radosťou zopakoval/a?`,
  ],
  en: [
    (value) => `What is your funniest memory connected with “${value}”?`,
    (value) => `What surprised you most about “${value}”?`,
    (value) => `What did you learn from “${value}”?`,
    (value) => `What would you do differently about “${value}” today?`,
    (value) => `Who cheered you up most in connection with “${value}”?`,
    (value) => `Which detail about “${value}” do you remember most clearly?`,
    (value) => `What was most embarrassing about “${value}”, but makes you laugh now?`,
    (value) => `What did you underestimate about “${value}”?`,
    (value) => `What advice about “${value}” would you give your younger self?`,
    (value) => `What would you happily do again in connection with “${value}”?`,
  ],
  de: [
    (value) => `Was ist deine lustigste Erinnerung an „${value}“?`,
    (value) => `Was hat dich an „${value}“ am meisten überrascht?`,
    (value) => `Was hast du durch „${value}“ gelernt?`,
    (value) => `Was würdest du bei „${value}“ heute anders machen?`,
    (value) => `Wer hat dir im Zusammenhang mit „${value}“ am meisten die Laune verbessert?`,
    (value) => `An welches Detail von „${value}“ erinnerst du dich am besten?`,
    (value) => `Was war an „${value}“ am peinlichsten, worüber du heute lachen kannst?`,
    (value) => `Was hast du an „${value}“ unterschätzt?`,
    (value) => `Welchen Rat zu „${value}“ würdest du deinem jüngeren Ich geben?`,
    (value) => `Was würdest du im Zusammenhang mit „${value}“ gern wiederholen?`,
  ],
  es: [
    (value) => `¿Cuál es tu recuerdo más divertido relacionado con «${value}»?`,
    (value) => `¿Qué te sorprendió más de «${value}»?`,
    (value) => `¿Qué aprendiste gracias a «${value}»?`,
    (value) => `¿Qué harías hoy de otra manera respecto a «${value}»?`,
    (value) => `¿Quién te animó más en relación con «${value}»?`,
    (value) => `¿Qué detalle de «${value}» recuerdas mejor?`,
    (value) => `¿Qué fue lo más vergonzoso de «${value}» que ahora te hace reír?`,
    (value) => `¿Qué subestimaste de «${value}»?`,
    (value) => `¿Qué consejo sobre «${value}» le darías a tu yo más joven?`,
    (value) => `¿Qué repetirías encantado en relación con «${value}»?`,
  ],
  fr: [
    (value) => `Quel est ton souvenir le plus drôle lié à « ${value} » ?`,
    (value) => `Qu'est-ce qui t'a le plus surpris à propos de « ${value} » ?`,
    (value) => `Qu'as-tu appris grâce à « ${value} » ?`,
    (value) => `Que ferais-tu aujourd'hui autrement concernant « ${value} » ?`,
    (value) => `Qui t'a le plus remonté le moral en lien avec « ${value} » ?`,
    (value) => `De quel détail de « ${value} » te souviens-tu le mieux ?`,
    (value) => `Qu'est-ce qui était le plus gênant dans « ${value} », mais te fait rire aujourd'hui ?`,
    (value) => `Qu'as-tu sous-estimé à propos de « ${value} » ?`,
    (value) => `Quel conseil sur « ${value} » donnerais-tu à ton moi plus jeune ?`,
    (value) => `Que referais-tu volontiers en lien avec « ${value} » ?`,
  ],
  pt: [
    (value) => `Qual é a tua memória mais engraçada ligada a «${value}»?`,
    (value) => `O que te surpreendeu mais em «${value}»?`,
    (value) => `O que aprendeste com «${value}»?`,
    (value) => `O que farias hoje de forma diferente em relação a «${value}»?`,
    (value) => `Quem te animou mais em relação a «${value}»?`,
    (value) => `De que detalhe de «${value}» te lembras melhor?`,
    (value) => `O que foi mais embaraçoso em «${value}», mas hoje te faz rir?`,
    (value) => `O que subestimaste em «${value}»?`,
    (value) => `Que conselho sobre «${value}» darias ao teu eu mais novo?`,
    (value) => `O que repetias com gosto em relação a «${value}»?`,
  ],
};

const dareTemplates: Record<AppLanguage, readonly ((topic: string) => string)[]> = {
  sk: [
    (value) => `Predveď desaťsekundovú pantomímu na tému „${value}“.`,
    (value) => `Vymysli krátky reklamný slogan na tému „${value}“.`,
    (value) => `Povedz trojriadkovú rýmovačku na tému „${value}“.`,
    (value) => `Nakresli bez zdvihnutia pera symbol na tému „${value}“.`,
    (value) => `Vymysli pätnásťsekundový príbeh s názvom „${value}“.`,
    (value) => `Vysvetli tému „${value}“ hlasom športového komentátora.`,
    (value) => `Vymysli tri smiešne pravidlá na tému „${value}“.`,
    (value) => `Rozprávaj desať sekúnd ako robot o téme „${value}“.`,
    (value) => `Predveď krátku predpoveď počasia na tému „${value}“.`,
    (value) => `Zatancuj pätnásť sekúnd v rytme, ktorý ti pripomína tému „${value}“.`,
  ],
  en: [
    (value) => `Act out a ten-second mime about “${value}”.`,
    (value) => `Invent a short advertising slogan about “${value}”.`,
    (value) => `Say a three-line rhyme about “${value}”.`,
    (value) => `Draw a symbol for “${value}” without lifting your pen.`,
    (value) => `Invent a fifteen-second story called “${value}”.`,
    (value) => `Explain “${value}” in the voice of a sports commentator.`,
    (value) => `Make up three funny rules about “${value}”.`,
    (value) => `Talk like a robot about “${value}” for ten seconds.`,
    (value) => `Perform a short weather forecast about “${value}”.`,
    (value) => `Dance for fifteen seconds to a rhythm that “${value}” brings to mind.`,
  ],
  de: [
    (value) => `Stelle zehn Sekunden lang pantomimisch „${value}“ dar.`,
    (value) => `Erfinde einen kurzen Werbeslogan zu „${value}“.`,
    (value) => `Sage einen dreizeiligen Reim über „${value}“ auf.`,
    (value) => `Zeichne ein Symbol für „${value}“, ohne den Stift abzusetzen.`,
    (value) => `Erfinde eine fünfzehnsekündige Geschichte mit dem Titel „${value}“.`,
    (value) => `Erkläre „${value}“ mit der Stimme eines Sportkommentators.`,
    (value) => `Erfinde drei lustige Regeln zu „${value}“.`,
    (value) => `Sprich zehn Sekunden lang wie ein Roboter über „${value}“.`,
    (value) => `Führe eine kurze Wettervorhersage zu „${value}“ vor.`,
    (value) => `Tanze fünfzehn Sekunden zu einem Rhythmus, der dich an „${value}“ erinnert.`,
  ],
  es: [
    (value) => `Haz una mímica de diez segundos sobre «${value}».`,
    (value) => `Inventa un eslogan publicitario corto sobre «${value}».`,
    (value) => `Di una rima de tres versos sobre «${value}».`,
    (value) => `Dibuja un símbolo de «${value}» sin levantar el lápiz.`,
    (value) => `Inventa una historia de quince segundos titulada «${value}».`,
    (value) => `Explica «${value}» con voz de comentarista deportivo.`,
    (value) => `Inventa tres reglas divertidas sobre «${value}».`,
    (value) => `Habla durante diez segundos como un robot sobre «${value}».`,
    (value) => `Representa un breve pronóstico del tiempo sobre «${value}».`,
    (value) => `Baila quince segundos con un ritmo que te recuerde a «${value}».`,
  ],
  fr: [
    (value) => `Fais une courte mimique de dix secondes sur « ${value} ».`,
    (value) => `Invente un court slogan publicitaire sur « ${value} ».`,
    (value) => `Récite une rime de trois vers sur « ${value} ».`,
    (value) => `Dessine un symbole de « ${value} » sans lever ton crayon.`,
    (value) => `Invente une histoire de quinze secondes intitulée « ${value} ».`,
    (value) => `Explique « ${value} » avec une voix de commentateur sportif.`,
    (value) => `Invente trois règles amusantes sur « ${value} ».`,
    (value) => `Parle pendant dix secondes comme un robot de « ${value} ».`,
    (value) => `Fais une courte météo sur « ${value} ».`,
    (value) => `Danse quinze secondes sur un rythme qui te fait penser à « ${value} ».`,
  ],
  pt: [
    (value) => `Faz uma mímica de dez segundos sobre «${value}».`,
    (value) => `Inventa um slogan publicitário curto sobre «${value}».`,
    (value) => `Diz uma rima de três versos sobre «${value}».`,
    (value) => `Desenha um símbolo de «${value}» sem levantar o lápis.`,
    (value) => `Inventa uma história de quinze segundos chamada «${value}».`,
    (value) => `Explica «${value}» com voz de comentador desportivo.`,
    (value) => `Inventa três regras engraçadas sobre «${value}».`,
    (value) => `Fala durante dez segundos como um robô sobre «${value}».`,
    (value) => `Faz uma curta previsão do tempo sobre «${value}».`,
    (value) => `Dança quinze segundos num ritmo que te faça lembrar «${value}».`,
  ],
};

function buildDeck(templates: Record<AppLanguage, readonly ((topic: string) => string)[]>) {
  const cards = TOPICS.flatMap((item) => templates.sk.map((_, index) => Object.fromEntries(
    LANGUAGES.map((language) => [language, templates[language][index](item[language])]),
  ) as LocalizedTruthOrDareCard));
  if (cards.length !== TRUTH_OR_DARE_CARD_COUNT) {
    throw new Error(`Truth or Dare catalogue must contain exactly ${TRUTH_OR_DARE_CARD_COUNT} cards, got ${cards.length}.`);
  }
  const duplicateLanguage = LANGUAGES.find((language) => new Set(cards.map((card) => card[language].toLocaleLowerCase())).size !== cards.length);
  if (duplicateLanguage) throw new Error(`Truth or Dare catalogue repeats a card in ${duplicateLanguage}.`);
  return cards;
}

export const TRUTH_CARDS = buildDeck(truthTemplates);
export const DARE_CARDS = buildDeck(dareTemplates);

export const TRUTHS_BY_LANGUAGE = Object.fromEntries(LANGUAGES.map((language) => [language, TRUTH_CARDS.map((card) => card[language])])) as Record<AppLanguage, string[]>;
export const DARES_BY_LANGUAGE = Object.fromEntries(LANGUAGES.map((language) => [language, DARE_CARDS.map((card) => card[language])])) as Record<AppLanguage, string[]>;

export function getTruthsForLanguage(language: AppLanguage): string[] {
  return TRUTHS_BY_LANGUAGE[language] ?? TRUTHS_BY_LANGUAGE.sk;
}

export function getDaresForLanguage(language: AppLanguage): string[] {
  return DARES_BY_LANGUAGE[language] ?? DARES_BY_LANGUAGE.sk;
}

export const TRUTHS = TRUTHS_BY_LANGUAGE.sk;
export const DARES = DARES_BY_LANGUAGE.sk;
