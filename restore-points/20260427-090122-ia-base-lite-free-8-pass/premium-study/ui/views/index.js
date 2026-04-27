(function () {
    if (window.PremiumStudyViews) {
        return;
    }

    const UI = () => window.PremiumStudyUI;
    const Store = () => window.PremiumStudyStore;
    const Access = () => window.PremiumStudyAccessControl;

    const MONTHS = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    function canAccess(feature, state, context = {}) {
        const access = Access();
        if (!access) {
            return state.accessTier === "premium";
        }

        return access.canUse(feature, state, context);
    }

    function entry(state) {
        const access = Access();
        const resume = state.latestLocalStudy;
        const workspaceMode = state.workspaceMode === "convert" ? "convert" : "study";
        const isConvertMode = workspaceMode === "convert";
        const studyLibrary = Array.isArray(state.studyLibrary)
            ? state.studyLibrary
            : [];
        const additionalStudiesCount = Math.max(0, studyLibrary.length - (resume ? 1 : 0));
        const premiumLibraryFeature = Access()
            ? Access().FEATURES.PREMIUM_LIBRARY
            : "premium_library";
        const premiumLibraryEnabled = canAccess(premiumLibraryFeature, state);
        const premiumActive = access && typeof access.isPremiumLike === "function"
            ? access.isPremiumLike(state)
            : state.accessTier === "premium";
        const fileAccept = isConvertMode
            ? ".pdf,application/pdf"
            : ".pdf,.txt,.md,.markdown,.csv,.json,.html,.htm,.xml,application/pdf,text/plain,text/markdown,text/csv,application/json,text/html,text/xml,application/xml";

        if (isConvertMode) {
            return `
<section class="premium-entry-stage">
    <div class="premium-entry-hero">
        <button type="button" class="premium-entry-card premium-entry-card-primary premium-entry-card-featured" data-premium-action="open-file-picker">
            <div class="premium-entry-topline">
                <span class="premium-entry-kicker">Conversor premium</span>
                <span class="premium-entry-inline-badge ${premiumActive ? "premium-entry-inline-badge-active" : "premium-entry-inline-badge-premium"}">Texto editavel</span>
            </div>
            <strong>Converter PDF ruim</strong>
            <p>Enviar PDF escaneado ou de baixa qualidade para abrir no editor de texto.</p>
        </button>
    </div>
    <div class="premium-entry-grid premium-entry-grid-secondary is-single">
        <button type="button" class="premium-entry-card premium-entry-card-secondary premium-entry-card-support premium-entry-card-premium ${premiumActive ? "" : "is-locked"}" data-premium-action="${premiumActive ? "switch-to-study-entry" : "open-premium-library"}" ${premiumActive ? "" : "aria-disabled=\"true\""}>
            <div class="premium-entry-topline">
                <span class="premium-entry-kicker">Fluxo separado</span>
                <span class="premium-entry-inline-badge ${premiumActive ? "premium-entry-inline-badge-active" : "premium-entry-inline-badge-premium"}">${premiumActive ? "Material focado" : "Premium"}</span>
            </div>
            <strong>${premiumActive ? "Voltar para Material Focado" : "Conversao premium"}</strong>
            <p>${premiumActive ? "Use o fluxo principal para Aprender, Praticar e Prova com PDF, TXT, MD, CSV, JSON ou HTML." : "A conversao integral de PDF ruim em texto editavel fica reservada ao premium."}</p>
            <small>${premiumActive ? "Abrir fluxo de estudo" : "Ativar conversao premium"}</small>
        </button>
    </div>
    <input id="premiumStudyFileInput" class="premium-hidden-input" type="file" accept="${fileAccept}" />
</section>
${renderSessionNote(state, "entry")}`;
        }

        if (premiumActive) {
            return `
<section class="premium-entry-stage">
    <div class="premium-entry-hero">
        <button type="button" class="premium-entry-card premium-entry-card-primary premium-entry-card-featured" data-premium-action="open-file-picker">
            <div class="premium-entry-topline">
                <span class="premium-entry-kicker">Workspace premium</span>
                <span class="premium-entry-inline-badge premium-entry-inline-badge-active">PDFs ilimitados</span>
            </div>
            <strong>Carregar novo material</strong>
            <p>Adicionar PDF, TXT, MD, CSV, JSON ou HTML e manter tudo organizado na sua biblioteca premium.</p>
        </button>
    </div>
    <div class="premium-entry-grid premium-entry-grid-secondary ${resume ? "" : "is-single"}">
        ${resume ? `
        <button type="button" class="premium-entry-card premium-entry-card-secondary premium-entry-card-support premium-entry-card-resume" data-premium-action="resume-latest-study">
            <div class="premium-entry-topline">
                <span class="premium-entry-kicker">Continuidade</span>
                <span class="premium-entry-inline-badge premium-entry-inline-badge-active">Continuidade completa</span>
            </div>
            <strong>Retomar último estudo</strong>
            <p>${UI().escapeHtml(resume.title)}</p>
            <small>Prova em ${UI().escapeHtml(resume.examDateLabel)}</small>
        </button>` : ""}
        <button type="button" class="premium-entry-card premium-entry-card-secondary premium-entry-card-support premium-entry-card-premium" data-premium-action="open-premium-library">
            <div class="premium-entry-topline">
                <span class="premium-entry-kicker">Biblioteca ativa</span>
                <span class="premium-entry-inline-badge premium-entry-inline-badge-active">Tudo liberado</span>
            </div>
            <strong>Abrir biblioteca</strong>
            <p>${additionalStudiesCount > 0 ? `${additionalStudiesCount} estudo(s) extra(s) já estão guardados para retomada imediata.` : "Seu histórico completo fica pronto para receber novos materiais e retomadas."}</p>
            <small>Entrar no acervo completo</small>
        </button>
    </div>
    <input id="premiumStudyFileInput" class="premium-hidden-input" type="file" accept="${fileAccept}" />
</section>
${renderSessionNote(state, "entry")}`;
        }

        return `
<section class="premium-entry-stage">
    <div class="premium-entry-hero">
        <button type="button" class="premium-entry-card premium-entry-card-primary premium-entry-card-featured" data-premium-action="open-file-picker">
            <div class="premium-entry-topline">
                <span class="premium-entry-kicker">Novo estudo</span>
                <span class="premium-entry-inline-badge premium-entry-inline-badge-free">Grátis até 8 páginas</span>
            </div>
            <strong>Carregar material</strong>
            <p>Enviar PDF, TXT, MD, CSV, JSON ou HTML para montar a trilha.</p>
        </button>
    </div>
    <div class="premium-entry-grid premium-entry-grid-secondary ${resume ? "" : "is-single"}">
        ${resume ? `
        <button type="button" class="premium-entry-card premium-entry-card-secondary premium-entry-card-support premium-entry-card-resume" data-premium-action="resume-latest-study">
            <div class="premium-entry-topline">
                <span class="premium-entry-kicker">Continuidade</span>
                <span class="premium-entry-inline-badge premium-entry-inline-badge-free">Último estudo livre</span>
            </div>
            <strong>Retomar último estudo</strong>
            <p>${UI().escapeHtml(resume.title)}</p>
            <small>Prova em ${UI().escapeHtml(resume.examDateLabel)}</small>
        </button>` : ""}
        <button type="button" class="premium-entry-card premium-entry-card-secondary premium-entry-card-support premium-entry-card-premium ${premiumLibraryEnabled ? "" : "is-locked"}" data-premium-action="open-premium-library" ${premiumLibraryEnabled ? "" : "aria-disabled=\"true\""}>
            <div class="premium-entry-topline">
                <span class="premium-entry-kicker">Camada premium</span>
                <span class="premium-entry-inline-badge premium-entry-inline-badge-premium">Biblioteca completa</span>
            </div>
            <strong>${premiumLibraryEnabled ? "Abrir biblioteca" : "Biblioteca premium"}</strong>
            <p>${additionalStudiesCount > 0 ? `${additionalStudiesCount} estudo(s) extras já estão prontos para retomada.` : "Guarde outros materiais e mantenha seu histórico completo no mesmo lugar."}</p>
            <small>${premiumLibraryEnabled ? "Ver histórico premium" : "Expanda seus estudos com premium"}</small>
        </button>
    </div>
    <input id="premiumStudyFileInput" class="premium-hidden-input" type="file" accept="${fileAccept}" />
</section>
${renderSessionNote(state, "entry")}`;
    }

    function buildCalendar(state) {
        const year = Number.isFinite(state.calendarYear) ? state.calendarYear : new Date().getFullYear();
        const month = Number.isFinite(state.calendarMonth) ? state.calendarMonth : new Date().getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startWeekday = (firstDay.getDay() + 6) % 7;
        const totalDays = lastDay.getDate();
        const cells = [];
        const selectedParts = String(state.examDate || "").split("-");
        const selectedYear = selectedParts.length === 3 ? Number(selectedParts[0]) : NaN;
        const selectedMonth = selectedParts.length === 3 ? Number(selectedParts[1]) - 1 : NaN;
        const selectedDay = selectedParts.length === 3 ? Number(selectedParts[2]) : NaN;
        const viewCursor = (year * 12) + month;
        const selectedCursor = (selectedYear * 12) + selectedMonth;

        for (let i = 0; i < startWeekday; i += 1) {
            cells.push(`<span class="premium-calendar-cell premium-calendar-cell-empty" aria-hidden="true"></span>`);
        }

        for (let day = 1; day <= totalDays; day += 1) {
            const date = new Date(year, month, day);
            const iso = date.toISOString().slice(0, 10);
            const isActive = state.examDate === iso;
            const isBeforeSelectedMonth = Number.isFinite(selectedCursor) && viewCursor < selectedCursor;
            const isSelectedMonth = Number.isFinite(selectedCursor) && viewCursor === selectedCursor;
            const isPathDay = !isActive && (
                isBeforeSelectedMonth ||
                (isSelectedMonth && day < selectedDay)
            );
            cells.push(`
<button type="button" class="premium-calendar-cell ${isActive ? "is-selected" : ""} ${isPathDay ? "is-path" : ""}" data-premium-action="pick-date" data-date-value="${iso}">
    <span>${day}</span>
</button>`);
        }

        return `
<section class="premium-step-stage">
    <div class="premium-calendar-panel">
        <div class="premium-calendar-head">
            <div class="premium-calendar-title-wrap">
                <button type="button" class="premium-calendar-nav" data-premium-action="calendar-prev" aria-label="Mês anterior">&larr;</button>
                <strong class="premium-calendar-title">${MONTHS[month]} ${year}</strong>
                <button type="button" class="premium-calendar-nav" data-premium-action="calendar-next" aria-label="Mês seguinte">&rarr;</button>
            </div>
            <span class="premium-calendar-selection">${state.examDate ? `Selecionado: ${UI().formatDateLabel(state.examDate)}` : "Escolha um dia"}</span>
        </div>
        <div class="premium-calendar-weekdays">
            <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sab</span><span>Dom</span>
        </div>
        <div class="premium-calendar-grid">
            ${cells.join("")}
        </div>
    </div>
    <button type="button" class="premium-step-advance ${state.examDate ? "" : "is-disabled"}" data-premium-action="continue-to-target" aria-label="Continuar" ${state.examDate ? "" : "disabled"}>
        <span aria-hidden="true">&rsaquo;</span>
    </button>
</section>`;
    }

    function ringMeter({ label, valueLabel, angle, actionPrefix, tone = "default" }) {
        return `
<div class="premium-ring-card premium-ring-card-${tone}">
    <div class="premium-ring-visual premium-ring-visual-${tone}" data-ring-control="${actionPrefix}" style="--ring-angle:${angle}deg">
        <div class="premium-ring-center">
            <strong>${UI().escapeHtml(valueLabel)}</strong>
            <span>${UI().escapeHtml(label)}</span>
        </div>
    </div>
</div>`;
    }

    function targetScore(state) {
        const score = Number(state.targetScore || 0);
        const angle = (score / 10) * 360;

        return `
<section class="premium-step-stage premium-step-stage-score">
    <div class="premium-single-focus">
        ${ringMeter({
            label: "nota alvo",
            valueLabel: `${score.toFixed(1)}`,
            angle,
            actionPrefix: "target-score",
            tone: "score"
        })}
    </div>
    <button type="button" class="premium-step-advance" data-premium-action="continue-to-time" aria-label="Continuar">
        <span aria-hidden="true">&rsaquo;</span>
    </button>
</section>`;
    }

    function studyTime(state) {
        const hoursAngle = (Math.max(0, Math.min(12, state.studyHours || 0)) / 12) * 360;
        const minutesAngle = (Math.max(0, Math.min(59, state.studyMinutes || 0)) / 60) * 360;

        return `
<section class="premium-time-stage">
    <div class="premium-time-grid">
        ${ringMeter({
            label: "horas por dia",
            valueLabel: `${state.studyHours}h`,
            angle: hoursAngle,
            actionPrefix: "study-hours",
            tone: "time"
        })}
        ${ringMeter({
            label: "minutos extras",
            valueLabel: `${String(state.studyMinutes).padStart(2, "0")}min`,
            angle: minutesAngle,
            actionPrefix: "study-minutes",
            tone: "time"
        })}
    </div>
    <button type="button" class="premium-time-advance" data-premium-action="continue-to-analysis" aria-label="Montar meu plano">
        <span aria-hidden="true">&rsaquo;</span>
    </button>
</section>`;
    }

    function deriveDaysUntilExam(examDate) {
        if (!examDate || !/^\d{4}-\d{2}-\d{2}$/.test(String(examDate))) {
            return null;
        }

        const now = new Date();
        const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
        const parts = String(examDate).split("-").map(Number);
        const examUtc = Date.UTC(parts[0], parts[1] - 1, parts[2]);
        return Math.max(0, Math.round((examUtc - todayUtc) / 86400000));
    }

    function estimateStudyBlocks(state) {
        const pageCount = Math.max(0, Number(state.materialPageCount || 0));
        const dailyMinutes = (Number(state.studyHours) || 0) * 60 + (Number(state.studyMinutes) || 0);
        const daysUntilExam = deriveDaysUntilExam(state.examDate);
        const accessTier = state.accessTier === "premium" || state.premiumActive ? "premium" : "free";
        let desiredBlockCount = accessTier === "premium" ? 6 : 3;

        if (pageCount >= 120) {
            desiredBlockCount += accessTier === "premium" ? 4 : 1;
        } else if (pageCount >= 80) {
            desiredBlockCount += accessTier === "premium" ? 3 : 1;
        } else if (pageCount >= 40) {
            desiredBlockCount += accessTier === "premium" ? 2 : 1;
        } else if (pageCount >= 20) {
            desiredBlockCount += 1;
        } else if (pageCount >= 8 && accessTier !== "premium") {
            desiredBlockCount += 1;
        }

        if (daysUntilExam !== null) {
            if (daysUntilExam <= 7) {
                desiredBlockCount -= accessTier === "premium" ? 2 : 1;
            } else if (daysUntilExam <= 21) {
                desiredBlockCount -= 1;
            } else if (daysUntilExam >= 120) {
                desiredBlockCount += accessTier === "premium" ? 2 : 1;
            } else if (daysUntilExam >= 60) {
                desiredBlockCount += 1;
            }
        }

        if (dailyMinutes >= 180) {
            desiredBlockCount += 1;
        } else if (dailyMinutes > 0 && dailyMinutes <= 30) {
            desiredBlockCount -= 1;
        }

        const min = accessTier === "premium" ? 5 : 2;
        const max = accessTier === "premium" ? 12 : 4;
        return Math.max(min, Math.min(max, desiredBlockCount));
    }

    function buildAnalysisSummary(state) {
        const pageCount = Math.max(0, Number(state.materialPageCount || 0));
        const daysUntilExam = deriveDaysUntilExam(state.examDate);
        const estimatedBlocks = estimateStudyBlocks(state);
        const progress = Math.max(0, Number(state.analysisProgress || 0));

        const materialSizeLabel = pageCount >= 120
            ? "Material extenso"
            : pageCount >= 40
                ? "Material medio"
                : "Material direto";

        const strategyLabel = daysUntilExam !== null && daysUntilExam <= 14
            ? "Reta final"
            : estimatedBlocks >= 9
                ? "Cobertura ampla"
                : "Trilha equilibrada";

        const stageLabel = progress >= 92
            ? "Blocos quase prontos"
            : progress >= 72
                ? "Montando blocos"
                : progress >= 46
                    ? "Separando eixos"
                    : progress >= 18
                        ? "Lendo base textual"
                        : "Recebendo material";

        const statusLines = [];

        if (pageCount > 0) {
            statusLines.push(`Documento recebido: ${pageCount} ${pageCount === 1 ? "pagina" : "paginas"}.`);
        } else {
            statusLines.push("Documento recebido. Agora estamos medindo o porte do material.");
        }

        statusLines.push(`Estrategia prevista: ${strategyLabel.toLowerCase()} com cerca de ${estimatedBlocks} ${estimatedBlocks === 1 ? "bloco" : "blocos"} de estudo.`);

        if (progress >= 92) {
            statusLines.push("Os blocos principais ja foram montados e estamos fechando a camada base para liberar os modos.");
        } else if (progress >= 72) {
            statusLines.push("Ja temos texto-base suficiente e estamos transformando isso em blocos de Aprender, Praticar e Prova.");
        } else if (progress >= 46) {
            statusLines.push("O texto-base ja entrou. Agora estamos separando capitulos, eixos e prioridades para evitar repeticao.");
        } else {
            statusLines.push("Ainda estamos consolidando a base do material antes de transformar tudo em trilha.");
        }

        return {
            materialSizeLabel,
            strategyLabel,
            stageLabel,
            estimatedBlocks,
            statusLines
        };
    }

    function renderAnalysisSummary(state) {
        const summary = buildAnalysisSummary(state);
        const pageCount = Math.max(0, Number(state.materialPageCount || 0));
        const rawProgress = Math.max(0, Number(state.analysisProgress || 0));
        const progress = rawProgress >= 92 ? 100 : Math.min(100, rawProgress);
        const steps = [
            {
                threshold: 10,
                label: "Recebido",
                title: pageCount > 0 ? `${pageCount} paginas identificadas` : "Material recebido",
                detail: pageCount >= 80 ? "Material extenso; vamos dividir por eixos." : "Medindo porte e densidade."
            },
            {
                threshold: 36,
                label: "Leitura",
                title: "Extraindo texto-base",
                detail: "Buscando titulos, secoes e topicos."
            },
            {
                threshold: 62,
                label: "Organizacao",
                title: summary.strategyLabel,
                detail: `${summary.estimatedBlocks} blocos previstos.`
            },
            {
                threshold: 82,
                label: "Construcao",
                title: "Ferramentas de estudo",
                detail: "Aula, esquemas e revisao."
            },
            {
                threshold: 94,
                label: "Finalizacao",
                title: "Fechando sua trilha",
                detail: "Liberando os modos."
            }
        ];
        const nextStepIndex = steps.findIndex((step) => progress < step.threshold);
        const currentIndex = nextStepIndex === -1
            ? steps.length - 1
            : Math.max(0, nextStepIndex);

        return `
<div class="premium-analysis-summary">
    <div class="premium-analysis-timeline">
        ${steps.map((step, index) => {
        const isDone = progress >= step.threshold;
        const isActive = index === currentIndex;
        const previousThreshold = index === 0 ? 0 : steps[index - 1].threshold;
        const stepRange = Math.max(1, step.threshold - previousThreshold);
        const fill = isDone
            ? 100
            : isActive
                ? Math.max(12, Math.min(96, Math.round(((progress - previousThreshold) / stepRange) * 100)))
                : 0;
        return `
        <article class="premium-analysis-step ${isDone ? "is-done" : ""} ${isActive ? "is-active" : ""}" style="--analysis-step-fill:${fill}%">
            <i aria-hidden="true"></i>
            <span>${UI().escapeHtml(step.label)}</span>
            <strong>${UI().escapeHtml(step.title)}</strong>
            <p>${UI().escapeHtml(step.detail)}</p>
        </article>`;
    }).join("")}
    </div>
    <div class="premium-analysis-current">
        <span>${UI().escapeHtml(summary.stageLabel)}</span>
        <strong>${UI().escapeHtml(state.progressLabel || "Estamos organizando a trilha para liberar Aprender, Praticar e Prova.")}</strong>
    </div>
</div>`;
    }

    function analysis(state) {
        const targetScore = Number(state.targetScore || 0).toFixed(1);
        const examDateLabel = UI().formatDateLabel(state.examDate);
        const progress = Math.max(10, Math.min(100, Number(state.analysisProgress || 0) >= 92 ? 100 : Number(state.analysisProgress || 0)));

        return `
<section class="premium-loading-stage">
    <div class="premium-loading-orb" aria-hidden="true"></div>
    <strong>Extraindo o melhor conteúdo para você buscar nota ${targetScore} no dia ${UI().escapeHtml(examDateLabel)}.</strong>
    <p>Estamos montando uma trilha mais objetiva para o seu prazo e para o tempo diário que você informou.</p>
    <div class="premium-loading-track">
        <span style="width:${progress}%"></span>
    </div>
    ${renderAnalysisSummary(state)}
</section>`;
    }

    function analysisBranded(state) {
        const targetScore = Number(state.targetScore || 0).toFixed(1);
        const examDateLabel = UI().formatDateLabel(state.examDate);
        const summary = buildAnalysisSummary(state);
        const progress = Math.max(10, Math.min(100, Number(state.analysisProgress || 0) >= 92 ? 100 : Number(state.analysisProgress || 0)));
        const labels = [
            "Recebendo material",
            "Lendo base textual",
            "Separando topicos",
            summary.stageLabel
        ].filter((label, index, source) => label && source.indexOf(label) === index);

        return `
<section class="premium-loading-stage">
    ${UI().loadingSignature({
            labels,
            progress
        })}
    <strong>Extraindo o melhor conteúdo para você buscar nota ${targetScore} no dia ${UI().escapeHtml(examDateLabel)}.</strong>
    <p>Estamos montando uma trilha mais objetiva para o seu prazo e para o tempo diário que você informou.</p>
    ${renderAnalysisSummary(state)}
</section>`;
    }

    function modeSelect(state) {
        return `
<section class="premium-mode-grid">
    <button type="button" class="premium-mode-card premium-mode-card-primary" data-premium-action="choose-mode-learn">
        <span class="premium-mode-word">Aprender</span>
        <strong>Entendimento guiado do assunto</strong>
        <p>Entre pelo resumo principal, com leitura orientada e estrutura clara.</p>
    </button>
    <button type="button" class="premium-mode-card" data-premium-action="choose-mode-practice">
        <span class="premium-mode-word">Praticar</span>
        <strong>Vá direto para questões</strong>
        <p>Treino objetivo para consolidar o assunto sem desviar do foco.</p>
    </button>
    <button type="button" class="premium-mode-card" data-premium-action="choose-mode-exam">
        <span class="premium-mode-word">Prova</span>
        <strong>Teste seu nível agora</strong>
        <p>Prova premium com seletor de quantidade para medir prontidão geral.</p>
    </button>
</section>
${renderSessionNote(state, "mode-select")}`;
    }

    function renderBulletList(items) {
        return `
<ul class="premium-bullet-list">
    ${items.map((item) => `<li>${UI().escapeHtml(item)}</li>`).join("")}
</ul>`;
    }

    function renderSubjectTags(items = []) {
        return `
<div class="premium-subject-tags">
    ${items.slice(0, 3).map((item) => `<span class="premium-subject-tag">${UI().escapeHtml(item)}</span>`).join("")}
</div>`;
    }

    function getLearnTab(state) {
        const allowed = new Set(["aula", "esquemas", "comparativos", "memorizar", "checklist", "casos"]);
        return allowed.has(state.blockTab) ? state.blockTab : "aula";
    }

    function getLearnTabCounts(learn = {}) {
        return {
            aula: (Array.isArray(learn.lessonModules) && learn.lessonModules.length)
                || (Array.isArray(learn.documentSections) ? learn.documentSections.length : 0),
            esquemas: Array.isArray(learn.flowDiagrams) ? learn.flowDiagrams.length : 0,
            comparativos: Array.isArray(learn.comparisonTables) ? learn.comparisonTables.length : 0,
            memorizar: (Array.isArray(learn.mnemonics) ? learn.mnemonics.length : 0)
                + (Array.isArray(learn.memoryDeck) ? learn.memoryDeck.length : 0)
                + (Array.isArray(learn.memoryAnchors) ? learn.memoryAnchors.length : 0),
            checklist: Array.isArray(learn.masteryChecklist) ? learn.masteryChecklist.length : 0,
            casos: (Array.isArray(learn.caseStudies) ? learn.caseStudies.length : 0)
                + (Array.isArray(learn.practicalCases) ? learn.practicalCases.length : 0)
        };
    }

    function getLearnTabs(learn = {}) {
        const counts = getLearnTabCounts(learn);
        return [
            { id: "aula", label: "Aula", shortLabel: "Aula", count: counts.aula || 1 },
            { id: "esquemas", label: "Esquemas", shortLabel: "Esq.", count: counts.esquemas },
            { id: "comparativos", label: "Comparativos", shortLabel: "Comp.", count: counts.comparativos },
            { id: "memorizar", label: "Memorizar", shortLabel: "Mem.", count: counts.memorizar },
            { id: "checklist", label: "Checklist", shortLabel: "Check", count: counts.checklist },
            { id: "casos", label: "Casos", shortLabel: "Casos", count: counts.casos }
        ].filter((tab) => tab.id === "aula" || Number(tab.count || 0) > 0);
    }

    function getLearnTabDescription(tabId = "") {
        const copy = {
            aula: "Leitura guiada com progressao, foco de prova e takeaway real.",
            esquemas: "Fluxos e caminhos de decisao para visualizar o criterio sem perder nuance.",
            comparativos: "Diferencas que a banca tenta embaralhar no enunciado.",
            memorizar: "Ganchos, cartas e formulas para revisar sem decorar no escuro.",
            checklist: "Fechamento do bloco antes de avancar para pratica ou prova.",
            casos: "Aplicacao comentada para testar o criterio em situacao de prova."
        };

        return copy[tabId] || "Ferramenta de estudo deste bloco.";
    }

    function renderConceptPills(items = [], className = "premium-learn-pill-row") {
        const filtered = Array.isArray(items) ? items.filter(Boolean).slice(0, 6) : [];
        if (!filtered.length) {
            return "";
        }

        return `
<div class="${className}">
    ${filtered.map((item) => `<span class="premium-learn-pill">${UI().escapeHtml(item)}</span>`).join("")}
</div>`;
    }

    function renderParagraphGroup(paragraphs = []) {
        const filtered = Array.isArray(paragraphs) ? paragraphs.filter(Boolean) : [];
        if (!filtered.length) {
            return "";
        }

        return `
<div class="premium-learn-paragraph-group">
    ${filtered.map((paragraph) => `<p>${UI().escapeHtml(paragraph)}</p>`).join("")}
</div>`;
    }

    function getChecklistLens(item = "") {
        const text = String(item || "").toLowerCase();

        if (/diferenc|compar|nao confundir/.test(text)) {
            return "diferenciar";
        }

        if (/aplic|caso|questao|resolver/.test(text)) {
            return "aplicar";
        }

        return "explicar";
    }

    function renderWorkspaceMeta(block, state, tabs = [], activeTab = "aula") {
        const totalBlocks = Array.isArray(state.blocks) ? state.blocks.length : 0;
        const pageCount = Math.max(0, Number(state.materialPageCount || 0));
        const activeTabInfo = tabs.find((tab) => tab.id === activeTab) || tabs[0] || { label: "Aula", count: 1 };

        return `
<div class="premium-learn-workspace-meta">
    <span class="premium-learn-meta-chip">${pageCount ? `${pageCount} paginas` : "material ativo"}</span>
    <span class="premium-learn-meta-chip">${totalBlocks || 1} ${totalBlocks === 1 ? "bloco" : "blocos"}</span>
    <span class="premium-learn-meta-chip">${UI().escapeHtml(block.duration || "ritmo livre")}</span>
    <span class="premium-learn-meta-chip premium-learn-meta-chip-accent">${UI().escapeHtml(activeTabInfo.label)}: ${Number(activeTabInfo.count || 0)}</span>
</div>`;
    }

    function renderLearnSections(sections = []) {
        return sections.map((section) => `
        <section class="premium-learn-section premium-learn-section-rich">
            <span class="premium-detail-label">${UI().escapeHtml(section.label)}</span>
            <h3>${UI().escapeHtml(section.title)}</h3>
            ${section.paragraphs.map((paragraph) => `<p>${UI().escapeHtml(paragraph)}</p>`).join("")}
        </section>
    `).join("");
    }

    function renderDocumentSections(sections = []) {
        return sections.map((section) => `
        <section class="premium-learn-section premium-learn-section-rich premium-learn-section-document premium-learn-section-document-${UI().escapeHtml(section.id || "default")} premium-learn-section-type-${UI().escapeHtml(section.type || section.id || "default")}">
            <span class="premium-detail-label">${UI().escapeHtml(section.label)}</span>
            <h3>${UI().escapeHtml(section.title)}</h3>
            ${Array.isArray(section.paragraphs)
        ? section.paragraphs.map((paragraph) => `<p>${UI().escapeHtml(paragraph)}</p>`).join("")
        : ""}
            ${Array.isArray(section.items) && section.items.length > 0
        ? renderBulletList(section.items)
        : ""}
        </section>
    `).join("");
    }

    function renderLessonModules(learn = {}, documentSections = []) {
        const modules = Array.isArray(learn.lessonModules) ? learn.lessonModules.filter(Boolean) : [];

        if (modules.length) {
            return `
<div class="premium-learn-lesson-stack">
    ${modules.map((module, index) => `
    <section class="premium-learn-lesson">
        <div class="premium-learn-lesson-index">${String(index + 1).padStart(2, "0")}</div>
        <div class="premium-learn-lesson-body">
            <div class="premium-learn-lesson-topline">
                <span class="premium-detail-label">${UI().escapeHtml(module.objective || "Aula guiada")}</span>
                <em>Parte ${index + 1} de ${modules.length}</em>
            </div>
            <h3>${UI().escapeHtml(module.title || `Aula ${index + 1}`)}</h3>
            ${renderParagraphGroup(module.paragraphs)}
            ${Array.isArray(module.takeaways) && module.takeaways.length
        ? `
            <div class="premium-learn-lesson-footer">
                <span class="premium-detail-label">Fixar antes de seguir</span>
                ${renderConceptPills(module.takeaways, "premium-learn-pill-row premium-learn-pill-row-takeaways")}
            </div>`
        : ""}
        </div>
    </section>`).join("")}
</div>`;
        }

        if (documentSections.length) {
            return renderDocumentSections(documentSections);
        }

        return `
<section class="premium-learn-section premium-learn-section-rich premium-learn-section-document">
    <span class="premium-detail-label">Aula guiada</span>
    <h3>Resumo estruturado</h3>
    <p>${UI().escapeHtml(learn.summary || "Este bloco ainda nao recebeu uma aula detalhada.")}</p>
    ${learn.intro ? `<p>${UI().escapeHtml(learn.intro)}</p>` : ""}
</section>`;
    }

    function renderInsightCard(label, title, items = [], tone = "default") {
        const filtered = Array.isArray(items) ? items.filter(Boolean).slice(0, 6) : [];
        if (!filtered.length) {
            return "";
        }

        return `
<article class="premium-learn-insight-card premium-learn-insight-card-${UI().escapeHtml(tone)}">
    <span class="premium-detail-label">${UI().escapeHtml(label)}</span>
    <h3>${UI().escapeHtml(title)}</h3>
    ${renderBulletList(filtered)}
</article>`;
    }

    function renderBlockInsightGrid(block) {
        const learn = block.learn || {};
        const examFocus = Array.isArray(learn.examFocus) ? learn.examFocus : [];
        const hotPoints = Array.isArray(learn.hotPoints) ? learn.hotPoints : [];
        const cards = [
            renderInsightCard("Mapa mental", "O que precisa ficar de pe", learn.keyConcepts, "concepts"),
            renderInsightCard("Como isso cai", "O que a prova costuma cobrar", examFocus.length ? examFocus : hotPoints, "exam"),
            renderInsightCard("Pegadinhas", "Onde o aluno costuma escorregar", learn.pitfalls, "pitfalls"),
            renderInsightCard("Comparacoes", "O que nao pode ser confundido", learn.connections, "connections"),
            renderInsightCard("Caso pratico", "Exemplos que fixam o criterio", learn.practicalCases, "cases"),
            renderInsightCard("Memorizacao", "Ganchos para revisar depois", learn.memoryAnchors, "memory")
        ].filter(Boolean);

        if (!cards.length) {
            return "";
        }

        return `
<section class="premium-learn-insight-grid">
    ${cards.join("")}
</section>`;
    }

    function renderComparisonTables(tables = []) {
        const filtered = Array.isArray(tables) ? tables.filter(Boolean).slice(0, 3) : [];
        if (!filtered.length) {
            return "";
        }

        return filtered.map((table) => {
            const rows = Array.isArray(table.rows) ? table.rows.filter(Boolean).slice(0, 6) : [];
            if (!rows.length) {
                return "";
            }

            return `
<section class="premium-learn-section premium-learn-section-rich premium-learn-comparison">
    <span class="premium-detail-label">Comparativo</span>
    <h3>${UI().escapeHtml(table.title || "Conceitos que nao podem ser confundidos")}</h3>
    <div class="premium-learn-table premium-learn-table-labels">
        <span>${UI().escapeHtml(table.leftLabel || "Conceito")}</span>
        <span>${UI().escapeHtml(table.rightLabel || "Diferenca pratica")}</span>
        <span>Observacao</span>
    </div>
    <div class="premium-learn-compare-grid">
        ${rows.map((row) => `
        <article class="premium-learn-compare-card">
            <strong>${UI().escapeHtml(row.left || "")}</strong>
            <p>${UI().escapeHtml(row.right || "")}</p>
            <em>${UI().escapeHtml(row.note || "")}</em>
        </article>`).join("")}
    </div>
</section>`;
        }).filter(Boolean).join("");
    }

    function renderFlowDiagrams(diagrams = []) {
        const filtered = Array.isArray(diagrams) ? diagrams.filter(Boolean).slice(0, 3) : [];
        if (!filtered.length) {
            return "";
        }

        return filtered.map((diagram) => {
            const steps = Array.isArray(diagram.steps) ? diagram.steps.filter(Boolean).slice(0, 7) : [];
            if (!steps.length) {
                return "";
            }

            return `
<section class="premium-learn-section premium-learn-section-rich premium-learn-flow">
    <span class="premium-detail-label">Esquema ilustrado</span>
    <h3>${UI().escapeHtml(diagram.title || "Fluxo de decisao")}</h3>
    <div class="premium-learn-flow-track">
        ${steps.map((step, index) => `
        <article class="premium-learn-flow-step">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div class="premium-learn-flow-step-body">
                <strong>${UI().escapeHtml(step.label || `Etapa ${index + 1}`)}</strong>
                ${step.detail ? `<p>${UI().escapeHtml(step.detail)}</p>` : ""}
            </div>
        </article>`).join("")}
    </div>
</section>`;
        }).filter(Boolean).join("");
    }

    function renderMnemonics(mnemonics = []) {
        const filtered = Array.isArray(mnemonics) ? mnemonics.filter(Boolean).slice(0, 4) : [];
        if (!filtered.length) {
            return "";
        }

        return `
<div class="premium-learn-mnemonic-grid">
        ${filtered.map((item) => `
        <details class="premium-learn-mnemonic"${filtered.length === 1 ? " open" : ""}>
            <summary>
                <span>${UI().escapeHtml(item.title || "Mnemonico")}</span>
                <strong>${UI().escapeHtml(item.formula || "")}</strong>
            </summary>
            ${item.explanation ? `<p>${UI().escapeHtml(item.explanation)}</p>` : `<p>Use este gatilho para lembrar a estrutura do bloco antes de revisar o texto inteiro.</p>`}
        </details>`).join("")}
    </div>`;
    }

    function renderMemoryDeck(cards = [], state = {}, blockId = "") {
        const filtered = Array.isArray(cards) ? cards.filter(Boolean).slice(0, 8) : [];
        if (!filtered.length) {
            return "";
        }
        const revealed = state.learnInteractions?.revealedMemory?.[blockId] || {};

        return `
<section class="premium-learn-memory-zone">
    <header class="premium-learn-inline-head">
        <div>
            <span class="premium-detail-label">Cartas de memoria</span>
            <h3>Recupere o criterio antes de olhar a resposta</h3>
        </div>
        <em>${filtered.length} cartas</em>
    </header>
    <div class="premium-learn-memory-deck">
    ${filtered.map((card, index) => {
        const isRevealed = Boolean(revealed[String(index)]);
        return `
    <article class="premium-learn-memory-card ${isRevealed ? "is-revealed" : ""}">
        <span>Recordar</span>
        <strong>${UI().escapeHtml(card.front || "")}</strong>
        ${isRevealed && card.back ? `<p>${UI().escapeHtml(card.back)}</p>` : ""}
        ${isRevealed && card.cue ? `<small>${UI().escapeHtml(card.cue)}</small>` : ""}
        <button type="button" class="premium-learn-mini-action" data-premium-action="toggle-memory-card" data-block-id="${UI().escapeHtml(blockId)}" data-item-index="${index}">
            ${isRevealed ? "Ocultar" : "Revelar"}
        </button>
    </article>`;
    }).join("")}
    </div>
</section>`;
    }

    function renderCaseStudies(caseStudies = [], practicalCases = [], state = {}, blockId = "") {
        const structured = Array.isArray(caseStudies) ? caseStudies.filter(Boolean).slice(0, 5) : [];
        const loose = Array.isArray(practicalCases) ? practicalCases.filter(Boolean).slice(0, 5) : [];
        const revealed = state.learnInteractions?.revealedCases?.[blockId] || {};

        if (structured.length) {
            return `
<div class="premium-learn-case-grid">
    ${structured.map((caseStudy, index) => {
        const isRevealed = Boolean(revealed[String(index)]);
        return `
    <article class="premium-learn-case ${isRevealed ? "is-revealed" : ""}">
        <span class="premium-detail-label">${UI().escapeHtml(caseStudy.title || "Caso aplicado")}</span>
        ${caseStudy.scenario ? `<strong>${UI().escapeHtml(caseStudy.scenario)}</strong>` : ""}
        ${isRevealed ? `
        <div class="premium-learn-case-reveal">
            ${caseStudy.analysis ? `<p>${UI().escapeHtml(caseStudy.analysis)}</p>` : ""}
            ${caseStudy.lesson ? `<small>${UI().escapeHtml(caseStudy.lesson)}</small>` : `<small>A pegadinha costuma estar no detalhe que parece acessorio, mas redefine o criterio.</small>`}
        </div>` : ""}
        <button type="button" class="premium-learn-mini-action" data-premium-action="toggle-learn-case" data-block-id="${UI().escapeHtml(blockId)}" data-item-index="${index}">
            ${isRevealed ? "Ocultar analise" : "Ver analise"}
        </button>
    </article>`;
    }).join("")}
</div>`;
        }

        if (loose.length) {
            const activeBlock = Store().getActiveBlock() || {};
            const learn = activeBlock.learn || {};
            const anchors = [
                ...(Array.isArray(learn.keyConcepts) ? learn.keyConcepts.slice(0, 3) : []),
                ...(Array.isArray(learn.hotPoints) ? learn.hotPoints.slice(0, 2) : [])
            ].filter(Boolean);

            return `
<div class="premium-learn-case-grid">
    ${loose.map((caseText, index) => {
        const itemKey = `loose-${index}`;
        const isRevealed = Boolean(revealed[itemKey]);
        return `
    <article class="premium-learn-case ${isRevealed ? "is-revealed" : ""}">
        <span class="premium-detail-label">Caso aplicado</span>
        <strong>${UI().escapeHtml(caseText)}</strong>
        ${isRevealed ? `
        <p>Comece identificando qual conceito do bloco resolve a situação. Depois conecte o fato narrado ao critério central do material, evitando responder só por intuição.</p>
        ${anchors.length ? `<small>Conceitos de apoio: ${UI().escapeHtml(anchors.join("; "))}</small>` : ""}` : ""}
        <button type="button" class="premium-learn-mini-action" data-premium-action="toggle-learn-case" data-block-id="${UI().escapeHtml(blockId)}" data-item-index="${UI().escapeHtml(itemKey)}">
            ${isRevealed ? "Ocultar caminho" : "Ver caminho de resposta"}
        </button>
    </article>`;
    }).join("")}
</div>`;
        }

        return "";
    }

    function renderMasteryChecklist(items = [], state = {}, blockId = "") {
        const filtered = Array.isArray(items) ? items.filter(Boolean).slice(0, 7) : [];
        if (!filtered.length) {
            return "";
        }
        const checked = state.learnInteractions?.checked?.[blockId] || {};
        const doneCount = filtered.filter((_, index) => checked[String(index)]).length;
        const progressRatio = Math.max(0, Math.min(100, Math.round((doneCount / filtered.length) * 100)));

        return `
<section class="premium-learn-section premium-learn-section-rich premium-learn-checklist">
    <span class="premium-detail-label">Checklist de dominio</span>
    <h3>Antes de seguir, confira se voce consegue</h3>
    <div class="premium-learn-check-progress">
        <strong>${doneCount}/${filtered.length} marcados</strong>
        <div class="premium-learn-progressbar" aria-hidden="true">
            <span style="width:${progressRatio}%"></span>
        </div>
    </div>
    <div class="premium-learn-check-items">
        ${filtered.map((item, index) => `
        <button type="button" class="premium-learn-check-item ${checked[String(index)] ? "is-checked" : ""}" data-premium-action="toggle-learn-check" data-block-id="${UI().escapeHtml(blockId)}" data-item-index="${index}">
            <span>${checked[String(index)] ? "✓" : ""}</span>
            <div class="premium-learn-check-copy">
                <strong>${UI().escapeHtml(item)}</strong>
                <em>${UI().escapeHtml(getChecklistLens(item))}</em>
            </div>
        </button>`).join("")}
    </div>
</section>`;
    }

    function renderLearningStudio(block) {
        const learn = block.learn || {};
        return [
            renderComparisonTables(learn.comparisonTables),
            renderFlowDiagrams(learn.flowDiagrams),
            renderMnemonics(learn.mnemonics),
            renderMasteryChecklist(learn.masteryChecklist)
        ].filter(Boolean).join("");
    }

    function renderLearnTabContent(block, state, documentSections = []) {
        const learn = block.learn || {};
        const activeTab = getLearnTab(state);
        const blockId = block.id || "";

        if (activeTab === "aula") {
            return `
<section class="premium-learn-workspace-panel premium-learn-workspace-panel-aula">
    ${renderLessonModules(learn, documentSections)}
</section>`;
        }

        if (activeTab === "esquemas") {
            const flows = renderFlowDiagrams(learn.flowDiagrams);
            return `
<section class="premium-learn-workspace-panel premium-learn-workspace-panel-tools">
    ${flows || renderEmptyLearnTool("Esquemas", "Este bloco nao trouxe um fluxo proprio. Use a aula e o checklist para consolidar o caminho principal.")}
</section>`;
        }

        if (activeTab === "comparativos") {
            const tables = renderComparisonTables(learn.comparisonTables);
            return `
<section class="premium-learn-workspace-panel premium-learn-workspace-panel-tools">
    ${tables || renderInsightCard("Comparacoes", "O que nao pode ser confundido", learn.connections, "connections") || renderEmptyLearnTool("Comparativos", "Este bloco nao tem tabela propria. Quando o assunto tiver conceitos parecidos, a IA separa as diferencas aqui.")}
</section>`;
        }

        if (activeTab === "memorizar") {
            const content = [
                renderMnemonics(learn.mnemonics),
                renderMemoryDeck(learn.memoryDeck, state, blockId),
                !Array.isArray(learn.mnemonics) || !learn.mnemonics.length
                    ? renderInsightCard("Ganchos", "Memoria rapida", learn.memoryAnchors, "memory")
                    : ""
            ].filter(Boolean).join("");

            return `
<section class="premium-learn-workspace-panel premium-learn-workspace-panel-memory">
    ${content || renderEmptyLearnTool("Memorizar", "Este bloco nao exigiu mnemonicos. Quando houver listas, etapas ou formulas, os cards aparecem aqui.")}
</section>`;
        }

        if (activeTab === "checklist") {
            const checklist = renderMasteryChecklist(learn.masteryChecklist, state, blockId);
            return `
<section class="premium-learn-workspace-panel premium-learn-workspace-panel-tools">
    ${checklist || renderEmptyLearnTool("Checklist", "Ainda nao ha checklist especifico para este bloco. Use a revisao em 5 pontos para uma checagem rapida.")}
</section>`;
        }

        const cases = renderCaseStudies(learn.caseStudies, learn.practicalCases, state, blockId);
        return `
<section class="premium-learn-workspace-panel premium-learn-workspace-panel-cases">
    ${cases || renderEmptyLearnTool("Casos", "Este bloco nao trouxe exemplos aplicados separados. Quando o tema pedir aplicacao, os casos aparecem aqui.")}
</section>`;
    }

    function renderEmptyLearnTool(title, message) {
        return `
<article class="premium-learn-empty-tool">
    <span class="premium-detail-label">${UI().escapeHtml(title)}</span>
    <strong>Sem ferramenta especifica neste bloco</strong>
    <p>${UI().escapeHtml(message)}</p>
</article>`;
    }

    function renderReviewPoints(items = []) {
        const filtered = Array.isArray(items) ? items.filter(Boolean).slice(0, 5) : [];
        if (!filtered.length) {
            return "";
        }

        return `
<div class="premium-learn-review-grid">
    ${filtered.map((item, index) => `
    <article class="premium-learn-review-card">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <p>${UI().escapeHtml(item)}</p>
    </article>`).join("")}
</div>`;
    }

    function getExplainBetterContent(block = {}) {
        const learn = block.learn || {};
        const explain = learn.explainBetter || {};
        const paragraphs = Array.isArray(explain.paragraphs)
            ? explain.paragraphs.filter(Boolean).slice(0, 4)
            : [];

        if (paragraphs.length) {
            return {
                title: explain.title || `Explicando ${block.title || "este bloco"}`,
                paragraphs
            };
        }

        const lessonParagraphs = Array.isArray(learn.lessonModules)
            ? learn.lessonModules
                .flatMap((module) => Array.isArray(module.paragraphs) ? module.paragraphs : [])
                .filter(Boolean)
                .slice(0, 3)
            : [];
        const keyConcepts = Array.isArray(learn.keyConcepts) ? learn.keyConcepts.filter(Boolean).slice(0, 3) : [];
        const pitfalls = Array.isArray(learn.pitfalls) ? learn.pitfalls.filter(Boolean).slice(0, 2) : [];
        const fallbackParagraphs = [];

        if (learn.summary) {
            fallbackParagraphs.push(learn.summary);
        }

        if (lessonParagraphs.length) {
            fallbackParagraphs.push(lessonParagraphs[0]);
        } else if (learn.intro) {
            fallbackParagraphs.push(learn.intro);
        }

        if (keyConcepts.length) {
            fallbackParagraphs.push(`O eixo deste bloco gira em torno de ${keyConcepts.join(", ")}. Antes de decorar detalhe, vale confirmar onde cada um entra e o que muda quando a banca aproxima conceitos parecidos.`);
        }

        if (pitfalls.length) {
            fallbackParagraphs.push(`O erro mais comum aqui costuma aparecer quando o aluno ${pitfalls[0].charAt(0).toLowerCase()}${pitfalls[0].slice(1)}${pitfalls[1] ? ` ou ${pitfalls[1].charAt(0).toLowerCase()}${pitfalls[1].slice(1)}` : ""}.`);
        }

        const filteredFallback = fallbackParagraphs
            .map((item) => String(item || "").trim())
            .filter(Boolean)
            .slice(0, 4);

        if (!filteredFallback.length) {
            return null;
        }

        return {
            title: `Explicando ${block.title || "este bloco"}`,
            paragraphs: filteredFallback
        };
    }

    function getQuickReviewContent(block = {}) {
        const learn = block.learn || {};
        const direct = Array.isArray(learn.reviewInFivePoints)
            ? learn.reviewInFivePoints.filter(Boolean).slice(0, 5)
            : [];

        if (direct.length) {
            return direct;
        }

        const derived = [
            ...(Array.isArray(learn.keyConcepts) ? learn.keyConcepts.slice(0, 2).map((item) => `Defina com clareza: ${item}.`) : []),
            ...(Array.isArray(learn.examFocus) ? learn.examFocus.slice(0, 1).map((item) => `Como isso cai: ${item}`) : []),
            ...(Array.isArray(learn.pitfalls) ? learn.pitfalls.slice(0, 1).map((item) => `Evite este erro: ${item}`) : []),
            ...(Array.isArray(learn.masteryChecklist) ? learn.masteryChecklist.slice(0, 2) : []),
            ...(Array.isArray(learn.lessonModules)
                ? learn.lessonModules
                    .flatMap((module) => Array.isArray(module.takeaways) ? module.takeaways : [])
                    .slice(0, 2)
                : [])
        ]
            .map((item) => String(item || "").trim())
            .filter(Boolean);

        return derived.slice(0, 5);
    }

    function renderAssistPanel(block, assistMode) {
        const learn = block.learn || {};
        const explainContent = getExplainBetterContent(block);
        const reviewContent = getQuickReviewContent(block);

        if (assistMode === "explain" && explainContent) {
            return `
<section class="premium-learn-section premium-learn-section-rich premium-learn-assist-panel">
    <span class="premium-detail-label">Explicar melhor este assunto</span>
    <h3>${UI().escapeHtml(explainContent.title)}</h3>
    ${explainContent.paragraphs.map((paragraph) => `<p>${UI().escapeHtml(paragraph)}</p>`).join("")}
</section>`;
        }

        if (assistMode === "review" && reviewContent.length) {
            return `
<section class="premium-learn-section premium-learn-section-rich premium-learn-assist-panel">
    <span class="premium-detail-label">Revisao em 5 pontos</span>
    <h3>Fechamento rapido antes de seguir</h3>
    <p class="premium-learn-assist-lead">Passe por estes 5 checkpoints para confirmar o criterio sem reler o bloco inteiro.</p>
    ${renderReviewPoints(reviewContent)}
</section>`;
        }

        return "";
    }

    function renderSessionNote(state, scope) {
        const note = state.sessionNote;
        if (!note || note.step !== scope) {
            return "";
        }

        return `
<article class="premium-session-note premium-session-note-${UI().escapeHtml(note.tone || "info")}">
    <strong>${UI().escapeHtml(note.title || "Aviso")}</strong>
    <p>${UI().escapeHtml(note.message || "")}</p>
</article>`;
    }

    function getPracticeSlots(state, type, seriesMeta) {
        const session = state.sessions[state.activeBlockId][type] || {};
        const total = Math.max(1, Number(seriesMeta?.freeSeriesLimit) || 3);
        const completedSeries = Array.isArray(seriesMeta?.completedSeries)
            ? seriesMeta.completedSeries
            : [];
        const activeIndex = Math.max(
            0,
            Math.min(
                total - 1,
                Number.isFinite(session.currentSeriesIndex)
                    ? session.currentSeriesIndex
                    : 0
            )
        );

        return Array.from({ length: total }, (_, index) => ({
            index,
            done: completedSeries.includes(index),
            active: index === activeIndex
        }));
    }

    function renderPracticeSlotPots(type, slots) {
        return `
<div class="premium-practice-slots">
    <div class="premium-practice-slot-row">
        ${slots.map((slot) => `
        <button type="button" class="premium-practice-slot ${slot.done ? "is-done" : ""} ${slot.active ? "is-active" : ""}" data-premium-action="open-practice-slot" data-practice-type="${type}" data-slot-index="${slot.index}" aria-label="Abrir serie ${slot.index + 1}">
            <span class="premium-practice-slot-fill" style="height:${slot.done ? 100 : 12}%"></span>
            <strong>${slot.index + 1}</strong>
        </button>`).join("")}
    </div>
    <div class="premium-practice-slot-row premium-practice-slot-row-premium">
        ${Array.from({ length: 3 }, () => `
        <button type="button" class="premium-practice-slot premium-practice-slot-locked" data-premium-action="request-premium-practice-extra" data-practice-type="${type}" aria-label="Liberar extras no premium">
            <span class="premium-practice-slot-lock">+</span>
        </button>`).join("")}
    </div>
    <small>3 grátis agora. Depois, potes extras e infinitos no premium.</small>
</div>`;
    }

    function renderPracticeCard({ action, type, label, title, description, slots, seriesMeta, primary = false }) {
        return `
    <article class="premium-practice-card ${primary ? "premium-practice-card-primary" : ""}" data-premium-action="${action}" role="button" tabindex="0" aria-label="${UI().escapeHtml(title)}">
        <div class="premium-practice-card-head">
            <span>${label}</span>
            <em>${seriesMeta.completedCount}/${seriesMeta.freeSeriesLimit}</em>
        </div>
        <strong>${title}</strong>
        <p>${description}</p>
        ${renderPracticeSlotPots(type, slots)}
    </article>`;
    }

    function learnMap(state) {
        const pageCount = Math.max(0, Number(state.materialPageCount || 0));
        const blockCount = Array.isArray(state.blocks) ? state.blocks.length : 0;
        return `
<section class="premium-learn-coverage">
    <span class="premium-panel-kicker">Cobertura do material</span>
    <strong>${blockCount} ${blockCount === 1 ? "bloco" : "blocos"} preparados${pageCount ? ` para ${pageCount} paginas` : ""}</strong>
    <p>${blockCount <= 4 && pageCount >= 80 ? "Este material ainda parece compactado demais; gere novamente para uma cobertura premium mais ampla." : "Escolha uma frente para entrar no workspace de estudo."}</p>
</section>
<section class="premium-learn-map-grid">
    ${state.blocks.map((block, index) => {
        const progress = block.progress || {};
        const statusClass = progress.exam
            ? "is-complete"
            : progress.learn
                ? "is-started"
                : "is-new";
        const statusLabel = progress.exam
            ? "Concluido"
            : progress.learn
                ? "Iniciado"
                : "Novo";

        return `
    <button type="button" class="premium-subject-card ${statusClass} ${state.activeBlockId === block.id ? "is-active" : ""}" data-premium-action="open-block" data-block-id="${block.id}">
        <span class="premium-subject-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="premium-subject-word">${UI().escapeHtml(block.title)}</span>
        <span class="premium-subject-status">${statusLabel}</span>
        <span class="premium-subject-duration">${UI().escapeHtml(block.duration)}</span>
    </button>`;
    }).join("")}
</section>`;
    }

    function block(state) {
        const block = Store().getActiveBlock();
        const nextBlockId = Store().getNextBlockId();
        const learn = block.learn || {};
        const tabs = getLearnTabs(learn);
        const requestedTab = getLearnTab(state);
        const activeTab = tabs.some((tab) => tab.id === requestedTab)
            ? requestedTab
            : "aula";
        const effectiveState = activeTab === state.blockTab
            ? state
            : { ...state, blockTab: activeTab };
        const documentSections = Array.isArray(learn.documentSections) && learn.documentSections.length
            ? learn.documentSections
            : [];
        const assistPanel = renderAssistPanel(block, state.blockAssistMode);
        return `
<section class="premium-learn-reader ${state.blockFullScreen ? "is-fullscreen" : "is-page"}">
    ${state.blockFullScreen ? `<div class="premium-learn-reader-scrim" aria-hidden="true"></div>` : ""}
    <div class="premium-learn-focus premium-learn-reader-panel">
        <article class="premium-learn-workspace">
            <aside class="premium-learn-workspace-rail" aria-label="Assuntos do material">
                <span class="premium-panel-kicker">Aprender</span>
                <h2>${UI().escapeHtml(block.title)}</h2>
                <p>${UI().escapeHtml(block.subtitle)}</p>
                <div class="premium-learn-block-rail">
                    ${state.blocks.map((item, index) => `
                    <button type="button" class="premium-learn-rail-item ${item.id === block.id ? "is-active" : ""}" data-premium-action="open-block" data-block-id="${item.id}">
                        <span>${String(index + 1).padStart(2, "0")}</span>
                        <strong>${UI().escapeHtml(item.title)}</strong>
                    </button>`).join("")}
                </div>
            </aside>
            <div class="premium-learn-workspace-main">
                <header class="premium-learn-workspace-head">
                    <div>
                        <span class="premium-panel-kicker">Workspace de estudo</span>
                        <h2>${UI().escapeHtml(block.title)}</h2>
                        <p class="premium-learn-lead">${UI().escapeHtml(block.subtitle)}</p>
                        ${renderWorkspaceMeta(block, state, tabs, activeTab)}
                    </div>
                    <button type="button" class="premium-tab ${state.blockFullScreen ? "" : "is-active"}" data-premium-action="${state.blockFullScreen ? "collapse-block-reader" : "expand-block-reader"}">
                        ${state.blockFullScreen ? "Sair da tela cheia" : "Abrir em tela cheia"}
                    </button>
                </header>
                <nav class="premium-learn-workspace-tabs" aria-label="Ferramentas de aprender">
                    ${tabs.map((tab) => `
                    <button type="button" class="premium-learn-tool-tab ${activeTab === tab.id ? "is-active" : ""}" data-premium-action="set-tab" data-tab-id="${tab.id}">
                        <span>${UI().escapeHtml(tab.label)}</span>
                        <small>${UI().escapeHtml(tab.shortLabel)}</small>
                        <em>${Number(tab.count || 0)}</em>
                    </button>`).join("")}
                </nav>
                <section class="premium-learn-tab-intro">
                    <span class="premium-detail-label">${UI().escapeHtml((tabs.find((tab) => tab.id === activeTab) || { label: "Aula" }).label)}</span>
                    <p>${UI().escapeHtml(getLearnTabDescription(activeTab))}</p>
                </section>
                ${activeTab === "aula" ? renderBlockInsightGrid(block) : ""}
                ${renderLearnTabContent(block, effectiveState, documentSections)}
                ${assistPanel}
            </div>
        </article>
        ${UI().actionBar([
            { action: "ai-explain-better", label: "Explicar melhor", variant: state.blockAssistMode === "explain" ? "secondary" : "ghost" },
            { action: "ai-quick-review", label: "Revisar em 5 pontos", variant: state.blockAssistMode === "review" ? "secondary" : "ghost" },
            { action: "open-mini-exam", label: "Mini prova", variant: "primary" },
            ...(nextBlockId ? [{ action: "open-next-block", label: "Próximo assunto", variant: "ghost" }] : [])
        ])}
    </div>
</section>`;
    }

    function getSelectedHighlightPart(documentData) {
        const selectedPartId = documentData && documentData.selectedPartId
            ? documentData.selectedPartId
            : "";

        if (!selectedPartId) {
            return null;
        }

        for (const section of documentData.sections || []) {
            for (const paragraph of section.paragraphs || []) {
                for (const part of paragraph || []) {
                    if (part.id === selectedPartId) {
                        return part;
                    }
                }
            }
        }

        return null;
    }

    function renderHighlightParagraph(parts = [], sectionIndex, paragraphIndex, selectedPartId) {
        return `<p class="premium-highlight-paragraph" data-premium-highlight-paragraph="true" data-section-index="${sectionIndex}" data-paragraph-index="${paragraphIndex}">${parts.map((part, partIndex) => `
            <span
                class="premium-highlight-piece${part.highlight ? " is-highlighted" : ""}${selectedPartId === part.id ? " is-selected" : ""}"
                ${part.highlight ? `style="--premium-highlight-color:${UI().escapeHtml(part.colorKey || "gold")};"` : ""}
                data-premium-action="select-highlight-part"
                data-section-index="${sectionIndex}"
                data-paragraph-index="${paragraphIndex}"
                data-part-index="${partIndex}"
                role="button"
                tabindex="0"
                aria-pressed="${selectedPartId === part.id ? "true" : "false"}"
            >${part.highlight
                ? `<mark class="premium-highlight-mark premium-highlight-mark-${UI().escapeHtml(part.colorKey || "gold")}">${UI().escapeHtml(part.text)}</mark>`
                : UI().escapeHtml(part.text)}</span>
        `).join("")}</p>`;
    }

    function highlightPreview(state) {
        const documentData = state.highlightedDocument || Store().openHighlightDocument().highlightedDocument;
        const highlightExportFeature = Access()
            ? Access().FEATURES.HIGHLIGHT_EXPORT
            : "highlight_export";
        const premiumLibraryEnabled = canAccess(highlightExportFeature, state);
        const selectedPart = getSelectedHighlightPart(documentData);
        const colorOptions = Array.isArray(documentData.colorOptions)
            ? documentData.colorOptions
            : [];
        const selectedText = selectedPart ? selectedPart.text : "";

        if (!state.highlightEditorOpen) {
            return `
<section class="premium-highlight-shell premium-highlight-shell-preview">
    <article class="premium-highlight-export premium-highlight-preview-card">
        <span class="premium-panel-kicker">Texto marcado</span>
        <strong>${UI().escapeHtml(documentData.title)}</strong>
        <p>A IA ja deixou o material grifado nos pontos mais importantes. Abra o documento para revisar, ajustar trechos, trocar cores e editar o texto antes de baixar.</p>
        <div class="premium-highlight-preview-actions">
            <button type="button" class="premium-action premium-action-primary" data-premium-action="open-highlight-editor">Abrir texto marcado</button>
            <button type="button" class="premium-action premium-action-secondary" data-premium-action="download-highlight-summary">Baixar PDF so com marcacoes</button>
            <button type="button" class="premium-action premium-action-secondary" data-premium-action="download-highlighted-full">Baixar PDF completo com as marcacoes</button>
        </div>
        <small>${premiumLibraryEnabled ? "Os downloads abrem a versao pronta para salvar em PDF." : "Os downloads continuam liberados no premium."}</small>
    </article>
</section>`;
        }

        return `
<section class="premium-highlight-reader ${state.highlightEditorFullScreen ? "is-fullscreen" : "is-page"}">
    ${state.highlightEditorFullScreen ? `<div class="premium-highlight-reader-scrim" aria-hidden="true"></div>` : ""}
    <div class="premium-highlight-focus premium-highlight-reader-panel">
        <div class="premium-highlight-reader-head">
            <div class="premium-highlight-reader-copy">
                <span class="premium-panel-kicker">Texto marcado</span>
                <h2>${UI().escapeHtml(documentData.title)}</h2>
                <p class="premium-learn-lead">${UI().escapeHtml(documentData.subtitle)}</p>
            </div>
            <div class="premium-inline-actions premium-inline-actions-contextual premium-highlight-reader-toggles">
                <button type="button" class="premium-tab ${state.highlightEditorFullScreen ? "is-active" : ""}" data-premium-action="${state.highlightEditorFullScreen ? "collapse-highlight-editor" : "expand-highlight-editor"}">
                    ${state.highlightEditorFullScreen ? "Sair da tela cheia" : "Abrir em tela cheia"}
                </button>
                <button type="button" class="premium-tab" data-premium-action="close-highlight-editor">Voltar aos downloads</button>
            </div>
        </div>
        <article class="premium-highlight-document">
            <div class="premium-highlight-toolbar">
                <div class="premium-highlight-toolbar-copy">
                    <span class="premium-detail-label">Editor do documento</span>
                    <strong>${selectedPart ? "Trecho selecionado pronto para ajuste" : "Selecione um trecho do texto para editar ou marcar"}</strong>
                    <p>${selectedPart
            ? "Voce pode reescrever o trecho, trocar a cor, remover a marcacao ou apagar so esta parte."
            : "Selecione um trecho no proprio documento para marcar, desmarcar, copiar, apagar ou reescrever sem mexer no restante."}</p>
                </div>
                <div class="premium-highlight-swatch-row">
                    ${colorOptions.map((option) => `
                        <button
                            type="button"
                            class="premium-highlight-swatch${documentData.activeColorKey === option.key ? " is-active" : ""}"
                            data-premium-action="set-highlight-color"
                            data-item-value="${UI().escapeHtml(option.key)}"
                            aria-label="${UI().escapeHtml(option.label)}"
                            title="${UI().escapeHtml(option.label)}"
                        >
                            <span class="premium-highlight-swatch-fill premium-highlight-swatch-fill-${UI().escapeHtml(option.key)}"></span>
                        </button>
                    `).join("")}
                </div>
                <label class="premium-highlight-editor-label" for="premiumHighlightEditor">Texto do trecho</label>
                <textarea id="premiumHighlightEditor" class="premium-highlight-editor-field" rows="4" placeholder="Selecione um trecho do documento para editar aqui.">${UI().escapeHtml(selectedText)}</textarea>
                <div class="premium-inline-actions premium-inline-actions-contextual">
                    <button type="button" class="premium-action premium-action-primary" data-premium-action="save-highlight-text" ${selectedPart ? "" : "disabled"}>Salvar texto</button>
                    <button type="button" class="premium-action premium-action-secondary" data-premium-action="copy-highlight-text" ${selectedPart ? "" : "disabled"}>Copiar trecho</button>
                    <button type="button" class="premium-action premium-action-secondary" data-premium-action="toggle-highlight-selection" ${selectedPart ? "" : "disabled"}>${selectedPart && selectedPart.highlight ? "Desmarcar trecho" : "Marcar trecho"}</button>
                    <button type="button" class="premium-action premium-action-secondary" data-premium-action="delete-highlight-text" ${selectedPart ? "" : "disabled"}>Apagar trecho</button>
                    <button type="button" class="premium-action premium-action-ghost" data-premium-action="restore-highlight-document">Voltar ao original da IA</button>
                    <button type="button" class="premium-action premium-action-ghost" data-premium-action="clear-all-highlights">Limpar marcacoes</button>
                </div>
            </div>
            <div class="premium-highlight-note">
                <strong>Documento integral preservado.</strong>
                <p>O texto já entra marcado pela IA e você ajusta tudo aqui dentro: remove trechos, acrescenta marcações, apaga palavras, reescreve e prepara a versão final antes de baixar.</p>
            </div>
            <div class="premium-highlight-doc">
                ${documentData.sections.map((section, sectionIndex) => `
                    <section class="premium-highlight-section">
                        <span class="premium-detail-label">${UI().escapeHtml(section.label)}</span>
                        <h3>${UI().escapeHtml(section.title)}</h3>
                        ${section.paragraphs.map((paragraph, paragraphIndex) =>
            renderHighlightParagraph(
                paragraph,
                sectionIndex,
                paragraphIndex,
                documentData.selectedPartId
            )
        ).join("")}
                    </section>
                `).join("")}
            </div>
        </article>
    </div>
</section>`;
    }

    function premiumLibrary(state) {
        const premiumLibraryFeature = Access()
            ? Access().FEATURES.PREMIUM_LIBRARY
            : "premium_library";
        const premiumLibraryEnabled = canAccess(premiumLibraryFeature, state);
        const activeItem = Store().getActiveLibraryItem();

        if (!premiumLibraryEnabled) {
            return `
<section class="premium-saved-shell">
    <article class="premium-empty-library premium-empty-library-locked">
        <span class="premium-panel-kicker">Biblioteca premium</span>
        <strong>O histórico completo de materiais fica liberado no premium.</strong>
        <p>Quando o plano premium estiver ativo, esta area passa a listar todos os PDFs e estudos carregados para consulta e retomada.</p>
    </article>
</section>`;
        }

        return `
<section class="premium-saved-shell">
    <div class="premium-saved-grid">
        <aside class="premium-saved-list">
            ${state.studyLibrary.length > 0 ? state.studyLibrary.map((item) => `
                <button type="button" class="premium-saved-card ${activeItem && activeItem.id === item.id ? "is-active" : ""}" data-premium-action="open-library-item" data-block-id="${item.id}">
                    <span>${UI().escapeHtml(item.savedAt ? new Date(item.savedAt).toLocaleDateString("pt-BR") : "Material")}</span>
                    <strong>${UI().escapeHtml(item.title)}</strong>
                    <p>${UI().escapeHtml(item.materialName)}</p>
                </button>
            `).join("") : `
                <article class="premium-empty-library">
                    <strong>Nenhum material salvo ainda.</strong>
                    <p>Assim que você carregar PDFs e avançar no fluxo, eles passam a aparecer aqui.</p>
                </article>
            `}
        </aside>
        <article class="premium-saved-preview">
            ${activeItem ? `
                <span class="premium-panel-kicker">Material salvo</span>
                <h2>${UI().escapeHtml(activeItem.title)}</h2>
                <p class="premium-learn-lead">${UI().escapeHtml(activeItem.materialName)}</p>
                <section class="premium-learn-section premium-learn-section-rich">
                    <span class="premium-detail-label">Ultimo estado salvo</span>
                    <h3>${UI().escapeHtml(activeItem.examDateLabel || "Data da prova não definida")}</h3>
                    ${renderBulletList([
                        `Meta registrada: ${Number(activeItem.targetScore || 0).toFixed(1)} / 10`,
                        `Carga planejada: ${activeItem.studyHours || 0}h ${String(activeItem.studyMinutes || 0).padStart(2, "0")}min`,
                        `Etapa salva: ${activeItem.step || "entry"}`
                    ])}
                </section>
                ${UI().actionBar([
                    { action: "resume-library-item", label: "Abrir estudo salvo", variant: "primary" },
                    ...(activeItem.pdfAvailable
                        ? [{ action: "resume-library-pdf", label: "Abrir texto do PDF", variant: "secondary" }]
                        : [])
                ])}
            ` : `
                <div class="premium-empty-library">
                    <strong>Sua biblioteca premium fica aqui.</strong>
                    <p>Quando você carregar materiais, eles passam a ficar guardados nesta área para retomada futura.</p>
                </div>
            `}
        </article>
    </div>
</section>
${renderSessionNote(state, "premium-library")}`;
    }

    function pdfWorkbench(state) {
        const viewerState = state.pdfWorkbenchState || {};
        const editorText = state.pdfWorkbenchText || state.materialExtractedText || "";
        const editorHtml = state.pdfWorkbenchHtml || UI().escapeHtml(editorText).replace(/\r?\n/g, "<br>");
        const aiHighlights = Array.isArray(state.aiHighlights)
            ? state.aiHighlights.filter((item) => !item.dismissed)
            : [];
        const selectedHighlight = aiHighlights.find((item) => item.id === viewerState.selectedAiHighlightId)
            || aiHighlights[0]
            || null;
        const activeBlock = Store().getActiveBlock();
        const lineCount = editorText ? editorText.split(/\r?\n/).length : 0;
        const charCount = editorText.length;
        const markerColors = [
            { value: "rgba(255, 203, 109, 0.48)", label: "Amarelo" },
            { value: "rgba(88, 227, 183, 0.38)", label: "Verde" },
            { value: "rgba(121, 213, 255, 0.38)", label: "Azul" },
            { value: "rgba(255, 151, 188, 0.38)", label: "Rosa" }
        ];

        return `
<section class="premium-pdf-shell ${viewerState.fullScreen ? "is-fullscreen" : ""}">
    <aside class="premium-pdf-sidebar premium-pdf-sidebar-tools">
        <label class="premium-pdf-field premium-pdf-field-compact" for="premiumPdfSearchInput">
            <input id="premiumPdfSearchInput" type="text" value="${UI().escapeHtml(viewerState.searchQuery || "")}" placeholder="Buscar no texto" />
        </label>
        <div class="premium-pdf-tool-cluster">
            <button type="button" class="premium-pdf-tool-button" data-premium-action="pdf-search" aria-label="Buscar" title="Buscar">
                <span class="premium-pdf-tool-glyph">âŒ•</span>
                <span class="premium-pdf-tool-label">Buscar</span>
            </button>
            <button type="button" class="premium-pdf-tool-button" data-premium-action="pdf-clear-search" aria-label="Limpar busca" title="Limpar busca">
                <span class="premium-pdf-tool-glyph">×</span>
                <span class="premium-pdf-tool-label">Limpar</span>
            </button>
        </div>
        <div class="premium-pdf-tool-cluster">
            <button type="button" class="premium-pdf-tool-button" data-premium-action="save-pdf-workbench" aria-label="Salvar texto" title="Salvar texto">
                <span class="premium-pdf-tool-glyph">â†§</span>
                <span class="premium-pdf-tool-label">Salvar</span>
            </button>
            <button type="button" class="premium-pdf-tool-button" data-premium-action="copy-pdf-workbench-text" aria-label="Copiar tudo" title="Copiar tudo">
                <span class="premium-pdf-tool-glyph">âŽ˜</span>
                <span class="premium-pdf-tool-label">Copiar</span>
            </button>
            <button type="button" class="premium-pdf-tool-button" data-premium-action="restore-pdf-workbench-text" aria-label="Voltar ao extraído" title="Voltar ao extraído">
                <span class="premium-pdf-tool-glyph">â†º</span>
                <span class="premium-pdf-tool-label">Original</span>
            </button>
        </div>
        <div class="premium-pdf-tool-cluster premium-pdf-tool-cluster-colors">
            ${markerColors.map((color) => `
                <button
                    type="button"
                    class="premium-pdf-color-button"
                    data-premium-action="set-pdf-highlight-color"
                    data-item-value="${UI().escapeHtml(color.value)}"
                    title="Marca-texto ${UI().escapeHtml(color.label)}"
                    aria-label="Marca-texto ${UI().escapeHtml(color.label)}"
                    style="background:${UI().escapeHtml(color.value)}; --pdf-marker-color:${UI().escapeHtml(color.value)}"
                ></button>
            `).join("")}
            <button type="button" class="premium-pdf-tool-button premium-pdf-tool-button-clear" data-premium-action="clear-pdf-highlight" aria-label="Limpar marca-texto" title="Limpar marca-texto">
                <span class="premium-pdf-tool-glyph">-</span>
                <span class="premium-pdf-tool-label">Limpar cor</span>
            </button>
        </div>
        <div class="premium-pdf-tool-cluster">
            <button type="button" class="premium-pdf-tool-button premium-pdf-tool-button-ai" data-premium-action="pdf-ai-highlight-all" aria-label="Destacar com IA o texto todo" title="Destacar com IA o texto todo" ${editorText ? "" : "disabled"}>
                <span class="premium-pdf-tool-glyph">AI</span>
                <span class="premium-pdf-tool-label">Destacar IA</span>
            </button>
            <button type="button" class="premium-pdf-tool-button premium-pdf-tool-button-ai" data-premium-action="pdf-ai-highlight-block" aria-label="Destacar com IA este bloco" title="Destacar com IA este bloco" ${activeBlock ? "" : "disabled"}>
                <span class="premium-pdf-tool-glyph">AI</span>
                <span class="premium-pdf-tool-label">No bloco</span>
            </button>
        </div>
        <div class="premium-pdf-tool-cluster">
            <button type="button" class="premium-pdf-tool-button" data-premium-action="download-original-pdf" aria-label="Baixar PDF original" title="Baixar PDF original" ${state.pdfAssetId ? "" : "disabled"}>
                <span class="premium-pdf-tool-glyph">â†“</span>
                <span class="premium-pdf-tool-label">Baixar</span>
            </button>
            <button type="button" class="premium-pdf-tool-button" data-premium-action="${viewerState.fullScreen ? "collapse-pdf-workbench" : "expand-pdf-workbench"}" aria-label="${viewerState.fullScreen ? "Sair da tela cheia" : "Abrir em tela cheia"}" title="${viewerState.fullScreen ? "Sair da tela cheia" : "Abrir em tela cheia"}">
                <span class="premium-pdf-tool-glyph">${viewerState.fullScreen ? "â¤¡" : "â¤¢"}</span>
                <span class="premium-pdf-tool-label">${viewerState.fullScreen ? "Sair" : "Tela"}</span>
            </button>
        </div>
    </aside>
    <div class="premium-pdf-reader">
        <div class="premium-pdf-reader-shell premium-pdf-editor-shell">
            <header class="premium-pdf-reader-head">
                <div>
                    <span class="premium-panel-kicker">Editor do material</span>
                    <strong>${UI().escapeHtml(state.studyTitle || state.materialName || "Texto extraído")}</strong>
                </div>
                <div class="premium-pdf-reader-meta">
                    <span>${lineCount} linha(s)</span>
                    <span>${charCount} caracteres</span>
                </div>
            </header>
            <div
                id="premiumPdfWorkbenchEditor"
                class="premium-pdf-textarea premium-pdf-rich-editor"
                contenteditable="true"
                spellcheck="false"
                data-placeholder="O texto extraído do PDF aparece aqui para você editar."
            >${editorHtml}</div>
            <div class="premium-pdf-support-grid">
                <section class="premium-pdf-panel premium-pdf-panel-support">
                    <div class="premium-pdf-meta">
                        <span>${UI().escapeHtml(state.materialSizeLabel || "PDF")}</span>
                        <span>${Number(state.materialPageCount || 0) > 0 ? `${Number(state.materialPageCount)} pagina(s)` : "Paginas em leitura"}</span>
                        <span>${lineCount} linha(s)</span>
                        <span>${charCount} caracteres</span>
                    </div>
                    <p class="premium-pdf-footnote">${UI().escapeHtml(state.pdfSyncStatus === "synced"
            ? "PDF e anotações sincronizados."
            : state.pdfSyncStatus === "syncing"
                ? "Sincronizando workspace."
                : state.accountAuthenticated
                    ? "Pronto para sincronizar."
                    : "Sem login, o workspace fica salvo neste navegador.")}</p>
                </section>
                <section class="premium-pdf-panel premium-pdf-panel-context">
                    ${selectedHighlight ? `
                        <strong>${UI().escapeHtml(selectedHighlight.contextLabel || "Trecho importante")}</strong>
                        <p>${UI().escapeHtml(selectedHighlight.reason || "A IA marcou este trecho por relevancia para sua prova.")}</p>
                        <div class="premium-pdf-context-meta">
                            <span>Importancia: ${UI().escapeHtml(selectedHighlight.importance || "alta")}</span>
                            <span>${selectedHighlight.source === "user" ? "Marcacao manual" : "Marcacao da IA"}</span>
                        </div>
                        <blockquote>${UI().escapeHtml(selectedHighlight.quote || selectedHighlight.anchor || "")}</blockquote>
                        <div class="premium-inline-actions premium-inline-actions-contextual">
                            <button type="button" class="premium-action premium-action-secondary" data-premium-action="jump-to-pdf-ai-highlight">Ir ao trecho</button>
                            <button type="button" class="premium-action premium-action-secondary" data-premium-action="promote-pdf-ai-highlight">Manual</button>
                            <button type="button" class="premium-action premium-action-ghost" data-premium-action="dismiss-pdf-ai-highlight">Remover</button>
                        </div>
                    ` : `
                        <p class="premium-pdf-footnote">Acione a IA para localizar os trechos mais importantes do material.</p>
                    `}
                </section>
            </div>
            <div class="premium-pdf-highlight-list premium-pdf-highlight-list-inline">
                ${aiHighlights.length > 0 ? aiHighlights.map((item) => `
                    <button type="button" class="premium-pdf-highlight-card ${selectedHighlight && selectedHighlight.id === item.id ? "is-active" : ""}" data-premium-action="select-pdf-ai-highlight" data-item-value="${UI().escapeHtml(item.id)}">
                        <span>${UI().escapeHtml(item.contextLabel || "Trecho importante")}</span>
                        <strong>${UI().escapeHtml(item.quote || item.anchor || "Trecho identificado")}</strong>
                        <small>${UI().escapeHtml(item.reason || "A IA trouxe este trecho como ponto importante para o estudo.")}</small>
                    </button>
                `).join("") : `
                    <article class="premium-empty-library premium-empty-library-locked premium-pdf-empty-state">
                        <strong>Nenhum grifo gerado ainda.</strong>
                        <p>Acione a IA para localizar as passagens mais importantes com contexto.</p>
                    </article>
                `}
            </div>
        </div>
    </div>
</section>
${renderSessionNote(state, "pdf-workbench")}`;
    }

    function pdfWorkbench(state) {
        const aiHighlightFeature = Access()
            ? Access().FEATURES.AI_TEXT_HIGHLIGHT
            : "ai_text_highlight";
        const aiHighlightEnabled = canAccess(aiHighlightFeature, state);
        const viewerState = state.pdfWorkbenchState || {};
        const editorText = state.pdfWorkbenchText || state.materialExtractedText || "";
        const editorHtml = state.pdfWorkbenchHtml || UI().escapeHtml(editorText).replace(/\r?\n/g, "<br>");
        const aiHighlights = Array.isArray(state.aiHighlights)
            ? state.aiHighlights.filter((item) => !item.dismissed)
            : [];
        const selectedHighlight = aiHighlights.find((item) => item.id === viewerState.selectedAiHighlightId)
            || aiHighlights[0]
            || null;
        const lineCount = editorText ? editorText.split(/\r?\n/).length : 0;
        const charCount = editorText.length;
        const markerColors = [
            { value: "rgba(255, 203, 109, 0.48)", label: "Amarelo" },
            { value: "rgba(88, 227, 183, 0.38)", label: "Verde" },
            { value: "rgba(121, 213, 255, 0.38)", label: "Azul" },
            { value: "rgba(255, 151, 188, 0.38)", label: "Rosa" }
        ];

        return `
<section class="premium-pdf-shell ${viewerState.fullScreen ? "is-fullscreen" : ""}">
    <aside class="premium-pdf-sidebar premium-pdf-sidebar-tools">
        <label class="premium-pdf-field premium-pdf-field-compact" for="premiumPdfSearchInput">
            <input id="premiumPdfSearchInput" type="text" value="${UI().escapeHtml(viewerState.searchQuery || "")}" placeholder="Buscar no texto" />
        </label>
        <div class="premium-pdf-tool-cluster">
            <button type="button" class="premium-pdf-tool-button" data-premium-action="pdf-search" aria-label="Buscar" title="Buscar">
                <span class="premium-pdf-tool-glyph">Q</span>
                <span class="premium-pdf-tool-label">Buscar</span>
            </button>
            <button type="button" class="premium-pdf-tool-button" data-premium-action="pdf-clear-search" aria-label="Limpar busca" title="Limpar busca">
                <span class="premium-pdf-tool-glyph">X</span>
                <span class="premium-pdf-tool-label">Limpar</span>
            </button>
        </div>
        <div class="premium-pdf-tool-cluster">
            <button type="button" class="premium-pdf-tool-button" data-premium-action="save-pdf-workbench" aria-label="Salvar texto" title="Salvar texto">
                <span class="premium-pdf-tool-glyph">S</span>
                <span class="premium-pdf-tool-label">Salvar</span>
            </button>
            <button type="button" class="premium-pdf-tool-button" data-premium-action="copy-pdf-workbench-text" aria-label="Copiar tudo" title="Copiar tudo">
                <span class="premium-pdf-tool-glyph">C</span>
                <span class="premium-pdf-tool-label">Copiar</span>
            </button>
            <button type="button" class="premium-pdf-tool-button" data-premium-action="restore-pdf-workbench-text" aria-label="Voltar ao extraído" title="Voltar ao extraído">
                <span class="premium-pdf-tool-glyph">R</span>
                <span class="premium-pdf-tool-label">Original</span>
            </button>
        </div>
        <div class="premium-pdf-tool-cluster premium-pdf-tool-cluster-colors">
            ${markerColors.map((color) => `
                <button
                    type="button"
                    class="premium-pdf-color-button"
                    data-premium-action="set-pdf-highlight-color"
                    data-item-value="${UI().escapeHtml(color.value)}"
                    title="Marca-texto ${UI().escapeHtml(color.label)}"
                    aria-label="Marca-texto ${UI().escapeHtml(color.label)}"
                    style="background:${UI().escapeHtml(color.value)}; --pdf-marker-color:${UI().escapeHtml(color.value)}"
                ></button>
            `).join("")}
            <button type="button" class="premium-pdf-tool-button premium-pdf-tool-button-clear" data-premium-action="clear-pdf-highlight" aria-label="Limpar marca-texto" title="Limpar marca-texto">
                <span class="premium-pdf-tool-glyph">-</span>
                <span class="premium-pdf-tool-label">Limpar cor</span>
            </button>
        </div>
        <div class="premium-pdf-tool-cluster">
            <button
                type="button"
                class="premium-pdf-tool-button premium-pdf-tool-button-ai ${aiHighlightEnabled ? "" : "is-locked"}"
                data-premium-action="pdf-ai-highlight-all"
                aria-label="${aiHighlightEnabled ? "Destacar com IA o texto todo" : "Destacar com IA (premium)"}"
                title="${aiHighlightEnabled ? "Destacar com IA o texto todo" : "Destacar com IA (premium)"}"
                ${editorText ? "" : "disabled"}
            >
                <span class="premium-pdf-tool-glyph">AI</span>
                <span class="premium-pdf-tool-label">AI destacar</span>
            </button>
        </div>
    </aside>
    <div class="premium-pdf-reader">
        <div class="premium-pdf-reader-shell premium-pdf-editor-shell">
            <header class="premium-pdf-reader-head">
                <div>
                    <span class="premium-panel-kicker">Editor do material</span>
                    <strong>${UI().escapeHtml(state.studyTitle || state.materialName || "Texto extraído")}</strong>
                </div>
                <div class="premium-pdf-reader-meta">
                    <span>${lineCount} linha(s)</span>
                    <span>${charCount} caracteres</span>
                </div>
            </header>
            ${viewerState.transientMessage ? `<div class="premium-pdf-inline-toast">${UI().escapeHtml(viewerState.transientMessage)}</div>` : ""}
            <div
                id="premiumPdfWorkbenchEditor"
                class="premium-pdf-textarea premium-pdf-rich-editor"
                contenteditable="true"
                spellcheck="false"
                data-placeholder="O texto extraído do PDF aparece aqui para você editar."
            >${editorHtml}</div>
            <div class="premium-pdf-support-grid">
                <section class="premium-pdf-panel premium-pdf-panel-support">
                    <div class="premium-pdf-meta">
                        <span>${UI().escapeHtml(state.materialSizeLabel || "PDF")}</span>
                        <span>${Number(state.materialPageCount || 0) > 0 ? `${Number(state.materialPageCount)} pagina(s)` : "Paginas em leitura"}</span>
                        <span>${lineCount} linha(s)</span>
                        <span>${charCount} caracteres</span>
                    </div>
                    <p class="premium-pdf-footnote">${UI().escapeHtml(state.pdfSyncStatus === "synced"
            ? "PDF e anotações sincronizados."
            : state.pdfSyncStatus === "syncing"
                ? "Sincronizando workspace."
                : state.accountAuthenticated
                    ? "Pronto para sincronizar."
                    : "Sem login, o workspace fica salvo neste navegador.")}</p>
                </section>
                <section class="premium-pdf-panel premium-pdf-panel-context">
                    ${selectedHighlight ? `
                        <strong>${UI().escapeHtml(selectedHighlight.contextLabel || "Trecho importante")}</strong>
                        <p>${UI().escapeHtml(selectedHighlight.reason || "A IA marcou este trecho por relevancia para sua prova.")}</p>
                        <div class="premium-pdf-context-meta">
                            <span>Importancia: ${UI().escapeHtml(selectedHighlight.importance || "alta")}</span>
                            <span>${selectedHighlight.source === "user" ? "Marcacao manual" : "Marcacao da IA"}</span>
                        </div>
                        <blockquote>${UI().escapeHtml(selectedHighlight.quote || selectedHighlight.anchor || "")}</blockquote>
                        <div class="premium-inline-actions premium-inline-actions-contextual">
                            <button type="button" class="premium-action premium-action-secondary" data-premium-action="jump-to-pdf-ai-highlight">Ir ao trecho</button>
                            <button type="button" class="premium-action premium-action-secondary" data-premium-action="promote-pdf-ai-highlight">Manual</button>
                            <button type="button" class="premium-action premium-action-ghost" data-premium-action="dismiss-pdf-ai-highlight">Remover</button>
                        </div>
                    ` : `
                        <p class="premium-pdf-footnote">Acione a IA para localizar os trechos mais importantes do material.</p>
                    `}
                </section>
            </div>
            <div class="premium-pdf-highlight-list premium-pdf-highlight-list-inline">
                ${aiHighlights.length > 0 ? aiHighlights.map((item) => `
                    <button type="button" class="premium-pdf-highlight-card ${selectedHighlight && selectedHighlight.id === item.id ? "is-active" : ""}" data-premium-action="select-pdf-ai-highlight" data-item-value="${UI().escapeHtml(item.id)}">
                        <span>${UI().escapeHtml(item.contextLabel || "Trecho importante")}</span>
                        <strong>${UI().escapeHtml(item.quote || item.anchor || "Trecho identificado")}</strong>
                        <small>${UI().escapeHtml(item.reason || "A IA trouxe este trecho como ponto importante para o estudo.")}</small>
                    </button>
                `).join("") : `
                    <article class="premium-empty-library premium-empty-library-locked premium-pdf-empty-state">
                        <strong>Nenhum grifo gerado ainda.</strong>
                        <p>Acione a IA para localizar as passagens mais importantes com contexto.</p>
                    </article>
                `}
            </div>
        </div>
    </div>
</section>
${renderSessionNote(state, "pdf-workbench")}`;
    }

    function premiumCheckout(state) {
        const access = Access();
        const billing = window.PremiumStudyBilling;
        const premiumActive = access && typeof access.isPremiumLike === "function"
            ? access.isPremiumLike(state)
            : state.accessTier === "premium";
        const feature = state.premiumOffer && state.premiumOffer.feature
            ? state.premiumOffer.feature
            : premiumLibraryFeatureFallback();
        const offer = state.premiumOffer || (access
            ? access.buildOffer(feature)
            : {
                eyebrow: "Premium",
                title: "Libere continuidade e profundidade.",
                lead: "O grátis entrega a base. O premium entra quando você quer mais materiais, mais treino e mais continuidade.",
                benefits: ["Histórico completo", "Treinos extras", "Recursos avançados"],
                cta: "Conhecer premium"
            });
        const plans = billing && typeof billing.getPlans === "function"
            ? billing.getPlans()
            : [];
        const recommendedPlanId = offer.recommendedPlanId
            || (plans.find((plan) => plan.recommended) || {}).id
            || "";
        const orderedPlans = [...plans].sort((left, right) => {
            const leftScore = left.id === recommendedPlanId ? 2 : (left.recommended ? 1 : 0);
            const rightScore = right.id === recommendedPlanId ? 2 : (right.recommended ? 1 : 0);
            return rightScore - leftScore;
        });
        const providerStatus = billing && typeof billing.getProviderStatus === "function"
            ? billing.getProviderStatus()
            : { checkoutReady: false, message: "Checkout real ainda não foi conectado." };
        const primaryBenefits = Array.isArray(offer.benefits)
            ? offer.benefits.slice(0, 3)
            : [];
        const scannedPdfFeature = Access()
            ? Access().FEATURES.SCANNED_PDF_TEXT
            : "scanned_pdf_text";
        const scannedPdfExplainer = feature === scannedPdfFeature
            ? `
    <article class="premium-paywall-explainer premium-paywall-explainer-scanned">
        <span class="premium-panel-kicker">Conversão premium de PDF</span>
        <strong>Isto não é erro no sistema.</strong>
        <p>Seu arquivo parece imagem ou PDF escaneado. No grátis, o editor abre quando o documento já vem com texto legível. Para este caso, o premium usa IA para converter o arquivo em texto editável.</p>
        <ul>
            <li>Se a leitura grátis não encontrou texto suficiente, o comportamento esperado é abrir esta oferta.</li>
            <li>Depois da assinatura, o sistema tenta gerar o texto integral e usar essa base para atualizar Aprender, Praticar e Prova.</li>
        </ul>
    </article>`
            : "";
        const benefitGroups = [
            {
                tone: "continuity",
                title: "Continuidade",
                items: [
                    "Retome qualquer PDF salvo",
                    "Biblioteca completa por objetivo",
                    "PDFs longos com divisão inteligente"
                ]
            },
            {
                tone: "depth",
                title: "Mais profundidade",
                items: [
                    "Questionários extras por assunto",
                    "V/F extras para pegar pegadinhas",
                    "Flashcards extras com mnemônicos"
                ]
            },
            {
                tone: "performance",
                title: "Mais desempenho",
                items: [
                    "Mini provas extras por assunto",
                    "Estatísticas de evolução e pontos fracos",
                    "Exportação dos marcadores em PDF"
                ]
            }
        ];
        const comparisonRows = [
            { label: "Ultimo estudo salvo", free: "Sim", premium: "Sim" },
            { label: "Outros estudos guardados", free: "Não", premium: "Sim" },
            { label: "PDFs longos", free: "Até 8 páginas", premium: "Ilimitado" },
            { label: "PDF escaneado em texto", free: "Não", premium: "Sim" },
            { label: "Questionários, V/F e flashcards", free: "3 rodadas", premium: "Novas rodadas" },
            { label: "Mini prova do assunto", free: "Base", premium: "Extras" },
            { label: "Estatísticas e pontos fracos", free: "Não", premium: "Sim" }
        ];

        if (premiumActive) {
            return `
<section class="premium-paywall-shell">
    <article class="premium-paywall-hero premium-paywall-hero-active">
        <span class="premium-panel-kicker">Premium ativo</span>
        <h2>Seu workspace completo já está liberado.</h2>
        <p>Agora a experiência precisa servir ao estudo, não vender acesso. Use a biblioteca, envie materiais longos e retome sua trilha com tudo disponível.</p>
        <div class="premium-paywall-benefit-groups" aria-label="Recursos premium ativos">
            ${benefitGroups.map((group) => `
            <article class="premium-paywall-benefit-card premium-paywall-benefit-card-${group.tone}">
                <span class="premium-paywall-benefit-label">${group.title}</span>
                <ul>
                    ${group.items.map((item) => `<li>${item}</li>`).join("")}
                </ul>
            </article>`).join("")}
        </div>
    </article>
    <article class="premium-paywall-status premium-paywall-status-active">
        <strong>Premium confirmado neste workspace</strong>
        <p>Biblioteca, PDFs extensos, extras de prática e recursos avançados já fazem parte da sua rotina daqui para frente.</p>
    </article>
    ${renderSessionNote(state, "premium-checkout")}
    ${UI().actionBar([
        { action: "open-premium-library", label: "Abrir biblioteca", variant: "primary" },
        { action: "back", label: "Voltar ao estudo", variant: "secondary" }
    ])}
</section>`;
        }

        return `
<section class="premium-paywall-shell">
    <article class="premium-paywall-hero">
        <span class="premium-panel-kicker">${UI().escapeHtml(offer.eyebrow || "Premium")}</span>
        <h2>${UI().escapeHtml(offer.title || "Seu histórico, seus materiais e seus treinos em um só lugar.")}</h2>
        <p>${UI().escapeHtml(offer.lead || "Continue qualquer estudo, libere extras por assunto e acompanhe sua evolucao sem perder o fio da trilha.")}</p>
        ${scannedPdfExplainer}
        ${primaryBenefits.length ? `
        <article class="premium-paywall-benefit-card premium-paywall-benefit-card-continuity">
            <span class="premium-paywall-benefit-label">Foco desta oferta</span>
            <ul>
                ${primaryBenefits.map((item) => `<li>${UI().escapeHtml(item)}</li>`).join("")}
            </ul>
        </article>` : ""}
        <div class="premium-paywall-benefit-groups" aria-label="Beneficios do premium">
            ${benefitGroups.map((group) => `
            <article class="premium-paywall-benefit-card premium-paywall-benefit-card-${group.tone}">
                <span class="premium-paywall-benefit-label">${group.title}</span>
                <ul>
                    ${group.items.map((item) => `<li>${item}</li>`).join("")}
                </ul>
            </article>`).join("")}
        </div>
    </article>
    <div class="premium-plan-grid">
        ${orderedPlans.map((plan) => {
            const isRecommended = plan.id === recommendedPlanId || (!recommendedPlanId && plan.recommended);

            return `
        <button type="button" class="premium-plan-card ${isRecommended ? "is-recommended" : ""}" data-premium-action="start-premium-checkout" data-item-value="${UI().escapeHtml(plan.id)}">
            <span>${isRecommended ? "Mais indicado agora" : "Flexivel"}</span>
            <strong>${UI().escapeHtml(plan.label)}</strong>
            <em>${UI().escapeHtml(plan.priceLabel)}</em>
            <p>${UI().escapeHtml(plan.description || "")}</p>
            <small>${UI().escapeHtml(isRecommended
                ? (offer.cta || "Oferta destacada agora.")
                : (plan.interval === "year" ? "Cobranca anual." : "Cobranca mensal."))}</small>
        </button>`;
        }).join("")}
    </div>
    <article class="premium-comparison-card">
        <div class="premium-comparison-head">
            <span class="premium-panel-kicker">Comparativo rápido</span>
            <strong>O que muda do grátis para o premium</strong>
        </div>
        <div class="premium-comparison-table" role="table" aria-label="Comparativo grátis e premium">
            <div class="premium-comparison-row premium-comparison-row-head" role="row">
                <span role="columnheader">Recurso</span>
                <span role="columnheader">Gratis</span>
                <span role="columnheader">Premium</span>
            </div>
            ${comparisonRows.map((row) => `
            <div class="premium-comparison-row" role="row">
                <strong role="cell">${row.label}</strong>
                <span role="cell" class="is-free">${row.free}</span>
                <span role="cell" class="is-premium">${row.premium}</span>
            </div>`).join("")}
        </div>
    </article>
    <article class="premium-paywall-status">
        <strong>${providerStatus.checkoutReady ? "Checkout pronto" : "Checkout em preparacao"}</strong>
        <p>${UI().escapeHtml(providerStatus.message || "O provedor real será conectado na próxima etapa.")}</p>
    </article>
    ${renderSessionNote(state, "premium-checkout")}
    ${UI().actionBar([
        { action: "back", label: "Voltar", variant: "secondary" }
    ])}
</section>`;
    }

    function premiumLibraryFeatureFallback() {
        return Access()
            ? Access().FEATURES.PREMIUM_LIBRARY
            : "premium_library";
    }

    function practice(state) {
        const quizSeriesMeta = Store().getPracticeSeriesMeta("quiz");
        const trueFalseSeriesMeta = Store().getPracticeSeriesMeta("trueFalse");
        const flashcardSeriesMeta = Store().getPracticeSeriesMeta("flashcards");
        const quizSlots = getPracticeSlots(state, "quiz", quizSeriesMeta);
        const trueFalseSlots = getPracticeSlots(state, "trueFalse", trueFalseSeriesMeta);
        const flashcardSlots = getPracticeSlots(state, "flashcards", flashcardSeriesMeta);

        return `
<section class="premium-practice-grid premium-practice-grid-simple">
    ${renderPracticeCard({
        action: "open-quiz",
        type: "quiz",
        label: "Questionário",
        title: "Multipla escolha",
        description: "Treino direto para critério, leitura e decisão.",
        slots: quizSlots,
        seriesMeta: quizSeriesMeta,
        primary: true
    })}
    ${renderPracticeCard({
        action: "open-true-false",
        type: "trueFalse",
        label: "Verdadeiro ou falso",
        title: "Criterio e contraste",
        description: "Bom para perceber pegadinha e limite da regra.",
        slots: trueFalseSlots,
        seriesMeta: trueFalseSeriesMeta
    })}
    ${renderPracticeCard({
        action: "open-flashcards",
        type: "flashcards",
        label: "Flashcards",
        title: "Memorização ativa",
        description: "Mnemônicos, gatilhos e fixação rápida do bloco.",
        slots: flashcardSlots,
        seriesMeta: flashcardSeriesMeta
    })}
    ${renderSessionNote(state, "practice")}
</section>`;
    }

    function quiz(state) {
        const items = Store().getActiveQuizItems();
        const session = state.sessions[state.activeBlockId].quiz;
        const seriesMeta = Store().getPracticeSeriesMeta("quiz");
        const extraButtonLabel = seriesMeta.hasMoreFreeSeries
            ? "Gerar mais"
            : "Gerar mais no premium";
        const hits = items.reduce((sum, item, index) => (
            session.answers[index] === item.correctIndex ? sum + 1 : sum
        ), 0);

        if (session.isComplete) {
            const restartAction = seriesMeta.isAllComplete ? "restart-quiz" : "reset-quiz";
            const restartLabel = seriesMeta.isAllComplete ? "Refazer questionário" : "Refazer esta rodada";
            return `
<section class="premium-result-shell">
    <article class="premium-result-hero premium-result-hero-compact">
        <span class="premium-detail-label">Questionário concluído</span>
        <strong>${seriesMeta.completedCount}/${seriesMeta.freeSeriesLimit}</strong>
        <p>${seriesMeta.isAllComplete ? "Você concluiu as 3 rodadas grátis deste questionário." : "Você terminou esta rodada. Pode seguir para a próxima grátis."}</p>
    </article>
    ${UI().actionBar([
        { action: "open-practice", label: "Voltar para prática", variant: "secondary" },
        { action: restartAction, label: restartLabel, variant: "ghost" },
        { action: "request-extra-quiz", label: extraButtonLabel, variant: "primary" }
    ])}
    ${renderSessionNote(state, "quiz")}
</section>`;
        }

        const question = items[session.index];
        const hasAnswer = typeof session.answers[session.index] === "number";
        const answer = session.answers[session.index];

        return `
<section class="premium-quiz-shell">
    <div class="premium-question-meta">
        <span>Questão ${session.index + 1} de ${items.length}</span>
        <strong>Série ${seriesMeta.currentSeries}/${seriesMeta.freeSeriesLimit}</strong>
    </div>
    <article class="premium-question-card">
        <h2>${UI().escapeHtml(question.prompt)}</h2>
        <div class="premium-option-grid">
            ${question.options.map((option, index) => `
            <button
                type="button"
                class="premium-option-card
                    ${hasAnswer && answer === index ? "is-selected" : ""}
                    ${hasAnswer && index === question.correctIndex ? "is-correct" : ""}
                    ${hasAnswer && answer === index && answer !== question.correctIndex ? "is-incorrect" : ""}"
                data-premium-action="answer-quiz"
                data-answer-index="${index}"
                ${hasAnswer ? "disabled" : ""}
            >
                <span>${String.fromCharCode(65 + index)}</span>
                <strong>${UI().escapeHtml(option)}</strong>
            </button>`).join("")}
        </div>
        ${hasAnswer ? `
        <div class="premium-feedback-card ${answer === question.correctIndex ? "is-positive" : "is-warning"}">
            <strong>${answer === question.correctIndex ? "Boa leitura." : "Vale revisar esse ponto."}</strong>
            <p>${UI().escapeHtml(question.rationale)}</p>
        </div>
        ${UI().actionBar([
            { action: session.index >= items.length - 1 ? "finish-quiz" : "continue-quiz", label: session.index >= items.length - 1 ? "Ver resultado" : "Próxima", variant: "primary" }
        ])}
        ${renderSessionNote(state, "quiz")}` : ""}
    </article>
</section>`;
    }

    function trueFalse(state) {
        const block = Store().getActiveBlock();
        const session = state.sessions[state.activeBlockId].trueFalse;
        const items = Store().getActiveTrueFalseItems();
        const seriesMeta = Store().getPracticeSeriesMeta("trueFalse");
        const extraButtonLabel = seriesMeta.hasMoreFreeSeries
            ? "Gerar mais"
            : "Gerar mais no premium";

        return `
<section class="premium-vf-shell">
    <div class="premium-question-meta">
        <span>Série curta ${seriesMeta.currentSeries}/${seriesMeta.freeSeriesLimit}</span>
        <strong>${UI().escapeHtml(block.title)}</strong>
    </div>
    <div class="premium-vf-list">
        ${items.map((item, index) => {
            const selectedValue = session.answers[index];
            const trueClasses = [
                "premium-mini-toggle",
                !session.submitted && selectedValue === true ? "is-marked" : "",
                session.submitted && item.answer === true ? "is-result-correct" : "",
                session.submitted && selectedValue === true && item.answer !== true ? "is-result-wrong" : ""
            ].filter(Boolean).join(" ");
            const falseClasses = [
                "premium-mini-toggle",
                !session.submitted && selectedValue === false ? "is-marked" : "",
                session.submitted && item.answer === false ? "is-result-correct" : "",
                session.submitted && selectedValue === false && item.answer !== false ? "is-result-wrong" : ""
            ].filter(Boolean).join(" ");

            return `
        <article class="premium-vf-item ${session.focusIndex === index ? "is-focus" : ""}">
            <strong>${UI().escapeHtml(item.statement)}</strong>
            <div class="premium-vf-actions">
                <button type="button" class="${trueClasses}" data-premium-action="answer-true-false" data-item-index="${index}" data-item-value="true" aria-pressed="${selectedValue === true ? "true" : "false"}">V</button>
                <button type="button" class="${falseClasses}" data-premium-action="answer-true-false" data-item-index="${index}" data-item-value="false" aria-pressed="${selectedValue === false ? "true" : "false"}">F</button>
            </div>
            ${session.submitted ? `
            <p class="premium-vf-rationale ${session.answers[index] === item.answer ? "is-positive" : "is-warning"}">${UI().escapeHtml(item.rationale)}</p>` : ""}
        </article>`;
        }).join("")}
    </div>
    ${session.submitted
        ? UI().actionBar([
            { action: "open-practice", label: "Voltar para prática", variant: "secondary" },
            { action: seriesMeta.isAllComplete ? "restart-true-false" : "reset-true-false", label: seriesMeta.isAllComplete ? "Refazer V ou F" : "Refazer esta rodada", variant: "ghost" },
            { action: "request-extra-true-false", label: extraButtonLabel, variant: "primary" }
        ])
        : UI().actionBar([
            { action: "submit-true-false", label: "Corrigir respostas", variant: "primary" }
        ])}
    ${renderSessionNote(state, "true-false")}
</section>`;
    }

    function flashcards(state) {
        const items = Store().getActiveFlashcardItems();
        const session = state.sessions[state.activeBlockId].flashcards;
        const seriesMeta = Store().getPracticeSeriesMeta("flashcards");
        const extraButtonLabel = seriesMeta.hasMoreFreeSeries
            ? "Gerar mais"
            : "Gerar mais no premium";
        const card = items[session.index];
        const isDone = session.known.filter((value) => value === true).length;

        if (session.done) {
            const restartAction = seriesMeta.isAllComplete ? "restart-flashcards" : "reset-flashcards";
            const restartLabel = seriesMeta.isAllComplete ? "Refazer flashcards" : "Refazer esta rodada";
            return `
<section class="premium-result-shell">
    <article class="premium-result-hero premium-result-hero-compact">
        <span class="premium-detail-label">Flashcards concluídos</span>
        <strong>${seriesMeta.completedCount}/${seriesMeta.freeSeriesLimit}</strong>
        <p>${seriesMeta.isAllComplete ? "Você concluiu as 3 rodadas grátis de flashcards." : `Você marcou ${isDone} cards como entendidos nesta rodada.`}</p>
    </article>
    ${UI().actionBar([
        { action: "open-practice", label: "Voltar para prática", variant: "secondary" },
        { action: restartAction, label: restartLabel, variant: "ghost" },
        { action: "request-extra-flashcards", label: extraButtonLabel, variant: "primary" }
    ])}
    ${renderSessionNote(state, "flashcards")}
</section>`;
        }

        return `
<section class="premium-flashcards-shell">
    <div class="premium-question-meta">
        <span>Card ${session.index + 1} de ${items.length}</span>
        <strong>${isDone} marcados como entendidos</strong>
    </div>
    <article class="premium-flashcard-card ${session.flipped ? "is-flipped" : ""}">
        <span class="premium-detail-label">${session.flipped ? "Verso" : "Frente"}</span>
        <h2>${UI().escapeHtml(session.flipped ? card.back : card.front)}</h2>
        <p>${UI().escapeHtml(card.tip)}</p>
    </article>
    <div class="premium-inline-actions">
        <button type="button" class="premium-action premium-action-secondary" data-premium-action="flip-flashcard">${session.flipped ? "Voltar frente" : "Virar card"}</button>
        <button type="button" class="premium-action premium-action-ghost" data-premium-action="mark-flashcard-review">Revisar de novo</button>
        <button type="button" class="premium-action premium-action-primary" data-premium-action="mark-flashcard-known">Entendi</button>
    </div>
    ${renderSessionNote(state, "flashcards")}
</section>`;
    }

    function miniExam(state) {
        const block = Store().getActiveBlock();
        const session = state.sessions[state.activeBlockId].miniExam;
        if (!session.started || session.isComplete) {
            const hasHistory = Boolean(session.result);
            return `
<section class="premium-result-shell">
    <article class="premium-result-hero premium-result-hero-compact">
        <span class="premium-detail-label">Mini prova do assunto</span>
        <strong>${block.exam.questions.length || block.exam.baseCount || 5} questões</strong>
        <p>${hasHistory ? "Refaça a mesma mini prova deste assunto. Para novas questões e variações, o premium libera extras." : "Gere o pacote base deste assunto agora. Para um volume maior, o premium libera extras."}</p>
    </article>
    ${UI().actionBar([
        { action: hasHistory ? "retry-mini-exam" : "generate-mini-exam", label: hasHistory ? "Refazer mini prova" : `Gerar ${block.exam.questions.length || block.exam.baseCount || 5} questões`, variant: "primary" },
        { action: "request-extra-mini-exam", label: "Gerar mais 5 no premium", variant: "ghost" }
    ])}
    ${renderSessionNote(state, "mini-exam")}
</section>`;
        }

        const question = block.exam.questions[session.index];
        const hasAnswer = typeof session.answers[session.index] === "number";
        const answer = session.answers[session.index];
        const isCorrectAnswer = hasAnswer && answer === question.correctIndex;

        return `
<section class="premium-quiz-shell">
    <div class="premium-question-meta">
        <span>Mini prova ${session.index + 1} de ${block.exam.questions.length}</span>
        <strong>${UI().escapeHtml(block.title)}</strong>
    </div>
    <article class="premium-question-card">
        <h2>${UI().escapeHtml(question.prompt)}</h2>
        <div class="premium-option-grid">
            ${question.options.map((option, index) => `
            <button
                type="button"
                class="premium-option-card
                    ${hasAnswer && answer === index ? "is-selected" : ""}
                    ${hasAnswer && index === question.correctIndex ? "is-correct" : ""}
                    ${hasAnswer && answer === index && answer !== question.correctIndex ? "is-incorrect" : ""}"
                data-premium-action="answer-mini-exam"
                data-answer-index="${index}"
                ${hasAnswer ? "disabled" : ""}
            >
                <span>${String.fromCharCode(65 + index)}</span>
                <strong>${UI().escapeHtml(option)}</strong>
            </button>`).join("")}
        </div>
        ${hasAnswer ? `
        <div class="premium-feedback-card ${isCorrectAnswer ? "is-positive" : "is-warning"}">
            <strong>${isCorrectAnswer ? "Resposta correta." : "Resposta incorreta."}</strong>
            <p>${UI().escapeHtml(question.rationale)}</p>
        </div>
        ${UI().actionBar([
            { action: session.index >= block.exam.questions.length - 1 ? "finish-mini-exam" : "continue-mini-exam", label: session.index >= block.exam.questions.length - 1 ? "Ver resultado" : "Próxima", variant: "primary" }
        ])}` : ""}
        ${renderSessionNote(state, "mini-exam")}
    </article>
</section>`;
    }

    function examResult(state) {
        const block = Store().getActiveBlock();
        const result = state.sessions[state.activeBlockId].miniExam.result || { correct: 0, total: 0, ratio: 0 };
        const label = result.ratio >= 70 ? "Bom rendimento" : result.ratio >= 40 ? "Precisa consolidar" : "Volte para a base";

        return `
<section class="premium-result-shell">
    <article class="premium-result-hero">
        <span class="premium-detail-label">Resultado do bloco</span>
        <strong>${result.ratio}%</strong>
        <p>${result.correct} de ${result.total} itens corretos em ${UI().escapeHtml(block.title)}.</p>
        <div class="premium-result-badge">${label}</div>
    </article>
    <div class="premium-detail-grid">
        <article class="premium-detail-card">
            <span class="premium-detail-label">Leitura recomendada</span>
            <strong>Volte ao resumo se errou critério ou linguagem.</strong>
        </article>
        <article class="premium-detail-card">
            <span class="premium-detail-label">Próximo passo</span>
            <strong>${result.ratio >= 70 ? "Você já pode seguir para o próximo bloco." : "Pratique mais antes de avançar."}</strong>
        </article>
    </div>
    ${UI().actionBar([
        { action: "retry-mini-exam", label: "Refazer mini prova", variant: "secondary" },
        { action: "open-practice", label: "Ir para o modo prática", variant: "secondary" },
        { action: "request-extra-mini-exam", label: "Gerar mais 5 no premium", variant: "ghost" }
    ])}
</section>`;
    }

    function levelExam(state) {
        const exam = state.levelExam || {};
        const questions = Array.isArray(exam.questions) ? exam.questions : [];
        const result = exam.result || { correct: 0, total: 0, ratio: 0 };
        const counts = [10, 20, 30];

        if (exam.isComplete) {
            return `
<section class="premium-result-shell">
    <article class="premium-result-hero">
        <span class="premium-detail-label">Prova de nível premium</span>
        <strong>${result.ratio}%</strong>
        <p>${result.correct} de ${result.total} questões corretas no teste geral.</p>
        <div class="premium-result-badge">${result.ratio >= 75 ? "Pronto para acelerar" : result.ratio >= 50 ? "Base em construcao" : "Volte aos blocos principais"}</div>
    </article>
    ${UI().actionBar([
        { action: "generate-level-exam", label: "Gerar nova prova", variant: "primary" },
        { action: "back-to-mode-select", label: "Voltar para modos", variant: "secondary" }
    ])}
    ${renderSessionNote(state, "level-exam")}
</section>`;
        }

        if (exam.started && questions.length) {
            const question = questions[exam.index] || questions[0];
            const hasAnswer = typeof exam.answers[exam.index] === "number";
            const answer = exam.answers[exam.index];
            const isCorrectAnswer = hasAnswer && answer === question.correctIndex;

            return `
<section class="premium-quiz-shell">
    <div class="premium-question-meta">
        <span>Prova ${exam.index + 1} de ${questions.length}</span>
        <strong>${UI().escapeHtml(exam.title || "Prova de nível")}</strong>
    </div>
    <article class="premium-question-card">
        <h2>${UI().escapeHtml(question.prompt)}</h2>
        <div class="premium-option-grid">
            ${question.options.map((option, index) => `
            <button
                type="button"
                class="premium-option-card
                    ${hasAnswer && answer === index ? "is-selected" : ""}
                    ${hasAnswer && index === question.correctIndex ? "is-correct" : ""}
                    ${hasAnswer && answer === index && answer !== question.correctIndex ? "is-incorrect" : ""}"
                data-premium-action="answer-level-exam"
                data-answer-index="${index}"
                ${hasAnswer ? "disabled" : ""}
            >
                <span>${String.fromCharCode(65 + index)}</span>
                <strong>${UI().escapeHtml(option)}</strong>
            </button>`).join("")}
        </div>
        ${hasAnswer ? `
        <div class="premium-feedback-card ${isCorrectAnswer ? "is-positive" : "is-warning"}">
            <strong>${isCorrectAnswer ? "Resposta correta." : "Resposta incorreta."}</strong>
            <p>${UI().escapeHtml(question.rationale)}</p>
        </div>
        ${UI().actionBar([
            { action: exam.index >= questions.length - 1 ? "finish-level-exam" : "continue-level-exam", label: exam.index >= questions.length - 1 ? "Ver resultado" : "Proxima", variant: "primary" }
        ])}` : ""}
        ${renderSessionNote(state, "level-exam")}
    </article>
</section>`;
        }

        return `
<section class="premium-result-shell premium-level-exam-setup">
    <article class="premium-result-hero premium-result-hero-compact">
        <span class="premium-detail-label">Prova de nível premium</span>
        <strong>${exam.questionCount || 10} questões</strong>
        <p>Escolha o tamanho da prova para medir sua prontidão geral no PDF.</p>
    </article>
    <div class="premium-level-exam-actions">
        <div class="premium-level-exam-counts" aria-label="Tamanho da prova">
            ${counts.map((count) => `
            <button type="button" class="premium-action ${Number(exam.questionCount || 10) === count ? "premium-action-primary" : "premium-action-secondary"}" data-premium-action="select-level-exam-count" data-item-value="${count}">
                ${count} questões
            </button>`).join("")}
        </div>
        ${UI().actionBar([
        { action: questions.length ? "start-level-exam" : "generate-level-exam", label: questions.length ? "Entrar nas questões" : `Gerar e começar ${exam.questionCount || 10} questões`, variant: "primary" },
        { action: "back-to-mode-select", label: "Voltar para modos", variant: "secondary" }
    ])}
    </div>
    ${renderSessionNote(state, "level-exam")}
</section>`;
    }

    function trail(state) {
        const progress = Store().getOverallProgress();
        return `
<section class="premium-trail-shell">
    <article class="premium-result-hero premium-result-hero-compact">
        <span class="premium-detail-label">Progresso geral</span>
        <strong>${progress.ratio}%</strong>
        <p>${progress.completed} etapas concluídas de ${progress.total} nesta trilha.</p>
    </article>
    <div class="premium-trail-list">
        ${state.blocks.map((block) => `
        <button type="button" class="premium-trail-card ${state.activeBlockId === block.id ? "is-active" : ""}" data-premium-action="select-block" data-block-id="${block.id}">
            <div>
                <span class="premium-detail-label">${UI().escapeHtml(block.duration)}</span>
                <strong>${UI().escapeHtml(block.title)}</strong>
                <p>${UI().escapeHtml(block.subtitle)}</p>
            </div>
            <div class="premium-trail-progress">
                <span class="${block.progress.learn ? "is-done" : ""}">Aprender</span>
                <span class="${block.progress.practice ? "is-done" : ""}">Praticar</span>
                <span class="${block.progress.exam ? "is-done" : ""}">Prova</span>
            </div>
        </button>`).join("")}
    </div>
    ${UI().actionBar([
        { action: "rename-study", label: "Renomear estudo", variant: "ghost" },
        { action: "return-to-block", label: "Continuar bloco", variant: "primary" }
    ])}
</section>`;
    }

    window.PremiumStudyViews = {
        render(step, state) {
            switch (step) {
            case "exam-date":
                return buildCalendar(state);
            case "target-score":
                return targetScore(state);
            case "study-time":
                return studyTime(state);
            case "analysis":
                return analysisBranded(state);
            case "mode-select":
                return modeSelect(state);
            case "highlight-preview":
                return highlightPreview(state);
            case "pdf-workbench":
                return pdfWorkbench(state);
            case "learn-map":
                return learnMap(state);
            case "practice":
                return practice(state);
            case "quiz":
                return quiz(state);
            case "true-false":
                return trueFalse(state);
            case "flashcards":
                return flashcards(state);
            case "mini-exam":
                return miniExam(state);
            case "exam-result":
                return examResult(state);
            case "level-exam":
                return levelExam(state);
            case "premium-library":
                return premiumLibrary(state);
            case "premium-checkout":
                return premiumCheckout(state);
            case "trail":
                return trail(state);
            case "block":
                return block(state);
            case "entry":
            default:
                return entry(state);
            }
        }
    };
})();
