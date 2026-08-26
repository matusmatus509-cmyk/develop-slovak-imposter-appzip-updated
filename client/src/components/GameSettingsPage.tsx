import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon, type IconsType } from "./icons";

/**
 * ── Nastavenia hry na samostatnej stránke ───────────────────────────────────
 *
 * Zovšeobecnenie vzoru z `PlayerNamesField.tsx` na akýkoľvek obsah nastavení
 * (časovač, obtiažnosť, prepínače pravidiel...), nie len na mená hráčov.
 *
 * V setupe zostane len súhrn-tlačidlo s aktuálnymi hodnotami. Kliknutie
 * otvorí samostatnú stránku s obsahom prevzatým cez `children`, šípka späť
 * sa vráti do nastavení hry. Setup tak zostane krátky bez ohľadu na to,
 * koľko volieb má hra navyše.
 *
 * Stránka je portál do `document.body`, mimo DOM stromu obrazovky — presne
 * ako pri hráčoch. Viaceré obrazovky majú vlastné vrstvy CSS
 * (`.mobile-settings`, `.guess-who-*`...), ktoré cez `!important` prepisujú
 * pozadie a padding vnorených sekcií. Portálom sa tomu obsah nastavení vyhne
 * a vyzerá rovnako v každej hre.
 */

export interface GameSettingsPageProps {
  /** Farba obrazovky — ikona, súhrn button aj tlačidlo Hotovo ju preberajú. */
  accent: string;
  icon: keyof IconsType;
  title: string;
  /** Súhrn aktuálnych hodnôt, napr. „60s na kolo · 3 preskočení“. */
  summary: string;
  /** Krátky popis pod titulkom na stránke nastavení. */
  description?: string;
  /** Obsah stránky — bloky nastavení (timer, obtiažnosť, prepínače...). */
  children: ReactNode;
  className?: string;
}

export default function GameSettingsPage({
  accent,
  icon,
  title,
  summary,
  description,
  children,
  className = "",
}: GameSettingsPageProps) {
  const [open, setOpen] = useState(false);

  // Kým je stránka otvorená, pozadie sa nesmie skrolovať — inak sa obrazovka
  // pod ňou posúva pod prstom pri ovládaní volieb.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      {/* Zámerne `button`, nie `section`: obrazovky s `.mobile-settings`
          prepisujú priamym potomkom `section` pozadie aj padding cez
          `!important`. */}
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
          <Icon name={icon} size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <strong className="block text-sm font-black text-white">{title}</strong>
          <small className="mt-0.5 block truncate text-[11px] font-medium text-white/45">
            {summary}
          </small>
        </span>
        <span
          className="flex shrink-0 items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
          style={{ color: accent }}
        >
          Upraviť <Icon name="chevronRight" size={16} />
        </span>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[300] flex flex-col bg-[#080b10] text-white"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <header className="flex shrink-0 items-center gap-3 border-b border-white/[0.07] px-4 pb-3 pt-[max(.85rem,env(safe-area-inset-top))]">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Späť na nastavenia"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/75 transition active:scale-90"
              >
                <Icon name="arrowLeft" size={20} />
              </button>
              <span className="min-w-0 flex-1">
                <strong className="block text-lg font-black leading-tight">{title}</strong>
                {description && (
                  <small className="mt-0.5 block text-[11px] font-medium text-white/40">
                    {description}
                  </small>
                )}
              </span>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">{children}</div>

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
