import { useState } from "react";
import { WOULD_YOU_RATHER } from "../../data/prompts";
import { Button, Shell, TopBar } from "../../components/ui";

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
        <div className="text-5xl">🤔</div>
        <h1 className="text-xl font-black">Čo by si si vybral/a?</h1>

        <div className="flex w-full flex-col gap-4">
          <button
            onClick={() => setPicked("a")}
            className={`rounded-3xl border p-6 text-left transition ${
              picked === "a"
                ? "border-fuchsia-400/60 bg-gradient-to-br from-orange-500/20 to-fuchsia-600/20"
                : "border-white/10 bg-white/5"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">
              Možnosť A
            </span>
            <p className="mt-1 text-lg font-bold capitalize">{pair.a}</p>
          </button>

          <div className="text-xs font-black uppercase tracking-widest text-white/30">
            alebo
          </div>

          <button
            onClick={() => setPicked("b")}
            className={`rounded-3xl border p-6 text-left transition ${
              picked === "b"
                ? "border-fuchsia-400/60 bg-gradient-to-br from-orange-500/20 to-fuchsia-600/20"
                : "border-white/10 bg-white/5"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">
              Možnosť B
            </span>
            <p className="mt-1 text-lg font-bold capitalize">{pair.b}</p>
          </button>
        </div>

        <Button fullWidth onClick={next}>
          Ďalšia otázka ➡️
        </Button>
      </div>
    </Shell>
  );
}
