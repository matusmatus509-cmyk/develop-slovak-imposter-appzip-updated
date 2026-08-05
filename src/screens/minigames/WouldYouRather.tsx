import { useCallback, useEffect, useMemo, useState } from "react";
import { getWouldYouRatherForLanguage } from "../../data/localizedWouldYouRather";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button, Shell, TopBar } from "../../components/ui";
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

  return <Shell className="would-rather-shell"><TopBar title="Čo by si radšej?" onBack={onBack} />
    <main className={cn("mx-auto flex w-full max-w-xl flex-1 flex-col px-1 pb-5 pt-3 transition-all duration-150", entering && "translate-y-2 opacity-0")} aria-live="polite">
      <header className="mb-5 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-[20px] border border-violet-200/15 bg-violet-500/10 shadow-[0_14px_35px_-20px_rgba(167,139,250,.85)]"><Icons.brain size={29} className="text-violet-200" /></div>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-violet-200/65">Rýchla dilema</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-white">Čo by si radšej?</h1>
        <p className="mt-2 text-sm text-white/55">Vyber jednu možnosť. Až potom sa ukáže hlasovanie.</p>
      </header>
      {customControls && <div className="mb-4"><CustomContentSelector controls={customControls} compact /></div>}
      {pair.source === "custom" && <span className="mx-auto mb-3 rounded-full border border-emerald-300/15 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-200">Vlastná kartička</span>}
      <section className="flex flex-1 flex-col justify-center gap-3" aria-label="Možnosti otázky">
        {options.map((option, index) => {
          const selected = picked === option.key;
          const otherSelected = Boolean(picked && !selected);
          return <div key={option.key}>
            <button type="button" disabled={Boolean(picked)} onClick={() => choose(option.key)} aria-pressed={selected} className={cn(
              "group relative min-h-40 w-full overflow-hidden rounded-[30px] border bg-gradient-to-br p-6 text-left outline-none transition-all duration-200 focus-visible:ring-4 focus-visible:ring-white/35 disabled:cursor-default",
              option.color, option.muted,
              selected && "scale-[1.015] border-white/60 shadow-[0_22px_55px_-28px_rgba(255,255,255,.9)]",
              otherSelected && "scale-[0.985] opacity-45 grayscale-[.25]",
              !picked && "hover:-translate-y-0.5 hover:border-white/35 hover:shadow-[0_18px_40px_-28px_rgba(255,255,255,.75)] active:scale-[.985]",
            )}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,rgba(255,255,255,.16),transparent_38%)]" />
              <div className="relative flex h-full flex-col justify-between gap-5">
                <div className="flex items-center justify-between"><span className="rounded-full bg-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Možnosť {option.key.toUpperCase()}</span>{selected && <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg font-black text-white" aria-label="Vybraná možnosť">✓</span>}</div>
                <p className="max-w-[31ch] text-[clamp(1.2rem,4.6vw,1.65rem)] font-black leading-[1.15] tracking-tight text-white" data-no-translate>{option.title}</p>
                {picked && <div className="flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/20"><div className="h-full rounded-full bg-white/75 transition-all duration-500" style={{ width: `${option.percent}%` }} /></div><strong className="w-12 text-right text-xl font-black tabular-nums text-white">{option.percent}%</strong></div>}
              </div>
            </button>
            {index === 0 && <div className="relative z-10 -my-1 flex justify-center"><span className="rounded-full border border-white/15 bg-[#111529] px-4 py-2 text-[10px] font-black tracking-[0.24em] text-white/65 shadow-xl">ALEBO</span></div>}
          </div>;
        })}
      </section>
      {picked && <div className="mt-5 animate-[fadeIn_.22s_ease-out]"><Button fullWidth size="xl" onClick={next}>Ďalšia otázka</Button></div>}
    </main>
  </Shell>;
}
