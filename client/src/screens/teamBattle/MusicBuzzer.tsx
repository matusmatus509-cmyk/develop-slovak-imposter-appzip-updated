import { useEffect, useMemo, useRef, useState } from "react";
/** Design: Nočný herný salón — hudobný kvíz používa hostovaný vizuál kvízu. */
import { musicQuizGameHero as songArt } from "../../media";
import { getSongCardsForLanguage } from "../../data/localizedSongs";
import { useFeedback } from "../../feedback/FeedbackProvider";
import { useSongPreview } from "../../hooks/useSongPreview";
import { useLanguage } from "../../i18n/LanguageProvider";
import { soundsEnabled, vibrate } from "../../utils/deviceFeedback";
import { takePersistentItems } from "../../utils/persistentDeck";
import { PartyBackdrop } from "./PartyChrome";
import {
  makeEmptyScores,
  PARTY_PLAYER_COLORS,
  type QuickParticipantsProps,
} from "./quickGameShared";
import { Icons } from "../../components/icons";

type Phase =
  | { type: "question" }
  | { type: "buzzed"; participant: number }
  | { type: "revealed"; participant: number | null };

/**
 * Obrazovka je „obojstranná": telefón leží na stole a hráči sedia z dvoch strán.
 * Preto je layout mriežka s piatimi pevnými pásmi — horné dva sú otočené o 180°,
 * takže protistrana čita rovnako pohodlne ako blizšia strana.
 *
 * Prečo mriežka a nie absolútne pozicovanie: predchádzajúca verzia mala centrálne
 * tlačidlo `absolute` presne na deliacej línii so `z-10` a texty pod ním, takže
 * dlhší názov skladby aj interpret sa dostali pod tlačidlo alebo ich odstrihol
 * `overflow-hidden`. V mriežke má každý prvok vlastný riadok a prekrytie je
 * konštrukčne nemožné.
 */
