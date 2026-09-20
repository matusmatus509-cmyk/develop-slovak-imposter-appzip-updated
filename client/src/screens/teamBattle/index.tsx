import { useRef, useState, type ReactNode } from "react";
import { generateBattleRounds, type BattleRound, type GameType, type QuizDifficulty, type QuizQuestion } from "../../data/teamBattle";
import { drawQuizDuelQuestions, type ResolvedQuizDuelQuestion } from "../../data/quizDuel";
import { buildQuizDuelKindOrder, QUIZ_DUEL_QUESTIONS_PER_ROUND, type TeamIndex } from "./quizDuelRound";
import TeamBattleSetup, { type TeamBattleOptions, type TeamBattleSetupDraft } from "./Setup";
import TeamBattleGamePicker from "./GamePicker";
import TeamBattleRoundCountPicker from "./RoundCountPicker";
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
import MusicBuzzer from "./MusicBuzzer";
import { FiveInTenGame, LetterChallengeGame } from "./QuickChallenges";
import PartyTeamOrientation from "./PartyTeamOrientation";
import { defaultTeamName, useLanguage } from "../../i18n/LanguageProvider";
import type { WordGuessRecordInput } from "../../types";
import type { CustomContentControls } from "../../components/CustomContentSelector";

type Phase = "setup" | "round-picker" | "game-picker" | "intro" | "finale" | "round-intro" | "playing" | "round-result" | "game-over";

export interface TeamBattleSummary {
  teamNames: [string, string];
  totalScores: [number, number];
  correctAnswers: number;
  durationSeconds: number;
  winnerName?: string;
}

