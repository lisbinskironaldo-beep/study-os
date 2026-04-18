const { isSupabaseConfigured, supabaseRequest } = require("./supabase");

const PLAN_DURATIONS_DAYS = {
    premium_monthly: 31,
    premium_annual: 366
};

function sanitizeCustomerId(value) {
    const customerId = String(value || "").trim();

    if (!customerId || customerId.length > 120) {
        return "";
    }

    return /^[a-zA-Z0-9:_-]+$/.test(customerId) ? customerId : "";
}

function parseExternalReference(value) {
    const raw = String(value || "");
    const parts = raw.split(":");

    if (parts[0] !== "rotanota") {
        return {
            customerId: "",
            planId: ""
        };
    }

    return {
        customerId: sanitizeCustomerId(parts[1] || ""),
        planId: parts[2] || ""
    };
}

function getPaymentMetadata(payment = {}) {
    return payment.metadata && typeof payment.metadata === "object"
        ? payment.metadata
        : {};
}

function getCustomerIdFromPayment(payment = {}) {
    const metadata = getPaymentMetadata(payment);
    const parsedReference = parseExternalReference(payment.external_reference);

    return sanitizeCustomerId(
        metadata.customer_id ||
        metadata.customerId ||
        parsedReference.customerId
    );
}

function getPlanIdFromPayment(payment = {}) {
    const metadata = getPaymentMetadata(payment);
    const parsedReference = parseExternalReference(payment.external_reference);

    return metadata.plan_id || metadata.planId || parsedReference.planId || "premium_monthly";
}

function getValidUntil(planId, approvedAt) {
    const days = PLAN_DURATIONS_DAYS[planId] || PLAN_DURATIONS_DAYS.premium_monthly;
    const baseDate = approvedAt ? new Date(approvedAt) : new Date();
    const validUntil = new Date(baseDate.getTime() + (days * 24 * 60 * 60 * 1000));

    return validUntil.toISOString();
}

function normalizeEntitlement(row) {
    if (!row) {
        return {
            accessTier: "free",
            subscriptionStatus: "registered_free",
            premiumActive: false,
            entitlement: null
        };
    }

    const validUntilTime = row.valid_until ? new Date(row.valid_until).getTime() : 0;
    const isActive = row.status === "active" && (!validUntilTime || validUntilTime > Date.now());

    return {
        accessTier: isActive ? "premium" : "free",
        subscriptionStatus: isActive ? "premium_active" : row.status || "registered_free",
        premiumActive: isActive,
        entitlement: row
    };
}

async function recordCheckoutSession(data = {}) {
    if (!isSupabaseConfigured() || !data.customerId) {
        return {
            ok: false,
            skipped: true,
            reason: "supabase_not_configured_or_missing_customer"
        };
    }

    const body = {
        customer_id: data.customerId,
        plan_id: data.planId,
        preference_id: data.preferenceId,
        external_reference: data.externalReference,
        status: "created",
        provider: "mercado_pago",
        metadata: data.metadata || {}
    };

    return supabaseRequest("premium_checkout_sessions", {
        method: "POST",
        prefer: "return=representation",
        body
    });
}

async function updateCheckoutSessionFromPayment(payment = {}) {
    if (!isSupabaseConfigured()) {
        return {
            ok: false,
            skipped: true,
            reason: "supabase_not_configured"
        };
    }

    const preferenceId = payment.preference_id || "";
    const customerId = getCustomerIdFromPayment(payment);

    if (!preferenceId && !customerId) {
        return {
            ok: false,
            skipped: true,
            reason: "missing_checkout_reference"
        };
    }

    const filter = preferenceId
        ? `preference_id=eq.${encodeURIComponent(preferenceId)}`
        : `customer_id=eq.${encodeURIComponent(customerId)}`;

    return supabaseRequest(`premium_checkout_sessions?${filter}`, {
        method: "PATCH",
        prefer: "return=representation",
        body: {
            status: payment.status || "unknown",
            payment_id: String(payment.id || ""),
            provider_payload: payment
        }
    });
}

async function getPremiumStatus(customerId) {
    const normalizedCustomerId = sanitizeCustomerId(customerId);

    if (!normalizedCustomerId) {
        return {
            ok: false,
            configured: isSupabaseConfigured(),
            accessTier: "free",
            subscriptionStatus: "missing_customer_id",
            premiumActive: false,
            entitlement: null
        };
    }

    if (!isSupabaseConfigured()) {
        return {
            ok: true,
            configured: false,
            accessTier: "free",
            subscriptionStatus: "registered_free",
            premiumActive: false,
            entitlement: null
        };
    }

    const result = await supabaseRequest(
        `premium_entitlements?customer_id=eq.${encodeURIComponent(normalizedCustomerId)}&select=*`
    );

    if (!result.ok) {
        return {
            ok: false,
            configured: true,
            accessTier: "free",
            subscriptionStatus: "status_lookup_failed",
            premiumActive: false,
            entitlement: null,
            error: result.error
        };
    }

    const row = Array.isArray(result.data) ? result.data[0] : null;

    return {
        ok: true,
        configured: true,
        ...normalizeEntitlement(row)
    };
}

async function applyPaymentToEntitlement(payment = {}) {
    const customerId = getCustomerIdFromPayment(payment);
    const planId = getPlanIdFromPayment(payment);

    await updateCheckoutSessionFromPayment(payment);

    if (!isSupabaseConfigured()) {
        return {
            ok: false,
            skipped: true,
            status: "supabase_not_configured",
            customerId,
            planId
        };
    }

    if (!customerId) {
        return {
            ok: false,
            skipped: true,
            status: "missing_customer_id",
            customerId,
            planId
        };
    }

    if (payment.status !== "approved") {
        return {
            ok: true,
            skipped: true,
            status: `payment_${payment.status || "unknown"}`,
            customerId,
            planId
        };
    }

    const approvedAt = payment.date_approved || payment.date_created || new Date().toISOString();
    const validUntil = getValidUntil(planId, approvedAt);
    const preferenceId = payment.preference_id || "";

    const result = await supabaseRequest("premium_entitlements?on_conflict=customer_id", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        body: {
            customer_id: customerId,
            access_tier: "premium",
            status: "active",
            plan_id: planId,
            provider: "mercado_pago",
            payment_id: String(payment.id || ""),
            preference_id: String(preferenceId || ""),
            payer_email: payment.payer && payment.payer.email ? payment.payer.email : null,
            valid_until: validUntil,
            provider_payload: payment
        }
    });

    return {
        ok: result.ok,
        skipped: false,
        status: result.ok ? "premium_active" : "entitlement_upsert_failed",
        customerId,
        planId,
        validUntil,
        error: result.error
    };
}

module.exports = {
    sanitizeCustomerId,
    recordCheckoutSession,
    getPremiumStatus,
    applyPaymentToEntitlement,
    parseExternalReference
};
