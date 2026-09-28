import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import englishTranslations from "./translations.en.json";
import germanTranslations from "./translations.de.json";
import spanishTranslations from "./translations.es.json";
import frenchTranslations from "./translations.fr.json";
import portugueseTranslations from "./translations.pt.json";
import englishPatterns from "./translations.en.patterns.json";
import { isEnglishContent } from "./contentRegistry";
// Registruje anglický herný obsah, aby ho DOM prekladač nechal tak.
import "./content";

export type AppLanguage = "sk" | "en" | "de" | "es" | "fr" | "pt";

/** Ponuka jazykov (domovská obrazovka aj Nastavenia). Názvy sa neprekladajú. */
export const LANGUAGE_OPTIONS: { code: AppLanguage; mark: string; label: string }[] = [
  { code: "sk", mark: "SK", label: "Slovenčina" },
  { code: "en", mark: "EN", label: "English" },
  { code: "de", mark: "DE", label: "Deutsch" },
  { code: "es", mark: "ES", label: "Español" },
  { code: "fr", mark: "FR", label: "Français" },
  { code: "pt", mark: "PT", label: "Português" },
];

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const dictionaries: Record<Exclude<AppLanguage, "sk">, Record<string, string>> = {
  en: englishTranslations as Record<string, string>,
  de: germanTranslations as Record<string, string>,
  es: spanishTranslations as Record<string, string>,
  fr: frenchTranslations as Record<string, string>,
  pt: portugueseTranslations as Record<string, string>,
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
const participantLabels: Record<AppLanguage, { player: string; team: string }> = {
  sk: { player: "Hráč", team: "Tím" },
  en: { player: "Player", team: "Team" },
  de: { player: "Spieler", team: "Team" },
  es: { player: "Jugador", team: "Equipo" },
  fr: { player: "Joueur", team: "Équipe" },
  pt: { player: "Jogador", team: "Equipa" },
};
const generatedPlayerPattern = /^(?:Hráč|Player|Spieler|Jugador|Joueur|Jogador)(?:\s+(\d+))?$/i;
const generatedTeamPattern = /^(?:Tím|Team|Equipo|Équipe|Equipe|Equipa)\s+([A-Z])$/i;

export function defaultPlayerName(language: AppLanguage, number?: number) {
  return number === undefined ? participantLabels[language].player : `${participantLabels[language].player} ${number}`;
}

export function defaultTeamName(language: AppLanguage, letter: string) {
  return `${participantLabels[language].team} ${letter}`;
}

export function localizeGeneratedParticipantName(name: string, language: AppLanguage) {
  const player = name.match(generatedPlayerPattern);
  if (player) return defaultPlayerName(language, player[1] ? Number(player[1]) : undefined);
  const team = name.match(generatedTeamPattern);
  if (team) return defaultTeamName(language, team[1].toUpperCase());
  return name;
}

function preserveWhitespace(source: string, translated: string) {
  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated.trim()}${trailing}`;
}

// ── Angličtina: presné frázy, šablóny s číslami a celé slová ─────────────────
//
// Pôvodný fallback nahrádzal podreťazce („hra" vnútri „hranolky", „Loď"
// vnútri „Loďka"), čím kazil text. V angličtine sa preto prekladá iba:
//   1. presná zhoda celej frázy,
//   2. šablóna, v ktorej sa líšia len čísla („Hráč 7" → „Player 7"),
//   3. najdlhšie zhody CELÝCH slov (poistka pre nepokryté zložené texty).
// Anglický obsah z dátovej vrstvy tak zostane nedotknutý.

/** Znaky, ktoré sa v angličtine (ani v menách ako Beyoncé, Pokémon) nevyskytujú. */
const slovakOnlySignal = /[äčďĺľňôŕšťžÄČĎĹĽŇÔŔŠŤŽ]|(?<!\p{L})(?:hráč\p{L}*|tím|tímy|tímu|kolo|kolá|kola|bodov|otázk\p{L}*|odpove\p{L}*|správn\p{L}*|vyber\p{L}*|sekúnd\p{L}*|slovo|slová|kategóri\p{L}*|pravidl\p{L}*|výsled\p{L}*|vyhráva\p{L}*|výzv\p{L}*|nikdy|písmen\p{L}*|zvuk\p{L}*|pesni\p{L}*|vymenuj|hra|hry|hru|hier|alebo|ktor\p{L}*|nie|áno|všetk\p{L}*|sú|je|pre|zo|sa|si|ako|aj|už|tu|tam|teraz|potom|ešte|keby|lebo|kde|kto|čo|prečo|koľko)(?!\p{L})/iu;
const NUMBER_PATTERN = /\d+(?:[.,]\d+)*/g;

interface NumericTemplate {
  target: string;
  /** Pre každé číslo v cieli index čísla zo zdroja. */
  order: number[];
}

function buildNumericTemplates(dictionary: Record<string, string>) {
  const templates = new Map<string, NumericTemplate | null>();
  for (const [source, target] of Object.entries(dictionary)) {
    const sourceNumbers = source.match(NUMBER_PATTERN);
    if (!sourceNumbers) continue;
    const targetNumbers = target.match(NUMBER_PATTERN) ?? [];
    if (targetNumbers.length !== sourceNumbers.length) continue;
    const used = new Set<number>();
    const order: number[] = [];
    for (const number of targetNumbers) {
      const index = sourceNumbers.findIndex((candidate, i) => candidate === number && !used.has(i));
      if (index < 0) break;
      used.add(index);
      order.push(index);
    }
    if (order.length !== targetNumbers.length) continue;
    const key = source.replace(NUMBER_PATTERN, "#");
    const template: NumericTemplate = { target: target.replace(NUMBER_PATTERN, "#"), order };
    const existing = templates.get(key);
    if (existing === undefined) templates.set(key, template);
    else if (existing && (existing.target !== template.target || existing.order.join() !== template.order.join())) templates.set(key, null);
  }
  return templates;
}

const englishDictionary = dictionaries.en;
const englishTemplates = buildNumericTemplates(englishDictionary);
const MAX_PHRASE_WORDS = 6;

function translateNumericTemplate(core: string) {
  const numbers = core.match(NUMBER_PATTERN);
  if (!numbers) return null;
  const template = englishTemplates.get(core.replace(NUMBER_PATTERN, "#"));
  if (!template) return null;
  let index = 0;
  return template.target.replace(/#/g, () => numbers[template.order[index++]] ?? "");
}

function lookupEnglishPhrase(phrase: string) {
  const exact = englishDictionary[phrase];
  if (exact) return exact;
  const lowered = phrase.charAt(0).toLocaleLowerCase("sk") + phrase.slice(1);
  if (lowered !== phrase && englishDictionary[lowered]) {
    const value = englishDictionary[lowered];
    return value.charAt(0).toLocaleUpperCase("en") + value.slice(1);
  }
  return translateNumericTemplate(phrase);
}

/** Najdlhšie zhody celých slov; nikdy nenahrádza časť slova. */
function translateEnglishWords(core: string) {
  const tokens = core.split(/([\p{L}\p{N}]+(?:['’][\p{L}]+)*)/u);
  const output: string[] = [];
  let changed = false;
  for (let i = 0; i < tokens.length; i += 1) {
    const isWord = i % 2 === 1;
    if (!isWord) {
      output.push(tokens[i]);
      continue;
    }
    let matched = false;
    for (let words = MAX_PHRASE_WORDS; words >= 1; words -= 1) {
      const end = i + (words - 1) * 2;
      if (end >= tokens.length) continue;
      const phrase = tokens.slice(i, end + 1).join("");
      const translated = lookupEnglishPhrase(phrase);
      if (translated) {
        output.push(translated);
        i = end;
        matched = true;
        changed = true;
        break;
      }
    }
    if (!matched) output.push(tokens[i]);
  }
  return changed ? output.join("") : core;
}

/**
 * Šablóny s premennými časťami („{0} odpovedá" → „{0} answers"). Premenná je
 * meno hráča, číslo alebo iný text; ak je to známa slovenská fráza, preloží sa tiež.
 */
const englishPatternList = Object.entries(englishPatterns as Record<string, string>)
  .sort(([a], [b]) => b.length - a.length)
  .map(([source, target]) => {
    const pattern = source
      .split(/(\{\d+\})/)
      .map((part) => (/^\{\d+\}$/.test(part) ? "(.+?)" : part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
      .join("");
    const order = [...source.matchAll(/\{(\d+)\}/g)].map((match) => Number(match[1]));
    return { regex: new RegExp(`^${pattern}$`, "s"), target, order };
  });

function translateEnglishPattern(core: string) {
  for (const { regex, target, order } of englishPatternList) {
    const match = core.match(regex);
    if (!match) continue;
    const values: Record<number, string> = {};
    order.forEach((slot, index) => {
      const value = match[index + 1];
      values[slot] = englishDictionary[value.trim()] ?? value;
    });
    return target.replace(/\{(\d+)\}/g, (_, slot: string) => values[Number(slot)] ?? "");
  }
  return null;
}

/** Texty, ktoré v angličtine nemali presný preklad (číta ich kontrola prekladu v prehliadači). */
const englishMisses = new Set<string>();
if (typeof window !== "undefined") (window as unknown as { __i18nMisses?: Set<string> }).__i18nMisses = englishMisses;

function translateEnglish(source: string, core: string) {
  if (isEnglishContent(core)) return source;
  const exact = englishDictionary[core];
  if (exact) return preserveWhitespace(source, exact);
  if (!slovakOnlySignal.test(core) && !/[áéíóúý]/i.test(core)) return source;
  const templated = translateNumericTemplate(core);
  if (templated) return preserveWhitespace(source, templated);
  const patterned = translateEnglishPattern(core);
  if (patterned) return preserveWhitespace(source, patterned);
  if (!slovakOnlySignal.test(core)) return source;
  englishMisses.add(core);
  return preserveWhitespace(source, translateEnglishWords(core));
}

export function translateText(source: string, language: AppLanguage) {
  if (language === "sk") return source;
  const core = source.trim();
  if (!core) return source;
  if (language === "en") return translateEnglish(source, core);
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
    return stored === "en" || stored === "de" || stored === "es" || stored === "fr" || stored === "pt" ? stored : "sk";
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
      fr: "Imposteur — Jeux de soirée",
      pt: "Impostor — Jogos de festa",
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
    { code: "fr", flag: "🇫🇷", label: "Français" },
    { code: "pt", flag: "🇵🇹", label: "Português" },
  ];
  const active = options.find((option) => option.code === language) ?? options[0];

  return (
    <div data-no-translate className="absolute right-5 top-5 z-50">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Language"
        aria-expanded={isOpen}
        className="flex min-h-11 items-center gap-2 rounded-xl border border-white/12 bg-[#111820]/95 px-3 text-white shadow-xl transition hover:border-white/25 active:scale-95"
      >
        <span className="text-base" aria-hidden="true">{active.flag}</span>
        <span className="text-[11px] font-black uppercase tracking-wider">{active.code}</span>
        <span className={`text-[10px] text-white/55 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-white/12 bg-[#111820]/98 p-1.5 shadow-2xl">
          {options.map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => {
                setLanguage(option.code);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold transition ${language === option.code ? "bg-[#f3efe6] text-[#111827]" : "text-white/75 hover:bg-white/[.07] hover:text-white"}`}
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
