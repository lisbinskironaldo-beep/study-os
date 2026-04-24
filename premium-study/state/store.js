(function () {
    if (window.PremiumStudyStore) {
        return;
    }

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    const DEFAULT_HIGHLIGHT_COLOR = "#fde68a";

    function buildStudyTitle(materialName) {
        if (!materialName) {
            return "Estudo personalizado";
        }

        return materialName.replace(/\.pdf$/i, "");
    }

    function buildQuestion(prompt, options, correctIndex, rationale) {
        return { prompt, options, correctIndex, rationale };
    }

    function buildTrueFalse(statement, answer, rationale) {
        return { statement, answer, rationale };
    }

    function buildFlashcard(front, back, tip) {
        return { front, back, tip };
    }

    function createLevelExamState(overrides = {}) {
        return {
            questionCount: 10,
            title: "Prova de nivel RotaNota",
            questions: [],
            started: false,
            index: 0,
            answers: [],
            isComplete: false,
            result: null,
            status: "idle",
            ...overrides
        };
    }

    function createModePreparationState(overrides = {}) {
        return {
            active: false,
            kicker: "Preparando os modos",
            targetStep: "mode-select",
            source: "",
            title: "",
            message: "",
            labels: [],
            progress: null,
            startedAt: "",
            ...overrides
        };
    }

    function createShellActivityState(overrides = {}) {
        return {
            active: false,
            kicker: "Processando",
            title: "",
            message: "",
            labels: [],
            progress: null,
            startedAt: "",
            ...overrides
        };
    }

    function buildExamPack(material, descriptors) {
        const [first, second, third, fourth] = descriptors;

        return [
            buildQuestion(
                `Em ${material}, qual leitura inicial gera mais resultado?`,
                [
                    "Pular as definicoes centrais",
                    `Mapear ${first} antes de decorar detalhes`,
                    "Começar apenas por exemplos isolados",
                    "Ir direto para excecoes"
                ],
                1,
                `O ponto de partida mais forte e entender ${first} antes de aprofundar o resto.`
            ),
            buildQuestion(
                `O que mais ajuda a não confundir ${first} com aplicação prática?`,
                [
                    "Separar conceito, critério e exemplo",
                    "Ler so a conclusao",
                    "Decorar uma frase solta",
                    "Ignorar a linguagem da banca"
                ],
                0,
                "Separar conceito, critério e exemplo evita trocas típicas de prova."
            ),
            buildQuestion(
                `Quando o enunciado cobra ${second}, o que você deve procurar primeiro?`,
                [
                    "A palavra que delimita o critério",
                    "O exemplo mais bonito",
                    "A alternativa mais longa",
                    "A resposta que parece familiar"
                ],
                0,
                `Em questões de ${second}, a palavra que limita o critério costuma decidir a alternativa.`
            ),
            buildQuestion(
                `Qual erro mais comum ao revisar ${third}?`,
                [
                    "Comparar itens muito proximos",
                    "Separar excecao da regra",
                    "Responder por semelhanca superficial",
                    "Marcar palavra-chave"
                ],
                2,
                "Responder por semelhanca superficial gera erro justamente quando o item parece conhecido."
            ),
            buildQuestion(
                `Como transformar ${fourth} em acerto mais estavel?`,
                [
                    "Lendo mais rapido",
                    "Criando uma relacao mnemonica curta",
                    "Pulando a etapa de resumo",
                    "Decorando so o titulo"
                ],
                1,
                "Uma relação mnemônica curta ajuda a recuperar o conteúdo sob pressão."
            ),
            buildQuestion(
                "Qual sequencia de revisao reduz mais a dispersao?",
                [
                    "Resumo, critério, prática",
                    "Pratica, titulo, acaso",
                    "Excecao, detalhe, exemplo",
                    "Mini prova, sem resumo"
                ],
                0,
                "Resumo, critério e prática formam a trilha mais limpa para consolidar o bloco."
            ),
            buildQuestion(
                "Em alternativas muito parecidas, o que mais protege seu resultado?",
                [
                    "A memoria visual da pagina",
                    "A palavra de contraste",
                    "A primeira impressao",
                    "O tamanho da alternativa"
                ],
                1,
                "A palavra de contraste costuma separar a correta das quase corretas."
            ),
            buildQuestion(
                "Quando vale voltar ao resumo focado?",
                [
                    "Quando o erro mostra duvida de base",
                    "So quando faltar tempo",
                    "Depois de decorar tudo",
                    "Nunca, porque prática basta"
                ],
                0,
                "Se o erro foi de base, o resumo focado recompõe o mapa mental do assunto."
            ),
            buildQuestion(
                "Qual sinal indica que você entendeu o assunto, e não só decorou?",
                [
                    "Consegue explicar o critério sem depender do exemplo",
                    "Reconhece a fonte do PDF",
                    "Lembra a cor do card",
                    "Responde so pelo tema geral"
                ],
                0,
                "Entendimento real aparece quando o critério se sustenta sem depender do exemplo."
            ),
            buildQuestion(
                "Qual proximo passo faz mais sentido depois de consolidar este assunto?",
                [
                    "Ir para o próximo assunto ou para a prática",
                    "Reiniciar o onboarding",
                    "Apagar o progresso",
                    "Fechar sem salvar"
                ],
                0,
                "Depois de consolidar um assunto, faz sentido praticar ou seguir para o próximo bloco."
            )
        ];
    }

    function buildBlocks(studyTitle) {
        const material = studyTitle || "seu material";

        return [
            {
                id: "block-1",
                title: "Nucleo principal",
                subtitle: "Comece pelo que mais organiza o entendimento e reduz dispersao.",
                duration: "34 min",
                status: "recommended",
                excerpt: "Termos centrais, definições e relações que abrem o restante do conteúdo.",
                topics: [
                    "conceitos centrais do material",
                    "critérios e definições chave",
                    "linguagem que mais aparece na prova"
                ],
                progress: {
                    learn: false,
                    practice: false,
                    exam: false
                },
                learn: {
                    summary: `Este bloco isola o núcleo de ${material}, priorizando termos, definições e relações que ajudam você a entrar no conteúdo sem desperdiçar tempo.`,
                    hotPoints: [
                        "Entender o vocabulario principal antes de memorizar detalhes.",
                        "Separar o que e regra, o que e excecao e o que e exemplo.",
                        "Marcar onde a banca pode confundir conceito com aplicacao."
                    ],
                    keyConcepts: [
                        "conceito central",
                        "critério de classificação",
                        "estrutura basica",
                        "aplicacao mais cobrada"
                    ],
                    pitfalls: [
                        "Trocar definicao por exemplo pratico.",
                        "Memorizar nomes sem entender relacao entre eles.",
                        "Ignorar o critério que diferencia itens parecidos."
                    ]
                },
                practice: {
                    targets: {
                        quiz: 3,
                        trueFalse: 3,
                        flashcards: 3
                    },
                    quiz: [
                        buildQuestion(
                            `Dentro de ${material}, qual estrategia vem antes de memorizar detalhes?`,
                            [
                                "Ler apenas exemplos isolados",
                                "Entender o vocabulario e as definicoes centrais",
                                "Ir direto para a mini prova",
                                "Pular os termos principais"
                            ],
                            1,
                            "O primeiro ganho real vem de organizar linguagem, critério e definições do bloco."
                        ),
                        buildQuestion(
                            "Ao revisar um conceito central, o que mais ajuda a evitar erro de prova?",
                            [
                                "Decorar um unico caso",
                                "Misturar regra e excecao",
                                "Separar regra, excecao e exemplo",
                                "Ignorar a linguagem da banca"
                            ],
                            2,
                            "Separar regra, excecao e exemplo reduz confusao e melhora a leitura de alternativas."
                        ),
                        buildQuestion(
                            "Qual atitude melhora a leitura do bloco recomendado?",
                            [
                                "Ler tudo na mesma velocidade",
                                "Marcar relacoes entre os conceitos",
                                "Ignorar os termos repetidos",
                                "Pular o resumo principal"
                            ],
                            1,
                            "Marcar relações entre conceitos transforma o conteúdo em estrutura, não em lista solta."
                        )
                    ],
                    quizSeries: [
                        [
                            buildQuestion(
                                `Dentro de ${material}, qual estrategia vem antes de memorizar detalhes?`,
                                [
                                    "Ler apenas exemplos isolados",
                                    "Entender o vocabulario e as definicoes centrais",
                                    "Ir direto para a mini prova",
                                    "Pular os termos principais"
                                ],
                                1,
                                "O primeiro ganho real vem de organizar linguagem, critério e definições do bloco."
                            ),
                            buildQuestion(
                                "Ao revisar um conceito central, o que mais ajuda a evitar erro de prova?",
                                [
                                    "Decorar um unico caso",
                                    "Misturar regra e excecao",
                                    "Separar regra, excecao e exemplo",
                                    "Ignorar a linguagem da banca"
                                ],
                                2,
                                "Separar regra, excecao e exemplo reduz confusao e melhora a leitura de alternativas."
                            ),
                            buildQuestion(
                                "Qual atitude melhora a leitura do bloco recomendado?",
                                [
                                    "Ler tudo na mesma velocidade",
                                    "Marcar relacoes entre os conceitos",
                                    "Ignorar os termos repetidos",
                                    "Pular o resumo principal"
                                ],
                                1,
                                "Marcar relações entre conceitos transforma o conteúdo em estrutura, não em lista solta."
                            )
                        ],
                        [
                            buildQuestion(
                                "Qual ganho aparece quando você entende o critério principal do bloco?",
                                [
                                    "A leitura fica mais organizada",
                                    "Os exemplos deixam de importar",
                                    "A prática pode ser ignorada",
                                    "Toda excecao vira regra"
                                ],
                                0,
                                "Com critério claro, o conteúdo deixa de parecer uma lista solta e passa a ter eixo."
                            ),
                            buildQuestion(
                                "O que mais protege contra erro por semelhanca superficial?",
                                [
                                    "Memorizar so os titulos",
                                    "Comparar funcao e relacao entre conceitos",
                                    "Ler apenas uma vez",
                                    "Pular definicoes"
                                ],
                                1,
                                "Comparar funcao e relacao entre conceitos evita que ideias proximas parecam iguais."
                            ),
                            buildQuestion(
                                "Quando vale voltar ao resumo base?",
                                [
                                    "Quando a duvida e de fundamento",
                                    "So quando sobrar tempo",
                                    "Depois de decorar tudo",
                                    "Nunca, porque questao basta"
                                ],
                                0,
                                "Se a duvida e estrutural, o resumo base recompõe o mapa do assunto."
                            )
                        ],
                        [
                            buildQuestion(
                                "Qual sequencia consolida melhor o bloco?",
                                [
                                    "Resumo, critério, prática",
                                    "Titulo, exemplo, chute",
                                    "Excecao, detalhe, pressa",
                                    "Mini prova sem revisao"
                                ],
                                0,
                                "Resumo, critério e prática formam a trilha mais limpa para o assunto."
                            ),
                            buildQuestion(
                                "O que mostra que o conceito foi realmente entendido?",
                                [
                                    "Reconhecer a pagina do PDF",
                                    "Explicar a base sem depender de um exemplo",
                                    "Lembrar a cor do card",
                                    "Marcar a opcao mais longa"
                                ],
                                1,
                                "Entendimento real aparece quando a explicacao se sustenta sem apoio de um caso isolado."
                            ),
                            buildQuestion(
                                "Qual erro mais comum depois de uma leitura superficial?",
                                [
                                    "Responder pelo tema geral da alternativa",
                                    "Separar regra e excecao",
                                    "Comparar item por item",
                                    "Voltar ao critério"
                                ],
                                0,
                                "Quem leu superficialmente tende a marcar pela sensação geral, não pelo critério."
                            )
                        ]
                    ],
                    trueFalse: [
                        buildTrueFalse(
                            "Conceito central e exemplo pratico podem ser tratados como a mesma coisa na revisao.",
                            false,
                            "Separar conceito de exemplo evita trocas comuns em prova."
                        ),
                        buildTrueFalse(
                            "A linguagem principal do material deve ser revisada antes da prática intensa.",
                            true,
                            "Entender a linguagem do bloco acelera o restante da trilha."
                        ),
                        buildTrueFalse(
                            "Ignorar critérios de classificação reduz o risco de erro em alternativas parecidas.",
                            false,
                            "É justamente o critério que diferencia opções muito próximas."
                        )
                    ],
                    trueFalseSeries: [
                        [
                            buildTrueFalse(
                                "Conceito central e exemplo pratico podem ser tratados como a mesma coisa na revisao.",
                                false,
                                "Separar conceito de exemplo evita trocas comuns em prova."
                            ),
                            buildTrueFalse(
                                "A linguagem principal do material deve ser revisada antes da prática intensa.",
                                true,
                                "Entender a linguagem do bloco acelera o restante da trilha."
                            ),
                            buildTrueFalse(
                                "Ignorar critérios de classificação reduz o risco de erro em alternativas parecidas.",
                                false,
                                "É justamente o critério que diferencia opções muito próximas."
                            )
                        ],
                        [
                            buildTrueFalse(
                                "O vocabulário principal do tema pode ficar para depois, desde que você memorize os nomes.",
                                false,
                                "Sem entender a linguagem principal, a leitura perde eixo e a memorizacao quebra rapido."
                            ),
                            buildTrueFalse(
                                "Separar regra, excecao e exemplo ajuda a ler o bloco com mais clareza.",
                                true,
                                "Essa separacao evita que elementos parecidos sejam tratados como equivalentes."
                            ),
                            buildTrueFalse(
                                "Quando dois itens parecem próximos, o critério de classificação deixa de ser importante.",
                                false,
                                "É justamente o critério que mostra onde os itens se afastam."
                            )
                        ],
                        [
                            buildTrueFalse(
                                "Entender a relacao entre os conceitos vale mais do que decorar uma lista sem conexao.",
                                true,
                                "A relacao entre ideias sustenta o acerto quando a prova muda a formulacao."
                            ),
                            buildTrueFalse(
                                "Se um caso aparece muito no material, ele automaticamente vira a regra principal.",
                                false,
                                "Frequência não substitui critério; um caso recorrente ainda pode ser só exemplo."
                            ),
                            buildTrueFalse(
                                "Revisar a estrutura basica do tema ajuda a reduzir resposta por semelhanca superficial.",
                                true,
                                "Estrutura clara faz o aluno decidir por critério, não por impressão."
                            )
                        ]
                    ],
                    flashcards: [
                        buildFlashcard(
                            "Mnemonico TRE",
                            "Termo -> Regra -> Excecao.",
                            "Abra o assunto sempre nessa ordem para nao confundir base com detalhe."
                        ),
                        buildFlashcard(
                            "Pergunta gatilho",
                            "O que define este conceito?",
                            "Se a resposta virar um exemplo, você ainda não fixou o conceito."
                        ),
                        buildFlashcard(
                            "Qual leitura gera mais resultado?",
                            "A que conecta conceitos em vez de decorar itens isolados.",
                            "Relacao vale mais do que lista solta."
                        )
                    ]
                    ,
                    flashcardSeries: [
                        [
                            buildFlashcard(
                                "Mnemonico TRE",
                                "Termo -> Regra -> Excecao.",
                                "Abra o assunto sempre nessa ordem para nao confundir base com detalhe."
                            ),
                            buildFlashcard(
                                "Pergunta gatilho",
                                "O que define este conceito?",
                                "Se a resposta virar um exemplo, você ainda não fixou o conceito."
                            ),
                            buildFlashcard(
                                "Qual leitura gera mais resultado?",
                                "A que conecta conceitos em vez de decorar itens isolados.",
                                "Relacao vale mais do que lista solta."
                            )
                        ],
                        [
                            buildFlashcard(
                                "Base antes do detalhe",
                                "Primeiro critério, depois exemplo.",
                                "Sem critério, o detalhe parece importante demais."
                            ),
                            buildFlashcard(
                                "Erro classico",
                                "Confundir funcao com nome.",
                                "Pergunte sempre para que aquilo serve no tema."
                            ),
                            buildFlashcard(
                                "Sinal de dominio",
                                "Explicar sem depender do PDF.",
                                "Se a explicacao so sai olhando o material, a base ainda esta fraca."
                            )
                        ],
                        [
                            buildFlashcard(
                                "Revisao inteligente",
                                "Comparar antes de concluir.",
                                "Comparacao reduz resposta por semelhanca superficial."
                            ),
                            buildFlashcard(
                                "Foco da banca",
                                "Criterio decide mais que tema.",
                                "Muitas alternativas parecem certas até o critério entrar."
                            ),
                            buildFlashcard(
                                "Pergunta final",
                                "O que sustenta este assunto inteiro?",
                                "Quando essa resposta fica curta e clara, o bloco assentou."
                            )
                        ]
                    ]
                },
                exam: {
                    baseCount: 5,
                    questions: buildExamPack(material, [
                        "a linguagem central",
                        "o critério principal",
                        "relacoes entre conceitos",
                        "a memorizacao do bloco"
                    ]).slice(0, 5)
                }
            },
            {
                id: "block-2",
                title: "Consolidacao objetiva",
                subtitle: "Aperte a retenção do que mais diferencia desempenho em questões.",
                duration: "22 min",
                status: "ready",
                excerpt: "Comparacoes, excecoes e palavras-chave que costumam separar acerto de erro.",
                topics: [
                    "comparacoes importantes",
                    "excecoes frequentes",
                    "pegadinhas da banca"
                ],
                progress: {
                    learn: false,
                    practice: false,
                    exam: false
                },
                learn: {
                    summary: `Este bloco pega o que costuma gerar erro em ${material}: comparacoes, excecoes e formulacoes parecidas.`,
                    hotPoints: [
                        "Comparar itens muito proximos e obrigatorio.",
                        "Excecao precisa ficar visualmente separada da regra.",
                        "Pegadinha costuma trocar uma palavra-chave, nao o tema inteiro."
                    ],
                    keyConcepts: [
                        "comparacao direta",
                        "limite da regra",
                        "termo de diferenciacao",
                        "palavra-chave de excecao"
                    ],
                    pitfalls: [
                        "Confiar apenas na memoria visual.",
                        "Nao revisar palavras de contraste.",
                        "Responder por semelhanca superficial."
                    ]
                },
                practice: {
                    targets: {
                        quiz: 3,
                        trueFalse: 3,
                        flashcards: 3
                    },
                    quiz: [
                        buildQuestion(
                            "O que mais ajuda a acertar itens muito parecidos?",
                            [
                                "Responder rapido",
                                "Comparar palavra-chave e critério",
                                "Ignorar excecoes",
                                "Confiar apenas no instinto"
                            ],
                            1,
                            "Itens parecidos se resolvem por palavra-chave e critério, não por impressão geral."
                        ),
                        buildQuestion(
                            "Como a banca costuma montar pegadinhas?",
                            [
                                "Mudando todo o tema",
                                "Eliminando o enunciado",
                                "Trocando o termo que muda o sentido",
                                "Retirando todas as alternativas"
                            ],
                            2,
                            "A pegadinha real costuma morar em um termo pequeno, nao no assunto inteiro."
                        ),
                        buildQuestion(
                            "O que fazer com excecoes recorrentes?",
                            [
                                "Misturar com a regra",
                                "Separar visualmente da regra",
                                "Ignorar para nao confundir",
                                "Deixar para o final sem revisar"
                            ],
                            1,
                            "Separar a excecao da regra evita erro por automatismo."
                        )
                    ],
                    quizSeries: [
                        [
                            buildQuestion(
                                "O que mais ajuda a acertar itens muito parecidos?",
                                [
                                    "Responder rapido",
                                    "Comparar palavra-chave e critério",
                                    "Ignorar excecoes",
                                    "Confiar apenas no instinto"
                                ],
                                1,
                                "Itens parecidos se resolvem por palavra-chave e critério, não por impressão geral."
                            ),
                            buildQuestion(
                                "Como a banca costuma montar pegadinhas?",
                                [
                                    "Mudando todo o tema",
                                    "Eliminando o enunciado",
                                    "Trocando o termo que muda o sentido",
                                    "Retirando todas as alternativas"
                                ],
                                2,
                                "A pegadinha real costuma morar em um termo pequeno, nao no assunto inteiro."
                            ),
                            buildQuestion(
                                "O que fazer com excecoes recorrentes?",
                                [
                                    "Misturar com a regra",
                                    "Separar visualmente da regra",
                                    "Ignorar para nao confundir",
                                    "Deixar para o final sem revisar"
                                ],
                                1,
                                "Separar a excecao da regra evita erro por automatismo."
                            )
                        ],
                        [
                            buildQuestion(
                                "Qual detalhe costuma decidir entre duas alternativas muito proximas?",
                                [
                                    "A fonte do PDF",
                                    "A palavra de contraste",
                                    "O tamanho da frase",
                                    "A ordem alfabetica"
                                ],
                                1,
                                "A palavra de contraste costuma separar a correta da quase correta."
                            ),
                            buildQuestion(
                                "Qual atitude melhora o acerto em temas com excecao recorrente?",
                                [
                                    "Juntar excecao e regra numa unica memoria",
                                    "Marcar a condicao que ativa a excecao",
                                    "Confiar na primeira impressao",
                                    "Ler mais rapido"
                                ],
                                1,
                                "A excecao so funciona direito quando sua condicao aparece junto."
                            ),
                            buildQuestion(
                                "O que reduz mais erro por automatismo?",
                                [
                                    "Comparar item por item",
                                    "Marcar a primeira opcao familiar",
                                    "Ignorar limitadores",
                                    "Responder sem revisar"
                                ],
                                0,
                                "Comparacao deliberada freia o impulso de responder pela semelhanca."
                            )
                        ],
                        [
                            buildQuestion(
                                "Qual sinal indica dominio mais fino do bloco?",
                                [
                                    "Saber o tema geral",
                                    "Justificar por que a quase correta ainda esta errada",
                                    "Lembrar a ordem das páginas",
                                    "Responder sempre mais rapido"
                                ],
                                1,
                                "Dominar o bloco fino e conseguir explicar a diferenca entre certa e quase certa."
                            ),
                            buildQuestion(
                                "O que mais costuma invalidar uma alternativa aparentemente correta?",
                                [
                                    "Uma restricao pequena",
                                    "Um titulo bonito",
                                    "Uma frase curta",
                                    "O mesmo exemplo"
                                ],
                                0,
                                "Em temas de contraste, a restricao pequena quase sempre muda o valor da resposta."
                            ),
                            buildQuestion(
                                "Qual revisao faz mais sentido antes da mini prova?",
                                [
                                    "Passar o olho so nos titulos",
                                    "Voltar aos contrastes e excecoes principais",
                                    "Ignorar palavras-chave",
                                    "Trocar critério por exemplo"
                                ],
                                1,
                                "Antes da mini prova, revisar contraste e excecao limpa o ponto mais sensivel do bloco."
                            )
                        ]
                    ],
                    trueFalse: [
                        buildTrueFalse(
                            "Uma palavra-chave pode mudar completamente o sentido de uma alternativa.",
                            true,
                            "Muitas pegadinhas estao em uma unica palavra."
                        ),
                        buildTrueFalse(
                            "Excecoes devem ser lidas como se fossem regra para acelerar a prova.",
                            false,
                            "Excecao precisa ser marcada como excecao."
                        ),
                        buildTrueFalse(
                            "Comparacoes diretas ajudam a reduzir erro por semelhanca superficial.",
                            true,
                            "Comparar reduz automatismo e melhora o acerto."
                        )
                    ],
                    trueFalseSeries: [
                        [
                            buildTrueFalse(
                                "Uma palavra-chave pode mudar completamente o sentido de uma alternativa.",
                                true,
                                "Muitas pegadinhas estao em uma unica palavra."
                            ),
                            buildTrueFalse(
                                "Excecoes devem ser lidas como se fossem regra para acelerar a prova.",
                                false,
                                "Excecao precisa ser marcada como excecao."
                            ),
                            buildTrueFalse(
                                "Comparacoes diretas ajudam a reduzir erro por semelhanca superficial.",
                                true,
                                "Comparar reduz automatismo e melhora o acerto."
                            )
                        ],
                        [
                            buildTrueFalse(
                                "Quando duas alternativas parecem irmas, comparar palavra-chave e limite ajuda a decidir.",
                                true,
                                "O contraste fino costuma estar justamente nesses elementos pequenos."
                            ),
                            buildTrueFalse(
                                "Se a alternativa parece familiar, ja nao e necessario verificar restricoes ou condicoes.",
                                false,
                                "Familiaridade sem checagem de limite e caminho classico para erro."
                            ),
                            buildTrueFalse(
                                "Separar regra e excecao visualmente reduz resposta por automatismo.",
                                true,
                                "Essa divisão deixa o critério mais limpo no momento da prova."
                            )
                        ],
                        [
                            buildTrueFalse(
                                "A excecao deve ser revisada colada na regra para o cerebro economizar leitura.",
                                false,
                                "Quando ficam grudadas, a tendencia e embaralhar as duas."
                            ),
                            buildTrueFalse(
                                "O erro por semelhança superficial costuma cair quando você compara item por item.",
                                true,
                                "Comparacao deliberada enfraquece o impulso de responder pela primeira impressao."
                            ),
                            buildTrueFalse(
                                "Pegadinha boa troca o critério em um detalhe pequeno, não necessariamente o tema inteiro.",
                                true,
                                "A banca costuma deslocar o sentido por uma palavra, limite ou excecao."
                            )
                        ]
                    ],
                    flashcards: [
                        buildFlashcard(
                            "Mnemonico CPL",
                            "Comparar -> Palavra-chave -> Limite.",
                            "Quando duas alternativas parecerem irmas, rode CPL antes de decidir."
                        ),
                        buildFlashcard(
                            "Regra x excecao",
                            "Excecao nunca revisa colada na regra.",
                            "Separar visualmente evita resposta por automatismo."
                        ),
                        buildFlashcard(
                            "Pegadinha classica",
                            "Uma palavra muda tudo.",
                            "Procure conectivos e limitadores antes de marcar."
                        )
                    ]
                    ,
                    flashcardSeries: [
                        [
                            buildFlashcard(
                                "Mnemonico CPL",
                                "Comparar -> Palavra-chave -> Limite.",
                                "Quando duas alternativas parecerem irmas, rode CPL antes de decidir."
                            ),
                            buildFlashcard(
                                "Regra x excecao",
                                "Excecao nunca revisa colada na regra.",
                                "Separar visualmente evita resposta por automatismo."
                            ),
                            buildFlashcard(
                                "Pegadinha classica",
                                "Uma palavra muda tudo.",
                                "Procure conectivos e limitadores antes de marcar."
                            )
                        ],
                        [
                            buildFlashcard(
                                "Pergunta de ouro",
                                "O que exatamente mudou aqui?",
                                "Essa pergunta quebra a leitura por semelhanca superficial."
                            ),
                            buildFlashcard(
                                "Erro fino",
                                "Tema certo, critério errado.",
                                "Muita alternativa quase correta cai nessa armadilha."
                            ),
                            buildFlashcard(
                                "Excecao segura",
                                "So vale com a condicao junto.",
                                "Sem a condição, você provavelmente voltou para a regra."
                            )
                        ],
                        [
                            buildFlashcard(
                                "Olho clinico",
                                "Contraste decide mais que familiaridade.",
                                "Se parece muito facil, procure o limitador."
                            ),
                            buildFlashcard(
                                "Quase correta",
                                "Explique por que ainda esta errada.",
                                "Esse e o teste real de dominio fino."
                            ),
                            buildFlashcard(
                                "Revisao final",
                                "Regra, excecao, palavra-chave.",
                                "Esse trio limpa o bloco antes da mini prova."
                            )
                        ]
                    ]
                },
                exam: {
                    baseCount: 5,
                    questions: buildExamPack(material, [
                        "as comparacoes do tema",
                        "a palavra-chave de contraste",
                        "as excecoes do assunto",
                        "a memorizacao das pegadinhas"
                    ]).slice(0, 5)
                }
            }
        ];
    }

    const HIGHLIGHT_COLOR_OPTIONS = [
        {
            key: "gold",
            label: "Amarelo IA",
            value: "rgba(255, 203, 109, 0.42)"
        },
        {
            key: "mint",
            label: "Verde agua",
            value: "rgba(88, 227, 183, 0.34)"
        },
        {
            key: "blue",
            label: "Azul",
            value: "rgba(121, 213, 255, 0.32)"
        },
        {
            key: "rose",
            label: "Rosa",
            value: "rgba(255, 151, 188, 0.34)"
        }
    ];

    function getHighlightColorOptions() {
        return HIGHLIGHT_COLOR_OPTIONS.map((option) => ({ ...option }));
    }

    function resolveHighlightColorKey(colorKey) {
        const normalized = String(colorKey || "").trim().toLowerCase();
        return HIGHLIGHT_COLOR_OPTIONS.some((option) => option.key === normalized)
            ? normalized
            : "gold";
    }

    function createHighlightPart(partId, text, highlight, colorKey) {
        return {
            id: partId,
            text: String(text || ""),
            highlight: Boolean(highlight),
            colorKey: highlight
                ? resolveHighlightColorKey(colorKey)
                : ""
        };
    }

    function createHighlightPartId(scope = "highlight-edit") {
        return `${String(scope || "highlight-edit")}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    function normalizeHighlightParagraph(paragraph = []) {
        const normalized = [];

        (Array.isArray(paragraph) ? paragraph : []).forEach((part) => {
            const text = String(part?.text || "");

            if (!text) {
                return;
            }

            const nextPart = createHighlightPart(
                String(part?.id || createHighlightPartId("highlight-part")),
                text,
                Boolean(part?.highlight),
                part?.colorKey || ""
            );
            const previous = normalized[normalized.length - 1];

            if (
                previous &&
                previous.highlight === nextPart.highlight &&
                previous.colorKey === nextPart.colorKey
            ) {
                previous.text += nextPart.text;
                return;
            }

            normalized.push(nextPart);
        });

        return normalized;
    }

    function selectHighlightRangeFromParagraph(
        paragraph = [],
        startOffset = 0,
        endOffset = 0,
        activeColorKey = "gold"
    ) {
        const parts = Array.isArray(paragraph)
            ? paragraph
            : [];
        const totalLength = parts.reduce(
            (acc, part) =>
                acc + String(part?.text || "").length,
            0
        );
        const start = Math.max(
            0,
            Math.min(Number(startOffset) || 0, totalLength)
        );
        const end = Math.max(
            start,
            Math.min(Number(endOffset) || 0, totalLength)
        );

        if (start === end) {
            return {
                paragraph: normalizeHighlightParagraph(parts),
                selectedPartId: ""
            };
        }

        const selectedPartId = createHighlightPartId("highlight-selection");
        const nextParagraph = [];
        let selectedText = "";
        let selectedHighlight = false;
        let selectedColorKey = resolveHighlightColorKey(activeColorKey);
        let selectionInserted = false;
        let cursor = 0;

        parts.forEach((part) => {
            const text = String(part?.text || "");
            const partStart = cursor;
            const partEnd = cursor + text.length;
            const clonedPart = () =>
                createHighlightPart(
                    String(part?.id || createHighlightPartId("highlight-piece")),
                    "",
                    Boolean(part?.highlight),
                    part?.colorKey || ""
                );

            if (!text) {
                cursor = partEnd;
                return;
            }

            if (partEnd <= start || partStart >= end) {
                if (!selectionInserted && partStart >= end && selectedText) {
                    nextParagraph.push(
                        createHighlightPart(
                            selectedPartId,
                            selectedText,
                            selectedHighlight,
                            selectedColorKey
                        )
                    );
                    selectionInserted = true;
                }

                const passthrough = clonedPart();
                passthrough.text = text;
                nextParagraph.push(passthrough);
                cursor = partEnd;
                return;
            }

            const overlapStart = Math.max(start, partStart);
            const overlapEnd = Math.min(end, partEnd);
            const beforeText = text.slice(0, Math.max(0, overlapStart - partStart));
            const selectedSlice = text.slice(
                Math.max(0, overlapStart - partStart),
                Math.max(0, overlapEnd - partStart)
            );
            const afterText = text.slice(Math.max(0, overlapEnd - partStart));

            if (beforeText) {
                const beforePart = clonedPart();
                beforePart.text = beforeText;
                nextParagraph.push(beforePart);
            }

            if (selectedSlice) {
                selectedText += selectedSlice;

                if (part?.highlight && !selectedHighlight) {
                    selectedHighlight = true;
                    selectedColorKey = resolveHighlightColorKey(
                        part?.colorKey || activeColorKey
                    );
                }
            }

            if (!selectionInserted && partEnd >= end && selectedText) {
                nextParagraph.push(
                    createHighlightPart(
                        selectedPartId,
                        selectedText,
                        selectedHighlight,
                        selectedColorKey
                    )
                );
                selectionInserted = true;
            }

            if (afterText) {
                const afterPart = clonedPart();
                afterPart.text = afterText;
                nextParagraph.push(afterPart);
            }

            cursor = partEnd;
        });

        if (!selectionInserted && selectedText) {
            nextParagraph.push(
                createHighlightPart(
                    selectedPartId,
                    selectedText,
                    selectedHighlight,
                    selectedColorKey
                )
            );
        }

        return {
            paragraph: normalizeHighlightParagraph(nextParagraph),
            selectedPartId
        };
    }

    function buildHighlightedParts(text, highlights, options = {}) {
        const content = String(text || "");
        const terms = Array.isArray(highlights)
            ? highlights.filter(Boolean)
            : [];
        const baseId = String(options.baseId || "highlight");
        const highlightColorKey =
            resolveHighlightColorKey(
                options.highlightColorKey
            );

        if (!content || terms.length === 0) {
            return [
                createHighlightPart(
                    `${baseId}-part-0`,
                    content,
                    false,
                    ""
                )
            ];
        }

        const escapedTerms = terms
            .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .filter(Boolean);

        if (escapedTerms.length === 0) {
            return [
                createHighlightPart(
                    `${baseId}-part-0`,
                    content,
                    false,
                    ""
                )
            ];
        }

        const regex = new RegExp(`(${escapedTerms.join("|")})`, "gi");
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(content))) {
            if (match.index > lastIndex) {
                parts.push(
                    createHighlightPart(
                        `${baseId}-part-${parts.length}`,
                        content.slice(
                            lastIndex,
                            match.index
                        ),
                        false,
                        ""
                    )
                );
            }

            parts.push(
                createHighlightPart(
                    `${baseId}-part-${parts.length}`,
                    match[0],
                    true,
                    highlightColorKey
                )
            );
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < content.length) {
            parts.push(
                createHighlightPart(
                    `${baseId}-part-${parts.length}`,
                    content.slice(lastIndex),
                    false,
                    ""
                )
            );
        }

        return parts.length > 0
            ? parts
            : [createHighlightPart(`${baseId}-part-0`, content, false, "")];
    }

    function splitExtractedTextIntoParagraphs(text) {
        return String(text || "")
            .replace(/\r/g, "")
            .split(/\n{2,}/)
            .map((paragraph) =>
                paragraph
                    .replace(/\n+/g, " ")
                    .replace(/\s+/g, " ")
                    .trim()
            )
            .filter(Boolean);
    }

    function looksLikeExtractedHeading(paragraph) {
        const clean = String(paragraph || "").trim();
        if (!clean) {
            return false;
        }

        const wordCount = clean.split(/\s+/).filter(Boolean).length;
        return clean.length <= 78
            && wordCount <= 8
            && !/[.!?;:]$/.test(clean);
    }

    function buildHighlightSectionsFromExtractedText(
        text,
        highlights,
        options = {}
    ) {
        const title =
            String(
                options.primaryTitle ||
                "Material completo"
            ).trim() ||
            "Material completo";
        const paragraphs =
            splitExtractedTextIntoParagraphs(text);

        if (!paragraphs.length) {
            return [];
        }

        const sections = [];
        let currentSection = null;

        const pushSection = () => {
            if (
                currentSection &&
                currentSection.paragraphs.length
            ) {
                sections.push(currentSection);
            }
        };

        paragraphs.forEach((paragraph) => {
            const paragraphIndex =
                currentSection
                    ? currentSection.paragraphs.length
                    : 0;
            const shouldStartWithHeading =
                looksLikeExtractedHeading(
                    paragraph
                );

            if (shouldStartWithHeading) {
                pushSection();
                currentSection = {
                    label: `Trecho ${sections.length + 1}`,
                    title: paragraph,
                    paragraphs: []
                };
                return;
            }

            if (
                !currentSection ||
                currentSection.paragraphs.length >= 4
            ) {
                pushSection();
                currentSection = {
                    label: `Trecho ${sections.length + 1}`,
                    title:
                        sections.length === 0
                            ? title
                            : `Continuidade ${sections.length + 1}`,
                    paragraphs: []
                };
            }

            currentSection.paragraphs.push(
                buildHighlightedParts(
                    paragraph,
                    highlights,
                    {
                        baseId:
                            `highlight-section-${sections.length}-paragraph-${paragraphIndex}`,
                        highlightColorKey:
                            options.highlightColorKey
                    }
                )
            );
        });

        pushSection();

        return sections;
    }

    function extractHighlightedSummaryLead(sections = []) {
        for (const section of sections) {
            for (const paragraph of section.paragraphs || []) {
                const content = (paragraph || [])
                    .map((part) =>
                        String(part.text || "")
                    )
                    .join("")
                    .trim();

                if (content) {
                    return content;
                }
            }
        }

        return "";
    }

    function extractHighlightedSummaryBullets(sourceBlock, sections = []) {
        const highlightedSnippets = [];

        sections.forEach((section) => {
            (section.paragraphs || []).forEach(
                (paragraph) => {
                    (paragraph || []).forEach(
                        (part) => {
                            if (
                                part.highlight &&
                                part.text &&
                                highlightedSnippets.length < 5
                            ) {
                                highlightedSnippets.push(
                                    String(part.text)
                                        .trim()
                                );
                            }
                        }
                    );
                }
            );
        });

        return highlightedSnippets.length
            ? highlightedSnippets
            : [
                ...(sourceBlock.learn
                    ?.keyConcepts || []),
                ...(sourceBlock.learn
                    ?.hotPoints || [])
            ]
                .filter(Boolean)
                .slice(0, 5);
    }

    function findFirstHighlightTarget(
        sections = []
    ) {
        let fallback = null;

        for (const section of sections) {
            for (const paragraph of section.paragraphs || []) {
                for (const part of paragraph || []) {
                    if (
                        !fallback &&
                        String(part.text || "").trim()
                    ) {
                        fallback = part;
                    }

                    if (
                        part.highlight &&
                        String(part.text || "").trim()
                    ) {
                        return part;
                    }
                }
            }
        }

        return fallback;
    }

    function refreshHighlightedDocumentState(
        documentData,
        state,
        sourceBlock
    ) {
        const block =
            sourceBlock ||
            state.blocks.find(
                (item) =>
                    item.id ===
                    documentData.sourceBlockId
            ) ||
            state.blocks.find(
                (item) =>
                    item.id ===
                    state.activeBlockId
            ) ||
            state.blocks[0];
        const materialLabel =
            state.studyTitle ||
            state.materialName ||
            "Documento";
        const sections = Array.isArray(
            documentData.sections
        )
            ? documentData.sections
            : [];
        const selected =
            findSelectedHighlightPart(
                documentData
            );
        const fallbackPart =
            findFirstHighlightTarget(
                sections
            );
        const nextSelectedId = selected
            ? selected.part.id
            : (fallbackPart?.id || "");
        const extractedLead =
            extractHighlightedSummaryLead(
                sections
            );

        return {
            ...documentData,
            sourceBlockId:
                block?.id ||
                documentData.sourceBlockId ||
                "",
            title:
                documentData.title ||
                `${materialLabel} - texto com marcador`,
            subtitle:
                documentData.subtitle ||
                "Documento original preservado, com destaque nas partes mais importantes.",
            ctaLabel:
                documentData.ctaLabel ||
                "Extrair resumo para documento novo",
            sections,
            originalSections: Array.isArray(documentData.originalSections)
                ? documentData.originalSections
                : clone(sections),
            selectedPartId: nextSelectedId,
            activeColorKey:
                resolveHighlightColorKey(
                    documentData.activeColorKey ||
                    "gold"
                ),
            colorOptions:
                getHighlightColorOptions(),
            extractedSummary: {
                title:
                    `${block?.title || "Resumo"} - resumo extraido`,
                lead:
                    extractedLead ||
                    block?.learn?.summary ||
                    "",
                bullets:
                    extractHighlightedSummaryBullets(
                        block || {},
                        sections
                    ),
                sourceTitle:
                    materialLabel,
                blockTitle:
                    block?.title || ""
            }
        };
    }

    function buildHighlightedDocument(state, block) {
        const sourceBlock = block || state.blocks[0];
        const materialLabel = state.studyTitle || state.materialName || "Documento";
        const emphasisTerms = [
            sourceBlock.title,
            ...(sourceBlock.topics || []).slice(0, 3),
            ...(sourceBlock.learn.keyConcepts || []).slice(0, 3)
        ].filter(Boolean);
        const learnSections = Array.isArray(sourceBlock.learn.sections)
            ? sourceBlock.learn.sections
            : [];
        const extractedTextSections =
            state.materialExtractedText
                ? buildHighlightSectionsFromExtractedText(
                    state.materialExtractedText,
                    emphasisTerms,
                    {
                        primaryTitle: materialLabel,
                        highlightColorKey: "gold"
                    }
                )
                : [];
        const sections = extractedTextSections.length
            ? extractedTextSections
            : [
                {
                    label: "Visao geral",
                    title: sourceBlock.title,
                    paragraphs: [
                        buildHighlightedParts(
                            sourceBlock.learn.summary,
                            emphasisTerms,
                            {
                                baseId: "highlight-summary",
                                highlightColorKey: "gold"
                            }
                        ),
                        buildHighlightedParts(
                            sourceBlock.learn.intro || sourceBlock.subtitle || "",
                            emphasisTerms,
                            {
                                baseId: "highlight-intro",
                                highlightColorKey: "gold"
                            }
                        )
                    ].filter((parts) =>
                        parts.some((part) => part.text)
                    )
                },
                ...learnSections.map((section, sectionIndex) => ({
                    label: section.label,
                    title: section.title,
                    paragraphs: section.paragraphs.map(
                        (paragraph, paragraphIndex) =>
                            buildHighlightedParts(
                                paragraph,
                                emphasisTerms,
                                {
                                    baseId:
                                        `highlight-learn-${sectionIndex}-${paragraphIndex}`,
                                    highlightColorKey:
                                        "gold"
                                }
                            )
                    )
                }))
            ];
        const extractedLead =
            extractHighlightedSummaryLead(
                sections
            );

        return refreshHighlightedDocumentState({
            id: `highlight-${sourceBlock.id}`,
            sourceBlockId: sourceBlock.id,
            title: `${materialLabel} - texto com marcador`,
            subtitle: extractedTextSections.length
                ? "Texto extraido do PDF com destaques da IA e edicao manual no mesmo visual."
                : "Documento original preservado, com destaque nas partes mais importantes.",
            ctaLabel: "Extrair resumo para documento novo",
            sections,
            originalSections: clone(sections),
            selectedPartId: "",
            activeColorKey: "gold",
            colorOptions: getHighlightColorOptions(),
            extractedSummary: {
                title: `${sourceBlock.title} - resumo extraido`,
                lead: extractedLead || sourceBlock.learn.summary,
                bullets: extractHighlightedSummaryBullets(
                    sourceBlock,
                    sections
                ),
                sourceTitle: materialLabel,
                blockTitle: sourceBlock.title
            }
        }, state, sourceBlock);
    }

    function buildPracticeCuePool(block) {
        return [
            block.title,
            block.subtitle,
            ...(Array.isArray(block.topics)
                ? block.topics
                : []),
            ...(Array.isArray(
                block.learn?.keyConcepts
            )
                ? block.learn.keyConcepts
                : []),
            ...(Array.isArray(
                block.learn?.hotPoints
            )
                ? block.learn.hotPoints
                : [])
        ]
            .filter(Boolean)
            .map((item) => String(item).trim())
            .filter(Boolean);
    }

    function buildFallbackQuizItem(
        block,
        absoluteIndex
    ) {
        const cues =
            buildPracticeCuePool(block);
        const cue =
            cues[
                absoluteIndex %
                Math.max(cues.length, 1)
            ] || block.title;

        return buildQuestion(
            `No material completo de ${block.title}, qual leitura ajuda mais a dominar ${cue}?`,
            [
                "Responder so pelo tema geral",
                "Comparar criterio, funcao e limite antes de decidir",
                "Ignorar relacoes entre conceitos",
                "Memorizar uma frase isolada"
            ],
            1,
            "A leitura mais forte nasce quando voce compara criterio, funcao e limite, em vez de decidir por semelhanca."
        );
    }

    function buildFallbackTrueFalseItem(
        block,
        absoluteIndex
    ) {
        const cues =
            buildPracticeCuePool(block);
        const cue =
            cues[
                absoluteIndex %
                Math.max(cues.length, 1)
            ] || block.title;

        return buildTrueFalse(
            `No estudo completo de ${block.title}, ${cue} pode ser decidido sem comparar criterio e limite.`,
            false,
            "Quando criterio e limite somem da leitura, o erro por semelhanca superficial cresce."
        );
    }

    function buildFallbackFlashcardItem(
        block,
        absoluteIndex
    ) {
        const cues =
            buildPracticeCuePool(block);
        const cue =
            cues[
                absoluteIndex %
                Math.max(cues.length, 1)
            ] || block.title;

        return buildFlashcard(
            `Ponto-chave ${absoluteIndex + 1}`,
            cue,
            "Use esse lembrete para puxar o criterio central do material inteiro antes de responder."
        );
    }

    function normalizeQuizItem(
        item,
        block,
        absoluteIndex
    ) {
        if (
            !item ||
            !String(item.prompt || "").trim()
        ) {
            return buildFallbackQuizItem(
                block,
                absoluteIndex
            );
        }

        const options = Array.isArray(item.options)
            ? item.options
                .map((option) =>
                    String(option || "").trim()
                )
                .filter(Boolean)
            : [];

        while (options.length < 4) {
            options.push(
                `Opcao ${String.fromCharCode(65 + options.length)}`
            );
        }

        const correctIndex =
            Number.isFinite(item.correctIndex)
                ? Math.max(
                    0,
                    Math.min(
                        options.length - 1,
                        Number(item.correctIndex)
                    )
                )
                : 0;

        return buildQuestion(
            String(item.prompt).trim(),
            options.slice(0, 4),
            correctIndex,
            String(item.rationale || "").trim() ||
                "Compare criterio, funcao e limite para validar a resposta correta."
        );
    }

    function normalizeTrueFalseItem(
        item,
        block,
        absoluteIndex
    ) {
        if (
            !item ||
            !String(item.statement || "").trim()
        ) {
            return buildFallbackTrueFalseItem(
                block,
                absoluteIndex
            );
        }

        return buildTrueFalse(
            String(item.statement).trim(),
            Boolean(item.answer),
            String(item.rationale || "").trim() ||
                "Volte ao criterio do texto para separar o que e regra do que e excecao."
        );
    }

    function normalizeFlashcardItem(
        item,
        block,
        absoluteIndex
    ) {
        if (
            !item ||
            !String(item.front || "").trim() ||
            !String(item.back || "").trim()
        ) {
            return buildFallbackFlashcardItem(
                block,
                absoluteIndex
            );
        }

        return buildFlashcard(
            String(item.front).trim(),
            String(item.back).trim(),
            String(item.tip || "").trim() ||
                "Use esse card para puxar o criterio principal do material."
        );
    }

    function normalizePracticeSeriesByType(
        block,
        practice,
        type
    ) {
        const config = {
            quiz: {
                baseKey: "quiz",
                seriesKey: "quizSeries",
                itemCount: 3,
                normalizer: normalizeQuizItem
            },
            trueFalse: {
                baseKey: "trueFalse",
                seriesKey: "trueFalseSeries",
                itemCount: 3,
                normalizer: normalizeTrueFalseItem
            },
            flashcards: {
                baseKey: "flashcards",
                seriesKey: "flashcardSeries",
                itemCount: 3,
                normalizer: normalizeFlashcardItem
            }
        }[type];

        const rawBase = Array.isArray(
            practice[config.baseKey]
        )
            ? practice[config.baseKey]
            : [];
        const rawSeries = Array.isArray(
            practice[config.seriesKey]
        )
            ? practice[config.seriesKey]
            : [];
        const pool = [
            ...rawBase,
            ...rawSeries.flatMap((series) =>
                Array.isArray(series)
                    ? series
                    : []
            )
        ].map((item, index) =>
            config.normalizer(
                item,
                block,
                index
            )
        );
        const safePool = pool.length
            ? pool
            : Array.from(
                { length: config.itemCount * 3 },
                (_, index) =>
                    config.normalizer(
                        null,
                        block,
                        index
                    )
            );
        const series = Array.from(
            { length: 3 },
            (_, seriesIndex) =>
                Array.from(
                    { length: config.itemCount },
                    (_, itemIndex) => {
                        const absoluteIndex =
                            seriesIndex *
                                config.itemCount +
                            itemIndex;
                        const source =
                            safePool[
                                absoluteIndex %
                                    safePool.length
                            ];

                        return clone(source);
                    }
                )
        );

        return {
            base: series[0],
            series
        };
    }

    function findSelectedHighlightPart(
        documentData
    ) {
        if (
            !documentData ||
            !documentData.selectedPartId
        ) {
            return null;
        }

        for (
            let sectionIndex = 0;
            sectionIndex <
            (documentData.sections || [])
                .length;
            sectionIndex += 1
        ) {
            const section =
                documentData.sections[
                    sectionIndex
                ];

            for (
                let paragraphIndex = 0;
                paragraphIndex <
                (section.paragraphs || [])
                    .length;
                paragraphIndex += 1
            ) {
                const paragraph =
                    section.paragraphs[
                        paragraphIndex
                    ];

                for (
                    let partIndex = 0;
                    partIndex <
                    (paragraph || []).length;
                    partIndex += 1
                ) {
                    const part =
                        paragraph[partIndex];

                    if (
                        part.id ===
                        documentData.selectedPartId
                    ) {
                        return {
                            sectionIndex,
                            paragraphIndex,
                            partIndex,
                            part
                        };
                    }
                }
            }
        }

        return null;
    }

    function createSavedSummaryRecord(documentData, state) {
        const summary = documentData.extractedSummary || {};
        return {
            id: `saved-summary-${Date.now()}`,
            title: summary.title || "Resumo salvo",
            lead: summary.lead || "",
            bullets: Array.isArray(summary.bullets)
                ? summary.bullets
                : [],
            sourceTitle: summary.sourceTitle || state.studyTitle || state.materialName || "Documento",
            blockTitle: summary.blockTitle || "",
            createdAt: new Date().toISOString()
        };
    }

    function createStudyLibraryId() {
        return `library-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    function buildDocumentSections(config) {
        return [
            {
                id: "summary",
                label: "Resumo abrangente",
                title: config.summaryTitle,
                paragraphs: config.summaryParagraphs || []
            },
            {
                id: "concepts",
                label: "Conceitos centrais",
                title: config.conceptsTitle,
                items: config.conceptsItems || []
            },
            {
                id: "rules",
                label: "Regras e excecoes pontuais",
                title: config.rulesTitle,
                items: config.rulesItems || []
            },
            {
                id: "pitfalls",
                label: "Pegadinhas",
                title: config.pitfallsTitle,
                items: config.pitfallsItems || []
            },
            {
                id: "comparisons",
                label: "Comparacoes importantes",
                title: config.comparisonsTitle,
                items: config.comparisonsItems || []
            },
            {
                id: "criteria",
                label: "Criterios e definicoes chave",
                title: config.criteriaTitle,
                items: config.criteriaItems || []
            }
        ];
    }

    function enrichLearnContent(block, materialLabel) {
        if (
            block.generatedByAi ||
            (block.learn && Array.isArray(block.learn.documentSections) && block.learn.documentSections.length > 0)
        ) {
            return block;
        }

        if (block.id === "block-1") {
            return {
                ...block,
                learn: {
                    ...block.learn,
                    summary: `Este bloco abre o estudo pelo núcleo de ${materialLabel}, organizando os termos centrais, as definições mais importantes e as relações que sustentam o restante do conteúdo.`,
                    intro: "A proposta aqui e construir entendimento antes de acelerar. Quando o nucleo do assunto fica claro, o material deixa de parecer uma lista de informacoes soltas e passa a ter ordem, hierarquia e direcao.",
                    documentSections: buildDocumentSections({
                        summaryTitle: "O mapa que organiza a leitura inteira",
                        summaryParagraphs: [
                            `O núcleo principal de ${materialLabel} precisa ser lido como a espinha dorsal do tema. A função deste assunto não é despejar informação, mas criar ordem: primeiro você entende o que define o tema, depois enxerga como cada parte se conecta e, só então, diferencia exemplo, aplicação e exceção.`,
                            "Quando esse mapa fica claro, a leitura acelera naturalmente. O estudante para de decorar frases soltas e passa a reconhecer critério, estrutura e linguagem recorrente. Isso deixa o conteúdo mais leve, reduz a dispersão e melhora muito a entrada nas questões.",
                            "Em prova, esse bloco vale porque ele sustenta todos os demais. Se a base estiver firme, você identifica com mais segurança o que o enunciado realmente quer cobrar e evita respostas por semelhança superficial."
                        ],
                        conceptsTitle: "As ideias que sustentam o restante do material",
                        conceptsItems: [
                            "Definir o conceito central antes de aceitar exemplos como se fossem a propria definicao.",
                            "Reconhecer qual critério de classificação organiza o assunto e separa as partes principais.",
                            "Entender a estrutura basica do tema para nao tratar elementos relacionados como se fossem equivalentes.",
                            "Ligar cada termo importante a sua funcao, e nao apenas ao nome que aparece no PDF."
                        ],
                        rulesTitle: "O que funciona como regra e onde o assunto costuma abrir excecao",
                        rulesItems: [
                            "A regra aqui é partir da definição e do critério antes de avançar para detalhe ou aplicação.",
                            "Excecoes pontuais aparecem quando um caso parece pertencer ao conceito, mas altera sua funcao ou limite.",
                            "Sempre que a leitura fugir da base e entrar num caso especifico, vale verificar se aquilo e exemplo ou excecao real.",
                            "Se a excecao depende de condicao, essa condicao precisa ficar colada a ela na revisao."
                        ],
                        pitfallsTitle: "Onde a banca pode confundir quem leu sem estruturar",
                        pitfallsItems: [
                            "Trocar definicao por exemplo pratico porque os dois parecem falar da mesma coisa.",
                            "Responder pelo tema geral da alternativa e ignorar a palavra que muda o critério.",
                            "Memorizar nomes isolados sem entender qual relacao existe entre eles.",
                            "Assumir que todo caso recorrente representa a regra principal."
                        ],
                        comparisonsTitle: "Comparações que deixam o critério mais nítido",
                        comparisonsItems: [
                            "Conceito central versus aplicacao: um explica o que o tema e, o outro mostra como ele aparece.",
                            "Regra versus excecao: a regra organiza, a excecao limita ou desvia esse alcance.",
                            "Critério versus exemplo: critério serve para decidir; exemplo serve para ilustrar.",
                            "Leitura estrutural versus decoracao: a primeira sustenta acerto, a segunda quebra quando o enunciado muda."
                        ],
                        criteriaTitle: "O que precisa virar referencia rapida na revisao",
                        criteriaItems: [
                            "Definicao-chave: frase curta que explica o que realmente torna o assunto o que ele e.",
                            "Criterio de classificacao: ponto que diferencia itens parecidos e organiza a leitura.",
                            "Pergunta-guia: o que define este conceito e com qual parte do tema ele se conecta.",
                            "Sinal de dominio: conseguir explicar a base sem depender de um unico exemplo."
                        ]
                    }),
                    explainBetter: {
                        title: "Explicacao mais didatica deste assunto",
                        paragraphs: [
                            `Pense este assunto como a fundação de ${materialLabel}. Se a fundação estiver clara, o resto do conteúdo deixa de parecer um monte de blocos separados e passa a funcionar como uma construção coerente.`,
                            "O jeito mais seguro de estudar aqui é perguntar o tempo todo: isso é definição, critério, exemplo ou exceção? Essa pergunta simples evita quase todos os erros de leitura superficial.",
                            "Quando você consegue responder com suas próprias palavras qual é a ideia central e por que ela organiza o tema, o assunto já saiu do campo da decoração e entrou no campo do entendimento."
                        ]
                    },
                    reviewInFivePoints: [
                        "Descubra primeiro qual conceito organiza o assunto inteiro.",
                        "Separe definição, critério, exemplo e exceção antes de revisar detalhes.",
                        "Nao aceite duas ideias parecidas como equivalentes sem comparar a funcao de cada uma.",
                        "Volte ao critério sempre que uma alternativa parecer familiar demais.",
                        "Considere o bloco dominado quando conseguir explicar a base sem depender do PDF."
                    ],
                    sections: [
                        {
                            label: "Panorama",
                            title: "O que precisa ficar claro logo de inicio",
                            paragraphs: [
                                `O primeiro passo em ${materialLabel} e identificar quais ideias realmente organizam o tema. Em vez de entrar por detalhes, exemplos ou excecoes, o foco deve estar na base que sustenta o assunto e reaparece ao longo da leitura.`,
                                "Quando essa base fica firme, cada novo trecho encontra lugar dentro do mapa mental. Isso reduz dispersao, acelera a compreensao e evita a sensacao de estudar sem eixo."
                            ]
                        },
                        {
                            label: "Leitura guiada",
                            title: "Como transformar resumo em entendimento real",
                            paragraphs: [
                                "Leia procurando relações, não frases soltas. Sempre que surgir um termo importante, pergunte qual critério ele representa, com o que ele se conecta e que erro pode acontecer se ele for confundido com exemplo ou aplicação.",
                                "Essa postura melhora a retencao porque o cerebro guarda estrutura. Em prova, isso vale muito mais do que decorar definicoes isoladas sem entender por que elas importam."
                            ]
                        },
                        {
                            label: "Resultado",
                            title: "O que este assunto precisa entregar para você",
                            paragraphs: [
                                "O ganho principal aqui é criar segurança conceitual. Quando a base está firme, você reconhece o que o enunciado realmente está cobrando e evita cair em alternativas que parecem familiares, mas trocam critério por exemplo.",
                                "Se ao final deste bloco você conseguir explicar o assunto com suas próprias palavras e mostrar a diferença entre regra, exceção e aplicação, o aprendizado já saiu do nível superficial."
                            ]
                        }
                    ]
                }
            };
        }

        if (block.id === "block-2") {
            return {
                ...block,
                learn: {
                    ...block.learn,
                    summary: `Este bloco concentra o que mais costuma gerar erro em ${materialLabel}: comparacoes, excecoes e formulacoes parecidas que separam leitura superficial de acerto consistente.`,
                    intro: "Depois que a base fica entendida, o que mais faz diferença no desempenho é o refinamento do critério. Este bloco existe para treinar o olhar nas pequenas mudanças de sentido que a banca usa para separar domínio de reconhecimento superficial.",
                    documentSections: buildDocumentSections({
                        summaryTitle: "O ajuste fino que transforma leitura em acerto",
                        summaryParagraphs: [
                            `Depois de entender a base de ${materialLabel}, o maior salto de resultado vem do refinamento. Este assunto existe para treinar o olhar nas comparações, nas palavras de contraste e nas exceções que a banca usa para separar quem domina o critério de quem apenas reconhece o tema.`,
                            "Aqui o estudo precisa ficar mais preciso. A leitura deixa de perguntar apenas do que o texto esta falando e passa a perguntar o que mudou, qual limite foi inserido e qual palavra alterou o sentido do enunciado.",
                            "Quando esse bloco fica bem resolvido, o aluno passa a errar menos por impulso e ganha mais controle em alternativas muito parecidas, especialmente nas questões em que a diferença cabe em um detalhe."
                        ],
                        conceptsTitle: "As ideias que precisam virar ferramenta de prova",
                        conceptsItems: [
                            "Comparação direta entre itens próximos para enxergar onde o critério muda.",
                            "Leitura da palavra-chave que limita, confirma ou invalida o sentido do enunciado.",
                            "Separacao limpa entre regra principal e excecao recorrente.",
                            "Reconhecimento das formulacoes que parecem equivalentes, mas nao produzem o mesmo efeito."
                        ],
                        rulesTitle: "Regras de leitura e excecoes que precisam ficar sob controle",
                        rulesItems: [
                            "Regra principal: comparar antes de decidir quando duas alternativas parecem irmas.",
                            "Excecao pontual: um termo de contraste pode inverter o valor inteiro da afirmacao.",
                            "Sempre que houver limite, condicao ou ressalva, esse elemento precisa ser lido como parte da resposta, nao como detalhe lateral.",
                            "A excecao nunca deve ser memorizada colada na regra; ela precisa aparecer como desvio controlado."
                        ],
                        pitfallsTitle: "Erros típicos de quem conhece o tema, mas não o critério",
                        pitfallsItems: [
                            "Confiar na memoria visual do PDF e ignorar a mudanca de uma palavra decisiva.",
                            "Marcar a alternativa pelo assunto geral, sem checar o limite da afirmacao.",
                            "Misturar regra e excecao porque ambas parecem familiares.",
                            "Responder por semelhanca superficial em vez de comparar ponto por ponto."
                        ],
                        comparisonsTitle: "Contrastes que precisam aparecer automaticamente",
                        comparisonsItems: [
                            "Regra versus excecao: uma organiza o caso comum, a outra limita o alcance.",
                            "Palavra neutra versus palavra de contraste: a segunda costuma decidir a questao.",
                            "Enunciado correto versus quase correto: a diferença geralmente está no critério, não no tema.",
                            "Reconhecimento superficial versus leitura analitica: o primeiro acelera erro, a segunda sustenta acerto."
                        ],
                        criteriaTitle: "Definições curtas que protegem você da pegadinha",
                        criteriaItems: [
                            "Palavra-chave: termo que confirma, restringe ou desloca o sentido da alternativa.",
                            "Criterio de contraste: ponto exato que separa duas formulacoes parecidas.",
                            "Excecao frequente: caso que so vale quando a condicao aparece junto.",
                            "Sinal de dominio: conseguir justificar por que uma opcao e quase certa, mas ainda errada."
                        ]
                    }),
                    explainBetter: {
                        title: "Leitura mais explicada deste assunto",
                        paragraphs: [
                            "Este bloco nao pede mais volume de leitura, e sim mais precisao. A pergunta principal deixa de ser 'eu ja vi isso?' e vira 'o que exatamente mudou aqui?'.",
                            "Quase sempre a banca esconde a diferenca em um termo pequeno: uma restricao, uma ressalva, um conectivo ou uma palavra que parece inofensiva. Por isso a comparacao precisa ser ativa e deliberada.",
                            "Quando você passa a ler procurando limite, contraste e exceção, o assunto deixa de ser escorregadio e vira um bloco tecnicamente controlável."
                        ]
                    },
                    reviewInFivePoints: [
                        "Compare alternativas muito parecidas antes de confiar na primeira impressao.",
                        "Procure a palavra que limita, inverte ou condiciona o enunciado.",
                        "Nao memorize excecao junto da regra: destaque o limite que a torna especial.",
                        "Desconfie de respostas que parecem certas apenas pelo tema geral.",
                        "Considere o bloco dominado quando você consegue explicar por que a quase correta ainda está errada."
                    ],
                    sections: [
                        {
                            label: "Comparacao",
                            title: "Onde a maioria dos erros nasce",
                            paragraphs: [
                                "Grande parte dos erros nesta fase não vem de desconhecer o assunto, mas de ler duas formulações parecidas como se fossem equivalentes. É justamente aqui que a prova separa quem só reconhece o tema de quem domina o critério.",
                                "Por isso, a comparação precisa ser ativa. Em vez de perguntar apenas se você já viu aquilo, o caminho melhor é perguntar o que muda, qual palavra limita o sentido e onde está a diferença que altera a resposta."
                            ]
                        },
                        {
                            label: "Excecao",
                            title: "Como revisar limites sem embaralhar a regra",
                            paragraphs: [
                                "Excecao nao deve ser estudada misturada com a regra, porque isso enfraquece as duas. A regra precisa ficar limpa, e a excecao precisa aparecer como desvio controlado, com sinal claro do que a torna diferente.",
                                "Esse cuidado reduz erro por automatismo, que acontece quando o aluno reconhece o tema geral da alternativa, mas nao percebe a pequena mudanca que invalida a resposta."
                            ]
                        },
                        {
                            label: "Aplicacao",
                            title: "Como transformar este bloco em acerto de prova",
                            paragraphs: [
                                "A estrategia mais forte aqui e revisar por contraste: regra versus excecao, definicao versus exemplo, termo central versus palavra que desvia o sentido. Isso deixa a leitura mais afiada para a linguagem da banca.",
                                "Se você conseguir localizar rapidamente a palavra que confirma, limita ou invalida o enunciado, este bloco já cumpriu sua função."
                            ]
                        }
                    ]
                }
            };
        }

        return block;
    }

    function buildRichBlocks(studyTitle) {
        const materialLabel =
            studyTitle || "seu material";

        return buildBlocks(studyTitle).map((block) =>
            enrichLearnContent(block, materialLabel)
        );
    }

    function createQuizSession(items) {
        return {
            index: 0,
            answers: [],
            isComplete: false,
            completedAt: "",
            currentSeriesIndex: 0,
            freeSeriesUsed: 1,
            completedSeries: [],
            seriesSnapshots: {}
        };
    }

    function createTrueFalseSession(items) {
        return {
            answers: {},
            submitted: false,
            score: null,
            focusIndex: 0,
            currentSeriesIndex: 0,
            freeSeriesUsed: 1,
            completedSeries: [],
            seriesSnapshots: {}
        };
    }

    function createFlashcardSession(items) {
        return {
            index: 0,
            flipped: false,
            known: [],
            done: false,
            currentSeriesIndex: 0,
            freeSeriesUsed: 1,
            completedSeries: [],
            seriesSnapshots: {}
        };
    }

    function createMiniExamSession(items) {
        return {
            started: false,
            index: 0,
            answers: [],
            isComplete: false,
            result: null
        };
    }

    function getPracticeSeries(block, type) {
        const practice = block.practice || {};
        const seriesKeys = {
            quiz: "quizSeries",
            trueFalse: "trueFalseSeries",
            flashcards: "flashcardSeries"
        };
        const baseKeys = {
            quiz: "quiz",
            trueFalse: "trueFalse",
            flashcards: "flashcards"
        };
        const existingSeries = practice[seriesKeys[type]];

        if (Array.isArray(existingSeries) && existingSeries.length > 0) {
            return existingSeries;
        }

        const baseItems = Array.isArray(practice[baseKeys[type]])
            ? practice[baseKeys[type]]
            : [];

        return [clone(baseItems), clone(baseItems), clone(baseItems)];
    }

    function isPracticeSessionComplete(type, session = {}) {
        if (type === "quiz") {
            return Boolean(session.isComplete);
        }

        if (type === "trueFalse") {
            return Boolean(session.submitted);
        }

        if (type === "flashcards") {
            return Boolean(session.done);
        }

        return false;
    }

    function normalizeCompletedSeries(type, session = {}, freeSeriesLimit = 3) {
        const source = Array.isArray(session.completedSeries)
            ? session.completedSeries
            : [];
        const completed = new Set(
            source
                .map((index) => Number(index))
                .filter((index) => Number.isFinite(index) && index >= 0 && index < freeSeriesLimit)
        );

        if (isPracticeSessionComplete(type, session)) {
            const currentIndex = Number.isFinite(session.currentSeriesIndex)
                ? session.currentSeriesIndex
                : 0;
            if (currentIndex >= 0 && currentIndex < freeSeriesLimit) {
                completed.add(currentIndex);
            }
        }

        return Array.from(completed).sort((a, b) => a - b);
    }

    function snapshotPracticeSession(session) {
        const snapshot = clone(session);
        delete snapshot.seriesSnapshots;
        return snapshot;
    }

    function createPracticeSeriesSeed(type, seriesIndex, session = {}) {
        const completedSeries = Array.isArray(session.completedSeries)
            ? [...session.completedSeries]
            : [];
        const seriesSnapshots = session.seriesSnapshots && typeof session.seriesSnapshots === "object"
            ? { ...session.seriesSnapshots }
            : {};
        const freeSeriesUsed = Math.max(
            Number(session.freeSeriesUsed) || 1,
            (Number(seriesIndex) || 0) + 1
        );
        const seed = type === "quiz"
            ? createQuizSession([])
            : type === "trueFalse"
                ? createTrueFalseSession([])
                : createFlashcardSession([]);

        return {
            ...seed,
            currentSeriesIndex: Number(seriesIndex) || 0,
            freeSeriesUsed,
            completedSeries,
            seriesSnapshots
        };
    }

    function markPracticeSeriesComplete(type, session = {}) {
        const currentSeriesIndex = Math.max(0, Number(session.currentSeriesIndex) || 0);
        const completedSeries = normalizeCompletedSeries(type, session);
        if (!completedSeries.includes(currentSeriesIndex)) {
            completedSeries.push(currentSeriesIndex);
            completedSeries.sort((a, b) => a - b);
        }

        const nextSession = {
            ...session,
            completedSeries,
            freeSeriesUsed: Math.max(Number(session.freeSeriesUsed) || 1, currentSeriesIndex + 1)
        };
        const seriesSnapshots = nextSession.seriesSnapshots && typeof nextSession.seriesSnapshots === "object"
            ? { ...nextSession.seriesSnapshots }
            : {};

        seriesSnapshots[currentSeriesIndex] = snapshotPracticeSession(nextSession);
        nextSession.seriesSnapshots = seriesSnapshots;

        return nextSession;
    }

    function buildSessions(blocks) {
        const sessions = {};
        blocks.forEach((block) => {
            sessions[block.id] = {
                quiz: createQuizSession(block.practice.quiz),
                trueFalse: createTrueFalseSession(block.practice.trueFalse),
                flashcards: createFlashcardSession(block.practice.flashcards),
                miniExam: createMiniExamSession(block.exam.questions)
            };
        });
        return sessions;
    }

    function normalizeSessions(blocks, snapshotSessions) {
        const sessions = buildSessions(blocks);
        const source = snapshotSessions || {};

        blocks.forEach((block) => {
            const current = source[block.id] || {};
            sessions[block.id] = {
                quiz: {
                    ...sessions[block.id].quiz,
                    ...(current.quiz || {})
                },
                trueFalse: {
                    ...sessions[block.id].trueFalse,
                    ...(current.trueFalse || {})
                },
                flashcards: {
                    ...sessions[block.id].flashcards,
                    ...(current.flashcards || {})
                },
                miniExam: {
                    ...sessions[block.id].miniExam,
                    ...(current.miniExam || {})
                }
            };
        });

        return sessions;
    }

    function ensureBlockProgress(block, patch) {
        return {
            ...block,
            progress: {
                ...block.progress,
                ...patch
            }
        };
    }

    function createPdfWorkbenchState(input = {}) {
        return {
            currentPage: Number(input.currentPage || 1),
            totalPages: Number(input.totalPages || 0),
            zoomValue: String(input.zoomValue || "page-width"),
            sidebarOpen: Boolean(input.sidebarOpen),
            editorMode: String(input.editorMode || "none"),
            searchQuery: String(input.searchQuery || ""),
            selectedAiHighlightId: String(input.selectedAiHighlightId || ""),
            fullScreen: Boolean(input.fullScreen),
            lastSyncedAt: String(input.lastSyncedAt || ""),
            transientMessage: String(input.transientMessage || "")
        };
    }

    function normalizeAiHighlight(item, index = 0) {
        if (!item || typeof item !== "object") {
            return null;
        }

        return {
            id: String(item.id || `ai-highlight-${index + 1}`),
            source: item.source === "user" ? "user" : "ai",
            pageHint: Number(item.pageHint || 0) || 0,
            quote: String(item.quote || ""),
            anchor: String(item.anchor || ""),
            contextLabel: String(item.contextLabel || ""),
            reason: String(item.reason || ""),
            importance: String(item.importance || "high"),
            colorKey: String(item.colorKey || item.suggestedColor || "gold"),
            dismissed: Boolean(item.dismissed)
        };
    }

    function createState() {
        const today = new Date();
        const blocks = buildRichBlocks("");
        return {
            step: "entry",
            previousStep: null,
            returnStep: "mode-select",
            accessTier: "free",
            subscriptionStatus: "registered_free",
            customerId: "",
            accountUser: null,
            accountAuthenticated: false,
            premiumEntitlement: null,
            premiumStatusConfigured: false,
            generationPaused: false,
            opsLanes: {
                freeLanePaused: false,
                premiumLanePaused: false
            },
            opsThresholds: {
                dailyWarnThreshold: 500,
                dailyCriticalThreshold: 600,
                dailyHardStopThreshold: 650
            },
            trialState: null,
            studyLibraryId: createStudyLibraryId(),
            studyTitle: "",
            materialName: "",
            materialHash: "",
            materialSizeLabel: "",
            materialPageCount: null,
            materialExtractedText: "",
            materialExtractionStatus: "pending",
            pdfAssetId: "",
            pdfAssetHash: "",
            pdfSource: "",
            pdfSyncStatus: "",
            pdfSyncError: "",
            pdfWorkbenchState: createPdfWorkbenchState(),
            pdfWorkbenchText: "",
            pdfWorkbenchOriginalText: "",
            pdfWorkbenchHtml: "",
            pdfWorkbenchOriginalHtml: "",
            aiHighlights: [],
            examDate: "",
            calendarMonth: today.getMonth(),
            calendarYear: today.getFullYear(),
            targetScore: 8.0,
            studyHours: 1,
            studyMinutes: 30,
            analysisProgress: 8,
            analysisStatus: "pending",
            aiGeneration: null,
            blocks,
            sessions: buildSessions(blocks),
            activeBlockId: blocks[0].id,
            blockTab: "aprender",
            blockFullScreen: true,
            blockAssistMode: "",
            highlightEditorOpen: false,
            highlightEditorFullScreen: false,
            levelExam: createLevelExamState(),
            highlightedDocument: null,
            savedSummaries: [],
            activeSavedSummaryId: "",
            studyLibrary: [],
            activeLibraryItemId: "",
            latestLocalStudy: null,
            savedDraftId: "",
            savedAt: "",
            modePreparation: createModePreparationState(),
            shellActivity: createShellActivityState(),
            sessionNote: null,
            premiumOffer: null,
            progressLabel: "Seu plano comeca quando o PDF entra."
        };
    }

    window.PremiumStudyStore = {
        state: createState(),

        getState() {
            return this.state;
        },

        patch(partial) {
            this.state = {
                ...this.state,
                ...partial
            };

            return this.state;
        },

        setStep(step) {
            this.state = {
                ...this.state,
                previousStep: this.state.step,
                step
            };

            return this.state;
        },

        setReturnStep(step) {
            this.state = {
                ...this.state,
                returnStep: step
            };

            return this.state;
        },

        setModePreparation(patch = {}) {
            this.state = {
                ...this.state,
                modePreparation: createModePreparationState({
                    ...this.state.modePreparation,
                    ...patch
                })
            };

            return this.state;
        },

        clearModePreparation() {
            this.state = {
                ...this.state,
                modePreparation: createModePreparationState()
            };

            return this.state;
        },

        setShellActivity(patch = {}) {
            this.state = {
                ...this.state,
                shellActivity: createShellActivityState({
                    ...this.state.shellActivity,
                    ...patch
                })
            };

            return this.state;
        },

        clearShellActivity() {
            this.state = {
                ...this.state,
                shellActivity: createShellActivityState()
            };

            return this.state;
        },

        clearSessionNote() {
            if (!this.state.sessionNote) {
                return this.state;
            }

            this.state = {
                ...this.state,
                sessionNote: null
            };

            return this.state;
        },

        setSessionNote(note) {
            this.state = {
                ...this.state,
                sessionNote: note || null
            };

            return this.state;
        },

        setPremiumOffer(offer) {
            this.state = {
                ...this.state,
                premiumOffer: offer || null
            };

            return this.state;
        },

        setMaterial(fileLike) {
            if (!fileLike) {
                return this.state;
            }

            const sizeLabel = typeof fileLike.size === "number"
                ? `${(fileLike.size / (1024 * 1024)).toFixed(1)} MB`
                : "PDF textual";
            const pageCount = Number.isFinite(fileLike.pageCount)
                ? fileLike.pageCount
                : null;

            const studyTitle = buildStudyTitle(fileLike.name || "material.pdf");
            const blocks = buildRichBlocks(studyTitle);

            this.state = {
                ...this.state,
                studyLibraryId: createStudyLibraryId(),
                materialName: fileLike.name || "material.pdf",
                materialHash: fileLike.materialHash || fileLike.hash || "",
                materialSizeLabel: sizeLabel,
                materialPageCount: pageCount,
                materialExtractedText: "",
                materialExtractionStatus: "pending",
                pdfAssetId: fileLike.pdfAssetId || fileLike.assetId || "",
                pdfAssetHash: fileLike.pdfAssetHash || fileLike.assetHash || fileLike.materialHash || "",
                pdfSource: fileLike.pdfSource || "local",
                pdfSyncStatus: fileLike.pdfSyncStatus || "",
                pdfSyncError: "",
                pdfWorkbenchState: createPdfWorkbenchState(),
                pdfWorkbenchText: "",
                pdfWorkbenchOriginalText: "",
                pdfWorkbenchHtml: "",
                pdfWorkbenchOriginalHtml: "",
                aiHighlights: [],
                studyTitle,
                blocks,
                sessions: buildSessions(blocks),
                activeBlockId: blocks[0].id,
                blockFullScreen: true,
                blockAssistMode: "",
                aiGeneration: null,
                levelExam: createLevelExamState(),
                sessionNote: null,
                progressLabel: "Material recebido. Agora vamos ajustar tudo ao seu prazo e a sua meta."
            };

            return this.state;
        },

        setPdfAsset(payload = {}) {
            this.state = {
                ...this.state,
                pdfAssetId: payload.pdfAssetId || this.state.pdfAssetId,
                pdfAssetHash: payload.pdfAssetHash || this.state.pdfAssetHash,
                pdfSource: payload.pdfSource || this.state.pdfSource,
                pdfSyncStatus: payload.pdfSyncStatus || this.state.pdfSyncStatus,
                pdfSyncError: payload.pdfSyncError || ""
            };

            return this.state;
        },

        setPdfSyncError(message) {
            this.state = {
                ...this.state,
                pdfSyncError: String(message || ""),
                pdfSyncStatus: message ? "error" : this.state.pdfSyncStatus
            };

            return this.state;
        },

        patchPdfWorkbenchState(patch = {}) {
            this.state = {
                ...this.state,
                pdfWorkbenchState: {
                    ...this.state.pdfWorkbenchState,
                    ...createPdfWorkbenchState({
                        ...this.state.pdfWorkbenchState,
                        ...patch
                    })
                }
            };

            return this.state;
        },

        setPdfWorkbenchText(text, options = {}) {
            const nextText = String(text || "");
            const nextHtml = String(options.html || "");
            const preserveOriginal = options.preserveOriginal !== false;
            const nextOriginal = preserveOriginal && this.state.pdfWorkbenchOriginalText
                ? this.state.pdfWorkbenchOriginalText
                : nextText;
            const nextOriginalHtml = preserveOriginal && this.state.pdfWorkbenchOriginalHtml
                ? this.state.pdfWorkbenchOriginalHtml
                : (nextHtml || "");

            this.state = {
                ...this.state,
                pdfWorkbenchText: nextText,
                pdfWorkbenchOriginalText: nextOriginal,
                pdfWorkbenchHtml: nextHtml,
                pdfWorkbenchOriginalHtml: nextOriginalHtml
            };

            return this.state;
        },

        restorePdfWorkbenchOriginal() {
            this.state = {
                ...this.state,
                pdfWorkbenchText: this.state.pdfWorkbenchOriginalText || this.state.pdfWorkbenchText || "",
                pdfWorkbenchHtml: this.state.pdfWorkbenchOriginalHtml || this.state.pdfWorkbenchHtml || ""
            };

            return this.state;
        },

        setPdfAiHighlights(items = []) {
            const normalized = Array.isArray(items)
                ? items.map(normalizeAiHighlight).filter(Boolean)
                : [];
            const currentSelectedId = this.state.pdfWorkbenchState.selectedAiHighlightId;
            const hasCurrentSelection = normalized.some((item) => item.id === currentSelectedId && !item.dismissed);

            this.state = {
                ...this.state,
                aiHighlights: normalized,
                pdfWorkbenchState: {
                    ...this.state.pdfWorkbenchState,
                    selectedAiHighlightId: hasCurrentSelection
                        ? currentSelectedId
                        : (normalized.find((item) => !item.dismissed) || {}).id || ""
                }
            };

            return this.state;
        },

        updatePdfAiHighlight(highlightId, patch = {}) {
            if (!highlightId) {
                return this.state;
            }

            this.state = {
                ...this.state,
                aiHighlights: this.state.aiHighlights.map((item) => item.id === highlightId
                    ? normalizeAiHighlight({
                        ...item,
                        ...patch,
                        id: item.id
                    })
                    : item)
            };

            return this.state;
        },

        selectPdfAiHighlight(highlightId) {
            this.state = {
                ...this.state,
                pdfWorkbenchState: {
                    ...this.state.pdfWorkbenchState,
                    selectedAiHighlightId: highlightId || ""
                }
            };

            return this.state;
        },

        setLatestLocalStudy(summary) {
            this.state = {
                ...this.state,
                latestLocalStudy: summary
            };

            return this.state;
        },

        setStudyTitle(title) {
            const nextTitle = String(title || "").trim();
            if (!nextTitle) {
                return this.state;
            }

            this.state = {
                ...this.state,
                studyTitle: nextTitle,
                progressLabel: "Nome do estudo atualizado."
            };

            return this.state;
        },

        setExamDate(value) {
            const parts = String(value || "").split("-");
            const year = parts.length === 3 ? Number(parts[0]) : this.state.calendarYear;
            const month = parts.length === 3 ? Number(parts[1]) - 1 : this.state.calendarMonth;
            this.state = {
                ...this.state,
                examDate: value,
                calendarMonth: Number.isFinite(month) ? month : this.state.calendarMonth,
                calendarYear: Number.isFinite(year) ? year : this.state.calendarYear,
                progressLabel: "Data definida. O ritmo do plano ja pode ser calibrado."
            };

            return this.state;
        },

        shiftCalendarMonth(delta) {
            const cursor = new Date(this.state.calendarYear, this.state.calendarMonth + delta, 1);
            this.state = {
                ...this.state,
                calendarMonth: cursor.getMonth(),
                calendarYear: cursor.getFullYear()
            };

            return this.state;
        },

        setTargetScore(value) {
            const score = Math.max(0, Math.min(10, value));
            this.state = {
                ...this.state,
                targetScore: Number(score.toFixed(1)),
                progressLabel: `Meta de ${score.toFixed(1)} definida. O sistema vai mirar nesse resultado.`
            };

            return this.state;
        },

        setStudyHours(value) {
            const hours = Math.max(0, Math.min(12, value));
            this.state = {
                ...this.state,
                studyHours: hours,
                progressLabel: "Carga horaria diaria ajustada para um plano mais realista."
            };

            return this.state;
        },

        setStudyMinutes(value) {
            const minutes = Math.max(0, Math.min(59, value));
            this.state = {
                ...this.state,
                studyMinutes: minutes,
                progressLabel: "Tempo diario refinado. O plano agora conversa melhor com sua rotina."
            };

            return this.state;
        },

        setAnalysisProgress(progress, status) {
            this.state = {
                ...this.state,
                analysisProgress: progress,
                analysisStatus: status || "running"
            };

            return this.state;
        },

        setMaterialExtraction(result = {}) {
            this.state = {
                ...this.state,
                materialExtractedText: result.text || this.state.materialExtractedText || "",
                materialExtractionStatus: result.status || (result.text ? "extracted" : "empty_text"),
                materialPageCount: Number.isFinite(result.pageCount)
                    ? result.pageCount
                    : this.state.materialPageCount
            };

            return this.state;
        },

        applyGeneratedBundle(payload = {}) {
            const bundle = payload.bundle || payload;
            const sourceBlocks = Array.isArray(bundle.blocks) ? bundle.blocks : [];
            if (!sourceBlocks.length) {
                return this.state;
            }

            const blocks = sourceBlocks.map((block, index) => {
                const practice = block.practice || {};
                const normalizedBlock = {
                    ...block,
                    id: block.id || `block-${index + 1}`
                };
                const normalizedQuiz =
                    normalizePracticeSeriesByType(
                        normalizedBlock,
                        practice,
                        "quiz"
                    );
                const normalizedTrueFalse =
                    normalizePracticeSeriesByType(
                        normalizedBlock,
                        practice,
                        "trueFalse"
                    );
                const normalizedFlashcards =
                    normalizePracticeSeriesByType(
                        normalizedBlock,
                        practice,
                        "flashcards"
                    );
                const questions = Array.isArray(block.exam && block.exam.questions)
                    ? block.exam.questions.slice(0, 5)
                    : [];

                return {
                    ...block,
                    id: block.id || `block-${index + 1}`,
                    generatedByAi: true,
                    status: index === 0 ? "recommended" : (block.status || "ready"),
                    progress: {
                        learn: false,
                        practice: false,
                        exam: false,
                        ...(block.progress || {})
                    },
                    learn: {
                        summary: "",
                        intro: "",
                        hotPoints: [],
                        keyConcepts: [],
                        pitfalls: [],
                        documentSections: [],
                        explainBetter: null,
                        reviewInFivePoints: [],
                        ...(block.learn || {})
                    },
                    practice: {
                        targets: {
                            quiz: 3,
                            trueFalse: 3,
                            flashcards: 3
                        },
                        ...practice,
                        quiz: normalizedQuiz.base,
                        quizSeries: normalizedQuiz.series,
                        trueFalse: normalizedTrueFalse.base,
                        trueFalseSeries: normalizedTrueFalse.series,
                        flashcards: normalizedFlashcards.base,
                        flashcardSeries: normalizedFlashcards.series
                    },
                    exam: {
                        ...(block.exam || {}),
                        baseCount: 5,
                        questions
                    }
                };
            });

            this.state = {
                ...this.state,
                studyTitle: bundle.title || this.state.studyTitle,
                blocks,
                sessions: buildSessions(blocks),
                activeBlockId: bundle.recommendedBlockId && blocks.some((block) => block.id === bundle.recommendedBlockId)
                    ? bundle.recommendedBlockId
                    : blocks[0].id,
                blockAssistMode: "",
                aiGeneration: {
                    status: payload.status || "generated",
                    provider: payload.provider || "",
                    model: payload.model || "",
                    promptVersion: payload.promptVersion || "",
                    warnings: Array.isArray(bundle.warnings) ? bundle.warnings : [],
                    generatedAt: new Date().toISOString()
                },
                progressLabel: "Sua rota foi gerada com IA a partir do PDF. Agora escolha como quer estudar."
            };

            return this.state;
        },

        appendMiniExamQuestions(blockId, questions = []) {
            const targetId = blockId || this.state.activeBlockId;
            const nextQuestions = Array.isArray(questions) ? questions : [];
            if (!targetId || !nextQuestions.length) {
                return this.state;
            }

            const blocks = this.state.blocks.map((block) => {
                if (block.id !== targetId) {
                    return block;
                }

                return {
                    ...block,
                    exam: {
                        ...block.exam,
                        baseCount: Number(block.exam && block.exam.baseCount) || 5,
                        questions: [
                            ...((block.exam && block.exam.questions) || []),
                            ...nextQuestions
                        ]
                    }
                };
            });
            const sessions = normalizeSessions(blocks, this.state.sessions);
            sessions[targetId].miniExam = createMiniExamSession(
                (blocks.find((block) => block.id === targetId).exam || {}).questions || []
            );

            this.state = {
                ...this.state,
                blocks,
                sessions,
                progressLabel: "Mais 5 questoes premium foram adicionadas a mini prova deste bloco."
            };

            return this.state;
        },

        setLevelExamQuestionCount(count) {
            const allowed = [10, 20, 30];
            const questionCount = allowed.includes(Number(count)) ? Number(count) : 10;
            this.state = {
                ...this.state,
                levelExam: createLevelExamState({
                    ...this.state.levelExam,
                    questionCount,
                    questions: [],
                    started: false,
                    answers: [],
                    index: 0,
                    isComplete: false,
                    result: null,
                    status: "idle"
                })
            };

            return this.state;
        },

        setLevelExamQuestions(payload = {}) {
            const questions = Array.isArray(payload.questions) ? payload.questions : [];
            this.state = {
                ...this.state,
                levelExam: createLevelExamState({
                    ...this.state.levelExam,
                    title: payload.title || "Prova de nivel RotaNota",
                    questions,
                    questionCount: questions.length || this.state.levelExam.questionCount,
                    started: false,
                    index: 0,
                    answers: [],
                    isComplete: false,
                    result: null,
                    status: questions.length ? "ready" : "idle"
                })
            };

            return this.state;
        },

        startLevelExam() {
            this.state = {
                ...this.state,
                levelExam: createLevelExamState({
                    ...this.state.levelExam,
                    started: true,
                    index: 0,
                    answers: [],
                    isComplete: false,
                    result: null,
                    status: "running"
                })
            };

            return this.state;
        },

        setLevelExamAnswer(answerIndex) {
            const levelExam = clone(this.state.levelExam);
            levelExam.answers[levelExam.index] = answerIndex;
            this.state = {
                ...this.state,
                levelExam
            };

            return this.state;
        },

        advanceLevelExam() {
            const levelExam = clone(this.state.levelExam);
            const questions = Array.isArray(levelExam.questions) ? levelExam.questions : [];

            if (levelExam.index >= questions.length - 1) {
                let correct = 0;
                questions.forEach((question, index) => {
                    if (levelExam.answers[index] === question.correctIndex) {
                        correct += 1;
                    }
                });
                levelExam.isComplete = true;
                levelExam.started = false;
                levelExam.status = "complete";
                levelExam.result = {
                    correct,
                    total: questions.length,
                    ratio: questions.length ? Math.round((correct / questions.length) * 100) : 0
                };
            } else {
                levelExam.index += 1;
            }

            this.state = {
                ...this.state,
                levelExam
            };

            return this.state;
        },

        setBlockTab(tab) {
            this.state = {
                ...this.state,
                blockTab: tab
            };

            return this.state;
        },

        setBlockFullScreen(value) {
            this.state = {
                ...this.state,
                blockFullScreen: Boolean(value)
            };

            return this.state;
        },

        setBlockAssistMode(mode) {
            const nextMode = mode === this.state.blockAssistMode
                ? ""
                : mode;

            this.state = {
                ...this.state,
                blockAssistMode: nextMode
            };

            return this.state;
        },

        selectBlock(blockId) {
            this.state = {
                ...this.state,
                activeBlockId: blockId
            };

            return this.state;
        },

        setStudyLibrary(items) {
            const nextItems = Array.isArray(items)
                ? items
                : [];

            this.state = {
                ...this.state,
                studyLibrary: nextItems,
                activeLibraryItemId:
                    this.state.activeLibraryItemId && nextItems.some((item) => item.id === this.state.activeLibraryItemId)
                        ? this.state.activeLibraryItemId
                        : nextItems[0]?.id || ""
            };

            return this.state;
        },

        setActiveLibraryItem(itemId) {
            this.state = {
                ...this.state,
                activeLibraryItemId: itemId
            };

            return this.state;
        },

        getActiveLibraryItem() {
            return this.state.studyLibrary.find((item) => item.id === this.state.activeLibraryItemId) || this.state.studyLibrary[0] || null;
        },

        openHighlightDocument(blockId) {
            const block = blockId
                ? this.getBlockById(blockId)
                : this.getActiveBlock();
            const highlightedDocument =
                refreshHighlightedDocumentState(
                    buildHighlightedDocument(
                        this.state,
                        block
                    ),
                    this.state,
                    block
                );

            this.state = {
                ...this.state,
                highlightedDocument,
                highlightEditorOpen: false,
                highlightEditorFullScreen: false,
                activeBlockId: block ? block.id : this.state.activeBlockId,
                progressLabel: "Documento marcado preparado. Agora você pode exportar o texto grifado ou só os destaques em PDF."
            };

            return this.state;
        },

        setHighlightEditorOpen(value) {
            this.state = {
                ...this.state,
                highlightEditorOpen: Boolean(value)
            };

            return this.state;
        },

        setHighlightEditorFullScreen(value) {
            this.state = {
                ...this.state,
                highlightEditorFullScreen: Boolean(value)
            };

            return this.state;
        },

        updateHighlightedDocument(updater) {
            const current =
                this.state.highlightedDocument ||
                buildHighlightedDocument(
                    this.state,
                    this.getActiveBlock()
                );
            const draft = clone(current);
            const next =
                typeof updater === "function"
                    ? updater(draft) || draft
                    : draft;
            const normalized =
                refreshHighlightedDocumentState(
                    next,
                    this.state
                );

            this.state = {
                ...this.state,
                highlightedDocument:
                    normalized
            };

            return this.state;
        },

        setHighlightSelection(sectionIndex, paragraphIndex, partIndex) {
            return this.updateHighlightedDocument((documentData) => {
                const target =
                    documentData.sections?.[Number(sectionIndex)]
                        ?.paragraphs?.[Number(paragraphIndex)]
                        ?.[Number(partIndex)];

                documentData.selectedPartId =
                    target?.id || "";
                return documentData;
            });
        },

        setHighlightTextSelection(sectionIndex, paragraphIndex, startOffset, endOffset) {
            return this.updateHighlightedDocument((documentData) => {
                const normalizedSectionIndex = Number(sectionIndex);
                const normalizedParagraphIndex = Number(paragraphIndex);
                const paragraph =
                    documentData.sections?.[normalizedSectionIndex]
                        ?.paragraphs?.[normalizedParagraphIndex];

                if (!Array.isArray(paragraph)) {
                    return documentData;
                }

                const selection =
                    selectHighlightRangeFromParagraph(
                        paragraph,
                        startOffset,
                        endOffset,
                        documentData.activeColorKey
                    );

                documentData.sections[normalizedSectionIndex].paragraphs[normalizedParagraphIndex] =
                    selection.paragraph;
                documentData.selectedPartId =
                    selection.selectedPartId || "";
                return documentData;
            });
        },

        updateSelectedHighlightText(text) {
            return this.updateHighlightedDocument((documentData) => {
                const selected =
                    findSelectedHighlightPart(
                        documentData
                    );

                if (!selected) {
                    return documentData;
                }

                const nextText =
                    String(text || "");

                selected.part.text =
                    nextText;
                const paragraph =
                    documentData.sections?.[selected.sectionIndex]
                        ?.paragraphs?.[selected.paragraphIndex];

                if (Array.isArray(paragraph)) {
                    documentData.sections[selected.sectionIndex].paragraphs[selected.paragraphIndex] =
                        normalizeHighlightParagraph(paragraph);
                }

                if (!nextText) {
                    documentData.selectedPartId = "";
                }

                return documentData;
            });
        },

        toggleSelectedHighlight(forceValue) {
            return this.updateHighlightedDocument((documentData) => {
                const selected =
                    findSelectedHighlightPart(
                        documentData
                    );

                if (!selected) {
                    return documentData;
                }

                const nextValue =
                    typeof forceValue === "boolean"
                        ? forceValue
                        : !selected.part.highlight;

                selected.part.highlight =
                    nextValue;
                selected.part.colorKey =
                    nextValue
                        ? resolveHighlightColorKey(
                            selected.part.colorKey ||
                            documentData.activeColorKey
                        )
                        : "";

                return documentData;
            });
        },

        setHighlightColor(colorKey) {
            const normalizedColor =
                resolveHighlightColorKey(
                    colorKey
                );

            return this.updateHighlightedDocument((documentData) => {
                documentData.activeColorKey =
                    normalizedColor;
                const selected =
                    findSelectedHighlightPart(
                        documentData
                    );

                if (selected) {
                    selected.part.highlight = true;
                    selected.part.colorKey =
                        normalizedColor;
                }

                return documentData;
            });
        },

        clearAllHighlights() {
            return this.updateHighlightedDocument((documentData) => {
                (documentData.sections || []).forEach((section) => {
                    (section.paragraphs || []).forEach((paragraph) => {
                        (paragraph || []).forEach((part) => {
                            part.highlight = false;
                            part.colorKey = "";
                        });
                    });
                });

                return documentData;
            });
        },

        deleteSelectedHighlightText() {
            return this.updateHighlightedDocument((documentData) => {
                const selected =
                    findSelectedHighlightPart(
                        documentData
                    );

                if (!selected) {
                    return documentData;
                }

                const paragraph =
                    documentData.sections?.[selected.sectionIndex]
                        ?.paragraphs?.[selected.paragraphIndex];

                if (!Array.isArray(paragraph)) {
                    return documentData;
                }

                const nextParagraph =
                    paragraph.filter((part) => part.id !== selected.part.id);

                documentData.sections[selected.sectionIndex].paragraphs[selected.paragraphIndex] =
                    normalizeHighlightParagraph(nextParagraph);
                documentData.selectedPartId = "";
                return documentData;
            });
        },

        restoreOriginalHighlightedDocument() {
            return this.updateHighlightedDocument((documentData) => {
                documentData.sections =
                    clone(documentData.originalSections || []);
                documentData.selectedPartId = "";
                return documentData;
            });
        },

        setSavedSummaries(items) {
            const summaries = Array.isArray(items)
                ? items
                : [];

            this.state = {
                ...this.state,
                savedSummaries: summaries,
                activeSavedSummaryId:
                    this.state.activeSavedSummaryId && summaries.some((item) => item.id === this.state.activeSavedSummaryId)
                        ? this.state.activeSavedSummaryId
                        : summaries[0]?.id || ""
            };

            return this.state;
        },

        saveCurrentHighlightedSummary() {
            if (!this.state.highlightedDocument) {
                return null;
            }

            const nextRecord =
                createSavedSummaryRecord(
                    this.state.highlightedDocument,
                    this.state
                );
            const savedSummaries = [
                nextRecord,
                ...this.state.savedSummaries
            ];

            this.state = {
                ...this.state,
                savedSummaries,
                activeSavedSummaryId: nextRecord.id,
                progressLabel: "Resumo extraido e salvo para consulta futura no premium."
            };

            return nextRecord;
        },

        setActiveSavedSummary(summaryId) {
            this.state = {
                ...this.state,
                activeSavedSummaryId: summaryId
            };

            return this.state;
        },

        getActiveSavedSummary() {
            return this.state.savedSummaries.find((item) => item.id === this.state.activeSavedSummaryId) || this.state.savedSummaries[0] || null;
        },

        getActiveBlock() {
            return this.state.blocks.find((block) => block.id === this.state.activeBlockId) || this.state.blocks[0];
        },

        getBlockById(blockId) {
            return this.state.blocks.find((block) => block.id === blockId) || null;
        },

        getNextBlockId() {
            const activeIndex = this.state.blocks.findIndex((block) => block.id === this.state.activeBlockId);
            const nextBlock = this.state.blocks[activeIndex + 1];
            return nextBlock ? nextBlock.id : "";
        },

        getActiveSession(type) {
            const blockId = this.state.activeBlockId;
            return this.state.sessions[blockId] ? this.state.sessions[blockId][type] : null;
        },

        getPracticeSeriesMeta(type) {
            const session = this.getActiveSession(type) || {};
            const block = this.getActiveBlock();
            const totalSeries = getPracticeSeries(block, type).length || 1;
            const freeSeriesLimit = Math.min(3, totalSeries);
            const completedSeries = normalizeCompletedSeries(type, session, freeSeriesLimit);
            const nextPendingIndex = Array.from({ length: freeSeriesLimit }, (_, index) => index)
                .find((index) => !completedSeries.includes(index));
            const currentSeries = Math.max(
                1,
                Math.min(
                    freeSeriesLimit,
                    Number.isFinite(session.currentSeriesIndex)
                        ? session.currentSeriesIndex + 1
                        : (session.freeSeriesUsed || 1)
                )
            );

            return {
                currentSeries,
                freeSeriesLimit,
                completedSeries,
                completedCount: completedSeries.length,
                generatedSeriesCount: completedSeries.length,
                nextPendingIndex: Number.isFinite(nextPendingIndex) ? nextPendingIndex : null,
                isAllComplete: completedSeries.length >= freeSeriesLimit,
                hasMoreFreeSeries: completedSeries.length < freeSeriesLimit
            };
        },

        getActiveTrueFalseItems() {
            const block = this.getActiveBlock();
            const session = this.getActiveSession("trueFalse");
            const series = getPracticeSeries(block, "trueFalse");
            const index = Math.max(0, Math.min(series.length - 1, session?.currentSeriesIndex || 0));

            return series[index] || block.practice.trueFalse;
        },

        getActiveQuizItems() {
            const block = this.getActiveBlock();
            const session = this.getActiveSession("quiz");
            const series = getPracticeSeries(block, "quiz");
            const index = Math.max(0, Math.min(series.length - 1, session?.currentSeriesIndex || 0));

            return series[index] || block.practice.quiz;
        },

        getActiveFlashcardItems() {
            const block = this.getActiveBlock();
            const session = this.getActiveSession("flashcards");
            const series = getPracticeSeries(block, "flashcards");
            const index = Math.max(0, Math.min(series.length - 1, session?.currentSeriesIndex || 0));

            return series[index] || block.practice.flashcards;
        },

        updateActiveSession(type, updater) {
            const blockId = this.state.activeBlockId;
            const current = this.getActiveSession(type);
            if (!current) {
                return this.state;
            }

            const nextSession = typeof updater === "function"
                ? updater(clone(current))
                : updater;

            this.state = {
                ...this.state,
                sessions: {
                    ...this.state.sessions,
                    [blockId]: {
                        ...this.state.sessions[blockId],
                        [type]: nextSession
                    }
                }
            };

            return this.state;
        },

        resetActiveSession(type, options = {}) {
            const block = this.getActiveBlock();
            const seeds = {
                quiz: createQuizSession(block.practice.quiz),
                trueFalse: createTrueFalseSession(block.practice.trueFalse),
                flashcards: createFlashcardSession(block.practice.flashcards),
                miniExam: createMiniExamSession(block.exam.questions)
            };
            if (type === "quiz") {
                const current = this.getActiveSession("quiz");
                seeds.quiz.currentSeriesIndex = options.allSeries ? 0 : current?.currentSeriesIndex || 0;
                seeds.quiz.freeSeriesUsed = options.allSeries ? 1 : current?.freeSeriesUsed || 1;
                seeds.quiz.completedSeries = options.allSeries
                    ? []
                    : normalizeCompletedSeries("quiz", current);
                seeds.quiz.seriesSnapshots = options.allSeries
                    ? {}
                    : { ...(current?.seriesSnapshots || {}) };
            }
            if (type === "trueFalse") {
                const current = this.getActiveSession("trueFalse");
                seeds.trueFalse.currentSeriesIndex = options.allSeries ? 0 : current?.currentSeriesIndex || 0;
                seeds.trueFalse.freeSeriesUsed = options.allSeries ? 1 : current?.freeSeriesUsed || 1;
                seeds.trueFalse.completedSeries = options.allSeries
                    ? []
                    : normalizeCompletedSeries("trueFalse", current);
                seeds.trueFalse.seriesSnapshots = options.allSeries
                    ? {}
                    : { ...(current?.seriesSnapshots || {}) };
            }
            if (type === "flashcards") {
                const current = this.getActiveSession("flashcards");
                seeds.flashcards.currentSeriesIndex = options.allSeries ? 0 : current?.currentSeriesIndex || 0;
                seeds.flashcards.freeSeriesUsed = options.allSeries ? 1 : current?.freeSeriesUsed || 1;
                seeds.flashcards.completedSeries = options.allSeries
                    ? []
                    : normalizeCompletedSeries("flashcards", current);
                seeds.flashcards.seriesSnapshots = options.allSeries
                    ? {}
                    : { ...(current?.seriesSnapshots || {}) };
            }
            return this.updateActiveSession(type, seeds[type]);
        },

        startMiniExam() {
            return this.updateActiveSession("miniExam", (session) => {
                session.started = true;
                session.index = 0;
                session.answers = [];
                session.isComplete = false;
                session.result = null;
                return session;
            });
        },

        setQuizAnswer(answerIndex) {
            return this.updateActiveSession("quiz", (session) => {
                session.answers[session.index] = answerIndex;
                return session;
            });
        },

        advanceQuiz() {
            const items = this.getActiveQuizItems();
            return this.updateActiveSession("quiz", (session) => {
                if (session.index >= items.length - 1) {
                    session.isComplete = true;
                    session.completedAt = new Date().toISOString();
                    return markPracticeSeriesComplete("quiz", session);
                } else {
                    session.index += 1;
                }
                return session;
            });
        },

        setTrueFalseAnswer(itemIndex, answer) {
            return this.updateActiveSession("trueFalse", (session) => {
                session.answers[itemIndex] = answer;
                return session;
            });
        },

        submitTrueFalse() {
            const items = this.getActiveTrueFalseItems();
            return this.updateActiveSession("trueFalse", (session) => {
                let hits = 0;
                items.forEach((item, index) => {
                    if (session.answers[index] === item.answer) {
                        hits += 1;
                    }
                });
                session.submitted = true;
                session.score = hits;
                return markPracticeSeriesComplete("trueFalse", session);
            });
        },

        advanceTrueFalseSeries() {
            return this.startNextPracticeSeries("trueFalse");
        },

        flipFlashcard() {
            return this.updateActiveSession("flashcards", (session) => {
                session.flipped = !session.flipped;
                return session;
            });
        },

        focusPracticeItem(type, itemIndex) {
            const block = this.getActiveBlock();
            const limits = {
                quiz: block.practice.quiz.length,
                trueFalse: block.practice.trueFalse.length,
                flashcards: block.practice.flashcards.length
            };
            const limit = limits[type];
            if (!Number.isFinite(limit) || limit <= 0) {
                return this.state;
            }

            const nextIndex = Math.max(0, Math.min(limit - 1, Number(itemIndex) || 0));

            return this.updateActiveSession(type, (session) => {
                if (type === "quiz") {
                    session.index = Math.max(0, Math.min(this.getActiveQuizItems().length - 1, nextIndex));
                    session.isComplete = false;
                    return session;
                }

                if (type === "trueFalse") {
                    session.focusIndex = Math.max(0, Math.min(this.getActiveTrueFalseItems().length - 1, nextIndex));
                    return session;
                }

                if (type === "flashcards") {
                    session.index = Math.max(0, Math.min(this.getActiveFlashcardItems().length - 1, nextIndex));
                    session.done = false;
                    session.flipped = false;
                    return session;
                }

                return session;
            });
        },

        selectPracticeSeries(type, seriesIndex) {
            const block = this.getActiveBlock();
            const current = this.getActiveSession(type) || {};
            const series = getPracticeSeries(block, type);
            const freeSeriesLimit = Math.min(3, series.length || 1);
            const completedSeries = normalizeCompletedSeries(type, current, freeSeriesLimit);
            const seriesSnapshots = current.seriesSnapshots && typeof current.seriesSnapshots === "object"
                ? current.seriesSnapshots
                : {};
            const nextSeriesIndex = Math.max(
                0,
                Math.min(freeSeriesLimit - 1, Number(seriesIndex) || 0)
            );

            return this.updateActiveSession(type, (session) => {
                const isSameActiveSeries = session.currentSeriesIndex === nextSeriesIndex;
                const isCurrentIncomplete = !isPracticeSessionComplete(type, session);
                const nextSnapshots = { ...seriesSnapshots };
                if (Number.isFinite(session.currentSeriesIndex)) {
                    nextSnapshots[session.currentSeriesIndex] = snapshotPracticeSession(session);
                }
                const savedSnapshot = nextSnapshots[nextSeriesIndex];

                if (!isSameActiveSeries && savedSnapshot) {
                    return {
                        ...clone(savedSnapshot),
                        currentSeriesIndex: nextSeriesIndex,
                        freeSeriesUsed: Math.max(Number(session.freeSeriesUsed) || 1, nextSeriesIndex + 1),
                        completedSeries,
                        seriesSnapshots: nextSnapshots
                    };
                }

                if (isSameActiveSeries && isPracticeSessionComplete(type, session)) {
                    nextSnapshots[nextSeriesIndex] = nextSnapshots[nextSeriesIndex] || snapshotPracticeSession(session);

                    return {
                        ...session,
                        completedSeries,
                        seriesSnapshots: nextSnapshots
                    };
                }

                if (isSameActiveSeries && isCurrentIncomplete) {
                    return {
                        ...session,
                        completedSeries,
                        seriesSnapshots: nextSnapshots
                    };
                }

                return createPracticeSeriesSeed(type, nextSeriesIndex, {
                    ...session,
                    completedSeries,
                    seriesSnapshots: nextSnapshots
                });
            });
        },

        startNextPracticeSeries(type) {
            const meta = this.getPracticeSeriesMeta(type);
            if (!Number.isFinite(meta.nextPendingIndex)) {
                return this.state;
            }

            return this.selectPracticeSeries(type, meta.nextPendingIndex);
        },

        restartPracticeType(type) {
            return this.resetActiveSession(type, { allSeries: true });
        },

        markFlashcard(known) {
            const items = this.getActiveFlashcardItems();
            return this.updateActiveSession("flashcards", (session) => {
                session.known[session.index] = known;
                session.flipped = false;
                if (session.index < items.length - 1) {
                    session.index += 1;
                } else {
                    session.done = true;
                    return markPracticeSeriesComplete("flashcards", session);
                }
                return session;
            });
        },

        advanceQuizSeries() {
            return this.startNextPracticeSeries("quiz");
        },

        advanceFlashcardSeries() {
            return this.startNextPracticeSeries("flashcards");
        },

        setMiniExamAnswer(answerIndex) {
            return this.updateActiveSession("miniExam", (session) => {
                session.answers[session.index] = answerIndex;
                return session;
            });
        },

        advanceMiniExam() {
            const block = this.getActiveBlock();
            return this.updateActiveSession("miniExam", (session) => {
                if (session.index >= block.exam.questions.length - 1) {
                    session.isComplete = true;
                    let correct = 0;
                    block.exam.questions.forEach((question, index) => {
                        if (session.answers[index] === question.correctIndex) {
                            correct += 1;
                        }
                    });
                    session.result = {
                        correct,
                        total: block.exam.questions.length,
                        ratio: Math.round((correct / block.exam.questions.length) * 100)
                    };
                } else {
                    session.index += 1;
                }
                return session;
            });
        },

        markActiveBlockProgress(progressPatch) {
            const activeId = this.state.activeBlockId;
            this.state = {
                ...this.state,
                blocks: this.state.blocks.map((block) => block.id === activeId
                    ? ensureBlockProgress(block, progressPatch)
                    : block)
            };

            return this.state;
        },

        getOverallProgress() {
            const total = this.state.blocks.length * 3;
            const hits = this.state.blocks.reduce((sum, block) => {
                const progress = block.progress || {};
                return sum
                    + (progress.learn ? 1 : 0)
                    + (progress.practice ? 1 : 0)
                    + (progress.exam ? 1 : 0);
            }, 0);

            return {
                completed: hits,
                total,
                ratio: total ? Math.round((hits / total) * 100) : 0
            };
        },

        exportSnapshot() {
            return {
                step: this.state.step,
                returnStep: this.state.returnStep,
                accessTier: this.state.accessTier,
                subscriptionStatus: this.state.subscriptionStatus,
                customerId: this.state.customerId,
                accountUser: this.state.accountUser,
                accountAuthenticated: this.state.accountAuthenticated,
                premiumEntitlement: this.state.premiumEntitlement,
                studyTitle: this.state.studyTitle,
                studyLibraryId: this.state.studyLibraryId,
                materialName: this.state.materialName,
                materialHash: this.state.materialHash,
                materialSizeLabel: this.state.materialSizeLabel,
                materialPageCount: this.state.materialPageCount,
                materialExtractedText: this.state.materialExtractedText,
                materialExtractionStatus: this.state.materialExtractionStatus,
                pdfAssetId: this.state.pdfAssetId,
                pdfAssetHash: this.state.pdfAssetHash,
                pdfSource: this.state.pdfSource,
                pdfSyncStatus: this.state.pdfSyncStatus,
                pdfSyncError: this.state.pdfSyncError,
                pdfWorkbenchState: clone(this.state.pdfWorkbenchState),
                pdfWorkbenchText: this.state.pdfWorkbenchText,
                pdfWorkbenchOriginalText: this.state.pdfWorkbenchOriginalText,
                pdfWorkbenchHtml: this.state.pdfWorkbenchHtml,
                pdfWorkbenchOriginalHtml: this.state.pdfWorkbenchOriginalHtml,
                aiHighlights: clone(this.state.aiHighlights),
                examDate: this.state.examDate,
                targetScore: this.state.targetScore,
                studyHours: this.state.studyHours,
                studyMinutes: this.state.studyMinutes,
                blocks: clone(this.state.blocks),
                sessions: clone(this.state.sessions),
                activeBlockId: this.state.activeBlockId,
                blockTab: this.state.blockTab,
                blockFullScreen: this.state.blockFullScreen,
                highlightEditorOpen: this.state.highlightEditorOpen,
                highlightEditorFullScreen: this.state.highlightEditorFullScreen,
                blockAssistMode: this.state.blockAssistMode,
                aiGeneration: this.state.aiGeneration,
                levelExam: clone(this.state.levelExam),
                highlightedDocument: clone(this.state.highlightedDocument),
                savedSummaries: clone(this.state.savedSummaries),
                activeSavedSummaryId: this.state.activeSavedSummaryId,
                savedDraftId: this.state.savedDraftId,
                savedAt: this.state.savedAt,
                premiumOffer: this.state.premiumOffer,
                progressLabel: this.state.progressLabel
            };
        },

        restoreFromSnapshot(snapshot) {
            if (!snapshot) {
                return this.state;
            }

            const defaults = createState();
            const accountState = {
                accessTier: this.state.accessTier,
                subscriptionStatus: this.state.subscriptionStatus,
                customerId: this.state.customerId,
                accountUser: this.state.accountUser,
                accountAuthenticated: this.state.accountAuthenticated,
                premiumEntitlement: this.state.premiumEntitlement,
                premiumStatusConfigured: this.state.premiumStatusConfigured,
                generationPaused: this.state.generationPaused,
                opsLanes: this.state.opsLanes,
                opsThresholds: this.state.opsThresholds,
                trialState: this.state.trialState
            };
            const studyTitle = snapshot.studyTitle || buildStudyTitle(snapshot.materialName);
            const materialLabel = studyTitle || "seu material";
            const blocks = snapshot.blocks && snapshot.blocks.length
                ? snapshot.blocks.map((block) => enrichLearnContent(block, materialLabel))
                : buildRichBlocks(studyTitle);
            const sessions = normalizeSessions(blocks, snapshot.sessions);
            const normalizedStep = snapshot.step === "analysis"
                ? "mode-select"
                : snapshot.step || "entry";

            this.state = {
                ...defaults,
                ...snapshot,
                ...accountState,
                step: normalizedStep,
                studyTitle,
                studyLibraryId: snapshot.studyLibraryId || defaults.studyLibraryId,
                materialHash: snapshot.materialHash || defaults.materialHash,
                blocks,
                sessions,
                activeBlockId: snapshot.activeBlockId || blocks[0].id,
                blockFullScreen: typeof snapshot.blockFullScreen === "boolean"
                    ? snapshot.blockFullScreen
                    : defaults.blockFullScreen,
                highlightEditorOpen: typeof snapshot.highlightEditorOpen === "boolean"
                    ? snapshot.highlightEditorOpen
                    : defaults.highlightEditorOpen,
                highlightEditorFullScreen: typeof snapshot.highlightEditorFullScreen === "boolean"
                    ? snapshot.highlightEditorFullScreen
                    : defaults.highlightEditorFullScreen,
                blockAssistMode: snapshot.blockAssistMode || defaults.blockAssistMode,
                aiGeneration: snapshot.aiGeneration || defaults.aiGeneration,
                levelExam: createLevelExamState(snapshot.levelExam || {}),
                modePreparation: defaults.modePreparation,
                shellActivity: defaults.shellActivity,
                materialExtractionStatus: snapshot.materialExtractionStatus || defaults.materialExtractionStatus,
                materialExtractedText: snapshot.materialExtractedText || "",
                pdfAssetId: snapshot.pdfAssetId || defaults.pdfAssetId,
                pdfAssetHash: snapshot.pdfAssetHash || snapshot.materialHash || defaults.pdfAssetHash,
                pdfSource: snapshot.pdfSource || defaults.pdfSource,
                pdfSyncStatus: snapshot.pdfSyncStatus || defaults.pdfSyncStatus,
                pdfSyncError: snapshot.pdfSyncError || defaults.pdfSyncError,
                pdfWorkbenchState: createPdfWorkbenchState(snapshot.pdfWorkbenchState || {}),
                pdfWorkbenchText: snapshot.pdfWorkbenchText || defaults.pdfWorkbenchText,
                pdfWorkbenchOriginalText: snapshot.pdfWorkbenchOriginalText || snapshot.pdfWorkbenchText || defaults.pdfWorkbenchOriginalText,
                pdfWorkbenchHtml: snapshot.pdfWorkbenchHtml || defaults.pdfWorkbenchHtml,
                pdfWorkbenchOriginalHtml: snapshot.pdfWorkbenchOriginalHtml || snapshot.pdfWorkbenchHtml || defaults.pdfWorkbenchOriginalHtml,
                aiHighlights: Array.isArray(snapshot.aiHighlights)
                    ? snapshot.aiHighlights.map(normalizeAiHighlight).filter(Boolean)
                    : defaults.aiHighlights,
                highlightedDocument: snapshot.highlightedDocument
                    ? refreshHighlightedDocumentState(
                        clone(snapshot.highlightedDocument),
                        {
                            ...defaults,
                            ...snapshot,
                            studyTitle,
                            blocks,
                            activeBlockId:
                                snapshot.activeBlockId ||
                                blocks[0].id,
                            materialExtractedText:
                                snapshot.materialExtractedText ||
                                ""
                        }
                    )
                    : null,
                savedSummaries: Array.isArray(snapshot.savedSummaries) ? snapshot.savedSummaries : defaults.savedSummaries,
                activeSavedSummaryId: snapshot.activeSavedSummaryId || defaults.activeSavedSummaryId,
                studyLibrary: this.state.studyLibrary,
                activeLibraryItemId: this.state.activeLibraryItemId,
                sessionNote: snapshot.sessionNote || null,
                premiumOffer: snapshot.premiumOffer || null,
                calendarMonth: snapshot.examDate
                    ? Number(String(snapshot.examDate).split("-")[1]) - 1
                    : defaults.calendarMonth,
                calendarYear: snapshot.examDate
                    ? Number(String(snapshot.examDate).split("-")[0])
                    : defaults.calendarYear,
                latestLocalStudy: this.state.latestLocalStudy
            };

            return this.state;
        }
    };
})();
