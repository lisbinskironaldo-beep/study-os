/* =====================================================
   AMBIENT SOUND SYSTEM
===================================================== */

const Ambient = {

    sounds: {
        rain: {
            label: "🌧 Chuva",
            src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_7bdf7d6e0c.mp3"
        },
        cafe: {
            label: "☕ Café",
            src: "https://cdn.pixabay.com/download/audio/2022/02/23/audio_9d0e6c50c2.mp3"
        },
        white: {
            label: "🌫 White Noise",
            src: "https://cdn.pixabay.com/download/audio/2022/03/24/audio_67f60f0c8e.mp3"
        }
    },

    currentAudio: null,

    init() {
        this.render();
    },

    render() {

        const container = document.getElementById("ambientControls");
        if (!container) return;

        container.innerHTML = Object.keys(this.sounds)
            .map(key => `
                <button class="ambient-btn"
                    onclick="Ambient.toggle('${key}')">
                    ${this.sounds[key].label}
                </button>
            `).join("");
    },

    toggle(key) {

        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }

        const sound = this.sounds[key];

        const audio = new Audio(sound.src);
        audio.loop = true;
        audio.volume = 0.3;
        audio.play();

        this.currentAudio = audio;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    Ambient.init();
});