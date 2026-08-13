import { useEffect, useMemo, useRef, useState } from "react";
import { getEmojiCategories, type EmojiCategory, type EmojiPuzzle } from "../../data/emojiCategories";
import { Button, Shell, TopBar } from "../../components/ui";
import CustomContentSelector, { type CustomContentControls } from "../../components/CustomContentSelector";
import { useLanguage } from "../../i18n/LanguageProvider";
import { takePersistentItem } from "../../utils/persistentDeck";
import type { WorkshopEntry } from "../../types";
import { Icons } from "../../components/icons";

export default function HadajEmoji({ onBack, customEntries = [], customControls }: { onBack: () => void; customEntries?: WorkshopEntry[]; customControls?: CustomContentControls }) {
  const { language } = useLanguage();
  const customSignature = JSON.stringify(customEntries.map((entry) => [entry.id, entry.text, entry.answer ?? ""]));
  const customPuzzles = useMemo(
    () => customEntries.filter((entry) => entry.answer).map((entry) => ({ id: `custom:${entry.id}`, emoji: entry.text, answer: entry.answer! })),
    // The signature keeps this stable when App re-filters the same persisted entries.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customSignature],
  );
  const categories = useMemo(() => {
    const bundled = getEmojiCategories(language === "sk");
    return customPuzzles.length ? [...bundled, { id: "custom", title: "Vlastné", icon: "✨", puzzles: customPuzzles }] : bundled;
  }, [customPuzzles, language]);
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const initialDeckKey = `emoji:${language}:${categories[0].id}`;
  const initialContentVersion = categories[0].id === "custom" ? customSignature : language;
  const lastDeckKeyRef = useRef(`${initialDeckKey}:${initialContentVersion}`);
  const [puzzle, setPuzzle] = useState<EmojiPuzzle>(() => takePersistentItem(initialDeckKey, categories[0].puzzles, (item) => item.id ?? `${item.emoji}|${item.answer}`));
  const [revealed, setRevealed] = useState(false);
  const category = categories.find((item) => item.id === categoryId) ?? categories[0];

  useEffect(() => {
    const nextCategory = categories.find((item) => item.id === categoryId) ?? categories[0];
    if (nextCategory.id !== categoryId) setCategoryId(nextCategory.id);
    const contentVersion = nextCategory.id === "custom" ? customSignature : language;
    const nextDeckKey = `emoji:${language}:${nextCategory.id}:${contentVersion}`;
    if (lastDeckKeyRef.current === nextDeckKey) return;
    lastDeckKeyRef.current = nextDeckKey;
    setPuzzle(takePersistentItem(`emoji:${language}:${nextCategory.id}`, nextCategory.puzzles, (item) => item.id ?? `${item.emoji}|${item.answer}`));
    setRevealed(false);
  }, [categories, categoryId, customSignature, language]);
  function selectCategory(next: EmojiCategory) { setCategoryId(next.id); setRevealed(false); }
  function next() { setRevealed(false); setPuzzle(takePersistentItem(`emoji:${language}:${category.id}`, category.puzzles, (item) => item.id ?? `${item.emoji}|${item.answer}`)); }

  return <Shell><TopBar title="Hádaj emoji" onBack={onBack} /><div className="game-center-stack flex flex-1 flex-col items-center justify-center gap-5 text-center">
    {customControls && <div className="w-full"><CustomContentSelector controls={customControls} compact /></div>}
    <div className="w-full"><p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">Vyber kategóriu</p><div className="flex flex-wrap justify-center gap-2">{categories.map((item) => <button key={item.id} onClick={() => selectCategory(item)} className={`rounded-2xl border px-3 py-2 text-sm font-bold ${item.id === categoryId ? "border-amber-300/70 bg-amber-400/20 text-amber-200" : "border-white/10 bg-white/5 text-white/55"}`}>{item.icon} {item.title}</button>)}</div></div>
    <div><p className="text-xs font-bold uppercase tracking-widest text-amber-300/70">{category.icon} {category.title}</p><p className="mt-1 text-xs text-white/40">Čo tieto emoji znamenajú?</p></div>
    {category.id === "custom" && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-[9px] font-black text-emerald-300"><Icons.sparkles size={12} /> Vlastná kartička</span>}
    <div className="glass w-full rounded-3xl border border-amber-400/20 bg-amber-400/10 p-10" key={`${categoryId}-${puzzle.answer}`}><p className="text-5xl leading-tight tracking-widest sm:text-6xl">{puzzle.emoji}</p></div>
    {!revealed ? <button onClick={() => setRevealed(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 py-4 text-base font-bold text-white/70"><Icons.eye size={19} /> Odhaliť odpoveď</button> : <div className="glass w-full rounded-3xl border border-green-400/40 bg-green-400/10 p-6"><p className="mb-2 text-xs font-bold uppercase tracking-widest text-green-400/70">Odpoveď</p><p className="text-3xl font-black">{puzzle.answer}</p></div>}
    <Button fullWidth onClick={next}><span className="inline-flex items-center gap-2">Ďalší <Icons.chevronRight size={17} /></span></Button>
  </div></Shell>;
}
