/**
 * Overí, že automaticky doplnené skladby appka v hre naozaj nájde.
 *
 * Generátor (`update-song-charts.mjs`) kontroluje ukážku podľa ID skladby v
 * Apple katalógu. Hra ju ale hľadá TEXTOM — „názov interpret" — a nájdený
 * výsledok ešte prepúšťa cez prísne porovnanie, ktoré zamieta coververzie,
 * imitátorov a live nahrávky. Medzi „ukážka existuje" a „hra ju nájde" je
 * teda rozdiel a práve ten tu meriame.
 *
 * Aby sa netestovala ručná kópia pravidiel, porovnávacia logika sa vyreže
 * priamo z `useSongPreview.ts` a preloží — rovnaký postup ako v
 * `verify-song-preview-lookup.mjs`. Na rozdiel od neho tento skript SIEŤ
 * používa, takže sa nehodí do CI; je to kontrola kvality dát na vyžiadanie:
 *
 *   node scripts/verify-chart-previews.mjs [chartAuto|knownHits] [počet na pool]
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(ROOT, "client/src/hooks/useSongPreview.ts");
/**
 * Oba generované zoznamy: mesačné rebríčky aj doplnený zadný katalóg známych
 * interpretov. Prepínač na prvom mieste argumentov zúži kontrolu na jeden.
 */
const GENERATED_FILES = {
  chartAuto: path.join(ROOT, "client/src/data/songExpansions/chartAuto.ts"),
  knownHits: path.join(ROOT, "client/src/data/songExpansions/knownHits.ts"),
};
const WHICH = process.argv.find(arg => arg in GENERATED_FILES) ?? "chartAuto";
const GENERATED = GENERATED_FILES[WHICH];
const SAMPLE_PER_POOL = Number.parseInt(
  process.argv.find(arg => /^\d+$/.test(arg)) ?? "8",
  10,
);
const TMP = path.join(tmpdir(), "chart-preview-check");

/** Obchody podľa jazyka — zhodné s `ITUNES_STORES` v appke. */
const STORES = {
  en: ["US", "GB"],
  sk: ["SK", "CZ", "DE"],
  cs: ["CZ", "SK", "DE"],
  de: ["DE", "AT", "CH"],
  es: ["ES", "MX", "US"],
  fr: ["FR", "BE", "CA"],
  pt: ["PT", "BR"],
};

// ── Porovnávacia logika priamo zo zdroja appky ───────────────────────────────
function loadMatching() {
  const src = readFileSync(SOURCE, "utf8");
  const start = src.indexOf("interface PreviewSource {");
  const end = src.indexOf("/** Resolves and plays");
  if (start < 0 || end < 0) {
    throw new Error(`Nenašiel som blok porovnávania v ${SOURCE}`);
  }
  mkdirSync(TMP, { recursive: true });
  const entry = path.join(TMP, "matching.ts");
  writeFileSync(
    entry,
    `interface SongCard { title: string; artist: string }\n` +
      src.slice(start, end) +
      `\nexport { isConfidentMatch };\n`,
    "utf8",
  );
  execFileSync(
    "npx",
    [
      "tsc",
      entry,
      "--target",
      "es2022",
      "--module",
      "es2022",
      "--moduleResolution",
      "bundler",
      "--skipLibCheck",
      "--outDir",
      TMP,
    ],
    { cwd: ROOT, stdio: "pipe" },
  );
  return import(path.join(TMP, "matching.js"));
}

function parseGenerated() {
  const text = readFileSync(GENERATED, "utf8");
  const pools = new Map();

  const world = /(?:CHART_AUTO|KNOWN_HITS)_SONG_EXPANSION = String\.raw`\n([\s\S]*?)`;/.exec(text);
  if (world) pools.set("en", rows(world[1]));

  const localBlock = /CHART_AUTO_LOCAL_EXPANSIONS[^{]*\{([\s\S]*?)\n\};/.exec(text);
  if (localBlock) {
    for (const match of localBlock[1].matchAll(
      /(\w{2}): String\.raw`\n([\s\S]*?)`,/g,
    )) {
      pools.set(match[1], rows(match[2]));
    }
  }
  return pools;
}

function rows(block) {
  return block
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [title, artist] = line.split("|");
      return { title, artist };
    });
}

