import { readFile } from "node:fs/promises";
import path from "node:path";

const cards = JSON.parse(await readFile(path.resolve("client/src/data/onlyLies.json"), "utf8"));
const shuffled = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const next = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[next]] = [copy[next], copy[index]];
  }
  return copy;
};

function draw(state) {
  const available = cards.filter((card) => !state.used.has(card.id));
  const cycleReset = available.length === 0;
  const pool = cycleReset ? cards : available;
  if (cycleReset) state.used = new Set();
  const firstChoices = pool.length > 1 && state.lastId ? pool.filter((card) => card.id !== state.lastId) : pool;
  const card = shuffled(firstChoices)[0];
  state.used.add(card.id);
  state.lastId = card.id;
  return { card, cycleReset };
}

const state = { used: new Set(), lastId: null };
const errors = [];
for (let cycle = 0; cycle < 21; cycle += 1) {
  const seen = new Set();
  for (let index = 0; index < cards.length; index += 1) {
    const previous = state.lastId;
    const result = draw(state);
    if (cycle > 0 && index === 0 && !result.cycleReset) errors.push(`Cyklus ${cycle + 1} sa po vyčerpaní zásoby neresetoval.`);
    if (seen.has(result.card.id)) errors.push(`Cyklus ${cycle + 1} obsahuje opakovanú otázku.`);
    if (result.card.id === previous) errors.push(`Cyklus ${cycle + 1} má bezprostredné opakovanie.`);
    seen.add(result.card.id);
  }
}

const report = { cards: cards.length, simulatedCycles: 21, errors, status: errors.length ? "FAILED" : "PASSED" };
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
