import { useMemo, useState } from "react";
import { getDaresForLanguage, getTruthsForLanguage } from "../../data/localizedTruthOrDare";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button, Shell, TopBar } from "../../components/ui";
import CustomContentSelector, { type CustomContentControls } from "../../components/CustomContentSelector";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";
import { takePersistentItem } from "../../utils/persistentDeck";
import type { WorkshopEntry } from "../../types";

type Mode = "choose" | "truth" | "dare";
interface PromptCard { id?: string; text: string; source: "bundled" | "custom" }

export default function TruthOrDare({ onBack, customEntries = [], customControls }: {
  onBack: () => void;
  customEntries?: WorkshopEntry[];
  customControls?: CustomContentControls;
}) {
  const { language } = useLanguage();
  const decks = useMemo(() => ({
    truth: [...getTruthsForLanguage(language).map((text) => ({ text, source: "bundled" as const })), ...customEntries.filter((entry) => entry.kind === "truth").map((entry) => ({ id: entry.id, text: entry.text, source: "custom" as const }))],
    dare: [...getDaresForLanguage(language).map((text) => ({ text, source: "bundled" as const })), ...customEntries.filter((entry) => entry.kind === "dare").map((entry) => ({ id: entry.id, text: entry.text, source: "custom" as const }))],
  }), [customEntries, language]);
  const [mode, setMode] = useState<Mode>("choose");
  const [prompt, setPrompt] = useState<PromptCard | null>(null);
  function draw(next: "truth" | "dare") {
    return takePersistentItem(`truth-or-dare:${next}`, decks[next], (item) => item.source === "bundled" ? item.text : `${item.source}:${item.id ?? item.text}`);
  }
  function choose(next: "truth" | "dare") { setMode(next); setPrompt(draw(next)); }
  function shuffleAgain() { if (mode !== "choose") setPrompt(draw(mode)); }

  return <Shell className="prompt-game-shell prompt-game-truth"><TopBar title="Pravda alebo výzva" onBack={onBack} />
    {mode === "choose" ? <div className="prompt-game-stage game-center-stack flex flex-1 flex-col items-center justify-center gap-5 text-center">
      <div className="prompt-game-emblem"><Icons.target size={43} /></div>
      <div><p className="prompt-game-eyebrow">Vyber kartu</p><h1>Čo si vyberieš?</h1></div>
      {customControls && <div className="w-full"><CustomContentSelector controls={customControls} compact /></div>}
      <div className="prompt-game-choices grid w-full grid-cols-2 gap-3"><button onClick={() => choose("truth")} className="prompt-game-choice prompt-game-choice-truth"><span><Icons.messageCircle size={27} /></span><strong>Pravda</strong></button><button onClick={() => choose("dare")} className="prompt-game-choice prompt-game-choice-dare"><span><Icons.flame size={27} /></span><strong>Výzva</strong></button></div>
    </div> : <div className="prompt-game-stage game-center-stack flex flex-1 flex-col items-center justify-center gap-5 text-center">
      <span className={cn("prompt-game-mode", mode === "truth" ? "is-truth" : "is-dare")}>{mode === "truth" ? <Icons.messageCircle size={14} /> : <Icons.flame size={14} />}{mode === "truth" ? "Pravda" : "Výzva"}</span>
      {prompt?.source === "custom" && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-[9px] font-black text-emerald-300"><Icons.sparkles size={12} /> Vlastná kartička</span>}
      <div className={cn("prompt-game-card", mode === "truth" ? "is-truth" : "is-dare")}><p data-no-translate>{prompt?.text}</p></div>
      <div className="flex w-full gap-3"><Button fullWidth variant="secondary" onClick={shuffleAgain}><span className="inline-flex items-center gap-2"><Icons.refresh size={16} /> Iná otázka</span></Button><Button fullWidth variant="ghost" onClick={() => setMode("choose")}>Späť</Button></div>
    </div>}
  </Shell>;
}
