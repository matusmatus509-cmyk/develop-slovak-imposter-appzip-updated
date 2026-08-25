/**
 * Vykreslí uvítacie obrazovky všetkých hier do jedného HTML, aby sa dali
 * skontrolovať naraz (orezanie obrázkov, prepadnuté tlačidlá, symetria).
 *
 * Pomôcka pre kontrolu dizajnu, nie súčasť aplikácie:
 *   node scripts/preview-game-welcomes.mjs <výstup.html> [od] [do]
 */
import { readFileSync, writeFileSync } from "node:fs";

const ROOT = new URL("../client/", import.meta.url).pathname;
const source = readFileSync(`${ROOT}src/components/GameWelcome.tsx`, "utf8");
const media = readFileSync(`${ROOT}src/media.ts`, "utf8");

const assets = new Map();
for (const [, name, file] of media.matchAll(
  /export const (\w+)\s*=\s*publicAsset\(\s*\n?\s*"([^"]+)"/g
)) {
  assets.set(name, `client/public/assets/${file}`);
}

const body = source.slice(source.indexOf("GAME_WELCOMES"), source.indexOf("\nexport default"));
const entries = [];
for (const block of body.split(/\n  (?="?[a-z0-9-]+"?: \{)/).slice(1)) {
  const screen = block.match(/^"?([a-z0-9-]+)"?: \{/)?.[1];
  if (!screen) continue;
  const text = key => block.match(new RegExp(`${key}: "([^"]*)"`))?.[1];
  const ref = key => block.match(new RegExp(`${key}: (\\w+),`))?.[1];
  entries.push({
    screen,
    eyebrow: text("eyebrow"),
    title: text("title"),
    description: text("description"),
    rule: text("rule"),
    players: text("players"),
    duration: text("duration"),
    accent: text("accent"),
    accentSoft: text("accentSoft"),
    deep: text("deep"),
    artPosition: text("artPosition"),
    art: ref("art"),
    artWide: ref("artWide"),
    artSize: text("artSize"),
    artAtlas: /artAtlas: true/.test(block),
    variant: text("variant"),
  });
}

/** Rovnaká logika ako `resolveHeroArt` v komponente. */
function resolveHeroArt(config) {
  const standalone = config.artWide ?? (config.artAtlas ? undefined : config.art);
  if (standalone) {
    return { kind: "image", src: assets.get(standalone), position: config.artPosition };
  }
  const src = assets.get(config.artAtlas && config.art ? config.art : "gameArt");
  const pair = (value, fallback) => {
    const parts = (value || fallback).trim().split(/\s+/);
    return [parseFloat(parts[0]), parseFloat(parts[1] ?? parts[0])];
  };
  const [sizeX, sizeY] = pair(config.artSize ?? (config.artAtlas ? "300% 300%" : "400% 300%"), "300% 300%");
  const columns = Math.max(1, Math.round(sizeX / 100));
  const rows = Math.max(1, Math.round(sizeY / 100));
  const [x, y] = pair(config.artPosition, "50% 50%");
  return {
    kind: "cell",
    src,
    columns,
    rows,
    column: Math.round((x / 100) * (columns - 1)),
    row: Math.round((y / 100) * (rows - 1)),
  };
}

const cellStyle = art =>
  `width:${art.columns * 100}%;height:${art.rows * 100}%;left:${art.column * -100}%;top:${art.row * -100}%`;

function artLayers(art) {
  if (art.kind === "cell") {
    return `
      <span class="game-welcome-art-fill"><span class="game-welcome-art-cell is-fill"><img src="${art.src}" alt="" style="${cellStyle(art)}"></span></span>
      <span class="game-welcome-art-stage"><span class="game-welcome-art-cell"><img src="${art.src}" alt="" style="${cellStyle(art)}"></span></span>`;
  }
  return `
      <span class="game-welcome-art-fill"><img src="${art.src}" alt="" class="game-welcome-art-cover"></span>
      <span class="game-welcome-art-stage"><img src="${art.src}" alt="" class="game-welcome-art-full" style="object-position:${art.position}"></span>`;
}

function phone(config) {
  const art = resolveHeroArt(config);
  return `
<div class="device">
  <span class="device-tag">${config.screen}</span>
  <main class="game-welcome ${config.variant === "song" ? "game-welcome-song" : ""}"
        style="--welcome-accent:${config.accent};--welcome-soft:${config.accentSoft};--welcome-deep:${config.deep};background:linear-gradient(180deg,${config.deep},#080b10 68%)">
    <div class="welcome-glow"></div>
    <div class="game-welcome-content">
      <div class="game-welcome-hero ${config.variant === "song" ? "game-welcome-song-hero" : ""}">
        <div class="game-welcome-art">${artLayers(art)}</div>
        <div class="game-welcome-hero-scrim"></div>
        ${config.variant === "song" ? `<div class="song-welcome-equalizer" style="position:absolute;right:1rem;top:1rem;display:flex;height:2.5rem;align-items:flex-end;gap:.25rem;opacity:.8">${[16, 28, 20, 36, 25, 32, 18].map(h => `<i style="height:${h}px"></i>`).join("")}</div>` : ""}
        <button class="hero-back">‹</button>
        <div class="game-welcome-hero-copy">
          <div class="hero-pill"><span class="hero-dot" style="background:${config.accent}"></span><span>${config.eyebrow}</span></div>
          <h1 class="game-welcome-title">${config.title}</h1>
        </div>
      </div>
      <section class="game-welcome-details">
        <p class="game-welcome-description">${config.description}</p>
        <div class="game-welcome-stats">
          <div class="game-welcome-stat"><p class="stat-label">Hráči</p><p class="stat-value">${config.players}</p></div>
          <div class="game-welcome-stat"><p class="stat-label">Trvanie</p><p class="stat-value">${config.duration}</p></div>
        </div>
        <div class="game-welcome-rule">
          <span class="rule-icon" style="background:${config.accentSoft};color:${config.accent}">✦</span>
          <p class="rule-text">${config.rule}</p>
        </div>
        <button class="hero-start" style="background:linear-gradient(135deg,${config.accent},color-mix(in srgb,${config.accent} 70%,#202a38))">
          <span>${config.variant === "song" ? "Pripraviť hudobné kolo" : "Pripraviť hru"}</span>
          <span class="start-chevron">›</span>
        </button>
      </section>
    </div>
  </main>
</div>`;
}

const [, , out = "tmp-welcomes.html", from = "0", to = "99", height = "844"] = process.argv;
const selected = entries.slice(Number(from), Number(to));

writeFileSync(
  out,
  `<!doctype html><html lang="sk"><head><meta charset="utf-8"><style>
* { box-sizing:border-box; margin:0; padding:0; }
/* Animácie vypnuté — headless Chrome ich inak zachytí v polovici. */
*, *::before, *::after { animation: none !important; }
body { background:#04060a; font-family:system-ui,sans-serif; display:flex; gap:12px; padding:12px; }
.device { position:relative; width:390px; height:${height}px; overflow:hidden; border-radius:20px; border:1px solid rgba(255,255,255,.14); }
.device-tag { position:absolute; z-index:5; top:4px; left:50%; transform:translateX(-50%); font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:#7c8798; }
.game-welcome { position:relative; height:100%; overflow:hidden; color:#fff; background-color:#080c11; }
.welcome-glow { position:absolute; inset:0; opacity:.3; background-image:radial-gradient(circle at 50% 5%, var(--welcome-soft), transparent 38%); }
.game-welcome-content { position:relative; margin:0 auto; display:flex; height:100%; width:100%; max-width:32rem; flex-direction:column; padding:.75rem 1rem; gap:.75rem; justify-content:space-between; }
.game-welcome-hero { position:relative; flex:1 1 auto; min-height:10rem; max-height:58dvh; overflow:hidden; border-radius:26px; border:1px solid rgba(255,255,255,.12); }
.game-welcome-details { flex:0 0 auto; display:flex; flex-direction:column; gap:.5rem; }
.game-welcome-description { display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:3; overflow:hidden; font-size:13px; font-weight:500; line-height:1.5; color:rgba(255,255,255,.62); }
.game-welcome-title { font-size:clamp(1.75rem,8.2vw,2.35rem); max-width:22ch; font-weight:800; line-height:.96; letter-spacing:-.045em; text-shadow:0 8px 20px rgba(0,0,0,.6); }
.game-welcome-art { position:absolute; inset:0; overflow:hidden; }
.game-welcome-art-fill, .game-welcome-art-stage { position:absolute; inset:0; }
.game-welcome-art-fill { transform:scale(1.22); filter:blur(26px) saturate(1.25) brightness(.52); }
.game-welcome-art-stage { display:grid; place-items:center; padding:.4rem; }
.game-welcome-art-cover { width:100%; height:100%; object-fit:cover; }
.game-welcome-art-full { max-width:100%; max-height:100%; object-fit:contain; }
.game-welcome-art-cell { position:relative; height:100%; width:auto; aspect-ratio:1/1; max-width:100%; overflow:hidden; border-radius:1.1rem; }
.game-welcome-art-cell > img { position:absolute; max-width:none; }
.game-welcome-art-cell.is-fill { position:absolute; inset:0; height:100%; width:100%; aspect-ratio:auto; max-width:none; border-radius:0; }
.game-welcome-hero img { filter:saturate(.82) contrast(1.04); }
.game-welcome-hero-scrim { position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg, rgba(0,0,0,.28) 0%, rgba(0,0,0,0) 34%, rgba(8,11,18,.72) 78%, rgba(8,11,18,.94) 100%); }
.game-welcome-hero-copy { position:absolute; left:0; right:0; bottom:0; padding:1.25rem; }
.hero-pill { margin-bottom:.625rem; display:inline-flex; align-items:center; gap:.5rem; border-radius:999px; border:1px solid rgba(255,255,255,.12); background:rgba(13,18,24,.7); padding:.375rem .75rem; }
.hero-pill span:last-child { font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:.19em; color:rgba(255,255,255,.75); }
.hero-dot { height:.5rem; width:.5rem; border-radius:999px; }
.hero-back { position:absolute; left:1rem; top:1rem; display:flex; height:2.75rem; width:2.75rem; align-items:center; justify-content:center; border-radius:.75rem; border:1px solid rgba(255,255,255,.16); background:rgba(13,18,24,.8); color:#fff; font-size:22px; }
.game-welcome-stats { display:grid; grid-template-columns:1fr 1fr; gap:.5rem; }
.game-welcome-stat { border-radius:1rem; border:1px solid rgba(255,255,255,.09); background:rgba(17,24,32,.94); padding:.75rem .875rem; }
.stat-label { font-size:9px; font-weight:900; text-transform:uppercase; letter-spacing:.17em; color:rgba(255,255,255,.35); }
.stat-value { margin-top:.25rem; font-size:14px; font-weight:800; color:rgba(255,255,255,.85); }
.game-welcome-rule { display:flex; align-items:center; gap:.75rem; border-radius:1rem; border:1px solid rgba(255,255,255,.09); background:rgba(17,24,32,.94); padding:.75rem 1rem; }
.rule-icon { display:flex; height:2.25rem; width:2.25rem; flex:none; align-items:center; justify-content:center; border-radius:.5rem; }
.rule-text { font-size:12px; font-weight:700; line-height:1.375; color:rgba(255,255,255,.68); }
.hero-start { display:flex; min-height:3.5rem; width:100%; align-items:center; justify-content:space-between; border-radius:.75rem; border:1px solid rgba(255,255,255,.1); padding:0 1.25rem; text-align:left; font-weight:800; color:#fff; font-size:15px; }
.start-chevron { display:flex; height:2.25rem; width:2.25rem; align-items:center; justify-content:center; border-radius:999px; background:rgba(255,255,255,.18); font-size:20px; }
.song-welcome-equalizer i { width:4px; border-radius:999px; background:linear-gradient(to top,#8b5cf6,#f0abfc); }
.game-welcome-song { background:radial-gradient(circle at 86% 12%, rgba(240,171,252,.16), transparent 25rem), linear-gradient(180deg,#1c1039,#080b10 68%) !important; }
.game-welcome-song-hero { border-color:rgba(196,181,253,.25) !important; }
</style></head><body>${selected.map(phone).join("\n")}</body></html>`
);

console.log(`vykreslených hier: ${selected.length} → ${out}`);
