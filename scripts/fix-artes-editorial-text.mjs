import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const banksRoot = path.join(repoRoot, "questions", "banks");

const replacements = [
  ["Acao", "A\u00e7\u00e3o"],
  ["acao", "a\u00e7\u00e3o"],
  ["Analise", "An\u00e1lise"],
  ["analise", "an\u00e1lise"],
  ["Apos", "Ap\u00f3s"],
  ["apos", "ap\u00f3s"],
  ["Area", "\u00c1rea"],
  ["area", "\u00e1rea"],
  ["Artistica", "Art\u00edstica"],
  ["artistica", "art\u00edstica"],
  ["Artistico", "Art\u00edstico"],
  ["artistico", "art\u00edstico"],
  ["Articulacao", "Articula\u00e7\u00e3o"],
  ["articulacao", "articula\u00e7\u00e3o"],
  ["Carater", "Car\u00e1ter"],
  ["carater", "car\u00e1ter"],
  ["Caracteristica", "Caracter\u00edstica"],
  ["caracteristica", "caracter\u00edstica"],
  ["Caracteristicas", "Caracter\u00edsticas"],
  ["caracteristicas", "caracter\u00edsticas"],
  ["Classica", "Cl\u00e1ssica"],
  ["classica", "cl\u00e1ssica"],
  ["Classicos", "Cl\u00e1ssicos"],
  ["classicos", "cl\u00e1ssicos"],
  ["Composicao", "Composi\u00e7\u00e3o"],
  ["composicao", "composi\u00e7\u00e3o"],
  ["Computacionais", "Computacionais"],
  ["Construcao", "Constru\u00e7\u00e3o"],
  ["construcao", "constru\u00e7\u00e3o"],
  ["Criterios", "Crit\u00e9rios"],
  ["criterios", "crit\u00e9rios"],
  ["Critica", "Cr\u00edtica"],
  ["critica", "cr\u00edtica"],
  ["Criacao", "Cria\u00e7\u00e3o"],
  ["criacao", "cria\u00e7\u00e3o"],
  ["DiluidA", "Dilu\u00edda"],
  ["diluida", "dilu\u00edda"],
  ["Distancia", "Dist\u00e2ncia"],
  ["distancia", "dist\u00e2ncia"],
  ["Equilibrio", "Equil\u00edbrio"],
  ["equilibrio", "equil\u00edbrio"],
  ["Estetica", "Est\u00e9tica"],
  ["estetica", "est\u00e9tica"],
  ["Fisica", "F\u00edsica"],
  ["fisica", "f\u00edsica"],
  ["Formacao", "Forma\u00e7\u00e3o"],
  ["formacao", "forma\u00e7\u00e3o"],
  ["Forca", "For\u00e7a"],
  ["forca", "for\u00e7a"],
  ["Funcao", "Fun\u00e7\u00e3o"],
  ["funcao", "fun\u00e7\u00e3o"],
  ["Genero", "G\u00eanero"],
  ["genero", "g\u00eanero"],
  ["Grafico", "Gr\u00e1fico"],
  ["grafico", "gr\u00e1fico"],
  ["Grecia", "Gr\u00e9cia"],
  ["grecia", "gr\u00e9cia"],
  ["Historia", "Hist\u00f3ria"],
  ["historia", "hist\u00f3ria"],
  ["Influencia", "Influ\u00eancia"],
  ["influencia", "influ\u00eancia"],
  ["Instalacao", "Instala\u00e7\u00e3o"],
  ["instalacao", "instala\u00e7\u00e3o"],
  ["Intencoes", "Inten\u00e7\u00f5es"],
  ["intencoes", "inten\u00e7\u00f5es"],
  ["Interpretacao", "Interpreta\u00e7\u00e3o"],
  ["interpretacao", "interpreta\u00e7\u00e3o"],
  ["Justaposicao", "Justaposi\u00e7\u00e3o"],
  ["justaposicao", "justaposi\u00e7\u00e3o"],
  ["Linguistica", "Lingu\u00edstica"],
  ["linguistica", "lingu\u00edstica"],
  ["Manipulacao", "Manipula\u00e7\u00e3o"],
  ["manipulacao", "manipula\u00e7\u00e3o"],
  ["Matematica", "Matem\u00e1tica"],
  ["matematica", "matem\u00e1tica"],
  ["Memoria", "Mem\u00f3ria"],
  ["memoria", "mem\u00f3ria"],
  ["Metodo", "M\u00e9todo"],
  ["metodo", "m\u00e9todo"],
  ["Mudancas", "Mudan\u00e7as"],
  ["mudancas", "mudan\u00e7as"],
  ["Nao", "N\u00e3o"],
  ["NAO", "N\u00c3O"],
  ["nao", "n\u00e3o"],
  ["Observacao", "Observa\u00e7\u00e3o"],
  ["observacao", "observa\u00e7\u00e3o"],
  ["Optica", "\u00d3ptica"],
  ["optica", "\u00f3ptica"],
  ["Organizacao", "Organiza\u00e7\u00e3o"],
  ["organizacao", "organiza\u00e7\u00e3o"],
  ["Participacao", "Participa\u00e7\u00e3o"],
  ["participacao", "participa\u00e7\u00e3o"],
  ["Pais", "Pa\u00eds"],
  ["pais", "pa\u00eds"],
  ["Politico", "Pol\u00edtico"],
  ["politico", "pol\u00edtico"],
  ["Presenca", "Presen\u00e7a"],
  ["presenca", "presen\u00e7a"],
  ["Producao", "Produ\u00e7\u00e3o"],
  ["producao", "produ\u00e7\u00e3o"],
  ["Proporcao", "Propor\u00e7\u00e3o"],
  ["proporcao", "propor\u00e7\u00e3o"],
  ["Publica", "P\u00fablica"],
  ["publica", "p\u00fablica"],
  ["Publico", "P\u00fablico"],
  ["publico", "p\u00fablico"],
  ["Racionalidade", "Racionalidade"],
  ["Reflexao", "Reflex\u00e3o"],
  ["reflexao", "reflex\u00e3o"],
  ["Relacoes", "Rela\u00e7\u00f5es"],
  ["relacoes", "rela\u00e7\u00f5es"],
  ["Relacao", "Rela\u00e7\u00e3o"],
  ["relacao", "rela\u00e7\u00e3o"],
  ["Religiao", "Religi\u00e3o"],
  ["religiao", "religi\u00e3o"],
  ["Renovacao", "Renova\u00e7\u00e3o"],
  ["renovacao", "renova\u00e7\u00e3o"],
  ["Representacao", "Representa\u00e7\u00e3o"],
  ["representacao", "representa\u00e7\u00e3o"],
  ["Sao", "S\u00e3o"],
  ["sao", "s\u00e3o"],
  ["Seculos", "S\u00e9culos"],
  ["seculos", "s\u00e9culos"],
  ["Sensacao", "Sensa\u00e7\u00e3o"],
  ["sensacao", "sensa\u00e7\u00e3o"],
  ["Simbolica", "Simb\u00f3lica"],
  ["simbolica", "simb\u00f3lica"],
  ["Situacao", "Situa\u00e7\u00e3o"],
  ["situacao", "situa\u00e7\u00e3o"],
  ["Sobreposicao", "Sobreposi\u00e7\u00e3o"],
  ["sobreposicao", "sobreposi\u00e7\u00e3o"],
  ["Tambem", "Tamb\u00e9m"],
  ["tambem", "tamb\u00e9m"],
  ["Tecnica", "T\u00e9cnica"],
  ["tecnica", "t\u00e9cnica"],
  ["Tecnicas", "T\u00e9cnicas"],
  ["tecnicas", "t\u00e9cnicas"],
  ["Triangulos", "Tri\u00e2ngulos"],
  ["triangulos", "tri\u00e2ngulos"],
  ["Unico", "\u00danico"],
  ["unico", "\u00fanico"],
  ["Variacao", "Varia\u00e7\u00e3o"],
  ["variacao", "varia\u00e7\u00e3o"],
  ["Varios", "V\u00e1rios"],
  ["varios", "v\u00e1rios"],
  ["Visivel", "Vis\u00edvel"],
  ["visivel", "vis\u00edvel"]
];

