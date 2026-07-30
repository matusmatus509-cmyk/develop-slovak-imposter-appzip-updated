import { useMemo, useState } from "react";
import PackShareDialog from "../../components/PackShareDialog";
import { DEFAULT_COLLECTION_ID, SEASONAL_PARTY_PACKS, getWorkshopEntryValidationError, normalizeWorkshopCollections, normalizeWorkshopEntries, type SeasonalPartyPack } from "../../data/partyContent";
import { PartyPackError, installPartyPack, type DecodedPartyPack } from "../../data/partyPackSharing";
import type { WorkshopCollection, WorkshopEntry, WorkshopEntryKind } from "../../types";

const KINDS: Array<[Exclude<WorkshopEntryKind, "word">, string]> = [
  ["truth", "Pravda"], ["dare", "Výzva"], ["never", "Nikdy som nikdy"], ["wouldRather", "Radšej by som"],
  ["emoji", "Emoji"], ["quiz", "Kvíz"], ["person", "Osoba"], ["charade", "Šaráda"],
];
const ANSWER_KINDS = new Set<WorkshopEntryKind>(["wouldRather", "emoji", "quiz"]);
const KIND_GUIDANCE: Record<Exclude<WorkshopEntryKind, "word">, string> = {
  truth: "Napíšte jednu prirodzenú otázku zakončenú otáznikom.",
  dare: "Napíšte jasnú a bezpečnú výzvu v celej vete.",
  never: "Začnite presne slovami „Nikdy som nikdy“ a pokračujte prirodzenou vetou.",
  wouldRather: "Napíšte dve odlišné a porovnateľné možnosti A a B.",
  emoji: "Použite emoji ako nápovedu a do odpovede napíšte jednoznačné riešenie.",
  quiz: "Napíšte otázku zakončenú otáznikom a jej správnu odpoveď.",
  person: "Použite stručný názov osoby alebo postavy, nie celú vetu.",
  charade: "Použite 1 až 3 bežné slová bez dvojbodky, napríklad „Umývanie riadu“.",
};
const COLORS = ["#34d399", "#22d3ee", "#a78bfa", "#fb7185", "#fbbf24", "#60a5fa"];

function seasonalCollectionId(packId: string) {
  return `seasonal-${packId}`;
}

function isSeasonalPackInstalled(pack: SeasonalPartyPack, collections: WorkshopCollection[], entries: WorkshopEntry[]) {
  if (collections.some((collection) => collection.id === seasonalCollectionId(pack.id))) return true;
  return collections.some((collection) => collection.name === pack.name && collection.icon === pack.icon && collection.color.toLowerCase() === pack.color.toLowerCase()
    && pack.entries.every((template) => entries.some((entry) => entry.collectionIds.includes(collection.id)
      && (entry.kind === "word" ? "charade" : entry.kind) === template.kind
      && entry.text === template.text
      && (entry.answer ?? "") === (template.answer ?? ""))));
}

