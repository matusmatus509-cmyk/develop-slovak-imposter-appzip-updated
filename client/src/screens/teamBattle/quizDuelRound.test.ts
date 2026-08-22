import { describe, expect, it } from "vitest";
import type {
  ResolvedClassicQuestion,
  ResolvedClosestQuestion,
  ResolvedEstimateQuestion,
  ResolvedHigherLowerQuestion,
  ResolvedQuizDuelQuestion,
} from "../../data/quizDuel";
import { SYMMETRIC_QUIZ_DUEL_KINDS } from "../../data/quizDuel";
import {
  buildQuizDuelKindOrder,
  buildQuizDuelPlan,
  createQuizDuelState,
  formatQuizNumber,
  guessDistance,
  higherLowerTruth,
  parseGuessInput,
  pointsAtStake,
  quizDuelReducer,
  scoreClassic,
  scoreClosest,
  scoreEstimate,
  scoreHigherLower,
  slotHasWager,
  wagerDelta,
  QUIZ_DUEL_QUESTIONS_PER_ROUND,
  type QuizDuelAction,
  type QuizDuelPlan,
  type QuizDuelState,
} from "./quizDuelRound";

const classic: ResolvedClassicQuestion = {
  id: "t-classic",
  kind: "classic",
  topic: "zvierata",
  topicLabel: "🐾 Zvieratá",
  difficulty: "lahke",
  prompt: "Otázka?",
  fact: "Fakt.",
  source: "Test",
  options: ["A", "B", "C", "D"],
  correctIndex: 2,
};

const estimate: ResolvedEstimateQuestion = {
  id: "t-estimate",
  kind: "estimate",
  topic: "telo",
  topicLabel: "🫀 Ľudské telo",
  difficulty: "lahke",
  prompt: "Koľko?",
  fact: "Fakt.",
  source: "Test",
  value: 100,
  unit: "kusov",
  display: "100 kusov",
};

const closest: ResolvedClosestQuestion = { ...estimate, id: "t-closest", kind: "closest" };

const higherLower: ResolvedHigherLowerQuestion = {
  id: "t-higher-lower",
  kind: "higher-lower",
  topic: "priroda",
  topicLabel: "🌍 Príroda",
  difficulty: "lahke",
  prompt: "Tvrdenie o 50.",
  fact: "Fakt.",
  source: "Test",
  claim: 50,
  claimDisplay: "50 kusov",
  value: 120,
  unit: "kusov",
  display: "120 kusov",
};

function run(plan: QuizDuelPlan, actions: QuizDuelAction[], from?: QuizDuelState) {
  return actions.reduce(
    (state, action) => quizDuelReducer(plan, state, action),
    from ?? createQuizDuelState()
  );
}

describe("bodovanie stávky", () => {
  it("ISTOTA dá bod za správnu odpoveď a nič za chybu", () => {
    expect(wagerDelta("istota", true)).toBe(1);
    expect(wagerDelta("istota", false)).toBe(0);
  });

  it("RISK dá dva body, ale za chybu bod odoberie", () => {
    expect(wagerDelta("risk", true)).toBe(2);
    expect(wagerDelta("risk", false)).toBe(-1);
  });

  it("bez zvolenej stávky sa hrá na istotu", () => {
    expect(wagerDelta(null, true)).toBe(1);
    expect(wagerDelta(null, false)).toBe(0);
  });
});

describe("klasická otázka", () => {
  it("oba tímy skórujú nezávisle od seba", () => {
    const outcome = scoreClassic(classic, [2, 0], [null, null]);
    expect(outcome.results[0].delta).toBe(1);
    expect(outcome.results[1].delta).toBe(0);
    expect(outcome.winner).toBe(0);
  });

  it("obe správne odpovede znamenajú bod pre oboch", () => {
    const outcome = scoreClassic(classic, [2, 2], [null, null]);
    expect(outcome.results.map(r => r.delta)).toEqual([1, 1]);
    expect(outcome.winner).toBe("both");
  });

  it("RISK zvýši výhru aj stratu", () => {
    const outcome = scoreClassic(classic, [2, 1], ["risk", "risk"]);
    expect(outcome.results[0].delta).toBe(2);
    expect(outcome.results[1].delta).toBe(-1);
  });

  it("chýbajúca odpoveď nedá ani neodoberie body", () => {
    const outcome = scoreClassic(classic, [null, null], ["risk", "risk"]);
    expect(outcome.results.map(r => r.delta)).toEqual([0, 0]);
    expect(outcome.winner).toBe("none");
  });
});

describe("viac / menej", () => {
  it("pravda vychádza z porovnania tvrdenia so skutočnou hodnotou", () => {
    expect(higherLowerTruth(higherLower)).toBe("viac");
    expect(higherLowerTruth({ ...higherLower, value: 10 })).toBe("menej");
  });

  it("obidva tímy hlasujú a bodujú samostatne", () => {
    const outcome = scoreHigherLower(higherLower, ["viac", "menej"], [null, null]);
    expect(outcome.results[0].delta).toBe(1);
    expect(outcome.results[1].delta).toBe(0);
    expect(outcome.truthVerdict).toBe("viac");
  });
});

