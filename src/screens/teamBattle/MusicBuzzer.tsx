import { useEffect, useMemo, useRef, useState } from "react";
import songArt from "../../assets/party-music-quiz-hero-v2.png";
import { getSongCardsForLanguage } from "../../data/localizedSongs";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useSongPreview } from "../../hooks/useSongPreview";
import { takePersistentItems } from "../../utils/persistentDeck";
import { soundsEnabled, vibrate } from "../../utils/deviceFeedback";
import { useFeedback } from "../../feedback/FeedbackProvider";
import { ParticipantScoreStrip, PartyBackdrop, PartyEyebrow } from "./PartyChrome";
import { makeEmptyScores, PARTY_PLAYER_COLORS, type QuickParticipantsProps } from "./quickGameShared";

type Phase = { type: "question" } | { type: "buzzed"; participant: number } | { type: "revealed"; participant: number | null };

/** Public audio quiz: everyone hears the preview, buzzes, then earns 0–2 points. */
export default function MusicBuzzer({ participantNames, gameMode, onDone, rounds = 10, timeSeconds = 10 }: QuickParticipantsProps) {
  const { language } = useLanguage();
  const { playFeedback } = useFeedback();
  const soundAllowed = soundsEnabled();
  // Keep one stable deck for the whole mounted game. Recreating the catalogue on
  // every render used to reshuffle the active song after a score/state update.
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
  const { status, source, play, stop } = useSongPreview(song, soundAllowed, timeSeconds);
  const participantWord = gameMode === "teams" ? "Tím" : "Hráč";

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

  return (
    <PartyBackdrop>
      <main className="flex h-[100dvh] flex-col overflow-hidden px-4 pb-4 pt-3 text-center">
        <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col">
          <ParticipantScoreStrip names={participantNames} scores={scores} colors={PARTY_PLAYER_COLORS} activeIndex={phase.type === "question" || phase.participant === null ? undefined : phase.participant} />
          <div className="mt-3 flex items-center justify-between">
            <PartyEyebrow>Hudobný kvíz</PartyEyebrow>
            <span className="text-[10px] font-black uppercase tracking-wider text-white/30">{questionIndex + 1}/{rounds}</span>
          </div>

          <section className="party-glass relative mt-3 flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-[2.2rem] px-5 py-4">
            <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/70 to-transparent" />
            <div className="relative h-28 w-full max-w-sm shrink-0 overflow-hidden rounded-[1.6rem] border border-violet-300/20 shadow-[0_0_70px_rgba(167,139,250,.18)] sm:h-32">
              <img src={songArt} alt="Ilustrácia hudobného kvízu" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120b24]/80 via-transparent to-violet-400/10" />
              <button
                onClick={status === "playing" ? () => stop("ready") : playPreview}
                disabled={!soundAllowed || status === "loading" || status === "missing"}
                aria-label={status === "playing" ? "Zastaviť pesničku" : "Prehrať pesničku"}
                className="party-shine absolute inset-0 flex items-center justify-center transition active:scale-95 disabled:opacity-55"
              >
                <span className={`flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/40 text-3xl shadow-2xl backdrop-blur-md ${status === "loading" || status === "playing" ? "animate-pulse" : ""}`}>
                  {status === "loading" ? "⌛" : status === "playing" ? "⏹️" : played ? "🎶" : "▶️"}
                </span>
              </button>
            </div>

            <h1 className="mt-3 text-xl font-black text-white sm:text-2xl">
              {phase.type === "question" ? (played ? "Kto pozná túto pesničku?" : "Prehrajte ukážku") : phase.type === "buzzed" ? `${participantNames[phase.participant]} odpovedá` : song?.title}
            </h1>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-white/45">
              {!soundAllowed ? "Zvuky sú vypnuté. Zapnite ich v nastaveniach alebo túto skladbu preskočte." : status === "missing" ? "Pre túto skladbu poskytovatelia nenašli ukážku. Preskočte ju bez straty bodov." : status === "error" ? "Ukážku sa nepodarilo prehrať. Skúste ju znova alebo skladbu preskočte." : phase.type === "question" ? `Keď ${gameMode === "teams" ? "tím" : "hráč"} spozná skladbu, stlačí svoj bzučiak.` : phase.type === "buzzed" ? `${participantWord} povie názov aj interpreta a moderátor potom odhalí odpoveď.` : `${song?.artist} · 1 bod za názov a 1 bod za interpreta`}
            </p>
            {phase.type === "revealed" && (
              <div className="mt-3 rounded-2xl border border-violet-300/20 bg-violet-400/[.08] px-4 py-3">
                <p className="text-lg font-black text-white">{song?.title}</p>
                <p className="mt-1 text-xs font-bold text-violet-200/75">{song?.artist}</p>
                {source && <a href={source.link} target="_blank" rel="noreferrer" className="mt-2 block text-[9px] font-bold text-white/25 underline">Ukážka od hudobného poskytovateľa</a>}
              </div>
            )}
          </section>


          <div className="mt-3 shrink-0">
            {phase.type === "question" && soundAllowed && status !== "missing" && status !== "error" && (
              <div className="grid grid-cols-2 gap-2">
                {participantNames.map((name, participant) => {
                  const color = PARTY_PLAYER_COLORS[participant % PARTY_PLAYER_COLORS.length];
                  return (
                    <button
                      key={`${name}-${participant}`}
                      disabled={!played}
                      onClick={() => { stop("ready"); playFeedback("buzzer"); setPhase({ type: "buzzed", participant }); }}
                      className={`party-shine overflow-hidden rounded-2xl py-3 text-sm font-black text-white shadow-xl transition active:scale-95 disabled:opacity-30 ${participant < 2 ? "rotate-180" : ""}`}
                      style={{ background: color }}
                    >
                      🔔<span className="mt-1 block truncate px-2 text-sm">{name}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {phase.type === "question" && soundAllowed && played && status !== "missing" && status !== "error" && (
              <button onClick={() => { stop("ready"); setPhase({ type: "revealed", participant: null }); }} className="party-glass mt-3 w-full rounded-2xl py-4 text-sm font-black text-white/55 transition active:scale-95">Nikto nevie · odhaliť odpoveď</button>
            )}
            {phase.type === "question" && (!soundAllowed || status === "missing" || status === "error") && (
              <button onClick={skipUnavailable} className="party-glass w-full rounded-2xl py-5 text-base font-black text-white/70 transition active:scale-95">Preskočiť nedostupnú skladbu</button>
            )}
            {phase.type === "buzzed" && (
              <button onClick={() => setPhase({ type: "revealed", participant: phase.participant })} className="party-shine w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-5 text-base font-black text-white shadow-xl transition active:scale-95">Ukázať názov a interpreta</button>
            )}
            {phase.type === "revealed" && phase.participant === null && (
              <button onClick={() => resolve(false, false)} className="party-shine w-full rounded-2xl bg-gradient-to-r from-slate-700 to-slate-600 py-5 text-sm font-black text-white transition active:scale-95">Ďalšia pesnička · 0 bodov</button>
            )}
            {phase.type === "revealed" && phase.participant !== null && (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => resolve(false, false)} className="rounded-2xl bg-slate-700 py-4 text-sm font-black text-white transition active:scale-95">0 · Nič</button>
                <button onClick={() => resolve(true, false)} className="rounded-2xl bg-violet-700 py-4 text-sm font-black text-white transition active:scale-95">+1 · Názov</button>
                <button onClick={() => resolve(false, true)} className="rounded-2xl bg-fuchsia-700 py-4 text-sm font-black text-white transition active:scale-95">+1 · Interpret</button>
                <button onClick={() => resolve(true, true)} className="party-shine rounded-2xl bg-emerald-600 py-4 text-sm font-black text-white transition active:scale-95">+2 · Oboje</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </PartyBackdrop>
  );
}
