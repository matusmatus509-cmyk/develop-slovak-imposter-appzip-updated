import type { AppLanguage } from "../i18n/LanguageProvider";
import { rememberDeckIds, seenDeckIds } from "../utils/persistentDeck";
import {
  GLOBAL_SONGS,
  getLocalSongsForLanguage,
  getSongCardsForLanguage,
  type Song,
  type SongTier,
} from "./localizedSongs";

/**
 * ── Výber pesničiek pre hudobné minihry ─────────────────────────────────────
 *
 * Obe hudobné minihry čerpajú z JEDNEJ spoločnej databázy. Aby si navzájom
 * nebrali tie isté skladby a aby výber nepôsobil repetitívne, prechádza
 * kandidát týmto potrubím:
 *
 *   spoločná databáza
 *     → jazykový filter a boost (lokálne vs. svetové)
 *     → filter náročnosti
 *     → filter minihry (napr. „dá sa to zahmkať?")
 *     → filter session (už použité + cooldown interpreta)
 *     → náhodný výber
 *
 * Každý krok sa vie „uvolniť", keď by inak nezostal žiadny kandidát — hra
 * nikdy nespadne a nikdy nevráti prázdno, kým je v databáze aspoň jedna
 * skladba. Uvolňovanie ide vždy od najmenej podstatného pravidla
 * (cooldown interpreta) k najpodstatnejšiemu (už použitá skladba).
 */

export type MusicMinigame = "hum" | "buzzer";

export interface SongSelectionOptions {
  language: AppLanguage;
  minigame: MusicMinigame;
  /** Povolené náročnosti. Prázdne/neuvedené = bez obmedzenia. */
  tiers?: SongTier[];
  /** Podiel lokálnych skladieb 0–1. Predvolene 0,3 (30 %). */
  localShare?: number;
  session?: SongSession;
  random?: () => number;
}

/** Koľko ďalších ťahov je interpret po použití zablokovaný. */
export const ARTIST_COOLDOWN_DRAWS = 6;

/**
 * Dlhodobá rotácia obsahu. Kľúč je spoločný pre OBE hudobné minihry, takže
 * skladby sa neopakujú ani po zatvorení aplikácie — session drží tvrdý zákaz
 * v rámci jednej párty, tento deck drží pestrosť medzi partiami.
 */
function deckKeyFor(language: AppLanguage) {
  return `party:songs:${language}`;
}

/** Predvolený podiel lokálnych skladieb — zvyšok dopĺňa svetový pool. */
export const DEFAULT_LOCAL_SHARE = 0.3;

// ── Session ──────────────────────────────────────────────────────────────────

/**
 * Stav jednej party session. Drží ho modul, takže ho vidia obe minihry aj po
 * odmontovaní komponentu — presne to je zmyslom: keď „Zahmkaj pesničku"
 * spotrebuje skladbu, „Hudobný kvíz" ju už nesmie dostať.
 *
 * Nie je to teda jednoduchý `usedSongs` resetovaný po každom kole: session
 * prežije celé hranie a resetuje sa len výslovne (nová párty / reload).
 */
export interface SongSession {
  /** Id skladieb použitých v tejto session — v ktorejkoľvek minihre. */
  readonly usedSongIds: Set<string>;
  /** Interpret → číslo ťahu, po ktorom sa smie znova objaviť. */
  readonly artistCooldown: Map<string, number>;
  /** Koľko skladieb už session vydala. */
  draws: number;
}

export function createSongSession(): SongSession {
  return { usedSongIds: new Set(), artistCooldown: new Map(), draws: 0 };
}

let activeSession: SongSession = createSongSession();

/** Spoločná session pre obe hudobné minihry. */
export function getSongSession(): SongSession {
  return activeSession;
}

/** Nová párty — zásoba sa otvára odznova. */
export function resetSongSession(): SongSession {
  activeSession = createSongSession();
  return activeSession;
}

/** Zapíše skladbu ako použitú a naštartuje cooldown jej interpreta. */
export function markSongUsed(song: Song, session: SongSession = activeSession): void {
  session.usedSongIds.add(song.id);
  session.draws += 1;
  session.artistCooldown.set(song.artistKey, session.draws + ARTIST_COOLDOWN_DRAWS);
}

function artistBlocked(song: Song, session: SongSession): boolean {
  const until = session.artistCooldown.get(song.artistKey);
  return until !== undefined && session.draws < until;
}

// ── Jednotlivé filtre ────────────────────────────────────────────────────────

function passesMinigame(song: Song, minigame: MusicMinigame): boolean {
  // „Zahmkaj pesničku" sa hrá bez textu, takže rapové a textom nesené skladby
  // sú nevhodné — hráč nemá čo zahmkať.
  if (minigame === "hum") return song.hummable;
  return true;
}

