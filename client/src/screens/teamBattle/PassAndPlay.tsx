import { useRef, useState } from "react";
import { drawSong } from "../../data/songSelection";
import { type ForbiddenCard, type SongCard } from "../../data/teamBattleExtras";
import { getForbiddenCardsForLanguage } from "../../data/localizedForbiddenWord";
import { takePersistentItem } from "../../utils/persistentDeck";
import { useLanguage } from "../../i18n/LanguageProvider";
import { CircularTimer, PartyBackdrop, PartyEyebrow } from "./PartyChrome";
import { useCountdown } from "../../hooks/useCountdown";
import {
  TurnAnswerRecap,
  type TurnAnswer,
} from "../../components/TurnAnswerRecap";
import {
  makeEmptyScores,
  PARTY_PLAYER_COLORS,
  type QuickParticipantsProps,
} from "./quickGameShared";
import { soundsEnabled, vibrate } from "../../utils/deviceFeedback";
import { useSongPreview } from "../../hooks/useSongPreview";
import SongGameArtwork from "../../components/SongGameArtwork";
import { Icons } from "../../components/icons";

type PassMode = "zakazane" | "pesnicka";
type Phase = "ready" | "playing" | "team-result";

const MODE_COPY = {
  zakazane: {
    eyebrow: "Zakázané slovo",
    icon: "messageSquare",
    title: "Vysvetľuj bez zakázaných slov",
    instruction:
      "Jeden hráč opisuje hlavné slovo. Nesmie použiť žiadne zo štyroch slov na karte ani ich odvodeniny.",
    correct: "Uhádnuté",
    result: "uhádnutých slov",
    accent: "#fb7185",
  },
  pesnicka: {
    eyebrow: "Zahmkaj pesničku",
    icon: "music",
    title: "Zahmkaj melódiu bez slov",
    instruction:
      "Názov vidí iba hráč s mobilom. Zahmká melódiu bez textu. Za názov sa získava bod a za interpreta ďalší bod.",
    correct: "Uhádnutá",
    result: "bodov za názvy a interpretov",
    accent: "#a78bfa",
  },
} as const;

export function ForbiddenWordGame(props: SharedProps) {
  return <PassAndPlay mode="zakazane" {...props} />;
}

export function GuessSongGame(props: SharedProps) {
  return <PassAndPlay mode="pesnicka" {...props} />;
}

interface SharedProps extends QuickParticipantsProps {
  timeSeconds: number;
}

