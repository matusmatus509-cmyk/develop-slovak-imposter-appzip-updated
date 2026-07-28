import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Spoločný odpočet pre všetky hry.
 *
 * Prečo nie `setTimeout(() => setTime(t - 1), 1000)`:
 * reťazený timeout sa pri každom prekreslení (animácia karty, skóre, preskočenie)
 * zruší a spustí odznova, takže sekundy „miznú“ alebo naopak bežia pomalšie ako
 * reálny čas. Tento hook si drží absolútny deadline, takže zobrazený čas vždy
 * zodpovedá reálne uplynulému času. Po návrate z pozadia sa hodnota dorovná
 * (prehliadač tam timery obmedzuje, takže dobehnutie riešime pri `visibilitychange`).
 */
export function useCountdown(
  totalSeconds: number,
  running: boolean,
  onExpire?: () => void,
) {
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, totalSeconds * 1000));
  // Zmena tejto hodnoty znovu naštartuje odpočet aj vtedy, keď hra medzitým beží.
  const [runId, setRunId] = useState(0);

  const remainingRef = useRef(Math.max(0, totalSeconds * 1000));
  const deadlineRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const expiredRef = useRef(false);
  const initializedRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  // Aktuálny nastavený čas držíme v ref, aby `reset()` bez argumentu nikdy
  // nepoužil starú hodnotu z predchádzajúceho renderu.
  const totalRef = useRef(totalSeconds);
  totalRef.current = totalSeconds;

  const clearPending = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /** Vráti odpočet na začiatok (alebo na nový čas) — použiť medzi kolami a hráčmi. */
  const reset = useCallback(
    (nextSeconds?: number) => {
      const ms = Math.max(0, (nextSeconds ?? totalRef.current) * 1000);
      clearPending();
      remainingRef.current = ms;
      deadlineRef.current = null;
      expiredRef.current = false;
      setRemainingMs(ms);
      setRunId((value) => value + 1);
    },
    [clearPending],
  );

  // Zmena nastaveného času (iné kolo, iná hra) vždy znamená nový odpočet.
  // Pri prvom vykreslení nie je čo resetovať — počiatočný stav už je plný čas.
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    reset(totalSeconds);
  }, [reset, totalSeconds]);

  useEffect(() => {
    if (!running) {
      // Pauza: zapamätáme si zostatok a prestaneme čerpať reálny čas.
      clearPending();
      if (deadlineRef.current !== null) {
        const left = Math.max(0, deadlineRef.current - Date.now());
        remainingRef.current = left;
        deadlineRef.current = null;
        setRemainingMs(left);
        // Ak čas vypršal presne v okamihu pauzy, kolo musí skončiť — inak by
        // odpočet zamrzol na nule a hra by čakala na obnovenie.
        if (left <= 0 && !expiredRef.current) {
          expiredRef.current = true;
          onExpireRef.current?.();
        }
      }
      return;
    }
    if (expiredRef.current) return;

    deadlineRef.current = Date.now() + remainingRef.current;

    const sync = () => {
      clearPending();
      const left = Math.max(0, (deadlineRef.current ?? Date.now()) - Date.now());
      remainingRef.current = left;
      setRemainingMs(left);
      if (left <= 0) {
        expiredRef.current = true;
        deadlineRef.current = null;
        onExpireRef.current?.();
        return;
      }
      // Krátke výzvy obnovujeme častejšie (plynulý kruh), dlhé kolá pokojnejšie.
      const cadence = totalSeconds <= 20 ? 100 : 250;
      const nextStep = left % 1000 === 0 ? 1000 : left % 1000;
      timeoutRef.current = window.setTimeout(sync, Math.min(nextStep, cadence));
    };

    sync();

    // Po návrate z pozadia dorovnáme čas okamžite (timery sú tam obmedzované).
    const handleVisibility = () => {
      if (!document.hidden && !expiredRef.current) sync();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearPending();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [clearPending, running, runId, totalSeconds]);

  useEffect(() => clearPending, [clearPending]);

  return {
    /** Zostatok v milisekundách (plynulý priebeh pre kruhový indikátor). */
    remainingMs,
    /** Zostatok v sekundách ako desatinné číslo. */
    remainingSeconds: remainingMs / 1000,
    /** Zostatok zaokrúhlený nahor — to, čo sa zobrazuje hráčovi. */
    secondsLeft: Math.ceil(remainingMs / 1000),
    /** Podiel uplynutého času 0–100. */
    percentLeft: totalSeconds > 0 ? Math.max(0, Math.min(100, (remainingMs / (totalSeconds * 1000)) * 100)) : 0,
    isExpired: remainingMs <= 0,
    reset,
  };
}

/** Stopky pre režimy bez limitu (napr. diskusia bez časovača). */
export function useStopwatch(running: boolean) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const elapsedRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  const clearPending = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (!running) {
      // Uplynutý čas už dopočítal cleanup predchádzajúceho behu, tu ho iba
      // premietneme do zobrazenia, aby pauza ukázala presnú hodnotu.
      clearPending();
      setElapsedMs(elapsedRef.current);
      return;
    }

    const startedAt = Date.now();
    const base = elapsedRef.current;

    const sync = () => {
      clearPending();
      setElapsedMs(base + (Date.now() - startedAt));
      timeoutRef.current = window.setTimeout(sync, 250);
    };
    sync();

    const handleVisibility = () => {
      if (!document.hidden) sync();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearPending();
      document.removeEventListener("visibilitychange", handleVisibility);
      elapsedRef.current = base + (Date.now() - startedAt);
    };
  }, [running]);

  return { elapsedSeconds: Math.floor(elapsedMs / 1000) };
}
