import { useState } from "react";
import { Button, Shell, TopBar } from "../../components/ui";
import { TEAM_COLORS } from "../../data/teamBattle";

export default function TeamBattleSetup({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (teamNames: [string, string], rounds: number) => void;
}) {
  const [names, setNames] = useState<[string, string]>(["Tím A", "Tím B"]);
  const [rounds, setRounds] = useState(5);

  const [a, b] = TEAM_COLORS;

  function setName(idx: 0 | 1, val: string) {
    setNames((prev) => {
      const n: [string, string] = [...prev] as [string, string];
      n[idx] = val;
      return n;
    });
  }

  return (
    <Shell>
      <TopBar title="Tímová párty bitka" onBack={onBack} />

      {/* Hero */}
      <div className="mb-6 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 p-6 text-center">
        <div className="text-5xl mb-2">⚔️</div>
        <h2 className="text-xl font-black text-white">Nastavenie bitky</h2>
        <p className="mt-1 text-xs text-white/50">
          Dva tímy, viac minihier, jedno víťazstvo
        </p>
      </div>

      {/* Team names */}
      <div className="mb-5 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">
          Názvy tímov
        </p>

        {([0, 1] as const).map((idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl font-black"
              style={{ background: idx === 0 ? a : b }}
            >
              {idx === 0 ? "A" : "B"}
            </div>
            <input
              value={names[idx]}
              onChange={(e) => setName(idx, e.target.value)}
              placeholder={idx === 0 ? "Tím A" : "Tím B"}
              maxLength={20}
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base font-bold text-white placeholder-white/30 outline-none focus:border-purple-400/60"
              style={{ borderColor: `${idx === 0 ? a : b}44` }}
            />
          </div>
        ))}
      </div>

      {/* Round count */}
      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">
          Počet kôl
        </p>
        <div className="flex gap-3">
          {[3, 5, 7].map((n) => (
            <button
              key={n}
              onClick={() => setRounds(n)}
              className="flex-1 rounded-2xl border py-4 text-center font-black transition active:scale-95"
              style={
                rounds === n
                  ? { borderColor: "#a855f7", background: "#a855f720", color: "#d8b4fe" }
                  : { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }
              }
            >
              <div className="text-2xl">{n}</div>
              <div className="text-[10px] uppercase tracking-widest mt-0.5 opacity-70">
                {n === 3 ? "Krátka" : n === 5 ? "Štandard" : "Dlhá"}
              </div>
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-white/30">
          Posledné kolo je vždy finálové s 3× bodmi ⭐
        </p>
      </div>

      <Button fullWidth onClick={() => onStart(names, rounds)}>
        ⚔️ Začať bitku!
      </Button>
    </Shell>
  );
}
