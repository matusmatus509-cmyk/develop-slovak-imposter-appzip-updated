import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import songArt from "../../assets/party-music-quiz-hero-v2.png";
import { getSongCardsForLanguage } from "../../data/localizedSongs";
import { useFeedback } from "../../feedback/FeedbackProvider";
import { useSongPreview } from "../../hooks/useSongPreview";
import { useLanguage } from "../../i18n/LanguageProvider";
import { soundsEnabled, vibrate } from "../../utils/deviceFeedback";
import { takePersistentItems } from "../../utils/persistentDeck";
import { PartyBackdrop } from "./PartyChrome";
import { makeEmptyScores, PARTY_PLAYER_COLORS, type QuickParticipantsProps } from "./quickGameShared";

type Phase = { type: "question" } | { type: "buzzed"; participant: number } | { type: "revealed"; participant: number | null };

const CORNERS = [
  "left-3 top-[max(.75rem,env(safe-area-inset-top))] rotate-180",
  "right-3 top-[max(.75rem,env(safe-area-inset-top))] rotate-180",
  "bottom-[max(.75rem,env(safe-area-inset-bottom))] left-3",
  "bottom-[max(.75rem,env(safe-area-inset-bottom))] right-3",
];

function TableReadout({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex flex-1 items-center justify-center px-5 pb-20 text-center rotate-180">{children}</div>
      <div className="relative h-px shrink-0 bg-gradient-to-r from-transparent via-violet-300/70 to-transparent" />
      <div className="flex flex-1 items-center justify-center px-5 pt-20 text-center">{children}</div>
    </div>
  );
}

function DualAction({ children, onClick, className = "" }: { children: ReactNode; onClick: () => void; className?: string }) {
  return (
    <button onClick={onClick} className={`party-shine flex w-full flex-col items-center rounded-2xl px-4 py-2.5 text-xs font-black text-white shadow-xl transition active:scale-95 ${className}`}>
      <span className="rotate-180">{children}</span>
      <span className="my-1 h-px w-12 bg-white/25" />
      <span>{children}</span>
    </button>
  );
}

