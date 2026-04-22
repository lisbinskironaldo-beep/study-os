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

    function buildBlocks(studyTitle) {
        const material = studyTitle || "seu material";

        return [
            {
                id: "block-1",
                title: "Nucleo principal",
                subtitle: "Comece pelo que mais organiza o entendimento e reduz dispersao.",
                duration: "34 min",
                status: "recommended",
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
                    summary: `Este bloco isola o nucleo de ${material}, priorizando termos, definicoes e relacoes que ajudam voce a entrar no conteudo sem desperdiçar tempo.`,
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
                    flashcards: [
                        buildFlashcard(
                            "O que revisar primeiro neste bloco?",
                            "Os termos, definicoes e relacoes principais.",
                            "Comece pelo que organiza o resto."
                        ),
                        buildFlashcard(
                            "Qual erro comum precisa evitar?",
                            "Trocar regra por exemplo.",
                            "Regra, excecao e exemplo precisam estar separados."
                        ),
                        buildFlashcard(
                            "Qual leitura gera mais resultado?",
                            "A que conecta conceitos em vez de decorar itens isolados.",
                            "Relação vale mais do que lista solta."
                        )
                    ]
                },
                exam: {
                    questions: [
                        buildQuestion(
                            "Qual elemento mais orienta o bloco inicial de estudo?",
                            [
                                "Detalhe raro",
                                "Termo decorado sem contexto",
                                "Conceito central com criterio claro",
                                "Exemplo isolado"
                            ],
                            2,
                            "O bloco inicial se apoia no conceito central e no criterio que organiza o material."
                        ),
                        buildQuestion(
                            "Em uma alternativa de prova, o que mais denuncia confusao de base?",
                            [
                                "Separar definicao de exemplo",
                                "Usar o criterio de classificacao",
                                "Trocar conceito por aplicacao pratica",
                                "Comparar itens parecidos"
                            ],
                            2,
                            "Trocar conceito por aplicacao pratica e um erro muito comum quando a base esta fraca."
                        ),
                        buildQuestion(
                            "Qual revisao e mais eficiente antes de testar o rendimento?",
                            [
                                "Reler o resumo e os pontos quentes",
                                "Pular direto para o resultado",
                                "Ignorar os termos repetidos",
                                "Ler sem marcar criterios"
                            ],
                            0,
                            "Resumo e pontos quentes consolidam a estrutura antes do teste."
                        )
                    ]
                }
            },
            {
                id: "block-2",
                title: "Consolidacao objetiva",
                subtitle: "Aperte a retencao do que mais diferencia desempenho em questoes.",
                duration: "22 min",
                status: "ready",
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
                    flashcards: [
                        buildFlashcard(
                            "O que diferencia duas alternativas parecidas?",
                            "O criterio e a palavra-chave decisiva.",
                            "Procure o termo que muda o sentido."
                        ),
                        buildFlashcard(
                            "Como lidar com excecoes?",
                            "Separando-as visualmente da regra.",
                            "Misturar os dois aumenta a chance de erro."
                        ),
                        buildFlashcard(
                            "Qual erro mais comum neste bloco?",
                            "Responder por semelhanca superficial.",
                            "Leia a palavra que realmente decide."
                        )
                    ]
                },
                exam: {
                    questions: [
                        buildQuestion(
                            "Qual estrategia reduz mais o erro em comparacoes proximas?",
                            [
                                "Responder por memoria visual",
                                "Comparar criterio e palavra-chave",
                                "Ignorar termos pequenos",
                                "Pular excecoes"
                            ],
                            1,
                            "Criterio e palavra-chave sustentam a comparacao correta."
                        ),
                        buildQuestion(
                            "Qual sinal indica uma possivel pegadinha?",
                            [
                                "Tema conhecido",
                                "Enunciado longo",
                                "Pequena troca em termo decisivo",
                                "Alternativa curta"
                            ],
                            2,
                            "Pegadinhas reais costumam trocar termos decisivos."
                        ),
                        buildQuestion(
                            "O que mais protege o resultado final neste bloco?",
                            [
                                "Marcar excecoes e limites da regra",
                                "Ignorar contrastes",
                                "Ler sem comparar",
                                "Responder apenas pelo titulo"
                            ],
                            0,
                            "Separar excecoes e limites protege o desempenho em itens finos."
                        )
                    ]
                }
            }
        ];
    }

    function createQuizSession(items) {
        return {
            index: 0,
            answers: [],
            isComplete: false,
            completedAt: ""
        };
    }

    function createTrueFalseSession(items) {
        return {
            answers: {},
            submitted: false,
            score: null
        };
    }

    function createFlashcardSession(items) {
        return {
            index: 0,
            flipped: false,
            known: [],
            done: false
        };
    }

    function createMiniExamSession(items) {
        return {
            index: 0,
            answers: [],
            isComplete: false,
            result: null
        };
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
        const blocks = buildBlocks("");
        return {
            step: "entry",
            previousStep: null,
            returnStep: "mode-select",
            accessTier: "free",
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
            latestLocalStudy: null,
            savedDraftId: "",
            savedAt: "",
            sessionNote: "",
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

        setMaterial(fileLike) {
            if (!fileLike) {
                return this.state;
            }

            const sizeLabel = typeof fileLike.size === "number"
                ? `${(fileLike.size / (1024 * 1024)).toFixed(1)} MB`
                : "PDF textual";

            const studyTitle = buildStudyTitle(fileLike.name || "material.pdf");
            const blocks = buildBlocks(studyTitle);

            this.state = {
                ...this.state,
                materialName: fileLike.name || "material.pdf",
                materialSizeLabel: sizeLabel,
                studyTitle,
                blocks,
                sessions: buildSessions(blocks),
                activeBlockId: blocks[0].id,
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

        selectBlock(blockId) {
            this.state = {
                ...this.state,
                activeBlockId: blockId
            };

            return this.state;
        },

        getActiveBlock() {
            return this.state.blocks.find((block) => block.id === this.state.activeBlockId) || this.state.blocks[0];
        },

        getActiveSession(type) {
            const blockId = this.state.activeBlockId;
            return this.state.sessions[blockId] ? this.state.sessions[blockId][type] : null;
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

        resetActiveSession(type) {
            const block = this.getActiveBlock();
            const seeds = {
                quiz: createQuizSession(block.practice.quiz),
                trueFalse: createTrueFalseSession(block.practice.trueFalse),
                flashcards: createFlashcardSession(block.practice.flashcards),
                miniExam: createMiniExamSession(block.exam.questions)
            };
            return this.updateActiveSession(type, seeds[type]);
        },

        setQuizAnswer(answerIndex) {
            return this.updateActiveSession("quiz", (session) => {
                session.answers[session.index] = answerIndex;
                return session;
            });
        },

        advanceQuiz() {
            const block = this.getActiveBlock();
            return this.updateActiveSession("quiz", (session) => {
                if (session.index >= block.practice.quiz.length - 1) {
                    session.isComplete = true;
                    session.completedAt = new Date().toISOString();
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
            const block = this.getActiveBlock();
            return this.updateActiveSession("trueFalse", (session) => {
                let hits = 0;
                block.practice.trueFalse.forEach((item, index) => {
                    if (session.answers[index] === item.answer) {
                        hits += 1;
                    }
                });
                session.submitted = true;
                session.score = hits;
                return session;
            });
        },

        flipFlashcard() {
            return this.updateActiveSession("flashcards", (session) => {
                session.flipped = !session.flipped;
                return session;
            });
        },

        markFlashcard(known) {
            const block = this.getActiveBlock();
            return this.updateActiveSession("flashcards", (session) => {
                session.known[session.index] = known;
                session.flipped = false;
                if (session.index < block.practice.flashcards.length - 1) {
                    session.index += 1;
                } else {
                    session.done = true;
                }
                return session;
            });
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
                studyTitle: this.state.studyTitle,
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
                savedDraftId: this.state.savedDraftId,
                savedAt: this.state.savedAt,
                progressLabel: this.state.progressLabel
            };
        },

        restoreFromSnapshot(snapshot) {
            if (!snapshot) {
                return this.state;
            }

            const defaults = createState();
            const studyTitle = snapshot.studyTitle || buildStudyTitle(snapshot.materialName);
            const blocks = snapshot.blocks && snapshot.blocks.length
                ? snapshot.blocks
                : buildBlocks(studyTitle);
            const sessions = snapshot.sessions || buildSessions(blocks);
            const normalizedStep = snapshot.step === "analysis"
                ? "mode-select"
                : snapshot.step || "entry";

            this.state = {
                ...defaults,
                ...snapshot,
                step: normalizedStep,
                studyTitle,
                blocks,
                sessions,
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
