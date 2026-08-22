import {
  isWagerableKind,
  SYMMETRIC_QUIZ_DUEL_KINDS,
  type QuizDuelKind,
  type ResolvedClassicQuestion,
  type ResolvedClosestQuestion,
  type ResolvedEstimateQuestion,
  type ResolvedHigherLowerQuestion,
  type ResolvedQuizDuelQuestion,
} from "../../data/quizDuel";

/**
 * ── Kvízový súboj: čistá herná logika ───────────────────────────────────────
 *
 * Celé pravidlá kola sú tu ako čisté funkcie bez Reactu, aby sa dali testovať.
 * `Quiz.tsx` je potom už len zobrazenie.
 */

export const QUIZ_DUEL_QUESTIONS_PER_ROUND = 5;

export type TeamIndex = 0 | 1;
export type Wager = "istota" | "risk";
export type Verdict = "viac" | "menej";

export function otherTeam(team: TeamIndex): TeamIndex {
  return team === 0 ? 1 : 0;
}

// ── Bodovanie stávky ──────────────────────────────────────────────────────────

/** ISTOTA = 1 bod za správnu odpoveď. RISK = 2 body, ale −1 pri chybe. */
export const WAGER_POINTS: Record<Wager, { correct: number; wrong: number }> = {
  istota: { correct: 1, wrong: 0 },
  risk: { correct: 2, wrong: -1 },
};

/** Bez zvolenej stávky sa hrá vždy „na istotu“. */
export function wagerDelta(wager: Wager | null, correct: boolean): number {
  const points = WAGER_POINTS[wager ?? "istota"];
  return correct ? points.correct : points.wrong;
}

// ── Výsledok otázky ──────────────────────────────────────────────────────────

/**
 * Kód dôvodu, prečo tím body dostal alebo nedostal. Text si dopĺňa UI, takže
 * logika zostáva nezávislá od jazyka.
 */
export type QuizDuelReason =
  | "correct"
  | "wrong"
  | "no-answer"
  | "verdict-correct"
  | "verdict-wrong"
  | "estimate-defended"
  | "estimate-beaten"
  | "estimate-exact"
  | "estimate-void"
  | "closest-win"
  | "closest-lose"
  | "closest-tie"
  | "closest-exact";

export interface QuizDuelTeamResult {
  /** `null` znamená, že tím sa v tejto otázke priamo nevyjadroval. */
  correct: boolean | null;
  delta: number;
  reason: QuizDuelReason;
}

export interface QuizDuelOutcome {
  kind: QuizDuelKind;
  results: [QuizDuelTeamResult, QuizDuelTeamResult];
  winner: TeamIndex | "both" | "none";
  /** Skutočná hodnota / správna možnosť — UI ju odhaľuje s animáciou. */
  truthVerdict?: Verdict;
}

function pickWinner(results: [QuizDuelTeamResult, QuizDuelTeamResult]): TeamIndex | "both" | "none" {
  const first = results[0].delta > 0;
  const second = results[1].delta > 0;
  if (first && second) return "both";
  if (first) return 0;
  if (second) return 1;
  return "none";
}

// ── Bodovanie jednotlivých typov ─────────────────────────────────────────────

export function scoreClassic(
  question: ResolvedClassicQuestion,
  picks: [number | null, number | null],
  wagers: [Wager | null, Wager | null]
): QuizDuelOutcome {
  const results = ([0, 1] as const).map((team) => {
    const pick = picks[team];
    if (pick === null) {
      return { correct: null, delta: 0, reason: "no-answer" } satisfies QuizDuelTeamResult;
    }
    const correct = pick === question.correctIndex;
    return {
      correct,
      delta: wagerDelta(wagers[team], correct),
      reason: correct ? "correct" : "wrong",
    } satisfies QuizDuelTeamResult;
  }) as [QuizDuelTeamResult, QuizDuelTeamResult];

  return { kind: "classic", results, winner: pickWinner(results) };
}

/** Pravda pre typ VIAC/MENEJ: je skutočná hodnota vyššia ako tvrdenie? */
export function higherLowerTruth(question: ResolvedHigherLowerQuestion): Verdict {
  return question.value > question.claim ? "viac" : "menej";
}

