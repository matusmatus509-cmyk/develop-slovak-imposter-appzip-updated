import { useState } from "react";
import type {
  GameSettings,
  RoundAssignment,
  RoundHistoryEntry,
  Screen,
} from "./types";
import { CATEGORIES } from "./data/categories";
import { generateRound } from "./utils/gameLogic";
import { useLocalStorage } from "./hooks/useLocalStorage";

import Home from "./screens/Home";
import Setup from "./screens/impostor/Setup";
import Reveal from "./screens/impostor/Reveal";
import Discussion from "./screens/impostor/Discussion";
import Voting from "./screens/impostor/Voting";
import Result from "./screens/impostor/Result";
import History from "./screens/impostor/History";
import TruthOrDare from "./screens/minigames/TruthOrDare";
import NeverHaveIEver from "./screens/minigames/NeverHaveIEver";
import WouldYouRather from "./screens/minigames/WouldYouRather";
import DrawingSetup from "./screens/drawing/Setup";
import DrawingCanvas from "./screens/drawing/Canvas";
import DrawingVote from "./screens/drawing/Vote";
import DrawingResult from "./screens/drawing/Result";
import SlovnaRosada from "./screens/minigames/SlovnaRosada";
import SlovnyPingPong from "./screens/minigames/SlovnyPingPong";
import HadajKtoSom from "./screens/minigames/HadajKtoSom";

