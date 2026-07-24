import { useState } from "react";
import type { GameStatistics, Screen } from "../types";
import { getLevelInfo, normalizeStatistics } from "../utils/gameStats";
import { Icons } from "../components/icons";
import partyTableBackground from "../assets/party-table-bg.png";
import partyModeArt from "../assets/party-mode-card.jpg";
import imposterArt from "../assets/imposter-card.jpg";
import minigamesArt from "../assets/minigames-card.jpg";
import { type AppLanguage, useLanguage } from "../i18n/LanguageProvider";

const SECTIONS: Array<{
  screen: Screen;
  eyebrow: string;
  title: string;
  description: string;
  icon: "users" | "userCheck" | "gamepad";
  image: string;
  accent: string;
  glow: string;
  featured?: boolean;
}> = [
  { screen: "teambattle", eyebrow: "Tím proti tímu", title: "Party mode", description: "Kompletný súboj 2 tímov · body · finále", icon: "users", image: partyModeArt, accent: "from-violet-500 to-indigo-500", glow: "rgba(124, 58, 237, .38)", featured: true },
  { screen: "impostor-menu", eyebrow: "Kto z vás klame?", title: "Imposter", description: "Klasická hra aj kreslenie", icon: "userCheck", image: imposterArt, accent: "from-orange-400 to-rose-500", glow: "rgba(244, 63, 94, .34)" },
  { screen: "minigames-menu", eyebrow: "Rýchle hry", title: "Minihry", description: "Krátke kolá pre každú partiu", icon: "gamepad", image: minigamesArt, accent: "from-cyan-400 to-teal-500", glow: "rgba(6, 182, 212, .32)" },
];

const LANGUAGES: { code: AppLanguage; flag: string; label: string }[] = [
  { code: "sk", flag: "🇸🇰", label: "Slovenčina" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "pt", flag: "🇵🇹", label: "Português" },
];

