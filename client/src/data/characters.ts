import type { AppLanguage } from "../i18n/LanguageProvider";
import { LOCAL_PERSONALITY_CATEGORIES } from "./localizedPersonalities";
import { MARVEL_CHARACTERS } from "./marvelCharacters";
import { ANIMATED_CHARACTERS as ANIMATED_CHARACTERS_DECK, ANIMATED_CHARACTERS_SK_ONLY } from "./animatedCharacters";
import { ANIMATED_MOVIES_BY_LANGUAGE } from "./animatedMovies";
import { WORLD_MOVIES_BY_LANGUAGE } from "./worldMovies";
import { MOVIE_CHARACTERS_BY_LANGUAGE } from "./movieCharacters";
import { SERIES_CHARACTERS_BY_LANGUAGE } from "./seriesCharacters";
import { WORLD_YOUTUBERS_BY_LANGUAGE } from "./worldYoutubers";
import { WORLD_ATHLETES } from "./worldAthletes";
import { FOOTBALL_STARS, WORLD_SINGERS } from "./guessWhoMusicAndSports";
import {
  WORLD_ACTORS,
  WORLD_BANDS,
  WORLD_PERSONALITIES_EXPANSION,
} from "./guessWhoFamousPeopleExpansion";
import {
  ANIMATED_CHARACTER_EXPANSION,
  ANIME_CHARACTERS,
  SERIES_CHARACTER_EXPANSION,
} from "./guessWhoEntertainmentExpansion";
import { BRAWL_STARS_CARDS, MINECRAFT_CARDS } from "./guessWhoGameWorlds";
import { HARRY_POTTER_CARDS, POKEMON_CARDS } from "./guessWhoFandoms";
import {
  FOOD_EXPANSIONS_BY_LANGUAGE,
  MYTHICAL_CREATURE_EXPANSIONS_BY_LANGUAGE,
  OBJECT_EXPANSIONS_BY_LANGUAGE,
  PLACES_EXPANSIONS_BY_LANGUAGE,
} from "./guessWhoEverydayExpansions";

export interface CharacterCategory {
  id: string;
  name: string;
  icon: string;
  characters: string[];
}

type CategoryLabels = Record<AppLanguage, string>;

/** Labels are kept separate from the decks so changing the app language never
 * creates another copy of the "all" deck. */
const CATEGORY_LABELS: Record<string, CategoryLabels> = {
  all: { sk: "Všetko", en: "All", de: "Alles", es: "Todo", fr: "Tout", pt: "Tudo" },
  "world-personalities": { sk: "Svetové osobnosti", en: "World personalities", de: "Weltberühmte Persönlichkeiten", es: "Personalidades del mundo", fr: "Personnalités du monde", pt: "Personalidades mundiais" },
  "world-athletes": { sk: "Svetoví športovci", en: "World athletes", de: "Weltklasse-Sportler", es: "Deportistas mundiales", fr: "Sportifs du monde", pt: "Atletas mundiais" },
  "world-youtubers": { sk: "Svetoví YouTuberi", en: "World YouTubers", de: "YouTuber aus aller Welt", es: "YouTubers del mundo", fr: "YouTubeurs du monde", pt: "YouTubers do mundo" },
  "slovak-personalities": { sk: "Slovenské osobnosti a herci", en: "Slovak personalities and actors", de: "Slowakische Persönlichkeiten und Schauspieler", es: "Personalidades y actores eslovacos", fr: "Personnalités et acteurs slovaques", pt: "Personalidades e atores eslovacos" },
  "slovak-athletes": { sk: "Slovenskí športovci", en: "Slovak athletes", de: "Slowakische Sportler", es: "Deportistas eslovacos", fr: "Sportifs slovaques", pt: "Atletas eslovacos" },
  "movie-characters": { sk: "Filmové postavy", en: "Movie characters", de: "Filmfiguren", es: "Personajes de cine", fr: "Personnages de films", pt: "Personagens de filmes" },
  "animated-characters": { sk: "Animované postavičky", en: "Animated characters", de: "Zeichentrickfiguren", es: "Personajes animados", fr: "Personnages animés", pt: "Personagens animadas" },
  "series-characters": { sk: "Postavy zo seriálov", en: "TV series characters", de: "Serienfiguren", es: "Personajes de series", fr: "Personnages de séries", pt: "Personagens de séries" },
  "video-game-characters": { sk: "Postavy z videohier", en: "Video game characters", de: "Videospielcharaktere", es: "Personajes de videojuegos", fr: "Personnages de jeux vidéo", pt: "Personagens de videojogos" },
  "world-movies": { sk: "Svetové filmy", en: "World movies", de: "Internationale Filme", es: "Películas del mundo", fr: "Films du monde", pt: "Filmes do mundo" },
  "animated-movies": { sk: "Animované filmy", en: "Animated movies", de: "Animationsfilme", es: "Películas de animación", fr: "Films d’animation", pt: "Filmes de animação" },
  "heroes-villains": { sk: "Hrdinovia a zloduchovia", en: "Heroes and villains", de: "Helden und Schurken", es: "Héroes y villanos", fr: "Héros et méchants", pt: "Heróis e vilões" },
  marvel: { sk: "Marvel postavy", en: "Marvel characters", de: "Marvel-Figuren", es: "Personajes de Marvel", fr: "Personnages Marvel", pt: "Personagens da Marvel" },
  "world-singers": { sk: "Svetoví speváci", en: "World singers", de: "Weltbekannte Sänger", es: "Cantantes del mundo", fr: "Chanteurs du monde", pt: "Cantores do mundo" },
  "world-actors": { sk: "Svetoví herci a herečky", en: "World actors", de: "Weltbekannte Schauspieler", es: "Actores del mundo", fr: "Acteurs du monde", pt: "Atores do mundo" },
  "world-bands": { sk: "Svetové kapely", en: "World bands", de: "Weltbekannte Bands", es: "Bandas del mundo", fr: "Groupes du monde", pt: "Bandas do mundo" },
  "anime-characters": { sk: "Anime postavy", en: "Anime characters", de: "Anime-Figuren", es: "Personajes de anime", fr: "Personnages d’anime", pt: "Personagens de anime" },
  "football-stars": { sk: "Futbalové hviezdy", en: "Football stars", de: "Fußballstars", es: "Estrellas del fútbol", fr: "Stars du football", pt: "Estrelas do futebol" },
  "brawl-stars": { sk: "Brawl Stars", en: "Brawl Stars", de: "Brawl Stars", es: "Brawl Stars", fr: "Brawl Stars", pt: "Brawl Stars" },
  minecraft: { sk: "Minecraft", en: "Minecraft", de: "Minecraft", es: "Minecraft", fr: "Minecraft", pt: "Minecraft" },
  pokemon: { sk: "Pokémon", en: "Pokémon", de: "Pokémon", es: "Pokémon", fr: "Pokémon", pt: "Pokémon" },
  "harry-potter": { sk: "Harry Potter", en: "Harry Potter", de: "Harry Potter", es: "Harry Potter", fr: "Harry Potter", pt: "Harry Potter" },
  professions: { sk: "Povolania", en: "Professions", de: "Berufe", es: "Profesiones", fr: "Métiers", pt: "Profissões" },
  food: { sk: "Jedlo a nápoje", en: "Food and drinks", de: "Essen und Getränke", es: "Comida y bebidas", fr: "Nourriture et boissons", pt: "Comida e bebidas" },
  objects: { sk: "Predmety", en: "Objects", de: "Gegenstände", es: "Objetos", fr: "Objets", pt: "Objetos" },
  "places-landmarks": { sk: "Miesta a pamiatky", en: "Places and landmarks", de: "Orte und Sehenswürdigkeiten", es: "Lugares y monumentos", fr: "Lieux et monuments", pt: "Lugares e monumentos" },
  "mythical-creatures": { sk: "Mýtické bytosti", en: "Mythical creatures", de: "Mythische Wesen", es: "Criaturas míticas", fr: "Créatures mythiques", pt: "Criaturas míticas" },
};

