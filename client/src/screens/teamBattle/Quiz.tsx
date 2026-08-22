import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { TEAM_COLORS } from "../../data/teamBattle";
import { Icons } from "../../components/icons";
import type {
  ResolvedClassicQuestion,
  ResolvedNumericQuestion,
  ResolvedQuizDuelQuestion,
} from "../../data/quizDuel";
import {
  buildQuizDuelPlan,
  createQuizDuelState,
  formatQuizNumber,
  guessDistance,
  higherLowerTruth,
  otherTeam,
  parseGuessInput,
  quizDuelReducer,
  type QuizDuelAction,
  type QuizDuelPlan,
  type QuizDuelReason,
  type QuizDuelState,
  type TeamIndex,
  type Verdict,
  type Wager,
} from "./quizDuelRound";

const LETTERS = ["A", "B", "C", "D"] as const;
const BRIEF_DURATION_MS = 4200;

/** Popis typu kola pre hlavičku aj pre úvodné vysvetlenie. */
const KIND_INFO: Record<
  ResolvedQuizDuelQuestion["kind"],
  { label: string; rule: string; icon: string }
> = {
  classic: { label: "Klasická otázka", rule: "Obaja vyberte odpoveď", icon: "🧠" },
  estimate: { label: "Tipni číslo", rule: "Tip, potom VIAC/MENEJ", icon: "🎯" },
  closest: { label: "Najbližší tip", rule: "Obaja tajne tipnite", icon: "📏" },
  "higher-lower": { label: "Viac či menej", rule: "Je to viac alebo menej?", icon: "⚖️" },
};

/** Krátke, aby sa vo výsledku nezmestil odsek textu. */
const REASON_TEXT: Record<QuizDuelReason, string> = {
  correct: "Správne",
  wrong: "Nesprávne",
  "no-answer": "Bez odpovede",
  "verdict-correct": "Uhádli ste",
  "verdict-wrong": "Netrafili ste",
  "estimate-defended": "Súper sa pomýlil",
  "estimate-beaten": "Súper vás prečítal",
  "estimate-exact": "Presný zásah!",
  "estimate-void": "Tip bol presný",
  "closest-win": "Boli ste bližšie",
  "closest-lose": "Súper bol bližšie",
  "closest-tie": "Rovnako blízko",
  "closest-exact": "Presný zásah!",
};

function deltaLabel(delta: number) {
  if (delta > 0) return `+${delta}`;
  if (delta < 0) return `−${Math.abs(delta)}`;
  return "0";
}

// ── Malé stavebné prvky ──────────────────────────────────────────────────────

