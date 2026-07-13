import { useState } from "react";
import { WOULD_YOU_RATHER } from "../../data/prompts";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";

function pickRandomIndex(len: number, exclude: number) {
  if (len <= 1) return 0;
  let i = Math.floor(Math.random() * len);
  while (i === exclude) i = Math.floor(Math.random() * len);
  return i;
}

export default function WouldYouRather({ onBack }: { onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<"a" | "b" | null>(null);
  const pair = WOULD_YOU_RATHER[index];

  function next() {
    setPicked(null);
    setIndex((i) => pickRandomIndex(WOULD_YOU_RATHER.length, i));
  }

  return (
    <Shell>
      <TopBar title="Radšej by som..." onBack={onBack} />

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500/20 to-rose-500/20"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <Icons.brain size={48} className="text-amber-400" />
        </div>

        <h1 className="text-xl font-black" style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }}>Čo by si si vybral/a?</h1>

        <div className="flex w-full flex-col gap-4">
          <button
            onClick={() => setPicked("a")}
            className={cn(
              "group rounded-3xl border p-6 text-left transition-all active:scale-95",
              picked === "a"
                ? "border-fuchsia-400/70 bg-gradient-to-br from-orange-500/20 to-fuchsia-600/20 shadow-lg shadow-fuchsia-900/30"
                : "border-white/10 bg-white/5 hover:bg-white/8"
            )}
            style={{ animation: "slideUp 0.5s ease-out 0.2s both" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                Možnosť A
              </span>
              {picked === "a" && (
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500/40 text-white"
                  style={{ animation: "popIn 0.3s" }}
                >
                  ✓
                </span>
              )}
            </div>
            <p className="mt-2 text-lg font-bold capitalize font-display">{pair.a}</p>
          </button>

          <div
            className="text-xs font-black uppercase tracking-widest text-white/30"
            style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}
          >
            alebo
          </div>

          <button
            onClick={() => setPicked("b")}
            className={cn(
              "group rounded-3xl border p-6 text-left transition-all active:scale-95",
              picked === "b"
                ? "border-fuchsia-400/70 bg-gradient-to-br from-orange-500/20 to-fuchsia-600/20 shadow-lg shadow-fuchsia-900/30"
                : "border-white/10 bg-white/5 hover:bg-white/8"
            )}
            style={{ animation: "slideUp 0.5s ease-out 0.4s both" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                Možnosť B
              </span>
              {picked === "b" && (
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500/40 text-white"
                  style={{ animation: "popIn 0.3s" }}
                >
                  ✓
                </span>
              )}
            </div>
            <p className="mt-2 text-lg font-bold capitalize font-display">{pair.b}</p>
          </button>
        </div>

        <Button fullWidth onClick={next}>
          Ďalšia otázka ➡️
        </Button>
      </div>
    </Shell>
  );
}
