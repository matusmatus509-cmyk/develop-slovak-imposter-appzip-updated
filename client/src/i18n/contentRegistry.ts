/**
 * Anglický herný obsah, ktorý už prešiel prekladom v dátovej vrstve.
 *
 * DOM prekladač v `LanguageProvider` takéto texty nesmie prekladať druhýkrát:
 * anglické slovo sa môže náhodou zhodovať so slovenským kľúčom slovníka
 * („list", „most", „pes"…) a prekladač by z neho urobil niečo iné.
 */
const englishContent = new Set<string>();

export function registerEnglishContent(values: Iterable<string | undefined | null>) {
  for (const value of values) {
    const core = value?.trim();
    if (core) englishContent.add(core);
  }
}

export function isEnglishContent(text: string) {
  return englishContent.has(text);
}
