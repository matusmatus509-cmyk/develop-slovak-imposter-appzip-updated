import { useEffect, useMemo, useRef, useState } from "react";
import { shuffle } from "../../data/teamBattle";
import { FIVE_IN_TEN_PROMPTS, LETTER_CHALLENGES } from "../../data/teamBattleExtras";
import { CircularTimer, ParticipantScoreStrip, PartyBackdrop, PartyEyebrow } from "./PartyChrome";
import { makeEmptyScores, PARTY_PLAYER_COLORS, type QuickParticipantsProps } from "./quickGameShared";

const LETTER_TURNS = 10;
const FIVE_TURNS = 6;

type RoundPhase = "ready" | "playing" | "result";

function useSmoothTimer(totalSeconds: number, active: boolean, onExpire: () => void) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const deadlineRef = useRef(0);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  function arm() {
    deadlineRef.current = Date.now() + totalSeconds * 1000;
    setRemaining(totalSeconds);
  }

  useEffect(() => {
    if (!active || deadlineRef.current === 0) return;
    let timeout = 0;

    const tick = () => {
      const next = Math.max(0, (deadlineRef.current - Date.now()) / 1000);
      setRemaining(next);
      if (next <= 0) {
        deadlineRef.current = 0;
        onExpireRef.current();
        return;
      }
      timeout = window.setTimeout(tick, 80);
    };

    tick();
    return () => window.clearTimeout(timeout);
  }, [active]);

  return { remaining, arm };
}

