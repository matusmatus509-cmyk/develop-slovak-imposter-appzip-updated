/**
 * Nájde obrazovky, ktoré môžu orezať obsah.
 *
 * Obrazovky v ONE_SCREEN_GAME_SCREENS bežia v ráme s `overflow: hidden`, takže
 * čo sa nezmestí, to zmizne — nie skroluje. Tento skript hľadá vzory, ktoré k
 * tomu vedú, aby sa dali opraviť cieleno a nie hádaním.
 *
 * Hľadá:
 *  1. `h-full` / `height: 100%` v obrazovke, ktorá má Shell + TopBar. Rodič je
 *     flex-stĺpec, v ktorom je aj hlavička, takže 100 % rodiča presahuje presne
 *     o jej výšku. Práve táto chyba bola v bombovej obrazovke.
 *  2. Pevné výšky, ktoré neškálujú s výškou displeja (h-28 a viac).
 *  3. Veľké svislé odsadenia (py-6 a viac).
 *  4. `min-h-[...]`, ktoré si výšku vynucuje.
 *  5. `flex-1` bez `min-h-0` — flex dieťa potom nepustí obsah zmenšiť.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = "client/src";

// Ktoré obrazovky sú v one-screen režime.
const app = readFileSync(`${ROOT}/App.tsx`, "utf8");
const setStart = app.indexOf("ONE_SCREEN_GAME_SCREENS");
const setBlock = app.slice(setStart, app.indexOf("]);", setStart));
const oneScreen = new Set(
  [...setBlock.matchAll(/"([a-z0-9-]+)"/g)].map(m => m[1])
);

// Mapovanie screen → súbor z case vetiev v App.tsx.
const routes = [
  ...app.matchAll(/case\s+"([a-z0-9-]+)":[\s\S]{0,400}?<([A-Z]\w+)/g),
].map(m => ({ screen: m[1], component: m[2] }));
const imports = new Map(
  [...app.matchAll(/import\s+(\w+)\s+from\s+"(\.[^"]+)"/g)].map(m => [
    m[1],
    m[2],
  ])
);

/** Všetky .tsx v screens/ + relevantné komponenty. */
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith(".tsx")) out.push(full);
  }
  return out;
}

