export type PartyTeamIndex = 0 | 1;

export interface PartyTeamIdentity {
  index: PartyTeamIndex;
  code: "A" | "B";
  side: "left" | "right";
  sideLabel: "ĽAVÁ STRANA" | "PRAVÁ STRANA";
}

/**
 * Kanonické priradenie tímov v Party Mode.
 * Index tímu je jeho identita počas celej hry: A je vždy vľavo, B vždy vpravo.
 */
export const PARTY_TEAM_IDENTITIES: readonly [PartyTeamIdentity, PartyTeamIdentity] = [
  { index: 0, code: "A", side: "left", sideLabel: "ĽAVÁ STRANA" },
  { index: 1, code: "B", side: "right", sideLabel: "PRAVÁ STRANA" },
] as const;

export function getPartyTeamIdentity(index: PartyTeamIndex): PartyTeamIdentity {
  return PARTY_TEAM_IDENTITIES[index];
}
