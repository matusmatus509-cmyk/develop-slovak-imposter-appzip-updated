import { useMemo, useState } from "react";
import { DEFAULT_COLLECTION_ID, normalizeWorkshopCollections, normalizeWorkshopEntries } from "../../data/partyContent";
import type { WorkshopCollection, WorkshopEntry, WorkshopEntryKind } from "../../types";

const KINDS: Array<[Exclude<WorkshopEntryKind, "word">, string]> = [
  ["truth", "Pravda"], ["dare", "Výzva"], ["never", "Nikdy som nikdy"], ["wouldRather", "Radšej by som"],
  ["emoji", "Emoji"], ["quiz", "Kvíz"], ["person", "Osoba"], ["charade", "Šaráda"],
];
const ANSWER_KINDS = new Set<WorkshopEntryKind>(["wouldRather", "emoji", "quiz"]);
const COLORS = ["#34d399", "#22d3ee", "#a78bfa", "#fb7185", "#fbbf24", "#60a5fa"];

export default function PartyCollections({ collections, entries, onCollectionsChange, onEntriesChange }: {
  collections: WorkshopCollection[];
  entries: WorkshopEntry[];
  onCollectionsChange: (collections: WorkshopCollection[]) => void;
  onEntriesChange: (entries: WorkshopEntry[]) => void;
}) {
  const [collectionName, setCollectionName] = useState("");
  const [kind, setKind] = useState<Exclude<WorkshopEntryKind, "word">>("truth");
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([DEFAULT_COLLECTION_ID]);
  const [filterCollection, setFilterCollection] = useState("all");
  const [filterKind, setFilterKind] = useState<WorkshopEntryKind | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const requiresAnswer = ANSWER_KINDS.has(kind);
  const filtered = useMemo(() => entries.filter((entry) => (filterCollection === "all" || entry.collectionIds.includes(filterCollection)) && (filterKind === "all" || entry.kind === filterKind)), [entries, filterCollection, filterKind]);

  function createCollection() {
    const name = collectionName.trim().slice(0, 40);
    if (!name) return;
    const id = `collection-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    onCollectionsChange(normalizeWorkshopCollections([...collections, { id, name, icon: "🎴", color: COLORS[collections.length % COLORS.length], createdAt: Date.now() }]));
    setCollectionName("");
  }

  function renameCollection(collection: WorkshopCollection) {
    const nextName = window.prompt("Nový názov kolekcie", collection.name)?.trim().slice(0, 40);
    if (!nextName || nextName === collection.name) return;
    onCollectionsChange(collections.map((item) => item.id === collection.id ? { ...item, name: nextName } : item));
  }

  function deleteCollection(collection: WorkshopCollection) {
    if (collection.id === DEFAULT_COLLECTION_ID) return;
    if (!window.confirm(`Vymazať kolekciu „${collection.name}“? Kartičky sa presunú do predvolenej kolekcie.`)) return;
    const nextCollections = collections.filter((item) => item.id !== collection.id);
    const nextEntries = entries.map((entry) => {
      if (!entry.collectionIds.includes(collection.id)) return entry;
      const remaining = entry.collectionIds.filter((id) => id !== collection.id);
      return { ...entry, collectionIds: remaining.length ? remaining : [DEFAULT_COLLECTION_ID] };
    });
    onCollectionsChange(nextCollections);
    onEntriesChange(nextEntries);
    setSelectedCollectionIds((current) => {
      const remaining = current.filter((id) => id !== collection.id);
      return remaining.length ? remaining : [DEFAULT_COLLECTION_ID];
    });
    if (filterCollection === collection.id) setFilterCollection("all");
  }

  function toggleSelectedCollection(id: string) {
    setSelectedCollectionIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function saveEntry() {
    const cleanText = text.trim().slice(0, 240);
    const cleanAnswer = answer.trim().slice(0, 160);
    if (!cleanText || (requiresAnswer && !cleanAnswer) || selectedCollectionIds.length === 0) return;
    if (editingId) {
      onEntriesChange(normalizeWorkshopEntries(entries.map((entry) => entry.id === editingId ? { ...entry, kind, text: cleanText, answer: cleanAnswer || undefined, collectionIds: selectedCollectionIds } : entry), collections));
    } else {
      const entry: WorkshopEntry = { id: `card-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, kind, text: cleanText, answer: cleanAnswer || undefined, collectionIds: selectedCollectionIds, enabled: true, likes: 0, rating: 0, ratingCount: 0, createdAt: Date.now() };
      onEntriesChange(normalizeWorkshopEntries([entry, ...entries], collections));
    }
    setText(""); setAnswer(""); setEditingId(null);
  }

  function editEntry(entry: WorkshopEntry) {
    setEditingId(entry.id); setKind(entry.kind === "word" ? "charade" : entry.kind); setText(entry.text); setAnswer(entry.answer ?? ""); setSelectedCollectionIds(entry.collectionIds); document.getElementById("collection-editor")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="collections" className="premium-card p-4">
      <div className="premium-section-heading"><div><p className="premium-eyebrow text-emerald-300/75">Obsah iba v zariadení</p><h2>Vlastné kolekcie</h2></div><span className="premium-icon">🎴</span></div>
      <p className="mt-2 text-[10px] leading-relaxed text-white/42">Kartičky nie sú verejné ani synchronizované. Zostávajú v lokálnom úložisku tohto prehliadača.</p>

      <div className="mt-4 flex gap-2"><input value={collectionName} onChange={(event) => setCollectionName(event.target.value)} maxLength={40} placeholder="Názov novej kolekcie" className="premium-input min-w-0 flex-1" /><button type="button" disabled={!collectionName.trim()} onClick={createCollection} className="rounded-xl bg-emerald-300 px-3 text-[10px] font-black text-emerald-950 disabled:opacity-35">Vytvoriť</button></div>
      <div className="mt-3 space-y-2">{collections.map((collection) => {
        const count = entries.filter((entry) => entry.collectionIds.includes(collection.id)).length;
        return <article key={collection.id} className="flex items-center gap-3 rounded-xl border border-white/[.08] bg-white/[.035] p-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${collection.color}22`, color: collection.color }}>{collection.icon}</span><div className="min-w-0 flex-1"><strong className="block truncate text-xs">{collection.name}</strong><small className="text-[9px] text-white/35">{count} kariet</small></div><button type="button" onClick={() => renameCollection(collection)} className="text-[9px] font-black text-white/45">Premenovať</button>{collection.id !== DEFAULT_COLLECTION_ID && <button type="button" onClick={() => deleteCollection(collection)} className="text-[9px] font-black text-rose-300/65">Vymazať</button>}</article>;
      })}</div>

      <div id="collection-editor" className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
        <div className="flex flex-wrap gap-1.5">{KINDS.map(([value, label]) => <button key={value} type="button" aria-pressed={kind === value} onClick={() => setKind(value)} className={`rounded-lg px-2.5 py-2 text-[9px] font-black ${kind === value ? "bg-emerald-300 text-emerald-950" : "bg-white/[.06] text-white/45"}`}>{label}</button>)}</div>
        <label className="mt-3 block"><span className="premium-field-label">{kind === "emoji" ? "Emoji nápoveda" : kind === "wouldRather" ? "Možnosť A" : "Text kartičky"}</span><textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={240} rows={3} className="premium-input resize-none" placeholder="Napíšte vlastný obsah" /></label>
        {requiresAnswer && <label className="mt-2 block"><span className="premium-field-label">{kind === "wouldRather" ? "Možnosť B" : "Správna odpoveď"}</span><input value={answer} onChange={(event) => setAnswer(event.target.value)} maxLength={160} className="premium-input" /></label>}
        <fieldset className="mt-3"><legend className="premium-field-label">Kolekcie (jedna alebo viac)</legend><div className="flex flex-wrap gap-2">{collections.map((collection) => <button key={collection.id} type="button" aria-pressed={selectedCollectionIds.includes(collection.id)} onClick={() => toggleSelectedCollection(collection.id)} className={`rounded-xl border px-3 py-2 text-[9px] font-black ${selectedCollectionIds.includes(collection.id) ? "border-emerald-300/40 bg-emerald-300 text-emerald-950" : "border-white/10 bg-white/[.04] text-white/45"}`}>{collection.icon} {collection.name}</button>)}</div></fieldset>
        <button type="button" disabled={!text.trim() || (requiresAnswer && !answer.trim()) || selectedCollectionIds.length === 0} onClick={saveEntry} className="mt-3 w-full rounded-xl bg-emerald-300 py-3 text-xs font-black text-emerald-950 disabled:opacity-35">{editingId ? "Uložiť zmeny" : "Pridať kartičku"}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setText(""); setAnswer(""); }} className="mt-1 w-full py-2 text-[9px] font-black text-white/40">Zrušiť úpravu</button>}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2"><select value={filterCollection} onChange={(event) => setFilterCollection(event.target.value)} className="premium-input"><option value="all">Všetky kolekcie</option>{collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}</select><select value={filterKind} onChange={(event) => setFilterKind(event.target.value as WorkshopEntryKind | "all")} className="premium-input"><option value="all">Všetky typy</option>{KINDS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      <p className="mt-2 text-[9px] font-bold text-white/35">Zobrazené {filtered.length} z {entries.length}</p>
      <div className="mt-2 space-y-2">{filtered.length === 0 ? <p className="rounded-xl border border-dashed border-white/10 p-5 text-center text-xs text-white/30">Tomuto filtru nezodpovedá žiadna kartička.</p> : filtered.map((entry) => <article key={entry.id} className="rounded-xl border border-white/[.08] bg-white/[.035] p-3"><div className="flex items-center gap-2"><span className="text-[8px] font-black uppercase tracking-wider text-emerald-300">{KINDS.find(([value]) => value === entry.kind)?.[1] ?? "Šaráda"}</span><span className={`rounded-full px-2 py-0.5 text-[7px] font-black ${entry.enabled ? "bg-emerald-400/10 text-emerald-300" : "bg-white/[.06] text-white/30"}`}>{entry.enabled ? "Zapnutá" : "Vypnutá"}</span><span className="ml-auto text-[8px] text-white/30">{entry.collectionIds.length} kolekcie</span></div><p className="mt-2 text-xs leading-relaxed text-white/70">{entry.text}</p>{entry.answer && <p className="mt-1 text-[9px] text-white/38">Odpoveď / možnosť B: {entry.answer}</p>}<div className="mt-3 flex gap-2"><button type="button" onClick={() => onEntriesChange(entries.map((item) => item.id === entry.id ? { ...item, enabled: !item.enabled } : item))} className="rounded-lg bg-white/[.06] px-2.5 py-1.5 text-[9px] font-black text-white/50">{entry.enabled ? "Vypnúť" : "Zapnúť"}</button><button type="button" onClick={() => editEntry(entry)} className="rounded-lg bg-white/[.06] px-2.5 py-1.5 text-[9px] font-black text-white/50">Upraviť</button><button type="button" onClick={() => window.confirm("Vymazať túto kartičku?") && onEntriesChange(entries.filter((item) => item.id !== entry.id))} className="ml-auto text-[9px] font-black text-rose-300/65">Vymazať</button></div></article>)}</div>
    </section>
  );
}
