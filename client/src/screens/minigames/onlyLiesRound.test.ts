import { describe, expect, it } from "vitest";
import { resolveOnlyLiesRound } from "./onlyLiesRound";

describe("resolveOnlyLiesRound", () => {
  it("automaticky pokračuje po vypršaní času", () => {
    expect(resolveOnlyLiesRound("timer-expired")).toBe("next");
  });

  it("ukončí hru po nesprávnej odpovedi", () => {
    expect(resolveOnlyLiesRound("incorrect")).toBe("lost");
  });

  it("pokračuje po správnom zvládnutí otázky", () => {
    expect(resolveOnlyLiesRound("correct")).toBe("next");
  });
});
