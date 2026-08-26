import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icons } from "./icons";

/**
 * ── Zadávanie hráčov / tímov ────────────────────────────────────────────────
 *
 * Jediné miesto v aplikácii, kde sa zadávajú mená účastníkov. Predtým bol tento
 * blok skopírovaný v ôsmich obrazovkách v troch rôznych podobách — niekde vždy
 * rozbalený zoznam, inde mriežka počtu hráčov nad fixným poľom ôsmich mien.
 *
 * V nastaveniach zostane len súhrn s počtom účastníkov. Kliknutie otvorí
 * samostatnú stránku, na ktorej sa upravujú mená, a šípka späť sa vráti do
 * nastavení. Nastavenia tak zostanú krátke aj pri ôsmich hráčoch.
 *
 * Prečo je stránka portál do `document.body` a nie blok na mieste:
 * jednotlivé obrazovky majú vlastné vrstvy CSS (`.mobile-settings`,
 * `.mobile-party-settings`, `.guess-who-*`), ktoré cez `!important` prepisujú
 * pozadie, padding aj rámy vnorených sekcií a políčok. Vykreslením mimo tejto
 * kaskády vyzerá stránka rovnako v každej hre a žiadna obrazovka ju nevie
 * rozbiť.
 *
 * Mená si komponent zámerne nedrží — obrazovky ich potrebujú aj pri štarte hry
 * a niektoré na počet hráčov reagujú (napr. maximálny počet podvodníkov).
 * Vlastný stav má iba to, čo nikoho zvonka nezaujíma: či je stránka otvorená.
 */

/** Farby odznakov účastníkov. Kanonický zdroj — `PARTY_PLAYER_COLORS` ho re-exportuje. */
export const PLAYER_BADGE_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#a855f7",
  "#10b981",
  "#f59e0b",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

export interface ParticipantBadge {
  text: string;
  color: string;
}

export interface PlayerNamesFieldProps {
  names: string[];
  onChange: (names: string[]) => void;
  /** Farba obrazovky — odznak, ikona aj šípka ju preberajú. */
  accent: string;
  /** Hráči (predvolene) alebo tímy — mení len texty. */
  entity?: "players" | "teams";
  min?: number;
  max?: number;
  /** Meno pre práve pridaného účastníka (0-based index). */
  nameForNew?: (index: number) => string;
  /** Zástupný text v prázdnom políčku (0-based index). */
  placeholderFor?: (index: number) => string;
  /** Vlastný odznak — napr. `T1`/`T2` pri rozdelení hráčov do dvoch tímov. */
  badgeFor?: (index: number) => ParticipantBadge;
  /** Vlastný text súhrnu namiesto automatického počtu. */
  summary?: string;
  maxLength?: number;
  className?: string;
}

/** „1 hráč“ · „2 hráči“ · „5 hráčov“ — bez toho súhrn v slovenčine škrípe. */
function pluralize(count: number, entity: "players" | "teams"): string {
  const forms =
    entity === "teams" ? ["tím", "tímy", "tímov"] : ["hráč", "hráči", "hráčov"];
  if (count === 1) return `${count} ${forms[0]}`;
  if (count >= 2 && count <= 4) return `${count} ${forms[1]}`;
  return `${count} ${forms[2]}`;
}

