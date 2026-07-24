import type { AchievementId, DailyProgress, GameStatistics, PlayerProgression } from "../types";

export const XP_PER_GAME = 100;
export const XP_PER_LEVEL = 500;
export const MAX_LEVEL = 100;

export type DailyChallengeId = "play-3" | "correct-20" | "party-win";

export interface DailyChallengeDefinition {
  id: DailyChallengeId;
  title: string;
  description: string;
  target: number;
  rewardXp: number;
  rewardCoins: number;
  icon: "gamepad" | "circleCheck" | "trophy";
  color: string;
}

export const DAILY_CHALLENGES: DailyChallengeDefinition[] = [
  { id: "play-3", title: "Herná rozcvička", description: "Odohraj 3 hry", target: 3, rewardXp: 75, rewardCoins: 30, icon: "gamepad", color: "#a78bfa" },
  { id: "correct-20", title: "Bystrá hlava", description: "Uhádni 20 slov", target: 20, rewardXp: 100, rewardCoins: 40, icon: "circleCheck", color: "#34d399" },
  { id: "party-win", title: "Party šampión", description: "Vyhraj Party mode", target: 1, rewardXp: 150, rewardCoins: 60, icon: "trophy", color: "#fbbf24" },
];

export interface AchievementDefinition {
  id: AchievementId;
  title: string;
  description: string;
  icon: "award" | "flame" | "target" | "zap" | "crown";
  color: string;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: "first-game", title: "Prvý krok", description: "Odohraj prvú hru", icon: "award", color: "#a78bfa" },
  { id: "party-master", title: "Party legenda", description: "Vyhraj 10 Party módov", icon: "flame", color: "#fb7185" },
  { id: "word-expert", title: "Majster slov", description: "Uhádni 500 slov", icon: "target", color: "#34d399" },
  { id: "bomb-survivor", title: "Preži bombu", description: "Dokonči kolo Bomby", icon: "zap", color: "#fbbf24" },
  { id: "hundred-games", title: "Nezastaviteľný", description: "Odohraj 100 hier", icon: "crown", color: "#22d3ee" },
];

export interface StatisticsEvent {
  gamesStarted?: number;
  playSeconds?: number;
  correctAnswers?: number;
  partyWinnerName?: string;
  bombRoundsCompleted?: number;
}

function safeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTotalPartyWins(teamWins: Record<string, number>) {
  return Object.values(teamWins).reduce((sum, wins) => sum + safeNumber(wins), 0);
}

function createDailyProgress(statistics: Pick<GameStatistics, "gamesPlayed" | "correctAnswers" | "teamWins">): DailyProgress {
  return {
    date: getLocalDateKey(),
    baselineGames: statistics.gamesPlayed,
    baselineCorrectAnswers: statistics.correctAnswers,
    baselinePartyWins: getTotalPartyWins(statistics.teamWins),
    rewardedChallengeIds: [],
  };
}

export function createDefaultStatistics(): GameStatistics {
  const base = { gamesPlayed: 0, teamWins: {}, totalPlaySeconds: 0, correctAnswers: 0 };
  return {
    ...base,
    progression: {
      xp: 0,
      coins: 0,
      bombRoundsCompleted: 0,
      achievements: {},
      daily: createDailyProgress(base),
    },
  };
}

function unlockAchievements(statistics: GameStatistics) {
  const achievements = { ...statistics.progression.achievements };
  const now = Date.now();
  const totalPartyWins = getTotalPartyWins(statistics.teamWins);
  if (statistics.gamesPlayed >= 1 && !achievements["first-game"]) achievements["first-game"] = now;
  if (totalPartyWins >= 10 && !achievements["party-master"]) achievements["party-master"] = now;
  if (statistics.correctAnswers >= 500 && !achievements["word-expert"]) achievements["word-expert"] = now;
  if (statistics.progression.bombRoundsCompleted >= 1 && !achievements["bomb-survivor"]) achievements["bomb-survivor"] = now;
  if (statistics.gamesPlayed >= 100 && !achievements["hundred-games"]) achievements["hundred-games"] = now;
  return achievements;
}

