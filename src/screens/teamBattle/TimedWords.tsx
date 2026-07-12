import { useState, useEffect, useRef } from "react";
import type { GameType, PantomimaDifficulty } from "../../data/teamBattle";
import {
  TEAM_COLORS,
  PANTOMIMA_WORDS_BY_DIFFICULTY,
  PANTOMIMA_DIFFICULTY_POINTS,
  PANTOMIMA_DIFFICULTY_LABELS,
} from "../../data/teamBattle";
import { shuffle } from "../../data/teamBattle";

type SubPhase = "select-difficulty" | "ready" | "playing" | "team-done";

const MODE_INST: Record<GameType, string> = {
  pantomima: "Predvádzaj pohybom — bez slov! Ostatní hádajú.",
  sarady: "Opisuj slovami — bez odvodenín! Ostatní hádajú.",
  hadajktosom: "Drž telefón na čele. Tím odpovedá len ÁNO / NIE.",
  quiz: "",
  pingpong: "",
};

const DIFFICULTY_ORDER: PantomimaDifficulty[] = ["lahke", "stredne", "tazke"];
const DIFFICULTY_COLORS: Record<PantomimaDifficulty, string> = {
  lahke: "#22c55e",
  stredne: "#f59e0b",
  tazke: "#ef4444",
};

