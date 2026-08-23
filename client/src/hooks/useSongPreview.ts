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
};

/** Svetový repertoár aj neznámy jazyk hľadáme v najväčších obchodoch. */
const DEFAULT_ITUNES_STORES = ["US", "GB"];

/** Koľko výsledkov si vyžiadame. Správna nahrávka nemusí byť prvá. */
const RESULT_LIMIT = 25;

/** Koľko čakáme na jeden pokus, kým ho vzdáme. */
const ATTEMPT_TIMEOUT_MS = 4500;

/** Ako dlho vynechávame poskytovateľa, ktorý sa vôbec neozval. */
const PROVIDER_COOLDOWN_MS = 60_000;

/** Ako dlho si držíme nájdenú ukážku. */
const PREVIEW_TTL_MS = 30 * 60_000;

/** Ako dlho si držíme informáciu, že ukážka neexistuje. */
const MISSING_TTL_MS = 5 * 60_000;

const providerCooldown = new Map<PreviewProvider, number>();

function providerAvailable(provider: PreviewProvider) {
  return (providerCooldown.get(provider) ?? 0) <= Date.now();
}

function suspendProvider(provider: PreviewProvider) {
  providerCooldown.set(provider, Date.now() + PROVIDER_COOLDOWN_MS);
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

function cacheKeyFor(song: PreviewSong) {
  return `${normalize(song.title)}|${normalizeArtist(song.artist)}`;
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
  data?: Array<{
    preview?: string;
    link?: string;
    title?: string;
    artist?: { name?: string };
    album?: { cover_big?: string; cover_medium?: string };
  }>;
}

interface ItunesPayload {
  results?: Array<{
    previewUrl?: string;
    trackViewUrl?: string;
    trackName?: string;
    artistName?: string;
    artworkUrl100?: string;
  }>;
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

/** Najlepší kandidát z odpovede, alebo `null`, keď ani jeden nie je istý. */
function pickCandidate(song: PreviewSong, candidates: ProviderCandidate[]) {
  // Neoriginálne verzie sa vyhadzujú ešte pred zoradením. Keby sa filtrovali
  // až po ňom, „(Live)" s rovnakým skóre by mohol vyhrať nad použiteľným
  // originálom a zamietnutie by zahodilo obe.
  const match = candidates
    .filter(item => isOriginalRecording(song, item.title, item.artist))
    .sort(
      (a, b) =>
        matchParts(song, b.title, b.artist).total -
        matchParts(song, a.title, a.artist).total
    )[0];
  return match && isConfidentMatch(song, match.title, match.artist)
    ? match
    : null;
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
  /** Poskytovateľ sa vôbec neozval — blokovaný, offline alebo zaseknutý. */
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

  jsonpWindow[callbackName] = (payload: DeezerPayload & ItunesPayload) => {
    const candidates =
      attempt.provider === "deezer"
        ? parseDeezer(payload)
        : parseItunes(payload);
    const match = pickCandidate(song, candidates);
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const playbackAttemptRef = useRef(0);

  const stop = useCallback((nextStatus: SongPreviewStatus = "ready") => {
    playbackAttemptRef.current += 1;
    if (stopTimerRef.current !== null)
      window.clearTimeout(stopTimerRef.current);
    stopTimerRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
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
    let providerAnswered = false;
    let active = true;
    setStatus("loading");

    const runNext = () => {
      if (!active) return;
      while (
        nextAttempt < attempts.length &&
        !providerAvailable(attempts[nextAttempt].provider)
      )
        nextAttempt++;

      if (nextAttempt >= attempts.length) {
        // Že ukážka neexistuje, si pamätáme len keď poskytovateľ naozaj
        // odpovedal. Pri vypadnutej sieti by sa inak celá zásoba označila za
        // nedostupnú a ukážky by nefungovali ani po obnovení pripojenia.
        if (providerAnswered) rememberPreview(song, null);
        setStatus("missing");
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
          providerAnswered = true;
          runNext();
        },
        onProviderFailure: () => {
          suspendProvider(attempt.provider);
          runNext();
        },
      });
    };

    runNext();

    return () => {
      active = false;
      cancelAttempt?.();
    };
  }, [enabled, song, stop]);

  useEffect(
    () => () => {
      playbackAttemptRef.current += 1;
      if (stopTimerRef.current !== null)
        window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
      audioRef.current?.pause();
      audioRef.current = null;
    },
    []
  );

  const play = useCallback(async () => {
    if (!enabled || !source || status === "loading") return false;
    stop("ready");
    const attempt = playbackAttemptRef.current;
    const audio = new Audio(source.url);
    audio.preload = "auto";
    audio.volume = 0.8;
    audioRef.current = audio;
    audio.addEventListener(
      "ended",
      () => {
        if (
          audioRef.current !== audio ||
          playbackAttemptRef.current !== attempt
        )
          return;
        audioRef.current = null;
        setStatus("ready");
      },
      { once: true }
    );
    try {
      await audio.play();
      if (
        audioRef.current !== audio ||
        playbackAttemptRef.current !== attempt
      ) {
        audio.pause();
        return false;
      }
      setStatus("playing");
      stopTimerRef.current = window.setTimeout(
        () => stop("ready"),
        Math.max(3, maxSeconds) * 1000
      );
      return true;
    } catch {
      if (audioRef.current !== audio || playbackAttemptRef.current !== attempt)
        return false;
      audioRef.current = null;
      setStatus("error");
      return false;
    }
  }, [enabled, maxSeconds, source, status, stop]);

  return { status, source, play, stop };
}
