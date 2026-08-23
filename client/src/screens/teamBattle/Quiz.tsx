import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { TEAM_COLORS } from "../../data/teamBattle";
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

/**
 * ── Vizuálny systém ─────────────────────────────────────────────────────────
 *
 * Obrazovka je obojstranná, takže každý prvok sa kreslí dvakrát a jedna
 * polovica má necelú polovicu výšky displeja. Preto platia tri pravidlá:
 *
 *  1. Na jednu fázu maximálne TRI prvky.
 *  2. Iba tri úrovne textu (nadpisok, popis, hlavný text) — nie osem odtieňov
 *     bielej ako predtým.
 *  3. Jeden vzhľad karty pre všetko, aby obrazovka pôsobila ako celok.
 */

const LETTERS = ["A", "B", "C", "D"] as const;

const CARD_RADIUS = "1.25rem";
const SURFACE = "rgba(255,255,255,0.045)";
const SURFACE_BORDER = "rgba(255,255,255,0.09)";

/**
 * Nadpisok nad obsahom — jediný povolený „malý“ štýl textu.
 * Veľkosť je fluidná v index.css: párty kvíz sleduje viac ľudí naraz a často
 * z opačnej strany stola, takže ani nadpisok nesmie byť 10px konštanta.
 */
const EYEBROW = "quiz-eyebrow";
/** Vysvetľujúci text — jediný povolený „stredný“ štýl. */
const CAPTION = "quiz-caption";

const VERDICT_COLORS = { viac: "#4ade80", menej: "#60a5fa" } as const;

const KIND_INFO: Record<
  ResolvedQuizDuelQuestion["kind"],
  { label: string; rule: string; icon: string }
> = {
  classic: {
    label: "Klasická otázka",
    rule: "Oba tímy naraz vyberú jednu zo štyroch možností.",
    icon: "🧠",
  },
  estimate: {
    label: "Tipni číslo",
    rule: "Jeden tím zadá číslo, druhý háda, či je pravda viac alebo menej.",
    icon: "🎯",
  },
  closest: {
    label: "Najbližší tip",
    rule: "Oba tímy tajne zadajú číslo. Bod berie bližší tip.",
    icon: "📏",
  },
  "higher-lower": {
    label: "Viac či menej",
    rule: "Je skutočná hodnota vyššia alebo nižšia ako v tvrdení?",
    icon: "⚖️",
  },
};

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

// ── Stavebné prvky ───────────────────────────────────────────────────────────

/**
 * Otázka počas hrania. Je to jediný text, ktorý musia prečítať všetci hráči
 * naraz, preto dostane všetko voľné miesto polovice namiesto toho, aby ho
 * nechala prázdne:
 *
 *  - `flex: 1 1 auto` — karta vyrastie do zvyšného miesta, ale nikdy sa
 *    nezmenší pod svoj obsah (basis je výška textu, nie 0 ako pri `flex-1`).
 *  - veľkosť písma sa škáluje podľa `dvh`, nie iba `vw`. Obmedzením tejto
 *    obrazovky je výška polovice, nie šírka displeja — `vw` samo o sebe na
 *    vysokom telefóne nechá text malý.
 *
 * `compact` je pre fázy, kde voľné miesto potrebuje iný prvok: mriežka
 * štyroch možností a číselná klávesnica. Tam karta drží výšku obsahu
 * (`flex: 0 0 auto`), inak by o to isté miesto súťažili dva prvky naraz.
 */
