import { describe, expect, it } from "vitest";
import { TEAM_COLORS } from "../../data/teamBattle";
import { PARTY_PLAYER_COLORS } from "./quickGameShared";

describe("Party Mode quick-game colors", () => {
  it("uses the canonical color of team A for the first participant", () => {
    expect(PARTY_PLAYER_COLORS[0]).toBe(TEAM_COLORS[0]);
  });

  it("uses the canonical color of team B for the second participant", () => {
    expect(PARTY_PLAYER_COLORS[1]).toBe(TEAM_COLORS[1]);
  });
});
