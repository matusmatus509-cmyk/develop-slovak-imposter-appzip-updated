import { useEffect, useRef, useState } from "react";
import type { GameSettings } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";
import { formatTime } from "../../utils/format";

export default function Discussion({
  settings,
  onExit,
  onFinish,
}: {
  settings: GameSettings;
  onExit: () => void;
  onFinish: (elapsedSeconds: number) => void;
}) {
  const hasTimer = settings.timerSeconds > 0;
  const [remaining, setRemaining] = useState(settings.timerSeconds);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!hasTimer) {
      const interval = setInterval(() => {
        if (!paused) setElapsed((e) => e + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    const interval = setInterval(() => {
      if (paused) return;
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval);
          if (!finishedRef.current) {
            finishedRef.current = true;
            setTimeout(() => onFinish(settings.timerSeconds), 300);
          }
          return 0;
        }
        return r - 1;
      });
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, hasTimer]);

  const progress = hasTimer
    ? ((settings.timerSeconds - remaining) / settings.timerSeconds) * 100
    : 0;

  return (
    <Shell>
      <TopBar title="Diskusia" onBack={onExit} />

      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">
            Hráči diskutujú a hľadajú podvodníka
          </p>
          <h1 className="mt-1 text-2xl font-black">Kto sa správa podozrivo?</h1>
        </div>

        <div className="relative flex h-56 w-56 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="8"
            />
            {hasTimer && (
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="url(#grad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={
                  2 * Math.PI * 44 * (1 - progress / 100)
                }
              />
            )}
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#c026d3" />
              </linearGradient>
            </defs>
          </svg>
          <div>
            <p className="text-5xl font-black tabular-nums">
              {hasTimer ? formatTime(remaining) : formatTime(elapsed)}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-white/40">
              {hasTimer ? "zostáva" : "uplynulo"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setPaused((p) => !p)}
          className="rounded-2xl border border-white/15 bg-white/10 px-6 py-2.5 text-sm font-bold"
        >
          {paused ? "▶ Pokračovať" : "⏸ Pozastaviť"}
        </button>
      </div>

      <Button fullWidth variant="secondary" onClick={() => onFinish(elapsed)}>
        Prejsť na hlasovanie 🗳️
      </Button>
    </Shell>
  );
}
