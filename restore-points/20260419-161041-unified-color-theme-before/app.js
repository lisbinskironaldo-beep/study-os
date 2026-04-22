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
    stylePanel: null,
    styleToggle: null,
    styleStorageKey: "study_os_style_theme",
    topbarStorageKey: "study_os_topbar_collapsed",
    ambientFocusPanelMode: null,
    supportedStyles: [
        "clarity",
        "immersion",
        "pulse"
    ],
    premiumStudyLoadPromise: null,

    /* ================= INIT ================= */

    init() {
        this.cacheDOM();
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
        this.goHome();
        this.initShortcutHint();
        this.handlePremiumPaymentReturn();
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

        this.stylePanel =
            document.getElementById("stylePanel") || null;

        this.styleToggle =
            document.getElementById("styleToggle") || null;
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

        this.footerButtons.forEach(btn => {

            btn.addEventListener("click", () => {

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

        if (this.styleToggle) {
            this.styleToggle.addEventListener("click", () => {
                this.cycleStyleTheme();
            });
        }

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

        this.premiumStudyLoadPromise =
            this.ensureScriptLoaded(
                "premium-study/bootstrap/index.js",
                "data-premium-bootstrap"
            );

        return this.premiumStudyLoadPromise;
    },

    /* ================= NAVIGATION ================= */

    navigate(target) {

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

this.stopAll()
this.clearVisualResidues(target)
this.hideHero()
this.hideModules()

const moduleEl = document.getElementById("questionsModule")
if (moduleEl) moduleEl.classList.add("active")

this.state.mode = "questions"
document.body.setAttribute("data-mode", "questions")
this.setActiveNav("questions")

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
QuestionsPage.init()
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
if (
window.QuestionsState &&
QuestionsState.getPhase() === "session" &&
!QuestionsState.isComplete()
) {
QuestionsPage.render()
} else {
QuestionsPage.render()
}
}

}

   return
}

   if (target === "premium-study") {

this.activateExternalModule("premium-study")

this.loadPremiumStudyModule()
.then(() => {

if (window.PremiumStudyBootstrap) {
window.PremiumStudyBootstrap.init({
root: document.getElementById("premium-studyModule")
})
}

})
.catch((error) => {
console.error(error)
})

return
}

   if (target === "routine") {

this.activateExternalModule("routine")

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
            this.changeMode(target);
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
    },

    changeMode(mode) {

    const previousMode = this.state.mode;

    this.stopAll();
    this.clearVisualResidues(mode);
    this.setMode(mode);

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

        if (module && module.render)
            module.render();
    },

    goHome() {
        if (
            window.PremiumStudyApp &&
            typeof PremiumStudyApp.clearAnalysisTimers ===
                "function"
        ) {
            PremiumStudyApp.clearAnalysisTimers();
        }
        document.body.removeAttribute("data-premium-step");
        this.changeMode("clock");
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

            if (
                e.key === "Escape" &&
                this.stylePanel &&
                !this.stylePanel.classList.contains("hidden")
            ) {
                this.closeStylePanel();
                return;
            }

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
        const savedStyle =
            localStorage.getItem(this.styleStorageKey) ||
            "clarity";

        this.applyStyleTheme(savedStyle, false);
    },

    applyStyleTheme(style = "clarity", persist = true) {
        const nextStyle =
            this.supportedStyles.includes(style)
                ? style
                : "clarity";

        document.body.dataset.style = nextStyle;

        if (persist) {
            localStorage.setItem(
                this.styleStorageKey,
                nextStyle
            );
        }

        this.syncStyleThemeUI(nextStyle);
    },

    syncStyleThemeUI(activeStyle) {
        if (!this.styleToggle) return;

        const labels = {
            clarity: "Clareza",
            immersion: "Imersao",
            pulse: "Pulso"
        };

        const nextStyle =
            this.supportedStyles[
                (this.supportedStyles.indexOf(activeStyle) + 1) %
                this.supportedStyles.length
            ] || "clarity";

        const nextLabel =
            labels[nextStyle] || "Clareza";

        this.styleToggle.innerHTML =
            this.getStyleToggleIcon(activeStyle);

        this.styleToggle.setAttribute(
            "aria-label",
            `Estilo visual: ${labels[activeStyle] || "Clareza"}. Clique para mudar para ${nextLabel}`
        );

        this.styleToggle.setAttribute(
            "title",
            `Estilo visual: ${labels[activeStyle] || "Clareza"}`
        );

        this.styleToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    },

    cycleStyleTheme() {
        const currentStyle =
            document.body.dataset.style || "clarity";

        const currentIndex =
            this.supportedStyles.indexOf(currentStyle);

        const nextStyle =
            this.supportedStyles[
                currentIndex >= 0
                    ? (currentIndex + 1) % this.supportedStyles.length
                    : 0
            ];

        this.applyStyleTheme(nextStyle);
    },

    getStyleToggleIcon(style = "clarity") {
        const icons = {
            clarity: `
<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2.2 2.2M16.8 16.8L19 19M19 5l-2.2 2.2M5 19l2.2-2.2" stroke-linecap="round"/>
</svg>`,
            immersion: `
<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" stroke-linejoin="round"/>
    <path d="M12 7v10M7.7 9.4 16.3 14.6" stroke-linecap="round"/>
</svg>`,
            pulse: `
<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <path d="M3 12h4l2-4 3 8 2-4h7" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
        };

        return icons[style] || icons.clarity;
    }

};

/* ================= BOOT ================= */

window.Core = Core;

document.addEventListener("DOMContentLoaded", () => {

    Core.init();

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
});

