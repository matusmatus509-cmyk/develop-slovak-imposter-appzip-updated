import { Icons } from "../components/icons";
import { Toggle } from "../components/ui";
import type { FeedbackSettings } from "../types";

export default function Settings({ settings, onChange, onBack }: { settings: FeedbackSettings; onChange: (settings: FeedbackSettings) => void; onBack: () => void }) {
  const update = (key: keyof FeedbackSettings, value: boolean) => onChange({ ...settings, [key]: value });
  return (
    <main className="min-h-screen bg-[#080b10] px-5 pb-10 pt-5 text-white">
      <div className="mx-auto w-full max-w-md">
        <header className="flex items-center justify-between">
          <button type="button" onClick={onBack} aria-label="Späť" className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-[#111820]/95 text-white/70 shadow-xl transition active:scale-90"><Icons.arrowLeft size={19} /></button>
          <p className="text-[10px] font-black uppercase tracking-[.22em] text-violet-300">Aplikácia</p>
          <div className="h-11 w-11" />
        </header>
        <section className="mt-9">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200"><Icons.settings size={25} /></span>
          <h1 className="mt-4 text-4xl font-black tracking-tight">Nastavenia</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/45">Prispôsobte si zvuky, vibrácie a pohyb v hre.</p>
        </section>
        <section className="mt-7 space-y-3">
          <Toggle checked={settings.darkMode} onChange={(value) => update("darkMode", value)} label="Tmavý režim" description="Tmavý vzhľad aplikácie je šetrnejší k očiam." />
          <Toggle checked={settings.soundsEnabled} onChange={(value) => update("soundsEnabled", value)} label="Zvuky" description="Kliknutia, odpočítavanie, výhry a prehry." />
          <Toggle checked={settings.vibrationEnabled} onChange={(value) => update("vibrationEnabled", value)} label="Vibrácie" description="Hmatová odozva pre podporované zariadenia." />
          <Toggle checked={settings.animationsEnabled} onChange={(value) => update("animationsEnabled", value)} label="Animácie" description="Prechody, počítanie bodov a oslavy víťazstva." />
        </section>
        <section className="mt-7 rounded-[1.6rem] border border-white/10 bg-white/[.045] p-5">
          <p className="text-[10px] font-black uppercase tracking-[.18em] text-violet-300">Tip</p>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-white/55">Vypnite animácie, ak preferujete pokojnejší zážitok alebo máte citlivosť na pohyb.</p>
        </section>
      </div>
    </main>
  );
}
