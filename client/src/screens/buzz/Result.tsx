import { useEffect } from "react";
import type { BuzzAssignment, BuzzSettings } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";
import { useFeedback } from "../../feedback/FeedbackProvider";
import {
  evaluateBuzzVotes,
  formatBuzzRange,
  formatBuzzTime,
} from "../../utils/buzzLogic";

/**
 * Odhalenie kola. Až tu sa smie ukázať tajné zadanie — počas hry ani po
 * vlastnom pokuse hráč nikdy nevidel, ako blízko bol.
 */
export default function Result({
  settings,
  assignment,
  times,
  votes,
  onNewRound,
  onHome,
}: {
  settings: BuzzSettings;
  assignment: BuzzAssignment;
  times: number[];
  votes: (number | null)[];
  onNewRound: () => void;
  onHome: () => void;
}) {
  const { playFeedback } = useFeedback();
  const outcome = evaluateBuzzVotes(
    votes,
    assignment.impostorIndex,
    settings.playerNames.length
  );
  const playersWon = outcome.playersWon;
  const impostorName = settings.playerNames[assignment.impostorIndex];

  useEffect(() => {
    playFeedback(playersWon ? "win" : "loss");
  }, [playersWon, playFeedback]);

  return (
    <Shell>
      <TopBar title="Odhalenie" onBack={onHome} />

      {playersWon && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                background: ["#fb7185", "#f59e0b", "#a855f7", "#22c55e", "#fbbf24"][i % 5],
                animationDuration: `${2 + Math.random() * 2}s`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full",
              playersWon ? "bg-emerald-500/20" : "bg-red-500/20"
            )}
            style={{
              animation: playersWon
                ? "tada 0.8s ease-in-out"
                : "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {playersWon ? <Icons.trophy size={34} /> : <Icons.mask size={34} />}
          </div>

          <div style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}>
            <h1
              className={cn(
                "text-3xl font-black",
                playersWon ? "text-emerald-300" : "text-red-400"
              )}
            >
              {playersWon ? "Hráči vyhrali!" : "Podvodník vyhral!"}
            </h1>
            <p className="mt-2 text-sm text-white/50">
              {playersWon
                ? "Podvodník dostal najviac hlasov a partia ho odhalila."
                : outcome.totalVotes === 0
                  ? "Nikto nehlasoval, takže podvodník prešiel bez odhalenia."
                  : outcome.leaders.includes(assignment.impostorIndex)
                    ? "Na prvom mieste bola remíza — pri nej má navrch podvodník."
                    : "Najviac hlasov dostal nesprávny hráč."}
            </p>
          </div>

          {/* Odhalenie zadaní */}
          <div
            className="glass w-full space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5"
            style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                Podvodník bol
              </p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/20 px-4 py-2 text-sm font-bold text-red-300">
                <Icons.mask size={15} /> {impostorName}
              </span>
            </div>
            <div className="h-px bg-white/10" />
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

          {/* Časy a hlasy */}
          <div className="w-full space-y-2" style={{ animation: "slideUp 0.5s ease-out 0.4s both" }}>
            <p className="text-left text-xs font-bold uppercase tracking-widest text-white/40">
              Časy a hlasy
            </p>
            {settings.playerNames.map((name, i) => {
              const isImpostor = i === assignment.impostorIndex;
              const count = outcome.counts[i] ?? 0;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-3.5 py-2.5",
                    isImpostor
                      ? "border-red-500/35 bg-red-950/30"
                      : "border-white/10 bg-white/[.04]"
                  )}
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
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/[.06] px-2.5 py-1 text-[11px] font-bold text-white/60">
                    {count} {count === 1 ? "hlas" : count >= 2 && count <= 4 ? "hlasy" : "hlasov"}
                  </span>
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
