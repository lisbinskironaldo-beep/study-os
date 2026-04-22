(function () {
    if (window.PremiumStudyBilling) {
        return;
    }

    const PROVIDER_STATUS = {
        mode: "serverless",
        provider: "mercado_pago",
        checkoutReady: true,
        message: "Checkout Mercado Pago preparado. O botao abre o checkout quando o ambiente publicado tiver as variaveis configuradas."
    };

    const CHECKOUT_ENDPOINT = "/api/mercado-pago/checkout";
    const CHECKOUT_CONTEXT_KEY = "rotanota-premium-checkout-context";

    const PLANS = [
        {
            id: "premium_monthly",
            tier: "premium",
            label: "Premium mensal",
            priceLabel: "R$ 19,90",
            interval: "month",
            description: "Entrada mais leve para liberar biblioteca, continuidade e extras.",
            recommended: false,
            checkoutProvider: "mercado_pago"
        },
        {
            id: "premium_annual",
            tier: "premium",
            label: "Premium anual",
            priceLabel: "R$ 149,90",
            interval: "year",
            description: "Melhor escolha para rotina longa, apostilas grandes e preparo continuo.",
            recommended: true,
            checkoutProvider: "mercado_pago"
        }
    ];

    function getPlans() {
        return PLANS.map((plan) => ({ ...plan }));
    }

    function getRecommendedPlan() {
        return getPlans().find((plan) => plan.recommended) || getPlans()[0];
    }

    function buildCheckoutReturnSnapshot(checkoutContext = {}) {
        const store = window.PremiumStudyStore;

        if (!store || typeof store.exportSnapshot !== "function") {
            return null;
        }

        const snapshot = store.exportSnapshot();

        if (!snapshot || !snapshot.materialName) {
            return null;
        }

        const resumeStep = snapshot.step === "premium-checkout" || snapshot.step === "premium-library"
            ? (snapshot.returnStep || checkoutContext.sourceStep || "mode-select")
            : snapshot.step;

        return {
            ...snapshot,
            step: resumeStep || "mode-select",
            returnStep: snapshot.returnStep || checkoutContext.sourceStep || "mode-select",
            premiumOffer: null
        };
    }

    function persistCheckoutReturnContext(plan, checkoutContext = {}) {
        if (!window.sessionStorage) {
            return;
        }

        try {
            window.sessionStorage.setItem(CHECKOUT_CONTEXT_KEY, JSON.stringify({
                storedAt: new Date().toISOString(),
                planId: plan && plan.id ? plan.id : "",
                sourceStep: checkoutContext.sourceStep || "",
                feature: checkoutContext.feature || "",
                snapshot: buildCheckoutReturnSnapshot(checkoutContext)
            }));
        } catch (error) {
            // Se o navegador bloquear sessionStorage, o fluxo segue com fallback para a tela base.
        }
    }

    async function startCheckout(planId, context = {}) {
        const plan = PLANS.find((item) => item.id === planId) || getRecommendedPlan();
        const identityContext = window.PremiumStudyIdentity && typeof window.PremiumStudyIdentity.getCheckoutContext === "function"
            ? window.PremiumStudyIdentity.getCheckoutContext()
            : {};
        const promotionContext = window.PremiumStudyPromotions && typeof window.PremiumStudyPromotions.getCheckoutContext === "function"
            ? window.PremiumStudyPromotions.getCheckoutContext(context.feature || "", context.surface || "premium_checkout")
            : {};
        const acquisitionContext = window.PremiumStudyGrowth && typeof window.PremiumStudyGrowth.getAcquisitionContext === "function"
            ? window.PremiumStudyGrowth.getAcquisitionContext()
            : {};
        const checkoutContext = {
            ...context,
            ...acquisitionContext,
            ...promotionContext,
            ...identityContext
        };

        let response;
        let payload;

        try {
            response = await fetch(CHECKOUT_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    planId: plan.id,
                    customerId: checkoutContext.customerId,
                    context: checkoutContext
                })
            });
        } catch (error) {
            return {
                ok: false,
                status: "checkout_endpoint_unavailable",
                plan,
                context: checkoutContext,
                message: "Nao consegui acessar o endpoint seguro de checkout. Ele precisa estar publicado junto do site."
            };
        }

        try {
            payload = await response.json();
        } catch (error) {
            payload = null;
        }

        if (!response.ok || !payload || !payload.ok) {
            return {
                ok: false,
                status: payload && payload.status ? payload.status : "checkout_error",
                plan,
                context: checkoutContext,
                message: payload && payload.message
                    ? payload.message
                    : "O checkout ainda nao respondeu corretamente. Verifique a publicacao e as variaveis do servidor."
            };
        }

        if (payload.checkoutUrl) {
            persistCheckoutReturnContext(plan, checkoutContext);
            window.location.assign(payload.checkoutUrl);
        }

        return {
            ok: true,
            status: payload.status || "checkout_created",
            plan,
            context: checkoutContext,
            customerId: payload.customerId || checkoutContext.customerId,
            preferenceId: payload.preferenceId,
            checkoutUrl: payload.checkoutUrl,
            message: "Checkout criado. Abrindo Mercado Pago..."
        };
    }

    function getProviderStatus() {
        return { ...PROVIDER_STATUS };
    }

    window.PremiumStudyBilling = {
        getPlans,
        getRecommendedPlan,
        startCheckout,
        getProviderStatus
    };
})();
