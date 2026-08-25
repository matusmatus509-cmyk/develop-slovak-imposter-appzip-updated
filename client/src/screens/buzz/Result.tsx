import type { CSSProperties } from "react";
import type { BuzzAssignment, BuzzSettings } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";
import { formatBuzzRange, formatBuzzTime } from "../../utils/buzzLogic";

/**
 * Odhalenie kola. Až tu sa smie ukázať tajné zadanie — počas hry ani po
 * vlastnom pokuse hráč nikdy nevidel, ako blízko bol.
 */
export default function Result({
  settings,
  assignment,
  times,
  onNewRound,
  onHome,
}: {
  settings: BuzzSettings;
  assignment: BuzzAssignment;
  times: number[];
  onNewRound: () => void;
  onHome: () => void;
}) {
  const impostorName = settings.playerNames[assignment.impostorIndex];

  return (
    <Shell>
      <TopBar title="Odhalenie" onBack={onHome} />

      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 text-red-300"
            style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            <Icons.mask size={34} />
          </div>

          <div style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">
              Podvodník bol
            </p>
            <h1 className="mt-2 text-3xl font-black text-red-400">{impostorName}</h1>
          </div>

          {/* Odhalenie zadaní */}
          <div
            className="glass w-full rounded-3xl border border-white/10 bg-white/5 p-5"
            style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
                <p className="text-[10px] font-black uppercase tracking-[.16em] text-white/40">
                  Tajný čas
                </p>
                <p className="mt-1 text-lg font-black tabular-nums text-emerald-200">
                  {formatBuzzTime(assignment.targetSeconds)}
                </p>
              </div>
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-3 py-2.5">
                <p className="text-[10px] font-black uppercase tracking-[.16em] text-white/40">
                  Rozsah podvodníka
                </p>
                <p className="mt-1 text-lg font-black tabular-nums text-red-200">
                  {formatBuzzRange(assignment.rangeMinSeconds, assignment.rangeMaxSeconds)}
                </p>
              </div>
            </div>
          </div>

          {/* Časy kola */}
          <div className="w-full space-y-2" style={{ animation: "slideUp 0.5s ease-out 0.4s both" }}>
            <p className="text-left text-xs font-bold uppercase tracking-widest text-white/40">
              Časy kola
            </p>
            {settings.playerNames.map((name, i) => {
              const isImpostor = i === assignment.impostorIndex;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-3.5 py-2.5",
                    isImpostor
                      ? "border-red-500/35 bg-red-950/30"
                      : "border-white/10 bg-white/[.04]"
                  )}
                  style={{ animation: `slideUp 0.4s ease-out ${450 + i * 40}ms both` } as CSSProperties}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black",
                      isImpostor
                        ? "bg-red-500/25 text-red-200"
                        : "bg-white/10 text-white/70"
                    )}
                  >
                    {isImpostor ? <Icons.mask size={15} /> : i + 1}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-left text-sm font-bold">{name}</p>
                  <p className="shrink-0 text-sm font-black tabular-nums text-white">
                    {times[i] === undefined ? "—" : formatBuzzTime(times[i])}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2.5" style={{ animation: "fadeIn 0.5s ease-out 0.5s both" }}>
        <Button fullWidth onClick={onNewRound}>
          <span className="inline-flex items-center gap-2">Ďalšie kolo <Icons.refresh size={17} /></span>
        </Button>
        <Button fullWidth variant="secondary" onClick={onHome}>
          <span className="inline-flex items-center gap-2">Späť do menu <Icons.layoutDashboard size={17} /></span>
        </Button>
      </div>
    </Shell>
  );
}