export function scoreHigherLower(
  question: ResolvedHigherLowerQuestion,
  verdicts: [Verdict | null, Verdict | null],
  wagers: [Wager | null, Wager | null]
): QuizDuelOutcome {
  const truth = higherLowerTruth(question);
  const results = ([0, 1] as const).map((team) => {
    const verdict = verdicts[team];
    if (verdict === null) {
      return { correct: null, delta: 0, reason: "no-answer" } satisfies QuizDuelTeamResult;
    }
    const correct = verdict === truth;
    return {
      correct,
      delta: wagerDelta(wagers[team], correct),
      reason: correct ? "verdict-correct" : "verdict-wrong",
    } satisfies QuizDuelTeamResult;
  }) as [QuizDuelTeamResult, QuizDuelTeamResult];

  return { kind: "higher-lower", results, winner: pickWinner(results), truthVerdict: truth };
}

/**
 * TIPNI ČÍSLO. Tím `guesser` zadal odhad, súper rozhodol VIAC / MENEJ.
 * Ak súper trafí → bod pre neho, ak sa pomýli → bod pre tipujúceho.
 * Presný zásah tipujúceho je odmenený dvoma bodmi a rozhodnutie súpera padá.
 */
export function scoreEstimate(
  question: ResolvedEstimateQuestion,
  guesser: TeamIndex,
  guess: number,
  verdict: Verdict
): QuizDuelOutcome {
  const decider = otherTeam(guesser);
  const results: [QuizDuelTeamResult, QuizDuelTeamResult] = [
    { correct: null, delta: 0, reason: "no-answer" },
    { correct: null, delta: 0, reason: "no-answer" },
  ];

  if (question.value === guess) {
    results[guesser] = { correct: true, delta: 2, reason: "estimate-exact" };
    results[decider] = { correct: null, delta: 0, reason: "estimate-void" };
    return { kind: "estimate", results, winner: guesser };
  }

  const truth: Verdict = question.value > guess ? "viac" : "menej";
  const deciderCorrect = verdict === truth;
  results[decider] = {
    correct: deciderCorrect,
    delta: deciderCorrect ? 1 : 0,
    reason: deciderCorrect ? "verdict-correct" : "verdict-wrong",
  };
  results[guesser] = {
    correct: null,
    delta: deciderCorrect ? 0 : 1,
    reason: deciderCorrect ? "estimate-beaten" : "estimate-defended",
  };

  return {
    kind: "estimate",
    results,
    winner: deciderCorrect ? decider : guesser,
    truthVerdict: truth,
  };
}

/** Vzdialenosť tipu od správnej hodnoty. Rozhoduje čistý absolútny rozdiel. */
export function guessDistance(value: number, guess: number): number {
  return Math.abs(guess - value);
}

/** NAJBLIŽŠÍ TIP VYHRÁVA. Presný zásah = 2 body, rovnaká vzdialenosť = bod obom. */
export function scoreClosest(
  question: ResolvedClosestQuestion,
  guesses: [number, number]
): QuizDuelOutcome {
  const distances: [number, number] = [
    guessDistance(question.value, guesses[0]),
    guessDistance(question.value, guesses[1]),
  ];

  const results = ([0, 1] as const).map((team) => {
    const mine = distances[team];
    const theirs = distances[otherTeam(team)];
    if (mine === 0) {
      return { correct: true, delta: 2, reason: "closest-exact" } satisfies QuizDuelTeamResult;
    }
    if (mine === theirs) {
      return { correct: true, delta: 1, reason: "closest-tie" } satisfies QuizDuelTeamResult;
    }
    return mine < theirs
      ? ({ correct: true, delta: 1, reason: "closest-win" } satisfies QuizDuelTeamResult)
      : ({ correct: false, delta: 0, reason: "closest-lose" } satisfies QuizDuelTeamResult);
  }) as [QuizDuelTeamResult, QuizDuelTeamResult];

  return { kind: "closest", results, winner: pickWinner(results) };
}

// ── Zloženie kola ────────────────────────────────────────────────────────────

/** Prvá otázka je vždy klasická — je najzrozumiteľnejšia na rozohriatie. */
const OPENING_KIND: QuizDuelKind = "classic";
const ROTATION: QuizDuelKind[] = ["estimate", "closest", "higher-lower"];

function shuffleWith<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Poradie typov v kole. Päť otázok pokryje všetky štyri typy a posledná otázka
 * je vždy symetrická (oba tímy odpovedajú naraz) — finále má byť férové.
 */
