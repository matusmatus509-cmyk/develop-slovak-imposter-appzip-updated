import { useState } from "react";
import { Icons } from "../../components/icons";
import { TEAM_COLORS } from "../../data/teamBattle";
import { PartyBackdrop, PartyEyebrow } from "./PartyChrome";

export default function TeamBattleSetup({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (teamNames: [string, string], rounds: number) => void;
}) {
  const [names, setNames] = useState<[string, string]>(["Tím A", "Tím B"]);
  const [rounds, setRounds] = useState(5);
  const [blue, red] = TEAM_COLORS;

  function setName(index: 0 | 1, value: string) {
    setNames((current) => {
      const next = [...current] as [string, string];
      next[index] = value;
      return next;
    });
  }

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
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Vytvorte svoje tímy</h1>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/40">
              Dva tímy, pestré minihry a jeden šampión večera.
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Dĺžka bitky</p>
                <p className="mt-1 text-sm font-bold text-white/70">Vyberte počet kôl</p>
              </div>
              <span className="rounded-xl bg-fuchsia-500/15 px-3 py-2 text-xs font-black text-fuchsia-300">{rounds} kôl</span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[3, 5, 7].map((value) => (
                <button
                  key={value}
                  onClick={() => setRounds(value)}
                  className={`rounded-2xl border py-3.5 transition active:scale-95 ${
                    rounds === value
                      ? "border-fuchsia-400/70 bg-gradient-to-b from-fuchsia-500/30 to-violet-600/20 text-white shadow-[0_10px_28px_rgba(168,85,247,.2)]"
                      : "border-white/10 bg-white/[0.035] text-white/40"
                  }`}
                >
                  <span className="block text-2xl font-black">{value}</span>
                  <span className="mt-1 block text-[8px] font-black uppercase tracking-[0.16em]">
                    {value === 3 ? "Rýchla" : value === 5 ? "Klasická" : "Veľká"}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-400/15 bg-amber-400/[0.07] px-4 py-3">
              <Icons.star size={16} className="shrink-0 text-amber-300" />
              <p className="text-[11px] leading-relaxed text-white/45">Finálové kolo má trojnásobnú hodnotu bodov.</p>
            </div>
          </section>

          <button
            onClick={() => onStart(names, rounds)}
            disabled={!names[0].trim() || !names[1].trim()}
            className="party-shine mt-6 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-6 py-5 text-base font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_50px_rgba(168,85,247,.35)] transition active:scale-[.97] disabled:opacity-40"
          >
            Začať tímovú bitku
          </button>
        </div>
      </main>
    </PartyBackdrop>
  );
}
