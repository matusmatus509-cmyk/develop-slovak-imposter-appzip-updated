#!/usr/bin/env bun

import {
  DARES_BY_LANGUAGE,
  TRUTH_OR_DARE_CARD_COUNT,
  TRUTH_OR_DARE_TARGET_COUNT,
  TRUTHS_BY_LANGUAGE,
} from "../src/data/localizedTruthOrDare.ts";

const decks = { truth: TRUTHS_BY_LANGUAGE, dare: DARES_BY_LANGUAGE };
const bannedTopics = [
  /\b(sex|sexual|sexuelle?|sexo|sexe|porno\w*)\b/iu,
  /\b(drug|drogas?|drogue|drogen)\b/iu,
  /\b(suicid\w*|suizid|samovražd\w*|sebapoškodz\w*|self-harm|autolesi\w*)\b/iu,
  /\b(racis\w*|rasis\w*|extremis\w*|extr[eé]mis\w*)\b/iu,
  /\b(politik\w*|politic\w*|pol[íi]tic\w*|politique)\b/iu,
  /\b(nábožen\w*|religion|religi[oó]n|religião|religiös)\b/iu,
];
const bannedDares = [
  /\bpobozkaj|\bkiss\b|\bküss\w*|\bbesa\b|\bembrasse\b|\bbeija\b/iu,
  /\bvyzleč|\bstrip\b|\bausziehen\b|\bdesnuda\w*|\bdéshabille\w*|\bdespe\w*/iu,
  /\balkohol\w*|\balcohol\w*|\balcool\w*|\bshot\b|\bvodka\b|\bbeer\b|\bbier\b/iu,
  /\brozbi\b|\bznič\w*|\bbreak something\b|\bzerbrich\w*|\brompe\b|\bcasse\b|\bparte\b/iu,
  /\bheslo\w*|\bpassword\w*|\bpasswort\w*|\bcontraseñ\w*|\bmot de passe\b|\bpalavra-passe\b/iu,
];

const problems = [];
for (const [kind, languageDecks] of Object.entries(decks)) {
  const terminator = kind === "truth" ? "?" : ".";
  for (const [language, cards] of Object.entries(languageDecks)) {
    if (new Set(cards.map((card) => card.toLocaleLowerCase())).size !== cards.length) {
      problems.push(`${kind}/${language}: duplicate cards`);
    }
    cards.forEach((card, index) => {
      if (!card.endsWith(terminator)) problems.push(`${kind}/${language} #${index + 1}: must end with "${terminator}"`);
      if (/\s{2,}|\.\.\./u.test(card)) problems.push(`${kind}/${language} #${index + 1}: malformed spacing`);
      if (bannedTopics.some((pattern) => pattern.test(card))) problems.push(`${kind}/${language} #${index + 1}: prohibited topic`);
      if (kind === "dare" && bannedDares.some((pattern) => pattern.test(card))) problems.push(`dare/${language} #${index + 1}: prohibited dare`);
    });
  }
}

// Template detection: two cards built from the same template share almost all
// of their words in the same order, while genuinely different cards do not.
const SIMILARITY_LIMIT = 0.65;

const tokenize = (card) => card.toLocaleLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/u).filter(Boolean);

function longestCommonSubsequence(left, right) {
  let previous = new Array(right.length + 1).fill(0);
  for (let i = 1; i <= left.length; i += 1) {
    const current = new Array(right.length + 1).fill(0);
    for (let j = 1; j <= right.length; j += 1) {
      current[j] = left[i - 1] === right[j - 1] ? previous[j - 1] + 1 : Math.max(previous[j], current[j - 1]);
    }
    previous = current;
  }
  return previous[right.length];
}

const structureReport = {};
for (const [kind, languageDecks] of Object.entries(decks)) {
  const tokenized = languageDecks.sk.map(tokenize);
  let worst = { similarity: 0, pair: null };
  for (let i = 0; i < tokenized.length; i += 1) {
    for (let j = i + 1; j < tokenized.length; j += 1) {
      const shared = longestCommonSubsequence(tokenized[i], tokenized[j]);
      const similarity = (2 * shared) / (tokenized[i].length + tokenized[j].length);
      if (similarity > worst.similarity) worst = { similarity, pair: [languageDecks.sk[i], languageDecks.sk[j]] };
      if (similarity > SIMILARITY_LIMIT) {
        problems.push(`${kind}: template-like pair (${(similarity * 100).toFixed(0)}% identical structure) "${languageDecks.sk[i]}" / "${languageDecks.sk[j]}"`);
      }
    }
  }
  structureReport[kind] = {
    mostSimilarPairShare: `${(worst.similarity * 100).toFixed(0)}%`,
    mostSimilarPair: worst.pair,
    limit: `${SIMILARITY_LIMIT * 100}%`,
  };
}

console.log(JSON.stringify({
  authored: TRUTH_OR_DARE_CARD_COUNT,
  target: TRUTH_OR_DARE_TARGET_COUNT,
  remaining: TRUTH_OR_DARE_TARGET_COUNT - TRUTH_OR_DARE_CARD_COUNT,
  complete: TRUTH_OR_DARE_CARD_COUNT === TRUTH_OR_DARE_TARGET_COUNT,
  structure: structureReport,
  problems: problems.length,
}, null, 2));

if (problems.length) {
  console.error(problems.slice(0, 60).join("\n"));
  process.exitCode = 1;
}