/** Vzorka rovnomerne z celého poolu, nie len zo začiatku. */
function sample(items, count) {
  if (items.length <= count) return items;
  const step = items.length / count;
  return Array.from({ length: count }, (_, index) => items[Math.floor(index * step)]);
}

function foldDiacritics(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

/** Dopyty v tom istom poradí ako `lookupQueries` v appke. */
function queriesFor(song) {
  const exact = `${song.title} ${song.artist}`;
  const folded = foldDiacritics(exact);
  const queries = [exact];
  if (folded !== exact) queries.push(folded);
  queries.push(song.title);
  return queries;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * iTunes search má limit požiadaviek a po jeho prekročení vracia 403 s HTML.
 * Keby sa to počítalo ako „skladba sa nenašla", výsledok merania by bol
 * nezmysel — presne to sa raz stalo (84 % namiesto 99 %). Preto sa 403 a
 * chyby siete hlásia ako NEROZHODNUTÉ a skript pri nich spomalí.
 */
async function searchItunes(term, store) {
  const url =
    "https://itunes.apple.com/search?media=music&entity=song&limit=25" +
    `&country=${store}&term=${encodeURIComponent(term)}`;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    });
    if (response.ok) {
      const text = await response.text();
      try {
        return { results: JSON.parse(text)?.results ?? [] };
      } catch {
        return { inconclusive: true };
      }
    }
    if (response.status === 403 || response.status === 429 || response.status >= 500) {
      await sleep(20000 * (attempt + 1));
      continue;
    }
    return { inconclusive: true };
  }
  return { inconclusive: true };
}

async function findsPreview(song, language, isConfidentMatch) {
  const stores = STORES[language] ?? STORES.en;
  let sawAnswer = false;
  for (const store of stores) {
    for (const term of queriesFor(song)) {
      const { results, inconclusive } = await searchItunes(term, store);
      if (inconclusive) continue;
      sawAnswer = true;
      const hit = results.find(
        item =>
          item.previewUrl &&
          isConfidentMatch(song, item.trackName ?? "", item.artistName ?? ""),
      );
      if (hit) return { found: true, store, term };
      // Rozumná pauza medzi dopytmi — limit je pár desiatok za minútu.
      await sleep(1200);
    }
  }
  return { found: false, inconclusive: !sawAnswer };
}

const { isConfidentMatch } = await loadMatching();
const pools = parseGenerated();

let found = 0;
let missed = 0;
let inconclusive = 0;
const failures = [];

for (const [language, songs] of pools) {
  const picked = sample(songs, SAMPLE_PER_POOL);
  const results = [];
  for (const song of picked) {
    const outcome = await findsPreview(song, language, isConfidentMatch);
    if (outcome.found) {
      found += 1;
      results.push("✓");
    } else if (outcome.inconclusive) {
      inconclusive += 1;
      results.push("?");
    } else {
      missed += 1;
      results.push("✗");
      failures.push(`${language}: ${song.title} — ${song.artist}`);
    }
  }
  process.stdout.write(
    `${language.padEnd(3)} ${results.join("")}  ` +
      `${results.filter(mark => mark === "✓").length}/${picked.length}\n`,
  );
}

const answered = found + missed;
process.stdout.write(
  `\nHra nájde ukážku pre ${found} z ${answered} skladieb ` +
    `(${Math.round((found / Math.max(answered, 1)) * 100)} %)` +
    `${inconclusive > 0 ? ` · ${inconclusive} nerozhodnutých (limit API)` : ""}\n`,
);
if (failures.length > 0) {
  process.stdout.write("\nNenašlo sa:\n");
  for (const failure of failures) process.stdout.write(`  • ${failure}\n`);
}

rmSync(TMP, { recursive: true, force: true });
