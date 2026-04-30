import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  BIOLOGY_STEM_BUILDERS,
  BIOLOGY_TWO_HUNDRED_MATRIX,
  BIOLOGY_TWO_HUNDRED_PLAN
} from "../../../_shared/biologyTopicPresets.js";

const blocos = [
  {
    subtopico: "Conceitos de impacto ambiental",
    habilidade:
      "identificar tipos de impactos ambientais e seus efeitos ecologicos",
    tags: ["impacto ambiental", "degradacao", "ambiente"],
    fatos: [
      { lead: "o impacto ambiental", answer: "a alteracao provocada no ambiente por processos naturais ou sobretudo por atividades humanas", why: "essa alteracao pode afetar organismos, recursos e ecossistemas" },
      { lead: "a degradacao ambiental", answer: "a perda da qualidade e funcionalidade de um ambiente natural", why: "ela pode resultar de exploracao, poluicao e destruicao de habitats" },
      { lead: "o desequilibrio ecologico", answer: "a ruptura de relações e fluxos naturais em um ecossistema", why: "impactos intensos podem comprometer esse equilíbrio" },
      { lead: "o recurso natural", answer: "o elemento do ambiente utilizado pelos seres humanos para diferentes finalidades", why: "agua, solo e biodiversidade são exemplos classicos" },
      { lead: "a análise ambiental", answer: "a observação das causas, consequências e possibilidades de mitigacao dos impactos", why: "ela orienta politicas e ações de conservacao" }
    ]
  },
  {
    subtopico: "Poluicao da agua",
    habilidade:
      "analisar relações entre poluicao, saude e equilíbrio dos ecossistemas",
    tags: ["poluicao da agua", "rios", "contaminacao"],
    fatos: [
      { lead: "a poluicao da agua", answer: "a contaminacao de rios, lagos e aquiferos por substancias ou organismos nocivos", why: "ela compromete usos biologicos e humanos da agua" },
      { lead: "o esgoto sem tratamento", answer: "uma fonte importante de poluicao hidrica por materia organica e micro-organismos", why: "ele reduz a qualidade da agua e afeta a biota" },
      { lead: "a contaminacao por metais pesados", answer: "o problema ambiental associado a presenca de elementos toxicos em corpos d'agua", why: "esses metais podem acumular-se em organismos" },
      { lead: "a qualidade da agua", answer: "a condicao fisico-química e biologica de uma agua em relação a seus usos e a vida aquatica", why: "ela se altera diante de poluentes" },
      { lead: "a importancia da agua potavel", answer: "o acesso a agua segura para consumo e saude humana", why: "a poluicao hidrica ameaca diretamente esse direito" }
    ]
  },
  {
    subtopico: "Poluicao do ar",
    habilidade:
      "analisar relações entre poluicao, saude e equilíbrio dos ecossistemas",
    tags: ["poluicao do ar", "atmosfera", "gases"],
    fatos: [
      { lead: "a poluicao atmosferica", answer: "a alteracao da composicao do ar por emissao de gases e particulas prejudiciais", why: "ela afeta clima, saude e ecossistemas" },
      { lead: "o material particulado", answer: "o conjunto de pequenas particulas em suspensao no ar", why: "sua inalacao pode causar problemas respiratorios" },
      { lead: "os gases poluentes", answer: "as substancias emitidas por veiculos, industrias e queimadas que degradam a qualidade do ar", why: "alguns deles contribuem para chuva acida e efeito estufa" },
      { lead: "a qualidade do ar", answer: "a condicao atmosferica em relação a presenca e concentracao de poluentes", why: "ela influencia diretamente a saude coletiva" },
      { lead: "a relação entre ar poluido e saude", answer: "o aumento do risco de doencas respiratorias e cardiovasculares em populacoes expostas", why: "a poluicao atmosferica tem forte impacto sanitario" }
    ]
  },
  {
    subtopico: "Poluicao do solo e residuos",
    habilidade:
      "analisar relações entre poluicao, saude e equilíbrio dos ecossistemas",
    tags: ["solo", "residuos", "contaminacao"],
    fatos: [
      { lead: "a poluicao do solo", answer: "a degradacao causada pela deposicao ou infiltracao de substancias nocivas no terreno", why: "ela compromete fertilidade e seguranca ambiental" },
      { lead: "o lixo urbano mal destinado", answer: "uma fonte de contaminacao por chorume, vetores e residuos persistentes", why: "a destinacao inadequada amplia impactos sociais e ecologicos" },
      { lead: "o chorume", answer: "o liquido resultante da decomposicao de residuos organicos e da agua percolada no lixo", why: "ele pode contaminar solo e aguas subterraneas" },
      { lead: "o aterro sanitario", answer: "a estrutura planejada para disposicao controlada de residuos solidos", why: "ela reduz danos quando comparada a lixoes" },
      { lead: "a coleta seletiva", answer: "a separacao de residuos por tipo para facilitar reaproveitamento e tratamento", why: "ela integra estrategias de gestao ambiental" }
    ]
  },
  {
    subtopico: "Desmatamento e queimadas",
    habilidade:
      "identificar tipos de impactos ambientais e seus efeitos ecologicos",
    tags: ["desmatamento", "queimadas", "vegetacao"],
    fatos: [
      { lead: "o desmatamento", answer: "a remocao significativa da cobertura vegetal de uma area", why: "ele altera clima, solo, agua e biodiversidade" },
      { lead: "as queimadas", answer: "a combustao da cobertura vegetal em processos naturais ou antropicos", why: "quando descontroladas, geram graves impactos ambientais" },
      { lead: "a perda de habitat por desmatamento", answer: "a eliminacao dos ambientes de vida de muitas especies", why: "isso aumenta risco de reducao populacional e extincao" },
      { lead: "a erosao apos retirada da vegetacao", answer: "a maior facilidade de desgaste e transporte do solo sem cobertura protetora", why: "raizes e serapilheira ajudam a fixar o terreno" },
      { lead: "a relação entre queimadas e emissao de gases", answer: "a liberacao de material particulado e carbono para a atmosfera", why: "isso agrava problemas locais e globais" }
    ]
  },
  {
    subtopico: "Efeito estufa e aquecimento global",
    habilidade:
      "relacionar impactos ambientais a mudancas climaticas e ciclos biogeoquimicos",
    tags: ["efeito estufa", "aquecimento global", "clima"],
    fatos: [
      { lead: "o efeito estufa natural", answer: "o fenomeno de retencao de parte do calor atmosferico por certos gases", why: "ele é importante para manter temperatura adequada a vida" },
      { lead: "o agravamento do efeito estufa", answer: "o aumento da retencao de calor devido a elevacao antropica de gases estufa", why: "isso esta ligado ao aquecimento global" },
      { lead: "o aquecimento global", answer: "a elevacao média da temperatura do planeta associada a mudancas na composicao atmosferica", why: "ele influencia clima, oceanos e ecossistemas" },
      { lead: "o gas carbonico como gas estufa", answer: "a substancia atmosferica que contribui para retencao de calor e se eleva com a queima de combustiveis", why: "seu aumento e central nos debates climaticos" },
      { lead: "a mudanca climatica", answer: "a alteracao de padroes de temperatura, chuvas e eventos extremos ao longo do tempo", why: "ela pode ser intensificada pela ação humana" }
    ]
  },
  {
    subtopico: "Perda de biodiversidade",
    habilidade:
      "avaliar riscos a biodiversidade e estrategias de conservacao",
    tags: ["biodiversidade", "extincao", "conservacao"],
    fatos: [
      { lead: "a perda de biodiversidade", answer: "a reducao da variedade de genes, especies e ecossistemas", why: "ela enfraquece a estabilidade e os servicos ecossistemicos" },
      { lead: "a extincao de especies", answer: "o desaparecimento definitivo de uma linhagem biologica", why: "ela pode ser acelerada por impactos antropicos" },
      { lead: "a fragmentacao de habitats", answer: "a divisao de ambientes continuos em partes menores e isoladas", why: "isso dificulta deslocamento e reproducao de varias especies" },
      { lead: "a especie ameacada", answer: "o organismo com risco elevado de desaparecer em um horizonte temporal relevante", why: "sua situação exige medidas de protecao" },
      { lead: "a conservacao da biodiversidade", answer: "o conjunto de estrategias voltadas a manutencao da diversidade biologica", why: "ela é essencial para o equilíbrio ambiental e a vida humana" }
    ]
  },
  {
    subtopico: "Saneamento e saude ambiental",
    habilidade:
      "analisar relações entre poluicao, saude e equilíbrio dos ecossistemas",
    tags: ["saneamento", "saude ambiental", "qualidade de vida"],
    fatos: [
      { lead: "o saneamento basico", answer: "o conjunto de servicos de agua, esgoto, residuos e drenagem essenciais a saude coletiva", why: "ele reduz doencas e impactos ambientais" },
      { lead: "a saude ambiental", answer: "a relação entre condicoes do ambiente e bem-estar das populacoes humanas", why: "degradacao ambiental afeta diretamente a saude" },
      { lead: "a ausencia de coleta e tratamento de esgoto", answer: "um fator que favorece contaminacao hidrica e disseminacao de doencas", why: "esse problema une ambiente e saude publica" },
      { lead: "o manejo adequado de residuos", answer: "a estrategia para reduzir poluicao e proliferacao de vetores", why: "ele é parte importante do saneamento" },
      { lead: "a prevencao ambiental em saude", answer: "o conjunto de ações que reduz riscos ambientais a populacao", why: "ela depende de politicas publicas e educação" }
    ]
  },
  {
    subtopico: "Sustentabilidade e mitigacao",
    habilidade:
      "avaliar riscos a biodiversidade e estrategias de conservacao",
    tags: ["sustentabilidade", "mitigacao", "preservacao"],
    fatos: [
      { lead: "a sustentabilidade", answer: "o uso de recursos e organizacao da sociedade de forma compativel com a manutencao ambiental", why: "ela busca conciliar necessidades humanas e conservacao" },
      { lead: "a mitigacao ambiental", answer: "as ações destinadas a reduzir ou compensar impactos negativos ja identificados", why: "ela é importante em politicas e projetos de manejo" },
      { lead: "a recuperacao de areas degradadas", answer: "o conjunto de intervencoes para restaurar funcionalidade ecologica em ambientes impactados", why: "essa pratica auxilia na recomposicao de servicos ecossistemicos" },
      { lead: "o consumo consciente", answer: "a escolha de padroes de uso que reduzem desperdicio e pressao sobre o ambiente", why: "ele integra comportamentos sustentaveis" },
      { lead: "a educação ambiental", answer: "o processo formativo voltado a compreensao critica das relações entre sociedade e natureza", why: "ela favorece participacao e mudanca de praticas" }
    ]
  },
  {
    subtopico: "Interpretação de problemas ambientais",
    habilidade:
      "relacionar impactos ambientais a mudancas climaticas e ciclos biogeoquimicos",
    tags: ["interpretacao", "problemas ambientais", "analise"],
    fatos: [
      { lead: "a leitura de um problema ambiental", answer: "a identificacao do impacto, da causa, dos organismos afetados e das possíveis solucoes", why: "essa organizacao melhora a análise biologica" },
      { lead: "a interpretação de gráficos ambientais", answer: "a análise de tendencias em temperatura, poluentes, desmatamento ou biodiversidade", why: "dados visuais são frequentes em questoes atuais" },
      { lead: "a relação entre impacto local e efeito global", answer: "o vinculo entre alteracoes pontuais e consequências amplas em ciclos e clima", why: "alguns problemas extrapolam a escala imediata" },
      { lead: "a análise de estudos de caso ambientais", answer: "a aplicacao de conceitos ecologicos e biogeoquimicos a situações concretas", why: "ela integra diferentes frentes da biologia" },
      { lead: "a utilidade do estudo dos impactos ambientais", answer: "a compreensao critica das relações entre atividade humana, ecossistemas e sustentabilidade", why: "isso e central para a formação cientifica e cidada" }
    ]
  }
];

