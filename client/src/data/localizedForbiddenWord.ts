import type { AppLanguage } from "../i18n/LanguageProvider";
import { registerEnglishContent } from "../i18n/contentRegistry";
import tabooCardsSk from "./tabooCardsSk.json";
import foodEn from "./taboo-locales/food.en.json";
import animalsEn from "./taboo-locales/zvierat.en.json";
import placesEn from "./taboo-locales/miesta-a-cestovanie.en.json";
import peopleEn from "./taboo-locales/udia-a-povolania.en.json";
import householdEn from "./taboo-locales/predmety-a-dom-cnos.en.json";
import activitiesEn from "./taboo-locales/aktivity-a-sport.en.json";
import cultureEn from "./taboo-locales/filmy-serialy-a-kultura.en.json";
import technologyEn from "./taboo-locales/technologie-a-media.en.json";
import natureEn from "./taboo-locales/priroda-a-svet.en.json";
import generalEn from "./taboo-locales/vseobecne-pojmy-a-situacie.en.json";
import foodDe from "./taboo-locales/food.de.json";
import foodEs from "./taboo-locales/food.es.json";
import foodFr from "./taboo-locales/food.fr.json";
import foodPt from "./taboo-locales/food.pt.json";

export type LocalizedForbiddenCard = {
  id: string;
  category: string;
  word: string;
  forbidden: [string, string, string, string];
};

type LocaleBatch = { cards: Array<{ id: string; category: string; word: string; forbidden: string[] }> };

function toCard(card: { id: string; category: string; word: string; forbidden: string[] }): LocalizedForbiddenCard {
  return { ...card, forbidden: card.forbidden.slice(0, 4) as [string, string, string, string] };
}

const SLOVAK_CARDS = tabooCardsSk.cards.map(toCard);
const SLOVAK_FOOD_IDS = new Set(SLOVAK_CARDS.filter((card) => card.category === "Jedlo a nápoje").map((card) => card.id));

export const FORBIDDEN_CARD_COUNT = SLOVAK_CARDS.length;

/**
 * Angličtina má preložené všetky kategórie. Karta, ktorá v anglickom súbore
 * chýba, bola zámerne vyradená (slovenský pojem bez anglického ekvivalentu) —
 * v angličtine sa preto nezobrazí, namiesto toho aby sa ukázala po slovensky.
 */
const ENGLISH_CARDS = new Map(
  ([foodEn, animalsEn, placesEn, peopleEn, householdEn, activitiesEn, cultureEn, technologyEn, natureEn, generalEn] as LocaleBatch[])
    .flatMap((batch) => batch.cards)
    .map((card) => [card.id, toCard(card)]),
);
const ENGLISH_DECK = SLOVAK_CARDS.flatMap((card) => {
  const translated = ENGLISH_CARDS.get(card.id);
  return translated ? [translated] : [];
});
registerEnglishContent(ENGLISH_DECK.flatMap((card) => [card.category, card.word, ...card.forbidden]));

/** Ostatné jazyky zatiaľ majú preložené iba jedlo; zvyšok zostáva po slovensky. */
const FOOD_BY_LANGUAGE: Partial<Record<Exclude<AppLanguage, "sk" | "en">, LocaleBatch>> = {
  de: foodDe,
  es: foodEs,
  fr: foodFr,
  pt: foodPt,
};

export function getForbiddenCardsForLanguage(language: AppLanguage): LocalizedForbiddenCard[] {
  if (language === "sk") return SLOVAK_CARDS;
  if (language === "en") return ENGLISH_DECK;
  const translatedFood = new Map((FOOD_BY_LANGUAGE[language]?.cards ?? []).map((card) => [card.id, toCard(card)]));
  return SLOVAK_CARDS.map((card) => translatedFood.get(card.id) ?? card).filter((card) =>
    !SLOVAK_FOOD_IDS.has(card.id) || translatedFood.has(card.id),
  );
}
