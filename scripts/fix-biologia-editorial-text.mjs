import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const banksRoot = path.join(repoRoot, "questions", "banks");

const replacements = [
  ["Quimica", "Qu\u00edmica"],
  ["quimica", "qu\u00edmica"],
  ["Producao", "Produ\u00e7\u00e3o"],
  ["producao", "produ\u00e7\u00e3o"],
  ["Interpretacao", "Interpreta\u00e7\u00e3o"],
  ["interpretacao", "interpreta\u00e7\u00e3o"],
  ["Celula", "C\u00e9lula"],
  ["celula", "c\u00e9lula"],
  ["Celulas", "C\u00e9lulas"],
  ["celulas", "c\u00e9lulas"],
  ["Formacao", "Forma\u00e7\u00e3o"],
  ["formacao", "forma\u00e7\u00e3o"],
  ["Relacao", "Rela\u00e7\u00e3o"],
  ["relacao", "rela\u00e7\u00e3o"],
  ["Relacoes", "Rela\u00e7\u00f5es"],
  ["relacoes", "rela\u00e7\u00f5es"],
  ["Analise", "An\u00e1lise"],
  ["analise", "an\u00e1lise"],
  ["Equilibrio", "Equil\u00edbrio"],
  ["equilibrio", "equil\u00edbrio"],
  ["Funcao", "Fun\u00e7\u00e3o"],
  ["funcao", "fun\u00e7\u00e3o"],
  ["Funcoes", "Fun\u00e7\u00f5es"],
  ["funcoes", "fun\u00e7\u00f5es"],
  ["Caracteristicas", "Caracter\u00edsticas"],
  ["caracteristicas", "caracter\u00edsticas"],
  ["Tecnicas", "T\u00e9cnicas"],
  ["tecnicas", "t\u00e9cnicas"],
  ["Tecnica", "T\u00e9cnica"],
  ["tecnica", "t\u00e9cnica"],
  ["Laboratorio", "Laborat\u00f3rio"],
  ["laboratorio", "laborat\u00f3rio"],
  ["Numero", "N\u00famero"],
  ["numero", "n\u00famero"],
  ["Numeros", "N\u00fameros"],
  ["numeros", "n\u00fameros"],
  ["Situacoes", "Situa\u00e7\u00f5es"],
  ["situacoes", "situa\u00e7\u00f5es"],
  ["Situacao", "Situa\u00e7\u00e3o"],
  ["situacao", "situa\u00e7\u00e3o"],
  ["Observacao", "Observa\u00e7\u00e3o"],
  ["observacao", "observa\u00e7\u00e3o"],
  ["Possiveis", "Poss\u00edveis"],
  ["possiveis", "poss\u00edveis"],
  ["Possivel", "Poss\u00edvel"],
  ["possivel", "poss\u00edvel"],
  ["Consequencia", "Consequ\u00eancia"],
  ["consequencia", "consequ\u00eancia"],
  ["Consequencias", "Consequ\u00eancias"],
  ["consequencias", "consequ\u00eancias"],
  ["Graficos", "Gr\u00e1ficos"],
  ["graficos", "gr\u00e1ficos"],
  ["Grafico", "Gr\u00e1fico"],
  ["grafico", "gr\u00e1fico"],
  ["Avaliacao", "Avalia\u00e7\u00e3o"],
  ["avaliacao", "avalia\u00e7\u00e3o"],
  ["Acao", "A\u00e7\u00e3o"],
  ["acao", "a\u00e7\u00e3o"],
  ["Acoes", "A\u00e7\u00f5es"],
  ["acoes", "a\u00e7\u00f5es"],
  ["Historia", "Hist\u00f3ria"],
  ["historia", "hist\u00f3ria"],
  ["Fisica", "F\u00edsica"],
  ["fisica", "f\u00edsica"],
  ["Carater", "Car\u00e1ter"],
  ["carater", "car\u00e1ter"],
  ["Media", "M\u00e9dia"],
  ["media", "m\u00e9dia"],
  ["Educacao", "Educa\u00e7\u00e3o"],
  ["educacao", "educa\u00e7\u00e3o"],
  ["Criterio", "Crit\u00e9rio"],
  ["criterio", "crit\u00e9rio"],
  ["Reflexao", "Reflex\u00e3o"],
  ["reflexao", "reflex\u00e3o"],
  ["Raciocinio", "Racioc\u00ednio"],
  ["raciocinio", "racioc\u00ednio"],
  ["Reposicao", "Reposi\u00e7\u00e3o"],
  ["reposicao", "reposi\u00e7\u00e3o"],
  ["Filosofica", "Filos\u00f3fica"],
  ["filosofica", "filos\u00f3fica"],
  ["Contem", "Cont\u00e9m"],
  ["contem", "cont\u00e9m"],
  ["Visivel", "Vis\u00edvel"],
  ["visivel", "vis\u00edvel"],
  ["Visiveis", "Vis\u00edveis"],
  ["visiveis", "vis\u00edveis"],
  ["Matematica", "Matem\u00e1tica"],
  ["matematica", "matem\u00e1tica"],
  ["Decisoes", "Decis\u00f5es"],
  ["decisoes", "decis\u00f5es"],
  ["Variacao", "Varia\u00e7\u00e3o"],
  ["variacao", "varia\u00e7\u00e3o"],
  ["Frequencia", "Frequ\u00eancia"],
  ["frequencia", "frequ\u00eancia"],
  ["Nao", "N\u00e3o"],
  ["NAO", "N\u00c3O"],
  ["nao", "n\u00e3o"],
  ["Sao", "S\u00e3o"],
  ["sao", "s\u00e3o"],
  ["Tambem", "Tamb\u00e9m"],
  ["tambem", "tamb\u00e9m"]
];

