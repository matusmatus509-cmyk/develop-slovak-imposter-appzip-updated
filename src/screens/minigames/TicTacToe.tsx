import { useCallback, useEffect, useMemo, useState } from "react";
import { Icons } from "../../components/icons";
import { useFeedback } from "../../feedback/FeedbackProvider";
import { PartyBackdrop, PartyEyebrow } from "../teamBattle/PartyChrome";

type Mark = "X" | "O";
type Cell = Mark | null;
type Mode = "ai" | "local";
type Difficulty = "relaxed" | "master";
type Result = Mark | "draw" | null;

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
] as const;

function evaluate(board: Cell[]): { result: Result; line: readonly number[] } {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return { result: board[a], line };
  }
  return { result: board.every(Boolean) ? "draw" : null, line: [] };
}

function minimax(board: Cell[], ai: Mark, maximizing: boolean, depth = 0): number {
  const { result } = evaluate(board);
  if (result === ai) return 10 - depth;
  if (result && result !== "draw") return depth - 10;
  if (result === "draw") return 0;
  const available = board.map((cell, index) => cell ? -1 : index).filter((index) => index >= 0);
  const scores = available.map((index) => {
    const next = [...board];
    next[index] = maximizing ? ai : ai === "X" ? "O" : "X";
    return minimax(next, ai, !maximizing, depth + 1);
  });
  return maximizing ? Math.max(...scores) : Math.min(...scores);
}

