import { useState } from "react";
import {
  CHARACTER_CATEGORIES,
  type CharacterCategory,
} from "../../data/characters";
import { Button, Shell, TopBar } from "../../components/ui";

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = "setup" | "assign" | "cover" | "play" | "result";

interface PlayerAssignment {
  name: string;
  character: string;
  guessed: boolean;
  guessOrder: number | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildAssignments(
  names: string[],
  cat: CharacterCategory
): PlayerAssignment[] {
  const chars = shuffle(cat.characters);
  return names.map((name, i) => ({
    name,
    character: chars[i % chars.length],
    guessed: false,
    guessOrder: null,
  }));
}

// ─── Setup ────────────────────────────────────────────────────────────────────

function SetupScreen({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (names: string[], catId: string) => void;
}) {
  const [count, setCount] = useState(4);
  const [names, setNames] = useState<string[]>(
    Array.from({ length: 8 }, (_, i) => `Hráč ${i + 1}`)
  );
  const [selectedCat, setSelectedCat] = useState(CHARACTER_CATEGORIES[0].id);

  function updateName(i: number, val: string) {
    setNames((prev) => prev.map((n, idx) => (idx === i ? val : n)));
  }

  function start() {
    const trimmed = names.slice(0, count).map((n) => n.trim() || `Hráč ${n}`);
    onStart(trimmed, selectedCat);
  }

  return (
    <Shell>
      <TopBar title="Hádaj kto som" onBack={onBack} />

      <div className="mb-5 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-white/70 leading-relaxed">
        Každý dostane <strong className="text-white">tajnú osobu/postavu</strong>.
        Drž telefón na čele — ostatní vidia koho si! Pýtaj sa otázky na
        „áno/nie" a uhádni, kto si.
      </div>

      {/* Category */}
      <div className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-sm font-bold text-white/60 uppercase tracking-widest">
          Kategória
        </p>
        <div className="flex flex-col gap-2">
          {CHARACTER_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition active:scale-[0.98] ${
                selectedCat === cat.id
                  ? "border-cyan-400/60 bg-cyan-500/20"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-bold">{cat.name}</span>
            </button>
          ))}
        </div>
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
            onChange={(e) => updateName(i, e.target.value)}
            placeholder={`Hráč ${i + 1}`}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base font-semibold text-white placeholder-white/30 outline-none focus:border-cyan-400/60 focus:bg-white/10"
          />
        ))}
      </div>

      <Button fullWidth onClick={start}>
        🎭 Prideliť postavy
      </Button>
    </Shell>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HadajKtoSom({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [assignments, setAssignments] = useState<PlayerAssignment[]>([]);
  const [assignIdx, setAssignIdx] = useState(0); // which player is currently seeing others' char
  const [showChar, setShowChar] = useState(false); // is the character visible on screen
  const [guessCount, setGuessCount] = useState(0);
  const [focusedPlayer, setFocusedPlayer] = useState<number | null>(null);

  function startGame(names: string[], catId: string) {
    const cat =
      CHARACTER_CATEGORIES.find((c) => c.id === catId) ??
      CHARACTER_CATEGORIES[0];
    setAssignments(buildAssignments(names, cat));
    setAssignIdx(0);
    setShowChar(false);
    setGuessCount(0);
    setFocusedPlayer(null);
    setPhase("assign");
  }

  // The current player during assignment phase
  const assigningPlayer = assignments[assignIdx];
  // What the current player's character looks like to OTHERS
  // (others hold the phone and see THIS screen; current player must NOT look)
  // After seeing, cover screen, then next player

  function handleShowCharacter() {
    setShowChar(true);
  }

  function handleCharacterSeen() {
    // Move to cover between players
    setShowChar(false);
    if (assignIdx < assignments.length - 1) {
      setPhase("cover");
    } else {
      setPhase("play");
    }
  }

  function handleCoverNext() {
    setAssignIdx((i) => i + 1);
    setShowChar(false);
    setPhase("assign");
  }

  function markGuessed(i: number) {
    const newCount = guessCount + 1;
    setGuessCount(newCount);
    setAssignments((prev) =>
      prev.map((a, idx) =>
        idx === i ? { ...a, guessed: true, guessOrder: newCount } : a
      )
    );
    setFocusedPlayer(null);
    if (newCount >= assignments.length) {
      setPhase("result");
    }
  }

  function resetGame() {
    setAssignments(buildAssignments(assignments.map((a) => a.name), CHARACTER_CATEGORIES.find((c) =>
      c.characters.includes(assignments[0]?.character)
    ) ?? CHARACTER_CATEGORIES[0]));
    setAssignIdx(0);
    setShowChar(false);
    setGuessCount(0);
    setFocusedPlayer(null);
    setPhase("assign");
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (phase === "setup") {
    return <SetupScreen onBack={onBack} onStart={startGame} />;
  }

  // Assignment phase: show current player's character to others
  if (phase === "assign" && assigningPlayer) {
    return (
      <Shell>
        <TopBar title="Prideľovanie postáv" onBack={() => setPhase("setup")} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="text-sm font-bold uppercase tracking-widest text-white/40">
            Hráč {assignIdx + 1} z {assignments.length}
          </div>
          <div className="text-3xl font-black">{assigningPlayer.name}</div>
          <p className="text-sm text-white/50 max-w-xs">
            <strong className="text-white">{assigningPlayer.name}</strong>, drž
            telefón na čele — ostatní vidia tvoju postavu. Ty sa NEPOZERAJ!
          </p>

          {!showChar ? (
            <button
              onClick={handleShowCharacter}
              className="flex h-44 w-full max-w-xs flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-cyan-400/40 bg-cyan-500/10 active:scale-95 transition"
            >
              <span className="text-5xl">🎭</span>
              <span className="text-base font-bold text-cyan-300">
                Ostatní: klepnite pre zobrazenie
              </span>
            </button>
          ) : (
            <>
              {/* Big character display — others read this */}
              <div className="w-full max-w-xs rounded-3xl border-2 border-cyan-400/40 bg-cyan-500/15 p-8">
                <p className="mb-2 text-xs uppercase tracking-widest text-cyan-400">
                  Postava hráča {assigningPlayer.name}
                </p>
                <p className="text-4xl font-black leading-tight text-white">
                  {assigningPlayer.character}
                </p>
                <p className="mt-4 text-sm text-white/50">
                  Zapamätajte si ju! Hráč nesmie vidieť obrazovku.
                </p>
              </div>
              <Button fullWidth onClick={handleCharacterSeen}>
                Všetci videli ✓
              </Button>
            </>
          )}
        </div>
      </Shell>
    );
  }

  if (phase === "cover") {
    const nextPlayer = assignments[assignIdx + 1];
    return (
      <Shell>
        <TopBar title="Hádaj kto som" onBack={() => setPhase("setup")} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="text-6xl">🙈</div>
          <h2 className="text-2xl font-black">Zakry obrazovku!</h2>
          <p className="text-white/60">
            Odovzdaj telefón hráčovi{" "}
            <strong className="text-white">{nextPlayer?.name}</strong>
          </p>
          <Button fullWidth onClick={handleCoverNext}>
            Som pripravený/á →
          </Button>
        </div>
      </Shell>
    );
  }

  if (phase === "play") {
    const remaining = assignments.filter((a) => !a.guessed);
    const guessed = assignments.filter((a) => a.guessed);

    return (
      <Shell>
        <TopBar title="Hádaj kto som" onBack={onBack} />

        <div className="mb-4 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-white/70">
          Každý sa pýta skupiny otázky na <strong className="text-white">áno/nie</strong>{" "}
          a snaží sa uhádnuť, kto je. Keď niekto správne uhádne, klepnite jeho meno.
        </div>

        {/* Still guessing */}
        {remaining.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs uppercase tracking-widest text-white/40">
              Ešte neuhádli
            </p>
            <div className="flex flex-col gap-2">
              {remaining.map((p, i) => {
                const idx = assignments.findIndex((a) => a.name === p.name);
                const focused = focusedPlayer === idx;
                return (
                  <div key={idx}>
                    <button
                      onClick={() =>
                        setFocusedPlayer(focused ? null : idx)
                      }
                      className={`w-full flex items-center gap-4 rounded-3xl border p-4 text-left active:scale-[0.98] transition ${
                        focused
                          ? "border-cyan-400/40 bg-cyan-500/15"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/20 text-xl font-black text-cyan-300">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="flex-1 text-lg font-bold">{p.name}</span>
                      <span className="text-white/30">›</span>
                    </button>
                    {focused && (
                      <div className="mt-1 ml-4 flex gap-2">
                        <button
                          onClick={() => markGuessed(idx)}
                          className="flex-1 rounded-2xl border border-green-500/30 bg-green-500/15 py-3 text-sm font-bold text-green-300 active:scale-95"
                        >
                          ✅ Uhádol/a!
                        </button>
                        <button
                          onClick={() => setFocusedPlayer(null)}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/50 active:scale-95"
                        >
                          Zrušiť
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Already guessed */}
        {guessed.length > 0 && (
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-white/40">
              Uhádli
            </p>
            <div className="flex flex-col gap-2">
              {guessed
                .sort((a, b) => (a.guessOrder ?? 0) - (b.guessOrder ?? 0))
                .map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-4 rounded-3xl border border-green-500/20 bg-green-500/10 px-4 py-3"
                  >
                    <span className="text-green-400 text-xl">
                      {p.guessOrder === 1
                        ? "🥇"
                        : p.guessOrder === 2
                        ? "🥈"
                        : p.guessOrder === 3
                        ? "🥉"
                        : "✅"}
                    </span>
                    <span className="flex-1 font-bold">{p.name}</span>
                    <span className="text-sm text-white/50">{p.character}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <Button fullWidth variant="secondary" onClick={() => setPhase("result")}>
            Ukončiť hru
          </Button>
        </div>
      </Shell>
    );
  }

  if (phase === "result") {
    const sorted = [...assignments].sort(
      (a, b) => (a.guessOrder ?? 999) - (b.guessOrder ?? 999)
    );
    return (
      <Shell>
        <TopBar title="Výsledok" onBack={() => setPhase("setup")} />
        <div className="flex flex-1 flex-col gap-6">
          <div className="text-center pt-4">
            <div className="text-5xl mb-3">🎭</div>
            <h2 className="text-2xl font-black">Koniec hry!</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="mb-3 text-xs uppercase tracking-widest text-white/40">
              Poradie uhádnutia
            </p>
            <div className="flex flex-col gap-3">
              {sorted.map((p, rank) => (
                <div
                  key={p.name}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-3 ${
                    p.guessed
                      ? "border border-green-500/20 bg-green-500/10"
                      : "border border-white/5 bg-white/5 opacity-50"
                  }`}
                >
                  <span className="text-xl w-8 text-center">
                    {p.guessed
                      ? rank === 0
                        ? "🥇"
                        : rank === 1
                        ? "🥈"
                        : rank === 2
                        ? "🥉"
                        : `${rank + 1}.`
                      : "❓"}
                  </span>
                  <div className="flex-1">
                    <div className="font-bold">{p.name}</div>
                    <div className="text-sm text-white/50">{p.character}</div>
                  </div>
                  {p.guessed ? (
                    <span className="text-xs text-green-400">Uhádol ✓</span>
                  ) : (
                    <span className="text-xs text-white/30">Neuhádol</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button fullWidth onClick={resetGame}>
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
