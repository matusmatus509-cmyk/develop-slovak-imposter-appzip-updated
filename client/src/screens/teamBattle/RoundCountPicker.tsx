import { useState, type CSSProperties } from "react";
import { Icon, Icons, type IconsType } from "../../components/icons";
import { PartyBackdrop, PartyEyebrow } from "./PartyChrome";
import { partyModeArtV2 } from "../../media";

/**
 * ── Dĺžka náhodnej bitky na vlastnej obrazovke ──────────────────────────────
 *
 * Predtým sa voľba počtu kôl rozbaľovala priamo v setupe pod kartou
 * „Náhodne“, čím setup narastal a voľba sa strácala medzi ostatnými
 * nastaveniami. Teraz má vlastnú obrazovku — otvorí sa až po stlačení
 * „Hrať party hru“, presne ako výber hier pri vlastnej zostave.
 *
 * Dizajn nadväzuje na nočnú arénu: rovnaké hero, sklenené karty a CTA.
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
    highlights: ["Dvojnásobok", "Kvízové finále"],
  },
  {
    rounds: 5,
    label: "Stredná bitka",
    note: "Vyvážená dĺžka na bežný večer",
    duration: "≈ 18 min",
    accent: "#a78bfa",
    icon: "dice",
    highlights: ["Blesková výzva", "Dvojnásobok", "Kvízové finále"],
  },
  {
    rounds: 7,
    label: "Veľká bitka",
    note: "Dlhý turnaj s najviac disciplínami",
    duration: "≈ 25 min",
    accent: "#f43f5e",
    icon: "crown",
    highlights: ["Blesková výzva", "Dvojnásobok", "Kvízové finále"],
  },
];

function roundWord(count: number) {
  if (count === 1) return "kolo";
  return count < 5 ? "kolá" : "kôl";
}

export default function TeamBattleRoundCountPicker({
  initialRounds,
  onBack,
  onConfirm,
}: {
  initialRounds: number;
  onBack: () => void;
  onConfirm: (rounds: number) => void;
}) {
  const [rounds, setRounds] = useState(initialRounds);
  const selected =
    OPTIONS.find(option => option.rounds === rounds) ?? OPTIONS[1];

  return (
    <PartyBackdrop>
      <main className="mobile-settings mobile-party-settings party-battle-settings scroll-panel h-full overflow-y-auto px-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="mx-auto w-full max-w-md">
          <header className="flex items-center justify-between">
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

          <div
            className="game-setup-hero relative mt-5 h-48 overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl"
            style={{ "--setup-accent": selected.accent } as CSSProperties}
          >
            <img
              src={partyModeArtV2}
              alt=""
              className="h-full w-full object-cover transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080b13]/95 via-[#080b13]/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080b13]/85 via-transparent to-black/10" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute inset-x-5 bottom-5">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[8px] font-black uppercase tracking-[.2em] text-white/80 backdrop-blur">
                <Icons.dice size={12} /> Dĺžka bitky
              </span>
              <h1 className="max-w-[18rem] text-[2rem] font-black leading-[.98] tracking-[-.04em] text-white">
                Koľko kôl si dáte?
              </h1>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {OPTIONS.map(option => {
              const isSelected = option.rounds === rounds;
              return (
                <button
                  key={option.rounds}
                  type="button"
                  onClick={() => setRounds(option.rounds)}
                  aria-pressed={isSelected}
                  className={`round-pick ${isSelected ? "is-selected" : ""}`}
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
                    <small className="mt-1 block text-[11px] font-medium leading-snug text-white/45">
                      {option.note}
                    </small>
                    <span className="mt-2.5 flex flex-wrap gap-1.5">
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

                  <span className="round-pick-check" aria-hidden="true">
                    ✓
                  </span>
                </button>
              );
            })}
          </div>

          <section className="party-glass party-setup-panel mt-4 rounded-[1.75rem] p-5">
            <div className="flex items-start gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: `${selected.accent}26`,
                  color: selected.accent,
                }}
              >
                <Icons.sparkles size={17} />
              </span>
              <p className="text-[11px] font-medium leading-relaxed text-white/50">
                Hry aj ich poradie vyberie aplikácia náhodne. Posledné kolo je
                vždy kvízové finále za trojnásobok bodov, takže bitka sa dá
                otočiť až na konci.
              </p>
            </div>
          </section>

          <button
            onClick={() => onConfirm(rounds)}
            className="party-setup-start party-shine arena-cta mt-6 w-full overflow-hidden rounded-2xl px-6 py-5 text-base font-black uppercase tracking-[0.08em] text-white transition active:scale-[.97]"
          >
            Spustiť bitku · {rounds} {roundWord(rounds)}
          </button>
        </div>
      </main>
    </PartyBackdrop>
  );
}
