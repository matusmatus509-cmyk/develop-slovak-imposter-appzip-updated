import type { GameSettings, RoundAssignment } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";

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
  const impostorNames = assignment.impostorIndexes.map(
    (i) => settings.playerNames[i]
  );
  const caughtImpostor =
    votedIndex !== null && assignment.impostorIndexes.includes(votedIndex);
  const playersWon = votedIndex !== null && caughtImpostor;

  return (
    <Shell>
      <TopBar title="Výsledok kola" onBack={onHome} />

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-full text-4xl ${
            playersWon ? "bg-emerald-500/20" : "bg-red-500/20"
          }`}
        >
          {playersWon ? "🏆" : "😈"}
        </div>

        <div>
          <h1
            className={`text-3xl font-black ${
              playersWon ? "text-emerald-300" : "text-red-400"
            }`}
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

        <div className="w-full space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">
              Tajné slovo
            </p>
            <p className="text-2xl font-black uppercase">{assignment.word}</p>
            <span className="mt-1 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
              {assignment.categoryIcon} {assignment.categoryName}
            </span>
          </div>
          <div className="h-px bg-white/10" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">
              {impostorNames.length > 1 ? "Podvodníci boli" : "Podvodník bol"}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {impostorNames.map((name) => (
                <span
                  key={name}
                  className="rounded-full bg-red-500/20 px-3 py-1.5 text-sm font-bold text-red-300"
                >
                  🥸 {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
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
