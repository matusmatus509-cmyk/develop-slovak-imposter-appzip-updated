import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const outputPath = path.resolve("client/src/data/tabooCardsSk.json");
const categories = [
  ["Jedlo a nápoje", "bežné jedlá, nápoje, suroviny a kuchynské situácie"],
  ["Zvieratá", "známe zvieratá, ich prostredie a správanie"],
  ["Ľudia a povolania", "povolania, známe roly, postavy a spoločenské roly"],
  ["Predmety a domácnosť", "každodenné predmety, oblečenie, domáce vybavenie a náradie"],
  ["Miesta a cestovanie", "miesta, doprava, cestovanie a orientácia"],
  ["Aktivity a šport", "činnosti, hry, športy a voľný čas"],
  ["Filmy, seriály a kultúra", "filmové, seriálové, knižné, hudobné a kultúrne pojmy známe slovenským hráčom"],
  ["Technológie a médiá", "digitálne služby, zariadenia, médiá a moderná komunikácia"],
  ["Príroda a svet", "počasie, krajina, vesmír, rastliny a prírodné javy"],
  ["Všeobecné pojmy a situácie", "emócie, spoločenské situácie, abstraktné a každodenné pojmy"],
];
const cardsPerCategory = 150;
const batchSize = Number(process.env.TABOO_BATCH_SIZE ?? 50);
const workers = Number(process.env.TABOO_WORKERS ?? 1);
const model = process.env.TABOO_MODEL ?? "gpt-5";
const baseUrl = (process.env.OPENAI_API_BASE ?? "").replace(/\/$/, "");
const apiKey = process.env.OPENAI_API_KEY ?? "";
if (!baseUrl || !apiKey) throw new Error("OPENAI_API_BASE and OPENAI_API_KEY must be configured.");

const cardSchema = {
  type: "object",
  properties: {
    word: { type: "string" },
    forbidden: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
  },
  required: ["word", "forbidden"],
  additionalProperties: false,
};
const responseFormat = {
  type: "json_schema",
  json_schema: {
    name: "slovak_taboo_cards",
    strict: true,
    schema: {
      type: "object",
      properties: { cards: { type: "array", items: cardSchema, minItems: batchSize, maxItems: batchSize } },
      required: ["cards"],
      additionalProperties: false,
    },
  },
};

function normalized(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("sk").replace(/[^a-z0-9]/g, "");
}

function clean(value) {
  return value.replace(/\s+/g, " ").trim();
}

function structurallyValid(card, usedWords) {
  const word = clean(card.word);
  const wordKey = normalized(word);
  const forbidden = card.forbidden.map(clean);
  const forbiddenKeys = forbidden.map(normalized);
  return Boolean(
    word.length >= 2 && word.length <= 56 &&
    !usedWords.has(wordKey) &&
    forbidden.length === 4 &&
    forbidden.every((item) => item.length >= 2 && item.length <= 56) &&
    new Set(forbiddenKeys).size === 4 &&
    !forbiddenKeys.includes(wordKey) &&
    !forbiddenKeys.some((item) => item.includes(wordKey) || wordKey.includes(item)),
  );
}

async function loadExisting() {
  try {
    const raw = JSON.parse(await readFile(outputPath, "utf8"));
    return Array.isArray(raw.cards) ? raw.cards : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function save(cards) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  const temp = `${outputPath}.tmp`;
  await writeFile(temp, `${JSON.stringify({ version: 1, locale: "sk", cards }, null, 2)}\n`, "utf8");
  await rename(temp, outputPath);
}

let saveQueue = Promise.resolve();
function queueSave(cards) {
  saveQueue = saveQueue.then(() => save(cards));
  return saveQueue;
}

async function generateBatch(category, scope, usedWords, attempt = 1) {
  const alreadyUsed = [...usedWords].slice(-220).join(", ");
  const prompt = [
    `Vytváraš presne ${batchSize} NOVÝCH kvalitných slovenských kariet pre spoločenskú hru Zakázané slovo.`,
    `Kategória: ${category}. Rozsah: ${scope}.`,
    "Každá karta má cieľové slovo a presne štyri zakázané slová. Všetky texty musia byť po slovensky, prirodzené, bežne zrozumiteľné, vhodné pre dospelých aj starších tínedžerov a s korektnou diakritikou.",
    "Zakázané slová musia byť prirodzene spojené s cieľom a musia sťažiť vysvetlenie. Nemajú to byť náhodné pojmy, čisté gramatické deriváty cieľa, presný cieľ, cieľ s príponou ani mechanicky podobné slovo.",
    "Nevytváraj synonymické alebo významovo takmer rovnaké cieľové slová. Nepouži odborné exotické pojmy, vulgárnosť, chránené názvy produktov ani neoveriteľné fakty.",
    "Vyhni sa už použitým cieľovým slovám: " + (alreadyUsed || "žiadne"),
    "Výsledok vráť len v požadovanom JSON formáte.",
  ].join("\n\n");
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        max_completion_tokens: 9000,
        reasoning: { effort: "minimal" },
        response_format: responseFormat,
        messages: [
          { role: "system", content: "Si skúsený slovenský editor spoločenských hier. Uprednostni prirodzené a hrateľné karty pred množstvom." },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!response.ok) throw new Error(`Generation API ${response.status}: ${await response.text()}`);
    const payload = await response.json();
    const choice = payload?.choices?.[0];
    const content = choice?.message?.content;
    if (!content) throw new Error(`Generation API returned no content: finish=${choice?.finish_reason ?? "unknown"}; payload=${JSON.stringify(payload).slice(0, 800)}`);
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed.cards) || parsed.cards.length !== batchSize) throw new Error("wrong card count");
    const local = new Set(usedWords);
    const accepted = [];
    for (const rawCard of parsed.cards) {
      if (!structurallyValid(rawCard, local)) continue;
      const card = { word: clean(rawCard.word), forbidden: rawCard.forbidden.map(clean) };
      local.add(normalized(card.word));
      accepted.push(card);
    }
    if (!accepted.length) throw new Error("no structurally valid cards");
    return accepted;
  } catch (error) {
    if (attempt >= 4) throw error;
    await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
    return generateBatch(category, scope, usedWords, attempt + 1);
  }
}

const cards = await loadExisting();
const usedWords = new Set(cards.map((card) => normalized(card.word)));
if (cards.some((card) => !categories.some(([category]) => category === card.category))) throw new Error("Existing file contains an unexpected category.");

let categoryCursor = 0;
async function buildCategory() {
  while (categoryCursor < categories.length) {
    const [category, scope] = categories[categoryCursor++];
    let categoryCards = cards.filter((card) => card.category === category);
    while (categoryCards.length < cardsPerCategory) {
      const generated = await generateBatch(category, scope, usedWords);
      const remaining = cardsPerCategory - categoryCards.length;
      const accepted = generated.slice(0, remaining).map((card) => ({
        id: `taboo_sk_${String(cards.length + 1).padStart(4, "0")}`,
        category,
        ...card,
      }));
      for (const card of accepted) usedWords.add(normalized(card.word));
      cards.push(...accepted);
      categoryCards.push(...accepted);
      await queueSave(cards);
      console.log(`${category}: ${categoryCards.length}/${cardsPerCategory} cards; total ${cards.length}/1500.`);
    }
  }
}
await Promise.all(Array.from({ length: Math.min(workers, categories.length) }, buildCategory));

if (cards.length !== 1500) throw new Error(`Expected exactly 1500 cards, received ${cards.length}.`);
await queueSave(cards);
console.log("Slovak taboo database generation completed.");
