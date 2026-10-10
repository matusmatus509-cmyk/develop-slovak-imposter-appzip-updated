// Vytiahne zo skutočných runtime modulov všetky texty herného obsahu, ktoré
// potrebujú anglický preklad, a zapíše ich po dávkach do pracovného priečinka.
//
//   npx tsx scripts/i18n/extract-content.ts <výstupný-priečinok> [--missing]
//
// S --missing vypíše len položky, ktoré ešte v anglických mapách chýbajú.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { CATEGORIES } from "../../client/src/data/categories";
import { DRAWING_CATEGORIES } from "../../client/src/data/drawingCategories";
import { EMOJI_CATEGORIES } from "../../client/src/data/emojiCategories";
import { PANTOMIMA_WORDS_BY_DIFFICULTY } from "../../client/src/data/teamBattle";
import { PING_PONG_PROMPTS } from "../../client/src/data/pingPongPrompts";
import { LETTER_CHALLENGES, FIVE_IN_TEN_PROMPTS, SOUND_CLUES } from "../../client/src/data/teamBattleExtras";
import { QUIZ_DUEL_QUESTIONS } from "../../client/src/data/quizDuel";
import { ONLY_LIES_CARDS } from "../../client/src/data/localizedOnlyLies";
import tabooCardsSk from "../../client/src/data/tabooCardsSk.json";

const out = process.argv[2];
const onlyMissing = process.argv.includes("--missing");
if (!out) throw new Error("Usage: extract-content.ts <outDir> [--missing]");
mkdirSync(out, { recursive: true });

const root = new URL("../../client/src/i18n/", import.meta.url);
const dict = JSON.parse(readFileSync(new URL("translations.en.json", root), "utf8")) as Record<string, string>;
const map = (name: string) => JSON.parse(readFileSync(new URL(`content/en/${name}.json`, root), "utf8")) as Record<string, unknown>;
const hint = (text: string) => (dict[text] && dict[text] !== text ? dict[text] : undefined);

function write(domain: string, items: unknown[], size: number) {
  const chunks = Math.ceil(items.length / size);
  for (let i = 0; i < chunks; i += 1) {
    writeFileSync(join(out, `${domain}.${String(i + 1).padStart(2, "0")}.src.json`), JSON.stringify(items.slice(i * size, (i + 1) * size), null, 1));
  }
  console.log(`${domain}: ${items.length} items, ${chunks} chunks`);
}

// Impostor — pár slovo|nápoveda, s kategóriou ako kontextom.
{
  const existing = map("impostor");
  const seen = new Set<string>();
  const items: unknown[] = [];
  for (const category of CATEGORIES) {
    const catKey = `cat:${category.id}`;
    if (!seen.has(catKey) && !(onlyMissing && catKey in existing)) items.push({ key: catKey, sk: category.name, en_hint: hint(category.name) });
    seen.add(catKey);
    for (const pair of category.wordPairs) {
      const key = `${pair.word}|${pair.hint}`;
      if (seen.has(key) || (onlyMissing && key in existing)) continue;
      seen.add(key);
      items.push({ key, category: category.name, word: pair.word, hint: pair.hint, en_hint: [hint(pair.word), hint(pair.hint)] });
    }
  }
  write("impostor", items, 400);
}

// Kreslenie — slová (nápoveda je vždy prázdna). Scény = predmet + pohľad, prekladá sa len predmet.
{
  const existing = map("drawing");
  const seen = new Set<string>();
  const items: unknown[] = [];
  const views = /^(.*) (zblízka|z profilu|spredu|v jednoduchých tvaroch)$/;
  for (const category of DRAWING_CATEGORIES) {
    const catKey = `cat:${category.id}`;
    if (!(onlyMissing && catKey in existing)) items.push({ key: catKey, sk: category.name, en_hint: hint(category.name) });
    for (const pair of category.wordPairs) {
      let key = pair.word;
      if (category.id === "draw-scenes") {
        const match = pair.word.match(views);
        if (match) key = `subject:${match[1]}`;
      }
      if (seen.has(key) || (onlyMissing && key in existing)) continue;
      seen.add(key);
      items.push({ key, category: category.name, sk: key.replace(/^subject:/, ""), en_hint: hint(pair.word) });
    }
  }
  write("drawing", items, 500);
}

// Emoji — odpovede + názvy kategórií.
{
  const existing = map("emoji");
  const items: unknown[] = [];
  const seen = new Set<string>();
  for (const category of EMOJI_CATEGORIES) {
    const catKey = `cat:${category.id}`;
    if (!(onlyMissing && catKey in existing)) items.push({ key: catKey, sk: category.title });
    for (const puzzle of category.puzzles) {
      if (seen.has(puzzle.answer) || (onlyMissing && puzzle.answer in existing)) continue;
      seen.add(puzzle.answer);
      items.push({ key: puzzle.answer, category: category.title, emoji: puzzle.emoji, en_hint: hint(puzzle.answer) });
    }
  }
  write("emoji", items, 300);
}

function simpleList(domain: string, list: readonly string[], size: number) {
  const existing = map(domain);
  const items = [...new Set(list)].filter((text) => !(onlyMissing && text in existing)).map((text) => ({ key: text, en_hint: hint(text) }));
  write(domain, items, size);
}

simpleList("pantomime", Object.values(PANTOMIMA_WORDS_BY_DIFFICULTY).flat(), 400);
simpleList("pingpong", PING_PONG_PROMPTS, 500);
simpleList("letter", LETTER_CHALLENGES.map((item) => item.category), 500);
simpleList("fiveInTen", FIVE_IN_TEN_PROMPTS, 300);

// Zvuky — podľa id.
{
  const existing = map("sound");
  const items = SOUND_CLUES.filter((clue) => !(onlyMissing && clue.id in existing)).map((clue) => ({
    id: clue.id,
    label: clue.label,
    category: clue.category,
    acceptedAnswers: clue.acceptedAnswers,
    emoji: clue.emoji,
  }));
  write("sound", items, 150);
}

// Kvízový duel — podľa id; `source` sa neprekladá.
{
  const existing = map("quiz");
  const items = QUIZ_DUEL_QUESTIONS.filter((question) => !(onlyMissing && question.id in existing)).map((question) => {
    const base: Record<string, unknown> = { id: question.id, kind: question.kind, prompt: question.prompt, fact: question.fact };
    if (question.kind === "classic") {
      base.options = question.options;
      base.correctIndex = question.correctIndex;
    } else {
      base.value = question.value;
      base.unit = question.unit;
      base.display = question.display;
      if (question.kind === "higher-lower") {
        base.claim = question.claim;
        base.claimDisplay = question.claimDisplay;
      }
    }
    return base;
  });
  write("quiz", items, 100);
}

// Iba nepravda — dopĺňa sa priamo do onlyLies.json (translations.en).
write(
  "onlyLies",
  ONLY_LIES_CARDS.filter((card) => !(onlyMissing && card.translations.en)).map((card) => ({ id: card.id, category: card.category, sk: card.translations.sk })),
  250,
);

// Zakázané slovo — kategórie bez anglického súboru.
{
  const covered = new Set(["Jedlo a nápoje", "Zvieratá", "Miesta a cestovanie", "Ľudia a povolania", "Predmety a domácnosť"]);
  const byCategory = new Map<string, unknown[]>();
  for (const card of tabooCardsSk.cards) {
    if (covered.has(card.category)) continue;
    byCategory.set(card.category, [...(byCategory.get(card.category) ?? []), card]);
  }
  for (const [category, cards] of byCategory) {
    const slug = category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
    write(`taboo-${slug}`, cards, 150);
  }
}
