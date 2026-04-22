(function () {
    if (window.PremiumStudyRouter) {
        return;
    }

    const STEP_ORDER = [
        "landing",
        "new-plan",
        "exam-setup",
        "analysis",
        "topics",
        "plan",
        "block"
    ];

    const STEP_META = {
        landing: {
            title: "Estudo premium orientado para voce",
            subtitle: "Carregue o material, defina o prazo e acompanhe uma trilha pensada para o seu ritmo.",
            progress: 8,
            label: "Entrada premium",
            backVisible: false
        },
        "new-plan": {
            title: "Adicione seu material de estudo",
            subtitle: "Comece com um PDF textual e leve para o sistema montar um fluxo sob medida.",
            progress: 24,
            label: "Material",
            backVisible: true
        },
        "exam-setup": {
            title: "Defina o contexto da sua prova",
            subtitle: "Prazo e objetivo ajustam profundidade, ritmo e foco da trilha.",
            progress: 42,
            label: "Configuracao",
            backVisible: true
        },
        analysis: {
            title: "Montando seu estudo personalizado",
            subtitle: "O sistema organiza o material e prepara uma progressao mais direcionada.",
            progress: 58,
            label: "Analise",
            backVisible: true
        },
        topics: {
            title: "Revise os topicos detectados",
            subtitle: "Confirme, renomeie ou enxugue os assuntos antes de gerar o plano.",
            progress: 72,
            label: "Topicos",
            backVisible: true
        },
        plan: {
            title: "Seu plano premium esta pronto",
            subtitle: "Cada bloco abre um caminho claro entre aprender, praticar e simular.",
            progress: 88,
            label: "Plano",
            backVisible: true
        },
        block: {
            title: "Bloco personalizado",
            subtitle: "Uma tela por vez, com foco no proximo passo e no que mais rende para voce.",
            progress: 100,
            label: "Bloco",
            backVisible: true
        }
    };

    window.PremiumStudyRouter = {
        getSteps() {
            return STEP_ORDER.slice();
        },

        getMeta(step) {
            return STEP_META[step] || STEP_META.landing;
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
            const index = STEP_ORDER.indexOf(step);
            const previousStep = STEP_ORDER[Math.max(index - 1, 0)];
            return this.goTo(previousStep);
        },

        canGoBack(step) {
            const meta = this.getMeta(step);
            return Boolean(meta.backVisible);
        }
    };
})();
