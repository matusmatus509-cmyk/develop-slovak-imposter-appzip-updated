import { useEffect, useRef } from "react";

/**
 * ── Displej nesmie zhasnúť počas hry ────────────────────────────────────────
 *
 * Väčšina hier sa hrá bez dotyku obrazovky — pri „Hádaj kto som“ má telefón
 * na čele a ovláda sa naklonením, pantomíma a šarády sa iba pozerajú, pri
 * hudobných hrách sa počúva. Systém to vyhodnotí ako nečinnosť a displej
 * stmaví alebo zamkne uprostred kola.
 *
 * Screen Wake Lock API tomu zabráni. Zámok drží iba viditeľný dokument, takže
 * po prepnutí do pozadia ho prehliadač sám uvoľní — preto si ho po návrate
 * vyžiadame znova. Kde API chýba, hook nič nerobí a hra beží ako predtým.
 *
 * Podrobnosti: https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
 */

/**
 * Vlastné minimálne typy — `lib.dom` ich podľa verzie TypeScriptu obsahovať
 * nemusí a nechceme, aby build závisel od konkrétnej verzie.
 */
interface WakeLockSentinelLike {
  released: boolean;
  release: () => Promise<void>;
}

interface WakeLockLike {
  request: (type: "screen") => Promise<WakeLockSentinelLike>;
}

function getWakeLock(): WakeLockLike | null {
  if (typeof navigator === "undefined") return null;
  const candidate = (navigator as Navigator & { wakeLock?: WakeLockLike })
    .wakeLock;
  return candidate ?? null;
}

export function useWakeLock(active: boolean) {
  const sentinelRef = useRef<WakeLockSentinelLike | null>(null);

  useEffect(() => {
    const available = getWakeLock();
    if (!active || !available) return;
    // Deklarácie funkcií sa hoistujú, takže TypeScript by si zúženie typu
    // vnútri nich neudržal — preto nenulovú hodnotu zachytíme do konštanty.
    const wakeLock: WakeLockLike = available;

    // Zámok sa vyžiadava asynchrónne — kým odpoveď dorazí, efekt sa už mohol
    // odmontovať. `cancelled` zabráni tomu, aby sme držali osirený zámok.
    let cancelled = false;

    async function acquire() {
      if (cancelled) return;
      // Neviditeľnému dokumentu prehliadač zámok nedá — žiadosť by len zlyhala.
      if (document.visibilityState !== "visible") return;
      const current = sentinelRef.current;
      if (current && !current.released) return;
      try {
        const sentinel = await wakeLock.request("screen");
        if (cancelled) {
          void sentinel.release().catch(() => {});
          return;
        }
        sentinelRef.current = sentinel;
      } catch {
        // Napr. veľmi slabá batéria alebo režim šetrenia energie. Hra beží
        // ďalej, len displej môže zhasnúť ako predtým.
      }
    }

    function release() {
      const sentinel = sentinelRef.current;
      sentinelRef.current = null;
      if (!sentinel || sentinel.released) return;
      void sentinel.release().catch(() => {});
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") void acquire();
      else release();
    }

    void acquire();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      release();
    };
  }, [active]);
}
