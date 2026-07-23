import { useLocalStorage } from "./useLocalStorage";
import type { AppStats } from "../types";

const DEFAULT_STATS: AppStats = {
  gamesPlayed: 0,
  teamWins: 0,
  totalTimeSeconds: 0,
  correctAnswers: 0,
};

export function useStats() {
  const [stats, setStats] = useLocalStorage<AppStats>("podvodnik-stats", DEFAULT_STATS);

  function recordGame(opts: {
    timeSeconds?: number;
    correctAnswers?: number;
    teamWin?: boolean;
  }) {
    setStats((prev) => ({
      gamesPlayed: prev.gamesPlayed + 1,
      teamWins: prev.teamWins + (opts.teamWin ? 1 : 0),
      totalTimeSeconds: prev.totalTimeSeconds + (opts.timeSeconds ?? 0),
      correctAnswers: prev.correctAnswers + (opts.correctAnswers ?? 0),
    }));
  }

  function resetStats() {
    setStats(DEFAULT_STATS);
  }

  return { stats, recordGame, resetStats };
}
