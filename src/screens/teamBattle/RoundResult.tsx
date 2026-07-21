import type { BattleRound } from "../../data/teamBattle";
import { GAME_ICONS, GAME_LABELS, TEAM_COLORS } from "../../data/teamBattle";
import { PartyBackdrop, PartyEyebrow } from "./PartyChrome";

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
  const [blue, red] = TEAM_COLORS;
  const colors = [blue, red];
  const isLastRound = round.index === totalRounds - 1;
  const earned: [number, number] = [
    roundScores[0] * round.pointMultiplier,
    roundScores[1] * round.pointMultiplier,
  ];
  const roundWinner = earned[0] > earned[1] ? 0 : earned[1] > earned[0] ? 1 : null;
  const scoreTotal = Math.max(totalScores[0] + totalScores[1], 1);
  const blueShare = (totalScores[0] / scoreTotal) * 100;

  return (
    <PartyBackdrop>
      <main className="h-full overflow-y-auto px-5 pb-8 pt-8 text-center">
        <div className="mx-auto flex w-full max-w-md flex-col gap-5">
          <header>
            <PartyEyebrow>Výsledok {round.index + 1}. kola</PartyEyebrow>
            <div className="mt-6 text-5xl">{roundWinner === null ? "🤝" : "🏆"}</div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
              {GAME_ICONS[round.game]} {GAME_LABELS[round.game]}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
              {roundWinner === null ? "Toto kolo je remíza" : `${teamNames[roundWinner]} berie kolo!`}
            </h1>
            {round.pointMultiplier > 1 && (
              <span className="mt-3 inline-flex rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-amber-300">
                Body sa násobia ×{round.pointMultiplier}
              </span>
            )}
          </header>

          <section className="grid grid-cols-2 gap-3">
            {([0, 1] as const).map((index) => (
              <div
                key={index}
                className="party-glass relative overflow-hidden rounded-[1.75rem] p-5"
                style={{
                  borderColor: `${colors[index]}${roundWinner === index ? "aa" : "3d"}`,
                  boxShadow: roundWinner === index ? `0 18px 50px ${colors[index]}25` : undefined,
                }}
              >
                {roundWinner === index && <div className="absolute inset-x-0 top-0 h-1" style={{ background: colors[index] }} />}
                <span
                  className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white"
                  style={{ background: colors[index] }}
                >
                  {index === 0 ? "A" : "B"}
                </span>
                <p className="mt-3 truncate text-xs font-black uppercase tracking-wider" style={{ color: colors[index] }}>
                  {teamNames[index]}
                </p>
                <p className="mt-2 text-4xl font-black tabular-nums text-white">+{earned[index]}</p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/30">bodov v kole</p>
              </div>
            ))}
          </section>

          <section className="party-glass rounded-[1.75rem] p-5 text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">Celkové skóre</p>
                <p className="mt-1 text-sm font-bold text-white/70">Bitka pokračuje</p>
              </div>
              <span className="rounded-xl bg-white/[0.06] px-3 py-2 text-xs font-black text-white/50">
                {round.index + 1}/{totalRounds}
              </span>
            </div>

            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="max-w-[8rem] truncate text-xs font-black" style={{ color: blue }}>{teamNames[0]}</p>
                <p className="text-3xl font-black tabular-nums text-white">{totalScores[0]}</p>
              </div>
              <span className="pb-2 text-[10px] font-black uppercase tracking-widest text-white/25">vs</span>
              <div className="text-right">
                <p className="max-w-[8rem] truncate text-xs font-black" style={{ color: red }}>{teamNames[1]}</p>
                <p className="text-3xl font-black tabular-nums text-white">{totalScores[1]}</p>
              </div>
            </div>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white/10 p-0.5">
              <div className="rounded-l-full transition-all duration-700" style={{ width: `${blueShare}%`, background: blue }} />
              <div className="flex-1 rounded-r-full transition-all duration-700" style={{ background: red }} />
            </div>
          </section>

          <button
            onClick={onNext}
            className="party-shine overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-6 py-5 text-base font-black uppercase tracking-[0.07em] text-white shadow-[0_18px_50px_rgba(168,85,247,.32)] transition active:scale-[.97]"
          >
            {isLastRound ? "Pozrieť víťaza" : `Pokračovať na ${round.index + 2}. kolo`}
          </button>
        </div>
      </main>
    </PartyBackdrop>
  );
}
