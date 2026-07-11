import { useState } from "react";
import { NEVER_HAVE_I_EVER } from "../../data/prompts";
import { Button, Shell, TopBar } from "../../components/ui";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function NeverHaveIEver({ onBack }: { onBack: () => void }) {
  const [deck, setDeck] = useState<string[]>(() =>
    shuffle(NEVER_HAVE_I_EVER)
  );
  const [index, setIndex] = useState(0);

  function next() {
    if (index + 1 >= deck.length) {
      setDeck(shuffle(NEVER_HAVE_I_EVER));
      setIndex(0);
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <Shell>
      <TopBar title="Nikdy som nikdy" onBack={onBack} />

      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <div className="text-5xl">🍷</div>
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">
          Ak si to robil/a, napi sa alebo zdvihni prst
        </p>
        <div className="w-full rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
          <p className="text-xl font-bold leading-relaxed text-white">
            {deck[index]}
          </p>
        </div>
        <p className="text-xs text-white/40">
          Výrok {index + 1} / {deck.length}
        </p>
        <Button fullWidth onClick={next}>
          Ďalší výrok ➡️
        </Button>
      </div>
    </Shell>
  );
}
