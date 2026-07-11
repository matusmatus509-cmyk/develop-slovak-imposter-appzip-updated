import { useRef, useState, useEffect, useCallback } from "react";
import type { GameSettings, RoundAssignment } from "../../types";
import { Background, Button } from "../../components/ui";

const PLAYER_COLORS = [
  "#f97316", "#a855f7", "#06b6d4", "#22c55e",
  "#f43f5e", "#eab308", "#3b82f6", "#ec4899",
  "#14b8a6", "#8b5cf6", "#ef4444", "#84cc16",
];

type Phase = "cover" | "playing" | "done";

export default function DrawingCanvas({
  settings,
  assignment,
  onExit,
  onVote,
}: {
  settings: GameSettings;
  assignment: RoundAssignment;
  onExit: () => void;
  onVote: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const n = settings.playerNames.length;
  const strokesPerPlayer = settings.strokesPerPlayer ?? 3;
  const totalTurns = n * strokesPerPlayer;

  // turn goes 0 → totalTurns-1; after last stroke → done
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<Phase>("cover");

  const currentPlayer = turn % n;
  const currentRound = Math.floor(turn / n) + 1; // 1-based round
  const nextTurn = turn + 1;
  const nextPlayer = nextTurn % n;
  const isLastTurn = turn === totalTurns - 1;

  const color = PLAYER_COLORS[currentPlayer % PLAYER_COLORS.length];
  const name = settings.playerNames[currentPlayer];
  const nextName = settings.playerNames[nextPlayer];

  // Init canvas to full container size
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!canvas || !wrap) return;
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#f0effa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (phase !== "playing") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    const pos = getPos(e);
    lastPosRef.current = pos;
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current || !lastPosRef.current || phase !== "playing") return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPosRef.current = pos;
  }

  function handlePointerUp() {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPosRef.current = null;

    if (isLastTurn) {
      setPhase("done");
    } else {
      setTurn((t) => t + 1);
      setPhase("cover");
    }
  }

  // Stroke progress dots for current player
  const playerStrokesDone = Math.floor(turn / n); // complete rounds done
  const strokesRemaining = strokesPerPlayer - playerStrokesDone; // incl. current

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#0b0a1a]">
      <Background />

      {/* ── HUD ── */}
      <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-black/30 px-4 py-3 backdrop-blur-sm">
        {/* Back */}
        <button
          onClick={onExit}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm"
        >
          ←
        </button>

        {/* Current player */}
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black"
            style={{ backgroundColor: color + "33", color }}
          >
            {name.slice(0, 2).toUpperCase()}
          </span>
          <span className="truncate text-sm font-black" style={{ color }}>
            {name}
          </span>
        </div>

        {/* Round / stroke counter */}
        <div className="flex shrink-0 flex-col items-end gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
            Kolo {currentRound}/{strokesPerPlayer}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: n }).map((_, i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full transition-all"
                style={{
                  backgroundColor:
                    i === currentPlayer && phase === "playing"
                      ? color
                      : i < currentPlayer || (phase !== "cover" && i <= currentPlayer)
                      ? PLAYER_COLORS[i % PLAYER_COLORS.length] + "88"
                      : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Color legend button */}
        <div className="ml-1 flex shrink-0 flex-wrap gap-1">
          {settings.playerNames.map((_, i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: PLAYER_COLORS[i % PLAYER_COLORS.length] }}
              title={settings.playerNames[i]}
            />
          ))}
        </div>
      </div>

      {/* ── Canvas area ── */}
      <div ref={canvasWrapRef} className="relative flex-1 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{
            display: "block",
            touchAction: "none",
            userSelect: "none",
            cursor: phase === "playing" ? "crosshair" : "default",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />

        {/* ── Pass-phone cover overlay ── */}
        {phase === "cover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[#0b0a1a]/95 px-6 text-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-black"
              style={{ backgroundColor: color + "33", color }}
            >
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                Na rade je
              </p>
              <h1 className="mt-1 text-3xl font-black" style={{ color }}>
                {name}
              </h1>
              <p className="mt-2 text-sm text-white/50">
                Odovzdaj telefón hráčovi{" "}
                <span className="font-bold text-white">{name}</span>.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white/50">
              ✏️ Kolo {currentRound} z {strokesPerPlayer} · 1 ťah
            </div>
            <Button
              onClick={() => setPhase("playing")}
              className="w-full max-w-xs"
              style={{
                background: `linear-gradient(135deg, ${color}bb, ${color})`,
              }}
            >
              Začať kresliť ✏️
            </Button>
          </div>
        )}

        {/* ── Done overlay ── */}
        {phase === "done" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[#0b0a1a]/80 px-6 text-center backdrop-blur-sm">
            <div className="text-6xl">🎨</div>
            <div>
              <h1 className="text-2xl font-black">Všetci nakreslili!</h1>
              <p className="mt-2 text-sm text-white/50">
                Prediskutujte obrázok a hlasujte kto je podvodník.
              </p>
            </div>
            <Button onClick={onVote} className="w-full max-w-xs">
              Hlasovať 🗳️
            </Button>
          </div>
        )}
      </div>

      {/* ── Bottom bar (only while playing) ── */}
      {phase === "playing" && (
        <div className="relative z-10 shrink-0 border-t border-white/10 bg-black/30 px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>
              Kreslíš 1 ťah — potom odovzdaj telefón
              {!isLastTurn && (
                <>
                  {" "}
                  hráčovi{" "}
                  <span
                    className="font-bold"
                    style={{
                      color: PLAYER_COLORS[nextPlayer % PLAYER_COLORS.length],
                    }}
                  >
                    {nextName}
                  </span>
                </>
              )}
            </span>
            <span className="font-bold text-white/70">
              {turn + 1}/{totalTurns}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
