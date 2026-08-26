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
import { PartyBackdrop, PartyEyebrow } from "./PartyChrome";
/** Dizajn: Nočný herný salón — vlastný výber minihier sa otvorí až po stlačení Začať party hru, nie priamo v nastaveniach. */
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

          <section className="party-battle-hero pb-7 pt-8 text-center">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] border border-white/15 bg-gradient-to-br from-violet-500/40 to-fuchsia-500/15 shadow-[0_20px_55px_rgba(168,85,247,.3)]">
              <Icons.sword size={39} className="text-white" />
            </div>
            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-300/70">
              Nastavenie arény
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
              Pripravte tímovú bitku
            </h1>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/40">
              Pomenujte tímy a vyberte hry v želanom poradí alebo nechajte
              zostavu na náhodu.
            </p>
          </section>

          <PlayerNamesField
            className="party-team-fields"
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
              <span className="rounded-xl bg-fuchsia-500/15 px-3 py-2 text-xs font-black text-fuchsia-300">
                {roundCount === null
                  ? "vlastná"
                  : `${roundCount} ${roundCount === 1 ? "kolo" : roundCount < 5 ? "kolá" : "kôl"}`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectionType("ordered")}
                className={`party-selection-card relative overflow-hidden rounded-[1.6rem] border p-5 text-left transition active:scale-[.97] ${
                  selectionType === "ordered"
                    ? "border-cyan-300/65 bg-cyan-500/15 shadow-[0_15px_45px_rgba(34,211,238,.2)]"
                    : "border-white/10 bg-white/[0.045]"
                }`}
              >
                {selectionType === "ordered" && (
                  <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-xs font-black text-[#071318]">
                    ✓
                  </span>
                )}
                <span className="block text-base font-black text-white">
                  Vlastný výber
                </span>
                <span className="mt-1 block text-[10px] leading-relaxed text-white/40">
                  Hry vyberiete po stlačení Hrať
                </span>
              </button>

              <button
                onClick={() => setSelectionType("random")}
                className={`party-selection-card relative overflow-hidden rounded-[1.6rem] border p-5 text-left transition active:scale-[.97] ${
                  selectionType === "random"
                    ? "border-fuchsia-300/65 bg-fuchsia-500/20 shadow-[0_15px_45px_rgba(168,85,247,.25)]"
                    : "border-white/10 bg-white/[0.045]"
                }`}
              >
                {selectionType === "random" && (
                  <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-400 text-xs font-black text-white">
                    ✓
                  </span>
                )}
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

          <section className="party-glass party-setup-panel mt-4 rounded-[1.75rem] p-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300/70">
                Pravidlá kôl
              </p>
              <p className="mt-1 text-sm font-bold text-white/70">
                Nastavte tempo celej bitky
              </p>
            </div>

            <div className="mt-5">
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

          <button
            onClick={() => {
              const options = { quickRounds, timeSeconds, quizDifficulty };
              if (selectionType === "random")
                onStart(names, randomRounds, options);
              else onStartManualSelection(names, options);
            }}
            disabled={!canStart}
            className="party-setup-start party-shine mt-6 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-6 py-5 text-base font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_50px_rgba(168,85,247,.35)] transition active:scale-[.97] disabled:opacity-40"
          >
            Hrať party hru
          </button>
        </div>
      </main>
    </PartyBackdrop>
  );
}
