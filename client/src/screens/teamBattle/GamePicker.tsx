/**
 * Dizajn: rovnaká mriežka ako menu Minihry, aby výber v Party mode nepôsobil
 * ako iná aplikácia. Poradie hier je viditeľné priamo na kartách a potvrdenie
 * je ukotvené v spodnom páse, takže je dosiahnuteľné palcom.
 */
import { useState, type CSSProperties } from "react";
import { Icons } from "../../components/icons";
import { GAME_LABELS, type GameType } from "../../data/teamBattle";
import {
  fiveTenGameHero,
  gameArt,
  letterGameHero,
  minigameArtAtlas,
  partyMinigameAtlas,
  quizBattleArt,
  songGameHero,
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

const GAME_META: Record<GameType, { accent: string }> = {
  pantomima: { accent: "#f59e0b" },
  sarady: { accent: "#8b5cf6" },
  zakazane: { accent: "#f43f5e" },
  pesnicka: { accent: "#d946ef" },
  "hudobny-kviz": { accent: "#c084fc" },
  zvuk: { accent: "#06b6d4" },
  pismeno: { accent: "#fb923c" },
  patzadesat: { accent: "#22c55e" },
  hadajktosom: { accent: "#38bdf8" },
  quiz: { accent: "#fbbf24" },
  pingpong: { accent: "#34d399" },
};

const GAME_ART: Record<
  GameType,
  { src: string; position: string; size: string }
> = {
  pantomima: {
    src: partyMinigameAtlas,
    position: "33.333% 100%",
    size: "400% 300%",
  },
  sarady: { src: partyMinigameAtlas, position: "0% 100%", size: "400% 300%" },
  zakazane: { src: gameArt, position: "100% 0%", size: "400% 300%" },
  pesnicka: { src: songGameHero, position: "50% 50%", size: "cover" },
  "hudobny-kviz": {
    src: partyMinigameAtlas,
    position: "66.667% 50%",
    size: "400% 300%",
  },
  zvuk: { src: partyMinigameAtlas, position: "100% 50%", size: "400% 300%" },
  pismeno: { src: letterGameHero, position: "50% 50%", size: "cover" },
  patzadesat: { src: fiveTenGameHero, position: "50% 50%", size: "cover" },
  hadajktosom: {
    src: partyMinigameAtlas,
    position: "66.667% 100%",
    size: "400% 300%",
  },
  quiz: { src: quizBattleArt, position: "50% 50%", size: "cover" },
  pingpong: { src: minigameArtAtlas, position: "50% 50%", size: "300% 300%" },
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
    <main className="ui ui-screen scroll-panel">
      <div className="ui-wrap ui-wrap-dock-gap">
        <div className="ui-bar">
          <button type="button" onClick={onBack} aria-label="Späť" className="ui-back">
            <Icons.arrowLeft size={19} />
          </button>
          <span className="ui-bar-title">Party mode</span>
          <span className="ui-bar-note">{count} vybraných</span>
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
                    "--tile-accent": GAME_META[game].accent,
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
          <span className="ui-dock-note">
            {count === 0
              ? "Vyber aspoň jednu hru"
              : `${count} ${count === 1 ? "minihra" : count < 5 ? "minihry" : "minihier"}`}
          </span>
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