type LocalizedDeck = Omit<CharacterCategory, "name" | "characters"> & {
  labels: CategoryLabels;
  characters: Record<AppLanguage, string[]>;
};

/** New, language-complete cards. Every row is deliberately a familiar,
 * easy-to-question concept rather than a generated word combination. */
const LOCALIZED_ADDITIONAL_CATEGORIES: LocalizedDeck[] = [
  {
    id: "professions", icon: "💼", labels: CATEGORY_LABELS.professions,
    characters: {
      sk: ["Lekár", "Zubár", "Chirurg", "Zdravotná sestra", "Lekárnik", "Hasič", "Policajt", "Vojak", "Pilot", "Letuška", "Astronaut", "Kapitán lode", "Kuchár", "Cukrár", "Čašník", "Barman", "Učiteľ", "Riaditeľ školy", "Detektív", "Vyšetrovateľ", "Právnik", "Sudca", "Notár", "Kúzelník", "Klaun", "Veterinár", "Fotograf", "Kameraman", "Architekt", "Stavebný inžinier", "Hudobník", "Spevák", "DJ", "Herec", "Režisér", "Športovec", "Trénor", "Rozhodca", "Vedec", "Chemik", "Fyzik", "Farmár", "Rybár", "Poľovník", "Pekár", "Mäsiar", "Kaderník", "Kozmetička", "Masér", "Záchranár", "Lekár záchrannej služby", "Poštár", "Vodič autobusu", "Taxikár", "Stavbár", "Murár", "Elektrikár", "Vodoinštalatér", "Mechanik", "Automechanik", "Novinár", "Redaktor", "Moderátor", "Spisovateľ", "Prekladateľ", "Bankár", "Účtovník", "Predavač", "Manažér", "Programátor", "Grafický dizajnér", "Inžinier", "Vedecký pracovník", "Historik", "Archeológ", "Geológ", "Meteorológ", "Záhradník", "Lesník", "Colník", "Vojak výsadkár", "Strážnik", "Súkromný detektív", "Sociálny pracovník", "Psychológ", "Terapeut", "Farmaceut", "Krajčír", "Obuvník", "Hodinár", "Baník", "Ťahač lodí", "Kapitán lietadla", "Vesmírny inžinier", "Vinár", "Somelier", "Sprievodca", "Turistický sprievodca", "Skladník"],
      en: ["Doctor", "Dentist", "Surgeon", "Nurse", "Pharmacist", "Firefighter", "Police officer", "Soldier", "Pilot", "Flight attendant", "Astronaut", "Ship captain", "Chef", "Pastry chef", "Waiter", "Bartender", "Teacher", "School principal", "Detective", "Investigator", "Lawyer", "Judge", "Notary", "Magician", "Clown", "Veterinarian", "Photographer", "Cameraman", "Architect", "Civil engineer", "Musician", "Singer", "DJ", "Actor", "Film director", "Athlete", "Coach", "Referee", "Scientist", "Chemist", "Physicist", "Farmer", "Fisherman", "Hunter", "Baker", "Butcher", "Hairdresser", "Beautician", "Masseur", "Paramedic", "Emergency doctor", "Postman", "Bus driver", "Taxi driver", "Builder", "Bricklayer", "Electrician", "Plumber", "Mechanic", "Car mechanic", "Journalist", "Editor", "News anchor", "Writer", "Translator", "Banker", "Accountant", "Shop assistant", "Manager", "Programmer", "Graphic designer", "Engineer", "Researcher", "Historian", "Archaeologist", "Geologist", "Meteorologist", "Gardener", "Forester", "Customs officer", "Paratrooper", "Security guard", "Private investigator", "Social worker", "Psychologist", "Therapist", "Pharmacologist", "Tailor", "Shoemaker", "Watchmaker", "Miner", "Sailor", "Airline captain", "Space engineer", "Winemaker", "Sommelier", "Tour guide", "Travel guide", "Warehouse worker"],
      de: ["Arzt", "Zahnarzt", "Chirurg", "Krankenschwester", "Apotheker", "Feuerwehrmann", "Polizist", "Soldat", "Pilot", "Flugbegleiterin", "Astronaut", "Schiffskapitän", "Koch", "Konditor", "Kellner", "Barkeeper", "Lehrer", "Schulleiter", "Detektiv", "Ermittler", "Anwalt", "Richter", "Notar", "Zauberer", "Clown", "Tierarzt", "Fotograf", "Kameramann", "Architekt", "Bauingenieur", "Musiker", "Sänger", "DJ", "Schauspieler", "Filmregisseur", "Sportler", "Trainer", "Schiedsrichter", "Wissenschaftler", "Chemiker", "Physiker", "Landwirt", "Fischer", "Jäger", "Bäcker", "Metzger", "Friseur", "Kosmetikerin", "Masseur", "Sanitäter", "Notarzt", "Postbote", "Busfahrer", "Taxifahrer", "Bauarbeiter", "Maurer", "Elektriker", "Klempner", "Mechaniker", "Automechaniker", "Journalist", "Redakteur", "Nachrichtensprecher", "Schriftsteller", "Übersetzer", "Bankier", "Buchhalter", "Verkäufer", "Manager", "Programmierer", "Grafikdesigner", "Ingenieur", "Forscher", "Historiker", "Archäologe", "Geologe", "Meteorologe", "Gärtner", "Förster", "Zollbeamter", "Fallschirmjäger", "Sicherheitswächter", "Privatdetektiv", "Sozialarbeiter", "Psychologe", "Therapeut", "Pharmakologe", "Schneider", "Schuhmacher", "Uhrmacher", "Bergmann", "Matrose", "Fluglinienkapitän", "Raumfahrtingenieur", "Winzer", "Sommelier", "Reiseleiter", "Fremdenführer", "Lagerarbeiter"],
      es: ["Médico", "Dentista", "Cirujano", "Enfermera", "Farmacéutico", "Bombero", "Policía", "Soldado", "Piloto", "Auxiliar de vuelo", "Astronauta", "Capitán de barco", "Cocinero", "Pastelero", "Camarero", "Camarero de bar", "Profesor", "Director de escuela", "Detective", "Investigador", "Abogado", "Juez", "Notario", "Mago", "Payaso", "Veterinario", "Fotógrafo", "Cámara", "Arquitecto", "Ingeniero civil", "Músico", "Cantante", "DJ", "Actor", "Director de cine", "Deportista", "Entrenador", "Árbitro", "Científico", "Químico", "Físico", "Granjero", "Pescador", "Cazador", "Panadero", "Carnicero", "Peluquero", "Esteticista", "Masajista", "Paramédico", "Médico de urgencias", "Cartero", "Conductor de autobús", "Taxista", "Albañil", "Constructor", "Electricista", "Fontanero", "Mecánico", "Mecánico de coches", "Periodista", "Editor", "Presentador de noticias", "Escritor", "Traductor", "Banquero", "Contable", "Vendedor", "Gerente", "Programador", "Diseñador gráfico", "Ingeniero", "Investigador científico", "Historiador", "Arqueólogo", "Geólogo", "Meteorólogo", "Jardinero", "Guardabosques", "Agente de aduanas", "Paracaidista", "Guardia de seguridad", "Detective privado", "Trabajador social", "Psicólogo", "Terapeuta", "Farmacólogo", "Sastre", "Zapatero", "Relojero", "Minero", "Marinero", "Capitán de aerolínea", "Ingeniero aeroespacial", "Enólogo", "Sumiller", "Guía turístico", "Guía de viajes", "Trabajador de almacén"],
      fr: ["Médecin", "Dentiste", "Chirurgien", "Infirmière", "Pharmacien", "Pompier", "Policier", "Soldat", "Pilote", "Hôtesse de l'air", "Astronaute", "Capitaine de navire", "Cuisinier", "Pâtissier", "Serveur", "Barman", "Professeur", "Directeur d'école", "Détective", "Enquêteur", "Avocat", "Juge", "Notaire", "Magicien", "Clown", "Vétérinaire", "Photographe", "Caméraman", "Architecte", "Ingénieur civil", "Musicien", "Chanteur", "DJ", "Acteur", "Réalisateur", "Sportif", "Entraîneur", "Arbitre", "Scientifique", "Chimiste", "Physicien", "Agriculteur", "Pêcheur", "Chasseur", "Boulanger", "Boucher", "Coiffeur", "Esthéticienne", "Masseur", "Ambulancier", "Médecin urgentiste", "Facteur", "Conducteur de bus", "Chauffeur de taxi", "Ouvrier du bâtiment", "Maçon", "Électricien", "Plombier", "Mécanicien", "Mécanicien automobile", "Journaliste", "Rédacteur", "Présentateur du journal", "Écrivain", "Traducteur", "Banquier", "Comptable", "Vendeur", "Manager", "Programmeur", "Graphiste", "Ingénieur", "Chercheur", "Historien", "Archéologue", "Géologue", "Météorologue", "Jardinier", "Garde forestier", "Douanier", "Parachutiste", "Agent de sécurité", "Détective privé", "Travailleur social", "Psychologue", "Thérapeute", "Pharmacologue", "Tailleur", "Cordonnier", "Horloger", "Mineur", "Marin", "Commandant de bord", "Ingénieur aérospatial", "Vigneron", "Sommelier", "Guide touristique", "Guide de voyage", "Magasinier"],
      pt: ["Médico", "Dentista", "Cirurgião", "Enfermeira", "Farmacêutico", "Bombeiro", "Polícia", "Soldado", "Piloto", "Assistente de bordo", "Astronauta", "Capitão de navio", "Cozinheiro", "Pasteleiro", "Empregado de mesa", "Barman", "Professor", "Diretor de escola", "Detetive", "Investigador", "Advogado", "Juiz", "Notário", "Mágico", "Palhaço", "Veterinário", "Fotógrafo", "Operador de câmara", "Arquiteto", "Engenheiro civil", "Músico", "Cantor", "DJ", "Ator", "Realizador", "Atleta", "Treinador", "Árbitro", "Cientista", "Químico", "Físico", "Agricultor", "Pescador", "Caçador", "Padeiro", "Açougueiro", "Cabeleireiro", "Esteticista", "Massagista", "Paramédico", "Médico de urgência", "Carteiro", "Motorista de autocarro", "Taxista", "Operário da construção", "Pedreiro", "Eletricista", "Encanador", "Mecânico", "Mecânico de automóveis", "Jornalista", "Editor", "Apresentador de notícias", "Escritor", "Tradutor", "Bancário", "Contabilista", "Vendedor", "Gerente", "Programador", "Designer gráfico", "Engenheiro", "Investigador científico", "Historiador", "Arqueólogo", "Geólogo", "Meteorologista", "Jardineiro", "Guarda florestal", "Agente aduaneiro", "Paraquedista", "Segurança", "Detetive privado", "Assistente social", "Psicólogo", "Terapeuta", "Farmacologista", "Alfaiate", "Sapateiro", "Relojoeiro", "Mineiro", "Marinheiro", "Comandante de avião", "Engenheiro aeroespacial", "Enólogo", "Sommelier", "Guia turístico", "Guia de viagem", "Trabalhador de armazém"],
    },
  },
  {
    id: "food", icon: "🍕", labels: CATEGORY_LABELS.food,
    characters: {
      sk: ["Pizza", "Hamburger", "Sushi", "Špagety", "Zmrzlina", "Popcorn", "Palacinky", "Hot dog", "Hranolky", "Tacos", "Lasagne", "Šalát", "Čokoláda", "Koláč", "Jablko", "Banán", "Jahoda", "Melón", "Mrkva", "Chlieb", "Syr", "Káva", "Čaj", "Limonáda", "Milkshake"],
      en: ["Pizza", "Hamburger", "Sushi", "Spaghetti", "Ice cream", "Popcorn", "Pancakes", "Hot dog", "French fries", "Tacos", "Lasagna", "Salad", "Chocolate", "Cake", "Apple", "Banana", "Strawberry", "Watermelon", "Carrot", "Bread", "Cheese", "Coffee", "Tea", "Lemonade", "Milkshake"],
      de: ["Pizza", "Hamburger", "Sushi", "Spaghetti", "Eis", "Popcorn", "Pfannkuchen", "Hotdog", "Pommes frites", "Tacos", "Lasagne", "Salat", "Schokolade", "Kuchen", "Apfel", "Banane", "Erdbeere", "Wassermelone", "Karotte", "Brot", "Käse", "Kaffee", "Tee", "Limonade", "Milchshake"],
      es: ["Pizza", "Hamburguesa", "Sushi", "Espaguetis", "Helado", "Palomitas", "Tortitas", "Perrito caliente", "Patatas fritas", "Tacos", "Lasaña", "Ensalada", "Chocolate", "Pastel", "Manzana", "Plátano", "Fresa", "Sandía", "Zanahoria", "Pan", "Queso", "Café", "Té", "Limonada", "Batido"],
      fr: ["Pizza", "Hamburger", "Sushi", "Spaghettis", "Glace", "Pop-corn", "Crêpes", "Hot-dog", "Frites", "Tacos", "Lasagnes", "Salade", "Chocolat", "Gâteau", "Pomme", "Banane", "Fraise", "Pastèque", "Carotte", "Pain", "Fromage", "Café", "Thé", "Limonade", "Milk-shake"],
      pt: ["Pizza", "Hambúrguer", "Sushi", "Esparguete", "Gelado", "Pipocas", "Panquecas", "Cachorro-quente", "Batatas fritas", "Tacos", "Lasanha", "Salada", "Chocolate", "Bolo", "Maçã", "Banana", "Morango", "Melancia", "Cenoura", "Pão", "Queijo", "Café", "Chá", "Limonada", "Batido"],
    },
  },
  {
    id: "objects", icon: "🎒", labels: CATEGORY_LABELS.objects,
    characters: {
      sk: ["Telefón", "Dáždnik", "Fotoaparát", "Gitara", "Vysávač", "Zubná kefka", "Kľúč", "Hodiny", "Bicykel", "Kufor", "Batoh", "Okuliare", "Zrkadlo", "Sviečka", "Lampa", "Mikrofón", "Diaľkový ovládač", "Budík", "Kniha", "Lopta", "Kefa na vlasy", "Lyžica", "Nožnice", "Hrebeň", "Skateboard"],
      en: ["Phone", "Umbrella", "Camera", "Guitar", "Vacuum cleaner", "Toothbrush", "Key", "Clock", "Bicycle", "Suitcase", "Backpack", "Glasses", "Mirror", "Candle", "Lamp", "Microphone", "Remote control", "Alarm clock", "Book", "Ball", "Hairbrush", "Spoon", "Scissors", "Comb", "Skateboard"],
      de: ["Telefon", "Regenschirm", "Kamera", "Gitarre", "Staubsauger", "Zahnbürste", "Schlüssel", "Uhr", "Fahrrad", "Koffer", "Rucksack", "Brille", "Spiegel", "Kerze", "Lampe", "Mikrofon", "Fernbedienung", "Wecker", "Buch", "Ball", "Haarbürste", "Löffel", "Schere", "Kamm", "Skateboard"],
      es: ["Teléfono", "Paraguas", "Cámara", "Guitarra", "Aspiradora", "Cepillo de dientes", "Llave", "Reloj", "Bicicleta", "Maleta", "Mochila", "Gafas", "Espejo", "Vela", "Lámpara", "Micrófono", "Mando a distancia", "Despertador", "Libro", "Pelota", "Cepillo de pelo", "Cuchara", "Tijeras", "Peine", "Monopatín"],
      fr: ["Téléphone", "Parapluie", "Appareil photo", "Guitare", "Aspirateur", "Brosse à dents", "Clé", "Horloge", "Vélo", "Valise", "Sac à dos", "Lunettes", "Miroir", "Bougie", "Lampe", "Microphone", "Télécommande", "Réveil", "Livre", "Ballon", "Brosse à cheveux", "Cuillère", "Ciseaux", "Peigne", "Skateboard"],
      pt: ["Telemóvel", "Guarda-chuva", "Câmara fotográfica", "Guitarra", "Aspirador", "Escova de dentes", "Chave", "Relógio", "Bicicleta", "Mala", "Mochila", "Óculos", "Espelho", "Vela", "Candeeiro", "Microfone", "Comando", "Despertador", "Livro", "Bola", "Escova de cabelo", "Colher", "Tesoura", "Pente", "Skate"],
    },
  },
  {
    id: "places-landmarks", icon: "🗺️", labels: CATEGORY_LABELS["places-landmarks"],
    characters: {
      sk: ["Eiffelova veža", "Koloseum", "Big Ben", "Socha slobody", "Mount Everest", "Veľký čínsky múr", "Pyramídy v Gíze", "Tádž Mahal", "Machu Picchu", "Niagarské vodopády", "Opera v Sydney", "Sagrada Família", "Louvre", "Disneyland", "Vatikán", "Times Square", "Grand Canyon", "Benátky", "Paríž", "New York", "Londýn", "Rím", "Tokio", "Rio de Janeiro", "Sahara"],
      en: ["Eiffel Tower", "Colosseum", "Big Ben", "Statue of Liberty", "Mount Everest", "Great Wall of China", "Pyramids of Giza", "Taj Mahal", "Machu Picchu", "Niagara Falls", "Sydney Opera House", "Sagrada Família", "Louvre Museum", "Disneyland", "Vatican City", "Times Square", "Grand Canyon", "Venice", "Paris", "New York", "London", "Rome", "Tokyo", "Rio de Janeiro", "Sahara Desert"],
      de: ["Eiffelturm", "Kolosseum", "Big Ben", "Freiheitsstatue", "Mount Everest", "Chinesische Mauer", "Pyramiden von Gizeh", "Taj Mahal", "Machu Picchu", "Niagarafälle", "Oper von Sydney", "Sagrada Família", "Louvre", "Disneyland", "Vatikanstadt", "Times Square", "Grand Canyon", "Venedig", "Paris", "New York", "London", "Rom", "Tokio", "Rio de Janeiro", "Sahara"],
      es: ["Torre Eiffel", "Coliseo", "Big Ben", "Estatua de la Libertad", "Monte Everest", "Gran Muralla China", "Pirámides de Guiza", "Taj Mahal", "Machu Picchu", "Cataratas del Niágara", "Ópera de Sídney", "Sagrada Familia", "Museo del Louvre", "Disneyland", "Ciudad del Vaticano", "Times Square", "Gran Cañón", "Venecia", "París", "Nueva York", "Londres", "Roma", "Tokio", "Río de Janeiro", "Sáhara"],
      fr: ["Tour Eiffel", "Colisée", "Big Ben", "Statue de la Liberté", "mont Everest", "Grande Muraille de Chine", "pyramides de Gizeh", "Taj Mahal", "Machu Picchu", "chutes du Niagara", "opéra de Sydney", "Sagrada Família", "musée du Louvre", "Disneyland", "Cité du Vatican", "Times Square", "Grand Canyon", "Venise", "Paris", "New York", "Londres", "Rome", "Tokyo", "Rio de Janeiro", "Sahara"],
      pt: ["Torre Eiffel", "Coliseu", "Big Ben", "Estátua da Liberdade", "Monte Everest", "Grande Muralha da China", "Pirâmides de Gizé", "Taj Mahal", "Machu Picchu", "Cataratas do Niágara", "Ópera de Sydney", "Sagrada Família", "Museu do Louvre", "Disneyland", "Cidade do Vaticano", "Times Square", "Grande Canhão", "Veneza", "Paris", "Nova Iorque", "Londres", "Roma", "Tóquio", "Rio de Janeiro", "Sahara"],
    },
  },
  {
    id: "mythical-creatures", icon: "🐉", labels: CATEGORY_LABELS["mythical-creatures"],
    characters: {
      sk: ["Drak", "Jednorožec", "Morská panna", "Upír", "Vlkodlak", "Fénix", "Minotaurus", "Kentaur", "Grifon", "Hydra", "Kraken", "Pegas", "Morský koník", "Obor", "Troll", "Škriatok", "Víla", "Elf", "Goblin", "Golem", "Medúza", "Kyklop", "Sfinga", "Yeti", "Lochnesská príšera"],
      en: ["Dragon", "Unicorn", "Mermaid", "Vampire", "Werewolf", "Phoenix", "Minotaur", "Centaur", "Griffin", "Hydra", "Kraken", "Pegasus", "Seahorse", "Giant", "Troll", "Goblin", "Fairy", "Elf", "Hobgoblin", "Golem", "Medusa", "Cyclops", "Sphinx", "Yeti", "Loch Ness Monster"],
      de: ["Drache", "Einhorn", "Meerjungfrau", "Vampir", "Werwolf", "Phönix", "Minotaurus", "Zentaur", "Greif", "Hydra", "Krake", "Pegasus", "Seepferdchen", "Riese", "Troll", "Kobold", "Fee", "Elf", "Goblin", "Golem", "Medusa", "Zyklop", "Sphinx", "Yeti", "Ungeheuer von Loch Ness"],
      es: ["Dragón", "Unicornio", "Sirena", "Vampiro", "Hombre lobo", "Fénix", "Minotauro", "Centauro", "Grifo", "Hidra", "Kraken", "Pegaso", "Caballito de mar", "Gigante", "Trol", "Duende", "Hada", "Elfo", "Goblin", "Gólem", "Medusa", "Cíclope", "Esfinge", "Yeti", "Monstruo del lago Ness"],
      fr: ["Dragon", "Licorne", "Sirène", "Vampire", "Loup-garou", "Phénix", "Minotaure", "Centaure", "Griffon", "Hydre", "Kraken", "Pégase", "Hippocampe", "Géant", "Troll", "Lutin", "Fée", "Elfe", "Gobelin", "Golem", "Méduse", "Cyclope", "Sphinx", "Yéti", "Monstre du Loch Ness"],
      pt: ["Dragão", "Unicórnio", "Sereia", "Vampiro", "Lobisomem", "Fénix", "Minotauro", "Centauro", "Grifo", "Hidra", "Kraken", "Pégaso", "Cavalo-marinho", "Gigante", "Troll", "Duende", "Fada", "Elfo", "Goblin", "Golem", "Medusa", "Ciclope", "Esfinge", "Yeti", "Monstro do Lago Ness"],
    },
  },
];

