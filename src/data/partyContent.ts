import type {
  CustomContentGame,
  GeneratedLaunchPayload,
  GeneratedPartySession,
  PartyGeneratorControls,
  WorkshopCollection,
  WorkshopEntry,
  WorkshopEntryKind,
  WorkshopSelection,
  WorkshopSelections,
} from "../types";
import type { QuizQuestion } from "./teamBattle";

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
      { kind: "charade", text: "Zdobenie vianočného stromčeka" },
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
      { kind: "charade", text: "Duch prechádzajúci cez zatvorené dvere" },
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
      { kind: "charade", text: "Písanie anonymného valentínskeho odkazu" },
      { kind: "charade", text: "Príprava prekvapivej večere" },
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
      { kind: "charade", text: "Otváranie fľaše so šumivým nápojom" },
      { kind: "charade", text: "Písanie novoročných predsavzatí" },
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
    const text = cleanString(candidate.text, 240);
    const rawKind = candidate.kind === "word" ? "charade" : candidate.kind;
    if (!text || !rawKind || !VALID_KINDS.has(rawKind)) continue;
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

export function generatedPayloadToQuiz(payload?: GeneratedLaunchPayload | null): QuizQuestion[] {
  if (!payload || payload.screen !== "teambattle") return [];
  return payload.prompts.filter((prompt) => prompt.kind === "quiz" && prompt.answer).map((prompt, index) => ({
    id: `theme:${payload.sessionId}:${index}`,
    question: prompt.text,
    answer: prompt.answer!,
    category: `✨ ${payload.title}`,
  }));
}

function hashText(text: string) {
  let hash = 2166136261;
  for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}

const UNSAFE_CONTEXT = /(?:sex|porno|nude|nahot|drogy|koka|hero[ií]n|zbra[nň]|zabi|samovra|bomb|výbu|explosive)/i;

function safeContext(value: string) {
  const clean = cleanString(value, 80);
  if (!clean || UNSAFE_CONTEXT.test(clean)) return "spoločná párty";
  return clean;
}

