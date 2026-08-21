import { useState, type CSSProperties } from "react";
import { Icons } from "../../components/icons";
import { PartyBackdrop, PartyEyebrow } from "../teamBattle/PartyChrome";
import { ForbiddenWordGame, GuessSongGame } from "../teamBattle/PassAndPlay";
import MusicBuzzer from "../teamBattle/MusicBuzzer";
import SoundBuzzer from "../teamBattle/SoundBuzzer";
import {
  FiveInTenGame,
  LetterChallengeGame,
} from "../teamBattle/QuickChallenges";
import {
  PARTY_PLAYER_COLORS,
  type QuickPlayMode,
} from "../teamBattle/quickGameShared";
/** Design: Nočný herný salón — rýchle hry používajú hostované tematické motívy. */
import {
  forbiddenArt,
  fiveTenGameHero as fiveTenArt,
  letterGameHero as letterArt,
  musicQuizGameHero as musicQuizArt,
  soundArt,
} from "../../media";
import {
  defaultPlayerName,
  defaultTeamName,
  useLanguage,
} from "../../i18n/LanguageProvider";
import SongGameArtwork from "../../components/SongGameArtwork";

type QuickGameType =
  "zakazane" | "pesnicka" | "hudobny-kviz" | "zvuk" | "pismeno" | "patzadesat";

const GAME_TITLES: Record<QuickGameType, string> = {
  zakazane: "Zakázané slovo",
  pesnicka: "Zahmkaj pesničku",
  "hudobny-kviz": "Hudobný kvíz",
  zvuk: "Uhádni zvuk",
  pismeno: "Slovo na písmeno",
  patzadesat: "5 za 10",
};

const GAME_ART: Record<QuickGameType, string> = {
  zakazane: forbiddenArt,
  pesnicka: "",
  "hudobny-kviz": musicQuizArt,
  zvuk: soundArt,
  pismeno: letterArt,
  patzadesat: fiveTenArt,
};

const GAME_THEME: Record<
  QuickGameType,
  { primary: string; secondary: string; eyebrow: string; prompt: string }
> = {
  zakazane: {
    primary: "#fb7185",
    secondary: "#f97316",
    eyebrow: "Slová pod tlakom",
    prompt: "Vysvetľuj bez zakázaných výrazov",
  },
  pesnicka: {
    primary: "#a78bfa",
    secondary: "#f0abfc",
    eyebrow: "Melódia bez slov",
    prompt: "Zahmkaj hit a nechaj ostatných hádať",
  },
  "hudobny-kviz": {
    primary: "#d946ef",
    secondary: "#6366f1",
    eyebrow: "Poznáš tento hit?",
    prompt: "Počúvaj ukážky a zbieraj body",
  },
  zvuk: {
    primary: "#22d3ee",
    secondary: "#3b82f6",
    eyebrow: "Čo práve počuješ?",
    prompt: "Rozpoznaj zvuky skôr než súperi",
  },
  pismeno: {
    primary: "#fbbf24",
    secondary: "#f97316",
    eyebrow: "Písmeno rozhoduje",
    prompt: "Nájdi správne slovo skôr než vyprší čas",
  },
  patzadesat: {
    primary: "#34d399",
    secondary: "#14b8a6",
    eyebrow: "Päť odpovedí",
    prompt: "Zvládni celú výzvu za desať sekúnd",
  },
};

function GameGlyph({
  game,
  size = 20,
}: {
  game: QuickGameType;
  size?: number;
}) {
  if (game === "zakazane") return <Icons.xCircle size={size} />;
  if (game === "pesnicka") return <Icons.music size={size} />;
  if (game === "hudobny-kviz") return <Icons.headphones size={size} />;
  if (game === "zvuk") return <Icons.bell size={size} />;
  if (game === "pismeno") return <Icons.tag size={size} />;
  return <Icons.timer size={size} />;
}

