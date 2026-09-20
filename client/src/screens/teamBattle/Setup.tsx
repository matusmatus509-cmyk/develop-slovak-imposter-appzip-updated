import { useState, type CSSProperties } from "react";
import { Icons } from "../../components/icons";
import CustomContentSelector, {
  type CustomContentControls,
} from "../../components/CustomContentSelector";
import { type QuizDifficulty } from "../../data/teamBattle";
import { PARTY_TEAM_IDENTITIES } from "./teamIdentity";
import { defaultTeamName, useLanguage } from "../../i18n/LanguageProvider";

/**
 * ── Nastavenie Party modu ───────────────────────────────────────────────────
 *
 * Dizajn stojí na `.ui` systéme (rovnakom ako výber minihier): neutrálny
 * chróm, hierarchia z typografie, jedna škála zaoblenia. Farbu má na obrazovke
 * len to, čo ju nesie ako informáciu — akcent Party modu na aktívnych voľbách
 * a tímová modrá/červená na značkách A/B.
 *
 * Predchádzajúca verzia mala na jednej obrazovke oranžové „UPRAVIŤ",
 * smaragdové tempo, jantárový nadpis náročnosti, smaragdovo-ružovú obtiažnosť,
 * tyrkysovú kartu „Náhodne" a červené CTA — šesť nesúvisiacich odtieňov.
 *
 * Mená tímov sa zadávajú priamo tu. Sú vždy dve, takže podstránka „Upraviť"
 * (`PlayerNamesField`) pridávala klepnutie navyše a skrývala to, čo je na tejto
 * obrazovke najdôležitejšie.
 */

export type BattleSelection = "ordered" | "random";
export interface TeamBattleOptions {
  quickRounds: number;
  timeSeconds: number;
  quizDifficulty: QuizDifficulty;
}

/**
 * Celé rozpracované nastavenie arény. Setup sa pri prechode na výber kôl či
 * hier odmontuje, takže hodnoty si drží rodič a pri návrate ich vráti späť —
 * inak by si partia po stlačení Späť prepisovala mená tímov odznova.
 */
export interface TeamBattleSetupDraft {
  teamNames: [string, string];
  selectionType: BattleSelection;
  options: TeamBattleOptions;
}

const QUICK_ROUND_OPTIONS = [1, 2, 3, 4] as const;
const TIME_OPTIONS = [30, 45, 60, 90] as const;