function RoundProgress({ current, total, color }: { current: number; total: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Kolo ${current + 1} z ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 rounded-full transition-all duration-500 ${index === current ? "w-6" : "w-1.5"}`}
          style={{ background: index <= current ? color : "rgba(255,255,255,.12)" }}
        />
      ))}
    </div>
  );
}

function PlayerTurnCard({ name, color, label }: { name: string; color: string; label: string }) {
  return (
    <div
      className="animate-pop-in relative w-full overflow-hidden rounded-[2rem] border px-5 py-7"
      style={{
        borderColor: `${color}55`,
        background: `linear-gradient(145deg, ${color}2f, rgba(9,12,20,.92) 72%)`,
        boxShadow: `0 24px 70px ${color}1f, inset 0 1px 0 rgba(255,255,255,.09)`,
      }}
    >
      <div className="absolute -right-5 -top-8 text-9xl font-black opacity-[.06]">?</div>
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">{label}</p>
      <h1 className="mt-3 truncate text-4xl font-black text-white">{name}</h1>
      <p className="mt-3 text-sm leading-relaxed text-white/45">Zadanie sa ukáže až po spustení času. Priprav sa!</p>
    </div>
  );
}

export function LetterChallengeGame({ participantNames, gameMode, onDone }: QuickParticipantsProps) {
  const deck = useMemo(
    () => shuffle(LETTER_CHALLENGES).slice(0, Math.max(LETTER_TURNS, participantNames.length * 2)),
    [participantNames.length],
  );
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<RoundPhase>("ready");
  const [scores, setScores] = useState<number[]>(() => makeEmptyScores(participantNames));
  const [feedback, setFeedback] = useState<{ success: boolean; scorer: number | null } | null>(null);
  const activeParticipant = turn % participantNames.length;
  const activeColor = PARTY_PLAYER_COLORS[activeParticipant % PARTY_PLAYER_COLORS.length];
  const challenge = deck[turn];

  function finish(success: boolean) {
    if (phase !== "playing") return;
    const scorer = success
      ? activeParticipant
      : gameMode === "teams" && participantNames.length === 2
        ? 1 - activeParticipant
        : null;
    const nextScores = [...scores];
    if (scorer !== null) nextScores[scorer] += 1;
    setScores(nextScores);
    setFeedback({ success, scorer });
    setPhase("result");
    navigator.vibrate?.(success ? [25, 35, 25] : 70);
  }

  const timer = useSmoothTimer(5, phase === "playing", () => finish(false));

  function start() {
    setFeedback(null);
    timer.arm();
    setPhase("playing");
    navigator.vibrate?.(18);
  }

  function next() {
    if (turn + 1 >= deck.length) {
      onDone(scores);
      return;
    }
    setTurn((value) => value + 1);
    setFeedback(null);
    setPhase("ready");
  }

  return (
    <PartyBackdrop>
      <main className="flex h-full flex-col overflow-y-auto px-4 pb-6 pt-5 text-center">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <ParticipantScoreStrip names={participantNames} scores={scores} colors={PARTY_PLAYER_COLORS} activeIndex={activeParticipant} />

          <div className="mt-5 flex items-center justify-between gap-3">
            <PartyEyebrow>Slovo na písmeno</PartyEyebrow>
            <RoundProgress current={turn} total={deck.length} color="#fbbf24" />
          </div>

          <section className="party-glass relative mt-4 flex min-h-[24rem] flex-1 flex-col items-center justify-center overflow-hidden rounded-[2.4rem] px-5 py-7">
            <div className="pointer-events-none absolute -left-20 top-16 h-52 w-52 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-5 h-52 w-52 rounded-full bg-orange-500/10 blur-3xl" />
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />

            {phase === "ready" && (
              <PlayerTurnCard name={participantNames[activeParticipant]} color={activeColor} label={`Na rade • kolo ${turn + 1}`} />
            )}

            {phase === "playing" && (
              <div key={turn} className="animate-pop-in flex w-full flex-col items-center">
                <CircularTimer value={timer.remaining} total={5} color={timer.remaining <= 2 ? "#fb7185" : "#fbbf24"} size={118} />
                <p className="mt-6 text-[11px] font-black uppercase tracking-[0.25em] text-amber-200/65">{challenge.category}</p>
                <div className="relative mt-4 flex h-32 w-32 items-center justify-center rounded-[2.3rem] border border-amber-200/35 bg-gradient-to-br from-amber-300 to-orange-500 text-8xl font-black text-[#211105] shadow-[0_20px_60px_rgba(251,191,36,.3)]">
                  {challenge.letter}
                  <span className="absolute -right-2 -top-2 rounded-full border border-white/20 bg-[#11131d] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white">písmeno</span>
                </div>
                <h1 className="mt-5 text-2xl font-black text-white">{participantNames[activeParticipant]}, povedz slovo!</h1>
                <p className="mt-2 text-xs text-white/40">Jedno platné slovo z kategórie, ktoré začína týmto písmenom.</p>
              </div>
            )}

            {phase === "result" && feedback && (
              <div className="animate-pop-in relative z-10">
                <div className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full border text-6xl ${feedback.success ? "border-emerald-300/40 bg-emerald-400/15" : "border-rose-300/35 bg-rose-400/10"}`}>
                  {feedback.success ? "🎉" : "⏳"}
                </div>
                <h1 className="mt-5 text-3xl font-black text-white">{feedback.success ? "Super odpoveď!" : "Kolo končí"}</h1>
                <p className="mt-2 text-sm font-bold" style={{ color: feedback.scorer === null ? "rgba(255,255,255,.4)" : PARTY_PLAYER_COLORS[feedback.scorer % PARTY_PLAYER_COLORS.length] }}>
                  {feedback.scorer === null ? "Tentoraz bez bodu" : `+1 bod pre ${participantNames[feedback.scorer]}`}
                </p>
              </div>
            )}
          </section>

          <div className="mt-4 min-h-[4.1rem]">
            {phase === "ready" && (
              <button onClick={start} className="party-shine w-full overflow-hidden rounded-2xl py-5 text-base font-black text-white shadow-xl transition active:scale-95" style={{ background: `linear-gradient(135deg, ${activeColor}, #f59e0b)` }}>
                ⚡ Odhaliť zadanie a spustiť
              </button>
            )}
            {phase === "playing" && (
              <div className="grid grid-cols-[.8fr_1.2fr] gap-3">
                <button onClick={() => finish(false)} className="party-glass rounded-2xl py-5 text-sm font-black text-rose-200 transition active:scale-95">✕ Neplatí</button>
                <button onClick={() => finish(true)} className="party-shine overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 py-5 text-base font-black text-white shadow-xl transition active:scale-95">✓ Správne!</button>
              </div>
            )}
            {phase === "result" && (
              <button onClick={next} className="party-shine w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-5 text-base font-black text-white shadow-xl transition active:scale-95">
                {turn + 1 >= deck.length ? "Pozrieť výsledky" : "Ďalší hráč →"}
              </button>
            )}
          </div>
        </div>
      </main>
    </PartyBackdrop>
  );
}

