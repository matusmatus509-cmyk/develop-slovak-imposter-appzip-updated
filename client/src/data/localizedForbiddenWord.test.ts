import { describe, expect, it } from "vitest";
import { FORBIDDEN_CARD_COUNT, getForbiddenCardsForLanguage } from "./localizedForbiddenWord";

const languages = ["sk", "de", "es", "fr", "pt"] as const;
const SLOVAK_ONLY = /[äčďĺľňôŕšťž]/i;

describe("localized forbidden word cards", () => {
  it("keeps the full master count and four clues for every language", () => {
    expect(FORBIDDEN_CARD_COUNT).toBe(1500);
    for (const language of languages) {
      const cards = getForbiddenCardsForLanguage(language);
      expect(cards).toHaveLength(1500);
      expect(cards.every((card) => card.forbidden.length === 4)).toBe(true);
      expect(new Set(cards.map((card) => card.id)).size).toBe(1500);
    }
  });

  it("uses translated food cards while preserving Slovak fallback cards in other languages", () => {
    const slovak = getForbiddenCardsForLanguage("sk");
    const german = getForbiddenCardsForLanguage("de");
    expect(slovak[0].word).toBe("chlieb");
    expect(german.find((card) => card.category === "Zvieratá")?.word).toBe("pes");
  });

  it("has a fully English deck: every category translated, only culture-specific cards dropped", () => {
    const english = getForbiddenCardsForLanguage("en");
    expect(english[0].word).toBe("bread");
    expect(english.length).toBeGreaterThanOrEqual(1490);
    expect(new Set(english.map((card) => card.id)).size).toBe(english.length);
    expect(new Set(english.map((card) => card.category)).size).toBe(10);
    for (const card of english) {
      expect(card.forbidden, card.id).toHaveLength(4);
      expect(new Set(card.forbidden.map((word) => word.toLowerCase())).size, card.id).toBe(4);
      expect(SLOVAK_ONLY.test([card.category, card.word, ...card.forbidden].join(" ")), card.id).toBe(false);
    }
  });
});
