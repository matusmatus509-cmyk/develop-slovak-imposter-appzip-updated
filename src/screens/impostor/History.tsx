import type { RoundHistoryEntry } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";
import { formatTime } from "../../utils/format";

export default function History({
  history,
  onBack,
  onClear,
}: {
  history: RoundHistoryEntry[];
  onBack: () => void;
  onClear: () => void;
}) {
  const totalTime = history.reduce((sum, h) => sum + h.timeSeconds, 0);
  const wins = history.filter((h) => h.playersWon).length;
  const successRate =
    history.length > 0 ? Math.round((wins / history.length) * 100) : 0;
  const sorted = [...history].sort((a, b) => b.roundNumber - a.roundNumber);

  return (
    <Shell>
      <TopBar title="Zhrnutie" onBack={onBack} />

      <div className="mb-6 text-center" style={{ animation: "fadeIn 0.5s ease-out" }}>
        <div
          className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/8 text-2xl"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          🕘
        </div>
        <h1 className="text-2xl font-black">Histéria odohraných kôl</h1>
      </div>

      {/* Stats grid */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div
          className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-center"
          style={{ animation: "scaleIn 0.4s ease-out both" }}
        >
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/20 text-lg">
            ⏱️
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-sky-300">
            Herný čas
          </p>
          <p className="mt-1 text-xl font-black">{formatTime(totalTime)}</p>
        </div>
        <div
          className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center"
          style={{ animation: "scaleIn 0.4s ease-out 0.1s both" }}
        >
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-lg">
            🏆
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-300">
            Úspešnosť
          </p>
          <p className="mt-1 text-xl font-black">{successRate}%</p>
        </div>
      </div>

      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">
        Predchádzajúce kolá
      </p>

      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {sorted.length === 0 && (
          <div
            className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/40"
            style={{ animation: "fadeIn 0.5s ease-out" }}
          >
            Zatiaľ ste neodohrali žiadne kolo. Spustite hru Podvodník a
            výsledky sa tu zobrazia!
          </div>
        )}
        {sorted.map((round, i) => (
          <div
            key={round.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
            style={{ animation: `slideUp 0.4s ease-out ${i * 40}ms both` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-xs font-bold">
                  #{round.roundNumber}
                </span>
                <div>
                  <p className="text-base font-black uppercase text-amber-400">
                    {round.word}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-white/40">
                    <span>
                      {round.categoryIcon} {round.categoryName}
                    </span>
                    <span>· ⏱ {formatTime(round.timeSeconds)}</span>
                  </p>
                </div>
              </div>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                  round.playersWon
                    ? "border-emerald-500/40 text-emerald-300"
                    : "border-red-500/40 text-red-300"
                }`}
              >
                🏆
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {round.impostors.map((name) => (
                <span
                  key={name}
                  className="flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-bold text-red-300"
                >
                  🥸 {name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {history.length > 0 && (
        <Button fullWidth variant="ghost" onClick={onClear} className="mt-2">
          Vymazať históriu
        </Button>
      )}
    </Shell>
  );
}
