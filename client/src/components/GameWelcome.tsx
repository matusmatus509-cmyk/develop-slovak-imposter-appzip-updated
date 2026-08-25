import type { CSSProperties } from "react";
import type { Screen } from "../types";
/** Dizajnové pravidlo: pôvodný GitHub vzhľad — hero vizuály majú mierny presah cez atlasové okraje. */
import { fiveTenGameHero, gameArt, letterGameHero, minigameArtAtlas, musicQuizGameHero, musicQuizGameHeroWide, partyMinigameAtlas, songGameHero } from "../media";
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
  /** Voliteľná verzia na šírku pre uvítaciu obrazovku — kartičky v menu
   *  a výbere hier zostávajú na `art`, tie sú narezané na výšku. */
  artWide?: string;
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
    // Neónové 3D masky z atlasu — motív pretvárky a najbližší dostupný štýl
    // k požadovanému obrázku. Hra už nezdieľa obrázok s kvízovým duelom.
    artPosition: "0% 100%",
    art: minigameArtAtlas,
    artAtlas: true,
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
    // Neónové 3D bubliny s kartou z atlasu — najbližšie k požadovanému štýlu
    // karty so zakázanými výrazmi, aké je v repozitári dostupné.
    artPosition: "0% 50%",
    art: minigameArtAtlas,
    artAtlas: true,
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
    // Vinyl so slúchadlami na mixpulte — presne ten obrázok, ktorý má hra mať.
    // Uvítacia obrazovka je široká, takže dostáva `artWide` verziu 1536×1024;
    // kartička v menu je na výšku a zostáva na pôvodnej verzii 1113×1414.
    artPosition: "50% 50%",
    art: musicQuizGameHero,
    artWide: musicQuizGameHeroWide,
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
  const style = {
    "--welcome-accent": config.accent,
    "--welcome-soft": config.accentSoft,
    "--welcome-deep": config.deep,
  } as CSSProperties;

  return (
    <main
      className={`game-welcome relative h-[100dvh] overflow-hidden text-white ${config.variant === "song" ? "game-welcome-song" : ""}`}
      style={{ ...style, background: `linear-gradient(180deg, ${config.deep}, #080b10 68%)` }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_50%_5%,var(--welcome-soft),transparent_38%)]" />

      <div className="game-welcome-content relative mx-auto flex h-full w-full max-w-lg flex-col px-4 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-[max(.75rem,env(safe-area-inset-top))]">
        <div className={`game-welcome-hero relative mb-3 min-h-0 basis-0 grow-[1.25] shrink overflow-hidden rounded-[26px] border border-white/12 shadow-2xl animate-welcome-reveal ${config.variant === "song" ? "game-welcome-song-hero" : ""}`}>
          {config.artWide ? (
            <img
              src={config.artWide}
              alt=""
              className="absolute inset-0 h-full w-full scale-[1.06] object-cover saturate-[.9]"
              style={{ objectPosition: config.artPosition }}
            />
          ) : config.art && !config.artAtlas ? (
            <img
              src={config.art}
              alt=""
              className="absolute inset-0 h-full w-full scale-[1.06] object-cover saturate-[.9]"
              style={{ objectPosition: config.artPosition }}
            />
          ) : (
            <div
              className="absolute inset-0 scale-[1.07] bg-no-repeat"
              style={{
                backgroundImage: `url(${config.artAtlas ? config.art : gameArt})`,
                backgroundSize: config.artSize ?? (config.artAtlas ? "300% 300%" : "400% 300%"),
                backgroundPosition: config.artPosition,
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-[#080b12]" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[var(--welcome-soft)] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,.12),transparent_28%,transparent_70%,rgba(0,0,0,.35))]" />
          {config.variant === "song" && <div className="song-welcome-equalizer pointer-events-none absolute bottom-[7.3rem] right-5 flex h-10 items-end gap-1 opacity-80" aria-hidden="true">{[16, 28, 20, 36, 25, 32, 18].map((height, index) => <i key={index} style={{ height }} />)}</div>}

          <button
            type="button"
            onClick={onBack}
            aria-label="Späť"
            className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/16 bg-[#0d1218]/80 text-white shadow-lg transition hover:bg-[#18202a] active:scale-90"
          >
            <Icons.chevronLeft size={23} />
          </button>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/12 bg-[#0d1218]/70 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: config.accent }} />
              <span className="text-[10px] font-black uppercase tracking-[.19em] text-white/75">{config.eyebrow}</span>
            </div>
            <h1 className="max-w-[360px] text-[2.35rem] font-extrabold leading-[.96] tracking-[-.045em] drop-shadow-xl">{config.title}</h1>
          </div>
        </div>

        <section className="game-welcome-details flex min-h-0 basis-0 grow flex-col justify-between gap-2 animate-welcome-content">
          <p className="game-welcome-description text-[13px] font-medium leading-[1.5] text-white/62">{config.description}</p>

          <div className="game-welcome-stats grid grid-cols-2 gap-2">
            <div className="game-welcome-stat rounded-2xl border border-white/10 bg-[#121922]/90 px-3.5 py-3">
              <p className="text-[9px] font-black uppercase tracking-[.17em] text-white/35">Hráči</p>
              <p className="mt-1 text-sm font-extrabold text-white/85">{config.players}</p>
            </div>
            <div className="game-welcome-stat rounded-2xl border border-white/10 bg-[#121922]/90 px-3.5 py-3">
              <p className="text-[9px] font-black uppercase tracking-[.17em] text-white/35">Trvanie</p>
              <p className="mt-1 text-sm font-extrabold text-white/85">{config.duration}</p>
            </div>
          </div>

          <div className="game-welcome-rule flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0d131a]/75 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: config.accentSoft, color: config.accent }}>
              <Icons.sparkles size={18} />
            </span>
            <p className="text-xs font-bold leading-snug text-white/68">{config.rule}</p>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="flex min-h-14 w-full items-center justify-between rounded-xl border border-white/10 px-5 text-left font-extrabold text-white shadow-xl transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[.98]"
            style={{ background: `linear-gradient(135deg, ${config.accent}, color-mix(in srgb, ${config.accent} 70%, #202a38))`, boxShadow: `0 18px 34px -24px ${config.accent}` }}
          >
            <span>{config.variant === "song" ? "Pripraviť hudobné kolo" : "Pripraviť hru"}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/18"><Icons.chevronRight size={20} /></span>
          </button>
        </section>
      </div>
    </main>
  );
}
