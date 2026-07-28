import { useMemo, useRef, useState } from "react";
import { DARES, TRUTHS } from "../../data/prompts";
import { Button, Shell, TopBar } from "../../components/ui";
import CustomContentSelector, { type CustomContentControls } from "../../components/CustomContentSelector";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";
import { takePersistentItem } from "../../utils/persistentDeck";
import type { GeneratedPrompt, WorkshopEntry } from "../../types";

type Mode = "choose" | "truth" | "dare";
interface PromptCard { id?: string; text: string; source: "bundled" | "custom" | "theme" }

export default function TruthOrDare({ onBack, customEntries = [], customControls, themedPrompts = [] }: {
  onBack: () => void;
  customEntries?: WorkshopEntry[];
  customControls?: CustomContentControls;
  themedPrompts?: GeneratedPrompt[];
}) {
  const [mode, setMode] = useState<Mode>("choose");
  const [prompt, setPrompt] = useState<PromptCard | null>(null);
  const decks = useMemo(() => ({
    truth: [...TRUTHS.map((text) => ({ text, source: "bundled" as const })), ...customEntries.filter((entry) => entry.kind === "truth").map((entry) => ({ id: entry.id, text: entry.text, source: "custom" as const }))],
    dare: [...DARES.map((text) => ({ text, source: "bundled" as const })), ...customEntries.filter((entry) => entry.kind === "dare").map((entry) => ({ id: entry.id, text: entry.text, source: "custom" as const }))],
  }), [customEntries]);
  const themeQueues = useRef({
    truth: themedPrompts.filter((item) => item.kind === "truth").map((item) => ({ text: item.text, source: "theme" as const })),
    dare: themedPrompts.filter((item) => item.kind === "dare").map((item) => ({ text: item.text, source: "theme" as const })),
  });

  function draw(next: "truth" | "dare") {
    const themed = themeQueues.current[next].shift();
    return themed ?? takePersistentItem(`truth-or-dare:${next}`, decks[next], (item) => item.source === "bundled" ? item.text : `${item.source}:${item.id ?? item.text}`);
  }
  function choose(next: "truth" | "dare") { setMode(next); setPrompt(draw(next)); }
  function shuffleAgain() { if (mode !== "choose") setPrompt(draw(mode)); }

  return <Shell><TopBar title="Pravda alebo výzva" onBack={onBack} />
    {mode === "choose" ? <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20" style={{ animation: "float 3s ease-in-out infinite" }}><Icons.target size={56} className="text-sky-400" /></div>
      <div><h1 className="text-2xl font-black">Čo si vyberieš?</h1><p className="mt-2 max-w-xs text-sm text-white/50">Buď úprimný alebo odvážny. Balík sa neopakuje, kým sa neminie.</p></div>
      {customControls && <div className="w-full"><CustomContentSelector controls={customControls} compact /></div>}
      {themedPrompts.length > 0 && <p className="w-full rounded-xl border border-fuchsia-300/20 bg-fuchsia-400/10 p-3 text-[10px] font-black text-fuchsia-100">✨ Aktívny tematický mix · {themedPrompts.length} kariet</p>}
      <div className="grid w-full grid-cols-2 gap-4"><button onClick={() => choose("truth")} className="flex flex-col items-center gap-3 rounded-3xl border border-sky-500/30 bg-sky-500/10 p-7 transition active:scale-95"><span className="text-4xl">💬</span><span className="font-black">PRAVDA</span></button><button onClick={() => choose("dare")} className="flex flex-col items-center gap-3 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-7 transition active:scale-95"><span className="text-4xl">🔥</span><span className="font-black">VÝZVA</span></button></div>
    </div> : <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <span className={cn("rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest", mode === "truth" ? "bg-sky-500/20 text-sky-300" : "bg-rose-500/20 text-rose-300")}>{mode === "truth" ? "Pravda 💬" : "Výzva 🔥"}</span>
      {prompt?.source !== "bundled" && <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[9px] font-black text-emerald-300">{prompt?.source === "theme" ? "✨ AI Party téma" : "✨ Vlastná kartička"}</span>}
      <div className={cn("glass w-full rounded-3xl border p-8", mode === "truth" ? "border-sky-500/30 bg-sky-500/5" : "border-rose-500/30 bg-rose-500/5")}><p className="text-xl font-bold leading-relaxed">{prompt?.text}</p></div>
      <div className="flex w-full gap-3"><Button fullWidth variant="secondary" onClick={shuffleAgain}>🔀 Iná otázka</Button><Button fullWidth variant="ghost" onClick={() => setMode("choose")}>Späť</Button></div>
    </div>}
  </Shell>;
}
