/**
 * Overí, ako sa hľadá ukážka skladby — bez vitestu a bez siete.
 *
 * V sandboxe nie je node_modules, takže `vitest run` sa spustiť nedá. Stavba
 * dopytov, výber obchodu, čítanie odpovede aj pamäť výsledkov sú však čisté
 * funkcie, takže ich vyrežeme priamo z useSongPreview.ts, preložíme tsc a
 * otestujeme. Testuje sa tým skutočný zdroj, nie jeho ručná kópia.
 *
 * Sieť sa nepoužíva — odpovede poskytovateľov sa podstrčia ako dáta.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SOURCE = "client/src/hooks/useSongPreview.ts";
const TMP = join(tmpdir(), "song-lookup-check");
const src = readFileSync(SOURCE, "utf8");

// Vyrežeme blok od typu ukážky po začiatok samotného hooku — teda všetko, čo
// nepotrebuje React.
const start = src.indexOf("interface PreviewSource {");
const end = src.indexOf("/** Resolves and plays");
if (start < 0 || end < 0) {
  throw new Error("Nenašiel som blok vyhľadávania v " + SOURCE);
}
const block = src.slice(start, end);

mkdirSync(TMP, { recursive: true });
writeFileSync(
  `${TMP}/lookup.ts`,
  `interface SongCard { title: string; artist: string }\n${block}\n` +
    "export { buildAttempts, lookupQueries, attemptUrl, parseDeezer, parseItunes, pickCandidate, itunesStoresFor, cacheKeyFor, cachedPreview, rememberPreview };\n"
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
    `${TMP}/lookup.ts`,
  ],
  { stdio: "inherit" }
);

const lookup = await import(`${TMP}/lookup.js`);

let pass = 0;
const failures = [];

function check(label, actual, expected) {
  const got = JSON.stringify(actual);
  const want = JSON.stringify(expected);
  if (got === want) pass++;
  else failures.push(`${label} → dostal ${got}, čakal ${want}`);
}

function ok(label, condition) {
  if (condition) pass++;
  else failures.push(label);
}

// ── Varianty dopytu ─────────────────────────────────────────────────────────
check(
  "pri diakritike sa skúsi aj zápis bez nej",
  lookup.lookupQueries({ title: "Zaľúbil sa chlapec", artist: "Elán" }),
  ["Zaľúbil sa chlapec Elán", "zalubil sa chlapec elan", "Zaľúbil sa chlapec"]
);
check(
  "bez diakritiky sa zbytočný variant nepridá",
  lookup.lookupQueries({ title: "Believer", artist: "Imagine Dragons" }),
  ["Believer Imagine Dragons", "Believer"]
);

// ── Obchod podľa jazyka ─────────────────────────────────────────────────────
// Americký obchod nemá lokálny repertoár, takže jazyk skladby musí rozhodovať.
check(
  "slovenská skladba ide do slovenského obchodu",
  lookup.itunesStoresFor({ title: "a", artist: "b", language: "sk" }),
  ["SK", "CZ", "DE"]
);
check(
  "česká skladba ide do českého obchodu",
  lookup.itunesStoresFor({ title: "a", artist: "b", language: "cs" }),
  ["CZ", "SK", "DE"]
);
check(
  "nemecká skladba pozná aj rakúsky a švajčiarsky obchod",
  lookup.itunesStoresFor({ title: "a", artist: "b", language: "de" }),
  ["DE", "AT", "CH"]
);
check(
  "inštrumentálka skúsi aj veľký nemecký obchod",
  lookup.itunesStoresFor({ title: "a", artist: "b", language: "instrumental" }),
  ["US", "GB", "DE"]
);

// ── Poradie pokusov ─────────────────────────────────────────────────────────
const attempts = lookup.buildAttempts({
  title: "Voda, čo ma drží nad vodou",
  artist: "Elán",
  language: "sk",
});
ok(
  "začína sa presným dopytom na Deezer",
  attempts[0].provider === "deezer" &&
    attempts[0].query === "Voda, čo ma drží nad vodou Elán"
);
ok(
  "hneď druhý pokus je iTunes v správnom obchode",
  attempts[1].provider === "itunes" && attempts[1].country === "SK"
);
ok(
  "poskytovatelia sa striedajú, nejde jeden po druhom",
  attempts.filter(a => a.provider === "deezer").length >= 3 &&
    attempts.filter(a => a.provider === "itunes").length >= 3
);
ok(
  "skúsi sa aj dopyt bez diakritiky",
  attempts.some(a => a.query === "voda co ma drzi nad vodou elan")
);
ok(
  "skúsi sa aj dopyt iba s názvom",
  attempts.some(a => a.query === "Voda, čo ma drží nad vodou")
);
ok(
  "skúsia sa všetky obchody daného jazyka",
  ["SK", "CZ", "DE"].every(country => attempts.some(a => a.country === country))
);
const keys = attempts.map(a => `${a.provider}|${a.country ?? ""}|${a.query}`);
ok("žiadny pokus sa neopakuje", new Set(keys).size === keys.length);
ok("pokusov je rozumne málo", attempts.length <= 8);

// ── URL ─────────────────────────────────────────────────────────────────────
const itunesUrl = lookup.attemptUrl(
  { provider: "itunes", query: "Nie sme zlí Elán", country: "SK" },
  "cb"
);
ok("iTunes URL nesie obchod", itunesUrl.includes("&country=SK"));
ok("iTunes URL si vyžiada viac výsledkov", itunesUrl.includes("limit=25"));
ok(
  "iTunes URL kóduje diakritiku",
  itunesUrl.includes("term=Nie%20sme%20zl%C3%AD%20El%C3%A1n")
);
ok("iTunes URL končí callbackom", itunesUrl.endsWith("&callback=cb"));
const deezerUrl = lookup.attemptUrl(
  { provider: "deezer", query: "Nie sme zlí Elán" },
  "cb"
);
ok(
  "Deezer URL je JSONP bez obchodu",
  deezerUrl.includes("output=jsonp") && !deezerUrl.includes("country=")
);

// ── Čítanie odpovede ────────────────────────────────────────────────────────
const song = { title: "Nie sme zlí", artist: "Elán", language: "sk" };
const itunes = lookup.parseItunes({
  results: [
    {
      previewUrl: "https://preview/live.m4a",
      trackName: "Nie sme zlí (Live)",
      artistName: "Elán",
    },
    {
      previewUrl: "https://preview/original.m4a",
      trackName: "Nie sme zlí",
      artistName: "Elán",
      artworkUrl100: "https://obal/100x100bb.jpg",
    },
    { trackName: "Nie sme zlí", artistName: "Elán" },
  ],
});
check("výsledok bez ukážky sa zahodí", itunes.length, 2);
check(
  "obal sa vyžiada vo vyššom rozlíšení",
  itunes[1].artwork,
  "https://obal/512x512bb.jpg"
);
check(
  "vyberie sa originál, nie live verzia",
  lookup.pickCandidate(song, itunes)?.preview,
  "https://preview/original.m4a"
);
check(
  "keď nič nie je isté, nevyberie sa nič",
  lookup.pickCandidate(
    song,
    lookup.parseDeezer({
      data: [
        {
          preview: "https://preview/tribute.mp3",
          title: "Nie sme zlí",
          artist: { name: "Karaoke Tribute Band" },
        },
        {
          preview: "https://preview/ina.mp3",
          title: "Iná pesnička",
          artist: { name: "Elán" },
        },
      ],
    })
  ),
  null
);
check(
  "iný zápis mena interpreta prejde",
  lookup.pickCandidate(
    { title: "Balada o poľných vtákoch", artist: "Miro Žbirka" },
    lookup.parseDeezer({
      data: [
        {
          preview: "https://preview/zbirka.mp3",
          title: "Balada o poľných vtákoch",
          artist: { name: "Miroslav Žbirka" },
        },
      ],
    })
  )?.preview,
  "https://preview/zbirka.mp3"
);

// ── Pamäť výsledkov ─────────────────────────────────────────────────────────
check(
  "kľúč pamäti nezávisí od zápisu",
  lookup.cacheKeyFor({ title: "Nie SME zlí", artist: "ELÁN" }),
  lookup.cacheKeyFor({ title: "Nie sme zlí", artist: "Elán" })
);
check("neznámu skladbu pamäť nepozná", lookup.cachedPreview(song), undefined);
lookup.rememberPreview(song, { url: "u", link: "l", artwork: null });
check("nájdená ukážka sa pamätá", lookup.cachedPreview(song)?.url, "u");
const nowhere = { title: "Neznáma", artist: "Nikto" };
lookup.rememberPreview(nowhere, null);
check("chýbajúca ukážka sa pamätá tiež", lookup.cachedPreview(nowhere), null);

rmSync(TMP, { recursive: true, force: true });

console.log(`\nHľadanie ukážok: ${pass} prešlo, ${failures.length} zlyhalo`);
if (failures.length) {
  failures.forEach(f => console.log("  ✗ " + f));
  process.exit(1);
}
console.log("✓ ukážka sa hľadá vo viacerých katalógoch aj obchodoch");
