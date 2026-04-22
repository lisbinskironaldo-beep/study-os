(function () {
    if (window.PremiumStudyUI) {
        return;
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function progressBar(progress, label) {
        return `
<div class="premium-progress">
    <div class="premium-progress-meta">
        <span>${escapeHtml(label)}</span>
        <strong>${Math.round(progress)}%</strong>
    </div>
    <div class="premium-progress-track" aria-hidden="true">
        <span class="premium-progress-fill" style="width:${Math.max(4, progress)}%"></span>
    </div>
</div>`;
    }

    function summaryStat(label, value) {
        return `
<div class="premium-stat-pill">
    <span>${escapeHtml(label)}</span>
    <strong>${value}</strong>
</div>`;
    }

    function formatObjective(objective) {
        const labels = {
            "reta-final": "Reta final",
            equilibrado: "Equilibrado",
            aprofundado: "Aprofundado"
        };
        return labels[objective] || "Equilibrado";
    }

    function summaryPanel(state) {
        const activeBlock = window.PremiumStudyStore.getActiveBlock();
        const materialLine = state.materialName
            ? `${escapeHtml(state.materialName)}${state.materialSizeLabel ? ` · ${escapeHtml(state.materialSizeLabel)}` : ""}`
            : "Nenhum PDF selecionado ainda";

        return `
<div class="premium-summary-card">
    <span class="premium-summary-eyebrow">Seu plano em construcao</span>
    <h2>${escapeHtml(state.planName)}</h2>
    <p>${escapeHtml(state.progressLabel)}</p>
    <div class="premium-summary-stack">
        ${summaryStat("Material", materialLine)}
        ${summaryStat("Prazo", `${escapeHtml(state.examCountdown)} dias`)}
        ${summaryStat("Objetivo", formatObjective(state.objective))}
        ${summaryStat("Blocos", `${state.blocks.length} estruturados`)}
    </div>
    <div class="premium-summary-focus">
        <span class="premium-summary-focus-label">Proximo foco</span>
        <strong>${escapeHtml(activeBlock.title)}</strong>
        <span>${escapeHtml(activeBlock.duration)}</span>
    </div>
</div>`;
    }

    function actionBar(items) {
        return `
<div class="premium-action-bar">
    ${items.map((item) => `
    <button
        type="button"
        class="premium-action ${item.variant ? `premium-action-${item.variant}` : ""}"
        data-premium-action="${escapeHtml(item.action)}"
        ${item.disabled ? "disabled" : ""}
    >
        ${escapeHtml(item.label)}
    </button>`).join("")}
</div>`;
    }

    function choiceCard({
        action,
        title,
        text,
        active = false,
        eyebrow = ""
    }) {
        return `
<button type="button" class="premium-choice-card ${active ? "is-active" : ""}" data-premium-action="${escapeHtml(action)}">
    ${eyebrow ? `<span class="premium-choice-eyebrow">${escapeHtml(eyebrow)}</span>` : ""}
    <strong>${escapeHtml(title)}</strong>
    <span>${escapeHtml(text)}</span>
</button>`;
    }

    function shell({
        step,
        meta,
        content,
        summary,
        showBack
    }) {
        return `
<div class="premium-study-shell" data-premium-step="${escapeHtml(step)}">
    <header class="premium-study-shell-header">
        <div class="premium-shell-nav">
            ${showBack ? `
            <button type="button" class="premium-shell-icon" data-premium-action="back" aria-label="Voltar">
                <span aria-hidden="true">&larr;</span>
            </button>` : `<span class="premium-shell-icon premium-shell-icon-placeholder" aria-hidden="true"></span>`}
            <div class="premium-shell-progress-wrap">
                ${progressBar(meta.progress, meta.label)}
            </div>
            <button type="button" class="premium-shell-icon" data-premium-action="close" aria-label="Fechar">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    </header>
    <div class="premium-study-shell-body">
        <section class="premium-study-stage">
            <div class="premium-stage-heading">
                <span class="premium-stage-kicker">${escapeHtml(meta.label)}</span>
                <h1>${escapeHtml(meta.title)}</h1>
                <p>${escapeHtml(meta.subtitle)}</p>
            </div>
            ${content}
        </section>
        <aside class="premium-study-summary">
            ${summary}
        </aside>
    </div>
</div>`;
    }

    window.PremiumStudyUI = {
        actionBar,
        choiceCard,
        escapeHtml,
        shell,
        summaryPanel
    };
})();
