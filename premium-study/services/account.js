(function () {
    if (window.PremiumStudyAccount) {
        return;
    }

    const STATUS_ENDPOINT = "/api/premium/status";

    async function refreshStatus() {
        const identity = window.PremiumStudyIdentity;
        const customerId = identity && typeof identity.getCustomerId === "function"
            ? identity.getCustomerId()
            : "";

        if (!customerId) {
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
            response = await fetch(`${STATUS_ENDPOINT}?customerId=${encodeURIComponent(customerId)}`);
            payload = await response.json();
        } catch (error) {
            return {
                ok: false,
                customerId,
                accessTier: "free",
                subscriptionStatus: "status_endpoint_unavailable",
                premiumActive: false
            };
        }

        if (!response.ok || !payload) {
            return {
                ok: false,
                customerId,
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

        if (!store || !status) {
            return status;
        }

        store.patch({
            customerId: status.customerId || "",
            accessTier: status.accessTier === "premium" ? "premium" : "free",
            subscriptionStatus: status.subscriptionStatus || "registered_free",
            premiumEntitlement: status.entitlement || null,
            premiumStatusConfigured: Boolean(status.configured)
        });

        return status;
    }

    async function refreshAndApply() {
        const status = await refreshStatus();
        applyStatusToStore(status);
        return status;
    }

    window.PremiumStudyAccount = {
        refreshStatus,
        applyStatusToStore,
        refreshAndApply
    };
})();
