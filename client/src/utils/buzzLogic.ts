import type { BuzzAssignment, BuzzSettings } from "../types";

/** Tajný čas sa vždy losuje z tohto okna. */
export const BUZZ_TARGET_MIN_SECONDS = 1;
export const BUZZ_TARGET_MAX_SECONDS = 15;

/** Zarovnanie na polovice sekundy — rozsah podvodníka má vyzerať ako „5 – 7 s“. */
function toHalf(value: number, mode: "floor" | "ceil" = "floor") {
  const scaled = value * 2;
  return (mode === "floor" ? Math.floor(scaled) : Math.ceil(scaled)) / 2;
}

/**
 * Vylosuje tajný čas kola a rozsah pre podvodníka.
 *
 * Tajný čas je na dve desatinné miesta („5,77 s“), aby sa nedal trafiť
 * náhodou. Rozsah podvodníka vždy obsahuje tajný čas, ale jeho hranice sú
 * posunuté náhodne — z rozsahu sa teda nedá odvodiť presné číslo.
 */
export function generateBuzzAssignment(settings: BuzzSettings): BuzzAssignment {
  const min = BUZZ_TARGET_MIN_SECONDS;
  const max = BUZZ_TARGET_MAX_SECONDS;
  const targetSeconds = Math.round((min + Math.random() * (max - min)) * 100) / 100;

  const width = Math.max(0.5, settings.impostorRangeSeconds);
  // Platné dolné hranice sú tie, po ktorých rozsah ešte stále obsahuje cieľ.
  const firstStart = toHalf(Math.max(0, targetSeconds - width), "ceil");
  const lastStart = toHalf(targetSeconds, "floor");
  const steps = Math.max(0, Math.round((lastStart - firstStart) * 2));
  const rangeMinSeconds = firstStart + Math.floor(Math.random() * (steps + 1)) / 2;

  return {
    targetSeconds,
    impostorIndex: Math.floor(Math.random() * settings.playerNames.length),
    rangeMinSeconds,
    rangeMaxSeconds: Math.round((rangeMinSeconds + width) * 2) / 2,
  };
}

/** Nameraný čas so slovenskou desatinnou čiarkou, napr. „5,81 s“. */
export function formatBuzzTime(seconds: number) {
  return `${seconds.toFixed(2).replace(".", ",")} s`;
}

/** Hranica rozsahu bez zbytočnej nuly: 5 → „5“, 5,5 → „5,5“. */
export function formatBuzzBound(seconds: number) {
  return seconds
    .toFixed(1)
    .replace(/\.0$/, "")
    .replace(".", ",");
}

/** Rozsah pre podvodníka, napr. „5 – 7 s“. */
export function formatBuzzRange(minSeconds: number, maxSeconds: number) {
  return `${formatBuzzBound(minSeconds)} – ${formatBuzzBound(maxSeconds)} s`;
}
