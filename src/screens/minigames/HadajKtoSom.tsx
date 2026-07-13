import { useState, useEffect, useCallback, useRef } from "react";
import { CHARACTER_CATEGORIES } from "../../data/characters";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "setup" | "who-starts" | "playing" | "round-result" | "final-result";

interface PlayerScore {
  name: string;
  correct: number;
  skipped: number;
  played: boolean;
}

interface Card {
  word: string;
  categoryName: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(catIds: string[]): Card[] {
  const cats = CHARACTER_CATEGORIES.filter((c) => catIds.includes(c.id));
  const cards: Card[] = [];
  for (const cat of cats) {
    for (const ch of cat.characters) {
      cards.push({ word: ch, categoryName: cat.name });
    }
  }
  return shuffle(cards);
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (names: string[], catIds: string[], timerSeconds: number) => void;
}) {
  const [count, setCount] = useState(3);
  const [names, setNames] = useState(
    Array.from({ length: 8 }, (_, i) => `Hráč ${i + 1}`)
  );
  const [selectedCats, setSelectedCats] = useState([CHARACTER_CATEGORIES[0].id]);
  const [timer, setTimer] = useState(60);

  function toggleCat(id: string) {
    setSelectedCats((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((c) => c !== id)
          : prev
        : [...prev, id]
    );
  }

  function start() {
    const trimmedNames = names
      .slice(0, count)
      .map((n, i) => n.trim() || `Hráč ${i + 1}`);
    onStart(trimmedNames, selectedCats, timer);
  }

  return (
    <Shell>
      <TopBar title="Hádaj kto som" onBack={onBack} />

      <div
        className="glass mb-5 rounded-3xl border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-white/70 leading-relaxed"
        style={{ animation: "fadeIn 0.5s ease-out both" }}
      >
        Drž telefón naplocho. Ostatní nakláňajú mobil{" "}
        <strong className="text-white">hore = uhádnuté ✓</strong>,{" "}
        <strong className="text-white">dole = preskočiť ✗</strong>.
        Daj čo najviac za čas!
      </div>

      {/* Category */}
      <div
        className="glass mb-4 rounded-3xl p-4"
        style={{ animation: "slideUp 0.5s ease-out 0.05s both" }}
      >
        <p className="mb-3 text-sm font-bold text-white/60 uppercase tracking-widest">
          Kategória
        </p>
        <div className="flex flex-col gap-2">
          {CHARACTER_CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => toggleCat(cat.id)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition active:scale-[0.98] hover:scale-[1.02] ${
                selectedCats.includes(cat.id)
                  ? "border-cyan-400/60 bg-cyan-500/20"
                  : "border-white/10 bg-white/5"
              }`}
              style={{ animation: `slideUp 0.4s ease-out ${0.1 + i * 0.05}s both` }}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-bold flex-1">{cat.name}</span>
              {selectedCats.includes(cat.id) && (
                <span className="text-cyan-400 font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Timer */}
      <div
        className="glass mb-4 rounded-3xl p-4"
        style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}
      >
        <p className="mb-3 text-sm font-bold text-white/60 uppercase tracking-widest">
          Čas na kolo
        </p>
        <div className="flex gap-2">
          {[30, 45, 60, 90, 120].map((t) => (
            <button
              key={t}
              onClick={() => setTimer(t)}
              className={`flex-1 rounded-2xl border py-3 text-sm font-bold transition active:scale-95 hover:scale-[1.02] ${
                timer === t
                  ? "border-cyan-400/60 bg-cyan-500/30 text-cyan-300"
                  : "border-white/10 bg-white/5 text-white/50"
              }`}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>

      {/* Player count */}
      <div
        className="glass mb-4 rounded-3xl p-4"
        style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}
      >
        <p className="mb-3 text-sm font-bold text-white/60 uppercase tracking-widest">
          Počet hráčov
        </p>
        <div className="flex gap-2 flex-wrap">
          {[2, 3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`h-10 w-10 rounded-2xl text-sm font-bold border transition active:scale-95 hover:scale-[1.02] ${
                count === n
                  ? "border-cyan-400/60 bg-cyan-500/30 text-cyan-300"
                  : "border-white/10 bg-white/5 text-white/50"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Names */}
      <div className="mb-6 flex flex-col gap-2">
        {Array.from({ length: count }, (_, i) => (
          <input
            key={i}
            value={names[i]}
            onChange={(e) =>
              setNames((prev) =>
                prev.map((n, idx) => (idx === i ? e.target.value : n))
              )
            }
            placeholder={`Hráč ${i + 1}`}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base font-semibold text-white placeholder-white/30 outline-none focus:border-cyan-400/60"
            style={{ animation: `slideUp 0.4s ease-out ${0.2 + i * 0.04}s both` }}
          />
        ))}
      </div>

      <Button fullWidth onClick={start} className="hover:scale-[1.02] active:scale-95">
        🎭 Začať hru
      </Button>
    </Shell>
  );
}

// ─── Playing Screen ───────────────────────────────────────────────────────────

function PlayingScreen({
  deck,
  timerSeconds,
  onDone,
}: {
  deck: Card[];
  timerSeconds: number;
  onDone: (correct: number, skipped: number) => void;
}) {
  const [cardIdx, setCardIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);

  // Use refs so event handlers always see fresh values
  const correctRef = useRef(0);
  const skippedRef = useRef(0);
  const tiltLocked = useRef(false);
  const doneRef = useRef(false);

  const card = deck[cardIdx];

  const finishRound = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone(correctRef.current, skippedRef.current);
  }, [onDone]);

  const handleCorrect = useCallback(() => {
    if (doneRef.current || tiltLocked.current) return;
    tiltLocked.current = true;
    correctRef.current += 1;
    setFlash("correct");
    setTimeout(() => {
      setFlash(null);
      setCardIdx((i) => {
        if (i + 1 >= deck.length) {
          finishRound();
          return i;
        }
        return i + 1;
      });
      tiltLocked.current = false;
    }, 600);
  }, [deck.length, finishRound]);

  const handleSkip = useCallback(() => {
    if (doneRef.current || tiltLocked.current) return;
    tiltLocked.current = true;
    skippedRef.current += 1;
    setFlash("wrong");
    setTimeout(() => {
      setFlash(null);
      setCardIdx((i) => {
        if (i + 1 >= deck.length) {
          finishRound();
          return i;
        }
        return i + 1;
      });
      tiltLocked.current = false;
    }, 600);
  }, [deck.length, finishRound]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      finishRound();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, finishRound]);

  // Device orientation with hysteresis:
  // Phone must return to neutral zone before another tilt can trigger.
  // TRIGGER at ±50°, NEUTRAL zone within ±20° — prevents accidental repeated fires.
  useEffect(() => {
    const TRIGGER = 50;   // degrees past this = action fires
    const NEUTRAL = 20;   // degrees — must return inside this to re-arm

    // "neutral" = armed and waiting, "up" / "down" = already fired, waiting to reset
    type Zone = "neutral" | "up" | "down";
    let zone: Zone = "neutral";

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (doneRef.current) return;
      const beta = e.beta;
      if (beta === null) return;

      if (zone === "neutral") {
        // Only fire from neutral zone
        if (beta < -TRIGGER) {
          zone = "up";
          handleCorrect();
        } else if (beta > TRIGGER) {
          zone = "down";
          handleSkip();
        }
      } else {
        // Must fully return to neutral before re-arming
        if (Math.abs(beta) < NEUTRAL) {
          zone = "neutral";
        }
      }
    };

    // Request permission on iOS 13+
    const evt = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof evt.requestPermission === "function") {
      evt.requestPermission().then((state) => {
        if (state === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        }
      });
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [handleCorrect, handleSkip]);

  const timePercent = (timeLeft / timerSeconds) * 100;
  const isWarning = timeLeft <= 10;

  return (
    <div
      className="fixed inset-0 bg-black overflow-hidden select-none"
      style={{ touchAction: "none" }}
    >
      {/* Flash feedback overlay */}
      {flash && (
        <div
          className={`absolute inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${
            flash === "correct" ? "bg-green-500/50" : "bg-red-500/50"
          }`}
          style={{ animation: "fadeIn 0.15s ease-out both" }}
        >
          <span
            className="text-white text-9xl font-black"
            style={{ transform: "rotate(-90deg)", animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
          >
            {flash === "correct" ? "✓" : "✗"}
          </span>
        </div>
      )}

      {/* Landscape content — CSS rotation trick */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          width: "100vh",
          height: "100vw",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-90deg)",
        }}
      >
        {/* Tap zone — upper half = correct */}
        <button
          className="absolute top-0 left-0 right-0 z-10 opacity-0"
          style={{ height: "45%" }}
          onClick={handleCorrect}
        />
        {/* Tap zone — lower half = skip */}
        <button
          className="absolute bottom-0 left-0 right-0 z-10 opacity-0"
          style={{ height: "45%" }}
          onClick={handleSkip}
        />

        {/* Category label — left of landscape */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <p className="text-xs font-bold tracking-widest text-white/30 uppercase">
            {card?.categoryName ?? ""}
          </p>
        </div>

        {/* Timer — right of landscape */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <p
            className={`text-2xl font-black tabular-nums ${
              isWarning ? "text-red-400" : "text-white/50"
            }`}
          >
            {timeLeft}s
          </p>
        </div>

        {/* Tilt hints */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-0.5 opacity-20">
          <span className="text-white text-xs font-black">▲</span>
          <span className="text-white text-[10px] font-bold tracking-wider">UHÁDNUTÉ</span>
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-0.5 opacity-20">
          <span className="text-white text-[10px] font-bold tracking-wider">PRESKOČIŤ</span>
          <span className="text-white text-xs font-black">▼</span>
        </div>

        {/* Main word */}
        <div className="z-20 px-24 text-center pointer-events-none">
          <p
            className="font-black text-white leading-tight"
            style={{
              fontSize: "clamp(2.2rem, 9vmax, 5rem)",
              animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
            }}
            key={cardIdx}
          >
            {card?.word ?? ""}
          </p>
        </div>
      </div>

      {/* Timer bar at bottom of portrait screen */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-50">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isWarning ? "bg-red-500" : "bg-cyan-400"
          }`}
          style={{ width: `${timePercent}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function HadajKtoSom({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [players, setPlayers] = useState<PlayerScore[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Card[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [allCatIds, setAllCatIds] = useState<string[]>([CHARACTER_CATEGORIES[0].id]);

  function handleSetupStart(names: string[], catIds: string[], timer: number) {
    setAllCatIds(catIds);
    setTimerSeconds(timer);
    setPlayers(names.map((name) => ({ name, correct: 0, skipped: 0, played: false })));
    setCurrentPlayer(0);
    setPhase("who-starts");
  }

  function startPlaying() {
    setCurrentDeck(buildDeck(allCatIds));
    setPhase("playing");
  }

  function handleRoundDone(correct: number, skipped: number) {
    setPlayers((prev) =>
      prev.map((p, i) =>
        i === currentPlayer ? { ...p, correct, skipped, played: true } : p
      )
    );
    setPhase("round-result");
  }

  function handleNext() {
    const next = currentPlayer + 1;
    if (next >= players.length) {
      setPhase("final-result");
    } else {
      setCurrentPlayer(next);
      setPhase("who-starts");
    }
  }

  // ── Setup ─────────────────────────────────────────────────────────────────
  if (phase === "setup") {
    return <SetupScreen onBack={onBack} onStart={handleSetupStart} />;
  }

  // ── Who starts ────────────────────────────────────────────────────────────
  if (phase === "who-starts") {
    const p = players[currentPlayer];
    const isFirst = currentPlayer === 0;
    return (
      <Shell>
        <TopBar title="Hádaj kto som" onBack={() => setPhase("setup")} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            <Icons.mask size={56} className="text-cyan-300" />
          </div>
          <p
            className="text-sm font-bold uppercase tracking-widest text-white/40"
            style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }}
          >
            {isFirst ? "Začína" : "Na rade je"}
          </p>
          <h2
            className="text-gradient text-5xl font-black"
            style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}
          >
            {p?.name}
          </h2>
          <div
            className="glass rounded-3xl p-4 text-sm text-white/60 max-w-xs leading-relaxed"
            style={{ animation: "slideUp 0.5s ease-out 0.25s both" }}
          >
            <p className="mb-1 font-bold text-white">Ako hrať:</p>
            <p>
              Ostatní nakláňajú telefón <strong className="text-green-400">hore</strong> keď hráč uhádne,{" "}
              <strong className="text-red-400">dole</strong> keď nevie.
              Alebo klepnite na hornú/dolnú časť obrazovky.
            </p>
          </div>
          <Button fullWidth onClick={startPlaying}>
            🚀 Začať!
          </Button>
        </div>
      </Shell>
    );
  }

  // ── Playing ───────────────────────────────────────────────────────────────
  if (phase === "playing") {
    return (
      <PlayingScreen
        deck={currentDeck}
        timerSeconds={timerSeconds}
        onDone={handleRoundDone}
      />
    );
  }

  // ── Round result ──────────────────────────────────────────────────────────
  if (phase === "round-result") {
    const p = players[currentPlayer];
    const isLast = currentPlayer >= players.length - 1;
    const nextName = !isLast ? players[currentPlayer + 1]?.name : null;

    return (
      <Shell>
        <TopBar title="Výsledok kola" />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20"
            style={{ animation: "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
          >
            <Icons.timer size={44} className="text-cyan-300" />
          </div>
          <h2
            className="text-gradient text-3xl font-black"
            style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}
          >
            {p?.name}
          </h2>

          <div className="flex gap-4 w-full max-w-xs justify-center">
            <div
              className="glass flex-1 rounded-3xl border-green-500/30 bg-green-500/10 py-5"
              style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}
            >
              <div className="text-5xl font-black text-green-400">{p?.correct ?? 0}</div>
              <div className="text-xs uppercase tracking-widest text-white/40 mt-1">
                Uhádnuté
              </div>
            </div>
            <div
              className="glass flex-1 rounded-3xl border-red-500/30 bg-red-500/10 py-5"
              style={{ animation: "slideUp 0.5s ease-out 0.25s both" }}
            >
              <div className="text-5xl font-black text-red-400">{p?.skipped ?? 0}</div>
              <div className="text-xs uppercase tracking-widest text-white/40 mt-1">
                Preskočené
              </div>
            </div>
          </div>

          <Button fullWidth onClick={handleNext}>
            {isLast
              ? "🏆 Zobraziť výsledky"
              : `➡️ Ďalší: ${nextName}`}
          </Button>
        </div>
      </Shell>
    );
  }

  // ── Final result ──────────────────────────────────────────────────────────
  if (phase === "final-result") {
    const sorted = [...players].sort((a, b) => b.correct - a.correct);
    const winner = sorted[0];

    return (
      <Shell>
        <TopBar title="Koniec hry" />
        <div className="flex flex-1 flex-col gap-5 pt-2">
          <div className="text-center" style={{ animation: "fadeIn 0.5s ease-out both" }}>
            <div
              className="flex h-20 w-20 mx-auto mb-3 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-500/30 to-orange-500/20"
              style={{ animation: "tada 0.8s ease-out 0.1s both" }}
            >
              <Icons.trophy size={48} className="text-yellow-300" />
            </div>
            <h2 className="text-gradient text-2xl font-black">Koniec!</h2>
            {winner && (
              <p className="text-white/50 text-sm mt-1">
                Vyhráva{" "}
                <strong className="text-white">{winner.name}</strong> s{" "}
                {winner.correct}{" "}
                {winner.correct === 1 ? "bodom" : winner.correct < 5 ? "bodmi" : "bodmi"}!
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {sorted.map((p, rank) => (
              <div
                key={p.name}
                className={`glass flex items-center gap-4 rounded-2xl px-4 py-3 ${
                  rank === 0
                    ? "border-yellow-500/40 bg-yellow-500/10"
                    : ""
                }`}
                style={{ animation: `slideUp 0.5s ease-out ${0.1 + rank * 0.08}s both` }}
              >
                <span className="text-xl w-8 text-center">
                  {rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : `${rank + 1}.`}
                </span>
                <span className="flex-1 font-bold">{p.name}</span>
                <span className="text-green-400 font-black text-xl">{p.correct}</span>
                <span className="text-white/30 text-sm">
                  /{p.correct + p.skipped}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              fullWidth
              onClick={() => {
                setCurrentPlayer(0);
                setPhase("who-starts");
              }}
            >
              🔄 Hrať znova
            </Button>
            <Button fullWidth variant="secondary" onClick={() => setPhase("setup")}>
              Nastavenia
            </Button>
          </div>
          <Button fullWidth variant="ghost" onClick={onBack}>
            Domov
          </Button>
        </div>
      </Shell>
    );
  }

  return null;
}
