(function () {
    if (window.PremiumStudyAccessControl) {
        return;
    }

    const ACCESS_STATES = {
        GUEST: "guest",
        REGISTERED_FREE: "registered_free",
        TRIAL: "trial",
        PREMIUM_ACTIVE: "premium_active",
        PREMIUM_GRACE: "premium_grace",
        PREMIUM_PAST_DUE: "premium_past_due",
        PREMIUM_CANCELLED: "premium_cancelled"
    };

    const FEATURES = {
        PDF_UPLOAD: "pdf_upload",
        LARGE_PDF_UPLOAD: "large_pdf_upload",
        SCANNED_PDF_TEXT: "scanned_pdf_text",
        RESUME_LATEST: "resume_latest",
        PREMIUM_LIBRARY: "premium_library",
        PRACTICE_EXTRA_SERIES: "practice_extra_series",
        MINI_EXAM_EXTRA: "mini_exam_extra",
        LEVEL_EXAM: "level_exam",
        AI_TEXT_HIGHLIGHT: "ai_text_highlight",
        HIGHLIGHT_EXPORT: "highlight_export",
        STATS: "stats",
        CLOUD_SYNC: "cloud_sync"
    };

    const PLAN_CATALOG = {
        free: {
            id: "free",
            label: "Grátis",
            pdfPageLimit: 8,
            latestStudyResume: true,
            practiceSeriesLimit: 3,
            miniExamBaseQuestions: 5,
            premiumLibrary: false,
            stats: false,
            cloudSync: false
        },
        premium: {
            id: "premium",
            label: "Premium",
            pdfPageLimit: Infinity,
            latestStudyResume: true,
            practiceSeriesLimit: Infinity,
            miniExamBaseQuestions: 5,
            premiumLibrary: true,
            stats: true,
            cloudSync: true
        }
    };

    const LOCK_MESSAGES = {
        [FEATURES.LARGE_PDF_UPLOAD]: {
            title: "PDF maior entra no premium",
            message: "Grátis continua liberado para PDFs textuais de até 8 páginas. No premium, materiais longos entram com divisão inteligente antes da IA."
        },
        [FEATURES.SCANNED_PDF_TEXT]: {
            title: "PDF escaneado vira texto no premium",
            message: "No grátis, PDFs textuais abrem no editor quando a leitura local funciona. Para converter PDF escaneado ou imagem em texto editável com IA, use o premium."
        },
        [FEATURES.PREMIUM_LIBRARY]: {
            title: "Biblioteca premium",
            message: "Retomar o último estudo continua grátis. Histórico completo, outros materiais e organização da biblioteca ficam no premium."
        },
        [FEATURES.PRACTICE_EXTRA_SERIES]: {
            title: "Extras liberados no premium",
            message: "As 3 séries grátis deste formato já foram usadas. No premium, você libera novas séries e reformulações por outra ótica."
        },
        [FEATURES.MINI_EXAM_EXTRA]: {
            title: "Mini provas extras no premium",
            message: "A mini prova base continua grátis. No premium, você gera novas questões e variações para o mesmo assunto."
        },
        [FEATURES.LEVEL_EXAM]: {
            title: "Prova de nivel premium",
            message: "A mini prova do bloco fica gratis. A prova de nivel com seletor de quantidade entra no premium."
        },
        [FEATURES.AI_TEXT_HIGHLIGHT]: {
            title: "Destaque com IA no premium",
            message: "O marca-texto manual continua livre. Para a IA localizar e destacar os trechos mais importantes do texto, use o premium."
        },
        [FEATURES.AI_TEXT_HIGHLIGHT]: {
            eyebrow: "IA no texto",
            title: "Deixe a IA destacar os trechos principais.",
            lead: "O editor segue livre para uso manual. No premium, a IA encontra e marca os pontos mais importantes com contexto.",
            benefits: [
                "Destaques automáticos com contexto"
            ],
            cta: "Liberar destaque com IA"
        },
        [FEATURES.HIGHLIGHT_EXPORT]: {
            title: "Exportação premium",
            message: "O marcador pode ser visualizado. Baixar PDF com destaques fica no premium."
        },
        [FEATURES.STATS]: {
            title: "Estatísticas premium",
            message: "Indicadores de evolução, pontos fracos e histórico completo entram no painel premium."
        },
        [FEATURES.CLOUD_SYNC]: {
            title: "Sincronização premium",
            message: "A continuidade local fica grátis. Sincronizar entre dispositivos entra no premium."
        }
    };

    LOCK_MESSAGES[FEATURES.SCANNED_PDF_TEXT] = {
        title: "Conversao premium de PDF ruim",
        message: "Use a ferramenta da home para converter PDF escaneado ou de baixa qualidade em texto editavel com IA."
    };

    LOCK_MESSAGES[FEATURES.AI_TEXT_HIGHLIGHT] = {
        title: "Destaque com IA no premium",
        message: "O marca-texto manual continua livre. Para a IA localizar e destacar os trechos mais importantes do texto, use o premium."
    };

    const PREMIUM_BENEFITS = [
        "PDF escaneado convertido em texto editavel",
        "PDFs longos com divisão inteligente",
        "Biblioteca completa de estudos",
        "Estatísticas de evolução e pontos fracos",
        "Questionários extras por assunto",
        "V/F extras para pegar pegadinhas",
        "Flashcards extras com mnemônicos",
        "Mini provas extras por assunto",
        "Prova de nivel com quantidade flexivel",
        "Exportação dos marcadores em PDF"
    ];

    const OFFER_COPY = {
        [FEATURES.PREMIUM_LIBRARY]: {
            eyebrow: "Biblioteca premium",
            title: "Seu estudo completo fica guardado.",
            lead: "Retome outros materiais, veja seu histórico e continue sem reconstruir a trilha.",
            benefits: [
                "Retomar PDFs além do último estudo"
            ],
            cta: "Liberar biblioteca premium"
        },
        [FEATURES.PRACTICE_EXTRA_SERIES]: {
            eyebrow: "Prática premium",
            title: "Treine até sentir segurança.",
            lead: "Depois das rodadas grátis, gere novas práticas por outros ângulos.",
            benefits: [
                "Novas rodadas do mesmo assunto"
            ],
            cta: "Liberar prática premium"
        },
        [FEATURES.MINI_EXAM_EXTRA]: {
            eyebrow: "Mini prova premium",
            title: "Teste o mesmo assunto de novo.",
            lead: "A mini prova base é grátis. O premium libera novas versões para medir domínio real.",
            benefits: [
                "Novas provas por bloco"
            ],
            cta: "Liberar mini provas extras"
        },
        [FEATURES.LEVEL_EXAM]: {
            eyebrow: "Prova premium",
            title: "Meça seu nivel com mais profundidade.",
            lead: "Escolha 10, 20 ou 30 questoes para validar se o material ja esta pronto para prova.",
            benefits: [
                "Teste de nivel com seletor"
            ],
            cta: "Liberar prova premium"
        },
        [FEATURES.HIGHLIGHT_EXPORT]: {
            eyebrow: "Marcador premium",
            title: "Leve seus destaques com você.",
            lead: "Exporte o resumo marcado ou o documento inteiro com grifos.",
            benefits: [
                "PDF só com pontos quentes"
            ],
            cta: "Liberar exportação"
        },
        [FEATURES.LARGE_PDF_UPLOAD]: {
            eyebrow: "Apostilas longas",
            title: "Use materiais grandes sem perder foco.",
            lead: "O sistema divide o conteúdo antes da IA para manter qualidade e custo sob controle.",
            benefits: [
                "Apostilas longas viram blocos claros"
            ],
            cta: "Liberar PDF maior"
        },
        [FEATURES.SCANNED_PDF_TEXT]: {
            eyebrow: "Conversor premium",
            title: "Converta PDF ruim em texto editavel.",
            lead: "Use a ferramenta separada da home para recuperar PDF escaneado ou de baixa qualidade direto no editor.",
            benefits: [
                "PDF ruim vira texto utilizavel"
            ],
            cta: "Liberar conversor premium"
        },
        default: {
            eyebrow: "Premium",
            title: "Desbloqueie o estudo completo.",
            lead: "Mais materiais, mais treino, mais controle e continuidade.",
            benefits: [
                "Modo completo de estudo"
            ],
            cta: "Conhecer premium"
        }
    };

    OFFER_COPY[FEATURES.AI_TEXT_HIGHLIGHT] = {
        eyebrow: "IA no texto",
        title: "Deixe a IA destacar os trechos principais.",
        lead: "O editor segue livre para uso manual. No premium, a IA encontra e marca os pontos mais importantes com contexto.",
        benefits: [
            "Destaques automaticos com contexto"
        ],
        cta: "Liberar destaque com IA"
    };

    function normalizeAccessState(state = {}) {
        const raw = state.accessTier || state.subscriptionStatus || ACCESS_STATES.REGISTERED_FREE;

        if (raw === "premium") {
            return ACCESS_STATES.PREMIUM_ACTIVE;
        }

        if (raw === "free") {
            return ACCESS_STATES.REGISTERED_FREE;
        }

        if (Object.values(ACCESS_STATES).includes(raw)) {
            return raw;
        }

        return ACCESS_STATES.REGISTERED_FREE;
    }

    function isPremiumLike(state = {}) {
        const accessState = normalizeAccessState(state);
        return [
            ACCESS_STATES.TRIAL,
            ACCESS_STATES.PREMIUM_ACTIVE,
            ACCESS_STATES.PREMIUM_GRACE
        ].includes(accessState);
    }

    function getPlanForState(state = {}) {
        return isPremiumLike(state)
            ? PLAN_CATALOG.premium
            : PLAN_CATALOG.free;
    }

    function canUse(feature, state = {}, context = {}) {
        const plan = getPlanForState(state);

        switch (feature) {
        case FEATURES.PDF_UPLOAD:
            return Number(context.pageCount || 0) <= plan.pdfPageLimit || plan.id === "premium";
        case FEATURES.SCANNED_PDF_TEXT:
        case FEATURES.LARGE_PDF_UPLOAD:
        case FEATURES.PREMIUM_LIBRARY:
        case FEATURES.PRACTICE_EXTRA_SERIES:
        case FEATURES.MINI_EXAM_EXTRA:
        case FEATURES.LEVEL_EXAM:
        case FEATURES.AI_TEXT_HIGHLIGHT:
        case FEATURES.HIGHLIGHT_EXPORT:
        case FEATURES.STATS:
        case FEATURES.CLOUD_SYNC:
            return plan.id === "premium";
        case FEATURES.RESUME_LATEST:
            return true;
        default:
            return false;
        }
    }

    function getLockMessage(feature) {
        return LOCK_MESSAGES[feature] || {
            title: "Recurso premium",
            message: "Este recurso fica liberado no plano premium."
        };
    }

    function buildLockNote(feature) {
        const lock = getLockMessage(feature);

        return {
            tone: "premium",
            title: lock.title,
            message: lock.message
        };
    }

    function buildOffer(feature) {
        const copy = OFFER_COPY[feature] || OFFER_COPY.default;
        const benefits = [...copy.benefits];

        PREMIUM_BENEFITS.forEach((benefit) => {
            if (!benefits.includes(benefit)) {
                benefits.push(benefit);
            }
        });

        return {
            feature,
            ...copy,
            benefits
        };
    }

    window.PremiumStudyAccessControl = {
        ACCESS_STATES,
        FEATURES,
        PLAN_CATALOG,
        normalizeAccessState,
        isPremiumLike,
        getPlanForState,
        canUse,
        getLockMessage,
        buildLockNote,
        buildOffer
    };
})();
