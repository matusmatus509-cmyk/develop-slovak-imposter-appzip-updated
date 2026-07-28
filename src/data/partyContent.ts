import type {
  CustomContentGame,
  WorkshopCollection,
  WorkshopEntry,
  WorkshopEntryKind,
  WorkshopSelection,
  WorkshopSelections,
} from "../types";
import type { QuizQuestion } from "./teamBattle";
import { isValidCharadeText } from "./charades";

export const DEFAULT_COLLECTION_ID = "default";
export const DEFAULT_COLLECTION: WorkshopCollection = {
  id: DEFAULT_COLLECTION_ID,
  name: "Moje kartičky",
  icon: "✨",
  color: "#34d399",
  createdAt: 0,
};

export const CUSTOM_GAME_KINDS: Record<CustomContentGame, WorkshopEntryKind[]> = {
  "truth-or-dare": ["truth", "dare"],
  "never-have-i-ever": ["never"],
  "would-you-rather": ["wouldRather"],
  hadajemoji: ["emoji"],
  hadajktosom: ["person"],
  slovnarosada: ["charade", "word"],
  teambattle: ["quiz"],
};

export const DEFAULT_WORKSHOP_SELECTIONS: WorkshopSelections = {
  "truth-or-dare": { enabled: false, collectionIds: [DEFAULT_COLLECTION_ID] },
  "never-have-i-ever": { enabled: false, collectionIds: [DEFAULT_COLLECTION_ID] },
  "would-you-rather": { enabled: false, collectionIds: [DEFAULT_COLLECTION_ID] },
  hadajemoji: { enabled: false, collectionIds: [DEFAULT_COLLECTION_ID] },
  hadajktosom: { enabled: false, collectionIds: [DEFAULT_COLLECTION_ID] },
  slovnarosada: { enabled: false, collectionIds: [DEFAULT_COLLECTION_ID] },
  teambattle: { enabled: false, collectionIds: [DEFAULT_COLLECTION_ID] },
};

const VALID_KINDS = new Set<WorkshopEntryKind>([
  "truth", "dare", "never", "wouldRather", "emoji", "quiz", "person", "charade", "word",
]);
const COLLECTION_COLORS = ["#34d399", "#22d3ee", "#a78bfa", "#fb7185", "#fbbf24", "#60a5fa"];

export interface SeasonalPartyPack {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  entries: Array<{ kind: Exclude<WorkshopEntryKind, "word">; text: string; answer?: string }>;
}

