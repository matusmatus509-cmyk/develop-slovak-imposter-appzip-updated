import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import englishTranslations from "./translations.en.json";
import germanTranslations from "./translations.de.json";
import spanishTranslations from "./translations.es.json";

export type AppLanguage = "sk" | "en" | "de" | "es";

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const dictionaries: Record<Exclude<AppLanguage, "sk">, Record<string, string>> = {
  en: englishTranslations as Record<string, string>,
  de: germanTranslations as Record<string, string>,
  es: spanishTranslations as Record<string, string>,
};
const slovakSignal = /[áäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ]|\b(hráč|hráči|tím|kolo|body|bodov|otázka|odpoveď|správne|nesprávne|ďalší|späť|začať|vyber\w*|čas|sekúnd|slovo|kategória|pravidlá|výsledok|vyhráva|prehra|pravda|výzva|nikdy|radšej|písmeno|zvuk|pesnička|vymenuj|slovenske|osobnosti|pokračovať|štart)\b/i;
const replacementEntries = Object.fromEntries(
  Object.entries(dictionaries).map(([language, dictionary]) => [
    language,
    Object.entries(dictionary)
      .filter(([source, target]) => source !== target && source.length >= 2)
      .sort(([a], [b]) => b.length - a.length),
  ]),
) as Record<Exclude<AppLanguage, "sk">, [string, string][]>;

const textRecords = new WeakMap<Text, { source: string; last: string }>();
const attributeRecords = new WeakMap<Element, Map<string, { source: string; last: string }>>();
const translatedAttributes = ["placeholder", "title", "aria-label"];

function preserveWhitespace(source: string, translated: string) {
  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated.trim()}${trailing}`;
}

export function translateText(source: string, language: AppLanguage) {
  if (language === "sk") return source;
  const core = source.trim();
  if (!core) return source;
  const dictionary = dictionaries[language];
  const exact = dictionary[core];
  if (exact) return preserveWhitespace(source, exact);
  if (!slovakSignal.test(core)) return source;

  let translated = core;
  for (const [slovak, target] of replacementEntries[language]) {
    if (translated.includes(slovak)) translated = translated.split(slovak).join(target);
  }
  return preserveWhitespace(source, translated);
}

function isExcluded(node: Node) {
  const parent = node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement;
  return Boolean(parent?.closest("[data-no-translate], script, style, noscript, svg"));
}

function translateTextNode(node: Text, language: AppLanguage) {
  if (isExcluded(node)) return;
  let record = textRecords.get(node);
  if (!record) {
    record = { source: node.data, last: node.data };
    textRecords.set(node, record);
  } else if (node.data !== record.last && node.data !== record.source) {
    record.source = node.data;
  }
  const next = translateText(record.source, language);
  record.last = next;
  if (node.data !== next) node.data = next;
}

function translateElementAttributes(element: Element, language: AppLanguage) {
  if (isExcluded(element)) return;
  let records = attributeRecords.get(element);
  if (!records) {
    records = new Map();
    attributeRecords.set(element, records);
  }
  for (const attribute of translatedAttributes) {
    const current = element.getAttribute(attribute);
    if (current === null) continue;
    let record = records.get(attribute);
    if (!record) {
      record = { source: current, last: current };
      records.set(attribute, record);
    } else if (current !== record.last && current !== record.source) {
      record.source = current;
    }
    const next = translateText(record.source, language);
    record.last = next;
    if (current !== next) element.setAttribute(attribute, next);
  }
}

function translateTree(root: Node, language: AppLanguage) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, language);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
  if (root.nodeType === Node.ELEMENT_NODE) translateElementAttributes(root as Element, language);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) translateTextNode(current as Text, language);
    else translateElementAttributes(current as Element, language);
    current = walker.nextNode();
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const stored = localStorage.getItem("party-language");
    return stored === "en" || stored === "de" || stored === "es" ? stored : "sk";
  });

  function setLanguage(nextLanguage: AppLanguage) {
    localStorage.setItem("party-language", nextLanguage);
    setLanguageState(nextLanguage);
  }

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = {
      sk: "Podvodník — Párty hry v slovenčine",
      en: "Impostor — Party Games",
      de: "Impostor — Partyspiele",
      es: "Impostor — Juegos de fiesta",
    }[language];
    translateTree(document.body, language);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") translateTextNode(mutation.target as Text, language);
        if (mutation.type === "attributes") translateElementAttributes(mutation.target as Element, language);
        mutation.addedNodes.forEach((node) => translateTree(node, language));
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: translatedAttributes });
    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const options: { code: AppLanguage; flag: string; label: string }[] = [
    { code: "sk", flag: "🇸🇰", label: "Slovenčina" },
    { code: "en", flag: "🇬🇧", label: "English" },
    { code: "de", flag: "🇩🇪", label: "Deutsch" },
    { code: "es", flag: "🇪🇸", label: "Español" },
  ];
  const active = options.find((option) => option.code === language) ?? options[0];

  return (
    <div data-no-translate className="fixed right-3 top-3 z-[10000]">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Language"
        aria-expanded={isOpen}
        className="flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-[#0b0f18]/90 px-3 text-white shadow-2xl backdrop-blur-xl transition hover:border-white/30 active:scale-95"
      >
        <span className="text-base" aria-hidden="true">{active.flag}</span>
        <span className="text-[11px] font-black uppercase tracking-wider">{active.code}</span>
        <span className={`text-[10px] text-white/55 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-white/15 bg-[#0b0f18]/95 p-1.5 shadow-2xl backdrop-blur-xl">
          {options.map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => {
                setLanguage(option.code);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${language === option.code ? "bg-white text-[#111827]" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
            >
              <span className="text-lg" aria-hidden="true">{option.flag}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