function rotate<T>(items: T[], seed: number) {
  if (!items.length) return items;
  const offset = seed % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

export function generatePartySession(input: PartyGeneratorControls): GeneratedPartySession {
  const controls: PartyGeneratorControls = {
    audience: ["friends", "family", "couple"].includes(input.audience) ? input.audience : "friends",
    vibe: ["fun", "chill", "competitive"].includes(input.vibe) ? input.vibe : "fun",
    intensity: input.intensity === 2 || input.intensity === 3 ? input.intensity : 1,
    playerCount: Number.isFinite(input.playerCount) ? Math.min(20, Math.max(2, Math.round(input.playerCount!))) : undefined,
    context: safeContext(input.context),
  };
  const seed = hashText(JSON.stringify(controls));
  const place = controls.context;
  const audienceLabel = controls.audience === "family" ? "rodinu" : controls.audience === "couple" ? "dvojicu" : "partiu";
  const vibeLabel = controls.vibe === "competitive" ? "súťaživý" : controls.vibe === "chill" ? "pokojný" : "zábavný";
  const intensityLabel = controls.intensity === 3 ? "výrazná" : controls.intensity === 2 ? "stredná" : "jemná";
  const vibeCue = controls.vibe === "competitive"
    ? "Odpovedz presne a získaj bod:"
    : controls.vibe === "chill"
      ? "Bez ponáhľania:"
      : "Čo najzábavnejšie:";
  const truthDepth = controls.intensity === 3
    ? "Pridaj aj dôvod, ktorý ostatní ešte nepoznajú."
    : controls.intensity === 2
      ? "Vysvetli odpoveď jednou vetou."
      : "Stačí krátka a príjemná odpoveď.";
  const actionSeconds = controls.intensity === 3 ? 10 : controls.intensity === 2 ? 20 : 30;
  const actionFinish = controls.vibe === "competitive" ? "Tím rozhodne, či získavaš bod." : controls.vibe === "chill" ? "Pokojne si vezmi chvíľu na prípravu." : "Ostatní sa môžu pridať.";

  const audienceTruths = controls.audience === "family" ? [
    `Ktorá rodinná spomienka na tému „${place}“ ťa vždy rozosmeje?`,
    "Ktorú tradíciu by si chcel/a zachovať aj o desať rokov?",
    "Za čo si dnes niekomu z rodiny vďačný/á?",
    "Kto z rodiny by najlepšie zorganizoval nečakaný výlet a prečo?",
    "Akú novú spoločnú aktivitu by mala rodina vyskúšať?",
  ] : controls.audience === "couple" ? [
    `Ktorý spoločný moment s témou „${place}“ si chceš zapamätať?`,
    "Čím ťa druhý človek naposledy príjemne prekvapil?",
    "Aký malý spoločný plán by si chcel/a uskutočniť tento mesiac?",
    "Ktorá vlastnosť toho druhého ti najviac pomáha?",
    "Aký názov by mal film o vašom dnešnom večeri?",
  ] : [
    `Ktorý moment spojený s témou „${place}“ ťa naposledy rozosmial?`,
    `Kto z partie by najlepšie zvládol dobrodružstvo na tému „${place}“ a prečo?`,
    "Aký malý úspech z posledných dní by si dnes oslávil/a?",
    "Ktorú schopnosť niekoho z partie by si si na deň požičal/a?",
    "Čo by mala celá partia skúsiť aspoň raz?",
  ];
  const audienceDares = controls.audience === "family" ? [
    `Predveď bez slov rodinný výlet na tému „${place}“.`,
    "Napodobni milý zvyk niekoho v miestnosti bez prezradenia mena.",
    "Vymysli nové rodinné motto a nauč ho ostatných.",
    "Povedz trom ľuďom po jednom úprimnom komplimente.",
    "Predveď najveselšiu spoločnú fotografiu bez fotoaparátu.",
  ] : controls.audience === "couple" ? [
    `Predveď pantomímou spoločný plán na tému „${place}“.`,
    "Vymysli krátky slogan pre váš dnešný večer.",
    "Vymenuj tri veci, ktoré na druhom človeku oceňuješ.",
    "Zahraj scénu z vašej vymyslenej dovolenkovej reklamy.",
    "Vymysli spoločné víťazné gesto.",
  ] : [
    `Predveď pantomímou tému „${place}“.`,
    "Vymysli krátky reklamný slogan pre dnešnú partiu.",
    "Napodobni zvuk predmetu v miestnosti; ostatní hádajú.",
    "Povedz trom hráčom po jednom úprimnom komplimente.",
    "Vymysli tímové gesto, ktoré všetci zopakujú.",
  ];
  const audienceNever = controls.audience === "family" ? [
    "Nikdy som nikdy nezaspal/a počas rodinného filmu.",
    "Nikdy som nikdy nezabudol/a na rodinnú oslavu.",
    "Nikdy som nikdy tajne nedojedol/la poslednú sladkosť.",
    "Nikdy som nikdy neprehral/a rodinnú hru o jediný bod.",
    "Nikdy som nikdy nerozosmial/a celý stôl bez zámeru.",
  ] : controls.audience === "couple" ? [
    "Nikdy som nikdy nezabudol/a na dohodnutý spoločný plán.",
    "Nikdy som nikdy nepredstieral/a, že poznám názov filmu.",
    "Nikdy som nikdy nepripravil/a malé prekvapenie bez dôvodu.",
    "Nikdy som nikdy nezmenil/a názor po jednom dobrom argumente.",
    "Nikdy som nikdy nezaspal/a skôr, než skončil film.",
  ] : [
    "Nikdy som nikdy nezmenil/a plán na poslednú chvíľu kvôli zábave.",
    "Nikdy som nikdy neprehral/a hru o jediný bod.",
    "Nikdy som nikdy nerozosmial/a celú miestnosť bez zámeru.",
    "Nikdy som nikdy neskúsil/a novú aktivitu len na odporúčanie kamaráta.",
    "Nikdy som nikdy nezabudol/a, že som na rade.",
  ];
  const audienceChoices: Array<[string, string]> = controls.audience === "family" ? [
    ["rodinný výlet bez plánu", "rodinný večer s presným programom"],
    ["variť spolu večeru", "hrať spolu turnaj"],
    ["poznať všetky rodinné recepty", "poznať všetky rodinné príbehy"],
    ["mať spoločný deň pri mori", "mať spoločný deň na horách"],
    ["vyhrať tímovo", "prehrať pri najvtipnejšom kole"],
  ] : controls.audience === "couple" ? [
    ["spontánny víkend", "dokonale naplánovaná dovolenka"],
    ["spoločný koncert", "spoločný filmový maratón"],
    ["vedieť čítať myšlienky", "vedieť vždy rozosmiať toho druhého"],
    ["variť nové jedlo", "objaviť nové miesto"],
    ["vyhrať ako tím", "navzájom sa prekvapiť výsledkom"],
  ] : [
    ["mať dokonalú pamäť", "vedieť skvelo improvizovať"],
    ["vyhrať tesne", "prehrať po najzábavnejšom kole"],
    ["plánovať celý večer", "nechať všetko na náhodu"],
    ["hrať iba slovné hry", "hrať iba pantomímu"],
    ["mať tím plný stratégov", "mať tím plný zabávačov"],
  ];
  const audiencePeople = controls.audience === "family" ? [
    "Moderátor rodinnej televíznej súťaže", "Kuchár pripravujúci nedeľný obed", "Sprievodca na rodinnom výlete", "Vynálezca novej stolovej hry", `Detektív rodinnej záhady na tému „${place}“`,
  ] : controls.audience === "couple" ? [
    "Režisér romantickej komédie", "Cestovateľ plánujúci výlet vo dvojici", "Kuchár pripravujúci prekvapenie", "Fotograf spoločného dobrodružstva", `Detektív záhady na tému „${place}“`,
  ] : [
    "Moderátor zábavnej televíznej súťaže", "Prieskumník na neznámej planéte", "Kapitán tímu pred finále", "Kuchár pripravujúci prekvapenie", `Detektív riešiaci záhadu na tému „${place}“`,
  ];
  const audienceCharades = controls.audience === "family" ? [
    "Balenie celej rodiny na dovolenku", "Spoločné pečenie koláča", "Hľadanie ovládača od televízora", "Rodinná oslava víťazstva", `Príprava výletu na tému „${place}“`,
  ] : controls.audience === "couple" ? [
    "Príprava prekvapivej večere", "Spoločné skladanie nábytku", "Fotografovanie dokonalej fotky", "Hľadanie stratených kľúčov", `Plánovanie výletu na tému „${place}“`,
  ] : [
    "Otváranie obrovského darčeka", "Hľadanie strateného kľúča", "Tímová oslava víťazstva", "Fotografovanie skupinovej fotky", `Príprava na výlet s témou „${place}“`,
  ];
  const quizPool: Array<[string, string]> = controls.intensity === 3 ? [
    ["Ktorý chemický prvok má značku Fe?", "Železo"], ["Koľko hrán má kocka?", "12"], ["Ktorý oceán je najväčší?", "Tichý oceán"], ["V ktorom roku vznikla Slovenská republika?", "1993"], ["Koľko stupňov má súčet vnútorných uhlov trojuholníka?", "180"],
  ] : controls.intensity === 2 ? [
    ["Ktorá planéta je najbližšie k Slnku?", "Merkúr"], ["Koľko hráčov má futbalový tím na ihrisku?", "11"], ["Aké je hlavné mesto Rakúska?", "Viedeň"], ["Koľko kontinentov sa bežne rozlišuje?", "7"], ["Kto napísal Hamleta?", "William Shakespeare"],
  ] : [
    ["Koľko minút má jedna hodina?", "60"], ["Aké je hlavné mesto Slovenska?", "Bratislava"], ["Koľko strán má klasická hracia kocka?", "6"], ["Koľko dní má bežný rok?", "365"], ["Akú farbu vytvorí modrá a žltá?", "Zelenú"],
  ];

  const truths = rotate(audienceTruths.map((text) => `${vibeCue} ${text} ${truthDepth}`), seed);
  const dares = rotate(audienceDares.map((text) => `${text} Máš ${actionSeconds} sekúnd. ${actionFinish}`), seed >> 2);
  const neverPrefix = controls.vibe === "competitive" ? "Bod úprimnosti — " : controls.vibe === "chill" ? "Pohodové priznanie — " : "Rýchle priznanie — ";
  const never = rotate(audienceNever.map((text) => `${neverPrefix}${text}`), seed >> 3);
  const choiceCue = controls.intensity === 3 ? "Ťažká voľba" : controls.intensity === 2 ? "Stredná voľba" : "Rýchla voľba";
  const choices = rotate(audienceChoices.map(([a, b]) => [`${choiceCue} · ${vibeCue} ${a}`, b] as [string, string]), seed >> 4);
  const roleCue = controls.vibe === "competitive" ? "Súťažný" : controls.vibe === "chill" ? "Pokojný" : "Komický";
  const people = rotate(audiencePeople.map((text) => `${roleCue} ${text.toLocaleLowerCase("sk")}`), seed >> 5);
  const charades = rotate(audienceCharades.map((text) => `${text} · ${actionSeconds} sekúnd${controls.vibe === "competitive" ? " na bod" : ""}`), seed >> 6);
  const quizCue = controls.vibe === "competitive" ? "Súboj o bod" : controls.vibe === "chill" ? "Pohodový kvíz" : "Zábavný kvíz";
  const quiz = rotate(quizPool.map(([question, answer]) => [`${quizCue} pre ${audienceLabel}: ${question}`, answer] as [string, string]), seed >> 7);
  const groups = [
    { id: "truth-or-dare", screen: "truth-or-dare" as const, title: "Pravda alebo výzva", icon: "🎯", prompts: [...truths.slice(0, 4).map((text) => ({ kind: "truth" as const, text })), ...dares.slice(0, 4).map((text) => ({ kind: "dare" as const, text }))] },
    { id: "never", screen: "never-have-i-ever" as const, title: "Nikdy som nikdy", icon: "🙋", prompts: never.slice(0, 4).map((text) => ({ kind: "never" as const, text })) },
    { id: "rather", screen: "would-you-rather" as const, title: "Radšej by som", icon: "🤔", prompts: choices.slice(0, 4).map(([text, answer]) => ({ kind: "wouldRather" as const, text, answer })) },
    { id: "person", screen: "hadajktosom" as const, title: "Hádaj kto som", icon: "👤", prompts: people.slice(0, 4).map((text) => ({ kind: "person" as const, text })) },
    { id: "charade", screen: "slovnarosada" as const, title: "Slovné šarády", icon: "🎭", prompts: charades.slice(0, 4).map((text) => ({ kind: "charade" as const, text })) },
    { id: "quiz", screen: "teambattle" as const, title: "Tímový kvíz", icon: "🏆", prompts: quiz.slice(0, 4).map(([text, answer]) => ({ kind: "quiz" as const, text, answer })) },
  ];
  return {
    id: `local-${seed.toString(36)}`,
    title: `${vibeLabel[0].toUpperCase()}${vibeLabel.slice(1)} mix pre ${audienceLabel}`,
    summary: `${controls.playerCount ? `${controls.playerCount} hráčov · ` : ""}${intensityLabel} intenzita · téma „${place}“.`,
    themeTags: [audienceLabel, vibeLabel, `intenzita ${controls.intensity}`],
    controls,
    groups,
  };
}
