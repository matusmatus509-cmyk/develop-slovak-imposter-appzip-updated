import { useState, useEffect } from "react";
import { CATEGORIES } from "../../data/categories";
import { Button, Shell, TopBar } from "../../components/ui";

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = "setup" | "reveal" | "cover" | "play" | "vote" | "result";

interface PlayerCard {
  name: string;
  word: string;
  category: string;
  categoryIcon: string;
  isImpostor: boolean;
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

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildCards(names: string[]): PlayerCard[] {
  if (names.length < 2) return [];

  // Pick main category
  const shuffledCats = shuffle(CATEGORIES);
  const mainCat = shuffledCats[0];
  const otherCat = shuffledCats[1];

  // Impostor is a random player
  const impostorIdx = Math.floor(Math.random() * names.length);

  return names.map((name, i) => {
    if (i === impostorIdx) {
      return {
        name,
        word: pickRandom(otherCat.wordPairs).word,
        category: otherCat.name,
        categoryIcon: otherCat.icon,
        isImpostor: true,
      };
    }
    return {
      name,
      word: pickRandom(mainCat.wordPairs).word,
      category: mainCat.name,
      categoryIcon: mainCat.icon,
      isImpostor: false,
    };
  });
}

// ─── Setup ────────────────────────────────────────────────────────────────────

function SetupScreen({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (names: string[]) => void;
}) {
  const [count, setCount] = useState(4);
  const [names, setNames] = useState<string[]>(
    Array.from({ length: 8 }, (_, i) => `Hráč ${i + 1}`)
  );

  function updateName(i: number, val: string) {
    setNames((prev) => prev.map((n, idx) => (idx === i ? val : n)));
  }

  function start() {
    const trimmed = names.slice(0, count).map((n) => n.trim() || `Hráč ${n}`);
    onStart(trimmed);
  }

  return (
    <Shell>
      <TopBar title="Slovná rošáda" onBack={onBack} />

      <div className="mb-5 rounded-3xl border border-purple-500/20 bg-purple-500/10 p-4 text-sm text-white/70 leading-relaxed">
        Každý hráč dostane <strong className="text-white">tajné slovo</strong>{" "}
        z tej istej kategórie – okrem{" "}
        <strong className="text-purple-300">rošádnika</strong>, ktorý dostane
        slovo z inej kategórie. Opisujte slová, hlasujte!
      </div>

      {/* Player count */}
      <div className="mb-5 rounded-3xl border border-white/10 bg-white/5 p-4">
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
                  ? "border-purple-400/60 bg-purple-500/30 text-purple-300"
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
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base font-semibold text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:bg-white/10"
          />
        ))}
      </div>

      <Button fullWidth onClick={start}>
        🃏 Začať hru
      </Button>
    </Shell>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SlovnaRosada({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [cards, setCards] = useState<PlayerCard[]>([]);
  const [revealIdx, setRevealIdx] = useState(0);
  const [showingWord, setShowingWord] = useState(false);
  const [votedIdx, setVotedIdx] = useState<number | null>(null);

  // Reveal phase
  const currentRevealCard = cards[revealIdx];

  function startGame(names: string[]) {
    setCards(buildCards(names));
    setRevealIdx(0);
    setShowingWord(false);
    setVotedIdx(null);
    setPhase("reveal");
  }

  function handleRevealTap() {
    if (!showingWord) {
      setShowingWord(true);
    } else {
      // Done reading — go to cover screen before next player
      if (revealIdx < cards.length - 1) {
        setShowingWord(false);
        setPhase("cover");
      } else {
        setPhase("play");
      }
    }
  }

  function handleCoverNext() {
    setRevealIdx((i) => i + 1);
    setShowingWord(false);
    setPhase("reveal");
  }

  function handleVote(idx: number) {
    setVotedIdx(idx);
    setPhase("result");
  }

  function resetGame() {
    setCards(buildCards(cards.map((c) => c.name)));
    setRevealIdx(0);
    setShowingWord(false);
    setVotedIdx(null);
    setPhase("reveal");
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  if (phase === "setup") {
    return <SetupScreen onBack={onBack} onStart={startGame} />;
  }

  if (phase === "reveal" && currentRevealCard) {
    return (
      <Shell>
        <TopBar title="Slovná rošáda" onBack={() => setPhase("setup")} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="text-sm font-bold uppercase tracking-widest text-white/40">
            Hráč {revealIdx + 1} z {cards.length}
          </div>
          <div className="text-4xl font-black">{currentRevealCard.name}</div>

          {!showingWord ? (
            <>
              <p className="text-sm text-white/50 max-w-xs">
                Uisti sa, že ostatní nevidia obrazovku, potom klepni na kartu.
              </p>
              <button
                onClick={handleRevealTap}
                className="flex h-44 w-full max-w-xs flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-purple-400/40 bg-purple-500/10 active:scale-95 transition"
              >
                <span className="text-5xl">🃏</span>
                <span className="text-base font-bold text-purple-300">
                  Klepni pre zobrazenie
                </span>
              </button>
            </>
          ) : (
            <>
              <div className="w-full max-w-xs rounded-3xl border border-white/15 bg-white/5 p-8">
                <p className="mb-2 text-xs uppercase tracking-widest text-white/40">
                  Tvoje tajné slovo
                </p>
                <p className="text-4xl font-black text-white">
                  {currentRevealCard.word}
                </p>
                <p className="mt-3 text-xs text-white/40">
                  {currentRevealCard.categoryIcon} {currentRevealCard.category}
                </p>
                <p className="mt-4 text-sm text-white/50 leading-relaxed">
                  Opisuj toto slovo ostatným — ale nehovor ho priamo!
                </p>
              </div>
              <Button fullWidth onClick={handleRevealTap}>
                Zapamätal/a som si ✓
              </Button>
            </>
          )}
        </div>
      </Shell>
    );
  }

  if (phase === "cover") {
    const nextCard = cards[revealIdx + 1];
    return (
      <Shell>
        <TopBar title="Slovná rošáda" onBack={() => setPhase("setup")} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="text-6xl">🙈</div>
          <h2 className="text-2xl font-black">Zakry obrazovku!</h2>
          <p className="text-white/60">
            Odovzdaj telefón hráčovi{" "}
            <strong className="text-white">{nextCard?.name}</strong>
          </p>
          <Button fullWidth onClick={handleCoverNext}>
            Som pripravený/á →
          </Button>
        </div>
      </Shell>
    );
  }

  if (phase === "play") {
    return (
      <Shell>
        <TopBar title="Slovná rošáda" onBack={() => setPhase("setup")} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="text-5xl">💬</div>
          <h2 className="text-2xl font-black">Opisujte!</h2>
          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 text-left text-sm text-white/70 leading-relaxed space-y-2">
            <p>
              🎯 Každý hráč postupne opíše svoje slovo{" "}
              <strong className="text-white">bez toho, aby ho povedal</strong>.
            </p>
            <p>
              🕵️ Jeden hráč je <strong className="text-purple-300">rošádnik</strong>{" "}
              — má slovo z inej kategórie.
            </p>
            <p>
              🗳️ Po opise všetkých hlasujte, kto je rošádnik!
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Button fullWidth onClick={() => setPhase("vote")}>
              🗳️ Hlasovať
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  if (phase === "vote") {
    return (
      <Shell>
        <TopBar title="Hlasovanie" onBack={() => setPhase("play")} />
        <div className="flex flex-1 flex-col gap-4">
          <div className="py-4 text-center">
            <p className="text-xl font-black">Kto je rošádnik?</p>
            <p className="text-sm text-white/50 mt-1">
              Kto mal slovo z inej kategórie?
            </p>
          </div>
          {cards.map((card, i) => (
            <button
              key={i}
              onClick={() => handleVote(i)}
              className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-left active:scale-[0.98] transition"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 text-xl font-black text-purple-300">
                {card.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-lg font-bold">{card.name}</span>
            </button>
          ))}
        </div>
      </Shell>
    );
  }

  if (phase === "result") {
    const impostor = cards.find((c) => c.isImpostor)!;
    const impostorIdx = cards.findIndex((c) => c.isImpostor);
    const correct = votedIdx === impostorIdx;

    return (
      <Shell>
        <TopBar title="Výsledok" onBack={() => setPhase("setup")} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="text-6xl">{correct ? "🎉" : "😈"}</div>
          <h2 className="text-2xl font-black">
            {correct ? "Správne! Rošádnik odhalený!" : "Rošádnik vyhral!"}
          </h2>

          {/* Impostor reveal */}
          <div className="w-full rounded-3xl border border-purple-500/30 bg-purple-500/10 p-6">
            <p className="mb-1 text-xs uppercase tracking-widest text-purple-400">
              Rošádnik bol
            </p>
            <p className="text-3xl font-black">{impostor.name}</p>
            <div className="mt-3 flex justify-center gap-3 text-sm">
              <span className="rounded-xl bg-white/10 px-3 py-1.5 text-white/60">
                Slovo: <strong className="text-white">{impostor.word}</strong>
              </span>
              <span className="rounded-xl bg-white/10 px-3 py-1.5 text-white/60">
                {impostor.categoryIcon} {impostor.category}
              </span>
            </div>
          </div>

          {/* All words */}
          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="mb-3 text-xs uppercase tracking-widest text-white/40">
              Všetky slová
            </p>
            <div className="flex flex-col gap-2">
              {cards.map((card, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-2xl px-4 py-2.5 ${
                    card.isImpostor
                      ? "border border-purple-500/40 bg-purple-500/15"
                      : "bg-white/5"
                  }`}
                >
                  <span className="font-bold">
                    {card.isImpostor ? "😈 " : ""}
                    {card.name}
                  </span>
                  <span className="text-sm text-white/60">
                    {card.word} ({card.categoryIcon})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full gap-3">
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
