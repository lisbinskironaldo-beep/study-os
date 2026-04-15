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
        const studyLibrary = Array.isArray(state.studyLibrary)
            ? state.studyLibrary
            : [];
        const premiumLibraryEnabled =
            state.accessTier === "premium";

        return `
<section class="premium-entry-stage">
    <div class="premium-entry-hero">
        <button type="button" class="premium-entry-card premium-entry-card-primary premium-entry-card-featured" data-premium-action="open-file-picker">
            <span class="premium-entry-kicker">Novo estudo <span class="premium-entry-inline-badge premium-entry-inline-badge-free">Ate 12 paginas gratis</span></span>
            <strong>Carregar PDF</strong>
            <p>Envie seu material e receba um caminho focado na sua necessidade.</p>
        </button>
    </div>
    <div class="premium-entry-grid premium-entry-grid-secondary ${resume ? "" : "is-single"}">
        ${resume ? `
        <button type="button" class="premium-entry-card premium-entry-card-secondary premium-entry-card-support premium-entry-card-resume" data-premium-action="resume-latest-study">
            <span class="premium-entry-kicker">Ultimo estudo salvo <span class="premium-entry-inline-badge premium-entry-inline-badge-free">Gratis</span></span>
            <strong>Retomar ultimo estudo</strong>
            <p>${UI().escapeHtml(resume.title)}</p>
            <small>Prova em ${UI().escapeHtml(resume.examDateLabel)}</small>
        </button>` : ""}
        <button type="button" class="premium-entry-card premium-entry-card-secondary premium-entry-card-support premium-entry-card-premium ${premiumLibraryEnabled ? "" : "is-locked"}" data-premium-action="open-premium-library" ${premiumLibraryEnabled ? "" : "disabled aria-disabled=\"true\""}>
            <span class="premium-entry-kicker">Biblioteca premium <span class="premium-entry-inline-badge premium-entry-inline-badge-premium">Premium</span></span>
            <strong>Biblioteca premium</strong>
            <p>${studyLibrary.length > 0 ? `${studyLibrary.length} PDF(s) e estudo(s) ja carregados e prontos para consulta.` : "Todos os materiais carregados ficam guardados aqui, inclusive o mais recente."}</p>
            <small>${premiumLibraryEnabled ? "Ver historico completo de materiais" : "Disponivel no plano premium"}</small>
        </button>
    </div>
    <input id="premiumStudyFileInput" class="premium-hidden-input" type="file" accept=".pdf,application/pdf" />
</section>
<div class="premium-entry-note">
    <span>Gratis para sempre em PDFs de ate 12 paginas.</span>
    <span>Historico completo de materiais, retomada expandida e exportacao do marcador em PDF ficam no premium.</span>
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
        <span class="premium-mode-word">Aprender</span>
        <strong>Entendimento guiado do assunto</strong>
        <p>Entre pelo resumo principal, com leitura orientada e estrutura clara.</p>
    </button>
    <button type="button" class="premium-mode-card" data-premium-action="choose-mode-practice">
        <span class="premium-mode-word">Praticar</span>
        <strong>Va direto para questoes</strong>
        <p>Treino objetivo para consolidar o assunto sem desviar do foco.</p>
    </button>
    <button type="button" class="premium-mode-card" data-premium-action="choose-mode-exam">
        <span class="premium-mode-word">Prova</span>
        <strong>Teste seu nivel agora</strong>
        <p>Mini prova do bloco para medir criterio, seguranca e prontidao.</p>
    </button>
    <button type="button" class="premium-mode-card premium-mode-card-highlight" data-premium-action="choose-mode-highlight">
        <span class="premium-mode-word">Marcar</span>
        <strong>Resumir com marcador de texto</strong>
        <p>Veja o documento inteiro com grifo nas partes mais importantes e exporte o resultado em PDF no final.</p>
    </button>
</section>`;
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
        <section class="premium-learn-section premium-learn-section-rich premium-learn-section-document premium-learn-section-document-${UI().escapeHtml(section.id || "default")}">
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

    function renderAssistPanel(block, assistMode) {
        if (assistMode === "explain" && block.learn.explainBetter) {
            return `
<section class="premium-learn-section premium-learn-section-rich premium-learn-assist-panel">
    <span class="premium-detail-label">Explicar melhor este assunto</span>
    <h3>${UI().escapeHtml(block.learn.explainBetter.title)}</h3>
    ${block.learn.explainBetter.paragraphs.map((paragraph) => `<p>${UI().escapeHtml(paragraph)}</p>`).join("")}
</section>`;
        }

        if (assistMode === "review" && Array.isArray(block.learn.reviewInFivePoints)) {
            return `
<section class="premium-learn-section premium-learn-section-rich premium-learn-assist-panel">
    <span class="premium-detail-label">Revisar este assunto em 5 pontos</span>
    <h3>Os 5 pontos que mais precisam ficar de pe</h3>
    ${renderBulletList(block.learn.reviewInFivePoints)}
</section>`;
        }

        return "";
    }

    function getPracticeProgress(state, type) {
        const block = Store().getActiveBlock();
        const session = state.sessions[state.activeBlockId][type];

        if (type === "quiz") {
            const total = block.practice.quiz.length;
            const completed = session.answers.filter((value) => typeof value === "number").length;
            return {
                current: completed,
                total,
                ratio: total ? Math.round((completed / total) * 100) : 0
            };
        }

        if (type === "trueFalse") {
            const total = block.practice.trueFalse.length;
            const completed = Object.keys(session.answers).length;
            return {
                current: completed,
                total,
                ratio: session.submitted ? 100 : total ? Math.round((completed / total) * 100) : 0
            };
        }

        const total = block.practice.flashcards.length;
        const completed = session.known.filter((value) => typeof value === "boolean").length;
        return {
            current: completed,
            total,
            ratio: total ? Math.round((completed / total) * 100) : 0
        };
    }

    function renderPracticeCup(progress) {
        return `
<div class="premium-practice-cup">
    <span class="premium-practice-cup-fill" style="height:${Math.max(6, progress.ratio)}%"></span>
    <strong>${progress.current}/${progress.total}</strong>
</div>`;
    }

    function learnMap(state) {
        return `
<section class="premium-learn-map-grid">
    ${state.blocks.map((block) => `
    <button type="button" class="premium-subject-card premium-mode-card ${state.activeBlockId === block.id ? "is-active" : ""}" data-premium-action="open-block" data-block-id="${block.id}">
        <span class="premium-subject-duration">${UI().escapeHtml(block.duration)}</span>
        <span class="premium-mode-word premium-subject-word">${UI().escapeHtml(block.title)}</span>
        <strong>${UI().escapeHtml(block.subtitle)}</strong>
        <p>${UI().escapeHtml(block.excerpt || block.learn.summary)}</p>
    </button>`).join("")}
</section>`;
    }

    function block(state) {
        const block = Store().getActiveBlock();
        const nextBlockId = Store().getNextBlockId();
        const documentSections = Array.isArray(block.learn.documentSections) && block.learn.documentSections.length
            ? block.learn.documentSections
            : [];
        const assistPanel = renderAssistPanel(block, state.blockAssistMode);
        return `
<section class="premium-learn-reader ${state.blockFullScreen ? "is-fullscreen" : "is-page"}">
    ${state.blockFullScreen ? `<div class="premium-learn-reader-scrim" aria-hidden="true"></div>` : ""}
    <div class="premium-learn-focus premium-learn-reader-panel">
        <article class="premium-learn-article">
            <div class="premium-learn-reader-head">
                <div class="premium-learn-reader-copy">
                    <span class="premium-panel-kicker">Aprender</span>
                    <h2>${UI().escapeHtml(block.title)}</h2>
                    <p class="premium-learn-lead">${UI().escapeHtml(block.subtitle)}</p>
                </div>
                <div class="premium-inline-actions premium-inline-actions-contextual premium-learn-reader-toggles">
                    <button type="button" class="premium-tab ${state.blockFullScreen ? "" : "is-active"}" data-premium-action="${state.blockFullScreen ? "collapse-block-reader" : "expand-block-reader"}">
                        ${state.blockFullScreen ? "Sair do full screen" : "Abrir em full screen"}
                    </button>
                </div>
            </div>
            ${renderDocumentSections(documentSections)}
            ${assistPanel}
        </article>
        ${UI().actionBar([
            { action: "ai-explain-better", label: "◦ Explicar melhor", variant: state.blockAssistMode === "explain" ? "secondary" : "ghost" },
            { action: "ai-quick-review", label: "◇ Revisar em 5 pontos", variant: state.blockAssistMode === "review" ? "secondary" : "ghost" },
            { action: "open-mini-exam", label: "▣ Mini prova", variant: "primary" },
            ...(nextBlockId ? [{ action: "open-next-block", label: "→ Proximo", variant: "ghost" }] : [])
        ])}
    </div>
</section>`;
    }

    function renderHighlightParagraph(parts = []) {
        return `<p class="premium-highlight-paragraph">${parts.map((part) => part.highlight
            ? `<mark class="premium-highlight-mark">${UI().escapeHtml(part.text)}</mark>`
            : UI().escapeHtml(part.text)).join("")}</p>`;
    }

    function highlightPreview(state) {
        const documentData = state.highlightedDocument || Store().openHighlightDocument().highlightedDocument;
        const premiumLibraryEnabled = state.accessTier === "premium";

        return `
<section class="premium-highlight-shell">
    <article class="premium-highlight-doc">
        <span class="premium-panel-kicker">Documento com marcador</span>
        <h2>${UI().escapeHtml(documentData.title)}</h2>
        <p class="premium-learn-lead">${UI().escapeHtml(documentData.subtitle)}</p>
        <div class="premium-highlight-note">
            <strong>Documento integral preservado.</strong>
            <p>Nada e removido daqui. O sistema so grifa os trechos mais importantes para guiar a leitura e preparar a exportacao em PDF no final.</p>
        </div>
        ${documentData.sections.map((section) => `
            <section class="premium-highlight-section">
                <span class="premium-detail-label">${UI().escapeHtml(section.label)}</span>
                <h3>${UI().escapeHtml(section.title)}</h3>
                ${section.paragraphs.map((paragraph) => renderHighlightParagraph(paragraph)).join("")}
            </section>
        `).join("")}
    </article>
    <section class="premium-highlight-export">
        <span class="premium-panel-kicker">Resumo destacado</span>
        <strong>Baixe em PDF so os destaques principais ou o documento inteiro com os grifos.</strong>
        <p>O texto marcado nao fica salvo para consulta dentro do app. Aqui ele so pode ser exportado em PDF.</p>
        <div class="premium-inline-actions premium-inline-actions-contextual">
            <button type="button" class="premium-action premium-action-primary" data-premium-action="download-highlight-summary" ${premiumLibraryEnabled ? "" : "disabled"}>Baixar PDF so com destaques</button>
            <button type="button" class="premium-action premium-action-secondary" data-premium-action="download-highlighted-full" ${premiumLibraryEnabled ? "" : "disabled"}>Baixar PDF com texto todo destacado</button>
        </div>
        <small>${premiumLibraryEnabled ? "O navegador vai abrir a saida em formato de impressao para salvar em PDF." : "Os dois downloads ficam liberados no premium."}</small>
    </section>
    ${UI().actionBar([
        { action: "back-to-mode-select", label: "Voltar para modos", variant: "secondary" }
    ])}
</section>`;
    }

    function premiumLibrary(state) {
        const premiumLibraryEnabled = state.accessTier === "premium";
        const activeItem = Store().getActiveLibraryItem();

        if (!premiumLibraryEnabled) {
            return `
<section class="premium-saved-shell">
    <article class="premium-empty-library premium-empty-library-locked">
        <span class="premium-panel-kicker">Biblioteca premium</span>
        <strong>O historico completo de materiais fica liberado no premium.</strong>
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
                    <p>Assim que voce carregar PDFs e avancar no fluxo, eles passam a aparecer aqui.</p>
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
                    <h3>${UI().escapeHtml(activeItem.examDateLabel || "Data da prova nao definida")}</h3>
                    ${renderBulletList([
                        `Meta registrada: ${Number(activeItem.targetScore || 0).toFixed(1)} / 10`,
                        `Carga planejada: ${activeItem.studyHours || 0}h ${String(activeItem.studyMinutes || 0).padStart(2, "0")}min`,
                        `Etapa salva: ${activeItem.step || "entry"}`
                    ])}
                </section>
                ${UI().actionBar([
                    { action: "resume-library-item", label: "Abrir estudo salvo", variant: "primary" }
                ])}
            ` : `
                <div class="premium-empty-library">
                    <strong>Sua biblioteca premium fica aqui.</strong>
                    <p>Quando voce carregar materiais, eles passam a ficar guardados nesta area para retomada futura.</p>
                </div>
            `}
        </article>
    </div>
</section>`;
    }

    function practice(state) {
        const quizProgress = getPracticeProgress(state, "quiz");
        const trueFalseProgress = getPracticeProgress(state, "trueFalse");
        const flashcardsProgress = getPracticeProgress(state, "flashcards");

        return `
<section class="premium-practice-grid premium-practice-grid-simple">
    <button type="button" class="premium-practice-card premium-practice-card-primary" data-premium-action="open-quiz">
        <span>Questionario</span>
        <strong>Multipla escolha</strong>
        <p>Treino objetivo, com volume calculado para este assunto.</p>
        <div class="premium-practice-progress">
            ${renderPracticeCup(quizProgress)}
            <small>${quizProgress.ratio}% concluido</small>
        </div>
    </button>
    <button type="button" class="premium-practice-card" data-premium-action="open-true-false">
        <span>Verdadeiro ou falso</span>
        <strong>Criterio e contraste</strong>
        <p>Bom para detectar pegadinha e limite de regra.</p>
        <div class="premium-practice-progress">
            ${renderPracticeCup(trueFalseProgress)}
            <small>${trueFalseProgress.ratio}% concluido</small>
        </div>
    </button>
    <button type="button" class="premium-practice-card" data-premium-action="open-flashcards">
        <span>Flashcards</span>
        <strong>Memorizacao ativa</strong>
        <p>Cards curtos com mnemônicos, gatilhos e fixacao real.</p>
        <div class="premium-practice-progress">
            ${renderPracticeCup(flashcardsProgress)}
            <small>${flashcardsProgress.ratio}% concluido</small>
        </div>
    </button>
</section>`;
    }

    function quiz(state) {
        const block = Store().getActiveBlock();
        const session = state.sessions[state.activeBlockId].quiz;
        const hits = block.practice.quiz.reduce((sum, item, index) => (
            session.answers[index] === item.correctIndex ? sum + 1 : sum
        ), 0);

        if (session.isComplete) {
            return `
<section class="premium-result-shell">
    <article class="premium-result-hero premium-result-hero-compact">
        <span class="premium-detail-label">Questionario concluido</span>
        <strong>${hits}/${block.practice.quiz.length}</strong>
        <p>Voce terminou o questionario base deste assunto.</p>
    </article>
    ${UI().actionBar([
        { action: "open-practice", label: "Voltar para pratica", variant: "secondary" },
        { action: "request-extra-quiz", label: "Gerar mais no premium", variant: "ghost" },
        { action: "open-mini-exam", label: "Ir para mini prova", variant: "primary" }
    ])}
</section>`;
        }

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
            { action: session.index >= block.practice.quiz.length - 1 ? "finish-quiz" : "continue-quiz", label: session.index >= block.practice.quiz.length - 1 ? "Ver resultado" : "Proxima", variant: "primary" }
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
            { action: "request-extra-true-false", label: "Gerar mais no premium", variant: "ghost" },
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
        { action: "request-extra-quiz", label: "Gerar extras no premium", variant: "ghost" },
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
        if (!session.started) {
            return `
<section class="premium-result-shell">
    <article class="premium-result-hero premium-result-hero-compact">
        <span class="premium-detail-label">Mini prova do assunto</span>
        <strong>${block.exam.baseCount || block.exam.questions.length} questoes</strong>
        <p>Gere o pacote base deste assunto agora. Para um volume maior, o premium libera extras.</p>
    </article>
    ${UI().actionBar([
        { action: "generate-mini-exam", label: `Gerar ${block.exam.baseCount || block.exam.questions.length} questoes`, variant: "primary" },
        { action: "request-extra-mini-exam", label: "Gerar mais no premium", variant: "ghost" }
    ])}
</section>`;
        }

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
            { action: session.index >= block.exam.questions.length - 1 ? "finish-mini-exam" : "continue-mini-exam", label: session.index >= block.exam.questions.length - 1 ? "Ver resultado" : "Proxima", variant: "primary" }
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
            case "highlight-preview":
                return highlightPreview(state);
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
            case "premium-library":
                return premiumLibrary(state);
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
