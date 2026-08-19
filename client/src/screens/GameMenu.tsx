import type { CSSProperties } from "react";
import type { Screen } from "../types";
import type { IconsType } from "../components/icons";
import { Icon, Icons } from "../components/icons";
import { Shell, TopBar } from "../components/ui";
import { GAME_WELCOMES } from "../components/GameWelcome";
import { PLAYABLE_GAMES } from "../data/engagement";
/** Dizajn: Minihry majú stručné dvojstĺpcové karty s oddelenými ovládacími prvkami, jednotnou výškou názvov, tlmeným herným obrazom a vysokým kontrastom. */
import { gameArt } from "../media";

export interface MenuGame {
  screen: Screen;
  title: string;
  description: string;
  icon: keyof IconsType;
  color: string;
  badge?: string;
}

const MINIGAME_ACCENTS: Partial<Record<Screen, string>> = {
  "truth-or-dare": "#ff6b7a",
  "never-have-i-ever": "#34d399",
  "would-you-rather": "#f6b84f",
  slovnarosada: "#a78bfa",
  pingpong: "#2dd4bf",
  hadajktosom: "#38bdf8",
  ibanepravda: "#fb4e82",
  ktodostanebombu: "#fb923c",
  hadajemoji: "#facc15",
  zakazane: "#22c5b7",
  pesnicka: "#e879f9",
  "hudobny-kviz": "#c084fc",
  zvuk: "#60a5fa",
  pismeno: "#fbbf24",
  patzadesat: "#4ade80",
  "tic-tac-toe": "#818cf8",
  battleship: "#0ea5e9",
};

const SHORT_DESCRIPTIONS: Partial<Record<Screen, string>> = {
  "truth-or-dare": "Odváž sa alebo povedz pravdu.",
  "never-have-i-ever": "Prezraď, čo si ešte nikdy nerobil.",
  "would-you-rather": "Vyber si jednu z dvoch možností.",
  slovnarosada: "Vysvetli slovo bez jeho názvu.",
  pingpong: "Striedajte slová bez zaváhania.",
  hadajktosom: "Hádaj osobnosť podľa indícií.",
  ibanepravda: "Odpovedaj rýchlo, ale vždy nepravdivo.",
  ktodostanebombu: "Posúvaj bombu, kým nevybuchne.",
  hadajemoji: "Uhádni pojem iba z emoji.",
  zakazane: "Vysvetli slovo bez štyroch zákazov.",
  pesnicka: "Zahmkaj hit pre svoj tím.",
  "hudobny-kviz": "Spoznaj skladbu a interpreta.",
  zvuk: "Uhádni zvuk skôr než súper.",
  pismeno: "Nájdi slovo na zadané písmeno.",
  patzadesat: "Povedz päť odpovedí za desať sekúnd.",
  "tic-tac-toe": "Spoj tri znaky do jedného radu.",
  battleship: "Potop súperovu flotilu skôr než on tvoju.",
};

