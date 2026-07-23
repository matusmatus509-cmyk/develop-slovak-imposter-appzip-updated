import { useState } from "react";
import { Icons } from "../components/icons";
import { useStats } from "../hooks/useStats";
import partyTableBackground from "../assets/party-table-bg.png";

function formatTime(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

interface StatCardProps {
  value: number | string;
  label: string;
  sublabel?: string;
  accent: string;
  accentSoft: string;
  icon: keyof typeof Icons;
  delay?: number;
}

function StatCard({ value, label, sublabel, accent, accentSoft, icon, delay = 0 }: StatCardProps) {
  const Icon = Icons[icon];
  return (
    <div
      className="relative overflow-hidden rounded-[22px] border border-white/[.09] bg-[#10161e] p-5"
      style={{
        animation: `slideUp .55s ease-out ${delay}ms both`,
        boxShadow: `0 14px 36px -22px ${accent}55`,
      }}
    >
      {/* subtle glow blob */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full blur-2xl"
        style={{ background: accentSoft }}
      />

      <div className="relative">
        <span
          className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: accentSoft, color: accent }}
        >
          <Icon size={20} />
        </span>

        <p
          className="text-[2.6rem] font-black leading-none tracking-[-0.04em] text-white"
          style={{ fontFamily: '"Manrope", system-ui, sans-serif' }}
        >
          {value}
        </p>

        <p className="mt-1.5 text-[11px] font-extrabold uppercase tracking-[.18em] text-white/50">
          {label}
        </p>
        {sublabel && (
          <p className="mt-0.5 text-[10px] font-semibold text-white/30">{sublabel}</p>
        )}
      </div>
    </div>
  );
}

export default function Stats({ onBack }: { onBack: () => void }) {
  const { stats, resetStats } = useStats();
  const [confirmReset, setConfirmReset] = useState(false);

  const timeFormatted = formatTime(stats.totalTimeSeconds);

  function handleReset() {
    if (confirmReset) {
      resetStats();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
    }
  }

  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.teamWins / stats.gamesPlayed) * 100)
      : 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b10] text-white">
      {/* Background */}
      <img
        src={partyTableBackground}
        alt=""
        className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-30 saturate-50"
      />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#080b10]/40 via-[#080b10]/80 to-[#080b10]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(139,92,246,.07),transparent_34%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-10 pt-5">
        {/* Header */}
        <header
          className="mb-7 flex items-center justify-between"
          style={{ animation: "slideUp .45s ease-out both" }}
        >
          <button
            type="button"
            onClick={onBack}
            aria-label="Späť"
            className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-white/10 bg-[#11171e]/80 text-white/70 backdrop-blur transition active:scale-90"
          >
            <Icons.arrowLeft size={20} />
          </button>

          <div className="flex flex-col items-center">
            <p className="text-[9px] font-extrabold uppercase tracking-[.25em] text-white/40">
              Prehľad
            </p>
            <h1 className="text-[1.2rem] font-black tracking-[-0.03em] text-white">
              Štatistiky
            </h1>
          </div>

          {/* spacer */}
          <div className="h-11 w-11" />
        </header>

        {/* Hero value */}
        <section
          className="relative mb-6 overflow-hidden rounded-[24px] border border-white/[.09] bg-[#10161e] px-6 py-7"
          style={{
            animation: "slideUp .5s ease-out 60ms both",
            boxShadow: "0 18px 50px -28px rgba(139,92,246,.4)",
          }}
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full blur-3xl" style={{ background: "rgba(139,92,246,.12)" }} />
          <div className="relative flex items-center gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
              <Icons.gamepad size={26} />
            </span>
            <div>
              <p
                className="text-[3.4rem] font-black leading-none tracking-[-0.05em] text-white"
                style={{ fontFamily: '"Manrope", system-ui, sans-serif' }}
              >
                {stats.gamesPlayed}
              </p>
              <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[.2em] text-white/45">
                Odohratých hier
              </p>
            </div>
          </div>

          {stats.gamesPlayed > 0 && (
            <div className="mt-5 h-px bg-white/[.07]" />
          )}
          {stats.gamesPlayed > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
                  style={{ width: `${winRate}%` }}
                />
              </div>
              <span className="text-[11px] font-extrabold text-violet-400">{winRate}% výhier</span>
            </div>
          )}
        </section>

        {/* 2-column grid of stat cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            value={stats.teamWins}
            label="Výhry tímu"
            sublabel="Party Mode"
            accent="#3b82f6"
            accentSoft="rgba(59,130,246,.14)"
            icon="trophy"
            delay={100}
          />
          <StatCard
            value={timeFormatted}
            label="Čas hrania"
            sublabel="celkovo"
            accent="#22d3ee"
            accentSoft="rgba(34,211,238,.12)"
            icon="clock"
            delay={160}
          />
          <StatCard
            value={stats.correctAnswers}
            label="Správne odpovede"
            accent="#34d399"
            accentSoft="rgba(52,211,153,.12)"
            icon="checkCircle"
            delay={220}
          />
          <StatCard
            value={stats.gamesPlayed > 0 ? `${winRate}%` : "—"}
            label="Úspešnosť"
            sublabel="výhry / hry"
            accent="#f59e0b"
            accentSoft="rgba(245,158,11,.12)"
            icon="star"
            delay={280}
          />
        </div>

        {/* Reset button */}
        <div
          className="mt-8"
          style={{ animation: "slideUp .55s ease-out 340ms both" }}
        >
          {confirmReset ? (
            <div className="overflow-hidden rounded-[18px] border border-rose-500/25 bg-rose-500/10 p-4">
              <p className="mb-3 text-center text-sm font-bold text-white/70">
                Naozaj vymazať všetky štatistiky?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 rounded-[14px] border border-white/10 bg-white/[.05] py-3 text-sm font-extrabold text-white/55 transition active:scale-95"
                >
                  Zrušiť
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 rounded-[14px] bg-gradient-to-r from-rose-600 to-rose-500 py-3 text-sm font-extrabold text-white shadow-lg transition active:scale-95"
                >
                  Vymazať
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-[18px] border border-white/[.07] bg-white/[.03] py-4 text-[11px] font-extrabold uppercase tracking-[.18em] text-white/30 transition hover:text-white/50 active:scale-[.98]"
            >
              Resetovať štatistiky
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
