import { createMathematicsTopic } from "../../../_shared/mathematicsTopicFactory.js";

const blocos = [
  {
    subtopico: "Ângulos e medidas",
    habilidade: "converter e interpretar medidas angulares",
    tags: ["angulos", "medidas"],
    fatos: [
      { lead: "a medida em graus", answer: "a divisao da volta completa em 360 partes iguais", why: "essa e a unidade angular mais usual no ensino basico" },
      { lead: "a medida em radianos", answer: "a relação entre arco e raio na circunferencia", why: "ela fornece uma medida natural para ângulos" },
      { lead: "a equivalencia entre 180 graus e pi radianos", answer: "a conversao fundamental entre as duas unidades angulares", why: "essa relação sustenta todas as demais conversoes" },
      { lead: "uma volta completa", answer: "o ângulo de 360 graus ou 2 pi radianos", why: "ela representa o contorno integral da circunferencia" },
      { lead: "um ângulo notavel de 90 graus", answer: "a medida correspondente a pi sobre 2 radianos", why: "esse valor aparece com frequência em trigonometria" }
    ]
  },
  {
    subtopico: "Razoes trigonometricas no triângulo retângulo",
    habilidade: "identificar seno, cosseno e tangente em triângulos retangulos",
    tags: ["triangulo-retangulo", "razoes"],
    fatos: [
      { lead: "o seno de um ângulo agudo", answer: "a razao entre cateto oposto e hipotenusa", why: "essa definicao vale no triângulo retângulo" },
      { lead: "o cosseno de um ângulo agudo", answer: "a razao entre cateto adjacente e hipotenusa", why: "essa e outra definicao basica da trigonometria plana" },
      { lead: "a tangente de um ângulo agudo", answer: "a razao entre cateto oposto e cateto adjacente", why: "ela pode ser vista como seno dividido por cosseno" },
      { lead: "a hipotenusa", answer: "o lado oposto ao ângulo reto e o maior lado do triângulo", why: "ela aparece no denominador de seno e cosseno" },
      { lead: "o uso trigonometrico do triângulo retângulo", answer: "a determinacao de lados e ângulos a partir de relações de razoes", why: "essa aplicacao organiza problemas geometricos e fisicos" }
    ]
  },
  {
    subtopico: "Circunferencia trigonometrica",
    habilidade: "relacionar a circunferencia trigonometrica aos valores das funções",
    tags: ["circunferencia", "funcoes"],
    fatos: [
      { lead: "a circunferencia trigonometrica", answer: "a circunferencia de raio 1 centrada na origem do plano cartesiano", why: "ela permite estender as razoes para todos os ângulos" },
      { lead: "o cosseno na circunferencia", answer: "a coordenada x do ponto associado ao ângulo", why: "essa leitura conecta geometria e função" },
      { lead: "o seno na circunferencia", answer: "a coordenada y do ponto associado ao ângulo", why: "essa interpretação vale para qualquer quadrante" },
      { lead: "a tangente na circunferencia", answer: "a razao entre seno e cosseno quando o cosseno não e zero", why: "isso explica os pontos de indefinicao da função" },
      { lead: "o sentido positivo de medicao angular", answer: "a rotacao no sentido anti-horario", why: "essa convencao e adotada na circunferencia trigonometrica" }
    ]
  },
  {
    subtopico: "Arcos notaveis e quadrantes",
    habilidade: "interpretar sinais e valores de ângulos notaveis",
    tags: ["arcos-notaveis", "quadrantes"],
    fatos: [
      { lead: "o primeiro quadrante", answer: "a regiao em que seno e cosseno são positivos", why: "ambas as coordenadas do ponto associado são positivas" },
      { lead: "o segundo quadrante", answer: "a regiao em que o seno e positivo e o cosseno e negativo", why: "a coordenada y permanece positiva e a x se torna negativa" },
      { lead: "o terceiro quadrante", answer: "a regiao em que seno e cosseno são negativos", why: "as duas coordenadas ficam abaixo de zero" },
      { lead: "o quarto quadrante", answer: "a regiao em que o seno e negativo e o cosseno e positivo", why: "a coordenada y e negativa e a x positiva" },
      { lead: "um ângulo notavel como 30 graus", answer: "um valor cujo seno e cosseno são tradicionalmente memorizados", why: "esses arcos facilitam calculos e comparacoes" }
    ]
  },
  {
    subtopico: "Identidades trigonometricas",
    habilidade: "reconhecer relações fundamentais entre seno, cosseno e tangente",
    tags: ["identidades", "relacoes"],
    fatos: [
      { lead: "a identidade fundamental da trigonometria", answer: "a igualdade seno ao quadrado mais cosseno ao quadrado igual a 1", why: "ela deriva do teorema de Pitagoras na circunferencia trigonometrica" },
      { lead: "a relação entre tangente, seno e cosseno", answer: "a expressao tangente igual a seno dividido por cosseno", why: "essa formula conecta as tres funções basicas" },
      { lead: "a reducao por periodicidade", answer: "o uso do periodo para encontrar valores equivalentes de funções trigonometricas", why: "seno e cosseno se repetem a cada volta completa" },
      { lead: "o periodo do seno e do cosseno", answer: "o intervalo de 2 pi radianos", why: "apos esse deslocamento os valores se repetem" },
      { lead: "o periodo da tangente", answer: "o intervalo de pi radianos", why: "a função repete seus valores em meia volta" }
    ]
  },
  {
    subtopico: "Equacoes trigonometricas",
    habilidade: "resolver equacoes envolvendo funções trigonometricas",
    tags: ["equacoes", "resolucao"],
    fatos: [
      { lead: "uma equacao como seno de x igual a zero", answer: "um caso cuja solucao envolve os múltiplos de pi", why: "o seno zera nos ângulos alinhados ao eixo x" },
      { lead: "uma equacao como cosseno de x igual a zero", answer: "um caso cuja solucao envolve pi sobre 2 mais múltiplos de pi", why: "o cosseno zera quando a coordenada x se anula" },
      { lead: "uma equacao como tangente de x igual a zero", answer: "um caso cuja solucao envolve múltiplos inteiros de pi", why: "a tangente zera quando o seno vale zero e o cosseno não" },
      { lead: "a busca por solucoes em intervalo dado", answer: "a restricao das respostas ao conjunto angular pedido no enunciado", why: "equacoes trigonometricas podem ter infinitas solucoes gerais" },
      { lead: "a análise do ciclo trigonometrico na resolucao", answer: "o recurso gráfico para localizar todas as solucoes possíveis", why: "a circunferencia ajuda a visualizar simetrias e periodicidade" }
    ]
  },
  {
    subtopico: "Funções trigonometricas",
    habilidade: "interpretar gráficos e parametros das funções trigonometricas",
    tags: ["funcoes", "graficos"],
    fatos: [
      { lead: "o gráfico do seno", answer: "uma curva periodica oscilante entre menos 1 e 1", why: "a amplitude natural da função seno e 1" },
      { lead: "o gráfico do cosseno", answer: "uma curva periodica semelhante ao seno, mas deslocada horizontalmente", why: "as duas funções tem mesma amplitude e periodo basico" },
      { lead: "a amplitude de A vezes seno de x", answer: "o valor absoluto de A", why: "esse coeficiente estica ou comprime o gráfico verticalmente" },
      { lead: "o periodo em seno de bx", answer: "o intervalo 2 pi dividido pelo modulo de b", why: "o coeficiente interno altera a repeticao da onda" },
      { lead: "o deslocamento vertical em seno de x mais k", answer: "a translacao do gráfico para cima ou para baixo em k unidades", why: "o termo externo soma o mesmo valor a todas as imagens" }
    ]
  },
  {
    subtopico: "Lei dos senos",
    habilidade: "aplicar a lei dos senos em triângulos quaisquer",
    tags: ["lei-dos-senos", "triangulos"],
    fatos: [
      { lead: "a lei dos senos", answer: "a proporcao entre cada lado e o seno do ângulo oposto em um triângulo", why: "ela relaciona medidas angulares e lineares" },
      { lead: "o uso da lei dos senos", answer: "a resolucao de triângulos não retangulos quando ha pares lado-ângulo conhecidos", why: "essa formula amplia o alcance da trigonometria" },
      { lead: "o lado oposto em um triângulo", answer: "o segmento que fica em frente ao ângulo considerado", why: "essa correspondencia e central na lei dos senos" },
      { lead: "a leitura correta da proporcao trigonometrica", answer: "a associacao de cada lado ao seno de seu ângulo oposto", why: "trocar os pares compromete toda a resolucao" },
      { lead: "a interpretação geometrica da lei dos senos", answer: "a conservacao de uma razao comum entre lados e ângulos opostos", why: "isso reflete uma estrutura interna do triângulo" }
    ]
  },
  {
    subtopico: "Lei dos cossenos",
    habilidade: "aplicar a lei dos cossenos em triângulos quaisquer",
    tags: ["lei-dos-cossenos", "triangulos"],
    fatos: [
      { lead: "a lei dos cossenos", answer: "a generalizacao do teorema de Pitagoras para triângulos quaisquer", why: "ela incorpora o cosseno do ângulo entre dois lados" },
      { lead: "o uso da lei dos cossenos", answer: "a resolucao de triângulos quando se conhecem dois lados e o ângulo entre eles ou tres lados", why: "nesses casos ela e especialmente eficiente" },
      { lead: "o termo menos duas vezes b vezes c vezes cosseno de A", answer: "a parcela que ajusta a relação pitagorica ao ângulo não reto", why: "ela diferencia a lei dos cossenos do caso retangular" },
      { lead: "um triângulo retângulo na lei dos cossenos", answer: "um caso em que a formula se reduz ao teorema de Pitagoras", why: "o cosseno de 90 graus vale zero" },
      { lead: "a identificacao do ângulo compreendido", answer: "a leitura do ângulo formado pelos dois lados conhecidos", why: "ele e o ângulo que entra diretamente na formula" }
    ]
  },
  {
    subtopico: "Aplicacoes e interpretação",
    habilidade: "resolver problemas contextualizados com trigonometria",
    tags: ["aplicacoes", "interpretacao"],
    fatos: [
      { lead: "a altura inacessivel de um predio", answer: "um problema classico resolvido com razoes trigonometricas", why: "triângulos e ângulos de observação permitem estimar medidas" },
      { lead: "a inclinacao de uma rampa", answer: "uma situação que pode ser interpretada por seno, cosseno ou tangente", why: "a relação entre desnivel e deslocamento horizontal ou comprimento define a escolha" },
      { lead: "o uso de ângulos de elevacao e depressao", answer: "a aplicacao da trigonometria em observação e topografia", why: "esses ângulos conectam visada e medidas no espaco" },
      { lead: "a modelagem periodica com seno e cosseno", answer: "a representacao de fenomenos repetitivos como ondas e ciclos", why: "essas funções descrevem oscilações naturais" },
      { lead: "a interpretação final de um problema trigonometrico", answer: "a associacao do valor calculado a medida ou comportamento pedido", why: "a resolucao precisa voltar ao contexto original" }
    ]
  }
];

export const trigonometriaCompleta = createMathematicsTopic({
  id: "matematica_trigonometria_completa",
  serie: 2,
  topico: "Trigonometria Completa",
  prefix: "trig",
  eixo: "Geometria e funções",
  frente: "Trigonometria",
  searchAliases: [
    "seno",
    "cosseno",
    "tangente",
    "lei dos senos",
    "lei dos cossenos"
  ],
  habilidadesBase: [
    "converter e interpretar medidas angulares",
    "identificar razoes trigonometricas no triângulo retângulo",
    "interpretar a circunferencia trigonometrica e os quadrantes",
    "resolver equacoes e problemas com funções trigonometricas",
    "aplicar leis dos senos e dos cossenos em contextos geometricos"
  ],
  blocos
});
