import { useState } from "react";
import { Icons } from "./icons";

/**
 * ── Zadávanie hráčov / tímov ────────────────────────────────────────────────
 *
 * Jediné miesto v aplikácii, kde sa zadávajú mená účastníkov. Predtým bol tento
 * blok skopírovaný v siedmich obrazovkách v troch rôznych vizuálnych podobách —
 * niekde vždy rozbalený zoznam, inde mriežka počtu hráčov nad fixným poľom
 * ôsmich mien, inde dokonca samostatná pod-obrazovka.
 *
 * Vzorom je podoba z hudobných minihier: zbalené sa ukáže len počet účastníkov,
 * mená sa upravujú až po rozkliknutí. Nastavenia tak zostanú prehľadné aj pri
 * ôsmich hráčoch a všetky hry sa ovládajú rovnako.
 *
 * Zámerne nedrží mená vo vlastnom stave — obrazovky ich potrebujú aj pri štarte
 * hry a niektoré z nich na počet hráčov reagujú (napr. maximálny počet
 * podvodníkov). Komponent si drží iba to, čo nikoho zvonka nezaujíma: či je
 * panel otvorený.
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
  /** Farba obrazovky — odznak, ikona aj „Upraviť“ ju preberajú. */
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
    entity === "teams"
      ? ["tím", "tímy", "tímov"]
      : ["hráč", "hráči", "hráčov"];
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
  const listLabel = isTeams ? "Názvy tímov" : "Mená hráčov";
  const detail =
    summary ??
    (fixedCount
      ? pluralize(names.length, entity)
      : `${pluralize(names.length, entity)} · ${min} až ${max} ${isTeams ? "tímov" : "hráčov"}`);

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

  function defaultBadge(index: number): ParticipantBadge {
    return {
      text: isTeams ? String.fromCharCode(65 + index) : String(index + 1),
      color: PLAYER_BADGE_COLORS[index % PLAYER_BADGE_COLORS.length],
    };
  }

  return (
    <section className={`party-glass overflow-hidden rounded-[1.55rem] ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-4 text-left transition active:scale-[.99]"
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
          className="flex shrink-0 items-center gap-2 text-[10px] font-black uppercase tracking-wider"
          style={{ color: accent }}
        >
          Upraviť{" "}
          <Icons.chevronRight
            size={16}
            className={open ? "rotate-90 transition-transform" : "transition-transform"}
          />
        </span>
      </button>

      {open && (
        <div className="space-y-2 border-t border-white/[0.08] px-4 pb-4 pt-3">
          <p className="px-1 pb-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
            {listLabel}
          </p>
          {names.map((name, index) => {
            const badge = badgeFor?.(index) ?? defaultBadge(index);
            return (
              <label
                key={index}
                className="party-glass flex items-center gap-3 rounded-2xl p-3"
                style={{ borderColor: `${badge.color}55` }}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                  style={{ background: badge.color }}
                >
                  {badge.text}
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
              className="party-glass w-full rounded-2xl py-3 text-sm font-black text-white/60 transition active:scale-95"
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
      )}
    </section>
  );
}