const LOCALIZED_CATEGORY_EXPANSIONS: Record<string, Record<AppLanguage, string[]>> = {
  food: FOOD_EXPANSIONS_BY_LANGUAGE,
  objects: OBJECT_EXPANSIONS_BY_LANGUAGE,
  "places-landmarks": PLACES_EXPANSIONS_BY_LANGUAGE,
  "mythical-creatures": MYTHICAL_CREATURE_EXPANSIONS_BY_LANGUAGE,
};

// Karty su rozdelene podla typu, aby si hraci mohli vybrat tematicky balik.
const CHARACTER_CATEGORIES_BASE: CharacterCategory[] = [
  {
    id: "world-personalities",
    name: "Svetové osobnosti",
    icon: "🌍",
    characters: [
      "Elon Musk", "Barack Obama", "Nelson Mandela", "Greta Thunberg", "Oprah Winfrey",
      "Malala Yousafzai", "Mark Zuckerberg", "Bill Gates", "Steve Jobs", "Jeff Bezos",
      "Dalajlama", "Pápež František", "David Attenborough", "Stephen Hawking", "Jane Goodall",
      "Walt Disney", "Coco Chanel", "Pablo Picasso", "Frida Kahlo", "Andy Warhol",
      "Mahatma Gandhi", "Martin Luther King Jr.", "Amelia Earhart", "Rosa Parks", "Anne Frank",
    ],
  },
  {
    id: "world-athletes",
    name: "Svetoví športovci",
    icon: "🏅",
    characters: [
      "Cristiano Ronaldo", "Lionel Messi", "Kylian Mbappé", "Erling Haaland", "Neymar",
      "LeBron James", "Michael Jordan", "Stephen Curry", "Kobe Bryant", "Serena Williams",
      "Roger Federer", "Rafael Nadal", "Novak Djokovic", "Usain Bolt", "Simone Biles",
      "Michael Phelps", "Tiger Woods", "Lewis Hamilton", "Max Verstappen", "Valentino Rossi",
      "Muhammad Ali", "Mike Tyson", "Conor McGregor", "Katie Ledecky", "Shaquille O'Neal",
    ],
  },
  {
    id: "world-youtubers",
    name: "Svetoví YouTuberi",
    icon: "▶️",
    characters: [
      "MrBeast", "PewDiePie", "Markiplier", "Jacksepticeye", "KSI",
      "Logan Paul", "Jake Paul", "Ninja", "Dream", "DanTDM",
      "SssniperWolf", "Emma Chamberlain", "Ryan Trahan", "Dude Perfect", "The Sidemen",
      "T-Series", "Zach King", "Khaby Lame", "iJustine", "Marques Brownlee",
      "Casey Neistat", "LazarBeam", "Valkyrae", "Pokimane", "TommyInnit",
    ],
  },
  {
    id: "world-actors",
    name: "Svetovi herci a herecky",
    icon: "🎭",
    characters: [
      "Leonardo DiCaprio", "Tom Hanks", "Keanu Reeves", "Dwayne Johnson", "Will Smith",
      "Johnny Depp", "Robert Downey Jr.", "Brad Pitt", "Ryan Reynolds", "Morgan Freeman",
      "Scarlett Johansson", "Jennifer Aniston", "Angelina Jolie", "Margot Robbie", "Emma Stone",
      "Zendaya", "Anne Hathaway", "Meryl Streep", "Julia Roberts", "Sandra Bullock",
      "Daniel Radcliffe", "Tom Holland", "Chris Hemsworth", "Jason Momoa", "Pedro Pascal",
    ],
  },
  {
    id: "world-musicians",
    name: "Svetovi hudobnici",
    icon: "🎤",
    characters: [
      "Taylor Swift", "Beyoncé", "Rihanna", "Billie Eilish", "Lady Gaga",
      "Adele", "Dua Lipa", "Ariana Grande", "Katy Perry", "Madonna",
      "Ed Sheeran", "Justin Bieber", "Drake", "Eminem", "The Weeknd",
      "Bruno Mars", "Harry Styles", "Elvis Presley", "Michael Jackson", "Freddie Mercury",
      "John Lennon", "Bob Marley", "Shakira", "Sia", "Miley Cyrus",
    ],
  },
  {
    id: "slovak-personalities",
    name: "Slovenske osobnosti",
    icon: "🇸🇰",
    characters: [
      "Zuzana Čaputová", "Milan Rastislav Štefánik", "Ľudovít Štúr", "Anton Bernolák", "Ján Kollár",
      "Pavol Jozef Šafárik", "Jozef Murgaš", "Aurel Stodola", "Ivan Bella", "Jozef Gabčík",
      "Milan Lasica", "Július Satinský", "Róbert Bezák", "Vlado Dzurilla", "Ján Kuciak",
      "Mária Terézia", "Matúš Čák Trenčiansky", "Svätopluk", "Juraj Jánošík", "Mária Rázusová-Martáková",
      "Dominik Tatarka", "Martin Kukučín", "Božena Slančíková-Timrava", "Pavol Országh Hviezdoslav", "Janko Kráľ",
    ],
  },
  {
    id: "slovak-athletes",
    name: "Slovenski sportovci",
    icon: "🏒",
    characters: [
      "Peter Sagan", "Marek Hamšík", "Miroslav Šatan", "Zdeno Chára", "Marián Hossa",
      "Jaroslav Halák", "Peter Bondra", "Pavol Demitra", "Peter Šťastný", "Stan Mikita",
      "Dominika Cibulková", "Daniela Hantuchová", "Anna Karolína Schmiedlová", "Matej Tóth", "Jozef Pribilinec",
      "Petra Vlhová", "Veronika Velez-Zuzulová", "Richard Tury", "Ján Volko", "Michal Martikán",
      "Anastasiya Kuzminová", "Erik Vlček", "Filip Polášek", "František Kunzo", "Martin Vaculík",
    ],
  },
  {
    id: "slovak-actors",
    name: "Slovenski herci a herecky",
    icon: "🎬",
    characters: [
      "Maroš Kramár", "Jozef Kroner", "Emília Vášáryová", "Magda Vášáryová", "Božidara Turzonovová",
      "Milan Lasica", "Július Satinský", "Milan Kňažko", "Dušan Jamrich", "Juraj Kukura",
      "Zuzana Kronerová", "Táňa Pauhofová", "Jana Oľhová", "Zuzana Mauréry", "Anna Šišková",
      "Tomáš Maštalír", "Ján Koleník", "Alexander Bárta", "Jozef Vajda", "Marián Labuda",
      "Gregor Hološka", "Jana Hubinská", "Petra Polnišová", "Jakub Prachař", "Ady Hajdu",
    ],
  },
  {
    id: "slovak-musicians",
    name: "Slovenski hudobnici",
    icon: "🎵",
    characters: [
      "Pavol Habera", "Richard Müller", "Jana Kirschner", "Kristína", "Adam Ďurica",
      "Peter Nagy", "Peter Lipa", "Vašo Patejdl", "Meky Žbirka", "Dežo Ursiny",
      "Tina", "Dara Rolins", "Sima Magušinová", "Kali", "Rytmus",
      "Majk Spirit", "Ego", "IMT Smile", "Desmod", "Elán",
      "Horkýže Slíže", "No Name", "Katarína Knechtová", "Mária Čírová", "Kollárovci",
    ],
  },
  {
    id: "movie-characters",
    name: "Filmove postavy",
    icon: "🍿",
    characters: [
      "Harry Potter", "Hermiona Grangerová", "Ron Weasley", "Lord Voldemort", "Spider-Man",
      "Batman", "Superman", "Wonder Woman", "Iron Man", "Thor",
      "Captain America", "Hulk", "Joker", "Darth Vader", "Luke Skywalker",
      "Jack Sparrow", "Frodo Bublík", "Gandalf", "Legolas", "James Bond",
      "Indiana Jones", "Rocky Balboa", "Forrest Gump", "Shrek", "Donkey",
      "Woody", "Buzz Rakeťák", "Elsa", "Simba", "John Wick",
    ],
  },
  {
    id: "films-series",
    name: "Filmy a serialy",
    icon: "📺",
    characters: [
      "Titanic", "Avatar", "Barbie", "Oppenheimer", "Matrix",
      "Pán prsteňov", "Harry Potter", "Star Wars", "Jurský park", "Gladiátor",
      "Sám doma", "Toy Story", "Leví kráľ", "Hľadá sa Nemo", "Ľadové kráľovstvo",
      "Priatelia", "Hra o tróny", "Stranger Things", "Wednesday", "Bridgerton",
      "The Last of Us", "Breaking Bad", "Squid Game", "The Office", "Simpsonovci",
    ],
  },
  {
    id: "fairy-tales",
    name: "Rozpravkove postavy",
    icon: "🧚",
    characters: [
      "Popoluška", "Snehulienka", "Šípková Ruženka", "Červená čiapočka", "Pinocchio",
      "Alenka v krajine zázrakov", "Peter Pan", "Tinker Bell", "Macko Puf", "Kocúr v čižmách",
      "Mickey Mouse", "Minnie Mouse", "Kačer Donald", "Bugs Bunny", "Tom a Jerry",
      "SpongeBob", "Patrik", "Scooby-Doo", "Asterix", "Obelix",
      "Janko Hraško", "Rytier bez bázne", "Soľ nad zlato", "Janko a Marienka", "Aladin",
    ],
  },
  {
    id: "history-science",
    name: "Historia a veda",
    icon: "📚",
    characters: [
      "Napoleon Bonaparte", "Julius Caesar", "Alexander Veľký", "Kleopatra", "Tutanchamón",
      "Albert Einstein", "Leonardo da Vinci", "Nikola Tesla", "Isaac Newton", "Marie Curie",
      "Charles Darwin", "Galileo Galilei", "Mikuláš Kopernik", "Ada Lovelace", "Alan Turing",
      "Aristoteles", "Platón", "Sokrates", "William Shakespeare", "Wolfgang Amadeus Mozart",
      "Ludwig van Beethoven", "Vincent van Gogh", "Claude Monet", "Salvador Dalí", "Johannes Gutenberg",
    ],
  },
  {
    id: "animals",
    name: "Zvierata",
    icon: "🦁",
    characters: [
      "Lev", "Tiger", "Slon", "Žirafa", "Gorila", "Šimpanz", "Panda", "Koala",
      "Tučniak", "Flamingo", "Papagáj", "Sova", "Delfín", "Žralok", "Veľryba", "Chobotnica",
      "Krokodíl", "Hroch", "Nosorožec", "Zebra", "Vlk", "Medveď", "Líška", "Jaguár",
      "Gepard", "Leopard", "Puma", "Suriikata", "Kengura", "Lenivec",
    ],
  },
];

