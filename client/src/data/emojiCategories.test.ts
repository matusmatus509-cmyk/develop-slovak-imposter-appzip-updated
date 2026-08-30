import { describe, expect, it } from "vitest";

import {
  EMOJI_CATEGORIES,
  getEmojiCategories,
  type EmojiPuzzle,
} from "./emojiCategories";

const EXPECTED_CARD_COUNT = 804;
const PLACEHOLDER_ANSWERS =
  /^(?:test|example|placeholder|something(?:\s+\w+)?|todo|tbd)$/i;

function normalizeAnswer(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function duplicateValues(
  cards: EmojiPuzzle[],
  getValue: (card: EmojiPuzzle) => string
) {
  const counts = new Map<string, number>();
  cards.forEach(card => {
    const value = getValue(card);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value);
}

describe("Hádaj emoji bundled database", () => {
  const cards = EMOJI_CATEGORIES.flatMap(category => category.puzzles);

  it("loads the complete curated runtime pool", () => {
    const foreignCards = getEmojiCategories(false).flatMap(
      category => category.puzzles
    );
    const foreignIds = new Set(foreignCards.map(card => card.id));

    expect(EMOJI_CATEGORIES).toHaveLength(17);
    expect(cards).toHaveLength(EXPECTED_CARD_COUNT);
    expect(
      getEmojiCategories(true).flatMap(category => category.puzzles)
    ).toHaveLength(EXPECTED_CARD_COUNT);
    expect(foreignCards).toHaveLength(EXPECTED_CARD_COUNT - 2);
    expect(
      cards.filter(card => card.emoji.includes("🇸🇰")).map(card => card.id)
    ).toEqual(["people:peter-sagan", "people:zdeno-chara"]);
    expect(foreignIds.has("people:peter-sagan")).toBe(false);
    expect(foreignIds.has("people:zdeno-chara")).toBe(false);
  });

  it("keeps every category playable with a unique runtime namespace", () => {
    const categoryIds = EMOJI_CATEGORIES.map(category => category.id);
    expect(new Set(categoryIds).size).toBe(categoryIds.length);

    for (const category of EMOJI_CATEGORIES) {
      expect(category.id.trim()).not.toBe("");
      expect(category.title.trim()).not.toBe("");
      expect(category.puzzles.length).toBeGreaterThanOrEqual(24);
    }
  });

  it("has valid non-empty cards without placeholders or damaged text", () => {
    for (const card of cards) {
      expect(card.id?.trim()).not.toBe("");
      expect(card.emoji.trim()).not.toBe("");
      expect(card.answer.trim()).not.toBe("");
      expect(card.emoji).toMatch(/\p{Extended_Pictographic}/u);
      expect(card.answer).not.toMatch(PLACEHOLDER_ANSWERS);
      expect(`${card.emoji}${card.answer}`).not.toContain("�");
      expect(`${card.emoji}${card.answer}`).not.toMatch(/\\u[0-9a-f]{4}/i);
    }
  });

  it("has no duplicate ids, emoji clues, answers, or emoji-answer pairs", () => {
    expect(duplicateValues(cards, card => card.id ?? "")).toEqual([]);
    expect(duplicateValues(cards, card => card.emoji)).toEqual([]);
    expect(
      duplicateValues(cards, card => normalizeAnswer(card.answer))
    ).toEqual([]);
    expect(
      duplicateValues(
        cards,
        card => `${card.emoji}|${normalizeAnswer(card.answer)}`
      )
    ).toEqual([]);
  });
});
