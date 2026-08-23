import { useEffect, useMemo, useRef, useState } from "react";
import { soundArt } from "../../media";
import { takePersistentItems } from "../../utils/persistentDeck";
import { SOUND_CLUES } from "../../data/teamBattleExtras";
import { PartyBackdrop } from "./PartyChrome";
import {
  makeEmptyScores,
  PARTY_PLAYER_COLORS,
  type QuickParticipantsProps,
} from "./quickGameShared";
import { useFeedback } from "../../feedback/FeedbackProvider";
import { soundsEnabled } from "../../utils/deviceFeedback";
import { Icons } from "../../components/icons";

type Phase =
  | { type: "question" }
  | { type: "buzzed"; participant: number }
  | { type: "revealed"; participant: number };
type AudioStatus = "idle" | "loading" | "playing" | "ready" | "error";
const QUESTIONS_PER_ROUND = 10;
const MAX_SOUND_SECONDS = 7;

/**
 * Obrazovka je „obojstranná" — rovnaká konštrukcia ako Hudobný kvíz: telefón
 * leží na stole a hráči sedia z dvoch strán, takže horné dva pásy sú otočené
 * o 180°. Layout je mriežka s piatimi pevnými pásmi, nie absolútne
 * pozicovanie: každý prvok má vlastný riadok a prekrytie textu tlačidlom je
 * konštrukčne nemožné.
 *
 * Oproti hudobnému kvízu sa mení len identita a obsah stredu — akcent je
 * tyrkysový namiesto fialového a v strede je zvuková vlna namiesto obalu
 * albumu. Herná logika (balíček, prehrávanie, bzučiak, bodovanie) zostáva
 * presne taká, aká bola.
 */
