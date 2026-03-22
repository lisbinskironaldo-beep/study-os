window.QuestionsPage = {
    runtimeNotice: "",

    data: {
        tracks: {
            ensino_medio: {
                key: "ensino_medio",
                label: "Ensino medio",
                note: "Treino escolar objetivo, com base mais leve e direta.",
                baseKey: "ENEM",
                difficultyRange: [1, 2],
                defaultFocus: "matematica",
                defaultSessionSize: 8
            },
            enem: {
                key: "enem",
                label: "ENEM",
                note: "Sessao mais proxima da prova, com leitura e contexto.",
                baseKey: "ENEM",
                difficultyRange: [1, 4],
                defaultFocus: "matematica",
                defaultSessionSize: 12
            },
            concurso: {
                key: "concurso",
                label: "Concurso / OAB",
                note: "Treino mais tecnico, com foco em cobranca de banca.",
                baseKey: "OAB",
                difficultyRange: [2, 4],
                defaultFocus: "constitucional",
                defaultSessionSize: 10
            },
            quiz: {
                key: "quiz",
                label: "Quiz leve",
                note: "Para aquecer a mente sem peso de prova.",
                baseKey: "QUIZ",
                difficultyRange: [1, 3],
                defaultFocus: "cultura_geral",
                defaultSessionSize: 6
            }
        },

        missions: {
            topic: {
                key: "topic",
                label: "Assunto especifico",
                note: "Escolha materia e tema para treinar de forma afiada."
            },
            weak: {
                key: "weak",
                label: "Pontos fracos",
                note: "Puxa os temas em que voce mais erra e concentra neles."
            },
            quick: {
                key: "quick",
                label: "Sessao rapida",
                note: "Treino curto e leve para manter a rotina quente."
            }
        },

        sessionSizes: [5, 8, 12, 20],

        questionsDB: {
            ENEM: {
                label: "ENEM / Ensino medio",
                subjects: {
                    matematica: {
                        label: "Matematica",
                        topics: {
                            algebra: [
                                {
                                    question: "Se 3x + 6 = 21, qual e o valor de x?",
                                    options: ["3", "4", "5", "6"],
                                    correct: 2,
                                    difficulty: 1,
                                    explanation: "3x = 15, entao x = 5."
                                },
                                {
                                    question: "A expressao 2(a + 3) e equivalente a:",
                                    options: ["2a + 3", "2a + 5", "2a + 6", "a + 6"],
                                    correct: 2,
                                    difficulty: 1,
                                    explanation: "Distribuindo o 2, ficamos com 2a + 6."
                                },
                                {
                                    question: "Qual e a raiz de x^2 - 9 = 0 que e positiva?",
                                    options: ["1", "3", "6", "9"],
                                    correct: 1,
                                    difficulty: 2,
                                    explanation: "x^2 = 9, logo as raizes sao -3 e 3."
                                }
                            ],
                            geometria: [
                                {
                                    question: "Um quadrado de lado 4 tem area igual a:",
                                    options: ["8", "12", "16", "20"],
                                    correct: 2,
                                    difficulty: 1,
                                    explanation: "Area do quadrado e lado vezes lado: 4 x 4 = 16."
                                },
                                {
                                    question: "A soma dos angulos internos de um triangulo e:",
                                    options: ["90 graus", "180 graus", "270 graus", "360 graus"],
                                    correct: 1,
                                    difficulty: 1,
                                    explanation: "Todo triangulo possui 180 graus de soma interna."
                                },
                                {
                                    question: "Circunferencia com raio 3 possui diametro:",
                                    options: ["3", "6", "9", "12"],
                                    correct: 1,
                                    difficulty: 2,
                                    explanation: "Diametro e duas vezes o raio."
                                }
                            ],
                            estatistica: [
                                {
                                    question: "A media aritmetica de 2, 4 e 6 e:",
                                    options: ["3", "4", "5", "6"],
                                    correct: 1,
                                    difficulty: 1,
                                    explanation: "Somando e dividindo por 3, temos 12 / 3 = 4."
                                },
                                {
                                    question: "No conjunto 1, 1, 2, 3, a moda e:",
                                    options: ["1", "2", "3", "4"],
                                    correct: 0,
                                    difficulty: 2,
                                    explanation: "Moda e o valor que mais se repete: 1."
                                },
                                {
                                    question: "A mediana do conjunto 2, 5, 8 e:",
                                    options: ["2", "5", "8", "15"],
                                    correct: 1,
                                    difficulty: 2,
                                    explanation: "A mediana e o valor central do conjunto ordenado."
                                }
                            ]
                        }
                    },
                    portugues: {
                        label: "Portugues",
                        topics: {
                            interpretacao_textual: [
                                {
                                    question: "Ao ler um texto, a ideia principal costuma responder a:",
                                    options: ["Qual e o tema central?", "Quem publicou?", "Quantas palavras ha?", "Qual e o genero do autor?"],
                                    correct: 0,
                                    difficulty: 1,
                                    explanation: "A ideia principal mostra o nucleo do texto."
                                },
                                {
                                    question: "Uma inferencia textual exige que o leitor:",
                                    options: ["Copie o texto", "Leia apenas o titulo", "Relacione pistas do texto", "Ignore o contexto"],
                                    correct: 2,
                                    difficulty: 2,
                                    explanation: "Inferir e ligar pistas explicitas e implicitas."
                                },
                                {
                                    question: "Em textos argumentativos, a tese e:",
                                    options: ["O titulo", "A opiniao central defendida", "A biografia do autor", "A conclusao obrigatoria"],
                                    correct: 1,
                                    difficulty: 2,
                                    explanation: "A tese e o ponto de vista central do texto."
                                }
                            ],
                            gramatica: [
                                {
                                    question: "Qual e o plural correto de 'pao'?",
                                    options: ["paos", "paoes", "paes", "paeses"],
                                    correct: 2,
                                    difficulty: 1,
                                    explanation: "O plural consagrado e 'paes'."
                                },
                                {
                                    question: "Na frase 'Eles chegaram cedo', 'cedo' e:",
                                    options: ["substantivo", "adverbio", "adjetivo", "verbo"],
                                    correct: 1,
                                    difficulty: 2,
                                    explanation: "Cedo modifica o verbo chegaram, logo e adverbio."
                                },
                                {
                                    question: "Em 'A menina inteligente estudou', 'inteligente' funciona como:",
                                    options: ["verbo", "adverbio", "artigo", "adjetivo"],
                                    correct: 3,
                                    difficulty: 2,
                                    explanation: "Adjetivo caracteriza o substantivo."
                                }
                            ],
                            literatura: [
                                {
                                    question: "Uma caracteristica comum do Modernismo brasileiro e:",
                                    options: ["linguagem engessada", "valorizacao da linguagem coloquial", "imitar sempre o passado", "rejeitar temas nacionais"],
                                    correct: 1,
                                    difficulty: 3,
                                    explanation: "O Modernismo aproximou a lingua do uso brasileiro."
                                },
                                {
                                    question: "O eu lirico aparece com mais frequencia em:",
                                    options: ["poemas", "editais", "bulas", "formularios"],
                                    correct: 0,
                                    difficulty: 1,
                                    explanation: "O eu lirico e uma voz tipica da poesia."
                                }
                            ]
                        }
                    },
                    biologia: {
                        label: "Biologia",
                        topics: {
                            ecologia: [
                                {
                                    question: "Conjunto de seres vivos da mesma especie em uma area e chamado de:",
                                    options: ["bioma", "ecossistema", "populacao", "biosfera"],
                                    correct: 2,
                                    difficulty: 1,
                                    explanation: "Populacao reune individuos da mesma especie."
                                },
                                {
                                    question: "Fotossintese e importante porque:",
                                    options: ["remove o solo", "produz materia organica", "substitui respiracao", "elimina agua"],
                                    correct: 1,
                                    difficulty: 1,
                                    explanation: "A fotossintese gera materia organica e libera oxigenio."
                                }
                            ],
                            genetica: [
                                {
                                    question: "A unidade basica da hereditariedade e:",
                                    options: ["celula", "gene", "tecido", "ribossomo"],
                                    correct: 1,
                                    difficulty: 2,
                                    explanation: "O gene carrega informacoes hereditarias."
                                },
                                {
                                    question: "Genes alelos ocupam:",
                                    options: ["organismos diferentes", "locais diferentes em cromossomos distintos", "o mesmo locus em cromossomos homlogos", "apenas celulas nervosas"],
                                    correct: 2,
                                    difficulty: 3,
                                    explanation: "Alelos ocupam o mesmo locus nos cromossomos homlogos."
                                }
                            ]
                        }
                    }
                }
            },
            OAB: {
                label: "OAB / Concurso",
                subjects: {
                    constitucional: {
                        label: "Constitucional",
                        topics: {
                            direitos_fundamentais: [
                                {
                                    question: "A liberdade de expressao pode ser classificada como direito:",
                                    options: ["social", "politico", "fundamental individual", "tributario"],
                                    correct: 2,
                                    difficulty: 2,
                                    explanation: "A liberdade de expressao integra o rol de direitos fundamentais."
                                },
                                {
                                    question: "O mandado de seguranca protege direito:",
                                    options: ["difuso sem titular", "liquido e certo", "somente penal", "somente eleitoral"],
                                    correct: 1,
                                    difficulty: 3,
                                    explanation: "O mandado de seguranca protege direito liquido e certo."
                                }
                            ],
                            organizacao_estado: [
                                {
                                    question: "No federalismo brasileiro, os estados possuem:",
                                    options: ["soberania", "autonomia", "supremacia internacional", "poder moderador"],
                                    correct: 1,
                                    difficulty: 2,
                                    explanation: "Estados possuem autonomia, nao soberania."
                                },
                                {
                                    question: "Intervencao federal e medida:",
                                    options: ["sempre livre", "vedada pela Constituicao", "excepcional", "automaticamente anual"],
                                    correct: 2,
                                    difficulty: 3,
                                    explanation: "A intervencao e excepcional e exige hipoteses constitucionais."
                                }
                            ]
                        }
                    },
                    administrativo: {
                        label: "Administrativo",
                        topics: {
                            atos_administrativos: [
                                {
                                    question: "Atributo que permite execucao direta do ato em alguns casos e:",
                                    options: ["presuncao de legitimidade", "imperatividade", "autoexecutoriedade", "tipicidade"],
                                    correct: 2,
                                    difficulty: 2,
                                    explanation: "Autoexecutoriedade permite execucao direta pela administracao."
                                },
                                {
                                    question: "Motivo do ato administrativo corresponde a:",
                                    options: ["forma do ato", "fundamento de fato e de direito", "autoridade competente", "finalidade privada"],
                                    correct: 1,
                                    difficulty: 2,
                                    explanation: "Motivo sao as razoes de fato e de direito do ato."
                                }
                            ],
                            licitacoes: [
                                {
                                    question: "O principio da isonomia na licitacao busca:",
                                    options: ["favorecer fornecedor local", "igualdade entre concorrentes", "dispensar edital sempre", "eliminar competitividade"],
                                    correct: 1,
                                    difficulty: 3,
                                    explanation: "Isonomia garante igualdade de tratamento entre os licitantes."
                                },
                                {
                                    question: "A contratacao direta sem licitacao ocorre nas hipoteses legais de:",
                                    options: ["dispensa ou inexigibilidade", "somente pregao", "somente leilao", "concorrencia simplificada"],
                                    correct: 0,
                                    difficulty: 3,
                                    explanation: "Dispensa e inexigibilidade sao as hipoteses classicas."
                                }
                            ]
                        }
                    },
                    penal: {
                        label: "Penal",
                        topics: {
                            teoria_do_crime: [
                                {
                                    question: "Pelo principio da legalidade, nao ha crime sem:",
                                    options: ["dolo", "culpa", "lei anterior", "vitima"],
                                    correct: 2,
                                    difficulty: 2,
                                    explanation: "A lei anterior e indispensavel para definir crime."
                                },
                                {
                                    question: "Tipicidade significa a adequacao do fato:",
                                    options: ["a moral social", "ao tipo penal", "ao costume", "ao processo civil"],
                                    correct: 1,
                                    difficulty: 2,
                                    explanation: "Tipicidade e a correspondencia ao tipo penal."
                                }
                            ],
                            penas: [
                                {
                                    question: "Pena restritiva de direitos pode substituir privativa de liberdade quando:",
                                    options: ["sempre", "presentes requisitos legais", "nunca", "houver reincidencia especifica grave obrigatoria"],
                                    correct: 1,
                                    difficulty: 3,
                                    explanation: "A substituicao depende dos requisitos previstos em lei."
                                },
                                {
                                    question: "A finalidade preventiva da pena busca:",
                                    options: ["somente arrecadar", "evitar novas infracoes", "substituir a policia", "anular o processo"],
                                    correct: 1,
                                    difficulty: 2,
                                    explanation: "Prevencao visa reduzir a reincidencia e desestimular crimes."
                                }
                            ]
                        }
                    }
                }
            },
            QUIZ: {
                label: "Quiz leve",
                subjects: {
                    cultura_geral: {
                        label: "Cultura geral",
                        topics: {
                            mundo: [
                                {
                                    question: "Qual pais tem Brasilia como capital?",
                                    options: ["Brasil", "Portugal", "Argentina", "Chile"],
                                    correct: 0,
                                    difficulty: 1,
                                    explanation: "Brasilia e a capital do Brasil."
                                },
                                {
                                    question: "O maior oceano do planeta e o:",
                                    options: ["Atlantico", "Pacifico", "Indico", "Artico"],
                                    correct: 1,
                                    difficulty: 1,
                                    explanation: "O Oceano Pacifico e o maior do mundo."
                                }
                            ],
                            ciencia: [
                                {
                                    question: "A agua ferve ao nivel do mar perto de:",
                                    options: ["50 C", "75 C", "100 C", "150 C"],
                                    correct: 2,
                                    difficulty: 1,
                                    explanation: "Em condicoes padrao, a fervura ocorre a 100 C."
                                },
                                {
                                    question: "Planeta conhecido como planeta vermelho:",
                                    options: ["Venus", "Marte", "Jupiter", "Mercurio"],
                                    correct: 1,
                                    difficulty: 1,
                                    explanation: "Marte recebe esse apelido pela cor avermelhada."
                                }
                            ]
                        }
                    },
                    logica: {
                        label: "Logica",
                        topics: {
                            padroes: [
                                {
                                    question: "Qual numero completa a sequencia 2, 4, 8, 16, ...?",
                                    options: ["18", "24", "30", "32"],
                                    correct: 3,
                                    difficulty: 1,
                                    explanation: "A sequencia dobra a cada passo."
                                },
                                {
                                    question: "Se todos os A sao B e todo B e C, entao:",
                                    options: ["algum A nao e C", "todo A e C", "nenhum A e C", "todo C e A"],
                                    correct: 1,
                                    difficulty: 2,
                                    explanation: "A relacao se propaga: todo A tambem e C."
                                }
                            ],
                            rapido: [
                                {
                                    question: "Qual numero vem antes de 100?",
                                    options: ["98", "99", "101", "90"],
                                    correct: 1,
                                    difficulty: 1,
                                    explanation: "O antecessor de 100 e 99."
                                },
                                {
                                    question: "Tres pessoas levam tres minutos para resolver tres problemas identicos. Quanto tempo para uma pessoa resolver um problema?",
                                    options: ["1 minuto", "3 minutos", "6 minutos", "9 minutos"],
                                    correct: 1,
                                    difficulty: 2,
                                    explanation: "Cada pessoa resolve um problema em tres minutos."
                                }
                            ]
                        }
                    },
                    entretenimento: {
                        label: "Entretenimento",
                        topics: {
                            cinema: [
                                {
                                    question: "Em uma producao audiovisual, quem normalmente coordena a visao artistica do filme?",
                                    options: ["diretor", "contador", "auditor", "mecanico"],
                                    correct: 0,
                                    difficulty: 1,
                                    explanation: "A direcao conduz a visao artistica da obra."
                                },
                                {
                                    question: "A trilha sonora de um filme ajuda principalmente a:",
                                    options: ["reduzir a duracao", "criar atmosfera", "substituir atores", "apagar o roteiro"],
                                    correct: 1,
                                    difficulty: 1,
                                    explanation: "A trilha fortalece clima, ritmo e emocao."
                                }
                            ],
                            series: [
                                {
                                    question: "Em series, o episodio piloto costuma servir para:",
                                    options: ["encerrar a trama", "apresentar o universo da historia", "dispensar personagens", "substituir a temporada"],
                                    correct: 1,
                                    difficulty: 1,
                                    explanation: "O piloto apresenta tom, personagens e conflito."
                                },
                                {
                                    question: "Um cliffhanger e um recurso usado para:",
                                    options: ["eliminar a trilha", "fechar todas as pontas", "criar suspense para o proximo episodio", "trocar a emissora"],
                                    correct: 2,
                                    difficulty: 2,
                                    explanation: "Cliffhanger deixa gancho e expectativa."
                                }
                            ]
                        }
                    }
                }
            }
        }
    },

    init() {
        QuestionsStore.load();
        QuestionsContext.load();
        QuestionsState.init();
        QuestionsUI.init(this);
        this.syncContext();
        this.openLauncher();
    },

    getTrackConfig(trackKey = null) {
        const ctx =
            QuestionsContext.get();
        const key =
            trackKey || ctx.track;

        return (
            this.data.tracks[key] ||
            this.data.tracks.enem
        );
    },

    getBaseCatalog(baseKey = null) {
        const ctx =
            QuestionsContext.get();

        return (
            this.data.questionsDB[
                baseKey || ctx.base
            ] || null
        );
    },

    syncContext() {
        const snapshot =
            QuestionsContext.get();
        const track =
            this.getTrackConfig(
                snapshot.track
            );
        const base =
            this.getBaseCatalog(
                track.baseKey
            );
        const subjectKeys =
            Object.keys(
                base?.subjects || {}
            );

        let focus =
            snapshot.focus;

        if (
            !subjectKeys.includes(focus)
        ) {
            focus =
                track.defaultFocus &&
                subjectKeys.includes(
                    track.defaultFocus
                )
                    ? track.defaultFocus
                    : (subjectKeys[0] || "");
        }

        const topicKeys =
            Object.keys(
                base?.subjects?.[focus]
                    ?.topics || {}
            );

        let topics =
            Array.isArray(
                snapshot.topics
            )
                ? snapshot.topics.filter(
                    (topicKey) =>
                        topicKeys.includes(
                            topicKey
                        )
                )
                : [];

        const mission =
            this.data.missions[
                snapshot.mission
            ]
                ? snapshot.mission
                : "topic";

        if (
            mission === "topic" &&
            !topics.length &&
            topicKeys.length
        ) {
            topics = [topicKeys[0]];
        }

        let sessionSize =
            this.data.sessionSizes.includes(
                snapshot.sessionSize
            )
                ? snapshot.sessionSize
                : track.defaultSessionSize;

        if (
            mission === "quick" &&
            sessionSize > 8
        ) {
            sessionSize = 5;
        }

        QuestionsContext.replace({
            ...snapshot,
            track: track.key,
            base: track.baseKey,
            mission,
            focus,
            topics,
            sessionSize
        });

        return QuestionsContext.get();
    },

    updateContext(patch = {}) {
        const current =
            QuestionsContext.get();
        const next = {
            ...current,
            ...(patch || {})
        };

        if (
            Object.prototype.hasOwnProperty.call(
                patch,
                "track"
            )
        ) {
            const track =
                this.getTrackConfig(
                    patch.track
                );

            next.base = track.baseKey;
            next.focus =
                track.defaultFocus ||
                next.focus;
            next.topics = [];
        }

        if (
            Object.prototype.hasOwnProperty.call(
                patch,
                "focus"
            )
        ) {
            next.topics = [];
        }

        if (
            Object.prototype.hasOwnProperty.call(
                patch,
                "mission"
            ) &&
            patch.mission === "quick"
        ) {
            next.sessionSize = 5;
        }

        QuestionsContext.replace(
            next,
            false
        );
        this.syncContext();
        this.render();
    },

    toggleTopic(topicKey) {
        const ctx =
            QuestionsContext.get();
        const currentTopics =
            Array.isArray(ctx.topics)
                ? [...ctx.topics]
                : [];
        const nextTopics =
            currentTopics.includes(topicKey)
                ? currentTopics.filter(
                    (item) =>
                        item !== topicKey
                )
                : [
                    ...currentTopics,
                    topicKey
                ];

        this.updateContext({
            topics: nextTopics
        });
    },

    getRuntimeNotice() {
        return this.runtimeNotice || "";
    },

    clearRuntimeNotice() {
        this.runtimeNotice = "";
    },

    startSession() {
        this.syncContext();

        const list =
            QuestionsService.buildSession(
                this
            );

        if (!list.length) {
            this.runtimeNotice =
                "Ainda nao ha questoes suficientes nesse recorte. Ajuste a rota e tente de novo.";
            this.openLauncher();
            return;
        }

        this.clearRuntimeNotice();

        QuestionsState.startSession(
            list,
            QuestionsService.getRouteSummary(
                this
            )
        );

        QuestionsUI.render();
    },

    openLauncher() {
        QuestionsState.openLauncher();
        this.render();
    },

    render() {
        this.syncContext();
        QuestionsUI.render();
    }
};
