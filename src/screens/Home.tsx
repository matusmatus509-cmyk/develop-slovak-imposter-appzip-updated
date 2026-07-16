import type { Screen } from "../types";
import { Icons } from "../components/icons";
import partyTableBackground from "../assets/party-table-bg.png";

const SECTIONS: Array<{
  screen: Screen;
  eyebrow: string;
  title: string;
  description: string;
  icon: "users" | "userCheck" | "gamepad";
  accent: string;
  glow: string;
}> = [
  {
    screen: "teambattle",
    eyebrow: "Tím proti tímu",
    title: "Party mode",
    description: "Veľká tímová hra na celý večer",
    icon: "users",
    accent: "from-violet-500 to-indigo-500",
    glow: "rgba(124, 58, 237, .38)",
  },
  {
    screen: "impostor-menu",
    eyebrow: "Kto z vás klame?",
    title: "Imposter",
    description: "Klasická hra aj kreslenie",
    icon: "userCheck",
    accent: "from-orange-400 to-rose-500",
    glow: "rgba(244, 63, 94, .34)",
  },
  {
    screen: "minigames-menu",
    eyebrow: "Rýchle hry",
    title: "Minihry",
    description: "Krátke kolá pre každú partiu",
    icon: "gamepad",
    accent: "from-cyan-400 to-teal-500",
    glow: "rgba(6, 182, 212, .32)",
  },
];

export default function Home({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b13] text-white">
      <img
        src={partyTableBackground}
        alt=""
        className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#080b13]/35 via-[#080b13]/70 to-[#080b13]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,.08),transparent_35%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-8 pt-8">
        <header className="mb-8" style={{ animation: "slideUp .55s ease-out both" }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
            <span className="text-[10px] font-extrabold uppercase tracking-[.22em] text-white/65">Jeden mobil · celá partia</span>
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
                className="group relative min-h-[126px] overflow-hidden rounded-[28px] border border-white/[.11] bg-[#121722]/88 p-5 text-left shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 active:translate-y-0 active:scale-[.98]"
                style={{
                  animation: `slideUp .55s ease-out ${120 + index * 90}ms both`,
                  boxShadow: `0 18px 45px -28px ${section.glow}`,
                }}
              >
                <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${section.accent}`} />
                <div className={`absolute -right-10 -top-14 h-36 w-36 rounded-full bg-gradient-to-br ${section.accent} opacity-[.12] blur-2xl transition-opacity duration-300 group-hover:opacity-25`} />
                <div className="relative flex h-full items-center gap-4">
                  <div className={`flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br ${section.accent} shadow-lg transition duration-300 group-hover:rotate-3 group-hover:scale-105`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-white/40">{section.eyebrow}</p>
                    <h2 className="mt-1 text-2xl font-black tracking-tight">{section.title}</h2>
                    <p className="mt-1 text-xs font-medium text-white/50">{section.description}</p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[.06] text-white/45 transition group-hover:translate-x-1 group-hover:bg-white/10 group-hover:text-white">
                    <Icons.chevronRight size={20} />
                  </span>
                </div>
              </button>
            );
          })}
        </section>

        <footer className="mt-7 flex items-center justify-center gap-2 text-[11px] font-semibold text-white/35" style={{ animation: "fadeIn 1s ease-out .5s both" }}>
          <Icons.sparkles size={14} />
          <span>Hrajte offline, kdekoľvek</span>
        </footer>
      </div>
    </main>
  );
}
