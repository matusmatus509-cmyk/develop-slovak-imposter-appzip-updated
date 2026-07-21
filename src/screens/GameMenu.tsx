import type { Screen } from "../types";
import { Icons, type IconsType } from "../components/icons";
import { Shell, TopBar } from "../components/ui";
import { GAME_WELCOMES } from "../components/GameWelcome";
import gameArt from "../assets/game-art-sprite.jpg";

export interface MenuGame {
  screen: Screen;
  title: string;
  description: string;
  icon: keyof IconsType;
  color: string;
  badge?: string;
  image?: string;
  imagePosition?: string;
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
              className="group relative min-h-[94px] overflow-hidden rounded-[24px] border border-white/[.11] bg-[#111824]/88 p-4 text-left shadow-xl shadow-black/15 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/20 active:translate-y-0 active:scale-[.985]"
              style={{ animation: `slideUp .45s ease-out ${70 + index * 55}ms both` }}
            >
              {(welcome || game.image) && (
                <>
                  {welcome ? (
                    <div
                      className="absolute inset-y-0 right-0 h-full w-[52%] bg-no-repeat opacity-55 saturate-[.86] transition duration-500 group-hover:scale-105 group-hover:opacity-72"
                      style={{
                        backgroundImage: `url(${gameArt})`,
                        backgroundSize: "400% 300%",
                        backgroundPosition: welcome.artPosition,
                      }}
                    />
                  ) : (
                    <img
                      src={game.image}
                      alt=""
                      className="absolute inset-y-0 right-0 h-full w-[48%] object-cover opacity-48 saturate-[.82] transition duration-500 group-hover:scale-105 group-hover:opacity-62"
                      style={{ objectPosition: game.imagePosition ?? "center" }}
                    />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,#111824_0%,rgba(17,24,36,.98)_48%,rgba(17,24,36,.48)_100%)]" />
                </>
              )}
              <div className="relative flex items-center gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br ${game.color} shadow-lg transition duration-300 group-hover:scale-105`}>
                  <Icon size={27} className="text-white" />
                </div>
                <div className="min-w-0 flex-1 pr-2">
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
