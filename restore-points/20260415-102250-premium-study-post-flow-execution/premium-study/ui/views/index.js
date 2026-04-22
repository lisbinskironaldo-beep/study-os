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
                <button type="button" class="premium-calendar-nav" data-premium-action="calendar-prev" aria-label="Mes anterior">&larr;</button>
                <strong class="premium-calendar-title">${MONTHS[month]} ${year}</strong>
                <button type="button" class="premium-calendar-nav" data-premium-action="calendar-next" aria-label="Mes seguinte">&rarr;</button>
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

    function analysis(state) {
        const targetScore = Number(state.targetScore || 0).toFixed(1);
        const examDateLabel = UI().formatDateLabel(state.examDate);

        return `
<section class="premium-loading-stage">
    <div class="premium-loading-orb" aria-hidden="true"></div>
    <strong>Extraindo o melhor conteudo para voce buscar nota ${targetScore} no dia ${UI().escapeHtml(examDateLabel)}.</strong>
    <p>Estamos montando uma trilha mais objetiva para o seu prazo e para o tempo diario que voce informou.</p>
    <div class="premium-loading-checks">
        <span>Lendo PDF</span>
        <span>Separando topicos</span>
        <span>Priorizando trilha</span>
        <span>Montando plano</span>
    </div>
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
        <strong>Entendimento guiado</strong>
        <p>Resumo e pontos quentes.</p>
    </button>
    <button type="button" class="premium-mode-card" data-premium-action="choose-mode-practice">
        <span>Praticar</span>
        <strong>Va direto para questoes</strong>
        <p>Treino rapido e objetivo.</p>
    </button>
    <button type="button" class="premium-mode-card" data-premium-action="choose-mode-exam">
        <span>Prova</span>
        <strong>Teste seu nivel agora</strong>
        <p>Mini prova do bloco.</p>
    </button>
</section>`;
    }

    function renderBulletList(items) {
        return `
<ul class="premium-bullet-list">
    ${items.map((item) => `<li>${UI().escapeHtml(item)}</li>`).join("")}
</ul>`;
    }

    function block(state) {
        const block = Store().getActiveBlock();
        return `
<section class="premium-content-stack">
    <div class="premium-block-hero">
        <div>
            <span class="premium-panel-kicker">Bloco ativo</span>
            <h2>${UI().escapeHtml(block.title)}</h2>
            <p>${UI().escapeHtml(block.subtitle)}</p>
        </div>
        <div class="premium-block-chip">${UI().escapeHtml(block.duration)}</div>
    </div>
    <div class="premium-detail-grid">
        <article class="premium-detail-card premium-detail-card-wide">
            <span class="premium-detail-label">Resumo focado</span>
            <strong>${UI().escapeHtml(block.learn.summary)}</strong>
        </article>
        <article class="premium-detail-card">
            <span class="premium-detail-label">Pontos quentes</span>
            ${renderBulletList(block.learn.hotPoints)}
        </article>
        <article class="premium-detail-card">
            <span class="premium-detail-label">Conceitos-chave</span>
            ${renderBulletList(block.learn.keyConcepts)}
        </article>
        <article class="premium-detail-card premium-detail-card-wide">
            <span class="premium-detail-label">Armadilhas comuns</span>
            ${renderBulletList(block.learn.pitfalls)}
        </article>
    </div>
    ${UI().actionBar([
        { action: "ai-explain-better", label: "Explicar melhor", variant: "secondary" },
        { action: "ai-quick-review", label: "Revisao rapida", variant: "secondary" },
        { action: "open-practice", label: "Ir para pratica", variant: "primary" },
        { action: "open-mini-exam", label: "Mini prova", variant: "secondary" },
        { action: "open-trail", label: "Ver trilha", variant: "ghost" }
    ])}
</section>`;
    }

    function practice() {
        return `
<section class="premium-practice-grid">
    <button type="button" class="premium-practice-card premium-practice-card-primary" data-premium-action="open-quiz">
        <span>Questionario</span>
        <strong>Uma questao por vez</strong>
        <p>Treino objetivo com correcao curta ao longo do bloco.</p>
    </button>
    <button type="button" class="premium-practice-card" data-premium-action="open-true-false">
        <span>Verdadeiro ou falso</span>
        <strong>Teste formulacoes parecidas</strong>
        <p>Bom para pegar criterio, excecao e palavra-chave.</p>
    </button>
    <button type="button" class="premium-practice-card" data-premium-action="open-flashcards">
        <span>Flashcards</span>
        <strong>Retencao curta</strong>
        <p>Frente e verso para memorizar sem cansar.</p>
    </button>
</section>`;
    }

    function quiz(state) {
        const block = Store().getActiveBlock();
        const session = state.sessions[state.activeBlockId].quiz;
        const question = block.practice.quiz[session.index];
        const hasAnswer = typeof session.answers[session.index] === "number";
        const answer = session.answers[session.index];

        return `
<section class="premium-quiz-shell">
    <div class="premium-question-meta">
        <span>Questao ${session.index + 1} de ${block.practice.quiz.length}</span>
        <strong>${UI().escapeHtml(block.title)}</strong>
    </div>
    <article class="premium-question-card">
        <h2>${UI().escapeHtml(question.prompt)}</h2>
        <div class="premium-option-grid">
            ${question.options.map((option, index) => `
            <button
                type="button"
                class="premium-option-card ${hasAnswer && answer === index ? "is-selected" : ""} ${hasAnswer && index === question.correctIndex ? "is-correct" : ""}"
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
            { action: session.isComplete ? "finish-quiz" : "continue-quiz", label: session.isComplete ? "Ver resultado" : "Proxima", variant: "primary" }
        ])}` : ""}
    </article>
</section>`;
    }

    function trueFalse(state) {
        const block = Store().getActiveBlock();
        const session = state.sessions[state.activeBlockId].trueFalse;

        return `
<section class="premium-vf-shell">
    <div class="premium-question-meta">
        <span>Serie curta</span>
        <strong>${UI().escapeHtml(block.title)}</strong>
    </div>
    <div class="premium-vf-list">
        ${block.practice.trueFalse.map((item, index) => `
        <article class="premium-vf-item">
            <strong>${UI().escapeHtml(item.statement)}</strong>
            <div class="premium-vf-actions">
                <button type="button" class="premium-mini-toggle ${session.answers[index] === true ? "is-selected" : ""}" data-premium-action="answer-true-false" data-item-index="${index}" data-item-value="true">V</button>
                <button type="button" class="premium-mini-toggle ${session.answers[index] === false ? "is-selected" : ""}" data-premium-action="answer-true-false" data-item-index="${index}" data-item-value="false">F</button>
            </div>
            ${session.submitted ? `
            <p class="premium-vf-rationale ${session.answers[index] === item.answer ? "is-positive" : "is-warning"}">${UI().escapeHtml(item.rationale)}</p>` : ""}
        </article>`).join("")}
    </div>
    ${session.submitted
        ? UI().actionBar([
            { action: "reset-true-false", label: "Refazer", variant: "secondary" },
            { action: "open-flashcards", label: "Ir para flashcards", variant: "primary" }
        ])
        : UI().actionBar([
            { action: "submit-true-false", label: "Corrigir respostas", variant: "primary" }
        ])}
</section>`;
    }

    function flashcards(state) {
        const block = Store().getActiveBlock();
        const session = state.sessions[state.activeBlockId].flashcards;
        const card = block.practice.flashcards[session.index];
        const isDone = session.known.filter((value) => value === true).length;

        if (session.done) {
            return `
<section class="premium-result-shell">
    <article class="premium-result-hero premium-result-hero-compact">
        <span class="premium-detail-label">Flashcards concluídos</span>
        <strong>${isDone}/${block.practice.flashcards.length}</strong>
        <p>Voce marcou ${isDone} cards como entendidos neste bloco.</p>
    </article>
    ${UI().actionBar([
        { action: "open-practice", label: "Voltar para pratica", variant: "secondary" },
        { action: "open-mini-exam", label: "Ir para mini prova", variant: "primary" }
    ])}
</section>`;
        }

        return `
<section class="premium-flashcards-shell">
    <div class="premium-question-meta">
        <span>Card ${session.index + 1} de ${block.practice.flashcards.length}</span>
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
</section>`;
    }

    function miniExam(state) {
        const block = Store().getActiveBlock();
        const session = state.sessions[state.activeBlockId].miniExam;
        const question = block.exam.questions[session.index];
        const hasAnswer = typeof session.answers[session.index] === "number";
        const answer = session.answers[session.index];

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
                class="premium-option-card ${hasAnswer && answer === index ? "is-selected" : ""}"
                data-premium-action="answer-mini-exam"
                data-answer-index="${index}"
                ${hasAnswer ? "disabled" : ""}
            >
                <span>${String.fromCharCode(65 + index)}</span>
                <strong>${UI().escapeHtml(option)}</strong>
            </button>`).join("")}
        </div>
        ${hasAnswer ? UI().actionBar([
            { action: session.isComplete ? "finish-mini-exam" : "continue-mini-exam", label: session.isComplete ? "Ver resultado" : "Proxima", variant: "primary" }
        ]) : ""}
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
            <strong>Volte ao resumo se errou criterio ou linguagem.</strong>
        </article>
        <article class="premium-detail-card">
            <span class="premium-detail-label">Proximo passo</span>
            <strong>${result.ratio >= 70 ? "Voce ja pode seguir para o proximo bloco." : "Pratique mais antes de avancar."}</strong>
        </article>
    </div>
    ${UI().actionBar([
        { action: "return-to-block", label: "Voltar para aprender", variant: "secondary" },
        { action: "open-practice", label: "Praticar mais", variant: "secondary" },
        { action: "open-trail", label: "Seguir na trilha", variant: "primary" }
    ])}
</section>`;
    }

    function trail(state) {
        const progress = Store().getOverallProgress();
        return `
<section class="premium-trail-shell">
    <article class="premium-result-hero premium-result-hero-compact">
        <span class="premium-detail-label">Progresso geral</span>
        <strong>${progress.ratio}%</strong>
        <p>${progress.completed} etapas concluidas de ${progress.total} nesta trilha.</p>
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
                return analysis(state);
            case "mode-select":
                return modeSelect(state);
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
