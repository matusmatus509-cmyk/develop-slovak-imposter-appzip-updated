import { Icons } from "./icons";

/**
 * Jediný spôsob, ako odísť z hry, dostupný v každej hre.
 *
 * Je to krížik, nie text: v hre má ustúpiť do pozadia a text „Odísť" bol na
 * úzkych telefónoch tak široký, že zasahoval do stredu hlavičky.
 *
 * Prečo krížik v kruhu: obrazovky, kde telefón leží na stole a hráči sedia z
 * dvoch strán (hudobný kvíz, party kvíz, slovný ping-pong), sú otočené o 180°
 * pre protistranu. Kruh s krížikom vyzerá po otočení rovnako, takže jedno
 * tlačidlo obslúži obe strany a nemusí sa zdvojovať.
 *
 * Miesto pod tlačidlom si rezervujú hlavičky cez `--exit-slot` a triedu
 * `.exit-slot-gap` (index.css). Bez tej rezervácie by tlačidlo sedelo na
 * obsahu — presne to sa dialo predtým, keď kradlo ťapy bzučiaku protihráča v
 * hudobnom kvíze.
 *
 * z-index 45 je zámerne NAD hlavičkou (30) a navigáciou (40), ale POD
 * celoobrazovkovými prekrytiami (50 a viac). Predchádzajúca hodnota 100 ho
 * nechávala presvitať cez koncové obrazovky a modály.
 */
export function ExitGameButton({ onExit }: { onExit: () => void }) {
  return (
    <button
      type="button"
      onClick={onExit}
      className="exit-game-button"
      aria-label="Odísť z hry"
      title="Odísť z hry"
    >
      <Icons.x size={19} />
    </button>
  );
}
