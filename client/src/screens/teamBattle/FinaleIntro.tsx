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
      <main className="flex h-full flex-col fit-or-scroll overflow-hidden px-5 pb-1 pt-4 text-center">
        <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col gap-3">
          <header className="shrink-0">
            <PartyEyebrow>Veľké finále</PartyEyebrow>
          </header>

          {/* `flex-1`: hero karta vyplní zvyšný priestor rovnako ako v
              RoundIntro/GameOver — bez toho zostáva pod skóre veľká prázdna
              plocha, keď je text krátky (presne tento prípad predtým). */}
          <section className="party-fit-hero party-glass party-finale-reveal relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-[2rem] px-6 py-5">
            <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/70 to-transparent" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-fuchsia-300/30 bg-fuchsia-500/10 shadow-[0_0_80px_rgba(217,70,239,.3)]">
              <div className="absolute inset-2 rounded-full border border-white/20" />
              <span className="text-fuchsia-200">
                <Icons.crown size={44} />
              </span>
            </div>
            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.3em] text-fuchsia-300/70">
              Posledná šanca zmeniť výsledok
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
              Finále za 3× body
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/45">
              {leader === null
                ? "Do finále vstupujete s remízou. Rozhodne posledná hra."
                : `${teamNames[leader]} vedie o ${difference} ${difference === 1 ? "bod" : "bodov"}, ale ešte nič nie je rozhodnuté.`}
            </p>
          </section>

          <PartyScoreboard
            teamNames={teamNames}
            scores={scores}
            colors={[blue, red]}
            eyebrow="Skóre pred finále"
            detail="Víťaz finále môže otočiť celú hru"
            highlightLeader
          />

          <div className="party-auto-dock">
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
