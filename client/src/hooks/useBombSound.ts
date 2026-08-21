import { useCallback, useEffect, useRef } from "react";
import { soundsEnabled } from "../utils/deviceFeedback";
import {
  BOMB_MASTER_GAIN,
  createNoiseBuffer,
  renderExplosion,
  renderTick,
} from "../utils/bombAudio";

type AudioContextConstructor = typeof AudioContext;

/**
 * Tikanie a výbuch pre hru „Kto dostane bombu".
 *
 * Prečo vlastný hook a nie `playFeedback` z FeedbackProvideru: ten pozná päť
 * pevných kľúčov a každý je krátka sekvencia sínusových tónov. Tik potrebuje
 * mechanický, šumový charakter a výbuch dlhý šumový záves s klesajúcim
 * filtrom — ani jedno sa z tabuľky tónov postaviť nedá.
 *
 * Hook rieši len životný cyklus. Samotná syntéza je v utils/bombAudio.ts bez
 * Reactu a DOM, aby sa dala vyrenderovať do OfflineAudioContext a odmerať.
 */
export function useBombSound() {
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const tockRef = useRef(false);

  const ensureGraph = useCallback(() => {
    // Nastavenie zvuku sa kontroluje pri každom tiku, nie raz pri štarte —
    // hráč ho môže vypnúť aj počas horiacej šnúry.
    if (!soundsEnabled()) return null;

    const existing = contextRef.current;
    if (existing && existing.state !== "closed") {
      if (existing.state === "suspended") {
        void existing.resume().catch(() => undefined);
      }
      return existing;
    }

    const AudioCtor =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: AudioContextConstructor;
        }
      ).webkitAudioContext;
    if (!AudioCtor) return null;

    try {
      const context = new AudioCtor();
      const master = context.createGain();
      master.gain.value = BOMB_MASTER_GAIN;
      master.connect(context.destination);

      contextRef.current = context;
      masterRef.current = master;
      noiseRef.current = createNoiseBuffer(context);
      if (context.state === "suspended") {
        void context.resume().catch(() => undefined);
      }
      return context;
    } catch {
      return null;
    }
  }, []);

  const playTick = useCallback(
    (heat = 0) => {
      const context = ensureGraph();
      const master = masterRef.current;
      const noise = noiseRef.current;
      if (!context || !master || !noise) return;
      const tock = tockRef.current;
      tockRef.current = !tock;
      renderTick(context, master, noise, { heat, tock });
    },
    [ensureGraph]
  );

  const playExplosion = useCallback(() => {
    const context = ensureGraph();
    const master = masterRef.current;
    const noise = noiseRef.current;
    if (!context || !master || !noise) return;
    renderExplosion(context, master, noise);
  }, [ensureGraph]);

  /** Odchod z hry musí zvuk okamžite utíšiť, inak tikanie prežije obrazovku. */
  const stopSound = useCallback(() => {
    const context = contextRef.current;
    contextRef.current = null;
    masterRef.current = null;
    noiseRef.current = null;
    if (context && context.state !== "closed") {
      void context.close().catch(() => undefined);
    }
  }, []);

  useEffect(() => stopSound, [stopSound]);

  return { playTick, playExplosion, stopSound };
}