export function buildQuizDuelKindOrder(
  count: number = QUIZ_DUEL_QUESTIONS_PER_ROUND,
  random: () => number = Math.random
): QuizDuelKind[] {
  if (count <= 0) return [];

  const order: QuizDuelKind[] = [OPENING_KIND, ...shuffleWith(ROTATION, random)];
  while (order.length < count) {
    const extras = shuffleWith(SYMMETRIC_QUIZ_DUEL_KINDS, random);
    order.push(extras[0]);
  }
  const kinds = order.slice(0, count);

  const last = kinds.length - 1;
  if (last > 0 && !SYMMETRIC_QUIZ_DUEL_KINDS.includes(kinds[last])) {
    const swapAt = kinds.findIndex(
      (kind, index) => index > 0 && index < last && SYMMETRIC_QUIZ_DUEL_KINDS.includes(kind)
    );
    if (swapAt > 0) {
      [kinds[swapAt], kinds[last]] = [kinds[last], kinds[swapAt]];
    } else {
      kinds[last] = "closest";
    }
  }
  return kinds;
}

export interface QuizDuelSlot {
  question: ResolvedQuizDuelQuestion;
  /** Kto zadáva číslo prvý (typy `estimate` a `closest`). */
  firstTeam: TeamIndex;
  /** Či sa pred otázkou vyberá ISTOTA / RISK. */
  wager: boolean;
}

export type QuizDuelPlan = QuizDuelSlot[];

/**
 * Stávka sa ponúka len tam, kde má každý tím vlastnú správnu odpoveď, a nikdy
 * na prvých dvoch otázkach — partia si najprv zvykne na základné pravidlá.
 */
export function slotHasWager(kind: QuizDuelKind, index: number): boolean {
  return index >= 2 && isWagerableKind(kind);
}

/**
 * Kto začína pri sekvenčných typoch. Striedanie zaručí, že žiadny tím nemá
 * systematickú výhodu (pri „Tipni číslo“ je druhý tím v lepšej pozícii).
 */
export function buildQuizDuelPlan(
  questions: ResolvedQuizDuelQuestion[],
  startTeam: TeamIndex = 0
): QuizDuelPlan {
  let sequential = 0;
  return questions.map((question, index) => {
    let firstTeam: TeamIndex = startTeam;
    if (question.kind === "estimate" || question.kind === "closest") {
      firstTeam = ((startTeam + sequential) % 2) as TeamIndex;
      sequential += 1;
    }
    return { question, firstTeam, wager: slotHasWager(question.kind, index) };
  });
}

/**
 * Koľko bodov je v otázke maximálne v hre — UI to ukazuje pri stávke aj v hlavičke.
 * Pri presnom zásahu číselného tipu môže tím dostať bonusový druhý bod.
 */
export function pointsAtStake(slot: QuizDuelSlot, wager: Wager | null): number {
  if (slot.wager) return WAGER_POINTS[wager ?? "istota"].correct;
  return slot.question.kind === "estimate" || slot.question.kind === "closest" ? 2 : 1;
}

// ── Stav a prechody ──────────────────────────────────────────────────────────

export type QuizDuelStage =
  | { t: "brief" }
  | { t: "wager" }
  | { t: "answer" }
  | { t: "guess"; team: TeamIndex }
  | { t: "decide" }
  | { t: "reveal" };

export interface QuizDuelState {
  slot: number;
  scores: [number, number];
  stage: QuizDuelStage;
  wagers: [Wager | null, Wager | null];
  picks: [number | null, number | null];
  verdicts: [Verdict | null, Verdict | null];
  guesses: [number | null, number | null];
  outcome: QuizDuelOutcome | null;
  finished: boolean;
}

function firstInteractiveStage(slot: QuizDuelSlot): QuizDuelStage {
  if (slot.question.kind === "estimate" || slot.question.kind === "closest") {
    return { t: "guess", team: slot.firstTeam };
  }
  return { t: "answer" };
}

function stageAfterBrief(slot: QuizDuelSlot): QuizDuelStage {
  return slot.wager ? { t: "wager" } : firstInteractiveStage(slot);
}

export function createQuizDuelState(): QuizDuelState {
  return {
    slot: 0,
    scores: [0, 0],
    stage: { t: "brief" },
    wagers: [null, null],
    picks: [null, null],
    verdicts: [null, null],
    guesses: [null, null],
    outcome: null,
    finished: false,
  };
}

export type QuizDuelAction =
  | { t: "start" }
  | { t: "wager"; team: TeamIndex; value: Wager }
  | { t: "pick"; team: TeamIndex; index: number }
  | { t: "verdict"; team: TeamIndex; value: Verdict }
  | { t: "guess"; team: TeamIndex; value: number }
  | { t: "decide"; value: Verdict }
  | { t: "next" };

/** Body nikdy neklesnú pod nulu — RISK má štípať, ale nie robiť mínusové skóre. */
function applyOutcome(
  scores: [number, number],
  outcome: QuizDuelOutcome
): [number, number] {
  return [
    Math.max(0, scores[0] + outcome.results[0].delta),
    Math.max(0, scores[1] + outcome.results[1].delta),
  ];
}