function QuestionCard({
  text,
  large,
  accent,
}: {
  text: string;
  large?: boolean;
  accent?: string;
}) {
  return (
    <div
      key={text}
      className="party-glass flex w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border px-3 text-center"
      style={{
        padding: large ? "1.25rem .9rem" : ".5rem .7rem",
        background: accent ? `${accent}1a` : "rgba(255,255,255,0.04)",
        borderColor: accent ? `${accent}55` : "rgba(255,255,255,0.09)",
        animation: "popIn .35s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
    >
      <p
        className="font-black leading-snug text-white"
        style={{
          fontSize: large
            ? "clamp(1.15rem, 4.6vw, 1.7rem)"
            : "clamp(.8rem, 3.1vw, 1.1rem)",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function WaitingNote({ text }: { text: string }) {
  return (
    <p className="shrink-0 text-center text-[11px] font-bold uppercase tracking-widest text-white/30">
      {text}
    </p>
  );
}

function BigChoiceButton({
  label,
  hint,
  color,
  selected,
  dimmed,
  disabled,
  onClick,
}: {
  label: string;
  hint?: string;
  color: string;
  selected?: boolean;
  dimmed?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex min-h-[min(3rem,7.5dvh)] flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl border px-2 py-2 transition enabled:active:scale-[.97] disabled:cursor-default"
      style={{
        background: selected ? `${color}33` : "rgba(255,255,255,0.05)",
        borderColor: selected ? `${color}cc` : "rgba(255,255,255,0.12)",
        opacity: dimmed ? 0.35 : 1,
        boxShadow: selected ? `0 8px 24px -14px ${color}` : undefined,
      }}
    >
      <span
        className="text-sm font-black leading-none text-white"
        style={{ fontSize: "clamp(.85rem, 3.4vw, 1.05rem)" }}
      >
        {label}
      </span>
      {hint && (
        <span className="text-[9px] font-bold uppercase tracking-wider text-white/45">
          {hint}
        </span>
      )}
    </button>
  );
}

/** Číselná klávesnica. Na spoločnom telefóne je to jediný rozumný vstup. */
function NumberPad({
  value,
  unit,
  color,
  onChange,
  onSubmit,
}: {
  value: string;
  unit: string;
  color: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
}) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ",", "⌫"];
  const ready = parseGuessInput(value) !== null;

  function press(key: string) {
    if (key === "⌫") {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === "," && (value.includes(",") || !value)) return;
    if (value.replace(/[^0-9]/g, "").length >= 9) return;
    onChange(value + key);
  }

  return (
    <div className="flex w-full min-h-0 flex-1 flex-col gap-1.5">
      {/* Jednotka je vo farbe tímu a nikdy sa neskracuje — hráč musí okamžite
          vedieť, v čom má tipovať (litry, km, °C…). */}
      <div
        className="flex shrink-0 flex-col items-center gap-0.5 rounded-2xl border px-3 py-1.5"
        style={{ borderColor: `${color}55`, background: `${color}12` }}
      >
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
          Váš tip
        </p>
        <div className="flex w-full items-baseline justify-center gap-1.5">
          <span
            className="font-black tabular-nums leading-none"
            style={{
              fontSize: "clamp(1.25rem, 5.6vw, 1.9rem)",
              color: value ? "#ffffff" : "rgba(255,255,255,.28)",
            }}
          >
            {value || "0"}
          </span>
          <span
            className="text-[11px] font-black uppercase leading-tight tracking-wider"
            style={{ color }}
          >
            {unit}
          </span>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-4 gap-1.5">
        {keys.map(key => (
          <button
            key={key}
            type="button"
            onClick={() => press(key)}
            aria-label={key === "⌫" ? "Zmazať číslicu" : key}
            className="min-h-[min(2.3rem,5dvh)] rounded-xl border border-white/10 bg-white/[0.06] text-base font-black text-white transition active:scale-95"
          >
            {key}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!ready}
        onClick={onSubmit}
        className="min-h-[min(2.6rem,5.5dvh)] shrink-0 rounded-xl text-sm font-black text-white transition active:scale-95 disabled:opacity-35"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
      >
        Potvrdiť tip
      </button>
    </div>
  );
}

// ── Jedna strana obrazovky ───────────────────────────────────────────────────

interface FaceProps {
  flipped: boolean;
  team: TeamIndex;
  teamName: string;
  color: string;
  plan: QuizDuelPlan;
  state: QuizDuelState;
  draft: string;
  onDraft: (next: string) => void;
  dispatch: (action: QuizDuelAction) => void;
}

function QuizFace({
  flipped,
  team,
  teamName,
  color,
  plan,
  state,
  draft,
  onDraft,
  dispatch,
}: FaceProps) {
  const slot = plan[state.slot];
  const question = slot.question;
  const info = KIND_INFO[question.kind];
  const opponent = otherTeam(team);
  const stage = state.stage;

  return (
    <div
      className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-1.5 overflow-hidden px-3 py-1.5"
      style={{ transform: flipped ? "rotate(180deg)" : undefined }}
    >
      <div className="flex w-full shrink-0 items-center justify-between gap-2">
        <p className="truncate text-[9px] font-bold uppercase tracking-widest text-white/30">
          {question.topicLabel}
        </p>
        <p
          className="shrink-0 text-[9px] font-black uppercase tracking-widest"
          style={{ color }}
        >
          {info.icon} {info.label}
        </p>
      </div>

      {/* ── Predstavenie otázky ─────────────────────────────────────────── */}
      {stage.t === "brief" && (
        <>
          {/* Tvrdenie pri „Viac či menej“ je už súčasťou otázky, takže sa
              nikde nezdvojuje. */}
          <QuestionCard text={question.prompt} large />
          <p className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-white/35">
            {info.rule}
          </p>
          <div className="quiz-reveal-bar-wrapper shrink-0">
            <div className="quiz-reveal-bar" />
          </div>
          <button
            type="button"
            onClick={() => dispatch({ t: "start" })}
            aria-label={`${teamName} je pripravený`}
            className="group relative flex h-11 w-full shrink-0 items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/25 text-white transition active:scale-[.985]"
            style={{
              background: `linear-gradient(120deg, ${color}dd, ${color}77)`,
              boxShadow: `0 10px 26px -16px ${color}`,
            }}
          >
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/70 bg-white/15 transition group-active:scale-90">
              <span className="h-2 w-2 rounded-full bg-white/90" />
            </span>
            <span className="relative truncate text-sm font-black leading-none">
              Sme pripravení
            </span>
          </button>
        </>
      )}

      {/* ── ISTOTA / RISK ───────────────────────────────────────────────── */}
      {stage.t === "wager" && (
        <>
          <QuestionCard text={question.prompt} />
          <p className="shrink-0 text-center text-[10px] font-black uppercase tracking-widest text-amber-300/80">
            Koľko si vsadíte?
          </p>
          <div className="flex w-full shrink-0 gap-2">
            <BigChoiceButton
              label="ISTOTA"
              hint="+1 bod"
              color="#34d399"
              selected={state.wagers[team] === "istota"}
              dimmed={state.wagers[team] === "risk"}
              disabled={state.wagers[team] !== null}
              onClick={() => dispatch({ t: "wager", team, value: "istota" })}
            />
            <BigChoiceButton
              label="RISK"
              hint="+2 body / −1"
              color="#fb7185"
              selected={state.wagers[team] === "risk"}
              dimmed={state.wagers[team] === "istota"}
              disabled={state.wagers[team] !== null}
              onClick={() => dispatch({ t: "wager", team, value: "risk" })}
            />
          </div>
          <WaitingNote
            text={
              state.wagers[team] === null
                ? "Vyberte si stávku"
                : "Čakáme na súpera…"
            }
          />
        </>
      )}

      {/* ── Klasická otázka: 4 možnosti ─────────────────────────────────── */}
      {stage.t === "answer" && question.kind === "classic" && (
        <ClassicOptions
          question={question}
          color={color}
          picked={state.picks[team]}
          onPick={index => dispatch({ t: "pick", team, index })}
        />
      )}

      {/* ── Viac / menej ────────────────────────────────────────────────── */}
      {stage.t === "answer" && question.kind === "higher-lower" && (
        <>
          <QuestionCard text={question.prompt} />
          <div className="flex w-full shrink-0 gap-2">
            <BigChoiceButton
              label="↑ VIAC"
              color="#4ade80"
              selected={state.verdicts[team] === "viac"}
              dimmed={state.verdicts[team] === "menej"}
              disabled={state.verdicts[team] !== null}
              onClick={() => dispatch({ t: "verdict", team, value: "viac" })}
            />
            <BigChoiceButton
              label="↓ MENEJ"
              color="#60a5fa"
              selected={state.verdicts[team] === "menej"}
              dimmed={state.verdicts[team] === "viac"}
              disabled={state.verdicts[team] !== null}
              onClick={() => dispatch({ t: "verdict", team, value: "menej" })}
            />
          </div>
          <WaitingNote
            text={
              state.verdicts[team] === null
                ? "Rozhodnite sa"
                : "Odpoveď uzamknutá — čakáme na súpera…"
            }
          />
        </>
      )}

      {/* ── Zadávanie čísla ─────────────────────────────────────────────── */}
      {stage.t === "guess" && stage.team === team && question.kind !== "classic" && (
        <>
          <QuestionCard text={question.prompt} />
          <NumberPad
            value={draft}
            unit={question.unit}
            color={color}
            onChange={onDraft}
            onSubmit={() => {
              const value = parseGuessInput(draft);
              if (value === null) return;
              dispatch({ t: "guess", team, value });
            }}
          />
        </>
      )}

      {stage.t === "guess" && stage.team !== team && (
        <HiddenPanel
          title={
            state.guesses[team] === null
              ? "Súper zadáva svoj tip"
              : "Tip uložený — nekukajte!"
          }
          detail={
            question.kind === "closest"
              ? "Váš tip zostáva skrytý, kým netipne aj súper."
              : "Potom rozhodnete VIAC alebo MENEJ."
          }
        />
      )}

      {/* ── Rozhodovanie VIAC / MENEJ po tipe súpera ────────────────────── */}
      {stage.t === "decide" && question.kind !== "classic" && (
        <DecidePanel
          question={question}
          isDecider={slot.firstTeam !== team}
          guess={state.guesses[slot.firstTeam]}
          onDecide={value => dispatch({ t: "decide", value })}
        />
      )}

      {/* ── Odhalenie ───────────────────────────────────────────────────── */}
      {stage.t === "reveal" && state.outcome && (
        <RevealPanel
          question={question}
          teamName={teamName}
          color={color}
          opponentGuess={state.guesses[opponent]}
          myGuess={state.guesses[team]}
          myPick={state.picks[team]}
          myVerdict={state.verdicts[team]}
          wager={state.wagers[team]}
          result={state.outcome.results[team]}
          onNext={() => dispatch({ t: "next" })}
        />
      )}
    </div>
  );
}

function ClassicOptions({
  question,
  color,
  picked,
  onPick,
}: {
  question: ResolvedClassicQuestion;
  color: string;
  picked: number | null;
  onPick: (index: number) => void;
}) {
  return (
    <>
      <QuestionCard text={question.prompt} />
      <div
        className="grid w-full shrink-0 grid-cols-2 gap-1.5"
        style={{ animation: "slideUp .3s ease-out both" }}
      >
        {question.options.map((option, index) => {
          const selected = picked === index;
          const locked = picked !== null;
          return (
            <button
              key={index}
              type="button"
              disabled={locked}
              onClick={() => onPick(index)}
              aria-label={`Možnosť ${LETTERS[index]}: ${option}`}
              className="flex min-h-[min(3rem,7.5dvh)] items-center gap-2 rounded-xl border px-2 py-1.5 text-left transition enabled:active:scale-[.97] disabled:cursor-default"
              style={{
                background: selected ? `${color}30` : "rgba(255,255,255,0.05)",
                borderColor: selected ? `${color}cc` : "rgba(255,255,255,0.1)",
                opacity: locked && !selected ? 0.3 : 1,
                animation: `scaleIn .25s ease-out ${index * 0.06}s both`,
              }}
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg text-[10px] font-black"
                style={{
                  background: selected ? color : "rgba(255,255,255,0.1)",
                  color: selected ? "#08111d" : "rgba(255,255,255,0.55)",
                }}
              >
                {LETTERS[index]}
              </span>
              <span
                className="flex-1 font-bold leading-tight text-white"
                style={{ fontSize: "clamp(.68rem, 2.7vw, .9rem)" }}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>
      <WaitingNote
        text={
          picked === null
            ? "Vyberte odpoveď — súper vás nevidí"
            : "Odpoveď uzamknutá — čakáme na súpera…"
        }
      />
    </>
  );
}

function HiddenPanel({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 text-center">
      <span className="text-3xl">🙈</span>
      <p className="text-sm font-black text-white/70">{title}</p>
      <p className="max-w-[16rem] text-[10px] font-bold leading-relaxed text-white/35">
        {detail}
      </p>
      <span className="text-lg tracking-[0.4em] text-white/25">●●●●</span>
    </div>
  );
}

function DecidePanel({
  question,
  isDecider,
  guess,
  onDecide,
}: {
  question: ResolvedNumericQuestion;
  isDecider: boolean;
  guess: number | null;
  onDecide: (value: Verdict) => void;
}) {
  return (
    <>
      <QuestionCard text={question.prompt} />
      <div className="flex shrink-0 flex-col items-center">
        <p className="text-[9px] font-black uppercase tracking-widest text-white/40">
          {isDecider ? "Tip súpera" : "Váš tip"}
        </p>
        <p
          className="font-black tabular-nums leading-none text-white"
          style={{ fontSize: "clamp(1.4rem, 6vw, 2.1rem)" }}
        >
          {guess === null ? "—" : formatQuizNumber(guess)}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
          {question.unit}
        </p>
      </div>

      {isDecider ? (
        <>
          <p className="shrink-0 text-center text-[10px] font-bold text-white/45">
            Je skutočná hodnota vyššia alebo nižšia?
          </p>
          <div className="flex w-full shrink-0 gap-2">
            <BigChoiceButton
              label="↑ VIAC"
              color="#4ade80"
              onClick={() => onDecide("viac")}
            />
            <BigChoiceButton
              label="↓ MENEJ"
              color="#60a5fa"
              onClick={() => onDecide("menej")}
            />
          </div>
        </>
      ) : (
        <WaitingNote text="Súper sa rozhoduje…" />
      )}
    </>
  );
}

function RevealPanel({
  question,
  teamName,
  color,
  myGuess,
  opponentGuess,
  myPick,
  myVerdict,
  wager,
  result,
  onNext,
}: {
  question: ResolvedQuizDuelQuestion;
  teamName: string;
  color: string;
  myGuess: number | null;
  opponentGuess: number | null;
  myPick: number | null;
  myVerdict: Verdict | null;
  wager: Wager | null;
  result: { correct: boolean | null; delta: number; reason: QuizDuelReason };
  onNext: () => void;
}) {
  const positive = result.delta > 0;
  const tone = positive ? "#4ade80" : result.delta < 0 ? "#f87171" : "#94a3b8";

  const answerText =
    question.kind === "classic"
      ? `${LETTERS[question.correctIndex]}) ${question.options[question.correctIndex]}`
      : question.display;

  /** Jeden krátky riadok s tým, čo tím zadal — pre každý typ inak. */
  let detail = "";
  if (question.kind === "closest") {
    const mine = myGuess === null ? null : guessDistance(question.value, myGuess);
    const theirs =
      opponentGuess === null ? null : guessDistance(question.value, opponentGuess);
    detail = `Vy ±${mine === null ? "—" : formatQuizNumber(mine)}  ·  Súper ±${
      theirs === null ? "—" : formatQuizNumber(theirs)
    }`;
  } else if (question.kind === "estimate") {
    detail =
      myGuess !== null
        ? `Váš tip: ${formatQuizNumber(myGuess)}`
        : `Tip súpera: ${opponentGuess === null ? "—" : formatQuizNumber(opponentGuess)}`;
  } else if (question.kind === "classic" && myPick !== null) {
    detail = `Vaša odpoveď: ${LETTERS[myPick]}`;
  } else if (question.kind === "higher-lower" && myVerdict) {
    detail = `Vaša odpoveď: ${myVerdict === "viac" ? "↑ Viac" : "↓ Menej"}`;
  }

  return (
    <>
      <div
        className="flex w-full shrink-0 flex-col items-center rounded-2xl border px-3 py-1.5"
        style={{
          borderColor: "rgba(74,222,128,.4)",
          background: "rgba(34,197,94,.12)",
          animation: "scaleIn .35s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-300/70">
          {question.kind === "higher-lower"
            ? higherLowerTruth(question) === "viac"
              ? "↑ Bolo to viac"
              : "↓ Bolo to menej"
            : "Správna odpoveď"}
        </p>
        <p
          className="text-center font-black leading-tight text-white"
          style={{ fontSize: "clamp(1rem, 4.2vw, 1.45rem)" }}
        >
          {answerText}
        </p>
      </div>

      {/* Jediný riadok s detailom namiesto štyroch samostatných blokov.
          Pri „Najbližšom tipe“ ukazuje priamo odchýlky, takže je hneď vidno,
          kto bol bližšie — bez toho, aby to hráč musel počítať. */}
      {detail && (
        <p className="shrink-0 text-center text-[10px] font-bold tabular-nums text-white/45">
          {detail}
        </p>
      )}

      <div
        className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border px-3 py-1"
        style={{ borderColor: `${tone}44`, background: `${tone}14` }}
      >
        <span className="text-lg font-black tabular-nums" style={{ color: tone }}>
          {deltaLabel(result.delta)}
        </span>
        <span className="text-[10px] font-bold leading-tight text-white/60">
          {REASON_TEXT[result.reason]}
          {wager && (
            <span className="text-white/35">
              {" · "}
              {wager === "risk" ? "RISK" : "ISTOTA"}
            </span>
          )}
        </span>
      </div>

      {/* Fakt je orezaný na dva riadky — dlhší text nikto na párty nečíta. */}
      <p className="line-clamp-2 shrink-0 text-center text-[10px] font-medium leading-snug text-white/40">
        {question.fact}
      </p>

      <button
        type="button"
        onClick={onNext}
        aria-label={`${teamName}: ďalšia otázka`}
        className="min-h-[min(2.5rem,5.5dvh)] w-full shrink-0 rounded-xl text-sm font-black text-white transition active:scale-95"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
      >
        Ďalšia otázka →
      </button>
    </>
  );
}

// ── Celá minihra ─────────────────────────────────────────────────────────────

export default function TeamQuiz({
  questions,
  teamNames,
  startTeam = 0,
  onDone,
}: {
  questions: ResolvedQuizDuelQuestion[];
  teamNames: [string, string];
  startTeam?: TeamIndex;
  onDone: (scores: [number, number]) => void;
}) {
  const plan = useMemo(() => buildQuizDuelPlan(questions, startTeam), [questions, startTeam]);
  const reduce = useCallback(
    (state: QuizDuelState, action: QuizDuelAction) => quizDuelReducer(plan, state, action),
    [plan]
  );
  const [state, dispatch] = useReducer(reduce, createQuizDuelState());
  const [drafts, setDrafts] = useState<[string, string]>(["", ""]);
  const [colorA, colorB] = TEAM_COLORS;
  const doneRef = useRef(false);

  const slot = plan[state.slot];

  // Predstavenie otázky sa po chvíli posunie samo, aby partia nezasekla na tlačidle.
  useEffect(() => {
    if (state.stage.t !== "brief") return;
    const timeout = window.setTimeout(() => dispatch({ t: "start" }), BRIEF_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [state.stage.t, state.slot]);

  // Prázdne políčka pre ďalšiu otázku.
  useEffect(() => {
    setDrafts(["", ""]);
  }, [state.slot]);

  // Kolo skončilo — skóre sa odovzdá Party režimu (aj keď by zásoba bola prázdna).
  useEffect(() => {
    if (doneRef.current) return;
    if (!plan.length) {
      doneRef.current = true;
      onDone([0, 0]);
      return;
    }
    if (state.finished) {
      doneRef.current = true;
      onDone(state.scores);
    }
  }, [plan.length, state.finished, state.scores, onDone]);

  if (!slot || state.finished) return null;

  function setDraft(team: TeamIndex, next: string) {
    setDrafts(current => {
      const copy = [...current] as [string, string];
      copy[team] = next;
      return copy;
    });
  }

  const faceProps = {
    plan,
    state,
    dispatch,
  };

  return (
    <div
      // two-sided-table: obe polovice sú hracie plochy tímov, takže tlačidlo
      // odísť ide do stredového pásu medzi nimi (index.css).
      className="two-sided-table fixed inset-0 flex flex-col overflow-hidden"
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
        {...faceProps}
        flipped
        team={0}
        teamName={teamNames[0]}
        color={colorA}
        draft={drafts[0]}
        onDraft={next => setDraft(0, next)}
      />

      {/* Stredový pás: skóre, poradie otázky a čo je v hre. */}
      <div className="exit-slot-gap relative z-20 mx-3 shrink-0 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-1.5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          {([0, 1] as const).map(index => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-xl px-2.5 py-1 font-black"
              style={{
                background: `${index === 0 ? colorA : colorB}20`,
                border: `1px solid ${index === 0 ? colorA : colorB}40`,
              }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: index === 0 ? colorA : colorB }}
              />
              <span className="text-base tabular-nums text-white">
                {state.scores[index]}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
              {state.slot + 1} / {plan.length}
            </span>
            {slot.wager && (
              <span className="flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-400/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-200">
                <Icons.star size={9} /> Stávka
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Strana tímu B — v normálnej orientácii. */}
      <QuizFace
        {...faceProps}
        flipped={false}
        team={1}
        teamName={teamNames[1]}
        color={colorB}
        draft={drafts[1]}
        onDraft={next => setDraft(1, next)}
      />
    </div>
  );
}
