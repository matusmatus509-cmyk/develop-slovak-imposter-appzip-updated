import { useState, useEffect, useRef } from "react";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { PING_PONG_PROMPTS } from "../../data/pingPongPrompts";

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
  const [name1, setName1] = useState("Hráč 1");
  const [name2, setName2] = useState("Hráč 2");
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
          placeholder="Hráč 1"
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
          placeholder="Hráč 2"
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

      <Button fullWidth onClick={() => onStart(name1.trim() || "Hráč 1", name2.trim() || "Hráč 2", speed)}>
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

  // Animation loop
  useEffect(() => {
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
  }, [baseSpeed]); // only restarts when speed setting changes

  function handleTap(side: 0 | 1) {
    if (gameOverRef.current) return;
    // Only active player (under pressure) can tap to bounce
    if (side !== activeRef.current) return;
    const other: 0 | 1 = side === 0 ? 1 : 0;
    activeRef.current = other;
    setActive(other);
  }

  function restart() {
    const newPrompt = pickPrompt(prompt);
    const newActive: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
    setPrompt(newPrompt);
    setActive(newActive);
    setResult(null);
    // Reset refs and restart animation by remounting effect
    gameOverRef.current = false;
    ballYRef.current = 0.5;
    activeRef.current = newActive;
    setBallY(0.5);
    // trigger animation restart
    lastTsRef.current = 0;
    startTsRef.current = 0;
    rafRef.current = requestAnimationFrame(function tick(ts) {
      if (gameOverRef.current) return;
      if (!startTsRef.current) startTsRef.current = ts;
      const dt = lastTsRef.current ? (ts - lastTsRef.current) / 1000 : 0;
      lastTsRef.current = ts;
      const elapsed = (ts - startTsRef.current) / 1000;
      const speed = baseSpeed * (1 + elapsed * 0.015);
      const dir = activeRef.current === 0 ? -1 : 1;
      let newY = ballYRef.current + dir * speed * dt;
      if (newY <= 0) {
        newY = 0; gameOverRef.current = true; ballYRef.current = newY; setBallY(newY); setResult({ loser: 0 }); return;
      }
      if (newY >= 1) {
        newY = 1; gameOverRef.current = true; ballYRef.current = newY; setBallY(newY); setResult({ loser: 1 }); return;
      }
      ballYRef.current = newY; setBallY(newY);
      rafRef.current = requestAnimationFrame(tick);
    });
  }

  const topPct = ballY * 100; // top half height %
  const botPct = (1 - ballY) * 100; // bottom half height %
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
          height: `${topPct}%`,
          backgroundColor: COLOR_TOP,
          cursor: isTopActive ? "pointer" : "default",
        }}
        onPointerDown={() => handleTap(0)}
      >
        {/* Darker danger zone near the line (bottom of top half) */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "clamp(24px, 8%, 60px)",
            backgroundColor: COLOR_TOP_DARK,
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
          <div
            className="rounded-2xl px-4 py-2"
            style={{ backgroundColor: "rgba(0,0,0,0.20)" }}
          >
            <p
              className="max-w-[85vw] font-black leading-tight text-white"
              style={{ fontSize: "clamp(1.2rem, 5.5vw, 2.6rem)" }}
            >
              {prompt}
            </p>
          </div>
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
          top: `${topPct}%`,
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
          height: `${botPct}%`,
          backgroundColor: COLOR_BOT,
          cursor: !isTopActive ? "pointer" : "default",
        }}
        onPointerDown={() => handleTap(1)}
      >
        {/* Darker danger zone near the line (top of bottom half) */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: "clamp(24px, 8%, 60px)",
            backgroundColor: COLOR_BOT_DARK,
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
          <div
            className="rounded-2xl px-4 py-2"
            style={{ backgroundColor: "rgba(0,0,0,0.20)" }}
          >
            <p
              className="max-w-[85vw] font-black leading-tight text-white"
              style={{ fontSize: "clamp(1.2rem, 5.5vw, 2.6rem)" }}
            >
              {prompt}
            </p>
          </div>
          {!isTopActive && (
            <p className="text-white/70 font-bold text-sm animate-pulse">
              ↑ KLEPNI PO KAŽDOM SLOVE ↑
            </p>
          )}
        </div>
      </div>

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
          style={{ top: `calc(${topPct}% - 18px)` }}
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