export default function TimedWords({
  teamNames,
  words,
  timeSeconds,
  mode,
  onDone,
}: {
  teamNames: [string, string];
  words: string[];
  timeSeconds: number;
  mode: GameType;
  onDone: (scores: [number, number]) => void;
}) {
  const isPantomima = mode === "pantomima";

  const [teamIdx, setTeamIdx] = useState<0 | 1>(0);
  const [subPhase, setSubPhase] = useState<SubPhase>(
    isPantomima ? "select-difficulty" : "ready"
  );
  const [wordIdx, setWordIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeSeconds);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [flash, setFlash] = useState<"ok" | "skip" | null>(null);
  const [roundScore, setRoundScore] = useState(0);

  // Pantomíma: each team picks exactly one difficulty for their whole turn,
  // and acts out ONE word — skipping just swaps the word (same difficulty),
  // it doesn't end the turn. First skip is free, every skip after that is -1.
  const [difficulty, setDifficulty] = useState<PantomimaDifficulty | null>(null);
  const [pantomimaWords, setPantomimaWords] = useState<string[]>([]);
  const [skipCount, setSkipCount] = useState(0);

  const [a, b] = TEAM_COLORS;
  const color = teamIdx === 0 ? a : b;

  const doneRef = useRef(false);
  const correctRef = useRef(0);

  // Split words between two teams (non-pantomima modes share one shuffled list)
  const half = Math.ceil(words.length / 2);
  const sharedTeamWords = teamIdx === 0 ? words.slice(0, half) : words.slice(half);
  const teamWords = isPantomima ? pantomimaWords : sharedTeamWords;
  const currentWord = teamWords[wordIdx] ?? "—";
  const pointsPerWord = isPantomima && difficulty ? PANTOMIMA_DIFFICULTY_POINTS[difficulty] : 1;
  // First skip is free, every skip after that costs 1 point.
  const skipPenalty = Math.max(0, skipCount - 1);
  const pendingPantomimaScore = Math.max(0, pointsPerWord - skipPenalty);

  function handlePickDifficulty(d: PantomimaDifficulty) {
    setDifficulty(d);
    setPantomimaWords(shuffle(PANTOMIMA_WORDS_BY_DIFFICULTY[d]));
    setSubPhase("ready");
  }

  // Reset state when team changes
  useEffect(() => {
    setSubPhase(isPantomima ? "select-difficulty" : "ready");
    setDifficulty(null);
    setPantomimaWords([]);
    setWordIdx(0);
    setSkipCount(0);
    setTimeLeft(timeSeconds);
    setFlash(null);
    doneRef.current = false;
    correctRef.current = 0;
  }, [teamIdx, timeSeconds, isPantomima]);

  // Timer
  useEffect(() => {
    if (subPhase !== "playing") return;
    if (timeLeft <= 0) {
      if (!doneRef.current) {
        doneRef.current = true;
        // Pantomíma: time ran out before the word was guessed — no points.
        setRoundScore(isPantomima ? 0 : correctRef.current * pointsPerWord);
        setSubPhase("team-done");
      }
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [subPhase, timeLeft, pointsPerWord, isPantomima]);

  function handleCorrect() {
    if (doneRef.current) return;

    if (isPantomima) {
      // Pantomíma: only one word per turn — a correct guess ends the turn.
      doneRef.current = true;
      setFlash("ok");
      setTimeout(() => {
        setFlash(null);
        setRoundScore(pendingPantomimaScore);
        setSubPhase("team-done");
      }, 500);
      return;
    }

    correctRef.current += 1;
    setFlash("ok");
    setTimeout(() => {
      setFlash(null);
      if (wordIdx + 1 >= teamWords.length) {
        doneRef.current = true;
        setRoundScore(correctRef.current * pointsPerWord);
        setSubPhase("team-done");
      } else {
        setWordIdx((i) => i + 1);
      }
    }, 500);
  }

  function handleSkip() {
    if (doneRef.current) return;

    if (isPantomima) {
      // Skipping just swaps the word (same difficulty) — the turn keeps going.
      if (wordIdx + 1 >= teamWords.length) {
        doneRef.current = true;
        setRoundScore(0);
        setSubPhase("team-done");
        return;
      }
      setFlash("skip");
      setSkipCount((c) => c + 1);
      setTimeout(() => {
        setFlash(null);
        setWordIdx((i) => i + 1);
      }, 400);
      return;
    }

    setFlash("skip");
    setTimeout(() => {
      setFlash(null);
      if (wordIdx + 1 >= teamWords.length) {
        doneRef.current = true;
        setRoundScore(correctRef.current * pointsPerWord);
        setSubPhase("team-done");
      } else {
        setWordIdx((i) => i + 1);
      }
    }, 400);
  }

  function handleTeamDone() {
    const newScores: [number, number] = [...scores] as [number, number];
    newScores[teamIdx] = roundScore;
    setScores(newScores);

    if (teamIdx === 0) {
      setTeamIdx(1);
    } else {
      onDone(newScores);
    }
  }

  const timePercent = (timeLeft / timeSeconds) * 100;
  const isWarning = timeLeft <= 10;

  // ── Select difficulty (pantomíma only, one pick per turn) ───────────────────
  if (subPhase === "select-difficulty") {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ background: "linear-gradient(160deg, #0b0a1a 0%, #1a0a2e 100%)" }}
      >
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-4xl font-black text-white"
          style={{ background: color, boxShadow: `0 0 40px ${color}60` }}
        >
          {teamIdx === 0 ? "A" : "B"}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">
            {teamIdx === 0 ? "Prvý ide" : "Teraz ide"}
          </p>
          <h2 className="text-4xl font-black" style={{ color }}>
            {teamNames[teamIdx]}
          </h2>
        </div>

        <div>
          <p className="text-sm text-white/60 mb-1">Vyberte si obtiažnosť pre celý svoj ťah</p>
          <p className="text-xs text-white/30">Iba jedna voľba na ťah — nedá sa zmeniť</p>
        </div>

        <div className="flex w-full max-w-xs flex-col gap-3">
          {DIFFICULTY_ORDER.map((d) => (
            <button
              key={d}
              onClick={() => handlePickDifficulty(d)}
              className="w-full rounded-2xl py-4 text-lg font-black text-white flex items-center justify-between px-6"
              style={{ background: DIFFICULTY_COLORS[d] }}
            >
              <span>{PANTOMIMA_DIFFICULTY_LABELS[d]}</span>
              <span className="text-sm font-bold opacity-90">{PANTOMIMA_DIFFICULTY_POINTS[d]} b / slovo</span>
            </button>
          ))}
        </div>

        {teamIdx === 1 && (
          <p className="text-xs text-white/30">
            {teamNames[0]} získal {scores[0]} {scores[0] === 1 ? "bod" : "body"}
          </p>
        )}
      </div>
    );
  }

  // ── Ready ──────────────────────────────────────────────────────────────────
  if (subPhase === "ready") {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ background: "linear-gradient(160deg, #0b0a1a 0%, #1a0a2e 100%)" }}
      >
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-4xl font-black text-white"
          style={{ background: color, boxShadow: `0 0 40px ${color}60` }}
        >
          {teamIdx === 0 ? "A" : "B"}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">
            {teamIdx === 0 ? "Prvý ide" : "Teraz ide"}
          </p>
          <h2 className="text-4xl font-black" style={{ color }}>
            {teamNames[teamIdx]}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/60 leading-relaxed max-w-xs">
          {MODE_INST[mode]}
        </div>

        {isPantomima && difficulty && (
          <div
            className="rounded-2xl px-5 py-2 text-sm font-black text-white"
            style={{ background: DIFFICULTY_COLORS[difficulty] }}
          >
            {PANTOMIMA_DIFFICULTY_LABELS[difficulty]} • {PANTOMIMA_DIFFICULTY_POINTS[difficulty]} b / slovo
          </div>
        )}

        {teamIdx === 1 && (
          <p className="text-xs text-white/30">
            {teamNames[0]} získal {scores[0]}{" "}
            {isPantomima ? (scores[0] === 1 ? "bod" : "body") : (scores[0] === 1 ? "slovo" : "slov")}
          </p>
        )}

        <button
          onClick={() => setSubPhase("playing")}
          className="w-full max-w-xs rounded-2xl py-5 text-lg font-black uppercase tracking-wide text-white"
          style={{ background: color }}
        >
          Štart ⏱
        </button>
      </div>
    );
  }

  // ── Playing ────────────────────────────────────────────────────────────────
  if (subPhase === "playing") {
    return (
      <div
        className="fixed inset-0 flex flex-col"
        style={{ background: "#0a0a14" }}
      >
        {/* Flash overlay */}
        {flash && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
            style={{ background: flash === "ok" ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.25)" }}
          >
            <span className="text-8xl font-black text-white">
              {flash === "ok" ? "✓" : "✗"}
            </span>
          </div>
        )}

        {/* Top bar */}
        <div
          className="shrink-0 flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `2px solid ${color}40` }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">Na rade</p>
            <p className="text-lg font-black" style={{ color }}>{teamNames[teamIdx]}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/30 uppercase tracking-widest">
              {isPantomima ? "Za slovo" : "Uhádnuté"}
            </p>
            <p className="text-3xl font-black text-white">
              {isPantomima ? pendingPantomimaScore : correctRef.current}
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className="shrink-0 h-2 bg-white/10">
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{ width: `${timePercent}%`, background: isWarning ? "#ef4444" : color }}
          />
        </div>

        {/* Word */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          {isPantomima ? (
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">
              {skipCount === 0
                ? "Uhádni toto slovo"
                : `Preskočené: ${skipCount}× (−${skipPenalty} b)`}
            </p>
          ) : (
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">
              Slovo {wordIdx + 1} / {teamWords.length}
            </p>
          )}
          <p
            className="font-black text-white leading-tight"
            style={{ fontSize: "clamp(2rem, 10vw, 4rem)" }}
          >
            {currentWord}
          </p>
          <p
            className="text-5xl font-black tabular-nums"
            style={{ color: isWarning ? "#ef4444" : color }}
          >
            {timeLeft}s
          </p>
        </div>

        {/* Action buttons */}
        <div className="shrink-0 flex gap-3 px-4 pb-8 pt-3">
          <button
            onClick={handleSkip}
            className="flex-1 rounded-2xl py-5 text-base font-black text-white/70"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            {isPantomima
              ? skipCount === 0
                ? "⏭ Preskočiť (zadarmo)"
                : "⏭ Preskočiť (−1 b)"
              : "⏭ Preskočiť"}
          </button>
          <button
            onClick={handleCorrect}
            className="flex-1 rounded-2xl py-5 text-base font-black text-white"
            style={{ background: "#16a34a" }}
          >
            ✅ Uhádnuté!
          </button>
        </div>
      </div>
    );
  }

  // ── Team done ──────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-7 px-6 text-center"
      style={{ background: "linear-gradient(160deg, #0b0a1a 0%, #1a0a2e 100%)" }}
    >
      <div className="text-5xl">⏰</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Výsledok</p>
        <h2 className="text-3xl font-black" style={{ color }}>{teamNames[teamIdx]}</h2>
      </div>

      <div
        className="rounded-3xl p-8 text-center"
        style={{ background: `${color}15`, border: `2px solid ${color}40` }}
      >
        <p className="text-7xl font-black text-white">{roundScore}</p>
        <p className="text-sm text-white/40 mt-2 uppercase tracking-widest">
          {isPantomima ? "bodov" : "uhádnutých slov"}
        </p>
        {isPantomima && difficulty && (
          <p className="text-xs text-white/30 mt-1">
            {PANTOMIMA_DIFFICULTY_LABELS[difficulty]} ({PANTOMIMA_DIFFICULTY_POINTS[difficulty]} b)
            {skipCount > 0 && ` − preskočenia: ${skipCount}× (−${skipPenalty} b)`}
          </p>
        )}
      </div>

      <button
        onClick={handleTeamDone}
        className="w-full rounded-2xl py-5 text-base font-black text-white"
        style={{ background: color }}
      >
        {teamIdx === 0 ? `➡️ ${teamNames[1]} na rad!` : "🏁 Zobraziť výsledky"}
      </button>
    </div>
  );
}
