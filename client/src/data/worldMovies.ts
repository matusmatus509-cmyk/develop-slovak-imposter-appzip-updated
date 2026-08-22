import type { AppLanguage } from "../i18n/LanguageProvider";

/**
 * "Svetové filmy" deck for "Hádaj kto som".
 *
 * Every film is a well-known hit and every language gets the film's official
 * release title in that language, not a translated English title — a German
 * player sees "Der Pate", a Spanish player "El padrino".
 *
 * Stored row per film so all six languages stay aligned and equal in length.
 * Films whose official title in one of the six languages could not be
 * confirmed were left out rather than guessed.
 */

/** Titles in a fixed order: sk, en, de, es, fr, pt. */
type FilmTitles = readonly [
  sk: string,
  en: string,
  de: string,
  es: string,
  fr: string,
  pt: string,
];

const FILMS: FilmTitles[] = [
  // ── Legendárne drámy ──────────────────────────────────────────────────────
  ["Titanic", "Titanic", "Titanic", "Titanic", "Titanic", "Titanic"],
  ["Krstný otec", "The Godfather", "Der Pate", "El padrino", "Le Parrain", "O Padrinho"],
  ["Vykúpenie z väznice Shawshank", "The Shawshank Redemption", "Die Verurteilten", "Cadena perpetua", "Les Évadés", "Os Condenados de Shawshank"],
  ["Schindlerov zoznam", "Schindler's List", "Schindlers Liste", "La lista de Schindler", "La Liste de Schindler", "A Lista de Schindler"],
  ["Forrest Gump", "Forrest Gump", "Forrest Gump", "Forrest Gump", "Forrest Gump", "Forrest Gump"],
  ["Pianista", "The Pianist", "Der Pianist", "El pianista", "Le Pianiste", "O Pianista"],
  ["Zachráňte vojaka Ryana", "Saving Private Ryan", "Der Soldat James Ryan", "Salvar al soldado Ryan", "Il faut sauver le soldat Ryan", "O Resgate do Soldado Ryan"],
  ["Gladiátor", "Gladiator", "Gladiator", "Gladiator", "Gladiator", "Gladiador"],
  ["Oppenheimer", "Oppenheimer", "Oppenheimer", "Oppenheimer", "Oppenheimer", "Oppenheimer"],
  ["Zelená kniha", "Green Book", "Green Book", "Green Book", "Green Book", "Green Book"],
  ["Nedotknuteľní", "The Intouchables", "Ziemlich beste Freunde", "Intocable", "Intouchables", "Intocáveis"],
  ["Parazit", "Parasite", "Parasite", "Parásitos", "Parasite", "Parasitas"],
  ["Grandhotel Budapešť", "The Grand Budapest Hotel", "Grand Budapest Hotel", "El gran hotel Budapest", "The Grand Budapest Hotel", "O Grande Hotel Budapeste"],
  ["Truman Show", "The Truman Show", "Die Truman Show", "El show de Truman", "The Truman Show", "O Show de Truman"],

  // ── Gangsterky a thrillery ────────────────────────────────────────────────
  ["Pulp Fiction: Historky z podsvetia", "Pulp Fiction", "Pulp Fiction", "Pulp Fiction", "Pulp Fiction", "Pulp Fiction"],
  ["Scarface", "Scarface", "Scarface", "Scarface", "Scarface", "Scarface"],
  ["Taxikár", "Taxi Driver", "Taxi Driver", "Taxi Driver", "Taxi Driver", "Taxi Driver"],
  ["Mlčanie jahniat", "The Silence of the Lambs", "Das Schweigen der Lämmer", "El silencio de los corderos", "Le Silence des agneaux", "O Silêncio dos Inocentes"],
  ["Šiesty zmysel", "The Sixth Sense", "The Sixth Sense", "El sexto sentido", "Sixième Sens", "O Sexto Sentido"],
  ["Ostrov prekliatych", "Shutter Island", "Shutter Island", "Shutter Island", "Shutter Island", "Ilha do Medo"],
  ["Vlk z Wall Street", "The Wolf of Wall Street", "The Wolf of Wall Street", "El lobo de Wall Street", "Le Loup de Wall Street", "O Lobo de Wall Street"],
  ["Chyť ma, ak môžeš", "Catch Me If You Can", "Catch Me If You Can", "Atrápame si puedes", "Arrête-moi si tu peux", "Apanha-me Se Puderes"],
  ["Klub bitkárov", "Fight Club", "Fight Club", "El club de la lucha", "Fight Club", "Clube de Combate"],
  ["Exorcista", "The Exorcist", "Der Exorzist", "El exorcista", "L'Exorciste", "O Exorcista"],

  // ── Sci-fi a fantasy ──────────────────────────────────────────────────────
  ["Matrix", "The Matrix", "Matrix", "Matrix", "Matrix", "Matrix"],
  ["Počiatok", "Inception", "Inception", "Origen", "Inception", "A Origem"],
  ["Interstellar", "Interstellar", "Interstellar", "Interstellar", "Interstellar", "Interstellar"],
  ["Avatar", "Avatar", "Avatar", "Avatar", "Avatar", "Avatar"],
  ["Duna", "Dune", "Dune", "Dune", "Dune", "Duna"],
  ["Terminátor", "The Terminator", "Terminator", "Terminator", "Terminator", "O Exterminador Implacável"],
  ["Gravitácia", "Gravity", "Gravity", "Gravity", "Gravity", "Gravidade"],
  ["Apollo 13", "Apollo 13", "Apollo 13", "Apollo 13", "Apollo 13", "Apollo 13"],
  ["Jurský park", "Jurassic Park", "Jurassic Park", "Parque Jurásico", "Jurassic Park", "Parque Jurássico"],
  ["Čeľuste", "Jaws", "Der weiße Hai", "Tiburón", "Les Dents de la mer", "Tubarão"],
  ["King Kong", "King Kong", "King Kong", "King Kong", "King Kong", "King Kong"],
  ["Godzilla", "Godzilla", "Godzilla", "Godzilla", "Godzilla", "Godzilla"],
  ["Návrat do budúcnosti", "Back to the Future", "Zurück in die Zukunft", "Regreso al futuro", "Retour vers le futur", "Regresso ao Futuro"],
  ["E.T. – Mimozemšťan", "E.T. the Extra-Terrestrial", "E.T. – Der Außerirdische", "E.T., el extraterrestre", "E.T. l'extra-terrestre", "E.T. – O Extraterrestre"],
  ["Krotitelia duchov", "Ghostbusters", "Ghostbusters – Die Geisterjäger", "Los cazafantasmas", "S.O.S. Fantômes", "Os Caça-Fantasmas"],

  // ── Star Wars ─────────────────────────────────────────────────────────────
  ["Star Wars: Nová nádej", "Star Wars: A New Hope", "Star Wars: Eine neue Hoffnung", "Star Wars: Una nueva esperanza", "Star Wars : Un nouvel espoir", "Star Wars: Uma Nova Esperança"],
  ["Star Wars: Impérium vracia úder", "The Empire Strikes Back", "Das Imperium schlägt zurück", "El Imperio contraataca", "L'Empire contre-attaque", "O Império Contra-Ataca"],
  ["Star Wars: Návrat Jediho", "Return of the Jedi", "Die Rückkehr der Jedi-Ritter", "El retorno del Jedi", "Le Retour du Jedi", "O Regresso de Jedi"],
  ["Rogue One: Star Wars Story", "Rogue One: A Star Wars Story", "Rogue One: A Star Wars Story", "Rogue One: Una historia de Star Wars", "Rogue One: A Star Wars Story", "Rogue One: Uma História de Star Wars"],

  // ── Pán prsteňov a Harry Potter ───────────────────────────────────────────
  ["Pán prsteňov: Spoločenstvo prsteňa", "The Lord of the Rings: The Fellowship of the Ring", "Der Herr der Ringe: Die Gefährten", "El señor de los anillos: La comunidad del anillo", "Le Seigneur des anneaux : La Communauté de l'anneau", "O Senhor dos Anéis: A Irmandade do Anel"],
  ["Pán prsteňov: Dve veže", "The Lord of the Rings: The Two Towers", "Der Herr der Ringe: Die zwei Türme", "El señor de los anillos: Las dos torres", "Le Seigneur des anneaux : Les Deux Tours", "O Senhor dos Anéis: As Duas Torres"],
  ["Pán prsteňov: Návrat kráľa", "The Lord of the Rings: The Return of the King", "Der Herr der Ringe: Die Rückkehr des Königs", "El señor de los anillos: El retorno del rey", "Le Seigneur des anneaux : Le Retour du roi", "O Senhor dos Anéis: O Regresso do Rei"],
  ["Hobit: Neočakávaná cesta", "The Hobbit: An Unexpected Journey", "Der Hobbit: Eine unerwartete Reise", "El hobbit: Un viaje inesperado", "Le Hobbit : Un voyage inattendu", "O Hobbit: Uma Jornada Inesperada"],
  ["Harry Potter a Kameň mudrcov", "Harry Potter and the Philosopher's Stone", "Harry Potter und der Stein der Weisen", "Harry Potter y la piedra filosofal", "Harry Potter à l'école des sorciers", "Harry Potter e a Pedra Filosofal"],
  ["Harry Potter a väzeň z Azkabanu", "Harry Potter and the Prisoner of Azkaban", "Harry Potter und der Gefangene von Askaban", "Harry Potter y el prisionero de Azkaban", "Harry Potter et le Prisonnier d'Azkaban", "Harry Potter e o Prisioneiro de Azkaban"],
  ["Piráti Karibiku", "Pirates of the Caribbean", "Pirates of the Caribbean", "Piratas del Caribe", "Pirates des Caraïbes", "Piratas das Caraíbas"],
  ["Hunger Games", "The Hunger Games", "Die Tribute von Panem", "Los juegos del hambre", "Hunger Games", "Os Jogos da Fome"],
  ["Čarodejník z krajiny Oz", "The Wizard of Oz", "Der Zauberer von Oz", "El mago de Oz", "Le Magicien d'Oz", "O Feiticeiro de Oz"],
  ["Charlie a továreň na čokoládu", "Charlie and the Chocolate Factory", "Charlie und die Schokoladenfabrik", "Charlie y la fábrica de chocolate", "Charlie et la Chocolaterie", "Charlie e a Fábrica de Chocolate"],
  ["Mary Poppins", "Mary Poppins", "Mary Poppins", "Mary Poppins", "Mary Poppins", "Mary Poppins"],
  ["Jumanji", "Jumanji", "Jumanji", "Jumanji", "Jumanji", "Jumanji"],

  // ── Akcia ─────────────────────────────────────────────────────────────────
  ["Temný rytier", "The Dark Knight", "The Dark Knight", "El caballero oscuro", "The Dark Knight : Le Chevalier noir", "O Cavaleiro das Trevas"],
  ["Joker", "Joker", "Joker", "Joker", "Joker", "Joker"],
  ["Smrtonosná pasca", "Die Hard", "Stirb langsam", "La jungla de cristal", "Piège de cristal", "Assalto ao Arranha-Céus"],
  ["John Wick", "John Wick", "John Wick", "John Wick", "John Wick", "John Wick"],
  ["Mission: Impossible", "Mission: Impossible", "Mission: Impossible", "Misión imposible", "Mission : Impossible", "Missão Impossível"],
  ["Casino Royale", "Casino Royale", "Casino Royale", "Casino Royale", "Casino Royale", "Casino Royale"],
  ["Skyfall", "Skyfall", "Skyfall", "Skyfall", "Skyfall", "Skyfall"],
  ["Top Gun", "Top Gun", "Top Gun", "Top Gun", "Top Gun", "Top Gun"],
  ["Rocky", "Rocky", "Rocky", "Rocky", "Rocky", "Rocky"],
  ["Rambo", "Rambo", "Rambo", "Rambo", "Rambo", "Rambo"],
  ["Kill Bill", "Kill Bill", "Kill Bill", "Kill Bill", "Kill Bill", "Kill Bill"],
  ["Mad Max: Zbesilá cesta", "Mad Max: Fury Road", "Mad Max: Fury Road", "Mad Max: Furia en la carretera", "Mad Max: Fury Road", "Mad Max: Estrada da Fúria"],
  ["Dannyho jedenástka", "Ocean's Eleven", "Ocean's Eleven", "Ocean's Eleven", "Ocean's Eleven", "Ocean's Eleven"],

  // ── Komédie a romantika ───────────────────────────────────────────────────
  ["Sám doma", "Home Alone", "Kevin – Allein zu Haus", "Solo en casa", "Maman, j'ai raté l'avion !", "Sozinho em Casa"],
  ["Maska", "The Mask", "Die Maske", "La máscara", "The Mask", "A Máscara"],
  ["Ace Ventura", "Ace Ventura", "Ace Ventura", "Ace Ventura", "Ace Ventura", "Ace Ventura"],
  ["Vo štvorici po opici", "The Hangover", "Hangover", "Resacón en Las Vegas", "Very Bad Trip", "A Ressaca"],
  ["Pretty Woman", "Pretty Woman", "Pretty Woman", "Pretty Woman", "Pretty Woman", "Pretty Woman"],
  ["Diabol nosí Pradu", "The Devil Wears Prada", "Der Teufel trägt Prada", "El diablo se viste de Prada", "Le Diable s'habille en Prada", "O Diabo Veste Prada"],
  ["Barbie", "Barbie", "Barbie", "Barbie", "Barbie", "Barbie"],

  // ── Hudobné filmy ─────────────────────────────────────────────────────────
  ["Mamma Mia!", "Mamma Mia!", "Mamma Mia!", "Mamma Mia!", "Mamma Mia!", "Mamma Mia!"],
  ["La La Land", "La La Land", "La La Land", "La La Land", "La La Land", "La La Land"],
  ["Bohemian Rhapsody", "Bohemian Rhapsody", "Bohemian Rhapsody", "Bohemian Rhapsody", "Bohemian Rhapsody", "Bohemian Rhapsody"],
  ["Dirty Dancing", "Dirty Dancing", "Dirty Dancing", "Dirty Dancing", "Dirty Dancing", "Dirty Dancing"],
  ["Grease", "Grease", "Grease", "Grease", "Grease", "Grease"],
];

/** Column index of each language inside a FilmTitles row. */
const COLUMN: Record<AppLanguage, number> = { sk: 0, en: 1, de: 2, es: 3, fr: 4, pt: 5 };

function titlesFor(language: AppLanguage): string[] {
  return [...new Set(FILMS.map((film) => film[COLUMN[language]]))];
}

/** Every language gets the same films, each under its own official title. */
export const WORLD_MOVIES_BY_LANGUAGE: Record<AppLanguage, string[]> = {
  sk: titlesFor("sk"),
  en: titlesFor("en"),
  de: titlesFor("de"),
  es: titlesFor("es"),
  fr: titlesFor("fr"),
  pt: titlesFor("pt"),
};
