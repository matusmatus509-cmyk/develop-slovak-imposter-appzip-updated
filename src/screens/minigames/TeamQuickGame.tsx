import { useState } from "react";
import { Icons } from "../../components/icons";
import { GAME_LABELS, TEAM_COLORS } from "../../data/teamBattle";
import { PartyBackdrop, PartyEyebrow } from "../teamBattle/PartyChrome";
import { ForbiddenWordGame, GuessSongGame } from "../teamBattle/PassAndPlay";
import SoundBuzzer from "../teamBattle/SoundBuzzer";
import { FiveInTenGame, LetterChallengeGame } from "../teamBattle/QuickChallenges";
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

export default function TeamQuickGame({ game, onBack }: { game: QuickGameType; onBack: () => void }) {
  const [phase, setPhase] = useState<"setup" | "playing" | "result">("setup");
  const [names, setNames] = useState<[string, string]>(["Tím A", "Tím B"]);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [run, setRun] = useState(0);
  const [blue, red] = TEAM_COLORS;
  const accent = GAME_ACCENT[game];

  function changeName(index: 0 | 1, value: string) {
    setNames((current) => {
      const next = [...current] as [string, string];
      next[index] = value;
      return next;
    });
  }

  function start() {
    setRun((value) => value + 1);
    setPhase("playing");
  }

  function finish(result: [number, number]) {
    setScores(result);
    setPhase("result");
  }

  if (phase === "playing") {
    const shared = { key: run, teamNames: names, onDone: finish };
    if (game === "zakazane") return <ForbiddenWordGame {...shared} timeSeconds={60} />;
    if (game === "pesnicka") return <GuessSongGame {...shared} timeSeconds={60} />;
    if (game === "zvuk") return <SoundBuzzer {...shared} />;
    if (game === "pismeno") return <LetterChallengeGame {...shared} />;
    return <FiveInTenGame {...shared} />;
  }

  if (phase === "result") {
    const draw = scores[0] === scores[1];
    const winner: 0 | 1 = scores[0] >= scores[1] ? 0 : 1;
    return (
      <PartyBackdrop>
        <main className="flex h-full flex-col items-center justify-center overflow-y-auto px-5 py-8 text-center">
          <PartyEyebrow>Koniec minihry</PartyEyebrow>
          <div className="mt-7 text-7xl">{draw ? "🤝" : "🏆"}</div>
          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.25em] text-white/35">{GAME_LABELS[game]}</p>
          <h1 className="mt-2 text-4xl font-black text-white">{draw ? "Remíza!" : `${names[winner]} vyhráva!`}</h1>
          <div className="mt-7 grid w-full max-w-sm grid-cols-2 gap-3">
            {([0, 1] as const).map((index) => {
              const color = index === 0 ? blue : red;
              return (
                <div key={index} className="party-glass rounded-[1.7rem] p-5" style={{ borderColor: `${color}66` }}>
                  <p className="truncate text-xs font-black uppercase tracking-wider" style={{ color }}>{names[index]}</p>
                  <p className="mt-2 text-5xl font-black text-white">{scores[index]}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/30">bodov</p>
                </div>
              );
            })}
          </div>
          <div className="mt-7 w-full max-w-sm space-y-3">
            <button onClick={start} className="party-shine w-full overflow-hidden rounded-2xl py-5 text-base font-black text-white shadow-xl transition active:scale-95" style={{ background: `linear-gradient(135deg, ${accent}, #7c3aed)` }}>Hrať znova</button>
            <button onClick={onBack} className="party-glass w-full rounded-2xl py-4 text-sm font-black text-white/55 transition active:scale-95">Späť na minihry</button>
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
            <button onClick={onBack} aria-label="Späť" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/70 backdrop-blur-xl transition active:scale-90"><Icons.arrowLeft size={20} /></button>
            <PartyEyebrow>Tímová minihra</PartyEyebrow>
            <div className="h-11 w-11" />
          </header>

          <div className="relative mt-6 h-52 overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl">
            <img src={GAME_ART[game]} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080b13] via-transparent to-transparent" />
            <h1 className="absolute bottom-5 left-5 right-5 text-3xl font-black text-white">{GAME_LABELS[game]}</h1>
          </div>

          <section className="mt-5 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Pomenujte tímy</p>
            {([0, 1] as const).map((index) => {
              const color = index === 0 ? blue : red;
              return (
                <label key={index} className="party-glass flex items-center gap-4 rounded-[1.6rem] p-4" style={{ borderColor: `${color}55` }}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black text-white" style={{ background: color }}>{index === 0 ? "A" : "B"}</span>
                  <input value={names[index]} onChange={(event) => changeName(index, event.target.value)} maxLength={20} className="min-w-0 flex-1 border-0 bg-transparent text-lg font-black text-white outline-none" />
                </label>
              );
            })}
          </section>

          <button onClick={start} disabled={!names[0].trim() || !names[1].trim()} className="party-shine mt-6 w-full overflow-hidden rounded-2xl py-5 text-base font-black uppercase tracking-wider text-white shadow-xl transition active:scale-[.97] disabled:opacity-35" style={{ background: `linear-gradient(135deg, ${accent}, #7c3aed)` }}>Začať minihru</button>
        </div>
      </main>
    </PartyBackdrop>
  );
}

export type { QuickGameType };
