type StoredDecks = Record<string, string[]>;

const STORAGE_KEY = "podvodnik-seen-content-v1";

function readDecks(): StoredDecks {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as StoredDecks;
  } catch {
    return {};
  }
}

function saveDecks(decks: StoredDecks) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(decks)); } catch { /* private mode / full storage */ }
}

function shuffled<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Returns random items that are not repeated until this exact content pool is exhausted.
 * The used ids are saved in the device's local storage, so closing the app does not reset them. */
export function takePersistentItems<T>(key: string, items: readonly T[], count: number, getId: (item: T) => string = (item) => String(item)): T[] {
  const unique = new Map<string, T>();
  items.forEach((item) => unique.set(getId(item), item));
  const entries = [...unique.entries()];
  if (!entries.length || count <= 0) return [];
  if (typeof window === "undefined") return shuffled(entries).slice(0, count).map(([, item]) => item);

  const decks = readDecks();
  const validIds = new Set(entries.map(([id]) => id));
  let used = new Set((decks[key] ?? []).filter((id) => validIds.has(id)));
  const chosen: T[] = [];

  while (chosen.length < count) {
    let available = entries.filter(([id]) => !used.has(id));
    if (!available.length) {
      used = new Set();
      available = entries;
    }
    const take = Math.min(count - chosen.length, available.length);
    const batch = shuffled(available).slice(0, take);
    batch.forEach(([id, item]) => { used.add(id); chosen.push(item); });
  }
  decks[key] = [...used];
  saveDecks(decks);
  return chosen;
}

export function takePersistentItem<T>(key: string, items: readonly T[], getId?: (item: T) => string): T {
  const item = takePersistentItems(key, items, 1, getId)[0];
  if (item === undefined) throw new Error(`Empty content deck: ${key}`);
  return item;
}
