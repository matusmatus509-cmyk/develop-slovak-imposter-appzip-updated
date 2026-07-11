import type { CategoryDef, GameSettings, RoundAssignment } from "../types";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateRound(
  settings: GameSettings,
  categories: CategoryDef[],
  usedWords: Record<string, string[]>
): { assignment: RoundAssignment; usedWords: Record<string, string[]> } {
  const availableCategories = categories.filter((c) =>
    settings.categoryIds.includes(c.id)
  );
  const pool = availableCategories.length > 0 ? availableCategories : categories;
  const category = pickRandom(pool);

  const used = usedWords[category.id] ?? [];
  let candidates = category.words.filter((w) => !used.includes(w));
  let nextUsedForCategory = used;

  if (candidates.length === 0) {
    candidates = category.words;
    nextUsedForCategory = [];
  }

  const word = pickRandom(candidates);
  const updatedUsed = settings.noRepeatWords
    ? { ...usedWords, [category.id]: [...nextUsedForCategory, word] }
    : usedWords;

  // decoy hint word from a different category
  const decoyCategoryPool = categories.filter((c) => c.id !== category.id);
  const decoyCategory = pickRandom(
    decoyCategoryPool.length > 0 ? decoyCategoryPool : categories
  );
  const hintWord = pickRandom(decoyCategory.words);

  const playerCount = settings.playerNames.length;
  const impostorCount = Math.min(
    settings.impostorCount,
    Math.max(1, playerCount - 2)
  );
  const impostorIndexes = shuffle(
    Array.from({ length: playerCount }, (_, i) => i)
  ).slice(0, impostorCount);

  return {
    assignment: {
      word,
      categoryId: category.id,
      categoryName: category.name,
      categoryIcon: category.icon,
      impostorIndexes,
      hintWord,
    },
    usedWords: updatedUsed,
  };
}

export function maxImpostorsFor(playerCount: number): number {
  return Math.max(1, Math.min(3, Math.floor(playerCount / 3) + 1));
}
