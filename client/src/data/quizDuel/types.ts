import type { AppLanguage } from "../../i18n/LanguageProvider";

/**
 * ── Lokalizácia ─────────────────────────────────────────────────────────────
 *
 * Autorská podoba textu je obyčajný `string` v slovenčine. Keď sa otázka
 * preloží, string sa nahradí objektom `{ sk, en, de, … }`. Vďaka tomu sa dá
 * databáza lokalizovať po častiach bez toho, aby sa menila jej štruktúra.
 *
 * Slovenčina je jediný povinný jazyk. Kým preklad chýba, `resolveText` vráti
 * slovenský text — ale `quizDuelLocaleCoverage()` to hlási ako NEPRELOŽENÝ
 * obsah, takže slovenský fallback sa nikdy netvári ako hotový preklad.
 */
export type LocalizedText = { sk: string } & Partial<
  Record<Exclude<AppLanguage, "sk">, string>
>;

/** Buď slovenský string (ešte nepreložené), alebo mapa jazykov. */
export type Localizable = string | LocalizedText;

export function resolveText(value: Localizable, language: AppLanguage): string {
  if (typeof value === "string") return value;
  return value[language] ?? value.sk;
}

/** `true` iba ak pre daný jazyk existuje skutočný preklad (sk je vždy originál). */
export function hasTranslation(value: Localizable, language: AppLanguage): boolean {
  if (language === "sk") return true;
  if (typeof value === "string") return false;
  return typeof value[language] === "string" && value[language]!.trim().length > 0;
}

// ── Témy ─────────────────────────────────────────────────────────────────────

/**
 * Témy sú zámerne „bežný život a zaujímavé fakty“, nie školské predmety.
 * Filozofia databázy: „Neviem to presne, ale viem si to rozumne tipnúť.“
 */
export const QUIZ_DUEL_TOPICS = {
  zvierata: { emoji: "🐾", label: "Zvieratá" },
  telo: { emoji: "🫀", label: "Ľudské telo" },
  technika: { emoji: "📱", label: "Technika" },
  internet: { emoji: "🌐", label: "Internet" },
  jedlo: { emoji: "🍔", label: "Jedlo a pitie" },
  vesmir: { emoji: "🚀", label: "Vesmír" },
  priroda: { emoji: "🌍", label: "Príroda" },
  cestovanie: { emoji: "✈️", label: "Cestovanie" },
  film: { emoji: "🎬", label: "Filmy a hry" },
  sport: { emoji: "🏆", label: "Šport" },
  peniaze: { emoji: "💰", label: "Peniaze" },
  rekordy: { emoji: "📏", label: "Rekordy" },
  bizar: { emoji: "🤯", label: "Bizarné fakty" },
  zivot: { emoji: "🏠", label: "Každodenný život" },
} as const;

export type QuizDuelTopic = keyof typeof QUIZ_DUEL_TOPICS;

// ── Typy kôl ─────────────────────────────────────────────────────────────────

/**
 * `classic`      – 4 možnosti, oba tímy odpovedajú naraz, až potom reveal.
 * `estimate`     – „Tipni číslo“: tím A zadá odhad, tím B háda VIAC / MENEJ.
 * `closest`      – „Najbližší tip vyhráva“: oba tímy tajne zadajú číslo.
 * `higher-lower` – tvrdenie s číslom, oba tímy hádajú VIAC / MENEJ.
 */
export type QuizDuelKind = "classic" | "estimate" | "closest" | "higher-lower";

export type QuizDuelDifficulty = "lahke" | "tazke";

/** Typy, pri ktorých sa oba tímy vyjadrujú súčasne (a teda sú symetricky férové). */
export const SYMMETRIC_QUIZ_DUEL_KINDS: readonly QuizDuelKind[] = [
  "classic",
  "closest",
  "higher-lower",
];

/**
 * Typy, kde má každý tím vlastnú správnu/nesprávnu odpoveď — iba tam má zmysel
 * ponúkať ISTOTU / RISK. Pri `estimate` a `closest` je výsledok relatívny
 * (jeden tím nutne vyhrá), takže stávka by bola nezmyselná.
 */
export const WAGERABLE_QUIZ_DUEL_KINDS: readonly QuizDuelKind[] = [
  "classic",
  "higher-lower",
];

export function isWagerableKind(kind: QuizDuelKind): boolean {
  return WAGERABLE_QUIZ_DUEL_KINDS.includes(kind);
}

// ── Otázky ───────────────────────────────────────────────────────────────────

interface QuizDuelQuestionBase {
  /** Stabilné id — používa sa aj ako kľúč pre čerpanie bez opakovania. */
  id: string;
  topic: QuizDuelTopic;
  difficulty: QuizDuelDifficulty;
  /** Samotná otázka / tvrdenie. */
  prompt: Localizable;
  /** Jednoveta, ktorá fakt dovysvetlí. Zobrazí sa pri odhalení odpovede. */
  fact: Localizable;
  /** Zdroj faktu. Nepreklada sa — je to referencia, nie herný text. */
  source: string;
  /**
   * Rok, ku ktorému sa časovo premenlivý údaj vzťahuje. Ak je nastavený,
   * `prompt` MUSÍ tento rok obsahovať (kontroluje to test databázy), aby
   * správna odpoveď nezostarla bez toho, že by to hráč vedel.
   */
  asOf?: number;
}

