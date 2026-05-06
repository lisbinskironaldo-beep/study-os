(function () {
    const state = {
        activeTab: "painel",
        overview: null,
        growth: null,
        alerts: [],
        payments: { recentPayments: [], recentEntitlements: [] },
        paymentsStatus: null,
        marketing: { items: [], strategy: {}, freeTools: [] },
        marketingIntegrations: { items: [] },
        bufferChannels: null,
        promotions: { mode: "suggest", channels: [], items: [] },
        weeklyReport: null,
        copilot: null,
        search: null,
        changeRequests: { items: [], summary: {} },
        reviewRuns: { items: [] },
        siteImprovements: { items: [] }
    };

    const $ = (id) => document.getElementById(id);

    const elements = {
        status: $("opsStatus"),
        loginView: $("opsLoginView"),
        dashboard: $("opsDashboard"),
        loginForm: $("opsLoginForm"),
        logoutBtn: $("opsLogoutBtn"),
        refreshBtn: $("opsRefreshBtn"),
        navButtons: Array.from(document.querySelectorAll("[data-ops-tab]")),
        panels: Array.from(document.querySelectorAll("[data-ops-panel]")),
        todaySummary: $("opsTodaySummary"),
        actionQueue: $("opsActionQueue"),
        ownerMetrics: $("opsOwnerMetrics"),
        moneySnapshot: $("opsMoneySnapshot"),
        contentSnapshot: $("opsContentSnapshot"),
        runHealthBtn: $("opsRunHealthBtn"),
        quickMarketingBtn: $("opsQuickMarketingBtn"),
        clearTechAlertsBtn: $("opsClearTechAlertsBtn"),
        overviewCards: $("opsOverviewCards"),
        laneState: $("opsLaneState"),
        searchForm: $("opsSearchForm"),
        searchResults: $("opsSearchResults"),
        paymentsList: $("opsPaymentsList"),
        entitlementsList: $("opsEntitlementsList"),
        paymentsStatus: $("opsPaymentsStatus"),
        resyncForm: $("opsResyncForm"),
        growthTotals: $("opsGrowthTotals"),
        growthChannels: $("opsGrowthChannels"),
        recentGrowthEvents: $("opsRecentGrowthEvents"),
        spendForm: $("opsSpendForm"),
        marketingSummary: $("opsMarketingSummary"),
        marketingTools: $("opsMarketingTools"),
        marketingIntegrations: $("opsMarketingIntegrations"),
        marketingQueue: $("opsMarketingQueue"),
        marketingGenerateBtn: $("opsMarketingGenerateBtn"),
        marketingFallbackBtn: $("opsMarketingFallbackBtn"),
        weeklyReport: $("opsWeeklyReport"),
        weeklyReportBtn: $("opsWeeklyReportBtn"),
        dailyDigestBtn: $("opsDailyDigestBtn"),
        weeklyStrategyBtn: $("opsWeeklyStrategyBtn"),
        copilotForm: $("opsCopilotForm"),
        copilotOutput: $("opsCopilotOutput"),
        promotionModeForm: $("opsPromotionModeForm"),
        promotionModeSelect: $("opsPromotionModeSelect"),
        promotionChannels: $("opsPromotionChannels"),
        promotionGenerateForm: $("opsPromotionGenerateForm"),
        promotionList: $("opsPromotionList"),
        runThreeDayReviewBtn: $("opsRunThreeDayReviewBtn"),
        siteImprovements: $("opsSiteImprovements"),
        changeRequests: $("opsChangeRequests"),
        reviewRuns: $("opsReviewRuns"),
        alertsList: $("opsAlertsList"),
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
        if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
            const [year, month, day] = String(value).split("-");
            return `${day}/${month}/${year}`;
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

    function setStatus(message, tone = "") {
        elements.status.textContent = message || "";
        elements.status.className = tone ? `ops-status is-${tone}` : "ops-status";
    }

    function resetClientSessionState() {
        state.overview = null;
        state.growth = null;
        state.alerts = [];
        state.payments = { recentPayments: [], recentEntitlements: [] };
        state.paymentsStatus = null;
        state.marketing = { items: [], strategy: {}, freeTools: [] };
        state.marketingIntegrations = { items: [] };
        state.bufferChannels = null;
        state.promotions = { mode: "suggest", channels: [], items: [] };
        state.weeklyReport = null;
        state.copilot = null;
        state.search = null;
        state.changeRequests = { items: [], summary: {} };
        state.reviewRuns = { items: [] };
        state.siteImprovements = { items: [] };
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
            setStatus("Use a senha da retaguarda para liberar o painel.", "");
            const unauthorized = new Error("Sessao expirada.");
            unauthorized.status = 401;
            throw unauthorized;
        }
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
            const message = payload && (payload.message || payload.status);
            const error = new Error(message || "Falha na requisicao.");
            error.status = response.status;
            error.payload = payload;
            throw error;
        }
        return payload || {};
    }

    function submitJson(url, body) {
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

    function buildPill(label, tone = "") {
        return `<span class="ops-pill ${tone ? `is-${tone}` : ""}">${escapeHtml(label)}</span>`;
    }

    function toneFromStatus(value) {
        const status = String(value || "");
        if (["active", "healthy", "ok", "executed", "published", "ready"].includes(status)) {
            return "success";
        }
        if (["warning", "pending", "fallback", "not_configured", "needs_setup", "partial", "manual"].includes(status)) {
            return "warning";
        }
        if (["critical", "failed", "danger"].includes(status)) {
            return "danger";
        }
        return "";
    }

    function getOpenMarketingItems() {
        const items = state.marketing && Array.isArray(state.marketing.items) ? state.marketing.items : [];
        return items.filter((item) => !["published", "rejected"].includes(String(item.status || "")));
    }

    function humanAlertTitle(item = {}) {
        const type = String(item.event_type || "");
        if (type === "daily_health_check_fallback") {
            return "A IA tecnica falhou, mas o painel usou o plano reserva";
        }
        if (type === "three_day_review_fallback" || type === "copilot_fallback_used") {
            return "A IA principal usou o plano reserva";
        }
        if (type.includes("webhook")) {
            return "Mercado Pago precisa de conferencia";
        }
        if (type.includes("free_lane")) {
            return "Uso gratuito precisa de atencao";
        }
        if (type.includes("premium")) {
            return "Premium precisa de atencao";
        }
        return "Aviso do sistema";
    }

    function humanAlertMessage(item = {}) {
        const type = String(item.event_type || "");
        if (type === "daily_health_check_fallback" || type === "three_day_review_fallback" || type === "copilot_fallback_used") {
            return "Isso costuma ser uma queda temporaria do Gemini. A IA continuou com uma analise reserva, entao resolva apenas se isso se repetir.";
        }
        return item.message || "A IA registrou um aviso para revisao.";
    }

    function humanChangeTitle(item = {}) {
        const type = String(item.action_type || "");
        const payload = item.payload && typeof item.payload === "object" ? item.payload : {};
        if (type === "triage_active_alerts") {
            return "Revisar avisos ativos";
        }
        if (type === "investigate_webhook_signature") {
            return "Conferir avisos do Mercado Pago";
        }
        if (type === "manual_review_bundle") {
            if (payload.bundleType === "campaign_actions" || payload.bundleType === "low_cost_ideas") {
                return "Aproveitar ideias de divulgacao";
            }
            if (payload.bundleType === "site_improvements") {
                return "Melhorar a pagina de venda";
            }
            if (payload.bundleType === "bug_priorities") {
                return "Corrigir algo que atrapalha o uso";
            }
            return "Revisar pacote de melhorias";
        }
        if (type === "payment_resync") {
            return "Reprocessar pagamento";
        }
        if (payload.title) {
            return payload.title;
        }
        return "Tarefa preparada pela IA";
    }

    function humanChangeSummary(item = {}) {
        const payload = item.payload && typeof item.payload === "object" ? item.payload : {};
        if (Array.isArray(payload.items) && payload.items.length) {
            return payload.items.slice(0, 2).join(" | ");
        }
        return payload.summary || item.result_summary || "A IA preparou esta acao para voce revisar.";
    }

    function humanFormat(value = "") {
        const labels = {
            quiz_post: "post quiz",
            carousel: "carrossel",
            reel_script: "roteiro de Reels",
            story_quiz: "story"
        };
        return labels[String(value || "")] || String(value || "conteudo");
    }

    function humanChannel(value = "") {
        const labels = {
            instagram: "Instagram",
            facebook: "Facebook",
            whatsapp_status: "WhatsApp",
            instagram_reels: "Reels",
            youtube_shorts: "Shorts",
            tiktok: "TikTok",
            internal_site: "site",
            meta_ads: "Meta",
            google_ads: "Google"
        };
        return labels[String(value || "")] || String(value || "canal");
    }

    function humanService(value = "") {
        const labels = {
            instagram: "Instagram",
            facebook: "Facebook",
            linkedin: "LinkedIn",
            twitter: "X/Twitter",
            threads: "Threads",
            tiktok: "TikTok",
            youtube: "YouTube",
            pinterest: "Pinterest",
            bluesky: "Bluesky"
        };
        return labels[String(value || "").toLowerCase()] || String(value || "canal");
    }

    function humanIntegrationStatus(value = "") {
        const labels = {
            ready: "pronto",
            partial: "parcial",
            manual: "manual",
            needs_setup: "configurar",
            failed: "falhou"
        };
        return labels[String(value || "")] || String(value || "status");
    }

    function humanFeature(value = "") {
        const labels = {
            PREMIUM_LIBRARY: "Biblioteca premium",
            PRACTICE_EXTRA_SERIES: "Treinos extras",
            MINI_EXAM_EXTRA: "Mini provas extras",
            HIGHLIGHT_EXPORT: "Exportar destaques",
            LARGE_PDF_UPLOAD: "PDF maior"
        };
        return labels[String(value || "")] || String(value || "Oferta");
    }

    function humanMode(value = "") {
        const labels = {
            suggest: "sugerir",
            approval_required: "pedir aprovacao",
            auto_rules: "automatico"
        };
        return labels[String(value || "")] || String(value || "sugerir");
    }

    function renderBufferChannelsBlock(bufferChannels = {}) {
        const channels = Array.isArray(bufferChannels.channels) ? bufferChannels.channels : [];
        return `
<div class="ops-nested-card">
    <strong>Canais encontrados no Buffer</strong>
    ${bufferChannels.loading ? `<p class="ops-empty">Consultando a API do Buffer...</p>` : ""}
    ${bufferChannels.ok === false ? `<p class="ops-empty">${escapeHtml(bufferChannels.message || bufferChannels.status || "Buffer nao retornou canais.")}</p>` : ""}
    <small>Organizacao: ${escapeHtml(bufferChannels.selectedOrganizationId || "-")}</small>
    ${channels.length ? channels.map((channel) => `<small>${escapeHtml(channel.displayName || channel.name || channel.id)} - ${escapeHtml(humanService(channel.service))} - ID: ${escapeHtml(channel.id)}</small>`).join("") : `<p class="ops-empty">Nenhum canal retornado pelo Buffer.</p>`}
    <small>Use esses IDs em BUFFER_PROFILE_IDS, separados por virgula.</small>
</div>`;
    }

    function formatDateTimeLocal(value) {
        const date = new Date(value || "");
        if (Number.isNaN(date.getTime())) {
            return "";
        }
        const pad = (number) => String(number).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function bufferStatusLabel(value = "") {
        const labels = {
            prepared: "rascunho pronto",
            test_ready: "teste seguro ok",
            scheduled: "agendado",
            schedule_failed: "precisa ajustar"
        };
        return labels[String(value || "")] || "rascunho pronto";
    }

    function renderBufferResults(draft = {}) {
        if (!Array.isArray(draft.lastResults) || !draft.lastResults.length) {
            return "";
        }
        return `
<div class="ops-mini-log">
    ${draft.lastResults.map((result) => `
    <span class="${result.ok ? "is-good" : "is-bad"}">${escapeHtml(result.ok ? (result.status === "dry_run" ? "Teste ok" : "Buffer ok") : "Ajustar")} - ${escapeHtml(result.message || result.postId || result.status || result.channelId)}</span>`).join("")}
</div>`;
    }

    function renderCopyButton(label, value = "") {
        return `<button class="ops-icon-button" type="button" data-copy-text="${escapeHtml(value)}" title="Copiar ${escapeHtml(label)}">Copiar ${escapeHtml(label)}</button>`;
    }

    function humanSource(value = "") {
        const labels = {
            three_day_review: "revisao da IA",
            work_item: "tarefa salva",
            ops_console: "painel"
        };
        return labels[String(value || "")] || String(value || "-");
    }

    function humanProvider(value = "") {
        const labels = {
            gemini: "IA",
            mercado_pago: "Mercado Pago",
            ops: "Painel",
            supabase: "Banco de dados"
        };
        return labels[String(value || "")] || String(value || "");
    }

    function humanEvent(value = "") {
        const labels = {
            premium_entry_view: "abriu premium",
            premium_module_entry: "abriu modulo premium",
            pdf_upload_success: "enviou material",
            pdf_upload_blocked: "upload bloqueado",
            trial_started: "comecou teste",
            free_bundle_generated: "gerou gratuito",
            trial_bundle_completed: "concluiu teste",
            premium_bundle_generated: "gerou premium",
            paywall_viewed: "viu oferta",
            checkout_click: "clicou em comprar",
            checkout_created: "venda iniciada",
            webhook_received: "pagamento avisou",
            premium_activated: "premium ativado",
            premium_active_client_seen: "premium ativo visto",
            resume_latest_study: "retomou estudo"
        };
        return labels[String(value || "")] || String(value || "evento");
    }

    function buildOwnerMetric(label, value, detail, tone = "") {
        return `
<div class="ops-owner-metric ${tone ? `is-${tone}` : ""}">
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(value)}</strong>
    <small>${escapeHtml(detail || "")}</small>
</div>`;
    }

    function renderOverview() {
        const overview = state.overview;
        if (!overview) {
            elements.overviewCards.innerHTML = `<p class="ops-empty">Sem dados carregados.</p>`;
            elements.laneState.innerHTML = "";
            return;
        }

        const counters = overview.counters || {};
        const configured = overview.configured || {};
        const lanes = overview.state && overview.state.lanes ? overview.state.lanes : {};
        const paymentsStatus = overview.paymentsStatus || {};
        const openContent = getOpenMarketingItems();
        const pendingChanges = state.changeRequests && Array.isArray(state.changeRequests.items)
            ? state.changeRequests.items.filter((item) => String(item.status || "") === "pending")
            : [];
        const activeAlerts = Array.isArray(state.alerts) ? state.alerts : [];
        const needsAttention = Number(counters.activeAlerts || 0) > 0 || pendingChanges.length > 0;

        elements.overviewCards.innerHTML = [
            buildMetricCard("Mercado Pago", paymentsStatus.webhookSignatureValidation === "active" ? "ok" : "revisar", "vendas"),
            buildMetricCard("IA", configured.gemini ? "ativa" : "reserva", configured.gemini ? "Gemini ok" : "sem Gemini"),
            buildMetricCard("Banco de dados", configured.supabase ? "ok" : "revisar", "registros")
        ].join("");

        if (elements.todaySummary) {
            elements.todaySummary.innerHTML = `
<div>
    <p class="ops-kicker">${needsAttention ? "Precisa de atencao" : "Tudo em ordem"}</p>
    <h2>${needsAttention ? "A IA separou o que vale olhar primeiro" : "Pode trabalhar em crescimento hoje"}</h2>
    <p>${needsAttention
        ? "Resolva a lista abaixo de cima para baixo. Os detalhes tecnicos ficam guardados para quando forem necessarios."
        : "Pagamentos, premium e infraestrutura principal estao sem bloqueio aparente. O melhor uso agora e divulgar e melhorar conversao."}</p>
</div>
<div class="ops-hero-status">
    ${buildPill(`${pendingChanges.length} tarefas da IA`, pendingChanges.length ? "warning" : "success")}
    ${buildPill(`${activeAlerts.length} avisos`, activeAlerts.length ? "warning" : "success")}
    ${buildPill(`${openContent.length} posts na fila`, openContent.length >= 7 ? "success" : "warning")}
</div>`;
        }

        if (elements.ownerMetrics) {
            elements.ownerMetrics.innerHTML = [
                buildOwnerMetric("Assinantes", String(counters.premiumActive || 0), "premium ativo"),
                buildOwnerMetric("Vendas", String(counters.checkoutSessions || 0), "iniciadas"),
                buildOwnerMetric("Posts", String(openContent.length), "na fila", openContent.length >= 7 ? "success" : "warning"),
                buildOwnerMetric("Avisos", String(activeAlerts.length), activeAlerts.length ? "olhar" : "limpo", activeAlerts.length ? "warning" : "success")
            ].join("");
        }

        if (elements.moneySnapshot) {
            elements.moneySnapshot.innerHTML = `
<strong>${escapeHtml(String(counters.premiumActive || 0))} assinante(s) ativo(s)</strong>
<span>${escapeHtml(String(counters.checkoutSessions || 0))} venda(s) iniciada(s)</span>
<button class="ops-text-button" type="button" data-jump-tab="financeiro">Ver vendas</button>`;
        }

        if (elements.contentSnapshot) {
            const next = openContent[0] || null;
            elements.contentSnapshot.innerHTML = `
<strong>${escapeHtml(String(openContent.length))} conteudo(s) na fila</strong>
<span>${next ? `Proximo: ${escapeHtml(next.title || next.format || "conteudo")}` : "Nenhum post preparado"}</span>
<button class="ops-text-button" type="button" data-jump-tab="divulgacao">Abrir divulgacao</button>`;
        }

        elements.laneState.innerHTML = [
            buildPill(`gratuito: ${lanes.freeLanePaused ? "pausado" : (overview.freeLaneStatus || "ativo")}`, lanes.freeLanePaused || overview.freeLaneStatus === "critical" ? "danger" : overview.freeLaneStatus === "warning" ? "warning" : "success"),
            buildPill(`premium: ${lanes.premiumLanePaused ? "pausado" : "ativo"}`, lanes.premiumLanePaused ? "danger" : "success"),
            buildPill(`Mercado Pago: ${paymentsStatus.webhookSignatureValidation === "active" ? "ok" : "revisar"}`, paymentsStatus.webhookSignatureValidation === "active" ? "success" : "warning"),
            buildPill(`IA: ${configured.gemini ? "ativa" : "reserva"}`, configured.gemini ? "success" : "warning")
        ].join("");
    }

    function renderPayments() {
        const payments = Array.isArray(state.payments.recentPayments) ? state.payments.recentPayments : [];
        const entitlements = Array.isArray(state.payments.recentEntitlements) ? state.payments.recentEntitlements : [];
        const paymentsStatus = state.paymentsStatus || null;

        elements.paymentsList.innerHTML = payments.length
            ? payments.map((item) => `
<article class="ops-list-item">
    <strong>${escapeHtml(item.plan_id === "premium_annual" ? "Premium anual" : "Premium mensal")} - ${escapeHtml(item.status === "approved" ? "pago" : "iniciado")}</strong>
    <small>Cliente: ${escapeHtml(item.customer_id || "-")}</small>
    <small>Pagamento: ${escapeHtml(item.payment_id || item.preference_id || "-")}</small>
    <small>Atualizado em ${escapeHtml(formatDate(item.updated_at || item.created_at))}</small>
</article>`).join("")
            : `<p class="ops-empty">Nenhum pagamento recente.</p>`;

        elements.entitlementsList.innerHTML = entitlements.length
            ? entitlements.map((item) => `
<article class="ops-list-item">
    <strong>${escapeHtml(item.payer_email || item.customer_id || "-")}</strong>
    <small>${escapeHtml(item.status === "active" ? "Ativo" : item.status || "-")} - ${escapeHtml(item.plan_id === "premium_annual" ? "anual" : "mensal")}</small>
    <small>Valido ate: ${escapeHtml(formatDate(item.valid_until))}</small>
</article>`).join("")
            : `<p class="ops-empty">Nenhum assinante recente.</p>`;

        elements.paymentsStatus.innerHTML = paymentsStatus
            ? `
<article class="ops-list-item">
    <strong>${escapeHtml(paymentsStatus.webhookSignatureValidation === "active" ? "Mercado Pago esta recebendo avisos corretamente" : "Mercado Pago precisa de configuracao")}</strong>
    <div class="ops-list-row">
        ${buildPill(`venda: ${paymentsStatus.checkoutConfigured ? "pronta" : "revisar"}`, paymentsStatus.checkoutConfigured ? "success" : "warning")}
        ${buildPill(`aviso do pagamento: ${paymentsStatus.webhookSignatureValidation === "active" ? "ok" : "revisar"}`, paymentsStatus.webhookSignatureValidation === "active" ? "success" : "warning")}
    </div>
    <small>${escapeHtml(`Vendas iniciadas: ${paymentsStatus.summary ? paymentsStatus.summary.recentCheckouts || 0 : 0}. Assinantes ativos: ${paymentsStatus.summary ? paymentsStatus.summary.activeEntitlements || 0 : 0}.`)}</small>
</article>`
            : `<p class="ops-empty">Status do Mercado Pago ainda nao carregado.</p>`;
    }

    function renderActionQueue() {
        if (!elements.actionQueue) {
            return;
        }

        const alerts = Array.isArray(state.alerts) ? state.alerts : [];
        const pendingChanges = state.changeRequests && Array.isArray(state.changeRequests.items)
            ? state.changeRequests.items.filter((item) => String(item.status || "") === "pending")
            : [];
        const openContent = getOpenMarketingItems();
        const tasks = [];

        alerts.slice(0, 3).forEach((item) => {
            tasks.push(`
<article class="ops-task-card">
    <span class="ops-task-label">Aviso</span>
    <strong>${escapeHtml(humanAlertTitle(item))}</strong>
    <p>${escapeHtml(humanAlertMessage(item))}</p>
    <div class="ops-button-row">
        <button class="ops-button ops-button-secondary" type="button" data-alert-action="resolve" data-alert-id="${escapeHtml(item.id)}">Marcar resolvido</button>
        <button class="ops-button ops-button-ghost" type="button" data-jump-tab="alertas">Ver detalhes</button>
    </div>
</article>`);
        });

        pendingChanges.slice(0, 4).forEach((item) => {
            tasks.push(`
<article class="ops-task-card">
    <span class="ops-task-label">Tarefa da IA</span>
    <strong>${escapeHtml(humanChangeTitle(item))}</strong>
    <p>${escapeHtml(humanChangeSummary(item))}</p>
    <div class="ops-button-row">
        <button class="ops-button" type="button" data-change-request-action="auto" data-change-request-id="${escapeHtml(item.id)}">Deixar IA executar</button>
        <button class="ops-button ops-button-ghost" type="button" data-change-request-action="reject" data-change-request-id="${escapeHtml(item.id)}">Ignorar</button>
    </div>
</article>`);
        });

        if (openContent.length < 7) {
            tasks.push(`
<article class="ops-task-card">
    <span class="ops-task-label">Divulgacao</span>
    <strong>Preparar posts da semana</strong>
    <p>A fila de divulgacao esta curta. A retaguarda pode gerar posts, stories e roteiros sem chamar ferramenta paga.</p>
    <button class="ops-button" type="button" data-quick-action="marketing">Criar posts sem custo</button>
</article>`);
        }

        if (!tasks.length) {
            tasks.push(`
<article class="ops-task-card is-calm">
    <span class="ops-task-label">Livre</span>
    <strong>Nada urgente agora</strong>
    <p>Use este tempo para divulgar o Papiro Tools ou melhorar a oferta premium.</p>
    <div class="ops-button-row">
        <button class="ops-button" type="button" data-quick-action="marketing">Criar posts sem custo</button>
        <button class="ops-button ops-button-secondary" type="button" data-jump-tab="promocoes">Ver ofertas</button>
    </div>
</article>`);
        }

        elements.actionQueue.innerHTML = tasks.join("");
    }

    function renderGrowth() {
        const growth = state.growth || { totals: {}, channels: [], recentEvents: [] };
        const totals = growth.totals || {};

        elements.growthTotals.innerHTML = [
            buildMetricCard("Visitas", String(totals.visits || 0), "entradas"),
            buildMetricCard("Materiais", String(totals.uploads || 0), "enviados"),
            buildMetricCard("Ofertas vistas", String(totals.paywalls || 0), "premium"),
            buildMetricCard("Cliques em comprar", String(totals.checkoutClicks || 0), "intencao"),
            buildMetricCard("Ativacoes", String(totals.premiumActivations || 0), "premium"),
            buildMetricCard("Investimento", formatMoney(totals.spend || 0), "anotado")
        ].join("");

        const channels = Array.isArray(growth.channels) ? growth.channels : [];
        elements.growthChannels.innerHTML = channels.length
            ? channels.map((item) => `
<article class="ops-list-item">
    <strong>${escapeHtml(humanChannel(item.source || "canal"))} / ${escapeHtml(item.campaign || "sem campanha")}</strong>
    <div class="ops-list-row">
        ${buildPill(`visitas ${item.visits || 0}`)}
        ${buildPill(`comprar ${item.checkoutClicks || 0}`)}
        ${buildPill(`premium ${item.premiumActivations || 0}`, item.premiumActivations ? "success" : "")}
        ${buildPill(`investido ${formatMoney(item.spend || 0)}`)}
    </div>
</article>`).join("")
            : `<p class="ops-empty">Sem canais registrados ainda.</p>`;

        const events = Array.isArray(growth.recentEvents) ? growth.recentEvents : [];
        elements.recentGrowthEvents.innerHTML = events.length
            ? events.map((item) => `
<article class="ops-list-item">
    <strong>${escapeHtml(humanEvent(item.event_type || "evento"))}</strong>
    <small>${escapeHtml(humanChannel(item.source || "-"))} / ${escapeHtml(item.campaign || "-")} - ${escapeHtml(formatDate(item.created_at))}</small>
</article>`).join("")
            : `<p class="ops-empty">Sem eventos recentes.</p>`;
    }

    function renderMarketing() {
        const marketing = state.marketing || { items: [], strategy: {}, freeTools: [] };
        const items = Array.isArray(marketing.items) ? marketing.items : [];
        const openItems = items.filter((item) => !["published", "rejected"].includes(String(item.status || "")));
        const readyItems = items.filter((item) => String(item.status || "") === "ready");
        const publishedItems = items.filter((item) => String(item.status || "") === "published");
        const nextItem = openItems[0] || null;

        elements.marketingSummary.innerHTML = [
            buildMetricCard("Na fila", String(openItems.length), "rascunhos abertos"),
            buildMetricCard("Prontos", String(readyItems.length), "aprovados para publicar"),
            buildMetricCard("Publicados", String(publishedItems.length), "historico"),
            buildMetricCard("Proximo", nextItem ? formatDate(nextItem.publishDate) : "-", nextItem ? humanFormat(nextItem.format) : "sem fila")
        ].join("");

        const tools = [
            ["Canva Pro", "Gerar arte com IA/templates ja pagos a partir do prompt do painel."],
            ["Buffer Free", "Fila simples para poucos posts em ate 3 canais."],
            ["Meta Business Suite", "Agendar Instagram/Facebook gratis quando quiser operar direto pela Meta."],
            ["Instagram scheduler nativo", "Programar posts pelo app quando quiser operar direto pelo celular."]
        ];

        elements.marketingTools.innerHTML = tools.map(([name, use]) => `
<article class="ops-list-item">
    <strong>${escapeHtml(name)}</strong>
    <small>${escapeHtml(use)}</small>
</article>`).join("");

        const integrations = state.marketingIntegrations && Array.isArray(state.marketingIntegrations.items)
            ? state.marketingIntegrations.items
            : [];
        if (elements.marketingIntegrations) {
            elements.marketingIntegrations.innerHTML = integrations.length
                ? integrations.map((item) => `
<article class="ops-list-item">
    <strong>${escapeHtml(item.name || "Conector")}</strong>
    <div class="ops-list-row">
        ${buildPill(humanIntegrationStatus(item.status), toneFromStatus(item.status))}
        ${buildPill(item.category || "integracao")}
    </div>
    <small>${escapeHtml(item.summary || "")}</small>
    ${Array.isArray(item.checks) && item.checks.length ? `<small>${escapeHtml(item.checks.slice(0, 4).join(" | "))}</small>` : ""}
    <small>Proximo passo: ${escapeHtml(item.nextAction || "revisar configuracao")}</small>
    ${item.key === "buffer" ? `<div class="ops-button-row"><button class="ops-button ops-button-secondary" type="button" data-buffer-channels>Ver canais Buffer</button></div>` : ""}
    ${item.key === "buffer" && state.bufferChannels ? renderBufferChannelsBlock(state.bufferChannels) : ""}
</article>`).join("")
                : `<p class="ops-empty">Conectores ainda nao carregados.</p>`;
        }

        elements.marketingQueue.innerHTML = items.length
            ? items.slice(0, 30).map((item, index) => {
                const drafts = item.integrationDrafts && typeof item.integrationDrafts === "object" ? item.integrationDrafts : {};
                const bufferDraft = drafts.buffer || {};
                const caption = bufferDraft.text || item.caption || "";
                const defaultDueAt = formatDateTimeLocal(bufferDraft.dueAt || `${item.publishDate || ""}T12:00:00.000-03:00`);
                return `
<article class="ops-list-item ops-content-item" data-marketing-card="${escapeHtml(item.id)}">
    <div class="ops-content-head">
        <div>
            <strong>${escapeHtml(item.title || "Conteudo")}</strong>
            <small>${escapeHtml(item.hook || "")}</small>
            <div class="ops-button-row ops-inline-actions">
                <button class="ops-button" type="button" data-marketing-no-cost-pack="${escapeHtml(item.id)}" title="Prepara Canva Pro, legenda, Buffer e teste seguro sem enviar nada">Automatizar gratis</button>
            </div>
        </div>
        <div class="ops-list-row">
            ${buildPill(item.status === "ready" ? "pronto" : item.status === "published" ? "publicado" : "rascunho", item.status === "published" ? "success" : item.status === "ready" ? "warning" : "")}
            ${buildPill(humanFormat(item.format))}
            ${buildPill(formatDate(item.publishDate))}
        </div>
    </div>
    ${index === 0 ? "" : `<details class="ops-draft-details"><summary>Trabalhar neste rascunho</summary>`}
    <div class="ops-workflow-steps">
        <section class="ops-workflow-step">
            <span class="ops-step-number">1</span>
            <div>
                <strong>Revisar texto</strong>
                <pre class="ops-pre ops-content-copy">${escapeHtml(caption)}</pre>
                <div class="ops-button-row">
                    ${renderCopyButton("legenda", caption)}
                    <button class="ops-button ops-button-secondary" type="button" data-marketing-status="ready" data-marketing-id="${escapeHtml(item.id)}" title="Marca este conteudo como revisado e pronto">Marcar pronto</button>
                </div>
            </div>
        </section>
        <section class="ops-workflow-step">
            <span class="ops-step-number">2</span>
            <div>
                <strong>Criar arte</strong>
                <small>${escapeHtml(item.visualBrief || "Use uma arte limpa, legivel e com chamada para estudar no Papiro.")}</small>
                ${drafts.canva ? `
                <div class="ops-nested-card">
                    <strong>Prompt pronto para Canva IA</strong>
                    <pre class="ops-pre ops-content-copy">${escapeHtml(drafts.canva.aiPrompt || drafts.canva.brief || "")}</pre>
                    <div class="ops-button-row">
                        ${renderCopyButton("prompt Canva IA", drafts.canva.aiPrompt || drafts.canva.brief || "")}
                        ${renderCopyButton("briefing", drafts.canva.brief || "")}
                        <a class="ops-button ops-button-secondary" href="${escapeHtml(drafts.canva.canvaAiUrl || "https://www.canva.com/magic/")}" target="_blank" rel="noopener noreferrer" title="Abre o Canva IA em uma nova aba">Abrir Canva IA</a>
                    </div>
                </div>` : ""}
                <button class="ops-button ops-button-secondary" type="button" data-marketing-prepare="canva" data-marketing-id="${escapeHtml(item.id)}" title="Prepara briefing para arte no Canva">Preparar Canva</button>
            </div>
        </section>
        <section class="ops-workflow-step">
            <span class="ops-step-number">3</span>
            <div>
                <strong>Testar e agendar</strong>
                <small>Primeiro teste. Depois, quando estiver tudo bonito, agenda no Buffer.</small>
                <div class="ops-schedule-grid">
                    <label>
                        <span>Quando publicar</span>
                        <input type="datetime-local" data-buffer-due-at="${escapeHtml(item.id)}" value="${escapeHtml(defaultDueAt)}">
                    </label>
                    <label>
                        <span>URL da arte pronta</span>
                        <input type="url" data-buffer-image-url="${escapeHtml(item.id)}" placeholder="https://...">
                    </label>
                </div>
                ${bufferDraft.status ? `<small>Buffer: ${escapeHtml(bufferStatusLabel(bufferDraft.status))}${bufferDraft.dueAt ? ` para ${escapeHtml(formatDate(bufferDraft.dueAt))}` : ""}</small>` : ""}
                ${renderBufferResults(bufferDraft)}
                <div class="ops-button-row">
                    <button class="ops-button ops-button-secondary" type="button" data-marketing-prepare="buffer" data-marketing-id="${escapeHtml(item.id)}" title="Prepara rascunho para agenda no Buffer">Preparar Buffer</button>
                    <button class="ops-button ops-button-secondary" type="button" data-marketing-buffer-test="${escapeHtml(item.id)}" title="Simula sem enviar para o Buffer">Testar seguro</button>
                    <button class="ops-button" type="button" data-marketing-buffer-schedule="${escapeHtml(item.id)}" title="Agenda este texto nos canais configurados do Buffer">Agendar</button>
                </div>
            </div>
        </section>
    </div>
    <details class="ops-inline-details">
        <summary>Bastidores deste rascunho</summary>
        ${(item.channels || []).slice(0, 3).map((channel) => buildPill(humanChannel(channel))).join("")}
        ${Array.isArray(item.script) && item.script.length ? `<small>Roteiro: ${escapeHtml(item.script.join(" | "))}</small>` : ""}
        ${drafts.buffer ? `<pre class="ops-pre ops-content-copy">${escapeHtml(drafts.buffer.text || "")}</pre>` : ""}
        <div class="ops-button-row">
            <button class="ops-button ops-button-secondary" type="button" data-marketing-status="published" data-marketing-id="${escapeHtml(item.id)}" title="Registra que este conteudo ja foi publicado">Marcar publicado</button>
            <button class="ops-button ops-button-ghost" type="button" data-marketing-status="rejected" data-marketing-id="${escapeHtml(item.id)}" title="Ignora este rascunho">Ignorar</button>
        </div>
    </details>
    ${index === 0 ? "" : "</details>"}
</article>`;
            }).join("")
            : `<p class="ops-empty">Nenhum conteudo na fila. Gere 14 dias para comecar.</p>`;
    }

    function renderWeeklyReport() {
        if (!state.weeklyReport) {
            elements.weeklyReport.textContent = "Relatorio ainda nao carregado.";
            return;
        }
        elements.weeklyReport.textContent = state.weeklyReport.textReport || state.weeklyReport.text || JSON.stringify(state.weeklyReport.highlights || state.weeklyReport, null, 2);
    }

    function renderCopilot() {
        const output = state.copilot;
        if (!output) {
            elements.copilotOutput.innerHTML = `<p class="ops-empty">Peca um resumo, um plano da semana ou uma pergunta manual.</p>`;
            return;
        }

        elements.copilotOutput.innerHTML = `
<article class="ops-copilot-panel">
    <strong>${escapeHtml(output.title || output.scope || "Analise da IA")}</strong>
    <p>${escapeHtml(output.summary || output.response || output.status || "Sem resumo.")}</p>
    ${Array.isArray(output.actions) && output.actions.length ? `<ul class="ops-section-list">${output.actions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
    ${output.raw ? `<pre class="ops-pre">${escapeHtml(JSON.stringify(output.raw, null, 2))}</pre>` : ""}
</article>`;
    }

    function renderPromotions() {
        const promotions = state.promotions || { mode: "suggest", channels: [], items: [] };
        elements.promotionModeSelect.value = promotions.mode || "suggest";
        elements.promotionChannels.innerHTML = (promotions.channels || []).length
            ? promotions.channels.map((channel) => buildPill(humanChannel(channel))).join("")
            : buildPill("sem canais configurados", "warning");

        const items = Array.isArray(promotions.items) ? promotions.items : [];
        elements.promotionList.innerHTML = items.length
            ? items.map((item) => `
<article class="ops-list-item">
    <strong>${escapeHtml(item.title || humanFeature(item.feature) || "Promocao")}</strong>
    <div class="ops-list-row">
        ${buildPill(item.status === "active" ? "ativa" : item.status === "paused" ? "pausada" : "rascunho", item.status === "active" ? "success" : item.status === "paused" ? "warning" : "")}
        ${buildPill(humanChannel(item.channel || "internal_site"))}
        ${buildPill(humanMode(item.mode || promotions.mode || "suggest"))}
    </div>
    <small>${escapeHtml(item.message || item.summary || "")}</small>
    <div class="ops-button-row">
        <button class="ops-button ops-button-secondary" type="button" data-promotion-apply="activate" data-campaign-id="${escapeHtml(item.id)}" title="Ativa esta promocao no modo configurado">Ativar</button>
        <button class="ops-button ops-button-ghost" type="button" data-promotion-apply="pause" data-campaign-id="${escapeHtml(item.id)}" title="Pausa esta promocao sem apagar o historico">Pausar</button>
    </div>
</article>`).join("")
            : `<p class="ops-empty">Nenhuma promocao registrada.</p>`;
    }

    function renderReviewSummaryCard(item) {
        const recommendations = item.recommendations || {};
        const sections = [
            ["Divulgacao", recommendations.campaignActions],
            ["Site", recommendations.siteImprovements],
            ["Correcoes", recommendations.bugPriorities]
        ];

        return `
<article class="ops-list-item">
    <strong>${escapeHtml(item.summary || "A IA revisou o painel")}</strong>
    <div class="ops-list-row">
        ${buildPill(item.provider === "gemini" ? "IA principal" : "plano reserva")}
        ${buildPill(item.confidence === "high" ? "alta confianca" : "conferencia rapida", item.confidence === "high" ? "success" : "warning")}
        ${buildPill(formatDate(item.completed_at || item.created_at))}
    </div>
    ${sections.map(([label, values]) => Array.isArray(values) && values.length ? `<small>${escapeHtml(label)}: ${escapeHtml(values.slice(0, 2).join(" | "))}</small>` : "").join("")}
</article>`;
    }

    function renderChangeRequestCard(item) {
        const isPending = String(item.status || "") === "pending";
        return `
<article class="ops-list-item">
    <strong>${escapeHtml(humanChangeTitle(item))}</strong>
    <small>${escapeHtml(humanChangeSummary(item))}</small>
    ${isPending ? `<div class="ops-button-row">
        <button class="ops-button" type="button" data-change-request-action="auto" data-change-request-id="${escapeHtml(item.id)}" title="Aprova e tenta executar esta tarefa">Deixar IA executar</button>
        <button class="ops-button ops-button-ghost" type="button" data-change-request-action="reject" data-change-request-id="${escapeHtml(item.id)}" title="Ignora esta sugestao">Ignorar</button>
    </div>` : `<small>Status: ${escapeHtml(item.status || "-")}</small>`}
</article>`;
    }

    function renderReview() {
        const improvements = state.siteImprovements && Array.isArray(state.siteImprovements.items) ? state.siteImprovements.items : [];
        elements.siteImprovements.innerHTML = improvements.length
            ? improvements.map((item) => `
<article class="ops-list-item">
    <strong>${escapeHtml(item.title || "Melhoria")}</strong>
    <small>${escapeHtml(item.summary || "")}</small>
    <small>${escapeHtml(humanSource(item.source))}${item.priority ? ` - prioridade ${escapeHtml(item.priority)}` : ""}</small>
</article>`).join("")
            : `<p class="ops-empty">Sem melhorias priorizadas.</p>`;

        const changeRequests = state.changeRequests && Array.isArray(state.changeRequests.items)
            ? state.changeRequests.items.filter((item) => String(item.status || "") === "pending")
            : [];
        elements.changeRequests.innerHTML = changeRequests.length
            ? changeRequests.map(renderChangeRequestCard).join("")
            : `<p class="ops-empty">Nenhuma aprovacao pendente.</p>`;

        const runs = state.reviewRuns && Array.isArray(state.reviewRuns.items) ? state.reviewRuns.items : [];
        elements.reviewRuns.innerHTML = runs.length
            ? runs.map(renderReviewSummaryCard).join("")
            : `<p class="ops-empty">Nenhuma revisao registrada.</p>`;
    }

    function renderAlerts() {
        const alerts = Array.isArray(state.alerts) ? state.alerts : [];
        elements.alertsList.innerHTML = alerts.length
            ? alerts.map((item) => `
<article class="ops-list-item">
    <strong>${escapeHtml(humanAlertTitle(item))}</strong>
    <div class="ops-list-row">
        ${buildPill(item.severity === "critical" ? "urgente" : item.severity === "warning" ? "atencao" : "informacao", item.severity === "critical" ? "danger" : item.severity === "warning" ? "warning" : "")}
        ${item.provider ? buildPill(humanProvider(item.provider)) : ""}
    </div>
    <small>${escapeHtml(humanAlertMessage(item))}</small>
    <small>Criado em ${escapeHtml(formatDate(item.created_at))}</small>
    <div class="ops-button-row">
        <button class="ops-button ops-button-secondary" type="button" data-alert-action="resolve" data-alert-id="${escapeHtml(item.id)}">Marcar resolvido</button>
        <details class="ops-inline-details">
            <summary>Detalhes tecnicos</summary>
            <pre class="ops-pre ops-compact-pre">${escapeHtml(JSON.stringify({
                tipo: item.event_type,
                mensagem: item.message,
                dados: item.payload || {}
            }, null, 2))}</pre>
        </details>
    </div>
</article>`).join("")
            : `<p class="ops-empty">Sem alertas recentes.</p>`;
    }

    function renderSearch() {
        const search = state.search;
        if (!search || !search.results) {
            elements.searchResults.innerHTML = `<p class="ops-empty">Busque por customerId, materialHash ou pagamento.</p>`;
            return;
        }

        elements.searchResults.innerHTML = Object.entries(search.results).map(([label, items]) => `
<article class="ops-search-block">
    <strong>${escapeHtml(label)}</strong>
    ${Array.isArray(items) && items.length
        ? items.map((item) => `<small>${escapeHtml(JSON.stringify(item))}</small>`).join("")
        : `<p class="ops-empty">Sem resultados.</p>`}
</article>`).join("");
    }

    function renderAll() {
        renderOverview();
        renderPayments();
        renderGrowth();
        renderMarketing();
        renderWeeklyReport();
        renderCopilot();
        renderPromotions();
        renderReview();
        renderAlerts();
        renderActionQueue();
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

    async function loadMarketing() {
        state.marketing = await request("/api/ops/marketing/content");
    }

    async function loadMarketingIntegrations() {
        state.marketingIntegrations = await request("/api/ops/marketing/integrations");
    }

    async function loadPromotions() {
        state.promotions = await request("/api/ops/promotions");
    }

    async function loadChangeRequests() {
        state.changeRequests = await request("/api/ops/change-requests?status=pending&limit=20");
    }

    async function loadReviewRuns() {
        state.reviewRuns = await request("/api/ops/reviews?limit=10");
    }

    async function loadSiteImprovements() {
        state.siteImprovements = await request("/api/ops/site-improvements");
    }

    async function loadAlerts() {
        const payload = await request("/api/ops/alerts");
        state.alerts = payload.items || [];
    }

    async function loadWeeklyReport() {
        state.weeklyReport = await request("/api/ops/reports/weekly");
    }

    async function loadDashboard() {
        setStatus("Atualizando painel do Papiro Tools...");
        await Promise.all([
            loadOverview(),
            loadFinance(),
            loadPaymentsStatus(),
            loadGrowth(),
            loadMarketing(),
            loadMarketingIntegrations(),
            loadPromotions(),
            loadChangeRequests(),
            loadReviewRuns(),
            loadSiteImprovements(),
            loadAlerts(),
            loadWeeklyReport()
        ]);
        showDashboard();
        renderAll();
        setStatus("Painel atualizado.", "success");
    }

    async function clearSessionOnEntry() {
        resetClientSessionState();
        showLogin();
        setStatus("Use a senha da retaguarda para liberar o painel.");
    }

    async function handleLogin(event) {
        event.preventDefault();
        const form = new FormData(elements.loginForm);
        try {
            await submitJson("/api/ops/login", { password: form.get("password") });
            elements.loginForm.reset();
            setStatus("Autenticando...");
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
            await submitJson("/api/ops/actions", { action, reason: "ops_console" });
            await loadDashboard();
        } catch (error) {
            setStatus(error.message || "Falha ao executar acao.", "error");
        }
    }

    async function handleHealthCheck() {
        try {
            setStatus("A IA esta verificando pagamentos, alertas e divulgacao...");
            await submitJson("/api/ops/health/daily-run", { force: true, provider: "fallback" });
            await loadDashboard();
            setStatus("Verificacao concluida. A lista de hoje foi atualizada.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao verificar o painel.", "error");
        }
    }

    async function handleResolveAlert(alertId) {
        try {
            await submitJson("/api/ops/actions", {
                action: "resolve_alert",
                alertId,
                reason: "ops_console"
            });
            await Promise.all([loadOverview(), loadAlerts()]);
            renderOverview();
            renderAlerts();
            renderActionQueue();
            setStatus("Aviso marcado como resolvido.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao resolver aviso.", "error");
        }
    }

    async function handleClearTechAlerts() {
        try {
            await submitJson("/api/ops/actions", {
                action: "resolve_provider_fallback_alerts",
                reason: "ops_console"
            });
            await Promise.all([loadOverview(), loadAlerts()]);
            renderOverview();
            renderAlerts();
            renderActionQueue();
            setStatus("Avisos tecnicos antigos foram limpos.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao limpar avisos tecnicos.", "error");
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
            await loadGrowth();
            renderGrowth();
            setStatus("Investimento registrado.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao registrar investimento.", "error");
        }
    }

    async function handleMarketingGenerate(provider = "") {
        try {
            setStatus(provider === "fallback" ? "Gerando fila organica sem custo..." : "Gerando fila organica com a IA configurada...");
            state.marketing = await submitJson("/api/ops/marketing/content/generate", {
                days: 14,
                provider
            });
            renderMarketing();
            setStatus("Fila de divulgacao atualizada.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao gerar fila de divulgacao.", "error");
        }
    }

    async function handleMarketingStatus(status, itemId) {
        try {
            state.marketing = await submitJson("/api/ops/marketing/content/status", {
                itemId,
                status,
                operatorNotes: "ops_console"
            });
            renderMarketing();
            const labels = { ready: "pronto", published: "publicado", rejected: "ignorado" };
            setStatus(`Conteudo marcado como ${labels[status] || status}.`, "success");
        } catch (error) {
            setStatus(error.message || "Falha ao atualizar conteudo.", "error");
        }
    }

    async function handleMarketingPrepare(target, itemId) {
        try {
            state.marketing = await submitJson("/api/ops/marketing/content/prepare", {
                itemId,
                target
            });
            renderMarketing();
            const labels = {
                canva: "Briefing para Canva preparado.",
                buffer: "Rascunho para Buffer preparado."
            };
            setStatus(labels[target] || "Rascunho de integracao preparado.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao preparar integracao.", "error");
        }
    }

    async function handleMarketingNoCostPack(itemId) {
        try {
            setStatus("Preparando pacote gratis: Canva Pro, legenda e Buffer seguro...");
            state.marketing = await submitJson("/api/ops/marketing/content/no-cost-pack", {
                itemId
            });
            renderMarketing();
            setStatus("Pacote gratis preparado. Agora e so abrir o Canva IA e revisar antes de agendar.", "success");
        } catch (error) {
            if (error.payload && error.payload.items) {
                state.marketing = error.payload;
                renderMarketing();
            }
            setStatus(error.message || "Falha ao preparar pacote gratis.", "error");
        }
    }

    function getBufferDraftInput(itemId) {
        const dueAtInput = document.querySelector(`[data-buffer-due-at="${CSS.escape(String(itemId || ""))}"]`);
        const imageUrlInput = document.querySelector(`[data-buffer-image-url="${CSS.escape(String(itemId || ""))}"]`);
        const dueAtValue = dueAtInput && dueAtInput.value ? new Date(dueAtInput.value).toISOString() : "";
        return {
            itemId,
            dueAt: dueAtValue,
            imageUrl: imageUrlInput ? String(imageUrlInput.value || "").trim() : ""
        };
    }

    async function handleMarketingBufferTest(itemId) {
        try {
            setStatus("Fazendo teste seguro. Nada sera enviado ao Buffer...");
            state.marketing = await submitJson("/api/ops/marketing/content/schedule-buffer", {
                ...getBufferDraftInput(itemId),
                dryRun: true
            });
            renderMarketing();
            setStatus("Teste seguro concluido. Agora da para revisar antes de agendar.", "success");
        } catch (error) {
            if (error.payload && error.payload.items) {
                state.marketing = error.payload;
                renderMarketing();
            }
            setStatus(error.message || "Falha no teste seguro do Buffer.", "error");
        }
    }

    async function handleMarketingBufferSchedule(itemId) {
        const input = getBufferDraftInput(itemId);
        const ok = window.confirm("Isto vai enviar de verdade para o Buffer. Confirmar agendamento?");
        if (!ok) {
            setStatus("Agendamento cancelado. Nada foi enviado.");
            return;
        }
        try {
            setStatus("Enviando rascunho para o Buffer...");
            state.marketing = await submitJson("/api/ops/marketing/content/schedule-buffer", {
                ...input
            });
            renderMarketing();
            setStatus("Post agendado no Buffer.", "success");
        } catch (error) {
            if (error.payload && error.payload.items) {
                state.marketing = error.payload;
                renderMarketing();
            }
            setStatus(error.message || "Falha ao agendar no Buffer.", "error");
        }
    }

    async function handleCopyText(value) {
        try {
            await navigator.clipboard.writeText(value || "");
            setStatus("Copiado.", "success");
        } catch (error) {
            setStatus("Nao consegui copiar automaticamente. Selecione o texto e copie manualmente.", "error");
        }
    }

    async function handleBufferChannels() {
        try {
            setStatus("Consultando canais do Buffer...");
            state.bufferChannels = {
                loading: true,
                selectedOrganizationId: "consultando"
            };
            renderMarketing();
            state.bufferChannels = await request("/api/ops/marketing/buffer/channels");
            renderMarketing();
            setStatus("Canais do Buffer carregados.", "success");
        } catch (error) {
            state.bufferChannels = {
                ok: false,
                status: error.payload && error.payload.status ? error.payload.status : "buffer_channels_failed",
                message: error.message || "Falha ao consultar canais do Buffer.",
                ...(error.payload || {})
            };
            renderMarketing();
            setStatus(error.message || "Falha ao consultar canais do Buffer.", "error");
        }
    }

    async function handleMarketingInstagramPublish(itemId) {
        const imageUrl = window.prompt("Cole a URL publica HTTPS da arte pronta para publicar no Instagram:");
        if (!imageUrl) {
            setStatus("Publicacao no Instagram cancelada.");
            return;
        }

        try {
            setStatus("Publicando no Instagram pela Meta API...");
            state.marketing = await submitJson("/api/ops/marketing/content/publish-instagram", {
                itemId,
                imageUrl
            });
            renderMarketing();
            setStatus("Publicado no Instagram.", "success");
        } catch (error) {
            if (error.payload && error.payload.items) {
                state.marketing = error.payload;
                renderMarketing();
            }
            setStatus(error.message || "Falha ao publicar no Instagram.", "error");
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
            setStatus(error.message || "Falha ao reprocessar pagamento.", "error");
        }
    }

    async function runCopilot(scope, query = "") {
        try {
            state.copilot = await submitJson("/api/ops/copilot/analyze", { scope, query });
            renderCopilot();
            setStatus("IA atualizada.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao rodar copiloto.", "error");
        }
    }

    async function handlePromotionMode(event) {
        event.preventDefault();
        const form = new FormData(elements.promotionModeForm);
        try {
            await submitJson("/api/ops/promotions/mode", { mode: form.get("mode") });
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
                surface: "premium_checkout",
                channel: form.get("channel"),
                mode: state.promotions.mode || "suggest",
                origin: "ops_console",
                audience: { source: form.get("audienceSource") }
            });
            await loadPromotions();
            renderPromotions();
            setStatus("Rascunho de promocao criado.", "success");
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
            await loadPromotions();
            renderPromotions();
            setStatus(`Promocao ${action} aplicada.`, "success");
        } catch (error) {
            setStatus(error.message || "Falha ao aplicar promocao.", "error");
        }
    }

    async function handleRunThreeDayReview() {
        try {
            setStatus("A IA esta fazendo uma revisao completa do Papiro...");
            await submitJson("/api/ops/reviews/run", { provider: "fallback" });
            await Promise.all([loadOverview(), loadChangeRequests(), loadReviewRuns(), loadSiteImprovements()]);
            renderOverview();
            renderReview();
            setStatus("Revisao completa concluida.", "success");
        } catch (error) {
            setStatus(error.message || "Falha ao rodar review de 3 dias.", "error");
        }
    }

    async function handleChangeRequestAction(action, changeRequestId) {
        if (action === "auto") {
            try {
                await submitJson("/api/ops/change-requests/approve", { changeRequestId, approvalNotes: "ops_console_auto" });
                await submitJson("/api/ops/change-requests/execute", { changeRequestId, approvalNotes: "ops_console_auto" });
                await Promise.all([loadOverview(), loadChangeRequests(), loadReviewRuns(), loadSiteImprovements(), loadPaymentsStatus(), loadAlerts()]);
                renderOverview();
                renderPayments();
                renderReview();
                renderAlerts();
                renderActionQueue();
                setStatus("A IA tentou executar a tarefa.", "success");
            } catch (error) {
                setStatus(error.message || "A IA nao conseguiu executar essa tarefa.", "error");
            }
            return;
        }

        const route = action === "approve"
            ? "/api/ops/change-requests/approve"
            : action === "reject"
                ? "/api/ops/change-requests/reject"
                : "/api/ops/change-requests/execute";
        try {
            await submitJson(route, { changeRequestId, approvalNotes: "ops_console" });
            await Promise.all([loadOverview(), loadChangeRequests(), loadReviewRuns(), loadSiteImprovements(), loadPaymentsStatus()]);
            renderOverview();
            renderPayments();
            renderReview();
            renderActionQueue();
            setStatus("Tarefa da IA atualizada.", "success");
        } catch (error) {
            setStatus(error.message || "Falha na tarefa da IA.", "error");
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
        elements.runHealthBtn.addEventListener("click", handleHealthCheck);
        elements.quickMarketingBtn.addEventListener("click", () => handleMarketingGenerate("fallback"));
        elements.clearTechAlertsBtn.addEventListener("click", handleClearTechAlerts);
        elements.marketingGenerateBtn.addEventListener("click", () => handleMarketingGenerate(""));
        elements.marketingFallbackBtn.addEventListener("click", () => handleMarketingGenerate("fallback"));
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

        elements.navButtons.forEach((button) => {
            button.addEventListener("click", () => setActiveTab(button.dataset.opsTab));
        });
        elements.laneActionButtons.forEach((button) => {
            button.addEventListener("click", () => handleLaneAction(button.dataset.opsAction));
        });
        elements.dashboard.addEventListener("click", (event) => {
            const jumpButton = event.target.closest("[data-jump-tab]");
            if (jumpButton) {
                setActiveTab(jumpButton.dataset.jumpTab);
                return;
            }

            const quickButton = event.target.closest("[data-quick-action]");
            if (quickButton && quickButton.dataset.quickAction === "marketing") {
                handleMarketingGenerate("fallback");
                return;
            }

            const alertButton = event.target.closest("[data-alert-action]");
            if (alertButton && alertButton.dataset.alertAction === "resolve") {
                handleResolveAlert(alertButton.dataset.alertId);
            }
        });
        elements.promotionList.addEventListener("click", (event) => {
            const button = event.target.closest("[data-promotion-apply]");
            if (button) {
                handlePromotionApply(button.dataset.promotionApply, button.dataset.campaignId);
            }
        });
        if (elements.marketingIntegrations) {
            elements.marketingIntegrations.addEventListener("click", (event) => {
                const button = event.target.closest("[data-buffer-channels]");
                if (button) {
                    event.stopPropagation();
                    handleBufferChannels();
                }
            });
        }
        document.addEventListener("click", (event) => {
            const button = event.target.closest("[data-buffer-channels]");
            if (button) {
                handleBufferChannels();
            }
        });
        elements.marketingQueue.addEventListener("click", (event) => {
            const noCostPackButton = event.target.closest("[data-marketing-no-cost-pack]");
            if (noCostPackButton) {
                handleMarketingNoCostPack(noCostPackButton.dataset.marketingNoCostPack);
                return;
            }

            const copyButton = event.target.closest("[data-copy-text]");
            if (copyButton) {
                handleCopyText(copyButton.dataset.copyText || "");
                return;
            }

            const bufferTestButton = event.target.closest("[data-marketing-buffer-test]");
            if (bufferTestButton) {
                handleMarketingBufferTest(bufferTestButton.dataset.marketingBufferTest);
                return;
            }

            const bufferScheduleButton = event.target.closest("[data-marketing-buffer-schedule]");
            if (bufferScheduleButton) {
                handleMarketingBufferSchedule(bufferScheduleButton.dataset.marketingBufferSchedule);
                return;
            }

            const instagramPublishButton = event.target.closest("[data-marketing-instagram-publish]");
            if (instagramPublishButton) {
                handleMarketingInstagramPublish(instagramPublishButton.dataset.marketingInstagramPublish);
                return;
            }

            const prepareButton = event.target.closest("[data-marketing-prepare]");
            if (prepareButton) {
                handleMarketingPrepare(prepareButton.dataset.marketingPrepare, prepareButton.dataset.marketingId);
                return;
            }

            const button = event.target.closest("[data-marketing-status]");
            if (button) {
                handleMarketingStatus(button.dataset.marketingStatus, button.dataset.marketingId);
            }
        });
        elements.changeRequests.addEventListener("click", (event) => {
            const button = event.target.closest("[data-change-request-action]");
            if (button) {
                handleChangeRequestAction(button.dataset.changeRequestAction, button.dataset.changeRequestId);
            }
        });
    }

    async function init() {
        bindEvents();
        setActiveTab("painel");
        await clearSessionOnEntry();
    }

    init();
})();
