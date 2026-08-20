import { getWorkshopEntryValidationError, normalizeWorkshopCollections, normalizeWorkshopEntries } from "./partyContent";
import type { WorkshopCollection, WorkshopEntry, WorkshopEntryKind } from "../types";

const FORMAT_PREFIX = "PP1";
const LINK_PREFIX = "party-pack=";
const ACCUMULATOR_PREFIX = "podvodnik-party-pack-transfer-v1:";
const TRANSFER_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_ACTIVE_TRANSFERS = 8;
const VALID_KINDS = new Set<WorkshopEntryKind>([
  "truth", "dare", "never", "wouldRather", "emoji", "quiz", "person", "charade",
]);
const ANSWER_REQUIRED = new Set<WorkshopEntryKind>(["wouldRather", "emoji", "quiz"]);

interface CompactPartyPackV1 {
  v: 1;
  n: string;
  i: string;
  c: string;
  e: Array<[WorkshopEntryKind, string, string?]>;
}

export interface DecodedPartyPack {
  version: 1;
  name: string;
  icon: string;
  color: string;
  entries: Array<{ kind: WorkshopEntryKind; text: string; answer?: string }>;
}

export interface InstalledPartyPack {
  collections: WorkshopCollection[];
  entries: WorkshopEntry[];
  collection: WorkshopCollection;
  entryCount: number;
}

export interface PartyPackLink {
  url: string;
  index: number;
  total: number;
  transferId: string;
}

interface ParsedPartyPackLink {
  version: 1;
  transferId: string;
  index: number;
  total: number;
  chunk: string;
}

interface StoredTransfer {
  version: 1;
  total: number;
  updatedAt: number;
  chunks: Array<string | null>;
}

export type AccumulatedPartyPack =
  | { status: "pending"; received: number; total: number }
  | { status: "complete"; pack: DecodedPartyPack };

export class PartyPackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PartyPackError";
  }
}

function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, maxLength) : "";
}

