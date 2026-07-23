import { useEffect, useMemo, useState } from "react";
import {
  getEmojiCategories,
  type EmojiCategory,
  type EmojiPuzzle,
} from "../../data/emojiCategories";
import { Button, Shell, TopBar } from "../../components/ui";
import { useLanguage } from "../../i18n/LanguageProvider";
import { takePersistentItem } from "../../utils/persistentDeck";

export default function HadajEmoji({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const categories = useMemo(() => getEmojiCategories(language === "sk"), [language]);
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [puzzle, setPuzzle] = useState<EmojiPuzzle>(() => takePersistentItem(`emoji:${language}:${categories[0].id}`, categories[0].puzzles, (item) => `${item.emoji}|${item.answer}`));
  const [revealed, setRevealed] = useState(false);

  const category = categories.find((item) => item.id === categoryId) ?? categories[0];

  useEffect(() => {
    const nextCategory = categories.find((item) => item.id === categoryId) ?? categories[0];
    setCategoryId(nextCategory.id);
    setPuzzle(takePersistentItem(`emoji:${language}:${nextCategory.id}`, nextCategory.puzzles, (item) => `${item.emoji}|${item.answer}`));
    setRevealed(false);
  }, [categories, categoryId]);

  function selectCategory(nextCategory: EmojiCategory) {
    setCategoryId(nextCategory.id);
    setPuzzle(takePersistentItem(`emoji:${language}:${nextCategory.id}`, nextCategory.puzzles, (item) => `${item.emoji}|${item.answer}`));
    setRevealed(false);
  }

  function next() {
    setRevealed(false);
    setPuzzle(takePersistentItem(`emoji:${language}:${category.id}`, category.puzzles, (item) => `${item.emoji}|${item.answer}`));
  }

  return (
    <Shell>
      <TopBar title="Hádaj emoji" onBack={onBack} />

      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <div className="w-full">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">
            Vyber kategóriu
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((item) => (
              <button
                key={item.id}
                onClick={() => selectCategory(item)}
                className={`rounded-2xl border px-3 py-2 text-sm font-bold transition active:scale-95 ${
                  item.id === categoryId
                    ? "border-amber-300/70 bg-amber-400/20 text-amber-200"
                    : "border-white/10 bg-white/5 text-white/55"
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
          </p>
          <p className="mt-1 text-xs text-white/40">Čo tieto emoji znamenajú?</p>
        </div>

        <div
          className="glass w-full rounded-3xl border border-amber-400/20 bg-amber-400/10 p-10"
          style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both" }}
          key={`${categoryId}-${puzzle.answer}`}
        >
          <p className="text-5xl leading-tight tracking-widest sm:text-6xl">{puzzle.emoji}</p>
        </div>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="w-full rounded-2xl border border-white/15 bg-white/8 py-4 text-base font-bold text-white/70 transition-all hover:bg-white/12 active:scale-95"
          >
            Odhaliť odpoveď 👁️
          </button>
        ) : (
          <div
            className="glass w-full rounded-3xl border border-green-400/40 bg-green-400/10 p-6"
            style={{ animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-green-400/70">
              Odpoveď
            </p>
            <p className="inline text-3xl font-black text-white text-gradient">
              {puzzle.answer}
            </p>
          </div>
        )}

        <p className="text-xs text-white/40">
          Karty sa neopakujú, kým sa neminú všetky
        </p>

        <Button fullWidth onClick={next}>
          Ďalší ➡️
        </Button>
      </div>
    </Shell>
  );
}
