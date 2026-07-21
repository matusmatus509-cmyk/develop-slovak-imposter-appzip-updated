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
import { requestTiltPermission, useTiltGesture } from "../../hooks/useTiltGesture";
import { CircularTimer } from "./PartyChrome";

type SubPhase = "select-difficulty" | "ready" | "playing" | "team-done";

const MODE_INST: Partial<Record<GameType, string>> = {
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
  const actionLockedRef = useRef(false);

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
    actionLockedRef.current = false;
  }, [teamIdx, timeSeconds, hasDifficulty]);

  const tiltStatus = useTiltGesture(
    isHadajKtoSom && subPhase === "playing",
    handleCorrect,
    handleSkip,
  );
  const isTiltCalibrating = isHadajKtoSom && tiltStatus === "calibrating";

  useEffect(() => {
    if (subPhase !== "playing" || isTiltCalibrating) return;
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
  }, [subPhase, timeLeft, pointsPerWord, isPantomima, isSarady, isTiltCalibrating]);

  function handleCorrect() {
    if (doneRef.current || actionLockedRef.current) return;
    actionLockedRef.current = true;
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
          actionLockedRef.current = false;
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
        actionLockedRef.current = false;
      }
    }, 500);
  }

  function handleSkip() {
    if (doneRef.current || actionLockedRef.current) return;
    actionLockedRef.current = true;
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
        actionLockedRef.current = false;
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
        actionLockedRef.current = false;
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

  if (subPhase === "select-difficulty") {
    return (
      <div
        className="party-backdrop fixed inset-0 flex flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center"
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
        className="party-backdrop fixed inset-0 flex flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center"
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

        <div className="party-glass rounded-[1.75rem] p-5 text-sm leading-relaxed text-white/60 max-w-xs" style={{ animation: "scaleIn 0.4s ease-out 0.2s both" }}>
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
          onClick={async () => {
            if (isHadajKtoSom) await requestTiltPermission();
            setSubPhase("playing");
          }}
          className="party-shine w-full max-w-xs overflow-hidden rounded-2xl py-5 text-lg font-black uppercase tracking-wide text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          style={{ background: color, animation: "slideUp 0.5s ease-out 0.3s both", boxShadow: `0 4px 24px ${color}55` }}
        >
          Štart ⏱
        </button>
      </div>
    );
  }

  if (subPhase === "playing") {
    return (
      <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: "radial-gradient(circle at 50% 35%, rgba(168,85,247,.14), transparent 44%), #070711" }}>
        <div className="party-grid pointer-events-none absolute inset-0 opacity-20" />
        {isTiltCalibrating && (
          <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div
              className="flex flex-col items-center gap-4 text-center"
              style={{ transform: "rotate(-90deg)", animation: "fadeIn .25s ease-out both" }}
            >
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/10">
                <div className="absolute inset-2 rounded-full border-2 border-cyan-300/20 border-t-cyan-300 animate-spin" />
                <span className="text-3xl">📱</span>
              </div>
              <div>
                <p className="text-xl font-black text-white">Drž mobil rovno</p>
                <p className="mt-1 max-w-[230px] text-xs font-semibold leading-relaxed text-white/50">
                  Kalibrujem neutrálnu polohu. Približne jednu sekundu s telefónom nehýb.
                </p>
              </div>
            </div>
          </div>
        )}

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

        <div className="relative z-10 m-3 flex shrink-0 items-center justify-between rounded-[1.4rem] border border-white/10 bg-white/[0.055] px-5 py-3 backdrop-blur-xl" style={{ boxShadow: `0 12px 34px ${color}18` }}>
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

        <div className="relative z-10 mx-5 h-1.5 shrink-0 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{ width: `${timePercent}%`, background: isWarning ? "#ef4444" : color }}
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
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
          <div className="party-glass party-shine relative w-full max-w-md overflow-hidden rounded-[2rem] px-6 py-9">
          <p
            className="font-black leading-tight text-white"
            style={{ fontSize: "clamp(2rem, 10vw, 4rem)", animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            {currentWord}
          </p>
          </div>
          <CircularTimer value={timeLeft} total={timeSeconds} color={isWarning ? "#ef4444" : color} />

          {isHadajKtoSom && (
            <div className="space-y-2 text-center">
              <p className="text-[11px] font-bold tracking-widest text-white/25 uppercase">
                ▲ nakloniť nahor = uhádnuté · ▼ nadol = preskočiť
              </p>
              {tiltStatus === "return-to-center" && (
                <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-200/80 animate-pulse">
                  Vráť mobil rovno
                </p>
              )}
              {tiltStatus === "unsupported" && (
                <p className="text-[10px] font-bold text-amber-100/70">
                  Senzor nie je dostupný — použi tlačidlá na obrazovke
                </p>
              )}
            </div>
          )}
        </div>

        <div className="relative z-10 flex shrink-0 gap-3 px-4 pb-8 pt-3">
          <button
            onClick={handleSkip}
            className="party-glass flex-1 rounded-2xl py-5 text-base font-black text-white/70 active:scale-95 transition"
          >
            {isPantomima
              ? skipCount === 0
                ? "⏭ Preskočiť (zadarmo)"
                : "⏭ Preskočiť (−1 b)"
              : "⏭ Preskočiť"}
          </button>
          <button
            onClick={handleCorrect}
            className="party-shine flex-1 overflow-hidden rounded-2xl py-5 text-base font-black text-white shadow-lg active:scale-95 transition"
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
      className="party-backdrop fixed inset-0 flex flex-col items-center justify-center gap-7 overflow-hidden px-6 text-center"
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
