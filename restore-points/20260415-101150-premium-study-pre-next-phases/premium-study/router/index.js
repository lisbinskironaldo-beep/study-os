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
        "block"
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
            subtitle: "Tudo daqui em diante gira em torno do seu material, do seu prazo e da sua meta.",
            label: "Bloco",
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
            if (step === "mode-select") {
                return this.goTo("study-time");
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
