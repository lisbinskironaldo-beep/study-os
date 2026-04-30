import { createPortugueseTopic } from "../../../_shared/portugueseTopicFactory.js";

const blocos = [
  { subtopico: "Tema e ideia central", habilidade: "identificar tema, assunto e ideia principal de textos", tags: ["tema", "ideia-central"], fatos: [
    { lead: "o tema de um texto", answer: "o assunto mais amplo sobre o qual o texto trata", why: "ele organiza o campo geral de sentido do enunciado" },
    { lead: "a ideia principal", answer: "a informação central defendida ou desenvolvida no texto", why: "ela representa o foco mais importante do fragmento" },
    { lead: "a diferenca entre tema e ideia principal", answer: "o fato de o tema ser mais amplo e a ideia principal ser mais específica", why: "essa distincao melhora a leitura interpretativa" },
    { lead: "a formulacao do assunto do texto", answer: "uma síntese do que está sendo tratado no conjunto do enunciado", why: "isso evita confundir detalhe com eixo central" },
    { lead: "a identificacao do foco textual", answer: "a leitura do elemento em torno do qual as demais informações se organizam", why: "esse procedimento ajuda a reconhecer a ideia central" }
  ] },
  { subtopico: "Tese e ponto de vista", habilidade: "reconhecer tese, opiniao e ponto de vista do enunciador", tags: ["tese", "ponto-de-vista"], fatos: [
    { lead: "a tese de um texto argumentativo", answer: "a ideia defendida pelo autor ao longo do texto", why: "ela orienta argumentos e exemplos apresentados" },
    { lead: "o ponto de vista do enunciador", answer: "a perspectiva a partir da qual o autor interpreta o tema", why: "ele aparece nas escolhas argumentativas e linguisticas" },
    { lead: "um argumento", answer: "a justificativa usada para sustentar a tese", why: "sem argumento a defesa de uma opiniao fica fragil" },
    { lead: "a opiniao explícita", answer: "a avaliação apresentada de forma direta pelo autor", why: "marcas avaliativas costumam sinalizar esse posicionamento" },
    { lead: "a diferenca entre fato e opiniao", answer: "o fato pode ser verificado enquanto a opiniao expressa julgamento", why: "essa distincao e central na leitura crítica" }
  ] },
  { subtopico: "Inferencia e implicito", habilidade: "inferir informações não explicitadas diretamente", tags: ["inferencia", "implicito"], fatos: [
    { lead: "uma inferencia textual", answer: "a conclusão construida a partir de pistas do texto", why: "ela depende da articulação entre informações explícitas e contexto" },
    { lead: "uma informação implícita", answer: "o sentido sugerido pelo texto sem aparecer de modo literal", why: "o leitor precisa deduzi-lo a partir dos indicios" },
    { lead: "um pressuposto", answer: "a informação tomada como verdadeira para que o enunciado faca sentido", why: "ele costuma estar embutido na formulacao linguistica" },
    { lead: "um subentendido", answer: "o sentido sugerido que depende fortemente da situação comunicativa", why: "ele pode variar conforme contexto e interlocutores" },
    { lead: "a leitura inferencial", answer: "o processo de combinar enunciado, contexto e conhecimentos de mundo", why: "isso permite chegar a sentidos não literalmente ditos" }
  ] },
  { subtopico: "Finalidade e gênero textual", habilidade: "relacionar gênero, finalidade e função social", tags: ["finalidade", "genero"], fatos: [
    { lead: "a finalidade de um texto", answer: "o objetivo comunicativo que orienta sua produção", why: "informar, convencer ou instruir são exemplos de finalidades" },
    { lead: "o gênero textual", answer: "a forma socialmente reconhecida de organização do texto", why: "cada gênero atende a situações comunicativas especificas" },
    { lead: "a função social de um gênero", answer: "o papel que ele desempenha nas praticas de comunicacao", why: "isso explica por que certos formatos circulam em contextos determinados" },
    { lead: "um texto injuntivo", answer: "o texto que orienta, instrui ou prescreve ações", why: "receitas e manuais são exemplos desse funcionamento" },
    { lead: "um texto argumentativo", answer: "o texto que busca defender um ponto de vista e persuadir o leitor", why: "ele se apoia em tese e argumentos" }
  ] },
  { subtopico: "Escolhas linguisticas e efeitos de sentido", habilidade: "analisar efeitos produzidos por vocabulario e construção frasal", tags: ["efeito-de-sentido", "linguagem"], fatos: [
    { lead: "o efeito de sentido", answer: "o resultado interpretativo produzido por determinada escolha linguistica", why: "palavras e estruturas alteram o impacto da mensagem" },
    { lead: "a escolha vocabular", answer: "a seleção de palavras capaz de reforçar tom, tese e intencao do texto", why: "o vocabulario nunca e neutro na construção de sentido" },
    { lead: "a modalizacao", answer: "o recurso que revela atitude, avaliação ou grau de certeza do enunciador", why: "adverbios, verbos e adjetivos podem marcar essa postura" },
    { lead: "o tom de um texto", answer: "a atmosfera expressiva percebida pelo leitor, como ironica, crítica ou elogiosa", why: "ele decorre do conjunto das escolhas linguisticas" },
    { lead: "a intensificacao lexical", answer: "o uso de elementos que aumentam a força expressiva do enunciado", why: "isso pode reforçar humor, crítica ou dramatizacao" }
  ] },
  { subtopico: "Intertextualidade e comparacao de textos", habilidade: "comparar textos e reconhecer dialogos intertextuais", tags: ["intertextualidade", "comparacao"], fatos: [
    { lead: "a intertextualidade", answer: "o dialogo de um texto com outro texto anterior ou simultaneo", why: "essa relação amplia sentidos e referências culturais" },
    { lead: "uma parodia", answer: "a retomada transformadora de um texto com efeito critico ou humoristico", why: "ela depende do reconhecimento do texto-base" },
    { lead: "uma citação", answer: "a reproducao explícita de parte de outro texto", why: "ela evidencia a origem do discurso retomado" },
    { lead: "a comparacao entre textos", answer: "a análise de semelhancas e diferencas de tema, tese, linguagem ou enfoque", why: "essa habilidade e frequente em vestibulares e ENEM" },
    { lead: "o texto-base em relação intertextual", answer: "a referência anterior evocada pelo novo enunciado", why: "ele fornece o apoio para a releitura ou transformacao" }
  ] },
  { subtopico: "Humor, ironia e ambiguidade", habilidade: "identificar construções de humor, ironia e duplo sentido", tags: ["humor", "ironia", "ambiguidade"], fatos: [
    { lead: "a ironia", answer: "o recurso em que se diz algo para sugerir sentido diferente ou contrario", why: "o efeito depende do contraste entre literalidade e intencao" },
    { lead: "o humor verbal", answer: "o efeito de comicidade produzido por linguagem, contexto ou quebra de expectativa", why: "ele costuma exigir leitura atenta do enunciado" },
    { lead: "a ambiguidade", answer: "a possibilidade de mais de uma interpretação para o mesmo enunciado", why: "ela pode ser recurso expressivo ou problema de clareza" },
    { lead: "a quebra de expectativa", answer: "o deslocamento inesperado que modifica a leitura prevista pelo leitor", why: "esse mecanismo e comum em humor e publicidade" },
    { lead: "o duplo sentido", answer: "a sobreposicao intencional ou não de dois significados possíveis", why: "o contexto ajuda a definir qual leitura prevalece" }
  ] },
  { subtopico: "Texto verbal e não verbal", habilidade: "interpretar relações entre linguagem verbal e não verbal", tags: ["linguagem-verbal", "nao-verbal"], fatos: [
    { lead: "a linguagem verbal", answer: "a comunicacao realizada por palavras orais ou escritas", why: "ela constitui a base de muitos gêneros textuais" },
    { lead: "a linguagem não verbal", answer: "a comunicacao feita por imagens, gestos, cores, sons ou simbolos", why: "ela também produz sentidos independentes ou complementares" },
    { lead: "um texto multissemiotico", answer: "o texto que combina diferentes linguagens na construção de sentido", why: "tirinhas, anuncios e infograficos são exemplos frequentes" },
    { lead: "a relação entre imagem e texto", answer: "a articulação que pode complementar, reforçar ou contrariar a mensagem verbal", why: "a interpretação exige observar os dois planos" },
    { lead: "o efeito visual em um anuncio", answer: "o uso de elementos de imagem para orientar a leitura e persuadir o publico", why: "a dimensao não verbal participa da estratégia argumentativa" }
  ] },
  { subtopico: "Progressão argumentativa", habilidade: "acompanhar encadeamento de ideias e articulação argumentativa", tags: ["argumentacao", "progressao"], fatos: [
    { lead: "a progressão argumentativa", answer: "o desenvolvimento ordenado das ideias que sustentam a tese", why: "ela impede repetição vazia e fortalece o texto" },
    { lead: "um conectivo argumentativo", answer: "o elemento que explícita relações como causa, oposicao, conclusão ou concessao", why: "ele organiza o raciocínio textual" },
    { lead: "a exemplificação", answer: "o recurso usado para tornar mais concreto um argumento", why: "exemplos ajudam a validar e esclarecer a defesa da tese" },
    { lead: "a conclusão textual", answer: "a parte que retoma o percurso argumentativo e fecha o posicionamento", why: "ela sintetiza o raciocínio desenvolvido" },
    { lead: "a articulação lógica do texto", answer: "a coerência no encadeamento entre ideias e partes do enunciado", why: "sem essa organização o leitor perde o fio argumentativo" }
  ] },
  { subtopico: "Reescrita e equivalência de sentido", habilidade: "avaliar parafrases, reformulacoes e equivalencias", tags: ["reescrita", "equivalencia"], fatos: [
    { lead: "uma parafrase", answer: "a reescrita de uma ideia com outras palavras sem alterar o sentido essencial", why: "ela conserva o nucleo sem repetir literalmente" },
    { lead: "a equivalência de sentido", answer: "a manutenção do conteúdo central apos reformulacao linguistica", why: "essa habilidade e comum em questões de reescrita" },
    { lead: "a reformulacao inadequada", answer: "a reescrita que altera sentido, foco ou relação lógica do original", why: "mudar conectivos ou termos-chave pode comprometer a equivalência" },
    { lead: "a substituição lexical coerente", answer: "a troca de palavra por sinonimo compatível com o contexto", why: "sinônimos não funcionam igualmente em qualquer situação" },
    { lead: "a reescrita com manutenção argumentativa", answer: "a reformulacao que preserva tese, relações logicas e informações principais", why: "ela garante equivalência textual efetiva" }
  ] }
];

export const interpretacaoAvancada = createPortugueseTopic({
  id: "portugues_interpretacao_avancada",
  serie: 2,
  topico: "Interpretação Avançada",
  prefix: "ia2",
  eixo: "Leitura e interpretação",
  frente: "Construção de sentido",
  searchAliases: ["interpretação avançada", "inferencia textual", "tese e ponto de vista", "intertextualidade", "efeito de sentido"],
  habilidadesBase: [
    "identificar tema, ideia principal e finalidade de textos",
    "reconhecer tese, ponto de vista e estrategias argumentativas",
    "inferir sentidos implicitos e efeitos de linguagem",
    "comparar textos e relações intertextuais",
    "avaliar reescritas e equivalência de sentido"
  ],
  blocos
});
