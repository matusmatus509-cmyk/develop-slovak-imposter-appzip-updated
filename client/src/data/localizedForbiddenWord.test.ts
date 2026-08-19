import { describe, expect, it } from "vitest";
import { FORBIDDEN_CARD_COUNT, getForbiddenCardsForLanguage } from "./localizedForbiddenWord";

const languages = ["sk", "en", "de", "es", "fr", "pt"] as const;

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

  it("uses translated food cards while preserving Slovak fallback cards", () => {
    const slovak = getForbiddenCardsForLanguage("sk");
    const english = getForbiddenCardsForLanguage("en");
    expect(slovak[0].word).toBe("chlieb");
    expect(english[0].word).toBe("bread");
    expect(english.find((card) => card.category === "Zvieratá")?.word).toBe("pes");
    expect(english.find((card) => card.category === "Food and Drinks")?.category).toBe("Food and Drinks");
  });
});
