import type { PartyTheme, Screen } from "../types";

export interface PlayableGame {
  id: string;
  screen: Screen;
  title: string;
  icon: string;
  color: string;
}

export const PLAYABLE_GAMES: PlayableGame[] = [
  { id: "teambattle", screen: "teambattle", title: "Party mode", icon: "🏆", color: "#8b5cf6" },
  { id: "impostor", screen: "impostor-setup", title: "Imposter", icon: "🕵️", color: "#f97316" },
  { id: "drawing", screen: "drawing-setup", title: "Imposter kreslenie", icon: "🎨", color: "#06b6d4" },
  { id: "truth-or-dare", screen: "truth-or-dare", title: "Pravda alebo výzva", icon: "🎯", color: "#0ea5e9" },
  { id: "never-have-i-ever", screen: "never-have-i-ever", title: "Nikdy som nikdy", icon: "🙋", color: "#10b981" },
  { id: "would-you-rather", screen: "would-you-rather", title: "Radšej by som", icon: "🤔", color: "#f59e0b" },
  { id: "slovnarosada", screen: "slovnarosada", title: "Slovné šarády", icon: "🎭", color: "#8b5cf6" },
  { id: "pingpong", screen: "pingpong", title: "Slovný ping pong", icon: "🏓", color: "#22c55e" },
  { id: "hadajktosom", screen: "hadajktosom", title: "Hádaj kto som", icon: "👤", color: "#06b6d4" },
  { id: "ibanepravda", screen: "ibanepravda", title: "Iba nepravda", icon: "💬", color: "#f43f5e" },
  { id: "ktodostanebombu", screen: "ktodostanebombu", title: "Kto dostane bombu", icon: "💣", color: "#ef4444" },
  { id: "hadajemoji", screen: "hadajemoji", title: "Hádaj emoji", icon: "😄", color: "#eab308" },
  { id: "zakazane", screen: "zakazane", title: "Zakázané slovo", icon: "🚫", color: "#e11d48" },
  { id: "pesnicka", screen: "pesnicka", title: "Uhádni pesničku", icon: "🎵", color: "#c026d3" },
  { id: "zvuk", screen: "zvuk", title: "Uhádni zvuk", icon: "🔔", color: "#0284c7" },
  { id: "pismeno", screen: "pismeno", title: "Slovo na písmeno", icon: "🔤", color: "#f59e0b" },
  { id: "patzadesat", screen: "patzadesat", title: "5 za 10", icon: "⏱️", color: "#16a34a" },
];

export const PARTY_THEMES: Array<{ id: PartyTheme; title: string; swatch: string; description: string }> = [
  { id: "dark", title: "Dark", swatch: "linear-gradient(135deg,#111827,#312e81)", description: "Čistý tmavý vzhľad" },
  { id: "neon", title: "Neon", swatch: "linear-gradient(135deg,#020617,#d946ef,#22d3ee)", description: "Ružová a tyrkysová žiara" },
  { id: "gold", title: "Gold", swatch: "linear-gradient(135deg,#1c1917,#d97706,#fde68a)", description: "Teplé zlaté akcenty" },
  { id: "halloween", title: "Halloween", swatch: "linear-gradient(135deg,#09090b,#7c2d12,#f97316)", description: "Tekvicová noc" },
  { id: "christmas", title: "Christmas", swatch: "linear-gradient(135deg,#052e16,#dc2626,#f8fafc)", description: "Sviatočná červená a zelená" },
  { id: "galaxy", title: "Galaxy", swatch: "linear-gradient(135deg,#020617,#4c1d95,#2563eb)", description: "Hlboký vesmír" },
];

export const PACKS = [
  { id: "movies", title: "Movies", icon: "🎬", status: "available", detail: "Hádaj emoji · existujúca kategória Filmy a seriály", screen: "hadajemoji" as Screen },
  { id: "marvel", title: "Marvel", icon: "🦸", status: "soon", detail: "Pripravujeme samostatný balík" },
  { id: "harry-potter", title: "Harry Potter", icon: "🪄", status: "soon", detail: "Pripravujeme samostatný balík" },
  { id: "anime", title: "Anime", icon: "🌸", status: "soon", detail: "Pripravujeme samostatný balík" },
  { id: "minecraft", title: "Minecraft", icon: "⛏️", status: "soon", detail: "Pripravujeme samostatný balík" },
  { id: "football", title: "Football", icon: "⚽", status: "available", detail: "Existujúca športová kategória v hre Imposter", screen: "impostor-setup" as Screen },
  { id: "slovakia", title: "Slovakia", icon: "🇸🇰", status: "soon", detail: "Samostatný balík pripravujeme; slovenský obsah je zatiaľ rozptýlený v hrách" },
  { id: "kids", title: "Kids", icon: "🧸", status: "available", detail: "Existujúca kategória Animované postavy v Hádaj emoji", screen: "hadajemoji" as Screen },
  { id: "adults", title: "18+", icon: "🔞", status: "soon", detail: "Len pre dospelých · bez explicitného obsahu" },
] as const;

interface WeeklyFeature {
  game: PlayableGame;
  challenge: string;
  quiz: string;
  number: number;
  year: number;
}

export interface WeeklyContentProvider {
  getWeeklyFeature(year: number, week: number): Promise<Partial<WeeklyFeature> | null>;
}

function isoWeek(date: Date) {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  return { year: utc.getUTCFullYear(), week: Math.ceil((((utc.getTime() - yearStart.getTime()) / 86400000) + 1) / 7) };
}

const WEEKLY_COPY = [
  ["Zahrajte dve kolá a vymeňte moderátora.", "Ktorá planéta je najbližšie k Slnku? · Merkúr"],
  ["Každý tím získa bod navyše za najoriginálnejšiu odpoveď.", "Koľko minút má jeden deň? · 1440"],
  ["Skúste jedno kolo úplne bez slovných nápovied.", "Aké je hlavné mesto Slovenska? · Bratislava"],
  ["Víťaz vyberie ďalšiu hru pre celú partiu.", "Ktorý oceán je najväčší? · Tichý oceán"],
];

export function getBundledWeeklyFeature(date = new Date()): WeeklyFeature {
  const { year, week } = isoWeek(date);
  const seed = year * 53 + week;
  const game = PLAYABLE_GAMES[seed % PLAYABLE_GAMES.length];
  const copy = WEEKLY_COPY[seed % WEEKLY_COPY.length];
  return { game, challenge: copy[0], quiz: copy[1], number: week, year };
}

export async function getWeeklyFeature(date = new Date(), provider?: WeeklyContentProvider) {
  const fallback = getBundledWeeklyFeature(date);
  if (!provider) return fallback;
  try {
    const remote = await provider.getWeeklyFeature(fallback.year, fallback.number);
    return remote ? { ...fallback, ...remote } : fallback;
  } catch {
    return fallback;
  }
}

export function normalizeFavoriteIds(value: unknown) {
  const valid = new Set(PLAYABLE_GAMES.map((game) => game.id));
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === "string" && valid.has(id)))];
}
