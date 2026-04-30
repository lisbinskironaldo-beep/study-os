import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const banksRoot = path.join(repoRoot, "questions", "banks");

const replacements = [
  ["Matematica", "Matem\u00e1tica"],
  ["matematica", "matem\u00e1tica"],
  ["Funcao", "Fun\u00e7\u00e3o"],
  ["funcao", "fun\u00e7\u00e3o"],
  ["Funcoes", "Fun\u00e7\u00f5es"],
  ["funcoes", "fun\u00e7\u00f5es"],
  ["Interpretacao", "Interpreta\u00e7\u00e3o"],
  ["interpretacao", "interpreta\u00e7\u00e3o"],
  ["Analise", "An\u00e1lise"],
  ["analise", "an\u00e1lise"],
  ["Relacao", "Rela\u00e7\u00e3o"],
  ["relacao", "rela\u00e7\u00e3o"],
  ["Relacoes", "Rela\u00e7\u00f5es"],
  ["relacoes", "rela\u00e7\u00f5es"],
  ["Situacao", "Situa\u00e7\u00e3o"],
  ["situacao", "situa\u00e7\u00e3o"],
  ["Situacoes", "Situa\u00e7\u00f5es"],
  ["situacoes", "situa\u00e7\u00f5es"],
  ["Formacao", "Forma\u00e7\u00e3o"],
  ["formacao", "forma\u00e7\u00e3o"],
  ["Tecnicas", "T\u00e9cnicas"],
  ["tecnicas", "t\u00e9cnicas"],
  ["Fisica", "F\u00edsica"],
  ["fisica", "f\u00edsica"],
  ["Ingles", "Ingl\u00eas"],
  ["ingles", "ingl\u00eas"],
  ["Producao", "Produ\u00e7\u00e3o"],
  ["producao", "produ\u00e7\u00e3o"],
  ["Avaliacao", "Avalia\u00e7\u00e3o"],
  ["avaliacao", "avalia\u00e7\u00e3o"],
  ["Redacao", "Reda\u00e7\u00e3o"],
  ["redacao", "reda\u00e7\u00e3o"],
  ["Raciocinio", "Racioc\u00ednio"],
  ["raciocinio", "racioc\u00ednio"],
  ["Criterio", "Crit\u00e9rio"],
  ["criterio", "crit\u00e9rio"],
  ["Ciencias", "Ci\u00eancias"],
  ["ciencias", "ci\u00eancias"],
  ["Reflexao", "Reflex\u00e3o"],
  ["reflexao", "reflex\u00e3o"],
  ["Angulo", "\u00c2ngulo"],
  ["angulo", "\u00e2ngulo"],
  ["Angulos", "\u00c2ngulos"],
  ["angulos", "\u00e2ngulos"],
  ["Alguem", "Algu\u00e9m"],
  ["alguem", "algu\u00e9m"],
  ["Contem", "Cont\u00e9m"],
  ["contem", "cont\u00e9m"],
  ["Diferenca", "Diferen\u00e7a"],
  ["diferenca", "diferen\u00e7a"],
  ["Distribuicao", "Distribui\u00e7\u00e3o"],
  ["distribuicao", "distribui\u00e7\u00e3o"],
  ["Distancia", "Dist\u00e2ncia"],
  ["distancia", "dist\u00e2ncia"],
  ["Domestico", "Dom\u00e9stico"],
  ["domestico", "dom\u00e9stico"],
  ["Fabrica", "F\u00e1brica"],
  ["fabrica", "f\u00e1brica"],
  ["Frequencia", "Frequ\u00eancia"],
  ["frequencia", "frequ\u00eancia"],
  ["Funcionario", "Funcion\u00e1rio"],
  ["funcionario", "funcion\u00e1rio"],
  ["Funcionarios", "Funcion\u00e1rios"],
  ["funcionarios", "funcion\u00e1rios"],
  ["Grafico", "Gr\u00e1fico"],
  ["grafico", "gr\u00e1fico"],
  ["Graficos", "Gr\u00e1ficos"],
  ["graficos", "gr\u00e1ficos"],
  ["Lancar", "Lan\u00e7ar"],
  ["lancar", "lan\u00e7ar"],
  ["Lancamento", "Lan\u00e7amento"],
  ["lancamento", "lan\u00e7amento"],
  ["Lancamentos", "Lan\u00e7amentos"],
  ["lancamentos", "lan\u00e7amentos"],
  ["Media", "M\u00e9dia"],
  ["media", "m\u00e9dia"],
  ["Multiplo", "M\u00faltiplo"],
  ["multiplo", "m\u00faltiplo"],
  ["Multiplos", "M\u00faltiplos"],
  ["multiplos", "m\u00faltiplos"],
  ["Numero", "N\u00famero"],
  ["numero", "n\u00famero"],
  ["Numeros", "N\u00fameros"],
  ["numeros", "n\u00fameros"],
  ["Observacao", "Observa\u00e7\u00e3o"],
  ["observacao", "observa\u00e7\u00e3o"],
  ["Oscilacoes", "Oscila\u00e7\u00f5es"],
  ["oscilacoes", "oscila\u00e7\u00f5es"],
  ["Oculos", "\u00d3culos"],
  ["oculos", "\u00f3culos"],
  ["Possivel", "Poss\u00edvel"],
  ["possivel", "poss\u00edvel"],
  ["Possiveis", "Poss\u00edveis"],
  ["possiveis", "poss\u00edveis"],
  ["Reposicao", "Reposi\u00e7\u00e3o"],
  ["reposicao", "reposi\u00e7\u00e3o"],
  ["Retangulo", "Ret\u00e2ngulo"],
  ["retangulo", "ret\u00e2ngulo"],
  ["Triangulo", "Tri\u00e2ngulo"],
  ["triangulo", "tri\u00e2ngulo"],
  ["Triangulos", "Tri\u00e2ngulos"],
  ["triangulos", "tri\u00e2ngulos"],
  ["Variacao", "Varia\u00e7\u00e3o"],
  ["variacao", "varia\u00e7\u00e3o"],
  ["Visivel", "Vis\u00edvel"],
  ["visivel", "vis\u00edvel"],
  ["Nao", "N\u00e3o"],
  ["nao", "n\u00e3o"],
  ["Sao", "S\u00e3o"],
  ["sao", "s\u00e3o"],
  ["Tambem", "Tamb\u00e9m"],
  ["tambem", "tamb\u00e9m"]
];

