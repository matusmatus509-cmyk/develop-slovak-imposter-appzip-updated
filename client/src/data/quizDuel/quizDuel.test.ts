import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  drawQuizDuelQuestions,
  quizDuelDeckStats,
  quizDuelLocaleCoverage,
  QUIZ_DUEL_QUESTIONS,
  QUIZ_DUEL_QUESTIONS_BY_KIND,
  QUIZ_DUEL_TOPICS,
  resolveQuestion,
  type QuizDuelKind,
} from "./index";

const KINDS = Object.keys(QUIZ_DUEL_QUESTIONS_BY_KIND) as QuizDuelKind[];
const ID_PREFIX: Record<QuizDuelKind, string> = {
  classic: "qd-cls-",
  estimate: "qd-est-",
  closest: "qd-clo-",
  "higher-lower": "qd-hil-",
};

/** Porovnanie bez diakritiky a bez ohľadu na veľkosť písmen — na hľadanie duplikátov. */
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

describe("štruktúra decku", () => {
  it("každý typ má dosť otázok na viac hier bez opakovania", () => {
    const stats = quizDuelDeckStats();
    for (const kind of KINDS) {
      expect(stats.byKind[kind].lahke, `${kind} — ľahké`).toBeGreaterThanOrEqual(10);
      expect(stats.byKind[kind].tazke, `${kind} — ťažké`).toBeGreaterThanOrEqual(10);
    }
    expect(stats.total).toBe(QUIZ_DUEL_QUESTIONS.length);
  });

  it("identifikátory sú jedinečné a majú predponu podľa typu", () => {
    const ids = QUIZ_DUEL_QUESTIONS.map(question => question.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const question of QUIZ_DUEL_QUESTIONS) {
      expect(question.id.startsWith(ID_PREFIX[question.kind]), question.id).toBe(true);
    }
  });

  it("žiadne dve otázky nehovoria o tom istom", () => {
    const prompts = new Map<string, string>();
    const facts = new Map<string, string>();
    for (const question of QUIZ_DUEL_QUESTIONS) {
      const prompt = normalize(question.prompt as string);
      expect(prompts.has(prompt), `duplicitná otázka: ${question.id} = ${prompts.get(prompt)}`).toBe(false);
      prompts.set(prompt, question.id);

      const fact = normalize(question.fact as string);
      expect(facts.has(fact), `duplicitný fakt: ${question.id} = ${facts.get(fact)}`).toBe(false);
      facts.set(fact, question.id);
    }
  });

  it("každá otázka má tému, fakt a zdroj", () => {
    for (const question of QUIZ_DUEL_QUESTIONS) {
      expect(QUIZ_DUEL_TOPICS[question.topic], question.id).toBeDefined();
      expect((question.prompt as string).length, question.id).toBeGreaterThan(10);
      expect((question.fact as string).length, question.id).toBeGreaterThan(20);
      expect(question.source.trim().length, question.id).toBeGreaterThan(3);
    }
  });

  it("otázky nie sú príliš dlhé na mobilnú obrazovku", () => {
    for (const question of QUIZ_DUEL_QUESTIONS) {
      expect((question.prompt as string).length, question.id).toBeLessThanOrEqual(95);
      if (question.kind === "classic") {
        for (const option of question.options) {
          expect((option as string).length, `${question.id}: ${option}`).toBeLessThanOrEqual(30);
        }
      }
    }
  });
});

describe("časovo premenlivé údaje", () => {
  it("otázka s rokom v texte má vyplnené pole asOf", () => {
    for (const question of QUIZ_DUEL_QUESTIONS) {
      const year = (question.prompt as string).match(/\b(?:19|20)\d{2}\b/);
      if (year) {
        expect(question.asOf, `${question.id} spomína rok ${year[0]} bez asOf`).toBe(
          Number(year[0])
        );
      }
    }
  });

  it("otázka s asOf má rok priamo v texte, aby odpoveď nezostarla", () => {
    for (const question of QUIZ_DUEL_QUESTIONS) {
      if (question.asOf === undefined) continue;
      expect(
        (question.prompt as string).includes(String(question.asOf)),
        `${question.id} nemá rok ${question.asOf} v otázke`
      ).toBe(true);
    }
  });
});