const SLOVAK_PERSONALITIES_EXTRA = [
  "Mária Bartalos", "Mária Čírová", "Katarína Knechtová", "Nela Pocisková", "Celeste Buckingham", "Emma Drobná", "Mária Kolárová", "Veronika Strapková", "Lucia Barmošová", "Adela Vinczeová",
  "Dara Rolins", "Rytmus", "Majk Spirit", "Kali", "Ego", "Separ", "Sima", "Ewa Farna", "Michaela Čobejová", "Zuzana Fialová",
  "Zuzana Norisová", "Monika Hilmerová", "Diana Mórová", "Sväťo Malachovský", "Lukáš Latinák",
  "Kamil Peteraj", "Jozef Banáš", "Matej Bel", "Mária Podhradská", "Peter Marcin", "Andrej Bičan", "Dano Dangl", "Mária Kráľovičová", "Jozef Bednárik",
];

const SLOVAK_ATHLETES_EXTRA = [
  "Marek Mintál", "Róbert Vittek", "Martin Škrtel", "Vladimír Weiss", "Ondrej Duda", "Stanislav Lobotka", "Milan Škriniar", "Dávid Hancko", "Juraj Kucka", "Ján Ďurica",
  "Martin Dúbravka", "Ján Mucha", "Kamil Kopúnek", "Dušan Tittel", "Jozef Adamec", "Ladislav Kubala", "Jozef Vengloš", "František Plánička", "Juraj Slafkovský", "Tomáš Tatar",
  "Martin Pospíšil", "Martin Fehérváry", "Šimon Nemec", "Marek Hrivík", "Richard Pánik", "Branislav Mezei", "Andrej Sekera", "Marek Svatoš", "Jozef Stümpel", "Richard Zedník",
  "Roman Čechmánek", "Ján Lašák", "Rastislav Staňa", "Jozef Golonka", "Vladimír Dzurilla", "Dárius Rusnák", "Igor Liba", "Zigmund Pálffy", "Miroslav Ihnačák", "Róbert Pál",
  "Martina Moravcová", "Richard Nagy", "Tomáš Klobučník", "Katarína Remeňová", "Elena Kaliská", "Zuzana Rehák-Štefečeková", "Danka Barteková", "Jozef Gönci", "Michal Kováč", "Michal Čajkovský",
  "Ivan Klement", "Ján Svorada", "Peter Velits", "Martin Velits", "Jozef Metelka", "Tibor Linka", "Denisa Baránková", "Boris Valábik", "Mário Lunter", "Richard Tóth",
  "Lukáš Krpálek", "Attila Végh", "Ivan Buchinger", "Gábor Boráros", "Monika Chochlíková", "Alex Molčan", "Lukáš Lacko", "Karol Kučera", "Miloš Mečíř", "Dominik Hrbatý",
  "Martin Kližan", "Viktória Kužmová", "Rebecca Šramková", "Jana Čepelová", "Michal Martikán", "Vladimír Országh",
];

