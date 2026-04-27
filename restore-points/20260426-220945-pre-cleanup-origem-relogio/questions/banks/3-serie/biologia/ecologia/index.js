import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  BIOLOGY_STEM_BUILDERS,
  BIOLOGY_TWO_HUNDRED_MATRIX,
  BIOLOGY_TWO_HUNDRED_PLAN
} from "../../../_shared/biologyTopicPresets.js";

const blocos = [
  {
    subtopico: "Conceitos fundamentais de ecologia",
    habilidade:
      "identificar conceitos e niveis de organizacao da ecologia",
    tags: ["ecologia", "organismos", "ambiente"],
    fatos: [
      { lead: "a ecologia", answer: "a area da biologia que estuda as relacoes dos seres vivos entre si e com o ambiente", why: "ela analisa interacoes em diferentes niveis de organizacao" },
      { lead: "o ambiente ecologico", answer: "o conjunto de fatores bioticos e abioticos que influenciam os seres vivos", why: "organismos dependem dessas condicoes para sobreviver" },
      { lead: "o fator biotico", answer: "o componente vivo do ambiente, como plantas, animais e micro-organismos", why: "ele participa de interacoes ecologicas diretas ou indiretas" },
      { lead: "o fator abiotico", answer: "o componente nao vivo do ambiente, como agua, luz e temperatura", why: "essas condicoes limitam e regulam a vida" },
      { lead: "a importancia da ecologia", answer: "a compreensao do funcionamento dos ecossistemas e do equilibrio ambiental", why: "ela conecta biologia, conservacao e sustentabilidade" }
    ]
  },
  {
    subtopico: "Niveis de organizacao ecologica",
    habilidade:
      "identificar conceitos e niveis de organizacao da ecologia",
    tags: ["populacao", "comunidade", "ecossistema"],
    fatos: [
      { lead: "a populacao", answer: "o conjunto de individuos da mesma especie vivendo em uma mesma area", why: "esses individuos interagem e compartilham recursos" },
      { lead: "a comunidade biologica", answer: "o conjunto de populacoes de especies diferentes que coexistem numa mesma area", why: "ela expressa a dimensao biotica do sistema" },
      { lead: "o ecossistema", answer: "a interacao entre comunidade biologica e fatores abioticos de uma area", why: "ele representa unidade funcional da ecologia" },
      { lead: "a biosfera", answer: "o conjunto de todos os ecossistemas da Terra", why: "ela abrange a porcao do planeta onde existe vida" },
      { lead: "o habitat", answer: "o local onde uma especie vive e encontra recursos para manter-se", why: "cada organismo ocupa um ambiente caracteristico" }
    ]
  },
  {
    subtopico: "Cadeias e teias alimentares",
    habilidade:
      "interpretar cadeias, teias e piramides ecologicas",
    tags: ["cadeia alimentar", "teia alimentar", "trofia"],
    fatos: [
      { lead: "a cadeia alimentar", answer: "a sequencia de transferencia de materia e energia entre organismos por alimentacao", why: "ela organiza os niveis troficos de um ecossistema" },
      { lead: "a teia alimentar", answer: "o conjunto de cadeias alimentares interligadas em um ecossistema", why: "na natureza as relacoes alimentares sao mais complexas que uma cadeia unica" },
      { lead: "o produtor", answer: "o organismo autotrofo capaz de produzir materia organica a partir de substancias inorganicas", why: "ele ocupa a base das cadeias alimentares" },
      { lead: "o consumidor", answer: "o organismo heterotrofo que obtem alimento a partir de outros seres vivos", why: "ele pode ocupar diferentes niveis troficos" },
      { lead: "o decompositor", answer: "o organismo que transforma materia organica morta em substancias reutilizaveis no ambiente", why: "fungos e bacterias cumprem esse papel essencial" }
    ]
  },
  {
    subtopico: "Piramides ecologicas",
    habilidade:
      "interpretar cadeias, teias e piramides ecologicas",
    tags: ["piramides", "energia", "biomassa"],
    fatos: [
      { lead: "a piramide de energia", answer: "a representacao da quantidade de energia disponivel em cada nivel trofico", why: "ela mostra perda progressiva de energia ao longo da cadeia" },
      { lead: "a piramide de biomassa", answer: "a representacao da massa de materia viva presente em cada nivel trofico", why: "ela varia conforme o ecossistema considerado" },
      { lead: "a piramide de numeros", answer: "a representacao da quantidade de individuos em cada nivel trofico", why: "ela pode apresentar formatos diferentes conforme as especies envolvidas" },
      { lead: "a diminuicao de energia entre niveis troficos", answer: "a perda de parte da energia na forma de calor e metabolismo", why: "isso limita o numero de niveis em uma cadeia" },
      { lead: "a base larga da piramide de energia", answer: "a grande disponibilidade energetica nos produtores em comparacao com niveis superiores", why: "produtores captam energia e sustentam o restante da cadeia" }
    ]
  },
  {
    subtopico: "Relacoes ecologicas intraespecificas",
    habilidade:
      "diferenciar relacoes ecologicas, nicho, habitat e fatores ambientais",
    tags: ["intraespecificas", "sociedade", "colonia"],
    fatos: [
      { lead: "a relacao intraespecifica", answer: "a interacao ecologica entre individuos da mesma especie", why: "ela pode ser harmonica ou desarmonica" },
      { lead: "a colonia", answer: "a associacao entre individuos da mesma especie unidos fisicamente ou muito integrados", why: "esse e um tipo de relacao intraespecifica harmonica" },
      { lead: "a sociedade", answer: "a associacao entre individuos da mesma especie com divisao de trabalho sem uniao fisica permanente", why: "abelhas e formigas sao exemplos classicos" },
      { lead: "a competicao intraespecifica", answer: "a disputa entre individuos da mesma especie por recursos limitados", why: "ela ocorre quando alimento, espaco ou parceiros sao insuficientes" },
      { lead: "o canibalismo", answer: "a relacao desarmonica em que um individuo se alimenta de outro da mesma especie", why: "esse fenomeno pode ocorrer em diversos grupos animais" }
    ]
  },
  {
    subtopico: "Relacoes ecologicas interespecificas",
    habilidade:
      "diferenciar relacoes ecologicas, nicho, habitat e fatores ambientais",
    tags: ["interespecificas", "predacao", "mutualismo"],
    fatos: [
      { lead: "a relacao interespecifica", answer: "a interacao ecologica entre individuos de especies diferentes", why: "ela pode gerar beneficios, prejuizos ou neutralidade relativa" },
      { lead: "o mutualismo", answer: "a relacao harmonica em que ambas as especies se beneficiam", why: "em alguns casos a associacao e indispensavel a sobrevivencia" },
      { lead: "a predacao", answer: "a relacao em que um organismo captura e mata outro para alimentar-se", why: "ela interfere na dinamica populacional das especies" },
      { lead: "o parasitismo", answer: "a relacao em que uma especie vive as custas de outra causando-lhe prejuizo sem morte imediata", why: "o parasita depende do hospedeiro para obter recursos" },
      { lead: "o comensalismo", answer: "a relacao em que uma especie se beneficia e a outra nao sofre prejuizo significativo", why: "ela e considerada relacao harmonica interespecifica" }
    ]
  },
  {
    subtopico: "Habitat, nicho e fatores limitantes",
    habilidade:
      "diferenciar relacoes ecologicas, nicho, habitat e fatores ambientais",
    tags: ["habitat", "nicho", "fatores limitantes"],
    fatos: [
      { lead: "o nicho ecologico", answer: "o papel funcional e o modo de vida de uma especie no ecossistema", why: "ele inclui uso de recursos e relacoes com outras especies" },
      { lead: "o habitat de uma especie", answer: "o lugar fisico em que ela vive", why: "habitat e nicho nao sao conceitos equivalentes" },
      { lead: "o fator limitante", answer: "a condicao ambiental que restringe crescimento, distribuicao ou sobrevivencia", why: "agua, temperatura e nutrientes podem exercer esse papel" },
      { lead: "a sobreposicao de nichos", answer: "a situacao em que especies usam recursos semelhantes e podem competir entre si", why: "ela influencia coexistencia ecologica" },
      { lead: "a tolerancia ambiental", answer: "o intervalo de condicoes em que uma especie consegue sobreviver e reproduzir-se", why: "fora desse intervalo o organismo sofre estresse ou desaparece" }
    ]
  },
  {
    subtopico: "Dinamica de populacoes",
    habilidade:
      "analisar dinamica populacional e sucessao ecologica",
    tags: ["populacoes", "crescimento", "densidade"],
    fatos: [
      { lead: "a densidade populacional", answer: "a relacao entre numero de individuos e area ou volume ocupado", why: "ela ajuda a comparar populacoes em diferentes espacos" },
      { lead: "o crescimento populacional", answer: "a variacao no numero de individuos de uma populacao ao longo do tempo", why: "ele depende de natalidade, mortalidade e migracoes" },
      { lead: "a capacidade de suporte", answer: "o numero maximo de individuos que o ambiente consegue sustentar de forma estavel", why: "ela limita o crescimento populacional" },
      { lead: "a natalidade", answer: "a entrada de novos individuos por reproducao em uma populacao", why: "ela contribui para o aumento populacional" },
      { lead: "a mortalidade", answer: "a perda de individuos de uma populacao ao longo do tempo", why: "ela atua no sentido de reduzir seu tamanho" }
    ]
  },
  {
    subtopico: "Sucessao ecologica",
    habilidade:
      "analisar dinamica populacional e sucessao ecologica",
    tags: ["sucessao", "climax", "pioneiras"],
    fatos: [
      { lead: "a sucessao ecologica", answer: "a mudanca gradual das comunidades de uma area ao longo do tempo", why: "ela conduz a transformacoes na estrutura do ecossistema" },
      { lead: "a comunidade pioneira", answer: "o primeiro conjunto de organismos que coloniza uma area em sucessao", why: "esses organismos iniciam a modificacao do ambiente" },
      { lead: "a comunidade climacica", answer: "a comunidade mais estavel ao final de um processo sucessional", why: "ela representa maior complexidade e equilibrio relativo" },
      { lead: "a sucessao primaria", answer: "a sucessao iniciada em ambiente sem solo previamente formado", why: "ela ocorre, por exemplo, em rochas expostas recentes" },
      { lead: "a sucessao secundaria", answer: "a sucessao que ocorre em area ja ocupada anteriormente, mas perturbada", why: "ela tende a ser mais rapida devido ao solo preexistente" }
    ]
  },
  {
    subtopico: "Ecologia aplicada e conservacao",
    habilidade:
      "avaliar estrategias de conservacao e equilibrio dos ecossistemas",
    tags: ["conservacao", "equilibrio", "preservacao"],
    fatos: [
      { lead: "a conservacao ambiental", answer: "o conjunto de acoes voltadas a manutencao da biodiversidade e do funcionamento dos ecossistemas", why: "ela busca reduzir perdas e desequilibrios" },
      { lead: "a preservacao ambiental", answer: "a protecao mais restritiva de areas e ecossistemas contra uso intenso", why: "ela difere de estrategias de manejo sustentavel" },
      { lead: "a unidade de conservacao", answer: "a area criada para proteger ambientes, especies e processos naturais", why: "ela e instrumento importante de politica ambiental" },
      { lead: "o equilibrio ecologico", answer: "a manutencao relativa do funcionamento das relacoes e fluxos em um ecossistema", why: "esse equilibrio pode ser rompido por impactos intensos" },
      { lead: "a ecologia aplicada", answer: "o uso dos conhecimentos ecologicos para resolver problemas ambientais concretos", why: "ela aproxima ciencia e gestao ambiental" }
    ]
  }
];

