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
        "pdf-workbench",
        "learn-map",
        "block",
        "practice",
        "quiz",
        "true-false",
        "flashcards",
        "mini-exam",
        "exam-result",
        "level-exam",
        "premium-checkout",
        "premium-library",
        "trail"
    ];

    const STEP_META = {
        entry: {
            title: "Seu PDF vira uma rota clara ate a prova.",
            titleClass: "premium-stage-title-editorial premium-stage-title-entry",
            titleHtml: [
                '<span class="premium-stage-line premium-stage-line-soft premium-stage-line-shift-1">Seu PDF</span>',
                '<span class="premium-stage-line premium-stage-line-emphasis premium-stage-line-shift-2">vira uma rota</span>',
                '<span class="premium-stage-line premium-stage-line-tail premium-stage-line-shift-3">clara ate a prova.</span>'
            ].join(""),
            subtitle: "Carregue o material e comece uma trilha montada para o seu objetivo.",
            label: "Entrada premium",
            showKicker: false,
            backVisible: false,
            progressVisible: false,
            showSummary: false
        },
        "exam-date": {
            title: "Qual e a data da sua prova?",
            titleClass: "premium-stage-title-editorial premium-stage-title-date",
            titleHtml: [
                '<span class="premium-stage-line premium-stage-line-soft premium-stage-line-shift-1">Qual e a data</span>',
                '<span class="premium-stage-line premium-stage-line-emphasis premium-stage-line-shift-3">da sua prova?</span>'
            ].join(""),
            subtitle: "Escolha a data para o sistema definir a intensidade da trilha.",
            label: "Data da prova",
            backVisible: true,
            progressVisible: true,
            progress: 26,
            showSummary: false
        },
        "target-score": {
            title: "Qual nota voce quer buscar?",
            titleClass: "premium-stage-title-editorial premium-stage-title-score",
            titleHtml: [
                '<span class="premium-stage-line premium-stage-line-soft premium-stage-line-shift-1">Qual nota</span>',
                '<span class="premium-stage-line premium-stage-line-emphasis premium-stage-line-shift-2">voce quer</span>',
                '<span class="premium-stage-line premium-stage-line-tail premium-stage-line-shift-3">buscar?</span>'
            ].join(""),
            subtitle: "Defina a meta para que o plano ajuste foco, ritmo e profundidade.",
            label: "Meta de nota",
            backVisible: true,
            progressVisible: true,
            progress: 52,
            showSummary: false
        },
        "study-time": {
            title: "Quanto tempo por dia voce vai ter?",
            titleClass: "premium-stage-title-editorial premium-stage-title-time",
            titleHtml: [
                '<span class="premium-stage-line premium-stage-line-soft premium-stage-line-shift-1">Quanto tempo</span>',
                '<span class="premium-stage-line premium-stage-line-emphasis premium-stage-line-shift-2">por dia</span>',
                '<span class="premium-stage-line premium-stage-line-tail premium-stage-line-shift-3">voce vai ter?</span>'
            ].join(""),
            subtitle: "Ajuste horas e minutos para que o plano respeite sua rotina real.",
            label: "Tempo diario",
            backVisible: true,
            progressVisible: true,
            progress: 78,
            showSummary: false
        },
        analysis: {
            title: "RotaNota esta montando o melhor caminho para voce.",
            titleClass: "premium-stage-title-editorial premium-stage-title-analysis",
            titleHtml: [
                '<span class="premium-stage-line premium-stage-line-soft premium-stage-line-shift-1">RotaNota</span>',
                '<span class="premium-stage-line premium-stage-line-emphasis premium-stage-line-shift-2">monta o melhor</span>',
                '<span class="premium-stage-line premium-stage-line-tail premium-stage-line-shift-3">caminho para voce.</span>'
            ].join(""),
            subtitle: "Agora o sistema transforma suas escolhas em uma trilha mais objetiva e focada na sua meta.",
            label: "",
            backVisible: false,
            progressVisible: false,
            showKicker: false,
            showSummary: false
        },
        "mode-select": {
            title: "Como voce quer começar agora?",
            titleClass: "premium-stage-title-editorial premium-stage-title-mode",
            titleHtml: [
                '<span class="premium-stage-line premium-stage-line-soft premium-stage-line-shift-1">Como voce quer</span>',
                '<span class="premium-stage-line premium-stage-line-emphasis premium-stage-line-shift-2">comecar</span>',
                '<span class="premium-stage-line premium-stage-line-tail premium-stage-line-shift-3">agora?</span>'
            ].join(""),
            subtitle: "Escolha o jeito mais natural para entrar no conteudo neste momento.",
            label: "Modo inicial",
            backVisible: true,
            progressVisible: false,
            showSummary: true,
            scrollable: true
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
        "pdf-workbench": {
            title: "PDF em Texto",
            subtitle: "Abra a base textual extraida do material para revisar, editar, grifar e reaproveitar nos outros modos.",
            label: "PDF em Texto",
            backVisible: true,
            progressVisible: false,
            showSummary: false,
            scrollable: false,
            hideHeading: true,
            showKicker: false
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
            subtitle: "Use o resultado para decidir se volta para aprender, treina mais ou segue.",
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
        "level-exam": {
            title: "Prova de nivel premium",
            subtitle: "Escolha a quantidade de questoes e meca sua prontidao geral no material.",
            label: "Prova premium",
            backVisible: true,
            progressVisible: false,
            showSummary: false,
            scrollable: true,
            hideHeading: true
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

            if (step === "pdf-workbench") {
                return this.goTo(state.workspaceMode === "convert" ? "entry" : "mode-select");
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

            if (step === "level-exam") {
                return this.goTo("mode-select");
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
