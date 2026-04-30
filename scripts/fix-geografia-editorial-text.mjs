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
  ["Agua", "\u00c1gua"],
  ["agua", "\u00e1gua"],
  ["Analise", "An\u00e1lise"],
  ["analise", "an\u00e1lise"],
  ["Area", "\u00c1rea"],
  ["area", "\u00e1rea"],
  ["Areas", "\u00c1reas"],
  ["areas", "\u00e1reas"],
  ["Atencao", "Aten\u00e7\u00e3o"],
  ["atencao", "aten\u00e7\u00e3o"],
  ["Atmosferica", "Atmosf\u00e9rica"],
  ["atmosferica", "atmosf\u00e9rica"],
  ["Avaliacao", "Avalia\u00e7\u00e3o"],
  ["avaliacao", "avalia\u00e7\u00e3o"],
  ["Balanca", "Balan\u00e7a"],
  ["balanca", "balan\u00e7a"],
  ["Biologica", "Biol\u00f3gica"],
  ["biologica", "biol\u00f3gica"],
  ["Cambio", "C\u00e2mbio"],
  ["cambio", "c\u00e2mbio"],
  ["Caracteristicas", "Caracter\u00edsticas"],
  ["caracteristicas", "caracter\u00edsticas"],
  ["Cartograficas", "Cartogr\u00e1ficas"],
  ["cartograficas", "cartogr\u00e1ficas"],
  ["Ciencia", "Ci\u00eancia"],
  ["ciencia", "ci\u00eancia"],
  ["Circulacao", "Circula\u00e7\u00e3o"],
  ["circulacao", "circula\u00e7\u00e3o"],
  ["Classicos", "Cl\u00e1ssicos"],
  ["classicos", "cl\u00e1ssicos"],
  ["Classificacao", "Classifica\u00e7\u00e3o"],
  ["classificacao", "classifica\u00e7\u00e3o"],
  ["Comercio", "Com\u00e9rcio"],
  ["comercio", "com\u00e9rcio"],
  ["Composicao", "Composi\u00e7\u00e3o"],
  ["composicao", "composi\u00e7\u00e3o"],
  ["Comunicacao", "Comunica\u00e7\u00e3o"],
  ["comunicacao", "comunica\u00e7\u00e3o"],
  ["Condicoes", "Condi\u00e7\u00f5es"],
  ["condicoes", "condi\u00e7\u00f5es"],
  ["Conexoes", "Conex\u00f5es"],
  ["conexoes", "conex\u00f5es"],
  ["Criterios", "Crit\u00e9rios"],
  ["criterios", "crit\u00e9rios"],
  ["Criterio", "Crit\u00e9rio"],
  ["criterio", "crit\u00e9rio"],
  ["Consequencias", "Consequ\u00eancias"],
  ["consequencias", "consequ\u00eancias"],
  ["Consequencia", "Consequ\u00eancia"],
  ["consequencia", "consequ\u00eancia"],
  ["Criancas", "Crian\u00e7as"],
  ["criancas", "crian\u00e7as"],
  ["Decisoes", "Decis\u00f5es"],
  ["decisoes", "decis\u00f5es"],
  ["Decisao", "Decis\u00e3o"],
  ["decisao", "decis\u00e3o"],
  ["Demografica", "Demogr\u00e1fica"],
  ["demografica", "demogr\u00e1fica"],
  ["Demograficos", "Demogr\u00e1ficos"],
  ["demograficos", "demogr\u00e1ficos"],
  ["Dependencias", "Depend\u00eancias"],
  ["dependencias", "depend\u00eancias"],
  ["Dimensoes", "Dimens\u00f5es"],
  ["dimensoes", "dimens\u00f5es"],
  ["Distribuicao", "Distribui\u00e7\u00e3o"],
  ["distribuicao", "distribui\u00e7\u00e3o"],
  ["Distancia", "Dist\u00e2ncia"],
  ["distancia", "dist\u00e2ncia"],
  ["Distancias", "Dist\u00e2ncias"],
  ["distancias", "dist\u00e2ncias"],
  ["Educacao", "Educa\u00e7\u00e3o"],
  ["educacao", "educa\u00e7\u00e3o"],
  ["Economica", "Econ\u00f4mica"],
  ["economica", "econ\u00f4mica"],
  ["Economicas", "Econ\u00f4micas"],
  ["economicas", "econ\u00f4micas"],
  ["Economicos", "Econ\u00f4micos"],
  ["economicos", "econ\u00f4micos"],
  ["Equilibrio", "Equil\u00edbrio"],
  ["equilibrio", "equil\u00edbrio"],
  ["Etica", "\u00c9tica"],
  ["etica", "\u00e9tica"],
  ["Espaco", "Espa\u00e7o"],
  ["espaco", "espa\u00e7o"],
  ["Espacial", "Espacial"],
  ["Estatizacao", "Estatiza\u00e7\u00e3o"],
  ["estatizacao", "estatiza\u00e7\u00e3o"],
  ["Etaria", "Et\u00e1ria"],
  ["etaria", "et\u00e1ria"],
  ["Exportacao", "Exporta\u00e7\u00e3o"],
  ["exportacao", "exporta\u00e7\u00e3o"],
  ["Extracao", "Extra\u00e7\u00e3o"],
  ["extracao", "extra\u00e7\u00e3o"],
  ["Fenomenos", "Fen\u00f4menos"],
  ["fenomenos", "fen\u00f4menos"],
  ["Fisica", "F\u00edsica"],
  ["fisica", "f\u00edsica"],
  ["Formacao", "Forma\u00e7\u00e3o"],
  ["formacao", "forma\u00e7\u00e3o"],
  ["Frequencia", "Frequ\u00eancia"],
  ["frequencia", "frequ\u00eancia"],
  ["Funcao", "Fun\u00e7\u00e3o"],
  ["funcao", "fun\u00e7\u00e3o"],
  ["Funcoes", "Fun\u00e7\u00f5es"],
  ["funcoes", "fun\u00e7\u00f5es"],
  ["Geografica", "Geogr\u00e1fica"],
  ["geografica", "geogr\u00e1fica"],
  ["Geografico", "Geogr\u00e1fico"],
  ["geografico", "geogr\u00e1fico"],
  ["Geologicas", "Geol\u00f3gicas"],
  ["geologicas", "geol\u00f3gicas"],
  ["Geologica", "Geol\u00f3gica"],
  ["geologica", "geol\u00f3gica"],
  ["Geomorfologicos", "Geomorfol\u00f3gicos"],
  ["geomorfologicos", "geomorfol\u00f3gicos"],
  ["Grafico", "Gr\u00e1fico"],
  ["grafico", "gr\u00e1fico"],
  ["Graficos", "Gr\u00e1ficos"],
  ["graficos", "gr\u00e1ficos"],
  ["Habitos", "H\u00e1bitos"],
  ["habitos", "h\u00e1bitos"],
  ["Historicos", "Hist\u00f3ricos"],
  ["historicos", "hist\u00f3ricos"],
  ["Historica", "Hist\u00f3rica"],
  ["historica", "hist\u00f3rica"],
  ["Historia", "Hist\u00f3ria"],
  ["historia", "hist\u00f3ria"],
  ["Importacao", "Importa\u00e7\u00e3o"],
  ["importacao", "importa\u00e7\u00e3o"],
  ["Indicador", "Indicador"],
  ["Inflacao", "Infla\u00e7\u00e3o"],
  ["inflacao", "infla\u00e7\u00e3o"],
  ["Insercao", "Inser\u00e7\u00e3o"],
  ["insercao", "inser\u00e7\u00e3o"],
  ["Integracao", "Integra\u00e7\u00e3o"],
  ["integracao", "integra\u00e7\u00e3o"],
  ["Interpretacao", "Interpreta\u00e7\u00e3o"],
  ["interpretacao", "interpreta\u00e7\u00e3o"],
  ["Logistica", "Log\u00edstica"],
  ["logistica", "log\u00edstica"],
  ["Materias", "Mat\u00e9rias"],
  ["materias", "mat\u00e9rias"],
  ["Media", "M\u00e9dia"],
  ["media", "m\u00e9dia"],
  ["Medicao", "Medi\u00e7\u00e3o"],
  ["medicao", "medi\u00e7\u00e3o"],
  ["Migratorios", "Migrat\u00f3rios"],
  ["migratorios", "migrat\u00f3rios"],
  ["Motivacoes", "Motiva\u00e7\u00f5es"],
  ["motivacoes", "motiva\u00e7\u00f5es"],
  ["Mudanca", "Mudan\u00e7a"],
  ["mudanca", "mudan\u00e7a"],
  ["Nao", "N\u00e3o"],
  ["NAO", "N\u00c3O"],
  ["nao", "n\u00e3o"],
  ["Necessarias", "Necess\u00e1rias"],
  ["necessarias", "necess\u00e1rias"],
  ["Numericas", "Num\u00e9ricas"],
  ["numericas", "num\u00e9ricas"],
  ["Numero", "N\u00famero"],
  ["numero", "n\u00famero"],
  ["Nucleo", "N\u00facleo"],
  ["nucleo", "n\u00facleo"],
  ["Observacao", "Observa\u00e7\u00e3o"],
  ["observacao", "observa\u00e7\u00e3o"],
  ["Oscilacoes", "Oscila\u00e7\u00f5es"],
  ["oscilacoes", "oscila\u00e7\u00f5es"],
  ["Oscilacao", "Oscila\u00e7\u00e3o"],
  ["oscilacao", "oscila\u00e7\u00e3o"],
  ["Ocupacoes", "Ocupa\u00e7\u00f5es"],
  ["ocupacoes", "ocupa\u00e7\u00f5es"],
  ["Pais", "Pa\u00eds"],
  ["pais", "pa\u00eds"],
  ["Paises", "Pa\u00edses"],
  ["paises", "pa\u00edses"],
  ["Periodos", "Per\u00edodos"],
  ["periodos", "per\u00edodos"],
  ["Piramide", "Pir\u00e2mide"],
  ["piramide", "pir\u00e2mide"],
  ["Planicies", "Plan\u00edcies"],
  ["planicies", "plan\u00edcies"],
  ["Politicas", "Pol\u00edticas"],
  ["politicas", "pol\u00edticas"],
  ["Possivel", "Poss\u00edvel"],
  ["possivel", "poss\u00edvel"],
  ["Populacao", "Popula\u00e7\u00e3o"],
  ["populacao", "popula\u00e7\u00e3o"],
  ["Precaria", "Prec\u00e1ria"],
  ["precaria", "prec\u00e1ria"],
  ["Pressao", "Press\u00e3o"],
  ["pressao", "press\u00e3o"],
  ["Projecoes", "Proje\u00e7\u00f5es"],
  ["projecoes", "proje\u00e7\u00f5es"],
  ["Producao", "Produ\u00e7\u00e3o"],
  ["producao", "produ\u00e7\u00e3o"],
  ["Proximos", "Pr\u00f3ximos"],
  ["proximos", "pr\u00f3ximos"],
  ["Raciocinio", "Racioc\u00ednio"],
  ["raciocinio", "racioc\u00ednio"],
  ["Quimica", "Qu\u00edmica"],
  ["quimica", "qu\u00edmica"],
  ["Regiao", "Regi\u00e3o"],
  ["regiao", "regi\u00e3o"],
  ["Regioes", "Regi\u00f5es"],
  ["regioes", "regi\u00f5es"],
  ["Relacoes", "Rela\u00e7\u00f5es"],
  ["relacoes", "rela\u00e7\u00f5es"],
  ["Relacao", "Rela\u00e7\u00e3o"],
  ["relacao", "rela\u00e7\u00e3o"],
  ["Reposicao", "Reposi\u00e7\u00e3o"],
  ["reposicao", "reposi\u00e7\u00e3o"],
  ["Representacao", "Representa\u00e7\u00e3o"],
  ["representacao", "representa\u00e7\u00e3o"],
  ["Resistencia", "Resist\u00eancia"],
  ["resistencia", "resist\u00eancia"],
  ["Rigidos", "R\u00edgidos"],
  ["rigidos", "r\u00edgidos"],
  ["Saude", "Sa\u00fade"],
  ["saude", "sa\u00fade"],
  ["Sao", "S\u00e3o"],
  ["sao", "s\u00e3o"],
  ["Secundario", "Secund\u00e1rio"],
  ["secundario", "secund\u00e1rio"],
  ["Servicos", "Servi\u00e7os"],
  ["servicos", "servi\u00e7os"],
  ["Sismicos", "S\u00edsmicos"],
  ["sismicos", "s\u00edsmicos"],
  ["Situacoes", "Situa\u00e7\u00f5es"],
  ["situacoes", "situa\u00e7\u00f5es"],
  ["Situacao", "Situa\u00e7\u00e3o"],
  ["situacao", "situa\u00e7\u00e3o"],
  ["Superficie", "Superf\u00edcie"],
  ["superficie", "superf\u00edcie"],
  ["Tambem", "Tamb\u00e9m"],
  ["tambem", "tamb\u00e9m"],
  ["Tecnica", "T\u00e9cnica"],
  ["tecnica", "t\u00e9cnica"],
  ["Tecnicas", "T\u00e9cnicas"],
  ["tecnicas", "t\u00e9cnicas"],
  ["Tectonicas", "Tect\u00f4nicas"],
  ["tectonicas", "tect\u00f4nicas"],
  ["Territorio", "Territ\u00f3rio"],
  ["territorio", "territ\u00f3rio"],
  ["Termica", "T\u00e9rmica"],
  ["termica", "t\u00e9rmica"],
  ["Terciario", "Terci\u00e1rio"],
  ["terciario", "terci\u00e1rio"],
  ["Transferencias", "Transfer\u00eancias"],
  ["transferencias", "transfer\u00eancias"],
  ["Transformacao", "Transforma\u00e7\u00e3o"],
  ["transformacao", "transforma\u00e7\u00e3o"],
  ["Transformacoes", "Transforma\u00e7\u00f5es"],
  ["transformacoes", "transforma\u00e7\u00f5es"],
  ["Triangulo", "Tri\u00e2ngulo"],
  ["triangulo", "tri\u00e2ngulo"],
  ["Umidade", "Umidade"],
  ["Variacao", "Varia\u00e7\u00e3o"],
  ["variacao", "varia\u00e7\u00e3o"],
  ["Vegetacao", "Vegeta\u00e7\u00e3o"],
  ["vegetacao", "vegeta\u00e7\u00e3o"],
  ["Visivel", "Vis\u00edvel"],
  ["visivel", "vis\u00edvel"],
  ["Visiveis", "Vis\u00edveis"],
  ["visiveis", "vis\u00edveis"],
  ["Vulcoes", "Vulc\u00f5es"],
  ["vulcoes", "vulc\u00f5es"]
];

