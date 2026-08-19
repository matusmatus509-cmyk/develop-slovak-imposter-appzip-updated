import type { AppLanguage } from "../i18n/LanguageProvider";
import tabooCardsSk from "./tabooCardsSk.json";
import foodEn from "./taboo-locales/food.en.json";
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

const FOOD_BY_LANGUAGE: Partial<Record<Exclude<AppLanguage, "sk">, LocaleBatch>> = {
  en: foodEn,
  de: foodDe,
  es: foodEs,
  fr: foodFr,
  pt: foodPt,
};

function toCard(card: { id: string; category: string; word: string; forbidden: string[] }): LocalizedForbiddenCard {
  return { ...card, forbidden: card.forbidden.slice(0, 4) as [string, string, string, string] };
}

const SLOVAK_CARDS = tabooCardsSk.cards.map(toCard);
const SLOVAK_FOOD_IDS = new Set(SLOVAK_CARDS.filter((card) => card.category === "Jedlo a nápoje").map((card) => card.id));

export const FORBIDDEN_CARD_COUNT = SLOVAK_CARDS.length;

export function getForbiddenCardsForLanguage(language: AppLanguage): LocalizedForbiddenCard[] {
  if (language === "sk") return SLOVAK_CARDS;
  const translatedFood = new Map((FOOD_BY_LANGUAGE[language]?.cards ?? []).map((card) => [card.id, toCard(card)]));
  return SLOVAK_CARDS.map((card) => translatedFood.get(card.id) ?? card).filter((card) =>
    !SLOVAK_FOOD_IDS.has(card.id) || translatedFood.has(card.id),
  );
}
