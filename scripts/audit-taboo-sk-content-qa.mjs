import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(".");
const dataPath = path.join(root, "client/src/data/tabooCardsSk.json");
const outputPath = path.join(root, "taboo-sk-content-qa-pass1.json");
const model = process.env.TABOO_CONTENT_QA_MODEL ?? "gpt-5-mini";
const batchSize = Number(process.env.TABOO_CONTENT_QA_BATCH_SIZE ?? 25);
const maxBatches = Number(process.env.TABOO_CONTENT_QA_MAX_BATCHES ?? Number.POSITIVE_INFINITY);

const data = JSON.parse(await readFile(dataPath, "utf8"));
let output = { model, cardsAudited: data.cards.length, evaluations: [] };
try {
  output = JSON.parse(await readFile(outputPath, "utf8"));
} catch {
  // The first run creates the audit file after the first successfully parsed batch.
}

const seen = new Set(output.evaluations.map((evaluation) => evaluation.id));
const pending = data.cards.filter((card) => !seen.has(card.id));

const schema = {
  type: "object",
  properties: {
    evaluations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          decision: { type: "string", enum: ["KEEP", "REPLACE"] },
          concern: {
            type: "string",
            enum: ["NONE", "ARTIFICIAL_COLLOCATION", "OVERLY_SPECIALIZED", "TOO_TECHNICAL", "ADMINISTRATIVE", "RARE_OR_ARCHAIC", "UNPLAYABLE"],
          },
          justification: { type: "string" },
        },
        required: ["id", "decision", "concern", "justification"],
        additionalProperties: false,
      },
    },
  },
  required: ["evaluations"],
  additionalProperties: false,
};

const systemPrompt = `Si prísny slovenský editor obsahu party hry Zakázané slovo. Hodnotíš každú kartu z pohľadu priemerného dospelého hráča na Slovensku. Cieľ musí byť prirodzené, bežné a dostatočne konkrétne slovenské slovo alebo ustálený bežný pojem, ktorý je zábavné vysvetľovať. Uprednostni rozhodnutie KEEP: neoznačuj dobrý cieľ iba preto, že je viacslovný alebo moderný. Označ REPLACE len vtedy, ak je cieľ neprirodzené AI-spojenie, umelo vytvorený viacslovný výraz, neprimerane odborný, administratívny, veľmi zriedkavý, príliš špecifický alebo nie je hrateľný. Každý zoznam obsahuje aktuálne štyri zakázané slová; nehodnoť ich samostatne, ale použi ich len na odhad, či je cieľ reálne vysvetliteľný. Odpovedaj výlučne platným JSON podľa schémy.`;

async function requestAudit(cards) {
  const userPrompt = `Posúď nasledujúce karty. Pri každej vráť presne jedno hodnotenie so zhodným id. Pri KEEP nastav concern na NONE.\n\n${JSON.stringify(cards.map((card) => ({
    id: card.id,
    category: card.category,
    word: card.word,
    forbidden: card.forbidden,
  })))}`;
  const response = await fetch(`${process.env.OPENAI_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_schema", json_schema: { name: "taboo_content_audit", strict: true, schema } },
      max_completion_tokens: 7000,
      reasoning: { effort: "low" },
    }),
  });
  if (!response.ok) throw new Error(`Audit API ${response.status}: ${await response.text()}`);
  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error(`Audit API vrátil prázdny obsah: ${JSON.stringify(json)}`);
  const parsed = JSON.parse(content);
  const expectedIds = new Set(cards.map((card) => card.id));
  if (parsed.evaluations.length !== cards.length || parsed.evaluations.some((evaluation) => !expectedIds.has(evaluation.id))) {
    throw new Error("Auditná dávka nemá presne jedno platné hodnotenie ku každej karte.");
  }
  return parsed.evaluations;
}

let processedBatches = 0;
for (let start = 0; start < pending.length && processedBatches < maxBatches; start += batchSize) {
  const batch = pending.slice(start, start + batchSize);
  const evaluations = await requestAudit(batch);
  output.evaluations.push(...evaluations);
  output = {
    ...output,
    model,
    cardsAudited: data.cards.length,
    evaluations: output.evaluations.sort((a, b) => a.id.localeCompare(b.id)),
  };
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  processedBatches += 1;
  const replaceCount = output.evaluations.filter((evaluation) => evaluation.decision === "REPLACE").length;
  console.log(`Uložené hodnotenie: ${output.evaluations.length}/${data.cards.length}; kandidáti na náhradu: ${replaceCount}.`);
}

console.log(JSON.stringify({
  audited: output.evaluations.length,
  pending: data.cards.length - output.evaluations.length,
  replaceCandidates: output.evaluations.filter((evaluation) => evaluation.decision === "REPLACE").length,
}, null, 2));
