import { createMathematicsTopic } from "../../../_shared/mathematicsTopicFactory.js";

const blocos = [
  {
    subtopico: "Conceitos fundamentais",
    habilidade: "identificar o significado de logaritmo e seus elementos",
    tags: ["conceitos", "logaritmos"],
    fatos: [
      { lead: "um logaritmo", answer: "o expoente ao qual se deve elevar a base para obter determinado numero", why: "essa e a definicao central do conceito" },
      { lead: "a expressao log_a b", answer: "a notacao que indica o expoente que transforma a base a em b", why: "ela resume a relacao inversa com a potenciacao" },
      { lead: "a base de um logaritmo", answer: "o numero positivo e diferente de 1 que sustenta a operacao", why: "essas condicoes evitam ambiguidades no comportamento da funcao" },
      { lead: "o logaritmando", answer: "o numero positivo sobre o qual o logaritmo e calculado", why: "nao se admite valor nulo ou negativo nessa posicao" },
      { lead: "a relacao entre logaritmos e exponenciais", answer: "a inversao entre determinar a potencia e descobrir o expoente", why: "as duas linguagens descrevem o mesmo fato matematico" }
    ]
  },
  {
    subtopico: "Condicoes de existencia",
    habilidade: "reconhecer restricoes de base e logaritmando",
    tags: ["existencia", "restricoes"],
    fatos: [
      { lead: "a condicao para a base do logaritmo", answer: "ser positiva e diferente de 1", why: "sem isso a funcao logaritmica nao tem comportamento adequado" },
      { lead: "a condicao para o logaritmando", answer: "ser obrigatoriamente positivo", why: "logaritmo de zero ou de numero negativo nao existe nos reais" },
      { lead: "o erro de usar base igual a 1", answer: "a perda da correspondencia univoca entre potencias e resultados", why: "1 elevado a qualquer expoente continua valendo 1" },
      { lead: "o erro de usar base negativa", answer: "a impossibilidade de definir uma funcao logaritmica real regular", why: "potencias de base negativa nao geram comportamento continuo apropriado" },
      { lead: "a verificacao inicial de um problema com logaritmo", answer: "a checagem das condicoes de existencia antes da resolucao", why: "isso evita aceitar resultados invalidos" }
    ]
  },
  {
    subtopico: "Propriedades operacionais",
    habilidade: "aplicar propriedades basicas dos logaritmos",
    tags: ["propriedades", "operacoes"],
    fatos: [
      { lead: "o logaritmo de um produto", answer: "a soma dos logaritmos dos fatores na mesma base", why: "essa propriedade permite desmembrar expressoes" },
      { lead: "o logaritmo de um quociente", answer: "a diferenca entre os logaritmos do numerador e do denominador", why: "a divisao se traduz em subtracao logaritmica" },
      { lead: "o logaritmo de uma potencia", answer: "o produto do expoente pelo logaritmo da base interna", why: "essa regra traz o expoente para fora da operacao" },
      { lead: "o valor de log_a a", answer: "o numero 1", why: "a base elevada a 1 resulta nela mesma" },
      { lead: "o valor de log_a 1", answer: "o numero 0", why: "qualquer base positiva elevada a zero resulta em 1" }
    ]
  },
  {
    subtopico: "Mudanca de base",
    habilidade: "utilizar a formula de mudanca de base em calculos logaritmicos",
    tags: ["mudanca-de-base", "calculo"],
    fatos: [
      { lead: "a mudanca de base", answer: "a reescrita de um logaritmo em outra base equivalente", why: "isso facilita calculos e comparacoes" },
      { lead: "a formula log_a b = log_c b sobre log_c a", answer: "a relacao que permite trocar a base do logaritmo", why: "ela transforma a expressao usando uma base auxiliar comum" },
      { lead: "o uso da base 10 na mudanca de base", answer: "uma escolha pratica por aparecer em calculadoras e tabelas", why: "o logaritmo decimal e amplamente empregado em aplicacoes" },
      { lead: "o uso da base e na mudanca de base", answer: "uma escolha frequente em contextos de matematica superior e ciencias", why: "o logaritmo natural simplifica muitos modelos continuos" },
      { lead: "a comparacao entre logaritmos de bases distintas", answer: "um caso em que a mudanca de base ajuda a uniformizar a analise", why: "a conversao evita interpretar bases diferentes como grandezas desconexas" }
    ]
  },
  {
    subtopico: "Equacoes logaritmicas",
    habilidade: "resolver equacoes envolvendo logaritmos",
    tags: ["equacoes", "resolucao"],
    fatos: [
      { lead: "a equacao log_2 8", answer: "um caso cujo resultado e 3", why: "2 elevado a 3 produz 8" },
      { lead: "a anulacao de logaritmos com mesma base em lados iguais", answer: "a passagem para a igualdade entre logaritmandos validos", why: "a funcao logaritmica e injetora em sua base admissivel" },
      { lead: "a reuniao de termos logaritmicos antes de resolver", answer: "um procedimento comum em equacoes com soma ou diferenca de logs", why: "as propriedades simplificam a estrutura da expressao" },
      { lead: "a verificacao das restricoes apos resolver", answer: "a etapa que descarta solucoes que tornem algum logaritmando nao positivo", why: "nem todo valor algebricamente obtido e aceitavel no dominio real" },
      { lead: "o uso da forma exponencial na resolucao", answer: "a traducao do logaritmo para uma igualdade de potencias", why: "essa conversao costuma revelar o valor procurado" }
    ]
  },
  {
    subtopico: "Inequacoes logaritmicas",
    habilidade: "interpretar desigualdades com logaritmos",
    tags: ["inequacoes", "comparacao"],
    fatos: [
      { lead: "uma funcao logaritmica de base maior que 1", answer: "uma funcao crescente que preserva a ordem das desigualdades", why: "o aumento do argumento produz aumento do logaritmo" },
      { lead: "uma funcao logaritmica de base entre 0 e 1", answer: "uma funcao decrescente que inverte a ordem das desigualdades", why: "o aumento do argumento faz o logaritmo diminuir" },
      { lead: "a condicao de dominio em inequacoes logaritmicas", answer: "a exigencia de argumentos positivos ao longo de toda a resolucao", why: "a desigualdade so faz sentido dentro do dominio real" },
      { lead: "a analise da monotonicidade da base", answer: "o criterio que decide se a comparacao mantem ou troca o sentido", why: "isso e indispensavel em inequacoes logaritmicas" },
      { lead: "o conjunto-solucao de uma inequacao logaritmica", answer: "o intervalo de valores que respeita simultaneamente a desigualdade e o dominio", why: "as duas condicoes precisam ser satisfeitas em conjunto" }
    ]
  },
  {
    subtopico: "Graficos de funcoes logaritmicas",
    habilidade: "interpretar graficos e comportamento de funcoes logaritmicas",
    tags: ["graficos", "funcao-logaritmica"],
    fatos: [
      { lead: "o grafico de y=log_a x", answer: "uma curva definida apenas para x positivo", why: "o dominio da funcao logaritmica exclui zero e negativos" },
      { lead: "a assintota vertical x=0", answer: "a reta da qual o grafico logaritmico se aproxima sem tocar", why: "os valores se tornam muito negativos ao aproximar x de zero pela direita" },
      { lead: "o ponto (1,0) no grafico logaritmico", answer: "o ponto comum de funcoes da forma y=log_a x", why: "o logaritmo de 1 em qualquer base valida e zero" },
      { lead: "a base maior que 1 no grafico logaritmico", answer: "o fator que produz uma curva crescente", why: "nessa situacao x maior implica logaritmo maior" },
      { lead: "a base entre 0 e 1 no grafico logaritmico", answer: "o fator que produz uma curva decrescente", why: "o comportamento da funcao se inverte nessa faixa de base" }
    ]
  },
  {
    subtopico: "Logaritmos notaveis",
    habilidade: "distinguir logaritmo decimal, natural e valores especiais",
    tags: ["logaritmos-notaveis", "aplicacoes"],
    fatos: [
      { lead: "o logaritmo decimal", answer: "o logaritmo de base 10", why: "ele aparece com frequencia em tabelas e calculadoras" },
      { lead: "o logaritmo natural", answer: "o logaritmo de base e", why: "essa base e importante em modelos continuos de variacao" },
      { lead: "a constante e", answer: "o numero irracional associado a processos continuos de crescimento", why: "ela surge naturalmente em juros compostos e calculo" },
      { lead: "o valor de ln e", answer: "o numero 1", why: "o logaritmo natural da propria base vale um" },
      { lead: "o valor de log 100 na base 10", answer: "o numero 2", why: "10 elevado a 2 gera 100" }
    ]
  },
  {
    subtopico: "Aplicacoes contextualizadas",
    habilidade: "reconhecer usos dos logaritmos em ciencias e em problemas reais",
    tags: ["contexto", "aplicacoes"],
    fatos: [
      { lead: "a escala Richter", answer: "uma aplicacao classica de logaritmos para comparar intensidades de terremotos", why: "a grandeza e medida em ordem de magnitude" },
      { lead: "o pH", answer: "uma aplicacao logaritmica ligada a concentracao de ions hidrogenio", why: "o uso do logaritmo compacta uma faixa muito ampla de valores" },
      { lead: "a escala de decibeis", answer: "uma aplicacao de logaritmos na medicao de intensidade sonora", why: "sons variam em potencias e exigem comparacao logaritmica" },
      { lead: "o uso dos logaritmos em crescimento exponencial", answer: "a possibilidade de descobrir o tempo ou expoente envolvidos no modelo", why: "o logaritmo e a ferramenta inversa da exponencial" },
      { lead: "a compressao de grandes ordens de grandeza", answer: "uma vantagem do uso de escalas logaritmicas", why: "elas tornam comparacoes mais manejaveis em contextos cientificos" }
    ]
  },
  {
    subtopico: "Interpretacao de problemas",
    habilidade: "resolver problemas integrando propriedades e leitura contextual",
    tags: ["problemas", "interpretacao"],
    fatos: [
      { lead: "a passagem de linguagem verbal para logaritmica", answer: "a traducao do problema para uma relacao entre base, expoente e resultado", why: "essa organizacao torna visivel a estrutura matematica envolvida" },
      { lead: "a identificacao da base em um enunciado", answer: "a leitura do fator de crescimento ou da escala adotada", why: "a base controla a interpretacao correta do logaritmo" },
      { lead: "a analise do dominio antes do calculo", answer: "uma etapa essencial em questoes logaritmicas", why: "ela impede aceitar expressoes sem significado nos reais" },
      { lead: "a conclusao contextual de um problema", answer: "a interpretacao do resultado numerico dentro da situacao descrita", why: "o valor obtido precisa responder ao que foi perguntado" },
      { lead: "a relacao entre exponencial e logaritmo na resolucao", answer: "a alternancia entre duas escritas equivalentes do mesmo problema", why: "essa flexibilidade amplia as estrategias de solucao" }
    ]
  }
];

export const logaritmos = createMathematicsTopic({
  id: "matematica_logaritmos",
  serie: 2,
  topico: "Logaritmos",
  prefix: "log",
  eixo: "Algebra",
  frente: "Funcoes e operacoes",
  searchAliases: [
    "logaritmo",
    "equacao logaritmica",
    "mudanca de base",
    "funcao logaritmica",
    "pH"
  ],
  habilidadesBase: [
    "identificar o significado de logaritmo e seus elementos",
    "reconhecer restricoes de base e logaritmando",
    "aplicar propriedades basicas dos logaritmos",
    "resolver equacoes e inequacoes logaritmicas",
    "interpretar usos dos logaritmos em contextos cientificos"
  ],
  blocos
});
