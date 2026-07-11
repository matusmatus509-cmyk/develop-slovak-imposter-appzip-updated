import { useState, useEffect, useRef, useCallback } from "react";
import { CATEGORIES } from "../../data/categories";
import { Button, Shell, TopBar } from "../../components/ui";

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = "setup" | "game" | "eliminated" | "winner";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Setup ────────────────────────────────────────────────────────────────────

function SetupScreen({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (names: string[], timePerWord: number, lives: number) => void;
}) {
  const [count, setCount] = useState(4);
  const [names, setNames] = useState<string[]>(
    Array.from({ length: 8 }, (_, i) => `Hráč ${i + 1}`)
  );
  const [timePerWord, setTimePerWord] = useState(5);
  const [lives, setLives] = useState(3);

  function updateName(i: number, val: string) {
    setNames((prev) => prev.map((n, idx) => (idx === i ? val : n)));
  }

  function start() {
    const trimmed = names.slice(0, count).map((n) => n.trim() || `Hráč ${n}`);
    onStart(trimmed, timePerWord, lives);
  }

  return (
    <Shell>
      <TopBar title="Slovny Ping Pong" onBack={onBack} />

      <div className="mb-5 rounded-3xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-white/70 leading-relaxed">
        Zavolajte kategóriu a hráči striedavo čo najrýchlejšie
        hovoria <strong className="text-white">slová z tej kategórie</strong>.
        Nestihneš, zopakovanie alebo chyba = strata života. Posledný ostáva víťaz!
      </div>

      {/* Player count */}
      <div className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-sm font-bold text-white/60 uppercase tracking-widest">
          Počet hráčov
        </p>
        <div className="flex gap-2 flex-wrap">
          {[2, 3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`h-10 w-10 rounded-2xl text-sm font-bold border transition active:scale-95 ${
                count === n
                  ? "border-green-400/60 bg-green-500/30 text-green-300"
                  : "border-white/10 bg-white/5 text-white/50"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Names */}
      <div className="mb-4 flex flex-col gap-2">
        {Array.from({ length: count }, (_, i) => (
          <input
            key={i}
            value={names[i]}
            onChange={(e) => updateName(i, e.target.value)}
            placeholder={`Hráč ${i + 1}`}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base font-semibold text-white placeholder-white/30 outline-none focus:border-green-400/60 focus:bg-white/10"
          />
        ))}
      </div>

      {/* Timer */}
      <div className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-sm font-bold text-white/60 uppercase tracking-widest">
          Čas na slovo
        </p>
        <div className="flex gap-2">
          {[3, 5, 7, 10].map((t) => (
            <button
              key={t}
              onClick={() => setTimePerWord(t)}
              className={`flex-1 rounded-2xl py-2.5 text-sm font-bold border transition active:scale-95 ${
                timePerWord === t
                  ? "border-green-400/60 bg-green-500/30 text-green-300"
                  : "border-white/10 bg-white/5 text-white/50"
              }`}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>

      {/* Lives */}
      <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-sm font-bold text-white/60 uppercase tracking-widest">
          Životy na hráča
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 5].map((l) => (
            <button
              key={l}
              onClick={() => setLives(l)}
              className={`flex-1 rounded-2xl py-2.5 text-sm font-bold border transition active:scale-95 ${
                lives === l
                  ? "border-green-400/60 bg-green-500/30 text-green-300"
                  : "border-white/10 bg-white/5 text-white/50"
              }`}
            >
              {"❤️".repeat(l)}
            </button>
          ))}
        </div>
      </div>

      <Button fullWidth onClick={start}>
        🏓 Začať ping pong
      </Button>
    </Shell>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SlovnyPingPong({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [lives, setLivesState] = useState<number[]>([]);
  const [maxLives, setMaxLives] = useState(3);
  const [timePerWord, setTimePerWordState] = useState(5);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [saidWords, setSaidWords] = useState<string[]>([]);
  const [eliminatedName, setEliminatedName] = useState("");
  const [winnerName, setWinnerName] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  const activePlayers = playerNames
    .map((name, i) => ({ name, lives: lives[i], idx: i }))
    .filter((p) => p.lives > 0);

  // Move to next active player
  const nextActivePlayer = useCallback(
    (fromIdx: number, currentLives: number[]) => {
      const active = playerNames
        .map((_, i) => i)
        .filter((i) => currentLives[i] > 0);
      if (active.length <= 1) {
        const winnerId = active[0] ?? 0;
        setWinnerName(playerNames[winnerId] ?? "");
        setPhase("winner");
        return;
      }
      const pos = active.indexOf(fromIdx);
      const nextPos = (pos + 1) % active.length;
      setCurrentIdx(active[nextPos]);
      setTimeLeft(timePerWord);
      setTimerActive(true);
    },
    [playerNames, timePerWord]
  );

  function loseLife(idx: number) {
    const newLives = lives.map((l, i) => (i === idx ? l - 1 : l));
    setLivesState(newLives);
    setTimerActive(false);

    if (newLives[idx] === 0) {
      setEliminatedName(playerNames[idx]);
      setPhase("eliminated");
      // Check if only 1 left
      const remaining = newLives.filter((l) => l > 0);
      if (remaining.length <= 1) {
        const winnerId = newLives.findIndex((l) => l > 0);
        setWinnerName(playerNames[winnerId >= 0 ? winnerId : 0]);
        setTimeout(() => setPhase("winner"), 1500);
        return;
      }
      // resume after showing elimination
      setTimeout(() => {
        setPhase("game");
        nextActivePlayer(idx, newLives);
      }, 2000);
    } else {
      nextActivePlayer(idx, newLives);
    }
  }

  // Timer countdown
  useEffect(() => {
    if (!timerActive || phase !== "game") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setTimerActive(false);
          loseLife(currentIdx);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [timerActive, currentIdx, phase]);

  function startGame(names: string[], time: number, startLives: number) {
    const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    setPlayerNames(names);
    setLivesState(Array(names.length).fill(startLives));
    setMaxLives(startLives);
    setTimePerWordState(time);
    setCurrentIdx(0);
    setTimeLeft(time);
    setCategory(cat);
    setSaidWords([]);
    setTimerActive(true);
    setPhase("game");
  }

  function handleWordOk() {
    if (phase !== "game") return;
    clearInterval(timerRef.current!);
    setTimerActive(false);
    setSaidWords((w) => [...w]);
    nextActivePlayer(currentIdx, lives);
  }

  function handleCheat() {
    // Opponent challenges — current player loses a life
    clearInterval(timerRef.current!);
    setTimerActive(false);
    loseLife(currentIdx);
  }

  function handleNewCategory() {
    const cats = CATEGORIES.filter((c) => c.id !== category.id);
    setCategory(cats[Math.floor(Math.random() * cats.length)]);
    setSaidWords([]);
    setTimeLeft(timePerWord);
    setTimerActive(true);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (phase === "setup") {
    return <SetupScreen onBack={onBack} onStart={startGame} />;
  }

  const currentPlayer = playerNames[currentIdx] ?? "";
  const progress = timeLeft / timePerWord;

  if (phase === "game" || phase === "eliminated") {
    return (
      <Shell>
        <TopBar title="Slovný Ping Pong" onBack={onBack} />

        {/* Category banner */}
        <div className="mb-4 rounded-3xl border border-green-500/30 bg-green-500/10 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-1">
            Kategória
          </p>
          <p className="text-2xl font-black">
            {category.icon} {category.name}
          </p>
          <button
            onClick={handleNewCategory}
            className="mt-2 text-xs text-green-400/70 underline"
          >
            Zmeniť kategóriu
          </button>
        </div>

        {/* Lives scoreboard */}
        <div className="mb-4 flex flex-wrap gap-2">
          {playerNames.map((name, i) => (
            <div
              key={i}
              className={`flex-1 min-w-[80px] rounded-2xl border px-3 py-2 text-center text-xs ${
                lives[i] === 0
                  ? "border-white/5 bg-white/5 opacity-40"
                  : i === currentIdx
                  ? "border-green-400/40 bg-green-500/15"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="font-bold text-white truncate">{name}</div>
              <div className="mt-0.5">
                {Array(maxLives)
                  .fill(0)
                  .map((_, li) => (
                    <span key={li} className={li < lives[i] ? "text-red-400" : "opacity-20"}>
                      ❤️
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Current player + timer */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
          {phase === "eliminated" ? (
            <div className="text-center">
              <div className="text-5xl mb-3">💀</div>
              <p className="text-2xl font-black text-red-400">{eliminatedName}</p>
              <p className="text-white/50 mt-1">vypadol/a!</p>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-widest text-white/40">
                Na rade
              </p>
              <p className="text-4xl font-black">{currentPlayer}</p>

              {/* Circular timer */}
              <div className="relative flex h-32 w-32 items-center justify-center">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="44"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50" cy="50" r="44"
                    fill="none"
                    stroke={progress > 0.4 ? "#4ade80" : progress > 0.2 ? "#facc15" : "#f87171"}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 44}`}
                    strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
                  />
                </svg>
                <span className="text-4xl font-black">{timeLeft}</span>
              </div>

              {/* Actions */}
              <div className="flex w-full gap-3">
                <button
                  onClick={handleCheat}
                  className="flex-1 rounded-2xl border border-red-500/30 bg-red-500/10 py-4 text-sm font-bold text-red-400 active:scale-95 transition"
                >
                  ❌ Chyba / Zopakovanie
                </button>
                <button
                  onClick={handleWordOk}
                  className="flex-1 rounded-2xl border border-green-500/30 bg-green-500/20 py-4 text-sm font-bold text-green-300 active:scale-95 transition"
                >
                  ✅ Slovo OK
                </button>
              </div>
              <p className="text-xs text-white/30">
                Stlač ✅ po každom platnom slove hráča
              </p>
            </>
          )}
        </div>
      </Shell>
    );
  }

  if (phase === "winner") {
    return (
      <Shell>
        <TopBar title="Slovný Ping Pong" onBack={onBack} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="text-6xl">🏆</div>
          <h2 className="text-3xl font-black">{winnerName}</h2>
          <p className="text-white/60">vyhral/a slovný ping pong!</p>

          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="mb-3 text-xs uppercase tracking-widest text-white/40">
              Konečné poradie
            </p>
            {playerNames
              .map((name, i) => ({ name, lives: lives[i] }))
              .sort((a, b) => b.lives - a.lives)
              .map((p, rank) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between py-2"
                >
                  <span className="font-bold">
                    {rank === 0 ? "🥇 " : rank === 1 ? "🥈 " : rank === 2 ? "🥉 " : `${rank + 1}. `}
                    {p.name}
                  </span>
                  <span className="text-sm text-white/50">
                    {Array(maxLives)
                      .fill(0)
                      .map((_, li) => (
                        <span key={li} className={li < p.lives ? "text-red-400" : "opacity-20"}>
                          ❤️
                        </span>
                      ))}
                  </span>
                </div>
              ))}
          </div>

          <div className="flex w-full gap-3">
            <Button
              fullWidth
              onClick={() =>
                startGame(playerNames, timePerWord, maxLives)
              }
            >
              🔄 Nová hra
            </Button>
            <Button fullWidth variant="ghost" onClick={onBack}>
              Domov
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  return null;
}
