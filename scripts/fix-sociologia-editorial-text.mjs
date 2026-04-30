import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const banksRoot = path.join(repoRoot, "questions", "banks");

const replacements = [
  ["Acao", "A\u00e7\u00e3o"],
  ["acao", "a\u00e7\u00e3o"],
  ["Acoes", "A\u00e7\u00f5es"],
  ["acoes", "a\u00e7\u00f5es"],
  ["Aleatorio", "Aleat\u00f3rio"],
  ["aleatorio", "aleat\u00f3rio"],
  ["Analise", "An\u00e1lise"],
  ["analise", "an\u00e1lise"],
  ["Apropriacao", "Apropria\u00e7\u00e3o"],
  ["apropriacao", "apropria\u00e7\u00e3o"],
  ["Arbitrio", "Arb\u00edtrio"],
  ["arbitrio", "arb\u00edtrio"],
  ["Atencao", "Aten\u00e7\u00e3o"],
  ["atencao", "aten\u00e7\u00e3o"],
  ["Atividade historica", "Atividade hist\u00f3rica"],
  ["atividade historica", "atividade hist\u00f3rica"],
  ["Atuacao", "Atua\u00e7\u00e3o"],
  ["atuacao", "atua\u00e7\u00e3o"],
  ["Avaliacao", "Avalia\u00e7\u00e3o"],
  ["avaliacao", "avalia\u00e7\u00e3o"],
  ["Biologico", "Biol\u00f3gico"],
  ["biologico", "biol\u00f3gico"],
  ["Caracteristicas", "Caracter\u00edsticas"],
  ["caracteristicas", "caracter\u00edsticas"],
  ["Cidadaos", "Cidad\u00e3os"],
  ["cidadaos", "cidad\u00e3os"],
  ["Circulacao", "Circula\u00e7\u00e3o"],
  ["circulacao", "circula\u00e7\u00e3o"],
  ["Conclusao", "Conclus\u00e3o"],
  ["conclusao", "conclus\u00e3o"],
  ["Condicao", "Condi\u00e7\u00e3o"],
  ["condicao", "condi\u00e7\u00e3o"],
  ["Consciencia", "Consci\u00eancia"],
  ["consciencia", "consci\u00eancia"],
  ["Constituicao", "Constitui\u00e7\u00e3o"],
  ["constituicao", "constitui\u00e7\u00e3o"],
  ["Construcao", "Constru\u00e7\u00e3o"],
  ["construcao", "constru\u00e7\u00e3o"],
  ["Contradicoes", "Contradi\u00e7\u00f5es"],
  ["contradicoes", "contradi\u00e7\u00f5es"],
  ["Crencas", "Cren\u00e7as"],
  ["crencas", "cren\u00e7as"],
  ["Criterios", "Crit\u00e9rios"],
  ["criterios", "crit\u00e9rios"],
  ["Criterio", "Crit\u00e9rio"],
  ["criterio", "crit\u00e9rio"],
  ["Critica", "Cr\u00edtica"],
  ["critica", "cr\u00edtica"],
  ["Decisoes", "Decis\u00f5es"],
  ["decisoes", "decis\u00f5es"],
  ["Decisao", "Decis\u00e3o"],
  ["decisao", "decis\u00e3o"],
  ["Diferenca", "Diferen\u00e7a"],
  ["diferenca", "diferen\u00e7a"],
  ["Diferencas", "Diferen\u00e7as"],
  ["diferencas", "diferen\u00e7as"],
  ["Distancia", "Dist\u00e2ncia"],
  ["distancia", "dist\u00e2ncia"],
  ["Distancias", "Dist\u00e2ncias"],
  ["distancias", "dist\u00e2ncias"],
  ["Distribuicao", "Distribui\u00e7\u00e3o"],
  ["distribuicao", "distribui\u00e7\u00e3o"],
  ["Educacao", "Educa\u00e7\u00e3o"],
  ["educacao", "educa\u00e7\u00e3o"],
  ["Equilibrio", "Equil\u00edbrio"],
  ["equilibrio", "equil\u00edbrio"],
  ["Esforco", "Esfor\u00e7o"],
  ["esforco", "esfor\u00e7o"],
  ["Especifico", "Espec\u00edfico"],
  ["especifico", "espec\u00edfico"],
  ["Estavel", "Est\u00e1vel"],
  ["estavel", "est\u00e1vel"],
  ["Esteriotipos", "Estere\u00f3tipos"],
  ["esteriotipos", "estere\u00f3tipos"],
  ["Estereotipos", "Estere\u00f3tipos"],
  ["estereotipos", "estere\u00f3tipos"],
  ["Etnico", "\u00c9tnico"],
  ["etnico", "\u00e9tnico"],
  ["Exclusoes", "Exclus\u00f5es"],
  ["exclusoes", "exclus\u00f5es"],
  ["Experiencias", "Experi\u00eancias"],
  ["experiencias", "experi\u00eancias"],
  ["Fenomeno", "Fen\u00f4meno"],
  ["fenomeno", "fen\u00f4meno"],
  ["Fenomenos", "Fen\u00f4menos"],
  ["fenomenos", "fen\u00f4menos"],
  ["Formacao", "Forma\u00e7\u00e3o"],
  ["formacao", "forma\u00e7\u00e3o"],
  ["Funcao", "Fun\u00e7\u00e3o"],
  ["funcao", "fun\u00e7\u00e3o"],
  ["Funcoes", "Fun\u00e7\u00f5es"],
  ["funcoes", "fun\u00e7\u00f5es"],
  ["Graficos", "Gr\u00e1ficos"],
  ["graficos", "gr\u00e1ficos"],
  ["Genero", "G\u00eanero"],
  ["genero", "g\u00eanero"],
  ["Geracoes", "Gera\u00e7\u00f5es"],
  ["geracoes", "gera\u00e7\u00f5es"],
  ["Habitos", "H\u00e1bitos"],
  ["habitos", "h\u00e1bitos"],
  ["Heranca", "Heran\u00e7a"],
  ["heranca", "heran\u00e7a"],
  ["Hierarquias", "Hierarquias"],
  ["historia", "hist\u00f3ria"],
  ["Historia", "Hist\u00f3ria"],
  ["Historica", "Hist\u00f3rica"],
  ["historica", "hist\u00f3rica"],
  ["Historicamente", "Historicamente"],
  ["Ideia", "Ideia"],
  ["Individuos", "Indiv\u00edduos"],
  ["individuos", "indiv\u00edduos"],
  ["Instituicoes", "Institui\u00e7\u00f5es"],
  ["instituicoes", "institui\u00e7\u00f5es"],
  ["Interpretacao", "Interpreta\u00e7\u00e3o"],
  ["interpretacao", "interpreta\u00e7\u00e3o"],
  ["Juizo", "Ju\u00edzo"],
  ["juizo", "ju\u00edzo"],
  ["Justica", "Justi\u00e7a"],
  ["justica", "justi\u00e7a"],
  ["Laboratorio", "Laborat\u00f3rio"],
  ["laboratorio", "laborat\u00f3rio"],
  ["Logica", "L\u00f3gica"],
  ["logica", "l\u00f3gica"],
  ["Manutencao", "Manuten\u00e7\u00e3o"],
  ["manutencao", "manuten\u00e7\u00e3o"],
  ["Mediacao", "Media\u00e7\u00e3o"],
  ["mediacao", "media\u00e7\u00e3o"],
  ["Nao", "N\u00e3o"],
  ["NAO", "N\u00c3O"],
  ["nao", "n\u00e3o"],
  ["Necessarias", "Necess\u00e1rias"],
  ["necessarias", "necess\u00e1rias"],
  ["Nocao", "No\u00e7\u00e3o"],
  ["nocao", "no\u00e7\u00e3o"],
  ["Numeros", "N\u00fameros"],
  ["numeros", "n\u00fameros"],
  ["Observacao", "Observa\u00e7\u00e3o"],
  ["observacao", "observa\u00e7\u00e3o"],
  ["Opinioes", "Opini\u00f5es"],
  ["opinioes", "opini\u00f5es"],
  ["Oposicao", "Oposi\u00e7\u00e3o"],
  ["oposicao", "oposi\u00e7\u00e3o"],
  ["Organizacao", "Organiza\u00e7\u00e3o"],
  ["organizacao", "organiza\u00e7\u00e3o"],
  ["Padrao", "Padr\u00e3o"],
  ["padrao", "padr\u00e3o"],
  ["Papeis", "Pap\u00e9is"],
  ["papeis", "pap\u00e9is"],
  ["Participacao", "Participa\u00e7\u00e3o"],
  ["participacao", "participa\u00e7\u00e3o"],
  ["Politica", "Pol\u00edtica"],
  ["politica", "pol\u00edtica"],
  ["Politico", "Pol\u00edtico"],
  ["politico", "pol\u00edtico"],
  ["Politicos", "Pol\u00edticos"],
  ["politicos", "pol\u00edticos"],
  ["Possivel", "Poss\u00edvel"],
  ["possivel", "poss\u00edvel"],
  ["Possiveis", "Poss\u00edveis"],
  ["possiveis", "poss\u00edveis"],
  ["Populacao", "Popula\u00e7\u00e3o"],
  ["populacao", "popula\u00e7\u00e3o"],
  ["Posicao", "Posi\u00e7\u00e3o"],
  ["posicao", "posi\u00e7\u00e3o"],
  ["Posicoes", "Posi\u00e7\u00f5es"],
  ["posicoes", "posi\u00e7\u00f5es"],
  ["Producao", "Produ\u00e7\u00e3o"],
  ["producao", "produ\u00e7\u00e3o"],
  ["Propria", "Pr\u00f3pria"],
  ["propria", "pr\u00f3pria"],
  ["Proprio", "Pr\u00f3prio"],
  ["proprio", "pr\u00f3prio"],
  ["Domestico", "Dom\u00e9stico"],
  ["domestico", "dom\u00e9stico"],
  ["Publica", "P\u00fablica"],
  ["publica", "p\u00fablica"],
  ["Publicas", "P\u00fablicas"],
  ["publicas", "p\u00fablicas"],
  ["Publico", "P\u00fablico"],
  ["publico", "p\u00fablico"],
  ["Publicos", "P\u00fablicos"],
  ["publicos", "p\u00fablicos"],
  ["Raciocinio", "Racioc\u00ednio"],
  ["raciocinio", "racioc\u00ednio"],
  ["Racionalizacao", "Racionaliza\u00e7\u00e3o"],
  ["racionalizacao", "racionaliza\u00e7\u00e3o"],
  ["Reacoes", "Rea\u00e7\u00f5es"],
  ["reacoes", "rea\u00e7\u00f5es"],
  ["Reflexao", "Reflex\u00e3o"],
  ["reflexao", "reflex\u00e3o"],
  ["Relacoes", "Rela\u00e7\u00f5es"],
  ["relacoes", "rela\u00e7\u00f5es"],
  ["Relacao", "Rela\u00e7\u00e3o"],
  ["relacao", "rela\u00e7\u00e3o"],
  ["Representacao", "Representa\u00e7\u00e3o"],
  ["representacao", "representa\u00e7\u00e3o"],
  ["Representacoes", "Representa\u00e7\u00f5es"],
  ["representacoes", "representa\u00e7\u00f5es"],
  ["Sao", "S\u00e3o"],
  ["sao", "s\u00e3o"],
  ["Servicos", "Servi\u00e7os"],
  ["servicos", "servi\u00e7os"],
  ["Simbolico", "Simb\u00f3lico"],
  ["simbolico", "simb\u00f3lico"],
  ["Simbolicos", "Simb\u00f3licos"],
  ["simbolicos", "simb\u00f3licos"],
  ["Simbolos", "S\u00edmbolos"],
  ["simbolos", "s\u00edmbolos"],
  ["Situacoes", "Situa\u00e7\u00f5es"],
  ["situacoes", "situa\u00e7\u00f5es"],
  ["Situacao", "Situa\u00e7\u00e3o"],
  ["situacao", "situa\u00e7\u00e3o"],
  ["Socioambientais", "Socioambientais"],
  ["Sociologica", "Sociol\u00f3gica"],
  ["sociologica", "sociol\u00f3gica"],
  ["Sociologico", "Sociol\u00f3gico"],
  ["sociologico", "sociol\u00f3gico"],
  ["Sustentacao", "Sustenta\u00e7\u00e3o"],
  ["sustentacao", "sustenta\u00e7\u00e3o"],
  ["Sustentavel", "Sustent\u00e1vel"],
  ["sustentavel", "sustent\u00e1vel"],
  ["Tambem", "Tamb\u00e9m"],
  ["tambem", "tamb\u00e9m"],
  ["Tecnicas", "T\u00e9cnicas"],
  ["tecnicas", "t\u00e9cnicas"],
  ["Tecnica", "T\u00e9cnica"],
  ["tecnica", "t\u00e9cnica"],
  ["Transformacao", "Transforma\u00e7\u00e3o"],
  ["transformacao", "transforma\u00e7\u00e3o"],
  ["Transformacoes", "Transforma\u00e7\u00f5es"],
  ["transformacoes", "transforma\u00e7\u00f5es"],
  ["Validacao", "Valida\u00e7\u00e3o"],
  ["validacao", "valida\u00e7\u00e3o"],
  ["Variacao", "Varia\u00e7\u00e3o"],
  ["variacao", "varia\u00e7\u00e3o"],
  ["Visiveis", "Vis\u00edveis"],
  ["visiveis", "vis\u00edveis"],
  ["Vinculo", "V\u00ednculo"],
  ["vinculo", "v\u00ednculo"]
];

