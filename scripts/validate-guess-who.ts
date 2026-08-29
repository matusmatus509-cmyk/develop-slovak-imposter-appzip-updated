import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { AppLanguage } from "../client/src/i18n/LanguageProvider";
import { getCharacterCategories } from "../client/src/data/characters";

const LANGUAGES: AppLanguage[] = ["sk", "en", "de", "es", "fr", "pt"];
const MINIMUM_CARDS = 60;
const EXPECTED_NEW_CATEGORY_COUNTS: Record<string, number> = {
  "world-singers": 100,
  "football-stars": 100,
  "brawl-stars": 80,
  minecraft: 80,
  pokemon: 100,
  "harry-potter": 80,
};
const CURATED_DATA_FILES = [
  "client/src/data/guessWhoMusicAndSports.ts",
  "client/src/data/guessWhoGameWorlds.ts",
  "client/src/data/guessWhoFandoms.ts",
  "client/src/data/guessWhoEverydayExpansions.ts",
];

const failures: string[] = [];

function check(condition: unknown, message: string): asserts condition {
  if (!condition) failures.push(message);
}

function cardKey(card: string, language: AppLanguage): string {
  return card.trim().normalize("NFC").toLocaleLowerCase(language);
}

for (const language of LANGUAGES) {
  const categories = getCharacterCategories(language);
  const ids = categories.map(category => category.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  check(
    duplicateIds.length === 0,
    `${language}: duplicate category IDs: ${duplicateIds.join(", ")}`
  );

  const allCategory = categories.find(category => category.id === "all");
  check(Boolean(allCategory), `${language}: missing virtual all category`);
  check(
    allCategory?.characters.length === 0,
    `${language}: virtual all category must not duplicate cards`
  );
  check(
    !ids.includes("character-archetypes"),
    `${language}: generated character-archetypes category is registered`
  );

  for (const category of categories.filter(item => item.id !== "all")) {
    const keys = category.characters.map(card => cardKey(card, language));
    const uniqueKeys = new Set(keys);
    check(
      uniqueKeys.size >= MINIMUM_CARDS,
      `${language}/${category.id}: ${uniqueKeys.size} unique cards; minimum is ${MINIMUM_CARDS}`
    );
    check(
      uniqueKeys.size === keys.length,
      `${language}/${category.id}: contains ${keys.length - uniqueKeys.size} case-insensitive duplicate(s)`
    );

    category.characters.forEach((card, index) => {
      check(
        card === card.trim() && card.length > 0,
        `${language}/${category.id}[${index}]: blank or untrimmed card`
      );
      check(
        card.length <= 80,
        `${language}/${category.id}[${index}]: card exceeds 80 characters: ${card}`
      );
      check(
        card.trim().split(/\s+/u).length <= 12,
        `${language}/${category.id}[${index}]: card exceeds 12 words: ${card}`
      );
    });
  }

  for (const [id, expectedCount] of Object.entries(
    EXPECTED_NEW_CATEGORY_COUNTS
  )) {
    const category = categories.find(item => item.id === id);
    check(Boolean(category), `${language}: missing new category ${id}`);
    check(
      category?.characters.length === expectedCount,
      `${language}/${id}: expected exactly ${expectedCount} cards, got ${category?.characters.length ?? 0}`
    );
  }
}

const charactersSource = readFileSync(
  resolve(process.cwd(), "client/src/data/characters.ts"),
  "utf8"
);
check(
  !charactersSource.includes("GENERATED_CHARACTER_CARDS"),
  "characters.ts must not import or register GENERATED_CHARACTER_CARDS"
);
check(
  !charactersSource.includes('id: "character-archetypes"'),
  "characters.ts must not register character-archetypes"
);

const generatedContentPattern =
  /Math\.random|Array\.from|\.flatMap\s*\(|`\s*\$\{/u;
for (const relativePath of CURATED_DATA_FILES) {
  const source = readFileSync(resolve(process.cwd(), relativePath), "utf8");
  check(
    !generatedContentPattern.test(source),
    `${relativePath}: curated card modules must contain explicit literal entries, not generated content`
  );
}

if (failures.length > 0) {
  console.error(
    `Hádaj kto som validation failed (${failures.length} issue(s)):`
  );
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(
    `Hádaj kto som validation passed for ${LANGUAGES.length} languages: every category has at least ${MINIMUM_CARDS} unique, hand-curated cards.`
  );
}
