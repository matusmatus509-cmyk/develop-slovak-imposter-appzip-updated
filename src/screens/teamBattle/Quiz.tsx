import { useState } from "react";
import type { QuizQuestion } from "../../data/teamBattle";
import { TEAM_COLORS } from "../../data/teamBattle";

type QuizPhase =
  | { t: "question" }
  | { t: "buzzed"; who: 0 | 1 }
  | { t: "second-chance"; who: 0 | 1 }
  | { t: "done" };

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

  const [a, b] = TEAM_COLORS;
  const q = questions[qIdx];

  function buzz(who: 0 | 1) {
    if (phase.t !== "question") return;
    setPhase({ t: "buzzed", who });
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
      setPhase({ t: "second-chance", who: other });
    } else {
      nextQuestion(scores);
    }
  }

  function nextQuestion(currentScores: [number, number]) {
    const next = qIdx + 1;
    if (next >= QUESTIONS_PER_ROUND) {
      onDone(currentScores);
    } else {
      setQIdx(next);
      setPhase({ t: "question" });
    }
  }

  function getActiveTeam(): 0 | 1 | null {
    if (phase.t === "buzzed" || phase.t === "second-chance") return phase.who;
    return null;
  }

  const activeTeam = getActiveTeam();
  const bgColor =
    activeTeam === 0 ? `${a}18` : activeTeam === 1 ? `${b}18` : "rgba(255,255,255,0.03)";
  const borderColor =
    activeTeam === 0 ? `${a}40` : activeTeam === 1 ? `${b}40` : "rgba(255,255,255,0.08)";

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ background: "linear-gradient(160deg, #0b0a1a 0%, #1a0a2e 100%)" }}
    >
      {/* Score bar */}
      <div className="shrink-0 flex items-center justify-between px-5 py-4">
        {([0, 1] as const).map((idx, i) => (
          <div
            key={idx}
            className="flex items-center gap-2 rounded-2xl px-4 py-2 font-black transition-all"
            style={{
              background: `${idx === 0 ? a : b}20`,
              border: `1px solid ${idx === 0 ? a : b}40`,
              animation: `slideUp 0.5s ease-out ${i * 0.1}s both`,
            }}
          >
            <span style={{ color: idx === 0 ? a : b }}>{idx === 0 ? "🔵" : "🔴"}</span>
            <span className="text-white text-lg">{scores[idx]}</span>
          </div>
        ))}
        <span className="text-xs text-white/30 font-bold uppercase tracking-widest">
          {qIdx + 1} / {QUESTIONS_PER_ROUND}
        </span>
      </div>

      {/* Question card */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-4">
        <p className="text-xs font-bold uppercase tracking-widest text-white/30">
          {q.category}
        </p>
        <div
          className="w-full rounded-3xl border p-8 text-center transition-all duration-300 glass"
          style={{
            background: bgColor,
            borderColor,
            animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
          key={qIdx}
        >
          <p
            className="font-black text-white leading-snug"
            style={{ fontSize: "clamp(1.3rem, 5vw, 2rem)" }}
          >
            {q.question}
          </p>

          {phase.t !== "question" && (
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
      </div>

      {/* Buttons */}
      <div className="shrink-0 px-4 pb-6 pt-2 space-y-3">
        {phase.t === "question" && (
          <div className="flex gap-3">
            {([0, 1] as const).map((idx) => (
              <button
                key={idx}
                onClick={() => buzz(idx)}
                className="flex-1 rounded-2xl py-7 text-xl font-black text-white active:scale-[0.97] transition shadow-lg hover:brightness-110"
                style={{
                  background: idx === 0 ? a : b,
                  boxShadow: `0 0 24px ${(idx === 0 ? a : b)}55`,
                }}
              >
                {idx === 0 ? "🔵" : "🔴"}<br />
                <span className="text-sm mt-1 block">{teamNames[idx]}</span>
              </button>
            ))}
          </div>
        )}

        {(phase.t === "buzzed" || phase.t === "second-chance") && (
          <>
            <p className="text-center text-sm text-white/50">
              Odpoveď od:{" "}
              <strong style={{ color: activeTeam === 0 ? a : b }}>
                {teamNames[activeTeam!]}
              </strong>
            </p>
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
          </>
        )}
      </div>
    </div>
  );
}