export default function MusicBuzzer({
  participantNames,
  gameMode,
  onDone,
  rounds = 10,
  timeSeconds = 10,
}: QuickParticipantsProps) {
  const { language } = useLanguage();
  const { playFeedback } = useFeedback();
  const soundAllowed = soundsEnabled();
  const deck = useMemo(() => {
    const catalogue = getSongCardsForLanguage(language);
    return takePersistentItems(
      `party:music-buzzer:${language}`,
      catalogue,
      catalogue.length,
      song => `${song.title}|${song.artist}`.toLocaleLowerCase()
    );
  }, [language]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [deckIndex, setDeckIndex] = useState(0);
  const [scores, setScores] = useState<number[]>(() =>
    makeEmptyScores(participantNames)
  );
  const [phase, setPhase] = useState<Phase>({ type: "question" });
  const [played, setPlayed] = useState(false);
  const autoStartedFor = useRef<number | null>(null);
  const song = deck[deckIndex] ?? null;
  const { status, source, play, stop } = useSongPreview(
    song,
    soundAllowed,
    timeSeconds
  );
  const participantWord = gameMode === "teams" ? "Tím" : "Hráč";

  const unavailable =
    !soundAllowed || status === "missing" || status === "error";
  const revealed = phase.type === "revealed";

  async function playPreview() {
    if (await play()) setPlayed(true);
  }

  useEffect(() => {
    if (
      !soundAllowed ||
      status !== "ready" ||
      autoStartedFor.current === deckIndex
    )
      return;
    autoStartedFor.current = deckIndex;
    void playPreview();
  }, [deckIndex, soundAllowed, status]);

  function resetQuestion() {
    setPhase({ type: "question" });
    setPlayed(false);
  }

  function advance(nextScores = scores) {
    stop("idle");
    if (questionIndex + 1 >= rounds || deckIndex + 1 >= deck.length) {
      onDone(nextScores);
      return;
    }
    setQuestionIndex(value => value + 1);
    setDeckIndex(value => value + 1);
    resetQuestion();
  }

  function skipUnavailable() {
    stop("idle");
    if (deckIndex + 1 >= deck.length) {
      onDone(scores);
      return;
    }
    setDeckIndex(value => value + 1);
    resetQuestion();
  }

  function resolve(titleCorrect: boolean, artistCorrect: boolean) {
    if (phase.type !== "revealed") return;
    const points =
      phase.participant === null
        ? 0
        : Number(titleCorrect) + Number(artistCorrect);
    const nextScores = [...scores];
    if (phase.participant !== null) nextScores[phase.participant] += points;
    setScores(nextScores);
    vibrate(points === 2 ? 40 : points === 1 ? 25 : 12);
    advance(nextScores);
  }

  // Hráči sa delia na dve strany stola: prvá polovica bližšie, zvyšok naproti.
  const half = Math.ceil(participantNames.length / 2);
  const seating = participantNames.map((name, index) => ({ name, index }));
  const nearSeats = seating.slice(0, half);
  const farSeats = seating.slice(half);

  const scoreActions = [
    {
      points: "0",
      label: "Nič",
      action: () => resolve(false, false),
      color: "#475569",
    },
    {
      points: "+1",
      label: "Názov",
      action: () => resolve(true, false),
      color: "#7c3aed",
    },
    {
      points: "+1",
      label: "Interpret",
      action: () => resolve(false, true),
      color: "#c026d3",
    },
    {
      points: "+2",
      label: "Oboje",
      action: () => resolve(true, true),
      color: "#059669",
    },
  ];

  const headline =
    phase.type === "question"
      ? status === "loading"
        ? "Hľadám ukážku…"
        : played
          ? "Kto pozná túto pesničku?"
          : "Spúšťam ukážku…"
      : phase.type === "buzzed"
        ? `${participantNames[phase.participant]} odpovedá`
        : (song?.title ?? "Hudobný kvíz");

  const hint = !soundAllowed
    ? "Zvuky sú vypnuté — zapni ich v nastaveniach"
    : status === "missing"
      ? "Ukážka nie je dostupná"
      : status === "error"
        ? "Prehrávanie sa nepodarilo"
        : phase.type === "question"
          ? played
            ? "Bzuč, keď poznáš názov aj interpreta"
            : ""
          : phase.type === "buzzed"
            ? `${participantWord} povie názov aj interpreta`
            : "";

  /**
   * Interpret má vlastný pás s vlastným popisom, nie prilepený k názvu.
   * Presne toto sa predtým strácalo: bol zliaty do jedného nízkokontrastného
   * riadku spolu s bodovaním, takže sa odstrihol ako prvý.
   */
  /**
   * Render funkcie, nie vnorené komponenty: keby to boli komponenty definované
   * vnútri MusicBuzzer, každý render by vytvoril nový typ, React by podstrom
   * odmontoval a znova pripojil a animácie ekvalizéra by sa restartovali.
   */
  function renderReadout() {
    // justify-start priťahuje obsah k stredovému disku (v otočenej polovici to
    // vďaka rotácii vyjde na tú istú stranu), takže názov, interpret a obal
    // čítajú ako jeden celok a bzučiaky zostávajú na dosah pri okrajoch.
    return (
      <div className="music-quiz-readout flex min-h-0 flex-col items-center justify-start gap-2 overflow-hidden px-4 text-center">
        <p className="music-quiz-eyebrow shrink-0 rounded-full border border-fuchsia-300/25 bg-fuchsia-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-fuchsia-200/90">
          Pesnička {Math.min(questionIndex + 1, rounds)} / {rounds}
        </p>

        <h2 className="music-quiz-title min-w-0 max-w-full break-words px-1 font-black leading-[1.03] tracking-[-0.03em] text-white">
          {headline}
        </h2>

        {revealed && song && (
          <p className="music-quiz-artist flex min-w-0 max-w-full shrink-0 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.07] px-3 py-1.5">
            <span className="shrink-0 text-fuchsia-200/80" aria-hidden="true">
              <Icons.user size={13} />
            </span>
            <span className="music-quiz-artist-label shrink-0 text-[8px] font-black uppercase tracking-[0.16em] text-white/45">
              Interpret
            </span>
            <span className="music-quiz-artist-name min-w-0 break-words text-left font-black leading-tight text-white">
              {song.artist}
            </span>
          </p>
        )}

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
    if (revealed && phase.participant !== null) {
      return (
        <div className="music-quiz-deck flex items-stretch justify-center gap-1.5 px-2">
          {scoreActions.map(item => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="party-shine flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl border border-white/20 px-1 text-white shadow-lg transition active:scale-95"
              style={{
                background: `linear-gradient(150deg, ${item.color}, ${item.color}c4)`,
              }}
            >
              <span className="text-sm font-black tabular-nums leading-none">
                {item.points}
              </span>
              <span className="music-quiz-score-label text-[8.5px] font-black uppercase leading-none tracking-wide">
                {item.label}
              </span>
            </button>
          ))}
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
            className="party-shine flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 text-sm font-black text-white shadow-xl transition active:scale-95"
          >
            <Icons.sparkles size={16} />
            Odhaliť odpoveď
          </button>
        </div>
      );
    }

    if (unavailable) {
      return (
        <div className="music-quiz-deck flex items-stretch px-3">
          <button
            type="button"
            onClick={skipUnavailable}
            className="party-shine flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-600 px-4 text-sm font-black text-white shadow-xl transition active:scale-95"
          >
            <Icons.chevronRight size={16} />
            Ďalšia pesnička
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
                stop("ready");
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

  /**
   * Obal albumu sa odhalí až s odpoveďou — počas otázky by prezradil skladbu,
   * takže dovtedy drží miesto neutrálny vizuál kvízu.
   */
  const artwork = revealed ? (source?.artwork ?? songArt) : songArt;
  const playing = status === "playing";

  /** Ekvalizér lemuje disk z oboch strán, takže stredové pásmo zostáva symetrické. */
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
              className="music-quiz-eq-bar"
              style={{
                animationDelay: `${(align === "left" ? 4 - bar : bar) * 0.11}s`,
              }}
            />
          ))
        ) : (
          <span
            className={`music-quiz-rule h-px w-full ${align === "left" ? "bg-gradient-to-r" : "bg-gradient-to-l"} from-transparent to-violet-300/45`}
          />
        )}
      </span>
    );
  }

  return (
    <PartyBackdrop>
      {/* two-sided-table: telefón leží na stole a horné pásmo patrí protistrane,
          takže tlačidlo odísť sa presunie do stredového pásu (index.css). */}
      <main className="music-quiz-stage two-sided-table grid h-full grid-rows-[auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto] overflow-hidden">
        <div className="rotate-180">{renderActionDeck(farSeats)}</div>

        <div className="rotate-180 min-h-0">{renderReadout()}</div>

        <div className="music-quiz-center relative flex items-center justify-center gap-3">
          {renderEqualizer("left")}

          <button
            type="button"
            onClick={playing ? () => stop("ready") : playPreview}
            disabled={
              !soundAllowed || status === "loading" || status === "missing"
            }
            aria-label={playing ? "Zastaviť pesničku" : "Prehrať pesničku"}
            className={`music-quiz-disc party-shine relative shrink-0 overflow-hidden rounded-full border-2 border-violet-300/35 shadow-[0_0_46px_rgba(217,70,239,.34)] transition active:scale-95 disabled:opacity-55 ${playing ? "is-playing" : ""}`}
          >
            <img
              src={artwork}
              alt={
                revealed && song
                  ? `Obal albumu — ${song.title}, ${song.artist}`
                  : ""
              }
              className="h-full w-full object-cover"
            />
            <span
              className={`absolute inset-0 flex items-center justify-center bg-black/35 text-white ${
                status === "loading" || status === "playing"
                  ? "animate-pulse"
                  : ""
              }`}
            >
              {status === "loading" ? (
                <Icons.hourglass size={26} />
              ) : playing ? (
                <Icons.pause size={28} />
              ) : (
                <Icons.play size={28} />
              )}
            </span>
          </button>

          {renderEqualizer("right")}
        </div>

        <div className="min-h-0">{renderReadout()}</div>

        <div>{renderActionDeck(nearSeats)}</div>
      </main>
    </PartyBackdrop>
  );
}
