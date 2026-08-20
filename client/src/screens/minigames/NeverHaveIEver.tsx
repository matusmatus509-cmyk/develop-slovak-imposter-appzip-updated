import { useCallback, useEffect, useMemo, useState } from "react";
import { getNeverHaveIEverForLanguage } from "../../data/localizedNeverHaveIEver";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button, Shell, TopBar } from "../../components/ui";
import CustomContentSelector, { type CustomContentControls } from "../../components/CustomContentSelector";
import { Icons } from "../../components/icons";
import { takePersistentItem } from "../../utils/persistentDeck";
import type { WorkshopEntry } from "../../types";

interface Card { id?: string; text: string; source: "bundled" | "custom" }

export default function NeverHaveIEver({ onBack, customEntries = [], customControls }: {
  onBack: () => void; customEntries?: WorkshopEntry[]; customControls?: CustomContentControls;
}) {
  const { language } = useLanguage();
  const deck = useMemo<Card[]>(() => [
    ...getNeverHaveIEverForLanguage(language).map((text) => ({ text, source: "bundled" as const })),
    ...customEntries.map((entry) => ({ id: entry.id, text: entry.text, source: "custom" as const })),
  ], [customEntries, language]);
  const draw = useCallback(() => takePersistentItem(
    "never-have-i-ever",
    deck,
    (item) => item.source === "bundled" ? item.text : `${item.source}:${item.id ?? item.text}`,
  ), [deck]);
  const [card, setCard] = useState<Card>(draw);

  useEffect(() => {
    if (card.source === "custom" && !customEntries.some((entry) => entry.id === card.id)) setCard(draw());
  }, [card.id, card.source, customEntries, draw]);

  function next() { setCard(draw()); }

  return <Shell className="prompt-game-shell prompt-game-never"><TopBar title="Nikdy som nikdy" onBack={onBack} /><div className="prompt-game-stage game-center-stack flex flex-1 flex-col items-center justify-center gap-5 text-center">
    <div className="prompt-game-emblem"><Icons.wine size={41} /></div>
    {customControls && <div className="w-full"><CustomContentSelector controls={customControls} compact /></div>}
    <p className="prompt-game-rule">Ak platí, napi sa alebo zdvihni prst.</p>
    {card.source === "custom" && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-[9px] font-black text-emerald-300"><Icons.sparkles size={12} /> Vlastná kartička</span>}
    <div className="prompt-game-card is-never"><p data-no-translate>{card.text}</p></div>
    <Button fullWidth onClick={next} className="prompt-game-next"><span className="inline-flex items-center gap-2">Ďalší výrok <Icons.chevronRight size={17} /></span></Button>
  </div></Shell>;
}
