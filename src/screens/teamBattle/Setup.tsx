import { useState } from "react";
import { Icons } from "../../components/icons";
import {
  GAME_ICONS,
  GAME_LABELS,
  TEAM_COLORS,
  type GameType,
} from "../../data/teamBattle";
import { PartyBackdrop, PartyEyebrow } from "./PartyChrome";

const ALL_GAMES: GameType[] = ["pantomima", "sarady", "hadajktosom", "quiz", "pingpong"];
const DEFAULT_ORDER: GameType[] = ["pantomima", "sarady", "hadajktosom", "pingpong", "quiz"];
const MAX_ROUNDS = 15;

export default function TeamBattleSetup({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (teamNames: [string, string], games: GameType[]) => void;
}) {
  const [names, setNames] = useState<[string, string]>(["Tím A", "Tím B"]);
  const [gameOrder, setGameOrder] = useState<GameType[]>(DEFAULT_ORDER);
  const [blue, red] = TEAM_COLORS;

  function setName(index: 0 | 1, value: string) {
    setNames((current) => {
      const next = [...current] as [string, string];
      next[index] = value;
      return next;
    });
  }

  function addGame(game: GameType) {
    setGameOrder((current) => current.length < MAX_ROUNDS ? [...current, game] : current);
  }

  function removeGame(index: number) {
    setGameOrder((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function moveGame(index: number, direction: -1 | 1) {
    setGameOrder((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  const canStart = Boolean(names[0].trim() && names[1].trim() && gameOrder.length > 0);

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
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Vytvorte vlastnú bitku</h1>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/40">
              Pomenujte tímy a vyskladajte minihry presne v poradí, v akom ich chcete hrať.
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

          <section className="party-glass mt-5 rounded-[1.75rem] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Váš program</p>
                <p className="mt-1 text-sm font-bold text-white/70">Poradie minihier</p>
              </div>
              <span className="shrink-0 rounded-xl bg-fuchsia-500/15 px-3 py-2 text-xs font-black text-fuchsia-300">
                {gameOrder.length} {gameOrder.length === 1 ? "kolo" : gameOrder.length < 5 ? "kolá" : "kôl"}
              </span>
            </div>

            {gameOrder.length > 0 ? (
              <div className="mt-4 space-y-2">
                {gameOrder.map((game, index) => (
                  <div
                    key={`${game}-${index}`}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-[10px] font-black text-white/40">
                      {index + 1}
                    </span>
                    <span className="text-2xl">{GAME_ICONS[game]}</span>
                    <span className="min-w-0 flex-1 truncate text-sm font-black text-white">{GAME_LABELS[game]}</span>
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => moveGame(index, -1)}
                        disabled={index === 0}
                        aria-label="Posunúť vyššie"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-sm font-black text-white/55 transition active:scale-90 disabled:opacity-20"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveGame(index, 1)}
                        disabled={index === gameOrder.length - 1}
                        aria-label="Posunúť nižšie"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-sm font-black text-white/55 transition active:scale-90 disabled:opacity-20"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeGame(index)}
                        aria-label="Odstrániť hru"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/15 bg-red-400/[0.08] text-base font-black text-red-300/70 transition active:scale-90"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-white/15 px-4 py-6 text-center">
                <p className="text-sm font-bold text-white/40">Pridajte aspoň jednu minihru</p>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">Pridať minihru</p>
              {gameOrder.length > 0 && (
                <button onClick={() => setGameOrder([])} className="text-[10px] font-bold text-red-300/60 transition active:opacity-50">
                  Vymazať všetko
                </button>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {ALL_GAMES.map((game) => (
                <button
                  key={game}
                  onClick={() => addGame(game)}
                  disabled={gameOrder.length >= MAX_ROUNDS}
                  className="flex min-w-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-left transition active:scale-[.97] disabled:opacity-30"
                >
                  <span className="text-xl">{GAME_ICONS[game]}</span>
                  <span className="min-w-0 flex-1 truncate text-[11px] font-black text-white/65">{GAME_LABELS[game]}</span>
                  <span className="text-lg font-light text-fuchsia-300/70">+</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-[10px] leading-relaxed text-white/25">
              Hru môžete pridať aj viackrát. Maximum je {MAX_ROUNDS} kôl. Posledné kolo má trojnásobné body.
            </p>
          </section>

          <button
            onClick={() => onStart(names, gameOrder)}
            disabled={!canStart}
            className="party-shine mt-6 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-6 py-5 text-base font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_50px_rgba(168,85,247,.35)] transition active:scale-[.97] disabled:opacity-40"
          >
            Začať {gameOrder.length > 0 ? `${gameOrder.length}-kolovú` : "tímovú"} bitku
          </button>
        </div>
      </main>
    </PartyBackdrop>
  );
}
