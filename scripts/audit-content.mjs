#!/usr/bin/env bun

import { TRUTHS, DARES, NEVER_HAVE_I_EVER, WOULD_YOU_RATHER, ONLY_LIES, BOMB_CATEGORIES } from "../src/data/prompts.ts";
import { PANTOMIMA_WORDS_BY_DIFFICULTY, QUIZ_QUESTIONS } from "../src/data/teamBattle.ts";
import { FORBIDDEN_CARDS, SOUND_CLUES, LETTER_CHALLENGES, FIVE_IN_TEN_PROMPTS } from "../src/data/teamBattleExtras.ts";
import { getSongCardsForLanguage } from "../src/data/localizedSongs.ts";
import { getCharacterCategories } from "../src/data/characters.ts";
import { DRAWING_CATEGORIES } from "../src/data/drawingCategories.ts";
import { getEmojiCategories } from "../src/data/emojiCategories.ts";
import { ALL_SOLO_CHARADES_WORDS } from "../src/data/charades.ts";
import { PING_PONG_PROMPTS } from "../src/data/pingPongPrompts.ts";
import { CATEGORIES } from "../src/data/categories.ts";
import { NEVER_HAVE_I_EVER_BY_LANGUAGE } from "../src/data/localizedNeverHaveIEver.ts";
import { getWorkshopEntryValidationError, normalizeWorkshopEntries, SEASONAL_PARTY_PACKS } from "../src/data/partyContent.ts";
import { DARES_BY_LANGUAGE, TRUTH_OR_DARE_CARD_COUNT, TRUTH_OR_DARE_TARGET_COUNT, TRUTHS_BY_LANGUAGE } from "../src/data/localizedTruthOrDare.ts";

const flatten = (groups, field) => groups.flatMap((group) => group[field]);
const difficultyTotal = (groups) => Object.values(groups).reduce((sum, items) => sum + items.length, 0);
const uniqueCount = (items, getId = (item) => JSON.stringify(item)) => new Set(items.map(getId)).size;
const people = flatten(getCharacterCategories("sk"), "characters");
const drawing = flatten(DRAWING_CATEGORIES, "wordPairs");
const emoji = flatten(getEmojiCategories(true), "puzzles");
const impostor = flatten(CATEGORIES, "wordPairs");

const counts = {
  truths: uniqueCount(TRUTHS, String), dares: uniqueCount(DARES, String), neverHaveIEver: uniqueCount(NEVER_HAVE_I_EVER, String),
  wouldYouRather: uniqueCount(WOULD_YOU_RATHER, (item) => item.a + "|" + item.b), guessWho: uniqueCount(people, String),
  drawing: uniqueCount(drawing, (item) => item.word), pantomime: difficultyTotal(PANTOMIMA_WORDS_BY_DIFFICULTY),
  forbiddenWords: uniqueCount(FORBIDDEN_CARDS, (item) => item.word), pingPong: uniqueCount(PING_PONG_PROMPTS, String),
  letterChallenges: uniqueCount(LETTER_CHALLENGES, (item) => item.category + "|" + item.letter), quiz: uniqueCount(QUIZ_QUESTIONS, (item) => item.question),
  songs: uniqueCount(getSongCardsForLanguage("sk"), (item) => item.title + "|" + item.artist), sounds: uniqueCount(SOUND_CLUES, (item) => item.id),
  emoji: uniqueCount(emoji, (item) => item.emoji + "|" + item.answer), onlyLies: uniqueCount(ONLY_LIES, String), bomb: uniqueCount(BOMB_CATEGORIES, String),
  fiveInTen: uniqueCount(FIVE_IN_TEN_PROMPTS, String), charades: uniqueCount(ALL_SOLO_CHARADES_WORDS, String), impostor: uniqueCount(impostor, (item) => item.word),
};

const requirements = {
  truths: [TRUTH_OR_DARE_CARD_COUNT, TRUTH_OR_DARE_CARD_COUNT], dares: [TRUTH_OR_DARE_CARD_COUNT, TRUTH_OR_DARE_CARD_COUNT],
  neverHaveIEver: [1500, 1500], wouldYouRather: [2000, 2000],
  guessWho: [3000, 3000], drawing: [3000, 3000], pantomime: [3000, 3000], forbiddenWords: [2000, 2000],
  pingPong: [300, 500], letterChallenges: [500, 1000], quiz: [5000, 5000], songs: [1000, Infinity], sounds: [500, 1000],
  emoji: [2000, 2000], onlyLies: [1000, Infinity], bomb: [1000, Infinity], fiveInTen: [1000, Infinity], charades: [2000, 2000], impostor: [3000, 3000],
};

