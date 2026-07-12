import type { BattleRound } from "../../data/teamBattle";
import { GAME_LABELS, GAME_ICONS, TEAM_COLORS } from "../../data/teamBattle";

export default function RoundResult({
  round,
  totalRounds,
  roundScores,
  totalScores,
  teamNames,
  onNext,
}: {
  round: BattleRound;
  totalRounds: number;
  roundScores: [number, number];
  totalScores: [number, number];
  teamNames: [string, string];
  onNext: () => void;
}) {
  const [a, b] = TEAM_COLORS;
  const isLastRound = round.index === totalRounds - 1;

  // Earned points this round (already multiplied)
  const earned: [number, number] = [
    roundScores[0] * round.pointMultiplier,
    roundScores[1] * round.pointMultiplier,
  ];

  const roundWinner =
    earned[0] > earned[1] ? 0 : earned[1] > earned[0] ? 1 : null;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-y-auto"
      style={{ background: "linear-gradient(160deg, #0b0a1a 0%, #1a0a2e 100%)" }}
    >
      <div className="mx-auto flex w-full max-w-md flex-col gap-5 px-5 pb-8 pt-8">

        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1">
            {GAME_ICONS[round.game]} {GAME_LABELS[round.game]} — Výsledok kola
          </p>
          <h2 className="text-2xl font-black text-white">
            {roundWinner !== null
              ? `${teamNames[roundWinner]} vyhráva kolo!`
              : "Remíza!"}
          </h2>
          {round.pointMultiplier > 1 && (
            <p className="text-sm text-yellow-400 mt-1 font-bold">
              × {round.pointMultiplier} body ({round.special === "final" ? "finálové" : "dvojité"} kolo)
            </p>
          )}
        </div>

        {/* Round scores */}
        <div className="flex gap-3">
          {([0, 1] as const).map((idx) => (
            <div
              key={idx}
              className="flex-1 rounded-3xl p-5 text-center"
              style={{
                background: `${idx === 0 ? a : b}${roundWinner === idx ? "25" : "12"}`,
                border: `2px solid ${idx === 0 ? a : b}${roundWinner === idx ? "" : "40"}`,
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: idx === 0 ? a : b }}>
                {teamNames[idx]}
              </p>
              <p className="text-4xl font-black text-white">{earned[idx]}</p>
              {round.pointMultiplier > 1 && (
                <p className="text-xs text-white/30 mt-1">({roundScores[idx]} × {round.pointMultiplier})</p>
              )}
              {roundWinner === idx && <p className="text-yellow-400 text-xl mt-2">🏆</p>}
            </div>
          ))}
        </div>

        {/* Total scores */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4 text-center">
            Celkové skóre
          </p>
          <div className="flex items-end gap-2">
            {([0, 1] as const).map((idx) => {
              const maxScore = Math.max(...totalScores, 1);
              const barH = Math.round((totalScores[idx] / maxScore) * 80);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <p className="text-2xl font-black text-white">{totalScores[idx]}</p>
                  <div
                    className="w-full rounded-t-xl transition-all"
                    style={{
                      height: `${Math.max(barH, 8)}px`,
                      background: idx === 0 ? a : b,
                      opacity: totalScores[idx] === 0 ? 0.3 : 1,
                    }}
                  />
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: idx === 0 ? a : b }}>
                    {teamNames[idx]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full rounded-2xl py-5 text-base font-black text-white"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
        >
          {isLastRound ? "🏆 Konečné výsledky" : `➡️ Kolo ${round.index + 2} z ${totalRounds}`}
        </button>
      </div>
    </div>
  );
}
