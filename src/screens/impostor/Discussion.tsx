import { useEffect, useRef, useState } from "react";
import type { GameSettings } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";
import { formatTime } from "../../utils/format";
import { useSound } from "../../hooks/useSound";

export default function Discussion({
  settings,
  onExit,
  onFinish,
}: {
  settings: GameSettings;
  onExit: () => void;
  onFinish: (elapsedSeconds: number) => void;
}) {
  const { play } = useSound();
  const hasTimer = settings.timerSeconds > 0;
  const [remaining, setRemaining] = useState(settings.timerSeconds);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const finishedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function finish(time: number) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    finishTimeoutRef.current = null;
    onFinish(time);
  }

  useEffect(() => {
    if (!hasTimer) {
      const interval = setInterval(() => {
        if (!paused) setElapsed((e) => e + 1);
      }, 1000);
      intervalRef.current = interval;
      return () => clearInterval(interval);
    }
    const interval = setInterval(() => {
      if (paused) return;
      setRemaining((r) => {
        if (r <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (!finishedRef.current && !finishTimeoutRef.current) {
            play("alarm");
            finishTimeoutRef.current = setTimeout(
              () => finish(settings.timerSeconds),
              300,
            );
          }
          return 0;
        }
        // Tick sound in the last 10 seconds
        if (r <= 11) play("tick");
        return r - 1;
      });
      setElapsed((e) => e + 1);
    }, 1000);
    intervalRef.current = interval;
    return () => {
      clearInterval(interval);
      if (finishTimeoutRef.current) {
        clearTimeout(finishTimeoutRef.current);
        finishTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, hasTimer]);

  const progress = hasTimer
    ? ((settings.timerSeconds - remaining) / settings.timerSeconds) * 100
    : 0;
  const isLowestRemaining = hasTimer && remaining <= 10 && remaining > 0;

  return (
    <Shell>
      <TopBar title="Diskusia" onBack={onExit} />

      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <div style={{ animation: "fadeIn 0.5s ease-out" }}>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">
            Hráči diskutujú a hľadajú podvodníka
          </p>
          <h1 className="mt-1 text-2xl font-black">Kto sa správa podozrivo?</h1>
        </div>

        <div
          className="relative flex h-56 w-56 items-center justify-center"
          style={{ animation: "scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
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
                stroke={isLowestRemaining ? "#ef4444" : "url(#grad)"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 44}
                style={{
                  strokeDashoffset: 2 * Math.PI * 44 * (1 - progress / 100),
                  transition: "stroke-dashoffset 1s linear",
                }}
              />
            )}
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#c026d3" />
              </linearGradient>
            </defs>
          </svg>
          {/* Pulse ring on low time */}
          {isLowestRemaining && (
            <svg className="absolute inset-0" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="#ef4444"
                strokeWidth="1"
                opacity="0.4"
                style={{ animation: "ring 0.8s ease-in-out infinite" }}
              />
            </svg>
          )}
          <div className={isLowestRemaining ? "animate-pulse" : ""}>
            <p
              className={isLowestRemaining ? "text-5xl font-black tabular-nums text-red-400" : "text-5xl font-black tabular-nums"}
            >
              {hasTimer ? formatTime(remaining) : formatTime(elapsed)}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-white/40">
              {hasTimer ? "zostáva" : "uplynulo"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setPaused((p) => !p)}
          className="rounded-2xl border border-white/15 bg-white/8 px-6 py-2.5 text-sm font-bold transition-all hover:bg-white/12 active:scale-95"
        >
          {paused ? "▶ Pokračovať" : "⏸ Pozastaviť"}
        </button>
      </div>

      <Button fullWidth variant="secondary" onClick={() => finish(elapsed)}>
        Prejsť na hlasovanie 🗳️
      </Button>
    </Shell>
  );
}
