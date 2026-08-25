import type { CSSProperties } from "react";
import type { BuzzSettings } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { formatBuzzTime } from "../../utils/buzzLogic";

/**
 * Kto ako stopol.
 *
 * Časy sú v poradí hráčov a bez akéhokoľvek hodnotenia — žiadne poradie podľa
 * presnosti, žiadne farby, žiadne rozdiely. Z čísel sa nesmie dať vyčítať, kto
 * mal presné zadanie a kto iba rozsah.
 */
export default function Times({
  settings,
  times,
  onExit,
  onReveal,
}: {
  settings: BuzzSettings;
  times: number[];
  onExit: () => void;
  onReveal: () => void;
}) {
  return (
    <Shell>
      <TopBar title="Kto ako stopol" onBack={onExit} />

      <div className="mb-3 text-center" style={{ animation: "fadeIn 0.5s ease-out" }}>
        <h1 className="text-2xl font-black">Všetci vidia časy</h1>
        <p className="mt-1.5 text-[13px] leading-snug text-white/50">
          Nikto však nevie, komu patril presný čas a kto mal iba rozsah.
        </p>
      </div>

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

      <Button fullWidth onClick={onReveal} className="mt-3">
        <span className="inline-flex items-center gap-2">Odhaliť podvodníka <Icons.eye size={18} /></span>
      </Button>
    </Shell>
  );
}
