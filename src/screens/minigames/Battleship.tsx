import { Fragment, useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Icons } from "../../components/icons";
import { useFeedback } from "../../feedback/FeedbackProvider";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { PartyBackdrop, PartyEyebrow } from "../teamBattle/PartyChrome";

type Orientation = "horizontal" | "vertical";
type CellState = "EMPTY" | "SHIP" | "MISS" | "HIT" | "SUNK";
type ShotState = Exclude<CellState, "EMPTY" | "SHIP"> | null;
type Phase = "setup" | "deploying" | "playing" | "finished";
type Turn = "player" | "ai";
type ShotResult = "miss" | "hit" | "sunk" | "win";

interface ShipDefinition { id: string; name: string; shortName: string; length: number }
interface ShipState extends ShipDefinition { cells: number[]; hits: number[]; sunk: boolean }
interface BoardState { ships: ShipState[]; shots: ShotState[] }

const SIZE = 10;
const ROWS = "ABCDEFGHIJ".split("");
const FLEET: ShipDefinition[] = [
  { id: "carrier", name: "Lietadlová loď", shortName: "Lietadlová", length: 5 },
  { id: "battleship", name: "Bojová loď", shortName: "Bojová", length: 4 },
  { id: "cruiser-a", name: "Krížnik I", shortName: "Krížnik I", length: 3 },
  { id: "cruiser-b", name: "Krížnik II", shortName: "Krížnik II", length: 3 },
  { id: "destroyer", name: "Torpédoborec", shortName: "Torpédoborec", length: 2 },
];

function emptyBoard(ships: ShipState[] = []): BoardState {
  return { ships, shots: Array<ShotState>(SIZE * SIZE).fill(null) };
}

function placementCells(start: number, length: number, orientation: Orientation): number[] | null {
  const row = Math.floor(start / SIZE);
  const column = start % SIZE;
  if (orientation === "horizontal" && column + length > SIZE) return null;
  if (orientation === "vertical" && row + length > SIZE) return null;
  return Array.from({ length }, (_, offset) => start + (orientation === "horizontal" ? offset : offset * SIZE));
}

function neighbours(index: number) {
  const row = Math.floor(index / SIZE);
  const column = index % SIZE;
  const result: number[] = [];
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
      if (rowOffset === 0 && columnOffset === 0) continue;
      const nextRow = row + rowOffset;
      const nextColumn = column + columnOffset;
      if (nextRow >= 0 && nextRow < SIZE && nextColumn >= 0 && nextColumn < SIZE) result.push(nextRow * SIZE + nextColumn);
    }
  }
  return result;
}

function isValidPlacement(cells: number[] | null, ships: ShipState[], noTouching: boolean) {
  if (!cells) return false;
  const occupied = new Set(ships.flatMap((ship) => ship.cells));
  if (cells.some((cell) => occupied.has(cell))) return false;
  return !noTouching || cells.every((cell) => neighbours(cell).every((nearby) => !occupied.has(nearby)));
}

function randomFleet(noTouching: boolean): ShipState[] {
  for (let restart = 0; restart < 80; restart += 1) {
    const ships: ShipState[] = [];
    let failed = false;
    for (const definition of FLEET) {
      let cells: number[] | null = null;
      for (let attempt = 0; attempt < 500; attempt += 1) {
        const orientation: Orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
        const candidate = placementCells(Math.floor(Math.random() * SIZE * SIZE), definition.length, orientation);
        if (isValidPlacement(candidate, ships, noTouching)) { cells = candidate; break; }
      }
      if (!cells) { failed = true; break; }
      ships.push({ ...definition, cells, hits: [], sunk: false });
    }
    if (!failed) return ships;
  }
  return [];
}

function resolveShot(board: BoardState, index: number): { board: BoardState; result: ShotResult; ship?: ShipState } | null {
  if (board.shots[index]) return null;
  const target = board.ships.find((ship) => ship.cells.includes(index));
  const shots = [...board.shots];
  if (!target) {
    shots[index] = "MISS";
    return { board: { ...board, shots }, result: "miss" };
  }
  const ships = board.ships.map((ship) => {
    if (ship.id !== target.id) return ship;
    const hits = ship.hits.includes(index) ? ship.hits : [...ship.hits, index];
    return { ...ship, hits, sunk: hits.length === ship.cells.length };
  });
  const hitShip = ships.find((ship) => ship.id === target.id)!;
  shots[index] = "HIT";
  if (hitShip.sunk) hitShip.cells.forEach((cell) => { shots[cell] = "SUNK"; });
  const won = ships.every((ship) => ship.sunk);
  return { board: { ships, shots }, result: won ? "win" : hitShip.sunk ? "sunk" : "hit", ship: hitShip };
}

