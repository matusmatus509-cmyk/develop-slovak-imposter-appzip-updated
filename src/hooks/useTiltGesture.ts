import { useEffect, useRef } from "react";

/**
 * Heads-up-style tilt gesture for a phone held horizontally. DeviceOrientation
 * uses a different physical axis in landscape, so beta/gamma are converted to
 * one screen-relative up/down value before a gesture is evaluated.
 *
 * Mirrors the mechanic used by reference apps like "BAM! Imposter & Party
 * Games": hold the phone flat against your forehead facing outward, tilt the
 * top of the phone toward the floor to mark correct/guessed, tilt it toward
 * the ceiling to skip. The starting position is calibrated at the beginning of
 * each round, which makes the gesture independent of the exact forehead angle.
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

    const TRIGGER = 50;
    const NEUTRAL = 15;
    const HOLD_MS = 200;
    const NEUTRAL_HOLD_MS = 150;
    const CALIBRATION_MS = 450;
    const FILTER_WEIGHT = 0.25;

    type Zone = "neutral" | "up" | "down";
    let zone: Zone = "neutral";
    let candidate: Exclude<Zone, "neutral"> | null = null;
    let candidateSince = 0;
    let neutralSince = 0;
    let calibrationStarted = 0;
    let calibrationTotal = 0;
    let calibrationSamples = 0;
    let baseline: number | null = null;
    let filteredTilt: number | null = null;
    let calibratedAngle: number | null = null;

    const getScreenAngle = () => {
      const modernAngle = window.screen.orientation?.angle;
      const legacyAngle = (window as Window & { orientation?: number }).orientation;
      const angle = modernAngle ?? legacyAngle ?? 0;
      return ((angle % 360) + 360) % 360;
    };

    const getScreenRelativeTilt = (e: DeviceOrientationEvent, angle: number) => {
      if (e.beta === null || e.gamma === null) return null;

      // Device axes stay tied to the portrait shape of the phone. Rotate them
      // into the current screen orientation so the result always means the
      // visible top edge moving up/down, including both landscape directions.
      const radians = (angle * Math.PI) / 180;
      return e.beta * Math.cos(radians) + e.gamma * Math.sin(radians);
    };

    const resetCalibration = (angle: number, now: number) => {
      zone = "neutral";
      candidate = null;
      candidateSince = 0;
      neutralSince = 0;
      calibrationStarted = now;
      calibrationTotal = 0;
      calibrationSamples = 0;
      baseline = null;
      filteredTilt = null;
      calibratedAngle = angle;
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const now = performance.now();
      const angle = getScreenAngle();
      const tilt = getScreenRelativeTilt(e, angle);
      if (tilt === null) return;

      if (calibratedAngle !== angle) {
        resetCalibration(angle, now);
      }

      if (baseline === null) {
        calibrationTotal += tilt;
        calibrationSamples += 1;
        if (now - calibrationStarted < CALIBRATION_MS || calibrationSamples < 5) {
          return;
        }
        baseline = calibrationTotal / calibrationSamples;
        filteredTilt = baseline;
        return;
      }

      filteredTilt = filteredTilt === null
        ? tilt
        : filteredTilt + (tilt - filteredTilt) * FILTER_WEIGHT;
      const delta = filteredTilt - baseline;

      if (zone === "neutral") {
        const nextCandidate = delta < -TRIGGER ? "up" : delta > TRIGGER ? "down" : null;

        if (nextCandidate === null) {
          candidate = null;
          candidateSince = 0;
        } else if (candidate !== nextCandidate) {
          candidate = nextCandidate;
          candidateSince = now;
        } else if (now - candidateSince >= HOLD_MS) {
          zone = nextCandidate;
          candidate = null;
          candidateSince = 0;
          if (nextCandidate === "up") {
            onUpRef.current();
          } else {
            onDownRef.current();
          }
        }
      } else if (Math.abs(delta) < NEUTRAL) {
        if (neutralSince === 0) neutralSince = now;
        if (now - neutralSince >= NEUTRAL_HOLD_MS) {
          zone = "neutral";
          neutralSince = 0;
        }
      } else {
        neutralSince = 0;
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
