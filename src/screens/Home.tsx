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
        <div className="flex h-10 shrink-0 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500 text-sm font-black shadow-[0_8px_24px_rgba(139,92,246,.35)]">P</span>
            <div><strong className="block text-[11px] font-black uppercase tracking-[.16em]">Párty hry</strong><span className="mt-0.5 block text-[9px] font-semibold text-white/38">Hry pre jeden mobil</span></div>
          </div>
          <button type="button" onClick={() => setIsMenuOpen(true)} aria-label="Otvoriť menu" aria-expanded={isMenuOpen} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.055] text-white/68 transition active:scale-95"><Icons.menu size={19} /></button>
        </div>

        <header className="home-heading mt-5 shrink-0" style={{ animation: "slideUp .32s ease-out both" }}>
          <h1 className="text-[2rem] font-black leading-none tracking-[-.045em]">Vyberte si hru</h1>
          <p className="mt-2 text-[11px] font-semibold text-white/48">Položte mobil medzi seba a môžete začať.</p>
        </header>

        <section className="mt-5 flex min-h-0 flex-1 flex-col gap-3" aria-label="Herné režimy">
          <article className="group relative min-h-0 flex-[1.65] overflow-hidden rounded-[1.75rem] border border-violet-300/20 bg-[#171224] shadow-[0_22px_60px_rgba(0,0,0,.34)]" style={{ animation: "slideUp .36s ease-out 50ms both" }}>
            <button type="button" onClick={() => onNavigate("teambattle")} aria-label="Otvoriť Party mode" className="absolute inset-0 z-[2] rounded-[1.75rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300" />
            <img src={partyModeArt} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.025]" />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(9,8,14,.92)_0%,rgba(9,8,14,.58)_48%,rgba(9,8,14,.12)_100%)]" />
            <div className="absolute inset-y-0 left-0 flex w-[72%] flex-col justify-between p-5">
              <span className="w-fit rounded-full border border-violet-200/20 bg-violet-400/15 px-3 py-1.5 text-[8px] font-black uppercase tracking-[.16em] text-violet-100">Hlavná hra</span>
              <div><p className="text-[9px] font-black uppercase tracking-[.18em] text-violet-200/72">Tím proti tímu</p><h2 className="mt-1.5 text-[2rem] font-black leading-none tracking-[-.05em]">Party mode</h2><p className="mt-2 max-w-[14rem] text-[10px] font-semibold leading-relaxed text-white/58">Viac minihier, spoločné skóre a finále.</p></div>
            </div>
            <span className="absolute bottom-5 right-5 grid h-12 w-12 place-items-center rounded-full bg-white text-[#111018] shadow-xl"><Icons.arrowRight size={20} /></span>
          </article>

          <div className="flex min-h-0 flex-1 flex-col gap-3">
            {SECTIONS.slice(1).map((section, index) => (
              <button key={section.screen} type="button" onClick={() => onNavigate(section.screen)} className="group relative flex min-h-0 flex-1 items-center overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#111820]/95 p-2.5 text-left transition active:scale-[.985]" style={{ animation: `slideUp .34s ease-out ${130 + index * 55}ms both` }}>
                <span className="relative h-full min-h-[64px] w-[30%] shrink-0 overflow-hidden rounded-[1rem]"><img src={section.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute inset-0 bg-black/10" /></span>
                <span className="min-w-0 flex-1 px-4"><small className="block text-[8px] font-black uppercase tracking-[.15em]" style={{ color: section.accent }}>{section.eyebrow}</small><strong className="mt-1.5 block text-lg font-black leading-none tracking-[-.03em]">{section.title}</strong><span className="mt-1.5 block text-[9px] font-semibold text-white/42">{section.description}</span></span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[.055] text-white/58"><Icons.chevronRight size={17} /></span>
              </button>
            ))}
          </div>
        </section>

        <nav className="mt-4 grid h-16 shrink-0 grid-cols-4 rounded-[1.35rem] border border-white/10 bg-[#10151d]/96 px-2 shadow-[0_16px_40px_rgba(0,0,0,.32)]" aria-label="Hlavná navigácia">
          <button type="button" className="flex flex-col items-center justify-center gap-1 text-violet-300" aria-current="page"><Icons.home size={18} /><span className="text-[8px] font-black">Hry</span></button>
          <button type="button" onClick={() => onNavigate("party-hub")} className="flex flex-col items-center justify-center gap-1 text-white/42"><Icons.users size={18} /><span className="text-[8px] font-bold">Party</span></button>
          <button type="button" onClick={() => onNavigate("statistics")} className="relative flex flex-col items-center justify-center gap-1 text-white/42"><Icons.user size={18} /><span className="absolute right-[22%] top-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-violet-500 px-1 text-[7px] font-black text-white">{level.level}</span><span className="text-[8px] font-bold">Profil</span></button>
          <button type="button" onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center justify-center gap-1 text-white/42"><Icons.settings size={18} /><span className="text-[8px] font-bold">Menu</span></button>
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
