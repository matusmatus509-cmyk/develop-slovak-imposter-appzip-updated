import { useState, useEffect, useRef } from "react";
import { Button, Shell, TopBar } from "../../components/ui";
import { PING_PONG_PROMPTS } from "../../data/pingPongPrompts";
import { defaultPlayerName, useLanguage } from "../../i18n/LanguageProvider";

// ─── Constants ────────────────────────────────────────────────────────────────

function pickPrompt(exclude?: string) {
  const pool = exclude
    ? PING_PONG_PROMPTS.filter((prompt) => prompt !== exclude)
    : PING_PONG_PROMPTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Colors
const COLOR_TOP = "#e85577";    // Player 1 — red/pink
const COLOR_TOP_DARK = "#9e2a40";
const COLOR_BOT = "#6b70d8";    // Player 2 — blue/purple
const COLOR_BOT_DARK = "#3a3e8a";

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (name1: string, name2: string, secsToEdge: number) => void;
}) {
  const { language } = useLanguage();
  const [name1, setName1] = useState(() => defaultPlayerName(language, 1));
  const [name2, setName2] = useState(() => defaultPlayerName(language, 2));
  const [speed, setSpeed] = useState(4); // seconds for ball to reach edge from centre

  return (
    <Shell>
      <TopBar title="Slovný Ping Pong" onBack={onBack} />

      <div className="mb-5 rounded-3xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-white/70 leading-relaxed">
        Telefón položte na stôl. Každý sedí na svojej strane.
        Hovorte slová na dané písmeno a{" "}
        <strong className="text-white">klepnite na svoju polovicu</strong> po každom slove.
        Čiara sa pohybuje smerom k vám — kto nestihne, prehráva!
      </div>

      {/* Player 1 */}
      <div className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
          Hráč 1 (horná strana — ružová)
        </p>
        <input
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          placeholder={defaultPlayerName(language, 1)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base font-semibold text-white placeholder-white/30 outline-none focus:border-pink-400/60"
        />
      </div>

      {/* Player 2 */}
      <div className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
          Hráč 2 (dolná strana — modrá)
        </p>
        <input
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          placeholder={defaultPlayerName(language, 2)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base font-semibold text-white placeholder-white/30 outline-none focus:border-blue-400/60"
        />
      </div>

      {/* Speed */}
      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-sm font-bold text-white/60 uppercase tracking-widest">
          Rýchlosť
        </p>
        <div className="flex gap-2">
          {[
            { label: "Pomaly", val: 6 },
            { label: "Stredne", val: 4 },
            { label: "Rýchlo", val: 2.5 },
            { label: "Šialene", val: 1.5 },
          ].map((opt) => (
            <button
              key={opt.val}
              onClick={() => setSpeed(opt.val)}
              className={`flex-1 rounded-2xl border py-3 text-xs font-bold transition active:scale-95 ${
                speed === opt.val
                  ? "border-green-400/60 bg-green-500/30 text-green-300"
                  : "border-white/10 bg-white/5 text-white/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Button fullWidth onClick={() => onStart(name1.trim() || defaultPlayerName(language, 1), name2.trim() || defaultPlayerName(language, 2), speed)}>
        🏓 Hrať!
      </Button>
    </Shell>
  );
}

// ─── Game Screen ──────────────────────────────────────────────────────────────

function GameScreen({
  name1,
  name2,
  secsToEdge,
  onBack,
}: {
  name1: string;
  name2: string;
  secsToEdge: number;
  onBack: () => void;
}) {
  // ballY: 0 = top edge, 1 = bottom edge. Start in middle.
  const [ballY, setBallY] = useState(0.5);
  const [prompt, setPrompt] = useState(() => pickPrompt());
  // active = 0 → ball moves toward TOP (player 1 must answer)
  // active = 1 → ball moves toward BOTTOM (player 2 must answer)
  const [active, setActive] = useState<0 | 1>(() => (Math.random() < 0.5 ? 0 : 1));
  const [result, setResult] = useState<{ loser: 0 | 1 } | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [roundKey, setRoundKey] = useState(0);

  // Refs for animation loop (avoid stale closures)
  const ballYRef = useRef(0.5);
  const activeRef = useRef<0 | 1>(active);
  const gameOverRef = useRef(false);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const startTsRef = useRef<number>(0);

  // BASE speed: fraction/sec so ball travels 0.5 in secsToEdge seconds
  const baseSpeed = 0.5 / secsToEdge;

  // Keep activeRef in sync when we setActive from outside the loop
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (countdown <= 0 || result) return;
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, result]);

  // Animation loop
  useEffect(() => {
    if (countdown > 0 || result) return;
    gameOverRef.current = false;
    ballYRef.current = 0.5;
    lastTsRef.current = 0;
    startTsRef.current = 0;

    function tick(ts: number) {
      if (gameOverRef.current) return;

      if (!startTsRef.current) startTsRef.current = ts;
      const dt = lastTsRef.current ? (ts - lastTsRef.current) / 1000 : 0;
      lastTsRef.current = ts;

      // Gradually speed up: +1.5% per second elapsed
      const elapsed = (ts - startTsRef.current) / 1000;
      const speed = baseSpeed * (1 + elapsed * 0.015);

      // Direction: active=0 moves toward top (negative), active=1 toward bottom (positive)
      const dir = activeRef.current === 0 ? -1 : 1;
      let newY = ballYRef.current + dir * speed * dt;

      if (newY <= 0) {
        newY = 0;
        gameOverRef.current = true;
        ballYRef.current = newY;
        setBallY(newY);
        setResult({ loser: 0 }); // top player (0) lost
        return;
      }
      if (newY >= 1) {
        newY = 1;
        gameOverRef.current = true;
        ballYRef.current = newY;
        setBallY(newY);
        setResult({ loser: 1 }); // bottom player (1) lost
        return;
      }

      ballYRef.current = newY;
      setBallY(newY);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [baseSpeed, countdown, result, roundKey]);

  function handleTap(side: 0 | 1) {
    if (gameOverRef.current) return;
    // Only active player (under pressure) can tap to bounce
    if (side !== activeRef.current) return;
    const other: 0 | 1 = side === 0 ? 1 : 0;
    // Every valid answer sends the ball back from the centre to the opponent's half.
    ballYRef.current = 0.5;
    setBallY(0.5);
    navigator.vibrate?.([18, 25, 18]);
    activeRef.current = other;
    setActive(other);
  }

  function restart() {
    const newPrompt = pickPrompt(prompt);
    const newActive: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
    setPrompt(newPrompt);
    setActive(newActive);
    setResult(null);
    gameOverRef.current = false;
    ballYRef.current = 0.5;
    activeRef.current = newActive;
    setBallY(0.5);
    setCountdown(3);
    setRoundKey((key) => key + 1);
  }

  const isTopActive = active === 0;

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ touchAction: "none", userSelect: "none" }}
    >
      {/* ── TOP HALF — Player 1 ── */}
      <div
        className="absolute left-0 right-0 top-0 flex items-center justify-center overflow-hidden"
        style={{
          height: "50%",
          backgroundColor: COLOR_TOP,
          cursor: isTopActive ? "pointer" : "default",
        }}
        onPointerDown={() => handleTap(0)}
      >
        {/* The dark pressure shadow grows from the centre only on the player under pressure. */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 bg-black/30 transition-[height] duration-75"
          style={{
            height: isTopActive ? `${Math.max(0, (0.5 - ballY) * 200)}%` : "0%",
            background: `linear-gradient(to top, ${COLOR_TOP_DARK}cc, ${COLOR_TOP_DARK}55, transparent)`,
          }}
        />

        {/* Content — rotated 180° so Player 1 reads from the top */}
        <div
          className="relative z-10 flex flex-col items-center justify-center gap-2 text-center"
          style={{ transform: "rotate(180deg)", pointerEvents: "none" }}
        >
          <p
            className="font-black text-white/90 tracking-tight leading-none"
            style={{ fontSize: "clamp(1.4rem, 5vw, 2.2rem)" }}
          >
            {name1}
          </p>
          {isTopActive && (
            <p className="text-white/70 font-bold text-sm animate-pulse">
              ↓ KLEPNI PO KAŽDOM SLOVE ↓
            </p>
          )}
        </div>
      </div>

      {/* ── DIVIDING LINE ── */}
      <div
        className="absolute left-0 right-0 z-20 flex items-center"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          height: "4px",
          pointerEvents: "none",
        }}
      >
        {/* Dashed white line */}
        <div
          className="w-full"
          style={{
            height: "4px",
            backgroundImage:
              "repeating-linear-gradient(90deg, white 0px, white 20px, transparent 20px, transparent 32px)",
          }}
        />
      </div>

      {/* ── BOTTOM HALF — Player 2 ── */}
      <div
        className="absolute left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden"
        style={{
          height: "50%",
          backgroundColor: COLOR_BOT,
          cursor: !isTopActive ? "pointer" : "default",
        }}
        onPointerDown={() => handleTap(1)}
      >
        {/* The same centre-to-edge pressure shadow for the bottom player. */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 bg-black/30 transition-[height] duration-75"
          style={{
            height: !isTopActive ? `${Math.max(0, (ballY - 0.5) * 200)}%` : "0%",
            background: `linear-gradient(to bottom, ${COLOR_BOT_DARK}cc, ${COLOR_BOT_DARK}55, transparent)`,
          }}
        />

        {/* Content */}
        <div
          className="relative z-10 flex flex-col items-center justify-center gap-2 text-center"
          style={{ pointerEvents: "none" }}
        >
          <p
            className="font-black text-white/90 tracking-tight leading-none"
            style={{ fontSize: "clamp(1.4rem, 5vw, 2.2rem)" }}
          >
            {name2}
          </p>
          {!isTopActive && (
            <p className="text-white/70 font-bold text-sm animate-pulse">
              ↑ KLEPNI PO KAŽDOM SLOVE ↑
            </p>
          )}
        </div>
      </div>

      {/* Ball always starts in the middle and travels only across the active player's half. */}
      <div
        className="pointer-events-none absolute left-1/2 z-30 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-yellow-300 shadow-[0_0_22px_rgba(253,224,71,.95)] animate-pulse"
        style={{ top: `${ballY * 100}%` }}
      />

      {countdown > 0 && !result && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/40 text-center backdrop-blur-sm">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-white/70">Kategória</p>
          <p className="mt-3 max-w-[85vw] text-3xl font-black text-white">{prompt}</p>
          <div className="mt-8 flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/40 bg-white/15 text-6xl font-black text-white animate-pulse">{countdown}</div>
          <p className="mt-4 text-sm font-bold text-white/70">Pripravte sa!</p>
        </div>
      )}

      {/* ── RESULT OVERLAY ── */}
      {result && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75">
          <div className="mx-6 flex flex-col items-center gap-5 rounded-3xl border border-white/15 bg-white/10 p-8 text-center backdrop-blur-md">
            <div className="text-6xl">🏆</div>
            <div>
              <p className="text-lg font-bold text-white/60 mb-1">Vyhráva</p>
              <p className="text-4xl font-black text-white">
                {result.loser === 0 ? name2 : name1}
              </p>
            </div>
            <p className="text-sm text-white/50">
              {result.loser === 0 ? name1 : name2} nestihol/a!
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={restart}
                className="flex-1 rounded-2xl bg-white/20 py-3.5 font-bold text-white active:scale-95 transition"
              >
                🔄 Znova
              </button>
              <button
                onClick={onBack}
                className="flex-1 rounded-2xl border border-white/20 py-3.5 font-bold text-white/70 active:scale-95 transition"
              >
                Domov
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EXIT BUTTON (small, top-right corner) ── */}
      {!result && (
        <button
          className="absolute right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white/50 active:scale-95"
          style={{ top: "calc(50% - 18px)" }}
          onPointerDown={(e) => { e.stopPropagation(); onBack(); }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SlovnyPingPong({ onBack }: { onBack: () => void }) {
  const [gameKey, setGameKey] = useState(0);
  const [gameParams, setGameParams] = useState<{
    name1: string;
    name2: string;
    secsToEdge: number;
  } | null>(null);

  if (!gameParams) {
    return (
      <SetupScreen
        onBack={onBack}
        onStart={(name1, name2, secs) => {
          setGameParams({ name1, name2, secsToEdge: secs });
          setGameKey((k) => k + 1);
        }}
      />
    );
  }

  return (
    <GameScreen
      key={gameKey}
      name1={gameParams.name1}
      name2={gameParams.name2}
      secsToEdge={gameParams.secsToEdge}
      onBack={onBack}
    />
  );
}
