import { useEffect, useRef, useState } from "react";
import type { GameSettings, RoundAssignment } from "../../types";

const PLAYER_COLORS = [
  "#fb7185", "#fb923c", "#facc15", "#4ade80",
  "#22d3ee", "#c084fc", "#f472b6", "#60a5fa",
  "#2dd4bf", "#a78bfa", "#f43f5e", "#a3e635",
];

type Point = { x: number; y: number };

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
  const initializedRef = useRef(false);
  const lastPosRef = useRef<Point | null>(null);
  const committedRef = useRef<ImageData | null>(null);

  const playerCount = settings.playerNames.length;
  const strokesPerPlayer = settings.strokesPerPlayer ?? 3;
  const totalTurns = playerCount * strokesPerPlayer;

  const [turn, setTurn] = useState(0);
  const [strokeDone, setStrokeDone] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  const currentPlayer = turn % playerCount;
  const isLastTurn = turn >= totalTurns - 1;
  const color = PLAYER_COLORS[currentPlayer % PLAYER_COLORS.length];
  const name = settings.playerNames[currentPlayer];
  const nextPlayer = (turn + 1) % playerCount;
  const nextName = settings.playerNames[nextPlayer];
  const completedTurns = turn + (strokeDone ? 1 : 0);
  const progress = Math.min(100, (completedTurns / totalTurns) * 100);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!canvas || !wrap) return;

    function resizeCanvas() {
      if (!canvas || !wrap) return;
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2.5);
      const nextWidth = Math.round(rect.width * ratio);
      const nextHeight = Math.round(rect.height * ratio);
      if (canvas.width === nextWidth && canvas.height === nextHeight) return;

      const snapshot = document.createElement("canvas");
      snapshot.width = canvas.width;
      snapshot.height = canvas.height;
      if (initializedRef.current) {
        snapshot.getContext("2d")?.drawImage(canvas, 0, 0);
      }

      canvas.width = nextWidth;
      canvas.height = nextHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.fillStyle = "#fffdf8";
      ctx.fillRect(0, 0, rect.width, rect.height);

      if (initializedRef.current && snapshot.width > 0 && snapshot.height > 0) {
        ctx.drawImage(snapshot, 0, 0, snapshot.width, snapshot.height, 0, 0, rect.width, rect.height);
      }

      initializedRef.current = true;
      committedRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  function getPos(clientX: number, clientY: number): Point {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function prepareBrush(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (strokeDone) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    committedRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    isDrawingRef.current = true;
    const pos = getPos(event.clientX, event.clientY);
    lastPosRef.current = pos;
    prepareBrush(ctx);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current || !lastPosRef.current || strokeDone) return;
    event.preventDefault();
    const ctx = canvasRef.current!.getContext("2d")!;
    const nativeEvent = event.nativeEvent;
    const coalescedSamples = typeof nativeEvent.getCoalescedEvents === "function"
      ? nativeEvent.getCoalescedEvents()
      : [];
    const samples = coalescedSamples.length > 0 ? coalescedSamples : [nativeEvent];
    const points = samples.map((sample) => getPos(sample.clientX, sample.clientY));
    if (points.length === 0) return;

    prepareBrush(ctx);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    let previous = lastPosRef.current;
    for (const point of points) {
      const midpoint = { x: (previous.x + point.x) / 2, y: (previous.y + point.y) / 2 };
      ctx.quadraticCurveTo(previous.x, previous.y, midpoint.x, midpoint.y);
      previous = point;
    }
    ctx.lineTo(previous.x, previous.y);
    ctx.stroke();
    lastPosRef.current = previous;
  }

  function finishStroke(event?: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    if (event?.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    isDrawingRef.current = false;
    lastPosRef.current = null;
    setStrokeDone(true);
    navigator.vibrate?.(14);
  }

  function undoStroke() {
    const canvas = canvasRef.current;
    if (!canvas || !committedRef.current) return;
    canvas.getContext("2d")?.putImageData(committedRef.current, 0, 0);
    setStrokeDone(false);
    navigator.vibrate?.(10);
  }

  function nextTurn() {
    if (!strokeDone) return;
    // Clear haptic confirmation that this turn is complete and the phone can move on.
    navigator.vibrate?.([20, 35, 32]);
    if (isLastTurn) {
      onVote();
      return;
    }
    setTurn((value) => value + 1);
    setStrokeDone(false);
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#080b13] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 top-8 h-72 w-72 rounded-full bg-violet-600/20 blur-[90px]" />
        <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-cyan-500/15 blur-[90px]" />
      </div>

      <header className="relative z-10 shrink-0 px-4 pb-3 pt-[max(.9rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <button onClick={onExit} aria-label="Ukončiť hru" className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/65 backdrop-blur-xl transition active:scale-90">✕</button>
          <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.26em] text-violet-300/70">Imposter kreslenie</p>
            <p className="mt-0.5 text-xs font-black text-white/75">Ťah {turn + 1} z {totalTurns}</p>
          </div>
          <span className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-black text-white/50">1 ťah</span>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full rounded-full transition-[width] duration-500 ease-out" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${color}, #22d3ee)`, boxShadow: `0 0 16px ${color}` }} />
        </div>

        <div key={turn} className="mt-3 flex animate-pop-in items-center gap-3 rounded-[1.4rem] border bg-white/[0.055] p-3 backdrop-blur-xl" style={{ borderColor: `${color}55`, boxShadow: `0 12px 38px ${color}12` }}>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-[#080b13]" style={{ background: color, boxShadow: `0 0 24px ${color}55` }}>
            {name.slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block text-[9px] font-black uppercase tracking-[0.2em]" style={{ color }}>Teraz kreslí</span>
            <span className="mt-0.5 block truncate text-lg font-black text-white">{name}</span>
          </span>
          <span className={`rounded-xl px-3 py-2 text-[9px] font-black uppercase tracking-wider ${strokeDone ? "bg-emerald-400/15 text-emerald-300" : "bg-white/[0.06] text-white/40"}`}>
            {strokeDone ? "Hotovo ✓" : "Kresli"}
          </span>
        </div>
      </header>

      <div ref={canvasWrapRef} className="relative z-10 mx-4 min-h-0 flex-1 overflow-hidden rounded-[2rem] border-4 border-white/90 bg-[#fffdf8] shadow-[0_24px_70px_rgba(0,0,0,.5)]">
        <canvas
          ref={canvasRef}
          aria-label="Kresliace plátno"
          className="absolute inset-0 h-full w-full"
          style={{ display: "block", touchAction: "none", userSelect: "none", cursor: strokeDone ? "default" : "crosshair" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishStroke}
          onPointerCancel={finishStroke}
        />

        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white/80 px-3 py-2 shadow-sm backdrop-blur">
          <span className="h-3 w-3 rounded-full" style={{ background: color, boxShadow: `0 0 0 3px ${color}25` }} />
          <span className="text-[9px] font-black uppercase tracking-wider text-black/40">Farba hráča</span>
        </div>

        {strokeDone && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 animate-pop-in rounded-2xl border border-emerald-300/25 bg-[#07130f]/90 px-4 py-3 text-center text-[11px] font-bold text-emerald-200 shadow-xl backdrop-blur-xl">
            Ťah je uložený • odovzdajte mobil ďalšiemu hráčovi
          </div>
        )}
      </div>

      <div className="relative z-10 shrink-0 space-y-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <div className="grid grid-cols-[1fr_3.2fr] gap-2.5">
          <button onClick={undoStroke} disabled={!strokeDone} aria-label="Zrušiť môj ťah" className="flex min-h-[3.75rem] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-xl text-white/65 transition active:scale-95 disabled:opacity-25">↶</button>
          <button onClick={nextTurn} disabled={!strokeDone} className="party-shine min-h-[3.75rem] overflow-hidden rounded-2xl px-4 text-sm font-black text-[#080b13] shadow-xl transition active:scale-[.98] disabled:opacity-30" style={{ background: `linear-gradient(135deg, ${color}, #67e8f9)` }}>
            {isLastTurn ? "Dokončiť a hlasovať ✓" : <>Odovzdať → <span className="opacity-70">{nextName}</span></>}
          </button>
        </div>
        {!isLastTurn && (
          <button onClick={() => setShowFinishConfirm(true)} className="w-full py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/30 transition active:text-white/60">Ukončiť kreslenie skôr</button>
        )}
      </div>

      {showFinishConfirm && (
        <div className="absolute inset-0 z-50 flex items-end bg-black/70 p-4 backdrop-blur-sm" onClick={() => setShowFinishConfirm(false)}>
          <div className="animate-slide-up w-full rounded-[2rem] border border-white/12 bg-[#111522] p-5 text-center shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 text-3xl">🎨</div>
            <h2 className="mt-4 text-xl font-black">Už chcete hlasovať?</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/45">Nevyužité ťahy sa preskočia a kresbu už nebude možné doplniť.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={() => setShowFinishConfirm(false)} className="rounded-2xl border border-white/10 bg-white/[0.06] py-4 text-sm font-black text-white/65">Pokračovať</button>
              <button onClick={onVote} className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-4 text-sm font-black text-white shadow-lg">Hlasovať</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
