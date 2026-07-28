import { useEffect, useMemo, useRef, useState } from "react";
import { Icons } from "../components/icons";
import { Toggle } from "../components/ui";
import { PACKS, PARTY_THEMES, PLAYABLE_GAMES, getBundledWeeklyFeature } from "../data/engagement";
import { ACHIEVEMENTS, DAILY_REWARD_XP, PARTY_PASS_REWARDS, getLevelInfo, getNextPartyPassReward, isDailyRewardAvailable, normalizeStatistics } from "../utils/gameStats";
import type { FeedbackSettings, GameStatistics, GeneratedLaunchPayload, PartyTheme, Screen, WorkshopCollection, WorkshopEntry } from "../types";
import { useCurrentLocalDate } from "../hooks/useCurrentLocalDate";
import PartyAiSection from "./partyHub/PartyAiSection";
import PartyCollections from "./partyHub/PartyCollections";

const NAV_ITEMS = [
  ["discover", "Objaviť"], ["ai-party", "AI Party"], ["collections", "Kolekcie"], ["style", "Štýl"],
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

export default function PartyHub({ statistics, settings, musicSupported, musicBlocked, collections, workshopEntries, packImportNotice, onCollectionsChange, onWorkshopChange, onSettingsChange, onClaimDailyReward, onThemedLaunch, onNavigate, onBack }: {
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
  onThemedLaunch: (payload: GeneratedLaunchPayload) => void;
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

  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  function jumpTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: settings.animationsEnabled ? "smooth" : "auto", block: "start" }); }
  function spinWheel() {
    if (spinning) return;
    const index = randomIndex(PLAYABLE_GAMES.length);
    const slice = 360 / PLAYABLE_GAMES.length;
    const target = 360 - (index * slice + slice / 2);
    setSelectedGameId(null); setSpinning(true); setWheelRotation((rotation) => rotation + 1800 + target - (rotation % 360));
    timerRef.current = window.setTimeout(() => { setSelectedGameId(PLAYABLE_GAMES[index].id); setSpinning(false); }, settings.animationsEnabled ? 3200 : 20);
  }
  function startBonusMix() {
    if (level.level < 20) return;
    const screens: Screen[] = ["hadajemoji", "drawing-setup", "impostor-setup"];
    onNavigate(screens[randomIndex(screens.length)]);
  }

  return (
    <main className="theme-surface min-h-screen text-white">
      <div className="mx-auto w-full max-w-md px-5 pb-16 pt-5">
        <header className="flex items-center justify-between">
          <button type="button" onClick={onBack} aria-label="Späť" className="premium-nav-button"><Icons.arrowLeft size={19} /></button>
          <div className="text-center"><p className="premium-eyebrow text-violet-300">Lokálne centrum</p><p className="text-sm font-black">Party Hub</p></div>
          <button type="button" onClick={() => onNavigate("settings")} aria-label="Nastavenia" className="premium-nav-button"><Icons.settings size={18} /></button>
        </header>

        <nav className="light-keep-dark sticky top-2 z-40 mt-5 grid grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-[#0d131b]/90 p-1.5 text-white shadow-xl backdrop-blur-xl" aria-label="Sekcie Party Hubu">
          {NAV_ITEMS.map(([id, label]) => <button key={id} type="button" onClick={() => jumpTo(id)} className="rounded-xl px-1 py-2.5 text-[8px] font-black uppercase tracking-wide text-white/55 transition hover:bg-white/[.07] hover:text-white">{label}</button>)}
        </nav>

        <section id="discover" className="hub-hero mt-5 scroll-mt-20 overflow-hidden rounded-[1.8rem] border border-white/12 p-5 shadow-2xl">
          <div className="flex items-start justify-between gap-3"><div><p className="premium-eyebrow text-white/50">Party Pass</p><h1 className="mt-1 text-3xl font-black tracking-tight">Level {level.level}</h1><p className="mt-1 text-xs font-semibold text-white/50">{safeStatistics.progression.xp.toLocaleString("sk-SK")} XP · {safeStatistics.progression.coins} mincí</p></div><button type="button" onClick={() => onNavigate("statistics")} className="rounded-xl border border-white/12 bg-white/[.07] px-3 py-2 text-[9px] font-black uppercase tracking-wider">Celý profil</button></div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/35"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400" style={{ width: `${level.progressPercent}%` }} /></div>
          <div className="mt-2 flex justify-between text-[9px] font-bold text-white/40"><span>{level.xpIntoLevel}/{level.xpForNextLevel} XP</span><span>{nextReward ? `Ďalej: ${nextReward.title} · L${nextReward.level}` : "Všetky míľniky získané"}</span></div>
          <div className="mt-4 grid grid-cols-4 gap-2">{PARTY_PASS_REWARDS.map((reward) => <div key={reward.level} className={`rounded-xl border p-2 text-center ${level.level >= reward.level ? "border-emerald-300/20 bg-emerald-400/10" : "border-white/[.08] bg-black/15"}`}><div className="text-base">{reward.kind === "icon" ? "🎉" : reward.kind === "background" ? "🌌" : reward.kind === "pack" ? "🎁" : "👑"}</div><p className="mt-1 text-[8px] font-black">L{reward.level}</p></div>)}</div>
        </section>

        <section className={`mt-4 rounded-[1.5rem] border p-4 ${dailyAvailable ? "border-amber-300/25 bg-amber-400/[.09]" : "border-emerald-300/20 bg-emerald-400/[.07]"}`}><div className="flex items-center gap-3"><span className="premium-icon text-amber-300"><Icons.calendarDays size={21} /></span><div className="min-w-0 flex-1"><h2 className="text-sm font-black">Denný darček · +{DAILY_REWARD_XP} XP</h2><p className="text-[10px] text-white/45">Raz za miestny kalendárny deň</p></div><button type="button" disabled={!dailyAvailable} onClick={onClaimDailyReward} className="rounded-xl bg-amber-300 px-3 py-2 text-[10px] font-black text-amber-950 disabled:bg-white/[.07] disabled:text-white/35">{dailyAvailable ? "Vyzdvihnúť" : "Získané"}</button></div></section>

        <section className="premium-section"><div className="premium-section-heading"><div><p className="premium-eyebrow text-cyan-300/70">Týždeň {weekly.number}</p><h2>Party týždňa</h2></div><span className="text-2xl">{weekly.game.icon}</span></div><article className="premium-card mt-3 border-cyan-300/15 bg-cyan-400/[.06] p-4"><h3 className="font-black">{weekly.game.title}</h3><p className="mt-2 text-xs text-white/55">Výzva: {weekly.challenge}</p><p className="mt-2 rounded-xl bg-black/20 p-3 text-[10px] text-white/55">Kvíz: {weekly.quiz}</p><button type="button" onClick={() => onNavigate(weekly.game.screen)} className="mt-3 w-full rounded-xl bg-cyan-300 py-3 text-xs font-black text-cyan-950">Spustiť odporúčanú hru</button></article></section>

        <section className="premium-section"><div className="premium-section-heading"><div><p className="premium-eyebrow text-fuchsia-300/70">Náhodný výber</p><h2>Koleso hier</h2></div><button type="button" onClick={() => setWheelOpen(true)} className="rounded-xl border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-2 text-[10px] font-black text-fuchsia-200">Otvoriť</button></div></section>

        <section className="premium-section"><div className="premium-section-heading"><div><p className="premium-eyebrow text-amber-300/70">Obsah v zariadení</p><h2>Balíky</h2></div><span className="premium-icon">🎁</span></div><p className="mt-1 text-[10px] text-white/35">Názvy označujú témy obsahu; nejde o oficiálne prepojenie so značkami.</p>
          <article className={`mt-3 premium-card p-4 ${level.level >= 20 ? "border-violet-300/25 bg-violet-400/[.09]" : ""}`}><div className="flex items-center gap-3"><span className="text-2xl">🎁</span><div className="min-w-0 flex-1"><h3 className="text-sm font-black">Party Pass Bonusový mix · L20</h3><p className="mt-1 text-[9px] text-white/40">Spustí jednu z existujúcich hier.</p></div><button type="button" disabled={level.level < 20} onClick={startBonusMix} className="rounded-xl bg-violet-300 px-3 py-2 text-[9px] font-black text-violet-950 disabled:bg-white/[.06] disabled:text-white/30">{level.level >= 20 ? "Spustiť" : "Zamknuté"}</button></div></article>
          <div className="mt-3 grid grid-cols-2 gap-2.5">{PACKS.map((pack) => { const available = pack.status === "available"; return <article key={pack.id} className="premium-card p-3"><div className="flex items-center justify-between"><span className="text-xl">{pack.icon}</span><span className={`rounded-full px-2 py-1 text-[7px] font-black uppercase ${available ? "bg-emerald-400/10 text-emerald-300" : "bg-white/[.06] text-white/35"}`}>{available ? "Dostupné" : "Čoskoro"}</span></div><h3 className="mt-2 text-xs font-black">{pack.title}</h3><p className="mt-1 min-h-9 text-[9px] text-white/38">{pack.detail}</p>{available && "screen" in pack && <button type="button" onClick={() => onNavigate(pack.screen)} className="mt-2 text-[9px] font-black text-violet-300">Prejsť k hre →</button>}</article>; })}</div>
        </section>

        <div className="premium-section scroll-mt-20"><PartyAiSection onLaunch={onThemedLaunch} /></div>
        <div className="premium-section scroll-mt-20"><PartyCollections collections={collections} entries={workshopEntries} autoImportNotice={packImportNotice} onCollectionsChange={onCollectionsChange} onEntriesChange={onWorkshopChange} /></div>

        <section id="style" className="premium-section scroll-mt-20"><div className="premium-section-heading"><div><p className="premium-eyebrow text-violet-300/70">Vzhľad a zvuk</p><h2>Štýl party</h2></div><button type="button" onClick={() => onNavigate("settings")} className="text-[10px] font-black text-violet-300">Všetky nastavenia</button></div>
          <div className="mt-3 grid grid-cols-2 gap-2.5">{PARTY_THEMES.map((theme) => <button key={theme.id} type="button" aria-pressed={currentTheme === theme.id} onClick={() => onSettingsChange({ ...settings, partyTheme: theme.id as PartyTheme })} className={`premium-card p-3 text-left ${currentTheme === theme.id ? "border-white/35 bg-white/[.1]" : ""}`}><span className="block h-12 rounded-xl" style={{ background: theme.swatch }} /><strong className="mt-2 block text-xs">{theme.title}</strong><small className="text-[9px] text-white/38">{theme.description}</small></button>)}</div>
          <div className="premium-card mt-3 p-4"><Toggle checked={Boolean(settings.musicEnabled)} disabled={!musicSupported || !settings.soundsEnabled} onChange={(musicEnabled) => onSettingsChange({ ...settings, musicEnabled })} label="Generovaná party hudba" description={!settings.soundsEnabled ? "Najprv zapnite zvuky." : musicBlocked ? "Klepnutím do stránky povoľte prehrávanie." : "Tichá slučka vytvorená priamo v zariadení."} /></div>
        </section>

        <section className="premium-card mt-7 p-4"><div className="flex items-center justify-between"><div><p className="premium-eyebrow text-white/35">Achievementy</p><h2 className="mt-1 text-sm font-black">{ACHIEVEMENTS.filter((achievement) => safeStatistics.progression.achievements[achievement.id]).length}/{ACHIEVEMENTS.length} odomknutých</h2></div><button type="button" onClick={() => onNavigate("statistics")} className="text-[10px] font-black text-violet-300">Zobraziť všetky</button></div></section>
      </div>

      {wheelOpen && <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/75 p-4 backdrop-blur-md sm:items-center" role="dialog" aria-modal="true" aria-label="Koleso hier"><button type="button" className="absolute inset-0" aria-label="Zavrieť" onClick={() => !spinning && setWheelOpen(false)} /><section className="relative w-full max-w-md rounded-[2rem] border border-white/15 bg-[#111820] p-5 shadow-2xl"><div className="flex items-center justify-between"><div><p className="premium-eyebrow text-fuchsia-300">Koleso hier</p><h2 className="mt-1 text-xl font-black">Čo si zahráme?</h2></div><button type="button" disabled={spinning} onClick={() => setWheelOpen(false)} className="premium-nav-button"><Icons.x size={17} /></button></div><div className="relative mx-auto mt-5 h-64 w-64"><span className="absolute left-1/2 top-[-5px] z-10 -translate-x-1/2 text-2xl">▼</span><div className="party-wheel h-full w-full rounded-full border-4 border-white/15 transition-transform duration-[3200ms]" style={{ transform: `rotate(${wheelRotation}deg)` }}><div className="absolute inset-[27%] flex items-center justify-center rounded-full border border-white/20 bg-[#111820] text-3xl">🎲</div></div></div>{selectedGame ? <div className="mt-4 rounded-xl bg-emerald-400/10 p-3 text-center"><p className="premium-eyebrow text-emerald-300">Vybrané</p><p className="mt-1 text-lg font-black">{selectedGame.icon} {selectedGame.title}</p></div> : <p className="mt-4 text-center text-xs text-white/38">Vyberáme iba hry, ktoré aplikácia vie spustiť.</p>}<button type="button" disabled={spinning} onClick={selectedGame ? () => onNavigate(selectedGame.screen) : spinWheel} className="mt-4 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 py-3.5 text-sm font-black disabled:opacity-45">{spinning ? "Točí sa…" : selectedGame ? "Spustiť hru" : "Roztočiť"}</button>{selectedGame && <button type="button" onClick={spinWheel} className="mt-2 w-full py-2 text-[10px] font-black text-white/40">Točiť znova</button>}</section></div>}
    </main>
  );
}
