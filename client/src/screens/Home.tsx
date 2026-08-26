import { useState } from "react";
import type { GameStatistics, Screen } from "../types";
import { getLevelInfo, normalizeStatistics } from "../utils/gameStats";
import { Icons } from "../components/icons";
/** Dizajnové pravidlo: verná GitHub aplikácia; mediálne súbory sú presunuté výhradne do hostovaného úložiska. */
import { appBackground, imposterArt, minigamesArt, partyModeArt } from "../media";
import { type AppLanguage, useLanguage } from "../i18n/LanguageProvider";
import type { PlayableGame } from "../data/engagement";

const SECTIONS: Array<{
  screen: Screen;
  title: string;
  description: string;
  image: string;
  accent: string;
}> = [
  { screen: "teambattle", title: "Party mode", description: "Súťaž tímov v sérii minihier.", image: partyModeArt, accent: "#8b5cf6" },
  { screen: "impostor-menu", title: "Imposter", description: "Odhaľte hráča, ktorý medzi vás nepatrí.", image: imposterArt, accent: "#f97316" },
  { screen: "minigames-menu", title: "Minihry", description: "Krátke hry, keď chcete začať hneď.", image: minigamesArt, accent: "#06b6d4" },
];

const LANGUAGES: { code: AppLanguage; mark: string; label: string }[] = [
  { code: "sk", mark: "SK", label: "Slovenčina" },
  { code: "en", mark: "EN", label: "English" },
  { code: "de", mark: "DE", label: "Deutsch" },
  { code: "es", mark: "ES", label: "Español" },
  { code: "fr", mark: "FR", label: "Français" },
  { code: "pt", mark: "PT", label: "Português" },
];

export default function Home({ onNavigate, statistics, onSettings }: { onNavigate: (screen: Screen) => void; statistics: GameStatistics; onSettings: () => void; favoriteGames: PlayableGame[]; onToggleFavorite: (id: string) => void }) {
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const safeStatistics = normalizeStatistics(statistics);
  const level = getLevelInfo(safeStatistics.progression.xp);
  const activeLanguage = LANGUAGES.find((option) => option.code === language) ?? LANGUAGES[0];

  function openSettings() {
    setIsMenuOpen(false);
    onSettings();
  }

  return (
    <main className="home-screen relative min-h-[100dvh] bg-[#080b10] text-white">
      <img src={appBackground} alt="" className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-55" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#080b10]/42 via-[#080b10]/72 to-[#080b10]/96" />

      <div className="home-content relative mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden px-5 pb-[max(.65rem,env(safe-area-inset-bottom))] pt-[max(.8rem,env(safe-area-inset-top))]">
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/[.08]">
          <strong className="text-[11px] font-black uppercase tracking-[.18em]">Párty hry</strong>
          <button type="button" onClick={() => setIsMenuOpen(true)} aria-label="Otvoriť menu" aria-expanded={isMenuOpen} className="text-[10px] font-bold text-white/52 transition active:text-white">Menu</button>
        </div>

        <header className="home-heading mt-5 shrink-0" style={{ animation: "slideUp .32s ease-out both" }}>
          <h1 className="text-[2rem] font-black leading-none tracking-[-.045em]">Čo si dnes zahráme?</h1>
          <p className="mt-2 text-[11px] font-semibold text-white/48">Vyberte hru, zavolajte partiu a začnite.</p>
        </header>

        <section className="mt-5 flex min-h-0 flex-1 flex-col gap-3" aria-label="Herné režimy">
          {SECTIONS.map((section, index) => (
            <button key={section.screen} type="button" onClick={() => onNavigate(section.screen)} className="group relative min-h-0 flex-1 overflow-hidden rounded-[1.45rem] border border-white/12 bg-[#111820] text-left shadow-[0_14px_32px_rgba(0,0,0,.26)] transition active:scale-[.99]" style={{ animation: `slideUp .35s ease-out ${60 + index * 55}ms both`, borderColor: `${section.accent}55` }}>
              <img src={section.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-92 transition duration-500 group-hover:scale-[1.02]" />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,13,.94)_0%,rgba(7,9,13,.68)_50%,rgba(7,9,13,.08)_100%)]" />
              <span className="absolute inset-y-0 left-0 flex w-[75%] flex-col justify-end p-5"><strong className="text-[1.55rem] font-black leading-none tracking-[-.04em]">{section.title}</strong><span className="mt-2 text-[10px] font-semibold leading-relaxed text-white/58">{section.description}</span></span>
              <span className="absolute bottom-5 right-5 text-[9px] font-black uppercase tracking-[.12em] text-white/72">Otvoriť</span>
            </button>
          ))}
        </section>

        <nav className="mt-3 grid h-14 shrink-0 grid-cols-2 overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#111820]/92 shadow-[0_12px_30px_rgba(0,0,0,.28)]" aria-label="Hlavná navigácia">
          <button type="button" onClick={() => onNavigate("party-hub")} className="text-[10px] font-bold text-white/62 transition active:bg-white/[.06]">Party Hub</button>
          <button type="button" onClick={() => onNavigate("statistics")} className="border-l border-white/10 text-[10px] font-bold text-white/62 transition active:bg-white/[.06]">Profil <span className="ml-1 text-violet-300">Level {level.level}</span></button>
        </nav>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label="Hlavné menu">
          <button type="button" aria-label="Zavrieť menu" className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <aside className="absolute bottom-0 left-0 top-0 flex w-[min(86vw,340px)] flex-col border-r border-white/10 bg-[#111820]/98 p-5 shadow-2xl" style={{ animation: "slideInFromRight .28s ease-out both" }}>
            <div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[.2em] text-violet-300">Menu</p><h2 className="mt-1 text-xl font-black">Nastavenia hry</h2></div><button type="button" onClick={() => setIsMenuOpen(false)} aria-label="Zavrieť" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.06] text-white/65"><Icons.x size={19} /></button></div>
            <button type="button" onClick={openSettings} className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.055] p-4 text-left transition hover:bg-white/[.09]"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-200"><Icons.settings size={19} /></span><span><strong className="block text-sm font-black">Nastavenia</strong><small className="mt-0.5 block text-[10px] font-semibold text-white/40">Zvuky, vibrácie a animácie</small></span><Icons.chevronRight size={18} className="ml-auto text-white/35" /></button>
            <div className="mt-7"><p className="text-[9px] font-black uppercase tracking-[.2em] text-white/35">Jazyk</p><div data-no-translate className="mt-3 grid grid-cols-2 gap-2">{LANGUAGES.map((option) => <button key={option.code} type="button" onClick={() => { setLanguage(option.code); setIsMenuOpen(false); }} className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-xs font-bold transition ${language === option.code ? "border-violet-300/35 bg-violet-500/15 text-white" : "border-white/[.08] bg-white/[.035] text-white/58 hover:bg-white/[.08]"}`}><span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/20 text-[9px] font-black tracking-wide">{option.mark}</span><span className="truncate">{option.label}</span></button>)}</div></div>
            <div className="mt-auto rounded-2xl border border-white/[.08] bg-white/[.035] p-4"><p className="text-[10px] font-black text-white/70">{activeLanguage.mark} · {activeLanguage.label}</p><p className="mt-1 text-[10px] leading-relaxed text-white/35">Nastavenia sa ukladajú priamo v tomto zariadení.</p></div>
          </aside>
        </div>
      )}
    </main>
  );
}
