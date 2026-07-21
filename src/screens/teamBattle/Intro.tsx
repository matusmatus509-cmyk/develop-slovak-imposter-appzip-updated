import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Icons } from "../../components/icons";
import { TEAM_COLORS } from "../../data/teamBattle";
import { PartyBackdrop, PartyEyebrow } from "./PartyChrome";

export default function TeamBattleIntro({
  teamNames,
  onDone,
}: {
  teamNames: [string, string];
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<"countdown" | "reveal">("countdown");
  const [count, setCount] = useState(3);
  const [blue, red] = TEAM_COLORS;

  useEffect(() => {
    if (phase !== "countdown") return;
    const timeout = window.setTimeout(
      () => (count > 0 ? setCount((value) => value - 1) : setPhase("reveal")),
      count > 0 ? 850 : 650,
    );
    return () => window.clearTimeout(timeout);
  }, [count, phase]);

  if (phase === "countdown") {
    const progress = count === 3 ? 25 : count === 2 ? 50 : count === 1 ? 75 : 100;
    return (
      <PartyBackdrop>
        <main className="flex h-full flex-col items-center justify-between px-6 py-10 text-center">
          <div className="pt-[max(0px,env(safe-area-inset-top))]">
            <PartyEyebrow>Party mode</PartyEyebrow>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-white/35">
              Pripravte oba tímy
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div
              className="relative h-52 w-52 rounded-full p-[6px] shadow-[0_0_70px_rgba(168,85,247,.28)]"
              style={{
                background: `conic-gradient(#e879f9 ${progress}%, rgba(255,255,255,.08) ${progress}%)`,
              }}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full border border-white/10 bg-[#0a0917]/95 shadow-inner">
                <span
                  key={count}
                  className="party-countdown-pop text-8xl font-black leading-none text-white"
                  style={{ textShadow: "0 0 35px rgba(232,121,249,.7)" }}
                >
                  {count === 0 ? "GO!" : count}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-white/30">
              Bitka sa začína
            </p>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              {teamNames.map((name, index) => {
                const color = index === 0 ? blue : red;
                return (
                  <div
                    key={name}
                    className="truncate rounded-2xl border px-3 py-3 text-sm font-black text-white"
                    style={{ borderColor: `${color}66`, background: `${color}22` }}
                  >
                    {name}
                  </div>
                );
              }).reduce<ReactNode[]>((items, team, index) => {
                if (index > 0) items.push(<span key="versus" className="text-xs font-black text-white/25">VS</span>);
                items.push(team);
                return items;
              }, [])}
            </div>
          </div>
        </main>
      </PartyBackdrop>
    );
  }

  return (
    <PartyBackdrop>
      <main className="flex h-full flex-col overflow-y-auto px-5 pb-8 pt-10 text-center">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center">
          <PartyEyebrow>Tímová aréna</PartyEyebrow>

          <div className="relative mt-8">
            <div className="absolute inset-0 scale-150 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/15 bg-gradient-to-br from-fuchsia-500/35 to-violet-600/20 shadow-[0_20px_60px_rgba(168,85,247,.35)]">
              <Icons.sword size={48} className="text-white" />
            </div>
          </div>

          <p className="mt-7 text-xs font-black uppercase tracking-[0.28em] text-fuchsia-300/75">Súboj večera</p>
          <h1 className="mt-2 text-4xl font-black leading-[0.95] tracking-tight text-white">
            KTO OVLÁDNE<br />PARTY?
          </h1>

          <div className="mt-9 grid w-full grid-cols-[1fr_auto_1fr] items-stretch gap-3">
            {teamNames.map((name, index) => {
              const color = index === 0 ? blue : red;
              return (
                <div
                  key={name}
                  className="party-glass flex min-w-0 flex-col items-center rounded-[1.75rem] px-3 py-6"
                  style={{ borderColor: `${color}55`, boxShadow: `0 18px 50px ${color}18` }}
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black text-white"
                    style={{ background: color, boxShadow: `0 0 25px ${color}70` }}
                  >
                    {index === 0 ? "A" : "B"}
                  </span>
                  <span className="mt-4 w-full truncate text-base font-black text-white">{name}</span>
                  <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">pripravený</span>
                </div>
              );
            }).reduce<ReactNode[]>((items, team, index) => {
              if (index > 0) {
                items.push(
                  <div key="versus" className="flex items-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#11101d] text-xs font-black italic text-white shadow-xl">VS</span>
                  </div>,
                );
              }
              items.push(team);
              return items;
            }, [])}
          </div>
        </div>

        <button
          onClick={onDone}
          className="party-shine mx-auto mt-7 w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-6 py-5 text-base font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_50px_rgba(168,85,247,.35)] transition active:scale-[.97]"
        >
          Vstúpiť do arény
        </button>
      </main>
    </PartyBackdrop>
  );
}
