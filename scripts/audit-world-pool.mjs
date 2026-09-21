/**
 * ── Audit svetového poolu hudobného kvízu ───────────────────────────────────
 *
 * Svetový pool má byť „to, čo pozná celá partia" — primárne anglické hity a z
 * iných jazykov len skutočne svetové kusy (Despacito, Gangnam Style, 99
 * Luftballons). Posúdiť 1 400 skladieb odhadom nejde, preto sa merajú dva
 * nezávislé signály:
 *
 *  1. **Deezer `rank`** (0–1 000 000) — koľko sa skladba dnes reálne hrá.
 *     Odpovedá na „je to živá skladba, alebo zapadnutá položka z archívu".
 *
 *  2. **Počet jazykových verzií článku na Wikipédii** — koľko národov o
 *     skladbe píše. Toto je jediný signál, ktorý oddelí SVETOVÚ slávu od
 *     domácej: nemecký hit „Atemlos" má na Deezeri viac fanúšikov než „99
 *     Luftballons", ale Wikipédia má prvý v ~4 jazykoch a druhý v 25.
 *
 * Wikipédia sa pýta len tam, kde to rozhoduje (neanglické skladby a anglický
 * chvost s nízkym rankom), aby audit nebežal hodinu.
 *
 * Skript nič nemení — zapíše `world-pool-audit.json` a vypíše rozdelenie.
 * Sieť je nutná, preto nepatrí do CI.
 *
 *   node scripts/audit-world-pool.mjs            # aktívny svetový pool
 *   node scripts/audit-world-pool.mjs archive    # archív (čo vrátiť do hry)
 *
 * Režim `archive` meria skladby, ktoré hra dnes NEPOUŽÍVA (bulkom doplnené
 * `*_EXTENDED` a `*_EXPANSION` zoznamy). Tie s dokázanou svetovou hranosťou
 * sa dajú vrátiť do aktívneho poolu — archív bol vyradený celý naraz, takže
 * sú v ňom aj slávne skladby.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MODE = process.argv[2] === "archive" ? "archive" : "active";
const REPORT = path.join(
  ROOT,
  MODE === "archive" ? "world-archive-audit.json" : "world-pool-audit.json",
);

const UA = "podvodnik-song-audit/1 (party game catalogue QA)";
const DEEZER_PACE_MS = 120;
const WIKI_PACE_MS = 900;

/** Anglický chvost pod týmto rankom dostane druhú šancu na Wikipédii. */
const LOW_RANK = 250000;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function normalize(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

async function getJson(url, headers = {}) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(url, {
      headers: { accept: "application/json", "user-agent": UA, ...headers },
      signal: AbortSignal.timeout(20000),
    });
    if (response.ok) return response.json();
    if (response.status === 429 || response.status === 403 || response.status >= 500) {
      await sleep(3000 * (attempt + 1));
      continue;
    }
    throw new Error(`HTTP ${response.status}`);
  }
  throw new Error("vzdal som sa po opakovaných pokusoch");
}

// ── Aktívny svetový pool zo zdrojov ──────────────────────────────────────────
/**
 * Zdroje aktívneho svetového poolu: kurátorované `WORLD_HITS`, ručne dopĺňané
 * `chartHits.ts` a automaticky generovaná časť `chartAuto.ts`. Archívne
 * `*_EXTENDED` sekcie sa do hry nedostanú, takže ich audit nezaujíma.
 */
function readWorldPool() {
  const songs = [];

  const localized = readFileSync(
    path.join(ROOT, "client/src/data/localizedSongs.ts"),
    "utf8",
  );
  const worldStart = localized.indexOf("const WORLD_HITS = parseSongs(`");
  const worldEnd = localized.indexOf("`,", worldStart);
  pushRows(localized.slice(worldStart, worldEnd), "WORLD_HITS", songs);

  const chartHits = readFileSync(
    path.join(ROOT, "client/src/data/songExpansions/chartHits.ts"),
    "utf8",
  );
  pushRows(chartHits, "chartHits", songs);

  const chartAuto = readFileSync(
    path.join(ROOT, "client/src/data/songExpansions/chartAuto.ts"),
    "utf8",
  );
  const autoWorld = /CHART_AUTO_SONG_EXPANSION = String\.raw`\n([\s\S]*?)`;/.exec(
    chartAuto,
  );
  if (autoWorld) pushRows(autoWorld[1], "chartAuto", songs);

  return songs;
}