const literalRegex = /(["'`])((?:\\[\s\S]|(?!\1)[\s\S])*?)\1/g;

function walkMathFiles() {
  const files = [];
  for (const serie of ["1-serie", "2-serie", "3-serie"]) {
    const dir = path.join(banksRoot, serie, "matematica");
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
    .replace(/\bprobabilidade de chover e\b/gi, "probabilidade de chover \u00e9")
    .replace(/\bprobabilidade .* e de\b/gi, (match) => match.replace(/\se de\b/i, " \u00e9 de"))
    .replace(/\bprobabilidade .* e:$/gi, (match) => match.replace(/\se:$/i, " \u00e9:"))
    .replace(/\bprobabilidade correta e:/gi, "probabilidade correta \u00e9:")
    .replace(/\bQual e\b/g, "Qual \u00e9")
    .replace(/\bqual e\b/g, "qual \u00e9")
    .replace(/\bNao e possivel\b/g, "N\u00e3o \u00e9 poss\u00edvel")
    .replace(/\bn\u00e3o e possivel\b/g, "n\u00e3o \u00e9 poss\u00edvel")
    .replace(/\bmedia e\b/gi, (match) => match.replace(/\se\b/i, " \u00e9"))
    .replace(/\bmediana e\b/gi, (match) => match.replace(/\se\b/i, " \u00e9"))
    .replace(/\bmoda e\b/gi, (match) => match.replace(/\se\b/i, " \u00e9"))
    .replace(/\bmaior produ\u00e7\u00e3o foi\b/gi, "maior produ\u00e7\u00e3o foi")
    .replace(/\bdistribuicao e\b/gi, (match) => match.replace(/\se\b/i, " \u00e9"))
    .replace(/\bdistribui\u00e7\u00e3o e\b/gi, (match) => match.replace(/\se\b/i, " \u00e9"))
    .replace(/\bo resultado e\b/gi, "o resultado \u00e9")
    .replace(/\bvalor de .* e\b/gi, (match) => match.replace(/\se$/i, " \u00e9"))
    .replace(/\bvalor .* vale\b/gi, (match) => match)
    .replace(/\besta correta\b/gi, "est\u00e1 correta")
    .replace(/\bafirmacao e correta\b/gi, "afirma\u00e7\u00e3o \u00e9 correta")
    .replace(/\bafirmacao esta correta\b/gi, "afirma\u00e7\u00e3o est\u00e1 correta")
    .replace(/\bafirmacao\b/gi, "afirma\u00e7\u00e3o")
    .replace(/\bcont\u00e9m\b/g, "cont\u00e9m");
}

function replaceLiterals(source) {
  return source.replace(literalRegex, (match, quote, inner) => {
    const fixed = fixText(inner);
    if (fixed === inner) return match;
    return `${quote}${fixed}${quote}`;
  });
}

let changed = 0;
for (const file of walkMathFiles()) {
  const source = fs.readFileSync(file, "utf8");
  const fixed = replaceLiterals(source);
  if (fixed !== source) {
    fs.writeFileSync(file, fixed, "utf8");
    changed += 1;
    console.log(`Corrigido: ${path.relative(repoRoot, file)}`);
  }
}

console.log(`Arquivos alterados: ${changed}`);
