import { useEffect, useMemo, useRef, useState } from "react";
import {
  getEmojiCategories,
  type EmojiCategory,
  type EmojiPuzzle,
} from "../../data/emojiCategories";
import { Button, Shell, TopBar } from "../../components/ui";
import CustomContentSelector, {
  type CustomContentControls,
} from "../../components/CustomContentSelector";
import { useLanguage } from "../../i18n/LanguageProvider";
import { takePersistentItem } from "../../utils/persistentDeck";
import type { WorkshopEntry } from "../../types";
import { Icons } from "../../components/icons";

export default function HadajEmoji({
  onBack,
  customEntries = [],
  customControls,
}: {
  onBack: () => void;
  customEntries?: WorkshopEntry[];
  customControls?: CustomContentControls;
}) {
  const { language } = useLanguage();
  const customSignature = JSON.stringify(
    customEntries.map(entry => [entry.id, entry.text, entry.answer ?? ""])
  );
  const customPuzzles = useMemo(
    () =>
      customEntries
        .filter(entry => entry.answer)
        .map(entry => ({
          id: `custom:${entry.id}`,
          emoji: entry.text,
          answer: entry.answer!,
        })),
    // The signature keeps this stable when App re-filters the same persisted entries.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customSignature]
  );
  const categories = useMemo(() => {
    const bundled = getEmojiCategories(language === "sk");
    return customPuzzles.length
      ? [
          ...bundled,
          {
            id: "custom",
            title: "Vlastné",
            icon: "✨",
            puzzles: customPuzzles,
          },
        ]
      : bundled;
  }, [customPuzzles, language]);
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const initialDeckKey = `emoji:${language}:${categories[0].id}`;
  const initialContentVersion =
    categories[0].id === "custom" ? customSignature : language;
  const lastDeckKeyRef = useRef(`${initialDeckKey}:${initialContentVersion}`);
  const [puzzle, setPuzzle] = useState<EmojiPuzzle>(() =>
    takePersistentItem(
      initialDeckKey,
      categories[0].puzzles,
      item => item.id ?? `${item.emoji}|${item.answer}`
    )
  );
  const [revealed, setRevealed] = useState(false);
  const category =
    categories.find(item => item.id === categoryId) ?? categories[0];

  useEffect(() => {
    const nextCategory =
      categories.find(item => item.id === categoryId) ?? categories[0];
    if (nextCategory.id !== categoryId) setCategoryId(nextCategory.id);
    const contentVersion =
      nextCategory.id === "custom" ? customSignature : language;
    const nextDeckKey = `emoji:${language}:${nextCategory.id}:${contentVersion}`;
    if (lastDeckKeyRef.current === nextDeckKey) return;
    lastDeckKeyRef.current = nextDeckKey;
    setPuzzle(
      takePersistentItem(
        `emoji:${language}:${nextCategory.id}`,
        nextCategory.puzzles,
        item => item.id ?? `${item.emoji}|${item.answer}`
      )
    );
    setRevealed(false);
  }, [categories, categoryId, customSignature, language]);

  function selectCategory(next: EmojiCategory) {
    setCategoryId(next.id);
    setRevealed(false);
  }

  function next() {
    setRevealed(false);
    setPuzzle(
      takePersistentItem(
        `emoji:${language}:${category.id}`,
        category.puzzles,
        item => item.id ?? `${item.emoji}|${item.answer}`
      )
    );
  }

  return (
    <Shell>
      <TopBar title="Hádaj emoji" onBack={onBack} />
      <div className="game-center-stack flex flex-1 flex-col items-center justify-center gap-5 text-center">
        {customControls && (
          <div className="w-full">
            <CustomContentSelector controls={customControls} compact />
          </div>
        )}

        <div className="w-full">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">
            Vyber kategóriu
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectCategory(item)}
                className={`shrink-0 rounded-2xl border px-3 py-2 text-sm font-bold transition active:scale-95 ${
                  item.id === categoryId
                    ? "border-amber-300/70 bg-amber-400/20 text-amber-100 shadow-[0_0_20px_rgba(250,204,21,.12)]"
                    : "border-white/10 bg-white/5 text-white/55 hover:bg-white/10"
                }`}
              >
                {item.icon} {item.title}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-300/70">
            {category.icon} {category.title}
            <span className="ml-2 font-bold text-white/30">
              {category.puzzles.length} kariet
            </span>
          </p>
          <p className="mt-1 text-xs text-white/40">
            Čo tieto emoji naozaj naznačujú?
          </p>
        </div>

        {category.id === "custom" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-[9px] font-black text-emerald-300">
            <Icons.sparkles size={12} /> Vlastná kartička
          </span>
        )}

        <div
          className="glass relative w-full overflow-hidden rounded-3xl border border-amber-300/25 bg-gradient-to-br from-amber-300/[0.17] via-violet-500/[0.12] to-fuchsia-500/[0.12] p-10 shadow-[0_18px_50px_rgba(0,0,0,.2)]"
          key={`${categoryId}-${puzzle.id ?? puzzle.answer}`}
        >
          <span className="absolute -left-5 -top-7 text-7xl opacity-[0.07]">
            🧩
          </span>
          <span className="absolute -bottom-8 -right-3 text-8xl opacity-[0.07]">
            💡
          </span>
          <p className="relative text-5xl leading-tight tracking-widest sm:text-6xl">
            {puzzle.emoji}
          </p>
        </div>

        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 py-4 text-base font-bold text-white/70 transition hover:bg-white/12 active:scale-[.98]"
          >
            <Icons.eye size={19} /> Odhaliť odpoveď
          </button>
        ) : (
          <div className="glass w-full rounded-3xl border border-emerald-400/40 bg-emerald-400/10 p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-300/80">
              Odpoveď
            </p>
            <p className="text-3xl font-black">{puzzle.answer}</p>
          </div>
        )}

        <Button fullWidth onClick={next}>
          <span className="inline-flex items-center gap-2">
            Ďalší <Icons.chevronRight size={17} />
          </span>
        </Button>
      </div>
    </Shell>
  );
}