/** Archívne sekcie — dnes sa do hry nedostanú. */
function readWorldArchive() {
  const songs = [];
  const localized = readFileSync(
    path.join(ROOT, "client/src/data/localizedSongs.ts"),
    "utf8",
  );
  const extended = /const WORLD_HITS_EXTENDED = parseSongs\(`([\s\S]*?)`/.exec(localized);
  if (extended) pushRows(extended[1], "WORLD_HITS_EXTENDED", songs);

  const worldAndEnglish = readFileSync(
    path.join(ROOT, "client/src/data/songExpansions/worldAndEnglish.ts"),
    "utf8",
  );
  for (const name of ["WORLD_SONG_EXPANSION", "ENGLISH_SONG_EXPANSION"]) {
    const block = new RegExp(`${name} = String.raw\`([\\s\\S]*?)\``).exec(worldAndEnglish);
    if (block) pushRows(block[1], name, songs);
  }
  return songs;
}

function pushRows(block, source, songs) {
  for (const line of block.split("\n")) {
    const row = line.trim();
    if (!row || row.startsWith("//") || row.startsWith("/*") || row.startsWith("*")) {
      continue;
    }
    const parts = row.split("|");
    if (parts.length < 2) continue;
    const [title, artist, year, genre, tier, flags = ""] = parts.map(part => part.trim());
    if (!title || !artist || title.includes("`")) continue;
    const langFlag = /lang=([a-z]{2})/.exec(flags);
    songs.push({
      source,
      row,
      title,
      artist,
      year: year ? Number.parseInt(year, 10) : null,
      genre: genre || null,
      tier: tier || null,
      language: langFlag ? langFlag[1] : "en",
    });
  }
}

// ── Signál 1: ako často sa skladba hrá ───────────────────────────────────────
async function deezerRank(song) {
  const advanced = `track:"${song.title}" artist:"${song.artist}"`;
  for (const query of [advanced, `${song.title} ${song.artist}`]) {
    let data;
    try {
      data = await getJson(
        `https://api.deezer.com/search?limit=5&q=${encodeURIComponent(query)}`,
      );
    } catch {
      return { rank: null, matched: false, error: true };
    }
    const titleKey = normalize(song.title);
    const artistKey = normalize(song.artist);
    const hit = (data?.data ?? []).find(track => {
      const foundTitle = normalize(track.title_short ?? track.title ?? "");
      const foundArtist = normalize(track.artist?.name ?? "");
      return (
        (foundTitle === titleKey ||
          foundTitle.startsWith(titleKey) ||
          titleKey.startsWith(foundTitle)) &&
        (foundArtist.includes(artistKey) || artistKey.includes(foundArtist))
      );
    });
    if (hit) return { rank: hit.rank ?? 0, matched: true, error: false };
  }
  return { rank: null, matched: false, error: false };
}

/**
 * Druhý zdroj. Keď Deezer skladbu nenájde, neznamená to, že je neznáma —
 * môže ísť o odlišný zápis interpreta. iTunes je nezávislé potvrdenie, či
 * skladba vôbec existuje; až keď ju nenájde ani on, je „nenájdená" dôkaz.
 */
async function itunesExists(song) {
  for (const store of ["US", "GB"]) {
    let data;
    try {
      data = await getJson(
        "https://itunes.apple.com/search?media=music&entity=song&limit=10" +
          `&country=${store}&term=${encodeURIComponent(`${song.title} ${song.artist}`)}`,
      );
    } catch {
      return null; // limit alebo výpadok — nevieme
    }
    const titleKey = normalize(song.title);
    const artistKey = normalize(song.artist);
    const hit = (data?.results ?? []).find(item => {
      const foundTitle = normalize(item.trackName ?? "");
      const foundArtist = normalize(item.artistName ?? "");
      return (
        (foundTitle.includes(titleKey) || titleKey.includes(foundTitle)) &&
        (foundArtist.includes(artistKey) || artistKey.includes(foundArtist))
      );
    });
    if (hit) return true;
  }
  return false;
}

/**
 * Interpreti lokálnych poolov. Skladba takého interpreta patrí do svetového
 * poolu len vtedy, keď je svetovo známa (Despacito áno, „Láska moja" nie),
 * takže sa jej meria sláva na Wikipédii. Anglický lokálny pool sa vynecháva —
 * ten sa so svetovým prekrýva zámerne.
 */
function readNonEnglishLocalArtists() {
  const text = readFileSync(
    path.join(ROOT, "client/src/data/localizedSongs.ts"),
    "utf8",
  );
  const block = text.slice(
    text.indexOf("const LOCAL_HITS"),
    text.indexOf("const WORLD_HITS_EXTENDED"),
  );
  const artists = new Map();
  for (const section of block.matchAll(/(\w{2}): parseSongs\(`([\s\S]*?)`/g)) {
    const [, language, rows] = section;
    if (language === "en") continue;
    for (const line of rows.split("\n")) {
      const parts = line.split("|");
      if (parts.length < 2) continue;
      artists.set(normalize(parts[1]), language);
    }
  }
  return artists;
}

// ── Signál 2: o koľkých národoch je skladba téma ─────────────────────────────
async function wikipediaLanguages(song) {
  let search;
  try {
    search = await getJson(
      "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json" +
        `&srlimit=3&srsearch=${encodeURIComponent(`"${song.title}" ${song.artist} song`)}`,
    );
  } catch {
    return { languages: null, article: null, error: true };
  }
  const hits = search?.query?.search ?? [];
  if (hits.length === 0) return { languages: 0, article: null, error: false };

  // Článok musí spomínať interpreta, inak ide o zhodu názvu s niečím iným.
  const artistKey = normalize(song.artist);
  const candidate =
    hits.find(hit => normalize(hit.snippet ?? "").includes(artistKey.split(" ")[0])) ??
    hits[0];

  let details;
  try {
    details = await getJson(
      "https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&format=json" +
        `&lllimit=500&redirects=1&titles=${encodeURIComponent(candidate.title)}`,
    );
  } catch {
    return { languages: null, article: candidate.title, error: true };
  }
  const pages = details?.query?.pages ?? {};
  const page = Object.values(pages)[0] ?? {};
  return {
    languages: (page.langlinks?.length ?? 0) + 1,
    article: candidate.title,
    error: false,
  };
}

// ── Audit ────────────────────────────────────────────────────────────────────
/**
 * Audit beží desiatky minút, takže si výsledky pamätá: pri opakovanom spustení
 * dopočíta len to, čo ešte nemá. Bez toho by prerušenie zmazalo celú prácu.
 */
function loadCache() {
  try {
    const previous = JSON.parse(readFileSync(REPORT, "utf8"));
    return new Map(previous.map(song => [`${song.source}::${song.row}`, song]));
  } catch {
    return new Map();
  }
}

const pool = MODE === "archive" ? readWorldArchive() : readWorldPool();
const localArtists = readNonEnglishLocalArtists();
for (const song of pool) {
  song.localArtistLanguage = localArtists.get(normalize(song.artist)) ?? null;
}
const cache = loadCache();
if (cache.size > 0) {
  process.stdout.write(`Z predchádzajúceho behu mám ${cache.size} meraní\n`);
  for (const song of pool) {
    const previous = cache.get(`${song.source}::${song.row}`);
    if (!previous) continue;
    if (previous.rank !== undefined) {
      song.rank = previous.rank;
      song.deezerMatched = previous.deezerMatched;
      song.deezerError = previous.deezerError;
    }
    if (previous.itunesExists !== undefined) {
      song.itunesExists = previous.itunesExists;
    }
    if (previous.wikiLanguages !== undefined && !previous.wikiError) {
      song.wikiLanguages = previous.wikiLanguages;
      song.wikiArticle = previous.wikiArticle;
      song.wikiError = false;
    }
  }
}

function save() {
  writeFileSync(REPORT, JSON.stringify(pool, null, 1), "utf8");
}
process.stdout.write(
  `${MODE === "archive" ? "Archív (mimo hry)" : "Aktívny svetový pool"}: ${pool.length} skladieb\n`,
);
const bySource = pool.reduce((counts, song) => {
  counts[song.source] = (counts[song.source] ?? 0) + 1;
  return counts;
}, {});
process.stdout.write(`  ${JSON.stringify(bySource)}\n\n`);

process.stdout.write("1/2 Meriam, ako často sa skladby hrajú (Deezer)…\n");
const needsDeezer = pool.filter(song => song.rank === undefined);
let index = 0;
for (const song of needsDeezer) {
  const { rank, matched, error } = await deezerRank(song);
  song.rank = rank;
  song.deezerMatched = matched;
  song.deezerError = error;
  index += 1;
  if (index % 100 === 0) {
    process.stdout.write(`   ${index}/${needsDeezer.length}\n`);
    save();
  }
  await sleep(DEEZER_PACE_MS);
}
save();

const needsItunes = pool.filter(
  song => !song.deezerMatched && song.itunesExists === undefined,
);
if (needsItunes.length > 0) {
  process.stdout.write(
    `\n1b/2 Domeriavam ${needsItunes.length} skladieb, ktoré Deezer nenašiel (iTunes)…\n`,
  );
  index = 0;
  for (const song of needsItunes) {
    song.itunesExists = await itunesExists(song);
    index += 1;
    if (index % 25 === 0) {
      process.stdout.write(`   ${index}/${needsItunes.length}\n`);
      save();
    }
    await sleep(2500);
  }
  save();
}

const needsWiki = pool.filter(
  song =>
    song.wikiLanguages === undefined &&
    (song.language !== "en" ||
      song.localArtistLanguage !== null ||
      !song.deezerMatched ||
      (song.rank !== null && song.rank < LOW_RANK)),
);
process.stdout.write(
  `\n2/2 Overujem svetovú slávu na Wikipédii (${needsWiki.length} skladieb)…\n`,
);
index = 0;
for (const song of needsWiki) {
  const { languages, article, error } = await wikipediaLanguages(song);
  song.wikiLanguages = languages;
  song.wikiArticle = article;
  song.wikiError = error;
  index += 1;
  if (index % 25 === 0) {
    process.stdout.write(`   ${index}/${needsWiki.length}\n`);
    save();
  }
  await sleep(WIKI_PACE_MS);
}
save();

// ── Rozdelenie ───────────────────────────────────────────────────────────────
const buckets = [
  ["nenašlo sa na Deezeri", song => !song.deezerMatched],
  ["rank < 100k", song => song.rank !== null && song.rank < 100000],
  ["rank 100–250k", song => song.rank !== null && song.rank >= 100000 && song.rank < 250000],
  ["rank 250–500k", song => song.rank !== null && song.rank >= 250000 && song.rank < 500000],
  ["rank 500–750k", song => song.rank !== null && song.rank >= 500000 && song.rank < 750000],
  ["rank ≥ 750k", song => song.rank !== null && song.rank >= 750000],
];
process.stdout.write("\nRozdelenie podľa hranosti:\n");
for (const [label, test] of buckets) {
  process.stdout.write(`  ${label.padEnd(22)} ${pool.filter(test).length}\n`);
}

const nonEnglish = pool.filter(song => song.language !== "en");
process.stdout.write(`\nNeanglických skladieb: ${nonEnglish.length}\n`);
for (const song of nonEnglish.sort(
  (a, b) => (b.wikiLanguages ?? 0) - (a.wikiLanguages ?? 0),
)) {
  process.stdout.write(
    `  ${String(song.wikiLanguages ?? "?").padStart(3)} jazykov · ` +
      `rank ${String(song.rank ?? "?").padStart(7)} · ${song.title} — ${song.artist}\n`,
  );
}

if (MODE === "archive") {
  /**
   * Návrat do hry si zaslúži skladba s dokázanou svetovou hranosťou. Hranica
   * 600k na Deezeri je „hrá sa všade"; klasika s menším streamom sa pustí, keď
   * o nej píše aspoň 8 jazykových Wikipédií.
   */
  const promote = pool.filter(
    song =>
      (song.rank ?? 0) >= 600000 ||
      ((song.rank ?? 0) >= 350000 && (song.wikiLanguages ?? 0) >= 8),
  );
  process.stdout.write(
    `\nNa vrátenie do hry: ${promote.length} z ${pool.length}\n`,
  );
  for (const song of promote
    .slice()
    .sort((a, b) => (b.rank ?? 0) - (a.rank ?? 0))
    .slice(0, 25)) {
    process.stdout.write(
      `  rank ${String(song.rank ?? "?").padStart(7)} · ${song.title} — ${song.artist}\n`,
    );
  }
  writeFileSync(
    path.join(ROOT, "world-pool-promotions.json"),
    JSON.stringify(
      promote.map(song => ({
        source: song.source,
        row: song.row,
        title: song.title,
        artist: song.artist,
        rank: song.rank,
        wiki: song.wikiLanguages ?? null,
      })),
      null,
      1,
    ),
    "utf8",
  );
  process.stdout.write("→ world-pool-promotions.json\n");
}

process.stdout.write(`\n✓ Podrobný report: ${path.relative(ROOT, REPORT)}\n`);
