import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getNeverHaveIEverForLanguage } from "../../data/localizedNeverHaveIEver";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button, Shell, TopBar } from "../../components/ui";
import CustomContentSelector, { type CustomContentControls } from "../../components/CustomContentSelector";
import { Icons } from "../../components/icons";
import { takePersistentItem } from "../../utils/persistentDeck";
import type { GeneratedPrompt, WorkshopEntry } from "../../types";

interface Card { id?: string; text: string; source: "bundled" | "custom" | "theme" }

export default function NeverHaveIEver({ onBack, customEntries = [], customControls, themedPrompts = [] }: {
  onBack: () => void; customEntries?: WorkshopEntry[]; customControls?: CustomContentControls; themedPrompts?: GeneratedPrompt[];
}) {
  const { language } = useLanguage();
  const deck = useMemo<Card[]>(() => [...getNeverHaveIEverForLanguage(language).map((text) => ({ text, source: "bundled" as const })), ...customEntries.map((entry) => ({ id: entry.id, text: entry.text, source: "custom" as const }))], [customEntries, language]);
  const themeQueue = useRef(themedPrompts.filter((item) => item.kind === "never").map((item) => ({ text: item.text, source: "theme" as const })));
  const draw = useCallback(() => themeQueue.current.shift() ?? takePersistentItem("never-have-i-ever", deck, (item) => item.source === "bundled" ? item.text : `${item.source}:${item.id ?? item.text}`), [deck]);
  const [card, setCard] = useState<Card>(draw);
  useEffect(() => {
    if (card.source === "custom" && !customEntries.some((entry) => entry.id === card.id)) setCard(draw());
  }, [card.id, card.source, customEntries, draw]);
  function next() { setCard(draw()); }
  return <Shell><TopBar title="Nikdy som nikdy" onBack={onBack} /><div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20"><Icons.wine size={46} className="text-emerald-400" /></div>
    {customControls && <div className="w-full"><CustomContentSelector controls={customControls} compact /></div>}
    <p className="text-xs font-bold uppercase tracking-widest text-white/40">Ak si to robil/a, napi sa alebo zdvihni prst</p>
    {card.source !== "bundled" && <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[9px] font-black text-emerald-300">{card.source === "theme" ? "✨ AI Party téma" : "✨ Vlastná kartička"}</span>}
    <div className="glass w-full rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8"><p className="text-xl font-bold leading-relaxed" data-no-translate>{card.text}</p></div>
    <p className="text-xs text-white/40">Karty sa neopakujú, kým sa neminú všetky</p><Button fullWidth onClick={next}>Ďalší výrok ➡️</Button>
  </div></Shell>;
}
