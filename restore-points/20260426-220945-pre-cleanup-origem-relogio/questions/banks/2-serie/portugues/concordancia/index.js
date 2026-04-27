import { createPortugueseTopic } from "../../../_shared/portugueseTopicFactory.js";

const blocos = [
  { subtopico: "Conceitos gerais", habilidade: "identificar o principio de concordancia na frase", tags: ["concordancia", "conceitos"], fatos: [
    { lead: "a concordancia verbal", answer: "a relacao de ajuste entre o verbo e o sujeito", why: "numero e pessoa do sujeito orientam a forma verbal" },
    { lead: "a concordancia nominal", answer: "a relacao de ajuste entre nomes e palavras que os determinam ou caracterizam", why: "artigos, adjetivos e numerais precisam se harmonizar com o nome" },
    { lead: "o principio geral da concordancia", answer: "a adequacao formal entre elementos ligados sintaticamente", why: "essa harmonizacao contribui para clareza e norma padrao" },
    { lead: "a nocao de numero na concordancia", answer: "a variacao entre singular e plural exigida pela estrutura", why: "ela afeta verbos, nomes e determinantes" },
    { lead: "a nocao de pessoa verbal", answer: "a referencia a primeira, segunda ou terceira pessoa do discurso", why: "ela participa do ajuste entre verbo e sujeito" }
  ] },
  { subtopico: "Concordancia verbal basica", habilidade: "reconhecer a concordancia entre verbo e sujeito simples ou composto", tags: ["concordancia-verbal", "basica"], fatos: [
    { lead: "um sujeito simples no singular", answer: "a estrutura que exige verbo normalmente no singular", why: "o nucleo unico do sujeito orienta a flexao verbal" },
    { lead: "um sujeito simples no plural", answer: "a estrutura que exige verbo normalmente no plural", why: "o nucleo sujeito pluraliza a forma verbal" },
    { lead: "um sujeito composto anteposto", answer: "a estrutura que geralmente leva o verbo ao plural", why: "mais de um nucleo sujeito determina flexao plural" },
    { lead: "um sujeito composto posposto", answer: "a estrutura em que o verbo pode concordar com o nucleo mais proximo ou ir ao plural, conforme o caso", why: "a posicao dos nucleos interfere em algumas construcoes" },
    { lead: "a identificacao do nucleo do sujeito", answer: "a etapa essencial para decidir a concordancia verbal correta", why: "o verbo concorda com o nucleo, nao com termos perifericos" }
  ] },
  { subtopico: "Casos especiais de concordancia verbal", habilidade: "analisar construcoes de concordancia verbal menos regulares", tags: ["concordancia-verbal", "casos-especiais"], fatos: [
    { lead: "o verbo haver com sentido de existir", answer: "o verbo que permanece no singular na norma padrao", why: "nessa construcao ele e impessoal" },
    { lead: "o verbo fazer indicando tempo decorrido", answer: "o verbo que permanece no singular na norma padrao", why: "nessa situacao tambem se comporta como impessoal" },
    { lead: "a expressao a maioria de", answer: "uma estrutura que admite concordancia com o nucleo coletivo ou com o termo plural especificador em certos contextos", why: "o uso varia conforme a organizacao sintatica e estilistica" },
    { lead: "a expressao mais de um", answer: "uma estrutura que tende a levar o verbo ao singular", why: "o nucleo quantitativo orienta essa concordancia na norma padrao" },
    { lead: "o sujeito oracional", answer: "a estrutura que costuma exigir verbo no singular", why: "uma oracao inteira exerce a funcao de sujeito da principal" }
  ] },
  { subtopico: "Concordancia com pronome relativo e partitiva", habilidade: "examinar concordancia em estruturas complexas", tags: ["pronome-relativo", "partitivas"], fatos: [
    { lead: "a concordancia com pronome relativo que", answer: "o ajuste verbal com o antecedente retomado pelo relativo", why: "o pronome relativo liga a subordinada ao termo anterior" },
    { lead: "a concordancia com quem", answer: "o uso frequente do verbo na terceira pessoa do singular, com possibilidade estilistica de concordancia com antecedente", why: "essa estrutura admite observacao cuidadosa do registro" },
    { lead: "uma expressao partitiva como parte de", answer: "uma estrutura em que a concordancia pode variar conforme o foco sintatico", why: "o nucleo ou o especificador plural podem influenciar a flexao" },
    { lead: "a expressao um dos que", answer: "a estrutura em que o verbo da subordinada costuma ir ao plural", why: "o relativo retoma um conjunto expresso por que" },
    { lead: "a leitura sintatica em concordancia", answer: "a analise do termo que realmente controla a flexao", why: "aparencia de proximidade nem sempre define a regra" }
  ] },
  { subtopico: "Concordancia nominal basica", habilidade: "identificar ajustes nominais em genero e numero", tags: ["concordancia-nominal", "basica"], fatos: [
    { lead: "a concordancia entre artigo e substantivo", answer: "o ajuste de genero e numero entre determinante e nome", why: "o artigo acompanha a forma do substantivo" },
    { lead: "a concordancia entre adjetivo e substantivo", answer: "o ajuste de genero e numero do adjetivo ao nome que ele caracteriza", why: "essa e a base da concordancia nominal" },
    { lead: "o numeral adjetivo", answer: "o elemento que tambem pode concordar com o substantivo determinado", why: "ele integra a cadeia nominal" },
    { lead: "o pronome adjetivo", answer: "o elemento que acompanha e concorda com o nome a que se refere", why: "seu comportamento se insere na concordancia nominal" },
    { lead: "a cadeia nominal", answer: "o conjunto de palavras ligadas a um nome e submetidas a relacoes de concordancia", why: "artigos, numerais, pronomes e adjetivos participam dela" }
  ] },
  { subtopico: "Adjetivo posposto e varios nucleos", habilidade: "analisar concordancia do adjetivo em estruturas com mais de um nome", tags: ["adjetivo", "varios-nucleos"], fatos: [
    { lead: "o adjetivo posposto a dois substantivos", answer: "o adjetivo que pode ir ao plural concordando com ambos ou concordar com o mais proximo em certos casos", why: "a posicao e a intencao de sentido influenciam a construcao" },
    { lead: "o adjetivo anteposto a dois substantivos", answer: "o adjetivo que geralmente concorda com o substantivo mais proximo", why: "a anteposicao restringe o alcance sintatico imediato" },
    { lead: "a concordancia nominal com substantivos de generos diferentes", answer: "o ajuste frequentemente realizado no masculino plural quando o adjetivo se refere a ambos", why: "essa e a forma nao marcada na norma padrao" },
    { lead: "o alcance do adjetivo na frase", answer: "a extensao dos nomes efetivamente caracterizados por ele", why: "entender esse alcance evita erros de concordancia" },
    { lead: "a leitura semantica em concordancia nominal", answer: "a observacao de se o termo caracteriza um nome ou varios ao mesmo tempo", why: "a interpretacao ajuda a decidir a flexao adequada" }
  ] },
  { subtopico: "Expressoes variaveis e invariaveis", habilidade: "distinguir palavras de comportamento variavel ou invariavel", tags: ["variavel", "invariavel"], fatos: [
    { lead: "a palavra anexo como adjetivo", answer: "o termo que costuma variar para concordar com o nome a que se refere", why: "anexo desempenha papel qualificativo nessa situacao" },
    { lead: "a palavra meio como adverbio", answer: "o termo invariavel quando significa um pouco", why: "nessa funcao nao concorda com o nome" },
    { lead: "a palavra bastante como adjetivo", answer: "o termo variavel quando equivale a suficiente em referencia nominal", why: "nessa funcao entra na concordancia nominal" },
    { lead: "a palavra menos", answer: "o termo invariavel em construcoes de quantidade", why: "ela nao sofre flexao de genero ou numero" },
    { lead: "a diferenca entre classe gramatical e concordancia", answer: "o fato de o comportamento variar conforme a funcao exercida pela palavra", why: "um mesmo vocabulo pode ser variavel em um caso e invariavel em outro" }
  ] },
  { subtopico: "Concordancia com porcentagem e quantidade", habilidade: "resolver concordancia em expressoes numericas", tags: ["porcentagem", "quantidade"], fatos: [
    { lead: "uma expressao de porcentagem com nome expresso", answer: "a estrutura em que o verbo pode concordar com o numero percentual ou com o termo especificador, conforme o caso", why: "a construcao exige leitura cuidadosa da organizacao sintatica" },
    { lead: "uma expressao de porcentagem sem especificador posterior", answer: "a estrutura em que a concordancia tende a acompanhar o numero percentual", why: "o percentual assume o papel mais visivel na frase" },
    { lead: "a expressao um por cento dos alunos", answer: "um caso em que a presenca do especificador plural pode influenciar a concordancia", why: "o contexto sintatico precisa ser observado" },
    { lead: "expressoes como cerca de e mais de", answer: "marcadores quantitativos que pedem atencao ao nucleo que realmente controla a flexao", why: "o verbo nao concorda automaticamente com a palavra mais proxima" },
    { lead: "a leitura de estruturas quantitativas", answer: "a analise do elemento central da expressao numerica para decidir a concordancia", why: "isso evita generalizacoes imprecisas" }
  ] },
  { subtopico: "Concordancia em reescrita", habilidade: "avaliar manutencao de concordancia em reformulacoes", tags: ["reescrita", "aplicacao"], fatos: [
    { lead: "a reescrita com troca de sujeito", answer: "a reformulacao que exige revisar a flexao verbal conforme o novo nucleo", why: "alterar o sujeito muda a concordancia" },
    { lead: "a reescrita com deslocamento de termos", answer: "a reformulacao que nao elimina a necessidade de identificar o termo controlador da concordancia", why: "ordem linear e funcao sintatica nao se confundem" },
    { lead: "a substituicao por pronome", answer: "a reformulacao que pode alterar pessoa, genero ou numero e exigir novo ajuste", why: "pronomes interferem na cadeia de concordancia" },
    { lead: "a manutencao do sentido em concordancia", answer: "a preservacao da relacao correta entre termos apos a reescrita", why: "erro de flexao compromete clareza e norma padrao" },
    { lead: "a revisao final de concordancia", answer: "a verificacao de todos os termos ligados sintaticamente apos a reformulacao", why: "esse procedimento reduz falhas em producao e analise" }
  ] },
  { subtopico: "Analise de desvios", habilidade: "identificar e corrigir desvios de concordancia", tags: ["desvios", "correcao"], fatos: [
    { lead: "um desvio de concordancia verbal", answer: "a inadequacao entre a forma verbal e o termo que funciona como sujeito", why: "a flexao nao respeita a estrutura da frase" },
    { lead: "um desvio de concordancia nominal", answer: "a inadequacao entre nome e palavras que deveriam se harmonizar com ele", why: "o ajuste de genero ou numero fica incorreto" },
    { lead: "a correcao de um desvio", answer: "a adequacao da flexao ao nucleo e a funcao sintatica corretos", why: "corrigir exige compreender a estrutura da oracao" },
    { lead: "a interferencia da oralidade", answer: "um fator que pode levar a construcoes aceitas na fala, mas inadequadas na norma padrao", why: "o estudo de concordancia destaca esse contraste" },
    { lead: "a analise critica da frase", answer: "a leitura que compara forma, regra e efeito de sentido antes de corrigir", why: "isso evita correcoes mecanicas e superficiais" }
  ] }
];

export const concordancia = createPortugueseTopic({
  id: "portugues_concordancia",
  serie: 2,
  topico: "Concordancia",
  prefix: "conc",
  eixo: "Analise linguistica",
  frente: "Concordancia verbal e nominal",
  searchAliases: ["concordancia verbal", "concordancia nominal", "sujeito e verbo", "casos especiais de concordancia", "desvios de concordancia"],
  habilidadesBase: [
    "identificar principios de concordancia verbal e nominal",
    "resolver casos basicos e especiais de concordancia verbal",
    "analisar concordancia nominal com um ou mais nucleos",
    "avaliar estruturas quantitativas e reescritas",
    "identificar e corrigir desvios de concordancia"
  ],
  blocos
});