describe("klasické otázky", () => {
  it("majú štyri rôzne možnosti a platný správny index", () => {
    for (const question of QUIZ_DUEL_QUESTIONS_BY_KIND.classic) {
      if (question.kind !== "classic") continue;
      expect(question.options, question.id).toHaveLength(4);
      const unique = new Set(question.options.map(option => normalize(option as string)));
      expect(unique.size, `${question.id} má zhodné možnosti`).toBe(4);
      expect(question.correctIndex, question.id).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex, question.id).toBeLessThanOrEqual(3);
    }
  });

  it("správna odpoveď nie je stále na tom istom mieste", () => {
    const counts = [0, 0, 0, 0];
    for (const question of QUIZ_DUEL_QUESTIONS_BY_KIND.classic) {
      if (question.kind !== "classic") continue;
      counts[question.correctIndex] += 1;
    }
    const total = counts.reduce((sum, value) => sum + value, 0);
    for (const count of counts) {
      expect(count / total).toBeGreaterThan(0.1);
    }
  });
});

describe("číselné otázky", () => {
  it("majú konečnú hodnotu, jednotku aj čitateľný zápis", () => {
    for (const question of QUIZ_DUEL_QUESTIONS) {
      if (question.kind === "classic") continue;
      expect(Number.isFinite(question.value), question.id).toBe(true);
      expect(question.value, question.id).toBeGreaterThan(0);
      expect((question.unit as string).trim().length, question.id).toBeGreaterThan(0);
      expect((question.display as string).trim().length, question.id).toBeGreaterThan(0);
    }
  });

  it("tvrdenie pri VIAC/MENEJ nie je nikdy rovné skutočnej hodnote", () => {
    for (const question of QUIZ_DUEL_QUESTIONS_BY_KIND["higher-lower"]) {
      if (question.kind !== "higher-lower") continue;
      expect(question.claim, question.id).not.toBe(question.value);
      // Rozdiel musí byť jasný, inak by to bolo hádanie na hrane.
      const ratio = Math.abs(question.value - question.claim) / question.value;
      expect(ratio, `${question.id} má príliš tesné tvrdenie`).toBeGreaterThan(0.15);
    }
  });
});

describe("filozofia tipovania (Tipni číslo a Najbližší tip)", () => {
  const guessable = [
    ...QUIZ_DUEL_QUESTIONS_BY_KIND.estimate,
    ...QUIZ_DUEL_QUESTIONS_BY_KIND.closest,
  ];

  it("každá otázka sa naozaj pýta na číslo", () => {
    for (const question of guessable) {
      expect((question.prompt as string).endsWith("?"), question.id).toBe(true);
    }
  });

  /**
   * Zakázané formáty: dátumové a „kto bol“ otázky. Pri nich hráč nemá ako
   * vytvoriť rozumný tip — buď to vie, alebo netipuje, len háda naslepo.
   */
  it("neobsahuje dátumové ani „kto bol“ otázky", () => {
    const banned = [/^v ktorom roku/i, /^kto bol/i, /^kto je/i, /^ako sa (volal|volá)/i];
    for (const question of guessable) {
      const prompt = question.prompt as string;
      for (const pattern of banned) {
        expect(pattern.test(prompt), `${question.id}: ${prompt}`).toBe(false);
      }
    }
  });

  /**
   * Ak je hodnota prirodzene približná (`display` to priznáva slovom
   * „približne“), musí to hráč vidieť už v otázke — inak by čakal presné číslo.
   */
  it("približná hodnota je označená ako približná aj v otázke", () => {
    for (const question of guessable) {
      if (!(question.display as string).startsWith("približne")) continue;
      expect(
        (question.prompt as string).toLowerCase().includes("približne"),
        `${question.id} má približnú hodnotu, ale otázka to nepovie`
      ).toBe(true);
    }
  });

  it("v rámci typu neexistujú dve otázky s rovnakou hodnotou a jednotkou", () => {
    for (const kind of ["estimate", "closest"] as const) {
      const seen = new Map<string, string>();
      for (const question of QUIZ_DUEL_QUESTIONS_BY_KIND[kind]) {
        if (question.kind === "classic") continue;
        const key = `${question.value}|${normalize(question.unit as string)}`;
        expect(seen.has(key), `${question.id} duplikuje ${seen.get(key)}`).toBe(false);
        seen.set(key, question.id);
      }
    }
  });
});

