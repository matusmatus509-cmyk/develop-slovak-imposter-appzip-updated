import { useCallback, useEffect, useMemo, useState } from "react";
import { getWouldYouRatherForLanguage } from "../../data/localizedWouldYouRather";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button, Shell, TopBar } from "../../components/ui";
import CustomContentSelector, { type CustomContentControls } from "../../components/CustomContentSelector";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";
import { takePersistentItem } from "../../utils/persistentDeck";
import type { WorkshopEntry } from "../../types";

interface Pair { id?: string; a: string; b: string; source: "bundled" | "custom" }

export default function WouldYouRather({ onBack, customEntries = [], customControls }: {
  onBack: () => void; customEntries?: WorkshopEntry[]; customControls?: CustomContentControls;
}) {
  const { language } = useLanguage();
  const deck = useMemo<Pair[]>(() => [...getWouldYouRatherForLanguage(language).map((item) => ({ ...item, source: "bundled" as const })), ...customEntries.filter((entry) => entry.answer).map((entry) => ({ id: entry.id, a: entry.text, b: entry.answer!, source: "custom" as const }))], [customEntries, language]);
  const draw = useCallback(() => takePersistentItem("would-you-rather", deck, (item) => item.source === "bundled" ? `${item.a}|${item.b}` : `${item.source}:${item.id ?? `${item.a}|${item.b}`}`), [deck]);
  const [pair, setPair] = useState<Pair>(draw);
  const [picked, setPicked] = useState<"a" | "b" | null>(null);
  useEffect(() => {
    if (pair.source === "custom" && !customEntries.some((entry) => entry.id === pair.id)) {
      setPicked(null);
      setPair(draw());
    }
  }, [customEntries, draw, pair.id, pair.source]);
  function next() { setPicked(null); setPair(draw()); }
  return <Shell><TopBar title="Radšej by som..." onBack={onBack} /><div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500/20 to-rose-500/20"><Icons.brain size={48} className="text-amber-400" /></div>
    {customControls && <div className="w-full"><CustomContentSelector controls={customControls} compact /></div>}
    <h1 className="text-xl font-black">Čo by si si vybral/a?</h1>{pair.source === "custom" && <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[9px] font-black text-emerald-300">✨ Vlastná kartička</span>}
    <div className="flex w-full flex-col gap-3">{(["a", "b"] as const).map((option, index) => <div key={option}><button onClick={() => setPicked(option)} className={cn("w-full rounded-3xl border p-6 text-left transition active:scale-95", picked === option ? "border-fuchsia-400/70 bg-fuchsia-500/15" : "border-white/10 bg-white/5")}><span className="text-xs font-bold uppercase tracking-widest text-white/40">Možnosť {option.toUpperCase()}</span><p className="mt-2 text-lg font-bold" data-no-translate>{pair[option]}</p></button>{index === 0 && <div className="mt-3 text-xs font-black uppercase tracking-widest text-white/30">alebo</div>}</div>)}</div>
    <Button fullWidth onClick={next}>Ďalšia otázka ➡️</Button>
  </div></Shell>;
}
