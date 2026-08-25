import { describe, expect, it } from "vitest";
import {
  fiveTenGameHero,
  forbiddenSetupHero,
  forbiddenWordGameHero,
  gameArt,
  letterGameHero,
  minigameArtAtlas,
  musicQuizGameHero,
  musicQuizGameHeroWide,
  musicQuizSetupHero,
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
      musicQuizGameHeroWide,
      musicQuizSetupHero,
      forbiddenWordGameHero,
      forbiddenSetupHero,
    ];

    expect(assets).toHaveLength(11);
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
