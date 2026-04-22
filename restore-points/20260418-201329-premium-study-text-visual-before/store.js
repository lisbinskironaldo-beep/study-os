(function () {
    if (window.PremiumStudyStore) {
        return;
    }

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

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

    function buildExamPack(material, descriptors) {
        const [first, second, third, fourth] = descriptors;

        return [
            buildQuestion(
                `Em ${material}, qual leitura inicial gera mais resultado?`,
                [
                    "Pular as definicoes centrais",
                    `Mapear ${first} antes de decorar detalhes`,
                    "Comecar apenas por exemplos isolados",
                    "Ir direto para excecoes"
                ],
                1,
                `O ponto de partida mais forte e entender ${first} antes de aprofundar o resto.`
            ),
            buildQuestion(
                `O que mais ajuda a nao confundir ${first} com aplicacao pratica?`,
                [
                    "Separar conceito, criterio e exemplo",
                    "Ler so a conclusao",
                    "Decorar uma frase solta",
                    "Ignorar a linguagem da banca"
                ],
                0,
                "Separar conceito, criterio e exemplo evita trocas tipicas de prova."
            ),
            buildQuestion(
                `Quando o enunciado cobra ${second}, o que voce deve procurar primeiro?`,
                [
                    "A palavra que delimita o criterio",
                    "O exemplo mais bonito",
                    "A alternativa mais longa",
                    "A resposta que parece familiar"
                ],
                0,
                `Em questoes de ${second}, a palavra que limita o criterio costuma decidir a alternativa.`
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
                "Uma relacao mnemonica curta ajuda a recuperar o conteudo sob pressao."
            ),
            buildQuestion(
                "Qual sequencia de revisao reduz mais a dispersao?",
                [
                    "Resumo, criterio, pratica",
                    "Pratica, titulo, acaso",
                    "Excecao, detalhe, exemplo",
                    "Mini prova, sem resumo"
                ],
                0,
                "Resumo, criterio e pratica formam a trilha mais limpa para consolidar o bloco."
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
                    "Nunca, porque pratica basta"
                ],
                0,
                "Se o erro foi de base, o resumo focado recompõe o mapa mental do assunto."
            ),
            buildQuestion(
                "Qual sinal indica que voce entendeu o assunto, e nao so decorou?",
                [
                    "Consegue explicar o criterio sem depender do exemplo",
                    "Reconhece a fonte do PDF",
                    "Lembra a cor do card",
                    "Responde so pelo tema geral"
                ],
                0,
                "Entendimento real aparece quando o criterio se sustenta sem depender do exemplo."
            ),
            buildQuestion(
                "Qual proximo passo faz mais sentido depois de consolidar este assunto?",
                [
                    "Ir para o proximo assunto ou para a pratica",
                    "Reiniciar o onboarding",
                    "Apagar o progresso",
                    "Fechar sem salvar"
                ],
                0,
                "Depois de consolidar um assunto, faz sentido praticar ou seguir para o proximo bloco."
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
                excerpt: "Termos centrais, definicoes e relacoes que abrem o restante do conteudo.",
                topics: [
                    "conceitos centrais do material",
                    "criterios e definicoes chave",
                    "linguagem que mais aparece na prova"
                ],
                progress: {
                    learn: false,
                    practice: false,
                    exam: false
                },
                learn: {
                    summary: `Este bloco isola o nucleo de ${material}, priorizando termos, definicoes e relacoes que ajudam voce a entrar no conteudo sem desperdicar tempo.`,
                    hotPoints: [
                        "Entender o vocabulario principal antes de memorizar detalhes.",
                        "Separar o que e regra, o que e excecao e o que e exemplo.",
                        "Marcar onde a banca pode confundir conceito com aplicacao."
                    ],
                    keyConcepts: [
                        "conceito central",
                        "criterio de classificacao",
                        "estrutura basica",
                        "aplicacao mais cobrada"
                    ],
                    pitfalls: [
                        "Trocar definicao por exemplo pratico.",
                        "Memorizar nomes sem entender relacao entre eles.",
                        "Ignorar o criterio que diferencia itens parecidos."
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
                            "O primeiro ganho real vem de organizar linguagem, criterio e definicoes do bloco."
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
                            "Marcar relacoes entre conceitos transforma o conteudo em estrutura, nao em lista solta."
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
                                "O primeiro ganho real vem de organizar linguagem, criterio e definicoes do bloco."
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
                                "Marcar relacoes entre conceitos transforma o conteudo em estrutura, nao em lista solta."
                            )
                        ],
                        [
                            buildQuestion(
                                "Qual ganho aparece quando voce entende o criterio principal do bloco?",
                                [
                                    "A leitura fica mais organizada",
                                    "Os exemplos deixam de importar",
                                    "A pratica pode ser ignorada",
                                    "Toda excecao vira regra"
                                ],
                                0,
                                "Com criterio claro, o conteudo deixa de parecer uma lista solta e passa a ter eixo."
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
                                    "Resumo, criterio, pratica",
                                    "Titulo, exemplo, chute",
                                    "Excecao, detalhe, pressa",
                                    "Mini prova sem revisao"
                                ],
                                0,
                                "Resumo, criterio e pratica formam a trilha mais limpa para o assunto."
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
                                    "Voltar ao criterio"
                                ],
                                0,
                                "Quem leu superficialmente tende a marcar pela sensacao geral, nao pelo criterio."
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
                            "A linguagem principal do material deve ser revisada antes da pratica intensa.",
                            true,
                            "Entender a linguagem do bloco acelera o restante da trilha."
                        ),
                        buildTrueFalse(
                            "Ignorar criterios de classificacao reduz o risco de erro em alternativas parecidas.",
                            false,
                            "E justamente o criterio que diferencia opcoes muito proximas."
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
                                "A linguagem principal do material deve ser revisada antes da pratica intensa.",
                                true,
                                "Entender a linguagem do bloco acelera o restante da trilha."
                            ),
                            buildTrueFalse(
                                "Ignorar criterios de classificacao reduz o risco de erro em alternativas parecidas.",
                                false,
                                "E justamente o criterio que diferencia opcoes muito proximas."
                            )
                        ],
                        [
                            buildTrueFalse(
                                "O vocabulario principal do tema pode ficar para depois, desde que voce memorize os nomes.",
                                false,
                                "Sem entender a linguagem principal, a leitura perde eixo e a memorizacao quebra rapido."
                            ),
                            buildTrueFalse(
                                "Separar regra, excecao e exemplo ajuda a ler o bloco com mais clareza.",
                                true,
                                "Essa separacao evita que elementos parecidos sejam tratados como equivalentes."
                            ),
                            buildTrueFalse(
                                "Quando dois itens parecem proximos, o criterio de classificacao deixa de ser importante.",
                                false,
                                "E justamente o criterio que mostra onde os itens se afastam."
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
                                "Frequencia nao substitui criterio; um caso recorrente ainda pode ser so exemplo."
                            ),
                            buildTrueFalse(
                                "Revisar a estrutura basica do tema ajuda a reduzir resposta por semelhanca superficial.",
                                true,
                                "Estrutura clara faz o aluno decidir por criterio, nao por impressao."
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
                            "Se a resposta virar um exemplo, voce ainda nao fixou o conceito."
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
                                "Se a resposta virar um exemplo, voce ainda nao fixou o conceito."
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
                                "Primeiro criterio, depois exemplo.",
                                "Sem criterio, o detalhe parece importante demais."
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
                                "Muitas alternativas parecem certas ate o criterio entrar."
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
                    baseCount: 10,
                    questions: buildExamPack(material, [
                        "a linguagem central",
                        "o criterio principal",
                        "relacoes entre conceitos",
                        "a memorizacao do bloco"
                    ])
                }
            },
            {
                id: "block-2",
                title: "Consolidacao objetiva",
                subtitle: "Aperte a retencao do que mais diferencia desempenho em questoes.",
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
                                "Comparar palavra-chave e criterio",
                                "Ignorar excecoes",
                                "Confiar apenas no instinto"
                            ],
                            1,
                            "Itens parecidos se resolvem por palavra-chave e criterio, nao por impressao geral."
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
                                    "Comparar palavra-chave e criterio",
                                    "Ignorar excecoes",
                                    "Confiar apenas no instinto"
                                ],
                                1,
                                "Itens parecidos se resolvem por palavra-chave e criterio, nao por impressao geral."
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
                                    "Lembrar a ordem das paginas",
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
                                    "Trocar criterio por exemplo"
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
                                "Essa divisao deixa o criterio mais limpo no momento da prova."
                            )
                        ],
                        [
                            buildTrueFalse(
                                "A excecao deve ser revisada colada na regra para o cerebro economizar leitura.",
                                false,
                                "Quando ficam grudadas, a tendencia e embaralhar as duas."
                            ),
                            buildTrueFalse(
                                "O erro por semelhanca superficial costuma cair quando voce compara item por item.",
                                true,
                                "Comparacao deliberada enfraquece o impulso de responder pela primeira impressao."
                            ),
                            buildTrueFalse(
                                "Pegadinha boa troca o criterio em um detalhe pequeno, nao necessariamente o tema inteiro.",
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
                                "Tema certo, criterio errado.",
                                "Muita alternativa quase correta cai nessa armadilha."
                            ),
                            buildFlashcard(
                                "Excecao segura",
                                "So vale com a condicao junto.",
                                "Sem a condicao, voce provavelmente voltou para a regra."
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
                    baseCount: 10,
                    questions: buildExamPack(material, [
                        "as comparacoes do tema",
                        "a palavra-chave de contraste",
                        "as excecoes do assunto",
                        "a memorizacao das pegadinhas"
                    ])
                }
            }
        ];
    }

    function buildHighlightedParts(text, highlights) {
        const content = String(text || "");
        const terms = Array.isArray(highlights)
            ? highlights.filter(Boolean)
            : [];

        if (!content || terms.length === 0) {
            return [
                {
                    text: content,
                    highlight: false
                }
            ];
        }

        const escapedTerms = terms
            .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .filter(Boolean);

        if (escapedTerms.length === 0) {
            return [
                {
                    text: content,
                    highlight: false
                }
            ];
        }

        const regex = new RegExp(`(${escapedTerms.join("|")})`, "gi");
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(content))) {
            if (match.index > lastIndex) {
                parts.push({
                    text: content.slice(lastIndex, match.index),
                    highlight: false
                });
            }

            parts.push({
                text: match[0],
                highlight: true
            });
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < content.length) {
            parts.push({
                text: content.slice(lastIndex),
                highlight: false
            });
        }

        return parts.length > 0
            ? parts
            : [
                {
                    text: content,
                    highlight: false
                }
            ];
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
        const sections = [
            {
                label: "Visao geral",
                title: sourceBlock.title,
                paragraphs: [
                    buildHighlightedParts(sourceBlock.learn.summary, emphasisTerms),
                    buildHighlightedParts(sourceBlock.learn.intro || sourceBlock.subtitle || "", emphasisTerms)
                ].filter((parts) => parts.some((part) => part.text))
            },
            ...learnSections.map((section) => ({
                label: section.label,
                title: section.title,
                paragraphs: section.paragraphs.map((paragraph) =>
                    buildHighlightedParts(paragraph, emphasisTerms)
                )
            }))
        ];

        return {
            id: `highlight-${sourceBlock.id}`,
            sourceBlockId: sourceBlock.id,
            title: `${materialLabel} - texto com marcador`,
            subtitle: "Documento original preservado, com destaque nas partes mais importantes.",
            ctaLabel: "Extrair resumo para documento novo",
            sections,
            extractedSummary: {
                title: `${sourceBlock.title} - resumo extraido`,
                lead: sourceBlock.learn.summary,
                bullets: [
                    ...(sourceBlock.learn.keyConcepts || []).slice(0, 4),
                    ...(sourceBlock.learn.hotPoints || []).slice(0, 2)
                ].filter(Boolean),
                sourceTitle: materialLabel,
                blockTitle: sourceBlock.title
            }
        };
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
        if (block.id === "block-1") {
            return {
                ...block,
                learn: {
                    ...block.learn,
                    summary: `Este bloco abre o estudo pelo nucleo de ${materialLabel}, organizando os termos centrais, as definicoes mais importantes e as relacoes que sustentam o restante do conteudo.`,
                    intro: "A proposta aqui e construir entendimento antes de acelerar. Quando o nucleo do assunto fica claro, o material deixa de parecer uma lista de informacoes soltas e passa a ter ordem, hierarquia e direcao.",
                    documentSections: buildDocumentSections({
                        summaryTitle: "O mapa que organiza a leitura inteira",
                        summaryParagraphs: [
                            `O nucleo principal de ${materialLabel} precisa ser lido como a espinha dorsal do tema. A funcao deste assunto nao e despejar informacao, mas criar ordem: primeiro voce entende o que define o tema, depois enxerga como cada parte se conecta e, so entao, diferencia exemplo, aplicacao e excecao.`,
                            "Quando esse mapa fica claro, a leitura acelera naturalmente. O estudante para de decorar frases soltas e passa a reconhecer criterio, estrutura e linguagem recorrente. Isso deixa o conteudo mais leve, reduz a dispersao e melhora muito a entrada nas questoes.",
                            "Em prova, esse bloco vale porque ele sustenta todos os demais. Se a base estiver firme, voce identifica com mais seguranca o que o enunciado realmente quer cobrar e evita respostas por semelhanca superficial."
                        ],
                        conceptsTitle: "As ideias que sustentam o restante do material",
                        conceptsItems: [
                            "Definir o conceito central antes de aceitar exemplos como se fossem a propria definicao.",
                            "Reconhecer qual criterio de classificacao organiza o assunto e separa as partes principais.",
                            "Entender a estrutura basica do tema para nao tratar elementos relacionados como se fossem equivalentes.",
                            "Ligar cada termo importante a sua funcao, e nao apenas ao nome que aparece no PDF."
                        ],
                        rulesTitle: "O que funciona como regra e onde o assunto costuma abrir excecao",
                        rulesItems: [
                            "A regra aqui e partir da definicao e do criterio antes de avancar para detalhe ou aplicacao.",
                            "Excecoes pontuais aparecem quando um caso parece pertencer ao conceito, mas altera sua funcao ou limite.",
                            "Sempre que a leitura fugir da base e entrar num caso especifico, vale verificar se aquilo e exemplo ou excecao real.",
                            "Se a excecao depende de condicao, essa condicao precisa ficar colada a ela na revisao."
                        ],
                        pitfallsTitle: "Onde a banca pode confundir quem leu sem estruturar",
                        pitfallsItems: [
                            "Trocar definicao por exemplo pratico porque os dois parecem falar da mesma coisa.",
                            "Responder pelo tema geral da alternativa e ignorar a palavra que muda o criterio.",
                            "Memorizar nomes isolados sem entender qual relacao existe entre eles.",
                            "Assumir que todo caso recorrente representa a regra principal."
                        ],
                        comparisonsTitle: "Comparacoes que deixam o criterio mais nitido",
                        comparisonsItems: [
                            "Conceito central versus aplicacao: um explica o que o tema e, o outro mostra como ele aparece.",
                            "Regra versus excecao: a regra organiza, a excecao limita ou desvia esse alcance.",
                            "Criterio versus exemplo: criterio serve para decidir; exemplo serve para ilustrar.",
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
                            `Pense este assunto como a fundacao de ${materialLabel}. Se a fundacao estiver clara, o resto do conteudo deixa de parecer um monte de blocos separados e passa a funcionar como uma construcao coerente.`,
                            "O jeito mais seguro de estudar aqui e perguntar o tempo todo: isso e definicao, criterio, exemplo ou excecao? Essa pergunta simples evita quase todos os erros de leitura superficial.",
                            "Quando voce consegue responder com suas proprias palavras qual e a ideia central e por que ela organiza o tema, o assunto ja saiu do campo da decoracao e entrou no campo do entendimento."
                        ]
                    },
                    reviewInFivePoints: [
                        "Descubra primeiro qual conceito organiza o assunto inteiro.",
                        "Separe definicao, criterio, exemplo e excecao antes de revisar detalhes.",
                        "Nao aceite duas ideias parecidas como equivalentes sem comparar a funcao de cada uma.",
                        "Volte ao criterio sempre que uma alternativa parecer familiar demais.",
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
                                "Leia procurando relacoes, nao frases soltas. Sempre que surgir um termo importante, pergunte qual criterio ele representa, com o que ele se conecta e que erro pode acontecer se ele for confundido com exemplo ou aplicacao.",
                                "Essa postura melhora a retencao porque o cerebro guarda estrutura. Em prova, isso vale muito mais do que decorar definicoes isoladas sem entender por que elas importam."
                            ]
                        },
                        {
                            label: "Resultado",
                            title: "O que este assunto precisa entregar para voce",
                            paragraphs: [
                                "O ganho principal aqui e criar seguranca conceitual. Quando a base esta firme, voce reconhece o que o enunciado realmente esta cobrando e evita cair em alternativas que parecem familiares, mas trocam criterio por exemplo.",
                                "Se ao final deste bloco voce conseguir explicar o assunto com suas proprias palavras e mostrar a diferenca entre regra, excecao e aplicacao, o aprendizado ja saiu do nivel superficial."
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
                    intro: "Depois que a base fica entendida, o que mais faz diferenca no desempenho e o refinamento do criterio. Este bloco existe para treinar o olhar nas pequenas mudancas de sentido que a banca usa para separar dominio de reconhecimento superficial.",
                    documentSections: buildDocumentSections({
                        summaryTitle: "O ajuste fino que transforma leitura em acerto",
                        summaryParagraphs: [
                            `Depois de entender a base de ${materialLabel}, o maior salto de resultado vem do refinamento. Este assunto existe para treinar o olhar nas comparacoes, nas palavras de contraste e nas excecoes que a banca usa para separar quem domina o criterio de quem apenas reconhece o tema.`,
                            "Aqui o estudo precisa ficar mais preciso. A leitura deixa de perguntar apenas do que o texto esta falando e passa a perguntar o que mudou, qual limite foi inserido e qual palavra alterou o sentido do enunciado.",
                            "Quando esse bloco fica bem resolvido, o aluno passa a errar menos por impulso e ganha mais controle em alternativas muito parecidas, especialmente nas questoes em que a diferenca cabe em um detalhe."
                        ],
                        conceptsTitle: "As ideias que precisam virar ferramenta de prova",
                        conceptsItems: [
                            "Comparacao direta entre itens proximos para enxergar onde o criterio muda.",
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
                        pitfallsTitle: "Erros tipicos de quem conhece o tema, mas nao o criterio",
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
                            "Enunciado correto versus quase correto: a diferenca geralmente esta no criterio, nao no tema.",
                            "Reconhecimento superficial versus leitura analitica: o primeiro acelera erro, a segunda sustenta acerto."
                        ],
                        criteriaTitle: "Definicoes curtas que protegem voce da pegadinha",
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
                            "Quando voce passa a ler procurando limite, contraste e excecao, o assunto deixa de ser escorregadio e vira um bloco tecnicamente controlavel."
                        ]
                    },
                    reviewInFivePoints: [
                        "Compare alternativas muito parecidas antes de confiar na primeira impressao.",
                        "Procure a palavra que limita, inverte ou condiciona o enunciado.",
                        "Nao memorize excecao junto da regra: destaque o limite que a torna especial.",
                        "Desconfie de respostas que parecem certas apenas pelo tema geral.",
                        "Considere o bloco dominado quando voce consegue explicar por que a quase correta ainda esta errada."
                    ],
                    sections: [
                        {
                            label: "Comparacao",
                            title: "Onde a maioria dos erros nasce",
                            paragraphs: [
                                "Grande parte dos erros nesta fase nao vem de desconhecer o assunto, mas de ler duas formulacoes parecidas como se fossem equivalentes. E justamente aqui que a prova separa quem so reconhece o tema de quem domina o criterio.",
                                "Por isso, a comparacao precisa ser ativa. Em vez de perguntar apenas se voce ja viu aquilo, o caminho melhor e perguntar o que muda, qual palavra limita o sentido e onde esta a diferenca que altera a resposta."
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
                                "Se voce conseguir localizar rapidamente a palavra que confirma, limita ou invalida o enunciado, este bloco ja cumpriu sua funcao."
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
            premiumEntitlement: null,
            premiumStatusConfigured: false,
            studyLibraryId: createStudyLibraryId(),
            studyTitle: "",
            materialName: "",
            materialSizeLabel: "",
            materialPageCount: null,
            examDate: "",
            calendarMonth: today.getMonth(),
            calendarYear: today.getFullYear(),
            targetScore: 8.0,
            studyHours: 1,
            studyMinutes: 30,
            analysisProgress: 8,
            analysisStatus: "pending",
            blocks,
            sessions: buildSessions(blocks),
            activeBlockId: blocks[0].id,
            blockTab: "aprender",
            blockFullScreen: true,
            blockAssistMode: "",
            highlightedDocument: null,
            savedSummaries: [],
            activeSavedSummaryId: "",
            studyLibrary: [],
            activeLibraryItemId: "",
            latestLocalStudy: null,
            savedDraftId: "",
            savedAt: "",
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
                materialSizeLabel: sizeLabel,
                materialPageCount: pageCount,
                studyTitle,
                blocks,
                sessions: buildSessions(blocks),
                activeBlockId: blocks[0].id,
                blockFullScreen: true,
                blockAssistMode: "",
                sessionNote: null,
                progressLabel: "Material recebido. Agora vamos ajustar tudo ao seu prazo e a sua meta."
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
                buildHighlightedDocument(this.state, block);

            this.state = {
                ...this.state,
                highlightedDocument,
                activeBlockId: block ? block.id : this.state.activeBlockId,
                progressLabel: "Documento marcado preparado. Agora voce pode exportar o texto grifado ou so os destaques em PDF."
            };

            return this.state;
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
                    : normalizeCompletedSeries("quiz", current).filter((index) => index !== seeds.quiz.currentSeriesIndex);
                seeds.quiz.seriesSnapshots = options.allSeries
                    ? {}
                    : { ...(current?.seriesSnapshots || {}) };
                delete seeds.quiz.seriesSnapshots[seeds.quiz.currentSeriesIndex];
            }
            if (type === "trueFalse") {
                const current = this.getActiveSession("trueFalse");
                seeds.trueFalse.currentSeriesIndex = options.allSeries ? 0 : current?.currentSeriesIndex || 0;
                seeds.trueFalse.freeSeriesUsed = options.allSeries ? 1 : current?.freeSeriesUsed || 1;
                seeds.trueFalse.completedSeries = options.allSeries
                    ? []
                    : normalizeCompletedSeries("trueFalse", current).filter((index) => index !== seeds.trueFalse.currentSeriesIndex);
                seeds.trueFalse.seriesSnapshots = options.allSeries
                    ? {}
                    : { ...(current?.seriesSnapshots || {}) };
                delete seeds.trueFalse.seriesSnapshots[seeds.trueFalse.currentSeriesIndex];
            }
            if (type === "flashcards") {
                const current = this.getActiveSession("flashcards");
                seeds.flashcards.currentSeriesIndex = options.allSeries ? 0 : current?.currentSeriesIndex || 0;
                seeds.flashcards.freeSeriesUsed = options.allSeries ? 1 : current?.freeSeriesUsed || 1;
                seeds.flashcards.completedSeries = options.allSeries
                    ? []
                    : normalizeCompletedSeries("flashcards", current).filter((index) => index !== seeds.flashcards.currentSeriesIndex);
                seeds.flashcards.seriesSnapshots = options.allSeries
                    ? {}
                    : { ...(current?.seriesSnapshots || {}) };
                delete seeds.flashcards.seriesSnapshots[seeds.flashcards.currentSeriesIndex];
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
                premiumEntitlement: this.state.premiumEntitlement,
                studyTitle: this.state.studyTitle,
                studyLibraryId: this.state.studyLibraryId,
                materialName: this.state.materialName,
                materialSizeLabel: this.state.materialSizeLabel,
                materialPageCount: this.state.materialPageCount,
                examDate: this.state.examDate,
                targetScore: this.state.targetScore,
                studyHours: this.state.studyHours,
                studyMinutes: this.state.studyMinutes,
                blocks: clone(this.state.blocks),
                sessions: clone(this.state.sessions),
                activeBlockId: this.state.activeBlockId,
                blockTab: this.state.blockTab,
                blockFullScreen: this.state.blockFullScreen,
                blockAssistMode: this.state.blockAssistMode,
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
                premiumEntitlement: this.state.premiumEntitlement,
                premiumStatusConfigured: this.state.premiumStatusConfigured
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
                blocks,
                sessions,
                activeBlockId: snapshot.activeBlockId || blocks[0].id,
                blockFullScreen: typeof snapshot.blockFullScreen === "boolean"
                    ? snapshot.blockFullScreen
                    : defaults.blockFullScreen,
                blockAssistMode: snapshot.blockAssistMode || defaults.blockAssistMode,
                highlightedDocument: snapshot.highlightedDocument || null,
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