function passesTier(song: Song, tiers: SongTier[] | undefined): boolean {
  if (!tiers || tiers.length === 0) return true;
  return tiers.includes(song.tier);
}

function pickRandom<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

/**
 * Zoradí kandidátov podľa toho, ako veľmi ich chceme, a vráti prvú neprázdnu
 * úroveň. Postupné uvolňovanie pravidiel je dôvod, prečo výber nikdy nespadne.
 */
function firstNonEmpty<T>(...levels: T[][]): T[] {
  for (const level of levels) if (level.length > 0) return level;
  return [];
}

// ── Výber jednej skladby ─────────────────────────────────────────────────────

/**
 * Vyberie jednu skladbu podľa celého potrubia a zapíše ju do session.
 * Vráti `null` iba vtedy, keď je databáza pre daný jazyk úplne prázdna.
 */
export function drawSong(options: SongSelectionOptions): Song | null {
  const {
    language,
    minigame,
    tiers,
    localShare = DEFAULT_LOCAL_SHARE,
    session = activeSession,
    random = Math.random,
  } = options;

  const everything = getSongCardsForLanguage(language);
  if (everything.length === 0) return null;

  const localIds = new Set(getLocalSongsForLanguage(language).map((song) => song.id));
  // Rozhodnutie „teraz lokálna alebo svetová" padá pred filtrami, takže pomer
  // drží aj vtedy, keď je jedna z vetiev užšia.
  const wantLocal = random() < localShare;

  const scoped = (songs: Song[], local: boolean) =>
    songs.filter((song) => localIds.has(song.id) === local);

  const usable = everything.filter(
    (song) => passesMinigame(song, minigame) && passesTier(song, tiers),
  );
  // Filter minihry je vecný (rap sa nedá hmkať), náročnosť je len preferencia.
  const usableIgnoringTier = everything.filter((song) => passesMinigame(song, minigame));
  const fresh = (songs: Song[]) => songs.filter((song) => !session.usedSongIds.has(song.id));
  const cool = (songs: Song[]) => songs.filter((song) => !artistBlocked(song, session));
  // Skladby, ktoré hráč nevidel ani v minulých partiách.
  const seen = seenDeckIds(deckKeyFor(language));
  const unseen = (songs: Song[]) =>
    seen.size === 0 ? songs : songs.filter((song) => !seen.has(song.id));

  const preferred = scoped(usable, wantLocal);
  const other = scoped(usable, !wantLocal);

  const candidates = firstNonEmpty(
    // 1. ideál: správna vetva pomeru, nová v session, nová aj medzi partiami,
    //    interpret bez cooldownu
    unseen(cool(fresh(preferred))),
    unseen(cool(fresh(other))),
    // 2. dlhodobá rotácia ustúpi ako prvá — je to len pestrosť, nie pravidlo
    cool(fresh(preferred)),
    cool(fresh(other)),
    // 3. povolíme interpreta v cooldowne, len aby skladba bola nová
    fresh(preferred),
    fresh(other),
    // 4. náročnosť bola len preferencia — rozšírime ju
    cool(fresh(usableIgnoringTier)),
    fresh(usableIgnoringTier),
    // 5. celá zásoba pre minihru je vyčerpaná → nový cyklus, aspoň bez cooldownu
    cool(usable),
    usable,
    // 6. posledná záchrana: aj filter minihry ustúpi, aby hra nespadla
    cool(everything),
    everything,
  );

  if (candidates.length === 0) return null;
  const song = pickRandom(candidates, random);
  markSongUsed(song, session);
  rememberDeckIds(deckKeyFor(language), [song.id], everything.length);
  return song;
}

/**
 * Vyberie `count` skladieb naraz (napr. celý deck pre Hudobný kvíz).
 * Vracia menej než `count` len vtedy, keď je databáza prázdna.
 */
export function drawSongs(options: SongSelectionOptions & { count: number }): Song[] {
  const { count, ...rest } = options;
  const songs: Song[] = [];
  for (let index = 0; index < count; index += 1) {
    const song = drawSong(rest);
    if (!song) break;
    songs.push(song);
  }
  return songs;
}

/** Kandidáti pre danú minihru a jazyk — pre diagnostiku a testy. */
export function songCandidates(
  language: AppLanguage,
  minigame: MusicMinigame,
  tiers?: SongTier[],
): Song[] {
  return getSongCardsForLanguage(language).filter(
    (song) => passesMinigame(song, minigame) && passesTier(song, tiers),
  );
}

export const __songSelectionInternals = {
  artistBlocked,
  passesMinigame,
  passesTier,
  GLOBAL_SONGS,
};
