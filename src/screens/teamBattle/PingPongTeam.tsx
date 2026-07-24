import { useState, useEffect, useRef } from "react";
import { TEAM_COLORS } from "../../data/teamBattle";
import { PING_PONG_PROMPTS } from "../../data/pingPongPrompts";
import { takePersistentItem } from "../../utils/persistentDeck";

// Uses the same prompt database and persistent deck as standalone Slovný Ping Pong.
// A theme shown in either mode is not selected again until every theme has been used.

// "Stredne" (medium) speed from the standalone minigame — seconds for the
// ball to travel from centre to edge.
const SECS_TO_EDGE = 4;

export default function PingPongTeam({
  teamNames,
  onDone,
}: {
  teamNames: [string, string];
  onDone: (scores: [number, number]) => void;
}) {
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [winner, setWinner] = useState<0 | 1 | null>(null);

  const [a, b] = TEAM_COLORS;
  const colorTop = a;
  const colorTopDark = "#1e3a6e";
  const colorBot = b;
  const colorBotDark = "#7c1a1a";

  // ballY: 0 = top edge, 1 = bottom edge. Start in middle.
  const [ballY, setBallY] = useState(0.5);
  const [prompt] = useState(() => takePersistentItem("ping-pong-prompts", PING_PONG_PROMPTS));
  // active = 0 → ball moves toward TOP (team 0 must answer)
  // active = 1 → ball moves toward BOTTOM (team 1 must answer)
  const [active, setActive] = useState<0 | 1>(() => (Math.random() < 0.5 ? 0 : 1));

  const ballYRef = useRef(0.5);
  const activeRef = useRef<0 | 1>(active);
  const gameOverRef = useRef(false);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const startTsRef = useRef<number>(0);

  const baseSpeed = 0.5 / SECS_TO_EDGE;

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (phase !== "playing") return;

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

      const dir = activeRef.current === 0 ? -1 : 1;
      let newY = ballYRef.current + dir * speed * dt;

      if (newY <= 0) {
        newY = 0;
        gameOverRef.current = true;
        ballYRef.current = newY;
        setBallY(newY);
        setWinner(1); // top team (0) lost
        setPhase("done");
        return;
      }
      if (newY >= 1) {
        newY = 1;
        gameOverRef.current = true;
        ballYRef.current = newY;
        setBallY(newY);
        setWinner(0); // bottom team (1) lost
        setPhase("done");
        return;
      }

      ballYRef.current = newY;
      setBallY(newY);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, baseSpeed]);

  function handleTap(side: 0 | 1) {
    if (gameOverRef.current) return;
    if (side !== activeRef.current) return;
    const other: 0 | 1 = side === 0 ? 1 : 0;
    // Match the standalone game: a valid word sends the ball back from centre.
    ballYRef.current = 0.5;
    setBallY(0.5);
    navigator.vibrate?.([18, 25, 18]);
    activeRef.current = other;
    setActive(other);
  }

  function buildResult(): [number, number] {
    if (winner === null) return [0, 0];
    const scores: [number, number] = [0, 0];
    scores[winner] = 1;
    return scores;
  }

  if (phase === "ready") {
    return (
      <div
        className="party-backdrop fixed inset-0 flex flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center"
      >
        <div className="text-6xl" style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>🏓</div>
        <div style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
            Slovný ping pong
          </p>
          <h2 className="text-2xl font-black text-white">1 v 1</h2>
        </div>
        <div
          className="party-glass rounded-[1.75rem] p-5 text-sm leading-relaxed text-white/60 max-w-xs"
          style={{ animation: "scaleIn 0.4s ease-out 0.2s both" }}
        >
          Vyberte <strong className="text-white">jedného hráča z každého tímu</strong> — pôjdu proti sebe 1v1.
          Telefón položte na stôl medzi vás. Hovorte slová na dané písmeno a{" "}
          <strong className="text-white">klepnite na svoju polovicu</strong> po každom slove.
          Čiara sa pohybuje smerom k vám — kto nestihne, prehráva kolo pre svoj tím!
        </div>
        <button
          onClick={() => setPhase("playing")}
          className="party-shine w-full max-w-xs overflow-hidden rounded-2xl py-5 text-lg font-black text-white shadow-xl transition active:scale-95 hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", animation: "slideUp 0.5s ease-out 0.35s both" }}
        >
          Štart 🏓
        </button>
      </div>
    );
  }

  if (phase === "done") {
    const winColor = winner === 0 ? a : b;
    return (
      <div
        className="party-backdrop fixed inset-0 flex flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center"
      >
        <div className="text-6xl" style={{ animation: "tada 0.8s ease-in-out" }}>🏆</div>
        <div style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Víťaz kola</p>
          <h2 className="text-4xl font-black" style={{ color: winColor }}>
            {winner !== null ? teamNames[winner] : "—"}
          </h2>
        </div>
        <button
          onClick={() => onDone(buildResult())}
          className="party-shine w-full max-w-xs overflow-hidden rounded-2xl py-5 text-base font-black text-white shadow-xl transition active:scale-95"
          style={{ background: winColor, animation: "slideUp 0.5s ease-out 0.3s both" }}
        >
          🏁 Pokračovať
        </button>
      </div>
    );
  }

  const topPct = ballY * 100;
  const botPct = (1 - ballY) * 100;
  const isTopActive = active === 0;

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ touchAction: "none", userSelect: "none" }}
    >
      {/* ── TOP HALF — Team A ── */}
      <div
        className="absolute left-0 right-0 top-0 flex items-center justify-center overflow-hidden"
        style={{
          height: `${topPct}%`,
          backgroundColor: colorTop,
          cursor: isTopActive ? "pointer" : "default",
        }}
        onPointerDown={() => handleTap(0)}
      >
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "clamp(24px, 8%, 60px)", backgroundColor: colorTopDark }}
        />

        <div
          className="relative z-10 flex flex-col items-center justify-center gap-2 text-center"
          style={{ transform: "rotate(180deg)", pointerEvents: "none" }}
        >
          <p
            className="font-black text-white/90 tracking-tight leading-none"
            style={{ fontSize: "clamp(1.4rem, 5vw, 2.2rem)" }}
          >
            {teamNames[0]}
          </p>
          <div className="rounded-2xl px-4 py-2" style={{ backgroundColor: "rgba(0,0,0,0.20)" }}>
            <p className="font-black text-white leading-none" style={{ fontSize: "clamp(2rem, 9vw, 3.5rem)" }}>
              Téma: {" "}
              <span className="underline decoration-4 underline-offset-4">{prompt}</span>
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
        style={{ top: `${topPct}%`, transform: "translateY(-50%)", height: "4px", pointerEvents: "none" }}
      >
        <div
          className="w-full"
          style={{
            height: "4px",
            backgroundImage:
              "repeating-linear-gradient(90deg, white 0px, white 20px, transparent 20px, transparent 32px)",
          }}
        />
      </div>

      {/* ── BOTTOM HALF — Team B ── */}
      <div
        className="absolute left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden"
        style={{
          height: `${botPct}%`,
          backgroundColor: colorBot,
          cursor: !isTopActive ? "pointer" : "default",
        }}
        onPointerDown={() => handleTap(1)}
      >
        <div
          className="absolute top-0 left-0 right-0"
          style={{ height: "clamp(24px, 8%, 60px)", backgroundColor: colorBotDark }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-center" style={{ pointerEvents: "none" }}>
          <p
            className="font-black text-white/90 tracking-tight leading-none"
            style={{ fontSize: "clamp(1.4rem, 5vw, 2.2rem)" }}
          >
            {teamNames[1]}
          </p>
          <div className="rounded-2xl px-4 py-2" style={{ backgroundColor: "rgba(0,0,0,0.20)" }}>
            <p className="font-black text-white leading-none" style={{ fontSize: "clamp(2rem, 9vw, 3.5rem)" }}>
              Téma: {" "}
              <span className="underline decoration-4 underline-offset-4">{prompt}</span>
            </p>
          </div>
          {!isTopActive && (
            <p className="text-white/70 font-bold text-sm animate-pulse">
              ↑ KLEPNI PO KAŽDOM SLOVE ↑
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
