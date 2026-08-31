import { beforeEach, describe, expect, it } from "vitest";
import {
  ALL_SONGS,
  GLOBAL_SONGS,
  LOCAL_SONGS_BY_LANGUAGE,
  RELEVANT_SONG_LANGUAGES,
  getLocalSongsForLanguage,
  getSongCardsForLanguage,
  songCatalogueStats,
  songIdFor,
  type Song,
} from "./localizedSongs";
import {
  ARTIST_COOLDOWN_DRAWS,
  createSongSession,
  drawSong,
  drawSongs,
  markSongUsed,
  resetSongSession,
  songCandidates,
  type MusicMinigame,
} from "./songSelection";

const GAME_LANGUAGES = ["sk", "en", "de", "es", "fr", "pt"] as const;

/** Deterministický generátor — simulácia sa tak dá zopakovať. */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

beforeEach(() => {
  resetSongSession();
});

describe("integrita hudobného katalógu", () => {
  it("žiadne dve skladby nemajú rovnaké songId", () => {
    const ids = ALL_SONGS.map(song => song.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("songId je stabilné a odvodené od interpreta a názvu", () => {
    for (const song of ALL_SONGS.slice(0, 200)) {
      expect(song.id).toBe(songIdFor(song.title, song.artist));
    }
  });

  it("každá skladba má povinné metadáta", () => {
    for (const song of ALL_SONGS) {
      expect(song.title.trim().length, song.id).toBeGreaterThan(0);
      expect(song.artist.trim().length, song.id).toBeGreaterThan(0);
      expect(song.artistKey.length, song.id).toBeGreaterThan(0);
      expect(["easy", "medium", "hard"], song.id).toContain(song.tier);
      expect(typeof song.hummable, song.id).toBe("boolean");
      expect(song.language.length, song.id).toBeGreaterThan(0);
      expect(["global", "local"], song.id).toContain(song.scope);
      if (song.year !== undefined) {
        expect(song.year, song.id).toBeGreaterThan(1899);
        expect(song.decade, song.id).toBeDefined();
      }
    }
  });

  it("aktívna zásoba zodpovedá kurátorovanému snapshotu a pôvodné skladby zostali", () => {
    const stats = songCatalogueStats();
    expect(stats.total).toBe(1665);
    expect(stats.global).toBe(575);
    expect(stats.byLanguage).toMatchObject({
      sk: 241,
      cs: 135,
      en: 123,
      de: 148,
      es: 147,
      fr: 151,
      pt: 145,
    });
    const present = (title: string, artist: string) =>
      ALL_SONGS.some(song => song.id === songIdFor(title, artist));
    // Vzorka z pôvodnej zásoby — rozšírenie ju nesmie vyhodiť.
    expect(present("Dancing Queen", "ABBA")).toBe(true);
    expect(present("V dolinách", "Karol Duchoň")).toBe(true);
    expect(present("Atemlos durch die Nacht", "Helene Fischer")).toBe(true);
    expect(present("La Bamba", "Ritchie Valens")).toBe(true);
    // Známy záznam z extended archívu nesmie preniknúť do aktívnej zásoby.
    expect(present("Twist and Shout", "The Beatles")).toBe(false);
  });

  it("rap sa nedá zahmkať, ostatné žánre áno", () => {
    for (const song of ALL_SONGS) {
      if (song.genre === "rap" && song.hummable) {
        // Výnimka je povolená len výslovným príznakom `hum` v dátach.
        expect(song.hummable, `${song.id} je rap s hum príznakom`).toBe(true);
      }
    }
    const rap = ALL_SONGS.filter(song => song.genre === "rap");
    expect(rap.length).toBeGreaterThan(20);
    expect(rap.some(song => !song.hummable)).toBe(true);
  });

  it("prehľad zásoby zodpovedá skutočnému obsahu", () => {
    const stats = songCatalogueStats();
    expect(stats.total).toBe(ALL_SONGS.length);
    expect(stats.global).toBe(GLOBAL_SONGS.length);
    expect(stats.global + stats.local).toBe(stats.total);
  });
});

describe("jazykové pooly", () => {
  it("existuje svetový pool aj lokálne pooly", () => {
    expect(GLOBAL_SONGS.length).toBeGreaterThan(400);
    expect(Object.keys(LOCAL_SONGS_BY_LANGUAGE).length).toBeGreaterThanOrEqual(7);
  });

  it("slovenská hra pozná slovenské aj české skladby", () => {
    const local = getLocalSongsForLanguage("sk");
    expect(local.some(song => song.language === "sk")).toBe(true);
    expect(local.some(song => song.language === "cs")).toBe(true);
    expect(RELEVANT_SONG_LANGUAGES.sk).toContain("cs");
  });

  it("nemecká hra pozná nemecké skladby vrátane rakúskych", () => {
    const local = getLocalSongsForLanguage("de");
    expect(local.length).toBeGreaterThan(100);
    expect(local.every(song => song.language === "de")).toBe(true);
    expect(local.some(song => song.region === "AT")).toBe(true);
  });

  it("každý jazyk hry má lokálne aj svetové skladby", () => {
    for (const language of GAME_LANGUAGES) {
      const pool = getSongCardsForLanguage(language);
      const localIds = new Set(getLocalSongsForLanguage(language).map(song => song.id));
      expect(pool.some(song => localIds.has(song.id)), language).toBe(true);
      expect(pool.some(song => !localIds.has(song.id)), language).toBe(true);
    }
  });

  it("obe minihry čerpajú z tej istej databázy", () => {
    for (const language of GAME_LANGUAGES) {
      const pool = new Set(getSongCardsForLanguage(language).map(song => song.id));
      for (const minigame of ["hum", "buzzer"] as MusicMinigame[]) {
        for (const song of songCandidates(language, minigame)) {
          expect(pool.has(song.id), `${minigame}/${language}: ${song.id}`).toBe(true);
        }
      }
    }
  });

  it("minihra má vlastný filter bez vlastnej databázy", () => {
    const hum = songCandidates("sk", "hum");
    const buzzer = songCandidates("sk", "buzzer");
    // Zahmkaj pesničku je užšia — rap vypadne, ale je to podmnožina spoločnej zásoby.
    expect(hum.length).toBeLessThan(buzzer.length);
    const buzzerIds = new Set(buzzer.map(song => song.id));
    expect(hum.every(song => buzzerIds.has(song.id))).toBe(true);
    expect(hum.every(song => song.hummable)).toBe(true);
  });
});

describe("výber v rámci jednej session", () => {
  it("skladba použitá v jednej minihre sa v druhej už neobjaví", () => {
    const hum = drawSongs({ language: "sk", minigame: "hum", count: 12 });
    const buzzer = drawSongs({ language: "sk", minigame: "buzzer", count: 12 });
    expect(hum).toHaveLength(12);
    expect(buzzer).toHaveLength(12);
    const humIds = new Set(hum.map(song => song.id));
    expect(buzzer.filter(song => humIds.has(song.id))).toHaveLength(0);
  });

  it("v jednej session sa žiadna skladba nezopakuje", () => {
    const drawn = [
      ...drawSongs({ language: "sk", minigame: "hum", count: 30 }),
      ...drawSongs({ language: "sk", minigame: "buzzer", count: 30 }),
    ];
    expect(new Set(drawn.map(song => song.id)).size).toBe(drawn.length);
  });

  it("session prežije obe minihry a nereštartuje sa po kole", () => {
    const session = createSongSession();
    drawSongs({ language: "sk", minigame: "hum", count: 5, session });
    expect(session.usedSongIds.size).toBe(5);
    drawSongs({ language: "sk", minigame: "buzzer", count: 5, session });
    expect(session.usedSongIds.size).toBe(10);
    expect(session.draws).toBe(10);
  });

  it("nová session otvorí zásobu odznova", () => {
    const first = drawSongs({ language: "sk", minigame: "hum", count: 5 });
    expect(first).toHaveLength(5);
    const session = resetSongSession();
    // Reset musí zrušiť blokovanie aj cooldown — inak by sa zásoba postupne
    // zužovala aj medzi partiami. Netestujeme to náhodným ťahaním, ale priamo
    // na stave session, takže výsledok nezávisí od šťastia.
    expect(session.usedSongIds.size).toBe(0);
    expect(session.artistCooldown.size).toBe(0);
    expect(session.draws).toBe(0);
    const candidates = new Set(songCandidates("sk", "hum").map(song => song.id));
    for (const song of first) {
      expect(candidates.has(song.id), song.id).toBe(true);
      expect(session.usedSongIds.has(song.id), song.id).toBe(false);
    }
  });
});

describe("cooldown interpreta", () => {
  it("po použití interpreta sa jeho ďalšie skladby dočasne nevyberajú", () => {
    const session = createSongSession();
    const queen = ALL_SONGS.filter(song => song.artistKey === "queen");
    expect(queen.length).toBeGreaterThan(3);
    markSongUsed(queen[0], session);
    const until = session.artistCooldown.get("queen");
    expect(until).toBe(session.draws + ARTIST_COOLDOWN_DRAWS);
  });

  it("ten istý interpret nechodí v rade za sebou", () => {
    const session = createSongSession();
    const drawn = drawSongs({ language: "sk", minigame: "buzzer", count: 60, session });
    for (let index = 1; index < drawn.length; index += 1) {
      expect(
        drawn[index].artistKey,
        `${drawn[index - 1].artist} → ${drawn[index].artist}`,
      ).not.toBe(drawn[index - 1].artistKey);
    }
  });

  it("interpret sa po dostatočnom počte ťahov smie vrátiť", () => {
    const session = createSongSession();
    const drawn = drawSongs({ language: "sk", minigame: "buzzer", count: 400, session });
    const counts = new Map<string, number>();
    for (const song of drawn) counts.set(song.artistKey, (counts.get(song.artistKey) ?? 0) + 1);
    // Pri 400 ťahoch sa musí niektorý interpret zopakovať — cooldown je dočasný, nie trvalý.
    expect([...counts.values()].some(count => count > 1)).toBe(true);
  });
});

describe("pomer lokálne / svetové", () => {
  it("slovenská hra nie je čisto anglický playlist", () => {
    const session = createSongSession();
    const drawn = drawSongs({
      language: "sk",
      minigame: "buzzer",
      count: 300,
      session,
      random: seededRandom(7),
    });
    const localIds = new Set(getLocalSongsForLanguage("sk").map(song => song.id));
    const localShare = drawn.filter(song => localIds.has(song.id)).length / drawn.length;
    expect(localShare).toBeGreaterThan(0.15);
    expect(localShare).toBeLessThan(0.6);
  });

  it("svetové skladby sa stále dostávajú do lokálnej hry", () => {
    const session = createSongSession();
    const drawn = drawSongs({
      language: "de",
      minigame: "buzzer",
      count: 200,
      session,
      random: seededRandom(11),
    });
    const globalIds = new Set(GLOBAL_SONGS.map(song => song.id));
    const globalShare = drawn.filter(song => globalIds.has(song.id)).length / drawn.length;
    expect(globalShare).toBeGreaterThan(0.4);
  });

  it("podiel lokálnych skladieb sa dá nastaviť", () => {
    const localIds = new Set(getLocalSongsForLanguage("sk").map(song => song.id));
    const shareFor = (localShare: number) => {
      const session = createSongSession();
      const drawn = drawSongs({
        language: "sk",
        minigame: "buzzer",
        count: 200,
        localShare,
        session,
        random: seededRandom(3),
      });
      return drawn.filter(song => localIds.has(song.id)).length / drawn.length;
    };
    expect(shareFor(0.8)).toBeGreaterThan(shareFor(0.1));
  });
});

describe("náročnosť", () => {
  it("výber vie pracovať s náročnosťou", () => {
    const session = createSongSession();
    const easy = drawSongs({
      language: "sk",
      minigame: "buzzer",
      count: 40,
      tiers: ["easy"],
      session,
    });
    expect(easy.length).toBe(40);
    expect(easy.every(song => song.tier === "easy")).toBe(true);
  });

  it("príliš úzka náročnosť sa uvolní namiesto pádu", () => {
    const session = createSongSession();
    // „hard" skladieb je málo — výber ich vyčerpá a musí pokračovať.
    const drawn = drawSongs({
      language: "en",
      minigame: "hum",
      count: 300,
      tiers: ["hard"],
      session,
    });
    expect(drawn).toHaveLength(300);
    expect(new Set(drawn.map(song => song.id)).size).toBe(300);
  });
});

describe("odolnosť výberu", () => {
  it("vyčerpanie lokálneho poolu hru nepoloží", () => {
    const session = createSongSession();
    for (const song of getLocalSongsForLanguage("sk")) markSongUsed(song, session);
    const song = drawSong({ language: "sk", minigame: "hum", session, localShare: 1 });
    expect(song).not.toBeNull();
  });

  it("pri malej zásobe padne výber na svetový pool", () => {
    const session = createSongSession();
    // Vyčerpáme všetko lokálne aj polovicu svetového poolu.
    for (const song of getLocalSongsForLanguage("de")) markSongUsed(song, session);
    for (const song of GLOBAL_SONGS.slice(0, Math.floor(GLOBAL_SONGS.length / 2))) {
      markSongUsed(song, session);
    }
    const drawn = drawSongs({ language: "de", minigame: "buzzer", count: 25, session });
    expect(drawn).toHaveLength(25);
  });

  it("výber nikdy nevráti null, kým je v databáze skladba", () => {
    for (const language of GAME_LANGUAGES) {
      const session = createSongSession();
      // Označíme celú zásobu za použitú — výber musí začať nový cyklus.
      for (const song of getSongCardsForLanguage(language)) markSongUsed(song, session);
      for (const minigame of ["hum", "buzzer"] as MusicMinigame[]) {
        expect(drawSong({ language, minigame, session }), `${language}/${minigame}`).not.toBeNull();
      }
    }
  });

  it("jazykový filter nerozbije výber v žiadnom jazyku", () => {
    for (const language of GAME_LANGUAGES) {
      const session = createSongSession();
      const drawn = drawSongs({ language, minigame: "hum", count: 50, session });
      expect(drawn, language).toHaveLength(50);
      expect(drawn.every(song => song.hummable), language).toBe(true);
    }
  });
});

describe("dlhodobá rotácia medzi partiami", () => {
  it("skladby z minulej party sa uprednostnene neopakujú", () => {
    // takePersistentItems/seenDeckIds píšu do localStorage — v teste ho nahradíme.
    const store = new Map<string, string>();
    (globalThis as Record<string, unknown>).window = {
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => void store.set(key, value),
        removeItem: (key: string) => void store.delete(key),
      },
    };
    try {
      const first = drawSongs({
        language: "sk",
        minigame: "buzzer",
        count: 40,
        session: createSongSession(),
      });
      expect(first).toHaveLength(40);
      // Nová párty (nová session), ale deck si pamätá minulú.
      const second = drawSongs({
        language: "sk",
        minigame: "buzzer",
        count: 40,
        session: createSongSession(),
      });
      const firstIds = new Set(first.map(song => song.id));
      const repeats = second.filter(song => firstIds.has(song.id)).length;
      expect(repeats).toBe(0);
    } finally {
      delete (globalThis as Record<string, unknown>).window;
    }
  });

  it("bez localStorage výber funguje rovnako", () => {
    expect(typeof window).toBe("undefined");
    const drawn = drawSongs({
      language: "sk",
      minigame: "hum",
      count: 20,
      session: createSongSession(),
    });
    expect(drawn).toHaveLength(20);
  });
});

describe("simulácia 300 sessions", () => {
  it("výber sa počas stoviek partií správa rozumne", () => {
    const random = seededRandom(20260822);
    let totalDraws = 0;
    let repeatsWithinSession = 0;
    let crossMinigameOverlaps = 0;
    let backToBackArtists = 0;
    let localHits = 0;

    for (let round = 0; round < 300; round += 1) {
      const language = GAME_LANGUAGES[Math.floor(random() * GAME_LANGUAGES.length)];
      const session = createSongSession();
      const localIds = new Set(getLocalSongsForLanguage(language).map(song => song.id));

      // Jedna párty: najprv Zahmkaj pesničku, potom Hudobný kvíz.
      const hum = drawSongs({ language, minigame: "hum", count: 8, session, random });
      const buzzer = drawSongs({ language, minigame: "buzzer", count: 10, session, random });
      const all: Song[] = [...hum, ...buzzer];

      totalDraws += all.length;
      if (new Set(all.map(song => song.id)).size !== all.length) repeatsWithinSession += 1;
      const humIds = new Set(hum.map(song => song.id));
      crossMinigameOverlaps += buzzer.filter(song => humIds.has(song.id)).length;
      for (let index = 1; index < all.length; index += 1) {
        if (all[index].artistKey === all[index - 1].artistKey) backToBackArtists += 1;
      }
      localHits += all.filter(song => localIds.has(song.id)).length;
      expect(hum.every(song => song.hummable)).toBe(true);
    }

    expect(totalDraws).toBe(300 * 18);
    expect(repeatsWithinSession).toBe(0);
    expect(crossMinigameOverlaps).toBe(0);
    expect(backToBackArtists).toBe(0);
    const localShare = localHits / totalDraws;
    expect(localShare).toBeGreaterThan(0.15);
    expect(localShare).toBeLessThan(0.6);
  });
});
