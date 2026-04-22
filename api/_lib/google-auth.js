const {
    buildUserId,
    sanitizeCustomerId,
    upsertUserAccount,
    linkUserCustomer,
    syncUserPremiumRecords
} = require("./user-accounts");

function getGoogleClientId() {
    return String(
        process.env.GOOGLE_CLIENT_ID ||
        process.env.ROTANOTA_GOOGLE_CLIENT_ID ||
        ""
    ).trim();
}

function isGoogleAuthConfigured() {
    return Boolean(getGoogleClientId());
}

async function verifyGoogleCredential(credential) {
    const token = String(credential || "").trim();
    const clientId = getGoogleClientId();

    if (!token) {
        return {
            ok: false,
            status: "missing_credential",
            message: "Credencial Google ausente."
        };
    }

    if (!clientId) {
        return {
            ok: false,
            status: "missing_google_client_id",
            message: "GOOGLE_CLIENT_ID ainda nao configurado."
        };
    }

    let response;
    let payload;

    try {
        response = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`
        );
        payload = await response.json();
    } catch (_error) {
        return {
            ok: false,
            status: "google_unreachable",
            message: "Nao foi possivel validar o login Google agora."
        };
    }

    if (!response.ok) {
        return {
            ok: false,
            status: "google_token_invalid",
            message: payload && payload.error_description
                ? payload.error_description
                : "O token Google nao foi aceito."
        };
    }

    const issuer = String(payload.iss || "");
    const audience = String(payload.aud || "");
    const subject = String(payload.sub || "").trim();
    const expiresAt = Number(payload.exp || 0) * 1000;

    if (
        audience !== clientId ||
        !subject ||
        ![
            "accounts.google.com",
            "https://accounts.google.com"
        ].includes(issuer) ||
        !expiresAt ||
        expiresAt < Date.now()
    ) {
        return {
            ok: false,
            status: "google_claims_invalid",
            message: "A resposta do Google nao passou nas validacoes do servidor."
        };
    }

    const userId = buildUserId("google", subject);

    return {
        ok: true,
        status: "google_verified",
        user: {
            userId,
            provider: "google",
            providerUserId: subject,
            email: String(payload.email || "").trim(),
            emailVerified: String(payload.email_verified || "false") === "true",
            name: String(payload.name || "").trim(),
            picture: String(payload.picture || "").trim()
        }
    };
}

async function exchangeGoogleCredential(credential, options = {}) {
    const verification = await verifyGoogleCredential(credential);

    if (!verification.ok || !verification.user) {
        return verification;
    }

    const user = verification.user;
    const customerId = sanitizeCustomerId(
        options.customerId || ""
    );

    await upsertUserAccount({
        userId: user.userId,
        provider: user.provider,
        providerUserId: user.providerUserId,
        email: user.email,
        name: user.name,
        avatarUrl: user.picture
    });

    if (customerId) {
        await linkUserCustomer(
            user.userId,
            customerId,
            { isPrimary: true }
        );
        await syncUserPremiumRecords(
            user.userId,
            customerId
        );
    }

    return {
        ok: true,
        status: "google_login_success",
        user,
        customerId
    };
}

module.exports = {
    getGoogleClientId,
    isGoogleAuthConfigured,
    verifyGoogleCredential,
    exchangeGoogleCredential
};
