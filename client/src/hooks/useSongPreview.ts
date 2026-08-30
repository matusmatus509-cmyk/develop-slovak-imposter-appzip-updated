import { useCallback, useEffect, useRef, useState } from "react";
import type { SongCard } from "../data/teamBattleExtras";

export type SongPreviewStatus =
  "idle" | "loading" | "ready" | "playing" | "missing" | "error";

interface PreviewSource {
  url: string;
  link: string;
  /** Obal albumu od poskytovateľa — odhalí sa až s odpoveďou, aby neprezradil skladbu. */
  artwork: string | null;
}

/**
 * Skladba tak, ako ju vidí ukážka. Databázový `Song` nesie aj jazyk, obyčajná
 * karta `SongCard` nie — a jazyk rozhoduje, v ktorom obchode ukážku hľadať.
 */
type PreviewSong = SongCard & { language?: string };

function normalize(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase()
      .replace(/\b(?:feat|featuring|ft)\.?\b.*$/u, "")
      /**
       * Štylizované mená sa v katalógoch píšu oboma spôsobmi — „P!nk" aj
       * „Pink", „Ke$ha" aj „Kesha". Symbol vnútri slova preto nahradíme
       * písmenom, ktoré zastupuje, inak by sa tá istá interpretka nespárovala.
       * Mimo slova (napr. „Hey Ya!") symbol nič nezastupuje a len vypadne.
       */
      .replace(/([a-z])!([a-z])/g, "$1i$2")
      .replace(/([a-z])\$([a-z])/g, "$1s$2")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
  );
}

