#!/usr/bin/env node
/**
 * ── Automatická aktualizácia hudobného katalógu ─────────────────────────────
 *
 * Stiahne aktuálne rebríčky najhranejších skladieb a vygeneruje
 * `client/src/data/songExpansions/chartAuto.ts`. Spúšťa sa samo raz mesačne
 * (`.github/workflows/update-song-charts.yml`), ručne cez `npm run update:songs`.
 *
 * Čo robí inak než predchádzajúca verzia:
 *
 *  1. Berie rebríčky pre VŠETKY trhy hry, nie len sedem — a rozdeľuje ich do
 *     svetového aj jazykových poolov, takže sa dopĺňa `world`, `sk`, `cs`,
 *     `de`, `es`, `fr` aj `pt`. Predtým všetko padalo do svetového poolu.
 *  2. Nesie SKUTOČNÉ metadáta: žáner a rok vydania z Apple feedu namiesto
 *     paušálneho `pop` a roku odhadnutého z aktuálneho dátumu.
 *  3. Overí, že skladba má funkčnú ukážku — hľadá ju tým istým spôsobom ako
 *     appka (`useSongPreview`: `title artist` v obchode podľa jazyka). Skladby
 *     bez ukážky sa do katalógu vôbec nedostanú, takže v kvíze ubudne
 *     preskakovanie „Beriem ďalšiu pesničku…".
 *  4. Medzinárodné hity z lokálnych rebríčkov posiela do svetového poolu a v
 *     lokálnom ponechá len domácich interpretov. Slovenský rebríček je plný
 *     anglických hitov — tie do poolu „Slovenské hity" nepatria.
 *
 * Bez siete skript skončí chybou a vygenerovaný súbor zostane nezmenený, takže
 * hra vždy beží aspoň na poslednej stiahnutej a ručne kurátorovanej zásobe.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUTPUT = path.join(
  ROOT,
  "client/src/data/songExpansions/chartAuto.ts",
);
const CURATED_SOURCES = [
  "client/src/data/localizedSongs.ts",
  "client/src/data/songExpansions/chartHits.ts",
  "client/src/data/songExpansions/worldAndEnglish.ts",
  "client/src/data/songExpansions/slovakAndCzech.ts",
  "client/src/data/songExpansions/germanAndFrench.ts",
  "client/src/data/songExpansions/spanishAndPortuguese.ts",
];

/** Koľko riadkov najviac vygenerovať pre jednotlivé pooly. */
const MAX_WORLD_ROWS = 220;
const MAX_LOCAL_ROWS = 70;

/** Do tejto pozície v rebríčku je skladba „všeobecne známa" → tier `easy`. */
const EASY_RANK_LIMIT = 25;

/**
 * Strop pre rap. Rebríčky sú dnes zaplavené rapom a rap sa nehmká, takže bez
 * stropu by „Zahmkaj pesničku" z nových skladieb nedostala ani jednu.
 *
 * Ostatné žánre stropu nepodliehajú zámerne: pop je presne to, čo pozná celá
 * partia, a 40 % strop na všetko ho predtým zrezal na 88 skladieb, čím zbytočne
 * obmedzil rast svetového poolu.
 */
const MAX_RAP_SHARE = 0.3;
const CAPPED_GENRES = new Set(["rap"]);

const REQUEST_TIMEOUT_MS = 20000;

/**
 * Trhy rebríčkov. `pool` je cieľový jazykový pool pre domácich interpretov,
 * `world: true` znamená, že trh sám je zdrojom svetových hitov.
 */
const MARKETS = [
  { country: "us", pool: null, world: true },
  { country: "gb", pool: null, world: true },
  { country: "sk", pool: "sk" },
  { country: "cz", pool: "cs" },
  { country: "de", pool: "de" },
  { country: "at", pool: "de" },
  { country: "ch", pool: "de" },
  { country: "es", pool: "es" },
  { country: "mx", pool: "es" },
  { country: "ar", pool: "es" },
  { country: "co", pool: "es" },
  { country: "fr", pool: "fr" },
  { country: "be", pool: "fr" },
  { country: "ca", pool: "fr" },
  { country: "br", pool: "pt" },
  { country: "pt", pool: "pt" },
];

