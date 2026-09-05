/**
 * Automatická aktualizácia hudobného kvízu z reálnych rebríčkov.
 *
 * Stiahne aktuálne top skladby (iTunes RSS pre SK/US/GB/DE/FR/ES/BR +
 * Deezer global chart), vyhodiť duplikáty voči kurátorovanému katalógu
 * (chartHits.ts a tento súbor) a vygeneruje `chartAuto.ts`.
 *
 * Spúšťa sa cez `npm run update:songs` — napríklad pred vydaním alebo
 * cez GitHub Action raz mesačne. Bez prístupu na internet zlyhá s
 * jasnou hláškou a neskorší build ostáva nedotknutý.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const CHART_HITS_PATH = "client/src/data/songExpansions/chartHits.ts";
const CHART_AUTO_PATH = "client/src/data/songExpansions/chartAuto.ts";
const MAX_ROWS = 150;

const ITUNES_CHARTS = [
  "sk", "us", "gb", "de", "fr", "es", "br",
];

const normalize = (value) =>
  String(value)
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
const normalizeAscii = (value) =>
  normalize(value).normalize("NFD").replace(/[̀-ͯ]/g, "");

function existingKeysFromRows(source, regex) {
  const keys = new Set();
  for (const match of source.matchAll(regex)) {
    const [, title, artist] = match;
    keys.add(normalizeAscii(`${artist}|${title}`));
  }
  return keys;
}

// Kurátorované riadky: `Názov|Interpret|Rok|Žáner|Tier|hum` (chartHits)
// aj dvojstĺpcové jadro (`Názov|Interpret`) v localizedSongs.
const curatedSources = ["client/src/data/localizedSongs.ts", CHART_HITS_PATH];
const curated = curatedSources
  .filter(existsSync)
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");
const CURATED_TITLE_ROW =
  /^([^|\n]+)\|([^|\n]+)(?:\|\d{4}\|[a-z]+\|\w+\|hum)?$/gm;
const knownTitles = new Set(
  [...curated.matchAll(CURATED_TITLE_ROW)].map((m) => normalizeAscii(m[1])),
);

const knownKeys = new Set([
  ...existingKeysFromRows(curated, /^([^|\n]+)\|([^|\n]+)\|(?:\d{4}\|[a-z]+\|\w+\|hum)$/gm),
  ...existingKeysFromRows(curated, /^([^|\n]+)\|([^|\n]+)$/gm),
]);

if (existsSync(CHART_AUTO_PATH)) {
  const previous = readFileSync(CHART_AUTO_PATH, "utf8");
  for (const match of previous.matchAll(/^([^|\n]+)\|([^|\n]+)\|\d{4}\|/gm)) {
    knownKeys.add(normalizeAscii(`${match[2]}|${match[1]}`));
  }
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "slovak-imposter-song-updater/1.0" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

function fromItunes(json, country) {
  const entries = json?.feed?.entry ?? [];
  return entries.map((entry) => {
    const title = entry["im:name"]?.label ?? "";
    const artist = entry["im:artist"]?.label ?? "";
    const year = Number((entry["im:releaseDate"]?.label ?? "").slice(0, 4)) || 2026;
    return { title, artist, year, source: `itunes-${country}` };
  });
}

function fromDeezer(json) {
  return (json?.data ?? []).map((track) => ({
    title: track.title ?? "",
    artist: track.artist?.name ?? "",
    year: Number((track.album?.release_date ?? "").slice(0, 4)) || 2026,
    source: "deezer",
  }));
}

const charts = [];
for (const country of ITUNES_CHARTS) {
  const url = `https://itunes.apple.com/${country}/rss/topsongs/limit=100/json`;
  const json = await fetchJson(url);
  charts.push(...fromItunes(json, country));
  console.log(`itunes/${country}: ${charts.length} spolu`);
}
const deezer = await fetchJson("https://api.deezer.com/chart/0/tracks?limit=100");
charts.push(...fromDeezer(deezer));
console.log(`deezer: ${charts.length} spolu`);

// čisté, známe, hrateľné položky: bez feat. múrov, bez duet s neznámymi
// menami, bez explicitných verzií s dlhými názvami verzií.
const seen = new Set();
const fresh = [];
for (const entry of charts) {
  const clean = (value) =>
    String(value).replace(/\|/g, " ").replace(/\s+/g, " ").trim();
  const title = clean(entry.title).replace(/\s*[-–(]\s*(feat|with|radio edit|single version|remix).*$/i, "");
  const artist = clean(entry.artist);
  if (!title || !artist) continue;
  if (/(feat\.|featuring|remix|edit|version|live|mix)/i.test(title)) continue;
  const key = normalizeAscii(`${artist}|${title}`);
  if (knownKeys.has(key) || seen.has(key)) continue;
  // cover verzie známych skladieb vynechaj — kvíz by zamietol správnu odpoveď
  const titleKey = normalizeAscii(title);
  if (knownTitles.has(titleKey)) continue;
  seen.add(key);
  fresh.push({ title, artist, year: Math.max(2015, entry.year) });
  if (fresh.length >= MAX_ROWS) break;
}

console.log(`nových skladieb: ${fresh.length}`);

// Jazykové prepisy z kurátorovaných modulov — pre flag lang=xx v riadkoch.
const ARTIST_LANG_RE =
  /["']?([^:"'\n]+)["']?:\s*"(sk|cs|de|es|fr|pt|it|other|pl|hu|nl|sv)"/g;
const artistLanguages = new Map();
for (const file of [
  CHART_HITS_PATH,
  "client/src/data/songExpansions/worldAndEnglish.ts",
]) {
  if (!existsSync(file)) continue;
  for (const match of readFileSync(file, "utf8").matchAll(ARTIST_LANG_RE)) {
    artistLanguages.set(normalizeAscii(match[1]), match[2]);
  }
}

const generatedAt = new Date().toISOString().slice(0, 10);
const rows = fresh.map((song) => {
  const lang = artistLanguages.get(normalizeAscii(song.artist));
  return `${song.title}|${song.artist}|${song.year}|pop|medium|hum${lang ? ` lang=${lang}` : ""}`;
});
const file = `/**
 * GENERATED — automaticky stiahnuté aktuálne rebríčky (iTunes RSS +
 * Deezer global chart), posledná aktualizácia ${generatedAt}.
 *
 * Tento súbor sa nemá upravovať ručne. Regenerácia: \`npm run update:songs\`.
 * Riadky majú plné metadáta, aby s nimi fungoval výber aj ukážky.
 */
export const CHART_AUTO_SONG_EXPANSION = String.raw\`
${rows.join("\n")}
\`;

export const CHART_AUTO_FETCHED_AT = "${generatedAt}";
`;

writeFileSync(CHART_AUTO_PATH, file);
console.log(`zapísané ${CHART_AUTO_PATH} (${fresh.length} riadkov, ${generatedAt})`);
