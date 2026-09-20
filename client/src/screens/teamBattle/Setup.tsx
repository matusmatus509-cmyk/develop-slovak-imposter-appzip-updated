import { useState, type CSSProperties } from "react";
import { Icons } from "../../components/icons";
import CustomContentSelector, {
  type CustomContentControls,
} from "../../components/CustomContentSelector";
import { type QuizDifficulty } from "../../data/teamBattle";
import PlayerNamesField from "../../components/PlayerNamesField";
import GameSettingsPage from "../../components/GameSettingsPage";
import { PartyBackdrop, PartyEyebrow } from "./PartyChrome";
import { PARTY_TEAM_IDENTITIES, partyTeamIdentity } from "./teamIdentity";
import { defaultTeamName, useLanguage } from "../../i18n/LanguageProvider";
import { partyModeArtV2 } from "../../media";

/**
 * ── Nastavenie Party modu ───────────────────────────────────────────────────
 *
 * Obrazovka sa musí zmestiť na jeden displej bez skrolovania. Preto má len päť
 * blokov a dva z nich sú iba SÚHRNY, ktoré si podrobnosti otvárajú na vlastnej
 * stránke (`PlayerNamesField`, `GameSettingsPage`):
 *
 *   hero → Tímy → Zostava hier → Pravidlá kôl → Hrať
 *
 * Medzikrok, keď boli všetky voľby rozbalené priamo tu, obrazovku natiahol na
 * dvojnásobok displeja. Rozloženie je flexbox: hero sa škáluje podľa výšky
 * displeja (`dvh`), riadky majú pevnú výšku a CTA je ukotvené dole.
 *
 * Farby: akcent Party modu (purpurová) nesie akcie a vybrané voľby, tímová
 * modrá a červená patria tímom. Nič iné na obrazovke farbu nemá.
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

/** Akcent akcií Party modu (modrá) a jeho protipól (červená) — pozri CSS
 * `.party-mode-experience` premenné `--pm-accent` / `--pm-rival`. */
const PARTY_ACCENT = "#4f9bff";
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

  /** Voľby pravidiel — obsah podstránky `Pravidlá kôl`. */
  const ruleControls = (
    <div className="ui ui-party">
      <section className="ui-panel">
        <div className="ui-panel-head">
          <h2 className="ui-panel-title">Tempo bitky</h2>
          <p className="ui-panel-sub">Koľko sa hrá a aké ťažké sú otázky</p>
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

      {customControls && (
        <section className="ui-panel">
          <div className="ui-panel-body" style={{ paddingTop: "0.95rem" }}>
            <CustomContentSelector
              controls={customControls}
              compact
              accent={PARTY_ACCENT}
            />
          </div>
        </section>
      )}
    </div>
  );

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
    <PartyBackdrop>
      {/* fit-or-scroll: obrazovka je navrhnutá na jeden displej, ale na
          extrémne nízkych displejoch sa radšej tichým skrolovaním nič
          neodreže. */}
      <main className="party-setup-screen fit-or-scroll flex h-full flex-col overflow-hidden px-5 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-[max(0.9rem,env(safe-area-inset-top))]">
        <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col">
          <header className="flex shrink-0 items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              aria-label="Späť"
              className="party-setup-back flex items-center justify-center rounded-2xl text-white/70 transition active:scale-90"
            >
              <Icons.arrowLeft size={21} />
            </button>
            <PartyEyebrow>Party mode</PartyEyebrow>
            <div className="exit-slot-spacer" />
          </header>

          {/* Hero s obrázkom arény — pozadie obrazovky, nie dekorácia navyše.
              Zároveň je to pružný blok: zvyšok voľnej výšky pohltí obrázok,
              takže pod poslednou voľbou nezostane prázdna plocha. */}
          <div className="party-setup-hero relative mt-3 overflow-hidden">
            <img src={partyModeArtV2} alt="" className="h-full w-full object-cover" />
            <span className="party-setup-hero-veil" aria-hidden="true" />
            <div className="party-setup-hero-copy">
              <span className="party-setup-kicker">
                <Icons.users size={13} /> Dva tímy · séria minihier
              </span>
              <h1 className="party-setup-title">Pripravte tímovú bitku</h1>
            </div>
          </div>

          {/* Súhrnné riadky: podrobnosti sa otvárajú na vlastnej stránke, takže
              nastavenia zostanú na jednej obrazovke. */}
          <div className="mt-3 flex shrink-0 flex-col gap-2.5">
            <PlayerNamesField
              names={names}
              // Počet tímov je fixný na dva, takže dĺžka poľa sa nikdy nezmení.
              onChange={next => setNames([next[0], next[1]])}
              accent={PARTY_ACCENT}
              entity="teams"
              min={2}
              max={2}
              summary={`${names[0].trim() || "Tím A"} vs ${names[1].trim() || "Tím B"}`}
              badgeFor={index => ({
                text: partyTeamIdentity(index).letter,
                color: partyTeamIdentity(index).color,
              })}
              placeholderFor={index =>
                defaultTeamName(language, partyTeamIdentity(index).letter)
              }
              className="party-setup-row"
            />

            {/* Strany tímov sú pevné celú hru — jeden riadok to povie bez toho,
                aby zaberal celý blok. */}
            <p className="party-setup-sides">
              {PARTY_TEAM_IDENTITIES.map(team => (
                <span key={team.letter} className="party-setup-side">
                  <i style={{ background: team.color }} aria-hidden="true" />
                  {team.letter} {team.sideArrow} {team.sideLabel.toLocaleLowerCase("sk")}
                </span>
              ))}
            </p>

            <section aria-label="Zostava hier" className="shrink-0">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectionType("ordered")}
                  aria-pressed={selectionType === "ordered"}
                  className="party-setup-choice"
                >
                  <span className="party-setup-choice-icon" aria-hidden="true">
                    <Icons.layoutDashboard size={22} />
                  </span>
                  <strong>Vyberieme si</strong>
                  <small>Hry aj poradie určíte vy</small>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectionType("random")}
                  aria-pressed={selectionType === "random"}
                  className="party-setup-choice party-setup-choice-rival"
                >
                  <span className="party-setup-choice-icon" aria-hidden="true">
                    <Icons.dice size={22} />
                  </span>
                  <strong>Náhodne</strong>
                  <small>Zostavu vyžrebuje appka</small>
                </button>
              </div>
            </section>

            <GameSettingsPage
              className="party-setup-row"
              accent={PARTY_ACCENT}
              icon="timer"
              title="Pravidlá kôl"
              summary={`${quickRounds}× výzvy · ${timeSeconds}s · kvíz ${quizDifficulty === "lahke" ? "ľahší" : "ťažší"}`}
              description="Tempo celej bitky a náročnosť kvízu"
            >
              {ruleControls}
            </GameSettingsPage>
          </div>

          <div className="mt-3 shrink-0">
            <button
              type="button"
              onClick={start}
              disabled={!canStart}
              className="party-cta party-setup-start flex w-full items-center justify-center gap-2"
              style={{ "--pm-cta-ink": "#fff" } as CSSProperties}
            >
              {selectionType === "random" ? "Vybrať dĺžku bitky" : "Vybrať minihry"}
              <Icons.chevronRight size={18} />
            </button>
          </div>
        </div>
      </main>
    </PartyBackdrop>
  );
}
