import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const banksRoot = path.join(repoRoot, "questions", "banks");

const replacements = [
  ["Portugues", "Portugu\u00eas"],
  ["portugues", "portugu\u00eas"],
  ["Redacao", "Reda\u00e7\u00e3o"],
  ["redacao", "reda\u00e7\u00e3o"],
  ["Dissertacao", "Disserta\u00e7\u00e3o"],
  ["dissertacao", "disserta\u00e7\u00e3o"],
  ["Interpretacao", "Interpreta\u00e7\u00e3o"],
  ["interpretacao", "interpreta\u00e7\u00e3o"],
  ["Avancada", "Avan\u00e7ada"],
  ["avancada", "avan\u00e7ada"],
  ["Coesao", "Coes\u00e3o"],
  ["coesao", "coes\u00e3o"],
  ["Coerencia", "Coer\u00eancia"],
  ["coerencia", "coer\u00eancia"],
  ["Generos", "G\u00eaneros"],
  ["generos", "g\u00eaneros"],
  ["Genero", "G\u00eanero"],
  ["genero", "g\u00eanero"],
  ["Funcoes", "Fun\u00e7\u00f5es"],
  ["funcoes", "fun\u00e7\u00f5es"],
  ["Funcao", "Fun\u00e7\u00e3o"],
  ["funcao", "fun\u00e7\u00e3o"],
  ["Gramatica", "Gram\u00e1tica"],
  ["gramatica", "gram\u00e1tica"],
  ["Ortografia e Pontuacao", "Ortografia e Pontua\u00e7\u00e3o"],
  ["Pontuacao", "Pontua\u00e7\u00e3o"],
  ["pontuacao", "pontua\u00e7\u00e3o"],
  ["Regencia", "Reg\u00eancia"],
  ["regencia", "reg\u00eancia"],
  ["Concordancia", "Concord\u00e2ncia"],
  ["concordancia", "concord\u00e2ncia"],
  ["Sintaxe Periodo", "Sintaxe: Per\u00edodo"],
  ["periodo", "per\u00edodo"],
  ["Periodo", "Per\u00edodo"],
  ["Literatura Trovadorismo Humanismo Classicismo", "Literatura: Trovadorismo, Humanismo e Classicismo"],
  ["Literatura Barroco Arcadismo Romantismo", "Literatura: Barroco, Arcadismo e Romantismo"],
  ["Literatura Realismo Naturalismo Modernismo", "Literatura: Realismo, Naturalismo e Modernismo"],
  ["Arcadismo", "Arcadismo"],
  ["Realismo", "Realismo"],
  ["Naturalismo", "Naturalismo"],
  ["Modernismo", "Modernismo"],
  ["Producao", "Produ\u00e7\u00e3o"],
  ["producao", "produ\u00e7\u00e3o"],
  ["Relacao", "Rela\u00e7\u00e3o"],
  ["relacao", "rela\u00e7\u00e3o"],
  ["Relacoes", "Rela\u00e7\u00f5es"],
  ["relacoes", "rela\u00e7\u00f5es"],
  ["Substituicao", "Substitui\u00e7\u00e3o"],
  ["substituicao", "substitui\u00e7\u00e3o"],
  ["Contradicao", "Contradi\u00e7\u00e3o"],
  ["contradicao", "contradi\u00e7\u00e3o"],
  ["Progressao", "Progress\u00e3o"],
  ["progressao", "progress\u00e3o"],
  ["Articulacao", "Articula\u00e7\u00e3o"],
  ["articulacao", "articula\u00e7\u00e3o"],
  ["Equivalencia", "Equival\u00eancia"],
  ["equivalencia", "equival\u00eancia"],
  ["Compreensao", "Compreens\u00e3o"],
  ["compreensao", "compreens\u00e3o"],
  ["Diferenciacao", "Diferencia\u00e7\u00e3o"],
  ["diferenciacao", "diferencia\u00e7\u00e3o"],
  ["Definicao", "Defini\u00e7\u00e3o"],
  ["definicao", "defini\u00e7\u00e3o"],
  ["Definicoes", "Defini\u00e7\u00f5es"],
  ["definicoes", "defini\u00e7\u00f5es"],
  ["Classificacao", "Classifica\u00e7\u00e3o"],
  ["classificacao", "classifica\u00e7\u00e3o"],
  ["Informacao", "Informa\u00e7\u00e3o"],
  ["informacao", "informa\u00e7\u00e3o"],
  ["Informacoes", "Informa\u00e7\u00f5es"],
  ["informacoes", "informa\u00e7\u00f5es"],
  ["Explicita", "Expl\u00edcita"],
  ["explicita", "expl\u00edcita"],
  ["Explicito", "Expl\u00edcito"],
  ["explicito", "expl\u00edcito"],
  ["Implicita", "Impl\u00edcita"],
  ["implicita", "impl\u00edcita"],
  ["Implicitas", "Impl\u00edcitas"],
  ["implicitas", "impl\u00edcitas"],
  ["Sintese", "S\u00edntese"],
  ["sintese", "s\u00edntese"],
  ["Titulo", "T\u00edtulo"],
  ["titulo", "t\u00edtulo"],
  ["Onibus", "\u00d4nibus"],
  ["onibus", "\u00f4nibus"],
  ["Agua", "\u00c1gua"],
  ["agua", "\u00e1gua"],
  ["Ebulicao", "Ebuli\u00e7\u00e3o"],
  ["ebulicao", "ebuli\u00e7\u00e3o"],
  ["Nivel", "N\u00edvel"],
  ["nivel", "n\u00edvel"],
  ["Alo", "Al\u00f4"],
  ["alo", "al\u00f4"],
  ["Voce", "Voc\u00ea"],
  ["voce", "voc\u00ea"],
  ["Esta", "Est\u00e1"],
  ["esta", "est\u00e1"],
  ["Nao", "N\u00e3o"],
  ["NAO", "N\u00c3O"],
  ["nao", "n\u00e3o"],
  ["Sao", "S\u00e3o"],
  ["sao", "s\u00e3o"],
  ["Tambem", "Tamb\u00e9m"],
  ["tambem", "tamb\u00e9m"],
  ["Ate", "At\u00e9"],
  ["ate", "at\u00e9"],
  ["So", "S\u00f3"],
  ["so", "s\u00f3"],
  ["Ja", "J\u00e1"],
  ["ja", "j\u00e1"],
  ["Ha", "H\u00e1"],
  ["ha", "h\u00e1"],
  ["Analise", "An\u00e1lise"],
  ["analise", "an\u00e1lise"],
  ["Basica", "B\u00e1sica"],
  ["basica", "b\u00e1sica"],
  ["Caracteristicas", "Caracter\u00edsticas"],
  ["caracteristicas", "caracter\u00edsticas"],
  ["Compativel", "Compat\u00edvel"],
  ["compativel", "compat\u00edvel"],
  ["Conteudo", "Conte\u00fado"],
  ["conteudo", "conte\u00fado"],
  ["Esforco", "Esfor\u00e7o"],
  ["esforco", "esfor\u00e7o"],
  ["Desnecessoria", "Desnecess\u00e1ria"],
  ["desnecessoria", "desnecess\u00e1ria"],
  ["Repeticao", "Repeti\u00e7\u00e3o"],
  ["repeticao", "repeti\u00e7\u00e3o"],
  ["Ideia", "Ideia"],
  ["ideia", "ideia"],
  ["Mudanca", "Mudan\u00e7a"],
  ["mudanca", "mudan\u00e7a"],
  ["Habitos", "H\u00e1bitos"],
  ["habitos", "h\u00e1bitos"],
  ["Habito", "H\u00e1bito"],
  ["habito", "h\u00e1bito"],
  ["Situacao", "Situa\u00e7\u00e3o"],
  ["situacao", "situa\u00e7\u00e3o"],
  ["Situacoes", "Situa\u00e7\u00f5es"],
  ["situacoes", "situa\u00e7\u00f5es"],
  ["Ciencias", "Ci\u00eancias"],
  ["ciencias", "ci\u00eancias"],
  ["Matematica", "Matem\u00e1tica"],
  ["matematica", "matem\u00e1tica"],
  ["Equilibrio", "Equil\u00edbrio"],
  ["equilibrio", "equil\u00edbrio"],
  ["Reflexao", "Reflex\u00e3o"],
  ["reflexao", "reflex\u00e3o"],
  ["Historia", "Hist\u00f3ria"],
  ["historia", "hist\u00f3ria"],
  ["Carater", "Car\u00e1ter"],
  ["carater", "car\u00e1ter"],
  ["Tecnica", "T\u00e9cnica"],
  ["tecnica", "t\u00e9cnica"],
  ["Tecnicas", "T\u00e9cnicas"],
  ["tecnicas", "t\u00e9cnicas"],
  ["Acoes", "A\u00e7\u00f5es"],
  ["acoes", "a\u00e7\u00f5es"],
  ["Formacao", "Forma\u00e7\u00e3o"],
  ["formacao", "forma\u00e7\u00e3o"],
  ["Decisao", "Decis\u00e3o"],
  ["decisao", "decis\u00e3o"],
  ["Decisoes", "Decis\u00f5es"],
  ["decisoes", "decis\u00f5es"],
  ["Consequencias", "Consequ\u00eancias"],
  ["consequencias", "consequ\u00eancias"],
  ["Etica", "\u00c9tica"],
  ["etica", "\u00e9tica"],
  ["Filosofico", "Filos\u00f3fico"],
  ["filosofico", "filos\u00f3fico"],
  ["Filosofica", "Filos\u00f3fica"],
  ["filosofica", "filos\u00f3fica"],
  ["Conteudos", "Conte\u00fados"],
  ["conteudos", "conte\u00fados"],
  ["Educacao", "Educa\u00e7\u00e3o"],
  ["educacao", "educa\u00e7\u00e3o"],
  ["Linguisticos", "Lingu\u00edsticos"],
  ["linguisticos", "lingu\u00edsticos"],
  ["Lingua", "L\u00edngua"],
  ["lingua", "l\u00edngua"],
  ["Media", "M\u00e9dia"],
  ["media", "m\u00e9dia"],
  ["Distancia", "Dist\u00e2ncia"],
  ["distancia", "dist\u00e2ncia"],
  ["Frequencia", "Frequ\u00eancia"],
  ["frequencia", "frequ\u00eancia"],
  ["Numero", "N\u00famero"],
  ["numero", "n\u00famero"],
  ["Propagacao", "Propaga\u00e7\u00e3o"],
  ["propagacao", "propaga\u00e7\u00e3o"],
  ["Domestico", "Dom\u00e9stico"],
  ["domestico", "dom\u00e9stico"],
  ["Visivel", "Vis\u00edvel"],
  ["visivel", "vis\u00edvel"],
  ["Possivel", "Poss\u00edvel"],
  ["possivel", "poss\u00edvel"],
  ["Possiveis", "Poss\u00edveis"],
  ["possiveis", "poss\u00edveis"],
  ["Contem", "Cont\u00e9m"],
  ["contem", "cont\u00e9m"],
  ["Variacao", "Varia\u00e7\u00e3o"],
  ["variacao", "varia\u00e7\u00e3o"],
  ["Padrao", "Padr\u00e3o"],
  ["padrao", "padr\u00e3o"],
  ["Preposicao", "Preposi\u00e7\u00e3o"],
  ["preposicao", "preposi\u00e7\u00e3o"],
  ["Sintatica", "Sint\u00e1tica"],
  ["sintatica", "sint\u00e1tica"],
  ["Sintatico", "Sint\u00e1tico"],
  ["sintatico", "sint\u00e1tico"],
  ["Semantica", "Sem\u00e2ntica"],
  ["semantica", "sem\u00e2ntica"],
  ["Grafico", "Gr\u00e1fico"],
  ["grafico", "gr\u00e1fico"],
  ["Presenca", "Presen\u00e7a"],
  ["presenca", "presen\u00e7a"],
  ["Ausencia", "Aus\u00eancia"],
  ["ausencia", "aus\u00eancia"],
  ["Fusao", "Fus\u00e3o"],
  ["fusao", "fus\u00e3o"],
  ["Determinacao", "Determina\u00e7\u00e3o"],
  ["determinacao", "determina\u00e7\u00e3o"],
  ["Manutencao", "Manuten\u00e7\u00e3o"],
  ["manutencao", "manuten\u00e7\u00e3o"],
  ["Construcoes", "Constru\u00e7\u00f5es"],
  ["construcoes", "constru\u00e7\u00f5es"],
  ["Construcao", "Constru\u00e7\u00e3o"],
  ["construcao", "constru\u00e7\u00e3o"],
  ["Observacao", "Observa\u00e7\u00e3o"],
  ["observacao", "observa\u00e7\u00e3o"],
  ["Referencia", "Refer\u00eancia"],
  ["referencia", "refer\u00eancia"],
  ["Referencias", "Refer\u00eancias"],
  ["referencias", "refer\u00eancias"],
  ["Operacao", "Opera\u00e7\u00e3o"],
  ["operacao", "opera\u00e7\u00e3o"],
  ["Aplicacao", "Aplica\u00e7\u00e3o"],
  ["aplicacao", "aplica\u00e7\u00e3o"],
  ["Alteracao", "Altera\u00e7\u00e3o"],
  ["alteracao", "altera\u00e7\u00e3o"],
  ["Alteracoes", "Altera\u00e7\u00f5es"],
  ["alteracoes", "altera\u00e7\u00f5es"],
  ["Supressao", "Supress\u00e3o"],
  ["supressao", "supress\u00e3o"],
  ["Proxima", "Pr\u00f3xima"],
  ["proxima", "pr\u00f3xima"],
  ["Proximas", "Pr\u00f3ximas"],
  ["proximas", "pr\u00f3ximas"],
  ["Sinonimos", "Sin\u00f4nimos"],
  ["sinonimos", "sin\u00f4nimos"],
  ["Consciente", "Consciente"],
  ["Correcao", "Corre\u00e7\u00e3o"],
  ["correcao", "corre\u00e7\u00e3o"],
  ["Estrategia", "Estrat\u00e9gia"],
  ["estrategia", "estrat\u00e9gia"],
  ["Util", "\u00datil"],
  ["util", "\u00fatil"],
  ["Duvida", "D\u00favida"],
  ["duvida", "d\u00favida"],
  ["Duvidas", "D\u00favidas"],
  ["duvidas", "d\u00favidas"],
  ["Atencao", "Aten\u00e7\u00e3o"],
  ["atencao", "aten\u00e7\u00e3o"],
  ["Precisao", "Precis\u00e3o"],
  ["precisao", "precis\u00e3o"],
  ["Disponivel", "Dispon\u00edvel"],
  ["disponivel", "dispon\u00edvel"],
  ["Confiavel", "Confi\u00e1vel"],
  ["confiavel", "confi\u00e1vel"],
  ["Entao", "Ent\u00e3o"],
  ["entao", "ent\u00e3o"],
  ["Tendencia", "Tend\u00eancia"],
  ["tendencia", "tend\u00eancia"],
  ["Familias", "Fam\u00edlias"],
  ["familias", "fam\u00edlias"],
  ["famalas", "fam\u00edlias"],
  ["famalias", "fam\u00edlias"],
  ["Transformacoes", "Transforma\u00e7\u00f5es"],
  ["transformacoes", "transforma\u00e7\u00f5es"],
  ["Plausivel", "Plaus\u00edvel"],
  ["plausivel", "plaus\u00edvel"],
  ["Divulgacao", "Divulga\u00e7\u00e3o"],
  ["divulgacao", "divulga\u00e7\u00e3o"],
  ["Adesao", "Ades\u00e3o"],
  ["adesao", "ades\u00e3o"],
  ["Cientifico", "Cient\u00edfico"],
  ["cientifico", "cient\u00edfico"],
  ["Soculo", "S\u00e9culo"],
  ["soculo", "s\u00e9culo"],
  ["Seculo", "S\u00e9culo"],
  ["seculo", "s\u00e9culo"],
  ["Avanao", "Avan\u00e7o"],
  ["avanao", "avan\u00e7o"],
  ["Representacao", "Representa\u00e7\u00e3o"],
  ["representacao", "representa\u00e7\u00e3o"],
  ["Polissemicos", "Poliss\u00eamicos"],
  ["polissemicos", "poliss\u00eamicos"],
  ["Questoes", "Quest\u00f5es"],
  ["questoes", "quest\u00f5es"],
  ["Objetivas", "Objetivas"],
  ["raciocinio", "racioc\u00ednio"],
  ["logicos", "l\u00f3gicos"],
  ["logica", "l\u00f3gica"],
  ["explicitas", "expl\u00edcitas"],
  ["proprio", "pr\u00f3prio"],
  ["propria", "pr\u00f3pria"],
  ["proprias", "pr\u00f3prias"],
  ["afirmacoes", "afirma\u00e7\u00f5es"],
  ["avaliacao", "avalia\u00e7\u00e3o"],
  ["argumentacao", "argumenta\u00e7\u00e3o"],
  ["argumentativo", "argumentativo"],
  ["organizar", "organizar"],
  ["organizacao", "organiza\u00e7\u00e3o"],
  ["introducao", "introdu\u00e7\u00e3o"],
  ["conclusao", "conclus\u00e3o"],
  ["discussao", "discuss\u00e3o"],
  ["sintese", "s\u00edntese"],
  ["direcao", "dire\u00e7\u00e3o"],
  ["delimitacao", "delimita\u00e7\u00e3o"],
  ["especifica", "espec\u00edfica"],
  ["sera", "ser\u00e1"],
  ["tematico", "tem\u00e1tico"],
  ["tematica", "tem\u00e1tica"],
  ["coletanea", "colet\u00e2nea"],
  ["posicao", "posi\u00e7\u00e3o"],
  ["sustentavel", "sustent\u00e1vel"],
  ["consequencia", "consequ\u00eancia"],
  ["logicos", "l\u00f3gicos"],
  ["exemplificacao", "exemplifica\u00e7\u00e3o"],
  ["referencia", "refer\u00eancia"],
  ["reforcar", "refor\u00e7ar"],
  ["consistencia", "consist\u00eancia"],
  ["repertorio", "repert\u00f3rio"],
  ["ciencia", "ci\u00eancia"],
  ["citacao", "cita\u00e7\u00e3o"],
  ["pratica", "pr\u00e1tica"],
  ["conexao", "conex\u00e3o"],
  ["recuperar informacoes", "recuperar informa\u00e7\u00f5es"],
  ["substituicoes", "substitui\u00e7\u00f5es"],
  ["lexicais", "lexicais"],
  ["paragrafo", "par\u00e1grafo"],
  ["dominio", "dom\u00ednio"],
  ["aderencia", "ader\u00eancia"],
  ["selecao", "sele\u00e7\u00e3o"],
  ["forca", "for\u00e7a"],
  ["intervencao", "interven\u00e7\u00e3o"],
  ["apresentacao", "apresenta\u00e7\u00e3o"],
  ["responsavel", "respons\u00e1vel"],
  ["acao", "a\u00e7\u00e3o"],
  ["solucao", "solu\u00e7\u00e3o"],
  ["dispersao", "dispers\u00e3o"],
  ["previa", "pr\u00e9via"],
  ["sustentarao", "sustentar\u00e3o"],
  ["aperfeicoa", "aperfei\u00e7oa"],
  ["eliminacao", "elimina\u00e7\u00e3o"],
  ["especificos", "espec\u00edficos"],
  ["citada", "citada"],
  ["critica", "cr\u00edtica"]
];

