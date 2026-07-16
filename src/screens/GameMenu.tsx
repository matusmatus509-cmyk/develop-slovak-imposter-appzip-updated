import type { Screen } from "../types";
import { Icons, type IconsType } from "../components/icons";
import { Shell, TopBar } from "../components/ui";

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
          return (
            <button
              key={game.screen}
              type="button"
              onClick={() => onNavigate(game.screen)}
              className="group relative overflow-hidden rounded-[24px] border border-white/[.09] bg-white/[.045] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[.07] active:translate-y-0 active:scale-[.985]"
              style={{ animation: `slideUp .45s ease-out ${70 + index * 55}ms both` }}
            >
              <div className="relative flex items-center gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br ${game.color} shadow-lg transition duration-300 group-hover:scale-105`}>
                  <Icon size={27} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-base font-extrabold tracking-tight">{game.title}</h2>
                    {game.badge && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white/55">{game.badge}</span>}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-white/43">{game.description}</p>
                </div>
                <Icons.chevronRight size={19} className="shrink-0 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
              </div>
            </button>
          );
        })}
      </div>
    </Shell>
  );
}
