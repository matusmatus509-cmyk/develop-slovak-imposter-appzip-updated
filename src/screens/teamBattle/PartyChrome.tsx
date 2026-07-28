import type { CSSProperties, ReactNode } from "react";

export function PartyBackdrop({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`party-backdrop fixed inset-0 isolate overflow-hidden bg-[#050711] ${className}`}>
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

export function TeamBadge({
  name,
  score,
  color,
  side,
  active = false,
}: {
  name: string;
  score: number;
  color: string;
  side: "A" | "B";
  active?: boolean;
}) {
  return (
    <div
      className={`party-team-badge relative min-w-0 flex-1 overflow-hidden rounded-2xl border px-4 py-3 ${active ? "is-active" : ""}`}
      style={{
        borderColor: `${color}${active ? "bb" : "45"}`,
        background: `linear-gradient(145deg, ${color}${active ? "32" : "18"}, rgba(255,255,255,.035))`,
        boxShadow: active ? `0 16px 42px -22px ${color}, inset 0 1px 0 rgba(255,255,255,.1)` : "inset 0 1px 0 rgba(255,255,255,.05)",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white" style={{ background: color, boxShadow: `0 0 20px ${color}55` }}>{side}</span>
        <span className="min-w-0 flex-1 text-left"><span className="block truncate text-[9px] font-black uppercase tracking-[0.14em] text-white/45">{name}</span><span className="block text-2xl font-black tabular-nums text-white">{score}</span></span>
      </div>
    </div>
  );
}

export function PartyScoreboard({
  teamNames,
  scores,
  colors,
  eyebrow = "Aktuálne skóre",
  detail = "Body počas celej Party hry",
  highlightLeader = true,
}: {
  teamNames: [string, string];
  scores: [number, number];
  colors: [string, string];
  eyebrow?: string;
  detail?: string;
  highlightLeader?: boolean;
}) {
  const total = Math.max(scores[0] + scores[1], 1);
  const firstShare = (scores[0] / total) * 100;
  const leader = scores[0] === scores[1] ? null : scores[0] > scores[1] ? 0 : 1;

  return (
    <section className="party-glass party-scoreboard overflow-hidden rounded-[1.8rem] p-5 text-left" aria-label={eyebrow}>
      <div className="flex items-center justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/35">{eyebrow}</p><p className="mt-1 text-[11px] font-bold text-white/58">{detail}</p></div><span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[8px] font-black uppercase tracking-wider text-white/42">{leader === null ? "Remíza" : `Vedie ${leader === 0 ? "A" : "B"}`}</span></div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        {([0, 1] as const).map((index) => {
          const leading = highlightLeader && leader === index;
          return <div key={index} className={index === 1 ? "text-right" : ""} style={{ gridColumn: index === 0 ? 1 : 3 }}><div className={`flex items-center gap-2 ${index === 1 ? "flex-row-reverse" : ""}`}><span className="flex h-8 w-8 items-center justify-center rounded-xl text-[10px] font-black text-white" style={{ background: colors[index], boxShadow: `0 0 18px ${colors[index]}66` }}>{index === 0 ? "A" : "B"}</span>{leading && <span className="party-leader-crown text-sm" aria-label="Vedúci tím">♛</span>}</div><p className="mt-2 truncate text-[10px] font-black uppercase tracking-wider" style={{ color: colors[index] }}>{teamNames[index]}</p><p className="mt-1 text-4xl font-black tabular-nums text-white">{scores[index]}</p><p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/25">bodov</p></div>;
        })}
        <span className="col-start-2 row-start-1 self-center pb-2 text-[9px] font-black uppercase tracking-widest text-white/20">vs</span>
      </div>

      <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-white/[.07] p-0.5 ring-1 ring-white/[.06]"><div className="rounded-l-full transition-all duration-700" style={{ width: `${firstShare}%`, background: colors[0], boxShadow: `0 0 18px ${colors[0]}88` }} /><div className="flex-1 rounded-r-full transition-all duration-700" style={{ background: colors[1], boxShadow: `0 0 18px ${colors[1]}66` }} /></div>
    </section>
  );
}

export function ParticipantScoreStrip({ names, scores, colors, activeIndex }: { names: string[]; scores: number[]; colors: string[]; activeIndex?: number }) {
  return <div className="flex gap-2 overflow-x-auto pb-1">{names.map((name, index) => { const color = colors[index % colors.length]; const active = activeIndex === index; return <div key={`${name}-${index}`} className={`party-team-badge min-w-[104px] flex-1 rounded-xl border px-3 py-2.5 text-left ${active ? "is-active" : ""}`} style={{ borderColor: `${color}${active ? "aa" : "40"}`, background: `linear-gradient(145deg, ${color}${active ? "30" : "16"}, rgba(255,255,255,.035))`, boxShadow: active ? `0 10px 28px ${color}22` : undefined }}><p className="truncate text-[9px] font-black uppercase tracking-wider text-white/50">{name}</p><p className="mt-0.5 text-2xl font-black tabular-nums text-white">{scores[index] ?? 0}</p></div>; })}</div>;
}

export function CircularTimer({ value, total, color, size = 112, label = "sekúnd" }: { value: number; total: number; color: string; size?: number; label?: string }) {
  const progress = Math.max(0, Math.min(1, value / Math.max(total, 1)));
  const style = { width: size, height: size, "--timer-color": color, "--timer-angle": `${progress * 360}deg` } as CSSProperties;
  return <div className="party-timer relative shrink-0 rounded-full p-[5px]" style={style}><div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-white/10 bg-[#090e18]/98 shadow-inner"><span className="text-3xl font-black tabular-nums leading-none text-white">{Math.ceil(value)}</span><span className="mt-1 text-[8px] font-black uppercase tracking-[0.22em] text-white/35">{label}</span></div></div>;
}
