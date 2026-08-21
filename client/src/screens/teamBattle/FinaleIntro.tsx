import { TEAM_COLORS } from "../../data/teamBattle";
import { Icons } from "../../components/icons";
import { useAutoAdvance } from "../../hooks/useAutoAdvance";
import {
  PartyAutoAdvance,
  PartyBackdrop,
  PartyEyebrow,
  PartyScoreboard,
} from "./PartyChrome";

export default function FinaleIntro({
  teamNames,
  scores,
  onContinue,
}: {
  teamNames: [string, string];
  scores: [number, number];
  onContinue: () => void;
}) {
  const [blue, red] = TEAM_COLORS;
  const difference = Math.abs(scores[0] - scores[1]);
  const leader = scores[0] === scores[1] ? null : scores[0] > scores[1] ? 0 : 1;
  const auto = useAutoAdvance(6, onContinue);

  return (
    <PartyBackdrop>
      <main className="flex h-full flex-col overflow-hidden px-5 pb-1 pt-5 text-center">
        <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col items-center">
          <PartyEyebrow>Veľké finále</PartyEyebrow>

          <section className="party-fit-hero party-finale-reveal mt-4 w-full shrink-0">
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-fuchsia-300/30 bg-fuchsia-500/10 shadow-[0_0_80px_rgba(217,70,239,.3)]">
              <div className="absolute inset-2 rounded-full border border-white/20" />
              <span className="text-fuchsia-200">
                <Icons.crown size={52} />
              </span>
            </div>
            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-fuchsia-300/70">
              Posledná šanca zmeniť výsledok
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-white">
              Finále za 3× body
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/45">
              {leader === null
                ? "Do finále vstupujete s remízou. Rozhodne posledná hra."
                : `${teamNames[leader]} vedie o ${difference} ${difference === 1 ? "bod" : "bodov"}, ale ešte nič nie je rozhodnuté.`}
            </p>
          </section>

          <div className="mt-4 w-full shrink-0">
            <PartyScoreboard
              teamNames={teamNames}
              scores={scores}
              colors={[blue, red]}
              eyebrow="Skóre pred finále"
              detail="Víťaz finále môže otočiť celú hru"
              highlightLeader
            />
          </div>

          <div className="party-auto-dock mt-auto w-full">
            <PartyAutoAdvance
              secondsLeft={auto.secondsLeft}
              percentLeft={auto.percentLeft}
              onSkip={auto.skip}
              label="Finále začína"
              skipLabel="Vstúpiť do finále ihneď"
            />
          </div>
        </div>
      </main>
    </PartyBackdrop>
  );
}