export default function SoundBuzzer({
  participantNames,
  gameMode,
  onDone,
  rounds = QUESTIONS_PER_ROUND,
  timeSeconds = MAX_SOUND_SECONDS,
}: QuickParticipantsProps) {
  const { playFeedback } = useFeedback();
  const soundAllowed = soundsEnabled();
  const deck = useMemo(
    () =>
      takePersistentItems(
        "party:sound-buzzer",
        SOUND_CLUES,
        rounds,
        clue => clue.label
      ),
    [rounds]
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<number[]>(() =>
    makeEmptyScores(participantNames)
  );
  const [phase, setPhase] = useState<Phase>({ type: "question" });
  const [played, setPlayed] = useState(false);
  const [audioStatus, setAudioStatus] = useState<AudioStatus>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const clue = deck[questionIndex];
  const playerWord = gameMode === "teams" ? "tím" : "hráč";
  const participantWord = gameMode === "teams" ? "Tím" : "Hráč";

  function stopAudio(nextStatus: AudioStatus = "ready") {
    if (stopTimerRef.current !== null)
      window.clearTimeout(stopTimerRef.current);
    stopTimerRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setAudioStatus(nextStatus);
  }

  useEffect(
    () => () => {
      if (stopTimerRef.current !== null)
        window.clearTimeout(stopTimerRef.current);
      audioRef.current?.pause();
      if (audioContextRef.current) void audioContextRef.current.close();
    },
    []
  );

  useEffect(() => {
    if (!soundAllowed) stopAudio("idle");
  }, [soundAllowed]);

  async function play() {
    if (!soundAllowed || audioStatus === "loading" || !clue) return;
    stopAudio("loading");

    if (clue.tonePattern?.length) {
      try {
        const context = new AudioContext();
        audioContextRef.current = context;
        await context.resume();
        let cursor = context.currentTime + 0.04;
        clue.tonePattern.forEach((tone, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = index % 2 === 0 ? "sine" : "triangle";
          oscillator.frequency.value = tone.frequency;
          gain.gain.setValueAtTime(0.0001, cursor);
          gain.gain.exponentialRampToValueAtTime(0.32, cursor + 0.02);
          gain.gain.setValueAtTime(
            0.32,
            Math.max(cursor + 0.02, cursor + tone.duration - 0.03)
          );
          gain.gain.exponentialRampToValueAtTime(
            0.0001,
            cursor + tone.duration
          );
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(cursor);
          oscillator.stop(cursor + tone.duration + 0.02);
          cursor += tone.duration + tone.pause;
        });
        const totalMilliseconds = Math.min(
          timeSeconds * 1000,
          Math.max(350, (cursor - context.currentTime) * 1000)
        );
        setPlayed(true);
        setAudioStatus("playing");
        stopTimerRef.current = window.setTimeout(
          () => stopAudio("ready"),
          totalMilliseconds
        );
      } catch {
        audioContextRef.current = null;
        setAudioStatus("error");
      }
      return;
    }

    const audio = new Audio(clue.audioUrl);
    audio.preload = "auto";
    audio.volume = 0.9;
    audioRef.current = audio;
    audio.addEventListener(
      "ended",
      () => {
        audioRef.current = null;
        setAudioStatus("ready");
      },
      { once: true }
    );
    try {
      await audio.play();
      setPlayed(true);
      setAudioStatus("playing");
      stopTimerRef.current = window.setTimeout(
        () => stopAudio("ready"),
        timeSeconds * 1000
      );
    } catch {
      audioRef.current = null;
      setAudioStatus("error");
    }
  }

  function resolve(correct: boolean) {
    if (phase.type !== "revealed") return;
    stopAudio("idle");
    const scorer = correct
      ? phase.participant
      : gameMode === "teams" && participantNames.length === 2
        ? 1 - phase.participant
        : null;
    const nextScores = [...scores];
    if (scorer !== null) nextScores[scorer] += 1;
    setScores(nextScores);
    if (questionIndex + 1 >= deck.length) onDone(nextScores);
    else {
      setQuestionIndex(value => value + 1);
      setPhase({ type: "question" });
      setPlayed(false);
    }
  }

  if (!clue) return null;

  const revealed = phase.type === "revealed";
  const playing = audioStatus === "playing";

  // Hráči sa delia na dve strany stola: prvá polovica bližšie, zvyšok naproti.
  const half = Math.ceil(participantNames.length / 2);
  const seating = participantNames.map((name, index) => ({ name, index }));
  const nearSeats = seating.slice(0, half);
  const farSeats = seating.slice(half);

  const headline =
    phase.type === "question"
      ? audioStatus === "loading"
        ? "Spúšťam zvuk…"
        : played
          ? "Kto pozná tento zvuk?"
          : "Prehrajte zvuk"
      : phase.type === "buzzed"
        ? `${participantNames[phase.participant]} odpovedá`
        : clue.label;

  const hint = !soundAllowed
    ? "Zvuky sú vypnuté — zapni ich v nastaveniach"
    : audioStatus === "error"
      ? "Zvuk sa nepodarilo načítať — skús ho prehrať znova"
      : phase.type === "question"
        ? played
          ? `Bzuč, keď zvuk spozná ${playerWord}`
          : "Zvuk môžeš prehrať aj viackrát"
        : phase.type === "buzzed"
          ? `${participantWord} povie odpoveď nahlas`
          : "";

  /**
   * Render funkcie, nie vnorené komponenty: vnorený komponent by pri každom
   * rendere vytvoril nový typ, React by podstrom odmontoval a animácie
   * ekvalizéra by sa restartovali.
   */
  function renderReadout() {
    return (
      <div className="music-quiz-readout sound-quiz-readout flex min-h-0 flex-col items-center justify-start gap-2 overflow-hidden px-4 text-center">
        <p className="music-quiz-eyebrow sound-quiz-eyebrow shrink-0 rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em]">
          Zvuk {Math.min(questionIndex + 1, deck.length)} / {deck.length}
        </p>

        <h2 className="music-quiz-title min-w-0 max-w-full break-words px-1 font-black leading-[1.03] tracking-[-0.03em] text-white">
          {headline}
        </h2>

        {/* Zdroj zvuku patrí k odpovedi, preto sa odhalí až s ňou — rovnako
            ako interpret v hudobnom kvíze. */}
        {revealed &&
          (clue.sourcePage ? (
            <a
              href={clue.sourcePage}
              target="_blank"
              rel="noreferrer"
              className="sound-quiz-credit min-w-0 max-w-full shrink-0 break-words rounded-xl border border-white/15 bg-white/[0.07] px-3 py-1 font-bold leading-snug text-white/55 underline decoration-white/15 underline-offset-2"
            >
              {clue.credit} · {clue.license}
            </a>
          ) : (
            <p className="sound-quiz-credit min-w-0 max-w-full shrink-0 break-words rounded-xl border border-white/15 bg-white/[0.07] px-3 py-1 font-bold leading-snug text-white/55">
              {clue.credit} · {clue.license}
            </p>
          ))}

        {hint && (
          <p className="music-quiz-hint min-w-0 max-w-full shrink-0 break-words text-[11px] font-bold leading-snug text-white/50">
            {hint}
          </p>
        )}
      </div>
    );
  }

  /** Ovládanie je na oboch stranách rovnaké, aby nikto nemusel naťahovať ruku. */
  function renderActionDeck(seats: typeof nearSeats) {
    if (phase.type === "revealed") {
      return (
        <div className="music-quiz-deck flex items-stretch justify-center gap-2 px-2">
          <button
            type="button"
            onClick={() => resolve(false)}
            className="party-shine flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-white/20 px-2 text-white shadow-lg transition active:scale-95"
            style={{ background: "linear-gradient(150deg, #b91c1c, #b91c1cc4)" }}
          >
            <Icons.circleX size={16} />
            <span className="music-quiz-seat-name font-black">Nesprávne</span>
          </button>
          <button
            type="button"
            onClick={() => resolve(true)}
            className="party-shine flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-white/20 px-2 text-white shadow-lg transition active:scale-95"
            style={{ background: "linear-gradient(150deg, #059669, #059669c4)" }}
          >
            <Icons.circleCheck size={16} />
            <span className="music-quiz-seat-name font-black">Správne</span>
          </button>
        </div>
      );
    }

    if (phase.type === "buzzed") {
      return (
        <div className="music-quiz-deck flex items-stretch px-3">
          <button
            type="button"
            onClick={() =>
              setPhase({ type: "revealed", participant: phase.participant })
            }
            className="party-shine flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 px-4 text-sm font-black text-white shadow-xl transition active:scale-95"
          >
            <Icons.sparkles size={16} />
            Ukázať správny zvuk
          </button>
        </div>
      );
    }

    return (
      <div className="music-quiz-deck flex items-stretch justify-center gap-2 px-2">
        {seats.map(({ name, index }) => {
          const color = PARTY_PLAYER_COLORS[index % PARTY_PLAYER_COLORS.length];
          return (
            <button
              key={`${name}-${index}`}
              type="button"
              disabled={!played}
              onClick={() => {
                stopAudio("ready");
                playFeedback("buzzer");
                setPhase({ type: "buzzed", participant: index });
              }}
              className="party-shine flex min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/20 px-3 text-white shadow-xl transition active:scale-95 disabled:opacity-40"
              style={{
                background: `linear-gradient(150deg, ${color}, ${color}b8)`,
              }}
            >
              <span className="min-w-0 text-left">
                <span className="music-quiz-seat-name block truncate font-black leading-tight">
                  {name}
                </span>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-white/75">
                  {scores[index]} b
                </span>
              </span>
              <span
                className="music-quiz-seat-dot shrink-0 rounded-full bg-white shadow-[0_0_14px_white]"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    );
  }

  /** Ekvalizér lemuje disk z oboch strán, takže stredové pásmo je symetrické. */
  function renderEqualizer(align: "left" | "right") {
    return (
      <span
        className={`flex min-w-0 flex-1 items-center gap-1 ${align === "left" ? "justify-end" : "justify-start"}`}
        aria-hidden="true"
      >
        {playing ? (
          [0, 1, 2, 3, 4].map(bar => (
            <i
              key={bar}
              className="music-quiz-eq-bar sound-quiz-eq-bar"
              style={{
                animationDelay: `${(align === "left" ? 4 - bar : bar) * 0.11}s`,
              }}
            />
          ))
        ) : (
          <span
            className={`music-quiz-rule sound-quiz-rule h-px w-full ${align === "left" ? "bg-gradient-to-r" : "bg-gradient-to-l"} from-transparent`}
          />
        )}
      </span>
    );
  }

  return (
    <PartyBackdrop>
      {/* two-sided-table: telefón leží na stole a horné pásmo patrí protistrane,
          takže tlačidlo odísť sa presunie do stredového pásu (index.css). */}
      <main className="music-quiz-stage sound-quiz-stage two-sided-table grid h-full grid-rows-[auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto] overflow-hidden">
        <div className="rotate-180">{renderActionDeck(farSeats)}</div>

        <div className="rotate-180 min-h-0">{renderReadout()}</div>

        <div className="music-quiz-center relative flex items-center justify-center gap-3">
          {renderEqualizer("left")}

          <button
            type="button"
            onClick={playing ? () => stopAudio("ready") : play}
            disabled={!soundAllowed || audioStatus === "loading"}
            aria-label={
              !soundAllowed
                ? "Zvuky sú vypnuté v nastaveniach"
                : playing
                  ? "Zastaviť zvuk"
                  : "Prehrať zvuk"
            }
            className={`music-quiz-disc sound-quiz-disc party-shine relative shrink-0 overflow-hidden rounded-full border-2 transition active:scale-95 disabled:opacity-55 ${playing ? "is-playing" : ""}`}
          >
            {/* Po odhalení nesie stred emoji odpovede — v hudobnom kvíze je tu
                obal albumu, tu je to najrýchlejšie čitateľné potvrdenie. */}
            {revealed ? (
              <span className="sound-quiz-emoji flex h-full w-full items-center justify-center bg-[#06212b]">
                {clue.emoji}
              </span>
            ) : (
              <img
                src={soundArt}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
            {!revealed && (
              <span
                className={`absolute inset-0 flex items-center justify-center bg-black/35 text-white ${
                  audioStatus === "loading" || playing ? "animate-pulse" : ""
                }`}
              >
                {audioStatus === "loading" ? (
                  <Icons.hourglass size={26} />
                ) : playing ? (
                  <Icons.pause size={28} />
                ) : (
                  <Icons.play size={28} />
                )}
              </span>
            )}
          </button>

          {renderEqualizer("right")}
        </div>

        <div className="min-h-0">{renderReadout()}</div>

        <div>{renderActionDeck(nearSeats)}</div>
      </main>
    </PartyBackdrop>
  );
}
