import { useState } from "react";
import type { BuzzSettings } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";

/**
 * Tajné hlasovanie. Mobil sa podáva, každý hlasuje sám a výsledok sa odhalí
 * až naraz na konci — nikto nevidí, ako hlasovali ostatní.
 */
export default function Voting({
  settings,
  onExit,
  onFinish,
}: {
  settings: BuzzSettings;
  onExit: () => void;
  onFinish: (votes: (number | null)[]) => void;
}) {
  const [voter, setVoter] = useState(0);
  const [handedOver, setHandedOver] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [votes, setVotes] = useState<(number | null)[]>([]);

  const isLastVoter = voter === settings.playerNames.length - 1;

  function submit(vote: number | null) {
    const nextVotes = [...votes, vote];
    if (isLastVoter) {
      onFinish(nextVotes);
      return;
    }
    setVotes(nextVotes);
    setSelected(null);
    setHandedOver(false);
    setVoter(current => current + 1);
  }

  // ── Podanie mobilu ───────────────────────────────────────────────
  if (!handedOver) {
    return (
      <Shell>
        <TopBar title="Hlasovanie" onBack={onExit} />

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-3xl border border-rose-400/25 bg-rose-500/10 text-rose-200"
            style={{ animation: "ring 2s ease-in-out infinite" }}
          >
            <Icons.touchApp size={34} />
          </div>
          <div style={{ animation: "fadeIn 0.4s ease-out" }}>
            <p className="text-[11px] font-black uppercase tracking-[.2em] text-white/40">
              Hlasuje {voter + 1} z {settings.playerNames.length}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">
              {settings.playerNames[voter]}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Vezmi si mobil tak, aby ti ostatní nevideli na obrazovku.
              Tvoj hlas nikto neuvidí.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {settings.playerNames.map((name, i) => (
              <span
                key={i}
                aria-hidden="true"
                title={name}
                className={cn(
                  "buzz-dot",
                  i === voter && "buzz-dot-active",
                  i < voter && "buzz-dot-done"
                )}
              />
            ))}
          </div>
        </div>

        <Button fullWidth onClick={() => setHandedOver(true)} className="mt-4">
          <span className="inline-flex items-center gap-2">Som to ja <Icons.chevronRight size={18} /></span>
        </Button>
      </Shell>
    );
  }

  // ── Vlastné hlasovanie ───────────────────────────────────────────
  return (
    <Shell>
      <TopBar title="Hlasovanie" onBack={onExit} />

      <div className="mb-4 text-center" style={{ animation: "fadeIn 0.4s ease-out" }}>
        <p className="text-[11px] font-black uppercase tracking-[.2em] text-white/40">
          Hlasuje {settings.playerNames[voter]}
        </p>
        <h1 className="mt-1 text-2xl font-black">Kto je podvodník?</h1>
        <p className="mt-2 text-sm text-white/50">
          Vyber hráča, ktorý podľa teba nepoznal presný čas.
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-2.5 overflow-y-auto pb-2">
        {settings.playerNames.map((name, i) =>
          i === voter ? null : (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                "relative flex flex-col items-center gap-2.5 overflow-hidden rounded-2xl border p-4 transition-all active:scale-95",
                selected === i
                  ? "border-rose-400/70 bg-gradient-to-br from-rose-500/20 to-amber-500/20 shadow-lg shadow-rose-900/30"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              )}
              style={{ animation: `scaleIn 0.35s ease-out ${i * 40}ms both` }}
            >
              {selected === i && (
                <span
                  className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/40 text-white"
                  style={{ animation: "popIn 0.3s ease-out" }}
                >
                  <Icons.circleCheck size={15} />
                </span>
              )}
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full text-base font-black transition-transform",
                  selected === i
                    ? "scale-110 bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg"
                    : "bg-gradient-to-br from-rose-500/30 to-amber-500/30 text-white/80"
                )}
              >
                {name.slice(0, 2).toUpperCase()}
              </span>
              <span className="w-full truncate text-center text-sm font-bold">{name}</span>
            </button>
          )
        )}
      </div>

      <div className="mt-3 flex flex-col gap-2.5">
        <Button fullWidth disabled={selected === null} onClick={() => submit(selected)}>
          <span className="inline-flex items-center gap-2">
            {isLastVoter ? "Odhaliť hlasovanie" : "Potvrdiť a podať ďalej"}
            {isLastVoter ? <Icons.eye size={18} /> : <Icons.chevronRight size={18} />}
          </span>
        </Button>
        <Button fullWidth variant="ghost" onClick={() => submit(null)}>
          Zdržať sa hlasovania
        </Button>
      </div>
    </Shell>
  );
}