/** Obchody iTunes na overenie ukážky — zhodné s `ITUNES_STORES` v appke. */
const PREVIEW_STORES = {
  en: ["US", "GB"],
  sk: ["SK", "CZ", "DE"],
  cs: ["CZ", "SK", "DE"],
  de: ["DE", "AT", "CH"],
  es: ["ES", "MX", "US"],
  fr: ["FR", "BE", "CA"],
  pt: ["PT", "BR"],
};

/** Žánre povolené parserom katalógu (`SongGenre` v `localizedSongs.ts`). */
const GENRE_MAP = new Map(
  Object.entries({
    pop: "pop",
    "k-pop": "pop",
    "j-pop": "pop",
    "dance pop": "pop",
    rock: "rock",
    "alternative rock": "rock",
    "hard rock": "rock",
    metal: "metal",
    "heavy metal": "metal",
    punk: "punk",
    alternative: "indie",
    indie: "indie",
    "indie pop": "indie",
    "singer/songwriter": "folk",
    folk: "folk",
    country: "country",
    "hip-hop/rap": "rap",
    "hip hop": "rap",
    rap: "rap",
    "r&b/soul": "rnb",
    rnb: "rnb",
    soul: "soul",
    funk: "funk",
    disco: "disco",
    dance: "dance",
    electronic: "dance",
    house: "dance",
    techno: "dance",
    "dance/electronic": "dance",
    latin: "latin",
    "latin pop": "latin",
    "latin urban": "latin",
    reggaeton: "latin",
    "musica mexicana": "latin",
    "música mexicana": "latin",
    regional: "latin",
    "regional mexicano": "latin",
    reggae: "reggae",
    jazz: "jazz",
    soundtrack: "soundtrack",
    "original score": "soundtrack",
    schlager: "schlager",
    "german pop": "schlager",
    chanson: "chanson",
    "french pop": "chanson",
    "worldwide": "pop",
    world: "pop",
    brazilian: "latin",
    sertanejo: "latin",
    mpb: "latin",
    pagode: "latin",
    forró: "latin",
    funk: "funk",
  }),
);

/** Rap sa nehmká — v „Zahmkaj pesničku" by bol nehrateľný. */
const NON_HUMMABLE_GENRES = new Set(["rap"]);

/**
 * Skladby s týmito slovami v názve nie sú originálna nahrávka (live, remix,
 * karaoke…) — rovnaké pravidlo má validátor katalógu, takže by ich aj tak
 * odmietol.
 */
const VERSION_WORDS =
  /\b(live|ao vivo|en vivo|en directo|remix|mix|version|versión|versao|versão|karaoke|cover|instrumental|acoustic|acústico|akustik|unplugged|session|sesión|sped up|slowed|nightcore|edit|reprise|remaster|remastered|demo|medley|mashup|tribute|orchestral|radio edit)\b/i;

/** Chvosty, ktoré sa dajú z názvu bezpečne odstrihnúť. */
const TRIM_TAILS = [
  /\s*[([]\s*feat\.?[^)\]]*[)\]]/gi,
  /\s*[([]\s*ft\.?[^)\]]*[)\]]/gi,
  /\s*[([]\s*(with|mit|con|avec|com|feat)\s[^)\]]*[)\]]/gi,
  /\s+-\s+(radio\s+edit|single\s+version|album\s+version)\s*$/gi,
  // Soundtrackové prívesky: „(From „Film")", „(from GTAVI: The Album)".
  // Bez odstrihnutia appka ukážku nenájde — hľadá presný názov.
  /\s*[([]\s*from\s[^)\]]*[)\]]/gi,
];

function log(message) {
  process.stdout.write(`${message}\n`);
}

