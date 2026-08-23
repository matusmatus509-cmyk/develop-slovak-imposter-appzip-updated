import type { CSSProperties } from "react";
import type { Screen } from "../types";
/** Dizajnové pravidlo: pôvodný GitHub vzhľad — hero vizuály majú mierny presah cez atlasové okraje. */
import { forbiddenWordGameHero, fiveTenGameHero, gameArt, letterGameHero, minigameArtAtlas, musicQuizGameHero, onlyLiesGameHero, partyMinigameAtlas, songGameHero } from "../media";
import { Icons } from "./icons";

export interface GameWelcomeConfig {
  eyebrow: string;
  title: string;
  description: string;
  rule: string;
  players: string;
  duration: string;
  accent: string;
  accentSoft: string;
  deep: string;
  artPosition: string;
  art?: string;
  artAtlas?: boolean;
  artSize?: string;
  variant?: "default" | "song";
}

export const GAME_WELCOMES: Partial<Record<Screen, GameWelcomeConfig>> = {
  "truth-or-dare": {
    eyebrow: "Otázky bez filtra",
    title: "Pravda alebo výzva",
    description: "Vyber si úprimnosť alebo odvahu. O zvyšok sa postará partia.",
    rule: "Vyber režim a splň kartu",
    players: "2+ hráči",
    duration: "Bez limitu",
    accent: "#fb7185",
    accentSoft: "rgba(251,113,133,.24)",
    deep: "#2a0d1a",
    artPosition: "0% 0%",
    art: minigameArtAtlas,
    artAtlas: true,
  },
  "never-have-i-ever": {
    eyebrow: "Kto to už zažil?",
    title: "Nikdy som nikdy",
    description: "Rýchla hra, v ktorej sa aj starí kamaráti dozvedia niečo nové.",
    rule: "Zdvihni prst, ak si to urobil",
    players: "2+ hráči",
    duration: "Bez limitu",
    accent: "#34d399",
    accentSoft: "rgba(52,211,153,.22)",
    deep: "#07241d",
    artPosition: "50% 0%",
    art: minigameArtAtlas,
    artAtlas: true,
  },
  "would-you-rather": {
    eyebrow: "Dve cesty. Jedna voľba.",
    title: "Radšej by som",
    description: "Rozhodnutia, pri ktorých sa partia zaručene rozdelí na dva tábory.",
    rule: "Vyber A alebo B a obháj to",
    players: "2+ hráči",
    duration: "Bez limitu",
    accent: "#f59e0b",
    accentSoft: "rgba(245,158,11,.24)",
    deep: "#2b1704",
    artPosition: "100% 0%",
    art: minigameArtAtlas,
    artAtlas: true,
  },
  slovnarosada: {
    eyebrow: "Slová pod tlakom",
    title: "Slovné šarády",
    description: "Vysvetľuj zvolené slová bez použitia ich názvu a zbieraj body pre seba alebo tím.",
    rule: "Vysvetľuj slovo, jeho názov nepouži",
    players: "2–8 hráčov",
    duration: "30–120 s/kolo",
    accent: "#a78bfa",
    accentSoft: "rgba(167,139,250,.24)",
    deep: "#1b1035",
    artPosition: "0% 100%",
    art: partyMinigameAtlas,
    artAtlas: true,
    artSize: "400% 300%",
  },
  pingpong: {
    eyebrow: "Postreh proti času",
    title: "Slovný ping pong",
    description: "Hovor slová zo zadanej kategórie a odraz tlak späť na súpera.",
    rule: "Slovo, potom klepnutie",
    players: "2 hráči",
    duration: "Bez limitu",
    accent: "#22d3ee",
    accentSoft: "rgba(34,211,238,.22)",
    deep: "#06242c",
    artPosition: "50% 50%",
    art: minigameArtAtlas,
    artAtlas: true,
  },
  hadajktosom: {
    eyebrow: "Telefón na čelo",
    title: "Hádaj kto som",
    description: "Partia napovedá, ty hádaš. Naklonením označíš úspech alebo preskočenie.",
    rule: "Hore správne, dole preskočiť",
    players: "2–8 hráčov",
    duration: "30–120 s/kolo",
    accent: "#38bdf8",
    accentSoft: "rgba(56,189,248,.22)",
    deep: "#071f34",
    artPosition: "66.667% 100%",
    art: partyMinigameAtlas,
    artAtlas: true,
    artSize: "400% 300%",
  },
  ibanepravda: {
    eyebrow: "Pravda je zakázaná",
    title: "Iba nepravda",
    description: "Odpovedz okamžite, presvedčivo a hlavne úplne nesprávne.",
    rule: "Na odpoveď máš 4 sekundy",
    players: "2+ hráči",
    duration: "4 s/otázka",
    accent: "#f43f5e",
    accentSoft: "rgba(244,63,94,.25)",
    deep: "#2b0913",
    artPosition: "50% 56%",
    art: onlyLiesGameHero,
  },
  ktodostanebombu: {
    eyebrow: "Nikto nevie, kedy vybuchne",
    title: "Kto dostane bombu",
    description: "Povedz správne slovo a podaj mobil ďalej skôr, než príde výbuch.",
    rule: "Odpovedz a rýchlo podávaj",
    players: "2+ hráči",
    duration: "30–90 s",
    accent: "#fb923c",
    accentSoft: "rgba(251,146,60,.25)",
    deep: "#2c1106",
    artPosition: "50% 100%",
    art: minigameArtAtlas,
    artAtlas: true,
  },
  hadajemoji: {
    eyebrow: "Obrázky namiesto slov",
    title: "Hádaj emoji",
    description: "Rozlúšti filmy, osobnosti a povolania poskladané iba z emoji.",
    rule: "Najprv hádaj, potom odhaľ",
    players: "1+ hráč",
    duration: "Bez limitu",
    accent: "#facc15",
    accentSoft: "rgba(250,204,21,.23)",
    deep: "#292005",
    artPosition: "100% 100%",
    art: minigameArtAtlas,
    artAtlas: true,
  },
  "impostor-setup": {
    eyebrow: "Tajné slovo. Tajný hráč.",
    title: "Imposter",
    description: "Všetci poznajú slovo. Jeden dostane iba nápovedu a musí splynúť s partiou.",
    rule: "Diskutujte a odhaľte podvodníka",
    players: "3–12 hráčov",
    duration: "5–20 min",
    accent: "#84cc16",
    accentSoft: "rgba(132,204,22,.23)",
    deep: "#281007",
    artPosition: "33.333% 100%",
  },
  "drawing-setup": {
    eyebrow: "Jeden nevie, čo kreslí",
    title: "Imposter kreslenie",
    description: "Spoločný obrázok vzniká po jednom ťahu. Podvodník zadanie nepozná.",
    rule: "Jeden ťah, potom mobil ďalej",
    players: "3–12 hráčov",
    duration: "5–15 min",
    accent: "#c084fc",
    accentSoft: "rgba(192,132,252,.24)",
    deep: "#201035",
    artPosition: "66.666% 100%",
  },
  teambattle: {
    eyebrow: "Veľká hra na celý večer",
    title: "Party mode",
    description: "Dva tímy, viac herných disciplín a finále, ktoré môže otočiť celé skóre.",
    rule: "Vyhráva tím s najvyšším skóre",
    players: "4+ hráči",
    duration: "5–60 min",
    accent: "#8b5cf6",
    accentSoft: "rgba(139,92,246,.26)",
    deep: "#160d31",
    artPosition: "100% 100%",
  },
  zakazane: {
    eyebrow: "Vysvetľuj opatrne",
    title: "Zakázané slovo",
    description: "Opisuj hlavné slovo bez použitia štyroch zakázaných výrazov a získaj čo najviac bodov.",
    rule: "Zakázané sú aj odvodené tvary slov",
    players: "2–8 hráčov",
    duration: "30–90 s/kolo",
    accent: "#14b8a6",
    accentSoft: "rgba(20,184,166,.23)",
    deep: "#2b0d18",
    artPosition: "50% 56%",
    art: forbiddenWordGameHero,
  },
  pesnicka: {
    eyebrow: "Melódia bez textu",
    title: "Zahmkaj pesničku",
    description: "Jeden hráč hmkaním predvádza známe skladby a ostatní hádajú čo najviac názvov.",
    rule: "Hmkanie áno, slová ani názov nie",
    players: "2–8 hráčov",
    duration: "30–90 s/kolo",
    accent: "#e879f9",
    accentSoft: "rgba(232,121,249,.23)",
    deep: "#1c1039",
    artPosition: "50% 50%",
    art: songGameHero,
    variant: "song",
  },
  "hudobny-kviz": {
    eyebrow: "Spoznaj hit po pár sekundách",
    title: "Hudobný kvíz",
    description: "Aplikácia pustí ukážku známej skladby. Kto ju spozná prvý, stlačí bzučiak a háda názov aj interpreta.",
    rule: "1 bod za názov a 1 bod za interpreta",
    players: "2–4 hráči",
    duration: "2–10 min",
    accent: "#d946ef",
    accentSoft: "rgba(217,70,239,.23)",
    deep: "#240b2f",
    artPosition: "50% 50%",
    art: musicQuizGameHero,
  },
  zvuk: {
    eyebrow: "Počúvaj a bzuč",
    title: "Uhádni zvuk",
    description: "Aplikácia prehrá tajný zvuk. Hráč alebo tím, ktorý ho spozná prvý, stlačí bzučiak a odpovedá.",
    rule: "Najprv bzučiak, potom odpoveď",
    players: "2–8 hráčov",
    duration: "2–8 min",
    accent: "#2563eb",
    accentSoft: "rgba(37,99,235,.24)",
    deep: "#062630",
    artPosition: "100% 50%",
    art: partyMinigameAtlas,
    artAtlas: true,
    artSize: "400% 300%",
  },
  pismeno: {
    eyebrow: "Krátky čas na slovo",
    title: "Slovo na písmeno",
    description: "Dostaneš kategóriu a písmeno. Odpovedz skôr, než čas vyprší a bod získa súper.",
    rule: "Jedna platná odpoveď v nastavenom čase",
    players: "2–8 hráčov",
    duration: "5–15 s/odpoveď",
    accent: "#d97706",
    accentSoft: "rgba(217,119,6,.24)",
    deep: "#2b1d05",
    artPosition: "50% 50%",
    art: letterGameHero,
  },
  patzadesat: {
    eyebrow: "Päť odpovedí. Rýchla výzva.",
    title: "5 za 10",
    description: "Vymenuj päť vecí zo zadanej témy v nastavenom čase a získaj dva body pre seba alebo tím.",
    rule: "Všetkých päť odpovedí znamená +2 body",
    players: "2–8 hráčov",
    duration: "10–30 s/výzva",
    accent: "#16a34a",
    accentSoft: "rgba(22,163,74,.23)",
    deep: "#06271c",
    artPosition: "50% 50%",
    art: fiveTenGameHero,
  },
  "tic-tac-toe": {
    eyebrow: "Tri symboly v rade",
    title: "Piškvorky",
    description: "Nadčasový súboj X a O v animovanom prevedení. Hrajte vo dvojici alebo proti šikovnému robotovi.",
    rule: "Prvý hráč s tromi symbolmi v rade vyhráva",
    players: "1–2 hráči",
    duration: "1–5 min",
    accent: "#6366f1",
    accentSoft: "rgba(99,102,241,.24)",
    deep: "#061d2c",
    artPosition: "66.667% 0%",
    art: partyMinigameAtlas,
    artAtlas: true,
    artSize: "400% 300%",
  },
  battleship: {
    eyebrow: "Námorná bitka 10 × 10",
    title: "Loďky",
    description: "Dvaja hráči si na jednom mobile tajne rozmiestnia flotily a pokúsia sa potopiť súperove lode.",
    rule: "Rozmiestni lode, potom sa striedajte vo výstreloch",
    players: "2 hráči",
    duration: "10–20 min",
    accent: "#1d4ed8",
    accentSoft: "rgba(29,78,216,.25)",
    deep: "#051a2b",
    artPosition: "100% 0%",
    art: partyMinigameAtlas,
    artAtlas: true,
    artSize: "400% 300%",
  },
};

