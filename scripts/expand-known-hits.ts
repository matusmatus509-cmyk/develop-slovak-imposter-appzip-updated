/**
 * ── Rozšírenie katalógu o známe skladby známych interpretov ──────────────────
 *
 * Katalóg už obsahuje overene známych interpretov — prešli auditom svetového
 * poolu (`audit-world-pool.mjs`). Ich NAJHRANEJŠIE skladby sú teda tiež známe,
 * a väčšina z nich v katalógu chýba: pri interpretovi ako Coldplay tam boli dve
 * skladby, hoci ich má šesť, ktoré pozná každý.
 *
 * Skript preto pre každého interpreta zo svetového poolu stiahne jeho top
 * skladby a doplní tie, ktoré:
 *
 *   • sa merateľne hrajú (Deezer `rank` nad hranicou — pri neanglických vyššou,
 *     lebo do svetového poolu patria len svetové kusy),
 *   • majú funkčnú ukážku (bez nej je skladba v kvíze nehrateľná),
 *   • nie sú explicitné ani neoriginálne (live, remix, karaoke…),
 *   • v katalógu ešte nie sú — ani pod iným interpretom (ochrana proti coverom).
 *
 * Meno interpreta sa zapisuje TAK, AKO JE V KATALÓGU, nie ako ho vráti Deezer:
 * validátor vyžaduje jednotný zápis, inak by ten istý interpret existoval v
 * dvoch podobách a appka by mu nenašla ukážku.
 *
 *   npx tsx scripts/expand-known-hits.ts           # len report
 *   npx tsx scripts/expand-known-hits.ts --apply   # zapíše knownHits.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  ALL_SONGS,
  GLOBAL_SONGS,
  songIdFor,
  type SongGenre,
} from "../client/src/data/localizedSongs";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUTPUT = path.join(
  ROOT,
  "client/src/data/songExpansions/knownHits.ts",
);
const CACHE = path.join(ROOT, "known-hits-candidates.json");
const APPLY = process.argv.includes("--apply");

/** Hranica „toto pozná každý". Neanglické musia byť svetové, preto vyššie. */
const MIN_RANK_ENGLISH = 600000;
const MIN_RANK_OTHER = 800000;

/**
 * Skladba musí mať odstup, aby sa dala nazvať známou.
 *
 * Deezer `rank` meria AKTUÁLNU hranosť, takže novinka slávneho interpreta ho má
 * vysoký, hoci ju ešte nikto nepozná — takto sa sem dostali „Bonjour, Pardon,
 * Merci" (Céline Dion) či „YAPAQUE" (Farruko). Čerstvé hity do katalógu vstupujú
 * inou cestou: mesačným `update-song-charts.mjs`. Tento skript dopĺňa overený
 * zadný katalóg, takže berie len skladby staršie než tri roky.
 */
const MIN_AGE_YEARS = 3;

/** Najviac skladieb na interpreta, aby katalóg nezaplavil jeden idol. */
const MAX_PER_ARTIST = 6;

const PACE_MS = 130;

/** Neoriginálne nahrávky — rovnaké pravidlo ako vo validátore katalógu. */
const NON_ORIGINAL =
  /\b(?:ao vivo|live|remix|cover|karaoke|tribute|instrumental|acoustic|unplugged|re-?recorded|taylor'?s version|medley|nightcore|mashup|sped ?up|slowed|version|versión|edit|remaster(?:ed)?|demo|reprise|session)\b/i;

const GENRE_MAP: Record<string, SongGenre> = {
  pop: "pop",
  rock: "rock",
  metal: "metal",
  punk: "punk",
  alternative: "indie",
  indie: "indie",
  folk: "folk",
  country: "country",
  "hip hop": "rap",
  "hip-hop": "rap",
  rap: "rap",
  "r&b": "rnb",
  soul: "soul",
  funk: "funk",
  disco: "disco",
  dance: "dance",
  electro: "dance",
  house: "dance",
  techno: "dance",
  latin: "latin",
  reggaeton: "latin",
  reggae: "reggae",
  jazz: "jazz",
  films: "soundtrack",
  soundtrack: "soundtrack",
  schlager: "schlager",
  chanson: "chanson",
  oldies: "oldies",
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** `Titanium (feat. Sia)` → `Titanium`. Kvíz sa pýta na názov, nie na kredity. */
function cleanTitle(raw: string) {
  return raw
    .replace(/\s*[([]\s*(?:feat|ft|with|mit|con|avec|com)\.?\s[^)\]]*[)\]]/gi, "")
    .replace(/\s*-\s*(?:feat|ft)\.?\s.*$/gi, "")
    .replace(/\s*[([]\s*(?:theme|from)\s[^)\]]*[)\]]/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function slug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