export const ecologia = {
  id: "biologia_ecologia",
  materia: "Biologia",
  serie: [3],
  topico: "Ecologia",
  metadados: {
    disciplinaId: "biologia",
    base: "ESCOLAR",
    eixo: "Biologia",
    frente: "Relacoes ecologicas e funcionamento dos ecossistemas",
    searchAliases: [
      "ecologia",
      "ecossistemas",
      "cadeia alimentar",
      "relacoes ecologicas",
      "sucessao ecologica",
      "dinamica populacional"
    ],
    subtopicosBase: [
      "Conceitos fundamentais de ecologia",
      "Niveis de organizacao ecologica",
      "Cadeias e teias alimentares",
      "Piramides ecologicas",
      "Relacoes ecologicas intraespecificas",
      "Relacoes ecologicas interespecificas",
      "Habitat, nicho e fatores limitantes",
      "Dinamica de populacoes",
      "Sucessao ecologica",
      "Ecologia aplicada e conservacao"
    ],
    habilidadesBase: [
      "identificar conceitos e niveis de organizacao da ecologia",
      "interpretar cadeias, teias e piramides ecologicas",
      "diferenciar relacoes ecologicas, nicho, habitat e fatores ambientais",
      "analisar dinamica populacional e sucessao ecologica",
      "avaliar estrategias de conservacao e equilibrio dos ecossistemas"
    ],
    planejamentoQuestoes: BIOLOGY_TWO_HUNDRED_PLAN,
    seloEditorial: "VERIFICADA",
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "eco",
    serie: 3,
    materia: "Biologia",
    topico: "Ecologia",
    blocos,
    stemBuilders: BIOLOGY_STEM_BUILDERS,
    globalMatrix: BIOLOGY_TWO_HUNDRED_MATRIX
  })
};
