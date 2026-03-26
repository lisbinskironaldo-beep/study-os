export const analiseCombinatoria = {
  id: "matematica_analise_combinatoria",
  materia: "Matemática",
  serie: [3],
  topico: "Análise combinatória",

  metadados: {
    disciplinaId: "matematica",
    base: "ESCOLAR",
    eixo: "Combinatoria",
    frente: "Contagem",
    searchAliases: [
      "principio fundamental da contagem",
      "fatorial",
      "arranjos e combinacoes",
      "permutacoes"
    ],
    subtopicosBase: [
      "PFC",
      "Fatorial",
      "Permutacao simples",
      "Introducao a contagem"
    ],
    habilidadesBase: [
      "aplicar principio fundamental da contagem",
      "calcular fatorial",
      "interpretar problemas de contagem simples"
    ]
  },

  questoes: [
    {
      id: "ac_001",
      serie: [3],
      materia: "Matemática",
      topico: "Análise combinatória",
      subtopico: "PFC",
      dificuldadeLabel: "facil",
      dificuldadeNivel: 1,
      cognicao: "aplicacao",
      tipo: "multipla_escolha",
      enunciado: "Uma pessoa tem 3 camisetas e 2 calças. Quantas combinações diferentes de roupas ela pode formar?",
      opcoes: ["5", "6", "3", "2"],
      correta: "6",
      comentario: "Multiplica-se as opções: 3 × 2 = 6.",
      tempoEstimado: 20,
      tags: ["pfc", "basico"],
      habilidades: ["aplicar principio fundamental da contagem"],
      collections: ["questions"],
      sourceType: "original",
      sourceExam: "",
      sourceYear: null,
      competencies: [],
      status: "revisada"
    },

    {
      id: "ac_002",
      serie: [3],
      materia: "Matemática",
      topico: "Análise combinatória",
      subtopico: "PFC",
      dificuldadeLabel: "facil",
      dificuldadeNivel: 1,
      cognicao: "aplicacao",
      tipo: "multipla_escolha",
      enunciado: "Um sorvete pode ser montado com 4 sabores e 3 tipos de cobertura. Quantas opções diferentes existem?",
      opcoes: ["7", "12", "4", "3"],
      correta: "12",
      comentario: "Multiplica-se: 4 × 3 = 12 combinações.",
      tempoEstimado: 20,
      tags: ["pfc"],
      habilidades: ["aplicar principio fundamental da contagem"],
      collections: ["questions"],
      sourceType: "original",
      sourceExam: "",
      sourceYear: null,
      competencies: [],
      status: "revisada"
    },

    {
      id: "ac_003",
      serie: [3],
      materia: "Matemática",
      topico: "Análise combinatória",
      subtopico: "Fatorial",
      dificuldadeLabel: "facil",
      dificuldadeNivel: 1,
      cognicao: "memorizacao",
      tipo: "multipla_escolha",
      enunciado: "Qual é o valor de 4! ?",
      opcoes: ["24", "16", "8", "12"],
      correta: "24",
      comentario: "4! = 4 × 3 × 2 × 1 = 24.",
      tempoEstimado: 15,
      tags: ["fatorial"],
      habilidades: ["calcular fatorial"],
      collections: ["questions"],
      sourceType: "original",
      sourceExam: "",
      sourceYear: null,
      competencies: [],
      status: "revisada"
    },

    {
      id: "ac_004",
      serie: [3],
      materia: "Matemática",
      topico: "Análise combinatória",
      subtopico: "Fatorial",
      dificuldadeLabel: "facil",
      dificuldadeNivel: 2,
      cognicao: "memorizacao",
      tipo: "multipla_escolha",
      enunciado: "Qual é o valor de 5! ?",
      opcoes: ["120", "60", "20", "25"],
      correta: "120",
      comentario: "5! = 5 × 4 × 3 × 2 × 1 = 120.",
      tempoEstimado: 15,
      tags: ["fatorial"],
      habilidades: ["calcular fatorial"],
      collections: ["questions"],
      sourceType: "original",
      sourceExam: "",
      sourceYear: null,
      competencies: [],
      status: "revisada"
    },

    {
      id: "ac_005",
      serie: [3],
      materia: "Matemática",
      topico: "Análise combinatória",
      subtopico: "PFC",
      dificuldadeLabel: "facil",
      dificuldadeNivel: 2,
      cognicao: "aplicacao",
      tipo: "multipla_escolha",
      enunciado: "Uma senha é formada por 2 letras e 3 números. Sabendo que há 26 letras e 10 números, quantas senhas podem ser formadas?",
      opcoes: ["26000", "52000", "67600", "78000"],
      correta: "67600",
      comentario: "26² × 10³ = 676 × 1000 = 67600.",
      tempoEstimado: 25,
      tags: ["pfc", "senha"],
      habilidades: ["aplicar principio fundamental da contagem"],
      collections: ["questions"],
      sourceType: "original",
      sourceExam: "",
      sourceYear: null,
      competencies: [],
      status: "revisada"
    }

    // (continua até ac_025 no próximo envio)
  ]
}