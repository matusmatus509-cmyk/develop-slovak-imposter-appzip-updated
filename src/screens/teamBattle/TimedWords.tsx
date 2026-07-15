import { useState, useEffect, useRef } from "react";
import type { GameType, PantomimaDifficulty } from "../../data/teamBattle";
import {
  TEAM_COLORS,
  PANTOMIMA_WORDS_BY_DIFFICULTY,
  PANTOMIMA_DIFFICULTY_POINTS,
  PANTOMIMA_DIFFICULTY_LABELS,
  SARADY_WORDS_BY_DIFFICULTY,
  SARADY_DIFFICULTY_POINTS,
  SARADY_DIFFICULTY_LABELS,
} from "../../data/teamBattle";
import { shuffle } from "../../data/teamBattle";
import { useTiltGesture } from "../../hooks/useTiltGesture";

type SubPhase = "select-difficulty" | "ready" | "playing" | "team-done";

const MODE_INST: Record<GameType, string> = {
  pantomima: "Predvádzaj pohybom — bez slov! Ostatní hádajú.",
  sarady: "Opisuj slovami — bez odvodenín! Ostatní hádajú.",
  hadajktosom: "Drž telefón na čele. Tím odpovedá len ÁNO / NIE. Nakláňaj telefón nahor = uhádnuté, nadol = preskočiť.",
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
  const isSarady = mode === "sarady";
  const isHadajKtoSom = mode === "hadajktosom";
  const hasDifficulty = isPantomima || isSarady;

  const [teamIdx, setTeamIdx] = useState<0 | 1>(0);
  const [subPhase, setSubPhase] = useState<SubPhase>(
    hasDifficulty ? "select-difficulty" : "ready"
  );
  const [wordIdx, setWordIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeSeconds);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [flash, setFlash] = useState<"ok" | "skip" | null>(null);
  const [roundScore, setRoundScore] = useState(0);

  const [difficulty, setDifficulty] = useState<PantomimaDifficulty | null>(null);
  const [pantomimaWords, setPantomimaWords] = useState<string[]>([]);
  const [saradyWords, setSaradyWords] = useState<string[]>([]);
  const [skipCount, setSkipCount] = useState(0);

  const [a, b] = TEAM_COLORS;
  const color = teamIdx === 0 ? a : b;

  const doneRef = useRef(false);
  const correctRef = useRef(0);

  const half = Math.ceil(words.length / 2);
  const sharedTeamWords = teamIdx === 0 ? words.slice(0, half) : words.slice(half);
  const teamWords = isPantomima ? pantomimaWords : isSarady ? saradyWords : sharedTeamWords;
  const currentWord = teamWords[wordIdx] ?? "—";
  const pointsPerWord = isPantomima && difficulty
    ? PANTOMIMA_DIFFICULTY_POINTS[difficulty]
    : 1;
  const skipPenalty = Math.max(0, skipCount - 1);
  const pendingPantomimaScore = Math.max(0, pointsPerWord - skipPenalty);

  function handlePickDifficulty(d: PantomimaDifficulty) {
    setDifficulty(d);
    if (isSarady) {
      setSaradyWords(shuffle(SARADY_WORDS_BY_DIFFICULTY[d]));
    } else {
      setPantomimaWords(shuffle(PANTOMIMA_WORDS_BY_DIFFICULTY[d]));
    }
    setSubPhase("ready");
  }

  useEffect(() => {
    setSubPhase(hasDifficulty ? "select-difficulty" : "ready");
    setDifficulty(null);
    setPantomimaWords([]);
    setSaradyWords([]);
    setWordIdx(0);
    setSkipCount(0);
    setTimeLeft(timeSeconds);
    setFlash(null);
    doneRef.current = false;
    correctRef.current = 0;
  }, [teamIdx, timeSeconds, hasDifficulty]);

  useEffect(() => {
    if (subPhase !== "playing") return;
    if (timeLeft <= 0) {
      if (!doneRef.current) {
        doneRef.current = true;
        setRoundScore(isPantomima ? 0 : correctRef.current * pointsPerWord);
        setSubPhase("team-done");
      }
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [subPhase, timeLeft, pointsPerWord, isPantomima, isSarady]);

  function handleCorrect() {
    if (doneRef.current) return;
    if (isHadajKtoSom) navigator.vibrate?.(25);
    if (isPantomima) {
      doneRef.current = true;
      setFlash("ok");
      setTimeout(() => {
        setFlash(null);
        setRoundScore(pendingPantomimaScore);
        setSubPhase("team-done");
      }, 500);
      return;
    }
    if (isSarady) {
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
    if (isHadajKtoSom) navigator.vibrate?.(25);
    if (isPantomima) {
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

  // "Hádaj kto som": tilt phone up = uhádnuté, down = preskočiť — same
  // hysteresis mechanic as the standalone minigame, active only while the
  // round is actually running so tilts elsewhere don't fire it by accident.
  useTiltGesture(isHadajKtoSom && subPhase === "playing", handleCorrect, handleSkip);

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

  if (subPhase === "select-difficulty") {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ background: "linear-gradient(160deg, #0b0a1a 0%, #1a0a2e 100%)" }}
      >
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-4xl font-black text-white"
          style={{ background: color, boxShadow: `0 0 40px ${color}80`, animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          {teamIdx === 0 ? "A" : "B"}
        </div>

        <div style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">
            {teamIdx === 0 ? "Prvý ide" : "Teraz ide"}
          </p>
          <h2 className="text-4xl font-black" style={{ color }}>
            {teamNames[teamIdx]}
          </h2>
        </div>

        <div style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}>
          <p className="text-sm text-white/60 mb-1">Vyberte si obtiažnosť pre celý svoj ťah</p>
          <p className="text-xs text-white/30">Iba jedna voľba na ťah — nedá sa zmeniť</p>
          {isSarady && (
            <p className="text-xs text-white/40 mt-2">Ľahké = jednoduché slová, Ťažké = frázy</p>
          )}
        </div>

        <div className="flex w-full max-w-xs flex-col gap-3">
          {DIFFICULTY_ORDER.map((d, i) => (
            <button
              key={d}
              onClick={() => handlePickDifficulty(d)}
              className="w-full rounded-2xl py-4 text-lg font-black text-white flex items-center justify-between px-6 transition-all hover:scale-[1.02] active:scale-95 hover:shadow-lg"
              style={{
                background: DIFFICULTY_COLORS[d],
                animation: `scaleIn 0.4s ease-out ${0.3 + i * 0.1}s both`,
              }}
            >
              <span>{isSarady ? SARADY_DIFFICULTY_LABELS[d] : PANTOMIMA_DIFFICULTY_LABELS[d]}</span>
              <span className="text-sm font-bold opacity-90">{isSarady ? `${SARADY_DIFFICULTY_POINTS[d]} b / slovo` : `${PANTOMIMA_DIFFICULTY_POINTS[d]} b / slovo`}</span>
            </button>
          ))}
        </div>

        {teamIdx === 1 && (
          <p className="text-xs text-white/30">
            {teamNames[0]} získal {scores[0]} {scores[0] === 1 ? "bod" : scores[0] < 5 ? "body" : "bodov"}
          </p>
        )}
      </div>
    );
  }

  if (subPhase === "ready") {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ background: "linear-gradient(160deg, #0b0a1a 0%, #1a0a2e 100%)" }}
      >
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-4xl font-black text-white"
          style={{ background: color, boxShadow: `0 0 40px ${color}60`, animation: "ring 2s ease-in-out infinite" }}
        >
          {teamIdx === 0 ? "A" : "B"}
        </div>

        <div style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }}>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">
            {teamIdx === 0 ? "Prvý ide" : "Teraz ide"}
          </p>
          <h2 className="text-4xl font-black" style={{ color }}>
            {teamNames[teamIdx]}
          </h2>
        </div>

        <div className="glass rounded-3xl p-5 text-sm text-white/60 leading-relaxed max-w-xs" style={{ animation: "scaleIn 0.4s ease-out 0.2s both" }}>
          {MODE_INST[mode]}
        </div>

        {hasDifficulty && difficulty && (
          <div
            className="rounded-2xl px-5 py-2 text-sm font-black text-white shadow-lg"
            style={{ background: DIFFICULTY_COLORS[difficulty], animation: "popIn 0.4s", boxShadow: `0 4px 16px ${DIFFICULTY_COLORS[difficulty]}55` }}
          >
            {isSarady
              ? `${SARADY_DIFFICULTY_LABELS[difficulty]} • ${SARADY_DIFFICULTY_POINTS[difficulty]} b / slovo`
              : `${PANTOMIMA_DIFFICULTY_LABELS[difficulty]} • ${PANTOMIMA_DIFFICULTY_POINTS[difficulty]} b / slovo`}
          </div>
        )}

        {teamIdx === 1 && (
          <p className="text-xs text-white/30">
            {teamNames[0]} získal {scores[0]} {scores[0] === 1 ? "bod" : scores[0] < 5 ? "body" : "bodov"}
          </p>
        )}

        <button
          onClick={() => setSubPhase("playing")}
          className="w-full max-w-xs rounded-2xl py-5 text-lg font-black uppercase tracking-wide text-white transition-all hover:scale-[1.02] active:scale-95"
          style={{ background: color, animation: "slideUp 0.5s ease-out 0.3s both", boxShadow: `0 4px 24px ${color}55` }}
        >
          Štart ⏱
        </button>
      </div>
    );
  }

  if (subPhase === "playing") {
    return (
      <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0a14" }}>
        {flash && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
            style={{ background: flash === "ok" ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.25)", animation: "fadeIn 0.15s ease-out both" }}
          >
            <span className="text-8xl font-black text-white" style={{ animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
              {flash === "ok" ? "✓" : "✗"}
            </span>
          </div>
        )}

        <div className="shrink-0 flex items-center justify-between px-5 py-4" style={{ borderBottom: `2px solid ${color}40` }}>
          <div style={{ animation: "fadeIn 0.4s ease-out" }}>
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">Na rade</p>
            <p className="text-lg font-black" style={{ color }}>{teamNames[teamIdx]}</p>
          </div>
          <div className="text-right" style={{ animation: "fadeIn 0.4s ease-out" }}>
            <p className="text-xs text-white/30 uppercase tracking-widest">
              {isPantomima ? "Za slovo" : "Uhádnuté"}
            </p>
            <p className="text-3xl font-black text-white">
              {isPantomima ? pendingPantomimaScore : correctRef.current}
            </p>
          </div>
        </div>

        <div className="shrink-0 h-2 bg-white/10">
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{ width: `${timePercent}%`, background: isWarning ? "#ef4444" : color }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          {isPantomima ? (
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">
              {skipCount === 0
                ? "Uhádni toto slovo"
                : `Preskočené: ${skipCount}× (−${skipPenalty} b)`}
            </p>
          ) : (
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">
              {isSarady ? (
                <>{SARADY_DIFFICULTY_LABELS[difficulty ?? "lahke"]} • Slovo {wordIdx + 1} / {teamWords.length}</>
              ) : (
                <>Slovo {wordIdx + 1} / {teamWords.length}</>
              )}
            </p>
          )}
          <p
            className="font-black text-white leading-tight"
            style={{ fontSize: "clamp(2rem, 10vw, 4rem)", animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            {currentWord}
          </p>
          <p
            className="text-5xl font-black tabular-nums"
            style={{ color: isWarning ? "#ef4444" : color, animation: isWarning ? "ring 1s ease-in-out infinite" : undefined }}
          >
            {timeLeft}s
          </p>

          {isHadajKtoSom && (
            <p className="text-[11px] font-bold tracking-widest text-white/25 uppercase">
              ▲ nakloniť nahor = uhádnuté · ▼ nadol = preskočiť
            </p>
          )}
        </div>

        <div className="shrink-0 flex gap-3 px-4 pb-8 pt-3">
          <button
            onClick={handleSkip}
            className="flex-1 rounded-2xl py-5 text-base font-black text-white/70 glass active:scale-95 transition"
          >
            {isPantomima
              ? skipCount === 0
                ? "⏭ Preskočiť (zadarmo)"
                : "⏭ Preskočiť (−1 b)"
              : "⏭ Preskočiť"}
          </button>
          <button
            onClick={handleCorrect}
            className="flex-1 rounded-2xl py-5 text-base font-black text-white active:scale-95 transition"
            style={{ background: "#16a34a" }}
          >
            ✅ Uhádnuté!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-7 px-6 text-center"
      style={{ background: "linear-gradient(160deg, #0b0a1a 0%, #1a0a2e 100%)" }}
    >
      <div className="text-5xl" style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>⏰</div>
      <div style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}>
        <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Výsledok</p>
        <h2 className="text-3xl font-black" style={{ color }}>{teamNames[teamIdx]}</h2>
      </div>

      <div
        className="rounded-3xl p-8 text-center"
        style={{
          background: `${color}15`,
          border: `2px solid ${color}40`,
          animation: "scaleIn 0.5s ease-out 0.2s both",
          boxShadow: `0 8px 32px ${color}22`,
        }}
      >
        <p className="text-7xl font-black text-white">{roundScore}</p>
        <p className="text-sm text-white/40 mt-2 uppercase tracking-widest">
          {isPantomima ? "bodov" : "uhádnutých slov"}
        </p>
        {(isPantomima || isSarady) && difficulty && (
          <p className="text-xs text-white/30 mt-1">
            {isSarady
              ? `${SARADY_DIFFICULTY_LABELS[difficulty]} (${SARADY_DIFFICULTY_POINTS[difficulty]} b)`
              : `${PANTOMIMA_DIFFICULTY_LABELS[difficulty]} (${PANTOMIMA_DIFFICULTY_POINTS[difficulty]} b)`}
            {skipCount > 0 && ` − preskočenia: ${skipCount}× (−${skipPenalty} b)`}
          </p>
        )}
      </div>

      <button
        onClick={handleTeamDone}
        className="w-full rounded-2xl py-5 text-base font-black text-white active:scale-95 transition"
        style={{ background: color, animation: "slideUp 0.5s ease-out 0.4s both", boxShadow: `0 4px 20px ${color}44` }}
      >
        {teamIdx === 0 ? `➡️ ${teamNames[1]} na rad!` : "🏁 Zobraziť výsledky"}
      </button>
    </div>
  );
}