export default function GameMenu({ title, subtitle, games, onBack, onNavigate, favoriteIds, onToggleFavorite }: {
  title: string;
  subtitle: string;
  games: MenuGame[];
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
}) {
  const isMinigamesMenu = title === "Minihry";

  if (!isMinigamesMenu) {
    return (
      <Shell className="bg-[#090c14]">
        <TopBar onBack={onBack} />
        <header className="game-menu-heading relative mb-5 overflow-hidden rounded-[1.35rem] border border-white/[.08] px-5 py-5" style={{ animation: "slideUp .32s ease-out both" }}>
          <p className="relative text-[10px] font-extrabold uppercase tracking-[.24em] text-white/35">Vyberte hru</p>
          <h1 className="relative mt-2 text-4xl font-black tracking-[-.045em]">{title}</h1>
          <p className="relative mt-2 max-w-xs text-sm leading-relaxed text-white/50">{subtitle}</p>
        </header>
        <div className="grid grid-cols-1 gap-3 pb-5" aria-label="Výber hier Imposter">
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
                    <img src={welcome.art} alt="" className="absolute inset-0 h-full w-full object-cover saturate-[.82] transition duration-700 group-hover:scale-[1.035]" style={{ objectPosition: welcome.artPosition }} />
                  ) : welcome ? (
                    <div className="absolute inset-0 bg-no-repeat transition duration-700 group-hover:scale-[1.06]" style={{ backgroundImage: `url(${welcome.artAtlas ? welcome.art : gameArt})`, backgroundSize: welcome.artSize ?? (welcome.artAtlas ? "300% 300%" : "400% 300%"), backgroundPosition: welcome.artPosition }} />
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
                  {welcome && <p className="mb-1.5 text-[8px] font-black uppercase tracking-[.16em]" style={{ color: welcome.accent }}>{welcome.players} · {welcome.duration}</p>}
                  <p className="line-clamp-2 text-[11px] font-medium leading-[1.45] text-white/45">{game.description}</p>
                </div>
                {playable && (
                  <button type="button" onClick={() => onToggleFavorite(playable.id)} aria-pressed={isFavorite} aria-label={isFavorite ? `Odobrať ${game.title} z obľúbených` : `Pridať ${game.title} medzi obľúbené`} className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border transition ${isFavorite ? "border-rose-300/25 bg-rose-400/15 text-rose-300" : "border-white/[.08] bg-black/25 text-white/35 hover:text-rose-200"}`}>
                    <Icons.heart size={15} fill={isFavorite ? "currentColor" : "none"} />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </Shell>
    );
  }

  return (
    <Shell className="minigame-tile-shell bg-[#070b12] minigame-polish-shell">
      <TopBar onBack={onBack} />
      <header className="minigame-polish-hero" style={{ animation: "slideUp .24s cubic-bezier(.23,1,.32,1) both" }}>
        <div className="minigame-polish-hero-copy">
          <p>VYBER SI HRU</p>
          <h1>Minihry</h1>
          <span>Rýchle hry pre každú partiu</span>
        </div>
        <b className="minigame-count-pill" aria-label={`${games.length} hier`}>{games.length} hier</b>
      </header>

      <div className="minigame-polish-grid pb-6" aria-label="Výber minihier">
        {games.map((game, index) => {
          const welcome = GAME_WELCOMES[game.screen];
          const accent = MINIGAME_ACCENTS[game.screen] ?? welcome?.accent ?? "#94a3b8";
          const isFavorite = favoriteIds.includes(game.screen);
          const meta = welcome ? `${welcome.players} · ${welcome.duration}` : "2–8 hráčov · 5–15 min";
          const shortDescription = SHORT_DESCRIPTIONS[game.screen] ?? game.description;

          return (
              <article
                key={game.screen}
                className="minigame-polish-card relative"
                style={{ "--tile-accent": accent, animation: `slideUp .34s cubic-bezier(.23,1,.32,1) ${Math.min(40 + index * 38, 420)}ms both` } as CSSProperties}
              >
                <button
                  type="button"
                  onClick={() => onNavigate(game.screen)}
                  aria-label={`Spustiť ${game.title}`}
                  className="minigame-polish-launch absolute inset-0 z-10 rounded-[1.1rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tile-accent)]"
                />
                {welcome?.art && !welcome.artAtlas ? (
                  <img src={welcome.art} alt="" aria-hidden="true" className="minigame-polish-art" style={{ objectPosition: welcome.artPosition }} />
                ) : (
                  <span
                    aria-hidden="true"
                    className="minigame-polish-art"
                    style={{ backgroundImage: `url(${welcome?.artAtlas ? welcome.art : gameArt})`, backgroundSize: welcome?.artSize ?? (welcome?.artAtlas ? "300% 300%" : "400% 300%"), backgroundPosition: welcome?.artPosition ?? "50% 50%" }}
                  />
                )}
                <span aria-hidden="true" className="minigame-polish-art-shade" />
                <div className="minigame-polish-card-top">
                  <span className="minigame-polish-icon" aria-hidden="true"><Icon name={game.icon} size={22} /></span>
                  <div className="minigame-polish-card-actions">
                    <button
                      type="button"
                      onClick={(event) => { event.stopPropagation(); onToggleFavorite(game.screen); }}
                      aria-label={isFavorite ? `Odobrať ${game.title} z obľúbených` : `Pridať ${game.title} medzi obľúbené`}
                      aria-pressed={isFavorite}
                      className={`minigame-polish-favorite ${isFavorite ? "is-favorite" : ""}`}
                    >
                      <Icon name="heart" size={15} />
                    </button>
                  </div>
                </div>
                <div className="minigame-polish-copy">
                  <h2>{game.title}</h2>
                  <p className="minigame-polish-meta">{meta}</p>
                  <p className="minigame-polish-description">{shortDescription}</p>
                </div>
              </article>
          );
        })}
      </div>
    </Shell>
  );
}
