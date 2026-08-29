import type { AppLanguage } from "../i18n/LanguageProvider";

/**
 * "Postavy zo seriálov" deck for "Hádaj kto som".
 *
 * Only characters from series a regular viewer knows, and each language gets
 * the name that language actually uses. Most series characters keep the same
 * name everywhere (Walter White, Jon Snow, Sheldon Cooper), but some are
 * translated — the Money Heist leader is "El Profesor" in Spanish and "Le
 * Professeur" in French, the Night King is "Nachtkönig" in German — and Slovak
 * adds the feminine ending to women's surnames (Rachel Greenová).
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

/** Helper for women whose surname only takes the Slovak feminine ending. */
function skFeminine(slovak: string, international: string): CharacterNames {
  return [slovak, international, international, international, international, international];
}

const CHARACTERS: CharacterNames[] = [
  // ── Priatelia ─────────────────────────────────────────────────────────────
  skFeminine("Rachel Greenová", "Rachel Green"),
  same("Ross Geller"),
  skFeminine("Monica Gellerová", "Monica Geller"),
  same("Chandler Bing"),
  same("Joey Tribbiani"),
  skFeminine("Phoebe Buffayová", "Phoebe Buffay"),

  // ── Teória veľkého tresku ─────────────────────────────────────────────────
  same("Sheldon Cooper"),
  same("Leonard Hofstadter"),
  same("Penny (The Big Bang Theory)"),
  same("Howard Wolowitz"),
  same("Raj Koothrappali"),

  // ── Breaking Bad a Better Call Saul ───────────────────────────────────────
  same("Walter White"),
  same("Jesse Pinkman"),
  same("Saul Goodman"),
  same("Gus Fring"),
  same("Hank Schrader"),
  same("Mike Ehrmantraut"),

  // ── The Office ────────────────────────────────────────────────────────────
  same("Michael Scott"),
  same("Dwight Schrute"),
  same("Jim Halpert"),
  skFeminine("Pam Beeslyová", "Pam Beesly"),

  // ── Ako som spoznal vašu mamu ─────────────────────────────────────────────
  same("Ted Mosby"),
  same("Barney Stinson"),
  ["Robin Scherbatská", "Robin Scherbatsky", "Robin Scherbatsky", "Robin Scherbatsky", "Robin Scherbatsky", "Robin Scherbatsky"],
  same("Marshall Eriksen"),
  skFeminine("Lily Aldrinová", "Lily Aldrin"),

  // ── Stranger Things ───────────────────────────────────────────────────────
  same("Eleven"),
  same("Mike Wheeler"),
  same("Dustin Henderson"),
  same("Lucas Sinclair"),
  same("Will Byers"),
  same("Max Mayfield"),
  same("Steve Harrington"),
  same("Jim Hopper"),
  same("Vecna"),

  // ── Hra o tróny ───────────────────────────────────────────────────────────
  same("Jon Snow"),
  same("Daenerys Targaryen"),
  same("Tyrion Lannister"),
  skFeminine("Arya Starková", "Arya Stark"),
  skFeminine("Sansa Starková", "Sansa Stark"),
  skFeminine("Cersei Lannisterová", "Cersei Lannister"),
  same("Jaime Lannister"),
  same("Ned Stark"),
  same("Joffrey Baratheon"),
  same("Khal Drogo"),
  ["Nočný kráľ", "Night King", "Nachtkönig", "Rey de la Noche", "Roi de la Nuit", "Rei da Noite"],

  // ── Papierový dom ─────────────────────────────────────────────────────────
  ["Profesor", "The Professor", "Der Professor", "El Profesor", "Le Professeur", "O Professor"],
  ["Tokio", "Tokyo", "Tokio", "Tokio", "Tokyo", "Tóquio"],
  ["Berlín", "Berlin", "Berlin", "Berlín", "Berlin", "Berlim"],
  same("Nairobi"),
  same("Denver"),

  // ── Zaklínač ──────────────────────────────────────────────────────────────
  ["Geralt z Rivie", "Geralt of Rivia", "Geralt von Riva", "Geralt de Rivia", "Geralt de Riv", "Geralt de Rivia"],
  same("Yennefer"),
  same("Ciri"),

  // ── Wednesday a Peaky Blinders ────────────────────────────────────────────
  skFeminine("Wednesday Addamsová", "Wednesday Addams"),
  skFeminine("Enid Sinclairová", "Enid Sinclair"),
  same("Thomas Shelby"),
  same("Arthur Shelby"),

  // ── Detektívky a lekárske seriály ─────────────────────────────────────────
  same("Sherlock Holmes"),
  same("John Watson"),
  same("Moriarty"),
  same("Dexter Morgan"),
  same("Dr. House"),
  skFeminine("Meredith Greyová", "Meredith Grey"),
  same("Derek Shepherd"),
  same("Columbo"),
  same("Monk"),
  same("MacGyver"),
  same("Fox Mulder"),
  skFeminine("Dana Scullyová", "Dana Scully"),

  // ── Netflix hity ──────────────────────────────────────────────────────────
  same("Joe Goldberg"),
  same("Lucifer Morningstar"),
  same("Seong Gi-hun"),
  same("Front Man"),
  skFeminine("Beth Harmonová", "Beth Harmon"),
  skFeminine("Emily Cooperová", "Emily Cooper"),
  same("Daphne Bridgerton"),
  same("Anthony Bridgerton"),
  skFeminine("Carrie Bradshawová", "Carrie Bradshaw"),

  // ── The Last of Us, Narcos a The Walking Dead ─────────────────────────────
  same("Joel Miller"),
  skFeminine("Ellie Williamsová", "Ellie Williams"),
  same("Pablo Escobar"),
  same("Rick Grimes"),
  same("Daryl Dixon"),
  same("Negan"),
  same("Billy Butcher"),

  // ── Star Wars seriály ─────────────────────────────────────────────────────
  ["Mandalorián", "The Mandalorian", "Der Mandalorianer", "El Mandaloriano", "Le Mandalorien", "O Mandaloriano"],
  same("Grogu"),
  same("Ahsoka Tano"),

  // ── Klasika a ďalšie hity ─────────────────────────────────────────────────
  same("Tony Soprano"),
  same("Don Draper"),
  same("Frank Underwood"),
  same("Harvey Specter"),
  same("Mike Ross"),
  same("Michael Scofield"),
  same("Ragnar Lothbrok"),
  same("Ted Lasso"),
  same("Johnny Lawrence"),
  same("Dean Winchester"),
  same("Sam Winchester"),
  same("Buffy"),
  same("Xena"),
  same("Mr. Bean"),
  same("Alf"),
  same("Mitch Buchannon"),
];

/** Column index of each language inside a CharacterNames row. */
const COLUMN: Record<AppLanguage, number> = { sk: 0, en: 1, de: 2, es: 3, fr: 4, pt: 5 };

function namesFor(language: AppLanguage): string[] {
  return [...new Set(CHARACTERS.map((character) => character[COLUMN[language]]))];
}

/** Every language gets the same characters under the name it actually uses. */
export const SERIES_CHARACTERS_BY_LANGUAGE: Record<AppLanguage, string[]> = {
  sk: namesFor("sk"),
  en: namesFor("en"),
  de: namesFor("de"),
  es: namesFor("es"),
  fr: namesFor("fr"),
  pt: namesFor("pt"),
};
