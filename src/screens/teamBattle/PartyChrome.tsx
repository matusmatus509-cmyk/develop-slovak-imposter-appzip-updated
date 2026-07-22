import type { CSSProperties, ReactNode } from "react";

export function PartyBackdrop({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`party-backdrop fixed inset-0 overflow-hidden bg-[#070711] ${className}`}>
      <div className="party-orb party-orb-one" />
      <div className="party-orb party-orb-two" />
      <div className="party-orb party-orb-three" />
      <div className="party-grid absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.06] to-transparent" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

export function PartyEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/55 backdrop-blur-xl">
      <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_12px_#e879f9]" />
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
      className={`relative min-w-0 flex-1 overflow-hidden rounded-[1.4rem] border px-4 py-3 transition-all duration-300 ${active ? "scale-[1.03]" : ""}`}
      style={{
        borderColor: `${color}${active ? "bb" : "45"}`,
        background: `linear-gradient(145deg, ${color}${active ? "32" : "18"}, rgba(255,255,255,.035))`,
        boxShadow: active ? `0 12px 36px ${color}28, inset 0 1px 0 rgba(255,255,255,.14)` : "inset 0 1px 0 rgba(255,255,255,.08)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
          style={{ background: color, boxShadow: `0 0 18px ${color}66` }}
        >
          {side}
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-[10px] font-black uppercase tracking-[0.14em] text-white/45">{name}</span>
          <span className="block text-2xl font-black tabular-nums text-white">{score}</span>
        </span>
      </div>
    </div>
  );
}

export function ParticipantScoreStrip({
  names,
  scores,
  colors,
  activeIndex,
}: {
  names: string[];
  scores: number[];
  colors: string[];
  activeIndex?: number;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {names.map((name, index) => {
        const color = colors[index % colors.length];
        const active = activeIndex === index;
        return (
          <div
            key={`${name}-${index}`}
            className={`min-w-[104px] flex-1 rounded-2xl border px-3 py-2.5 text-left transition ${active ? "scale-[1.02]" : ""}`}
            style={{
              borderColor: `${color}${active ? "aa" : "40"}`,
              background: `linear-gradient(145deg, ${color}${active ? "30" : "16"}, rgba(255,255,255,.035))`,
              boxShadow: active ? `0 10px 28px ${color}22` : undefined,
            }}
          >
            <p className="truncate text-[9px] font-black uppercase tracking-wider text-white/50">{name}</p>
            <p className="mt-0.5 text-2xl font-black tabular-nums text-white">{scores[index] ?? 0}</p>
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
    <div className="party-timer relative shrink-0 rounded-full p-[5px]" style={style}>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-white/10 bg-[#0b0b17]/95 shadow-inner backdrop-blur-xl">
        <span className="text-3xl font-black tabular-nums leading-none text-white">{value}</span>
        <span className="mt-1 text-[8px] font-black uppercase tracking-[0.22em] text-white/35">{label}</span>
      </div>
    </div>
  );
}
