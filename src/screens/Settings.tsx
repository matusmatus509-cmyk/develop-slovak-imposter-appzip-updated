import { Icons } from "../components/icons";
import { Toggle } from "../components/ui";
import { PARTY_THEMES } from "../data/engagement";
import { useFeedback } from "../feedback/FeedbackProvider";
import type { FeedbackSettings, PartyTheme } from "../types";

function SectionTitle({ eyebrow, title, icon }: { eyebrow: string; title: string; icon: keyof typeof Icons }) {
  const SectionIcon = Icons[icon];
  return <div className="premium-section-heading"><div><p className="premium-eyebrow text-violet-300/70">{eyebrow}</p><h2>{title}</h2></div><span className="premium-icon" aria-hidden="true"><SectionIcon size={20} /></span></div>;
}

export default function Settings({ settings, musicSupported, musicBlocked, onChange, onBack }: {
  settings: FeedbackSettings;
  musicSupported: boolean;
  musicBlocked: boolean;
  onChange: (settings: FeedbackSettings) => void;
  onBack: () => void;
}) {
  const { playFeedback } = useFeedback();
  const update = <K extends keyof FeedbackSettings>(key: K, value: FeedbackSettings[K]) => onChange({ ...settings, [key]: value });

  return (
    <main className="settings-screen theme-surface min-h-screen text-white">
      <div className="mx-auto w-full max-w-md px-5 pb-12 pt-5">
        <header className="flex items-center justify-between"><button type="button" onClick={onBack} aria-label="Späť" className="premium-nav-button"><Icons.arrowLeft size={19} /></button><p className="premium-eyebrow text-violet-300">Aplikácia</p><span className="premium-nav-button"><Icons.settings size={18} /></span></header>

        <section className="settings-hero mt-8 overflow-hidden rounded-[2rem] border border-white/10 p-5 shadow-2xl shadow-black/20"><span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/15 text-violet-100 shadow-lg shadow-violet-950/30"><Icons.settings size={25} /></span><h1 className="mt-4 text-4xl font-black tracking-tight">Nastavenia</h1><p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-white/58">Vzhľad, zvuk a prístupnosť pre pohodlnú party na jednom mieste.</p></section>

        <section className="premium-card mt-7 p-4"><SectionTitle eyebrow="Vzhľad" title="Svetlo a téma" icon="palette" />
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/20 p-1.5" role="group" aria-label="Farebný režim"><button type="button" aria-pressed={!settings.darkMode} onClick={() => update("darkMode", false)} className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black transition ${!settings.darkMode ? "bg-white text-slate-900 shadow-lg" : "text-white/45"}`}><Icons.sun size={16} /> Svetlý</button><button type="button" aria-pressed={settings.darkMode} onClick={() => update("darkMode", true)} className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black transition ${settings.darkMode ? "bg-slate-800 text-white shadow-lg" : "text-white/45"}`}><Icons.moon size={16} /> Tmavý</button></div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">{PARTY_THEMES.map((theme) => <button key={theme.id} type="button" aria-pressed={settings.partyTheme === theme.id} onClick={() => update("partyTheme", theme.id as PartyTheme)} className={`rounded-2xl border p-2.5 text-left transition ${settings.partyTheme === theme.id ? "border-white/40 bg-white/[.1] ring-1 ring-[var(--theme-a)]" : "border-white/[.08] bg-white/[.035]"}`}><span className="block h-11 rounded-xl" style={{ background: theme.swatch }} /><span className="mt-2 flex items-center justify-between"><strong className="text-[10px]">{theme.title}</strong>{settings.partyTheme === theme.id && <span className="text-[10px] text-emerald-300">✓</span>}</span><small className="mt-0.5 block text-[8px] leading-snug text-white/38">{theme.description}</small></button>)}</div>
        </section>

        <section className="premium-card mt-4 p-4"><SectionTitle eyebrow="Zvuk" title="Odozva a hudba" icon="volume2" />
          <div className="mt-4 space-y-2.5"><Toggle checked={settings.soundsEnabled} onChange={(value) => update("soundsEnabled", value)} label="Zvuky aplikácie" description="Kliknutia, odpočítavanie a výsledky." /><Toggle checked={Boolean(settings.musicEnabled)} disabled={!settings.soundsEnabled || !musicSupported} onChange={(value) => update("musicEnabled", value)} label="Generovaná party hudba" description={!settings.soundsEnabled ? "Najprv zapnite zvuky." : !musicSupported ? "Web Audio nie je podporované." : musicBlocked ? "Klepnutím do stránky povoľte prehrávanie." : "Tichá slučka vzniká priamo v zariadení."} /></div>
          <button type="button" data-feedback="off" disabled={!settings.soundsEnabled} onClick={() => playFeedback("win")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-300/20 bg-violet-400/10 py-3 text-[10px] font-black text-violet-100 disabled:opacity-35"><Icons.music size={16} /> Vyskúšať zvuk</button>
        </section>

        <section className="premium-card mt-4 p-4"><SectionTitle eyebrow="Pohyb a prístupnosť" title="Pokojnejší zážitok" icon="smartphone" />
          <div className="mt-4 space-y-2.5"><Toggle checked={settings.vibrationEnabled} onChange={(value) => update("vibrationEnabled", value)} label="Vibrácie" description="Hmatová odozva na podporovaných zariadeniach." /><Toggle checked={settings.animationsEnabled} onChange={(value) => update("animationsEnabled", value)} label="Animácie" description="Prechody, oslavy a pohybové efekty." /></div>
          <button type="button" data-feedback="off" disabled={!settings.vibrationEnabled} onClick={() => playFeedback("countdown")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-400/10 py-3 text-[10px] font-black text-cyan-100 disabled:opacity-35"><Icons.smartphone size={16} /> Vyskúšať vibráciu</button>
          {!settings.animationsEnabled && <p className="mt-3 rounded-xl bg-emerald-400/[.08] p-3 text-[10px] font-semibold leading-relaxed text-emerald-100/70">Pohyb je obmedzený v celej aplikácii vrátane prechodov a kolesa hier.</p>}
        </section>

        <section className="premium-card mt-4 p-4"><SectionTitle eyebrow="Dáta" title="Iba v tomto zariadení" icon="lock" /><p className="mt-3 text-xs leading-relaxed text-white/52">Nastavenia, štatistiky a vlastné kolekcie sa ukladajú iba do lokálneho úložiska tohto prehliadača. Aplikácia ich neposiela na server ani ich nesynchronizuje.</p><div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-300/12 bg-emerald-400/[.06] p-3 text-[10px] font-semibold text-emerald-100/65"><Icons.lock size={17} /> Bez tlačidla na neúmyselné vymazanie dát</div></section>
      </div>
    </main>
  );
}
