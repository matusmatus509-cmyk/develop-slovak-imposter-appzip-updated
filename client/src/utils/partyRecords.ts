import type { PartyRecords } from "../types";

export const DEFAULT_PARTY_RECORDS: PartyRecords = {
  longestParty: null,
  highestGameScore: null,
  fastestGuess: null,
};

function boundedInteger(value: unknown, minimum: number, maximum: number): number | null {
  if (!Number.isFinite(value)) return null;
  const number = Number(value);
  if (number < minimum || number > maximum) return null;
  return Math.round(number);
}

function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, maxLength) : "";
}

function normalizedTimestamp(value: unknown) {
  return boundedInteger(value, 0, 8_640_000_000_000_000) ?? 0;
}

export function normalizePartyRecords(value: unknown): PartyRecords {
  const candidate = value && typeof value === "object" ? value as Partial<PartyRecords> : {};
  const longest = candidate.longestParty;
  const score = candidate.highestGameScore;
  const guess = candidate.fastestGuess;
  const longestSeconds = boundedInteger(longest?.durationSeconds, 1, 7 * 24 * 60 * 60);
  const highestScore = boundedInteger(score?.score, 0, 1_000_000);
  const guessMilliseconds = boundedInteger(guess?.milliseconds, 100, 60 * 60 * 1000);
  const guessWord = cleanString(guess?.word, 120);
  const guessGame = cleanString(guess?.gameTitle, 50);
  return {
    longestParty: longestSeconds !== null
      ? { durationSeconds: longestSeconds, achievedAt: normalizedTimestamp(longest?.achievedAt) }
      : null,
    highestGameScore: highestScore !== null
      ? { score: highestScore, teamName: cleanString(score?.teamName, 30) || "Tím", achievedAt: normalizedTimestamp(score?.achievedAt) }
      : null,
    fastestGuess: guessMilliseconds !== null && guessWord && guessGame
      ? { word: guessWord, milliseconds: guessMilliseconds, gameTitle: guessGame, achievedAt: normalizedTimestamp(guess?.achievedAt) }
      : null,
  };
}

export function applyPartyCompletionRecord(current: unknown, input: { durationSeconds: number; score: number; teamName: string; achievedAt?: number }) {
  const records = normalizePartyRecords(current);
  const durationSeconds = boundedInteger(input.durationSeconds, 1, 7 * 24 * 60 * 60);
  const score = boundedInteger(input.score, 0, 1_000_000);
  const achievedAt = boundedInteger(input.achievedAt ?? Date.now(), 0, 8_640_000_000_000_000);
  if (achievedAt === null) return records;
  return {
    ...records,
    longestParty: durationSeconds !== null && durationSeconds > (records.longestParty?.durationSeconds ?? 0)
      ? { durationSeconds, achievedAt }
      : records.longestParty,
    highestGameScore: score !== null && (records.highestGameScore === null || score > records.highestGameScore.score)
      ? { score, teamName: cleanString(input.teamName, 30) || "Tím", achievedAt }
      : records.highestGameScore,
  } satisfies PartyRecords;
}

export function applyFastestGuessRecord(current: unknown, input: { word: string; milliseconds: number; gameTitle: string; achievedAt?: number }) {
  const records = normalizePartyRecords(current);
  const milliseconds = boundedInteger(input.milliseconds, 100, 60 * 60 * 1000);
  const word = cleanString(input.word, 120);
  const gameTitle = cleanString(input.gameTitle, 50);
  const achievedAt = boundedInteger(input.achievedAt ?? Date.now(), 0, 8_640_000_000_000_000);
  if (milliseconds === null || achievedAt === null || !word || !gameTitle || milliseconds >= (records.fastestGuess?.milliseconds ?? Number.POSITIVE_INFINITY)) return records;
  return {
    ...records,
    fastestGuess: { word, milliseconds, gameTitle, achievedAt },
  } satisfies PartyRecords;
}
