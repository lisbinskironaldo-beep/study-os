/* =====================================================
   CORE ARCHITECTURE — HORÁRIO ONLINE
===================================================== */

const Core = {

    state: {
        mode: "clock",
        running: false,
        editing: false
    },

    modules: {},
    moduleElements: [],
    footerButtons: [],
    hero: null,
    controls: null,
    printBtn: null,
    shortcutHint: null,
    shortcutShowTimer: null,
    shortcutHideTimer: null,
    topbar: null,
    topbarCollapseBtn: null,
    topbarStorageKey: "rotanota_topbar_collapsed",
    ambientFocusPanelMode: null,
    premiumStudyLoadPromise: null,
    homeStatsRefreshToken: 0,
    homeBandPanelTimer: null,
    homeBandPanelIndex: 0,
    pendingGoogleGateIntent: null,
    historyReady: false,
    lastHistoryTarget: "home",

    /* ================= INIT ================= */

    init() {
        window.RotaNotaCore = this;
        this.cacheDOM();
        this.ensureAuthBridge();
        this.upgradeHomeLoginGate();
        this.initStyleTheme();
        this.registerModules();
        if (typeof UtilityWindows !== "undefined") {
            UtilityWindows.init();
        }
        this.bindUI();
        this.initKeyboard();
        this.initFullscreen();
        this.initDarkMode();
        this.initTopbarCollapse();
        this.handlePremiumPaymentReturn();
        const initialHistoryTarget =
            this.initBrowserHistory();

        if (this.state.mode === "clock") {
            if (initialHistoryTarget === "home") {
                this.goHome({
                    replaceHistory: true
                });
            } else {
                this.navigate(
                    initialHistoryTarget,
                    {
                        replaceHistory: true
                    }
                );
            }
        } else {
            this.syncBrowserHistory(
                this.state.mode,
                {
                    replace: true,
                    force: true
                }
            );
        }

        this.initShortcutHint();
        this.schedulePremiumStudyPreload();
        this.refreshHomeStatsWidget();
    },

    ensureAuthBridge() {
        if (window.RotaNotaAuth) {
            return;
        }

        const existing = document.querySelector(
            'script[data-rotanota-auth="true"]'
        );

        if (existing) {
            return;
        }

        const script = document.createElement("script");
        script.src = "js/auth.js";
        script.defer = true;
        script.setAttribute("data-rotanota-auth", "true");
        document.body.appendChild(script);
    },

    upgradeHomeLoginGate() {
        const gateCard =
            document.querySelector(
                "#homeStatsLoginGate .home-login-gate-card"
            );

        if (!gateCard) {
            return;
        }

        gateCard.innerHTML = `
            <div class="home-login-gate-shell">
                <span id="homeLoginGateKicker" class="home-login-gate-kicker">Conta Google</span>
                <div class="home-login-gate-lockup" aria-hidden="true">
                    <div class="home-login-gate-brand home-login-gate-brand-rotanota">
                        <img src="assets/rotanota-logo-dark.svg" alt="" class="home-login-gate-brand-rotanota-logo">
                    </div>
                    <span class="home-login-gate-merge" aria-hidden="true"></span>
                    <div class="home-login-gate-brand home-login-gate-brand-google">
                        <span class="home-login-gate-google-mark">
                            <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true">
                                <path fill="#EA4335" d="M24 9.5c3.15 0 6 1.09 8.24 3.22l6.15-6.15C34.63 3.11 29.72 1 24 1 14.63 1 6.54 6.38 2.56 14.22l7.58 5.89C11.96 13.81 17.47 9.5 24 9.5z"></path>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.14-3.08-.4-4.55H24v9.04h12.9c-.56 3-2.25 5.54-4.8 7.25l7.4 5.74c4.32-3.98 6.48-9.85 6.48-17.48z"></path>
                                <path fill="#FBBC05" d="M10.14 28.11a14.51 14.51 0 0 1 0-8.22l-7.58-5.89a23.02 23.02 0 0 0 0 20l7.58-5.89z"></path>
                                <path fill="#34A853" d="M24 48c6.48 0 11.92-2.13 15.89-5.8l-7.4-5.74c-2.06 1.38-4.7 2.19-8.49 2.19-6.53 0-12.04-4.31-14.02-10.61l-7.58 5.89C6.54 41.62 14.63 48 24 48z"></path>
                            </svg>
                        </span>
                    </div>
                </div>
                <h2 id="homeStatsLoginGateTitle">Entre com Google para continuar</h2>
                <p id="homeLoginGateDescription">Sua conta segura painel, premium e continuidade entre dispositivos.</p>
                <div id="homeLoginGateRoute" class="home-login-gate-route">O acesso continua so depois do login.</div>
                <div id="homeLoginGateStatus" class="home-login-gate-status hidden" aria-live="polite"></div>
            </div>
            <div class="home-login-gate-actions">
                <button class="home-login-gate-secondary" type="button" data-home-login-close="true">Agora nao</button>
                <div class="home-login-gate-google-control">
                    <div class="home-login-gate-primary home-login-gate-primary-visual" aria-hidden="true">
                        <span class="home-login-gate-primary-mark" aria-hidden="true">
                            <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true">
                                <path fill="#EA4335" d="M24 9.5c3.15 0 6 1.09 8.24 3.22l6.15-6.15C34.63 3.11 29.72 1 24 1 14.63 1 6.54 6.38 2.56 14.22l7.58 5.89C11.96 13.81 17.47 9.5 24 9.5z"></path>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.14-3.08-.4-4.55H24v9.04h12.9c-.56 3-2.25 5.54-4.8 7.25l7.4 5.74c4.32-3.98 6.48-9.85 6.48-17.48z"></path>
                                <path fill="#FBBC05" d="M10.14 28.11a14.51 14.51 0 0 1 0-8.22l-7.58-5.89a23.02 23.02 0 0 0 0 20l7.58-5.89z"></path>
                                <path fill="#34A853" d="M24 48c6.48 0 11.92-2.13 15.89-5.8l-7.4-5.74c-2.06 1.38-4.7 2.19-8.49 2.19-6.53 0-12.04-4.31-14.02-10.61l-7.58 5.89C6.54 41.62 14.63 48 24 48z"></path>
                            </svg>
                        </span>
                        <span>Continuar com o Google</span>
                    </div>
                    <div class="home-login-gate-google-button-slot" id="homeStatsLoginGateButtonSlot" aria-live="polite"></div>
                </div>
            </div>
        `;
    },

    getGoogleGateIntent(intent = "stats") {
        if (typeof intent === "string") {
            return {
                kind: intent === "stats"
                    ? "stats"
                    : intent,
                source: intent
            };
        }

        return {
            kind: String(intent.kind || intent.source || "stats").trim() || "stats",
            source: String(intent.source || intent.kind || "stats").trim() || "stats",
            planId: String(intent.planId || "").trim(),
            planLabel: String(intent.planLabel || "").trim()
        };
    },

    getGoogleGateCopy(intent = {}) {
        const normalized =
            this.getGoogleGateIntent(intent);

        if (normalized.kind === "premium_checkout") {
            const planLabel =
                normalized.planLabel ||
                (normalized.planId === "premium_annual"
                    ? "Premium anual"
                    : "Premium mensal");

            return {
                kicker: "Premium",
                title: `Entre com Google para continuar com ${planLabel}`,
                description: "Uma conta unica para premium e continuidade.",
                route: `Depois do login, voce segue para ${planLabel}.`
            };
        }

        if (normalized.kind === "account") {
            return {
                kicker: "Conta Google",
                title: "Entre com Google para usar sua conta",
                description: "",
                route: ""
            };
        }

        return {
            kicker: "Estatisticas",
            title: "Entre com Google para abrir seu painel completo",
            description: "O painel completo fica salvo na sua conta.",
            route: "Depois do login, abrimos seu painel completo."
        };
    },

    updateGoogleGateContent(intent = "stats") {
        const copy =
            this.getGoogleGateCopy(intent);
        const kicker =
            document.getElementById(
                "homeLoginGateKicker"
            );
        const title =
            document.getElementById(
                "homeStatsLoginGateTitle"
            );
        const description =
            document.getElementById(
                "homeLoginGateDescription"
            );
        const route =
            document.getElementById(
                "homeLoginGateRoute"
            );

        if (kicker) {
            kicker.textContent =
                copy.kicker;
        }

        if (title) {
            title.textContent =
                copy.title;
        }

        if (description) {
            description.textContent =
                copy.description;
            description.classList.toggle(
                "hidden",
                !copy.description
            );
        }

        if (route) {
            route.textContent =
                copy.route;
            route.classList.toggle(
                "hidden",
                !copy.route
            );
        }

        this.setGoogleGateStatus("");
    },

    setGoogleGateStatus(message = "", options = {}) {
        const status =
            document.getElementById(
                "homeLoginGateStatus"
            );

        if (!status) {
            return;
        }

        if (message) {
            status.textContent = message;
            status.classList.toggle(
                "is-soft",
                options.level === "soft"
            );
            status.classList.remove("hidden");
            return;
        }

        status.textContent = "";
        status.classList.remove("is-soft");
        status.classList.add("hidden");
    },

    isGoogleAuthenticated() {
        if (
            window.RotaNotaAuth &&
            typeof window.RotaNotaAuth
                .isAuthenticated ===
                "function"
        ) {
            try {
                return Boolean(
                    window.RotaNotaAuth.isAuthenticated()
                );
            } catch (_error) {
                return false;
            }
        }

        return false;
    },

    getPremiumPaymentReturn() {
        const params = new URLSearchParams(window.location.search);
        const status = params.get("premiumPayment");

        if (!["success", "failure", "pending"].includes(status)) {
            return null;
        }

        return {
            status,
            paymentId: params.get("payment_id") || params.get("paymentId") || "",
            collectionId: params.get("collection_id") || "",
            preferenceId: params.get("preference_id") || "",
            collectionStatus: params.get("collection_status") || "",
            externalReference: params.get("external_reference") || ""
        };
    },

    handlePremiumPaymentReturn() {
        const paymentReturn = this.getPremiumPaymentReturn();

        if (!paymentReturn) {
            return;
        }

        window.RotaNotaPremiumPaymentReturn = paymentReturn;

        if (window.history && typeof window.history.replaceState === "function") {
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        this.navigate("premium-study");
    },

    registerModules() {

        if (typeof Clock !== "undefined")
            this.modules.clock = Clock;

        if (typeof Stopwatch !== "undefined")
            this.modules.stopwatch = Stopwatch;

        if (typeof Timer !== "undefined")
            this.modules.timer = Timer;

        if (typeof Pomodoro !== "undefined")
            this.modules.pomodoro = Pomodoro;

    },

       getActiveModule() {
        return this.modules[this.state.mode] || null;
    },

    /* ================= DOM ================= */

    cacheDOM() {

        this.hero = document.getElementById("hero") || null;
        this.controls = document.getElementById("controls") || null;

        this.moduleElements =
            document.querySelectorAll(".module") || [];

        this.footerButtons =
            document.querySelectorAll("[data-module]") || [];

        this.printBtn =
            document.getElementById("printQtsBtn") || null;

        this.shortcutHint =
            document.getElementById("shortcutHint") || null;

        this.topbar =
            document.querySelector(".topbar") || null;

        this.topbarCollapseBtn =
            document.getElementById("topbarCollapseBtn") || null;

    },

    bindUI() {

        const focusBtn =
            document.getElementById("focusModeBtn");

        if (focusBtn) {
            focusBtn.addEventListener("click", () => {
                this.toggleFocusMode();
            });
        }

        const homeImmersionBtn =
            document.getElementById("homeImmersionBtn");

        if (homeImmersionBtn) {
            homeImmersionBtn.addEventListener("click", () => {
                this.enterImmersionMode();
            });
        }

        document
            .querySelectorAll("[data-home-gated]")
            .forEach((button) => {
                button.addEventListener("click", () => {
                    const intent = {
                        kind: button.dataset.homeGated ||
                            "stats",
                        source: button.dataset.homeGated ||
                            "stats"
                    };
                    const gate =
                        this.requireGoogleLogin(
                            intent
                        );

                    if (
                        gate &&
                        gate.allowed === true
                    ) {
                        this.handleGoogleLoginSuccess(
                            { intent }
                        );
                    }
                });
            });

        document
            .querySelectorAll("[data-home-action]")
            .forEach((button) => {
                button.addEventListener("click", () => {
                    this.handleHomeAction(
                        button.dataset.homeAction
                    );
                });
            });

        this.footerButtons.forEach(btn => {

            btn.addEventListener("click", () => {

                if (btn.dataset.premiumHomeAction) {
                    window.RotaNotaPremiumHomeAction =
                        btn.dataset.premiumHomeAction;
                }

                const module = btn.dataset.module;
                this.navigate(module);
            });
        });

        const handleHomeClick = () => {
            if (
                this.state.mode ===
                    "questions" &&
                window.QuestionsPage &&
                typeof QuestionsPage
                    .prepareHomeExit ===
                    "function"
            ) {
                QuestionsPage.prepareHomeExit();
            }
            this.goHome();
        };

        [
            document.getElementById("homeBtn"),
            document.getElementById("brandHomeBtn")
        ].forEach((homeBtn) => {
            if (!homeBtn) {
                return;
            }

            homeBtn.addEventListener("click", handleHomeClick);
        });

        if (this.topbarCollapseBtn) {
            this.topbarCollapseBtn.addEventListener("click", () => {
                this.toggleTopbarCollapsed();
            });
        }

        window.addEventListener("focus", () => {
            this.refreshHomeStatsWidget();
        });

        document
            .querySelectorAll(
                "[data-home-login-close]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.closeHomeStatsLoginGate();
                    }
                );
            });

        document.addEventListener(
            "keydown",
            (event) => {
                if (event.key === "Escape") {
                    this.closeHomeStatsLoginGate();
                }
            }
        );

        window.addEventListener(
            "rotanota:google-login-success",
            (event) => {
                this.handleGoogleLoginSuccess(
                    event.detail || {}
                );
            }
        );

        window.addEventListener(
            "rotanota:google-login-complete",
            (event) => {
                this.handleGoogleLoginSuccess(
                    event.detail || {}
                );
            }
        );

        window.addEventListener(
            "rotanota:google-login-error",
            (event) => {
                this.setGoogleGateStatus(
                    event.detail &&
                    event.detail.message
                        ? event.detail.message
                        : "Nao foi possivel concluir o login Google agora.",
                    {
                        level: event.detail && event.detail.level
                            ? event.detail.level
                            : "error"
                    }
                );
            }
        );

        window.addEventListener(
            "rotanota:auth-changed",
            () => {
                this.refreshHomeStatsWidget();

                if (
                    window.PremiumStudyAccount &&
                    typeof window.PremiumStudyAccount.refreshAndApply ===
                        "function"
                ) {
                    window.PremiumStudyAccount.refreshAndApply();
                }
            }
        );

        const playBtn =
            document.getElementById("playBtn");
        const pauseBtn =
            document.getElementById("pauseBtn");
        const resetBtn =
            document.getElementById("resetBtn");

        if (playBtn)
            playBtn.addEventListener("click",
                () => this.control("play"));

        if (pauseBtn)
            pauseBtn.addEventListener("click",
                () => this.control("pause"));

        if (resetBtn)
            resetBtn.addEventListener("click",
                () => this.control("reset"));
    },

    setActiveNav(target = null) {
        this.footerButtons.forEach(btn => {
            const isActive =
                target &&
                btn.dataset.module === target;

            btn.classList.toggle(
                "active-footer",
                Boolean(isActive)
            );
        });
    },

    ensureScriptLoaded(src, markName = "data-app-src") {
        return new Promise((resolve, reject) => {
            const existing =
                document.querySelector(
                    `script[${markName}="${src}"]`
                );

            if (existing) {
                if (existing.dataset.loaded === "true") {
                    resolve();
                    return;
                }

                existing.addEventListener(
                    "load",
                    () => resolve(),
                    { once: true }
                );
                existing.addEventListener(
                    "error",
                    () => reject(
                        new Error(`Falha ao carregar ${src}`)
                    ),
                    { once: true }
                );
                return;
            }

            const script =
                document.createElement("script");

            script.src = src;
            script.defer = true;
            script.setAttribute(markName, src);
            script.addEventListener(
                "load",
                () => {
                    script.dataset.loaded = "true";
                    resolve();
                },
                { once: true }
            );
            script.addEventListener(
                "error",
                () => reject(
                    new Error(`Falha ao carregar ${src}`)
                ),
                { once: true }
            );

            document.body.appendChild(script);
        });
    },

    normalizeHistoryTarget(target = "") {
        const safeTarget = String(
            target || ""
        ).trim();

        if (!safeTarget || safeTarget === "clock") {
            return "home";
        }

        if (safeTarget === "alarm") {
            return "calendar";
        }

        return safeTarget;
    },

    getHistoryTargetFromLocation() {
        const hashTarget = String(
            window.location.hash || ""
        )
            .replace(/^#/, "")
            .trim();

        return this.normalizeHistoryTarget(
            hashTarget || "home"
        );
    },

    getHistoryUrl(target = "") {
        const safeTarget =
            this.normalizeHistoryTarget(target);
        const hash =
            safeTarget === "home"
                ? ""
                : `#${safeTarget}`;

        return `${window.location.pathname}${hash}`;
    },

    syncBrowserHistory(
        target = "",
        options = {}
    ) {
        if (
            !this.historyReady ||
            !window.history
        ) {
            return;
        }

        const safeTarget =
            this.normalizeHistoryTarget(target);
        const replace = Boolean(
            options.replace
        );
        const force = Boolean(options.force);

        if (
            !force &&
            safeTarget ===
                this.lastHistoryTarget
        ) {
            return;
        }

        const nextState = {
            rotanota: true,
            target: safeTarget
        };
        const nextUrl =
            this.getHistoryUrl(safeTarget);

        if (
            replace &&
            typeof window.history
                .replaceState === "function"
        ) {
            window.history.replaceState(
                nextState,
                document.title,
                nextUrl
            );
        } else if (
            typeof window.history
                .pushState === "function"
        ) {
            window.history.pushState(
                nextState,
                document.title,
                nextUrl
            );
        }

        this.lastHistoryTarget =
            safeTarget;
    },

    initBrowserHistory() {
        const initialTarget =
            this.getHistoryTargetFromLocation();

        window.addEventListener(
            "popstate",
            (event) => {
                const popTarget =
                    this.normalizeHistoryTarget(
                        event.state?.target ||
                            this.getHistoryTargetFromLocation()
                    );

                this.lastHistoryTarget =
                    popTarget;

                if (popTarget === "home") {
                    this.goHome({
                        skipHistory: true
                    });
                    return;
                }

                this.navigate(popTarget, {
                    skipHistory: true
                });
            }
        );

        this.historyReady = true;
        this.lastHistoryTarget =
            initialTarget;
        this.syncBrowserHistory(
            initialTarget,
            {
                replace: true,
                force: true
            }
        );

        return initialTarget;
    },

    activateExternalModule(target) {
        this.stopAll();
        this.clearVisualResidues(target);
        this.hideHero();
        this.hideModules();

        const moduleEl =
            document.getElementById(`${target}Module`);

        if (moduleEl) {
            moduleEl.classList.add("active");
        }

        this.state.mode = target;
        document.body.setAttribute("data-mode", target);
        if (target !== "pomodoro") {
            document.body.classList.remove(
                "pomodoro-table-sync-on"
            );
        }
        this.setActiveNav(target);
    },

    loadPremiumStudyModule() {
        if (this.premiumStudyLoadPromise) {
            return this.premiumStudyLoadPromise;
        }

        const premiumStudyVersion = "20260427-premium-aprender-10";

        this.premiumStudyLoadPromise =
            this.ensureScriptLoaded(
                `premium-study/bootstrap/index.js?v=${premiumStudyVersion}`,
                "data-premium-bootstrap"
            );

        return this.premiumStudyLoadPromise;
    },

    schedulePremiumStudyPreload() {
        const preload = () => {
            this.loadPremiumStudyModule()
                .then(() => {
                    if (
                        window.PremiumStudyBootstrap &&
                        typeof window.PremiumStudyBootstrap.preload === "function"
                    ) {
                        return window.PremiumStudyBootstrap.preload();
                    }
                    return null;
                })
                .catch((error) => {
                    console.warn("Preload do PDF Focado falhou", error);
                });
        };

        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(preload, { timeout: 3500 });
            return;
        }

        window.setTimeout(preload, 1200);
    },

    showPremiumStudyLoading() {
        const moduleEl = document.getElementById("premium-studyModule");

        if (!moduleEl || moduleEl.dataset.ready === "true") {
            return;
        }

        moduleEl.innerHTML = `
<section style="min-height:72vh;display:grid;place-items:center;padding:32px;color:#eaf4ff;background:radial-gradient(circle at top left, rgba(121,213,255,.2), transparent 34%), #0f1724;">
  <article style="width:min(520px,92vw);border:1px solid rgba(121,213,255,.22);border-radius:28px;padding:28px;background:rgba(18,29,45,.86);box-shadow:0 28px 80px rgba(0,0,0,.32);">
    <span style="display:inline-block;margin-bottom:14px;color:#79d5ff;font-size:12px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;">PDF Focado</span>
    <h2 style="margin:0 0 10px;font-size:clamp(24px,6vw,38px);line-height:1.03;">Abrindo seu workspace premium.</h2>
    <p style="margin:0;color:rgba(234,244,255,.72);line-height:1.55;">Carregando a mesa de estudo agora. Se a rede estiver lenta, a tela ainda aparece sem parecer travada.</p>
  </article>
</section>`;
    },

    /* ================= NAVIGATION ================= */

    navigate(target, options = {}) {

   const skipHistory = Boolean(options.skipHistory)
   const replaceHistory = Boolean(options.replaceHistory)
   const previousMode = this.state.mode

   if (target === "alarm") {
target = "calendar"
}

   if (
this.state.mode === "premium-study" &&
target !== "premium-study" &&
window.PremiumStudyApp &&
typeof PremiumStudyApp.clearAnalysisTimers === "function"
) {
PremiumStudyApp.clearAnalysisTimers()
}

   if (
typeof UtilityWindows !== "undefined" &&
UtilityWindows.isFloatingTool(target)
) {

if (this.state.mode === target) {
this.goHome()
}

UtilityWindows.open(target)
return
}

if (target === "questions") {

const applyRequestedLauncherView = () => {
const requestedView = String(
window.RotaNotaQuestionsLauncherTarget || ""
).trim()

if (
!requestedView ||
!window.QuestionsPage ||
typeof QuestionsPage.openLauncher !== "function"
) {
return false
}

window.RotaNotaQuestionsLauncherTarget = ""
QuestionsPage.openLauncher(requestedView)
return true
}

const applyPendingQuestionsNotice = () => {
const notice = String(
window.RotaNotaQuestionsRuntimeNotice || ""
).trim()

if (
!notice ||
!window.QuestionsPage
) {
return false
}

QuestionsPage.runtimeNotice = notice
window.RotaNotaQuestionsRuntimeNotice = ""

if (typeof QuestionsPage.render === "function") {
QuestionsPage.render()
}

return true
}

this.stopAll()
this.clearVisualResidues(target)
this.hideHero()
this.hideModules()

const moduleEl = document.getElementById("questionsModule")
if (moduleEl) moduleEl.classList.add("active")

const requestedQuestionsView = String(
window.RotaNotaQuestionsLauncherTarget || ""
).trim()

if (
moduleEl &&
requestedQuestionsView === "progress" &&
!window.questionsLoaded
) {
moduleEl.innerHTML = `
<div class="questions-route-loading" role="status" aria-live="polite">
<span class="questions-route-loading-kicker">Estatisticas</span>
<h2>Abrindo seu placar pessoal</h2>
<p>Estamos carregando o painel completo sem trocar para outra tela.</p>
<div class="questions-route-loading-grid" aria-hidden="true">
<span></span><span></span><span></span><span></span>
</div>
</div>`
}

this.state.mode = "questions"
document.body.setAttribute("data-mode", "questions")
this.setActiveNav("questions")
this.syncSideModulesAccessibility()

if (window.AmbientEngine && AmbientEngine.onModeChange) {
AmbientEngine.onModeChange(previousMode, "questions")
}

if (!skipHistory) {
this.syncBrowserHistory("questions", {
replace: replaceHistory
})
}

if (!window.questionsLoaded) {

fetch("questions/questions.html")
.then(r => r.text())
.then(html => {

document.getElementById("questionsModule").innerHTML = html

// CSS
const link = document.createElement("link")
link.rel = "stylesheet"
link.href = "questions/questions.css"
document.head.appendChild(link)

// CONTEXT
const contextScript = document.createElement("script")
contextScript.src = "questions/questions.context.js"

contextScript.onload = () => {

// STORE
const storeScript = document.createElement("script")
storeScript.src = "questions/questions.store.js"

storeScript.onload = () => {

// STATE
const stateScript = document.createElement("script")
stateScript.src = "questions/questions.state.js"

stateScript.onload = () => {

// SERVICE
const serviceScript = document.createElement("script")
serviceScript.src = "questions/questions.service.js"

serviceScript.onload = () => {

// UI
const uiScript = document.createElement("script")
uiScript.src = "questions/questions.ui.js"

uiScript.onload = () => {

// MAIN
const mainScript = document.createElement("script")
mainScript.src = "questions/questions.js"

mainScript.onload = () => {

window.questionsLoaded = true

if (window.QuestionsPage) {
Promise.resolve(QuestionsPage.init())
.then(() => {
applyRequestedLauncherView()
applyPendingQuestionsNotice()
})
}

}

document.body.appendChild(mainScript)

}

document.body.appendChild(uiScript)

}

document.body.appendChild(serviceScript)

}

document.body.appendChild(stateScript)

}

document.body.appendChild(storeScript)

}

document.body.appendChild(contextScript)

})

} else {

if (window.QuestionsPage) {
const openedRequestedView = applyRequestedLauncherView()

if (!openedRequestedView) {
QuestionsPage.render()
}

applyPendingQuestionsNotice()
}

}

   return
}

   if (target === "premium-study") {

if (!window.RotaNotaPremiumHomeAction) {
window.RotaNotaPremiumHomeAction =
    "study-entry"
}

this.activateExternalModule("premium-study")
this.showPremiumStudyLoading()
if (!skipHistory) {
this.syncBrowserHistory("premium-study", {
replace: replaceHistory
})
}

this.loadPremiumStudyModule()
.then(() => {

if (window.PremiumStudyBootstrap) {
window.PremiumStudyBootstrap.init({
root: document.getElementById("premium-studyModule")
})

if (
window.RotaNotaPremiumHomeAction &&
window.PremiumStudyApp &&
typeof PremiumStudyApp.runHomeAction === "function"
) {
PremiumStudyApp.runHomeAction(
window.RotaNotaPremiumHomeAction
)
}
}

})
.catch((error) => {
console.error(error)
})

return
}

   if (target === "routine") {

this.activateExternalModule("routine")
if (!skipHistory) {
this.syncBrowserHistory("routine", {
replace: replaceHistory
})
}

const routineRenderer =
window.RoutineTable ||
(typeof RoutineTable !== "undefined" ? RoutineTable : null)

if (
routineRenderer &&
typeof routineRenderer.render === "function"
) {
routineRenderer.render()
}

return
}

        if (this.modules[target]) {
            this.changeMode(target, {
                skipHistory,
                replaceHistory
            });
            return;
        }

        this.stopAll();
        this.clearVisualResidues(target);

        if (target === "qts" && this.printBtn) {
            this.printBtn.style.visibility = "visible";
            this.printBtn.style.pointerEvents = "auto";
        }

        this.hideHero();
        this.hideModules();

        const moduleEl =
            document.getElementById(target + "Module");

        if (moduleEl)
            moduleEl.classList.add("active");

        this.state.mode = target;
        document.body.setAttribute("data-mode", target);
        if (target !== "pomodoro") {
            document.body.classList.remove(
                "pomodoro-table-sync-on"
            );
        }
        this.setActiveNav(target);
        this.syncSideModulesAccessibility();
        if (!skipHistory) {
            this.syncBrowserHistory(target, {
                replace: replaceHistory
            });
        }
    },

    changeMode(mode, options = {}) {

    const previousMode = this.state.mode;
    const skipHistory = Boolean(options.skipHistory);
    const replaceHistory = Boolean(options.replaceHistory);

    this.stopAll();
    this.clearVisualResidues(mode);
    this.setMode(mode);
    if (!skipHistory) {
        this.syncBrowserHistory(mode, {
            replace: replaceHistory
        });
    }

    if (window.AmbientEngine && AmbientEngine.onModeChange) {
        AmbientEngine.onModeChange(previousMode, mode);
    }

},

    setMode(mode) {

        this.state.mode = mode;
        document.body.setAttribute("data-mode", mode);
        document.body.classList.toggle(
            "pomodoro-table-sync-on",
            Boolean(
                mode === "pomodoro" &&
                typeof Pomodoro !== "undefined" &&
                Pomodoro.syncEnabled
            )
        );
        this.setActiveNav(mode === "clock" ? null : mode);
        this.syncSideModulesAccessibility();

        this.hideModules();
        this.showHero();

        const module = this.modules[mode];

        if (mode === "clock") {
            this.hideControls();
            if (module && module.start)
                module.start();
            return;
        }

        this.showControls();

        const moduleEl =
            document.getElementById(
                `${mode}Module`
            );

        if (moduleEl) {
            moduleEl.classList.add("active");
        }

        if (module && module.render)
            module.render();
    },

    goHome(options = {}) {
        if (
            window.PremiumStudyApp &&
            typeof PremiumStudyApp.clearAnalysisTimers ===
                "function"
        ) {
            PremiumStudyApp.clearAnalysisTimers();
        }
        document.body.removeAttribute("data-premium-step");
        this.changeMode("clock", options);
        this.refreshHomeStatsWidget();
    },

    openHomeStatsSurface(options = {}) {
        const shell =
            document.querySelector(
                ".home-stats-shell"
            );
        const shouldScroll =
            options.scroll !== false;

        if (shell) {
            shell.hidden = false;
        }

        this.refreshHomeStatsWidget();

        if (shouldScroll && shell) {
            requestAnimationFrame(() => {
                shell.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        }
    },

    openHomeStatsLoginGate(intent = "stats") {
        const gate =
            document.getElementById(
                "homeStatsLoginGate"
            );

        if (!gate) {
            return;
        }

        this.pendingGoogleGateIntent =
            this.getGoogleGateIntent(
                intent
            );
        this.updateGoogleGateContent(
            this.pendingGoogleGateIntent
        );

        gate.classList.remove("hidden");
        gate.setAttribute(
            "aria-hidden",
            "false"
        );

        if (
            window.RotaNotaAuth &&
            typeof window.RotaNotaAuth.prepareGoogleGateButton ===
                "function"
        ) {
            window.RotaNotaAuth.prepareGoogleGateButton({
                source: "home_stats",
                intent: this.pendingGoogleGateIntent
            });
        }
    },

    closeHomeStatsLoginGate(
        options = {}
    ) {
        const gate =
            document.getElementById(
                "homeStatsLoginGate"
            );

        if (!gate) {
            return;
        }

        gate.classList.add("hidden");
        gate.setAttribute(
            "aria-hidden",
            "true"
        );
        this.setGoogleGateStatus("");

        if (
            options.preserveIntent !==
            true
        ) {
            this.pendingGoogleGateIntent =
                null;
        }
    },

    requireGoogleLogin(intent = "stats") {
        if (this.isGoogleAuthenticated()) {
            return { allowed: true };
        }

        this.openHomeStatsLoginGate(intent);
        return { allowed: false };
    },

    requestGoogleLogin(source = "home") {
        const pendingIntent =
            this.pendingGoogleGateIntent ||
            this.getGoogleGateIntent(source);
        const googleUnavailable =
            window.RotaNotaAuth &&
            typeof window.RotaNotaAuth
                .isGoogleLoginAvailable ===
                "function"
                ? !window.RotaNotaAuth.isGoogleLoginAvailable()
                : false;

        if (
            pendingIntent &&
            pendingIntent.kind ===
                "premium_checkout" &&
            googleUnavailable
        ) {
            this.setGoogleGateStatus(
                "Google indisponivel neste ambiente. Seguindo direto para o checkout.",
                { level: "soft" }
            );
            this.handleGoogleLoginSuccess(
                { intent: pendingIntent }
            );
            return;
        }

        if (
            window.RotaNotaAuth &&
            typeof window.RotaNotaAuth
                .requestGoogleLogin ===
                "function"
        ) {
            window.RotaNotaAuth.requestGoogleLogin(
                {
                    source,
                    intent: pendingIntent
                }
            );
        } else {
            window.dispatchEvent(
                new CustomEvent(
                    "rotanota:google-login-requested",
                    {
                        detail: {
                            source,
                            intent: pendingIntent
                        }
                    }
                )
            );
            this.setGoogleGateStatus(
                "O login Google ainda nao esta conectado neste build."
            );
            return;
        }
    },

    async handleGoogleLoginSuccess(
        detail = {}
    ) {
        const intent =
            this.pendingGoogleGateIntent ||
            this.getGoogleGateIntent(
                detail.intent ||
                    detail.source ||
                    "stats"
            );

        this.pendingGoogleGateIntent =
            null;
        this.closeHomeStatsLoginGate(
            { preserveIntent: true }
        );

        if (intent.kind === "premium_checkout") {
            if (
                this.state.mode !==
                "premium-study"
            ) {
                this.navigate("premium-study");
            }

            const planId =
                intent.planId ||
                "premium_monthly";
            const premiumState =
                window.PremiumStudyStore &&
                typeof window.PremiumStudyStore.getState ===
                    "function"
                    ? window.PremiumStudyStore.getState()
                    : null;

            if (
                window.PremiumStudyBilling &&
                typeof window.PremiumStudyBilling.startCheckout ===
                    "function"
            ) {
                const checkout =
                    await window.PremiumStudyBilling.startCheckout(
                        planId,
                        {
                            feature:
                                premiumState &&
                                premiumState.premiumOffer
                                    ? premiumState.premiumOffer.feature
                                    : "",
                            sourceStep:
                                premiumState &&
                                premiumState.returnStep
                                    ? premiumState.returnStep
                                    : "premium-checkout"
                        }
                    );

                if (
                    !checkout?.ok &&
                    window.PremiumStudyStore &&
                    typeof window.PremiumStudyStore.setSessionNote ===
                        "function"
                ) {
                    window.PremiumStudyStore.setSessionNote(
                        {
                            step:
                                premiumState &&
                                premiumState.step
                                    ? premiumState.step
                                    : "premium-checkout",
                            tone: "premium",
                            title: "Nao foi possivel abrir o checkout",
                            message:
                                checkout?.message ||
                                "O checkout nao respondeu corretamente agora. Tente de novo em instantes."
                        }
                    );
                }
            }

            return;
        }

        if (intent.kind === "account") {
            return;
        }

        this.goHome({
            replaceHistory: true
        });
        this.openHomeStatsSurface();
    },

    updateHomeBandPanels(panels = []) {
        const label =
            document.getElementById(
                "homeBandPanelLabel"
            );
        const value =
            document.getElementById(
                "homeBandPanelValue"
            );
        const body =
            document.getElementById(
                "homeBandPanelBody"
            );

        if (!label || !value || !body) {
            return;
        }

        const cleanPanels = Array.isArray(panels)
            ? panels.filter(Boolean)
            : [];

        if (this.homeBandPanelTimer) {
            clearInterval(
                this.homeBandPanelTimer
            );
            this.homeBandPanelTimer = null;
        }

        const applyPanel = (panel) => {
            label.textContent = String(
                panel?.label ||
                    "Consistencia"
            );
            value.textContent = String(
                panel?.value || "0 dias"
            );
            body.innerHTML = String(
                panel?.html || ""
            );
        };

        if (!cleanPanels.length) {
            applyPanel({
                label: "Consistencia",
                value: "0 dias",
                html: ""
            });
            return;
        }

        this.homeBandPanelIndex = 0;
        applyPanel(cleanPanels[0]);

        if (cleanPanels.length === 1) {
            return;
        }

        this.homeBandPanelTimer =
            window.setInterval(() => {
                this.homeBandPanelIndex =
                    (this.homeBandPanelIndex + 1) %
                    cleanPanels.length;
                applyPanel(
                    cleanPanels[
                        this.homeBandPanelIndex
                    ]
                );
            }, 11200);
    },

    parseStoredJson(key, fallbackValue) {
        if (typeof localStorage === "undefined") {
            return fallbackValue;
        }

        try {
            const raw = localStorage.getItem(key);
            if (!raw) {
                return fallbackValue;
            }

            return JSON.parse(raw);
        } catch (_error) {
            return fallbackValue;
        }
    },

    formatShortcutCount(value, singular, plural = `${singular}s`) {
        const amount = Math.max(Number(value) || 0, 0);
        return `${amount} ${amount === 1 ? singular : plural}`;
    },

    formatShortcutPercent(value) {
        const amount = Math.round(Number(value) || 0);
        return `${amount}%`;
    },

    clamp(value, min, max) {
        return Math.min(
            Math.max(
                Number(value) || 0,
                min
            ),
            max
        );
    },

    formatQuestionAverageTime(value) {
        const totalMs = Math.max(
            Number(value) || 0,
            0
        );

        if (!totalMs) {
            return "0s";
        }

        const totalSeconds = Math.round(
            totalMs / 1000
        );

        if (totalSeconds < 60) {
            return `${totalSeconds}s`;
        }

        const minutes = Math.floor(
            totalSeconds / 60
        );
        const seconds = totalSeconds % 60;

        if (!seconds) {
            return `${minutes}min`;
        }

        return `${minutes}min ${String(
            seconds
        ).padStart(2, "0")}s`;
    },

    getQuestionsLevelProfile(snapshot = {}) {
        const attempts = Math.max(
            Number(snapshot.attempts) || 0,
            0
        );
        const sessions = Math.max(
            Number(snapshot.totalSessions) || 0,
            0
        );

        if (
            attempts >= 220 ||
            sessions >= 24
        ) {
            return {
                key: "consolidado",
                label: "consolidado",
                benchmarkAccuracy: 0.78,
                benchmarkTimeMs: 70000,
                benchmarkVolume: 220
            };
        }

        if (
            attempts >= 90 ||
            sessions >= 10
        ) {
            return {
                key: "em_progresso",
                label: "em progresso",
                benchmarkAccuracy: 0.68,
                benchmarkTimeMs: 85000,
                benchmarkVolume: 120
            };
        }

        return {
            key: "inicial",
            label: "inicial",
            benchmarkAccuracy: 0.58,
            benchmarkTimeMs: 105000,
            benchmarkVolume: 45
        };
    },

    estimateQuestionsStanding(snapshot = {}) {
        const attempts = Math.max(
            Number(snapshot.attempts) || 0,
            0
        );

        if (!attempts) {
            return {
                levelLabel: "inicial",
                percentile: null,
                topPercent: null,
                note: "A posicao aparece quando voce cria uma base minima de questoes."
            };
        }

        const accuracy = this.clamp(
            (Number(snapshot.accuracy) || 0) /
                100,
            0,
            1
        );
        const avgTimeMs = Math.max(
            Number(snapshot.avgTimeMs) || 0,
            0
        );
        const level =
            this.getQuestionsLevelProfile(
                snapshot
            );
        const accuracyScore =
            this.clamp(
                0.5 +
                    (accuracy -
                        level.benchmarkAccuracy) /
                        0.28,
                0,
                1
            );
        const timeScore =
            avgTimeMs > 0
                ? this.clamp(
                    (
                        level.benchmarkTimeMs *
                            1.35 -
                        avgTimeMs
                    ) /
                        (level.benchmarkTimeMs *
                            0.9),
                    0,
                    1
                )
                : 0.5;
        const volumeScore =
            this.clamp(
                attempts /
                    level.benchmarkVolume,
                0,
                1
            );
        const score =
            accuracyScore * 0.6 +
            timeScore * 0.22 +
            volumeScore * 0.18;
        const percentile = Math.round(
            18 + score * 76
        );
        const topPercent = Math.max(
            6,
            100 - percentile
        );

        return {
            levelLabel: level.label,
            percentile,
            topPercent,
            note: `Estimativa local entre alunos do nivel ${level.label}, combinando acuracia, ritmo e volume recente.`
        };
    },

    toCalendarDayKey(value) {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const year = date.getFullYear();
        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");
        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    },

    buildConsistencyPreview(
        recentSessions = []
    ) {
        const totalDays = 28;
        const activeDays = new Set(
            recentSessions
                .map((session) =>
                    this.toCalendarDayKey(
                        session?.createdAt
                    )
                )
                .filter(Boolean)
        );
        const cells = [];
        const today = new Date();
        let streak = 0;

        for (
            let offset = totalDays - 1;
            offset >= 0;
            offset -= 1
        ) {
            const day = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - offset
            );
            const dayKey =
                this.toCalendarDayKey(day);
            cells.push({
                key: dayKey,
                active: activeDays.has(dayKey)
            });
        }

        for (
            let offset = 0;
            offset < totalDays;
            offset += 1
        ) {
            const day = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - offset
            );
            const dayKey =
                this.toCalendarDayKey(day);

            if (!activeDays.has(dayKey)) {
                break;
            }

            streak += 1;
        }

        return {
            cells,
            streak
        };
    },

    getQuestionsHomeSnapshot() {
        try {
            if (
                window.QuestionsStore &&
                typeof window.QuestionsStore.load === "function"
            ) {
                window.QuestionsStore.load();
                const dashboard =
                    typeof window.QuestionsStore.getDashboard === "function"
                        ? window.QuestionsStore.getDashboard()
                        : null;
                const pausedRuns =
                    typeof window.QuestionsStore.getRuns === "function"
                        ? window.QuestionsStore.getRuns({
                              status: "in_progress"
                          })
                        : [];
                const savedBlocks =
                    typeof window.QuestionsStore.getSavedBlocks === "function"
                        ? window.QuestionsStore.getSavedBlocks()
                        : [];
                const weakTopic =
                    typeof window.QuestionsStore.getWeakTopics === "function"
                        ? window.QuestionsStore.getWeakTopics({
                              minAttempts: 1,
                              minErrors: 1
                          })
                        : null;
                const recentSessions =
                    typeof window.QuestionsStore.getRecentSessions === "function"
                        ? window.QuestionsStore.getRecentSessions()
                        : [];

                return {
                    pausedRunsCount: pausedRuns.length,
                    pausedRunTitle:
                        pausedRuns[0]?.title || "",
                    savedBlocksCount:
                        savedBlocks.length,
                    weakTopicLabel:
                        weakTopic?.[0]?.topicLabel ||
                        "",
                    weakTopics: Array.isArray(
                        weakTopic
                    )
                        ? weakTopic.slice(0, 3)
                        : [],
                    attempts:
                        Number(dashboard?.attempts) || 0,
                    hits:
                        Number(dashboard?.hits) || 0,
                    errors:
                        Number(dashboard?.errors) || 0,
                    avgTimeMs:
                        Number(
                            dashboard?.avgTimeMs
                        ) || 0,
                    totalSessions:
                        Number(
                            dashboard?.totalSessions
                        ) || 0,
                    accuracy:
                        Number.isFinite(
                            dashboard?.accuracy
                        )
                            ? Math.round(
                                  dashboard.accuracy * 100
                              )
                            : null,
                    mostTrainedTopic:
                        dashboard?.mostTrainedTopic
                            ?.topicLabel || "",
                    recentSessions: Array.isArray(
                        recentSessions
                    )
                        ? recentSessions
                              .slice(0, 8)
                              .map((session) => ({
                                  createdAt:
                                      session?.createdAt ||
                                      0,
                                  accuracy:
                                      Number(
                                          session?.accuracy
                                      ) || 0,
                                  mode:
                                      session?.mode ||
                                      "Treino"
                              }))
                        : []
                };
            }
        } catch (error) {
            console.warn(
                "Leitura rapida de Questions falhou",
                error
            );
        }

        const profile =
            this.parseStoredJson(
                "questions_profile_v4",
                {}
            ) || {};
        const runs = Array.isArray(
            this.parseStoredJson(
                "questions_runs_v2",
                []
            )
        )
            ? this.parseStoredJson(
                  "questions_runs_v2",
                  []
              )
            : [];
        const topics = Object.values(
            profile.topics || {}
        );
        const sessions = Array.isArray(
            profile.sessions
        )
            ? profile.sessions
            : [];
        const savedBlocks = Array.isArray(
            profile.savedBlocks
        )
            ? profile.savedBlocks
            : [];
        const pausedRuns = runs
            .filter(
                (run) =>
                    run &&
                    run.status ===
                        "in_progress"
            )
            .sort(
                (left, right) =>
                    (right.updatedAt || 0) -
                    (left.updatedAt || 0)
            );
        const totals = topics.reduce(
            (acc, entry) => {
                acc.attempts +=
                    Number(entry?.attempts) || 0;
                acc.hits +=
                    Number(entry?.hits) || 0;
                return acc;
            },
            { attempts: 0, hits: 0 }
        );
        const weakTopic = [...topics]
            .filter((entry) => {
                const attempts =
                    Number(entry?.attempts) || 0;
                const errors =
                    Number(entry?.errors) || 0;
                return attempts > 0 && errors > 0;
            })
            .map((entry) => ({
                ...entry,
                accuracy:
                    Number(entry?.attempts) > 0
                        ? Number(entry?.hits || 0) /
                          Number(entry.attempts)
                        : 0
            }))
            .sort(
                (left, right) =>
                    (Number(right.errors) || 0) -
                        (Number(left.errors) ||
                            0) ||
                    left.accuracy -
                        right.accuracy ||
                    (Number(right.attempts) ||
                        0) -
                        (Number(left.attempts) ||
                            0)
            )[0];
        const weakTopics = [...topics]
            .filter((entry) => {
                const attempts =
                    Number(entry?.attempts) || 0;
                const errors =
                    Number(entry?.errors) || 0;
                return attempts > 0 && errors > 0;
            })
            .map((entry) => ({
                ...entry,
                accuracy:
                    Number(entry?.attempts) > 0
                        ? Number(entry?.hits || 0) /
                          Number(entry.attempts)
                        : 0
            }))
            .sort(
                (left, right) =>
                    (Number(right.errors) || 0) -
                        (Number(left.errors) ||
                            0) ||
                    left.accuracy -
                        right.accuracy
            )
            .slice(0, 3);
        const mostTrainedTopic = [...topics].sort(
            (left, right) =>
                (Number(right?.attempts) || 0) -
                (Number(left?.attempts) || 0)
        )[0];

        return {
            pausedRunsCount: pausedRuns.length,
            pausedRunTitle:
                pausedRuns[0]?.title || "",
            savedBlocksCount: savedBlocks.length,
            weakTopicLabel:
                weakTopic?.topicLabel || "",
            weakTopics,
            attempts: totals.attempts,
            hits: totals.hits,
            errors: Math.max(
                totals.attempts - totals.hits,
                0
            ),
            avgTimeMs:
                totals.attempts > 0
                    ? topics.reduce(
                        (acc, entry) =>
                            acc +
                            (
                                Number(
                                    entry?.avgTime
                                ) || 0
                            ) *
                                (
                                    Number(
                                        entry?.attempts
                                    ) || 0
                                ),
                        0
                    ) / totals.attempts
                    : 0,
            totalSessions: sessions.length,
            accuracy:
                totals.attempts > 0
                    ? Math.round(
                          (totals.hits /
                              totals.attempts) *
                              100
                      )
                    : null,
            mostTrainedTopic:
                mostTrainedTopic?.topicLabel || "",
            recentSessions: sessions
                .slice()
                .sort(
                    (left, right) =>
                        (right.createdAt || 0) -
                        (left.createdAt || 0)
                )
                .slice(0, 8)
                .map((session) => ({
                    createdAt:
                        session?.createdAt || 0,
                    accuracy:
                        Number(
                            session?.accuracy
                        ) || 0,
                    mode:
                        session?.mode ||
                        "Treino"
                }))
        };
    },

    renderHomeStatsConsistency(
        cells = []
    ) {
        return cells
            .map(
                (cell) => `
                <span class="home-stats-consistency-cell ${cell.active ? "is-active" : ""}"></span>
            `
            )
            .join("");
    },

    renderHomeStatsTrend(
        recentSessions = []
    ) {
        const sessions = Array.isArray(
            recentSessions
        )
            ? recentSessions.slice(0, 5)
            : [];

        if (!sessions.length) {
            return `
                <div class="home-stats-trend-empty">As barras aparecem conforme voce pratica.</div>
            `;
        }

        return `
            <div class="home-stats-trend-bars">
                ${sessions
                    .slice()
                    .reverse()
                    .map((session) => {
                        const accuracy = Math.max(
                            10,
                            Math.min(
                                100,
                                Math.round(
                                    Number(
                                        session?.accuracy
                                    ) || 0
                                )
                            )
                        );
                        return `
                            <span class="home-stats-trend-bar-wrap">
                                <span class="home-stats-trend-bar" style="height:${accuracy}%"></span>
                            </span>
                        `;
                    })
                    .join("")}
            </div>
        `;
    },

    renderHomeStatsWeakTopics(
        weakTopics = [],
        fallbackLabel = ""
    ) {
        const topics = Array.isArray(
            weakTopics
        )
            ? weakTopics.slice(0, 3)
            : [];

        if (!topics.length) {
            return `
                <span class="home-stats-tag is-muted">${fallbackLabel || "Seu mapa de reforco aparece depois das primeiras respostas."}</span>
            `;
        }

        return topics
            .map(
                (topic) => `
                <span class="home-stats-tag">${String(topic?.topicLabel || "Reforco").trim()}</span>
            `
            )
            .join("");
    },

    renderHomeBandConsistencyPanel(
        cells = []
    ) {
        return `
            <div class="rotanota-home-band-consistency">
                ${this.renderHomeStatsConsistency(
                    cells
                )}
            </div>
        `;
    },

    renderHomeBandTrendPanel(
        recentSessions = []
    ) {
        const sessionItems = Array.isArray(
            recentSessions
        )
            ? recentSessions.slice(0, 6)
            : [];
        const sessions = Array.from(
            { length: 6 },
            (_item, index) =>
                sessionItems[
                    sessionItems.length - 6 + index
                ] || {
                    accuracy: 0
                }
        );

        return `
            <div class="rotanota-home-band-trend">
                ${sessions
                    .map((session) => {
                        const rawAccuracy =
                            Math.round(
                                Number(
                                    session?.accuracy
                                ) || 0
                            );
                        const accuracy = Math.max(
                            8,
                            Math.min(
                                100,
                                rawAccuracy
                            )
                        );
                        return `
                            <span class="rotanota-home-band-trend-bar-wrap ${rawAccuracy <= 0 ? "is-zero" : ""}">
                                <span class="rotanota-home-band-trend-bar" style="height:${accuracy}%"></span>
                            </span>
                        `;
                    })
                    .join("")}
            </div>
        `;
    },

    renderHomeBandLoginPanel() {
        return `
            <div class="rotanota-home-band-login">
                <div class="rotanota-home-band-login-badge">
                    <span class="rotanota-home-band-login-g" aria-hidden="true">
                        <span class="rotanota-home-band-login-g-blue"></span>
                        <span class="rotanota-home-band-login-g-red"></span>
                        <span class="rotanota-home-band-login-g-yellow"></span>
                        <span class="rotanota-home-band-login-g-green"></span>
                    </span>
                    <div class="rotanota-home-band-login-copy">
                        <strong>Entre com Google</strong>
                        <span>salve progresso e sincronize em qualquer dispositivo</span>
                    </div>
                </div>
                <div class="rotanota-home-band-login-points">
                    <span>Historico salvo</span>
                    <span>Painel completo</span>
                    <span>Premium na conta</span>
                </div>
            </div>
        `;
    },

    renderHomeBandRhythmPanel(
        snapshot = {}
    ) {
        const sessions =
            Math.max(
                Number(snapshot.totalSessions) || 0,
                0
            );
        const paused =
            Math.max(
                Number(snapshot.pausedRunsCount) || 0,
                0
            );
        const saved =
            Math.max(
                Number(snapshot.savedBlocksCount) || 0,
                0
            );
        const maxValue = Math.max(
            sessions,
            paused,
            saved,
            1
        );
        const rows = [
            {
                label: "Sessoes",
                value: sessions
            },
            {
                label: "Retomadas",
                value: paused
            },
            {
                label: "Guardados",
                value: saved
            }
        ];

        return `
            <div class="rotanota-home-band-rhythm">
                ${rows
                    .map(
                        (row) => `
                        <div class="rotanota-home-band-rhythm-row">
                            <div class="rotanota-home-band-rhythm-meta">
                                <span>${row.label}</span>
                                <strong>${row.value}</strong>
                            </div>
                            <div class="rotanota-home-band-rhythm-track">
                                <span class="rotanota-home-band-rhythm-fill" style="width:${Math.max(8, Math.round((row.value / maxValue) * 100))}%"></span>
                            </div>
                        </div>
                    `
                    )
                    .join("")}
            </div>
        `;
    },

    renderHomeBandComparisonPanel(
        snapshot = {}
    ) {
        const standing =
            this.estimateQuestionsStanding(
                snapshot
            );
        const rows = [
            {
                label: "Acertos",
                value: Math.max(
                    Number(snapshot.hits) || 0,
                    0
                )
            },
            {
                label: "Erros",
                value: Math.max(
                    Number(snapshot.errors) || 0,
                    0
                )
            },
            {
                label: "Tempo/questao",
                value:
                    this.formatQuestionAverageTime(
                        snapshot.avgTimeMs
                    )
            }
        ];

        return `
            <div class="rotanota-home-band-comparison">
                <div class="rotanota-home-band-comparison-grid">
                    ${rows
                        .map(
                            (row) => `
                                <div class="rotanota-home-band-comparison-card">
                                    <span>${row.label}</span>
                                    <strong>${row.value}</strong>
                                </div>
                            `
                        )
                        .join("")}
                </div>
                <div class="rotanota-home-band-comparison-note">
                    ${
                        standing.percentile
                            ? `Top ${standing.topPercent}% estimado`
                            : "Posicao estimada em aquecimento"
                    }
                </div>
            </div>
        `;
    },

    syncLegacyHomeStatsWidget(
        snapshot = {}
    ) {
        const setText = (
            id,
            value
        ) => {
            const node =
                document.getElementById(id);

            if (node) {
                node.textContent =
                    String(value);
            }
        };
        const metricLabelNodes =
            Array.from(
                document.querySelectorAll(
                    ".home-stats-metric > span"
                )
            );
        const consistency =
            this.buildConsistencyPreview(
                snapshot.recentSessions
            );
        const standing =
            this.estimateQuestionsStanding(
                snapshot
            );
        const weakTopicsHtml =
            this.renderHomeStatsWeakTopics(
                snapshot.weakTopics,
                snapshot.weakTopicLabel
            );
        const trendHtml =
            this.renderHomeStatsTrend(
                snapshot.recentSessions
            );
        const consistencyHtml =
            this.renderHomeStatsConsistency(
                consistency.cells
            );
        const weakTopicsNode =
            document.getElementById(
                "homeStatsWeakTopics"
            );
        const trendNode =
            document.getElementById(
                "homeStatsTrend"
            );
        const consistencyNode =
            document.getElementById(
                "homeStatsConsistencyLegacy"
            );

        if (metricLabelNodes[0]) {
            metricLabelNodes[0].textContent =
                "Acuracia";
        }
        if (metricLabelNodes[1]) {
            metricLabelNodes[1].textContent =
                "Acertos";
        }
        if (metricLabelNodes[2]) {
            metricLabelNodes[2].textContent =
                "Erros";
        }
        if (metricLabelNodes[3]) {
            metricLabelNodes[3].textContent =
                "Tempo/questao";
        }
        setText(
            "homeStatsHeadline",
            standing.percentile
                ? `Top ${standing.topPercent}% estimado no nivel ${standing.levelLabel}.`
                : "Seu progresso comeca a ganhar forma."
        );
        setText(
            "homeStatsSubline",
            standing.note
        );
        setText(
            "homeStatsAccuracy",
            Number.isFinite(snapshot.accuracy)
                ? this.formatShortcutPercent(
                    snapshot.accuracy
                )
                : "0%"
        );
        setText(
            "homeStatsAccuracyNote",
            snapshot.attempts
                ? `${Math.max(Number(snapshot.attempts) || 0, 0)} questoes na base`
                : "Sem base ainda"
        );
        setText(
            "homeStatsSessions",
            Math.max(
                Number(snapshot.hits) || 0,
                0
            )
        );
        setText(
            "homeStatsSessionsNote",
            snapshot.totalSessions
                ? `${Math.max(Number(snapshot.totalSessions) || 0, 0)} sessoes registradas`
                : "Nenhuma registrada"
        );
        setText(
            "homeStatsPausedRuns",
            Math.max(
                Number(snapshot.errors) || 0,
                0
            )
        );
        setText(
            "homeStatsPausedRunsNote",
            snapshot.errors
                ? "Erros para revisar"
                : "Sem erros na base"
        );
        setText(
            "homeStatsSavedBlocks",
            this.formatQuestionAverageTime(
                snapshot.avgTimeMs
            )
        );
        setText(
            "homeStatsSavedBlocksNote",
            standing.percentile
                ? `Top ${standing.topPercent}% estimado`
                : "Ritmo aparece depois das primeiras respostas"
        );
        setText(
            "homeStatsStreakLegacy",
            `${consistency.streak} dia${
                consistency.streak === 1
                    ? ""
                    : "s"
            }`
        );

        if (weakTopicsNode) {
            weakTopicsNode.innerHTML =
                weakTopicsHtml;
        }

        if (trendNode) {
            trendNode.innerHTML = trendHtml;
        }

        if (consistencyNode) {
            consistencyNode.innerHTML =
                consistencyHtml;
        }
    },

    async refreshHomeStatsWidget() {
        const refreshToken =
            ++this.homeStatsRefreshToken;
        const snapshot =
            await Promise.resolve(
                this.getQuestionsHomeSnapshot()
            ).catch((error) => {
                console.warn(
                    "Atualizacao do widget da home falhou",
                    error
                );
                return null;
            });

        if (
            refreshToken !==
                this.homeStatsRefreshToken ||
            !snapshot
        ) {
            return;
        }

        const consistency =
            this.buildConsistencyPreview(
                snapshot.recentSessions
            );
        const accuracyText =
            Number.isFinite(snapshot.accuracy)
                ? this.formatShortcutPercent(
                      snapshot.accuracy
                  )
                : "0%";
        const standing =
            this.estimateQuestionsStanding(
                snapshot
            );

        this.updateHomeBandPanels([
            {
                label: "Consistencia",
                value: `${consistency.streak} dia${consistency.streak === 1 ? "" : "s"}`,
                html: this.renderHomeBandConsistencyPanel(
                    consistency.cells
                )
            },
            {
                label: "Evolucao",
                value: accuracyText,
                html: this.renderHomeBandTrendPanel(
                    snapshot.recentSessions
                )
            },
            {
                label: "Ritmo",
                value: `${Math.max(Number(snapshot.pausedRunsCount) || 0, 0) + Math.max(Number(snapshot.savedBlocksCount) || 0, 0)} sinais`,
                html: this.renderHomeBandRhythmPanel(
                    snapshot
                )
            },
            {
                label: "Mesmo nivel",
                value: standing.percentile
                    ? `Top ${standing.topPercent}%`
                    : "Estimando",
                html: this.renderHomeBandComparisonPanel(
                    snapshot
                )
            },
            {
                label: "Conta",
                value: "Google",
                html: this.renderHomeBandLoginPanel()
            }
        ]);

        this.syncLegacyHomeStatsWidget(
            snapshot
        );
    },

    handleHomeAction(action = "") {
        const safeAction =
            String(action || "").trim();

        if (!safeAction) {
            return;
        }

        if (
            safeAction ===
            "questions-progress"
        ) {
            const intent = {
                kind: "stats",
                source: "stats"
            };
            const gate =
                this.requireGoogleLogin(
                    intent
                );

            if (
                gate &&
                gate.allowed === true
            ) {
                this.handleGoogleLoginSuccess(
                    { intent }
                );
            }
            return;
        }

        if (
            safeAction ===
            "questions-quick"
        ) {
            window.RotaNotaQuestionsLauncherTarget =
                "home";
            this.navigate("questions");
            return;
        }

        if (
            safeAction === "pdf-upload" ||
            safeAction === "study-entry" ||
            safeAction === "pdf-convert" ||
            safeAction === "pdf-resume" ||
            safeAction === "pdf-library"
        ) {
            window.RotaNotaPremiumHomeAction =
                safeAction;
            this.navigate("premium-study");
        }
    },

    /* ================= CONTROL ================= */

    control(action) {

    const module = this.getActiveModule();

    if (!module) return;

    if (typeof module[action] === "function") {
        module[action]();
    }

},

    stopAll() {

        this.state.running = false;

        Object.values(this.modules)
            .forEach(m => {
                if (m.pause) m.pause();
            });
    },

    clearVisualResidues(target) {

        if (target === "qts") return;

        const ids = [
            "progressiveBars",
            "cycleProgress",
            "pomodoroPresets",
            "todayFlow"
        ];

        ids.forEach(id => {
            const el =
                document.getElementById(id);
            if (el) {
                el.innerHTML = "";

                if (id === "todayFlow") {
                    el.classList.add("hidden");
                }
            }
        });

        if (this.printBtn) {
            this.printBtn.style.visibility = "hidden";
            this.printBtn.style.pointerEvents = "none";
        }
    },

    /* ================= UI HELPERS ================= */

    hideModules() {
        this.moduleElements.forEach(m => {
            m.classList.remove("active");
            m.classList.remove("fade-out");
        });
    },

    hideHero() {
        if (this.hero)
            this.hero.style.display = "none";
    },

    showHero() {
        if (this.hero)
            this.hero.style.display = "";
    },

    showControls() {
        if (this.controls)
            this.controls.style.display = "flex";
    },

    hideControls() {
        if (this.controls)
            this.controls.style.display = "none";
    },

    toggleFocusMode() {
        const shouldEnable =
            !document.body.classList.contains("focus-mode");

        if (!shouldEnable) {
            this.exitFocusMode();
            return;
        }

        if (this.state.mode !== "clock")
            this.goHome();

        this.prepareAmbientForFocus();
        document.body.classList.add("focus-mode");
        document.body.classList.add("clock-immersion-mode");
        this.refreshShortcutHint(2400);

        if (!document.fullscreenElement) {
            document.documentElement
                .requestFullscreen()
                .catch(() => {});
        }
    },

    enterImmersionMode() {
        if (this.state.mode !== "clock") {
            this.goHome();
        }

        this.prepareAmbientForFocus();
        document.body.classList.add("focus-mode");
        document.body.classList.add("clock-immersion-mode");
        this.refreshShortcutHint(2400);

        if (!document.fullscreenElement) {
            document.documentElement
                .requestFullscreen()
                .catch(() => {});
        }
    },

    exitViewportModes() {
        document.body.classList.remove("focus-mode");
        document.body.classList.remove("immersive-mode");
        document.body.classList.remove("clock-immersion-mode");
        this.restoreAmbientAfterFocus();
        this.refreshShortcutHint(5000);
    },

    exitFocusMode() {
        document.body.classList.remove("focus-mode");
        document.body.classList.remove("clock-immersion-mode");
        this.restoreAmbientAfterFocus();
        this.refreshShortcutHint(5000);

        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
    },

    syncFullscreenState() {
        if (!document.fullscreenElement) {
            document.body.classList.remove("immersive-mode");
            document.body.classList.remove("focus-mode");
            document.body.classList.remove("clock-immersion-mode");
            this.restoreAmbientAfterFocus();
            this.refreshShortcutHint(5000);
            return;
        }

        this.refreshShortcutHint(2400);
    },

    initShortcutHint() {
        if (!this.shortcutHint) return;

        const activityEvents = [
            "pointerdown",
            "keydown",
            "wheel",
            "touchstart"
        ];

        activityEvents.forEach(eventName => {
            document.addEventListener(eventName, () => {
                this.refreshShortcutHint();
            }, { passive: true });
        });

        this.shortcutHint.addEventListener("click", () => {
            this.refreshShortcutHint(22000);
        });

        this.renderShortcutHint();
        this.scheduleShortcutHint(12000);
    },

    getShortcutHintItems() {
        if (
            document.body.classList.contains("focus-mode")
        ) {
            return [
                { key: "Esc", label: "sair" },
                { key: "Shift + D", label: "foco" },
                { key: "Shift + F", label: "tela atual" }
            ];
        }

        if (document.fullscreenElement) {
            return [
                { key: "Esc", label: "sair" },
                { key: "Shift + F", label: "tela cheia" },
                { key: "Shift + D", label: "foco" },
                { key: "Alt + M", label: "player" }
            ];
        }

        return [
            { key: "Shift + D", label: "foco" },
            { key: "Shift + F", label: "tela cheia" },
            { key: "Alt + M", label: "player" },
            { key: "Alt + T", label: "bloqueadas" }
        ];
    },

    renderShortcutHint() {
        if (!this.shortcutHint) return;

        const items = this.getShortcutHintItems();
        const isViewportMode =
            document.body.classList.contains("focus-mode");
        const isFullscreenOnly =
            document.fullscreenElement && !isViewportMode;
        const eyebrow = isViewportMode
            ? "Atalhos do modo"
            : isFullscreenOnly
                ? "Atalhos em tela cheia"
            : "Atalhos rapidos";

        this.shortcutHint.innerHTML = `
<div class="shortcut-hint-eyebrow">${eyebrow}</div>
<div class="shortcut-hint-row">
  ${items.map(item => `
    <div class="shortcut-hint-item">
      <kbd>${item.key}</kbd>
      <span>${item.label}</span>
    </div>
  `).join("")}
</div>
`;
    },

    showShortcutHint() {
        if (!this.shortcutHint) return;

        this.renderShortcutHint();
        this.shortcutHint.classList.add("is-visible");
        this.shortcutHint.setAttribute("aria-hidden", "false");

        clearTimeout(this.shortcutHideTimer);
        this.shortcutHideTimer = setTimeout(() => {
            if (!this.shortcutHint) return;
            this.shortcutHint.classList.remove("is-visible");
            this.shortcutHint.setAttribute("aria-hidden", "true");
        }, 9000);
    },

    scheduleShortcutHint(delay = 12000) {
        if (!this.shortcutHint) return;

        clearTimeout(this.shortcutShowTimer);
        clearTimeout(this.shortcutHideTimer);
        this.shortcutShowTimer = setTimeout(() => {
            this.showShortcutHint();
        }, delay);
    },

    refreshShortcutHint(delay = 12000) {
        if (!this.shortcutHint) return;

        this.shortcutHint.classList.remove("is-visible");
        this.shortcutHint.setAttribute("aria-hidden", "true");
        clearTimeout(this.shortcutShowTimer);
        clearTimeout(this.shortcutHideTimer);
        this.scheduleShortcutHint(delay);
    },

    /* ================= KEYBOARD ================= */

    initKeyboard() {

        document.addEventListener("keydown", (e) => {

            if (
                e.target.isContentEditable ||
                e.target.tagName === "INPUT" ||
                e.target.tagName === "TEXTAREA"
            ) return;

            if (e.key === "Escape") {

                this.exitViewportModes();

                if (document.fullscreenElement)
                    document.exitFullscreen().catch(() => {});

                return;
            }

            if (e.key.toLowerCase() === "f" && e.shiftKey) {

                e.preventDefault();
                this.toggleFullscreenCurrentView();
                return;
            }

            if (e.key.toLowerCase() === "d" && e.shiftKey) {
                e.preventDefault();
                this.toggleFocusMode();
                return;
            }

            if (this.state.mode !== "clock") {

                if (e.key === "Enter")
                    this.control("play");

                if (e.code === "Space") {
                    e.preventDefault();
                    this.control("pause");
                }

                if (e.key === "Backspace")
                    this.control("reset");
            }
        });
    },

    initFullscreen() {

        const btn =
            document.getElementById("fullscreenBtn");

        if (!btn) return;

        btn.addEventListener("click", () => {
            this.toggleFullscreenCurrentView();
        });

        document.addEventListener("fullscreenchange", () => {
            this.syncFullscreenState();
        });
    },

    toggleFullscreenCurrentView() {
        if (document.body.classList.contains("focus-mode")) {
            document.body.classList.remove("focus-mode");
            document.body.classList.remove("clock-immersion-mode");
            this.restoreAmbientAfterFocus();
            this.refreshShortcutHint(2400);
            return;
        }

        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
            this.refreshShortcutHint(5000);
            return;
        }

        document.documentElement
            .requestFullscreen()
            .then(() => {
                this.refreshShortcutHint(2400);
            })
            .catch(() => {});
    },

    initDarkMode() {

        const btn =
            document.getElementById("darkToggle");

        if (!btn) return;

        btn.addEventListener("click", () => {
            document.body.classList.toggle("dark");
        });
    },

    initTopbarCollapse() {
        const savedState =
            localStorage.getItem(this.topbarStorageKey);

        this.setTopbarCollapsed(savedState === "1", false);
    },

    toggleTopbarCollapsed() {
        const isCollapsed =
            document.body.classList.contains("topbar-collapsed");

        this.setTopbarCollapsed(!isCollapsed);
    },

    setTopbarCollapsed(collapsed, persist = true) {
        document.body.classList.toggle(
            "topbar-collapsed",
            Boolean(collapsed)
        );

        if (this.topbarCollapseBtn) {
            const label = collapsed
                ? "Expandir barra"
                : "Recolher barra";

            this.topbarCollapseBtn.setAttribute(
                "aria-label",
                label
            );
            this.topbarCollapseBtn.setAttribute(
                "title",
                label
            );
            this.topbarCollapseBtn.setAttribute(
                "aria-expanded",
                collapsed ? "false" : "true"
            );
        }

        if (persist) {
            localStorage.setItem(
                this.topbarStorageKey,
                collapsed ? "1" : "0"
            );
        }

        this.syncSideModulesAccessibility();
    },

    syncSideModulesAccessibility() {
        const side =
            document.getElementById("sideModules");

        if (!side) {
            return;
        }

        const style =
            window.getComputedStyle(side);
        const hidden =
            style.display === "none" ||
            style.visibility === "hidden" ||
            style.pointerEvents === "none" ||
            Number(style.opacity || "1") < 0.1;

        side.setAttribute(
            "aria-hidden",
            hidden ? "true" : "false"
        );
        side.inert = hidden;
    },

    prepareAmbientForFocus() {
        if (typeof AmbientState === "undefined") {
            this.ambientFocusPanelMode = null;
            return;
        }

        this.ambientFocusPanelMode = AmbientState.panelMode;

        if (
            typeof AmbientUI !== "undefined" &&
            AmbientState.panelMode !== 2
        ) {
            AmbientUI.setPanelMode(2);
        }
    },

    restoreAmbientAfterFocus() {
        if (
            this.ambientFocusPanelMode === null ||
            typeof AmbientState === "undefined"
        ) {
            return;
        }

        const previousMode = this.ambientFocusPanelMode;
        this.ambientFocusPanelMode = null;

        if (
            typeof AmbientUI !== "undefined" &&
            AmbientState.panelMode === 2 &&
            previousMode !== 2
        ) {
            AmbientUI.setPanelMode(previousMode);
        }
    },

    initStyleTheme() {
        localStorage.removeItem("rotanota_style_theme");
        this.applyStyleTheme("default", false);
    },

    applyStyleTheme(style = "default", persist = true) {
        document.body.dataset.style = "default";

        if (persist) {
            localStorage.removeItem("rotanota_style_theme");
        }
    }

};