function normalizeKey(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function cleanTitle(raw) {
  let title = raw;
  for (const pattern of TRIM_TAILS) title = title.replace(pattern, "");
  return title.replace(/\s{2,}/g, " ").trim();
}

/**
 * Kvíz sa pýta na interpreta, takže zoznam štyroch spoluautorov je nefér
 * odpoveď — aj pre hľadanie ukážky je horší než samotné hlavné meno. Reže sa
 * len pri čiarke: dvojice ako „Simon & Garfunkel" alebo „Angus & Julia Stone"
 * sú jeden interpret a musia zostať celé.
 */
function cleanArtist(raw) {
  const artist = raw.replace(/\s{2,}/g, " ").trim();
  return artist.includes(",") ? artist.split(",")[0].trim() : artist;
}

/**
 * Písmo mimo latinky (thajčina, kórejčina, čínština, cyrilika, arabčina).
 * Takú skladbu hráči v slovenskej, nemeckej či španielskej partii nepoznajú a
 * appka ju navyše nevie spoľahlivo vyhľadať — do katalógu nepatrí. Do
 * lokálnych rebríčkov sa občas dostane (napr. thajský hit v brazílskom).
 */
const NON_LATIN = /[\u0400-\u04ff\u0600-\u06ff\u0e00-\u0e7f\u1100-\u11ff\u2e80-\u9fff\uac00-\ud7af]/;

/** Riadok katalógu je oddelený `|`, takže zvislá čiara v texte ho rozbije. */
function isRowSafe(value) {
  return (
    value.length > 0 &&
    value.length <= 80 &&
    !value.includes("|") &&
    !NON_LATIN.test(value)
  );
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "podvodnik-song-chart-updater/2 (+https://github.com)",
      accept: "application/json",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

/**
 * Apple „most-played" feed. Nesie žáner aj dátum vydania, takže riadky majú
 * skutočné metadáta. Staršie RSS `topsongs` slúži ako záloha — Apple ho síce
 * označil za prekonané, ale stále odpovedá.
 */
async function fetchAppleChart(country) {
  try {
    const data = await fetchJson(
      `https://rss.marketingtools.apple.com/api/v2/${country}/music/most-played/100/songs.json`,
    );
    const results = data?.feed?.results ?? [];
    return results.map((entry, index) => ({
      trackId: String(entry.id ?? ""),
      title: entry.name ?? "",
      artist: entry.artistName ?? "",
      genre: entry.genres?.find(genre => genre.name !== "Music")?.name ?? null,
      year: Number.parseInt(String(entry.releaseDate ?? "").slice(0, 4), 10),
      rank: index + 1,
    }));
  } catch (error) {
    log(`  · most-played pre ${country} zlyhal (${error.message}), skúšam RSS`);
    const data = await fetchJson(
      `https://itunes.apple.com/${country}/rss/topsongs/limit=100/json`,
    );
    const entries = data?.feed?.entry ?? [];
    return entries.map((entry, index) => ({
      trackId: String(entry.id?.attributes?.["im:id"] ?? ""),
      title: entry["im:name"]?.label ?? "",
      artist: entry["im:artist"]?.label ?? "",
      genre: entry.category?.attributes?.label ?? null,
      year: Number.parseInt(
        String(entry["im:releaseDate"]?.label ?? "").slice(0, 4),
        10,
      ),
      rank: index + 1,
    }));
  }
}

/** Deezer global chart — druhý zdroj svetových hitov, iná metodika než Apple. */
async function fetchDeezerChart() {
  const data = await fetchJson("https://api.deezer.com/chart/0/tracks?limit=100");
  return (data?.data ?? []).map((track, index) => ({
    trackId: "",
    // Deezer dáva URL ukážky priamo v rebríčku, takže netreba overovať.
    preview: typeof track.preview === "string" && track.preview.length > 0,
    title: track.title_short ?? track.title ?? "",
    artist: track.artist?.name ?? "",
    genre: null,
    year: Number.parseInt(String(track.album?.release_date ?? "").slice(0, 4), 10),
    rank: index + 1,
  }));
}

/**
 * Dávkové overenie ukážok. iTunes `lookup` zvládne až 200 ID naraz, takže na
 * celý rebríček stačí jedna požiadavka — hľadanie po jednej skladbe narážalo
 * na limit požiadaviek a falošne označilo väčšinu skladieb za nedostupné.
 *
 * Odpoveď zároveň nesie presnejšie metadáta než feed (`primaryGenreName`,
 * `releaseDate`, `trackExplicitness`), takže sa použijú na doplnenie žánru a
 * roku a na vyradenie explicitných skladieb.
 */
async function lookupTracks(trackIds, store) {
  const found = new Map();
  for (let index = 0; index < trackIds.length; index += 150) {
    const batch = trackIds.slice(index, index + 150);
    if (batch.length === 0) continue;
    try {
      const data = await fetchJson(
        "https://itunes.apple.com/lookup?entity=song" +
          `&country=${store}&id=${batch.join(",")}`,
      );
      for (const item of data?.results ?? []) {
        if (!item.previewUrl) continue;
        // Explicitné texty sa v párty hre pre celú partiu nehrajú.
        if (item.trackExplicitness === "explicit") continue;
        found.set(String(item.trackId), {
          genre: item.primaryGenreName ?? null,
          year: Number.parseInt(String(item.releaseDate ?? "").slice(0, 4), 10),
        });
      }
    } catch (error) {
      log(`  · lookup ${store} zlyhal (${error.message})`);
    }
  }
  return found;
}

/** Interpreti, ktorých už kurátorovaný katalóg pozná — podľa jazyka. */
async function readCuratedCatalog() {
  const titles = new Set();
  const pairs = new Set();
  const artistsByLanguage = new Map();

  const localized = await readFile(
    path.join(ROOT, "client/src/data/localizedSongs.ts"),
    "utf8",
  );

  // Interpreti lokálnych poolov sa čítajú zo sekcií `LOCAL_HITS`, aby sa dalo
  // rozhodnúť, či je skladba z lokálneho rebríčka domáca alebo medzinárodná.
  const localHits = localized.slice(localized.indexOf("const LOCAL_HITS"));
  const sectionPattern = /(\w{2}):\s*parseSongs\(`([\s\S]*?)`/g;
  let section;
  while ((section = sectionPattern.exec(localHits)) !== null) {
    const [, language, block] = section;
    const artists = artistsByLanguage.get(language) ?? new Set();
    for (const line of block.split("\n")) {
      const parts = line.split("|");
      if (parts.length < 2) continue;
      artists.add(normalizeKey(parts[1]));
    }
    artistsByLanguage.set(language, artists);
  }

  for (const relative of CURATED_SOURCES) {
    const text = await readFile(path.join(ROOT, relative), "utf8");
    for (const line of text.split("\n")) {
      const parts = line.split("|");
      if (parts.length < 2) continue;
      const title = parts[0].trim();
      const artist = parts[1].trim();
      if (!title || !artist || title.includes("`") || /[<>{}]/.test(title)) continue;
      titles.add(normalizeKey(title));
      pairs.add(`${normalizeKey(artist)}::${normalizeKey(title)}`);
    }
  }

  return { titles, pairs, artistsByLanguage };
}

function mapGenre(rawGenre) {
  if (!rawGenre) return null;
  const key = rawGenre.trim().toLowerCase();
  if (GENRE_MAP.has(key)) return GENRE_MAP.get(key);
  for (const [needle, genre] of GENRE_MAP) {
    if (key.includes(needle)) return genre;
  }
  return null;
}

function buildRow({ title, artist, year, genre, rank, language, isWorldRow }) {
  const resolvedGenre = genre ?? "pop";
  const tier = rank <= EASY_RANK_LIMIT ? "easy" : "medium";
  const flags = [NON_HUMMABLE_GENRES.has(resolvedGenre) ? "nohum" : "hum"];
  // Svetový pool je anglický, takže `lang=` sa uvádza len pri výnimke.
  if (isWorldRow && language !== "en") flags.push(`lang=${language}`);
  return `${title}|${artist}|${year}|${resolvedGenre}|${tier}|${flags.join(" ")}`;
}

async function main() {
  const curated = await readCuratedCatalog();
  log(
    `Kurátorovaný katalóg: ${curated.pairs.size} skladieb, ` +
      `${curated.titles.size} unikátnych názvov`,
  );

  // ── 1) Stiahnutie rebríčkov ───────────────────────────────────────────────
  const charts = [];
  for (const market of MARKETS) {
    try {
      const entries = await fetchAppleChart(market.country);
      charts.push({ market, entries });
      log(`✓ ${market.country}: ${entries.length} skladieb`);
    } catch (error) {
      log(`✗ ${market.country}: ${error.message}`);
    }
  }
  try {
    const entries = await fetchDeezerChart();
    charts.push({ market: { country: "deezer", pool: null, world: true }, entries });
    log(`✓ deezer: ${entries.length} skladieb`);
  } catch (error) {
    log(`✗ deezer: ${error.message}`);
  }

  if (charts.length === 0) {
    throw new Error("Nepodarilo sa stiahnuť ani jeden rebríček");
  }

  // ── 1b) Overenie ukážok a doplnenie metadát ───────────────────────────────
  // Jedna dávková požiadavka na trh. Skladba bez ukážky sa do katalógu
  // nedostane, takže hra na nej neuvisne.
  for (const { market, entries } of charts) {
    if (market.country === "deezer") {
      for (const entry of entries) entry.playable = entry.preview === true;
      const count = entries.filter(entry => entry.playable).length;
      log(`  · deezer: ${count}/${entries.length} s ukážkou`);
      continue;
    }
    const ids = entries.map(entry => entry.trackId).filter(Boolean);
    const found = await lookupTracks(ids, market.country.toUpperCase());
    for (const entry of entries) {
      const details = found.get(entry.trackId);
      entry.playable = Boolean(details);
      if (!details) continue;
      // Metadáta z lookupu sú presnejšie než z feedu.
      if (details.genre) entry.genre = details.genre;
      if (Number.isInteger(details.year)) entry.year = details.year;
    }
    const count = entries.filter(entry => entry.playable).length;
    log(`  · ${market.country}: ${count}/${entries.length} s ukážkou`);
  }

  // ── 2) Kandidáti: čo je v medzinárodných rebríčkoch, patrí do `world` ─────
  const internationalTitles = new Set();
  const internationalArtists = new Set();
  for (const { market, entries } of charts) {
    if (!market.world) continue;
    for (const entry of entries) {
      internationalTitles.add(normalizeKey(cleanTitle(entry.title)));
      internationalArtists.add(normalizeKey(cleanArtist(entry.artist ?? "")));
    }
  }

  const candidates = new Map();
  for (const { market, entries } of charts) {
    for (const entry of entries) {
      if (!entry.playable) continue;
      const title = cleanTitle(entry.title ?? "");
      const artist = cleanArtist(entry.artist ?? "");
      if (!isRowSafe(title) || !isRowSafe(artist)) continue;
      if (VERSION_WORDS.test(title)) continue;

      const titleKey = normalizeKey(title);
      const pairKey = `${normalizeKey(artist)}::${titleKey}`;
      // Kurátorovaný katalóg má prednosť — vrátane coververzií pod tým istým
      // názvom, aby sa v hre neobjavili dve verzie tej istej skladby.
      if (curated.pairs.has(pairKey) || curated.titles.has(titleKey)) continue;

      const localArtists = market.pool
        ? (curated.artistsByLanguage.get(market.pool) ?? new Set())
        : new Set();
      const isKnownLocalArtist = localArtists.has(normalizeKey(artist));
      // Interpret, ktorý hrá vo svetových rebríčkoch, nie je domáci — aj keď
      // sa práve touto skladbou dostal len do jedného lokálneho rebríčka.
      // (Takto skončila Miley Cyrus v portugalskom poole a appka jej ukážku
      // hľadala v portugalskom obchode.)
      const isInternational =
        market.world ||
        internationalTitles.has(titleKey) ||
        internationalArtists.has(normalizeKey(artist));

      // Medzinárodný hit ide do svetového poolu aj vtedy, keď ho hra našla v
      // lokálnom rebríčku. Do lokálneho poolu patrí len to, čo je doma.
      const targetPool = isInternational && !isKnownLocalArtist ? "world" : market.pool;
      if (!targetPool) continue;
      const language = targetPool === "world" ? "en" : targetPool;

      const year = Number.isInteger(entry.year) && entry.year >= 1900 && entry.year <= 2100
        ? entry.year
        : new Date().getFullYear();

      const existing = candidates.get(pairKey);
      if (existing && existing.rank <= entry.rank) continue;
      candidates.set(pairKey, {
        title,
        artist,
        year,
        genre: mapGenre(entry.genre),
        rank: entry.rank,
        pool: targetPool,
        language,
        titleKey,
      });
    }
  }
  log(`Kandidátov po odstránení duplikátov: ${candidates.size}`);

  // ── 3) Rozdelenie do poolov a limity ──────────────────────────────────────
  // Poradie podľa rebríčka: najznámejšie skladby sa do limitu zmestia prvé.
  const playable = [...candidates.values()].sort((a, b) => a.rank - b.rank);
  const usedTitles = new Set();
  const byPool = new Map();
  const genreCounts = new Map();
  for (const candidate of playable) {
    // Ten istý názov nechceme v dvoch pooloch (typicky lokálny vs svetový).
    if (usedTitles.has(candidate.titleKey)) continue;
    const limit = candidate.pool === "world" ? MAX_WORLD_ROWS : MAX_LOCAL_ROWS;
    const rows = byPool.get(candidate.pool) ?? [];
    if (rows.length >= limit) continue;

    const genre = candidate.genre ?? "pop";
    const genreKey = `${candidate.pool}:${genre}`;
    const genreCount = genreCounts.get(genreKey) ?? 0;
    if (
      CAPPED_GENRES.has(genre) &&
      genreCount >= Math.ceil(limit * MAX_RAP_SHARE)
    ) {
      continue;
    }

    usedTitles.add(candidate.titleKey);
    genreCounts.set(genreKey, genreCount + 1);
    rows.push(
      buildRow({
        ...candidate,
        isWorldRow: candidate.pool === "world",
      }),
    );
    byPool.set(candidate.pool, rows);
  }

  const worldRows = byPool.get("world") ?? [];
  const localPools = ["sk", "cs", "de", "es", "fr", "pt"];
  const summary = [`world ${worldRows.length}`];
  for (const pool of localPools) {
    summary.push(`${pool} ${(byPool.get(pool) ?? []).length}`);
  }
  log(`Vygenerované riadky: ${summary.join(", ")}`);

  if (worldRows.length === 0) {
    throw new Error("Svetový pool by zostal prázdny — generovanie zrušené");
  }

  // ── 4) Zápis ──────────────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const localBlocks = localPools
    .map(pool => {
      const rows = byPool.get(pool) ?? [];
      return `  ${pool}: String.raw\`\n${rows.join("\n")}${rows.length ? "\n" : ""}\`,`;
    })
    .join("\n");

  const file = `/**
 * GENERATED — aktuálne rebríčky najhranejších skladieb (Apple Music
 * „most-played" pre ${MARKETS.length} trhov + Deezer global chart).
 * Posledná aktualizácia: ${today}.
 *
 * Tento súbor sa neupravuje ručne. Regenerácia: \`npm run update:songs\`
 * (mesačne aj automaticky, pozri .github/workflows/update-song-charts.yml).
 *
 * Každá skladba tu má overenú ukážku — generátor ju pred zápisom hľadá tým
 * istým spôsobom ako appka, takže v kvíze neubieha na „Beriem ďalšiu
 * pesničku…". Metadáta (žáner, rok) sú zo zdrojového feedu, nie odhadnuté.
 */

/** Svetové hity — dopĺňajú pool „Svetové hity". */
export const CHART_AUTO_SONG_EXPANSION = String.raw\`
${worldRows.join("\n")}
\`;

/**
 * Domáce hity podľa spievaného jazyka — dopĺňajú jazykové pooly. Medzinárodné
 * skladby z lokálnych rebríčkov tu nie sú, tie idú do svetového poolu.
 */
export const CHART_AUTO_LOCAL_EXPANSIONS: Partial<Record<string, string>> = {
${localBlocks}
};

export const CHART_AUTO_FETCHED_AT = "${today}";
`;

  await writeFile(OUTPUT, file, "utf8");
  log(`\n✓ Zapísané do ${path.relative(ROOT, OUTPUT)}`);
}

main().catch(error => {
  process.stderr.write(`\nAktualizácia rebríčkov zlyhala: ${error.message}\n`);
  process.exitCode = 1;
});