function QuestionBar({ text, compact }: { text: string; compact?: boolean }) {
  return (
    <div
      key={text}
      className="quiz-question-card flex w-full items-center justify-center border text-center"
      style={{
        // Rastie len tam, kde je čo získať. V kompaktnom režime drží výšku
        // obsahu, aby všetko voľné miesto dostala klávesnica alebo mriežka
        // odpovedí — inak by o rovnaké miesto súťažili dva prvky.
        flex: compact ? "0 0 auto" : "1 1 auto",
        minHeight: 0,
        padding: compact
          ? ".6rem .9rem"
          : "clamp(.7rem, 1.8dvh, 1.25rem) clamp(.9rem, 3.5vw, 1.4rem)",
        borderRadius: CARD_RADIUS,
        background: SURFACE,
        borderColor: SURFACE_BORDER,
        animation: "popIn .3s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
    >
      <p
        className="quiz-question-text font-black text-white"
        style={{
          fontSize: compact
            ? "clamp(.85rem, min(4vw, 2.5dvh), 1.2rem)"
            : "clamp(1.05rem, min(7vw, 4.2dvh), 1.9rem)",
        }}
      >
        {text}
      </p>
    </div>
  );
}

/**
 * Úvod otázky — jediný prvok na obrazovke a zároveň tlačidlo.
 * Ikona v krúžku, názov typu, pravidlo, oddeľovač a pod ním samotná otázka.
 * Hráč tak vždy vie, čo je to za kolo a čo má robiť.
 */
function BriefCard({
  icon,
  label,
  rule,
  question,
  color,
  onTap,
}: {
  icon: string;
  label: string;
  rule: string;
  question: string;
  color: string;
  onTap: () => void;
}) {
  return (
    <div
      role="button"
      aria-label={`${label}: ${rule}`}
      onClick={onTap}
      className="flex min-h-0 w-full flex-1 cursor-pointer flex-col items-center overflow-hidden border px-4 py-3 transition active:scale-[.99]"
      style={{
        borderRadius: CARD_RADIUS,
        background: `linear-gradient(180deg, ${color}1c, ${SURFACE})`,
        borderColor: `${color}3d`,
        boxShadow: `0 18px 40px -30px ${color}`,
        animation: "popIn .35s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
    >
      <span
        className="flex shrink-0 items-center justify-center rounded-full border"
        style={{
          width: "clamp(2.1rem, 8vw, 2.75rem)",
          height: "clamp(2.1rem, 8vw, 2.75rem)",
          fontSize: "clamp(1rem, 4vw, 1.35rem)",
          background: `${color}24`,
          borderColor: `${color}55`,
        }}
      >
        {icon}
      </span>

      <p className={`${EYEBROW} mt-1.5 shrink-0`} style={{ color }}>
        {label}
      </p>
      <p className={`${CAPTION} mt-0.5 shrink-0 text-center text-white/50`}>
        {rule}
      </p>

      <span
        className="my-2 h-px w-10 shrink-0"
        style={{ background: `${color}4d` }}
      />

      {/* Úvod je jediný prvok na polovici, takže otázka smie byť najväčšia
          na obrazovke — nikdy nesmie byť menšia než tá istá otázka počas hry. */}
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <p
          className="quiz-question-text text-center font-black text-white"
          style={{ fontSize: "clamp(1.1rem, min(7.4vw, 4.6dvh), 2.05rem)" }}
        >
          {question}
        </p>
      </div>

      <p className={`${EYEBROW} mt-1.5 shrink-0 animate-pulse text-white/45`}>
        Ťukni, keď je tím pripravený →
      </p>
    </div>
  );
}

/**
 * Prázdny text nič nevykreslí — pokyn patrí na obrazovku len keď niečo hovorí.
 * Stav je vlastný pás s bodkou, aby sa dal prečítať aj z druhej strany stola;
 * pôvodné `text-white/25` bolo pri hre z odstupu nečitateľné.
 */
function WaitingNote({ text }: { text: string }) {
  if (!text) return null;
  return (
    <p className="quiz-status shrink-0">
      <span aria-hidden="true" className="quiz-status-dot" />
      <span className={`${EYEBROW} text-white/55`}>{text}</span>
    </p>
  );
}

/**
 * Tlačidlo voľby — spoločné pre VIAC/MENEJ aj ISTOTA/RISK.
 * `glyph` je nepovinná šípka vykreslená vo vlastnej veľkosti: z opačnej strany
 * stola sa smer rozlíši rýchlejšie podľa symbolu než podľa slova.
 */
function ChoiceButton({
  label,
  glyph,
  hint,
  color,
  selected,
  dimmed,
  disabled,
  onClick,
}: {
  label: string;
  glyph?: string;
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
      aria-label={glyph ? label : undefined}
      className="quiz-choice flex flex-1 flex-col items-center justify-center border transition enabled:active:scale-[.97] disabled:cursor-default"
      style={{
        borderRadius: CARD_RADIUS,
        background: selected ? `${color}33` : SURFACE,
        borderColor: selected ? `${color}cc` : SURFACE_BORDER,
        opacity: dimmed ? 0.3 : 1,
        boxShadow: selected ? `0 12px 30px -18px ${color}` : undefined,
      }}
    >
      <span className="flex items-center justify-center gap-2">
        {glyph && (
          <span
            aria-hidden="true"
            className="quiz-choice-glyph font-black leading-none"
            style={{ color: selected ? color : "rgba(255,255,255,.55)" }}
          >
            {glyph}
          </span>
        )}
        <span className="quiz-choice-label font-black leading-none text-white">
          {label}
        </span>
      </span>
      {hint && <span className={`${EYEBROW} mt-1 text-white/45`}>{hint}</span>}
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
    <div className="flex min-h-0 w-full flex-1 flex-col gap-1.5">
      {/* Číslo a jednotka na jednom riadku. Jednotka je vo farbe tímu a nikdy
          sa neskracuje — hráč musí vedieť, v čom tipuje (litry, km, °C…). */}
      <div
        className="flex shrink-0 items-baseline justify-center gap-1.5 border px-3 py-1.5"
        style={{
          borderRadius: CARD_RADIUS,
          borderColor: `${color}55`,
          background: `${color}14`,
        }}
      >
        <span
          className="quiz-guess-value font-black tabular-nums leading-none"
          style={{ color: value ? "#ffffff" : "rgba(255,255,255,.25)" }}
        >
          {value || "0"}
        </span>
        <span
          className="quiz-guess-unit font-black uppercase leading-tight tracking-[0.12em]"
          style={{ color }}
        >
          {unit}
        </span>
      </div>

      <div className="grid shrink-0 grid-cols-4 gap-1.5">
        {keys.map(key => (
          <button
            key={key}
            type="button"
            onClick={() => press(key)}
            aria-label={key === "⌫" ? "Zmazať číslicu" : key}
            className="min-h-[min(2.4rem,5dvh)] rounded-xl border text-base font-black text-white transition active:scale-95"
            style={{ background: SURFACE, borderColor: SURFACE_BORDER }}
          >
            {key}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!ready}
        onClick={onSubmit}
        className="quiz-next shrink-0 rounded-xl font-black text-white transition active:scale-95 disabled:opacity-30"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
      >
        Potvrdiť tip
      </button>
    </div>
  );
}

/** Číslo s jednotkou v jednom riadku — používa sa pri rozhodovaní VIAC/MENEJ. */
function GuessChip({
  eyebrow,
  guess,
  unit,
  color,
}: {
  eyebrow: string;
  guess: number | null;
  unit: string;
  color: string;
}) {
  return (
    <div
      className="flex w-full shrink-0 flex-col items-center border"
      style={{
        borderRadius: CARD_RADIUS,
        borderColor: `${color}55`,
        background: `${color}16`,
        padding: "clamp(.45rem, 1.2dvh, .85rem) 1rem",
      }}
    >
      <p className={`${EYEBROW} text-white/50`}>{eyebrow}</p>
      <p className="mt-0.5 flex items-baseline gap-2">
        <span className="quiz-guess-value font-black tabular-nums leading-none text-white">
          {guess === null ? "—" : formatQuizNumber(guess)}
        </span>
        <span
          className="quiz-guess-unit font-black uppercase leading-tight tracking-[0.12em]"
          style={{ color }}
        >
          {unit}
        </span>
      </p>
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
      className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-2 overflow-hidden px-3 py-2"
      style={{ transform: flipped ? "rotate(180deg)" : undefined }}
    >
      {/* Pred KAŽDOU otázkou: typ kola + čo majú tímy robiť + otázka. */}
      {stage.t === "brief" && (
        <BriefCard
          icon={info.icon}
          label={info.label}
          rule={info.rule}
          question={question.prompt}
          color={color}
          onTap={() => dispatch({ t: "start" })}
        />
      )}

      {stage.t === "wager" && (
        <>
          <QuestionBar text={question.prompt} />
          <div className="flex w-full shrink-0 gap-2">
            <ChoiceButton
              label="ISTOTA"
              hint="+1 bod"
              color="#34d399"
              selected={state.wagers[team] === "istota"}
              dimmed={state.wagers[team] === "risk"}
              disabled={state.wagers[team] !== null}
              onClick={() => dispatch({ t: "wager", team, value: "istota" })}
            />
            <ChoiceButton
              label="RISK"
              hint="+2 / −1"
              color="#fb7185"
              selected={state.wagers[team] === "risk"}
              dimmed={state.wagers[team] === "istota"}
              disabled={state.wagers[team] !== null}
              onClick={() => dispatch({ t: "wager", team, value: "risk" })}
            />
          </div>
          <WaitingNote text={state.wagers[team] === null ? "" : "Čakáme na súpera"} />
        </>
      )}

      {stage.t === "answer" && question.kind === "classic" && (
        <ClassicOptions
          question={question}
          color={color}
          picked={state.picks[team]}
          onPick={index => dispatch({ t: "pick", team, index })}
        />
      )}

      {stage.t === "answer" && question.kind === "higher-lower" && (
        <>
          <QuestionBar text={question.prompt} />
          <VerdictButtons
            chosen={state.verdicts[team]}
            onChoose={value => dispatch({ t: "verdict", team, value })}
          />
          <WaitingNote
            text={state.verdicts[team] === null ? "" : "Uzamknuté — čakáme na súpera"}
          />
        </>
      )}

      {stage.t === "guess" && stage.team === team && question.kind !== "classic" && (
        <>
          {/* Kompaktná: voľné miesto tu patrí číselnej klávesnici. */}
          <QuestionBar text={question.prompt} compact />
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
          title={state.guesses[team] === null ? "Súper tipuje" : "Tip uložený"}
        />
      )}

      {stage.t === "decide" && question.kind !== "classic" && (
        <DecidePanel
          question={question}
          color={color}
          isDecider={slot.firstTeam !== team}
          guess={state.guesses[slot.firstTeam]}
          onDecide={value => dispatch({ t: "decide", value })}
        />
      )}

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

/** VIAC / MENEJ — používa sa v dvoch fázach, preto samostatný komponent. */
function VerdictButtons({
  chosen,
  onChoose,
}: {
  chosen?: Verdict | null;
  onChoose: (value: Verdict) => void;
}) {
  return (
    <div className="flex w-full shrink-0 gap-2">
      {(["viac", "menej"] as const).map(verdict => (
        <ChoiceButton
          key={verdict}
          label={verdict === "viac" ? "VIAC" : "MENEJ"}
          glyph={verdict === "viac" ? "↑" : "↓"}
          color={VERDICT_COLORS[verdict]}
          selected={chosen === verdict}
          dimmed={chosen !== null && chosen !== undefined && chosen !== verdict}
          disabled={chosen !== null && chosen !== undefined}
          onClick={() => onChoose(verdict)}
        />
      ))}
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
  const locked = picked !== null;
  return (
    <>
      {/* Kompaktná otázka: o miesto tu súťaží aj mriežka štyroch odpovedí. */}
      <QuestionBar text={question.prompt} compact />
      <div
        className="grid w-full shrink-0 grid-cols-2 gap-1.5"
        style={{ animation: "slideUp .3s ease-out both" }}
      >
        {question.options.map((option, index) => {
          const selected = picked === index;
          return (
            <button
              key={index}
              type="button"
              disabled={locked}
              onClick={() => onPick(index)}
              aria-label={`Možnosť ${LETTERS[index]}: ${option}`}
              className="quiz-option flex items-center gap-2 rounded-xl border px-2 py-1.5 text-left transition enabled:active:scale-[.97] disabled:cursor-default"
              style={{
                background: selected ? `${color}33` : SURFACE,
                borderColor: selected ? `${color}cc` : SURFACE_BORDER,
                opacity: locked && !selected ? 0.25 : 1,
                animation: `scaleIn .25s ease-out ${index * 0.05}s both`,
              }}
            >
              <span
                className="quiz-option-letter flex shrink-0 items-center justify-center rounded-lg font-black"
                style={{
                  background: selected ? color : "rgba(255,255,255,0.1)",
                  color: selected ? "#08111d" : "rgba(255,255,255,0.5)",
                }}
              >
                {LETTERS[index]}
              </span>
              <span className="quiz-option-text flex-1 font-bold leading-tight text-white">
                {option}
              </span>
            </button>
          );
        })}
      </div>
      <WaitingNote text={locked ? "Uzamknuté — čakáme na súpera" : ""} />
    </>
  );
}

/** Kým tipuje súper, táto polovica má byť prázdna — nie je čo čítať. */
function HiddenPanel({ title }: { title: string }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2">
      <span style={{ fontSize: "clamp(2rem, 9vw, 2.75rem)" }}>🙈</span>
      <p className={`${EYEBROW} text-white/35`}>{title}</p>
    </div>
  );
}

function DecidePanel({
  question,
  color,
  isDecider,
  guess,
  onDecide,
}: {
  question: ResolvedNumericQuestion;
  color: string;
  isDecider: boolean;
  guess: number | null;
  onDecide: (value: Verdict) => void;
}) {
  return (
    <>
      <QuestionBar text={question.prompt} />
      <GuessChip
        eyebrow={isDecider ? "Tip súpera" : "Váš tip"}
        guess={guess}
        unit={question.unit}
        color={color}
      />
      {isDecider ? (
        <VerdictButtons onChoose={onDecide} />
      ) : (
        <WaitingNote text="Súper sa rozhoduje" />
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
  const tone = result.delta > 0 ? "#4ade80" : result.delta < 0 ? "#f87171" : "#94a3b8";

  const answerText =
    question.kind === "classic"
      ? `${LETTERS[question.correctIndex]}) ${question.options[question.correctIndex]}`
      : question.display;

  const answerEyebrow =
    question.kind === "higher-lower"
      ? higherLowerTruth(question) === "viac"
        ? "↑ Bolo to viac"
        : "↓ Bolo to menej"
      : "Správna odpoveď";

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
        ? `Váš tip ${formatQuizNumber(myGuess)}`
        : `Tip súpera ${opponentGuess === null ? "—" : formatQuizNumber(opponentGuess)}`;
  } else if (question.kind === "classic" && myPick !== null) {
    detail = `Vaša odpoveď ${LETTERS[myPick]}`;
  } else if (question.kind === "higher-lower" && myVerdict) {
    detail = `Vaša odpoveď ${myVerdict === "viac" ? "↑ Viac" : "↓ Menej"}`;
  }

  return (
    <>
      {/* Správna odpoveď a fakt sú jedna karta — fakt patrí k odpovedi,
          nie do samostatného odseku pod ňou. */}
      <div
        className="flex min-h-0 w-full flex-1 flex-col items-center justify-center border px-3 py-2"
        style={{
          borderRadius: CARD_RADIUS,
          borderColor: "rgba(74,222,128,.38)",
          background: "linear-gradient(180deg, rgba(34,197,94,.16), rgba(34,197,94,.06))",
          animation: "scaleIn .35s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <p className={`${EYEBROW} shrink-0 text-emerald-300/70`}>{answerEyebrow}</p>
        <p
          className="quiz-question-text mt-0.5 shrink-0 text-center font-black text-white"
          style={{ fontSize: "clamp(1.1rem, min(6.6vw, 4dvh), 1.85rem)" }}
        >
          {answerText}
        </p>
        <span className="my-1.5 h-px w-10 shrink-0 bg-white/12" />
        <p
          className={`${CAPTION} line-clamp-3 min-h-0 text-center font-medium text-white/45`}
        >
          {question.fact}
        </p>
      </div>

      {/* Body, dôvod aj vlastný tip v jednom riadku. */}
      <div
        className="flex w-full shrink-0 items-center gap-2.5 border px-3 py-1.5"
        style={{
          borderRadius: CARD_RADIUS,
          borderColor: `${tone}40`,
          background: `${tone}14`,
        }}
      >
        <span
          className="quiz-delta shrink-0 font-black tabular-nums leading-none"
          style={{ color: tone }}
        >
          {deltaLabel(result.delta)}
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="quiz-reason block font-black leading-tight text-white/85">
            {REASON_TEXT[result.reason]}
            {wager && (
              <span className="text-white/40">
                {" · "}
                {wager === "risk" ? "RISK" : "ISTOTA"}
              </span>
            )}
          </span>
          {detail && (
            <span className="quiz-reason-detail block font-bold tabular-nums text-white/50">
              {detail}
            </span>
          )}
        </span>
      </div>

      <button
        type="button"
        onClick={onNext}
        aria-label={`${teamName}: ďalšia otázka`}
        className="quiz-next w-full shrink-0 rounded-xl font-black text-white transition active:scale-95"
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
  const plan = useMemo(
    () => buildQuizDuelPlan(questions, startTeam),
    [questions, startTeam]
  );
  const reduce = useCallback(
    (state: QuizDuelState, action: QuizDuelAction) =>
      quizDuelReducer(plan, state, action),
    [plan]
  );
  const [state, dispatch] = useReducer(reduce, createQuizDuelState());
  const [drafts, setDrafts] = useState<[string, string]>(["", ""]);
  const [colorA, colorB] = TEAM_COLORS;
  const doneRef = useRef(false);

  const slot = plan[state.slot];

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

  const faceProps = { plan, state, dispatch };

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

      {/* Stredový pás: skóre a postup kolom. Bodky sa čítajú z oboch strán
          rovnako, na rozdiel od textu „3 / 5“. */}
      <div className="exit-slot-gap relative z-20 mx-3 flex shrink-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-1.5 backdrop-blur-xl">
        {([0, 1] as const).map(index => (
          <span
            key={index}
            className="flex items-center gap-2 rounded-xl px-2.5 py-1"
            style={{
              background: `${index === 0 ? colorA : colorB}1f`,
              border: `1px solid ${index === 0 ? colorA : colorB}3d`,
            }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: index === 0 ? colorA : colorB }}
            />
            <span className="text-base font-black tabular-nums text-white">
              {state.scores[index]}
            </span>
          </span>
        ))}

        <span className="flex items-center gap-1.5" aria-label="Postup kolom">
          {plan.map((planSlot, index) => (
            <span
              key={index}
              className="rounded-full transition-all"
              style={{
                width: index === state.slot ? ".5rem" : ".3rem",
                height: index === state.slot ? ".5rem" : ".3rem",
                background:
                  index === state.slot
                    ? "#ffffff"
                    : index < state.slot
                      ? "rgba(255,255,255,.4)"
                      : "rgba(255,255,255,.14)",
                outline: planSlot.wager ? "1px solid rgba(251,191,36,.55)" : undefined,
                outlineOffset: "2px",
              }}
            />
          ))}
        </span>
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
