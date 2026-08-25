import type { CSSProperties } from "react";
import { useState } from "react";
import type { BuzzSettings } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";
import { formatBuzzTime } from "../../utils/buzzLogic";
import { formatTime } from "../../utils/format";
import { useCountdown } from "../../hooks/useCountdown";

/**
 * Verejné výsledky kola.
 *
 * Časy sú v poradí hráčov a bez akéhokoľvek hodnotenia — žiadne poradie podľa
 * presnosti, žiadne farby, žiadne rozdiely. Z čísel sa nesmie dať vyčítať, kto
 * mal presné zadanie a kto iba rozsah.
 */
export default function Times({
  settings,
  times,
  onExit,
  onVote,
}: {
  settings: BuzzSettings;
  times: number[];
  onExit: () => void;
  onVote: () => void;
}) {
  const hasTimer = settings.discussionSeconds > 0;
  const [paused, setPaused] = useState(false);
  const countdown = useCountdown(settings.discussionSeconds, hasTimer && !paused);
  const remaining = countdown.secondsLeft;
  const timeUp = hasTimer && remaining <= 0;

  return (
    <Shell>
      <TopBar title="Výsledky kola" onBack={onExit} />

      {/* Hlavička je zámerne nízka, aby sa aj pri plnej partii zmestilo do
          zoznamu čo najviac časov bez skrolovania. */}
      <div className="mb-3 text-center" style={{ animation: "fadeIn 0.5s ease-out" }}>
        <h1 className="text-2xl font-black">Všetci vidia časy</h1>
        <p className="mt-1.5 text-[13px] leading-snug text-white/50">
          Nikto však nevie, komu patril presný čas a kto mal iba rozsah.
        </p>
      </div>

      {hasTimer && (
        <div
          className={cn(
            "mb-2.5 flex items-center justify-between gap-3 rounded-2xl border px-4 py-2",
            timeUp
              ? "border-red-500/35 bg-red-950/30"
              : "border-white/10 bg-white/[.04]"
          )}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl",
                timeUp ? "bg-red-500/15 text-red-300" : "bg-white/[.06] text-white/60"
              )}
            >
              <Icons.hourglass size={17} />
            </span>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/40">
                {timeUp ? "Čas na diskusiu vypršal" : "Čas na diskusiu"}
              </p>
              <p
                className={cn(
                  "text-lg font-black tabular-nums",
                  timeUp ? "text-red-300" : "text-white"
                )}
              >
                {formatTime(remaining)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setPaused(p => !p)}
            disabled={timeUp}
            aria-label={paused ? "Pokračovať" : "Pozastaviť"}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/[.06] text-white/70 transition-all hover:bg-white/12 active:scale-95 disabled:opacity-30"
          >
            {paused ? <Icons.play size={16} /> : <Icons.pause size={16} />}
          </button>
        </div>
      )}

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pb-2">
        {settings.playerNames.map((name, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-3.5 py-2.5"
            style={{ animation: `slideUp 0.4s ease-out ${i * 45}ms both` } as CSSProperties}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/40 to-amber-500/40 text-xs font-black">
              {i + 1}
            </span>
            <p className="min-w-0 flex-1 truncate text-left text-sm font-bold">{name}</p>
            <p className="shrink-0 text-lg font-black tabular-nums text-white">
              {times[i] === undefined ? "—" : formatBuzzTime(times[i])}
            </p>
          </div>
        ))}
      </div>

      <Button fullWidth onClick={onVote} className="mt-3">
        <span className="inline-flex items-center gap-2">Prejsť na hlasovanie <Icons.users size={18} /></span>
      </Button>
    </Shell>
  );
}
