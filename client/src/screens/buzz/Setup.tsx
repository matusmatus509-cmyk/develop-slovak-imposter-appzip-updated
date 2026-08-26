import { useState } from "react";
import type { BuzzSettings } from "../../types";
import { Button, Chip, Shell, Toggle, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import {
  BUZZ_TARGET_MAX_SECONDS,
  BUZZ_TARGET_MIN_SECONDS,
} from "../../utils/buzzLogic";
import PlayerNamesField from "../../components/PlayerNamesField";
import GameSettingsPage from "../../components/GameSettingsPage";
import {
  defaultPlayerName,
  localizeGeneratedParticipantName,
  useLanguage,
} from "../../i18n/LanguageProvider";

// Čím širší rozsah, tým ľahšie sa podvodník skryje.
const RANGE_OPTIONS = [
  { label: "1 s — ťažké", value: 1 },
  { label: "2 s — bežné", value: 2 },
  { label: "3 s — ľahké", value: 3 },
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
  const [impostorRangeSeconds, setImpostorRangeSeconds] = useState(
    initial.impostorRangeSeconds
  );
  const [blindTiming, setBlindTiming] = useState(initial.blindTiming);

  function handleStart() {
    onStart({
      playerNames: players.map((p) => p.trim() || defaultPlayerName(language)),
      impostorRangeSeconds,
      blindTiming,
    });
  }

  return (
    <Shell className="mobile-settings mobile-settings-buzz">
      <TopBar title="Nastavenie hry" onBack={onBack} />

      <div className="flex-1 space-y-7 overflow-y-auto pb-4">
        <PlayerNamesField
          names={players}
          onChange={setPlayers}
          accent="#f43f5e"
          min={3}
          max={12}
          maxLength={16}
          nameForNew={(index) => defaultPlayerName(language, index + 1)}
          placeholderFor={(index) => defaultPlayerName(language, index + 1)}
        />

        {/* Tajný čas */}
        <section className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-300">
            <Icons.timer size={19} />
          </span>
          <div>
            <p className="text-sm font-bold">
              Tajný čas: {BUZZ_TARGET_MIN_SECONDS} – {BUZZ_TARGET_MAX_SECONDS} s
            </p>
            <p className="text-xs text-white/50">
              Vylosuje sa jedno presné číslo na dve desatinné miesta, napríklad
              5,77 s. Dostanú ho všetci okrem podvodníka.
            </p>
          </div>
        </section>

        {/* Nastavenia hry — rozsah pre podvodníka a stopovanie naslepo majú
            vlastnú stránku, aby setup obrazovka zostala krátka. */}
        <GameSettingsPage
          accent="#f43f5e"
          icon="settings"
          title="Nastavenia hry"
          summary={`${RANGE_OPTIONS.find((opt) => opt.value === impostorRangeSeconds)?.label ?? `${impostorRangeSeconds}s`} · ${blindTiming ? "naslepo" : "s časom"}`}
          description="Rozsah pre podvodníka a stopovanie naslepo"
        >
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

          {/* Toggles */}
          <section className="space-y-3">
            <Toggle
              checked={blindTiming}
              onChange={setBlindTiming}
              label="Stopovať naslepo"
              description="Hráč počas merania nevidí bežiaci čas. Bez toho je trafiť tajný čas takmer isté a hra stráca zmysel"
            />
          </section>
        </GameSettingsPage>
      </div>

      <Button fullWidth onClick={handleStart} className="mt-4">
        <span className="inline-flex items-center gap-2">Rozdať tajné zadania <Icons.timer size={18} /></span>
      </Button>
    </Shell>
  );
}