const VIDEO_GAME_CHARACTERS = [
  "Super Mario", "Luigi", "Princezná Peach", "Bowser", "Yoshi", "Toad", "Donkey Kong", "Link", "Princezná Zelda", "Ganondorf",
  "Sonic", "Tails", "Knuckles", "Dr. Eggman", "Pikachu", "Charizard", "Mewtwo", "Kirby", "Samus Aranová", "Fox McCloud",
  "Pac-Man", "Mega Man", "Crash Bandicoot", "Coco Bandicoot", "Spyro", "Rayman", "Sackboy", "Steve z Minecraftu", "Alex z Minecraftu", "Creeper",
  "Enderman", "Lara Croft", "Nathan Drake", "Kratos", "Atreus", "Aloy", "Geralt z Rivie", "Ciri", "Yennefer", "Master Chief",
  "Cortana", "Doom Slayer", "Solid Snake", "Agent 47", "Leon Kennedy", "Jill Valentineová", "Chris Redfield", "Claire Redfieldová", "Nemesis", "Albert Wesker",
  "Arthur Morgan", "John Marston", "Trevor Philips", "Michael De Santa", "Franklin Clinton", "CJ zo San Andreas", "Niko Bellic", "Tommy Vercetti", "Max Payne", "Alan Wake",
  "Ezio Auditore", "Altaïr", "Bayek", "Kassandra", "Eivor", "Prince of Persia", "Ryu", "Ken Masters", "Chun-Li", "M. Bison",
  "Scorpion", "Sub-Zero", "Raiden", "Liu Kang", "Kitana", "Sonya Blade", "Johnny Cage", "Cloud Strife", "Sephiroth", "Tifa Lockhartová",
  "Sora", "Joker z Persony", "2B", "Tracer", "D.Va", "Mercy", "Reaper", "Winston", "Jinx", "Ahri",
  "Teemo", "Garen", "Fortnite Jonesy", "Peely", "Among Us Crewmate", "Fall Guys postavička", "Gordon Freeman", "GLaDOS", "Chell", "Alyx Vanceová",
  "Marcus Fenix", "Commander Shepard", "Tali'Zorah", "Joel Miller", "Ellie Williamsová", "Big Daddy z BioShock", "Dutch van der Linde", "Handsome Jack", "Claptrap", "Vault Boy",
  "Sans", "Papyrus", "Cuphead", "Mugman", "Freddy Fazbear", "Bonnie", "Chica", "Foxy", "Bendy", "Huggy Wuggy",
];

