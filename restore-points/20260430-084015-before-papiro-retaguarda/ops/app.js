(function () {
    const MODULE_LABELS = {
        dev: "Desenvolvimento",
        analytics: "Analise operacional",
        improvements: "Melhorias",
        promotions_internal: "Promocoes internas",
        promotions_external: "Promocoes externas",
        finance: "Financas",
        bugs: "Bugs"
    };

    const STAGE_LABELS = {
        planned: "planned",
        discovery: "discovery",
        pilot: "pilot",
        active_build: "active build",
        live: "live"
    };

    const state = {
        activeTab: "overview",
        overview: null,
        growth: null,
        alerts: [],
        payments: {
            recentPayments: [],
            recentEntitlements: []
        },
        paymentsStatus: null,
        promotions: {
            mode: "suggest",
            channels: [],
            items: []
        },
        weeklyReport: null,
        copilot: null,
        search: null,
        changeRequests: {
            items: [],
            summary: {
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                executed: 0,
                failed: 0
            }
        },
        reviewRuns: {
            items: []
        },
        siteImprovements: {
            items: []
        },
        apps: {
            items: [],
            summary: {
                total: 0,
                connected: 0,
                planned: 0,
                attention: 0,
                healthy: 0,
                warning: 0,
                failed: 0,
                notConfigured: 0,
                unknown: 0
            }
        },
        appsWorkspace: {
            items: []
        }
    };

    const elements = {
        status: document.getElementById("opsStatus"),
        loginView: document.getElementById("opsLoginView"),
        dashboard: document.getElementById("opsDashboard"),
        loginForm: document.getElementById("opsLoginForm"),
        logoutBtn: document.getElementById("opsLogoutBtn"),
        refreshBtn: document.getElementById("opsRefreshBtn"),
        navButtons: Array.from(document.querySelectorAll("[data-ops-tab]")),
        panels: Array.from(document.querySelectorAll("[data-ops-panel]")),
        overviewCards: document.getElementById("opsOverviewCards"),
        laneState: document.getElementById("opsLaneState"),
        searchForm: document.getElementById("opsSearchForm"),
        searchResults: document.getElementById("opsSearchResults"),
        paymentsList: document.getElementById("opsPaymentsList"),
        entitlementsList: document.getElementById("opsEntitlementsList"),
        paymentsStatus: document.getElementById("opsPaymentsStatus"),
        resyncForm: document.getElementById("opsResyncForm"),
        growthTotals: document.getElementById("opsGrowthTotals"),
        growthChannels: document.getElementById("opsGrowthChannels"),
        recentGrowthEvents: document.getElementById("opsRecentGrowthEvents"),
        spendForm: document.getElementById("opsSpendForm"),
        weeklyReport: document.getElementById("opsWeeklyReport"),
        weeklyReportBtn: document.getElementById("opsWeeklyReportBtn"),
        dailyDigestBtn: document.getElementById("opsDailyDigestBtn"),
        weeklyStrategyBtn: document.getElementById("opsWeeklyStrategyBtn"),
        copilotForm: document.getElementById("opsCopilotForm"),
        copilotOutput: document.getElementById("opsCopilotOutput"),
        promotionModeForm: document.getElementById("opsPromotionModeForm"),
        promotionModeSelect: document.getElementById("opsPromotionModeSelect"),
        promotionChannels: document.getElementById("opsPromotionChannels"),
        promotionGenerateForm: document.getElementById("opsPromotionGenerateForm"),
        promotionList: document.getElementById("opsPromotionList"),
        runThreeDayReviewBtn: document.getElementById("opsRunThreeDayReviewBtn"),
        reviewSummary: document.getElementById("opsReviewSummary"),
        siteImprovements: document.getElementById("opsSiteImprovements"),
        changeRequests: document.getElementById("opsChangeRequests"),
        reviewRuns: document.getElementById("opsReviewRuns"),
        appsSummary: document.getElementById("opsAppsSummary"),
        appsCheckBtn: document.getElementById("opsAppsCheckBtn"),
        appForm: document.getElementById("opsAppForm"),
        appsList: document.getElementById("opsAppsList"),
        appsWorkspace: document.getElementById("opsAppsWorkspace"),
        workItemForm: document.getElementById("opsWorkItemForm"),
        bugForm: document.getElementById("opsBugForm"),
        financeForm: document.getElementById("opsFinanceForm"),
        alertsList: document.getElementById("opsAlertsList"),
        laneActionButtons: Array.from(document.querySelectorAll("[data-ops-action]"))
    };

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function formatDate(value) {
        if (!value) {
            return "-";
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "short",
            timeStyle: "short"
        }).format(date);
    }

    function formatMoney(value) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(Number(value || 0));
    }

    function formatStage(value) {
        return STAGE_LABELS[String(value || "").trim()] || String(value || "planned");
    }

    function setStatus(message, tone = "") {
        elements.status.textContent = message || "";
        elements.status.className = tone
            ? `ops-status is-${tone}`
            : "ops-status";
    }

    function resetClientSessionState() {
        state.overview = null;
        state.growth = null;
        state.alerts = [];
        state.payments = {
            recentPayments: [],
            recentEntitlements: []
        };
        state.paymentsStatus = null;
        state.promotions = {
            mode: "suggest",
            channels: [],
            items: []
        };
        state.weeklyReport = null;
        state.copilot = null;
        state.search = null;
        state.changeRequests = {
            items: [],
            summary: {
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                executed: 0,
                failed: 0
            }
        };
        state.reviewRuns = {
            items: []
        };
        state.siteImprovements = {
            items: []
        };
        state.apps = {
            items: [],
            summary: {
                total: 0,
                connected: 0,
                planned: 0,
                attention: 0,
                healthy: 0,
                warning: 0,
                failed: 0,
                notConfigured: 0,
                unknown: 0
            }
        };
        state.appsWorkspace = {
            items: []
        };
    }

    async function request(url, options = {}) {
        const response = await fetch(url, {
            credentials: "same-origin",
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        });

        if (response.status === 401) {
            showLogin();
            setStatus("Use a senha do NorthStar para liberar o hub.", "");
            const unauthorized = new Error("Sessao expirada.");
            unauthorized.status = 401;
            throw unauthorized;
        }

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
            const error = new Error(payload && payload.message ? payload.message : (payload && payload.status ? payload.status : "Falha na requisicao."));
            error.status = response.status;
            error.payload = payload;
            throw error;
        }

        return payload || {};
    }

    async function submitJson(url, body) {
        return request(url, {
            method: "POST",
            body: JSON.stringify(body || {})
        });
    }

    function showLogin() {
        elements.loginView.classList.remove("hidden");
        elements.dashboard.classList.add("hidden");
        elements.logoutBtn.classList.add("hidden");
    }

    function showDashboard() {
        elements.loginView.classList.add("hidden");
        elements.dashboard.classList.remove("hidden");
        elements.logoutBtn.classList.remove("hidden");
    }

    function setActiveTab(tabId) {
        state.activeTab = tabId;
        elements.navButtons.forEach((button) => {
            button.classList.toggle("is-active", button.dataset.opsTab === tabId);
        });
        elements.panels.forEach((panel) => {
            panel.classList.toggle("is-active", panel.dataset.opsPanel === tabId);
        });
    }

    function buildMetricCard(label, value, detail) {
        return `
<article class="ops-metric-card">
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(value)}</strong>
    <small>${escapeHtml(detail || "")}</small>
</article>`;
    }

    function buildSeverityPill(label, severity) {
        const tone = severity === "critical" || severity === "failed"
            ? "danger"
            : severity === "warning"
                ? "warning"
                : severity === "success" || severity === "healthy"
                    ? "success"
                    : "";
        return `<span class="ops-pill ${tone ? `is-${tone}` : ""}">${escapeHtml(label)}</span>`;
    }

    function buildHealthPill(status) {
        const normalized = String(status || "unknown");
        const tone = normalized === "healthy"
            ? "success"
            : normalized === "warning"
                ? "warning"
                : normalized === "failed" || normalized === "not_configured"
                    ? "danger"
                    : "";
        const labels = {
            healthy: "saudavel",
            warning: "atencao",
            failed: "falhou",
            not_configured: "nao configurado",
            unknown: "sem check",
            planned: "planned"
        };

        return `<span class="ops-pill ${tone ? `is-${tone}` : ""}">${escapeHtml(labels[normalized] || normalized)}</span>`;
    }

    function getAppsSectionConfig(category) {
        const normalized = String(category || "").toLowerCase();

        if (normalized === "management") {
            return {
                order: 1,
                kicker: "Control plane",
                title: "Hub central do NorthStar"
            };
        }

        if (normalized === "product") {
            return {
                order: 2,
                kicker: "Apps do ecossistema",
                title: "Produtos operados pelo NorthStar"
            };
        }

        return {
            order: 3,
            kicker: "Infraestrutura e conectores",
            title: "Base operacional compartilhada"
        };
    }

    function renderManagedAppCard(item) {
        return `
<article class="ops-list-item">
    <strong>${escapeHtml(item.name || item.appKey || "app")} - ${escapeHtml(item.status || "planned")}</strong>
    <div class="ops-list-row">
        ${buildSeverityPill(`registry: ${item.status || "planned"}`, item.status === "connected" ? "success" : item.status === "attention" ? "warning" : "")}
        ${buildHealthPill(item.healthStatus)}
        ${buildSeverityPill(`stage: ${formatStage(item.maturityStage)}`, item.maturityStage === "live" ? "success" : item.maturityStage === "planned" ? "" : "warning")}
    </div>
    <small>appKey: ${escapeHtml(item.appKey || "-")} - categoria: ${escapeHtml(item.category || "-")} - gestao: ${escapeHtml(item.managementMode || "-")}</small>
    <small>modulos: ${escapeHtml((item.enabledModules || []).map((moduleKey) => MODULE_LABELS[moduleKey] || moduleKey).join(", ") || "-")}</small>
    <small>health: ${escapeHtml(item.healthSummary || "sem resumo operacional ainda")}</small>
    <small>capabilities: ${escapeHtml((item.capabilities || []).join(", ") || "-")}</small>
    <small>scopes: ${escapeHtml((item.scopes || []).join(", ") || "-")}</small>
    <small>ultimo check: ${escapeHtml(formatDate(item.lastCheckedAt))}</small>
    ${(item.healthChecks || []).length ? (item.healthChecks || []).map((check) => `<small>- ${escapeHtml(check)}</small>`).join("") : ""}
    ${item.lastError ? `<small>erro: ${escapeHtml(item.lastError)}</small>` : ""}
    ${item.dashboardUrl ? `<small><a class="ops-link" href="${escapeHtml(item.dashboardUrl)}" target="_blank" rel="noreferrer">Abrir dashboard</a></small>` : ""}
    <small>${escapeHtml(item.notes || "")}</small>
</article>`;
    }

    function renderModuleCard(module) {
        const metrics = Array.isArray(module.metrics) ? module.metrics : [];
        return `
<article class="ops-module-card">
    <div class="ops-module-head">
        <strong>${escapeHtml(module.label || module.moduleKey || "Modulo")}</strong>
        ${buildHealthPill(module.status || "planned")}
    </div>
    <p>${escapeHtml(module.summary || "Sem resumo.")}</p>
    ${metrics.length ? `<div class="ops-module-metrics">${metrics.map((metric) => `<span><b>${escapeHtml(metric.label || "")}</b>${escapeHtml(String(metric.value))}</span>`).join("")}</div>` : ""}
</article>`;
    }

    function renderWorkspaceCard(item) {
        const moduleSummary = item.moduleSummary && typeof item.moduleSummary === "object"
            ? Object.values(item.moduleSummary)
            : [];

        return `
<article class="ops-workspace-card">
    <div class="ops-card-head">
        <div>
            <p class="ops-kicker">${escapeHtml(item.category || "app")}</p>
            <h3>${escapeHtml(item.name || item.appKey || "App")}</h3>
        </div>
        <div class="ops-inline-stack">
            ${buildSeverityPill(`stage: ${formatStage(item.maturityStage)}`, item.maturityStage === "live" ? "success" : item.maturityStage === "planned" ? "" : "warning")}
            ${buildHealthPill(item.healthStatus)}
        </div>
    </div>
    <p class="ops-muted-copy">${escapeHtml(item.notes || "Sem notas registradas ainda.")}</p>
    <div class="ops-inline-stack">
        ${buildSeverityPill(`work items ${item.highlights && item.highlights.openWorkItems ? item.highlights.openWorkItems : 0}`, item.highlights && item.highlights.openWorkItems ? "warning" : "success")}
        ${buildSeverityPill(`bugs ${item.highlights && item.highlights.openBugs ? item.highlights.openBugs : 0}`, item.highlights && item.highlights.openBugs ? "warning" : "success")}
        ${buildSeverityPill(`snapshots ${item.highlights && item.highlights.financeSnapshots ? item.highlights.financeSnapshots : 0}`, item.highlights && item.highlights.financeSnapshots ? "success" : "")}
    </div>
    <div class="ops-module-grid">
        ${moduleSummary.map((module) => renderModuleCard(module)).join("")}
    </div>
</article>`;
    }

    function renderOverview() {
        const overview = state.overview;
        if (!overview) {
            elements.overviewCards.innerHTML = `<p class="ops-empty">Sem dados carregados.</p>`;
            elements.laneState.innerHTML = "";
            return;
        }

        elements.overviewCards.innerHTML = [
            buildMetricCard("Apps conectados", String(overview.counters.connectedApps || 0), "portfolio NorthStar"),
            buildMetricCard("Free lane hoje", String(overview.counters.freeLaneDaily || 0), `limite ${overview.thresholds.dailyHardStopThreshold}`),
            buildMetricCard("Free lane semana", String(overview.counters.freeLaneWeekly || 0), "acumulado"),
            buildMetricCard("Premium ativos", String(overview.counters.premiumActive || 0), "entitlements ativos"),
            buildMetricCard("Checkouts recentes", String(overview.counters.checkoutSessions || 0), "janela atual"),
            buildMetricCard("Alertas ativos", String(overview.counters.activeAlerts || 0), "operacao")
        ].join("");

        elements.laneState.innerHTML = [
            buildSeverityPill(`ecossistema: ${overview.managedApps && overview.managedApps.summary && overview.managedApps.summary.failed ? "atencao" : "estavel"}`, overview.managedApps && overview.managedApps.summary && (overview.managedApps.summary.failed || overview.managedApps.summary.warning) ? "warning" : "success"),
            buildSeverityPill(`free lane: ${overview.state.lanes.freeLanePaused ? "paused" : overview.freeLaneStatus}`, overview.freeLaneStatus === "critical" ? "critical" : overview.freeLaneStatus === "warning" ? "warning" : "success"),
            buildSeverityPill(`premium lane: ${overview.state.lanes.premiumLanePaused ? "paused" : "active"}`, overview.state.lanes.premiumLanePaused ? "critical" : "success"),
            buildSeverityPill(`mercado pago webhook: ${overview.paymentsStatus && overview.paymentsStatus.webhookSignatureValidation === "active" ? "ativo" : "pendente"}`, overview.paymentsStatus && overview.paymentsStatus.webhookSignatureValidation === "active" ? "success" : "warning"),
            buildSeverityPill(`Gemini: ${overview.configured.gemini ? "configurado" : "fallback"}`, overview.configured.gemini ? "success" : "warning"),
            buildSeverityPill(`Supabase: ${overview.configured.supabase ? "configurado" : "nao configurado"}`, overview.configured.supabase ? "success" : "warning"),
            buildSeverityPill("host tecnico: RotaNota", "warning")
        ].join("");
    }

    function renderPayments() {
        const payments = Array.isArray(state.payments.recentPayments) ? state.payments.recentPayments : [];
        const entitlements = Array.isArray(state.payments.recentEntitlements) ? state.payments.recentEntitlements : [];
        const paymentsStatus = state.paymentsStatus;

        elements.paymentsList.innerHTML = payments.length
            ? payments.map((item) => `
<article class="ops-list-item">
    <strong>${escapeHtml(item.plan_id || "plano")} - ${escapeHtml(item.status || "created")}</strong>
    <small>customerId: ${escapeHtml(item.customer_id || "-")}</small>
    <small>paymentId: ${escapeHtml(item.payment_id || "-")} - preferenceId: ${escapeHtml(item.preference_id || "-")}</small>
    <small>Atualizado em ${escapeHtml(formatDate(item.updated_at || item.created_at))}</small>
</article>`).join("")
            : `<p class="ops-empty">Nenhum pagamento recente.</p>`;

        elements.entitlementsList.innerHTML = entitlements.length
            ? entitlements.map((item) => `
<article class="ops-list-item">
    <strong>${escapeHtml(item.customer_id || "-")}</strong>
    <small>status: ${escapeHtml(item.status || "-")} - plano: ${escapeHtml(item.plan_id || "-")}</small>
    <small>valid_until: ${escapeHtml(formatDate(item.valid_until))}</small>
    <small>payer_email: ${escapeHtml(item.payer_email || "-")}</small>
</article>`).join("")
            : `<p class="ops-empty">Nenhum entitlement recente.</p>`;

        elements.paymentsStatus.innerHTML = paymentsStatus
            ? `
<article class="ops-list-item">
    <strong>Webhook signature: ${escapeHtml(paymentsStatus.webhookSignatureValidation || "unknown")}</strong>
    <div class="ops-list-row">
        ${buildSeverityPill(`checkout ${paymentsStatus.checkoutConfigured ? "configurado" : "pendente"}`, paymentsStatus.checkoutConfigured ? "success" : "warning")}
        ${buildSeverityPill(`webhook ${paymentsStatus.webhookSignatureValidation || "unknown"}`, paymentsStatus.webhookSignatureValidation === "active" ? "success" : "warning")}
    </div>
    <small>provider: ${escapeHtml(paymentsStatus.provider || "mercado_pago")}</small>
    <small>checkouts recentes: ${escapeHtml(String(paymentsStatus.summary && paymentsStatus.summary.recentCheckouts || 0))}</small>
    <small>premium ativos: ${escapeHtml(String(paymentsStatus.summary && paymentsStatus.summary.activeEntitlements || 0))}</small>
</article>`
            : `<p class="ops-empty">Sem status do provider carregado.</p>`;
    }

    function renderGrowth() {
        const growth = state.growth;
        if (!growth) {
            elements.growthTotals.innerHTML = `<p class="ops-empty">Sem dados de growth.</p>`;
            elements.growthChannels.innerHTML = "";
            elements.recentGrowthEvents.innerHTML = "";
            return;
        }

        elements.growthTotals.innerHTML = [
            buildMetricCard("Visitas", String(growth.totals.visits || 0), "entrada no premium"),
            buildMetricCard("Uploads", String(growth.totals.uploads || 0), "PDF aceito"),
            buildMetricCard("Bundles", String(growth.totals.bundles || 0), "trial concluido"),
            buildMetricCard("Paywalls", String(growth.totals.paywalls || 0), "oferta aberta"),
            buildMetricCard("Checkouts", String(growth.totals.checkoutCreated || 0), "checkout criado"),
            buildMetricCard("Premium", String(growth.totals.premiumActivations || 0), "ativacoes"),
            buildMetricCard("Spend", formatMoney(growth.totals.spend || 0), "manual")
        ].join("");

        const channels = Array.isArray(growth.channels) ? growth.channels : [];
        elements.growthChannels.innerHTML = channels.length
            ? channels.map((channel) => `
<article class="ops-list-item">
    <strong>${escapeHtml(channel.source || "direct")} / ${escapeHtml(channel.campaign || "(sem campanha)")}</strong>
    <small>visitas ${channel.visits || 0} - uploads ${channel.uploads || 0} - bundles ${channel.bundles || 0}</small>
    <small>checkout ${channel.checkoutCreated || 0} - premium ${channel.premiumActivations || 0} - premium rate ${channel.premiumRate || 0}%</small>
    <small>spend ${escapeHtml(formatMoney(channel.spend || 0))} - custo por premium ${channel.costPerPremium !== null ? escapeHtml(formatMoney(channel.costPerPremium)) : "-"}</small>
</article>`).join("")
            : `<p class="ops-empty">Sem canais suficientes registrados.</p>`;

        const recentEvents = Array.isArray(growth.recentEvents) ? growth.recentEvents : [];
        elements.recentGrowthEvents.innerHTML = recentEvents.length
            ? recentEvents.map((event) => `
<article class="ops-list-item">
    <strong>${escapeHtml(event.event_type || "-")}</strong>
    <small>customerId: ${escapeHtml(event.customer_id || "-")} - materialHash: ${escapeHtml(event.material_hash || "-")}</small>
    <small>utm: ${escapeHtml(event.utm_source || "direct")} / ${escapeHtml(event.utm_campaign || "(sem campanha)")}</small>
    <small>${escapeHtml(formatDate(event.created_at))}</small>
</article>`).join("")
            : `<p class="ops-empty">Sem eventos recentes.</p>`;
    }

    function renderWeeklyReport() {
        const report = state.weeklyReport;
        elements.weeklyReport.textContent = report && report.textReport
            ? report.textReport
            : "Relatorio semanal ainda nao carregado.";
    }

    function renderCopilot() {
        const copilot = state.copilot;
        if (!copilot || !copilot.analysis) {
            elements.copilotOutput.innerHTML = `<p class="ops-empty">Rode um digest, estrategia semanal ou analise manual.</p>`;
            return;
        }

        const analysis = copilot.analysis;
        const listBlock = (title, items) => `
<article class="ops-copilot-panel">
    <strong>${escapeHtml(title)}</strong>
    ${Array.isArray(items) && items.length
        ? `<ul class="ops-section-list">${items.map((item) => `<li>${escapeHtml(typeof item === "string" ? item : JSON.stringify(item))}</li>`).join("")}</ul>`
        : `<p class="ops-empty">Sem itens.</p>`}
</article>`;

        elements.copilotOutput.innerHTML = `
<article class="ops-copilot-panel">
    <strong>Resumo</strong>
    <p>${escapeHtml(analysis.summary || "Sem resumo.")}</p>
    <small>provider: ${escapeHtml(copilot.provider || analysis.provider || "fallback")} - cached: ${escapeHtml(String(Boolean(copilot.cached)))}</small>
</article>
${listBlock("Ops findings", analysis.opsFindings)}
${listBlock("Growth findings", analysis.growthFindings)}
${listBlock("Onde investir", analysis.investmentRecommendations)}
${listBlock("Como promover", analysis.promotionRecommendations)}
${listBlock("Plano semanal", analysis.weeklyPlan)}
${listBlock("Dados insuficientes", analysis.insufficientData)}
<article class="ops-copilot-panel">
    <strong>Confianca</strong>
    <p>${escapeHtml(analysis.confidence || "low")}</p>
</article>`;
    }

    function renderPromotions() {
        const promotions = state.promotions;
        elements.promotionModeSelect.value = promotions.mode || "suggest";
        elements.promotionChannels.innerHTML = (promotions.channels || []).map((channel) => `<span class="ops-pill">${escapeHtml(channel)}</span>`).join("");

        const items = Array.isArray(promotions.items) ? promotions.items : [];
        elements.promotionList.innerHTML = items.length
            ? items.map((item) => `
<article class="ops-list-item">
    <strong>${escapeHtml(item.feature || "(sem feature)")} - ${escapeHtml(item.status || "draft")}</strong>
    <small>${escapeHtml(item.headline || "-")}</small>
    <small>surface: ${escapeHtml(item.surface || "-")} - channel: ${escapeHtml(item.channel || "-")} - mode: ${escapeHtml(item.mode || "-")}</small>
    <small>recommended plan: ${escapeHtml(item.recommended_plan_id || "-")} - updated ${escapeHtml(formatDate(item.updated_at || item.created_at))}</small>
    <div class="ops-list-row">
        <button class="ops-button ops-button-secondary" type="button" data-promotion-apply="activate" data-campaign-id="${escapeHtml(item.id)}">Ativar</button>
        <button class="ops-button ops-button-secondary" type="button" data-promotion-apply="pause" data-campaign-id="${escapeHtml(item.id)}">Pausar</button>
        <button class="ops-button ops-button-ghost" type="button" data-promotion-apply="archive" data-campaign-id="${escapeHtml(item.id)}">Arquivar</button>
    </div>
</article>`).join("")
            : `<p class="ops-empty">Nenhuma promocao encontrada.</p>`;
    }

    function renderReviewSummaryCard(item) {
        const recommendations = item && item.recommendations && typeof item.recommendations === "object"
            ? item.recommendations
            : {};
        const totalSuggestions = [
            recommendations.campaignActions,
            recommendations.siteImprovements,
            recommendations.lowCostIdeas,
            recommendations.onboardingFindings,
            recommendations.bugPriorities
        ].reduce((acc, value) => acc + (Array.isArray(value) ? value.length : 0), 0);

        return `
<article class="ops-list-item">
    <strong>${escapeHtml(item.summary || "Sem resumo da review run.")}</strong>
    <div class="ops-list-row">
        ${buildSeverityPill(`provider: ${item.provider || "fallback"}`, item.provider === "gemini" ? "success" : "warning")}
        ${buildSeverityPill(`confidence: ${item.confidence || "low"}`, item.confidence === "high" ? "success" : item.confidence === "medium" ? "warning" : "")}
        ${buildSeverityPill(`requests: ${item.generated_change_requests || 0}`, item.generated_change_requests ? "warning" : "success")}
    </div>
    <small>run type: ${escapeHtml(item.run_type || "three_day_growth_review")} - finalizada em ${escapeHtml(formatDate(item.completed_at || item.created_at))}</small>
    <small>recomendacoes acionaveis: ${escapeHtml(String(totalSuggestions))}</small>
    ${(Array.isArray(item.missing_data) && item.missing_data.length)
        ? item.missing_data.map((entry) => `<small>- falta de dado: ${escapeHtml(entry)}</small>`).join("")
        : `<small>sem bloqueio critico de dados registrado.</small>`}
</article>`;
    }

    function renderChangeRequestCard(item) {
        return `
<article class="ops-list-item">
    <strong>${escapeHtml(item.target_system || "target")} - ${escapeHtml(item.action_type || "action")}</strong>
    <div class="ops-list-row">
        ${buildSeverityPill(`status: ${item.status || "pending"}`, item.status === "pending" ? "warning" : item.status === "approved" ? "success" : item.status === "failed" ? "critical" : "")}
        ${item.prepared_by ? buildSeverityPill(`prepared: ${item.prepared_by}`, "") : ""}
    </div>
    <small>criada em ${escapeHtml(formatDate(item.created_at))}</small>
    ${item.approval_notes ? `<small>notas: ${escapeHtml(item.approval_notes)}</small>` : ""}
    ${item.result_summary ? `<small>resultado: ${escapeHtml(item.result_summary)}</small>` : ""}
    <small>payload: ${escapeHtml(JSON.stringify(item.payload || {}))}</small>
    <div class="ops-list-row">
        <button class="ops-button ops-button-secondary" type="button" data-change-request-action="approve" data-change-request-id="${escapeHtml(item.id)}">Aprovar</button>
        <button class="ops-button ops-button-secondary" type="button" data-change-request-action="reject" data-change-request-id="${escapeHtml(item.id)}">Rejeitar</button>
        <button class="ops-button ops-button-ghost" type="button" data-change-request-action="execute" data-change-request-id="${escapeHtml(item.id)}">Executar</button>
    </div>
</article>`;
    }

    function renderGovernance() {
        const reviewRuns = state.reviewRuns && Array.isArray(state.reviewRuns.items)
            ? state.reviewRuns.items
            : [];
        const latestReview = reviewRuns[0] || (state.overview && state.overview.latestReviewRun) || null;
        const siteImprovements = state.siteImprovements && Array.isArray(state.siteImprovements.items)
            ? state.siteImprovements.items
            : [];
        const changeRequests = state.changeRequests && Array.isArray(state.changeRequests.items)
            ? state.changeRequests.items
            : [];

        elements.reviewSummary.innerHTML = latestReview
            ? renderReviewSummaryCard(latestReview)
            : `<p class="ops-empty">Nenhuma review run registrada ainda.</p>`;

        elements.siteImprovements.innerHTML = siteImprovements.length
            ? siteImprovements.map((item) => `
<article class="ops-list-item">
    <strong>${escapeHtml(item.title || "Melhoria")}</strong>
    <small>fonte: ${escapeHtml(item.source || "-")} ${item.app_key ? `- app ${escapeHtml(item.app_key)}` : ""}</small>
    <small>${escapeHtml(item.summary || "")}</small>
</article>`).join("")
            : `<p class="ops-empty">Nenhuma melhoria de site disponivel.</p>`;

        elements.changeRequests.innerHTML = changeRequests.length
            ? changeRequests.map((item) => renderChangeRequestCard(item)).join("")
            : `<p class="ops-empty">Nenhuma change request aberta.</p>`;

        elements.reviewRuns.innerHTML = reviewRuns.length
            ? reviewRuns.map((item) => renderReviewSummaryCard(item)).join("")
            : `<p class="ops-empty">Sem historico de review runs.</p>`;
    }

    function renderAppsPanel() {
        const apps = state.apps || { items: [], summary: {} };
        const summary = apps.summary || {};

        elements.appsSummary.innerHTML = [
            buildMetricCard("Apps totais", String(summary.total || 0), "portfolio NorthStar"),
            buildMetricCard("Saudaveis", String(summary.healthy || 0), "checks ok"),
            buildMetricCard("Em atencao", String((summary.warning || 0) + (summary.failed || 0)), "warning ou falha"),
            buildMetricCard("Nao configurados", String(summary.notConfigured || 0), "pendencias de acesso")
        ].join("");

        const items = Array.isArray(apps.items) ? apps.items : [];
        if (!items.length) {
            elements.appsList.innerHTML = `<p class="ops-empty">Nenhum app registrado.</p>`;
        } else {
            const groups = items.reduce((acc, item) => {
                const category = String(item.category || "infrastructure");
                if (!acc.has(category)) {
                    acc.set(category, []);
                }
                acc.get(category).push(item);
                return acc;
            }, new Map());

            elements.appsList.innerHTML = [...groups.entries()]
                .sort((left, right) => getAppsSectionConfig(left[0]).order - getAppsSectionConfig(right[0]).order)
                .map(([category, groupItems]) => {
                    const config = getAppsSectionConfig(category);
                    return `
<section class="ops-app-group">
    <div class="ops-card-head">
        <div>
            <p class="ops-kicker">${escapeHtml(config.kicker)}</p>
            <h3>${escapeHtml(config.title)}</h3>
        </div>
    </div>
    <div class="ops-list">
        ${groupItems.map((item) => renderManagedAppCard(item)).join("")}
    </div>
</section>`;
                }).join("");
        }

        const workspaceItems = state.appsWorkspace && Array.isArray(state.appsWorkspace.items)
            ? state.appsWorkspace.items
            : [];
        elements.appsWorkspace.innerHTML = workspaceItems.length
            ? workspaceItems.map((item) => renderWorkspaceCard(item)).join("")
            : `<p class="ops-empty">Workspace multi-app ainda nao carregado.</p>`;
    }

    function renderAlerts() {
        const alerts = Array.isArray(state.alerts) ? state.alerts : [];
        elements.alertsList.innerHTML = alerts.length
            ? alerts.map((item) => `
<article class="ops-list-item">
    <strong>${escapeHtml(item.event_type || "ops_event")}</strong>
    <div class="ops-list-row">
        ${buildSeverityPill(item.severity || "info", item.severity || "info")}
        ${item.provider ? `<span class="ops-pill">${escapeHtml(item.provider)}</span>` : ""}
    </div>
    <small>${escapeHtml(item.message || "")}</small>
    <small>created: ${escapeHtml(formatDate(item.created_at))} - resolved: ${escapeHtml(formatDate(item.resolved_at))}</small>
</article>`).join("")
            : `<p class="ops-empty">Sem alertas recentes.</p>`;
    }

    function renderSearch() {
        const search = state.search;
        if (!search || !search.results) {
            elements.searchResults.innerHTML = `<p class="ops-empty">Busque por customerId, materialHash ou pagamento.</p>`;
            return;
        }

        const blocks = Object.entries(search.results).map(([label, items]) => `
<article class="ops-search-block">
    <strong>${escapeHtml(label)}</strong>
    ${Array.isArray(items) && items.length
        ? items.map((item) => `<small>${escapeHtml(JSON.stringify(item))}</small>`).join("")
        : `<p class="ops-empty">Sem resultados.</p>`}
</article>`);

        elements.searchResults.innerHTML = blocks.join("");
    }

    function renderAll() {
        renderOverview();
        renderPayments();
        renderGrowth();
        renderWeeklyReport();
        renderCopilot();
        renderPromotions();
        renderGovernance();
        renderAppsPanel();
        renderAlerts();
        renderSearch();
    }

    async function loadOverview() {
        state.overview = await request("/api/ops/overview");
    }

    async function loadFinance() {
        state.payments = await request("/api/ops/payments");
    }

    async function loadPaymentsStatus() {
        state.paymentsStatus = await request("/api/ops/payments/status");
    }

    async function loadGrowth() {
        state.growth = await request("/api/ops/growth/overview");
    }

    async function loadPromotions() {
        state.promotions = await request("/api/ops/promotions");
    }

    async function loadChangeRequests() {
        state.changeRequests = await request("/api/ops/change-requests?limit=20");
    }

    async function loadReviewRuns() {
        state.reviewRuns = await request("/api/ops/reviews?limit=10");
    }

    async function loadSiteImprovements() {
        state.siteImprovements = await request("/api/ops/site-improvements");
    }

    async function loadApps() {
        state.apps = await submitJson("/api/ops/apps/check", {});
    }

    async function loadAppsWorkspace() {
        state.appsWorkspace = await request("/api/ops/apps/workspace");
    }

    async function loadAlerts() {
        const payload = await request("/api/ops/alerts");
        state.alerts = payload.items || [];
    }

    async function loadWeeklyReport() {
        state.weeklyReport = await request("/api/ops/reports/weekly");
    }

    async function loadDashboard() {
        setStatus("Atualizando o hub NorthStar...");

        await Promise.all([
            loadOverview(),
            loadFinance(),
            loadPaymentsStatus(),
            loadGrowth(),
            loadPromotions(),
            loadChangeRequests(),
            loadReviewRuns(),
            loadSiteImprovements(),
            loadApps(),
            loadAlerts(),
            loadWeeklyReport()
        ]);
        await loadAppsWorkspace();

        showDashboard();
        renderAll();
        setStatus("Hub NorthStar atualizado.", "success");
    }

    async function clearSessionOnEntry() {
        resetClientSessionState();
        showLogin();

        try {
            await submitJson("/api/ops/logout", {});
        } catch (error) {
            setStatus(error.message || "Nao foi possivel preparar o hub NorthStar.", "error");
            return;
        }

        setStatus("Use a senha do NorthStar para liberar o hub.");
    }

    async function handleLogin(event) {
        event.preventDefault();
        const form = new FormData(elements.loginForm);

        try {
            await submitJson("/api/ops/login", {
                password: form.get("password")
            });
            elements.loginForm.reset();
            setStatus("Autenticando no NorthStar...");
            await loadDashboard();
        } catch (error) {
            setStatus(error.message || "Nao foi possivel autenticar.", "error");
        }
    }

    async function handleLogout() {
        try {
            await submitJson("/api/ops/logout", {});
            resetClientSessionState();
            showLogin();
            setStatus("Sessao encerrada.");
        } catch (error) {
            setStatus(error.message || "Falha ao sair.", "error");
        }
    }

    async function handleLaneAction(action) {
        try {
            await submitJson("/api/ops/actions", {
                action,
                reason: "ops_console"
            });
            await loadDashboard();
        } catch (error) {
            setStatus(error.message || "Falha ao executar acao.", "error");
        }
    }

    async function handleSearch(event) {
        event.preventDefault();
        const query = new FormData(elements.searchForm).get("query");

        try {
            state.search = await request(`/api/ops/search?query=${encodeURIComponent(String(query || ""))}`);
            renderSearch();
            setStatus("Busca atualizada.");
        } catch (error) {
            setStatus(error.message || "Falha na busca.", "error");
        }
    }

    async function handleSpend(event) {
        event.preventDefault();
        const form = new FormData(elements.spendForm);

        try {
            await submitJson("/api/ops/growth/spend", {
                periodStart: form.get("periodStart"),
                periodEnd: form.get("periodEnd"),
                channel: form.get("channel"),
                campaign: form.get("campaign"),
                amount: Number(form.get("amount") || 0),
                notes: form.get("notes")
            });
            elements.spendForm.reset();
            await Promise.all([loadGrowth(), loadAppsWorkspace()]);
            renderGrowth();
            renderAppsPanel();
            setStatus("Spend registrado.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao registrar spend.", "error");
        }
    }

    async function handleResync(event) {
        event.preventDefault();
        const form = new FormData(elements.resyncForm);

        try {
            await submitJson("/api/ops/actions", {
                action: "resync_payment",
                paymentId: form.get("paymentId"),
                reason: form.get("reason") || "ops_console"
            });
            elements.resyncForm.reset();
            await loadDashboard();
        } catch (error) {
            setStatus(error.message || "Falha no resync.", "error");
        }
    }

    async function runCopilot(scope, query = "") {
        try {
            state.copilot = await submitJson("/api/ops/copilot/analyze", {
                scope,
                query
            });
            renderCopilot();
            setStatus(`Copiloto atualizado em modo ${scope}.`, "success");
        } catch (error) {
            setStatus(error.message || "Falha ao rodar copiloto.", "error");
        }
    }

    async function handlePromotionMode(event) {
        event.preventDefault();
        const form = new FormData(elements.promotionModeForm);

        try {
            await submitJson("/api/ops/promotions/mode", {
                mode: form.get("mode")
            });
            await loadPromotions();
            renderPromotions();
            setStatus("Modo de promocao salvo.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao salvar modo.", "error");
        }
    }

    async function handlePromotionGenerate(event) {
        event.preventDefault();
        const form = new FormData(elements.promotionGenerateForm);

        try {
            await submitJson("/api/ops/promotions/generate", {
                feature: form.get("feature"),
                surface: form.get("surface"),
                channel: form.get("channel"),
                mode: form.get("mode"),
                origin: "ops_console",
                audience: {
                    source: form.get("audienceSource")
                },
                externalPlatform: form.get("externalPlatform")
            });
            await Promise.all([loadPromotions(), loadAppsWorkspace()]);
            renderPromotions();
            renderAppsPanel();
            setStatus("Draft de promocao criado.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao gerar promocao.", "error");
        }
    }

    async function handlePromotionApply(action, campaignId) {
        try {
            await submitJson("/api/ops/promotions/apply", {
                action,
                campaignId,
                mode: state.promotions.mode || "approval_required",
                reason: "ops_console"
            });
            await Promise.all([loadPromotions(), loadAppsWorkspace()]);
            renderPromotions();
            renderAppsPanel();
            setStatus(`Promocao ${action} aplicada.`, "success");
        } catch (error) {
            setStatus(error.message || "Falha ao aplicar promocao.", "error");
        }
    }

    async function handleRunThreeDayReview() {
        try {
            setStatus("Rodando review de 3 dias do NorthStar...");
            await submitJson("/api/ops/reviews/run", {});
            await Promise.all([
                loadOverview(),
                loadChangeRequests(),
                loadReviewRuns(),
                loadSiteImprovements()
            ]);
            renderOverview();
            renderGovernance();
            setStatus("Review de 3 dias concluida.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao rodar review de 3 dias.", "error");
        }
    }

    async function handleChangeRequestAction(action, changeRequestId) {
        const route = action === "approve"
            ? "/api/ops/change-requests/approve"
            : action === "reject"
                ? "/api/ops/change-requests/reject"
                : "/api/ops/change-requests/execute";

        try {
            await submitJson(route, {
                changeRequestId,
                approvalNotes: "ops_console"
            });
            await Promise.all([
                loadOverview(),
                loadChangeRequests(),
                loadReviewRuns(),
                loadSiteImprovements(),
                loadPaymentsStatus(),
                loadAppsWorkspace()
            ]);
            renderOverview();
            renderPayments();
            renderGovernance();
            renderAppsPanel();
            setStatus(`Change request ${action} concluida.`, "success");
        } catch (error) {
            setStatus(error.message || "Falha na change request.", "error");
        }
    }

    async function handleAppSave(event) {
        event.preventDefault();
        const form = new FormData(elements.appForm);

        try {
            await submitJson("/api/ops/apps", {
                appKey: form.get("appKey"),
                name: form.get("name"),
                category: form.get("category"),
                status: form.get("status"),
                maturityStage: form.get("maturityStage"),
                managementMode: form.get("managementMode"),
                dashboardUrl: form.get("dashboardUrl"),
                capabilities: String(form.get("capabilities") || ""),
                scopes: String(form.get("scopes") || ""),
                enabledModules: String(form.get("enabledModules") || ""),
                notes: form.get("notes")
            });
            elements.appForm.reset();
            await loadApps();
            await loadAppsWorkspace();
            renderAppsPanel();
            setStatus("App salvo no portfolio do NorthStar.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao salvar app.", "error");
        }
    }

    async function handleWorkItemSave(event) {
        event.preventDefault();
        const form = new FormData(elements.workItemForm);

        try {
            await submitJson("/api/ops/apps/work-items", {
                appKey: form.get("appKey"),
                title: form.get("title"),
                summary: form.get("summary"),
                itemType: form.get("itemType"),
                priority: Number(form.get("priority") || 100)
            });
            elements.workItemForm.reset();
            await loadAppsWorkspace();
            renderAppsPanel();
            setStatus("Melhoria registrada no workspace do app.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao registrar melhoria.", "error");
        }
    }

    async function handleBugSave(event) {
        event.preventDefault();
        const form = new FormData(elements.bugForm);

        try {
            await submitJson("/api/ops/apps/bugs", {
                appKey: form.get("appKey"),
                title: form.get("title"),
                description: form.get("description"),
                severity: form.get("severity"),
                sourceChannel: form.get("sourceChannel")
            });
            elements.bugForm.reset();
            await loadAppsWorkspace();
            renderAppsPanel();
            setStatus("Bug registrado para triagem.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao registrar bug.", "error");
        }
    }

    async function handleFinanceSave(event) {
        event.preventDefault();
        const form = new FormData(elements.financeForm);

        try {
            await submitJson("/api/ops/apps/finance", {
                appKey: form.get("appKey"),
                periodStart: form.get("periodStart"),
                periodEnd: form.get("periodEnd"),
                revenueAmount: Number(form.get("revenueAmount") || 0),
                expenseAmount: Number(form.get("expenseAmount") || 0)
            });
            elements.financeForm.reset();
            await loadAppsWorkspace();
            renderAppsPanel();
            setStatus("Snapshot financeiro registrado.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao registrar snapshot financeiro.", "error");
        }
    }

    async function handleAppsCheck() {
        try {
            setStatus("Rodando checks das integracoes...");
            await loadApps();
            await loadAppsWorkspace();
            renderAppsPanel();
            setStatus("Checks das integracoes atualizados.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao validar integracoes.", "error");
        }
    }

    function bindEvents() {
        elements.loginForm.addEventListener("submit", handleLogin);
        elements.logoutBtn.addEventListener("click", handleLogout);
        elements.refreshBtn.addEventListener("click", () => loadDashboard().catch((error) => {
            setStatus(error.message || "Falha ao atualizar.", "error");
        }));
        elements.searchForm.addEventListener("submit", handleSearch);
        elements.spendForm.addEventListener("submit", handleSpend);
        elements.resyncForm.addEventListener("submit", handleResync);
        elements.copilotForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const form = new FormData(elements.copilotForm);
            runCopilot("manual", String(form.get("query") || ""));
        });
        elements.dailyDigestBtn.addEventListener("click", () => runCopilot("daily_digest"));
        elements.weeklyStrategyBtn.addEventListener("click", () => runCopilot("weekly_strategy"));
        elements.weeklyReportBtn.addEventListener("click", async () => {
            try {
                await loadWeeklyReport();
                renderWeeklyReport();
                setStatus("Relatorio semanal atualizado.");
            } catch (error) {
                setStatus(error.message || "Falha ao atualizar relatorio.", "error");
            }
        });
        elements.promotionModeForm.addEventListener("submit", handlePromotionMode);
        elements.promotionGenerateForm.addEventListener("submit", handlePromotionGenerate);
        elements.runThreeDayReviewBtn.addEventListener("click", handleRunThreeDayReview);
        elements.appForm.addEventListener("submit", handleAppSave);
        elements.workItemForm.addEventListener("submit", handleWorkItemSave);
        elements.bugForm.addEventListener("submit", handleBugSave);
        elements.financeForm.addEventListener("submit", handleFinanceSave);
        elements.appsCheckBtn.addEventListener("click", handleAppsCheck);

        elements.navButtons.forEach((button) => {
            button.addEventListener("click", () => setActiveTab(button.dataset.opsTab));
        });

        elements.laneActionButtons.forEach((button) => {
            button.addEventListener("click", () => handleLaneAction(button.dataset.opsAction));
        });

        elements.promotionList.addEventListener("click", (event) => {
            const button = event.target.closest("[data-promotion-apply]");
            if (!button) {
                return;
            }

            handlePromotionApply(button.dataset.promotionApply, button.dataset.campaignId);
        });

        elements.changeRequests.addEventListener("click", (event) => {
            const button = event.target.closest("[data-change-request-action]");
            if (!button) {
                return;
            }

            handleChangeRequestAction(button.dataset.changeRequestAction, button.dataset.changeRequestId);
        });
    }

    async function init() {
        bindEvents();
        setActiveTab("overview");
        await clearSessionOnEntry();
    }

    init();
})();
