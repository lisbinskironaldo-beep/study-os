(function () {
    if (window.PremiumStudyIdentity) {
        return;
    }

    const STORAGE_KEY = "rotanota.premium.customerId";

    function createCustomerId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return `rn_${window.crypto.randomUUID()}`;
        }

        return `rn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
    }

    function getCustomerId() {
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return saved;
            }

            const customerId = createCustomerId();
            window.localStorage.setItem(STORAGE_KEY, customerId);
            return customerId;
        } catch (error) {
            return createCustomerId();
        }
    }

    function getCheckoutContext() {
        const auth = window.RotaNotaAuth;
        const session = auth && typeof auth.getSession === "function"
            ? auth.getSession()
            : null;

        return {
            customerId: getCustomerId(),
            userId: session && session.userId
                ? session.userId
                : "",
            authenticated: Boolean(session && session.userId)
        };
    }

    window.PremiumStudyIdentity = {
        getCustomerId,
        getCheckoutContext
    };
})();
