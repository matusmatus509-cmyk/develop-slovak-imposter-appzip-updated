import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import type { FeedbackSettings } from "../types";

type FeedbackKind = "click" | "countdown" | "win" | "loss" | "buzzer";
type AudioContextConstructor = typeof AudioContext;

const FeedbackContext = createContext<{ playFeedback: (kind: FeedbackKind) => void }>({ playFeedback: () => undefined });
const TONES: Record<FeedbackKind, number[]> = {
  click: [520], countdown: [680], win: [523, 659, 784], loss: [300, 230], buzzer: [180, 130],
};

export function FeedbackProvider({ settings, children }: { settings: FeedbackSettings; children: ReactNode }) {
  const lastClickRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    const existing = audioContextRef.current;
    if (existing && existing.state !== "closed") return existing;
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext;
    if (!AudioCtor) return null;
    try {
      const context = new AudioCtor();
      audioContextRef.current = context;
      return context;
    } catch {
      return null;
    }
  }, []);

  const playTones = useCallback((kind: FeedbackKind, context: AudioContext) => {
    const start = context.currentTime;
    TONES[kind].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const at = start + index * (kind === "win" ? 0.09 : 0.12);
      oscillator.type = kind === "loss" || kind === "buzzer" ? "sawtooth" : "sine";
      oscillator.frequency.setValueAtTime(frequency, at);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(kind === "click" ? 0.045 : 0.12, at + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + (kind === "click" ? 0.06 : 0.16));
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.addEventListener("ended", () => {
        oscillator.disconnect();
        gain.disconnect();
      }, { once: true });
      oscillator.start(at);
      oscillator.stop(at + (kind === "click" ? 0.07 : 0.18));
    });
  }, []);

  const playFeedback = useCallback((kind: FeedbackKind) => {
    if (settings.soundsEnabled) {
      const context = getAudioContext();
      if (context) {
        if (context.state === "running") playTones(kind, context);
        else void context.resume().then(() => playTones(kind, context)).catch(() => undefined);
      }
    }
    if (settings.vibrationEnabled) {
      const pattern = kind === "win" ? [35, 35, 75] : kind === "loss" ? [100, 40, 100] : kind === "buzzer" ? [80] : kind === "countdown" ? [20] : [10];
      navigator.vibrate?.(pattern);
    }
  }, [getAudioContext, playTones, settings.soundsEnabled, settings.vibrationEnabled]);

  useEffect(() => {
    document.documentElement.dataset.vibration = settings.vibrationEnabled ? "enabled" : "disabled";
    document.documentElement.dataset.sounds = settings.soundsEnabled ? "enabled" : "disabled";
    if (!settings.soundsEnabled && audioContextRef.current?.state === "running") void audioContextRef.current.suspend().catch(() => undefined);
  }, [settings.soundsEnabled, settings.vibrationEnabled]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement | null)?.closest("button:not(:disabled)") as HTMLButtonElement | null;
      if (!button || button.dataset.feedback === "off") return;
      const now = Date.now();
      if (now - lastClickRef.current < 45) return;
      lastClickRef.current = now;
      playFeedback("click");
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [playFeedback]);

  useEffect(() => () => {
    const context = audioContextRef.current;
    audioContextRef.current = null;
    if (context && context.state !== "closed") void context.close().catch(() => undefined);
  }, []);

  const value = useMemo(() => ({ playFeedback }), [playFeedback]);
  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>;
}

export function useFeedback() { return useContext(FeedbackContext); }
