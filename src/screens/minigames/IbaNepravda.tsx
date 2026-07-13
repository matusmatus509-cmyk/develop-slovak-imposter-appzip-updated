import { useState } from "react";
import { ONLY_LIES } from "../../data/prompts";
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
        <div
          className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500/20 to-pink-500/20"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <Icons.mask size={56} className="text-rose-400" />
        </div>

        <div style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }}>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">
            Pravidlo
          </p>
          <p className="mt-2 text-sm text-white/60 max-w-xs">
            Každý musí odpovedať{" "}
            <span className="font-black text-rose-400">iba klamstvami</span>.
            Ak niekto povie pravdu, vypije alebo dostane bod.
          </p>
        </div>

        <div
          className="w-full rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 glass"
          style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both" }}
        >
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