function chooseAiMove(board: Cell[], difficulty: Difficulty) {
  const available = board.map((cell, index) => cell ? -1 : index).filter((index) => index >= 0);
  if (difficulty === "relaxed" && Math.random() < 0.62) return available[Math.floor(Math.random() * available.length)];
  let bestScore = -Infinity;
  let bestMoves: number[] = [];
  available.forEach((index) => {
    const next = [...board];
    next[index] = "O";
    const score = minimax(next, "O", false);
    if (score > bestScore) { bestScore = score; bestMoves = [index]; }
    else if (score === bestScore) bestMoves.push(index);
  });
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

export default function TicTacToe({ onBack }: { onBack: () => void }) {
  const { playFeedback } = useFeedback();
  const [phase, setPhase] = useState<"setup" | "playing">("setup");
  const [mode, setMode] = useState<Mode>("ai");
  const [difficulty, setDifficulty] = useState<Difficulty>("master");
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [starter, setStarter] = useState<Mark>("X");
  const [turn, setTurn] = useState<Mark>("X");
  const [result, setResult] = useState<Result>(null);
  const [winningLine, setWinningLine] = useState<readonly number[]>([]);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [round, setRound] = useState(1);
  const [aiThinking, setAiThinking] = useState(false);

  const names = useMemo(() => ({ X: "Hráč 1", O: mode === "ai" ? "Robot" : "Hráč 2" }), [mode]);

  const finish = useCallback((outcome: Exclude<Result, null>, line: readonly number[]) => {
    setResult(outcome);
    setWinningLine(line);
    setScores((current) => ({ ...current, [outcome]: current[outcome] + 1 }));
    if (outcome === "draw") playFeedback("countdown");
    else if (mode === "ai" && outcome === "O") playFeedback("loss");
    else playFeedback("win");
  }, [mode, playFeedback]);

  const commitMove = useCallback((index: number, mark: Mark) => {
    if (board[index] || result) return;
    const next = [...board];
    next[index] = mark;
    setBoard(next);
    const outcome = evaluate(next);
    if (outcome.result) finish(outcome.result, outcome.line);
    else setTurn(mark === "X" ? "O" : "X");
  }, [board, finish, result]);

  useEffect(() => {
    if (phase !== "playing" || mode !== "ai" || turn !== "O" || result) return;
    setAiThinking(true);
    const timer = window.setTimeout(() => {
      const index = chooseAiMove(board, difficulty);
      if (index !== undefined) commitMove(index, "O");
      setAiThinking(false);
    }, 520);
    return () => { window.clearTimeout(timer); setAiThinking(false); };
  }, [board, commitMove, difficulty, mode, phase, result, turn]);

  function startGame() {
    setBoard(Array(9).fill(null));
    setStarter("X");
    setTurn("X");
    setResult(null);
    setWinningLine([]);
    setScores({ X: 0, O: 0, draw: 0 });
    setRound(1);
    setPhase("playing");
  }

  function nextRound() {
    const nextStarter: Mark = starter === "X" ? "O" : "X";
    setBoard(Array(9).fill(null));
    setStarter(nextStarter);
    setTurn(nextStarter);
    setResult(null);
    setWinningLine([]);
    setRound((value) => value + 1);
  }

  function play(index: number) {
    if (phase !== "playing" || result || board[index] || (mode === "ai" && turn === "O")) return;
    commitMove(index, turn);
  }

  if (phase === "setup") return (
    <PartyBackdrop>
      <main className="h-full overflow-y-auto px-5 pb-9 pt-5 text-white">
        <div className="mx-auto w-full max-w-md">
          <header className="flex items-center justify-between">
            <button onClick={onBack} aria-label="Späť" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[.06] text-white/70 transition active:scale-90"><Icons.chevronLeft size={21} /></button>
            <PartyEyebrow>Klasická hra</PartyEyebrow><div className="h-11 w-11" />
          </header>

          <section className="mt-7 text-center">
            <div className="tic-hero mx-auto grid h-28 w-28 grid-cols-2 place-items-center rounded-[2.1rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 shadow-2xl shadow-cyan-500/10">
              <span className="tic-mark tic-mark-x text-5xl font-black">X</span><span className="tic-mark tic-mark-o text-5xl font-black">O</span>
            </div>
            <p className="mt-6 text-[10px] font-black uppercase tracking-[.26em] text-cyan-300/70">Tri symboly v rade</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-.04em]">Piškvorky</h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/48">Klasický súboj X a O s jemnými animáciami. Zahrajte si na jednom mobile alebo vyzvite robota.</p>
          </section>

          <section className="party-glass mt-7 rounded-[1.8rem] p-5">
            <p className="text-[9px] font-black uppercase tracking-[.22em] text-white/35">Herný režim</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(["ai", "local"] as const).map((value) => <button key={value} onClick={() => setMode(value)} className={`rounded-2xl border p-4 text-left transition active:scale-95 ${mode === value ? "border-cyan-300/45 bg-cyan-400/12" : "border-white/8 bg-white/[.035]"}`}><span className="text-3xl">{value === "ai" ? "🤖" : "👥"}</span><strong className="mt-3 block text-sm font-black">{value === "ai" ? "Proti robotovi" : "Dvaja hráči"}</strong><small className="mt-1 block text-[10px] leading-relaxed text-white/38">{value === "ai" ? "Sólo hra na jednom mobile" : "Striedajte sa po každom ťahu"}</small></button>)}
            </div>
          </section>

          {mode === "ai" && <section className="party-glass mt-3 rounded-[1.8rem] p-5">
            <p className="text-[9px] font-black uppercase tracking-[.22em] text-white/35">Obtiažnosť robota</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["relaxed", "master"] as const).map((value) => <button key={value} onClick={() => setDifficulty(value)} className={`rounded-xl border py-3 text-xs font-black transition active:scale-95 ${difficulty === value ? "border-fuchsia-300/45 bg-fuchsia-400/15 text-white" : "border-white/8 bg-white/[.03] text-white/38"}`}>{value === "relaxed" ? "Pohodová" : "Majster"}</button>)}
            </div>
          </section>}

          <button onClick={startGame} className="party-shine relative mt-6 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 py-5 text-base font-black uppercase tracking-wider text-white shadow-xl shadow-cyan-500/15 transition active:scale-[.97]">Začať hru</button>
        </div>
      </main>
    </PartyBackdrop>
  );

  return (
    <PartyBackdrop>
      <main className="tic-game-screen relative h-[100dvh] overflow-hidden px-4 py-3 text-white">
        <div className="mx-auto flex h-full w-full max-w-md flex-col">
          <header className="flex shrink-0 items-center justify-between">
            <button onClick={() => setPhase("setup")} aria-label="Nastavenie" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.06] text-white/70 transition active:scale-90"><Icons.chevronLeft size={19} /></button>
            <PartyEyebrow>Kolo {round}</PartyEyebrow>
            <div className="h-10 w-10" />
          </header>

          <section className="tic-scoreboard mt-2 grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2">
            {(["X", "O"] as const).map((mark) => <div key={mark} className={`party-glass rounded-xl p-2 ${turn === mark && !result ? "tic-player-active" : ""}`} style={{ borderColor: turn === mark && !result ? (mark === "X" ? "#22d3ee88" : "#e879f988") : undefined }}><p className="truncate text-[7px] font-black uppercase tracking-wider text-white/38">{names[mark]}</p><div className="mt-0.5 flex items-end justify-between"><span className={`tic-mark tic-mark-${mark.toLowerCase()} text-2xl font-black`}>{mark}</span><strong className="text-lg font-black tabular-nums">{scores[mark]}</strong></div></div>)}
            <span className="col-start-2 row-start-1 text-[8px] font-black uppercase tracking-widest text-white/22">vs</span>
          </section>

          <div className="tic-turn-panel relative mt-2 shrink-0 text-center">
            <button onClick={nextRound} aria-label="Nové kolo" className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[.05] text-white/45 transition active:scale-90"><Icons.refresh size={15} /></button>
            <p className={`text-[8px] font-black uppercase tracking-[.22em] ${starter === "X" ? "text-cyan-200/70" : "text-fuchsia-200/70"}`}>Začína: {names[starter]}</p>
            <h1 className="mt-0.5 text-lg font-black">{result === "draw" ? "Remíza" : result ? `${names[result]} vyhráva!` : aiThinking ? "Robot premýšľa…" : `Na ťahu: ${names[turn]}`}</h1>
          </div>

          <section className="tic-board tic-board-shape mx-auto mt-2 grid w-full shrink-0 grid-cols-3 gap-2 rounded-[1.6rem] border border-white/10 bg-black/20 p-2.5 shadow-2xl shadow-black/35">
            {board.map((cell, index) => {
              const winner = winningLine.includes(index);
              return <button key={`${round}-${index}`} onClick={() => play(index)} disabled={Boolean(cell) || Boolean(result) || aiThinking} aria-label={cell ? `Pole ${index + 1}: ${cell}` : `Pole ${index + 1}: prázdne`} className={`tic-cell relative flex items-center justify-center rounded-xl border text-[clamp(2.4rem,12vw,4rem)] font-black transition active:scale-90 ${winner ? "tic-cell-winner" : "border-white/[.08] bg-white/[.045]"}`}>{cell && <span className={`tic-symbol tic-mark tic-mark-${cell.toLowerCase()}`}>{cell}</span>}</button>;
            })}
          </section>

          <div className="mt-2 flex shrink-0 items-center justify-center gap-2 text-[8px] font-bold text-white/35"><span>Remízy</span><span className="rounded-full border border-white/10 bg-white/[.05] px-2 py-0.5 font-black text-white/65">{scores.draw}</span></div>

          {result && <section className="tic-result absolute inset-x-5 top-1/2 z-20 -translate-y-1/2 rounded-[1.5rem] border border-cyan-300/20 bg-[#101827]/95 p-4 text-center shadow-2xl shadow-cyan-950/60 backdrop-blur"><div className="text-3xl">{result === "draw" ? "🤝" : result === "X" ? "✨" : mode === "ai" ? "🤖" : "🎉"}</div><p className="mt-1 text-base font-black">{result === "draw" ? "Tentoraz bez víťaza" : `Víťaz: ${names[result]}`}</p><button onClick={nextRound} className="party-shine relative mt-3 w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 py-2.5 text-[10px] font-black uppercase tracking-wider transition active:scale-95">Ďalšie kolo</button><button onClick={() => setPhase("setup")} className="mt-1 w-full py-2 text-[9px] font-black text-white/38">Zmeniť režim</button></section>}
        </div>
      </main>
    </PartyBackdrop>
  );
}
