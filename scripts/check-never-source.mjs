#!/usr/bin/env bun

import { getNeverHaveIEverSourceLines } from "../src/data/neverHaveIEverSource.ts";

const languages = ["sk", "en", "de", "es", "fr", "pt"];
const openings = {
  sk: /^Nikdy som (sa |si )?nikdy ne/u,
  en: /^Never have I ever /u,
  de: /^Ich (habe|bin|war)( mich| mir)? noch nie /u,
  es: /^Nunca /u,
  fr: /^Je (n'ai jamais|ne me suis jamais|ne suis jamais) /u,
  pt: /^Nunca /u,
};

const lines = getNeverHaveIEverSourceLines();
const problems = [];
const seen = languages.map(() => new Map());

lines.forEach((line, index) => {
  const columns = line.split("|").map((column) => column.trim());
  const position = index + 1;
  if (columns.length !== languages.length) {
    problems.push(`columns=${columns.length} @${position} :: ${line.slice(0, 70)}`);
    return;
  }
  columns.forEach((column, columnIndex) => {
    const language = languages[columnIndex];
    if (!column) {
      problems.push(`empty ${language} @${position}`);
      return;
    }
    if (!openings[language].test(column)) problems.push(`opening ${language} @${position} :: ${column}`);
    if (!column.endsWith(".")) problems.push(`period ${language} @${position} :: ${column}`);
    if (column.includes("...")) problems.push(`ellipsis ${language} @${position} :: ${column}`);
    if (/\s{2,}/.test(column)) problems.push(`spacing ${language} @${position} :: ${column}`);
    const key = column.toLocaleLowerCase();
    if (seen[columnIndex].has(key)) problems.push(`duplicate ${language} @${position} = @${seen[columnIndex].get(key)} :: ${column}`);
    else seen[columnIndex].set(key, position);
  });
});

console.log(`cards: ${lines.length}`);
console.log(problems.length ? problems.slice(0, 60).join("\n") : "no problems");
if (problems.length) process.exitCode = 1;