const literalRegex = /(["'`])((?:\\[\s\S]|(?!\1)[\s\S])*?)\1/g;

function walkSociologyFiles() {
  const files = [];
  for (const serie of ["1-serie", "2-serie", "3-serie"]) {
    const dir = path.join(banksRoot, serie, "sociologia");
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
    .replace(/\bA situa\u00e7\u00e3o apresentada e\b/g, "A situa\u00e7\u00e3o apresentada \u00e9")
    .replace(/\ba situa\u00e7\u00e3o apresentada e\b/g, "a situa\u00e7\u00e3o apresentada \u00e9")
    .replace(/\bQual conclus\u00e3o e mais adequada\b/g, "Qual conclus\u00e3o \u00e9 mais adequada")
    .replace(/\bqual conclus\u00e3o e mais adequada\b/g, "qual conclus\u00e3o \u00e9 mais adequada")
    .replace(/\bQual avalia\u00e7\u00e3o e mais consistente\b/g, "Qual avalia\u00e7\u00e3o \u00e9 mais consistente")
    .replace(/\bqual avalia\u00e7\u00e3o e mais consistente\b/g, "qual avalia\u00e7\u00e3o \u00e9 mais consistente")
    .replace(/\bN\u00e3o e\b/g, "N\u00e3o \u00e9")
    .replace(/\bn\u00e3o e\b/g, "n\u00e3o \u00e9")
    .replace(/\be exatamente\b/g, "\u00e9 exatamente")
    .replace(/\be apenas\b/g, "\u00e9 apenas")
    .replace(/\be somente\b/g, "\u00e9 somente")
    .replace(/\be mais adequada\b/g, "\u00e9 mais adequada")
    .replace(/\be mais consistente\b/g, "\u00e9 mais consistente");
}

function replaceLiterals(source) {
  return source.replace(literalRegex, (match, quote, inner) => {
    const fixed = fixText(inner);
    if (fixed === inner) return match;
    return `${quote}${fixed}${quote}`;
  });
}

let changed = 0;
for (const file of walkSociologyFiles()) {
  const source = fs.readFileSync(file, "utf8");
  const fixed = replaceLiterals(source);
  if (fixed !== source) {
    fs.writeFileSync(file, fixed, "utf8");
    changed += 1;
    console.log(`Corrigido: ${path.relative(repoRoot, file)}`);
  }
}

console.log(`Arquivos alterados: ${changed}`);