export default function Home({ onNavigate, statistics, onSettings }: { onNavigate: (screen: Screen) => void; statistics: GameStatistics; onSettings: () => void }) {
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const safeStatistics = normalizeStatistics(statistics);
  const level = getLevelInfo(safeStatistics.progression.xp);
  const xpRemaining = Math.max(0, level.xpForNextLevel - level.xpIntoLevel);
  const activeLanguage = LANGUAGES.find((option) => option.code === language) ?? LANGUAGES[0];

  function openSettings() {
    setIsMenuOpen(false);
    onSettings();
  }

  return (
    <main className="relative h-[100dvh] min-h-[580px] overflow-hidden bg-[#080b10] text-white">
      <img src={partyTableBackground} alt="" className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-38 saturate-75" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#080b10]/20 via-[#080b10]/72 to-[#080b10]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,246,225,.06),transparent_28%)]" />

      <div className="relative mx-auto flex h-full w-full max-w-md flex-col px-5 pb-4 pt-4">
        <div className="flex h-10 items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[.22em] text-white/38">Párty hry</span>
          <button type="button" onClick={() => setIsMenuOpen(true)} aria-label="Otvoriť menu" aria-expanded={isMenuOpen} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-[#111820]/95 text-white/70 shadow-xl transition hover:border-white/25 hover:text-white active:scale-95">
            <Icons.menu size={20} />
          </button>
        </div>

        <header className="mt-4" style={{ animation: "slideUp .45s ease-out both" }}>
          <h1 className="text-[2.15rem] font-black leading-[.95] tracking-[-.055em]">Vyberte si hru.<span className="text-white/45"> Zábava začína.</span></h1>
        </header>

        <button
          type="button"
          onClick={() => onNavigate("statistics")}
          aria-label={`Otvoriť herný profil, level ${level.level}`}
          className="group relative mt-4 w-full overflow-hidden rounded-[1.3rem] border border-violet-300/20 bg-[#141525]/95 p-3 text-left shadow-[0_18px_52px_-34px_rgba(139,92,246,.9)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-violet-300/35 active:scale-[.985]"
          style={{ animation: "slideUp .45s ease-out 70ms both" }}
        >
          <span className="pointer-events-none absolute -right-10 -top-14 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />
          <span className="relative flex items-center gap-2.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-950/45"><Icons.crown size={20} /></span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline gap-2"><strong className="text-[1.3rem] font-black leading-none tracking-[-.04em]">Level {level.level}</strong><small className="truncate text-[9px] font-bold text-white/42">{level.level === 100 ? "Maximálny level" : `${xpRemaining} XP do ďalšieho`}</small></span>
              <span className="mt-2 flex items-center gap-2"><span className="block h-1.5 flex-1 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/[.07]"><span className="block h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 transition-[width] duration-700" style={{ width: `${level.progressPercent}%` }} /></span><small className="shrink-0 text-[8px] font-black text-white/32">{level.xpIntoLevel}/{level.xpForNextLevel} XP</small></span>
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[.055] text-white/45 transition group-hover:translate-x-0.5"><Icons.chevronRight size={16} /></span>
          </span>
        </button>

        <section className="mt-3 flex min-h-0 flex-1 flex-col gap-2.5" aria-label="Herné režimy">
          {SECTIONS.map((section, index) => {
            const Icon = Icons[section.icon];
            return (
              <button
                key={section.screen}
                type="button"
                onClick={() => onNavigate(section.screen)}
                className={`group relative min-h-0 flex-1 overflow-hidden rounded-[1.25rem] border text-left shadow-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/20 active:scale-[.985] ${section.featured ? "border-violet-300/25 bg-[#141525]" : "border-white/[.11] bg-[#11171e]"}`}
                style={{ animation: `slideUp .45s ease-out ${120 + index * 65}ms both`, boxShadow: `0 18px 42px -31px ${section.glow}` }}
              >
                <img src={section.image} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-66 saturate-[.78] transition duration-500 group-hover:scale-[1.025] group-hover:opacity-82" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,#10161d_0%,rgba(16,22,29,.97)_38%,rgba(16,22,29,.62)_70%,rgba(16,22,29,.1)_100%)]" />
                <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${section.accent}`} />
                <div className="relative flex h-full items-center p-4">
                  <div className="w-[76%] min-w-0">
                    <div className="flex items-center gap-2"><span className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${section.accent} shadow-lg`}><Icon size={15} className="text-white" /></span><p className="text-[8px] font-extrabold uppercase tracking-[.16em] text-white/52">{section.eyebrow}</p></div>
                    <h2 className="mt-2 text-[1.3rem] font-extrabold leading-none tracking-[-.035em]">{section.title}</h2>
                    <p className="mt-1 text-[10px] font-semibold leading-snug text-white/55">{section.description}</p>
                  </div>
                  <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 bg-[#111820]/80 text-white/65 shadow-lg transition group-hover:translate-x-0.5 group-hover:text-white"><Icons.chevronRight size={17} /></span>
                </div>
              </button>
            );
          })}
        </section>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label="Hlavné menu">
          <button type="button" aria-label="Zavrieť menu" className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <aside className="absolute bottom-0 left-0 top-0 flex w-[min(86vw,340px)] flex-col border-r border-white/10 bg-[#111820]/98 p-5 shadow-2xl" style={{ animation: "slideInFromRight .28s ease-out both" }}>
            <div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[.2em] text-violet-300">Menu</p><h2 className="mt-1 text-xl font-black">Nastavenia hry</h2></div><button type="button" onClick={() => setIsMenuOpen(false)} aria-label="Zavrieť" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.06] text-white/65"><Icons.x size={19} /></button></div>
            <button type="button" onClick={openSettings} className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.055] p-4 text-left transition hover:bg-white/[.09]"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-200"><Icons.settings size={19} /></span><span><strong className="block text-sm font-black">Nastavenia</strong><small className="mt-0.5 block text-[10px] font-semibold text-white/40">Zvuky, vibrácie a animácie</small></span><Icons.chevronRight size={18} className="ml-auto text-white/35" /></button>
            <div className="mt-7"><p className="text-[9px] font-black uppercase tracking-[.2em] text-white/35">Jazyk</p><div data-no-translate className="mt-3 grid grid-cols-2 gap-2">{LANGUAGES.map((option) => <button key={option.code} type="button" onClick={() => { setLanguage(option.code); setIsMenuOpen(false); }} className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-xs font-bold transition ${language === option.code ? "border-violet-300/35 bg-violet-500/15 text-white" : "border-white/[.08] bg-white/[.035] text-white/58 hover:bg-white/[.08]"}`}><span className="text-base">{option.flag}</span><span className="truncate">{option.label}</span></button>)}</div></div>
            <div className="mt-auto rounded-2xl border border-white/[.08] bg-white/[.035] p-4"><p className="text-[10px] font-black text-white/70">{activeLanguage.flag} {activeLanguage.label}</p><p className="mt-1 text-[10px] leading-relaxed text-white/35">Nastavenia sa ukladajú priamo v tomto zariadení.</p></div>
          </aside>
        </div>
      )}
    </main>
  );
}
