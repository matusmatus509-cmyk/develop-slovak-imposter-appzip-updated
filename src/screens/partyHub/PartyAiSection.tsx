import { useState } from "react";
import { generatePartySession } from "../../data/partyContent";
import type { AiAudience, AiIntensity, AiVibe, GeneratedLaunchPayload, PartyGeneratorControls } from "../../types";

const AUDIENCES: Array<[AiAudience, string]> = [["friends", "Priatelia"], ["family", "Rodina"], ["couple", "Dvojica"]];
const VIBES: Array<[AiVibe, string]> = [["fun", "Zábava"], ["chill", "Pohoda"], ["competitive", "Súťaž"]];

export default function PartyAiSection({ onLaunch }: { onLaunch: (payload: GeneratedLaunchPayload) => void }) {
  const [controls, setControls] = useState<PartyGeneratorControls>({ audience: "friends", vibe: "fun", intensity: 2, context: "Sme na chate" });
  const [session, setSession] = useState(() => generatePartySession(controls));
  const update = <K extends keyof PartyGeneratorControls>(key: K, value: PartyGeneratorControls[K]) => setControls((current) => ({ ...current, [key]: value }));

  return (
    <section id="ai-party" className="premium-card border-fuchsia-300/15 bg-fuchsia-400/[.055] p-4">
      <div className="premium-section-heading">
        <div><p className="premium-eyebrow text-fuchsia-300/75">Inteligentný generátor v zariadení</p><h2>AI Party</h2></div><span className="premium-icon">✨</span>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-white/48">Používa iba zabudované šablóny. Kontext nikdy neopustí toto zariadenie.</p>

      <div className="mt-4 space-y-3">
        <fieldset><legend className="premium-field-label">Pre koho</legend><div className="grid grid-cols-3 gap-2">{AUDIENCES.map(([value, label]) => <button key={value} type="button" aria-pressed={controls.audience === value} onClick={() => update("audience", value)} className={`premium-choice ${controls.audience === value ? "is-active" : ""}`}>{label}</button>)}</div></fieldset>
        <fieldset><legend className="premium-field-label">Nálada</legend><div className="grid grid-cols-3 gap-2">{VIBES.map(([value, label]) => <button key={value} type="button" aria-pressed={controls.vibe === value} onClick={() => update("vibe", value)} className={`premium-choice ${controls.vibe === value ? "is-active" : ""}`}>{label}</button>)}</div></fieldset>
        <fieldset><legend className="premium-field-label">Intenzita</legend><div className="grid grid-cols-3 gap-2">{([1, 2, 3] as AiIntensity[]).map((value) => <button key={value} type="button" aria-pressed={controls.intensity === value} onClick={() => update("intensity", value)} className={`premium-choice ${controls.intensity === value ? "is-active" : ""}`}>{value}</button>)}</div></fieldset>
        <div className="grid grid-cols-[1fr_6.5rem] gap-2">
          <label><span className="premium-field-label">Kontext</span><input value={controls.context} onChange={(event) => update("context", event.target.value)} maxLength={80} placeholder="Napr. večer na chate" className="premium-input" /></label>
          <label><span className="premium-field-label">Hráči</span><input value={controls.playerCount ?? ""} onChange={(event) => update("playerCount", event.target.value ? Number(event.target.value) : undefined)} type="number" min={2} max={20} placeholder="—" className="premium-input" /></label>
        </div>
        <button type="button" onClick={() => setSession(generatePartySession(controls))} className="w-full rounded-xl bg-fuchsia-300 py-3 text-xs font-black text-fuchsia-950">Vytvoriť lokálny mix</button>
      </div>

      <article className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
        <h3 className="text-sm font-black">{session.title}</h3><p className="mt-1 text-[10px] text-white/48">{session.summary}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">{session.themeTags.map((tag) => <span key={tag} className="rounded-full bg-white/[.07] px-2 py-1 text-[8px] font-black text-white/45">#{tag}</span>)}</div>
      </article>

      <div className="mt-3 space-y-2">{session.groups.map((group) => (
        <article key={group.id} className="rounded-2xl border border-white/[.09] bg-black/20 p-3">
          <div className="flex items-center gap-2"><span className="text-xl">{group.icon}</span><div className="min-w-0 flex-1"><h3 className="text-xs font-black">{group.title}</h3><p className="text-[9px] text-white/38">{group.prompts.length} pripravených kariet</p></div></div>
          <ul className="mt-2 space-y-1 text-[10px] leading-relaxed text-white/55">{group.prompts.slice(0, 4).map((prompt, index) => <li key={`${prompt.text}-${index}`} className="truncate">• {prompt.text}{prompt.answer ? ` / ${prompt.answer}` : ""}</li>)}</ul>
          <button type="button" onClick={() => onLaunch({ sessionId: session.id, screen: group.screen, title: session.title, prompts: group.prompts })} className="mt-3 w-full rounded-xl border border-fuchsia-300/25 bg-fuchsia-400/12 py-2.5 text-[10px] font-black text-fuchsia-100">Spustiť s touto témou</button>
        </article>
      ))}</div>
    </section>
  );
}