export default function PlayerNamesField({
  names,
  onChange,
  accent,
  entity = "players",
  min = 2,
  max = 8,
  nameForNew,
  placeholderFor,
  badgeFor,
  summary,
  maxLength = 20,
  className = "",
}: PlayerNamesFieldProps) {
  const [open, setOpen] = useState(false);

  const isTeams = entity === "teams";
  const canAdd = names.length < max;
  const canRemove = names.length > min;
  // Pri pevnom počte účastníkov (2 tímy, 2 hráči) by veta o rozsahu klamala.
  const fixedCount = min === max;

  const title = isTeams ? "Tímy" : "Hráči";
  const detail =
    summary ??
    (fixedCount
      ? pluralize(names.length, entity)
      : `${pluralize(names.length, entity)} · ${min} až ${max} ${isTeams ? "tímov" : "hráčov"}`);

  // Kým je stránka otvorená, pozadie sa nesmie skrolovať — inak sa obrazovka
  // pod ňou posúva pod prstom pri písaní mien.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function changeName(index: number, value: string) {
    onChange(names.map((name, nameIndex) => (nameIndex === index ? value : name)));
  }

  function addParticipant() {
    if (!canAdd) return;
    const fallback = isTeams
      ? `Tím ${String.fromCharCode(65 + names.length)}`
      : `Hráč ${names.length + 1}`;
    onChange([...names, nameForNew?.(names.length) ?? fallback]);
  }

  function removeParticipant(index: number) {
    if (!canRemove) return;
    onChange(names.filter((_, nameIndex) => nameIndex !== index));
  }

  function badge(index: number): ParticipantBadge {
    return (
      badgeFor?.(index) ?? {
        text: isTeams ? String.fromCharCode(65 + index) : String(index + 1),
        color: PLAYER_BADGE_COLORS[index % PLAYER_BADGE_COLORS.length],
      }
    );
  }

  return (
    <>
      {/* Zámerne `button`, nie `section`: obrazovky s `.mobile-settings`
          prepisujú priamym potomkom `section` pozadie aj padding cez
          `!important`, čím sa súhrn rozpadol. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex w-full items-center gap-3 rounded-[1.35rem] p-4 text-left transition active:scale-[.99] ${className}`}
        style={{
          border: "1px solid rgba(255,255,255,.1)",
          background:
            "linear-gradient(145deg, rgba(255,255,255,.055), rgba(15,20,27,.92))",
        }}
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${accent}30`, color: accent }}
        >
          <Icons.users size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <strong className="block text-sm font-black text-white">{title}</strong>
          <small className="mt-0.5 block truncate text-[11px] font-medium text-white/45">
            {detail}
          </small>
        </span>
        <span
          className="flex shrink-0 items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
          style={{ color: accent }}
        >
          Upraviť <Icons.chevronRight size={16} />
        </span>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[300] flex flex-col bg-[#080b10] text-white"
            role="dialog"
            aria-modal="true"
            aria-label={isTeams ? "Názvy tímov" : "Mená hráčov"}
          >
            <header className="flex shrink-0 items-center gap-3 border-b border-white/[0.07] px-4 pb-3 pt-[max(.85rem,env(safe-area-inset-top))]">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Späť na nastavenia"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/75 transition active:scale-90"
              >
                <Icons.arrowLeft size={20} />
              </button>
              <span className="min-w-0 flex-1">
                <strong className="block text-lg font-black leading-tight">
                  {title}
                </strong>
                <small className="mt-0.5 block text-[11px] font-medium text-white/40">
                  {detail}
                </small>
              </span>
            </header>

            <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
              {names.map((name, index) => {
                const { text, color } = badge(index);
                return (
                  <label
                    key={index}
                    className="flex items-center gap-3 rounded-2xl p-3"
                    style={{
                      border: `1px solid ${color}55`,
                      background: "rgba(255,255,255,.035)",
                    }}
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                      style={{ background: color }}
                    >
                      {text}
                    </span>
                    <input
                      value={name}
                      onChange={event => changeName(index, event.target.value)}
                      placeholder={placeholderFor?.(index)}
                      maxLength={maxLength}
                      className="min-w-0 flex-1 border-0 bg-transparent text-base font-black text-white outline-none placeholder:font-bold placeholder:text-white/25"
                    />
                    {canRemove && (
                      <button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        aria-label={`Odstrániť ${name || `${index + 1}.`}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-lg text-white/40 transition active:scale-90"
                      >
                        ×
                      </button>
                    )}
                  </label>
                );
              })}

              {canAdd && (
                <button
                  type="button"
                  onClick={addParticipant}
                  className="w-full rounded-2xl border border-dashed border-white/15 bg-white/[0.03] py-3 text-sm font-black text-white/55 transition active:scale-95"
                >
                  + Pridať {isTeams ? "tím" : "hráča"}
                </button>
              )}

              {!canRemove && !fixedCount && (
                <p className="px-1 pt-1 text-[11px] font-medium text-white/35">
                  Minimálny počet {isTeams ? "tímov" : "hráčov"} je {min}.
                </p>
              )}
            </div>

            <div className="shrink-0 border-t border-white/[0.07] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-2xl py-4 text-sm font-black uppercase tracking-wider transition active:scale-[.98]"
                style={{ background: accent, color: "#08111a" }}
              >
                Hotovo
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
