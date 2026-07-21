import { useEffect, useState } from "react";
import type { BattleRound } from "../../data/teamBattle";
import { GAME_ICONS, GAME_LABELS, TEAM_COLORS } from "../../data/teamBattle";
import { PartyBackdrop, PartyEyebrow, TeamBadge } from "./PartyChrome";

const GAME_DESC: Record<string, string> = {
  pantomima: "Predvádzajte pohybom bez slov. Tím háda čo najviac výrazov za čas.",
  sarady: "Opisujte bez zakázaných výrazov. Každá správna odpoveď prináša body.",
  quiz: "Rýchly tímový kvíz. Prvý tím na bzučiaku získava právo odpovedať.",
  pingpong: "Súboj jeden na jedného. Striedajte slová a udržte tempo až do konca.",
  hadajktosom: "Držte mobil na čele a hádajte postavu iba pomocou odpovedí áno alebo nie.",
};

const SPECIAL_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  double: { label: "Dvojité body", icon: "★", color: "#f59e0b" },
  lightning: { label: "Bleskové kolo", icon: "⚡", color: "#22d3ee" },
  final: { label: "Finálové kolo", icon: "♛", color: "#e879f9" },
};

export default function RoundIntro({
  round,
  totalRounds,
  scores,
  teamNames,
  onStart,
}: {
  round: BattleRound;
  totalRounds: number;
  scores: [number, number];
  teamNames: [string, string];
  onStart: () => void;
}) {
  const [starting, setStarting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [blue, red] = TEAM_COLORS;
  const special = SPECIAL_LABELS[round.special];

  useEffect(() => {
    if (!starting) return;
    const timeout = window.setTimeout(() => {
      if (countdown > 1) setCountdown((value) => value - 1);
      else if (countdown === 1) setCountdown(0);
      else onStart();
    }, countdown === 0 ? 500 : 720);
    return () => window.clearTimeout(timeout);
  }, [countdown, onStart, starting]);

  if (starting) {
    return (
      <PartyBackdrop>
        <main className="flex h-full flex-col items-center justify-center px-6 text-center">
          <PartyEyebrow>Kolo {round.index + 1}</PartyEyebrow>
          <div className="mt-10 text-7xl drop-shadow-[0_0_32px_rgba(255,255,255,.22)]">{GAME_ICONS[round.game]}</div>
          <h2 className="mt-4 text-xl font-black text-white">{GAME_LABELS[round.game]}</h2>
          <div className="relative mt-10 flex h-48 w-48 items-center justify-center rounded-full border border-fuchsia-300/30 bg-fuchsia-500/10 shadow-[0_0_80px_rgba(217,70,239,.28),inset_0_0_35px_rgba(255,255,255,.05)]">
            <div className="absolute inset-3 rounded-full border border-dashed border-white/15 animate-spin [animation-duration:7s]" />
            <span
              key={countdown}
              className="party-countdown-pop relative text-8xl font-black leading-none text-white"
              style={{ textShadow: "0 0 35px rgba(232,121,249,.75)" }}
            >
              {countdown === 0 ? "GO!" : countdown}
            </span>
          </div>
          <p className="mt-8 text-xs font-black uppercase tracking-[0.25em] text-white/30">Pripravte sa</p>
        </main>
      </PartyBackdrop>
    );
  }

  return (
    <PartyBackdrop>
      <main className="h-full overflow-y-auto px-5 pb-8 pt-8">
        <div className="mx-auto flex w-full max-w-md flex-col gap-5">
          <header className="text-center">
            <PartyEyebrow>Kolo {round.index + 1} z {totalRounds}</PartyEyebrow>
            <div className="mx-auto mt-5 flex max-w-xs gap-1.5">
              {Array.from({ length: totalRounds }, (_, index) => (
                <span
                  key={index}
                  className={`h-1.5 flex-1 rounded-full ${index <= round.index ? "bg-gradient-to-r from-violet-500 to-fuchsia-400" : "bg-white/10"}`}
                />
              ))}
            </div>
          </header>

          {special && (
            <div
              className="party-glass flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-[0.12em]"
              style={{ borderColor: `${special.color}55`, background: `${special.color}12`, color: special.color }}
            >
              <span className="text-xl">{special.icon}</span>
              {special.label}
              {round.pointMultiplier > 1 && <span className="opacity-60">×{round.pointMultiplier}</span>}
            </div>
          )}

          <section className="party-glass relative overflow-hidden rounded-[2rem] px-6 py-8 text-center">
            <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/70 to-transparent" />
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.025] text-6xl shadow-[0_22px_60px_rgba(0,0,0,.35)]">
              {GAME_ICONS[round.game]}
            </div>
            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.25em] text-fuchsia-300/65">Nasleduje</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">{GAME_LABELS[round.game]}</h1>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/45">{GAME_DESC[round.game]}</p>
            <div className="mt-5 flex justify-center gap-2">
              <span className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white/55">
                {round.timeSeconds} sekúnd
              </span>
              <span className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white/55">
                ×{round.pointMultiplier} body
              </span>
            </div>
          </section>

          <div className="flex gap-3">
            <TeamBadge name={teamNames[0]} score={scores[0]} color={blue} side="A" active={scores[0] > scores[1]} />
            <TeamBadge name={teamNames[1]} score={scores[1]} color={red} side="B" active={scores[1] > scores[0]} />
          </div>

          <button
            onClick={() => setStarting(true)}
            className="party-shine overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-6 py-5 text-base font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_50px_rgba(168,85,247,.35)] transition active:scale-[.97]"
          >
            Spustiť kolo
          </button>
        </div>
      </main>
    </PartyBackdrop>
  );
}
