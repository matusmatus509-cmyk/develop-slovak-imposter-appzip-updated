import { useEffect, useMemo, useRef, useState } from "react";
import { Icons } from "../components/icons";
import { Toggle } from "../components/ui";
import { PACKS, PARTY_THEMES, PLAYABLE_GAMES, getBundledWeeklyFeature } from "../data/engagement";
import { ACHIEVEMENTS, DAILY_REWARD_XP, getLevelInfo, getNextPartyPassReward, isDailyRewardAvailable, normalizeStatistics } from "../utils/gameStats";
import type { FeedbackSettings, GameStatistics, PartyTheme, Screen, WorkshopCollection, WorkshopEntry } from "../types";
import { useCurrentLocalDate } from "../hooks/useCurrentLocalDate";
import PartyCollections from "./partyHub/PartyCollections";
import partyHubHero from "../assets/party-hub-hero.png";

const NAV_ITEMS = [
  ["discover", "Prehľad"], ["collections", "Balíčky"], ["style", "Štýl"],
] as const;

function randomIndex(length: number) {
  if (length <= 1) return 0;
  if (globalThis.crypto?.getRandomValues) {
    const max = Math.floor(0x100000000 / length) * length;
    const value = new Uint32Array(1);
    do globalThis.crypto.getRandomValues(value); while (value[0] >= max);
    return value[0] % length;
  }
  return Math.floor(Math.random() * length);
}

