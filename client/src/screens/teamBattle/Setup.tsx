import { useState, type CSSProperties } from "react";
import { Icons } from "../../components/icons";
import CustomContentSelector, { type CustomContentControls } from "../../components/CustomContentSelector";
import { TEAM_COLORS, type QuizDifficulty } from "../../data/teamBattle";
import PlayerNamesField from "../../components/PlayerNamesField";
import GameSettingsPage from "../../components/GameSettingsPage";
import { PartyBackdrop, PartyEyebrow } from "./PartyChrome";
import { defaultTeamName, useLanguage } from "../../i18n/LanguageProvider";
import { partyModeArtV2 } from "../../media";

export type BattleSelection = "ordered" | "random";
export interface TeamBattleOptions { quickRounds: number; timeSeconds: number; quizDifficulty: QuizDifficulty; }
export interface TeamBattleSetupDraft { teamNames: [string, string]; selectionType: BattleSelection; options: TeamBattleOptions; }

export default function TeamBattleSetup({ initialDraft, onBack, onStartRandomSelection, onStartManualSelection, customControls }: {
  initialDraft?: TeamBattleSetupDraft | null;
  onBack: () => void;
  onStartRandomSelection: (draft: TeamBattleSetupDraft) => void;
  onStartManualSelection: (draft: TeamBattleSetupDraft) => void;
  customControls?: CustomContentControls;
}) {
  const { language } = useLanguage();
  const [names, setNames] = useState<[string, string]>(() => initialDraft?.teamNames ?? [defaultTeamName(language, "A"), defaultTeamName(language, "B")]);
  const [selectionType, setSelectionType] = useState<BattleSelection>(initialDraft?.selectionType ?? "ordered");
  const [quickRounds, setQuickRounds] = useState(initialDraft?.options.quickRounds ?? 2);
  const [timeSeconds, setTimeSeconds] = useState(initialDraft?.options.timeSeconds ?? 60);
  const [quizDifficulty, setQuizDifficulty] = useState<QuizDifficulty>(initialDraft?.options.quizDifficulty ?? "lahke");
  const [blue, red] = TEAM_COLORS;
  const canStart = Boolean(names[0].trim() && names[1].trim());

  return (
    <PartyBackdrop>
      <main className="mobile-settings mobile-party-settings party-battle-settings scroll-panel h-full overflow-y-auto px-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="mx-auto w-full max-w-md">
          <header className="flex items-center justify-between">
            <button onClick={onBack} aria-label="Späť" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/70 backdrop-blur-xl transition active:scale-90"><Icons.arrowLeft size={20} /></button>
            <PartyEyebrow>Party mode</PartyEyebrow><div className="exit-slot-spacer" />
          </header>

          <div className="game-setup-hero relative mt-5 h-48 overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl" style={{ "--setup-accent": "#a78bfa" } as CSSProperties}>
            <img src={partyModeArtV2} alt="" className="h-full w-full object-cover transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080b13]/95 via-[#080b13]/35 to-transparent" /><div className="absolute inset-0 bg-gradient-to-t from-[#080b13]/85 via-transparent to-black/10" />
            <div className="absolute inset-x-5 bottom-5"><span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[8px] font-black uppercase tracking-[.2em] text-white/80 backdrop-blur"><Icons.sword size={12} /> Nastavenie arény</span><h1 className="max-w-[18rem] text-[2rem] font-black leading-[.98] tracking-[-.04em] text-white">Pripravte tímovú bitku</h1></div>
          </div>

          <section className="mt-4 grid grid-cols-2 gap-3" aria-label="Pevné strany tímov">
            <div className="rounded-2xl border p-3 text-left" style={{ borderColor: `${blue}88`, background: `${blue}20` }}><span className="text-[8px] font-black tracking-widest text-white/50">ĽAVÁ STRANA · A</span><strong className="mt-1 block truncate text-sm" style={{ color: blue }}>{names[0]}</strong><small className="text-[9px] text-white/40">Modrý počas celej hry</small></div>
            <div className="rounded-2xl border p-3 text-right" style={{ borderColor: `${red}88`, background: `${red}20` }}><span className="text-[8px] font-black tracking-widest text-white/50">PRAVÁ STRANA · B</span><strong className="mt-1 block truncate text-sm" style={{ color: red }}>{names[1]}</strong><small className="text-[9px] text-white/40">Červený počas celej hry</small></div>
          </section>

          <PlayerNamesField names={names} onChange={next => setNames([next[0], next[1]])} accent={blue} entity="teams" min={2} max={2} summary="A: ľavá modrá · B: pravá červená" badgeFor={index => ({ text: index === 0 ? "A" : "B", color: index === 0 ? blue : red })} placeholderFor={index => defaultTeamName(language, index === 0 ? "A" : "B")} className="arena-row-card mt-4" />

          <section className="party-selection-block mt-5"><div className="grid grid-cols-2 gap-3">
            <button onClick={() => setSelectionType("ordered")} className={`party-selection-card arena-card arena-card-own relative overflow-hidden rounded-[1.6rem] border p-5 text-left transition active:scale-[.97] ${selectionType === "ordered" ? "is-selected" : ""}`}>{selectionType === "ordered" && <span className="arena-check" aria-hidden="true">✓</span>}<span className="arena-card-icon" aria-hidden="true"><Icons.layoutDashboard size={20} /></span><span className="block text-base font-black text-white">Vlastný výber</span><span className="mt-1 block text-[10px] leading-relaxed text-white/40">Hry vyberiete po stlačení Hrať</span></button>
            <button onClick={() => setSelectionType("random")} className={`party-selection-card arena-card arena-card-random relative overflow-hidden rounded-[1.6rem] border p-5 text-left transition active:scale-[.97] ${selectionType === "random" ? "is-selected" : ""}`}>{selectionType === "random" && <span className="arena-check" aria-hidden="true">✓</span>}<span className="arena-card-icon" aria-hidden="true"><Icons.dice size={20} /></span><span className="mt-3 block text-base font-black text-white">Náhodne</span><span className="mt-1 block text-[10px] leading-relaxed text-white/40">Aplikácia vyberie zostavu</span></button>
          </div></section>

          <GameSettingsPage className="mt-4 arena-row-card" accent="#f97316" icon="timer" title="Pravidlá kôl" summary={`${quickRounds} rýchle výzvy · ${timeSeconds}s · kvíz: ${quizDifficulty === "lahke" ? "ľahší" : "ťažší"}${customControls?.selection.enabled ? " · vlastné kartičky" : ""}`} description="Tempo celej bitky a náročnosť kvízu">
            <section className="party-glass party-setup-panel rounded-[1.75rem] p-5">
              <div><div className="flex items-center justify-between"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Rýchle výzvy na tím</p><span className="text-xs font-black text-emerald-300">{quickRounds}</span></div><div className="mt-2 grid grid-cols-4 gap-2">{[1,2,3,4].map(value => <button key={value} onClick={() => setQuickRounds(value)} className={`rounded-xl border py-3 text-sm font-black transition active:scale-95 ${quickRounds === value ? "border-emerald-300/65 bg-emerald-400/20 text-white" : "border-white/10 bg-white/[0.035] text-white/35"}`}>{value}</button>)}</div></div>
              <div className="mt-5"><div className="flex items-center justify-between"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Čas časovaných hier</p><span className="text-xs font-black text-emerald-300">{timeSeconds} s</span></div><div className="mt-2 grid grid-cols-4 gap-2">{[30,45,60,90].map(value => <button key={value} onClick={() => setTimeSeconds(value)} className={`rounded-xl border py-3 text-sm font-black transition active:scale-95 ${timeSeconds === value ? "border-emerald-300/65 bg-emerald-400/20 text-white" : "border-white/10 bg-white/[0.035] text-white/35"}`}>{value}s</button>)}</div></div>
              <div className="mt-5 border-t border-white/10 pt-4"><p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300/70">Náročnosť Kvízového súboja</p><div className="mt-3 grid grid-cols-2 gap-2">{([{ value: "lahke", label: "Ľahšie" }, { value: "tazke", label: "Ťažšie" }] as const).map(({ value, label }) => <button key={value} onClick={() => setQuizDifficulty(value)} aria-pressed={quizDifficulty === value} className={`rounded-2xl border p-3 text-left text-sm font-black transition active:scale-95 ${quizDifficulty === value ? "border-emerald-300/70 bg-emerald-400/15 text-white" : "border-white/10 bg-white/[0.035] text-white/45"}`}>{label}</button>)}</div></div>
              {customControls && <div className="mt-5 border-t border-white/10 pt-4"><CustomContentSelector controls={customControls} compact /></div>}
            </section>
          </GameSettingsPage>

          <button onClick={() => { const draft: TeamBattleSetupDraft = { teamNames: names, selectionType, options: { quickRounds, timeSeconds, quizDifficulty } }; selectionType === "random" ? onStartRandomSelection(draft) : onStartManualSelection(draft); }} disabled={!canStart} className="party-setup-start party-shine arena-cta mt-6 w-full overflow-hidden rounded-2xl px-6 py-5 text-base font-black uppercase tracking-[0.08em] text-white transition active:scale-[.97] disabled:opacity-40">Hrať party hru</button>
        </div>
      </main>
    </PartyBackdrop>
  );
}
