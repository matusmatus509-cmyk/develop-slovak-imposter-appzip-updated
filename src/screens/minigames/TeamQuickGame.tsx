import { useState } from "react";
import { Icons } from "../../components/icons";
import { GAME_LABELS } from "../../data/teamBattle";
import { PartyBackdrop, PartyEyebrow } from "../teamBattle/PartyChrome";
import { ForbiddenWordGame, GuessSongGame } from "../teamBattle/PassAndPlay";
import SoundBuzzer from "../teamBattle/SoundBuzzer";
import { FiveInTenGame, LetterChallengeGame } from "../teamBattle/QuickChallenges";
import { PARTY_PLAYER_COLORS, type QuickPlayMode } from "../teamBattle/quickGameShared";
import forbiddenArt from "../../assets/party-forbidden.svg";
import songArt from "../../assets/party-song.svg";
import soundArt from "../../assets/party-sound.svg";
import letterArt from "../../assets/party-letter.svg";
import fiveTenArt from "../../assets/party-five-ten.svg";

type QuickGameType = "zakazane" | "pesnicka" | "zvuk" | "pismeno" | "patzadesat";

const GAME_ART: Record<QuickGameType, string> = {
  zakazane: forbiddenArt,
  pesnicka: songArt,
  zvuk: soundArt,
  pismeno: letterArt,
  patzadesat: fiveTenArt,
};

const GAME_ACCENT: Record<QuickGameType, string> = {
  zakazane: "#fb7185",
  pesnicka: "#a78bfa",
  zvuk: "#22d3ee",
  pismeno: "#fbbf24",
  patzadesat: "#34d399",
};

function defaultNames(mode: QuickPlayMode) {
  return mode === "teams" ? ["Tím A", "Tím B"] : ["Hráč 1", "Hráč 2", "Hráč 3", "Hráč 4"];
}

