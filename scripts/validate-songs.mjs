/**
 * Validácia hudobného katalógu pre hudobný kvíz.
 *
 * Kvíz sa pýta na názov aj interpreta, takže nesprávne priradenie je priama
 * chyba v hre: hráč odpovie správne a hra mu to zamietne. Ukážka sa navyše
 * hľadá u poskytovateľa podľa páru názov + interpret, takže nekonzistentný
 * zápis interpreta znamená, že sa ukážka vôbec nenájde.
 *
 * Skript zlyhá (exit 1), keď nájde chybu, ktorá sa dá dokázať zo samotných
 * dát. Púšťa sa cez `npm run validate:songs`.
 */
import { readFileSync } from "node:fs";

const SOURCE = "client/src/data/localizedSongs.ts";

/**
 * Dva rôzne skutočné hity s rovnakým názvom. Nie je to chyba — každý záznam
 * si u poskytovateľa nájde vlastnú nahrávku, takže hráč slyší tú skladbu,
 * ktorej interpret sa mu potom zobrazí.
 */
const ALLOWED_SHARED_TITLES = new Set(["hero"]);

/** Značky verzií, ktoré v katalógu nemajú byť — kvíz má hrať originál. */
const NON_ORIGINAL_IN_DATA =
  /\b(?:live|remix|cover|karaoke|tribute|instrumental|acoustic|unplugged|re-?recorded|taylor'?s version|medley|nightcore|mashup|sped ?up|slowed)\b/i;

/**
 * Názvy, v ktorých je takéto slovo prirodzenou súčasťou originálneho titulu.
 * Nie sú to teda alternatívne verzie nahrávky.
 */
const ALLOWED_VERSION_WORDS_IN_TITLE = new Set([
  "who wants to live forever",
  "live and let die",
  "live is life",
]);

const raw = readFileSync(SOURCE, "utf8");

/**
 * Povolené hodnoty voliteľných stĺpcov. Musia zostať zhodné s `parseSongs`
 * v localizedSongs.ts — inak by skript prehlásil platné dáta za chybné.
 */
const GENRES = new Set([
  "pop", "rock", "rap", "rnb", "soul", "dance", "indie", "disco", "funk",
  "metal", "punk", "soundtrack", "folk", "country", "oldies",
  "schlager", "chanson", "latin", "reggae", "jazz",
]);
const TIERS = new Set(["easy", "medium", "hard"]);
const SONG_LANGUAGES = new Set([
  "en", "sk", "cs", "de", "es", "fr", "pt",
  "it", "sv", "pl", "hu", "nl", "instrumental", "other",
]);

function extractSections() {
  const sections = [];
  // Sekcia je `const WORLD_HITS[_EXTENDED] = parseSongs(`…`, { … })` alebo
  // `xx: parseSongs(`…`, { … })`. Za backtickom je vždy čiarka a objekt s
  // predvolenými metadátami sekcie.
  const re = /(?:const (WORLD_HITS(?:_EXTENDED)?) =|(\w\w):)\s*parseSongs\(`([\s\S]*?)`\s*,\s*\{/g;
  let match;
  while ((match = re.exec(raw)) !== null) {
    const label = match[1] ? match[1].toLowerCase() : match[2];
    const startLine = raw.slice(0, match.index).split("\n").length;
    const songs = match[3]
      .replace(/\\n/g, "\n")
      .split("\n")
      .map((line, offset) => {
        const text = line.trim();
        const parts = text.split("|");
        return {
          title: (parts[0] ?? "").trim(),
          artist: (parts[1] ?? "").trim(),
          year: (parts[2] ?? "").trim(),
          genre: (parts[3] ?? "").trim(),
          tier: (parts[4] ?? "").trim(),
          flags: (parts[5] ?? "").trim(),
          fieldCount: parts.length,
          raw: text,
          section: label,
          line: startLine + offset,
        };
      })
      .filter(entry => entry.raw.length > 0);
    sections.push({ label, songs });
  }
  return sections;
}

/** Stabilné id skladby — zhodné so `songIdFor` v localizedSongs.ts. */
function slug(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function songKey(song) {
  return `${slug(song.artist)}--${slug(song.title)}`;
}

const sections = extractSections();
const all = sections.flatMap(section => section.songs);
const errors = [];
const at = song => `${song.section} L${song.line}`;

// ── Formát ──────────────────────────────────────────────────────────────────
// Riadok je `Názov|Interpret` a voliteľne `|Rok|Žáner|Náročnosť|Príznaky`.
for (const song of all) {
  if (song.fieldCount < 2 || song.fieldCount > 6 || !song.title || !song.artist) {
    errors.push(`malformovaný záznam — ${at(song)}: „${song.raw}"`);
    continue;
  }
  if (song.year && !/^(?:19|20)\d{2}$/.test(song.year)) {
    errors.push(`neplatný rok „${song.year}" — ${at(song)}: „${song.title}"`);
  }
  if (song.genre && !GENRES.has(song.genre)) {
    errors.push(`neznámy žáner „${song.genre}" — ${at(song)}: „${song.title}"`);
  }
  if (song.tier && !TIERS.has(song.tier)) {
    errors.push(`neznáma náročnosť „${song.tier}" — ${at(song)}: „${song.title}"`);
  }
  for (const flag of song.flags.split(/\s+/).filter(Boolean)) {
    if (flag === "hum" || flag === "nohum") continue;
    if (flag.startsWith("region=") && flag.length > 7) continue;
    if (flag.startsWith("lang=")) {
      if (!SONG_LANGUAGES.has(flag.slice(5))) {
        errors.push(`neznámy jazyk „${flag}" — ${at(song)}: „${song.title}"`);
      }
      continue;
    }
    errors.push(`neznámy príznak „${flag}" — ${at(song)}: „${song.title}"`);
  }
}

// ── Iba originálne nahrávky ─────────────────────────────────────────────────
for (const song of all) {
  if (ALLOWED_VERSION_WORDS_IN_TITLE.has(song.title.toLocaleLowerCase())) continue;
  if (
    NON_ORIGINAL_IN_DATA.test(song.title) ||
    NON_ORIGINAL_IN_DATA.test(song.artist)
  ) {
    errors.push(
      `neoriginálna verzia v dátach — ${at(song)}: „${song.title} | ${song.artist}"`
    );
  }
}

// ── Rovnaký názov s iným interpretom ────────────────────────────────────────
const byTitle = new Map();
for (const song of all) {
  const key = song.title.toLocaleLowerCase();
  if (!byTitle.has(key)) byTitle.set(key, []);
  byTitle.get(key).push(song);
}
for (const [key, group] of byTitle) {
  const artists = [...new Set(group.map(song => song.artist))];
  if (artists.length > 1 && !ALLOWED_SHARED_TITLES.has(key)) {
    errors.push(
      `rovnaký názov s iným interpretom — „${group[0].title}" → ${artists.join(" / ")} ` +
        `[${group.map(at).join(", ")}]. Ak sú to naozaj dva rôzne hity, pridaj názov ` +
        `do ALLOWED_SHARED_TITLES.`
    );
  }
}

// ── Jeden interpret, jeden zápis ────────────────────────────────────────────
function artistKey(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}
const byArtist = new Map();
for (const song of all) {
  const key = artistKey(song.artist);
  if (!key) continue;
  if (!byArtist.has(key)) byArtist.set(key, new Set());
  byArtist.get(key).add(song.artist);
}
for (const variants of byArtist.values()) {
  if (variants.size > 1) {
    errors.push(
      `nekonzistentný zápis interpreta — ${[...variants].join(" / ")}`
    );
  }
}

// ── Bez duplikátov ──────────────────────────────────────────────────────────
// uniqueSongs() ich za behu zahodí, ale v zdroji maskujú preklepy a nafukujú
// katalóg. Svetové hity sa pridávajú ku každému jazyku, takže ich jazyková
// sekcia nesmie zopakovať.
const WORLD_SECTIONS = new Set(["world_hits", "world_hits_extended"]);
const worldKeys = new Set(
  sections
    .filter(section => WORLD_SECTIONS.has(section.label))
    .flatMap(section => section.songs)
    .map(songKey)
);
const seen = new Map();
for (const song of all) {
  // Kľúč je stabilné songId, takže rovnakú skladbu odhalí aj pri odlišnej
  // interpunkcii („Láska, drž ma…" vs. „Láska drž ma…").
  const key = songKey(song);
  if (seen.has(key)) {
    errors.push(
      `duplikát — „${song.title} | ${song.artist}" [${seen.get(key)} + ${at(song)}]`
    );
  } else {
    seen.set(key, at(song));
  }
  if (!WORLD_SECTIONS.has(song.section) && worldKeys.has(key)) {
    errors.push(
      `už je medzi svetovými hitmi, ktoré sa pridávajú ku každému jazyku — ` +
        `${at(song)}: „${song.title} | ${song.artist}"`
    );
  }
}

// ── Výstup ──────────────────────────────────────────────────────────────────
console.log(`Hudobný katalóg: ${all.length} skladieb`);
for (const section of sections) {
  console.log(`  ${section.label.padEnd(6)} ${section.songs.length}`);
}

if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} chýb v katalógu:\n`);
  errors.forEach(error => console.error(`  • ${error}`));
  process.exit(1);
}

console.log("\n✓ katalóg je konzistentný: žiadne duplikáty, jednotný zápis");
console.log("  interpretov, žiadne neoriginálne verzie a žiadny názov nemá");
console.log("  dvoch interpretov okrem výslovne povolených výnimiek.");
