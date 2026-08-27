import { Icons } from "./icons";

/**
 * Normalizácia textu pre vyhľadávanie — veľkosť písmen aj diakritika
 * sa ignorujú (šport === sport === ŠPORT), aby hľadanie fungovalo
 * na slovenských názvoch kategórií bez trápenia s háčikmi.
 */
export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Pridá sa na začiatok názvu aj ako podreťazec — "škol" nájde "Škola". */
export function matchesSearch(name: string, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;
  return normalizeSearchText(name).includes(normalizedQuery);
}

export interface CategoryPickerSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Vyhľadávací políčko pre výberové obrazovky kategórií (Imposter,
 * Šarády, Hádaj kto som). Drží sa hore pevne — skroluje len zoznam.
 */
export default function CategoryPickerSearch({
  value,
  onChange,
  placeholder = "Hľadať kategóriu…",
}: CategoryPickerSearchProps) {
  return (
    <label className="guess-who-picker-search">
      <Icons.search size={15} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      {value ? (
        <button type="button" onClick={() => onChange("")} aria-label="Vymazať hľadaný text">
          <Icons.x size={13} />
        </button>
      ) : null}
    </label>
  );
}
