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
              className="group relative min-h-[106px] overflow-hidden rounded-[26px] border bg-[#101722]/92 p-3.5 text-left shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[.985]"
              style={{
                animation: `slideUp .45s ease-out ${70 + index * 55}ms both`,
                borderColor: welcome ? `color-mix(in srgb, ${welcome.accent} 28%, transparent)` : "rgba(255,255,255,.11)",
                boxShadow: welcome ? `0 18px 38px -30px ${welcome.accent}` : undefined,
              }}
            >
              {(welcome || game.image) && (
                <>
                  {welcome ? (
                    <div
                      className="absolute inset-y-0 right-0 h-full w-[58%] bg-no-repeat opacity-30 saturate-[.78] transition duration-500 group-hover:scale-105 group-hover:opacity-44"
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
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,#101722_0%,rgba(16,23,34,.98)_55%,rgba(16,23,34,.62)_100%)]" />
                </>
              )}
              {welcome && (
                <div
                  className="absolute inset-y-4 left-0 w-[3px] rounded-r-full opacity-80"
                  style={{ background: welcome.accent, boxShadow: `0 0 14px ${welcome.accent}` }}
                />
              )}
              <div className="relative flex items-center gap-3.5">
                {welcome ? (
                  <div
                    className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[21px] border border-white/15 bg-no-repeat shadow-xl transition duration-500 group-hover:scale-[1.045] group-hover:rotate-[-1deg]"
                    style={{
                      backgroundImage: `url(${gameArt})`,
                      backgroundSize: "400% 300%",
                      backgroundPosition: welcome.artPosition,
                      boxShadow: `0 12px 28px -16px ${welcome.accent}`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/10" />
                    <span
                      className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-[10px] border border-white/20 text-white shadow-lg backdrop-blur-md"
                      style={{ background: `color-mix(in srgb, ${welcome.accent} 78%, #111827)` }}
                    >
                      <Icon size={15} />
                    </span>
                    <div className="absolute inset-0 translate-x-[-130%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[130%]" />
                  </div>
                ) : (
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br ${game.color} shadow-lg transition duration-300 group-hover:scale-105`}>
                    <Icon size={27} className="text-white" />
                  </div>
                )}
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
