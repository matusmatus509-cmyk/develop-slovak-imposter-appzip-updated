import { useEffect, useRef, useState } from "react";
import {
  createTiltDetector,
  type TiltStatus,
} from "../utils/tiltDetector";

type PermissionCapableEvent = {
  requestPermission?: () => Promise<"granted" | "denied">;
};

/** Must run directly from the Start button click for iOS/Safari. */
export async function requestTiltPermission(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const permissionTargets: PermissionCapableEvent[] = [];
  if (typeof DeviceMotionEvent !== "undefined") {
    permissionTargets.push(DeviceMotionEvent as unknown as PermissionCapableEvent);
  }
  if (typeof DeviceOrientationEvent !== "undefined") {
    permissionTargets.push(DeviceOrientationEvent as unknown as PermissionCapableEvent);
  }

  const requesters = permissionTargets.filter(
    (target) => typeof target.requestPermission === "function",
  );
  if (requesters.length === 0) return true;

  const results = await Promise.all(
    requesters.map(async (target) => {
      try {
        return (await target.requestPermission?.call(target)) === "granted";
      } catch {
        return false;
      }
    }),
  );
  // One granted source is sufficient; the detector does not need both APIs.
  return results.some(Boolean);
}

/**
 * Detects a deliberate forward/back flip of a phone held horizontally on the
 * forehead. Motion (gravity vector) is preferred and one sensor source remains
 * selected for the whole round to avoid jumps between coordinate systems.
 */
export function useTiltGesture(
  active: boolean,
  onUp: () => void,
  onDown: () => void,
): TiltStatus {
  const [status, setStatus] = useState<TiltStatus>(active ? "calibrating" : "inactive");
  const onUpRef = useRef(onUp);
  const onDownRef = useRef(onDown);

  useEffect(() => {
    onUpRef.current = onUp;
    onDownRef.current = onDown;
  }, [onUp, onDown]);

  useEffect(() => {
    if (!active || typeof window === "undefined") {
      setStatus("inactive");
      return;
    }

    type SensorSource = "motion" | "orientation";
    let source: SensorSource | null = null;
    let latestOrientation: { tilt: number; at: number } | null = null;
    let lastSensorAt = performance.now();

    const detector = createTiltDetector({
      onGesture: (gesture) => {
        if (gesture === "up") onUpRef.current();
        else onDownRef.current();
      },
      onStatusChange: setStatus,
    });

    const chooseSource = (next: SensorSource) => {
      if (source === next) return;
      source = next;
      detector.reset();
    };

    const handleMotion = (event: DeviceMotionEvent) => {
      const gravity = event.accelerationIncludingGravity;
      const x = gravity?.x;
      const y = gravity?.y;
      const z = gravity?.z;
      if (x == null || y == null || z == null) return;

      const magnitude = Math.hypot(x, y, z);
      // Stationary gravity is ~9.81 m/s². Reject free-fall, impacts and sensor
      // glitches before they can look like a card flip.
      if (magnitude < 6 || magnitude > 14.5) return;

      if (source === null) chooseSource("motion");
      if (source !== "motion") return;

      const now = performance.now();
      lastSensorAt = now;
      const tilt = Math.atan2(z, Math.hypot(x, y)) * (180 / Math.PI);
      detector.feed(tilt, now);
    };

    const screenRelativeTilt = (event: DeviceOrientationEvent): number | null => {
      if (event.beta === null || event.gamma === null) return null;
      const modernAngle = window.screen.orientation?.angle;
      const legacyAngle = (window as Window & { orientation?: number }).orientation;
      const radians = ((modernAngle ?? legacyAngle ?? 0) * Math.PI) / 180;
      return event.beta * Math.cos(radians) + event.gamma * Math.sin(radians);
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const tilt = screenRelativeTilt(event);
      if (tilt === null) return;
      const now = performance.now();
      latestOrientation = { tilt, at: now };
      if (source !== "orientation") return;
      lastSensorAt = now;
      detector.feed(tilt, now);
    };

    // Give the gravity source a short chance to arrive. Orientation is used
    // only as a fallback and is never mixed into an active motion trace.
    const sourceTimer = window.setTimeout(() => {
      if (source !== null) return;
      if (latestOrientation) {
        chooseSource("orientation");
        lastSensorAt = latestOrientation.at;
        detector.feed(latestOrientation.tilt, latestOrientation.at);
      } else {
        setStatus("unsupported");
      }
    }, 850);

    const watchdog = window.setInterval(() => {
      const now = performance.now();
      if (source === "motion" && now - lastSensorAt > 2400 && latestOrientation && now - latestOrientation.at < 1200) {
        chooseSource("orientation");
        lastSensorAt = latestOrientation.at;
        detector.feed(latestOrientation.tilt, latestOrientation.at);
      } else if (source !== null && now - lastSensorAt > 3500) {
        setStatus("unsupported");
      }
    }, 700);

    const recalibrate = () => detector.reset();
    window.addEventListener("devicemotion", handleMotion);
    window.addEventListener("deviceorientation", handleOrientation);
    window.addEventListener("orientationchange", recalibrate);

    return () => {
      window.clearTimeout(sourceTimer);
      window.clearInterval(watchdog);
      window.removeEventListener("devicemotion", handleMotion);
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("orientationchange", recalibrate);
    };
  }, [active]);

  return status;
}