export const impactosAmbientais = {
  id: "biologia_impactos_ambientais",
  materia: "Biologia",
  serie: [3],
  topico: "Impactos Ambientais",
  metadados: {
    disciplinaId: "biologia",
    base: "ESCOLAR",
    eixo: "Biologia",
    frente: "Poluicao, clima e conservacao ambiental",
    searchAliases: [
      "impactos ambientais",
      "poluicao",
      "efeito estufa",
      "desmatamento",
      "biodiversidade",
      "sustentabilidade"
    ],
    subtopicosBase: [
      "Conceitos de impacto ambiental",
      "Poluicao da agua",
      "Poluicao do ar",
      "Poluicao do solo e residuos",
      "Desmatamento e queimadas",
      "Efeito estufa e aquecimento global",
      "Perda de biodiversidade",
      "Saneamento e saude ambiental",
      "Sustentabilidade e mitigacao",
      "Interpretação de problemas ambientais"
    ],
    habilidadesBase: [
      "identificar tipos de impactos ambientais e seus efeitos ecologicos",
      "analisar relações entre poluicao, saude e equilíbrio dos ecossistemas",
      "relacionar impactos ambientais a mudancas climaticas e ciclos biogeoquimicos",
      "avaliar riscos a biodiversidade e estrategias de conservacao",
      "propor medidas de mitigacao, saneamento e sustentabilidade"
    ],
    planejamentoQuestoes: BIOLOGY_TWO_HUNDRED_PLAN,
    seloEditorial: "VERIFICADA",
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "ia",
    serie: 3,
    materia: "Biologia",
    topico: "Impactos Ambientais",
    blocos,
    stemBuilders: BIOLOGY_STEM_BUILDERS,
    globalMatrix: BIOLOGY_TWO_HUNDRED_MATRIX
  })
};