export default function PartyCollections({ collections, entries, autoImportNotice, onCollectionsChange, onEntriesChange }: {
  collections: WorkshopCollection[];
  entries: WorkshopEntry[];
  autoImportNotice?: { kind: "success" | "pending" | "error"; message: string } | null;
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
  const [shareCollection, setShareCollection] = useState<WorkshopCollection | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [packNotice, setPackNotice] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const requiresAnswer = ANSWER_KINDS.has(kind);
  const entryValidationError = getWorkshopEntryValidationError(kind, text, requiresAnswer ? answer : "");
  const filtered = useMemo(() => entries.filter((entry) => (filterCollection === "all" || entry.collectionIds.includes(filterCollection)) && (filterKind === "all" || entry.kind === filterKind)), [entries, filterCollection, filterKind]);
  const installedSeasonalIds = useMemo(() => new Set(SEASONAL_PARTY_PACKS
    .filter((pack) => isSeasonalPackInstalled(pack, collections, entries))
    .map((pack) => pack.id)), [collections, entries]);

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
    const cleanText = text.trim().replace(/\s+/g, " ").slice(0, kind === "charade" ? 80 : 240);
    const cleanAnswer = requiresAnswer ? answer.trim().slice(0, 160) : "";
    if (!cleanText || selectedCollectionIds.length === 0) return;
    const validationError = getWorkshopEntryValidationError(kind, cleanText, cleanAnswer);
    if (validationError) return;
    if (editingId) {
      onEntriesChange(normalizeWorkshopEntries(entries.map((entry) => entry.id === editingId ? { ...entry, kind, text: cleanText, answer: cleanAnswer || undefined, collectionIds: selectedCollectionIds, enabled: getWorkshopEntryValidationError(entry.kind, entry.text, entry.answer) ? true : entry.enabled } : entry), collections));
    } else {
      const entry: WorkshopEntry = { id: `card-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, kind, text: cleanText, answer: cleanAnswer || undefined, collectionIds: selectedCollectionIds, enabled: true, likes: 0, rating: 0, ratingCount: 0, createdAt: Date.now() };
      onEntriesChange(normalizeWorkshopEntries([entry, ...entries], collections));
    }
    setText(""); setAnswer(""); setEditingId(null);
  }

  function editEntry(entry: WorkshopEntry) {
    setEditingId(entry.id); setKind(entry.kind === "word" ? "charade" : entry.kind); setText(entry.text); setAnswer(entry.answer ?? ""); setSelectedCollectionIds(entry.collectionIds); document.getElementById("collection-editor")?.scrollIntoView({ behavior: "smooth" });
  }

  function importPack(pack: DecodedPartyPack, collectionId?: string) {
    const installed = installPartyPack(pack, collections, entries, { collectionId });
    onCollectionsChange(installed.collections);
    onEntriesChange(installed.entries);
    const message = `Balík „${installed.collection.name}“ bol pridaný ako nová kolekcia (${installed.entryCount} kariet).`;
    setPackNotice({ kind: "success", message });
    return message;
  }

  function installSeasonalPack(pack: SeasonalPartyPack) {
    if (installedSeasonalIds.has(pack.id)) return;
    try {
      importPack({ version: 1, name: pack.name, icon: pack.icon, color: pack.color, entries: pack.entries }, seasonalCollectionId(pack.id));
    } catch (reason) {
      setPackNotice({ kind: "error", message: reason instanceof PartyPackError || reason instanceof Error ? reason.message : "Balík sa nepodarilo nainštalovať." });
    }
  }

  return (
    <>
    <section id="collections" className="premium-card p-4">
      <div className="premium-section-heading"><div><p className="premium-eyebrow text-emerald-300/75">Obsah iba v zariadení</p><h2>Vlastné kolekcie</h2></div><span className="premium-icon">🎴</span></div>
      <p className="mt-2 text-[10px] leading-relaxed text-white/42">Kartičky nie sú verejné ani synchronizované. Zostávajú v lokálnom úložisku tohto prehliadača.</p>
      {autoImportNotice && <p role={autoImportNotice.kind === "error" ? "alert" : "status"} className={`mt-3 rounded-xl p-3 text-[10px] font-bold ${autoImportNotice.kind === "error" ? "bg-rose-400/10 text-rose-200" : autoImportNotice.kind === "pending" ? "bg-amber-400/10 text-amber-200" : "bg-emerald-400/10 text-emerald-200"}`}>{autoImportNotice.message}</p>}
      {packNotice && <p role={packNotice.kind === "error" ? "alert" : "status"} className={`mt-3 rounded-xl p-3 text-[10px] font-bold ${packNotice.kind === "error" ? "bg-rose-400/10 text-rose-200" : "bg-emerald-400/10 text-emerald-200"}`}>{packNotice.message}</p>}

      <div className="mt-4 rounded-2xl border border-violet-300/15 bg-violet-400/[.06] p-3">
        <div className="flex items-center justify-between gap-3"><div><p className="premium-eyebrow text-violet-300/75">Hotové lokálne balíky</p><h3 className="mt-1 text-sm font-black">Sezónne kolekcie</h3></div><button type="button" onClick={() => setImportOpen(true)} className="rounded-xl border border-white/10 bg-white/[.07] px-3 py-2 text-[9px] font-black">Importovať PP1</button></div>
        <div className="mt-3 grid grid-cols-2 gap-2">{SEASONAL_PARTY_PACKS.map((pack) => {
          const installed = installedSeasonalIds.has(pack.id);
          return <article key={pack.id} className="rounded-xl border border-white/[.08] bg-black/15 p-3"><div className="flex items-center gap-2"><span className="text-xl">{pack.icon}</span><strong className="text-[10px] leading-tight">{pack.name}</strong></div><p className="mt-2 min-h-9 text-[8px] leading-relaxed text-white/38">{pack.description}</p><p className="mt-1 text-[8px] font-bold text-white/30">{pack.entries.length} kariet · viac hier</p><button type="button" disabled={installed} onClick={() => installSeasonalPack(pack)} className="mt-2 w-full rounded-lg bg-violet-300 py-2 text-[9px] font-black text-violet-950 disabled:bg-emerald-300/20 disabled:text-emerald-200">{installed ? "Nainštalované ✓" : "Nainštalovať"}</button></article>;
        })}</div>
      </div>

      <div className="mt-4 flex gap-2"><input value={collectionName} onChange={(event) => setCollectionName(event.target.value)} maxLength={40} placeholder="Názov novej kolekcie" className="premium-input min-w-0 flex-1" /><button type="button" disabled={!collectionName.trim()} onClick={createCollection} className="rounded-xl bg-emerald-300 px-3 text-[10px] font-black text-emerald-950 disabled:opacity-35">Vytvoriť</button></div>
      <div className="mt-3 space-y-2">{collections.map((collection) => {
        const count = entries.filter((entry) => entry.collectionIds.includes(collection.id)).length;
        return <article key={collection.id} className="flex items-center gap-3 rounded-xl border border-white/[.08] bg-white/[.035] p-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${collection.color}22`, color: collection.color }}>{collection.icon}</span><div className="min-w-0 flex-1"><strong className="block truncate text-xs">{collection.name}</strong><small className="text-[9px] text-white/35">{count} kariet</small></div><button type="button" disabled={count === 0} onClick={() => setShareCollection(collection)} className="text-[9px] font-black text-emerald-300/70 disabled:text-white/20">Zdieľať</button><button type="button" onClick={() => renameCollection(collection)} className="text-[9px] font-black text-white/45">Premenovať</button>{collection.id !== DEFAULT_COLLECTION_ID && <button type="button" onClick={() => deleteCollection(collection)} className="text-[9px] font-black text-rose-300/65">Vymazať</button>}</article>;
      })}</div>

      <div id="collection-editor" className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
        <div><p className="premium-eyebrow text-emerald-300/70">Jedna karta naraz</p><h3 className="mt-1 text-sm font-black">Rýchly editor otázky alebo slova</h3><p className="mt-1 text-[9px] leading-relaxed text-white/38">Vyberte typ, napíšte jednu otázku, výzvu alebo slovo a uložte ho do kolekcie.</p></div>
        <div className="mt-3 flex flex-wrap gap-1.5">{KINDS.map(([value, label]) => <button key={value} type="button" aria-pressed={kind === value} onClick={() => { setKind(value); if (!ANSWER_KINDS.has(value)) setAnswer(""); }} className={`rounded-lg px-2.5 py-2 text-[9px] font-black ${kind === value ? "bg-emerald-300 text-emerald-950" : "bg-white/[.06] text-white/45"}`}>{label}</button>)}</div>
        <label className="mt-3 block"><span className="premium-field-label">{kind === "emoji" ? "Emoji nápoveda" : kind === "wouldRather" ? "Možnosť A" : kind === "charade" ? "Šaráda (max. 3 slová)" : "Text kartičky"}</span><textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={kind === "charade" ? 80 : 240} rows={3} className="premium-input resize-none" placeholder={kind === "charade" ? "Napríklad: Umývanie riadu" : "Napíšte vlastný obsah"} /></label>
        <p className="mt-1 text-[9px] leading-relaxed text-white/38">{KIND_GUIDANCE[kind]}</p>
        {entryValidationError && text.trim() && <p role="alert" className="mt-2 text-[10px] font-bold text-amber-200">{entryValidationError}</p>}
        {requiresAnswer && <label className="mt-2 block"><span className="premium-field-label">{kind === "wouldRather" ? "Možnosť B" : "Správna odpoveď"}</span><input value={answer} onChange={(event) => setAnswer(event.target.value)} maxLength={160} className="premium-input" /></label>}
        <fieldset className="mt-3"><legend className="premium-field-label">Kolekcie (jedna alebo viac)</legend><div className="flex flex-wrap gap-2">{collections.map((collection) => <button key={collection.id} type="button" aria-pressed={selectedCollectionIds.includes(collection.id)} onClick={() => toggleSelectedCollection(collection.id)} className={`rounded-xl border px-3 py-2 text-[9px] font-black ${selectedCollectionIds.includes(collection.id) ? "border-emerald-300/40 bg-emerald-300 text-emerald-950" : "border-white/10 bg-white/[.04] text-white/45"}`}>{collection.icon} {collection.name}</button>)}</div></fieldset>
        <button type="button" disabled={!text.trim() || Boolean(entryValidationError) || selectedCollectionIds.length === 0} onClick={saveEntry} className="mt-3 w-full rounded-xl bg-emerald-300 py-3 text-xs font-black text-emerald-950 disabled:opacity-35">{editingId ? "Uložiť zmeny" : "Pridať kartičku"}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setText(""); setAnswer(""); }} className="mt-1 w-full py-2 text-[9px] font-black text-white/40">Zrušiť úpravu</button>}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2"><select value={filterCollection} onChange={(event) => setFilterCollection(event.target.value)} className="premium-input"><option value="all">Všetky kolekcie</option>{collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}</select><select value={filterKind} onChange={(event) => setFilterKind(event.target.value as WorkshopEntryKind | "all")} className="premium-input"><option value="all">Všetky typy</option>{KINDS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      <p className="mt-2 text-[9px] font-bold text-white/35">Zobrazené {filtered.length} z {entries.length}</p>
      <div className="mt-2 space-y-2">{filtered.length === 0 ? <p className="rounded-xl border border-dashed border-white/10 p-5 text-center text-xs text-white/30">Tomuto filtru nezodpovedá žiadna kartička.</p> : filtered.map((entry) => <article key={entry.id} className="rounded-xl border border-white/[.08] bg-white/[.035] p-3"><div className="flex items-center gap-2"><span className="text-[8px] font-black uppercase tracking-wider text-emerald-300">{KINDS.find(([value]) => value === entry.kind)?.[1] ?? "Šaráda"}</span><span className={`rounded-full px-2 py-0.5 text-[7px] font-black ${entry.enabled ? "bg-emerald-400/10 text-emerald-300" : "bg-white/[.06] text-white/30"}`}>{entry.enabled ? "Zapnutá" : "Vypnutá"}</span><span className="ml-auto text-[8px] text-white/30">{entry.collectionIds.length} kolekcie</span></div><p className="mt-2 text-xs leading-relaxed text-white/70">{entry.text}</p>{entry.answer && <p className="mt-1 text-[9px] text-white/38">Odpoveď / možnosť B: {entry.answer}</p>}<div className="mt-3 flex gap-2"><button type="button" onClick={() => onEntriesChange(entries.map((item) => item.id === entry.id ? { ...item, enabled: !item.enabled } : item))} className="rounded-lg bg-white/[.06] px-2.5 py-1.5 text-[9px] font-black text-white/50">{entry.enabled ? "Vypnúť" : "Zapnúť"}</button><button type="button" onClick={() => editEntry(entry)} className="rounded-lg bg-white/[.06] px-2.5 py-1.5 text-[9px] font-black text-white/50">Upraviť</button><button type="button" onClick={() => window.confirm("Vymazať túto kartičku?") && onEntriesChange(entries.filter((item) => item.id !== entry.id))} className="ml-auto text-[9px] font-black text-rose-300/65">Vymazať</button></div></article>)}</div>
    </section>
    {(shareCollection || importOpen) && <PackShareDialog collection={shareCollection ?? undefined} entries={entries} onImport={importPack} onClose={() => { setShareCollection(null); setImportOpen(false); }} />}
    </>
  );
}