function reveal(state: QuizDuelState, outcome: QuizDuelOutcome): QuizDuelState {
  return {
    ...state,
    outcome,
    scores: applyOutcome(state.scores, outcome),
    stage: { t: "reveal" },
  };
}

export function quizDuelReducer(
  plan: QuizDuelPlan,
  state: QuizDuelState,
  action: QuizDuelAction
): QuizDuelState {
  const slot = plan[state.slot];
  if (!slot || state.finished) return state;
  const question = slot.question;

  switch (action.t) {
    case "start": {
      if (state.stage.t !== "brief") return state;
      return { ...state, stage: stageAfterBrief(slot) };
    }

    case "wager": {
      if (state.stage.t !== "wager") return state;
      if (state.wagers[action.team] !== null) return state;
      const wagers: [Wager | null, Wager | null] = [...state.wagers];
      wagers[action.team] = action.value;
      const ready = wagers[0] !== null && wagers[1] !== null;
      return { ...state, wagers, stage: ready ? firstInteractiveStage(slot) : state.stage };
    }

    case "pick": {
      if (state.stage.t !== "answer" || question.kind !== "classic") return state;
      if (state.picks[action.team] !== null) return state;
      const picks: [number | null, number | null] = [...state.picks];
      picks[action.team] = action.index;
      const next = { ...state, picks };
      if (picks[0] === null || picks[1] === null) return next;
      return reveal(next, scoreClassic(question, picks, state.wagers));
    }

    case "verdict": {
      if (state.stage.t !== "answer" || question.kind !== "higher-lower") return state;
      if (state.verdicts[action.team] !== null) return state;
      const verdicts: [Verdict | null, Verdict | null] = [...state.verdicts];
      verdicts[action.team] = action.value;
      const next = { ...state, verdicts };
      if (verdicts[0] === null || verdicts[1] === null) return next;
      return reveal(next, scoreHigherLower(question, verdicts, state.wagers));
    }

    case "guess": {
      if (state.stage.t !== "guess" || state.stage.team !== action.team) return state;
      if (!Number.isFinite(action.value)) return state;
      const guesses: [number | null, number | null] = [...state.guesses];
      guesses[action.team] = action.value;
      const next = { ...state, guesses };

      if (question.kind === "estimate") return { ...next, stage: { t: "decide" } };

      if (question.kind === "closest") {
        const waiting = otherTeam(action.team);
        if (guesses[waiting] === null) {
          return { ...next, stage: { t: "guess", team: waiting } };
        }
        return reveal(next, scoreClosest(question, [guesses[0]!, guesses[1]!]));
      }
      return next;
    }

    case "decide": {
      if (state.stage.t !== "decide" || question.kind !== "estimate") return state;
      const guesser = slot.firstTeam;
      const guess = state.guesses[guesser];
      if (guess === null) return state;
      const decider = otherTeam(guesser);
      const verdicts: [Verdict | null, Verdict | null] = [...state.verdicts];
      verdicts[decider] = action.value;
      return reveal(
        { ...state, verdicts },
        scoreEstimate(question, guesser, guess, action.value)
      );
    }

    case "next": {
      if (state.stage.t !== "reveal") return state;
      const nextSlot = state.slot + 1;
      if (nextSlot >= plan.length) return { ...state, finished: true };
      return {
        ...state,
        slot: nextSlot,
        stage: { t: "brief" },
        wagers: [null, null],
        picks: [null, null],
        verdicts: [null, null],
        guesses: [null, null],
        outcome: null,
      };
    }

    default:
      return state;
  }
}

// ── Pomôcky pre UI ───────────────────────────────────────────────────────────

/**
 * 2500 → „2 500“, 42.195 → „42,195“ (slovenský zápis s pevnou medzerou).
 *
 * Zaokrúhľuje na tri desatinné miesta, inak by sa pri rozdieloch desatinných
 * tipov v UI objavilo napríklad „3,6999999999999957“.
 */
export function formatQuizNumber(value: number): string {
  const negative = value < 0;
  const absolute = Math.round(Math.abs(value) * 1000) / 1000;
  const [whole, fraction] = String(absolute).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
  const text = fraction ? `${grouped},${fraction}` : grouped;
  return negative ? `−${text}` : text;
}

/** Text v číselnej klávesnici → číslo. Prázdny alebo neplatný vstup je `null`. */
export function parseGuessInput(input: string): number | null {
  const normalized = input.replace(/\s/g, "").replace(",", ".");
  if (!normalized || normalized === ".") return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}
