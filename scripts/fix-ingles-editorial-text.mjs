import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const banksRoot = path.join(repoRoot, "questions", "banks");

const replacements = [
  ["Ingles", "Ingl\u00eas"],
  ["ingles", "ingl\u00eas"],
  ["Interpretacao", "Interpreta\u00e7\u00e3o"],
  ["interpretacao", "interpreta\u00e7\u00e3o"],
  ["Comunicacao", "Comunica\u00e7\u00e3o"],
  ["comunicacao", "comunica\u00e7\u00e3o"],
  ["Compreensao", "Compreens\u00e3o"],
  ["compreensao", "compreens\u00e3o"],
  ["Vocabulario", "Vocabul\u00e1rio"],
  ["vocabulario", "vocabul\u00e1rio"],
  ["Basico", "B\u00e1sico"],
  ["basico", "b\u00e1sico"],
  ["Basicos", "B\u00e1sicos"],
  ["basicos", "b\u00e1sicos"],
  ["Lexico", "L\u00e9xico"],
  ["lexico", "l\u00e9xico"],
  ["Saudacoes", "Sauda\u00e7\u00f5es"],
  ["saudacoes", "sauda\u00e7\u00f5es"],
  ["Apresentacoes", "Apresenta\u00e7\u00f5es"],
  ["apresentacoes", "apresenta\u00e7\u00f5es"],
  ["Informacoes", "Informa\u00e7\u00f5es"],
  ["informacoes", "informa\u00e7\u00f5es"],
  ["Familia", "Fam\u00edlia"],
  ["familia", "fam\u00edlia"],
  ["Relacao", "Rela\u00e7\u00e3o"],
  ["relacao", "rela\u00e7\u00e3o"],
  ["Relacoes", "Rela\u00e7\u00f5es"],
  ["relacoes", "rela\u00e7\u00f5es"],
  ["Numeros", "N\u00fameros"],
  ["numeros", "n\u00fameros"],
  ["Numero", "N\u00famero"],
  ["numero", "n\u00famero"],
  ["Acoes", "A\u00e7\u00f5es"],
  ["acoes", "a\u00e7\u00f5es"],
  ["Acao", "A\u00e7\u00e3o"],
  ["acao", "a\u00e7\u00e3o"],
  ["Situacao", "Situa\u00e7\u00e3o"],
  ["situacao", "situa\u00e7\u00e3o"],
  ["Situacoes", "Situa\u00e7\u00f5es"],
  ["situacoes", "situa\u00e7\u00f5es"],
  ["Expressoes", "Express\u00f5es"],
  ["expressoes", "express\u00f5es"],
  ["Interacoes", "Intera\u00e7\u00f5es"],
  ["interacoes", "intera\u00e7\u00f5es"],
  ["Endereco", "Endere\u00e7o"],
  ["endereco", "endere\u00e7o"],
  ["Vinculos", "V\u00ednculos"],
  ["vinculos", "v\u00ednculos"],
  ["Opcao", "Op\u00e7\u00e3o"],
  ["opcao", "op\u00e7\u00e3o"],
  ["Incompativel", "Incompat\u00edvel"],
  ["incompativel", "incompat\u00edvel"],
  ["Subtopico", "Subt\u00f3pico"],
  ["subtopico", "subt\u00f3pico"],
  ["Avaliacao", "Avalia\u00e7\u00e3o"],
  ["avaliacao", "avalia\u00e7\u00e3o"],
  ["Afirmacao", "Afirma\u00e7\u00e3o"],
  ["afirmacao", "afirma\u00e7\u00e3o"],
  ["Conclusao", "Conclus\u00e3o"],
  ["conclusao", "conclus\u00e3o"],
  ["Funcao", "Fun\u00e7\u00e3o"],
  ["funcao", "fun\u00e7\u00e3o"],
  ["Generos", "G\u00eaneros"],
  ["generos", "g\u00eaneros"],
  ["Genero", "G\u00eanero"],
  ["genero", "g\u00eanero"],
  ["Proposito", "Prop\u00f3sito"],
  ["proposito", "prop\u00f3sito"],
  ["Rapida", "R\u00e1pida"],
  ["rapida", "r\u00e1pida"],
  ["Analise", "An\u00e1lise"],
  ["analise", "an\u00e1lise"],
  ["Conteudo", "Conte\u00fado"],
  ["conteudo", "conte\u00fado"],
  ["Implicita", "Impl\u00edcita"],
  ["implicita", "impl\u00edcita"],
  ["Explicitas", "Expl\u00edcitas"],
  ["explicitas", "expl\u00edcitas"],
  ["Estrategia", "Estrat\u00e9gia"],
  ["estrategia", "estrat\u00e9gia"],
  ["Estrategias", "Estrat\u00e9gias"],
  ["estrategias", "estrat\u00e9gias"],
  ["Intermediaria", "Intermedi\u00e1ria"],
  ["intermediaria", "intermedi\u00e1ria"],
  ["Referencias", "Refer\u00eancias"],
  ["referencias", "refer\u00eancias"],
  ["Referencia", "Refer\u00eancia"],
  ["referencia", "refer\u00eancia"],
  ["Coesao", "Coes\u00e3o"],
  ["coesao", "coes\u00e3o"],
  ["Responsavel", "Respons\u00e1vel"],
  ["responsavel", "respons\u00e1vel"],
  ["Gramatica", "Gram\u00e1tica"],
  ["gramatica", "gram\u00e1tica"],
  ["Padroes", "Padr\u00f5es"],
  ["padroes", "padr\u00f5es"],
  ["Duracao", "Dura\u00e7\u00e3o"],
  ["duracao", "dura\u00e7\u00e3o"],
  ["Mudancas", "Mudan\u00e7as"],
  ["mudancas", "mudan\u00e7as"],
  ["Habito", "H\u00e1bito"],
  ["habito", "h\u00e1bito"],
  ["Habitos", "H\u00e1bitos"],
  ["habitos", "h\u00e1bitos"],
  ["Tambem", "Tamb\u00e9m"],
  ["tambem", "tamb\u00e9m"],
  ["Enfase", "\u00canfase"],
  ["enfase", "\u00eanfase"],
  ["Competencias", "Compet\u00eancias"],
  ["competencias", "compet\u00eancias"],
  ["Estrategica", "Estrat\u00e9gica"],
  ["estrategica", "estrat\u00e9gica"],
  ["Hipotese", "Hip\u00f3tese"],
  ["hipotese", "hip\u00f3tese"],
  ["Consequencia", "Consequ\u00eancia"],
  ["consequencia", "consequ\u00eancia"],
  ["Obrigacao", "Obriga\u00e7\u00e3o"],
  ["obrigacao", "obriga\u00e7\u00e3o"],
  ["Intencao", "Inten\u00e7\u00e3o"],
  ["intencao", "inten\u00e7\u00e3o"],
  ["Dispensaveis", "Dispens\u00e1veis"],
  ["dispensaveis", "dispens\u00e1veis"],
  ["Portugues", "Portugu\u00eas"],
  ["portugues", "portugu\u00eas"],
  ["Fisica", "F\u00edsica"],
  ["fisica", "f\u00edsica"],
  ["Educacao", "Educa\u00e7\u00e3o"],
  ["educacao", "educa\u00e7\u00e3o"],
  ["Frequencia", "Frequ\u00eancia"],
  ["frequencia", "frequ\u00eancia"],
  ["Caracteristicas", "Caracter\u00edsticas"],
  ["caracteristicas", "caracter\u00edsticas"],
  ["Formacao", "Forma\u00e7\u00e3o"],
  ["formacao", "forma\u00e7\u00e3o"],
  ["Graficos", "Gr\u00e1ficos"],
  ["graficos", "gr\u00e1ficos"],
  ["Grafico", "Gr\u00e1fico"],
  ["grafico", "gr\u00e1fico"],
  ["Decisoes", "Decis\u00f5es"],
  ["decisoes", "decis\u00f5es"],
  ["Decisao", "Decis\u00e3o"],
  ["decisao", "decis\u00e3o"],
  ["Lingua", "L\u00edngua"],
  ["lingua", "l\u00edngua"],
  ["Preposicao", "Preposi\u00e7\u00e3o"],
  ["preposicao", "preposi\u00e7\u00e3o"],
  ["Tecnicas", "T\u00e9cnicas"],
  ["tecnicas", "t\u00e9cnicas"],
  ["Possivel", "Poss\u00edvel"],
  ["possivel", "poss\u00edvel"],
  ["Producao", "Produ\u00e7\u00e3o"],
  ["producao", "produ\u00e7\u00e3o"],
  ["Contem", "Cont\u00e9m"],
  ["contem", "cont\u00e9m"],
  ["Sao", "S\u00e3o"],
  ["sao", "s\u00e3o"],
  ["Nao", "N\u00e3o"],
  ["NAO", "N\u00c3O"],
  ["nao", "n\u00e3o"]
];

