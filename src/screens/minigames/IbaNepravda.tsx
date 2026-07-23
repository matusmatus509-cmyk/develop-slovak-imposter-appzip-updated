import { useEffect, useState } from "react";
import { ONLY_LIES } from "../../data/prompts";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { takePersistentItem } from "../../utils/persistentDeck";

const ROUND_MS = 4000;

export default function IbaNepravda({ onBack }: { onBack: () => void }) {
  const [question, setQuestion] = useState(() => takePersistentItem("only-lies", ONLY_LIES));
  const [roundId, setRoundId] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(ROUND_MS);
  const [lost, setLost] = useState(false);

  useEffect(() => {
    const deadline = performance.now() + ROUND_MS;
    setTimeLeftMs(ROUND_MS);

    const interval = window.setInterval(() => {
      const remaining = Math.max(0, deadline - performance.now());
      setTimeLeftMs(remaining);

      if (remaining === 0) {
        window.clearInterval(interval);
        navigator.vibrate?.([80, 50, 120]);
        setLost(true);
      }
    }, 50);

    return () => window.clearInterval(interval);
  }, [roundId]);

  function nextQuestion() {
    setLost(false);
    setQuestion(takePersistentItem("only-lies", ONLY_LIES));
    setRoundId((id) => id + 1);
  }

  function restart() {
    setQuestion(takePersistentItem("only-lies", ONLY_LIES));
    setLost(false);
    setRoundId((id) => id + 1);
  }

  const secondsLeft = Math.ceil(timeLeftMs / 100) / 10;
  const timePercent = Math.max(0, Math.min(100, (timeLeftMs / ROUND_MS) * 100));

  return (
    <Shell>
      <TopBar title="Iba nepravda" onBack={onBack} />

      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500/20 to-pink-500/20"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <Icons.mask size={46} className="text-rose-400" />
        </div>

        <div style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }}>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">
            Pravidlo
          </p>
          <p className="mt-2 max-w-xs text-sm text-white/60">
            Hráč, ktorý drží mobil, musí odpovedať{" "}
            <span className="font-black text-rose-400">iba klamstvami</span>.
            Ak odpoveď nestihne do 4 sekúnd, prehral. Po správnej nepravdivej
            odpovedi stlačte tlačidlo Správne.
          </p>
        </div>

        <div
          className="relative flex h-28 w-28 items-center justify-center rounded-full p-2"
          style={{
            background: `conic-gradient(#fb7185 ${timePercent}%, rgba(255,255,255,0.08) ${timePercent}%)`,
          }}
        >
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#0b0b16]">
            <span
              className={`text-3xl font-black tabular-nums ${
                timeLeftMs <= 1500 ? "text-red-400" : "text-white"
              }`}
            >
              {secondsLeft.toFixed(1)}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">
              sekundy
            </span>
          </div>
        </div>

        <div
          className="glass w-full rounded-3xl border border-rose-500/30 bg-rose-500/10 p-7"
          style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both" }}
          key={`${roundId}-${question}`}
        >
          <p className="text-xl font-bold leading-relaxed text-white">
            {question}
          </p>
        </div>

        <p className="text-xs text-white/40">
          Bez opakovania až do vyčerpania celej zásoby
        </p>

        <Button fullWidth onClick={nextQuestion} disabled={lost}>
          ✅ Správne
        </Button>
      </div>

      {lost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-6 backdrop-blur-sm">
          <div
            className="glass w-full max-w-sm rounded-3xl border border-red-500/40 bg-red-500/10 p-7 text-center"
            style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            <div className="mb-3 text-6xl">⏰</div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-300/70">
              Čas vypršal
            </p>
            <h2 className="mt-2 text-4xl font-black text-white">Prehral si!</h2>
            <p className="mb-6 mt-3 text-sm text-white/55">
              Hráč, ktorý drží mobil, nestihol odpovedať do 4 sekúnd.
            </p>
            <Button fullWidth onClick={restart}>
              🔄 Nová hra
            </Button>
            <Button fullWidth variant="ghost" onClick={onBack} className="mt-2">
              Domov
            </Button>
          </div>
        </div>
      )}
    </Shell>
  );
}
