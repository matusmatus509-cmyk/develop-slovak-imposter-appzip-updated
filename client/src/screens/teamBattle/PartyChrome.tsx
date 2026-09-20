import type { CSSProperties, ReactNode } from "react";
import { Icons } from "../../components/icons";
import { appBackground } from "../../media";
import {
  PARTY_TEAM_COLORS,
  PARTY_TEAM_IDENTITIES,
  partyTeamIdentity,
} from "./teamIdentity";

export function PartyBackdrop({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`party-backdrop fixed inset-0 isolate overflow-hidden bg-[#050711] ${className}`}
    >
      {/* Pozadie rovnaké ako na hlavnej stránke, ale s fialovým/kozmickým nádychom */}
      <img
        src={appBackground}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0520]/60 via-[#050711]/80 to-[#050711]/95" />
      <div className="party-orb party-orb-one" />
      <div className="party-orb party-orb-two" />
      <div className="party-orb party-orb-three" />
      <div className="party-beam party-beam-one" />
      <div className="party-beam party-beam-two" />
      <div className="party-grid absolute inset-0" />
      <div className="party-grain absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/[0.045] to-transparent" />
      <div className="party-stage-enter relative z-10 h-full">{children}</div>
    </div>
  );
}

export function PartyEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="party-eyebrow inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#101624]/75 px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.22em] text-white/58 backdrop-blur-xl">
      <span className="party-live-dot h-1.5 w-1.5 rounded-full bg-[var(--game-accent,#a78bfa)]" />
      {children}
    </span>
  );
}

/**
 * Medziobrazovky sa posúvajú samé — toto je jediný indikátor, ktorý o tom hovorí.
 * Celá pilulka je zároveň tlačidlo, takže netrpezlivá partia môže čakanie preskočiť.
 */
export function PartyAutoAdvance({
  secondsLeft,
  percentLeft,
  onSkip,
  label = "Pokračuje samo",
  skipLabel = "Preskočiť čakanie a pokračovať",
}: {
  secondsLeft: number;
  percentLeft: number;
  onSkip: () => void;
  label?: string;
  skipLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSkip}
      aria-label={skipLabel}
      className="party-auto mx-auto transition active:scale-95"
      style={{ "--pm-progress": percentLeft } as CSSProperties}
    >
      <span className="party-auto-label">{label}</span>
      <span className="party-auto-ring" aria-hidden="true">
        <span>{secondsLeft}</span>
      </span>
    </button>
  );
}

