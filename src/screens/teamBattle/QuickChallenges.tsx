import { useEffect, useMemo, useState } from "react";
import { shuffle } from "../../data/teamBattle";
import { FIVE_IN_TEN_PROMPTS, LETTER_CHALLENGES } from "../../data/teamBattleExtras";
import { CircularTimer, ParticipantScoreStrip, PartyBackdrop, PartyEyebrow } from "./PartyChrome";
import { makeEmptyScores, PARTY_PLAYER_COLORS, type QuickParticipantsProps } from "./quickGameShared";

const LETTER_TURNS = 10;
const FIVE_TURNS = 6;

export function LetterChallengeGame({ participantNames, gameMode, onDone }: QuickParticipantsProps) {
  const deck = useMemo(() => shuffle(LETTER_CHALLENGES).slice(0, Math.max(LETTER_TURNS, participantNames.length * 2)), [participantNames.length]);
  const [turn, setTurn] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [phase, setPhase] = useState<"ready" | "playing" | "feedback">("ready");
  const [scores, setScores] = useState<number[]>(() => makeEmptyScores(participantNames));
  const [feedback, setFeedback] = useState<{ success: boolean; scorer: number | null } | null>(null);
  const activeParticipant = turn % participantNames.length;
  const activeColor = PARTY_PLAYER_COLORS[activeParticipant % PARTY_PLAYER_COLORS.length];
  const challenge = deck[turn];

  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      finish(false);
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [phase, timeLeft]);

  function start() {
    setTimeLeft(5);
    setFeedback(null);
    setPhase("playing");
  }

  function finish(success: boolean) {
    if (phase !== "playing") return;
    const scorer = success ? activeParticipant : gameMode === "teams" && participantNames.length === 2 ? 1 - activeParticipant : null;
    const nextScores = [...scores];
    if (scorer !== null) nextScores[scorer] += 1;
    setScores(nextScores);
    setFeedback({ success, scorer });
    setPhase("feedback");
    navigator.vibrate?.(success ? 30 : 60);
    window.setTimeout(() => {
      if (turn + 1 >= deck.length) onDone(nextScores);
      else {
        setTurn((value) => value + 1);
        setPhase("ready");
      }
    }, 1200);
  }

  return (
    <PartyBackdrop>
      <main className="flex h-full flex-col overflow-y-auto px-4 pb-6 pt-5 text-center">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <ParticipantScoreStrip names={participantNames} scores={scores} colors={PARTY_PLAYER_COLORS} activeIndex={activeParticipant} />
          <div className="mt-5 flex items-center justify-between">
            <PartyEyebrow>Slovo na písmeno</PartyEyebrow>
            <span className="text-[10px] font-black text-white/30">{turn + 1}/{deck.length}</span>
          </div>

          <section className="party-glass relative mt-5 flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[2.2rem] px-6 py-8">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />
            {phase === "feedback" && feedback ? (
              <div style={{ animation: "popIn .3s ease-out both" }}>
                <div className="text-7xl">{feedback.success ? "✅" : "⌛"}</div>
                <h1 className="mt-5 text-3xl font-black text-white">{feedback.success ? "Platná odpoveď!" : "Čas vypršal!"}</h1>
                <p className="mt-2 text-sm font-bold" style={{ color: feedback.scorer === null ? "rgba(255,255,255,.4)" : PARTY_PLAYER_COLORS[feedback.scorer % PARTY_PLAYER_COLORS.length] }}>{feedback.scorer === null ? "Bez bodu" : `+1 bod pre ${participantNames[feedback.scorer]}`}</p>
              </div>
            ) : (
              <>
                <CircularTimer value={timeLeft} total={5} color={timeLeft <= 2 ? "#ef4444" : "#fbbf24"} size={104} />
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.24em] text-white/35">{challenge.category} na písmeno</p>
                <div className="mt-4 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-amber-300/25 bg-amber-400/10 text-7xl font-black text-amber-200 shadow-[0_0_55px_rgba(251,191,36,.2)]">{challenge.letter}</div>
                <h1 className="mt-6 text-2xl font-black text-white">{participantNames[activeParticipant]} odpovedá</h1>
                <p className="mt-2 text-xs text-white/35">Povedzte jedno platné slovo skôr, než vyprší 5 sekúnd.</p>
              </>
            )}
          </section>

          <div className="mt-4">
            {phase === "ready" && <button onClick={start} className="party-shine w-full overflow-hidden rounded-2xl py-5 text-base font-black text-white shadow-xl transition active:scale-95" style={{ background: `linear-gradient(135deg, ${activeColor}, #f59e0b)` }}>Spustiť 5 sekúnd</button>}
            {phase === "playing" && <button onClick={() => finish(true)} className="party-shine w-full overflow-hidden rounded-2xl bg-emerald-600 py-5 text-base font-black text-white shadow-xl transition active:scale-95">✓ Odpovedal správne</button>}
            {phase === "feedback" && <div className="h-[3.75rem]" />}
          </div>
        </div>
      </main>
    </PartyBackdrop>
  );
}

