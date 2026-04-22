(function () {
    if (window.PremiumStudyViews) {
        return;
    }

    const UI = () => window.PremiumStudyUI;
    const Store = () => window.PremiumStudyStore;

    const MONTHS = [
        "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    function entry(state) {
        const resume = state.latestLocalStudy;

        return `
<section class="premium-entry-grid">
    <button type="button" class="premium-entry-card premium-entry-card-primary" data-premium-action="open-file-picker">
        <span class="premium-entry-kicker">Novo estudo</span>
        <strong>Carregar PDF</strong>
        <p>Envie seu material e receba um caminho focado na sua necessidade.</p>
    </button>
    ${resume ? `
    <button type="button" class="premium-entry-card premium-entry-card-secondary" data-premium-action="resume-latest-study">
        <span class="premium-entry-kicker">Ultimo estudo salvo</span>
        <strong>Retomar estudo</strong>
        <p>${UI().escapeHtml(resume.title)}</p>
        <small>Prova em ${UI().escapeHtml(resume.examDateLabel)}</small>
    </button>` : ""}
    <input id="premiumStudyFileInput" class="premium-hidden-input" type="file" accept=".pdf,application/pdf" />
</section>
<div class="premium-entry-note">
    <span>Gratis para sempre em PDFs de ate 12 paginas.</span>
    <span>Historico completo, retomada expandida e materiais maiores ficam no premium.</span>
</div>`;
    }

    function buildCalendar(state) {
        const year = Number.isFinite(state.calendarYear) ? state.calendarYear : new Date().getFullYear();
        const month = Number.isFinite(state.calendarMonth) ? state.calendarMonth : new Date().getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startWeekday = (firstDay.getDay() + 6) % 7;
        const totalDays = lastDay.getDate();
        const cells = [];

        for (let i = 0; i < startWeekday; i += 1) {
            cells.push(`<span class="premium-calendar-cell premium-calendar-cell-empty" aria-hidden="true"></span>`);
        }

        for (let day = 1; day <= totalDays; day += 1) {
            const date = new Date(year, month, day);
            const iso = date.toISOString().slice(0, 10);
            const isActive = state.examDate === iso;
            const accentClass = day % 5 === 0 ? "is-accent" : day % 3 === 0 ? "is-soft" : "";
            cells.push(`
<button type="button" class="premium-calendar-cell ${isActive ? "is-selected" : ""} ${accentClass}" data-premium-action="pick-date" data-date-value="${iso}">
    <span>${day}</span>
</button>`);
        }

        return `
<section class="premium-calendar-panel">
    <div class="premium-calendar-head">
        <div class="premium-calendar-title-wrap">
            <button type="button" class="premium-calendar-nav" data-premium-action="calendar-prev" aria-label="Mes anterior">&larr;</button>
            <strong>${MONTHS[month]} ${year}</strong>
            <button type="button" class="premium-calendar-nav" data-premium-action="calendar-next" aria-label="Mes seguinte">&rarr;</button>
        </div>
        <span>${state.examDate ? `Selecionado: ${UI().formatDateLabel(state.examDate)}` : "Escolha um dia"}</span>
    </div>
    <div class="premium-calendar-weekdays">
        <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sab</span><span>Dom</span>
    </div>
    <div class="premium-calendar-grid">
        ${cells.join("")}
    </div>
</section>
${UI().actionBar([
    { action: "back", label: "Voltar", variant: "ghost" },
    { action: "continue-to-target", label: "Continuar", variant: "primary", disabled: !state.examDate }
])}`;
    }

    function ringMeter({ label, valueLabel, helper, angle, actionPrefix, hideHelper = false }) {
        return `
<div class="premium-ring-card">
    <div class="premium-ring-visual" data-ring-control="${actionPrefix}" style="--ring-angle:${angle}deg">
        <button type="button" class="premium-ring-adjust premium-ring-adjust-left" data-premium-action="${actionPrefix}-decrease" aria-label="Diminuir">-</button>
        <div class="premium-ring-center">
            <strong>${UI().escapeHtml(valueLabel)}</strong>
            <span>${UI().escapeHtml(label)}</span>
        </div>
        <button type="button" class="premium-ring-adjust premium-ring-adjust-right" data-premium-action="${actionPrefix}-increase" aria-label="Aumentar">+</button>
    </div>
    ${hideHelper ? "" : `<p>${UI().escapeHtml(helper)}</p>`}
</div>`;
    }

    function targetScore(state) {
        const score = Number(state.targetScore || 0);
        const angle = (score / 10) * 360;

        return `
<section class="premium-single-focus">
    ${ringMeter({
        label: "nota alvo",
        valueLabel: `${score.toFixed(1)}`,
        angle,
        actionPrefix: "target-score",
        hideHelper: true
    })}
</section>
${UI().actionBar([
    { action: "back", label: "Voltar", variant: "ghost" },
    { action: "continue-to-time", label: "Continuar", variant: "primary" }
])}`;
    }

    function studyTime(state) {
        const hoursAngle = (Math.max(0, Math.min(12, state.studyHours || 0)) / 12) * 360;
        const minutesAngle = (Math.max(0, Math.min(59, state.studyMinutes || 0)) / 60) * 360;

        return `
<section class="premium-time-grid">
    ${ringMeter({
        label: "horas por dia",
        valueLabel: `${state.studyHours}h`,
        helper: "Ajuste a quantidade de horas que voce realmente consegue manter.",
        angle: hoursAngle,
        actionPrefix: "study-hours"
    })}
    ${ringMeter({
        label: "minutos extras",
        valueLabel: `${String(state.studyMinutes).padStart(2, "0")}min`,
        helper: "Refine o tempo diario para o plano encaixar na sua rotina.",
        angle: minutesAngle,
        actionPrefix: "study-minutes"
    })}
</section>
${UI().actionBar([
    { action: "back", label: "Voltar", variant: "ghost" },
    { action: "continue-to-analysis", label: "Montar meu plano", variant: "primary" }
])}`;
    }

    function analysis(state) {
        const targetScore = Number(state.targetScore || 0).toFixed(1);
        const examDateLabel = UI().formatDateLabel(state.examDate);

        return `
<section class="premium-loading-stage">
    <div class="premium-loading-orb" aria-hidden="true"></div>
    <strong>Extraindo o melhor conteudo para voce buscar nota ${targetScore} no dia ${UI().escapeHtml(examDateLabel)}.</strong>
    <p>Estamos montando uma trilha mais objetiva para o seu prazo e para o tempo diario que voce informou.</p>
    <div class="premium-loading-track">
        <span style="width:${Math.max(10, state.analysisProgress)}%"></span>
    </div>
</section>`;
    }

    function modeSelect() {
        return `
<section class="premium-mode-grid">
    <button type="button" class="premium-mode-card premium-mode-card-primary" data-premium-action="choose-mode-learn">
        <span>Aprender</span>
        <strong>Comece pelo entendimento guiado</strong>
        <p>Resumos, pontos quentes e explicacoes mais diretas para entrar no tema.</p>
    </button>
    <button type="button" class="premium-mode-card" data-premium-action="choose-mode-practice">
        <span>Praticar</span>
        <strong>Va direto para questoes</strong>
        <p>Use o bloco com foco em treinamento e consolidacao mais rapida.</p>
    </button>
    <button type="button" class="premium-mode-card" data-premium-action="choose-mode-exam">
        <span>Prova</span>
        <strong>Teste seu nivel agora</strong>
        <p>Entre em modo mini prova para sentir como o conteudo esta rendendo hoje.</p>
    </button>
</section>`;
    }

    function renderBlockTab(tab) {
        if (tab === "praticar") {
            return `
<div class="premium-tab-panel">
    <div class="premium-block-tools">
        <article class="premium-block-tool">
            <strong>Questionario orientado</strong>
            <p>Questoes objetivas geradas a partir do bloco selecionado.</p>
        </article>
        <article class="premium-block-tool">
            <strong>Flashcards</strong>
            <p>Frente e verso curtos para memorizar mais rapido sem desperdicio.</p>
        </article>
    </div>
    ${UI().actionBar([
        { action: "ai-create-questions", label: "Criar 3 questoes", variant: "primary" }
    ])}
</div>`;
        }

        if (tab === "prova") {
            return `
<div class="premium-tab-panel">
    <div class="premium-block-tools">
        <article class="premium-block-tool">
            <strong>Mini prova do bloco</strong>
            <p>Sequencia curta com tempo opcional e correcao orientada ao erro.</p>
        </article>
        <article class="premium-block-tool">
            <strong>Resultado esperado</strong>
            <p>Acertos, pontos fracos e proximo movimento recomendado.</p>
        </article>
    </div>
</div>`;
        }

        return `
<div class="premium-tab-panel">
    <div class="premium-block-tools">
        <article class="premium-block-tool">
            <strong>Resumo focado em resultado</strong>
            <p>Conceitos centrais, linguagem de prova e armadilhas mais frequentes.</p>
        </article>
        <article class="premium-block-tool">
            <strong>Roteiro de estudo</strong>
            <p>Uma ordem de leitura limpa para reduzir dispersao e acelerar o entendimento.</p>
        </article>
    </div>
    ${UI().actionBar([
        { action: "ai-explain-better", label: "Explicar melhor", variant: "secondary" },
        { action: "ai-quick-review", label: "Revisao rapida", variant: "primary" }
    ])}
</div>`;
    }

    function block(state) {
        const block = Store().getActiveBlock();
        const tabs = [
            { id: "aprender", label: "Aprender" },
            { id: "praticar", label: "Praticar" },
            { id: "prova", label: "Prova" }
        ];

        return `
<section class="premium-block-stage">
    <div class="premium-block-hero">
        <div>
            <span class="premium-panel-kicker">Bloco ativo</span>
            <h2>${UI().escapeHtml(block.title)}</h2>
            <p>${UI().escapeHtml(block.subtitle)}</p>
        </div>
        <div class="premium-block-chip">${UI().escapeHtml(block.duration)}</div>
    </div>
    <div class="premium-tab-row">
        ${tabs.map((tab) => `
        <button type="button" class="premium-tab ${state.blockTab === tab.id ? "is-active" : ""}" data-premium-action="set-tab" data-tab-id="${tab.id}">
            ${tab.label}
        </button>`).join("")}
    </div>
    ${renderBlockTab(state.blockTab)}
</section>
${UI().actionBar([
    { action: "back-to-mode-select", label: "Voltar", variant: "ghost" },
    { action: "next-block", label: "Proximo bloco", variant: "primary" }
])}`;
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
                return analysis(state);
            case "mode-select":
                return modeSelect(state);
            case "block":
                return block(state);
            case "entry":
            default:
                return entry(state);
            }
        }
    };
})();
