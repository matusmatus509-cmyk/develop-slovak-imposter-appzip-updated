/**
 * Dizajn: rovnaká mriežka ako menu Minihry, aby výber v Party mode nepôsobil
 * ako iná aplikácia. Poradie hier je viditeľné priamo na kartách a potvrdenie
 * je ukotvené v spodnom páse, takže je dosiahnuteľné palcom.
 *
 * Farby dlaždíc chodia z krátkej kurátorovanej palety v modro-červenej rodine
 * Party modu — striedavo chladný a teplý odtieň, takže mriežka pripomína súboj
 * dvoch strán. Pôvodne mala každá z jedenástich hier vlastný akcent vrátane
 * jantárovej, oranžovej a zelenej; tie s ostatnými nemali žiadny vzťah a
 * mriežka pôsobila ako vzorkovník.
 *
 * Vybraná hra sa nepozná podľa farby (tú má každá dlaždica), ale podľa plného
 * rámu, stlmeného obrázka a poradového čísla.
 */
import { useState, type CSSProperties } from "react";
import { Icons } from "../../components/icons";
import { GAME_LABELS, type GameType } from "../../data/teamBattle";
import {
  charadesGameHero,
  fiveTenGameHeroV3,
  forbiddenWordGameHero,
  letterGameHeroV3,
  musicQuizGameHero,
  pantomimaGameHero,
  partyMinigameAtlas,
  pingPongGameHero,
  quizBattleArt,
  songGameHeroV3,
  soundGameHero,
} from "../../media";

const ALL_GAMES: GameType[] = [
  "pantomima",
  "sarady",
  "zakazane",
  "pesnicka",
  "hudobny-kviz",
  "zvuk",
  "pismeno",
  "patzadesat",
  "hadajktosom",
  "quiz",
  "pingpong",
];

/**
 * Kurátorovaná paleta. Poradie je zvolené tak, aby dve susedné dlaždice v
 * dvojstĺpcovej mriežke nikdy nemali ten istý odtieň.
 */
const TILE_PALETTE = [
  "#4f9bff", // modrá — akcent Party modu
  "#ff6b6b", // červená — protihráč
  "#38bdf8", // nebeská
  "#fb7185", // ružovo-červená
  "#6366f1", // indigová
] as const;

function tileAccent(game: GameType) {
  return TILE_PALETTE[ALL_GAMES.indexOf(game) % TILE_PALETTE.length];
}

const GAME_ART: Record<
  GameType,
  { src: string; position: string; size: string }
> = {
  pantomima: { src: pantomimaGameHero, position: "50% 50%", size: "cover" },
  sarady: { src: charadesGameHero, position: "50% 50%", size: "cover" },
  zakazane: { src: forbiddenWordGameHero, position: "50% 50%", size: "cover" },
  pesnicka: { src: songGameHeroV3, position: "50% 50%", size: "cover" },
  "hudobny-kviz": {
    src: musicQuizGameHero,
    position: "50% 50%",
    size: "cover",
  },
  zvuk: { src: soundGameHero, position: "50% 50%", size: "cover" },
  pismeno: { src: letterGameHeroV3, position: "50% 50%", size: "cover" },
  patzadesat: { src: fiveTenGameHeroV3, position: "50% 50%", size: "cover" },
  hadajktosom: {
    src: partyMinigameAtlas,
    position: "66.667% 100%",
    size: "400% 300%",
  },
  quiz: { src: quizBattleArt, position: "50% 50%", size: "cover" },
  pingpong: { src: pingPongGameHero, position: "50% 50%", size: "cover" },
};

export default function TeamBattleGamePicker({
  initialSelectedGames,
  onBack,
  onConfirm,
}: {
  initialSelectedGames: GameType[];
  onBack: () => void;
  onConfirm: (games: GameType[]) => void;
}) {
  const [selectedGames, setSelectedGames] =
    useState<GameType[]>(initialSelectedGames);

  function toggleGame(game: GameType) {
    setSelectedGames(current =>
      current.includes(game)
        ? current.filter(selectedGame => selectedGame !== game)
        : [...current, game]
    );
  }

  const count = selectedGames.length;

  return (
    <main className="ui ui-party ui-screen scroll-panel">
      <div className="ui-wrap ui-wrap-dock-gap">
        <div className="ui-bar">
          <button type="button" onClick={onBack} aria-label="Späť" className="ui-back">
            <Icons.arrowLeft size={19} />
          </button>
          {/* Počet vybraných nesie spodný pás — v hlavičke by sa bil s
              tlačidlom „Odísť z hry", ktoré tam kreslí rám aplikácie. */}
          <span className="ui-bar-title">Party mode</span>
        </div>

        <header className="ui-head">
          <h1 className="ui-title">Vyber minihry</h1>
          <p className="ui-lead">
            Ťukaj na hry v poradí, v akom ich chcete hrať. Posledná bude finále
            s trojnásobnými bodmi.
          </p>
        </header>

        <div className="ui-grid" aria-label="Výber minihier do Party modu">
          {ALL_GAMES.map((game, index) => {
            const order = selectedGames.indexOf(game);
            const selected = order >= 0;
            const art = GAME_ART[game];
            return (
              <article
                key={game}
                className={`ui-tile ui-pick ${selected ? "is-picked" : ""}`}
                style={
                  {
                    "--tile-accent": tileAccent(game),
                    animation: `slideUp .3s ease-out ${Math.min(index * 28, 280)}ms both`,
                  } as CSSProperties
                }
              >
                <button
                  type="button"
                  onClick={() => toggleGame(game)}
                  aria-label={`${selected ? "Zrušiť výber" : "Vybrať"} ${GAME_LABELS[game]}`}
                  aria-pressed={selected}
                  className="ui-tile-hit"
                />
                <span
                  aria-hidden="true"
                  className="ui-tile-art"
                  style={{
                    backgroundImage: `url(${art.src})`,
                    backgroundPosition: art.position,
                    backgroundSize: art.size,
                  }}
                />
                <span aria-hidden="true" className="ui-tile-veil" />
                {/* Poradie je jediný ukazovateľ výberu — číslo nesie informáciu. */}
                {selected && <span className="ui-pick-order">{order + 1}</span>}
                {/* Posledná vybraná hra je finále za trojnásobné body. */}
                {selected && order === count - 1 && count > 1 && (
                  <span className="ui-pick-final">FINÁLE ×3</span>
                )}
                <div className="ui-tile-copy">
                  <h2>{GAME_LABELS[game]}</h2>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="ui-dock">
        <div className="ui-dock-inner">
          {count === 0 ? (
            <span className="ui-dock-note">Vyber aspoň jednu hru</span>
          ) : (
            <button
              type="button"
              onClick={() => setSelectedGames([])}
              className="ui-dock-note"
              style={{ textAlign: "left", textDecoration: "underline", textDecorationColor: "rgba(255,255,255,.25)", textUnderlineOffset: "3px" }}
            >
              {count} {count === 1 ? "minihra" : count < 5 ? "minihry" : "minihier"}
              <span style={{ opacity: 0.55 }}> · zrušiť výber</span>
            </button>
          )}
          <button
            type="button"
            disabled={count === 0}
            onClick={() => onConfirm(selectedGames)}
            className="ui-cta ui-cta-compact shrink-0"
          >
            <span>Hrať</span>
            <span className="ui-cta-arrow" aria-hidden="true">
              <Icons.chevronRight size={17} />
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