describe("tipni číslo", () => {
  it("bod ide súperovi, keď VIAC/MENEJ uhádne", () => {
    // Tím 0 tipol 80, pravda je 100 → správna odpoveď je VIAC.
    const outcome = scoreEstimate(estimate, 0, 80, "viac");
    expect(outcome.results[1].delta).toBe(1);
    expect(outcome.results[0].delta).toBe(0);
    expect(outcome.winner).toBe(1);
  });

  it("bod ide tipujúcemu, keď sa súper pomýli", () => {
    const outcome = scoreEstimate(estimate, 0, 80, "menej");
    expect(outcome.results[0].delta).toBe(1);
    expect(outcome.results[1].delta).toBe(0);
    expect(outcome.winner).toBe(0);
  });

  it("presný tip berie dva body a rozhodnutie súpera padá", () => {
    const outcome = scoreEstimate(estimate, 1, 100, "viac");
    expect(outcome.results[1].delta).toBe(2);
    expect(outcome.results[1].reason).toBe("estimate-exact");
    expect(outcome.results[0].delta).toBe(0);
    expect(outcome.results[0].reason).toBe("estimate-void");
  });

  it("funguje symetricky, keď tipuje druhý tím", () => {
    const outcome = scoreEstimate(estimate, 1, 150, "menej");
    expect(outcome.results[0].delta).toBe(1);
    expect(outcome.winner).toBe(0);
  });
});

describe("najbližší tip vyhráva", () => {
  it("bod získa bližší tip", () => {
    const outcome = scoreClosest(closest, [90, 60]);
    expect(outcome.results[0].delta).toBe(1);
    expect(outcome.results[1].delta).toBe(0);
  });

  it("rovnaká vzdialenosť z oboch strán dá bod obom", () => {
    const outcome = scoreClosest(closest, [90, 110]);
    expect(outcome.results.map(r => r.delta)).toEqual([1, 1]);
    expect(outcome.winner).toBe("both");
  });

  it("presný zásah je za dva body", () => {
    const outcome = scoreClosest(closest, [100, 130]);
    expect(outcome.results[0].delta).toBe(2);
    expect(outcome.results[0].reason).toBe("closest-exact");
  });
});

describe("zloženie kola", () => {
  it("päť otázok pokryje všetky štyri typy", () => {
    const kinds = buildQuizDuelKindOrder(QUIZ_DUEL_QUESTIONS_PER_ROUND);
    expect(kinds).toHaveLength(5);
    expect(new Set(kinds).size).toBe(4);
  });

  it("prvá otázka je vždy klasická", () => {
    for (let i = 0; i < 40; i++) {
      expect(buildQuizDuelKindOrder(5)[0]).toBe("classic");
    }
  });

  it("posledná otázka je vždy symetrická, aby bolo finále férové", () => {
    for (let i = 0; i < 60; i++) {
      const kinds = buildQuizDuelKindOrder(5);
      expect(SYMMETRIC_QUIZ_DUEL_KINDS).toContain(kinds[kinds.length - 1]);
    }
  });

  it("stávka sa neponúka na prvých dvoch otázkach ani pri číselných typoch", () => {
    expect(slotHasWager("classic", 0)).toBe(false);
    expect(slotHasWager("classic", 1)).toBe(false);
    expect(slotHasWager("classic", 2)).toBe(true);
    expect(slotHasWager("higher-lower", 3)).toBe(true);
    expect(slotHasWager("estimate", 4)).toBe(false);
    expect(slotHasWager("closest", 4)).toBe(false);
  });

  it("začínajúci tím sa pri číselných typoch strieda", () => {
    const plan = buildQuizDuelPlan([estimate, closest, estimate, classic], 0);
    expect(plan.map(slot => slot.firstTeam)).toEqual([0, 1, 0, 0]);
    const flipped = buildQuizDuelPlan([estimate, closest], 1);
    expect(flipped.map(slot => slot.firstTeam)).toEqual([1, 0]);
  });

  it("v hre je viac bodov, keď tím zvolí RISK", () => {
    const [slot] = buildQuizDuelPlan([classic], 0);
    const wagerSlot = { ...slot, wager: true };
    expect(pointsAtStake(wagerSlot, "istota")).toBe(1);
    expect(pointsAtStake(wagerSlot, "risk")).toBe(2);
  });
});

