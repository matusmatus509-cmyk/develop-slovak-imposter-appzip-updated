import { useState, useEffect } from "react";
import type { Screen } from "../types";
import { Shell } from "../components/ui";
import { Icons, type IconsType } from "../components/icons";
import { cn } from "../utils/designTokens";

interface GameCard {
  screen: Screen;
  title: string;
  subtitle: string;
  icon: keyof IconsType;
  gradient: string;
  glow: string;
  big?: boolean;
}

const CARDS: GameCard[] = [
  {
    screen: "teambattle",
    title: "Tímová párty bitka",
    subtitle: "Dva tímy súperia v pantomíme, šarádach, kvíze a ďalších minihierach",
    icon: "users",
    gradient: "from-purple-600 via-violet-500 to-indigo-600",
    glow: "rgba(139, 92, 246, 0.4)",
    big: true,
  },
  {
    screen: "impostor-setup",
    title: "Podvodník",
    subtitle: "Nájdi podvodníka v skupine skôr, než nájde tajné slovo on teba",
    icon: "userCheck",
    gradient: "from-orange-500 via-pink-500 to-fuchsia-600",
    glow: "rgba(236, 72, 153, 0.4)",
    big: true,
  },
  {
    screen: "truth-or-dare",
    title: "Pravda alebo výzva",
    subtitle: "Klasika na každú párty",
    icon: "target",
    gradient: "from-sky-500 to-indigo-600",
    glow: "rgba(99, 102, 241, 0.35)",
  },
  {
    screen: "never-have-i-ever",
    title: "Nikdy som nikdy",
    subtitle: "Odhaľte tajomstvá skupiny",
    icon: "wine",
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16, 185, 129, 0.35)",
  },
  {
    screen: "would-you-rather",
    title: "Radšej by som...",
    subtitle: "Vyber si tú menej zlú možnosť",
    icon: "brain",
    gradient: "from-amber-500 to-rose-600",
    glow: "rgba(244, 63, 94, 0.35)",
  },
  {
    screen: "drawing-setup",
    title: "Kreslenie Podvodníka",
    subtitle: "Každý kreslí — ale jeden nepozná tajné slovo",
    icon: "paintbrush",
    gradient: "from-violet-500 to-cyan-500",
    glow: "rgba(6, 182, 212, 0.35)",
  },
  {
    screen: "slovnarosada",
    title: "Slovná rošáda",
    subtitle: "Každý opisuje svoje slovo — ale rošádnik má iné",
    icon: "gamepad",
    gradient: "from-purple-500 to-indigo-600",
    glow: "rgba(139, 92, 246, 0.35)",
  },
  {
    screen: "pingpong",
    title: "Slovný ping pong",
    subtitle: "Striedajte slová z kategórie, kým niekto nezaváha",
    icon: "rotateCcw",
    gradient: "from-green-500 to-emerald-600",
    glow: "rgba(16, 185, 129, 0.35)",
  },
  {
    screen: "hadajktosom",
    title: "Hádaj kto som",
    subtitle: "Drž telefón na čele a pýtaj sa na áno/nie",
    icon: "user",
    gradient: "from-cyan-500 to-blue-600",
    glow: "rgba(59, 130, 246, 0.35)",
  },
  {
    screen: "ibanepravda",
    title: "Iba nepravda",
    subtitle: "Na každú otázku musíš odpovedať klamstvom",
    icon: "messageSquare",
    gradient: "from-rose-500 to-pink-600",
    glow: "rgba(236, 72, 153, 0.35)",
  },
  {
    screen: "ktodostanebombu",
    title: "Kto dostane bombu",
    subtitle: "Tikajúca bomba — podávajte rýchlo, nech nevybuchne u vás",
    icon: "zap",
    gradient: "from-orange-600 to-red-600",
    glow: "rgba(239, 68, 68, 0.35)",
  },
  {
    screen: "hadajemoji",
    title: "Hádaj emoji",
    subtitle: "Uhádni čo sa skrýva za kombináciou emoji",
    icon: "smile",
    gradient: "from-amber-400 to-yellow-500",
    glow: "rgba(245, 158, 11, 0.35)",
  },
];

