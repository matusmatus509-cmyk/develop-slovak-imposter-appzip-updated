import { describe, expect, it } from "vitest";
import { contentMap, soundContentMap, type ContentDomain } from "./content";
import { getImpostorCategories } from "../data/categories";
import { getDrawingCategories } from "../data/drawingCategories";
import { getEmojiCategories } from "../data/emojiCategories";
import { getPingPongPromptsForLanguage } from "../data/pingPongPrompts";
import { getPantomimeWordsForLanguage } from "../data/teamBattle";
import {
  SOUND_CLUES,
  getFiveInTenPromptsForLanguage,
  getLetterChallengesForLanguage,
  getSoundCluesForLanguage,
} from "../data/teamBattleExtras";
import { getOnlyLiesForLanguage } from "../data/localizedOnlyLies";
import { getSeasonalPartyPacks } from "../data/partyContent";

// Mená ako Škrtel či Čech sú v angličtine správne s diakritikou.
const SLOVAK_ONLY = /[äčďĺľňôŕšťž]/i;
const ALLOWED_NAMES = /Škrtel|Škriniar|Hamšík|Čech|Modrić|Ibrahimović/g;
const hasSlovak = (text: string) => SLOVAK_ONLY.test(text.replace(ALLOWED_NAMES, ""));

describe("anglický herný obsah", () => {
  const domains: ContentDomain[] = ["impostor", "drawing", "emoji", "pantomime", "pingpong", "letter", "fiveInTen"];

  it("mapy neobsahujú slovenské texty", () => {
    for (const domain of domains) {
      for (const [key, value] of Object.entries(contentMap(domain))) {
        expect(hasSlovak(value), `${domain}: ${key} → ${value}`).toBe(false);
      }
    }
  });

  it("každá hra má v angličtine plnú zásobu bez slovenčiny", () => {
    const impostor = getImpostorCategories("en");
    expect(impostor.flatMap((c) => c.wordPairs).length).toBeGreaterThan(2500);
    for (const category of [...impostor, ...getDrawingCategories("en")]) {
      expect(hasSlovak(category.name), category.name).toBe(false);
      for (const pair of category.wordPairs) expect(hasSlovak(`${pair.word} ${pair.hint}`), pair.word).toBe(false);
    }
    const emoji = getEmojiCategories("en");
    expect(emoji.flatMap((c) => c.puzzles).length).toBeGreaterThan(750);
    for (const puzzle of emoji.flatMap((c) => c.puzzles)) expect(hasSlovak(puzzle.answer), puzzle.answer).toBe(false);

    const lists: Array<[string, string[], number]> = [
      ["pantomime", getPantomimeWordsForLanguage("lahke", "en"), 450],
      ["pingpong", getPingPongPromptsForLanguage("en"), 450],
      ["fiveInTen", getFiveInTenPromptsForLanguage("en"), 450],
      ["letter", getLetterChallengesForLanguage("en").map((c) => c.category), 500],
      ["onlyLies", getOnlyLiesForLanguage("en"), 500],
    ];
    for (const [name, items, minimum] of lists) {
      expect(items.length, name).toBeGreaterThanOrEqual(minimum);
      for (const item of items) expect(hasSlovak(item), `${name}: ${item}`).toBe(false);
    }
  });

  it("každý zvuk má anglický názov, kategóriu aj odpovede", () => {
    const english = getSoundCluesForLanguage("en");
    expect(Object.keys(soundContentMap()).length).toBe(SOUND_CLUES.length);
    expect(new Set(english.map((clue) => clue.label.toLowerCase())).size).toBe(english.length);
    for (const clue of english) {
      expect(hasSlovak([clue.label, clue.category ?? "", ...(clue.acceptedAnswers ?? [])].join(" ")), clue.id).toBe(false);
    }
  });

  it("sezónne balíčky existujú v angličtine", () => {
    for (const pack of getSeasonalPartyPacks("en")) {
      expect(hasSlovak([pack.name, pack.description, ...pack.entries.flatMap((e) => [e.text, e.answer ?? ""])].join(" ")), pack.id).toBe(false);
    }
  });
});
