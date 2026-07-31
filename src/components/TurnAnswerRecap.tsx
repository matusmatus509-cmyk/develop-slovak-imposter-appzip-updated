export type TurnAnswerOutcome = "guessed" | "skipped" | "missed" | "partial";

export interface TurnAnswer {
  answer: string;
  outcome: TurnAnswerOutcome;
  detail?: string;
}

const OUTCOME_META: Record<TurnAnswerOutcome, { icon: string; label: string; className: string }> = {
  guessed: { icon: "✓", label: "Uhádnuté", className: "border-emerald-400/20 bg-emerald-400/[.08] text-emerald-100" },
  partial: { icon: "◐", label: "Čiastočne uhádnuté", className: "border-amber-400/20 bg-amber-400/[.08] text-amber-100" },
  skipped: { icon: "↷", label: "Preskočené", className: "border-white/10 bg-white/[.04] text-white/75" },
  missed: { icon: "×", label: "Neuhádnuté", className: "border-rose-400/20 bg-rose-400/[.08] text-rose-100" },
};

/** Displays every answer that appeared during a timed turn, grouped by outcome. */
export function TurnAnswerRecap({ answers }: { answers: readonly TurnAnswer[] }) {
  if (!answers.length) return null;
  const groups = (Object.keys(OUTCOME_META) as TurnAnswerOutcome[])
    .map((outcome) => ({ outcome, entries: answers.filter((answer) => answer.outcome === outcome) }))
    .filter((group) => group.entries.length > 0);

  return (
    <section className="glass w-full max-w-md rounded-3xl p-4 text-left">
      <p className="text-center text-[10px] font-black uppercase tracking-[.2em] text-white/40">Odpovede v tomto ťahu</p>
      <div className="mt-3 max-h-64 space-y-3 overflow-y-auto pr-1">
        {groups.map(({ outcome, entries }) => {
          const meta = OUTCOME_META[outcome];
          return (
            <div key={outcome}>
              <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-white/45">
                <span className={meta.className}>{meta.icon}</span> {meta.label} <span className="text-white/25">({entries.length})</span>
              </p>
              <ul className="space-y-1.5">
                {entries.map((entry, index) => (
                  <li key={`${entry.answer}-${index}`} className={`rounded-xl border px-3 py-2 text-sm font-bold ${meta.className}`}>
                    <span>{entry.answer}</span>
                    {entry.detail && <span className="ml-2 text-xs font-semibold opacity-70">{entry.detail}</span>}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
