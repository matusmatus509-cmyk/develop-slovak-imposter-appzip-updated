import type { WorkshopCollection, WorkshopSelection } from "../types";

export interface CustomContentControls {
  collections: WorkshopCollection[];
  selection: WorkshopSelection;
  countsByCollection: Record<string, number>;
  compatibleEntryCollectionIds: string[][];
  onChange: (selection: WorkshopSelection) => void;
}

export default function CustomContentSelector({ controls, compact = false }: { controls: CustomContentControls; compact?: boolean }) {
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
    <section className={`custom-content-panel rounded-2xl border border-emerald-300/15 bg-emerald-400/[.055] ${compact ? "p-3" : "p-4"}`} aria-label="Vlastný obsah">
      <button
        type="button"
        onClick={() => onChange({ ...selection, enabled: !selection.enabled })}
        disabled={availableCount === 0}
        aria-pressed={selection.enabled}
        className="flex w-full items-center gap-3 text-left disabled:opacity-50"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-300/12 text-lg">✨</span>
        <span className="min-w-0 flex-1">
          <strong className="block text-xs font-black text-white">Vlastné kartičky</strong>
          <small className="mt-0.5 block text-[10px] text-white/45">
            {availableCount ? `${selectedCount} z ${availableCount} kompatibilných` : "Najprv vytvorte kartičky v Party Hube"}
          </small>
        </span>
        <span aria-hidden="true" className={`relative h-7 w-12 shrink-0 rounded-full transition ${selection.enabled ? "bg-emerald-400" : "bg-white/15"}`}>
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
                className={`rounded-xl border px-3 py-2 text-[10px] font-black transition disabled:opacity-30 ${active ? "border-emerald-300/45 bg-emerald-300 text-emerald-950" : "border-white/10 bg-white/[.05] text-white/55"}`}
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