const literalRegex = /(["'`])((?:\\[\s\S]|(?!\1)[\s\S])*?)\1/g;

function walkPortugueseFiles() {
  const files = [];
  for (const serie of ["1-serie", "2-serie", "3-serie"]) {
    const dir = path.join(banksRoot, serie, "portugues");
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

function fixText(value) {
  if (isTechnicalString(value)) return value;
  let output = value;
  for (const [from, to] of replacements) {
    if (from.startsWith(" ") || from.endsWith(" ")) {
      output = output.split(from).join(to);
    } else {
      output = output.replace(new RegExp(`\\b${escapeRegex(from)}\\b`, "g"), to);
    }
  }

  return output
    .replace(/\bcorreta e:/gi, "correta \u00e9:")
    .replace(/\berro logico e:/gi, "erro l\u00f3gico \u00e9:")
    .replace(/\bportanto e\b/gi, "portanto \u00e9")
    .replace(/\blogo e\b/gi, "logo \u00e9")
    .replace(/\bent\u00e3o e\b/gi, "ent\u00e3o \u00e9")
    .replace(/\bse e\b/gi, "se \u00e9")
    .replace(/\bela e\b/gi, "ela \u00e9")
    .replace(/\bele e\b/gi, "ele \u00e9")
    .replace(/\bo texto e\b/gi, "o texto \u00e9")
    .replace(/\ba tese e:/gi, "a tese \u00e9:")
    .replace(/\ba ideia .* e /gi, (match) => match.replace(/\se\s/g, " \u00e9 "))
    .replace(/\bcomportamento humano e previs\u00edvel\b/gi, "comportamento humano \u00e9 previs\u00edvel")
    .replace(/\bligada as transforma\u00e7\u00f5es\b/gi, "ligada \u00e0s transforma\u00e7\u00f5es")
    .replace(/\bligado as transforma\u00e7\u00f5es\b/gi, "ligado \u00e0s transforma\u00e7\u00f5es")
    .replace(/\bassociado a mudan\u00e7as\b/gi, "associado a mudan\u00e7as")
    .replace(/\bcr\u00edtica a hipocrisia\b/gi, "cr\u00edtica \u00e0 hipocrisia")
    .replace(/\best\u00e1 relacionada principalmente e:/gi, "est\u00e1 relacionada principalmente a:")
    .replace(/\btema principal do trecho e:/gi, "tema principal do trecho \u00e9:")
    .replace(/\btema principal do texto e:/gi, "tema principal do texto \u00e9:")
    .replace(/\bO foco do texto e\b/g, "O foco do texto \u00e9")
    .replace(/\bA ideia central do texto e\b/g, "A ideia central do texto \u00e9")
    .replace(/\bQual alternativa apresenta\b/g, "Qual alternativa apresenta")
    .replace(/\bpor que\b/g, "por que");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceLiterals(source) {
  return source.replace(literalRegex, (match, quote, inner) => {
    const fixed = fixText(inner);
    if (fixed === inner) return match;
    return `${quote}${fixed}${quote}`;
  });
}

let changed = 0;
for (const file of walkPortugueseFiles()) {
  const source = fs.readFileSync(file, "utf8");
  const fixed = replaceLiterals(source);
  if (fixed !== source) {
    fs.writeFileSync(file, fixed, "utf8");
    changed += 1;
    console.log(`Corrigido: ${path.relative(repoRoot, file)}`);
  }
}

console.log(`Arquivos alterados: ${changed}`);