export function FiveInTenGame({ participantNames, onDone }: QuickParticipantsProps) {
  const prompts = useMemo(
    () => shuffle(FIVE_IN_TEN_PROMPTS).slice(0, Math.max(FIVE_TURNS, participantNames.length * 2)),
    [participantNames.length],
  );
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<RoundPhase>("ready");
  const [count, setCount] = useState(0);
  const [scores, setScores] = useState<number[]>(() => makeEmptyScores(participantNames));
  const [success, setSuccess] = useState(false);
  const activeParticipant = turn % participantNames.length;
  const activeColor = PARTY_PLAYER_COLORS[activeParticipant % PARTY_PLAYER_COLORS.length];

  function finish(completed: boolean) {
    if (phase !== "playing") return;
    const nextScores = [...scores];
    if (completed) nextScores[activeParticipant] += 2;
    setScores(nextScores);
    setSuccess(completed);
    setPhase("result");
    navigator.vibrate?.(completed ? [30, 35, 30, 35, 50] : 70);
  }

  const timer = useSmoothTimer(10, phase === "playing", () => finish(false));

  function start() {
    setCount(0);
    setSuccess(false);
    timer.arm();
    setPhase("playing");
    navigator.vibrate?.(18);
  }

  function addItem() {
    if (phase !== "playing") return;
    const nextCount = Math.min(5, count + 1);
    setCount(nextCount);
    navigator.vibrate?.(nextCount === 5 ? [25, 25, 45] : 15);
    if (nextCount === 5) finish(true);
  }

  function removeItem() {
    if (phase !== "playing") return;
    setCount((value) => Math.max(0, value - 1));
  }

  function next() {
    if (turn + 1 >= prompts.length) {
      onDone(scores);
      return;
    }
    setTurn((value) => value + 1);
    setCount(0);
    setPhase("ready");
  }

  return (
    <PartyBackdrop>
      <main className="flex h-full flex-col overflow-y-auto px-4 pb-6 pt-5 text-center">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <ParticipantScoreStrip names={participantNames} scores={scores} colors={PARTY_PLAYER_COLORS} activeIndex={activeParticipant} />

          <div className="mt-5 flex items-center justify-between gap-3">
            <PartyEyebrow>5 za 10</PartyEyebrow>
            <RoundProgress current={turn} total={prompts.length} color="#34d399" />
          </div>

          <section className="party-glass relative mt-4 flex min-h-[24rem] flex-1 flex-col items-center justify-center overflow-hidden rounded-[2.4rem] px-5 py-7">
            <div className="pointer-events-none absolute -left-20 bottom-10 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 top-16 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent" />

            {phase === "ready" && (
              <PlayerTurnCard name={participantNames[activeParticipant]} color={activeColor} label={`Nová výzva • ${turn + 1}/${prompts.length}`} />
            )}

            {phase === "playing" && (
              <div key={turn} className="animate-pop-in flex w-full flex-col items-center">
                <div className="flex w-full items-center justify-center gap-5">
                  <CircularTimer value={timer.remaining} total={10} color={timer.remaining <= 3 ? "#fb7185" : "#34d399"} size={112} />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">Odpovede</p>
                    <p className="mt-1 text-5xl font-black tabular-nums text-emerald-300">{count}<span className="text-2xl text-white/25">/5</span></p>
                  </div>
                </div>

                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.26em] text-emerald-300/65">Vymenuj päť</p>
                <h1 className="mx-auto mt-3 max-w-sm text-3xl font-black leading-[1.08] text-white">{prompts[turn]}</h1>

                <div className="mt-7 grid w-full grid-cols-5 gap-2">
                  {Array.from({ length: 5 }, (_, index) => {
                    const completed = index < count;
                    return (
                      <span
                        key={index}
                        className={`flex aspect-square items-center justify-center rounded-2xl border text-lg font-black transition-all duration-300 ${completed ? "scale-105 border-emerald-200/60 bg-gradient-to-br from-emerald-400 to-teal-500 text-[#06221a] shadow-[0_10px_28px_rgba(52,211,153,.28)]" : "border-white/10 bg-white/[0.04] text-white/25"}`}
                      >
                        {completed ? "✓" : index + 1}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {phase === "result" && (
              <div className="animate-pop-in relative z-10">
                <div className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full border text-6xl ${success ? "border-emerald-300/45 bg-emerald-400/15" : "border-amber-300/35 bg-amber-400/10"}`}>
                  {success ? "🏆" : "⏱️"}
                </div>
                <h1 className="mt-5 text-3xl font-black text-white">{success ? "Päť z piatich!" : "Tesne vedľa!"}</h1>
                <p className="mt-2 text-sm font-bold" style={{ color: success ? activeColor : "rgba(255,255,255,.45)" }}>
                  {success ? `+2 body pre ${participantNames[activeParticipant]}` : `${count} z 5 odpovedí • skúsime ďalšiu`}
                </p>
              </div>
            )}
          </section>

          <div className="mt-4 min-h-[4.1rem]">
            {phase === "ready" && (
              <button onClick={start} className="party-shine w-full overflow-hidden rounded-2xl py-5 text-base font-black text-white shadow-xl transition active:scale-95" style={{ background: `linear-gradient(135deg, ${activeColor}, #10b981)` }}>
                🚀 Odhaliť výzvu a spustiť
              </button>
            )}
            {phase === "playing" && (
              <div className="grid grid-cols-[.65fr_1.35fr] gap-3">
                <button onClick={removeItem} disabled={count === 0} className="party-glass rounded-2xl py-5 text-2xl font-black text-white/60 transition active:scale-95 disabled:opacity-30">−</button>
                <button onClick={addItem} className="party-shine overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 py-5 text-base font-black text-white shadow-xl transition active:scale-95">+ Mám odpoveď!</button>
              </div>
            )}
            {phase === "result" && (
              <button onClick={next} className="party-shine w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-5 text-base font-black text-white shadow-xl transition active:scale-95">
                {turn + 1 >= prompts.length ? "Pozrieť výsledky" : "Ďalšia výzva →"}
              </button>
            )}
          </div>
        </div>
      </main>
    </PartyBackdrop>
  );
}
