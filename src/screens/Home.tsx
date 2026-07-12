import type { Screen } from "../types";
import { Shell } from "../components/ui";

interface GameCard {
  screen: Screen;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  big?: boolean;
}

const CARDS: GameCard[] = [
  {
    screen: "teambattle",
    title: "Tímová párty bitka",
    subtitle: "Dva tímy súperia v pantomíme, šarádach, kvíze a ďalších minihierach",
    icon: "⚔️",
    gradient: "from-purple-600 via-violet-500 to-indigo-600",
    big: true,
  },
  {
    screen: "impostor-setup",
    title: "Podvodník",
    subtitle: "Nájdi podvodníka v skupine skôr, než nájde tajné slovo on teba",
    icon: "🕵️",
    gradient: "from-orange-500 via-pink-500 to-fuchsia-600",
    big: true,
  },
  {
    screen: "truth-or-dare",
    title: "Pravda alebo výzva",
    subtitle: "Klasika na každú párty",
    icon: "🎯",
    gradient: "from-sky-500 to-indigo-600",
  },
  {
    screen: "never-have-i-ever",
    title: "Nikdy som nikdy",
    subtitle: "Odhaľte tajomstvá skupiny",
    icon: "🍷",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    screen: "would-you-rather",
    title: "Radšej by som...",
    subtitle: "Vyber si tú menej zlú možnosť",
    icon: "🤔",
    gradient: "from-amber-500 to-rose-600",
  },
  {
    screen: "drawing-setup",
    title: "Kreslenie Podvodníka",
    subtitle: "Každý kreslí — ale jeden nepozná tajné slovo",
    icon: "🎨",
    gradient: "from-violet-500 to-cyan-500",
  },
  {
    screen: "slovnarosada",
    title: "Slovná rošáda",
    subtitle: "Každý opisuje svoje slovo — ale rošádnik má iné",
    icon: "🃏",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    screen: "pingpong",
    title: "Slovný ping pong",
    subtitle: "Striedajte slová z kategórie, kým niekto nezaváha",
    icon: "🏓",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    screen: "hadajktosom",
    title: "Hádaj kto som",
    subtitle: "Drž telefón na čele a pýtaj sa na áno/nie",
    icon: "🎭",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    screen: "ibanepravda",
    title: "Iba nepravda",
    subtitle: "Na každú otázku musíš odpovedať klamstvom",
    icon: "🤥",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    screen: "ktodostanebombu",
    title: "Kto dostane bombu",
    subtitle: "Tikajúca bomba — podávajte rýchlo, nech nevybuchne u vás",
    icon: "💣",
    gradient: "from-orange-600 to-red-600",
  },
  {
    screen: "hadajemoji",
    title: "Hádaj emoji",
    subtitle: "Uhádni čo sa skrýva za kombináciou emoji",
    icon: "🤔",
    gradient: "from-amber-400 to-yellow-500",
  },
];

export default function Home({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <Shell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-fuchsia-400">
            Párty hry
          </p>
          <h1 className="text-3xl font-black tracking-tight">
            Kto klame? <span className="text-fuchsia-400">🎭</span>
          </h1>
        </div>
        <button
          onClick={() => onNavigate("impostor-history")}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg"
          aria-label="História hier"
        >
          📊
        </button>
      </div>

      <p className="mb-6 text-sm leading-relaxed text-white/60">
        Zábavné spoločenské hry pre partiu kamarátov. Jeden telefón, veľa
        smiechu. Nájdi podvodníka, priznaj pravdu alebo vyber tú lepšiu z
        dvoch zlých možností!
      </p>

      <div className="flex flex-col gap-4">
        {CARDS.map((card) => (
          <button
            key={card.screen}
            onClick={() => onNavigate(card.screen)}
            className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${card.gradient} p-[1px] text-left shadow-xl shadow-black/30 active:scale-[0.98] transition`}
          >
            <div
              className={`flex items-center gap-4 rounded-3xl bg-[#12101f]/90 p-5 ${
                card.big ? "min-h-[128px]" : "min-h-[92px]"
              }`}
            >
              <div
                className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} ${
                  card.big ? "h-16 w-16 text-3xl" : "h-12 w-12 text-2xl"
                } shadow-lg`}
              >
                {card.icon}
              </div>
              <div className="flex-1">
                <h2
                  className={`font-extrabold tracking-tight ${
                    card.big ? "text-xl" : "text-lg"
                  }`}
                >
                  {card.title}
                </h2>
                <p className="mt-0.5 text-xs leading-relaxed text-white/50">
                  {card.subtitle}
                </p>
              </div>
              <span className="text-white/30">›</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-xs text-white/40">
        Hraj offline, kdekoľvek — na výletoch, párty aj doma s rodinou. 🎉
      </div>
    </Shell>
  );
}
