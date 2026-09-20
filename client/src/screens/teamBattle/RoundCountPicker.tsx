import { Icons } from "../../components/icons";

/**
 * ── Dĺžka náhodnej bitky ────────────────────────────────────────────────────
 *
 * Otvorí sa po stlačení „Vybrať dĺžku bitky", keď je zvolená náhodná zostava.
 *
 * Obrazovka je zámerne bez potvrdzovacieho tlačidla: každý riadok je priamo
 * štart, takže výber dĺžky je jedno klepnutie namiesto dvoch.
 *
 * Dizajn beží na `.ui` systéme rovnako ako nastavenie a výber minihier. Tri
 * možnosti mali predtým tri vlastné farby (tyrkysová, fialová, ružová), čo
 * naznačovalo významový rozdiel — v skutočnosti sa líšia len počtom kôl, a ten
 * nesie číslo. Akcent preto nesie len kruh so štartom.
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
    highlights: ["Dvojnásobok", "Finále"],
  },
  {
    rounds: 5,
    label: "Stredná bitka",
    note: "Vyvážená dĺžka na bežný večer",
    duration: "cca 18 min",
    highlights: ["Blesková výzva", "Dvojnásobok", "Finále"],
  },
  {
    rounds: 7,
    label: "Veľká bitka",
    note: "Dlhý turnaj s najviac disciplínami",
    duration: "cca 25 min",
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
  /** Klepnutie na riadok spúšťa bitku priamo — bez ďalšieho potvrdenia. */
  onStart: (rounds: number) => void;
}) {
  return (
    <main className="ui ui-party ui-screen scroll-panel">
      <div className="ui-wrap ui-fill">
        <div className="ui-bar">
          <button
            type="button"
            onClick={onBack}
            aria-label="Späť na nastavenie bitky"
            className="ui-back"
          >
            <Icons.arrowLeft size={19} />
          </button>
          <span className="ui-bar-title">Náhodná zostava</span>
        </div>

        <header className="ui-head">
          <h1 className="ui-title">Koľko kôl si dáte?</h1>
          <p className="ui-lead">
            Minihry aj ich poradie vyžrebuje aplikácia. Klepnutie na dĺžku
            bitku hneď spustí.
          </p>
        </header>

        {/* Zoznam si vezme zvyšnú výšku, takže obrazovka nekončí prázdnou
            plochou pod poslednou možnosťou. */}
        <div className="ui-fill-body">
          {OPTIONS.map(option => (
            <button
              key={option.rounds}
              type="button"
              onClick={() => onStart(option.rounds)}
              aria-label={`Hrať ${option.rounds} ${roundWord(option.rounds)} — ${option.label}`}
              className="ui-pickrow"
            >
              <span className="ui-pickrow-num">
                <strong>{option.rounds}</strong>
                <small>{roundWord(option.rounds)}</small>
              </span>

              <span className="min-w-0 flex-1">
                <span className="ui-pickrow-name">{option.label}</span>
                <span className="ui-pickrow-note">{option.note}</span>
                <span className="ui-pickrow-chips">
                  <span className="ui-chip">{option.duration}</span>
                  {option.highlights.map(highlight => (
                    <span key={highlight} className="ui-chip">
                      {highlight}
                    </span>
                  ))}
                </span>
              </span>

              {/* Riadok je štart, nie voľba — ikona prehrávania to hovorí naplno. */}
              <span className="ui-pickrow-go" aria-hidden="true">
                <Icons.play size={14} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
