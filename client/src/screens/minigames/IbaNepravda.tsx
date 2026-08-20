import { useCallback, useState } from "react";
import { ONLY_LIES_CARDS, type OnlyLiesCard } from "../../data/localizedOnlyLies";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import PerimeterTimer from "../../components/PerimeterTimer";
import { takePersistentItem } from "../../utils/persistentDeck";
import { vibrate } from "../../utils/deviceFeedback";
import { ONLY_LIES_ROUND_MS, resolveOnlyLiesRound, type OnlyLiesRoundAction } from "./onlyLiesRound";

const URGENT_BELOW_MS = 1500;
const TOTAL_TENTHS = Math.round(ONLY_LIES_ROUND_MS / 100);

function drawCard() {
  return takePersistentItem("only-lies-card", ONLY_LIES_CARDS, (card) => card.id);
}

/** 1 otázku, 2–4 otázky, 0 a 5+ otázok. */
function questionsLabel(count: number) {
  if (count === 1) return "otázku";
  if (count >= 2 && count <= 4) return "otázky";
  return "otázok";
}

export default function IbaNepravda({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();

  const [card, setCard] = useState<OnlyLiesCard>(drawCard);
  const [roundId, setRoundId] = useState(0);
  const [remainingTenths, setRemainingTenths] = useState(TOTAL_TENTHS);
  const [streak, setStreak] = useState(0);
  const [lost, setLost] = useState(false);

  const nextQuestion = useCallback(() => {
    setCard(drawCard());
    setRoundId((id) => id + 1);
  }, []);

  const finishRound = useCallback(
    (action: OnlyLiesRoundAction) => {
      if (resolveOnlyLiesRound(action) === "lost") {
        vibrate([120, 60, 160]);
        setLost(true);
        return;
      }

      setStreak((value) => value + 1);
      nextQuestion();
    },
    [nextQuestion]
  );

  // Obvodová čiara je jediný zdroj času — sem si len sťahujeme zvyšok na zobrazenie.
  const handleTick = useCallback((remainingMs: number) => {
    setRemainingTenths((previous) => {
      const next = Math.ceil(remainingMs / 100);
      return previous === next ? previous : next;
    });
  }, []);

  const handleExpire = useCallback(() => {
    vibrate([80, 50, 120]);
    finishRound("timer-expired");
  }, [finishRound]);

  const restart = useCallback(() => {
    setCard(drawCard());
    setStreak(0);
    setLost(false);
    setRemainingTenths(TOTAL_TENTHS);
    setRoundId((id) => id + 1);
  }, []);

  const secondsText = (remainingTenths / 10).toFixed(1);
  const isUrgent = !lost && remainingTenths * 100 <= URGENT_BELOW_MS;
  const questionText = card.translations[language] ?? card.translations.sk;

  return (
    <Shell className="only-lies-shell">
      <PerimeterTimer
        durationMs={ONLY_LIES_ROUND_MS}
        roundKey={roundId}
        running={!lost}
        urgentBelowMs={URGENT_BELOW_MS}
        onTick={handleTick}
        onExpire={handleExpire}
        className="only-lies-perimeter"
      />

      <TopBar title="Iba nepravda" onBack={onBack} />

      <main className="only-lies-stage">
        <header className="only-lies-head">
          <p className="only-lies-rule">
            <span className="only-lies-rule-dot" aria-hidden="true" />
            Odpovedz nepravdivo
          </p>
          <p className="only-lies-streak">
            <span>séria</span>
            <strong>{streak}</strong>
          </p>
        </header>

        <section
          className="only-lies-clock"
          data-urgent={isUrgent ? "true" : "false"}
          role="timer"
          aria-label={`Zostáva ${secondsText} sekundy`}
        >
          <span className="only-lies-clock-label">Čas na odpoveď</span>
          <p className="only-lies-clock-value" aria-hidden="true">
            <strong>{secondsText}</strong>
            <small>s</small>
          </p>
        </section>

        <article className="only-lies-question" key={roundId} aria-live="polite">
          <span className="only-lies-question-mark" aria-hidden="true">
            ?
          </span>
          <p data-no-translate>{questionText}</p>
        </article>

        <div className="only-lies-actions" aria-label="Vyhodnotenie odpovede">
          <Button
            fullWidth
            size="lg"
            variant="danger"
            onClick={() => finishRound("incorrect")}
            disabled={lost}
            className="only-lies-answer only-lies-answer--incorrect"
          >
            <span className="only-lies-answer-inner">
              <Icons.circleX size={20} />
              Nesprávne
            </span>
          </Button>
        </div>
      </main>

      {lost && (
        <div className="only-lies-failure fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="only-lies-failure-card w-full max-w-sm text-center">
            <div className="only-lies-failure-icon">
              <Icons.circleX size={30} />
            </div>
            <p>Nesprávne</p>
            <h2>Hra skončila</h2>

            <div className="only-lies-failure-score">
              <strong>{streak}</strong>
              <span>zvládnutých {questionsLabel(streak)}</span>
            </div>

            <Button fullWidth onClick={restart} className="only-lies-failure-action">
              <span className="only-lies-answer-inner">
                <Icons.refresh size={18} />
                Nová hra
              </span>
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
