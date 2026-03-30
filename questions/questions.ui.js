window.QuestionsUI = {
    page: null,
    sessionEventsBound: false,
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
        const dialogMarkup =
            this.renderDialog();

        launcher.hidden =
            phase !== "launcher";
        session.hidden =
            phase !== "session";

        this.teardownFloatingSession();

        if (phase === "launcher") {
            launcher.innerHTML =
                this.renderLauncher() +
                dialogMarkup;
            session.innerHTML = "";
        } else {
            session.innerHTML =
                this.renderSession() +
                dialogMarkup;
            launcher.innerHTML = "";
        }

        const shouldShowStats = false;

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

        if (phase === "launcher") {
            this.bindLauncher();
        } else {
            this.bindSessionSurface(
                session
            );
            this.bindSessionSurface(
                document.getElementById(
                    "questionsFloatingBody"
                )
            );
            this.bindSession();
        }

        this.bindDialog();
    },

    renderDialog() {
        const dialog =
            this.page?.getActiveDialog?.();

        if (!dialog) {
            return "";
        }

        const dialogPosition =
            dialog.position &&
            dialog.position.anchored
                ? ` style="top:${Number(dialog.position.top || 0)}px;left:${Number(dialog.position.left || 0)}px;width:min(calc(100vw - 32px), ${Number(dialog.position.width || 520)}px);"`
                : "";
        const dialogClasses =
            dialog.position &&
            dialog.position.anchored
                ? "questions-dialog-card is-anchored"
                : "questions-dialog-card";

        return `
            <div class="questions-dialog-backdrop">
                <section class="${dialogClasses}" role="dialog" aria-modal="true" aria-labelledby="questionsDialogTitle"${dialogPosition}>
                    <div class="questions-dialog-copy">
                        <div id="questionsDialogTitle" class="questions-dialog-title">${this.escapeHtml(dialog.title)}</div>
                        ${dialog.mode === "confirm" ? `
                            <div class="questions-dialog-message">${this.escapeHtml(dialog.message || "")}</div>
                        ` : `
                            <label class="questions-dialog-label" for="questionsDialogInput">${this.escapeHtml(dialog.label)}</label>
                            <input id="questionsDialogInput" class="questions-dialog-input" type="text" value="${this.escapeHtml(dialog.value || "")}" autocomplete="off" spellcheck="false">
                        `}
                    </div>
                    <div class="questions-dialog-actions">
                        <button id="questionsDialogCancelBtn" class="questions-secondary-btn" type="button">Cancelar</button>
                        <button id="questionsDialogConfirmBtn" class="questions-primary-btn" type="button">${this.escapeHtml(dialog.confirmLabel || "Salvar")}</button>
                    </div>
                </section>
            </div>
        `;
    },

    bindDialog() {
        const input =
            document.getElementById(
                "questionsDialogInput"
            );

        document.getElementById(
            "questionsDialogCancelBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.closeDialog();
            }
        );

        document.getElementById(
            "questionsDialogConfirmBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.confirmDialog(
                    input?.value || ""
                );
            }
        );

        if (!input) {
            return;
        }

        requestAnimationFrame(() => {
            input.focus();
            input.select();
        });

        input.addEventListener(
            "keydown",
            (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    this.page.confirmDialog(
                        input.value
                    );
                    return;
                }

                if (event.key === "Escape") {
                    event.preventDefault();
                    this.page.closeDialog();
                }
            }
        );
    },

    bindSessionSurface(surface) {
        if (
            !surface ||
            surface.dataset
                .questionsSessionBound ===
                "true"
        ) {
            return;
        }

        surface.dataset.questionsSessionBound =
            "true";
        surface.addEventListener(
            "click",
            (event) => {
                this.handleSessionSurfaceClick(
                    event,
                    surface
                );
            }
        );
        surface.addEventListener(
            "submit",
            (event) => {
                this.handleSessionSurfaceSubmit(
                    event,
                    surface
                );
            }
        );
    },

    handleSessionSurfaceClick(
        event,
        surface
    ) {
        const target =
            event.target instanceof Element
                ? event.target
                : null;

        if (!target) {
            return;
        }

        const answerButton =
            target.closest(
                "[data-answer-select]"
            );

        if (answerButton) {
            event.preventDefault();
            this.selectChoice(
                answerButton,
                surface
            );
            return;
        }

        const choiceConfirmBtn =
            target.closest(
                "#questionsChoiceConfirmBtn"
            );

        if (choiceConfirmBtn) {
            event.preventDefault();
            this.submitSelectedChoice(
                surface
            );
            return;
        }

        const inputConfirmBtn =
            target.closest(
                "#questionsInputConfirmBtn"
            );

        if (inputConfirmBtn) {
            event.preventDefault();
            this.page.submitAnswer({
                index: null,
                value:
                    this.getActiveInputAnswerValue(
                        surface
                    )
            });
            return;
        }

        const orderingMoveBtn =
            target.closest(
                "[data-order-move]"
            );

        if (orderingMoveBtn) {
            this.moveOrderItem(
                orderingMoveBtn
            );
            return;
        }

        const orderingSubmitBtn =
            target.closest(
                "#questionsOrderingSubmitBtn"
            );

        if (orderingSubmitBtn) {
            this.page.submitAnswer({
                index: null,
                value:
                    this.getActiveOrderingAnswerValue(
                        surface
                    )
            });
            return;
        }

        const continueBtn =
            target.closest(
                "#questionsContinueBtn"
            );

        if (continueBtn) {
            this.page.continueSession();
            return;
        }

        const retryBtn =
            target.closest(
                "#questionsRetryBtn"
            );

        if (retryBtn) {
            this.page.retryCurrentQuestion();
            return;
        }

        const backBtn =
            target.closest(
                "#questionsBackBtn, #questionsInfoBackBtn"
            );

        if (backBtn) {
            this.page.pauseSession();
            return;
        }
    },

    selectChoice(
        answerButton,
        surface = document
    ) {
        const group =
            answerButton?.closest(
                ".questions-options"
            );

        group
            ?.querySelectorAll(
                "[data-answer-select]"
            )
            .forEach((item) => {
                item.classList.remove(
                    "is-selected"
                );
                item.setAttribute(
                    "aria-pressed",
                    "false"
                );
            });

        answerButton?.classList.add(
            "is-selected"
        );
        answerButton?.setAttribute(
            "aria-pressed",
            "true"
        );

        const confirmBtn =
            surface?.querySelector?.(
                "#questionsChoiceConfirmBtn"
            ) ||
            document.getElementById(
                "questionsChoiceConfirmBtn"
            );

        if (!confirmBtn) {
            return;
        }

        confirmBtn.disabled = false;
        confirmBtn.dataset.selectedIndex =
            answerButton?.dataset
                ?.answerSelect || "";
    },

    submitSelectedChoice(
        surface = document
    ) {
        const confirmBtn =
            surface?.querySelector?.(
                "#questionsChoiceConfirmBtn"
            ) ||
            document.getElementById(
                "questionsChoiceConfirmBtn"
            );
        const selectedIndex =
            Number(
                confirmBtn?.dataset
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
    },

    handleSessionSurfaceSubmit(
        event,
        surface
    ) {
        const target =
            event.target instanceof Element
                ? event.target
                : null;

        if (!target) {
            return;
        }

        if (
            target.matches(
                "#questionsInputForm"
            )
        ) {
            event.preventDefault();
            this.page.submitAnswer({
                index: null,
                value:
                    this.getActiveInputAnswerValue(
                        surface
                    )
            });
            return;
        }

        if (
            target.matches(
                "#questionsContestForm"
            )
        ) {
            event.preventDefault();
            const field =
                surface.querySelector(
                    "#questionsContestInput"
                ) ||
                document.getElementById(
                    "questionsContestInput"
                );

            this.page.submitQuestionContest(
                String(
                    field?.value || ""
                )
            );
        }
    },

    isSessionEventTarget(target) {
        return Boolean(
            target?.closest(
                "#questionsSession, #questionsFloatingWindow"
            )
        );
    },

    getActiveInputAnswerValue(
        surface = document
    ) {
        const field =
            surface?.querySelector?.(
                "#questionsInputField"
            ) ||
            document.getElementById(
                "questionsInputField"
            );

        return String(
            field?.value || ""
        ).trim();
    },

    getActiveOrderingAnswerValue(
        surface = document
    ) {
        return [
            ...(
                surface?.querySelectorAll?.(
                    "#questionsOrderingList [data-order-value]"
                ) ||
                document.querySelectorAll(
                "#questionsOrderingList [data-order-value]"
                )
            )
        ].map(
            (item) => item.dataset.orderValue
        );
    },

    bindSessionDelegation() {
        if (this.sessionEventsBound) {
            return;
        }

        this.sessionEventsBound = true;

        document.addEventListener(
            "click",
            (event) => {
                const target =
                    event.target instanceof
                    Element
                        ? event.target
                        : null;

                if (!target) {
                    return;
                }

                if (
                    !this.isSessionEventTarget(
                        target
                    )
                ) {
                    return;
                }

                const answerButton =
                    target.closest(
                        "[data-answer-select]"
                    );

                if (answerButton) {
                    const group =
                        answerButton.closest(
                            ".questions-options"
                        );

                    group
                        ?.querySelectorAll(
                            "[data-answer-select]"
                        )
                        .forEach((item) => {
                            item.classList.remove(
                                "is-selected"
                            );
                        });

                    answerButton.classList.add(
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
                            answerButton.dataset.answerSelect ||
                            "";
                    }

                    return;
                }

                const choiceConfirmBtn =
                    target.closest(
                        "#questionsChoiceConfirmBtn"
                    );

                if (choiceConfirmBtn) {
                    const selectedIndex =
                        Number(
                            choiceConfirmBtn
                                ?.dataset
                                ?.selectedIndex
                        );

                    if (
                        Number.isFinite(
                            selectedIndex
                        )
                    ) {
                        this.page.submitAnswer({
                            index: selectedIndex
                        });
                    }

                    return;
                }

                const inputConfirmBtn =
                    target.closest(
                        "#questionsInputConfirmBtn"
                    );

                if (inputConfirmBtn) {
                    event.preventDefault();
                    this.page.submitAnswer({
                        index: null,
                        value:
                            this.getActiveInputAnswerValue()
                    });
                    return;
                }

                const orderingMoveBtn =
                    target.closest(
                        "[data-order-move]"
                    );

                if (orderingMoveBtn) {
                    this.moveOrderItem(
                        orderingMoveBtn
                    );
                    return;
                }

                const orderingSubmitBtn =
                    target.closest(
                        "#questionsOrderingSubmitBtn"
                    );

                if (orderingSubmitBtn) {
                    this.page.submitAnswer({
                        index: null,
                        value:
                            this.getActiveOrderingAnswerValue()
                    });
                    return;
                }

                const continueBtn =
                    target.closest(
                        "#questionsContinueBtn"
                    );

                if (continueBtn) {
                    this.page.continueSession();
                    return;
                }

                const retryBtn =
                    target.closest(
                        "#questionsRetryBtn"
                    );

                if (retryBtn) {
                    this.page.retryCurrentQuestion();
                    return;
                }

                const backBtn =
                    target.closest(
                        "#questionsBackBtn"
                    );

                if (backBtn) {
                    this.page.pauseSession();
                    return;
                }

                const restartBtn =
                    target.closest(
                        "#questionsRestartBtn"
                    );

                if (restartBtn) {
                    this.page.restartSession();
                    return;
                }

                const sessionSaveProfileBtn =
                    target.closest(
                        "#questionsSessionSmartSaveProfileBtn"
                    );

                if (
                    sessionSaveProfileBtn
                ) {
                    this.page.saveCurrentSmartProfile();
                    return;
                }

                const sessionSaveBlockBtn =
                    target.closest(
                        "#questionsSessionSmartSaveBlockBtn"
                    );

                if (
                    sessionSaveBlockBtn
                ) {
                    this.page.saveCurrentSmartBlock();
                    return;
                }

                const sessionClearBtn =
                    target.closest(
                        "#questionsSessionSmartClearBtn"
                    );

                if (sessionClearBtn) {
                    this.page.clearSmartExclusions();
                    return;
                }

                const weakBtn =
                    target.closest(
                        "#questionsFocusWeakBtn"
                    );

                if (weakBtn) {
                    this.page.startFollowUp(
                        "weak_topic"
                    );
                    return;
                }

                const reviewErrorsBtn =
                    target.closest(
                        "#questionsReviewErrorsBtn"
                    );

                if (reviewErrorsBtn) {
                    this.page.startFollowUp(
                        "review_errors"
                    );
                    return;
                }

                const mixedReviewBtn =
                    target.closest(
                        "#questionsMixedReviewBtn"
                    );

                if (mixedReviewBtn) {
                    this.page.startFollowUp(
                        "mixed_review"
                    );
                    return;
                }

                const resultsBackBtn =
                    target.closest(
                        "#questionsResultsBackBtn"
                    );

                if (resultsBackBtn) {
                    this.page.openLauncher();
                    return;
                }

                const smartGoalBtn =
                    target.closest(
                        "[data-smart-goal]"
                    );

                if (smartGoalBtn) {
                    this.page.setSmartGoal(
                        smartGoalBtn.dataset
                            .smartGoal
                    );
                    return;
                }

                const amountBtn =
                    target.closest(
                        "[data-amount]"
                    );

                if (amountBtn) {
                    this.page.updateContext({
                        quantidadeQuestoes:
                            Number(
                                amountBtn.dataset
                                    .amount
                            )
                    });
                }
            }
        );

        document.addEventListener(
            "submit",
            (event) => {
                const target =
                    event.target instanceof
                    Element
                        ? event.target
                        : null;

                if (
                    !target ||
                    !this.isSessionEventTarget(
                        target
                    )
                ) {
                    return;
                }

                if (
                    target.matches(
                        "#questionsInputForm"
                    )
                ) {
                    event.preventDefault();
                    this.page.submitAnswer({
                        index: null,
                        value:
                            this.getActiveInputAnswerValue()
                    });
                    return;
                }

                if (
                    target.matches(
                        "#questionsContestForm"
                    )
                ) {
                    event.preventDefault();
                    const field =
                        document.getElementById(
                            "questionsContestInput"
                        );

                    this.page.submitQuestionContest(
                        String(
                            field?.value || ""
                        )
                    );
                }
            }
        );
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

    escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
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
        const model =
            page.launcherViewModels
                ?.buildLauncherHomeViewModel
                ? page.launcherViewModels.buildLauncherHomeViewModel()
                : null;
        const bankStatus =
            model?.bankStatus ??
            page.data.bankStatus;
        const isLoading =
            model?.isLoading ??
            (bankStatus === "loading");
        const isError =
            model?.isError ??
            (bankStatus === "error");
        const launcherNotice =
            model?.launcherNotice ??
            (
                isError
                    ? page.getRuntimeNotice()
                    : isLoading
                        ? "Preparando o banco escolar para liberar o treino."
                        : page.getRuntimeNotice()
            );
        const recentRuns =
            model?.recentRuns ||
            QuestionsStore.getRuns({
                status: "in_progress"
            });
        const savedBlocks =
            model?.savedBlocks ||
            QuestionsStore.getSavedBlocks();

        return `
            <section class="questions-card questions-entry-card">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Questions</div>
                        <h2>Escolha o caminho</h2>
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
                        </div>
                        <button class="questions-primary-btn" type="button" data-launcher-view="smart_start" ${isLoading || isError ? "disabled" : ""}>
                            ${isLoading ? "Preparando..." : isError ? "Indisponivel" : "Comecar"}
                        </button>
                    </article>

                    <article class="questions-entry-option questions-entry-option-specific">
                        <div class="questions-entry-copy">
                            <h3>Progresso</h3>
                        </div>
                        <button class="questions-secondary-btn" type="button" data-launcher-view="specific" ${isLoading || isError ? "disabled" : ""}>
                            ${isLoading ? "Preparando..." : isError ? "Indisponivel" : "Entrar"}
                        </button>
                    </article>

                    <article class="questions-entry-option questions-entry-option-saved">
                        <div class="questions-entry-copy">
                            <h3>Guardados</h3>
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

    formatSerieLabel(serieValue) {
        const numeric =
            Number(serieValue);

        if (
            !Number.isFinite(numeric) ||
            numeric <= 0
        ) {
            return "Serie";
        }

        return `${numeric}ª Série`;
    },

    formatHubHours(totalHours) {
        const safeHours =
            Number(totalHours) || 0;

        if (safeHours <= 0) {
            return "0 h";
        }

        if (safeHours < 1) {
            return `${Math.max(1, Math.round(safeHours * 60))} min`;
        }

        return `${safeHours
            .toFixed(safeHours >= 10 ? 0 : 1)
            .replace(".", ",")} h`;
    },

    buildHubBreakdownBySubject(
        entries = []
    ) {
        const grouped = new Map();

        (entries || []).forEach((entry) => {
            const key =
                String(
                    entry?.subjectKey || ""
                ).trim() || "geral";
            const current =
                grouped.get(key) || {
                    subjectKey: key,
                    subjectLabel:
                        String(
                            entry?.subjectLabel ||
                                "Materia"
                        ).trim() ||
                        "Materia",
                    attempts: 0,
                    hits: 0,
                    errors: 0,
                    totalTime: 0,
                    topicCount: 0
                };

            current.attempts +=
                Number(
                    entry?.attempts || 0
                );
            current.hits += Number(
                entry?.hits || 0
            );
            current.errors += Number(
                entry?.errors || 0
            );
            current.totalTime +=
                (Number(
                    entry?.avgTime || 0
                ) || 0) *
                (Number(
                    entry?.attempts || 0
                ) || 0);
            current.topicCount += 1;

            grouped.set(key, current);
        });

        return [...grouped.values()]
            .map((entry) => ({
                ...entry,
                accuracy:
                    entry.attempts > 0
                        ? Math.round(
                            (entry.hits /
                                entry.attempts) *
                                100
                        )
                        : 0,
                errorRate:
                    entry.attempts > 0
                        ? Math.round(
                            (entry.errors /
                                entry.attempts) *
                                100
                        )
                        : 0,
                avgTimeMs:
                    entry.attempts > 0
                        ? entry.totalTime /
                          entry.attempts
                        : 0
            }))
            .sort((left, right) =>
                right.attempts -
                    left.attempts ||
                left.accuracy -
                    right.accuracy
            );
    },

    buildHubBreakdownBySerie(
        sessions = []
    ) {
        const grouped = new Map();

        (sessions || []).forEach((session) => {
            const serieKey =
                Number(session?.serie) || 0;
            const current =
                grouped.get(serieKey) || {
                    serie: serieKey,
                    label:
                        this.formatSerieLabel(
                            serieKey
                        ),
                    attempts: 0,
                    hits: 0,
                    errors: 0,
                    sessions: 0,
                    totalTime: 0
                };

            current.attempts +=
                Number(
                    session?.amount || 0
                );
            current.hits += Number(
                session?.hits || 0
            );
            current.errors +=
                Number(
                    session?.errors || 0
                );
            current.sessions += 1;
            current.totalTime +=
                (Number(
                    session?.avgTimeMs || 0
                ) || 0) *
                (Number(
                    session?.amount || 0
                ) || 0);

            grouped.set(
                serieKey,
                current
            );
        });

        return [...grouped.values()]
            .map((entry) => ({
                ...entry,
                accuracy:
                    entry.attempts > 0
                        ? Math.round(
                            (entry.hits /
                                entry.attempts) *
                                100
                        )
                        : 0,
                avgTimeMs:
                    entry.attempts > 0
                        ? entry.totalTime /
                          entry.attempts
                        : 0
            }))
            .sort(
                (left, right) =>
                    left.serie -
                    right.serie
            );
    },

    buildHubBreakdownBySubjectFromSessions(
        sessions = []
    ) {
        const grouped = new Map();

        (sessions || []).forEach((session) => {
            const key =
                String(
                    session?.subjectKey || ""
                ).trim() || "geral";
            const current =
                grouped.get(key) || {
                    subjectKey: key,
                    subjectLabel:
                        String(
                            session?.subjectLabel ||
                                "Materia"
                        ).trim() ||
                        "Materia",
                    attempts: 0,
                    hits: 0,
                    errors: 0,
                    sessions: 0,
                    totalTime: 0,
                    topicCount: 0,
                    topicKeys: new Set()
                };

            const amount =
                Number(
                    session?.amount || 0
                ) || 0;

            current.attempts += amount;
            current.hits +=
                Number(
                    session?.hits || 0
                ) || 0;
            current.errors +=
                Number(
                    session?.errors || 0
                ) || 0;
            current.sessions += 1;
            current.totalTime +=
                (Number(
                    session?.avgTimeMs || 0
                ) || 0) * amount;

            (
                session?.topicKeys || []
            ).forEach((topicKey) => {
                if (topicKey) {
                    current.topicKeys.add(
                        topicKey
                    );
                }
            });

            grouped.set(key, current);
        });

        return [...grouped.values()]
            .map((entry) => ({
                ...entry,
                topicCount:
                    entry.topicKeys.size,
                accuracy:
                    entry.attempts > 0
                        ? Math.round(
                            (entry.hits /
                                entry.attempts) *
                                100
                        )
                        : 0,
                errorRate:
                    entry.attempts > 0
                        ? Math.round(
                            (entry.errors /
                                entry.attempts) *
                                100
                        )
                        : 0,
                avgTimeMs:
                    entry.attempts > 0
                        ? entry.totalTime /
                          entry.attempts
                        : 0,
                totalTimeMs:
                    entry.totalTime
            }))
            .sort((left, right) =>
                right.attempts -
                    left.attempts ||
                left.accuracy -
                    right.accuracy
            );
    },

    buildHubTopicBreakdown(
        entries = []
    ) {
        return (entries || [])
            .map((entry) => ({
                topicKey:
                    String(
                        entry?.topicKey || ""
                    ).trim(),
                topicLabel:
                    String(
                        entry?.topicLabel ||
                            "Assunto"
                    ).trim() ||
                    "Assunto",
                attempts:
                    Number(
                        entry?.attempts || 0
                    ) || 0,
                hits:
                    Number(
                        entry?.hits || 0
                    ) || 0,
                errors:
                    Number(
                        entry?.errors || 0
                    ) || 0,
                avgTimeMs:
                    Number(
                        entry?.avgTime || 0
                    ) || 0,
                totalTimeMs:
                    (Number(
                        entry?.avgTime || 0
                    ) || 0) *
                    (Number(
                        entry?.attempts || 0
                    ) || 0)
            }))
            .map((entry) => ({
                ...entry,
                accuracy:
                    entry.attempts > 0
                        ? Math.round(
                            (entry.hits /
                                entry.attempts) *
                                100
                        )
                        : 0,
                errorRate:
                    entry.attempts > 0
                        ? Math.round(
                            (entry.errors /
                                entry.attempts) *
                                100
                        )
                        : 0
            }))
            .sort((left, right) =>
                right.attempts -
                    left.attempts ||
                left.accuracy -
                    right.accuracy
            );
    },

    buildProgressHubLevel(
        dashboard = {}
    ) {
        const attempts =
            Number(
                dashboard?.attempts || 0
            ) || 0;
        const accuracy =
            Math.round(
                (Number(
                    dashboard?.accuracy || 0
                ) || 0) * 100
            );
        const level =
            Math.max(
                1,
                Math.floor(attempts / 60) +
                    1
            );
        const progress =
            Math.round(
                ((attempts % 60) / 60) *
                    100
            );
        const titles = [
            "Primeiros passos",
            "Tracao",
            "Consolidacao",
            "Pulso firme",
            "Leitura madura",
            "Mapa avancado",
            "Dominio em formacao"
        ];
        const tierLabel =
            titles[
                Math.min(
                    titles.length - 1,
                    Math.floor(
                        (level - 1) / 2
                    )
                )
            ];
        let note =
            "A central vai ficando mais precisa conforme voce responde blocos variados.";

        if (accuracy >= 80) {
            note =
                "O ritmo ja esta forte. Vale misturar assuntos e puxar refinamento.";
        } else if (attempts >= 40) {
            note =
                "Ja existe massa critica suficiente para sugerir reforcos com mais seguranca.";
        }

        return {
            level,
            progress,
            tierLabel,
            note
        };
    },

    buildProgressHubRadarMetrics(
        payload = {}
    ) {
        const attempts =
            Number(
                payload.attempts || 0
            ) || 0;
        const hits =
            Number(payload.hits || 0) ||
            0;
        const errors =
            Number(
                payload.errors || 0
            ) || 0;
        const sessions =
            Number(
                payload.sessions || 0
            ) || 0;
        const avgTimeMs =
            Number(
                payload.avgTimeMs || 0
            ) || 0;
        const accuracy =
            Number(
                payload.accuracy || 0
            ) || 0;
        const coveredTopics =
            Number(
                payload.coveredTopics || 0
            ) || 0;
        const totalTopics =
            Number(
                payload.totalTopics || 0
            ) || 0;
        const clamp =
            (value) =>
                Math.max(
                    0,
                    Math.min(
                        100,
                        Math.round(value)
                    )
                );

        return [
            {
                label: "Precisao",
                value: clamp(accuracy)
            },
            {
                label: "Cobertura",
                value: totalTopics
                    ? clamp(
                        (coveredTopics /
                            totalTopics) *
                            100
                    )
                    : 0
            },
            {
                label: "Ritmo",
                value: avgTimeMs
                    ? clamp(
                        100 -
                            ((avgTimeMs -
                                12000) /
                                26000) *
                                100
                    )
                    : 36
            },
            {
                label: "Constancia",
                value: sessions
                    ? clamp(
                        (Math.min(
                            sessions,
                            10
                        ) /
                            10) *
                            100
                    )
                    : 0
            },
            {
                label: "Tracao",
                value: clamp(
                    (Math.min(
                        attempts,
                        120
                    ) /
                        120) *
                        100
                )
            },
            {
                label: "Dominio",
                value: attempts
                    ? clamp(
                        (((hits - errors) /
                            attempts) +
                            1) *
                            50
                    )
                    : 0
            }
        ];
    },

    renderProgressHubRadar(
        metrics = []
    ) {
        const safeMetrics =
            Array.isArray(metrics) &&
            metrics.length
                ? metrics
                : [];
        const size = 280;
        const center = 140;
        const radius = 88;
        const rings = [0.25, 0.5, 0.75, 1];
        const total =
            safeMetrics.length || 1;
        const pointFor =
            (
                factor,
                index,
                extra = 0
            ) => {
                const angle =
                    (-Math.PI / 2) +
                    (Math.PI * 2 * index) /
                        total;
                const finalRadius =
                    radius * factor + extra;

                return {
                    x:
                        center +
                        Math.cos(angle) *
                            finalRadius,
                    y:
                        center +
                        Math.sin(angle) *
                            finalRadius
                };
            };

        return `
            <div class="questions-hub-radar-shell">
                <svg class="questions-hub-radar-svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Radar de desempenho">
                    ${rings.map((ring) => {
                        const points =
                            safeMetrics
                                .map(
                                    (
                                        _metric,
                                        index
                                    ) => {
                                        const point =
                                            pointFor(
                                                ring,
                                                index
                                            );

                                        return `${point.x},${point.y}`;
                                    }
                                )
                                .join(" ");

                        return `<polygon class="questions-hub-radar-ring" points="${points}"></polygon>`;
                    }).join("")}
                    ${safeMetrics.map((_metric, index) => {
                        const point =
                            pointFor(
                                1,
                                index
                            );

                        return `<line class="questions-hub-radar-spoke" x1="${center}" y1="${center}" x2="${point.x}" y2="${point.y}"></line>`;
                    }).join("")}
                    <polygon class="questions-hub-radar-shape" points="${safeMetrics.map((metric, index) => {
                        const point =
                            pointFor(
                                Math.max(
                                    0,
                                    Math.min(
                                        1,
                                        (Number(
                                            metric?.value
                                        ) || 0) /
                                            100
                                    )
                                ),
                                index
                            );

                        return `${point.x},${point.y}`;
                    }).join(" ")}"></polygon>
                    ${safeMetrics.map((metric, index) => {
                        const point =
                            pointFor(
                                Math.max(
                                    0,
                                    Math.min(
                                        1,
                                        (Number(
                                            metric?.value
                                        ) || 0) /
                                            100
                                    )
                                ),
                                index
                            );

                        return `<circle class="questions-hub-radar-dot" cx="${point.x}" cy="${point.y}" r="4"></circle>`;
                    }).join("")}
                </svg>
                ${safeMetrics.map((metric, index) => {
                    const point =
                        pointFor(
                            1,
                            index,
                            26
                        );

                    return `
                        <div class="questions-hub-radar-label" style="left:${point.x}px; top:${point.y}px;">
                            <span>${this.escapeHtml(metric.label)}</span>
                            <strong>${Number(metric.value) || 0}</strong>
                        </div>
                    `;
                }).join("")}
            </div>
        `;
    },

    buildProgressHubModel() {
        const page =
            this.page;
        const ctx =
            QuestionsContext.get();
        const baseOptions = [
            {
                key: "ESCOLAR",
                label: "Escolar"
            },
            {
                key: "ENEM",
                label: "ENEM"
            },
            {
                key: "VESTIBULAR",
                label: "Vestibulares"
            }
        ];
        const statsSection =
            String(
                ctx.statsSection ||
                    "resumo"
            )
                .trim()
                .toLowerCase() || "resumo";
        const baseKey =
            baseOptions.find(
                (item) =>
                    item.key ===
                    String(
                        ctx.statsBase ||
                            ctx.base ||
                            "ESCOLAR"
                    )
                        .trim()
                        .toUpperCase()
            )?.key || "ESCOLAR";
        const allEntries =
            QuestionsStore.getTopicEntries({
                baseKey
            });
        const allSessions =
            QuestionsStore.getRecentSessions({
                baseKey
            });
        const series =
            QuestionsService.getSeriesOptions(
                page
            ).map((item) => ({
                ...item,
                label:
                    this.formatSerieLabel(
                        item.key
                    )
            }));
        const statsScope =
            String(
                ctx.statsScope || "geral"
            )
                .trim()
                .toLowerCase() || "geral";
        const activeSerie =
            series.find(
                (item) =>
                    Number(item.key) ===
                    Number(
                        ctx.statsSerie ||
                            ctx.serie
                    )
            )?.key ||
            series[0]?.key ||
            Number(
                ctx.statsSerie ||
                    ctx.serie
            ) ||
            1;
        const subjects =
            QuestionsService.getSubjectOptions(
                page,
                activeSerie
            );
        const activeSubject =
            subjects.find(
                (item) =>
                    item.key ===
                    String(
                        ctx.statsMateria ||
                            ctx.materia
                    )
            )?.key ||
            subjects[0]?.key ||
            "";
        const topicOptions =
            QuestionsService.getTopicOptions(
                page,
                {
                    serie: activeSerie,
                    materia: activeSubject
                }
            );
        const activeTopicKey =
            topicOptions.find(
                (item) =>
                    item.key ===
                    String(
                        ctx.statsTopicKey ||
                            ""
                    )
            )?.key ||
            topicOptions[0]?.key ||
            "";
        const overallDashboard =
            QuestionsStore.getDashboard({
                baseKey
            });
        const serieSessions =
            allSessions.filter(
                (session) =>
                    Number(
                        session?.serie
                    ) ===
                    Number(activeSerie)
            );
        const activeSessions =
            serieSessions.filter(
                (session) =>
                    (!activeSubject ||
                        session.subjectKey ===
                            activeSubject)
            );
        const activeTotals =
            activeSessions.reduce(
                (acc, session) => {
                    const amount =
                        Number(
                            session?.amount || 0
                        ) || 0;

                    acc.attempts += amount;
                    acc.hits +=
                        Number(
                            session?.hits || 0
                        ) || 0;
                    acc.errors +=
                        Number(
                            session?.errors || 0
                        ) || 0;
                    acc.sessions += 1;
                    acc.totalTime +=
                        (Number(
                            session?.avgTimeMs ||
                                0
                        ) || 0) * amount;

                    (
                        session?.topicKeys || []
                    ).forEach((topicKey) => {
                        if (topicKey) {
                            acc.topicKeys.add(
                                topicKey
                            );
                        }
                    });

                    return acc;
                },
                {
                    attempts: 0,
                    hits: 0,
                    errors: 0,
                    sessions: 0,
                    totalTime: 0,
                    topicKeys: new Set()
                }
            );
        const activeAccuracy =
            activeTotals.attempts > 0
                ? Math.round(
                    (activeTotals.hits /
                        activeTotals.attempts) *
                        100
                )
                : 0;
        const activeAvgTimeMs =
            activeTotals.attempts > 0
                ? activeTotals.totalTime /
                  activeTotals.attempts
                : 0;
        const subjectBreakdown =
            this.buildHubBreakdownBySubject(
                allEntries
            );
        const serieSubjectBreakdown =
            this.buildHubBreakdownBySubjectFromSessions(
                serieSessions
            );
        const topicBreakdown =
            this.buildHubTopicBreakdown(
                activeSubject
                    ? QuestionsStore.getTopicEntries(
                        {
                            baseKey,
                            subjectKey:
                                activeSubject
                        }
                    )
                    : []
            );
        const selectedTopicEntry =
            topicBreakdown.find(
                (item) =>
                    item.topicKey ===
                    activeTopicKey
            ) || null;
        const topicSessionCount =
            activeTopicKey
                ? activeSessions.filter(
                    (session) =>
                        Array.isArray(
                            session?.topicKeys
                        ) &&
                        session.topicKeys.includes(
                            activeTopicKey
                        )
                ).length
                : 0;
        const weakOverall =
            QuestionsStore.getWeakTopics({
                baseKey,
                minAttempts: 1,
                minErrors: 1
            }).slice(0, 6);
        const weakSubject =
            activeSubject
                ? QuestionsStore.getWeakTopics(
                    {
                        baseKey,
                        subjectKey:
                            activeSubject,
                        minAttempts: 1,
                        minErrors: 1
                    }
                ).slice(0, 5)
                : [];
        const strongOverall =
            QuestionsStore.getStrongTopics({
                baseKey
            }).slice(0, 5);
        const strongSubject =
            activeSubject
                ? QuestionsStore.getStrongTopics(
                    {
                        baseKey,
                        subjectKey:
                            activeSubject
                    }
                ).slice(0, 4)
                : [];
        const seriesBreakdown =
            this.buildHubBreakdownBySerie(
                allSessions
            );
        const strongestSubject =
            subjectBreakdown
                .filter(
                    (item) =>
                        item.attempts > 0
                )
                .sort((left, right) =>
                    right.accuracy -
                        left.accuracy ||
                    right.attempts -
                        left.attempts
                )[0] || null;
        const hardestSubject =
            subjectBreakdown
                .filter(
                    (item) =>
                        item.attempts > 0
                )
                .sort((left, right) =>
                    right.errors -
                        left.errors ||
                    left.accuracy -
                        right.accuracy
                )[0] || null;
        const overallHours =
            ((Number(
                overallDashboard.avgTimeMs ||
                    0
            ) || 0) *
                (Number(
                    overallDashboard.attempts ||
                        0
                ) || 0)) /
            3600000;
        const scopeOptions = [
            {
                key: "geral",
                label: "Tudo"
            },
            {
                key: "serie",
                label: "Serie"
            },
            {
                key: "materia",
                label: "Materia"
            },
            {
                key: "assunto",
                label: "Assunto"
            }
        ];
        let scopeLabel =
            "Visao geral";
        let scopeSummary =
            "Panorama completo do historico";
        let radarSource = {
            attempts:
                overallDashboard.attempts,
            hits: overallDashboard.hits,
            errors:
                overallDashboard.errors,
            sessions:
                overallDashboard.totalSessions,
            avgTimeMs:
                overallDashboard.avgTimeMs,
            accuracy: Math.round(
                (overallDashboard.accuracy ||
                    0) * 100
            ),
            coveredTopics:
                overallDashboard.entries
                    ?.filter(
                        (item) =>
                            item.attempts > 0
                    ).length || 0,
            totalTopics:
                overallDashboard.entries
                    ?.length || 0
        };
        let focusWeakTopics =
            weakOverall;
        let focusStrongTopics =
            strongOverall;
        let timeChartItems =
            subjectBreakdown.map(
                (item) => ({
                    key: item.subjectKey,
                    label:
                        item.subjectLabel,
                    avgTimeMs:
                        item.avgTimeMs,
                    totalTimeMs:
                        item.totalTime,
                    attempts:
                        item.attempts
                })
            );

        if (statsScope === "serie") {
            scopeLabel =
                this.formatSerieLabel(
                    activeSerie
                );
            scopeSummary =
                `Leitura apenas da ${scopeLabel}`;
            radarSource = {
                attempts:
                    activeTotals.attempts,
                hits: activeTotals.hits,
                errors:
                    activeTotals.errors,
                sessions:
                    activeTotals.sessions,
                avgTimeMs:
                    activeAvgTimeMs,
                accuracy:
                    activeAccuracy,
                coveredTopics:
                    activeTotals.topicKeys
                        .size,
                totalTopics:
                    serieSubjectBreakdown.reduce(
                        (acc, item) =>
                            acc +
                            (item.topicCount ||
                                0),
                        0
                    )
            };
            focusWeakTopics =
                weakOverall.filter(
                    (item) =>
                        serieSubjectBreakdown.some(
                            (subject) =>
                                subject.subjectKey ===
                                item.subjectKey
                        )
                );
            focusStrongTopics =
                strongOverall.filter(
                    (item) =>
                        serieSubjectBreakdown.some(
                            (subject) =>
                                subject.subjectKey ===
                                item.subjectKey
                        )
                );
            timeChartItems =
                serieSubjectBreakdown.map(
                    (item) => ({
                        key: item.subjectKey,
                        label:
                            item.subjectLabel,
                        avgTimeMs:
                            item.avgTimeMs,
                        totalTimeMs:
                            item.totalTimeMs,
                        attempts:
                            item.attempts
                    })
                );
        }

        if (statsScope === "materia") {
            scopeLabel =
                subjects.find(
                    (item) =>
                        item.key ===
                        activeSubject
                )?.label ||
                "Materia";
            scopeSummary =
                `${scopeLabel} na ${this.formatSerieLabel(activeSerie)}`;
            radarSource = {
                attempts:
                    activeTotals.attempts,
                hits: activeTotals.hits,
                errors:
                    activeTotals.errors,
                sessions:
                    activeTotals.sessions,
                avgTimeMs:
                    activeAvgTimeMs,
                accuracy:
                    activeAccuracy,
                coveredTopics:
                    topicBreakdown.filter(
                        (item) =>
                            item.attempts > 0
                    ).length,
                totalTopics:
                    topicOptions.length
            };
            focusWeakTopics =
                weakSubject;
            focusStrongTopics =
                strongSubject;
            timeChartItems =
                topicBreakdown.map(
                    (item) => ({
                        key: item.topicKey,
                        label:
                            item.topicLabel,
                        avgTimeMs:
                            item.avgTimeMs,
                        totalTimeMs:
                            item.totalTimeMs,
                        attempts:
                            item.attempts
                    })
                );
        }

        if (statsScope === "assunto") {
            scopeLabel =
                topicOptions.find(
                    (item) =>
                        item.key ===
                        activeTopicKey
                )?.label ||
                "Assunto";
            scopeSummary =
                `${scopeLabel} em ${subjects.find((item) => item.key === activeSubject)?.label || "Materia"}`;
            radarSource = {
                attempts:
                    selectedTopicEntry
                        ?.attempts || 0,
                hits:
                    selectedTopicEntry?.hits ||
                    0,
                errors:
                    selectedTopicEntry
                        ?.errors || 0,
                sessions:
                    topicSessionCount,
                avgTimeMs:
                    selectedTopicEntry
                        ?.avgTimeMs || 0,
                accuracy:
                    selectedTopicEntry
                        ?.accuracy || 0,
                coveredTopics:
                    selectedTopicEntry
                        ?.attempts
                        ? 1
                        : 0,
                totalTopics: 1
            };
            focusWeakTopics =
                selectedTopicEntry &&
                selectedTopicEntry.errors >
                    0
                    ? [selectedTopicEntry]
                    : [];
            focusStrongTopics =
                selectedTopicEntry &&
                selectedTopicEntry.hits > 0
                    ? [selectedTopicEntry]
                    : [];
            timeChartItems = selectedTopicEntry
                ? [
                    {
                        key:
                            selectedTopicEntry.topicKey,
                        label:
                            selectedTopicEntry.topicLabel,
                        avgTimeMs:
                            selectedTopicEntry.avgTimeMs,
                        totalTimeMs:
                            selectedTopicEntry.totalTimeMs,
                        attempts:
                            selectedTopicEntry.attempts
                    }
                ]
                : [];
        }
        const recommendations = [];

        if (focusWeakTopics[0]) {
            recommendations.push({
                kicker:
                    "Reforco recomendado",
                title:
                    focusWeakTopics[0]
                        .topicLabel,
                note: `${focusWeakTopics[0].errors} erro(s) acumulados em ${focusWeakTopics[0].attempts} tentativa(s).`
            });
        } else if (weakOverall[0]) {
            recommendations.push({
                kicker:
                    "Primeiro ajuste",
                title:
                    weakOverall[0]
                        .topicLabel,
                note: "Esse assunto ja aparece como o mais sensivel na leitura geral."
            });
        }

        if (hardestSubject) {
            recommendations.push({
                kicker:
                    "Materia que pede cuidado",
                title:
                    hardestSubject.subjectLabel,
                note: `${hardestSubject.errorRate}% de erro no acumulado recente.`
            });
        }

        if (strongestSubject) {
            recommendations.push({
                kicker:
                    "Ponto forte atual",
                title:
                    strongestSubject.subjectLabel,
                note: `${strongestSubject.accuracy}% de acerto, bom para sustentar confianca e repertorio.`
            });
        }

        if (!recommendations.length) {
            recommendations.push({
                kicker:
                    "Painel em aquecimento",
                title:
                    "Seus sinais ainda vao nascer",
                note: "Assim que as primeiras sessoes entrarem, a central mostra reforcos, radar e tendencia com mais nitidez."
            });
        }

        return {
            statsSection,
            baseOptions,
            activeBase: baseKey,
            showSeriesFilters:
                baseKey === "ESCOLAR",
            scopeOptions,
            statsScope,
            series,
            subjects,
            topicOptions,
            activeTopicKey,
            activeSerie,
            activeSubject,
            scopeLabel,
            scopeSummary,
            activeSubjectLabel:
                subjects.find(
                    (item) =>
                        item.key ===
                        activeSubject
                )?.label || "Materia",
            overallDashboard,
            overallHours,
            activeTotals,
            activeAccuracy,
            activeAvgTimeMs,
            activeHours:
                activeTotals.totalTime /
                3600000,
            activeTopicCoverage:
                activeTotals.topicKeys
                    .size,
            availableTopicCount:
                topicOptions.length,
            weakOverall:
                focusWeakTopics,
            weakSubject:
                focusWeakTopics,
            strongOverall:
                focusStrongTopics,
            strongSubject:
                focusStrongTopics,
            subjectBreakdown,
            seriesBreakdown,
            serieSubjectBreakdown,
            topicBreakdown,
            strongestSubject,
            hardestSubject,
            level:
                this.buildProgressHubLevel(
                    overallDashboard
                ),
            radarMetrics:
                this.buildProgressHubRadarMetrics(
                    radarSource
                ),
            timeChartItems:
                timeChartItems.slice(0, 8),
            recommendations,
            recentSessions:
                allSessions.slice(0, 5)
        };
    },

    renderProgressHubSidebar(model) {
        const items = [
            {
                key: "resumo",
                label: "Resumo"
            },
            {
                key: "melhorar",
                label: "Onde melhorar"
            },
            {
                key: "evolucao",
                label: "Evolucao"
            },
            {
                key: "consistencia",
                label: "Consistencia"
            }
        ];

        return `
            <aside class="questions-hub-sidebar" aria-label="Tipos de estatistica">
                <div class="questions-hub-sidebar-head">
                    <span class="questions-hub-sidebar-kicker">Estatisticas</span>
                </div>
                ${items.map((item) => `
                    <button
                        class="questions-hub-nav-btn${model.statsSection === item.key ? " is-active" : ""}"
                        type="button"
                        data-hub-section="${item.key}">
                        ${this.escapeHtml(item.label)}
                    </button>
                `).join("")}
            </aside>
        `;
    },

    renderProgressHubContextBar(model) {
        return `
            <section class="questions-hub-toolbar" aria-label="Filtros de contexto">
                <div class="questions-hub-toolbar-group">
                    ${model.showSeriesFilters ? `
                        <label class="questions-hub-toolbar-field">
                            <span class="questions-hub-toolbar-label">Serie</span>
                            <span class="questions-hub-select-shell">
                                <select class="questions-hub-select" data-hub-serie-select>
                                    ${model.series.map((serie) => `
                                        <option value="${serie.key}"${Number(model.activeSerie) === Number(serie.key) ? " selected" : ""}>
                                            ${this.escapeHtml(serie.label)}
                                        </option>
                                    `).join("")}
                                </select>
                            </span>
                        </label>
                    ` : ""}
                </div>
                <div class="questions-hub-toolbar-meta">
                    ${this.escapeHtml(
                        model.statsSection === "resumo"
                            ? "Resumo"
                            : model.statsSection === "melhorar"
                                ? "Onde melhorar"
                                : model.statsSection === "evolucao"
                                    ? "Evolucao"
                                    : "Consistencia"
                    )}
                </div>
            </section>
        `;
    },

    renderProgressHubHero(model) {
        const accuracy =
            Math.round(
                (Number(
                    model?.overallDashboard
                        ?.accuracy || 0
                ) || 0) * 100
            );
        const avgTime =
            QuestionsService.formatTime(
                Number(
                    model?.overallDashboard
                        ?.avgTimeMs || 0
                ) || 0
            );
        const accuracyTone =
            accuracy >= 70
                ? "good"
                : accuracy >= 40
                    ? "warning"
                    : "danger";
        const timeTone =
            (Number(
                model?.overallDashboard
                    ?.avgTimeMs || 0
            ) || 0) <= 20000
                ? "good"
                : (Number(
                    model?.overallDashboard
                        ?.avgTimeMs || 0
                ) || 0) <= 40000
                    ? "warning"
                    : "danger";
        const levelTone =
            model?.level?.progress >= 70
                ? "good"
                : model?.level?.progress >= 35
                    ? "warning"
                    : "danger";
        return `
            <section class="questions-hub-summary-block" aria-label="Resumo essencial">
                <article class="questions-hub-summary-card questions-hub-summary-card--${accuracyTone}">
                    <span class="questions-hub-summary-label">Acerto geral</span>
                    <strong class="questions-hub-summary-value">${accuracy}%</strong>
                </article>
                <article class="questions-hub-summary-card questions-hub-summary-card--${timeTone}">
                    <span class="questions-hub-summary-label">Tempo medio</span>
                    <strong class="questions-hub-summary-value">${avgTime}</strong>
                </article>
                <article class="questions-hub-summary-card questions-hub-summary-card--${levelTone}">
                    <span class="questions-hub-summary-label">Nivel atual</span>
                    <strong class="questions-hub-summary-value">${model.level.level}</strong>
                </article>
            </section>
        `;
    },

    buildProgressHubImproveItems(
        model
    ) {
        const scopedItems =
            Array.isArray(
                model?.topicBreakdown
            )
                ? model.topicBreakdown
                    .filter(
                        (item) =>
                            Number(
                                item?.attempts || 0
                            ) > 0 &&
                            Number(
                                item?.errors || 0
                            ) > 0
                    )
                    .sort(
                        (left, right) =>
                            (Number(
                                right?.errors || 0
                            ) || 0) -
                                (Number(
                                    left?.errors || 0
                                ) || 0) ||
                            (Number(
                                right?.errorRate ||
                                    0
                            ) || 0) -
                                (Number(
                                    left?.errorRate ||
                                        0
                                ) || 0) ||
                            (Number(
                                right?.attempts ||
                                    0
                            ) || 0) -
                                (Number(
                                    left?.attempts ||
                                        0
                                ) || 0)
                    )
                : [];

        if (scopedItems.length) {
            return scopedItems
                .slice(0, 3)
                .map((item) => ({
                    topicKey: String(
                        item?.topicKey || ""
                    ).trim(),
                    topicLabel:
                        String(
                            item?.topicLabel ||
                                "Assunto"
                        ).trim() ||
                        "Assunto",
                    subjectKey:
                        String(
                            model?.activeSubject ||
                                ""
                        ).trim(),
                    serie:
                        Number(
                            model?.activeSerie || 0
                        ) || 1,
                    errors:
                        Number(
                            item?.errors || 0
                        ) || 0,
                    attempts:
                        Number(
                            item?.attempts || 0
                        ) || 0,
                    errorRate:
                        Number(
                            item?.errorRate || 0
                        ) || 0
                }));
        }

        const dashboardItems =
            Array.isArray(
                model?.overallDashboard
                    ?.weakTopics
            )
                ? model.overallDashboard
                    .weakTopics
                : [];

        if (dashboardItems.length) {
            return dashboardItems
                .filter(
                    (item) =>
                        Number(
                            item?.attempts || 0
                        ) > 0 &&
                        Number(
                            item?.errors || 0
                        ) > 0 &&
                        (!model?.activeSubject ||
                            String(
                                item?.subjectKey ||
                                    ""
                            ).trim() ===
                                String(
                                    model.activeSubject ||
                                        ""
                                ).trim())
                )
                .slice(0, 3)
                .map((item) => {
                    const attempts =
                        Number(
                            item?.attempts || 0
                        ) || 0;
                    const errors =
                        Number(
                            item?.errors || 0
                        ) || 0;
                    const ratio =
                        attempts > 0
                            ? errors /
                              attempts
                            : 0;

                    return {
                        topicKey: String(
                            item?.topicKey || ""
                        ).trim(),
                        topicLabel:
                            String(
                                item?.topicLabel ||
                                    "Assunto"
                            ).trim() ||
                            "Assunto",
                        subjectKey:
                            String(
                                item?.subjectKey ||
                                    model?.activeSubject ||
                                    ""
                            ).trim(),
                        serie:
                            Number(
                                model?.activeSerie || 0
                            ) || 1,
                        errors,
                        attempts,
                        errorRate:
                            Math.round(
                                ratio * 100
                            )
                    };
                });
        }

        const fallbackItems =
            Array.isArray(
                model?.weakOverall
            )
                ? model.weakOverall
                : [];

        return fallbackItems
            .filter(
                (item) =>
                    Number(
                        item?.attempts || 0
                    ) > 0 &&
                    Number(
                        item?.errors || 0
                    ) > 0
            )
            .slice(0, 3)
            .map((item) => {
                const attempts =
                    Number(
                        item?.attempts || 0
                    ) || 0;
                const errors =
                    Number(
                        item?.errors || 0
                    ) || 0;
                const ratio =
                    attempts > 0
                        ? errors / attempts
                        : 0;

                return {
                    topicKey: String(
                        item?.topicKey || ""
                    ).trim(),
                    topicLabel:
                        String(
                            item?.topicLabel ||
                                "Assunto"
                        ).trim() ||
                        "Assunto",
                    subjectKey:
                        String(
                            item?.subjectKey ||
                                model?.activeSubject ||
                                ""
                        ).trim(),
                    serie:
                        Number(
                            model?.activeSerie || 0
                        ) || 1,
                    errors,
                    attempts,
                    errorRate:
                        Math.round(
                            ratio * 100
                        )
                };
            });
    },

    getProgressHubImproveTone(
        errorRate
    ) {
        const value =
            Number(errorRate || 0) || 0;

        if (value > 70) {
            return "danger";
        }

        if (value >= 40) {
            return "warning";
        }

        return "good";
    },

    renderProgressHubImproveBlock(
        model
    ) {
        const items =
            this.buildProgressHubImproveItems(
                model
            );

        if (!items.length) {
            return `
                <section class="questions-hub-improve-block" aria-label="Onde melhorar agora">
                    <div class="questions-hub-improve-empty">
                        <span class="questions-hub-summary-label">Onde melhorar</span>
                        <strong class="questions-hub-improve-empty-value">Sem alerta forte por enquanto</strong>
                    </div>
                </section>
            `;
        }

        return `
            <section class="questions-hub-improve-block" aria-label="Onde melhorar agora">
                ${items.map((item, index) => {
                    const tone =
                        this.getProgressHubImproveTone(
                            item.errorRate
                        );

                    return `
                        <article class="questions-hub-improve-row questions-hub-improve-row--${tone}" style="--questions-hub-improve-width:${Math.max(10, item.errorRate)}%">
                            <div class="questions-hub-improve-rank">
                                0${index + 1}
                            </div>
                            <div class="questions-hub-improve-copy">
                                <strong class="questions-hub-improve-title">${this.escapeHtml(item.topicLabel)}</strong>
                                <div class="questions-hub-improve-bar" aria-hidden="true">
                                    <div class="questions-hub-improve-fill"></div>
                                </div>
                            </div>
                            <div class="questions-hub-improve-metric">
                                <span>${item.errorRate}% erro</span>
                                <strong>${item.errors}</strong>
                            </div>
                            <button
                                class="questions-hub-improve-train"
                                type="button"
                                data-hub-train-topic="${this.escapeHtml(item.topicKey)}"
                                data-hub-train-subject="${this.escapeHtml(item.subjectKey)}"
                                data-hub-train-serie="${item.serie}">
                                Treinar
                            </button>
                        </article>
                    `;
                }).join("")}
            </section>
        `;
    },

    buildProgressHubEvolutionModel(
        model
    ) {
        const baseKey =
            String(
                model?.activeBase || ""
            ).trim() ||
            "ESCOLAR";
        const runs =
            QuestionsStore.getRuns()
                .slice()
                .reverse();
        const answers = [];

        runs.forEach((run) => {
            (
                Array.isArray(
                    run?.answers
                )
                    ? run.answers
                    : []
            ).forEach((answer) => {
                if (
                    baseKey &&
                    String(
                        answer?.baseKey || ""
                    ).trim() !== baseKey
                ) {
                    return;
                }

                answers.push({
                    correct: Boolean(
                        answer?.correct
                    ),
                    timeMs:
                        Number(
                            answer?.timeMs || 0
                        ) || 0
                });
            });
        });

        const recentAnswers =
            answers.slice(-30);

        if (!recentAnswers.length) {
            return {
                hasData: false,
                label: "Sem historico recente",
                tone: "neutral",
                points: "",
                total: 0
            };
        }

        const smoothed =
            recentAnswers.map(
                (_entry, index, list) => {
                    const start =
                        Math.max(
                            0,
                            index - 3
                        );
                    const chunk =
                        list.slice(
                            start,
                            index + 1
                        );
                    const accuracy =
                        chunk.reduce(
                            (total, item) =>
                                total +
                                (item.correct
                                    ? 100
                                    : 0),
                            0
                        ) / chunk.length;

                    return Math.round(
                        accuracy
                    );
                }
            );

        const maxValue =
            Math.max(
                100,
                ...smoothed
            );
        const minValue =
            Math.min(
                0,
                ...smoothed
            );
        const width = 760;
        const height = 148;
        const paddingX = 10;
        const paddingY = 12;
        const usableWidth =
            width - paddingX * 2;
        const usableHeight =
            height - paddingY * 2;
        const span =
            Math.max(
                1,
                maxValue - minValue
            );
        const points =
            smoothed
                .map(
                    (
                        value,
                        index,
                        list
                    ) => {
                        const x =
                            paddingX +
                            (list.length ===
                            1
                                ? usableWidth /
                                  2
                                : (usableWidth /
                                      (list.length -
                                          1)) *
                                  index);
                        const y =
                            paddingY +
                            usableHeight -
                            ((value -
                                minValue) /
                                span) *
                                usableHeight;

                        return `${x.toFixed(
                            2
                        )},${y.toFixed(
                            2
                        )}`;
                    }
                )
                .join(" ");
        const half =
            Math.max(
                1,
                Math.floor(
                    smoothed.length / 2
                )
            );
        const firstHalf =
            smoothed.slice(0, half);
        const secondHalf =
            smoothed.slice(half);
        const firstAvg =
            firstHalf.reduce(
                (total, value) =>
                    total + value,
                0
            ) / firstHalf.length;
        const secondAvg =
            (secondHalf.length
                ? secondHalf
                : firstHalf
            ).reduce(
                (total, value) =>
                    total + value,
                0
            ) /
            (secondHalf.length ||
                firstHalf.length);
        const delta = Math.round(
            secondAvg - firstAvg
        );

        let tone = "neutral";
        let label = "Estavel";

        if (delta >= 8) {
            tone = "up";
            label = "Melhorando";
        } else if (delta <= -8) {
            tone = "down";
            label = "Piorando";
        }

        return {
            hasData: true,
            tone,
            label,
            points,
            total: recentAnswers.length,
            latest:
                smoothed[
                    smoothed.length - 1
                ] || 0
        };
    },

    renderProgressHubEvolutionBlock(
        model
    ) {
        const trend =
            this.buildProgressHubEvolutionModel(
                model
            );

        if (!trend.hasData) {
            return `
                <section class="questions-hub-evolution-block" aria-label="Evolucao recente">
                    <div class="questions-hub-improve-empty">
                        <span class="questions-hub-summary-label">Evolucao</span>
                        <strong class="questions-hub-improve-empty-value">Sem historico recente</strong>
                    </div>
                </section>
            `;
        }

        return `
            <section class="questions-hub-evolution-block" aria-label="Evolucao recente">
                <div class="questions-hub-evolution-head">
                    <span class="questions-hub-summary-label">Evolucao</span>
                    <strong class="questions-hub-evolution-trend questions-hub-evolution-trend--${trend.tone}">
                        ${this.escapeHtml(trend.label)}
                    </strong>
                </div>

                <div class="questions-hub-evolution-chart questions-hub-evolution-chart--${trend.tone}">
                    <svg class="questions-hub-evolution-svg" viewBox="0 0 760 148" preserveAspectRatio="none" role="img" aria-label="Tendencia das ultimas respostas">
                        <polyline
                            class="questions-hub-evolution-line"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="5"
                            points="${trend.points}">
                        </polyline>
                    </svg>
                </div>

                <div class="questions-hub-evolution-foot">
                    <span>ultimas ${trend.total} questoes</span>
                    <strong>${trend.latest}%</strong>
                </div>
            </section>
        `;
    },

    formatProgressHubDayKey(
        timestamp
    ) {
        const value =
            Number(timestamp || 0) || 0;

        if (!value) {
            return "";
        }

        const date =
            new Date(value);
        const year =
            date.getFullYear();
        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");
        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    },

    buildProgressHubConsistencyModel(
        model
    ) {
        const baseKey =
            String(
                model?.activeBase || ""
            ).trim() ||
            "ESCOLAR";
        const activeSerie =
            Number(
                model?.activeSerie || 0
            ) || 1;
        const sessions =
            QuestionsStore.getRecentSessions(
                {
                    baseKey
                }
            ).filter(
                (session) =>
                    Number(
                        session?.serie || 0
                    ) === activeSerie
            );
        const activeDays =
            new Set();

        sessions.forEach((session) => {
            const key =
                this.formatProgressHubDayKey(
                    session?.createdAt
                );

            if (key) {
                activeDays.add(key);
            }
        });

        const cells = [];
        const today =
            new Date();

        for (
            let offset = 27;
            offset >= 0;
            offset -= 1
        ) {
            const date =
                new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate() -
                        offset
                );
            const key =
                this.formatProgressHubDayKey(
                    date.getTime()
                );

            cells.push({
                key,
                active:
                    activeDays.has(key)
            });
        }

        const todayKey =
            this.formatProgressHubDayKey(
                today.getTime()
            );
        const yesterday =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - 1
            );
        const yesterdayKey =
            this.formatProgressHubDayKey(
                yesterday.getTime()
            );
        let anchorKey =
            activeDays.has(todayKey)
                ? todayKey
                : activeDays.has(
                    yesterdayKey
                )
                    ? yesterdayKey
                    : [...activeDays]
                        .sort()
                        .slice(-1)[0] ||
                        "";
        let streak = 0;

        while (anchorKey) {
            if (
                !activeDays.has(
                    anchorKey
                )
            ) {
                break;
            }

            streak += 1;
            const [year, month, day] =
                anchorKey
                    .split("-")
                    .map((part) =>
                        Number(part)
                    );
            const previous =
                new Date(
                    year,
                    month - 1,
                    day - 1
                );
            anchorKey =
                this.formatProgressHubDayKey(
                    previous.getTime()
                );
        }

        return {
            cells,
            streak
        };
    },

    renderProgressHubConsistencyBlock(
        model
    ) {
        const consistency =
            this.buildProgressHubConsistencyModel(
                model
            );

        return `
            <section class="questions-hub-consistency-block" aria-label="Consistencia recente">
                <div class="questions-hub-consistency-head">
                    <span class="questions-hub-summary-label">Consistencia</span>
                    <strong class="questions-hub-consistency-streak">${consistency.streak} dia${consistency.streak === 1 ? "" : "s"}</strong>
                </div>

                <div class="questions-hub-consistency-grid" aria-hidden="true">
                    ${consistency.cells.map((cell) => `
                        <span class="questions-hub-consistency-cell${cell.active ? " is-active" : ""}"></span>
                    `).join("")}
                </div>
            </section>
        `;
    },

    renderProgressHubPlaceholder(
        title,
        note
    ) {
        return `
            <section class="questions-hub-placeholder">
                <span class="questions-hub-summary-label">${this.escapeHtml(title)}</span>
                <strong class="questions-hub-placeholder-title">${this.escapeHtml(title)}</strong>
                <p class="questions-hub-placeholder-note">${this.escapeHtml(note)}</p>
            </section>
        `;
    },

    renderProgressHubCurrentBlock(model) {
        if (
            model.statsSection ===
            "resumo"
        ) {
            return this.renderProgressHubHero(
                model
            );
        }

        if (
            model.statsSection ===
            "melhorar"
        ) {
            return this.renderProgressHubImproveBlock(
                model
            );
        }

        if (
            model.statsSection ===
            "evolucao"
        ) {
            return this.renderProgressHubEvolutionBlock(
                model
            );
        }

        return this.renderProgressHubConsistencyBlock(
            model
        );
    },

    renderProgressHubMainColumn(
        model
    ) {
        return `
            <div class="questions-hub-main-column">
                <details class="questions-hub-section questions-hub-section-radar" open>
                    <summary class="questions-hub-summary">
                        <span>Radar da materia</span>
                        <strong>${this.escapeHtml(model.activeSubjectLabel)} · ${this.escapeHtml(this.formatSerieLabel(model.activeSerie))}</strong>
                    </summary>
                    <div class="questions-hub-radar-card">
                        <div class="questions-hub-filter-block">
                            <div class="questions-hub-filter-title">Serie em radar</div>
                            <div class="questions-hub-filter-row">
                                ${model.series.map((serie) => `
                                    <button class="questions-hub-filter-pill${Number(model.activeSerie) === Number(serie.key) ? " is-active" : ""}" type="button" data-hub-serie="${serie.key}">
                                        ${this.escapeHtml(serie.label)}
                                    </button>
                                `).join("")}
                            </div>
                        </div>

                        <div class="questions-hub-filter-block">
                            <div class="questions-hub-filter-title">Materia em radar</div>
                            <div class="questions-hub-filter-row">
                                ${model.subjects.length ? model.subjects.map((subject) => `
                                    <button class="questions-hub-filter-pill questions-hub-filter-pill-subject${model.activeSubject === subject.key ? " is-active" : ""}" type="button" data-hub-subject="${this.escapeHtml(subject.key)}">
                                        ${this.escapeHtml(subject.label)}
                                    </button>
                                `).join("") : `
                                    <div class="questions-empty-inline">Nenhuma materia pronta para essa serie ainda.</div>
                                `}
                            </div>
                        </div>

                        <div class="questions-hub-radar-layout">
                            ${this.renderProgressHubRadar(model.radarMetrics)}
                            <div class="questions-hub-radar-meta">
                                <article class="questions-hub-radar-note">
                                    <span>Leitura ativa</span>
                                    <strong>${model.activeAccuracy}% de acerto</strong>
                                    <small>${model.activeTotals.attempts || 0} questoes · ${QuestionsService.formatTime(model.activeAvgTimeMs)}</small>
                                </article>
                                <article class="questions-hub-radar-note">
                                    <span>Cobertura do assunto</span>
                                    <strong>${model.activeTopicCoverage}/${model.availableTopicCount || 0}</strong>
                                    <small>topico(s) ja apareceram nas sessoes</small>
                                </article>
                                <article class="questions-hub-radar-note">
                                    <span>Tempo investido</span>
                                    <strong>${this.formatHubHours(model.activeHours)}</strong>
                                    <small>neste recorte de serie e materia</small>
                                </article>
                            </div>
                        </div>
                    </div>
                </details>

                <details class="questions-hub-section questions-hub-section-subjects" open>
                    <summary class="questions-hub-summary">
                        <span>Mapa por materia</span>
                        <strong>${model.subjectBreakdown.length} frente(s) com historico</strong>
                    </summary>
                    <div class="questions-hub-bars">
                        ${model.subjectBreakdown.length ? model.subjectBreakdown.map((subject) => `
                            <article class="questions-hub-bar-card">
                                <div class="questions-hub-bar-copy">
                                    <strong>${this.escapeHtml(subject.subjectLabel)}</strong>
                                    <span>${subject.attempts} questoes · ${subject.topicCount} assunto(s) · ${subject.accuracy}% de acerto</span>
                                </div>
                                <div class="questions-hub-bar-track">
                                    <div class="questions-hub-bar-fill questions-hub-bar-fill-cyan" style="width:${Math.max(8, subject.accuracy)}%"></div>
                                </div>
                                <div class="questions-hub-bar-side">${subject.errorRate}% erro</div>
                            </article>
                        `).join("") : `
                            <div class="questions-empty-inline questions-empty-inline-soft">
                                As materias vao aparecer aqui conforme as sessoes entrarem.
                            </div>
                        `}
                    </div>
                </details>

                <details class="questions-hub-section questions-hub-section-series">
                    <summary class="questions-hub-summary">
                        <span>Leitura por serie</span>
                        <strong>${model.seriesBreakdown.length} serie(s) com historico</strong>
                    </summary>
                    <div class="questions-hub-bars">
                        ${model.seriesBreakdown.length ? model.seriesBreakdown.map((serie) => `
                            <article class="questions-hub-bar-card">
                                <div class="questions-hub-bar-copy">
                                    <strong>${this.escapeHtml(serie.label)}</strong>
                                    <span>${serie.attempts} questoes · ${serie.sessions} sessao(oes) · ${QuestionsService.formatTime(serie.avgTimeMs)}</span>
                                </div>
                                <div class="questions-hub-bar-track">
                                    <div class="questions-hub-bar-fill questions-hub-bar-fill-mint" style="width:${Math.max(8, serie.accuracy)}%"></div>
                                </div>
                                <div class="questions-hub-bar-side">${serie.accuracy}% acerto</div>
                            </article>
                        `).join("") : `
                            <div class="questions-empty-inline questions-empty-inline-soft">
                                Quando outras series entrarem em jogo, esse corte aparece aqui.
                            </div>
                        `}
                    </div>
                </details>
            </div>
        `;
    },

    renderProgressHubTimeChartsV2(
        model
    ) {
        const items =
            Array.isArray(
                model.timeChartItems
            )
                ? model.timeChartItems
                : [];
        const maxAvg =
            Math.max(
                1,
                ...items.map((item) =>
                    Number(
                        item.avgTimeMs || 0
                    )
                )
            );
        const maxTotal =
            Math.max(
                1,
                ...items.map((item) =>
                    Number(
                        item.totalTimeMs || 0
                    )
                )
            );

        return `
            <details class="questions-hub-section questions-hub-section-time" open>
                <summary class="questions-hub-summary">
                    <span>Tempo no recorte</span>
                    <strong>${this.escapeHtml(model.scopeSummary)}</strong>
                </summary>
                <div class="questions-hub-time-grid">
                    <article class="questions-hub-time-card">
                        <div class="questions-panel-label">Tempo medio por resposta</div>
                        <div class="questions-hub-time-bars">
                            ${items.length ? items.map((item) => `
                                <div class="questions-hub-time-row">
                                    <div class="questions-hub-time-copy">
                                        <strong>${this.escapeHtml(item.label)}</strong>
                                        <span>${item.attempts || 0} tentativa(s)</span>
                                    </div>
                                    <div class="questions-hub-time-track">
                                        <div class="questions-hub-time-fill questions-hub-time-fill-avg" style="width:${Math.max(8, Math.round(((item.avgTimeMs || 0) / maxAvg) * 100))}%"></div>
                                    </div>
                                    <div class="questions-hub-time-value">${QuestionsService.formatTime(item.avgTimeMs || 0)}</div>
                                </div>
                            `).join("") : `
                                <div class="questions-empty-inline questions-empty-inline-soft">
                                    Ainda nao ha tempo medio suficiente para esse recorte.
                                </div>
                            `}
                        </div>
                    </article>

                    <article class="questions-hub-time-card">
                        <div class="questions-panel-label">Tempo total acumulado</div>
                        <div class="questions-hub-time-bars">
                            ${items.length ? items.map((item) => `
                                <div class="questions-hub-time-row">
                                    <div class="questions-hub-time-copy">
                                        <strong>${this.escapeHtml(item.label)}</strong>
                                        <span>${item.attempts || 0} tentativa(s)</span>
                                    </div>
                                    <div class="questions-hub-time-track">
                                        <div class="questions-hub-time-fill questions-hub-time-fill-total" style="width:${Math.max(8, Math.round(((item.totalTimeMs || 0) / maxTotal) * 100))}%"></div>
                                    </div>
                                    <div class="questions-hub-time-value">${QuestionsService.formatTime(item.totalTimeMs || 0)}</div>
                                </div>
                            `).join("") : `
                                <div class="questions-empty-inline questions-empty-inline-soft">
                                    Ainda nao ha tempo total suficiente para esse recorte.
                                </div>
                            `}
                        </div>
                    </article>
                </div>
            </details>
        `;
    },

    renderProgressHubMainColumnV2(
        model
    ) {
        const comparisonItems =
            model.statsScope === "geral"
                ? model.subjectBreakdown
                : model.statsScope ===
                    "serie"
                    ? model.serieSubjectBreakdown
                    : model.statsScope ===
                        "assunto"
                        ? model.topicBreakdown.filter(
                            (item) =>
                                item.topicKey ===
                                model.activeTopicKey
                        )
                        : model.topicBreakdown;

        return `
            <div class="questions-hub-main-column">
                <details class="questions-hub-section questions-hub-section-radar" open>
                    <summary class="questions-hub-summary">
                        <span>Radar do recorte</span>
                        <strong>${this.escapeHtml(model.scopeLabel)}</strong>
                    </summary>
                    <div class="questions-hub-radar-card">
                        <div class="questions-hub-filter-block">
                            <div class="questions-hub-filter-title">Quero ver estatisticas de</div>
                            <div class="questions-hub-filter-row">
                                ${model.scopeOptions.map((scope) => `
                                    <button class="questions-hub-filter-pill questions-hub-filter-pill-scope${model.statsScope === scope.key ? " is-active" : ""}" type="button" data-hub-scope="${scope.key}">
                                        ${this.escapeHtml(scope.label)}
                                    </button>
                                `).join("")}
                            </div>
                        </div>

                        ${model.statsScope !== "geral" ? `
                            <div class="questions-hub-filter-block">
                                <div class="questions-hub-filter-title">Passo 1 · Serie</div>
                                <div class="questions-hub-filter-row">
                                    ${model.series.map((serie) => `
                                        <button class="questions-hub-filter-pill${Number(model.activeSerie) === Number(serie.key) ? " is-active" : ""}" type="button" data-hub-serie="${serie.key}">
                                            ${this.escapeHtml(serie.label)}
                                        </button>
                                    `).join("")}
                                </div>
                            </div>
                        ` : ""}

                        ${model.statsScope === "materia" || model.statsScope === "assunto" ? `
                            <div class="questions-hub-filter-block">
                                <div class="questions-hub-filter-title">Passo 2 · Materia</div>
                                <div class="questions-hub-filter-row">
                                    ${model.subjects.length ? model.subjects.map((subject) => `
                                        <button class="questions-hub-filter-pill questions-hub-filter-pill-subject${model.activeSubject === subject.key ? " is-active" : ""}" type="button" data-hub-subject="${this.escapeHtml(subject.key)}">
                                            ${this.escapeHtml(subject.label)}
                                        </button>
                                    `).join("") : `
                                        <div class="questions-empty-inline">Nenhuma materia pronta para essa serie ainda.</div>
                                    `}
                                </div>
                            </div>
                        ` : ""}

                        ${model.statsScope === "assunto" ? `
                            <div class="questions-hub-filter-block">
                                <div class="questions-hub-filter-title">Passo 3 · Assunto</div>
                                <div class="questions-hub-filter-row">
                                    ${model.topicOptions.length ? model.topicOptions.map((topic) => `
                                        <button class="questions-hub-filter-pill questions-hub-filter-pill-topic${model.activeTopicKey === topic.key ? " is-active" : ""}" type="button" data-hub-topic="${this.escapeHtml(topic.key)}">
                                            ${this.escapeHtml(topic.label)}
                                        </button>
                                    `).join("") : `
                                        <div class="questions-empty-inline">Nenhum assunto pronto para esse recorte.</div>
                                    `}
                                </div>
                            </div>
                        ` : ""}

                        <div class="questions-hub-radar-layout questions-hub-radar-layout--expanded">
                            ${this.renderProgressHubRadar(model.radarMetrics)}
                            <div class="questions-hub-radar-meta">
                                <article class="questions-hub-radar-note">
                                    <span>Precisao do recorte</span>
                                    <strong>${Math.round(model.radarMetrics.find((item) => item.label === "Precisao")?.value || 0)}%</strong>
                                    <small>${this.escapeHtml(model.scopeSummary)}</small>
                                </article>
                                <article class="questions-hub-radar-note">
                                    <span>Tempo medio</span>
                                    <strong>${QuestionsService.formatTime(model.timeChartItems.length === 1 ? (model.timeChartItems[0]?.avgTimeMs || 0) : model.activeAvgTimeMs)}</strong>
                                    <small>por resposta dentro do recorte</small>
                                </article>
                                <article class="questions-hub-radar-note">
                                    <span>Tempo total</span>
                                    <strong>${QuestionsService.formatTime(model.timeChartItems.reduce((total, item) => total + (item.totalTimeMs || 0), 0))}</strong>
                                    <small>acumulado no recorte atual</small>
                                </article>
                                <article class="questions-hub-radar-note">
                                    <span>Indicadores do radar</span>
                                    <small>Precisao = acerto, Cobertura = quanto do recorte ja apareceu, Ritmo = tempo medio, Constancia = quantidade de sessoes, Tracao = volume respondido, Dominio = saldo entre acertos e erros.</small>
                                </article>
                            </div>
                        </div>
                    </div>
                </details>

                ${this.renderProgressHubTimeChartsV2(
                    model
                )}

                <details class="questions-hub-section questions-hub-section-subjects" open>
                    <summary class="questions-hub-summary">
                        <span>Comparacao do recorte</span>
                        <strong>${comparisonItems.length} item(ns) visiveis</strong>
                    </summary>
                    <div class="questions-hub-bars">
                        ${comparisonItems.length ? comparisonItems.map((item) => `
                            <article class="questions-hub-bar-card">
                                <div class="questions-hub-bar-copy">
                                    <strong>${this.escapeHtml(item.subjectLabel || item.topicLabel || item.label)}</strong>
                                    <span>${item.attempts} questoes · ${(item.topicCount || 1)} item(ns) · ${item.accuracy}% de acerto</span>
                                </div>
                                <div class="questions-hub-bar-track">
                                    <div class="questions-hub-bar-fill questions-hub-bar-fill-cyan" style="width:${Math.max(8, item.accuracy || 0)}%"></div>
                                </div>
                                <div class="questions-hub-bar-side">${item.errorRate || 0}% erro</div>
                            </article>
                        `).join("") : `
                            <div class="questions-empty-inline questions-empty-inline-soft">
                                Ainda nao ha comparacao suficiente para esse recorte.
                            </div>
                        `}
                    </div>
                </details>

                <details class="questions-hub-section questions-hub-section-series" open>
                    <summary class="questions-hub-summary">
                        <span>Leitura por serie</span>
                        <strong>${model.seriesBreakdown.length} serie(s) com historico</strong>
                    </summary>
                    <div class="questions-hub-bars">
                        ${model.seriesBreakdown.length ? model.seriesBreakdown.map((serie) => `
                            <article class="questions-hub-bar-card">
                                <div class="questions-hub-bar-copy">
                                    <strong>${this.escapeHtml(serie.label)}</strong>
                                    <span>${serie.attempts} questoes · ${serie.sessions} sessao(oes) · ${QuestionsService.formatTime(serie.avgTimeMs)}</span>
                                </div>
                                <div class="questions-hub-bar-track">
                                    <div class="questions-hub-bar-fill questions-hub-bar-fill-mint" style="width:${Math.max(8, serie.accuracy)}%"></div>
                                </div>
                                <div class="questions-hub-bar-side">${serie.accuracy}% acerto</div>
                            </article>
                        `).join("") : `
                            <div class="questions-empty-inline questions-empty-inline-soft">
                                Quando outras series entrarem em jogo, esse corte aparece aqui.
                            </div>
                        `}
                    </div>
                </details>
            </div>
        `;
    },

    renderProgressHubSideColumn(
        model
    ) {
        return `
            <aside class="questions-hub-side-column">
                <details class="questions-hub-section questions-hub-section-weakness" open>
                    <summary class="questions-hub-summary">
                        <span>Pontos frageis e fortes</span>
                        <strong>o retrato mais util agora</strong>
                    </summary>
                    <div class="questions-hub-dual-stack">
                        <article class="questions-hub-focus-card questions-hub-focus-card-weak">
                            <div class="questions-panel-label">Mais dificultadas</div>
                            ${model.weakOverall.length ? model.weakOverall.map((topic) => `
                                <div class="questions-hub-topic-row">
                                    <strong>${this.escapeHtml(topic.topicLabel)}</strong>
                                    <span>${topic.errors} erro(s) · ${Math.round((topic.accuracy || 0) * 100)}% de acerto</span>
                                </div>
                            `).join("") : `
                                <div class="questions-empty-inline">Ainda nao ha erro suficiente para cravar um ponto fraco.</div>
                            `}
                        </article>

                        <article class="questions-hub-focus-card questions-hub-focus-card-strong">
                            <div class="questions-panel-label">Pontos fortes</div>
                            ${model.strongOverall.length ? model.strongOverall.map((topic) => `
                                <div class="questions-hub-topic-row">
                                    <strong>${this.escapeHtml(topic.topicLabel)}</strong>
                                    <span>${topic.hits} acerto(s) · ${Math.round((topic.accuracy || 0) * 100)}% de precisao</span>
                                </div>
                            `).join("") : `
                                <div class="questions-empty-inline">Os pontos fortes vao ganhar nome assim que os acertos se acumularem.</div>
                            `}
                        </article>
                    </div>
                </details>

                <details class="questions-hub-section questions-hub-section-recommendations" open>
                    <summary class="questions-hub-summary">
                        <span>Rotas sugeridas agora</span>
                        <strong>o que vale reforcar</strong>
                    </summary>
                    <div class="questions-hub-recommendations">
                        ${model.recommendations.map((item, index) => `
                            <article class="questions-hub-recommendation questions-hub-recommendation-${index % 3}">
                                <span>${this.escapeHtml(item.kicker)}</span>
                                <strong>${this.escapeHtml(item.title)}</strong>
                                <p>${this.escapeHtml(item.note)}</p>
                            </article>
                        `).join("")}
                    </div>
                    <div class="questions-hub-session-strip">
                        ${model.recentSessions.length ? model.recentSessions.map((session) => `
                            <div class="questions-hub-session-pill">
                                <strong>${this.escapeHtml(session.subjectLabel || "Sessao")}</strong>
                                <span>${session.accuracy || 0}% · ${session.amount || 0} questoes</span>
                            </div>
                        `).join("") : `
                            <div class="questions-empty-inline questions-empty-inline-soft">
                                As ultimas sessoes vao aparecer aqui para ajudar na leitura do ritmo.
                            </div>
                        `}
                    </div>
                </details>
            </aside>
        `;
    },

    renderProgressHubActions() {
        return `
            <div class="questions-hub-actions">
                <button class="questions-hub-action questions-hub-action-back" type="button" data-launcher-view="home">
                    Voltar
                </button>
                <button id="questionsHubSmartBtn" class="questions-hub-action questions-hub-action-smart" type="button">
                    Treino inteligente
                </button>
                <button class="questions-hub-action questions-hub-action-saved" type="button" data-launcher-view="saved">
                    Treinos salvos
                </button>
                <button id="questionsHubReinforceBtn" class="questions-hub-action questions-hub-action-reinforce" type="button">
                    Treino de reforco
                </button>
            </div>
        `;
    },

    renderSmartStart() {
        const page =
            this.page;
        const model =
            page.launcherViewModels
                ?.buildSmartStartViewModel
                ? page.launcherViewModels.buildSmartStartViewModel()
                : null;

        if (
            (model?.bankStatus ??
                page.data.bankStatus) ===
            "loading"
        ) {
            return this.renderLoading();
        }

        if (
            (model?.bankStatus ??
                page.data.bankStatus) ===
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
            model?.startOptions ||
            page.getSmartStartOptions();
        const activeCount =
            model?.activeCount ??
            startOptions.filter(
                (item) =>
                    item.active &&
                    !item.disabled
            ).length;
        const allAvailableActive =
            model?.allAvailableActive ??
            startOptions
                .filter(
                    (item) => !item.disabled
                )
                .every((item) => item.active);
        const petalClasses = [
            ...(model?.petalClasses || [
                "questions-smart-petal-1",
                "questions-smart-petal-2",
                "questions-smart-petal-3",
                "questions-smart-petal-4"
            ])
        ];
        return `
            <section class="questions-card questions-entry-subview questions-smart-start-card">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Treino inteligente</div>
                        <div class="questions-smart-step">1/3</div>
                    </div>

                    <div class="questions-entry-actions">
                        <button class="questions-secondary-btn" type="button" data-launcher-back="true">Voltar</button>
                    </div>
                </div>

                ${page.getRuntimeNotice() ? `
                    <div class="questions-inline-notice">
                        ${page.getRuntimeNotice()}
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
        const model =
            page.launcherViewModels
                ?.buildSmartSubjectsViewModel
                ? page.launcherViewModels.buildSmartSubjectsViewModel()
                : null;

        if (
            (model?.bankStatus ??
                page.data.bankStatus) ===
            "loading"
        ) {
            return this.renderLoading();
        }

        if (
            (model?.bankStatus ??
                page.data.bankStatus) ===
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
            model?.subjectOptions ||
            page.getSmartSubjectOptions();
        const activeCount =
            model?.activeCount ??
            subjectOptions.filter(
                (item) =>
                    item.active &&
                    !item.disabled
            ).length;
        const allActive =
            model?.allActive ??
            (
                subjectOptions.some(
                    (item) =>
                        !item.disabled
                ) &&
                subjectOptions
                    .filter(
                        (item) =>
                            !item.disabled
                    )
                    .every(
                    (item) => item.active
                    )
            );
        const visibleSubjects =
            model?.visibleSubjects ||
            subjectOptions.slice(0, 12);
        const totalSubjects =
            model?.totalSubjects ??
            (visibleSubjects.length || 1);
        const hiddenSubjects =
            model?.hiddenSubjects ??
            Math.max(
                subjectOptions.length -
                    visibleSubjects.length,
                0
            );

        return `
            <section class="questions-card questions-entry-subview questions-smart-start-card questions-smart-subject-card">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Treino inteligente</div>
                        <div class="questions-smart-step">2/3</div>
                    </div>

                    <div class="questions-entry-actions">
                        <button class="questions-secondary-btn" type="button" data-launcher-back="true">Voltar</button>
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
                                        class="questions-smart-node questions-smart-subject-node${item.active ? " is-active" : ""}${item.disabled ? " is-disabled" : ""}"
                                        type="button"
                                        style="--questions-smart-node-transform: translate(-50%, -50%) rotate(${(-90 + ((360 / totalSubjects) * index)).toFixed(2)}deg) translateY(calc(var(--questions-smart-subject-radius, 248px) * -1)) rotate(${(90 - ((360 / totalSubjects) * index)).toFixed(2)}deg);"
                                        data-smart-subject-option="${item.key}"
                                        ${item.disabled ? "disabled" : ""}
                                    >
                                        <div class="questions-smart-node-copy">
                                            <strong>${item.label}</strong>
                                            <span>${item.hasQuestions ? `${item.readyTopicCount || item.topicCount} assunto(s) | ${item.readyQuestionCount || item.count} questoes` : "Sem questoes prontas"}</span>
                                        </div>
                                    </button>
                                `).join("")}
                            </div>

                            <button id="questionsSmartSubjectsContinueBtn" class="questions-smart-core${activeCount ? " is-ready" : ""}" type="button" ${activeCount ? "" : "disabled"}>
                                <strong>Ir</strong>
                                <span></span>
                            </button>
                        </div>
                        ${hiddenSubjects ? `
                            <div class="questions-inline-note questions-smart-subject-note">
                                +${hiddenSubjects} materia(s) continuam disponiveis. Ajuste as series para refinar mais se quiser.
                            </div>
                        ` : ""}
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

        const smartCtx =
            QuestionsContext.get();
        const smartPreview =
            page.buildSmartRoutePreview();
        const smartQuestionOptions =
            page.data
                .smartQuestionAmountOptions ||
            [5, 15, 30, 50];
        const smartSelectedQuestionCount =
            smartCtx.smartQuestionCount === null
                ? null
                : Math.max(
                    1,
                    Number(
                        smartCtx.smartQuestionCount ||
                            smartCtx.quantidadeQuestoes
                    ) || 5
                );
        return `
            <section class="questions-card questions-entry-subview questions-smart-final-card questions-smart-final-card-minimal questions-smart-focus-stage">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Treino inteligente</div>
                        <div class="questions-smart-step">3/3</div>
                        <h2>Selecionar quantidade</h2>
                    </div>

                    <div class="questions-entry-actions">
                        <button class="questions-secondary-btn questions-review-btn" type="button" data-launcher-back="true">Voltar</button>
                    </div>
                </div>

                ${page.getRuntimeNotice() ? `
                    <div class="questions-inline-notice">
                        ${page.getRuntimeNotice()}
                    </div>
                ` : ""}

                <section class="questions-smart-config-card">
                    <div class="questions-smart-config-group questions-smart-config-group--solo">
                        <div class="questions-panel-label">Quantidade de questoes</div>
                        <div class="questions-smart-config-grid questions-smart-config-grid--quantity">
                            ${smartQuestionOptions.map((amount) => `
                                <button class="questions-pill${smartSelectedQuestionCount === amount ? " is-active" : ""}" type="button" data-smart-question-count="${amount}" aria-pressed="${smartSelectedQuestionCount === amount ? "true" : "false"}">
                                    ${String(amount).padStart(2, "0")}
                                </button>
                            `).join("")}
                            <button class="questions-pill questions-pill-infinity questions-pill-infinity--large${smartSelectedQuestionCount === null ? " is-active" : ""}" type="button" data-smart-question-infinite="true" aria-label="Sem limite" aria-pressed="${smartSelectedQuestionCount === null ? "true" : "false"}"></button>
                        </div>
                    </div>

                    ${smartPreview.isReady ? `
                        <div class="questions-smart-config-note">
                            <span>${smartPreview.serieLabel} &middot; ${smartPreview.materiaLabel}</span>
                        </div>
                    ` : `
                        <div class="questions-issue-list">
                            ${(smartPreview.issues || [smartPreview.reason]).map((issue) => `
                                <div class="questions-issue-item">${issue}</div>
                            `).join("")}
                        </div>
                    `}

                    <button id="questionsSmartSavePresetStartBtn" class="questions-primary-btn questions-smart-start-btn-minimal questions-smart-focus-start" type="button" ${smartPreview.isReady ? "" : "disabled"}>
                        Salvar predefinicao
                    </button>
                </section>
            </section>
        `;

        const ctx =
            QuestionsContext.get();
        const preview =
            page.buildSmartRoutePreview();
        const timeOptions = [];
        const selectedTimeMinutes =
            15;
        const questionOptions =
            page.data
                .smartQuestionAmountOptions ||
            [5, 15, 30];
        const selectedQuestionCount =
            ctx.smartQuestionCount === null
                ? null
                : Math.max(
                    1,
                    Number(
                        ctx.smartQuestionCount
                    ) || 5
                );
        const isCustomQuestionActive =
            selectedQuestionCount !==
                null &&
            !questionOptions.includes(
                selectedQuestionCount
            );
        const isCustomTimeActive =
            false;

        return `
            <section class="questions-card questions-entry-subview questions-smart-final-card questions-smart-final-card-minimal questions-smart-focus-stage">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Treino inteligente</div>
                        <div class="questions-smart-step">3/3</div>
                        <h2>Selecionar quantidade</h2>
                    </div>

                    <div class="questions-entry-actions">
                        <button class="questions-secondary-btn questions-review-btn" type="button" data-launcher-back="true">Voltar</button>
                    </div>
                </div>

                ${page.getRuntimeNotice() ? `
                    <div class="questions-inline-notice">
                        ${page.getRuntimeNotice()}
                    </div>
                ` : ""}

                <section class="questions-smart-config-card">
                    <div class="questions-smart-config-group">
                        <div class="questions-panel-label">Quantidade de questoes</div>
                        <div class="questions-smart-config-grid questions-smart-config-grid--quantity">
                            ${timeOptions.map((minutes) => `
                                <button class="questions-pill${ctx.smartSessionMetric === "tempo" && selectedTimeMinutes === minutes ? " is-active" : ""}" type="button" data-smart-time="${minutes}">
                                    ${minutes}
                                </button>
                            `).join("")}
                            <label class="questions-smart-custom-field${isCustomTimeActive ? " is-active" : ""}">
                                <input id="questionsSmartTimeInput" type="number" min="1" step="1" inputmode="numeric" value="${isCustomTimeActive ? selectedTimeMinutes : ""}" placeholder="min">
                            </label>
                            <button class="questions-pill questions-pill-infinity${ctx.smartSessionMetric === "tempo" && selectedTimeMinutes === null ? " is-active" : ""}" type="button" data-smart-time-infinite="true">
                                ∞
                            </button>
                        </div>
                    </div>

                    <div class="questions-smart-config-group">
                        <div class="questions-panel-label">Quantidade de questoes</div>
                        <div class="questions-smart-config-grid questions-smart-config-grid--quantity">
                            ${questionOptions.map((amount) => `
                                <button class="questions-pill${selectedQuestionCount === amount ? " is-active" : ""}" type="button" data-smart-question-count="${amount}">
                                    ${String(amount).padStart(2, "0")}
                                </button>
                            `).join("")}
                            <label class="questions-smart-custom-field questions-smart-custom-field--large${isCustomQuestionActive ? " is-active" : ""}">
                                <input id="questionsSmartQuestionInput" type="number" min="1" step="1" inputmode="numeric" value="${isCustomQuestionActive ? selectedQuestionCount : ""}" placeholder="n">
                            </label>
                            <button class="questions-pill questions-pill-infinity questions-pill-infinity--large${selectedQuestionCount === null ? " is-active" : ""}" type="button" data-smart-question-infinite="true" aria-label="Sem limite">
                                ∞
                            </button>
                        </div>
                    </div>

                    ${preview.isReady ? `
                        <div class="questions-smart-config-note">
                            <span>${preview.serieLabel} • ${preview.materiaLabel}</span>
                            <strong>${preview.trainingValueLabel === "∞" ? "Todas as questoes disponiveis" : `${preview.amount || 0} questoes previstas`}</strong>
                        </div>
                    ` : `
                        <div class="questions-issue-list">
                            ${(preview.issues || [preview.reason]).map((issue) => `
                                <div class="questions-issue-item">${issue}</div>
                            `).join("")}
                        </div>
                    `}

                    <button id="questionsSmartSavePresetStartBtn" class="questions-primary-btn questions-smart-start-btn-minimal questions-smart-focus-start" type="button" ${preview.isReady ? "" : "disabled"}>
                        Salvar predefinicao
                    </button>
                </section>
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
                        <button class="questions-secondary-btn" type="button" data-launcher-back="true">Voltar</button>
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
                        <button class="questions-secondary-btn" type="button" data-launcher-back="true">Voltar</button>
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
                        <button class="questions-secondary-btn" type="button" data-launcher-back="true">Voltar</button>
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

        const model =
            this.buildProgressHubModel();
        return `
            <section class="questions-hub-layout questions-hub-layout--detached">
                <aside class="questions-hub-sidebar-panel">
                    ${this.renderProgressHubSidebar(
                        model
                    )}
                </aside>

                <section class="questions-card questions-launcher-card questions-progress-hub-card questions-hub-main-panel">
                    ${page.getRuntimeNotice() ? `
                        <div class="questions-inline-notice">
                            ${page.getRuntimeNotice()}
                        </div>
                    ` : ""}

                    <div class="questions-hub-stage">
                        ${this.renderProgressHubCurrentBlock(
                            model
                        )}
                    </div>
                </section>
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

    buildSessionProgressModel(
        question,
        answer,
        session = [],
        meta = {}
    ) {
        const results =
            QuestionsState.getResults();
        const answeredCount =
            results.length;
        const hits =
            results.filter(
                (item) => item.correct
            ).length;
        const errors =
            Math.max(
                answeredCount - hits,
                0
            );
        const remaining =
            Math.max(
                (session.length || 0) -
                    answeredCount,
                0
            );
        const elapsedAnsweredMs =
            results.reduce(
                (total, item) =>
                    total +
                    (Number(
                        item?.timeMs
                    ) || 0),
                0
            );
        const activeElapsedMs =
            answer
                ? 0
                : Math.max(
                    Date.now() -
                        QuestionsState.getStartTime(),
                    0
                );

        return {
            elapsedLabel:
                QuestionsService.formatTime(
                    elapsedAnsweredMs +
                        activeElapsedMs
                ),
            totalCount:
                session.length || 0,
            answeredCount,
            hits,
            errors,
            remaining,
            subjectLabel:
                question.subjectLabel ||
                meta.materiaLabel ||
                "Materia",
            topicLabel:
                question.topicLabel ||
                "Assunto",
            trainingModeLabel:
                meta.sourceMode ===
                    "smart"
                    ? (
                        meta.trainingModeLabel ||
                        QuestionsService.getTrainingModeLabel()
                    )
                    : "Por quantidade",
            trainingValueLabel:
                meta.sourceMode ===
                    "smart"
                    ? (
                        meta.trainingValueLabel ||
                        QuestionsService.getTrainingValueLabel()
                    )
                    : String(
                        Math.max(
                            1,
                            Number(
                                meta.amount ||
                                    session.length
                            ) || 1
                        )
                    ).padStart(2, "0"),
            serieLabel:
                meta.serieLabel || "-",
            modeLabel:
                meta.modeLabel ||
                "Treino"
        };
    },

    renderSessionProgressBlocks(
        model = {}
    ) {
        return `
            <div class="questions-session-progress-grid">
                <article class="questions-session-mini-card">
                    <span>Feitas</span>
                    <strong>${model.answeredCount}</strong>
                    <small>${model.remaining} faltam</small>
                </article>
                <article class="questions-session-mini-card">
                    <span>Resultado</span>
                    <strong>${model.hits}</strong>
                    <small>${model.errors} erro(s)</small>
                </article>
                <article class="questions-session-mini-card">
                    <span>Materia</span>
                    <strong>${model.subjectLabel}</strong>
                </article>
                <article class="questions-session-mini-card">
                    <span>Assunto</span>
                    <strong>${model.topicLabel}</strong>
                </article>
            </div>
        `;
    },

    renderSessionInformation(
        meta = {},
        model = {}
    ) {
        return `
            <section class="questions-session-info-panel">
                <div class="questions-session-info-head">
                    <div class="questions-panel-label">Informacoes da questao</div>
                    <button id="questionsInfoBackBtn" class="questions-secondary-btn" type="button">Voltar</button>
                </div>
                <div class="questions-session-info-grid">
                    <div>
                        <span>Total</span>
                        <strong>${model.totalCount}</strong>
                    </div>
                    <div>
                        <span>Respondidas</span>
                        <strong>${model.answeredCount}</strong>
                    </div>
                    <div>
                        <span>Acertos</span>
                        <strong>${model.hits}</strong>
                    </div>
                    <div>
                        <span>Erros</span>
                        <strong>${model.errors}</strong>
                    </div>
                    <div>
                        <span>Serie</span>
                        <strong>${model.serieLabel}</strong>
                    </div>
                    <div>
                        <span>Categoria</span>
                        <strong>${model.subjectLabel}</strong>
                    </div>
                    <div>
                        <span>Assunto</span>
                        <strong>${model.topicLabel}</strong>
                    </div>
                </div>
            </section>
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
        const progressModel =
            this.buildSessionProgressModel(
                question,
                answer,
                session,
                meta
            );

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
                ${this.page.getRuntimeNotice() ? `
                    <div class="questions-inline-notice questions-inline-notice-session">
                        ${this.page.getRuntimeNotice()}
                    </div>
                ` : ""}
                <article class="questions-question-card questions-question-card--minimal">
                    <div class="questions-session-progress-bar" aria-hidden="true">
                        <span style="width: ${Math.max(Math.min(progress, 100), 0)}%"></span>
                    </div>
                    <h3>${question.prompt}</h3>
                    <div class="questions-answer-area">
                        ${this.renderAnswerBlock(question, answer)}
                    </div>
                    ${this.renderCommentPanel(
                        question,
                        answer
                    )}
                </article>
                ${this.renderSessionInformation(
                    meta,
                    progressModel
                )}
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
                <div class="questions-panel-label">Comentario rapido</div>
                <p>${question.explanation || "Comentario ainda nao preenchido para esta questao."}</p>
                ${!answer.correct ? `
                    <div class="questions-comment-answer">Resposta esperada: ${answer.correctAnswerLabel || "Nao preenchida"}</div>
                ` : ""}
                ${this.renderQuestionContestPanel(
                    question,
                    answer
                )}
            </section>
        `;
    },

    renderQuestionContestPanel(
        question,
        answer
    ) {
        if (!answer) {
            return "";
        }

        const defaultText =
            this.page.getQuestionContestDefaultText();
        const latestReport =
            this.page.getLatestQuestionContest(
                question.id
            );
        const isOpen =
            this.page.isContestComposerOpen?.(
                question.id
            );

        return `
            <section class="questions-contest-panel">
                <div class="questions-contest-inline">
                    <div class="questions-contest-copy">
                        <span>Se notar algo ruim, ambiguo ou incorreto, envie uma observacao.</span>
                    </div>
                    <button id="questionsContestToggleBtn" class="questions-contest-toggle${isOpen ? " is-open" : ""}" type="button" data-question-contest-toggle="${this.escapeHtml(question.id || "")}">
                        ${isOpen ? "Fechar contestacao" : "Contestar questao"}
                    </button>
                </div>
                ${isOpen ? `
                    <form id="questionsContestForm" class="questions-contest-form">
                        <textarea id="questionsContestInput" class="questions-contest-field" rows="3" placeholder="${this.escapeHtml(defaultText)}"></textarea>
                        <div class="questions-contest-actions">
                            <button id="questionsContestSubmitBtn" class="questions-secondary-btn" type="submit">Enviar contestacao</button>
                        </div>
                    </form>
                ` : ""}
                ${latestReport ? `
                    <div class="questions-contest-status">
                        Ultimo envio registrado em ${this.formatDate(latestReport.createdAt)}.
                    </div>
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
        const correctIndex =
            QuestionsService.getCorrectChoiceIndex(
                question
            );

        return `
            <div class="questions-options">
                ${(question.options || []).map((option, index) => {
                    const isCorrect =
                        answer &&
                        index === correctIndex;
                    const isWrong =
                        answer &&
                        index === answer.selectedIndex &&
                        !answer.correct;

                    return `
                        <button class="questions-option${isCorrect ? " is-correct" : ""}${isWrong ? " is-wrong" : ""}" type="button" data-answer-select="${index}" aria-pressed="false" ${isLocked ? "disabled" : ""}>
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
                <input id="questionsInputField" class="questions-input-field" type="text" placeholder="Digite sua resposta" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" ${answer ? "disabled" : ""}>
                <button id="questionsInputConfirmBtn" class="questions-confirm-btn" type="submit" ${answer ? "disabled" : ""}>
                    <span class="questions-confirm-icon">✓</span>
                    Confirmar
                </button>
            </form>
            ${answer ? this.renderFeedback(answer) : ""}
        `;
    },

    renderFeedback(answer) {
        const isLockedOutcome =
            Boolean(
                answer?.outcomeLocked
            );
        const scoredCorrect =
            isLockedOutcome
                ? Boolean(
                    answer?.scoredCorrect
                )
                : Boolean(
                    answer?.correct
                );
        const lockedNote =
            scoredCorrect
                ? "O acerto ja ficou registrado na primeira confirmacao. Esta nova resposta conta so como tentativa."
                : "O erro ja ficou registrado na primeira confirmacao. Esta nova resposta nao altera o computo.";

        return `
            <div class="questions-feedback questions-feedback--minimal ${answer.correct ? "is-correct" : "is-wrong"}">
                <div class="questions-feedback-summary">
                    <strong>${answer.correct ? "Resposta confirmada." : "Vale revisar antes de seguir."}</strong>
                </div>
                <div class="questions-feedback-foot">
                    <button id="questionsRetryBtn" class="questions-secondary-btn" type="button">
                        Responder de novo
                    </button>
                    <button id="questionsContinueBtn" class="questions-confirm-btn" type="button">
                        <span class="questions-confirm-icon">→</span>
                        Proxima
                    </button>
                </div>
                <div class="questions-feedback-note">
                    ${isLockedOutcome ? lockedNote : "Responder de novo mantem o cronometro correndo e conta como nova tentativa."}
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

        document
            .querySelectorAll(
                "[data-launcher-back]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.goBackLauncher();
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

        document
            .querySelectorAll(
                "[data-hub-section]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        const sectionKey =
                            String(
                                button.dataset
                                    .hubSection ||
                                    ""
                            )
                                .trim()
                                .toLowerCase();

                        if (!sectionKey) {
                            return;
                        }

                        this.page.updateContext({
                            statsSection:
                                sectionKey
                        });
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-hub-train-topic]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        const topicKey =
                            String(
                                button.dataset
                                    .hubTrainTopic ||
                                    ""
                            ).trim();
                        const subjectKey =
                            String(
                                button.dataset
                                    .hubTrainSubject ||
                                    ""
                            ).trim();
                        const serieKey =
                            Number(
                                button.dataset
                                    .hubTrainSerie
                            ) ||
                            Number(
                                QuestionsContext
                                    .get()
                                    ?.statsSerie || 0
                            ) ||
                            Number(
                                QuestionsContext
                                    .get()?.serie || 0
                            ) ||
                            1;
                        const current =
                            QuestionsContext.get();

                        if (
                            !topicKey ||
                            !subjectKey
                        ) {
                            return;
                        }

                        this.page.startSession(
                            {
                                routeContext:
                                    {
                                        ...current,
                                        mode: "ASSUNTO_UNICO",
                                        base:
                                            current
                                                .statsBase ||
                                            current.base ||
                                            "ESCOLAR",
                                        serie:
                                            serieKey,
                                        materia:
                                            subjectKey,
                                        topicos:
                                            [
                                                topicKey
                                            ],
                                        focoPrincipal:
                                            topicKey
                                    }
                            }
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-hub-serie-select]"
            )
            .forEach((select) => {
                select.addEventListener(
                    "change",
                    () => {
                        const serieKey =
                            Number(
                                select.value
                            ) || 0;
                        const current =
                            QuestionsContext.get();
                        const subjects =
                            QuestionsService.getSubjectOptions(
                                this.page,
                                serieKey
                            );
                        const nextSubject =
                            subjects.find(
                                (item) =>
                                    item.key ===
                                    current
                                        .statsMateria
                            )?.key ||
                            subjects[0]?.key ||
                            "";

                        if (!serieKey) {
                            return;
                        }

                        this.page.updateContext({
                            statsSerie:
                                serieKey,
                            statsMateria:
                                nextSubject ||
                                "",
                            statsTopicKey:
                                ""
                        });
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-hub-scope]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        const scopeKey =
                            String(
                                button.dataset
                                    .hubScope ||
                                    ""
                            ).trim();

                        if (!scopeKey) {
                            return;
                        }

                        this.page.updateContext(
                            {
                                statsScope:
                                    scopeKey,
                                ...(scopeKey !==
                                "assunto"
                                    ? {
                                        statsTopicKey:
                                            ""
                                    }
                                    : {})
                            }
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-hub-serie]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        const serieKey =
                            Number(
                                button.dataset
                                    .hubSerie
                            ) || 0;
                        const current =
                            QuestionsContext.get();
                        const subjects =
                            QuestionsService.getSubjectOptions(
                                this.page,
                                serieKey
                            );
                        const nextSubject =
                            subjects.find(
                                (item) =>
                                    item.key ===
                                    current.materia
                            )?.key ||
                            subjects[0]?.key ||
                            "";

                        this.page.updateContext({
                            statsSerie:
                                serieKey,
                            statsMateria:
                                nextSubject ||
                                "",
                            statsTopicKey:
                                ""
                        });
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-hub-subject]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        const subjectKey =
                            String(
                                button.dataset
                                    .hubSubject ||
                                    ""
                            ).trim();

                        if (!subjectKey) {
                            return;
                        }

                        this.page.updateContext({
                            statsMateria:
                                subjectKey,
                            statsTopicKey:
                                ""
                        });
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-hub-topic]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        const topicKey =
                            String(
                                button.dataset
                                    .hubTopic ||
                                    ""
                            ).trim();

                        if (!topicKey) {
                            return;
                        }

                        this.page.updateContext({
                            statsTopicKey:
                                topicKey
                        });
                    }
                );
            });

        document.getElementById(
            "questionsHubSmartBtn"
        )?.addEventListener(
            "click",
            () => {
                const current =
                    QuestionsContext.get();

                this.page.setSmartConfig({
                    smartSelectedSeries: [
                        current.serie
                    ],
                    smartSelectedSubjects:
                        current.materia
                            ? [
                                current.materia
                            ]
                            : []
                });
                this.page.setSmartGoal(
                    "continue"
                );
                this.page.openLauncher(
                    "smart_start"
                );
            }
        );

        document.getElementById(
            "questionsHubReinforceBtn"
        )?.addEventListener(
            "click",
            () => {
                const current =
                    QuestionsContext.get();

                this.page.setSmartConfig({
                    smartSelectedSeries: [
                        current.serie
                    ],
                    smartSelectedSubjects:
                        current.materia
                            ? [
                                current.materia
                            ]
                            : []
                });
                this.page.setSmartGoal(
                    "reforcar"
                );
                this.page.openLauncher(
                    "smart_start"
                );
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
            "questionsSmartSavePresetStartBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.saveSmartPresetAndStart();
            }
        );

        document
            .querySelectorAll(
                "[data-smart-question-count]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        document
                            .querySelectorAll(
                                "[data-smart-question-count], [data-smart-question-infinite]"
                            )
                            .forEach(
                                (item) => {
                                    item.classList.remove(
                                        "is-active"
                                    );
                                    item.setAttribute(
                                        "aria-pressed",
                                        "false"
                                    );
                                }
                            );
                        button.classList.add(
                            "is-active"
                        );
                        button.setAttribute(
                            "aria-pressed",
                            "true"
                        );
                        this.page.setSmartQuestionCount(
                            Number(
                                button.dataset
                                    .smartQuestionCount
                            )
                        );
                    }
                );
            });

        const smartQuestionInput =
            document.getElementById(
                "questionsSmartQuestionInput"
            );
        const smartQuestionCustomField =
            smartQuestionInput?.closest(
                "[data-smart-question-custom]"
            ) || null;
        const smartQuestionPresetButtons =
            [
                ...document.querySelectorAll(
                    "[data-smart-question-count], [data-smart-question-infinite]"
                )
            ];

        const setSmartQuestionEditingState =
            (isEditing) => {
                if (
                    !smartQuestionCustomField
                ) {
                    return;
                }

                smartQuestionCustomField.classList.toggle(
                    "is-editing",
                    Boolean(isEditing)
                );

                if (!isEditing) {
                    return;
                }

                smartQuestionPresetButtons.forEach(
                    (button) => {
                        button.classList.remove(
                            "is-active"
                        );
                    }
                );
            };

        smartQuestionCustomField?.addEventListener(
            "click",
            () => {
                smartQuestionInput?.focus();
                smartQuestionInput?.select();
                setSmartQuestionEditingState(
                    true
                );
            }
        );

        smartQuestionInput?.addEventListener(
            "focus",
            () => {
                setSmartQuestionEditingState(
                    true
                );
                smartQuestionInput.select();
            }
        );

        smartQuestionInput?.addEventListener(
            "click",
            () => {
                setSmartQuestionEditingState(
                    true
                );
            }
        );

        smartQuestionInput?.addEventListener(
            "input",
            (event) => {
                const value =
                    String(
                        event.target
                            ?.value || ""
                    )
                        .replace(/\D+/g, "")
                        .slice(0, 4);

                event.target.value = value;
                setSmartQuestionEditingState(
                    true
                );
            }
        );

        smartQuestionInput?.addEventListener(
            "change",
            (event) => {
                const value =
                    String(
                        event.target
                            ?.value || ""
                    )
                        .replace(/\D+/g, "")
                        .slice(0, 4);

                event.target.value = value;

                if (!value) {
                    return;
                }

                this.page.setSmartQuestionCount(
                    Number(value)
                );
            }
        );

        smartQuestionInput?.addEventListener(
            "blur",
            (event) => {
                const value =
                    String(
                        event.target
                            ?.value || ""
                    )
                        .replace(/\D+/g, "")
                        .slice(0, 4);

                event.target.value = value;

                if (value) {
                    this.page.setSmartQuestionCount(
                        Number(value)
                    );
                }
            }
        );

        smartQuestionInput?.addEventListener(
            "keydown",
            (event) => {
                if (event.key !== "Enter") {
                    return;
                }

                event.preventDefault();
                const value =
                    String(
                        event.target
                            ?.value || ""
                    )
                        .replace(/\D+/g, "")
                        .slice(0, 4);

                event.target.value = value;

                if (!value) {
                    return;
                }

                this.page.setSmartQuestionCount(
                    Number(value)
                );
            }
        );

        smartQuestionInput?.addEventListener(
            "blur",
            () => {
                window.setTimeout(() => {
                    if (
                        document.activeElement ===
                        smartQuestionInput
                    ) {
                        return;
                    }

                    const currentValue =
                        String(
                            smartQuestionInput.value ||
                                ""
                        ).trim();
                    const currentContext =
                        QuestionsContext.get();
                    const isCustomSelected =
                        currentContext.smartQuestionCount !==
                            null &&
                        !(
                            this.page.data.smartQuestionAmountOptions ||
                            []
                        ).includes(
                            Number(
                                currentContext.smartQuestionCount
                            )
                        );

                    setSmartQuestionEditingState(
                        Boolean(
                            currentValue ||
                            isCustomSelected
                        )
                    );
                }, 0);
            }
        );

        document
            .querySelectorAll(
                "[data-smart-question-infinite]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        document
                            .querySelectorAll(
                                "[data-smart-question-count], [data-smart-question-infinite]"
                            )
                            .forEach(
                                (item) => {
                                    item.classList.remove(
                                        "is-active"
                                    );
                                    item.setAttribute(
                                        "aria-pressed",
                                        "false"
                                    );
                                }
                            );
                        button.classList.add(
                            "is-active"
                        );
                        button.setAttribute(
                            "aria-pressed",
                            "true"
                        );
                        this.page.setSmartQuestionCount(
                            null
                        );
                    }
                );
            });

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
                                .smartProfileDelete,
                            {
                                anchorRect:
                                    button.getBoundingClientRect()
                            }
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
                                .runDelete,
                            {
                                anchorRect:
                                    button.getBoundingClientRect()
                            }
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
                                .savedBlockDelete,
                            {
                                anchorRect:
                                    button.getBoundingClientRect()
                            }
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
        const surfaces = [
            document.getElementById(
                "questionsSession"
            ),
            document.getElementById(
                "questionsFloatingBody"
            )
        ].filter(Boolean);
        const inputField =
            document.getElementById(
                "questionsInputField"
            );

        if (
            inputField &&
            !inputField.disabled
        ) {
            requestAnimationFrame(() => {
                inputField.focus();
                inputField.select();
            });
        }

        surfaces.forEach((surface) => {
            const contestField =
                surface.querySelector(
                    "#questionsContestInput"
                );

            if (contestField) {
                requestAnimationFrame(() => {
                    contestField.focus();
                });
            }

            surface
                .querySelectorAll(
                    "[data-answer-select]"
                )
                .forEach((button) => {
                    button.addEventListener(
                        "click",
                        (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            this.selectChoice(
                                button,
                                surface
                            );
                        }
                    );
                });

            surface
                .querySelector(
                    "#questionsChoiceConfirmBtn"
                )
                ?.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.submitSelectedChoice(
                            surface
                        );
                    }
                );

            surface
                .querySelector(
                    "#questionsInputConfirmBtn"
                )
                ?.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.page.submitAnswer({
                            index: null,
                            value:
                                this.getActiveInputAnswerValue(
                                    surface
                                )
                        });
                    }
                );

            surface
                .querySelector(
                    "#questionsInputForm"
                )
                ?.addEventListener(
                    "submit",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.page.submitAnswer({
                            index: null,
                            value:
                                this.getActiveInputAnswerValue(
                                    surface
                                )
                        });
                    }
                );

            surface
                .querySelectorAll(
                    "[data-order-move]"
                )
                .forEach((button) => {
                    button.addEventListener(
                        "click",
                        (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            this.moveOrderItem(
                                button
                            );
                        }
                    );
                });

            surface
                .querySelector(
                    "#questionsOrderingSubmitBtn"
                )
                ?.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.page.submitAnswer({
                            index: null,
                            value:
                                this.getActiveOrderingAnswerValue(
                                    surface
                                )
                        });
                    }
                );

            surface
                .querySelector(
                    "#questionsContinueBtn"
                )
                ?.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.page.continueSession();
                    }
                );

            surface
                .querySelector(
                    "#questionsRetryBtn"
                )
                ?.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.page.retryCurrentQuestion();
                    }
                );

            surface
                .querySelector(
                    "#questionsBackBtn, #questionsInfoBackBtn"
                )
                ?.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.page.pauseSession();
                    }
                );

            surface
                .querySelector(
                    "#questionsContestToggleBtn"
                )
                ?.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.page.toggleContestComposer(
                            event.currentTarget
                                ?.dataset
                                ?.questionContestToggle
                        );
                    }
                );

            surface
                .querySelector(
                    "#questionsRestartBtn"
                )
                ?.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.page.restartSession();
                    }
                );

            surface
                .querySelector(
                    "#questionsFocusWeakBtn"
                )
                ?.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.page.startFollowUp(
                            "weak_topic"
                        );
                    }
                );

            surface
                .querySelector(
                    "#questionsReviewErrorsBtn"
                )
                ?.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.page.startFollowUp(
                            "review_errors"
                        );
                    }
                );

            surface
                .querySelector(
                    "#questionsMixedReviewBtn"
                )
                ?.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.page.startFollowUp(
                            "mixed_review"
                        );
                    }
                );

            surface
                .querySelector(
                    "#questionsResultsBackBtn"
                )
                ?.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.page.openLauncher();
                    }
                );

            surface
                .querySelector(
                    "#questionsContestForm"
                )
                ?.addEventListener(
                    "submit",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        const field =
                            surface.querySelector(
                                "#questionsContestInput"
                            ) ||
                            document.getElementById(
                                "questionsContestInput"
                            );

                        this.page.submitQuestionContest(
                            String(
                                field?.value || ""
                            )
                        );
                    }
                );
        });
    },

    getTypeLabel(type) {
        return (
            this.page.data.questionTypes[
                type
            ]?.label || type
        );
    }
};
