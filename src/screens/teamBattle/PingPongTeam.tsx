import { useState, useEffect, useRef } from "react";
import { TEAM_COLORS } from "../../data/teamBattle";

const WORD_TIME = 10; // seconds per word

export default function PingPongTeam({
  category,
  teamNames,
  onDone,
}: {
  category: string;
  teamNames: [string, string];
  onDone: (scores: [number, number]) => void;
}) {
  const [current, setCurrent] = useState<0 | 1>(0); // which team's turn
  const [wordCount, setWordCount] = useState<[number, number]>([0, 0]);
  const [timeLeft, setTimeLeft] = useState(WORD_TIME);
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [winner, setWinner] = useState<0 | 1 | null>(null);
  const [flash, setFlash] = useState<"ok" | "fail" | null>(null);

  const [a, b] = TEAM_COLORS;
  const color = current === 0 ? a : b;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  // Countdown per word
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      handleFail();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimer();
  });

  function handleOk() {
    clearTimer();
    setFlash("ok");
    const newCounts: [number, number] = [...wordCount] as [number, number];
    newCounts[current] += 1;
    setWordCount(newCounts);
    setTimeout(() => {
      setFlash(null);
      setCurrent((c) => (c === 0 ? 1 : 0));
      setTimeLeft(WORD_TIME);
    }, 400);
  }

  function handleFail() {
    clearTimer();
    setFlash("fail");
    const loser = current;
    const win: 0 | 1 = loser === 0 ? 1 : 0;
    setTimeout(() => {
      setFlash(null);
      setWinner(win);
      setPhase("done");
    }, 600);
  }

  function buildResult(): [number, number] {
    if (winner === null) return [0, 0];
    const scores: [number, number] = [0, 0];
    scores[winner] = 1;
    return scores;
  }

  // ── Ready ──────────────────────────────────────────────────────────────────
  if (phase === "ready") {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ background: "linear-gradient(160deg, #0b0a1a 0%, #1a0a2e 100%)" }}
      >
        <div className="text-6xl">🏓</div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
            Slovný ping pong
          </p>
          <h2 className="text-2xl font-black text-white">Kategória:</h2>
          <p className="mt-2 text-3xl font-black text-purple-300">{category}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/60 leading-relaxed max-w-xs">
          Striedajte sa v hovorení slov z kategórie.
          Máte <strong className="text-white">{WORD_TIME} sekúnd</strong> na každé slovo.
          Kto nevie alebo zopakuje slovo — prehráva kolo!
        </div>
        <button
          onClick={() => setPhase("playing")}
          className="w-full max-w-xs rounded-2xl py-5 text-lg font-black text-white"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
        >
          Štart 🏓
        </button>
      </div>
    );
  }

  // ── Done ───────────────────────────────────────────────────────────────────
  if (phase === "done") {
    const winColor = winner === 0 ? a : b;
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ background: "linear-gradient(160deg, #0b0a1a 0%, #1a0a2e 100%)" }}
      >
        <div className="text-6xl">🏆</div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Víťaz kola</p>
          <h2 className="text-4xl font-black" style={{ color: winColor }}>
            {winner !== null ? teamNames[winner] : "—"}
          </h2>
        </div>
        <div className="flex gap-4 w-full max-w-xs">
          {([0, 1] as const).map((idx) => (
            <div
              key={idx}
              className="flex-1 rounded-2xl py-4 text-center"
              style={{ background: `${idx === 0 ? a : b}18`, border: `1px solid ${idx === 0 ? a : b}40` }}
            >
              <p className="text-3xl font-black text-white">{wordCount[idx]}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{teamNames[idx]}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => onDone(buildResult())}
          className="w-full max-w-xs rounded-2xl py-5 text-base font-black text-white"
          style={{ background: winColor }}
        >
          🏁 Pokračovať
        </button>
      </div>
    );
  }

  // ── Playing ────────────────────────────────────────────────────────────────
  const timePercent = (timeLeft / WORD_TIME) * 100;
  const isWarning = timeLeft <= 3;

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ background: "#0a0a14" }}
    >
      {/* Flash */}
      {flash && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ background: flash === "ok" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.35)" }}
        >
          <span className="text-8xl font-black text-white">{flash === "ok" ? "✓" : "✗"}</span>
        </div>
      )}

      {/* Timer bar */}
      <div className="h-2 bg-white/10">
        <div
          className="h-full transition-all duration-1000 ease-linear"
          style={{ width: `${timePercent}%`, background: isWarning ? "#ef4444" : color }}
        />
      </div>

      {/* Top: word counts */}
      <div className="shrink-0 flex gap-3 px-5 py-4">
        {([0, 1] as const).map((idx) => (
          <div
            key={idx}
            className="flex-1 rounded-2xl px-4 py-2 text-center font-black transition-all"
            style={{
              background: idx === current ? `${idx === 0 ? a : b}25` : "rgba(255,255,255,0.05)",
              border: `2px solid ${idx === current ? (idx === 0 ? a : b) : "transparent"}`,
            }}
          >
            <span className="text-2xl text-white">{wordCount[idx]}</span>
            <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: idx === 0 ? a : b }}>
              {teamNames[idx]}
            </p>
          </div>
        ))}
      </div>

      {/* Center: active team + timer */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
        <p className="text-xs font-bold uppercase tracking-widest text-white/30">Hovorí</p>
        <h2 className="text-3xl font-black" style={{ color }}>{teamNames[current]}</h2>

        <p
          className="text-6xl font-black tabular-nums"
          style={{ color: isWarning ? "#ef4444" : color }}
        >
          {timeLeft}s
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Kategória</p>
          <p className="text-lg font-black text-white">{category}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="shrink-0 flex gap-3 px-4 pb-8 pt-3">
        <button
          onClick={handleFail}
          className="flex-1 rounded-2xl py-5 text-base font-black text-white"
          style={{ background: "#7c1a1a" }}
        >
          ❌ Nevie / Chyba
        </button>
        <button
          onClick={handleOk}
          className="flex-1 rounded-2xl py-5 text-base font-black text-white"
          style={{ background: "#166534" }}
        >
          ✅ Platné!
        </button>
      </div>
    </div>
  );
}
