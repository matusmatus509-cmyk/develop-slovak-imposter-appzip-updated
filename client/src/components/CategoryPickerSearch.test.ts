import { describe, expect, it } from "vitest";
import { matchesSearch, normalizeSearchText } from "./CategoryPickerSearch";

describe("normalizeSearchText", () => {
  it("lowercases and trims the query", () => {
    expect(normalizeSearchText("  ŠPORT  ")).toBe("sport");
  });

  it("strips diacritics so Slovak queries match without háčiky", () => {
    expect(normalizeSearchText("žiadne háčiky")).toBe("ziadne haciky");
    expect(normalizeSearchText("ľavý")).toBe("lavy"); // ľ → l, ý → y
  });
});

describe("matchesSearch", () => {
  const names = ["Škola", "Domácnosť", "Jedlo a pitie", "Abstraktné pojmy"];

  it("matches everything when the query is empty or whitespace", () => {
    expect(names.every((name) => matchesSearch(name, ""))).toBe(true);
    expect(names.every((name) => matchesSearch(name, "   "))).toBe(true);
  });

  it("matches case-insensitively and without diacritics", () => {
    expect(matchesSearch("Škola", "skol")).toBe(true);
    expect(matchesSearch("Domácnosť", "domacnost")).toBe(true);
    expect(matchesSearch("Jedlo a pitie", "JEDLO")).toBe(true);
  });

  it("matches substrings", () => {
    expect(matchesSearch("Abstraktné pojmy", "strak")).toBe(true);
  });

  it("rejects non-matching names", () => {
    expect(matchesSearch("Škola", "mesto")).toBe(false);
  });
});
