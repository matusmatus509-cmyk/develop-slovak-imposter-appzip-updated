import { useEffect, useMemo, useRef, useState } from "react";
import soundArt from "../../assets/party-sound.svg";
import { shuffle } from "../../data/teamBattle";
import { SOUND_CLUES } from "../../data/teamBattleExtras";
import { ParticipantScoreStrip, PartyBackdrop, PartyEyebrow } from "./PartyChrome";
import { makeEmptyScores, PARTY_PLAYER_COLORS, type QuickParticipantsProps } from "./quickGameShared";

type Phase = { type: "question" } | { type: "buzzed"; participant: number } | { type: "revealed"; participant: number };
type AudioStatus = "idle" | "loading" | "playing" | "ready" | "error";
const QUESTIONS_PER_ROUND = 10;
const MAX_SOUND_SECONDS = 7;

export default function SoundBuzzer({ participantNames, gameMode, onDone }: QuickParticipantsProps) {
  const deck = useMemo(() => shuffle(SOUND_CLUES).slice(0, QUESTIONS_PER_ROUND), []);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<number[]>(() => makeEmptyScores(participantNames));
  const [phase, setPhase] = useState<Phase>({ type: "question" });
  const [played, setPlayed] = useState(false);
  const [audioStatus, setAudioStatus] = useState<AudioStatus>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const clue = deck[questionIndex];
  const playerWord = gameMode === "teams" ? "tím" : "hráč";

  function stopAudio(nextStatus: AudioStatus = "ready") {
    if (stopTimerRef.current !== null) window.clearTimeout(stopTimerRef.current);
    stopTimerRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setAudioStatus(nextStatus);
  }

  useEffect(() => () => {
    if (stopTimerRef.current !== null) window.clearTimeout(stopTimerRef.current);
    audioRef.current?.pause();
  }, []);

  async function play() {
    if (audioStatus === "loading") return;
    stopAudio("loading");
    const audio = new Audio(clue.audioUrl);
    audio.preload = "auto";
    audio.volume = 0.9;
    audioRef.current = audio;
    audio.addEventListener("ended", () => {
      audioRef.current = null;
      setAudioStatus("ready");
    }, { once: true });
    try {
      await audio.play();
      setPlayed(true);
      setAudioStatus("playing");
      stopTimerRef.current = window.setTimeout(() => stopAudio("ready"), MAX_SOUND_SECONDS * 1000);
    } catch {
      audioRef.current = null;
      setAudioStatus("error");
    }
  }

  function resolve(correct: boolean) {
    if (phase.type !== "revealed") return;
    stopAudio("idle");
    const scorer = correct ? phase.participant : gameMode === "teams" && participantNames.length === 2 ? 1 - phase.participant : null;
    const nextScores = [...scores];
    if (scorer !== null) nextScores[scorer] += 1;
    setScores(nextScores);
    if (questionIndex + 1 >= deck.length) onDone(nextScores);
    else {
      setQuestionIndex((value) => value + 1);
      setPhase({ type: "question" });
      setPlayed(false);
    }
  }

  return (
    <PartyBackdrop>
      <main className="flex h-full flex-col overflow-y-auto px-4 pb-6 pt-5 text-center">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <ParticipantScoreStrip names={participantNames} scores={scores} colors={PARTY_PLAYER_COLORS} activeIndex={phase.type === "question" ? undefined : phase.participant} />
          <div className="mt-5 flex items-center justify-between">
            <PartyEyebrow>Uhádni zvuk</PartyEyebrow>
            <span className="text-[10px] font-black uppercase tracking-wider text-white/30">{questionIndex + 1}/{deck.length}</span>
          </div>

          <section className="party-glass relative mt-5 flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[2.2rem] px-6 py-7">
            <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
            <div className="relative h-40 w-full max-w-sm shrink-0 overflow-hidden rounded-[1.8rem] border border-cyan-300/20 shadow-[0_0_70px_rgba(34,211,238,.18)]">
              <img src={soundArt} alt="Ilustrácia zvukovej minihry" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07131b]/75 via-transparent to-cyan-400/10" />
              <button
                onClick={audioStatus === "playing" ? () => stopAudio("ready") : play}
                aria-label={audioStatus === "playing" ? "Zastaviť zvuk" : "Prehrať zvuk"}
                className="party-shine absolute inset-0 flex items-center justify-center transition active:scale-95"
              >
                <span className={`flex h-24 w-24 items-center justify-center rounded-full border border-white/25 bg-black/40 text-5xl shadow-2xl backdrop-blur-md ${audioStatus === "loading" || audioStatus === "playing" ? "animate-pulse" : ""}`}>
                  {audioStatus === "loading" ? "⌛" : audioStatus === "playing" ? "⏹️" : played ? "🔊" : "▶️"}
                </span>
              </button>
            </div>
            <h1 className="mt-5 text-2xl font-black text-white">
              {phase.type === "question" ? (played ? "Kto pozná tento zvuk?" : "Prehrajte skutočný zvuk") : phase.type === "buzzed" ? `${participantNames[phase.participant]} odpovedá` : clue.label}
            </h1>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/40">
              {audioStatus === "error" ? "Zvuk sa nepodarilo načítať. Skontrolujte internet a skúste ho prehrať znova." : phase.type === "question" ? `Zvuk môžete prehrať znova. Keď ho ${playerWord} spozná, stlačí svoj bzučiak.` : phase.type === "buzzed" ? `${gameMode === "teams" ? "Tím" : "Hráč"} povie odpoveď nahlas a moderátor potom odkryje správny zvuk.` : `Správna odpoveď: ${clue.label}`}
            </p>
            {phase.type === "revealed" && (
              <div className="mt-4">
                <div className="text-6xl">{clue.emoji}</div>
                <a href={clue.sourcePage} target="_blank" rel="noreferrer" className="mt-3 block max-w-xs text-[8px] font-bold leading-relaxed text-white/25 underline decoration-white/15 underline-offset-2">
                  Zvuk: {clue.credit} · {clue.license} · Wikimedia Commons
                </a>
              </div>
            )}
          </section>

          <div className="mt-4">
            {phase.type === "question" && (
              <div className="grid grid-cols-2 gap-3">
                {participantNames.map((name, participant) => {
                  const color = PARTY_PLAYER_COLORS[participant % PARTY_PLAYER_COLORS.length];
                  return <button key={`${name}-${participant}`} disabled={!played} onClick={() => { stopAudio("ready"); setPhase({ type: "buzzed", participant }); }} className="party-shine overflow-hidden rounded-2xl py-5 text-base font-black text-white shadow-xl transition active:scale-95 disabled:opacity-30" style={{ background: color }}>🔔<span className="mt-1 block truncate px-2 text-sm">{name}</span></button>;
                })}
              </div>
            )}
            {phase.type === "buzzed" && (
              <button onClick={() => setPhase({ type: "revealed", participant: phase.participant })} className="party-shine w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 py-5 text-base font-black text-white shadow-xl transition active:scale-95">Ukázať správny zvuk</button>
            )}
            {phase.type === "revealed" && (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => resolve(false)} className="rounded-2xl bg-red-700 py-5 text-base font-black text-white transition active:scale-95">✕ Nesprávne</button>
                <button onClick={() => resolve(true)} className="rounded-2xl bg-emerald-600 py-5 text-base font-black text-white transition active:scale-95">✓ Správne</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </PartyBackdrop>
  );
}
