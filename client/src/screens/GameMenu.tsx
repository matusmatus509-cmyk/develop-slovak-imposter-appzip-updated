import type { CSSProperties } from "react";
import type { Screen } from "../types";
import type { IconsType } from "../components/icons";
import { Icon, Icons } from "../components/icons";
import { GAME_WELCOMES } from "../components/GameWelcome";
import { PLAYABLE_GAMES } from "../data/engagement";
/**
 * Dizajn: farbu nesie obraz hry a jej akcent na ikone. Chróm okolo je teplá
 * neutrálna tmavá — bez fialových gradientov, žiar a dekoratívnych orbov.
 */
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

/** Obraz hry — buď samostatný súbor, alebo výrez z atlasu. */
function gameArtStyle(welcome: (typeof GAME_WELCOMES)[Screen]): CSSProperties {
  return {
    backgroundImage: `url(${welcome?.artAtlas ? welcome.art : gameArt})`,
    backgroundSize:
      welcome?.artSize ?? (welcome?.artAtlas ? "300% 300%" : "400% 300%"),
    backgroundPosition: welcome?.artPosition ?? "50% 50%",
  };
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
  const isMinigamesMenu = title === "Minihry";

  // ── Imposter menu: málo hier, preto široké karty v jednom stĺpci ──────
  if (!isMinigamesMenu) {
    return (
      <main className="ui ui-screen scroll-panel">
        <div className="ui-wrap">
          <div className="ui-bar">
            <button type="button" onClick={onBack} aria-label="Späť" className="ui-back">
              <Icons.arrowLeft size={19} />
            </button>
            <span className="ui-bar-title">Späť na úvod</span>
          </div>

          <header className="ui-head">
            <h1 className="ui-title">{title}</h1>
            <p className="ui-lead">{subtitle}</p>
          </header>

          <div className="grid gap-[var(--ui-gap)] pb-6" aria-label="Výber hier Imposter">
            {games.map((game, index) => {
              const welcome = GAME_WELCOMES[game.screen];
              const playable = PLAYABLE_GAMES.find(item => item.screen === game.screen);
              const isFavorite = playable ? favoriteIds.includes(playable.id) : false;
              const accent = welcome?.accent ?? "#94a3b8";

              return (
                <article
                  key={game.screen}
                  className="ui-list-card"
                  style={
                    {
                      "--tile-accent": accent,
                      animation: `slideUp .3s ease-out ${index * 45}ms both`,
                    } as CSSProperties
                  }
                >
                  <button
                    type="button"
                    onClick={() => onNavigate(game.screen)}
                    aria-label={`Otvoriť ${game.title}`}
                    className="ui-tile-hit"
                  />
                  <div className="ui-list-art">
                    {welcome?.art && !welcome.artAtlas ? (
                      <img
                        src={welcome.art}
                        alt=""
                        aria-hidden="true"
                        style={{ objectPosition: welcome.artPosition }}
                      />
                    ) : (
                      <span aria-hidden="true" style={gameArtStyle(welcome)} />
                    )}
                  </div>
                  <div className="ui-list-body">
                    <div className="flex min-w-0 items-center gap-2">
                      <h2 className="truncate">{game.title}</h2>
                      {game.badge && (
                        <span className="ui-bar-note shrink-0 !px-2 !py-0.5 !text-[0.62rem]">
                          {game.badge}
                        </span>
                      )}
                    </div>
                    {welcome && (
                      <p className="ui-list-meta">
                        {welcome.players} · {welcome.duration}
                      </p>
                    )}
                    <p className="ui-list-desc">{game.description}</p>
                  </div>
                  {playable && (
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(playable.id)}
                      aria-pressed={isFavorite}
                      aria-label={
                        isFavorite
                          ? `Odobrať ${game.title} z obľúbených`
                          : `Pridať ${game.title} medzi obľúbené`
                      }
                      className={`ui-tile-fav absolute right-2.5 top-2.5 ${isFavorite ? "is-on" : ""}`}
                    >
                      <Icons.heart size={14} />
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  // ── Minihry: veľa hier, preto kompaktná dvojstĺpcová mriežka ─────────
  return (
    <main className="ui ui-screen scroll-panel">
      <div className="ui-wrap">
        <div className="ui-bar">
          <button type="button" onClick={onBack} aria-label="Späť" className="ui-back">
            <Icons.arrowLeft size={19} />
          </button>
          <span className="ui-bar-title">Späť na úvod</span>
          <span className="ui-bar-note">{games.length} hier</span>
        </div>

        <header className="ui-head">
          <h1 className="ui-title">Minihry</h1>
          <p className="ui-lead">
            Rýchle hry pre každú partiu. Stačí telefón a chuť sa zabaviť.
          </p>
        </header>

        <div className="ui-grid pb-6" aria-label="Výber minihier">
          {games.map((game, index) => {
            const welcome = GAME_WELCOMES[game.screen];
            const accent = MINIGAME_ACCENTS[game.screen] ?? welcome?.accent ?? "#94a3b8";
            const isFavorite = favoriteIds.includes(game.screen);
            const meta = welcome
              ? `${welcome.players} · ${welcome.duration}`
              : "2–8 hráčov · 5–15 min";
            const shortDescription = SHORT_DESCRIPTIONS[game.screen] ?? game.description;

            return (
              <article
                key={game.screen}
                className="ui-tile"
                style={
                  {
                    "--tile-accent": accent,
                    animation: `slideUp .3s ease-out ${Math.min(index * 32, 320)}ms both`,
                  } as CSSProperties
                }
              >
                <button
                  type="button"
                  onClick={() => onNavigate(game.screen)}
                  aria-label={`Spustiť ${game.title}`}
                  className="ui-tile-hit"
                />
                {welcome?.art && !welcome.artAtlas ? (
                  <img
                    src={welcome.art}
                    alt=""
                    aria-hidden="true"
                    className="ui-tile-art"
                    style={{ objectPosition: welcome.artPosition }}
                  />
                ) : (
                  <span aria-hidden="true" className="ui-tile-art" style={gameArtStyle(welcome)} />
                )}
                <span aria-hidden="true" className="ui-tile-veil" />

                <div className="ui-tile-top">
                  <span className="ui-tile-icon" aria-hidden="true">
                    <Icon name={game.icon} size={19} />
                  </span>
                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation();
                      onToggleFavorite(game.screen);
                    }}
                    aria-pressed={isFavorite}
                    aria-label={
                      isFavorite
                        ? `Odobrať ${game.title} z obľúbených`
                        : `Pridať ${game.title} medzi obľúbené`
                    }
                    className={`ui-tile-fav ${isFavorite ? "is-on" : ""}`}
                  >
                    <Icon name="heart" size={14} />
                  </button>
                </div>

                <div className="ui-tile-copy">
                  <h2>{game.title}</h2>
                  <p className="ui-tile-meta">{meta}</p>
                  <p className="ui-tile-desc">{shortDescription}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
