import { useState } from "react";
import type { QuizQuestion } from "../../data/teamBattle";
import { TEAM_COLORS } from "../../data/teamBattle";
import { Icons } from "../../components/icons";

type QuizPhase =
  | { t: "question" }
  | { t: "buzzed"; who: 0 | 1 }
  | { t: "second-chance"; who: 0 | 1 }
  | { t: "selecting"; who: 0 | 1 }
  | {
      t: "mc-result";
      who: 0 | 1;
      selectedIndex: number;
      correct: boolean;
      scores: [number, number];
    }
  | { t: "done" };

/** Čo má strana jedného tímu práve robiť. */
type FaceMode = "idle" | "waiting" | "armed" | "result";

const LETTERS = ["A", "B", "C", "D"] as const;

const QUESTIONS_PER_ROUND = 5;

/**
 * Jedna strana obojstrannej obrazovky. Telefón leží medzi tímami, preto sa
 * horná strana otočí o 180° — každý tím tak čita otázku aj možnosti správne.
 */
function QuizFace({
  flipped,
  teamName,
  color,
  category,
  question,
  options,
  mode,
  correctIndex,
  selectedIndex,
  result,
  onBuzz,
  onSelect,
  onNext,
}: {
  flipped: boolean;
  teamName: string;
  color: string;
  category: string;
  question: string;
  options?: string[];
  mode: FaceMode;
  correctIndex?: number;
  selectedIndex?: number;
  result?: { correct: boolean; message: string };
  onBuzz: () => void;
  onSelect: (index: number) => void;
  onNext: () => void;
}) {
  const isArmed = mode === "armed";
  const isResult = mode === "result";

  return (
    <div
      className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-2 overflow-hidden px-3 py-2"
      style={{ transform: flipped ? "rotate(180deg)" : undefined }}
    >
      <p className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-white/30">
        {category}
      </p>

      {/* Otázka je na oboch stranách, aby ju nemusel nikto čítať naopak. */}
      <div
        key={question}
        className="party-glass relative w-full shrink-0 overflow-hidden rounded-2xl border px-3 py-2.5 text-center"
        style={{
          background: isArmed ? `${color}1f` : "rgba(255,255,255,0.04)",
          borderColor: isArmed ? `${color}66` : "rgba(255,255,255,0.09)",
          transition: "background .25s ease, border-color .25s ease",
          animation: "popIn .4s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <p
          className="font-black leading-snug text-white"
          style={{ fontSize: "clamp(.95rem, 3.5vw, 1.3rem)" }}
        >
          {question}
        </p>
      </div>

      {/* Možnosti zostávajú viditeľné aj po bzučnutí — vyberá sa klikom priamo na ne. */}
      {options && (
        <div className="grid w-full shrink-0 grid-cols-2 gap-2">
          {options.map((option, index) => {
            const isCorrect = isResult && index === correctIndex;
            const isPicked = isResult && index === selectedIndex;

            let background = "rgba(255,255,255,0.05)";
            let borderColor = "rgba(255,255,255,0.1)";
            if (isCorrect) {
              background = "rgba(34,197,94,0.22)";
              borderColor = "rgba(34,197,94,0.6)";
            } else if (isPicked) {
              background = "rgba(239,68,68,0.22)";
              borderColor = "rgba(239,68,68,0.6)";
            } else if (isArmed) {
              background = `${color}1a`;
              borderColor = `${color}59`;
            }

            return (
              <button
                key={index}
                type="button"
                disabled={!isArmed}
                onClick={() => onSelect(index)}
                aria-label={`Možnosť ${LETTERS[index]}: ${option}`}
                className="flex min-h-[3.25rem] items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition enabled:active:scale-[.97] disabled:cursor-default"
                style={{
                  background,
                  borderColor,
                  opacity: mode === "waiting" ? 0.45 : 1,
                  boxShadow: isArmed ? `0 6px 18px -12px ${color}` : undefined,
                }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-black"
                  style={{
                    background: isArmed ? color : "rgba(255,255,255,0.1)",
                    color: isArmed ? "#08111d" : "rgba(255,255,255,0.55)",
                  }}
                >
                  {LETTERS[index]}
                </span>
                <span
                  className="flex-1 font-bold leading-tight text-white"
                  style={{ fontSize: "clamp(.7rem, 2.9vw, .95rem)" }}
                >
                  {option}
                </span>
                {isCorrect && <span className="shrink-0 text-sm">✅</span>}
                {isPicked && !isCorrect && (
                  <span className="shrink-0 text-sm">❌</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Bzučiak je len dovtedy, kým sa niekto neprihlási. */}
      {mode === "idle" && (
        <button
          type="button"
          onClick={onBuzz}
          aria-label={`${teamName} chce odpovedať`}
          className="group relative flex h-14 w-full shrink-0 items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/25 text-white transition active:scale-[.985] active:brightness-125"
          style={{
            background: `linear-gradient(120deg, ${color}dd, ${color}88)`,
            boxShadow: `0 10px 30px -14px ${color}`,
          }}
        >
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,.22),transparent_30%)]" />
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white/70 bg-white/15 transition group-active:scale-90">
            <span className="h-3.5 w-3.5 rounded-full bg-white/90" />
          </span>
          <span className="relative max-w-[11rem] truncate text-base font-black leading-none">
            {teamName}
          </span>
        </button>
      )}

      {mode === "armed" && (
        <p
          className="shrink-0 text-xs font-black uppercase tracking-widest"
          style={{ color }}
        >
          {options ? "Kliknite na odpoveď" : "Odpovedajte nahlas"}
        </p>
      )}

      {mode === "waiting" && (
        <p className="shrink-0 text-xs font-bold uppercase tracking-widest text-white/25">
          Odpovedá súper
        </p>
      )}

      {/* Vyhodnotenie aj tlačidlo sú na oboch stranách, aby ich nikto nečítal naopak. */}
      {mode === "result" && result && (
        <div className="flex w-full shrink-0 flex-col items-center gap-1.5">
          <p
            className="text-center text-xs font-black leading-tight"
            style={{ color: result.correct ? "#4ade80" : "#f87171" }}
          >
            {result.message}
          </p>
          <button
            type="button"
            onClick={onNext}
            className="w-full rounded-xl py-2.5 text-sm font-black text-white transition active:scale-95"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            Ďalšia otázka →
          </button>
        </div>
      )}
    </div>
  );
}

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
    setPhase({
      t: "mc-result",
      who,
      selectedIndex,
      correct,
      scores: newScores,
    });
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

  /** Tlačidlo „Ďalšia“ je na oboch stranách, preto sa dvojité posunutie musí ustrážiť. */
  function handleNext() {
    if (phase.t !== "mc-result") return;
    nextQuestion(phase.scores);
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

  /** Každá strana vie sama, či má bzučiak, aktívne možnosti alebo len výsledok. */
  function faceMode(team: 0 | 1): FaceMode {
    if (phase.t === "mc-result") return "result";
    if (phase.t === "selecting")
      return phase.who === team ? "armed" : "waiting";
    if (phase.t === "buzzed" || phase.t === "second-chance")
      return phase.who === team ? "armed" : "waiting";
    return "idle";
  }

  const activeTeam = getActiveTeam();
  const isOpenQuestion = !q.options;
  const hostControlsVisible =
    isOpenQuestion && (phase.t === "buzzed" || phase.t === "second-chance");

  const resultInfo =
    phase.t === "mc-result"
      ? {
          correct: phase.correct,
          message: phase.correct
            ? `+1 bod pre ${teamNames[phase.who]}!`
            : `Nesprávne — bod ide pre ${teamNames[phase.who === 0 ? 1 : 0]}.`,
        }
      : undefined;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 50% 30%, rgba(168,85,247,.15), transparent 45%), #070711",
        paddingTop: "max(.25rem, env(safe-area-inset-top))",
        paddingBottom: "max(.25rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="party-grid pointer-events-none absolute inset-0 opacity-20" />

      {/* Strana tímu A — otočená k hráčom sediacim oproti. */}
      <QuizFace
        flipped
        teamName={teamNames[0]}
        color={a}
        category={q.category}
        question={q.question}
        options={q.options}
        mode={faceMode(0)}
        correctIndex={q.correctIndex}
        selectedIndex={
          phase.t === "mc-result" ? phase.selectedIndex : undefined
        }
        result={resultInfo}
        onBuzz={() => buzz(0)}
        onSelect={selectAnswer}
        onNext={handleNext}
      />

      {/* Stredový pás: skóre a spoločné ovládanie. */}
      <div className="relative z-20 mx-3 shrink-0 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-1.5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          {([0, 1] as const).map(idx => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-xl px-2.5 py-1 font-black"
              style={{
                background: `${idx === 0 ? a : b}20`,
                border: `1px solid ${idx === 0 ? a : b}40`,
                outline:
                  activeTeam === idx
                    ? `2px solid ${idx === 0 ? a : b}`
                    : undefined,
                outlineOffset: "1px",
              }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: idx === 0 ? a : b }}
              />
              <span className="text-base text-white">{scores[idx]}</span>
            </div>
          ))}
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
            {qIdx + 1} / {QUESTIONS_PER_ROUND}
          </span>
        </div>

        {/* Otvorené otázky (bez možností) posudzuje moderátor. */}
        {hostControlsVisible && (
          <div
            className="mt-1.5 space-y-1.5"
            style={{ animation: "fadeIn .25s ease-out both" }}
          >
            {answerRevealed && (
              <p className="text-center text-sm font-black text-green-400">
                {q.answer}
              </p>
            )}
            {!answerRevealed ? (
              <button
                type="button"
                onClick={() => setAnswerRevealed(true)}
                className="w-full rounded-xl py-2.5 text-sm font-black text-white transition active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Icons.eye size={16} /> Ukázať správnu odpoveď
                </span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => markWrong(activeTeam!)}
                  className="flex-1 rounded-xl py-2.5 text-sm font-black text-white transition active:scale-95"
                  style={{ background: "#7c1a1a" }}
                >
                  ❌ Chyba
                </button>
                <button
                  type="button"
                  onClick={() => markCorrect(activeTeam!)}
                  className="flex-1 rounded-xl py-2.5 text-sm font-black text-white transition active:scale-95"
                  style={{ background: "#166534" }}
                >
                  ✅ Správne
                </button>
              </div>
            )}
          </div>
        )}

        {phase.t === "second-chance" && (
          <p className="mt-1 text-center text-[11px] font-bold text-white/45">
            Šanca pre{" "}
            <span style={{ color: phase.who === 0 ? a : b }}>
              {teamNames[phase.who]}
            </span>
          </p>
        )}
      </div>

      {/* Strana tímu B — v normálnej orientácii. */}
      <QuizFace
        flipped={false}
        teamName={teamNames[1]}
        color={b}
        category={q.category}
        question={q.question}
        options={q.options}
        mode={faceMode(1)}
        correctIndex={q.correctIndex}
        selectedIndex={
          phase.t === "mc-result" ? phase.selectedIndex : undefined
        }
        result={resultInfo}
        onBuzz={() => buzz(1)}
        onSelect={selectAnswer}
        onNext={handleNext}
      />
    </div>
  );
}