function PassAndPlay({
  participantNames,
  gameMode,
  timeSeconds,
  rounds = 1,
  onDone,
  mode,
}: SharedProps & { mode: PassMode }) {
  const { language } = useLanguage();
  const copy = MODE_COPY[mode];
  const ModeIcon = Icons[copy.icon];
  const soundAllowed = soundsEnabled();
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [index, setIndex] = useState(0);
  const [turnScore, setTurnScore] = useState(0);
  const [scores, setScores] = useState<number[]>(() =>
    makeEmptyScores(participantNames)
  );
  const [songAwards, setSongAwards] = useState({ title: false, artist: false });
  const [turnAnswers, setTurnAnswers] = useState<TurnAnswer[]>([]);
  const turnAnswersRef = useRef<TurnAnswer[]>([]);
  const [card, setCard] = useState<ForbiddenCard | SongCard | null>(null);
  const participant = turn % participantNames.length;
  const totalTurns = participantNames.length * rounds;
  const nextParticipant = (turn + 1) % participantNames.length;
  const participantColor =
    PARTY_PLAYER_COLORS[participant % PARTY_PLAYER_COLORS.length];
  const participantLabel = gameMode === "teams" ? "tím" : "hráč";
  const forbiddenCard =
    mode === "zakazane" ? (card as ForbiddenCard | null) : null;
  const songCard = mode === "pesnicka" ? (card as SongCard | null) : null;
  const {
    status: previewStatus,
    play: playSongPreview,
    stop: stopSongPreview,
  } = useSongPreview(
    songCard,
    soundAllowed && mode === "pesnicka" && phase === "playing",
    8
  );

  function addTurnAnswer(answer: TurnAnswer) {
    turnAnswersRef.current = [...turnAnswersRef.current, answer];
    setTurnAnswers(turnAnswersRef.current);
  }

  function recordSongAnswer(unansweredOutcome: "skipped" | "missed") {
    if (!songCard) return;
    const outcome =
      songAwards.title && songAwards.artist
        ? "guessed"
        : songAwards.title || songAwards.artist
          ? "partial"
          : unansweredOutcome;
    addTurnAnswer({
      answer: `${songCard.title} — ${songCard.artist}`,
      outcome,
      detail: `Názov ${songAwards.title ? "✓" : "✕"} · Interpret ${songAwards.artist ? "✓" : "✕"}`,
    });
  }

  function drawCard() {
    if (mode === "zakazane") {
      setCard(
        takePersistentItem(
          `quick:forbidden-words:${language}`,
          getForbiddenCardsForLanguage(language),
          item => item.word.trim().toLocaleLowerCase(language)
        )
      );
      return;
    }
    // Zahmkaj pesničku: vyberáme len skladby rozpoznateľné podľa melódie a
    // rešpektujeme session, aby tú istú skladbu nedostal aj Hudobný kvíz.
    const song = drawSong({ language, minigame: "hum" });
    if (song) setCard(song);
  }

  // Počas prehrávania ukážky pesničky sa čas zastaví, inak beží podľa reálneho času.
  const isPreviewPlaying = mode === "pesnicka" && previewStatus === "playing";
  const { secondsLeft: timeLeft, reset: resetCountdown } = useCountdown(
    timeSeconds,
    phase === "playing" && !isPreviewPlaying,
    () => {
      stopSongPreview("ready");
      if (mode === "zakazane" && forbiddenCard)
        addTurnAnswer({ answer: forbiddenCard.word, outcome: "missed" });
      if (mode === "pesnicka") recordSongAnswer("missed");
      setPhase("team-result");
    }
  );

  function startTurn() {
    setIndex(0);
    setTurnScore(0);
    turnAnswersRef.current = [];
    setTurnAnswers([]);
    resetCountdown();
    setSongAwards({ title: false, artist: false });
    drawCard();
    setPhase("playing");
  }

  function nextCard(correct: boolean) {
    stopPreview();
    if (forbiddenCard)
      addTurnAnswer({
        answer: forbiddenCard.word,
        outcome: correct ? "guessed" : "skipped",
      });
    if (correct) setTurnScore(value => value + 1);
    drawCard();
    setIndex(value => value + 1);
    vibrate(correct ? 30 : 12);
  }

  function awardSongPart(part: "title" | "artist") {
    if (songAwards[part]) return;
    setSongAwards(current => ({ ...current, [part]: true }));
    setTurnScore(value => value + 1);
    vibrate(25);
  }

  function nextSongCard() {
    stopPreview();
    recordSongAnswer("skipped");
    setSongAwards({ title: false, artist: false });
    drawCard();
    setIndex(value => value + 1);
  }

  function stopPreview() {
    stopSongPreview("ready");
  }

  function playPreview() {
    void playSongPreview();
  }

  function continueAfterResult() {
    const nextScores = [...scores];
    nextScores[participant] += turnScore;
    setScores(nextScores);
    if (turn + 1 < totalTurns) {
      setTurn(value => value + 1);
      setPhase("ready");
    } else {
      onDone(nextScores);
    }
  }

  if (phase === "ready") {
    return (
      <PartyBackdrop>
        <main
          className={`flex h-full flex-col items-center overflow-hidden px-6 py-4 text-center ${mode === "pesnicka" ? "song-ready-screen" : "justify-center"}`}
        >
          <PartyEyebrow>{copy.eyebrow}</PartyEyebrow>
          {mode === "pesnicka" ? (
            <div className="song-ready-hero relative mt-5 h-48 w-full max-w-sm overflow-hidden rounded-[2.1rem] border border-violet-200/20 shadow-[0_28px_70px_-32px_rgba(167,139,250,.9)]">
              <SongGameArtwork className="h-full w-full" labelled />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-left">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[.24em] text-violet-200/65">
                    Melódia bez slov
                  </p>
                  <h1 className="mt-1 text-2xl font-black leading-none text-white">
                    Zahmkaj pesničku
                  </h1>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-black/35 text-violet-100 backdrop-blur-xl">
                  <Icons.music size={23} />
                </span>
              </div>
            </div>
          ) : (
            <div className="relative mt-7 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/15 bg-white/[0.07] text-5xl shadow-[0_22px_60px_rgba(0,0,0,.35)]">
              <ModeIcon size={42} />
            </div>
          )}
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
            {turn === 0 ? "Začína" : "Na rade je"} • kolo{" "}
            {Math.floor(turn / participantNames.length) + 1}/{rounds}
          </p>
          <h2
            className="mt-2 text-4xl font-black"
            style={{ color: participantColor }}
          >
            {participantNames[participant]}
          </h2>
          <section
            className={`party-glass mt-5 w-full max-w-sm rounded-[1.8rem] p-5 ${mode === "pesnicka" ? "song-instruction-card" : ""}`}
          >
            <h2 className="text-lg font-black text-white">{copy.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/45">
              {copy.instruction}
            </p>
            {mode === "pesnicka" && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <span className="rounded-xl border border-violet-300/15 bg-violet-400/[.07] px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-violet-200/70">
                  Názov +1 bod
                </span>
                <span className="rounded-xl border border-fuchsia-300/15 bg-fuchsia-400/[.07] px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-fuchsia-200/70">
                  Interpret +1 bod
                </span>
              </div>
            )}
            {turn > 0 && (
              <p className="mt-3 text-xs font-bold text-white/30">
                Aktuálne skóre: {scores[participant]} bodov
              </p>
            )}
          </section>
          <button
            onClick={startTurn}
            className="party-shine mt-5 w-full max-w-sm overflow-hidden rounded-2xl px-6 py-5 text-base font-black uppercase tracking-wider text-white shadow-xl transition active:scale-[.97]"
            style={{
              background: `linear-gradient(135deg, ${participantColor}, ${copy.accent})`,
            }}
          >
            Spustiť {timeSeconds} sekúnd
          </button>
        </main>
      </PartyBackdrop>
    );
  }

  if (phase === "team-result") {
    return (
      <PartyBackdrop>
        <main
          className={`flex h-full flex-col items-center overflow-hidden px-6 py-4 text-center ${mode === "pesnicka" ? "song-result-screen" : ""}`}
        >
          {mode === "pesnicka" ? (
            <div className="relative h-28 w-full max-w-xs overflow-hidden rounded-[1.8rem] border border-violet-200/20">
              <SongGameArtwork className="h-full w-full" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-black/40 text-amber-200 backdrop-blur-xl">
                  {turnScore > 0 ? (
                    <Icons.trophy size={30} />
                  ) : (
                    <Icons.clock size={28} />
                  )}
                </span>
              </span>
            </div>
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/12 bg-white/[.05] text-amber-200">
              {turnScore > 0 ? (
                <Icons.trophy size={42} />
              ) : (
                <Icons.clock size={40} />
              )}
            </div>
          )}
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
            Výsledok tímu
          </p>
          <h1
            className="mt-2 text-3xl font-black"
            style={{ color: participantColor }}
          >
            {participantNames[participant]}
          </h1>
          <div
            className={`party-glass mt-7 w-full max-w-xs rounded-[2rem] p-8 ${mode === "pesnicka" ? "song-result-score" : ""}`}
          >
            <p className="text-7xl font-black tabular-nums text-white">
              {turnScore}
            </p>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-white/35">
              {copy.result}
            </p>
          </div>
          <TurnAnswerRecap answers={turnAnswers} />
          <button
            onClick={continueAfterResult}
            className="party-shine mt-7 w-full max-w-xs overflow-hidden rounded-2xl px-6 py-5 text-base font-black text-white shadow-xl transition active:scale-[.97]"
            style={{ background: participantColor }}
          >
            {turn + 1 < totalTurns
              ? `${participantNames[nextParticipant]} na rad`
              : "Výsledok kola"}
          </button>
        </main>
      </PartyBackdrop>
    );
  }

  return (
    <div
      className={`fixed inset-0 flex flex-col overflow-hidden ${mode === "pesnicka" ? "song-playing-screen" : ""}`}
      style={{
        background: `radial-gradient(circle at 50% 28%, ${copy.accent}22, transparent 45%), #070711`,
      }}
    >
      <div className="party-grid pointer-events-none absolute inset-0 opacity-20" />
      <header
        className={`exit-slot-gap relative z-10 m-3 flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.055] px-4 py-3 backdrop-blur-xl ${mode === "pesnicka" ? "song-round-header" : ""}`}
      >
        <div className="min-w-0 text-left">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
            Hrá {participantLabel}
          </p>
          <p
            className="truncate text-base font-black"
            style={{ color: participantColor }}
          >
            {participantNames[participant]}
          </p>
        </div>
        <CircularTimer
          value={timeLeft}
          total={timeSeconds}
          color={timeLeft <= 10 ? "#ef4444" : copy.accent}
          size={82}
        />
        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
            Body
          </p>
          <p className="text-3xl font-black tabular-nums text-white">
            {turnScore}
          </p>
        </div>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden px-5 py-2 text-center">
        <section
          key={index}
          className={`party-glass party-shine w-full max-w-md overflow-hidden rounded-[2.2rem] px-6 py-8 ${mode === "pesnicka" ? "song-round-card" : ""}`}
          style={{ animation: "popIn .3s ease-out both" }}
        >
          {mode === "zakazane" ? (
            <>
              <ModeIcon size={34} className="text-rose-200" />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-rose-300/65">
                Vysvetli slovo
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-white">
                {forbiddenCard?.word}
              </h1>
              <div className="mt-6 rounded-[1.5rem] border border-rose-400/20 bg-rose-500/[0.09] p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-rose-300/60">
                  Nesmieš povedať
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {forbiddenCard?.forbidden.map(word => (
                    <span
                      key={word}
                      className="rounded-xl bg-black/20 px-2 py-2 text-sm font-black text-white/70"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="relative -mx-6 -mt-8 mb-5 h-36 overflow-hidden border-b border-violet-300/15">
                <SongGameArtwork className="h-full w-full" labelled />
                <span className="absolute bottom-3 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-xl border border-white/20 bg-black/35 text-violet-100 backdrop-blur-xl">
                  <Icons.music size={21} />
                </span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300/65">
                Zahmkaj bez slov
              </p>
              <h1 className="mx-auto mt-3 max-w-sm text-3xl font-black leading-tight text-white">
                {songCard?.title}
              </h1>
              <p className="mt-2 text-sm font-bold text-violet-200/60">
                {songCard?.artist}
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-wider ${songAwards.title ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/[0.04] text-white/30"}`}
                >
                  Názov {songAwards.title ? "✓" : "+1"}
                </span>
                <span
                  className={`rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-wider ${songAwards.artist ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/[0.04] text-white/30"}`}
                >
                  Interpret {songAwards.artist ? "✓" : "+1"}
                </span>
              </div>
              <div className="song-preview-panel mt-5 rounded-2xl border border-violet-300/15 bg-violet-400/[0.07] p-3">
                <div className="flex items-center gap-3 text-left">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-400/15 text-violet-200">
                    <Icons.headphones size={18} />
                  </span>
                  <p className="text-[10px] font-bold leading-relaxed text-white/42">
                    Nepoznáš ju podľa názvu? Prilož mobil k uchu a pusti si
                    krátku ukážku.
                  </p>
                </div>
                <button
                  onClick={
                    previewStatus === "playing" ? stopPreview : playPreview
                  }
                  disabled={
                    !soundAllowed ||
                    previewStatus === "loading" ||
                    previewStatus === "missing"
                  }
                  className="mt-3 w-full rounded-xl border border-violet-300/20 bg-violet-400/15 px-3 py-3 text-xs font-black text-violet-100 transition active:scale-95 disabled:opacity-40"
                >
                  {previewStatus === "loading"
                    ? "Hľadám ukážku…"
                    : previewStatus === "missing"
                      ? "Ukážka sa nenašla"
                      : previewStatus === "playing"
                        ? "Zastaviť ukážku"
                        : "Pustiť 8 s ukážku"}
                </button>
                {previewStatus === "missing" && (
                  <p className="mt-2 text-[9px] font-bold text-white/25">
                    Deezer ani iTunes nemajú pre túto skladbu dostupný audio
                    preview.
                  </p>
                )}
              </div>
              {previewStatus === "playing" && (
                <p className="mt-2 text-[9px] font-black uppercase tracking-wider text-violet-200/60">
                  Čas je počas ukážky pozastavený
                </p>
              )}
              <p className="mt-4 text-xs font-bold text-white/30">
                Mobil vidí iba hráč, ktorý hmkanie predvádza.
              </p>
            </>
          )}
        </section>
      </main>

      {mode === "pesnicka" ? (
        <footer className="relative z-10 grid shrink-0 grid-cols-3 gap-2 px-4 pb-7 pt-3">
          <button
            onClick={nextSongCard}
            className="party-glass rounded-2xl py-4 text-xs font-black text-white/65 transition active:scale-95"
          >
            Ďalšia
          </button>
          <button
            onClick={() => awardSongPart("title")}
            disabled={songAwards.title}
            className="party-shine overflow-hidden rounded-2xl bg-violet-600 py-4 text-xs font-black text-white shadow-lg transition active:scale-95 disabled:bg-emerald-700 disabled:opacity-80"
          >
            {songAwards.title ? "✓ Názov" : "+1 Názov"}
          </button>
          <button
            onClick={() => awardSongPart("artist")}
            disabled={songAwards.artist}
            className="party-shine overflow-hidden rounded-2xl bg-fuchsia-600 py-4 text-xs font-black text-white shadow-lg transition active:scale-95 disabled:bg-emerald-700 disabled:opacity-80"
          >
            {songAwards.artist ? "✓ Interpret" : "+1 Interpret"}
          </button>
        </footer>
      ) : (
        <footer className="relative z-10 flex shrink-0 gap-3 px-4 pb-7 pt-3">
          <button
            onClick={() => nextCard(false)}
            className="party-glass flex-1 rounded-2xl py-5 text-sm font-black text-white/55 transition active:scale-95"
          >
            Preskočiť
          </button>
          <button
            onClick={() => nextCard(true)}
            className="party-shine flex-1 overflow-hidden rounded-2xl bg-emerald-600 py-5 text-sm font-black text-white shadow-lg transition active:scale-95"
          >
            ✓ {copy.correct} +1
          </button>
        </footer>
      )}
    </div>
  );
}
