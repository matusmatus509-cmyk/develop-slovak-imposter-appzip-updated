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
  const committedRef = useRef<ImageData | null>(null);

  const n = settings.playerNames.length;
  const strokesPerPlayer = settings.strokesPerPlayer ?? 3;
  const totalTurns = n * strokesPerPlayer;

  const [turn, setTurn] = useState(0);
  const [strokeDone, setStrokeDone] = useState(false);

  const currentPlayer = turn % n;
  const isLastTurn = turn >= totalTurns - 1;

  const color = PLAYER_COLORS[currentPlayer % PLAYER_COLORS.length];
  const name = settings.playerNames[currentPlayer];
  const nextPlayer = (turn + 1) % n;
  const nextName = settings.playerNames[nextPlayer];

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!canvas || !wrap) return;
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#f8f7f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    committedRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
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
    if (strokeDone) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    committedRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    isDrawingRef.current = true;
    const pos = getPos(e);
    lastPosRef.current = pos;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current || !lastPosRef.current || strokeDone) return;
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
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPosRef.current = null;
      setStrokeDone(true);
    }
  }

  function handleTrash() {
    const canvas = canvasRef.current;
    if (!canvas || !committedRef.current) return;
    const ctx = canvas.getContext("2d")!;
    ctx.putImageData(committedRef.current, 0, 0);
    setStrokeDone(false);
  }

  function handleNextPlayer() {
    if (isLastTurn) {
      onVote();
    } else {
      setTurn((t) => t + 1);
      setStrokeDone(false);
    }
  }

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0d1f0d 0%, #162716 100%)" }}
    >
      {/* ── Top: exit + player info ── */}
      <div className="relative z-10 flex shrink-0 flex-col items-center pt-5 pb-3 px-5">
        <button
          onClick={onExit}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 text-lg transition hover:bg-white/20 active:scale-90"
        >
          ✕
        </button>

        <div
          className="mb-3 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-black transition-all"
          key={currentPlayer}
          style={{
            backgroundColor: color + "22",
            color,
            boxShadow: `0 0 0 3px ${color}, 0 0 20px 6px ${color}55`,
            animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          {name.slice(0, 2).toUpperCase()}
        </div>

        <p
          className="text-sm font-black uppercase tracking-widest"
          style={{ color }}
        >
          NA RADE JE {name.toUpperCase()}
        </p>

        <p className="mt-1 text-xs text-white/40">
          {strokeDone ? "Ťah hotový — odovzdaj telefón" : "Nakresli jeden ťah"}
        </p>
      </div>

      {/* ── Canvas ── */}
      <div
        ref={canvasWrapRef}
        className="relative mx-4 flex-1 overflow-hidden rounded-3xl shadow-2xl shadow-black/40 transition-shadow"
        style={{ background: "#f8f7f2", animation: "scaleIn 0.5s ease-out" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{
            display: "block",
            touchAction: "none",
            userSelect: "none",
            cursor: strokeDone ? "default" : "crosshair",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />

        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          {settings.playerNames.map((pName, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-full shadow-sm"
                style={{ backgroundColor: PLAYER_COLORS[i % PLAYER_COLORS.length] }}
              />
              <span className="text-[9px] font-bold text-black/35">{pName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom buttons ── */}
      <div className="relative z-10 shrink-0 px-4 pb-6 pt-3 space-y-3">
        <div className="flex gap-3">
          <button
            onClick={handleNextPlayer}
            disabled={!strokeDone}
            className="flex-1 rounded-2xl py-4 text-sm font-black text-white disabled:opacity-30 transition-all active:scale-95 backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            {isLastTurn ? "Hotovo ✓" : `Ďalší hráč → ${nextName}`}
          </button>

          <button
            onClick={handleTrash}
            disabled={!strokeDone}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl disabled:opacity-30 transition-all active:scale-90 hover:brightness-110"
            style={{ background: "#7c1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
            title="Zrušiť môj ťah"
          >
            🗑
          </button>
        </div>

        <button
          onClick={onVote}
          className="w-full rounded-2xl py-4 text-sm font-black text-white/90 active:scale-95 transition-all backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          Odhaliť Podvodníka 🔍
        </button>
      </div>
    </div>
  );
}