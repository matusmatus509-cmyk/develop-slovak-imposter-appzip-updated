import { useMemo, useState } from "react";
import {
  PartyPackError,
  createPartyPackExport,
  createPartyPackLinks,
  decodePartyPackExport,
  type DecodedPartyPack,
} from "../data/partyPackSharing";
import type { WorkshopCollection, WorkshopEntry } from "../types";
import { qrCodeToSvg } from "../utils/qrCode";

export default function PackShareDialog({ collection, entries, onImport, onClose }: {
  collection?: WorkshopCollection;
  entries: WorkshopEntry[];
  onImport: (pack: DecodedPartyPack) => string;
  onClose: () => void;
}) {
  const [importValue, setImportValue] = useState("");
  const [activeQr, setActiveQr] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const sharing = useMemo(() => {
    if (!collection) return null;
    try {
      const exported = createPartyPackExport(collection, entries);
      const links = createPartyPackLinks(exported, window.location.href);
      return { exported, links, error: "" };
    } catch (reason) {
      return { exported: "", links: [], error: reason instanceof Error ? reason.message : "Balík sa nepodarilo pripraviť." };
    }
  }, [collection, entries]);
  const qr = useMemo(() => {
    if (!sharing?.links[activeQr]) return { svg: "", error: "" };
    try { return { svg: qrCodeToSvg(sharing.links[activeQr].url, 3), error: "" }; }
    catch (reason) { return { svg: "", error: reason instanceof Error ? reason.message : "QR kód sa nepodarilo vytvoriť." }; }
  }, [activeQr, sharing]);

  async function copy(value: string, success: string) {
    try {
      await navigator.clipboard.writeText(value);
      setError("");
      setStatus(success);
    } catch {
      setStatus("");
      setError("Kopírovanie nie je v tomto prehliadači povolené. Označte kód a skopírujte ho ručne.");
    }
  }

  function importPack() {
    setError("");
    setStatus("");
    try {
      const pack = decodePartyPackExport(importValue);
      setStatus(onImport(pack));
      setImportValue("");
    } catch (reason) {
      setError(reason instanceof PartyPackError || reason instanceof Error ? reason.message : "Balík sa nepodarilo importovať.");
    }
  }

  return (
    <div className="fixed inset-0 z-[350] flex items-end justify-center bg-black/80 p-4 backdrop-blur-md sm:items-center" role="dialog" aria-modal="true" aria-label={collection ? `Zdieľať ${collection.name}` : "Importovať balík"}>
      <button type="button" className="absolute inset-0" aria-label="Zavrieť" onClick={onClose} />
      <section className="light-keep-dark relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[2rem] border border-white/15 bg-[#111820] p-5 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div><p className="premium-eyebrow text-emerald-300">Lokálny balík PP1</p><h2 className="mt-1 text-xl font-black">{collection ? `${collection.icon} Zdieľať kolekciu` : "Importovať kolekciu"}</h2></div>
          <button type="button" onClick={onClose} className="premium-nav-button" aria-label="Zavrieť">×</button>
        </div>

        {collection && sharing && !sharing.error && <>
          <p className="mt-3 text-[10px] leading-relaxed text-white/48">QR kód obsahuje iba odkaz na túto aplikáciu a údaje balíka. Nič sa neodosiela ani neukladá do cloudu.</p>
          {qr.svg ? <div className="mt-4 rounded-2xl bg-white p-3 text-center">
            <div className="mx-auto w-fit max-w-full overflow-auto" dangerouslySetInnerHTML={{ __html: qr.svg }} />
          </div> : <p role="alert" className="mt-4 rounded-xl bg-rose-400/10 p-3 text-xs text-rose-200">{qr.error}</p>}
          <div className="mt-3 flex items-center justify-between gap-2">
            <button type="button" disabled={activeQr === 0} onClick={() => setActiveQr((index) => Math.max(0, index - 1))} className="rounded-xl bg-white/[.07] px-3 py-2 text-[10px] font-black disabled:opacity-25">← Predošlý</button>
            <strong className="text-[10px]">QR {activeQr + 1} z {sharing.links.length}</strong>
            <button type="button" disabled={activeQr === sharing.links.length - 1} onClick={() => setActiveQr((index) => Math.min(sharing.links.length - 1, index + 1))} className="rounded-xl bg-white/[.07] px-3 py-2 text-[10px] font-black disabled:opacity-25">Ďalší →</button>
          </div>
          <p className="mt-2 text-center text-[9px] text-white/38">{sharing.links.length === 1 ? "Celý malý balík je v jednom QR odkaze." : `Naskenujte odkazy v poradí 1 až ${sharing.links.length}. Aplikácia časti uloží lokálne a po poslednej balík automaticky pridá.`}</p>
          <button type="button" onClick={() => copy(sharing.links[activeQr].url, `Odkaz QR ${activeQr + 1} bol skopírovaný.`)} className="mt-3 w-full rounded-xl border border-white/10 bg-white/[.06] py-3 text-[10px] font-black">Kopírovať aktuálny odkaz</button>
          <label className="mt-4 block"><span className="premium-field-label">Exportný kód pre ručný prenos</span><textarea readOnly value={sharing.exported} rows={4} onFocus={(event) => event.currentTarget.select()} className="premium-input resize-none font-mono text-[8px]" /></label>
          <button type="button" onClick={() => copy(sharing.exported, "Exportný kód bol skopírovaný.")} className="mt-2 w-full rounded-xl bg-emerald-300 py-3 text-xs font-black text-emerald-950">Kopírovať exportný kód</button>
        </>}

        {collection && sharing?.error && <p role="alert" className="mt-4 rounded-xl bg-rose-400/10 p-3 text-xs text-rose-200">{sharing.error}</p>}

        {!collection && <>
          <p className="mt-3 text-[10px] leading-relaxed text-white/48">Vložte celý kód začínajúci <strong>PP1</strong>. Import vytvorí novú kolekciu a nové ID; existujúce balíky ani kartičky neprepíše.</p>
          <label className="mt-4 block"><span className="premium-field-label">Exportný kód</span><textarea value={importValue} onChange={(event) => setImportValue(event.target.value)} rows={7} autoFocus className="premium-input resize-none font-mono text-[9px]" placeholder="PP1…" /></label>
          <button type="button" disabled={!importValue.trim()} onClick={importPack} className="mt-3 w-full rounded-xl bg-emerald-300 py-3 text-xs font-black text-emerald-950 disabled:opacity-35">Skontrolovať a importovať</button>
        </>}

        {status && <p role="status" className="mt-3 rounded-xl bg-emerald-400/10 p-3 text-[10px] font-bold text-emerald-200">{status}</p>}
        {error && <p role="alert" className="mt-3 rounded-xl bg-rose-400/10 p-3 text-[10px] font-bold text-rose-200">{error}</p>}
      </section>
    </div>
  );
}
