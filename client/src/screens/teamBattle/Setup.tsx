import { useState, type CSSProperties } from "react";
import { Icons } from "../../components/icons";
import CustomContentSelector, {
  type CustomContentControls,
} from "../../components/CustomContentSelector";
import {
  TEAM_COLORS,
  type GameType,
  type QuizDifficulty,
} from "../../data/teamBattle";
/**
 * Dizajn: nastavenia sú vecný formulár — vlasové linky, jedna škála zaoblenia
 * a farba len tam, kde niečo znamená (tímy, náročnosť). Vlastný výber minihier
 * sa naďalej otvára až po stlačení Hrať party hru.
 */
import { defaultTeamName, useLanguage } from "../../i18n/LanguageProvider";

type BattleSelection = "ordered" | "random";
export interface TeamBattleOptions {
  quickRounds: number;
  timeSeconds: number;
  quizDifficulty: QuizDifficulty;
}
export default function TeamBattleSetup({
  onBack,
  onStart,
  onStartManualSelection,
  customControls,
}: {
  onBack: () => void;
  onStart: (
    teamNames: [string, string],
    selection: number | GameType[],
    options: TeamBattleOptions
  ) => void;
  onStartManualSelection: (
    teamNames: [string, string],
    options: TeamBattleOptions
  ) => void;
  customControls?: CustomContentControls;
}) {
  const { language } = useLanguage();
  const [names, setNames] = useState<[string, string]>([
    defaultTeamName(language, "A"),
    defaultTeamName(language, "B"),
  ]);
  const [selectionType, setSelectionType] =
    useState<BattleSelection>("ordered");
  const [randomRounds, setRandomRounds] = useState(5);
  const [quickRounds, setQuickRounds] = useState(2);
  const [timeSeconds, setTimeSeconds] = useState(60);
  const [quizDifficulty, setQuizDifficulty] = useState<QuizDifficulty>("lahke");
  const [blue, red] = TEAM_COLORS;

  function setName(index: 0 | 1, value: string) {
    setNames(current => {
      const next = [...current] as [string, string];
      next[index] = value;
      return next;
    });
  }

  const roundCount = selectionType === "random" ? randomRounds : null;
  const canStart = Boolean(names[0].trim() && names[1].trim());
  const quizDifficultyControls = (
    <div className="mt-4 border-t border-[var(--ui-line)] pt-3.5">
      <p className="ui-panel-sub !mt-0 mb-2">
        Náročnosť Kvízového súboja — platí pre tipovanie čísel aj klasické otázky.
      </p>
      <div className="grid grid-cols-2 gap-[var(--ui-gap)]">
        {(
          [
            { value: "lahke", label: "Ľahšie", note: "Základné a známe fakty", accent: "#4ea87a" },
            { value: "tazke", label: "Ťažšie", note: "Náročnejšie výzvy", accent: "#d9694f" },
          ] as const
        ).map(({ value, label, note, accent }) => (
          <button
            key={value}
            onClick={() => setQuizDifficulty(value)}
            aria-pressed={quizDifficulty === value}
            className="ui-choice"
            style={{ "--ui-choice-accent": accent } as CSSProperties}
          >
            <span className="ui-choice-name">{label}</span>
            <span className="ui-choice-note">{note}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <main className="ui ui-screen scroll-panel">
      <div className="ui-wrap">
        <div className="ui-bar">
          <button onClick={onBack} aria-label="Späť" className="ui-back">
            <Icons.arrowLeft size={19} />
          </button>
          <span className="ui-bar-title">Party mode</span>
          <span className="ui-bar-note">
            {roundCount === null ? "vlastná zostava" : `${roundCount} kôl`}
          </span>
        </div>

        <header className="ui-head">
          <h1 className="ui-title">Pripravte tímovú bitku</h1>
          <p className="ui-lead">
            Pomenujte tímy, zvoľte zostavu hier a nastavte tempo. Party mode
            potom prevedie partiu celým večerom.
          </p>
        </header>

        {/* ── Tímy ─────────────────────────────────────────────────────── */}
        {/* Farbu tu nesie tím, nie dekorácia — modrá a červená majú význam. */}
        <div className="grid gap-[var(--ui-gap)]">
          {([0, 1] as const).map(index => {
            const color = index === 0 ? blue : red;
            return (
              <label
                key={index}
                className="ui-field"
                style={{ "--ui-field-accent": color } as CSSProperties}
              >
                <span className="ui-field-mark" style={{ background: color }}>
                  {index === 0 ? "A" : "B"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="ui-field-label">
                    {index === 0 ? "Modrý tím" : "Červený tím"}
                  </span>
                  <input
                    value={names[index]}
                    onChange={event => setName(index, event.target.value)}
                    placeholder={defaultTeamName(language, index === 0 ? "A" : "B")}
                    maxLength={20}
                  />
                </span>
              </label>
            );
          })}
        </div>

        {/* ── Zostava hier ─────────────────────────────────────────────── */}
        <section className="ui-panel mt-[var(--ui-gap)]">
          <div className="ui-panel-head">
            <h2 className="ui-panel-title">Zostava hier</h2>
            <p className="ui-panel-sub">
              Vyberte hry sami alebo ich nechajte na náhodu.
            </p>
          </div>
          <div className="ui-panel-body">
            <div className="grid grid-cols-2 gap-[var(--ui-gap)]">
              <button
                onClick={() => setSelectionType("ordered")}
                aria-pressed={selectionType === "ordered"}
                className="ui-choice"
                style={{ "--ui-choice-accent": "#4cc4d6" } as CSSProperties}
              >
                <span className="ui-choice-name">Vlastný výber</span>
                <span className="ui-choice-note">
                  Hry vyberiete po stlačení Hrať
                </span>
              </button>
              <button
                onClick={() => setSelectionType("random")}
                aria-pressed={selectionType === "random"}
                className="ui-choice"
                style={{ "--ui-choice-accent": "#e0a83c" } as CSSProperties}
              >
                <span className="ui-choice-name">Náhodne</span>
                <span className="ui-choice-note">
                  Zostavu vyberie aplikácia
                </span>
              </button>
            </div>

            {selectionType === "random" && (
              <div className="mt-[var(--ui-gap)]">
                <p className="ui-panel-sub mb-2">Počet kôl</p>
                <div className="ui-seg ui-seg-3">
                  {[3, 5, 7].map(value => (
                    <button
                      key={value}
                      onClick={() => setRandomRounds(value)}
                      aria-pressed={randomRounds === value}
                      className="ui-seg-opt"
                    >
                      {value}
                      <small>
                        {value === 3 ? "Rýchla" : value === 5 ? "Stredná" : "Veľká"}
                      </small>
                    </button>
                  ))}
                </div>
                <p className="ui-panel-sub mt-2">
                  Posledné kolo bude vždy kvízové finále.
                </p>
              </div>
            )}
          </div>
        </section>

        {customControls && (
          <div className="mt-[var(--ui-gap)]">
            <CustomContentSelector controls={customControls} compact />
          </div>
        )}

        {/* ── Tempo kôl ────────────────────────────────────────────────── */}
        <section className="ui-panel mt-[var(--ui-gap)]">
          <div className="ui-panel-head">
            <h2 className="ui-panel-title">Tempo kôl</h2>
            <p className="ui-panel-sub">Koľko výziev a koľko času na ne.</p>
          </div>
          <div className="ui-panel-body">
            <div className="mb-1 flex items-baseline justify-between">
              <p className="ui-panel-sub !mt-0">Rýchle výzvy na tím</p>
              <span className="text-[0.78rem] font-bold tabular-nums">
                {quickRounds}
              </span>
            </div>
            <div className="ui-seg ui-seg-4">
              {[1, 2, 3, 4].map(value => (
                <button
                  key={value}
                  onClick={() => setQuickRounds(value)}
                  aria-pressed={quickRounds === value}
                  className="ui-seg-opt"
                >
                  {value}
                </button>
              ))}
            </div>

            <div className="mb-1 mt-4 flex items-baseline justify-between">
              <p className="ui-panel-sub !mt-0">Čas časovaných hier</p>
              <span className="text-[0.78rem] font-bold tabular-nums">
                {timeSeconds} s
              </span>
            </div>
            <div className="ui-seg ui-seg-4">
              {[30, 45, 60, 90].map(value => (
                <button
                  key={value}
                  onClick={() => setTimeSeconds(value)}
                  aria-pressed={timeSeconds === value}
                  className="ui-seg-opt"
                >
                  {value}s
                </button>
              ))}
            </div>
            <p className="ui-panel-sub mt-2">
              Platí pre pantomímu, šarády, zakázané slovo a pesničky. Krátke
              výzvy majú vlastný rýchly limit.
            </p>

            {/* Náročnosť kvízu platí v oboch režimoch — aj keď si hry vyberiete sami. */}
            {quizDifficultyControls}
          </div>
        </section>

        <div className="mt-4 pb-2">
          <button
            onClick={() => {
              const options = { quickRounds, timeSeconds, quizDifficulty };
              if (selectionType === "random") onStart(names, randomRounds, options);
              else onStartManualSelection(names, options);
            }}
            disabled={!canStart}
            className="ui-cta"
          >
            <span>Hrať party hru</span>
            <span className="ui-cta-arrow" aria-hidden="true">
              <Icons.chevronRight size={18} />
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
