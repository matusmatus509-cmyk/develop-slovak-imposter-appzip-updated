import { useState } from "react";
import { Icons } from "../../components/icons";
import {
  GAME_ICONS,
  GAME_LABELS,
  TEAM_COLORS,
  type GameType,
} from "../../data/teamBattle";
import { PartyBackdrop, PartyEyebrow } from "./PartyChrome";
import gameArt from "../../assets/game-art-sprite.jpg";
import forbiddenArt from "../../assets/party-forbidden.svg";
import songArt from "../../assets/party-song.svg";
import soundArt from "../../assets/party-sound.svg";
import letterArt from "../../assets/party-letter.svg";
import fiveTenArt from "../../assets/party-five-ten.svg";

const ALL_GAMES: GameType[] = [
  "pantomima", "sarady", "zakazane", "pesnicka", "zvuk",
  "pismeno", "patzadesat", "hadajktosom", "quiz", "pingpong",
];
type BattleMode = "classic" | "custom";
const GAME_ART: Record<GameType, string> = {
  pantomima: "33.333% 0%",
  sarady: "100% 0%",
  zakazane: "100% 0%",
  pesnicka: "33.333% 0%",
  zvuk: "66.666% 50%",
  pismeno: "66.666% 100%",
  patzadesat: "0% 0%",
  hadajktosom: "33.333% 50%",
  quiz: "0% 0%",
  pingpong: "0% 50%",
};
const CUSTOM_GAME_ART: Partial<Record<GameType, string>> = {
  zakazane: forbiddenArt,
  pesnicka: songArt,
  zvuk: soundArt,
  pismeno: letterArt,
  patzadesat: fiveTenArt,
};

