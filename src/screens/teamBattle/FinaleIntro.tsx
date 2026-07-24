import { TEAM_COLORS } from "../../data/teamBattle";
import { PartyBackdrop, PartyEyebrow, PartyScoreboard } from "./PartyChrome";

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

  return (
    <PartyBackdrop>
      <main className="h-full overflow-y-auto px-5 pb-8 pt-10 text-center">
        <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center">
          <PartyEyebrow>Veľké finále</PartyEyebrow>

          <section className="party-finale-reveal mt-8 w-full">
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-fuchsia-300/30 bg-fuchsia-500/10 shadow-[0_0_80px_rgba(217,70,239,.3)]">
              <div className="absolute inset-2 rounded-full border border-dashed border-white/20 animate-spin [animation-duration:10s]" />
              <span className="text-6xl">♛</span>
            </div>
            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-fuchsia-300/70">Posledná šanca zmeniť výsledok</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-white">Finále za 3× body</h1>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/45">
              {leader === null
                ? "Do finále vstupujete s remízou. Rozhodne posledná hra."
                : `${teamNames[leader]} vedie o ${difference} ${difference === 1 ? "bod" : "bodov"}, ale ešte nič nie je rozhodnuté.`}
            </p>
          </section>

          <div className="mt-8 w-full">
            <PartyScoreboard
              teamNames={teamNames}
              scores={scores}
              colors={[blue, red]}
              eyebrow="Skóre pred finále"
              detail="Víťaz finále môže otočiť celú hru"
              highlightLeader
            />
          </div>

          <div className="mt-auto w-full pt-8">
            <button
              type="button"
              onClick={onContinue}
              className="party-shine relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-6 py-5 text-base font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_50px_rgba(168,85,247,.38)] transition active:scale-[.97]"
            >
              Vstúpiť do finále
            </button>
          </div>
        </div>
      </main>
    </PartyBackdrop>
  );
}
