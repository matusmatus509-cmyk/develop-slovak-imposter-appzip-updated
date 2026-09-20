import { describe, expect, it } from "vitest";
import { getPartyTeamIdentity, PARTY_TEAM_IDENTITIES } from "./partyTeamIdentity";

describe("Party Mode team identity", () => {
  it("keeps team A on the left for the whole game", () => {
    expect(getPartyTeamIdentity(0)).toEqual({
      index: 0,
      code: "A",
      side: "left",
      sideLabel: "ĽAVÁ STRANA",
    });
  });

  it("keeps team B on the right for the whole game", () => {
    expect(getPartyTeamIdentity(1)).toEqual({
      index: 1,
      code: "B",
      side: "right",
      sideLabel: "PRAVÁ STRANA",
    });
  });

  it("defines exactly two unique fixed sides", () => {
    expect(PARTY_TEAM_IDENTITIES).toHaveLength(2);
    expect(new Set(PARTY_TEAM_IDENTITIES.map(team => team.side)).size).toBe(2);
    expect(new Set(PARTY_TEAM_IDENTITIES.map(team => team.code)).size).toBe(2);
  });
});
