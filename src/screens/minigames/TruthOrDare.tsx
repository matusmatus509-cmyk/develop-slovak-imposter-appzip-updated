import { useState } from "react";
import { DARES, TRUTHS } from "../../data/prompts";
import { Button, Shell, TopBar } from "../../components/ui";

type Mode = "choose" | "truth" | "dare";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function TruthOrDare({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>("choose");
  const [prompt, setPrompt] = useState("");

  function choose(next: Mode) {
    setMode(next);
    setPrompt(next === "truth" ? pickRandom(TRUTHS) : pickRandom(DARES));
  }

  function shuffleAgain() {
    setPrompt(mode === "truth" ? pickRandom(TRUTHS) : pickRandom(DARES));
  }

  return (
    <Shell>
      <TopBar title="Pravda alebo výzva" onBack={onBack} />

      {mode === "choose" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="text-5xl">🎯</div>
          <h1 className="text-2xl font-black">Čo si vyberieš?</h1>
          <p className="max-w-xs text-sm text-white/50">
            Ďalší hráč na rade si vyberie pravdu alebo výzvu. Buď úprimný,
            alebo odvážny!
          </p>
          <div className="grid w-full grid-cols-2 gap-4">
            <button
              onClick={() => choose("truth")}
              className="flex flex-col items-center gap-2 rounded-3xl border border-sky-500/30 bg-sky-500/10 p-6 active:scale-95"
            >
              <span className="text-3xl">💬</span>
              <span className="font-black">PRAVDA</span>
            </button>
            <button
              onClick={() => choose("dare")}
              className="flex flex-col items-center gap-2 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 active:scale-95"
            >
              <span className="text-3xl">🔥</span>
              <span className="font-black">VÝZVA</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <span
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${
              mode === "truth"
                ? "bg-sky-500/20 text-sky-300"
                : "bg-rose-500/20 text-rose-300"
            }`}
          >
            {mode === "truth" ? "Pravda 💬" : "Výzva 🔥"}
          </span>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-xl font-bold leading-relaxed">{prompt}</p>
          </div>
          <div className="flex w-full gap-3">
            <Button fullWidth variant="secondary" onClick={shuffleAgain}>
              🔀 Iná otázka
            </Button>
            <Button fullWidth variant="ghost" onClick={() => setMode("choose")}>
              Späť
            </Button>
          </div>
        </div>
      )}
    </Shell>
  );
}