const HEROES_AND_VILLAINS = [
  "Spider-Man", "Iron Man", "Captain America", "Thor", "Hulk", "Black Widow", "Hawkeye", "Doctor Strange", "Black Panther", "Captain Marvel",
  "Ant-Man", "Wasp", "Scarlet Witch", "Vision", "Falcon", "Winter Soldier", "Star-Lord", "Gamora", "Drax", "Groot",
  "Rocket Raccoon", "Wolverine", "Deadpool", "Professor X", "Magneto", "Storm", "Cyclops", "Jean Grey", "Mystique", "Daredevil",
  "Punisher", "Blade", "Moon Knight", "She-Hulk", "Ms. Marvel", "Shang-Chi", "Nick Fury", "Silver Surfer", "Ghost Rider", "Fantastic Four",
  "Thanos", "Loki", "Ultron", "Green Goblin", "Doctor Octopus", "Venom", "Carnage", "Red Skull", "Hela", "Killmonger",
  "Batman", "Superman", "Wonder Woman", "Aquaman", "The Flash", "Cyborg", "Green Lantern", "Shazam", "Supergirl", "Batgirl",
  "Robin", "Nightwing", "Green Arrow", "Black Canary", "Martian Manhunter", "Blue Beetle", "Constantine", "Harley Quinn", "Catwoman", "Peacemaker",
  "Joker", "Lex Luthor", "Darkseid", "Bane", "The Riddler", "Penguin", "Two-Face", "Poison Ivy", "Scarecrow", "Deathstroke",
  "Harry Potter", "Hermione Granger", "Ron Weasley", "Albus Dumbledore", "Severus Snape", "Rubeus Hagrid", "Sirius Black", "Dobby", "Lord Voldemort", "Draco Malfoy",
  "Frodo Baggins", "Samwise Gamgee", "Gandalf", "Aragorn", "Legolas", "Gimli", "Galadriel", "Gollum", "Sauron", "Saruman",
  "Luke Skywalker", "Leia Organa", "Han Solo", "Obi-Wan Kenobi", "Yoda", "Ahsoka Tano", "The Mandalorian", "Grogu", "Darth Vader", "Emperor Palpatine",
  "Rey", "Kylo Ren", "Finn", "Chewbacca", "R2-D2", "C-3PO", "Katniss Everdeen", "Peeta Mellark", "Indiana Jones", "Lara Croft",
  "James Bond", "Ethan Hunt", "John Wick", "Rocky Balboa", "Rambo", "The Terminator", "Neo", "Trinity", "Jack Sparrow", "Zorro",
  "Sherlock Holmes", "Robin Hood", "Hercules", "Achilles", "King Arthur", "Merlin", "Mulan", "Tarzan", "Aladdin", "Peter Pan",
  "Elsa", "Moana", "Rapunzel", "Belle", "Ariel", "Simba", "Po", "Shrek", "Hiccup", "Toothless",
  "Optimus Prime", "Bumblebee", "Megatron", "Godzilla", "King Kong", "He-Man", "She-Ra", "Power Rangers", "Teenage Mutant Ninja Turtles", "The Mask",
];

