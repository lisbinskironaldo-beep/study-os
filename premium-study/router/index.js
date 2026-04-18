(function () {
    if (window.PremiumStudyRouter) {
        return;
    }

    const STEP_ORDER = [
        "entry",
        "exam-date",
        "target-score",
        "study-time",
        "analysis",
        "mode-select",
        "highlight-preview",
        "learn-map",
        "block",
        "practice",
        "quiz",
        "true-false",
        "flashcards",
        "mini-exam",
        "exam-result",
        "premium-checkout",
        "premium-library",
        "trail"
    ];

    const STEP_META = {
        entry: {
            title: "RotaNota transforma seu PDF em uma rota para a prova.",
            subtitle: "Tudo comeca no seu material. Depois disso, cada etapa ajusta a trilha ao seu prazo e a sua meta.",
            label: "Entrada RotaNota",
            backVisible: false,
            progressVisible: false,
            showSummary: false
        },
        "exam-date": {
            title: "Qual a data da prova?",
            subtitle: "Escolha a data para o sistema definir a intensidade da trilha.",
            label: "Data da prova",
            backVisible: true,
            progressVisible: true,
            progress: 26,
            showSummary: false
        },
        "target-score": {
            title: "Qual nota voce quer tirar?",
            subtitle: "Defina a meta para que o plano ajuste foco, ritmo e profundidade.",
            label: "Meta de nota",
            backVisible: true,
            progressVisible: true,
            progress: 52,
            showSummary: false
        },
        "study-time": {
            title: "Quanto tempo por dia voce vai ter para estudar?",
            subtitle: "Ajuste horas e minutos para que o plano respeite sua rotina real.",
            label: "Tempo diario",
            backVisible: true,
            progressVisible: true,
            progress: 78,
            showSummary: false
        },
        analysis: {
            title: "RotaNota esta montando o melhor caminho para voce.",
            subtitle: "Agora o sistema transforma suas escolhas em uma trilha mais objetiva e focada na sua meta.",
            label: "Processamento",
            backVisible: false,
            progressVisible: false,
            showSummary: false
        },
        "mode-select": {
            title: "Como voce quer comecar agora?",
            subtitle: "Escolha o jeito mais natural para entrar no conteudo neste momento.",
            label: "Modo inicial",
            backVisible: true,
            progressVisible: false,
            showSummary: true
        },
        "highlight-preview": {
            title: "Documento com marcador de texto",
            subtitle: "O material aparece inteiro, com destaque apenas nas partes mais importantes para orientar sua leitura.",
            label: "Marcar texto",
            backVisible: true,
            progressVisible: false,
            showSummary: false,
            scrollable: true
        },
        "learn-map": {
            title: "Escolha o assunto por onde quer comecar.",
            subtitle: "Cada assunto abre um resumo focado no resultado e voce pode avancar para o proximo direto de la.",
            label: "Aprender",
            backVisible: true,
            progressVisible: false,
            showSummary: false,
            scrollable: true
        },
        block: {
            title: "Resumo focado do assunto.",
            subtitle: "Entenda este assunto em tela cheia, com foco direto no resultado da prova.",
            label: "Aprender",
            backVisible: true,
            progressVisible: false,
            showSummary: false,
            scrollable: true,
            hideHeading: true
        },
        practice: {
            title: "Como voce quer praticar este bloco?",
            subtitle: "Escolha um formato curto para consolidar o que acabou de estudar.",
            label: "Pratica",
            backVisible: true,
            progressVisible: false,
            showSummary: false,
            scrollable: true
        },
        quiz: {
            title: "Questionario orientado",
            subtitle: "Uma questao por vez, com leitura limpa e correcao objetiva.",
            label: "Questionario",
            backVisible: true,
            progressVisible: false,
            showSummary: false,
            scrollable: true,
            hideHeading: true
        },
        "true-false": {
            title: "Verdadeiro ou falso",
            subtitle: "Teste formulacoes parecidas e veja onde a banca pode confundir voce.",
            label: "V ou F",
            backVisible: true,
            progressVisible: false,
            showSummary: false,
            scrollable: true,
            hideHeading: true
        },
        flashcards: {
            title: "Flashcards do bloco",
            subtitle: "Revise termos e relacoes em ciclos curtos de memorizacao.",
            label: "Flashcards",
            backVisible: true,
            progressVisible: false,
            showSummary: false,
            scrollable: true,
            hideHeading: true
        },
        "mini-exam": {
            title: "Mini prova do bloco",
            subtitle: "Teste seu rendimento agora com foco no bloco atual.",
            label: "Mini prova",
            backVisible: true,
            progressVisible: false,
            showSummary: false,
            scrollable: true,
            hideHeading: true
        },
        "exam-result": {
            title: "Seu resultado do bloco",
            subtitle: "Use o resultado para decidir se volta para aprender, pratica mais ou segue.",
            label: "Resultado",
            backVisible: true,
            progressVisible: false,
            showSummary: true,
            scrollable: true
        },
        "premium-library": {
            title: "Biblioteca premium",
            subtitle: "Aqui ficam todos os PDFs e estudos carregados para retomada, inclusive o mais recente.",
            label: "Biblioteca premium",
            backVisible: true,
            progressVisible: false,
            showSummary: false,
            scrollable: true
        },
        "premium-checkout": {
            title: "Plano premium",
            subtitle: "Libere continuidade, biblioteca e treinos extras sem poluir sua rotina de estudo.",
            label: "Premium",
            backVisible: true,
            progressVisible: false,
            showSummary: false,
            scrollable: true
        },
        trail: {
            title: "Sua trilha esta pronta para continuar.",
            subtitle: "Veja os blocos, retome seu ponto atual e avance com clareza.",
            label: "Sua trilha",
            backVisible: true,
            progressVisible: false,
            showSummary: true,
            scrollable: true
        }
    };

    window.PremiumStudyRouter = {
        getMeta(step) {
            return STEP_META[step] || STEP_META.entry;
        },

        goTo(step) {
            if (!STEP_ORDER.includes(step)) {
                return window.PremiumStudyStore.getState();
            }

            return window.PremiumStudyStore.setStep(step);
        },

        next(step) {
            const index = STEP_ORDER.indexOf(step);
            const nextStep = STEP_ORDER[Math.min(index + 1, STEP_ORDER.length - 1)];
            return this.goTo(nextStep);
        },

        previous(step) {
            const store = window.PremiumStudyStore;
            const state = store.getState();

            if (step === "mode-select") {
                return this.goTo("study-time");
            }

            if (step === "learn-map") {
                return this.goTo("mode-select");
            }

            if (step === "highlight-preview") {
                return this.goTo("mode-select");
            }

            if (step === "block") {
                return this.goTo("learn-map");
            }

            if (step === "practice") {
                return this.goTo(state.returnStep || "mode-select");
            }

            if (step === "quiz" || step === "true-false" || step === "flashcards") {
                return this.goTo("practice");
            }

            if (step === "mini-exam") {
                return this.goTo(state.returnStep || "mode-select");
            }

            if (step === "exam-result") {
                return this.goTo("mini-exam");
            }

            if (step === "premium-checkout") {
                return this.goTo(state.returnStep || "entry");
            }

            if (step === "premium-library") {
                return this.goTo("entry");
            }

            if (step === "trail") {
                return this.goTo("mode-select");
            }

            const index = STEP_ORDER.indexOf(step);
            const previousStep = STEP_ORDER[Math.max(index - 1, 0)];
            return this.goTo(previousStep);
        },

        canGoBack(step) {
            return Boolean(this.getMeta(step).backVisible);
        }
    };
})();
