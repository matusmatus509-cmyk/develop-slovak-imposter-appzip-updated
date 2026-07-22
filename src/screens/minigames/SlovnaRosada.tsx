import { useState, useEffect, useRef } from "react";
import {
  ALL_SOLO_CHARADES_WORDS,
  SOLO_CHARADES_WORDS,
  type CharadesDifficulty,
} from "../../data/charades";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { defaultPlayerName, useLanguage } from "../../i18n/LanguageProvider";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "setup" | "who-starts" | "playing" | "round-result" | "final-result";

interface Player {
  name: string;
  team: 0 | 1; // team mode: 0 or 1
  score: number;
  skipsUsed: number;
}

interface Card {
  word: string;
  category: string;
  categoryIcon: string;
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

function buildDeck(difficulty: string): Card[] {
  const labels: Record<CharadesDifficulty, { name: string; icon: string }> = {
    lahke: { name: "Ľahké", icon: "🟢" },
    stredne: { name: "Stredné", icon: "🟡" },
    tazke: { name: "Ťažké", icon: "🔴" },
  };
  const levels: CharadesDifficulty[] = difficulty === "all"
    ? ["lahke", "stredne", "tazke"]
    : [difficulty as CharadesDifficulty];
  const cards = levels.flatMap((level) =>
    (SOLO_CHARADES_WORDS[level] ?? []).map((word) => ({
      word,
      category: labels[level]?.name ?? "Šarády",
      categoryIcon: labels[level]?.icon ?? "💬",
    })),
  );
  const seen = new Set<string>();
  const uniqueCards = cards.filter((card) => {
    const key = card.word.trim().toLocaleLowerCase("sk");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const fallback = ALL_SOLO_CHARADES_WORDS.map((word) => ({
    word,
    category: "Šarády",
    categoryIcon: "💬",
  }));
  return shuffle(uniqueCards.length > 0 ? uniqueCards : fallback);
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (names: string[], timerSecs: number, maxSkips: number, teamMode: boolean, difficulty: string) => void;
}) {
  const { language } = useLanguage();
  const [count, setCount] = useState(4);
  const [names, setNames] = useState(
    Array.from({ length: 8 }, (_, i) => defaultPlayerName(language, i + 1)),
  );
  const [timerSecs, setTimerSecs] = useState(60);
  const [maxSkips, setMaxSkips] = useState(3);
  const [teamMode, setTeamMode] = useState(false);
  const [difficulty, setDifficulty] = useState("all");

  return (
    <Shell>
      <TopBar title="Slovné šarády" onBack={onBack} />

      <div
        className="glass mb-5 rounded-3xl border-purple-500/20 bg-purple-500/10 p-4 text-sm text-white/70 leading-relaxed"
        style={{ animation: "fadeIn 0.5s ease-out both" }}
      >
        Vysvetluj slová bez toho, aby si ich povedal/a. Za každé uhádnuté slovo bod. Preskočiť môžeš obmedzený počet krát!
      </div>

      {/* Team mode */}
      <div
        className="glass mb-4 rounded-3xl p-4"
        style={{ animation: "slideUp 0.5s ease-out 0.05s both" }}
      >
        <button
          onClick={() => setTeamMode((v) => !v)}
          className="flex w-full items-center justify-between active:scale-[0.98] transition"
        >
          <div>
            <p className="font-bold text-white">Tímový mód</p>
            <p className="text-xs text-white/40 mt-0.5">Hráči sa striedajú v 2 tímoch</p>
          </div>
          <span
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${
              teamMode ? "bg-gradient-to-r from-orange-500 to-fuchsia-600" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                teamMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Difficulty */}
      <div
        className="glass mb-4 rounded-3xl p-4"
        style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}
      >
        <p className="mb-3 text-sm font-bold text-white/60 uppercase tracking-widest">
          Obtiažnosť
        </p>
        <div className="flex gap-2">
          {[
            { key: "all", label: "Všetky", icon: "📦", count: ALL_SOLO_CHARADES_WORDS.length },
            { key: "lahke", label: "Ľahké", icon: "🟢", count: SOLO_CHARADES_WORDS.lahke.length },
            { key: "stredne", label: "Stredné", icon: "🟡", count: SOLO_CHARADES_WORDS.stredne.length },
            { key: "tazke", label: "Ťažké", icon: "🔴", count: SOLO_CHARADES_WORDS.tazke.length },
          ].map((d) => (
            <button
              key={d.key}
              onClick={() => setDifficulty(d.key)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border py-3 text-xs font-bold transition active:scale-95 hover:scale-[1.02] ${
                difficulty === d.key
                  ? "border-purple-400/60 bg-purple-500/30 text-purple-300"
                  : "border-white/10 bg-white/5 text-white/50"
              }`}
            >
              <span>{d.icon} {d.label}</span>
              <span className="text-[10px] font-semibold opacity-55">{d.count} kariet</span>
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
      <div className="mb-4 flex flex-col gap-2">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-2"
            style={{ animation: `slideUp 0.4s ease-out ${0.2 + i * 0.04}s both` }}
          >
            {teamMode && (
              <span
                className={`shrink-0 rounded-xl px-2.5 py-1 text-xs font-black ${
                  i % 2 === 0
                    ? "bg-blue-500/30 text-blue-300"
                    : "bg-orange-500/30 text-orange-300"
                }`}
              >
                T{(i % 2) + 1}
              </span>
            )}
            <input
              value={names[i]}
              onChange={(e) =>
                setNames((prev) => prev.map((n, idx) => (idx === i ? e.target.value : n)))
              }
              placeholder={defaultPlayerName(language, i + 1)}
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base font-semibold text-white placeholder-white/30 outline-none focus:border-purple-400/60"
            />
          </div>
        ))}
      </div>

      {/* Timer */}
      <div
        className="glass mb-4 rounded-3xl p-4"
        style={{ animation: "slideUp 0.5s ease-out 0.25s both" }}
      >
        <p className="mb-3 text-sm font-bold text-white/60 uppercase tracking-widest">
          Čas na kolo
        </p>
        <div className="flex gap-2">
          {[30, 45, 60, 90, 120].map((t) => (
            <button
              key={t}
              onClick={() => setTimerSecs(t)}
              className={`flex-1 rounded-2xl border py-3 text-xs font-bold transition active:scale-95 hover:scale-[1.02] ${
                timerSecs === t
                  ? "border-purple-400/60 bg-purple-500/30 text-purple-300"
                  : "border-white/10 bg-white/5 text-white/50"
              }`}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>

      {/* Max skips */}
      <div
        className="glass mb-6 rounded-3xl p-4"
        style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}
      >
        <p className="mb-3 text-sm font-bold text-white/60 uppercase tracking-widest">
          Max. preskočení za kolo
        </p>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 5, 99].map((s) => (
            <button
              key={s}
              onClick={() => setMaxSkips(s)}
              className={`flex-1 rounded-2xl border py-3 text-xs font-bold transition active:scale-95 hover:scale-[1.02] ${
                maxSkips === s
                  ? "border-purple-400/60 bg-purple-500/30 text-purple-300"
                  : "border-white/10 bg-white/5 text-white/50"
              }`}
            >
              {s === 99 ? "∞" : s}
            </button>
          ))}
        </div>
      </div>

      <Button
        fullWidth
        onClick={() =>
          onStart(
            names.slice(0, count).map((n, i) => n.trim() || defaultPlayerName(language, i + 1)),
            timerSecs,
            maxSkips,
            teamMode,
            difficulty
          )
        }
      >
        🎭 Začať šarády
      </Button>
    </Shell>
  );
}

// ─── Playing Screen ───────────────────────────────────────────────────────────

function PlayingScreen({
  player,
  deck,
  timerSecs,
  maxSkips,
  teamMode,
  onDone,
}: {
  player: Player;
  deck: Card[];
  timerSecs: number;
  maxSkips: number;
  teamMode: boolean;
  onDone: (correct: number, skips: number) => void;
}) {
  const [cardIdx, setCardIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerSecs);
  const [skipsUsed, setSkipsUsed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [cardAnim, setCardAnim] = useState<"idle" | "correct" | "skip">("idle");

  const correctRef = useRef(0);
  const skipsRef = useRef(0);
  const doneRef = useRef(false);
  const actionLockedRef = useRef(false);

  const card = deck[cardIdx];

  function finish() {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone(correctRef.current, skipsRef.current);
  }

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) { finish(); return; }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  });

  function advance(type: "correct" | "skip") {
    if (doneRef.current || actionLockedRef.current) return false;
    actionLockedRef.current = true;
    setCardAnim(type);
    setTimeout(() => {
      setCardAnim("idle");
      const nextIdx = cardIdx + 1;
      if (nextIdx >= deck.length) { finish(); return; }
      setCardIdx(nextIdx);
      actionLockedRef.current = false;
    }, 300);
    return true;
  }

  function handleCorrect() {
    if (!advance("correct")) return;
    correctRef.current += 1;
    setCorrect((c) => c + 1);
  }

  function handleSkip() {
    if (skipsUsed >= maxSkips && maxSkips !== 99) return;
    if (!advance("skip")) return;
    skipsRef.current += 1;
    setSkipsUsed((s) => s + 1);
  }

  const canSkip = maxSkips === 99 || skipsUsed < maxSkips;
  const timerPct = (timeLeft / timerSecs) * 100;
  const isWarning = timeLeft <= 10;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-between overflow-hidden"
      style={{ background: "linear-gradient(180deg, #150d2a 0%, #0e0921 100%)" }}
    >
      {/* Top bar */}
      <div className="flex w-full items-center justify-between px-5 pt-safe pt-6">
        {/* Spacer */}
        <div className="w-10" />

        {/* Timer pill */}
        <div
          className={`flex h-10 min-w-[72px] items-center justify-center rounded-full px-5 font-black text-lg transition-colors ${
            isWarning ? "bg-red-500/80 text-white" : "glass text-white"
          }`}
          style={isWarning ? { animation: "ring 1s ease-in-out infinite" } : undefined}
        >
          {timeLeft}s
        </div>

        {/* Exit */}
        <button
          onClick={finish}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white/70 text-lg active:scale-90 transition hover:scale-[1.05]"
        >
          ✕
        </button>
      </div>

      {/* Live score strip */}
      <div
        className="flex items-center gap-3 mt-2"
        style={{ animation: "fadeIn 0.4s ease-out both" }}
      >
        {teamMode && (
          <span
            className={`rounded-xl px-3 py-1 text-xs font-black ${
              player.team === 0
                ? "bg-blue-500/30 text-blue-300"
                : "bg-orange-500/30 text-orange-300"
            }`}
          >
            Tím {player.team + 1}
          </span>
        )}
        <span className="text-sm font-bold text-white/50">{player.name}</span>
        <span className="text-sm font-bold text-green-400">+{correct}</span>
      </div>

      {/* Card */}
      <div className="flex flex-1 items-center justify-center w-full px-8">
        <div
          key={cardIdx}
          className={`w-full max-w-xs rounded-3xl bg-white p-8 text-center shadow-2xl transition-all duration-300 ${
            cardAnim === "correct"
              ? "translate-y-[-20px] opacity-0 scale-95"
              : cardAnim === "skip"
              ? "translate-y-[20px] opacity-0 scale-95"
              : "translate-y-0 opacity-100 scale-100"
          }`}
          style={{ animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            {card?.categoryIcon} {card?.category}
          </p>
          <p className="text-4xl font-black text-gray-900 leading-tight">
            {card?.word ?? ""}
          </p>
        </div>
      </div>

      {/* Bottom timer bar */}
      <div className="w-full px-8 mb-3">
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${
              isWarning ? "bg-red-500" : "bg-purple-400"
            }`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex w-full items-center justify-center gap-8 pb-safe pb-10">
        {/* Skip */}
        <button
          onClick={handleSkip}
          disabled={!canSkip}
          className={`flex h-20 w-20 flex-col items-center justify-center rounded-full transition active:scale-90 disabled:opacity-30 hover:scale-[1.05] ${
            canSkip ? "bg-white/20" : "bg-white/10"
          }`}
        >
          <span className="text-3xl text-white">↑</span>
          <span className="text-xs font-bold text-white/60 mt-0.5">
            {maxSkips === 99 ? "∞" : `${skipsUsed}/${maxSkips}`}
          </span>
        </button>

        {/* Correct */}
        <button
          onClick={handleCorrect}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 transition active:scale-90 active:bg-green-500/40 hover:scale-[1.05]"
        >
          <span className="text-4xl text-green-400">✓</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SlovnaRosada({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timerSecs, setTimerSecs] = useState(60);
  const [maxSkips, setMaxSkips] = useState(3);
  const [teamMode, setTeamMode] = useState(false);
  const [difficulty, setDifficulty] = useState("all");
  const [deck, setDeck] = useState<Card[]>([]);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [roundSkips, setRoundSkips] = useState(0);

  function startGame(names: string[], timer: number, skips: number, teams: boolean, diff: string) {
    setTimerSecs(timer);
    setMaxSkips(skips);
    setTeamMode(teams);
    setDifficulty(diff);
    setDeck(buildDeck(diff));
    setPlayers(
      names.map((name, i) => ({
        name,
        team: (i % 2) as 0 | 1,
        score: 0,
        skipsUsed: 0,
      }))
    );
    setCurrentIdx(0);
    setPhase("who-starts");
  }

  function handleRoundDone(correct: number, skips: number) {
    setRoundCorrect(correct);
    setRoundSkips(skips);
    setPlayers((prev) =>
      prev.map((p, i) =>
        i === currentIdx ? { ...p, score: p.score + correct } : p
      )
    );
    setPhase("round-result");
  }

  function handleNext() {
    const next = currentIdx + 1;
    if (next >= players.length) {
      setPhase("final-result");
    } else {
      setCurrentIdx(next);
      setDeck(buildDeck(difficulty)); // fresh shuffled deck for each player
      setPhase("who-starts");
    }
  }

  const current = players[currentIdx];

  // ── Setup ─────────────────────────────────────────────────────────────────
  if (phase === "setup") {
    return <SetupScreen onBack={onBack} onStart={startGame} />;
  }

  // ── Who starts ────────────────────────────────────────────────────────────
  if (phase === "who-starts" && current) {
    const isFirst = currentIdx === 0;
    const teamLabel = teamMode
      ? `Tím ${current.team + 1}`
      : null;

    return (
      <Shell>
        <TopBar title="Slovné šarády" onBack={() => setPhase("setup")} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            <Icons.mask size={44} className="text-purple-300" />
          </div>
          <p
            className="text-sm font-bold uppercase tracking-widest text-white/40"
            style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }}
          >
            {isFirst ? "Začína" : "Na rade je"}
          </p>
          <h2
            className="text-gradient text-4xl font-black"
            style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}
          >
            {current.name}
          </h2>
          {teamLabel && (
            <span
              className={`rounded-2xl border px-4 py-1.5 text-sm font-bold ${
                current.team === 0
                  ? "border-blue-500/40 bg-blue-500/20 text-blue-300"
                  : "border-orange-500/40 bg-orange-500/20 text-orange-300"
              }`}
              style={{ animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both" }}
            >
              {teamLabel}
            </span>
          )}
          <div
            className="glass rounded-3xl p-4 text-sm text-white/60 max-w-xs leading-relaxed"
            style={{ animation: "slideUp 0.5s ease-out 0.25s both" }}
          >
            Vysvetluj slová na kartách. Ostatní hádajú.{" "}
            <strong className="text-white">✓</strong> = uhádnuté,{" "}
            <strong className="text-white">↑</strong> = preskočiť
            {maxSkips !== 99 ? ` (max ${maxSkips}×)` : ""}.
            Čas: <strong className="text-white">{timerSecs}s</strong>.
          </div>
          <Button fullWidth onClick={() => setPhase("playing")}>
            🚀 Štart!
          </Button>
        </div>
      </Shell>
    );
  }

  // ── Playing ───────────────────────────────────────────────────────────────
  if (phase === "playing" && current) {
    return (
      <PlayingScreen
        player={current}
        deck={deck}
        timerSecs={timerSecs}
        maxSkips={maxSkips}
        teamMode={teamMode}
        onDone={handleRoundDone}
      />
    );
  }

  // ── Round result ──────────────────────────────────────────────────────────
  if (phase === "round-result" && current) {
    const isLast = currentIdx >= players.length - 1;
    const nextPlayer = !isLast ? players[currentIdx + 1] : null;

    return (
      <Shell>
        <TopBar title="Výsledok kola" />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20"
            style={{ animation: "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
          >
            <Icons.timer size={44} className="text-purple-300" />
          </div>
          <h2
            className="text-gradient text-3xl font-black"
            style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}
          >
            {current.name}
          </h2>

          <div className="flex gap-4 w-full max-w-xs justify-center">
            <div
              className="glass flex-1 rounded-3xl border-green-500/30 bg-green-500/10 py-5"
              style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}
            >
              <div className="text-5xl font-black text-green-400">{roundCorrect}</div>
              <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Uhádnuté</div>
            </div>
            <div
              className="glass flex-1 rounded-3xl py-5"
              style={{ animation: "slideUp 0.5s ease-out 0.25s both" }}
            >
              <div className="text-5xl font-black text-white/50">{roundSkips}</div>
              <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Preskočené</div>
            </div>
          </div>

          {/* Running scores */}
          {teamMode ? (
            <div
              className="glass w-full max-w-xs rounded-3xl p-4"
              style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}
            >
              <p className="mb-3 text-xs uppercase tracking-widest text-white/40">Skóre tímov</p>
              {[0, 1].map((t) => {
                const teamScore = players.filter((p) => p.team === t).reduce((s, p) => s + p.score, 0);
                return (
                  <div key={t} className="flex items-center justify-between py-1.5">
                    <span className={`font-bold text-sm ${t === 0 ? "text-blue-300" : "text-orange-300"}`}>
                      Tím {t + 1}
                    </span>
                    <span className="font-black text-lg text-white">{teamScore}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="glass w-full max-w-xs rounded-3xl p-4"
              style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}
            >
              <p className="mb-3 text-xs uppercase tracking-widest text-white/40">Priebežné skóre</p>
              {[...players]
                .slice(0, currentIdx + 1)
                .sort((a, b) => b.score - a.score)
                .map((p) => (
                  <div key={p.name} className="flex items-center justify-between py-1.5">
                    <span className="font-semibold text-sm text-white/80">{p.name}</span>
                    <span className="font-black text-white">{p.score}</span>
                  </div>
                ))}
            </div>
          )}

          <Button fullWidth onClick={handleNext}>
            {isLast
              ? "🏆 Výsledky"
              : `➡️ Ďalší: ${nextPlayer?.name}`}
          </Button>
        </div>
      </Shell>
    );
  }

  // ── Final result ──────────────────────────────────────────────────────────
  if (phase === "final-result") {
    if (teamMode) {
      const teamScores = [0, 1].map((t) => ({
        team: t,
        score: players.filter((p) => p.team === t).reduce((s, p) => s + p.score, 0),
        players: players.filter((p) => p.team === t),
      }));
      teamScores.sort((a, b) => b.score - a.score);
      const winner = teamScores[0];

      return (
        <Shell>
          <TopBar title="Koniec" />
          <div className="flex flex-1 flex-col gap-5 pt-2">
            <div className="text-center" style={{ animation: "fadeIn 0.5s ease-out both" }}>
              <div
                className="flex h-20 w-20 mx-auto mb-3 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-500/30 to-orange-500/20"
                style={{ animation: "tada 0.8s ease-out 0.1s both" }}
              >
                <Icons.trophy size={48} className="text-yellow-300" />
              </div>
              <h2 className="text-gradient text-2xl font-black">
                Vyhráva Tím {winner.team + 1}!
              </h2>
              <p className="text-white/50 text-sm mt-1">{winner.score} bodov</p>
            </div>

            {teamScores.map(({ team, score, players: tp }, i) => (
              <div
                key={team}
                className={`glass rounded-3xl border p-4 ${
                  team === winner.team
                    ? team === 0
                      ? "border-blue-500/40 bg-blue-500/10"
                      : "border-orange-500/40 bg-orange-500/10"
                    : ""
                }`}
                style={{ animation: `slideUp 0.5s ease-out ${0.15 + i * 0.1}s both` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-black text-lg ${
                      team === 0 ? "text-blue-300" : "text-orange-300"
                    }`}
                  >
                    {team === winner.team ? "🥇 " : "🥈 "}Tím {team + 1}
                  </span>
                  <span className="text-2xl font-black text-white">{score}</span>
                </div>
                {tp.map((p) => (
                  <div key={p.name} className="flex justify-between text-sm py-1 border-t border-white/5">
                    <span className="text-white/70">{p.name}</span>
                    <span className="font-bold text-white">{p.score}</span>
                  </div>
                ))}
              </div>
            ))}

            <div className="flex gap-3">
              <Button fullWidth onClick={() => { setCurrentIdx(0); setDeck(buildDeck(difficulty)); setPhase("who-starts"); }}>
                🔄 Znova
              </Button>
              <Button fullWidth variant="secondary" onClick={() => setPhase("setup")}>
                Nastavenia
              </Button>
            </div>
            <Button fullWidth variant="ghost" onClick={onBack}>Domov</Button>
          </div>
        </Shell>
      );
    }

    // Solo mode final
    const sorted = [...players].sort((a, b) => b.score - a.score);
    return (
      <Shell>
        <TopBar title="Koniec" />
        <div className="flex flex-1 flex-col gap-5 pt-2">
          <div className="text-center" style={{ animation: "fadeIn 0.5s ease-out both" }}>
            <div
              className="flex h-20 w-20 mx-auto mb-3 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-500/30 to-orange-500/20"
              style={{ animation: "tada 0.8s ease-out 0.1s both" }}
            >
              <Icons.trophy size={48} className="text-yellow-300" />
            </div>
            <h2 className="text-gradient text-2xl font-black">Koniec!</h2>
            <p className="text-white/50 text-sm mt-1">
              Vyhráva <strong className="text-white">{sorted[0]?.name}</strong> s{" "}
              {sorted[0]?.score} bodmi!
            </p>
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
                <span className="text-green-400 font-black text-xl">{p.score}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button fullWidth onClick={() => { setCurrentIdx(0); setDeck(buildDeck(difficulty)); setPhase("who-starts"); }}>
              🔄 Znova
            </Button>
            <Button fullWidth variant="secondary" onClick={() => setPhase("setup")}>
              Nastavenia
            </Button>
          </div>
          <Button fullWidth variant="ghost" onClick={onBack}>Domov</Button>
        </div>
      </Shell>
    );
  }

  return null;
}
