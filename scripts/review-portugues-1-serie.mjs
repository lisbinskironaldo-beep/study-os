import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

const targets = [
  "questions/banks/1-serie/portugues/interpretacao-de-texto/index.js",
  "questions/banks/1-serie/portugues/generos-textuais/index.js",
  "questions/banks/1-serie/portugues/funcoes-da-linguagem/index.js",
  "questions/banks/1-serie/portugues/figuras-de-linguagem/index.js",
  "questions/banks/1-serie/portugues/gramatica-classes-de-palavras/index.js",
  "questions/banks/1-serie/portugues/ortografia-e-pontuacao/index.js",
  "questions/banks/1-serie/portugues/literatura-trovadorismo-humanismo-classicismo/index.js"
];

const editableKeys = new Set([
  "materia",
  "topico",
  "subtopico",
  "eixo",
  "frente",
  "searchAliases",
  "subtopicosBase",
  "habilidadesBase",
  "enunciado",
  "opcoes",
  "correta",
  "comentario"
]);

const exactReplacements = [
  ["Portugues", "Portugu\u00eas"],
  ["Interpretacao de Texto", "Interpreta\u00e7\u00e3o de Texto"],
  ["Compreensao e construcao de sentido", "Compreens\u00e3o e constru\u00e7\u00e3o de sentido"],
  ["compreensao textual", "compreens\u00e3o textual"],
  ["leitura e interpretacao", "leitura e interpreta\u00e7\u00e3o"],
  ["inferencia textual", "infer\u00eancia textual"],
  ["Generos Textuais", "G\u00eaneros Textuais"],
  ["Praticas sociais de linguagem", "Pr\u00e1ticas sociais de linguagem"],
  ["esferas de circulacao", "esferas de circula\u00e7\u00e3o"],
  ["generos do discurso", "g\u00eaneros do discurso"],
  ["Artigo de opiniao", "Artigo de opini\u00e3o"],
  ["Funcoes da Linguagem", "Fun\u00e7\u00f5es da Linguagem"],
  ["Comunicacao e sentidos", "Comunica\u00e7\u00e3o e sentidos"],
  ["elementos da comunicacao", "elementos da comunica\u00e7\u00e3o"],
  ["funcoes da linguagem", "fun\u00e7\u00f5es da linguagem"],
  ["intencao comunicativa", "inten\u00e7\u00e3o comunicativa"],
  ["Funcao referencial", "Fun\u00e7\u00e3o referencial"],
  ["Funcao emotiva", "Fun\u00e7\u00e3o emotiva"],
  ["Funcao conativa", "Fun\u00e7\u00e3o conativa"],
  ["Funcao fatica", "Fun\u00e7\u00e3o f\u00e1tica"],
  ["Funcao metalinguistica", "Fun\u00e7\u00e3o metalingu\u00edstica"],
  ["Funcao poetica", "Fun\u00e7\u00e3o po\u00e9tica"],
  ["Figuras de Linguagem", "Figuras de Linguagem"],
  ["linguagem figurada", "linguagem figurada"],
  ["figuras de estilo", "figuras de estilo"],
  ["Metafora", "Met\u00e1fora"],
  ["Comparacao", "Compara\u00e7\u00e3o"],
  ["Metonimia", "Meton\u00edmia"],
  ["Personificacao", "Personifica\u00e7\u00e3o"],
  ["Hiperbole", "Hip\u00e9rbole"],
  ["Antitese", "Ant\u00edtese"],
  ["Aliteracao", "Alitera\u00e7\u00e3o"],
  ["Gramatica Classes de Palavras", "Gram\u00e1tica: Classes de Palavras"],
  ["Analise linguistica", "An\u00e1lise lingu\u00edstica"],
  ["classes gramaticais", "classes gramaticais"],
  ["Conceito geral", "Conceito geral"],
  ["Adverbio", "Adv\u00e9rbio"],
  ["Preposicao", "Preposi\u00e7\u00e3o"],
  ["Conjuncao", "Conjun\u00e7\u00e3o"],
  ["Interjeicao", "Interjei\u00e7\u00e3o"],
  ["Identificacao em contexto", "Identifica\u00e7\u00e3o em contexto"],
  ["Identificacao em frase", "Identifica\u00e7\u00e3o em frase"],
  ["Funcao na oracao", "Fun\u00e7\u00e3o na ora\u00e7\u00e3o"],
  ["Diferenciacao entre generos", "Diferencia\u00e7\u00e3o entre g\u00eaneros"],
  ["Diferenciacao entre funcoes", "Diferencia\u00e7\u00e3o entre fun\u00e7\u00f5es"],
  ["Diferenciacao entre figuras", "Diferencia\u00e7\u00e3o entre figuras"],
  ["Diferenciacao entre classes", "Diferencia\u00e7\u00e3o entre classes"],
  ["Interpretacao indireta", "Interpreta\u00e7\u00e3o indireta"],
  ["Equivalencia de formas", "Equival\u00eancia de formas"],
  ["Genero textual", "G\u00eanero textual"],
  ["Suporte e situacao comunicativa", "Suporte e situa\u00e7\u00e3o comunicativa"],
  ["Informacao explicita", "Informa\u00e7\u00e3o expl\u00edcita"],
  ["Inferencia", "Infer\u00eancia"],
  ["Sentido de palavra e expressao", "Sentido de palavra e express\u00e3o"],
  ["Coesao e referencia", "Coes\u00e3o e refer\u00eancia"],
  ["Fato e opiniao", "Fato e opini\u00e3o"],
  ["Titulo", "T\u00edtulo"],
  ["Relacao entre partes", "Rela\u00e7\u00e3o entre partes"],
  ["Sintese interpretativa", "S\u00edntese interpretativa"],
  ["Resumo compativel", "Resumo compat\u00edvel"],
  ["Ortografia e Pontuacao", "Ortografia e Pontua\u00e7\u00e3o"],
  ["Literatura Trovadorismo Humanismo Classicismo", "Literatura: Trovadorismo, Humanismo e Classicismo"],
  ["A agua entra em ebulicao a 100 graus ao nivel do mar.", "A \u00e1gua entra em ebuli\u00e7\u00e3o a 100 graus ao n\u00edvel do mar."],
  ["O tema principal do texto e:", "O tema principal do texto \u00e9:"],
  ["A ideia central do texto e que", "A ideia central do texto \u00e9 que"],
  ["a ideia principal e:", "a ideia principal \u00e9:"],
  ["O eixo central do texto e ", "O eixo central do texto \u00e9 "],
  ["O suporte mais coerente e ", "O suporte mais coerente \u00e9 "],
  ["o g\u00eanero textual mais compat\u00edvel e:", "o g\u00eanero textual mais compat\u00edvel \u00e9:"],
  ["mais compat\u00edvel e:", "mais compat\u00edvel \u00e9:"],
  ["O resumo correto preserva o foco, a intencao e a situacao principal do texto.", "O resumo correto preserva o foco, a inten\u00e7\u00e3o e a situa\u00e7\u00e3o principal do texto."],
  ["Energia solar e a energia obtida", "Energia solar \u00e9 a energia obtida"],
  ["qual genero textual", "qual g\u00eanero textual"],
  ["qual funcao da linguagem", "qual fun\u00e7\u00e3o da linguagem"],
  ["a qual classe de palavras", "a qual classe de palavras"],
  ["de interesse publico", "de interesse p\u00fablico"],
  ["funcao basica", "fun\u00e7\u00e3o b\u00e1sica"],
  ["situacoes comunicativas", "situa\u00e7\u00f5es comunicativas"],
  ["caracteristicas semelhantes", "caracter\u00edsticas semelhantes"],
  ["efeitos de sentido associados as funcoes da linguagem", "efeitos de sentido associados \u00e0s fun\u00e7\u00f5es da linguagem"],
  ["usos das funcoes da linguagem", "usos das fun\u00e7\u00f5es da linguagem"],
  ["sem conectivo comparativo explicito", "sem conectivo comparativo expl\u00edcito"],
  ["sentidos de palavras e relacoes de referencia", "sentidos de palavras e rela\u00e7\u00f5es de refer\u00eancia"],
  ["informacoes implicitas", "informa\u00e7\u00f5es impl\u00edcitas"],
  ["leituras equivalentes, resumos e interpretacoes indiretas", "leituras equivalentes, resumos e interpreta\u00e7\u00f5es indiretas"],
  ["reconhecer a ideia central e a finalidade de diferentes generos", "reconhecer a ideia central e a finalidade de diferentes g\u00eaneros"],
  ["distinguir generos textuais com caracteristicas proximas", "distinguir g\u00eaneros textuais com caracter\u00edsticas pr\u00f3ximas"],
  ["relacionar exemplos e definicoes de generos textuais", "relacionar exemplos e defini\u00e7\u00f5es de g\u00eaneros textuais"],
  ["distinguir funcoes da linguagem com caracteristicas semelhantes", "distinguir fun\u00e7\u00f5es da linguagem com caracter\u00edsticas semelhantes"],
  ["identificar as funcoes da linguagem", "identificar as fun\u00e7\u00f5es da linguagem"],
  ["distinguir figuras de linguagem semelhantes", "distinguir figuras de linguagem semelhantes"],
  ["relacionar exemplos e definicoes de figuras de linguagem", "relacionar exemplos e defini\u00e7\u00f5es de figuras de linguagem"],
  ["relacionar exemplos e definicoes das classes de palavras", "relacionar exemplos e defini\u00e7\u00f5es das classes de palavras"]
];

