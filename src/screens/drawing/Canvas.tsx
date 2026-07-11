import { useRef, useState, useEffect } from "react";
import type { GameSettings, RoundAssignment } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const n = settings.playerNames.length;
  const strokesPerPlayer = settings.strokesPerPlayer ?? 3;

  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [strokesLeft, setStrokesLeft] = useState(strokesPerPlayer);
  // phase: cover = pass-phone screen, playing = drawing, done = all done
  const [phase, setPhase] = useState<Phase>("cover");

  // init canvas background once
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    canvas.width = container.clientWidth;
    canvas.height = Math.min(container.clientWidth, 380);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#f8f7ff";
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
    ctx.fillStyle = PLAYER_COLORS[currentPlayer % PLAYER_COLORS.length];
    ctx.fill();
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current || !lastPosRef.current || phase !== "playing") return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = PLAYER_COLORS[currentPlayer % PLAYER_COLORS.length];
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPosRef.current = pos;
  }

  function handlePointerUp() {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPosRef.current = null;

    const newLeft = strokesLeft - 1;
    setStrokesLeft(newLeft);

    if (newLeft <= 0) {
      if (currentPlayer >= n - 1) {
        setPhase("done");
      } else {
        // move to next player — show cover
        setCurrentPlayer((p) => p + 1);
        setStrokesLeft(strokesPerPlayer);
        setPhase("cover");
      }
    }
  }

  const color = PLAYER_COLORS[currentPlayer % PLAYER_COLORS.length];
  const name = settings.playerNames[currentPlayer];
  const nextName =
    currentPlayer < n - 1 ? settings.playerNames[currentPlayer + 1] : null;

  // ── Cover / pass-phone screen ─────────────────────────────────────
  if (phase === "cover") {
    return (
      <Shell>
        <TopBar title="Kreslenie" onBack={onExit} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-3xl font-black"
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
            <p className="mt-3 text-sm text-white/50">
              Odovzdaj telefón hráčovi{" "}
              <span className="font-bold text-white">{name}</span> a stlač
              tlačidlo nižšie.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/60">
            🎨 Budeš kresliť{" "}
            <span className="font-bold text-white">{strokesLeft}</span>{" "}
            {strokesLeft === 1 ? "ťah" : strokesLeft < 5 ? "ťahy" : "ťahov"} na
            plátno.
          </div>
          <Button
            fullWidth
            onClick={() => setPhase("playing")}
            style={{ background: `linear-gradient(135deg, ${color}cc, ${color})` }}
          >
            Začať kresliť ✏️
          </Button>
        </div>
      </Shell>
    );
  }

  // ── All done screen ───────────────────────────────────────────────
  if (phase === "done") {
    return (
      <Shell>
        <TopBar title="Kreslenie" onBack={onExit} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="text-6xl">✅</div>
          <div>
            <h1 className="text-2xl font-black">Všetci nakreslili!</h1>
            <p className="mt-2 text-sm text-white/50">
              Čas diskutovať a hlasovaťa kto je podvodník.
            </p>
          </div>
          {/* show final canvas as preview */}
          <div
            ref={containerRef}
            className="w-full overflow-hidden rounded-2xl border border-white/10"
          >
            <canvas
              ref={canvasRef}
              className="w-full"
              style={{ display: "block" }}
            />
          </div>
          <Button fullWidth onClick={onVote}>
            Hlasovať 🗳️
          </Button>
        </div>
      </Shell>
    );
  }

  // ── Drawing screen ────────────────────────────────────────────────
  return (
    <Shell>
      <TopBar title="Kreslenie" onBack={onExit} />

      {/* Player info bar */}
      <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black"
            style={{ backgroundColor: color + "33", color }}
          >
            {name.slice(0, 2).toUpperCase()}
          </span>
          <span className="text-sm font-bold" style={{ color }}>
            {name}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: strokesPerPlayer }).map((_, i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full transition-all"
              style={{
                backgroundColor:
                  i < strokesLeft ? color : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
          <span className="ml-1 text-xs font-bold text-white/60">
            {strokesLeft} {strokesLeft === 1 ? "ťah" : "ťahy"}
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-2xl border border-white/10"
      >
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair"
          style={{ display: "block", touchAction: "none", userSelect: "none" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>

      {/* Next player hint */}
      {nextName && (
        <p className="mt-3 text-center text-xs text-white/40">
          Po tebe kreslí{" "}
          <span
            className="font-bold"
            style={{ color: PLAYER_COLORS[(currentPlayer + 1) % PLAYER_COLORS.length] }}
          >
            {nextName}
          </span>
        </p>
      )}

      {/* Color legend */}
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {settings.playerNames.map((pname, i) => (
          <span
            key={i}
            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{
              backgroundColor: PLAYER_COLORS[i % PLAYER_COLORS.length] + "22",
              color: PLAYER_COLORS[i % PLAYER_COLORS.length],
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: PLAYER_COLORS[i % PLAYER_COLORS.length] }}
            />
            {pname}
          </span>
        ))}
      </div>
    </Shell>
  );
}
