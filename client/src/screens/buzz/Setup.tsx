import { useState } from "react";
import type { BuzzSettings } from "../../types";
import { Button, Chip, Shell, Toggle, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import {
  defaultPlayerName,
  localizeGeneratedParticipantName,
  useLanguage,
} from "../../i18n/LanguageProvider";

// Okno, z ktorého sa losuje tajný čas kola. Kratšie časy sa trafia ľahšie,
// dlhšie rozhádžu výsledky viac a podvodník sa v nich lepšie skryje.
const TARGET_WINDOWS = [
  { label: "3 – 6 s", min: 3, max: 6 },
  { label: "5 – 10 s", min: 5, max: 10 },
  { label: "8 – 15 s", min: 8, max: 15 },
  { label: "10 – 20 s", min: 10, max: 20 },
];

// Čím širší rozsah, tým ľahšie sa podvodník skryje.
const RANGE_OPTIONS = [
  { label: "1 s — ťažké", value: 1 },
  { label: "2 s — bežné", value: 2 },
  { label: "3 s — ľahké", value: 3 },
];

const DISCUSSION_OPTIONS = [
  { label: "30 s", value: 30 },
  { label: "60 s", value: 60 },
  { label: "90 s", value: 90 },
  { label: "Bez limitu", value: 0 },
];

export default function Setup({
  initial,
  onBack,
  onStart,
}: {
  initial: BuzzSettings;
  onBack: () => void;
  onStart: (settings: BuzzSettings) => void;
}) {
  const { language } = useLanguage();
  const [players, setPlayers] = useState<string[]>(() =>
    initial.playerNames.map((name) => localizeGeneratedParticipantName(name, language)),
  );
  const [targetMinSeconds, setTargetMinSeconds] = useState(initial.targetMinSeconds);
  const [targetMaxSeconds, setTargetMaxSeconds] = useState(initial.targetMaxSeconds);
  const [impostorRangeSeconds, setImpostorRangeSeconds] = useState(
    initial.impostorRangeSeconds
  );
  const [blindTiming, setBlindTiming] = useState(initial.blindTiming);
  const [discussionSeconds, setDiscussionSeconds] = useState(initial.discussionSeconds);

  function addPlayer() {
    if (players.length >= 12) return;
    setPlayers([...players, defaultPlayerName(language, players.length + 1)]);
  }

  function removePlayer(index: number) {
    if (players.length <= 3) return;
    setPlayers(players.filter((_, i) => i !== index));
  }

  function updatePlayer(index: number, value: string) {
    setPlayers(players.map((p, i) => (i === index ? value : p)));
  }

  function handleStart() {
    onStart({
      playerNames: players.map((p) => p.trim() || defaultPlayerName(language)),
      targetMinSeconds,
      targetMaxSeconds,
      impostorRangeSeconds,
      blindTiming,
      discussionSeconds,
    });
  }

  return (
    <Shell className="mobile-settings mobile-settings-buzz">
      <TopBar title="Nastavenie hry" onBack={onBack} />

      <div className="flex-1 space-y-7 overflow-y-auto pb-4">
        {/* Players */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-white/70">
              Hráči ({players.length})
            </h2>
            <button
              onClick={addPlayer}
              disabled={players.length >= 12}
              className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold disabled:opacity-30"
            >
              + Pridať
            </button>
          </div>
          <div className="space-y-2">
            {players.map((name, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-xs font-bold">
                  {i + 1}
                </span>
                <input
                  value={name}
                  onChange={(e) => updatePlayer(i, e.target.value)}
                  className="flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-white/30"
                  placeholder={defaultPlayerName(language, i + 1)}
                  maxLength={16}
                />
                <button
                  onClick={() => removePlayer(i)}
                  disabled={players.length <= 3}
                  className="text-white/30 disabled:opacity-20"
                >
                  <Icons.x size={18} />
                </button>
              </div>
            ))}
          </div>
          {players.length <= 3 && (
            <p className="mt-2 text-xs text-white/40">
              Minimálny počet hráčov je 3.
            </p>
          )}
        </section>

        {/* Tajný čas */}
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/70">
            Tajný čas kola
          </h2>
          <div className="flex flex-wrap gap-2">
            {TARGET_WINDOWS.map((opt) => (
              <Chip
                key={opt.label}
                active={targetMinSeconds === opt.min && targetMaxSeconds === opt.max}
                onClick={() => {
                  setTargetMinSeconds(opt.min);
                  setTargetMaxSeconds(opt.max);
                }}
              >
                {opt.label}
              </Chip>
            ))}
          </div>
          <p className="mt-2 text-xs text-white/40">
            Z tohto okna sa vylosuje jedno presné číslo na dve desatinné miesta,
            napríklad 5,77 s. Dostanú ho všetci hráči okrem podvodníka.
          </p>
        </section>

        {/* Rozsah podvodníka */}
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/70">
            Rozsah pre podvodníka
          </h2>
          <div className="flex flex-wrap gap-2">
            {RANGE_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                active={impostorRangeSeconds === opt.value}
                onClick={() => setImpostorRangeSeconds(opt.value)}
              >
                {opt.label}
              </Chip>
            ))}
          </div>
          <p className="mt-2 text-xs text-white/40">
            Podvodník nedostane presné číslo, iba takto široký rozsah — napríklad
            5 – 7 s. Musí preto blafovať.
          </p>
        </section>

        {/* Diskusia */}
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/70">
            Čas na diskusiu
          </h2>
          <div className="flex flex-wrap gap-2">
            {DISCUSSION_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                active={discussionSeconds === opt.value}
                onClick={() => setDiscussionSeconds(opt.value)}
              >
                {opt.label}
              </Chip>
            ))}
          </div>
        </section>

        {/* Toggles */}
        <section className="space-y-3">
          <Toggle
            checked={blindTiming}
            onChange={setBlindTiming}
            label="Stopovať naslepo"
            description="Hráč počas merania nevidí bežiaci čas. Bez toho je trafiť tajný čas takmer isté a hra stráca zmysel"
          />
        </section>
      </div>

      <Button fullWidth onClick={handleStart} className="mt-4">
        <span className="inline-flex items-center gap-2">Rozdať tajné zadania <Icons.timer size={18} /></span>
      </Button>
    </Shell>
  );
}
