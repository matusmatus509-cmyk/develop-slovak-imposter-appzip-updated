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
/**
 * Vizuály minihier sú vlastné pre každú hru. Hudobný kvíz preto nesmie zdieľať
 * obrázok so „Zahmkaj pesničku" a „Iba nepravda" ho nesmie mať pôjčený
 * z kvízového duelu — inak sa v menu tvária ako tá istá hra.
 */
export const musicQuizGameHero = publicAsset("party-music-quiz-hero-v3.svg");
export const onlyLiesGameHero = publicAsset("party-only-lies-hero-v2.svg");
export const emojiGuessGameHero = publicAsset("emoji-guess-hero-v1.svg");
export const forbiddenWordGameHero = publicAsset("party-forbidden-hero-v2.svg");
export const partyHubHero = publicAsset("party-hub-hero.png");
export const partyTableBackground = publicAsset("party-table-bg.png");
export const quizBattleArt = publicAsset("party-quiz-battle-v3.png");
export const forbiddenArt = publicAsset("party-forbidden-hero-v2.svg");
export const soundArt = publicAsset("party-sound.svg");

// Tieto zvuky sa momentálne neprehrávajú; prázdny data URI nevyžaduje externé CDN.
export const dogSound = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
export const doorbellSound = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
