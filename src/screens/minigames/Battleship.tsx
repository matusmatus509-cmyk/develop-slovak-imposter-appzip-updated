import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Icons } from "../../components/icons";
import { useFeedback } from "../../feedback/FeedbackProvider";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { PartyBackdrop, PartyEyebrow } from "../teamBattle/PartyChrome";

type Orientation = "horizontal" | "vertical";
type CellState = "EMPTY" | "SHIP" | "MISS" | "HIT" | "SUNK";
type ShotState = Exclude<CellState, "EMPTY" | "SHIP"> | null;
type Phase = "mode" | "placement" | "handoff" | "deploying" | "playing" | "finished";
type GameMode = "ai" | "local";
type Turn = "player" | "ai";
type ShotResult = "miss" | "hit" | "sunk" | "win";
type HandoffKind = "player2" | "battle" | "turn-player1" | "turn-player2";

interface ShipDefinition { id: string; name: string; shortName: string; length: number }
interface ShipState extends ShipDefinition { cells: number[]; hits: number[]; sunk: boolean }
interface BoardState { ships: ShipState[]; shots: ShotState[] }
interface DragState { shipId: string; pointerId: number; x: number; y: number; hoverIndex: number | null }

const SIZE = 10;
const ROWS = "ABCDEFGHIJ".split("");
const FLEET: ShipDefinition[] = [
  { id: "carrier", name: "Lietadlová loď", shortName: "Lietadlová", length: 5 },
  { id: "battleship", name: "Bojová loď", shortName: "Bojová", length: 4 },
  { id: "cruiser-a", name: "Krížnik I", shortName: "Krížnik I", length: 3 },
  { id: "cruiser-b", name: "Krížnik II", shortName: "Krížnik II", length: 3 },
  { id: "destroyer", name: "Torpédoborec", shortName: "Torpédoborec", length: 2 },
];
const DEFAULT_ORIENTATIONS = Object.fromEntries(FLEET.map((ship) => [ship.id, "horizontal"])) as Record<string, Orientation>;

function emptyBoard(ships: ShipState[] = []): BoardState {
  return { ships, shots: Array<ShotState>(SIZE * SIZE).fill(null) };
}