const literalRegex = /(["'`])((?:\\[\s\S]|(?!\1)[\s\S])*?)\1/g;

function walkBiologyFiles() {
  const files = [];
  for (const serie of ["1-serie", "2-serie", "3-serie"]) {
    const dir = path.join(banksRoot, serie, "biologia");
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
    .replace(/\be bem esterilizado\b/g, "\u00e9 bem esterilizado")
    .replace(/\be mantido\b/g, "\u00e9 mantido")
    .replace(/\bA interpreta\u00e7\u00e3o coerente .* e que\b/g, (match) => match.replace(/\se que\b/i, " \u00e9 que"))
    .replace(/\bMetabolismo celular e\b/g, "Metabolismo celular \u00e9")
    .replace(/\bO ATP e importante\b/g, "O ATP \u00e9 importante")
    .replace(/\bUma fun\u00e7\u00e3o importante .* e:/g, (match) => match.replace(/\se:$/i, " \u00e9:"))
    .replace(/\bA maior produ\u00e7\u00e3o .* ocorre\b/g, (match) => match)
    .replace(/\besse e\b/g, "esse \u00e9")
    .replace(/\bEssa e\b/g, "Essa \u00e9")
    .replace(/\bela e\b/g, "ela \u00e9")
    .replace(/\bele e\b/g, "ele \u00e9")
    .replace(/\bé essencial\b/g, "\u00e9 essencial")
    .replace(/\bQual alternativa N\u00e3O\b/g, "Qual alternativa N\u00c3O")
    .replace(/\bN\u00c3O representa\b/g, "N\u00c3O representa")
    .replace(/\bN\u00c3O est\u00e1\b/g, "N\u00c3O est\u00e1");
}

function replaceLiterals(source) {
  return source.replace(literalRegex, (match, quote, inner) => {
    const fixed = fixText(inner);
    if (fixed === inner) return match;
    return `${quote}${fixed}${quote}`;
  });
}

let changed = 0;
for (const file of walkBiologyFiles()) {
  const source = fs.readFileSync(file, "utf8");
  const fixed = replaceLiterals(source);
  if (fixed !== source) {
    fs.writeFileSync(file, fixed, "utf8");
    changed += 1;
    console.log(`Corrigido: ${path.relative(repoRoot, file)}`);
  }
}

console.log(`Arquivos alterados: ${changed}`);
