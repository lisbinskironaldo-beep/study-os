import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const banksRoot = path.join(repoRoot, "questions", "banks");

const replacements = [
  ["Acao", "A\u00e7\u00e3o"],
  ["acao", "a\u00e7\u00e3o"],
  ["Acoes", "A\u00e7\u00f5es"],
  ["acoes", "a\u00e7\u00f5es"],
  ["Africa", "\u00c1frica"],
  ["africa", "\u00e1frica"],
  ["Ameaca", "Amea\u00e7a"],
  ["ameaca", "amea\u00e7a"],
  ["Apos", "Ap\u00f3s"],
  ["apos", "ap\u00f3s"],
  ["Avaliacao", "Avalia\u00e7\u00e3o"],
  ["avaliacao", "avalia\u00e7\u00e3o"],
  ["Caracteristicas", "Caracter\u00edsticas"],
  ["caracteristicas", "caracter\u00edsticas"],
  ["Cidadaos", "Cidad\u00e3os"],
  ["cidadaos", "cidad\u00e3os"],
  ["Circulacao", "Circula\u00e7\u00e3o"],
  ["circulacao", "circula\u00e7\u00e3o"],
  ["Colonizacao", "Coloniza\u00e7\u00e3o"],
  ["colonizacao", "coloniza\u00e7\u00e3o"],
  ["Condicoes", "Condi\u00e7\u00f5es"],
  ["condicoes", "condi\u00e7\u00f5es"],
  ["Consequencias", "Consequ\u00eancias"],
  ["consequencias", "consequ\u00eancias"],
  ["Consequencia", "Consequ\u00eancia"],
  ["consequencia", "consequ\u00eancia"],
  ["Decisoes", "Decis\u00f5es"],
  ["decisoes", "decis\u00f5es"],
  ["Democraticas", "Democr\u00e1ticas"],
  ["democraticas", "democr\u00e1ticas"],
  ["Dependencia", "Depend\u00eancia"],
  ["dependencia", "depend\u00eancia"],
  ["Domesticos", "Dom\u00e9sticos"],
  ["domesticos", "dom\u00e9sticos"],
  ["Economica", "Econ\u00f4mica"],
  ["economica", "econ\u00f4mica"],
  ["Economicas", "Econ\u00f4micas"],
  ["economicas", "econ\u00f4micas"],
  ["Educacao", "Educa\u00e7\u00e3o"],
  ["educacao", "educa\u00e7\u00e3o"],
  ["Equilibrio", "Equil\u00edbrio"],
  ["equilibrio", "equil\u00edbrio"],
  ["Exercitos", "Ex\u00e9rcitos"],
  ["exercitos", "ex\u00e9rcitos"],
  ["Experiencia", "Experi\u00eancia"],
  ["experiencia", "experi\u00eancia"],
  ["Expansao", "Expans\u00e3o"],
  ["expansao", "expans\u00e3o"],
  ["Fe", "F\u00e9"],
  ["fe", "f\u00e9"],
  ["Filosofica", "Filos\u00f3fica"],
  ["filosofica", "filos\u00f3fica"],
  ["Formacao", "Forma\u00e7\u00e3o"],
  ["formacao", "forma\u00e7\u00e3o"],
  ["Franca", "Fran\u00e7a"],
  ["franca", "fran\u00e7a"],
  ["Funcao", "Fun\u00e7\u00e3o"],
  ["funcao", "fun\u00e7\u00e3o"],
  ["Historia", "Hist\u00f3ria"],
  ["historia", "hist\u00f3ria"],
  ["Idade Media", "Idade M\u00e9dia"],
  ["idade media", "idade m\u00e9dia"],
  ["Imperio", "Imp\u00e9rio"],
  ["imperio", "imp\u00e9rio"],
  ["Indico", "\u00cdndico"],
  ["indico", "\u00edndico"],
  ["Ingles", "Ingl\u00eas"],
  ["ingles", "ingl\u00eas"],
  ["Lancamento", "Lan\u00e7amento"],
  ["lancamento", "lan\u00e7amento"],
  ["Lideranca", "Lideran\u00e7a"],
  ["lideranca", "lideran\u00e7a"],
  ["Lingua", "L\u00edngua"],
  ["lingua", "l\u00edngua"],
  ["Maquinas", "M\u00e1quinas"],
  ["maquinas", "m\u00e1quinas"],
  ["Media", "M\u00e9dia"],
  ["media", "m\u00e9dia"],
  ["Nao", "N\u00e3o"],
  ["NAO", "N\u00c3O"],
  ["nao", "n\u00e3o"],
  ["Nauticas", "N\u00e1uticas"],
  ["nauticas", "n\u00e1uticas"],
  ["Navegacoes", "Navega\u00e7\u00f5es"],
  ["navegacoes", "navega\u00e7\u00f5es"],
  ["Obrigacoes", "Obriga\u00e7\u00f5es"],
  ["obrigacoes", "obriga\u00e7\u00f5es"],
  ["Oscilacao", "Oscila\u00e7\u00e3o"],
  ["oscilacao", "oscila\u00e7\u00e3o"],
  ["Periodo", "Per\u00edodo"],
  ["periodo", "per\u00edodo"],
  ["Politica", "Pol\u00edtica"],
  ["politica", "pol\u00edtica"],
  ["Politicas", "Pol\u00edticas"],
  ["politicas", "pol\u00edticas"],
  ["Politico", "Pol\u00edtico"],
  ["politico", "pol\u00edtico"],
  ["Politicos", "Pol\u00edticos"],
  ["politicos", "pol\u00edticos"],
  ["Populacao", "Popula\u00e7\u00e3o"],
  ["populacao", "popula\u00e7\u00e3o"],
  ["Portugues", "Portugu\u00eas"],
  ["portugues", "portugu\u00eas"],
  ["Possivel", "Poss\u00edvel"],
  ["possivel", "poss\u00edvel"],
  ["Producao", "Produ\u00e7\u00e3o"],
  ["producao", "produ\u00e7\u00e3o"],
  ["Regencia", "Reg\u00eancia"],
  ["regencia", "reg\u00eancia"],
  ["Relacoes", "Rela\u00e7\u00f5es"],
  ["relacoes", "rela\u00e7\u00f5es"],
  ["Relacao", "Rela\u00e7\u00e3o"],
  ["relacao", "rela\u00e7\u00e3o"],
  ["Republica", "Rep\u00fablica"],
  ["republica", "rep\u00fablica"],
  ["Resistencia", "Resist\u00eancia"],
  ["resistencia", "resist\u00eancia"],
  ["Revolucao", "Revolu\u00e7\u00e3o"],
  ["revolucao", "revolu\u00e7\u00e3o"],
  ["Revolucoes", "Revolu\u00e7\u00f5es"],
  ["revolucoes", "revolu\u00e7\u00f5es"],
  ["Sao", "S\u00e3o"],
  ["sao", "s\u00e3o"],
  ["Tambem", "Tamb\u00e9m"],
  ["tambem", "tamb\u00e9m"],
  ["Tecnicas", "T\u00e9cnicas"],
  ["tecnicas", "t\u00e9cnicas"],
  ["Transicao", "Transi\u00e7\u00e3o"],
  ["transicao", "transi\u00e7\u00e3o"],
  ["Transformacao", "Transforma\u00e7\u00e3o"],
  ["transformacao", "transforma\u00e7\u00e3o"],
  ["Transformacoes", "Transforma\u00e7\u00f5es"],
  ["transformacoes", "transforma\u00e7\u00f5es"],
  ["Variacao", "Varia\u00e7\u00e3o"],
  ["variacao", "varia\u00e7\u00e3o"]
];

