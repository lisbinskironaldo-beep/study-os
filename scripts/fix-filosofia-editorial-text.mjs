import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const banksRoot = path.join(repoRoot, "questions", "banks");

const replacements = [
  ["Acao", "A\u00e7\u00e3o"],
  ["acao", "a\u00e7\u00e3o"],
  ["Acoes", "A\u00e7\u00f5es"],
  ["acoes", "a\u00e7\u00f5es"],
  ["Analise", "An\u00e1lise"],
  ["analise", "an\u00e1lise"],
  ["Apropriacao", "Apropria\u00e7\u00e3o"],
  ["apropriacao", "apropria\u00e7\u00e3o"],
  ["Atencao", "Aten\u00e7\u00e3o"],
  ["atencao", "aten\u00e7\u00e3o"],
  ["Avaliacao", "Avalia\u00e7\u00e3o"],
  ["avaliacao", "avalia\u00e7\u00e3o"],
  ["Carater", "Car\u00e1ter"],
  ["carater", "car\u00e1ter"],
  ["Ciencia", "Ci\u00eancia"],
  ["ciencia", "ci\u00eancia"],
  ["Classicos", "Cl\u00e1ssicos"],
  ["classicos", "cl\u00e1ssicos"],
  ["Condicao", "Condi\u00e7\u00e3o"],
  ["condicao", "condi\u00e7\u00e3o"],
  ["Consciencia", "Consci\u00eancia"],
  ["consciencia", "consci\u00eancia"],
  ["Consequencias", "Consequ\u00eancias"],
  ["consequencias", "consequ\u00eancias"],
  ["Consequencia", "Consequ\u00eancia"],
  ["consequencia", "consequ\u00eancia"],
  ["Contem", "Cont\u00e9m"],
  ["contem", "cont\u00e9m"],
  ["Contradicoes", "Contradi\u00e7\u00f5es"],
  ["contradicoes", "contradi\u00e7\u00f5es"],
  ["Criterios", "Crit\u00e9rios"],
  ["criterios", "crit\u00e9rios"],
  ["Criterio", "Crit\u00e9rio"],
  ["criterio", "crit\u00e9rio"],
  ["Critica", "Cr\u00edtica"],
  ["critica", "cr\u00edtica"],
  ["Critico", "Cr\u00edtico"],
  ["critico", "cr\u00edtico"],
  ["Decisoes", "Decis\u00f5es"],
  ["decisoes", "decis\u00f5es"],
  ["Decisao", "Decis\u00e3o"],
  ["decisao", "decis\u00e3o"],
  ["Demonstracao", "Demonstra\u00e7\u00e3o"],
  ["demonstracao", "demonstra\u00e7\u00e3o"],
  ["Disposicao", "Disposi\u00e7\u00e3o"],
  ["disposicao", "disposi\u00e7\u00e3o"],
  ["Educacao", "Educa\u00e7\u00e3o"],
  ["educacao", "educa\u00e7\u00e3o"],
  ["Equilibrio", "Equil\u00edbrio"],
  ["equilibrio", "equil\u00edbrio"],
  ["Especies", "Esp\u00e9cies"],
  ["especies", "esp\u00e9cies"],
  ["Etica", "\u00c9tica"],
  ["etica", "\u00e9tica"],
  ["Existencia", "Exist\u00eancia"],
  ["existencia", "exist\u00eancia"],
  ["Experiencia", "Experi\u00eancia"],
  ["experiencia", "experi\u00eancia"],
  ["Explicacao", "Explica\u00e7\u00e3o"],
  ["explicacao", "explica\u00e7\u00e3o"],
  ["Explicacoes", "Explica\u00e7\u00f5es"],
  ["explicacoes", "explica\u00e7\u00f5es"],
  ["Exploracoes", "Explora\u00e7\u00f5es"],
  ["exploracoes", "explora\u00e7\u00f5es"],
  ["Fenomenos", "Fen\u00f4menos"],
  ["fenomenos", "fen\u00f4menos"],
  ["Filosofica", "Filos\u00f3fica"],
  ["filosofica", "filos\u00f3fica"],
  ["Filosoficas", "Filos\u00f3ficas"],
  ["filosoficas", "filos\u00f3ficas"],
  ["Filosofico", "Filos\u00f3fico"],
  ["filosofico", "filos\u00f3fico"],
  ["Formacao", "Forma\u00e7\u00e3o"],
  ["formacao", "forma\u00e7\u00e3o"],
  ["Funcao", "Fun\u00e7\u00e3o"],
  ["funcao", "fun\u00e7\u00e3o"],
  ["Funcoes", "Fun\u00e7\u00f5es"],
  ["funcoes", "fun\u00e7\u00f5es"],
  ["Genero", "G\u00eanero"],
  ["genero", "g\u00eanero"],
  ["Generos", "G\u00eaneros"],
  ["generos", "g\u00eaneros"],
  ["Habitos", "H\u00e1bitos"],
  ["habitos", "h\u00e1bitos"],
  ["Habito", "H\u00e1bito"],
  ["habito", "h\u00e1bito"],
  ["Heranca", "Heran\u00e7a"],
  ["heranca", "heran\u00e7a"],
  ["Historia", "Hist\u00f3ria"],
  ["historia", "hist\u00f3ria"],
  ["Identitaria", "Identit\u00e1ria"],
  ["identitaria", "identit\u00e1ria"],
  ["Importancia", "Import\u00e2ncia"],
  ["importancia", "import\u00e2ncia"],
  ["Influencia", "Influ\u00eancia"],
  ["influencia", "influ\u00eancia"],
  ["Interpretacao", "Interpreta\u00e7\u00e3o"],
  ["interpretacao", "interpreta\u00e7\u00e3o"],
  ["Investigacao", "Investiga\u00e7\u00e3o"],
  ["investigacao", "investiga\u00e7\u00e3o"],
  ["Juizo", "Ju\u00edzo"],
  ["juizo", "ju\u00edzo"],
  ["Justica", "Justi\u00e7a"],
  ["justica", "justi\u00e7a"],
  ["Logica", "L\u00f3gica"],
  ["logica", "l\u00f3gica"],
  ["Matematica", "Matem\u00e1tica"],
  ["matematica", "matem\u00e1tica"],
  ["Moderacao", "Modera\u00e7\u00e3o"],
  ["moderacao", "modera\u00e7\u00e3o"],
  ["Mudanca", "Mudan\u00e7a"],
  ["mudanca", "mudan\u00e7a"],
  ["Nao", "N\u00e3o"],
  ["NAO", "N\u00c3O"],
  ["nao", "n\u00e3o"],
  ["Numero", "N\u00famero"],
  ["numero", "n\u00famero"],
  ["Numeros", "N\u00fameros"],
  ["numeros", "n\u00fameros"],
  ["Observacao", "Observa\u00e7\u00e3o"],
  ["observacao", "observa\u00e7\u00e3o"],
  ["Opiniao", "Opini\u00e3o"],
  ["opiniao", "opini\u00e3o"],
  ["Opinioes", "Opini\u00f5es"],
  ["opinioes", "opini\u00f5es"],
  ["Operacoes", "Opera\u00e7\u00f5es"],
  ["operacoes", "opera\u00e7\u00f5es"],
  ["Orientacao", "Orienta\u00e7\u00e3o"],
  ["orientacao", "orienta\u00e7\u00e3o"],
  ["Periodo", "Per\u00edodo"],
  ["periodo", "per\u00edodo"],
  ["Politica", "Pol\u00edtica"],
  ["politica", "pol\u00edtica"],
  ["Politico", "Pol\u00edtico"],
  ["politico", "pol\u00edtico"],
  ["Possivel", "Poss\u00edvel"],
  ["possivel", "poss\u00edvel"],
  ["Pratica", "Pr\u00e1tica"],
  ["pratica", "pr\u00e1tica"],
  ["Principio", "Princ\u00edpio"],
  ["principio", "princ\u00edpio"],
  ["Principios", "Princ\u00edpios"],
  ["principios", "princ\u00edpios"],
  ["Producao", "Produ\u00e7\u00e3o"],
  ["producao", "produ\u00e7\u00e3o"],
  ["Propria", "Pr\u00f3pria"],
  ["propria", "pr\u00f3pria"],
  ["Proprias", "Pr\u00f3prias"],
  ["proprias", "pr\u00f3prias"],
  ["Proprio", "Pr\u00f3prio"],
  ["proprio", "pr\u00f3prio"],
  ["Proprios", "Pr\u00f3prios"],
  ["proprios", "pr\u00f3prios"],
  ["Purificacao", "Purifica\u00e7\u00e3o"],
  ["purificacao", "purifica\u00e7\u00e3o"],
  ["Raciocinio", "Racioc\u00ednio"],
  ["raciocinio", "racioc\u00ednio"],
  ["Razao", "Raz\u00e3o"],
  ["razao", "raz\u00e3o"],
  ["Reflexao", "Reflex\u00e3o"],
  ["reflexao", "reflex\u00e3o"],
  ["Relacoes", "Rela\u00e7\u00f5es"],
  ["relacoes", "rela\u00e7\u00f5es"],
  ["Relacao", "Rela\u00e7\u00e3o"],
  ["relacao", "rela\u00e7\u00e3o"],
  ["Sao", "S\u00e3o"],
  ["sao", "s\u00e3o"],
  ["Sensacao", "Sensa\u00e7\u00e3o"],
  ["sensacao", "sensa\u00e7\u00e3o"],
  ["Sequencia", "Sequ\u00eancia"],
  ["sequencia", "sequ\u00eancia"],
  ["Situacoes", "Situa\u00e7\u00f5es"],
  ["situacoes", "situa\u00e7\u00f5es"],
  ["Situacao", "Situa\u00e7\u00e3o"],
  ["situacao", "situa\u00e7\u00e3o"],
  ["Suicidio", "Suic\u00eddio"],
  ["suicidio", "suic\u00eddio"],
  ["Tambem", "Tamb\u00e9m"],
  ["tambem", "tamb\u00e9m"],
  ["Tecnica", "T\u00e9cnica"],
  ["tecnica", "t\u00e9cnica"],
  ["Tecnicas", "T\u00e9cnicas"],
  ["tecnicas", "t\u00e9cnicas"],
  ["Tradicao", "Tradi\u00e7\u00e3o"],
  ["tradicao", "tradi\u00e7\u00e3o"],
  ["Validacao", "Valida\u00e7\u00e3o"],
  ["validacao", "valida\u00e7\u00e3o"]
];

