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

    const PLANS = [
        {
            id: "premium_monthly",
            tier: "premium",
            label: "Premium mensal",
            priceLabel: "Mensal",
            interval: "month",
            description: "Continuidade, biblioteca e extras com renovacao mensal.",
            recommended: true,
            checkoutProvider: "mercado_pago"
        },
        {
            id: "premium_annual",
            tier: "premium",
            label: "Premium anual",
            priceLabel: "Anual",
            interval: "year",
            description: "Melhor para concurso, materiais longos e rotina de meses.",
            recommended: false,
            checkoutProvider: "mercado_pago"
        }
    ];

    function getPlans() {
        return PLANS.map((plan) => ({ ...plan }));
    }

    function getRecommendedPlan() {
        return getPlans().find((plan) => plan.recommended) || getPlans()[0];
    }

    async function startCheckout(planId, context = {}) {
        const plan = PLANS.find((item) => item.id === planId) || getRecommendedPlan();
        const identityContext = window.PremiumStudyIdentity && typeof window.PremiumStudyIdentity.getCheckoutContext === "function"
            ? window.PremiumStudyIdentity.getCheckoutContext()
            : {};
        const checkoutContext = {
            ...context,
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
