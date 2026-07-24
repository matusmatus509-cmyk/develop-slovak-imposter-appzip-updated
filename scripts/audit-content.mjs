import { build } from "esbuild";

const source = `
import { TRUTHS, DARES, NEVER_HAVE_I_EVER, WOULD_YOU_RATHER, ONLY_LIES, BOMB_CATEGORIES } from "./src/data/prompts.ts";
import { PANTOMIMA_WORDS_BY_DIFFICULTY, QUIZ_QUESTIONS } from "./src/data/teamBattle.ts";
import { FORBIDDEN_CARDS, SOUND_CLUES, LETTER_CHALLENGES, FIVE_IN_TEN_PROMPTS } from "./src/data/teamBattleExtras.ts";
import { getSongCardsForLanguage } from "./src/data/localizedSongs.ts";
import { getCharacterCategories } from "./src/data/characters.ts";
import { DRAWING_CATEGORIES } from "./src/data/drawingCategories.ts";
import { getEmojiCategories } from "./src/data/emojiCategories.ts";
import { ALL_SOLO_CHARADES_WORDS } from "./src/data/charades.ts";
import { PING_PONG_PROMPTS } from "./src/data/pingPongPrompts.ts";
import { CATEGORIES } from "./src/data/categories.ts";

const flatten = (groups, field) => groups.flatMap((group) => group[field]);
const difficultyTotal = (groups) => Object.values(groups).reduce((sum, items) => sum + items.length, 0);
const uniqueCount = (items, getId = (item) => JSON.stringify(item)) => new Set(items.map(getId)).size;
const people = flatten(getCharacterCategories("sk"), "characters");
const drawing = flatten(DRAWING_CATEGORIES, "wordPairs");
const emoji = flatten(getEmojiCategories(true), "puzzles");
const impostor = flatten(CATEGORIES, "wordPairs");

const counts = {
  truths: uniqueCount(TRUTHS, String),
  dares: uniqueCount(DARES, String),
  neverHaveIEver: uniqueCount(NEVER_HAVE_I_EVER, String),
  wouldYouRather: uniqueCount(WOULD_YOU_RATHER, (item) => item.a + "|" + item.b),
  guessWho: uniqueCount(people, String),
  drawing: uniqueCount(drawing, (item) => item.word),
  pantomime: difficultyTotal(PANTOMIMA_WORDS_BY_DIFFICULTY),
  forbiddenWords: uniqueCount(FORBIDDEN_CARDS, (item) => item.word),
  pingPong: uniqueCount(PING_PONG_PROMPTS, String),
  letterChallenges: uniqueCount(LETTER_CHALLENGES, (item) => item.category + "|" + item.letter),
  quiz: uniqueCount(QUIZ_QUESTIONS, (item) => item.question),
  songs: uniqueCount(getSongCardsForLanguage("sk"), (item) => item.title + "|" + item.artist),
  sounds: uniqueCount(SOUND_CLUES, (item) => item.id),
  emoji: uniqueCount(emoji, (item) => item.emoji + "|" + item.answer),
  onlyLies: uniqueCount(ONLY_LIES, String),
  bomb: uniqueCount(BOMB_CATEGORIES, String),
  fiveInTen: uniqueCount(FIVE_IN_TEN_PROMPTS, String),
  charades: uniqueCount(ALL_SOLO_CHARADES_WORDS, String),
  impostor: uniqueCount(impostor, (item) => item.word),
};

const requirements = {
  truths: [2000, 2000], dares: [2000, 2000], neverHaveIEver: [2000, 2000], wouldYouRather: [2000, 2000],
  guessWho: [3000, 3000], drawing: [3000, 3000], pantomime: [3000, 3000], forbiddenWords: [2000, 2000],
  pingPong: [300, 500], letterChallenges: [500, 1000], quiz: [5000, 5000], songs: [1000, Infinity],
  sounds: [500, 1000], emoji: [2000, 2000], onlyLies: [1000, Infinity], bomb: [1000, Infinity],
  fiveInTen: [1000, Infinity], charades: [2000, 2000], impostor: [3000, 3000],
};
const failures = Object.entries(requirements).filter(([key, [minimum, maximum]]) => counts[key] < minimum || counts[key] > maximum);
console.log(JSON.stringify(counts, null, 2));
if (failures.length) {
  throw new Error("Content count requirements failed: " + failures.map(([key, range]) => key + "=" + counts[key] + " expected " + range.join("-")).join(", "));
}
`;

const result = await build({
  stdin: { contents: source, resolveDir: process.cwd(), loader: "ts" },
  bundle: true,
  platform: "node",
  format: "iife",
  write: false,
});

new Function(result.outputFiles[0].text)();
