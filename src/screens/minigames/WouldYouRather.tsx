import { useCallback, useEffect, useMemo, useState } from "react";
import { getWouldYouRatherForLanguage } from "../../data/localizedWouldYouRather";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button, Shell } from "../../components/ui";
import CustomContentSelector, { type CustomContentControls } from "../../components/CustomContentSelector";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";
import { takePersistentItem } from "../../utils/persistentDeck";
import type { WorkshopEntry } from "../../types";

interface Pair { id?: string; a: string; b: string; source: "bundled" | "custom" }
type Choice = "a" | "b";

function stablePercent(pair: Pair) {
  const source = pair.id ?? `${pair.a}|${pair.b}`;
  let hash = 17;
  for (let index = 0; index < source.length; index += 1) hash = (hash * 31 + source.charCodeAt(index)) | 0;
  return 38 + (Math.abs(hash) % 25);
}

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) { setValue(0); return; }
    const start = performance.now();
    const timer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - start) / 420);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress === 1) window.clearInterval(timer);
    }, 16);
    return () => window.clearInterval(timer);
  }, [active, target]);
  return value;
}

export default function WouldYouRather({ onBack, customEntries = [], customControls }: {
  onBack: () => void; customEntries?: WorkshopEntry[]; customControls?: CustomContentControls;
}) {
  const { language } = useLanguage();
  const deck = useMemo<Pair[]>(() => [
    ...getWouldYouRatherForLanguage(language).map((item) => ({ ...item, source: "bundled" as const })),
    ...customEntries.filter((entry) => entry.answer).map((entry) => ({ id: entry.id, a: entry.text, b: entry.answer!, source: "custom" as const })),
  ], [customEntries, language]);
  const draw = useCallback(() => takePersistentItem("would-you-rather", deck, (item) => item.source === "bundled" ? `${item.a}|${item.b}` : `${item.source}:${item.id ?? `${item.a}|${item.b}`}`), [deck]);
  const [pair, setPair] = useState<Pair>(draw);
  const [picked, setPicked] = useState<Choice | null>(null);
  const [entering, setEntering] = useState(false);
  const voteA = stablePercent(pair);
  const shownA = useCountUp(voteA, picked !== null);
  const shownB = useCountUp(100 - voteA, picked !== null);

  useEffect(() => {
    if (pair.source === "custom" && !customEntries.some((entry) => entry.id === pair.id)) next();
    // Custom content can disappear while this card is visible.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customEntries, pair.id, pair.source]);

  function choose(option: Choice) { if (!picked) setPicked(option); }
  function next() {
    setEntering(true);
    window.setTimeout(() => { setPicked(null); setPair(draw()); setEntering(false); }, 150);
  }

  const options: { key: Choice; title: string; color: string; muted: string; percent: number }[] = [
    { key: "a", title: pair.a, color: "from-amber-400/25 via-orange-500/15 to-rose-500/20", muted: "border-amber-200/20", percent: shownA },
    { key: "b", title: pair.b, color: "from-sky-400/20 via-indigo-500/15 to-violet-500/25", muted: "border-sky-200/20", percent: shownB },
  ];

  return <Shell className="would-rather-shell"><main className={cn("relative mx-auto flex w-full max-w-xl flex-1 flex-col py-1 transition-all duration-150", entering && "translate-y-2 opacity-0")} aria-live="polite">
      <button type="button" onClick={onBack} className="ml-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white/85 shadow-[0_12px_28px_-16px_rgba(0,0,0,.95)] backdrop-blur-xl transition hover:border-white/35 hover:bg-white/10 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30" aria-label="Zavrieť hru"><Icons.x size={25} /></button>
      <h1 className="sr-only">Čo by si radšej?</h1>
      <section className="flex flex-1 flex-col justify-center gap-3 py-4" aria-label="Možnosti otázky">
        {options.map((option, index) => {
          const selected = picked === option.key;
          const otherSelected = Boolean(picked && !selected);
          return <div key={option.key}>
            <button type="button" disabled={Boolean(picked)} onClick={() => choose(option.key)} aria-pressed={selected} className={cn(
              "group relative min-h-[clamp(11rem,27dvh,17rem)] w-full overflow-hidden rounded-[30px] border bg-gradient-to-br px-6 py-7 text-center outline-none transition-all duration-200 focus-visible:ring-4 focus-visible:ring-white/35 disabled:cursor-default",
              option.color, option.muted,
              selected && "scale-[1.015] border-white/60 shadow-[0_22px_55px_-28px_rgba(255,255,255,.9)]",
              otherSelected && "scale-[0.985] opacity-45 grayscale-[.25]",
              !picked && "hover:-translate-y-0.5 hover:border-white/35 hover:shadow-[0_18px_40px_-28px_rgba(255,255,255,.75)] active:scale-[.985]",
            )}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,rgba(255,255,255,.16),transparent_38%)]" />
              <div className="relative flex h-full flex-col items-center justify-center gap-5">
                {selected && <span className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg font-black text-white" aria-label="Vybraná možnosť">✓</span>}
                <p className="max-w-[21ch] text-[clamp(1.45rem,6vw,2rem)] font-black leading-[1.13] tracking-tight text-white" data-no-translate>{option.title}</p>
                {picked && <div className="flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/20"><div className="h-full rounded-full bg-white/75 transition-all duration-500" style={{ width: `${option.percent}%` }} /></div><strong className="w-12 text-right text-xl font-black tabular-nums text-white">{option.percent}%</strong></div>}
              </div>
            </button>
            {index === 0 && <div className="relative z-10 -my-7 flex justify-center"><span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/45 bg-gradient-to-br from-rose-300/75 to-sky-300/75 text-xs font-black tracking-wide text-white shadow-[0_14px_34px_-14px_rgba(96,165,250,.9)] backdrop-blur-xl">ALEBO</span></div>}
          </div>;
        })}
      </section>
      {picked && <div className="mt-1 animate-[fadeIn_.22s_ease-out]"><Button fullWidth size="lg" onClick={next}>Ďalšia otázka</Button></div>}
      {customControls && <details className="sr-only"><summary>Vlastný obsah</summary><CustomContentSelector controls={customControls} compact /></details>}
    </main>
  </Shell>;
}
