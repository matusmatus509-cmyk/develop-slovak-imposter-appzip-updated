import type { Screen } from "../types";
import { Icons } from "../components/icons";
import partyTableBackground from "../assets/party-table-bg.png";
import partyModeArt from "../assets/party-mode-card.jpg";
import imposterArt from "../assets/imposter-card.jpg";
import minigamesArt from "../assets/minigames-card.jpg";
import { LanguageSwitcher } from "../i18n/LanguageProvider";
import { useStats } from "../hooks/useStats";

function formatTimeShort(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

const SECTIONS: Array<{
  screen: Screen;
  eyebrow: string;
  title: string;
  description: string;
  icon: "users" | "userCheck" | "gamepad";
  image: string;
  accent: string;
  glow: string;
}> = [
  {
    screen: "teambattle",
    eyebrow: "Tím proti tímu",
    title: "Party mode",
    description: "Veľká tímová hra na celý večer",
    icon: "users",
    image: partyModeArt,
    accent: "from-violet-500 to-indigo-500",
    glow: "rgba(124, 58, 237, .38)",
  },
  {
    screen: "impostor-menu",
    eyebrow: "Kto z vás klame?",
    title: "Imposter",
    description: "Klasická hra aj kreslenie",
    icon: "userCheck",
    image: imposterArt,
    accent: "from-orange-400 to-rose-500",
    glow: "rgba(244, 63, 94, .34)",
  },
  {
    screen: "minigames-menu",
    eyebrow: "Rýchle hry",
    title: "Minihry",
    description: "Krátke kolá pre každú partiu",
    icon: "gamepad",
    image: minigamesArt,
    accent: "from-cyan-400 to-teal-500",
    glow: "rgba(6, 182, 212, .32)",
  },
];

export default function Home({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { stats } = useStats();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b10] text-white">
      <LanguageSwitcher />
      <img
        src={partyTableBackground}
        alt=""
        className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-42 saturate-75"
      />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#080b10]/30 via-[#080b10]/75 to-[#080b10]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,246,225,.07),transparent_34%)]" />

      {/* Stats button — absolute, left of the language switcher */}
      <button
        type="button"
        onClick={() => onNavigate("stats")}
        aria-label="Štatistiky"
        className="absolute right-[72px] top-5 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-[#111820]/95 text-white/55 shadow-xl transition hover:border-white/25 hover:text-white/80 active:scale-95"
      >
        <Icons.barChart size={17} />
      </button>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-8 pt-8">
        <header className="mb-8" style={{ animation: "slideUp .55s ease-out both" }}>
          <div className="mb-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#11171e]/80 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-extrabold uppercase tracking-[.22em] text-white/65">Jeden mobil · celá partia</span>
            </div>
          </div>
          <h1 className="max-w-[320px] text-[2.65rem] font-black leading-[.96] tracking-[-.055em]">
            Vyberte si hru.<br />
            <span className="text-white/45">Zábava začína.</span>
          </h1>
          <p className="mt-4 max-w-xs text-sm font-medium leading-relaxed text-white/55">
            Spoločenské hry pre kamarátov, rodinu aj párty. Bez registrácie a zbytočného nastavovania.
          </p>
        </header>

        <section className="flex flex-1 flex-col justify-center gap-3.5" aria-label="Herné režimy">
          {SECTIONS.map((section, index) => {
            const Icon = Icons[section.icon];
            return (
              <button
                key={section.screen}
                type="button"
                onClick={() => onNavigate(section.screen)}
                className="group relative min-h-[142px] overflow-hidden rounded-[22px] border border-white/[.11] bg-[#11171e] text-left shadow-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/20 active:translate-y-0 active:scale-[.985]"
                style={{
                  animation: `slideUp .55s ease-out ${120 + index * 90}ms both`,
                  boxShadow: `0 18px 42px -31px ${section.glow}`,
                }}
              >
                <img
                  src={section.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center opacity-74 saturate-[.82] transition duration-500 group-hover:scale-[1.025] group-hover:opacity-86"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,#10161d_0%,rgba(16,22,29,.98)_36%,rgba(16,22,29,.72)_64%,rgba(16,22,29,.16)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1019]/75 via-transparent to-white/[.03]" />
                <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${section.accent}`} />
                <div className="relative flex min-h-[142px] items-center p-5">
                  <div className="w-[68%] min-w-0">
                    <div className="mb-2.5 flex items-center gap-2">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${section.accent} shadow-lg`}>
                        <Icon size={17} className="text-white" />
                      </span>
                      <p className="text-[9px] font-extrabold uppercase tracking-[.18em] text-white/55">{section.eyebrow}</p>
                    </div>
                    <h2 className="text-[1.55rem] font-extrabold leading-none tracking-[-.035em]">{section.title}</h2>
                    <p className="mt-2 text-[11px] font-semibold leading-snug text-white/58">{section.description}</p>
                  </div>
                  <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-[#111820]/80 text-white/65 shadow-lg transition group-hover:translate-x-0.5 group-hover:bg-[#1b232d] group-hover:text-white">
                    <Icons.chevronRight size={20} />
                  </span>
                </div>
              </button>
            );
          })}
        </section>

        {/* Stats strip — only shown once at least one game has been played */}
        {stats.gamesPlayed > 0 && (
          <button
            type="button"
            onClick={() => onNavigate("stats")}
            className="mt-5 flex w-full items-center justify-between overflow-hidden rounded-[18px] border border-white/[.08] bg-[#0e1420]/80 px-5 py-4 text-left backdrop-blur transition hover:border-white/15 active:scale-[.98]"
            style={{ animation: "slideUp .55s ease-out 450ms both" }}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                <Icons.barChart size={15} />
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-[.18em] text-white/50">
                Vaše štatistiky
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-base font-black text-white leading-none">{stats.gamesPlayed}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/35 mt-0.5">hier</p>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-white leading-none">{stats.teamWins}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/35 mt-0.5">výhier</p>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-white leading-none">{formatTimeShort(stats.totalTimeSeconds)}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/35 mt-0.5">čas</p>
              </div>
              <Icons.chevronRight size={16} className="text-white/30 shrink-0" />
            </div>
          </button>
        )}

        <footer className="mt-5 flex items-center justify-center gap-2 text-[11px] font-semibold text-white/35" style={{ animation: "fadeIn 1s ease-out .5s both" }}>
          <Icons.sparkles size={14} />
          <span>Hrajte offline, kdekoľvek</span>
        </footer>
      </div>
    </main>
  );
}
