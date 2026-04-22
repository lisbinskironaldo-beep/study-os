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

    function formatDateLabel(dateString) {
        if (!dateString) {
            return "Nao definida";
        }

        const parts = dateString.split("-");
        if (parts.length !== 3) {
            return dateString;
        }

        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    function formatStudyLoad(hours, minutes) {
        return `${hours}h ${String(minutes).padStart(2, "0")}min`;
    }

    function progressBar(progress, label) {
        return `
<div class="premium-progress">
    <div class="premium-progress-meta">
        <span>${escapeHtml(label)}</span>
        <strong>${Math.round(progress)}%</strong>
    </div>
    <div class="premium-progress-track" aria-hidden="true">
        <span class="premium-progress-fill" style="width:${Math.max(6, progress)}%"></span>
    </div>
</div>`;
    }

    function summaryStat(label, value) {
        return `
<div class="premium-stat-pill">
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(value)}</strong>
</div>`;
    }

    function summaryPanel(state) {
        const activeBlock = window.PremiumStudyStore.getActiveBlock();

        return `
<div class="premium-summary-card">
    <span class="premium-summary-eyebrow">Plano em construcao</span>
    <h2>${escapeHtml(state.studyTitle || "Estudo personalizado")}</h2>
    <p>${escapeHtml(state.progressLabel)}</p>
    <div class="premium-summary-stack">
        ${summaryStat("Material", state.materialName || "Aguardando PDF")}
        ${summaryStat("Prova", formatDateLabel(state.examDate))}
        ${summaryStat("Meta", `${Number(state.targetScore || 0).toFixed(1)} / 10`)}
        ${summaryStat("Carga", formatStudyLoad(state.studyHours || 0, state.studyMinutes || 0))}
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

    function shell({
        step,
        meta,
        content,
        summary,
        showBack
    }) {
        const showProgress = meta.progressVisible !== false;

        return `
<div class="premium-study-shell ${summary ? "" : "premium-shell-no-summary"}" data-premium-step="${escapeHtml(step)}">
    <header class="premium-study-shell-header">
        <div class="premium-shell-nav ${showProgress ? "" : "premium-shell-nav-compact"}">
            ${showBack ? `
            <button type="button" class="premium-shell-icon" data-premium-action="back" aria-label="Voltar">
                <span aria-hidden="true">&larr;</span>
            </button>` : `<span class="premium-shell-icon premium-shell-icon-placeholder" aria-hidden="true"></span>`}
            <div class="premium-shell-progress-wrap">
                ${showProgress ? progressBar(meta.progress || 0, meta.label || "") : `<span class="premium-shell-label">${escapeHtml(meta.label || "")}</span>`}
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
        ${summary ? `
        <aside class="premium-study-summary">
            ${summary}
        </aside>` : ""}
    </div>
</div>`;
    }

    window.PremiumStudyUI = {
        actionBar,
        escapeHtml,
        formatDateLabel,
        formatStudyLoad,
        shell,
        summaryPanel
    };
})();
