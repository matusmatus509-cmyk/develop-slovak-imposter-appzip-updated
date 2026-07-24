import { useState, useEffect, useRef } from "react";
import { BOMB_CATEGORIES } from "../../data/prompts";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { takePersistentItem } from "../../utils/persistentDeck";

type Phase = "ready" | "ticking" | "exploded";

export default function KtoDostaneBombu({
  onBack,
  onRoundComplete,
}: {
  onBack: () => void;
  onRoundComplete?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [category, setCategory] = useState<string>(() => takePersistentItem("bomb-categories", BOMB_CATEGORIES));
  const [pulse, setPulse] = useState(false);
  const explosionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speedOneRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speedTwoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completionReportedRef = useRef(false);

  function clearTimers() {
    if (explosionRef.current) clearTimeout(explosionRef.current);
    if (speedOneRef.current) clearTimeout(speedOneRef.current);
    if (speedTwoRef.current) clearTimeout(speedTwoRef.current);
    if (pulseRef.current) clearInterval(pulseRef.current);
    explosionRef.current = null;
    speedOneRef.current = null;
    speedTwoRef.current = null;
    pulseRef.current = null;
  }

  function startBomb() {
    clearTimers();
    completionReportedRef.current = false;
    setPhase("ticking");
    const duration = (30 + Math.floor(Math.random() * 61)) * 1000;

    let interval = 1000;
    function schedulePulse() {
      pulseRef.current = setInterval(() => {
        setPulse((p) => !p);
      }, interval);
    }
    schedulePulse();

    speedOneRef.current = setTimeout(() => {
      if (pulseRef.current) clearInterval(pulseRef.current);
      interval = 600;
      schedulePulse();
    }, 20000);

    speedTwoRef.current = setTimeout(() => {
      if (pulseRef.current) clearInterval(pulseRef.current);
      interval = 350;
      schedulePulse();
    }, 50000);

    explosionRef.current = setTimeout(() => {
      clearTimers();
      setPhase("exploded");
      setPulse(false);
      if (!completionReportedRef.current) {
        completionReportedRef.current = true;
        onRoundComplete?.();
      }
      navigator.vibrate?.([120, 60, 180]);
    }, duration);
  }

  function reset() {
    clearTimers();
    setPulse(false);
    setCategory(takePersistentItem("bomb-categories", BOMB_CATEGORIES));
    setPhase("ready");
  }

  useEffect(() => () => clearTimers(), []);

  // ── Exploded ──────────────────────────────────────────────────────
  if (phase === "exploded") {
    return (
      <Shell>
        <TopBar title="Kto dostane bombu" onBack={onBack} />
        <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
          <div
            className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-rose-500/30 to-orange-500/20"
            style={{ animation: "tada 0.8s ease-out 0.1s both" }}
          >
            <div style={{ animation: "float 3s ease-in-out 0.9s infinite" }}>
              <Icons.flame size={88} className="text-rose-400" />
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
            className="glass w-full rounded-3xl p-5"
            style={{ animation: "slideUp 0.5s ease-out 0.2s both" }}
          >
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
              Kategória bola
            </p>
            <p className="text-lg font-bold text-white">{category}</p>
          </div>
          <Button fullWidth onClick={reset}>
            Nová kategória 🔄
          </Button>
        </div>
      </Shell>
    );
  }

  // ── Ready / Ticking ───────────────────────────────────────────────
  return (
    <Shell>
      <TopBar title="Kto dostane bombu" onBack={onBack} />

      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        {/* Bomb */}
        <div
          className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-rose-500/20 to-amber-500/10 transition-transform duration-150"
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
          <Icons.flame size={88} className="text-rose-400" />
        </div>

        {phase === "ready" && (
          <p
            className="text-xs font-bold uppercase tracking-widest text-white/40"
            style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}
          >
            Povedzte slovo z kategórie a rýchlo podajte telefón ďalej
          </p>
        )}

        {phase === "ticking" && (
          <p
            className="text-xs font-bold uppercase tracking-widest transition-colors"
            style={{ color: pulse ? "#f87171" : "rgba(255,255,255,0.4)" }}
          >
            ⏱ Tikáme… podávajte rýchlo!
          </p>
        )}

        {/* Category card */}
        <div
          className="glass w-full rounded-3xl p-8 transition-all"
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
            Kategória
          </p>
          <p className="text-2xl font-bold text-white">{category}</p>
        </div>

        {phase === "ready" && (
          <Button fullWidth onClick={startBomb}>
            Štart 💣
          </Button>
        )}

        {phase === "ticking" && (
          <p className="text-sm text-white/30">
            Bomba tikáte… nikto nevie kedy vybuchne!
          </p>
        )}
      </div>
    </Shell>
  );
}