const Sparkles = Icons.sparkles;

function GameCardComponent({ card, index, onClick }: { card: GameCard; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const IconComponent = Icons[card.icon];

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => { setPressed(false); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      className={cn(
        "group relative overflow-hidden rounded-3xl p-[1.5px] text-left",
        "bg-gradient-to-br",
        card.gradient,
        "shadow-xl transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0a1a]",
        hovered && "scale-[1.03] shadow-2xl",
        pressed && "scale-[0.97]",
      )}
      style={{
        boxShadow: hovered ? `0 12px 40px -8px ${card.glow}` : `0 6px 20px -6px ${card.glow}`,
        animation: `scaleIn 0.5s ease-out ${index * 60}ms both`,
      }}
    >
      {/* Inner content */}
      <div
        className={cn(
          "flex items-center gap-4 rounded-[22px] bg-[#12101f]/95 px-4 py-4",
          "transition-opacity duration-300",
          card.big ? "py-6" : "py-3.5",
        )}
      >
        {/* Icon box */}
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg",
            card.gradient,
            "transition-transform duration-300",
            card.big ? "h-16 w-16" : "h-12 w-12",
            hovered && "scale-110 rotate-3",
            pressed && "scale-95",
          )}
        >
          {IconComponent && <IconComponent size={card.big ? 30 : 24} className="text-white" />}
        </div>

        {/* Title + subtitle */}
        <div className="flex-1 min-w-0 text-left">
          <h2
            className={cn(
              "font-extrabold tracking-tight truncate text-white",
              card.big ? "text-xl" : "text-base",
            )}
          >
            {card.title}
          </h2>
          <p className="mt-0.5 text-xs leading-snug text-white/50 truncate font-medium">
            {card.subtitle}
          </p>
        </div>

        {/* Arrow */}
        <div
          className={cn(
            "shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/30",
            "transition-all duration-300",
            hovered && "bg-white/20 text-white scale-110",
          )}
        >
          <Icons.chevronRight size={18} />
        </div>
      </div>

      {/* Shine overlay on hover */}
      {hovered && (
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-20"
          style={{
            background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
          }}
        />
      )}
    </button>
  );
}

export default function Home({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <Shell>
      {/* Header */}
      <div
        className="mb-5 flex items-center justify-between"
        style={{ animation: "fadeIn 0.6s ease-out" }}
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-fuchsia-400/80">
            Párty hry
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight flex items-center gap-2">
            <span className="text-gradient">Kto klame?</span>
            <Sparkles size={26} className="text-fuchsia-400 animate-pulse" />
          </h1>
        </div>
        <button
          onClick={() => onNavigate("impostor-history")}
          aria-label="História hier"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-white/60 transition-all hover:bg-white/15 hover:text-white hover:scale-105 active:scale-95"
        >
          <Icons.history size={20} />
        </button>
      </div>

      {/* Intro text */}
      <p
        className="mb-6 text-sm leading-relaxed text-white/55 max-w-xs"
        style={{ animation: "fadeIn 0.8s ease-out" }}
      >
        Zábavné spoločenské hry pre partiu kamarátov. Jeden telefón, veľa smiechu.
      </p>

      {/* Cards list */}
      <div className="flex flex-col gap-3.5">
        {CARDS.map((card, index) => (
          mounted && (
            <GameCardComponent
              key={card.screen}
              card={card}
              index={index}
              onClick={() => onNavigate(card.screen)}
            />
          )
        ))}
      </div>

      {/* Footer */}
      <div
        className="mt-8 rounded-2xl glass p-4 text-center text-xs text-white/35"
        style={{ animation: "fadeIn 1s ease-out" }}
      >
        <span className="font-semibold">Hraj offline, kdekoľvek</span> — na výletoch, párty aj doma s rodinou. 🎉
      </div>

      {/* Floating decorative blobs */}
      <div className="pointer-events-none fixed bottom-[-20px] right-[-20px] h-40 w-40 rounded-full bg-fuchsia-600/10 blur-3xl animate-float" />
      <div className="pointer-events-none fixed top-1/2 left-[-40px] h-32 w-32 rounded-full bg-indigo-600/10 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
    </Shell>
  );
}