/** Číselné jadro spoločné pre všetky tri číselné typy kôl. */
interface QuizDuelNumericCore {
  /** Správna hodnota v jednotke `unit`. Vzdialenosť tipu = |tip − value|. */
  value: number;
  /** Jednotka v tvare, v akom sa dopisuje za číslo („litrov“, „km“, „%“). */
  unit: Localizable;
  /** Ľudsky čitateľná podoba správnej hodnoty („2 500 000 litrov“). */
  display: Localizable;
}

export interface QuizDuelClassicQuestion extends QuizDuelQuestionBase {
  kind: "classic";
  options: [Localizable, Localizable, Localizable, Localizable];
  correctIndex: 0 | 1 | 2 | 3;
}

export interface QuizDuelEstimateQuestion
  extends QuizDuelQuestionBase,
    QuizDuelNumericCore {
  kind: "estimate";
}

export interface QuizDuelClosestQuestion
  extends QuizDuelQuestionBase,
    QuizDuelNumericCore {
  kind: "closest";
}

export interface QuizDuelHigherLowerQuestion
  extends QuizDuelQuestionBase,
    QuizDuelNumericCore {
  kind: "higher-lower";
  /** Číslo v tvrdení, ktoré tímy porovnávajú so skutočnou hodnotou. */
  claim: number;
  /** Ľudsky čitateľná podoba tvrdenia („5 000 km“). */
  claimDisplay: Localizable;
}

export type QuizDuelQuestion =
  | QuizDuelClassicQuestion
  | QuizDuelEstimateQuestion
  | QuizDuelClosestQuestion
  | QuizDuelHigherLowerQuestion;

export type QuizDuelNumericQuestion =
  | QuizDuelEstimateQuestion
  | QuizDuelClosestQuestion
  | QuizDuelHigherLowerQuestion;

export function isNumericQuestion(
  question: QuizDuelQuestion
): question is QuizDuelNumericQuestion {
  return question.kind !== "classic";
}

// ── Otázky po preklade (to, čo dostane UI) ───────────────────────────────────

interface ResolvedBase {
  id: string;
  topic: QuizDuelTopic;
  /** Hotový štítok témy, napr. „🐾 Zvieratá“. */
  topicLabel: string;
  difficulty: QuizDuelDifficulty;
  prompt: string;
  fact: string;
  source: string;
  asOf?: number;
}

interface ResolvedNumericCore {
  value: number;
  unit: string;
  display: string;
}

export interface ResolvedClassicQuestion extends ResolvedBase {
  kind: "classic";
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
}

export interface ResolvedEstimateQuestion extends ResolvedBase, ResolvedNumericCore {
  kind: "estimate";
}

export interface ResolvedClosestQuestion extends ResolvedBase, ResolvedNumericCore {
  kind: "closest";
}

export interface ResolvedHigherLowerQuestion
  extends ResolvedBase,
    ResolvedNumericCore {
  kind: "higher-lower";
  claim: number;
  claimDisplay: string;
}

export type ResolvedQuizDuelQuestion =
  | ResolvedClassicQuestion
  | ResolvedEstimateQuestion
  | ResolvedClosestQuestion
  | ResolvedHigherLowerQuestion;

export type ResolvedNumericQuestion =
  | ResolvedEstimateQuestion
  | ResolvedClosestQuestion
  | ResolvedHigherLowerQuestion;

export function resolveQuestion(
  question: QuizDuelQuestion,
  language: AppLanguage
): ResolvedQuizDuelQuestion {
  const topic = QUIZ_DUEL_TOPICS[question.topic];
  const base: ResolvedBase = {
    id: question.id,
    topic: question.topic,
    topicLabel: `${topic.emoji} ${topic.label}`,
    difficulty: question.difficulty,
    prompt: resolveText(question.prompt, language),
    fact: resolveText(question.fact, language),
    source: question.source,
    asOf: question.asOf,
  };

  if (question.kind === "classic") {
    return {
      ...base,
      kind: "classic",
      options: question.options.map((option) => resolveText(option, language)) as [
        string,
        string,
        string,
        string,
      ],
      correctIndex: question.correctIndex,
    };
  }

  const numeric: ResolvedNumericCore = {
    value: question.value,
    unit: resolveText(question.unit, language),
    display: resolveText(question.display, language),
  };

  if (question.kind === "higher-lower") {
    return {
      ...base,
      ...numeric,
      kind: "higher-lower",
      claim: question.claim,
      claimDisplay: resolveText(question.claimDisplay, language),
    };
  }

  return { ...base, ...numeric, kind: question.kind };
}
