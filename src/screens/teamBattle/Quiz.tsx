import { useState } from "react";
import type { QuizQuestion } from "../../data/teamBattle";
import { TEAM_COLORS } from "../../data/teamBattle";
import { Icons } from "../../components/icons";

type QuizPhase =
  | { t: "question" }
  | { t: "buzzed"; who: 0 | 1 }
  | { t: "second-chance"; who: 0 | 1 }
  | { t: "selecting"; who: 0 | 1 }
  | { t: "mc-result"; who: 0 | 1; selectedIndex: number; correct: boolean; scores: [number, number] }
  | { t: "done" };

const LETTERS = ["A", "B", "C", "D"] as const;

const QUESTIONS_PER_ROUND = 5;

export default function TeamQuiz({
  questions,
  teamNames,
  onDone,
}: {
  questions: QuizQuestion[];
  teamNames: [string, string];
  onDone: (scores: [number, number]) => void;
}) {
  const [qIdx, setQIdx] = useState(0);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [phase, setPhase] = useState<QuizPhase>({ t: "question" });
  const [answerRevealed, setAnswerRevealed] = useState(false);

  const [a, b] = TEAM_COLORS;
  const q = questions[qIdx];

  function buzz(who: 0 | 1) {
    if (phase.t !== "question") return;
    if (q.options) {
      setPhase({ t: "selecting", who });
    } else {
      setAnswerRevealed(false);
      setPhase({ t: "buzzed", who });
    }
  }

  function selectAnswer(selectedIndex: number) {
    if (phase.t !== "selecting") return;
    const { who } = phase;
    const correct = selectedIndex === q.correctIndex;
    const scorer = correct ? who : who === 0 ? 1 : 0;
    const newScores: [number, number] = [...scores] as [number, number];
    newScores[scorer] += 1;
    setScores(newScores);
    setPhase({ t: "mc-result", who, selectedIndex, correct, scores: newScores });
  }

  function markCorrect(who: 0 | 1) {
    const newScores: [number, number] = [...scores] as [number, number];
    newScores[who] += 1;
    setScores(newScores);
    nextQuestion(newScores);
  }

  function markWrong(who: 0 | 1) {
    if (phase.t === "buzzed") {
      const other = who === 0 ? 1 : 0;
      setAnswerRevealed(false);
      setPhase({ t: "second-chance", who: other });
    } else {
      nextQuestion(scores);
    }
  }

  function nextQuestion(currentScores: [number, number]) {
    const next = qIdx + 1;
    setAnswerRevealed(false);
    if (next >= QUESTIONS_PER_ROUND) {
      onDone(currentScores);
    } else {
      setQIdx(next);
      setPhase({ t: "question" });
    }
  }

  function getActiveTeam(): 0 | 1 | null {
    if (
      phase.t === "buzzed" ||
      phase.t === "second-chance" ||
      phase.t === "selecting" ||
      phase.t === "mc-result"
    )
      return phase.who;
    return null;
  }

  const activeTeam = getActiveTeam();
  const bgColor =
    activeTeam === 0 ? `${a}18` : activeTeam === 1 ? `${b}18` : "rgba(255,255,255,0.03)";
  const borderColor =
    activeTeam === 0 ? `${a}40` : activeTeam === 1 ? `${b}40` : "rgba(255,255,255,0.08)";

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: "radial-gradient(circle at 50% 30%, rgba(168,85,247,.15), transparent 45%), #070711" }}
    >
      <div className="party-grid pointer-events-none absolute inset-0 opacity-20" />

      {/* Horný buzzer je otočený k tímu sediacemu oproti telefónu. */}
      {phase.t === "question" && (
        <button
          onClick={() => buzz(0)}
          aria-label={`${teamNames[0]} chce odpovedať`}
          className="group relative z-20 flex h-[5.5rem] w-full shrink-0 items-center justify-center overflow-hidden rounded-b-[1.7rem] border-b border-white/30 text-white shadow-[0_16px_45px_rgba(0,0,0,.4)] transition active:scale-[.985] active:brightness-125"
          style={{
            paddingTop: "max(.35rem, env(safe-area-inset-top))",
            background: `linear-gradient(120deg, #071a33 0%, ${a} 48%, #174a85 100%)`,
            boxShadow: `0 15px 44px ${a}55`,
          }}
        >
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,.22),transparent_28%)]" />
          <span className="pointer-events-none absolute -bottom-12 -right-8 h-32 w-32 rounded-full border-[18px] border-white/10" />
            <span className="relative flex rotate-180 items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white/70 bg-white/15 text-2xl shadow-[inset_0_3px_12px_rgba(255,255,255,.3),0_5px_20px_rgba(0,0,0,.28)] transition group-active:scale-90">
              <span className="h-5 w-5 rounded-full bg-blue-300" />
            </span>
            <span className="text-left">
              <span className="block max-w-[13rem] truncate text-lg font-black leading-none">{teamNames[0]}</span>
            </span>
          </span>
        </button>
      )}

      {/* Score bar */}
      <div className="relative z-10 mx-3 my-2 flex shrink-0 items-center justify-between rounded-[1.25rem] border border-white/10 bg-white/[0.055] px-4 py-2 backdrop-blur-xl">
        {([0, 1] as const).map((idx, i) => (
          <div
            key={idx}
            className="flex items-center gap-2 rounded-2xl px-3 py-2 font-black transition-all"
            style={{
              background: `${idx === 0 ? a : b}20`,
              border: `1px solid ${idx === 0 ? a : b}40`,
              animation: `slideUp 0.5s ease-out ${i * 0.1}s both`,
            }}
          >
            <span className="h-3 w-3 rounded-full" style={{ background: idx === 0 ? a : b }} />
            <span className="text-white text-lg">{scores[idx]}</span>
          </div>
        ))}
        <span className="text-xs text-white/30 font-bold uppercase tracking-widest">
          {qIdx + 1} / {QUESTIONS_PER_ROUND}
        </span>
      </div>

      {/* Question card */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-5 py-3">
        <p className="text-xs font-bold uppercase tracking-widest text-white/30">
          {q.category}
        </p>
        <div
          className="party-glass party-shine relative w-full overflow-hidden rounded-[1.6rem] border p-4 text-center transition-all duration-300"
          style={{
            background: bgColor,
            borderColor,
            animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
          key={qIdx}
        >
          <p
            className="font-black text-white leading-snug"
            style={{ fontSize: "clamp(1.15rem, 4.5vw, 1.65rem)" }}
          >
            {q.question}
          </p>

          {/* Pred prihlásením tímu sú vždy viditeľné všetky štyri možnosti. */}
          {q.options && phase.t === "question" && (
            <div className="mt-3 space-y-1.5 text-left" style={{ animation: "slideUp 0.4s ease-out" }}>
              {q.options.map((opt, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 items-baseline"
                >
                  <span className="font-black text-white/40">{LETTERS[i]}</span>
                  <span className="text-white/80 font-semibold text-sm">{opt}</span>
                </div>
              ))}
            </div>
          )}

          {q.options && phase.t === "selecting" && (
            <p className="mt-4 text-sm font-bold text-white/40" style={{ animation: "fadeIn 0.3s ease-out" }}>
              Možnosti sú skryté — vyberte písmeno naspamäť!
            </p>
          )}

          {/* Multiple-choice: reveal result with correct/selected highlighting */}
          {q.options && phase.t === "mc-result" && (
            <div className="mt-6 space-y-2 text-left" style={{ animation: "slideUp 0.4s ease-out" }}>
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correctIndex;
                const isPicked = i === phase.selectedIndex;
                return (
                  <div
                    key={i}
                    className="rounded-xl border px-4 py-2.5 flex gap-3 items-baseline transition"
                    style={{
                      background: isCorrect
                        ? "rgba(34,197,94,0.18)"
                        : isPicked
                        ? "rgba(239,68,68,0.18)"
                        : "rgba(255,255,255,0.05)",
                      borderColor: isCorrect
                        ? "rgba(34,197,94,0.5)"
                        : isPicked
                        ? "rgba(239,68,68,0.5)"
                        : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <span className="font-black text-white/60">{LETTERS[i]}</span>
                    <span className="text-white font-semibold text-sm flex-1">{opt}</span>
                    {isCorrect && <span>✅</span>}
                    {isPicked && !isCorrect && <span>❌</span>}
                  </div>
                );
              })}
              <p className="text-center pt-2 font-black" style={{ color: phase.correct ? "#4ade80" : "#f87171" }}>
                {phase.correct
                  ? `+1 bod pre ${teamNames[phase.who]}!`
                  : `Nesprávne! Bod ide pre ${teamNames[phase.who === 0 ? 1 : 0]}.`}
              </p>
            </div>
          )}

          {/* Open questions: correct answer stays hidden until the host reveals it */}
          {!q.options && (phase.t === "buzzed" || phase.t === "second-chance") && answerRevealed && (
            <div
              className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-3"
              style={{ animation: "slideUp 0.4s ease-out" }}
            >
              <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Odpoveď</p>
              <p className="text-lg font-black text-green-400">{q.answer}</p>
            </div>
          )}
        </div>

        {phase.t === "second-chance" && (
          <p className="text-sm font-bold text-white/50" style={{ animation: "fadeIn 0.3s ease-out" }}>
            Šanca pre{" "}
            <span style={{ color: phase.who === 0 ? a : b }}>{teamNames[phase.who]}</span>
          </p>
        )}

        {phase.t === "selecting" && (
          <p className="text-sm font-bold" style={{ color: phase.who === 0 ? a : b, animation: "fadeIn 0.3s ease-out" }}>
            Odpovedá: {teamNames[phase.who]}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className={`relative z-10 shrink-0 ${phase.t === "question" ? "px-0 pb-[max(.35rem,env(safe-area-inset-bottom))] pt-0" : "space-y-3 px-4 pb-6 pt-2"}`}>
        {phase.t === "question" && (
          <button
            onClick={() => buzz(1)}
            aria-label={`${teamNames[1]} chce odpovedať`}
            className="group relative flex h-[5.5rem] w-full items-center justify-center overflow-hidden rounded-t-[1.7rem] border-t border-white/30 text-white shadow-[0_-16px_45px_rgba(0,0,0,.4)] transition active:scale-[.985] active:brightness-125"
            style={{
              background: `linear-gradient(120deg, #7f1d2d 0%, ${b} 50%, #350916 100%)`,
              boxShadow: `0 -15px 44px ${b}55`,
            }}
          >
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,.22),transparent_28%)]" />
            <span className="pointer-events-none absolute -left-8 -top-12 h-32 w-32 rounded-full border-[18px] border-white/10" />
            <span className="relative flex items-center gap-3">
              <span className="text-right">
                <span className="block max-w-[13rem] truncate text-lg font-black leading-none">{teamNames[1]}</span>
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white/70 bg-white/15 text-2xl shadow-[inset_0_3px_12px_rgba(255,255,255,.3),0_5px_20px_rgba(0,0,0,.28)] transition group-active:scale-90">
                <span className="h-5 w-5 rounded-full bg-rose-300" />
              </span>
            </span>
          </button>
        )}

        {phase.t === "selecting" && (
          <div className="grid grid-cols-4 gap-3">
            {LETTERS.map((letter, i) => (
              <button
                key={letter}
                onClick={() => selectAnswer(i)}
                className="rounded-2xl py-7 text-2xl font-black text-white active:scale-95 transition shadow-lg hover:brightness-110"
                style={{
                  background: phase.who === 0 ? a : b,
                  boxShadow: `0 0 20px ${(phase.who === 0 ? a : b)}55`,
                }}
              >
                {letter}
              </button>
            ))}
          </div>
        )}

        {phase.t === "mc-result" && (
          <button
            onClick={() => nextQuestion(phase.scores)}
            className="w-full rounded-2xl py-5 text-lg font-black text-white active:scale-95 transition"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            Ďalšia otázka →
          </button>
        )}

        {(phase.t === "buzzed" || phase.t === "second-chance") && (
          <>
            <p className="text-center text-sm text-white/50">
              Odpoveď od:{" "}
              <strong style={{ color: activeTeam === 0 ? a : b }}>
                {teamNames[activeTeam!]}
              </strong>
            </p>
            {!answerRevealed ? (
              <button
                onClick={() => setAnswerRevealed(true)}
                className="w-full rounded-2xl py-5 text-lg font-black text-white active:scale-95 transition"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              >
                <span className="flex items-center justify-center gap-2"><Icons.eye size={18} /> Ukázať správnu odpoveď</span>
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => markWrong(activeTeam!)}
                  className="flex-1 rounded-2xl py-5 text-lg font-black text-white active:scale-95 transition"
                  style={{ background: "#7c1a1a" }}
                >
                  ❌ Chyba
                </button>
                <button
                  onClick={() => markCorrect(activeTeam!)}
                  className="flex-1 rounded-2xl py-5 text-lg font-black text-white active:scale-95 transition"
                  style={{ background: "#166534" }}
                >
                  ✅ Správne
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
