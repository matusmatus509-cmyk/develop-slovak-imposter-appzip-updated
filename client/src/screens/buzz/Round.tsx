import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { BuzzAssignment, BuzzSettings } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";
import { formatBuzzRange, formatBuzzTime } from "../../utils/buzzLogic";
import { useFeedback } from "../../feedback/FeedbackProvider";
import { vibrate } from "../../utils/deviceFeedback";

type Phase = "ready" | "running" | "done";

/**
 * Stopovanie tajného času.
 *
 * Najdôležitejšie pravidlo hry: obrazovka nikdy neprezradí, ako blízko bol
 * hráč svojmu zadaniu. Po zastavení sa preto zobrazí iba nameraný čas — žiadny
 * rozdiel, hodnotenie ani farba podľa úspešnosti.
 */
export default function Round({
  settings,
  assignment,
  onExit,
  onFinish,
}: {
  settings: BuzzSettings;
  assignment: BuzzAssignment;
  onExit: () => void;
  onFinish: (times: number[]) => void;
}) {
  const { playFeedback } = useFeedback();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [times, setTimes] = useState<number[]>([]);
  const [peeking, setPeeking] = useState(false);
  const [liveMs, setLiveMs] = useState(0);
  const startedAtRef = useRef(0);

  const isImpostor = index === assignment.impostorIndex;
  const isLastPlayer = index === settings.playerNames.length - 1;

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
    setPeeking(false);
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
  const dialColor = phase === "done" ? "#fb7185" : phase === "running" ? "#f43f5e" : "#64748b";

  return (
    <Shell>
      <TopBar title="Stopovanie" onBack={onExit} />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 text-center">
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
          <p className="text-[11px] font-black uppercase tracking-[.2em] text-white/40">
            Hráč {index + 1} z {settings.playerNames.length}
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight">
            {settings.playerNames[index]}
          </h1>
        </div>

        {/* Kruh je zároveň veľká tlačiaca plocha na štart aj stop. */}
        <button
          type="button"
          onClick={phase === "ready" ? handleStart : phase === "running" ? handleStop : undefined}
          disabled={phase === "done"}
          aria-label={phase === "ready" ? "Spustiť stopky" : phase === "running" ? "Zastaviť stopky" : "Nameraný čas"}
          className={cn("buzz-dial", phase === "running" && "buzz-dial-live")}
          style={
            {
              "--buzz-angle": "360deg",
              "--buzz-dial-color": dialColor,
              animation: "scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
            } as CSSProperties
          }
        >
          <div className="buzz-value">
            {phase === "ready" && (
              <>
                <span className="buzz-dial-icon">
                  <Icons.play size={44} />
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

        {/* Pripomenutie zadania — iba pred spustením a iba pre hráča na rade. */}
        {phase === "ready" && (
          <div className="w-full">
            {peeking ? (
              <div
                className={cn(
                  "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left",
                  isImpostor
                    ? "border-red-500/25 bg-red-950/30"
                    : "border-emerald-500/25 bg-emerald-950/25"
                )}
                style={{ animation: "popIn 0.3s ease-out" }}
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/40">
                    {isImpostor ? "Tvoj rozsah" : "Tvoj tajný čas"}
                  </p>
                  <p className="text-lg font-black tabular-nums text-white">
                    {isImpostor
                      ? formatBuzzRange(assignment.rangeMinSeconds, assignment.rangeMaxSeconds)
                      : formatBuzzTime(assignment.targetSeconds)}
                  </p>
                </div>
                <button
                  onClick={() => setPeeking(false)}
                  className="rounded-xl border border-white/12 bg-white/[.06] px-3 py-2 text-xs font-bold text-white/70"
                >
                  Skryť
                </button>
              </div>
            ) : (
              <button
                onClick={() => setPeeking(true)}
                className="mx-auto flex items-center gap-2 rounded-2xl border border-white/12 bg-white/[.05] px-4 py-2.5 text-xs font-bold text-white/60 transition-all hover:bg-white/10 active:scale-95"
              >
                <Icons.eye size={15} /> Pripomenúť moje zadanie
              </button>
            )}
          </div>
        )}

        {phase === "running" && (
          <p className="text-xs leading-relaxed text-white/45">
            {settings.blindTiming
              ? "Čas beží skryto. Zastav ho vtedy, keď to podľa teba sedí."
              : "Čas vidíš — zastav ho na svojom čísle."}
          </p>
        )}

        {phase === "done" && (
          <p className="text-xs leading-relaxed text-white/45">
            Toto je celý tvoj výsledok. Hra ti neprezradí, ako blízko si bol.
          </p>
        )}

        {/* Priebeh kola */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {settings.playerNames.map((name, i) => (
            <span
              key={i}
              aria-hidden="true"
              title={name}
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
          className="buzz-button mt-4 flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <span>
            <span className="block text-lg font-black uppercase tracking-[.13em]">
              Zastaviť
            </span>
            <span className="block text-[11px] font-bold text-white/70">
              Teraz je ten správny moment?
            </span>
          </span>
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