function cards(id: string) {
  return CHARACTER_CATEGORIES_BASE.find((category) => category.id === id)?.characters ?? [];
}

function uniqueCards(characters: string[]) {
  return [...new Set(characters)];
}

/** Cards that only belong to one language. Slovak players instantly recognise
 * the local cartoon classics, but an English or Spanish player would never
 * guess Maťko a Kubko, so those cards stay out of the other decks. */
const LANGUAGE_ONLY_CARDS: Record<string, Partial<Record<AppLanguage, string[]>>> = {
  "animated-characters": { sk: ANIMATED_CHARACTERS_SK_ONLY },
};

/** Decks that are fully translated per language. The entry in
 * CHARACTER_CATEGORIES keeps the deck's position in the category list, while
 * the language deck supplies the cards — e.g. animated movies are shown under
 * their official title in each language. */
const LANGUAGE_DECKS: Record<string, Record<AppLanguage, string[]>> = {
  "animated-movies": ANIMATED_MOVIES_BY_LANGUAGE,
  "world-movies": WORLD_MOVIES_BY_LANGUAGE,
  "movie-characters": MOVIE_CHARACTERS_BY_LANGUAGE,
  "series-characters": SERIES_CHARACTERS_BY_LANGUAGE,
  "world-youtubers": WORLD_YOUTUBERS_BY_LANGUAGE,
};