export default function PartyHub({ statistics, settings, musicSupported, musicBlocked, collections, workshopEntries, packImportNotice, onCollectionsChange, onWorkshopChange, onSettingsChange, onClaimDailyReward, onNavigate, onBack }: {
  statistics: GameStatistics;
  settings: FeedbackSettings;
  musicSupported: boolean;
  musicBlocked: boolean;
  collections: WorkshopCollection[];
  workshopEntries: WorkshopEntry[];
  packImportNotice?: { kind: "success" | "pending" | "error"; message: string } | null;
  onCollectionsChange: (collections: WorkshopCollection[]) => void;
  onWorkshopChange: (entries: WorkshopEntry[]) => void;
  onSettingsChange: (settings: FeedbackSettings) => void;
  onClaimDailyReward: () => void;
  onNavigate: (screen: Screen) => void;
  onBack: () => void;
}) {
  const safeStatistics = normalizeStatistics(statistics);
  const localDateKey = useCurrentLocalDate();
  const level = getLevelInfo(safeStatistics.progression.xp);
  const nextReward = getNextPartyPassReward(safeStatistics.progression.xp);
  const dailyAvailable = isDailyRewardAvailable(safeStatistics);
  const weekly = useMemo(() => getBundledWeeklyFeature(), [localDateKey]);
  const [wheelOpen, setWheelOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const currentTheme = settings.partyTheme ?? "dark";
  const selectedGame = PLAYABLE_GAMES.find((game) => game.id === selectedGameId) ?? null;
  const collectionCards = workshopEntries.length;

  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  function jumpTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: settings.animationsEnabled ? "smooth" : "auto", block: "start" });
  }

  function spinWheel() {
    if (spinning) return;
    const index = randomIndex(PLAYABLE_GAMES.length);
    const slice = 360 / PLAYABLE_GAMES.length;
    const target = 360 - (index * slice + slice / 2);
    setSelectedGameId(null);
    setSpinning(true);
    setWheelRotation((rotation) => rotation + 1800 + target - (rotation % 360));
    timerRef.current = window.setTimeout(() => {
      setSelectedGameId(PLAYABLE_GAMES[index].id);
      setSpinning(false);
    }, settings.animationsEnabled ? 3200 : 20);
  }

  function startBonusMix() {
    if (level.level < 20) return;
    const screens: Screen[] = ["hadajemoji", "drawing-setup", "impostor-setup"];
    onNavigate(screens[randomIndex(screens.length)]);
  }

  return (
    <main className="theme-surface party-hub-page min-h-screen text-white">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-[max(1rem,env(safe-area-inset-top))]">
        <header className="party-page-enter flex items-center justify-between px-1">
          <button type="button" onClick={onBack} aria-label="Späť" className="premium-nav-button"><Icons.arrowLeft size={19} /></button>
          <div className="text-center"><p className="premium-eyebrow text-violet-300">Tvoje centrum zábavy</p><p className="text-base font-black tracking-tight">Party Hub</p></div>
          <button type="button" onClick={() => onNavigate("settings")} aria-label="Nastavenia" className="premium-nav-button"><Icons.settings size={18} /></button>
        </header>

        <nav className="light-keep-dark party-page-enter sticky top-2 z-40 mt-4 grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-[#090d16]/85 p-1.5 text-white shadow-2xl backdrop-blur-2xl" aria-label="Sekcie Party Hubu" style={{ animationDelay: "60ms" }}>
          {NAV_ITEMS.map(([id, label]) => <button key={id} type="button" onClick={() => jumpTo(id)} className="rounded-xl px-2 py-2.5 text-[9px] font-black uppercase tracking-[.12em] text-white/55 transition hover:bg-white/[.08] hover:text-white active:scale-95">{label}</button>)}
        </nav>

        <section id="discover" className="light-keep-dark hub-hero party-hub-hero party-page-enter relative mt-4 scroll-mt-20 overflow-hidden rounded-[2rem] border border-white/12 p-5 shadow-2xl" style={{ animationDelay: "110ms" }}>
          <img src={partyHubHero} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-60 saturate-[.86]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(9,12,23,.98)_0%,rgba(9,12,23,.92)_38%,rgba(9,12,23,.48)_72%,rgba(9,12,23,.18)_100%)]" />
          <div className="party-hub-aurora" aria-hidden="true" />
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div><p className="premium-eyebrow text-fuchsia-200/75">Hlavná udalosť</p><h1 className="mt-2 text-[2rem] font-black leading-[.96] tracking-[-.05em]">Roztočte<br /><span className="party-gradient-text">Party mode</span></h1></div>
              <div className="party-live-mark"><span /> LIVE</div>
            </div>
            <p className="mt-4 max-w-[17rem] text-[11px] font-semibold leading-relaxed text-white/52">Dva tímy, dynamické kolá, násobiče bodov a veľké finále v jednej hre.</p>
            <button type="button" onClick={() => onNavigate("teambattle")} className="party-primary-action party-shine relative mt-5 flex w-full items-center justify-between overflow-hidden rounded-2xl px-5 py-4 text-left text-white active:scale-[.98]">
              <span><small className="block text-[8px] font-black uppercase tracking-[.22em] text-white/55">Pripraviť arénu</small><strong className="mt-1 block text-base font-black">Spustiť Party mode</strong></span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-violet-700 shadow-xl"><Icons.chevronRight size={20} /></span>
            </button>
          </div>
        </section>

        <section className="party-page-enter mt-3 grid grid-cols-3 gap-2" style={{ animationDelay: "170ms" }}>
          <button type="button" onClick={() => onNavigate("statistics")} className="premium-card party-metric p-3 text-left"><span className="text-[8px] font-black uppercase tracking-wider text-white/35">Level</span><strong className="mt-1 block text-xl font-black">{level.level}</strong><small className="party-metric-caption text-[8px] text-violet-300">{level.progressPercent}% ďalší</small></button>
          <div className="premium-card party-metric p-3"><span className="text-[8px] font-black uppercase tracking-wider text-white/35">Balíčky</span><strong className="mt-1 block text-xl font-black">{collections.length}</strong><small className="party-metric-caption text-[8px] text-cyan-300">{collectionCards} kariet</small></div>
          <div className="premium-card party-metric p-3"><span className="text-[8px] font-black uppercase tracking-wider text-white/35">Odohrané</span><strong className="mt-1 block text-xl font-black">{safeStatistics.gamesPlayed}</strong><small className="party-metric-caption text-[8px] text-emerald-300">hier spolu</small></div>
        </section>

        <section className={`party-page-enter mt-3 rounded-[1.5rem] border p-4 ${dailyAvailable ? "border-amber-300/25 bg-amber-400/[.09]" : "border-emerald-300/20 bg-emerald-400/[.07]"}`} style={{ animationDelay: "220ms" }}>
          <div className="flex items-center gap-3"><span className="premium-icon text-amber-300"><Icons.calendarDays size={21} /></span><div className="min-w-0 flex-1"><h2 className="text-sm font-black">Denný bonus · +{DAILY_REWARD_XP} XP</h2><p className="text-[9px] text-white/40">{nextReward ? `Ďalšia odmena: ${nextReward.title}` : "Všetky odmeny odomknuté"}</p></div><button type="button" disabled={!dailyAvailable} onClick={onClaimDailyReward} className="rounded-xl bg-amber-300 px-3 py-2 text-[9px] font-black text-amber-950 disabled:bg-white/[.07] disabled:text-white/35">{dailyAvailable ? "Získať" : "Hotovo"}</button></div>
        </section>

        <section className="premium-section"><div className="premium-section-heading"><div><p className="premium-eyebrow text-cyan-300/70">Týždeň {weekly.number}</p><h2>Tip na tento týždeň</h2></div><span className="premium-icon text-2xl">{weekly.game.icon}</span></div><article className="premium-card party-hover-card mt-3 overflow-hidden p-4"><div className="flex items-center gap-3"><div className="min-w-0 flex-1"><h3 className="font-black">{weekly.game.title}</h3><p className="mt-1 text-[10px] leading-relaxed text-white/48">{weekly.challenge}</p><p className="mt-2 rounded-xl bg-black/20 px-3 py-2 text-[9px] leading-relaxed text-white/45">Rýchly kvíz: {weekly.quiz}</p></div><button type="button" onClick={() => onNavigate(weekly.game.screen)} className="rounded-xl bg-cyan-300 px-3 py-2.5 text-[9px] font-black text-cyan-950">Hrať</button></div></article></section>

        <section className="premium-section"><div className="premium-section-heading"><div><p className="premium-eyebrow text-fuchsia-300/70">Neviete si vybrať?</p><h2>Koleso hier</h2></div><button type="button" onClick={() => setWheelOpen(true)} className="rounded-xl border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-2 text-[10px] font-black text-fuchsia-200">Roztočiť</button></div></section>

        <section className="premium-section"><div className="premium-section-heading"><div><p className="premium-eyebrow text-amber-300/70">Pripravené režimy</p><h2>Odporúčané balíky</h2></div><span className="premium-icon"><Icons.package size={20} /></span></div>
          <article className={`premium-card party-hover-card mt-3 p-4 ${level.level >= 20 ? "border-violet-300/25 bg-violet-400/[.09]" : ""}`}><div className="flex items-center gap-3"><span className="premium-icon"><Icons.dice1 size={20} /></span><div className="min-w-0 flex-1"><h3 className="text-sm font-black">Bonusový mix · Level 20</h3><p className="mt-1 text-[9px] leading-relaxed text-white/40">Spustí jednu z odomknutých hier ako prekvapenie.</p></div><button type="button" disabled={level.level < 20} onClick={startBonusMix} className="rounded-xl bg-violet-300 px-3 py-2.5 text-[9px] font-black text-violet-950 disabled:bg-white/[.06] disabled:text-white/30">{level.level >= 20 ? "Spustiť" : "Zamknuté"}</button></div></article>
          <div className="mt-3 grid grid-cols-2 gap-2.5">{PACKS.map((pack) => { const available = pack.status === "available"; return <article key={pack.id} className="premium-card party-hover-card p-3"><div className="flex items-center justify-between"><span className="text-xl">{pack.icon}</span><span className={`rounded-full px-2 py-1 text-[7px] font-black uppercase ${available ? "bg-emerald-400/10 text-emerald-300" : "bg-white/[.06] text-white/35"}`}>{available ? "Dostupné" : "Čoskoro"}</span></div><h3 className="mt-2 text-xs font-black">{pack.title}</h3><p className="mt-1 min-h-9 text-[9px] leading-relaxed text-white/38">{pack.detail}</p>{available && "screen" in pack && <button type="button" onClick={() => onNavigate(pack.screen)} className="mt-2 text-[9px] font-black text-violet-300">Otvoriť →</button>}</article>; })}</div></section>

        <div className="premium-section scroll-mt-20"><PartyCollections collections={collections} entries={workshopEntries} autoImportNotice={packImportNotice} onCollectionsChange={onCollectionsChange} onEntriesChange={onWorkshopChange} /></div>

        <section id="style" className="premium-section scroll-mt-20"><div className="premium-section-heading"><div><p className="premium-eyebrow text-violet-300/70">Atmosféra aplikácie</p><h2>Vizuálny štýl</h2></div><button type="button" onClick={() => onNavigate("settings")} className="text-[10px] font-black text-violet-300">Nastavenia</button></div>
          <div className="mt-3 grid grid-cols-2 gap-2.5">{PARTY_THEMES.map((theme) => <button key={theme.id} type="button" aria-pressed={currentTheme === theme.id} onClick={() => onSettingsChange({ ...settings, partyTheme: theme.id as PartyTheme })} className={`premium-card party-theme-card p-3 text-left ${currentTheme === theme.id ? "is-active" : ""}`}><span className="block h-14 rounded-xl" style={{ background: theme.swatch }} /><strong className="mt-2 block text-xs">{theme.title}</strong><small className="text-[9px] text-white/38">{theme.description}</small></button>)}</div>
          <div className="premium-card mt-3 p-4"><Toggle checked={Boolean(settings.musicEnabled)} disabled={!musicSupported || !settings.soundsEnabled} onChange={(musicEnabled) => onSettingsChange({ ...settings, musicEnabled })} label="Party hudba" description={!settings.soundsEnabled ? "Najprv zapnite zvuky." : musicBlocked ? "Klepnutím povoľte prehrávanie." : "Jemná slučka vytvorená priamo v zariadení."} /></div>
        </section>

        <button type="button" onClick={() => onNavigate("statistics")} className="premium-card party-hover-card mt-7 flex w-full items-center gap-3 p-4 text-left"><span className="premium-icon"><Icons.trophy size={20} /></span><span className="min-w-0 flex-1"><span className="premium-eyebrow text-white/35">Achievementy</span><strong className="mt-1 block text-sm">{ACHIEVEMENTS.filter((achievement) => safeStatistics.progression.achievements[achievement.id]).length}/{ACHIEVEMENTS.length} odomknutých</strong></span><Icons.chevronRight size={18} className="text-white/35" /></button>
      </div>

      {wheelOpen && <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/80 p-4 backdrop-blur-xl sm:items-center" role="dialog" aria-modal="true" aria-label="Koleso hier"><button type="button" className="absolute inset-0" aria-label="Zavrieť" onClick={() => !spinning && setWheelOpen(false)} /><section className="light-keep-dark party-modal-enter relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/15 bg-[#0b1019] p-5 text-white shadow-2xl"><div className="flex items-center justify-between"><div><p className="premium-eyebrow text-fuchsia-300">Náhodný výber</p><h2 className="mt-1 text-xl font-black">Čo si zahráme?</h2></div><button type="button" disabled={spinning} onClick={() => setWheelOpen(false)} className="premium-nav-button"><Icons.x size={17} /></button></div><div className="relative mx-auto mt-5 h-64 w-64"><span className="absolute left-1/2 top-[-7px] z-10 -translate-x-1/2 rounded-full bg-white px-1.5 py-1 text-[#0b1019] shadow-lg"><Icons.chevronDown size={18} /></span><div className="party-wheel h-full w-full rounded-full border-4 border-white/15 transition-transform duration-[3200ms]" style={{ transform: `rotate(${wheelRotation}deg)` }}><div className="absolute inset-[27%] flex items-center justify-center rounded-full border border-white/20 bg-[#0b1019] text-violet-200"><Icons.dice1 size={34} /></div></div></div>{selectedGame ? <div className="mt-4 rounded-xl bg-emerald-400/10 p-3 text-center"><p className="premium-eyebrow text-emerald-300">Vybrané</p><p className="mt-1 text-lg font-black">{selectedGame.title}</p></div> : <p className="mt-4 text-center text-xs text-white/38">Koleso vyberie jednu dostupnú hru.</p>}<button type="button" disabled={spinning} onClick={selectedGame ? () => onNavigate(selectedGame.screen) : spinWheel} className="party-primary-action party-shine relative mt-4 w-full overflow-hidden rounded-xl py-3.5 text-sm font-black text-white disabled:opacity-45">{spinning ? "Vyberáme…" : selectedGame ? "Spustiť hru" : "Roztočiť"}</button>{selectedGame && <button type="button" onClick={spinWheel} className="mt-2 w-full py-2 text-[10px] font-black text-white/40">Točiť znova</button>}</section></div>}
    </main>
  );
}
