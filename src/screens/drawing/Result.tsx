import type { GameSettings, RoundAssignment } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";
import { cn } from "../../utils/designTokens";

const CONFETTI_COLORS = [
  "#a855f7",
  "#ec4899",
  "#f97316",
  "#06b6d4",
  "#22c55e",
  "#eab308",
  "#3b82f6",
];

export default function DrawingResult({
  settings,
  assignment,
  votedIndex,
  onNewRound,
  onHome,
}: {
  settings: GameSettings;
  assignment: RoundAssignment;
  votedIndex: number | null;
  onNewRound: () => void;
  onHome: () => void;
}) {
  const impostorNames = assignment.impostorIndexes.map(
    (i) => settings.playerNames[i]
  );
  const playersWon =
    votedIndex !== null && assignment.impostorIndexes.includes(votedIndex);

  const confetti = Array.from({ length: 30 }, (_, i) => ({
    left: `${(i * 3.3) % 100}%`,
    delay: `${(i % 10) * 0.12}s`,
    duration: `${1.8 + (i % 5) * 0.4}s`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 8 + (i % 4) * 3,
  }));

  return (
    <Shell>
      <TopBar title="Výsledok" onBack={onHome} />

      {/* Confetti overlay when impostor caught */}
      {playersWon && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {confetti.map((c, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={{
                left: c.left,
                width: `${c.size}px`,
                height: `${c.size}px`,
                background: c.color,
                borderRadius: i % 2 === 0 ? "9999px" : "2px",
                animation: `confettiFall ${c.duration} linear ${c.delay} forwards`,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-full text-4xl",
            playersWon ? "bg-emerald-500/20" : "bg-red-500/20"
          )}
          style={{ animation: "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
        >
          <span style={playersWon ? { animation: "tada 0.8s ease-in-out 0.3s 2" } : undefined}>
            {playersWon ? "🏆" : "😈"}
          </span>
        </div>

        <div style={{ animation: "slideUp 0.5s ease-out 100ms both" }}>
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
              ? "Skupina správne odhalila podvodníka."
              : "Skupina hlasovala nesprávne."}
          </p>
        </div>

        <div
          className="glass w-full space-y-3 rounded-3xl p-6"
          style={{ animation: "scaleIn 0.5s ease-out 200ms both" }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">
              Tajné slovo
            </p>
            <p className="text-gradient text-2xl font-black uppercase">
              {assignment.word}
            </p>
            <span className="mt-2 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
              {assignment.categoryIcon} {assignment.categoryName}
            </span>
          </div>
          <div className="h-px bg-white/10" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">
              {impostorNames.length > 1 ? "Podvodníci boli" : "Podvodník bol"}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {impostorNames.map((name, i) => (
                <span
                  key={name}
                  className="rounded-full bg-red-500/20 px-3 py-1.5 text-sm font-bold text-red-300"
                  style={{
                    animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
                    animationDelay: `${300 + i * 80}ms`,
                  }}
                >
                  🥸 {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="mt-4 flex flex-col gap-3"
        style={{ animation: "slideUp 0.5s ease-out 350ms both" }}
      >
        <Button
          fullWidth
          onClick={onNewRound}
          className="transition-transform duration-200 hover:scale-[1.02] active:scale-95"
        >
          Ďalšie kolo 🔁
        </Button>
        <Button
          fullWidth
          variant="ghost"
          onClick={onHome}
          className="transition-transform duration-200 hover:scale-[1.02] active:scale-95"
        >
          Domov
        </Button>
      </div>
    </Shell>
  );
}
