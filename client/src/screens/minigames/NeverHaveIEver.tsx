import { useCallback, useEffect, useMemo, useState } from "react";
import { getNeverHaveIEverForLanguage } from "../../data/localizedNeverHaveIEver";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button, Shell, TopBar } from "../../components/ui";
import { Icons } from "../../components/icons";
import { takePersistentItem } from "../../utils/persistentDeck";
import type { WorkshopEntry } from "../../types";

interface Card {
  id?: string;
  text: string;
  source: "bundled" | "custom";
}

/**
 * Názov hry je už v hlavičke, preto karta zobrazuje iba samotný výrok.
 * Text upravujeme až pri zobrazení — pôvodné dáta a kľúče perzistentného balíčka
 * tak zostávajú nezmenené. Slovenské reflexívne tvary zároveň preusporiadame
 * na prirodzené „Nevyhováral sa…“ a „Nepomýlil si…“.
 */
function statementOnly(text: string, language: string) {
  let statement = text.trim();
  const slovakReflexive = statement.match(
    /^Nikdy som (sa|si) nikdy\s+(\S+)(.*)$/i
  );

  if (slovakReflexive) {
    const [, pronoun, verb, rest] = slovakReflexive;
    statement = `${verb} ${pronoun}${rest}`;
  } else {
    const repeatedOpenings = [
      /^Nikdy som nikdy\s+/i,
      /^Never have I ever\s+/i,
      /^Ich\s+.*?\snoch nie\s+/i,
      /^Nunca\s+/i,
      /^Je\s+(?:n['’]|ne\s+).*?\sjamais\s+/i,
    ];
    const opening = repeatedOpenings.find((pattern) => pattern.test(statement));
    if (opening) statement = statement.replace(opening, "");
  }

  if (!statement) return text;
  return `${statement[0].toLocaleUpperCase(language)}${statement.slice(1)}`;
}

export default function NeverHaveIEver({
  onBack,
  customEntries = [],
}: {
  onBack: () => void;
  customEntries?: WorkshopEntry[];
}) {
  const { language } = useLanguage();
  const deck = useMemo<Card[]>(
    () => [
      ...getNeverHaveIEverForLanguage(language).map((text) => ({
        text,
        source: "bundled" as const,
      })),
      ...customEntries.map((entry) => ({
        id: entry.id,
        text: entry.text,
        source: "custom" as const,
      })),
    ],
    [customEntries, language]
  );
  const draw = useCallback(
    () =>
      takePersistentItem(
        "never-have-i-ever",
        deck,
        (item) =>
          item.source === "bundled"
            ? item.text
            : `${item.source}:${item.id ?? item.text}`
      ),
    [deck]
  );
  const [card, setCard] = useState<Card>(draw);

  useEffect(() => {
    if (
      card.source === "custom" &&
      !customEntries.some((entry) => entry.id === card.id)
    )
      setCard(draw());
  }, [card.id, card.source, customEntries, draw]);

  function next() {
    setCard(draw());
  }

  const statement = statementOnly(card.text, language);

  return (
    <Shell className="prompt-game-shell prompt-game-never">
      <TopBar title="Nikdy som nikdy" onBack={onBack} />

      <main className="never-game-stage">
        <p className="never-game-rule">
          <span className="never-game-rule-dot" aria-hidden="true" />
          Ak si to urobil, napi sa alebo zdvihni prst
        </p>

        <article className="never-game-card" aria-live="polite">
          <p data-no-translate>{statement}</p>
        </article>

        <Button
          fullWidth
          size="lg"
          onClick={next}
          className="prompt-game-next never-game-next"
        >
          <span className="inline-flex items-center gap-2">
            Ďalší výrok <Icons.chevronRight size={18} />
          </span>
        </Button>
      </main>
    </Shell>
  );
}