function normalizeArtist(value: string) {
  return normalize(value)
    .replace(/\b(?:a|and|und|et|y|e)\b/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Značky verzií, ktoré nie sú originálna nahrávka.
 *
 * Remaster tu zámerne nie je — je to tá istá nahrávka, len premasterovaná, a
 * v katalógoch poskytovateľov je pri starších hitoch často jediná dostupná.
 * Rovnako nie je „radio edit", ktorý je bežne práve singlová verzia originálu.
 */
const NON_ORIGINAL_VERSION =
  /\b(?:live|remix|rmx|mix|karaoke|instrumental|acoustic|unplugged|acapella|cappella|rerecorded|re recorded|taylor s version|sped up|slowed|nightcore|lullaby|mashup|medley|demo|rehearsal|reprise|from the vault|8 bit)\b/u;

/** Interpret, ktorý priamo priznáva, že nejde o originálneho autora. */
const IMPERSONATOR =
  /\b(?:tribute|cover|covers|karaoke|soundalike|made famous|in the style of|as made popular by)\b/u;

/** Meno interpreta kratšie ako toto sa nesmie párovať ako podstring. */
const SHORT_ARTIST_LIMIT = 5;

/** Najkratšie slovo v mene interpreta, ktoré ešte niečo vypovedá o identite. */
const ARTIST_TOKEN_MIN_LENGTH = 4;

/** Slová, ktoré v mene interpreta neurčujú, o koho ide. */
const GENERIC_ARTIST_TOKENS = new Set([
  "band",
  "bands",
  "banda",
  "kapela",
  "skupina",
  "orchestra",
  "orchestre",
  "orchester",
  "orchestr",
  "choir",
  "chorus",
  "zbor",
  "ensemble",
  "quartet",
  "quintet",
  "trio",
  "duo",
  "group",
  "grupo",
  "project",
  "projekt",
  "official",
  "music",
  "musica",
  "sound",
  "sounds",
  "records",
  "brothers",
  "sisters",
  "bratri",
  "family",
  "allstars",
  "stars",
  "team",
  "club",
  "boys",
  "girls",
  "generation",
]);

/** Obsahuje `haystack` celé `needle` ako súvislú sekvenciu slov? */
function containsWords(haystack: string, needle: string) {
  if (!haystack || !needle) return false;
  const hay = haystack.split(" ");
  const need = needle.split(" ");
  if (need.length > hay.length) return false;
  for (let start = 0; start <= hay.length - need.length; start++) {
    if (need.every((word, offset) => hay[start + offset] === word)) return true;
  }
  return false;
}

/**
 * Zdieľajú mená interpretov aspoň jedno výrazné slovo?
 *
 * Poskytovatelia píšu toho istého interpreta rôzne — „Miro Žbirka" verzus
 * „Miroslav Žbirka", „Nedvědi" verzus „Bratři Nedvědi". Doslovná zhoda takú
 * skladbu zahodí, hoci ide o tú istú nahrávku, a hráč zbytočne dostane
 * „ukážka nie je dostupná". Priezvisko naopak zdieľa málokto, takže spolu s
 * presným názvom skladby je to bezpečný mostík.
 */
function sharesArtistToken(expectedArtist: string, actualArtist: string) {
  if (!expectedArtist || !actualArtist) return false;
  const actualTokens = new Set(actualArtist.split(" "));
  return expectedArtist
    .split(" ")
    .some(
      token =>
        token.length >= ARTIST_TOKEN_MIN_LENGTH &&
        !GENERIC_ARTIST_TOKENS.has(token) &&
        actualTokens.has(token)
    );
}

/**
 * Text, ktorý poskytovateľ pridal nad očakávaný názov — typicky „(Live)",
 * „- Remix" alebo „(Taylor's Version)".
 *
 * Značky sa hľadajú len v tomto zvyšku, nie v celom názve. Inak by filter
 * zamietol skladby, ktoré majú dané slovo v samotnom názve, ako „Live and Let
 * Die" alebo „Love Me like You Do".
 */
function versionResidue(expectedTitle: string, actualTitle: string) {
  if (!expectedTitle || !actualTitle) return "";
  const at = actualTitle.indexOf(expectedTitle);
  if (at < 0) return actualTitle;
  return `${actualTitle.slice(0, at)} ${actualTitle.slice(at + expectedTitle.length)}`.trim();
}

/** Je to originálna nahrávka, alebo iná verzia či prevzatie? */
function isOriginalRecording(song: SongCard, title: string, artist: string) {
  const actualArtist = normalizeArtist(artist);
  if (IMPERSONATOR.test(actualArtist)) return false;

  const residue = versionResidue(normalize(song.title), normalize(title));
  return !NON_ORIGINAL_VERSION.test(residue);
}

function matchParts(song: SongCard, title: string, artist: string) {
  const expectedTitle = normalize(song.title);
  const expectedArtist = normalizeArtist(song.artist);
  const actualTitle = normalize(title);
  const actualArtist = normalizeArtist(artist);

  const titleScore =
    expectedTitle && actualTitle
      ? actualTitle === expectedTitle
        ? 6
        : containsWords(actualTitle, expectedTitle) ||
            containsWords(expectedTitle, actualTitle)
          ? 3
          : 0
      : 0;

  const artistExact = Boolean(
    expectedArtist && actualArtist && actualArtist === expectedArtist
  );
  const artistPartial = Boolean(
    expectedArtist &&
    actualArtist &&
    !artistExact &&
    (containsWords(actualArtist, expectedArtist) ||
      containsWords(expectedArtist, actualArtist))
  );
  const artistScore = artistExact ? 4 : artistPartial ? 2 : 0;
  /** Iný zápis toho istého mena — zhoda len na výraznom slove. */
  const artistBridge =
    artistScore === 0 && sharesArtistToken(expectedArtist, actualArtist);

  return {
    titleScore,
    artistScore,
    artistBridge,
    total: titleScore + artistScore + (artistBridge ? 1 : 0),
    /**
     * Krátke mená ako U2, Sia alebo Toto sa ako slovo trafia aj do cudzieho
     * mena („Toto" v „Totó la Momposina"), takže pri nich samotná čiastočná
     * zhoda nestačí.
     */
    weakShortArtist:
      artistPartial && expectedArtist.length < SHORT_ARTIST_LIMIT,
  };
}

function isConfidentMatch(song: SongCard, title: string, artist: string) {
  if (!isOriginalRecording(song, title, artist)) return false;
  const { titleScore, artistScore, artistBridge, weakShortArtist } = matchParts(
    song,
    title,
    artist
  );
  if (titleScore < 3) return false;
  // Iný zápis mena prejde len s úplne presným názvom skladby — pri čiastočnom
  // názve by už bola dvojica príliš voľná a mohla by trafiť cudziu nahrávku.
  if (artistScore < 2) return titleScore === 6 && artistBridge;
  // Pri krátkom mene interpreta pustíme ďalej len presný názov skladby.
  if (weakShortArtist && titleScore < 6) return false;
  return true;
}

/**
 * Vystavené len pre testy — párovanie rozhoduje, či hráč dostane bod, takže
 * jeho pravidlá si zaslúžia vlastné pokrytie.
 */
export const __songMatching = {
  isConfidentMatch,
  isOriginalRecording,
  matchParts,
};

// ── Hľadanie ukážky u poskytovateľov ─────────────────────────────────────────
//
// Jeden dopyt na jeden katalóg je málo. Ukážka sa nenájde aj vtedy, keď u
// poskytovateľa existuje: americký obchod iTunes nemá slovenský ani nemecký
// repertoár, poskytovateľ inak zapisuje diakritiku a niekedy jednoducho
// neodpovedá. Preto sa skúša postupne viac pokusov — striedavo Deezer a
// iTunes, s viacerými variantmi dopytu a s obchodmi podľa jazyka skladby — a
// „nedostupná" padne až vtedy, keď zlyhajú všetky.

type PreviewProvider = "deezer" | "itunes";

interface LookupAttempt {
  provider: PreviewProvider;
  /** Nekódovaný dopyt; kóduje sa až pri stavbe URL. */
  query: string;
  /** Obchod iTunes. Deezer má jediný globálny katalóg, takže ho nepoužíva. */
  country?: string;
}

interface ProviderCandidate {
  title: string;
  artist: string;
  preview: string;
  link: string;
  artwork: string | null;
}

/**
 * Obchody iTunes podľa jazyka skladby.
 *
 * `itunes.apple.com/search` bez `country` prehľadáva výhradne americký obchod,
 * v ktorom väčšina slovenského, českého či nemeckého repertoáru vôbec nie je.
 * Toto bola najčastejšia príčina hlásenia „ukážka nie je dostupná" pri
 * lokálnych hitoch.
 */
const ITUNES_STORES: Record<string, string[]> = {
  sk: ["SK", "CZ", "DE"],
  cs: ["CZ", "SK", "DE"],
  de: ["DE", "AT", "CH"],
  es: ["ES", "MX", "US"],
  fr: ["FR", "BE", "CA"],
  pt: ["PT", "BR", "US"],
  it: ["IT", "DE"],
  pl: ["PL", "DE"],
  hu: ["HU", "SK"],
  sv: ["SE", "GB"],
  nl: ["NL", "BE"],
  en: ["US", "GB"],
  // „other" je najmä svetový/K-pop repertoár; tretí pokus cieli aj na Kóreu.
  other: ["US", "GB", "KR"],
  // Inštrumentálky bývajú najlepšie pokryté vo veľkých US/UK/DE katalógoch.
  instrumental: ["US", "GB", "DE"],
};

/** Svetový repertoár aj neznámy jazyk hľadáme v najväčších obchodoch. */
const DEFAULT_ITUNES_STORES = ["US", "GB"];

/** Koľko výsledkov si vyžiadame. Správna nahrávka nemusí byť prvá. */
const RESULT_LIMIT = 25;

/** Koľko čakáme na jeden pokus, kým ho vzdáme. */
const ATTEMPT_TIMEOUT_MS = 4500;

/** Ako dlho čakáme, kým sa audio reálne pripraví a začne prehrávať. */
const AUDIO_LOAD_TIMEOUT_MS = 8_000;

/** Ako dlho tolerujeme prechodný stalled/abort, kým URL označíme za chybnú. */
const AUDIO_STALL_TIMEOUT_MS = 4_000;

/** Koľko po sebe idúcich infra chýb otvorí circuit breaker. */
const PROVIDER_FAILURE_THRESHOLD = 2;

/** Ako dlho vynechávame poskytovateľa po opakovaných infra chybách. */
const PROVIDER_COOLDOWN_MS = 60_000;

/** Ako dlho si držíme nájdenú ukážku. */
const PREVIEW_TTL_MS = 30 * 60_000;

/** Ako dlho si držíme informáciu, že ukážka neexistuje. */
const MISSING_TTL_MS = 5 * 60_000;

interface ProviderHealth {
  failureStreak: number;
  cooldownUntil: number;
}

const providerHealth = new Map<PreviewProvider, ProviderHealth>();

function healthFor(provider: PreviewProvider) {
  return providerHealth.get(provider) ?? { failureStreak: 0, cooldownUntil: 0 };
}

function providerAvailable(provider: PreviewProvider) {
  return healthFor(provider).cooldownUntil <= Date.now();
}

/** Každá platná JSONP odpoveď dokazuje, že infra providera znovu funguje. */
function recordProviderResponse(provider: PreviewProvider) {
  providerHealth.set(provider, { failureStreak: 0, cooldownUntil: 0 });
}

function recordProviderFailure(provider: PreviewProvider) {
  const previous = healthFor(provider);
  const failureStreak = previous.failureStreak + 1;
  providerHealth.set(provider, {
    failureStreak,
    cooldownUntil:
      failureStreak >= PROVIDER_FAILURE_THRESHOLD
        ? Date.now() + PROVIDER_COOLDOWN_MS
        : previous.cooldownUntil,
  });
}

interface CacheEntry {
  preview: PreviewSource | null;
  expires: number;
}

/**
 * Výsledky hľadania prežijú prechod na inú skladbu.
 *
 * Vďaka tomu sa tá istá skladba nehľadá druhýkrát — či už ju hráč uvidí znova
 * v druhej minihre, alebo sa obrazovka len premontuje — a preskakovanie
 * nedostupných skladieb nestojí ďalšie sekundy čakania.
 */
const previewCache = new Map<string, CacheEntry>();

interface RejectedPreviewEntry {
  urls: Set<string>;
  expires: number;
}

/** Chybné CDN URL sa pre tú istú skladbu počas TTL nesmú vybrať znova. */
const rejectedPreviews = new Map<string, RejectedPreviewEntry>();

function cacheKeyFor(song: PreviewSong) {
  return `${normalize(song.title)}|${normalizeArtist(song.artist)}`;
}

function rejectedUrlsFor(song: PreviewSong) {
  const key = cacheKeyFor(song);
  const entry = rejectedPreviews.get(key);
  if (!entry) return new Set<string>();
  if (entry.expires <= Date.now()) {
    rejectedPreviews.delete(key);
    return new Set<string>();
  }
  return entry.urls;
}

function rejectPreview(song: PreviewSong, url: string) {
  const key = cacheKeyFor(song);
  const cached = previewCache.get(key);
  if (cached?.preview?.url === url) previewCache.delete(key);

  const rejected = rejectedUrlsFor(song);
  rejected.add(url);
  rejectedPreviews.set(key, {
    urls: rejected,
    expires: Date.now() + PREVIEW_TTL_MS,
  });
}

/** `undefined` = ešte sme nehľadali, `null` = hľadali sme a nič nie je. */
function cachedPreview(song: PreviewSong): PreviewSource | null | undefined {
  const key = cacheKeyFor(song);
  const entry = previewCache.get(key);
  if (!entry) return undefined;
  if (entry.expires <= Date.now()) {
    previewCache.delete(key);
    return undefined;
  }
  return entry.preview;
}

function rememberPreview(song: PreviewSong, preview: PreviewSource | null) {
  previewCache.set(cacheKeyFor(song), {
    preview,
    expires: Date.now() + (preview ? PREVIEW_TTL_MS : MISSING_TTL_MS),
  });
}

function itunesStoresFor(song: PreviewSong) {
  return ITUNES_STORES[song.language ?? ""] ?? DEFAULT_ITUNES_STORES;
}

/**
 * Varianty dopytu od najpresnejšieho k najvoľnejšiemu.
 *
 * Odstránená diakritika pomáha katalógom, ktoré tú istú skladbu vedú bez nej,
 * a samotný názov bez interpreta pomáha vtedy, keď má poskytovateľ meno
 * interpreta zapísané inak. Správnosť tým netrpí: interpreta aj tak overuje
 * párovanie odpovede.
 */
function lookupQueries(song: PreviewSong) {
  const queries = [`${song.title} ${song.artist}`];
  const folded =
    `${normalize(song.title)} ${normalizeArtist(song.artist)}`.trim();
  if (folded && folded !== queries[0].toLocaleLowerCase()) queries.push(folded);
  queries.push(song.title);
  return queries;
}

function buildAttempts(song: PreviewSong): LookupAttempt[] {
  const queries = lookupQueries(song);
  const exact = queries[0];
  const titleOnly = queries[queries.length - 1];
  const stores = itunesStoresFor(song);
  const attempts: LookupAttempt[] = [];
  const seen = new Set<string>();

  const add = (attempt: LookupAttempt) => {
    const key = `${attempt.provider}|${attempt.country ?? ""}|${attempt.query}`;
    if (seen.has(key)) return;
    seen.add(key);
    attempts.push(attempt);
  };

  // Poskytovatelia sa striedajú: keby jeden vypadol, druhý dostane šancu hneď
  // a nie až po vyčerpaní všetkých variantov prvého.
  add({ provider: "deezer", query: exact });
  add({ provider: "itunes", query: exact, country: stores[0] });
  for (const query of queries.slice(1, -1)) add({ provider: "deezer", query });
  if (stores[1]) add({ provider: "itunes", query: exact, country: stores[1] });
  add({ provider: "deezer", query: titleOnly });
  add({ provider: "itunes", query: titleOnly, country: stores[0] });
  if (stores[2]) add({ provider: "itunes", query: exact, country: stores[2] });
  return attempts;
}

interface DeezerPayload {
  error?: unknown;
  data?: Array<{
    preview?: string;
    link?: string;
    title?: string;
    artist?: { name?: string };
    album?: { cover_big?: string; cover_medium?: string };
  }>;
}

interface ItunesPayload {
  errorMessage?: string;
  errorCode?: number | string;
  results?: Array<{
    previewUrl?: string;
    trackViewUrl?: string;
    trackName?: string;
    artistName?: string;
    artworkUrl100?: string;
  }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOptionalString(value: unknown) {
  return value === undefined || value === null || typeof value === "string";
}

function isValidDeezerItem(value: unknown) {
  if (!isRecord(value)) return false;
  if (
    !isOptionalString(value.preview) ||
    !isOptionalString(value.link) ||
    !isOptionalString(value.title)
  )
    return false;
  if (value.artist !== undefined && value.artist !== null) {
    if (!isRecord(value.artist) || !isOptionalString(value.artist.name))
      return false;
  }
  if (value.album !== undefined && value.album !== null) {
    if (
      !isRecord(value.album) ||
      !isOptionalString(value.album.cover_big) ||
      !isOptionalString(value.album.cover_medium)
    )
      return false;
  }
  return true;
}

function isValidItunesItem(value: unknown) {
  return (
    isRecord(value) &&
    isOptionalString(value.previewUrl) &&
    isOptionalString(value.trackViewUrl) &&
    isOptionalString(value.trackName) &&
    isOptionalString(value.artistName) &&
    isOptionalString(value.artworkUrl100)
  );
}

function parseDeezer(payload: DeezerPayload): ProviderCandidate[] {
  return (payload.data ?? []).flatMap(item =>
    item.preview
      ? [
          {
            title: item.title ?? "",
            artist: item.artist?.name ?? "",
            preview: item.preview,
            link: item.link ?? "https://www.deezer.com",
            artwork: item.album?.cover_big ?? item.album?.cover_medium ?? null,
          },
        ]
      : []
  );
}

function parseItunes(payload: ItunesPayload): ProviderCandidate[] {
  return (payload.results ?? []).flatMap(item =>
    item.previewUrl
      ? [
          {
            title: item.trackName ?? "",
            artist: item.artistName ?? "",
            preview: item.previewUrl,
            link: item.trackViewUrl ?? "https://music.apple.com",
            // iTunes vracia 100px náhľad; rovnaká cesta vo vyššom rozlíšení je ostrá aj na retine.
            artwork:
              item.artworkUrl100?.replace(
                /\/100x100bb\.jpg$/,
                "/512x512bb.jpg"
              ) ?? null,
          },
        ]
      : []
  );
}

/** Najlepší confident kandidát z odpovede, alebo `null`. */
function pickCandidate(
  song: PreviewSong,
  candidates: ProviderCandidate[],
  rejectedUrls: ReadonlySet<string> = new Set()
) {
  // Najprv sa musia odfiltrovať všetky neisté a predtým pokazené výsledky.
  // Inak môže vysoko skórujúci, ale neconfident kandidát zakryť správny nižší.
  return (
    candidates
      .filter(
        item =>
          !rejectedUrls.has(item.preview) &&
          isConfidentMatch(song, item.title, item.artist)
      )
      .sort(
        (a, b) =>
          matchParts(song, b.title, b.artist).total -
          matchParts(song, a.title, a.artist).total
      )[0] ?? null
  );
}

function attemptUrl(attempt: LookupAttempt, callbackName: string) {
  const query = encodeURIComponent(attempt.query);
  if (attempt.provider === "deezer")
    return `https://api.deezer.com/search?q=${query}&limit=${RESULT_LIMIT}&output=jsonp&callback=${callbackName}`;
  const country = attempt.country ? `&country=${attempt.country}` : "";
  return `https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=${RESULT_LIMIT}${country}&callback=${callbackName}`;
}

interface AttemptHandlers {
  onMatch: (candidate: ProviderCandidate) => void;
  /** Poskytovateľ odpovedal, ale nič dosť isté v odpovedi nebolo. */
  onNoMatch: () => void;
  /** Poskytovateľ zlyhal — timeout, blokovaný skript alebo neplatná API odpoveď. */
  onProviderFailure: () => void;
}

/**
 * Jeden JSONP dopyt.
 *
 * JSONP a nie fetch: ani Deezer, ani iTunes neposielajú hlavičky CORS, takže
 * fetch by skončil na politike prehliadača. Preto sa ani nedá zrušiť —
 * zrušenie znamená iba to, že odpoveď už nikoho nezaujíma.
 */
function runAttempt(
  song: PreviewSong,
  attempt: LookupAttempt,
  handlers: AttemptHandlers
) {
  const callbackName = `__partySongPreview_${attempt.provider}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const jsonpWindow = window as unknown as Record<string, unknown>;
  const script = document.createElement("script");
  let settled = false;

  function settle(next: () => void) {
    if (settled) return;
    settled = true;
    window.clearTimeout(timeout);
    script.remove();
    // Skript sa môže načítať aj po vzdaní pokusu a zavolal by callback, ktorý
    // už neexistuje. Necháme teda prázdny a zmažeme ho až s odstupom.
    const inert = () => undefined;
    jsonpWindow[callbackName] = inert;
    window.setTimeout(() => {
      if (jsonpWindow[callbackName] === inert) delete jsonpWindow[callbackName];
    }, 10_000);
    next();
  }

  const timeout = window.setTimeout(
    () => settle(handlers.onProviderFailure),
    ATTEMPT_TIMEOUT_MS
  );

  jsonpWindow[callbackName] = (rawPayload: unknown) => {
    // API/rate-limit error payload ani malformovaný zoznam nie sú odpoveď
    // „nič sa nenašlo". Provider health sa resetuje až po úspešnom parsovaní.
    if (typeof rawPayload !== "object" || rawPayload === null) {
      settle(handlers.onProviderFailure);
      return;
    }
    const payload = rawPayload as DeezerPayload & ItunesPayload;
    const items =
      attempt.provider === "deezer" ? payload.data : payload.results;
    const hasProviderError =
      attempt.provider === "deezer"
        ? payload.error !== undefined
        : payload.errorMessage !== undefined || payload.errorCode !== undefined;
    const validPayload =
      !hasProviderError &&
      Array.isArray(items) &&
      items.every(item =>
        attempt.provider === "deezer"
          ? isValidDeezerItem(item)
          : isValidItunesItem(item)
      );
    if (!validPayload) {
      settle(handlers.onProviderFailure);
      return;
    }

    let match: ProviderCandidate | null;
    try {
      const candidates =
        attempt.provider === "deezer"
          ? parseDeezer(payload)
          : parseItunes(payload);
      match = pickCandidate(song, candidates, rejectedUrlsFor(song));
    } catch {
      settle(handlers.onProviderFailure);
      return;
    }

    // Až kompletné parsovanie a matching potvrdia zdravú odpoveď providera.
    recordProviderResponse(attempt.provider);
    settle(() => (match ? handlers.onMatch(match) : handlers.onNoMatch()));
  };
  script.src = attemptUrl(attempt, callbackName);
  script.onerror = () => settle(handlers.onProviderFailure);
  document.head.appendChild(script);

  return () => settle(() => undefined);
}

/** Resolves and plays a legal provider-hosted preview without bundling copyrighted audio. */
export function useSongPreview(
  song: PreviewSong | null,
  enabled: boolean,
  maxSeconds = 10
) {
  const [source, setSource] = useState<PreviewSource | null>(null);
  const [status, setStatus] = useState<SongPreviewStatus>("idle");
  const [lookupRevision, setLookupRevision] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCleanupRef = useRef<(() => void) | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const playbackAttemptRef = useRef(0);

  const stop = useCallback((nextStatus: SongPreviewStatus = "ready") => {
    playbackAttemptRef.current += 1;
    if (stopTimerRef.current !== null)
      window.clearTimeout(stopTimerRef.current);
    stopTimerRef.current = null;

    const audio = audioRef.current;
    audioRef.current = null;
    const cleanup = audioCleanupRef.current;
    audioCleanupRef.current = null;
    cleanup?.();
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setStatus(current =>
      current === "missing" || current === "error" ? current : nextStatus
    );
  }, []);

  useEffect(() => {
    stop("idle");
    setSource(null);
    if (!enabled || !song) {
      setStatus("idle");
      return;
    }

    const cached = cachedPreview(song);
    if (cached !== undefined) {
      if (cached) {
        setSource(cached);
        setStatus("ready");
      } else setStatus("missing");
      return;
    }

    const attempts = buildAttempts(song);
    let cancelAttempt: (() => void) | null = null;
    let nextAttempt = 0;
    let noMatchResponses = 0;
    let inconclusive = false;
    let active = true;
    setStatus("loading");

    const runNext = () => {
      if (!active) return;
      while (
        nextAttempt < attempts.length &&
        !providerAvailable(attempts[nextAttempt].provider)
      ) {
        // Preskočený cooldown nie je odpoveď „nič sa nenašlo".
        inconclusive = true;
        nextAttempt++;
      }

      if (nextAttempt >= attempts.length) {
        // Negatívna cache je bezpečná iba po odpovedi no-match na každom
        // naplánovanom pokuse. Jediný timeout, script error alebo cooldown robí
        // celý výsledok inconclusive a UI dostane error, nie auto-skip missing.
        if (!inconclusive && noMatchResponses === attempts.length) {
          rememberPreview(song, null);
          setStatus("missing");
        } else {
          setStatus("error");
        }
        return;
      }

      const attempt = attempts[nextAttempt++];
      cancelAttempt = runAttempt(song, attempt, {
        onMatch: candidate => {
          if (!active) return;
          const preview: PreviewSource = {
            url: candidate.preview,
            link: candidate.link,
            artwork: candidate.artwork,
          };
          rememberPreview(song, preview);
          setSource(preview);
          setStatus("ready");
        },
        onNoMatch: () => {
          noMatchResponses += 1;
          runNext();
        },
        onProviderFailure: () => {
          inconclusive = true;
          recordProviderFailure(attempt.provider);
          runNext();
        },
      });
    };

    runNext();

    return () => {
      active = false;
      cancelAttempt?.();
    };
  }, [enabled, lookupRevision, song, stop]);

  useEffect(
    () => () => {
      playbackAttemptRef.current += 1;
      if (stopTimerRef.current !== null)
        window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
      const audio = audioRef.current;
      audioRef.current = null;
      audioCleanupRef.current?.();
      audioCleanupRef.current = null;
      audio?.pause();
    },
    []
  );

  const play = useCallback(async () => {
    if (!enabled || !song || !source || status === "loading") return false;
    stop("ready");
    const attempt = playbackAttemptRef.current;
    const playingSong = song;
    const playingSource = source;
    const audio = new Audio(playingSource.url);
    audio.preload = "auto";
    audio.volume = 0.8;
    audioRef.current = audio;

    let failed = false;
    let loadTimer: number | null = null;
    let interruptionTimer: number | null = null;
    let resolveInterrupted: (started: false) => void = () => undefined;
    const interrupted = new Promise<false>(resolve => {
      resolveInterrupted = resolve;
    });
    const isCurrent = () =>
      audioRef.current === audio && playbackAttemptRef.current === attempt;
    const clearLoadTimer = () => {
      if (loadTimer !== null) window.clearTimeout(loadTimer);
      loadTimer = null;
    };
    const clearInterruptionTimer = () => {
      if (interruptionTimer !== null) window.clearTimeout(interruptionTimer);
      interruptionTimer = null;
    };

    const cleanup = () => {
      clearLoadTimer();
      clearInterruptionTimer();
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onMediaError);
      audio.removeEventListener("abort", onTransientInterruption);
      audio.removeEventListener("stalled", onTransientInterruption);
      audio.removeEventListener("canplay", onMediaRecovered);
      audio.removeEventListener("playing", onMediaRecovered);
      resolveInterrupted(false);
    };

    const releaseAudio = () => {
      audioRef.current = null;
      if (audioCleanupRef.current === cleanup) audioCleanupRef.current = null;
      cleanup();
      audio.pause();
    };

    const invalidate = () => {
      if (failed || !isCurrent()) return;
      failed = true;
      releaseAudio();
      rejectPreview(playingSong, playingSource.url);
      setSource(current =>
        current?.url === playingSource.url ? null : current
      );
      // Nový lookup uvidí rejected URL a skúsi ďalšieho kandidáta/pokus.
      setStatus("loading");
      setLookupRevision(value => value + 1);
    };

    const restoreReady = () => {
      if (failed || !isCurrent()) return;
      failed = true;
      releaseAudio();
      // NotAllowedError/AbortError ani krátky stalled nedokazujú chybnú URL.
      // Zdroj preto ostáva v cache a používateľ ho môže spustiť ďalším tapom.
      setStatus("ready");
    };

    function onMediaError() {
      // MEDIA_ERR_ABORTED (1) je prerušenie, nie dôkaz zlej CDN URL. Network,
      // decode a unsupported source (2–4) už spoľahlivo znamenajú inú ukážku.
      if (audio.error && audio.error.code > 1) invalidate();
      else onTransientInterruption();
    }

    function onTransientInterruption() {
      if (!isCurrent() || interruptionTimer !== null) return;
      interruptionTimer = window.setTimeout(invalidate, AUDIO_STALL_TIMEOUT_MS);
    }

    function onMediaRecovered() {
      clearInterruptionTimer();
    }

    function onEnded() {
      if (!isCurrent()) return;
      if (stopTimerRef.current !== null)
        window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
      audioRef.current = null;
      if (audioCleanupRef.current === cleanup) audioCleanupRef.current = null;
      cleanup();
      setStatus("ready");
    }

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onMediaError);
    audio.addEventListener("abort", onTransientInterruption);
    audio.addEventListener("stalled", onTransientInterruption);
    audio.addEventListener("canplay", onMediaRecovered);
    audio.addEventListener("playing", onMediaRecovered);
    audioCleanupRef.current = cleanup;
    loadTimer = window.setTimeout(invalidate, AUDIO_LOAD_TIMEOUT_MS);

    const rejectionName = (error: unknown) =>
      typeof error === "object" && error !== null && "name" in error
        ? String((error as { name: unknown }).name)
        : "";
    const confirmsBadSource = (error: unknown) =>
      Boolean(audio.error && audio.error.code > 1) ||
      rejectionName(error) === "NotSupportedError";

    let playPromise: Promise<void>;
    try {
      // Volá sa priamo z používateľovho tapu; lookup už prehrávanie nespúšťa.
      playPromise = audio.play();
    } catch (error) {
      if (confirmsBadSource(error)) invalidate();
      else restoreReady();
      return false;
    }

    let playError: unknown;
    const started = await Promise.race([
      playPromise.then(
        () => true as const,
        error => {
          playError = error;
          return false as const;
        }
      ),
      interrupted,
    ]);
    if (!started) {
      // Stop/unmount je stale. Policy/gesture odmietnutie ponechá platnú URL
      // pripravenú na ďalší tap; iba potvrdená source chyba spustí nový lookup.
      if (isCurrent()) {
        if (confirmsBadSource(playError)) invalidate();
        else restoreReady();
      }
      return false;
    }
    if (!isCurrent()) {
      audio.pause();
      return false;
    }

    clearLoadTimer();
    setStatus("playing");
    stopTimerRef.current = window.setTimeout(
      () => stop("ready"),
      Math.max(3, maxSeconds) * 1000
    );
    return true;
  }, [enabled, maxSeconds, song, source, status, stop]);

  return { status, source, play, stop };
}
