import { ACTIVITIES_IMPOSTOR_EXPANSIONS } from "./impostorCoreExpansionActivities";
import { EVERYDAY_IMPOSTOR_EXPANSIONS } from "./impostorCoreExpansionEveryday";
import { HUMAN_IMPOSTOR_EXPANSIONS } from "./impostorCoreExpansionHuman";
import { LIFE_IMPOSTOR_EXPANSIONS } from "./impostorCoreExpansionLife";
import type { ImpostorCoreExpansion } from "./impostorCoreExpansionTypes";
import { WORLD_IMPOSTOR_EXPANSIONS } from "./impostorCoreExpansionWorld";

export const CORE_IMPOSTOR_EXPANSIONS: ImpostorCoreExpansion[] = [
  ...EVERYDAY_IMPOSTOR_EXPANSIONS,
  ...LIFE_IMPOSTOR_EXPANSIONS,
  ...ACTIVITIES_IMPOSTOR_EXPANSIONS,
  ...HUMAN_IMPOSTOR_EXPANSIONS,
  ...WORLD_IMPOSTOR_EXPANSIONS,
];
