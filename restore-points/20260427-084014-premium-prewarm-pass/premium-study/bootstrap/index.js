(function () {
    if (window.PremiumStudyBootstrap) {
        return;
    }

    const STYLE_ID = "premium-study-styles";
    const SCRIPT_MARK = "data-premium-study-src";
    const VERSION = "20260427-premium-aprender-6";
    const dependencies = [
        "premium-study/storage/indexeddb.js",
        "premium-study/services/access-control.js",
        "premium-study/services/identity.js",
        "premium-study/services/pdf-validator.js",
        "premium-study/services/pdf-text-extractor.js",
        "premium-study/services/pdf-ai-text.js",
        "premium-study/services/promotions.js",
        "premium-study/services/growth.js",
        "premium-study/services/billing.js",
        "premium-study/services/account.js",
        "premium-study/services/library.js",
        "premium-study/services/ai.js",
        "premium-study/services/pdf-workbench.js",
        "premium-study/state/store.js",
        "premium-study/router/index.js",
        "premium-study/ui/components/index.js",
        "premium-study/ui/views/index.js",
        "premium-study/app/index.js"
    ];
    let dependenciesPromise = null;

    function ensureStyle() {
        const existing = document.getElementById(STYLE_ID);
        if (existing && existing.dataset.premiumStudyVersion === VERSION) {
            return;
        }

        if (existing) {
            existing.remove();
        }

        const link = document.createElement("link");
        link.id = STYLE_ID;
        link.rel = "stylesheet";
        link.href = `premium-study/styles/premium-study.css?v=${VERSION}`;
        link.dataset.premiumStudyVersion = VERSION;
        document.head.appendChild(link);
    }

    function versionedSrc(src) {
        return src.includes("?")
            ? `${src}&v=${VERSION}`
            : `${src}?v=${VERSION}`;
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const actualSrc = versionedSrc(src);
            const existing = document.querySelector(`script[${SCRIPT_MARK}="${src}"][data-premium-study-version="${VERSION}"]`);
            if (existing) {
                if (existing.dataset.loaded === "true") {
                    resolve();
                    return;
                }

                existing.addEventListener("load", () => resolve(), { once: true });
                existing.addEventListener("error", () => reject(new Error(`Falha ao carregar ${src}`)), { once: true });
                return;
            }

            const script = document.createElement("script");
            script.src = actualSrc;
            script.defer = true;
            script.setAttribute(SCRIPT_MARK, src);
            script.dataset.premiumStudyVersion = VERSION;
            script.addEventListener("load", () => {
                script.dataset.loaded = "true";
                resolve();
            }, { once: true });
            script.addEventListener("error", () => reject(new Error(`Falha ao carregar ${src}`)), { once: true });
            document.body.appendChild(script);
        });
    }

    async function loadDependencies() {
        if (dependenciesPromise) {
            return dependenciesPromise;
        }

        dependenciesPromise = (async () => {
            ensureStyle();

            for (const dependency of dependencies) {
                await loadScript(dependency);
            }
        })();

        return dependenciesPromise;
    }

    window.PremiumStudyBootstrap = {
        async preload() {
            return loadDependencies();
        },

        async init(options = {}) {
            await loadDependencies();

            if (window.PremiumStudyApp && typeof window.PremiumStudyApp.init === "function") {
                window.PremiumStudyApp.init(options);
            }
        }
    };
})();
