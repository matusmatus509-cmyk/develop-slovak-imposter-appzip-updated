import { useState } from "react";
import type { GameStatistics, Screen } from "../types";
import { getLevelInfo, normalizeStatistics } from "../utils/gameStats";
import { Icons } from "../components/icons";
import appBackground from "../assets/app-background-v2.webp";
import partyModeArt from "../assets/party-mode-card.jpg";
import imposterArt from "../assets/imposter-card.jpg";
import minigamesArt from "../assets/minigames-card.jpg";
import { type AppLanguage, useLanguage } from "../i18n/LanguageProvider";
import type { PlayableGame } from "../data/engagement";

const SECTIONS: Array<{
  screen: Screen;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  accent: string;
  featured?: boolean;
}> = [
  { screen: "teambattle", eyebrow: "Tím proti tímu", title: "Party mode", description: "Kompletný večer plný minihier, bodov a veľkého finále.", image: partyModeArt, accent: "#8b5cf6", featured: true },
  { screen: "impostor-menu", eyebrow: "Odhaľ klamára", title: "Imposter", description: "Slová aj kreslenie", image: imposterArt, accent: "#f97316" },
  { screen: "minigames-menu", eyebrow: "Rýchla zábava", title: "Minihry", description: "Hry na pár minút", image: minigamesArt, accent: "#06b6d4" },
];

const LANGUAGES: { code: AppLanguage; mark: string; label: string }[] = [
  { code: "sk", mark: "SK", label: "Slovenčina" },
  { code: "en", mark: "EN", label: "English" },
  { code: "de", mark: "DE", label: "Deutsch" },
  { code: "es", mark: "ES", label: "Español" },
  { code: "fr", mark: "FR", label: "Français" },
  { code: "pt", mark: "PT", label: "Português" },
];

export default function Home({ onNavigate, statistics, onSettings, favoriteGames, onToggleFavorite }: { onNavigate: (screen: Screen) => void; statistics: GameStatistics; onSettings: () => void; favoriteGames: PlayableGame[]; onToggleFavorite: (id: string) => void }) {
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

      <div className="home-content relative mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden px-4 pb-[max(.8rem,env(safe-area-inset-bottom))] pt-[max(.8rem,env(safe-area-inset-top))]">
        <div className="flex h-10 shrink-0 items-center justify-between">
          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-white/72"><span className="h-2 w-2 rounded-sm bg-violet-400" /> Párty hry</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onNavigate("party-hub")} aria-label="Otvoriť Party Hub" className="flex h-10 items-center rounded-xl border border-white/12 bg-[#111820]/92 px-3 text-[9px] font-black uppercase tracking-wider text-white/72 transition active:scale-95">Party Hub</button>
            <button type="button" onClick={() => setIsMenuOpen(true)} aria-label="Otvoriť menu" aria-expanded={isMenuOpen} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-[#111820]/95 text-white/70 shadow-xl transition hover:border-white/25 hover:text-white active:scale-95">
              <Icons.menu size={20} />
            </button>
          </div>
        </div>

        <header className="home-heading mt-5 shrink-0" style={{ animation: "slideUp .32s ease-out both" }}>
          <p className="text-[9px] font-black uppercase tracking-[.2em] text-violet-300/80">Vyber hru</p>
          <h1 className="mt-1.5 text-[2rem] font-black leading-none tracking-[-.045em]">Čo si zahráme?</h1>
        </header>

        <section className="home-showcase mt-5 grid min-h-0 flex-1 grid-rows-[1.3fr_.88fr] gap-3" aria-label="Herné režimy">
          <article className="home-mode-card home-party-featured group relative min-h-0 overflow-hidden rounded-[1.55rem] border border-violet-300/25 bg-[#111820]" style={{ animation: "slideUp .34s ease-out 60ms both" }}>
            <button type="button" onClick={() => onNavigate(SECTIONS[0].screen)} aria-label="Otvoriť Party mode" className="absolute inset-0 z-[1] rounded-[1.55rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300" />
            <img src={SECTIONS[0].image} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-90 transition duration-500 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,8,13,.06)_20%,rgba(5,8,13,.34)_52%,rgba(5,8,13,.97)_100%)]" />
            <div className="absolute left-4 top-4"><span className="rounded-lg border border-white/14 bg-black/45 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-[.14em] text-white/78">Tímový súboj</span></div>
            <button type="button" onClick={() => onToggleFavorite("teambattle")} aria-pressed={favoriteGames.some((game) => game.id === "teambattle")} aria-label={favoriteGames.some((game) => game.id === "teambattle") ? "Odobrať Party mode z obľúbených" : "Pridať Party mode medzi obľúbené"} className={`absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl border ${favoriteGames.some((game) => game.id === "teambattle") ? "border-rose-300/30 bg-rose-400/18 text-rose-200" : "border-white/14 bg-black/45 text-white/70"}`}><Icons.heart size={16} fill={favoriteGames.some((game) => game.id === "teambattle") ? "currentColor" : "none"} /></button>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-[8px] font-black uppercase tracking-[.18em] text-violet-200/85">{SECTIONS[0].eyebrow}</p>
              <h2 className="mt-1 text-[1.8rem] font-black leading-none tracking-[-.045em]">{SECTIONS[0].title}</h2>
              <p className="mt-1.5 text-[10px] font-semibold text-white/62">Minihry, body a veľké finále.</p>
            </div>
          </article>

          <div className="grid min-h-0 grid-cols-2 gap-2.5">
            {SECTIONS.slice(1).map((section, index) => (
              <article key={section.screen} className="home-mode-card group relative min-h-0 overflow-hidden rounded-[1.35rem] border border-white/12 bg-[#111820]" style={{ animation: `slideUp .34s ease-out ${120 + index * 55}ms both` }}>
                <button type="button" onClick={() => onNavigate(section.screen)} aria-label={`Otvoriť ${section.title}`} className="absolute inset-0 z-[1] rounded-[1.35rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70" />
                <img src={section.image} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-88 transition duration-500 group-hover:scale-[1.025]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,8,13,.04)_16%,rgba(5,8,13,.3)_46%,rgba(5,8,13,.96)_100%)]" />
                <span className="absolute left-3 top-3 h-1.5 w-8 rounded-full" style={{ background: section.accent }} />
                <div className="absolute inset-x-0 bottom-0 p-4"><p className="text-[7px] font-black uppercase tracking-[.15em] text-white/58">{section.eyebrow}</p><h2 className="mt-1.5 text-[1.25rem] font-black leading-none tracking-[-.035em]">{section.title}</h2></div>
              </article>
            ))}
          </div>
        </section>

        <button type="button" onClick={() => onNavigate("statistics")} aria-label={`Otvoriť herný profil, level ${level.level}`} className="home-level-bar mt-3 flex h-12 shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-[#111820]/94 px-3 text-left active:scale-[.99]">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500 text-xs font-black tabular-nums text-white">{level.level}</span>
          <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><strong className="text-[10px] font-black">Level {level.level}</strong><small className="text-[8px] font-bold uppercase tracking-wider text-white/38">Herný profil</small></span><span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-black/40"><span className="block h-full rounded-full bg-violet-400" style={{ width: `${level.progressPercent}%` }} /></span></span>
        </button>
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
