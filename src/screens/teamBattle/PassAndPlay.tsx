import { useEffect, useMemo, useRef, useState } from "react";
import songArt from "../../assets/party-song.svg";
import { shuffle } from "../../data/teamBattle";
import { FORBIDDEN_CARDS, SONG_CARDS, type SongCard } from "../../data/teamBattleExtras";
import { CircularTimer, PartyBackdrop, PartyEyebrow } from "./PartyChrome";
import { makeEmptyScores, PARTY_PLAYER_COLORS, type QuickParticipantsProps } from "./quickGameShared";

type PassMode = "zakazane" | "pesnicka";
type Phase = "ready" | "playing" | "team-result";

const MODE_COPY = {
  zakazane: {
    eyebrow: "Zakázané slovo",
    icon: "🚫",
    title: "Vysvetľuj bez zakázaných slov",
    instruction: "Jeden hráč opisuje hlavné slovo. Nesmie použiť žiadne zo štyroch slov na karte ani ich odvodeniny.",
    correct: "Uhádnuté",
    result: "uhádnutých slov",
    accent: "#fb7185",
  },
  pesnicka: {
    eyebrow: "Uhádni pesničku",
    icon: "🎵",
    title: "Zahmkaj melódiu bez slov",
    instruction: "Názov vidí iba hráč s mobilom. Zahmká melódiu bez textu. Za názov sa získava bod a za interpreta ďalší bod.",
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

function PassAndPlay({ participantNames, gameMode, timeSeconds, onDone, mode }: SharedProps & { mode: PassMode }) {
  const copy = MODE_COPY[mode];
  const [participant, setParticipant] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [timeLeft, setTimeLeft] = useState(timeSeconds);
  const [index, setIndex] = useState(0);
  const [turnScore, setTurnScore] = useState(0);
  const [scores, setScores] = useState<number[]>(() => makeEmptyScores(participantNames));
  const [songAwards, setSongAwards] = useState({ title: false, artist: false });
  const [preview, setPreview] = useState<{ url: string; link: string } | null>(null);
  const [previewStatus, setPreviewStatus] = useState<"loading" | "ready" | "playing" | "missing">("loading");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewTimerRef = useRef<number | null>(null);
  const participantColor = PARTY_PLAYER_COLORS[participant % PARTY_PLAYER_COLORS.length];
  const participantLabel = gameMode === "teams" ? "tím" : "hráč";
  const deck = useMemo(
    () => mode === "zakazane" ? shuffle(FORBIDDEN_CARDS) : shuffle(SONG_CARDS),
    [mode, participant],
  );
  const card = mode === "zakazane"
    ? deck[index] as (typeof FORBIDDEN_CARDS)[number]
    : deck[index] as SongCard;
  const forbiddenCard = card as (typeof FORBIDDEN_CARDS)[number];
  const songCard = card as SongCard;

  useEffect(() => {
    if (mode !== "pesnicka" || phase !== "playing") return;
    const song = songCard;
    setPreview(null);
    setPreviewStatus("loading");
    const query = encodeURIComponent(`${song.title} ${song.artist}`);
    const callbackName = `__partySongPreview_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const jsonpWindow = window as unknown as Record<string, unknown>;
    const script = document.createElement("script");
    let active = true;
    const timeout = window.setTimeout(() => {
      if (active) setPreviewStatus("missing");
    }, 7000);
    jsonpWindow[callbackName] = (result: { data?: Array<{ preview?: string; link?: string }> }) => {
      if (!active) return;
      window.clearTimeout(timeout);
      const match = result.data?.find((item) => item.preview);
      if (!match?.preview) {
        setPreviewStatus("missing");
        return;
      }
      setPreview({ url: match.preview, link: match.link ?? "https://www.deezer.com" });
      setPreviewStatus("ready");
    };
    script.src = `https://api.deezer.com/search?q=${query}&limit=3&output=jsonp&callback=${callbackName}`;
    script.onerror = () => {
      if (active) setPreviewStatus("missing");
    };
    document.head.appendChild(script);
    return () => {
      active = false;
      window.clearTimeout(timeout);
      script.remove();
      delete jsonpWindow[callbackName];
    };
  }, [mode, phase, songCard]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (mode === "pesnicka" && previewStatus === "playing") return;
    if (timeLeft <= 0) {
      audioRef.current?.pause();
      setPhase("team-result");
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [mode, phase, previewStatus, timeLeft]);

  useEffect(() => () => {
    if (previewTimerRef.current !== null) window.clearTimeout(previewTimerRef.current);
    audioRef.current?.pause();
  }, []);

  function startTurn() {
    setIndex(0);
    setTurnScore(0);
    setTimeLeft(timeSeconds);
    setSongAwards({ title: false, artist: false });
    setPhase("playing");
  }

  function nextCard(correct: boolean) {
    stopPreview();
    if (correct) setTurnScore((value) => value + 1);
    setIndex((value) => (value + 1) % deck.length);
    navigator.vibrate?.(correct ? 30 : 12);
  }

  function awardSongPart(part: "title" | "artist") {
    if (songAwards[part]) return;
    setSongAwards((current) => ({ ...current, [part]: true }));
    setTurnScore((value) => value + 1);
    navigator.vibrate?.(25);
  }

  function nextSongCard() {
    stopPreview();
    setSongAwards({ title: false, artist: false });
    setIndex((value) => (value + 1) % deck.length);
  }

  function stopPreview() {
    if (previewTimerRef.current !== null) window.clearTimeout(previewTimerRef.current);
    previewTimerRef.current = null;
    audioRef.current?.pause();
    audioRef.current = null;
    if (preview) setPreviewStatus("ready");
  }

  async function playPreview() {
    if (!preview) return;
    stopPreview();
    const audio = new Audio(preview.url);
    audio.volume = 0.55;
    audioRef.current = audio;
    try {
      await audio.play();
      setPreviewStatus("playing");
      previewTimerRef.current = window.setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        setPreviewStatus("ready");
        audioRef.current = null;
      }, 8000);
    } catch {
      setPreviewStatus("missing");
    }
  }

  function continueAfterResult() {
    const nextScores = [...scores];
    nextScores[participant] = turnScore;
    setScores(nextScores);
    if (participant + 1 < participantNames.length) {
      setParticipant((value) => value + 1);
      setPhase("ready");
    } else {
      onDone(nextScores);
    }
  }

  if (phase === "ready") {
    return (
      <PartyBackdrop>
        <main className="flex h-full flex-col items-center justify-center px-6 text-center">
          <PartyEyebrow>{copy.eyebrow}</PartyEyebrow>
          {mode === "pesnicka" ? (
            <div className="relative mt-7 h-36 w-full max-w-sm overflow-hidden rounded-[2rem] border border-violet-300/20 shadow-[0_22px_60px_rgba(0,0,0,.35)]">
              <img src={songArt} alt="Farebná ilustrácia hudobnej minihry" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0715]/80 via-transparent to-violet-500/10" />
              <span className="absolute bottom-4 left-5 text-4xl drop-shadow-lg">{copy.icon}</span>
            </div>
          ) : (
            <div className="relative mt-7 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/15 bg-white/[0.07] text-5xl shadow-[0_22px_60px_rgba(0,0,0,.35)]">
              {copy.icon}
            </div>
          )}
          <p className="mt-7 text-[10px] font-black uppercase tracking-[0.25em] text-white/35">{participant === 0 ? "Začína" : "Na rade je"}</p>
          <h1 className="mt-2 text-4xl font-black" style={{ color: participantColor }}>{participantNames[participant]}</h1>
          <section className="party-glass mt-6 max-w-sm rounded-[1.8rem] p-5">
            <h2 className="text-lg font-black text-white">{copy.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/45">{copy.instruction}</p>
            {participant > 0 && <p className="mt-3 text-xs font-bold text-white/30">Predchádzajúci {participantLabel} získal {scores[participant - 1]} bodov</p>}
          </section>
          <button
            onClick={startTurn}
            className="party-shine mt-7 w-full max-w-sm overflow-hidden rounded-2xl px-6 py-5 text-base font-black uppercase tracking-wider text-white shadow-xl transition active:scale-[.97]"
            style={{ background: `linear-gradient(135deg, ${participantColor}, ${copy.accent})` }}
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
        <main className="flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="text-6xl">{turnScore > 0 ? "🎉" : "⏱️"}</div>
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Výsledok tímu</p>
          <h1 className="mt-2 text-3xl font-black" style={{ color: participantColor }}>{participantNames[participant]}</h1>
          <div className="party-glass mt-7 w-full max-w-xs rounded-[2rem] p-8">
            <p className="text-7xl font-black tabular-nums text-white">{turnScore}</p>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-white/35">{copy.result}</p>
          </div>
          <button
            onClick={continueAfterResult}
            className="party-shine mt-7 w-full max-w-xs overflow-hidden rounded-2xl px-6 py-5 text-base font-black text-white shadow-xl transition active:scale-[.97]"
            style={{ background: participantColor }}
          >
            {participant + 1 < participantNames.length ? `${participantNames[participant + 1]} na rad` : "Výsledok kola"}
          </button>
        </main>
      </PartyBackdrop>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: `radial-gradient(circle at 50% 28%, ${copy.accent}22, transparent 45%), #070711` }}>
      <div className="party-grid pointer-events-none absolute inset-0 opacity-20" />
      <header className="relative z-10 m-3 flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.055] px-4 py-3 backdrop-blur-xl">
        <div className="min-w-0 text-left">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Hrá {participantLabel}</p>
          <p className="truncate text-base font-black" style={{ color: participantColor }}>{participantNames[participant]}</p>
        </div>
        <CircularTimer value={timeLeft} total={timeSeconds} color={timeLeft <= 10 ? "#ef4444" : copy.accent} size={82} />
        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Body</p>
          <p className="text-3xl font-black tabular-nums text-white">{turnScore}</p>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto px-5 py-3 text-center">
        <section key={index} className="party-glass party-shine w-full max-w-md overflow-hidden rounded-[2.2rem] px-6 py-8" style={{ animation: "popIn .3s ease-out both" }}>
          {mode === "zakazane" ? (
            <>
              <span className="text-4xl">{copy.icon}</span>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-rose-300/65">Vysvetli slovo</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-white">{forbiddenCard.word}</h1>
              <div className="mt-6 rounded-[1.5rem] border border-rose-400/20 bg-rose-500/[0.09] p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-rose-300/60">Nesmieš povedať</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {forbiddenCard.forbidden.map((word) => <span key={word} className="rounded-xl bg-black/20 px-2 py-2 text-sm font-black text-white/70">{word}</span>)}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="relative -mx-6 -mt-8 mb-5 h-28 overflow-hidden border-b border-violet-300/15">
                <img src={songArt} alt="Hudobná ilustrácia" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100b20] via-[#100b20]/20 to-transparent" />
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-4xl drop-shadow-lg">{copy.icon}</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300/65">Zahmkaj bez slov</p>
              <h1 className="mx-auto mt-3 max-w-sm text-3xl font-black leading-tight text-white">{songCard.title}</h1>
              <p className="mt-2 text-sm font-bold text-violet-200/60">{songCard.artist}</p>
              <div className="mt-4 flex justify-center gap-2">
                <span className={`rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-wider ${songAwards.title ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/[0.04] text-white/30"}`}>Názov {songAwards.title ? "✓" : "+1"}</span>
                <span className={`rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-wider ${songAwards.artist ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/[0.04] text-white/30"}`}>Interpret {songAwards.artist ? "✓" : "+1"}</span>
              </div>
              <div className="mt-5 rounded-2xl border border-violet-300/15 bg-violet-400/[0.07] p-3">
                <p className="text-[10px] font-bold leading-relaxed text-white/35">Nepoznáš ju podľa názvu? Prilož mobil k uchu a pusti si krátku ukážku.</p>
                <button
                  onClick={previewStatus === "playing" ? stopPreview : playPreview}
                  disabled={previewStatus === "loading" || previewStatus === "missing"}
                  className="mt-3 w-full rounded-xl border border-violet-300/20 bg-violet-400/15 px-3 py-3 text-xs font-black text-violet-100 transition active:scale-95 disabled:opacity-40"
                >
                  {previewStatus === "loading" ? "Hľadám ukážku…" : previewStatus === "missing" ? "Ukážka nie je dostupná" : previewStatus === "playing" ? "■ Zastaviť ukážku" : "▶ Pustiť 8 s ukážku"}
                </button>
                {preview && <a href={preview.link} target="_blank" rel="noreferrer" className="mt-2 block text-[8px] font-bold uppercase tracking-wider text-white/20">Ukážka cez Deezer</a>}
              </div>
              {previewStatus === "playing" && <p className="mt-2 text-[9px] font-black uppercase tracking-wider text-violet-200/60">Čas je počas ukážky pozastavený</p>}
              <p className="mt-4 text-xs font-bold text-white/30">Mobil vidí iba hráč, ktorý hmkanie predvádza.</p>
            </>
          )}
        </section>
      </main>

      {mode === "pesnicka" ? (
        <footer className="relative z-10 grid shrink-0 grid-cols-3 gap-2 px-4 pb-7 pt-3">
          <button onClick={nextSongCard} className="party-glass rounded-2xl py-4 text-xs font-black text-white/55 transition active:scale-95">Ďalšia →</button>
          <button onClick={() => awardSongPart("title")} disabled={songAwards.title} className="party-shine overflow-hidden rounded-2xl bg-violet-600 py-4 text-xs font-black text-white shadow-lg transition active:scale-95 disabled:bg-emerald-700 disabled:opacity-70">{songAwards.title ? "✓ Názov" : "+1 Názov"}</button>
          <button onClick={() => awardSongPart("artist")} disabled={songAwards.artist} className="party-shine overflow-hidden rounded-2xl bg-fuchsia-600 py-4 text-xs font-black text-white shadow-lg transition active:scale-95 disabled:bg-emerald-700 disabled:opacity-70">{songAwards.artist ? "✓ Interpret" : "+1 Interpret"}</button>
        </footer>
      ) : (
        <footer className="relative z-10 flex shrink-0 gap-3 px-4 pb-7 pt-3">
          <button onClick={() => nextCard(false)} className="party-glass flex-1 rounded-2xl py-5 text-sm font-black text-white/55 transition active:scale-95">Preskočiť</button>
          <button onClick={() => nextCard(true)} className="party-shine flex-1 overflow-hidden rounded-2xl bg-emerald-600 py-5 text-sm font-black text-white shadow-lg transition active:scale-95">✓ {copy.correct} +1</button>
        </footer>
      )}
    </div>
  );
}
