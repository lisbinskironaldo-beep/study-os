import { createPortugueseTopic } from "../../../_shared/portugueseTopicFactory.js";

const blocos = [
  { subtopico: "Tema e ideia central", habilidade: "identificar tema, assunto e ideia principal de textos", tags: ["tema", "ideia-central"], fatos: [
    { lead: "o tema de um texto", answer: "o assunto mais amplo sobre o qual o texto trata", why: "ele organiza o campo geral de sentido do enunciado" },
    { lead: "a ideia principal", answer: "a informacao central defendida ou desenvolvida no texto", why: "ela representa o foco mais importante do fragmento" },
    { lead: "a diferenca entre tema e ideia principal", answer: "o fato de o tema ser mais amplo e a ideia principal ser mais especifica", why: "essa distincao melhora a leitura interpretativa" },
    { lead: "a formulacao do assunto do texto", answer: "uma sintese do que esta sendo tratado no conjunto do enunciado", why: "isso evita confundir detalhe com eixo central" },
    { lead: "a identificacao do foco textual", answer: "a leitura do elemento em torno do qual as demais informacoes se organizam", why: "esse procedimento ajuda a reconhecer a ideia central" }
  ] },
  { subtopico: "Tese e ponto de vista", habilidade: "reconhecer tese, opiniao e ponto de vista do enunciador", tags: ["tese", "ponto-de-vista"], fatos: [
    { lead: "a tese de um texto argumentativo", answer: "a ideia defendida pelo autor ao longo do texto", why: "ela orienta argumentos e exemplos apresentados" },
    { lead: "o ponto de vista do enunciador", answer: "a perspectiva a partir da qual o autor interpreta o tema", why: "ele aparece nas escolhas argumentativas e linguisticas" },
    { lead: "um argumento", answer: "a justificativa usada para sustentar a tese", why: "sem argumento a defesa de uma opiniao fica fragil" },
    { lead: "a opiniao explicita", answer: "a avaliacao apresentada de forma direta pelo autor", why: "marcas avaliativas costumam sinalizar esse posicionamento" },
    { lead: "a diferenca entre fato e opiniao", answer: "o fato pode ser verificado enquanto a opiniao expressa julgamento", why: "essa distincao e central na leitura critica" }
  ] },
  { subtopico: "Inferencia e implicito", habilidade: "inferir informacoes nao explicitadas diretamente", tags: ["inferencia", "implicito"], fatos: [
    { lead: "uma inferencia textual", answer: "a conclusao construida a partir de pistas do texto", why: "ela depende da articulacao entre informacoes explicitas e contexto" },
    { lead: "uma informacao implicita", answer: "o sentido sugerido pelo texto sem aparecer de modo literal", why: "o leitor precisa deduzi-lo a partir dos indicios" },
    { lead: "um pressuposto", answer: "a informacao tomada como verdadeira para que o enunciado faca sentido", why: "ele costuma estar embutido na formulacao linguistica" },
    { lead: "um subentendido", answer: "o sentido sugerido que depende fortemente da situacao comunicativa", why: "ele pode variar conforme contexto e interlocutores" },
    { lead: "a leitura inferencial", answer: "o processo de combinar enunciado, contexto e conhecimentos de mundo", why: "isso permite chegar a sentidos nao literalmente ditos" }
  ] },
  { subtopico: "Finalidade e genero textual", habilidade: "relacionar genero, finalidade e funcao social", tags: ["finalidade", "genero"], fatos: [
    { lead: "a finalidade de um texto", answer: "o objetivo comunicativo que orienta sua producao", why: "informar, convencer ou instruir sao exemplos de finalidades" },
    { lead: "o genero textual", answer: "a forma socialmente reconhecida de organizacao do texto", why: "cada genero atende a situacoes comunicativas especificas" },
    { lead: "a funcao social de um genero", answer: "o papel que ele desempenha nas praticas de comunicacao", why: "isso explica por que certos formatos circulam em contextos determinados" },
    { lead: "um texto injuntivo", answer: "o texto que orienta, instrui ou prescreve acoes", why: "receitas e manuais sao exemplos desse funcionamento" },
    { lead: "um texto argumentativo", answer: "o texto que busca defender um ponto de vista e persuadir o leitor", why: "ele se apoia em tese e argumentos" }
  ] },
  { subtopico: "Escolhas linguisticas e efeitos de sentido", habilidade: "analisar efeitos produzidos por vocabulario e construcao frasal", tags: ["efeito-de-sentido", "linguagem"], fatos: [
    { lead: "o efeito de sentido", answer: "o resultado interpretativo produzido por determinada escolha linguistica", why: "palavras e estruturas alteram o impacto da mensagem" },
    { lead: "a escolha vocabular", answer: "a selecao de palavras capaz de reforcar tom, tese e intencao do texto", why: "o vocabulario nunca e neutro na construcao de sentido" },
    { lead: "a modalizacao", answer: "o recurso que revela atitude, avaliacao ou grau de certeza do enunciador", why: "adverbios, verbos e adjetivos podem marcar essa postura" },
    { lead: "o tom de um texto", answer: "a atmosfera expressiva percebida pelo leitor, como ironica, critica ou elogiosa", why: "ele decorre do conjunto das escolhas linguisticas" },
    { lead: "a intensificacao lexical", answer: "o uso de elementos que aumentam a forca expressiva do enunciado", why: "isso pode reforcar humor, critica ou dramatizacao" }
  ] },
  { subtopico: "Intertextualidade e comparacao de textos", habilidade: "comparar textos e reconhecer dialogos intertextuais", tags: ["intertextualidade", "comparacao"], fatos: [
    { lead: "a intertextualidade", answer: "o dialogo de um texto com outro texto anterior ou simultaneo", why: "essa relacao amplia sentidos e referencias culturais" },
    { lead: "uma parodia", answer: "a retomada transformadora de um texto com efeito critico ou humoristico", why: "ela depende do reconhecimento do texto-base" },
    { lead: "uma citacao", answer: "a reproducao explicita de parte de outro texto", why: "ela evidencia a origem do discurso retomado" },
    { lead: "a comparacao entre textos", answer: "a analise de semelhancas e diferencas de tema, tese, linguagem ou enfoque", why: "essa habilidade e frequente em vestibulares e ENEM" },
    { lead: "o texto-base em relacao intertextual", answer: "a referencia anterior evocada pelo novo enunciado", why: "ele fornece o apoio para a releitura ou transformacao" }
  ] },
  { subtopico: "Humor, ironia e ambiguidade", habilidade: "identificar construcoes de humor, ironia e duplo sentido", tags: ["humor", "ironia", "ambiguidade"], fatos: [
    { lead: "a ironia", answer: "o recurso em que se diz algo para sugerir sentido diferente ou contrario", why: "o efeito depende do contraste entre literalidade e intencao" },
    { lead: "o humor verbal", answer: "o efeito de comicidade produzido por linguagem, contexto ou quebra de expectativa", why: "ele costuma exigir leitura atenta do enunciado" },
    { lead: "a ambiguidade", answer: "a possibilidade de mais de uma interpretacao para o mesmo enunciado", why: "ela pode ser recurso expressivo ou problema de clareza" },
    { lead: "a quebra de expectativa", answer: "o deslocamento inesperado que modifica a leitura prevista pelo leitor", why: "esse mecanismo e comum em humor e publicidade" },
    { lead: "o duplo sentido", answer: "a sobreposicao intencional ou nao de dois significados possiveis", why: "o contexto ajuda a definir qual leitura prevalece" }
  ] },
  { subtopico: "Texto verbal e nao verbal", habilidade: "interpretar relacoes entre linguagem verbal e nao verbal", tags: ["linguagem-verbal", "nao-verbal"], fatos: [
    { lead: "a linguagem verbal", answer: "a comunicacao realizada por palavras orais ou escritas", why: "ela constitui a base de muitos generos textuais" },
    { lead: "a linguagem nao verbal", answer: "a comunicacao feita por imagens, gestos, cores, sons ou simbolos", why: "ela tambem produz sentidos independentes ou complementares" },
    { lead: "um texto multissemiotico", answer: "o texto que combina diferentes linguagens na construcao de sentido", why: "tirinhas, anuncios e infograficos sao exemplos frequentes" },
    { lead: "a relacao entre imagem e texto", answer: "a articulacao que pode complementar, reforcar ou contrariar a mensagem verbal", why: "a interpretacao exige observar os dois planos" },
    { lead: "o efeito visual em um anuncio", answer: "o uso de elementos de imagem para orientar a leitura e persuadir o publico", why: "a dimensao nao verbal participa da estrategia argumentativa" }
  ] },
  { subtopico: "Progressao argumentativa", habilidade: "acompanhar encadeamento de ideias e articulacao argumentativa", tags: ["argumentacao", "progressao"], fatos: [
    { lead: "a progressao argumentativa", answer: "o desenvolvimento ordenado das ideias que sustentam a tese", why: "ela impede repeticao vazia e fortalece o texto" },
    { lead: "um conectivo argumentativo", answer: "o elemento que explicita relacoes como causa, oposicao, conclusao ou concessao", why: "ele organiza o raciocinio textual" },
    { lead: "a exemplificacao", answer: "o recurso usado para tornar mais concreto um argumento", why: "exemplos ajudam a validar e esclarecer a defesa da tese" },
    { lead: "a conclusao textual", answer: "a parte que retoma o percurso argumentativo e fecha o posicionamento", why: "ela sintetiza o raciocinio desenvolvido" },
    { lead: "a articulacao logica do texto", answer: "a coerencia no encadeamento entre ideias e partes do enunciado", why: "sem essa organizacao o leitor perde o fio argumentativo" }
  ] },
  { subtopico: "Reescrita e equivalencia de sentido", habilidade: "avaliar parafrases, reformulacoes e equivalencias", tags: ["reescrita", "equivalencia"], fatos: [
    { lead: "uma parafrase", answer: "a reescrita de uma ideia com outras palavras sem alterar o sentido essencial", why: "ela conserva o nucleo sem repetir literalmente" },
    { lead: "a equivalencia de sentido", answer: "a manutencao do conteudo central apos reformulacao linguistica", why: "essa habilidade e comum em questoes de reescrita" },
    { lead: "a reformulacao inadequada", answer: "a reescrita que altera sentido, foco ou relacao logica do original", why: "mudar conectivos ou termos-chave pode comprometer a equivalencia" },
    { lead: "a substituicao lexical coerente", answer: "a troca de palavra por sinonimo compativel com o contexto", why: "sinonimos nao funcionam igualmente em qualquer situacao" },
    { lead: "a reescrita com manutencao argumentativa", answer: "a reformulacao que preserva tese, relacoes logicas e informacoes principais", why: "ela garante equivalencia textual efetiva" }
  ] }
];

export const interpretacaoAvancada = createPortugueseTopic({
  id: "portugues_interpretacao_avancada",
  serie: 2,
  topico: "Interpretacao Avancada",
  prefix: "ia2",
  eixo: "Leitura e interpretacao",
  frente: "Construcao de sentido",
  searchAliases: ["interpretacao avancada", "inferencia textual", "tese e ponto de vista", "intertextualidade", "efeito de sentido"],
  habilidadesBase: [
    "identificar tema, ideia principal e finalidade de textos",
    "reconhecer tese, ponto de vista e estrategias argumentativas",
    "inferir sentidos implicitos e efeitos de linguagem",
    "comparar textos e relacoes intertextuais",
    "avaliar reescritas e equivalencia de sentido"
  ],
  blocos
});