export default function TeamBattleSetup({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (teamNames: [string, string], selection: number | GameType[]) => void;
}) {
  const [names, setNames] = useState<[string, string]>(["Tím A", "Tím B"]);
  const [mode, setMode] = useState<BattleMode>("classic");
  const [classicRounds, setClassicRounds] = useState(5);
  const [customGames, setCustomGames] = useState<GameType[]>([]);
  const [blue, red] = TEAM_COLORS;

  function setName(index: 0 | 1, value: string) {
    setNames((current) => {
      const next = [...current] as [string, string];
      next[index] = value;
      return next;
    });
  }

  function toggleCustomGame(game: GameType) {
    setCustomGames((current) => {
      const selectedIndex = current.indexOf(game);
      return selectedIndex >= 0
        ? current.filter((selectedGame) => selectedGame !== game)
        : [...current, game];
    });
  }

  const roundCount = mode === "classic" ? classicRounds : customGames.length;
  const canStart = Boolean(
    names[0].trim() && names[1].trim() && (mode === "classic" || customGames.length > 0),
  );

  return (
    <PartyBackdrop>
      <main className="h-full overflow-y-auto px-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="mx-auto w-full max-w-md">
          <header className="flex items-center justify-between">
            <button
              onClick={onBack}
              aria-label="Späť"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/70 backdrop-blur-xl transition active:scale-90"
            >
              <Icons.arrowLeft size={20} />
            </button>
            <PartyEyebrow>Party mode</PartyEyebrow>
            <div className="h-11 w-11" />
          </header>

          <section className="pb-7 pt-8 text-center">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] border border-white/15 bg-gradient-to-br from-violet-500/40 to-fuchsia-500/15 shadow-[0_20px_55px_rgba(168,85,247,.3)]">
              <Icons.sword size={39} className="text-white" />
            </div>
            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-300/70">Nastavenie arény</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Pripravte tímovú bitku</h1>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/40">
              Pomenujte tímy a vyberte si klasickú alebo vlastnú zostavu hier.
            </p>
          </section>

          <section className="space-y-3">
            {([0, 1] as const).map((index) => {
              const color = index === 0 ? blue : red;
              return (
                <label
                  key={index}
                  className="party-glass flex items-center gap-4 rounded-[1.6rem] p-4 transition focus-within:scale-[1.01]"
                  style={{ borderColor: `${color}55`, boxShadow: `0 14px 45px ${color}12` }}
                >
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black text-white"
                    style={{ background: color, boxShadow: `0 0 24px ${color}55` }}
                  >
                    {index === 0 ? "A" : "B"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[9px] font-black uppercase tracking-[0.22em]" style={{ color }}>
                      {index === 0 ? "Modrý tím" : "Červený tím"}
                    </span>
                    <input
                      value={names[index]}
                      onChange={(event) => setName(index, event.target.value)}
                      placeholder={index === 0 ? "Tím A" : "Tím B"}
                      maxLength={20}
                      className="mt-1 w-full border-0 bg-transparent p-0 text-lg font-black text-white outline-none placeholder:text-white/25"
                    />
                  </span>
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                </label>
              );
            })}
          </section>

          <section className="mt-5">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Režim bitky</p>
                <p className="mt-1 text-sm font-bold text-white/70">Ako chcete hrať?</p>
              </div>
              <span className="rounded-xl bg-fuchsia-500/15 px-3 py-2 text-xs font-black text-fuchsia-300">
                {roundCount} {roundCount === 1 ? "kolo" : roundCount < 5 ? "kolá" : "kôl"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode("classic")}
                className={`relative overflow-hidden rounded-[1.6rem] border p-5 text-left transition active:scale-[.97] ${
                  mode === "classic"
                    ? "border-fuchsia-300/65 bg-fuchsia-500/20 shadow-[0_15px_45px_rgba(168,85,247,.25)]"
                    : "border-white/10 bg-white/[0.045]"
                }`}
              >
                {mode === "classic" && <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-400 text-xs font-black text-white">✓</span>}
                <span className="text-3xl">🎲</span>
                <span className="mt-3 block text-base font-black text-white">Classic</span>
                <span className="mt-1 block text-[10px] leading-relaxed text-white/40">Automatický mix ako doteraz</span>
              </button>

              <button
                onClick={() => setMode("custom")}
                className={`relative overflow-hidden rounded-[1.6rem] border p-5 text-left transition active:scale-[.97] ${
                  mode === "custom"
                    ? "border-cyan-300/65 bg-cyan-500/15 shadow-[0_15px_45px_rgba(34,211,238,.2)]"
                    : "border-white/10 bg-white/[0.045]"
                }`}
              >
                {mode === "custom" && <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-xs font-black text-[#071318]">✓</span>}
                <span className="text-3xl">⚙️</span>
                <span className="mt-3 block text-base font-black text-white">Custom</span>
                <span className="mt-1 block text-[10px] leading-relaxed text-white/40">Vyberiete hry aj poradie</span>
              </button>
            </div>
          </section>

          {mode === "classic" ? (
            <section className="party-glass mt-4 rounded-[1.75rem] p-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-fuchsia-300/65">Classic</p>
                <p className="mt-1 text-sm font-bold text-white/70">Vyberte dĺžku bitky</p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[3, 5, 7].map((value) => (
                  <button
                    key={value}
                    onClick={() => setClassicRounds(value)}
                    className={`rounded-2xl border py-3.5 transition active:scale-95 ${
                      classicRounds === value
                        ? "border-fuchsia-400/70 bg-gradient-to-b from-fuchsia-500/30 to-violet-600/20 text-white shadow-[0_10px_28px_rgba(168,85,247,.2)]"
                        : "border-white/10 bg-white/[0.035] text-white/40"
                    }`}
                  >
                    <span className="block text-2xl font-black">{value}</span>
                    <span className="mt-1 block text-[8px] font-black uppercase tracking-[0.14em]">
                      {value === 3 ? "Rýchla" : value === 5 ? "Klasická" : "Veľká"}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-center text-[10px] leading-relaxed text-white/30">
                Hry a poradie vyberie aplikácia automaticky. Posledné kolo bude kvízové finále.
              </p>
            </section>
          ) : (
            <section className="party-glass mt-4 rounded-[1.75rem] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300/70">Custom</p>
                  <p className="mt-1 text-sm font-bold text-white/70">Klikajte v želanom poradí</p>
                </div>
                {customGames.length > 0 && (
                  <button onClick={() => setCustomGames([])} className="text-[10px] font-bold text-red-300/60 transition active:opacity-50">
                    Zrušiť výber
                  </button>
                )}
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-white/35">
                Prvá kliknutá hra bude prvá, druhá bude druhá. Kliknutím na označenú hru ju z výberu odstránite.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {ALL_GAMES.map((game) => {
                  const order = customGames.indexOf(game);
                  const selected = order >= 0;
                  return (
                    <button
                      key={game}
                      onClick={() => toggleCustomGame(game)}
                      className={`relative min-h-[8rem] overflow-hidden rounded-2xl border px-3 py-4 text-center transition active:scale-[.96] ${
                        selected
                          ? "border-cyan-300/70 shadow-[0_12px_32px_rgba(34,211,238,.2)]"
                          : "border-white/10"
                      }`}
                    >
                      <span
                        className={`absolute inset-0 bg-no-repeat transition duration-500 ${selected ? "scale-110" : "opacity-55 grayscale-[.25]"}`}
                        style={{
                          backgroundImage: `url(${CUSTOM_GAME_ART[game] ?? gameArt})`,
                          backgroundSize: CUSTOM_GAME_ART[game] ? "cover" : "400% 300%",
                          backgroundPosition: CUSTOM_GAME_ART[game] ? "center" : GAME_ART[game],
                        }}
                      />
                      <span className={`absolute inset-0 bg-gradient-to-t ${selected ? "from-cyan-950/95 via-slate-950/35" : "from-[#080b13] via-[#080b13]/45"} to-black/5`} />
                      {selected && (
                        <span className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300 text-sm font-black text-[#071318] shadow-[0_0_18px_rgba(103,232,249,.55)]">
                          {order + 1}
                        </span>
                      )}
                      <span className="absolute bottom-3 left-3 right-3 z-10 flex items-end gap-2 text-left">
                        <span className="text-2xl drop-shadow-lg">{GAME_ICONS[game]}</span>
                        <span className={`text-[11px] font-black leading-tight ${selected ? "text-white" : "text-white/70"}`}>{GAME_LABELS[game]}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {customGames.length === 0 && (
                <p className="mt-4 rounded-2xl border border-dashed border-white/15 px-4 py-3 text-center text-[11px] font-bold text-white/35">
                  Vyberte aspoň jednu minihru
                </p>
              )}
              <p className="mt-4 text-center text-[10px] leading-relaxed text-white/25">
                Posledná vybraná minihra bude finále s trojnásobnými bodmi.
              </p>
            </section>
          )}

          <button
            onClick={() => onStart(names, mode === "classic" ? classicRounds : customGames)}
            disabled={!canStart}
            className="party-shine mt-6 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-6 py-5 text-base font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_50px_rgba(168,85,247,.35)] transition active:scale-[.97] disabled:opacity-40"
          >
            Začať {mode === "classic" ? "Classic" : "Custom"} bitku
          </button>
        </div>
      </main>
    </PartyBackdrop>
  );
}