async function getJson(url: string): Promise<any> {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "podvodnik-song-expansion/1 (party game catalogue)",
      },
      signal: AbortSignal.timeout(20000),
    });
    if (response.ok) return response.json();
    if (response.status === 429 || response.status >= 500) {
      await sleep(2500 * (attempt + 1));
      continue;
    }
    throw new Error(`HTTP ${response.status}`);
  }
  throw new Error("vzdal som sa po opakovaných pokusoch");
}

interface Candidate {
  title: string;
  artist: string;
  rank: number;
  language: string;
  year: number | null;
  genre: SongGenre | null;
  albumId: number | null;
}

/** Jazyk interpreta podľa toho, ako sú označené jeho skladby v katalógu. */
function artistLanguages() {
  const languages = new Map<string, string>();
  for (const song of ALL_SONGS) {
    const key = slug(song.artist);
    // Ak má interpret skladby vo viacerých jazykoch, rozhoduje prvý neanglický.
    if (!languages.has(key) || (languages.get(key) === "en" && song.language !== "en")) {
      languages.set(key, song.language);
    }
  }
  return languages;
}

/**
 * Všetky skladby zo zdrojových súborov — vrátane ARCHÍVU a zakázaných
 * nahrávok. Bežať len na `ALL_SONGS` nestačí: to sú skladby aktívne v hre,
 * takže by sa do katalógu vrátila „Twist And Shout" (cover, práve vyradený do
 * archívu) len preto, že má inú veľkosť písmen.
 */
function readEverySourceRow() {
  const files = [
    "client/src/data/localizedSongs.ts",
    "client/src/data/songExpansions/chartHits.ts",
    "client/src/data/songExpansions/chartAuto.ts",
    "client/src/data/songExpansions/worldAndEnglish.ts",
    "client/src/data/songExpansions/slovakAndCzech.ts",
    "client/src/data/songExpansions/germanAndFrench.ts",
    "client/src/data/songExpansions/spanishAndPortuguese.ts",
  ];
  const keys = new Set<string>();
  const titleOwners = new Map<string, string>();
  for (const file of files) {
    const text = readFileSync(path.join(ROOT, file), "utf8");
    for (const line of text.split("\n")) {
      const parts = line.split("|");
      if (parts.length < 2) continue;
      const title = parts[0].trim();
      const artist = parts[1].trim();
      if (!title || !artist || title.includes("`") || /[<>{}()=]/.test(title)) continue;
      keys.add(`${slug(artist)}--${slug(title)}`);
      if (!titleOwners.has(slug(title))) titleOwners.set(slug(title), artist);
    }
  }
  return { keys, titleOwners };
}

