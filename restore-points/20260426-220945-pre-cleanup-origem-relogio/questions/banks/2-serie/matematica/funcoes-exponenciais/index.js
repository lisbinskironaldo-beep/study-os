import { createMathematicsTopic } from "../../../_shared/mathematicsTopicFactory.js";

const blocos = [
  {
    subtopico: "Conceitos fundamentais",
    habilidade: "identificar a estrutura basica de uma funcao exponencial",
    tags: ["conceitos", "funcao-exponencial"],
    fatos: [
      { lead: "uma funcao exponencial", answer: "a funcao em que a variavel aparece no expoente", why: "essa posicao da variavel diferencia esse tipo de funcao das polinomiais" },
      { lead: "a forma basica f(x)=a^x", answer: "a expressao em que a base e positiva e diferente de 1", why: "essas condicoes garantem o comportamento caracteristico da funcao" },
      { lead: "a base exponencial", answer: "o numero positivo que e elevado ao expoente variavel", why: "ela determina crescimento ou decrescimento do grafico" },
      { lead: "o dominio de uma exponencial simples", answer: "o conjunto de todos os numeros reais", why: "qualquer valor real pode ocupar o lugar de x no expoente" },
      { lead: "a imagem de uma exponencial simples", answer: "o conjunto dos valores reais positivos", why: "potencias com base positiva nunca resultam em zero ou numero negativo" }
    ]
  },
  {
    subtopico: "Potenciacao e propriedades",
    habilidade: "relacionar propriedades de potencias ao estudo exponencial",
    tags: ["potenciacao", "propriedades"],
    fatos: [
      { lead: "o produto de potencias de mesma base", answer: "a soma dos expoentes", why: "essa e uma propriedade central da potenciacao" },
      { lead: "o quociente de potencias de mesma base", answer: "a subtracao dos expoentes", why: "a divisao preserva a base e compara as ordens de potencia" },
      { lead: "a potencia de potencia", answer: "o produto entre os expoentes", why: "essa composicao simplifica expressoes exponenciais" },
      { lead: "o expoente zero", answer: "o resultado igual a 1 para base nao nula", why: "essa convencao preserva as propriedades algebricas da potenciacao" },
      { lead: "o expoente negativo", answer: "o inverso da potencia de expoente positivo correspondente", why: "a^-n equivale a 1 sobre a^n" }
    ]
  },
  {
    subtopico: "Crescimento exponencial",
    habilidade: "reconhecer o comportamento crescente das exponenciais",
    tags: ["crescimento", "grafico"],
    fatos: [
      { lead: "uma exponencial crescente", answer: "a funcao cuja base e maior que 1", why: "bases acima de 1 fazem os valores aumentarem com o crescimento de x" },
      { lead: "o comportamento para x crescente em a maior que 1", answer: "a elevacao progressiva dos valores da funcao", why: "cada aumento em x multiplica a imagem por a" },
      { lead: "o ponto (0,1) em funcoes exponenciais", answer: "o ponto comum aos graficos da forma f(x)=a^x", why: "qualquer base positiva elevada a zero resulta em 1" },
      { lead: "a interpretacao de duplicacao sucessiva", answer: "um exemplo de crescimento exponencial com base 2", why: "cada etapa multiplica a quantidade anterior por dois" },
      { lead: "a taxa multiplicativa fixa", answer: "a caracteristica de aumentar sempre por um mesmo fator", why: "isso distingue crescimento exponencial de crescimento aditivo" }
    ]
  },
  {
    subtopico: "Decrescimento exponencial",
    habilidade: "reconhecer o comportamento decrescente das exponenciais",
    tags: ["decrescimento", "grafico"],
    fatos: [
      { lead: "uma exponencial decrescente", answer: "a funcao cuja base esta entre 0 e 1", why: "nessa faixa os valores diminuem quando x aumenta" },
      { lead: "o comportamento de (1/2)^x", answer: "a reducao gradual dos valores sem atingir zero", why: "a imagem se aproxima do eixo x de forma assintotica" },
      { lead: "o decaimento radioativo como modelo", answer: "uma aplicacao tipica de funcao exponencial decrescente", why: "a quantidade restante cai por uma mesma razao ao longo do tempo" },
      { lead: "a assintota horizontal y=0", answer: "a reta da qual o grafico se aproxima sem tocar", why: "as exponenciais simples mantem valores positivos" },
      { lead: "a taxa multiplicativa menor que 1", answer: "a marca do decrescimento exponencial", why: "cada passo conserva apenas uma fracao do valor anterior" }
    ]
  },
  {
    subtopico: "Graficos e transformacoes",
    habilidade: "interpretar graficos de funcoes exponenciais e suas transformacoes",
    tags: ["graficos", "transformacoes"],
    fatos: [
      { lead: "uma translacao vertical em f(x)=a^x+k", answer: "o deslocamento do grafico para cima ou para baixo em k unidades", why: "o termo somado fora da potencia altera a imagem" },
      { lead: "uma translacao horizontal em f(x)=a^(x-h)", answer: "o deslocamento do grafico h unidades para a direita", why: "a mudanca ocorre diretamente na variavel x" },
      { lead: "o coeficiente negativo em -a^x", answer: "a reflexao do grafico em relacao ao eixo x", why: "a multiplicacao por -1 troca o sinal das imagens" },
      { lead: "a multiplicacao externa por c em c.a^x", answer: "a dilatacao ou compressao vertical do grafico", why: "o fator altera todos os valores de y" },
      { lead: "a leitura do intercepto no eixo y", answer: "a identificacao do valor da funcao quando x e igual a zero", why: "esse ponto ajuda a comparar funcoes exponenciais" }
    ]
  },
  {
    subtopico: "Equacoes exponenciais",
    habilidade: "resolver equacoes com incognita no expoente",
    tags: ["equacoes", "resolucao"],
    fatos: [
      { lead: "a estrategia de igualar bases", answer: "o procedimento que permite comparar diretamente os expoentes", why: "bases iguais simplificam a resolucao da equacao exponencial" },
      { lead: "a equacao 2^x=8", answer: "um caso em que x vale 3 por equivalencia de potencias", why: "8 pode ser escrito como 2 elevado a 3" },
      { lead: "a mudanca para base comum", answer: "um recurso usado quando os dois lados podem ser escritos com a mesma base", why: "isso transforma a equacao exponencial em uma comparacao entre expoentes" },
      { lead: "o uso de logaritmos em equacoes exponenciais", answer: "a alternativa quando nao e possivel igualar bases de forma imediata", why: "o logaritmo isola o expoente em casos mais gerais" },
      { lead: "a verificacao da solucao encontrada", answer: "a substituicao do valor obtido na equacao original", why: "essa etapa confirma se o resultado satisfaz a igualdade" }
    ]
  },
  {
    subtopico: "Inequacoes exponenciais",
    habilidade: "analisar desigualdades envolvendo funcoes exponenciais",
    tags: ["inequacoes", "comparacao"],
    fatos: [
      { lead: "uma inequacao com base maior que 1", answer: "o caso em que o sentido da desigualdade entre expoentes e mantido", why: "a funcao crescente preserva a ordem" },
      { lead: "uma inequacao com base entre 0 e 1", answer: "o caso em que o sentido da desigualdade entre expoentes e invertido", why: "a funcao decrescente altera a ordem comparativa" },
      { lead: "a analise da monotonicidade da funcao", answer: "a etapa essencial para resolver inequacoes exponenciais", why: "o comportamento crescente ou decrescente decide a comparacao correta" },
      { lead: "a escrita de ambos os lados com base comum", answer: "um procedimento util para simplificar uma inequacao exponencial", why: "a comparacao passa a ocorrer diretamente nos expoentes" },
      { lead: "o conjunto-solucao de uma inequacao", answer: "o intervalo de valores de x que torna a desigualdade verdadeira", why: "inequacoes costumam produzir faixas e nao apenas um numero isolado" }
    ]
  },
  {
    subtopico: "Aplicacoes em contextos reais",
    habilidade: "interpretar modelos exponenciais em situacoes contextualizadas",
    tags: ["aplicacoes", "contexto"],
    fatos: [
      { lead: "o crescimento populacional idealizado", answer: "uma situacao frequentemente modelada por funcao exponencial crescente", why: "o aumento proporcional em cada periodo combina com a estrutura do modelo" },
      { lead: "a meia-vida de uma substancia", answer: "o intervalo em que a quantidade se reduz a metade", why: "esse conceito aparece em modelos exponenciais de decaimento" },
      { lead: "os juros compostos", answer: "uma aplicacao financeira classica da ideia de crescimento exponencial", why: "o capital e multiplicado por um fator fixo a cada periodo" },
      { lead: "a depreciacao percentual sucessiva", answer: "um caso de decrescimento exponencial em valor monetario", why: "cada etapa conserva apenas uma fracao do valor anterior" },
      { lead: "a modelagem por fator multiplicativo", answer: "a traducao matematica de variacoes percentuais repetidas", why: "o fator permite ligar taxa e funcao exponencial" }
    ]
  },
  {
    subtopico: "Comparacoes de taxas",
    habilidade: "comparar comportamentos exponenciais em diferentes bases",
    tags: ["comparacao", "taxas"],
    fatos: [
      { lead: "a base maior em duas exponenciais crescentes", answer: "o fator que produz crescimento mais acelerado", why: "quanto maior a base acima de 1, mais rapida e a elevacao dos valores" },
      { lead: "a base menor em duas exponenciais decrescentes", answer: "o fator que produz queda mais rapida", why: "valores mais proximos de zero reduzem a imagem mais intensamente" },
      { lead: "a comparacao entre crescimento linear e exponencial", answer: "a distincao entre soma constante e multiplicacao constante", why: "isso explica por que o crescimento exponencial supera o linear ao longo do tempo" },
      { lead: "a analise de tabelas de variacao multiplicativa", answer: "um caminho para reconhecer comportamento exponencial", why: "razoes constantes entre termos consecutivos indicam esse modelo" },
      { lead: "o uso do grafico para comparar taxas", answer: "a observacao de qual curva cresce ou decai mais rapidamente", why: "a inclinacao e o afastamento visual ajudam na interpretacao" }
    ]
  },
  {
    subtopico: "Interpretacao de problemas",
    habilidade: "resolver e interpretar situacoes problema envolvendo exponenciais",
    tags: ["problemas", "interpretacao"],
    fatos: [
      { lead: "a identificacao da taxa percentual em um enunciado", answer: "a etapa que permite definir o fator multiplicativo do modelo", why: "sem essa leitura o problema nao pode ser corretamente parametrizado" },
      { lead: "a traducao de aumento de 20 por cento", answer: "a multiplicacao da quantidade por 1,2 em cada etapa", why: "o fator de crescimento e 1 mais a taxa decimal" },
      { lead: "a traducao de reducao de 15 por cento", answer: "a multiplicacao da quantidade por 0,85 em cada etapa", why: "o fator de decaimento e 1 menos a taxa decimal" },
      { lead: "a leitura correta do tempo no modelo exponencial", answer: "a identificacao do numero de repeticoes do processo", why: "o tempo costuma aparecer como expoente na funcao" },
      { lead: "a interpretacao final da resposta", answer: "a associacao do resultado numerico ao contexto descrito", why: "em matematica aplicada nao basta calcular, e preciso concluir no contexto" }
    ]
  }
];

export const funcoesExponenciais = createMathematicsTopic({
  id: "matematica_funcoes_exponenciais",
  serie: 2,
  topico: "Funcoes Exponenciais",
  prefix: "fe",
  eixo: "Algebra",
  frente: "Funcoes e modelagem",
  searchAliases: [
    "funcao exponencial",
    "crescimento exponencial",
    "decaimento exponencial",
    "equacao exponencial",
    "juros compostos"
  ],
  habilidadesBase: [
    "identificar a estrutura basica de uma funcao exponencial",
    "relacionar propriedades de potencias ao estudo exponencial",
    "interpretar graficos e transformacoes de exponenciais",
    "resolver equacoes e inequacoes exponenciais",
    "modelar situacoes reais com crescimento ou decaimento exponencial"
  ],
  blocos
});