interface GameOptions {
  rounds: number[];
  defaultRounds: number;
  times: number[];
  defaultTime: number;
  roundsLabel: string;
  timeLabel: string;
  roundsArePerParticipant: boolean;
  maxPlayers?: number;
}

const GAME_OPTIONS: Record<QuickGameType, GameOptions> = {
  zakazane: {
    rounds: [1, 2, 3, 4],
    defaultRounds: 1,
    times: [30, 45, 60, 90],
    defaultTime: 60,
    roundsLabel: "Kolá na hráča / tím",
    timeLabel: "Čas jedného kola",
    roundsArePerParticipant: true,
  },
  pesnicka: {
    rounds: [1, 2, 3, 4],
    defaultRounds: 1,
    times: [30, 45, 60, 90],
    defaultTime: 60,
    roundsLabel: "Kolá na hráča / tím",
    timeLabel: "Čas jedného kola",
    roundsArePerParticipant: true,
  },
  "hudobny-kviz": {
    rounds: [5, 10, 15, 20],
    defaultRounds: 10,
    times: [7, 10, 15, 20],
    defaultTime: 10,
    roundsLabel: "Počet pesničiek",
    timeLabel: "Dĺžka ukážky",
    roundsArePerParticipant: false,
    maxPlayers: 4,
  },
  zvuk: {
    rounds: [5, 10, 15, 20],
    defaultRounds: 10,
    times: [5, 7, 10, 15],
    defaultTime: 7,
    roundsLabel: "Počet zvukov",
    timeLabel: "Dĺžka ukážky",
    roundsArePerParticipant: false,
  },
  pismeno: {
    rounds: [1, 2, 3, 4],
    defaultRounds: 2,
    times: [5, 7, 10, 15],
    defaultTime: 5,
    roundsLabel: "Kolá na hráča / tím",
    timeLabel: "Čas na odpoveď",
    roundsArePerParticipant: true,
  },
  patzadesat: {
    rounds: [1, 2, 3, 4],
    defaultRounds: 2,
    times: [10, 15, 20, 30],
    defaultTime: 10,
    roundsLabel: "Kolá na hráča / tím",
    timeLabel: "Čas na výzvu",
    roundsArePerParticipant: true,
  },
};

function defaultNames(
  mode: QuickPlayMode,
  language: Parameters<typeof defaultPlayerName>[0]
) {
  return mode === "teams"
    ? [defaultTeamName(language, "A"), defaultTeamName(language, "B")]
    : Array.from({ length: 4 }, (_, index) =>
        defaultPlayerName(language, index + 1)
      );
}

