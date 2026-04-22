const { isSupabaseConfigured, supabaseRequest } = require("./supabase");
const {
    sanitizeUserId,
    sanitizeCustomerId,
    listLinkedCustomers,
    findUserIdByCustomerId
} = require("./user-accounts");

const PLAN_DURATIONS_DAYS = {
    premium_monthly: 31,
    premium_annual: 366
};

function sanitizePaymentId(value) {
    const paymentId = String(value || "").trim();

    if (!paymentId || paymentId.length > 120) {
        return "";
    }

    return /^[a-zA-Z0-9:_-]+$/.test(paymentId)
        ? paymentId
        : "";
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

function getUserIdFromPayment(payment = {}) {
    const metadata = getPaymentMetadata(payment);

    return sanitizeUserId(
        metadata.user_id ||
        metadata.userId ||
        ""
    );
}

function getPlanIdFromPayment(payment = {}) {
    const metadata = getPaymentMetadata(payment);
    const parsedReference = parseExternalReference(payment.external_reference);

    return metadata.plan_id ||
        metadata.planId ||
        parsedReference.planId ||
        "premium_monthly";
}

function getValidUntil(planId, approvedAt) {
    const days = PLAN_DURATIONS_DAYS[planId] || PLAN_DURATIONS_DAYS.premium_monthly;
    const baseDate = approvedAt
        ? new Date(approvedAt)
        : new Date();
    const validUntil = new Date(
        baseDate.getTime() +
        (days * 24 * 60 * 60 * 1000)
    );

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

    const validUntilTime = row.valid_until
        ? new Date(row.valid_until).getTime()
        : 0;
    const isActive = row.status === "active" &&
        (!validUntilTime || validUntilTime > Date.now());

    return {
        accessTier: isActive
            ? "premium"
            : "free",
        subscriptionStatus: isActive
            ? "premium_active"
            : row.status || "registered_free",
        premiumActive: isActive,
        entitlement: row
    };
}

function pickBestEntitlement(rows = []) {
    const list = Array.isArray(rows)
        ? rows.filter(Boolean)
        : [];

    if (!list.length) {
        return null;
    }

    const scored = list
        .map((row) => {
            const normalized = normalizeEntitlement(row);
            return {
                row,
                active: normalized.premiumActive,
                updatedAt: row.updated_at
                    ? new Date(row.updated_at).getTime()
                    : 0,
                validUntil: row.valid_until
                    ? new Date(row.valid_until).getTime()
                    : 0
            };
        })
        .sort((left, right) => {
            if (left.active !== right.active) {
                return left.active ? -1 : 1;
            }

            if (left.updatedAt !== right.updatedAt) {
                return right.updatedAt - left.updatedAt;
            }

            return right.validUntil - left.validUntil;
        });

    return scored[0].row;
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
        user_id: sanitizeUserId(data.userId || "") || null,
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
    const userId = getUserIdFromPayment(payment) || await findUserIdByCustomerId(customerId);

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
            user_id: userId || null,
            provider_payload: payment
        }
    });
}

async function fetchEntitlementRowsByCustomerIds(customerIds = []) {
    if (!isSupabaseConfigured() || !customerIds.length) {
        return [];
    }

    const ids = customerIds
        .map((value) => sanitizeCustomerId(value))
        .filter(Boolean);

    if (!ids.length) {
        return [];
    }

    const path = ids.length === 1
        ? `premium_entitlements?customer_id=eq.${encodeURIComponent(ids[0])}&select=*`
        : `premium_entitlements?customer_id=in.(${ids.map((value) => encodeURIComponent(value)).join(",")})&select=*`;
    const response = await supabaseRequest(path);

    return response.ok && Array.isArray(response.data)
        ? response.data
        : [];
}

