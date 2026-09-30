// Vytiahne zo zdrojákov všetky slovenské texty rozhrania (JSX text, reťazce,
// šablóny) a porovná ich s anglickým slovníkom.
//
//   node scripts/i18n/extract-ui-strings.cjs [--json out.json]
//
// Herný obsah (slová, otázky…) sa prekladá v dátovej vrstve (client/src/i18n/content),
// preto sa veľké obsahové súbory preskakujú.
const ts = require("typescript");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../../client/src");
const SKIP = [
  /\.test\.tsx?$/,
  /^i18n\//,
  /^data\/(categories|drawingCategories|emojiCategories|expandedContent|pantomime\.sk|pingPongPrompts|prompts|charades|characters|songSelection|localized\w+|world\w+|movie\w+|marvel\w+|series\w+|animated\w+|guessWho\w+|impostor\w+|teamBattleExtras)\.ts$/,
  /^data\/(quizDuel|songExpansions)\//,
];
const SLOVAK = /[áäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ]|(?<![\p{L}])(?:hra|hry|hru|hier|kolo|kolá|tím|tímy|hráč\p{L}*|body|bodov|nastavenia|spustiť|pokracovat|hotovo|zavrieť|pravda|vyber\p{L}*|slovo|slová|otázk\p{L}*|kategóri\p{L}*|tipni|vymenuj|nikdy|radšej|zadaj|pridaj|ulož\p{L}*|zmaž\p{L}*|odohraj|novú|nová|nový|alebo|zvuk\p{L}*|kto|kde|prečo|sekúnd|minút|späť|ďalej|ďalšie|štart|koniec|vyhral\p{L}*|remíza)(?![\p{L}])/iu;

const results = new Map();
// Voliteľný anglický zoznam slov: odhalí aj slovenské texty bez diakritiky („Pre znalcov").
const wordListPath = process.env.I18N_WORDLIST;
const englishWords = wordListPath ? new Set(fs.readFileSync(wordListPath, "utf8").split(/\r?\n/).map((w) => w.trim().toLowerCase())) : null;
function looksSlovakWithoutDiacritics(core, kind) {
  if (!englishWords || !/[a-z]{2}/i.test(core)) return false;
  if (kind !== "jsx" && !/\s/.test(core.replace(/\{\d+\}/g, ""))) return false;
  if (/^[a-z0-9_.:/#-]+$/i.test(core) || /[<>{}=;()]/.test(core.replace(/\{\d+\}/g, ""))) return false;
  const words = core.replace(/\{\d+\}/g, " ").match(/[A-Za-z]{2,}/g) ?? [];
  if (!words.length) return false;
  const foreign = words.filter((w) => !englishWords.has(w.toLowerCase()));
  return foreign.length >= 1 && foreign.length / words.length >= 0.4;
}
function add(text, file, kind) {
  const core = text.replace(/\s+/g, " ").trim();
  if (!core || core.length < 2) return;
  if (!SLOVAK.test(core) && !looksSlovakWithoutDiacritics(core, kind)) return;
  if (kind === "template" && !/\p{L}{2,}/u.test(core.replace(/\{\d+\}/g, ""))) return;
  if (/^[\w.-]+\.(png|jpg|svg|mp3|json)$/i.test(core)) return;
  const entry = results.get(core) ?? { text: core, files: new Set(), kinds: new Set() };
  entry.files.add(file);
  entry.kinds.add(kind);
  results.set(core, entry);
}

function isClassNameLike(node) {
  const parent = node.parent;
  if (parent && ts.isJsxAttribute(parent)) return /^(className|style|key|type|id|href|src|data-)/.test(parent.name.getText());
  if (parent && ts.isPropertyAssignment(parent)) return /^(className|id|key|color|swatch|accent|icon|screen|value|kind|type)$/.test(parent.name.getText());
  return false;
}

/** Vetvy `a ? "x" : "y"` zo samých reťazcov (aj vnorené) → zoznam variantov, inak null. */
function literalVariants(expr) {
  while (ts.isParenthesizedExpression(expr)) expr = expr.expression;
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return [expr.text];
  if (ts.isConditionalExpression(expr)) {
    const a = literalVariants(expr.whenTrue);
    const b = literalVariants(expr.whenFalse);
    return a && b ? [...a, ...b] : null;
  }
  return null;
}

/**
 * Šablóna → varianty. Podmienené slovenské tvary („bod/body/bodov") sa
 * rozvinú do samostatných viet, ostatné premenné sa stanú {0}, {1}…
 */
function templateToPatterns(node) {
  if (ts.isNoSubstitutionTemplateLiteral(node)) return [node.text];
  let variants = [{ text: node.head.text, slots: 0 }];
  for (const span of node.templateSpans) {
    const options = literalVariants(span.expression);
    const next = [];
    for (const variant of variants) {
      if (options) for (const option of options) next.push({ text: variant.text + option + span.literal.text, slots: variant.slots });
      else next.push({ text: `${variant.text}{${variant.slots}}${span.literal.text}`, slots: variant.slots + 1 });
    }
    variants = next.slice(0, 32);
  }
  return variants.map((variant) => variant.text);
}

function walk(file) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  if (SKIP.some((re) => re.test(rel))) return;
  const source = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = (node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (ts.isJsxText(node)) add(node.text, rel, "jsx");
    else if (ts.isStringLiteral(node) && !isClassNameLike(node)) add(node.text, rel, "string");
    else if ((ts.isTemplateExpression(node) || ts.isNoSubstitutionTemplateLiteral(node)) && !isClassNameLike(node)) {
      for (const pattern of templateToPatterns(node)) add(pattern, rel, pattern.includes("{0}") ? "template" : "string");
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return files(full);
    return /\.(tsx?)$/.test(entry.name) ? [full] : [];
  });
}
files(root).forEach(walk);

const dictionary = JSON.parse(fs.readFileSync(path.join(root, "i18n/translations.en.json"), "utf8"));
const patterns = JSON.parse(fs.readFileSync(path.join(root, "i18n/translations.en.patterns.json"), "utf8"));
const rows = [...results.values()].map((entry) => {
  const isTemplate = entry.kinds.has("template");
  const en = isTemplate ? patterns[entry.text] : dictionary[entry.text];
  const status = en === undefined ? "missing" : en === entry.text ? "identical" : /[äčďĺľňôŕšťž]/i.test(en) ? "slovak-in-en" : "ok";
  return { text: entry.text, en, status, template: isTemplate, files: [...entry.files].slice(0, 3) };
});
const summary = rows.reduce((acc, row) => ((acc[row.status] = (acc[row.status] ?? 0) + 1), acc), {});
console.log("UI strings:", rows.length, summary);
const outIndex = process.argv.indexOf("--json");
if (outIndex > 0) fs.writeFileSync(process.argv[outIndex + 1], JSON.stringify(rows, null, 1));
if (process.argv.includes("--strict") && rows.some((row) => row.status !== "ok")) process.exit(1);
