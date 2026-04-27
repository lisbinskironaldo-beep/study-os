(function () {
    if (window.PremiumStudyPromotions) {
        return;
    }

    const cache = new Map();

    function getCacheKey(surface = "premium_checkout", feature = "") {
        return `${surface}::${feature || ""}`;
    }

    function normalizePromotion(input) {
        if (!input || typeof input !== "object") {
            return null;
        }

        return {
            id: input.id || "",
            feature: String(input.feature || "").trim(),
            surface: String(input.surface || "premium_checkout").trim(),
            channel: String(input.channel || "internal_site").trim(),
            status: String(input.status || "").trim(),
            mode: String(input.mode || "suggest").trim(),
            headline: String(input.headline || "").trim(),
            lead: String(input.lead || "").trim(),
            benefits: Array.isArray(input.benefits) ? input.benefits.filter(Boolean) : [],
            cta: String(input.cta || "").trim(),
            recommendedPlanId: String(input.recommended_plan_id || input.recommendedPlanId || "").trim(),
            targeting: input.targeting && typeof input.targeting === "object"
                ? input.targeting
                : {}
        };
    }

    async function refresh(surface = "premium_checkout", feature = "") {
        const url = new URL("/api/premium/promotions", window.location.origin);
        url.searchParams.set("surface", surface);
        if (feature) {
            url.searchParams.set("feature", feature);
        }

        try {
            const response = await fetch(url.toString());
            const payload = await response.json().catch(() => null);
            const promotion = payload && payload.promotion
                ? normalizePromotion(payload.promotion)
                : null;

            cache.set(getCacheKey(surface, feature), promotion);

            if (promotion && !feature) {
                cache.set(getCacheKey(surface, promotion.feature || ""), promotion);
            }

            return promotion;
        } catch (error) {
            return getCampaign(feature, surface);
        }
    }

    function getCampaign(feature = "", surface = "premium_checkout") {
        return cache.get(getCacheKey(surface, feature))
            || cache.get(getCacheKey(surface, ""))
            || null;
    }

    function mergeBenefits(baseBenefits = [], promotionBenefits = []) {
        const ordered = [];

        [...promotionBenefits, ...baseBenefits].forEach((benefit) => {
            if (benefit && !ordered.includes(benefit)) {
                ordered.push(benefit);
            }
        });

        return ordered;
    }

    function enhanceOffer(offer = {}, context = {}) {
        const feature = context.feature || offer.feature || "";
        const surface = context.surface || "premium_checkout";
        const campaign = getCampaign(feature, surface);

        if (!campaign) {
            return {
                ...offer
            };
        }

        return {
            ...offer,
            title: campaign.headline || offer.title,
            lead: campaign.lead || offer.lead,
            benefits: mergeBenefits(offer.benefits || [], campaign.benefits || []),
            cta: campaign.cta || offer.cta,
            recommendedPlanId: campaign.recommendedPlanId || offer.recommendedPlanId || "",
            promotionCampaignId: campaign.id || "",
            promotionMode: campaign.mode || "",
            promotionSurface: campaign.surface || surface,
            promotionChannel: campaign.channel || "internal_site",
            promotionTargeting: campaign.targeting || {}
        };
    }

    function getCheckoutContext(feature = "", surface = "premium_checkout") {
        const campaign = getCampaign(feature, surface);

        if (!campaign) {
            return {};
        }

        return {
            promotionCampaignId: campaign.id,
            promotionMode: campaign.mode,
            promotionSurface: campaign.surface,
            promotionChannel: campaign.channel,
            recommendedPlanId: campaign.recommendedPlanId
        };
    }

    function getRecommendedPlanId(feature = "", surface = "premium_checkout") {
        const campaign = getCampaign(feature, surface);
        return campaign ? campaign.recommendedPlanId : "";
    }

    window.PremiumStudyPromotions = {
        refresh,
        getCampaign,
        enhanceOffer,
        getCheckoutContext,
        getRecommendedPlanId
    };
})();
