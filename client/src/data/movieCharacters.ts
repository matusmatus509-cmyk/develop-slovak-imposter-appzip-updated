import type { AppLanguage } from "../i18n/LanguageProvider";

/**
 * "Filmové postavy" deck for "Hádaj kto som".
 *
 * Only characters a regular filmgoer recognises instantly, and each language
 * gets the name that language actually uses. Most film characters keep the same
 * name everywhere (James Bond, Jack Sparrow, Neo), but dubbing and book
 * translations rename a few — Snape is "Rogue" in French, Frodo Baggins is
 * "Frodo Bublík" in Slovak and "Frodo Beutlin" in German — and those rows are
 * localised properly.
 *
 * Marvel and DC characters are deliberately absent: they already have their own
 * "Marvel postavy" and "Hrdinovia a zloduchovia" categories.
 *
 * Stored row per character so all six languages stay aligned and equal in
 * length.
 */

/** Names in a fixed order: sk, en, de, es, fr, pt. */
type CharacterNames = readonly [
  sk: string,
  en: string,
  de: string,
  es: string,
  fr: string,
  pt: string,
];

/** Helper for the many characters whose name is identical in all languages. */
function same(name: string): CharacterNames {
  return [name, name, name, name, name, name];
}

const CHARACTERS: CharacterNames[] = [
  // ── Harry Potter ──────────────────────────────────────────────────────────
  same("Harry Potter"),
  ["Hermiona Grangerová", "Hermione Granger", "Hermine Granger", "Hermione Granger", "Hermione Granger", "Hermione Granger"],
  same("Ron Weasley"),
  same("Albus Dumbledore"),
  ["Severus Snape", "Severus Snape", "Severus Snape", "Severus Snape", "Severus Rogue", "Severus Snape"],
  same("Rubeus Hagrid"),
  same("Lord Voldemort"),
  ["Draco Malfoy", "Draco Malfoy", "Draco Malfoy", "Draco Malfoy", "Drago Malefoy", "Draco Malfoy"],
  same("Sirius Black"),
  same("Dobby"),

  // ── Pán prsteňov a Hobit ──────────────────────────────────────────────────
  ["Frodo Bublík", "Frodo Baggins", "Frodo Beutlin", "Frodo Bolsón", "Frodon Sacquet", "Frodo Baggins"],
  ["Bilbo Bublík", "Bilbo Baggins", "Bilbo Beutlin", "Bilbo Bolsón", "Bilbon Sacquet", "Bilbo Baggins"],
  same("Gandalf"),
  same("Aragorn"),
  same("Legolas"),
  same("Gimli"),
  ["Glum", "Gollum", "Gollum", "Gollum", "Gollum", "Gollum"],
  same("Sauron"),
  same("Saruman"),
  ["Galadriel", "Galadriel", "Galadriel", "Galadriel", "Galadriel", "Galadriel"],

  // ── Star Wars ─────────────────────────────────────────────────────────────
  same("Luke Skywalker"),
  ["Princezná Leia", "Princess Leia", "Prinzessin Leia", "Princesa Leia", "Princesse Leia", "Princesa Leia"],
  same("Han Solo"),
  same("Darth Vader"),
  same("Yoda"),
  same("Chewbacca"),
  same("Obi-Wan Kenobi"),
  same("R2-D2"),
  same("C-3PO"),
  same("Boba Fett"),
  ["Cisár Palpatine", "Emperor Palpatine", "Imperator Palpatine", "Emperador Palpatine", "Empereur Palpatine", "Imperador Palpatine"],
  same("Kylo Ren"),
  same("Rey"),

  // ── Piráti Karibiku ───────────────────────────────────────────────────────
  ["Jack Sparrow", "Jack Sparrow", "Jack Sparrow", "Jack Sparrow", "Jack Sparrow", "Jack Sparrow"],
  same("Will Turner"),
  ["Elizabeth Swannová", "Elizabeth Swann", "Elizabeth Swann", "Elizabeth Swann", "Elizabeth Swann", "Elizabeth Swann"],
  same("Davy Jones"),

  // ── Akční hrdinovia ───────────────────────────────────────────────────────
  same("James Bond"),
  same("Indiana Jones"),
  same("Ethan Hunt"),
  same("John Wick"),
  same("John McClane"),
  same("Rocky Balboa"),
  ["Rambo", "Rambo", "Rambo", "Rambo", "Rambo", "Rambo"],
  same("Lara Croft"),
  ["Terminátor", "The Terminator", "Terminator", "Terminator", "Terminator", "Exterminador"],
  same("RoboCop"),
  same("Mad Max"),
  same("Maverick"),
  same("Dominic Toretto"),
  same("Beatrix Kiddo"),
  same("Maximus"),
  same("Katniss Everdeen"),
  ["Ellen Ripleyová", "Ellen Ripley", "Ellen Ripley", "Ellen Ripley", "Ellen Ripley", "Ellen Ripley"],
  ["Predátor", "Predator", "Predator", "Predator", "Predator", "Predador"],

  // ── Matrix a sci-fi ───────────────────────────────────────────────────────
  same("Neo"),
  same("Trinity"),
  same("Morpheus"),
  same("Marty McFly"),
  ["Doktor Emmett Brown", "Doc Brown", "Doc Brown", "Doc Brown", "Doc Brown", "Doc Brown"],
  same("E.T."),
  same("Jake Sully"),
  same("Neytiri"),
  same("Paul Atreides"),
  same("King Kong"),
  same("Godzilla"),

  // ── Gangsterky a thrillery ────────────────────────────────────────────────
  same("Vito Corleone"),
  same("Michael Corleone"),
  same("Tony Montana"),
  same("Tyler Durden"),
  same("Jordan Belfort"),
  same("Hannibal Lecter"),
  ["Clarice Starlingová", "Clarice Starling", "Clarice Starling", "Clarice Starling", "Clarice Starling", "Clarice Starling"],
  same("Norman Bates"),
  same("Travis Bickle"),
  same("Sherlock Holmes"),

  // ── Horory ────────────────────────────────────────────────────────────────
  same("Freddy Krueger"),
  same("Jason Voorhees"),
  same("Michael Myers"),
  same("Chucky"),
  same("Pennywise"),
  same("Ghostface"),
  same("Dracula"),

  // ── Komédie a rodinné filmy ───────────────────────────────────────────────
  same("Forrest Gump"),
  same("Mr. Bean"),
  same("Ace Ventura"),
  same("Kevin McCallister"),
  same("Willy Wonka"),
  same("Mary Poppins"),
  ["Edward Nožnicovoruký", "Edward Scissorhands", "Edward mit den Scherenhänden", "Eduardo Manostijeras", "Edward aux mains d'argent", "Eduardo Mãos de Tesoura"],
  ["Bridget Jonesová", "Bridget Jones", "Bridget Jones", "Bridget Jones", "Bridget Jones", "Bridget Jones"],
  ["Elle Woodsová", "Elle Woods", "Elle Woods", "Elle Woods", "Elle Woods", "Elle Woods"],
  same("Miranda Priestly"),
  same("Truman Burbank"),
  ["Amélie Poulainová", "Amélie Poulain", "Amélie Poulain", "Amélie Poulain", "Amélie Poulain", "Amélie Poulain"],
  same("Barbie"),
  same("Ken"),
  same("Daniel LaRusso"),
  ["Pán Miyagi", "Mr. Miyagi", "Mr. Miyagi", "Sr. Miyagi", "M. Miyagi", "Sr. Miyagi"],

  // ── Titanic ───────────────────────────────────────────────────────────────
  same("Jack Dawson"),
  ["Rose DeWitt Bukaterová", "Rose DeWitt Bukater", "Rose DeWitt Bukater", "Rose DeWitt Bukater", "Rose DeWitt Bukater", "Rose DeWitt Bukater"],
];

/** Column index of each language inside a CharacterNames row. */
const COLUMN: Record<AppLanguage, number> = { sk: 0, en: 1, de: 2, es: 3, fr: 4, pt: 5 };

function namesFor(language: AppLanguage): string[] {
  return [...new Set(CHARACTERS.map((character) => character[COLUMN[language]]))];
}

/** Every language gets the same characters under the name it actually uses. */
export const MOVIE_CHARACTERS_BY_LANGUAGE: Record<AppLanguage, string[]> = {
  sk: namesFor("sk"),
  en: namesFor("en"),
  de: namesFor("de"),
  es: namesFor("es"),
  fr: namesFor("fr"),
  pt: namesFor("pt"),
};
