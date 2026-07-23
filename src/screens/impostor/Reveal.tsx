import { useState } from "react";
import type { GameSettings, RoundAssignment } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";

export default function Reveal({
  settings,
  assignment,
  onExit,
  onDone,
  mode = "impostor",
}: {
  settings: GameSettings;
  assignment: RoundAssignment;
  onExit: () => void;
  onDone: () => void;
  mode?: "impostor" | "drawing";
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
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest animate-slide-down",
              isImpostor
                ? "bg-red-500/20 text-red-300"
                : "bg-emerald-500/20 text-emerald-300"
            )}
            style={{ animation: "fadeIn 0.3s ease-out" }}
          >
            {settings.playerNames[viewing]}
          </span>

          <div
            className={cn(
              "relative flex w-full flex-col items-center gap-5 overflow-hidden rounded-3xl border p-8 text-center",
              isImpostor
                ? "border-red-500/30 bg-red-950/40"
                : "border-emerald-500/30 bg-emerald-950/30"
            )}
            style={{ animation: "popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
          >
            {/* Glow background */}
            <div
              className="pointer-events-none absolute -top-12 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl"
              style={{ background: isImpostor ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.25)" }}
            />

            <div
              className={cn(
                "relative flex h-24 w-24 items-center justify-center rounded-full text-5xl",
                isImpostor ? "bg-red-500/25" : "bg-emerald-500/25"
              )}
              style={{ animation: "ring 1.5s ease-in-out infinite" }}
            >
              {isImpostor ? "🥸" : "🙂"}
            </div>

            {isImpostor ? (
              <>
                <h2
                  className="relative text-3xl font-black tracking-tight text-red-400"
                  style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}
                >
                  PODVODNÍK
                </h2>
                {settings.hintsEnabled ? (
                  <div className="relative w-full" style={{ animation: "slideUp 0.5s ease-out 0.2s both" }}>
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
                  <div className="relative text-center" style={{ animation: "slideUp 0.5s ease-out 0.2s both" }}>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
                      {assignment.categoryIcon} {assignment.categoryName}
                    </span>
                    <p className="mt-3 text-xs leading-relaxed text-white/50">
                      {mode === "drawing"
                        ? "Nepoznáš tajné slovo. Sleduj kresbu ostatných a pridaj nenápadný ťah, aby ťa neodhalili."
                        : "Nepoznáš tajné slovo. Počúvaj ostatných a snaž sa zapadnúť, aby ťa neodhalili."}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2
                  className="relative text-3xl font-black tracking-tight text-emerald-300"
                  style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}
                >
                  HRÁČ
                </h2>
                <p
                  className="relative text-xs font-bold uppercase tracking-widest text-white/40"
                  style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}
                >
                  Tajné slovo
                </p>
                <div
                  className="relative w-full rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-4"
                  style={{ animation: "slideUp 0.5s ease-out 0.2s both" }}
                >
                  <p className="text-3xl font-black uppercase text-white">
                    {assignment.word}
                  </p>
                </div>
                <span className="relative rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
                  {assignment.categoryIcon} {assignment.categoryName}
                </span>
                <p className="relative text-xs leading-relaxed text-white/50">
                  {mode === "drawing"
                    ? "Zapamätaj si slovo. Pri svojom ťahu nakresli iba jednu súvislú čiaru a mobil odovzdaj ďalej."
                    : "Povedz asociáciu súvisiacu so slovom, ale nie príliš zjavnú — pomôž odhaliť podvodníka."}
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

      <div className="mb-6 text-center" style={{ animation: "fadeIn 0.5s ease-out" }}>
        <div
          className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/8 text-white/70"
          style={{ animation: "ring 2s ease-in-out infinite" }}
        >
          <Icons.touchApp size={24} />
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
                className={cn(
                  "relative flex flex-col items-center justify-center gap-3 rounded-3xl border p-6 text-center transition-all active:scale-95",
                  done
                    ? "border-emerald-500/40 bg-emerald-950/30 opacity-60"
                    : "border-white/15 bg-white/5 hover:bg-white/10 hover:scale-[1.02]",
                )}
                style={{ animation: `scaleIn 0.4s ease-out ${i * 40}ms both` }}
              >
                {/* status badge */}
                <span
                  className={cn(
                    "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-xs",
                    done
                      ? "bg-emerald-500/30 text-emerald-300"
                      : "bg-white/10 text-white/40"
                  )}
                >
                  {done ? "✓" : <Icons.helpCircle size={16} />}
                </span>

                {/* avatar */}
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full text-lg font-black transition-all",
                    done
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-gradient-to-br from-orange-500 to-fuchsia-600 text-white"
                  )}
                >
                  {name.slice(0, 2).toUpperCase()}
                </div>

                <p className={cn("text-sm font-bold", done ? "text-emerald-300" : "text-white")}>
                  {name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {allSeen && starter !== null && (
        <div
          className="mt-4 flex flex-col gap-3"
          style={{ animation: "slideUp 0.5s ease-out" }}
        >
          <div className="flex flex-col items-center gap-2 rounded-3xl border border-amber-500/30 bg-amber-950/30 px-6 py-5 text-center">
            <Icons.dice1 size={32} className="text-amber-400" />
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400/70">
              {mode === "drawing" ? "Losovanie — kto kreslí prvý" : "Losovanie — kto začína"}
            </p>
            <p className="text-2xl font-black text-amber-300">
              {settings.playerNames[starter]}
            </p>
          </div>
          <Button fullWidth onClick={onDone}>
            {mode === "drawing" ? "Začať kreslenie 🎨" : "Začať diskusiu 💬"}
          </Button>
        </div>
      )}
    </Shell>
  );
}
