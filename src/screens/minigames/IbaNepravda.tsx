import { useEffect, useState } from "react";
import { getOnlyLiesForLanguage, ONLY_LIES_CARDS, type OnlyLiesCard } from "../../data/localizedOnlyLies";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { takePersistentItem } from "../../utils/persistentDeck";
import { vibrate } from "../../utils/deviceFeedback";

const ROUND_MS = 4000;

export default function IbaNepravda({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();

  const [card, setCard] = useState<OnlyLiesCard>(() =>
    takePersistentItem("only-lies-card", ONLY_LIES_CARDS, (c) => c.id)
  );
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
        vibrate([80, 50, 120]);
        setLost(true);
      }
    }, 50);

    return () => window.clearInterval(interval);
  }, [roundId]);

  function nextQuestion() {
    setLost(false);
    setCard(takePersistentItem("only-lies-card", ONLY_LIES_CARDS, (c) => c.id));
    setRoundId((id) => id + 1);
  }

  function restart() {
    setCard(takePersistentItem("only-lies-card", ONLY_LIES_CARDS, (c) => c.id));
    setLost(false);
    setRoundId((id) => id + 1);
  }

  const secondsLeft = Math.ceil(timeLeftMs / 100) / 10;
  const timePercent = Math.max(0, Math.min(100, (timeLeftMs / ROUND_MS) * 100));

  const questionText = card.translations[language] ?? card.translations.sk;

  return (
    <Shell>
      <TopBar title="Iba nepravda" onBack={onBack} />

      <div className="game-center-stack flex flex-1 flex-col items-center justify-center gap-5 text-center">
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
            Hráč, ktorý drží mobil, must odpovedať{" "}
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
          key={`${roundId}-${card.id}`}
        >
          <p className="text-xl font-bold leading-relaxed text-white" data-no-translate>
            {questionText}
          </p>
        </div>

        <p className="text-xs text-white/40">
          Bez opakovania až do vyčerpania celej zásoby
        </p>

        <Button fullWidth onClick={nextQuestion} disabled={lost}>
          <span className="inline-flex items-center gap-2"><Icons.circleCheck size={18} /> Správne</span>
        </Button>
      </div>

      {lost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-6 backdrop-blur-sm">
          <div
            className="glass w-full max-w-sm rounded-3xl border border-red-500/40 bg-red-500/10 p-7 text-center"
            style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-200/15 bg-red-400/10 text-red-200"><Icons.timer size={34} /></div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-300/70">
              Čas vypršal
            </p>
            <h2 className="mt-2 text-4xl font-black text-white">Prehral si!</h2>
            <p className="mb-6 mt-3 text-sm text-white/55">
              Hráč, ktorý drží mobil, nestihol odpovedať do 4 sekúnd.
            </p>
            <Button fullWidth onClick={restart}>
              <span className="inline-flex items-center gap-2"><Icons.refresh size={17} /> Nová hra</span>
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