function resetBoard(board: BoardState) {
  return emptyBoard(board.ships.map((ship) => ({ ...ship, hits: [], sunk: false })));
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

function FleetStrip({ ships, color = "cyan", hidden = false }: { ships: ShipState[]; color?: "cyan" | "amber"; hidden?: boolean }) {
  return <div className="grid grid-cols-5 gap-1.5" aria-label="Stav flotily">{FLEET.map((definition) => {
    const ship = ships.find((item) => item.id === definition.id);
    const sunk = ship?.sunk;
    const hits = ship?.hits.length ?? 0;
    return <div key={definition.id} title={definition.name} className={`rounded-xl border px-1.5 py-2 text-center transition ${sunk ? "border-rose-400/25 bg-rose-500/10 opacity-45" : "border-white/[.08] bg-white/[.035]"}`}><div className="flex justify-center gap-[2px]">{Array.from({ length: definition.length }, (_, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${sunk || (!hidden && index < hits) ? "bg-rose-400" : color === "cyan" ? "bg-cyan-300/55" : "bg-amber-300/55"}`} />)}</div><p className="mt-1.5 truncate text-[6px] font-black uppercase tracking-wide text-white/35">{sunk ? "Potopená" : definition.shortName}</p></div>;
  })}</div>;
}

function BattleGrid({
  board,
  revealShips,
  disabled = false,
  onCell,
  lastShot,
  label,
  placement = false,
  previewCells = [],
  previewValid = true,
}: {
  board: BoardState;
  revealShips: boolean;
  disabled?: boolean;
  onCell?: (index: number) => void;
  lastShot?: number | null;
  label: string;
  placement?: boolean;
  previewCells?: number[];
  previewValid?: boolean;
}) {
  return <div>
    <div className="mb-2 flex items-center justify-between"><p className="text-[9px] font-black uppercase tracking-[.22em] text-white/38">{label}</p><span className="text-[8px] font-black uppercase tracking-wider text-cyan-300/45">10 × 10</span></div>
    <div className={`battle-grid rounded-[1.35rem] border border-cyan-200/10 bg-[#07131e]/85 p-2 shadow-2xl shadow-cyan-950/30 ${placement ? "battle-placement-grid" : ""}`} style={{ display: "grid", gridTemplateColumns: "18px repeat(10,minmax(0,1fr))", gap: "3px" }}>
      <span />{Array.from({ length: SIZE }, (_, index) => <span key={`column-${index}`} className="flex items-center justify-center text-[7px] font-black text-white/28">{index + 1}</span>)}
      {ROWS.map((row, rowIndex) => <Fragment key={row}><span className="flex items-center justify-center text-[7px] font-black text-white/28">{row}</span>{Array.from({ length: SIZE }, (_, columnIndex) => {
        const index = rowIndex * SIZE + columnIndex;
        const state = visibleState(board, index, revealShips);
        const interactive = placement || (Boolean(onCell) && !disabled && !board.shots[index]);
        const preview = previewCells.includes(index);
        return <button
          key={index}
          type="button"
          data-state={state}
          data-placement-index={placement ? index : undefined}
          aria-label={`${coordinate(index)}: ${state}`}
          disabled={!interactive}
          onClick={() => onCell?.(index)}
          className={`battle-cell relative aspect-square min-w-0 overflow-hidden rounded-[5px] border transition ${lastShot === index ? "battle-cell-latest" : ""} ${preview ? previewValid ? "battle-preview-valid" : "battle-preview-invalid" : ""}`}
        ><span className="battle-wave" />{state === "MISS" && <span className="battle-miss-dot" />}{state === "HIT" && <span className="battle-hit-burst">×</span>}{state === "SUNK" && <span className="battle-sunk-mark">×</span>}</button>;
      })}</Fragment>)}
    </div>
  </div>;
}

function HandoffScreen({ kind, onContinue, onCancel }: { kind: HandoffKind; onContinue: () => void; onCancel: () => void }) {
  const toSecondPlayer = kind === "player2";
  const nextTurnPlayer = kind === "turn-player1" ? 1 : kind === "turn-player2" ? 2 : null;
  const turnHandoff = nextTurnPlayer !== null;
  const battleStart = kind === "battle";
  const title = turnHandoff ? `Odovzdaj mobil hráčovi ${nextTurnPlayer}` : toSecondPlayer ? "Odovzdaj mobil hráčovi 2" : "Položte mobil medzi seba";
  const description = turnHandoff
    ? `Výstrel je uložený a mriežka je skrytá. Hráč ${nextTurnPlayer} nech prevezme mobil a pokračuje vo svojom ťahu.`
    : toSecondPlayer
      ? "Flotila hráča 1 je bezpečne uložená a už ju nevidno. Pokračovať môže až hráč 2."
      : "Obe flotily sú uložené. Hráč 1 začne prvým výstrelom.";
  return <PartyBackdrop>
    <main className="flex h-full flex-col items-center justify-center overflow-y-auto px-6 py-10 text-center text-white">
      <div className="battle-handoff-icon relative flex h-36 w-36 items-center justify-center rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/15 to-blue-700/20 shadow-2xl shadow-cyan-500/10">
        <span className="text-6xl">{turnHandoff ? "🔄" : toSecondPlayer ? "📱" : "⚓"}</span>
        <span className="absolute -bottom-3 rounded-full border border-white/10 bg-[#0b1420] px-4 py-2 text-[9px] font-black uppercase tracking-[.18em] text-cyan-200">Lode sú skryté</span>
      </div>
      <div className="mt-9"><PartyEyebrow>{turnHandoff ? "Striedanie ťahu" : toSecondPlayer ? "Súkromné rozmiestnenie" : "Obaja pripravení"}</PartyEyebrow></div>
      <h1 className="mt-5 max-w-sm text-4xl font-black tracking-[-.04em]">{title}</h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/48">{description}</p>
      <div className="mt-7 flex items-center gap-2" aria-label="Priebeh hry"><span className="h-2 w-12 rounded-full bg-emerald-400" /><span className={`h-2 w-12 rounded-full ${toSecondPlayer ? "bg-white/12" : "bg-emerald-400"}`} /></div>
      <button onClick={onContinue} className="party-shine relative mt-8 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-700 py-5 text-sm font-black uppercase tracking-[.12em] shadow-xl shadow-cyan-500/15 transition active:scale-[.97]">{turnHandoff ? `Som hráč ${nextTurnPlayer} — pokračovať` : toSecondPlayer ? "Som hráč 2 — pokračovať" : battleStart ? "Začať bitku" : "Pokračovať"}</button>
      <button onClick={onCancel} className="mt-3 w-full max-w-sm py-3 text-xs font-black text-white/35">Zrušiť celú hru</button>
    </main>
  </PartyBackdrop>;
}

export default function Battleship({ onBack }: { onBack: () => void }) {
  const { playFeedback } = useFeedback();
  const [phase, setPhase] = useState<Phase>("mode");
  const [mode, setMode] = useState<GameMode>("ai");
  const [deploymentPlayer, setDeploymentPlayer] = useState<0 | 1>(0);
  const [handoffKind, setHandoffKind] = useState<HandoffKind>("player2");
  const [orientations, setOrientations] = useState<Record<string, Orientation>>(DEFAULT_ORIENTATIONS);
  const [selectedShipId, setSelectedShipId] = useState<string>(FLEET[0].id);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [noTouching, setNoTouching] = useState(true);
  const [hitKeepsTurn, setHitKeepsTurn] = useState(false);
  const [playerBoard, setPlayerBoard] = useState<BoardState>(emptyBoard());
  const [enemyBoard, setEnemyBoard] = useState<BoardState>(emptyBoard());
  const [turn, setTurn] = useState<Turn>("player");
  const [winner, setWinner] = useState<Turn | null>(null);
  const [notice, setNotice] = useState("Presuň loď z hornej lišty na mapu.");
  const [lastShot, setLastShot] = useState<{ side: Turn; index: number } | null>(null);
  const [stats, setStats] = useLocalStorage("podvodnik-battleship-stats-v1", { wins: 0, losses: 0, games: 0 });

  const placementBoard = deploymentPlayer === 0 ? playerBoard : enemyBoard;
  const placedCount = placementBoard.ships.length;
  const playerRemaining = useMemo(() => playerBoard.ships.filter((ship) => !ship.sunk).length, [playerBoard.ships]);
  const enemyRemaining = useMemo(() => enemyBoard.ships.filter((ship) => !ship.sunk).length, [enemyBoard.ships]);
  const activeName = turn === "player" ? "Hráč 1" : mode === "ai" ? "Robot" : "Hráč 2";
  const targetName = turn === "player" ? mode === "ai" ? "robota" : "hráča 2" : "hráča 1";
  const targetBoard = turn === "player" ? enemyBoard : playerBoard;

  const preview = useMemo(() => {
    if (!drag || drag.hoverIndex === null) return { cells: [] as number[], valid: true };
    const definition = FLEET.find((ship) => ship.id === drag.shipId);
    if (!definition) return { cells: [] as number[], valid: false };
    const cells = placementCells(drag.hoverIndex, definition.length, orientations[definition.id]);
    const others = placementBoard.ships.filter((ship) => ship.id !== definition.id);
    return { cells: cells ?? [], valid: isValidPlacement(cells, others, noTouching) };
  }, [drag, noTouching, orientations, placementBoard.ships]);

  const setPlacementBoard = useCallback((next: BoardState) => {
    if (deploymentPlayer === 0) setPlayerBoard(next);
    else setEnemyBoard(next);
  }, [deploymentPlayer]);

  const finish = useCallback((nextWinner: Turn) => {
    setWinner(nextWinner);
    setPhase("finished");
    if (mode === "ai") {
      setStats((current) => ({ ...current, games: current.games + 1, wins: current.wins + (nextWinner === "player" ? 1 : 0), losses: current.losses + (nextWinner === "ai" ? 1 : 0) }));
      playFeedback(nextWinner === "player" ? "win" : "loss");
    } else playFeedback("win");
  }, [mode, playFeedback, setStats]);

  const placeShip = useCallback((shipId: string, index: number) => {
    const definition = FLEET.find((ship) => ship.id === shipId);
    if (!definition) return false;
    const remainingShips = placementBoard.ships.filter((ship) => ship.id !== shipId);
    const cells = placementCells(index, definition.length, orientations[shipId]);
    if (!isValidPlacement(cells, remainingShips, noTouching) || !cells) {
      setNotice(noTouching ? "Sem sa loď nezmestí alebo sa dotýka inej lode." : "Sem sa loď nezmestí alebo prekrýva inú loď.");
      playFeedback("loss");
      return false;
    }
    const ships = [...remainingShips, { ...definition, cells, hits: [], sunk: false }];
    setPlacementBoard(emptyBoard(ships));
    const next = FLEET.find((ship) => !ships.some((placed) => placed.id === ship.id));
    if (next) setSelectedShipId(next.id);
    setNotice(next ? `Teraz polož: ${next.name}.` : "Flotila je pripravená. Lode môžeš stále presúvať alebo otáčať.");
    playFeedback(next ? "click" : "win");
    return true;
  }, [noTouching, orientations, placementBoard.ships, playFeedback, setPlacementBoard]);

  useEffect(() => {
    if (!drag || phase !== "placement") return;
    const move = (event: PointerEvent) => {
      if (event.pointerId !== drag.pointerId) return;
      event.preventDefault();
      const element = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-placement-index]");
      const value = element?.dataset.placementIndex;
      setDrag((current) => current && current.pointerId === event.pointerId ? { ...current, x: event.clientX, y: event.clientY, hoverIndex: value === undefined ? null : Number(value) } : current);
    };
    const end = (event: PointerEvent) => {
      if (event.pointerId !== drag.pointerId) return;
      const element = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-placement-index]");
      const value = element?.dataset.placementIndex;
      if (value !== undefined) placeShip(drag.shipId, Number(value));
      setDrag(null);
    };
    const cancel = (event: PointerEvent) => { if (event.pointerId === drag.pointerId) setDrag(null); };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", cancel);
    };
  }, [drag, phase, placeShip]);

  useEffect(() => {
    if (phase !== "deploying") return;
    const timer = window.setTimeout(() => {
      setTurn("player");
      setNotice("Hráč 1 začína — vyber políčko nepriateľa.");
      setPhase("playing");
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (mode !== "ai" || phase !== "playing" || turn !== "ai") return;
    const timer = window.setTimeout(() => {
      const index = chooseAiTarget(playerBoard);
      if (index === undefined) return;
      const resolved = resolveShot(playerBoard, index);
      if (!resolved) return;
      setPlayerBoard(resolved.board);
      setLastShot({ side: "ai", index });
      setNotice(`Robot strieľa na ${coordinate(index)} — ${resultLabel(resolved.result, resolved.ship)}`);
      if (resolved.result === "win") { finish("ai"); return; }
      playFeedback(resolved.result === "miss" ? "countdown" : "buzzer");
      setTurn(hitKeepsTurn && resolved.result !== "miss" ? "ai" : "player");
    }, 720);
    return () => window.clearTimeout(timer);
  }, [finish, hitKeepsTurn, mode, phase, playFeedback, playerBoard, turn]);

  function startMode(nextMode: GameMode) {
    setMode(nextMode);
    setPlayerBoard(emptyBoard());
    setEnemyBoard(emptyBoard());
    setDeploymentPlayer(0);
    setOrientations(DEFAULT_ORIENTATIONS);
    setSelectedShipId(FLEET[0].id);
    setDrag(null);
    setWinner(null);
    setLastShot(null);
    setNotice("Presuň loď z hornej lišty na mapu.");
    setPhase("placement");
  }

  function beginDrag(shipId: string, event: ReactPointerEvent<HTMLButtonElement>) {
    if (phase !== "placement" || drag) return;
    event.preventDefault();
    setSelectedShipId(shipId);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDrag({ shipId, pointerId: event.pointerId, x: event.clientX, y: event.clientY, hoverIndex: null });
  }

  function rotateShip(shipId: string) {
    const nextOrientation: Orientation = orientations[shipId] === "horizontal" ? "vertical" : "horizontal";
    const placed = placementBoard.ships.find((ship) => ship.id === shipId);
    setSelectedShipId(shipId);
    if (!placed) {
      setOrientations((current) => ({ ...current, [shipId]: nextOrientation }));
      setNotice("Loď je otočená. Presuň ju na mapu.");
      return;
    }
    const remaining = placementBoard.ships.filter((ship) => ship.id !== shipId);
    const cells = placementCells(placed.cells[0], placed.length, nextOrientation);
    if (isValidPlacement(cells, remaining, noTouching) && cells) {
      setOrientations((current) => ({ ...current, [shipId]: nextOrientation }));
      setPlacementBoard(emptyBoard([...remaining, { ...placed, cells }]));
      setNotice("Loď bola otočená.");
      playFeedback("click");
    } else {
      setNotice("Na pôvodnom mieste sa po otočení nezmestí. Loď zostala na svojom mieste.");
      playFeedback("loss");
    }
  }

  function randomizeFleet() {
    const ships = randomFleet(noTouching);
    if (ships.length !== FLEET.length) { setNotice("Flotilu sa nepodarilo rozmiestniť. Skús to znova."); return; }
    const nextOrientations = { ...orientations };
    ships.forEach((ship) => { nextOrientations[ship.id] = ship.cells[1] - ship.cells[0] === 1 ? "horizontal" : "vertical"; });
    setOrientations(nextOrientations);
    setPlacementBoard(emptyBoard(ships));
    setNotice("Flotila bola náhodne rozmiestnená. Každú loď môžeš ešte presunúť.");
    playFeedback("win");
  }

  function clearFleet() {
    setPlacementBoard(emptyBoard());
    setSelectedShipId(FLEET[0].id);
    setDrag(null);
    setNotice("Flotila je prázdna. Presuň lode z hornej lišty na mapu.");
  }

  function confirmPlacement() {
    if (placedCount !== FLEET.length || drag) return;
    if (mode === "ai") {
      const aiFleet = randomFleet(noTouching);
      if (aiFleet.length !== FLEET.length) { setNotice("Súperovu flotilu sa nepodarilo pripraviť. Skús znova."); return; }
      setPlayerBoard(resetBoard(playerBoard));
      setEnemyBoard(emptyBoard(aiFleet));
      setNotice("Robot rozmiestňuje svoju flotilu…");
      setPhase("deploying");
      return;
    }
    if (deploymentPlayer === 0) {
      setPlayerBoard(resetBoard(playerBoard));
      setHandoffKind("player2");
      setDrag(null);
      setSelectedShipId(FLEET[0].id);
      setOrientations(DEFAULT_ORIENTATIONS);
      setPhase("handoff");
    } else {
      setEnemyBoard(resetBoard(enemyBoard));
      setHandoffKind("battle");
      setDrag(null);
      setPhase("handoff");
    }
  }

  function continueHandoff() {
    if (handoffKind === "player2") {
      setDeploymentPlayer(1);
      setEnemyBoard(emptyBoard());
      setSelectedShipId(FLEET[0].id);
      setNotice("Hráč 2: presuň svoje lode na mapu. Flotila hráča 1 je skrytá.");
      setPhase("placement");
    } else if (handoffKind === "battle") {
      setTurn("player");
      setWinner(null);
      setLastShot(null);
      setNotice("Hráč 1 začína — strieľa na flotilu hráča 2.");
      setPhase("playing");
    } else {
      setNotice(`${turn === "player" ? "Hráč 1" : "Hráč 2"} je na ťahu — vyber políčko súperovej flotily.`);
      setPhase("playing");
    }
  }

  function shoot(index: number) {
    if (phase !== "playing" || (mode === "ai" && turn !== "player")) return;
    const board = turn === "player" ? enemyBoard : playerBoard;
    const resolved = resolveShot(board, index);
    if (!resolved) return;
    if (turn === "player") setEnemyBoard(resolved.board);
    else setPlayerBoard(resolved.board);
    setLastShot({ side: turn, index });
    setNotice(`${activeName} strieľa na ${coordinate(index)} — ${resultLabel(resolved.result, resolved.ship)}`);
    if (resolved.result === "win") { finish(turn); return; }
    playFeedback(resolved.result === "miss" ? "countdown" : "buzzer");
    if (hitKeepsTurn && resolved.result !== "miss") return;
    const nextTurn: Turn = turn === "player" ? "ai" : "player";
    setTurn(nextTurn);
    if (mode === "local") {
      setHandoffKind(nextTurn === "player" ? "turn-player1" : "turn-player2");
      setPhase("handoff");
    }
  }

  function rematch() {
    if (mode === "local") {
      setPlayerBoard(emptyBoard());
      setEnemyBoard(emptyBoard());
      setDeploymentPlayer(0);
      setOrientations(DEFAULT_ORIENTATIONS);
      setSelectedShipId(FLEET[0].id);
      setWinner(null);
      setLastShot(null);
      setDrag(null);
      setNotice("Hráč 1: rozmiestni novú tajnú flotilu pre odvetu.");
      setPhase("placement");
      return;
    }
    setPlayerBoard(resetBoard(playerBoard));
    setEnemyBoard(emptyBoard(randomFleet(noTouching)));
    setWinner(null);
    setLastShot(null);
    setTurn("player");
    setNotice("Robot rozmiestňuje novú flotilu…");
    setPhase("deploying");
  }

  function newGame() {
    setPhase("mode");
    setPlayerBoard(emptyBoard());
    setEnemyBoard(emptyBoard());
    setDeploymentPlayer(0);
    setWinner(null);
    setLastShot(null);
    setDrag(null);
  }

  if (phase === "mode") return <PartyBackdrop>
    <main className="h-full overflow-y-auto px-5 pb-9 pt-5 text-white">
      <div className="mx-auto w-full max-w-md">
        <header className="flex items-center justify-between"><button onClick={onBack} aria-label="Späť" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[.06] text-white/70 transition active:scale-90"><Icons.chevronLeft size={21} /></button><PartyEyebrow>Vyberte režim</PartyEyebrow><div className="h-11 w-11" /></header>
        <section className="mt-7 text-center"><div className="battle-mode-emblem mx-auto flex h-28 w-28 items-center justify-center rounded-[2.2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/15 to-blue-700/25 text-6xl shadow-2xl shadow-cyan-500/10">⚓</div><p className="mt-6 text-[9px] font-black uppercase tracking-[.25em] text-cyan-300/65">Námorná bitka 10 × 10</p><h1 className="mt-2 text-4xl font-black tracking-[-.04em]">Loďky</h1><p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/46">Rozmiestni päť lodí a potop súperovu flotilu skôr, než nájde tú tvoju.</p></section>
        <section className="mt-7 grid grid-cols-2 gap-3">
          <button onClick={() => startMode("ai")} className="party-shine relative overflow-hidden rounded-[1.7rem] border border-cyan-300/20 bg-cyan-400/[.08] p-5 text-left transition active:scale-[.97]"><span className="text-4xl">🤖</span><strong className="mt-4 block text-base font-black">Proti robotovi</strong><small className="mt-2 block text-[10px] leading-relaxed text-white/40">Sólo bitka so šikovným AI súperom</small></button>
          <button onClick={() => startMode("local")} className="party-shine relative overflow-hidden rounded-[1.7rem] border border-amber-300/20 bg-amber-400/[.08] p-5 text-left transition active:scale-[.97]"><span className="text-4xl">👥</span><strong className="mt-4 block text-base font-black">Dvaja hráči</strong><small className="mt-2 block text-[10px] leading-relaxed text-white/40">Súkromné flotily na jednom mobile</small></button>
        </section>
        <section className="party-glass mt-4 rounded-[1.6rem] p-4"><p className="mb-2 text-[9px] font-black uppercase tracking-[.2em] text-white/35">Pravidlá bitky</p><label className="flex cursor-pointer items-center justify-between gap-3 py-2"><span><strong className="block text-xs font-black">Lode sa nedotýkajú</strong><small className="text-[9px] text-white/35">Ani bokmi, ani rohmi</small></span><input type="checkbox" checked={noTouching} onChange={(event: ChangeEvent<HTMLInputElement>) => setNoTouching(event.target.checked)} className="h-5 w-5 accent-cyan-400" /></label><label className="flex cursor-pointer items-center justify-between gap-3 border-t border-white/[.07] py-2"><span><strong className="block text-xs font-black">Zásah = ďalší výstrel</strong><small className="text-[9px] text-white/35">Úspešný strelec pokračuje</small></span><input type="checkbox" checked={hitKeepsTurn} onChange={(event: ChangeEvent<HTMLInputElement>) => setHitKeepsTurn(event.target.checked)} className="h-5 w-5 accent-cyan-400" /></label></section>
      </div>
    </main>
  </PartyBackdrop>;

  if (phase === "handoff") return <HandoffScreen kind={handoffKind} onContinue={continueHandoff} onCancel={newGame} />;

  if (phase === "deploying") return <PartyBackdrop><main className="flex h-full flex-col items-center justify-center px-6 text-center text-white"><div className="battle-radar relative flex h-44 w-44 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-400/[.06]"><span className="battle-radar-sweep" /><span className="text-6xl">🚢</span></div><div className="mt-7"><PartyEyebrow>Čakanie na súpera</PartyEyebrow></div><h1 className="mt-5 text-3xl font-black">Flotily vyplávajú</h1><p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">Robot tajne rozmiestňuje svoje lode. Priprav delá!</p></main></PartyBackdrop>;

  if (phase === "placement") return <PartyBackdrop>
    <main className="h-full overflow-y-auto px-4 pb-9 pt-5 text-white">
      <div className="mx-auto w-full max-w-md">
        <header className="flex items-center justify-between"><button onClick={newGame} aria-label="Zrušiť hru" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[.06] text-white/70 transition active:scale-90"><Icons.chevronLeft size={21} /></button><PartyEyebrow>{mode === "local" ? `Hráč ${deploymentPlayer + 1} · súkromne` : "Tvoja flotila"}</PartyEyebrow><div className="h-11 w-11" /></header>
        <section className="mt-5 text-center"><p className="text-[9px] font-black uppercase tracking-[.24em] text-cyan-300/60">Rozmiestnenie lodí</p><h1 className="mt-1 text-3xl font-black">{mode === "local" ? `Flotila hráča ${deploymentPlayer + 1}` : "Priprav svoju flotilu"}</h1><p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-white/42">Podrž a presuň blok lode na mapu. Už položený blok môžeš z hornej lišty presunúť znova.</p></section>

        <section className="party-glass mt-5 rounded-[1.6rem] p-3.5">
          <div className="mb-3 flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[.2em] text-white/35">Lode na presúvanie</p><p className="mt-1 text-[9px] font-bold text-cyan-300/60">Potiahni blok alebo vyber a klepni na mapu</p></div><span className="rounded-full border border-white/10 bg-white/[.05] px-3 py-1.5 text-[9px] font-black text-white/45">{placedCount}/5</span></div>
          <div className="battle-ship-tray flex gap-2 overflow-x-auto pb-2">{FLEET.map((definition) => {
            const placed = placementBoard.ships.some((ship) => ship.id === definition.id);
            const selected = selectedShipId === definition.id;
            const vertical = orientations[definition.id] === "vertical";
            return <article key={definition.id} className={`battle-ship-block min-w-[116px] rounded-2xl border p-2.5 transition ${selected ? "is-selected border-cyan-300/45 bg-cyan-400/12" : placed ? "border-emerald-300/20 bg-emerald-400/[.07]" : "border-white/[.08] bg-white/[.035]"}`}>
              <button type="button" onClick={() => { setSelectedShipId(definition.id); setNotice(`Vybraná: ${definition.name}. Klepni na mapu alebo ju potiahni.`); }} onPointerDown={(event) => beginDrag(definition.id, event)} className="battle-ship-drag flex h-[62px] w-full cursor-grab flex-col items-center justify-center rounded-xl border border-white/[.07] bg-black/15 active:cursor-grabbing" aria-label={`Presunúť ${definition.name}`}><span className={`flex ${vertical ? "flex-col" : "flex-row"} gap-1`}>{Array.from({ length: definition.length }, (_, index) => <i key={index} className={`h-3 w-3 rounded-[3px] ${placed ? "bg-emerald-300" : "bg-cyan-300"}`} />)}</span><small className="mt-1.5 max-w-full truncate px-1 text-[7px] font-black uppercase tracking-wide text-white/45">{definition.shortName}</small></button>
              <button type="button" onClick={() => rotateShip(definition.id)} className="mt-2 w-full rounded-lg border border-white/[.07] bg-white/[.04] py-1.5 text-[8px] font-black uppercase tracking-wider text-white/55">{vertical ? "↕ Zvisle" : "↔ Vodorovne"} · otočiť</button>
            </article>;
          })}</div>
        </section>

        <section className="party-glass mt-3 rounded-[1.6rem] p-3.5">
          <BattleGrid board={placementBoard} revealShips placement onCell={(index) => placeShip(selectedShipId, index)} previewCells={preview.cells} previewValid={preview.valid} label={`${mode === "local" ? `Hráč ${deploymentPlayer + 1}` : "Ty"} — tajné vody`} />
          <p className={`mt-3 min-h-9 rounded-xl border px-3 py-2 text-center text-[10px] font-bold leading-relaxed ${placedCount === 5 ? "border-emerald-300/15 bg-emerald-400/[.07] text-emerald-200" : "border-white/[.07] bg-white/[.03] text-white/45"}`}>{notice}</p>
        </section>

        <div className="mt-3 grid grid-cols-2 gap-2"><button onClick={randomizeFleet} className="rounded-xl border border-white/10 bg-white/[.05] py-3 text-[10px] font-black uppercase tracking-wider text-white/60">🎲 Náhodne</button><button onClick={clearFleet} className="rounded-xl border border-white/10 bg-white/[.05] py-3 text-[10px] font-black uppercase tracking-wider text-white/60">Vyčistiť</button></div>
        <button onClick={confirmPlacement} disabled={placedCount !== FLEET.length || Boolean(drag)} className="party-shine relative mt-5 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-700 py-5 text-sm font-black uppercase tracking-[.12em] text-white shadow-xl shadow-cyan-500/15 transition active:scale-[.97] disabled:opacity-30">{mode === "local" ? deploymentPlayer === 0 ? "Uložiť a odovzdať hráčovi 2" : "Uložiť flotilu hráča 2" : "Začať bitku"}</button>
      </div>
      {drag && <div className="battle-drag-ghost pointer-events-none fixed z-[200] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-cyan-200/35 bg-[#102a3d]/95 px-3 py-2 shadow-2xl shadow-cyan-500/25" style={{ left: drag.x, top: drag.y }}><div className={`flex ${orientations[drag.shipId] === "vertical" ? "flex-col" : "flex-row"} gap-1`}>{Array.from({ length: FLEET.find((ship) => ship.id === drag.shipId)?.length ?? 0 }, (_, index) => <i key={index} className="h-3 w-3 rounded-[3px] bg-cyan-200" />)}</div></div>}
    </main>
  </PartyBackdrop>;

  const localTargetLabel = `${activeName} útočí na flotilu ${targetName}`;
  const winnerName = winner === "player" ? "Hráč 1" : mode === "ai" ? "Robot" : "Hráč 2";
  return <PartyBackdrop>
    <main className="h-full overflow-y-auto px-4 pb-10 pt-5 text-white">
      <div className="mx-auto w-full max-w-md">
        <header className="flex items-center justify-between"><button onClick={newGame} aria-label="Nová hra" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[.06] text-white/70 transition active:scale-90"><Icons.chevronLeft size={21} /></button><PartyEyebrow>{phase === "finished" ? "Koniec hry" : `${activeName} je na ťahu`}</PartyEyebrow><div className="h-11 w-11" /></header>

        <section className="mt-5 grid grid-cols-3 gap-2 text-center"><div className={`party-glass rounded-xl p-3 ${turn === "player" && phase === "playing" ? "battle-player-active" : ""}`}><p className="text-[7px] font-black uppercase tracking-wider text-white/30">Hráč 1</p><p className="mt-1 text-2xl font-black text-cyan-300">{playerRemaining}</p><p className="text-[7px] font-bold text-white/25">lodí</p></div><div className="party-glass rounded-xl p-3"><p className="text-[7px] font-black uppercase tracking-wider text-white/30">{mode === "ai" ? "Bilancia" : "Súboj"}</p><p className="mt-2 text-sm font-black">{mode === "ai" ? <><span className="text-emerald-300">{stats.wins} V</span> · <span className="text-rose-300">{stats.losses} P</span></> : <span className="text-white/55">1 vs 1</span>}</p></div><div className={`party-glass rounded-xl p-3 ${turn === "ai" && phase === "playing" ? "battle-player-active battle-player-two" : ""}`}><p className="text-[7px] font-black uppercase tracking-wider text-white/30">{mode === "ai" ? "Robot" : "Hráč 2"}</p><p className="mt-1 text-2xl font-black text-amber-300">{enemyRemaining}</p><p className="text-[7px] font-bold text-white/25">lodí</p></div></section>

        <div className={`mt-3 min-h-12 rounded-2xl border px-4 py-3 text-center text-[11px] font-black leading-relaxed ${turn === "player" ? "border-cyan-300/15 bg-cyan-400/[.07] text-cyan-100" : "border-amber-300/15 bg-amber-400/[.07] text-amber-100"}`}>{phase === "finished" ? `${winnerName} potopil všetkých päť súperových lodí!` : notice}</div>

        <section className="party-glass mt-4 rounded-[1.7rem] p-3.5">
          <BattleGrid board={targetBoard} revealShips={phase === "finished"} disabled={phase !== "playing" || (mode === "ai" && turn === "ai")} onCell={shoot} lastShot={lastShot?.side === turn ? lastShot.index : null} label={mode === "local" ? localTargetLabel : "Nepriateľské vody — strieľaj sem"} />
          <div className="mt-3"><FleetStrip ships={targetBoard.ships} hidden color={turn === "player" ? "amber" : "cyan"} /></div>
        </section>

        {mode === "ai" && <section className="party-glass mt-4 rounded-[1.7rem] p-3.5 opacity-90"><BattleGrid board={playerBoard} revealShips disabled lastShot={lastShot?.side === "ai" ? lastShot.index : null} label="Tvoje vody" /><div className="mt-3"><FleetStrip ships={playerBoard.ships} /></div></section>}

        {mode === "local" && phase === "playing" && <section className="mt-4 rounded-[1.5rem] border border-white/[.08] bg-white/[.035] p-4 text-center"><p className="text-[9px] font-black uppercase tracking-[.18em] text-white/35">Spoločná obrazovka</p><p className="mt-2 text-[11px] leading-relaxed text-white/45">Pozície lodí zostávajú skryté. Po výstrele aplikácia automaticky označí ďalšieho hráča.</p></section>}

        {phase === "finished" && <section className="battle-finale party-glass mt-5 overflow-hidden rounded-[2rem] border-cyan-300/20 p-6 text-center"><div className="battle-finale-icon text-6xl">🏆</div><p className="mt-4 text-[9px] font-black uppercase tracking-[.25em] text-cyan-300/65">Bitka sa skončila</p><h1 className="mt-2 text-3xl font-black">{winnerName} vyhráva!</h1><p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-white/42">Všetkých päť súperových lodí je potopených. Flotila víťaza ovládla oceán.</p><button onClick={rematch} className="party-shine relative mt-5 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-700 py-4 text-sm font-black uppercase tracking-wider transition active:scale-95">{mode === "local" ? "Odveta s novým rozmiestnením" : "Odveta s rovnakou flotilou"}</button><button onClick={newGame} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[.04] py-4 text-xs font-black text-white/55 transition active:scale-95">Nová hra a rozmiestnenie</button></section>}
      </div>
    </main>
  </PartyBackdrop>;
}
