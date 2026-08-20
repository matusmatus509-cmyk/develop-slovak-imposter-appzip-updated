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
  it("keeps every core artwork on a public CDN for external deployments", () => {
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
    expect(assets.every((asset) => asset.startsWith("https://files.manuscdn.com/"))).toBe(true);
  });

  it("uses the refreshed music quiz hero", () => {
    expect(musicQuizGameHero).toBe("https://files.manuscdn.com/user_upload_by_module/session_file/310519663652453277/VSkCdhSlUSrxtdNK.png");
  });
});
