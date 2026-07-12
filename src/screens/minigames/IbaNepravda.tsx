import { useState } from "react";
import { ONLY_LIES } from "../../data/prompts";
import { Button, Shell, TopBar } from "../../components/ui";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function IbaNepravda({ onBack }: { onBack: () => void }) {
  const [deck, setDeck] = useState<string[]>(() => shuffle(ONLY_LIES));
  const [index, setIndex] = useState(0);

  function next() {
    if (index + 1 >= deck.length) {
      setDeck(shuffle(ONLY_LIES));
      setIndex(0);
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <Shell>
      <TopBar title="Iba nepravda" onBack={onBack} />

      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <div className="text-5xl">🤥</div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">
            Pravidlo
          </p>
          <p className="mt-1 text-sm text-white/60">
            Každý musí odpovedať{" "}
            <span className="font-black text-rose-400">iba klamstvami</span>.
            Ak niekto povie pravdu, vypije alebo dostane bod.
          </p>
        </div>

        <div className="w-full rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8">
          <p className="text-xl font-bold leading-relaxed text-white">
            {deck[index]}
          </p>
        </div>

        <p className="text-xs text-white/40">
          Otázka {index + 1} / {deck.length}
        </p>

        <Button fullWidth onClick={next}>
          Ďalšia otázka ➡️
        </Button>
      </div>
    </Shell>
  );
}
