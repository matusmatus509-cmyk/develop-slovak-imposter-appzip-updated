import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { getPassTheBombForLanguage, type BombTask } from "../../data/localizedPassTheBomb";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { takePersistentItem } from "../../utils/persistentDeck";
import { vibrate } from "../../utils/deviceFeedback";
import { useCountdown } from "../../hooks/useCountdown";

type Phase = "ready" | "ticking" | "exploded";

const randomFuseSeconds = () => 30 + Math.floor(Math.random() * 61);

export default function KtoDostaneBombu({
  onBack,
  onRoundComplete,
}: {
  onBack: () => void;
  onRoundComplete?: () => void;
}) {
  const { language } = useLanguage();
  const deck = useMemo<BombTask[]>(() => getPassTheBombForLanguage(language), [language]);
  const draw = useCallback(() => takePersistentItem("pass-the-bomb", deck, (item) => item.id), [deck]);

  const [phase, setPhase] = useState<Phase>("ready");
  const [task, setTask] = useState<BombTask>(draw);
  const [pulse, setPulse] = useState(false);
  const [fuseSeconds, setFuseSeconds] = useState(randomFuseSeconds);
  const pulseRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completionReportedRef = useRef(false);

  function clearPulse() {
    if (pulseRef.current) clearInterval(pulseRef.current);
    pulseRef.current = null;
  }

  // Zápalná šnúra sa meria absolútnym časom, takže sa nedá predĺžiť prekresľovaním
  // obrazovky. Po prepnutí aplikácie na pozadie a späť sa čas dorovná okamžite.
  const { secondsLeft, reset: resetFuse } = useCountdown(fuseSeconds, phase === "ticking", () => {
    clearPulse();
    setPhase("exploded");
    setPulse(false);
    if (!completionReportedRef.current) {
      completionReportedRef.current = true;
      onRoundComplete?.();
    }
    vibrate([120, 60, 180]);
  });

  // Tikanie sa zrýchľuje podľa uplynutého času, nie podľa reťazených timeoutov.
  const elapsedSeconds = fuseSeconds - secondsLeft;
  const pulseInterval = elapsedSeconds >= 50 ? 350 : elapsedSeconds >= 20 ? 600 : 1000;

  useEffect(() => {
    if (phase !== "ticking") {
      clearPulse();
      return;
    }
    pulseRef.current = setInterval(() => setPulse((value) => !value), pulseInterval);
    return () => clearPulse();
  }, [phase, pulseInterval]);

  function startBomb() {
    completionReportedRef.current = false;
    const nextFuse = randomFuseSeconds();
    setFuseSeconds(nextFuse);
    resetFuse(nextFuse);
    setPhase("ticking");
  }

  function reset() {
    clearPulse();
    setPulse(false);
    resetFuse(fuseSeconds);
    setTask(draw());
    setPhase("ready");
  }

  useEffect(() => () => clearPulse(), []);

  // ── Exploded ──────────────────────────────────────────────────────
  if (phase === "exploded") {
    return (
      <Shell className="bomb-game-shell">
        <TopBar title="Kto dostane bombu" onBack={onBack} />
        <div className="bomb-game-stage flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div
            className="bomb-game-orb is-exploded"
            style={{ animation: "tada 0.8s ease-out 0.1s both" }}
          >
            <div style={{ animation: "float 3s ease-in-out 0.9s infinite" }}>
              <Icons.bomb size={76} className="text-rose-300 drop-shadow-[0_10px_24px_rgba(251,113,133,.32)]" />
            </div>
          </div>
          <div style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}>
            <h2 className="text-gradient text-4xl font-black uppercase tracking-wide">
              BOOM!
            </h2>
            <p className="mt-2 text-lg font-bold text-white">
              Kto drží telefón, prehral!
            </p>
          </div>
          <div
            className="bomb-task-card"
            style={{ animation: "slideUp 0.5s ease-out 0.2s both" }}
          >
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
              Úloha bola
            </p>
            <p className="text-lg font-bold text-white" data-no-translate>{task.text}</p>
          </div>
          <Button fullWidth onClick={reset}>
            <span className="inline-flex items-center gap-2">Nová úloha <Icons.refresh size={17} /></span>
          </Button>
        </div>
      </Shell>
    );
  }

  // ── Ready / Ticking ───────────────────────────────────────────────
  return (
      <Shell className="bomb-game-shell">
        <TopBar title="Kto dostane bombu" onBack={onBack} />

      <div className="bomb-game-stage flex flex-1 flex-col items-center justify-center gap-6 text-center">
        {/* Bomb */}
        <div
          className="bomb-game-orb transition-transform duration-150"
          style={{
            transform:
              pulse && phase === "ticking" ? "scale(1.15)" : "scale(1)",
            animation:
              phase === "ticking"
                ? pulse
                  ? "ring 0.6s ease-in-out infinite"
                  : "ring 1.5s ease-in-out infinite"
                : "float 3s ease-in-out infinite",
          }}
        >
          <Icons.bomb size={76} className="text-rose-300 drop-shadow-[0_10px_24px_rgba(251,113,133,.32)]" />
        </div>

        {phase === "ready" && (
          <p
            className="bomb-game-instruction"
            style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}
          >
            Povedzte slovo. Podajte telefón.
          </p>
        )}

        {phase === "ticking" && (
          <p
            className="bomb-game-instruction transition-colors"
            style={{ color: pulse ? "#f87171" : "rgba(255,255,255,0.4)" }}
          >
            <span className="inline-flex items-center gap-2"><Icons.timer size={15} /> Podávajte rýchlo!</span>
          </p>
        )}

        {/* Category card */}
        <div
          className="bomb-task-card transition-all"
          style={{
            border:
              phase === "ticking"
                ? `2px solid ${pulse ? "#f87171" : "rgba(248,113,113,0.3)"}`
                : "1px solid rgba(255,255,255,0.1)",
            background:
              phase === "ticking" ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)",
            animation: "slideUp 0.5s ease-out 0.15s both",
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
            Zadanie
          </p>
          <p className="text-2xl font-bold text-white" data-no-translate>{task.text}</p>
        </div>

        {phase === "ready" && (
          <Button fullWidth onClick={startBomb}>
            <span className="inline-flex items-center gap-2">Štart <Icons.bomb size={18} /></span>
          </Button>
        )}

      </div>
    </Shell>
  );
}
