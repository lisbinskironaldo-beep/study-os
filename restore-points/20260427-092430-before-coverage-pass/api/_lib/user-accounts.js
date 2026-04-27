const { isSupabaseConfigured, supabaseRequest } = require("./supabase");

function sanitizeUserId(value) {
    const userId = String(value || "").trim();

    if (!userId || userId.length > 160) {
        return "";
    }

    return /^[a-zA-Z0-9:_-]+$/.test(userId)
        ? userId
        : "";
}

function sanitizeCustomerId(value) {
    const customerId = String(value || "").trim();

    if (!customerId || customerId.length > 120) {
        return "";
    }

    return /^[a-zA-Z0-9:_-]+$/.test(customerId)
        ? customerId
        : "";
}

function buildUserId(provider = "google", providerUserId = "") {
    const normalizedProvider = String(provider || "").trim().toLowerCase();
    const normalizedProviderUserId = String(providerUserId || "").trim();

    if (!normalizedProvider || !normalizedProviderUserId) {
        return "";
    }

    return sanitizeUserId(
        `${normalizedProvider}:${normalizedProviderUserId}`
    );
}

async function upsertUserAccount(input = {}) {
    const userId = sanitizeUserId(input.userId);

    if (!isSupabaseConfigured() || !userId) {
        return {
            ok: false,
            skipped: true,
            reason: "supabase_not_configured_or_missing_user"
        };
    }

    return supabaseRequest("rotanota_user_accounts?on_conflict=user_id", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        body: {
            user_id: userId,
            provider: String(input.provider || "google").trim() || "google",
            provider_user_id: String(input.providerUserId || "").trim(),
            email: String(input.email || "").trim(),
            full_name: String(input.name || "").trim(),
            avatar_url: String(input.avatarUrl || "").trim(),
            last_seen_at: new Date().toISOString()
        }
    });
}

async function linkUserCustomer(userId, customerId, options = {}) {
    const normalizedUserId = sanitizeUserId(userId);
    const normalizedCustomerId = sanitizeCustomerId(customerId);

    if (
        !isSupabaseConfigured() ||
        !normalizedUserId ||
        !normalizedCustomerId
    ) {
        return {
            ok: false,
            skipped: true,
            reason: "supabase_not_configured_or_missing_link"
        };
    }

    const isPrimary = options.isPrimary !== false;
    const response = await supabaseRequest("rotanota_user_customer_links?on_conflict=user_id,customer_id", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        body: {
            user_id: normalizedUserId,
            customer_id: normalizedCustomerId,
            is_primary: isPrimary
        }
    });

    if (
        response.ok &&
        isPrimary
    ) {
        await supabaseRequest(
            `rotanota_user_customer_links?user_id=eq.${encodeURIComponent(normalizedUserId)}&customer_id=neq.${encodeURIComponent(normalizedCustomerId)}`,
            {
                method: "PATCH",
                prefer: "return=minimal",
                body: {
                    is_primary: false
                }
            }
        );
    }

    return response;
}

async function listLinkedCustomers(userId) {
    const normalizedUserId = sanitizeUserId(userId);

    if (!isSupabaseConfigured() || !normalizedUserId) {
        return [];
    }

    const response = await supabaseRequest(
        `rotanota_user_customer_links?user_id=eq.${encodeURIComponent(normalizedUserId)}&select=user_id,customer_id,is_primary,created_at&order=is_primary.desc,created_at.asc`
    );

    return response.ok && Array.isArray(response.data)
        ? response.data
        : [];
}

async function findPrimaryCustomer(userId) {
    const links = await listLinkedCustomers(userId);
    return links[0] || null;
}

async function findUserIdByCustomerId(customerId) {
    const normalizedCustomerId = sanitizeCustomerId(customerId);

    if (!isSupabaseConfigured() || !normalizedCustomerId) {
        return "";
    }

    const response = await supabaseRequest(
        `rotanota_user_customer_links?customer_id=eq.${encodeURIComponent(normalizedCustomerId)}&select=user_id,is_primary,created_at&order=is_primary.desc,created_at.asc&limit=1`
    );

    const row = response.ok && Array.isArray(response.data)
        ? response.data[0]
        : null;

    return row && row.user_id
        ? sanitizeUserId(row.user_id)
        : "";
}

async function syncUserPremiumRecords(userId, customerId) {
    const normalizedUserId = sanitizeUserId(userId);
    const normalizedCustomerId = sanitizeCustomerId(customerId);

    if (
        !isSupabaseConfigured() ||
        !normalizedUserId ||
        !normalizedCustomerId
    ) {
        return {
            ok: false,
            skipped: true,
            reason: "supabase_not_configured_or_missing_sync"
        };
    }

    const [entitlements, checkouts] = await Promise.all([
        supabaseRequest(
            `premium_entitlements?customer_id=eq.${encodeURIComponent(normalizedCustomerId)}`,
            {
                method: "PATCH",
                prefer: "return=minimal",
                body: {
                    user_id: normalizedUserId
                }
            }
        ),
        supabaseRequest(
            `premium_checkout_sessions?customer_id=eq.${encodeURIComponent(normalizedCustomerId)}`,
            {
                method: "PATCH",
                prefer: "return=minimal",
                body: {
                    user_id: normalizedUserId
                }
            }
        )
    ]);

    return {
        ok: Boolean(entitlements.ok || checkouts.ok),
        entitlements,
        checkouts
    };
}

module.exports = {
    sanitizeUserId,
    sanitizeCustomerId,
    buildUserId,
    upsertUserAccount,
    linkUserCustomer,
    listLinkedCustomers,
    findPrimaryCustomer,
    findUserIdByCustomerId,
    syncUserPremiumRecords
};
