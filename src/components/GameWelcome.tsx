import type { CSSProperties } from "react";
import type { Screen } from "../types";
import gameArt from "../assets/game-art-sprite.jpg";
import forbiddenArt from "../assets/party-forbidden.svg";
import songArt from "../assets/party-song.svg";
import soundArt from "../assets/party-sound.svg";
import letterArt from "../assets/party-letter.svg";
import fiveTenArt from "../assets/party-five-ten.svg";
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
  },
  "never-have-i-ever": {
    eyebrow: "Kto to už zažil?",
    title: "Nikdy som nikdy",
    description: "Rýchla hra, v ktorej sa aj starí kamaráti dozvedia niečo nové.",
    rule: "Zdvihni prst, ak si to urobil",
    players: "3+ hráči",
    duration: "10–30 min",
    accent: "#34d399",
    accentSoft: "rgba(52,211,153,.22)",
    deep: "#07241d",
    artPosition: "33.333% 0%",
  },
  "would-you-rather": {
    eyebrow: "Dve cesty. Jedna voľba.",
    title: "Radšej by som",
    description: "Rozhodnutia, pri ktorých sa partia zaručene rozdelí na dva tábory.",
    rule: "Vyber A alebo B a obháj to",
    players: "2+ hráči",
    duration: "10–25 min",
    accent: "#f59e0b",
    accentSoft: "rgba(245,158,11,.24)",
    deep: "#2b1704",
    artPosition: "66.666% 0%",
  },
  slovnarosada: {
    eyebrow: "Slová pod tlakom",
    title: "Slovné šarády",
    description: "Opisuj bez zakázaného slova a nazbieraj čo najviac bodov pre seba alebo tím.",
    rule: "Opisuj, nehraj pantomímu",
    players: "2–8 hráčov",
    duration: "30–120 s/kolo",
    accent: "#a78bfa",
    accentSoft: "rgba(167,139,250,.24)",
    deep: "#1b1035",
    artPosition: "100% 0%",
  },
  pingpong: {
    eyebrow: "Postreh proti času",
    title: "Slovný ping pong",
    description: "Hovor slová zo zadanej kategórie a odraz tlak späť na súpera.",
    rule: "Slovo, potom klepnutie",
    players: "2 hráči",
    duration: "Rýchle kolá",
    accent: "#22d3ee",
    accentSoft: "rgba(34,211,238,.22)",
    deep: "#06242c",
    artPosition: "0% 50%",
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
    artPosition: "33.333% 50%",
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
    artPosition: "66.666% 50%",
  },
  ktodostanebombu: {
    eyebrow: "Nikto nevie, kedy vybuchne",
    title: "Kto dostane bombu",
    description: "Povedz správne slovo a podaj mobil ďalej skôr, než príde výbuch.",
    rule: "Odpovedz a rýchlo podávaj",
    players: "3+ hráči",
    duration: "30–90 s",
    accent: "#fb923c",
    accentSoft: "rgba(251,146,60,.25)",
    deep: "#2c1106",
    artPosition: "100% 50%",
  },
  hadajemoji: {
    eyebrow: "Obrázky namiesto slov",
    title: "Hádaj emoji",
    description: "Rozlúšti filmy, osobnosti a povolania poskladané iba z emoji.",
    rule: "Najprv hádaj, potom odhaľ",
    players: "1+ hráčov",
    duration: "Bez limitu",
    accent: "#facc15",
    accentSoft: "rgba(250,204,21,.23)",
    deep: "#292005",
    artPosition: "0% 100%",
  },
  "impostor-setup": {
    eyebrow: "Tajné slovo. Tajný hráč.",
    title: "Imposter",
    description: "Všetci poznajú slovo. Jeden dostane iba nápovedu a musí splynúť s partiou.",
    rule: "Diskutujte a odhaľte podvodníka",
    players: "3–12 hráčov",
    duration: "5–20 min",
    accent: "#f97316",
    accentSoft: "rgba(249,115,22,.24)",
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
    duration: "20–45 min",
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
    duration: "60 s/kolo",
    accent: "#fb7185",
    accentSoft: "rgba(251,113,133,.24)",
    deep: "#2b0d18",
    artPosition: "center",
    art: forbiddenArt,
  },
  pesnicka: {
    eyebrow: "Melódia bez textu",
    title: "Uhádni pesničku",
    description: "Jeden hráč hmkaním predvádza známe skladby a ostatní hádajú čo najviac názvov.",
    rule: "Hmkanie áno, slová ani názov nie",
    players: "2–8 hráčov",
    duration: "60 s/kolo",
    accent: "#a78bfa",
    accentSoft: "rgba(167,139,250,.24)",
    deep: "#1c1039",
    artPosition: "center",
    art: songArt,
  },
  zvuk: {
    eyebrow: "Počúvaj a bzuč",
    title: "Uhádni zvuk",
    description: "Aplikácia prehrá tajný zvuk. Hráč alebo tím, ktorý ho spozná prvý, stlačí bzučiak a odpovedá.",
    rule: "Najprv bzučiak, potom odpoveď",
    players: "2–8 hráčov",
    duration: "10 zvukov",
    accent: "#22d3ee",
    accentSoft: "rgba(34,211,238,.22)",
    deep: "#062630",
    artPosition: "center",
    art: soundArt,
  },
  pismeno: {
    eyebrow: "Päť sekúnd na slovo",
    title: "Slovo na písmeno",
    description: "Dostaneš kategóriu a písmeno. Odpovedz skôr, než čas vyprší a bod získa súper.",
    rule: "Jedna platná odpoveď do 5 sekúnd",
    players: "2–8 hráčov",
    duration: "10 výziev",
    accent: "#fbbf24",
    accentSoft: "rgba(251,191,36,.23)",
    deep: "#2b1d05",
    artPosition: "center",
    art: letterArt,
  },
  patzadesat: {
    eyebrow: "Päť odpovedí. Desať sekúnd.",
    title: "5 za 10",
    description: "Vymenuj päť vecí zo zadanej témy do desiatich sekúnd a získaj dva body pre seba alebo tím.",
    rule: "Všetkých päť odpovedí znamená +2 body",
    players: "2–8 hráčov",
    duration: "6 výziev",
    accent: "#34d399",
    accentSoft: "rgba(52,211,153,.22)",
    deep: "#06271c",
    artPosition: "center",
    art: fiveTenArt,
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
      className="game-welcome relative min-h-screen overflow-hidden text-white"
      style={{ ...style, background: `linear-gradient(180deg, ${config.deep}, #080b10 68%)` }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_50%_5%,var(--welcome-soft),transparent_38%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-7 pt-5">
        <div className="relative mb-6 h-[46vh] min-h-[320px] max-h-[450px] overflow-hidden rounded-[26px] border border-white/12 shadow-2xl animate-welcome-reveal">
          {config.art ? (
            <img
              src={config.art}
              alt=""
              className="absolute inset-0 h-full w-full scale-[1.02] object-cover saturate-[.9]"
            />
          ) : (
            <div
              className="absolute inset-0 scale-[1.04] bg-no-repeat"
              style={{
                backgroundImage: `url(${gameArt})`,
                backgroundSize: "400% 300%",
                backgroundPosition: config.artPosition,
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-[#080b12]" />
          <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,.12),transparent_28%,transparent_70%,rgba(0,0,0,.35))]" />

          <button
            type="button"
            onClick={onBack}
            aria-label="Späť"
            className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/16 bg-[#0d1218]/80 text-white shadow-lg transition hover:bg-[#18202a] active:scale-90"
          >
            <Icons.chevronLeft size={23} />
          </button>

          <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/12 bg-[#0d1218]/70 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: config.accent }} />
              <span className="text-[10px] font-black uppercase tracking-[.19em] text-white/75">{config.eyebrow}</span>
            </div>
            <h1 className="max-w-[330px] text-[2.45rem] font-extrabold leading-[.96] tracking-[-.045em] drop-shadow-xl">{config.title}</h1>
          </div>
        </div>

        <section className="flex flex-1 flex-col animate-welcome-content">
          <p className="text-[15px] font-medium leading-relaxed text-white/62">{config.description}</p>

          <div className="my-5 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-white/10 bg-[#121922]/90 px-3.5 py-3">
              <p className="text-[9px] font-black uppercase tracking-[.17em] text-white/35">Hráči</p>
              <p className="mt-1 text-sm font-extrabold text-white/85">{config.players}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#121922]/90 px-3.5 py-3">
              <p className="text-[9px] font-black uppercase tracking-[.17em] text-white/35">Trvanie</p>
              <p className="mt-1 text-sm font-extrabold text-white/85">{config.duration}</p>
            </div>
          </div>

          <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d131a]/75 px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: config.accentSoft, color: config.accent }}>
              <Icons.sparkles size={18} />
            </span>
            <p className="text-xs font-bold leading-snug text-white/68">{config.rule}</p>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="mt-auto flex min-h-14 w-full items-center justify-between rounded-xl border border-white/10 px-5 text-left font-extrabold text-white shadow-xl transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[.98]"
            style={{ background: `linear-gradient(135deg, ${config.accent}, color-mix(in srgb, ${config.accent} 70%, #202a38))`, boxShadow: `0 18px 34px -24px ${config.accent}` }}
          >
            <span>Pripraviť hru</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/18"><Icons.chevronRight size={20} /></span>
          </button>
        </section>
      </div>
    </main>
  );
}