const literalRegex = /(["'`])((?:\\[\s\S]|(?!\1)[\s\S])*?)\1/g;

function walkPhilosophyFiles() {
  const files = [];
  for (const serie of ["1-serie", "2-serie", "3-serie"]) {
    const dir = path.join(banksRoot, serie, "filosofia");
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
    .replace(/\bIsto e\b/g, "Isto \u00e9")
    .replace(/\bisto e\b/g, "isto \u00e9")
    .replace(/\bAquilo e\b/g, "Aquilo \u00e9")
    .replace(/\baquilo e\b/g, "aquilo \u00e9")
    .replace(/\bO essencial n\u00e3o e\b/g, "O essencial n\u00e3o \u00e9")
    .replace(/\bo essencial n\u00e3o e\b/g, "o essencial n\u00e3o \u00e9")
    .replace(/\bN\u00e3o e\b/g, "N\u00e3o \u00e9")
    .replace(/\bn\u00e3o e\b/g, "n\u00e3o \u00e9")
    .replace(/\be importante\b/g, "\u00e9 importante")
    .replace(/\be correto\b/g, "\u00e9 correto")
    .replace(/\be central\b/g, "\u00e9 central")
    .replace(/\be fundamental\b/g, "\u00e9 fundamental")
    .replace(/\be historicamente\b/g, "\u00e9 historicamente")
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
for (const file of walkPhilosophyFiles()) {
  const source = fs.readFileSync(file, "utf8");
  const fixed = replaceLiterals(source);
  if (fixed !== source) {
    fs.writeFileSync(file, fixed, "utf8");
    changed += 1;
    console.log(`Corrigido: ${path.relative(repoRoot, file)}`);
  }
}

console.log(`Arquivos alterados: ${changed}`);
