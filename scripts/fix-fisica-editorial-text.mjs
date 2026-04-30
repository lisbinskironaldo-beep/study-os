import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const banksRoot = path.join(repoRoot, "questions", "banks");

const replacements = [
  ["Fisica", "F\u00edsica"],
  ["fisica", "f\u00edsica"],
  ["Interpretacao", "Interpreta\u00e7\u00e3o"],
  ["interpretacao", "interpreta\u00e7\u00e3o"],
  ["Formacao", "Forma\u00e7\u00e3o"],
  ["formacao", "forma\u00e7\u00e3o"],
  ["Nao", "N\u00e3o"],
  ["NAO", "N\u00c3O"],
  ["nao", "n\u00e3o"],
  ["Relacoes", "Rela\u00e7\u00f5es"],
  ["relacoes", "rela\u00e7\u00f5es"],
  ["Sao", "S\u00e3o"],
  ["sao", "s\u00e3o"],
  ["Graficos", "Gr\u00e1ficos"],
  ["graficos", "gr\u00e1ficos"],
  ["Grafico", "Gr\u00e1fico"],
  ["grafico", "gr\u00e1fico"],
  ["Habitos", "H\u00e1bitos"],
  ["habitos", "h\u00e1bitos"],
  ["Habito", "H\u00e1bito"],
  ["habito", "h\u00e1bito"],
  ["Acao", "A\u00e7\u00e3o"],
  ["acao", "a\u00e7\u00e3o"],
  ["Possivel", "Poss\u00edvel"],
  ["possivel", "poss\u00edvel"],
  ["Possiveis", "Poss\u00edveis"],
  ["possiveis", "poss\u00edveis"],
  ["Funcoes", "Fun\u00e7\u00f5es"],
  ["funcoes", "fun\u00e7\u00f5es"],
  ["Distancia", "Dist\u00e2ncia"],
  ["distancia", "dist\u00e2ncia"],
  ["Distancias", "Dist\u00e2ncias"],
  ["distancias", "dist\u00e2ncias"],
  ["Domestico", "Dom\u00e9stico"],
  ["domestico", "dom\u00e9stico"],
  ["Domesticos", "Dom\u00e9sticos"],
  ["domesticos", "dom\u00e9sticos"],
  ["Laboratorio", "Laborat\u00f3rio"],
  ["laboratorio", "laborat\u00f3rio"],
  ["Observacao", "Observa\u00e7\u00e3o"],
  ["observacao", "observa\u00e7\u00e3o"],
  ["Oscilacao", "Oscila\u00e7\u00e3o"],
  ["oscilacao", "oscila\u00e7\u00e3o"],
  ["Oscilacoes", "Oscila\u00e7\u00f5es"],
  ["oscilacoes", "oscila\u00e7\u00f5es"],
  ["Propagacao", "Propaga\u00e7\u00e3o"],
  ["propagacao", "propaga\u00e7\u00e3o"],
  ["Visivel", "Vis\u00edvel"],
  ["visivel", "vis\u00edvel"],
  ["Visiveis", "Vis\u00edveis"],
  ["visiveis", "vis\u00edveis"],
  ["Variacao", "Varia\u00e7\u00e3o"],
  ["variacao", "varia\u00e7\u00e3o"]
];

const literalRegex = /(["'`])((?:\\[\s\S]|(?!\1)[\s\S])*?)\1/g;

function walkPhysicsFiles() {
  const files = [];
  for (const serie of ["1-serie", "2-serie", "3-serie"]) {
    const dir = path.join(banksRoot, serie, "fisica");
    if (!fs.existsSync(dir)) continue;
    const stack = [dir];
    while (stack.length) {
      const current = stack.pop();
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const fullPath = path.join(current, entry.name);
        if (entry.isDirectory()) stack.push(fullPath);
        if (entry.isFile() && entry.name === "index.js") files.push(fullPath);
      }
    }
  }
  return files.sort();
}

function isTechnicalString(value) {
  if (!value.trim()) return true;
  if (/^[a-z0-9_/-]+$/i.test(value) && !/[A-Z]/.test(value)) return true;
  if (/^[a-z0-9_-]+(?:\.[a-z0-9_-]+)+$/i.test(value)) return true;
  if (value.includes("../") || value.includes("./")) return true;
  return false;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fixText(value) {
  if (isTechnicalString(value)) return value;
  let output = value;
  for (const [from, to] of replacements) {
    output = output.replace(new RegExp(`\\b${escapeRegex(from)}\\b`, "g"), to);
  }

  return output
    .replace(/\bQual alternativa N\u00e3o\b/g, "Qual alternativa N\u00c3O")
    .replace(/\bN\u00c3O esta\b/g, "N\u00c3O est\u00e1")
    .replace(/\bN\u00e3o esta\b/g, "N\u00c3O est\u00e1")
    .replace(/\besta compat\u00edvel\b/gi, (match) => match.replace(/\besta\b/i, "est\u00e1"))
    .replace(/\be poss\u00edvel\b/g, "\u00e9 poss\u00edvel")
    .replace(/\bE poss\u00edvel\b/g, "\u00c9 poss\u00edvel")
    .replace(/\be:\s*$/g, "\u00e9:")
    .replace(/\be:$/g, "\u00e9:")
    .replace(/\bmais adequada e:/g, "mais adequada \u00e9:")
    .replace(/\bmais correta e:/g, "mais correta \u00e9:")
    .replace(/\bgrandeza f\u00edsica\b/g, "grandeza f\u00edsica")
    .replace(/\bleitura f\u00edsica\b/g, "leitura f\u00edsica");
}

function replaceLiterals(source) {
  return source.replace(literalRegex, (match, quote, inner) => {
    const fixed = fixText(inner);
    if (fixed === inner) return match;
    return `${quote}${fixed}${quote}`;
  });
}

let changed = 0;
for (const file of walkPhysicsFiles()) {
  const source = fs.readFileSync(file, "utf8");
  const fixed = replaceLiterals(source);
  if (fixed !== source) {
    fs.writeFileSync(file, fixed, "utf8");
    changed += 1;
    console.log(`Corrigido: ${path.relative(repoRoot, file)}`);
  }
}

console.log(`Arquivos alterados: ${changed}`);