const literalRegex = /(["'`])((?:\\[\s\S]|(?!\1)[\s\S])*?)\1/g;

function walkGeographyFiles() {
  const files = [];
  for (const serie of ["1-serie", "2-serie", "3-serie"]) {
    const dir = path.join(banksRoot, serie, "geografia");
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
    .replace(/\be chamado\b/g, "\u00e9 chamado")
    .replace(/\be chamada\b/g, "\u00e9 chamada")
    .replace(/\be dividido\b/g, "\u00e9 dividido")
    .replace(/\be suficiente\b/g, "\u00e9 suficiente")
    .replace(/\be pequena\b/g, "\u00e9 pequena")
    .replace(/\bmapa f\u00edsico \u00e9 um mapa pol\u00edtico\b/g, "mapa f\u00edsico e um mapa pol\u00edtico")
    .replace(/\bprogramas \u00e9 a\u00e7\u00f5es\b/g, "programas e a\u00e7\u00f5es");
}

function replaceLiterals(source) {
  return source.replace(literalRegex, (match, quote, inner) => {
    const fixed = fixText(inner);
    if (fixed === inner) return match;
    return `${quote}${fixed}${quote}`;
  });
}

let changed = 0;
for (const file of walkGeographyFiles()) {
  const source = fs.readFileSync(file, "utf8");
  const fixed = replaceLiterals(source);
  if (fixed !== source) {
    fs.writeFileSync(file, fixed, "utf8");
    changed += 1;
    console.log(`Corrigido: ${path.relative(repoRoot, file)}`);
  }
}

console.log(`Arquivos alterados: ${changed}`);