export default function TeamBattleSetup({
  initialDraft,
  onBack,
  onStartRandomSelection,
  onStartManualSelection,
  customControls,
}: {
  /** Nastavenie z predchádzajúcej návštevy — po stlačení Späť sa obnoví. */
  initialDraft?: TeamBattleSetupDraft | null;
  onBack: () => void;
  /** Počet kôl sa vyberá na vlastnej obrazovke, preto tu ešte nie je známy. */
  onStartRandomSelection: (draft: TeamBattleSetupDraft) => void;
  onStartManualSelection: (draft: TeamBattleSetupDraft) => void;
  customControls?: CustomContentControls;
}) {
  const { language } = useLanguage();
  const [names, setNames] = useState<[string, string]>(
    () =>
      initialDraft?.teamNames ?? [
        defaultTeamName(language, "A"),
        defaultTeamName(language, "B"),
      ]
  );
  const [selectionType, setSelectionType] = useState<BattleSelection>(
    initialDraft?.selectionType ?? "ordered"
  );
  const [quickRounds, setQuickRounds] = useState(
    initialDraft?.options.quickRounds ?? 2
  );
  const [timeSeconds, setTimeSeconds] = useState(
    initialDraft?.options.timeSeconds ?? 60
  );
  const [quizDifficulty, setQuizDifficulty] = useState<QuizDifficulty>(
    initialDraft?.options.quizDifficulty ?? "lahke"
  );

  const canStart = Boolean(names[0].trim() && names[1].trim());

  function setName(index: 0 | 1, value: string) {
    setNames(current =>
      index === 0 ? [value, current[1]] : [current[0], value]
    );
  }

  function start() {
    // Obe cesty pokračujú na vlastnú obrazovku — náhodná na výber dĺžky bitky,
    // vlastná na výber hier. Rodič si draft odloží, aby sa dal po stlačení
    // Späť obnoviť.
    const draft: TeamBattleSetupDraft = {
      teamNames: names,
      selectionType,
      options: { quickRounds, timeSeconds, quizDifficulty },
    };
    if (selectionType === "random") onStartRandomSelection(draft);
    else onStartManualSelection(draft);
  }

  return (
    <main className="ui ui-party ui-screen scroll-panel">
      <div className="ui-wrap">
        <div className="ui-bar">
          <button
            type="button"
            onClick={onBack}
            aria-label="Späť"
            className="ui-back"
          >
            <Icons.arrowLeft size={19} />
          </button>
          <span className="ui-bar-title">Party mode</span>
        </div>

        <header className="ui-head">
          <h1 className="ui-title">Tímová bitka</h1>
          <p className="ui-lead">
            Dva tímy, séria minihier a finále za trojnásobné body. Telefón leží
            na stole medzi tímami a strany sa počas hry nemenia.
          </p>
        </header>

        {/* ── Tímy ─────────────────────────────────────────────────────────
            Mená sú prvé, pretože sú jediné, čo partia musí zadať. Značka
            nesie tímovú farbu a stranu, pri ktorej tím sedí celú hru. */}
        <section
          className="flex flex-col gap-[0.65rem]"
          aria-label="Názvy tímov"
        >
          {PARTY_TEAM_IDENTITIES.map(team => (
            <label
              key={team.letter}
              className="ui-field"
              style={{ "--ui-field-accent": team.color } as CSSProperties}
            >
              <span
                className="ui-field-mark"
                style={{ background: team.color }}
                aria-hidden="true"
              >
                {team.letter}
              </span>
              <span className="ui-field-body">
                {/* Popis nesie stranu, nie „Tím A" — to už hovorí značka aj
                    samotné meno v políčku. */}
                <span className="ui-field-label">
                  Tím {team.letter} · {team.sideArrow} {team.sideLabel.toLocaleLowerCase("sk")}
                </span>
                <input
                  value={names[team.index]}
                  onChange={event => setName(team.index, event.target.value)}
                  placeholder={defaultTeamName(language, team.letter)}
                  maxLength={20}
                  aria-label={`Názov tímu ${team.letter}`}
                />
              </span>
            </label>
          ))}
        </section>

        {/* ── Zostava hier ────────────────────────────────────────────────── */}
        <section className="ui-panel" style={{ marginTop: "0.65rem" }}>
          <div className="ui-panel-head">
            <h2 className="ui-panel-title">Zostava hier</h2>
            <p className="ui-panel-sub">
              Kto rozhodne, ktoré minihry sa budú hrať
            </p>
          </div>
          <div className="ui-panel-body">
            <div className="grid grid-cols-2 gap-[0.5rem]">
              <button
                type="button"
                onClick={() => setSelectionType("ordered")}
                aria-pressed={selectionType === "ordered"}
                className="ui-choice"
              >
                <span className="ui-choice-name">Vyberieme si</span>
                <span className="ui-choice-note">
                  Hry aj ich poradie určíte vy
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectionType("random")}
                aria-pressed={selectionType === "random"}
                className="ui-choice"
              >
                <span className="ui-choice-name">Náhodne</span>
                <span className="ui-choice-note">
                  Zostavu vyžrebuje aplikácia
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Tempo bitky ─────────────────────────────────────────────────── */}
        <section className="ui-panel">
          <div className="ui-panel-head">
            <h2 className="ui-panel-title">Tempo bitky</h2>
            <p className="ui-panel-sub">
              Koľko sa hrá a aké ťažké sú otázky
            </p>
          </div>
          <div className="ui-panel-body">
            <div className="ui-setting">
              <div className="ui-setting-head">
                <span className="ui-setting-name">Rýchle výzvy na tím</span>
                <span className="ui-setting-value">{quickRounds}×</span>
              </div>
              <div className="ui-seg ui-seg-4" role="group">
                {QUICK_ROUND_OPTIONS.map(value => (
                  <button
                    key={value}
                    type="button"
                    className="ui-seg-opt"
                    aria-pressed={quickRounds === value}
                    onClick={() => setQuickRounds(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="ui-setting">
              <div className="ui-setting-head">
                <span className="ui-setting-name">Čas časovaných hier</span>
                <span className="ui-setting-value">{timeSeconds} s</span>
              </div>
              <div className="ui-seg ui-seg-4" role="group">
                {TIME_OPTIONS.map(value => (
                  <button
                    key={value}
                    type="button"
                    className="ui-seg-opt"
                    aria-pressed={timeSeconds === value}
                    onClick={() => setTimeSeconds(value)}
                  >
                    {value}s
                  </button>
                ))}
              </div>
              <p className="ui-setting-note">
                Platí pre pantomímu, šarády, zakázané slovo a pesničky. Krátke
                výzvy majú vlastný rýchly limit.
              </p>
            </div>

            <div className="ui-setting">
              <div className="ui-setting-head">
                <span className="ui-setting-name">Náročnosť kvízu</span>
                <span className="ui-setting-value">
                  {quizDifficulty === "lahke" ? "Ľahšia" : "Ťažšia"}
                </span>
              </div>
              <div className="ui-seg ui-seg-2" role="group">
                {(
                  [
                    { value: "lahke", label: "Ľahšia", note: "Známe fakty" },
                    { value: "tazke", label: "Ťažšia", note: "Pre znalcov" },
                  ] as const
                ).map(({ value, label, note }) => (
                  <button
                    key={value}
                    type="button"
                    className="ui-seg-opt"
                    aria-pressed={quizDifficulty === value}
                    onClick={() => setQuizDifficulty(value)}
                  >
                    {label}
                    <small>{note}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Vlastné kartičky ────────────────────────────────────────────── */}
        {customControls && (
          <section className="ui-panel">
            <div className="ui-panel-body" style={{ paddingTop: "0.95rem" }}>
              {/* Akcent Party modu — panel je jediné miesto, kde by sa inak
                  objavila smaragdová farba z iných hier. */}
              <CustomContentSelector
                controls={customControls}
                compact
                accent="#ffc247"
              />
            </div>
          </section>
        )}

        <div style={{ marginTop: "1.1rem" }}>
          <button
            type="button"
            onClick={start}
            disabled={!canStart}
            className="ui-cta"
          >
            <span>
              {selectionType === "random"
                ? "Vybrať dĺžku bitky"
                : "Vybrať minihry"}
            </span>
            <span className="ui-cta-arrow" aria-hidden="true">
              <Icons.chevronRight size={17} />
            </span>
          </button>
          {!canStart && (
            <p className="ui-setting-note" style={{ textAlign: "center" }}>
              Oba tímy potrebujú názov.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
