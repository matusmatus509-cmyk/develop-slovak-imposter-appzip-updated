import type { AppLanguage } from "../i18n/LanguageProvider";

/**
 * "Animované filmy" deck for "Hádaj kto som".
 *
 * Every film is a well-known hit, and every language gets the film's official
 * release title in that language — not a translated English title. A Spanish
 * player sees "El rey león", a German player "Der König der Löwen".
 *
 * The deck is stored row per film so all six languages are guaranteed to stay
 * aligned and equal in length. Films whose official title in one of the six
 * languages could not be confirmed were left out rather than guessed.
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
  // ── Klasické Disney rozprávky ──────────────────────────────────────────────
  ["Snehulienka a sedem trpaslíkov", "Snow White and the Seven Dwarfs", "Schneewittchen und die sieben Zwerge", "Blancanieves y los siete enanitos", "Blanche-Neige et les Sept Nains", "Branca de Neve e os Sete Anões"],
  ["Pinocchio", "Pinocchio", "Pinocchio", "Pinocho", "Pinocchio", "Pinóquio"],
  ["Fantázia", "Fantasia", "Fantasia", "Fantasía", "Fantasia", "Fantasia"],
  ["Dumbo", "Dumbo", "Dumbo", "Dumbo", "Dumbo", "Dumbo"],
  ["Bambi", "Bambi", "Bambi", "Bambi", "Bambi", "Bambi"],
  ["Popoluška", "Cinderella", "Cinderella", "La Cenicienta", "Cendrillon", "A Cinderela"],
  ["Alica v krajine zázrakov", "Alice in Wonderland", "Alice im Wunderland", "Alicia en el país de las maravillas", "Alice au pays des merveilles", "Alice no País das Maravilhas"],
  ["Peter Pan", "Peter Pan", "Peter Pan", "Peter Pan", "Peter Pan", "Peter Pan"],
  ["Lady a Tramp", "Lady and the Tramp", "Susi und Strolch", "La dama y el vagabundo", "La Belle et le Clochard", "A Dama e o Vagabundo"],
  ["Šípková Ruženka", "Sleeping Beauty", "Dornröschen", "La bella durmiente", "La Belle au bois dormant", "A Bela Adormecida"],
  ["101 dalmatíncov", "One Hundred and One Dalmatians", "101 Dalmatiner", "101 dálmatas", "Les 101 Dalmatiens", "Os 101 Dálmatas"],
  ["Kniha džunglí", "The Jungle Book", "Das Dschungelbuch", "El libro de la selva", "Le Livre de la jungle", "O Livro da Selva"],
  ["Robin Hood", "Robin Hood", "Robin Hood", "Robin Hood", "Robin des Bois", "Robin dos Bosques"],

  // ── Disney renesancia ─────────────────────────────────────────────────────
  ["Malá morská víla", "The Little Mermaid", "Arielle, die Meerjungfrau", "La sirenita", "La Petite Sirène", "A Pequena Sereia"],
  ["Kráska a zviera", "Beauty and the Beast", "Die Schöne und das Biest", "La bella y la bestia", "La Belle et la Bête", "A Bela e o Monstro"],
  ["Aladin", "Aladdin", "Aladdin", "Aladdín", "Aladdin", "Aladdin"],
  ["Leví kráľ", "The Lion King", "Der König der Löwen", "El rey león", "Le Roi lion", "O Rei Leão"],
  ["Pocahontas", "Pocahontas", "Pocahontas", "Pocahontas", "Pocahontas", "Pocahontas"],
  ["Zvonár u Matky Božej", "The Hunchback of Notre Dame", "Der Glöckner von Notre Dame", "El jorobado de Notre Dame", "Le Bossu de Notre-Dame", "O Corcunda de Notre Dame"],
  ["Herkules", "Hercules", "Hercules", "Hércules", "Hercule", "Hércules"],
  ["Mulan", "Mulan", "Mulan", "Mulan", "Mulan", "Mulan"],
  ["Tarzan", "Tarzan", "Tarzan", "Tarzán", "Tarzan", "Tarzan"],

  // ── Moderné Disney ────────────────────────────────────────────────────────
  ["Lilo a Stitch", "Lilo & Stitch", "Lilo & Stitch", "Lilo y Stitch", "Lilo et Stitch", "Lilo e Stitch"],
  ["Princezná a žaba", "The Princess and the Frog", "Küss den Frosch", "Tiana y el sapo", "La Princesse et la Grenouille", "A Princesa e o Sapo"],
  ["Na vlásku", "Tangled", "Rapunzel – Neu verföhnt", "Enredados", "Raiponce", "Entrelaçados"],
  ["Ľadové kráľovstvo", "Frozen", "Die Eiskönigin", "Frozen", "La Reine des neiges", "Frozen – O Reino do Gelo"],
  ["Ľadové kráľovstvo 2", "Frozen 2", "Die Eiskönigin 2", "Frozen 2", "La Reine des neiges 2", "Frozen 2"],
  ["Veľká šestka", "Big Hero 6", "Baymax – Riesiges Robowabohu", "Big Hero 6", "Les Nouveaux Héros", "Operação Big Hero"],
  ["Zootropolis", "Zootopia", "Zoomania", "Zootrópolis", "Zootopie", "Zootrópolis"],
  ["Odvážna Vaiana", "Moana", "Vaiana", "Vaiana", "Vaiana", "Vaiana"],
  ["Encanto", "Encanto", "Encanto", "Encanto", "Encanto", "Encanto"],
  ["Raya a posledný drak", "Raya and the Last Dragon", "Raya und der letzte Drache", "Raya y el último dragón", "Raya et le Dernier Dragon", "Raya e o Último Dragão"],

  // ── Pixar ─────────────────────────────────────────────────────────────────
  ["Toy Story", "Toy Story", "Toy Story", "Toy Story", "Toy Story", "Toy Story"],
  ["Toy Story 2", "Toy Story 2", "Toy Story 2", "Toy Story 2", "Toy Story 2", "Toy Story 2"],
  ["Toy Story 3", "Toy Story 3", "Toy Story 3", "Toy Story 3", "Toy Story 3", "Toy Story 3"],
  ["Toy Story 4", "Toy Story 4", "Toy Story 4", "Toy Story 4", "Toy Story 4", "Toy Story 4"],
  ["Príšerky s.r.o.", "Monsters, Inc.", "Die Monster AG", "Monstruos, S.A.", "Monstres et Cie", "Monstros e Companhia"],
  ["Hľadá sa Nemo", "Finding Nemo", "Findet Nemo", "Buscando a Nemo", "Le Monde de Némo", "Procura-se Nemo"],
  ["Hľadá sa Dory", "Finding Dory", "Findet Dorie", "Buscando a Dory", "Le Monde de Dory", "Procura-se Dory"],
  ["Úžasňákovci", "The Incredibles", "Die Unglaublichen", "Los Increíbles", "Les Indestructibles", "Os Super-Heróis"],
  ["Úžasňákovci 2", "Incredibles 2", "Die Unglaublichen 2", "Los Increíbles 2", "Les Indestructibles 2", "Os Super-Heróis 2"],
  ["Autá", "Cars", "Cars", "Cars", "Cars", "Carros"],
  ["Autá 2", "Cars 2", "Cars 2", "Cars 2", "Cars 2", "Carros 2"],
  ["Autá 3", "Cars 3", "Cars 3", "Cars 3", "Cars 3", "Carros 3"],
  ["Ratatouille", "Ratatouille", "Ratatouille", "Ratatouille", "Ratatouille", "Ratatouille"],
  ["WALL-E", "WALL-E", "WALL-E", "WALL-E", "WALL-E", "WALL-E"],
  ["V hlave", "Inside Out", "Alles steht Kopf", "Del revés", "Vice-versa", "Divertida-Mente"],
  ["V hlave 2", "Inside Out 2", "Alles steht Kopf 2", "Del revés 2", "Vice-versa 2", "Divertida-Mente 2"],
  ["Coco", "Coco", "Coco", "Coco", "Coco", "Coco"],
  ["Soul", "Soul", "Soul", "Soul", "Soul", "Soul"],
  ["Luca", "Luca", "Luca", "Luca", "Luca", "Luca"],
  ["Lightyear", "Lightyear", "Lightyear", "Lightyear", "Buzz l'Éclair", "Lightyear"],

  // ── DreamWorks ────────────────────────────────────────────────────────────
  ["Shrek", "Shrek", "Shrek", "Shrek", "Shrek", "Shrek"],
  ["Shrek 2", "Shrek 2", "Shrek 2", "Shrek 2", "Shrek 2", "Shrek 2"],
  ["Shrek Tretí", "Shrek the Third", "Shrek der Dritte", "Shrek Tercero", "Shrek le troisième", "Shrek o Terceiro"],
  ["Madagaskar", "Madagascar", "Madagascar", "Madagascar", "Madagascar", "Madagáscar"],
  ["Kung Fu Panda", "Kung Fu Panda", "Kung Fu Panda", "Kung Fu Panda", "Kung Fu Panda", "Kung Fu Panda"],
  ["Kung Fu Panda 2", "Kung Fu Panda 2", "Kung Fu Panda 2", "Kung Fu Panda 2", "Kung Fu Panda 2", "Kung Fu Panda 2"],
  ["Kung Fu Panda 3", "Kung Fu Panda 3", "Kung Fu Panda 3", "Kung Fu Panda 3", "Kung Fu Panda 3", "Kung Fu Panda 3"],
  ["Ako si vycvičiť draka", "How to Train Your Dragon", "Drachenzähmen leicht gemacht", "Cómo entrenar a tu dragón", "Dragons", "Como Treinares o Teu Dragão"],
  ["Ako si vycvičiť draka 2", "How to Train Your Dragon 2", "Drachenzähmen leicht gemacht 2", "Cómo entrenar a tu dragón 2", "Dragons 2", "Como Treinares o Teu Dragão 2"],
  ["Kocúr v čižmách", "Puss in Boots", "Der gestiefelte Kater", "El gato con botas", "Le Chat potté", "O Gato das Botas"],
  ["Megamozog", "Megamind", "Megamind", "Megamente", "Megamind", "Megamente"],
  ["Trolls", "Trolls", "Trolls", "Trolls", "Les Trolls", "Trolls"],

  // ── Illumination ──────────────────────────────────────────────────────────
  ["Ja, zloduch", "Despicable Me", "Ich – Einfach unverbesserlich", "Gru, mi villano favorito", "Moi, moche et méchant", "Gru – O Maldisposto"],
  ["Ja, zloduch 2", "Despicable Me 2", "Ich – Einfach unverbesserlich 2", "Gru 2, mi villano favorito", "Moi, moche et méchant 2", "Gru – O Maldisposto 2"],
  ["Mimoni", "Minions", "Minions", "Los Minions", "Les Minions", "Minions"],
  ["Grinch", "The Grinch", "Der Grinch", "El Grinch", "Le Grinch", "O Grinch"],
  ["Super Mario Bros. vo filme", "The Super Mario Bros. Movie", "Der Super Mario Bros. Film", "Super Mario Bros.: La película", "Super Mario Bros. le film", "Super Mario Bros. – O Filme"],

  // ── Ďalšie veľké animované hity ───────────────────────────────────────────
  ["Doba ľadová", "Ice Age", "Ice Age", "Ice Age: La edad de hielo", "L'Âge de glace", "A Idade do Gelo"],
  ["Rio", "Rio", "Rio", "Rio", "Rio", "Rio"],
  ["Ferdinand", "Ferdinand", "Ferdinand", "Ferdinand", "Ferdinand", "Ferdinand"],
  ["Hotel Transylvánia", "Hotel Transylvania", "Hotel Transsilvanien", "Hotel Transilvania", "Hôtel Transylvanie", "Hotel Transilvânia"],
  ["Šmolkovia", "The Smurfs", "Die Schlümpfe", "Los Pitufos", "Les Schtroumpfs", "Os Estrumpfes"],
  ["Spider-Man: Paralelné svety", "Spider-Man: Into the Spider-Verse", "Spider-Man: A New Universe", "Spider-Man: Un nuevo universo", "Spider-Man: New Generation", "Spider-Man: No Universo Aranha"],
  ["Coraline", "Coraline", "Coraline", "Coraline", "Coraline", "Coraline"],
  ["Wallace a Gromit", "Wallace & Gromit", "Wallace & Gromit", "Wallace y Gromit", "Wallace et Gromit", "Wallace e Gromit"],
  ["Cesta do fantázie", "Spirited Away", "Chihiros Reise ins Zauberland", "El viaje de Chihiro", "Le Voyage de Chihiro", "A Viagem de Chihiro"],
  ["Môj sused Totoro", "My Neighbor Totoro", "Mein Nachbar Totoro", "Mi vecino Totoro", "Mon voisin Totoro", "O Meu Vizinho Totoro"],
  ["Happy Feet", "Happy Feet", "Happy Feet", "Happy Feet", "Happy Feet", "Happy Feet"],
  ["Rango", "Rango", "Rango", "Rango", "Rango", "Rango"],
  ["Angry Birds vo filme", "The Angry Birds Movie", "Angry Birds – Der Film", "Angry Birds: La película", "Angry Birds – Le Film", "Angry Birds – O Filme"],
  ["Polárny expres", "The Polar Express", "Der Polarexpress", "El expreso polar", "Le Pôle express", "O Expresso Polar"],
  ["Balto", "Balto", "Balto", "Balto", "Balto", "Balto"],
  ["Klaus", "Klaus", "Klaus", "Klaus", "Klaus", "Klaus"],
];

/** Column index of each language inside a FilmTitles row. */
const COLUMN: Record<AppLanguage, number> = { sk: 0, en: 1, de: 2, es: 3, fr: 4, pt: 5 };

function titlesFor(language: AppLanguage): string[] {
  return [...new Set(FILMS.map((film) => film[COLUMN[language]]))];
}

/** Every language gets the same films, each under its own official title. */
export const ANIMATED_MOVIES_BY_LANGUAGE: Record<AppLanguage, string[]> = {
  sk: titlesFor("sk"),
  en: titlesFor("en"),
  de: titlesFor("de"),
  es: titlesFor("es"),
  fr: titlesFor("fr"),
  pt: titlesFor("pt"),
};
