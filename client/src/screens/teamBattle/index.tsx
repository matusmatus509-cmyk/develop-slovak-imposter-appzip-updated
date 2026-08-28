import { useRef, useState } from "react";
import {
  generateBattleRounds,
  type BattleRound,
  type GameType,
  type QuizDifficulty,
  type QuizQuestion,
} from "../../data/teamBattle";
import {
  drawQuizDuelQuestions,
  type ResolvedQuizDuelQuestion,
} from "../../data/quizDuel";
import {
  buildQuizDuelKindOrder,
  QUIZ_DUEL_QUESTIONS_PER_ROUND,
  type TeamIndex,
} from "./quizDuelRound";

import TeamBattleSetup, { type TeamBattleOptions } from "./Setup";
/** Dizajn: Párty výber sa otvára až po štarte vlastnej zostavy; aktuálne hero karty potvrdia poradie a potom sa hra začne priamo. */
import TeamBattleGamePicker from "./GamePicker";
/** Dĺžka náhodnej bitky sa vyberá až po štarte, na vlastnej obrazovke. */
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
import { defaultTeamName, useLanguage } from "../../i18n/LanguageProvider";
import type { WordGuessRecordInput } from "../../types";
import type { CustomContentControls } from "../../components/CustomContentSelector";

type Phase =
  | "setup"
  | "round-picker"
  | "game-picker"
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
  durationSeconds: number;
  winnerName?: string;
}

