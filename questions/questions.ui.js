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

        const activeElement =
            document.activeElement instanceof
            HTMLElement
                ? document.activeElement
                : null;
        const shouldRestoreDirectSearchFocus =
            activeElement?.id ===
                "questionsDirectSearchInput" ||
            this.page
                ?.directSearchRefocusPending ===
                true;
        const directSearchSelectionStart =
            shouldRestoreDirectSearchFocus &&
            typeof activeElement
                .selectionStart ===
                "number"
                ? activeElement.selectionStart
                : null;
        const directSearchSelectionEnd =
            shouldRestoreDirectSearchFocus &&
            typeof activeElement
                .selectionEnd ===
                "number"
                ? activeElement.selectionEnd
                : null;

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

            if (
                shouldRestoreDirectSearchFocus
            ) {
                this.page.directSearchRefocusPending =
                    false;
                requestAnimationFrame(() => {
                    const input =
                        document.getElementById(
                            "questionsDirectSearchInput"
                        );

                    if (!input) {
                        return;
                    }

                    input.focus({
                        preventScroll: true
                    });

                    if (
                        typeof input
                            .setSelectionRange ===
                            "function" &&
                        Number.isInteger(
                            directSearchSelectionStart
                        ) &&
                        Number.isInteger(
                            directSearchSelectionEnd
                        )
                    ) {
                        input.setSelectionRange(
                            directSearchSelectionStart,
                            directSearchSelectionEnd
                        );
                    }
                });
            }
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
        const isTimerDialog =
            dialog.mode ===
            "simulado_time";
        const isSummaryDialog =
            dialog.mode ===
            "simulado_summary";
        const customDialogBody =
            isTimerDialog
                ? this.renderSimuladoTimeDialog(
                    dialog
                )
                : isSummaryDialog
                ? this.renderSimuladoSummaryDialog(
                    dialog
                )
                : "";

        return `
            <div class="questions-dialog-backdrop">
                <section class="${dialogClasses}" role="dialog" aria-modal="true" aria-labelledby="questionsDialogTitle"${dialogPosition}>
                    <div class="questions-dialog-copy">
                        <div id="questionsDialogTitle" class="questions-dialog-title">${this.escapeHtml(dialog.title)}</div>
                        ${customDialogBody || (dialog.mode === "confirm" ? `
                            <div class="questions-dialog-message">${this.escapeHtml(dialog.message || "")}</div>
                        ` : `
                            <label class="questions-dialog-label" for="questionsDialogInput">${this.escapeHtml(dialog.label)}</label>
                            <input id="questionsDialogInput" class="questions-dialog-input" type="text" value="${this.escapeHtml(dialog.value || "")}" autocomplete="off" spellcheck="false">
                        `)}
                    </div>
                    <div class="questions-dialog-actions">
                        <button id="questionsDialogCancelBtn" class="questions-secondary-btn" type="button">${this.escapeHtml(dialog.cancelLabel || "Cancelar")}</button>
                        <button id="questionsDialogConfirmBtn" class="questions-primary-btn" type="button">${this.escapeHtml(dialog.confirmLabel || "Salvar")}</button>
                    </div>
                </section>
            </div>
        `;
    },

    renderSimuladoTimeDialog(dialog) {
        const timeLimitMinutes =
            Object.prototype.hasOwnProperty.call(
                dialog.data || {},
                "timeLimitMinutes"
            )
                ? dialog.data
                      .timeLimitMinutes
                : 30;
        const isInfinite =
            timeLimitMinutes === null;

        return `
            <div class="questions-dialog-message">
                ${this.escapeHtml(dialog.message || "Escolha o tempo total do simulado.")}
            </div>
            <div class="questions-simulado-time-display${isInfinite ? " is-infinite" : ""}">
                <strong>${isInfinite ? "&infin;" : this.escapeHtml(String(timeLimitMinutes))}</strong>
                <span>${isInfinite ? "tempo indeterminado" : "minutos totais"}</span>
            </div>
            <div class="questions-simulado-time-actions">
                <button class="questions-pill${!isInfinite && Number(timeLimitMinutes) === 30 ? " is-active" : ""}" type="button" data-simulado-time-base="true">
                    30 min
                </button>
                <button class="questions-pill" type="button" data-simulado-time-plus="30">
                    +30 min
                </button>
                <button class="questions-pill questions-pill-infinity${isInfinite ? " is-active" : ""}" type="button" data-simulado-time-infinite="true" aria-pressed="${isInfinite ? "true" : "false"}" aria-label="Tempo indeterminado">
                    &infin;
                </button>
            </div>
        `;
    },

    renderSimuladoSummaryDialog(dialog) {
        const preview =
            dialog.data?.preview ||
            {};
        const blocks = Array.isArray(
            preview.blocks
        )
            ? preview.blocks
            : [];
        const suggestedTitle =
            String(
                preview.meta?.customTitle || ""
            ).trim() ||
            `Simulado - ${String(preview.totalQuestions || 0)} questoes`;

        return `
            <div class="questions-dialog-message">
                Revise o fechamento do simulado antes de iniciar.
            </div>
            <div class="questions-simulado-summary-name">
                <label class="questions-dialog-label" for="questionsSimuladoSummaryTitleInput">Nome do simulado</label>
                <input id="questionsSimuladoSummaryTitleInput" class="questions-dialog-input" type="text" value="${this.escapeHtml(suggestedTitle)}" maxlength="80" autocomplete="off" spellcheck="false" placeholder="Ex.: Simulado de MatemÃ¡tica - Abril">
            </div>
            <div class="questions-simulado-summary-grid">
                <article class="questions-simulado-summary-stat">
                    <span>Tempo</span>
                    <strong>${this.escapeHtml(preview.timeLimitLabel || "Indeterminado")}</strong>
                </article>
                <article class="questions-simulado-summary-stat">
                    <span>Questoes</span>
                    <strong>${this.escapeHtml(String(preview.totalQuestions || 0))}</strong>
                </article>
                <article class="questions-simulado-summary-stat">
                    <span>Blocos</span>
                    <strong>${this.escapeHtml(String(preview.blockCount || 0))}</strong>
                </article>
                <article class="questions-simulado-summary-stat">
                    <span>Tempo estimado</span>
                    <strong>${this.escapeHtml(preview.estimatedTimeLabel || "0 min")}</strong>
                </article>
            </div>
            ${preview.summaryNote ? `
                <div class="questions-inline-notice">
                    ${this.escapeHtml(preview.summaryNote)}
                </div>
            ` : ""}
            <div class="questions-simulado-summary-list">
                ${blocks.map((block) => `
                    <article class="questions-simulado-summary-item">
                        <strong>${this.escapeHtml(block.subjectLabel)} Â· ${this.escapeHtml(block.topicLabel)}</strong>
                        <span>${this.escapeHtml(this.formatSerieLabel(block.serie))} Â· ${this.escapeHtml(block.difficultyLabel)} Â· ${block.actualAmount}/${block.requestedAmount} questoes</span>
                    </article>
                `).join("")}
            </div>
        `;
    },

    bindDialog() {
        const dialog =
            this.page?.getActiveDialog?.();
        const input =
            document.getElementById(
                "questionsDialogInput"
            );
        const simuladoSummaryTitleInput =
            document.getElementById(
                "questionsSimuladoSummaryTitleInput"
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

        if (
            dialog?.mode ===
            "simulado_time"
        ) {
            document
                .querySelector(
                    "[data-simulado-time-base]"
                )
                ?.addEventListener(
                    "click",
                    () => {
                        this.page.setActiveSimuladoTimeBase();
                    }
                );

            document
                .querySelector(
                    "[data-simulado-time-plus]"
                )
                ?.addEventListener(
                    "click",
                    () => {
                        this.page.adjustActiveSimuladoTime(
                            30
                        );
                    }
                );

            document
                .querySelector(
                    "[data-simulado-time-infinite]"
                )
                ?.addEventListener(
                    "click",
                    () => {
                        this.page.toggleActiveSimuladoTimeInfinite();
                    }
                );
        }

        if (
            dialog?.mode ===
            "simulado_summary"
        ) {
            simuladoSummaryTitleInput
                ?.addEventListener(
                    "input",
                    () => {
                        this.page.setActiveSimuladoPreviewTitle(
                            simuladoSummaryTitleInput.value
                        );
                    }
                );

            simuladoSummaryTitleInput
                ?.addEventListener(
                    "keydown",
                    (event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            this.page.confirmDialog();
                            return;
                        }

                        if (event.key === "Escape") {
                            event.preventDefault();
                            this.page.closeDialog();
                        }
                    }
                );
        }

        if (
            !input &&
            !simuladoSummaryTitleInput
        ) {
            return;
        }

        requestAnimationFrame(() => {
            const focusTarget =
                simuladoSummaryTitleInput ||
                input;

            focusTarget?.focus();
            focusTarget?.select?.();
        });

        input?.addEventListener(
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
                <div class="questions-kicker">SessÃ£o ativa</div>
                <h2>Janela flutuante aberta</h2>
                <p>As questÃµes continuam em uma janela livre para arrastar, minimizar, redimensionar ou maximizar enquanto vocÃª usa o resto do site.</p>
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
            <section id="questionsFloatingWindow" class="questions-floating-window" aria-label="Janela flutuante de questÃµes">
                <div class="questions-floating-header" data-questions-float-drag="true">
                    <div class="questions-floating-copy">
                        <div class="questions-floating-kicker">Treino ativo</div>
                        <div class="questions-floating-title">QuestÃµes</div>
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

        if (launcherView === "quick") {
            return this.renderQuickLauncher();
        }

        if (launcherView === "simulado") {
            return this.renderSimuladoLauncher();
        }

        if (
            launcherView ===
            "simulado_build"
        ) {
            return this.renderSimuladoBuilder();
        }

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

        if (
            launcherView ===
                "progress" ||
            launcherView === "specific"
        ) {
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
        const weakTopic =
            QuestionsStore.getWeakTopics({
                baseKey:
                    QuestionsContext.get()
                        .base ||
                    "ESCOLAR",
                minAttempts: 1,
                minErrors: 1
            })[0] || null;
        const directSearchTerms =
            Array.isArray(
                page.directSearchTerms
            )
                ? page.directSearchTerms
                : [];
        const directSearchMatchCount =
            typeof page.directSearchMatchCount ===
                "number" &&
            Number.isFinite(
                page.directSearchMatchCount
            )
                ? page.directSearchMatchCount
                : null;
        const directSearchStatusLabel =
            !directSearchTerms.length
                ? "Adicione um termo para buscar"
                : page.directSearchLoading
                    ? "Buscando questoes..."
                    : directSearchMatchCount ===
                          null
                        ? "Pronto para gerar"
                        : `${directSearchMatchCount} questoes encontradas`;

        return `
            <section class="questions-card questions-entry-card">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Questions</div>
                        <h2>Como quer estudar agora?</h2>
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
                    <article class="questions-entry-option questions-entry-option-quick">
                        <div class="questions-entry-copy">
                            <h3>Rapido</h3>
                            <p>${this.escapeHtml(recentRuns.length ? `${recentRuns.length} treino(s) pausado(s)` : "sem treino pausado")} Â· ${this.escapeHtml(savedBlocks.length ? `${savedBlocks.length} guardado(s)` : "sem guardados")} Â· ${this.escapeHtml(weakTopic ? weakTopic.topicLabel : "historico em formacao")}</p>
                        </div>
                        <button class="questions-primary-btn" type="button" data-launcher-view="quick" ${isLoading || isError ? "disabled" : ""}>
                            ${isLoading ? "Preparando..." : isError ? "Indisponivel" : "Abrir"}
                        </button>
                    </article>

                    <article class="questions-entry-option questions-entry-option-smart">
                        <div class="questions-entry-copy">
                            <h3>Inteligente</h3>
                        </div>
                        <button class="questions-primary-btn" type="button" data-launcher-view="smart_start" ${isLoading || isError ? "disabled" : ""}>
                            ${isLoading ? "Preparando..." : isError ? "Indisponivel" : "Comecar"}
                        </button>
                    </article>

                    <article class="questions-entry-option questions-entry-option-specific">
                        <div class="questions-entry-copy">
                            <h3>Simulado</h3>
                        </div>
                        <button class="questions-secondary-btn" type="button" data-launcher-view="simulado" ${isLoading || isError ? "disabled" : ""}>
                            ${isLoading ? "Preparando..." : isError ? "Indisponivel" : "Entrar"}
                        </button>
                    </article>
                </div>

                <section class="questions-direct-search" aria-label="Busca direta por assunto">
                    <div class="questions-direct-search-copy">
                        <h3>Questoes por assunto</h3>
                    </div>

                    <div class="questions-direct-search-form">
                        <input
                            id="questionsDirectSearchInput"
                            class="questions-search-field questions-direct-search-input"
                            type="text"
                            value="${this.escapeHtml(page.directSearchInput || "")}"
                            placeholder="Ex.: funcao afim, organelas, predicado verbal"
                        />
                        <button class="questions-secondary-btn questions-direct-search-add" type="button" data-direct-search-add="true">
                            Adicionar
                        </button>
                        <button class="questions-primary-btn questions-direct-search-generate" type="button" data-direct-search-generate="true" ${directSearchTerms.length ? "" : "disabled"}>
                            Gerar questoes
                        </button>
                    </div>

                    <div class="questions-direct-search-meta">
                        <span>${directSearchTerms.length ? `${directSearchTerms.length} filtro(s) ativo(s)` : "Nenhum filtro ativo"}</span>
                        <strong>${directSearchStatusLabel}</strong>
                    </div>

                    ${directSearchTerms.length ? `
                        <div class="questions-chip-row questions-direct-search-chips">
                            ${directSearchTerms.map((term) => `
                                <button class="questions-chip questions-chip-removable" type="button" data-direct-search-remove="${this.escapeHtml(term)}">
                                    <span>${this.escapeHtml(term)}</span>
                                    <strong aria-hidden="true">x</strong>
                                </button>
                            `).join("")}
                            <button class="questions-chip questions-chip-ghost" type="button" data-direct-search-clear="true">
                                Limpar
                            </button>
                        </div>
                    ` : ""}
                </section>

            </section>
        `;
    },

    renderQuickLauncher() {
        const ctx =
            QuestionsContext.get();
        const runs =
            QuestionsStore.getRuns({
                status: "in_progress"
            });
        const savedBlocks =
            QuestionsStore.getSavedBlocks();
        const weakTopics =
            QuestionsStore.getWeakTopics({
                baseKey:
                    ctx.base || "ESCOLAR",
                minAttempts: 1,
                minErrors: 1
            });

        return `
            <section class="questions-card questions-entry-subview">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Rapido</div>
                        <h2>Entre sem montar tudo de novo</h2>
                        <p>Retome, reaproveite e revise o que ja apareceu no seu historico.</p>
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

                <div class="questions-entry-grid questions-entry-grid--quick">
                    <article class="questions-entry-option questions-entry-option-quick">
                        <div class="questions-entry-copy">
                            <h3>Retomar treino</h3>
                            <p>${runs.length ? `${runs.length} treino(s) pausado(s) esperando voce.` : "Nenhum treino pausado no momento."}</p>
                        </div>
                        <button class="questions-primary-btn" type="button" data-quick-action="resume">
                            Abrir
                        </button>
                    </article>

                    <article class="questions-entry-option questions-entry-option-saved">
                        <div class="questions-entry-copy">
                            <h3>Guardados</h3>
                            <p>${savedBlocks.length ? `${savedBlocks.length} bloco(s) salvos para consultar ou refazer.` : "Ainda nao ha blocos guardados."}</p>
                        </div>
                        <button class="questions-secondary-btn" type="button" data-quick-action="saved">
                            Abrir
                        </button>
                    </article>

                    <article class="questions-entry-option questions-entry-option-review">
                        <div class="questions-entry-copy">
                            <h3>Revisar erros</h3>
                            <p>${weakTopics.length ? `Revisao curta puxando ${Math.min(3, weakTopics.length)} assunto(s) com erro recente.` : "Ative mais historico para liberar esta sugestao."}</p>
                        </div>
                        <button class="questions-secondary-btn" type="button" data-quick-action="review_errors" ${weakTopics.length ? "" : "disabled"}>
                            Iniciar
                        </button>
                    </article>

                    <article class="questions-entry-option questions-entry-option-focus">
                        <div class="questions-entry-copy">
                            <h3>Foco nos pontos fracos</h3>
                            <p>${weakTopics[0] ? `Assunto lider de erro agora: ${this.escapeHtml(weakTopics[0].topicLabel)}.` : "Ative mais historico para destacar um ponto fraco."}</p>
                        </div>
                        <button class="questions-secondary-btn" type="button" data-quick-action="weak_points" ${weakTopics[0] ? "" : "disabled"}>
                            Iniciar
                        </button>
                    </article>
                </div>
            </section>
        `;
    },

    renderSimuladoLauncher() {
        return `
            <section class="questions-card questions-entry-subview">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Simulado</div>
                        <h2>Escolha como quer montar a avaliacao</h2>
                        <p>O antigo fluxo por assunto agora vive aqui, dentro de montar simulado.</p>
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

                <div class="questions-entry-grid">
                    <article class="questions-entry-option questions-entry-option-simulado-build">
                        <div class="questions-entry-copy">
                            <h3>Montar simulado</h3>
                            <p>Monte blocos por materia, assunto, dificuldade e quantidade no mesmo painel.</p>
                        </div>
                        <button class="questions-primary-btn" type="button" data-launcher-view="simulado_build">
                            Abrir
                        </button>
                    </article>

                    <article class="questions-entry-option questions-entry-option-simulado-ready">
                        <div class="questions-entry-copy">
                            <h3>Prova pronta</h3>
                            <p>ENEM e provas fechadas entram aqui assim que o fluxo base de simulado estiver validado.</p>
                        </div>
                        <button class="questions-secondary-btn" type="button" disabled>
                            Em breve
                        </button>
                    </article>
                </div>
            </section>
        `;
    },

    renderSimuladoBuilder() {
        const page =
            this.page;
        const state =
            page.ensureSimuladoBuilder();
        const series =
            page.getSimuladoSeriesOptions();
        const subjects =
            page.getSimuladoSubjectOptions(
                state.serie
            );
        const topics =
            page.getSimuladoTopicOptions(
                state.draft.subjectKey,
                state.serie
            );
        const difficulties =
            page.getSimuladoDifficultyOptions();
        const amounts =
            page.getSimuladoAmountOptions();
        const selectedSubject =
            subjects.find(
                (item) =>
                    item.key ===
                    state.draft.subjectKey
            ) || null;
        const hasSerie =
            Number.isFinite(
                Number(state.serie)
            ) &&
            Number(state.serie) > 0;
        const hasSubject =
            Boolean(
                state.draft.subjectKey &&
                    selectedSubject
            );
        const hasTopic =
            Boolean(
                state.draft.topicKey
            );
        const hasDifficulty =
            Boolean(
                state.draft.difficulty
            );
        const isReadyToApply =
            Boolean(
                hasSerie &&
                state.draft.subjectKey &&
                    state.draft.topicKey &&
                    state.draft.difficulty &&
                    state.draft.amount
            );

        return `
            <section class="questions-card questions-entry-subview questions-simulado-builder-card">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Simulado</div>
                        <h2>Montar simulado</h2>
                        <p>Monte blocos por assunto sem sair da mesma tela. A execucao final entra no proximo bloco.</p>
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

                <div class="questions-simulado-builder">
                    <section class="questions-simulado-panel questions-simulado-panel-form">
                        <section class="questions-simulado-step">
                            <div class="questions-panel-label">1. Serie base</div>
                            <div class="questions-hub-filter-row">
                                ${series.map((serie) => `
                                    <button class="questions-hub-filter-pill questions-simulado-serie-pill${Number(state.serie) === Number(serie.key) ? " is-active" : ""}" type="button" data-simulado-serie="${serie.key}" aria-pressed="${Number(state.serie) === Number(serie.key) ? "true" : "false"}">
                                        ${this.escapeHtml(this.formatSerieLabel(serie.key))}
                                    </button>
                                `).join("")}
                            </div>
                        </section>

                        <section class="questions-simulado-step${hasSerie ? "" : " is-locked"}">
                            <div class="questions-panel-label">2. Materia</div>
                            ${hasSerie ? `
                                <div class="questions-simulado-choice-grid">
                                    ${subjects.length ? subjects.map((subject) => `
                                        <button class="questions-simulado-choice questions-simulado-choice-subject${state.draft.subjectKey === subject.key ? " is-active" : ""}" type="button" data-simulado-subject="${this.escapeHtml(subject.key)}" aria-pressed="${state.draft.subjectKey === subject.key ? "true" : "false"}">
                                            <strong>${this.escapeHtml(subject.label)}</strong>
                                            <span>${subject.readyQuestionCount || subject.count || 0} questoes prontas</span>
                                        </button>
                                    `).join("") : `
                                        <div class="questions-empty-inline questions-empty-inline-soft">
                                            Nenhuma materia pronta para essa serie ainda.
                                        </div>
                                    `}
                                </div>
                            ` : `
                                <div class="questions-empty-inline questions-empty-inline-soft">
                                    Escolha uma serie base para liberar as materias.
                                </div>
                            `}
                        </section>

                        <section class="questions-simulado-step${hasSubject ? "" : " is-locked"}">
                            <div class="questions-panel-label">3. Assunto</div>
                            ${hasSubject ? `
                                <div class="questions-simulado-choice-grid">
                                    ${topics.length ? topics.map((topic) => `
                                        <button class="questions-simulado-choice questions-simulado-choice-topic${state.draft.topicKey === topic.key ? " is-active" : ""}" type="button" data-simulado-topic="${this.escapeHtml(topic.key)}" aria-pressed="${state.draft.topicKey === topic.key ? "true" : "false"}">
                                            <strong>${this.escapeHtml(topic.label)}</strong>
                                            <span>${topic.count || 0} questoes prontas</span>
                                        </button>
                                    `).join("") : `
                                        <div class="questions-empty-inline questions-empty-inline-soft">
                                            Essa materia ainda nao tem assunto pronto nesse recorte.
                                        </div>
                                    `}
                                </div>
                            ` : `
                                <div class="questions-empty-inline questions-empty-inline-soft">
                                    Escolha uma materia para liberar os assuntos.
                                </div>
                            `}
                        </section>

                        <section class="questions-simulado-step${hasTopic ? "" : " is-locked"}">
                            <div class="questions-panel-label">4. Dificuldade</div>
                            ${hasTopic ? `
                                <div class="questions-smart-config-grid questions-smart-config-grid--quantity">
                                    ${difficulties.map((item) => `
                                        <button class="questions-pill${state.draft.difficulty === item.key ? " is-active" : ""}" type="button" data-simulado-difficulty="${item.key}">
                                            ${this.escapeHtml(item.label)}
                                        </button>
                                    `).join("")}
                                </div>
                            ` : `
                                <div class="questions-empty-inline questions-empty-inline-soft">
                                    Escolha um assunto para liberar a dificuldade.
                                </div>
                            `}
                        </section>

                        <section class="questions-simulado-step${hasDifficulty ? "" : " is-locked"}">
                            <div class="questions-panel-label">5. Quantidade</div>
                            ${hasDifficulty ? `
                                <div class="questions-smart-config-grid questions-smart-config-grid--quantity">
                                    ${amounts.map((amount) => `
                                        <button class="questions-pill${Number(state.draft.amount) === Number(amount) ? " is-active" : ""}" type="button" data-simulado-amount="${amount}">
                                            ${String(amount).padStart(2, "0")}
                                        </button>
                                    `).join("")}
                                </div>
                            ` : `
                                <div class="questions-empty-inline questions-empty-inline-soft">
                                    Escolha a dificuldade para liberar a quantidade de questoes.
                                </div>
                            `}
                        </section>

                        <div class="questions-entry-footer questions-entry-footer--builder">
                            <button class="questions-primary-btn" type="button" id="questionsSimuladoApplyBtn" ${isReadyToApply ? "" : "disabled"}>
                                ${state.editingIndex >= 0 ? "Atualizar bloco" : "Aplicar bloco"}
                            </button>
                        </div>
                    </section>

                    <aside class="questions-simulado-panel questions-simulado-panel-list">
                        <div class="questions-simulado-panel-head">
                            <div>
                                <div class="questions-panel-label">Composicao do simulado</div>
                                <strong>${state.blocks.length} bloco(s)</strong>
                            </div>
                            <button class="questions-secondary-btn" type="button" id="questionsSimuladoConsolidateBtn" ${state.blocks.length ? "" : "disabled"}>
                                Consolidar simulado
                            </button>
                        </div>

                        ${state.blocks.length ? `
                            <div class="questions-profile-list questions-profile-list--simulado">
                                ${state.blocks.map((block, index) => `
                                    <article class="questions-profile-item${state.editingIndex === index ? " is-active" : ""}">
                                        <div class="questions-profile-copy">
                                            <strong>${this.escapeHtml(block.subjectLabel)} Â· ${this.escapeHtml(block.topicLabel)}</strong>
                                            <span>${this.escapeHtml(this.formatSerieLabel(block.serie))} Â· ${this.escapeHtml(block.difficultyLabel)} Â· ${block.amount} questoes</span>
                                        </div>
                                        <div class="questions-profile-actions">
                                            <button class="questions-secondary-btn" type="button" data-simulado-edit-block="${index}">
                                                Alterar
                                            </button>
                                            <button class="questions-secondary-btn" type="button" data-simulado-delete-block="${index}">
                                                Excluir
                                            </button>
                                        </div>
                                    </article>
                                `).join("")}
                            </div>
                        ` : `
                            <div class="questions-empty-inline">
                                Nenhum bloco aplicado ainda. Monte o primeiro bloco pelo painel da esquerda.
                            </div>
                        `}
                    </aside>
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
            return "S\u00e9rie";
        }

        return `${numeric}Âª SÃ©rie`;
    },

    normalizeSerieLabel(label) {
        const text =
            String(label || "").trim();

        if (!text) {
            return "S\u00e9rie";
        }

        const compact =
            text
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/\s+/g, " ")
                .trim();
        const match =
            compact.match(
                /^(\d+)\s*a?\s*serie$/
            );

        if (match) {
            return `${match[1]}\u00aa S\u00e9rie`;
        }

        return text.replace(
            /\bserie\b/gi,
            "S\u00e9rie"
        );
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
                                "MatÃ©ria"
                        ).trim() ||
                        "MatÃ©ria",
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
                                "MatÃ©ria"
                        ).trim() ||
                        "MatÃ©ria",
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
            "DomÃ­nio em formaÃ§Ã£o"
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
            "A central vai ficando mais precisa conforme vocÃª responde blocos variados.";

        if (accuracy >= 80) {
            note =
                "O ritmo j\u00e1 est\u00e1 forte. Vale misturar assuntos e puxar refinamento.";
        } else if (attempts >= 40) {
            note =
                "J\u00e1 existe massa cr\u00edtica suficiente para sugerir refor\u00e7os com mais seguran\u00e7a.";
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
                label: "PrecisÃ£o",
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
                label: "ConstÃ¢ncia",
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
                label: "DomÃ­nio",
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
                label: "S\u00e9rie"
            },
            {
                key: "materia",
                label: "MatÃ©ria"
            },
            {
                key: "assunto",
                label: "Assunto"
            }
        ];
        let scopeLabel =
            "Vis\u00e3o geral";
        let scopeSummary =
            "Panorama completo do hist\u00f3rico";
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
                    "MatÃ©ria";
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
                `${scopeLabel} em ${subjects.find((item) => item.key === activeSubject)?.label || "MatÃ©ria"}`;
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
                    "MatÃ©ria que pede cuidado",
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
                note: "Assim que as primeiras sessÃµes entrarem, a central mostra reforÃ§os, radar e tendÃªncia com mais nitidez."
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
                )?.label || "MatÃ©ria",
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
                label: "Evolu\u00e7\u00e3o"
            },
            {
                key: "consistencia",
                label: "Consist\u00eancia"
            }
        ];

        return `
            <aside class="questions-hub-sidebar" aria-label="Tipos de estat\u00edstica">
                <div class="questions-hub-sidebar-head">
                    <button class="questions-hub-sidebar-back" type="button" data-launcher-back="true">
                        Voltar
                    </button>
                    <span class="questions-hub-sidebar-kicker">Estat\u00edsticas</span>
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
                            <span class="questions-hub-toolbar-label">S\u00e9rie</span>
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
                                    ? "Evolu\u00e7\u00e3o"
                                    : "Consist\u00eancia"
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
                    <span class="questions-hub-summary-label">Tempo mÃ©dio</span>
                    <strong class="questions-hub-summary-value">${avgTime}</strong>
                </article>
                <article class="questions-hub-summary-card questions-hub-summary-card--${levelTone}">
                    <span class="questions-hub-summary-label">N\u00edvel atual</span>
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
                label: "Sem hist\u00f3rico recente",
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
                <section class="questions-hub-evolution-block" aria-label="Evolu\u00e7\u00e3o recente">
                    <div class="questions-hub-improve-empty">
                        <span class="questions-hub-summary-label">Evolu\u00e7\u00e3o</span>
                        <strong class="questions-hub-improve-empty-value">Sem hist\u00f3rico recente</strong>
                    </div>
                </section>
            `;
        }

        return `
            <section class="questions-hub-evolution-block" aria-label="Evolu\u00e7\u00e3o recente">
                <div class="questions-hub-evolution-head">
                    <span class="questions-hub-summary-label">Evolu\u00e7\u00e3o</span>
                    <strong class="questions-hub-evolution-trend questions-hub-evolution-trend--${trend.tone}">
                        ${this.escapeHtml(trend.label)}
                    </strong>
                </div>

                <div class="questions-hub-evolution-chart questions-hub-evolution-chart--${trend.tone}">
                    <svg class="questions-hub-evolution-svg" viewBox="0 0 760 148" preserveAspectRatio="none" role="img" aria-label="TendÃªncia das Ãºltimas respostas">
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
                    <span>Ãºltimas ${trend.total} questÃµes</span>
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
            <section class="questions-hub-consistency-block" aria-label="Consist\u00eancia recente">
                <div class="questions-hub-consistency-head">
                    <span class="questions-hub-summary-label">Consist\u00eancia</span>
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

    buildProgressHubConsistencySnapshot(
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
            streak,
            activeDays:
                activeDays.size,
            weeklyActive:
                cells.slice(-7).filter(
                    (cell) => cell.active
                ).length,
            consistencyRate:
                Math.round(
                    (activeDays.size /
                        Math.max(
                            cells.length,
                            1
                        )) *
                        100
                )
        };
    },

    buildProgressHubEvolutionSnapshot(
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
                    )
                });
            });
        });

        const recentAnswers =
            answers.slice(-30);

        if (!recentAnswers.length) {
            return {
                hasData: false
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

        return {
            hasData: true,
            delta: Math.round(
                secondAvg - firstAvg
            ),
            firstAvg:
                Math.round(firstAvg),
            secondAvg:
                Math.round(secondAvg),
            peak:
                Math.max(...smoothed)
        };
    },

    renderProgressHubSummarySurface(
        model
    ) {
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
        const consistency =
            this.buildProgressHubConsistencySnapshot(
                model
            );
        const summaryCards = [
            {
                label: "Acerto geral",
                value: `${accuracy}%`,
                note: `${model?.overallDashboard?.attempts || 0} questÃµes lidas`,
                tone:
                    accuracy >= 70
                        ? "good"
                        : accuracy >= 40
                            ? "warning"
                            : "danger"
            },
            {
                label: "Tempo mÃ©dio",
                value: avgTime,
                note: "ritmo por resposta",
                tone:
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
                            : "danger"
            },
            {
                label: "NÃ­vel atual",
                value: String(
                    model?.level?.level || 1
                ),
                note: `${Math.round(model?.level?.progress || 0)}% para o prÃ³ximo`,
                tone:
                    model?.level?.progress >= 70
                        ? "good"
                        : model?.level?.progress >= 35
                            ? "warning"
                            : "neutral"
            },
            {
                label: "ConsistÃªncia",
                value: `${consistency.streak} dia${consistency.streak === 1 ? "" : "s"}`,
                note: `${consistency.activeDays} dias ativos no ciclo`,
                tone:
                    consistency.streak >= 7
                        ? "good"
                        : consistency.streak >= 3
                            ? "warning"
                            : "neutral"
            }
        ];

        return `
            <section class="questions-hub-focus-shell questions-hub-focus-shell--summary" aria-label="Resumo essencial">
                <div class="questions-hub-focus-head">
                    <div>
                        <span class="questions-hub-summary-label">Resumo</span>
                        <strong class="questions-hub-focus-title">Placar pessoal</strong>
                    </div>
                    <span class="questions-hub-focus-kicker">visÃ£o geral</span>
                </div>
                <div class="questions-hub-focus-grid">
                    <div class="questions-hub-summary-block">
                        ${summaryCards.map((card) => `
                            <article class="questions-hub-summary-card questions-hub-summary-card--${card.tone}">
                                <span class="questions-hub-summary-label">${card.label}</span>
                                <strong class="questions-hub-summary-value">${card.value}</strong>
                                <small class="questions-hub-summary-note">${card.note}</small>
                            </article>
                        `).join("")}
                    </div>
                    <aside class="questions-hub-focus-side">
                        <article class="questions-hub-focus-insight questions-hub-focus-insight--summary">
                            <span class="questions-hub-focus-insight-kicker">SuperaÃ§Ã£o</span>
                            <strong>${model?.level?.label || "Em aquecimento"}</strong>
                            <p>${accuracy >= 70
                                ? "Bom momento para manter ritmo."
                                : accuracy >= 40
                                    ? "Base pronta para ganhar traÃ§Ã£o."
                                    : "As prÃ³ximas sessÃµes vÃ£o ativar o painel."}</p>
                        </article>
                        <div class="questions-hub-mini-grid">
                            <article class="questions-hub-mini-card">
                                <span>Meta da semana</span>
                                <strong>${Math.max(Math.round(model?.level?.progress || 0), 0)}%</strong>
                                <small>do prÃ³ximo nÃ­vel</small>
                            </article>
                            <article class="questions-hub-mini-card">
                                <span>Ponto forte</span>
                                <strong>${model?.strongestSubject?.subjectLabel ? this.escapeHtml(model.strongestSubject.subjectLabel) : "Sem base"}</strong>
                                <small>${model?.strongestSubject?.accuracy ? `${model.strongestSubject.accuracy}% de acerto` : "seu destaque aparece aqui"}</small>
                            </article>
                        </div>
                    </aside>
                </div>
            </section>
        `;
    },

    renderProgressHubImproveSurface(
        model
    ) {
        const items =
            this.buildProgressHubImproveItems(
                model
            );
        const hardestSubject =
            model?.hardestSubject || null;
        const strongestSubject =
            model?.strongestSubject || null;
        const solvedBase =
            Number(
                model?.overallDashboard
                    ?.attempts || 0
            ) || 0;

        return `
            <section class="questions-hub-focus-shell questions-hub-focus-shell--improve" aria-label="Onde melhorar agora">
                <div class="questions-hub-focus-head">
                    <div>
                        <span class="questions-hub-summary-label">Onde melhorar</span>
                        <strong class="questions-hub-focus-title">${items.length ? "Focos de reforÃ§o" : "Mapa de reforÃ§o"}</strong>
                    </div>
                    <span class="questions-hub-focus-kicker">${items.length ? "top 3 gargalos" : "sem alerta forte"}</span>
                </div>
                <div class="questions-hub-focus-grid">
                    <div class="questions-hub-improve-block">
                        ${items.length
                            ? items.map((item, index) => {
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
                            }).join("")
                            : `
                                <div class="questions-hub-improve-empty">
                                    <div class="questions-hub-empty-visual questions-hub-empty-visual--improve" aria-hidden="true">
                                        <span class="questions-hub-empty-bar is-quiet"></span>
                                        <span class="questions-hub-empty-bar is-soft"></span>
                                        <span class="questions-hub-empty-bar is-mid"></span>
                                        <span class="questions-hub-empty-bar is-strong"></span>
                                        <span class="questions-hub-empty-bar is-mid"></span>
                                        <span class="questions-hub-empty-bar is-tall"></span>
                                    </div>
                                    <strong class="questions-hub-improve-empty-value">Sem alerta forte</strong>
                                </div>
                            `}
                    </div>
                    <aside class="questions-hub-focus-side">
                        <article class="questions-hub-focus-insight questions-hub-focus-insight--danger">
                            <span class="questions-hub-focus-insight-kicker">Maior cuidado</span>
                            <strong>${hardestSubject?.subjectLabel ? this.escapeHtml(hardestSubject.subjectLabel) : "Sem matÃ©ria crÃ­tica"}</strong>
                            <p>${hardestSubject?.errorRate ? `${hardestSubject.errorRate}% de erro no recorte recente.` : "Quando surgir um padrÃ£o, ele entra aqui."}</p>
                        </article>
                        <div class="questions-hub-mini-grid">
                            <article class="questions-hub-mini-card">
                                <span>Base lida</span>
                                <strong>${solvedBase}</strong>
                                <small>questÃµes no acumulado</small>
                            </article>
                            <article class="questions-hub-mini-card">
                                <span>Ponto forte</span>
                                <strong>${strongestSubject?.subjectLabel ? this.escapeHtml(strongestSubject.subjectLabel) : "Em anÃ¡lise"}</strong>
                                <small>${strongestSubject?.accuracy ? `${strongestSubject.accuracy}% de acerto` : "aguardando mais base"}</small>
                            </article>
                        </div>
                    </aside>
                </div>
            </section>
        `;
    },

    renderProgressHubEvolutionSurface(
        model
    ) {
        const trend =
            this.buildProgressHubEvolutionModel(
                model
            );
        const snapshot =
            this.buildProgressHubEvolutionSnapshot(
                model
            );

        return `
            <section class="questions-hub-focus-shell questions-hub-focus-shell--evolution" aria-label="EvoluÃ§Ã£o recente">
                <div class="questions-hub-focus-head">
                    <div>
                        <span class="questions-hub-summary-label">EvoluÃ§Ã£o</span>
                        <strong class="questions-hub-focus-title">${trend.hasData ? "Curva recente" : "GrÃ¡fico em formaÃ§Ã£o"}</strong>
                    </div>
                    <span class="questions-hub-focus-kicker">${trend.hasData ? this.escapeHtml(trend.label) : "sem histÃ³rico"}</span>
                </div>
                <div class="questions-hub-focus-grid">
                    <section class="questions-hub-evolution-block">
                        ${trend.hasData
                            ? `
                                <div class="questions-hub-evolution-head">
                                    <span class="questions-hub-summary-label">Ãšltimas ${trend.total} questÃµes</span>
                                    <strong class="questions-hub-evolution-trend questions-hub-evolution-trend--${trend.tone}">
                                        ${this.escapeHtml(trend.label)}
                                    </strong>
                                </div>

                                <div class="questions-hub-evolution-chart questions-hub-evolution-chart--${trend.tone}">
                                    <svg class="questions-hub-evolution-svg" viewBox="0 0 760 148" preserveAspectRatio="none" role="img" aria-label="TendÃªncia das Ãºltimas respostas">
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
                                    <span>fase atual</span>
                                    <strong>${trend.latest}%</strong>
                                </div>
                            `
                            : `
                                <div class="questions-hub-improve-empty">
                                    <div class="questions-hub-empty-visual questions-hub-empty-visual--evolution" aria-hidden="true">
                                        <span class="questions-hub-empty-point"></span>
                                        <span class="questions-hub-empty-point"></span>
                                        <span class="questions-hub-empty-point"></span>
                                        <span class="questions-hub-empty-point"></span>
                                    </div>
                                    <strong class="questions-hub-improve-empty-value">Sem histÃ³rico recente</strong>
                                </div>
                            `}
                    </section>
                    <aside class="questions-hub-focus-side">
                        <div class="questions-hub-mini-grid">
                            <article class="questions-hub-mini-card">
                                <span>ComparaÃ§Ã£o</span>
                                <strong>${snapshot.hasData ? `${snapshot.delta >= 0 ? "+" : ""}${snapshot.delta} pts` : "--"}</strong>
                                <small>contra a metade anterior</small>
                            </article>
                            <article class="questions-hub-mini-card">
                                <span>Melhor fase</span>
                                <strong>${snapshot.hasData ? `${snapshot.peak}%` : "--"}</strong>
                                <small>pico recente do grÃ¡fico</small>
                            </article>
                            <article class="questions-hub-mini-card">
                                <span>Antes</span>
                                <strong>${snapshot.hasData ? `${snapshot.firstAvg}%` : "--"}</strong>
                                <small>mÃ©dia inicial</small>
                            </article>
                            <article class="questions-hub-mini-card">
                                <span>Agora</span>
                                <strong>${snapshot.hasData ? `${snapshot.secondAvg}%` : "--"}</strong>
                                <small>mÃ©dia mais recente</small>
                            </article>
                        </div>
                    </aside>
                </div>
            </section>
        `;
    },

    renderProgressHubConsistencySurface(
        model
    ) {
        const consistency =
            this.buildProgressHubConsistencySnapshot(
                model
            );

        return `
            <section class="questions-hub-focus-shell questions-hub-focus-shell--consistency" aria-label="ConsistÃªncia recente">
                <div class="questions-hub-focus-head">
                    <div>
                        <span class="questions-hub-summary-label">ConsistÃªncia</span>
                        <strong class="questions-hub-focus-title">Ritmo de retorno</strong>
                    </div>
                    <span class="questions-hub-focus-kicker">sequÃªncia atual</span>
                </div>
                <div class="questions-hub-focus-grid">
                    <section class="questions-hub-consistency-block">
                        <div class="questions-hub-consistency-head">
                            <span class="questions-hub-summary-label">ConsistÃªncia</span>
                            <strong class="questions-hub-consistency-streak">${consistency.streak} dia${consistency.streak === 1 ? "" : "s"}</strong>
                        </div>

                        <div class="questions-hub-consistency-grid" aria-hidden="true">
                            ${consistency.cells.map((cell) => `
                                <span class="questions-hub-consistency-cell${cell.active ? " is-active" : ""}"></span>
                            `).join("")}
                        </div>
                    </section>
                    <aside class="questions-hub-focus-side">
                        <div class="questions-hub-mini-grid">
                            <article class="questions-hub-mini-card">
                                <span>Dias ativos</span>
                                <strong>${consistency.activeDays}</strong>
                                <small>nos Ãºltimos 28 dias</small>
                            </article>
                            <article class="questions-hub-mini-card">
                                <span>Semana atual</span>
                                <strong>${consistency.weeklyActive}/7</strong>
                                <small>dias com estudo</small>
                            </article>
                            <article class="questions-hub-mini-card">
                                <span>FrequÃªncia</span>
                                <strong>${consistency.consistencyRate}%</strong>
                                <small>presenÃ§a no ciclo</small>
                            </article>
                            <article class="questions-hub-mini-card">
                                <span>GamificaÃ§Ã£o</span>
                                <strong>${consistency.streak >= 7 ? "Em alta" : consistency.streak >= 3 ? "No ritmo" : "Aquecendo"}</strong>
                                <small>status da rotina pessoal</small>
                            </article>
                        </div>
                    </aside>
                </div>
            </section>
        `;
    },

    renderProgressHubCurrentBlock(model) {
        if (
            model.statsSection ===
            "resumo"
        ) {
            return this.renderProgressHubSummarySurface(
                model
            );
        }

        if (
            model.statsSection ===
            "melhorar"
        ) {
            return this.renderProgressHubImproveSurface(
                model
            );
        }

        if (
            model.statsSection ===
            "evolucao"
        ) {
            return this.renderProgressHubEvolutionSurface(
                model
            );
        }

        return this.renderProgressHubConsistencySurface(
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
                        <span>Radar da matÃ©ria</span>
                        <strong>${this.escapeHtml(model.activeSubjectLabel)} Â· ${this.escapeHtml(this.formatSerieLabel(model.activeSerie))}</strong>
                    </summary>
                    <div class="questions-hub-radar-card">
                        <div class="questions-hub-filter-block">
                            <div class="questions-hub-filter-title">S\u00e9rie em radar</div>
                            <div class="questions-hub-filter-row">
                                ${model.series.map((serie) => `
                                    <button class="questions-hub-filter-pill${Number(model.activeSerie) === Number(serie.key) ? " is-active" : ""}" type="button" data-hub-serie="${serie.key}">
                                        ${this.escapeHtml(serie.label)}
                                    </button>
                                `).join("")}
                            </div>
                        </div>

                        <div class="questions-hub-filter-block">
                            <div class="questions-hub-filter-title">MatÃ©ria em radar</div>
                            <div class="questions-hub-filter-row">
                                ${model.subjects.length ? model.subjects.map((subject) => `
                                    <button class="questions-hub-filter-pill questions-hub-filter-pill-subject${model.activeSubject === subject.key ? " is-active" : ""}" type="button" data-hub-subject="${this.escapeHtml(subject.key)}">
                                        ${this.escapeHtml(subject.label)}
                                    </button>
                                `).join("") : `
                                    <div class="questions-empty-inline">Nenhuma matÃ©ria pronta para essa sÃ©rie ainda.</div>
                                `}
                            </div>
                        </div>

                        <div class="questions-hub-radar-layout">
                            ${this.renderProgressHubRadar(model.radarMetrics)}
                            <div class="questions-hub-radar-meta">
                                <article class="questions-hub-radar-note">
                                    <span>Leitura ativa</span>
                                    <strong>${model.activeAccuracy}% de acerto</strong>
                                    <small>${model.activeTotals.attempts || 0} questÃµes Â· ${QuestionsService.formatTime(model.activeAvgTimeMs)}</small>
                                </article>
                                <article class="questions-hub-radar-note">
                                    <span>Cobertura do assunto</span>
                                    <strong>${model.activeTopicCoverage}/${model.availableTopicCount || 0}</strong>
                                    <small>tÃ³pico(s) jÃ¡ apareceram nas sessÃµes</small>
                                </article>
                                <article class="questions-hub-radar-note">
                                    <span>Tempo investido</span>
                                    <strong>${this.formatHubHours(model.activeHours)}</strong>
                                    <small>neste recorte de sÃ©rie e matÃ©ria</small>
                                </article>
                            </div>
                        </div>
                    </div>
                </details>

                <details class="questions-hub-section questions-hub-section-subjects" open>
                    <summary class="questions-hub-summary">
                        <span>Mapa por matÃ©ria</span>
                        <strong>${model.subjectBreakdown.length} frente(s) com hist\u00f3rico</strong>
                    </summary>
                    <div class="questions-hub-bars">
                        ${model.subjectBreakdown.length ? model.subjectBreakdown.map((subject) => `
                            <article class="questions-hub-bar-card">
                                <div class="questions-hub-bar-copy">
                                    <strong>${this.escapeHtml(subject.subjectLabel)}</strong>
                                    <span>${subject.attempts} questÃµes Â· ${subject.topicCount} assunto(s) Â· ${subject.accuracy}% de acerto</span>
                                </div>
                                <div class="questions-hub-bar-track">
                                    <div class="questions-hub-bar-fill questions-hub-bar-fill-cyan" style="width:${Math.max(8, subject.accuracy)}%"></div>
                                </div>
                                <div class="questions-hub-bar-side">${subject.errorRate}% erro</div>
                            </article>
                        `).join("") : `
                            <div class="questions-empty-inline questions-empty-inline-soft">
                                As matÃ©rias vÃ£o aparecer aqui conforme as sessÃµes entrarem.
                            </div>
                        `}
                    </div>
                </details>

                <details class="questions-hub-section questions-hub-section-series">
                    <summary class="questions-hub-summary">
                        <span>Leitura por s\u00e9rie</span>
                        <strong>${model.seriesBreakdown.length} s\u00e9rie(s) com hist\u00f3rico</strong>
                    </summary>
                    <div class="questions-hub-bars">
                        ${model.seriesBreakdown.length ? model.seriesBreakdown.map((serie) => `
                            <article class="questions-hub-bar-card">
                                <div class="questions-hub-bar-copy">
                                    <strong>${this.escapeHtml(serie.label)}</strong>
                                    <span>${serie.attempts} questÃµes Â· ${serie.sessions} sessÃ£o(Ãµes) Â· ${QuestionsService.formatTime(serie.avgTimeMs)}</span>
                                </div>
                                <div class="questions-hub-bar-track">
                                    <div class="questions-hub-bar-fill questions-hub-bar-fill-mint" style="width:${Math.max(8, serie.accuracy)}%"></div>
                                </div>
                                <div class="questions-hub-bar-side">${serie.accuracy}% acerto</div>
                            </article>
                        `).join("") : `
                            <div class="questions-empty-inline questions-empty-inline-soft">
                                Quando outras s\u00e9ries entrarem em jogo, esse corte aparece aqui.
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
                        <div class="questions-panel-label">Tempo mÃ©dio por resposta</div>
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
                                    Ainda nÃ£o hÃ¡ tempo mÃ©dio suficiente para esse recorte.
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
                                    Ainda nÃ£o hÃ¡ tempo total suficiente para esse recorte.
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
                                <div class="questions-hub-filter-title">Passo 1 Â· Serie</div>
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
                                <div class="questions-hub-filter-title">Passo 2 Â· MatÃ©ria</div>
                                <div class="questions-hub-filter-row">
                                    ${model.subjects.length ? model.subjects.map((subject) => `
                                        <button class="questions-hub-filter-pill questions-hub-filter-pill-subject${model.activeSubject === subject.key ? " is-active" : ""}" type="button" data-hub-subject="${this.escapeHtml(subject.key)}">
                                            ${this.escapeHtml(subject.label)}
                                        </button>
                                    `).join("") : `
                                        <div class="questions-empty-inline">Nenhuma matÃ©ria pronta para essa sÃ©rie ainda.</div>
                                    `}
                                </div>
                            </div>
                        ` : ""}

                        ${model.statsScope === "assunto" ? `
                            <div class="questions-hub-filter-block">
                                <div class="questions-hub-filter-title">Passo 3 Â· Assunto</div>
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
                                    <span>PrecisÃ£o do recorte</span>
                                    <strong>${Math.round(model.radarMetrics.find((item) => item.label === "PrecisÃ£o")?.value || 0)}%</strong>
                                    <small>${this.escapeHtml(model.scopeSummary)}</small>
                                </article>
                                <article class="questions-hub-radar-note">
                                    <span>Tempo mÃ©dio</span>
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
                                    <small>PrecisÃ£o = acerto, Cobertura = quanto do recorte jÃ¡ apareceu, Ritmo = tempo mÃ©dio, ConstÃ¢ncia = quantidade de sessÃµes, TraÃ§Ã£o = volume respondido, DomÃ­nio = saldo entre acertos e erros.</small>
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
                        <span>ComparaÃ§Ã£o do recorte</span>
                        <strong>${comparisonItems.length} item(ns) visÃ­veis</strong>
                    </summary>
                    <div class="questions-hub-bars">
                        ${comparisonItems.length ? comparisonItems.map((item) => `
                            <article class="questions-hub-bar-card">
                                <div class="questions-hub-bar-copy">
                                    <strong>${this.escapeHtml(item.subjectLabel || item.topicLabel || item.label)}</strong>
                                    <span>${item.attempts} questÃµes Â· ${(item.topicCount || 1)} item(ns) Â· ${item.accuracy}% de acerto</span>
                                </div>
                                <div class="questions-hub-bar-track">
                                    <div class="questions-hub-bar-fill questions-hub-bar-fill-cyan" style="width:${Math.max(8, item.accuracy || 0)}%"></div>
                                </div>
                                <div class="questions-hub-bar-side">${item.errorRate || 0}% erro</div>
                            </article>
                        `).join("") : `
                            <div class="questions-empty-inline questions-empty-inline-soft">
                                Ainda nÃ£o hÃ¡ comparaÃ§Ã£o suficiente para esse recorte.
                            </div>
                        `}
                    </div>
                </details>

                <details class="questions-hub-section questions-hub-section-series" open>
                    <summary class="questions-hub-summary">
                        <span>Leitura por s\u00e9rie</span>
                        <strong>${model.seriesBreakdown.length} s\u00e9rie(s) com hist\u00f3rico</strong>
                    </summary>
                    <div class="questions-hub-bars">
                        ${model.seriesBreakdown.length ? model.seriesBreakdown.map((serie) => `
                            <article class="questions-hub-bar-card">
                                <div class="questions-hub-bar-copy">
                                    <strong>${this.escapeHtml(serie.label)}</strong>
                                    <span>${serie.attempts} questÃµes Â· ${serie.sessions} sessÃ£o(Ãµes) Â· ${QuestionsService.formatTime(serie.avgTimeMs)}</span>
                                </div>
                                <div class="questions-hub-bar-track">
                                    <div class="questions-hub-bar-fill questions-hub-bar-fill-mint" style="width:${Math.max(8, serie.accuracy)}%"></div>
                                </div>
                                <div class="questions-hub-bar-side">${serie.accuracy}% acerto</div>
                            </article>
                        `).join("") : `
                            <div class="questions-empty-inline questions-empty-inline-soft">
                                Quando outras s\u00e9ries entrarem em jogo, esse corte aparece aqui.
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
                                    <span>${topic.errors} erro(s) Â· ${Math.round((topic.accuracy || 0) * 100)}% de acerto</span>
                                </div>
                            `).join("") : `
                                <div class="questions-empty-inline">Ainda nÃ£o hÃ¡ erro suficiente para cravar um ponto fraco.</div>
                            `}
                        </article>

                        <article class="questions-hub-focus-card questions-hub-focus-card-strong">
                            <div class="questions-panel-label">Pontos fortes</div>
                            ${model.strongOverall.length ? model.strongOverall.map((topic) => `
                                <div class="questions-hub-topic-row">
                                    <strong>${this.escapeHtml(topic.topicLabel)}</strong>
                                    <span>${topic.hits} acerto(s) Â· ${Math.round((topic.accuracy || 0) * 100)}% de precis\u00e3o</span>
                                </div>
                            `).join("") : `
                                <div class="questions-empty-inline">Os pontos fortes v\u00e3o ganhar nome assim que os acertos se acumularem.</div>
                            `}
                        </article>
                    </div>
                </details>

                <details class="questions-hub-section questions-hub-section-recommendations" open>
                    <summary class="questions-hub-summary">
                        <span>Rotas sugeridas agora</span>
                        <strong>o que vale refor\u00e7ar</strong>
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
                                <strong>${this.escapeHtml(session.subjectLabel || "Sess\u00e3o")}</strong>
                                <span>${session.accuracy || 0}% Â· ${session.amount || 0} questÃµes</span>
                            </div>
                        `).join("") : `
                            <div class="questions-empty-inline questions-empty-inline-soft">
                                As Ãºltimas sessÃµes vÃ£o aparecer aqui para ajudar na leitura do ritmo.
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
                <button class="questions-hub-action questions-hub-action-smart" type="button" data-launcher-view="quick">
                    Rapido
                </button>
                <button id="questionsHubSmartBtn" class="questions-hub-action questions-hub-action-smart" type="button">
                    Treino inteligente
                </button>
                <button id="questionsHubReinforceBtn" class="questions-hub-action questions-hub-action-reinforce" type="button">
                    Treino de refor\u00e7o
                </button>
            </div>
        `;
    },

    buildSmartRadialSlices(
        items = [],
        options = {}
    ) {
        const safeItems =
            Array.isArray(items)
                ? items
                : [];
        const totalItems =
            Math.max(
                safeItems.length,
                1
            );
        const innerRadius =
            Number.isFinite(
                options.innerRadius
            )
                ? Number(
                    options.innerRadius
                )
                : 18;
        const outerRadius =
            Number.isFinite(
                options.outerRadius
            )
                ? Number(
                    options.outerRadius
                )
                : 48;
        const labelRadius =
            Number.isFinite(
                options.labelRadius
            )
                ? Number(
                    options.labelRadius
                )
                : 30;
        const noteRadius =
            Number.isFinite(
                options.noteRadius
            )
                ? Number(
                    options.noteRadius
                )
                : null;
        const actionRadius =
            Number.isFinite(
                options.actionRadius
            )
                ? Number(
                    options.actionRadius
                )
                : null;
        const labelMode =
            options.labelMode ===
            "horizontal"
                ? "horizontal"
                : "radial";
        const labelFormatter =
            typeof options.labelFormatter ===
            "function"
                ? options.labelFormatter
                : (item) =>
                    String(
                        item?.label || ""
                    );
        const noteFormatter =
            typeof options.noteFormatter ===
            "function"
                ? options.noteFormatter
                : (item) =>
                    String(
                        item?.note || ""
                    );
        const sliceAngle =
            360 / totalItems;
        const polarToPercent = (
            angleDeg,
            radius
        ) => {
            const radians =
                ((angleDeg - 90) *
                    Math.PI) /
                180;

            return {
                x:
                    50 +
                    Math.cos(radians) *
                        radius,
                y:
                    50 +
                    Math.sin(radians) *
                        radius
            };
        };
        const buildSlicePath = (
            middleAngle
        ) => {
            const startAngle =
                middleAngle -
                sliceAngle / 2;
            const endAngle =
                middleAngle +
                sliceAngle / 2;
            const largeArcFlag =
                sliceAngle > 180 ? 1 : 0;
            const innerStart =
                polarToPercent(
                    startAngle,
                    innerRadius
                );
            const innerEnd =
                polarToPercent(
                    endAngle,
                    innerRadius
                );
            const outerStart =
                polarToPercent(
                    startAngle,
                    outerRadius
                );
            const outerEnd =
                polarToPercent(
                    endAngle,
                    outerRadius
                );

            return [
                `M ${innerStart.x.toFixed(2)} ${innerStart.y.toFixed(2)}`,
                `L ${outerStart.x.toFixed(2)} ${outerStart.y.toFixed(2)}`,
                `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x.toFixed(2)} ${outerEnd.y.toFixed(2)}`,
                `L ${innerEnd.x.toFixed(2)} ${innerEnd.y.toFixed(2)}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x.toFixed(2)} ${innerStart.y.toFixed(2)}`,
                "Z"
            ].join(" ");
        };

        return safeItems.map(
            (item, index) => {
                const middleAngle =
                    index *
                    sliceAngle;
                const labelPoint =
                    polarToPercent(
                        middleAngle,
                        labelRadius
                    );
                const notePoint =
                    noteRadius === null
                        ? null
                        : polarToPercent(
                            middleAngle,
                            noteRadius
                        );
                const actionPoint =
                    actionRadius ===
                    null
                        ? null
                        : polarToPercent(
                            middleAngle,
                            actionRadius
                        );

                return {
                    ...item,
                    displayLabel:
                        labelFormatter(item),
                    displayNote:
                        noteFormatter(item),
                    middleAngle,
                    path:
                        buildSlicePath(
                            middleAngle
                        ),
                    labelX:
                        labelPoint.x.toFixed(
                            2
                        ),
                    labelY:
                        labelPoint.y.toFixed(
                            2
                        ),
                    labelRotate:
                        labelMode ===
                        "radial"
                            ? (
                                middleAngle -
                                90
                            ).toFixed(2)
                            : "0",
                    noteX:
                        notePoint
                            ? notePoint.x.toFixed(
                                2
                            )
                            : "",
                    noteY:
                        notePoint
                            ? notePoint.y.toFixed(
                                2
                            )
                            : "",
                    actionLeft:
                        actionPoint
                            ? `${actionPoint.x.toFixed(2)}%`
                            : "",
                    actionTop:
                        actionPoint
                            ? `${actionPoint.y.toFixed(2)}%`
                            : ""
                };
            }
        );
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
        const radialSeries =
            this.buildSmartRadialSlices(
                startOptions,
                {
                    innerRadius: 17,
                    outerRadius: 48,
                    labelRadius: 30,
                    noteRadius: 38,
                    labelMode:
                        "horizontal"
                }
            );
        return `
            <section class="questions-card questions-entry-subview questions-smart-start-card questions-smart-series-card">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Treino inteligente</div>
                        <div class="questions-smart-step">1/3</div>
                    </div>

                    <div class="questions-entry-actions questions-smart-entry-actions">
                        <button class="questions-secondary-btn questions-smart-back-btn" type="button" data-launcher-back="true">Voltar</button>
                    </div>
                </div>

                ${page.getRuntimeNotice() ? `
                    <div class="questions-inline-notice">
                        ${page.getRuntimeNotice()}
                    </div>
                ` : ""}

                <div class="questions-smart-start-shell">
                    <button id="questionsSmartSelectAllBtn" class="questions-smart-ring-toggle${allAvailableActive ? " is-active" : ""}" type="button">
                        ${allAvailableActive ? "Desmarcar" : "Marcar todas"}
                    </button>

                    <div class="questions-smart-radial-stage questions-smart-radial-stage-series">
                        <div class="questions-smart-pizza-shell">
                            <div class="questions-smart-pizza questions-smart-pizza--series">
                                <svg class="questions-smart-pizza-svg" viewBox="0 0 100 100" aria-label="Selecao radial de series">
                                    ${radialSeries.map((item) => `
                                        <g class="questions-smart-slice-slot questions-smart-series-slice-slot${item.active ? " is-active" : ""}${item.disabled ? " is-disabled" : ""}">
                                            <path
                                                class="questions-smart-slice questions-smart-series-slice"
                                                d="${item.path}"
                                                data-smart-start-option="${this.escapeHtml(item.key)}"
                                                aria-pressed="${item.active ? "true" : "false"}"
                                            ></path>
                                            <text
                                                class="questions-smart-slice-copy questions-smart-series-slice-copy"
                                                x="${item.labelX}"
                                                y="${item.labelY}"
                                            >
                                                <tspan x="${item.labelX}" dy="0">${this.escapeHtml(item.displayLabel)}</tspan>
                                                ${item.displayNote ? `<tspan class="questions-smart-series-slice-note" x="${item.labelX}" dy="4.2">${this.escapeHtml(item.displayNote)}</tspan>` : ""}
                                            </text>
                                        </g>
                                    `).join("")}
                                </svg>

                                <div class="questions-smart-pizza-core">
                                    <button id="questionsSmartContinueBtn" class="questions-smart-core${activeCount ? " is-ready" : ""}" type="button" ${activeCount ? "" : "disabled"}>
                                        <strong>Ir</strong>
                                        <span></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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
                    !item.disabled &&
                    item.selectedTopicCount !==
                        0
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
        const editorSubject =
            subjectOptions.find(
                (item) =>
                    item.key ===
                        page.smartSubjectEditorKey &&
                    item.active &&
                    !item.disabled &&
                    item.hasTopicEditor
            ) || null;
        const editorTopics =
            editorSubject?.topicOptions
                ?.length
                ? editorSubject.topicOptions
                : editorSubject
                    ? page.getSmartSubjectTopicOptions(
                        editorSubject.key
                    )
                    : [];
        const editorSelectedCount =
            editorTopics.filter(
                (topic) => topic.active
            ).length;
        const resolvedFocusSubject =
            typeof page.resolveSmartSubjectFocus ===
            "function"
                ? page.resolveSmartSubjectFocus(
                    visibleSubjects
                )
                : null;
        const focusedSubjectKey =
            editorSubject?.key ||
            resolvedFocusSubject?.key ||
            "";
        const reviewModel =
            typeof page.buildSmartTopicReviewModel ===
            "function"
                ? page.buildSmartTopicReviewModel()
                : {
                    activeSubjects: [],
                    totalTopics: 0
                };
        const visibleSubjectSlices =
            this.buildSmartRadialSlices(
                visibleSubjects,
                {
                    innerRadius: 18,
                    outerRadius: 48,
                    labelRadius: 31,
                    actionRadius: 43.8,
                    labelMode:
                        "radial",
                    labelFormatter:
                        (item) =>
                            item.label ===
                            "Educacao Fisica" ||
                            item.label ===
                            "EducaÃƒÂ§ÃƒÂ£o FÃƒÂ­sica"
                                ? "Ed Fisica"
                                : item.label,
                    labelFormatter:
                        (item) => {
                            const normalizedLabel =
                                String(
                                    item.label ||
                                        ""
                                )
                                    .normalize(
                                        "NFD"
                                    )
                                    .replace(
                                        /[\u0300-\u036f]/g,
                                        ""
                                    );

                            return normalizedLabel ===
                                "Educacao Fisica"
                                ? "Ed Fisica"
                                : item.label;
                        }
                }
            );
        /*
        const sliceAngle =
            360 / totalSubjects;
        const legacyVisibleSubjectSlices =
            visibleSubjects.map(
                (item, index) => {
                    const middleAngle =
                        index *
                        sliceAngle;
                    const displayLabel =
                        item.label ===
                        "Educação Física"
                            ? "Ed FÃ­sica"
                            : item.label;
                    const labelPoint =
                        polarToPercent(
                            middleAngle,
                            23
                        );
                    const actionPoint =
                        polarToPercent(
                            middleAngle,
                            45.5
                        );

                    return {
                        ...item,
                        displayLabel,
                        path:
                            buildSlicePath(
                                middleAngle
                            ),
                        labelX:
                            labelPoint.x.toFixed(2),
                        labelY:
                            labelPoint.y.toFixed(2),
                        labelRotate:
                            (
                                middleAngle - 90
                            ).toFixed(2),
                        actionLeft:
                            `${actionPoint.x.toFixed(2)}%`,
                        actionTop:
                            `${actionPoint.y.toFixed(2)}%`,
                        actionRotate:
                            `${middleAngle.toFixed(2)}deg`
                    };
                }
            );
        */

        return `
            <section class="questions-card questions-entry-subview questions-smart-start-card questions-smart-subject-card">
                <div class="questions-head questions-entry-head">
                    <div>
                        <div class="questions-kicker">Treino inteligente</div>
                        <div class="questions-smart-step">2/3</div>
                    </div>

                    <div class="questions-entry-actions questions-smart-entry-actions">
                        <button class="questions-secondary-btn questions-smart-back-btn" type="button" data-launcher-back="true">Voltar</button>
                    </div>
                </div>

                ${page.getRuntimeNotice() ? `
                    <div class="questions-inline-notice">
                        ${page.getRuntimeNotice()}
                    </div>
                ` : ""}

                ${subjectOptions.length ? `
                    <div class="questions-smart-start-shell${editorSubject ? " is-topic-editor-open" : ""}">
                        <button id="questionsSmartSubjectsSelectAllBtn" class="questions-smart-ring-toggle${allActive ? " is-active" : ""}" type="button">
                            ${allActive ? "Desmarcar" : "Marcar todas"}
                        </button>

                        ${editorSubject ? `
                            <div class="questions-smart-topic-editor" data-smart-topic-editor-panel="true">
                                <div class="questions-smart-topic-editor-head">
                                    <div class="questions-smart-topic-editor-copy">
                                        <span class="questions-kicker">Assuntos da materia</span>
                                        <strong>${this.escapeHtml(editorSubject.label)}</strong>
                                        <p>Desmarque o que voce nao quer levar para este treino inteligente.</p>
                                    </div>

                                    <div class="questions-smart-topic-editor-actions">
                                        <button class="questions-smart-topic-editor-btn" type="button" data-smart-topic-editor-close="true">
                                            Fechar
                                        </button>
                                        <button class="questions-smart-topic-editor-btn" type="button" data-smart-topic-editor-select-all="${this.escapeHtml(editorSubject.key)}">
                                            Marcar todos
                                        </button>
                                        <button class="questions-smart-topic-editor-btn" type="button" data-smart-topic-editor-clear-all="${this.escapeHtml(editorSubject.key)}">
                                            Desmarcar todos
                                        </button>
                                        <button class="questions-smart-topic-editor-btn is-primary" type="button" data-smart-topic-editor-apply="${this.escapeHtml(editorSubject.key)}">
                                            Aplicar
                                        </button>
                                    </div>
                                </div>

                                ${editorTopics.length ? `
                                    <div class="questions-smart-topic-editor-list">
                                        ${editorTopics.map((topic) => `
                                            <button
                                                class="questions-smart-topic-row${topic.active ? " is-active" : " is-excluded"}"
                                                type="button"
                                                data-smart-topic-subject="${this.escapeHtml(editorSubject.key)}"
                                                data-smart-topic-toggle="${this.escapeHtml(topic.key)}"
                                            >
                                                <span class="questions-smart-topic-row-check" aria-hidden="true"></span>
                                                <span class="questions-smart-topic-row-copy">
                                                    <strong>${this.escapeHtml(topic.label)}</strong>
                                                    <small>${topic.count || 0} questoes prontas</small>
                                                </span>
                                            </button>
                                        `).join("")}
                                    </div>
                                ` : `
                                    <div class="questions-empty-inline questions-empty-inline-soft">
                                        Nenhum assunto pronto ficou disponivel para essa materia com o recorte atual.
                                    </div>
                                `}

                                <div class="questions-smart-topic-editor-foot">
                                    <span>${editorSelectedCount} assunto(s) ativo(s)</span>
                                </div>
                            </div>
                        ` : ""}

                        <div class="questions-smart-radial-stage">
                            <div class="questions-smart-pizza-shell">
                                <div class="questions-smart-pizza questions-smart-pizza--subjects">
                                    <svg class="questions-smart-pizza-svg" viewBox="0 0 100 100" aria-label="Selecao radial de materias">
                                        ${visibleSubjectSlices.map((item) => `
                                            <g class="questions-smart-slice-slot${item.active ? " is-active" : ""}${item.disabled ? " is-disabled" : ""}${item.hasTopicOverrides ? " has-topic-overrides" : ""}${focusedSubjectKey === item.key ? " is-focused" : ""}${editorSubject?.key === item.key ? " is-editor-open" : ""}">
                                                <path
                                                    class="questions-smart-slice"
                                                    d="${item.path}"
                                                    data-smart-subject-option="${this.escapeHtml(item.key)}"
                                                    aria-pressed="${item.active ? "true" : "false"}"
                                                ></path>
                                                <text
                                                    class="questions-smart-slice-copy"
                                                    x="${item.labelX}"
                                                    y="${item.labelY}"
                                                    transform="rotate(${item.labelRotate} ${item.labelX} ${item.labelY})"
                                                >
                                                    ${this.escapeHtml(item.displayLabel)}
                                                </text>
                                            </g>
                                        `).join("")}
                                    </svg>

                                    ${visibleSubjectSlices.map((item) =>
                                        item.active &&
                                        !item.disabled &&
                                        item.selectedTopicCount !==
                                            0 &&
                                        item.hasTopicEditor
                                            ? `
                                        <button
                                            class="questions-smart-slice-action${editorSubject?.key === item.key ? " is-active" : ""}"
                                            type="button"
                                            data-smart-subject-editor="${this.escapeHtml(item.key)}"
                                            style="left: ${item.actionLeft}; top: ${item.actionTop};"
                                        >
                                            Assunto
                                        </button>
                                    `
                                            : ""
                                    ).join("")}

                                    <div class="questions-smart-pizza-core">
                                        <button id="questionsSmartSubjectsContinueBtn" class="questions-smart-core${activeCount ? " is-ready" : ""}" type="button" ${activeCount ? "" : "disabled"}>
                                            <strong>Ir</strong>
                                            <span></span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        ${page.smartTopicReviewOpen ? `
                            <div class="questions-smart-topic-review-scrim" data-smart-topic-review-close="true"></div>
                            <section class="questions-smart-topic-review" role="dialog" aria-modal="true" aria-label="Revisar assuntos selecionados">
                                <div class="questions-smart-topic-review-head">
                                    <div>
                                        <span class="questions-kicker">Antes de gerar</span>
                                        <h3>Revise os assuntos das materias selecionadas</h3>
                                        <p>Desmarque o que nao quer levar. Se estiver tudo certo, seguimos com todos os assuntos ativos.</p>
                                    </div>
                                    <div class="questions-smart-topic-review-summary">
                                        <strong>${reviewModel.activeSubjects.length}</strong>
                                        <span>materia(s)</span>
                                        <strong>${reviewModel.totalTopics}</strong>
                                        <span>assunto(s)</span>
                                    </div>
                                </div>

                                <div class="questions-smart-topic-review-list">
                                    ${reviewModel.activeSubjects.map((subject) => `
                                        <article class="questions-smart-topic-review-group">
                                            <div class="questions-smart-topic-review-group-head">
                                                <div>
                                                    <strong>${this.escapeHtml(subject.label)}</strong>
                                                    <span>${subject.selectedTopicCount} assunto(s) ativo(s)</span>
                                                </div>
                                                <div class="questions-smart-topic-review-group-actions">
                                                    <button class="questions-smart-topic-editor-btn" type="button" data-smart-topic-editor-select-all="${this.escapeHtml(subject.key)}">
                                                        Todos
                                                    </button>
                                                    <button class="questions-smart-topic-editor-btn" type="button" data-smart-topic-editor-clear-all="${this.escapeHtml(subject.key)}">
                                                        Limpar
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="questions-smart-topic-review-topic-grid">
                                                ${subject.topicOptions.map((topic) => `
                                                    <button
                                                        class="questions-smart-topic-row${topic.active ? " is-active" : " is-excluded"}"
                                                        type="button"
                                                        data-smart-topic-subject="${this.escapeHtml(subject.key)}"
                                                        data-smart-topic-toggle="${this.escapeHtml(topic.key)}"
                                                    >
                                                        <span class="questions-smart-topic-row-check" aria-hidden="true"></span>
                                                        <span class="questions-smart-topic-row-copy">
                                                            <strong>${this.escapeHtml(topic.label)}</strong>
                                                            <small>${topic.count || 0} questoes prontas${topic.subtopicCount ? ` Â· ${topic.subtopicCount} subtopico(s)` : ""}</small>
                                                        </span>
                                                    </button>
                                                `).join("")}
                                            </div>
                                        </article>
                                    `).join("")}
                                </div>

                                <div class="questions-smart-topic-review-foot">
                                    <button class="questions-secondary-btn" type="button" data-smart-topic-review-close="true">
                                        Voltar
                                    </button>
                                    <button class="questions-primary-btn" type="button" data-smart-topic-review-continue="true">
                                        Seguir com selecao
                                    </button>
                                </div>
                            </section>
                        ` : ""}
                        ${hiddenSubjects ? `
                            <div class="questions-inline-note questions-smart-subject-note">
                                +${hiddenSubjects} matÃ©ria(s) continuam disponÃ­veis. Ajuste as sÃ©ries para refinar mais se quiser.
                            </div>
                        ` : ""}
                    </div>
                ` : `
                    <div class="questions-empty-inline">
                        Nenhuma matÃ©ria ficou disponÃ­vel com as sÃ©ries ativas. Volte e ajuste a seleÃ§Ã£o.
                    </div>
                `}
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

                    <div class="questions-entry-actions questions-smart-entry-actions">
                        <button class="questions-secondary-btn questions-review-btn questions-smart-back-btn" type="button" data-launcher-back="true">Voltar</button>
                    </div>
                </div>

                ${page.getRuntimeNotice() ? `
                    <div class="questions-inline-notice">
                        ${page.getRuntimeNotice()}
                    </div>
                ` : ""}

                <section class="questions-smart-config-card">
                    <div class="questions-smart-config-group questions-smart-config-group--solo">
                        <div class="questions-panel-label">Quantidade de questÃµes</div>
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

                    <div class="questions-entry-actions questions-smart-entry-actions">
                        <button class="questions-secondary-btn questions-review-btn questions-smart-back-btn" type="button" data-launcher-back="true">Voltar</button>
                    </div>
                </div>

                ${page.getRuntimeNotice() ? `
                    <div class="questions-inline-notice">
                        ${page.getRuntimeNotice()}
                    </div>
                ` : ""}

                <section class="questions-smart-config-card">
                    <div class="questions-smart-config-group">
                        <div class="questions-panel-label">Quantidade de questÃµes</div>
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
                                âˆž
                            </button>
                        </div>
                    </div>

                    <div class="questions-smart-config-group">
                        <div class="questions-panel-label">Quantidade de questÃµes</div>
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
                                âˆž
                            </button>
                        </div>
                    </div>

                    ${preview.isReady ? `
                        <div class="questions-smart-config-note">
                            <span>${preview.serieLabel} â€¢ ${preview.materiaLabel}</span>
                            <strong>${preview.trainingValueLabel === "âˆž" ? "Todas as questÃµes disponÃ­veis" : `${preview.amount || 0} questÃµes previstas`}</strong>
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
                                    ? `${profile.preferredAmount} questÃµes`
                                    : "",
                                ...(profile.excludedSeries || []).map((serie) => `${serie}a s\u00e9rie fora`),
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
                                        <span>${block.mode === "smart" ? "Treino inteligente" : "Treino especÃ­fico"} | ${meta.amount || block.questionIds?.length || 0} questÃµes</span>
                                        <span>${meta.materiaLabel || "MatÃ©ria"}${topicLabels.length ? ` | ${topicLabels.join(", ")}` : ""}</span>
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
                    <button class="questions-secondary-btn" type="button" data-launcher-view="simulado_build">
                        Montar simulado
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
                        <p>As sessÃµes em andamento ficam salvas com progresso. As concluÃ­das continuam disponÃ­veis para reiniciar sem remontar a rota.</p>
                    </div>

                    <div class="questions-entry-actions">
                        <button class="questions-secondary-btn" type="button" data-launcher-back="true">Voltar</button>
                    </div>
                </div>

                ${!inProgressRuns.length && !completedRuns.length ? `
                    <div class="questions-empty-inline">
                        Nenhuma sessÃ£o salva ainda. Quando vocÃª iniciar um treino, o progresso vai aparecer aqui automaticamente.
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
                                                <span>${run.mode === "smart" ? "Treino inteligente" : "Treino especÃ­fico"} | ${run.routeSnapshot?.meta?.amount || run.questionIds?.length || 0} questÃµes</span>
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
                                                <span>${run.summary?.accuracy || 0}% de acerto | ${run.summary?.total || run.questionIds?.length || 0} questÃµes</span>
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
                                    As sessÃµes concluÃ­das vÃ£o aparecer aqui depois dos primeiros treinos.
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
                    <strong>${meta.materiaLabel || "MatÃ©ria"}</strong>
                    <span>MatÃ©ria ativa</span>
                </article>
                <article class="questions-session-stat">
                    <strong>${meta.amount || total}</strong>
                    <span>QuestÃµes na rota</span>
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
                "MatÃ©ria",
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
                    <span>MatÃ©ria</span>
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
                    <div class="questions-panel-label">InformaÃ§Ãµes da questÃ£o</div>
                    <button id="questionsInfoBackBtn" class="questions-secondary-btn questions-session-info-back-btn" type="button">Voltar</button>
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
                        <span>S\u00e9rie</span>
                        <strong>${this.escapeHtml(this.normalizeSerieLabel(model.serieLabel))}</strong>
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
                <div class="questions-panel-label">ComentÃ¡rio rÃ¡pido</div>
                <p>${question.explanation || "ComentÃ¡rio ainda nÃ£o preenchido para esta questÃ£o."}</p>
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
                        ${isOpen ? "Fechar contestaÃ§Ã£o" : "Contestar questÃ£o"}
                    </button>
                </div>
                ${isOpen ? `
                    <form id="questionsContestForm" class="questions-contest-form">
                        <textarea id="questionsContestInput" class="questions-contest-field" rows="3" placeholder="${this.escapeHtml(defaultText)}"></textarea>
                        <div class="questions-contest-actions">
                            <button id="questionsContestSubmitBtn" class="questions-secondary-btn" type="submit">Enviar contestaÃ§Ã£o</button>
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
                    <span class="questions-confirm-icon">âœ“</span>
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
                    <span class="questions-confirm-icon">âœ“</span>
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
                    <span class="questions-confirm-icon">âœ“</span>
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
                ? "O acerto j\u00e1 ficou registrado na primeira confirma\u00e7\u00e3o. Esta nova resposta conta s\u00f3 como tentativa."
                : "O erro jÃ¡ ficou registrado na primeira confirmaÃ§Ã£o. Esta nova resposta nÃ£o altera o cÃ´mputo.";

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
                        <span class="questions-confirm-icon">â†’</span>
                        PrÃ³xima
                    </button>
                </div>
                <div class="questions-feedback-note">
                    ${isLockedOutcome ? lockedNote : "Responder de novo mant\u00e9m o cron\u00f4metro correndo e conta como nova tentativa."}
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
                <div class="questions-kicker">SessÃ£o concluÃ­da</div>
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
                        <span>tempo mÃ©dio</span>
                    </article>
                    <article class="questions-result-stat">
                        <strong>${summary.topicCount}</strong>
                        <span>assunto(s)</span>
                    </article>
                </div>

                <div class="questions-results-insights">
                    <article class="questions-result-panel">
                        <div class="questions-panel-label">Leitura da sessÃ£o</div>
                        <div class="questions-result-callouts">
                            <div class="questions-result-callout">
                                <strong>Ponto forte</strong>
                                <span>${summary.strongTopic?.topicLabel || "Ainda sem destaque claro nesta rodada."}</span>
                            </div>
                            <div class="questions-result-callout is-warning">
                                <strong>Ponto para refor\u00e7o</strong>
                                <span>${summary.weakTopic?.topicLabel || "Nenhum t\u00f3pico concentrou erro relevante."}</span>
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
                        <button id="questionsFocusWeakBtn" class="questions-secondary-btn" type="button">ReforÃ§ar ponto fraco</button>
                    ` : ""}
                    <button id="questionsReviewErrorsBtn" class="questions-secondary-btn" type="button">Revisar erros</button>
                    <button id="questionsMixedReviewBtn" class="questions-secondary-btn" type="button">Misturar revisÃ£o</button>
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
                <div class="questions-panel-label">Radar da matÃ©ria</div>
                <h3>${subject?.label || "MatÃ©ria"}</h3>
                <div class="questions-stats-grid">
                    <article>
                        <strong>${dashboard.attempts}</strong>
                        <span>tentativas</span>
                    </article>
                    <article>
                        <strong>${Math.round((dashboard.accuracy || 0) * 100)}%</strong>
                        <span>precis\u00e3o</span>
                    </article>
                    <article>
                        <strong>${QuestionsService.formatTime(dashboard.avgTimeMs)}</strong>
                        <span>tempo mÃ©dio</span>
                    </article>
                    <article>
                        <strong>${dashboard.totalSessions || 0}</strong>
                        <span>sessÃµes</span>
                    </article>
                </div>

                <div class="questions-weak-list">
                    <div class="questions-panel-label">Pontos sens\u00edveis</div>
                    ${(dashboard.weakTopics || []).length ? dashboard.weakTopics.map((topic) => `
                        <div class="questions-weak-item">
                            <strong>${topic.topicLabel}</strong>
                            <span>${topic.errors} erro(s)</span>
                        </div>
                    `).join("") : `
                        <div class="questions-empty-inline">
                            O painel vai ganhar vida conforme vocÃª responder questÃµes.
                        </div>
                    `}
                </div>

                <div class="questions-stats-section">
                    <div class="questions-panel-label">Pontos fortes</div>
                    ${(dashboard.strongTopics || []).length ? dashboard.strongTopics.slice(0, 3).map((topic) => `
                        <div class="questions-weak-item questions-weak-item-positive">
                            <strong>${topic.topicLabel}</strong>
                            <span>${Math.round((topic.accuracy || 0) * 100)}% de precis\u00e3o</span>
                        </div>
                    `).join("") : `
                        <div class="questions-empty-inline">
                            Os destaques positivos vÃ£o aparecer conforme vocÃª acumular acertos.
                        </div>
                    `}
                </div>

                <div class="questions-stats-section">
                    <div class="questions-panel-label">Modos mais usados</div>
                    ${(dashboard.modeBreakdown || []).length ? dashboard.modeBreakdown.map((mode) => `
                        <div class="questions-weak-item">
                            <strong>${mode.modeLabel}</strong>
                            <span>${mode.sessions} sessÃ£o(Ãµes) | ${mode.avgAccuracy}% mÃ©dio</span>
                        </div>
                    `).join("") : `
                        <div class="questions-empty-inline">
                            O painel de modos vai ganhar vida conforme vocÃª variar os treinos.
                        </div>
                    `}
                </div>

                <div class="questions-stats-section">
                    <div class="questions-panel-label">SessÃµes focadas</div>
                    ${(dashboard.focusedSessions || []).length ? dashboard.focusedSessions.slice(0, 3).map((session) => `
                        <div class="questions-session-log">
                            <strong>${session.topicLabels?.[0] || session.weakTopicLabel || session.subjectLabel || "Sess\u00e3o focada"}</strong>
                            <span>${session.accuracy || 0}% | ${session.amount || 0} questÃµes</span>
                        </div>
                    `).join("") : `
                        <div class="questions-empty-inline">
                            Quando vocÃª fizer sessÃµes mais focadas, elas aparecem aqui.
                        </div>
                    `}
                </div>

                <div class="questions-stats-section">
                    <div class="questions-panel-label">Resumo r\u00e1pido</div>
                    <div class="questions-session-log">
                        <strong>Assunto mais treinado</strong>
                        <span>${dashboard.mostTrainedTopic?.topicLabel || "Ainda sem lideran\u00e7a clara"}</span>
                    </div>
                    <div class="questions-session-log">
                        <strong>Ãšltima leitura</strong>
                        <span>${dashboard.sessions?.[0]?.accuracy ?? 0}% na sessÃ£o mais recente</span>
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
                "[data-quick-action]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.startQuickAction(
                            button.dataset
                                .quickAction
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-simulado-serie]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.setSimuladoSerie(
                            button.dataset
                                .simuladoSerie
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-simulado-subject]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.setSimuladoDraft(
                            {
                                subjectKey:
                                    button.dataset
                                        .simuladoSubject
                            }
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-simulado-topic]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.setSimuladoDraft(
                            {
                                topicKey:
                                    button.dataset
                                        .simuladoTopic
                            }
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-simulado-difficulty]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.setSimuladoDraft(
                            {
                                difficulty:
                                    button.dataset
                                        .simuladoDifficulty
                            }
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-simulado-amount]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.setSimuladoDraft(
                            {
                                amount: Number(
                                    button.dataset
                                        .simuladoAmount
                                )
                            }
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-simulado-edit-block]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.editSimuladoBlock(
                            button.dataset
                                .simuladoEditBlock
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-simulado-delete-block]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.deleteSimuladoBlock(
                            button.dataset
                                .simuladoDeleteBlock
                        );
                    }
                );
            });

        document.getElementById(
            "questionsSimuladoApplyBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.applySimuladoDraft();
            }
        );

        document.getElementById(
            "questionsSimuladoConsolidateBtn"
        )?.addEventListener(
            "click",
            () => {
                this.page.consolidateSimulado();
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
                this.page.openSmartTopicReview();
            }
        );

        document
            .querySelectorAll(
                "[data-smart-topic-review-close]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.closeSmartTopicReview();
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-smart-topic-review-continue]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.continueSmartTopicReview();
                    }
                );
            });

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

        document
            .querySelectorAll(
                "[data-smart-subject-editor]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        const subjectKey =
                            button.dataset
                                .smartSubjectEditor;

                        if (
                            this.page
                                .smartSubjectEditorKey ===
                            subjectKey
                        ) {
                            this.page.closeSmartSubjectEditor();
                            return;
                        }

                        this.page.openSmartSubjectEditor(
                            subjectKey
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-smart-subject-focus]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.focusSmartSubject(
                            button.dataset
                                .smartSubjectFocus
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-smart-topic-toggle]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.toggleSmartSubjectTopic(
                            button.dataset
                                .smartTopicSubject,
                            button.dataset
                                .smartTopicToggle
                        );
                    }
                );
            });

        document
            .querySelector(
                "[data-smart-topic-editor-close]"
            )
            ?.addEventListener(
                "click",
                () => {
                    this.page.closeSmartSubjectEditor();
                }
            );

        document
            .querySelector(
                "[data-smart-topic-editor-apply]"
            )
            ?.addEventListener(
                "click",
                () => {
                    this.page.closeSmartSubjectEditor();
                }
            );

        document
            .querySelectorAll(
                "[data-smart-topic-editor-select-all]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    (event) => {
                        this.page.setAllSmartSubjectTopics(
                            event.currentTarget
                                .dataset
                                .smartTopicEditorSelectAll,
                            true
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-smart-topic-editor-clear-all]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    (event) => {
                        this.page.setAllSmartSubjectTopics(
                            event.currentTarget
                                .dataset
                                .smartTopicEditorClearAll,
                            false
                        );
                    }
                );
            });

        const directSearchInput =
            document.getElementById(
                "questionsDirectSearchInput"
            );

        directSearchInput?.addEventListener(
            "input",
            (event) => {
                this.page.setDirectSearchInput(
                    event.target.value
                );
            }
        );

        directSearchInput?.addEventListener(
            "keydown",
            (event) => {
                if (event.key !== "Enter") {
                    return;
                }

                event.preventDefault();
                this.page.addDirectSearchTerm(
                    event.currentTarget.value
                );
            }
        );

        directSearchInput?.addEventListener(
            "pointerdown",
            (event) => {
                event.stopPropagation();
            }
        );

        document
            .querySelectorAll(
                "[data-direct-search-add]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        const field =
                            document.getElementById(
                                "questionsDirectSearchInput"
                            );
                        this.page.addDirectSearchTerm(
                            field?.value || ""
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-direct-search-remove]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.removeDirectSearchTerm(
                            button.dataset
                                .directSearchRemove
                        );
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-direct-search-clear]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.clearDirectSearchTerms();
                    }
                );
            });

        document
            .querySelectorAll(
                "[data-direct-search-generate]"
            )
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    () => {
                        this.page.startDirectSearchSession();
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
