import { createMathematicsTopic } from "../../../_shared/mathematicsTopicFactory.js";

const blocos = [
  {
    subtopico: "Funções e gráficos",
    habilidade: "integrar conceitos de funções em revisao",
    tags: ["revisao", "funcoes"],
    fatos: [
      { lead: "uma função", answer: "a relação que associa a cada elemento do dominio um unico elemento da imagem", why: "essa unicidade define o conceito formal" },
      { lead: "o gráfico de uma função", answer: "a representacao no plano cartesiano dos pares ordenados da relação", why: "ele permite interpretar comportamento e variação" },
      { lead: "o dominio de uma função", answer: "o conjunto de valores permitidos para a variavel independente", why: "ele precisa ser analisado antes de resolver problemas" },
      { lead: "a imagem de uma função", answer: "o conjunto de valores efetivamente assumidos pela variavel dependente", why: "ela descreve os resultados produzidos pela regra" },
      { lead: "a taxa de variação", answer: "a medida de como a saida se altera quando a entrada muda", why: "esse conceito aparece em varios tipos de função" }
    ]
  },
  {
    subtopico: "Algebra e equacoes",
    habilidade: "revisar procedimentos algebricos essenciais",
    tags: ["revisao", "algebra"],
    fatos: [
      { lead: "uma equacao do primeiro grau", answer: "a igualdade em que a incognita aparece elevada a 1", why: "esse e o caso linear mais basico" },
      { lead: "uma equacao do segundo grau", answer: "a igualdade em que o maior expoente da incognita e 2", why: "ela admite resolucao por fatoracao ou formula geral" },
      { lead: "uma inequacao", answer: "a sentenca matemática que compara expressoes por desigualdade", why: "o objetivo e encontrar o conjunto de valores que a satisfaz" },
      { lead: "a fatoracao", answer: "a escrita de uma expressao como produto de fatores", why: "esse recurso simplifica varias resolucoes" },
      { lead: "o conjunto-solucao", answer: "o conjunto dos valores que tornam verdadeira a sentenca proposta", why: "ele sintetiza a resposta de equacoes e inequacoes" }
    ]
  },
  {
    subtopico: "Geometria plana",
    habilidade: "retomar conceitos de figuras planas e medidas",
    tags: ["revisao", "geometria-plana"],
    fatos: [
      { lead: "o perimetro", answer: "a soma dos comprimentos dos lados de uma figura plana", why: "ele mede o contorno da figura" },
      { lead: "a area", answer: "a medida da superficie ocupada por uma figura plana", why: "ela e expressa em unidades quadradas" },
      { lead: "um triângulo retângulo", answer: "o triângulo que possui um ângulo de 90 graus", why: "ele permite aplicar o teorema de Pitagoras" },
      { lead: "o teorema de Pitagoras", answer: "a relação que iguala o quadrado da hipotenusa a soma dos quadrados dos catetos", why: "essa e uma das bases da geometria plana" },
      { lead: "a semelhanca de triângulos", answer: "a correspondencia entre figuras de mesma forma com lados proporcionais", why: "ela permite calcular medidas por proporcao" }
    ]
  },
  {
    subtopico: "Geometria espacial",
    habilidade: "retomar propriedades dos principais solidos geometricos",
    tags: ["revisao", "geometria-espacial"],
    fatos: [
      { lead: "o volume", answer: "a medida do espaco ocupado por um corpo tridimensional", why: "essa grandeza e central na geometria espacial" },
      { lead: "a area total de um solido", answer: "a soma de todas as superficies externas do corpo", why: "ela e usada em revestimentos e planificacoes" },
      { lead: "um prisma", answer: "o poliedro com duas bases paralelas e congruentes", why: "esse e um dos solidos mais frequentes em problemas" },
      { lead: "uma piramide", answer: "o poliedro com uma base e faces triangulares ligadas a um apice", why: "ela se diferencia do prisma pela convergencia das faces laterais" },
      { lead: "um corpo redondo", answer: "o solido com superficie curva como cilindro, cone e esfera", why: "essa classificacao e importante na revisao espacial" }
    ]
  },
  {
    subtopico: "Trigonometria",
    habilidade: "retomar razoes e funções trigonometricas",
    tags: ["revisao", "trigonometria"],
    fatos: [
      { lead: "o seno", answer: "a razao entre cateto oposto e hipotenusa no triângulo retângulo", why: "essa definicao basica sustenta a função seno" },
      { lead: "o cosseno", answer: "a razao entre cateto adjacente e hipotenusa no triângulo retângulo", why: "essa definicao basica sustenta a função cosseno" },
      { lead: "a tangente", answer: "a razao entre cateto oposto e cateto adjacente", why: "ela também pode ser vista como seno sobre cosseno" },
      { lead: "a circunferencia trigonometrica", answer: "a circunferencia de raio 1 usada para estudar ângulos e funções", why: "ela amplia a trigonometria para todos os quadrantes" },
      { lead: "a periodicidade trigonometrica", answer: "a repeticao regular dos valores das funções apos certo intervalo angular", why: "esse comportamento aparece em seno, cosseno e tangente" }
    ]
  },
  {
    subtopico: "Análise combinatoria e probabilidade",
    habilidade: "revisar contagem e eventos aleatorios",
    tags: ["revisao", "combinatoria", "probabilidade"],
    fatos: [
      { lead: "o principio fundamental da contagem", answer: "a regra que multiplica possibilidades de etapas independentes", why: "ele organiza contagens simples e compostas" },
      { lead: "uma permutacao", answer: "a contagem de arranjos em que todos os elementos participam", why: "a ordem dos elementos e relevante" },
      { lead: "uma combinacao", answer: "a selecao de elementos em que a ordem não importa", why: "esse critério distingue combinacao de arranjo" },
      { lead: "a probabilidade de um evento", answer: "a razao entre casos favoraveis e casos possíveis em um espaco equiprovavel", why: "essa e a definicao classica mais usada" },
      { lead: "eventos complementares", answer: "eventos cujas probabilidades somam 1", why: "quando um ocorre o outro necessariamente não ocorre" }
    ]
  },
  {
    subtopico: "Estatistica",
    habilidade: "revisar leitura e análise de dados",
    tags: ["revisao", "estatistica"],
    fatos: [
      { lead: "a média aritmetica", answer: "o quociente entre a soma dos valores e a quantidade de dados", why: "ela resume um conjunto por um valor central" },
      { lead: "a mediana", answer: "o valor central de um conjunto ordenado de dados", why: "ela divide a amostra em duas partes equivalentes" },
      { lead: "a moda", answer: "o valor que ocorre com maior frequência", why: "ela destaca a repeticao em um conjunto de dados" },
      { lead: "o desvio padrao", answer: "a medida de dispersao que indica o afastamento medio em relação a média", why: "ele ajuda a comparar regularidade entre conjuntos" },
      { lead: "a interpretação de gráficos", answer: "a leitura critica de tendencias, frequencias e comparacoes entre dados", why: "essa habilidade e central no ENEM e em vestibulares" }
    ]
  },
  {
    subtopico: "Funções exponenciais e logaritmos",
    habilidade: "integrar exponenciais e logaritmos em revisao",
    tags: ["revisao", "exponencial", "logaritmo"],
    fatos: [
      { lead: "uma função exponencial", answer: "a função em que a variavel aparece no expoente", why: "ela modela crescimentos e decaimentos multiplicativos" },
      { lead: "um logaritmo", answer: "o expoente que transforma a base em determinado valor", why: "ele e o processo inverso da exponencial" },
      { lead: "o crescimento exponencial", answer: "o comportamento associado a base maior que 1", why: "a imagem cresce cada vez mais rapidamente" },
      { lead: "o decrescimento exponencial", answer: "o comportamento associado a base entre 0 e 1", why: "a imagem se aproxima de zero sem se anular" },
      { lead: "a mudanca de base", answer: "o recurso que reescreve um logaritmo em outra base equivalente", why: "ela simplifica comparacoes e calculos" }
    ]
  },
  {
    subtopico: "Matemática financeira e porcentagem",
    habilidade: "revisar razao, proporcao e juros em contexto",
    tags: ["revisao", "financeira", "porcentagem"],
    fatos: [
      { lead: "uma porcentagem", answer: "a razao expressa em cada cem partes", why: "ela e usada para comparacoes proporcionais" },
      { lead: "o juros simples", answer: "o rendimento calculado sempre sobre o capital inicial", why: "o acrescimo por periodo e constante" },
      { lead: "o juros compostos", answer: "o rendimento calculado sobre o montante acumulado em cada etapa", why: "o valor cresce por multiplicacao sucessiva" },
      { lead: "a regra de tres", answer: "o procedimento proporcional usado para relacionar grandezas", why: "ela resolve varias questoes do cotidiano" },
      { lead: "a razao entre grandezas", answer: "a comparacao entre duas medidas por meio de divisao", why: "ela fundamenta proporcoes e escalas" }
    ]
  },
  {
    subtopico: "Interpretação e modelagem",
    habilidade: "integrar leitura de enunciados e modelagem matemática",
    tags: ["revisao", "modelagem", "interpretacao"],
    fatos: [
      { lead: "a modelagem matemática", answer: "a traducao de uma situação real para linguagem matemática", why: "ela permite escolher formulas e estrategias adequadas" },
      { lead: "a identificacao de dados relevantes", answer: "a selecao das informacoes necessarias para resolver o problema", why: "nem todo dado do enunciado precisa entrar no calculo" },
      { lead: "a verificacao da unidade de medida", answer: "a etapa que garante coerencia entre grandezas antes do calculo", why: "misturar unidades diferentes gera erros frequentes" },
      { lead: "a estimativa do resultado", answer: "o controle intuitivo que ajuda a testar se a resposta faz sentido", why: "essa pratica reduz erros de escala e operacao" },
      { lead: "a interpretação final", answer: "a leitura do resultado numerico no contexto pedido pela questao", why: "o objetivo final e responder a situação, não apenas obter um número" }
    ]
  }
];

export const revisaoGeral = createMathematicsTopic({
  id: "matematica_revisao_geral",
  serie: 3,
  topico: "Revisao Geral",
  prefix: "revmat",
  eixo: "Revisao integrada",
  frente: "Sintese e consolidacao",
  searchAliases: [
    "revisao de matemática",
    "enem matemática",
    "funcoes",
    "probabilidade",
    "estatistica"
  ],
  habilidadesBase: [
    "integrar conceitos de algebra, geometria e funções",
    "retomar contagem, probabilidade e estatistica",
    "aplicar matemática financeira e proporcionalidade",
    "interpretar gráficos, tabelas e enunciados contextualizados",
    "modelar e concluir problemas de revisao geral"
  ],
  blocos
});
