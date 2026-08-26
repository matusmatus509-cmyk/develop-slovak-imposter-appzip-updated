/**
 * Vizuály sú súčasťou nasadenia aplikácie. Neodkazujeme na dočasné session URL,
 * pretože tie po publikovaní alebo v nainštalovanej PWA môžu vracať 403.
 */
const publicAsset = (fileName: string) => `${import.meta.env.BASE_URL}assets/${fileName}`;

export const appBackground = publicAsset("app-background-v2.webp");
export const brandMark = publicAsset("brand-mark.svg");
export const partyModeArt = publicAsset("party-mode-card.jpg");
export const imposterArt = publicAsset("imposter-card.jpg");
export const minigamesArt = publicAsset("minigames-card.jpg");

export const gameArt = publicAsset("game-art-sprite.jpg");
export const minigameArtAtlas = publicAsset("minigame-art-atlas.png");
export const partyMinigameAtlas = publicAsset("party-minigame-atlas.png");
export const songGameHero = publicAsset("party-song-hero-v2.png");
export const letterGameHero = publicAsset("party-letter-hero-v2.png");
export const fiveTenGameHero = publicAsset("party-five-ten-hero-v2.png");
export const musicQuizGameHero = publicAsset("party-music-quiz-hero-v3.png");
/**
 * Pre panel „Nastavenia hry" v `TeamQuickGame.tsx` (`.game-setup-hero`,
 * `h-48` ≈ 350×192 px na bežnom mobile, pomer ~1,82 : 1). `musicQuizGameHero`
 * je portrét (1113×1414, ~0,79 : 1) a v tomto landscape ráme sa silno
 * odrezával po stranách. Tento obrázok má 1392×768 (~1,81 : 1), takže sedí
 * takmer bez orezu.
 */
export const musicQuizSetupHero = publicAsset(
  "party-music-quiz-setup-hero.jpg"
);
/**
 * Pre uvítaciu obrazovku — má vlastný orez (825×1024, ~0,8 : 1), ktorý sedí
 * na jej vyšší panel presnejšie než hlavný hero (1113×1414, ~0,79 : 1) alebo
 * pôvodná verzia na šírku (1536×1024), ktorá sa v žiadnom z panelov nezmestila
 * bez veľkého orezu po stranách. Kartičky v menu a Party mode zostávajú na
 * `musicQuizGameHero` vyššie.
 */
export const musicQuizGameHeroWide = publicAsset(
  "party-music-quiz-hero-v3-wide.jpg"
);
export const onlyLiesGameHero = publicAsset("party-quiz-battle-v3.png");
export const battleshipGameHero = publicAsset("party-battleship-hero.jpg");
export const ticTacToeGameHero = publicAsset("party-tic-tac-toe-hero.jpg");
export const fiveTenGameHeroV3 = publicAsset("party-five-ten-hero-v3.jpg");
export const emojiGameHero = publicAsset("party-hadaj-emoji-hero.jpg");
export const bombGameHero = publicAsset("party-bomba-hero.jpg");
export const pingPongGameHero = publicAsset("party-pingpong-hero.jpg");
export const letterGameHeroV3 = publicAsset("party-letter-hero-v3.jpg");
export const songGameHeroV3 = publicAsset("party-song-hero-v3.jpg");
export const charadesGameHero = publicAsset("party-sarady-hero.jpg");
export const pantomimaGameHero = publicAsset("party-pantomima-hero.jpg");
export const soundGameHero = publicAsset("party-sound-hero.jpg");
/**
 * Novšia verzia kartičky Party mode — rozjarený dav na hernom večierku,
 * lepšie vystihuje energiu tímových minihier než pôvodná verzia.
 */
export const partyModeArtV2 = publicAsset("party-mode-card-v2.jpg");
/**
 * Pre uvítaciu obrazovku a kartičku v menu — portrét 928×1152 (~0,81 : 1),
 * blízko oboch panelov (kartička ~0,77–0,80 : 1, uvítacia obrazovka ~0,80 : 1).
 */
export const forbiddenWordGameHero = publicAsset("party-forbidden-hero.jpg");
/**
 * Pre panel „Nastavenia hry" v `TeamQuickGame.tsx` (`.game-setup-hero`,
 * ~350×192 px na bežnom mobile, pomer ~1,82 : 1). 1392×768 (~1,81 : 1) sedí
 * takmer bez orezu — rovnaká logika ako `musicQuizSetupHero`.
 */
export const forbiddenSetupHero = publicAsset(
  "party-forbidden-setup-hero.jpg"
);
export const partyHubHero = publicAsset("party-hub-hero.png");
export const partyTableBackground = publicAsset("party-table-bg.png");
export const quizBattleArt = publicAsset("party-quiz-battle-v3.png");
export const forbiddenArt = publicAsset("party-forbidden.svg");
export const soundArt = publicAsset("party-sound.svg");

// Tieto zvuky sa momentálne neprehrávajú; prázdny data URI nevyžaduje externé CDN.
export const dogSound = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
export const doorbellSound = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