describe("priebeh kola", () => {
  it("klasická otázka odhalí výsledok až po odpovedi oboch tímov", () => {
    const plan = buildQuizDuelPlan([classic], 0);
    const afterOne = run(plan, [{ t: "start" }, { t: "pick", team: 0, index: 2 }]);
    expect(afterOne.stage.t).toBe("answer");
    expect(afterOne.outcome).toBeNull();

    const afterBoth = run(plan, [{ t: "pick", team: 1, index: 0 }], afterOne);
    expect(afterBoth.stage.t).toBe("reveal");
    expect(afterBoth.scores).toEqual([1, 0]);
  });

  it("odpoveď sa nedá po uzamknutí zmeniť", () => {
    const plan = buildQuizDuelPlan([classic], 0);
    const state = run(plan, [
      { t: "start" },
      { t: "pick", team: 0, index: 0 },
      { t: "pick", team: 0, index: 2 },
      { t: "pick", team: 1, index: 2 },
    ]);
    expect(state.scores).toEqual([0, 1]);
  });

  it("stávka musí byť zvolená oboma tímami, až potom prídu možnosti", () => {
    const plan: QuizDuelPlan = [{ question: classic, firstTeam: 0, wager: true }];
    const half = run(plan, [{ t: "start" }, { t: "wager", team: 0, value: "risk" }]);
    expect(half.stage.t).toBe("wager");
    const full = run(plan, [{ t: "wager", team: 1, value: "istota" }], half);
    expect(full.stage.t).toBe("answer");
  });

  it("tipni číslo prejde fázami odhad → rozhodnutie → odhalenie", () => {
    const plan = buildQuizDuelPlan([estimate], 0);
    let state = run(plan, [{ t: "start" }]);
    expect(state.stage).toEqual({ t: "guess", team: 0 });

    state = run(plan, [{ t: "guess", team: 0, value: 80 }], state);
    expect(state.stage.t).toBe("decide");

    state = run(plan, [{ t: "decide", value: "viac" }], state);
    expect(state.stage.t).toBe("reveal");
    expect(state.scores).toEqual([0, 1]);
  });

  it("nesprávny tím nemôže zadať číslo mimo svojho poradia", () => {
    const plan = buildQuizDuelPlan([closest], 0);
    const state = run(plan, [{ t: "start" }, { t: "guess", team: 1, value: 5 }]);
    expect(state.guesses).toEqual([null, null]);
    expect(state.stage).toEqual({ t: "guess", team: 0 });
  });

  it("najbližší tip vyžaduje odhad od oboch tímov v poradí", () => {
    const plan = buildQuizDuelPlan([closest], 1);
    let state = run(plan, [{ t: "start" }, { t: "guess", team: 1, value: 90 }]);
    expect(state.stage).toEqual({ t: "guess", team: 0 });
    state = run(plan, [{ t: "guess", team: 0, value: 200 }], state);
    expect(state.stage.t).toBe("reveal");
    expect(state.scores).toEqual([0, 1]);
  });

  it("skóre nikdy nespadne pod nulu ani po prehratom RISKu", () => {
    const plan: QuizDuelPlan = [{ question: classic, firstTeam: 0, wager: true }];
    const state = run(plan, [
      { t: "start" },
      { t: "wager", team: 0, value: "risk" },
      { t: "wager", team: 1, value: "risk" },
      { t: "pick", team: 0, index: 0 },
      { t: "pick", team: 1, index: 1 },
    ]);
    expect(state.outcome?.results[0].delta).toBe(-1);
    expect(state.scores).toEqual([0, 0]);
  });

  it("kolo sa uzavrie po poslednej otázke", () => {
    const questions: ResolvedQuizDuelQuestion[] = [classic, higherLower];
    const plan = buildQuizDuelPlan(questions, 0);
    let state = run(plan, [
      { t: "start" },
      { t: "pick", team: 0, index: 2 },
      { t: "pick", team: 1, index: 2 },
      { t: "next" },
    ]);
    expect(state.slot).toBe(1);
    expect(state.stage.t).toBe("brief");
    expect(state.finished).toBe(false);

    state = run(plan, [
      { t: "start" },
      { t: "verdict", team: 0, value: "viac" },
      { t: "verdict", team: 1, value: "viac" },
      { t: "next" },
    ], state);
    expect(state.finished).toBe(true);
    expect(state.scores).toEqual([2, 2]);
  });

  it("ignoruje akcie, ktoré do aktuálnej fázy nepatria", () => {
    const plan = buildQuizDuelPlan([classic], 0);
    const state = run(plan, [{ t: "pick", team: 0, index: 2 }, { t: "next" }]);
    expect(state.stage.t).toBe("brief");
    expect(state.picks).toEqual([null, null]);
  });
});

describe("formátovanie čísel", () => {
  it("zoskupuje tisíce a používa desatinnú čiarku", () => {
    expect(formatQuizNumber(2500)).toBe("2\u202f500");
    expect(formatQuizNumber(1250000)).toBe("1\u202f250\u202f000");
    expect(formatQuizNumber(42.195)).toBe("42,195");
    expect(formatQuizNumber(8)).toBe("8");
  });

  it("nezobrazí artefakty desatinnej aritmetiky", () => {
    // 60 − 56,7 dá v JS 3.3000000000000043
    expect(formatQuizNumber(guessDistance(56.7, 60))).toBe("3,3");
    expect(formatQuizNumber(guessDistance(1.4, 2))).toBe("0,6");
  });

  it("prečíta vstup z číselnej klávesnice", () => {
    expect(parseGuessInput("2500")).toBe(2500);
    expect(parseGuessInput("8,2")).toBe(8.2);
    expect(parseGuessInput("")).toBeNull();
    expect(parseGuessInput(",")).toBeNull();
  });
});