const literalRegex = /(["'`])((?:\\[\s\S]|(?!\1)[\s\S])*?)\1/g;

function walkArtsFiles() {
  const files = [];
  for (const serie of ["1-serie", "2-serie", "3-serie"]) {
    const dir = path.join(banksRoot, serie, "artes");
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
    .replace(/\bEsse e\b/g, "Esse \u00e9")
    .replace(/\besse e\b/g, "esse \u00e9")
    .replace(/\bEssa e\b/g, "Essa \u00e9")
    .replace(/\bessa e\b/g, "essa \u00e9")
    .replace(/\bEle e\b/g, "Ele \u00e9")
    .replace(/\bele e\b/g, "ele \u00e9")
    .replace(/\bEla e\b/g, "Ela \u00e9")
    .replace(/\bela e\b/g, "ela \u00e9")
    .replace(/\bn\u00e3o e\b/g, "n\u00e3o \u00e9")
    .replace(/\bN\u00e3o e\b/g, "N\u00e3o \u00e9");
}

function replaceLiterals(source) {
  return source.replace(literalRegex, (match, quote, inner) => {
    const fixed = fixText(inner);
    if (fixed === inner) return match;
    return `${quote}${fixed}${quote}`;
  });
}

let changed = 0;
for (const file of walkArtsFiles()) {
  const source = fs.readFileSync(file, "utf8");
  const fixed = replaceLiterals(source);
  if (fixed !== source) {
    fs.writeFileSync(file, fixed, "utf8");
    changed += 1;
    console.log(`Corrigido: ${path.relative(repoRoot, file)}`);
  }
}

console.log(`Arquivos alterados: ${changed}`);