const wordReplacements = new Map([
  ["acao", "a\u00e7\u00e3o"],
  ["acoes", "a\u00e7\u00f5es"],
  ["afirmacao", "afirma\u00e7\u00e3o"],
  ["agua", "\u00e1gua"],
  ["ajudara", "ajudar\u00e1"],
  ["Alo", "Al\u00f4"],
  ["alo", "al\u00f4"],
  ["analise", "an\u00e1lise"],
  ["anuncio", "an\u00fancio"],
  ["anuncios", "an\u00fancios"],
  ["apos", "ap\u00f3s"],
  ["artistica", "art\u00edstica"],
  ["ate", "at\u00e9"],
  ["avaliacao", "avalia\u00e7\u00e3o"],
  ["basica", "b\u00e1sica"],
  ["cafe", "caf\u00e9"],
  ["calculo", "c\u00e1lculo"],
  ["capitulo", "cap\u00edtulo"],
  ["caracteristica", "caracter\u00edstica"],
  ["caracteristicas", "caracter\u00edsticas"],
  ["carater", "car\u00e1ter"],
  ["ciencias", "ci\u00eancias"],
  ["circulacao", "circula\u00e7\u00e3o"],
  ["classificacao", "classifica\u00e7\u00e3o"],
  ["classificacoes", "classifica\u00e7\u00f5es"],
  ["coesao", "coes\u00e3o"],
  ["colaboracao", "colabora\u00e7\u00e3o"],
  ["comecou", "come\u00e7ou"],
  ["comparacao", "compara\u00e7\u00e3o"],
  ["compativel", "compat\u00edvel"],
  ["compreensao", "compreens\u00e3o"],
  ["comunicacao", "comunica\u00e7\u00e3o"],
  ["comunitaria", "comunit\u00e1ria"],
  ["conclusao", "conclus\u00e3o"],
  ["confianca", "confian\u00e7a"],
  ["construcao", "constru\u00e7\u00e3o"],
  ["contemplacao", "contempla\u00e7\u00e3o"],
  ["convivencia", "conviv\u00eancia"],
  ["copia", "c\u00f3pia"],
  ["coracao", "cora\u00e7\u00e3o"],
  ["cronica", "cr\u00f4nica"],
  ["critica", "cr\u00edtica"],
  ["critico", "cr\u00edtico"],
  ["definicao", "defini\u00e7\u00e3o"],
  ["definicoes", "defini\u00e7\u00f5es"],
  ["devolucao", "devolu\u00e7\u00e3o"],
  ["dialogo", "di\u00e1logo"],
  ["dicionario", "dicion\u00e1rio"],
  ["didatico", "did\u00e1tico"],
  ["diferenca", "diferen\u00e7a"],
  ["diferenciacao", "diferencia\u00e7\u00e3o"],
  ["dificeis", "dif\u00edceis"],
  ["dificil", "dif\u00edcil"],
  ["distincao", "distin\u00e7\u00e3o"],
  ["distorce-lo", "distorc\u00ea-lo"],
  ["ebulicao", "ebuli\u00e7\u00e3o"],
  ["economia", "economia"],
  ["edicao", "edi\u00e7\u00e3o"],
  ["educacao", "educa\u00e7\u00e3o"],
  ["eletronica", "eletr\u00f4nica"],
  ["emocao", "emo\u00e7\u00e3o"],
  ["emocoes", "emo\u00e7\u00f5es"],
  ["enciclopedia", "enciclop\u00e9dia"],
  ["enfase", "\u00eanfase"],
  ["especifico", "espec\u00edfico"],
  ["espaco", "espa\u00e7o"],
  ["espacos", "espa\u00e7os"],
  ["espontanea", "espont\u00e2nea"],
  ["estatistico", "estat\u00edstico"],
  ["estetica", "est\u00e9tica"],
  ["estetico", "est\u00e9tico"],
  ["exclamacao", "exclama\u00e7\u00e3o"],
  ["experiencia", "experi\u00eancia"],
  ["explicacao", "explica\u00e7\u00e3o"],
  ["explicita", "expl\u00edcita"],
  ["explicito", "expl\u00edcito"],
  ["expressao", "express\u00e3o"],
  ["facil", "f\u00e1cil"],
  ["fatica", "f\u00e1tica"],
  ["fenomeno", "fen\u00f4meno"],
  ["ferias", "f\u00e9rias"],
  ["funcao", "fun\u00e7\u00e3o"],
  ["funcoes", "fun\u00e7\u00f5es"],
  ["fatica", "f\u00e1tica"],
  ["genero", "g\u00eanero"],
  ["generos", "g\u00eaneros"],
  ["gramatica", "gram\u00e1tica"],
  ["grafico", "gr\u00e1fico"],
  ["grafica", "gr\u00e1fica"],
  ["habito", "h\u00e1bito"],
  ["habitos", "h\u00e1bitos"],
  ["horario", "hor\u00e1rio"],
  ["horarios", "hor\u00e1rios"],
  ["humoristica", "humor\u00edstica"],
  ["ideia", "ideia"],
  ["identificacao", "identifica\u00e7\u00e3o"],
  ["imagem", "imagem"],
  ["ja", "j\u00e1"],
  ["ha", "h\u00e1"],
  ["implicitas", "impl\u00edcitas"],
  ["importancia", "import\u00e2ncia"],
  ["inferencia", "infer\u00eancia"],
  ["informacao", "informa\u00e7\u00e3o"],
  ["informacoes", "informa\u00e7\u00f5es"],
  ["inicial", "inicial"],
  ["insatisfacao", "insatisfa\u00e7\u00e3o"],
  ["inseguranca", "inseguran\u00e7a"],
  ["intencao", "inten\u00e7\u00e3o"],
  ["interacao", "intera\u00e7\u00e3o"],
  ["interjeicao", "interjei\u00e7\u00e3o"],
  ["interpretacao", "interpreta\u00e7\u00e3o"],
  ["interpretacoes", "interpreta\u00e7\u00f5es"],
  ["intrinseco", "intr\u00ednseco"],
  ["lirico", "l\u00edrico"],
  ["linguistica", "lingu\u00edstica"],
  ["maquetes", "maquetes"],
  ["materia", "mat\u00e9ria"],
  ["matematico", "matem\u00e1tico"],
  ["metafora", "met\u00e1fora"],
  ["metalinguistica", "metalingu\u00edstica"],
  ["metonimia", "meton\u00edmia"],
  ["mutirao", "mutir\u00e3o"],
  ["nao", "n\u00e3o"],
  ["narrativa", "narrativa"],
  ["nivel", "n\u00edvel"],
  ["noticia", "not\u00edcia"],
  ["noticias", "not\u00edcias"],
  ["onibus", "\u00f4nibus"],
  ["opiniao", "opini\u00e3o"],
  ["oposicao", "oposi\u00e7\u00e3o"],
  ["oracao", "ora\u00e7\u00e3o"],
  ["oracoes", "ora\u00e7\u00f5es"],
  ["organizacao", "organiza\u00e7\u00e3o"],
  ["ortografia", "ortografia"],
  ["pagina", "p\u00e1gina"],
  ["parabens", "parab\u00e9ns"],
  ["paragrafo", "par\u00e1grafo"],
  ["participacao", "participa\u00e7\u00e3o"],
  ["patio", "p\u00e1tio"],
  ["personificacao", "personifica\u00e7\u00e3o"],
  ["poetica", "po\u00e9tica"],
  ["pontuacao", "pontua\u00e7\u00e3o"],
  ["portao", "port\u00e3o"],
  ["praca", "pra\u00e7a"],
  ["pratica", "pr\u00e1tica"],
  ["praticas", "pr\u00e1ticas"],
  ["preocupacao", "preocupa\u00e7\u00e3o"],
  ["preparacao", "prepara\u00e7\u00e3o"],
  ["preposicao", "preposi\u00e7\u00e3o"],
  ["promocao", "promo\u00e7\u00e3o"],
  ["pronome", "pronome"],
  ["propria", "pr\u00f3pria"],
  ["proprio", "pr\u00f3prio"],
  ["proprios", "pr\u00f3prios"],
  ["proximas", "pr\u00f3ximas"],
  ["proximos", "pr\u00f3ximos"],
  ["publicacao", "publica\u00e7\u00e3o"],
  ["publico", "p\u00fablico"],
  ["questao", "quest\u00e3o"],
  ["reacao", "rea\u00e7\u00e3o"],
  ["reacoes", "rea\u00e7\u00f5es"],
  ["reducao", "redu\u00e7\u00e3o"],
  ["referencia", "refer\u00eancia"],
  ["referencias", "refer\u00eancias"],
  ["reflexao", "reflex\u00e3o"],
  ["regioes", "regi\u00f5es"],
  ["relacao", "rela\u00e7\u00e3o"],
  ["relacoes", "rela\u00e7\u00f5es"],
  ["repeticao", "repeti\u00e7\u00e3o"],
  ["reuniao", "reuni\u00e3o"],
  ["residuos", "res\u00edduos"],
  ["resumo", "resumo"],
  ["reutilizacao", "reutiliza\u00e7\u00e3o"],
  ["reutilizaveis", "reutiliz\u00e1veis"],
  ["reutilizavel", "reutiliz\u00e1vel"],
  ["revisao", "revis\u00e3o"],
  ["sabado", "s\u00e1bado"],
  ["satirico", "sat\u00edrico"],
  ["sao", "s\u00e3o"],
  ["secao", "se\u00e7\u00e3o"],
  ["seguranca", "seguran\u00e7a"],
  ["semelhanca", "semelhan\u00e7a"],
  ["sensiveis", "sens\u00edveis"],
  ["sensivel", "sens\u00edvel"],
  ["sensacoes", "sensa\u00e7\u00f5es"],
  ["sera", "ser\u00e1"],
  ["servico", "servi\u00e7o"],
  ["silencio", "sil\u00eancio"],
  ["sintese", "s\u00edntese"],
  ["situacao", "situa\u00e7\u00e3o"],
  ["situacoes", "situa\u00e7\u00f5es"],
  ["so", "s\u00f3"],
  ["solidario", "solid\u00e1rio"],
  ["tambem", "tamb\u00e9m"],
  ["tecnica", "t\u00e9cnica"],
  ["tematico", "tem\u00e1tico"],
  ["telefoneica", "telef\u00f4nica"],
  ["titulo", "t\u00edtulo"],
  ["transito", "tr\u00e2nsito"],
  ["ultimos", "\u00faltimos"],
  ["unica", "\u00fanica"],
  ["unico", "\u00fanico"],
  ["vao", "v\u00e3o"],
  ["vacinacao", "vacina\u00e7\u00e3o"],
  ["varias", "v\u00e1rias"],
  ["veiculo", "ve\u00edculo"],
  ["vespera", "v\u00e9spera"],
  ["voce", "voc\u00ea"],
  ["xicaras", "x\u00edcaras"]
]);

