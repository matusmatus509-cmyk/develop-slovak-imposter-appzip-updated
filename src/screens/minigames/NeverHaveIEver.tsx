import { useState } from "react";
import { NEVER_HAVE_I_EVER } from "../../data/prompts";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { takePersistentItem } from "../../utils/persistentDeck";

export default function NeverHaveIEver({ onBack }: { onBack: () => void }) {
  const [prompt, setPrompt] = useState(() => takePersistentItem("never-have-i-ever", NEVER_HAVE_I_EVER));

  function next() {
    setPrompt(takePersistentItem("never-have-i-ever", NEVER_HAVE_I_EVER));
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
            {prompt}
          </p>
        </div>

        <p className="text-xs text-white/40">
          Každý výrok sa zobrazí iba raz, kým sa neminú všetky
        </p>

        <Button fullWidth onClick={next}>
          Ďalší výrok ➡️
        </Button>
      </div>
    </Shell>
  );
}
