import { describe, expect, it } from "vitest";
import {
  fiveTenGameHero,
  gameArt,
  letterGameHero,
  minigameArtAtlas,
  musicQuizGameHero,
  partyMinigameAtlas,
  songGameHero,
} from "./media";

describe("minigame artwork registry", () => {
  it("keeps every core artwork as a hosted Manus storage asset", () => {
    const assets = [
      gameArt,
      minigameArtAtlas,
      partyMinigameAtlas,
      songGameHero,
      letterGameHero,
      fiveTenGameHero,
      musicQuizGameHero,
    ];

    expect(assets).toHaveLength(7);
    expect(assets.every((asset) => asset.startsWith("/manus-storage/"))).toBe(true);
  });

  it("uses the refreshed music quiz hero", () => {
    expect(musicQuizGameHero).toBe("/manus-storage/party-music-quiz-hero-v3_7a166f09.png");
  });
});