async function getPremiumStatus(input = {}) {
    const customerId = typeof input === "string"
        ? sanitizeCustomerId(input)
        : sanitizeCustomerId(input.customerId || input.customer_id || "");
    const userId = typeof input === "object"
        ? sanitizeUserId(input.userId || input.user_id || "")
        : "";

    if (!customerId && !userId) {
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

    if (userId) {
        const directResponse = await supabaseRequest(
            `premium_entitlements?user_id=eq.${encodeURIComponent(userId)}&select=*`
        );
        const directRow = directResponse.ok && Array.isArray(directResponse.data)
            ? pickBestEntitlement(directResponse.data)
            : null;

        if (directRow) {
            return {
                ok: true,
                configured: true,
                ...normalizeEntitlement(directRow)
            };
        }

        const linkedCustomers = await listLinkedCustomers(userId);
        const linkedRows = await fetchEntitlementRowsByCustomerIds(
            linkedCustomers.map((row) => row.customer_id)
        );
        const linkedRow = pickBestEntitlement(linkedRows);

        if (linkedRow) {
            return {
                ok: true,
                configured: true,
                ...normalizeEntitlement(linkedRow)
            };
        }
    }

    if (!customerId) {
        return {
            ok: true,
            configured: true,
            accessTier: "free",
            subscriptionStatus: "registered_free",
            premiumActive: false,
            entitlement: null
        };
    }

    const result = await supabaseRequest(
        `premium_entitlements?customer_id=eq.${encodeURIComponent(customerId)}&select=*`
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

    const row = Array.isArray(result.data)
        ? result.data[0]
        : null;

    return {
        ok: true,
        configured: true,
        ...normalizeEntitlement(row)
    };
}

async function fetchMercadoPagoPayment(paymentId) {
    const normalizedPaymentId = sanitizePaymentId(paymentId);
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!normalizedPaymentId || !accessToken) {
        return {
            ok: false,
            payment: null,
            status: !normalizedPaymentId
                ? "missing_payment_id"
                : "missing_access_token"
        };
    }

    const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${encodeURIComponent(normalizedPaymentId)}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    if (!response.ok) {
        return {
            ok: false,
            payment: null,
            status: "payment_lookup_failed"
        };
    }

    return {
        ok: true,
        payment: await response.json(),
        status: "payment_loaded"
    };
}

async function reconcilePaymentById(paymentId) {
    const normalizedPaymentId = sanitizePaymentId(paymentId);

    if (!normalizedPaymentId) {
        return {
            ok: false,
            skipped: true,
            status: "missing_payment_id",
            customerId: "",
            planId: "",
            userId: ""
        };
    }

    const paymentResult = await fetchMercadoPagoPayment(normalizedPaymentId);

    if (!paymentResult.ok || !paymentResult.payment) {
        return {
            ok: false,
            skipped: false,
            status: paymentResult.status || "payment_lookup_failed",
            customerId: "",
            planId: "",
            userId: ""
        };
    }

    const payment = paymentResult.payment;
    const activation = await applyPaymentToEntitlement(payment);

    return {
        ok: Boolean(activation && activation.ok),
        skipped: Boolean(activation && activation.skipped),
        status: activation && activation.status
            ? activation.status
            : "payment_reconciled",
        customerId: activation && activation.customerId
            ? activation.customerId
            : getCustomerIdFromPayment(payment),
        userId: activation && activation.userId
            ? activation.userId
            : getUserIdFromPayment(payment),
        planId: activation && activation.planId
            ? activation.planId
            : getPlanIdFromPayment(payment),
        paymentStatus: payment.status || "",
        payment
    };
}

async function applyPaymentToEntitlement(payment = {}) {
    const customerId = getCustomerIdFromPayment(payment);
    const planId = getPlanIdFromPayment(payment);
    const userId = getUserIdFromPayment(payment) || await findUserIdByCustomerId(customerId);

    await updateCheckoutSessionFromPayment(payment);

    if (!isSupabaseConfigured()) {
        return {
            ok: false,
            skipped: true,
            status: "supabase_not_configured",
            customerId,
            userId,
            planId
        };
    }

    if (!customerId) {
        return {
            ok: false,
            skipped: true,
            status: "missing_customer_id",
            customerId,
            userId,
            planId
        };
    }

    if (payment.status !== "approved") {
        return {
            ok: true,
            skipped: true,
            status: `payment_${payment.status || "unknown"}`,
            customerId,
            userId,
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
            user_id: userId || null,
            access_tier: "premium",
            status: "active",
            plan_id: planId,
            provider: "mercado_pago",
            payment_id: String(payment.id || ""),
            preference_id: String(preferenceId || ""),
            payer_email: payment.payer && payment.payer.email
                ? payment.payer.email
                : null,
            valid_until: validUntil,
            provider_payload: payment
        }
    });

    return {
        ok: result.ok,
        skipped: false,
        status: result.ok
            ? "premium_active"
            : "entitlement_upsert_failed",
        customerId,
        userId,
        planId,
        validUntil,
        error: result.error
    };
}

module.exports = {
    sanitizeCustomerId,
    sanitizeUserId,
    sanitizePaymentId,
    recordCheckoutSession,
    getPremiumStatus,
    applyPaymentToEntitlement,
    parseExternalReference,
    reconcilePaymentById
};
