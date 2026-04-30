import { createPortugueseTopic } from "../../../_shared/portugueseTopicFactory.js";

const blocos = [
  { subtopico: "Frase, oracao e período", habilidade: "distinguir unidades sintaticas basicas", tags: ["sintaxe", "unidades"], fatos: [
    { lead: "uma frase", answer: "o enunciado com sentido completo, verbal ou não verbal", why: "nem toda frase precisa conter verbo" },
    { lead: "uma oracao", answer: "o enunciado que se organiza em torno de um verbo ou locucao verbal", why: "a presença do verbo marca essa unidade" },
    { lead: "um período", answer: "o enunciado formado por uma ou mais oracoes", why: "ele pode ser simples ou composto" },
    { lead: "um período simples", answer: "o período que possui apenas uma oracao", why: "a estrutura apresenta um unico nucleo verbal" },
    { lead: "um período composto", answer: "o período que possui duas ou mais oracoes", why: "há mais de um nucleo verbal na estrutura" }
  ] },
  { subtopico: "Termos essenciais da oracao", habilidade: "identificar sujeito e predicado", tags: ["termos-essenciais", "sujeito-predicado"], fatos: [
    { lead: "o sujeito", answer: "o termo sobre o qual se declara algo na oracao", why: "ele se relaciona diretamente com o verbo" },
    { lead: "o predicado", answer: "a parte da oracao que contém a informação declarada sobre o sujeito", why: "nele se encontra o nucleo verbal" },
    { lead: "um sujeito simples", answer: "o sujeito com apenas um nucleo", why: "mesmo com varios determinantes, existe apenas um centro nominal" },
    { lead: "um sujeito composto", answer: "o sujeito com dois ou mais nucleos", why: "mais de um elemento exerce a função nuclear" },
    { lead: "um sujeito oculto", answer: "o sujeito não expresso, mas identificavel pela forma verbal ou contexto", why: "ele não aparece escrito, embora possa ser recuperado" }
  ] },
  { subtopico: "Termos integrantes", habilidade: "reconhecer complementos verbais e nominais", tags: ["termos-integrantes", "complementos"], fatos: [
    { lead: "o objeto direto", answer: "o complemento verbal sem preposição obrigatoria", why: "ele completa o sentido de verbos transitivos diretos" },
    { lead: "o objeto indireto", answer: "o complemento verbal exigido com preposição", why: "ele completa o sentido de verbos transitivos indiretos" },
    { lead: "o complemento nominal", answer: "o termo preposicionado que completa o sentido de um nome", why: "substantivos, adjetivos e adverbios podem pedi-lo" },
    { lead: "o agente da passiva", answer: "o termo que prática a ação na voz passiva analitica", why: "ele normalmente aparece introduzido por preposição" },
    { lead: "a transitividade verbal", answer: "a necessidade ou não de complemento para completar o sentido do verbo", why: "ela orienta a identificacao dos termos integrantes" }
  ] },
  { subtopico: "Termos acessorios", habilidade: "identificar modificadores e recursos acessorios", tags: ["termos-acessorios", "adjuntos"], fatos: [
    { lead: "o adjunto adnominal", answer: "o termo que caracteriza, determina ou específica um nome", why: "artigos, adjetivos e locucoes adjetivas podem exercer essa função" },
    { lead: "o adjunto adverbial", answer: "o termo que indica circunstancia de tempo, modo, lugar, causa ou outra nocao", why: "ele modifica o verbo, o adjetivo ou outro adverbio" },
    { lead: "o aposto", answer: "o termo que explica, resume, enumera ou específica outro termo anterior", why: "ele acrescenta informação sem ser essencial a estrutura nuclear" },
    { lead: "o vocativo", answer: "o termo usado para chamar ou interpelar o interlocutor", why: "ele não integra a estrutura sintática do sujeito ou do predicado" },
    { lead: "a função acessoria", answer: "o papel de ampliar, detalhar ou qualificar sentidos sem ser nucleo estrutural", why: "esses termos enriquecem a informação da oracao" }
  ] },
  { subtopico: "Predicacao e tipos de predicado", habilidade: "distinguir classificacoes do predicado e do verbo", tags: ["predicacao", "predicado"], fatos: [
    { lead: "o predicado verbal", answer: "o predicado cujo nucleo e um verbo significativo", why: "a ação verbal concentra a informação central" },
    { lead: "o predicado nominal", answer: "o predicado cujo nucleo e um nome ligado por verbo de ligacao", why: "a caracteristica atribuida ao sujeito ganha destaque" },
    { lead: "o predicado verbo-nominal", answer: "o predicado com dois nucleos, um verbal e um nominal", why: "ele une ação e caracterizacao na mesma estrutura" },
    { lead: "um verbo de ligacao", answer: "o verbo que conecta o sujeito a um predicativo", why: "ele não indica ação principal, mas estado ou qualidade" },
    { lead: "o predicativo do sujeito", answer: "o termo que atribui caracteristica, estado ou classificação ao sujeito", why: "ele aparece com frequência em predicados nominais e verbo-nominais" }
  ] },
  { subtopico: "Coordenacao", habilidade: "reconhecer oracoes coordenadas e seus sentidos", tags: ["coordenacao", "periodo-composto"], fatos: [
    { lead: "a coordenacao", answer: "a relação entre oracoes sintaticamente independentes", why: "nenhuma exerce função sintática dentro da outra" },
    { lead: "uma oracao coordenada sindetica aditiva", answer: "a oracao ligada por conectivo que acrescenta ideia", why: "conjuncoes como e e nem podem marcar esse valor" },
    { lead: "uma oracao coordenada sindetica adversativa", answer: "a oracao ligada por conectivo que expressa oposicao", why: "mas, porem e contudo são marcadores comuns" },
    { lead: "uma oracao coordenada assindetica", answer: "a oracao coordenada sem conjuncao explícita", why: "a ligacao ocorre por justaposicao e pontuação" },
    { lead: "o valor semantico da coordenacao", answer: "a relação de adicao, oposicao, alternancia, conclusão ou explicacao entre oracoes", why: "o sentido depende do conectivo e do contexto" }
  ] },
  { subtopico: "Subordinacao substantiva", habilidade: "identificar oracoes subordinadas substantivas", tags: ["subordinacao", "substantiva"], fatos: [
    { lead: "a subordinacao", answer: "a relação em que uma oracao depende sintaticamente de outra", why: "uma delas exerce função dentro da principal" },
    { lead: "uma oracao subordinada substantiva subjetiva", answer: "a oracao que exerce função de sujeito da principal", why: "ela ocupa o lugar de um substantivo na estrutura" },
    { lead: "uma oracao subordinada substantiva objetiva direta", answer: "a oracao que funciona como objeto direto da principal", why: "ela completa o sentido do verbo sem preposição obrigatoria" },
    { lead: "uma oracao subordinada substantiva completiva nominal", answer: "a oracao que completa o sentido de um nome", why: "ela desempenha função paralela a de complemento nominal" },
    { lead: "o valor nominal de uma subordinada substantiva", answer: "a capacidade de exercer funções próprias de um substantivo", why: "sujeito, objeto e complemento podem ser ocupados por oracao" }
  ] },
  { subtopico: "Subordinacao adjetiva", habilidade: "analisar oracoes subordinadas adjetivas e pontuação", tags: ["subordinacao", "adjetiva"], fatos: [
    { lead: "uma oracao subordinada adjetiva", answer: "a oracao que caracteriza ou específica um nome da principal", why: "ela exerce papel semelhante ao de um adjetivo" },
    { lead: "uma subordinada adjetiva restritiva", answer: "a oracao que delimita o referente sem uso obrigatorio de virgulas", why: "ela seleciona parte do conjunto referido" },
    { lead: "uma subordinada adjetiva explicativa", answer: "a oracao que acrescenta comentario geral sobre o referente entre virgulas", why: "ela não restringe, apenas explica ou comenta" },
    { lead: "o pronome relativo", answer: "o elemento que retoma um termo anterior e introduz a subordinada adjetiva", why: "que, o qual e cujo são exemplos desse recurso" },
    { lead: "o efeito da virgula em adjetivas", answer: "a mudança de sentido entre explicacao geral e restricao do referente", why: "a pontuação altera a interpretação da informação" }
  ] },
  { subtopico: "Subordinacao adverbial", habilidade: "identificar valores circunstanciais das subordinadas adverbiais", tags: ["subordinacao", "adverbial"], fatos: [
    { lead: "uma oracao subordinada adverbial", answer: "a oracao que expressa circunstancia em relação a principal", why: "ela pode indicar causa, tempo, condicao, finalidade e outros valores" },
    { lead: "uma subordinada adverbial causal", answer: "a oracao que apresenta o motivo do fato expresso na principal", why: "ela costuma vir introduzida por conectivos de causa" },
    { lead: "uma subordinada adverbial condicional", answer: "a oracao que estabelece hipotese ou condicao para o fato principal", why: "se é um conectivo frequente nessa relação" },
    { lead: "uma subordinada adverbial concessiva", answer: "a oracao que apresenta obstaculo que não impede a ocorrencia da principal", why: "embora e ainda que marcam esse valor" },
    { lead: "uma subordinada adverbial final", answer: "a oracao que indica finalidade ou objetivo da ação principal", why: "para que e a fim de que introduzem essa nocao" }
  ] },
  { subtopico: "Análise sintática aplicada", habilidade: "aplicar conceitos sintaticos na interpretação e reescrita", tags: ["analise-sintatica", "aplicacao"], fatos: [
    { lead: "a análise sintática", answer: "o estudo das funções exercidas pelos termos e oracoes na estrutura", why: "ela ajuda a compreender forma e sentido do enunciado" },
    { lead: "a reorganizacao de período", answer: "a reescrita que altera ordem sem necessariamente mudar função sintática", why: "identificar funções evita erros de interpretação" },
    { lead: "a expansao de um termo em oracao", answer: "a substituição de uma palavra ou grupo nominal por uma estrutura oracional equivalente", why: "isso aproxima estudo de período simples e composto" },
    { lead: "a reducao de oracao a termo", answer: "a condensacao de ideia oracional em estrutura nominal equivalente", why: "essa habilidade aparece em reescrita e resumo" },
    { lead: "a interpretação guiada pela sintaxe", answer: "a leitura que observa função, conexão e hierarquia entre partes do enunciado", why: "estrutura e sentido caminham juntos na análise textual" }
  ] }
];

export const sintaxePeriodoSimplesEComposto = createPortugueseTopic({
  id: "portugues_sintaxe_periodo_simples_e_composto",
  serie: 2,
  topico: "Sintaxe: Período Simples e Composto",
  prefix: "sps",
  eixo: "Análise linguistica",
  frente: "Sintaxe",
  searchAliases: ["sintaxe", "período simples", "período composto", "oracoes coordenadas", "oracoes subordinadas"],
  habilidadesBase: [
    "distinguir frase, oracao e período",
    "identificar termos essenciais, integrantes e acessorios",
    "classificar predicados e relações de predicacao",
    "reconhecer coordenacao e subordinacao",
    "aplicar análise sintática em reescritas e interpretação"
  ],
  blocos
});
