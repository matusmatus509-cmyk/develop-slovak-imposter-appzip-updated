/**
 * Spustí pravidlá párovania z reálneho zdroja bez vitestu.
 *
 * V sandboxe nie je node_modules, takže `vitest run` sa spustiť nedá. Funkcie
 * párovania sú však čisté, takže ich vyrežeme priamo z useSongPreview.ts,
 * preložíme tsc a otestujeme. Testuje sa tým skutočný zdrojový text, nie jeho
 * ručná kópia — keby sa v zdroji zmenilo pravidlo, tento skript to zachytí.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";

const SOURCE = "client/src/hooks/useSongPreview.ts";
const TMP = "/projects/sandbox/song-match-check";
const src = readFileSync(SOURCE, "utf8");

// Vyrežeme blok od normalize() po konec isConfidentMatch().
const start = src.indexOf("function normalize(");
const endMarker = "export const __songMatching";
const end = src.indexOf(endMarker);
if (start < 0 || end < 0) {
  throw new Error("Nenašiel som blok párovania v " + SOURCE);
}
const pureBlock = src.slice(start, end);

mkdirSync(TMP, { recursive: true });
writeFileSync(
  `${TMP}/matching.ts`,
  `interface SongCard { title: string; artist: string }\n${pureBlock}\nexport { isConfidentMatch, isOriginalRecording, matchParts };\n`
);

execFileSync(
  "tsc",
  [
    "--ignoreConfig",
    "--target",
    "ES2022",
    "--module",
    "esnext",
    "--moduleResolution",
    "bundler",
    "--strict",
    "--skipLibCheck",
    "--outDir",
    TMP,
    `${TMP}/matching.ts`,
  ],
  { stdio: "inherit" }
);

const { isConfidentMatch, isOriginalRecording } = await import(
  `${TMP}/matching.js`
);

const song = (title, artist) => ({ title, artist });
let pass = 0;
const failures = [];

function check(label, actual, expected) {
  if (actual === expected) {
    pass++;
  } else {
    failures.push(`${label} → dostal ${actual}, čakal ${expected}`);
  }
}

// ── Originál sa prijíma ─────────────────────────────────────────────────────
check(
  "presná zhoda Bohemian Rhapsody / Queen",
  isConfidentMatch(
    song("Bohemian Rhapsody", "Queen"),
    "Bohemian Rhapsody",
    "Queen"
  ),
  true
);

// ── Neoriginálne verzie sa zamietajú ───────────────────────────────────────
for (const title of [
  "Bohemian Rhapsody (Live at Wembley)",
  "Bohemian Rhapsody - Remix",
  "Bohemian Rhapsody (Karaoke Version)",
  "Bohemian Rhapsody - Instrumental",
  "Bohemian Rhapsody (Acoustic)",
  "Bohemian Rhapsody (Sped Up)",
  "Bohemian Rhapsody - Extended Mix",
  "Bohemian Rhapsody (Medley)",
  "Bohemian Rhapsody (Taylor's Version)",
  "Bohemian Rhapsody - Unplugged",
  "Bohemian Rhapsody (Nightcore)",
  "Bohemian Rhapsody - Demo",
]) {
  check(
    `zamietnuť „${title}"`,
    isConfidentMatch(song("Bohemian Rhapsody", "Queen"), title, "Queen"),
    false
  );
}

// ── Napodobňovatelia sa zamietajú ──────────────────────────────────────────
for (const artist of [
  "Queen Tribute Band",
  "The Karaoke Channel",
  "Made Famous By Queen",
  "Ameritz Tribute Standards",
  "Sung In The Style Of Queen",
]) {
  check(
    `zamietnuť interpreta „${artist}"`,
    isConfidentMatch(
      song("Bohemian Rhapsody", "Queen"),
      "Bohemian Rhapsody",
      artist
    ),
    false
  );
}

// ── Remaster a radio edit sa prijímajú (tá istá nahrávka) ──────────────────
check(
  "prijať remaster",
  isConfidentMatch(song("Africa", "Toto"), "Africa - Remastered 2020", "Toto"),
  true
);
check(
  "prijať radio edit",
  isConfidentMatch(
    song("Blinding Lights", "The Weeknd"),
    "Blinding Lights - Radio Edit",
    "The Weeknd"
  ),
  true
);
check(
  "prijať single version",
  isConfidentMatch(song("Hello", "Adele"), "Hello (Single Version)", "Adele"),
  true
);

// ── Značka sa hľadá len v prívesku, nie v názve ────────────────────────────
for (const [title, artist] of [
  ["Live and Let Die", "Wings"],
  ["Live Forever", "Oasis"],
  ["Mixed Emotions", "The Rolling Stones"],
  ["Cover Me", "Bruce Springsteen"],
  ["Demolition Man", "The Police"],
]) {
  check(
    `prijať skutočný názov „${title}"`,
    isOriginalRecording(song(title, artist), title, artist),
    true
  );
  check(
    `prijať zhodu „${title}"`,
    isConfidentMatch(song(title, artist), title, artist),
    true
  );
}

// ── Krátke mená interpretov ────────────────────────────────────────────────
check(
  "zamietnuť Totó la Momposina pre Toto",
  isConfidentMatch(
    song("Africa", "Toto"),
    "Africa Deluxe",
    "Totó la Momposina"
  ),
  false
);
check(
  "zamietnuť Ego Kill Talent pre Ego",
  isConfidentMatch(song("Šialená", "Ego"), "Šialená verzia", "Ego Kill Talent"),
  false
);
check(
  "prijať presné Toto",
  isConfidentMatch(song("Africa", "Toto"), "Africa", "Toto"),
  true
);
check(
  "prijať presné Sia",
  isConfidentMatch(song("Chandelier", "Sia"), "Chandelier", "Sia"),
  true
);
check(
  "prijať presné U2",
  isConfidentMatch(song("One", "U2"), "One", "U2"),
  true
);
check(
  "dlhé meno smie sedieť čiastočne",
  isConfidentMatch(
    song("Titanium", "David Guetta"),
    "Titanium",
    "David Guetta, Sia"
  ),
  true
);

// ── Nesprávny interpret sa nesmie prijať ──────────────────────────────────
check(
  "zamietnuť správny názov s iným interpretom",
  isConfidentMatch(
    song("All the Small Things", "Fall Out Boy"),
    "All the Small Things",
    "blink-182"
  ),
  false
);
check(
  "zamietnuť Hero od iného interpreta",
  isConfidentMatch(song("Hero", "Mariah Carey"), "Hero", "Enrique Iglesias"),
  false
);
check(
  "prijať Hero od správneho interpreta",
  isConfidentMatch(
    song("Hero", "Enrique Iglesias"),
    "Hero",
    "Enrique Iglesias"
  ),
  true
);

rmSync(TMP, { recursive: true, force: true });

console.log(`\nPárovanie ukážok: ${pass} prešlo, ${failures.length} zlyhalo`);
if (failures.length) {
  failures.forEach(f => console.log("  ✗ " + f));
  process.exit(1);
}
console.log("✓ všetky pravidlá párovania sa chovajú podľa zadania");
