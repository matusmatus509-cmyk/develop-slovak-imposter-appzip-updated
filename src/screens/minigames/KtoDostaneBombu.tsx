import { useState, useEffect, useRef } from "react";
import { BOMB_CATEGORIES } from "../../data/prompts";
import { Button, Shell, TopBar } from "../../components/ui";

function pickRandom<T>(arr: T[], exclude?: T): T {
  if (arr.length === 1) return arr[0];
  let item: T;
  do {
    item = arr[Math.floor(Math.random() * arr.length)];
  } while (item === exclude);
  return item;
}

type Phase = "ready" | "ticking" | "exploded";

export default function KtoDostaneBombu({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [category, setCategory] = useState<string>(() => pickRandom(BOMB_CATEGORIES));
  // pulse animation tick
  const [pulse, setPulse] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearTimers() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (pulseRef.current) clearInterval(pulseRef.current);
  }

  function startBomb() {
    setPhase("ticking");
    // Random hidden duration: 30 – 90 seconds
    const duration = (30 + Math.floor(Math.random() * 61)) * 1000;
    timerRef.current = setTimeout(() => {
      setPhase("exploded");
      clearInterval(pulseRef.current!);
    }, duration);
    // Pulse faster as time passes — starts at 1000ms, halves every 20s
    let interval = 1000;
    function schedulePulse() {
      pulseRef.current = setInterval(() => {
        setPulse((p) => !p);
      }, interval);
    }
    schedulePulse();
    // Speed up every 20s
    const speed1 = setTimeout(() => {
      clearInterval(pulseRef.current!); interval = 600; schedulePulse();
    }, 20000);
    const speed2 = setTimeout(() => {
      clearInterval(pulseRef.current!); interval = 350; schedulePulse();
    }, 50000);
    // clean these up too on explode
    timerRef.current = setTimeout(() => {
      setPhase("exploded");
      clearInterval(pulseRef.current!);
      clearTimeout(speed1);
      clearTimeout(speed2);
    }, duration);
  }

  function reset() {
    clearTimers();
    setPulse(false);
    setCategory((prev) => pickRandom(BOMB_CATEGORIES, prev));
    setPhase("ready");
  }

  useEffect(() => () => clearTimers(), []);

  // ── Exploded ──────────────────────────────────────────────────────
  if (phase === "exploded") {
    return (
      <Shell>
        <TopBar title="Kto dostane bombu" onBack={onBack} />
        <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
          <div className="text-8xl animate-bounce">💥</div>
          <div>
            <h2 className="text-3xl font-black text-rose-400 uppercase tracking-wide">
              BOOM!
            </h2>
            <p className="mt-2 text-lg font-bold text-white">
              Kto drží telefón, prehral!
            </p>
          </div>
          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
              Kategória bola
            </p>
            <p className="text-lg font-black text-white">{category}</p>
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
          className="text-8xl transition-transform duration-150"
          style={{ transform: pulse && phase === "ticking" ? "scale(1.15)" : "scale(1)" }}
        >
          {phase === "ticking" ? "💣" : "💣"}
        </div>

        {phase === "ready" && (
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">
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
          className="w-full rounded-3xl p-8 transition-all"
          style={{
            border: phase === "ticking"
              ? `2px solid ${pulse ? "#f87171" : "rgba(248,113,113,0.3)"}`
              : "1px solid rgba(255,255,255,0.1)",
            background: phase === "ticking"
              ? "rgba(239,68,68,0.1)"
              : "rgba(255,255,255,0.05)",
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
            Kategória
          </p>
          <p className="text-2xl font-black text-white">{category}</p>
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
