import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const execFileAsync = promisify(execFile);
const baselineRef = "9a688a8";
const dataPath = "client/src/data/tabooCardsSk.json";
const current = JSON.parse(await readFile(path.resolve(dataPath), "utf8"));
const { stdout } = await execFileAsync("git", ["show", `${baselineRef}:${dataPath}`]);
const baseline = JSON.parse(stdout);
const originalById = new Map(baseline.cards.map((card) => [card.id, card]));

const changes = [];
for (const card of current.cards) {
  const original = originalById.get(card.id);
  if (!original) throw new Error(`Chýba východisková karta ${card.id}.`);
  const targetChanged = card.word !== original.word;
  const forbiddenChanged = card.forbidden.some((word, index) => word !== original.forbidden[index]);
  if (targetChanged || forbiddenChanged) {
    changes.push({
      id: card.id,
      category: card.category,
      targetChanged,
      forbiddenChanged,
      before: original,
      after: card,
    });
  }
}

const summary = {
  baselineRef,
  cardsReviewed: current.cards.length,
  cardsCorrected: changes.length,
  targetWordsReplaced: changes.filter((change) => change.targetChanged).length,
  cardsWithForbiddenWordsCorrected: changes.filter((change) => change.forbiddenChanged).length,
  spellingOrOrthographyCorrections: changes.filter((change) => change.id === "taboo_sk_0899").length,
  confirmedSemanticDuplicatesRemoved: 0,
  changes,
};
await writeFile(path.resolve("taboo-sk-audit-summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  cardsReviewed: summary.cardsReviewed,
  cardsCorrected: summary.cardsCorrected,
  targetWordsReplaced: summary.targetWordsReplaced,
  cardsWithForbiddenWordsCorrected: summary.cardsWithForbiddenWordsCorrected,
  spellingOrOrthographyCorrections: summary.spellingOrOrthographyCorrections,
  confirmedSemanticDuplicatesRemoved: summary.confirmedSemanticDuplicatesRemoved,
}, null, 2));
