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

function matchParts(song: SongCard, title: string, artist: string) {
  const expectedTitle = normalize(song.title);
  const expectedArtist = normalizeArtist(song.artist);
  const actualTitle = normalize(title);
  const actualArtist = normalizeArtist(artist);
  const looksLikeUnofficialCover =
    /\b(?:tribute|cover|karaoke|soundalike|made famous)\b/u.test(actualArtist);
  const titleScore =
    expectedTitle && actualTitle
      ? actualTitle === expectedTitle
        ? 6
        : actualTitle.includes(expectedTitle) ||
            expectedTitle.includes(actualTitle)
          ? 3
          : 0
      : 0;
  const artistScore =
    expectedArtist && actualArtist && !looksLikeUnofficialCover
      ? actualArtist === expectedArtist
        ? 4
        : actualArtist.includes(expectedArtist) ||
            expectedArtist.includes(actualArtist)
          ? 2
          : 0
      : 0;
  return { titleScore, artistScore, total: titleScore + artistScore };
}

function isConfidentMatch(song: SongCard, title: string, artist: string) {
  const { titleScore, artistScore } = matchParts(song, title, artist);
  return titleScore >= 3 && artistScore >= 2;
}

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
        const candidates = (result.results ?? []).filter(
          item => item.previewUrl
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
      const candidates = (result.data ?? []).filter(item => item.preview);
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
