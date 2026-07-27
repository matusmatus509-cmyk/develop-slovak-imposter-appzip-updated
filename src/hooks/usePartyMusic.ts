import { useEffect, useState } from "react";

type AudioContextConstructor = typeof AudioContext;

export function usePartyMusic(enabled: boolean) {
  const [supported] = useState(() => typeof window !== "undefined" && Boolean(window.AudioContext || (window as typeof window & { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext));
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (!enabled || !supported) {
      setBlocked(false);
      return;
    }

    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext;
    if (!AudioCtor) return;

    const context = new AudioCtor();
    const master = context.createGain();
    master.gain.value = 0.018;
    master.connect(context.destination);
    let timer = 0;
    let stopped = false;
    let step = 0;
    const notes = [130.81, 164.81, 196, 164.81, 146.83, 174.61, 220, 174.61];

    function playNote() {
      if (stopped || context.state !== "running") return;
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = notes[step % notes.length];
      envelope.gain.setValueAtTime(0.0001, context.currentTime);
      envelope.gain.exponentialRampToValueAtTime(0.7, context.currentTime + 0.04);
      envelope.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.65);
      oscillator.connect(envelope);
      envelope.connect(master);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.7);
      step += 1;
    }

    function startLoop() {
      if (timer || stopped) return;
      playNote();
      timer = window.setInterval(playNote, 760);
    }

    const resume = () => {
      context.resume().then(() => {
        setBlocked(false);
        startLoop();
      }).catch(() => setBlocked(true));
    };

    if (context.state === "running") startLoop();
    else {
      setBlocked(true);
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
      void context.resume().then(() => {
        setBlocked(false);
        startLoop();
      }).catch(() => setBlocked(true));
    }

    return () => {
      stopped = true;
      if (timer) window.clearInterval(timer);
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
      master.disconnect();
      void context.close().catch(() => undefined);
    };
  }, [enabled, supported]);

  return { supported, blocked: enabled && blocked };
}
