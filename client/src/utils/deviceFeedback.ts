export function vibrate(pattern: number | number[]) {
  if (typeof document !== "undefined" && document.documentElement.dataset.vibration === "disabled") return false;
  return navigator.vibrate?.(pattern) ?? false;
}

export function soundsEnabled() {
  return typeof document === "undefined" || document.documentElement.dataset.sounds !== "disabled";
}
