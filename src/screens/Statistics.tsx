import { Icons } from "../components/icons";
import partyTableBackground from "../assets/party-table-bg.png";
import {
  ACHIEVEMENTS,
  DAILY_CHALLENGES,
  getDailyChallengeProgress,
  getLevelInfo,
  normalizeStatistics,
} from "../utils/gameStats";
import type { GameStatistics } from "../types";

function formatPlayTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  if (hours > 0) return `${hours} h ${minutes} min`;
  if (minutes > 0) return `${minutes} min ${seconds} s`;
  return `${seconds} s`;
}

export default function Statistics({ statistics, onBack }: { statistics: GameStatistics; onBack: () => void }) {
  const safeStatistics = normalizeStatistics(statistics);
  const progression = safeStatistics.progression;
  const level = getLevelInfo(progression.xp);
  const teamWins = Object.entries(safeStatistics.teamWins).sort(([, winsA], [, winsB]) => winsB - winsA);
  const totalTeamWins = teamWins.reduce((sum, [, wins]) => sum + wins, 0);
  const unlockedAchievements = ACHIEVEMENTS.filter((achievement) => progression.achievements[achievement.id]);
  const completedDaily = progression.daily.rewardedChallengeIds.length;
  const metrics = [
    { label: "Odohrané hry", value: safeStatistics.gamesPlayed.toLocaleString("sk-SK"), icon: Icons.gamepad, color: "#a78bfa", background: "rgba(139, 92, 246, .13)" },
    { label: "Výhry tímov", value: totalTeamWins.toLocaleString("sk-SK"), icon: Icons.trophy, color: "#fbbf24", background: "rgba(245, 158, 11, .12)" },
    { label: "Čas hrania", value: formatPlayTime(safeStatistics.totalPlaySeconds), icon: Icons.clock, color: "#22d3ee", background: "rgba(6, 182, 212, .12)" },
    { label: "Správne odpovede", value: safeStatistics.correctAnswers.toLocaleString("sk-SK"), icon: Icons.circleCheck, color: "#34d399", background: "rgba(16, 185, 129, .12)" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b10] text-white">
      <img src={partyTableBackground} alt="" className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-30 saturate-75" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#080b10]/55 via-[#080b10]/90 to-[#080b10]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_78%_5%,rgba(139,92,246,.14),transparent_30%)]" />

      <div className="relative mx-auto min-h-screen w-full max-w-md overflow-y-auto px-5 pb-12 pt-5">
        <header className="flex items-center justify-between">
          <button type="button" onClick={onBack} aria-label="Späť" className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-[#111820]/95 text-white/70 shadow-xl transition hover:border-white/25 hover:text-white active:scale-90">
            <Icons.arrowLeft size={19} />
          </button>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#111820]/80 px-3 py-2 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
            <span className="text-[9px] font-black uppercase tracking-[.18em] text-white/50">Uložené v zariadení</span>
          </div>
        </header>

        <section className="mt-9" style={{ animation: "slideUp .5s ease-out both" }}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.24em] text-violet-300">Váš herný profil</p>
              <h1 className="mt-2 text-[2.7rem] font-black leading-none tracking-[-.055em]">Štatistiky</h1>
            </div>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/15 text-violet-200 shadow-[0_16px_40px_-20px_rgba(139,92,246,.8)]">
              <Icons.layoutDashboard size={26} />
            </span>
          </div>
        </section>

        <section className="relative mt-7 overflow-hidden rounded-[1.8rem] border border-violet-300/20 bg-[#151426]/95 p-5 shadow-[0_24px_70px_-38px_rgba(139,92,246,.9)]" style={{ animation: "slideUp .5s ease-out 60ms both" }}>
          <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-950/40"><Icons.crown size={23} /></span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[.2em] text-violet-300/70">Aktuálny level</p>
                <p className="mt-0.5 text-3xl font-black tracking-tight">Level {level.level}</p>
              </div>
            </div>
            <div className="rounded-xl border border-amber-300/15 bg-amber-400/10 px-3 py-2 text-right">
              <p className="flex items-center gap-1.5 text-sm font-black text-amber-300"><Icons.coins size={15} />{progression.coins.toLocaleString("sk-SK")}</p>
              <p className="mt-0.5 text-[7px] font-black uppercase tracking-wider text-amber-200/45">mincí</p>
            </div>
          </div>
          <div className="relative mt-5 flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-white/35">
            <span>{progression.xp.toLocaleString("sk-SK")} XP celkom</span>
            <span>{level.level === 100 ? "MAX" : `${level.xpIntoLevel}/${level.xpForNextLevel} XP`}</span>
          </div>
          <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-black/35 ring-1 ring-white/[.06]">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 transition-[width] duration-700" style={{ width: `${level.progressPercent}%` }} />
          </div>
          <p className="relative mt-3 text-[10px] font-semibold text-white/35">Za každú spustenú hru získate 100 XP · maximálny level je 100</p>
        </section>

        <section className="mt-7" style={{ animation: "slideUp .5s ease-out 120ms both" }}>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[.2em] text-cyan-300/65">Obnovia sa každý deň</p>
              <h2 className="mt-1 text-xl font-black">Denné výzvy</h2>
            </div>
            <span className="rounded-lg bg-white/[.055] px-2.5 py-1.5 text-[9px] font-black text-white/40">{completedDaily}/{DAILY_CHALLENGES.length}</span>
          </div>
          <div className="space-y-2.5">
            {DAILY_CHALLENGES.map((challenge) => {
              const ChallengeIcon = Icons[challenge.icon];
              const progress = Math.min(challenge.target, getDailyChallengeProgress(safeStatistics, challenge.id));
              const completed = progression.daily.rewardedChallengeIds.includes(challenge.id);
              const progressPercent = Math.min(100, (progress / challenge.target) * 100);
              return (
                <article key={challenge.id} className={`rounded-[1.4rem] border p-4 backdrop-blur-xl transition ${completed ? "border-emerald-300/20 bg-emerald-500/[.07]" : "border-white/[.09] bg-[#11171e]/90"}`}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ color: challenge.color, background: `${challenge.color}18` }}><ChallengeIcon size={19} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-sm font-black text-white/90">{challenge.title}</h3>
                        {completed && <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-emerald-300"><Icons.circleCheck size={13} /> Hotovo</span>}
                      </div>
                      <p className="mt-0.5 text-[10px] font-semibold text-white/38">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/35"><div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${progressPercent}%`, background: completed ? "#34d399" : challenge.color }} /></div>
                    <span className="w-9 text-right text-[9px] font-black text-white/40">{progress}/{challenge.target}</span>
                  </div>
                  <div className="mt-2.5 flex gap-2">
                    <span className="rounded-md bg-violet-400/10 px-2 py-1 text-[8px] font-black text-violet-300">+{challenge.rewardXp} XP</span>
                    <span className="flex items-center gap-1 rounded-md bg-amber-400/10 px-2 py-1 text-[8px] font-black text-amber-300"><Icons.coins size={10} /> +{challenge.rewardCoins}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-7 grid grid-cols-2 gap-3" aria-label="Herné štatistiky">
          {metrics.map((metric, index) => {
            const MetricIcon = metric.icon;
            return (
              <article key={metric.label} className="relative min-h-[142px] overflow-hidden rounded-[1.55rem] border border-white/[.1] bg-[#11171e]/90 p-4 shadow-[0_20px_50px_-35px_rgba(0,0,0,.9)] backdrop-blur-xl" style={{ animation: `slideUp .5s ease-out ${180 + index * 50}ms both` }}>
                <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full blur-2xl" style={{ background: metric.background }} />
                <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[.07]" style={{ color: metric.color, background: metric.background }}><MetricIcon size={20} /></span>
                <p className="relative mt-5 break-words text-[1.55rem] font-black leading-none tracking-[-.035em]">{metric.value}</p>
                <p className="relative mt-2 text-[9px] font-extrabold uppercase tracking-[.15em] text-white/38">{metric.label}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-7" style={{ animation: "slideUp .5s ease-out 350ms both" }}>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[.2em] text-fuchsia-300/65">Zbierka odznakov</p>
              <h2 className="mt-1 text-xl font-black">Achievementy</h2>
            </div>
            <span className="rounded-lg bg-white/[.055] px-2.5 py-1.5 text-[9px] font-black text-white/40">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {ACHIEVEMENTS.map((achievement) => {
              const AchievementIcon = Icons[achievement.icon];
              const unlocked = Boolean(progression.achievements[achievement.id]);
              return (
                <article key={achievement.id} className={`relative min-h-[150px] overflow-hidden rounded-[1.4rem] border p-4 ${unlocked ? "border-white/[.11] bg-[#11171e]/95" : "border-white/[.06] bg-[#0d1218]/80"}`}>
                  {unlocked && <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl" style={{ background: `${achievement.color}18` }} />}
                  <span className={`relative flex h-11 w-11 items-center justify-center rounded-2xl ${unlocked ? "" : "bg-white/[.035] text-white/18"}`} style={unlocked ? { color: achievement.color, background: `${achievement.color}16` } : undefined}>
                    {unlocked ? <AchievementIcon size={21} /> : <Icons.lock size={19} />}
                  </span>
                  <h3 className={`relative mt-4 text-sm font-black ${unlocked ? "text-white/90" : "text-white/28"}`}>{achievement.title}</h3>
                  <p className={`relative mt-1 text-[9px] font-semibold leading-relaxed ${unlocked ? "text-white/38" : "text-white/20"}`}>{achievement.description}</p>
                  {unlocked && <span className="absolute right-3 top-3 text-emerald-300"><Icons.circleCheck size={15} /></span>}
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-7 overflow-hidden rounded-[1.7rem] border border-white/[.1] bg-[#11171e]/90 shadow-2xl backdrop-blur-xl" style={{ animation: "slideUp .5s ease-out 420ms both" }}>
          <div className="flex items-center justify-between border-b border-white/[.07] px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300"><Icons.trophy size={20} /></span>
              <div><p className="text-[9px] font-black uppercase tracking-[.18em] text-amber-300/70">Rebríček</p><h2 className="mt-0.5 text-base font-black">Najlepšie tímy</h2></div>
            </div>
            <span className="rounded-lg bg-white/[.055] px-2.5 py-1.5 text-[10px] font-black text-white/42">{teamWins.length} tímov</span>
          </div>
          {teamWins.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-9 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[.045] text-white/25"><Icons.award size={23} /></span>
              <p className="mt-4 text-sm font-bold text-white/55">Rebríček je zatiaľ prázdny</p>
              <p className="mt-1 max-w-[230px] text-xs leading-relaxed text-white/30">Dokončite Party mode a prvý víťazný tím sa objaví tu.</p>
            </div>
          ) : (
            <ol className="p-2">
              {teamWins.map(([name, wins], index) => (
                <li key={name} className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-white/[.035]">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black ${index === 0 ? "bg-amber-400 text-[#17120a] shadow-lg shadow-amber-900/20" : "bg-white/[.06] text-white/45"}`}>{index === 0 ? <Icons.crown size={17} /> : index + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-extrabold text-white/85">{name}</span>
                  <span className="flex items-baseline gap-1"><strong className="text-lg font-black">{wins}</strong><small className="text-[8px] font-black uppercase tracking-wider text-white/28">výhier</small></span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </main>
  );
}
