import type { CSSProperties } from "react";
import { Icon, Icons, type IconsType } from "../../components/icons";
import { PartyBackdrop, PartyEyebrow } from "./PartyChrome";
import { partyModeArtV2 } from "../../media";

/**
 * ── Dĺžka náhodnej bitky na vlastnej obrazovke ──────────────────────────────
 *
 * Otvorí sa po stlačení „Hrať party hru“, keď je zvolená náhodná zostava.
 *
 * Obrazovka je zámerne bez potvrdzovacieho tlačidla: každá karta je priamo
 * štart, takže výber dĺžky je jedno klepnutie namiesto dvoch. Zmestí sa na
 * jednu obrazovku — hero sa škáluje podľa výšky displeja a karty si rozdelia
 * zvyšok, takže sa nikde neskroluje a nič sa neorezáva.
 */

interface RoundOption {
  rounds: number;
  label: string;
  note: string;
  duration: string;
  accent: string;
  icon: keyof IconsType;
  /** Špeciálne kolá, ktoré `generateBattleRounds` pre daný počet vytvorí. */
  highlights: string[];
}

/**
 * Špeciálne kolá kopírujú `generateBattleRounds` v `data/teamBattle.ts`:
 * finále je vždy posledné, dvojnásobok od 3 kôl a blesková výzva až od 5.
 */
const OPTIONS: RoundOption[] = [
  {
    rounds: 3,
    label: "Rýchla bitka",
    note: "Krátky súboj, keď máte málo času",
    duration: "≈ 10 min",
    accent: "#22d3ee",
    icon: "zap",
    highlights: ["Dvojnásobok", "Finále"],
  },
  {
    rounds: 5,
    label: "Stredná bitka",
    note: "Vyvážená dĺžka na bežný večer",
    duration: "≈ 18 min",
    accent: "#a78bfa",
    icon: "dice",
    highlights: ["Blesková výzva", "Dvojnásobok", "Finále"],
  },
  {
    rounds: 7,
    label: "Veľká bitka",
    note: "Dlhý turnaj s najviac disciplínami",
    duration: "≈ 25 min",
    accent: "#f43f5e",
    icon: "crown",
    highlights: ["Blesková výzva", "Dvojnásobok", "Finále"],
  },
];

function roundWord(count: number) {
  if (count === 1) return "kolo";
  return count < 5 ? "kolá" : "kôl";
}

export default function TeamBattleRoundCountPicker({
  onBack,
  onStart,
}: {
  onBack: () => void;
  /** Klepnutie na kartu spúšťa bitku priamo — bez ďalšieho potvrdenia. */
  onStart: (rounds: number) => void;
}) {
  return (
    <PartyBackdrop>
      <main className="mobile-settings mobile-party-settings party-battle-settings party-round-picker scroll-panel h-full overflow-y-auto px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="mx-auto flex min-h-full w-full max-w-md flex-col">
          <header className="flex shrink-0 items-center justify-between">
            <button
              onClick={onBack}
              aria-label="Späť na nastavenie arény"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/70 backdrop-blur-xl transition active:scale-90"
            >
              <Icons.arrowLeft size={20} />
            </button>
            <PartyEyebrow>Náhodná zostava</PartyEyebrow>
            <div className="exit-slot-spacer" />
          </header>

          <div className="game-setup-hero relative shrink-0 overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl">
            <img
              src={partyModeArtV2}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080b13]/95 via-[#080b13]/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080b13]/85 via-transparent to-black/10" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute inset-x-5 bottom-4">
              <span className="round-hero-badge mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[8px] font-black uppercase tracking-[.2em] text-white/80 backdrop-blur">
                <Icons.dice size={12} /> Vyber a hraj
              </span>
              <h1 className="round-hero-title max-w-[18rem] font-black leading-[.98] tracking-[-.04em] text-white">
                Koľko kôl si dáte?
              </h1>
            </div>
          </div>

          {/* Karty si rozdelia zvyšnú výšku — obrazovka tak sedí na jeden displej. */}
          <div className="round-pick-list mt-3 flex min-h-0 flex-1 flex-col justify-center gap-2.5">
            {OPTIONS.map(option => (
              <button
                key={option.rounds}
                type="button"
                onClick={() => onStart(option.rounds)}
                aria-label={`Hrať ${option.rounds} ${roundWord(option.rounds)} — ${option.label}`}
                className="round-pick"
                style={{ "--round-accent": option.accent } as CSSProperties}
              >
                <span className="round-pick-number">
                  <strong className="text-2xl font-black tabular-nums">
                    {option.rounds}
                  </strong>
                  <small className="mt-0.5 text-[7px] font-black uppercase tracking-[.16em] opacity-60">
                    {roundWord(option.rounds)}
                  </small>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <Icon
                      name={option.icon}
                      size={14}
                      style={{ color: option.accent }}
                    />
                    <strong className="text-[.95rem] font-black text-white">
                      {option.label}
                    </strong>
                  </span>
                  <small className="round-pick-note mt-1 block text-[11px] font-medium leading-snug text-white/45">
                    {option.note}
                  </small>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    <span className="round-pick-chip">
                      <Icons.clock size={9} /> {option.duration}
                    </span>
                    {option.highlights.map(highlight => (
                      <span key={highlight} className="round-pick-chip">
                        {highlight}
                      </span>
                    ))}
                  </span>
                </span>

                {/* Karta je štart, nie voľba — ikona prehrávania to hovorí naplno. */}
                <span className="round-pick-play" aria-hidden="true">
                  <Icons.play size={15} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </PartyBackdrop>
  );
}
