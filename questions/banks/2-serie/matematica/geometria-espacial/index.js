import { createMathematicsTopic } from "../../../_shared/mathematicsTopicFactory.js";

const blocos = [
  {
    subtopico: "Conceitos iniciais",
    habilidade: "identificar elementos basicos da geometria espacial",
    tags: ["conceitos", "espaco"],
    fatos: [
      { lead: "um solido geometrico", answer: "a figura tridimensional que possui comprimento, largura e altura", why: "essa e a ideia geral da geometria espacial" },
      { lead: "uma face de um poliedro", answer: "cada superficie plana que compoe o solido", why: "as faces delimitam o contorno do poliedro" },
      { lead: "uma aresta", answer: "o segmento resultante do encontro entre duas faces", why: "ela organiza a estrutura dos poliedros" },
      { lead: "um vertice", answer: "o ponto de encontro entre arestas do solido", why: "vertices ajudam a contar e classificar figuras espaciais" },
      { lead: "um corpo redondo", answer: "o solido com superficie curva, como cilindro, cone e esfera", why: "essa categoria difere dos poliedros de faces planas" }
    ]
  },
  {
    subtopico: "Prismas",
    habilidade: "reconhecer propriedades e medidas em prismas",
    tags: ["prismas", "poliedros"],
    fatos: [
      { lead: "um prisma", answer: "o poliedro com duas bases paralelas e congruentes ligadas por faces laterais", why: "essa configuracao define a familia dos prismas" },
      { lead: "a altura de um prisma", answer: "a distância entre os planos das bases", why: "ela entra diretamente no calculo de volume" },
      { lead: "um prisma reto", answer: "o prisma cujas arestas laterais são perpendiculares as bases", why: "nessa situação as faces laterais são retangulos" },
      { lead: "o volume de um prisma", answer: "a area da base multiplicada pela altura", why: "essa e a formula geral para esse tipo de solido" },
      { lead: "a planificacao de um prisma", answer: "a representacao plana de suas faces abertas", why: "ela ajuda a visualizar e calcular areas" }
    ]
  },
  {
    subtopico: "Piramides",
    habilidade: "reconhecer propriedades e medidas em piramides",
    tags: ["piramides", "poliedros"],
    fatos: [
      { lead: "uma piramide", answer: "o poliedro com uma base e faces laterais triangulares que se encontram em um vertice", why: "essa estrutura distingue as piramides dos prismas" },
      { lead: "o apice de uma piramide", answer: "o vertice comum a todas as faces laterais", why: "ele e o ponto superior caracteristico do solido" },
      { lead: "a altura de uma piramide", answer: "a distância perpendicular do apice ao plano da base", why: "ela determina o volume do solido" },
      { lead: "o volume de uma piramide", answer: "a area da base multiplicada pela altura e dividida por 3", why: "essa reducao distingue o volume da piramide do prisma correspondente" },
      { lead: "uma piramide regular", answer: "aquela cuja base e um poligono regular e cujo apice projeta-se no centro da base", why: "essa simetria facilita varios calculos" }
    ]
  },
  {
    subtopico: "Cilindros",
    habilidade: "interpretar formulas de area e volume do cilindro",
    tags: ["cilindro", "corpos-redondos"],
    fatos: [
      { lead: "um cilindro", answer: "o corpo redondo com duas bases circulares paralelas e congruentes", why: "essa e a definicao mais comum do cilindro reto" },
      { lead: "a area lateral de um cilindro", answer: "o produto do comprimento da circunferencia da base pela altura", why: "a superficie lateral se abre em um retângulo" },
      { lead: "a area total de um cilindro", answer: "a soma da area lateral com as areas das duas bases", why: "todas as superficies externas devem ser consideradas" },
      { lead: "o volume de um cilindro", answer: "a area da base circular multiplicada pela altura", why: "o principio e o mesmo adotado para prismas" },
      { lead: "a secao meridiana do cilindro reto", answer: "um retângulo obtido por corte que passa pelo eixo", why: "essa secao ajuda na visualizacao das medidas internas" }
    ]
  },
  {
    subtopico: "Cones",
    habilidade: "interpretar formulas de area e volume do cone",
    tags: ["cone", "corpos-redondos"],
    fatos: [
      { lead: "um cone", answer: "o corpo redondo com base circular e superficie lateral que converge para um vertice", why: "essa e a configuracao tipica do cone reto" },
      { lead: "a geratriz do cone reto", answer: "o segmento que vai do vertice a um ponto da circunferencia da base", why: "ela aparece na formula da area lateral" },
      { lead: "a area lateral de um cone", answer: "o produto de pi, raio e geratriz", why: "essa formula mede a superficie curva lateral" },
      { lead: "a area total de um cone", answer: "a soma da area lateral com a area da base circular", why: "o calculo externo completo inclui a base" },
      { lead: "o volume de um cone", answer: "a area da base multiplicada pela altura e dividida por 3", why: "a relação lembra a da piramide com base correspondente" }
    ]
  },
  {
    subtopico: "Esferas",
    habilidade: "reconhecer propriedades da esfera e suas formulas",
    tags: ["esfera", "corpos-redondos"],
    fatos: [
      { lead: "uma esfera", answer: "o conjunto de pontos do espaco que estao a mesma distância de um centro", why: "essa distância comum recebe o nome de raio" },
      { lead: "o raio da esfera", answer: "a distância entre o centro e qualquer ponto da superficie", why: "ele determina area e volume do solido" },
      { lead: "a area da superficie esferica", answer: "a formula quatro pi vezes o raio ao quadrado", why: "ela mede toda a superficie externa da esfera" },
      { lead: "o volume da esfera", answer: "a formula quatro tercios de pi vezes o raio ao cubo", why: "essa expressao relaciona o volume ao raio" },
      { lead: "um grande circulo da esfera", answer: "a secao plana que passa pelo centro e produz o maior circulo possível", why: "essa secao tem raio igual ao da esfera" }
    ]
  },
  {
    subtopico: "Areas de solidos",
    habilidade: "comparar e interpretar areas laterais e totais",
    tags: ["areas", "superficies"],
    fatos: [
      { lead: "a area lateral", answer: "a medida apenas das faces ou superficies laterais do solido", why: "ela exclui as bases quando houver" },
      { lead: "a area total", answer: "a soma de todas as superficies externas do corpo geometrico", why: "esse valor inclui faces laterais e bases" },
      { lead: "a planificacao", answer: "o recurso que ajuda a visualizar a composicao da area total", why: "abrir o solido facilita a soma das partes" },
      { lead: "a unidade de area", answer: "a medida quadrada usada para expressar superficies", why: "areas sempre são dadas em unidades ao quadrado" },
      { lead: "a comparacao entre solidos por area", answer: "a análise de quanta superficie externa cada corpo apresenta", why: "isso e util em problemas de revestimento ou pintura" }
    ]
  },
  {
    subtopico: "Volumes de solidos",
    habilidade: "comparar e interpretar volumes em diferentes solidos",
    tags: ["volumes", "medidas"],
    fatos: [
      { lead: "o volume de um solido", answer: "a medida do espaco ocupado por ele", why: "essa grandeza e expressa em unidades cubicas" },
      { lead: "a unidade de volume", answer: "a medida cubica associada ao espaco tridimensional", why: "comprimento, largura e altura entram simultaneamente" },
      { lead: "a comparacao entre prisma e piramide de mesma base e altura", answer: "a relação em que o volume da piramide e um terco do volume do prisma", why: "as formulas evidenciam essa proporcao" },
      { lead: "a comparacao entre cilindro e cone de mesma base e altura", answer: "a relação em que o volume do cone e um terco do volume do cilindro", why: "o principio volumetrico e analogo ao dos poliedros correspondentes" },
      { lead: "a interpretação de capacidade em litros", answer: "uma aplicacao pratica do calculo de volume", why: "reservatorios e recipientes costumam exigir essa conversao" }
    ]
  },
  {
    subtopico: "Secoes e diagonais",
    habilidade: "interpretar cortes, secoes e diagonais em solidos",
    tags: ["secoes", "diagonais"],
    fatos: [
      { lead: "uma secao plana", answer: "a figura obtida pela interseccao de um plano com um solido", why: "ela revela formas internas do corpo" },
      { lead: "a diagonal espacial de um paralelepipedo", answer: "o segmento que liga vertices opostos passando pelo interior do solido", why: "ela difere das diagonais de face" },
      { lead: "a diagonal de face", answer: "o segmento que une vertices opostos de uma mesma face plana", why: "ela pertence a apenas uma das superficies do solido" },
      { lead: "a secao meridiana", answer: "o corte por um plano que contém o eixo de certos corpos redondos", why: "esse tipo de secao simplifica a visualizacao interna" },
      { lead: "a interpretação de cortes em problemas espaciais", answer: "a análise da figura bidimensional gerada por uma interseccao", why: "muitas questoes exploram justamente essa mudanca de perspectiva" }
    ]
  },
  {
    subtopico: "Problemas contextualizados",
    habilidade: "resolver problemas integrando formulas e leitura espacial",
    tags: ["problemas", "interpretacao"],
    fatos: [
      { lead: "o calculo de quantidade de tinta para um reservatorio", answer: "um problema de area total ou lateral do solido", why: "o revestimento depende da superficie exposta" },
      { lead: "o calculo de capacidade de uma caixa d'agua", answer: "um problema de volume do corpo geometrico", why: "a quantidade armazenada depende do espaco interno" },
      { lead: "a escolha correta da formula em geometria espacial", answer: "a identificacao do tipo de solido e da medida pedida", why: "muitos erros surgem por confundir area com volume" },
      { lead: "a leitura de medidas dadas em enunciado", answer: "a associacao correta entre raio, altura, geratriz ou aresta", why: "cada formula utiliza grandezas especificas" },
      { lead: "a interpretação final de um problema espacial", answer: "a traducao do valor obtido para a grandeza concreta solicitada", why: "e preciso concluir se o resultado representa area, volume ou comprimento" }
    ]
  }
];

export const geometriaEspacial = createMathematicsTopic({
  id: "matematica_geometria_espacial",
  serie: 2,
  topico: "Geometria Espacial",
  prefix: "ge",
  eixo: "Geometria",
  frente: "Solidos geometricos",
  searchAliases: [
    "prisma",
    "piramide",
    "cilindro",
    "cone",
    "esfera"
  ],
  habilidadesBase: [
    "identificar elementos basicos da geometria espacial",
    "aplicar formulas de area e volume em solidos geometricos",
    "comparar prismas, piramides e corpos redondos",
    "interpretar secoes e diagonais em solidos",
    "resolver problemas contextualizados envolvendo espaco e capacidade"
  ],
  blocos
});
