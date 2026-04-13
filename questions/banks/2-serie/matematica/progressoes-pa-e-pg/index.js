import { createMathematicsTopic } from "../../../_shared/mathematicsTopicFactory.js";

const blocos = [
  {
    subtopico: "Conceitos de PA",
    habilidade: "identificar a estrutura de uma progressao aritmetica",
    tags: ["pa", "conceitos"],
    fatos: [
      { lead: "uma progressao aritmetica", answer: "a sequencia em que a diferenca entre termos consecutivos e constante", why: "essa regularidade define a PA" },
      { lead: "a razao de uma PA", answer: "o valor somado ou subtraido a cada termo para obter o seguinte", why: "ela controla o crescimento ou decrescimento da sequencia" },
      { lead: "uma PA crescente", answer: "a progressao cuja razao e positiva", why: "cada novo termo supera o anterior por um valor fixo" },
      { lead: "uma PA decrescente", answer: "a progressao cuja razao e negativa", why: "cada novo termo reduz o valor anterior na mesma diferenca" },
      { lead: "uma PA constante", answer: "a progressao cuja razao e igual a zero", why: "todos os termos permanecem iguais" }
    ]
  },
  {
    subtopico: "Termo geral da PA",
    habilidade: "relacionar posicao, primeiro termo e razao em uma PA",
    tags: ["pa", "termo-geral"],
    fatos: [
      { lead: "o termo geral da PA", answer: "a formula a_n = a_1 + (n-1)r", why: "ela permite calcular qualquer termo da sequencia" },
      { lead: "o primeiro termo de uma PA", answer: "o valor inicial que serve de referencia para toda a sequencia", why: "ele aparece explicitamente na formula geral" },
      { lead: "o indice n no termo geral", answer: "a posicao ocupada pelo termo na progressao", why: "ele indica quantas vezes a razao foi adicionada ou subtraida" },
      { lead: "a diferenca entre a_n e a_1", answer: "o resultado do produto entre n menos 1 e a razao", why: "isso mede o afastamento em relacao ao inicio da PA" },
      { lead: "a localizacao de um termo desconhecido", answer: "uma aplicacao direta da formula geral da PA", why: "a expressao conecta posicao e valor do termo" }
    ]
  },
  {
    subtopico: "Soma dos termos da PA",
    habilidade: "interpretar a formula de soma de uma progressao aritmetica",
    tags: ["pa", "soma"],
    fatos: [
      { lead: "a soma dos n primeiros termos da PA", answer: "a formula que multiplica n pela soma do primeiro com o ultimo termo e divide por 2", why: "ela calcula rapidamente totais de sequencias aritmeticas" },
      { lead: "a media entre primeiro e ultimo termo na PA", answer: "o valor que representa o termo medio da soma pareada", why: "a formula de soma usa essa simetria" },
      { lead: "o metodo de Gauss para somar uma PA", answer: "a estrategia de parear termos extremos que produzem a mesma soma", why: "essa observacao justifica a formula de soma" },
      { lead: "o fator n na soma da PA", answer: "a quantidade de termos considerados na progressao", why: "a soma depende diretamente de quantos termos entram no calculo" },
      { lead: "a utilizacao da soma da PA", answer: "o calculo de acumulados em sequencias com variacao aditiva constante", why: "esse tipo de problema aparece em contextos numericos e financeiros simples" }
    ]
  },
  {
    subtopico: "Conceitos de PG",
    habilidade: "identificar a estrutura de uma progressao geometrica",
    tags: ["pg", "conceitos"],
    fatos: [
      { lead: "uma progressao geometrica", answer: "a sequencia em que o quociente entre termos consecutivos e constante", why: "essa razao multiplicativa define a PG" },
      { lead: "a razao de uma PG", answer: "o fator pelo qual cada termo e multiplicado para gerar o seguinte", why: "ela controla a evolucao da sequencia" },
      { lead: "uma PG crescente com termos positivos", answer: "a progressao cuja razao e maior que 1", why: "nessa situacao os valores aumentam por multiplicacao" },
      { lead: "uma PG decrescente com termos positivos", answer: "a progressao cuja razao esta entre 0 e 1", why: "o fator reduz os termos progressivamente" },
      { lead: "a diferenca principal entre PA e PG", answer: "o fato de uma variar por soma constante e a outra por multiplicacao constante", why: "essa distincao organiza todo o estudo das progressoes" }
    ]
  },
  {
    subtopico: "Termo geral da PG",
    habilidade: "relacionar posicao, primeiro termo e razao em uma PG",
    tags: ["pg", "termo-geral"],
    fatos: [
      { lead: "o termo geral da PG", answer: "a formula a_n = a_1 vezes q elevado a n-1", why: "ela permite calcular qualquer termo da progressao geometrica" },
      { lead: "o expoente n-1 na PG", answer: "a quantidade de multiplicacoes pela razao realizadas desde o primeiro termo", why: "cada avanco de posicao aplica mais um fator q" },
      { lead: "o primeiro termo da PG", answer: "o valor inicial que ancora a expressao do termo geral", why: "ele e multiplicado pelas potencias da razao" },
      { lead: "a comparacao entre termos distantes de uma PG", answer: "um caso em que a potencia da razao se torna decisiva", why: "o afastamento depende do numero de etapas multiplicativas" },
      { lead: "a busca da posicao de um termo em PG", answer: "uma aplicacao que conecta termo geral, potencia e eventualmente logaritmos", why: "o indice aparece no expoente da razao" }
    ]
  },
  {
    subtopico: "Soma dos termos da PG",
    habilidade: "interpretar a formula de soma finita e infinita de PG",
    tags: ["pg", "soma"],
    fatos: [
      { lead: "a soma dos n primeiros termos da PG finita", answer: "a expressao que envolve o primeiro termo multiplicado por 1 menos q elevado a n sobre 1 menos q", why: "essa formula resume a acumulacao geometrica quando q e diferente de 1" },
      { lead: "a condicao q diferente de 1 na soma da PG", answer: "a exigencia para evitar denominador nulo na formula usual", why: "quando q vale 1 a progressao se torna constante" },
      { lead: "a soma infinita de uma PG", answer: "o calculo possivel apenas quando o modulo da razao e menor que 1", why: "nessa situacao os termos tendem a zero" },
      { lead: "a formula da soma infinita", answer: "a expressao S = a_1 sobre 1 menos q para modulo de q menor que 1", why: "ela surge do limite da soma finita" },
      { lead: "o uso da soma da PG", answer: "a modelagem de acumulados com variacao multiplicativa constante", why: "isso ocorre em financiamentos, crescimento e fenomenos naturais" }
    ]
  },
  {
    subtopico: "Comparacao entre PA e PG",
    habilidade: "comparar modelos aditivos e multiplicativos",
    tags: ["comparacao", "pa-pg"],
    fatos: [
      { lead: "o comportamento de uma PA", answer: "a evolucao linear baseada em diferenca constante", why: "cada termo se afasta do anterior por soma ou subtracao fixa" },
      { lead: "o comportamento de uma PG", answer: "a evolucao exponencial baseada em razao constante", why: "cada termo depende de uma multiplicacao repetida" },
      { lead: "um problema de parcelas iguais sucessivas", answer: "um contexto mais associado a PA", why: "a variacao e aditiva e regular" },
      { lead: "um problema de crescimento percentual sucessivo", answer: "um contexto mais associado a PG", why: "a variacao ocorre por fatores multiplicativos" },
      { lead: "a escolha entre PA e PG", answer: "a analise de se a variacao e por diferenca ou por razao constante", why: "essa leitura define o modelo adequado" }
    ]
  },
  {
    subtopico: "Aplicacoes financeiras",
    habilidade: "relacionar progressoes a situacoes financeiras e cotidianas",
    tags: ["aplicacoes", "financeiro"],
    fatos: [
      { lead: "o parcelamento com acrescimos fixos", answer: "um exemplo de comportamento aproximado de PA", why: "o aumento se repete por uma mesma diferenca" },
      { lead: "os juros compostos em sequencia de montantes", answer: "um exemplo de comportamento de PG", why: "cada periodo multiplica o capital por um fator fixo" },
      { lead: "uma poupanca com depositos crescentes sempre pelo mesmo valor", answer: "uma situacao modelada por PA", why: "a variacao dos depositos e aditiva" },
      { lead: "um investimento com rendimento percentual constante", answer: "uma situacao modelada por PG", why: "o capital cresce por multiplicacao sucessiva" },
      { lead: "a interpretacao de tabelas sequenciais", answer: "uma estrategia para detectar se os dados sugerem PA ou PG", why: "a observacao da diferenca ou da razao ajuda a classificar a sequencia" }
    ]
  },
  {
    subtopico: "Problemas com termos e posicoes",
    habilidade: "resolver questoes envolvendo identificacao de termos, indices e somas",
    tags: ["problemas", "resolucao"],
    fatos: [
      { lead: "a procura do n-esimo termo", answer: "um problema resolvido com a formula geral da progressao correspondente", why: "o modelo depende de ser PA ou PG" },
      { lead: "a descoberta da razao a partir de dois termos", answer: "uma etapa que reconstrui a regra de formacao da progressao", why: "a sequencia pode ser determinada por seus elementos e sua regularidade" },
      { lead: "a identificacao do termo medio em uma PA", answer: "a equivalencia com a media aritmetica entre extremos equidistantes", why: "a linearidade da PA garante essa propriedade" },
      { lead: "a identificacao do termo medio em uma PG positiva", answer: "a equivalencia com a media geometrica entre extremos equidistantes", why: "a multiplicacao regular da PG sustenta essa relacao" },
      { lead: "a leitura de um enunciado com varias etapas", answer: "a necessidade de separar dados iniciais, regra da sequencia e objetivo final", why: "essa organizacao melhora a resolucao de problemas de progressoes" }
    ]
  },
  {
    subtopico: "Interpretacao de problemas",
    habilidade: "concluir problemas contextualizados envolvendo progressoes",
    tags: ["interpretacao", "contexto"],
    fatos: [
      { lead: "a traducao de uma fila de assentos em fileiras crescentes", answer: "um contexto que frequentemente gera PA", why: "o aumento por fileira costuma ocorrer por diferenca fixa" },
      { lead: "a traducao de uma cultura de bacterias que dobra", answer: "um contexto que frequentemente gera PG", why: "cada etapa duplica a quantidade anterior" },
      { lead: "a verificacao do modelo adotado", answer: "a comparacao entre a variacao observada e o padrao de PA ou PG", why: "escolher o modelo certo e essencial antes do calculo" },
      { lead: "a leitura do resultado num problema sequencial", answer: "a associacao do valor encontrado ao numero de termos ou ao total pedido", why: "a resposta deve respeitar a pergunta do contexto" },
      { lead: "a interpretacao final em problemas de progressoes", answer: "a etapa de explicar o significado do termo ou da soma obtida", why: "resolver vai alem de aplicar formulas isoladamente" }
    ]
  }
];

export const progressoesPaEPg = createMathematicsTopic({
  id: "matematica_progressoes_pa_e_pg",
  serie: 2,
  topico: "Progressoes PA e PG",
  prefix: "ppg",
  eixo: "Algebra",
  frente: "Sequencias numericas",
  searchAliases: [
    "progressao aritmetica",
    "progressao geometrica",
    "pa",
    "pg",
    "soma dos termos"
  ],
  habilidadesBase: [
    "identificar a estrutura de progressao aritmetica e geometrica",
    "aplicar as formulas de termo geral de PA e PG",
    "interpretar somas de termos em progressoes",
    "comparar modelos aditivos e multiplicativos",
    "resolver problemas contextualizados com sequencias"
  ],
  blocos
});