/* ================= BOOT ================= */

window.Core = Core;

document.addEventListener("DOMContentLoaded", () => {

    Core.init();

    const footerLabelMap = {
        questions: "Questoes",
        calendar: "Agenda",
        stopwatch: "Cronometro",
        timer: "Timer",
        calculator: "Calculadora",
        pomodoro: "Pomodoro",
        routine: "Rotina semanal",
        "premium-study": "PDF Focado"
    };

    const side =
        document.getElementById("sideModules");

    const footerIcons =
        document.querySelectorAll(".footer-icon");

    if (side) {
        const primaryGroup =
            side.querySelector(
                '[data-nav-group="primary"] .side-group-buttons'
            );

        const utilityGroup =
            side.querySelector(
                '[data-nav-group="utility"] .side-group-buttons'
            );

        footerIcons.forEach(icon => {
            const label =
                String(
                    footerLabelMap[icon.dataset.module || ""] ||
                    icon.dataset.label ||
                    icon.textContent ||
                    ""
                ).trim();

            if (label) {
                icon.setAttribute(
                    "aria-label",
                    label
                );
                icon.setAttribute(
                    "title",
                    label
                );
            }

            const targetGroup =
                icon.dataset.tier === "primary"
                    ? primaryGroup
                    : utilityGroup;

            if (targetGroup) {
                targetGroup.appendChild(icon);
            } else {
                side.appendChild(icon);
            }
        });
    }

    Core.syncSideModulesAccessibility();
    window.addEventListener("resize", () => {
        Core.syncSideModulesAccessibility();
    });
});

