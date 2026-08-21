import { useMemo, useState } from "react";
import { getDaresForLanguage, getTruthsForLanguage } from "../../data/localizedTruthOrDare";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Shell, TopBar } from "../../components/ui";
import CustomContentSelector, { type CustomContentControls } from "../../components/CustomContentSelector";
import { Icons } from "../../components/icons";
import { cn } from "../../utils/designTokens";
import { takePersistentItem } from "../../utils/persistentDeck";
import type { WorkshopEntry } from "../../types";

type Mode = "choose" | "truth" | "dare";
interface PromptCard { id?: string; text: string; source: "bundled" | "custom" }

export default function TruthOrDare({ onBack, customEntries = [], customControls }: {
  onBack: () => void;
  customEntries?: WorkshopEntry[];
  customControls?: CustomContentControls;
}) {
  const { language } = useLanguage();
  const decks = useMemo(() => ({
    truth: [
      ...getTruthsForLanguage(language).map((text) => ({ text, source: "bundled" as const })),
      ...customEntries
        .filter((entry) => entry.kind === "truth")
        .map((entry) => ({ id: entry.id, text: entry.text, source: "custom" as const })),
    ],
    dare: [
      ...getDaresForLanguage(language).map((text) => ({ text, source: "bundled" as const })),
      ...customEntries
        .filter((entry) => entry.kind === "dare")
        .map((entry) => ({ id: entry.id, text: entry.text, source: "custom" as const })),
    ],
  }), [customEntries, language]);
  const [mode, setMode] = useState<Mode>("choose");
  const [prompt, setPrompt] = useState<PromptCard | null>(null);

  function draw(next: "truth" | "dare") {
    return takePersistentItem(
      `truth-or-dare:${next}`,
      decks[next],
      (item) => item.source === "bundled" ? item.text : `${item.source}:${item.id ?? item.text}`,
    );
  }

  function choose(next: "truth" | "dare") {
    setMode(next);
    setPrompt(draw(next));
  }

  function shuffleAgain() {
    if (mode !== "choose") setPrompt(draw(mode));
  }

  return (
    <Shell className={cn("prompt-game-shell prompt-game-truth truth-dare-shell", mode !== "choose" && `is-${mode}`)}>
      <TopBar title="Pravda alebo výzva" onBack={onBack} />

      {mode === "choose" ? (
        <div className="truth-dare-stage truth-dare-choose">
          <header className="truth-dare-hero">
            <div className="truth-dare-emblem" aria-hidden="true">
              <Icons.sparkles size={25} />
            </div>
            <div>
              <p>Je čas ukázať odvahu</p>
              <h1>Čo si vyberieš?</h1>
            </div>
          </header>

          {customControls && (
            <div className="truth-dare-custom">
              <CustomContentSelector controls={customControls} compact />
            </div>
          )}

          <div className="truth-dare-choices">
            <button type="button" onClick={() => choose("truth")} className="truth-dare-choice is-truth">
              <span className="truth-dare-choice-number">01</span>
              <span className="truth-dare-choice-icon"><Icons.messageCircle size={30} /></span>
              <span className="truth-dare-choice-copy">
                <small>Úprimne a bez výhovoriek</small>
                <strong>Pravda</strong>
              </span>
              <span className="truth-dare-choice-arrow"><Icons.chevronRight size={19} /></span>
            </button>

            <button type="button" onClick={() => choose("dare")} className="truth-dare-choice is-dare">
              <span className="truth-dare-choice-number">02</span>
              <span className="truth-dare-choice-icon"><Icons.flame size={30} /></span>
              <span className="truth-dare-choice-copy">
                <small>Odvážne a naplno</small>
                <strong>Výzva</strong>
              </span>
              <span className="truth-dare-choice-arrow"><Icons.chevronRight size={19} /></span>
            </button>
          </div>

          <p className="truth-dare-footnote">
            <Icons.users size={14} /> Kartu číta hráč po tvojej ľavici
          </p>
        </div>
      ) : (
        <div className="truth-dare-stage truth-dare-card-stage">
          <div className="truth-dare-meta">
            <span className={cn("truth-dare-mode", mode === "truth" ? "is-truth" : "is-dare")}>
              {mode === "truth" ? <Icons.messageCircle size={14} /> : <Icons.flame size={14} />}
              {mode === "truth" ? "Pravda" : "Výzva"}
            </span>
            {prompt?.source === "custom" && (
              <span className="truth-dare-custom-badge">
                <Icons.sparkles size={12} /> Vlastná kartička
              </span>
            )}
          </div>

          <article className={cn("truth-dare-card", mode === "truth" ? "is-truth" : "is-dare")}>
            <span className="truth-dare-card-index" aria-hidden="true">
              {mode === "truth" ? "T" : "V"}
            </span>
            <div className="truth-dare-card-mark" aria-hidden="true">
              {mode === "truth" ? <Icons.messageCircle size={24} /> : <Icons.flame size={24} />}
            </div>
            <div className="truth-dare-prompt-scroll">
              <p data-no-translate>{prompt?.text}</p>
            </div>
            <span className="truth-dare-card-caption">
              {mode === "truth" ? "Odpovedz úprimne" : "Prijmi výzvu"}
            </span>
          </article>

          <div className="truth-dare-actions">
            <button type="button" onClick={shuffleAgain} className={cn("truth-dare-next", mode === "truth" ? "is-truth" : "is-dare")}>
              <Icons.refresh size={17} />
              {mode === "truth" ? "Iná otázka" : "Iná výzva"}
            </button>
            <button type="button" onClick={() => setMode("choose")} className="truth-dare-back">
              <Icons.chevronLeft size={17} /> Späť na výber
            </button>
          </div>
        </div>
      )}
    </Shell>
  );
}