export function normalizeStatistics(value: Partial<GameStatistics> | null | undefined): GameStatistics {
  const gamesPlayed = safeNumber(value?.gamesPlayed);
  const correctAnswers = safeNumber(value?.correctAnswers);
  const totalPlaySeconds = safeNumber(value?.totalPlaySeconds);
  const rawTeamWins = value?.teamWins && typeof value.teamWins === "object" ? value.teamWins : {};
  const teamWins = Object.fromEntries(Object.entries(rawTeamWins).map(([name, wins]) => [name, safeNumber(wins)]));
  const base = { gamesPlayed, correctAnswers, totalPlaySeconds, teamWins };
  const rawProgression = value?.progression as Partial<PlayerProgression> | undefined;
  const rawDaily = rawProgression?.daily as Partial<DailyProgress> | undefined;
  const progression: PlayerProgression = {
    xp: safeNumber(rawProgression?.xp),
    coins: safeNumber(rawProgression?.coins),
    bombRoundsCompleted: safeNumber(rawProgression?.bombRoundsCompleted),
    achievements: rawProgression?.achievements && typeof rawProgression.achievements === "object" ? { ...rawProgression.achievements } : {},
    daily: {
      date: typeof rawDaily?.date === "string" ? rawDaily.date : getLocalDateKey(),
      baselineGames: safeNumber(rawDaily?.baselineGames ?? gamesPlayed),
      baselineCorrectAnswers: safeNumber(rawDaily?.baselineCorrectAnswers ?? correctAnswers),
      baselinePartyWins: safeNumber(rawDaily?.baselinePartyWins ?? getTotalPartyWins(teamWins)),
      rewardedChallengeIds: Array.isArray(rawDaily?.rewardedChallengeIds) ? rawDaily.rewardedChallengeIds.filter((id): id is string => typeof id === "string") : [],
    },
  };
  let statistics: GameStatistics = { ...base, progression };
  if (progression.daily.date !== getLocalDateKey()) {
    statistics = { ...statistics, progression: { ...progression, daily: createDailyProgress(statistics) } };
  }
  statistics.progression.achievements = unlockAchievements(statistics);
  return statistics;
}

export function getDailyChallengeProgress(statistics: GameStatistics, challengeId: DailyChallengeId) {
  const normalized = normalizeStatistics(statistics);
  const daily = normalized.progression.daily;
  if (challengeId === "play-3") return Math.max(0, normalized.gamesPlayed - daily.baselineGames);
  if (challengeId === "correct-20") return Math.max(0, normalized.correctAnswers - daily.baselineCorrectAnswers);
  return Math.max(0, getTotalPartyWins(normalized.teamWins) - daily.baselinePartyWins);
}

export function applyStatisticsEvent(current: GameStatistics, event: StatisticsEvent): GameStatistics {
  const normalized = normalizeStatistics(current);
  const teamWins = { ...normalized.teamWins };
  if (event.partyWinnerName) {
    const name = event.partyWinnerName.trim() || "Tím";
    teamWins[name] = (teamWins[name] ?? 0) + 1;
  }
  let next: GameStatistics = {
    gamesPlayed: normalized.gamesPlayed + safeNumber(event.gamesStarted),
    correctAnswers: normalized.correctAnswers + safeNumber(event.correctAnswers),
    totalPlaySeconds: normalized.totalPlaySeconds + safeNumber(event.playSeconds),
    teamWins,
    progression: {
      ...normalized.progression,
      xp: normalized.progression.xp + safeNumber(event.gamesStarted) * XP_PER_GAME,
      bombRoundsCompleted: normalized.progression.bombRoundsCompleted + safeNumber(event.bombRoundsCompleted),
      daily: { ...normalized.progression.daily, rewardedChallengeIds: [...normalized.progression.daily.rewardedChallengeIds] },
    },
  };

  for (const challenge of DAILY_CHALLENGES) {
    const completed = getDailyChallengeProgress(next, challenge.id) >= challenge.target;
    const rewarded = next.progression.daily.rewardedChallengeIds.includes(challenge.id);
    if (completed && !rewarded) {
      next.progression.xp += challenge.rewardXp;
      next.progression.coins += challenge.rewardCoins;
      next.progression.daily.rewardedChallengeIds.push(challenge.id);
    }
  }
  next.progression.achievements = unlockAchievements(next);
  return next;
}

export function getLevelInfo(xp: number) {
  const safeXp = safeNumber(xp);
  const level = Math.min(MAX_LEVEL, Math.floor(safeXp / XP_PER_LEVEL) + 1);
  const xpIntoLevel = level === MAX_LEVEL ? XP_PER_LEVEL : safeXp % XP_PER_LEVEL;
  return {
    level,
    xpIntoLevel,
    xpForNextLevel: XP_PER_LEVEL,
    progressPercent: Math.min(100, (xpIntoLevel / XP_PER_LEVEL) * 100),
  };
}
