(function () {
    if (window.PremiumStudyStore) {
        return;
    }

    const defaultTopics = [
        { id: "topic-1", title: "Estrutura atomica essencial", emphasis: "alta" },
        { id: "topic-2", title: "Modelos atomicos e comparacoes", emphasis: "media" },
        { id: "topic-3", title: "Distribuicao eletronica e valencia", emphasis: "alta" },
        { id: "topic-4", title: "Numeros quanticos e leitura de tabela", emphasis: "media" }
    ];

    const defaultBlocks = [
        {
            id: "block-1",
            title: "Bloco recomendado",
            subtitle: "Comece pelo que mais impacta seu resultado.",
            duration: "32 min",
            status: "recommended",
            topics: ["Estrutura atomica essencial", "Modelos atomicos e comparacoes"]
        },
        {
            id: "block-2",
            title: "Fixacao orientada",
            subtitle: "Consolide definicoes e relacoes mais cobradas.",
            duration: "24 min",
            status: "ready",
            topics: ["Distribuicao eletronica e valencia"]
        },
        {
            id: "block-3",
            title: "Reta final",
            subtitle: "Revise pegadinhas e linguagem de prova.",
            duration: "18 min",
            status: "ready",
            topics: ["Numeros quanticos e leitura de tabela"]
        }
    ];

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function createState() {
        return {
            step: "landing",
            previousStep: null,
            planName: "Plano premium personalizado",
            materialName: "",
            materialSizeLabel: "",
            isExampleMaterial: false,
            examCountdown: "14",
            examDate: "",
            objective: "equilibrado",
            analysisProgress: 12,
            analysisStatus: "pending",
            topics: clone(defaultTopics),
            blocks: clone(defaultBlocks),
            activeBlockId: "block-1",
            blockTab: "aprender",
            showPlansPanel: false,
            sessionNote: "Seu espaco vai se moldando conforme suas escolhas.",
            progressLabel: "Seu plano esta comecando a ganhar forma."
        };
    }

    window.PremiumStudyStore = {
        state: createState(),

        reset() {
            this.state = createState();
        },

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

        setMaterial(fileLike) {
            if (!fileLike) {
                return this.state;
            }

            const sizeInMb = typeof fileLike.size === "number"
                ? `${(fileLike.size / (1024 * 1024)).toFixed(1)} MB`
                : "PDF textual";

            this.state = {
                ...this.state,
                materialName: fileLike.name || "material.pdf",
                materialSizeLabel: sizeInMb,
                isExampleMaterial: false,
                progressLabel: "Material recebido. Agora vamos calibrar o plano para sua prova."
            };

            return this.state;
        },

        useExampleMaterial() {
            this.state = {
                ...this.state,
                materialName: "apostila-quimica-estrutura-atomica.pdf",
                materialSizeLabel: "8 paginas",
                isExampleMaterial: true,
                progressLabel: "Exemplo carregado. O fluxo ja pode seguir para o planejamento."
            };

            return this.state;
        },

        setObjective(objective) {
            const labels = {
                "reta-final": "Reta final ativada. Vamos priorizar pontos quentes e treino.",
                equilibrado: "Plano equilibrado escolhido. Cobertura e pratica vao andar juntas.",
                aprofundado: "Plano aprofundado selecionado. Mais contexto, blocos e revisoes."
            };

            this.state = {
                ...this.state,
                objective,
                progressLabel: labels[objective] || labels.equilibrado
            };

            return this.state;
        },

        setCountdown(countdown) {
            this.state = {
                ...this.state,
                examCountdown: countdown,
                progressLabel: `Prazo ajustado para ${countdown} dias. O plano vai refletir essa urgencia.`
            };

            return this.state;
        },

        setExamDate(date) {
            this.state = {
                ...this.state,
                examDate: date
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

        updateTopic(id, title) {
            this.state = {
                ...this.state,
                topics: this.state.topics.map((topic) => (
                    topic.id === id
                        ? { ...topic, title }
                        : topic
                ))
            };

            return this.state;
        },

        addTopic() {
            const nextIndex = this.state.topics.length + 1;
            const id = `topic-${Date.now()}`;
            this.state = {
                ...this.state,
                topics: [
                    ...this.state.topics,
                    {
                        id,
                        title: `Novo topico ${nextIndex}`,
                        emphasis: "media"
                    }
                ]
            };

            return this.state;
        },

        removeTopic(id) {
            const nextTopics = this.state.topics.filter((topic) => topic.id !== id);
            this.state = {
                ...this.state,
                topics: nextTopics.length ? nextTopics : clone(defaultTopics)
            };

            return this.state;
        },

        togglePlansPanel(forceValue) {
            this.state = {
                ...this.state,
                showPlansPanel: typeof forceValue === "boolean"
                    ? forceValue
                    : !this.state.showPlansPanel
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

        setBlockTab(tab) {
            this.state = {
                ...this.state,
                blockTab: tab
            };
            return this.state;
        },

        regenerateBlocks() {
            const blocks = this.state.topics.slice(0, 3).map((topic, index) => ({
                id: `block-regenerated-${index + 1}`,
                title: index === 0 ? "Novo recomendado" : `Bloco ${index + 1}`,
                subtitle: `Construido a partir de ${topic.title.toLowerCase()}.`,
                duration: `${22 + (index * 8)} min`,
                status: index === 0 ? "recommended" : "ready",
                topics: [topic.title]
            }));

            this.state = {
                ...this.state,
                blocks,
                activeBlockId: blocks[0].id,
                progressLabel: "Plano refeito. A trilha agora acompanha seus topicos mais recentes."
            };

            return this.state;
        },

        getActiveBlock() {
            return this.state.blocks.find((block) => block.id === this.state.activeBlockId) || this.state.blocks[0];
        }
    };
})();
