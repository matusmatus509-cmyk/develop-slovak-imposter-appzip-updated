import type { CSSProperties } from "react";
import { Icon, Icons, type IconsType } from "../../components/icons";
import { PartyBackdrop, PartyEyebrow } from "./PartyChrome";
import { partyModeArtV2 } from "../../media";

/**
 * ── Dĺžka náhodnej bitky na vlastnej obrazovke ──────────────────────────────
 *
 * Otvorí sa po stlačení „Vybrať dĺžku bitky", keď je zvolená náhodná zostava.
 *
 * Obrazovka je zámerne bez potvrdzovacieho tlačidla: každá karta je priamo
 * štart, takže výber dĺžky je jedno klepnutie namiesto dvoch. Zmestí sa na
 * jednu obrazovku — hero sa škáluje podľa výšky displeja a karty si rozdelia
 * zvyšok, takže sa nikde neskroluje a nič sa neorezáva.
 *
 * Farby kariet idú od chladnej k horúcej: modrá (krátka) → tyrkysová (stredná)
 * → červená (dlhý turnaj). Odtieň tak nesie dĺžku, nie dekoráciu, a končí na
 * tej istej dvojici, o ktorej je celý Party mode — modrý a červený tím.
 */

interface RoundOption {
  rounds: number;
  label: string;
  note: string;
  /**
   * Odhadovaná dĺžka. Zámerne „cca", nie znak „≈" — použitý font preň nemá
   * glyf a vykreslil by prázdny štvorček.
   */
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
    duration: "cca 10 min",
    accent: "#4f9bff",
    icon: "zap",
    highlights: ["Dvojnásobok", "Finále"],
  },
  {
    rounds: 5,
    label: "Stredná bitka",
    note: "Vyvážená dĺžka na bežný večer",
    duration: "cca 18 min",
    accent: "#2dd4bf",
    icon: "dice",
    highlights: ["Blesková výzva", "Dvojnásobok", "Finále"],
  },
  {
    rounds: 7,
    label: "Veľká bitka",
    note: "Dlhý turnaj s najviac disciplínami",
    duration: "cca 25 min",
    accent: "#ff6b6b",
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
      {/* fit-or-scroll: obrazovka je navrhnutá na jeden displej, na extrémne
          nízkych displejoch radšej tichý scroll než odrezaný obsah. */}
      <main className="party-round-screen fit-or-scroll flex h-full flex-col overflow-hidden px-5 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-[max(0.9rem,env(safe-area-inset-top))]">
        <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col">
          <header className="flex shrink-0 items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              aria-label="Späť na nastavenie bitky"
              className="party-setup-back flex items-center justify-center rounded-2xl text-white/70 transition active:scale-90"
            >
              <Icons.arrowLeft size={21} />
            </button>
            <PartyEyebrow>Náhodná zostava</PartyEyebrow>
            <div className="exit-slot-spacer" />
          </header>

          {/* Hero s obrázkom arény — rovnaké pozadie ako v nastaveniach. */}
          <div className="party-round-hero relative mt-3 shrink-0 overflow-hidden">
            <img src={partyModeArtV2} alt="" className="h-full w-full object-cover" />
            <span className="party-setup-hero-veil" aria-hidden="true" />
            <div className="party-setup-hero-copy">
              <span className="party-setup-kicker">
                <Icons.dice size={13} /> Vyber a hraj
              </span>
              <h1 className="party-round-title">Koľko kôl si dáte?</h1>
            </div>
          </div>

          {/* Karty si rozdelia zvyšnú výšku — obrazovka tak sedí na jeden displej. */}
          <div className="mt-3 flex min-h-0 flex-1 flex-col justify-center gap-2.5">
            {OPTIONS.map(option => (
              <button
                key={option.rounds}
                type="button"
                onClick={() => onStart(option.rounds)}
                aria-label={`Hrať ${option.rounds} ${roundWord(option.rounds)} — ${option.label}`}
                className="party-round-pick"
                style={{ "--round-accent": option.accent } as CSSProperties}
              >
                <span className="party-round-number">
                  <strong>{option.rounds}</strong>
                  <small>{roundWord(option.rounds)}</small>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="party-round-name">
                    <Icon name={option.icon} size={16} />
                    {option.label}
                  </span>
                  <small className="party-round-note">{option.note}</small>
                  <span className="party-round-chips">
                    <span className="party-round-chip">{option.duration}</span>
                    {option.highlights.map(highlight => (
                      <span key={highlight} className="party-round-chip">
                        {highlight}
                      </span>
                    ))}
                  </span>
                </span>

                {/* Karta je štart, nie voľba — ikona prehrávania to hovorí naplno. */}
                <span className="party-round-play" aria-hidden="true">
                  <Icons.play size={17} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </PartyBackdrop>
  );
}