// Súbory, ktoré patria one-screen obrazovkám (vrátane podobrazoviek party módu).
const oneScreenFiles = new Set();
for (const { screen, component } of routes) {
  if (!oneScreen.has(screen)) continue;
  const rel = imports.get(component);
  if (!rel) continue;
  const file = path.join(ROOT, rel.replace(/^\.\//, "")) + ".tsx";
  oneScreenFiles.add(file);
}
// Party mód je jeden Screen s mnohými podobrazovkami.
for (const file of walk(`${ROOT}/screens/teamBattle`)) oneScreenFiles.add(file);

const findings = [];

for (const file of [...oneScreenFiles].sort()) {
  let source;
  try {
    source = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  const lines = source.split("\n");
  const usesShellTopBar = /<Shell\b/.test(source) && /<TopBar\b/.test(source);

  lines.forEach((line, index) => {
    const at = `${file}:${index + 1}`;

    // 1) h-full v Shell+TopBar obrazovke — presahuje o výšku hlavičky.
    //    Absolútne pozicované prvky sú mimo toku, takže sa ich to netýka.
    const isOutOfFlow =
      /\b(?:absolute|fixed)\b/.test(line) || /\binset-/.test(line);
    if (
      usesShellTopBar &&
      !isOutOfFlow &&
      /className="[^"]*\bh-full\b/.test(line)
    ) {
      findings.push({
        severity: "vysoká",
        kind: "h-full pod Shell+TopBar (presah o výšku hlavičky)",
        at,
        snippet: line.trim().slice(0, 110),
      });
    }

    // 2) Pevné výšky, ktoré neškálujú.
    const fixedHeights = [...line.matchAll(/\bh-(\d{2,})\b/g)]
      .map(m => Number(m[1]))
      .filter(value => value >= 28);
    if (fixedHeights.length) {
      findings.push({
        severity: "stredná",
        kind: `pevná výška h-${fixedHeights.join("/h-")} (neškáluje s dvh)`,
        at,
        snippet: line.trim().slice(0, 110),
      });
    }

    // 3) Veľké svislé odsadenia.
    const pads = [...line.matchAll(/\b(?:py|pt|pb)-(\d+)\b/g)]
      .map(m => Number(m[1]))
      .filter(value => value >= 6);
    if (pads.length) {
      findings.push({
        severity: "nízka",
        kind: `veľké svislé odsadenie (${pads.join(", ")})`,
        at,
        snippet: line.trim().slice(0, 110),
      });
    }

    // 4) Vynútená minimálna výška, ktorá NEškáluje s výškou displeja.
    //    `min(x, Ndvh)` a `clamp(...)` sú v poriadku — tie sa na nízkom
    //    displeji zmenšia samé.
    const forcedMinHeight = /min-h-\[([^\]]+)\]/.exec(line);
    if (
      forcedMinHeight &&
      !/^0/.test(forcedMinHeight[1]) &&
      !/dvh|vh|clamp|min\(/.test(forcedMinHeight[1])
    ) {
      findings.push({
        severity: "vysoká",
        kind: "vynútená min-height bez škálovania",
        at,
        snippet: line.trim().slice(0, 110),
      });
    }

    // 5) flex-1 bez min-h-0 na tom istom elemente.
    if (
      /\bflex-1\b/.test(line) &&
      !/\bmin-h-0\b/.test(line) &&
      /flex-col|overflow/.test(line)
    ) {
      findings.push({
        severity: "stredná",
        kind: "flex-1 bez min-h-0",
        at,
        snippet: line.trim().slice(0, 110),
      });
    }
  });
}

// ── Nastavenia a výbery sa musia dať doskrolovať ────────────────────────────
// Toto je ochrana proti chybe, ktorú som už raz spravil: pri prechode na jednu
// obrazovku som hromadne prepol obrazovky na `overflow-hidden` a nastavenia by
// sa tým stali nedostupné. Buď obrazovka nie je v one-screen sete (skroluje
// celá), alebo musí mať vnútorný `.scroll-panel`.
const REACHABLE_MUST_SCROLL = [
  { screen: "settings", file: `${ROOT}/screens/Settings.tsx` },
  { screen: "statistics", file: `${ROOT}/screens/Statistics.tsx` },
  { screen: "party-hub", file: `${ROOT}/screens/PartyHub.tsx` },
  { screen: "impostor-setup", file: `${ROOT}/screens/impostor/Setup.tsx` },
  { screen: "drawing-setup", file: `${ROOT}/screens/drawing/Setup.tsx` },
  { screen: "impostor-history", file: `${ROOT}/screens/impostor/History.tsx` },
  // Setupy a výbery vnútri hier — tie sú v one-screen sete, takže potrebujú
  // výslovný `.scroll-panel`.
  {
    screen: "teambattle",
    file: `${ROOT}/screens/teamBattle/Setup.tsx`,
    needsPanel: true,
  },
  {
    screen: "teambattle",
    file: `${ROOT}/screens/teamBattle/GamePicker.tsx`,
    needsPanel: true,
  },
  {
    screen: "tic-tac-toe",
    file: `${ROOT}/screens/minigames/TicTacToe.tsx`,
    needsPanel: true,
  },
  {
    screen: "battleship",
    file: `${ROOT}/screens/minigames/Battleship.tsx`,
    needsPanel: true,
  },
  {
    screen: "zakazane",
    file: `${ROOT}/screens/minigames/TeamQuickGame.tsx`,
    needsPanel: true,
  },
];

const reachability = [];
for (const entry of REACHABLE_MUST_SCROLL) {
  let source = "";
  try {
    source = readFileSync(entry.file, "utf8");
  } catch {
    reachability.push(`chýba súbor ${entry.file}`);
    continue;
  }
  const inOneScreen = oneScreen.has(entry.screen);
  const hasPanel = /\bscroll-panel\b/.test(source);
  const scrollsWholeScreen = !inOneScreen;

  if (entry.needsPanel && !hasPanel) {
    reachability.push(
      `${entry.file}: je v one-screen obrazovke „${entry.screen}" a NEMÁ .scroll-panel — ` +
        `nastavenia by sa nedali doskrolovať`
    );
  } else if (!entry.needsPanel && !scrollsWholeScreen && !hasPanel) {
    reachability.push(
      `${entry.file}: obrazovka „${entry.screen}" je v ONE_SCREEN_GAME_SCREENS a nemá ` +
        `.scroll-panel — obsah by sa orezal namiesto skrolovania`
    );
  }
}

// Pravidlo pre .scroll-panel musí v CSS existovať, inak je trieda bezzubá.
const css = readFileSync(`${ROOT}/index.css`, "utf8");
if (!/\.is-game-stage\s+main\.scroll-panel/.test(css)) {
  reachability.push(
    "index.css: chýba pravidlo `.is-game-stage main.scroll-panel` — trieda by nič nerobila"
  );
}

const order = { vysoká: 0, stredná: 1, nízka: 2 };
findings.sort(
  (a, b) => order[a.severity] - order[b.severity] || a.at.localeCompare(b.at)
);

console.log(`Obrazoviek v one-screen režime: ${oneScreen.size}`);
console.log(`Preverených súborov: ${oneScreenFiles.size}\n`);

const byKind = new Map();
for (const f of findings) {
  const key = `${f.severity} · ${f.kind.replace(/\(.*\)/, "").trim()}`;
  if (!byKind.has(key)) byKind.set(key, []);
  byKind.get(key).push(f);
}

for (const [key, list] of byKind) {
  console.log(`\n▸ ${key} — ${list.length}`);
  for (const f of list.slice(0, 14)) {
    console.log(`    ${f.at}`);
    console.log(`      ${f.snippet}`);
  }
  if (list.length > 14) console.log(`    … a ďalších ${list.length - 14}`);
}

console.log(`\n${"─".repeat(66)}`);
if (reachability.length === 0) {
  console.log(
    "✓ Dostupnosť: nastavenia, štatistiky, história a všetky setupy sa"
  );
  console.log("  dajú doskrolovať — buď skroluje celá obrazovka, alebo majú");
  console.log("  vnútorný .scroll-panel.");
} else {
  console.log(`✗ Dostupnosť: ${reachability.length} problémov`);
  reachability.forEach(r => console.log(`  • ${r}`));
}

const high = findings.filter(f => f.severity === "vysoká").length;
console.log(
  `\nCELKOM: ${findings.length} zistení, z toho ${high} s vysokou závažnosťou`
);

// Nedostupné nastavenia sú chyba, ktorá musí zhodiť validáciu.
if (reachability.length > 0 || high > 0) process.exitCode = 1;
