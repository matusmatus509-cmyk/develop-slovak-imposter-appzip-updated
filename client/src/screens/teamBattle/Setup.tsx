import { useState } from "react";
import { Icons } from "../../components/icons";
import CustomContentSelector, {
  type CustomContentControls,
} from "../../components/CustomContentSelector";
import {
  GAME_LABELS,
  TEAM_COLORS,
  type GameType,
  type QuizDifficulty,
} from "../../data/teamBattle";
import PlayerNamesField from "../../components/PlayerNamesField";
import GameSettingsPage from "../../components/GameSettingsPage";
import { PartyBackdrop, PartyEyebrow } from "./PartyChrome";
/** Dizajn: Nočná herná aréna — kozmické pozadie, žiarivý mesiac a červený akcent. */
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

  const roundCount = selectionType === "random" ? randomRounds : null;
  const canStart = Boolean(names[0].trim() && names[1].trim());
  const quizDifficultyControls = (
    <div className="mt-5 border-t border-white/10 pt-4">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300/70">
        Náročnosť Kvízového súboja
      </p>
      <p className="mt-1 text-sm font-bold text-white/70">
        Platí pre tipovanie čísel aj klasické otázky
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {(
          [
            { value: "lahke", label: "Ľahšie", note: "Základné a známe fakty" },
            {
              value: "tazke",
              label: "Ťažšie",
              note: "Náročnejšie vedomostné výzvy",
            },
          ] as const
        ).map(({ value, label, note }) => (
          <button
            key={value}
            onClick={() => setQuizDifficulty(value)}
            aria-pressed={quizDifficulty === value}
            className={`rounded-2xl border p-3 text-left transition active:scale-95 ${
              quizDifficulty === value
                ? value === "lahke"
                  ? "border-emerald-300/70 bg-emerald-400/15 text-white"
                  : "border-rose-300/70 bg-rose-400/15 text-white"
                : "border-white/10 bg-white/[0.035] text-white/45"
            }`}
          >
            <span className="block text-sm font-black">{label}</span>
            <span className="mt-1 block text-[9px] leading-relaxed opacity-65">
              {note}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <PartyBackdrop>
      <main className="mobile-settings mobile-party-settings party-battle-settings scroll-panel h-full overflow-y-auto px-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="mx-auto w-full max-w-md">
          <header className="flex items-center justify-between">
            <button
              onClick={onBack}
              aria-label="Späť"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/70 backdrop-blur-xl transition active:scale-90"
            >
              <Icons.arrowLeft size={20} />
            </button>
            <PartyEyebrow>Party mode</PartyEyebrow>
            <div className="exit-slot-spacer" />
          </header>

          {/* Kozmická aréna: mesiac + hviezdy za emblémom, potom nadpis. */}
          <section className="party-battle-hero party-battle-hero-cosmic pb-7 pt-6 text-center">
            <div className="party-cosmic" aria-hidden="true" />
            <div className="relative z-10">
              <div className="party-arena-badge mx-auto flex items-center justify-center">
                <Icons.sword size={34} className="text-white" />
              </div>
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
                Nastavenie arény
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
                Pripravte tímovú bitku
              </h1>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/40">
                Pomenujte tímy a vyberte hry v želanom poradí alebo nechajte
                zostavu na náhodu.
              </p>
            </div>
          </section>

          <PlayerNamesField
            names={names}
            // Počet tímov je fixný na dva, takže dĺžka poľa sa nikdy nezmení.
            onChange={next => setNames([next[0], next[1]])}
            accent={blue}
            entity="teams"
            min={2}
            max={2}
            summary="Modrý a Červený tím"
            badgeFor={index => ({
              text: index === 0 ? "A" : "B",
              color: index === 0 ? blue : red,
            })}
            placeholderFor={index =>
              defaultTeamName(language, index === 0 ? "A" : "B")
            }
            className="arena-row-card"
          />

          <section className="party-selection-block mt-5">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                  Zostava hier
                </p>
                <p className="mt-1 text-sm font-bold text-white/70">
                  Vyberte hry alebo ich nechajte na náhodu
                </p>
              </div>
              <span className="arena-pill">
                {roundCount === null
                  ? "vlastná"
                  : `${roundCount} ${roundCount === 1 ? "kolo" : roundCount < 5 ? "kolá" : "kôl"}`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectionType("ordered")}
                className={`party-selection-card arena-card arena-card-own relative overflow-hidden rounded-[1.6rem] border p-5 text-left transition active:scale-[.97] ${
                  selectionType === "ordered" ? "is-selected" : ""
                }`}
              >
                {selectionType === "ordered" && (
                  <span className="arena-check" aria-hidden="true">
                    ✓
                  </span>
                )}
                <span className="arena-card-icon" aria-hidden="true">
                  <Icons.layoutDashboard size={20} />
                </span>
                <span className="block text-base font-black text-white">
                  Vlastný výber
                </span>
                <span className="mt-1 block text-[10px] leading-relaxed text-white/40">
                  Hry vyberiete po stlačení Hrať
                </span>
              </button>

              <button
                onClick={() => setSelectionType("random")}
                className={`party-selection-card arena-card arena-card-random relative overflow-hidden rounded-[1.6rem] border p-5 text-left transition active:scale-[.97] ${
                  selectionType === "random" ? "is-selected" : ""
                }`}
              >
                {selectionType === "random" && (
                  <span className="arena-check" aria-hidden="true">
                    ✓
                  </span>
                )}
                <span className="arena-card-icon" aria-hidden="true">
                  <Icons.dice size={20} />
                </span>
                <span className="mt-3 block text-base font-black text-white">
                  Náhodne
                </span>
                <span className="mt-1 block text-[10px] leading-relaxed text-white/40">
                  Aplikácia vyberie zostavu
                </span>
              </button>
            </div>
          </section>

          {selectionType === "random" ? (
            <section className="party-glass party-setup-panel mt-4 rounded-[1.75rem] p-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-fuchsia-300/65">
                  Náhodný výber
                </p>
                <p className="mt-1 text-sm font-bold text-white/70">
                  Vyberte počet kôl
                </p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[3, 5, 7].map(value => (
                  <button
                    key={value}
                    onClick={() => setRandomRounds(value)}
                    className={`rounded-2xl border py-3.5 transition active:scale-95 ${
                      randomRounds === value
                        ? "border-fuchsia-400/70 bg-gradient-to-b from-fuchsia-500/30 to-violet-600/20 text-white shadow-[0_10px_28px_rgba(168,85,247,.2)]"
                        : "border-white/10 bg-white/[0.035] text-white/40"
                    }`}
                  >
                    <span className="block text-2xl font-black">{value}</span>
                    <span className="mt-1 block text-[8px] font-black uppercase tracking-[0.14em]">
                      {value === 3
                        ? "Rýchla"
                        : value === 5
                          ? "Stredná"
                          : "Veľká"}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-center text-[10px] leading-relaxed text-white/30">
                Hry a poradie vyberie aplikácia náhodne. Posledné kolo bude
                kvízové finále.
              </p>
            </section>
          ) : null}

          {customControls && (
            <div className="mt-4">
              <CustomContentSelector controls={customControls} compact />
            </div>
          )}

          {/* Nastavenia hry — tempo kôl a náročnosť kvízu majú vlastnú
              stránku, aby setup obrazovka zostala krátka. */}
          <GameSettingsPage
            className="mt-4 arena-row-card"
            accent="#f97316"
            icon="timer"
            title="Pravidlá kôl"
            summary={`${quickRounds} rýchle výzvy · ${timeSeconds}s · kvíz: ${quizDifficulty === "lahke" ? "ľahší" : "ťažší"}`}
            description="Tempo celej bitky a náročnosť kvízu"
          >
            <section className="party-glass party-setup-panel rounded-[1.75rem] p-5">
              <div className="mt-0">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
                    Rýchle výzvy na tím
                  </p>
                  <span className="text-xs font-black text-emerald-300">
                    {quickRounds}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(value => (
                    <button
                      key={value}
                      onClick={() => setQuickRounds(value)}
                      className={`rounded-xl border py-3 text-sm font-black transition active:scale-95 ${quickRounds === value ? "border-emerald-300/65 bg-emerald-400/20 text-white" : "border-white/10 bg-white/[0.035] text-white/35"}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
                    Čas časovaných hier
                  </p>
                  <span className="text-xs font-black text-emerald-300">
                    {timeSeconds} s
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[30, 45, 60, 90].map(value => (
                    <button
                      key={value}
                      onClick={() => setTimeSeconds(value)}
                      className={`rounded-xl border py-3 text-sm font-black transition active:scale-95 ${timeSeconds === value ? "border-emerald-300/65 bg-emerald-400/20 text-white" : "border-white/10 bg-white/[0.035] text-white/35"}`}
                    >
                      {value}s
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-[10px] leading-relaxed text-white/30">
                  Platí pre pantomímu, šarády, zakázané slovo a pesničky. Krátke
                  výzvy majú vlastný rýchly limit.
                </p>
              </div>

              {/* Náročnosť kvízu platí v oboch režimoch — aj keď si hry vyberiete sami. */}
              {quizDifficultyControls}
            </section>
          </GameSettingsPage>

          <button
            onClick={() => {
              const options = { quickRounds, timeSeconds, quizDifficulty };
              if (selectionType === "random")
                onStart(names, randomRounds, options);
              else onStartManualSelection(names, options);
            }}
            disabled={!canStart}
            className="party-setup-start party-shine arena-cta mt-6 w-full overflow-hidden rounded-2xl px-6 py-5 text-base font-black uppercase tracking-[0.08em] text-white transition active:scale-[.97] disabled:opacity-40"
          >
            Hrať party hru
          </button>
        </div>
      </main>
    </PartyBackdrop>
  );
}
