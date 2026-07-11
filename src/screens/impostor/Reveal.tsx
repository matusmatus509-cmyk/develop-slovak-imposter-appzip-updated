import { useState } from "react";
import type { GameSettings, RoundAssignment } from "../../types";
import { Button, Shell, TopBar } from "../../components/ui";

export default function Reveal({
  settings,
  assignment,
  onExit,
  onDone,
}: {
  settings: GameSettings;
  assignment: RoundAssignment;
  onExit: () => void;
  onDone: () => void;
}) {
  const [playerIndex, setPlayerIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const isImpostor = assignment.impostorIndexes.includes(playerIndex);
  const isLast = playerIndex === settings.playerNames.length - 1;

  function next() {
    if (isLast) {
      onDone();
      return;
    }
    setRevealed(false);
    setPlayerIndex((i) => i + 1);
  }

  return (
    <Shell>
      <TopBar
        title={`Hráč ${playerIndex + 1} / ${settings.playerNames.length}`}
        onBack={onExit}
      />

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        {!revealed ? (
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/15 bg-white/5 text-4xl">
              🤫
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                Podaj telefón hráčovi
              </p>
              <h1 className="mt-1 text-3xl font-black">
                {settings.playerNames[playerIndex]}
              </h1>
            </div>
            <p className="max-w-xs text-sm text-white/50">
              Uisti sa, že ostatní hráči sa nepozerajú na obrazovku. Ťuknutím
              nižšie zobrazíš svoju tajnú rolu.
            </p>
            <Button fullWidth onClick={() => setRevealed(true)}>
              Zobraziť moju rolu 👁️
            </Button>
          </div>
        ) : (
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${
                isImpostor
                  ? "bg-red-500/20 text-red-300"
                  : "bg-emerald-500/20 text-emerald-300"
              }`}
            >
              {settings.playerNames[playerIndex]}
            </span>

            <div
              className={`flex w-full flex-col items-center gap-5 rounded-3xl border p-8 text-center ${
                isImpostor
                  ? "border-red-500/30 bg-red-950/30"
                  : "border-emerald-500/30 bg-emerald-950/20"
              }`}
            >
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full text-4xl ${
                  isImpostor ? "bg-red-500/20" : "bg-emerald-500/20"
                }`}
              >
                {isImpostor ? "🥸" : "🙂"}
              </div>

              {isImpostor ? (
                <>
                  <h2 className="text-3xl font-black tracking-tight text-red-400">
                    PODVODNÍK
                  </h2>
                  {settings.hintsEnabled ? (
                    <div className="w-full">
                      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
                        Nápoveda
                      </p>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                        <p className="text-2xl font-black uppercase text-white">
                          {assignment.hintWord}
                        </p>
                      </div>
                      <span className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
                        {assignment.categoryIcon} {assignment.categoryName}
                      </span>
                      <p className="mt-3 text-xs leading-relaxed text-white/50">
                        Znáš nápovedu. Použi ju ako svoju prvú asociáciu v
                        kole.
                      </p>
                    </div>
                  ) : (
                    <>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
                        {assignment.categoryIcon} {assignment.categoryName}
                      </span>
                      <p className="text-xs leading-relaxed text-white/50">
                        Nepoznáš tajné slovo. Počúvaj ostatných a snaž sa
                        zapadnúť, aby ťa neodhalili.
                      </p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-black tracking-tight text-emerald-300">
                    HRÁČ
                  </h2>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Tajné slovo
                  </p>
                  <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <p className="text-3xl font-black uppercase text-white">
                      {assignment.word}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
                    {assignment.categoryIcon} {assignment.categoryName}
                  </span>
                  <p className="text-xs leading-relaxed text-white/50">
                    Povedz asociáciu súvisiacu so slovom, ale nie príliš
                    zjavnú — pomôž odhaliť podvodníka.
                  </p>
                </>
              )}
            </div>

            <Button fullWidth onClick={next}>
              {isLast ? "Začať diskusiu 💬" : "Odovzdať telefón ďalej ➡️"}
            </Button>
          </div>
        )}
      </div>
    </Shell>
  );
}
