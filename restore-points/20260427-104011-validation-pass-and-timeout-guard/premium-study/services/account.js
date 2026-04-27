(function () {
    if (window.PremiumStudyAccount) {
        return;
    }

    const STATUS_ENDPOINT = "/api/premium/status";

    async function refreshStatus(options = {}) {
        const identity = window.PremiumStudyIdentity;
        const auth = window.RotaNotaAuth;
        const session = auth && typeof auth.getSession === "function"
            ? auth.getSession()
            : null;
        const customerId = identity && typeof identity.getCustomerId === "function"
            ? identity.getCustomerId()
            : "";
        const paymentId = String(options.paymentId || "").trim();
        const userId = session && session.userId
            ? session.userId
            : "";

        if (!customerId && !paymentId && !userId) {
            return {
                ok: false,
                accessTier: "free",
                subscriptionStatus: "missing_customer_id",
                premiumActive: false
            };
        }

        let response;
        let payload;

        try {
            const params = new URLSearchParams();

            if (customerId) {
                params.set("customerId", customerId);
            }

            if (userId) {
                params.set("userId", userId);
            }

            if (paymentId) {
                params.set("paymentId", paymentId);
            }

            response = await fetch(`${STATUS_ENDPOINT}?${params.toString()}`);
            payload = await response.json();
        } catch (error) {
            return {
                ok: false,
                customerId,
                userId,
                accessTier: "free",
                subscriptionStatus: "status_endpoint_unavailable",
                premiumActive: false
            };
        }

        if (!response.ok || !payload) {
            return {
                ok: false,
                customerId,
                userId,
                accessTier: "free",
                subscriptionStatus: payload && payload.subscriptionStatus
                    ? payload.subscriptionStatus
                    : "status_lookup_failed",
                premiumActive: false
            };
        }

        return payload;
    }

    function applyStatusToStore(status) {
        const store = window.PremiumStudyStore;
        const auth = window.RotaNotaAuth;
        const session = auth && typeof auth.getSession === "function"
            ? auth.getSession()
            : null;

        if (!store || !status) {
            return status;
        }

        store.patch({
            customerId: status.customerId || "",
            accountUser: status.user || (session
                ? {
                    userId: session.userId,
                    email: session.email || "",
                    name: session.name || "",
                    picture: session.picture || ""
                }
                : null),
            accountAuthenticated: Boolean(status.authenticated || status.userId),
            accessTier: status.accessTier === "premium" ? "premium" : "free",
            subscriptionStatus: status.subscriptionStatus || "registered_free",
            premiumEntitlement: status.entitlement || null,
            premiumStatusConfigured: Boolean(status.configured),
            generationPaused: Boolean(status.generationPaused),
            opsLanes: status.lanes && typeof status.lanes === "object"
                ? status.lanes
                : store.getState().opsLanes,
            opsThresholds: status.opsThresholds && typeof status.opsThresholds === "object"
                ? status.opsThresholds
                : store.getState().opsThresholds,
            trialState: status.trialState || null
        });

        return status;
    }

    async function refreshAndApply(options = {}) {
        const status = await refreshStatus(options);
        applyStatusToStore(status);
        return status;
    }

    window.PremiumStudyAccount = {
        refreshStatus,
        applyStatusToStore,
        refreshAndApply
    };
})();