export default function GameWelcome({
  config,
  onBack,
  onStart,
}: {
  config: GameWelcomeConfig;
  onBack: () => void;
  onStart: () => void;
}) {
  const style = { "--ui-pre-accent": config.accent } as CSSProperties;

  return (
    <main className="ui ui-pre" style={style}>
      <div className="ui-pre-inner">
        {/* Obraz hry nesie celú farebnosť obrazovky — okolo neho je len tma. */}
        <div className="ui-pre-art">
          {config.art && !config.artAtlas ? (
            <img
              src={config.art}
              alt=""
              aria-hidden="true"
              className="ui-pre-media"
              style={{ objectPosition: config.artPosition }}
            />
          ) : (
            <span
              aria-hidden="true"
              className="ui-pre-media"
              style={{
                backgroundImage: `url(${config.artAtlas ? config.art : gameArt})`,
                backgroundSize:
                  config.artSize ?? (config.artAtlas ? "300% 300%" : "400% 300%"),
                backgroundPosition: config.artPosition,
              }}
            />
          )}

          <button
            type="button"
            onClick={onBack}
            aria-label="Späť"
            className="ui-back ui-pre-back"
          >
            <Icons.arrowLeft size={19} />
          </button>

          <div className="ui-pre-caption">
            <p className="ui-pre-kicker">
              <i aria-hidden="true" />
              {config.eyebrow}
            </p>
            <h1>{config.title}</h1>
          </div>
        </div>

        <section className="ui-pre-body">
          <p className="ui-pre-text">{config.description}</p>

          {/* Hráči a trvanie sú fakty, nie karty — stačí im linka a typografia. */}
          <dl className="ui-pre-facts">
            <div className="ui-pre-fact">
              <dt>Hráči</dt>
              <dd>{config.players}</dd>
            </div>
            <div className="ui-pre-fact">
              <dt>Trvanie</dt>
              <dd>{config.duration}</dd>
            </div>
          </dl>

          <p className="ui-pre-rule">
            <span aria-hidden="true">
              <Icons.sparkles size={15} />
            </span>
            {config.rule}
          </p>

          <button
            type="button"
            onClick={onStart}
            className="ui-cta"
            style={{ "--ui-cta-bg": config.accent, "--ui-cta-ink": "#111319" } as CSSProperties}
          >
            <span>
              {config.variant === "song" ? "Pripraviť hudobné kolo" : "Pripraviť hru"}
            </span>
            <span className="ui-cta-arrow" aria-hidden="true">
              <Icons.chevronRight size={18} />
            </span>
          </button>
        </section>
      </div>
    </main>
  );
}
