import type { AppLanguage } from "../i18n/LanguageProvider";

/**
 * "Svetoví YouTuberi" deck for "Hádaj kto som".
 *
 * YouTuber names are brand names — they are not translated, so a "localised
 * title" makes no sense here. What differs by language is *who the player
 * actually knows*: a Spanish player knows El Rubius and Ibai, a German player
 * MontanaBlack and Trymacs, a Slovak player GoGo and Expl0ited.
 *
 * So each language gets the globally famous creators plus the ones big in that
 * language area. Small, regional channels nobody outside their country would
 * guess are deliberately left out.
 */

function creators(entries: string): string[] {
  return entries
    .split("|")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/** Creators known everywhere, in every language. */
const GLOBAL = creators(`
MrBeast|PewDiePie|Markiplier|Jacksepticeye|KSI|Logan Paul|Jake Paul|IShowSpeed|Kai Cenat|Dream|
DanTDM|Ninja|Khaby Lame|Zach King|Marques Brownlee|Mrwhosetheboss|Linus Tech Tips|Unbox Therapy|Mark Rober|Veritasium|
Kurzgesagt|Vsauce|Dude Perfect|Sidemen|Ryan Trahan|Emma Chamberlain|Charli D'Amelio|Addison Rae|LazarBeam|Technoblade|
TommyInnit|GeorgeNotFound|Pokimane|Valkyrae|SypherPK|CoryxKenshin|TheOdd1sOut|Jaiden Animations|MatPat|Good Mythical Morning|
Gordon Ramsay|David Dobrik|Miniminter|W2S|Smosh|Jenna Marbles|Liza Koshy|How Ridiculous|
Yes Theory|5-Minute Crafts|Alan Chikin Chow|Nas Daily
`);

/** Slovak and Czech creators. The app already treats SK and CZ as one scene. */
const LOCAL_SK = creators(`
GoGo|Expl0ited|Selassie|Duklock|Baxtrix|MenT|Gejmr|Agraelus|Kovy|Jirka Král|
Tary|Vidrail
`);

/** British creators beyond the ones everybody already knows. */
const LOCAL_EN = creators(`
Ali-A|Vikkstar123|Zerkaa|Behzinga|TBJZL|Tom Scott|Colin Furze|Yogscast
`);

/** German-speaking creators. */
const LOCAL_DE = creators(`
MontanaBlack|Papaplatte|Trymacs|Knossi|Gronkh|unge|Rewinside|Rezo|Julien Bam|Dagi Bee|
Pamela Reif|HandOfBlood|BibisBeautyPalace
`);

/** Spanish and Latin American creators. */
const LOCAL_ES = creators(`
El Rubius|AuronPlay|Ibai Llanos|TheGrefg|Willyrex|Vegetta777|DjMaRiiO|Luisito Comunica|Fernanfloo|JuegaGerman|
Dross
`);

/** French creators. */
const LOCAL_FR = creators(`
Squeezie|Cyprien|Norman|Tibo InShape|Léna Situations|Michou|Inoxtag|Amixem|Natoo|HugoDécrypte|
McFly et Carlito|Mister V|Joyca
`);

/** Portuguese and Brazilian creators. */
const LOCAL_PT = creators(`
Wuant|SirKazzio|Windoh|D4rkFrame|Tiagovski|Whindersson Nunes|Felipe Neto|Luccas Neto|Rezendeevil|KondZilla
`);

const LOCAL: Record<AppLanguage, string[]> = {
  sk: LOCAL_SK,
  en: LOCAL_EN,
  de: LOCAL_DE,
  es: LOCAL_ES,
  fr: LOCAL_FR,
  pt: LOCAL_PT,
};

function deckFor(language: AppLanguage): string[] {
  return [...new Set([...GLOBAL, ...LOCAL[language]])];
}

/** Global stars plus the creators big in each language area. */
export const WORLD_YOUTUBERS_BY_LANGUAGE: Record<AppLanguage, string[]> = {
  sk: deckFor("sk"),
  en: deckFor("en"),
  de: deckFor("de"),
  es: deckFor("es"),
  fr: deckFor("fr"),
  pt: deckFor("pt"),
};
