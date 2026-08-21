import type { BattleRound } from "../../data/teamBattle";
import { Icons } from "../../components/icons";
import { GAME_ICONS, GAME_LABELS, TEAM_COLORS } from "../../data/teamBattle";
import { useAutoAdvance } from "../../hooks/useAutoAdvance";
import {
  PartyAutoAdvance,
  PartyBackdrop,
  PartyEyebrow,
  PartyScoreboard,
} from "./PartyChrome";

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
  const roundWinner =
    earned[0] > earned[1] ? 0 : earned[1] > earned[0] ? 1 : null;
  // Na výsledok kola je potrebná chvíľa navyše, potom sa pokračuje samo.
  const auto = useAutoAdvance(7, onNext);

  return (
    <PartyBackdrop>
      <main className="flex h-full flex-col overflow-hidden px-5 pb-1 pt-4 text-center">
        <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col gap-3">
          <header>
            <PartyEyebrow>Výsledok {round.index + 1}. kola</PartyEyebrow>
            <div className="party-fit-badge mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-400/10 text-amber-200">
              {roundWinner === null ? (
                <Icons.users size={31} />
              ) : (
                <Icons.trophy size={31} />
              )}
            </div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
              {GAME_ICONS[round.game]} {GAME_LABELS[round.game]}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
              {roundWinner === null
                ? "Toto kolo je remíza"
                : `${teamNames[roundWinner]} berie kolo!`}
            </h1>
            {round.pointMultiplier > 1 && (
              <span className="mt-3 inline-flex rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-amber-300">
                Body sa násobia ×{round.pointMultiplier}
              </span>
            )}
          </header>

          <section className="grid grid-cols-2 gap-3">
            {([0, 1] as const).map(index => (
              <div
                key={index}
                className="party-fit-tile party-glass relative overflow-hidden rounded-[1.75rem] p-5"
                style={{
                  borderColor: `${colors[index]}${roundWinner === index ? "aa" : "3d"}`,
                  boxShadow:
                    roundWinner === index
                      ? `0 18px 50px ${colors[index]}25`
                      : undefined,
                }}
              >
                {roundWinner === index && (
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: colors[index] }}
                  />
                )}
                <span
                  className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white"
                  style={{ background: colors[index] }}
                >
                  {index === 0 ? "A" : "B"}
                </span>
                <p
                  className="mt-3 truncate text-xs font-black uppercase tracking-wider"
                  style={{ color: colors[index] }}
                >
                  {teamNames[index]}
                </p>
                <p className="mt-2 text-4xl font-black tabular-nums text-white">
                  +{earned[index]}
                </p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/30">
                  bodov v kole
                </p>
              </div>
            ))}
          </section>

          <PartyScoreboard
            teamNames={teamNames}
            scores={totalScores}
            colors={[blue, red]}
            eyebrow={isLastRound ? "Konečné skóre" : "Celkové skóre"}
            detail={
              isLastRound
                ? "Finále je dohrané"
                : `Po ${round.index + 1}. z ${totalRounds} kôl`
            }
            highlightLeader
          />

          <div className="party-auto-dock">
            <PartyAutoAdvance
              secondsLeft={auto.secondsLeft}
              percentLeft={auto.percentLeft}
              onSkip={auto.skip}
              label={
                isLastRound
                  ? "Víťaz sa odhalí"
                  : `${round.index + 2}. kolo začína`
              }
              skipLabel={
                isLastRound ? "Pozrieť víťaza ihneď" : "Pokračovať ihneď"
              }
            />
          </div>
        </div>
      </main>
    </PartyBackdrop>
  );
}
