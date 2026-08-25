import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { GameSettings } from "../../types";
import { Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { formatTime } from "../../utils/format";
import { useCountdown, useStopwatch } from "../../hooks/useCountdown";
import { useFeedback } from "../../feedback/FeedbackProvider";
import { vibrate } from "../../utils/deviceFeedback";
import { cn } from "../../utils/designTokens";

/** Ako dlho vidí partia bzučiakový efekt, kým sa otvorí hlasovanie. */
const BUZZ_HOLD_MS = 700;

export default function Round({
  settings,
  onExit,
  onFinish,
}: {
  settings: GameSettings;
  onExit: () => void;
  onFinish: (elapsedSeconds: number) => void;
}) {
  const hasTimer = settings.timerSeconds > 0;
  const { playFeedback } = useFeedback();
  const [paused, setPaused] = useState(false);
  const [buzzed, setBuzzed] = useState(false);
  const [speaker, setSpeaker] = useState(0);
  const finishedRef = useRef(false);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function finish(time: number) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    finishTimeoutRef.current = null;
    onFinish(time);
  }

  // Rovnako ako diskusia v klasickom Imposterovi: odpočet aj stopky pracujú
  // s reálnym časom, takže pauza čas naozaj zastaví a po návrate do aplikácie
  // sa hodnota dorovná namiesto zaostávania.
  const countdown = useCountdown(
    settings.timerSeconds,
    hasTimer && !paused && !buzzed,
    () => {
      if (finishedRef.current || finishTimeoutRef.current) return;
      finishTimeoutRef.current = setTimeout(() => finish(settings.timerSeconds), 400);
    },
  );
  const stopwatch = useStopwatch(!hasTimer && !paused && !buzzed);

  useEffect(() => () => {
    if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
  }, []);

  const remaining = countdown.secondsLeft;
  const elapsed = hasTimer
    ? Math.max(0, settings.timerSeconds - remaining)
    : stopwatch.elapsedSeconds;
  const isLowestRemaining = hasTimer && remaining <= 10 && remaining > 0;
  const timeUp = hasTimer && remaining <= 0;

  const dialColor = buzzed
    ? "#f43f5e"
    : isLowestRemaining || timeUp
      ? "#ef4444"
      : "#fb7185";
  const dialAngle = hasTimer ? (countdown.percentLeft / 100) * 360 : 360;
  const label = buzzed ? "bzučiak" : hasTimer ? "zostáva" : "uplynulo";
  const display = buzzed
    ? "STOP"
    : hasTimer
      ? formatTime(remaining)
      : formatTime(elapsed);

  function handleBuzz() {
    if (buzzed || finishedRef.current) return;
    setBuzzed(true);
    playFeedback("buzzer");
    vibrate([90, 55, 150]);
    finishTimeoutRef.current = setTimeout(() => finish(elapsed), BUZZ_HOLD_MS);
  }

  function nextSpeaker() {
    if (buzzed) return;
    playFeedback("click");
    setSpeaker((current) => (current + 1) % settings.playerNames.length);
  }

  return (
    <Shell>
      <TopBar title="Imposter Buzz" onBack={onExit} />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 text-center">
        <div style={{ animation: "fadeIn 0.5s ease-out" }}>
          <p className="text-[11px] font-black uppercase tracking-[.2em] text-white/40">
            {buzzed ? "Čas zastavený" : paused ? "Odpočet pozastavený" : "Odpočet beží"}
          </p>
          <h1 className="mt-1 text-xl font-black tracking-tight">
            Každý povie jedno slovo
          </h1>
        </div>

        <div
          className={cn("buzz-dial", (isLowestRemaining || buzzed) && "buzz-dial-low")}
          style={
            {
              "--buzz-angle": `${dialAngle}deg`,
              "--buzz-dial-color": dialColor,
              animation: "scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1)",
            } as CSSProperties
          }
        >
          <div className="buzz-value">
            <span
              key={display}
              className={cn(
                "buzz-number",
                isLowestRemaining || buzzed || timeUp ? "text-red-400" : "text-white",
              )}
            >
              {display}
            </span>
            <span className="buzz-caption">{label}</span>
          </div>
          {paused && !buzzed && (
            <span className="buzz-paused-badge">
              <Icons.pause size={13} /> Pauza
            </span>
          )}
        </div>

        <div className="w-full rounded-3xl border border-white/10 bg-white/[.04] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 text-left">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/40">
                Na slove je
              </p>
              <p className="truncate text-base font-black text-rose-200">
                {settings.playerNames[speaker]}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => setPaused((p) => !p)}
                disabled={buzzed}
                aria-label={paused ? "Pokračovať" : "Pozastaviť"}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/[.06] text-white/70 transition-all hover:bg-white/12 active:scale-95 disabled:opacity-30"
              >
                {paused ? <Icons.play size={16} /> : <Icons.pause size={16} />}
              </button>
              <button
                onClick={nextSpeaker}
                disabled={buzzed}
                className="flex h-10 items-center gap-1 rounded-2xl border border-white/12 bg-white/[.06] px-3.5 text-xs font-bold transition-all hover:bg-white/12 active:scale-95 disabled:opacity-30"
              >
                Ďalší <Icons.chevronRight size={15} />
              </button>
            </div>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
            {settings.playerNames.map((name, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={cn(
                  "buzz-dot",
                  i === speaker && "buzz-dot-active",
                  i < speaker && "buzz-dot-done",
                )}
                title={name}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleBuzz}
        disabled={buzzed}
        className="buzz-button mt-4 flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span>
          <span className="block text-lg font-black uppercase tracking-[.13em]">
            Bzučiak
          </span>
          <span className="block text-[11px] font-bold text-white/70">
            Zastav čas a prejdi na hlasovanie
          </span>
        </span>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
          <Icons.bell size={22} />
        </span>
      </button>

      {buzzed && (
        <div
          className="buzz-flash pointer-events-none fixed inset-0 z-40 grid place-items-center"
          aria-hidden="true"
        >
          <span className="text-5xl font-black uppercase tracking-[.18em] drop-shadow-2xl">
            Bzzz!
          </span>
        </div>
      )}
    </Shell>
  );
}
