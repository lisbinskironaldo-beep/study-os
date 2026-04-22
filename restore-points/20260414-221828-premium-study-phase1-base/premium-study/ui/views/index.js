(function () {
    if (window.PremiumStudyViews) {
        return;
    }

    const UI = () => window.PremiumStudyUI;
    const Store = () => window.PremiumStudyStore;

    function landing(state) {
        return `
<div class="premium-hero-card">
    <div class="premium-hero-copy">
        <span class="premium-badge">Premium study flow</span>
        <h2>Seu material vira uma trilha clara, pessoal e elegante.</h2>
        <p>Sem chat solto e sem ruido: cada tela conduz a proxima decisao com progresso visivel e sensacao real de direcionamento.</p>
        <div class="premium-mini-grid">
            <div class="premium-mini-card">
                <strong>1 PDF textual</strong>
                <span>Upload leve, validacao antecipada e foco em materiais que realmente funcionam.</span>
            </div>
            <div class="premium-mini-card">
                <strong>1 fluxo por vez</strong>
                <span>Telas independentes com voltar, fechar e progresso premium no topo.</span>
            </div>
            <div class="premium-mini-card">
                <strong>1 plano unico</strong>
                <span>Resumo, pratica e mini prova organizados ao redor do seu prazo real.</span>
            </div>
        </div>
    </div>
    <div class="premium-hero-side">
        <div class="premium-preview-card">
            <span class="premium-preview-label">Experiencia desejada</span>
            <strong>Direcionamento e individualizacao</strong>
            <p>O espaco precisa parecer reservado para aquele aluno, com avancos visuais suaves e escolhas recompensadoras.</p>
            <div class="premium-preview-meter">
                <span style="width: 78%"></span>
            </div>
            <small>O plano vai se materializando conforme cada escolha.</small>
        </div>
    </div>
</div>
${UI().actionBar([
    { action: "start-plan", label: "Criar novo plano", variant: "primary" },
    { action: "show-example", label: "Ver exemplo", variant: "secondary" },
    { action: "toggle-plans", label: state.showPlansPanel ? "Fechar planos" : "Planos premium", variant: "ghost" }
])}
${state.showPlansPanel ? `
<section class="premium-floating-panel">
    <div class="premium-floating-grid">
        <article class="premium-plan-card">
            <span>Gratis</span>
            <strong>1 material ativo</strong>
            <p>Fluxo guiado enxuto com limite de paginas e blocos.</p>
        </article>
        <article class="premium-plan-card premium-plan-card-highlight">
            <span>Premium</span>
            <strong>Mais blocos e historico</strong>
            <p>Questoes sob demanda, flashcards completos e trilha salva.</p>
        </article>
    </div>
</section>` : ""}`;
    }

    function newPlan(state) {
        return `
<div class="premium-grid premium-grid-split">
    <section class="premium-panel">
        <div class="premium-upload-zone">
            <div>
                <span class="premium-panel-kicker">PDF textual</span>
                <strong>Arraste ou selecione um arquivo leve e nitido.</strong>
                <p>Nesta fase, o upload ja aceita o arquivo local e guarda nome e tamanho visualmente. O processamento entra na proxima fase.</p>
            </div>
            <button type="button" class="premium-inline-btn" data-premium-action="open-file-picker">Selecionar PDF</button>
        </div>
        <input id="premiumStudyFileInput" class="premium-hidden-input" type="file" accept=".pdf,application/pdf" />
        <div class="premium-acceptance-list">
            <span>Aceito agora</span>
            <ul>
                <li>PDF textual</li>
                <li>Arquivo leve</li>
                <li>Conteudo nitido e selecionavel</li>
            </ul>
        </div>
    </section>
    <section class="premium-panel premium-panel-soft">
        <span class="premium-panel-kicker">Status do material</span>
        <strong>${state.materialName ? UI().escapeHtml(state.materialName) : "Nenhum arquivo selecionado"}</strong>
        <p>${state.materialName
            ? `Arquivo pronto para seguir. ${UI().escapeHtml(state.materialSizeLabel || "PDF textual confirmado")}.`
            : "Voce tambem pode usar um exemplo para validar a experiencia do modulo."}</p>
        ${state.materialName ? `
        <div class="premium-material-chip">
            <span>Pronto</span>
            <strong>${UI().escapeHtml(state.materialSizeLabel || "PDF textual")}</strong>
        </div>` : ""}
    </section>
</div>
${UI().actionBar([
    { action: "back", label: "Voltar", variant: "ghost" },
    { action: "use-example", label: "Usar exemplo", variant: "secondary" },
    { action: "continue-to-setup", label: "Continuar", variant: "primary", disabled: !state.materialName }
])}`;
    }

    function examSetup(state) {
        return `
<div class="premium-grid premium-grid-split">
    <section class="premium-panel">
        <span class="premium-panel-kicker">Tempo ate a prova</span>
        <div class="premium-choice-grid">
            ${UI().choiceCard({ action: "countdown-7", title: "7 dias", text: "Reta final agressiva.", active: state.examCountdown === "7" })}
            ${UI().choiceCard({ action: "countdown-14", title: "14 dias", text: "Equilibrio entre revisar e praticar.", active: state.examCountdown === "14" })}
            ${UI().choiceCard({ action: "countdown-30", title: "30 dias", text: "Mais profundidade e reforco.", active: state.examCountdown === "30" })}
        </div>
        <label class="premium-field">
            <span>Data da prova</span>
            <input type="date" data-premium-field="exam-date" value="${UI().escapeHtml(state.examDate)}" />
        </label>
    </section>
    <section class="premium-panel">
        <span class="premium-panel-kicker">Direcao do plano</span>
        <div class="premium-choice-grid premium-choice-grid-stack">
            ${UI().choiceCard({ action: "objective-reta-final", title: "Reta final", text: "Mais pontos quentes, menos teoria espalhada.", active: state.objective === "reta-final" })}
            ${UI().choiceCard({ action: "objective-equilibrado", title: "Equilibrado", text: "Cobertura enxuta com pratica progressiva.", active: state.objective === "equilibrado" })}
            ${UI().choiceCard({ action: "objective-aprofundado", title: "Aprofundado", text: "Mais contexto, conexoes e revisoes por bloco.", active: state.objective === "aprofundado" })}
        </div>
    </section>
</div>
${UI().actionBar([
    { action: "back", label: "Voltar", variant: "ghost" },
    { action: "continue-to-analysis", label: "Analisar material", variant: "primary" }
])}`;
    }

    function analysis(state) {
        const steps = [
            { label: "Lendo o material recebido", threshold: 20 },
            { label: "Localizando temas centrais", threshold: 46 },
            { label: "Organizando prioridades pelo prazo", threshold: 74 },
            { label: "Montando blocos iniciais", threshold: 96 }
        ];

        return `
<section class="premium-analysis-panel">
    <div class="premium-analysis-illustration" aria-hidden="true"></div>
    <h2>Seu plano esta tomando forma.</h2>
    <p>Esta tela ja nasce separada para reforcar a sensacao de fluxo continuo e estudo individualizado.</p>
    <div class="premium-analysis-track">
        <span style="width:${Math.max(12, state.analysisProgress)}%"></span>
    </div>
    <div class="premium-analysis-steps">
        ${steps.map((item) => `
        <div class="premium-analysis-step ${state.analysisProgress >= item.threshold ? "is-complete" : ""}">
            <span></span>
            <strong>${item.label}</strong>
        </div>`).join("")}
    </div>
</section>
${UI().actionBar([
    { action: "cancel-analysis", label: "Cancelar", variant: "ghost" }
])}`;
    }

    function topics(state) {
        return `
<section class="premium-panel">
    <div class="premium-panel-header">
        <div>
            <span class="premium-panel-kicker">Topicos detectados</span>
            <strong>Revise uma vez e siga para a trilha.</strong>
        </div>
        <button type="button" class="premium-inline-btn" data-premium-action="add-topic">Adicionar topico</button>
    </div>
    <div class="premium-topic-grid">
        ${state.topics.map((topic) => `
        <article class="premium-topic-card">
            <div class="premium-topic-card-head">
                <span class="premium-emphasis ${topic.emphasis === "alta" ? "is-hot" : ""}">${topic.emphasis === "alta" ? "Quente" : "Relevante"}</span>
                <button type="button" class="premium-topic-remove" data-premium-action="remove-topic" data-topic-id="${UI().escapeHtml(topic.id)}" aria-label="Remover topico">&times;</button>
            </div>
            <input type="text" value="${UI().escapeHtml(topic.title)}" data-premium-topic-input="${UI().escapeHtml(topic.id)}" />
        </article>`).join("")}
    </div>
</section>
${UI().actionBar([
    { action: "back", label: "Voltar", variant: "ghost" },
    { action: "continue-to-plan", label: "Gerar plano", variant: "primary" }
])}`;
    }

    function plan(state) {
        return `
<section class="premium-plan-stage">
    <div class="premium-plan-grid">
        ${state.blocks.map((block) => `
        <article class="premium-block-card ${block.status === "recommended" ? "is-recommended" : ""}">
            ${block.status === "recommended" ? `<span class="premium-recommend-badge">Recomendado</span>` : ""}
            <strong>${UI().escapeHtml(block.title)}</strong>
            <p>${UI().escapeHtml(block.subtitle)}</p>
            <div class="premium-block-meta">
                <span>${UI().escapeHtml(block.duration)}</span>
                <span>${block.topics.length} assunto${block.topics.length > 1 ? "s" : ""}</span>
            </div>
            <button type="button" class="premium-inline-btn" data-premium-action="open-block" data-block-id="${UI().escapeHtml(block.id)}">Abrir bloco</button>
        </article>`).join("")}
    </div>
</section>
${UI().actionBar([
    { action: "start-recommended", label: "Comecar pelo recomendado", variant: "primary" },
    { action: "save-plan", label: "Salvar", variant: "secondary" },
    { action: "regenerate-plan", label: "Regerar plano", variant: "ghost" }
])}`;
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
            <p>Frente e verso curtos, com pegadinhas e memorizacao ativa.</p>
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
            <p>Conceitos centrais, linguagem de prova e armadilhas frequentes.</p>
        </article>
        <article class="premium-block-tool">
            <strong>Roteiro de estudo</strong>
            <p>Uma ordem de leitura clara para reduzir dispersao e sobrecarga.</p>
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
    { action: "back-to-plan", label: "Voltar ao plano", variant: "ghost" },
    { action: "next-block", label: "Proximo bloco", variant: "primary" }
])}`;
    }

    window.PremiumStudyViews = {
        render(step, state) {
            switch (step) {
            case "new-plan":
                return newPlan(state);
            case "exam-setup":
                return examSetup(state);
            case "analysis":
                return analysis(state);
            case "topics":
                return topics(state);
            case "plan":
                return plan(state);
            case "block":
                return block(state);
            case "landing":
            default:
                return landing(state);
            }
        }
    };
})();
