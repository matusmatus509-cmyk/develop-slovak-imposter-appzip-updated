import { useEffect, useRef } from "react";

type PermissionCapableEvent = {
  requestPermission?: () => Promise<"granted" | "denied">;
};

/** Must be called directly from the Start button click for iOS/Safari. */
export async function requestTiltPermission(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const requests: Promise<"granted" | "denied">[] = [];

  if (typeof DeviceMotionEvent !== "undefined") {
    const motionEvent = DeviceMotionEvent as unknown as PermissionCapableEvent;
    if (typeof motionEvent.requestPermission === "function") {
      requests.push(motionEvent.requestPermission());
    }
  }

  if (typeof DeviceOrientationEvent !== "undefined") {
    const orientationEvent = DeviceOrientationEvent as unknown as PermissionCapableEvent;
    if (typeof orientationEvent.requestPermission === "function") {
      requests.push(orientationEvent.requestPermission());
    }
  }

  if (requests.length === 0) return true;

  try {
    const states = await Promise.all(requests);
    return states.every((state) => state === "granted");
  } catch {
    return false;
  }
}

/**
 * Heads-up gesture for a phone held horizontally against the forehead.
 *
 * The primary signal is the gravity vector perpendicular to the display. It
 * describes the actual forward/back card flip and is independent of whether
 * landscape-left or landscape-right is used. DeviceOrientation is retained as
 * a fallback for browsers that do not expose accelerationIncludingGravity.
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
    if (!active || typeof window === "undefined") return;

    // Comparable heads-up implementations use roughly 50–60° between the
    // reset pose and either action. Filtering plus hold time rejects shaking.
    const TRIGGER_DEGREES = 50;
    const RESET_DEGREES = 14;
    const ACTION_HOLD_MS = 180;
    const RESET_HOLD_MS = 180;
    const CALIBRATION_MS = 500;
    const FILTER_WEIGHT = 0.3;
    const ORIENTATION_FALLBACK_MS = 900;

    type Zone = "neutral" | "up" | "down";
    type SensorSource = "motion" | "orientation";

    let zone: Zone = "neutral";
    let candidate: Exclude<Zone, "neutral"> | null = null;
    let candidateSince = 0;
    let resetSince = 0;
    let calibrationStarted = performance.now();
    let calibrationTotal = 0;
    let calibrationSamples = 0;
    let baseline: number | null = null;
    let filteredTilt: number | null = null;
    let source: SensorSource | null = null;
    let lastValidMotionAt = 0;

    const resetDetector = (nextSource: SensorSource, now: number) => {
      zone = "neutral";
      candidate = null;
      candidateSince = 0;
      resetSince = 0;
      calibrationStarted = now;
      calibrationTotal = 0;
      calibrationSamples = 0;
      baseline = null;
      filteredTilt = null;
      source = nextSource;
    };

    const processTilt = (rawTilt: number, now: number, nextSource: SensorSource) => {
      if (!Number.isFinite(rawTilt)) return;
      if (source !== nextSource) resetDetector(nextSource, now);

      if (baseline === null) {
        calibrationTotal += rawTilt;
        calibrationSamples += 1;
        if (now - calibrationStarted < CALIBRATION_MS || calibrationSamples < 8) return;

        baseline = calibrationTotal / calibrationSamples;
        filteredTilt = baseline;
        return;
      }

      filteredTilt = filteredTilt === null
        ? rawTilt
        : filteredTilt + (rawTilt - filteredTilt) * FILTER_WEIGHT;
      const delta = filteredTilt - baseline;

      if (zone === "neutral") {
        const nextCandidate = delta <= -TRIGGER_DEGREES
          ? "up"
          : delta >= TRIGGER_DEGREES
            ? "down"
            : null;

        if (nextCandidate === null) {
          candidate = null;
          candidateSince = 0;
        } else if (candidate !== nextCandidate) {
          candidate = nextCandidate;
          candidateSince = now;
        } else if (now - candidateSince >= ACTION_HOLD_MS) {
          zone = nextCandidate;
          candidate = null;
          candidateSince = 0;
          if (nextCandidate === "up") onUpRef.current();
          else onDownRef.current();
        }
        return;
      }

      if (Math.abs(delta) <= RESET_DEGREES) {
        if (resetSince === 0) resetSince = now;
        if (now - resetSince >= RESET_HOLD_MS) {
          zone = "neutral";
          resetSince = 0;
        }
      } else {
        resetSince = 0;
      }
    };

    const handleMotion = (event: DeviceMotionEvent) => {
      const gravity = event.accelerationIncludingGravity;
      const x = gravity?.x;
      const y = gravity?.y;
      const z = gravity?.z;
      if (x === null || x === undefined || y === null || y === undefined || z === null || z === undefined) {
        return;
      }

      const magnitude = Math.hypot(x, y, z);
      // Ignore missing readings and impacts; a stationary gravity vector is
      // close to 9.81 m/s², while the ratio below removes device calibration.
      if (magnitude < 4 || magnitude > 16) return;

      const now = performance.now();
      lastValidMotionAt = now;
      const normalizedZ = Math.max(-1, Math.min(1, z / magnitude));
      const tiltDegrees = Math.asin(normalizedZ) * (180 / Math.PI);
      processTilt(tiltDegrees, now, "motion");
    };

    const getScreenRelativeOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return null;
      const modernAngle = window.screen.orientation?.angle;
      const legacyAngle = (window as Window & { orientation?: number }).orientation;
      const angle = ((modernAngle ?? legacyAngle ?? 0) * Math.PI) / 180;
      return event.beta * Math.cos(angle) + event.gamma * Math.sin(angle);
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const now = performance.now();
      if (lastValidMotionAt !== 0 && now - lastValidMotionAt < ORIENTATION_FALLBACK_MS) return;
      if (lastValidMotionAt === 0 && now - calibrationStarted < ORIENTATION_FALLBACK_MS) return;

      const tilt = getScreenRelativeOrientation(event);
      if (tilt !== null) processTilt(tilt, now, "orientation");
    };

    if (typeof DeviceMotionEvent !== "undefined") {
      window.addEventListener("devicemotion", handleMotion);
    }
    if (typeof DeviceOrientationEvent !== "undefined") {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [active]);
}
