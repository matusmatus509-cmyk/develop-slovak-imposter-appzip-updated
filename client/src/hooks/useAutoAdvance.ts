import { useCallback, useRef } from "react";
import { useCountdown } from "./useCountdown";

/**
 * Medziobrazovky Party módu (intro, prestávka medzi kolami, výsledok kola) sa
 * posúvajú samé — partia nemá pri telefóne nič odklikávať.
 *
 * Postavené nad `useCountdown`, takže odpočet drží absolútny deadline a po
 * návrate z pozadia sa dorovná. `skip()` je dobrovoľná skratka pre netrpezlivých
 * a je chránená proti dvojitému spusteniu (odpočet aj klik).
 */
export function useAutoAdvance(
  seconds: number,
  onAdvance: () => void,
  enabled = true
) {
  const firedRef = useRef(false);

  const fire = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    onAdvance();
  }, [onAdvance]);

  const { secondsLeft, percentLeft, remainingSeconds } = useCountdown(
    seconds,
    enabled,
    fire
  );

  return {
    /** Zostávajúce sekundy zaokrúhlené nahor — to, čo vidí hráč. */
    secondsLeft,
    /** Plynulý zostatok 0–100 pre kruhový/lineárny indikátor. */
    percentLeft,
    remainingSeconds,
    /** Preskočiť čakanie a pokračovať okamžite. */
    skip: fire,
  };
}
