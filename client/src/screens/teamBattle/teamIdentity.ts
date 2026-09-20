import { TEAM_COLORS } from "../../data/teamBattle";
import { PARTY_PLAYER_COLORS, type QuickPlayMode } from "./quickGameShared";

/**
 * Identita tímov v Party mode — jediný zdroj pravdy.
 *
 * Prečo to existuje: predtým si každá obrazovka odvodzovala farbu aj stranu
 * sama. Ping-pong mal tím A ružový a tím B modrý (presne naopak než zvyšok),
 * šarády mali tím B oranžový, bzučiakové hry sadali tím A k spodnej hrane a
 * kvíz k hornej. Pre partiu to vyzeralo, že sa strany aj farby počas hry samy
 * prehadzujú.
 *
 * Pravidlo: tím A je modrý a sedí celú hru pri HORNEJ hrane telefónu (teda
 * naproti), tím B je červený a sedí pri DOLNEJ hrane. Poradie tímov na
 * obrazovke nikdy nezávisí od skóre ani od toho, kto je na rade — víťaz sa
 * označí korunou, nie presunutím.
 */
export type PartyTeamIndex = 0 | 1;

/** Strana telefónu, pri ktorej tím sedí. Platí pre celú hru. */
export type PartyTeamSide = "top" | "bottom";

export interface PartyTeamIdentity {
  index: PartyTeamIndex;
  /** Písmeno tímu — rovnaké na každej obrazovke. */
  letter: "A" | "B";
  color: string;
  /** Tmavý odtieň tej istej farby pre tlaky/gradienty (ping-pong). */
  colorDark: string;
  emoji: string;
  side: PartyTeamSide;
  /** „Horná strana" / „Dolná strana" — celé pomenovanie do legiend. */
  sideLabel: string;
  /** Krátke „hore" / „dole" — do odznakov, kde nie je miesto. */
  sideShort: string;
  /** Šipka smerujúca k hrane, pri ktorej tím sedí. */
  sideArrow: "↑" | "↓";
}

export const PARTY_TEAM_IDENTITIES: readonly [
  PartyTeamIdentity,
  PartyTeamIdentity,
] = [
  {
    index: 0,
    letter: "A",
    color: TEAM_COLORS[0],
    colorDark: "#1d3a8a",
    emoji: "🔵",
    side: "top",
    sideLabel: "Horná strana",
    sideShort: "hore",
    sideArrow: "↑",
  },
  {
    index: 1,
    letter: "B",
    color: TEAM_COLORS[1],
    colorDark: "#8f1d1d",
    emoji: "🔴",
    side: "bottom",
    sideLabel: "Dolná strana",
    sideShort: "dole",
    sideArrow: "↓",
  },
];

/** Farby tímov v poradí A, B — pre komponenty, ktoré čakajú dvojicu farieb. */
export const PARTY_TEAM_COLORS: [string, string] = [
  PARTY_TEAM_IDENTITIES[0].color,
  PARTY_TEAM_IDENTITIES[1].color,
];

/** Písmená tímov v poradí A, B. */
export const PARTY_TEAM_LETTERS: [string, string] = [
  PARTY_TEAM_IDENTITIES[0].letter,
  PARTY_TEAM_IDENTITIES[1].letter,
];

/**
 * Identita podľa indexu. Index je v Party mode trvalá identita tímu (skóre aj
 * mená sa držia v dvojici), takže mimo dvojice sa cyklí — to nastane len v
 * sólo režimoch s viac hráčmi, kde sa strany neriešia.
 */
export function partyTeamIdentity(index: number): PartyTeamIdentity {
  return PARTY_TEAM_IDENTITIES[((index % 2) + 2) % 2] as PartyTeamIdentity;
}

/** „A · horná strana" — jednoriadkový popis pre odznaky a legendy. */
export function partyTeamSideHint(index: number): string {
  const team = partyTeamIdentity(index);
  return `${team.letter} · ${team.sideLabel.toLocaleLowerCase("sk")}`;
}

/**
 * Farby účastníkov pre minihry, ktoré sa hrajú aj sólo aj v Party mode.
 *
 * V tímovom móde musia byť farby presne tie tímové (modrá/červená) — nie prvé
 * dve z hráčskej palety, ktoré s nimi zhodou okolnosti začínajú. Vďaka tomu
 * prípadná zmena hráčskej palety už nerozhodí identitu tímov.
 */
export function participantColorsFor(
  mode: QuickPlayMode,
  participantCount: number
): string[] {
  if (mode !== "teams") return PARTY_PLAYER_COLORS;
  if (participantCount !== 2) return PARTY_PLAYER_COLORS;
  return [...PARTY_TEAM_COLORS];
}

/**
 * Odznaky účastníkov: v tímovom móde písmeno tímu, inak nič (hráči sa
 * rozlišujú menom a farbou).
 */
export function participantBadgesFor(
  mode: QuickPlayMode,
  participantCount: number
): (string | null)[] {
  if (mode !== "teams" || participantCount !== 2) {
    return Array.from({ length: participantCount }, () => null);
  }
  return [...PARTY_TEAM_LETTERS];
}

/**
 * Popis strany pre účastníka — v tímovom móde je pevný, inak prázdny.
 */
export function participantSideHintsFor(
  mode: QuickPlayMode,
  participantCount: number
): (string | null)[] {
  if (mode !== "teams" || participantCount !== 2) {
    return Array.from({ length: participantCount }, () => null);
  }
  return PARTY_TEAM_IDENTITIES.map(
    team => `${team.sideArrow} ${team.sideShort}`
  );
}
