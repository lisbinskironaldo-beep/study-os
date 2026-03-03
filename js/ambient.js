/* =====================================================
   AMBIENT SOUND SYSTEM — FIXED
===================================================== */

const Ambient = {

    sounds: {
    rain: {
        label: "🌧",
        src: "audio/rain.mp3"
    },
    cafe: {
        label: "☕",
        src: "audio/cafe.mp3"
    },
    white: {
        label: "🌫",
        src: "audio/white.mp3"
    }
},

    audioMap: {},
    currentKey: null,

    init() {
        this.render();
        this.preload();
    },

    preload() {
        Object.keys(this.sounds).forEach(key => {
            const audio = new Audio(this.sounds[key].src);
            audio.loop = true;
            audio.volume = 0.3;
            this.audioMap[key] = audio;
        });
    },

    render() {

        const container = document.getElementById("ambientControls");
        if (!container) return;

        container.innerHTML = Object.keys(this.sounds)
            .map(key => `
                <button class="ambient-btn"
                    data-key="${key}">
                    ${this.sounds[key].label}
                </button>
            `).join("");

        container.querySelectorAll(".ambient-btn")
            .forEach(btn => {
                btn.addEventListener("click", () => {
                    this.toggle(btn.dataset.key);
                });
            });
    },

    toggle(key) {

        // Se clicar no mesmo → para
        if (this.currentKey === key) {
            this.audioMap[key].pause();
            this.currentKey = null;
            this.updateActive();
            return;
        }

        // Para o anterior
        if (this.currentKey) {
            this.audioMap[this.currentKey].pause();
        }

        // Toca o novo
        const audio = this.audioMap[key];

        audio.currentTime = 0;

        audio.play().catch(err => {
            console.log("Autoplay bloqueado:", err);
        });

        this.currentKey = key;
        this.updateActive();
    },

    updateActive() {
        document.querySelectorAll(".ambient-btn")
            .forEach(btn => {
                btn.classList.remove("active-ambient");
                if (btn.dataset.key === this.currentKey) {
                    btn.classList.add("active-ambient");
                }
            });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    Ambient.init();
});