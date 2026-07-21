import type { Screen } from "../types";
import { Icons, type IconsType } from "../components/icons";
import { Shell, TopBar } from "../components/ui";
import { GAME_WELCOMES } from "../components/GameWelcome";

export interface MenuGame {
  screen: Screen;
  title: string;
  description: string;
  icon: keyof IconsType;
  color: string;
  badge?: string;
}

export default function GameMenu({
  title,
  subtitle,
  games,
  onBack,
  onNavigate,
}: {
  title: string;
  subtitle: string;
  games: MenuGame[];
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <Shell className="bg-[#090c14]">
      <TopBar onBack={onBack} />
      <header className="mb-7" style={{ animation: "slideUp .45s ease-out both" }}>
        <p className="text-[10px] font-extrabold uppercase tracking-[.24em] text-white/35">Vyberte hru</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-.045em]">{title}</h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">{subtitle}</p>
      </header>

      <div className="grid grid-cols-1 gap-3 pb-5">
        {games.map((game, index) => {
          const Icon = Icons[game.icon];
          const welcome = GAME_WELCOMES[game.screen];
          return (
            <button
              key={game.screen}
              type="button"
              onClick={() => onNavigate(game.screen)}
              className="group relative flex min-h-[112px] items-center gap-4 overflow-hidden rounded-[26px] border bg-[#111722] px-4 py-4 text-left shadow-xl shadow-black/25 transition duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[.985]"
              style={{
                animation: `slideUp .45s ease-out ${70 + index * 55}ms both`,
                borderColor: welcome ? `color-mix(in srgb, ${welcome.accent} 25%, rgba(255,255,255,.08))` : "rgba(255,255,255,.1)",
                boxShadow: welcome ? `0 20px 44px -34px ${welcome.accent}` : undefined,
              }}
            >
              <div
                className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-gradient-to-br ${game.color} text-white shadow-lg transition duration-300 group-hover:scale-105`}
                style={{ boxShadow: welcome ? `0 14px 28px -18px ${welcome.accent}` : undefined }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.2),transparent_45%,rgba(0,0,0,.18))]" />
                <Icon size={25} className="relative" />
              </div>

              <div className="relative flex min-w-0 flex-1 flex-col justify-center pr-8">
                <div className="mb-1.5 flex min-w-0 items-center gap-2">
                  <h2 className="truncate text-[15px] font-black tracking-[-.015em] text-white">{game.title}</h2>
                  {game.badge && <span className="shrink-0 rounded-full border border-white/10 bg-white/[.07] px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white/55">{game.badge}</span>}
                </div>
                {welcome && (
                  <p className="mb-1.5 text-[8px] font-black uppercase tracking-[.16em]" style={{ color: welcome.accent }}>
                    {welcome.players} · {welcome.duration}
                  </p>
                )}
                <p className="line-clamp-2 text-[11px] font-medium leading-[1.45] text-white/45">{game.description}</p>
              </div>

              <span className="absolute right-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/[.08] bg-white/[.045] text-white/30 transition group-hover:translate-x-0.5 group-hover:border-white/15 group-hover:bg-white/[.09] group-hover:text-white/80">
                <Icons.chevronRight size={17} />
              </span>
            </button>
          );
        })}
      </div>
    </Shell>
  );
}
