(function () {
    if (window.PremiumStudyStore) {
        return;
    }

    const defaultBlocks = [
        {
            id: "block-1",
            title: "Bloco recomendado",
            subtitle: "Comece pelo que mais acelera a sua evolucao.",
            duration: "34 min",
            status: "recommended",
            topics: ["Estrutura atomica essencial", "Modelos atomicos"]
        },
        {
            id: "block-2",
            title: "Fixacao objetiva",
            subtitle: "Consolide definicoes, linguagem de prova e relacoes-chave.",
            duration: "22 min",
            status: "ready",
            topics: ["Distribuicao eletronica"]
        }
    ];

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function createState() {
        const today = new Date();
        return {
            step: "entry",
            previousStep: null,
            accessTier: "free",
            studyTitle: "",
            materialName: "",
            materialSizeLabel: "",
            materialPageCount: null,
            examDate: "",
            calendarMonth: today.getMonth(),
            calendarYear: today.getFullYear(),
            targetScore: 8.0,
            studyHours: 1,
            studyMinutes: 30,
            analysisProgress: 8,
            analysisStatus: "pending",
            blocks: clone(defaultBlocks),
            activeBlockId: "block-1",
            blockTab: "aprender",
            latestLocalStudy: null,
            savedDraftId: "",
            savedAt: "",
            sessionNote: "",
            progressLabel: "Seu plano comeca quando o PDF entra."
        };
    }

    function buildStudyTitle(materialName) {
        if (!materialName) {
            return "Estudo personalizado";
        }

        return materialName.replace(/\.pdf$/i, "");
    }

    window.PremiumStudyStore = {
        state: createState(),

        getState() {
            return this.state;
        },

        patch(partial) {
            this.state = {
                ...this.state,
                ...partial
            };

            return this.state;
        },

        setStep(step) {
            this.state = {
                ...this.state,
                previousStep: this.state.step,
                step
            };

            return this.state;
        },

        setMaterial(fileLike) {
            if (!fileLike) {
                return this.state;
            }

            const sizeLabel = typeof fileLike.size === "number"
                ? `${(fileLike.size / (1024 * 1024)).toFixed(1)} MB`
                : "PDF textual";

            const studyTitle = buildStudyTitle(fileLike.name || "material.pdf");

            this.state = {
                ...this.state,
                materialName: fileLike.name || "material.pdf",
                materialSizeLabel: sizeLabel,
                studyTitle,
                progressLabel: "Material recebido. Agora vamos ajustar tudo ao seu prazo e a sua meta."
            };

            return this.state;
        },

        setLatestLocalStudy(summary) {
            this.state = {
                ...this.state,
                latestLocalStudy: summary
            };

            return this.state;
        },

        setExamDate(value) {
            const parts = String(value || "").split("-");
            const year = parts.length === 3 ? Number(parts[0]) : this.state.calendarYear;
            const month = parts.length === 3 ? Number(parts[1]) - 1 : this.state.calendarMonth;
            this.state = {
                ...this.state,
                examDate: value,
                calendarMonth: Number.isFinite(month) ? month : this.state.calendarMonth,
                calendarYear: Number.isFinite(year) ? year : this.state.calendarYear,
                progressLabel: "Data definida. O ritmo do plano ja pode ser calibrado."
            };

            return this.state;
        },

        shiftCalendarMonth(delta) {
            const cursor = new Date(this.state.calendarYear, this.state.calendarMonth + delta, 1);
            this.state = {
                ...this.state,
                calendarMonth: cursor.getMonth(),
                calendarYear: cursor.getFullYear()
            };

            return this.state;
        },

        setTargetScore(value) {
            const score = Math.max(0, Math.min(10, value));
            this.state = {
                ...this.state,
                targetScore: Number(score.toFixed(1)),
                progressLabel: `Meta de ${score.toFixed(1)} definida. O sistema vai mirar nesse resultado.`
            };

            return this.state;
        },

        setStudyHours(value) {
            const hours = Math.max(0, Math.min(12, value));
            this.state = {
                ...this.state,
                studyHours: hours,
                progressLabel: "Carga horaria diaria ajustada para um plano mais realista."
            };

            return this.state;
        },

        setStudyMinutes(value) {
            const minutes = Math.max(0, Math.min(59, value));
            this.state = {
                ...this.state,
                studyMinutes: minutes,
                progressLabel: "Tempo diario refinado. O plano agora conversa melhor com sua rotina."
            };

            return this.state;
        },

        setAnalysisProgress(progress, status) {
            this.state = {
                ...this.state,
                analysisProgress: progress,
                analysisStatus: status || "running"
            };

            return this.state;
        },

        setBlockTab(tab) {
            this.state = {
                ...this.state,
                blockTab: tab
            };

            return this.state;
        },

        selectBlock(blockId) {
            this.state = {
                ...this.state,
                activeBlockId: blockId
            };

            return this.state;
        },

        getActiveBlock() {
            return this.state.blocks.find((block) => block.id === this.state.activeBlockId) || this.state.blocks[0];
        },

        exportSnapshot() {
            return {
                step: this.state.step,
                accessTier: this.state.accessTier,
                studyTitle: this.state.studyTitle,
                materialName: this.state.materialName,
                materialSizeLabel: this.state.materialSizeLabel,
                materialPageCount: this.state.materialPageCount,
                examDate: this.state.examDate,
                targetScore: this.state.targetScore,
                studyHours: this.state.studyHours,
                studyMinutes: this.state.studyMinutes,
                blocks: clone(this.state.blocks),
                activeBlockId: this.state.activeBlockId,
                blockTab: this.state.blockTab,
                savedDraftId: this.state.savedDraftId,
                savedAt: this.state.savedAt,
                progressLabel: this.state.progressLabel
            };
        },

        restoreFromSnapshot(snapshot) {
            if (!snapshot) {
                return this.state;
            }

            const normalizedStep = snapshot.step === "analysis"
                ? "mode-select"
                : snapshot.step || "entry";

            this.state = {
                ...createState(),
                ...snapshot,
                step: normalizedStep,
                studyTitle: snapshot.studyTitle || buildStudyTitle(snapshot.materialName),
                calendarMonth: snapshot.examDate
                    ? Number(String(snapshot.examDate).split("-")[1]) - 1
                    : createState().calendarMonth,
                calendarYear: snapshot.examDate
                    ? Number(String(snapshot.examDate).split("-")[0])
                    : createState().calendarYear,
                latestLocalStudy: this.state.latestLocalStudy
            };

            return this.state;
        }
    };
})();
