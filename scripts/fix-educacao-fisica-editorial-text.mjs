import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const banksRoot = path.join(repoRoot, "questions", "banks");

const replacements = [
  ["Acao", "A\u00e7\u00e3o"],
  ["acao", "a\u00e7\u00e3o"],
  ["Acoes", "A\u00e7\u00f5es"],
  ["acoes", "a\u00e7\u00f5es"],
  ["Agua", "\u00c1gua"],
  ["agua", "\u00e1gua"],
  ["Alimentacao", "Alimenta\u00e7\u00e3o"],
  ["alimentacao", "alimenta\u00e7\u00e3o"],
  ["Analise", "An\u00e1lise"],
  ["analise", "an\u00e1lise"],
  ["Apos", "Ap\u00f3s"],
  ["apos", "ap\u00f3s"],
  ["Aptidao", "Aptid\u00e3o"],
  ["aptidao", "aptid\u00e3o"],
  ["Articulacao", "Articula\u00e7\u00e3o"],
  ["articulacao", "articula\u00e7\u00e3o"],
  ["Articulacoes", "Articula\u00e7\u00f5es"],
  ["articulacoes", "articula\u00e7\u00f5es"],
  ["Atencao", "Aten\u00e7\u00e3o"],
  ["atencao", "aten\u00e7\u00e3o"],
  ["Biologico", "Biol\u00f3gico"],
  ["biologico", "biol\u00f3gico"],
  ["Caracteristicas", "Caracter\u00edsticas"],
  ["caracteristicas", "caracter\u00edsticas"],
  ["Carater", "Car\u00e1ter"],
  ["carater", "car\u00e1ter"],
  ["Comunicacao", "Comunica\u00e7\u00e3o"],
  ["comunicacao", "comunica\u00e7\u00e3o"],
  ["Condicao", "Condi\u00e7\u00e3o"],
  ["condicao", "condi\u00e7\u00e3o"],
  ["Consciencia", "Consci\u00eancia"],
  ["consciencia", "consci\u00eancia"],
  ["Consequencia", "Consequ\u00eancia"],
  ["consequencia", "consequ\u00eancia"],
  ["Construcao", "Constru\u00e7\u00e3o"],
  ["construcao", "constru\u00e7\u00e3o"],
  ["Criterio", "Crit\u00e9rio"],
  ["criterio", "crit\u00e9rio"],
  ["Cooperacao", "Coopera\u00e7\u00e3o"],
  ["cooperacao", "coopera\u00e7\u00e3o"],
  ["Coordenacao", "Coordena\u00e7\u00e3o"],
  ["coordenacao", "coordena\u00e7\u00e3o"],
  ["Decisao", "Decis\u00e3o"],
  ["decisao", "decis\u00e3o"],
  ["Decisoes", "Decis\u00f5es"],
  ["decisoes", "decis\u00f5es"],
  ["Diarias", "Di\u00e1rias"],
  ["diarias", "di\u00e1rias"],
  ["Dimensao", "Dimens\u00e3o"],
  ["dimensao", "dimens\u00e3o"],
  ["Dimensoes", "Dimens\u00f5es"],
  ["dimensoes", "dimens\u00f5es"],
  ["Disposicao", "Disposi\u00e7\u00e3o"],
  ["disposicao", "disposi\u00e7\u00e3o"],
  ["Distancia", "Dist\u00e2ncia"],
  ["distancia", "dist\u00e2ncia"],
  ["Distancias", "Dist\u00e2ncias"],
  ["distancias", "dist\u00e2ncias"],
  ["Educacao", "Educa\u00e7\u00e3o"],
  ["educacao", "educa\u00e7\u00e3o"],
  ["Equilibrio", "Equil\u00edbrio"],
  ["equilibrio", "equil\u00edbrio"],
  ["Estrategia", "Estrat\u00e9gia"],
  ["estrategia", "estrat\u00e9gia"],
  ["Etica", "\u00c9tica"],
  ["etica", "\u00e9tica"],
  ["Experiencia", "Experi\u00eancia"],
  ["experiencia", "experi\u00eancia"],
  ["Experiencias", "Experi\u00eancias"],
  ["experiencias", "experi\u00eancias"],
  ["Fisica", "F\u00edsica"],
  ["fisica", "f\u00edsica"],
  ["Formacao", "Forma\u00e7\u00e3o"],
  ["formacao", "forma\u00e7\u00e3o"],
  ["Funcao", "Fun\u00e7\u00e3o"],
  ["funcao", "fun\u00e7\u00e3o"],
  ["Funcoes", "Fun\u00e7\u00f5es"],
  ["funcoes", "fun\u00e7\u00f5es"],
  ["Habito", "H\u00e1bito"],
  ["habito", "h\u00e1bito"],
  ["Habitos", "H\u00e1bitos"],
  ["habitos", "h\u00e1bitos"],
  ["Historia", "Hist\u00f3ria"],
  ["historia", "hist\u00f3ria"],
  ["Horarios", "Hor\u00e1rios"],
  ["horarios", "hor\u00e1rios"],
  ["Hidratacao", "Hidrata\u00e7\u00e3o"],
  ["hidratacao", "hidrata\u00e7\u00e3o"],
  ["Inclusao", "Inclus\u00e3o"],
  ["inclusao", "inclus\u00e3o"],
  ["Insercao", "Inser\u00e7\u00e3o"],
  ["insercao", "inser\u00e7\u00e3o"],
  ["Interacao", "Intera\u00e7\u00e3o"],
  ["interacao", "intera\u00e7\u00e3o"],
  ["Infracao", "Infra\u00e7\u00e3o"],
  ["infracao", "infra\u00e7\u00e3o"],
  ["Lacos", "La\u00e7os"],
  ["lacos", "la\u00e7os"],
  ["Lancar", "Lan\u00e7ar"],
  ["lancar", "lan\u00e7ar"],
  ["Lancamentos", "Lan\u00e7amentos"],
  ["lancamentos", "lan\u00e7amentos"],
  ["Liquidos", "L\u00edquidos"],
  ["liquidos", "l\u00edquidos"],
  ["Mutua", "M\u00fatua"],
  ["mutua", "m\u00fatua"],
  ["Nao", "N\u00e3o"],
  ["NAO", "N\u00c3O"],
  ["nao", "n\u00e3o"],
  ["Numero", "N\u00famero"],
  ["numero", "n\u00famero"],
  ["Obrigacoes", "Obriga\u00e7\u00f5es"],
  ["obrigacoes", "obriga\u00e7\u00f5es"],
  ["Organico", "Org\u00e2nico"],
  ["organico", "org\u00e2nico"],
  ["Organizacao", "Organiza\u00e7\u00e3o"],
  ["organizacao", "organiza\u00e7\u00e3o"],
  ["Orientacao", "Orienta\u00e7\u00e3o"],
  ["orientacao", "orienta\u00e7\u00e3o"],
  ["Padrao", "Padr\u00e3o"],
  ["padrao", "padr\u00e3o"],
  ["Padroes", "Padr\u00f5es"],
  ["padroes", "padr\u00f5es"],
  ["Participacao", "Participa\u00e7\u00e3o"],
  ["participacao", "participa\u00e7\u00e3o"],
  ["Periodo", "Per\u00edodo"],
  ["periodo", "per\u00edodo"],
  ["Percepcao", "Percep\u00e7\u00e3o"],
  ["percepcao", "percep\u00e7\u00e3o"],
  ["Possivel", "Poss\u00edvel"],
  ["possivel", "poss\u00edvel"],
  ["Pratica", "Pr\u00e1tica"],
  ["pratica", "pr\u00e1tica"],
  ["Praticas", "Pr\u00e1ticas"],
  ["praticas", "pr\u00e1ticas"],
  ["Principios", "Princ\u00edpios"],
  ["principios", "princ\u00edpios"],
  ["Promocao", "Promo\u00e7\u00e3o"],
  ["promocao", "promo\u00e7\u00e3o"],
  ["Protecao", "Prote\u00e7\u00e3o"],
  ["protecao", "prote\u00e7\u00e3o"],
  ["Proxima", "Pr\u00f3xima"],
  ["proxima", "pr\u00f3xima"],
  ["Proprio", "Pr\u00f3prio"],
  ["proprio", "pr\u00f3prio"],
  ["Recuperacao", "Recupera\u00e7\u00e3o"],
  ["recuperacao", "recupera\u00e7\u00e3o"],
  ["Relacao", "Rela\u00e7\u00e3o"],
  ["relacao", "rela\u00e7\u00e3o"],
  ["Relacoes", "Rela\u00e7\u00f5es"],
  ["relacoes", "rela\u00e7\u00f5es"],
  ["Reflexao", "Reflex\u00e3o"],
  ["reflexao", "reflex\u00e3o"],
  ["Reposicao", "Reposi\u00e7\u00e3o"],
  ["reposicao", "reposi\u00e7\u00e3o"],
  ["Saude", "Sa\u00fade"],
  ["saude", "sa\u00fade"],
  ["Sao", "S\u00e3o"],
  ["sao", "s\u00e3o"],
  ["Satisfacao", "Satisfa\u00e7\u00e3o"],
  ["satisfacao", "satisfa\u00e7\u00e3o"],
  ["Seguranca", "Seguran\u00e7a"],
  ["seguranca", "seguran\u00e7a"],
  ["Situacoes", "Situa\u00e7\u00f5es"],
  ["situacoes", "situa\u00e7\u00f5es"],
  ["Tambem", "Tamb\u00e9m"],
  ["tambem", "tamb\u00e9m"],
  ["Tecnica", "T\u00e9cnica"],
  ["tecnica", "t\u00e9cnica"],
  ["Tecnicas", "T\u00e9cnicas"],
  ["tecnicas", "t\u00e9cnicas"],
  ["Tatica", "T\u00e1tica"],
  ["tatica", "t\u00e1tica"],
  ["Unico", "\u00danico"],
  ["unico", "\u00fanico"],
  ["Varias", "V\u00e1rias"],
  ["varias", "v\u00e1rias"]
];

const literalRegex = /(["'`])((?:\\[\s\S]|(?!\1)[\s\S])*?)\1/g;

function walkPhysicalEducationFiles() {
  const files = [];
  for (const serie of ["1-serie", "2-serie", "3-serie"]) {
    const dir = path.join(banksRoot, serie, "educacao-fisica");
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
    .replace(/\be preciso\b/g, "\u00e9 preciso");
}

function replaceLiterals(source) {
  return source.replace(literalRegex, (match, quote, inner) => {
    const fixed = fixText(inner);
    if (fixed === inner) return match;
    return `${quote}${fixed}${quote}`;
  });
}

let changed = 0;
for (const file of walkPhysicalEducationFiles()) {
  const source = fs.readFileSync(file, "utf8");
  const fixed = replaceLiterals(source);
  if (fixed !== source) {
    fs.writeFileSync(file, fixed, "utf8");
    changed += 1;
    console.log(`Corrigido: ${path.relative(repoRoot, file)}`);
  }
}

console.log(`Arquivos alterados: ${changed}`);
