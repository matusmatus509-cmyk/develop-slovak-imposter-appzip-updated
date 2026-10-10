// Validácia databázy pre minihru „Uhádni zvuk“.
//
// Importuje priamo runtime moduly (to isté pole, ktoré hrá SoundBuzzer.tsx),
// takže kontroluje skutočný obsah hry, nie odhad zo zdrojového textu.
//
//   npx tsx scripts/validate-sound-clues.ts
//
// Sieťovú dostupnosť URL a hlasitosť nekontroluje — na to slúži
// scripts/measure-sound-loudness.py (vyžaduje ffmpeg a internet).

import {
  SOUND_CLUES,
  SOUND_CLUES_NEEDS_REVIEW,
  type SoundClue,
} from "../client/src/data/teamBattleExtras";

const VALID_LICENSES = new Set([
  "CC BY 4.0",
  "CC BY 3.0",
  "CC BY 2.5",
  "CC BY-SA 4.0",
  "CC BY-SA 3.0",
  "CC BY-SA 2.5",
  "CC0",
  "Public domain",
  "Copyrighted free use",
]);

const errors: string[] = [];
const warnings: string[] = [];

const normalize = (text: string | undefined) =>
  (text ?? "")
    .toLocaleLowerCase("sk")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Rovnaký súbor môže byť zapísaný ako upload.wikimedia.org/... aj Special:Redirect/file/... */
function fileKey(url: string) {
  const tail = url.includes("Special:Redirect/file/")
    ? url.split("Special:Redirect/file/").pop()!
    : url.split("?")[0].split("/").pop()!;
  const name = decodeURIComponent(tail).replace(/_/g, " ").trim();
  // Commons rozlišuje veľkosť písmen okrem prvého znaku názvu súboru.
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function checkEntry(e: SoundClue, where: string) {
  const p = `${where} ${e.id ?? "?"}`;
  for (const field of [
    "id",
    "label",
    "emoji",
    "audioUrl",
    "sourcePage",
    "credit",
    "license",
  ] as const) {
    if (!e[field] || !String(e[field]).trim())
      errors.push(`${p}: chýba pole "${field}".`);
  }
  if (e.license && !VALID_LICENSES.has(e.license))
    errors.push(`${p}: neznáma licencia "${e.license}".`);
  if (e.audioUrl && !/^https:\/\//.test(e.audioUrl))
    errors.push(`${p}: audioUrl nie je https.`);
  if (
    e.sourcePage &&
    !/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/.test(e.sourcePage)
  )
    warnings.push(`${p}: sourcePage nevedie na stránku súboru na Commons.`);
  if (
    e.gainDb !== undefined &&
    (!Number.isFinite(e.gainDb) || Math.abs(e.gainDb) > 24)
  )
    errors.push(`${p}: gainDb mimo rozsahu ±24 dB (${e.gainDb}).`);
  if (
    e.startAt !== undefined &&
    (!Number.isFinite(e.startAt) || e.startAt < 0 || e.startAt > 10)
  )
    errors.push(`${p}: startAt mimo rozsahu 0–10 s (${e.startAt}).`);
  if (!e.category || !e.category.trim()) errors.push(`${p}: chýba kategória.`);
  const answers = e.acceptedAnswers ?? [];
  if (!answers.length) warnings.push(`${p}: nemá alternatívne odpovede.`);
  const seen = new Set<string>();
  for (const a of answers) {
    const n = normalize(a);
    if (!n) errors.push(`${p}: prázdna alternatívna odpoveď.`);
    if (n === normalize(e.label))
      warnings.push(`${p}: alternatíva „${a}“ je totožná s názvom.`);
    if (seen.has(n)) warnings.push(`${p}: alternatíva „${a}“ je dvakrát.`);
    seen.add(n);
  }
}

// ── Hrateľné zvuky ─────────────────────────────────────────────────────────
SOUND_CLUES.forEach(e => checkEntry(e, "hra"));

const ids = new Map<string, number>();
[...SOUND_CLUES, ...SOUND_CLUES_NEEDS_REVIEW].forEach(e =>
  ids.set(e.id, (ids.get(e.id) ?? 0) + 1)
);
for (const [id, n] of ids)
  if (n > 1) errors.push(`Duplicitné ID "${id}" (${n}×).`);

// label je dedup kľúč persistent decku → musí byť jedinečný aj po normalizácii
const labels = new Map<string, string[]>();
SOUND_CLUES.forEach(e =>
  labels.set(normalize(e.label), [
    ...(labels.get(normalize(e.label)) ?? []),
    e.id,
  ])
);
for (const [, list] of labels)
  if (list.length > 1)
    errors.push(`Duplicitný / zameniteľný názov: ${list.join(", ")}.`);

const files = new Map<string, string[]>();
SOUND_CLUES.forEach(e =>
  files.set(fileKey(e.audioUrl), [
    ...(files.get(fileKey(e.audioUrl)) ?? []),
    e.id,
  ])
);
for (const [f, list] of files)
  if (list.length > 1)
    errors.push(
      `Rovnaká nahrávka „${f}“ vo viacerých zvukoch: ${list.join(", ")}.`
    );

const missingGain = SOUND_CLUES.filter(e => e.gainDb === undefined).map(
  e => e.id
);
if (missingGain.length)
  errors.push(
    `Zvuky bez nameranej hlasitosti (gainDb): ${missingGain.join(", ")}.`
  );

const longLabels = SOUND_CLUES.filter(
  e => e.label.trim().split(/\s+/).length > 4
).map(e => e.label);
if (longLabels.length)
  warnings.push(`Názvy dlhšie ako 4 slová: ${longLabels.join("; ")}.`);

const labelOwner = new Map(SOUND_CLUES.map(e => [normalize(e.label), e.id]));
for (const e of SOUND_CLUES)
  for (const a of e.acceptedAnswers ?? []) {
    const owner = labelOwner.get(normalize(a));
    if (owner && owner !== e.id)
      warnings.push(
        `${e.id}: alternatíva „${a}“ je názvom iného zvuku (${owner}).`
      );
  }

// ── Vyradené zvuky ─────────────────────────────────────────────────────────
for (const e of SOUND_CLUES_NEEDS_REVIEW) {
  if (!e.reviewReason?.trim())
    errors.push(`kontrola ${e.id}: chýba dôvod vyradenia.`);
  if (SOUND_CLUES.some(c => c.id === e.id))
    errors.push(`kontrola ${e.id}: je aj v hre.`);
}

const categoryCounts: Record<string, number> = {};
for (const e of SOUND_CLUES)
  categoryCounts[e.category ?? "?"] =
    (categoryCounts[e.category ?? "?"] ?? 0) + 1;

const gains = SOUND_CLUES.map(e => e.gainDb ?? 0);
const report = {
  playable: SOUND_CLUES.length,
  needsReview: SOUND_CLUES_NEEDS_REVIEW.length,
  categoryCounts: Object.fromEntries(
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])
  ),
  gainDb: { min: Math.min(...gains), max: Math.max(...gains) },
  withStartAt: SOUND_CLUES.filter(e => e.startAt).length,
  errors,
  warnings,
  status: errors.length ? "FAILED" : "PASSED",
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
