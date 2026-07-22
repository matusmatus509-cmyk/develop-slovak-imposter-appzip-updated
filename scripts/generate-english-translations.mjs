import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = path.resolve("src");
const output = path.join(root, "i18n", "translations.en.json");

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.tsx?$/.test(entry.name) && !entry.name.includes("vite-env") ? [full] : [];
  });
}

function ignoredContext(node) {
  if (ts.isImportDeclaration(node.parent) || ts.isExportDeclaration(node.parent)) return true;
  if (ts.isLiteralTypeNode(node.parent)) return true;
  if (ts.isPropertyAssignment(node.parent) && node.parent.name === node) return true;
  if (ts.isJsxAttribute(node.parent)) {
    const name = node.parent.name.getText();
    return name === "className" || name === "src" || name === "href" || name === "style";
  }
  return false;
}

function looksUserFacing(value) {
  const text = value.trim();
  if (text.length < 2 || text.length > 260) return false;
  if (/^(https?:|\.\/|\.\.\/|\/|#[0-9a-f]{3,8}$)/i.test(text)) return false;
  if (/\b(bg-|text-|rounded-|border-|flex|grid|px-|py-|mt-|mb-|gap-|from-|to-|opacity-|shadow-|translate-|scale-)/.test(text)) return false;
  if (!/\p{L}/u.test(text)) return false;
  return true;
}

function addFragments(set, raw) {
  for (const line of raw.split(/\r?\n/)) {
    const clean = line.trim();
    if (!clean) continue;
    const pieces = clean.includes("|") ? clean.split("|") : [clean];
    for (const piece of pieces) if (looksUserFacing(piece)) set.add(piece.trim());
  }
}

const phrases = new Set();
for (const file of walk(root)) {
  const sourceText = fs.readFileSync(file, "utf8");
  const source = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  function visit(node) {
    if (ts.isJsxText(node)) addFragments(phrases, node.getText(source));
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && !ignoredContext(node)) {
      const variable = node.parent?.parent;
      const variableName = ts.isVariableDeclaration(variable) && ts.isIdentifier(variable.name) ? variable.name.text : "";
      if (variableName !== "SONG_LIBRARY") addFragments(phrases, node.text);
    }
    if (ts.isTemplateExpression(node)) {
      addFragments(phrases, node.head.text);
      for (const span of node.templateSpans) addFragments(phrases, span.literal.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}

fs.mkdirSync(path.dirname(output), { recursive: true });
let translations = {};
if (fs.existsSync(output)) translations = JSON.parse(fs.readFileSync(output, "utf8"));
const pending = [...phrases].filter((phrase) => !translations[phrase]).sort((a, b) => a.localeCompare(b, "sk"));

function batches(items, maxChars = 2600) {
  const result = [];
  let batch = [];
  let length = 0;
  for (const item of items) {
    if (batch.length && length + item.length + 1 > maxChars) {
      result.push(batch);
      batch = [];
      length = 0;
    }
    batch.push(item);
    length += item.length + 1;
  }
  if (batch.length) result.push(batch);
  return result;
}

async function requestTranslation(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=sk&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url, { headers: { "User-Agent": "SlovakPartyApp translation build" } });
  if (!response.ok) throw new Error(`Translation request failed: ${response.status}`);
  const payload = await response.json();
  return payload[0].map((part) => part[0]).join("");
}

const groups = batches(pending);
for (let index = 0; index < groups.length; index++) {
  const group = groups[index];
  const joined = group.join("\n");
  let translated = await requestTranslation(joined);
  let lines = translated.split("\n");
  if (lines.length !== group.length) {
    lines = [];
    for (const phrase of group) {
      lines.push(await requestTranslation(phrase));
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
  }
  group.forEach((phrase, phraseIndex) => { translations[phrase] = lines[phraseIndex].trim(); });
  fs.writeFileSync(output, `${JSON.stringify(translations, null, 2)}\n`);
  process.stdout.write(`\rTranslated ${Math.min(index + 1, groups.length)}/${groups.length} batches`);
  await new Promise((resolve) => setTimeout(resolve, 220));
}

console.log(`\nSaved ${Object.keys(translations).length} translations to ${output}`);
