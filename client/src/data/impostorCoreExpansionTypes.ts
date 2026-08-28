import type { CategoryDef } from "../types";

export interface ImpostorCoreExpansion {
  categoryId: string;
  wordPairs: CategoryDef["wordPairs"];
}
