import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { BuzzSettings } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";
import { useFeedback } from "../../feedback/FeedbackProvider";
import { vibrate } from "../../utils/deviceFeedback";

type Phase = "ready" | "running" | "done";

/**
 * Stopovanie tajného času.
 *
 * Najdôležitejšie pravidlo hry: obrazovka nikdy neprezradí, ako blízko bol
 * hráč svojmu zadaniu. Po zastavení sa preto zobrazí iba nameraný čas — žiadny
 * rozdiel, hodnotenie ani farba podľa úspešnosti. Zadanie sa tu už ani
 * nepripomína, hráč si ho pamätá z rozdávania.
 */
export default function Round({
  settings,
  onExit,
  onFinish,
}: {
  settings: BuzzSettings;
  onExit: () => void;
  onFinish: (times: number[]) => void;
}) {
  const { playFeedback } = useFeedback();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [times, setTimes] = useState<number[]>([]);
  const [liveMs, setLiveMs] = useState(0);
  const startedAtRef = useRef(0);

  const isLastPlayer = index === settings.playerNames.length - 1;
  const name = settings.playerNames[index];

  // Živý čas dopočítavame z `performance.now()`, takže hodnota nezávisí od
  // toho, ako často stihne prehliadač prekresliť.
  useEffect(() => {
    if (phase !== "running" || settings.blindTiming) return;
    let frame = 0;
    const tick = () => {
      setLiveMs(performance.now() - startedAtRef.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, settings.blindTiming]);

  function handleStart() {
    setLiveMs(0);
    startedAtRef.current = performance.now();
    playFeedback("click");
    vibrate(30);
    setPhase("running");
  }

  function handleStop() {
    const elapsed = Math.round((performance.now() - startedAtRef.current) / 10) / 100;
    setTimes(current => [...current, elapsed]);
    playFeedback("buzzer");
    vibrate(70);
    setPhase("done");
  }

  function handleNext() {
    if (isLastPlayer) {
      onFinish(times);
      return;
    }
    setIndex(current => current + 1);
    setPhase("ready");
  }

  const measured = times[index] ?? 0;
  const dialColor =
    phase === "ready" ? "#94a3b8" : phase === "running" ? "#f43f5e" : "#fb7185";

  return (
    <Shell>
      <TopBar title="Stopovanie" onBack={onExit} />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-7 text-center">
        <div className="flex flex-col items-center gap-2.5" style={{ animation: "fadeIn 0.4s ease-out" }}>
          <span className="rounded-full border border-white/10 bg-white/[.06] px-3 py-1 text-[10px] font-black uppercase tracking-[.2em] text-white/45">
            Hráč {index + 1} z {settings.playerNames.length}
          </span>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-xs font-black">
              {name.slice(0, 2).toUpperCase()}
            </span>
            <h1 className="text-2xl font-black tracking-tight">{name}</h1>
          </div>
        </div>

        {/* Kruh je zároveň veľká tlačiaca plocha na štart aj stop. */}
        <div
          className="buzz-stage"
          style={{ "--buzz-dial-color": dialColor } as CSSProperties}
        >
          {phase === "running" && (
            <>
              <span className="buzz-ripple" aria-hidden="true" />
              <span className="buzz-ripple buzz-ripple-late" aria-hidden="true" />
            </>
          )}

          <button
            type="button"
            onClick={phase === "ready" ? handleStart : phase === "running" ? handleStop : undefined}
            disabled={phase === "done"}
            aria-label={
              phase === "ready"
                ? "Spustiť stopky"
                : phase === "running"
                  ? "Zastaviť stopky"
                  : "Nameraný čas"
            }
            className={cn(
              "buzz-dial",
              phase === "ready" && "buzz-dial-ready",
              phase === "running" && "buzz-dial-live",
              phase === "done" && "buzz-dial-done"
            )}
            style={{ animation: "scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            <div className="buzz-value">
              {phase === "ready" && (
                <>
                  <span className="buzz-dial-icon">
                    <Icons.play size={52} />
                  </span>
                  <span className="buzz-caption">ťukni a spusti</span>
                </>
              )}

              {phase === "running" && (
                settings.blindTiming ? (
                  <>
                    <span className="buzz-blind" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="buzz-caption">ťukni a zastav</span>
                  </>
                ) : (
                  <>
                    <span className="buzz-number text-white">
                      {(liveMs / 1000).toFixed(2).replace(".", ",")}
                    </span>
                    <span className="buzz-caption">ťukni a zastav</span>
                  </>
                )
              )}

              {/* Jednotku nesieme v popise pod číslom — vo veľkom čísle by sa
                  „s“ tlačilo na okraj kruhu. */}
              {phase === "done" && (
                <>
                  <span key={measured} className="buzz-number text-white">
                    {measured.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="buzz-caption">sekúnd — tvoj čas</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Priebeh kola */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {settings.playerNames.map((playerName, i) => (
            <span
              key={i}
              aria-hidden="true"
              title={playerName}
              className={cn(
                "buzz-dot",
                i === index && "buzz-dot-active",
                i < index && "buzz-dot-done"
              )}
            />
          ))}
        </div>
      </div>

      {phase === "ready" && (
        <Button fullWidth onClick={handleStart} className="mt-4">
          <span className="inline-flex items-center gap-2">Spustiť stopky <Icons.play size={18} /></span>
        </Button>
      )}

      {phase === "running" && (
        <button
          type="button"
          onClick={handleStop}
          className="buzz-button mt-4 flex w-full items-center justify-center gap-3 px-5 py-4"
        >
          <span className="text-xl font-black uppercase tracking-[.16em]">Zastaviť</span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
            <Icons.stopCircle size={22} />
          </span>
        </button>
      )}

      {phase === "done" && (
        <Button fullWidth onClick={handleNext} className="mt-4">
          <span className="inline-flex items-center gap-2">
            {isLastPlayer
              ? "Zobraziť výsledky"
              : `Ďalší hráč: ${settings.playerNames[index + 1]}`}
            <Icons.chevronRight size={18} />
          </span>
        </Button>
      )}
    </Shell>
  );
}
