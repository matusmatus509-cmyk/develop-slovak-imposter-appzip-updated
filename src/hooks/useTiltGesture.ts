import { useEffect } from "react";

/**
 * Heads-up-style tilt gesture: tilt phone back/up → onUp(), tilt phone
 * forward/down → onDown(). Uses hysteresis so a single tilt only fires once —
 * the phone must return to the neutral zone before it can fire again.
 *
 * Mirrors the mechanic used by reference apps like "BAM! Imposter & Party
 * Games": hold the phone flat against your forehead facing outward, tilt the
 * top of the phone toward the floor to mark correct/guessed, tilt it toward
 * the ceiling to skip (or vice-versa depending on device.beta sign — the
 * thresholds below match how `beta` behaves for this hold position).
 *
 * Falls back silently (no-op) when the device has no orientation sensor or
 * permission is denied — callers should always provide a tap-based fallback
 * for correct/skip actions.
 */
export function useTiltGesture(
  active: boolean,
  onUp: () => void,
  onDown: () => void
) {
  useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined" || typeof DeviceOrientationEvent === "undefined") {
      return;
    }

    const TRIGGER = 50; // degrees past this = action fires
    const NEUTRAL = 20; // degrees — must return inside this to re-arm

    type Zone = "neutral" | "up" | "down";
    let zone: Zone = "neutral";

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const beta = e.beta;
      if (beta === null) return;

      if (zone === "neutral") {
        if (beta < -TRIGGER) {
          zone = "up";
          onUp();
        } else if (beta > TRIGGER) {
          zone = "down";
          onDown();
        }
      } else if (Math.abs(beta) < NEUTRAL) {
        zone = "neutral";
      }
    };

    let cancelled = false;
    const evt = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    if (typeof evt.requestPermission === "function") {
      evt.requestPermission()
        .then((state) => {
          if (state === "granted" && !cancelled) {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        })
        .catch(() => {
          // Permission API rejected (e.g. not triggered by user gesture) —
          // tap fallback still works.
        });
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("deviceorientation", handleOrientation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, onUp, onDown]);
}
