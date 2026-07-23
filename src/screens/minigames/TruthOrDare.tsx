import { useState } from "react";
import { DARES, TRUTHS } from "../../data/prompts";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";
import { takePersistentItem } from "../../utils/persistentDeck";

type Mode = "choose" | "truth" | "dare";

export default function TruthOrDare({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>("choose");
  const [prompt, setPrompt] = useState("");

  function choose(next: Mode) {
    setMode(next);
    setPrompt(next === "truth" ? takePersistentItem("truth-or-dare:truth", TRUTHS) : takePersistentItem("truth-or-dare:dare", DARES));
  }

  function shuffleAgain() {
    setPrompt(mode === "truth" ? takePersistentItem("truth-or-dare:truth", TRUTHS) : takePersistentItem("truth-or-dare:dare", DARES));
  }

  return (
    <Shell>
      <TopBar title="Pravda alebo výzva" onBack={onBack} />

      {mode === "choose" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            <Icons.target size={56} className="text-sky-400" />
          </div>

          <div style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }}>
            <h1 className="text-2xl font-black">Čo si vyberieš?</h1>
            <p className="max-w-xs mt-2 text-sm text-white/50">
              Ďalší hráč na rade si vyberie pravdu alebo výzvu. Buď úprimný,
              alebo odvážny!
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-4">
            <button
              onClick={() => choose("truth")}
              className="group flex flex-col items-center gap-3 rounded-3xl border border-sky-500/30 bg-sky-500/10 p-7 transition-all hover:bg-sky-500/15 hover:scale-[1.02] active:scale-95"
              style={{ animation: "scaleIn 0.5s ease-out 0.2s both", boxShadow: "0 6px 20px -8px rgba(56, 189, 248, 0.4)" }}
            >
              <span className="text-4xl transition-transform group-hover:scale-110">💬</span>
              <span className="font-black tracking-tight">PRAVDA</span>
            </button>
            <button
              onClick={() => choose("dare")}
              className="group flex flex-col items-center gap-3 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-7 transition-all hover:bg-rose-500/15 hover:scale-[1.02] active:scale-95"
              style={{ animation: "scaleIn 0.5s ease-out 0.3s both", boxShadow: "0 6px 20px -8px rgba(244, 63, 94, 0.4)" }}
            >
              <span className="text-4xl transition-transform group-hover:scale-110">🔥</span>
              <span className="font-black tracking-tight">VÝZVA</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <span
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest",
              mode === "truth"
                ? "bg-sky-500/20 text-sky-300"
                : "bg-rose-500/20 text-rose-300"
            )}
            style={{ animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            {mode === "truth" ? "Pravda 💬" : "Výzva 🔥"}
          </span>

          <div
            className={cn(
              "w-full rounded-3xl border p-8 glass",
              mode === "truth"
                ? "border-sky-500/30 bg-sky-500/5"
                : "border-rose-500/30 bg-rose-500/5"
            )}
            style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both" }}
          >
            <p className={cn("text-xl font-bold leading-relaxed", mode === "truth" ? "text-sky-50" : "text-rose-50")}>{prompt}</p>
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