function visibleState(board: BoardState, index: number, revealShips: boolean): CellState {
  if (board.shots[index]) return board.shots[index] as CellState;
  return revealShips && board.ships.some((ship) => ship.cells.includes(index)) ? "SHIP" : "EMPTY";
}

function coordinate(index: number) {
  return `${ROWS[Math.floor(index / SIZE)]}${index % SIZE + 1}`;
}

function chooseAiTarget(board: BoardState) {
  const available = board.shots.map((shot, index) => shot ? -1 : index).filter((index) => index >= 0);
  const targetMode = new Set<number>();
  board.ships.filter((ship) => !ship.sunk && ship.hits.length > 0).forEach((ship) => {
    ship.hits.forEach((hit) => {
      const row = Math.floor(hit / SIZE);
      const column = hit % SIZE;
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([rowOffset, columnOffset]) => {
        const nextRow = row + rowOffset;
        const nextColumn = column + columnOffset;
        const next = nextRow * SIZE + nextColumn;
        if (nextRow >= 0 && nextRow < SIZE && nextColumn >= 0 && nextColumn < SIZE && !board.shots[next]) targetMode.add(next);
      });
    });
  });
  const focused = [...targetMode];
  if (focused.length) return focused[Math.floor(Math.random() * focused.length)];
  const parity = available.filter((index) => (Math.floor(index / SIZE) + index % SIZE) % 2 === 0);
  const pool = parity.length ? parity : available;
  return pool[Math.floor(Math.random() * pool.length)];
}

function resultLabel(result: ShotResult, ship?: ShipState) {
  if (result === "miss") return "Vedľa!";
  if (result === "hit") return "Zásah!";
  if (result === "sunk") return `Potopená: ${ship?.name ?? "loď"}`;
  return "Všetky lode potopené!";
}