describe("lokalizácia", () => {
  it("slovenčina je kompletná a ostatné jazyky sú priznane nepreložené", () => {
    const coverage = quizDuelLocaleCoverage();
    expect(coverage.sk.translated).toBe(QUIZ_DUEL_QUESTIONS.length);
    for (const language of ["en", "de", "es", "fr", "pt"] as const) {
      // Slovenský fallback sa nikdy nesmie počítať ako hotový preklad.
      expect(coverage[language].translated).toBe(0);
      expect(coverage[language].total).toBe(QUIZ_DUEL_QUESTIONS.length);
    }
  });

  it("otázka sa preloží do plochých textov pre UI", () => {
    const resolved = resolveQuestion(QUIZ_DUEL_QUESTIONS_BY_KIND.classic[0], "sk");
    expect(typeof resolved.prompt).toBe("string");
    expect(resolved.topicLabel).toContain(QUIZ_DUEL_TOPICS[resolved.topic].label);
  });
});

describe("náhodné čerpanie bez opakovania", () => {
  const store = new Map<string, string>();

  beforeAll(() => {
    // takePersistentItems si pamätá videné otázky v localStorage — v teste ho nahradíme.
    (globalThis as Record<string, unknown>).window = {
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => void store.set(key, value),
        removeItem: (key: string) => void store.delete(key),
      },
    };
  });

  afterAll(() => {
    delete (globalThis as Record<string, unknown>).window;
    store.clear();
  });

  it("v jednej hre sa žiadna otázka nezopakuje", () => {
    const kinds: QuizDuelKind[] = ["classic", "estimate", "closest", "higher-lower", "classic"];
    const drawn = drawQuizDuelQuestions("sk", "lahke", kinds);
    expect(drawn).toHaveLength(kinds.length);
    expect(new Set(drawn.map(question => question.id)).size).toBe(kinds.length);
    expect(drawn.map(question => question.kind)).toEqual(kinds);
  });

  it("otázka sa nevráti, kým sa deck nevyčerpá", () => {
    store.clear();
    const pool = QUIZ_DUEL_QUESTIONS_BY_KIND.closest.filter(q => q.difficulty === "lahke");
    const seen: string[] = [];
    for (let i = 0; i < pool.length; i++) {
      const [question] = drawQuizDuelQuestions("sk", "lahke", ["closest"]);
      seen.push(question.id);
    }
    expect(new Set(seen).size).toBe(pool.length);
  });

  it("po vyčerpaní decku začne nový cyklus", () => {
    store.clear();
    const pool = QUIZ_DUEL_QUESTIONS_BY_KIND.estimate.filter(q => q.difficulty === "tazke");
    const seen: string[] = [];
    for (let i = 0; i < pool.length * 2; i++) {
      const [question] = drawQuizDuelQuestions("sk", "tazke", ["estimate"]);
      seen.push(question.id);
    }
    expect(seen).toHaveLength(pool.length * 2);
    expect(new Set(seen).size).toBe(pool.length);
  });
});
