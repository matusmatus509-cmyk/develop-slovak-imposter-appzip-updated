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

const raw = readFileSync(SOURCE, "utf8");

function extractSections() {
  const sections = [];
  const re = /(?:const WORLD_HITS =|(\w\w):)\s*parseSongs\(`([\s\S]*?)`\)/g;
  let match;
  while ((match = re.exec(raw)) !== null) {
    const label = match[1] ?? "world";
    const startLine = raw.slice(0, match.index).split("\n").length;
    const songs = match[2]
      .replace(/\\n/g, "\n")
      .split("\n")
      .map((line, offset) => {
        const text = line.trim();
        const parts = text.split("|");
        return {
          title: (parts[0] ?? "").trim(),
          artist: (parts[1] ?? "").trim(),
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

const sections = extractSections();
const all = sections.flatMap(section => section.songs);
const errors = [];
const at = song => `${song.section} L${song.line}`;

// ── Formát ──────────────────────────────────────────────────────────────────
for (const song of all) {
  if (song.fieldCount !== 2 || !song.title || !song.artist) {
    errors.push(`malformovaný záznam — ${at(song)}: „${song.raw}"`);
  }
}

// ── Iba originálne nahrávky ─────────────────────────────────────────────────
for (const song of all) {
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
const worldKeys = new Set(
  (sections.find(section => section.label === "world")?.songs ?? []).map(
    song =>
      `${song.title.toLocaleLowerCase()}|${song.artist.toLocaleLowerCase()}`
  )
);
const seen = new Map();
for (const song of all) {
  const key = `${song.title.toLocaleLowerCase()}|${song.artist.toLocaleLowerCase()}`;
  if (seen.has(key)) {
    errors.push(
      `duplikát — „${song.title} | ${song.artist}" [${seen.get(key)} + ${at(song)}]`
    );
  } else {
    seen.set(key, at(song));
  }
  if (song.section !== "world" && worldKeys.has(key)) {
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
