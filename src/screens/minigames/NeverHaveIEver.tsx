import { useState } from "react";
import { NEVER_HAVE_I_EVER } from "../../data/prompts";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function NeverHaveIEver({ onBack }: { onBack: () => void }) {
  const [deck, setDeck] = useState<string[]>(() => shuffle(NEVER_HAVE_I_EVER));
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
        <div
          className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <Icons.wine size={56} className="text-emerald-400" />
        </div>

        <div style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }}>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">
            Ak si to robil/a, napi sa alebo zdvihni prst
          </p>
        </div>

        <div
          className="w-full rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 glass"
          style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both" }}
        >
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
