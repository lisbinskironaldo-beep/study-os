import { createPortugueseTopic } from "../../../_shared/portugueseTopicFactory.js";

const blocos = [
  { subtopico: "Conceitos gerais", habilidade: "identificar o principio de concordância na frase", tags: ["concordancia", "conceitos"], fatos: [
    { lead: "a concordância verbal", answer: "a relação de ajuste entre o verbo e o sujeito", why: "número e pessoa do sujeito orientam a forma verbal" },
    { lead: "a concordância nominal", answer: "a relação de ajuste entre nomes e palavras que os determinam ou caracterizam", why: "artigos, adjetivos e numerais precisam se harmonizar com o nome" },
    { lead: "o principio geral da concordância", answer: "a adequacao formal entre elementos ligados sintaticamente", why: "essa harmonizacao contribui para clareza e norma padrão" },
    { lead: "a nocao de número na concordância", answer: "a variação entre singular e plural exigida pela estrutura", why: "ela afeta verbos, nomes e determinantes" },
    { lead: "a nocao de pessoa verbal", answer: "a referência a primeira, segunda ou terceira pessoa do discurso", why: "ela participa do ajuste entre verbo e sujeito" }
  ] },
  { subtopico: "Concordância verbal básica", habilidade: "reconhecer a concordância entre verbo e sujeito simples ou composto", tags: ["concordancia-verbal", "basica"], fatos: [
    { lead: "um sujeito simples no singular", answer: "a estrutura que exige verbo normalmente no singular", why: "o nucleo unico do sujeito orienta a flexao verbal" },
    { lead: "um sujeito simples no plural", answer: "a estrutura que exige verbo normalmente no plural", why: "o nucleo sujeito pluraliza a forma verbal" },
    { lead: "um sujeito composto anteposto", answer: "a estrutura que geralmente leva o verbo ao plural", why: "mais de um nucleo sujeito determina flexao plural" },
    { lead: "um sujeito composto posposto", answer: "a estrutura em que o verbo pode concordar com o nucleo mais proximo ou ir ao plural, conforme o caso", why: "a posição dos nucleos interfere em algumas construções" },
    { lead: "a identificacao do nucleo do sujeito", answer: "a etapa essencial para decidir a concordância verbal correta", why: "o verbo concorda com o nucleo, não com termos perifericos" }
  ] },
  { subtopico: "Casos especiais de concordância verbal", habilidade: "analisar construções de concordância verbal menos regulares", tags: ["concordancia-verbal", "casos-especiais"], fatos: [
    { lead: "o verbo haver com sentido de existir", answer: "o verbo que permanece no singular na norma padrão", why: "nessa construção ele é impessoal" },
    { lead: "o verbo fazer indicando tempo decorrido", answer: "o verbo que permanece no singular na norma padrão", why: "nessa situação também se comporta como impessoal" },
    { lead: "a expressao a maioria de", answer: "uma estrutura que admite concordância com o nucleo coletivo ou com o termo plural especificador em certos contextos", why: "o uso varia conforme a organização sintática e estilistica" },
    { lead: "a expressao mais de um", answer: "uma estrutura que tende a levar o verbo ao singular", why: "o nucleo quantitativo orienta essa concordância na norma padrão" },
    { lead: "o sujeito oracional", answer: "a estrutura que costuma exigir verbo no singular", why: "uma oracao inteira exerce a função de sujeito da principal" }
  ] },
  { subtopico: "Concordância com pronome relativo e partitiva", habilidade: "examinar concordância em estruturas complexas", tags: ["pronome-relativo", "partitivas"], fatos: [
    { lead: "a concordância com pronome relativo que", answer: "o ajuste verbal com o antecedente retomado pelo relativo", why: "o pronome relativo liga a subordinada ao termo anterior" },
    { lead: "a concordância com quem", answer: "o uso frequente do verbo na terceira pessoa do singular, com possibilidade estilistica de concordância com antecedente", why: "essa estrutura admite observação cuidadosa do registro" },
    { lead: "uma expressao partitiva como parte de", answer: "uma estrutura em que a concordância pode variar conforme o foco sintático", why: "o nucleo ou o especificador plural podem influenciar a flexao" },
    { lead: "a expressao um dos que", answer: "a estrutura em que o verbo da subordinada costuma ir ao plural", why: "o relativo retoma um conjunto expresso por que" },
    { lead: "a leitura sintática em concordância", answer: "a análise do termo que realmente controla a flexao", why: "aparencia de proximidade nem sempre define a regra" }
  ] },
  { subtopico: "Concordância nominal básica", habilidade: "identificar ajustes nominais em gênero e número", tags: ["concordancia-nominal", "basica"], fatos: [
    { lead: "a concordância entre artigo e substantivo", answer: "o ajuste de gênero e número entre determinante e nome", why: "o artigo acompanha a forma do substantivo" },
    { lead: "a concordância entre adjetivo e substantivo", answer: "o ajuste de gênero e número do adjetivo ao nome que ele caracteriza", why: "essa e a base da concordância nominal" },
    { lead: "o numeral adjetivo", answer: "o elemento que também pode concordar com o substantivo determinado", why: "ele integra a cadeia nominal" },
    { lead: "o pronome adjetivo", answer: "o elemento que acompanha e concorda com o nome a que se refere", why: "seu comportamento se insere na concordância nominal" },
    { lead: "a cadeia nominal", answer: "o conjunto de palavras ligadas a um nome e submetidas a relações de concordância", why: "artigos, numerais, pronomes e adjetivos participam dela" }
  ] },
  { subtopico: "Adjetivo posposto e varios nucleos", habilidade: "analisar concordância do adjetivo em estruturas com mais de um nome", tags: ["adjetivo", "varios-nucleos"], fatos: [
    { lead: "o adjetivo posposto a dois substantivos", answer: "o adjetivo que pode ir ao plural concordando com ambos ou concordar com o mais proximo em certos casos", why: "a posição e a intencao de sentido influenciam a construção" },
    { lead: "o adjetivo anteposto a dois substantivos", answer: "o adjetivo que geralmente concorda com o substantivo mais proximo", why: "a anteposicao restringe o alcance sintático imediato" },
    { lead: "a concordância nominal com substantivos de gêneros diferentes", answer: "o ajuste frequentemente realizado no masculino plural quando o adjetivo se refere a ambos", why: "essa e a forma não marcada na norma padrão" },
    { lead: "o alcance do adjetivo na frase", answer: "a extensao dos nomes efetivamente caracterizados por ele", why: "entender esse alcance evita erros de concordância" },
    { lead: "a leitura semântica em concordância nominal", answer: "a observação de se o termo caracteriza um nome ou varios ao mesmo tempo", why: "a interpretação ajuda a decidir a flexao adequada" }
  ] },
  { subtopico: "Expressoes variaveis e invariaveis", habilidade: "distinguir palavras de comportamento variavel ou invariavel", tags: ["variavel", "invariavel"], fatos: [
    { lead: "a palavra anexo como adjetivo", answer: "o termo que costuma variar para concordar com o nome a que se refere", why: "anexo desempenha papel qualificativo nessa situação" },
    { lead: "a palavra meio como adverbio", answer: "o termo invariavel quando significa um pouco", why: "nessa função não concorda com o nome" },
    { lead: "a palavra bastante como adjetivo", answer: "o termo variavel quando equivale a suficiente em referência nominal", why: "nessa função entra na concordância nominal" },
    { lead: "a palavra menos", answer: "o termo invariavel em construções de quantidade", why: "ela não sofre flexao de gênero ou número" },
    { lead: "a diferenca entre classe gramatical e concordância", answer: "o fato de o comportamento variar conforme a função exercida pela palavra", why: "um mesmo vocabulo pode ser variavel em um caso e invariavel em outro" }
  ] },
  { subtopico: "Concordância com porcentagem e quantidade", habilidade: "resolver concordância em expressoes numericas", tags: ["porcentagem", "quantidade"], fatos: [
    { lead: "uma expressao de porcentagem com nome expresso", answer: "a estrutura em que o verbo pode concordar com o número percentual ou com o termo especificador, conforme o caso", why: "a construção exige leitura cuidadosa da organização sintática" },
    { lead: "uma expressao de porcentagem sem especificador posterior", answer: "a estrutura em que a concordância tende a acompanhar o número percentual", why: "o percentual assume o papel mais visível na frase" },
    { lead: "a expressao um por cento dos alunos", answer: "um caso em que a presença do especificador plural pode influenciar a concordância", why: "o contexto sintático precisa ser observado" },
    { lead: "expressoes como cerca de e mais de", answer: "marcadores quantitativos que pedem atenção ao nucleo que realmente controla a flexao", why: "o verbo não concorda automaticamente com a palavra mais próxima" },
    { lead: "a leitura de estruturas quantitativas", answer: "a análise do elemento central da expressao numerica para decidir a concordância", why: "isso evita generalizacoes imprecisas" }
  ] },
  { subtopico: "Concordância em reescrita", habilidade: "avaliar manutenção de concordância em reformulacoes", tags: ["reescrita", "aplicacao"], fatos: [
    { lead: "a reescrita com troca de sujeito", answer: "a reformulacao que exige revisar a flexao verbal conforme o novo nucleo", why: "alterar o sujeito muda a concordância" },
    { lead: "a reescrita com deslocamento de termos", answer: "a reformulacao que não elimina a necessidade de identificar o termo controlador da concordância", why: "ordem linear e função sintática não se confundem" },
    { lead: "a substituição por pronome", answer: "a reformulacao que pode alterar pessoa, gênero ou número e exigir novo ajuste", why: "pronomes interferem na cadeia de concordância" },
    { lead: "a manutenção do sentido em concordância", answer: "a preservacao da relação correta entre termos apos a reescrita", why: "erro de flexao compromete clareza e norma padrão" },
    { lead: "a revisao final de concordância", answer: "a verificacao de todos os termos ligados sintaticamente apos a reformulacao", why: "esse procedimento reduz falhas em produção e análise" }
  ] },
  { subtopico: "Análise de desvios", habilidade: "identificar e corrigir desvios de concordância", tags: ["desvios", "correcao"], fatos: [
    { lead: "um desvio de concordância verbal", answer: "a inadequacao entre a forma verbal e o termo que funciona como sujeito", why: "a flexao não respeita a estrutura da frase" },
    { lead: "um desvio de concordância nominal", answer: "a inadequacao entre nome e palavras que deveriam se harmonizar com ele", why: "o ajuste de gênero ou número fica incorreto" },
    { lead: "a correção de um desvio", answer: "a adequacao da flexao ao nucleo e a função sintática corretos", why: "corrigir exige compreender a estrutura da oracao" },
    { lead: "a interferencia da oralidade", answer: "um fator que pode levar a construções aceitas na fala, mas inadequadas na norma padrão", why: "o estudo de concordância destaca esse contraste" },
    { lead: "a análise crítica da frase", answer: "a leitura que compara forma, regra e efeito de sentido antes de corrigir", why: "isso evita correcoes mecanicas e superficiais" }
  ] }
];

export const concordancia = createPortugueseTopic({
  id: "portugues_concordancia",
  serie: 2,
  topico: "Concordância",
  prefix: "conc",
  eixo: "Análise linguistica",
  frente: "Concordância verbal e nominal",
  searchAliases: ["concordância verbal", "concordância nominal", "sujeito e verbo", "casos especiais de concordância", "desvios de concordância"],
  habilidadesBase: [
    "identificar principios de concordância verbal e nominal",
    "resolver casos basicos e especiais de concordância verbal",
    "analisar concordância nominal com um ou mais nucleos",
    "avaliar estruturas quantitativas e reescritas",
    "identificar e corrigir desvios de concordância"
  ],
  blocos
});
