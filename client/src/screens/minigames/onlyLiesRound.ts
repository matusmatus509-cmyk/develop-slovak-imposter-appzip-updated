export const ONLY_LIES_ROUND_MS = 4000;

export type OnlyLiesRoundAction = "correct" | "incorrect" | "timer-expired";
export type OnlyLiesRoundOutcome = "next" | "lost";

export function resolveOnlyLiesRound(action: OnlyLiesRoundAction): OnlyLiesRoundOutcome {
  return action === "incorrect" ? "lost" : "next";
}
