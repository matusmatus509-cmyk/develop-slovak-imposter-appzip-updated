import { useEffect, useMemo, useRef, useState } from "react";
import { Icons } from "../components/icons";
import { Toggle } from "../components/ui";
import { PACKS, PARTY_THEMES, PLAYABLE_GAMES, generatePartyMix, getBundledWeeklyFeature } from "../data/engagement";
import { ACHIEVEMENTS, DAILY_REWARD_XP, PARTY_PASS_REWARDS, getLevelInfo, getNextPartyPassReward, isDailyRewardAvailable, normalizeStatistics } from "../utils/gameStats";
import type { FeedbackSettings, GameStatistics, PartyTheme, Screen, WorkshopEntry, WorkshopEntryKind } from "../types";
import { useCurrentLocalDate } from "../hooks/useCurrentLocalDate";

const KIND_LABELS: Record<WorkshopEntryKind, string> = { truth: "Pravda", dare: "Výzva", emoji: "Emoji", quiz: "Kvíz", word: "Slovo" };

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

export default function PartyHub({
  statistics,
  settings,
  musicSupported,
  musicBlocked,
  workshopEntries,
  onWorkshopChange,
  onSettingsChange,
  onClaimDailyReward,
  onNavigate,
  onBack,
}: {
  statistics: GameStatistics;
  settings: FeedbackSettings;
  musicSupported: boolean;
  musicBlocked: boolean;
  workshopEntries: WorkshopEntry[];
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
  const [partyContext, setPartyContext] = useState("Sme na chate");
  const [generatedMix, setGeneratedMix] = useState(() => generatePartyMix("Sme na chate"));
  const [kind, setKind] = useState<WorkshopEntryKind>("truth");
  const [entryText, setEntryText] = useState("");
  const [entryAnswer, setEntryAnswer] = useState("");
  const currentTheme = settings.partyTheme ?? "dark";
  const selectedGame = PLAYABLE_GAMES.find((game) => game.id === selectedGameId) ?? null;

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  function spinWheel() {
    if (spinning) return;
    const index = randomIndex(PLAYABLE_GAMES.length);
    const slice = 360 / PLAYABLE_GAMES.length;
    const target = 360 - (index * slice + slice / 2);
    setSelectedGameId(null);
    setSpinning(true);
    setWheelRotation((rotation) => rotation + 1800 + target - (rotation % 360));
    const duration = settings.animationsEnabled ? 3200 : 20;
    timerRef.current = window.setTimeout(() => {
      setSelectedGameId(PLAYABLE_GAMES[index].id);
      setSpinning(false);
    }, duration);
  }

  function addWorkshopEntry() {
    const text = entryText.trim();
    if (!text) return;
    const entry: WorkshopEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind,
      text: text.slice(0, 240),
      answer: entryAnswer.trim().slice(0, 160) || undefined,
      likes: 0,
      rating: 0,
      ratingCount: 0,
      createdAt: Date.now(),
    };
    onWorkshopChange([entry, ...workshopEntries]);
    setEntryText("");
    setEntryAnswer("");
  }

  function updateEntry(id: string, transform: (entry: WorkshopEntry) => WorkshopEntry) {
    onWorkshopChange(workshopEntries.map((entry) => entry.id === id ? transform(entry) : entry));
  }

  function startBonusMix() {
    if (level.level < 20) return;
    const bonusScreens: Screen[] = ["hadajemoji", "drawing-setup", "impostor-setup"];
    onNavigate(bonusScreens[randomIndex(bonusScreens.length)]);
  }

  return (
    <main className="theme-surface min-h-screen bg-[#080b10] text-white">
      <div className="mx-auto w-full max-w-md px-5 pb-16 pt-5">
        <header className="flex items-center justify-between">
          <button type="button" onClick={onBack} aria-label="Späť" className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-[#111820]/95 text-white/70 shadow-xl active:scale-90"><Icons.arrowLeft size={19} /></button>
          <div className="text-center"><p className="text-[9px] font-black uppercase tracking-[.22em] text-violet-300">Lokálne centrum</p><p className="text-sm font-black">Party Hub</p></div>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[.05] text-violet-200"><Icons.sparkles size={20} /></span>
        </header>

        <section className="hub-hero mt-7 overflow-hidden rounded-[1.8rem] border border-white/12 p-5 shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div><p className="text-[9px] font-black uppercase tracking-[.2em] text-white/50">Party Pass</p><h1 className="mt-1 text-3xl font-black tracking-tight">Level {level.level}</h1><p className="mt-1 text-xs font-semibold text-white/50">{safeStatistics.progression.xp.toLocaleString("sk-SK")} XP · {safeStatistics.progression.coins} mincí</p></div>
            <button type="button" onClick={() => onNavigate("statistics")} className="rounded-xl border border-white/12 bg-white/[.07] px-3 py-2 text-[9px] font-black uppercase tracking-wider">Celý profil</button>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/35"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400" style={{ width: `${level.progressPercent}%` }} /></div>
          <div className="mt-2 flex justify-between text-[9px] font-bold text-white/40"><span>{level.xpIntoLevel}/{level.xpForNextLevel} XP</span><span>{nextReward ? `Ďalej: ${nextReward.title} · L${nextReward.level}` : "Všetky míľniky získané"}</span></div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {PARTY_PASS_REWARDS.map((reward) => <div key={reward.level} className={`rounded-xl border p-2 text-center ${level.level >= reward.level ? "border-emerald-300/20 bg-emerald-400/10" : "border-white/[.08] bg-black/15"}`}><div className="text-base">{reward.kind === "icon" ? "🎉" : reward.kind === "background" ? "🌌" : reward.kind === "pack" ? "🎁" : "👑"}</div><p className="mt-1 text-[8px] font-black">L{reward.level}</p></div>)}
          </div>
        </section>

        <section className={`mt-4 rounded-[1.5rem] border p-4 ${dailyAvailable ? "border-amber-300/25 bg-amber-400/[.09]" : "border-emerald-300/20 bg-emerald-400/[.07]"}`}>
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[.07] text-amber-300"><Icons.calendarDays size={21} /></span><div className="min-w-0 flex-1"><h2 className="text-sm font-black">Denný darček · +{DAILY_REWARD_XP} XP</h2><p className="mt-0.5 text-[10px] font-semibold text-white/45">Raz za miestny kalendárny deň</p></div><button type="button" disabled={!dailyAvailable} onClick={onClaimDailyReward} className="rounded-xl bg-amber-300 px-3 py-2 text-[10px] font-black text-amber-950 disabled:bg-white/[.07] disabled:text-white/35">{dailyAvailable ? "Vyzdvihnúť" : "Získané"}</button></div>
        </section>

        <section className="mt-7">
          <div className="flex items-end justify-between"><div><p className="text-[9px] font-black uppercase tracking-[.2em] text-cyan-300/70">Týždeň {weekly.number}</p><h2 className="mt-1 text-xl font-black">Party týždňa</h2></div><span className="text-2xl">{weekly.game.icon}</span></div>
          <article className="mt-3 rounded-[1.5rem] border border-cyan-300/15 bg-cyan-400/[.06] p-4"><h3 className="font-black">{weekly.game.title}</h3><p className="mt-2 text-xs leading-relaxed text-white/55">Výzva: {weekly.challenge}</p><p className="mt-2 rounded-xl bg-black/20 p-3 text-[10px] font-semibold text-white/55">Kvíz týždňa: {weekly.quiz}</p><button type="button" onClick={() => onNavigate(weekly.game.screen)} className="mt-3 w-full rounded-xl bg-cyan-300 py-3 text-xs font-black text-cyan-950">Spustiť odporúčanú hru</button></article>
        </section>

        <section className="mt-7">
          <div className="flex items-end justify-between"><div><p className="text-[9px] font-black uppercase tracking-[.2em] text-fuchsia-300/70">Náhodný výber</p><h2 className="mt-1 text-xl font-black">Koleso hier</h2></div><button type="button" onClick={() => setWheelOpen(true)} className="rounded-xl border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-2 text-[10px] font-black text-fuchsia-200">Otvoriť koleso</button></div>
        </section>

        <section className="mt-7">
          <p className="text-[9px] font-black uppercase tracking-[.2em] text-violet-300/70">Vzhľad aplikácie</p><h2 className="mt-1 text-xl font-black">Témy</h2>
          <div className="mt-3 grid grid-cols-2 gap-2.5">{PARTY_THEMES.map((theme) => <button key={theme.id} type="button" aria-pressed={currentTheme === theme.id} onClick={() => onSettingsChange({ ...settings, partyTheme: theme.id as PartyTheme })} className={`rounded-[1.3rem] border p-3 text-left transition ${currentTheme === theme.id ? "border-white/35 bg-white/[.1]" : "border-white/[.08] bg-white/[.035]"}`}><span className="block h-12 rounded-xl" style={{ background: theme.swatch }} /><strong className="mt-2 block text-xs">{theme.title}</strong><small className="mt-0.5 block text-[9px] text-white/38">{theme.description}</small></button>)}</div>
        </section>

        <section className="mt-7 rounded-[1.5rem] border border-white/10 bg-white/[.04] p-4">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10 text-violet-200"><Icons.music size={21} /></span><div><h2 className="text-sm font-black">Tichá party hudba</h2><p className="mt-0.5 text-[10px] text-white/42">Generovaná v zariadení · bez nahrávky</p></div></div>
          <div className="mt-3"><Toggle checked={Boolean(settings.musicEnabled)} disabled={!musicSupported} onChange={(musicEnabled) => onSettingsChange({ ...settings, musicEnabled })} label={musicSupported ? "Hudobná slučka" : "Web Audio nie je podporované"} description={!settings.soundsEnabled ? "Hlavné zvuky sú vypnuté, preto hudba zostáva ticho." : musicBlocked ? "Klepnutím do stránky povoľte prehrávanie." : "Veľmi nízka hlasitosť, vypnuté predvolene."} /></div>
        </section>

        <section className="mt-7">
          <p className="text-[9px] font-black uppercase tracking-[.2em] text-amber-300/70">Obsah v zariadení</p><h2 className="mt-1 text-xl font-black">Balíky</h2><p className="mt-1 text-[10px] leading-relaxed text-white/35">Názvy označujú témy obsahu; nejde o oficiálne prepojenie so značkami.</p>
          <article className={`mt-3 rounded-[1.4rem] border p-4 ${level.level >= 20 ? "border-violet-300/25 bg-violet-400/[.09]" : "border-white/[.08] bg-white/[.025]"}`}><div className="flex items-center gap-3"><span className="text-2xl">🎁</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="text-sm font-black">Party Pass Bonusový mix</h3><span className="text-[8px] font-black text-white/35">L20</span></div><p className="mt-1 text-[9px] text-white/40">Náhodne spustí jednu z troch existujúcich hier v bonusovom výbere.</p></div><button type="button" disabled={level.level < 20} onClick={startBonusMix} className="rounded-xl bg-violet-300 px-3 py-2 text-[9px] font-black text-violet-950 disabled:bg-white/[.06] disabled:text-white/30">{level.level >= 20 ? "Spustiť" : "Zamknuté"}</button></div></article>
          <div className="mt-3 grid grid-cols-2 gap-2.5">{PACKS.map((pack) => { const available = pack.status === "available"; return <article key={pack.id} className="rounded-[1.3rem] border border-white/[.09] bg-white/[.04] p-3"><div className="flex items-center justify-between"><span className="text-xl">{pack.icon}</span><span className={`rounded-full px-2 py-1 text-[7px] font-black uppercase ${available ? "bg-emerald-400/10 text-emerald-300" : "bg-white/[.06] text-white/35"}`}>{available ? "Dostupné" : "Čoskoro"}</span></div><h3 className="mt-2 text-xs font-black">{pack.title}</h3><p className="mt-1 min-h-9 text-[9px] leading-relaxed text-white/38">{pack.detail}</p>{available && "screen" in pack && <button type="button" onClick={() => onNavigate(pack.screen)} className="mt-2 text-[9px] font-black text-violet-300">Prejsť k hre · kategóriu vyberiete v hre →</button>}</article>; })}</div>
          <p className="mt-3 rounded-xl border border-violet-300/12 bg-violet-400/[.06] p-3 text-[10px] leading-relaxed text-white/45">Bonusový mix používa iba obsah, ktorý aplikácia už obsahuje. Nevytvára ani nesľubuje nový licencovaný obsah.</p>
        </section>

        <section className="mt-7 rounded-[1.6rem] border border-fuchsia-300/15 bg-fuchsia-400/[.055] p-4">
          <p className="text-[9px] font-black uppercase tracking-[.2em] text-fuchsia-300/75">Generátor v zariadení</p><h2 className="mt-1 text-xl font-black">AI Party <span className="text-xs text-white/35">bez cloudu</span></h2><p className="mt-1 text-[10px] leading-relaxed text-white/42">Používa iba zabudované šablóny. Kontext sa nikam neposiela.</p>
          <div className="mt-3 flex gap-2"><input value={partyContext} onChange={(event) => setPartyContext(event.target.value)} maxLength={80} placeholder="Napr. Sme na chate" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-xs text-white outline-none placeholder:text-white/25" /><button type="button" onClick={() => setGeneratedMix(generatePartyMix(partyContext))} className="rounded-xl bg-fuchsia-300 px-3 text-[10px] font-black text-fuchsia-950">Vytvoriť</button></div>
          <div className="mt-3 space-y-2">{generatedMix.map((item, index) => <article key={`${item.kind}-${index}`} className="rounded-xl bg-black/20 p-3"><div className="flex items-center justify-between gap-2"><strong className="text-[9px] uppercase tracking-wider text-fuchsia-200">{item.kind}</strong><button type="button" onClick={() => onNavigate(item.screen)} className="text-[9px] font-black text-white/45">Prejsť do hry</button></div><p className="mt-1 text-xs leading-relaxed text-white/65">{item.prompt}</p></article>)}</div>
        </section>

        <section className="mt-7">
          <p className="text-[9px] font-black uppercase tracking-[.2em] text-emerald-300/70">Komunitný workshop</p><h2 className="mt-1 text-xl font-black">Vlastné kartičky</h2><p className="mt-1 text-[10px] leading-relaxed text-white/38">Uložené iba v tomto zariadení. Nie sú verejné ani synchronizované.</p>
          <div className="mt-3 rounded-[1.5rem] border border-white/10 bg-white/[.04] p-4"><div className="flex flex-wrap gap-1.5">{(Object.keys(KIND_LABELS) as WorkshopEntryKind[]).map((option) => <button key={option} type="button" onClick={() => setKind(option)} className={`rounded-lg px-2.5 py-2 text-[9px] font-black ${kind === option ? "bg-emerald-300 text-emerald-950" : "bg-white/[.06] text-white/45"}`}>{KIND_LABELS[option]}</button>)}</div><textarea value={entryText} onChange={(event) => setEntryText(event.target.value)} maxLength={240} rows={3} placeholder="Napíšte vlastnú otázku, výzvu alebo slovo" className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-black/25 p-3 text-xs text-white outline-none placeholder:text-white/25" />{(kind === "emoji" || kind === "quiz") && <input value={entryAnswer} onChange={(event) => setEntryAnswer(event.target.value)} maxLength={160} placeholder="Správna odpoveď (voliteľné)" className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 p-3 text-xs text-white outline-none placeholder:text-white/25" />}<button type="button" disabled={!entryText.trim()} onClick={addWorkshopEntry} className="mt-3 w-full rounded-xl bg-emerald-300 py-3 text-xs font-black text-emerald-950 disabled:opacity-35">Uložiť na tomto zariadení</button></div>
          <div className="mt-3 space-y-2">{workshopEntries.length === 0 ? <p className="rounded-xl border border-dashed border-white/10 p-5 text-center text-xs text-white/30">Zatiaľ nemáte vlastné kartičky.</p> : workshopEntries.map((entry) => <article key={entry.id} className="rounded-[1.25rem] border border-white/[.08] bg-white/[.035] p-3"><div className="flex items-center justify-between"><span className="text-[8px] font-black uppercase tracking-wider text-emerald-300">{KIND_LABELS[entry.kind]}</span><button type="button" onClick={() => onWorkshopChange(workshopEntries.filter((item) => item.id !== entry.id))} aria-label="Vymazať kartičku" className="text-white/30 hover:text-rose-300"><Icons.x size={15} /></button></div><p className="mt-2 text-xs leading-relaxed text-white/70">{entry.text}</p>{entry.answer && <p className="mt-1 text-[9px] text-white/35">Odpoveď: {entry.answer}</p>}<div className="mt-3 flex items-center gap-2"><button type="button" onClick={() => updateEntry(entry.id, (item) => ({ ...item, likes: item.likes + 1 }))} className="rounded-lg bg-white/[.06] px-2.5 py-1.5 text-[9px] font-black text-white/50">♥ {entry.likes}</button><span className="text-[9px] text-white/30">Vaše hodnotenie</span><span className="ml-auto flex gap-0.5">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={`Ohodnotiť ${value} z 5`} onClick={() => updateEntry(entry.id, (item) => ({ ...item, rating: value, ratingCount: 1, userRating: value }))} className={`p-0.5 text-sm ${value <= (entry.userRating ?? 0) ? "text-amber-300" : "text-white/18"}`}>★</button>)}</span></div></article>)}</div>
        </section>

        <section className="mt-7 rounded-[1.5rem] border border-white/10 bg-white/[.035] p-4"><div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-wider text-white/35">Achievementy</p><h2 className="mt-1 text-sm font-black">{ACHIEVEMENTS.filter((achievement) => safeStatistics.progression.achievements[achievement.id]).length}/{ACHIEVEMENTS.length} odomknutých</h2></div><button type="button" onClick={() => onNavigate("statistics")} className="text-[10px] font-black text-violet-300">Zobraziť všetky</button></div></section>
      </div>

      {wheelOpen && <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/75 p-4 backdrop-blur-md sm:items-center" role="dialog" aria-modal="true" aria-label="Koleso hier"><button type="button" className="absolute inset-0" aria-label="Zavrieť" onClick={() => !spinning && setWheelOpen(false)} /><section className="relative w-full max-w-md rounded-[2rem] border border-white/15 bg-[#111820] p-5 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[.2em] text-fuchsia-300">Koleso hier</p><h2 className="mt-1 text-xl font-black">Čo si zahráme?</h2></div><button type="button" disabled={spinning} onClick={() => setWheelOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[.06] text-white/55 disabled:opacity-30"><Icons.x size={17} /></button></div><div className="relative mx-auto mt-5 h-64 w-64"><span className="absolute left-1/2 top-[-5px] z-10 -translate-x-1/2 text-2xl text-white">▼</span><div className="party-wheel h-full w-full rounded-full border-4 border-white/15 shadow-[0_0_55px_rgba(217,70,239,.25)] transition-transform duration-[3200ms] ease-[cubic-bezier(.12,.68,.12,1)]" style={{ transform: `rotate(${wheelRotation}deg)` }}><div className="absolute inset-[27%] flex items-center justify-center rounded-full border border-white/20 bg-[#111820] text-3xl shadow-xl">🎲</div></div></div>{selectedGame ? <div className="mt-4 rounded-xl bg-emerald-400/10 p-3 text-center"><p className="text-[9px] font-black uppercase tracking-wider text-emerald-300">Vybrané</p><p className="mt-1 text-lg font-black">{selectedGame.icon} {selectedGame.title}</p></div> : <p className="mt-4 text-center text-xs text-white/38">Koleso vyberá iba hry, ktoré aplikácia vie spustiť.</p>}<button type="button" disabled={spinning} onClick={selectedGame ? () => onNavigate(selectedGame.screen) : spinWheel} className="mt-4 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 py-3.5 text-sm font-black shadow-lg disabled:opacity-45">{spinning ? "Točí sa…" : selectedGame ? "Spustiť hru" : "Roztočiť"}</button>{selectedGame && <button type="button" onClick={spinWheel} className="mt-2 w-full py-2 text-[10px] font-black text-white/40">Točiť znova</button>}</section></div>}
    </main>
  );
}