const preserveCase = (source, replacement) => {
  if (source.toUpperCase() === source) return replacement.toUpperCase();
  if (source[0]?.toUpperCase() === source[0]) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function reviseText(input) {
  let output = input;

  for (const [from, to] of exactReplacements) {
    output = output.split(from).join(to);
  }

  for (const [from, to] of wordReplacements) {
    output = output.replace(new RegExp(`\\b${escapeRegex(from)}\\b`, "gi"), (match) =>
      preserveCase(match, to)
    );
  }

  output = output
    .replace(/\besta correta\?/gi, "est\u00e1 correta?")
    .replace(/\besta errada\b/gi, "est\u00e1 errada")
    .replace(/\bEsta correta\b/g, "Est\u00e1 correta")
    .replace(/\besta\b(?=\s+(correta|correto|certa|certo|errada|errado|sendo|em destaque)\b)/gi, "est\u00e1")
    .replace(/\bvoc\u00ea esta\b/gi, "voc\u00ea est\u00e1")
    .replace(/\ba classifica\u00e7\u00e3o correta e\b/gi, "a classifica\u00e7\u00e3o correta \u00e9")
    .replace(/\bA classifica\u00e7\u00e3o correta e\b/g, "A classifica\u00e7\u00e3o correta \u00e9")
    .replace(/\ba figura de linguagem e\b/gi, "a figura de linguagem \u00e9")
    .replace(/\bque a palavra e\b/gi, "que a palavra \u00e9")
    .replace(/\bNumeral e Substantivo sao equivalentes\./g, "Numeral e Substantivo s\u00e3o equivalentes.")
    .replace(/(\ba palavra\b[^"]*"[^"]+"\s+)e(\s+[A-Z\u00c0-\u00ff])/g, "$1\u00e9$2")
    .replace(/\bmais compat\u00edvel e:/gi, "mais compat\u00edvel \u00e9:")
    .replace(/\berro comum esta em\b/gi, (match) =>
      match[0] === "O" ? "O erro comum est\u00e1 em" : "erro comum est\u00e1 em"
    )
    .replace(/\bpegadinha esta em\b/gi, (match) =>
      match[0] === "A" ? "A pegadinha est\u00e1 em" : "pegadinha est\u00e1 em"
    )
    .replace(/\btexto e curto\b/gi, "texto \u00e9 curto")
    .replace(/\baqui ela e\b/gi, "aqui ela \u00e9")
    .replace(/\bde pe\b/gi, "de p\u00e9")
    .replace(/\btem\b(?=\s+(atrasos|duvidas|informacoes|questoes)\b)/gi, "t\u00eam")
    .replace(/\bso\b(?=\s+[A-Za-z])/gi, (match) => preserveCase(match, "s\u00f3"));

  return output;
}

function transformNode(node, key = "") {
  if (Array.isArray(node)) {
    if (editableKeys.has(key)) {
      return node.map((item) => (typeof item === "string" ? reviseText(item) : item));
    }
    return node.map((item) => transformNode(item, key));
  }

  if (!node || typeof node !== "object") {
    return node;
  }

  const next = {};
  for (const [childKey, value] of Object.entries(node)) {
    if (typeof value === "string" && editableKeys.has(childKey)) {
      next[childKey] = reviseText(value);
    } else {
      next[childKey] = transformNode(value, childKey);
    }
  }
  return next;
}

function loadFromHead(relPath) {
  const normalized = relPath.replace(/\\/g, "/");
  return execSync(`git show HEAD:${normalized}`, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024
  });
}

function parseModule(source) {
  const match = source.match(/export const\s+(\w+)\s*=\s*([\s\S]*);\s*$/);
  if (!match) {
    throw new Error("Nao foi possivel identificar o export principal do modulo.");
  }
  const [, exportName, objectSource] = match;
  const data = Function(`return (${objectSource})`)();
  return { exportName, data };
}

for (const relPath of targets) {
  const source = loadFromHead(relPath);
  const { exportName, data } = parseModule(source);
  const revised = transformNode(data);
  const output = `export const ${exportName} = ${JSON.stringify(revised, null, 2)};\n`;
  fs.writeFileSync(path.join(repoRoot, relPath), output, "utf8");
  console.log(`Revisado: ${relPath}`);
}
