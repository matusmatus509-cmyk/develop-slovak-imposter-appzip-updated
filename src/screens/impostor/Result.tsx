import { useEffect } from "react";
import type { GameSettings, RoundAssignment } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";
import { cn } from "../../utils/designTokens";
import { useSound } from "../../hooks/useSound";

export default function Result({
  settings,
  assignment,
  votedIndex,
  onNewRound,
  onHome,
  onHistory,
}: {
  settings: GameSettings;
  assignment: RoundAssignment;
  votedIndex: number | null;
  onNewRound: () => void;
  onHome: () => void;
  onHistory: () => void;
}) {
  const { play } = useSound();
  const impostorNames = assignment.impostorIndexes.map(
    (i) => settings.playerNames[i]
  );
  const caughtImpostor =
    votedIndex !== null && assignment.impostorIndexes.includes(votedIndex);
  const playersWon = votedIndex !== null && caughtImpostor;

  useEffect(() => {
    const t = setTimeout(() => play(playersWon ? "win" : "lose"), 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Shell>
      <TopBar title="Výsledok kola" onBack={onHome} />

      {/* Confetti for playersWon */}
      {playersWon && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                background: ["#f97316", "#ec4899", "#a855f7", "#22c55e", "#fbbf24"][i % 5],
                animationDuration: `${2 + Math.random() * 2}s`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div
          className={cn(
            "flex h-24 w-24 items-center justify-center rounded-full text-5xl",
            playersWon ? "bg-emerald-500/20" : "bg-red-500/20"
          )}
          style={{
            animation: playersWon ? "tada 0.8s ease-in-out" : "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {playersWon ? "🏆" : "😈"}
        </div>

        <div style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}>
          <h1
            className={cn(
              "text-3xl font-black",
              playersWon ? "text-emerald-300" : "text-red-400"
            )}
          >
            {votedIndex === null
              ? "Hlasovanie preskočené"
              : playersWon
              ? "Hráči vyhrali!"
              : "Podvodník vyhral!"}
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {votedIndex === null
              ? "Tu je odhalenie tohto kola:"
              : playersWon
              ? "Skupina úspešne odhalila podvodníka."
              : "Skupina hlasovala nesprávne."}
          </p>
        </div>

        <div
          className="w-full space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 glass"
          style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">
              Tajné slovo
            </p>
            <p className="mt-1 text-2xl font-black uppercase text-gradient inline">{assignment.word}</p>
            <span className="mt-2 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
              {assignment.categoryIcon} {assignment.categoryName}
            </span>
          </div>
          <div className="h-px bg-white/10" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">
              {impostorNames.length > 1 ? "Podvodníci boli" : "Podvodník bol"}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {impostorNames.map((name, i) => (
                <span
                  key={name}
                  className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-4 py-2 text-sm font-bold text-red-300 border border-red-500/30"
                  style={{ animation: `popIn 0.4s ease-out ${0.5 + i * 0.1}s both` }}
                >
                  🥸 {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3" style={{ animation: "fadeIn 0.5s ease-out 0.5s both" }}>
        <Button fullWidth onClick={onNewRound}>
          Ďalšie kolo 🔁
        </Button>
        <div className="flex gap-3">
          <Button fullWidth variant="secondary" onClick={onHistory}>
            📊 Štatistiky
          </Button>
          <Button fullWidth variant="ghost" onClick={onHome}>
            Domov
          </Button>
        </div>
      </div>
    </Shell>
  );
}