const literalRegex = /(["'`])((?:\\[\s\S]|(?!\1)[\s\S])*?)\1/g;

function walkHistoryFiles() {
  const files = [];
  for (const serie of ["1-serie", "2-serie", "3-serie"]) {
    const dir = path.join(banksRoot, serie, "historia");
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
    .replace(/\bN\u00e3o e\b/g, "N\u00e3o \u00e9")
    .replace(/\be uma\b/g, "\u00e9 uma")
    .replace(/\be um\b/g, "\u00e9 um")
    .replace(/\be a\b/g, "\u00e9 a")
    .replace(/\be o\b/g, "\u00e9 o");
}

function replaceLiterals(source) {
  return source.replace(literalRegex, (match, quote, inner) => {
    const fixed = fixText(inner);
    if (fixed === inner) return match;
    return `${quote}${fixed}${quote}`;
  });
}

let changed = 0;
for (const file of walkHistoryFiles()) {
  const source = fs.readFileSync(file, "utf8");
  const fixed = replaceLiterals(source);
  if (fixed !== source) {
    fs.writeFileSync(file, fixed, "utf8");
    changed += 1;
    console.log(`Corrigido: ${path.relative(repoRoot, file)}`);
  }
}

console.log(`Arquivos alterados: ${changed}`);
