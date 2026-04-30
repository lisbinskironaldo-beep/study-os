import { createMathematicsTopic } from "../../../_shared/mathematicsTopicFactory.js";

const blocos = [
  {
    subtopico: "Razao e proporcao",
    habilidade: "interpretar relações proporcionais em contextos cotidianos",
    tags: ["razao", "proporcao"],
    fatos: [
      { lead: "uma razao", answer: "a comparacao entre duas grandezas por meio de divisao", why: "ela expressa quanto uma grandeza representa da outra" },
      { lead: "uma proporcao", answer: "a igualdade entre duas razoes equivalentes", why: "essa relação sustenta varios procedimentos de modelagem" },
      { lead: "a leitura de velocidade média como quilometros por hora", answer: "um exemplo de razao entre distância e tempo", why: "o contexto associa duas grandezas distintas" },
      { lead: "a ampliacao proporcional de uma receita", answer: "uma aplicacao de proporcao em situações domesticas", why: "todos os ingredientes precisam manter a mesma relação" },
      { lead: "a comparacao por unidade", answer: "uma estrategia de interpretar razoes em contextos do ENEM", why: "ela ajuda a avaliar custo, consumo e rendimento" }
    ]
  },
  {
    subtopico: "Regra de tres",
    habilidade: "resolver problemas com regra de tres simples e composta",
    tags: ["regra-de-tres", "proporcionalidade"],
    fatos: [
      { lead: "a regra de tres simples", answer: "o procedimento que relaciona duas grandezas proporcionais com tres valores conhecidos", why: "ela permite encontrar o quarto valor da proporcao" },
      { lead: "a regra de tres composta", answer: "o procedimento usado quando mais de duas grandezas interferem no problema", why: "nesse caso e preciso organizar dependencias diretas e inversas" },
      { lead: "grandezas diretamente proporcionais", answer: "as grandezas que aumentam ou diminuem juntas na mesma ordem", why: "a multiplicacao por um fator em uma reflete o mesmo fator na outra" },
      { lead: "grandezas inversamente proporcionais", answer: "as grandezas em que o aumento de uma provoca a diminuicao da outra", why: "o produto entre elas permanece constante no modelo idealizado" },
      { lead: "a organizacao em tabela na regra de tres", answer: "uma estrategia para visualizar as grandezas antes do calculo", why: "essa etapa reduz erros de proporcionalidade" }
    ]
  },
  {
    subtopico: "Porcentagem",
    habilidade: "interpretar aumentos, descontos e variacoes percentuais",
    tags: ["porcentagem", "variacao"],
    fatos: [
      { lead: "uma porcentagem", answer: "uma taxa expressa em cada cem partes", why: "ela e uma forma padronizada de comparar quantidades" },
      { lead: "um desconto de 25 por cento", answer: "a reducao que corresponde a manter 75 por cento do valor inicial", why: "o fator restante e 0,75 do total" },
      { lead: "um aumento de 12 por cento", answer: "a variação que corresponde a multiplicar o valor inicial por 1,12", why: "o fator final soma a unidade inteira com a taxa decimal" },
      { lead: "a taxa percentual acumulada", answer: "a composicao de variacoes sucessivas por fatores multiplicativos", why: "porcentagens consecutivas não se somam diretamente em muitos contextos" },
      { lead: "a leitura percentual em pesquisas", answer: "a interpretação de participacoes relativas sobre um total", why: "o ENEM costuma explorar esse tipo de dado em tabelas e gráficos" }
    ]
  },
  {
    subtopico: "Juros simples e compostos",
    habilidade: "distinguir e aplicar modelos de juros em situações reais",
    tags: ["juros", "financeira"],
    fatos: [
      { lead: "o juros simples", answer: "o rendimento calculado sempre sobre o capital inicial", why: "o acrescimo por periodo e constante" },
      { lead: "o juros compostos", answer: "o rendimento calculado sobre o montante acumulado em cada etapa", why: "o valor cresce por multiplicacao sucessiva" },
      { lead: "o capital", answer: "o valor inicial aplicado ou emprestado", why: "ele serve de base para calcular os juros" },
      { lead: "a taxa de juros", answer: "o percentual que expressa o rendimento ou custo por periodo", why: "ela define o fator de crescimento financeiro" },
      { lead: "o montante", answer: "a soma do capital com os juros acumulados", why: "esse e o valor final de uma aplicacao ou divida" }
    ]
  },
  {
    subtopico: "Escalas e medidas",
    habilidade: "interpretar escalas, mapas e representacoes proporcionais",
    tags: ["escala", "medidas"],
    fatos: [
      { lead: "uma escala cartografica", answer: "a razao entre a medida no mapa e a medida real correspondente", why: "ela traduz o tamanho do espaco representado" },
      { lead: "uma escala numerica de 1 para 100000", answer: "a indicacao de que 1 unidade no mapa equivale a 100000 unidades reais", why: "essa e a leitura basica da escala" },
      { lead: "a ampliacao em desenho tecnico", answer: "a representacao em escala maior que a real", why: "ela facilita a observação de detalhes pequenos" },
      { lead: "a reducao em mapa", answer: "a representacao em escala menor que o tamanho real", why: "ela permite visualizar grandes areas em superficie limitada" },
      { lead: "a conversao de unidades em problemas de escala", answer: "uma etapa essencial para manter coerencia entre medida representada e medida real", why: "misturar unidades compromete o resultado" }
    ]
  },
  {
    subtopico: "Leitura de tabelas e gráficos",
    habilidade: "analisar dados apresentados visualmente",
    tags: ["graficos", "tabelas"],
    fatos: [
      { lead: "um gráfico de barras", answer: "a representacao que compara categorias por alturas ou comprimentos", why: "ele facilita comparacoes pontuais entre grupos" },
      { lead: "um gráfico de setores", answer: "a representacao circular que mostra participacoes relativas de um total", why: "cada fatia indica uma parcela proporcional" },
      { lead: "uma tabela de dupla entrada", answer: "a organizacao de dados segundo duas classificacoes simultaneas", why: "ela exige leitura por linhas e colunas" },
      { lead: "a taxa de variação em um gráfico temporal", answer: "a informacao sobre como a grandeza muda ao longo do tempo", why: "essa interpretação vai alem da leitura de valores isolados" },
      { lead: "a tendencia de uma serie de dados", answer: "o comportamento geral de aumento, queda ou estabilidade observado no conjunto", why: "o ENEM explora frequentemente essa leitura global" }
    ]
  },
  {
    subtopico: "Grandezas proporcionais",
    habilidade: "identificar relações diretas e inversas em problemas aplicados",
    tags: ["grandezas", "proporcionalidade"],
    fatos: [
      { lead: "grandezas diretamente proporcionais", answer: "as grandezas que variam no mesmo sentido mantendo razao constante", why: "se uma dobra, a outra também dobra no modelo ideal" },
      { lead: "grandezas inversamente proporcionais", answer: "as grandezas que variam em sentidos opostos mantendo produto constante", why: "se uma dobra, a outra cai pela metade" },
      { lead: "o consumo de combustivel por distância percorrida", answer: "um contexto que pode ser analisado por razoes e proporcionalidade", why: "a interpretação depende da unidade adotada" },
      { lead: "o tempo gasto por varias maquinas iguais", answer: "um contexto classico de proporcionalidade inversa", why: "mais maquinas reduzem o tempo necessario" },
      { lead: "a produtividade por trabalhador em modelo simplificado", answer: "um contexto que exige leitura cuidadosa da proporcionalidade envolvida", why: "nem todo problema real segue relações lineares perfeitas" }
    ]
  },
  {
    subtopico: "Modelagem de situações reais",
    habilidade: "traduzir enunciados em expressoes matematicas",
    tags: ["modelagem", "contexto"],
    fatos: [
      { lead: "a modelagem matemática", answer: "a traducao de uma situação concreta para linguagem numerica, algebrica ou grafica", why: "esse processo e central nas questoes contextualizadas" },
      { lead: "a escolha da variavel em um problema", answer: "a definicao da grandeza desconhecida que sera representada simbolicamente", why: "isso organiza o raciocínio de resolucao" },
      { lead: "a identificacao de uma relação linear", answer: "a percepcao de variação por acrescimo constante", why: "essa leitura aponta para modelos de função afim" },
      { lead: "a identificacao de uma relação exponencial", answer: "a percepcao de variação por fator multiplicativo constante", why: "essa leitura aponta para modelos de crescimento percentual" },
      { lead: "a estimativa de ordem de grandeza", answer: "a avaliação aproximada que ajuda a validar resultados num contexto real", why: "ela evita respostas numericamente incoerentes" }
    ]
  },
  {
    subtopico: "Problemas integrados do ENEM",
    habilidade: "articular diferentes conteudos em questoes interdisciplinares",
    tags: ["enem", "integracao"],
    fatos: [
      { lead: "uma questao interdisciplinar do ENEM", answer: "o problema que combina matemática com contexto social, cientifico ou economico", why: "a prova valoriza aplicacao e leitura de situações reais" },
      { lead: "a análise de consumo doméstico", answer: "um contexto que costuma envolver porcentagem, razao e leitura de tabelas", why: "esses temas aparecem em contas e comparativos" },
      { lead: "a leitura de infograficos", answer: "a interpretação simultanea de texto, imagem e dados numericos", why: "esse formato e recorrente na prova" },
      { lead: "a comparacao de planos ou tarifas", answer: "um contexto que exige confrontar custos fixos e variaveis", why: "a matemática aplicada ajuda a decidir a melhor opcao" },
      { lead: "a conclusao argumentativa em matemática aplicada", answer: "a justificativa da resposta com base nos dados do enunciado", why: "o ENEM cobra calculo e interpretação articulados" }
    ]
  },
  {
    subtopico: "Interpretação final de resultados",
    habilidade: "concluir problemas com coerencia matemática e contextual",
    tags: ["interpretacao", "conclusao"],
    fatos: [
      { lead: "a resposta coerente em unidade adequada", answer: "a apresentacao do resultado na grandeza pedida pelo problema", why: "um número sem unidade pode comprometer a interpretação" },
      { lead: "a conferencia do sentido do resultado", answer: "a verificacao de se o valor encontrado e plausivel no contexto", why: "essa etapa reduz erros de escala e leitura" },
      { lead: "a selecao dos dados realmente necessarios", answer: "a habilidade de filtrar informacoes relevantes no enunciado", why: "muitas questoes trazem dados excedentes" },
      { lead: "a interpretação de arredondamentos", answer: "a leitura de valores aproximados conforme a precisao exigida", why: "nem sempre o contexto pede resultado exato" },
      { lead: "a conclusao matemática contextualizada", answer: "a etapa de transformar o calculo em resposta clara para a situação apresentada", why: "o problema so se encerra quando o contexto e retomado" }
    ]
  }
];

export const matematicaAplicadaEnem = createMathematicsTopic({
  id: "matematica_matematica_aplicada_enem",
  serie: 3,
  topico: "Matemática Aplicada ENEM",
  prefix: "mae",
  eixo: "Matemática Aplicada",
  frente: "Contextualizacao e Modelagem",
  searchAliases: [
    "regra de tres",
    "porcentagem",
    "juros",
    "escala",
    "matemática do enem"
  ],
  habilidadesBase: [
    "interpretar relações proporcionais em contextos cotidianos",
    "resolver problemas com porcentagem, juros e escalas",
    "analisar tabelas, gráficos e grandezas proporcionais",
    "traduzir situações reais em linguagem matemática",
    "concluir problemas integrados com leitura contextual"
  ],
  blocos
});
