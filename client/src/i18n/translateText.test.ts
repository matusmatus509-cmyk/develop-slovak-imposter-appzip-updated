import { describe, expect, it } from "vitest";
import { translateText } from "./LanguageProvider";

const SLOVAK_ONLY = /[äčďĺľňôŕšťž]/i;

describe("anglický DOM prekladač", () => {
  it("prekladá dynamické vety s menami a číslami", () => {
    const cases: Array<[string, string]> = [
      ["+1 bod pre Anna", "+1 point for Anna"],
      ["+2 body pre Tím A", "+2 points for Team A"],
      ["Kolo 3 z 5", "Round 3 of 5"],
      ["Hráč 2 z 6", "Player 2 of 6"],
      ["Anna odpovedá", "Anna is answering"],
      ["Vyhráva o 1 bod.", "Wins by 1 point."],
      ["Vyhráva o 7 bodov.", "Wins by 7 points."],
      ["Aktuálne skóre: 12 bodov", "Current score: 12 points"],
      ["Žiadna kategória nevyhovuje „xyz“. Skús iný nápis.", "No category matches “xyz”. Try a different search."],
    ];
    for (const [source, expected] of cases) expect(translateText(source, "en")).toBe(expected);
  });

  it("skladá súhrny z hotových fráz", () => {
    for (const source of ["4 hráči · 3–12 hráčov", "1 podvodník · 90s", "3 ťahy · 1 podvodník", "2 hráči · Bez limitu"]) {
      const translated = translateText(source, "en");
      expect(SLOVAK_ONLY.test(translated), `${source} → ${translated}`).toBe(false);
      expect(translated).not.toBe(source);
    }
  });

  it("nechá anglický obsah bez zmeny a nekazí časti slov", () => {
    for (const text of ["Bread", "Dog", "Taking out the trash", "Guess the Sound", "Pokémon"]) {
      expect(translateText(text, "en")).toBe(text);
    }
  });

  it("slovenčina zostáva nedotknutá", () => {
    expect(translateText("Kolo 3 z 5", "sk")).toBe("Kolo 3 z 5");
  });
});