const SHARED_CATEGORY_EXPANSIONS: Record<string, string[]> = {
  "animated-characters": ANIMATED_CHARACTER_EXPANSION,
  "series-characters": SERIES_CHARACTER_EXPANSION,
};

function localizedCategory(category: CharacterCategory, language: AppLanguage): CharacterCategory {
  const languageDeck = LANGUAGE_DECKS[category.id]?.[language];
  const languageOnlyCards = LANGUAGE_ONLY_CARDS[category.id]?.[language];
  const sharedExpansion = SHARED_CATEGORY_EXPANSIONS[category.id] ?? [];
  const characters = uniqueCards([
    ...(languageDeck ?? category.characters),
    ...sharedExpansion,
  ]);
  return {
    ...category,
    name: CATEGORY_LABELS[category.id]?.[language] ?? category.name,
    characters: languageOnlyCards
      ? uniqueCards([...characters, ...languageOnlyCards])
      : characters,
  };
}

function additionalCategories(language: AppLanguage): CharacterCategory[] {
  return LOCALIZED_ADDITIONAL_CATEGORIES.map((category) => ({
    id: category.id,
    name: category.labels[language],
    icon: category.icon,
    characters: uniqueCards([
      ...category.characters[language],
      ...(LOCALIZED_CATEGORY_EXPANSIONS[category.id]?.[language] ?? []),
    ]),
  }));
}

export const CHARACTER_CATEGORIES: CharacterCategory[] = [
  {
    id: "world-personalities",
    name: "Svetove osobnosti",
    icon: "🌍",
    characters: uniqueCards([...cards("world-personalities"), ...cards("world-actors"), ...cards("world-musicians"), ...cards("history-science"), ...WORLD_PERSONALITIES_EXPANSION]),
  },
  {
    id: "world-athletes",
    name: "Svetovi sportovci",
    icon: "🏅",
    characters: uniqueCards(WORLD_ATHLETES),
  },
  {
    id: "world-youtubers",
    name: "Svetovi YouTuberi",
    icon: "▶️",
    // Cards come from LANGUAGE_DECKS so every language gets its own creators.
    characters: WORLD_YOUTUBERS_BY_LANGUAGE.sk,
  },
  {
    id: "slovak-personalities",
    name: "Slovenské osobnosti a herci",
    icon: "🇸🇰",
    characters: uniqueCards([...cards("slovak-personalities"), ...cards("slovak-actors"), ...cards("slovak-musicians"), ...SLOVAK_PERSONALITIES_EXTRA]),
  },
  {
    id: "slovak-athletes",
    name: "Slovenskí športovci",
    icon: "🏒",
    characters: uniqueCards([...cards("slovak-athletes"), ...SLOVAK_ATHLETES_EXTRA]),
  },
  {
    id: "movie-characters",
    name: "Filmové postavy",
    icon: "🍿",
    // Cards come from LANGUAGE_DECKS so every language gets its own names.
    characters: MOVIE_CHARACTERS_BY_LANGUAGE.sk,
  },
  {
    id: "animated-characters",
    name: "Animované postavičky",
    icon: "🎨",
    characters: uniqueCards(ANIMATED_CHARACTERS_DECK),
  },
  {
    id: "series-characters",
    name: "Postavy zo seriálov",
    icon: "📺",
    // Cards come from LANGUAGE_DECKS so every language gets its own names.
    characters: SERIES_CHARACTERS_BY_LANGUAGE.sk,
  },
  {
    id: "video-game-characters",
    name: "Postavy z videohier",
    icon: "🎮",
    characters: uniqueCards(VIDEO_GAME_CHARACTERS),
  },
  {
    id: "world-movies",
    name: "Svetové filmy",
    icon: "🎞️",
    // Cards come from LANGUAGE_DECKS so every language gets its own titles.
    characters: WORLD_MOVIES_BY_LANGUAGE.sk,
  },
  {
    id: "animated-movies",
    name: "Animované filmy",
    icon: "🎥",
    // Cards come from LANGUAGE_DECKS so every language gets its own titles.
    characters: ANIMATED_MOVIES_BY_LANGUAGE.sk,
  },
  {
    id: "heroes-villains",
    name: "Hrdinovia a zloduchovia",
    icon: "🦸",
    characters: uniqueCards(HEROES_AND_VILLAINS),
  },
  {
    id: "marvel",
    name: "Marvel postavy",
    icon: "🕷️",
    characters: uniqueCards(MARVEL_CHARACTERS),
  },
  {
    id: "world-singers",
    name: "Svetoví speváci",
    icon: "🎤",
    characters: uniqueCards(WORLD_SINGERS),
  },
  {
    id: "world-actors",
    name: "Svetoví herci a herečky",
    icon: "🎬",
    characters: uniqueCards(WORLD_ACTORS),
  },
  {
    id: "world-bands",
    name: "Svetové kapely",
    icon: "🎸",
    characters: uniqueCards(WORLD_BANDS),
  },
  {
    id: "football-stars",
    name: "Futbalové hviezdy",
    icon: "⚽",
    characters: uniqueCards(FOOTBALL_STARS),
  },
  {
    id: "brawl-stars",
    name: "Brawl Stars",
    icon: "💥",
    characters: uniqueCards(BRAWL_STARS_CARDS),
  },
  {
    id: "minecraft",
    name: "Minecraft",
    icon: "⛏️",
    characters: uniqueCards(MINECRAFT_CARDS),
  },
  {
    id: "pokemon",
    name: "Pokémon",
    icon: "⚡",
    characters: uniqueCards(POKEMON_CARDS),
  },
  {
    id: "anime-characters",
    name: "Anime postavy",
    icon: "🌸",
    characters: uniqueCards(ANIME_CHARACTERS),
  },
  {
    id: "harry-potter",
    name: "Harry Potter",
    icon: "🪄",
    characters: uniqueCards(HARRY_POTTER_CARDS),
  },
];

export function getCharacterCategories(languageOrIncludeSlovak: AppLanguage | boolean): CharacterCategory[] {
  const language: AppLanguage = typeof languageOrIncludeSlovak === "boolean"
    ? languageOrIncludeSlovak ? "sk" : "en"
    : languageOrIncludeSlovak;
  const globalCategories = CHARACTER_CATEGORIES
    .filter((category) => !category.id.startsWith("slovak-"))
    .map((category) => localizedCategory(category, language));
  const allCategory: CharacterCategory = {
    id: "all",
    name: CATEGORY_LABELS.all[language],
    icon: "✦",
    // "All" is a virtual filter. It deliberately owns no second copy of cards.
    characters: [],
  };
  return [allCategory, ...globalCategories, ...additionalCategories(language), LOCAL_PERSONALITY_CATEGORIES[language]];
}
