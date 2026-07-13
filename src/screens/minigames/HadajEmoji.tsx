import { useState } from "react";
import { EMOJI_PUZZLES } from "../../data/prompts";
import { Button, Shell, TopBar } from "../../components/ui";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function HadajEmoji({ onBack }: { onBack: () => void }) {
  const [deck, setDeck] = useState(() => shuffle(EMOJI_PUZZLES));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const puzzle = deck[index];

  function next() {
    setRevealed(false);
    if (index + 1 >= deck.length) {
      setDeck(shuffle(EMOJI_PUZZLES));
      setIndex(0);
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <Shell>
      <TopBar title="Hádaj emoji" onBack={onBack} />

      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <p
          className="text-xs font-bold uppercase tracking-widest text-white/40"
          style={{ animation: "fadeIn 0.5s ease-out" }}
        >
          Čo tieto emoji znamenajú?
        </p>

        {/* Emoji puzzle card */}
        <div
          className="w-full rounded-3xl border border-amber-400/20 bg-amber-400/10 p-12 glass"
          style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both" }}
        >
          <p className="text-6xl leading-tight tracking-widest transition-transform">{puzzle.emoji}</p>
        </div>

        {/* Answer reveal */}
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="w-full rounded-2xl border border-white/15 bg-white/8 py-4 text-base font-bold text-white/70 transition-all hover:bg-white/12 active:scale-95"
            style={{ animation: "fadeIn 0.4s ease-out 0.2s both" }}
          >
            Odhaliť odpoveď 👁
          </button>
        ) : (
          <div
            className="w-full rounded-3xl border border-green-400/40 bg-green-400/10 p-6 glass"
            style={{ animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-green-400/70 mb-2">
              Odpoveď
            </p>
            <p className="text-3xl font-black text-white text-gradient inline">
              {puzzle.answer}
            </p>
          </div>
        )}

        <p className="text-xs text-white/40">
          {index + 1} / {deck.length}
        </p>

        <Button fullWidth onClick={next}>
          Ďalší ➡️
        </Button>
      </div>
    </Shell>
  );
}