const DEFAULT_SETTINGS: GameSettings = {
  playerNames: ["Hráč 1", "Hráč 2", "Hráč 3", "Hráč 4"],
  categoryIds: CATEGORIES.map((c) => c.id),
  impostorCount: 1,
  hintsEnabled: true,
  noRepeatWords: true,
  timerSeconds: 90,
  strokesPerPlayer: 3,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [settings, setSettings] = useLocalStorage<GameSettings>(
    "podvodnik-settings",
    DEFAULT_SETTINGS
  );
  const [history, setHistory] = useLocalStorage<RoundHistoryEntry[]>(
    "podvodnik-history",
    []
  );
  const [usedWords, setUsedWords] = useLocalStorage<Record<string, string[]>>(
    "podvodnik-used-words",
    {}
  );

  const [assignment, setAssignment] = useState<RoundAssignment | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [votedIndex, setVotedIndex] = useState<number | null>(null);

  // Drawing game state
  const [drawingSettings, setDrawingSettings] = useLocalStorage<GameSettings>(
    "drawing-settings",
    DEFAULT_SETTINGS
  );
  const [drawingAssignment, setDrawingAssignment] =
    useState<RoundAssignment | null>(null);
  const [drawingVotedIndex, setDrawingVotedIndex] = useState<number | null>(null);

  function startNewRound(currentSettings: GameSettings) {
    const { assignment: newAssignment, usedWords: newUsed } = generateRound(
      currentSettings,
      CATEGORIES,
      usedWords
    );
    setAssignment(newAssignment);
    setUsedWords(newUsed);
    setVotedIndex(null);
    setElapsedSeconds(0);
    setScreen("impostor-reveal");
  }

  function handleStartSetup(newSettings: GameSettings) {
    setSettings(newSettings);
    startNewRound(newSettings);
  }

  function startDrawingRound(s: GameSettings) {
    const { assignment: a, usedWords: newUsed } = generateRound(s, CATEGORIES, usedWords);
    setDrawingAssignment(a);
    setUsedWords(newUsed);
    setDrawingVotedIndex(null);
    setScreen("drawing-reveal");
  }

  function handleDrawingSetupStart(s: GameSettings) {
    setDrawingSettings(s);
    startDrawingRound(s);
  }

  function handleDrawingVote(voted: number | null) {
    setDrawingVotedIndex(voted);
    setScreen("drawing-result");
  }

  function handleVoteConfirm(voted: number | null) {
    if (!assignment) return;
    setVotedIndex(voted);
    const caught =
      voted !== null && assignment.impostorIndexes.includes(voted);
    const entry: RoundHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      roundNumber: history.length + 1,
      word: assignment.word,
      categoryName: assignment.categoryName,
      categoryIcon: assignment.categoryIcon,
      timeSeconds: elapsedSeconds || settings.timerSeconds,
      impostors: assignment.impostorIndexes.map(
        (i) => settings.playerNames[i]
      ),
      playersWon: caught,
      timestamp: Date.now(),
    };
    setHistory([...history, entry]);
    setScreen("impostor-result");
  }

  switch (screen) {
    case "home":
      return <Home onNavigate={setScreen} />;

    case "impostor-setup":
      return (
        <Setup
          initial={settings}
          onBack={() => setScreen("home")}
          onStart={handleStartSetup}
        />
      );

    case "impostor-reveal":
      if (!assignment) {
        setScreen("impostor-setup");
        return null;
      }
      return (
        <Reveal
          settings={settings}
          assignment={assignment}
          onExit={() => setScreen("home")}
          onDone={() => setScreen("impostor-discussion")}
        />
      );

    case "impostor-discussion":
      return (
        <Discussion
          settings={settings}
          onExit={() => setScreen("home")}
          onFinish={(elapsed) => {
            setElapsedSeconds(elapsed);
            setScreen("impostor-voting");
          }}
        />
      );

    case "impostor-voting":
      return (
        <Voting
          settings={settings}
          onExit={() => setScreen("home")}
          onConfirm={handleVoteConfirm}
        />
      );

    case "impostor-result":
      if (!assignment) {
        setScreen("home");
        return null;
      }
      return (
        <Result
          settings={settings}
          assignment={assignment}
          votedIndex={votedIndex}
          onNewRound={() => startNewRound(settings)}
          onHome={() => setScreen("home")}
          onHistory={() => setScreen("impostor-history")}
        />
      );

    case "impostor-history":
      return (
        <History
          history={history}
          onBack={() => setScreen("home")}
          onClear={() => {
            setHistory([]);
            setUsedWords({});
          }}
        />
      );

    case "truth-or-dare":
      return <TruthOrDare onBack={() => setScreen("home")} />;

    case "never-have-i-ever":
      return <NeverHaveIEver onBack={() => setScreen("home")} />;

    case "would-you-rather":
      return <WouldYouRather onBack={() => setScreen("home")} />;

    case "drawing-setup":
      return (
        <DrawingSetup
          initial={drawingSettings}
          onBack={() => setScreen("home")}
          onStart={handleDrawingSetupStart}
        />
      );

    case "drawing-reveal":
      if (!drawingAssignment) {
        setScreen("drawing-setup");
        return null;
      }
      return (
        <Reveal
          settings={drawingSettings}
          assignment={drawingAssignment}
          onExit={() => setScreen("home")}
          onDone={() => setScreen("drawing-canvas")}
        />
      );

    case "drawing-canvas":
      if (!drawingAssignment) {
        setScreen("drawing-setup");
        return null;
      }
      return (
        <DrawingCanvas
          settings={drawingSettings}
          assignment={drawingAssignment}
          onExit={() => setScreen("home")}
          onVote={() => setScreen("drawing-vote")}
        />
      );

    case "drawing-vote":
      return (
        <DrawingVote
          settings={drawingSettings}
          onExit={() => setScreen("home")}
          onConfirm={handleDrawingVote}
        />
      );

    case "drawing-result":
      if (!drawingAssignment) {
        setScreen("home");
        return null;
      }
      return (
        <DrawingResult
          settings={drawingSettings}
          assignment={drawingAssignment}
          votedIndex={drawingVotedIndex}
          onNewRound={() => startDrawingRound(drawingSettings)}
          onHome={() => setScreen("home")}
        />
      );

    case "slovnarosada":
      return <SlovnaRosada onBack={() => setScreen("home")} />;

    case "pingpong":
      return <SlovnyPingPong onBack={() => setScreen("home")} />;

    case "hadajktosom":
      return <HadajKtoSom onBack={() => setScreen("home")} />;

    default:
      return <Home onNavigate={setScreen} />;
  }
}