export default function TeamBattle({
  onHome,
  onGameComplete,
  onWordGuessed,
  customQuestions = [],
  customControls,
}: {
  onHome: () => void;
  onGameComplete?: (summary: TeamBattleSummary) => void;
  onWordGuessed?: (record: WordGuessRecordInput) => void;
  customQuestions?: QuizQuestion[];
  customControls?: CustomContentControls;
}) {
  const { language } = useLanguage();
  /**
   * Kvízový súboj: najprv sa vyžrebuje zloženie kola (typy otázok) a potom sa
   * pre každý typ vytiahne otázka z vlastného decku bez opakovania.
   *
   * Poznámka: vlastné otázky z Dielne (`customQuestions`) majú len text a
   * odpoveď — nové formáty potrebujú možnosti alebo číselnú hodnotu, takže sa
   * do kvízového kola nepridávajú. (Ani v predchádzajúcej verzii sa nepoužili,
   * lebo im chýbala náročnosť, podľa ktorej sa filtrovalo.)
   */
  function chooseQuizQuestions(difficulty: QuizDifficulty) {
    const kinds = buildQuizDuelKindOrder(QUIZ_DUEL_QUESTIONS_PER_ROUND);
    return drawQuizDuelQuestions(language, difficulty, kinds);
  }
  const [phase, setPhase] = useState<Phase>("setup");
  const [teamNames, setTeamNames] = useState<[string, string]>([
    defaultTeamName(language, "A"),
    defaultTeamName(language, "B"),
  ]);
  const [selectedGames, setSelectedGames] = useState<GameType[]>([]);
  const [pendingManualSetup, setPendingManualSetup] = useState<{
    teamNames: [string, string];
    options: TeamBattleOptions;
  } | null>(null);
  /** Setup pre náhodnú zostavu čaká, kým sa na vlastnej obrazovke zvolí dĺžka. */
  const [pendingRandomSetup, setPendingRandomSetup] = useState<{
    teamNames: [string, string];
    options: TeamBattleOptions;
  } | null>(null);
  /** Naposledy zvolená dĺžka bitky — obrazovka sa otvorí s ňou predvybranou. */
  const [randomRounds, setRandomRounds] = useState(5);
  const [rounds, setRounds] = useState<BattleRound[]>([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [totalScores, setTotalScores] = useState<[number, number]>([0, 0]);
  const [roundScores, setRoundScores] = useState<[number, number]>([0, 0]);
  const [quickRounds, setQuickRounds] = useState(2);
  const [quizDifficulty, setQuizDifficulty] = useState<QuizDifficulty>("lahke");
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const completionReportedRef = useRef(false);
  const partyStartedAtRef = useRef<number | null>(null);

  // Per-round questions are selected at round start.
  const [roundQuestions, setRoundQuestions] = useState<ResolvedQuizDuelQuestion[]>([]);
  /** Kto v kvíze začína pri sekvenčných typoch — striedanie drží kolo férové. */
  const [quizStartTeam, setQuizStartTeam] = useState<TeamIndex>(0);

  const currentRound = rounds[currentRoundIdx] ?? null;

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSetupStart(names: [string, string], selection: number | GameType[], options: TeamBattleOptions) {
    setTeamNames(names);
    setQuickRounds(options.quickRounds);
    setQuizDifficulty(options.quizDifficulty);
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
    partyStartedAtRef.current = Date.now();
    completionReportedRef.current = false;
    setPhase("intro");
  }

  function handleManualSelectionStart(names: [string, string], options: TeamBattleOptions) {
    setPendingManualSetup({ teamNames: names, options });
    setPhase("game-picker");
  }

  function handleRandomSelectionStart(names: [string, string], options: TeamBattleOptions) {
    setPendingRandomSetup({ teamNames: names, options });
    setPhase("round-picker");
  }

  function handleIntroEnd() {
    prepareRoundData(0);
    setPhase(rounds[0]?.special === "final" ? "finale" : "round-intro");
  }

  function prepareRoundData(idx: number) {
    const r = rounds[idx];
    if (!r) return;
    if (r.game === "quiz") {
      setRoundQuestions(chooseQuizQuestions(quizDifficulty));
      setQuizStartTeam(Math.random() < 0.5 ? 0 : 1);
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
        const durationSeconds = Math.max(1, Math.round((Date.now() - (partyStartedAtRef.current ?? Date.now())) / 1000));
        onGameComplete?.({ teamNames, totalScores, correctAnswers, durationSeconds, winnerName });
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
    return <div className="party-phase-shell" key="setup"><TeamBattleSetup onBack={onHome} onStartRandomSelection={handleRandomSelectionStart} onStartManualSelection={handleManualSelectionStart} customControls={customControls} /></div>;
  }

  if (phase === "round-picker") {
    return (
      <div className="party-phase-shell" key="round-picker">
        <TeamBattleRoundCountPicker
          initialRounds={randomRounds}
          onBack={() => { setPendingRandomSetup(null); setPhase("setup"); }}
          onConfirm={(count) => {
            setRandomRounds(count);
            if (!pendingRandomSetup) { setPhase("setup"); return; }
            const { teamNames: names, options } = pendingRandomSetup;
            setPendingRandomSetup(null);
            handleSetupStart(names, count, options);
          }}
        />
      </div>
    );
  }

  if (phase === "game-picker") {
    return (
      <div className="party-phase-shell" key="game-picker">
        <TeamBattleGamePicker
          initialSelectedGames={selectedGames}
          onBack={() => { setPendingManualSetup(null); setPhase("setup"); }}
          onConfirm={(games) => {
            setSelectedGames(games);
            if (!pendingManualSetup) { setPhase("setup"); return; }
            const { teamNames: names, options } = pendingManualSetup;
            setPendingManualSetup(null);
            handleSetupStart(names, games, options);
          }}
        />
      </div>
    );
  }

  if (phase === "intro") {
    return <div className="party-phase-shell" key="intro"><TeamBattleIntro teamNames={teamNames} onDone={handleIntroEnd} /></div>;
  }

  if (phase === "finale" && currentRound) {
    return (
      <div className="party-phase-shell" key="finale">
        <FinaleIntro
          teamNames={teamNames}
          scores={totalScores}
          onContinue={() => setPhase("round-intro")}
        />
      </div>
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
          onWordGuessed={onWordGuessed}
          onDone={handleRoundDone}
        />
      );
    }

    if (game === "hadajktosom") {
      return (
        <PartyHadajKtoSom
          teamNames={teamNames}
          timerSeconds={currentRound.timeSeconds}
          onWordGuessed={onWordGuessed}
          onDone={handleRoundDone}
        />
      );
    }

    if (game === "quiz") {
      return (
        <TeamQuiz
          questions={roundQuestions}
          teamNames={teamNames}
          startTeam={quizStartTeam}
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

    if (game === "hudobny-kviz") {
      return <MusicBuzzer participantNames={teamNames} gameMode="teams" rounds={quickRounds * 5} timeSeconds={10} onDone={handleQuickRoundDone} />;
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