const literalRegex = /(["'`])((?:\\[\s\S]|(?!\1)[\s\S])*?)\1/g;

function walkEnglishFiles() {
  const files = [];
  for (const serie of ["1-serie", "2-serie", "3-serie"]) {
    const dir = path.join(banksRoot, serie, "ingles");
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
    .replace(/\bQual alternativa N\u00e3O\b/g, "Qual alternativa N\u00c3O")
    .replace(/\bN\u00c3O representa\b/g, "N\u00c3O representa")
    .replace(/\besta mais ligado\b/g, "est\u00e1 mais ligado")
    .replace(/\bEsse caso esta\b/g, "Esse caso est\u00e1")
    .replace(/\bA situa\u00e7\u00e3o apresentada e\b/g, "A situa\u00e7\u00e3o apresentada \u00e9")
    .replace(/\bo foco principal e:/g, "o foco principal \u00e9:")
    .replace(/\bAo estudar ([^,]+), o foco principal e:/g, "Ao estudar $1, o foco principal \u00e9:")
    .replace(/\bA conclus\u00e3o correta retoma\b/g, "A conclus\u00e3o correta retoma")
    .replace(/\bA avalia\u00e7\u00e3o mais adequada e:/g, "A avalia\u00e7\u00e3o mais adequada \u00e9:")
    .replace(/\bA afirma\u00e7\u00e3o esta\b/g, "A afirma\u00e7\u00e3o est\u00e1")
    .replace(/\bA partir do caso descrito, qual conclus\u00e3o e\b/g, "A partir do caso descrito, qual conclus\u00e3o \u00e9")
    .replace(/\bUm erro comum em ([^ ](?:.*?)) e pensar que:/g, "Um erro comum em $1 \u00e9 pensar que:")
    .replace(/\bEsse e um erro\b/g, "Esse \u00e9 um erro")
    .replace(/\bEsse e o tipo\b/g, "Esse \u00e9 o tipo")
    .replace(/\bO item correto e\b/g, "O item correto \u00e9")
    .replace(/\bO objetivo central de\b/g, "O objetivo central de")
    .replace(/\be mais cobrado quando:/g, "\u00e9 mais cobrado quando:")
    .replace(/\bmantem\b/g, "mant\u00e9m")
    .replace(/\bMantem\b/g, "Mant\u00e9m")
    .replace(/\bnucleo\b/g, "n\u00facleo")
    .replace(/\bNucleo\b/g, "N\u00facleo")
    .replace(/\bresolucao\b/g, "resolu\u00e7\u00e3o")
    .replace(/\bResolucao\b/g, "Resolu\u00e7\u00e3o")
    .replace(/\bdominio\b/g, "dom\u00ednio")
    .replace(/\bDominio\b/g, "Dom\u00ednio");
}

function replaceLiterals(source) {
  return source.replace(literalRegex, (match, quote, inner) => {
    const fixed = fixText(inner);
    if (fixed === inner) return match;
    return `${quote}${fixed}${quote}`;
  });
}

let changed = 0;
for (const file of walkEnglishFiles()) {
  const source = fs.readFileSync(file, "utf8");
  const fixed = replaceLiterals(source);
  if (fixed !== source) {
    fs.writeFileSync(file, fixed, "utf8");
    changed += 1;
    console.log(`Corrigido: ${path.relative(repoRoot, file)}`);
  }
}

console.log(`Arquivos alterados: ${changed}`);
