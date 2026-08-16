import type { Screen } from "../types";
import { Icons, type IconsType } from "../components/icons";
import { Shell, TopBar } from "../components/ui";
import { GAME_WELCOMES, getFocusedArtworkPosition } from "../components/GameWelcome";
import gameArt from "../assets/game-art-sprite.jpg";
import { PLAYABLE_GAMES } from "../data/engagement";

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
  favoriteIds,
  onToggleFavorite,
}: {
  title: string;
  subtitle: string;
  games: MenuGame[];
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <Shell className="bg-[#090c14]">
      <TopBar onBack={onBack} />
      <header className="game-menu-heading relative mb-5 overflow-hidden rounded-[1.35rem] border border-white/[.08] px-5 py-5" style={{ animation: "slideUp .32s ease-out both" }}>
        <p className="relative text-[10px] font-extrabold uppercase tracking-[.24em] text-white/35">Vyberte hru</p>
        <h1 className="relative mt-2 text-4xl font-black tracking-[-.045em]">{title}</h1>
        <p className="relative mt-2 max-w-xs text-sm leading-relaxed text-white/50">{subtitle}</p>
      </header>

      <div className="grid grid-cols-1 gap-3 pb-5">
        {games.map((game, index) => {
          const welcome = GAME_WELCOMES[game.screen];
          const playable = PLAYABLE_GAMES.find((item) => item.screen === game.screen);
          const isFavorite = playable ? favoriteIds.includes(playable.id) : false;
          return (
            <article
              key={game.screen}
              className="game-menu-card group relative grid min-h-[148px] grid-cols-[44%_1fr] overflow-hidden rounded-[20px] border bg-[#111820] text-left transition duration-200 active:scale-[.99]"
              style={{
                animation: `slideUp .45s ease-out ${70 + index * 55}ms both`,
                borderColor: welcome ? `color-mix(in srgb, ${welcome.accent} 16%, rgba(255,255,255,.09))` : "rgba(255,255,255,.1)",
                boxShadow: welcome ? `0 18px 36px -32px ${welcome.accent}` : undefined,
              }}
            >
              <button type="button" onClick={() => onNavigate(game.screen)} aria-label={`Spustiť ${game.title}`} className="absolute inset-0 z-[1] rounded-[20px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300" />
              <div className="relative min-h-[148px] overflow-hidden bg-[#0c111a]">
                {welcome?.art && !welcome.artAtlas ? (
                  <img
                    src={welcome.art}
                    alt=""
                  className="absolute inset-0 h-full w-full scale-[1.14] object-cover object-[center_38%] saturate-[.82] transition duration-700 group-hover:scale-[1.18]"
                  />
                ) : welcome ? (
                  <div
                    className="absolute inset-0 scale-[1.16] origin-center bg-no-repeat transition duration-700 group-hover:scale-[1.2]"
                    style={{
                      backgroundImage: `url(${welcome.artAtlas ? welcome.art : gameArt})`,
                      backgroundSize: welcome.artSize ?? (welcome.artAtlas ? "300% 300%" : "400% 300%"),
                      backgroundPosition: getFocusedArtworkPosition(welcome.artPosition),
                    }}
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-75`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-white/10" />
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-r from-transparent to-[#111722]" />
                <span className="absolute bottom-0 left-0 top-0 w-1" style={{ background: welcome?.accent ?? "#64748b" }} />
              </div>

              <div className="relative flex min-w-0 flex-col justify-center py-4 pl-4 pr-10">
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

              {playable && <button type="button" onClick={() => onToggleFavorite(playable.id)} aria-pressed={isFavorite} aria-label={isFavorite ? `Odobrať ${game.title} z obľúbených` : `Pridať ${game.title} medzi obľúbené`} className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border transition ${isFavorite ? "border-rose-300/25 bg-rose-400/15 text-rose-300" : "border-white/[.08] bg-black/25 text-white/35 hover:text-rose-200"}`}><Icons.heart size={15} fill={isFavorite ? "currentColor" : "none"} /></button>}
            </article>
          );
        })}
      </div>
    </Shell>
  );
}
