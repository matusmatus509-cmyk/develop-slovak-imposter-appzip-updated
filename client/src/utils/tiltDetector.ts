export type TiltGesture = "up" | "down";
export type TiltStatus = "inactive" | "calibrating" | "ready" | "return-to-center" | "unsupported";

export interface TiltDetector {
  feed: (rawTilt: number, timestamp: number) => void;
  reset: () => void;
  getStatus: () => TiltStatus;
}

interface TiltDetectorOptions {
  onGesture: (gesture: TiltGesture) => void;
  onStatusChange?: (status: TiltStatus) => void;
}

const CALIBRATION_MS = 800;
const MIN_CALIBRATION_SAMPLES = 12;
const MAX_CALIBRATION_SPREAD = 14;
const FILTER_TIME_CONSTANT_MS = 55;
const FILTERED_TRIGGER_DEGREES = 32;
const RAW_TRIGGER_DEGREES = 39;
const TRIGGER_HOLD_MS = 65;
const MIN_ACTION_COOLDOWN_MS = 420;
const RESET_DEGREES = 20;
const RELAXED_RESET_DEGREES = 27;
const RESET_HOLD_MS = 120;
const RELAX_RESET_AFTER_MS = 1200;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function unwrapNear(value: number, reference: number): number {
  let result = value;
  while (result - reference > 180) result -= 360;
  while (result - reference < -180) result += 360;
  return result;
}

/**
 * Pure heads-up gesture state machine. Keeping the detector independent from
 * React makes it possible to replay sensor traces and verify false positives.
 */
export function createTiltDetector({
  onGesture,
  onStatusChange,
}: TiltDetectorOptions): TiltDetector {
  let status: TiltStatus = "calibrating";
  let calibrationStartedAt: number | null = null;
  let calibrationSamples: number[] = [];
  let baseline: number | null = null;
  let filteredTilt: number | null = null;
  let lastTimestamp: number | null = null;
  let candidate: TiltGesture | null = null;
  let candidateSince = 0;
  let actionAt = 0;
  let resetSince = 0;

  const setStatus = (next: TiltStatus) => {
    if (status === next) return;
    status = next;
    onStatusChange?.(next);
  };

  const reset = () => {
    status = "calibrating";
    calibrationStartedAt = null;
    calibrationSamples = [];
    baseline = null;
    filteredTilt = null;
    lastTimestamp = null;
    candidate = null;
    candidateSince = 0;
    actionAt = 0;
    resetSince = 0;
    onStatusChange?.("calibrating");
  };

  const feed = (inputTilt: number, timestamp: number) => {
    if (!Number.isFinite(inputTilt) || !Number.isFinite(timestamp)) return;

    if (baseline === null) {
      if (calibrationStartedAt === null) calibrationStartedAt = timestamp;
      calibrationSamples.push(inputTilt);
      if (calibrationSamples.length > 45) calibrationSamples.shift();

      if (
        timestamp - calibrationStartedAt < CALIBRATION_MS ||
        calibrationSamples.length < MIN_CALIBRATION_SAMPLES
      ) return;

      const sorted = [...calibrationSamples].sort((a, b) => a - b);
      const low = sorted[Math.floor(sorted.length * 0.1)];
      const high = sorted[Math.floor(sorted.length * 0.9)];
      if (high - low > MAX_CALIBRATION_SPREAD) {
        calibrationSamples = calibrationSamples.slice(-6);
        calibrationStartedAt = timestamp - 180;
        return;
      }

      baseline = median(calibrationSamples);
      filteredTilt = baseline;
      lastTimestamp = timestamp;
      setStatus("ready");
      return;
    }

    const rawTilt = unwrapNear(inputTilt, filteredTilt ?? baseline);
    const deltaMs = Math.max(8, Math.min(100, timestamp - (lastTimestamp ?? timestamp)));
    lastTimestamp = timestamp;
    const alpha = 1 - Math.exp(-deltaMs / FILTER_TIME_CONSTANT_MS);
    filteredTilt = (filteredTilt ?? rawTilt) + (rawTilt - (filteredTilt ?? rawTilt)) * alpha;

    const filteredDelta = filteredTilt - baseline;
    const rawDelta = rawTilt - baseline;

    if (status === "ready") {
      // Slowly follow harmless posture drift without moving the baseline during
      // an intentional card flip.
      if (Math.abs(filteredDelta) < 10) baseline += filteredDelta * 0.018;

      const nextCandidate: TiltGesture | null =
        filteredDelta <= -FILTERED_TRIGGER_DEGREES || rawDelta <= -RAW_TRIGGER_DEGREES
          ? "up"
          : filteredDelta >= FILTERED_TRIGGER_DEGREES || rawDelta >= RAW_TRIGGER_DEGREES
            ? "down"
            : null;

      if (nextCandidate === null) {
        candidate = null;
        candidateSince = 0;
      } else if (candidate !== nextCandidate) {
        candidate = nextCandidate;
        candidateSince = timestamp;
      } else if (timestamp - candidateSince >= TRIGGER_HOLD_MS) {
        candidate = null;
        candidateSince = 0;
        actionAt = timestamp;
        resetSince = 0;
        setStatus("return-to-center");
        onGesture(nextCandidate);
      }
      return;
    }

    if (status !== "return-to-center" || timestamp - actionAt < MIN_ACTION_COOLDOWN_MS) return;

    const resetLimit = timestamp - actionAt >= RELAX_RESET_AFTER_MS
      ? RELAXED_RESET_DEGREES
      : RESET_DEGREES;
    if (Math.abs(filteredDelta) <= resetLimit) {
      if (resetSince === 0) resetSince = timestamp;
      if (timestamp - resetSince >= RESET_HOLD_MS) {
        // Absorb a small change in the player's neutral forehead angle.
        baseline += filteredDelta * 0.35;
        resetSince = 0;
        setStatus("ready");
      }
    } else {
      resetSince = 0;
    }
  };

  return { feed, reset, getStatus: () => status };
}