export function TeamBadge({
  name,
  score,
  teamIndex,
  color,
  active = false,
  showSide = true,
}: {
  name: string;
  score: number;
  teamIndex: 0 | 1;
  /** Farba sa dá prebiť len výnimočne — inak platí tímová. */
  color?: string;
  active?: boolean;
  showSide?: boolean;
}) {
  const team = partyTeamIdentity(teamIndex);
  const tone = color ?? team.color;
  return (
    <div
      className={`party-team-badge relative min-w-0 flex-1 overflow-hidden rounded-2xl border px-4 py-3 ${active ? "is-active" : ""}`}
      style={{
        borderColor: `${tone}${active ? "bb" : "45"}`,
        background: `linear-gradient(145deg, ${tone}${active ? "32" : "18"}, rgba(255,255,255,.035))`,
        boxShadow: active
          ? `0 16px 42px -22px ${tone}, inset 0 1px 0 rgba(255,255,255,.1)`
          : "inset 0 1px 0 rgba(255,255,255,.05)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
          style={{ background: tone, boxShadow: `0 0 20px ${tone}55` }}
        >
          {team.letter}
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-[9px] font-black uppercase tracking-[0.14em] text-white/45">
            {name}
          </span>
          <span className="block text-2xl font-black tabular-nums text-white">
            {score}
          </span>
        </span>
      </div>
      {showSide && (
        <span className="mt-1.5 block text-[8px] font-black uppercase tracking-[0.16em] text-white/35">
          {team.sideArrow} {team.sideLabel}
        </span>
      )}
    </div>
  );
}

/**
 * Pevný štítok tímu pri hrane obrazovky.
 *
 * Toto je odpoveď na „neviem, na ktorej strane je ktorý tím": štítok drží
 * písmeno, farbu aj meno tímu a je vždy na tej hrane, pri ktorej tím sedí.
 * Nezávisí od skóre ani od toho, kto je na rade — mení sa len zvýraznenie.
 */
export function TeamSideTag({
  teamIndex,
  name,
  score,
  active = false,
  className = "",
}: {
  teamIndex: 0 | 1;
  name: string;
  score?: number;
  active?: boolean;
  className?: string;
}) {
  const team = partyTeamIdentity(teamIndex);
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2 py-1 ${className}`}
      style={{
        borderColor: `${team.color}${active ? "cc" : "4d"}`,
        background: `${team.color}${active ? "2e" : "16"}`,
        boxShadow: active ? `0 0 18px ${team.color}44` : undefined,
      }}
      aria-label={`Tím ${team.letter} — ${name}, ${team.sideLabel.toLocaleLowerCase("sk")}`}
    >
      <span
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md text-[9px] font-black leading-none text-white"
        style={{ background: team.color }}
      >
        {team.letter}
      </span>
      <span className="min-w-0 truncate text-[9px] font-black uppercase tracking-[0.12em] text-white/75">
        {name}
      </span>
      {score !== undefined && (
        <span className="shrink-0 text-[11px] font-black tabular-nums text-white">
          {score}
        </span>
      )}
    </span>
  );
}

/**
 * Legenda strán — kto sedí kde. Poradie je vždy A (hore), potom B (dole),
 * takže sa dá čítať ako mapa stola bez ohľadu na stav hry.
 */
export function TeamSideLegend({
  teamNames,
  scores,
  activeIndex,
  eyebrow = "Strany tímov — platia celú hru",
}: {
  teamNames: [string, string];
  scores?: [number, number];
  activeIndex?: number;
  eyebrow?: string;
}) {
  return (
    <section
      className="party-glass overflow-hidden rounded-[1.5rem] px-4 py-3 text-left"
      aria-label={eyebrow}
    >
      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/35">
        {eyebrow}
      </p>
      <div className="mt-2.5 flex flex-col gap-2">
        {PARTY_TEAM_IDENTITIES.map(team => {
          const active = activeIndex === team.index;
          return (
            <div
              key={team.letter}
              className="flex items-center gap-2.5 rounded-xl border px-3 py-2"
              style={{
                borderColor: `${team.color}${active ? "aa" : "33"}`,
                background: `${team.color}${active ? "26" : "12"}`,
              }}
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-black text-white"
                style={{
                  background: team.color,
                  boxShadow: `0 0 16px ${team.color}55`,
                }}
              >
                {team.letter}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-black text-white">
                  {teamNames[team.index]}
                </span>
                <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-white/40">
                  {team.sideArrow} {team.sideLabel} telefónu
                </span>
              </span>
              {scores && (
                <span className="shrink-0 text-xl font-black tabular-nums text-white">
                  {scores[team.index]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function PartyScoreboard({
  teamNames,
  scores,
  colors = PARTY_TEAM_COLORS,
  eyebrow = "Aktuálne skóre",
  detail = "Body počas celej Party hry",
  highlightLeader = true,
  showSides = true,
}: {
  teamNames: [string, string];
  scores: [number, number];
  /** Farby sú tímové — parameter zostáva len pre výnimky. */
  colors?: [string, string];
  eyebrow?: string;
  detail?: string;
  highlightLeader?: boolean;
  showSides?: boolean;
}) {
  const total = Math.max(scores[0] + scores[1], 1);
  const firstShare = (scores[0] / total) * 100;
  const leader = scores[0] === scores[1] ? null : scores[0] > scores[1] ? 0 : 1;

  return (
    <section
      className="party-glass party-scoreboard overflow-hidden rounded-[1.8rem] p-5 text-left"
      aria-label={eyebrow}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/35">
            {eyebrow}
          </p>
          <p className="party-sb-detail mt-1 text-[11px] font-bold text-white/58">
            {detail}
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[8px] font-black uppercase tracking-wider text-white/42">
          {leader === null
            ? "Remíza"
            : `Vedie ${partyTeamIdentity(leader).letter}`}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        {([0, 1] as const).map(index => {
          const leading = highlightLeader && leader === index;
          const team = partyTeamIdentity(index);
          return (
            // Poradie je pevné: tím A vľavo, tím B vpravo. Aj keď vedie druhý
            // tím, karty sa nepresúvajú — vedenie označuje len koruna.
            <div
              key={index}
              className={index === 1 ? "text-right" : ""}
              style={{ gridColumn: index === 0 ? 1 : 3 }}
            >
              <div
                className={`flex items-center gap-2 ${index === 1 ? "flex-row-reverse" : ""}`}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-[10px] font-black text-white"
                  style={{
                    background: colors[index],
                    boxShadow: `0 0 18px ${colors[index]}66`,
                  }}
                >
                  {team.letter}
                </span>
                {leading && (
                  <span
                    className="party-leader-crown text-amber-200"
                    aria-label="Vedúci tím"
                  >
                    <Icons.crown size={14} />
                  </span>
                )}
              </div>
              <p
                className="mt-2 truncate text-[10px] font-black uppercase tracking-wider"
                style={{ color: colors[index] }}
              >
                {teamNames[index]}
              </p>
              {showSides && (
                <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/30">
                  {team.sideArrow} {team.sideLabel}
                </p>
              )}
              <p className="party-sb-score mt-1 text-4xl font-black tabular-nums text-white">
                {scores[index]}
              </p>
              <p className="party-sb-unit text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
                bodov
              </p>
            </div>
          );
        })}
        <span className="col-start-2 row-start-1 self-center pb-2 text-[9px] font-black uppercase tracking-widest text-white/20">
          vs
        </span>
      </div>

      <div className="party-sb-bar mt-5 flex h-3 overflow-hidden rounded-full bg-white/[.07] p-0.5 ring-1 ring-white/[.06]">
        <div
          className="rounded-l-full transition-all duration-700"
          style={{
            width: `${firstShare}%`,
            background: colors[0],
            boxShadow: `0 0 18px ${colors[0]}88`,
          }}
        />
        <div
          className="flex-1 rounded-r-full transition-all duration-700"
          style={{
            background: colors[1],
            boxShadow: `0 0 18px ${colors[1]}66`,
          }}
        />
      </div>
    </section>
  );
}

export function ParticipantScoreStrip({
  names,
  scores,
  colors,
  activeIndex,
  badges,
  sideHints,
}: {
  names: string[];
  scores: number[];
  colors: string[];
  activeIndex?: number;
  /** Písmeno tímu (A/B) v tímovom móde — v sólo móde `null`. */
  badges?: (string | null)[];
  /** Pevná strana tímu („↑ hore"), aby bolo jasné, komu odznak patrí. */
  sideHints?: (string | null)[];
}) {
  return (
    // Pás je vždy najvyšší prvok hernej obrazovky, takže si rezervuje miesto
    // pre tlačidlo odísť. Bez toho tlačidlo zakrývalo skóre posledného hráča
    // a blokovalo vodorovné posúvanie pásu. Použitý je margin, nie padding —
    // pás skroluje a padding by viditeľnú časť nezúžil.
    <div className="exit-slot-inset flex gap-2 overflow-x-auto pb-1">
      {/* Poradie je vždy poradie účastníkov, nikdy nie podľa skóre — odznak
          tímu tak zostáva celú hru na tom istom mieste pásu. */}
      {names.map((name, index) => {
        const color = colors[index % colors.length];
        const active = activeIndex === index;
        const badge = badges?.[index] ?? null;
        const sideHint = sideHints?.[index] ?? null;
        return (
          <div
            key={`${name}-${index}`}
            className={`party-team-badge min-w-[104px] flex-1 rounded-xl border px-3 py-2.5 text-left ${active ? "is-active" : ""}`}
            style={{
              borderColor: `${color}${active ? "aa" : "40"}`,
              background: `linear-gradient(145deg, ${color}${active ? "30" : "16"}, rgba(255,255,255,.035))`,
              boxShadow: active ? `0 10px 28px ${color}22` : undefined,
            }}
          >
            <p className="flex items-center gap-1.5">
              {badge && (
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md text-[9px] font-black leading-none text-white"
                  style={{ background: color }}
                >
                  {badge}
                </span>
              )}
              <span className="truncate text-[9px] font-black uppercase tracking-wider text-white/50">
                {name}
              </span>
            </p>
            <p className="mt-0.5 text-2xl font-black tabular-nums text-white">
              {scores[index] ?? 0}
            </p>
            {sideHint && (
              <p className="text-[8px] font-black uppercase tracking-[0.14em] text-white/30">
                {sideHint}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CircularTimer({
  value,
  total,
  color,
  size = 112,
  label = "sekúnd",
}: {
  value: number;
  total: number;
  color: string;
  size?: number;
  label?: string;
}) {
  const progress = Math.max(0, Math.min(1, value / Math.max(total, 1)));
  const style = {
    width: size,
    height: size,
    "--timer-color": color,
    "--timer-angle": `${progress * 360}deg`,
  } as CSSProperties;
  return (
    <div
      className="party-timer relative shrink-0 rounded-full p-[5px]"
      style={style}
    >
      <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-white/10 bg-[#090e18]/98 shadow-inner">
        <span className="text-3xl font-black tabular-nums leading-none text-white">
          {Math.ceil(value)}
        </span>
        <span className="mt-1 text-[8px] font-black uppercase tracking-[0.22em] text-white/35">
          {label}
        </span>
      </div>
    </div>
  );
}
