import { Toggle } from "../components/ui";
import { PARTY_THEMES } from "../data/engagement";
import { useFeedback } from "../feedback/FeedbackProvider";
import type { FeedbackSettings, PartyTheme } from "../types";

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
    <main className="settings-screen theme-surface min-h-screen bg-[#080b10] text-white">
      <div className="mx-auto w-full max-w-md px-5 pb-12 pt-[max(1rem,env(safe-area-inset-top))]">
        <header className="flex h-11 items-center justify-between border-b border-white/[.08]"><button type="button" onClick={onBack} className="text-[10px] font-bold text-white/55">Späť</button><span className="text-[10px] font-black uppercase tracking-[.16em] text-white/72">Nastavenia</span><span className="w-8" /></header>

        <section className="mt-8"><h1 className="text-[2.25rem] font-black leading-none tracking-[-.045em]">Nastavte si hru</h1><p className="mt-3 max-w-[19rem] text-[11px] font-semibold leading-relaxed text-white/45">Vyberte si vzhľad a odozvu, ktorá vašej partii vyhovuje.</p></section>

        <section className="mt-9 border-t border-white/10 pt-5"><h2 className="text-base font-black">Vzhľad</h2>
          <div className="mt-4 grid grid-cols-2 rounded-xl border border-white/10 bg-[#111820] p-1" role="group" aria-label="Farebný režim"><button type="button" aria-pressed={!settings.darkMode} onClick={() => update("darkMode", false)} className={`rounded-lg py-3 text-[10px] font-bold transition ${!settings.darkMode ? "bg-white text-[#0b1016]" : "text-white/42"}`}>Svetlý režim</button><button type="button" aria-pressed={settings.darkMode} onClick={() => update("darkMode", true)} className={`rounded-lg py-3 text-[10px] font-bold transition ${settings.darkMode ? "bg-[#29323d] text-white" : "text-white/42"}`}>Tmavý režim</button></div>
          <div className="mt-3 grid grid-cols-2 gap-2">{PARTY_THEMES.map((theme) => <button key={theme.id} type="button" aria-pressed={settings.partyTheme === theme.id} onClick={() => update("partyTheme", theme.id as PartyTheme)} className={`rounded-xl border p-2 text-left transition ${settings.partyTheme === theme.id ? "border-white/35 bg-white/[.07]" : "border-white/[.08] bg-[#111820]"}`}><span className="block h-9 rounded-lg" style={{ background: theme.swatch }} /><span className="mt-2 flex items-center justify-between"><strong className="text-[10px]">{theme.title}</strong>{settings.partyTheme === theme.id ? <span className="text-[8px] font-bold text-white/55">Vybrané</span> : null}</span></button>)}</div>
        </section>

        <section className="mt-8 border-t border-white/10 pt-5"><h2 className="text-base font-black">Zvuk</h2><div className="mt-3 divide-y divide-white/[.07] rounded-xl border border-white/10 bg-[#111820] px-4"><Toggle checked={settings.soundsEnabled} onChange={(value) => update("soundsEnabled", value)} label="Zvuky hry" description="Odpočítavanie, tlačidlá a výsledky." /><Toggle checked={Boolean(settings.musicEnabled)} disabled={!settings.soundsEnabled || !musicSupported} onChange={(value) => update("musicEnabled", value)} label="Hudba" description={!settings.soundsEnabled ? "Najprv zapnite zvuky." : !musicSupported ? "Hudba nie je na tomto zariadení podporovaná." : musicBlocked ? "Klepnutím povoľte prehrávanie." : "Hudba počas Party mode."} /></div><button type="button" data-feedback="off" disabled={!settings.soundsEnabled} onClick={() => playFeedback("win")} className="mt-3 w-full rounded-xl border border-white/10 py-3 text-[10px] font-bold text-white/55 disabled:opacity-30">Vyskúšať zvuk</button></section>

        <section className="mt-8 border-t border-white/10 pt-5"><h2 className="text-base font-black">Ovládanie</h2><div className="mt-3 divide-y divide-white/[.07] rounded-xl border border-white/10 bg-[#111820] px-4"><Toggle checked={settings.vibrationEnabled} onChange={(value) => update("vibrationEnabled", value)} label="Vibrácie" description="Krátka odozva pri dôležitých akciách." /><Toggle checked={settings.animationsEnabled} onChange={(value) => update("animationsEnabled", value)} label="Animácie" description="Plynulé prechody medzi obrazovkami." /></div><button type="button" data-feedback="off" disabled={!settings.vibrationEnabled} onClick={() => playFeedback("countdown")} className="mt-3 w-full rounded-xl border border-white/10 py-3 text-[10px] font-bold text-white/55 disabled:opacity-30">Vyskúšať vibráciu</button></section>

        <section className="mt-8 border-t border-white/10 pt-5"><h2 className="text-base font-black">Súkromie</h2><p className="mt-2 text-[11px] font-semibold leading-relaxed text-white/42">Nastavenia, štatistiky aj vlastné kolekcie zostávajú uložené iba v tomto zariadení.</p></section>
      </div>
    </main>
  );
}