export const SEASONAL_PARTY_PACKS: SeasonalPartyPack[] = [
  {
    id: "christmas-sk",
    name: "Vianočná nálada",
    icon: "🎄",
    color: "#22c55e",
    description: "Tradície, koledy, darčeky a zimné šarády.",
    entries: [
      { kind: "truth", text: "Ktorá vianočná tradícia je pre teba najdôležitejšia a prečo?" },
      { kind: "truth", text: "Aký darček ťa v detstve najviac potešil?" },
      { kind: "dare", text: "Zaspievaj alebo zahmkaj refrén známej koledy." },
      { kind: "dare", text: "Predveď rozbaľovanie darčeka, ktorý ťa úplne prekvapil." },
      { kind: "never", text: "Nikdy som nikdy neochutnal/a vianočné pečivo ešte pred sviatkami." },
      { kind: "wouldRather", text: "Radšej by si zdobil/a stromček celý deň", answer: "Radšej by si piekol/piekla koláče celý deň" },
      { kind: "emoji", text: "🎄⭐🎁", answer: "Vianočný stromček a darčeky" },
      { kind: "quiz", text: "Ako sa volá obdobie štyroch týždňov pred Vianocami?", answer: "Advent" },
      { kind: "quiz", text: "Ktorý deň je na Slovensku Štedrý deň?", answer: "24. december" },
      { kind: "person", text: "Ježiško nesúci príliš veľa darčekov" },
      { kind: "charade", text: "Zdobenie stromčeka" },
      { kind: "charade", text: "Stavanie snehuliaka" },
    ],
  },
  {
    id: "halloween-sk",
    name: "Halloweenska noc",
    icon: "🎃",
    color: "#f97316",
    description: "Strašidelne zábavné otázky, postavy a hádanie.",
    entries: [
      { kind: "truth", text: "Ktorý film alebo príbeh ťa kedysi najviac vystrašil?" },
      { kind: "truth", text: "Aký kostým by si si vybral/a, keby si mal/a neobmedzený rozpočet?" },
      { kind: "dare", text: "Vymysli trojvetový strašidelný príbeh s veselým koncom." },
      { kind: "dare", text: "Prejdi sa po miestnosti ako nemotorný zombík." },
      { kind: "never", text: "Nikdy som nikdy nezľakol/nezľakla vlastného odrazu v tme." },
      { kind: "wouldRather", text: "Radšej by si prespal/a v starom hrade", answer: "Radšej by si prešiel/prešla nočným lesom" },
      { kind: "emoji", text: "👻🏚️🌕", answer: "Strašidelný dom pri splne" },
      { kind: "quiz", text: "Z ktorej zeleniny sa najčastejšie vyrezáva halloweenska lampa?", answer: "Tekvica" },
      { kind: "quiz", text: "Ktorý dátum pripadá na Halloween?", answer: "31. október" },
      { kind: "person", text: "Upír, ktorý sa bojí tmy" },
      { kind: "charade", text: "Vyrezávanie tekvice" },
      { kind: "charade", text: "Strašidelný duch" },
    ],
  },
  {
    id: "valentine-sk",
    name: "Valentínska párty",
    icon: "💝",
    color: "#fb7185",
    description: "Milé otázky pre dvojice aj priateľov bez trápnych chvíľ.",
    entries: [
      { kind: "truth", text: "Ktorá vlastnosť robí podľa teba človeka dobrým priateľom alebo partnerom?" },
      { kind: "truth", text: "Aké malé gesto ti vždy zlepší deň?" },
      { kind: "dare", text: "Povedz osobe po pravej ruke úprimný a konkrétny kompliment." },
      { kind: "dare", text: "Vymysli slogan pre najlepšie priateľstvo na svete." },
      { kind: "never", text: "Nikdy som nikdy neposlal/a správu nesprávnej osobe." },
      { kind: "wouldRather", text: "Radšej by si dostal/a ručne vyrobený darček", answer: "Radšej by si zažil/a spoločné dobrodružstvo" },
      { kind: "emoji", text: "🍝🕯️💬", answer: "Večera pri sviečkach" },
      { kind: "quiz", text: "Ktorý sviatok sa oslavuje 14. februára?", answer: "Valentín" },
      { kind: "quiz", text: "Ktorý orgán symbolizuje lásku?", answer: "Srdce" },
      { kind: "person", text: "Amor, ktorému sa zamotali šípy" },
      { kind: "charade", text: "Písanie odkazu" },
      { kind: "charade", text: "Príprava večere" },
    ],
  },
  {
    id: "new-year-sk",
    name: "Silvestrovský štart",
    icon: "🎆",
    color: "#a78bfa",
    description: "Spomienky, predsavzatia, odpočítavanie a oslavy.",
    entries: [
      { kind: "truth", text: "Na ktorý moment z uplynulého roka si najviac hrdý/á?" },
      { kind: "truth", text: "Čo nové by si chcel/a v ďalšom roku vyskúšať?" },
      { kind: "dare", text: "Prednes desaťsekundový novoročný prípitok pre celú partiu." },
      { kind: "dare", text: "Predveď oslavu polnoci bez jediného slova." },
      { kind: "never", text: "Nikdy som nikdy zaspal/a ešte pred polnočným odpočítavaním." },
      { kind: "wouldRather", text: "Radšej by si oslavoval/a na veľkej párty", answer: "Radšej by si vítal/a rok na pokojnej chate" },
      { kind: "emoji", text: "🕛🥂🎆", answer: "Silvestrovská polnoc" },
      { kind: "quiz", text: "Koľko mesiacov má kalendárny rok?", answer: "12" },
      { kind: "quiz", text: "Ako sa volá posledný deň roka?", answer: "Silvester" },
      { kind: "person", text: "Moderátor odpočítavania posledných desiatich sekúnd roka" },
      { kind: "charade", text: "Otváranie fľaše" },
      { kind: "charade", text: "Novoročné predsavzatie" },
    ],
  },
];

function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, maxLength) : "";
}

function uniqueId(base: string, seen: Set<string>, fallback: string) {
  let id = cleanString(base, 64).replace(/[^a-zA-Z0-9_-]/g, "-") || fallback;
  while (seen.has(id)) id = `${id}-copy`;
  seen.add(id);
  return id;
}

export function normalizeWorkshopCollections(value: unknown): WorkshopCollection[] {
  const source = Array.isArray(value) ? value.slice(0, 40) : [];
  const seen = new Set<string>();
  const normalized: WorkshopCollection[] = [];
  for (const [index, raw] of source.entries()) {
    if (!raw || typeof raw !== "object") continue;
    const candidate = raw as Partial<WorkshopCollection>;
    const requestedId = index === 0 && candidate.id === DEFAULT_COLLECTION_ID ? DEFAULT_COLLECTION_ID : candidate.id ?? "";
    const id = uniqueId(requestedId, seen, `collection-${index + 1}`);
    const name = cleanString(candidate.name, 40) || `Kolekcia ${index + 1}`;
    const icon = cleanString(candidate.icon, 4) || "✨";
    const color = /^#[0-9a-f]{6}$/i.test(candidate.color ?? "") ? candidate.color! : COLLECTION_COLORS[index % COLLECTION_COLORS.length];
    const createdAt = Number.isFinite(candidate.createdAt) ? Math.max(0, Number(candidate.createdAt)) : 0;
    normalized.push({ id, name, icon, color, createdAt });
  }
  const defaultIndex = normalized.findIndex((collection) => collection.id === DEFAULT_COLLECTION_ID);
  if (defaultIndex < 0) normalized.unshift(DEFAULT_COLLECTION);
  else if (defaultIndex > 0) normalized.unshift(...normalized.splice(defaultIndex, 1));
  return normalized;
}