/** Four-corner, two-sided music quiz designed for players around one phone. */
export default function MusicBuzzer({ participantNames, gameMode, onDone, rounds = 10, timeSeconds = 10 }: QuickParticipantsProps) {
  const { language } = useLanguage();
  const { playFeedback } = useFeedback();
  const soundAllowed = soundsEnabled();
  const deck = useMemo(() => {
    const catalogue = getSongCardsForLanguage(language);
    return takePersistentItems(
      `party:music-buzzer:${language}`,
      catalogue,
      catalogue.length,
      (song) => `${song.title}|${song.artist}`.toLocaleLowerCase(),
    );
  }, [language]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [deckIndex, setDeckIndex] = useState(0);
  const [scores, setScores] = useState<number[]>(() => makeEmptyScores(participantNames));
  const [phase, setPhase] = useState<Phase>({ type: "question" });
  const [played, setPlayed] = useState(false);
  const autoStartedFor = useRef<number | null>(null);
  const song = deck[deckIndex] ?? null;
  const { status, play, stop } = useSongPreview(song, soundAllowed, timeSeconds);
  const participantWord = gameMode === "teams" ? "Tím" : "Hráč";
  const cornerOrder = participantNames.length === 2 ? [0, 3] : participantNames.map((_, index) => index);

  async function playPreview() {
    if (await play()) setPlayed(true);
  }

  useEffect(() => {
    if (!soundAllowed || status !== "ready" || autoStartedFor.current === deckIndex) return;
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
    setQuestionIndex((value) => value + 1);
    setDeckIndex((value) => value + 1);
    resetQuestion();
  }

  function skipUnavailable() {
    stop("idle");
    if (deckIndex + 1 >= deck.length) {
      onDone(scores);
      return;
    }
    setDeckIndex((value) => value + 1);
    resetQuestion();
  }

  function resolve(titleCorrect: boolean, artistCorrect: boolean) {
    if (phase.type !== "revealed") return;
    const points = phase.participant === null ? 0 : Number(titleCorrect) + Number(artistCorrect);
    const nextScores = [...scores];
    if (phase.participant !== null) nextScores[phase.participant] += points;
    setScores(nextScores);
    vibrate(points === 2 ? 40 : points === 1 ? 25 : 12);
    advance(nextScores);
  }

  const readoutTitle = phase.type === "question"
    ? status === "loading" ? "Hľadám ukážku…" : played ? "Kto pozná túto pesničku?" : "Spúšťam ukážku…"
    : phase.type === "buzzed" ? `${participantNames[phase.participant]} odpovedá`
    : song?.title ?? "Hudobný kvíz";
  const readoutDetail = !soundAllowed
    ? "Zvuky sú vypnuté"
    : status === "missing" ? "Ukážka nie je dostupná"
    : status === "error" ? "Prehrávanie sa nepodarilo"
    : phase.type === "question" ? "Keď skladbu spoznáš, stlač svoj roh"
    : phase.type === "buzzed" ? `${participantWord} povie názov aj interpreta`
    : `${song?.artist} · 1 bod názov · 1 bod interpret`;

  const scoreActions = [
    { label: "0 · Nič", action: () => resolve(false, false), color: "#334155" },
    { label: "+1 · Názov", action: () => resolve(true, false), color: "#6d28d9" },
    { label: "+1 · Interpret", action: () => resolve(false, true), color: "#a21caf" },
    { label: "+2 · Oboje", action: () => resolve(true, true), color: "#059669" },
  ];

  return (
    <PartyBackdrop>
      <main className="relative h-[100dvh] overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,.2),transparent_48%)]" />

        {phase.type === "question" && soundAllowed && status !== "missing" && status !== "error" && participantNames.map((name, participant) => {
          const corner = cornerOrder[participant] ?? participant;
          const color = PARTY_PLAYER_COLORS[participant % PARTY_PLAYER_COLORS.length];
          return (
            <button
              key={`${name}-${participant}`}
              disabled={!played}
              onClick={() => { stop("ready"); playFeedback("buzzer"); setPhase({ type: "buzzed", participant }); }}
              className={`party-shine absolute z-20 flex h-[5.6rem] w-[6.4rem] flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/20 px-2 text-white shadow-2xl transition active:scale-90 disabled:opacity-35 ${CORNERS[corner]}`}
              style={{ background: `linear-gradient(145deg, ${color}, ${color}bb)` }}
            >
              <span className="max-w-full truncate text-xs font-black">{name}</span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/70">{scores[participant]} bodov</span>
              <span className="mt-1.5 h-2 w-2 rounded-full bg-white shadow-[0_0_16px_white]" />
            </button>
          );
        })}

        {phase.type === "revealed" && phase.participant !== null && scoreActions.map((item, index) => (
          <button
            key={item.label}
            onClick={item.action}
            className={`party-shine absolute z-20 flex h-[5.6rem] w-[6.4rem] items-center justify-center rounded-[1.5rem] border border-white/20 px-2 text-xs font-black text-white shadow-2xl transition active:scale-90 ${CORNERS[index]}`}
            style={{ background: item.color }}
          >
            {item.label}
          </button>
        ))}

        <section className="party-glass absolute left-1/2 top-1/2 h-[min(70dvh,36rem)] w-[min(80vw,24rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2.7rem] border-violet-300/25 shadow-[0_0_100px_rgba(139,92,246,.25)]">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
          <TableReadout>
            <p className="text-[8px] font-black uppercase tracking-[.22em] text-violet-300/65">Hudobný kvíz · {questionIndex + 1}/{rounds}</p>
            <h1 className="mt-1 text-xl font-black leading-tight text-white sm:text-2xl">{readoutTitle}</h1>
            <p className="mt-2 text-xs font-bold leading-snug text-white/50">{readoutDetail}</p>
          </TableReadout>

          <button
            onClick={status === "playing" ? () => stop("ready") : playPreview}
            disabled={!soundAllowed || status === "loading" || status === "missing"}
            aria-label={status === "playing" ? "Zastaviť pesničku" : "Prehrať pesničku"}
            className="party-shine absolute left-1/2 top-1/2 z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-violet-300/30 shadow-[0_0_70px_rgba(217,70,239,.34)] transition active:scale-95 disabled:opacity-55"
          >
            <img src={songArt} alt="" className="h-full w-full object-cover" />
            <span className={`absolute inset-0 flex items-center justify-center bg-black/30 text-2xl ${status === "loading" || status === "playing" ? "animate-pulse" : ""}`}>
              {status === "loading" ? "◌" : status === "playing" ? "Ⅱ" : "▶"}
            </span>
          </button>

          <div className="absolute bottom-4 left-1/2 z-10 w-[calc(100%-2rem)] max-w-[15rem] -translate-x-1/2">
            {phase.type === "question" && soundAllowed && played && status !== "missing" && status !== "error" && (
              <DualAction onClick={() => { stop("ready"); setPhase({ type: "revealed", participant: null }); }} className="bg-gradient-to-r from-slate-700 to-slate-600">Nikto nevie</DualAction>
            )}
            {phase.type === "question" && (!soundAllowed || status === "missing" || status === "error") && (
              <DualAction onClick={skipUnavailable} className="bg-gradient-to-r from-slate-700 to-slate-600">Ďalšia pesnička</DualAction>
            )}
            {phase.type === "buzzed" && (
              <DualAction onClick={() => setPhase({ type: "revealed", participant: phase.participant })} className="bg-gradient-to-r from-violet-600 to-fuchsia-500">Odhaliť odpoveď</DualAction>
            )}
            {phase.type === "revealed" && phase.participant === null && (
              <DualAction onClick={() => resolve(false, false)} className="bg-gradient-to-r from-slate-700 to-slate-600">Ďalšia pesnička</DualAction>
            )}
          </div>
        </section>
      </main>
    </PartyBackdrop>
  );
}
