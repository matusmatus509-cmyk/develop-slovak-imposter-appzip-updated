import { describe, expect, it } from "vitest";
import {
  battleshipGameHero,
  bombGameHero,
  charadesGameHero,
  emojiGameHero,
  fiveTenGameHero,
  fiveTenGameHeroV3,
  forbiddenSetupHero,
  forbiddenWordGameHero,
  gameArt,
  letterGameHero,
  letterGameHeroV3,
  minigameArtAtlas,
  musicQuizGameHero,
  musicQuizGameHeroWide,
  musicQuizSetupHero,
  pantomimaGameHero,
  partyMinigameAtlas,
  partyModeArtV2,
  pingPongGameHero,
  songGameHero,
  songGameHeroV3,
  soundGameHero,
  ticTacToeGameHero,
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
      musicQuizGameHeroWide,
      musicQuizSetupHero,
      forbiddenWordGameHero,
      forbiddenSetupHero,
      battleshipGameHero,
      ticTacToeGameHero,
      fiveTenGameHeroV3,
      emojiGameHero,
      bombGameHero,
      pingPongGameHero,
      letterGameHeroV3,
      songGameHeroV3,
      charadesGameHero,
      pantomimaGameHero,
      soundGameHero,
      partyModeArtV2,
    ];

    expect(assets).toHaveLength(23);
    expect(assets.every((asset) => asset.includes("assets/"))).toBe(true);
    expect(assets.every((asset) => !asset.includes("files.manuscdn.com"))).toBe(true);
  });

  it("uses the bundled music quiz hero", () => {
    expect(musicQuizGameHero).toContain("assets/party-music-quiz-hero-v3.png");
    expect(musicQuizGameHeroWide).toContain(
      "assets/party-music-quiz-hero-v3-wide.jpg"
    );
    expect(musicQuizSetupHero).toContain(
      "assets/party-music-quiz-setup-hero.jpg"
    );
  });

  it("uses the bundled forbidden word hero", () => {
    expect(forbiddenWordGameHero).toContain(
      "assets/party-forbidden-hero.jpg"
    );
    expect(forbiddenSetupHero).toContain(
      "assets/party-forbidden-setup-hero.jpg"
    );
  });
});
