#!/usr/bin/env bun

import {
  DARES_BY_LANGUAGE,
  TRUTH_OR_DARE_CARD_COUNT,
  TRUTHS_BY_LANGUAGE,
} from "../src/data/localizedTruthOrDare.ts";

const decks = { truth: TRUTHS_BY_LANGUAGE, dare: DARES_BY_LANGUAGE };
const languageNames = { sk: "Slovak", en: "English", de: "German", es: "Spanish", fr: "French", pt: "Portuguese" };
const bannedPatterns = [
  /\b(porno|pornograph|sexuelle?|sexual|sexo|sexe|pornografia|pornographie)\b/iu,
  /\b(drug|droga|drogue|drogen)\b/iu,
  /\b(samovražd|suicid|suicide|suizid|sebapoškodz|self-harm|autolesi)\b/iu,
  /\b(racis|rasis|extremis|extr[eé]mis)\b/iu,
  /\b(politik|politic|política|politique|político)\b/iu,
  /\b(nábožen|religion|religi[oó]n|religião)\b/iu,
];

const problems = [];
for (const [kind, languageDecks] of Object.entries(decks)) {
  for (const [language, cards] of Object.entries(languageDecks)) {
    const uniqueCards = new Set(cards.map((card) => card.toLocaleLowerCase()));
    if (cards.length !== TRUTH_OR_DARE_CARD_COUNT) problems.push(`${kind}/${language}: expected ${TRUTH_OR_DARE_CARD_COUNT}, got ${cards.length}`);
    if (uniqueCards.size !== TRUTH_OR_DARE_CARD_COUNT) problems.push(`${kind}/${language}: expected ${TRUTH_OR_DARE_CARD_COUNT} unique cards, got ${uniqueCards.size}`);
    cards.forEach((card, index) => {
      if (!card.endsWith(kind === "truth" ? "?" : ".")) problems.push(`${kind}/${language} #${index + 1}: missing final punctuation`);
      if (/\.\.\.|\s{2,}/u.test(card)) problems.push(`${kind}/${language} #${index + 1}: malformed spacing or ellipsis`);
      if (bannedPatterns.some((pattern) => pattern.test(card))) problems.push(`${kind}/${language} #${index + 1}: prohibited topic`);
    });
  }
}

for (const language of Object.keys(languageNames)) {
  if (TRUTHS_BY_LANGUAGE[language].length !== DARES_BY_LANGUAGE[language].length) problems.push(`${language}: truth/dare order lengths differ`);
}

console.log(JSON.stringify({
  expected: TRUTH_OR_DARE_CARD_COUNT,
  truth: Object.fromEntries(Object.entries(TRUTHS_BY_LANGUAGE).map(([language, cards]) => [language, cards.length])),
  dare: Object.fromEntries(Object.entries(DARES_BY_LANGUAGE).map(([language, cards]) => [language, cards.length])),
  problems: problems.length,
}, null, 2));
if (problems.length) {
  console.error(problems.slice(0, 60).join("\n"));
  process.exitCode = 1;
}
