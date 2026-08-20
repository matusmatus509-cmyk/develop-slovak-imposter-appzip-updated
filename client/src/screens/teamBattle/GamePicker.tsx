/** Dizajn: Samostatný Párty výber používa aktuálne hero obrázky menu Minihry; poradie je viditeľné priamo na kartách a potvrdenie hru spustí. */
import { useState, type CSSProperties } from "react";
import { Shell, TopBar } from "../../components/ui";
import { GAME_LABELS, type GameType } from "../../data/teamBattle";
import { fiveTenGameHero, forbiddenWordGameHero, letterGameHero, minigameArtAtlas, musicQuizGameHero, partyMinigameAtlas, quizBattleArt, songGameHero } from "../../media";

const ALL_GAMES: GameType[] = [
  "pantomima", "sarady", "zakazane", "pesnicka", "hudobny-kviz", "zvuk",
  "pismeno", "patzadesat", "hadajktosom", "quiz", "pingpong",
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

const GAME_ART: Record<GameType, { src: string; position: string; size: string }> = {
  pantomima: { src: partyMinigameAtlas, position: "33.333% 100%", size: "400% 300%" },
  sarady: { src: partyMinigameAtlas, position: "0% 100%", size: "400% 300%" },
  zakazane: { src: forbiddenWordGameHero, position: "50% 56%", size: "cover" },
  pesnicka: { src: songGameHero, position: "50% 50%", size: "cover" },
  "hudobny-kviz": { src: musicQuizGameHero, position: "50% 50%", size: "cover" },
  zvuk: { src: partyMinigameAtlas, position: "100% 50%", size: "400% 300%" },
  pismeno: { src: letterGameHero, position: "50% 50%", size: "cover" },
  patzadesat: { src: fiveTenGameHero, position: "50% 50%", size: "cover" },
  hadajktosom: { src: partyMinigameAtlas, position: "66.667% 100%", size: "400% 300%" },
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
  const [selectedGames, setSelectedGames] = useState<GameType[]>(initialSelectedGames);

  function toggleGame(game: GameType) {
    setSelectedGames((current) => current.includes(game)
      ? current.filter((selectedGame) => selectedGame !== game)
      : [...current, game]);
  }

  return (
    <Shell className="minigame-tile-shell party-game-picker-screen">
      <TopBar onBack={onBack} />
      <header className="minigame-tile-header" style={{ animation: "slideUp .22s cubic-bezier(.23,1,.32,1) both" }}>
        <div><p>PÁRTY MÓD</p><h1>Vyber minihry</h1></div>
        <span>{selectedGames.length}</span>
      </header>

      <p className="party-picker-intro">Ťukaj na hry v poradí, v akom ich chceš hrať. Posledná bude finále s trojnásobnými bodmi.</p>

      <div className="minigame-tile-grid pb-5" aria-label="Výber minihier do Párty módu">
        {ALL_GAMES.map((game, index) => {
          const order = selectedGames.indexOf(game);
          const selected = order >= 0;
          const art = GAME_ART[game];
          return (
            <article
              key={game}
              className={`minigame-tile group relative overflow-hidden ${selected ? "is-party-selected" : ""}`}
              style={{ "--tile-accent": GAME_META[game].accent, animation: `slideUp .32s cubic-bezier(.23,1,.32,1) ${Math.min(35 + index * 22, 260)}ms both` } as CSSProperties}
            >
              <button
                type="button"
                onClick={() => toggleGame(game)}
                aria-label={`${selected ? "Zrušiť výber" : "Vybrať"} ${GAME_LABELS[game]}`}
                aria-pressed={selected}
                className="absolute inset-0 z-10 rounded-[1.1rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tile-accent)]"
              />
              <span
                className="absolute inset-0 scale-[1.04] bg-no-repeat transition duration-500 group-hover:scale-[1.1]"
                style={{ backgroundImage: `url(${art.src})`, backgroundPosition: art.position, backgroundSize: art.size }}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-[#070b12]/95 via-[#070b12]/18 to-transparent" />
              <span className="minigame-tile-edge" />
              {selected && <span className="party-picker-order">{order + 1}</span>}
              <h2>{GAME_LABELS[game]}</h2>
            </article>
          );
        })}
      </div>

      <div className="party-picker-footer">
        <span>{selectedGames.length === 0 ? "Vyber aspoň jednu hru" : `${selectedGames.length} ${selectedGames.length === 1 ? "minihra" : selectedGames.length < 5 ? "minihry" : "minihier"}`}</span>
        <button type="button" disabled={selectedGames.length === 0} onClick={() => onConfirm(selectedGames)}>
          Hotovo a hrať
        </button>
      </div>
    </Shell>
  );
}
