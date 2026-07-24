import { useRef, useState } from "react";
import {
  generateBattleRounds,
  QUIZ_QUESTIONS,
  type BattleRound,
  type GameType,
} from "../../data/teamBattle";

import TeamBattleSetup, { type TeamBattleOptions } from "./Setup";
import TeamBattleIntro from "./Intro";
import RoundIntro from "./RoundIntro";
import TimedWords from "./TimedWords";
import TeamQuiz from "./Quiz";
import { SlovnyPingPongGame } from "../minigames/SlovnyPingPong";
import { PartySlovnaRosada } from "../minigames/SlovnaRosada";
import { PartyHadajKtoSom } from "../minigames/HadajKtoSom";
import RoundResult from "./RoundResult";
import GameOver from "./GameOver";
import FinaleIntro from "./FinaleIntro";
import { ForbiddenWordGame, GuessSongGame } from "./PassAndPlay";
import SoundBuzzer from "./SoundBuzzer";
import { FiveInTenGame, LetterChallengeGame } from "./QuickChallenges";
import { defaultTeamName, useLanguage } from "../../i18n/LanguageProvider";
import { takePersistentItems } from "../../utils/persistentDeck";

type Phase =
  | "setup"
  | "intro"
  | "finale"
  | "round-intro"
  | "playing"
  | "round-result"
  | "game-over";

export interface TeamBattleSummary {
  teamNames: [string, string];
  totalScores: [number, number];
  correctAnswers: number;
  winnerName?: string;
}

export default function TeamBattle({
  onHome,
  onGameComplete,
}: {
  onHome: () => void;
  onGameComplete?: (summary: TeamBattleSummary) => void;
}) {
  const { language } = useLanguage();
  const [phase, setPhase] = useState<Phase>("setup");
  const [teamNames, setTeamNames] = useState<[string, string]>([
    defaultTeamName(language, "A"),
    defaultTeamName(language, "B"),
  ]);
  const [rounds, setRounds] = useState<BattleRound[]>([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [totalScores, setTotalScores] = useState<[number, number]>([0, 0]);
  const [roundScores, setRoundScores] = useState<[number, number]>([0, 0]);
  const [quickRounds, setQuickRounds] = useState(2);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const completionReportedRef = useRef(false);

  // Per-round questions are selected at round start.
  const [roundQuestions, setRoundQuestions] = useState(
    () => takePersistentItems("party:quiz", QUIZ_QUESTIONS, 5, (item) => item.question)
  );

  const currentRound = rounds[currentRoundIdx] ?? null;

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSetupStart(names: [string, string], selection: number | GameType[], options: TeamBattleOptions) {
    setTeamNames(names);
    setQuickRounds(options.quickRounds);
    setRounds(generateBattleRounds(selection).map((round) => ({
      ...round,
      timeSeconds: ["pantomima", "sarady", "zakazane", "pesnicka", "hadajktosom"].includes(round.game)
        ? options.timeSeconds
        : round.timeSeconds,
    })));
    setCurrentRoundIdx(0);
    setTotalScores([0, 0]);
    setRoundScores([0, 0]);
    setCorrectAnswers(0);
    completionReportedRef.current = false;
    setPhase("intro");
  }

  function handleIntroEnd() {
    prepareRoundData(0);
    setPhase(rounds[0]?.special === "final" ? "finale" : "round-intro");
  }

  function prepareRoundData(idx: number) {
    const r = rounds[idx];
    if (!r) return;
    if (r.game === "quiz") {
      setRoundQuestions(takePersistentItems("party:quiz", QUIZ_QUESTIONS, 5, (item) => item.question));
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
    setCorrectAnswers((previous) => previous + Math.max(0, scores[0]) + Math.max(0, scores[1]));
    setTotalScores((prev) => [prev[0] + earned[0], prev[1] + earned[1]]);
    setPhase("round-result");
  }

  function handleQuickRoundDone(scores: number[]) {
    handleRoundDone([scores[0] ?? 0, scores[1] ?? 0]);
  }

  function handleNextRound() {
    const next = currentRoundIdx + 1;
    if (next >= rounds.length) {
      if (!completionReportedRef.current) {
        completionReportedRef.current = true;
        const winnerName = totalScores[0] === totalScores[1]
          ? undefined
          : teamNames[totalScores[0] > totalScores[1] ? 0 : 1];
        onGameComplete?.({ teamNames, totalScores, correctAnswers, winnerName });
      }
      setPhase("game-over");
    } else {
      setCurrentRoundIdx(next);
      prepareRoundData(next);
      setPhase(rounds[next]?.special === "final" ? "finale" : "round-intro");
    }
  }

  function handlePlayAgain() {
    setCorrectAnswers(0);
    completionReportedRef.current = false;
    setPhase("setup");
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (phase === "setup") {
    return <TeamBattleSetup onBack={onHome} onStart={handleSetupStart} />;
  }

  if (phase === "intro") {
    return <TeamBattleIntro teamNames={teamNames} onDone={handleIntroEnd} />;
  }

  if (phase === "finale" && currentRound) {
    return (
      <FinaleIntro
        teamNames={teamNames}
        scores={totalScores}
        onContinue={() => setPhase("round-intro")}
      />
    );
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

    if (game === "pantomima") {
      return (
        <TimedWords
          teamNames={teamNames}
          words={[]}
          timeSeconds={currentRound.timeSeconds}
          mode={game}
          onDone={handleRoundDone}
        />
      );
    }

    if (game === "sarady") {
      return (
        <PartySlovnaRosada
          teamNames={teamNames}
          timerSecs={currentRound.timeSeconds}
          onDone={handleRoundDone}
        />
      );
    }

    if (game === "hadajktosom") {
      return (
        <PartyHadajKtoSom
          teamNames={teamNames}
          timerSeconds={currentRound.timeSeconds}
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
        <SlovnyPingPongGame
          name1={teamNames[0]}
          name2={teamNames[1]}
          secsToEdge={4}
          onBack={() => handleRoundDone([0, 0])}
          onWinner={(winner) => handleRoundDone(winner === 0 ? [1, 0] : [0, 1])}
        />
      );
    }

    if (game === "zakazane") {
      return <ForbiddenWordGame participantNames={teamNames} gameMode="teams" rounds={quickRounds} timeSeconds={currentRound.timeSeconds} onDone={handleQuickRoundDone} />;
    }

    if (game === "pesnicka") {
      return <GuessSongGame participantNames={teamNames} gameMode="teams" rounds={quickRounds} timeSeconds={currentRound.timeSeconds} onDone={handleQuickRoundDone} />;
    }

    if (game === "zvuk") {
      return <SoundBuzzer participantNames={teamNames} gameMode="teams" rounds={quickRounds * 5} onDone={handleQuickRoundDone} />;
    }

    if (game === "pismeno") {
      return <LetterChallengeGame participantNames={teamNames} gameMode="teams" rounds={quickRounds} onDone={handleQuickRoundDone} />;
    }

    if (game === "patzadesat") {
      return <FiveInTenGame participantNames={teamNames} gameMode="teams" rounds={quickRounds} onDone={handleQuickRoundDone} />;
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
