import { useState } from "react";
import {
  generateBattleRounds,
  shuffle,
  SARADY_WORDS,
  TEAM_CHARACTERS,
  QUIZ_QUESTIONS,
  type BattleRound,
  type GameType,
} from "../../data/teamBattle";

import TeamBattleSetup from "./Setup";
import TeamBattleIntro from "./Intro";
import RoundIntro from "./RoundIntro";
import TimedWords from "./TimedWords";
import TeamQuiz from "./Quiz";
import PingPongTeam from "./PingPongTeam";
import RoundResult from "./RoundResult";
import GameOver from "./GameOver";

type Phase =
  | "setup"
  | "intro"
  | "round-intro"
  | "playing"
  | "round-result"
  | "game-over";

const TURN_BASED: GameType[] = ["pantomima", "sarady", "hadajktosom"];

function wordsForGame(game: GameType): string[] {
  if (game === "sarady") return shuffle(SARADY_WORDS);
  if (game === "hadajktosom") return shuffle(TEAM_CHARACTERS);
  return [];
}

export default function TeamBattle({ onHome }: { onHome: () => void }) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [teamNames, setTeamNames] = useState<[string, string]>(["Tím A", "Tím B"]);
  const [rounds, setRounds] = useState<BattleRound[]>([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [totalScores, setTotalScores] = useState<[number, number]>([0, 0]);
  const [roundScores, setRoundScores] = useState<[number, number]>([0, 0]);

  // Per-round data (words / questions / category) chosen at round start
  const [roundWords, setRoundWords] = useState<string[]>([]);
  const [roundQuestions, setRoundQuestions] = useState(
    () => shuffle(QUIZ_QUESTIONS).slice(0, 5)
  );

  const currentRound = rounds[currentRoundIdx] ?? null;

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSetupStart(names: [string, string], roundCount: number) {
    setTeamNames(names);
    setRounds(generateBattleRounds(roundCount));
    setCurrentRoundIdx(0);
    setTotalScores([0, 0]);
    setRoundScores([0, 0]);
    setPhase("intro");
  }

  function handleIntroEnd() {
    prepareRoundData(0);
    setPhase("round-intro");
  }

  function prepareRoundData(idx: number) {
    const r = rounds[idx];
    if (!r) return;
    if (TURN_BASED.includes(r.game)) {
      setRoundWords(wordsForGame(r.game));
    } else if (r.game === "quiz") {
      setRoundQuestions(shuffle(QUIZ_QUESTIONS).slice(0, 5));
    }
  }

  function handleRoundStart() {
    setPhase("playing");
  }

  function handleRoundDone(scores: [number, number]) {
    if (!currentRound) return;
    const earned: [number, number] = [
      scores[0] * currentRound.pointMultiplier,
      scores[1] * currentRound.pointMultiplier,
    ];
    setRoundScores(scores);
    setTotalScores((prev) => [prev[0] + earned[0], prev[1] + earned[1]]);
    setPhase("round-result");
  }

  function handleNextRound() {
    const next = currentRoundIdx + 1;
    if (next >= rounds.length) {
      setPhase("game-over");
    } else {
      setCurrentRoundIdx(next);
      prepareRoundData(next);
      setPhase("round-intro");
    }
  }

  function handlePlayAgain() {
    setPhase("setup");
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (phase === "setup") {
    return <TeamBattleSetup onBack={onHome} onStart={handleSetupStart} />;
  }

  if (phase === "intro") {
    return <TeamBattleIntro teamNames={teamNames} onDone={handleIntroEnd} />;
  }

  if (phase === "round-intro" && currentRound) {
    return (
      <RoundIntro
        round={currentRound}
        totalRounds={rounds.length}
        scores={totalScores}
        teamNames={teamNames}
        onStart={handleRoundStart}
      />
    );
  }

  if (phase === "playing" && currentRound) {
    const game = currentRound.game;

    if (TURN_BASED.includes(game)) {
      return (
        <TimedWords
          teamNames={teamNames}
          words={roundWords}
          timeSeconds={currentRound.timeSeconds}
          mode={game}
          onDone={handleRoundDone}
        />
      );
    }

    if (game === "quiz") {
      return (
        <TeamQuiz
          questions={roundQuestions}
          teamNames={teamNames}
          onDone={handleRoundDone}
        />
      );
    }

    if (game === "pingpong") {
      return (
        <PingPongTeam
          teamNames={teamNames}
          onDone={handleRoundDone}
        />
      );
    }
  }

  if (phase === "round-result" && currentRound) {
    return (
      <RoundResult
        round={currentRound}
        totalRounds={rounds.length}
        roundScores={roundScores}
        totalScores={totalScores}
        teamNames={teamNames}
        onNext={handleNextRound}
      />
    );
  }

  if (phase === "game-over") {
    return (
      <GameOver
        teamNames={teamNames}
        totalScores={totalScores}
        onPlayAgain={handlePlayAgain}
        onHome={onHome}
      />
    );
  }

  return null;
}
