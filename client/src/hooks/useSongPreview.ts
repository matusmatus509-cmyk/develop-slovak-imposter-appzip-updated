import { useCallback, useEffect, useRef, useState } from "react";
import type { SongCard } from "../data/teamBattleExtras";

export type SongPreviewStatus =
  "idle" | "loading" | "ready" | "playing" | "missing" | "error";

interface PreviewSource {
  url: string;
  link: string;
  /** Obal albumu od poskytovateľa — odhalí sa až s odpoveďou, aby neprezradil skladbu. */
  artwork: string | null;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/\b(?:feat|featuring|ft)\.?\b.*$/u, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeArtist(value: string) {
  return normalize(value)
    .replace(/\b(?:a|and|und|et|y|e)\b/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Značky verzií, ktoré nie sú originálna nahrávka.
 *
 * Remaster tu zámerne nie je — je to tá istá nahrávka, len premasterovaná, a
 * v katalógoch poskytovateľov je pri starších hitoch často jediná dostupná.
 * Rovnako nie je „radio edit", ktorý je bežne práve singlová verzia originálu.
 */
const NON_ORIGINAL_VERSION =
  /\b(?:live|remix|rmx|mix|karaoke|instrumental|acoustic|unplugged|acapella|cappella|rerecorded|re recorded|taylor s version|sped up|slowed|nightcore|lullaby|mashup|medley|demo|rehearsal|reprise|from the vault|8 bit)\b/u;

/** Interpret, ktorý priamo priznáva, že nejde o originálneho autora. */
const IMPERSONATOR =
  /\b(?:tribute|cover|covers|karaoke|soundalike|made famous|in the style of|as made popular by)\b/u;

/** Meno interpreta kratšie ako toto sa nesmie párovať ako podstring. */
const SHORT_ARTIST_LIMIT = 5;

/** Obsahuje `haystack` celé `needle` ako súvislú sekvenciu slov? */
function containsWords(haystack: string, needle: string) {
  if (!haystack || !needle) return false;
  const hay = haystack.split(" ");
  const need = needle.split(" ");
  if (need.length > hay.length) return false;
  for (let start = 0; start <= hay.length - need.length; start++) {
    if (need.every((word, offset) => hay[start + offset] === word)) return true;
  }
  return false;
}

/**
 * Text, ktorý poskytovateľ pridal nad očakávaný názov — typicky „(Live)",
 * „- Remix" alebo „(Taylor's Version)".
 *
 * Značky sa hľadajú len v tomto zvyšku, nie v celom názve. Inak by filter
 * zamietol skladby, ktoré majú dané slovo v samotnom názve, ako „Live and Let
 * Die" alebo „Love Me like You Do".
 */
function versionResidue(expectedTitle: string, actualTitle: string) {
  if (!expectedTitle || !actualTitle) return "";
  const at = actualTitle.indexOf(expectedTitle);
  if (at < 0) return actualTitle;
  return `${actualTitle.slice(0, at)} ${actualTitle.slice(at + expectedTitle.length)}`.trim();
}

/** Je to originálna nahrávka, alebo iná verzia či prevzatie? */
function isOriginalRecording(song: SongCard, title: string, artist: string) {
  const actualArtist = normalizeArtist(artist);
  if (IMPERSONATOR.test(actualArtist)) return false;

  const residue = versionResidue(normalize(song.title), normalize(title));
  return !NON_ORIGINAL_VERSION.test(residue);
}

function matchParts(song: SongCard, title: string, artist: string) {
  const expectedTitle = normalize(song.title);
  const expectedArtist = normalizeArtist(song.artist);
  const actualTitle = normalize(title);
  const actualArtist = normalizeArtist(artist);

  const titleScore =
    expectedTitle && actualTitle
      ? actualTitle === expectedTitle
        ? 6
        : containsWords(actualTitle, expectedTitle) ||
            containsWords(expectedTitle, actualTitle)
          ? 3
          : 0
      : 0;

  const artistExact = Boolean(
    expectedArtist && actualArtist && actualArtist === expectedArtist
  );
  const artistPartial = Boolean(
    expectedArtist &&
    actualArtist &&
    !artistExact &&
    (containsWords(actualArtist, expectedArtist) ||
      containsWords(expectedArtist, actualArtist))
  );
  const artistScore = artistExact ? 4 : artistPartial ? 2 : 0;

  return {
    titleScore,
    artistScore,
    total: titleScore + artistScore,
    /**
     * Krátke mená ako U2, Sia alebo Toto sa ako slovo trafia aj do cudzieho
     * mena („Toto" v „Totó la Momposina"), takže pri nich samotná čiastočná
     * zhoda nestačí.
     */
    weakShortArtist:
      artistPartial && expectedArtist.length < SHORT_ARTIST_LIMIT,
  };
}

function isConfidentMatch(song: SongCard, title: string, artist: string) {
  if (!isOriginalRecording(song, title, artist)) return false;
  const { titleScore, artistScore, weakShortArtist } = matchParts(
    song,
    title,
    artist
  );
  if (titleScore < 3 || artistScore < 2) return false;
  // Pri krátkom mene interpreta pustíme ďalej len presný názov skladby.
  if (weakShortArtist && titleScore < 6) return false;
  return true;
}

/**
 * Vystavené len pre testy — párovanie rozhoduje, či hráč dostane bod, takže
 * jeho pravidlá si zaslúžia vlastné pokrytie.
 */
export const __songMatching = {
  isConfidentMatch,
  isOriginalRecording,
  matchParts,
};

/** Resolves and plays a legal provider-hosted preview without bundling copyrighted audio. */
export function useSongPreview(
  song: SongCard | null,
  enabled: boolean,
  maxSeconds = 10
) {
  const [source, setSource] = useState<PreviewSource | null>(null);
  const [status, setStatus] = useState<SongPreviewStatus>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const playbackAttemptRef = useRef(0);

  const stop = useCallback((nextStatus: SongPreviewStatus = "ready") => {
    playbackAttemptRef.current += 1;
    if (stopTimerRef.current !== null)
      window.clearTimeout(stopTimerRef.current);
    stopTimerRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setStatus(current =>
      current === "missing" || current === "error" ? current : nextStatus
    );
  }, []);

  useEffect(() => {
    stop("idle");
    setSource(null);
    if (!enabled || !song) {
      setStatus("idle");
      return;
    }

    const query = encodeURIComponent(`${song.title} ${song.artist}`);
    const requestId = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const deezerCallback = `__partySongDeezer_${requestId}`;
    const itunesCallback = `__partySongItunes_${requestId}`;
    const jsonpWindow = window as unknown as Record<string, unknown>;
    const scripts: HTMLScriptElement[] = [];
    const timeouts: number[] = [];
    let active = true;
    let fallbackStarted = false;
    setStatus("loading");

    const clearTimeouts = () =>
      timeouts.splice(0).forEach(timeout => window.clearTimeout(timeout));
    const usePreview = (preview: PreviewSource) => {
      if (!active) return;
      clearTimeouts();
      setSource(preview);
      setStatus("ready");
    };
    const markMissing = () => {
      if (!active) return;
      clearTimeouts();
      setStatus("missing");
    };

    const startItunes = () => {
      if (!active || fallbackStarted) return;
      fallbackStarted = true;
      clearTimeouts();
      const script = document.createElement("script");
      scripts.push(script);
      jsonpWindow[itunesCallback] = (result: {
        results?: Array<{
          previewUrl?: string;
          trackViewUrl?: string;
          trackName?: string;
          artistName?: string;
          artworkUrl100?: string;
        }>;
      }) => {
        // Neoriginálne verzie sa vyhadzujú ešte pred zoradením. Keby sa
        // filtrovali až po ňom, „(Live)" s rovnakým skóre by mohol vyhrať nad
        // použiteľným originálom a zamietnutie by zahodilo obe.
        const candidates = (result.results ?? []).filter(
          item =>
            item.previewUrl &&
            isOriginalRecording(
              song,
              item.trackName ?? "",
              item.artistName ?? ""
            )
        );
        const match = candidates.sort(
          (a, b) =>
            matchParts(song, b.trackName ?? "", b.artistName ?? "").total -
            matchParts(song, a.trackName ?? "", a.artistName ?? "").total
        )[0];
        if (
          match?.previewUrl &&
          isConfidentMatch(song, match.trackName ?? "", match.artistName ?? "")
        ) {
          usePreview({
            url: match.previewUrl,
            link: match.trackViewUrl ?? "https://music.apple.com",
            // iTunes vracia 100px náhľad; rovnaká cesta vo vyššom rozlíšení je ostrá aj na retine.
            artwork:
              match.artworkUrl100?.replace(
                /\/100x100bb\.jpg$/,
                "/512x512bb.jpg"
              ) ?? null,
          });
        } else markMissing();
      };
      script.src = `https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=10&callback=${itunesCallback}`;
      script.onerror = markMissing;
      document.head.appendChild(script);
      timeouts.push(window.setTimeout(markMissing, 7000));
    };

    const deezerScript = document.createElement("script");
    scripts.push(deezerScript);
    jsonpWindow[deezerCallback] = (result: {
      data?: Array<{
        preview?: string;
        link?: string;
        title?: string;
        artist?: { name?: string };
        album?: { cover_big?: string; cover_medium?: string };
      }>;
    }) => {
      if (!active || fallbackStarted) return;
      const candidates = (result.data ?? []).filter(
        item =>
          item.preview &&
          isOriginalRecording(song, item.title ?? "", item.artist?.name ?? "")
      );
      const match = candidates.sort(
        (a, b) =>
          matchParts(song, b.title ?? "", b.artist?.name ?? "").total -
          matchParts(song, a.title ?? "", a.artist?.name ?? "").total
      )[0];
      if (
        match?.preview &&
        isConfidentMatch(song, match.title ?? "", match.artist?.name ?? "")
      ) {
        usePreview({
          url: match.preview,
          link: match.link ?? "https://www.deezer.com",
          artwork: match.album?.cover_big ?? match.album?.cover_medium ?? null,
        });
      } else startItunes();
    };
    deezerScript.src = `https://api.deezer.com/search?q=${query}&limit=10&output=jsonp&callback=${deezerCallback}`;
    deezerScript.onerror = startItunes;
    document.head.appendChild(deezerScript);
    timeouts.push(window.setTimeout(startItunes, 7000));

    return () => {
      active = false;
      clearTimeouts();
      scripts.forEach(script => script.remove());
      const inertCallback = () => undefined;
      jsonpWindow[deezerCallback] = inertCallback;
      jsonpWindow[itunesCallback] = inertCallback;
      window.setTimeout(() => {
        if (jsonpWindow[deezerCallback] === inertCallback)
          delete jsonpWindow[deezerCallback];
        if (jsonpWindow[itunesCallback] === inertCallback)
          delete jsonpWindow[itunesCallback];
      }, 10_000);
    };
  }, [enabled, song, stop]);

  useEffect(
    () => () => {
      playbackAttemptRef.current += 1;
      if (stopTimerRef.current !== null)
        window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
      audioRef.current?.pause();
      audioRef.current = null;
    },
    []
  );

  const play = useCallback(async () => {
    if (!enabled || !source || status === "loading") return false;
    stop("ready");
    const attempt = playbackAttemptRef.current;
    const audio = new Audio(source.url);
    audio.preload = "auto";
    audio.volume = 0.8;
    audioRef.current = audio;
    audio.addEventListener(
      "ended",
      () => {
        if (
          audioRef.current !== audio ||
          playbackAttemptRef.current !== attempt
        )
          return;
        audioRef.current = null;
        setStatus("ready");
      },
      { once: true }
    );
    try {
      await audio.play();
      if (
        audioRef.current !== audio ||
        playbackAttemptRef.current !== attempt
      ) {
        audio.pause();
        return false;
      }
      setStatus("playing");
      stopTimerRef.current = window.setTimeout(
        () => stop("ready"),
        Math.max(3, maxSeconds) * 1000
      );
      return true;
    } catch {
      if (audioRef.current !== audio || playbackAttemptRef.current !== attempt)
        return false;
      audioRef.current = null;
      setStatus("error");
      return false;
    }
  }, [enabled, maxSeconds, source, status, stop]);

  return { status, source, play, stop };
}