export function FiveInTenGame({ participantNames, onDone }: QuickParticipantsProps) {
  const prompts = useMemo(() => shuffle(FIVE_IN_TEN_PROMPTS).slice(0, Math.max(FIVE_TURNS, participantNames.length * 2)), [participantNames.length]);
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<"ready" | "playing" | "result">("ready");
  const [timeLeft, setTimeLeft] = useState(10);
  const [count, setCount] = useState(0);
  const [scores, setScores] = useState<number[]>(() => makeEmptyScores(participantNames));
  const [success, setSuccess] = useState(false);
  const activeParticipant = turn % participantNames.length;
  const activeColor = PARTY_PLAYER_COLORS[activeParticipant % PARTY_PLAYER_COLORS.length];

  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      finish(false);
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [phase, timeLeft]);

  function start() {
    setCount(0);
    setTimeLeft(10);
    setSuccess(false);
    setPhase("playing");
  }

  function addItem() {
    if (phase !== "playing") return;
    if (count >= 4) {
      setCount(5);
      finish(true);
    } else {
      setCount((value) => value + 1);
      navigator.vibrate?.(15);
    }
  }

  function finish(completed: boolean) {
    if (phase !== "playing") return;
    const nextScores = [...scores];
    if (completed) nextScores[activeParticipant] += 2;
    setScores(nextScores);
    setSuccess(completed);
    setPhase("result");
    navigator.vibrate?.(completed ? [30, 40, 30] : 60);
  }

  function next() {
    if (turn + 1 >= prompts.length) onDone(scores);
    else {
      setTurn((value) => value + 1);
      setPhase("ready");
    }
  }

  return (
    <PartyBackdrop>
      <main className="flex h-full flex-col overflow-y-auto px-4 pb-6 pt-5 text-center">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <ParticipantScoreStrip names={participantNames} scores={scores} colors={PARTY_PLAYER_COLORS} activeIndex={activeParticipant} />
          <div className="mt-5 flex items-center justify-between">
            <PartyEyebrow>5 za 10</PartyEyebrow>
            <span className="text-[10px] font-black text-white/30">Výzva {turn + 1}/{prompts.length}</span>
          </div>

          <section className="party-glass relative mt-5 flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[2.2rem] px-6 py-7">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />
            {phase === "result" ? (
              <div style={{ animation: "popIn .3s ease-out both" }}>
                <div className="text-7xl">{success ? "🏆" : "⏱️"}</div>
                <h1 className="mt-5 text-3xl font-black text-white">{success ? "Všetkých päť!" : "Tentoraz nie"}</h1>
                <p className="mt-2 text-sm font-bold" style={{ color: success ? activeColor : "rgba(255,255,255,.4)" }}>{success ? `+2 body pre ${participantNames[activeParticipant]}` : `${count} z 5 odpovedí`}</p>
              </div>
            ) : (
              <>
                <CircularTimer value={timeLeft} total={10} color={timeLeft <= 3 ? "#ef4444" : "#34d399"} size={104} />
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300/65">Vymenuj 5</p>
                <h1 className="mx-auto mt-3 max-w-sm text-3xl font-black leading-tight text-white">{prompts[turn]}</h1>
                <div className="mt-6 flex gap-2">
                  {Array.from({ length: 5 }, (_, index) => <span key={index} className={`h-4 w-4 rounded-full border transition-all ${index < count ? "scale-110 border-emerald-300 bg-emerald-400 shadow-[0_0_14px_#34d399]" : "border-white/15 bg-white/[0.04]"}`} />)}
                </div>
                <p className="mt-4 text-sm font-black" style={{ color: activeColor }}>{participantNames[activeParticipant]}</p>
              </>
            )}
          </section>

          <div className="mt-4">
            {phase === "ready" && <button onClick={start} className="party-shine w-full overflow-hidden rounded-2xl py-5 text-base font-black text-white shadow-xl transition active:scale-95" style={{ background: `linear-gradient(135deg, ${activeColor}, #10b981)` }}>Spustiť 10 sekúnd</button>}
            {phase === "playing" && (
              <div className="grid grid-cols-[.7fr_1.3fr] gap-3">
                <button onClick={() => setCount((value) => Math.max(0, value - 1))} className="party-glass rounded-2xl py-5 text-xl font-black text-white/55 transition active:scale-95">−</button>
                <button onClick={addItem} className="party-shine overflow-hidden rounded-2xl bg-emerald-600 py-5 text-base font-black text-white shadow-xl transition active:scale-95">+ Ďalšia odpoveď</button>
              </div>
            )}
            {phase === "result" && <button onClick={next} className="party-shine w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-5 text-base font-black text-white shadow-xl transition active:scale-95">{turn + 1 >= prompts.length ? "Výsledok kola" : "Ďalšia výzva"}</button>}
          </div>
        </div>
      </main>
    </PartyBackdrop>
  );
}
