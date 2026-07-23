import { useState } from "react";
import {
  generateBattleRounds,
  getTeamCharacters,
  SARADY_WORDS,
  QUIZ_QUESTIONS,
  type BattleRound,
  type GameType,
} from "../../data/teamBattle";

import TeamBattleSetup, { type TeamBattleOptions } from "./Setup";
import TeamBattleIntro from "./Intro";
import RoundIntro from "./RoundIntro";
import TimedWords from "./TimedWords";
import TeamQuiz from "./Quiz";
import PingPongTeam from "./PingPongTeam";
import RoundResult from "./RoundResult";
import GameOver from "./GameOver";
import { ForbiddenWordGame, GuessSongGame } from "./PassAndPlay";
import SoundBuzzer from "./SoundBuzzer";
import { FiveInTenGame, LetterChallengeGame } from "./QuickChallenges";
import { defaultTeamName, useLanguage, type AppLanguage } from "../../i18n/LanguageProvider";
import { takePersistentItems } from "../../utils/persistentDeck";

type Phase =
  | "setup"
  | "intro"
  | "round-intro"
  | "playing"
  | "round-result"
  | "game-over";

const TURN_BASED: GameType[] = ["pantomima", "sarady", "hadajktosom"];

function wordsForGame(game: GameType, language: AppLanguage): string[] {
  if (game === "sarady") return takePersistentItems("party:charades", SARADY_WORDS, SARADY_WORDS.length);
  if (game === "hadajktosom") {
    const characters = getTeamCharacters(language);
    return takePersistentItems(`party:guess-who:${language}`, characters, characters.length);
  }
  return [];
}

export default function TeamBattle({
  onHome,
  onGameOver,
}: {
  onHome: () => void;
  onGameOver?: (scores: [number, number], teamNames: [string, string]) => void;
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

  // Per-round data (words / questions / category) chosen at round start
  const [roundWords, setRoundWords] = useState<string[]>([]);
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
      setRoundWords(wordsForGame(r.game, language));
    } else if (r.game === "quiz") {
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
    setTotalScores((prev) => [prev[0] + earned[0], prev[1] + earned[1]]);
    setPhase("round-result");
  }

  function handleQuickRoundDone(scores: number[]) {
    handleRoundDone([scores[0] ?? 0, scores[1] ?? 0]);
  }

  function handleNextRound() {
    const next = currentRoundIdx + 1;
    if (next >= rounds.length) {
      onGameOver?.(totalScores, teamNames);
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
