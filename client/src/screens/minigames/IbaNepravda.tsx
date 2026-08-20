import { useEffect, useState } from "react";
import { getOnlyLiesForLanguage, ONLY_LIES_CARDS, type OnlyLiesCard } from "../../data/localizedOnlyLies";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { takePersistentItem } from "../../utils/persistentDeck";
import { vibrate } from "../../utils/deviceFeedback";
import { ONLY_LIES_ROUND_MS, resolveOnlyLiesRound, type OnlyLiesRoundAction } from "./onlyLiesRound";

export default function IbaNepravda({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();

  const [card, setCard] = useState<OnlyLiesCard>(() =>
    takePersistentItem("only-lies-card", ONLY_LIES_CARDS, (c) => c.id)
  );
  const [roundId, setRoundId] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(ONLY_LIES_ROUND_MS);
  const [lost, setLost] = useState(false);

  function nextQuestion() {
    setLost(false);
    setCard(takePersistentItem("only-lies-card", ONLY_LIES_CARDS, (c) => c.id));
    setRoundId((id) => id + 1);
  }

  function finishRound(action: OnlyLiesRoundAction) {
    if (resolveOnlyLiesRound(action) === "lost") {
      vibrate([120, 60, 160]);
      setLost(true);
      return;
    }

    nextQuestion();
  }

  useEffect(() => {
    if (lost) return;

    const deadline = performance.now() + ONLY_LIES_ROUND_MS;
    setTimeLeftMs(ONLY_LIES_ROUND_MS);

    const interval = window.setInterval(() => {
      const remaining = Math.max(0, deadline - performance.now());
      setTimeLeftMs(remaining);

      if (remaining === 0) {
        window.clearInterval(interval);
        vibrate([80, 50, 120]);
        finishRound("timer-expired");
      }
    }, 50);

    return () => window.clearInterval(interval);
  }, [lost, roundId]);

  function restart() {
    setCard(takePersistentItem("only-lies-card", ONLY_LIES_CARDS, (c) => c.id));
    setLost(false);
    setRoundId((id) => id + 1);
  }

  const secondsLeft = Math.ceil(timeLeftMs / 100) / 10;
  const timePercent = Math.max(0, Math.min(100, (timeLeftMs / ONLY_LIES_ROUND_MS) * 100));

  const questionText = card.translations[language] ?? card.translations.sk;

  return (
    <Shell className="only-lies-shell">
      <TopBar title="Iba nepravda" onBack={onBack} />

      <main className="only-lies-stage" aria-live="polite">
        <header className="only-lies-rule">
          <span className="only-lies-rule-dot" aria-hidden="true" />
          <p>Odpovedz nepravdivo.</p>
        </header>

        <section className="only-lies-timer" aria-label={`Zostáva ${secondsLeft.toFixed(1)} sekundy`}>
          <div className="only-lies-timer-heading">
            <span>ČAS</span>
            <strong className={timeLeftMs <= 1500 ? "is-urgent" : ""} aria-live="assertive">
              {secondsLeft.toFixed(1)}<small>s</small>
            </strong>
          </div>
          <div className="only-lies-timer-track" role="progressbar" aria-valuemin={0} aria-valuemax={ONLY_LIES_ROUND_MS} aria-valuenow={Math.ceil(timeLeftMs)}>
            <span style={{ width: `${timePercent}%` }} />
          </div>
        </section>

        <article className="only-lies-question" key={`${roundId}-${card.id}`}>
          <span className="only-lies-question-mark" aria-hidden="true">?</span>
          <p data-no-translate>{questionText}</p>
        </article>

        <div className="only-lies-actions" aria-label="Vyhodnotenie odpovede">
          <Button fullWidth size="lg" onClick={() => finishRound("correct")} disabled={lost} className="only-lies-answer only-lies-answer--correct">
            <span className="inline-flex items-center justify-center gap-2"><Icons.circleCheck size={19} /> Správne</span>
          </Button>
          <Button fullWidth size="lg" variant="danger" onClick={() => finishRound("incorrect")} disabled={lost} className="only-lies-answer only-lies-answer--incorrect">
            <span className="inline-flex items-center justify-center gap-2"><Icons.circleX size={19} /> Nesprávne</span>
          </Button>
        </div>
      </main>

      {lost && (
        <div className="only-lies-failure fixed inset-0 z-50 flex items-center justify-center px-6">
          <div
            className="only-lies-failure-card w-full max-w-sm text-center"
            style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            <div className="only-lies-failure-icon"><Icons.circleX size={32} /></div>
            <p>Nesprávne</p>
            <h2>Hra skončila</h2>
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
