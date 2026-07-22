import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import englishTranslations from "./translations.en.json";

export type AppLanguage = "sk" | "en";

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const dictionary = englishTranslations as Record<string, string>;
const slovakSignal = /[áäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ]|\b(hráč|hráči|tím|kolo|body|bodov|otázka|odpoveď|správne|nesprávne|ďalší|späť|začať|vyber\w*|čas|sekúnd|slovo|kategória|pravidlá|výsledok|vyhráva|prehra|pravda|výzva|nikdy|radšej|písmeno|zvuk|pesnička|vymenuj|slovenske|osobnosti|pokračovať|štart)\b/i;
const replacementEntries = Object.entries(dictionary)
  .filter(([source, target]) => source !== target && source.length >= 2)
  .sort(([a], [b]) => b.length - a.length);

const textRecords = new WeakMap<Text, { source: string; last: string }>();
const attributeRecords = new WeakMap<Element, Map<string, { source: string; last: string }>>();
const translatedAttributes = ["placeholder", "title", "aria-label"];

function preserveWhitespace(source: string, translated: string) {
  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated.trim()}${trailing}`;
}

export function translateToEnglish(source: string) {
  const core = source.trim();
  if (!core) return source;
  const exact = dictionary[core];
  if (exact) return preserveWhitespace(source, exact);
  if (!slovakSignal.test(core)) return source;

  let translated = core;
  for (const [slovak, english] of replacementEntries) {
    if (translated.includes(slovak)) translated = translated.split(slovak).join(english);
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
  const next = language === "en" ? translateToEnglish(record.source) : record.source;
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
    const next = language === "en" ? translateToEnglish(record.source) : record.source;
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
  const [language, setLanguageState] = useState<AppLanguage>(() => localStorage.getItem("party-language") === "en" ? "en" : "sk");

  function setLanguage(nextLanguage: AppLanguage) {
    localStorage.setItem("party-language", nextLanguage);
    setLanguageState(nextLanguage);
  }

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === "en" ? "Impostor — Party Games" : "Podvodník — Párty hry v slovenčine";
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
  return (
    <div data-no-translate className="fixed right-3 top-3 z-[10000] flex items-center gap-1 rounded-full border border-white/15 bg-[#0b0f18]/85 p-1 shadow-2xl backdrop-blur-xl">
      <span className="pl-2 text-sm" aria-hidden="true">🌐</span>
      {(["sk", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          aria-label={option === "sk" ? "Prepnúť do slovenčiny" : "Switch to English"}
          className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-wider transition active:scale-95 ${language === option ? "bg-white text-[#111827] shadow-lg" : "text-white/55 hover:text-white"}`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
