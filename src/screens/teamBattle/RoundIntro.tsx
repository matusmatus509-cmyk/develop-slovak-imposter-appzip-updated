import type { BattleRound } from "../../data/teamBattle";
import { GAME_LABELS, GAME_ICONS, TEAM_COLORS } from "../../data/teamBattle";

const GAME_DESC: Record<string, string> = {
  pantomima: "Jeden hráč predvádza pohybom — bez slov. Tím hádá čo najviac za čas.",
  sarady: "Jeden hráč opisuje slovami — bez zakázaných výrazov. Tím hádá čo najviac.",
  quiz: "Kvízový buzzer! Prvý tím, ktorý stlačí tlačidlo, odpovedá.",
  pingpong: "Tímy sa striedajú a hovoria slová z kategórie. Kto nevie, prehráva.",
  hadajktosom: "Hráč drží telefón na čele. Tím mu pomáha iba áno/nie odpoveďami.",
};

const SPECIAL_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  double: { label: "Dvojité body!", emoji: "⭐", color: "#f59e0b" },
  lightning: { label: "Bleskové kolo!", emoji: "⚡", color: "#06b6d4" },
  final: { label: "Finálové kolo!", emoji: "👑", color: "#a855f7" },
};

export default function RoundIntro({
  round,
  totalRounds,
  scores,
  teamNames,
  onStart,
}: {
  round: BattleRound;
  totalRounds: number;
  scores: [number, number];
  teamNames: [string, string];
  onStart: () => void;
}) {
  const [a, b] = TEAM_COLORS;
  const special = SPECIAL_LABELS[round.special];

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-y-auto bg-[#0b0a1a]"
      style={{ background: "linear-gradient(160deg, #0b0a1a 0%, #1a0a2e 100%)" }}
    >
      <div className="mx-auto flex w-full max-w-md flex-col gap-5 px-5 pb-8 pt-8">

        {/* Round badge */}
        <div className="text-center">
          <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-300">
            Kolo {round.index + 1} z {totalRounds}
          </span>
        </div>

        {/* Special badge */}
        {special && (
          <div
            className="rounded-2xl border px-4 py-3 text-center font-black text-lg"
            style={{ borderColor: special.color + "55", background: special.color + "15", color: special.color }}
          >
            {special.emoji} {special.label}{" "}
            {round.pointMultiplier > 1 && (
              <span className="text-sm opacity-80">({round.pointMultiplier}× body)</span>
            )}
          </div>
        )}

        {/* Game type card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="text-6xl mb-3">{GAME_ICONS[round.game]}</div>
          <h2 className="text-2xl font-black text-white mb-2">{GAME_LABELS[round.game]}</h2>
          <p className="text-sm text-white/50 leading-relaxed">{GAME_DESC[round.game]}</p>
          {round.special === "lightning" && (
            <div className="mt-3 text-cyan-400 text-sm font-bold">⚡ Čas: {round.timeSeconds} sekúnd</div>
          )}
        </div>

        {/* Current scores */}
        <div className="flex gap-3">
          {([0, 1] as const).map((idx) => (
            <div
              key={idx}
              className="flex-1 rounded-2xl p-4 text-center"
              style={{ background: `${idx === 0 ? a : b}18`, border: `1px solid ${idx === 0 ? a : b}40` }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: idx === 0 ? a : b }}>
                {teamNames[idx]}
              </p>
              <p className="text-3xl font-black text-white">{scores[idx]}</p>
              <p className="text-[10px] text-white/30">bodov</p>
            </div>
          ))}
        </div>

        {/* Start */}
        <button
          onClick={onStart}
          className="w-full rounded-2xl py-5 text-lg font-black uppercase tracking-wide text-white"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
        >
          {GAME_ICONS[round.game]} Štart!
        </button>
      </div>
    </div>
  );
}