export default function TeamQuickGame({
  game,
  onBack,
  onGameComplete,
}: {
  game: QuickGameType;
  onBack: () => void;
  onGameComplete?: (correctAnswers: number) => void;
}) {
  const { language } = useLanguage();
  const [phase, setPhase] = useState<"setup" | "playing" | "result">("setup");
  const [gameMode, setGameMode] = useState<QuickPlayMode>("players");
  const [names, setNames] = useState<string[]>(() =>
    defaultNames("players", language)
  );
  const [playersOpen, setPlayersOpen] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [run, setRun] = useState(0);
  const theme = GAME_THEME[game];
  const accent = theme.primary;
  const options = GAME_OPTIONS[game];
  const [rounds, setRounds] = useState(options.defaultRounds);
  const [timeSeconds, setTimeSeconds] = useState(options.defaultTime);
  const maxPlayers = options.maxPlayers ?? 8;
  const playerRange = `2–${maxPlayers}`;
  const playerRangeDescription =
    maxPlayers === 4 ? "2 až 4 hráči" : "2 až 8 hráčov";

  function chooseMode(mode: QuickPlayMode) {
    if (mode === gameMode) return;
    setGameMode(mode);
    setNames(defaultNames(mode, language));
    setScores([]);
    setPlayersOpen(false);
  }

  function changeName(index: number, value: string) {
    setNames(current =>
      current.map((name, nameIndex) => (nameIndex === index ? value : name))
    );
  }

  function addPlayer() {
    if (names.length >= maxPlayers) return;
    setNames(current => [
      ...current,
      defaultPlayerName(language, current.length + 1),
    ]);
  }

  function removePlayer(index: number) {
    if (names.length <= 2) return;
    setNames(current => current.filter((_, nameIndex) => nameIndex !== index));
  }

  function start() {
    setRun(value => value + 1);
    setPhase("playing");
  }

  function finish(result: number[]) {
    setScores(result);
    setPhase("result");
    onGameComplete?.(
      result.reduce((sum, score) => sum + Math.max(0, score), 0)
    );
  }

  if (phase === "playing") {
    const shared = {
      participantNames: names,
      gameMode,
      rounds,
      timeSeconds,
      onDone: finish,
    };
    if (game === "zakazane") return <ForbiddenWordGame key={run} {...shared} />;
    if (game === "pesnicka") return <GuessSongGame key={run} {...shared} />;
    if (game === "hudobny-kviz") return <MusicBuzzer key={run} {...shared} />;
    if (game === "zvuk") return <SoundBuzzer key={run} {...shared} />;
    if (game === "pismeno")
      return <LetterChallengeGame key={run} {...shared} />;
    return <FiveInTenGame key={run} {...shared} />;
  }

  if (phase === "result") {
    const topScore = Math.max(...scores);
    const winners = scores
      .map((score, index) => (score === topScore ? index : -1))
      .filter(index => index >= 0);
    const draw = winners.length > 1;
    return (
      <PartyBackdrop>
        <main className="flex h-full flex-col items-center overflow-hidden px-5 py-4 text-center">
          <PartyEyebrow>Koniec minihry</PartyEyebrow>
          <div className="quick-result-emblem mx-auto mt-7 flex h-20 w-20 items-center justify-center rounded-[1.8rem] border border-white/15 bg-white/[.06] text-white">
            {draw ? (
              <Icons.users size={36} />
            ) : (
              <Icons.trophy size={38} className="text-amber-200" />
            )}
          </div>
          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
            {GAME_TITLES[game]}
          </p>
          <h1 className="mt-2 text-4xl font-black text-white">
            {draw ? "Remíza!" : `${names[winners[0]]} vyhráva!`}
          </h1>
          <div className="mt-7 grid w-full max-w-sm grid-cols-2 gap-3">
            {names.map((name, index) => {
              const color =
                PARTY_PLAYER_COLORS[index % PARTY_PLAYER_COLORS.length];
              return (
                <div
                  key={`${name}-${index}`}
                  className="party-glass rounded-[1.7rem] p-4"
                  style={{ borderColor: `${color}66` }}
                >
                  <p
                    className="truncate text-[10px] font-black uppercase tracking-wider"
                    style={{ color }}
                  >
                    {name}
                  </p>
                  <p className="mt-2 text-4xl font-black text-white">
                    {scores[index] ?? 0}
                  </p>
                  <p className="mt-1 text-[8px] font-bold uppercase tracking-widest text-white/30">
                    bodov
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-7 w-full max-w-sm space-y-3">
            <button
              onClick={start}
              className="party-shine w-full overflow-hidden rounded-2xl py-5 text-base font-black text-white shadow-xl transition active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${accent}, #7c3aed)`,
              }}
            >
              Hrať znova
            </button>
            <button
              onClick={() => {
                chooseMode("players");
                setPhase("setup");
              }}
              className="party-glass w-full rounded-2xl py-4 text-sm font-black text-white/70 transition active:scale-95"
            >
              Nastavenia hry
            </button>
            <button
              onClick={onBack}
              className="w-full py-3 text-sm font-black text-white/35 transition active:scale-95"
            >
              Späť na minihry
            </button>
          </div>
        </main>
      </PartyBackdrop>
    );
  }

  return (
    <PartyBackdrop>
      <main
        className={`mobile-settings mobile-party-settings quick-setup-screen quick-setup-${game} scroll-panel h-full overflow-y-auto px-5 pb-8 pt-5`}
        style={
          {
            "--quick-primary": theme.primary,
            "--quick-secondary": theme.secondary,
          } as CSSProperties
        }
      >
        <div className="mx-auto w-full max-w-md">
          <header className="flex items-center justify-between">
            <button
              onClick={onBack}
              aria-label="Späť"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/70 backdrop-blur-xl transition active:scale-90"
            >
              <Icons.arrowLeft size={20} />
            </button>
            <PartyEyebrow>
              {gameMode === "teams" ? "Tímová hra" : "Nastavenia hry"}
            </PartyEyebrow>
            <div className="exit-slot-spacer" />
          </header>

          <div
            className="game-setup-hero relative mt-5 h-48 overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl"
            style={{ "--setup-accent": accent } as CSSProperties}
          >
            {game === "pesnicka" ? (
              <SongGameArtwork
                className="h-full w-full transition-transform duration-700"
                labelled
              />
            ) : (
              <img
                src={GAME_ART[game]}
                alt=""
                className="h-full w-full object-cover transition-transform duration-700"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080b13]/95 via-[#080b13]/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080b13]/85 via-transparent to-black/10" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
              <div>
                <span className="quick-game-signature mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[8px] font-black uppercase tracking-[.2em] backdrop-blur">
                  <GameGlyph game={game} size={12} /> {theme.eyebrow}
                </span>
                <h1 className="max-w-[16rem] text-[2rem] font-black leading-[.98] tracking-[-.04em] text-white">
                  {GAME_TITLES[game]}
                </h1>
              </div>
              <span className="setup-player-badge inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-2 text-[9px] font-black uppercase tracking-wider text-white/80 backdrop-blur">
                <Icons.users size={15} /> {playerRange}
              </span>
            </div>
          </div>

          <>
            <section className="party-glass mt-5 overflow-hidden rounded-[1.55rem]">
              <button
                type="button"
                onClick={() => setPlayersOpen(open => !open)}
                aria-expanded={playersOpen}
                className="flex w-full items-center gap-3 p-4 text-left transition active:scale-[.99]"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${accent}30`, color: accent }}
                >
                  <Icons.users size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm font-black text-white">
                    {gameMode === "teams" ? "Tímy" : "Hráči"}
                  </strong>
                  <small className="mt-0.5 block text-[11px] font-medium text-white/45">
                    {gameMode === "teams"
                      ? "2 tímy · spoločné body"
                      : `${names.length} hráči · ${playerRangeDescription}`}
                  </small>
                </span>
                <span
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider"
                  style={{ color: accent }}
                >
                  Upraviť{" "}
                  <Icons.chevronRight
                    size={16}
                    className={
                      playersOpen
                        ? "rotate-90 transition-transform"
                        : "transition-transform"
                    }
                  />
                </span>
              </button>
              {playersOpen && (
                <div className="space-y-2 border-t border-white/[0.08] px-4 pb-4 pt-3">
                  <p className="px-1 pb-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                    {gameMode === "teams" ? "Názvy tímov" : "Mená hráčov"}
                  </p>
                  {names.map((name, index) => {
                    const color =
                      PARTY_PLAYER_COLORS[index % PARTY_PLAYER_COLORS.length];
                    return (
                      <label
                        key={index}
                        className="party-glass flex items-center gap-3 rounded-2xl p-3"
                        style={{ borderColor: `${color}55` }}
                      >
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                          style={{ background: color }}
                        >
                          {gameMode === "teams"
                            ? String.fromCharCode(65 + index)
                            : index + 1}
                        </span>
                        <input
                          value={name}
                          onChange={event =>
                            changeName(index, event.target.value)
                          }
                          maxLength={20}
                          className="min-w-0 flex-1 border-0 bg-transparent text-base font-black text-white outline-none"
                        />
                        {gameMode === "players" && names.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removePlayer(index)}
                            aria-label={`Odstrániť ${name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-lg text-white/40"
                          >
                            ×
                          </button>
                        )}
                      </label>
                    );
                  })}
                  {gameMode === "players" && names.length < maxPlayers && (
                    <button
                      onClick={addPlayer}
                      className="party-glass w-full rounded-2xl py-3 text-sm font-black text-white/60 transition active:scale-95"
                    >
                      + Pridať hráča
                    </button>
                  )}
                </div>
              )}
            </section>

            <section className="party-glass mt-3 overflow-hidden rounded-[1.55rem]">
              <button
                type="button"
                onClick={() =>
                  chooseMode(gameMode === "teams" ? "players" : "teams")
                }
                aria-pressed={gameMode === "teams"}
                className="flex w-full items-center gap-3 p-4 text-left transition active:scale-[.99]"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background:
                      gameMode === "teams"
                        ? `${accent}30`
                        : "rgba(255,255,255,.06)",
                    color:
                      gameMode === "teams" ? accent : "rgba(255,255,255,.5)",
                  }}
                >
                  <Icons.users size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm font-black text-white">
                    Tímový režim
                  </strong>
                  <small className="mt-0.5 block text-[11px] font-medium text-white/45">
                    Dva tímy · spoločné body
                  </small>
                </span>
                <span
                  className={`relative h-7 w-12 rounded-full border transition ${gameMode === "teams" ? "border-white/20" : "border-white/10 bg-white/[.05]"}`}
                  style={
                    gameMode === "teams" ? { background: accent } : undefined
                  }
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${gameMode === "teams" ? "translate-x-6" : "translate-x-1"}`}
                  />
                </span>
              </button>
            </section>

            <section className="party-glass mt-3 rounded-[1.8rem] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.24em]"
                    style={{ color: accent }}
                  >
                    Nastavenie hry
                  </p>
                  <p className="mt-1 text-sm font-bold text-white/65">
                    Prispôsobte si tempo a dĺžku
                  </p>
                </div>
                <span className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-[10px] font-black text-white/45">
                  {options.roundsArePerParticipant
                    ? rounds * names.length
                    : rounds}{" "}
                  kôl
                </span>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
                    {options.roundsLabel}
                  </p>
                  <span
                    className="text-xs font-black"
                    style={{ color: accent }}
                  >
                    {rounds}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {options.rounds.map(value => (
                    <button
                      key={value}
                      onClick={() => setRounds(value)}
                      className={`rounded-xl border py-3 text-sm font-black transition active:scale-95 ${rounds === value ? "text-white shadow-lg" : "border-white/10 bg-white/[0.035] text-white/35"}`}
                      style={
                        rounds === value
                          ? {
                              borderColor: `${accent}aa`,
                              background: `${accent}2e`,
                              boxShadow: `0 10px 25px ${accent}18`,
                            }
                          : undefined
                      }
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
                    {options.timeLabel}
                  </p>
                  <span
                    className="text-xs font-black"
                    style={{ color: accent }}
                  >
                    {timeSeconds} s
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {options.times.map(value => (
                    <button
                      key={value}
                      onClick={() => setTimeSeconds(value)}
                      className={`rounded-xl border py-3 text-sm font-black transition active:scale-95 ${timeSeconds === value ? "text-white shadow-lg" : "border-white/10 bg-white/[0.035] text-white/35"}`}
                      style={
                        timeSeconds === value
                          ? {
                              borderColor: `${accent}aa`,
                              background: `${accent}2e`,
                              boxShadow: `0 10px 25px ${accent}18`,
                            }
                          : undefined
                      }
                    >
                      {value}s
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <button
              onClick={start}
              disabled={names.some(name => !name.trim())}
              className="party-shine mt-6 w-full overflow-hidden rounded-2xl py-5 text-base font-black uppercase tracking-wider text-white shadow-xl transition active:scale-[.97] disabled:opacity-35"
              style={{
                background: `linear-gradient(135deg, ${accent}, #7c3aed)`,
              }}
            >
              Začať minihru
            </button>
          </>
        </div>
      </main>
    </PartyBackdrop>
  );
}

export type { QuickGameType };
