import { useState } from "react";
import type { GameSettings, RoundAssignment } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";

export default function Reveal({
  settings,
  assignment,
  onExit,
  onDone,
}: {
  settings: GameSettings;
  assignment: RoundAssignment;
  onExit: () => void;
  onDone: () => void;
}) {
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const [viewing, setViewing] = useState<number | null>(null);
  const [starter, setStarter] = useState<number | null>(null);

  const allSeen = seen.size === settings.playerNames.length;

  function handleCardTap(index: number) {
    if (seen.has(index)) return;
    setViewing(index);
  }

  function handleDoneViewing() {
    if (viewing === null) return;
    const newSeen = new Set([...seen, viewing]);
    setSeen(newSeen);
    if (newSeen.size === settings.playerNames.length && starter === null) {
      setStarter(Math.floor(Math.random() * settings.playerNames.length));
    }
    setViewing(null);
  }

  // ── Identity reveal overlay ──────────────────────────────────────
  if (viewing !== null) {
    const isImpostor = assignment.impostorIndexes.includes(viewing);
    return (
      <Shell>
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
          <span
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${
              isImpostor
                ? "bg-red-500/20 text-red-300"
                : "bg-emerald-500/20 text-emerald-300"
            }`}
          >
            {settings.playerNames[viewing]}
          </span>

          <div
            className={`flex w-full flex-col items-center gap-5 rounded-3xl border p-8 text-center ${
              isImpostor
                ? "border-red-500/30 bg-red-950/30"
                : "border-emerald-500/30 bg-emerald-950/20"
            }`}
          >
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full text-4xl ${
                isImpostor ? "bg-red-500/20" : "bg-emerald-500/20"
              }`}
            >
              {isImpostor ? "🥸" : "🙂"}
            </div>

            {isImpostor ? (
              <>
                <h2 className="text-3xl font-black tracking-tight text-red-400">
                  PODVODNÍK
                </h2>
                {settings.hintsEnabled ? (
                  <div className="w-full">
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
                      Nápoveda
                    </p>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <p className="text-2xl font-black uppercase text-white">
                        {assignment.hintWord}
                      </p>
                    </div>
                    <span className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
                      {assignment.categoryIcon} {assignment.categoryName}
                    </span>
                    <p className="mt-3 text-xs leading-relaxed text-white/50">
                      Znáš nápovedu. Použi ju ako svoju prvú asociáciu v kole.
                    </p>
                  </div>
                ) : (
                  <>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
                      {assignment.categoryIcon} {assignment.categoryName}
                    </span>
                    <p className="text-xs leading-relaxed text-white/50">
                      Nepoznáš tajné slovo. Počúvaj ostatných a snaž sa
                      zapadnúť, aby ťa neodhalili.
                    </p>
                  </>
                )}
              </>
            ) : (
              <>
                <h2 className="text-3xl font-black tracking-tight text-emerald-300">
                  HRÁČ
                </h2>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                  Tajné slovo
                </p>
                <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-3xl font-black uppercase text-white">
                    {assignment.word}
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
                  {assignment.categoryIcon} {assignment.categoryName}
                </span>
                <p className="text-xs leading-relaxed text-white/50">
                  Povedz asociáciu súvisiacu so slovom, ale nie príliš zjavnú —
                  pomôž odhaliť podvodníka.
                </p>
              </>
            )}
          </div>

          <Button fullWidth onClick={handleDoneViewing}>
            Hotovo ✓
          </Button>
        </div>
      </Shell>
    );
  }

  // ── Player grid ──────────────────────────────────────────────────
  return (
    <Shell>
      <TopBar title="Identita" onBack={onExit} />

      <div className="mb-6 text-center">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl">
          👆
        </div>
        <h1 className="text-xl font-black">Ťukni na svoje meno</h1>
        <p className="mt-1 text-sm text-white/50">
          Každý si pozrie svoju identitu a odovzdá telefón ďalej.
        </p>
      </div>

      <div className="flex-1">
        <div className="grid grid-cols-2 gap-3">
          {settings.playerNames.map((name, i) => {
            const done = seen.has(i);
            return (
              <button
                key={i}
                onClick={() => handleCardTap(i)}
                disabled={done}
                className={`relative flex flex-col items-center justify-center gap-3 rounded-3xl border p-6 text-center transition-all active:scale-95 ${
                  done
                    ? "border-emerald-500/40 bg-emerald-950/30 opacity-70"
                    : "border-white/15 bg-white/5 hover:bg-white/10"
                }`}
              >
                {/* status badge */}
                <span
                  className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    done
                      ? "bg-emerald-500/30 text-emerald-300"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {done ? "✓" : "?"}
                </span>

                {/* avatar */}
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-black ${
                    done ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white"
                  }`}
                >
                  {name.slice(0, 2).toUpperCase()}
                </div>

                <p className={`text-sm font-bold ${done ? "text-emerald-300" : "text-white"}`}>
                  {name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {allSeen && starter !== null && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col items-center gap-2 rounded-3xl border border-amber-500/30 bg-amber-950/30 px-6 py-5 text-center">
            <span className="text-3xl">🎲</span>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400/70">
              Losovanie — kto začína
            </p>
            <p className="text-2xl font-black text-amber-300">
              {settings.playerNames[starter]}
            </p>
          </div>
          <Button fullWidth onClick={onDone}>
            Začať diskusiu 💬
          </Button>
        </div>
      )}
    </Shell>
  );
}