export default function TeamQuickGame({ game, onBack }: { game: QuickGameType; onBack: () => void }) {
  const [phase, setPhase] = useState<"setup" | "playing" | "result">("setup");
  const [gameMode, setGameMode] = useState<QuickPlayMode | null>(null);
  const [names, setNames] = useState<string[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [run, setRun] = useState(0);
  const accent = GAME_ACCENT[game];

  function chooseMode(mode: QuickPlayMode) {
    setGameMode(mode);
    setNames(defaultNames(mode));
    setScores([]);
    setPhase("setup");
  }

  function changeName(index: number, value: string) {
    setNames((current) => current.map((name, nameIndex) => nameIndex === index ? value : name));
  }

  function addPlayer() {
    if (names.length >= 8) return;
    setNames((current) => [...current, `Hráč ${current.length + 1}`]);
  }

  function removePlayer(index: number) {
    if (names.length <= 2) return;
    setNames((current) => current.filter((_, nameIndex) => nameIndex !== index));
  }

  function start() {
    setRun((value) => value + 1);
    setPhase("playing");
  }

  function finish(result: number[]) {
    setScores(result);
    setPhase("result");
  }

  if (phase === "playing" && gameMode) {
    const shared = { key: run, participantNames: names, gameMode, onDone: finish };
    if (game === "zakazane") return <ForbiddenWordGame {...shared} timeSeconds={60} />;
    if (game === "pesnicka") return <GuessSongGame {...shared} timeSeconds={60} />;
    if (game === "zvuk") return <SoundBuzzer {...shared} />;
    if (game === "pismeno") return <LetterChallengeGame {...shared} />;
    return <FiveInTenGame {...shared} />;
  }

  if (phase === "result" && gameMode) {
    const topScore = Math.max(...scores);
    const winners = scores.map((score, index) => score === topScore ? index : -1).filter((index) => index >= 0);
    const draw = winners.length > 1;
    return (
      <PartyBackdrop>
        <main className="flex h-full flex-col items-center overflow-y-auto px-5 py-8 text-center">
          <PartyEyebrow>Koniec minihry</PartyEyebrow>
          <div className="mt-7 text-7xl">{draw ? "🤝" : "🏆"}</div>
          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.25em] text-white/35">{GAME_LABELS[game]}</p>
          <h1 className="mt-2 text-4xl font-black text-white">{draw ? "Remíza!" : `${names[winners[0]]} vyhráva!`}</h1>
          <div className="mt-7 grid w-full max-w-sm grid-cols-2 gap-3">
            {names.map((name, index) => {
              const color = PARTY_PLAYER_COLORS[index % PARTY_PLAYER_COLORS.length];
              return (
                <div key={`${name}-${index}`} className="party-glass rounded-[1.7rem] p-4" style={{ borderColor: `${color}66` }}>
                  <p className="truncate text-[10px] font-black uppercase tracking-wider" style={{ color }}>{name}</p>
                  <p className="mt-2 text-4xl font-black text-white">{scores[index] ?? 0}</p>
                  <p className="mt-1 text-[8px] font-bold uppercase tracking-widest text-white/30">bodov</p>
                </div>
              );
            })}
          </div>
          <div className="mt-7 w-full max-w-sm space-y-3">
            <button onClick={start} className="party-shine w-full overflow-hidden rounded-2xl py-5 text-base font-black text-white shadow-xl transition active:scale-95" style={{ background: `linear-gradient(135deg, ${accent}, #7c3aed)` }}>Hrať znova</button>
            <button onClick={() => { setGameMode(null); setPhase("setup"); }} className="party-glass w-full rounded-2xl py-4 text-sm font-black text-white/70 transition active:scale-95">Zmeniť režim</button>
            <button onClick={onBack} className="w-full py-3 text-sm font-black text-white/35 transition active:scale-95">Späť na minihry</button>
          </div>
        </main>
      </PartyBackdrop>
    );
  }

  return (
    <PartyBackdrop>
      <main className="h-full overflow-y-auto px-5 pb-8 pt-5">
        <div className="mx-auto w-full max-w-md">
          <header className="flex items-center justify-between">
            <button onClick={gameMode ? () => setGameMode(null) : onBack} aria-label="Späť" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/70 backdrop-blur-xl transition active:scale-90"><Icons.arrowLeft size={20} /></button>
            <PartyEyebrow>{gameMode === "teams" ? "Tímová hra" : gameMode === "players" ? "Každý za seba" : "Vyberte režim"}</PartyEyebrow>
            <div className="h-11 w-11" />
          </header>

          <div className="relative mt-6 h-48 overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl">
            <img src={GAME_ART[game]} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080b13] via-transparent to-transparent" />
            <h1 className="absolute bottom-5 left-5 right-5 text-3xl font-black text-white">{GAME_LABELS[game]}</h1>
          </div>

          {!gameMode ? (
            <section className="mt-5 space-y-3">
              <p className="text-center text-sm leading-relaxed text-white/45">Vyberte si, či bude každý zbierať vlastné body, alebo budete hrať v dvoch tímoch.</p>
              <button onClick={() => chooseMode("players")} className="party-shine flex w-full items-center gap-4 overflow-hidden rounded-[1.7rem] border border-violet-300/20 bg-violet-500/15 p-5 text-left transition active:scale-[.98]">
                <span className="text-4xl">👤</span><span><strong className="block text-lg font-black text-white">Každý za seba</strong><small className="mt-1 block text-xs text-white/45">2 až 8 hráčov, každý má vlastné skóre</small></span>
              </button>
              <button onClick={() => chooseMode("teams")} className="party-shine flex w-full items-center gap-4 overflow-hidden rounded-[1.7rem] border border-cyan-300/20 bg-cyan-500/15 p-5 text-left transition active:scale-[.98]">
                <span className="text-4xl">👥</span><span><strong className="block text-lg font-black text-white">Tímový režim</strong><small className="mt-1 block text-xs text-white/45">Dva tímy súťažia proti sebe</small></span>
              </button>
            </section>
          ) : (
            <>
              <section className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">{gameMode === "teams" ? "Pomenujte tímy" : "Mená hráčov"}</p>
                  {gameMode === "players" && <span className="text-[10px] font-black text-white/30">{names.length}/8</span>}
                </div>
                {names.map((name, index) => {
                  const color = PARTY_PLAYER_COLORS[index % PARTY_PLAYER_COLORS.length];
                  return (
                    <label key={index} className="party-glass flex items-center gap-3 rounded-[1.5rem] p-3" style={{ borderColor: `${color}55` }}>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white" style={{ background: color }}>{gameMode === "teams" ? String.fromCharCode(65 + index) : index + 1}</span>
                      <input value={name} onChange={(event) => changeName(index, event.target.value)} maxLength={20} className="min-w-0 flex-1 border-0 bg-transparent text-base font-black text-white outline-none" />
                      {gameMode === "players" && names.length > 2 && <button type="button" onClick={() => removePlayer(index)} aria-label={`Odstrániť ${name}`} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-lg text-white/40">×</button>}
                    </label>
                  );
                })}
                {gameMode === "players" && names.length < 8 && <button onClick={addPlayer} className="party-glass w-full rounded-2xl py-4 text-sm font-black text-white/60 transition active:scale-95">+ Pridať hráča</button>}
              </section>

              <button onClick={start} disabled={names.some((name) => !name.trim())} className="party-shine mt-6 w-full overflow-hidden rounded-2xl py-5 text-base font-black uppercase tracking-wider text-white shadow-xl transition active:scale-[.97] disabled:opacity-35" style={{ background: `linear-gradient(135deg, ${accent}, #7c3aed)` }}>Začať minihru</button>
            </>
          )}
        </div>
      </main>
    </PartyBackdrop>
  );
}

export type { QuickGameType };
