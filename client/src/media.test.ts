import { describe, expect, it } from "vitest";
import {
  emojiGuessGameHero,
  fiveTenGameHero,
  forbiddenWordGameHero,
  gameArt,
  letterGameHero,
  minigameArtAtlas,
  musicQuizGameHero,
  onlyLiesGameHero,
  partyMinigameAtlas,
  songGameHero,
} from "./media";

describe("minigame artwork registry", () => {
  it("serves every core artwork from the deployed app", () => {
    const assets = [
      gameArt,
      minigameArtAtlas,
      partyMinigameAtlas,
      songGameHero,
      letterGameHero,
      fiveTenGameHero,
      musicQuizGameHero,
      onlyLiesGameHero,
      forbiddenWordGameHero,
      emojiGuessGameHero,
    ];

    expect(assets).toHaveLength(10);
    expect(assets.every((asset) => asset.includes("assets/"))).toBe(true);
    expect(assets.every((asset) => !asset.includes("files.manuscdn.com"))).toBe(
      true
    );
  });

  it("uses the bundled music quiz hero", () => {
    expect(musicQuizGameHero).toContain("assets/party-music-quiz-hero-v3.svg");
  });

  /**
   * Každá hra má vlastný vizuál. Keď si dve hry požičiavali ten istý obrázok,
   * v menu vyzerali ako tá istá hra — presne to sa tu nesmie vrátiť.
   */
  it("gives every music and word game its own artwork", () => {
    const heroes = [
      songGameHero,
      musicQuizGameHero,
      onlyLiesGameHero,
      forbiddenWordGameHero,
      emojiGuessGameHero,
      letterGameHero,
      fiveTenGameHero,
    ];

    expect(new Set(heroes).size).toBe(heroes.length);
  });
});
