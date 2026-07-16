import type { Screen } from "../types";
import { Icons } from "../components/icons";
import partyTableBackground from "../assets/party-table-bg.png";
import partyModeArt from "../assets/party-mode-card.jpg";
import imposterArt from "../assets/imposter-card.jpg";
import minigamesArt from "../assets/minigames-card.jpg";

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
                className="group relative min-h-[142px] overflow-hidden rounded-[28px] border border-white/[.13] bg-[#111722] text-left shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-white/25 active:translate-y-0 active:scale-[.98]"
                style={{
                  animation: `slideUp .55s ease-out ${120 + index * 90}ms both`,
                  boxShadow: `0 18px 45px -28px ${section.glow}`,
                }}
              >
                <img
                  src={section.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center opacity-80 saturate-[.9] transition duration-500 group-hover:scale-[1.035] group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,#101620_0%,rgba(16,22,32,.97)_34%,rgba(16,22,32,.68)_61%,rgba(16,22,32,.1)_100%)]" />
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
                    <h2 className="text-[1.65rem] font-black leading-none tracking-[-.035em] drop-shadow-md">{section.title}</h2>
                    <p className="mt-2 text-[11px] font-semibold leading-snug text-white/58">{section.description}</p>
                  </div>
                  <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white/65 shadow-lg backdrop-blur-md transition group-hover:translate-x-1 group-hover:bg-white/15 group-hover:text-white">
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
