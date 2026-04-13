import { createPortugueseTopic } from "../../../_shared/portugueseTopicFactory.js";

const blocos = [
  { subtopico: "Frase, oracao e periodo", habilidade: "distinguir unidades sintaticas basicas", tags: ["sintaxe", "unidades"], fatos: [
    { lead: "uma frase", answer: "o enunciado com sentido completo, verbal ou nao verbal", why: "nem toda frase precisa conter verbo" },
    { lead: "uma oracao", answer: "o enunciado que se organiza em torno de um verbo ou locucao verbal", why: "a presenca do verbo marca essa unidade" },
    { lead: "um periodo", answer: "o enunciado formado por uma ou mais oracoes", why: "ele pode ser simples ou composto" },
    { lead: "um periodo simples", answer: "o periodo que possui apenas uma oracao", why: "a estrutura apresenta um unico nucleo verbal" },
    { lead: "um periodo composto", answer: "o periodo que possui duas ou mais oracoes", why: "ha mais de um nucleo verbal na estrutura" }
  ] },
  { subtopico: "Termos essenciais da oracao", habilidade: "identificar sujeito e predicado", tags: ["termos-essenciais", "sujeito-predicado"], fatos: [
    { lead: "o sujeito", answer: "o termo sobre o qual se declara algo na oracao", why: "ele se relaciona diretamente com o verbo" },
    { lead: "o predicado", answer: "a parte da oracao que contem a informacao declarada sobre o sujeito", why: "nele se encontra o nucleo verbal" },
    { lead: "um sujeito simples", answer: "o sujeito com apenas um nucleo", why: "mesmo com varios determinantes, existe apenas um centro nominal" },
    { lead: "um sujeito composto", answer: "o sujeito com dois ou mais nucleos", why: "mais de um elemento exerce a funcao nuclear" },
    { lead: "um sujeito oculto", answer: "o sujeito nao expresso, mas identificavel pela forma verbal ou contexto", why: "ele nao aparece escrito, embora possa ser recuperado" }
  ] },
  { subtopico: "Termos integrantes", habilidade: "reconhecer complementos verbais e nominais", tags: ["termos-integrantes", "complementos"], fatos: [
    { lead: "o objeto direto", answer: "o complemento verbal sem preposicao obrigatoria", why: "ele completa o sentido de verbos transitivos diretos" },
    { lead: "o objeto indireto", answer: "o complemento verbal exigido com preposicao", why: "ele completa o sentido de verbos transitivos indiretos" },
    { lead: "o complemento nominal", answer: "o termo preposicionado que completa o sentido de um nome", why: "substantivos, adjetivos e adverbios podem pedi-lo" },
    { lead: "o agente da passiva", answer: "o termo que pratica a acao na voz passiva analitica", why: "ele normalmente aparece introduzido por preposicao" },
    { lead: "a transitividade verbal", answer: "a necessidade ou nao de complemento para completar o sentido do verbo", why: "ela orienta a identificacao dos termos integrantes" }
  ] },
  { subtopico: "Termos acessorios", habilidade: "identificar modificadores e recursos acessorios", tags: ["termos-acessorios", "adjuntos"], fatos: [
    { lead: "o adjunto adnominal", answer: "o termo que caracteriza, determina ou especifica um nome", why: "artigos, adjetivos e locucoes adjetivas podem exercer essa funcao" },
    { lead: "o adjunto adverbial", answer: "o termo que indica circunstancia de tempo, modo, lugar, causa ou outra nocao", why: "ele modifica o verbo, o adjetivo ou outro adverbio" },
    { lead: "o aposto", answer: "o termo que explica, resume, enumera ou especifica outro termo anterior", why: "ele acrescenta informacao sem ser essencial a estrutura nuclear" },
    { lead: "o vocativo", answer: "o termo usado para chamar ou interpelar o interlocutor", why: "ele nao integra a estrutura sintatica do sujeito ou do predicado" },
    { lead: "a funcao acessoria", answer: "o papel de ampliar, detalhar ou qualificar sentidos sem ser nucleo estrutural", why: "esses termos enriquecem a informacao da oracao" }
  ] },
  { subtopico: "Predicacao e tipos de predicado", habilidade: "distinguir classificacoes do predicado e do verbo", tags: ["predicacao", "predicado"], fatos: [
    { lead: "o predicado verbal", answer: "o predicado cujo nucleo e um verbo significativo", why: "a acao verbal concentra a informacao central" },
    { lead: "o predicado nominal", answer: "o predicado cujo nucleo e um nome ligado por verbo de ligacao", why: "a caracteristica atribuida ao sujeito ganha destaque" },
    { lead: "o predicado verbo-nominal", answer: "o predicado com dois nucleos, um verbal e um nominal", why: "ele une acao e caracterizacao na mesma estrutura" },
    { lead: "um verbo de ligacao", answer: "o verbo que conecta o sujeito a um predicativo", why: "ele nao indica acao principal, mas estado ou qualidade" },
    { lead: "o predicativo do sujeito", answer: "o termo que atribui caracteristica, estado ou classificacao ao sujeito", why: "ele aparece com frequencia em predicados nominais e verbo-nominais" }
  ] },
  { subtopico: "Coordenacao", habilidade: "reconhecer oracoes coordenadas e seus sentidos", tags: ["coordenacao", "periodo-composto"], fatos: [
    { lead: "a coordenacao", answer: "a relacao entre oracoes sintaticamente independentes", why: "nenhuma exerce funcao sintatica dentro da outra" },
    { lead: "uma oracao coordenada sindetica aditiva", answer: "a oracao ligada por conectivo que acrescenta ideia", why: "conjuncoes como e e nem podem marcar esse valor" },
    { lead: "uma oracao coordenada sindetica adversativa", answer: "a oracao ligada por conectivo que expressa oposicao", why: "mas, porem e contudo sao marcadores comuns" },
    { lead: "uma oracao coordenada assindetica", answer: "a oracao coordenada sem conjuncao explicita", why: "a ligacao ocorre por justaposicao e pontuacao" },
    { lead: "o valor semantico da coordenacao", answer: "a relacao de adicao, oposicao, alternancia, conclusao ou explicacao entre oracoes", why: "o sentido depende do conectivo e do contexto" }
  ] },
  { subtopico: "Subordinacao substantiva", habilidade: "identificar oracoes subordinadas substantivas", tags: ["subordinacao", "substantiva"], fatos: [
    { lead: "a subordinacao", answer: "a relacao em que uma oracao depende sintaticamente de outra", why: "uma delas exerce funcao dentro da principal" },
    { lead: "uma oracao subordinada substantiva subjetiva", answer: "a oracao que exerce funcao de sujeito da principal", why: "ela ocupa o lugar de um substantivo na estrutura" },
    { lead: "uma oracao subordinada substantiva objetiva direta", answer: "a oracao que funciona como objeto direto da principal", why: "ela completa o sentido do verbo sem preposicao obrigatoria" },
    { lead: "uma oracao subordinada substantiva completiva nominal", answer: "a oracao que completa o sentido de um nome", why: "ela desempenha funcao paralela a de complemento nominal" },
    { lead: "o valor nominal de uma subordinada substantiva", answer: "a capacidade de exercer funcoes proprias de um substantivo", why: "sujeito, objeto e complemento podem ser ocupados por oracao" }
  ] },
  { subtopico: "Subordinacao adjetiva", habilidade: "analisar oracoes subordinadas adjetivas e pontuacao", tags: ["subordinacao", "adjetiva"], fatos: [
    { lead: "uma oracao subordinada adjetiva", answer: "a oracao que caracteriza ou especifica um nome da principal", why: "ela exerce papel semelhante ao de um adjetivo" },
    { lead: "uma subordinada adjetiva restritiva", answer: "a oracao que delimita o referente sem uso obrigatorio de virgulas", why: "ela seleciona parte do conjunto referido" },
    { lead: "uma subordinada adjetiva explicativa", answer: "a oracao que acrescenta comentario geral sobre o referente entre virgulas", why: "ela nao restringe, apenas explica ou comenta" },
    { lead: "o pronome relativo", answer: "o elemento que retoma um termo anterior e introduz a subordinada adjetiva", why: "que, o qual e cujo sao exemplos desse recurso" },
    { lead: "o efeito da virgula em adjetivas", answer: "a mudanca de sentido entre explicacao geral e restricao do referente", why: "a pontuacao altera a interpretacao da informacao" }
  ] },
  { subtopico: "Subordinacao adverbial", habilidade: "identificar valores circunstanciais das subordinadas adverbiais", tags: ["subordinacao", "adverbial"], fatos: [
    { lead: "uma oracao subordinada adverbial", answer: "a oracao que expressa circunstancia em relacao a principal", why: "ela pode indicar causa, tempo, condicao, finalidade e outros valores" },
    { lead: "uma subordinada adverbial causal", answer: "a oracao que apresenta o motivo do fato expresso na principal", why: "ela costuma vir introduzida por conectivos de causa" },
    { lead: "uma subordinada adverbial condicional", answer: "a oracao que estabelece hipotese ou condicao para o fato principal", why: "se e um conectivo frequente nessa relacao" },
    { lead: "uma subordinada adverbial concessiva", answer: "a oracao que apresenta obstaculo que nao impede a ocorrencia da principal", why: "embora e ainda que marcam esse valor" },
    { lead: "uma subordinada adverbial final", answer: "a oracao que indica finalidade ou objetivo da acao principal", why: "para que e a fim de que introduzem essa nocao" }
  ] },
  { subtopico: "Analise sintatica aplicada", habilidade: "aplicar conceitos sintaticos na interpretacao e reescrita", tags: ["analise-sintatica", "aplicacao"], fatos: [
    { lead: "a analise sintatica", answer: "o estudo das funcoes exercidas pelos termos e oracoes na estrutura", why: "ela ajuda a compreender forma e sentido do enunciado" },
    { lead: "a reorganizacao de periodo", answer: "a reescrita que altera ordem sem necessariamente mudar funcao sintatica", why: "identificar funcoes evita erros de interpretacao" },
    { lead: "a expansao de um termo em oracao", answer: "a substituicao de uma palavra ou grupo nominal por uma estrutura oracional equivalente", why: "isso aproxima estudo de periodo simples e composto" },
    { lead: "a reducao de oracao a termo", answer: "a condensacao de ideia oracional em estrutura nominal equivalente", why: "essa habilidade aparece em reescrita e resumo" },
    { lead: "a interpretacao guiada pela sintaxe", answer: "a leitura que observa funcao, conexao e hierarquia entre partes do enunciado", why: "estrutura e sentido caminham juntos na analise textual" }
  ] }
];

export const sintaxePeriodoSimplesEComposto = createPortugueseTopic({
  id: "portugues_sintaxe_periodo_simples_e_composto",
  serie: 2,
  topico: "Sintaxe Periodo Simples e Composto",
  prefix: "sps",
  eixo: "Analise linguistica",
  frente: "Sintaxe",
  searchAliases: ["sintaxe", "periodo simples", "periodo composto", "oracoes coordenadas", "oracoes subordinadas"],
  habilidadesBase: [
    "distinguir frase, oracao e periodo",
    "identificar termos essenciais, integrantes e acessorios",
    "classificar predicados e relacoes de predicacao",
    "reconhecer coordenacao e subordinacao",
    "aplicar analise sintatica em reescritas e interpretacao"
  ],
  blocos
});