const wordCatalogues = [
  ["drawing", drawing.map((card) => card.word)], ["emoji answers", emoji.map((card) => card.answer)],
  ["impostor", impostor.map((card) => card.word)], ["forbidden", FORBIDDEN_CARDS.map((card) => card.word)],
  ["pantomime", Object.values(PANTOMIMA_WORDS_BY_DIFFICULTY).flat()], ["charades", ALL_SOLO_CHARADES_WORDS],
];
const malformedWords = wordCatalogues.flatMap(([name, cards]) => cards.filter((card) => !card || card !== card.trim() || /:/.test(card) || /\s{2,}/.test(card)).map((card) => `${name}: ${card}`));
const malformedNever = NEVER_HAVE_I_EVER.filter((card) => !/^Nikdy som (?:sa |si )?nikdy\b/iu.test(card) || /Nikdy som nikdy\s+som\b/iu.test(card) || /\.\.\./.test(card));
const neverLanguageIssues = Object.entries(NEVER_HAVE_I_EVER_BY_LANGUAGE).flatMap(([language, cards]) => {
  const problems = [];
  if (cards.length !== 1500 || new Set(cards).size !== 1500) problems.push(`${language} has ${cards.length} cards and ${new Set(cards).size} unique`);
  const malformed = cards.filter((card) => !card.endsWith(".") || /\.\.\./.test(card) || /\s{2,}/.test(card));
  return [...problems, ...malformed.map((card) => `${language}: ${card}`)];
});
const invalidSeasonal = SEASONAL_PARTY_PACKS.flatMap((pack) => pack.entries.filter((entry) => getWorkshopEntryValidationError(entry.kind, entry.text, entry.answer)).map((entry) => `${pack.id}: ${entry.text}`));
const seasonalTotal = SEASONAL_PARTY_PACKS.reduce((sum, pack) => sum + pack.entries.length, 0);
const normalizedSeasonal = normalizeWorkshopEntries(SEASONAL_PARTY_PACKS.flatMap((pack) => pack.entries.map((entry, index) => ({ ...entry, id: `${pack.id}-${index}`, collectionIds: ["default"] }))));

const failures = [
  ...Object.entries(requirements).filter(([key, [minimum, maximum]]) => counts[key] < minimum || counts[key] > maximum).map(([key, range]) => `${key}=${counts[key]} expected ${range.join("-")}`),
  ...malformedWords.map((card) => `malformed word card ${card}`),
  ...malformedNever.map((card) => `malformed Never Have I Ever card ${card}`),
  ...neverLanguageIssues.map((issue) => `Never Have I Ever localisation issue ${issue}`),
  ...invalidSeasonal.map((card) => `invalid seasonal card ${card}`),
  ...(normalizedSeasonal.length === seasonalTotal ? [] : ["a seasonal card was rejected by the shared validator"]),
];
const neverLanguageCounts = Object.fromEntries(Object.entries(NEVER_HAVE_I_EVER_BY_LANGUAGE).map(([language, cards]) => [language, cards.length]));
const truthOrDareProgress = {
  authored: TRUTH_OR_DARE_CARD_COUNT,
  target: TRUTH_OR_DARE_TARGET_COUNT,
  complete: TRUTH_OR_DARE_CARD_COUNT === TRUTH_OR_DARE_TARGET_COUNT,
  truths: Object.fromEntries(Object.entries(TRUTHS_BY_LANGUAGE).map(([language, cards]) => [language, cards.length])),
  dares: Object.fromEntries(Object.entries(DARES_BY_LANGUAGE).map(([language, cards]) => [language, cards.length])),
};
console.log(JSON.stringify({ counts, neverHaveIEverByLanguage: neverLanguageCounts, truthOrDareProgress, quality: { malformedWords: malformedWords.length, malformedNever: malformedNever.length, neverLanguageIssues: neverLanguageIssues.length, invalidSeasonal: invalidSeasonal.length } }, null, 2));
if (failures.length) throw new Error(`Content audit failed: ${failures.join("; ")}`);
