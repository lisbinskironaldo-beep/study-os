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
        "block",
        "practice",
        "quiz",
        "true-false",
        "flashcards",
        "mini-exam",
        "exam-result",
        "trail"
    ];

    const STEP_META = {
        entry: {
            title: "Carregue seu PDF para uma jornada personalizada para o seu objetivo.",
            subtitle: "Tudo comeca no seu material. Depois disso, cada etapa ajusta a trilha ao seu prazo e a sua meta.",
            label: "Entrada premium",
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
            title: "Estamos montando o melhor caminho para voce.",
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
        block: {
            title: "Seu bloco personalizado esta pronto.",
            subtitle: "Aprenda o nucleo do conteudo com foco direto em resultado.",
            label: "Aprender",
            backVisible: true,
            progressVisible: false,
            showSummary: true
        },
        practice: {
            title: "Como voce quer praticar este bloco?",
            subtitle: "Escolha um formato curto para consolidar o que acabou de estudar.",
            label: "Pratica",
            backVisible: true,
            progressVisible: false,
            showSummary: true
        },
        quiz: {
            title: "Questionario orientado",
            subtitle: "Uma questao por vez, com leitura limpa e correcao objetiva.",
            label: "Questionario",
            backVisible: true,
            progressVisible: false,
            showSummary: false
        },
        "true-false": {
            title: "Verdadeiro ou falso",
            subtitle: "Teste formulacoes parecidas e veja onde a banca pode confundir voce.",
            label: "V ou F",
            backVisible: true,
            progressVisible: false,
            showSummary: false
        },
        flashcards: {
            title: "Flashcards do bloco",
            subtitle: "Revise termos e relacoes em ciclos curtos de memorizacao.",
            label: "Flashcards",
            backVisible: true,
            progressVisible: false,
            showSummary: false
        },
        "mini-exam": {
            title: "Mini prova do bloco",
            subtitle: "Teste seu rendimento agora com foco no bloco atual.",
            label: "Mini prova",
            backVisible: true,
            progressVisible: false,
            showSummary: false
        },
        "exam-result": {
            title: "Seu resultado do bloco",
            subtitle: "Use o resultado para decidir se volta para aprender, pratica mais ou segue.",
            label: "Resultado",
            backVisible: true,
            progressVisible: false,
            showSummary: true
        },
        trail: {
            title: "Sua trilha esta pronta para continuar.",
            subtitle: "Veja os blocos, retome seu ponto atual e avance com clareza.",
            label: "Sua trilha",
            backVisible: true,
            progressVisible: false,
            showSummary: true
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

            if (step === "block") {
                return this.goTo("mode-select");
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