/** Coververzie, ktoré validátor zakazuje mať v aktívnej zásobe. */
function readRejectedRecordings() {
  const text = readFileSync(path.join(ROOT, "scripts/validate-songs.mjs"), "utf8");
  const block = /REJECTED_ACTIVE_RECORDINGS = new Set\(\n  \[([\s\S]*?)\n  \]/.exec(text);
  const rejected = new Set<string>();
  for (const match of (block?.[1] ?? "").matchAll(/\["(.*?)", "(.*?)"\]/g)) {
    rejected.add(`${slug(match[2])}--${slug(match[1])}`);
  }
  return rejected;
}

/**
 * Kľúče z vlastného výstupu. Skript deduplikuje proti katalógu, ktorého je
 * `knownHits.ts` už súčasťou — bez tohto by sa pri druhom spustení všetko
 * vyhodilo ako duplikát a súbor by sa zmenšil na zlomok.
 */
function readOwnOutputKeys() {
  const keys = new Set<string>();
  try {
    const text = readFileSync(OUTPUT, "utf8");
    for (const line of text.split("\n")) {
      const parts = line.split("|");
      if (parts.length < 2) continue;
      const title = parts[0].trim();
      const artist = parts[1].trim();
      if (!title || !artist || title.includes("`")) continue;
      keys.add(`${slug(artist)}--${slug(title)}`);
    }
  } catch {
    /* prvé generovanie */
  }
  return keys;
}

async function main() {
  const source = readEverySourceRow();
  const rejected = readRejectedRecordings();
  const own = readOwnOutputKeys();
  if (own.size > 0) {
    process.stdout.write(`Vlastný výstup má ${own.size} skladieb — preskočí sa v deduplikácii\n`);
    for (const key of own) source.keys.delete(key);
  }
  process.stdout.write(
    `Zdrojové riadky: ${source.keys.size} · zakázaných nahrávok: ${rejected.size}\n`,
  );
  const existingIds = new Set(
    ALL_SONGS.filter(song => !own.has(`${slug(song.artist)}--${slug(song.title)}`)).map(
      song => song.id,
    ),
  );
  const existingTitles = new Map<string, string>();
  for (const song of ALL_SONGS) {
    const key = `${slug(song.artist)}--${slug(song.title)}`;
    if (own.has(key)) continue;
    existingTitles.set(slug(song.title), song.artist);
  }
  const languages = artistLanguages();

  // Meno interpreta v podobe, akú používa katalóg.
  const catalogueArtists = new Map<string, string>();
  for (const song of GLOBAL_SONGS) catalogueArtists.set(slug(song.artist), song.artist);

  /**
   * Verzia pravidiel zberu. Keď sa zmenia (čistenie názvov, kontrola hlavného
   * interpreta), stará cache je neplatná — inak by sa do katalógu dostali
   * názvy s „(feat. …)" zozbierané podľa starých pravidiel.
   */
  const RULES_VERSION = 4;
  let cached: Candidate[] = [];
  try {
    const previous = JSON.parse(readFileSync(CACHE, "utf8"));
    if (previous?.version === RULES_VERSION) cached = previous.candidates;
    else process.stdout.write("Pravidlá zberu sa zmenili — zbieram odznova\n");
  } catch {
    /* prvý beh */
  }

  let candidates: Candidate[] = cached;
  if (candidates.length === 0) {
    process.stdout.write(
      `Interpretov vo svetovom poole: ${catalogueArtists.size}\n` +
        "Zbieram ich najhranejšie skladby…\n",
    );
    let index = 0;
    for (const [key, artistName] of catalogueArtists) {
      index += 1;
      if (index % 50 === 0) {
        process.stdout.write(`   ${index}/${catalogueArtists.size}\n`);
        writeFileSync(
          CACHE,
          JSON.stringify({ version: RULES_VERSION, candidates }, null, 1),
          "utf8",
        );
      }
      let artistId: number | null = null;
      try {
        const found = await getJson(
          `https://api.deezer.com/search/artist?limit=3&q=${encodeURIComponent(artistName)}`,
        );
        const exact = (found?.data ?? []).find((item: any) => slug(item.name) === key);
        artistId = exact?.id ?? null;
      } catch {
        continue;
      }
      if (!artistId) continue;
      await sleep(PACE_MS);

      let top: any;
      try {
        top = await getJson(
          `https://api.deezer.com/artist/${artistId}/top?limit=15`,
        );
      } catch {
        continue;
      }
      await sleep(PACE_MS);

      const language = languages.get(key) ?? "en";
      // Deezer dáva pod interpreta aj skladby, kde je len hosťom — „Uptown Funk"
      // nájdem pod Brunom Marsom, hoci je to skladba Marka Ronsona. Zapísať ju
      // pod nesprávneho interpreta by v kvíze znamenalo zamietnutú správnu
      // odpoveď, takže beriem len skladby, kde je hlavným interpretom on.
      const minimum = language === "en" ? MIN_RANK_ENGLISH : MIN_RANK_OTHER;
      for (const track of top?.data ?? []) {
        const title = cleanTitle(String(track.title_short ?? track.title ?? ""));
        if (!title || title.includes("|")) continue;
        if (NON_ORIGINAL.test(title)) continue;
        if (track.explicit_lyrics) continue;
        if (!track.preview) continue;
        if ((track.rank ?? 0) < minimum) continue;
        if (slug(track.artist?.name ?? "") !== key) continue;
        const rowKey = `${slug(artistName)}--${slug(title)}`;
        if (existingIds.has(songIdFor(title, artistName))) continue;
        if (source.keys.has(rowKey)) continue; // už je v zdrojoch (aj v archíve)
        if (rejected.has(rowKey)) continue; // zakázaná coververzia
        // Ten istý názov pod iným interpretom = pravdepodobný cover.
        const owner = existingTitles.get(slug(title)) ?? source.titleOwners.get(slug(title));
        if (owner && slug(owner) !== key) continue;
        candidates.push({
          title,
          artist: artistName,
          rank: track.rank ?? 0,
          language,
          year: null,
          genre: null,
          albumId: track.album?.id ?? null,
        });
      }
    }
    writeFileSync(
      CACHE,
      JSON.stringify({ version: RULES_VERSION, candidates }, null, 1),
      "utf8",
    );
  } else {
    process.stdout.write(`Z predchádzajúceho behu mám ${candidates.length} kandidátov\n`);
  }

  // ── Rok vydania: rozhoduje o tom, či je skladba známa alebo len nová ──────
  const withoutYear = candidates.filter(song => song.year === null && song.albumId);
  if (withoutYear.length > 0) {
    process.stdout.write(`\nZisťujem rok vydania (${withoutYear.length} skladieb)…\n`);
    const albumCache = new Map<number, { year: number | null; genre: SongGenre | null }>();
    let done = 0;
    for (const song of withoutYear) {
      done += 1;
      if (done % 100 === 0) {
        process.stdout.write(`   ${done}/${withoutYear.length}\n`);
        writeFileSync(
          CACHE,
          JSON.stringify({ version: RULES_VERSION, candidates }, null, 1),
          "utf8",
        );
      }
      const albumId = song.albumId!;
      if (albumCache.has(albumId)) {
        const cachedAlbum = albumCache.get(albumId)!;
        song.year = cachedAlbum.year;
        song.genre = cachedAlbum.genre;
        continue;
      }
      try {
        const album = await getJson(`https://api.deezer.com/album/${albumId}`);
        const year = Number.parseInt(String(album?.release_date ?? "").slice(0, 4), 10);
        const genreKey = String(album?.genres?.data?.[0]?.name ?? "").toLowerCase();
        const details = {
          year: Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : null,
          genre:
            GENRE_MAP[genreKey] ??
            Object.entries(GENRE_MAP).find(([needle]) => genreKey.includes(needle))?.[1] ??
            null,
        };
        albumCache.set(albumId, details);
        song.year = details.year;
        song.genre = details.genre;
      } catch {
        /* bez roku skladba neprejde vekovým filtrom nižšie */
      }
      await sleep(PACE_MS);
    }
    writeFileSync(
      CACHE,
      JSON.stringify({ version: RULES_VERSION, candidates }, null, 1),
      "utf8",
    );
  }

  const newestAllowed = new Date().getFullYear() - MIN_AGE_YEARS;
  const beforeAge = candidates.length;
  candidates = candidates.filter(song => song.year !== null && song.year <= newestAllowed);
  process.stdout.write(
    `\nVekový filter (vydané do ${newestAllowed}): ${candidates.length} z ${beforeAge}\n`,
  );

  // ── Obmedzenie na interpreta + odstránenie duplikátov v dávke ─────────────
  const perArtist = new Map<string, number>();
  const usedTitles = new Set<string>();
  const accepted: Candidate[] = [];
  for (const candidate of candidates.sort((a, b) => b.rank - a.rank)) {
    const key = slug(candidate.artist);
    if ((perArtist.get(key) ?? 0) >= MAX_PER_ARTIST) continue;
    const titleKey = slug(candidate.title);
    if (usedTitles.has(titleKey)) continue;
    usedTitles.add(titleKey);
    perArtist.set(key, (perArtist.get(key) ?? 0) + 1);
    accepted.push(candidate);
  }

  process.stdout.write(
    `\nKandidátov: ${candidates.length} · po limite ${MAX_PER_ARTIST}/interpreta: ${accepted.length}\n`,
  );
  const distribution = [
    [">= 900k", accepted.filter(song => song.rank >= 900000).length],
    ["800–900k", accepted.filter(song => song.rank >= 800000 && song.rank < 900000).length],
    ["700–800k", accepted.filter(song => song.rank >= 700000 && song.rank < 800000).length],
    ["600–700k", accepted.filter(song => song.rank >= 600000 && song.rank < 700000).length],
  ] as const;
  for (const [label, count] of distribution) {
    process.stdout.write(`   ${label.padEnd(9)} ${count}\n`);
  }
  process.stdout.write("\nNajhranejšie doplnené:\n");
  for (const song of accepted.slice(0, 15)) {
    process.stdout.write(
      `   ${String(song.rank).padStart(7)} · ${song.title} — ${song.artist}\n`,
    );
  }

  if (!APPLY) {
    process.stdout.write("\n(bez --apply sa nič nezapisuje)\n");
    return;
  }

  /**
   * Žáner sa berie z KATALÓGU, nie z albumu.
   *
   * Deezer dáva žáner albumu, čo pri kompiláciách klame: „Dreadlock Holiday"
   * (1978) vyšla na kompilácii z roku 2015 a „Teeth" od 5 Seconds of Summer
   * mala žáner „soundtrack". Interpret má v katalógu skladby už zaradené, takže
   * jeho prevládajúci žáner je spoľahlivejší.
   *
   * Rok sa nezapisuje vôbec — z rovnakého dôvodu. Kvíz rok zobrazuje hráčom a
   * vypísať „Shoot to Thrill, 2014" namiesto 1980 je faktická chyba. Prázdny
   * stĺpec parser znesie a doplní profil interpreta.
   */
  const catalogueGenres = new Map<string, SongGenre>();
  for (const song of ALL_SONGS) {
    if (!song.genre) continue;
    const key = slug(song.artist);
    if (!catalogueGenres.has(key)) catalogueGenres.set(key, song.genre);
  }

  const rows = accepted
    .sort((a, b) =>
      a.artist.localeCompare(b.artist, "sk") || b.rank - a.rank,
    )
    .map(song => {
      const genre = catalogueGenres.get(slug(song.artist)) ?? song.genre ?? "";
      const flags = genre === "rap" ? "nohum" : "hum";
      // Title|Artist|<rok prázdny>|Genre|Tier|Flags
      return [song.title, song.artist, "", genre, "easy", flags].join("|");
    });

  const languageOverrides = accepted
    .filter(song => song.language !== "en")
    .reduce<Record<string, string>>((map, song) => {
      map[song.artist] = song.language;
      return map;
    }, {});

  const today = new Date().toISOString().slice(0, 10);
  const file = `/**
 * GENERATED — najhranejšie skladby interpretov, ktorí už v katalógu sú.
 * Posledná aktualizácia: ${today}.
 *
 * Interpreti prešli auditom svetového poolu, takže sú overene známi; tu sa
 * dopĺňajú ich ďalšie skladby, ktoré pozná partia, ale v katalógu chýbali.
 *
 * Každý riadok má: hranosť nad ${MIN_RANK_ENGLISH / 1000}k na Deezeri
 * (neanglické nad ${MIN_RANK_OTHER / 1000}k), funkčnú ukážku, neexplicitný text
 * a originálnu nahrávku. Najviac ${MAX_PER_ARTIST} skladby na interpreta.
 *
 * Regenerácia: \`npx tsx scripts/expand-known-hits.ts --apply\`.
 * Tento súbor sa neupravuje ručne.
 */

export const KNOWN_HITS_SONG_EXPANSION = String.raw\`
${rows.join("\n")}
\`;

/** Interpreti, ktorí nespievajú po anglicky — jazyk pre výber obchodu ukážok. */
export const KNOWN_HITS_ARTIST_LANGUAGES: Record<string, string> = ${JSON.stringify(
    languageOverrides,
    null,
    2,
  )};

export const KNOWN_HITS_FETCHED_AT = "${today}";
`;

  writeFileSync(OUTPUT, file, "utf8");
  process.stdout.write(
    `\n✓ Zapísaných ${rows.length} skladieb do ${path.relative(ROOT, OUTPUT)}\n`,
  );
}

main().catch(error => {
  process.stderr.write(`\nRozšírenie zlyhalo: ${error.message}\n`);
  process.exitCode = 1;
});
