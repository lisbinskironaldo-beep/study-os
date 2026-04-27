(function () {
    if (window.RotaNotaAuth) {
        return;
    }

    const SESSION_ENDPOINT = "/api/auth/session";
    const GOOGLE_LOGIN_ENDPOINT = "/api/auth/google";
    const LOGOUT_ENDPOINT = "/api/auth/logout";
    const GOOGLE_SDK_URL = "https://accounts.google.com/gsi/client";
    const CUSTOMER_STORAGE_KEY = "rotanota.premium.customerId";

    const state = {
        session: null,
        googleConfigured: false,
        googleClientId: "",
        scriptPromise: null,
        profileSlot: null,
        menuOpen: false,
        loginPending: false,
        gatePayload: null
    };

    function getLocalCustomerId() {
        try {
            return String(
                window.localStorage.getItem(CUSTOMER_STORAGE_KEY) || ""
            ).trim();
        } catch (_error) {
            return "";
        }
    }

    function dispatchAuthChanged(detail = {}) {
        window.dispatchEvent(
            new CustomEvent("rotanota:auth-changed", {
                detail: {
                    authenticated: Boolean(state.session),
                    session: state.session,
                    ...detail
                }
            })
        );
    }

    function getSession() {
        return state.session;
    }

    function isAuthenticated() {
        return Boolean(
            state.session &&
            state.session.userId
        );
    }

    function isGoogleLoginAvailable() {
        return Boolean(
            state.googleConfigured &&
            state.googleClientId
        );
    }

    function getDisplayName() {
        if (!state.session) {
            return "Conta";
        }

        return state.session.name ||
            state.session.email ||
            "Conta";
    }

    function getInitial() {
        return getDisplayName()
            .trim()
            .charAt(0)
            .toUpperCase() || "C";
    }

    function getPlanLabel() {
        if (!state.session) {
            return "Visitante";
        }

        return state.session.premiumActive
            ? "Premium"
            : "Gratis";
    }

    function getProviderLabel() {
        if (!state.session) {
            return "";
        }

        if (state.session.provider === "google") {
            return "Conta Google";
        }

        return "Conta conectada";
    }

    function closeMenu() {
        state.menuOpen = false;
        renderProfileSlot();
    }

    function toggleMenu() {
        state.menuOpen = !state.menuOpen;
        renderProfileSlot();
    }

    function ensureProfileSlot() {
        state.profileSlot =
            document.getElementById("rotanotaProfileSlot");

        if (state.profileSlot) {
            return state.profileSlot;
        }

        const topbarRight = document.querySelector(
            ".topbar-right"
        );

        if (!topbarRight) {
            return null;
        }

        const slot = document.createElement("div");
        slot.id = "rotanotaProfileSlot";
        slot.className = "rotanota-account-slot";
        const questionsButton = topbarRight.querySelector(
            '[data-module="questions"]'
        );

        if (questionsButton) {
            topbarRight.insertBefore(
                slot,
                questionsButton
            );
        } else {
            topbarRight.appendChild(slot);
        }

        state.profileSlot = slot;

        return state.profileSlot;
    }

    function renderProfileSlot() {
        const slot = ensureProfileSlot();

        if (!slot) {
            return;
        }

        if (!isAuthenticated()) {
            slot.innerHTML = `
                <button type="button" class="rotanota-account-btn rotanota-account-btn-guest" id="rotanotaAccountBtn">
                    <span class="rotanota-account-avatar rotanota-account-avatar-guest" aria-hidden="true">G</span>
                    <span class="rotanota-account-label">Entrar</span>
                </button>
            `;

            slot.querySelector("#rotanotaAccountBtn")
                ?.addEventListener("click", () => {
                    if (
                        window.RotaNotaCore &&
                        typeof window.RotaNotaCore.requireGoogleLogin === "function"
                    ) {
                        window.RotaNotaCore.requireGoogleLogin({
                            kind: "account",
                            source: "profile"
                        });
                    }
                });
            return;
        }

        const picture = String(
            state.session.picture || ""
        ).trim();
        const premiumBadge = `<span class="rotanota-account-plan${state.session.premiumActive ? "" : " is-free"}">${getPlanLabel()}</span>`;

        slot.innerHTML = `
            <div class="rotanota-account-shell${state.menuOpen ? " is-open" : ""}">
                <button type="button" class="rotanota-account-btn" id="rotanotaAccountBtn" aria-expanded="${state.menuOpen ? "true" : "false"}">
                    ${picture
                        ? `<img class="rotanota-account-avatar-image" src="${picture.replace(/"/g, "&quot;")}" alt="">`
                        : `<span class="rotanota-account-avatar" aria-hidden="true">${getInitial()}</span>`}
                    <span class="rotanota-account-copy">
                        <strong>${getDisplayName()}</strong>
                        <span>${state.session.email || "Conta conectada"}</span>
                    </span>
                </button>
                <div class="rotanota-account-menu${state.menuOpen ? " is-open" : ""}">
                    <div class="rotanota-account-menu-head">
                        <strong>${getDisplayName()}</strong>
                        <span>${state.session.email || ""}</span>
                    </div>
                    <div class="rotanota-account-meta">
                        <div class="rotanota-account-meta-row">
                            <span class="rotanota-account-meta-label">Conta</span>
                            <strong>${getProviderLabel()}</strong>
                        </div>
                        <div class="rotanota-account-meta-row">
                            <span class="rotanota-account-meta-label">Plano</span>
                            ${premiumBadge}
                        </div>
                    </div>
                    <button type="button" class="rotanota-account-menu-btn" data-account-action="edit-profile">Editar perfil</button>
                    <button type="button" class="rotanota-account-menu-btn" data-account-action="stats">Abrir painel</button>
                    <button type="button" class="rotanota-account-menu-btn is-danger" data-account-action="logout">Sair</button>
                </div>
            </div>
        `;

        slot.querySelector("#rotanotaAccountBtn")
            ?.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                toggleMenu();
            });

        slot.querySelectorAll("[data-account-action]")
            .forEach((button) => {
                button.addEventListener("click", async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const action = button.dataset.accountAction;

                    if (action === "logout") {
                        await logout();
                        return;
                    }

                    if (action === "edit-profile") {
                        closeMenu();
                        window.open("https://myaccount.google.com/", "_blank", "noopener,noreferrer");
                        return;
                    }

                    if (
                        action === "stats" &&
                        window.RotaNotaCore &&
                        typeof window.RotaNotaCore.handleGoogleLoginSuccess === "function"
                    ) {
                        closeMenu();
                        window.RotaNotaCore.handleGoogleLoginSuccess({
                            intent: {
                                kind: "stats",
                                source: "profile_menu"
                            }
                        });
                    }
                });
            });
    }

    async function refreshSession(options = {}) {
        let response;
        let payload;

        try {
            response = await fetch(SESSION_ENDPOINT, {
                credentials: "same-origin"
            });
            payload = await response.json();
        } catch (_error) {
            payload = null;
        }

        const nextSession =
            response &&
            response.ok &&
            payload &&
            payload.authenticated &&
            payload.user
                ? {
                    ...payload.user,
                    premiumActive: Boolean(payload.premiumActive),
                    accessTier: payload.accessTier || "free",
                    subscriptionStatus: payload.subscriptionStatus || "registered_free",
                    customerId: payload.customerId || ""
                }
                : null;

        state.session = nextSession;
        state.googleConfigured = Boolean(
            payload && payload.googleConfigured
        );
        state.googleClientId = String(
            payload && payload.googleClientId
                ? payload.googleClientId
                : ""
        ).trim();
        state.menuOpen = false;
        renderProfileSlot();

        if (options.silent !== true) {
            dispatchAuthChanged({
                source: options.source || "refresh"
            });
        }

        return {
            ok: Boolean(response && response.ok),
            authenticated: Boolean(nextSession),
            session: nextSession,
            googleConfigured: state.googleConfigured
        };
    }

    function ensureGoogleSdk() {
        if (
            window.google &&
            window.google.accounts &&
            window.google.accounts.id
        ) {
            return Promise.resolve();
        }

        if (state.scriptPromise) {
            return state.scriptPromise;
        }

        state.scriptPromise = new Promise((resolve, reject) => {
            const existing = document.querySelector(
                `script[src="${GOOGLE_SDK_URL}"]`
            );

            if (existing) {
                existing.addEventListener("load", () => resolve(), { once: true });
                existing.addEventListener("error", () => reject(new Error("Falha ao carregar Google Identity Services.")), { once: true });
                return;
            }

            const script = document.createElement("script");
            script.src = GOOGLE_SDK_URL;
            script.async = true;
            script.defer = true;
            script.addEventListener("load", () => resolve(), { once: true });
            script.addEventListener("error", () => reject(new Error("Falha ao carregar Google Identity Services.")), { once: true });
            document.head.appendChild(script);
        });

        return state.scriptPromise;
    }

    async function exchangeCredential(credential, payload = {}) {
        const response = await fetch(GOOGLE_LOGIN_ENDPOINT, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                credential,
                customerId: getLocalCustomerId(),
                source: payload.source || "unknown",
                intent: payload.intent || null
            })
        });
        const result = await response.json();

        if (!response.ok || !result.ok) {
            throw new Error(
                result && result.message
                    ? result.message
                    : "Nao foi possivel concluir o login Google."
            );
        }

        await refreshSession({
            silent: true,
            source: "google_exchange"
        });
        dispatchAuthChanged({
            source: "google_login"
        });
        window.dispatchEvent(
            new CustomEvent("rotanota:google-login-success", {
                detail: {
                    source: payload.source || "unknown",
                    intent: payload.intent || null,
                    session: state.session
                }
            })
        );

        return result;
    }

    async function prepareGoogleGateButton(payload = {}) {
        state.gatePayload = payload;

        if (!state.googleClientId) {
            await refreshSession({
                silent: true,
                source: "pre_google_gate"
            });
        }

        const slot = document.getElementById(
            "homeStatsLoginGateButtonSlot"
        );

        if (!slot) {
            return;
        }

        slot.innerHTML = "";

        if (!state.googleConfigured || !state.googleClientId) {
            window.dispatchEvent(
                new CustomEvent("rotanota:google-login-error", {
                    detail: {
                        message: "GOOGLE_CLIENT_ID ainda nao foi configurado no servidor."
                    }
                })
            );
            return;
        }

        try {
            await ensureGoogleSdk();
        } catch (error) {
            window.dispatchEvent(
                new CustomEvent("rotanota:google-login-error", {
                    detail: {
                        message: error.message
                    }
                })
            );
            return;
        }

        if (
            !window.google ||
            !window.google.accounts ||
            !window.google.accounts.id
        ) {
            return;
        }

        window.google.accounts.id.initialize({
            client_id: state.googleClientId,
            callback: async (response) => {
                if (state.loginPending) {
                    return;
                }

                state.loginPending = true;

                try {
                    await exchangeCredential(
                        response.credential,
                        state.gatePayload || payload
                    );
                } catch (error) {
                    window.dispatchEvent(
                        new CustomEvent("rotanota:google-login-error", {
                            detail: {
                                message: error.message
                            }
                        })
                    );
                } finally {
                    state.loginPending = false;
                }
            },
            context: "signin",
            cancel_on_tap_outside: false,
            auto_select: false,
            use_fedcm_for_prompt: true,
            itp_support: true
        });

        window.google.accounts.id.renderButton(slot, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "continue_with",
            shape: "pill",
            logo_alignment: "left",
            width: 260
        });
    }

    async function requestGoogleLogin(payload = {}) {
        if (state.loginPending) {
            return {
                ok: false,
                status: "login_pending"
            };
        }

        if (!state.googleClientId) {
            await refreshSession({
                silent: true,
                source: "pre_google_login"
            });
        }

        if (!state.googleConfigured || !state.googleClientId) {
            window.dispatchEvent(
                new CustomEvent("rotanota:google-login-error", {
                    detail: {
                        message: "GOOGLE_CLIENT_ID ainda nao foi configurado no servidor."
                    }
                })
            );
            return {
                ok: false,
                status: "google_not_configured"
            };
        }

        try {
            await ensureGoogleSdk();
        } catch (error) {
            window.dispatchEvent(
                new CustomEvent("rotanota:google-login-error", {
                    detail: {
                        message: error.message
                    }
                })
            );
            return {
                ok: false,
                status: "google_sdk_failed"
            };
        }

        state.loginPending = true;

        return new Promise((resolve) => {
            let settled = false;

            const finish = (result) => {
                if (settled) {
                    return;
                }

                settled = true;
                state.loginPending = false;
                resolve(result);
            };

            window.google.accounts.id.initialize({
                client_id: state.googleClientId,
                callback: async (response) => {
                    try {
                        const result = await exchangeCredential(
                            response.credential,
                            payload
                        );
                        finish({
                            ok: true,
                            status: "authenticated",
                            result
                        });
                    } catch (error) {
                        window.dispatchEvent(
                            new CustomEvent("rotanota:google-login-error", {
                                detail: {
                                    message: error.message
                                }
                            })
                        );
                        finish({
                            ok: false,
                            status: "exchange_failed",
                            message: error.message
                        });
                    }
                },
                context: "signin",
                cancel_on_tap_outside: false,
                auto_select: false,
                use_fedcm_for_prompt: true,
                itp_support: true
            });

            window.google.accounts.id.prompt((notification) => {
                if (settled) {
                    return;
                }

                if (
                    notification &&
                    typeof notification.isNotDisplayed === "function" &&
                    notification.isNotDisplayed()
                ) {
                    const reason = typeof notification.getNotDisplayedReason === "function"
                        ? notification.getNotDisplayedReason()
                        : "not_displayed";
                    const message = reason === "browser_not_supported"
                        ? "Este navegador nao aceitou o fluxo do Google."
                        : "O prompt do Google nao apareceu agora.";

                    window.dispatchEvent(
                        new CustomEvent("rotanota:google-login-error", {
                            detail: { message }
                        })
                    );
                    finish({
                        ok: false,
                        status: reason,
                        message
                    });
                    return;
                }

                if (
                    notification &&
                    typeof notification.isSkippedMoment === "function" &&
                    notification.isSkippedMoment()
                ) {
                    const message = "Escolha uma conta do Google para continuar.";
                    window.dispatchEvent(
                        new CustomEvent("rotanota:google-login-error", {
                            detail: {
                                message,
                                level: "soft"
                            }
                        })
                    );
                    finish({
                        ok: false,
                        status: "skipped",
                        message
                    });
                }
            });
        });
    }

    async function logout() {
        if (
            window.google &&
            window.google.accounts &&
            window.google.accounts.id &&
            typeof window.google.accounts.id.disableAutoSelect === "function"
        ) {
            window.google.accounts.id.disableAutoSelect();
        }

        try {
            await fetch(LOGOUT_ENDPOINT, {
                method: "POST",
                credentials: "same-origin"
            });
        } catch (_error) {
            // Ignora falha de rede e limpa o estado local.
        }

        state.session = null;
        state.menuOpen = false;
        renderProfileSlot();
        dispatchAuthChanged({
            source: "logout"
        });
    }

    function bindGlobalEvents() {
        document.addEventListener("click", (event) => {
            const slot = ensureProfileSlot();

            if (
                !state.menuOpen ||
                !slot ||
                slot.contains(event.target)
            ) {
                return;
            }

            closeMenu();
        });

        window.addEventListener("focus", () => {
            refreshSession({
                source: "window_focus"
            });
        });
    }

    function init() {
        ensureProfileSlot();
        bindGlobalEvents();
        renderProfileSlot();
        refreshSession({
            source: "init"
        });
    }

    window.RotaNotaAuth = {
        init,
        refreshSession,
        getSession,
        isAuthenticated,
        isGoogleLoginAvailable,
        prepareGoogleGateButton,
        requestGoogleLogin,
        logout
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
