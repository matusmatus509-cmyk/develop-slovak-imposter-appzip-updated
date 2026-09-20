import type { ReactNode } from "react";
import { TEAM_COLORS } from "../../data/teamBattle";
import { PARTY_TEAM_IDENTITIES } from "./partyTeamIdentity";

/**
 * Trvalá orientačná vrstva nad každou Party Mode mini-hrou.
 *
 * Nezávisí od aktívneho ťahu, preto sa strany ani farby počas kola nemenia.
 * `pointer-events-none` zaručuje, že neblokuje herné ovládanie.
 */
export default function PartyTeamOrientation({
  teamNames,
  children,
}: {
  teamNames: [string, string];
  children: ReactNode;
}) {
  return (
    <div className="relative h-full w-full">
      {children}
      <aside
        className="pointer-events-none fixed inset-x-0 top-[max(.35rem,env(safe-area-inset-top))] z-[240] mx-auto flex w-[calc(100%-1rem)] max-w-md items-start justify-between gap-3 px-1"
        aria-label="Pevné strany tímov"
      >
        {PARTY_TEAM_IDENTITIES.map(identity => {
          const color = TEAM_COLORS[identity.index];
          return (
            <div
              key={identity.code}
              className={`min-w-0 max-w-[46%] rounded-xl border px-2.5 py-1.5 shadow-lg backdrop-blur-md ${identity.side === "right" ? "text-right" : "text-left"}`}
              style={{
                borderColor: `${color}88`,
                background: `linear-gradient(135deg, ${color}35, rgba(5,7,17,.92))`,
                boxShadow: `0 8px 24px ${color}22`,
              }}
            >
              <span className="block text-[7px] font-black uppercase tracking-[.16em] text-white/55">
                {identity.sideLabel} · TÍM {identity.code}
              </span>
              <strong className="block truncate text-[10px] font-black" style={{ color }}>
                {teamNames[identity.index]}
              </strong>
            </div>
          );
        })}
      </aside>
    </div>
  );
}
