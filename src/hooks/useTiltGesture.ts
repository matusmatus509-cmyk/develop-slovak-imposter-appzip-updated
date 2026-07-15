import { useEffect, useRef } from "react";

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
  const onUpRef = useRef(onUp);
  const onDownRef = useRef(onDown);

  useEffect(() => {
    onUpRef.current = onUp;
    onDownRef.current = onDown;
  }, [onUp, onDown]);

  useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined" || typeof DeviceOrientationEvent === "undefined") {
      return;
    }

    // Require a deep, deliberate tilt and hold it briefly. This filters out
    // hand shake and small adjustments while the phone is on the forehead.
    const TRIGGER = 70;
    const NEUTRAL = 25;
    const HOLD_MS = 180;

    type Zone = "neutral" | "up" | "down";
    let zone: Zone = "neutral";
    let candidate: Exclude<Zone, "neutral"> | null = null;
    let candidateSince = 0;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const beta = e.beta;
      if (beta === null) return;

      if (zone === "neutral") {
        const nextCandidate = beta < -TRIGGER ? "up" : beta > TRIGGER ? "down" : null;

        if (nextCandidate === null) {
          candidate = null;
          candidateSince = 0;
        } else if (candidate !== nextCandidate) {
          candidate = nextCandidate;
          candidateSince = performance.now();
        } else if (performance.now() - candidateSince >= HOLD_MS) {
          zone = nextCandidate;
          candidate = null;
          candidateSince = 0;
          if (nextCandidate === "up") {
            onUpRef.current();
          } else {
            onDownRef.current();
          }
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
  }, [active]);
}