export default function TeamBattle({ onHome, onGameComplete, onWordGuessed, customQuestions: _customQuestions = [], customControls }: {
  onHome: () => void;
  onGameComplete?: (summary: TeamBattleSummary) => void;
  onWordGuessed?: (record: WordGuessRecordInput) => void;
  customQuestions?: QuizQuestion[];
  customControls?: CustomContentControls;
}) {
  const { language } = useLanguage();
  const [phase, setPhase] = useState<Phase>("setup");
  const [teamNames, setTeamNames] = useState<[string, string]>([defaultTeamName(language, "A"), defaultTeamName(language, "B")]);
  const [selectedGames, setSelectedGames] = useState<GameType[]>([]);
  const [setupDraft, setSetupDraft] = useState<TeamBattleSetupDraft | null>(null);
  const [rounds, setRounds] = useState<BattleRound[]>([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [totalScores, setTotalScores] = useState<[number, number]>([0, 0]);
  const [roundScores, setRoundScores] = useState<[number, number]>([0, 0]);
  const [quickRounds, setQuickRounds] = useState(2);
  const [quizDifficulty, setQuizDifficulty] = useState<QuizDifficulty>("lahke");
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [roundQuestions, setRoundQuestions] = useState<ResolvedQuizDuelQuestion[]>([]);
  const [quizStartTeam, setQuizStartTeam] = useState<TeamIndex>(0);
  const completionReportedRef = useRef(false);
  const partyStartedAtRef = useRef<number | null>(null);
  const currentRound = rounds[currentRoundIdx] ?? null;

  function chooseQuizQuestions(difficulty: QuizDifficulty) {
    return drawQuizDuelQuestions(language, difficulty, buildQuizDuelKindOrder(QUIZ_DUEL_QUESTIONS_PER_ROUND));
  }

  function handleSetupStart(names: [string, string], selection: number | GameType[], options: TeamBattleOptions) {
    setTeamNames(names);
    setQuickRounds(options.quickRounds);
    setQuizDifficulty(options.quizDifficulty);
    setRounds(generateBattleRounds(selection).map(round => ({
      ...round,
      timeSeconds: ["pantomima", "sarady", "zakazane", "pesnicka", "hadajktosom"].includes(round.game) ? options.timeSeconds : round.timeSeconds,
    })));
    setCurrentRoundIdx(0);
    setTotalScores([0, 0]);
    setRoundScores([0, 0]);
    setCorrectAnswers(0);
    partyStartedAtRef.current = Date.now();
    completionReportedRef.current = false;
    setPhase("intro");
  }

  function prepareRoundData(index: number) {
    if (rounds[index]?.game === "quiz") {
      setRoundQuestions(chooseQuizQuestions(quizDifficulty));
      setQuizStartTeam(Math.random() < 0.5 ? 0 : 1);
    }
  }

  function handleRoundDone(scores: [number, number]) {
    if (!currentRound) return;
    const earned: [number, number] = [scores[0] * currentRound.pointMultiplier, scores[1] * currentRound.pointMultiplier];
    setRoundScores(scores);
    setCorrectAnswers(previous => previous + Math.max(0, scores[0]) + Math.max(0, scores[1]));
    setTotalScores(previous => [previous[0] + earned[0], previous[1] + earned[1]]);
    setPhase("round-result");
  }

  function handleNextRound() {
    const next = currentRoundIdx + 1;
    if (next >= rounds.length) {
      if (!completionReportedRef.current) {
        completionReportedRef.current = true;
        const winnerName = totalScores[0] === totalScores[1] ? undefined : teamNames[totalScores[0] > totalScores[1] ? 0 : 1];
        const durationSeconds = Math.max(1, Math.round((Date.now() - (partyStartedAtRef.current ?? Date.now())) / 1000));
        onGameComplete?.({ teamNames, totalScores, correctAnswers, durationSeconds, winnerName });
      }
      setPhase("game-over");
      return;
    }
    setCurrentRoundIdx(next);
    prepareRoundData(next);
    setPhase(rounds[next]?.special === "final" ? "finale" : "round-intro");
  }

  const oriented = (content: ReactNode) => (
    <PartyTeamOrientation teamNames={teamNames}>{content}</PartyTeamOrientation>
  );

  if (phase === "setup") return <div className="party-phase-shell"><TeamBattleSetup initialDraft={setupDraft} onBack={onHome} onStartRandomSelection={draft => { setSetupDraft(draft); setPhase("round-picker"); }} onStartManualSelection={draft => { setSetupDraft(draft); setPhase("game-picker"); }} customControls={customControls} /></div>;

  if (phase === "round-picker") return <div className="party-phase-shell"><TeamBattleRoundCountPicker onBack={() => setPhase("setup")} onStart={count => { if (!setupDraft) return setPhase("setup"); handleSetupStart(setupDraft.teamNames, count, setupDraft.options); }} /></div>;

  if (phase === "game-picker") return <div className="party-phase-shell"><TeamBattleGamePicker initialSelectedGames={selectedGames} onBack={() => setPhase("setup")} onConfirm={games => { setSelectedGames(games); if (!setupDraft) return setPhase("setup"); handleSetupStart(setupDraft.teamNames, games, setupDraft.options); }} /></div>;

  if (phase === "intro") return <div className="party-phase-shell"><TeamBattleIntro teamNames={teamNames} onDone={() => { prepareRoundData(0); setPhase(rounds[0]?.special === "final" ? "finale" : "round-intro"); }} /></div>;

  if (phase === "finale" && currentRound) return <div className="party-phase-shell"><FinaleIntro teamNames={teamNames} scores={totalScores} onContinue={() => setPhase("round-intro")} /></div>;

  if (phase === "round-intro" && currentRound) return <RoundIntro round={currentRound} totalRounds={rounds.length} scores={totalScores} teamNames={teamNames} onStart={() => setPhase("playing")} />;

  if (phase === "playing" && currentRound) {
    const doneQuick = (scores: number[]) => handleRoundDone([scores[0] ?? 0, scores[1] ?? 0]);
    let game: ReactNode = null;
    switch (currentRound.game) {
      case "pantomima": game = <TimedWords teamNames={teamNames} words={[]} timeSeconds={currentRound.timeSeconds} mode="pantomima" onDone={handleRoundDone} />; break;
      case "sarady": game = <PartySlovnaRosada teamNames={teamNames} timerSecs={currentRound.timeSeconds} onWordGuessed={onWordGuessed} onDone={handleRoundDone} />; break;
      case "hadajktosom": game = <PartyHadajKtoSom teamNames={teamNames} timerSeconds={currentRound.timeSeconds} onWordGuessed={onWordGuessed} onDone={handleRoundDone} />; break;
      case "quiz": game = <TeamQuiz questions={roundQuestions} teamNames={teamNames} startTeam={quizStartTeam} onDone={handleRoundDone} />; break;
      case "pingpong": game = <SlovnyPingPongGame name1={teamNames[0]} name2={teamNames[1]} secsToEdge={4} onBack={() => handleRoundDone([0, 0])} onWinner={winner => handleRoundDone(winner === 0 ? [1, 0] : [0, 1])} />; break;
      case "zakazane": game = <ForbiddenWordGame participantNames={teamNames} gameMode="teams" rounds={quickRounds} timeSeconds={currentRound.timeSeconds} onDone={doneQuick} />; break;
      case "pesnicka": game = <GuessSongGame participantNames={teamNames} gameMode="teams" rounds={quickRounds} timeSeconds={currentRound.timeSeconds} onDone={doneQuick} />; break;
      case "hudobny-kviz": game = <MusicBuzzer participantNames={teamNames} gameMode="teams" rounds={quickRounds * 5} timeSeconds={10} onDone={doneQuick} />; break;
      case "zvuk": game = <SoundBuzzer participantNames={teamNames} gameMode="teams" rounds={quickRounds * 5} onDone={doneQuick} />; break;
      case "pismeno": game = <LetterChallengeGame participantNames={teamNames} gameMode="teams" rounds={quickRounds} onDone={doneQuick} />; break;
      case "patzadesat": game = <FiveInTenGame participantNames={teamNames} gameMode="teams" rounds={quickRounds} onDone={doneQuick} />; break;
    }
    return oriented(game);
  }

  if (phase === "round-result" && currentRound) return <RoundResult round={currentRound} totalRounds={rounds.length} roundScores={roundScores} totalScores={totalScores} teamNames={teamNames} onNext={handleNextRound} />;

  if (phase === "game-over") return <GameOver teamNames={teamNames} totalScores={totalScores} onPlayAgain={() => { setCorrectAnswers(0); completionReportedRef.current = false; setPhase("setup"); }} onHome={onHome} />;

  return null;
}
