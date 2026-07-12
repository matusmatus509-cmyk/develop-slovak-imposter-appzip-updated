import { useRef, useState, useEffect } from "react";
import type { GameSettings, RoundAssignment } from "../../types";

const PLAYER_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#a855f7", "#ec4899", "#3b82f6",
  "#14b8a6", "#8b5cf6", "#f43f5e", "#84cc16",
];

export default function DrawingCanvas({
  settings,
  assignment: _assignment,
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
  // Snapshot of canvas before current player started drawing (for undo)
  const committedRef = useRef<ImageData | null>(null);

  const n = settings.playerNames.length;
  const strokesPerPlayer = settings.strokesPerPlayer ?? 3;
  const totalTurns = n * strokesPerPlayer;

  const [turn, setTurn] = useState(0);
  // show cover overlay between turns so next player can take the phone
  const [showCover, setShowCover] = useState(true);

  const currentPlayer = turn % n;
  const isLastTurn = turn >= totalTurns - 1;

  const color = PLAYER_COLORS[currentPlayer % PLAYER_COLORS.length];
  const name = settings.playerNames[currentPlayer];
  const nextPlayer = (turn + 1) % n;
  const nextName = settings.playerNames[nextPlayer];

  // ── Init canvas ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!canvas || !wrap) return;
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#f8f7f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Save blank state as initial committed snapshot
    committedRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }, []);

  // ── Pointer helpers ──────────────────────────────────────────────
  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (showCover) return;
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
    if (!isDrawingRef.current || !lastPosRef.current || showCover) return;
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
    isDrawingRef.current = false;
    lastPosRef.current = null;
  }

  // ── Actions ──────────────────────────────────────────────────────
  function handleTrash() {
    const canvas = canvasRef.current;
    if (!canvas || !committedRef.current) return;
    const ctx = canvas.getContext("2d")!;
    ctx.putImageData(committedRef.current, 0, 0);
  }

  function handleNextPlayer() {
    // Commit current canvas state before advancing
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d")!;
      committedRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    if (isLastTurn) {
      onVote();
    } else {
      setTurn((t) => t + 1);
      setShowCover(true);
    }
  }

  function handleStartDrawing() {
    // Save snapshot at start of this player's turn (before they draw anything)
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d")!;
      committedRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    setShowCover(false);
  }

  // ── Cover overlay (pass phone) ───────────────────────────────────
  if (showCover) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ background: "linear-gradient(160deg, #0d1f0d 0%, #162716 100%)" }}
      >
        {/* X button */}
        <button
          onClick={onExit}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 text-lg"
        >
          ✕
        </button>

        {/* Avatar */}
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-black"
          style={{
            backgroundColor: color + "22",
            color,
            boxShadow: `0 0 0 4px ${color}, 0 0 24px 8px ${color}55`,
          }}
        >
          {name.slice(0, 2).toUpperCase()}
        </div>

        {/* Name */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">
            Odovzdaj telefón hráčovi
          </p>
          <h1
            className="mt-2 text-3xl font-black uppercase tracking-wide"
            style={{ color }}
          >
            {name}
          </h1>
        </div>

        {/* Round info */}
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs text-white/50">
          Kolo {Math.floor(turn / n) + 1} z {strokesPerPlayer}
        </div>

        {/* Start button */}
        <button
          onClick={handleStartDrawing}
          className="w-full max-w-xs rounded-2xl py-4 text-base font-black uppercase tracking-wide text-white"
          style={{ background: `linear-gradient(135deg, ${color}bb, ${color})` }}
        >
          Začať kresliť ✏️
        </button>
      </div>
    );
  }

  // ── Drawing UI ───────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0d1f0d 0%, #162716 100%)" }}
    >
      {/* ── Top: X + player info ── */}
      <div className="relative z-10 flex shrink-0 flex-col items-center pt-5 pb-3 px-5">
        {/* X */}
        <button
          onClick={onExit}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 text-lg"
        >
          ✕
        </button>

        {/* Avatar */}
        <div
          className="mb-3 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-black"
          style={{
            backgroundColor: color + "22",
            color,
            boxShadow: `0 0 0 3px ${color}, 0 0 20px 6px ${color}55`,
          }}
        >
          {name.slice(0, 2).toUpperCase()}
        </div>

        {/* Player name */}
        <p
          className="text-sm font-black uppercase tracking-widest"
          style={{ color }}
        >
          NA RADE JE {name.toUpperCase()}
        </p>
      </div>

      {/* ── Canvas ── */}
      <div
        ref={canvasWrapRef}
        className="relative mx-4 flex-1 overflow-hidden rounded-3xl shadow-2xl"
        style={{ background: "#f8f7f2" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{
            display: "block",
            touchAction: "none",
            userSelect: "none",
            cursor: "crosshair",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />

        {/* Color legend top-right of canvas */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          {settings.playerNames.map((pName, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-full shadow-sm"
                style={{ backgroundColor: PLAYER_COLORS[i % PLAYER_COLORS.length] }}
              />
              <span className="text-[9px] font-bold text-black/40">{pName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom buttons ── */}
      <div className="relative z-10 shrink-0 px-4 pb-6 pt-3 space-y-3">
        {/* Row: Ďalší hráč + Trash */}
        <div className="flex gap-3">
          <button
            onClick={handleNextPlayer}
            className="flex-1 rounded-2xl py-4 text-sm font-black text-white"
            style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            {isLastTurn ? "Hotovo ✓" : `Ďalší hráč → ${nextName}`}
          </button>

          {/* Trash */}
          <button
            onClick={handleTrash}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl"
            style={{ background: "#7c1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
            title="Vymazať môj ťah"
          >
            🗑
          </button>
        </div>

        {/* Reveal impostor */}
        <button
          onClick={onVote}
          className="w-full rounded-2xl py-4 text-sm font-black text-white/90"
          style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          Odhalit Podvodníka 🔍
        </button>
      </div>
    </div>
  );
}
