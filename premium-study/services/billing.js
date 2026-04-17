(function () {
    if (window.PremiumStudyBilling) {
        return;
    }

    const PROVIDER_STATUS = {
        mode: "local_scaffold",
        provider: "not_configured",
        checkoutReady: false,
        message: "A base de billing esta pronta, mas nenhum provedor de pagamento foi conectado ainda."
    };

    const PLANS = [
        {
            id: "premium_monthly",
            tier: "premium",
            label: "Premium mensal",
            priceLabel: "Valor a definir",
            interval: "month",
            description: "Melhor para testar continuidade, biblioteca e extras.",
            recommended: true,
            checkoutProvider: "pending"
        },
        {
            id: "premium_annual",
            tier: "premium",
            label: "Premium anual",
            priceLabel: "Valor a definir",
            interval: "year",
            description: "Melhor para quem vai estudar por meses ou concurso.",
            recommended: false,
            checkoutProvider: "pending"
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

        return {
            ok: false,
            status: "not_configured",
            plan,
            context,
            message: "Checkout real ainda nao foi conectado. A proxima etapa deve ligar este contrato ao provedor escolhido."
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