export function normalizeWorkshopEntries(value: unknown, collectionsValue?: unknown): WorkshopEntry[] {
  if (!Array.isArray(value)) return [];
  const collections = normalizeWorkshopCollections(collectionsValue);
  const validCollectionIds = new Set(collections.map((collection) => collection.id));
  const seenIds = new Set<string>();
  const normalized: WorkshopEntry[] = [];
  for (const [index, raw] of value.slice(0, 500).entries()) {
    if (!raw || typeof raw !== "object") continue;
    const candidate = raw as Partial<WorkshopEntry>;
    const rawKind = candidate.kind === "word" ? "charade" : candidate.kind;
    const text = cleanString(candidate.text, rawKind === "charade" ? 80 : 240);
    if (!text || !rawKind || !VALID_KINDS.has(rawKind)) continue;
    // Aj importované a staršie vlastné šarády musia dodržať rovnaký štandard
    // ako vstavaný katalóg: 1–3 slová, žiadne dvojbodkové kombinácie.
    if (rawKind === "charade" && !isValidCharadeText(text)) continue;
    const createdAt = Number.isFinite(candidate.createdAt) ? Math.max(0, Number(candidate.createdAt)) : 0;
    const id = uniqueId(candidate.id ?? "", seenIds, `local-${createdAt}-${index}`);
    const collectionIds = Array.isArray(candidate.collectionIds)
      ? [...new Set(candidate.collectionIds.filter((item): item is string => typeof item === "string" && validCollectionIds.has(item)))].slice(0, 12)
      : [];
    normalized.push({
      id,
      kind: rawKind,
      text,
      answer: cleanString(candidate.answer, 160) || undefined,
      collectionIds: collectionIds.length ? collectionIds : [DEFAULT_COLLECTION_ID],
      enabled: candidate.enabled !== false,
      likes: Number.isFinite(candidate.likes) ? Math.min(1_000_000, Math.max(0, Number(candidate.likes))) : 0,
      rating: Number.isFinite(candidate.rating) ? Math.min(5, Math.max(0, Number(candidate.rating))) : 0,
      ratingCount: Number.isFinite(candidate.ratingCount) ? Math.min(1_000_000, Math.max(0, Number(candidate.ratingCount))) : 0,
      userRating: Number.isFinite(candidate.userRating) ? Math.min(5, Math.max(1, Math.round(Number(candidate.userRating)))) : undefined,
      createdAt,
    });
  }
  return normalized;
}

export function normalizeWorkshopSelections(value: unknown, collectionsValue?: unknown): WorkshopSelections {
  const collections = normalizeWorkshopCollections(collectionsValue);
  const validIds = new Set(collections.map((collection) => collection.id));
  const candidate = value && typeof value === "object" ? value as Partial<Record<CustomContentGame, Partial<WorkshopSelection>>> : {};
  return (Object.keys(DEFAULT_WORKSHOP_SELECTIONS) as CustomContentGame[]).reduce((result, game) => {
    const current = candidate[game];
    const ids = Array.isArray(current?.collectionIds)
      ? [...new Set(current.collectionIds.filter((id): id is string => typeof id === "string" && validIds.has(id)))]
      : [];
    result[game] = { enabled: current?.enabled === true, collectionIds: ids.length ? ids : [DEFAULT_COLLECTION_ID] };
    return result;
  }, {} as WorkshopSelections);
}

const ANSWER_REQUIRED_KINDS = new Set<WorkshopEntryKind>(["wouldRather", "emoji", "quiz"]);

function isEntryCompatible(entry: WorkshopEntry, game: CustomContentGame) {
  const normalizedKind = entry.kind === "word" ? "charade" : entry.kind;
  const kinds = CUSTOM_GAME_KINDS[game].map((kind) => kind === "word" ? "charade" : kind);
  return entry.enabled && kinds.includes(normalizedKind) && (!ANSWER_REQUIRED_KINDS.has(normalizedKind) || Boolean(entry.answer));
}

export function filterWorkshopEntries(
  entries: WorkshopEntry[],
  game: CustomContentGame,
  selection: WorkshopSelection,
) {
  if (!selection.enabled) return [];
  const collectionIds = new Set(selection.collectionIds);
  return entries.filter((entry) => isEntryCompatible(entry, game) && entry.collectionIds.some((id) => collectionIds.has(id)));
}

export function countCompatibleEntries(entries: WorkshopEntry[], game: CustomContentGame) {
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    if (!isEntryCompatible(entry, game)) continue;
    for (const collectionId of entry.collectionIds) counts[collectionId] = (counts[collectionId] ?? 0) + 1;
  }
  return counts;
}

export function workshopEntriesToQuiz(entries: WorkshopEntry[]): QuizQuestion[] {
  return entries.filter((entry) => entry.kind === "quiz" && entry.answer).map((entry) => ({
    id: `custom:${entry.id}`,
    question: entry.text,
    answer: entry.answer!,
    category: "✨ Vlastná kolekcia",
  }));
}
