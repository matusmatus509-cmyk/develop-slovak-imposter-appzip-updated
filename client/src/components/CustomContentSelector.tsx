import type { WorkshopCollection, WorkshopSelection } from "../types";
import { Icons } from "./icons";

export interface CustomContentControls {
  collections: WorkshopCollection[];
  selection: WorkshopSelection;
  countsByCollection: Record<string, number>;
  compatibleEntryCollectionIds: string[][];
  onChange: (selection: WorkshopSelection) => void;
}

/**
 * Farba panela. Predvolená je smaragdová, na akú sú zvyknuté obrazovky
 * jednotlivých hier; Party mode si posiela svoj vlastný akcent, aby na jeho
 * nastavení nesvietila jediná cudzia farba.
 */
const DEFAULT_ACCENT = "#34d399";

export default function CustomContentSelector({
  controls,
  compact = false,
  accent = DEFAULT_ACCENT,
}: {
  controls: CustomContentControls;
  compact?: boolean;
  accent?: string;
}) {
  const { collections, selection, countsByCollection, compatibleEntryCollectionIds, onChange } = controls;
  const availableCount = compatibleEntryCollectionIds.length;
  const selectedIds = new Set(selection.collectionIds);
  const selectedCount = compatibleEntryCollectionIds.filter((collectionIds) => collectionIds.some((id) => selectedIds.has(id))).length;

  function toggleCollection(id: string) {
    const exists = selection.collectionIds.includes(id);
    const collectionIds = exists
      ? selection.collectionIds.filter((current) => current !== id)
      : [...selection.collectionIds, id];
    onChange({ ...selection, collectionIds });
  }

  return (
    <section
      className={`custom-content-panel rounded-2xl border ${compact ? "p-3" : "p-4"}`}
      style={{ borderColor: `${accent}26`, background: `${accent}0e` }}
      aria-label="Vlastný obsah"
    >
      <button
        type="button"
        onClick={() => onChange({ ...selection, enabled: !selection.enabled })}
        disabled={availableCount === 0}
        aria-pressed={selection.enabled}
        className="flex w-full items-center gap-3 text-left disabled:opacity-50"
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl border"
          style={{ borderColor: `${accent}29`, background: `${accent}1f`, color: accent }}
        >
          <Icons.sparkles size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <strong className="block text-xs font-black text-white">Vlastné kartičky</strong>
          <small className="mt-0.5 block text-[10px] text-white/45">
            {availableCount ? `${selectedCount} z ${availableCount} kompatibilných` : "Najprv vytvorte kartičky v Party Hube"}
          </small>
        </span>
        <span
          aria-hidden="true"
          className="relative h-7 w-12 shrink-0 rounded-full transition"
          style={{ background: selection.enabled ? accent : "rgba(255,255,255,.15)" }}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${selection.enabled ? "translate-x-6" : "translate-x-1"}`} />
        </span>
      </button>
      {selection.enabled && availableCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Vybrané kolekcie">
          {collections.map((collection) => {
            const count = countsByCollection[collection.id] ?? 0;
            const active = selection.collectionIds.includes(collection.id);
            return (
              <button
                key={collection.id}
                type="button"
                disabled={count === 0}
                aria-pressed={active}
                onClick={() => toggleCollection(collection.id)}
                className={`rounded-xl border px-3 py-2 text-[10px] font-black transition disabled:opacity-30 ${active ? "" : "border-white/10 bg-white/[.05] text-white/55"}`}
                style={
                  active
                    ? { borderColor: `${accent}73`, background: accent, color: "#0d1117" }
                    : undefined
                }
              >
                {collection.icon} {collection.name} · {count}
              </button>
            );
          })}
        </div>
      )}
      {selection.enabled && selectedCount === 0 && availableCount > 0 && <p className="mt-2 text-[10px] font-semibold text-amber-200/70">Vyberte aspoň jednu kolekciu.</p>}
    </section>
  );
}
