import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  getPassTheBombForLanguage,
  type BombTask,
} from "../../data/localizedPassTheBomb";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
/** Design: jediný „bombový" vizuál v projekte je výrez z atlasu minihier. */
import { minigameArtAtlas } from "../../media";
import { takePersistentItem } from "../../utils/persistentDeck";
import { vibrate } from "../../utils/deviceFeedback";
import { useCountdown } from "../../hooks/useCountdown";
import { useBombSound } from "../../hooks/useBombSound";

type Phase = "ready" | "ticking" | "exploded";

const randomFuseSeconds = () => 30 + Math.floor(Math.random() * 61);

/**
 * Na akom uplynulom čase dosiahne napätie maximum.
 *
 * Zámerne to NIE JE dĺžka šnúry: keby intenzita rástla k výbuchu, hráči by z nej
 * vyčítali, kedy praskne, a hra by stratila pointu. Takto stúpa podľa toho, ako
 * dlho sa už hrá — čo hráči aj tak vedia.
 */
const HEAT_RAMP_SECONDS = 60;

export default function KtoDostaneBombu({
  onBack,
  onRoundComplete,
}: {
  onBack: () => void;
  onRoundComplete?: () => void;
}) {
  const { language } = useLanguage();
  const deck = useMemo<BombTask[]>(
    () => getPassTheBombForLanguage(language),
    [language]
  );
  const draw = useCallback(
    () => takePersistentItem("pass-the-bomb", deck, item => item.id),
    [deck]
  );
  const { playTick, playExplosion, stopSound } = useBombSound();

  const [phase, setPhase] = useState<Phase>("ready");
  const [task, setTask] = useState<BombTask>(draw);
  const [fuseSeconds, setFuseSeconds] = useState(randomFuseSeconds);
  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completionReportedRef = useRef(false);
  const heatRef = useRef(0);

  function clearTicking() {
    if (tickTimerRef.current) clearInterval(tickTimerRef.current);
    tickTimerRef.current = null;
  }

  // Zápalná šnúra sa meria absolútnym časom, takže sa nedá predĺžiť prekresľovaním
  // obrazovky. Po prepnutí aplikácie na pozadie a späť sa čas dorovná okamžite.
  const { secondsLeft, reset: resetFuse } = useCountdown(
    fuseSeconds,
    phase === "ticking",
    () => {
      clearTicking();
      setPhase("exploded");
      if (!completionReportedRef.current) {
        completionReportedRef.current = true;
        onRoundComplete?.();
      }
      playExplosion();
      vibrate([120, 60, 180]);
    }
  );

  // Rytmus tikania sa zrýchľuje podľa uplynutého času, nie podľa reťazených timeoutov.
  const elapsedSeconds = fuseSeconds - secondsLeft;
  const tickInterval =
    elapsedSeconds >= 50 ? 350 : elapsedSeconds >= 20 ? 600 : 1000;
  const heat = Math.min(1, Math.max(0, elapsedSeconds / HEAT_RAMP_SECONDS));
  heatRef.current = heat;

  // Zvuk aj rázová vlna idú z jedného intervalu, takže tik je slyšaný presne
  // vtedy, keď je aj vidieť.
  useEffect(() => {
    if (phase !== "ticking") {
      clearTicking();
      return;
    }
    playTick(heatRef.current);
    tickTimerRef.current = setInterval(
      () => playTick(heatRef.current),
      tickInterval
    );
    return () => clearTicking();
  }, [phase, tickInterval, playTick]);

  function startBomb() {
    completionReportedRef.current = false;
    const nextFuse = randomFuseSeconds();
    setFuseSeconds(nextFuse);
    resetFuse(nextFuse);
    setPhase("ticking");
  }

  function nextRound() {
    clearTicking();
    resetFuse(fuseSeconds);
    setTask(draw());
    setPhase("ready");
  }

  function leave() {
    clearTicking();
    stopSound();
    onBack();
  }

  useEffect(() => clearTicking, []);

  const exploded = phase === "exploded";
  const ticking = phase === "ticking";

  return (
    <Shell className="bomb-game-shell">
      <TopBar title="Kto dostane bombu" onBack={leave} />

      <div
        className={`bomb-stage ${exploded ? "bomb-shake" : ""}`}
        style={{ "--bomb-heat": exploded ? 1 : heat } as React.CSSProperties}
      >
        {exploded && <div className="bomb-flash" aria-hidden="true" />}

        <div className="bomb-hazard" aria-hidden="true" />

        {/* Puzdro a stavový displej */}
        <div className="flex min-h-0 flex-col items-center justify-center gap-4">
          <div
            className={`bomb-core ${ticking ? "is-ticking" : ""}`}
            style={
              { "--bomb-tick": `${tickInterval}ms` } as React.CSSProperties
            }
          >
            {/* Dve vlny s polovičným posunom držia rytmus plynulý. */}
            <span className="bomb-wave" aria-hidden="true" />
            <span className="bomb-wave is-delayed" aria-hidden="true" />
            {/* Fotografická textúra pod ikonou dáva puzdru materiál. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-[10%] rounded-full opacity-[0.22] mix-blend-luminosity"
              style={{
                backgroundImage: `url(${minigameArtAtlas})`,
                backgroundSize: "300% 300%",
                backgroundPosition: "50% 100%",
              }}
            />
            <Icons.bomb
              size={exploded ? 62 : 58}
              className="bomb-core-icon"
              aria-hidden="true"
            />
          </div>

          {exploded ? (
            <div className="text-center">
              <p className="bomb-boom">BOOM!</p>
              <p className="mt-1 text-sm font-black text-white/70">
                Kto drží telefón, prehral
              </p>
            </div>
          ) : (
            <p
              className={`bomb-readout ${ticking ? "is-armed" : ""}`}
              aria-live="polite"
            >
              <span className="bomb-readout-dot" aria-hidden="true" />
              {ticking ? "Podávaj rýchlo" : "Pripravené"}
            </p>
          )}
        </div>

        {/* Zadanie */}
        <div className="bomb-brief">
          <p className="bomb-brief-label">
            {exploded ? "Úloha bola" : "Zadanie"}
          </p>
          <p className="bomb-brief-text" data-no-translate>
            {task.text}
          </p>
        </div>

        {/* Počas tikania tu zámerne nie je nič: telefón sa podáva z ruky do ruky,
            takže akékoľvek tlačidlo by sa dalo stlačiť omylom. Stav hlási displej
            pri puzdre — druhá pilulka tu bola navyše a meranie ukázalo, že sa
            práve ona odstrihávala. */}
        {exploded ? (
          <Button fullWidth onClick={nextRound}>
            <span className="inline-flex items-center gap-2">
              Nová úloha <Icons.refresh size={17} />
            </span>
          </Button>
        ) : ticking ? null : (
          <Button fullWidth onClick={startBomb}>
            <span className="inline-flex items-center gap-2">
              Zapáliť šnúru <Icons.bomb size={18} />
            </span>
          </Button>
        )}
      </div>
    </Shell>
  );
}