function crc32(value: string) {
  const bytes = new TextEncoder().encode(value);
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0");
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToString(encoded: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(encoded)) throw new PartyPackError("Kód balíka obsahuje nepovolené znaky.");
  try {
    const padded = encoded.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(encoded.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new PartyPackError("Kód balíka sa nepodarilo prečítať.");
  }
}

function validateCompactPack(value: unknown): DecodedPartyPack {
  if (!value || typeof value !== "object") throw new PartyPackError("Balík nemá platnú štruktúru.");
  const candidate = value as Partial<CompactPartyPackV1>;
  if (candidate.v !== 1) throw new PartyPackError("Táto verzia balíka nie je podporovaná.");
  const name = cleanString(candidate.n, 40);
  const icon = cleanString(candidate.i, 4);
  const color = typeof candidate.c === "string" && /^#[0-9a-f]{6}$/i.test(candidate.c) ? candidate.c : "";
  if (!name || !icon || !color || !Array.isArray(candidate.e)) throw new PartyPackError("Balíku chýba názov, ikona, farba alebo kartičky.");
  if (candidate.e.length < 1 || candidate.e.length > 100) throw new PartyPackError("Balík musí obsahovať 1 až 100 kartičiek.");
  const entries = candidate.e.map((raw, index) => {
    if (!Array.isArray(raw) || raw.length < 2 || raw.length > 3) throw new PartyPackError(`Kartička ${index + 1} má neplatný formát.`);
    const kind = raw[0] === "word" ? "charade" : raw[0];
    const text = cleanString(raw[1], 240);
    const answer = cleanString(raw[2], 160) || undefined;
    if (!VALID_KINDS.has(kind) || !text) throw new PartyPackError(`Kartička ${index + 1} má neplatný typ alebo prázdny text.`);
    if (ANSWER_REQUIRED.has(kind) && !answer) throw new PartyPackError(`Kartička ${index + 1} potrebuje odpoveď alebo možnosť B.`);
    const qualityError = getWorkshopEntryValidationError(kind, text, answer);
    if (qualityError) throw new PartyPackError(`Kartička ${index + 1} nie je vhodná pre vybraný typ hry: ${qualityError}`);
    return { kind, text, answer };
  });
  return { version: 1, name, icon, color, entries };
}

export function createPartyPackExport(collection: WorkshopCollection, entries: WorkshopEntry[]) {
  const packEntries = normalizeWorkshopEntries(entries, [collection])
    .filter((entry) => entry.collectionIds.includes(collection.id))
    .filter((entry) => !getWorkshopEntryValidationError(entry.kind, entry.text, entry.answer));
  if (!packEntries.length) throw new PartyPackError("Kolekcia nemá žiadne platné kartičky na export.");
  if (packEntries.length > 100) throw new PartyPackError("Jeden balík môže obsahovať najviac 100 kartičiek.");
  const compact: CompactPartyPackV1 = {
    v: 1,
    n: cleanString(collection.name, 40),
    i: cleanString(collection.icon, 4) || "🎴",
    c: /^#[0-9a-f]{6}$/i.test(collection.color) ? collection.color : "#34d399",
    e: packEntries.map((entry) => entry.answer
      ? [entry.kind === "word" ? "charade" : entry.kind, entry.text, entry.answer]
      : [entry.kind === "word" ? "charade" : entry.kind, entry.text]),
  };
  const json = JSON.stringify(compact);
  return `${FORMAT_PREFIX}.${crc32(json)}.${bytesToBase64Url(new TextEncoder().encode(json))}`;
}

export function decodePartyPackExport(value: string) {
  const input = value.trim();
  const match = /^PP1\.([0-9a-f]{8})\.([A-Za-z0-9_-]+)$/i.exec(input);
  if (!match) throw new PartyPackError("Neplatný kód. Očakáva sa export vo formáte PP1.");
  const json = base64UrlToString(match[2]);
  if (crc32(json) !== match[1].toLowerCase()) throw new PartyPackError("Kontrola balíka zlyhala. Kód je neúplný alebo poškodený.");
  try {
    return validateCompactPack(JSON.parse(json));
  } catch (error) {
    if (error instanceof PartyPackError) throw error;
    throw new PartyPackError("Balík neobsahuje platné údaje.");
  }
}

function freshId(prefix: string, usedIds: Set<string>) {
  let id = "";
  do {
    const random = globalThis.crypto?.getRandomValues
      ? [...globalThis.crypto.getRandomValues(new Uint32Array(2))].map((part) => part.toString(36)).join("")
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
    id = `${prefix}-${random}`.slice(0, 64);
  } while (usedIds.has(id));
  usedIds.add(id);
  return id;
}

export function installPartyPack(
  packValue: DecodedPartyPack | string,
  currentCollections: WorkshopCollection[],
  currentEntries: WorkshopEntry[],
  options: { collectionId?: string } = {},
): InstalledPartyPack {
  const pack = typeof packValue === "string" ? decodePartyPackExport(packValue) : packValue;
  const invalidPackEntryIndex = pack.entries.findIndex((entry) => Boolean(getWorkshopEntryValidationError(entry.kind, entry.text, entry.answer)));
  if (invalidPackEntryIndex >= 0) throw new PartyPackError(`Kartička ${invalidPackEntryIndex + 1} nie je vhodná pre vybraný typ hry.`);
  const collections = normalizeWorkshopCollections(currentCollections);
  const entries = normalizeWorkshopEntries(currentEntries, collections);
  if (collections.length >= 40) throw new PartyPackError("Nie je možné pridať balík: dosiahli ste limit 40 kolekcií.");
  if (entries.length + pack.entries.length > 500) throw new PartyPackError(`Nie je možné pridať ${pack.entries.length} kariet: prekročil by sa limit 500 kariet.`);

  const collectionIds = new Set(collections.map((collection) => collection.id));
  const entryIds = new Set(entries.map((entry) => entry.id));
  const requestedCollectionId = options.collectionId;
  if (requestedCollectionId && (!/^[a-zA-Z0-9_-]{3,64}$/.test(requestedCollectionId) || collectionIds.has(requestedCollectionId))) {
    throw new PartyPackError("Tento balík je už nainštalovaný alebo má neplatný identifikátor.");
  }
  const collectionId = requestedCollectionId ?? freshId("pack", collectionIds);
  collectionIds.add(collectionId);
  const now = Date.now();
  const collection: WorkshopCollection = {
    id: collectionId,
    name: pack.name,
    icon: pack.icon,
    color: pack.color,
    createdAt: now,
  };
  const importedEntries: WorkshopEntry[] = pack.entries.map((entry, index) => ({
    id: freshId("pack-card", entryIds),
    kind: entry.kind,
    text: entry.text,
    answer: entry.answer,
    collectionIds: [collection.id],
    enabled: true,
    likes: 0,
    rating: 0,
    ratingCount: 0,
    createdAt: now + index,
  }));
  const nextCollections = normalizeWorkshopCollections([...collections, collection]);
  const nextEntries = normalizeWorkshopEntries([...importedEntries, ...entries], nextCollections);
  const survivingIds = new Set(nextEntries.map((entry) => entry.id));
  if (!importedEntries.every((entry) => survivingIds.has(entry.id))) throw new PartyPackError("Importované kartičky neprešli kontrolou údajov.");
  return { collections: nextCollections, entries: nextEntries, collection, entryCount: importedEntries.length };
}

function baseShareUrl(currentUrl: string) {
  try {
    const url = new URL(currentUrl);
    url.hash = "";
    return url.toString();
  } catch {
    throw new PartyPackError("Aktuálnu adresu aplikácie sa nepodarilo použiť na zdieľanie.");
  }
}

export function createPartyPackLinks(exportedPack: string, currentUrl: string, maximumLinkLength = 700): PartyPackLink[] {
  decodePartyPackExport(exportedPack);
  const base = baseShareUrl(currentUrl);
  const transferId = `${exportedPack.slice(4, 12)}-${exportedPack.length.toString(36)}`;
  const chunkLength = Math.max(120, maximumLinkLength - base.length - LINK_PREFIX.length - transferId.length - 24);
  const chunks: string[] = [];
  for (let offset = 0; offset < exportedPack.length; offset += chunkLength) chunks.push(exportedPack.slice(offset, offset + chunkLength));
  if (chunks.length > 99) throw new PartyPackError("Balík je príliš veľký na zdieľanie cez QR kódy.");
  return chunks.map((chunk, zeroIndex) => ({
    url: `${base}#${LINK_PREFIX}1~${transferId}~${zeroIndex + 1}~${chunks.length}~${chunk}`,
    index: zeroIndex + 1,
    total: chunks.length,
    transferId,
  }));
}

export function parsePartyPackLink(value: string): ParsedPartyPackLink | null {
  let hash = value;
  try { hash = new URL(value).hash; } catch { /* A raw hash is also accepted. */ }
  const payload = hash.replace(/^#/, "");
  if (!payload.startsWith(LINK_PREFIX)) return null;
  const parts = payload.slice(LINK_PREFIX.length).split("~");
  if (parts.length !== 5 || parts[0] !== "1") throw new PartyPackError("QR odkaz má neplatný formát alebo verziu.");
  const transferId = parts[1];
  const index = Number(parts[2]);
  const total = Number(parts[3]);
  const chunk = parts[4];
  if (!/^[a-z0-9-]{3,32}$/i.test(transferId) || !Number.isInteger(index) || !Number.isInteger(total) || index < 1 || total < 1 || index > total || total > 99 || !/^[A-Za-z0-9_.-]+$/.test(chunk) || chunk.length > 1000) {
    throw new PartyPackError("QR odkaz obsahuje neplatné údaje.");
  }
  return { version: 1, transferId, index, total, chunk };
}

function pruneStoredTransfers(storage: Storage, currentKey: string) {
  const now = Date.now();
  const active: Array<{ key: string; updatedAt: number }> = [];
  for (let index = storage.length - 1; index >= 0; index -= 1) {
    const key = storage.key(index);
    if (!key?.startsWith(ACCUMULATOR_PREFIX)) continue;
    try {
      const candidate = JSON.parse(storage.getItem(key) ?? "null") as Partial<StoredTransfer> | null;
      if (!candidate || candidate.version !== 1 || !Number.isFinite(candidate.updatedAt) || now - Number(candidate.updatedAt) > TRANSFER_MAX_AGE_MS) {
        storage.removeItem(key);
      } else active.push({ key, updatedAt: Number(candidate.updatedAt) });
    } catch {
      storage.removeItem(key);
    }
  }
  if (active.some((item) => item.key === currentKey)) return;
  active.sort((a, b) => a.updatedAt - b.updatedAt);
  while (active.length >= MAX_ACTIVE_TRANSFERS) storage.removeItem(active.shift()!.key);
}

export function accumulatePartyPackLink(link: ParsedPartyPackLink, storage: Storage): AccumulatedPartyPack {
  const key = `${ACCUMULATOR_PREFIX}${link.transferId}`;
  let transfer: StoredTransfer = { version: 1, total: link.total, updatedAt: Date.now(), chunks: Array(link.total).fill(null) };
  try {
    pruneStoredTransfers(storage, key);
    const stored = storage.getItem(key);
    if (stored) {
      const candidate = JSON.parse(stored) as Partial<StoredTransfer>;
      if (candidate.version === 1 && candidate.total === link.total && Array.isArray(candidate.chunks) && candidate.chunks.length === link.total && candidate.chunks.every((chunk) => chunk === null || (typeof chunk === "string" && chunk.length <= 1000 && /^[A-Za-z0-9_.-]+$/.test(chunk)))) {
        transfer = { version: 1, total: link.total, updatedAt: Date.now(), chunks: candidate.chunks.map((chunk) => typeof chunk === "string" ? chunk : null) };
      } else storage.removeItem(key);
    }
    transfer.chunks[link.index - 1] = link.chunk;
    transfer.updatedAt = Date.now();
    const received = transfer.chunks.filter(Boolean).length;
    if (received < link.total) {
      storage.setItem(key, JSON.stringify(transfer));
      return { status: "pending", received, total: link.total };
    }
    const exportedPack = transfer.chunks.join("");
    const pack = decodePartyPackExport(exportedPack);
    storage.removeItem(key);
    return { status: "complete", pack };
  } catch (error) {
    if (error instanceof PartyPackError) throw error;
    throw new PartyPackError("Časti QR balíka sa nepodarilo uložiť v tomto prehliadači.");
  }
}