function FleetStrip({ ships, hidden = false }: { ships: ShipState[]; hidden?: boolean }) {
  return <div className="grid grid-cols-5 gap-1.5" aria-label="Stav flotily">{FLEET.map((definition) => {
    const ship = ships.find((item) => item.id === definition.id);
    const sunk = ship?.sunk;
    const hits = ship?.hits.length ?? 0;
    return <div key={definition.id} title={definition.name} className={`rounded-xl border px-1.5 py-2 text-center transition ${sunk ? "border-rose-400/25 bg-rose-500/10 opacity-45" : "border-white/[.08] bg-white/[.035]"}`}><div className="flex justify-center gap-[2px]">{Array.from({ length: definition.length }, (_, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${sunk || (!hidden && index < hits) ? "bg-rose-400" : "bg-cyan-300/55"}`} />)}</div><p className="mt-1.5 truncate text-[6px] font-black uppercase tracking-wide text-white/35">{sunk ? "Potopená" : definition.shortName}</p></div>;
  })}</div>;
}

function BattleGrid({ board, revealShips, disabled = false, onCell, lastShot, label }: { board: BoardState; revealShips: boolean; disabled?: boolean; onCell?: (index: number) => void; lastShot?: number | null; label: string }) {
  return <div>
    <div className="mb-2 flex items-center justify-between"><p className="text-[9px] font-black uppercase tracking-[.22em] text-white/38">{label}</p><span className="text-[8px] font-black uppercase tracking-wider text-cyan-300/45">10 × 10</span></div>
    <div className="battle-grid rounded-[1.35rem] border border-cyan-200/10 bg-[#07131e]/85 p-2 shadow-2xl shadow-cyan-950/30" style={{ display: "grid", gridTemplateColumns: "18px repeat(10,minmax(0,1fr))", gap: "3px" }}>
      <span />{Array.from({ length: SIZE }, (_, index) => <span key={`column-${index}`} className="flex items-center justify-center text-[7px] font-black text-white/28">{index + 1}</span>)}
      {ROWS.map((row, rowIndex) => <Fragment key={row}><span className="flex items-center justify-center text-[7px] font-black text-white/28">{row}</span>{Array.from({ length: SIZE }, (_, columnIndex) => {
        const index = rowIndex * SIZE + columnIndex;
        const state = visibleState(board, index, revealShips);
        const interactive = Boolean(onCell) && !disabled && !board.shots[index];
        return <button key={index} type="button" data-state={state} aria-label={`${coordinate(index)}: ${state}`} disabled={!interactive} onClick={() => onCell?.(index)} className={`battle-cell relative aspect-square min-w-0 overflow-hidden rounded-[5px] border transition ${lastShot === index ? "battle-cell-latest" : ""}`}><span className="battle-wave" />{state === "MISS" && <span className="battle-miss-dot" />}{state === "HIT" && <span className="battle-hit-burst">×</span>}{state === "SUNK" && <span className="battle-sunk-mark">×</span>}</button>;
      })}</Fragment>)}
    </div>
  </div>;
}

export default function Battleship({ onBack }: { onBack: () => void }) {
  const { playFeedback } = useFeedback();
  const [phase, setPhase] = useState<Phase>("setup");
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [selectedShipId, setSelectedShipId] = useState<string | null>(FLEET[0].id);
  const [noTouching, setNoTouching] = useState(true);
  const [hitKeepsTurn, setHitKeepsTurn] = useState(false);
  const [playerBoard, setPlayerBoard] = useState<BoardState>(emptyBoard());
  const [enemyBoard, setEnemyBoard] = useState<BoardState>(emptyBoard());
  const [turn, setTurn] = useState<Turn>("player");
  const [winner, setWinner] = useState<Turn | null>(null);
  const [notice, setNotice] = useState("Vyber loď a polož ju na mapu.");
  const [lastShot, setLastShot] = useState<{ side: Turn; index: number } | null>(null);
  const [stats, setStats] = useLocalStorage("podvodnik-battleship-stats-v1", { wins: 0, losses: 0, games: 0 });

  const selectedDefinition = FLEET.find((ship) => ship.id === selectedShipId);
  const placedCount = playerBoard.ships.length;
  const playerRemaining = useMemo(() => playerBoard.ships.filter((ship) => !ship.sunk).length, [playerBoard.ships]);
  const enemyRemaining = useMemo(() => enemyBoard.ships.filter((ship) => !ship.sunk).length, [enemyBoard.ships]);

  const finish = useCallback((nextWinner: Turn) => {
    setWinner(nextWinner);
    setPhase("finished");
    setStats((current) => ({ ...current, games: current.games + 1, wins: current.wins + (nextWinner === "player" ? 1 : 0), losses: current.losses + (nextWinner === "ai" ? 1 : 0) }));
    playFeedback(nextWinner === "player" ? "win" : "loss");
  }, [playFeedback, setStats]);

  useEffect(() => {
    if (phase !== "deploying") return;
    const timer = window.setTimeout(() => {
      setTurn("player");
      setNotice("Tvoj ťah — vyber políčko nepriateľa.");
      setPhase("playing");
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing" || turn !== "ai") return;
    const timer = window.setTimeout(() => {
      const index = chooseAiTarget(playerBoard);
      if (index === undefined) return;
      const resolved = resolveShot(playerBoard, index);
      if (!resolved) return;
      setPlayerBoard(resolved.board);
      setLastShot({ side: "ai", index });
      setNotice(`Robot strieľa na ${coordinate(index)} — ${resultLabel(resolved.result, resolved.ship)}`);
      if (resolved.result === "win") { finish("ai"); return; }
      if (resolved.result === "hit" || resolved.result === "sunk") playFeedback("buzzer");
      else playFeedback("countdown");
      setTurn(hitKeepsTurn && resolved.result !== "miss" ? "ai" : "player");
    }, 720);
    return () => window.clearTimeout(timer);
  }, [finish, hitKeepsTurn, phase, playFeedback, playerBoard, turn]);

  function pickShip(id: string) {
    setPlayerBoard((current) => ({ ...current, ships: current.ships.filter((ship) => ship.id !== id) }));
    setSelectedShipId(id);
    setNotice("Klepni na pole, kde má loď začínať.");
  }

  function placeShip(index: number) {
    if (!selectedDefinition) return;
    const remainingShips = playerBoard.ships.filter((ship) => ship.id !== selectedDefinition.id);
    const cells = placementCells(index, selectedDefinition.length, orientation);
    if (!isValidPlacement(cells, remainingShips, noTouching) || !cells) {
      setNotice(noTouching ? "Sem sa loď nezmestí alebo sa dotýka inej lode." : "Sem sa loď nezmestí alebo prekrýva inú loď.");
      playFeedback("loss");
      return;
    }
    const ships = [...remainingShips, { ...selectedDefinition, cells, hits: [], sunk: false }];
    setPlayerBoard(emptyBoard(ships));
    const next = FLEET.find((definition) => !ships.some((ship) => ship.id === definition.id));
    setSelectedShipId(next?.id ?? null);
    setNotice(next ? `Polož: ${next.name} (${next.length} polia).` : "Flotila je pripravená. Môžeš začať bitku!");
    playFeedback(next ? "click" : "win");
  }

  function randomizePlayerFleet() {
    const ships = randomFleet(noTouching);
    setPlayerBoard(emptyBoard(ships));
    setSelectedShipId(null);
    setNotice("Flotila bola bezpečne rozmiestnená.");
  }

  function clearFleet() {
    setPlayerBoard(emptyBoard());
    setSelectedShipId(FLEET[0].id);
    setNotice("Vyber loď a polož ju na mapu.");
  }

  function launchBattle() {
    if (playerBoard.ships.length !== FLEET.length) return;
    setPlayerBoard(emptyBoard(playerBoard.ships.map((ship) => ({ ...ship, hits: [], sunk: false }))));
    setEnemyBoard(emptyBoard(randomFleet(noTouching)));
    setWinner(null);
    setLastShot(null);
    setNotice("Robot rozmiestňuje svoju flotilu…");
    setPhase("deploying");
  }

  function shoot(index: number) {
    if (phase !== "playing" || turn !== "player") return;
    const resolved = resolveShot(enemyBoard, index);
    if (!resolved) return;
    setEnemyBoard(resolved.board);
    setLastShot({ side: "player", index });
    setNotice(`Výstrel na ${coordinate(index)} — ${resultLabel(resolved.result, resolved.ship)}`);
    if (resolved.result === "win") { finish("player"); return; }
    if (resolved.result === "hit" || resolved.result === "sunk") playFeedback("buzzer");
    else playFeedback("countdown");
    setTurn(hitKeepsTurn && resolved.result !== "miss" ? "player" : "ai");
  }

  function rematch() {
    setPlayerBoard(emptyBoard(playerBoard.ships.map((ship) => ({ ...ship, hits: [], sunk: false }))));
    setEnemyBoard(emptyBoard(randomFleet(noTouching)));
    setWinner(null);
    setLastShot(null);
    setNotice("Robot rozmiestňuje novú flotilu…");
    setPhase("deploying");
  }

  function newGame() {
    setPhase("setup");
    setPlayerBoard(emptyBoard());
    setEnemyBoard(emptyBoard());
    setSelectedShipId(FLEET[0].id);
    setWinner(null);
    setLastShot(null);
    setNotice("Vyber loď a polož ju na mapu.");
  }

  if (phase === "deploying") return <PartyBackdrop><main className="flex h-full flex-col items-center justify-center px-6 text-center text-white"><div className="battle-radar relative flex h-44 w-44 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-400/[.06]"><span className="battle-radar-sweep" /><span className="text-6xl">🚢</span></div><PartyEyebrow>Čakanie na súpera</PartyEyebrow><h1 className="mt-5 text-3xl font-black">Flotily vyplávajú</h1><p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">Robot tajne rozmiestňuje svoje lode. Priprav delá!</p></main></PartyBackdrop>;

  if (phase === "setup") return (
    <PartyBackdrop>
      <main className="h-full overflow-y-auto px-4 pb-9 pt-5 text-white">
        <div className="mx-auto w-full max-w-md">
          <header className="flex items-center justify-between"><button onClick={onBack} aria-label="Späť" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[.06] text-white/70 transition active:scale-90"><Icons.chevronLeft size={21} /></button><PartyEyebrow>Rozmiestnenie lodí</PartyEyebrow><div className="h-11 w-11" /></header>
          <section className="mt-6 text-center"><span className="text-6xl">⚓</span><p className="mt-3 text-[9px] font-black uppercase tracking-[.25em] text-cyan-300/65">Námorná bitka</p><h1 className="mt-1 text-4xl font-black tracking-[-.04em]">Loďky</h1><p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-white/42">Polož všetkých päť lodí. Súper tvoju flotilu počas bitky neuvidí.</p></section>

          <section className="party-glass mt-5 rounded-[1.6rem] p-3.5">
            <div className="mb-3 flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[.2em] text-white/35">Tvoja flotila</p><p className="mt-1 text-[10px] font-bold text-cyan-300/65">{placedCount}/5 lodí umiestnených</p></div><button onClick={() => setOrientation((value) => value === "horizontal" ? "vertical" : "horizontal")} className="rounded-xl border border-cyan-300/15 bg-cyan-400/[.07] px-3 py-2 text-[9px] font-black uppercase tracking-wider text-cyan-200">{orientation === "horizontal" ? "↔ Vodorovne" : "↕ Zvisle"}</button></div>
            <BattleGrid board={playerBoard} revealShips onCell={placeShip} label={selectedDefinition ? `Polož: ${selectedDefinition.shortName} (${selectedDefinition.length})` : "Všetky lode sú na mape"} />
            <p className={`mt-3 min-h-8 rounded-xl border px-3 py-2 text-center text-[10px] font-bold leading-relaxed ${placedCount === 5 ? "border-emerald-300/15 bg-emerald-400/[.07] text-emerald-200" : "border-white/[.07] bg-white/[.03] text-white/45"}`}>{notice}</p>
          </section>

          <section className="mt-3 space-y-2">{FLEET.map((definition) => {
            const placed = playerBoard.ships.some((ship) => ship.id === definition.id);
            const selected = selectedShipId === definition.id;
            return <button key={definition.id} onClick={() => pickShip(definition.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition active:scale-[.98] ${selected ? "border-cyan-300/40 bg-cyan-400/12" : placed ? "border-emerald-300/15 bg-emerald-400/[.06]" : "border-white/[.08] bg-white/[.035]"}`}><span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm ${placed ? "bg-emerald-400/15" : "bg-white/[.05]"}`}>{placed ? "✓" : "⚓"}</span><span className="min-w-0 flex-1"><strong className="block truncate text-xs font-black">{definition.name}</strong><small className="mt-1 block text-[9px] text-white/35">{definition.length} polia</small></span><span className="flex gap-1">{Array.from({ length: definition.length }, (_, index) => <i key={index} className={`h-2.5 w-2.5 rounded-sm ${selected ? "bg-cyan-300" : placed ? "bg-emerald-400/60" : "bg-white/15"}`} />)}</span></button>;
          })}</section>

          <div className="mt-3 grid grid-cols-2 gap-2"><button onClick={randomizePlayerFleet} className="rounded-xl border border-white/10 bg-white/[.05] py-3 text-[10px] font-black uppercase tracking-wider text-white/60">🎲 Náhodne</button><button onClick={clearFleet} className="rounded-xl border border-white/10 bg-white/[.05] py-3 text-[10px] font-black uppercase tracking-wider text-white/60">Vyčistiť</button></div>

          <section className="party-glass mt-3 rounded-[1.5rem] p-4">
            <p className="mb-3 text-[9px] font-black uppercase tracking-[.2em] text-white/35">Pravidlá bitky</p>
            <label className="flex cursor-pointer items-center justify-between gap-3 py-2"><span><strong className="block text-xs font-black">Lode sa nedotýkajú</strong><small className="text-[9px] text-white/35">Ani bokmi, ani rohmi</small></span><input type="checkbox" checked={noTouching} onChange={(event: ChangeEvent<HTMLInputElement>) => { setNoTouching(event.target.checked); clearFleet(); }} className="h-5 w-5 accent-cyan-400" /></label>
            <label className="flex cursor-pointer items-center justify-between gap-3 border-t border-white/[.07] py-2"><span><strong className="block text-xs font-black">Zásah = ďalší výstrel</strong><small className="text-[9px] text-white/35">Úspešný strelec pokračuje</small></span><input type="checkbox" checked={hitKeepsTurn} onChange={(event: ChangeEvent<HTMLInputElement>) => setHitKeepsTurn(event.target.checked)} className="h-5 w-5 accent-cyan-400" /></label>
          </section>

          <button onClick={launchBattle} disabled={placedCount !== FLEET.length} className="party-shine relative mt-5 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-700 py-5 text-sm font-black uppercase tracking-[.12em] text-white shadow-xl shadow-cyan-500/15 transition active:scale-[.97] disabled:opacity-30">Začať bitku</button>
        </div>
      </main>
    </PartyBackdrop>
  );

  return (
    <PartyBackdrop>
      <main className="h-full overflow-y-auto px-4 pb-10 pt-5 text-white">
        <div className="mx-auto w-full max-w-md">
          <header className="flex items-center justify-between"><button onClick={newGame} aria-label="Nová hra" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[.06] text-white/70 transition active:scale-90"><Icons.chevronLeft size={21} /></button><PartyEyebrow>{phase === "finished" ? "Koniec hry" : turn === "player" ? "Tvoj ťah" : "Ťah robota"}</PartyEyebrow><div className="h-11 w-11" /></header>

          <section className="mt-5 grid grid-cols-3 gap-2 text-center"><div className="party-glass rounded-xl p-3"><p className="text-[7px] font-black uppercase tracking-wider text-white/30">Tvoje lode</p><p className="mt-1 text-2xl font-black text-cyan-300">{playerRemaining}</p></div><div className="party-glass rounded-xl p-3"><p className="text-[7px] font-black uppercase tracking-wider text-white/30">Bilancia</p><p className="mt-1 text-sm font-black"><span className="text-emerald-300">{stats.wins} V</span> · <span className="text-rose-300">{stats.losses} P</span></p></div><div className="party-glass rounded-xl p-3"><p className="text-[7px] font-black uppercase tracking-wider text-white/30">Súperove</p><p className="mt-1 text-2xl font-black text-rose-300">{enemyRemaining}</p></div></section>

          <div className={`mt-3 min-h-12 rounded-2xl border px-4 py-3 text-center text-[11px] font-black leading-relaxed ${turn === "player" ? "border-cyan-300/15 bg-cyan-400/[.07] text-cyan-100" : "border-amber-300/15 bg-amber-400/[.07] text-amber-100"}`}>{phase === "finished" ? (winner === "player" ? "Víťazstvo! Nepriateľská flotila je na dne." : "Robot potopil tvoju flotilu.") : notice}</div>

          <section className="party-glass mt-4 rounded-[1.7rem] p-3.5">
            <BattleGrid board={enemyBoard} revealShips={phase === "finished"} disabled={turn !== "player" || phase !== "playing"} onCell={shoot} lastShot={lastShot?.side === "player" ? lastShot.index : null} label="Nepriateľské vody — strieľaj sem" />
            <div className="mt-3"><FleetStrip ships={enemyBoard.ships} hidden /></div>
          </section>

          <section className="party-glass mt-4 rounded-[1.7rem] p-3.5 opacity-90">
            <BattleGrid board={playerBoard} revealShips disabled lastShot={lastShot?.side === "ai" ? lastShot.index : null} label="Tvoje vody" />
            <div className="mt-3"><FleetStrip ships={playerBoard.ships} /></div>
          </section>

          {phase === "finished" && <section className="battle-finale party-glass mt-5 overflow-hidden rounded-[2rem] border-cyan-300/20 p-6 text-center"><div className="battle-finale-icon text-6xl">{winner === "player" ? "🏆" : "🌊"}</div><p className="mt-4 text-[9px] font-black uppercase tracking-[.25em] text-cyan-300/65">Bitka sa skončila</p><h1 className="mt-2 text-3xl font-black">{winner === "player" ? "Veliteľské víťazstvo!" : "Flotila bola porazená"}</h1><p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-white/42">{winner === "player" ? "Potopil/a si všetkých päť nepriateľských lodí ako prvý/á." : "Nepriateľ našiel všetkých päť lodí. Skús novú taktiku."}</p><button onClick={rematch} className="party-shine relative mt-5 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-700 py-4 text-sm font-black uppercase tracking-wider transition active:scale-95">Odveta s rovnakou flotilou</button><button onClick={newGame} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[.04] py-4 text-xs font-black text-white/55 transition active:scale-95">Nová hra a rozmiestnenie</button></section>}
        </div>
      </main>
    </PartyBackdrop>
  );
}
