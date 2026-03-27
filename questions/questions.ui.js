window.QuestionsUI = {
    page: null,
    floatingSessionState: {
        minimized: false,
        maximized: false,
        left: "",
        top: "",
        width: "",
        height: "",
        dragOffsetX: 0,
        dragOffsetY: 0,
        dragging: false
    },
    floatingSessionZIndex: 1450,

    init(page) {
        this.page = page;
    },

    render() {
        if (!this.page) {
            return;
        }

        const launcher =
            document.getElementById(
                "questionsLauncher"
            );
        const session =
            document.getElementById(
                "questionsSession"
            );
        const statsPanel =
            document.getElementById(
                "questionsStatsPanel"
            );

        if (
            !launcher ||
            !session ||
            !statsPanel
        ) {
            return;
        }

        const phase =
            QuestionsState.getPhase();
        const launcherView =
            QuestionsState.getLauncherView();
        const root =
            document.querySelector(
                ".questions-root"
            );

        launcher.hidden =
            phase !== "launcher";
        session.hidden =
            phase !== "session";

        this.teardownFloatingSession();

        if (phase === "launcher") {
            launcher.innerHTML =
                this.renderLauncher();
            session.innerHTML = "";
        } else {
            session.innerHTML =
                this.renderSession();
            launcher.innerHTML = "";
        }

        const shouldShowStats =
            this.page.data.bankStatus ===
                "ready" &&
            launcherView === "specific";

        if (root) {
            root.classList.toggle(
                "questions-root--single",
                !shouldShowStats
            );
        }

        statsPanel.hidden =
            !shouldShowStats;
        statsPanel.innerHTML =
            shouldShowStats
                ? this.renderStatsPanel()
                : "";

        this.bindLauncher();
        this.bindSession();
    },

    renderFloatingSessionHint() {
        return `
            <section class="questions-card questions-floating-hint">
                <div class="questions-kicker">Sessao ativa</div>
                <h2>Janela flutuante aberta</h2>
                <p>As questoes continuam em uma janela livre para arrastar, minimizar, redimensionar ou maximizar enquanto voce usa o resto do site.</p>
                <div class="questions-entry-actions">
                    <button id="questionsFloatingFocusBtn" class="questions-secondary-btn" type="button">Trazer para frente</button>
                    <button id="questionsFloatingPauseBtn" class="questions-secondary-btn" type="button">Pausar treino</button>
                </div>
            </section>
        `;
    },

    renderFloatingSessionShell(
        content = ""
    ) {
        return `
            <section id="questionsFloatingWindow" class="questions-floating-window" aria-label="Janela flutuante de questoes">
                <div class="questions-floating-header" data-questions-float-drag="true">
                    <div class="questions-floating-copy">
                        <div class="questions-floating-kicker">Treino ativo</div>
                        <div class="questions-floating-title">Questoes</div>
                    </div>
                    <div class="questions-floating-actions">
                        <button id="questionsFloatingMinBtn" type="button" title="Minimizar">_</button>
                        <button id="questionsFloatingMaxBtn" type="button" title="Maximizar">[]</button>
                        <button id="questionsFloatingCloseBtn" type="button" title="Pausar e fechar">x</button>
                    </div>
                </div>
                <div id="questionsFloatingBody" class="questions-floating-body">
                    ${content}
                </div>
            </section>
        `;
    },

    mountFloatingSession(content) {
        const root =
            document.getElementById(
                "utilityRoot"
            );

        if (!root) {
            return false;
        }

        let panel =
            document.getElementById(
                "questionsFloatingWindow"
            );

        if (!panel) {
            root.insertAdjacentHTML(
                "beforeend",
                this.renderFloatingSessionShell(
                    content
                )
            );
            panel =
                document.getElementById(
                    "questionsFloatingWindow"
                );

            if (!panel) {
                return false;
            }

            if (
                !this.floatingSessionState.left ||
                !this.floatingSessionState.top
            ) {
                this.setFloatingSessionDefaultPosition(
                    panel
                );
            }

            if (
                !this.floatingSessionState
                    .width
            ) {
                panel.style.width =
                    `${Math.min(
                        720,
                        Math.max(
                            420,
                            window.innerWidth -
                                48
                        )
                    )}px`;
            }

            if (
                !this.floatingSessionState
                    .height
            ) {
                panel.style.height =
                    `${Math.min(
                        860,
                        Math.max(
                            420,
                            window.innerHeight -
                                132
                        )
                    )}px`;
            }

            if (
                this.floatingSessionState
                    .width
            ) {
                panel.style.width =
                    this.floatingSessionState.width;
            }

            if (
                this.floatingSessionState
                    .height
            ) {
                panel.style.height =
                    this.floatingSessionState.height;
            }
        } else {
            const body =
                document.getElementById(
                    "questionsFloatingBody"
                );

            if (body) {
                body.innerHTML = content;
            }
        }

        this.syncFloatingSessionPanel();
        this.bringFloatingSessionToFront();
        return true;
    },

    teardownFloatingSession() {
        const panel =
            document.getElementById(
                "questionsFloatingWindow"
            );

        if (panel) {
            panel.remove();
        }

        this.floatingSessionState.dragging =
            false;
        document.removeEventListener(
            "pointermove",
            this.handleFloatingPointerMove
        );
        document.removeEventListener(
            "pointerup",
            this.handleFloatingPointerUp
        );
    },

    syncFloatingSessionPanel() {
        const panel =
            document.getElementById(
                "questionsFloatingWindow"
            );
        const minButton =
            document.getElementById(
                "questionsFloatingMinBtn"
            );
        const maxButton =
            document.getElementById(
                "questionsFloatingMaxBtn"
            );

        if (!panel) {
            return;
        }

        panel.classList.toggle(
            "is-minimized",
            this.floatingSessionState
                .minimized
        );
        panel.classList.toggle(
            "is-maximized",
            this.floatingSessionState
                .maximized
        );

        if (minButton) {
            minButton.textContent =
                this.floatingSessionState
                    .minimized
                    ? "+"
                    : "_";
        }

        if (maxButton) {
            maxButton.textContent =
                this.floatingSessionState
                    .maximized
                    ? "<>"
                    : "[]";
        }
    },

    setFloatingSessionDefaultPosition(
        panel
    ) {
        const width =
            panel.offsetWidth || 560;
        const left =
            Math.max(
                16,
                window.innerWidth -
                    width -
                    36
            );
        const top = 88;

        panel.style.left = `${left}px`;
        panel.style.top = `${top}px`;
        panel.style.right = "auto";
        this.persistFloatingSessionBounds(
            panel
        );
    },

    persistFloatingSessionBounds(
        panel = null
    ) {
        const target =
            panel ||
            document.getElementById(
                "questionsFloatingWindow"
            );

        if (!target) {
            return;
        }

        this.floatingSessionState.left =
            target.style.left || "";
        this.floatingSessionState.top =
            target.style.top || "";
        this.floatingSessionState.width =
            target.style.width || "";
        this.floatingSessionState.height =
            target.style.height || "";
    },

    bringFloatingSessionToFront() {
        const panel =
            document.getElementById(
                "questionsFloatingWindow"
            );

        if (!panel) {
            return;
        }

        this.floatingSessionZIndex += 1;
        panel.style.zIndex = String(
            this.floatingSessionZIndex
        );
    },

    bindFloatingSession() {
        const panel =
            document.getElementById(
                "questionsFloatingWindow"
            );
        const focusBtn =
            document.getElementById(
                "questionsFloatingFocusBtn"
            );
        const pauseBtn =
            document.getElementById(
                "questionsFloatingPauseBtn"
            );

        focusBtn?.addEventListener(
            "click",
            () => {
                this.floatingSessionState.minimized =
                    false;
                this.syncFloatingSessionPanel();
                this.bringFloatingSessionToFront();
            }
        );

        pauseBtn?.addEventListener(
            "click",
            () => {
                this.page.pauseSession();
            }
        );

        if (!panel || panel.dataset.bound) {
            return;
        }

        panel.dataset.bound = "true";
        this.handleFloatingPointerMove =
            (event) => {
                if (
                    !this.floatingSessionState
                        .dragging
                ) {
                    return;
                }

                const target =
                    document.getElementById(
                        "questionsFloatingWindow"
                    );

                if (
                    !target ||
                    this.floatingSessionState
                        .maximized
                ) {
                    return;
                }

                const nextLeft =
                    event.clientX -
                    this
                        .floatingSessionState
                        .dragOffsetX;
                const nextTop =
                    event.clientY -
                    this
                        .floatingSessionState
                        .dragOffsetY;
                target.style.left =
                    `${Math.max(
                        12,
                        Math.min(
                            nextLeft,
                            window.innerWidth -
                                target.offsetWidth -
                                12
                        )
                    )}px`;
                target.style.top =
                    `${Math.max(
                        12,
                        Math.min(
                            nextTop,
                            window.innerHeight -
                                target.offsetHeight -
                                12
                        )
                    )}px`;
            };
        this.handleFloatingPointerUp =
            () => {
                if (
                    !this.floatingSessionState
                        .dragging
                ) {
                    return;
                }

                this.floatingSessionState.dragging =
                    false;
                panel.classList.remove(
                    "is-dragging"
                );
                this.persistFloatingSessionBounds();
                document.removeEventListener(
                    "pointermove",
                    this.handleFloatingPointerMove
                );
                document.removeEventListener(
                    "pointerup",
                    this.handleFloatingPointerUp
                );
            };

        panel.addEventListener(
            "pointerdown",
            () => {
                this.bringFloatingSessionToFront();
            }
        );

        panel
            .querySelector(
                "[data-questions-float-drag]"
            )
            ?.addEventListener(
                "pointerdown",
                (event) => {
                    if (
                        event.target.closest(
                            "button"
                        ) ||
                        this
                            .floatingSessionState
                            .maximized
                    ) {
                        return;
                    }

                    const rect =
                        panel.getBoundingClientRect();
                    this.floatingSessionState.dragging =
                        true;
                    this.floatingSessionState.dragOffsetX =
                        event.clientX -
                        rect.left;
                    this.floatingSessionState.dragOffsetY =
                        event.clientY -
                        rect.top;

                    panel.classList.add(
                        "is-dragging"
                    );
                    document.addEventListener(
                        "pointermove",
                        this.handleFloatingPointerMove
                    );
                    document.addEventListener(
                        "pointerup",
                        this.handleFloatingPointerUp
                    );
                }
            );

        document
            .getElementById(
                "questionsFloatingMinBtn"
            )
            ?.addEventListener(
                "click",
                () => {
                    this.floatingSessionState.minimized =
                        !this
                            .floatingSessionState
                            .minimized;
                    this.syncFloatingSessionPanel();
                }
            );

        document
            .getElementById(
                "questionsFloatingMaxBtn"
            )
            ?.addEventListener(
                "click",
                () => {
                    this.floatingSessionState.maximized =
                        !this
                            .floatingSessionState
                            .maximized;
                    this.floatingSessionState.minimized =
                        false;

                    if (
                        !this
                            .floatingSessionState
                            .maximized
                    ) {
                        this.persistFloatingSessionBounds(
                            panel
                        );
                    }

                    this.syncFloatingSessionPanel();
                }
            );

        document
            .getElementById(
                "questionsFloatingCloseBtn"
            )
            ?.addEventListener(
                "click",
                () => {
                    this.page.pauseSession();
                }
            );

        panel.addEventListener(
            "mouseup",
            () => {
                this.persistFloatingSessionBounds(
                    panel
                );
            }
        );
    },

    renderLoading() {
        return `
            <section class="questions-card questions-card-loading">
                <div class="questions-kicker">Questions</div>
                <h2>Carregando modulo escolar</h2>
                <p>Preparando banco, launcher e contexto do treino.</p>
            </section>
        `;
    },

    renderChecklist(checklist) {
        return `
            <div class="questions-checklist">
                ${checklist.map((item) => `
                    <article class="questions-check-item${item.done ? " is-done" : ""}">
                        <div class="questions-check-icon">${item.done ? "OK" : "..."}</div>
                        <div>
                            <strong>${item.label}</strong>
                            <span>${item.detail}</span>
                        </div>
                    </article>
                `).join("")}
            </div>
        `;
    },

    renderLauncher() {
        const launcherView =
            QuestionsState.getLauncherView();

        if (launcherView === "smart") {
            return this.renderSmartLauncher();
        }

        if (launcherView === "smart_start") {
            return this.renderSmartStart();
        }

        if (
            launcherView ===
            "smart_subjects"
        ) {
            return this.renderSmartSubjects();
        }

        if (launcherView === "specific") {
            return this.renderSpecificLauncher();
        }

        if (
            launcherView ===
            "smart_profiles"
        ) {
            return this.renderSmartProfilesLauncher();
        }

        if (launcherView === "saved") {
            return this.renderSavedLauncher();
        }

        if (launcherView === "resume") {
            return this.renderResumeLauncher();
        }

        return this.renderLauncherHome();
    },

    renderLauncherHome() {
        const page =
            this.page;
        const bankStatus =
            page.data.bankStatus;
        const isLoading =
            bankStatus === "loading";
        const isError =
            bankStatus === "error";
        const launcherNotice =
            isError
                ? page.getRuntimeNotice()
                : isLoading
                    ? "Preparando o banco escolar para liberar o treino."
                    : page.getRuntimeNotice();

        const recentRuns =
            QuestionsStore.getRuns({
                status: "in_progress"
            });
        const savedBlocks =
            QuestionsStore.getSavedBlocks();

        return `
            <section class="questions-card questions-entry-card">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Questions</div>
                        <h2>Escolha o caminho</h2>
                        <p>Entre rapido e deixe o detalhe para depois.</p>
                    </div>

                    <div class="questions-entry-actions">
                        <button id="questionsModuleBackBtn" class="questions-secondary-btn" type="button">Voltar</button>
                    </div>
                </div>

                ${launcherNotice ? `
                    <div class="questions-inline-notice">
                        ${launcherNotice}
                    </div>
                ` : ""}

                <div class="questions-entry-grid">
                    <article class="questions-entry-option questions-entry-option-smart">
                        <div class="questions-entry-copy">
                            <h3>Treino inteligente</h3>
                            <p>O sistema organiza o bloco com poucas escolhas.</p>
                        </div>
                        <button class="questions-primary-btn" type="button" data-launcher-view="smart_start" ${isLoading || isError ? "disabled" : ""}>
                            ${isLoading ? "Preparando..." : isError ? "Indisponivel" : "Comecar"}
                        </button>
                    </article>

                    <article class="questions-entry-option">
                        <div class="questions-entry-copy">
                            <h3>Especificar treino</h3>
                            <p>Voce escolhe exatamente o recorte da sessao.</p>
                        </div>
                        <button class="questions-secondary-btn" type="button" data-launcher-view="specific" ${isLoading || isError ? "disabled" : ""}>
                            ${isLoading ? "Preparando..." : isError ? "Indisponivel" : "Abrir"}
                        </button>
                    </article>

                    <article class="questions-entry-option">
                        <div class="questions-entry-copy">
                            <h3>Guardados</h3>
                            <p>${savedBlocks.length ? `${savedBlocks.length} treino(s) salvo(s) para consultar, duplicar ou refazer.` : "Seus treinos guardados ficam aqui."}</p>
                        </div>
                        <button class="questions-secondary-btn" type="button" data-launcher-view="saved">
                            Abrir
                        </button>
                    </article>
                </div>

                <div class="questions-entry-footer">
                    <button class="questions-secondary-btn" type="button" data-launcher-view="resume">
                        Retomar treino${recentRuns.length ? ` (${recentRuns.length})` : ""}
                    </button>
                </div>
            </section>
        `;
    },

    renderSmartStart() {
        const page =
            this.page;

        if (
            page.data.bankStatus ===
            "loading"
        ) {
            return this.renderLoading();
        }

        if (
            page.data.bankStatus ===
            "error"
        ) {
            return `
                <section class="questions-card questions-card-loading">
                    <div class="questions-kicker">Questions</div>
                    <h2>Banco escolar indisponivel</h2>
                    <p>${page.getRuntimeNotice()}</p>
                </section>
            `;
        }

        const startOptions =
            page.getSmartStartOptions();
        const activeCount =
            startOptions.filter(
                (item) =>
                    item.active &&
                    !item.disabled
            ).length;
        const allAvailableActive =
            startOptions
                .filter(
                    (item) => !item.disabled
                )
                .every((item) => item.active);
        const petalClasses = [
            "questions-smart-petal-1",
            "questions-smart-petal-2",
            "questions-smart-petal-3",
            "questions-smart-petal-4"
        ];
        const coachHint =
            page.shouldShowCoachHint(
                "smart_start"
            )
                ? page.getCoachHintText(
                    "smart_start"
                )
                : "";

        return `
            <section class="questions-card questions-entry-subview questions-smart-start-card">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Treino inteligente</div>
                        <div class="questions-smart-step">1/3</div>
                    </div>

                    <div class="questions-entry-actions">
                        <button class="questions-secondary-btn" type="button" data-launcher-view="home">Voltar</button>
                    </div>
                </div>

                ${page.getRuntimeNotice() ? `
                    <div class="questions-inline-notice">
                        ${page.getRuntimeNotice()}
                    </div>
                ` : ""}

                ${coachHint ? `
                    <div class="questions-smart-coach" style="--coach-steps: ${Math.max(coachHint.length, 24)}">
                        <span>${coachHint}</span>
                    </div>
                ` : ""}

                <div class="questions-smart-start-shell">
                    <div class="questions-smart-ring${allAvailableActive ? " is-active" : ""}"></div>
                    <button id="questionsSmartSelectAllBtn" class="questions-smart-ring-toggle${allAvailableActive ? " is-active" : ""}" type="button">
                        ${allAvailableActive ? "Desmarcar" : "Marcar todas"}
                    </button>

                    <div class="questions-smart-orbit">
                        <div class="questions-smart-orbit-grid">
                            ${startOptions.map((item, index) => `
                                <button
                                    class="questions-smart-node questions-smart-petal ${petalClasses[index] || ""}${item.active ? " is-active" : ""}${item.disabled ? " is-disabled" : ""}"
                                    type="button"
                                    data-smart-start-option="${item.key}"
                                    ${item.disabled ? "" : ""}
                                >
                                    <div class="questions-smart-node-copy">
                                        <strong>${item.label}</strong>
                                        <span>${item.note}</span>
                                    </div>
                                </button>
                            `).join("")}
                        </div>

                        <button id="questionsSmartContinueBtn" class="questions-smart-core${activeCount ? " is-ready" : ""}" type="button" ${activeCount ? "" : "disabled"}>
                            <strong>Ir</strong>
                            <span></span>
                        </button>
                    </div>
                </div>

                <div class="questions-entry-footer">
                    <button class="questions-secondary-btn" type="button" data-launcher-view="specific">
                        Ir para especificar treino
                    </button>
                    <button class="questions-secondary-btn" type="button" data-launcher-view="saved">
                        Guardados
                    </button>
                    <button class="questions-secondary-btn" type="button" data-launcher-view="resume">
                        Retomar treino
                    </button>
                </div>
            </section>
        `;
    },

    renderSmartSubjects() {
        const page =
            this.page;

        if (
            page.data.bankStatus ===
            "loading"
        ) {
            return this.renderLoading();
        }

        if (
            page.data.bankStatus ===
            "error"
        ) {
            return `
                <section class="questions-card questions-card-loading">
                    <div class="questions-kicker">Questions</div>
                    <h2>Banco escolar indisponivel</h2>
                    <p>${page.getRuntimeNotice()}</p>
                </section>
            `;
        }

        const subjectOptions =
            page.getSmartSubjectOptions();
        const activeCount =
            subjectOptions.filter(
                (item) => item.active
            ).length;
        const allActive =
            subjectOptions.length > 0 &&
            subjectOptions.every(
                (item) => item.active
            );
        const visibleSubjects =
            subjectOptions.slice(0, 12);
        const totalSubjects =
            visibleSubjects.length || 1;

        return `
            <section class="questions-card questions-entry-subview questions-smart-start-card questions-smart-subject-card">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Treino inteligente</div>
                        <div class="questions-smart-step">2/3</div>
                    </div>

                    <div class="questions-entry-actions">
                        <button class="questions-secondary-btn" type="button" data-launcher-view="smart_start">Voltar</button>
                    </div>
                </div>

                ${page.getRuntimeNotice() ? `
                    <div class="questions-inline-notice">
                        ${page.getRuntimeNotice()}
                    </div>
                ` : ""}

                ${subjectOptions.length ? `
                    <div class="questions-smart-start-shell">
                        <div class="questions-smart-ring${allActive ? " is-active" : ""}"></div>
                        <button id="questionsSmartSubjectsSelectAllBtn" class="questions-smart-ring-toggle${allActive ? " is-active" : ""}" type="button">
                            ${allActive ? "Desmarcar" : "Marcar todas"}
                        </button>

                        <div class="questions-smart-subject-orbit" style="--questions-smart-subject-count: ${totalSubjects};">
                            <div class="questions-smart-subject-grid">
                                ${visibleSubjects.map((item, index) => `
                                    <button
                                        class="questions-smart-node questions-smart-subject-node${item.active ? " is-active" : ""}"
                                        type="button"
                                        style="--questions-smart-node-transform: translate(-50%, -50%) rotate(${(-90 + ((360 / totalSubjects) * index)).toFixed(2)}deg) translateY(calc(var(--questions-smart-subject-radius, 248px) * -1)) rotate(${(90 - ((360 / totalSubjects) * index)).toFixed(2)}deg);"
                                        data-smart-subject-option="${item.key}"
                                    >
                                        <div class="questions-smart-node-copy">
                                            <strong>${item.label}</strong>
                                            <span>${item.topicCount} assunto(s)</span>
                                        </div>
                                    </button>
                                `).join("")}
                            </div>

                            <button id="questionsSmartSubjectsContinueBtn" class="questions-smart-core${activeCount ? " is-ready" : ""}" type="button" ${activeCount ? "" : "disabled"}>
                                <strong>Ir</strong>
                                <span></span>
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="questions-empty-inline">
                        Nenhuma materia ficou disponivel com as series ativas. Volte e ajuste a selecao.
                    </div>
                `}

                <div class="questions-entry-footer">
                    <button class="questions-secondary-btn" type="button" data-launcher-view="specific">
                        Ir para especificar treino
                    </button>
                    <button class="questions-secondary-btn" type="button" data-launcher-view="saved">
                        Guardados
                    </button>
                    <button class="questions-secondary-btn" type="button" data-launcher-view="resume">
                        Retomar treino
                    </button>
                </div>
            </section>
        `;
    },

    renderSmartLauncher() {
        const page =
            this.page;

        if (
            page.data.bankStatus ===
            "loading"
        ) {
            return this.renderLoading();
        }

        if (
            page.data.bankStatus ===
            "error"
        ) {
            return `
                <section class="questions-card questions-card-loading">
                    <div class="questions-kicker">Questions</div>
                    <h2>Banco escolar indisponivel</h2>
                    <p>${page.getRuntimeNotice()}</p>
                </section>
            `;
        }

        const ctx =
            QuestionsContext.get();
        const goalOptions =
            QuestionsService.getSmartGoalOptions(
                page
            );
        const preview =
            page.buildSmartRoutePreview();
        const amountOptions =
            page.data.amountOptions;
        const smartProfiles =
            QuestionsStore.getSmartProfiles();
        const savedBlocks =
            QuestionsStore.getSavedBlocks();
        const activeSeries =
            page.getSmartStartOptions()
                .filter(
                    (item) =>
                        item.type === "serie" &&
                        item.active &&
                        !item.disabled
                );
        const activeSubjects =
            page.getSmartSubjectOptions().filter(
                (item) => item.active
            );
        const hiddenSubjectCount =
            Math.max(
                activeSubjects.length - 6,
                0
            );
        const visibleTopics =
            preview.isReady
                ? preview.topics.slice(0, 5)
                : [];
        const hiddenTopicCount =
            preview.isReady
                ? Math.max(
                    preview.topics.length -
                        visibleTopics.length,
                    0
                )
                : 0;

        return `
            <section class="questions-card questions-entry-subview questions-smart-final-card">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Treino inteligente</div>
                        <div class="questions-smart-step">3/3</div>
                        <h2>Pronto para comecar</h2>
                    </div>

                    <div class="questions-entry-actions">
                        <button class="questions-secondary-btn questions-review-btn" type="button" data-launcher-view="smart_subjects">Conferir</button>
                    </div>
                </div>

                ${page.getRuntimeNotice() ? `
                    <div class="questions-inline-notice">
                        ${page.getRuntimeNotice()}
                    </div>
                ` : ""}

                ${preview.isReady ? `
                    <section class="questions-smart-final-launch">
                        <div class="questions-smart-final-launch-head">
                            <span class="questions-panel-label">Bloco pronto</span>
                            <strong>${preview.goal?.label || "Treino inteligente"}</strong>
                        </div>
                        <button id="questionsSmartStartBtn" class="questions-smart-start-hero-btn" type="button">
                            Comecar agora
                        </button>
                        <div class="questions-smart-final-stats">
                            <span>${activeSeries.length} serie(s)</span>
                            <span>${activeSubjects.length} materia(s)</span>
                            <span>${preview.topics.length} assunto(s)</span>
                            <span>${preview.eligibleQuestionCount || preview.availableCount || 0} questoes</span>
                            <span>${preview.estimatedDuration}</span>
                        </div>
                    </section>

                    <article class="questions-route-card questions-smart-final-hero">
                        <div class="questions-route-stack">
                            <div class="questions-summary-label">Recorte</div>
                            <div class="questions-static-tokens">
                                ${activeSeries.map((item) => `
                                    <span class="questions-static-token">${item.label}</span>
                                `).join("")}
                                ${activeSubjects.slice(0, 4).map((item) => `
                                    <span class="questions-static-token">${item.label}</span>
                                `).join("")}
                                ${hiddenSubjectCount ? `
                                    <span class="questions-static-token questions-static-token-muted">+${hiddenSubjectCount} materias</span>
                                ` : ""}
                            </div>
                        </div>

                        <div class="questions-route-stack">
                            <div class="questions-summary-label">Assuntos</div>
                            <div class="questions-static-tokens">
                                ${visibleTopics.map((topic) => `
                                    <span class="questions-static-token${preview.focusLabel === topic.label ? " is-focus" : ""}">
                                        ${topic.label}
                                    </span>
                                `).join("")}
                                ${hiddenTopicCount ? `
                                    <span class="questions-static-token questions-static-token-muted">+${hiddenTopicCount}</span>
                                ` : ""}
                            </div>
                        </div>
                    </article>
                ` : `
                    <div class="questions-issue-list">
                        ${(preview.issues || [preview.reason]).map((issue) => `
                            <div class="questions-issue-item">${issue}</div>
                        `).join("")}
                    </div>
                `}

                <article class="questions-panel questions-smart-final-quick">
                    <div class="questions-smart-final-quick-row">
                        <div class="questions-panel-label">Objetivo</div>
                        <div class="questions-inline-grid questions-smart-final-pills">
                            ${goalOptions.map((goal) => `
                                <button class="questions-pill${ctx.smartGoal === goal.key ? " is-active" : ""}" type="button" data-smart-goal="${goal.key}">
                                    ${goal.label}
                                </button>
                            `).join("")}
                        </div>
                    </div>

                    <div class="questions-smart-final-quick-row">
                        <div class="questions-panel-label">Quantidade</div>
                        <div class="questions-inline-grid questions-smart-final-pills">
                            ${amountOptions.map((amount) => `
                                <button class="questions-pill${ctx.quantidadeQuestoes === amount ? " is-active" : ""}" type="button" data-amount="${amount}">
                                    ${amount}
                                </button>
                            `).join("")}
                        </div>
                    </div>
                </article>

                <div class="questions-smart-final-actions">
                    <button id="questionsSmartClearExclusionsFooterBtn" class="questions-secondary-btn" type="button">
                        Limpar recorte
                    </button>
                    <button id="questionsSmartSaveProfileBtn" class="questions-secondary-btn" type="button">
                        Salvar perfil
                    </button>
                    <button id="questionsSmartSaveBlockBtn" class="questions-secondary-btn" type="button" ${preview.isReady ? "" : "disabled"}>
                        Guardar treino
                    </button>
                </div>

                <div class="questions-entry-footer">
                    <button class="questions-secondary-btn" type="button" data-launcher-view="smart_profiles">
                        Perfis salvos${smartProfiles.length ? ` (${smartProfiles.length})` : ""}
                    </button>
                    <button class="questions-secondary-btn" type="button" data-launcher-view="saved">
                        Blocos salvos${savedBlocks.length ? ` (${savedBlocks.length})` : ""}
                    </button>
                    <button class="questions-secondary-btn" type="button" data-launcher-view="specific">
                        Ir para especificar treino
                    </button>
                </div>
            </section>
        `;
    },

    renderSmartProfilesLauncher() {
        const page =
            this.page;
        const profiles =
            QuestionsStore.getSmartProfiles();
        const subjects =
            QuestionsService.getSubjectOptions(
                page
            );

        return `
            <section class="questions-card questions-entry-subview">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Perfis inteligentes</div>
                        <h2>Recortes reutilizaveis do treino inteligente</h2>
                        <p>Use perfis para guardar objetivo, exclusoes e tamanho preferido do bloco sem precisar montar tudo de novo.</p>
                    </div>

                    <div class="questions-entry-actions">
                        <button class="questions-secondary-btn" type="button" data-launcher-view="smart">Voltar</button>
                    </div>
                </div>

                ${page.getRuntimeNotice() ? `
                    <div class="questions-inline-notice">
                        ${page.getRuntimeNotice()}
                    </div>
                ` : ""}

                <div class="questions-entry-footer">
                    <button id="questionsSmartSaveProfileFromLibraryBtn" class="questions-primary-btn" type="button">
                        Salvar perfil atual
                    </button>
                </div>

                ${profiles.length ? `
                    <div class="questions-profile-list">
                        ${profiles.map((profile) => {
                            const excludedSubjects =
                                (profile.excludedSubjects || [])
                                    .map((subjectKey) =>
                                        subjects.find((subject) =>
                                            subject.key === subjectKey
                                        )?.label || ""
                                    )
                                    .filter(Boolean);
                            const tags = [
                                page.data.smartGoals?.[
                                    profile.smartGoal
                                ]?.label || "Continuar",
                                profile.preferredAmount
                                    ? `${profile.preferredAmount} questoes`
                                    : "",
                                ...(profile.excludedSeries || []).map((serie) => `${serie}a serie fora`),
                                ...(profile.excludedBases || []).map((base) => `${base} fora`),
                                ...excludedSubjects.map((label) => `${label} fora`)
                            ].filter(Boolean);

                            return `
                                <article class="questions-profile-item">
                                    <div class="questions-profile-copy">
                                        <strong>${profile.name}</strong>
                                        <span>Criado em ${this.formatDate(profile.createdAt)}${profile.lastUsedAt ? ` | usado ${this.formatDate(profile.lastUsedAt)}` : ""}</span>
                                        ${tags.length ? `
                                            <div class="questions-badge-row">
                                                ${tags.map((tag) => `
                                                    <span class="questions-badge questions-badge-muted">
                                                        ${tag}
                                                    </span>
                                                `).join("")}
                                            </div>
                                        ` : ""}
                                    </div>
                                    <div class="questions-profile-actions">
                                        <button class="questions-primary-btn" type="button" data-smart-profile-apply="${String(profile.id).replace(/"/g, "&quot;")}">
                                            Usar perfil
                                        </button>
                                        <button class="questions-secondary-btn" type="button" data-smart-profile-rename="${String(profile.id).replace(/"/g, "&quot;")}">
                                            Renomear
                                        </button>
                                        <button class="questions-secondary-btn" type="button" data-smart-profile-duplicate="${String(profile.id).replace(/"/g, "&quot;")}">
                                            Duplicar
                                        </button>
                                        <button class="questions-secondary-btn" type="button" data-smart-profile-delete="${String(profile.id).replace(/"/g, "&quot;")}">
                                            Apagar
                                        </button>
                                    </div>
                                </article>
                            `;
                        }).join("")}
                    </div>
                ` : `
                    <div class="questions-empty-inline">
                        Nenhum perfil inteligente salvo ainda. Salve o recorte atual para reutilizar depois.
                    </div>
                `}
            </section>
        `;
    },

    renderSavedLauncher() {
        const blocks =
            QuestionsStore.getSavedBlocks();

        return `
            <section class="questions-card questions-entry-subview">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Blocos salvos</div>
                        <h2>Biblioteca de blocos reutilizaveis</h2>
                        <p>Consulte o recorte, renomeie quando fizer sentido e refaca o mesmo conjunto sem montar tudo de novo.</p>
                    </div>

                    <div class="questions-entry-actions">
                        <button class="questions-secondary-btn" type="button" data-launcher-view="home">Voltar</button>
                    </div>
                </div>

                ${this.page.getRuntimeNotice() ? `
                    <div class="questions-inline-notice">
                        ${this.page.getRuntimeNotice()}
                    </div>
                ` : ""}

                ${blocks.length ? `
                    <div class="questions-profile-list">
                        ${blocks.map((block) => {
                            const meta =
                                block.routeSnapshot
                                    ?.meta || {};
                            const topicLabels =
                                Array.isArray(
                                    meta.topicsLabel
                                )
                                    ? meta.topicsLabel.filter(
                                        Boolean
                                    )
                                    : [];

                            return `
                                <article class="questions-profile-item">
                                    <div class="questions-profile-copy">
                                        <strong>${block.name}</strong>
                                        <span>${block.mode === "smart" ? "Treino inteligente" : "Treino especifico"} | ${meta.amount || block.questionIds?.length || 0} questoes</span>
                                        <span>${meta.materiaLabel || "Materia"}${topicLabels.length ? ` | ${topicLabels.join(", ")}` : ""}</span>
                                        <span>${block.lastUsedAt ? `Usado por ultimo em ${this.formatDate(block.lastUsedAt)}` : `Salvo em ${this.formatDate(block.updatedAt)}`}</span>
                                    </div>
                                    <div class="questions-profile-actions">
                                        <button class="questions-primary-btn" type="button" data-saved-block-open="${String(block.id).replace(/"/g, "&quot;")}">
                                            Consultar
                                        </button>
                                        <button class="questions-secondary-btn" type="button" data-saved-block-start="${String(block.id).replace(/"/g, "&quot;")}">
                                            Refazer
                                        </button>
                                        <button class="questions-secondary-btn" type="button" data-saved-block-rename="${String(block.id).replace(/"/g, "&quot;")}">
                                            Renomear
                                        </button>
                                        <button class="questions-secondary-btn" type="button" data-saved-block-duplicate="${String(block.id).replace(/"/g, "&quot;")}">
                                            Duplicar
                                        </button>
                                        <button class="questions-secondary-btn" type="button" data-saved-block-delete="${String(block.id).replace(/"/g, "&quot;")}">
                                            Apagar
                                        </button>
                                    </div>
                                </article>
                            `;
                        }).join("")}
                    </div>
                ` : `
                    <div class="questions-empty-inline">
                        Nenhum bloco salvo ainda. Salve um bloco pelo treino inteligente ou pelo modo detalhado para reutilizar depois.
                    </div>
                `}

                <div class="questions-entry-footer">
                    <button class="questions-secondary-btn" type="button" data-launcher-view="specific">
                        Montar bloco manualmente
                    </button>
                    <button class="questions-primary-btn" type="button" data-launcher-view="smart">
                        Ir para treino inteligente
                    </button>
                </div>
            </section>
        `;
    },

    renderResumeLauncher() {
        const inProgressRuns =
            QuestionsStore.getRuns({
                status: "in_progress"
            }).slice(0, 8);
        const completedRuns =
            QuestionsStore.getRuns({
                status: "completed"
            }).slice(0, 8);

        return `
            <section class="questions-card questions-entry-subview">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Retomar treino</div>
                        <h2>Reaproveite rotas recentes</h2>
                        <p>As sessoes em andamento ficam salvas com progresso. As concluidas continuam disponiveis para reiniciar sem remontar a rota.</p>
                    </div>

                    <div class="questions-entry-actions">
                        <button class="questions-secondary-btn" type="button" data-launcher-view="home">Voltar</button>
                    </div>
                </div>

                ${!inProgressRuns.length && !completedRuns.length ? `
                    <div class="questions-empty-inline">
                        Nenhuma sessao salva ainda. Quando voce iniciar um treino, o progresso vai aparecer aqui automaticamente.
                    </div>
                ` : `
                    <div class="questions-run-sections">
                        <article class="questions-panel">
                            <div class="questions-panel-head">
                                <div>
                                    <div class="questions-panel-label">Em andamento</div>
                                    <div class="questions-panel-meta">Retome exatamente do ponto em que parou.</div>
                                </div>
                            </div>

                            ${inProgressRuns.length ? `
                                <div class="questions-run-list">
                                    ${inProgressRuns.map((run) => `
                                        <article class="questions-run-item">
                                            <div class="questions-run-copy">
                                                <strong>${run.title}</strong>
                                                <span>${run.mode === "smart" ? "Treino inteligente" : "Treino especifico"} | ${run.routeSnapshot?.meta?.amount || run.questionIds?.length || 0} questoes</span>
                                                <span>${run.answers?.length || 0}/${run.questionIds?.length || 0} respondidas | atualizada em ${this.formatDate(run.updatedAt)}</span>
                                            </div>
                                            <div class="questions-run-actions">
                                                <button class="questions-primary-btn" type="button" data-run-resume="${String(run.id).replace(/"/g, "&quot;")}">
                                                    Retomar
                                                </button>
                                                <button class="questions-secondary-btn" type="button" data-run-restart="${String(run.id).replace(/"/g, "&quot;")}">
                                                    Reiniciar
                                                </button>
                                                <button class="questions-secondary-btn" type="button" data-run-delete="${String(run.id).replace(/"/g, "&quot;")}">
                                                    Apagar
                                                </button>
                                            </div>
                                        </article>
                                    `).join("")}
                                </div>
                            ` : `
                                <div class="questions-empty-inline questions-empty-inline-soft">
                                    Nenhum treino pausado no momento.
                                </div>
                            `}
                        </article>

                        <article class="questions-panel">
                            <div class="questions-panel-head">
                                <div>
                                    <div class="questions-panel-label">Concluidos</div>
                                    <div class="questions-panel-meta">Reinicie um treino recente sem montar a rota de novo.</div>
                                </div>
                            </div>

                            ${completedRuns.length ? `
                                <div class="questions-run-list">
                                    ${completedRuns.map((run) => `
                                        <article class="questions-run-item">
                                            <div class="questions-run-copy">
                                                <strong>${run.title}</strong>
                                                <span>${run.summary?.accuracy || 0}% de acerto | ${run.summary?.total || run.questionIds?.length || 0} questoes</span>
                                                <span>Concluida em ${this.formatDate(run.completedAt || run.updatedAt)}</span>
                                            </div>
                                            <div class="questions-run-actions">
                                                <button class="questions-primary-btn" type="button" data-run-restart="${String(run.id).replace(/"/g, "&quot;")}">
                                                    Refazer
                                                </button>
                                                <button class="questions-secondary-btn" type="button" data-run-delete="${String(run.id).replace(/"/g, "&quot;")}">
                                                    Apagar
                                                </button>
                                            </div>
                                        </article>
                                    `).join("")}
                                </div>
                            ` : `
                                <div class="questions-empty-inline questions-empty-inline-soft">
                                    As sessoes concluidas vao aparecer aqui depois dos primeiros treinos.
                                </div>
                            `}
                        </article>
                    </div>
                `}
            </section>
        `;
    },

    renderSpecificLauncher() {
        const page =
            this.page;

        if (
            page.data.bankStatus ===
            "loading"
        ) {
            return this.renderLoading();
        }

        if (
            page.data.bankStatus ===
            "error"
        ) {
            return `
                <section class="questions-card questions-card-loading">
                    <div class="questions-kicker">Questions</div>
                    <h2>Banco escolar indisponivel</h2>
                    <p>${page.getRuntimeNotice()}</p>
                </section>
            `;
        }

        const ctx =
            QuestionsContext.get();
        const baseOptions =
            QuestionsService.getBaseOptions(
                page
            );
        const modes =
            QuestionsService.getModeOptions(
                page
            );
        const series =
            QuestionsService.getSeriesOptions(
                page
            );
        const subjects =
            QuestionsService.getSubjectOptions(
                page,
                ctx.serie
            );
        const topics =
            QuestionsService.getTopicOptions(
                page,
                {
                    serie: ctx.serie,
                    materia: ctx.materia
                }
            );
        const filteredTopics =
            QuestionsService.filterTopicOptions(
                topics,
                {
                    search: ctx.topicSearch,
                    readyOnly:
                        ctx.onlyReadyTopics
                }
            );
        const selectedTopics =
            QuestionsService.getSelectedTopicOptions(
                page
            );
        const coverage =
            QuestionsService.getTopicCoverage(
                topics
            );
        const suggestion =
            QuestionsService.getSmartSuggestion(
                page
            );
        const modeConfig =
            page.getModeConfig(ctx.mode);
        const mixStrategies =
            QuestionsService.getMixStrategies(
                page,
                ctx.mode
            );
        const validation =
            QuestionsService.getLauncherValidation(
                page
            );
        const checklist =
            QuestionsService.getLauncherChecklist(
                page
            );
        const route =
            QuestionsService.getRouteSummary(
                page
            );
        const startLabel =
            validation.isReady
                ? "Iniciar treino"
                : "Complete a rota";
        const savedBlocks =
            QuestionsStore.getSavedBlocks();

        return `
            <section class="questions-card questions-launcher-card">
                <div class="questions-head">
                    <div>
                        <div class="questions-kicker">Especificar treino</div>
                        <h2>Monte sua rota escolar</h2>
                        <p>${modeConfig.note} Esse e o caminho para quem quer controlar o recorte completo.</p>
                    </div>

                    <div class="questions-head-cta">
                        <button class="questions-secondary-btn" type="button" data-launcher-view="home">
                            Voltar
                        </button>
                        <button id="questionsSpecificSaveBlockBtn" class="questions-secondary-btn" type="button" ${validation.isReady ? "" : "disabled"}>
                            Salvar bloco
                        </button>
                        <div class="questions-readiness${validation.isReady ? " is-ready" : ""}">
                            <strong>${validation.isReady ? "Rota pronta" : "Rota em montagem"}</strong>
                            <span>${validation.readyCount}/${validation.requestedCount} questoes disponiveis</span>
                        </div>
                        <button id="questionsStartBtn" class="questions-primary-btn" type="button" ${validation.isReady ? "" : "disabled"}>
                            ${startLabel}
                        </button>
                    </div>
                </div>

                ${page.getRuntimeNotice() ? `
                    <div class="questions-inline-notice">
                        ${page.getRuntimeNotice()}
                    </div>
                ` : ""}

                <div class="questions-launcher-overview">
                    <article class="questions-route-card">
                        <div class="questions-panel-label">Resumo da rota</div>
                        <div class="questions-route-grid">
                            <article class="questions-route-stat">
                                <strong>${route.baseLabel || "Escolar"}</strong>
                                <span>Base</span>
                            </article>
                            <article class="questions-route-stat">
                                <strong>${route.serieLabel}</strong>
                                <span>Serie ativa</span>
                            </article>
                            <article class="questions-route-stat">
                                <strong>${route.materiaLabel || "Materia"}</strong>
                                <span>Materia</span>
                            </article>
                            <article class="questions-route-stat">
                                <strong>${selectedTopics.length}</strong>
                                <span>Assunto(s)</span>
                            </article>
                            <article class="questions-route-stat">
                                <strong>${validation.estimatedDuration}</strong>
                                <span>Tempo estimado</span>
                            </article>
                        </div>

                        <div class="questions-route-stack">
                            <div class="questions-summary-label">Assuntos selecionados</div>
                            ${selectedTopics.length ? `
                                <div class="questions-badge-row">
                                    ${selectedTopics.map((topic) => `
                                        <span class="questions-badge${ctx.focoPrincipal === topic.key ? " is-focus" : ""}">
                                            ${topic.label}
                                        </span>
                                    `).join("")}
                                </div>
                            ` : `
                                <div class="questions-empty-inline">
                                    Selecione os assuntos que vao entrar na sessao.
                                </div>
                            `}
                        </div>

                        ${validation.issues.length ? `
                            <div class="questions-issue-list">
                                ${validation.issues.map((issue) => `
                                    <div class="questions-issue-item">${issue}</div>
                                `).join("")}
                            </div>
                        ` : ""}
                    </article>

                    <article class="questions-route-card">
                        <div class="questions-panel-label">Checklist de prontidao</div>
                        ${this.renderChecklist(checklist)}
                    </article>
                </div>

                <div class="questions-grid">
                    <article class="questions-panel">
                        <div class="questions-panel-head">
                            <div>
                                <div class="questions-panel-label">Base de treino</div>
                                <div class="questions-panel-meta">Escolar ativa agora. ENEM fica em fluxo separado e ja esta preparado.</div>
                            </div>
                        </div>
                        <div class="questions-chip-grid">
                            ${baseOptions.map((base) => `
                                <button class="questions-chip${ctx.base === base.key ? " is-active" : ""}${base.available ? "" : " is-disabled"}" type="button" data-base="${base.key}" ${base.available ? "" : "disabled"}>
                                    <strong>${base.label}</strong>
                                    <span>${base.note}</span>
                                </button>
                            `).join("")}
                        </div>
                    </article>

                    <article class="questions-panel">
                        <div class="questions-panel-label">Modo de treino</div>
                        <div class="questions-chip-grid">
                            ${modes.map((mode) => `
                                <button class="questions-chip${ctx.mode === mode.key ? " is-active" : ""}" type="button" data-mode="${mode.key}">
                                    <strong>${mode.label}</strong>
                                    <span>${mode.note}</span>
                                </button>
                            `).join("")}
                        </div>
                    </article>

                    <article class="questions-panel">
                        <div class="questions-panel-label">Serie</div>
                        <div class="questions-inline-grid">
                            ${series.map((serie) => `
                                <button class="questions-pill${ctx.serie === serie.key ? " is-active" : ""}" type="button" data-serie="${serie.key}">
                                    ${serie.label}
                                </button>
                            `).join("")}
                        </div>
                    </article>

                    <article class="questions-panel">
                        <div class="questions-panel-label">Materia</div>
                        <div class="questions-inline-grid">
                            ${subjects.map((subject) => `
                                <button class="questions-pill${ctx.materia === subject.key ? " is-active" : ""}" type="button" data-materia="${subject.key}">
                                    ${subject.label}
                                    <span>${subject.topicCount} assuntos</span>
                                </button>
                            `).join("")}
                        </div>
                    </article>

                    <article class="questions-panel">
                        <div class="questions-panel-head">
                            <div>
                                <div class="questions-panel-label">Assuntos</div>
                                <div class="questions-panel-meta">${filteredTopics.length}/${topics.length} visiveis | ${coverage.readyTopics} prontos | ${coverage.totalQuestions} questoes</div>
                            </div>
                            ${ctx.mode !== "ASSUNTO_UNICO" ? `
                                <div class="questions-inline-actions">
                                    <button class="questions-link-btn" type="button" id="questionsSelectAllTopicsBtn">Selecionar todos</button>
                                    <button class="questions-link-btn" type="button" id="questionsClearTopicsBtn">Limpar</button>
                                </div>
                            ` : ""}
                        </div>

                        ${topics.length ? `
                            <div class="questions-filter-bar">
                                <input id="questionsTopicSearchInput" class="questions-search-field" type="search" value="${String(ctx.topicSearch || "").replace(/"/g, "&quot;")}" placeholder="Buscar por assunto, subtopico ou eixo">
                                <button id="questionsReadyTopicsBtn" class="questions-secondary-btn" type="button">
                                    ${ctx.onlyReadyTopics ? "So prontos" : "Mostrar vazios"}
                                </button>
                            </div>

                            ${ctx.onlyReadyTopics && coverage.emptyTopics ? `
                                <div class="questions-inline-note">
                                    ${coverage.emptyTopics} assunto(s) vazios ficaram ocultos para deixar a escolha mais limpa.
                                </div>
                            ` : ""}

                            ${filteredTopics.length ? `
                            <div class="questions-topic-grid">
                                ${filteredTopics.map((topic) => `
                                    <button class="questions-topic-card${ctx.topicos.includes(topic.key) ? " is-active" : ""}${ctx.focoPrincipal === topic.key ? " is-focus" : ""}${topic.hasQuestions ? "" : " is-empty"}" type="button" data-topic="${topic.key}">
                                        <strong>${topic.label}</strong>
                                        ${(topic.eixo || topic.frente || topic.subtopicsPreview.length) ? `
                                            <div class="questions-topic-notes">
                                                ${topic.eixo ? `<span>${topic.eixo}</span>` : ""}
                                                ${topic.frente ? `<span>${topic.frente}</span>` : ""}
                                                ${topic.subtopicCount ? `<span>${topic.subtopicCount} subtopicos</span>` : ""}
                                            </div>
                                        ` : ""}
                                        ${topic.subtopicsPreview.length ? `
                                            <div class="questions-topic-preview">
                                                ${topic.subtopicsPreview.join(" | ")}
                                            </div>
                                        ` : ""}
                                        <div class="questions-topic-foot">
                                            <span>${topic.count} questoes</span>
                                            <span class="questions-topic-badge${topic.hasQuestions ? " is-ready" : ""}">
                                                ${topic.hasQuestions ? "pronto" : "vazio"}
                                            </span>
                                        </div>
                                    </button>
                                `).join("")}
                            </div>
                            ` : `
                                <div class="questions-empty-inline">
                                    Nenhum assunto bate com a busca atual. Ajuste o texto ou libere os vazios.
                                </div>
                            `}
                        ` : `
                            <div class="questions-empty-inline">
                                Essa materia ainda nao tem assuntos mapeados.
                            </div>
                        `}
                    </article>

                    ${ctx.mode === "REFORCO_DIRECIONADO" && selectedTopics.length ? `
                        <article class="questions-panel">
                            <div class="questions-panel-label">Foco principal</div>
                            <div class="questions-inline-grid">
                                ${selectedTopics.map((topic) => `
                                    <button class="questions-pill${ctx.focoPrincipal === topic.key ? " is-active" : ""}" type="button" data-focus-topic="${topic.key}">
                                        ${topic.label}
                                    </button>
                                `).join("")}
                            </div>
                        </article>
                    ` : ""}

                    <article class="questions-panel">
                        <div class="questions-panel-label">Quantidade de questoes</div>
                        <div class="questions-inline-grid">
                            ${page.data.amountOptions.map((amount) => `
                                <button class="questions-pill${ctx.quantidadeQuestoes === amount ? " is-active" : ""}" type="button" data-amount="${amount}">
                                    ${amount}
                                </button>
                            `).join("")}
                        </div>
                    </article>

                    <article class="questions-panel">
                        <div class="questions-panel-head">
                            <div>
                                <div class="questions-panel-label">Estrategia de mistura</div>
                                <div class="questions-panel-meta">${route.strategyLabel || "Selecao automatica"}</div>
                            </div>
                        </div>
                        <div class="questions-inline-grid">
                            ${mixStrategies.map((strategy) => `
                                <button class="questions-pill${ctx.estrategiaMistura === strategy.key ? " is-active" : ""}" type="button" data-mix="${strategy.key}">
                                    ${strategy.label}
                                </button>
                            `).join("")}
                        </div>
                    </article>
                </div>

                <div class="questions-summary-band">
                    <div>
                        <div class="questions-summary-label">Sugestao inteligente</div>
                        <strong>${suggestion.title}</strong>
                        <span>${suggestion.note}</span>
                    </div>
                </div>

                <div class="questions-entry-footer">
                    <button class="questions-secondary-btn" type="button" data-launcher-view="saved">
                        Blocos salvos${savedBlocks.length ? ` (${savedBlocks.length})` : ""}
                    </button>
                    <button class="questions-secondary-btn" type="button" data-launcher-view="smart">
                        Ir para treino inteligente
                    </button>
                </div>
            </section>
        `;
    },

    formatDate(timestamp) {
        if (!timestamp) {
            return "Sem data";
        }

        try {
            return new Intl.DateTimeFormat(
                "pt-BR",
                {
                    dateStyle: "short",
                    timeStyle: "short"
                }
            ).format(
                new Date(timestamp)
            );
        } catch (_error) {
            return String(timestamp);
        }
    },

    renderSessionMeta(meta, current, total) {
        return `
            <div class="questions-session-overview">
                <article class="questions-session-stat">
                    <strong>${meta.materiaLabel || "Materia"}</strong>
                    <span>Materia ativa</span>
                </article>
                <article class="questions-session-stat">
                    <strong>${meta.amount || total}</strong>
                    <span>Questoes na rota</span>
                </article>
                <article class="questions-session-stat">
                    <strong>${meta.estimatedDuration || "0 min"}</strong>
                    <span>Tempo previsto</span>
                </article>
                <article class="questions-session-stat">
                    <strong>${Math.max(total - current - 1, 0)}</strong>
                    <span>Restantes</span>
                </article>
            </div>
        `;
    },

    renderSession() {
        const session =
            QuestionsState.getSession();

        if (
            QuestionsState.isComplete()
        ) {
            return this.renderResults();
        }

        const question =
            QuestionsState.getCurrentQuestion();
        const current =
            QuestionsState.getCurrent();
        const answer =
            QuestionsState.getLastAnswer();
        const meta =
            QuestionsState.getMeta();
        const progress =
            session.length
                ? (
                    (current / session.length) * 100
                )
                : 0;

        if (!question) {
            return `
                <section class="questions-card questions-card-loading">
                    <h2>Nenhuma questao ativa</h2>
                    <p>Volte para o launcher e monte outra rota.</p>
                </section>
            `;
        }

        return `
            <section class="questions-card questions-session-card questions-session-card--minimal">
                <article class="questions-question-card questions-question-card--minimal">
                    <h3>${question.prompt}</h3>
                    <div class="questions-answer-area">
                        ${this.renderAnswerBlock(question, answer)}
                    </div>
                    ${this.renderCommentPanel(
                        question,
                        answer
                    )}
                </article>

                <details class="questions-session-drawer">
                    <summary class="questions-session-drawer-toggle">Acompanhar progresso</summary>
                    <div class="questions-session-drawer-body">
                        <div class="questions-session-drawer-grid">
                            <div>
                                <strong>${current + 1}/${session.length}</strong>
                                <span>Questao atual</span>
                            </div>
                            <div>
                                <strong>${Math.round(progress)}%</strong>
                                <span>Concluido</span>
                            </div>
                            <div>
                                <strong>${meta.materiaLabel || "Materia"}</strong>
                                <span>Materia</span>
                            </div>
                            <div>
                                <strong>${meta.serieLabel || "-"}</strong>
                                <span>Serie</span>
                            </div>
                        </div>
                        <div class="questions-session-drawer-actions">
                            <button id="questionsBackBtn" class="questions-secondary-btn" type="button">Pausar treino</button>
                        </div>
                    </div>
                </details>
            </section>
        `;
    },

    renderCommentPanel(
        question,
        answer
    ) {
        if (!answer) {
            return "";
        }

        return `
            <section class="questions-comment-panel${answer ? " is-ready" : ""}">
                <div class="questions-panel-label">Comentario</div>
                <p>${question.explanation || "Comentario ainda nao preenchido para esta questao."}</p>
                ${!answer.correct ? `
                    <div class="questions-comment-answer">Resposta esperada: ${answer.correctAnswerLabel || "Nao preenchida"}</div>
                ` : ""}
            </section>
        `;
    },

    renderAnswerBlock(question, answer) {
        if (question.type === "input") {
            return this.renderInputBlock(
                question,
                answer
            );
        }

        if (question.type === "ordenacao") {
            return this.renderOrderingBlock(
                question,
                answer
            );
        }

        if (question.type === "vf") {
            const vfQuestion = {
                ...question,
                options: ["Verdadeiro", "Falso"]
            };

            return this.renderChoiceBlock(
                vfQuestion,
                answer
            );
        }

        return this.renderChoiceBlock(
            question,
            answer
        );
    },

    renderChoiceBlock(question, answer) {
        const isLocked =
            Boolean(answer);

        return `
            <div class="questions-options">
                ${(question.options || []).map((option, index) => {
                    const isCorrect =
                        answer &&
                        index === question.correct;
                    const isWrong =
                        answer &&
                        index === answer.selectedIndex &&
                        !answer.correct;

                    return `
                        <button class="questions-option${isCorrect ? " is-correct" : ""}${isWrong ? " is-wrong" : ""}" type="button" data-answer-select="${index}" ${isLocked ? "disabled" : ""}>
                            <span class="questions-option-index">${String.fromCharCode(65 + index)}</span>
                            <span>${option}</span>
                        </button>
                    `;
                }).join("")}
            </div>
            ${!answer ? `
                <button id="questionsChoiceConfirmBtn" class="questions-confirm-btn" type="button" disabled>
                    <span class="questions-confirm-icon">✓</span>
                    Confirmar
                </button>
            ` : ""}
            ${answer ? this.renderFeedback(answer) : ""}
        `;
    },

    renderOrderingBlock(question, answer) {
        const items = Array.isArray(
            question.options
        )
            ? question.options
            : [];
        const isLocked =
            Boolean(answer);

        return `
            <div class="questions-order-shell">
                <div id="questionsOrderingList" class="questions-order-list">
                    ${items.map((item) => `
                        <article class="questions-order-item" data-order-value="${String(item).replace(/"/g, "&quot;")}">
                            <div class="questions-order-grip">::</div>
                            <strong>${item}</strong>
                            <div class="questions-order-actions">
                                <button class="questions-order-btn" type="button" data-order-move="up" ${isLocked ? "disabled" : ""}>Subir</button>
                                <button class="questions-order-btn" type="button" data-order-move="down" ${isLocked ? "disabled" : ""}>Descer</button>
                            </div>
                        </article>
                    `).join("")}
                </div>

                <button id="questionsOrderingSubmitBtn" class="questions-confirm-btn" type="button" ${isLocked ? "disabled" : ""}>
                    <span class="questions-confirm-icon">✓</span>
                    Confirmar
                </button>
            </div>
            ${answer ? this.renderFeedback(answer) : ""}
        `;
    },

    renderInputBlock(question, answer) {
        return `
            <form id="questionsInputForm" class="questions-input-form">
                <input id="questionsInputField" class="questions-input-field" type="text" placeholder="Digite sua resposta" ${answer ? "disabled" : ""}>
                <button class="questions-confirm-btn" type="submit" ${answer ? "disabled" : ""}>
                    <span class="questions-confirm-icon">✓</span>
                    Confirmar
                </button>
            </form>
            ${answer ? this.renderFeedback(answer) : ""}
        `;
    },

    renderFeedback(answer) {
        return `
            <div class="questions-feedback questions-feedback--minimal ${answer.correct ? "is-correct" : "is-wrong"}">
                <div class="questions-feedback-foot">
                    <button id="questionsContinueBtn" class="questions-confirm-btn" type="button">
                        <span class="questions-confirm-icon">→</span>
                        Proxima
                    </button>
                </div>
            </div>
        `;
    },

    renderResults() {
        const results =
            QuestionsState.getResults();
        const meta =
            QuestionsState.getMeta();
        const summary =
            QuestionsService.summarizeSessionResults(
                results,
                meta
            );

        return `
            <section class="questions-card questions-results-card">
                <div class="questions-kicker">Sessao concluida</div>
                <h2>${summary.accuracy}% de acerto</h2>
                <p>${summary.headline}. ${summary.nextStep}</p>

                <div class="questions-results-grid">
                    <article class="questions-result-stat">
                        <strong>${summary.hits}</strong>
                        <span>acertos</span>
                    </article>
                    <article class="questions-result-stat">
                        <strong>${summary.errors}</strong>
                        <span>erros</span>
                    </article>
                    <article class="questions-result-stat">
                        <strong>${QuestionsService.formatTime(summary.avgTimeMs)}</strong>
                        <span>tempo medio</span>
                    </article>
                    <article class="questions-result-stat">
                        <strong>${summary.topicCount}</strong>
                        <span>assunto(s)</span>
                    </article>
                </div>

                <div class="questions-results-insights">
                    <article class="questions-result-panel">
                        <div class="questions-panel-label">Leitura da sessao</div>
                        <div class="questions-result-callouts">
                            <div class="questions-result-callout">
                                <strong>Ponto forte</strong>
                                <span>${summary.strongTopic?.topicLabel || "Ainda sem destaque claro nesta rodada."}</span>
                            </div>
                            <div class="questions-result-callout is-warning">
                                <strong>Ponto para reforco</strong>
                                <span>${summary.weakTopic?.topicLabel || "Nenhum topico concentrou erro relevante."}</span>
                            </div>
                        </div>
                    </article>

                    <article class="questions-result-panel">
                        <div class="questions-panel-label">Desempenho por assunto</div>
                        <div class="questions-result-topic-list">
                            ${summary.topics.map((topic) => `
                                <div class="questions-result-topic-item">
                                    <strong>${topic.topicLabel}</strong>
                                    <span>${topic.hits}/${topic.attempts} acertos | ${topic.accuracy}%</span>
                                </div>
                            `).join("")}
                        </div>
                    </article>
                </div>

                <div class="questions-results-actions">
                    ${summary.weakTopic ? `
                        <button id="questionsFocusWeakBtn" class="questions-secondary-btn" type="button">Reforcar ponto fraco</button>
                    ` : ""}
                    <button id="questionsReviewErrorsBtn" class="questions-secondary-btn" type="button">Revisar erros</button>
                    <button id="questionsMixedReviewBtn" class="questions-secondary-btn" type="button">Misturar revisao</button>
                    <button id="questionsRestartBtn" class="questions-primary-btn" type="button">Treinar de novo</button>
                    <button id="questionsResultsBackBtn" class="questions-secondary-btn" type="button">Voltar ao launcher</button>
                </div>
            </section>
        `;
    },

    renderStatsPanel() {
        const page =
            this.page;

        if (
            page.data.bankStatus !==
            "ready"
        ) {
            return "";
        }

        const ctx =
            QuestionsContext.get();
        const dashboard =
            QuestionsStore.getDashboard({
                baseKey: ctx.base,
                subjectKey: ctx.materia
            });
        const subject =
            QuestionsService.getSubjectOptions(
                page,
                ctx.serie
            ).find((item) =>
                item.key === ctx.materia
            );

        return `
            <section class="questions-stats-card">
                <div class="questions-panel-label">Radar da materia</div>
                <h3>${subject?.label || "Materia"}</h3>
                <div class="questions-stats-grid">
                    <article>
                        <strong>${dashboard.attempts}</strong>
                        <span>tentativas</span>
                    </article>
                    <article>
                        <strong>${Math.round((dashboard.accuracy || 0) * 100)}%</strong>
                        <span>precisao</span>
                    </article>
                    <article>
                        <strong>${QuestionsService.formatTime(dashboard.avgTimeMs)}</strong>
                        <span>tempo medio</span>
                    </article>
                    <article>
                        <strong>${dashboard.totalSessions || 0}</strong>
                        <span>sessoes</span>
                    </article>
                </div>

                <div class="questions-weak-list">
                    <div class="questions-panel-label">Pontos sensiveis</div>
                    ${(dashboard.weakTopics || []).length ? dashboard.weakTopics.map((topic) => `
                        <div class="questions-weak-item">
                            <strong>${topic.topicLabel}</strong>
                            <span>${topic.errors} erro(s)</span>
                        </div>
                    `).join("") : `
                        <div class="questions-empty-inline">
                            O painel vai ganhar vida conforme voce responder questoes.
                        </div>
                    `}
                </div>

                <div class="questions-stats-section">
                    <div class="questions-panel-label">Pontos fortes</div>
                    ${(dashboard.strongTopics || []).length ? dashboard.strongTopics.slice(0, 3).map((topic) => `
                        <div class="questions-weak-item questions-weak-item-positive">
                            <strong>${topic.topicLabel}</strong>
                            <span>${Math.round((topic.accuracy || 0) * 100)}% de precisao</span>
                        </div>
                    `).join("") : `
                        <div class="questions-empty-inline">
                            Os destaques positivos vao aparecer conforme voce acumular acertos.
                        </div>
                    `}
                </div>

                <div class="questions-stats-section">
                    <div class="questions-panel-label">Modos mais usados</div>
                    ${(dashboard.modeBreakdown || []).length ? dashboard.modeBreakdown.map((mode) => `
                        <div class="questions-weak-item">
                            <strong>${mode.modeLabel}</strong>
                            <span>${mode.sessions} sessao(oes) | ${mode.avgAccuracy}% medio</span>
                        </div>
                    `).join("") : `
                        <div class="questions-empty-inline">
                            O painel de modos vai ganhar vida conforme voce variar os treinos.
                        </div>
                    `}
                </div>

                <div class="questions-stats-section">
                    <div class="questions-panel-label">Sessoes focadas</div>
                    ${(dashboard.focusedSessions || []).length ? dashboard.focusedSessions.slice(0, 3).map((session) => `
                        <div class="questions-session-log">
                            <strong>${session.topicLabels?.[0] || session.weakTopicLabel || session.subjectLabel || "Sessao focada"}</strong>
                            <span>${session.accuracy || 0}% | ${session.amount || 0} questoes</span>
                        </div>
                    `).join("") : `
                        <div class="questions-empty-inline">
                            Quando voce fizer sessoes mais focadas, elas aparecem aqui.
                        </div>
                    `}
                </div>

                <div class="questions-stats-section">
                    <div class="questions-panel-label">Resumo rapido</div>
                    <div class="questions-session-log">
                        <strong>Assunto mais treinado</strong>
                        <span>${dashboard.mostTrainedTopic?.topicLabel || "Ainda sem lideranca clara"}</span>
                    </div>
                    <div class="questions-session-log">
                        <strong>Ultima leitura</strong>
                        <span>${dashboard.sessions?.[0]?.accuracy ?? 0}% na sessao mais recente</span>
                    </div>
                </div>
            </section>
        `;
    },

    bindLauncher() {
        document
            .querySelectorAll(
                "[data-launcher-view]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.openLauncher(
                            button.dataset
                                .launcherView
                        );
                    }
                );
            });

        document.getElementById(
            "questionsModuleBackBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.exitModule();
            }
        );

        document.getElementById(
            "questionsSmartSelectAllBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.selectAllSmartStartOptions();
            }
        );

        document.getElementById(
            "questionsSmartContinueBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.continueSmartStart();
            }
        );

        document
            .querySelectorAll(
                "[data-smart-start-option]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.toggleSmartStartOption(
                            button.dataset
                                .smartStartOption
                        );
                    }
                );
            });

        document.getElementById(
            "questionsSmartSubjectsSelectAllBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.selectAllSmartSubjectOptions();
            }
        );

        document.getElementById(
            "questionsSmartSubjectsContinueBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.continueSmartSubjects();
            }
        );

        document
            .querySelectorAll(
                "[data-smart-subject-option]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.toggleSmartSubjectOption(
                            button.dataset
                                .smartSubjectOption
                        );
                    }
                );
            });

        document.getElementById(
            "questionsSmartStartBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.startSmartSession();
            }
        );

        document.getElementById(
            "questionsSmartSaveProfileBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.saveCurrentSmartProfile();
            }
        );

        document.getElementById(
            "questionsSmartSaveBlockBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.saveCurrentSmartBlock();
            }
        );

        document.getElementById(
            "questionsSmartSaveProfileFromLibraryBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.saveCurrentSmartProfile();
            }
        );

        document.getElementById(
            "questionsSmartClearExclusionsBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.clearSmartExclusions();
            }
        );

        document.getElementById(
            "questionsSmartClearExclusionsFooterBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.clearSmartExclusions();
            }
        );

        document
            .querySelectorAll(
                "[data-smart-goal]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.setSmartGoal(
                            button.dataset
                                .smartGoal
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-smart-base]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.toggleSmartBaseExclusion(
                            button.dataset
                                .smartBase
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-smart-serie]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.toggleSmartSeriesExclusion(
                            button.dataset
                                .smartSerie
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-smart-subject]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.toggleSmartSubjectExclusion(
                            button.dataset
                                .smartSubject
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-smart-profile-apply]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.applySmartProfile(
                            button.dataset
                                .smartProfileApply
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-smart-profile-rename]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.renameSmartProfile(
                            button.dataset
                                .smartProfileRename
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-smart-profile-duplicate]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.duplicateSmartProfile(
                            button.dataset
                                .smartProfileDuplicate
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-smart-profile-delete]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.deleteSmartProfile(
                            button.dataset
                                .smartProfileDelete
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-run-resume]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.resumeRun(
                            button.dataset
                                .runResume
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-run-restart]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.restartRun(
                            button.dataset
                                .runRestart
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-run-delete]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.deleteRun(
                            button.dataset
                                .runDelete
                        );
                    }
                );
            });

        document
            .querySelectorAll("[data-base]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.setBase(
                            button.dataset.base
                        );
                    }
                );
            });

        document
            .querySelectorAll("[data-mode]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.updateContext({
                            mode:
                                button.dataset.mode
                        });
                    }
                );
            });

        document
            .querySelectorAll("[data-serie]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.updateContext({
                            serie: Number(
                                button.dataset.serie
                            )
                        });
                    }
                );
            });

        document
            .querySelectorAll("[data-materia]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.updateContext({
                            materia:
                                button.dataset.materia
                        });
                    }
                );
            });

        document
            .querySelectorAll("[data-topic]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.toggleTopic(
                            button.dataset.topic
                        );
                    }
                );
            });

        document
            .querySelectorAll("[data-focus-topic]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.setFocusPrincipal(
                            button.dataset.focusTopic
                        );
                    }
                );
            });

        document
            .querySelectorAll("[data-amount]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.updateContext({
                            quantidadeQuestoes:
                                Number(
                                    button.dataset.amount
                                )
                        });
                    }
                );
            });

        document
            .querySelectorAll("[data-mix]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.updateContext({
                            estrategiaMistura:
                                button.dataset.mix
                        });
                    }
                );
            });

        document.getElementById(
            "questionsSelectAllTopicsBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.selectAllTopics();
            }
        );

        document.getElementById(
            "questionsClearTopicsBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.clearTopics();
            }
        );

        document.getElementById(
            "questionsTopicSearchInput"
        )?.addEventListener(
            "input",
            (event) => {
                this.page.updateContext({
                    topicSearch:
                        event.target?.value || ""
                });
            }
        );

        document.getElementById(
            "questionsReadyTopicsBtn"
        )?.addEventListener(
            "click",
            () => {
                const ctx =
                    QuestionsContext.get();
                this.page.updateContext({
                    onlyReadyTopics:
                        !ctx.onlyReadyTopics
                });
            }
        );

        document.getElementById(
            "questionsStartBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.startSession();
            }
        );

        document.getElementById(
            "questionsSpecificSaveBlockBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.saveCurrentSpecificBlock();
            }
        );

        document
            .querySelectorAll(
                "[data-saved-block-open]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.openSavedBlock(
                            button.dataset
                                .savedBlockOpen
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-saved-block-start]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.startSavedBlock(
                            button.dataset
                                .savedBlockStart
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-saved-block-rename]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.renameSavedBlock(
                            button.dataset
                                .savedBlockRename
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-saved-block-duplicate]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.duplicateSavedBlock(
                            button.dataset
                                .savedBlockDuplicate
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-saved-block-delete]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.deleteSavedBlock(
                            button.dataset
                                .savedBlockDelete
                        );
                    }
                );
            });
    },

    moveOrderItem(button) {
        const item =
            button.closest(
                ".questions-order-item"
            );

        if (!item) {
            return;
        }

        if (
            button.dataset.orderMove ===
            "up"
        ) {
            const previous =
                item.previousElementSibling;

            if (previous) {
                previous.before(item);
            }

            return;
        }

        const next =
            item.nextElementSibling;

        if (next) {
            next.after(item);
        }
    },

    bindSession() {
        document
            .querySelectorAll("[data-answer-select]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        document
                            .querySelectorAll(
                                "[data-answer-select]"
                            )
                            .forEach((item) => {
                                item.classList.remove(
                                    "is-selected"
                                );
                            });

                        button.classList.add(
                            "is-selected"
                        );

                        const confirmBtn =
                            document.getElementById(
                                "questionsChoiceConfirmBtn"
                            );

                        if (confirmBtn) {
                            confirmBtn.disabled =
                                false;
                            confirmBtn.dataset.selectedIndex =
                                button.dataset.answerSelect || "";
                        }
                    }
                );
            });

        document.getElementById(
            "questionsChoiceConfirmBtn"
        )?.addEventListener(
            "click",
            (event) => {
                const selectedIndex =
                    Number(
                        event.currentTarget
                            ?.dataset
                            ?.selectedIndex
                    );

                if (
                    !Number.isFinite(
                        selectedIndex
                    )
                ) {
                    return;
                }

                this.page.submitAnswer({
                    index: selectedIndex
                });
            }
        );

        document.getElementById(
            "questionsInputForm"
        )?.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();
                const field =
                    document.getElementById(
                        "questionsInputField"
                    );

                this.page.submitAnswer({
                    index: null,
                    value: String(
                        field?.value || ""
                    ).trim()
                });
            }
        );

        document
            .querySelectorAll("[data-order-move]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.moveOrderItem(
                            button
                        );
                    }
                );
            });

        document.getElementById(
            "questionsOrderingSubmitBtn"
        )?.addEventListener(
            "click",
            () => {
                const order = [
                    ...document.querySelectorAll(
                        "#questionsOrderingList [data-order-value]"
                    )
                ].map((item) =>
                    item.dataset.orderValue
                );

                this.page.submitAnswer({
                    index: null,
                    value: order
                });
            }
        );

        document.getElementById(
            "questionsContinueBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.continueSession();
            }
        );

        document.getElementById(
            "questionsBackBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.pauseSession();
            }
        );

        document.getElementById(
            "questionsRestartBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.restartSession();
            }
        );

        document.getElementById(
            "questionsFocusWeakBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.startFollowUp(
                    "weak_topic"
                );
            }
        );

        document.getElementById(
            "questionsReviewErrorsBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.startFollowUp(
                    "review_errors"
                );
            }
        );

        document.getElementById(
            "questionsMixedReviewBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.startFollowUp(
                    "mixed_review"
                );
            }
        );

        document.getElementById(
            "questionsResultsBackBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.openLauncher();
            }
        );
    },

    getTypeLabel(type) {
        return (
            this.page.data.questionTypes[
                type
            ]?.label || type
        );
    }
};
